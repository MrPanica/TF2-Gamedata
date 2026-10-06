#!/usr/bin/env python3
"""Dump C++ Virtual Method Tables (VTables) and L/W offsets from ELF binaries.

Produces an Asherkin-compatible VTable dump with Linux (L) and Windows (W)
indices for SourceMod GameData and DHooks development.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import struct
import subprocess
import sys
import time
from pathlib import Path


def get_short_name(name: str) -> str:
    """Extract member function name without class prefix or argument types."""
    m = re.search(r'::([~a-zA-Z0-9_]+)\(', name)
    return m.group(1) if m else name


def dump_library_vtables(binary_path: Path, lib_name: str) -> dict[str, dict]:
    """Extract VTables from an unstripped ELF binary using nm and binary reading."""
    if not binary_path.exists():
        print(f"[-] Binary not found: {binary_path}", file=sys.stderr)
        return {}

    print(f"[*] Extracting symbols from {binary_path.name} ({lib_name})...")
    start = time.perf_counter()
    p = subprocess.Popen(
        ["nm", "-C", "--defined-only", str(binary_path)],
        stdout=subprocess.PIPE,
        text=True,
    )

    addr_to_name: dict[int, str] = {}
    vt_symbols: dict[str, int] = {}

    for line in p.stdout:
        parts = line.strip().split(" ", 2)
        if len(parts) == 3:
            try:
                addr = int(parts[0], 16)
            except ValueError:
                continue
            kind = parts[1]
            name = parts[2]
            if kind in ("r", "R", "d", "D") and name.startswith("vtable for "):
                vt_symbols[name[11:]] = addr
            elif kind.upper() in ("T", "W"):
                addr_to_name[addr] = name
    p.wait()

    print(f"    Found {len(vt_symbols)} vtables in {lib_name}. Extracting entries...")
    classes_data: dict[str, dict] = {}

    with open(binary_path, "rb") as f:
        for class_name, vt_addr in vt_symbols.items():
            f.seek(vt_addr + 8)  # Skip offset-to-top (4) and RTTI typeinfo pointer (4)
            funcs: list[str] = []

            for _ in range(1200):
                data = f.read(4)
                if len(data) < 4:
                    break
                ptr = struct.unpack("<I", data)[0]
                if ptr not in addr_to_name:
                    break
                funcs.append(addr_to_name[ptr])

            if not funcs:
                continue

            vtable_rows: list[list] = []
            windows_idx = 0

            for l_idx, name in enumerate(funcs):
                is_destructor = "::~" in name
                if is_destructor:
                    if l_idx > 0 and name == funcs[l_idx - 1]:
                        # GCC emits two destructors (complete and deleting).
                        # MSVC emits only one virtual deleting destructor. Skip on Windows.
                        vtable_rows.append([None, name])
                        continue
                    else:
                        vtable_rows.append([windows_idx, name])
                        windows_idx += 1
                        continue

                short_name = get_short_name(name)
                prev_overloads = 0
                while (l_idx - (1 + prev_overloads)) >= 0:
                    prev_fn = funcs[l_idx - (1 + prev_overloads)]
                    if "::~" in prev_fn or get_short_name(prev_fn) != short_name:
                        break
                    prev_overloads += 1

                next_overloads = 0
                while (l_idx + 1 + next_overloads) < len(funcs):
                    next_fn = funcs[l_idx + 1 + next_overloads]
                    if "::~" in next_fn or get_short_name(next_fn) != short_name:
                        break
                    next_overloads += 1

                # MSVC reverses declaration order of overloaded virtual methods
                w_disp = windows_idx - prev_overloads + next_overloads
                vtable_rows.append([w_disp, name])
                windows_idx += 1

            classes_data[class_name] = {
                "library": lib_name,
                "methods": vtable_rows,
            }

    duration = time.perf_counter() - start
    print(f"    Parsed {len(classes_data)} classes for {lib_name} in {duration:.2f}s.")
    return classes_data


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--server", type=Path, default=Path("/var/lib/pterodactyl/mounts/tf2_full/tf/bin/server_srv.so"),
                        help="Path to 32-bit server_srv.so")
    parser.add_argument("--engine", type=Path, default=Path("/var/lib/pterodactyl/mounts/tf2_full/bin/engine_srv.so"),
                        help="Path to 32-bit engine_srv.so")
    parser.add_argument("--out", type=Path, default=Path(__file__).resolve().parents[1] / "artifacts" / "tf2-vtables.json",
                        help="Output JSON path")
    args = parser.parse_args()

    server_classes = dump_library_vtables(args.server, "server") if args.server.exists() else {}
    engine_classes = dump_library_vtables(args.engine, "engine") if args.engine.exists() else {}

    all_classes: dict[str, dict] = {}
    all_classes.update(server_classes)
    for k, v in engine_classes.items():
        if k not in all_classes:
            all_classes[k] = v

    out_path = args.out
    out_path.parent.mkdir(parents=True, exist_ok=True)

    payload = {
        "updatedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "totalClasses": len(all_classes),
        "classes": all_classes,
    }

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, separators=(",", ":"))

    sz = out_path.stat().st_size
    print(f"[+] Dumped {len(all_classes)} classes to {out_path} ({sz / (1024*1024):.2f} MB)")


if __name__ == "__main__":
    main()
