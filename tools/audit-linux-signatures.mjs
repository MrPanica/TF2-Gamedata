import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildIndexFromDisk } from "./build-index.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function parseArgs(argv) {
  const options = { binary: null, help: false };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--help" || argument === "-h") options.help = true;
    if (argument === "--binary") options.binary = argv[index + 1] ?? null;
    if (argument.startsWith("--binary=")) options.binary = argument.slice("--binary=".length);
  }
  return options;
}

function parseBytePattern(value) {
  if (!value || value.startsWith("@")) return null;
  const matches = [...value.matchAll(/\\x([0-9a-f]{2})/gi)];
  const rest = value.replace(/\\x[0-9a-f]{2}/gi, "").replace(/\s+/g, "");
  if (!matches.length || rest) return null;
  return {
    bytes: matches.map((match) => Number.parseInt(match[1], 16)),
    mask: matches.map((match) => match[1].toLocaleUpperCase() !== "2A"),
  };
}

function countMatches(buffer, pattern) {
  if (pattern.bytes.length === 0 || pattern.bytes.length > buffer.length) return 0;
  let matches = 0;
  for (let offset = 0; offset <= buffer.length - pattern.bytes.length; offset += 1) {
    let matchesAtOffset = true;
    for (let index = 0; index < pattern.bytes.length; index += 1) {
      if (pattern.mask[index] && buffer[offset + index] !== pattern.bytes[index]) {
        matchesAtOffset = false;
        break;
      }
    }
    if (matchesAtOffset) matches += 1;
  }
  return matches;
}

function getConfiguredBytePatterns(index) {
  return index.entries.flatMap((entry) => [
    { entry, platform: "linux", signature: entry.linux },
    { entry, platform: "linux64", signature: entry.linux64 },
  ]).filter(({ signature }) => signature?.kind === "byte-pattern");
}

function printHelp() {
  console.log(`Usage:
  node tools/audit-linux-signatures.mjs
  node tools/audit-linux-signatures.mjs --binary path/to/server_srv.so

The default mode audits the source GameData. With --binary it additionally
checks every configured Linux byte-pattern against the supplied ELF file.
It never invents a signature: discovering a new pattern still requires a
known target function or anchor and reverse-engineering of the matching ELF.`);
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    return;
  }

  const index = buildIndexFromDisk();
  const configured = getConfiguredBytePatterns(index);
  const report = {
    source: {
      entries: index.stats.entries,
      linuxBytePatterns: index.stats.platforms.linux["byte-pattern"],
      linux64BytePatterns: index.stats.platforms.linux64["byte-pattern"],
    },
    configuredBytePatterns: configured.length,
    binary: null,
    matches: [],
  };

  if (!options.binary) {
    report.binary = {
      supplied: false,
      status: "skipped",
      reason: "No ELF binary supplied; source files contain no Linux byte-pattern to scan.",
    };
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  const binaryPath = path.resolve(ROOT, options.binary);
  const buffer = fs.readFileSync(binaryPath);
  if (buffer[0] !== 0x7f || buffer.toString("ascii", 1, 4) !== "ELF") {
    throw new Error(`Not an ELF file: ${binaryPath}`);
  }

  report.binary = {
    supplied: true,
    path: binaryPath,
    elfClass: buffer[4] === 1 ? "ELF32" : buffer[4] === 2 ? "ELF64" : "unknown",
    bytes: buffer.length,
  };
  report.matches = configured.map(({ entry, platform, signature }) => {
    const pattern = parseBytePattern(signature.value);
    return {
      name: entry.name,
      platform,
      source: `${entry.sourceFile}:${entry.sourceLine}`,
      value: signature.value,
      parseable: Boolean(pattern),
      matches: pattern ? countMatches(buffer, pattern) : null,
    };
  });
  console.log(JSON.stringify(report, null, 2));
}

main();
