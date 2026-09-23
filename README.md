# TF2 GameData Catalog

A static, searchable catalog of Team Fortress 2 and Team Fortress 2 Classified Linux GameData signatures. The site supports name and signature search, library and architecture filters, signature copying, and English/Russian language selection. It loads the selected game's catalog from a generated JSON file and publishes from this repository through GitHub Pages.

Catalog snapshot: TF2 has 61,569 entries, including 224 reviewed Linux byte patterns (115 x86 and 109 x64). Classified has 62,389 Linux x64 ELF symbols (7,726 engine and 54,663 server). Those entries were checked against the engine and server binaries from the 2026-08-21 server backup; the audit report records their SHA-256 hashes and the upstream source revision. Of 62,875 upstream Classified GameData entries, 486 could not be resolved uniquely in those binaries and are kept out of the usable catalog; 82 entries were mapped by an exact, unique match of the full demangled C++ signature. See the [binary audit](artifacts/tf2c-binary-signatures-audit.json) and [unresolved entries](artifacts/tf2c-unresolved-signatures.json). The binaries themselves are not included.

Among 54,716 TF2 and Classified entries with the same name and library, 54,206 have the same x64 value and 510 differ. Do not assume a TF2 signature is interchangeable with Classified; select the target game and build explicitly.

## Using the signatures

Each record identifies a GameData key, a library (`engine` or `server`), and a platform-specific value. `@...` is a mangled ELF symbol name; `\xNN` values are byte patterns, with `\x2A` representing a one-byte wildcard. TF2 has separate `linux` (x86) and `linux64` values where available; Classified currently has Linux x64 only. The catalog page lets you search, filter, copy a value, and open its exact source line. Machine-readable catalogs are also available as [TF2 JSON](https://mrpanica.github.io/TF2-Gamedata/data/tf2.json) and [Classified JSON](https://mrpanica.github.io/TF2-Gamedata/data/tf2c.json); the original GameData files are [TF2 engine](tf2-function-signatures.game.engine.txt), [TF2 server](tf2-function-signatures.game.server.txt), [Classified engine](tf2c.binary.engine.txt), and [Classified server](tf2c.binary.server.txt).

The two generated Classified `.txt` files are ready-to-load SourceMod GameData configs. Put the desired file(s) in `addons/sourcemod/gamedata/` and load one by its filename without `.txt`; for example, `new GameData("tf2c.binary.server")` loads the server signatures. The engine file is separate so each entry's `library` always points at the correct binary. The TF2 source files are also split by library.

To use a value in a SourceMod plugin, add its GameData entry to your plugin's `.games.txt` file under `Games` → the target game → `Signatures`, then load that config through `GameData`/`PrepSDKCall_SetFromConf`. Copy the key, library, and platform value together; do not copy an offset comment as if it were a signature. A signature only locates an address: it does not define the C++ calling convention, parameter/return types, or a virtual-table offset. Set the SDKCall type and arguments from the actual C++ declaration, and validate them against the exact server build. SourceMod's TF2 integration can resolve hidden function names from ELF `.symtab` ([engine bridge](https://github.com/alliedmodders/sourcemod/blob/master/core/logic_bridge.cpp), [symbol resolver](https://github.com/alliedmodders/sourcemod/blob/master/core/logic/MemoryUtils.cpp)); the Classified reference binaries retain this table. Therefore these symbols can include internal functions, but they are build-specific and may not resolve against stripped or different binaries. See the [SourceMod signature format](https://wiki.alliedmods.net/SDKTools_(SourceMod_Scripting)#Signature_Scans), [`PrepSDKCall_SetFromConf`](https://sm.alliedmods.net/new-api/sdktools/PrepSDKCall_SetFromConf), and [`StartPrepSDKCall`](https://sm.alliedmods.net/new-api/sdktools/StartPrepSDKCall).

Example GameData entry (copy the target's actual value from this catalog):

```text
"Games"
{
  "tf2classified"
  {
    "Signatures"
    {
      "MyFunction"
      {
        "library" "server"
        "linux64" "@_Z..."
      }
    }
  }
}
```

Use the GameData key when preparing an SDKCall, and define its call type, parameters, and return information from the function declaration; those details cannot be inferred from the signature string alone.

## Reproducing the Classified binary check

The extractor accepts the upstream Classified GameData sources, optional supplemental GameData files, and the matching Linux x64 `engine_srv.so` / `server_srv.so`. Python 3.12 is used in CI. Install its pinned dependencies before running `npm test`:

```sh
python -m pip install -r tools/requirements-tf2c-extractor.txt
npm test
```

To regenerate the Classified source files, pass the source revision and binary build label along with those inputs:

```sh
python tools/extract-tf2c-binary-signatures.py --engine-gamedata <engine-gamedata.txt> --server-gamedata <server-gamedata.txt> --supplemental-gamedata tf2c-function-signatures.game.server.txt --supplemental-gamedata tf2c.sdktools.games.txt --engine <engine_srv.so> --server <server_srv.so> --source-revision <TF2C-Gamedata-commit> --binary-build <build-label> --output-dir .
```

The extractor keeps exact ELF symbols, permits only a unique match of the full demangled C++ signature when an upstream symbol spelling differs, and rejects ambiguous or merely same-named functions. It does not invent byte patterns for functions that cannot be identified in the supplied binaries.

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

Снимок каталога: TF2 содержит 61 569 записей, включая 224 проверенных Linux byte-pattern (115 x86 и 109 x64). Для Classified опубликовано 62 389 ELF-символов Linux x64 (7 726 engine и 54 663 server). Они сверены с бинарниками engine и server из серверного архива от 21.08.2026; в отчёте сохранены SHA-256 бинарников и revision исходного репозитория. Из 62 875 исходных записей GameData Classified 486 не удалось однозначно разрешить в этих бинарниках, поэтому они исключены из рабочего каталога; ещё 82 записи сопоставлены по точной уникальной полной деманглированной C++-сигнатуре. См. [аудит бинарников](artifacts/tf2c-binary-signatures-audit.json) и [неразрешённые записи](artifacts/tf2c-unresolved-signatures.json). Сами бинарники в репозиторий не добавляются.

Среди 54 716 записей TF2 и Classified с одинаковыми именем и библиотекой у 54 206 совпадает значение x64, а 510 отличаются. Не считайте сигнатуру TF2 автоматически совместимой с Classified: выбирайте нужную игру и сборку.

## Использование сигнатур

У каждой записи есть ключ GameData, библиотека (`engine` или `server`) и значение для платформы. `@...` — манглированное имя ELF-символа; `\xNN` — байтовый паттерн, где `\x2A` обозначает wildcard длиной в один байт. Для TF2 доступны отдельные значения `linux` (x86) и `linux64` (x64), если они есть; Classified сейчас поддерживается только для Linux x64. На странице можно искать и фильтровать записи, копировать значение и переходить к исходной строке. Доступны также [JSON-каталог TF2](https://mrpanica.github.io/TF2-Gamedata/data/tf2.json) и [JSON-каталог Classified](https://mrpanica.github.io/TF2-Gamedata/data/tf2c.json); исходные файлы GameData: [TF2 engine](tf2-function-signatures.game.engine.txt), [TF2 server](tf2-function-signatures.game.server.txt), [Classified engine](tf2c.binary.engine.txt), [Classified server](tf2c.binary.server.txt).

Два сгенерированных `.txt`-файла Classified уже оформлены как загружаемые конфиги GameData для SourceMod. Поместите нужные файлы в `addons/sourcemod/gamedata/` и загружайте по имени файла без `.txt`; например, `new GameData("tf2c.binary.server")` загружает серверные сигнатуры. Файл engine отделён, чтобы поле `library` каждой записи всегда указывало на правильный бинарник. Исходники TF2 также разделены по библиотекам.

Чтобы использовать значение в плагине SourceMod, добавьте запись в `.games.txt` вашего плагина в раздел `Games` → нужная игра → `Signatures`, затем загрузите конфигурацию через `GameData`/`PrepSDKCall_SetFromConf`. Копируйте вместе ключ, библиотеку и платформенное значение; комментарий со смещением не является сигнатурой. Сигнатура только находит адрес: она не задаёт соглашение вызова C++, типы аргументов и результата или смещение виртуальной таблицы. Укажите тип SDKCall и параметры по фактическому объявлению C++-функции и проверяйте их на соответствующей сборке сервера. Интеграция SourceMod для TF2 умеет разрешать скрытые имена функций через ELF `.symtab` ([engine bridge](https://github.com/alliedmodders/sourcemod/blob/master/core/logic_bridge.cpp), [поиск символов](https://github.com/alliedmodders/sourcemod/blob/master/core/logic/MemoryUtils.cpp)); в эталонных бинарниках Classified эта таблица сохранена. Поэтому каталог может содержать внутренние функции, но символы зависят от сборки и могут не разрешиться в stripped-бинарниках или другой версии. См. [формат сигнатур SourceMod](https://wiki.alliedmods.net/SDKTools_(SourceMod_Scripting)#Signature_Scans), [`PrepSDKCall_SetFromConf`](https://sm.alliedmods.net/new-api/sdktools/PrepSDKCall_SetFromConf) и [`StartPrepSDKCall`](https://sm.alliedmods.net/new-api/sdktools/StartPrepSDKCall).

Пример записи GameData (подставьте фактическое значение из каталога):

```text
"Games"
{
  "tf2classified"
  {
    "Signatures"
    {
      "MyFunction"
      {
        "library" "server"
        "linux64" "@_Z..."
      }
    }
  }
}
```

При подготовке SDKCall используйте ключ GameData и задайте тип вызова, параметры и тип результата по объявлению функции: одной строки сигнатуры недостаточно, чтобы безопасно вызвать C++-функцию.

## Повторная проверка бинарников Classified

Скрипту нужны исходные GameData-файлы Classified, необязательные дополнительные файлы GameData и соответствующие Linux x64 `engine_srv.so` и `server_srv.so`. В CI используется Python 3.12. Перед `npm test` установите закреплённые зависимости:

```sh
python -m pip install -r tools/requirements-tf2c-extractor.txt
npm test
```

Чтобы пересобрать файлы Classified, укажите revision исходников и метку бинарной сборки вместе с путями ко входным файлам:

```sh
python tools/extract-tf2c-binary-signatures.py --engine-gamedata <engine-gamedata.txt> --server-gamedata <server-gamedata.txt> --supplemental-gamedata tf2c-function-signatures.game.server.txt --supplemental-gamedata tf2c.sdktools.games.txt --engine <engine_srv.so> --server <server_srv.so> --source-revision <TF2C-Gamedata-commit> --binary-build <build-label> --output-dir .
```

Скрипт оставляет точные ELF-символы, допускает только уникальное совпадение полной деманглированной C++-сигнатуры, если написание исходного символа отличается, и отклоняет неоднозначные или совпадающие лишь по имени функции варианты. Он не генерирует байтовые паттерны для функций, которые не удалось определить в переданных бинарниках.

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

## Third-party UI components

The site uses project-specific HTML, CSS, and JavaScript; it does not use UI components, templates, or frontend frameworks from other GitHub repositories. GitHub links elsewhere in this README are references to upstream technical documentation and APIs, not reused interface code.

## Сторонние компоненты интерфейса

Сайт использует собственные HTML, CSS и JavaScript и не включает компоненты интерфейса, шаблоны или frontend-фреймворки из других GitHub-репозиториев. Ссылки на GitHub выше ведут на техническую документацию и API исходных проектов; их интерфейсный код здесь не используется.
