import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

import {
  buildIndex,
  buildCatalogFromDisk,
  buildCatalogManifest,
  buildIndexFromDisk,
  classifySignature,
  parseGameDataText,
} from "../tools/build-index.mjs";
import {
  filterEntries,
  formatPlatformLabel,
  formatModuleOffset,
  normalizeLanguagePreference,
  normalizeGame,
  normalizeThemePreference,
  resolveLocale,
  resolveTheme,
  sourceHref,
} from "../site/app.js";
import { reviewCandidates } from "../tools/review-linux-byte-patterns.mjs";

const fixture = `"Games"
{
    "tf"
    {
        "Signatures"
        {
            "Alpha(CBaseEntity*)"
            {
                "library"  "engine"
                // linux: 0x10, 0x20
                "linux"  "@_Z5Alphav"
                // linux64: 0x30
                "linux64"  "@_Z5Alphav"
            }
            "LinuxOnly()"
            {
                "library"  "server"
                // linux: 0x40
                "linux"  "\\x55\\x48\\x89"
            }
            "Linux64Only()"
            {
                "library"  "server"
                // linux64: 0x50
                "linux64"  "@_Z12Linux64Onlyv"
            }
        }
    }
}`;

test("classifies SourceMod symbol and byte-pattern values", () => {
  assert.equal(classifySignature("@_Z3foov"), "symbol");
  assert.equal(classifySignature("\\x55\\x48\\x89"), "byte-pattern");
  assert.equal(classifySignature(""), "unknown");
});

test("parses names, libraries, platform values, and offsets", () => {
  const entries = parseGameDataText(fixture, "fixture.txt");

  assert.equal(entries.length, 3);
  assert.deepEqual(entries[0].linux, {
    value: "@_Z5Alphav",
    kind: "symbol",
    offsets: ["0x10", "0x20"],
  });
  assert.deepEqual(entries[0].linux64, {
    value: "@_Z5Alphav",
    kind: "symbol",
    offsets: ["0x30"],
  });
  assert.equal(entries[1].linux.kind, "byte-pattern");
  assert.equal(entries[1].linux64, null);
  assert.equal(entries[2].linux, null);
  assert.equal(entries[2].linux64.value, "@_Z12Linux64Onlyv");
});

test("parses three-tab SourceMod signature exports", () => {
  const text = [
    '\t"tf2classified"',
    "\t{",
    '\t\t"Signatures"',
    "\t\t{",
    '\t\t\t"ClassifiedFunction"',
    "\t\t\t{",
    '\t\t\t\t"library"\t"engine"',
    '\t\t\t\t"linux64"\t"\\x48\\x89\\xE5"',
    "\t\t\t}",
    "\t\t}",
    "\t}",
  ].join("\n");
  const [entry] = parseGameDataText(text, "tf2c.binary.engine.txt");

  assert.equal(entry.name, "ClassifiedFunction");
  assert.equal(entry.library, "engine");
  assert.equal(entry.linux64.value, "\\x48\\x89\\xE5");
  assert.equal(entry.linux, null);
});

test("builds stats without collapsing duplicate names", () => {
  const index = buildIndex([
    { fileName: "engine.txt", text: fixture },
    { fileName: "server.txt", text: fixture },
  ]);

  assert.equal(index.entries.length, 6);
  assert.equal(index.stats.entries, 6);
  assert.deepEqual(index.stats.byLibrary, { engine: 2, server: 4 });
  assert.equal(index.stats.platforms.linux.symbol, 2);
  assert.equal(index.stats.platforms.linux["byte-pattern"], 2);
  assert.equal(index.stats.platforms.linux64.missing, 2);
  assert.equal(index.stats.duplicates.names, 3);
  assert.notEqual(index.entries[0].id, index.entries[3].id);
});

test("includes reviewed Linux byte-patterns in the published TF2 index", () => {
  const index = buildIndexFromDisk();
  const ids = new Set(index.entries.map((entry) => entry.id));

  assert.ok(index.entries.length > 60000);
  assert.equal(ids.size, index.entries.length);
  assert.equal(index.stats.duplicates.names, 0);
  assert.equal(index.stats.duplicates.extraEntries, 0);
  assert.equal(index.stats.platforms.linux["byte-pattern"], 115);
  assert.equal(index.stats.platforms.linux64["byte-pattern"], 109);
  assert.equal(index.stats.platforms.linux.present, 60992);
  assert.equal(index.stats.platforms.linux64.present, 60837);
  assert.equal(index.stats.platforms.linux.missing, 577);
  assert.equal(index.stats.platforms.linux64.missing, 732);
  assert.equal(
    index.stats.platforms.linux["byte-pattern"] + index.stats.platforms.linux64["byte-pattern"],
    224,
  );
  assert.equal(index.stats.platforms.linux.unknown, 0);
  assert.equal(index.stats.platforms.linux64.unknown, 0);
});

test("builds the full x64-only Classified catalog with ELF symbols prioritized and no offsets", () => {
  const catalog = buildCatalogFromDisk();
  const tf2c = catalog.games.tf2c;

  for (const library of ["engine", "server"]) {
    const gamedata = fs.readFileSync(new URL(`../tf2c.binary.${library}.txt`, import.meta.url), "utf8");
    assert.match(gamedata, /^\/\*[^]*?\*\/\s*"Games"\s*\{\s*"tf2classified"/);
  }

  assert.equal(catalog.games.tf2.entries.length, 61569);
  assert.equal(tf2c.entries.length, 62389);
  assert.deepEqual(tf2c.stats.byLibrary, { engine: 7726, server: 54663 });
  assert.equal(tf2c.stats.platforms.linux.present, 0);
  assert.equal(tf2c.stats.platforms.linux64.present, 62389);
  assert.equal(tf2c.stats.platforms.linux64.symbol, 62389);
  assert.equal(tf2c.stats.platforms.linux64["byte-pattern"], 0);
  assert.equal(tf2c.stats.duplicates.names, 0);
  assert.equal(tf2c.stats.duplicates.extraEntries, 0);
  assert.equal(
    new Set(tf2c.entries.map((entry) => `${entry.library}|${entry.name}`)).size,
    tf2c.entries.length,
  );
  assert.ok(tf2c.entries.every((entry) => entry.linux64.kind === "symbol"));
  assert.ok(tf2c.entries.every((entry) => entry.linux64.value.startsWith("@")));
  const signaturesByValue = new Map();
  for (const entry of tf2c.entries) {
    const key = `${entry.library}|${entry.linux64.value}`;
    signaturesByValue.set(key, [...(signaturesByValue.get(key) ?? []), entry]);
  }
  assert.ok([...signaturesByValue.values()]
    .filter((group) => group.length > 1)
    .every((group) => group.every((entry) => entry.linux64.kind === "symbol")));
  assert.ok(tf2c.entries.every((entry) => entry.linux === null));
  assert.ok(tf2c.entries.every((entry) => entry.linux64?.kind === "symbol"));
  assert.ok(tf2c.entries.every((entry) => entry.linux64.value.length < 1024));
  assert.ok(tf2c.entries.every((entry) => entry.linux64.offsets.length === 0));

  const finishReload = tf2c.entries.find((entry) => entry.name === "CBaseCombatWeapon::FinishReload()");
  assert.equal(finishReload?.library, "server");
  assert.equal(finishReload?.linux64.value, "@_ZN17CBaseCombatWeapon12FinishReloadEv");
  assert.equal(finishReload?.linux64.kind, "symbol");
});

test("records the Classified symbol-first catalog policy and exact binary audit coverage", () => {
  const audit = JSON.parse(fs.readFileSync(new URL("../artifacts/tf2c-binary-signatures-audit.json", import.meta.url), "utf8"));
  const unresolved = JSON.parse(fs.readFileSync(new URL("../artifacts/tf2c-unresolved-signatures.json", import.meta.url), "utf8"));

  assert.equal(audit.schemaVersion, 4);
  assert.equal(audit.signaturePolicy, "Keep an exact ELF symbol when present. Otherwise accept only a unique match of the full demangled C++ signature and publish the symbol name that actually exists in the target ELF. Do not guess from function names or emit byte patterns for unresolved functions.");
  assert.deepEqual(audit.catalogClassification, {
    entries: 62389,
    elfSymbols: 62389,
    bytePatterns: 0,
    linuxX86Entries: 0,
  });
  assert.deepEqual(audit.target, {
    platform: "Linux x64",
    binaryBuild: "Pterodactyl server backup dated 2026-08-21",
  });
  assert.equal(audit.source.revision, "58952eecd98538861cd9b7c7a19cc6bd1380a1bf");
  assert.equal(audit.resolution.exactElfSymbols, 62307);
  assert.equal(audit.resolution.fullDemangledNameMatches, 82);
  assert.equal(audit.resolution.unresolvedSourceEntries, 486);
  assert.equal(audit.binaries.engine.sourceEntries, 7728);
  assert.equal(audit.binaries.engine.resolvedExactSymbols, 7726);
  assert.equal(audit.binaries.engine.resolvedByFullDemangledName, 0);
  assert.equal(audit.binaries.engine.unresolvedEntries, 2);
  assert.equal(audit.binaries.engine.writtenSignatures, 7726);
  assert.equal(audit.binaries.engine.machine, "EM_X86_64");
  assert.equal(audit.binaries.engine.hasStaticSymbolTable, true);
  assert.equal(audit.binaries.engine.sha256, "96254d754c3bc56d66e0d0d1a188b37e167f15d19386575d300463906e2eccb3");
  assert.equal(audit.binaries.server.sourceEntries, 55147);
  assert.equal(audit.binaries.server.resolvedExactSymbols, 54581);
  assert.equal(audit.binaries.server.resolvedByFullDemangledName, 82);
  assert.equal(audit.binaries.server.unresolvedEntries, 484);
  assert.equal(audit.binaries.server.writtenSignatures, 54663);
  assert.equal(audit.binaries.server.machine, "EM_X86_64");
  assert.equal(audit.binaries.server.hasStaticSymbolTable, true);
  assert.equal(audit.binaries.server.sha256, "f70ea14df49afaaff6a2a53640c86b81c48367d0e21939b02091835335373b1c");
  assert.equal(unresolved.entries.length, 486);
  assert.equal(unresolved.sourceRevision, audit.source.revision);
  assert.equal(unresolved.binaryBuild, audit.target.binaryBuild);
});

test("documents how much of the shared TF2 and Classified signature catalog differs", () => {
  const { tf2, tf2c } = buildCatalogFromDisk().games;
  const classifiedByKey = new Map(tf2c.entries.map((entry) => [`${entry.library}|${entry.name}`, entry]));
  const shared = tf2.entries.flatMap((entry) => {
    const classified = classifiedByKey.get(`${entry.library}|${entry.name}`);
    return classified ? [[entry, classified]] : [];
  });
  const different = shared.filter(([base, classified]) => base.linux64?.value !== classified.linux64?.value);

  assert.equal(shared.length, 54716);
  assert.equal(different.length, 510);
  assert.ok(different.some(([base, classified]) => base.name === "non-virtual thunk to CAI_BaseActor::UseSemaphore()"
    && base.linux64.value !== classified.linux64.value));
});

test("publishes a small game manifest that points to per-game data files", () => {
  const catalog = buildCatalogFromDisk();
  const manifest = buildCatalogManifest(catalog);

  assert.deepEqual(Object.keys(manifest.games), ["tf2", "tf2c"]);
  assert.equal(manifest.games.tf2.dataFile, "tf2.json");
  assert.equal(manifest.games.tf2c.dataFile, "tf2c.json");
  assert.equal(manifest.games.tf2.stats.entries, 61569);
  assert.equal(manifest.games.tf2c.stats.entries, 62389);
  assert.ok(!("entries" in manifest.games.tf2));
  assert.ok(!("entries" in manifest.games.tf2c));
});

test("uses the same total, engine, and server metrics on both game cards", () => {
  const markup = fs.readFileSync(new URL("../site/index.html", import.meta.url), "utf8");

  for (const metric of ["total", "engine", "server"]) {
    assert.match(markup, new RegExp(`id="tf2-${metric}"`));
    assert.match(markup, new RegExp(`id="tf2c-${metric}"`));
  }
  assert.doesNotMatch(markup, /id="tf2c-(?:symbols|patterns)"/);
});

test("keeps the engine library filter available for Classified", () => {
  const markup = fs.readFileSync(new URL("../site/index.html", import.meta.url), "utf8");
  const app = fs.readFileSync(new URL("../site/app.js", import.meta.url), "utf8");

  assert.match(markup, /<option value="engine">engine<\/option>/);
  assert.doesNotMatch(app, /#source option\[value="engine"\]\.hidden/);
  assert.doesNotMatch(app, /filters\.source === "engine"/);
});

test("normalizes the selected game and safely defaults unknown values to TF2", () => {
  assert.equal(normalizeGame("tf2c"), "tf2c");
  assert.equal(normalizeGame("tf2"), "tf2");
  assert.equal(normalizeGame("unknown"), "tf2");
});

test("filters entries by partial name, library, architecture, and kind", () => {
  const entries = [
    {
      name: "Alpha(CBaseEntity*)",
      library: "engine",
      linux: { value: "@_ZAlpha", kind: "symbol", offsets: [] },
      linux64: { value: "@_ZAlpha", kind: "symbol", offsets: [] },
    },
    {
      name: "Beta()",
      library: "server",
      linux: { value: "\\x55\\x48", kind: "byte-pattern", offsets: [] },
      linux64: null,
    },
  ];

  assert.equal(filterEntries(entries, { query: "cbase", source: "all", arch: "all", kind: "all" }).length, 1);
  assert.equal(filterEntries(entries, { query: "", source: "server", arch: "linux64", kind: "all" }).length, 0);
  assert.equal(filterEntries(entries, { query: "", source: "all", arch: "linux", kind: "byte-pattern" }).length, 1);
});

test("formats module offsets with a localized tooltip instead of the raw technical label", () => {
  assert.deepEqual(formatModuleOffset(["0x1230"], "ru"), {
    text: "Смещение в модуле: 0x1230",
    title: "Адрес сигнатуры относительно начала ELF-модуля.",
  });
  assert.deepEqual(formatModuleOffset(["0x1230"], "en"), {
    text: "Module offset: 0x1230",
    title: "Signature address relative to the beginning of the ELF module.",
  });
});

test("formats architecture labels and source links for result cards", () => {
  assert.equal(formatPlatformLabel("linux"), "Linux x86");
  assert.equal(formatPlatformLabel("linux64"), "Linux x64");
  assert.equal(
    sourceHref({ sourceFile: "tf2-function-signatures.game.engine.txt", sourceLine: 63 }),
    "https://github.com/MrPanica/TF2-Gamedata/blob/main/tf2-function-signatures.game.engine.txt#L63",
  );
});

test("keeps the module offset, source line, and source link on one compact footer row", () => {
  const styles = fs.readFileSync(new URL("../site/styles.css", import.meta.url), "utf8");

  assert.match(styles, /\.signature-details\s*\{[^}]*flex-wrap:\s*nowrap/);
  assert.match(styles, /\.source-line\s*\{[^}]*white-space:\s*nowrap/);
});

test("normalizes and resolves the saved theme preference", () => {
  assert.equal(normalizeThemePreference("dark"), "dark");
  assert.equal(normalizeThemePreference("light"), "light");
  assert.equal(normalizeThemePreference("system"), "system");
  assert.equal(normalizeThemePreference("neon"), "system");
  assert.equal(resolveTheme("dark", "light"), "dark");
  assert.equal(resolveTheme("light", "dark"), "light");
  assert.equal(resolveTheme("system", "light"), "light");
  assert.equal(resolveTheme("system", "dark"), "dark");
});

test("selects Russian only for Russian browser languages and preserves overrides", () => {
  assert.equal(normalizeLanguagePreference("auto"), "auto");
  assert.equal(normalizeLanguagePreference("ru"), "ru");
  assert.equal(normalizeLanguagePreference("en"), "en");
  assert.equal(normalizeLanguagePreference("de"), "auto");
  assert.equal(resolveLocale("auto", "ru-RU"), "ru");
  assert.equal(resolveLocale("auto", "en-US"), "en");
  assert.equal(resolveLocale("auto", "de-DE"), "en");
  assert.equal(resolveLocale("ru", "en-US"), "ru");
  assert.equal(resolveLocale("en", "ru-RU"), "en");
});

test("rejects ambiguous, weak, cold, and thunk byte-pattern candidates", () => {
  const index = {
    entries: [
      { id: "source.txt:1", name: "Safe()", library: "server", linux: null, linux64: null },
      { id: "source.txt:2", name: "Speak()", library: "server", linux: null, linux64: null },
      { id: "source.txt:3", name: "Delete()", library: "server", linux: null, linux64: null },
      { id: "source.txt:4", name: "Cold()", library: "server", linux: null, linux64: null },
      { id: "source.txt:5", name: "Thunk()", library: "server", linux: null, linux64: null },
    ],
  };
  const candidate = (entryId, name, overrides = {}) => ({
    entryId,
    name,
    library: "server",
    platform: "linux",
    pattern: "\\x55\\x48\\x89\\xE5\\x90\\x90\\x90\\x90",
    fixedBytes: 8,
    matches: 1,
    symbol: "_Zsafev",
    address: "0x1000",
    ...overrides,
  });
  const report = {
    candidates: [
      candidate("source.txt:1", "Safe()"),
      candidate("source.txt:2", "Speak()", { matches: 1644 }),
      candidate("source.txt:2", "Speak()", { address: "0x2000" }),
      candidate("source.txt:3", "Delete()", { fixedBytes: 7 }),
      candidate("source.txt:4", "Cold()", { symbol: "_Zcoldv.cold" }),
      candidate("source.txt:5", "non-virtual thunk to Thunk()", { symbol: "_ZThn4_N5ThunkEv" }),
    ],
  };

  const result = reviewCandidates(index, report);
  assert.equal(result.stats.promotable, 1);
  assert.equal(result.stats.manualReview, 2);
  assert.equal(result.stats.rejectedRows, 3);
  assert.equal(result.stats.noCandidate, 5);
  assert.equal(result.promotable[0].name, "Safe()");
  assert.equal(result.rejected.find((item) => item.name === "Speak()").rejectReason, "multiple-candidates-for-source-slot");
  assert.equal(result.rejected.find((item) => item.name === "Delete()").rejectReason, "too-few-fixed-bytes");
  assert.equal(result.manualReview[0].reviewReason, "compiler-cold-fragment");
});
