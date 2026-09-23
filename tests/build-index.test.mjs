import test from "node:test";
import assert from "node:assert/strict";

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
  formatModuleOffset,
  normalizeLanguagePreference,
  normalizeGame,
  normalizeThemePreference,
  resolveLocale,
  resolveTheme,
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

test("builds a separate x64-only Classified catalog with signatures but no offsets", () => {
  const catalog = buildCatalogFromDisk();
  const tf2c = catalog.games.tf2c;

  assert.equal(catalog.games.tf2.entries.length, 61569);
  assert.equal(tf2c.entries.length, 9369);
  assert.deepEqual(tf2c.stats.byLibrary, { engine: 3595, server: 5774 });
  assert.equal(tf2c.stats.platforms.linux.present, 0);
  assert.equal(tf2c.stats.platforms.linux64.present, 9369);
  assert.equal(tf2c.stats.platforms.linux64.symbol, 1584);
  assert.equal(tf2c.stats.platforms.linux64["byte-pattern"], 7785);
  assert.equal(tf2c.stats.duplicates.names, 0);
  assert.equal(tf2c.stats.duplicates.extraEntries, 0);
  assert.equal(
    new Set(tf2c.entries.map((entry) => `${entry.library}|${entry.name}`)).size,
    tf2c.entries.length,
  );
  assert.equal(
    new Set(tf2c.entries.map((entry) => `${entry.library}|${entry.linux64.value}`)).size,
    tf2c.entries.length,
  );
  assert.ok(tf2c.entries.every((entry) => entry.linux === null));
  assert.ok(tf2c.entries.every((entry) => ["symbol", "byte-pattern"].includes(entry.linux64?.kind)));
  assert.ok(tf2c.entries.every((entry) => entry.linux64.offsets.length === 0));
});

test("publishes a small game manifest that points to per-game data files", () => {
  const catalog = buildCatalogFromDisk();
  const manifest = buildCatalogManifest(catalog);

  assert.deepEqual(Object.keys(manifest.games), ["tf2", "tf2c"]);
  assert.equal(manifest.games.tf2.dataFile, "tf2.json");
  assert.equal(manifest.games.tf2c.dataFile, "tf2c.json");
  assert.equal(manifest.games.tf2.stats.entries, 61569);
  assert.equal(manifest.games.tf2c.stats.entries, 9369);
  assert.ok(!("entries" in manifest.games.tf2));
  assert.ok(!("entries" in manifest.games.tf2c));
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
