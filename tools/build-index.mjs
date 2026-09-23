import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_FILES = [
  "tf2-function-signatures.game.engine.txt",
  "tf2-function-signatures.game.server.txt",
];
const TF2C_SOURCE_FILES = [
  "tf2c-function-signatures.game.server.txt",
  "tf2c.sdktools.games.txt",
  "tf2c.binary.engine.txt",
  "tf2c.binary.server.txt",
];

const PLATFORM_KEYS = ["linux", "linux64"];

export function classifySignature(value) {
  if (!value) return "unknown";
  return value.startsWith("@") ? "symbol" : "byte-pattern";
}

function unescapeName(value) {
  return value.replace(/\\"/g, '"').replace(/\\\\/g, "\\");
}

function parseOffsets(value) {
  return value
    .split(",")
    .map((offset) => offset.trim())
    .filter(Boolean);
}

function finishEntry(entry) {
  if (!entry) return null;

  for (const platform of PLATFORM_KEYS) {
    if (entry[platform]) {
      entry[platform].offsets = entry.offsets[platform] ?? [];
    }
  }

  const result = {
    id: `${entry.sourceFile}:${entry.sourceLine}`,
    name: entry.name,
    library: entry.library || "server",
    sourceFile: entry.sourceFile,
    sourceLine: entry.sourceLine,
    linux: entry.linux,
    linux64: entry.linux64,
  };

  return result;
}

export function parseGameDataText(text, sourceFile) {
  const entries = [];
  const lines = text.split(/\r?\n/);
  let current = null;

  const flush = () => {
    const result = finishEntry(current);
    if (result) entries.push(result);
    current = null;
  };

  lines.forEach((line, index) => {
    const sourceLine = index + 1;
    const nameMatch = line.match(/^(?: {12,}|\t{3,})"((?:\\.|[^"])*)"\s*$/);

    if (nameMatch) {
      flush();
      current = {
        name: unescapeName(nameMatch[1]),
        sourceFile,
        sourceLine,
        library: "server",
        offsets: {},
        linux: null,
        linux64: null,
      };
      return;
    }

    if (!current) return;

    const offsetMatch = line.match(/^\s*\/\/\s*(linux64|linux)\s*:\s*(.+?)\s*$/);
    if (offsetMatch) {
      current.offsets[offsetMatch[1]] = parseOffsets(offsetMatch[2]);
      return;
    }

    const keyValueMatch = line.match(
      /^\s*"(library|linux64|linux)"\s+"((?:\\.|[^"])*)"\s*$/,
    );
    if (!keyValueMatch) return;

    const [, key, value] = keyValueMatch;
    if (key === "library") {
      current.library = value;
      return;
    }

    current[key] = {
      value,
      kind: classifySignature(value),
      offsets: [],
    };
  });

  flush();
  return entries;
}

function summarizePlatform(entries, platform) {
  const values = entries.map((entry) => entry[platform]).filter(Boolean);
  return {
    present: values.length,
    missing: entries.length - values.length,
    symbol: values.filter((value) => value.kind === "symbol").length,
    "byte-pattern": values.filter((value) => value.kind === "byte-pattern").length,
    unknown: values.filter((value) => value.kind === "unknown").length,
  };
}

export function buildIndex(files, generatedAt = new Date().toISOString(), reviewedCandidates = []) {
  const entries = files.flatMap(({ fileName, text }) =>
    parseGameDataText(text, fileName),
  );
  const entriesById = new Map(entries.map((entry) => [entry.id, entry]));
  const reviewedSlots = new Set();

  for (const candidate of reviewedCandidates) {
    const entry = entriesById.get(candidate.entryId);
    const slot = `${candidate.entryId}|${candidate.platform}`;

    if (!entry || !["linux", "linux64"].includes(candidate.platform)) {
      throw new Error(`Invalid reviewed byte-pattern target: ${slot}`);
    }
    if (reviewedSlots.has(slot) || entry[candidate.platform]) {
      throw new Error(`Reviewed byte-pattern would overwrite an existing signature: ${slot}`);
    }
    if (candidate.matches !== 1 || candidate.fixedBytes < 8 || classifySignature(candidate.pattern) !== "byte-pattern") {
      throw new Error(`Reviewed byte-pattern did not pass the publication policy: ${slot}`);
    }

    reviewedSlots.add(slot);
    entry[candidate.platform] = {
      value: candidate.pattern,
      kind: "byte-pattern",
      offsets: candidate.address ? [candidate.address] : [],
    };
  }

  const names = new Map();
  for (const entry of entries) {
    const key = `${entry.library}|${entry.name}`;
    names.set(key, (names.get(key) ?? 0) + 1);
  }

  const sources = Object.fromEntries(
    files.map(({ fileName }) => {
      const sourceEntries = entries.filter((entry) => entry.sourceFile === fileName);
      return [fileName, {
        entries: sourceEntries.length,
        libraries: [...new Set(sourceEntries.map((entry) => entry.library))],
      }];
    }),
  );

  return {
    schemaVersion: 1,
    generatedAt,
    sources,
    stats: {
      entries: entries.length,
      byLibrary: entries.reduce((counts, entry) => {
        counts[entry.library] = (counts[entry.library] ?? 0) + 1;
        return counts;
      }, {}),
      platforms: {
        linux: summarizePlatform(entries, "linux"),
        linux64: summarizePlatform(entries, "linux64"),
      },
      duplicates: {
        names: [...names.values()].filter((count) => count > 1).length,
        extraEntries: [...names.values()]
          .filter((count) => count > 1)
          .reduce((total, count) => total + count - 1, 0),
      },
    },
    entries,
  };
}

function readUtf8(filePath) {
  const bytes = fs.readFileSync(filePath);
  const decoder = new TextDecoder("utf-8", { fatal: true });
  const text = decoder.decode(bytes);
  if (text.charCodeAt(0) === 0xfeff) {
    throw new Error(`Unexpected UTF-8 BOM in ${filePath}`);
  }
  return text;
}

export function readSourceFiles(root = ROOT) {
  return SOURCE_FILES.map((fileName) => ({
    fileName,
    text: readUtf8(path.join(root, fileName)),
  }));
}

export function readClassifiedSourceFiles(root = ROOT) {
  return TF2C_SOURCE_FILES.map((fileName) => ({
    fileName,
    text: readUtf8(path.join(root, fileName)),
  }));
}

function readReviewedCandidates(root) {
  const reviewPath = path.join(root, "artifacts", "reviewed-linux-byte-patterns.json");
  const review = JSON.parse(readUtf8(reviewPath));
  if (!Array.isArray(review.promotable)) {
    throw new Error(`Missing reviewed byte-pattern list in ${reviewPath}`);
  }
  return review.promotable;
}

export function buildIndexFromDisk(root = ROOT) {
  return buildIndex(readSourceFiles(root), new Date().toISOString(), readReviewedCandidates(root));
}

export function buildCatalogFromDisk(root = ROOT) {
  const generatedAt = new Date().toISOString();
  return {
    schemaVersion: 1,
    generatedAt,
    games: {
      tf2: buildIndex(readSourceFiles(root), generatedAt, readReviewedCandidates(root)),
      tf2c: buildIndex(readClassifiedSourceFiles(root), generatedAt),
    },
  };
}

export function buildCatalogManifest(catalog) {
  return {
    schemaVersion: catalog.schemaVersion,
    generatedAt: catalog.generatedAt,
    games: Object.fromEntries(
      Object.entries(catalog.games).map(([game, index]) => [game, {
        dataFile: `${game}.json`,
        stats: index.stats,
      }]),
    ),
  };
}

function copySite(root, dist) {
  fs.mkdirSync(dist, { recursive: true });
  fs.cpSync(path.join(root, "site"), dist, { recursive: true });
}

export function writeBuild(root = ROOT) {
  const dist = path.join(root, "dist");
  const catalog = buildCatalogFromDisk(root);

  fs.rmSync(dist, { recursive: true, force: true });
  copySite(root, dist);
  fs.mkdirSync(path.join(dist, "data"), { recursive: true });
  for (const [game, index] of Object.entries(catalog.games)) {
    fs.writeFileSync(path.join(dist, "data", `${game}.json`), `${JSON.stringify(index)}\n`, "utf8");
  }
  const manifest = buildCatalogManifest(catalog);
  fs.writeFileSync(path.join(dist, "data", "catalog-manifest.json"), `${JSON.stringify(manifest)}\n`, "utf8");

  return { catalog, dist };
}

function runCli() {
  const mode = process.argv[2] ?? "--audit";
  const result = mode === "--build"
    ? writeBuild()
    : { catalog: buildCatalogFromDisk() };
  const catalogPath = path.join(result.dist ?? path.join(ROOT, "dist"), "data", "catalog-manifest.json");
  if (mode === "--build") {
    console.log(`Built ${catalogPath} (${fs.statSync(catalogPath).size} bytes)`);
  }
  console.log(JSON.stringify(Object.fromEntries(
    Object.entries(result.catalog.games).map(([game, index]) => [game, index.stats]),
  ), null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runCli();
}
