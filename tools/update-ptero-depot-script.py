#!/usr/bin/env python3
"""Helper script to safely insert pre-restart GameData sync and fix JSON formatting in ptero_tf2_depot_update.sh."""

import re
import sys
from pathlib import Path

SCRIPT_PATH = Path("/usr/local/bin/ptero_tf2_depot_update.sh")

OLD_SEND_EMBED = """send_embed() {
  local title="$1" desc="$2" color="${3:-16776960}"
  local payload
  payload=$(cat <<EOF
{"embeds":[{"title":"$title","description":"$desc","color":$color,"timestamp":"$(date -Iseconds)"}]}
EOF
)
  curl -s -H "Content-Type: application/json" -X POST -d "$payload" "$DISCORD_WEBHOOK_URL" >/dev/null
}

send_embed_to_second() {
  local title="$1" desc="$2" color="${3:-16776960}"
  local payload
  payload=$(cat <<EOF
{"embeds":[{"title":"$title","description":"$desc","color":$color,"timestamp":"$(date -Iseconds)"}]}
EOF
)
  curl -s -H "Content-Type: application/json" -X POST -d "$payload" "$SECOND_WEBHOOK_URL" >/dev/null
}"""

NEW_SEND_EMBED = """send_embed() {
  local title="$1" desc="$2" color="${3:-16776960}"
  local payload
  payload=$(jq -n \\
    --arg title "$title" \\
    --arg desc "$desc" \\
    --argjson color "$color" \\
    --arg ts "$(date -Iseconds)" \\
    '{"embeds":[{"title":$title,"description":$desc,"color":$color,"timestamp":$ts}]}')
  curl -s -H "Content-Type: application/json" -X POST -d "$payload" "$DISCORD_WEBHOOK_URL" >/dev/null
}

send_embed_to_second() {
  local title="$1" desc="$2" color="${3:-16776960}"
  local payload
  payload=$(jq -n \\
    --arg title "$title" \\
    --arg desc "$desc" \\
    --argjson color "$color" \\
    --arg ts "$(date -Iseconds)" \\
    '{"embeds":[{"title":$title,"description":$desc,"color":$color,"timestamp":$ts}]}')
  curl -s -H "Content-Type: application/json" -X POST -d "$payload" "$SECOND_WEBHOOK_URL" >/dev/null
}"""

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
    modified = False

    # 1. Update send_embed to use jq for valid JSON encoding with newlines
    if OLD_SEND_EMBED in content:
        content = content.replace(OLD_SEND_EMBED, NEW_SEND_EMBED)
        modified = True
        print("[+] Fixed send_embed and send_embed_to_second with jq JSON encoding!")

    # 2. Insert GameData sync if not present
    if "SYNC_GAMEDATA_SCRIPT" not in content:
        if TARGET not in content:
            print(f"[-] Target anchor not found in script: {TARGET}", file=sys.stderr)
            sys.exit(1)
        content = content.replace(TARGET, INSERTION, 1)
        modified = True
        print("[+] Inserted GameData pre-restart sync into script!")
    else:
        print("[*] GameData sync block already present in script.")

    if modified:
        SCRIPT_PATH.write_text(content, encoding="utf-8")
        print("[+] Saved changes to /usr/local/bin/ptero_tf2_depot_update.sh!")
    else:
        print("[*] Script already up to date.")


if __name__ == "__main__":
    main()
