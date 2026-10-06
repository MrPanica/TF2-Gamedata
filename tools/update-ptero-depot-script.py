#!/usr/bin/env python3
"""Helper script to safely insert pre-restart GameData sync into ptero_tf2_depot_update.sh."""

import sys
from pathlib import Path

SCRIPT_PATH = Path("/usr/local/bin/ptero_tf2_depot_update.sh")

INSERTION = """# -------------------------------------------------------------------------
# Предстартовое сканирование и автопатчинг GameData серверов
# -------------------------------------------------------------------------
SYNC_GAMEDATA_SCRIPT="/opt/TF2-Gamedata/tools/sync-server-gamedata.py"
DISCORD_GAMEDATA_JSON="/tmp/gamedata_discord_msg.json"
rm -f "$DISCORD_GAMEDATA_JSON"

if [[ -f "$SYNC_GAMEDATA_SCRIPT" ]]; then
  echo "Проверяю и обновляю GameData на серверах перед рестартом..."
  python3 "$SYNC_GAMEDATA_SCRIPT" \\
    --mount-path "$MOUNT_PATH" \\
    --repo-dir "/opt/TF2-Gamedata" \\
    --uuids "$TARGET_UUIDS" \\
    --discord-summary-file "$DISCORD_GAMEDATA_JSON" || echo "Предупреждение: сбой скрипта sync-server-gamedata (не критично)" >&2

  if [[ -f "$DISCORD_GAMEDATA_JSON" ]]; then
    has_changes=$(jq -r '.has_changes // false' "$DISCORD_GAMEDATA_JSON" 2>/dev/null || echo "false")
    if [[ "$has_changes" == "true" ]]; then
      gd_title=$(jq -r '.title' "$DISCORD_GAMEDATA_JSON")
      gd_desc=$(jq -r '.description' "$DISCORD_GAMEDATA_JSON")
      gd_color=$(jq -r '.color // 3066993' "$DISCORD_GAMEDATA_JSON")
      send_embed "$gd_title" "$gd_desc" "$gd_color"
      send_embed_to_second "$gd_title" "$gd_desc" "$gd_color"
    fi
  fi
fi

inf_src="$MOUNT_PATH/tf/steam.inf"
"""

TARGET = 'inf_src="$MOUNT_PATH/tf/steam.inf"'


def main() -> None:
    if not SCRIPT_PATH.exists():
        print(f"[-] Script not found: {SCRIPT_PATH}", file=sys.stderr)
        sys.exit(1)

    content = SCRIPT_PATH.read_text(encoding="utf-8")
    if "SYNC_GAMEDATA_SCRIPT" in content:
        print("[*] GameData sync block already present in script.")
        return

    if TARGET not in content:
        print(f"[-] Target anchor not found in script: {TARGET}", file=sys.stderr)
        sys.exit(1)

    content = content.replace(TARGET, INSERTION, 1)
    SCRIPT_PATH.write_text(content, encoding="utf-8")
    print("[+] Successfully inserted GameData pre-restart sync into ptero_tf2_depot_update.sh!")


if __name__ == "__main__":
    main()
