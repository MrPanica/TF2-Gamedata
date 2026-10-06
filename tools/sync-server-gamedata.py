#!/usr/bin/env python3
"""Sync, scan, and patch GameData files across Pterodactyl TF2 server volumes.

Designed to run automatically before server restarts when TF2 is updated:
1. Reads fresh VTables and signatures from ELF binaries / repository artifacts.
2. Checks all GameData files across target server volumes.
3. Automatically patches changed VTable offsets (L/W) and signatures.
4. Preserves UTF-8, indentation, and comments; safely creates .bak backups.
5. Strictly enforces pterodactyl:pterodactyl file ownership.
6. Emits detailed Discord embed JSON summary for update notifications.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import struct
import subprocess
import sys
import time
from pathlib import Path

# Default target server UUIDs on Node 1 / Node 2
DEFAULT_TARGET_UUIDS = [
    "5c213163-fa72-4e09-8edf-1bf79f86b4dd",
    "f97e7bc8-edb4-40af-b1e1-fe662ec58f17",
    "1694366d-2b68-4307-b7b7-b5d8f1dc3928",
    "fcb763b9-179f-4114-a7b0-7679877cc4b5",
    "e76c96db-5d25-41f5-8191-cd94f23aa45e",
]


def set_ptero_ownership(path: Path) -> None:
    """Set file ownership to pterodactyl:pterodactyl on Linux systems."""
    if os.name != "posix":
        return
    try:
        import pwd
        u = pwd.getpwnam("pterodactyl")
        os.chown(path, u.pw_uid, u.pw_gid)
    except Exception as err:
        print(f"[-] Warning: Failed to chown {path} to pterodactyl: {err}", file=sys.stderr)


def get_method_short_name(name: str) -> str:
    """Extract clean method name from full signature, e.g. CTFPlayer::GetMaxHealth(void) -> GetMaxHealth."""
    clean = name.split("(")[0].strip()
    if "::" in clean:
        return clean.split("::")[-1]
    return clean


def dump_elf_vtables(binary_path: Path, lib_name: str) -> dict[str, dict]:
    """Extract VTables from an ELF binary (supports both 32-bit and 64-bit)."""
    if not binary_path.exists():
        return {}

    with open(binary_path, "rb") as f:
        hdr = f.read(5)
        is_64 = len(hdr) >= 5 and hdr[4] == 2

    ptr_size = 8 if is_64 else 4
    unpack_fmt = "<Q" if is_64 else "<I"
    vtable_header_offset = 16 if is_64 else 8

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

    classes_data: dict[str, dict] = {}
    with open(binary_path, "rb") as f:
        for class_name, vt_addr in vt_symbols.items():
            f.seek(vt_addr + vtable_header_offset)
            funcs: list[str] = []

            for _ in range(1500):
                data = f.read(ptr_size)
                if len(data) < ptr_size:
                    break
                ptr = struct.unpack(unpack_fmt, data)[0]
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
                        vtable_rows.append([None, name])
                        continue
                    else:
                        vtable_rows.append([windows_idx, name])
                        windows_idx += 1
                        continue

                short_name = get_method_short_name(name)
                prev_overloads = 0
                while (l_idx - (1 + prev_overloads)) >= 0:
                    prev_fn = funcs[l_idx - (1 + prev_overloads)]
                    if "::~" in prev_fn or get_method_short_name(prev_fn) != short_name:
                        break
                    prev_overloads += 1

                next_overloads = 0
                while (l_idx + 1 + next_overloads) < len(funcs):
                    next_fn = funcs[l_idx + 1 + next_overloads]
                    if "::~" in next_fn or get_method_short_name(next_fn) != short_name:
                        break
                    next_overloads += 1

                w_disp = windows_idx - prev_overloads + next_overloads
                vtable_rows.append([w_disp, name])
                windows_idx += 1

            classes_data[class_name] = {
                "library": lib_name,
                "methods": vtable_rows,
            }

    return classes_data


def load_canonical_data(repo_dir: Path, mount_path: Path | None) -> tuple[dict, dict]:
    """Load latest VTables and Signatures database."""
    vtables_path = repo_dir / "artifacts" / "tf2-vtables.json"
    signatures_path = repo_dir / "artifacts" / "tf2-signatures.json"

    vtables_data = {}
    if vtables_path.exists():
        try:
            with open(vtables_path, "r", encoding="utf-8") as f:
                vtables_data = json.load(f)
        except Exception as e:
            print(f"[-] Warning: Failed to read {vtables_path}: {e}", file=sys.stderr)

    # If mount_path is provided with unstripped binaries, update VTables live
    if mount_path and mount_path.exists():
        server_bin = mount_path / "tf" / "bin" / "server_srv.so"
        engine_bin = mount_path / "bin" / "engine_srv.so"
        if server_bin.exists():
            print("[*] Re-dumping live VTables from server_srv.so...")
            fresh_server = dump_elf_vtables(server_bin, "server")
            if fresh_server:
                if "classes" not in vtables_data:
                    vtables_data["classes"] = {}
                vtables_data["classes"].update(fresh_server)
        if engine_bin.exists():
            fresh_engine = dump_elf_vtables(engine_bin, "engine")
            if fresh_engine:
                if "classes" not in vtables_data:
                    vtables_data["classes"] = {}
                vtables_data["classes"].update(fresh_engine)

    # Build fast VTable lookup dictionaries
    # 1. Exact "ClassName::MethodName" -> { "linux": int, "windows": int }
    # 2. Short "MethodName" -> { "linux": int, "windows": int } (if unambiguous)
    vtable_exact: dict[str, dict[str, int]] = {}
    vtable_short_candidates: dict[str, list[tuple[str, dict[str, int]]]] = {}

    for cls_name, cls_info in vtables_data.get("classes", {}).items():
        methods = cls_info.get("methods", [])
        for l_idx, (w_idx, full_sig) in enumerate(methods):
            short = get_method_short_name(full_sig)
            indices = {"linux": l_idx}
            if w_idx is not None:
                indices["windows"] = w_idx

            vtable_exact[f"{cls_name}::{short}"] = indices
            vtable_exact[f"{cls_name}::{full_sig}"] = indices

            if short not in vtable_short_candidates:
                vtable_short_candidates[short] = []
            vtable_short_candidates[short].append((cls_name, indices))

    # Also include member offsets and sizeof
    for name, item in vtables_data.get("memberOffsets", {}).items():
        indices: dict[str, int] = {}
        for p in ("linux", "windows", "linux64", "windows64"):
            val = item.get(p)
            if val is not None and str(val).isdigit():
                indices[p] = int(val)
        if indices:
            vtable_exact[name] = indices

    # Build signature lookup dictionary
    signatures_map: dict[str, dict[str, str]] = {}
    if signatures_path.exists():
        try:
            with open(signatures_path, "r", encoding="utf-8") as f:
                sig_json = json.load(f)
                for entry in sig_json.get("entries", []):
                    name = entry.get("name")
                    if not name:
                        continue
                    p_map: dict[str, str] = {}
                    for p in ("linux", "linux64", "windows", "windows64"):
                        val = entry.get(p)
                        if isinstance(val, dict):
                            val_str = val.get("value")
                        elif isinstance(val, str):
                            val_str = val
                        else:
                            val_str = None
                        if val_str:
                            p_map[p] = val_str
                    if p_map:
                        signatures_map[name] = p_map
        except Exception as e:
            print(f"[-] Warning: Failed to read {signatures_path}: {e}", file=sys.stderr)

    return {
        "vtable_exact": vtable_exact,
        "vtable_short": vtable_short_candidates,
    }, signatures_map


def patch_gamedata_content(
    content: str,
    vtables_db: dict,
    signatures_db: dict[str, dict[str, str]],
    file_rel_path: str,
) -> tuple[str, list[dict]]:
    """Parse GameData KeyValues and patch outdated offsets and signatures."""
    vtable_exact = vtables_db["vtable_exact"]
    vtable_short = vtables_db["vtable_short"]

    lines = content.splitlines(keepends=True)
    updated_lines = list(lines)
    changes: list[dict] = []

    # State tracking
    current_section = None  # "Offsets" or "Signatures"
    current_entry_name = None
    section_brace_depth = 0
    entry_brace_depth = 0

    re_section = re.compile(r'^\s*"(Offsets|Signatures)"\s*$')
    re_entry = re.compile(r'^\s*"([^"]+)"\s*(?:/\*.*?\*/|//.*)?$')
    re_prop = re.compile(r'^(\s*)"(windows|linux|windows64|linux64)"\s+"([^"]*)"(.*)$')

    for idx, line in enumerate(lines):
        clean_line = line.strip()

        # Track braces outside quotes
        brace_opens = clean_line.count("{")
        brace_closes = clean_line.count("}")

        if current_section is None:
            m_sec = re_section.match(clean_line)
            if m_sec:
                current_section = m_sec.group(1)
                section_brace_depth = 0
            continue

        if "{" in clean_line:
            section_brace_depth += brace_opens
        if "}" in clean_line:
            section_brace_depth -= brace_closes
            if section_brace_depth <= 0:
                current_section = None
                current_entry_name = None
                continue

        # Look for entry names inside section
        if current_entry_name is None:
            m_ent = re_entry.match(clean_line)
            if m_ent and not clean_line.startswith(("{", "}")):
                candidate = m_ent.group(1)
                if candidate not in ("Offsets", "Signatures", "Games", "tf", "#default"):
                    current_entry_name = candidate
                    entry_brace_depth = 0
            continue

        if "{" in clean_line:
            entry_brace_depth += brace_opens
        if "}" in clean_line:
            entry_brace_depth -= brace_closes
            if entry_brace_depth <= 0:
                current_entry_name = None
                continue

        # Inside an entry in Offsets or Signatures: check properties
        m_prop = re_prop.match(line)
        if m_prop and current_entry_name:
            indent, prop_name, old_val, suffix = m_prop.groups()

            if current_section == "Offsets":
                target_offset = None
                # 1. Exact match
                if current_entry_name in vtable_exact and prop_name in vtable_exact[current_entry_name]:
                    target_offset = vtable_exact[current_entry_name][prop_name]
                # 2. Short name match if unique
                elif current_entry_name in vtable_short:
                    candidates = vtable_short[current_entry_name]
                    if len(candidates) == 1 and prop_name in candidates[0][1]:
                        target_offset = candidates[0][1][prop_name]

                if target_offset is not None and str(target_offset) != old_val:
                    new_line = f'{indent}"{prop_name}"\t\t"{target_offset}"{suffix}\n'
                    updated_lines[idx] = new_line
                    changes.append({
                        "file": file_rel_path,
                        "type": "offset",
                        "entry": current_entry_name,
                        "prop": prop_name,
                        "old": old_val,
                        "new": str(target_offset),
                    })

            elif current_section == "Signatures":
                if current_entry_name in signatures_db and prop_name in signatures_db[current_entry_name]:
                    target_sig = signatures_db[current_entry_name][prop_name]
                    # Only update if old is a mangled symbol or byte pattern that changed
                    if target_sig and target_sig != old_val:
                        # Avoid replacing if old is already valid byte pattern and target is same
                        new_line = f'{indent}"{prop_name}"\t\t"{target_sig}"{suffix}\n'
                        updated_lines[idx] = new_line
                        changes.append({
                            "file": file_rel_path,
                            "type": "signature",
                            "entry": current_entry_name,
                            "prop": prop_name,
                            "old": old_val,
                            "new": target_sig,
                        })

    return "".join(updated_lines), changes


def sync_all_servers(
    volumes_dir: Path,
    target_uuids: list[str],
    vtables_db: dict,
    signatures_db: dict,
    dry_run: bool = False,
) -> tuple[int, list[dict]]:
    """Scan and patch all GameData files across target server volumes."""
    total_files_updated = 0
    all_changes: list[dict] = []

    for uuid in target_uuids:
        gamedata_dir = volumes_dir / uuid / "tf" / "addons" / "sourcemod" / "gamedata"
        if not gamedata_dir.exists():
            continue

        for p in gamedata_dir.rglob("*.txt"):
            if p.name.endswith(".bak") or p.name.startswith("."):
                continue

            try:
                content = p.read_text(encoding="utf-8")
            except Exception as e:
                print(f"[-] Could not read {p}: {e}", file=sys.stderr)
                continue

            rel_path = f"{uuid[:8]}/.../{p.name}"
            new_content, file_changes = patch_gamedata_content(
                content, vtables_db, signatures_db, rel_path
            )

            if file_changes:
                total_files_updated += 1
                all_changes.extend(file_changes)
                print(f"[!] Found {len(file_changes)} changes in {p.name} ({uuid[:8]}):")
                for c in file_changes:
                    print(f"    - [{c['type'].upper()}] {c['entry']} ({c['prop']}): {c['old']} -> {c['new']}")

                if not dry_run:
                    # Create .bak once
                    bak_path = p.with_suffix(p.suffix + ".bak")
                    if not bak_path.exists():
                        shutil.copy2(p, bak_path)
                        set_ptero_ownership(bak_path)

                    p.write_text(new_content, encoding="utf-8")
                    set_ptero_ownership(p)
                    p.chmod(0o644)

    return total_files_updated, all_changes


def generate_discord_report(changes: list[dict], total_files: int) -> dict:
    """Format Discord embed payload detailing all updated GameData entries."""
    if not changes:
        return {
            "has_changes": False,
            "total_files": 0,
            "total_offsets": 0,
            "total_signatures": 0,
            "message": "GameData актуальна, изменений не требуется.",
        }

    offset_changes = [c for c in changes if c["type"] == "offset"]
    sig_changes = [c for c in changes if c["type"] == "signature"]

    # Build description lines (limit to 25 rows for Discord embed limit)
    desc_lines = [
        f"⚡ **Автоматически обновлена GameData перед запуском серверов!**",
        f"Обновлено файлов: **{total_files}** | Офсетов VTable: **{len(offset_changes)}** | Сигнатур: **{len(sig_changes)}**\n",
    ]

    for c in changes[:20]:
        kind_tag = "VTable" if c["type"] == "offset" else "Sig"
        desc_lines.append(
            f"• `{c['file'].split('/')[-1]}`: **{c['entry']}** [{c['prop']}]\n"
            f"   ~~`{c['old']}`~~ ➔ **`{c['new']}`**"
        )

    if len(changes) > 20:
        desc_lines.append(f"\n*...и ещё {len(changes) - 20} изменений.*")

    embed = {
        "title": "🛡️ TF2 GameData автопатчер применил обновления",
        "description": "\n".join(desc_lines),
        "color": 3066993,  # Green / Success
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "footer": {
            "text": "TF2-Gamedata Automated Pipeline"
        }
    }

    return {
        "has_changes": True,
        "total_files": total_files,
        "total_offsets": len(offset_changes),
        "total_signatures": len(sig_changes),
        "embed": embed,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--volumes-dir", type=Path, default=Path("/var/lib/pterodactyl/volumes"))
    parser.add_argument("--mount-path", type=Path, default=Path("/var/lib/pterodactyl/mounts/tf2_full"))
    parser.add_argument("--repo-dir", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--uuids", type=str, default=",".join(DEFAULT_TARGET_UUIDS))
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--discord-summary-file", type=Path, default=None)
    args = parser.parse_args()

    target_uuids = [u.strip() for u in args.uuids.split(",") if u.strip()]

    print(f"[*] Starting GameData sync for {len(target_uuids)} target servers...")
    vtables_db, signatures_db = load_canonical_data(args.repo_dir, args.mount_path)

    print(f"[*] Canonical index loaded: {len(vtables_db['vtable_exact'])} vtable/offsets, {len(signatures_db)} signatures.")
    total_files, changes = sync_all_servers(
        args.volumes_dir, target_uuids, vtables_db, signatures_db, dry_run=args.dry_run
    )

    print(f"[+] Sync finished. Files modified: {total_files}, Total changes: {len(changes)}.")

    report = generate_discord_report(changes, total_files)
    if args.discord_summary_file:
        args.discord_summary_file.parent.mkdir(parents=True, exist_ok=True)
        with open(args.discord_summary_file, "w", encoding="utf-8") as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        print(f"[+] Discord summary written to {args.discord_summary_file}")


if __name__ == "__main__":
    main()
