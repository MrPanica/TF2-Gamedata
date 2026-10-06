import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

function scanFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, "utf8");
  const offsets = {};
  const offsetsMatch = content.match(/"Offsets"\s*\{([\s\S]*?)\n\t\}/i) || content.match(/"Offsets"\s*\{([\s\S]*?)\n\}/i);
  if (offsetsMatch) {
    const block = offsetsMatch[1];
    const itemRegex = /"([^"]+)"\s*\{([^}]+)\}/g;
    let m;
    while ((m = itemRegex.exec(block)) !== null) {
      const name = m[1];
      const body = m[2];
      const linux = body.match(/"linux"\s*"([^"]+)"/)?.[1];
      const linux64 = body.match(/"linux64"\s*"([^"]+)"/)?.[1];
      const windows = body.match(/"windows"\s*"([^"]+)"/)?.[1];
      const windows64 = body.match(/"windows64"\s*"([^"]+)"/)?.[1];
      
      // Filter out non-numeric signature patterns like @_ZN... or \x55
      const isOffset = (linux && /^\d+$/.test(linux)) || (windows && /^\d+$/.test(windows)) || (linux64 && /^\d+$/.test(linux64));
      if (!isOffset) continue;

      let className = "";
      let memberName = name;
      let type = "member_offset";

      if (name.startsWith("sizeof(")) {
        type = "sizeof";
        className = name.replace(/^sizeof\((.*)\)$/, "$1");
        memberName = name;
      } else if (name.includes("::")) {
        const parts = name.split("::");
        className = parts[0];
        memberName = parts.slice(1).join("::");
      }

      offsets[name] = {
        name,
        class: className,
        member: memberName,
        linux: linux || null,
        linux64: linux64 || null,
        windows: windows || null,
        windows64: windows64 || null,
        type,
      };
    }
  }
  return offsets;
}

const vtablesPath = path.join(ROOT, "artifacts", "tf2-vtables.json");
if (!fs.existsSync(vtablesPath)) {
  console.error("artifacts/tf2-vtables.json not found!");
  process.exit(1);
}

const vtablesData = JSON.parse(fs.readFileSync(vtablesPath, "utf8"));

const sourceFiles = [
  "O:/GitHub/SM-TFEconData/gamedata/tf2.econ_data.txt",
  "O:/GitHub/tf2attributes/gamedata/tf2.attributes.txt",
];

const allOffsets = {};
for (const file of sourceFiles) {
  const extracted = scanFile(file);
  Object.assign(allOffsets, extracted);
}

vtablesData.memberOffsets = allOffsets;
vtablesData.updatedAt = new Date().toISOString();

// Also ensure each referenced class in memberOffsets exists in classes dict or has members array
for (const [key, item] of Object.entries(allOffsets)) {
  if (item.class && vtablesData.classes[item.class]) {
    if (!vtablesData.classes[item.class].memberOffsets) {
      vtablesData.classes[item.class].memberOffsets = [];
    }
    vtablesData.classes[item.class].memberOffsets.push(item);
  }
}

fs.writeFileSync(vtablesPath, JSON.stringify(vtablesData), "utf8");
console.log(`[+] Added ${Object.keys(allOffsets).length} member offsets to ${vtablesPath}`);
