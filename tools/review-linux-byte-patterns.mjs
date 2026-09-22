import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildIndexFromDisk } from "./build-index.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_INPUT = path.join(ROOT, "artifacts", "discovered-linux-byte-patterns.json");
const DEFAULT_OUTPUT = path.join(ROOT, "artifacts", "reviewed-linux-byte-patterns.json");

function slotKey(entryId, platform) {
  return `${entryId}|${platform}`;
}

function targetKey(candidate) {
  return [candidate.library, candidate.platform, candidate.address, candidate.pattern].join("|");
}

function isThunk(candidate) {
  return candidate.name?.toLowerCase().includes("thunk") || candidate.symbol?.includes("_ZTh");
}

function isCold(candidate) {
  return candidate.symbol?.endsWith(".cold") || candidate.name?.endsWith(".cold");
}

function sourceSlots(index) {
  return index.entries.flatMap((entry) => [
    entry.linux ? null : { entryId: entry.id, name: entry.name, library: entry.library, platform: "linux", source: `${entry.sourceFile}:${entry.sourceLine}` },
    entry.linux64 ? null : { entryId: entry.id, name: entry.name, library: entry.library, platform: "linux64", source: `${entry.sourceFile}:${entry.sourceLine}` },
  ]).filter(Boolean);
}

export function reviewCandidates(index, report) {
  const candidates = report.candidates ?? [];
  const groups = new Map();
  for (const candidate of candidates) {
    const key = slotKey(candidate.entryId, candidate.platform);
    const group = groups.get(key) ?? [];
    group.push(candidate);
    groups.set(key, group);
  }

  const promotable = [];
  const manualReview = [];
  const rejected = [];

  for (const candidate of candidates) {
    const group = groups.get(slotKey(candidate.entryId, candidate.platform));
    const reason = group.length !== 1
      ? "multiple-candidates-for-source-slot"
      : candidate.matches !== 1
        ? "not-unique-in-binary"
        : candidate.fixedBytes < 8
          ? "too-few-fixed-bytes"
          : isCold(candidate)
            ? "compiler-cold-fragment"
            : isThunk(candidate)
              ? "abi-thunk-needs-manual-review"
              : null;

    if (!reason) {
      promotable.push(candidate);
    } else if (candidate.matches === 1 && candidate.fixedBytes >= 8 && (isCold(candidate) || isThunk(candidate))) {
      manualReview.push({ ...candidate, reviewReason: reason });
    } else {
      rejected.push({ ...candidate, rejectReason: reason });
    }
  }

  const candidatesBySlot = new Set(groups.keys());
  const noCandidate = sourceSlots(index).filter((slot) => !candidatesBySlot.has(slotKey(slot.entryId, slot.platform)));

  const aliasGroups = new Map();
  for (const candidate of candidates) {
    const key = targetKey(candidate);
    const group = aliasGroups.get(key) ?? [];
    group.push(candidate);
    aliasGroups.set(key, group);
  }
  const aliases = [...aliasGroups.entries()]
    .filter(([, group]) => group.length > 1)
    .map(([key, group]) => ({ key, count: group.length, candidates: group }));

  const slotGroups = [...groups.values()];
  const singletonSlots = slotGroups.filter((group) => group.length === 1);
  const stats = {
    sourceMissingSlots: sourceSlots(index).length,
    rawCandidateRows: candidates.length,
    slotsWithCandidates: groups.size,
    singletonSlots: singletonSlots.length,
    multiCandidateSlots: slotGroups.filter((group) => group.length > 1).length,
    promotable: promotable.length,
    manualReview: manualReview.length,
    rejectedRows: rejected.length,
    noCandidate: noCandidate.length,
    aliasGroups: aliases.length,
    aliasedRows: aliases.reduce((total, group) => total + group.count, 0),
  };

  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    policy: {
      requiresSourceSlotSingleton: true,
      requiresUniqueBinaryMatch: true,
      minimumFixedBytes: 8,
      rejectColdFragments: true,
      manualReviewThunks: true,
      rationale: "A byte-pattern is published only when one source slot maps to one unique binary match with at least eight fixed bytes; cold fragments, ABI thunks, aliases, and ambiguous rows stay out of the usable set.",
    },
    stats,
    promotable,
    manualReview,
    rejected,
    noCandidate,
    aliases,
  };
}

function parseArgs(argv) {
  const options = { input: DEFAULT_INPUT, output: DEFAULT_OUTPUT };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--input") options.input = path.resolve(ROOT, argv[++index]);
    if (arg.startsWith("--input=")) options.input = path.resolve(ROOT, arg.slice(8));
    if (arg === "--output") options.output = path.resolve(ROOT, argv[++index]);
    if (arg.startsWith("--output=")) options.output = path.resolve(ROOT, arg.slice(9));
  }
  return options;
}

export function writeReview({ input = DEFAULT_INPUT, output = DEFAULT_OUTPUT, index = buildIndexFromDisk() } = {}) {
  const report = JSON.parse(fs.readFileSync(input, "utf8"));
  const result = reviewCandidates(index, report);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `${JSON.stringify(result)}\n`, "utf8");
  return result;
}

function main() {
  const result = writeReview(parseArgs(process.argv.slice(2)));
  console.log(JSON.stringify(result.stats, null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
