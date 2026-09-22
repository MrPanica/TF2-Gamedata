#!/usr/bin/env python3
"""Discover candidate Linux byte-patterns from matching TF2 ELF binaries.

This intentionally reports candidates separately from the source GameData. A
candidate is promoted only after the target build and uniqueness are reviewed.
"""

from __future__ import annotations

import argparse
import json
import re
from dataclasses import dataclass
from pathlib import Path

import cxxfilt
from capstone import CS_ARCH_X86, CS_GRP_JUMP, CS_MODE_32, CS_MODE_64, Cs
from capstone.x86_const import (
    X86_INS_CALL,
    X86_INS_JMP,
    X86_OP_MEM,
    X86_REG_EIP,
    X86_REG_RIP,
)
from elftools.elf.elffile import ELFFile


ARCHES = ("linux", "linux64")
LIBRARIES = ("engine", "server")
WINDOWS = (16, 24, 32, 48, 64, 96, 128)


@dataclass(frozen=True)
class FunctionSymbol:
    name: str
    address: int
    size: int
    file_offset: int


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--index", required=True, type=Path)
    parser.add_argument("--engine32", required=True, type=Path)
    parser.add_argument("--engine64", required=True, type=Path)
    parser.add_argument("--server32", required=True, type=Path)
    parser.add_argument("--server64", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    return parser.parse_args()


def normalize_name(name: str) -> str:
    return re.sub(r"\s+", " ", name.strip())


def strip_source_suffix(name: str) -> str:
    return normalize_name(name.split(" [", 1)[0])


def function_stem(name: str) -> str:
    """Return class/namespace plus method name, ignoring ABI parameters."""
    return normalize_name(name.split("(", 1)[0])


def demangle(symbol: str) -> str:
    try:
        return normalize_name(cxxfilt.demangle(symbol, external_only=False))
    except (cxxfilt.InvalidName, ValueError, TypeError):
        return ""


def section_file_offset(elf: ELFFile, address: int) -> int | None:
    for section in elf.iter_sections():
        start = int(section["sh_addr"])
        end = start + int(section["sh_size"])
        flags = int(section["sh_flags"])
        if start <= address < end and flags & 0x4:
            return int(section["sh_offset"]) + address - start
    return None


def load_symbols(path: Path) -> tuple[bytes, dict[str, FunctionSymbol], int]:
    data = path.read_bytes()
    with path.open("rb") as handle:
        elf = ELFFile(handle)
        symbols: dict[str, FunctionSymbol] = {}
        for section in elf.iter_sections():
            if section["sh_type"] not in ("SHT_SYMTAB", "SHT_DYNSYM"):
                continue
            for symbol in section.iter_symbols():
                if symbol["st_info"]["type"] != "STT_FUNC":
                    continue
                address = int(symbol["st_value"])
                size = int(symbol["st_size"])
                if not symbol.name or address == 0 or size < 8:
                    continue
                file_offset = section_file_offset(elf, address)
                if file_offset is None or file_offset >= len(data):
                    continue
                candidate = FunctionSymbol(symbol.name, address, size, file_offset)
                previous = symbols.get(symbol.name)
                if previous is None or candidate.size > previous.size:
                    symbols[symbol.name] = candidate
        elf_class = int(elf.elfclass)
    return data, symbols, elf_class


def relocation_offsets(path: Path, elf_class: int) -> set[int]:
    offsets: set[int] = set()
    with path.open("rb") as handle:
        elf = ELFFile(handle)
        width = 8 if elf_class == 64 else 4
        for section in elf.iter_sections():
            if section["sh_type"] not in ("SHT_REL", "SHT_RELA"):
                continue
            target = elf.get_section(section["sh_info"])
            if target is None or not (int(target["sh_flags"]) & 0x4):
                continue
            for relocation in section.iter_relocations():
                offsets.update(range(int(relocation["r_offset"]), int(relocation["r_offset"]) + width))
    return offsets


def make_mask(code: bytes, address: int, elf_class: int, relocations: set[int]) -> list[bool]:
    mask = [True] * len(code)
    mode = CS_MODE_64 if elf_class == 64 else CS_MODE_32
    disassembler = Cs(CS_ARCH_X86, mode)
    disassembler.detail = True
    for instruction in disassembler.disasm(code, address):
        start = instruction.address - address
        if start >= len(code):
            break
        if instruction.id in (X86_INS_CALL, X86_INS_JMP) or instruction.group(CS_GRP_JUMP):
            if instruction.imm_size:
                for index in range(instruction.imm_offset, instruction.imm_offset + instruction.imm_size):
                    if 0 <= start + index < len(mask):
                        mask[start + index] = False
        for operand in instruction.operands:
            if operand.type != X86_OP_MEM:
                continue
            if operand.mem.base in (X86_REG_RIP, X86_REG_EIP, 0) and instruction.disp_size:
                for index in range(instruction.disp_offset, instruction.disp_offset + instruction.disp_size):
                    if 0 <= start + index < len(mask):
                        mask[start + index] = False
    for relocation in relocations:
        index = relocation - address
        if 0 <= index < len(mask):
            mask[index] = False
    return mask


def pattern_text(code: bytes, mask: list[bool]) -> str:
    return "".join(f"\\x{byte:02X}" if keep else "\\x2A" for byte, keep in zip(code, mask))


def count_matches(data: bytes, code: bytes, mask: list[bool]) -> int:
    if not code or len(code) > len(data):
        return 0
    run_start = 0
    run_length = 0
    best_start = 0
    best_length = 0
    for index, fixed in enumerate(mask):
        if fixed:
            if run_length == 0:
                run_start = index
            run_length += 1
            if run_length > best_length:
                best_start, best_length = run_start, run_length
        else:
            run_length = 0
    if best_length < 3:
        return sum(
            all(not fixed or data[offset + index] == code[index] for index, fixed in enumerate(mask))
            for offset in range(len(data) - len(code) + 1)
        )
    needle = code[best_start : best_start + best_length]
    matches = 0
    cursor = data.find(needle)
    while cursor >= 0:
        offset = cursor - best_start
        if offset >= 0 and offset + len(code) <= len(data):
            if all(not fixed or data[offset + index] == code[index] for index, fixed in enumerate(mask)):
                matches += 1
        cursor = data.find(needle, cursor + 1)
    return matches


def choose_pattern(data: bytes, symbol: FunctionSymbol, elf_class: int, relocations: set[int]) -> dict | None:
    available = min(symbol.size, len(data) - symbol.file_offset, WINDOWS[-1])
    if available < WINDOWS[0]:
        return None
    full_code = data[symbol.file_offset : symbol.file_offset + available]
    full_mask = make_mask(full_code, symbol.address, elf_class, relocations)
    for length in WINDOWS:
        if length > available:
            break
        code = full_code[:length]
        mask = full_mask[:length]
        fixed = sum(mask)
        if fixed < 8:
            continue
        matches = count_matches(data, code, mask)
        if matches == 1:
            return {"pattern": pattern_text(code, mask), "length": length, "fixedBytes": fixed, "matches": matches}
    return {
        "pattern": pattern_text(full_code, full_mask),
        "length": available,
        "fixedBytes": sum(full_mask),
        "matches": count_matches(data, full_code, full_mask),
    }


def main() -> None:
    args = parse_args()
    index = json.loads(args.index.read_text(encoding="utf-8"))
    binary_paths = {
        ("engine", "linux"): args.engine32,
        ("engine", "linux64"): args.engine64,
        ("server", "linux"): args.server32,
        ("server", "linux64"): args.server64,
    }
    loaded = {}
    for key, path in binary_paths.items():
        data, symbols, elf_class = load_symbols(path)
        loaded[key] = {
            "path": str(path),
            "data": data,
            "symbols": symbols,
            "elfClass": elf_class,
            "relocations": relocation_offsets(path, elf_class),
            "demangled": {},
            "demangledStems": {},
        }
        for symbol_name in symbols:
            value = demangle(symbol_name)
            if value:
                loaded[key]["demangled"].setdefault(value, []).append(symbol_name)
                loaded[key]["demangledStems"].setdefault(function_stem(value), []).append(symbol_name)

    candidates = []
    stats = {"missingSourceSignatures": 0, "matchedByOtherArch": 0, "matchedByDemangledName": 0, "unique": 0, "ambiguous": 0, "notFound": 0}
    for entry in index["entries"]:
        for platform in ARCHES:
            signature = entry.get(platform)
            if signature is not None:
                continue
            stats["missingSourceSignatures"] += 1
            key = (entry["library"], platform)
            other = entry.get("linux64" if platform == "linux" else "linux")
            symbol_names = []
            method = ""
            if other and other.get("kind") == "symbol":
                symbol_names = [other["value"].lstrip("@").strip()]
                method = "other-architecture-symbol"
                stats["matchedByOtherArch"] += 1
            if not symbol_names:
                wanted = strip_source_suffix(entry["name"])
                symbol_names = loaded[key]["demangled"].get(wanted, [])
                if symbol_names:
                    method = "demangled-name"
                    stats["matchedByDemangledName"] += 1
            if not symbol_names:
                wanted = function_stem(strip_source_suffix(entry["name"]))
                symbol_names = loaded[key]["demangledStems"].get(wanted, [])
                if symbol_names:
                    method = "demangled-function-stem"
                    stats["matchedByDemangledName"] += 1
            if not symbol_names:
                stats["notFound"] += 1
                continue
            resolved_names = [
                symbol_name
                for symbol_name in symbol_names
                if symbol_name in loaded[key]["symbols"]
            ]
            if not resolved_names:
                for symbol_name in symbol_names:
                    demangled = demangle(symbol_name)
                    if not demangled:
                        continue
                    stem = function_stem(demangled)
                    resolved_names.extend(loaded[key]["demangledStems"].get(stem, []))
                if resolved_names and method == "other-architecture-symbol":
                    method = "other-architecture-function-stem"
            for symbol_name in resolved_names[:4]:
                symbol = loaded[key]["symbols"].get(symbol_name)
                if symbol is None:
                    continue
                result = choose_pattern(loaded[key]["data"], symbol, loaded[key]["elfClass"], loaded[key]["relocations"])
                if result is None:
                    continue
                result.update({
                    "entryId": entry["id"],
                    "name": entry["name"],
                    "library": entry["library"],
                    "platform": platform,
                    "source": f"{entry['sourceFile']}:{entry['sourceLine']}",
                    "binary": loaded[key]["path"],
                    "elfClass": loaded[key]["elfClass"],
                    "symbol": symbol_name,
                    "address": hex(symbol.address),
                    "symbolSize": symbol.size,
                    "matchMethod": method,
                })
                candidates.append(result)
                if result["matches"] == 1:
                    stats["unique"] += 1
                else:
                    stats["ambiguous"] += 1

    report = {
        "description": "Candidates only; not merged into source GameData automatically.",
        "binaries": {f"{library}-{platform}": str(path) for (library, platform), path in binary_paths.items()},
        "stats": stats,
        "candidates": candidates,
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"stats": stats, "output": str(args.output)}, ensure_ascii=False))


if __name__ == "__main__":
    main()
