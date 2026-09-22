# TF2 GameData Catalog

A static, searchable catalog of Team Fortress 2 and Team Fortress 2 Classified Linux GameData signatures. The site supports name and signature search, library and architecture filters, signature copying, and English/Russian language selection. It loads the selected game's catalog from a generated JSON file and publishes from this repository through GitHub Pages.

The TF2 catalog is built from the engine and server GameData files, plus reviewed Linux byte-pattern candidates. The Classified catalog currently contains 31 Linux x64 ELF symbol signatures and intentionally excludes table offsets. Its signature data is adapted from the [TF2 Classified server GameData](https://github.com/Deenyoro/TF2Classified-DockerServer/tree/81f0097ac7127a5ff742f90e7adcbbbe189c5fff/addons-bundled/gamedata-tf2c).

Public site: <https://mrpanica.github.io/TF2-Gamedata/>

## Development

```sh
npm test
npm run audit
npm run audit:linux
npm run build
python -m http.server 4173 --directory dist
```

The build writes the static site and `dist/data/catalog.json`. Source GameData files remain the source of truth.

---

# Каталог GameData для TF2

Статический каталог для поиска по Linux GameData-сигнатурам Team Fortress 2 и Team Fortress 2 Classified. На сайте доступны поиск по имени и сигнатуре, фильтры по библиотеке и архитектуре, копирование сигнатур и выбор русского или английского языка. Каталог выбранной игры загружается из JSON-файла; сайт публикуется из этого репозитория через GitHub Pages.

Каталог TF2 собирается из файлов GameData движка и сервера, а также проверенных кандидатов byte-pattern. В каталоге Classified сейчас 31 сигнатура Linux x64 в формате ELF symbol; table offsets намеренно не включены. Эти сигнатуры подготовлены на основе [GameData сервера TF2 Classified](https://github.com/Deenyoro/TF2Classified-DockerServer/tree/81f0097ac7127a5ff742f90e7adcbbbe189c5fff/addons-bundled/gamedata-tf2c).

Публичный сайт: <https://mrpanica.github.io/TF2-Gamedata/>

## Разработка

```sh
npm test
npm run audit
npm run audit:linux
npm run build
python -m http.server 4173 --directory dist
```

Сборка создаёт статический сайт и `dist/data/catalog.json`. Исходные файлы GameData остаются первоисточником данных.
