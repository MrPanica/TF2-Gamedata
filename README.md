# TF2 GameData — Linux signatures

Статический каталог поиска по Linux-сигнатурам TF2. Данные собираются из:

- `tf2-function-signatures.game.engine.txt`
- `tf2-function-signatures.game.server.txt`
- `artifacts/reviewed-linux-byte-patterns.json` — проверенные byte-pattern для отсутствующих архитектурных вариантов.

Сайт не требует сервера или базы данных: браузер загружает статический JSON-индекс.

## GitHub Pages

После включения Pages с источником **GitHub Actions** workflow публикует содержимое `dist/` при каждом push в `main`. Перед публикацией запускаются тесты и сборка. Результат будет доступен по адресу <https://mrpanica.github.io/TF2-Gamedata/>.

Если Pages ещё не включён, откройте **Settings → Pages → Build and deployment → Source → GitHub Actions**. Запустить публикацию вручную можно из вкладки **Actions** через workflow `GitHub Pages`.

## Локальная проверка

```powershell
npm test
npm run audit
npm run audit:linux
npm run build
python -m http.server 4173 --directory dist
```

Открыть: <http://127.0.0.1:4173/>

Генератор создаёт `dist/data/index.json`, сохраняет Linux x86 (`linux`) и Linux x64 (`linux64`), offsets и ссылку на исходную строку. Reviewed byte-pattern добавляются только в отсутствующий архитектурный слот; исходные записи не перезаписываются.

## Проверка Linux byte-pattern

`npm run audit:linux` проверяет сигнатуры индекса. Для повторной проверки паттернов на конкретном ELF можно передать файл:

```powershell
node tools/audit-linux-signatures.mjs --binary "D:\path\to\server_srv.so"
```

Скрипт не создаёт неподтверждённые сигнатуры автоматически. Для поиска новых
паттернов нужен конкретный ELF и известная функция/якорь, после чего результат
нужно подтвердить повторным сканированием и тестом SourceMod.
