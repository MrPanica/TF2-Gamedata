const PAGE_SIZE = 80;
const SOURCE_URL = "https://github.com/MrPanica/TF2-Gamedata/blob/main/";
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
    tf2StatsAria: "Статистика TF2",
    tf2ActionsAria: "Открыть раздел TF2",
    eyebrow: "SourceMod · Linux GameData",
    pageTitle: "Выберите игру",
    intro: "Сигнатуры движка и сервера собраны в одном каталоге. Выберите игру или сразу просматривайте список ниже.",
    tf2Stamp: "SourceMod · Linux x86 / x64",
    tf2Description: "Каталог Linux-сигнатур и проверенных byte-pattern.",
    entriesLabel: "записей",
    allSignatures: "Все сигнатуры",
    classifiedStamp: "Community game · Linux x64",
    classifiedDescription: "Отдельные сигнатуры и gamedata для Classified.",
    classifiedNote: "Источник хранится отдельно от основного TF2 каталога, чтобы версии игр не смешивались.",
    openClassified: "Открыть репозиторий сигнатур",
    catalogAria: "Список сигнатур",
    catalogKicker: "Team Fortress 2 / GameData",
    catalogTitle: "Список сигнатур",
    catalogIntro: "Список открыт сразу. Поиск и фильтры сужают уже загруженный каталог, а карточки добавляются по мере прокрутки.",
    searchTitle: "Поиск и фильтры",
    searchHint: "Ищет по имени, библиотеке и значению символа.",
    queryLabel: "Название или часть названия",
    queryPlaceholder: "Например: AddEmptyMesh",
    libraryLabel: "Библиотека",
    architectureLabel: "Архитектура",
    kindLabel: "Тип",
    all: "Все",
    allEntries: "Все записи",
    linuxX86: "Linux x86",
    linuxX64: "Linux x64",
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
    openSource: "Открыть источник",
    linuxX86Platform: "Linux x86 · linux",
    linuxX64Platform: "Linux x64 · linux64",
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
    tf2StatsAria: "TF2 statistics",
    tf2ActionsAria: "Open TF2 section",
    eyebrow: "SourceMod · Linux GameData",
    pageTitle: "Pick a game",
    intro: "Engine and server signatures in one catalog. Pick a game or browse the list below right away.",
    tf2Stamp: "SourceMod · Linux x86 / x64",
    tf2Description: "Linux symbols and reviewed byte-patterns in one catalog.",
    entriesLabel: "entries",
    allSignatures: "All signatures",
    classifiedStamp: "Community game · Linux x64",
    classifiedDescription: "Separate signatures and gamedata for Classified.",
    classifiedNote: "This source stays separate from the main TF2 catalog so game versions do not get mixed.",
    openClassified: "Open signature repository",
    catalogAria: "Signature list",
    catalogKicker: "Team Fortress 2 / GameData",
    catalogTitle: "Signature list",
    catalogIntro: "The list is open immediately. Search and filters narrow the loaded catalog, while cards are added as you scroll.",
    searchTitle: "Search and filters",
    searchHint: "Search by name, library, or symbol value.",
    queryLabel: "Name or part of a name",
    queryPlaceholder: "For example: AddEmptyMesh",
    libraryLabel: "Library",
    architectureLabel: "Architecture",
    kindLabel: "Type",
    all: "All",
    allEntries: "All entries",
    linuxX86: "Linux x86",
    linuxX64: "Linux x64",
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
    openSource: "Open source",
    linuxX86Platform: "Linux x86 · linux",
    linuxX64Platform: "Linux x64 · linux64",
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
    const searchable = [
      entry.name,
      entry.library,
      entry.sourceFile,
      entry.linux?.value,
      entry.linux64?.value,
    ]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase();
    return searchable.includes(query);
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

function sourceHref(entry) {
  return `${SOURCE_URL}${encodeURIComponent(entry.sourceFile)}#L${entry.sourceLine}`;
}

function makeStat(label, value, hint) {
  const card = element("div", "stat-card");
  card.append(element("span", "stat-label", label));
  card.append(element("strong", "stat-value", formatNumber(value)));
  card.append(element("span", "stat-hint", hint));
  return card;
}

function renderSummary(index) {
  const summary = document.querySelector("#summary");
  const linux = index.stats.platforms.linux;
  const linux64 = index.stats.platforms.linux64;
  summary.replaceChildren(
    makeStat(translate("totalEntries"), index.stats.entries, translate("duplicateNames", { count: formatNumber(index.stats.duplicates.names) })),
    makeStat(translate("linuxX86"), linux.present, translate("withoutX86", { count: formatNumber(linux.missing) })),
    makeStat(translate("linuxX64"), linux64.present, translate("withoutX64", { count: formatNumber(linux64.missing) })),
    makeStat(translate("bytePattern"), linux["byte-pattern"] + linux64["byte-pattern"], translate("currentFiles")),
  );
  summary.hidden = false;
  document.querySelector("#data-version").textContent = translate("updated", { date: formatDate(index.generatedAt) });
  const byLibrary = index.stats.byLibrary ?? {};
  document.querySelector("#tf2-total").textContent = formatNumber(index.stats.entries);
  document.querySelector("#tf2-engine").textContent = formatNumber(byLibrary.engine ?? 0);
  document.querySelector("#tf2-server").textContent = formatNumber(byLibrary.server ?? 0);
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
  block.append(heading);

  const codeRow = element("div", "code-row");
  const code = element("code", "signature-value", signature.value);
  const copy = element("button", "button button-copy", translate("copy"));
  copy.type = "button";
  copy.dataset.copyValue = signature.value;
  codeRow.append(code, copy);
  block.append(codeRow);

  if (signature.offsets.length) {
    const details = formatModuleOffset(signature.offsets);
    const offset = element("div", "offsets", details.text);
    offset.title = details.title;
    block.append(offset);
  }
  return block;
}

function makeResultCard(entry) {
  const card = element("article", "result-card");
  const header = element("div", "result-header");
  const title = element("h3", "result-name", entry.name);
  const library = element("span", "badge badge-library", entry.library);
  header.append(title, library);

  const source = element("div", "source-line");
  source.append(element("span", "muted", `${entry.sourceFile}:${entry.sourceLine}`));
  const link = element("a", "source-link", translate("openSource"));
  link.href = sourceHref(entry);
  link.target = "_blank";
  link.rel = "noreferrer";
  source.append(link);

  const platforms = element("div", "platforms");
  platforms.append(
    makePlatformBlock(translate("linuxX86Platform"), entry.linux),
    makePlatformBlock(translate("linuxX64Platform"), entry.linux64),
  );

  card.append(header, source, platforms);
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
  queryInput.value = filters.query;
  sourceInput.value = filters.source;
  archInput.value = filters.arch;
  kindInput.value = filters.kind;

  const state = { index: null, filtered: [], rendered: 0 };

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
    next.forEach((entry) => fragment.append(makeResultCard(entry)));
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
    if (!state.index) return;
    renderSummary(state.index);
    applyFilters();
  });

  function chooseSource(source) {
    sourceInput.value = source;
    if (state.index) applyFilters();
    document.querySelector("#catalog")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  results.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-copy-value]");
    if (!button) return;
    const copied = await copyText(button.dataset.copyValue);
    const oldText = button.textContent;
    button.textContent = copied ? translate("copied") : translate("copyFailed");
    window.setTimeout(() => { button.textContent = oldText; }, 1400);
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

  document.querySelectorAll("[data-source-choice]").forEach((button) => {
    button.addEventListener("click", () => chooseSource(button.dataset.sourceChoice));
  });

  const observer = new IntersectionObserver((observations) => {
    if (observations.some((observation) => observation.isIntersecting)) renderMore();
  }, { rootMargin: "480px" });
  observer.observe(sentinel);

  status.textContent = translate("loadingIndex");
  fetch("./data/index.json", { cache: "no-store" })
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then((index) => {
      state.index = index;
      renderSummary(index);
      loading.hidden = true;
      applyFilters();
    })
    .catch((loadError) => {
      loading.hidden = true;
      error.textContent = translate("loadError", { message: loadError.message });
      error.hidden = false;
      status.textContent = translate("loadErrorStatus");
    });
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
}
