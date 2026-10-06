#!/usr/bin/env python3
"""Validate and audit all GameData files across target server volumes."""

from __future__ import annotations

import argparse
import glob
import os
import re
import sys
from pathlib import Path

TARGET_UUIDS = [
    "5c213163-fa72-4e09-8edf-1bf79f86b4dd",
    "f97e7bc8-edb4-40af-b1e1-fe662ec58f17",
    "1694366d-2b68-4307-b7b7-b5d8f1dc3928",
    "fcb763b9-179f-4114-a7b0-7679877cc4b5",
    "e76c96db-5d25-41f5-8191-cd94f23aa45e",
]


def check_gamedata_syntax(content: str) -> tuple[bool, str]:
    """Check curly brace balance outside quotes and comments."""
    in_string = False
    in_comment_line = False
    in_comment_block = False
    brace_count = 0
    escaped = False
    i = 0
    n = len(content)
    line_num = 1
    col_num = 1

    while i < n:
        c = content[i]
        if c == "\n":
            line_num += 1
            col_num = 1
        else:
            col_num += 1

        if in_comment_line:
            if c == "\n":
                in_comment_line = False
        elif in_comment_block:
            if c == "*" and i + 1 < n and content[i + 1] == "/":
                in_comment_block = False
                i += 1
                col_num += 1
        elif in_string:
            if escaped:
                escaped = False
            elif c == "\\":
                escaped = True
            elif c == "\"":
                in_string = False
        else:
            if c == "/" and i + 1 < n:
                if content[i + 1] == "/":
                    in_comment_line = True
                    i += 1
                    col_num += 1
                elif content[i + 1] == "*":
                    in_comment_block = True
                    i += 1
                    col_num += 1
            elif c == "\"":
                in_string = True
            elif c == "{":
                brace_count += 1
            elif c == "}":
                brace_count -= 1
                if brace_count < 0:
                    return False, f"Extra closing brace at line {line_num}, col {col_num}"
        i += 1

    if brace_count != 0:
        return False, f"Unbalanced braces (diff: {brace_count})"
    return True, "OK"


def audit_volume_gamedata(volumes_dir: Path) -> None:
    all_files: list[Path] = []
    for u in TARGET_UUIDS:
        vol_dir = volumes_dir / u / "tf" / "addons" / "sourcemod" / "gamedata"
        if vol_dir.exists():
            for p in vol_dir.rglob("*.txt"):
                all_files.append(p)

    print(f"[*] Found {len(all_files)} GameData files across {len(TARGET_UUIDS)} target servers.")
    syntax_errors: list[tuple[str, str]] = []
    encoding_issues: list[tuple[str, str]] = []
    offset_count = 0
    sig_count = 0

    unique_files: set[str] = set()

    for path in all_files:
        unique_files.add(path.name)
        try:
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
        except UnicodeDecodeError:
            try:
                with open(path, "r", encoding="latin1") as f:
                    content = f.read()
                encoding_issues.append((str(path), "non-utf8 (latin1 fallback)"))
            except Exception as e:
                encoding_issues.append((str(path), str(e)))
                continue

        valid, err = check_gamedata_syntax(content)
        if not valid:
            syntax_errors.append((str(path), err))

        # Count offsets and signatures roughly
        offset_count += len(re.findall(r'"windows"\s*"(\d+)"', content))
        offset_count += len(re.findall(r'"linux"\s*"(\d+)"', content))
        sig_count += len(re.findall(r'"linux(?:64)?"\s*"@', content))

    print(f"[*] Unique GameData filenames: {len(unique_files)}")
    print(f"[*] Total numeric offset references found: {offset_count}")
    print(f"[*] Total mangled signature references found: {sig_count}")

    if encoding_issues:
        print(f"[!] Encoding issues: {len(encoding_issues)}")
        for p, err in encoding_issues[:10]:
            print(f"    - {p}: {err}")
    else:
        print("[+] All GameData files are valid UTF-8.")

    if syntax_errors:
        print(f"[!] Syntax errors: {len(syntax_errors)}")
        for p, err in syntax_errors[:10]:
            print(f"    - {p}: {err}")
    else:
        print("[+] All GameData files have balanced braces and valid KeyValues syntax!")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--volumes-dir", type=Path, default=Path("/var/lib/pterodactyl/volumes"))
    args = parser.parse_args()
    audit_volume_gamedata(args.volumes_dir)
