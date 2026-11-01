# Entwickeln

## Aufbau

| Ordner | Inhalt |
|---|---|
| `custom_components/raumklima/` | Integration (Python) |
| `frontend/src/` | Dashboard-Karten (JavaScript-Module) |
| `custom_components/raumklima/www/raumklima-card.js` | gebaute Karte – wird mit eingecheckt, damit HACS sie ohne Build ausliefert |
| `tests/` | Tests ohne Home Assistant (Logik) |
| `tests/ha/` | Integrationstests mit Home Assistant (simuliertes Thermostat) |

Die Integration ist aufgeteilt in **Logik ohne Home Assistant** (`logic.py`, `planning.py`, `ventilation.py`, `health.py`, `stats.py`, `sleep.py`, `heatup.py`, `sync.py` – schnell testbar) und die Teile, die mit Home Assistant sprechen:

- Raum: `controller.py` (Ablauf, Regeln) mit `room_windows.py` (Fensterlogik), `room_trv.py` (Thermostat ansteuern, Offset, Schutz gegen Endlosschleifen) und `room_health.py` (Gesundheitscheck, Diagnose)
- Zentrale: `hub.py` mit `hub_presence.py` (Anwesenheit, Kalender), `hub_sleep.py` (Schlafenszeiten), `hub_season.py` (Heizsaison, Vorhersage) und `hub_notify.py` (Benachrichtigungen)
- `websocket_api.py` (Schnittstelle der Karten), `device_trigger.py` (Geräte-Auslöser), `insights.py` (Bericht, Gesundheit)

## Tests

```bash
python -m venv .venv
.venv/bin/pip install -r requirements_test.txt
.venv/bin/ruff check custom_components tests
.venv/bin/pytest tests -q -p no:logging
```

Ohne die Testumgebung von Home Assistant laufen nur die Logik-Tests; `tests/ha` wird dann übersprungen.

## Karte bauen

```bash
cd frontend
npm ci
npm test        # jeder Text übersetzt?
npm run build   # schreibt custom_components/raumklima/www/raumklima-card.js
```

`npm run watch` baut bei jeder Änderung neu. Die Version kommt aus der `manifest.json`.

**Übersetzen:** Texte werden mit `t("Deutscher Text")` geschrieben, das englische Gegenstück steht in `frontend/src/i18n/en.js`. `npm test` meldet fehlende Übersetzungen.

**Vorher/nachher vergleichen:** `node test/render.mjs <karte.js> [de|en]` rendert alle Karten mit echten Daten (`frontend/test/fixture.json`, erzeugt mit `RK_WRITE_FIXTURE=1 pytest tests/ha/test_card_fixture.py`) in Chromium und gibt das HTML aus – praktisch, um Umbauten zu prüfen. Braucht Playwright.

## Neue Version

1. Version in `custom_components/raumklima/manifest.json` erhöhen
2. Eintrag oben in `CHANGELOG.md`, Versionsangabe in `README.md` und `docs/en/README.md`
3. `cd frontend && npm run build`
4. Nach dem Merge in `main` erstellt GitHub automatisch das Release.

`tests/test_repo.py` prüft, dass alle Angaben zusammenpassen.
