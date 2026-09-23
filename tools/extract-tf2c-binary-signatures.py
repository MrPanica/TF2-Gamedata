#!/usr/bin/env python3
"""Export usable TF2 Classified Linux ELF symbols as SourceMod GameData."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
from dataclasses import dataclass
from pathlib import Path

import cxxfilt
from capstone import CS_ARCH_X86, CS_GRP_JUMP, CS_MODE_32, CS_MODE_64, Cs
from capstone.x86_const import X86_INS_CALL, X86_INS_JMP, X86_OP_MEM, X86_REG_EIP, X86_REG_RIP
from elftools.elf.elffile import ELFFile

PATTERN_LENGTHS = (24,)
MIN_FIXED_BYTES = 16
JUNK_SYMBOL = re.compile(r"(?:\.cold(?:\.|$)|\.isra\.\d+|\.constprop\.\d+|\.clone\.\d+|thunk|@plt)", re.I)


@dataclass(frozen=True)
class Function:
    name: str
    readable: str
    address: int
    size: int
    file_offset: int
    exported: bool


def args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--index", required=True, type=Path)
    parser.add_argument("--engine", required=True, type=Path)
    parser.add_argument("--server", required=True, type=Path)
    parser.add_argument("--engine-reference", type=Path)
    parser.add_argument("--server-reference", type=Path)
    parser.add_argument("--output-dir", required=True, type=Path)
    return parser.parse_args()


def demangle(name: str) -> str:
    try:
        return cxxfilt.demangle(name, external_only=False)
    except (cxxfilt.InvalidName, ValueError, TypeError):
        return name


def normalize_name(name: str) -> str:
    return re.sub(r"\s+", " ", name.split(" [", 1)[0].strip())


def function_stem(name: str) -> str:
    return normalize_name(name).split("(", 1)[0]


def read_elf(path: Path, include_static: bool = True) -> tuple[bytes, dict, list[bytes], int, dict]:
    data = path.read_bytes()
    functions: dict[str, Function] = {}
    executable: list[bytes] = []
    relocations: list[tuple[int, int]] = []
    with path.open("rb") as handle:
        elf = ELFFile(handle)
        if elf.elfclass not in (32, 64) or elf["e_machine"] not in ("EM_386", "EM_X86_64"):
            raise ValueError(f"Unsupported ELF architecture: {path}")
        if elf.elfclass != 64:
            raise ValueError(f"Only Linux x64 ELF binaries found in the supplied Classified archive: {path}")
        sections = list(elf.iter_sections())
        executable_sections = [section for section in sections if int(section["sh_flags"]) & 0x4 and int(section["sh_size"])]
        executable = [data[int(section["sh_offset"]):int(section["sh_offset"]) + int(section["sh_size"])] for section in executable_sections]

        for section in elf.iter_sections():
            if section["sh_type"] not in ("SHT_DYNSYM", "SHT_SYMTAB"):
                continue
            if not include_static and section["sh_type"] != "SHT_DYNSYM":
                continue
            for symbol in section.iter_symbols():
                if symbol["st_info"]["type"] != "STT_FUNC" or not symbol.name:
                    continue
                section_index = symbol["st_shndx"]
                if isinstance(section_index, str) or int(symbol["st_value"]) == 0:
                    continue
                target = elf.get_section(int(section_index))
                if target is None or not (int(target["sh_flags"]) & 0x4):
                    continue
                address = int(symbol["st_value"])
                target_start = int(target["sh_addr"])
                target_end = target_start + int(target["sh_size"])
                file_offset = int(target["sh_offset"]) + address - target_start
                if not (target_start <= address < target_end) or file_offset >= len(data):
                    continue
                exported = (
                    section["sh_type"] == "SHT_DYNSYM"
                    and symbol["st_shndx"] != "SHN_UNDEF"
                    and symbol["st_info"]["bind"] in ("STB_GLOBAL", "STB_WEAK", "STB_GNU_UNIQUE")
                    and symbol["st_other"]["visibility"] in ("STV_DEFAULT", "STV_PROTECTED")
                )
                previous = functions.get(symbol.name)
                candidate = Function(symbol.name, demangle(symbol.name), address, int(symbol["st_size"]), file_offset, exported)
                if previous is None or (candidate.exported and not previous.exported) or candidate.size > previous.size:
                    functions[symbol.name] = candidate

        if include_static:
            for section in sections:
                if section["sh_type"] not in ("SHT_REL", "SHT_RELA"):
                    continue
                target = elf.get_section(int(section["sh_info"]))
                if target is None or not (int(target["sh_flags"]) & 0x4):
                    continue
                for relocation in section.iter_relocations():
                    reloc_type = int(relocation["r_info_type"])
                    width = 8 if reloc_type in (1, 8, 17, 18, 23, 24) else 4
                    relocations.append((int(relocation["r_offset"]), width))

        metadata = {
            "file": path.name,
            "sha256": hashlib.sha256(data).hexdigest(),
            "elfClass": elf.elfclass,
            "machine": elf["e_machine"],
            "functionSymbols": len(functions),
            "exportedFunctions": sum(function.exported for function in functions.values()),
        }
    return data, functions, executable, 64, {"relocations": relocations, "sections": executable_sections}


def escape_key(value: str) -> str:
    return value.replace("\\", "\\\\").replace('"', '\\"').replace("\n", " ")


def make_mask(code: bytes, address: int, elf_class: int, relocations: list[tuple[int, int]]) -> list[bool]:
    mask = [True] * len(code)
    disassembler = Cs(CS_ARCH_X86, CS_MODE_64 if elf_class == 64 else CS_MODE_32)
    disassembler.detail = True
    for instruction in disassembler.disasm(code, address):
        start = instruction.address - address
        if start >= len(mask):
            break
        if instruction.id in (X86_INS_CALL, X86_INS_JMP) or instruction.group(CS_GRP_JUMP):
            for index in range(instruction.imm_offset, instruction.imm_offset + instruction.imm_size):
                if 0 <= start + index < len(mask):
                    mask[start + index] = False
        for operand in instruction.operands:
            if operand.type == X86_OP_MEM and operand.mem.base in (X86_REG_RIP, X86_REG_EIP, 0):
                for index in range(instruction.disp_offset, instruction.disp_offset + instruction.disp_size):
                    if 0 <= start + index < len(mask):
                        mask[start + index] = False
    for offset, width in relocations:
        start = offset - address
        for index in range(start, start + width):
            if 0 <= index < len(mask):
                mask[index] = False
    return mask


def count_matches(sections: list[bytes], code: bytes, mask: list[bool]) -> int:
    best_start = best_length = run_start = run_length = 0
    for index, fixed in enumerate(mask):
        if fixed:
            if not run_length:
                run_start = index
            run_length += 1
            if run_length > best_length:
                best_start, best_length = run_start, run_length
        else:
            run_length = 0
    if best_length < 8:
        return 0
    needle = code[best_start:best_start + best_length]
    matches = 0
    for section in sections:
        cursor = section.find(needle)
        while cursor >= 0:
            start = cursor - best_start
            if start >= 0 and start + len(code) <= len(section) and all(
                not fixed or section[start + index] == code[index]
                for index, fixed in enumerate(mask)
            ):
                matches += 1
                if matches > 1:
                    return matches
            cursor = section.find(needle, cursor + 1)
    return matches


def byte_pattern(data: bytes, function: Function, sections: list[bytes], relocations: list[tuple[int, int]]) -> tuple[str, int] | None:
    if function.size < PATTERN_LENGTHS[0] or JUNK_SYMBOL.search(function.name):
        return None
    available = min(function.size, PATTERN_LENGTHS[-1], len(data) - function.file_offset)
    code = data[function.file_offset:function.file_offset + available]
    mask = make_mask(code, function.address, 64, relocations)
    # SourceMod uses \x2A as its wildcard token, so a literal 0x2A cannot
    # remain fixed in the emitted pattern and must be treated as a wildcard
    # during the uniqueness check as well.
    mask = [keep and byte != 0x2A for byte, keep in zip(code, mask)]
    for length in PATTERN_LENGTHS:
        if length > available:
            break
        fixed = sum(mask[:length])
        if fixed < MIN_FIXED_BYTES:
            continue
        candidate = code[:length]
        candidate_mask = mask[:length]
        if count_matches(sections, candidate, candidate_mask) != 1:
            continue
        value = "".join(f"\\x{byte:02X}" if keep else "\\x2A" for byte, keep in zip(candidate, candidate_mask))
        return value, fixed
    return None


def write_gamedata(path: Path, library: str, records: list[tuple[str, str]], excluded: set[str]) -> int:
    rows = []
    seen_values: set[str] = set()
    used_names: set[str] = set()
    for name, value in sorted(records, key=lambda item: (item[0].casefold(), item[1])):
        if value in excluded or value in seen_values:
            continue
        if name in used_names:
            identity = hashlib.sha256(value.encode("utf-8")).hexdigest()[:10]
            name = f"{name} [signature {identity}]"
        used_names.add(name)
        seen_values.add(value)
        rows.extend((f'\t\t\t"{escape_key(name)}"', "\t\t\t{", f'\t\t\t\t"library"\t"{library}"', f'\t\t\t\t"linux64"\t"{value}"', "\t\t\t}"))

    text = "\n".join((
        f"\t/* Exported ELF symbols from Classified {library} binary; SHA-256 in audit JSON. */",
        '\t"tf2classified"',
        "\t{",
        '\t\t"Signatures"',
        "\t\t{",
        *rows,
        "\t\t}",
        "\t}",
        "",
    ))
    path.write_text(text, encoding="utf-8", newline="\n")
    return len(seen_values)


def main() -> None:
    options = args()
    index = json.loads(options.index.read_text(encoding="utf-8"))
    existing = {
        (entry["library"], signature["value"])
        for entry in index["entries"]
        if entry.get("game") == "tf2c"
        for platform in ("linux", "linux64")
        if (signature := entry.get(platform)) is not None
    }
    options.output_dir.mkdir(parents=True, exist_ok=True)
    metadata = {}
    totals = {}
    source_entries = [entry for entry in index["entries"] if entry.get("game") == "tf2"]
    references = {}
    for library, path in (("engine", options.engine_reference), ("server", options.server_reference)):
        if path is None:
            continue
        ref_data, ref_functions, ref_sections, _, ref_aux = read_elf(path, include_static=False)
        references[library] = (ref_data, ref_functions, ref_sections, ref_aux)
        metadata[f"{library}Reference"] = {"file": path.name, "sha256": hashlib.sha256(ref_data).hexdigest()}

    for library, binary in (("engine", options.engine), ("server", options.server)):
        data, functions, executable, elf_class, aux = read_elf(binary)
        metadata[library] = {"file": binary.name, "sha256": hashlib.sha256(data).hexdigest(), "elfClass": elf_class, "machine": "EM_X86_64", "functionSymbols": len(functions)}
        records = []
        exported = {name: function for name, function in functions.items() if function.exported}
        reference_symbols = references[library][1] if library in references else None
        for name, function in exported.items():
            if reference_symbols is not None and name not in reference_symbols:
                continue
            records.append((function.readable or name, f"@{name}"))

        symbol_values = {value for record_name, value in records}
        existing_names = {entry["name"] for entry in index["entries"] if entry.get("game") == "tf2c" and entry.get("library") == library}
        anchors = {entry["name"]: entry for entry in source_entries if entry.get("library") == library}
        by_demangled: dict[str, list[Function]] = {}
        by_stem: dict[str, list[Function]] = {}
        for function in functions.values():
            by_demangled.setdefault(normalize_name(function.readable), []).append(function)
            by_stem.setdefault(function_stem(function.readable), []).append(function)
        # Deduplicate aliases when resolving a readable GameData name.
        by_demangled = {key: list({item.address: item for item in values}.values()) for key, values in by_demangled.items()}
        by_stem = {key: list({item.address: item for item in values}.values()) for key, values in by_stem.items()}
        pattern_stats = {"anchors": 0, "symbolMatches": 0, "patterns": 0, "missing": 0, "ambiguous": 0, "notUnique": 0, "incompatibleReference": 0}
        for name, entry in anchors.items():
            if name in existing_names:
                continue
            pattern_stats["anchors"] += 1
            if pattern_stats["anchors"] % 1000 == 0:
                print(f"{library}: checked {pattern_stats['anchors']} GameData names; {pattern_stats['patterns']} byte-patterns", flush=True)
            candidates = []
            for platform in ("linux64", "linux"):
                signature = entry.get(platform)
                if signature and signature.get("kind") == "symbol" and signature["value"].startswith("@"):
                    function = functions.get(signature["value"][1:])
                    if function:
                        candidates.append(function)
            if not candidates:
                readable_names = [normalize_name(entry["name"])]
                readable_names.extend(
                    normalize_name(demangle(signature["value"][1:]))
                    for platform in ("linux64", "linux")
                    if (signature := entry.get(platform)) and signature.get("kind") == "symbol" and signature["value"].startswith("@")
                )
                for readable in readable_names:
                    exact = by_demangled.get(readable, [])
                    if exact:
                        candidates = exact
                        break
                    stem = by_stem.get(function_stem(readable), [])
                    if len(stem) == 1:
                        candidates = stem
                        break
                    if len(stem) > 1:
                        candidates = stem
                        break
            candidates = list({(item.name, item.address): item for item in candidates}.values())
            if len(candidates) != 1:
                pattern_stats["ambiguous" if candidates else "missing"] += 1
                continue
            function = candidates[0]
            if function.exported:
                pattern_stats["symbolMatches"] += 1
                continue
            found = byte_pattern(data, function, executable, aux["relocations"])
            if found is None:
                pattern_stats["notUnique"] += 1
                continue
            value, fixed_bytes = found
            if library in references:
                parsed = bytes(int(part, 16) for part in re.findall(r"\\x([0-9A-F]{2})", value))
                mask = [part != "2A" for part in re.findall(r"\\x([0-9A-F]{2})", value)]
                if count_matches(references[library][2], parsed, mask) != 1:
                    pattern_stats["incompatibleReference"] += 1
                    continue
            if value not in symbol_values and (library, value) not in existing:
                records.append((name, value))
                symbol_values.add(value)
                pattern_stats["patterns"] += 1

        output = options.output_dir / f"tf2c.binary.{library}.txt"
        totals[library] = write_gamedata(output, library, records, {value for owner, value in existing if owner == library})
        metadata[library].update({"exportedFunctions": len(exported), "writtenSignatures": totals[library], "sourceGameDataMatches": pattern_stats})

    report = {"schemaVersion": 1, "source": "TF2 Classified ELF symbols and byte-patterns mapped from TF2 GameData", "binaries": metadata, "writtenSignatures": totals}
    report_path = options.output_dir / "tf2c-binary-signatures-audit.json"
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")
    print(json.dumps({"writtenSignatures": totals, "audit": str(report_path)}, ensure_ascii=False))


if __name__ == "__main__":
    main()
