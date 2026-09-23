#!/usr/bin/env python3
"""Verify TF2 Classified Linux x64 GameData symbols against ELF binaries."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
from dataclasses import dataclass
from pathlib import Path

from itanium_demangler import parse as parse_itanium_symbol
from elftools.elf.elffile import ELFFile


@dataclass(frozen=True)
class Function:
    name: str
    address: int
    size: int
    file_offset: int
    exported: bool


@dataclass(frozen=True)
class GameDataEntry:
    name: str
    library: str
    symbol: str
    source_file: str
    source_line: int


def args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--engine-gamedata", required=True, type=Path)
    parser.add_argument("--server-gamedata", required=True, type=Path)
    parser.add_argument("--supplemental-gamedata", action="append", default=[], type=Path)
    parser.add_argument("--engine", required=True, type=Path)
    parser.add_argument("--server", required=True, type=Path)
    parser.add_argument("--source-revision", required=True)
    parser.add_argument("--binary-build", required=True)
    parser.add_argument("--output-dir", required=True, type=Path)
    return parser.parse_args()


def unescape_key(value: str) -> str:
    return value.replace('\\"', '"').replace("\\\\", "\\")


def parse_gamedata_text(text: str, source_file: str = "<memory>") -> list[GameDataEntry]:
    if text.startswith("\ufeff"):
        raise ValueError("Unexpected UTF-8 BOM in Classified GameData")

    entries: list[GameDataEntry] = []
    current: dict[str, str | int] | None = None

    def flush() -> None:
        if current is None:
            return
        library = str(current.get("library", ""))
        value = str(current.get("linux64", ""))
        if not library or not value:
            return
        if not value.startswith("@"):
            raise ValueError(
                f"{source_file}:{current['source_line']}: expected an ELF symbol "
                "for Classified Linux x64 extraction"
            )
        entries.append(GameDataEntry(
            name=str(current["name"]),
            library=library,
            symbol=value[1:],
            source_file=source_file,
            source_line=int(current["source_line"]),
        ))

    for line_number, line in enumerate(text.splitlines(), start=1):
        name_match = re.match(r'^(?: {12,}|\t{3,})"((?:\\.|[^"])*)"\s*$', line)
        if name_match:
            flush()
            current = {"name": unescape_key(name_match.group(1)), "source_line": line_number}
            continue
        if current is None:
            continue
        key_value = re.match(r'^\s*"(library|linux64)"\s+"((?:\\.|[^"])*)"\s*$', line)
        if key_value:
            key, value = key_value.groups()
            current[key] = unescape_key(value)

    flush()
    return entries


def read_gamedata(path: Path) -> tuple[list[GameDataEntry], dict]:
    raw = path.read_bytes()
    entries = parse_gamedata_text(raw.decode("utf-8", errors="strict"), path.name)
    return entries, {"file": path.name, "sha256": hashlib.sha256(raw).hexdigest(), "entries": len(entries)}


def read_elf(path: Path) -> tuple[bytes, dict[str, list[Function]], dict]:
    data = path.read_bytes()
    functions: dict[str, list[Function]] = {}
    has_symbol_table = False
    with path.open("rb") as handle:
        elf = ELFFile(handle)
        if elf.elfclass != 64 or elf["e_machine"] != "EM_X86_64":
            raise ValueError(f"Expected a Linux x64 ELF binary: {path}")
        sections = list(elf.iter_sections())
        for section in sections:
            if section["sh_type"] not in ("SHT_DYNSYM", "SHT_SYMTAB"):
                continue
            has_symbol_table |= section["sh_type"] == "SHT_SYMTAB"
            for symbol in section.iter_symbols():
                if symbol["st_info"]["type"] != "STT_FUNC" or not symbol.name:
                    continue
                section_index = symbol["st_shndx"]
                if isinstance(section_index, str):
                    continue
                target = elf.get_section(int(section_index))
                if target is None or not (int(target["sh_flags"]) & 0x4):
                    continue
                address = int(symbol["st_value"])
                target_start = int(target["sh_addr"])
                target_end = target_start + int(target["sh_size"])
                if address == 0 or not (target_start <= address < target_end):
                    continue
                file_offset = int(target["sh_offset"]) + address - target_start
                if file_offset >= len(data):
                    continue
                exported = (
                    section["sh_type"] == "SHT_DYNSYM"
                    and symbol["st_info"]["bind"] in ("STB_GLOBAL", "STB_WEAK", "STB_GNU_UNIQUE")
                    and symbol["st_other"]["visibility"] in ("STV_DEFAULT", "STV_PROTECTED")
                )
                candidate = Function(symbol.name, address, int(symbol["st_size"]), file_offset, exported)
                matches = functions.setdefault(symbol.name, [])
                same_address = next((index for index, item in enumerate(matches) if item.address == address), None)
                if same_address is None:
                    matches.append(candidate)
                elif candidate.exported or candidate.size > matches[same_address].size:
                    matches[same_address] = candidate

    symbol_count = sum(len(matches) for matches in functions.values())
    metadata = {
        "file": path.name,
        "sha256": hashlib.sha256(data).hexdigest(),
        "elfClass": 64,
        "machine": "EM_X86_64",
        "hasStaticSymbolTable": has_symbol_table,
        "functionSymbols": symbol_count,
        "uniqueSymbolNames": len(functions),
        "exportedFunctions": sum(any(item.exported for item in matches) for matches in functions.values()),
        "ambiguousSymbolNames": sum(len({item.address for item in matches}) > 1 for matches in functions.values()),
    }
    return data, functions, metadata


def demangle_symbol(symbol: str) -> str | None:
    try:
        result = parse_itanium_symbol(symbol)
    except (ValueError, TypeError, RecursionError, NotImplementedError):
        return None
    return str(result) if result else None


def normalize_demangled_name(name: str) -> str:
    return re.sub(r"\s+", " ", name).strip()


def best_function(functions: list[Function]) -> Function:
    return sorted(functions, key=lambda item: (not item.exported, -item.size, item.name))[0]


def build_demangled_index(functions: dict[str, list[Function]]) -> dict[str, dict[int, list[Function]]]:
    index: dict[str, dict[int, list[Function]]] = {}
    for candidates in functions.values():
        for function in candidates:
            readable = demangle_symbol(function.name)
            if readable is None:
                continue
            by_address = index.setdefault(normalize_demangled_name(readable), {})
            by_address.setdefault(function.address, []).append(function)
    return index


def resolve_demangled_function(
    demangled_name: str,
    index: dict[str, dict[int, list[Function]]],
) -> Function | None:
    candidates = index.get(normalize_demangled_name(demangled_name), {})
    if len(candidates) != 1:
        return None
    return best_function(next(iter(candidates.values())))


def resolve_function(
    entry: GameDataEntry,
    functions: dict[str, list[Function]],
    demangled_index: dict[str, dict[int, list[Function]]],
) -> tuple[Function | None, str]:
    exact = functions.get(entry.symbol, [])
    if exact:
        if len({function.address for function in exact}) != 1:
            return None, "ambiguous-symbol"
        return best_function(exact), "exact-symbol"

    readable = demangle_symbol(entry.symbol)
    if readable is None:
        return None, "unreadable-source-symbol"
    resolved = resolve_demangled_function(readable, demangled_index)
    if resolved is None:
        return None, "no-unique-full-signature-match"
    return resolved, "demangled-symbol"


def symbol_signature(function: Function | None) -> str | None:
    return f"@{function.name}" if function is not None else None


def escape_key(value: str) -> str:
    return value.replace("\\", "\\\\").replace('"', '\\"').replace("\n", " ")


def write_gamedata(path: Path, library: str, records: list[tuple[str, str]]) -> int:
    names: set[str] = set()
    rows = []
    for name, value in sorted(records, key=lambda item: (item[0].casefold(), item[0], item[1])):
        if name in names:
            raise ValueError(f"Duplicate GameData name in {library}: {name}")
        names.add(name)
        rows.extend((
            f'\t\t\t"{escape_key(name)}"',
            "\t\t\t{",
            f'\t\t\t\t"library"\t"{library}"',
            f'\t\t\t\t"linux64"\t"{value}"',
            "\t\t\t}",
        ))

    text = "\n".join((
        "/* Verified TF2 Classified Linux x64 ELF symbols; see the audit JSON for source and binary hashes. */",
        '"Games"',
        "{",
        '\t"tf2classified"',
        "\t{",
        '\t\t"Signatures"',
        "\t\t{",
        *rows,
        "\t\t}",
        "\t}",
        "}",
        "",
    ))
    path.write_text(text, encoding="utf-8", newline="\n")
    return len(records)


def extract_library(
    library: str,
    sources: list[Path],
    binary: Path,
    output_dir: Path,
) -> tuple[dict, list[dict], list[dict]]:
    entries: list[GameDataEntry] = []
    source_metadata = []
    for source in sources:
        parsed, metadata = read_gamedata(source)
        wrong_libraries = sorted({entry.library for entry in parsed if entry.library != library})
        if wrong_libraries:
            raise ValueError(f"{source} contains unexpected libraries: {', '.join(wrong_libraries)}")
        entries.extend(parsed)
        source_metadata.append(metadata)

    data, functions, binary_metadata = read_elf(binary)
    demangled_index = build_demangled_index(functions)
    records: list[tuple[str, str]] = []
    unresolved: list[dict] = []
    remapped: list[dict] = []
    stats = {
        "sourceEntries": len(entries),
        "resolvedExactSymbols": 0,
        "resolvedByFullDemangledName": 0,
        "unresolvedEntries": 0,
        "exportedSymbols": 0,
        "internalSymbols": 0,
    }
    seen_names: set[str] = set()
    for entry in entries:
        if entry.name in seen_names:
            raise ValueError(f"Duplicate GameData name in {entry.source_file}:{entry.source_line}: {entry.name}")
        seen_names.add(entry.name)
        function, method = resolve_function(entry, functions, demangled_index)
        if function is None:
            stats["unresolvedEntries"] += 1
            unresolved.append({
                "name": entry.name,
                "library": entry.library,
                "requestedSymbol": entry.symbol,
                "sourceFile": entry.source_file,
                "sourceLine": entry.source_line,
                "reason": method,
            })
            continue

        signature = symbol_signature(function)
        assert signature is not None
        records.append((entry.name, signature))
        if method == "exact-symbol":
            stats["resolvedExactSymbols"] += 1
        else:
            stats["resolvedByFullDemangledName"] += 1
            remapped.append({
                "name": entry.name,
                "requestedSymbol": entry.symbol,
                "resolvedSymbol": function.name,
                "sourceFile": entry.source_file,
                "sourceLine": entry.source_line,
            })
        if function.exported:
            stats["exportedSymbols"] += 1
        else:
            stats["internalSymbols"] += 1

    output = output_dir / f"tf2c.binary.{library}.txt"
    stats["writtenSignatures"] = write_gamedata(output, library, records)
    binary_metadata.update(stats)
    binary_metadata["sourceGameData"] = source_metadata
    return binary_metadata, unresolved, remapped


def main() -> None:
    options = args()
    options.output_dir.mkdir(parents=True, exist_ok=True)
    supplemental = options.supplemental_gamedata
    binaries = {}
    unresolved = []
    remapped = []
    for library, sources, binary in (
        ("engine", [options.engine_gamedata], options.engine),
        ("server", [options.server_gamedata, *supplemental], options.server),
    ):
        metadata, missing, alternate_names = extract_library(library, sources, binary, options.output_dir)
        binaries[library] = metadata
        unresolved.extend(missing)
        remapped.extend(alternate_names)

    total = sum(binary["writtenSignatures"] for binary in binaries.values())
    unresolved_path = options.output_dir / "artifacts" / "tf2c-unresolved-signatures.json"
    unresolved_path.parent.mkdir(parents=True, exist_ok=True)
    unresolved_path.write_text(
        json.dumps({
            "schemaVersion": 1,
            "game": "Team Fortress 2 Classified",
            "platform": "Linux x64",
            "sourceRevision": options.source_revision,
            "binaryBuild": options.binary_build,
            "entries": unresolved,
        }, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
        newline="\n",
    )

    report = {
        "schemaVersion": 4,
        "game": "Team Fortress 2 Classified",
        "target": {"platform": "Linux x64", "binaryBuild": options.binary_build},
        "source": {
            "repository": "https://github.com/MrPanica/TF2C-Gamedata",
            "revision": options.source_revision,
        },
        "signaturePolicy": (
            "Keep an exact ELF symbol when present. Otherwise accept only a unique match of the full "
            "demangled C++ signature and publish the symbol name that actually exists in the target ELF. "
            "Do not guess from function names or emit byte patterns for unresolved functions."
        ),
        "catalogClassification": {
            "entries": total,
            "elfSymbols": total,
            "bytePatterns": 0,
            "linuxX86Entries": 0,
        },
        "resolution": {
            "exactElfSymbols": sum(binary["resolvedExactSymbols"] for binary in binaries.values()),
            "fullDemangledNameMatches": sum(binary["resolvedByFullDemangledName"] for binary in binaries.values()),
            "unresolvedSourceEntries": len(unresolved),
            "alternateElfSymbols": remapped,
            "unresolvedReport": "tf2c-unresolved-signatures.json",
        },
        "binaries": binaries,
    }
    report_path = options.output_dir / "artifacts" / "tf2c-binary-signatures-audit.json"
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")
    print(json.dumps({
        "catalogEntries": total,
        "exactElfSymbols": report["resolution"]["exactElfSymbols"],
        "fullDemangledNameMatches": report["resolution"]["fullDemangledNameMatches"],
        "unresolvedSourceEntries": len(unresolved),
        "audit": str(report_path),
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
