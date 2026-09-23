# TF2 GameData Catalog

A static, searchable catalog of Team Fortress 2 and Team Fortress 2 Classified Linux GameData signatures. The site supports name and signature search, library and architecture filters, signature copying, and English/Russian language selection. It loads the selected game's catalog from a generated JSON file and publishes from this repository through GitHub Pages.

The TF2 catalog contains 61,569 GameData entries and 224 reviewed Linux byte patterns (115 x86 and 109 x64). The Classified catalog contains 9,369 Linux x64 signatures: 1,584 ELF symbols and 7,785 byte patterns. It is x64-only and excludes table offsets. Classified patterns were generated from engine and server ELF binaries by mapping TF2 GameData function names to Classified functions; each retained pattern has a single match in its target library. Signatures are deduplicated within each library, while identical patterns shared by engine and server remain library-scoped. Binary hashes and extraction results are recorded in the [audit report](artifacts/tf2c-binary-signatures-audit.json); the binaries themselves are not included. The extraction tool is [available here](tools/extract-tf2c-binary-signatures.py), with dependencies listed in [requirements](tools/requirements-tf2c-extractor.txt).

Public site: <https://mrpanica.github.io/TF2-Gamedata/>

## Development

```sh
npm test
npm run audit
npm run audit:linux
npm run build
python -m http.server 4173 --directory dist
```

The build writes a small game manifest and one data file per game under `dist/data/`. The browser downloads only the selected game's catalog. Source GameData files remain the source of truth.

---

# Каталог GameData для TF2

Статический каталог для поиска по Linux GameData-сигнатурам Team Fortress 2 и Team Fortress 2 Classified. На сайте доступны поиск по имени и сигнатуре, фильтры по библиотеке и архитектуре, копирование сигнатур и выбор русского или английского языка. Каталог выбранной игры загружается из JSON-файла; сайт публикуется из этого репозитория через GitHub Pages.

Каталог TF2 содержит 61 569 записей GameData и 224 проверенных Linux byte-pattern (115 для x86 и 109 для x64). Каталог Classified содержит 9 369 сигнатур только для Linux x64: 1 584 ELF symbol и 7 785 byte-pattern. Смещения таблиц не включены. Byte-pattern получены скриптом из ELF-бинарников движка и сервера сопоставлением имён функций TF2 GameData с функциями Classified; каждая опубликованная сигнатура встречается в целевой библиотеке ровно один раз. Повторы удалены внутри каждой библиотеки; одинаковые шаблоны между engine и server остаются отдельными, так как относятся к разным модулям. Хэши бинарников и результаты проверки приведены в [отчёте аудита](artifacts/tf2c-binary-signatures-audit.json); сами бинарники в репозиторий не добавлялись. [Скрипт извлечения](tools/extract-tf2c-binary-signatures.py), [его зависимости](tools/requirements-tf2c-extractor.txt).

Публичный сайт: <https://mrpanica.github.io/TF2-Gamedata/>

## Разработка

```sh
npm test
npm run audit
npm run audit:linux
npm run build
python -m http.server 4173 --directory dist
```

Сборка создаёт манифест игр и отдельный файл данных для каждой игры в `dist/data/`. Браузер загружает каталог только выбранной игры. Исходные файлы GameData остаются первоисточником данных.
