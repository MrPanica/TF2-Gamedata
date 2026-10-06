const PAGE_SIZE = 80;
const THEME_STORAGE_KEY = "tf2-gamedata-theme";
const LANGUAGE_STORAGE_KEY = "tf2-gamedata-language";

const translations = {
  ru: {
    languageLabel: "Язык",
    languageAuto: "Авто",
    languageRussian: "Русский",
    languageEnglish: "English",
    themeLabel: "Тема",
    themeSystem: "Системная",
    themeLight: "Светлая",
    themeDark: "Тёмная",
    gamesAria: "Игры",
    titleTf2: "Каталог GameData — Team Fortress 2",
    titleTf2c: "Каталог GameData — Team Fortress 2 Classified",
    openTf2: "Открыть каталог Team Fortress 2",
    openTf2c: "Открыть каталог Team Fortress 2 Classified",
    tf2Stamp: "Linux x86 / x64 · Live Updates",
    tf2Description: "Живой каталог сигнатур и смещений движка и сервера (автоматическое обновление).",
    entriesLabel: "записей",
    signatureCount: "сигнатур",
    symbolCount: "ELF symbols",
    classifiedStamp: "Архив · Linux x64 (21.08.2026)",
    classifiedDescription: "Архивный снимок от 21.08.2026 (поддержка заморожена).",
    classifiedOnlyX64: "Для Classified доступны только сигнатуры Linux x64.",
    catalogAria: "Список сигнатур",
    catalogTitle: "Список сигнатур",
    tabSignatures: "Сигнатуры",
    tabVtables: "VTable",
    vtablesMetaLabel: "офсетов",
    searchTitle: "Поиск и фильтры",
    queryLabel: "Название или сигнатура",
    queryPlaceholder: "Например: AddEmptyMesh или FindEntityByClassname",
    libraryLabel: "Библиотека",
    architectureLabel: "Архитектура",
    kindLabel: "Тип",
    offsetLabel: "Оффсет",
    copyOffset: "Копировать оффсет",
    changelogButton: "Журнал обновлений",
    changelogTitle: "Журнал обновлений сигнатур и VTable",
    changelogTypeCol: "Тип",
    changelogDetailsCol: "Изменение",
    vtablesButton: "Таблица VTable (Офсеты)",
    vtablesTitle: "Таблица виртуальных оффсетов VTable (L / W)",
    searchVtablePlaceholder: "Поиск по классу (напр. CRestore, CBaseEntity) или методу...",
    vtableClassSelect: "Выберите класс:",
    allLibraries: "Все библиотеки",
    vtableMethodCol: "Функция / Метод",
    copySnippet: "GameData",
    oldOffsetLabel: "Было",
    newOffsetLabel: "Стало",
    diffLabel: "Сдвиг",
    functionNameCol: "Функция",
    libraryCol: "Библиотека / Платформа",
    searchChangelogPlaceholder: "Поиск по изменённым функциям...",
    showInCatalog: "Открыть в каталоге",
    noUpdatesFound: "Изменений по запросу не найдено.",
    all: "Все",
    allEntries: "Все записи",
    linuxX86: "x86",
    linuxX64: "x64",
    bothArchitectures: "Обе архитектуры",
    missingArchitecture: "Только с пропуском",
    elfSymbol: "ELF symbol",
    bytePattern: "Byte-pattern",
    summaryAria: "Статистика",
    resultsTitle: "Результаты",
    reset: "Сбросить",
    noResults: "Ничего не найдено",
    noResultsHint: "Попробуйте сократить запрос или изменить фильтры.",
    footer: "GameData Catalog · статический индекс SourceMod",
    sourceRepository: "Исходный репозиторий ↗",
    totalEntries: "Всего записей",
    duplicateNames: "{count} повторяющихся имён",
    withoutX86: "{count} без x86-сигнатуры",
    withoutX64: "{count} без x64-сигнатуры",
    currentFiles: "в каталоге",
    updated: "Обновлено {date}",
    noSignature: "нет сигнатуры",
    missingText: "Для этой архитектуры значение отсутствует в исходном GameData.",
    copy: "Копировать",
    copied: "Скопировано",
    copyFailed: "Не удалось",
    linuxX86Platform: "x86",
    linuxX64Platform: "x64",
    foundShown: "Найдено {found} · показано {shown}",
    loadingIndex: "Загрузка индекса…",
    noResultsStatus: "Ничего не найдено",
    loadError: "Не удалось загрузить индекс: {message}",
    loadErrorStatus: "Ошибка загрузки",
  },
  en: {
    languageLabel: "Language",
    languageAuto: "Auto",
    languageRussian: "Русский",
    languageEnglish: "English",
    themeLabel: "Theme",
    themeSystem: "System",
    themeLight: "Light",
    themeDark: "Dark",
    gamesAria: "Games",
    titleTf2: "GameData Catalog — Team Fortress 2",
    titleTf2c: "GameData Catalog — Team Fortress 2 Classified",
    openTf2: "Open the Team Fortress 2 catalog",
    openTf2c: "Open the Team Fortress 2 Classified catalog",
    tf2Stamp: "Linux x86 / x64 · Live Updates",
    tf2Description: "Live auto-catalog of signatures and offsets (updated on each game update).",
    entriesLabel: "entries",
    signatureCount: "signatures",
    symbolCount: "ELF symbols",
    classifiedStamp: "Archive · Linux x64 (2026-08-21)",
    classifiedDescription: "Archived snapshot as of 2026-08-21 (maintenance frozen).",
    classifiedOnlyX64: "Classified signatures are available for Linux x64 only.",
    catalogAria: "Signature list",
    catalogTitle: "Signature list",
    tabSignatures: "Signatures",
    tabVtables: "VTable",
    vtablesMetaLabel: "offsets",
    searchTitle: "Search and filters",
    queryLabel: "Name or signature",
    queryPlaceholder: "For example: AddEmptyMesh or FindEntityByClassname",
    libraryLabel: "Library",
    architectureLabel: "Architecture",
    kindLabel: "Type",
    offsetLabel: "Offset",
    copyOffset: "Copy offset",
    changelogButton: "Update Changelog",
    changelogTitle: "Signatures & VTable Changelog",
    changelogTypeCol: "Type",
    changelogDetailsCol: "Change",
    vtablesButton: "VTable Offsets",
    vtablesTitle: "Virtual Method Table Offsets (L / W)",
    searchVtablePlaceholder: "Search class (e.g. CRestore, CBaseEntity) or method...",
    vtableClassSelect: "Select class:",
    allLibraries: "All libraries",
    vtableMethodCol: "Function / Method",
    copySnippet: "GameData",
    oldOffsetLabel: "Previous",
    newOffsetLabel: "Current",
    diffLabel: "Shift",
    functionNameCol: "Function",
    libraryCol: "Library / Platform",
    searchChangelogPlaceholder: "Search updated functions...",
    showInCatalog: "Open in catalog",
    noUpdatesFound: "No changes matching query.",
    all: "All",
    allEntries: "All entries",
    linuxX86: "x86",
    linuxX64: "x64",
    bothArchitectures: "Both architectures",
    missingArchitecture: "Missing one architecture",
    elfSymbol: "ELF symbol",
    bytePattern: "Byte-pattern",
    summaryAria: "Statistics",
    resultsTitle: "Results",
    reset: "Reset",
    noResults: "No results",
    noResultsHint: "Try a shorter query or change the filters.",
    footer: "GameData Catalog · static SourceMod index",
    sourceRepository: "Source repository ↗",
    totalEntries: "Total entries",
    duplicateNames: "{count} duplicate names",
    withoutX86: "{count} without an x86 signature",
    withoutX64: "{count} without an x64 signature",
    currentFiles: "in the catalog",
    updated: "Updated {date}",
    noSignature: "no signature",
    missingText: "No value for this architecture exists in the source GameData.",
    copy: "Copy",
    copied: "Copied",
    copyFailed: "Failed",
    linuxX86Platform: "x86",
    linuxX64Platform: "x64",
    foundShown: "Found {found} · showing {shown}",
    loadingIndex: "Loading index…",
    noResultsStatus: "No results",
    loadError: "Could not load index: {message}",
    loadErrorStatus: "Loading error",
  },
};

let currentLocale = "ru";

export function normalizeThemePreference(value) {
  return ["system", "light", "dark"].includes(value) ? value : "system";
}

export function resolveTheme(preference, systemTheme) {
  const normalizedPreference = normalizeThemePreference(preference);
  return normalizedPreference === "system" ? systemTheme : normalizedPreference;
}

export function normalizeLanguagePreference(value) {
  return ["auto", "ru", "en"].includes(value) ? value : "auto";
}

export function resolveLocale(preference, browserLanguage = "en") {
  const normalizedPreference = normalizeLanguagePreference(preference);
  if (normalizedPreference !== "auto") return normalizedPreference;
  return String(browserLanguage).toLocaleLowerCase().startsWith("ru") ? "ru" : "en";
}

export function normalizeGame(value) {
  return value === "tf2c" ? "tf2c" : "tf2";
}

function translate(key, values = {}) {
  let value = translations[currentLocale][key] ?? translations.en[key] ?? key;
  for (const [name, replacement] of Object.entries(values)) {
    value = value.replace(`{${name}}`, String(replacement));
  }
  return value;
}

function getStoredValue(key, normalize, fallback) {
  try {
    return normalize(localStorage.getItem(key));
  } catch {
    return fallback;
  }
}

function applyTheme(preference) {
  const normalizedPreference = normalizeThemePreference(preference);
  document.documentElement.dataset.theme = normalizedPreference;
  const systemTheme = window.matchMedia?.("(prefers-color-scheme: light)").matches ? "light" : "dark";
  document.documentElement.style.colorScheme = resolveTheme(normalizedPreference, systemTheme);
}

function initThemePicker() {
  const themeSelect = document.querySelector("#theme-select");
  if (!themeSelect) return;

  themeSelect.value = getStoredValue(THEME_STORAGE_KEY, normalizeThemePreference, "system");
  applyTheme(themeSelect.value);
  themeSelect.addEventListener("change", () => {
    const preference = normalizeThemePreference(themeSelect.value);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, preference);
    } catch {
      // Theme selection still applies when storage is unavailable.
    }
    applyTheme(preference);
  });
}

function applyStaticLocale(preference) {
  const browserLanguage = typeof navigator === "undefined" ? "en" : navigator.language;
  currentLocale = resolveLocale(preference, browserLanguage);
  document.documentElement.lang = currentLocale;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = translate(node.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    node.placeholder = translate(node.dataset.i18nPlaceholder);
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((node) => {
    node.setAttribute("aria-label", translate(node.dataset.i18nAria));
  });
}

function initLanguagePicker(onChange) {
  const languageSelect = document.querySelector("#language-select");
  if (!languageSelect) return;

  const preference = getStoredValue(LANGUAGE_STORAGE_KEY, normalizeLanguagePreference, "auto");
  languageSelect.value = preference;
  applyStaticLocale(preference);
  languageSelect.addEventListener("change", () => {
    const nextPreference = normalizeLanguagePreference(languageSelect.value);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, nextPreference);
    } catch {
      // Language selection still applies when storage is unavailable.
    }
    applyStaticLocale(nextPreference);
    onChange?.();
  });
}

export function filterEntries(entries, filters) {
  const query = (filters.query ?? "").trim().toLocaleLowerCase();
  const source = filters.source ?? "all";
  const arch = filters.arch ?? "all";
  const kind = filters.kind ?? "all";

  return entries.filter((entry) => {
    if (source !== "all" && entry.library !== source) return false;

    const hasLinux = Boolean(entry.linux);
    const hasLinux64 = Boolean(entry.linux64);
    if (arch === "linux" && !hasLinux) return false;
    if (arch === "linux64" && !hasLinux64) return false;
    if (arch === "both" && (!hasLinux || !hasLinux64)) return false;
    if (arch === "missing" && hasLinux && hasLinux64) return false;

    if (kind !== "all") {
      const hasKind = [entry.linux, entry.linux64]
        .filter(Boolean)
        .some((signature) => signature.kind === kind);
      if (!hasKind) return false;
    }

    if (!query) return true;
    const cleanHex = query.startsWith("0x") ? query.slice(2) : query;
    const isHex = /^[0-9a-f]{3,8}$/i.test(cleanHex);
    const searchable = [
      entry.name,
      entry.library,
      entry.sourceFile,
      entry.linux?.value,
      entry.linux64?.value,
      ...(entry.linux?.offsets ?? []),
      ...(entry.linux64?.offsets ?? []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase();
    if (searchable.includes(query)) return true;
    if (isHex && searchable.includes(`0x${cleanHex}`)) return true;
    return false;
  });
}

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function formatNumber(value) {
  return new Intl.NumberFormat(currentLocale === "ru" ? "ru-RU" : "en-US").format(value);
}

function formatDate(value) {
  return new Intl.DateTimeFormat(currentLocale === "ru" ? "ru-RU" : "en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function signatureLabel(kind) {
  return kind === "byte-pattern" ? translate("bytePattern") : translate("elfSymbol");
}

export function formatModuleOffset(offsets, locale = currentLocale) {
  const russian = locale === "ru";
  return {
    text: `${russian ? "Смещение в модуле" : "Module offset"}: ${offsets.join(", ")}`,
    title: russian
      ? "Адрес сигнатуры относительно начала ELF-модуля."
      : "Signature address relative to the beginning of the ELF module.",
  };
}

export function formatPlatformLabel(platform) {
  return platform === "linux64" ? "Linux x64" : "Linux x86";
}

function makeCopyIcon() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("width", "17");
  svg.setAttribute("height", "17");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "1.8");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  const page = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  page.setAttribute("x", "8");
  page.setAttribute("y", "8");
  page.setAttribute("width", "13");
  page.setAttribute("height", "13");
  page.setAttribute("rx", "2");
  const backPage = document.createElementNS("http://www.w3.org/2000/svg", "path");
  backPage.setAttribute("d", "M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h3");
  svg.append(page, backPage);
  return svg;
}

function makeStat(label, value, hint) {
  const card = element("div", "stat-card");
  card.append(element("span", "stat-label", label));
  card.append(element("strong", "stat-value", formatNumber(value)));
  card.append(element("span", "stat-hint", hint));
  return card;
}

function renderGameCards(games, selectedGame) {
  document.querySelectorAll("[data-game-card]").forEach((card) => {
    const game = card.dataset.gameCard;
    const selected = game === selectedGame;
    if (selected) card.setAttribute("aria-current", "page");
    else card.removeAttribute("aria-current");
  });

  const tf2 = games.tf2.stats;
  const tf2c = games.tf2c.stats;
  const tf2Libraries = tf2.byLibrary ?? {};
  const tf2cLibraries = tf2c.byLibrary ?? {};
  document.querySelector("#tf2-total").textContent = formatNumber(tf2.entries);
  document.querySelector("#tf2-engine").textContent = formatNumber(tf2Libraries.engine ?? 0);
  document.querySelector("#tf2-server").textContent = formatNumber(tf2Libraries.server ?? 0);
  const elTf2V = document.querySelector("#tf2-vtables");
  if (elTf2V) elTf2V.textContent = formatNumber(tf2.vtables ?? 232270);

  document.querySelector("#tf2c-total").textContent = formatNumber(tf2c.entries);
  document.querySelector("#tf2c-engine").textContent = formatNumber(tf2cLibraries.engine ?? 0);
  document.querySelector("#tf2c-server").textContent = formatNumber(tf2cLibraries.server ?? 0);
  const elTf2cV = document.querySelector("#tf2c-vtables");
  if (elTf2cV) elTf2cV.textContent = tf2c.vtables ? formatNumber(tf2c.vtables) : "—";
}

function renderSummary(index, selectedGame) {
  const summary = document.querySelector("#summary");
  const linux = index.stats.platforms.linux;
  const linux64 = index.stats.platforms.linux64;
  const stats = [
    makeStat(translate("totalEntries"), index.stats.entries, translate("duplicateNames", { count: formatNumber(index.stats.duplicates.names) })),
  ];
  if (selectedGame === "tf2c") {
    stats.push(
      makeStat(translate("symbolCount"), linux64.symbol, translate("linuxX64Platform")),
      makeStat(translate("bytePattern"), linux64["byte-pattern"], translate("linuxX64Platform")),
    );
  } else {
    stats.push(
      makeStat(translate("linuxX86"), linux.present, translate("withoutX86", { count: formatNumber(linux.missing) })),
      makeStat(translate("linuxX64"), linux64.present, translate("withoutX64", { count: formatNumber(linux64.missing) })),
      makeStat(translate("bytePattern"), linux["byte-pattern"] + linux64["byte-pattern"], translate("currentFiles")),
    );
  }
  summary.hidden = false;
  summary.classList.toggle("stats-three", selectedGame === "tf2c");
  summary.replaceChildren(...stats);
  document.querySelector("#data-version").textContent = translate("updated", { date: formatDate(index.generatedAt) });
  document.querySelector("#game-note").hidden = selectedGame !== "tf2c";
}

function makePlatformBlock(label, signature) {
  const block = element("div", "platform-block");
  const heading = element("div", "platform-heading");
  heading.append(element("span", "platform-label", label));

  if (!signature) {
    heading.append(element("span", "badge badge-muted", translate("noSignature")));
    block.append(heading, element("p", "missing-text", translate("missingText")));
    return block;
  }

  heading.append(element("span", `badge ${signature.kind === "byte-pattern" ? "badge-warning" : "badge-accent"}`, signatureLabel(signature.kind)));
  if (signature.offsets.length) {
    const moduleOffset = formatModuleOffset(signature.offsets);
    const offset = element("span", "offsets", moduleOffset.text);
    offset.title = moduleOffset.title;
    heading.append(offset);
    offset.dataset.copyValue = signature.offsets.join(", ");
    offset.setAttribute("role", "button");
    offset.tabIndex = 0;
  }
  block.append(heading);

  const codeRow = element("div", "code-row");
  const code = element("code", "signature-value", signature.value);
  const copy = element("button", "button button-copy");
  copy.type = "button";
  copy.dataset.copyValue = signature.value;
  copy.title = translate("copy");
  copy.setAttribute("aria-label", translate("copy"));
  copy.append(makeCopyIcon());
  codeRow.append(code, copy);
  block.append(codeRow);

  return block;
}

function makeResultCard(entry, selectedGame) {
  const card = element("article", "result-card");
  const header = element("div", "result-header");
  const title = element("h3", "result-name", entry.name);
  const library = element("span", "badge badge-library", entry.library);
  header.append(title, library);

  const platforms = element("div", `platforms${selectedGame === "tf2c" ? " single-platform" : ""}`);
  if (selectedGame === "tf2c") {
    platforms.append(makePlatformBlock(formatPlatformLabel("linux64"), entry.linux64));
  } else {
    platforms.append(
      makePlatformBlock(formatPlatformLabel("linux"), entry.linux),
      makePlatformBlock(formatPlatformLabel("linux64"), entry.linux64),
    );
  }

  card.append(header, platforms);
  return card;
}

function readFilters() {
  const params = new URLSearchParams(window.location.search);
  return {
    query: params.get("q") ?? "",
    source: params.get("source") ?? "all",
    arch: params.get("arch") ?? "all",
    kind: params.get("kind") ?? "all",
  };
}

function writeFilters(filters) {
  const url = new URL(window.location.href);
  const names = { query: "q", source: "source", arch: "arch", kind: "kind" };
  for (const [key, name] of Object.entries(names)) {
    const value = filters[key];
    if (value && value !== "all") url.searchParams.set(name, value);
    else url.searchParams.delete(name);
  }
  window.history.replaceState(null, "", url);
}

async function copyText(value) {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    const textarea = element("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();
    return copied;
  }
}

function init() {
  initThemePicker();
  const selectedGame = normalizeGame(new URLSearchParams(window.location.search).get("game"));
  document.documentElement.dataset.game = selectedGame;

  const queryInput = document.querySelector("#query");
  const sourceInput = document.querySelector("#source");
  const archInput = document.querySelector("#arch");
  const kindInput = document.querySelector("#kind");
  const results = document.querySelector("#results");
  const status = document.querySelector("#status");
  const loading = document.querySelector("#loading");
  const empty = document.querySelector("#empty");
  const error = document.querySelector("#error");
  const sentinel = document.querySelector("#sentinel");
  const reset = document.querySelector("#reset");

  const filters = readFilters();
  if (selectedGame === "tf2c") {
    document.querySelectorAll('[data-game-filter="tf2"]').forEach((option) => { option.hidden = true; });
    if (["linux", "both", "missing"].includes(filters.arch)) filters.arch = "all";
  }
  queryInput.value = filters.query;
  sourceInput.value = filters.source;
  archInput.value = filters.arch;
  kindInput.value = filters.kind;

  const state = { catalog: null, index: null, filtered: [], rendered: 0 };

  function currentFilters() {
    return {
      query: queryInput.value,
      source: sourceInput.value,
      arch: archInput.value,
      kind: kindInput.value,
    };
  }

  function renderMore() {
    if (!state.index || state.rendered >= state.filtered.length) return;
    const next = state.filtered.slice(state.rendered, state.rendered + PAGE_SIZE);
    const fragment = document.createDocumentFragment();
    next.forEach((entry) => fragment.append(makeResultCard(entry, selectedGame)));
    results.append(fragment);
    state.rendered += next.length;
    sentinel.hidden = state.rendered >= state.filtered.length;
    status.textContent = translate("foundShown", { found: formatNumber(state.filtered.length), shown: formatNumber(state.rendered) });
  }

  function applyFilters() {
    if (!state.index) return;
    const nextFilters = currentFilters();
    writeFilters(nextFilters);
    state.filtered = filterEntries(state.index.entries, nextFilters);
    state.rendered = 0;
    results.replaceChildren();
    empty.hidden = state.filtered.length !== 0;
    sentinel.hidden = state.filtered.length === 0;
    renderMore();
    if (state.filtered.length === 0) status.textContent = translate("noResultsStatus");
  }

  initLanguagePicker(() => {
    document.title = translate(selectedGame === "tf2c" ? "titleTf2c" : "titleTf2");
    if (!state.catalog) return;
    renderGameCards(state.catalog.games, selectedGame);
    renderSummary(state.index, selectedGame);
    applyFilters();
  });
  document.title = translate(selectedGame === "tf2c" ? "titleTf2c" : "titleTf2");

  results.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-copy-value]");
    if (!button) return;
    const copied = await copyText(button.dataset.copyValue);
    const state = copied ? "copied" : "failed";
    const label = translate(copied ? "copied" : "copyFailed");
    const isOffset = button.classList.contains("offsets");
    button.dataset.copyState = state;
    button.title = label;
    button.setAttribute("aria-label", label);

    if (isOffset) {
      const origText = button.textContent;
      button.textContent = copied ? `✓ ${label}` : label;
      window.setTimeout(() => {
        delete button.dataset.copyState;
        button.textContent = origText;
        button.title = formatModuleOffset(button.dataset.copyValue.split(", ")).title;
      }, 1400);
      return;
    }

    window.setTimeout(() => {
      delete button.dataset.copyState;
      button.title = translate("copy");
      button.setAttribute("aria-label", translate("copy"));
    }, 1400);
  });

  [queryInput, sourceInput, archInput, kindInput].forEach((control) => {
    control.addEventListener("input", applyFilters);
    control.addEventListener("change", applyFilters);
  });

  reset.addEventListener("click", () => {
    queryInput.value = "";
    sourceInput.value = "all";
    archInput.value = "all";
    kindInput.value = "all";
    applyFilters();
    queryInput.focus();
  });

  const observer = new IntersectionObserver((observations) => {
    if (observations.some((observation) => observation.isIntersecting)) renderMore();
  }, { rootMargin: "480px" });
  observer.observe(sentinel);

  status.textContent = translate("loadingIndex");
  fetch("./data/catalog-manifest.json", { cache: "no-store" })
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then((manifest) => {
      const game = manifest.games?.[selectedGame];
      if (!game?.dataFile) throw new Error(`Missing catalog for ${selectedGame}`);
      renderGameCards(manifest.games, selectedGame);
      return fetch(`./data/${game.dataFile}`, { cache: "no-store" })
        .then((response) => {
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          return response.json();
        })
        .then((index) => ({ manifest, index }));
    })
    .then(({ manifest, index }) => {
      state.catalog = manifest;
      state.index = index;
      renderGameCards(manifest.games, selectedGame);
      renderSummary(index, selectedGame);
      loading.hidden = true;
      applyFilters();
      initChangelog();
      initCatalogTabs(selectedGame);
    })
    .catch((loadError) => {
      loading.hidden = true;
      error.textContent = translate("loadError", { message: loadError.message });
      error.hidden = false;
      status.textContent = translate("loadErrorStatus");
      initChangelog();
      initCatalogTabs(selectedGame);
    });
}

function initChangelog() {
  const changelogBtn = document.querySelector("#btn-changelog");
  const modal = document.querySelector("#changelog-modal");
  const closeBtn = document.querySelector("#modal-close");
  const body = document.querySelector("#changelog-body");
  const searchInput = document.querySelector("#changelog-search");
  const meta = document.querySelector("#changelog-meta");
  if (!changelogBtn || !modal) return;

  let updatesData = null;

  async function loadUpdates() {
    try {
      const res = await fetch("./data/updates.json", { cache: "no-store" });
      if (!res.ok) return;
      updatesData = await res.json();
      if (updatesData?.updates?.length) {
        changelogBtn.hidden = false;
        const latest = updatesData.updates[0];
        const countStr = latest.sampleCount || latest.sampleChanges?.length || "";
        const label = changelogBtn.querySelector("[data-i18n='changelogButton']");
        if (label) label.textContent = `${translate("changelogButton")}${countStr ? ` (${countStr})` : ""}`;
      }
    } catch {
      // Ignore if updates.json is not present
    }
  }

  function renderChangelogList(filterText = "") {
    if (!body || !updatesData?.updates) return;
    const filter = filterText.trim().toLowerCase();
    body.replaceChildren();

    updatesData.updates.forEach((update) => {
      const card = element("div", "changelog-entry-card");
      const header = element("div", "changelog-entry-header");
      const title = element("h3", "changelog-entry-title", update.title || update.buildId);
      const date = element("span", "changelog-entry-date", formatDate(update.date));
      header.append(title, date);

      const statsRow = element("div", "changelog-stats-row");
      if (update.stats) {
        if (update.stats.signaturesCount || update.stats.totalSignatures) {
          statsRow.append(
            element("span", "badge badge-accent", `Сигнатур: ${formatNumber(update.stats.signaturesCount || update.stats.totalSignatures)}`),
            element("span", "badge badge-library", `VTable: ${formatNumber(update.stats.vtablesCount || update.stats.vtablesMethods || 232270)}`),
            element("span", "badge badge-warning", `Классов: ${formatNumber(update.stats.classesCount || update.stats.vtablesClasses || 3391)}`),
          );
        } else if (update.stats.totalChanged) {
          statsRow.append(
            element("span", "badge badge-accent", `Изменений: ${formatNumber(update.stats.totalChanged)}`),
          );
        }
      }

      const tableWrap = element("div", "changelog-table-wrap");
      const table = element("table", "changelog-table");
      const thead = element("thead");
      const headRow = element("tr");
      headRow.append(
        element("th", "", translate("changelogTypeCol")),
        element("th", "", translate("functionNameCol")),
        element("th", "", translate("libraryCol")),
        element("th", "", translate("changelogDetailsCol")),
      );
      thead.append(headRow);
      table.append(thead);

      const tbody = element("tbody");
      const samples = (update.sampleChanges || []).filter((item) => {
        // Skip raw offset shifts like 0x913C0 -> 0x91460
        if (item.oldOffset && item.newOffset && String(item.oldOffset).startsWith("0x")) {
          return false;
        }
        if (!filter) return true;
        const nameMatch = (item.name || "").toLowerCase().includes(filter);
        const typeMatch = (item.type || "").toLowerCase().includes(filter);
        const detailsMatch = (item.details || "").toLowerCase().includes(filter);
        const libMatch = (item.library || "").toLowerCase().includes(filter);
        return nameMatch || typeMatch || detailsMatch || libMatch;
      });

      if (samples.length === 0) {
        const tr = element("tr");
        const td = element("td", "muted", translate("noUpdatesFound"));
        td.colSpan = 4;
        tr.append(td);
        tbody.append(tr);
      } else {
        samples.slice(0, 150).forEach((item) => {
          const tr = element("tr");
          const tdType = element("td", "");
          const type = item.type || (item.name?.includes("::") ? "vtable" : "symbol");
          if (type === "vtable") {
            tdType.append(element("span", "badge badge-accent", "VTable"));
          } else if (type === "byte-pattern") {
            tdType.append(element("span", "badge badge-warning", "Byte-pattern"));
          } else {
            tdType.append(element("span", "badge badge-library", "ELF symbol"));
          }

          const tdName = element("td", "changelog-func-name");
          const nameLink = element("button", "link-button", item.name);
          nameLink.type = "button";
          nameLink.title = translate("showInCatalog");
          nameLink.addEventListener("click", () => {
            modal.close();
            if (type === "vtable") {
              const tabVt = document.querySelector("#tab-vtables");
              if (tabVt) tabVt.click();
              const q = document.querySelector("#vtable-query");
              if (q) {
                q.value = item.name;
                q.dispatchEvent(new Event("input", { bubbles: true }));
                q.scrollIntoView({ behavior: "smooth" });
              }
            } else {
              const tabSig = document.querySelector("#tab-signatures");
              if (tabSig) tabSig.click();
              const q = document.querySelector("#query");
              if (q) {
                q.value = item.name;
                q.dispatchEvent(new Event("input", { bubbles: true }));
                q.scrollIntoView({ behavior: "smooth" });
              }
            }
          });
          tdName.append(nameLink);

          const tdLib = element("td", "", `${item.library || ""} ${item.platform ? `(${item.platform})` : ""}`.trim());
          const tdDetails = element("td", "changelog-details", item.details || "—");
          tr.append(tdType, tdName, tdLib, tdDetails);
          tbody.append(tr);
        });
      }

      table.append(tbody);
      tableWrap.append(table);
      card.append(header, statsRow, tableWrap);
      body.append(card);
    });
  }

  changelogBtn.addEventListener("click", () => {
    modal.showModal();
    if (meta && updatesData?.latestBuild) {
      meta.textContent = `${translate("currentFiles")}: build ${updatesData.latestBuild} (${formatDate(updatesData.updatedAt)})`;
    }
    renderChangelogList(searchInput?.value || "");
    searchInput?.focus();
  });

  closeBtn?.addEventListener("click", () => modal.close());
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.close();
  });

  searchInput?.addEventListener("input", () => {
    renderChangelogList(searchInput.value);
  });

  loadUpdates();
}

function initCatalogTabs(selectedGame) {
  const tabSignatures = document.querySelector("#tab-signatures");
  const tabVtables = document.querySelector("#tab-vtables");
  const signaturesControls = document.querySelector("#signatures-search-controls");
  const vtablesControls = document.querySelector("#vtables-search-controls");
  const signaturesView = document.querySelector("#signatures-view");
  const vtablesView = document.querySelector("#vtables-view");
  const vtableQueryInput = document.querySelector("#vtable-query");
  const vtableClassSelect = document.querySelector("#vtable-class");
  const vtableSourceSelect = document.querySelector("#vtable-source");
  const vtablesContainer = document.querySelector("#vtables-container");
  const vtableViewTitle = document.querySelector("#vtable-view-title");
  const vtableViewStatus = document.querySelector("#vtable-view-status");

  if (!tabSignatures || !tabVtables) return;

  if (selectedGame !== "tf2") {
    tabVtables.hidden = true;
  } else {
    tabVtables.hidden = false;
  }

  let activeTab = "signatures";
  let vtablesData = null;
  let loadingPromise = null;
  let currentVTableClass = "CRestore";

  function switchTab(newTab) {
    activeTab = newTab;
    tabSignatures.classList.toggle("active", activeTab === "signatures");
    tabSignatures.setAttribute("aria-selected", activeTab === "signatures");
    tabVtables.classList.toggle("active", activeTab === "vtables");
    tabVtables.setAttribute("aria-selected", activeTab === "vtables");

    if (signaturesControls) signaturesControls.hidden = activeTab !== "signatures";
    if (vtablesControls) vtablesControls.hidden = activeTab !== "vtables";
    if (signaturesView) signaturesView.hidden = activeTab !== "signatures";
    if (vtablesView) vtablesView.hidden = activeTab !== "vtables";

    if (activeTab === "vtables") {
      ensureVTablesLoaded();
    }
  }

  tabSignatures.addEventListener("click", () => switchTab("signatures"));
  tabVtables.addEventListener("click", () => switchTab("vtables"));

  async function loadVTablesData() {
    if (vtablesData) return vtablesData;
    if (loadingPromise) return loadingPromise;
    loadingPromise = (async () => {
      try {
        const res = await fetch("./data/tf2-vtables.json");
        if (!res.ok) throw new Error("HTTP " + res.status);
        vtablesData = await res.json();
        return vtablesData;
      } catch (err) {
        console.warn("Failed to load tf2-vtables.json", err);
        return null;
      }
    })();
    return loadingPromise;
  }

  async function ensureVTablesLoaded() {
    if (!vtablesData) {
      if (vtablesContainer) {
        vtablesContainer.replaceChildren(element("div", "state", translate("loadingIndex")));
      }
      await loadVTablesData();
      if (!vtablesData) {
        if (vtablesContainer) {
          vtablesContainer.replaceChildren(element("div", "state state-error", "Не удалось загрузить данные VTable."));
        }
        return;
      }
    }

    updateVTableClassSelect();
    renderCurrentVTable();
  }

  function getMethodShortName(name) {
    const m = name.match(/::([~a-zA-Z0-9_]+)\(/);
    return m ? m[1] : name;
  }

  function updateVTableClassSelect() {
    if (!vtableClassSelect || !vtablesData?.classes) return;
    const currentLib = vtableSourceSelect?.value || "all";

    const sortedClasses = Object.keys(vtablesData.classes).sort((a, b) => a.localeCompare(b));
    const filtered = sortedClasses.filter((cls) => {
      const info = vtablesData.classes[cls];
      if (currentLib !== "all" && info.library !== currentLib) return false;
      return true;
    });

    vtableClassSelect.replaceChildren();
    filtered.slice(0, 1000).forEach((cls) => {
      const opt = document.createElement("option");
      opt.value = cls;
      opt.textContent = `${cls} (${vtablesData.classes[cls].methods.length})`;
      if (cls === currentVTableClass) opt.selected = true;
      vtableClassSelect.append(opt);
    });

    if (filtered.length > 0 && !filtered.includes(currentVTableClass)) {
      currentVTableClass = filtered[0];
      vtableClassSelect.value = currentVTableClass;
    }
  }

  function renderCurrentVTable() {
    if (!vtablesContainer || !vtablesData?.classes) return;
    const classInfo = vtablesData.classes[currentVTableClass];
    if (!classInfo) {
      vtablesContainer.replaceChildren(element("div", "state", `Класс "${currentVTableClass}" не найден.`));
      return;
    }

    const filterText = (vtableQueryInput?.value || "").trim().toLowerCase();

    if (vtableViewTitle) {
      vtableViewTitle.textContent = `${currentVTableClass} (${classInfo.library})`;
    }
    if (vtableViewStatus) {
      vtableViewStatus.textContent = `${formatNumber(classInfo.methods.length)} виртуальных методов / офсетов`;
    }

    const table = element("table", "vtables-table");
    const thead = element("thead");
    const headRow = element("tr");
    headRow.append(
      element("th", "vtables-col-l", "L"),
      element("th", "vtables-col-w", "W"),
      element("th", "vtables-col-func", translate("vtableMethodCol")),
      element("th", "vtables-col-action", "GameData"),
    );
    thead.append(headRow);
    table.append(thead);

    const tbody = element("tbody");
    let matchedCount = 0;

    classInfo.methods.forEach(([wIndex, fullName], lIndex) => {
      if (filterText) {
        const matchesName = fullName.toLowerCase().includes(filterText);
        const matchesL = String(lIndex) === filterText;
        const matchesW = wIndex !== null && String(wIndex) === filterText;
        if (!matchesName && !matchesL && !matchesW) return;
      }

      matchedCount++;
      const tr = element("tr");
      const tdL = element("td", "vtables-col-l", String(lIndex));
      const tdW = element("td", "vtables-col-w", wIndex !== null ? String(wIndex) : "—");
      const tdFunc = element("td", "vtables-col-func");
      const code = element("code", "vtables-func-code", fullName);
      tdFunc.append(code);

      const tdAction = element("td", "vtables-col-action");
      const copyBtn = element("button", "btn-sm-action", "GameData");
      copyBtn.type = "button";
      copyBtn.title = "Скопировать блок для SourceMod GameData";
      copyBtn.addEventListener("click", async () => {
        const shortName = getMethodShortName(fullName);
        const snippet = `"${shortName}"\n{\n    "windows"    "${wIndex !== null ? wIndex : "0"}"\n    "linux"      "${lIndex}"\n}`;
        const ok = await copyText(snippet);
        const orig = copyBtn.textContent;
        copyBtn.textContent = ok ? "✓ OK" : "ERR";
        setTimeout(() => { copyBtn.textContent = orig; }, 1200);
      });
      tdAction.append(copyBtn);

      tr.append(tdL, tdW, tdFunc, tdAction);
      tbody.append(tr);
    });

    if (matchedCount === 0) {
      const tr = element("tr");
      const td = element("td", "muted", "В этом классе не найдено методов, соответствующих запросу.");
      td.colSpan = 4;
      tr.append(td);
      tbody.append(tr);
    }

    table.append(tbody);
    vtablesContainer.replaceChildren(table);
  }

  vtableClassSelect?.addEventListener("change", () => {
    currentVTableClass = vtableClassSelect.value;
    renderCurrentVTable();
  });

  vtableSourceSelect?.addEventListener("change", () => {
    updateVTableClassSelect();
    renderCurrentVTable();
  });

  vtableQueryInput?.addEventListener("input", () => {
    const q = (vtableQueryInput.value || "").trim().toLowerCase();
    if (!vtablesData?.classes) return;

    // Check if query matches another class name directly
    const directClass = Object.keys(vtablesData.classes).find((c) => c.toLowerCase() === q);
    if (directClass && directClass !== currentVTableClass) {
      currentVTableClass = directClass;
      vtableClassSelect.value = currentVTableClass;
    }
    renderCurrentVTable();
  });
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
}
