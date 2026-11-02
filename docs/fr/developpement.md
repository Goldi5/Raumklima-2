# Développement

## Structure

| Dossier | Contenu |
|---|---|
| `custom_components/raumklima/` | intégration (Python) |
| `frontend/src/` | cartes du tableau de bord (modules JavaScript) |
| `custom_components/raumklima/www/raumklima-card.js` | carte compilée – versionnée pour que HACS puisse la livrer sans compilation |
| `tests/` | tests sans Home Assistant (logique) |
| `tests/ha/` | tests d’intégration avec Home Assistant (thermostat simulé) |

L’intégration se divise en une partie **logique sans Home Assistant** (`logic.py`, `planning.py`, `ventilation.py`, `health.py`, `stats.py`, `sleep.py`, `heatup.py`, `sync.py` – rapides à tester) et les parties qui dialoguent avec Home Assistant :

- Pièce : `controller.py` (flux, régulation) avec `room_windows.py` (logique des fenêtres), `room_trv.py` (pilotage du thermostat, décalage, protection contre les boucles) et `room_health.py` (contrôle de santé, diagnostics)
- Hub : `hub.py` avec `hub_presence.py` (présence, calendrier), `hub_sleep.py` (heures de sommeil), `hub_season.py` (saison de chauffage, prévision) et `hub_notify.py` (notifications)
- `websocket_api.py` (API des cartes), `device_trigger.py` (déclencheurs d’appareil), `insights.py` (rapport, santé)
- Rapport PDF : `report_data.py` (périodes, comparaisons, constats – sans HA), `report_pdf.py` (dessin avec fpdf2), `reports.py` (stockage, planification, push/e-mail, vue de téléchargement)
- Sondes de présence : `occupancy.py` (logique) et `room_presence.py` ; signal lumineux `room_lights.py` ; compte à rebours sur l’écran verrouillé `live_activity.py`

## Tests

```bash
python -m venv .venv
.venv/bin/pip install -r requirements_test.txt
.venv/bin/ruff check custom_components tests
.venv/bin/pytest tests -q -p no:logging
```

Sans l’environnement de test Home Assistant, seuls les tests de logique s’exécutent ; `tests/ha` est ignoré.

## Compiler la carte

```bash
cd frontend
npm ci
npm test        # every text translated?
npm run build   # writes custom_components/raumklima/www/raumklima-card.js
```

`npm run watch` recompile à chaque modification. La version provient de `manifest.json`.

**Traduction :** les textes s’écrivent sous la forme `t("German text")` ; la contrepartie anglaise se trouve dans `frontend/src/i18n/en.js`. `npm test` signale les traductions manquantes.

**Comparer avant/après :** `node test/render.mjs <card.js> [de|en]` affiche toutes les cartes avec de vraies données (`frontend/test/fixture.json`, créé avec `RK_WRITE_FIXTURE=1 pytest tests/ha/test_card_fixture.py`) dans Chromium et imprime le HTML – pratique pour vérifier les refactorisations. Nécessite Playwright.

## Nouvelle version

1. Incrémenter la version dans `custom_components/raumklima/manifest.json`
2. Ajouter une entrée en tête de `CHANGELOG.md`, mettre à jour la version dans `README.md` et `docs/en/README.md`
3. `cd frontend && npm run build`
4. Après la fusion dans `main`, GitHub crée automatiquement la release.

`tests/test_repo.py` vérifie que tout est cohérent.

## Manuel (PDF)

Les textes se trouvent dans `handbook/de.md` et `handbook/en.md` (la FAQ est incluse depuis `docs/*/faq.md`). À chaque push vers `main`, GitHub compile les PDF et les joint à la release. En local :

```bash
cd handbook
npm ci
npx playwright install chromium   # or set CHROMIUM_PATH=/path/to/chrome
npm run build                     # → handbook/dist/*.pdf
```

Encadrés dans le texte : `:::tip … :::` (astuce) et `:::check … :::` (liste de contrôle).
