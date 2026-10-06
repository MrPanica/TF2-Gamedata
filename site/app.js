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
    tabGlobalSearch: "Общий поиск",
    globalBadge: "Везде",
    globalQueryLabel: "Общий поиск по сигнатурам, классам, методам и офсетам",
    searchGlobalPlaceholder: "Например: TakeDamage, CRestore, AddEmptyMesh или 12",
    categoryLabel: "Категория",
    globalTypeAll: "Все результаты (сигнатуры и VTable)",
    globalTypeSignatures: "Только сигнатуры",
    globalTypeVtables: "Только VTable офсеты",
    globalFoundSignaturesLabel: "Сигнатур найдено",
    globalFoundSigsHint: "ELF / байт-паттерны",
    globalFoundVtablesLabel: "VTable офсетов",
    globalFoundVtablesHint: "виртуальных методов",
    globalFoundClassesLabel: "Классов C++",
    globalFoundClassesHint: "с совпадениями",
    globalStatusPrompt: "Введите запрос для поиска по всем данным…",
    globalFoundStatus: "Найдено: {sigs} сигнатур, {vtables} офсетов ({classes} классов) · показано {shown}",
    globalFiltersAria: "Фильтры общего поиска",
    globalSummaryAria: "Статистика общего поиска",
    vtablesMetaLabel: "офсетов",
    engineLibraryLabel: "engine",
    serverLibraryLabel: "server",
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
    changelogDetailsCol: "Детали",
    oldOffsetLabel: "Было",
    newOffsetLabel: "Стало",
    searchGlobalPlaceholder: "Общий поиск…",
    vtablesButton: "Таблица VTable (Офсеты)",
    vtablesTitle: "Таблица виртуальных оффсетов VTable (L / W)",
    searchVtablePlaceholder: "Поиск по классу (напр. CRestore, CBaseEntity) или методу...",
    vtableClassSelect: "Класс C++:",
    allLibraries: "Все библиотеки",
    vtableMethodCol: "Функция / Метод",
    copySnippet: "GameData",
    vtableTotalOffsets: "Всего офсетов",
    vtableVirtualMethodsHint: "виртуальных методов",
    vtableClassesLabel: "Классов C++",
    vtableClassesHint: "с виртуальными таблицами",
    vtableLibrariesLabel: "Библиотеки",
    vtableLibrariesHint: "сервер и движок Linux",
    vtableTableTitle: "Таблица VTable",
    vtableStatusDefault: "Выберите класс или воспользуйтесь поиском",
    vtableFiltersAria: "Фильтры VTable",
    vtablesSummaryAria: "Статистика VTable",
    vtableShowingStatus: "Показано {shown} из {total} методов / офсетов",
    vtableNoMethods: "В этом классе не найдено методов, соответствующих запросу.",
    vtableClassNotFound: "Класс \"{name}\" не найден.",
    vtableLoadError: "Не удалось загрузить данные VTable.",
    vtableHeaderL: "L (Linux)",
    vtableHeaderW: "W (Windows)",
    vtableTooltipL: "Linux слот виртуальной таблицы (Itanium C++ ABI)",
    vtableTooltipW: "Windows слот виртуальной таблицы (MSVC C++ ABI)",
    vtableAnonNamespace: "анонимный namespace",
    openInVTableTab: "Открыть класс в VTable",
    changelogSignaturesBadge: "Сигнатур: {count}",
    changelogVtablesBadge: "VTable: {count}",
    changelogClassesBadge: "Классов: {count}",
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
    gamedataToolButton: "Парсер GameData",
    gamedataToolTitle: "Парсер и обновление GameData",
    gamedataToolSubtitle: "Вставьте свой .txt файл GameData для сверки и обновления сигнатур и смещений",
    gamedataOptUpdate: "Обновить сигнатуры и офсеты",
    gamedataOptFormat: "Форматировать структуру (отступы)",
    gamedataOptComments: "Сохранять комментарии",
    gamedataIndentLabel: "Отступ:",
    gamedataIndentTabs: "Табуляция (Tab)",
    gamedataIndentSpaces4: "4 пробела",
    gamedataIndentSpaces2: "2 пробела",
    gamedataUploadBtn: "Загрузить файл .txt",
    gamedataInputHeader: "Исходный GameData",
    gamedataExampleBtn: "Вставить пример",
    gamedataOutputHeader: "Обновлённый результат",
    gamedataReadyPrompt: "Вставьте GameData и нажмите «Обработать и обновить»",
    gamedataProcessBtn: "Обработать и обновить",
    download: "Скачать .txt",
    gamedataStatsResult: "Обработано: {sigs} сигнатур ({sigsUp} обновлено), {offsets} офсетов ({offsetsUp} обновлено)",
    gamedataEmptyAlert: "Пожалуйста, вставьте текст GameData в поле ввода.",
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
    tabGlobalSearch: "Global Search",
    globalBadge: "All",
    globalQueryLabel: "Unified search across signatures, classes, methods, and offsets",
    searchGlobalPlaceholder: "Global search…",
    changelogDetailsCol: "Details",
    oldOffsetLabel: "Was",
    newOffsetLabel: "Became",
    categoryLabel: "Category",
    globalTypeAll: "All results (signatures & VTable)",
    globalTypeSignatures: "Signatures only",
    globalTypeVtables: "VTable offsets only",
    globalFoundSignaturesLabel: "Signatures found",
    globalFoundSigsHint: "ELF / byte-patterns",
    globalFoundVtablesLabel: "VTable offsets",
    globalFoundVtablesHint: "virtual methods",
    globalFoundClassesLabel: "C++ classes",
    globalFoundClassesHint: "matching query",
    globalStatusPrompt: "Enter search query to search across all data…",
    globalFoundStatus: "Found: {sigs} signatures, {vtables} offsets ({classes} classes) · showing {shown}",
    globalFiltersAria: "Global search filters",
    globalSummaryAria: "Global search statistics",
    vtablesMetaLabel: "offsets",
    engineLibraryLabel: "engine",
    serverLibraryLabel: "server",
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
    vtableClassSelect: "C++ Class:",
    allLibraries: "All libraries",
    vtableMethodCol: "Function / Method",
    copySnippet: "GameData",
    vtableTotalOffsets: "Total offsets",
    vtableVirtualMethodsHint: "virtual methods",
    vtableClassesLabel: "C++ classes",
    vtableClassesHint: "with virtual method tables",
    vtableLibrariesLabel: "Libraries",
    vtableLibrariesHint: "Linux server & engine",
    vtableTableTitle: "VTable Table",
    vtableStatusDefault: "Select a class or use search",
    vtableFiltersAria: "VTable filters",
    vtablesSummaryAria: "VTable statistics",
    vtableShowingStatus: "Showing {shown} of {total} methods / offsets",
    vtableNoMethods: "No methods matching query found in this class.",
    vtableClassNotFound: "Class \"{name}\" not found.",
    vtableLoadError: "Failed to load VTable data.",
    vtableHeaderL: "L (Linux)",
    vtableHeaderW: "W (Windows)",
    vtableTooltipL: "Linux vtable slot index (Itanium C++ ABI)",
    vtableTooltipW: "Windows vtable slot index (MSVC C++ ABI)",
    vtableAnonNamespace: "anon namespace",
    openInVTableTab: "Open class in VTable",
    changelogSignaturesBadge: "Signatures: {count}",
    changelogVtablesBadge: "VTable: {count}",
    changelogClassesBadge: "Classes: {count}",
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
    gamedataToolButton: "GameData Parser",
    gamedataToolTitle: "GameData Parser & Updater",
    gamedataToolSubtitle: "Paste your GameData .txt file to check and update signatures and offsets",
    gamedataOptUpdate: "Update signatures and offsets",
    gamedataOptFormat: "Format structure (indentation)",
    gamedataOptComments: "Preserve comments",
    gamedataIndentLabel: "Indent:",
    gamedataIndentTabs: "Tabs (Tab)",
    gamedataIndentSpaces4: "4 spaces",
    gamedataIndentSpaces2: "2 spaces",
    gamedataUploadBtn: "Upload .txt file",
    gamedataInputHeader: "Source GameData",
    gamedataExampleBtn: "Insert example",
    gamedataOutputHeader: "Updated result",
    gamedataReadyPrompt: "Paste GameData and click \"Process and Update\"",
    gamedataProcessBtn: "Process and Update",
    download: "Download .txt",
    gamedataStatsResult: "Processed: {sigs} signatures ({sigsUp} updated), {offsets} offsets ({offsetsUp} updated)",
    gamedataEmptyAlert: "Please paste GameData text into the input field.",
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
      initCatalogTabs(selectedGame, state, makeResultCard);
      initGameDataTool(selectedGame, state);
    })
    .catch((loadError) => {
      loading.hidden = true;
      error.textContent = translate("loadError", { message: loadError.message });
      error.hidden = false;
      status.textContent = translate("loadErrorStatus");
      initChangelog();
      initCatalogTabs(selectedGame, state, makeResultCard);
      initGameDataTool(selectedGame, state);
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
            element("span", "badge badge-accent", translate("changelogSignaturesBadge", { count: formatNumber(update.stats.signaturesCount || update.stats.totalSignatures) })),
            element("span", "badge badge-library", translate("changelogVtablesBadge", { count: formatNumber(update.stats.vtablesCount || update.stats.vtablesMethods || 232270) })),
            element("span", "badge badge-warning", translate("changelogClassesBadge", { count: formatNumber(update.stats.classesCount || update.stats.vtablesClasses || 3391) })),
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
        element("th", "", translate("oldOffsetLabel")),
        element("th", "", translate("newOffsetLabel")),
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
        td.colSpan = 6;
        tr.append(td);
        tbody.append(tr);
      } else {
        samples.slice(0, 150).forEach((item) => {
          const tr = element("tr");
          const tdType = element("td", "");
          const type = item.type || (item.name?.includes("::") ? "vtable" : "symbol");
          if (type === "vtable") {
            tdType.append(element("span", "badge badge-accent", "VTable"));
          } else if (type === "offset") {
            tdType.append(element("span", "badge badge-offset", "Offset"));
          } else if (type === "sizeof") {
            tdType.append(element("span", "badge badge-sizeof", "Sizeof"));
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
            if (type === "vtable" || type === "offset" || type === "sizeof") {
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
          const tdOld = element("td", "changelog-val-old", item.oldValue || "—");
          const tdNew = element("td", "changelog-val-new", item.newValue || item.details || "—");
          const tdDetails = element("td", "changelog-details", item.details || "—");
          tr.append(tdType, tdName, tdLib, tdOld, tdNew, tdDetails);
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

function makeGameDataButton(onClick) {
  const btn = document.createElement("button");
  btn.className = "btn-sm-action";
  btn.type = "button";
  btn.title = "Скопировать блок для SourceMod GameData";
  btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg><span>GameData</span>`;
  if (onClick) {
    btn.addEventListener("click", async () => {
      const ok = await onClick();
      const span = btn.querySelector("span");
      if (span) {
        const orig = span.textContent;
        span.textContent = ok ? "✓ OK" : "ERR";
        setTimeout(() => { span.textContent = orig; }, 1200);
      }
    });
  }
  return btn;
}

function initCatalogTabs(selectedGame, state, makeResultCard) {
  const tabSignatures = document.querySelector("#tab-signatures");
  const tabVtables = document.querySelector("#tab-vtables");
  const tabGlobal = document.querySelector("#tab-global");

  const signaturesControls = document.querySelector("#signatures-search-controls");
  const vtablesControls = document.querySelector("#vtables-search-controls");
  const globalControls = document.querySelector("#global-search-controls");

  const signaturesView = document.querySelector("#signatures-view");
  const vtablesView = document.querySelector("#vtables-view");
  const globalView = document.querySelector("#global-view");

  const vtableQueryInput = document.querySelector("#vtable-query");
  const vtableClassSelect = document.querySelector("#vtable-class");
  const vtableSourceSelect = document.querySelector("#vtable-source");
  const vtablesContainer = document.querySelector("#vtables-container");
  const vtableViewTitle = document.querySelector("#vtable-view-title");
  const vtableViewStatus = document.querySelector("#vtable-view-status");
  const vtableSentinel = document.querySelector("#vtable-sentinel");

  const globalQueryInput = document.querySelector("#global-query");
  const globalTypeSelect = document.querySelector("#global-type");
  const globalSourceSelect = document.querySelector("#global-source");
  const globalStatSigs = document.querySelector("#global-stat-sigs");
  const globalStatVtables = document.querySelector("#global-stat-vtables");
  const globalStatClasses = document.querySelector("#global-stat-classes");
  const globalStatus = document.querySelector("#global-status");
  const globalResetBtn = document.querySelector("#global-reset");
  const globalResults = document.querySelector("#global-results");
  const globalEmpty = document.querySelector("#global-empty");
  const globalLoading = document.querySelector("#global-loading");
  const globalSentinel = document.querySelector("#global-sentinel");

  if (!tabSignatures || !tabVtables) return;

  const catalogGlobalQuery = document.querySelector("#catalog-global-query");

  tabVtables.hidden = false;
  const vtablesBadge = document.querySelector("#tab-vtables-badge");
  if (vtablesBadge) {
    vtablesBadge.textContent = selectedGame === "tf2c" ? "2.2k" : "232k";
  }
  const vtableStatMethods = document.querySelector("#vtable-stat-methods");
  if (vtableStatMethods) {
    vtableStatMethods.textContent = selectedGame === "tf2c" ? "2 261" : "232 270";
  }
  const vtableStatClasses = document.querySelector("#vtable-stat-classes");
  if (vtableStatClasses) {
    vtableStatClasses.textContent = selectedGame === "tf2c" ? "42" : "3 391";
  }

  let activeTab = "signatures";
  let vtablesData = null;
  let loadingPromise = null;
  let currentVTableClass = selectedGame === "tf2c" ? "CBaseAnimating" : "CRestore";

  // VTable dynamic loading state
  const VTABLE_PAGE_SIZE = 50;
  let vtableFilteredMethods = [];
  let vtableRenderedCount = 0;
  let vtableCurrentTbody = null;

  // Global search dynamic loading state
  const GLOBAL_PAGE_SIZE = 50;
  let globalAllMatches = [];
  let globalRenderedCount = 0;
  let globalMatchedSigs = [];
  let globalMatchedVtables = [];
  let globalMatchedClasses = new Set();

  function formatClassName(name) {
    if (name.startsWith("(anonymous namespace)::")) {
      return `${name.replace("(anonymous namespace)::", "")} (${translate("vtableAnonNamespace")})`;
    }
    return name;
  }

  function getMethodShortName(name) {
    const m = name.match(/::([~a-zA-Z0-9_]+)\(/);
    return m ? m[1] : name;
  }

  function switchTab(newTab) {
    activeTab = newTab;
    tabSignatures.classList.toggle("active", activeTab === "signatures");
    tabSignatures.setAttribute("aria-selected", activeTab === "signatures");
    tabVtables.classList.toggle("active", activeTab === "vtables");
    tabVtables.setAttribute("aria-selected", activeTab === "vtables");

    if (activeTab !== "global" && catalogGlobalQuery) {
      catalogGlobalQuery.value = "";
    }

    if (signaturesControls) signaturesControls.hidden = activeTab !== "signatures";
    if (vtablesControls) vtablesControls.hidden = activeTab !== "vtables";
    if (globalControls) globalControls.hidden = activeTab !== "global";

    if (signaturesView) signaturesView.hidden = activeTab !== "signatures";
    if (vtablesView) vtablesView.hidden = activeTab !== "vtables";
    if (globalView) globalView.hidden = activeTab !== "global";

    if (activeTab === "vtables") {
      ensureVTablesLoaded();
    } else if (activeTab === "global") {
      ensureVTablesLoaded().then(() => {
        runGlobalSearch();
        if (catalogGlobalQuery && catalogGlobalQuery.value) {
          catalogGlobalQuery.focus();
        } else {
          globalQueryInput?.focus();
        }
      });
    }
  }

  tabSignatures.addEventListener("click", () => switchTab("signatures"));
  tabVtables.addEventListener("click", () => switchTab("vtables"));

  if (catalogGlobalQuery) {
    catalogGlobalQuery.addEventListener("input", () => {
      const q = catalogGlobalQuery.value.trim();
      if (globalQueryInput) globalQueryInput.value = q;
      if (q.length > 0) {
        if (activeTab !== "global") switchTab("global");
        else runGlobalSearch();
      } else {
        switchTab("signatures");
      }
    });
    catalogGlobalQuery.addEventListener("focus", () => {
      if (catalogGlobalQuery.value.trim().length > 0 && activeTab !== "global") {
        switchTab("global");
      }
    });
  }

  async function loadVTablesData() {
    if (vtablesData) return vtablesData;
    if (loadingPromise) return loadingPromise;
    loadingPromise = (async () => {
      try {
        const file = selectedGame === "tf2c" ? "./data/tf2c-vtables.json" : "./data/tf2-vtables.json";
        const res = await fetch(file);
        if (!res.ok) throw new Error("HTTP " + res.status);
        vtablesData = await res.json();
        return vtablesData;
      } catch (err) {
        console.warn("Failed to load vtables data", err);
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
          vtablesContainer.replaceChildren(element("div", "state state-error", translate("vtableLoadError")));
        }
        return;
      }
    }

    updateVTableClassSelect();
    renderCurrentVTable();
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
    filtered.forEach((cls) => {
      const opt = document.createElement("option");
      opt.value = cls;
      opt.textContent = `${formatClassName(cls)} (${vtablesData.classes[cls].methods.length})`;
      if (cls === currentVTableClass) opt.selected = true;
      vtableClassSelect.append(opt);
    });

    if (filtered.length > 0 && !filtered.includes(currentVTableClass)) {
      currentVTableClass = filtered[0];
      vtableClassSelect.value = currentVTableClass;
    }
  }

  function renderMoreVTableRows() {
    if (!vtableCurrentTbody || vtableRenderedCount >= vtableFilteredMethods.length) {
      if (vtableSentinel) vtableSentinel.hidden = true;
      return;
    }

    const chunk = vtableFilteredMethods.slice(vtableRenderedCount, vtableRenderedCount + VTABLE_PAGE_SIZE);
    const fragment = document.createDocumentFragment();
    const isCrossClass = Boolean((vtableQueryInput?.value || "").trim());

    chunk.forEach((item) => {
      const tr = element("tr");

      if (item.type === "offset" || item.type === "sizeof") {
        const lStr = item.linux !== null ? `x86: ${item.linux}${item.linux64 ? ` (x64: ${item.linux64})` : ""}` : "—";
        const wStr = item.windows !== null ? `x86: ${item.windows}${item.windows64 ? ` (x64: ${item.windows64})` : ""}` : "—";

        const tdL = element("td", "vtables-col-l", lStr);
        tdL.style.fontSize = "0.72rem";
        tdL.style.whiteSpace = "nowrap";

        const tdW = element("td", "vtables-col-w", wStr);
        tdW.style.fontSize = "0.72rem";
        tdW.style.whiteSpace = "nowrap";

        const tdFunc = element("td", "vtables-col-func");
        if (item.className) {
          const classBtn = element("button", "link-button", `${item.className}::`);
          classBtn.type = "button";
          classBtn.style.fontWeight = "700";
          classBtn.style.marginRight = "4px";
          classBtn.addEventListener("click", () => {
            currentVTableClass = item.className;
            if (vtableClassSelect) vtableClassSelect.value = item.className;
            if (vtableQueryInput) vtableQueryInput.value = "";
            renderCurrentVTable();
          });
          tdFunc.append(classBtn);
        }
        const code = element("code", "vtables-func-code", item.memberName || item.fullName);
        const badge = element("span", `badge ${item.type === "sizeof" ? "badge-sizeof" : "badge-offset"}`, item.type === "sizeof" ? "Sizeof" : "Offset");
        badge.style.marginLeft = "8px";
        badge.style.fontSize = "0.68rem";
        tdFunc.append(code, badge);

        const tdAction = element("td", "vtables-col-action");
        const copyBtn = makeGameDataButton(async () => {
          let snippet = `"${item.fullName}"\n{\n`;
          if (item.windows) snippet += `    "windows"      "${item.windows}"\n`;
          if (item.linux) snippet += `    "linux"        "${item.linux}"\n`;
          if (item.windows64) snippet += `    "windows64"    "${item.windows64}"\n`;
          if (item.linux64) snippet += `    "linux64"      "${item.linux64}"\n`;
          snippet += `}`;
          return await copyText(snippet);
        });
        tdAction.append(copyBtn);

        tr.append(tdL, tdW, tdFunc, tdAction);
      } else {
        const tdL = element("td", "vtables-col-l", String(item.lIndex));
        const tdW = element("td", "vtables-col-w", item.wIndex !== null ? String(item.wIndex) : "—");
        const tdFunc = element("td", "vtables-col-func");

        if (isCrossClass && item.className) {
          const classBtn = element("button", "link-button", `${formatClassName(item.className)}::`);
          classBtn.type = "button";
          classBtn.style.fontWeight = "700";
          classBtn.style.marginRight = "4px";
          classBtn.addEventListener("click", () => {
            currentVTableClass = item.className;
            if (vtableClassSelect) vtableClassSelect.value = item.className;
            if (vtableQueryInput) vtableQueryInput.value = "";
            renderCurrentVTable();
          });
          tdFunc.append(classBtn);
        }

        const code = element("code", "vtables-func-code", item.fullName);
        tdFunc.append(code);

        const tdAction = element("td", "vtables-col-action");
        const copyBtn = makeGameDataButton(async () => {
          const shortName = getMethodShortName(item.fullName);
          const snippet = `"${shortName}"\n{\n    "windows"    "${item.wIndex !== null ? item.wIndex : "0"}"\n    "linux"      "${item.lIndex}"\n}`;
          return await copyText(snippet);
        });
        tdAction.append(copyBtn);

        tr.append(tdL, tdW, tdFunc, tdAction);
      }

      fragment.append(tr);
    });

    vtableCurrentTbody.append(fragment);
    vtableRenderedCount += chunk.length;

    if (vtableViewStatus) {
      vtableViewStatus.textContent = translate("vtableShowingStatus", {
        shown: formatNumber(vtableRenderedCount),
        total: formatNumber(vtableFilteredMethods.length),
      });
    }

    if (vtableSentinel) {
      vtableSentinel.hidden = vtableRenderedCount >= vtableFilteredMethods.length;
    }
  }

  if (vtableSentinel) {
    const vtableObserver = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        renderMoreVTableRows();
      }
    }, { rootMargin: "300px" });
    vtableObserver.observe(vtableSentinel);
  }

  function renderCurrentVTable() {
    if (!vtablesContainer || !vtablesData?.classes) return;

    const filterText = (vtableQueryInput?.value || "").trim().toLowerCase();
    const currentLib = vtableSourceSelect?.value || "all";

    vtableFilteredMethods = [];

    if (!filterText) {
      const classInfo = vtablesData.classes[currentVTableClass];
      if (!classInfo) {
        vtablesContainer.replaceChildren(element("div", "state", translate("vtableClassNotFound", { name: currentVTableClass })));
        if (vtableSentinel) vtableSentinel.hidden = true;
        return;
      }

      if (vtableViewTitle) {
        vtableViewTitle.textContent = `${formatClassName(currentVTableClass)} (${classInfo.library})`;
      }

      if (vtablesData.memberOffsets) {
        Object.values(vtablesData.memberOffsets).forEach((item) => {
          if (item.class === currentVTableClass) {
            vtableFilteredMethods.push({
              type: item.type || "offset",
              className: item.class,
              memberName: item.member,
              fullName: item.name,
              linux: item.linux,
              linux64: item.linux64,
              windows: item.windows,
              windows64: item.windows64,
            });
          }
        });
      }

      classInfo.methods.forEach(([wIndex, fullName], lIndex) => {
        vtableFilteredMethods.push({
          type: "vtable",
          className: currentVTableClass,
          lIndex,
          wIndex,
          fullName,
        });
      });
    } else {
      if (vtableViewTitle) {
        vtableViewTitle.textContent = `Результаты поиска: "${vtableQueryInput.value.trim()}"`;
      }

      if (vtablesData.memberOffsets) {
        for (const [name, item] of Object.entries(vtablesData.memberOffsets)) {
          const nameMatch = name.toLowerCase().includes(filterText);
          const classMatch = item.class?.toLowerCase().includes(filterText);
          const memberMatch = item.member?.toLowerCase().includes(filterText);
          const lMatch = item.linux === filterText || item.linux64 === filterText;
          const wMatch = item.windows === filterText || item.windows64 === filterText;
          if (nameMatch || classMatch || memberMatch || lMatch || wMatch) {
            vtableFilteredMethods.push({
              type: item.type || "offset",
              className: item.class,
              memberName: item.member,
              fullName: item.name,
              linux: item.linux,
              linux64: item.linux64,
              windows: item.windows,
              windows64: item.windows64,
            });
          }
        }
      }

      for (const [clsName, info] of Object.entries(vtablesData.classes)) {
        if (currentLib !== "all" && info.library !== currentLib) continue;
        const classMatches = clsName.toLowerCase().includes(filterText);

        info.methods.forEach(([wIndex, fullName], lIndex) => {
          const methodMatches = fullName.toLowerCase().includes(filterText);
          const lMatches = String(lIndex) === filterText;
          const wMatches = wIndex !== null && String(wIndex) === filterText;

          if (classMatches || methodMatches || lMatches || wMatches) {
            vtableFilteredMethods.push({
              type: "vtable",
              className: clsName,
              lIndex,
              wIndex,
              fullName,
            });
          }
        });
      }
    }

    vtableRenderedCount = 0;

    const table = element("table", "vtables-table");
    const thead = element("thead");
    const headRow = element("tr");
    const thL = element("th", "vtables-col-l", translate("vtableHeaderL"));
    thL.title = translate("vtableTooltipL");
    const thW = element("th", "vtables-col-w", translate("vtableHeaderW"));
    thW.title = translate("vtableTooltipW");
    headRow.append(
      thL,
      thW,
      element("th", "vtables-col-func", translate("vtableMethodCol")),
      element("th", "vtables-col-action", "GameData"),
    );
    thead.append(headRow);
    table.append(thead);

    vtableCurrentTbody = element("tbody");

    if (vtableFilteredMethods.length === 0) {
      const tr = element("tr");
      const td = element("td", "muted", translate("vtableNoMethods"));
      td.colSpan = 4;
      tr.append(td);
      vtableCurrentTbody.append(tr);
      if (vtableViewStatus) {
        vtableViewStatus.textContent = translate("vtableShowingStatus", { shown: 0, total: 0 });
      }
      if (vtableSentinel) vtableSentinel.hidden = true;
    } else {
      renderMoreVTableRows();
    }

    table.append(vtableCurrentTbody);
    vtablesContainer.replaceChildren(table);
  }

  function makeVTableResultCard(item) {
    const card = element("article", "result-card result-card-vtable");
    const header = element("header", "result-header");

    const badges = element("div", "result-badges");
    badges.append(
      element("span", "badge badge-accent", "VTable"),
      element("span", "badge badge-library", item.library),
    );

    const nameBtn = element("button", "link-button", formatClassName(item.className));
    nameBtn.type = "button";
    nameBtn.title = translate("openInVTableTab");
    nameBtn.style.fontWeight = "750";
    nameBtn.addEventListener("click", () => {
      currentVTableClass = item.className;
      if (vtableClassSelect) vtableClassSelect.value = item.className;
      if (vtableQueryInput) vtableQueryInput.value = "";
      switchTab("vtables");
      renderCurrentVTable();
    });

    header.append(badges, nameBtn);

    const codeWrap = element("div", "code-row");
    const code = element("code", "vtable-method-name", item.fullName);
    codeWrap.append(code);

    const footer = element("div", "vtable-meta-pills");
    const pillL = element("span", "vtable-pill vtable-pill-l", `L: ${item.lIndex}`);
    pillL.title = translate("vtableTooltipL");
    const pillW = element("span", "vtable-pill vtable-pill-w", `W: ${item.wIndex !== null ? item.wIndex : "—"}`);
    pillW.title = translate("vtableTooltipW");

    const copyBtn = makeGameDataButton(async () => {
      const shortName = getMethodShortName(item.fullName);
      const snippet = `"${shortName}"\n{\n    "windows"    "${item.wIndex !== null ? item.wIndex : "0"}"\n    "linux"      "${item.lIndex}"\n}`;
      return await copyText(snippet);
    });

    const openBtn = element("button", "btn-sm-action", translate("openInVTableTab"));
    openBtn.type = "button";
    openBtn.addEventListener("click", () => {
      currentVTableClass = item.className;
      if (vtableClassSelect) vtableClassSelect.value = item.className;
      if (vtableQueryInput) vtableQueryInput.value = item.fullName;
      switchTab("vtables");
      renderCurrentVTable();
    });

    footer.append(pillL, pillW, copyBtn, openBtn);
    card.append(header, codeWrap, footer);
    return card;
  }

  function makeOffsetResultCard(item) {
    const card = element("article", "result-card result-card-vtable");
    const header = element("header", "result-header");

    const badges = element("div", "result-badges");
    badges.append(
      element("span", `badge ${item.type === "sizeof" ? "badge-sizeof" : "badge-offset"}`, item.type === "sizeof" ? "Sizeof" : "Offset"),
      element("span", "badge badge-library", item.library || "server"),
    );

    if (item.className) {
      const nameBtn = element("button", "link-button", formatClassName(item.className));
      nameBtn.type = "button";
      nameBtn.title = translate("openInVTableTab");
      nameBtn.style.fontWeight = "750";
      nameBtn.addEventListener("click", () => {
        currentVTableClass = item.className;
        if (vtableClassSelect) vtableClassSelect.value = item.className;
        if (vtableQueryInput) vtableQueryInput.value = item.memberName || item.fullName;
        switchTab("vtables");
        renderCurrentVTable();
      });
      header.append(badges, nameBtn);
    } else {
      header.append(badges);
    }

    const codeWrap = element("div", "code-row");
    const code = element("code", "vtable-method-name", item.fullName);
    codeWrap.append(code);

    const footer = element("div", "vtable-meta-pills");
    const pillL = element("span", "vtable-pill vtable-pill-l", `Linux: ${item.linux || "—"}${item.linux64 ? ` (x64: ${item.linux64})` : ""}`);
    const pillW = element("span", "vtable-pill vtable-pill-w", `Win: ${item.windows || "—"}${item.windows64 ? ` (x64: ${item.windows64})` : ""}`);

    const copyBtn = makeGameDataButton(async () => {
      let snippet = `"${item.fullName}"\n{\n`;
      if (item.windows) snippet += `    "windows"      "${item.windows}"\n`;
      if (item.linux) snippet += `    "linux"        "${item.linux}"\n`;
      if (item.windows64) snippet += `    "windows64"    "${item.windows64}"\n`;
      if (item.linux64) snippet += `    "linux64"      "${item.linux64}"\n`;
      snippet += `}`;
      return await copyText(snippet);
    });

    footer.append(pillL, pillW, copyBtn);
    card.append(header, codeWrap, footer);
    return card;
  }

  function renderMoreGlobalItems() {
    if (!globalResults || globalRenderedCount >= globalAllMatches.length) {
      if (globalSentinel) globalSentinel.hidden = true;
      return;
    }

    const chunk = globalAllMatches.slice(globalRenderedCount, globalRenderedCount + GLOBAL_PAGE_SIZE);
    const fragment = document.createDocumentFragment();

    chunk.forEach((item) => {
      if (item.kind === "signature") {
        if (typeof makeResultCard === "function") {
          fragment.append(makeResultCard(item.data, selectedGame));
        }
      } else if (item.kind === "vtable") {
        fragment.append(makeVTableResultCard(item));
      } else if (item.kind === "offset") {
        fragment.append(makeOffsetResultCard(item));
      }
    });

    globalResults.append(fragment);
    globalRenderedCount += chunk.length;

    if (globalStatus) {
      globalStatus.textContent = translate("globalFoundStatus", {
        sigs: formatNumber(globalMatchedSigs.length),
        vtables: formatNumber(globalMatchedVtables.length),
        classes: formatNumber(globalMatchedClasses.size),
        shown: formatNumber(globalRenderedCount),
      });
    }

    if (globalSentinel) {
      globalSentinel.hidden = globalRenderedCount >= globalAllMatches.length;
    }
  }

  if (globalSentinel) {
    const globalObserver = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        renderMoreGlobalItems();
      }
    }, { rootMargin: "300px" });
    globalObserver.observe(globalSentinel);
  }

  function runGlobalSearch() {
    if (!globalResults) return;
    const q = (catalogGlobalQuery?.value || globalQueryInput?.value || "").trim().toLowerCase();
    const typeFilter = globalTypeSelect?.value || "all";
    const sourceFilter = globalSourceSelect?.value || "all";

    if (!q) {
      globalResults.replaceChildren();
      if (globalStatus) globalStatus.textContent = translate("globalStatusPrompt");
      if (globalStatSigs) globalStatSigs.textContent = "0";
      if (globalStatVtables) globalStatVtables.textContent = "0";
      if (globalStatClasses) globalStatClasses.textContent = "0";
      if (globalEmpty) globalEmpty.hidden = true;
      if (globalSentinel) globalSentinel.hidden = true;
      globalAllMatches = [];
      globalRenderedCount = 0;
      return;
    }

    globalMatchedSigs = [];
    globalMatchedVtables = [];
    globalMatchedClasses = new Set();

    if (typeFilter === "all" || typeFilter === "signatures") {
      const sigEntries = state?.index?.entries || [];
      sigEntries.forEach((entry) => {
        if (sourceFilter !== "all" && entry.library !== sourceFilter) return;
        const nameMatch = entry.name.toLowerCase().includes(q);
        const lMatch = entry.linux?.value?.toLowerCase().includes(q) || (entry.linux?.offset && entry.linux.offset.toLowerCase().includes(q));
        const l64Match = entry.linux64?.value?.toLowerCase().includes(q) || (entry.linux64?.offset && entry.linux64.offset.toLowerCase().includes(q));
        if (nameMatch || lMatch || l64Match) {
          globalMatchedSigs.push({ kind: "signature", data: entry });
        }
      });
    }

    if ((typeFilter === "all" || typeFilter === "vtables") && vtablesData?.memberOffsets) {
      for (const [name, item] of Object.entries(vtablesData.memberOffsets)) {
        const nameMatch = name.toLowerCase().includes(q);
        const classMatch = item.class?.toLowerCase().includes(q);
        const memberMatch = item.member?.toLowerCase().includes(q);
        const lMatch = item.linux === q || item.linux64 === q;
        const wMatch = item.windows === q || item.windows64 === q;
        if (nameMatch || classMatch || memberMatch || lMatch || wMatch) {
          if (item.class) globalMatchedClasses.add(item.class);
          globalMatchedVtables.push({
            kind: "offset",
            className: item.class,
            library: "server",
            fullName: item.name,
            memberName: item.member,
            linux: item.linux,
            linux64: item.linux64,
            windows: item.windows,
            windows64: item.windows64,
            type: item.type || "offset",
          });
        }
      }
    }

    if ((typeFilter === "all" || typeFilter === "vtables") && vtablesData?.classes) {
      const classes = vtablesData.classes;
      for (const [className, classInfo] of Object.entries(classes)) {
        if (sourceFilter !== "all" && classInfo.library !== sourceFilter) continue;
        const classMatch = className.toLowerCase().includes(q);

        classInfo.methods.forEach(([wIndex, fullName], lIndex) => {
          const methodMatch = fullName.toLowerCase().includes(q);
          const lIndexMatch = String(lIndex) === q;
          const wIndexMatch = wIndex !== null && String(wIndex) === q;

          if (classMatch || methodMatch || lIndexMatch || wIndexMatch) {
            globalMatchedClasses.add(className);
            globalMatchedVtables.push({
              kind: "vtable",
              className,
              library: classInfo.library,
              fullName,
              lIndex,
              wIndex,
            });
          }
        });
      }
    }

    if (globalStatSigs) globalStatSigs.textContent = formatNumber(globalMatchedSigs.length);
    if (globalStatVtables) globalStatVtables.textContent = formatNumber(globalMatchedVtables.length);
    if (globalStatClasses) globalStatClasses.textContent = formatNumber(globalMatchedClasses.size);

    globalAllMatches = [...globalMatchedSigs, ...globalMatchedVtables];
    globalRenderedCount = 0;
    globalResults.replaceChildren();

    if (globalAllMatches.length === 0) {
      if (globalEmpty) globalEmpty.hidden = false;
      if (globalStatus) globalStatus.textContent = translate("noResultsStatus");
      if (globalSentinel) globalSentinel.hidden = true;
    } else {
      if (globalEmpty) globalEmpty.hidden = true;
      renderMoreGlobalItems();
    }
  }

  vtableClassSelect?.addEventListener("change", () => {
    currentVTableClass = vtableClassSelect.value;
    renderCurrentVTable();
  });

  vtableSourceSelect?.addEventListener("change", () => {
    updateVTableClassSelect();
    renderCurrentVTable();
  });

  let vtableDebounceTimer = null;
  vtableQueryInput?.addEventListener("input", () => {
    clearTimeout(vtableDebounceTimer);
    vtableDebounceTimer = setTimeout(() => {
      renderCurrentVTable();
    }, 120);
  });

  globalQueryInput?.addEventListener("input", runGlobalSearch);
  globalTypeSelect?.addEventListener("change", runGlobalSearch);
  globalSourceSelect?.addEventListener("change", runGlobalSearch);
  globalResetBtn?.addEventListener("click", () => {
    if (globalQueryInput) globalQueryInput.value = "";
    if (catalogGlobalQuery) catalogGlobalQuery.value = "";
    if (globalTypeSelect) globalTypeSelect.value = "all";
    if (globalSourceSelect) globalSourceSelect.value = "all";
    runGlobalSearch();
    if (catalogGlobalQuery) catalogGlobalQuery.focus();
    else globalQueryInput?.focus();
  });
}

function initGameDataTool(selectedGame, state) {
  const toolBtn = document.querySelector("#btn-gamedata-tool");
  const modal = document.querySelector("#gamedata-modal");
  const closeBtn = document.querySelector("#gamedata-modal-close");
  const optUpdate = document.querySelector("#gamedata-opt-update");
  const optFormat = document.querySelector("#gamedata-opt-format");
  const optComments = document.querySelector("#gamedata-opt-comments");
  const optIndent = document.querySelector("#gamedata-opt-indent");
  const fileInput = document.querySelector("#gamedata-file-input");
  const inputArea = document.querySelector("#gamedata-input");
  const outputArea = document.querySelector("#gamedata-output");
  const exampleBtn = document.querySelector("#gamedata-example-btn");
  const clearBtn = document.querySelector("#gamedata-clear-btn");
  const copyBtn = document.querySelector("#gamedata-copy-btn");
  const downloadBtn = document.querySelector("#gamedata-download-btn");
  const statsElem = document.querySelector("#gamedata-stats");
  const processBtn = document.querySelector("#gamedata-process-btn");

  if (!toolBtn || !modal) return;

  toolBtn.addEventListener("click", () => {
    modal.showModal();
    if (!inputArea.value) {
      inputArea.focus();
    }
  });

  closeBtn?.addEventListener("click", () => modal.close());
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.close();
  });

  fileInput?.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      inputArea.value = event.target?.result || "";
      fileInput.value = "";
    };
    reader.readAsText(file, "UTF-8");
  });

  const sampleGameData = `"Games"
{
	"tf"
	{
		// Common entity signatures
		"Signatures"
		{
			"TakeDamage"
			{
				"library"	"server"
				"linux"		"@_ZN11CBaseEntity10TakeDamageERK15CTakeDamageInfo"
			}
			"LookupAttachment"
			{
				"library"	"server"
				"linux"		"@_ZN14CBaseAnimating16LookupAttachmentEPKc"
			}
			"CEconItemSchema::GetItemDefinition"
			{
				"library"	"server"
				"linux"		"@_ZN15CEconItemSchema17GetItemDefinitionEi"
			}
		}
		// Virtual methods & member offsets
		"Offsets"
		{
			"CTFPlayer::GetMaxHealth"
			{
				"windows"	"123"
				"linux"		"124"
			}
			"CEconItemDefinition::m_u8MinLevel"
			{
				"windows"	"17"
				"linux"		"17"
			}
			"sizeof(CEconItemQualityDefinition)"
			{
				"windows"	"16"
				"linux"		"16"
			}
		}
	}
}`;

  exampleBtn?.addEventListener("click", () => {
    inputArea.value = sampleGameData;
    inputArea.focus();
  });

  clearBtn?.addEventListener("click", () => {
    inputArea.value = "";
    outputArea.value = "";
    if (copyBtn) copyBtn.disabled = true;
    if (downloadBtn) downloadBtn.disabled = true;
    if (statsElem) statsElem.innerHTML = `<span class="muted">${translate("gamedataReadyPrompt")}</span>`;
  });

  copyBtn?.addEventListener("click", async () => {
    if (!outputArea.value) return;
    const ok = await copyText(outputArea.value);
    const origText = copyBtn.textContent;
    copyBtn.textContent = ok ? `✓ ${translate("copied")}` : translate("copyFailed");
    setTimeout(() => { copyBtn.textContent = origText; }, 1400);
  });

  downloadBtn?.addEventListener("click", () => {
    if (!outputArea.value) return;
    const blob = new Blob([outputArea.value], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "gamedata_updated.txt";
    document.body.append(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });

  function tokenizeKeyValues(text) {
    const tokens = [];
    let i = 0;
    const len = text.length;

    while (i < len) {
      const ch = text[i];
      if (ch === "/" && text[i + 1] === "*") {
        const start = i; i += 2;
        while (i < len && !(text[i] === "*" && text[i + 1] === "/")) i++;
        if (i < len) i += 2;
        tokens.push({ type: "comment_block", value: text.slice(start, i), start, end: i });
        continue;
      }
      if (ch === "/" && text[i + 1] === "/") {
        const start = i;
        while (i < len && text[i] !== "\n") i++;
        tokens.push({ type: "comment_line", value: text.slice(start, i), start, end: i });
        continue;
      }
      if (/\s/.test(ch)) {
        const start = i;
        while (i < len && /\s/.test(text[i])) i++;
        tokens.push({ type: "whitespace", value: text.slice(start, i), start, end: i });
        continue;
      }
      if (ch === "{") {
        tokens.push({ type: "brace_open", value: "{", start: i, end: i + 1 });
        i++;
        continue;
      }
      if (ch === "}") {
        tokens.push({ type: "brace_close", value: "}", start: i, end: i + 1 });
        i++;
        continue;
      }
      if (ch === '"') {
        const start = i; i++;
        let val = "";
        while (i < len && text[i] !== '"') {
          if (text[i] === "\\" && i + 1 < len) {
            val += text[i] + text[i + 1];
            i += 2;
          } else {
            val += text[i];
            i++;
          }
        }
        if (i < len) i++;
        tokens.push({ type: "string", raw: text.slice(start, i), value: val, start, end: i });
        continue;
      }
      const start = i;
      while (i < len && !/\s|\{|\}|"|\//.test(text[i])) i++;
      const val = text.slice(start, i);
      tokens.push({ type: "unquoted", raw: val, value: val, start, end: i });
    }
    return tokens;
  }

  function parseKeyValuesAST(text) {
    const tokens = tokenizeKeyValues(text);
    let pos = 0;

    function parseItems(untilCloseBrace = false) {
      const items = [];
      while (pos < tokens.length) {
        const tok = tokens[pos];

        if (tok.type === "whitespace") {
          pos++;
          continue;
        }

        if (tok.type === "comment_line" || tok.type === "comment_block") {
          items.push({ type: "comment", value: tok.value });
          pos++;
          continue;
        }

        if (tok.type === "brace_close") {
          if (untilCloseBrace) {
            pos++;
            break;
          } else {
            pos++;
            continue;
          }
        }

        if (tok.type === "string" || tok.type === "unquoted") {
          const keyToken = tok;
          pos++;

          const commentsBetween = [];
          while (pos < tokens.length && (tokens[pos].type === "whitespace" || tokens[pos].type.startsWith("comment_"))) {
            if (tokens[pos].type.startsWith("comment_")) {
              commentsBetween.push({ type: "comment", value: tokens[pos].value });
            }
            pos++;
          }

          if (pos >= tokens.length) {
            items.push({ type: "pair", key: keyToken.value, value: "", rawKey: keyToken.raw, rawValue: "", keyToken });
            break;
          }

          const nextTok = tokens[pos];
          if (nextTok.type === "brace_open") {
            pos++;
            const sectionItems = parseItems(true);
            items.push({
              type: "section",
              name: keyToken.value,
              rawName: keyToken.raw,
              keyToken,
              items: [...commentsBetween, ...sectionItems],
            });
          } else if (nextTok.type === "string" || nextTok.type === "unquoted") {
            pos++;
            items.push({
              type: "pair",
              key: keyToken.value,
              value: nextTok.value,
              rawKey: keyToken.raw,
              rawValue: nextTok.raw,
              keyToken,
              valueToken: nextTok,
            });
            if (commentsBetween.length) {
              items.push(...commentsBetween);
            }
          }
          continue;
        }
        pos++;
      }
      return items;
    }

    return parseItems(false);
  }

  function formatKeyValuesAST(items, indentUnit, preserveComments, level = 0) {
    let out = "";
    const indent = indentUnit.repeat(level);

    let maxKeyLen = 0;
    for (const item of items) {
      if (item.type === "pair") {
        const len = item.key.length + 2;
        if (len > maxKeyLen) maxKeyLen = len;
      }
    }

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type === "comment") {
        if (preserveComments) {
          const lines = item.value.split("\n");
          for (const line of lines) {
            out += `${indent}${line.trim()}\n`;
          }
        }
      } else if (item.type === "section") {
        out += `${indent}"${item.name}"\n`;
        out += `${indent}{\n`;
        out += formatKeyValuesAST(item.items, indentUnit, preserveComments, level + 1);
        out += `${indent}}\n`;
      } else if (item.type === "pair") {
        let sep = "\t";
        const keyLen = item.key.length + 2;
        if (indentUnit === "\t") {
          const tabsNeeded = Math.max(1, Math.ceil((maxKeyLen + 3) / 4) - Math.floor(keyLen / 4));
          sep = "\t".repeat(tabsNeeded);
        } else {
          const pad = Math.max(1, (maxKeyLen + 2) - keyLen);
          sep = " ".repeat(pad);
        }
        out += `${indent}"${item.key}"${sep}"${item.value}"\n`;
      }
    }
    return out;
  }

  processBtn?.addEventListener("click", async () => {
    const rawText = inputArea.value;
    if (!rawText.trim()) {
      alert(translate("gamedataEmptyAlert"));
      return;
    }

    const shouldUpdate = optUpdate ? optUpdate.checked : true;
    const shouldFormat = optFormat ? optFormat.checked : true;
    const shouldComments = optComments ? optComments.checked : true;
    const indentStyle = optIndent?.value || "tab";
    const indentUnit = indentStyle === "spaces4" ? "    " : indentStyle === "spaces2" ? "  " : "\t";

    if (statsElem) {
      statsElem.textContent = translate("loadingIndex");
    }

    // Ensure vtables and catalog data are available
    let vData = null;
    try {
      const file = selectedGame === "tf2c" ? "./data/tf2c-vtables.json" : "./data/tf2-vtables.json";
      const res = await fetch(file);
      if (res.ok) vData = await res.json();
    } catch (e) {
      console.warn("Could not load vtables for tool", e);
    }

    const sigsByName = new Map();
    const sigsByShortName = new Map();
    if (state.index?.entries) {
      for (const entry of state.index.entries) {
        sigsByName.set(entry.name.toLowerCase(), entry);
        const short = getMethodShortName(entry.name).toLowerCase();
        if (!sigsByShortName.has(short)) sigsByShortName.set(short, entry);
      }
    }

    const vtableByClassMethod = new Map();
    const vtableByMethod = new Map();
    if (vData?.classes) {
      for (const [className, info] of Object.entries(vData.classes)) {
        info.methods.forEach(([wIndex, fullName], lIndex) => {
          const short = getMethodShortName(fullName).toLowerCase();
          const item = { lIndex, wIndex, className, fullName };
          vtableByClassMethod.set(`${className.toLowerCase()}::${short}`, item);
          vtableByClassMethod.set(`${className.toLowerCase()}::${fullName.toLowerCase()}`, item);
          if (!vtableByMethod.has(short)) vtableByMethod.set(short, []);
          vtableByMethod.get(short).push(item);
        });
      }
    }

    const ast = parseKeyValuesAST(rawText);
    let sigsCount = 0;
    let sigsUpdatedCount = 0;
    let offsetsCount = 0;
    let offsetsUpdatedCount = 0;
    const replacements = [];

    if (shouldUpdate) {
      function walk(items, path = []) {
        for (const item of items) {
          if (item.type === "section") {
            const parent = path[path.length - 1]?.toLowerCase();
            if (parent === "signatures") {
              sigsCount++;
              const sigMatch = sigsByName.get(item.name.toLowerCase()) || sigsByShortName.get(item.name.toLowerCase());
              if (sigMatch) {
                let updatedThis = false;
                let hasLinux64 = false;
                for (const sub of item.items) {
                  if (sub.type === "pair") {
                    const k = sub.key.toLowerCase();
                    if (k === "linux" && sigMatch.linux && sub.value !== sigMatch.linux) {
                      if (!shouldFormat && sub.valueToken) {
                        replacements.push({ start: sub.valueToken.start, end: sub.valueToken.end, text: `"${sigMatch.linux}"` });
                      }
                      sub.value = sigMatch.linux;
                      updatedThis = true;
                    }
                    if (k === "linux64" && sigMatch.linux64) {
                      hasLinux64 = true;
                      if (sub.value !== sigMatch.linux64) {
                        if (!shouldFormat && sub.valueToken) {
                          replacements.push({ start: sub.valueToken.start, end: sub.valueToken.end, text: `"${sigMatch.linux64}"` });
                        }
                        sub.value = sigMatch.linux64;
                        updatedThis = true;
                      }
                    }
                  }
                }
                if (!hasLinux64 && sigMatch.linux64) {
                  item.items.push({ type: "pair", key: "linux64", value: sigMatch.linux64 });
                  updatedThis = true;
                }
                if (updatedThis) sigsUpdatedCount++;
              }
            } else if (parent === "offsets") {
              offsetsCount++;
              const key = item.name.toLowerCase();
              let target = null;
              if (vData?.offsets && vData.offsets[key]) {
                const o = vData.offsets[key];
                target = {
                  linux: o.linux !== undefined ? String(o.linux) : undefined,
                  windows: o.windows !== undefined ? String(o.windows) : undefined,
                  linux64: o.linux64 !== undefined ? String(o.linux64) : undefined,
                  windows64: o.windows64 !== undefined ? String(o.windows64) : undefined,
                };
              }
              if (!target && key.includes("::") && vtableByClassMethod.has(key)) {
                const vm = vtableByClassMethod.get(key);
                target = {
                  linux: String(vm.lIndex),
                  windows: vm.wIndex !== null ? String(vm.wIndex) : undefined,
                };
              }
              if (!target && vtableByMethod.has(key)) {
                const list = vtableByMethod.get(key);
                const vm = list.find((m) => ["cbaseentity", "ctfplayer", "cbasecombatcharacter"].includes(m.className.toLowerCase())) || list[0];
                if (vm) {
                  target = {
                    linux: String(vm.lIndex),
                    windows: vm.wIndex !== null ? String(vm.wIndex) : undefined,
                  };
                }
              }

              if (target) {
                let updatedThis = false;
                for (const sub of item.items) {
                  if (sub.type === "pair") {
                    const k = sub.key.toLowerCase();
                    if (target[k] !== undefined && sub.value !== target[k]) {
                      if (!shouldFormat && sub.valueToken) {
                        replacements.push({ start: sub.valueToken.start, end: sub.valueToken.end, text: `"${target[k]}"` });
                      }
                      sub.value = target[k];
                      updatedThis = true;
                    }
                  }
                }
                if (target.linux64 !== undefined && !item.items.some((p) => p.type === "pair" && p.key.toLowerCase() === "linux64")) {
                  item.items.push({ type: "pair", key: "linux64", value: target.linux64 });
                  updatedThis = true;
                }
                if (target.windows64 !== undefined && !item.items.some((p) => p.type === "pair" && p.key.toLowerCase() === "windows64")) {
                  item.items.push({ type: "pair", key: "windows64", value: target.windows64 });
                  updatedThis = true;
                }
                if (updatedThis) offsetsUpdatedCount++;
              }
            }
            walk(item.items, [...path, item.name]);
          }
        }
      }
      walk(ast);
    }

    let finalResult = "";
    if (shouldFormat) {
      finalResult = formatKeyValuesAST(ast, indentUnit, shouldComments);
    } else if (replacements.length > 0) {
      replacements.sort((a, b) => b.start - a.start);
      let s = rawText;
      for (const rep of replacements) {
        s = s.slice(0, rep.start) + rep.text + s.slice(rep.end);
      }
      finalResult = s;
    } else {
      finalResult = rawText;
    }

    outputArea.value = finalResult;
    if (copyBtn) copyBtn.disabled = false;
    if (downloadBtn) downloadBtn.disabled = false;

    if (statsElem) {
      statsElem.innerHTML = `<strong>${translate("gamedataStatsResult", {
        sigs: formatNumber(sigsCount),
        sigsUp: formatNumber(sigsUpdatedCount),
        offsets: formatNumber(offsetsCount),
        offsetsUp: formatNumber(offsetsUpdatedCount),
      })}</strong>`;
    }
  });
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
}
