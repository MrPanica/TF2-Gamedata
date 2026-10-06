#!/usr/bin/env python3
"""Update TF2 GameData signatures and offsets from ELF binaries."""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
import time
from pathlib import Path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--engine32", type=Path, help="Path to 32-bit engine_srv.so")
    parser.add_argument("--engine64", type=Path, help="Path to 64-bit engine_srv.so")
    parser.add_argument("--server32", type=Path, help="Path to 32-bit server_srv.so")
    parser.add_argument("--server64", type=Path, help="Path to 64-bit server_srv.so")
    parser.add_argument("--repo-dir", type=Path, default=Path(__file__).resolve().parents[1],
                        help="Path to repository root")
    parser.add_argument("--build-id", default="", help="Game build ID or version label")
    parser.add_argument("--git-push", action="store_true", help="Commit and push changes if updated")
    parser.add_argument("--dry-run", action="store_true", help="Only parse and report, do not write files")
    return parser.parse_args()


def extract_symbols_from_nm(binary_path: Path) -> dict[str, str]:
    """Run `nm --defined-only` on binary and return symbol -> offset mapping."""
    if not binary_path or not binary_path.exists():
        print(f"[-] Binary not found: {binary_path}", file=sys.stderr)
        return {}

    print(f"[*] Extracting symbols from {binary_path.name}...")
    start_time = time.perf_counter()
    proc = subprocess.run(
        ["nm", "--defined-only", str(binary_path)],
        capture_output=True,
        text=True,
        check=True
    )
    duration = time.perf_counter() - start_time

    symbol_map: dict[str, list[str]] = {}
    total_lines = 0

    for line in proc.stdout.splitlines():
        total_lines += 1
        parts = line.strip().split()
        if len(parts) < 3:
            continue
        addr_str, _, sym_name = parts[0], parts[1], parts[2]
        # Ignore cold compiler fragments
        if sym_name.endswith(".cold"):
            continue
        try:
            addr_int = int(addr_str, 16)
        except ValueError:
            continue
        offset_hex = f"0x{addr_int:X}"
        if sym_name not in symbol_map:
            symbol_map[sym_name] = []
        if offset_hex not in symbol_map[sym_name]:
            symbol_map[sym_name].append(offset_hex)

    result = {k: ", ".join(v) for k, v in symbol_map.items()}
    print(f"    -> {len(result)} unique symbols parsed in {duration:.3f}s (from {total_lines} symbols)")
    return result


def update_gamedata_file(
    file_path: Path,
    symbols_32: dict[str, str],
    symbols_64: dict[str, str],
    library: str = "server",
    changed_samples: list[dict] | None = None,
    dry_run: bool = False
) -> dict[str, int]:
    """Update // linux: and // linux64: offset comments in a GameData file."""
    if not file_path.exists():
        raise FileNotFoundError(f"GameData file not found: {file_path}")

    print(f"[*] Updating {file_path.name}...")
    with open(file_path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    updated_lines: list[str] = []
    stats = {
        "linux_updated": 0,
        "linux64_updated": 0,
        "linux_unchanged": 0,
        "linux64_unchanged": 0,
        "linux_missing": 0,
        "linux64_missing": 0,
    }

    pending_offset: dict[str, tuple[int, str, str] | None] = {"linux": None, "linux64": None}
    current_name = ""

    comment_pattern = re.compile(r"^(\s*)//\s*(linux|linux64)\s*:\s*(.+?)\s*$")
    symbol_pattern = re.compile(r"^(\s*)\"(linux|linux64)\"\s+\"@((?:\\.|[^\"])*)\"\s*$")
    name_pattern = re.compile(r'^(?: {12,}|\t{3,})"((?:\\.|[^"])*)"\s*$')

    for line in lines:
        name_m = name_pattern.match(line)
        if name_m:
            current_name = name_m.group(1)
            pending_offset["linux"] = None
            pending_offset["linux64"] = None
        elif line.strip() == "}":
            pending_offset["linux"] = None
            pending_offset["linux64"] = None

        comment_match = comment_pattern.match(line)
        if comment_match:
            indent, platform, old_offset = comment_match.groups()
            pending_offset[platform] = (len(updated_lines), indent, old_offset)
            updated_lines.append(line)
            continue

        sym_match = symbol_pattern.match(line)
        if sym_match:
            indent, platform, sym_name = sym_match.groups()
            sym_map = symbols_32 if platform == "linux" else symbols_64

            if sym_map and sym_name in sym_map:
                new_offset = sym_map[sym_name]
                if pending_offset[platform] is not None:
                    target_idx, target_indent, old_offset = pending_offset[platform]
                    if old_offset != new_offset:
                        updated_lines[target_idx] = f"{target_indent}// {platform}: {new_offset}\n"
                        stats[f"{platform}_updated"] += 1
                    else:
                        stats[f"{platform}_unchanged"] += 1
                    pending_offset[platform] = None
                else:
                    updated_lines.append(f"{indent}// {platform}: {new_offset}\n")
                    stats[f"{platform}_updated"] += 1
                    if changed_samples is not None:
                        changed_samples.append({
                            "type": "symbol",
                            "name": current_name,
                            "library": library,
                            "platform": platform,
                            "details": f"Обнаружен символ {platform}"
                        })
            else:
                if pending_offset[platform] is not None:
                    stats[f"{platform}_missing"] += 1
                    pending_offset[platform] = None

            updated_lines.append(line)
            continue

        updated_lines.append(line)

    if not dry_run:
        with open(file_path, "w", encoding="utf-8", newline="\n") as f:
            f.writelines(updated_lines)

    print(f"    linux:   {stats['linux_updated']} updated, {stats['linux_unchanged']} unchanged, {stats['linux_missing']} not in binary")
    print(f"    linux64: {stats['linux64_updated']} updated, {stats['linux64_unchanged']} unchanged, {stats['linux64_missing']} not in binary")
    return stats


def update_reviewed_byte_patterns(
    json_path: Path,
    symbols_32: dict[str, str],
    symbols_64: dict[str, str],
    dry_run: bool = False
) -> int:
    """Update address field of reviewed byte pattern candidates from symbol tables."""
    if not json_path.exists():
        return 0

    print(f"[*] Checking reviewed byte-patterns in {json_path.name}...")
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    updated_count = 0
    promotable = data.get("promotable", [])
    for candidate in promotable:
        sym = candidate.get("symbol")
        plat = candidate.get("platform")
        if not sym or not plat:
            continue
        sym_map = symbols_32 if plat == "linux" else symbols_64
        if sym_map and sym in sym_map:
            new_addr = sym_map[sym]
            if candidate.get("address") != new_addr:
                candidate["address"] = new_addr
                updated_count += 1

    if updated_count > 0 and not dry_run:
        data["generatedAt"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        with open(json_path, "w", encoding="utf-8", newline="\n") as f:
            json.dump(data, f, ensure_ascii=False)
            f.write("\n")

    print(f"    -> {updated_count} byte-pattern addresses updated")
    return updated_count


def record_updates_history(
    history_path: Path,
    build_id: str,
    stats_engine: dict[str, int],
    stats_server: dict[str, int],
    changes: list[dict],
    dry_run: bool = False
) -> None:
    """Save update summary and sample offset changes into artifacts/tf2-updates-history.json."""
    total_changed = (
        stats_engine.get("linux_updated", 0) + stats_engine.get("linux64_updated", 0) +
        stats_server.get("linux_updated", 0) + stats_server.get("linux64_updated", 0)
    )
    if total_changed == 0:
        return

    history = {
        "schemaVersion": 1,
        "latestBuild": build_id or "auto",
        "updatedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "updates": []
    }
    if history_path.exists():
        try:
            with open(history_path, "r", encoding="utf-8") as f:
                history = json.load(f)
        except Exception:
            pass

    history["latestBuild"] = build_id or "auto"
    history["updatedAt"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    new_update = {
        "buildId": build_id or "auto",
        "date": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "title": f"Обновление TF2 (build {build_id})" if build_id else "Обновление TF2",
        "description": "Синхронизация смещений и адресов символов из серверного депо",
        "stats": {
            "engineLinux": stats_engine.get("linux_updated", 0),
            "engineLinux64": stats_engine.get("linux64_updated", 0),
            "serverLinux": stats_server.get("linux_updated", 0),
            "serverLinux64": stats_server.get("linux64_updated", 0),
            "totalChanged": total_changed,
        },
        "sampleCount": min(len(changes), 1000),
        "sampleChanges": changes[:1000]
    }
    history.setdefault("updates", []).insert(0, new_update)
    history["updates"] = history["updates"][:10]

    if not dry_run:
        with open(history_path, "w", encoding="utf-8") as f:
            json.dump(history, f, ensure_ascii=False, indent=2)
            f.write("\n")
    print(f"[*] Recorded {total_changed} changes to {history_path.name}")


def git_commit_and_push(repo_dir: Path, build_id: str = "") -> bool:
    """Commit changes to git and push to origin main."""
    print("[*] Checking git status...")
    status = subprocess.run(
        ["git", "status", "--porcelain"],
        cwd=repo_dir,
        capture_output=True,
        text=True,
        check=True
    )
    if not status.stdout.strip():
        print("[*] No changes detected in repository. Git commit skipped.")
        return False

    files_to_add = [
        "tf2-function-signatures.game.engine.txt",
        "tf2-function-signatures.game.server.txt",
        "artifacts/reviewed-linux-byte-patterns.json",
        "artifacts/tf2-updates-history.json",
    ]
    for file_name in files_to_add:
        p = repo_dir / file_name
        if p.exists():
            subprocess.run(["git", "add", str(file_name)], cwd=repo_dir, check=True)

    commit_msg = f"chore(auto): update TF2 signatures and offsets"
    if build_id:
        commit_msg += f" for build {build_id}"

    print(f"[*] Committing: {commit_msg}")
    subprocess.run(["git", "commit", "-m", commit_msg], cwd=repo_dir, check=True)

    print("[*] Pushing to origin main...")
    push_res = subprocess.run(["git", "push", "origin", "main"], cwd=repo_dir, capture_output=True, text=True)
    if push_res.returncode == 0:
        print("[+] Successfully pushed to GitHub!")
        return True
    else:
        print(f"[-] Git push failed:\n{push_res.stderr}", file=sys.stderr)
        return False


def main() -> int:
    args = parse_args()
    repo_dir = args.repo_dir.resolve()
    print(f"[+] TF2 GameData Updater starting in {repo_dir}")

    # Extract symbols from binaries if provided
    symbols_engine32 = extract_symbols_from_nm(args.engine32) if args.engine32 else {}
    symbols_engine64 = extract_symbols_from_nm(args.engine64) if args.engine64 else {}
    symbols_server32 = extract_symbols_from_nm(args.server32) if args.server32 else {}
    symbols_server64 = extract_symbols_from_nm(args.server64) if args.server64 else {}

    changed_samples: list[dict] = []
    stats_engine = {}
    stats_server = {}

    # Update engine signatures
    engine_file = repo_dir / "tf2-function-signatures.game.engine.txt"
    if symbols_engine32 or symbols_engine64:
        stats_engine = update_gamedata_file(
            engine_file, symbols_engine32, symbols_engine64,
            library="engine", changed_samples=changed_samples, dry_run=args.dry_run
        )

    # Update server signatures
    server_file = repo_dir / "tf2-function-signatures.game.server.txt"
    if symbols_server32 or symbols_server64:
        stats_server = update_gamedata_file(
            server_file, symbols_server32, symbols_server64,
            library="server", changed_samples=changed_samples, dry_run=args.dry_run
        )

    # Update byte-patterns
    patterns_file = repo_dir / "artifacts" / "reviewed-linux-byte-patterns.json"
    all_syms_32 = {**symbols_engine32, **symbols_server32}
    all_syms_64 = {**symbols_engine64, **symbols_server64}
    if all_syms_32 or all_syms_64:
        update_reviewed_byte_patterns(patterns_file, all_syms_32, all_syms_64, dry_run=args.dry_run)

    # Record history
    history_file = repo_dir / "artifacts" / "tf2-updates-history.json"
    if changed_samples:
        record_updates_history(history_file, args.build_id, stats_engine, stats_server, changed_samples, dry_run=args.dry_run)

    # Dump VTables if 32-bit binaries provided
    if (args.server32 or args.engine32) and not args.dry_run:
        try:
            dump_script = repo_dir / "tools" / "dump-tf2-vtables.py"
            if dump_script.exists():
                print("[*] Updating VTables dump...")
                cmd = [sys.executable, str(dump_script)]
                if args.server32:
                    cmd.extend(["--server", str(args.server32)])
                if args.engine32:
                    cmd.extend(["--engine", str(args.engine32)])
                subprocess.run(cmd, check=True)
        except Exception as e:
            print(f"[!] Warning: failed to dump VTables: {e}", file=sys.stderr)

    # If git push requested and not dry run
    if args.git_push and not args.dry_run:
        git_commit_and_push(repo_dir, args.build_id)

    print("[+] Done!")
    return 0


if __name__ == "__main__":
    sys.exit(main())
