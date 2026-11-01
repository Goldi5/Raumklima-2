# Development

## Structure

| Folder | Content |
|---|---|
| `custom_components/raumklima/` | integration (Python) |
| `frontend/src/` | dashboard cards (JavaScript modules) |
| `custom_components/raumklima/www/raumklima-card.js` | built card – committed so HACS can ship it without a build |
| `tests/` | tests without Home Assistant (logic) |
| `tests/ha/` | integration tests with Home Assistant (simulated thermostat) |

The integration is split into **logic without Home Assistant** (`logic.py`, `planning.py`, `ventilation.py`, `health.py`, `stats.py`, `sleep.py`, `heatup.py`, `sync.py` – quick to test) and the parts that talk to Home Assistant:

- Room: `controller.py` (flow, control) with `room_windows.py` (window logic), `room_trv.py` (thermostat control, offset, loop protection) and `room_health.py` (health check, diagnostics)
- Hub: `hub.py` with `hub_presence.py` (presence, calendar), `hub_sleep.py` (sleep times), `hub_season.py` (heating season, forecast) and `hub_notify.py` (notifications)
- `websocket_api.py` (card API), `device_trigger.py` (device triggers), `insights.py` (report, health)

## Tests

```bash
python -m venv .venv
.venv/bin/pip install -r requirements_test.txt
.venv/bin/ruff check custom_components tests
.venv/bin/pytest tests -q -p no:logging
```

Without the Home Assistant test environment only the logic tests run; `tests/ha` is skipped.

## Building the card

```bash
cd frontend
npm ci
npm test        # every text translated?
npm run build   # writes custom_components/raumklima/www/raumklima-card.js
```

`npm run watch` rebuilds on every change. The version comes from `manifest.json`.

**Translating:** texts are written as `t("German text")`; the English counterpart lives in `frontend/src/i18n/en.js`. `npm test` reports missing translations.

**Compare before/after:** `node test/render.mjs <card.js> [de|en]` renders all cards with real data (`frontend/test/fixture.json`, created with `RK_WRITE_FIXTURE=1 pytest tests/ha/test_card_fixture.py`) in Chromium and prints the HTML – handy for checking refactorings. Requires Playwright.

## New version

1. Bump the version in `custom_components/raumklima/manifest.json`
2. Add an entry at the top of `CHANGELOG.md`, update the version in `README.md` and `docs/en/README.md`
3. `cd frontend && npm run build`
4. After merging into `main`, GitHub creates the release automatically.

`tests/test_repo.py` checks that everything matches.
