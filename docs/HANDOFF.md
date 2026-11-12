# Raumklima-2 — Übergabe für Agenten

Stand: 2026-11-12 · Version `0.62.38b1`

Diese Datei beschreibt das Projekt, die Zugänge und die Arbeitsweise so, dass ein anderer Agent
ohne Vorwissen weiterarbeiten kann. Sie ist bewusst operativ: Was liegt wo, wie komme ich rein,
was ist zu beachten, was ist gerade offen.

---

## 1. Was das Projekt ist

Eine Home-Assistant-Custom-Integration (HACS, Domain `raumklima`), die Heizungs-Thermostate
raumweise regelt: Zeitfenster, Vorheizen, Nachtabsenkung, Fenster-Erkennung, Schimmelschutz,
Boost, Urlaub/Homeoffice, Anwesenheit, Diagnose, Heizbericht.

- **Repo:** `https://github.com/Goldi5/Raumklima-2` (öffentlich, Issues auf Deutsch)
- **Arbeitskopie:** `/workspace/Raumklima-2`, Branch `main`
- **Größe:** 67 Python-Module in `custom_components/raumklima/`, 51 HA-Testdateien,
  7 Karten in `frontend/src/cards/`, Handbuch in `docs/{de,en,fr}/` + `handbook/`
- **Zielsystem:** Home Assistant 2026.11.1 auf HAOS, eine Instanz mit mehreren „Wohnungen"
  (Hubs). Jede Wohnung ist ein eigener Config-Entry mit eigenen Räumen.

### Architektur in Kurzform

| Ebene | Datei | Aufgabe |
|---|---|---|
| Zentrale | `hub.py` + `hub_*.py` | Wohnung: Anwesenheit, Saison, Nacht, Sturm, Benachrichtigungen, Entitäten |
| Raum | `controller.py` | Regelkette `plan()` → `_apply()`, Sollwert-Abgleich, Handeingriffe |
| Planung | `planning.py`, `logic.py` | Zeitfenster, Stufen, Absenkwerte, reine Funktionen (gut testbar) |
| Gerät | `room_trv.py`, `sync.py`, `health.py` | TRV lesen/schreiben, Bestätigung, Befunde |
| Schnittstellen | `climate.py`, `sensor.py`, `binary_sensor.py`, `switch.py`, `number.py`, `button.py`, `select.py` | HA-Entitäten |
| Karte | `websocket_api.py` + `frontend/src/*` | WS-API, Karte (Quellen in `frontend/src`, gebaut nach `www/raumklima-card.js`) |
| Texte | `msg_catalog.py`, `strings.json`, `translations/*` | alle Meldungen DE/EN/FR |

Die Karte ist ein eigenes Dashboard-Konstrukt: `frontend/src/cards/strategy.js` erzeugt die
Ansichten, `overview.js` die Kacheln, `room.js` die Raumkarte, `settings.js` die Einstellungen.

---

## 2. Zugänge

### Repo und GitHub

```bash
git -C /workspace/Raumklima-2 status --porcelain          # muss leer sein
git -C /workspace/Raumklima-2 log -1 --oneline
```

Push-Token liegt als User `Goldi5` in `~/.git-credentials`. Für die GitHub-API denselben Token
aus der Datei ziehen und per `urllib` mit `Authorization: token …` arbeiten (curl scheitert an
Sonderzeichen in den Kommentartexten).

### Produktiv-HA

- URL: `http://192.168.178.190:8123` (HAOS-VM 200 auf PVE `192.168.178.158`)
- Token: `~/.hermes/config.yaml` → `mcp_servers.homeassistant.headers.Authorization`
  (`Bearer …`). **Nicht ausgeben.**
- REST: `/api/states`, `/api/history/period/<start>?end_time=<end>&filter_entity_id=…`,
  `/api/config`. Für History **immer `end_time` setzen**, sonst kommt nur ein Tag.
- WebSocket (die eigentliche Integrations-API):

| Typ | Zweck |
|---|---|
| `raumklima/config` | Hub-Optionen + Räume (Bewohner, Zonen, Zeitpläne) |
| `raumklima/diagnostics` | vollständige Diagnose (wie der Download) |
| `raumklima/log` / `log/subscribe` | Protokoll |
| `raumklima/hub/update`, `room/update` | Einstellungen schreiben |
| `raumklima/boost`, `room/reset` | Aktionen |
| `raumklima/report`, `report/pdf/*` | Heizbericht |

### HA-Gast (Dateien, Addons, Neustart)

```bash
ssh -i ~/.ssh/id_ed25519_pve root@192.168.178.158 "qm guest exec 200 -- bash -lc '<befehl>'"
```

- Rückgabe ist **JSON**: `{"exitcode":…, "out-data":"…"}` — erst `json.loads(...)["out-data"]`,
  dann weiterparsen.
- Konfiguration liegt unter `/mnt/data/supervisor/homeassistant/` (nicht `/config`).
- Addons: `ha apps list`, `ha apps logs <slug> --lines 400`, `ha apps restart <slug>`.
- **Der QEMU-Guest-Agent fällt gelegentlich aus** („QEMU guest agent is not running"). Dann
  entweder warten oder über REST/WS arbeiten — HA selbst läuft weiter.

### Testumgebung

Container **CT 999** auf demselben PVE-Host, zwei virtuelle Umgebungen:

| Pfad | HA-Version | Zweck |
|---|---|---|
| `/opt/ha-venv` | 2026.2.3 | ältere Linie (Mindestkompatibilität) |
| `/opt/ha-venv314` | 2026.10.4 | neue Linie (Python 3.14) |

Ablauf für jede Änderung:

```bash
cd /workspace/Raumklima-2
tar czf - --exclude=.git --exclude=node_modules --exclude=__pycache__ --exclude=.pytest_cache . \
  | ssh -i ~/.ssh/id_ed25519_pve root@192.168.178.158 \
      "pct exec 999 -- bash -c 'rm -rf /tmp/rkX && mkdir -p /tmp/rkX && tar xzf - -C /tmp/rkX'"
ssh -i ~/.ssh/id_ed25519_pve root@192.168.178.158 \
  "pct exec 999 -- bash -lc 'cd /tmp/rkX && /opt/ha-venv/bin/python -m pytest -q --no-header -p no:cacheprovider'"
```

### Produktiv ausliefern (nur wenn ausdrücklich gewünscht)

```bash
python3 /home/hermeswebui/.hermes/scripts/rk_prod_deploy.py
```

Überträgt `custom_components/raumklima` per base64 in die VM, prüft sha256 und startet den Core
neu. **Der Neustart dauert 8–10 Minuten** (`alexa_devices` blockiert den Bootstrap); solange
zeigt `/api/config` `NOT_RUNNING`. Danach über `raumklima/diagnostics` prüfen, welche Version
wirklich läuft.

### Obsidian-Vault (zweites Gedächtnis)

CT 650, `/opt/obsidian/vault`, Sync alle 15 Minuten. Dauerhaftes Wissen (Umgebung, Runbooks,
Geräte-Eigenheiten) gehört dorthin — vor dem Schreiben `SCHEMA.md` lesen, danach `log.md` und
`index.md` nachziehen.

---

## 3. Arbeitsweise

1. **Erst analysieren, dann bauen.** Bei Issues und Ideen: Ursache im Code belegen
   (`datei.py:zeile`), Live-Daten prüfen, eigene Meinung sagen. Antwortentwürfe für GitHub
   werden **zuerst gezeigt**, gepostet wird nach Freigabe.
2. **Kurze Bestätigungen sind Freigabe.** „mach das", „los", „ja", „bauen" → umsetzen und
   berichten, nicht erneut nachfragen.
3. **Testen auf beiden HA-Linien**, dazu `ruff check custom_components tests`.
4. **Karte:** `cd frontend && npm run build` (schreibt `custom_components/raumklima/www/raumklima-card.js`)
   und `npm test` (prüft u. a. fehlende EN-Texte und fehlende Hilfetexte).
5. **Version und Changelog** anheben, committen, Tag setzen, pushen.
6. **Release prüfen:** GitHub-Actions-Lauf `Release` muss grün sein, danach existiert
   `releases/tags/v<version>`.

### Versionierung

- `0.62.38b1` = Beta (`bN`), `0.62.38` = Stable. **Betas werden immer gepusht**, Stables nur nach
  Freigabe.
- Die Version steht an **sieben** Stellen und muss überall gleich sein:
  `custom_components/raumklima/manifest.json`, `frontend/src/version.js`,
  `custom_components/raumklima/www/raumklima-card.js`, `README.md`, `docs/de/README.md`,
  `docs/en/README.md`, `docs/fr/README.md`.
- Push auf `main` löst den Release-Workflow aus: Tag = Version aus dem Manifest,
  `prerelease: true` bei `bN`. Stables bekommen zusätzlich drei PDFs
  (`Raumklima-Handbuch.pdf`, `-Manual.pdf`, `-Manuel.pdf`).

---

## 4. Fallen, die Zeit kosten

- **Jeder neue Text** in `tr("…")` braucht einen Eintrag in `msg_catalog.py` (DE/EN/FR mit
  identischen Platzhaltern), sonst schlägt `tests/test_msg.py` fehl.
- **Jede neue Beschriftung** in der Karte braucht `frontend/src/i18n/en.js` **und** `fr.js`,
  sonst meldet `npm test` „fehlende englische Texte".
- **Jede neue Einstellungszeile** braucht einen Eintrag in `frontend/src/help.js`, sonst schlägt
  „ohne Erklärung" fehl. Die Zeile muss als `this._row("Label", …)` in einer Zeile stehen — der
  Test sucht per Regex.
- **HA-Tests laufen in US/Pacific.** `freezer.move_to("…+00:00")` mit UTC rechnen
  (17:00 UTC = 10:00 Ortszeit), sonst liegen Zeitfenster-Tests daneben.
- **`hvac_modes`** kann als Enum oder String im State stehen — in Tests
  `getattr(m, "value", m)` vergleichen.
- **Diagnose-Zeitstempel sind UTC**, Dateinamen und Screenshots Ortszeit. Zeitzone ist
  `Europe/Berlin`.
- **Diagnose-Schlüssel:** `config.temperature_sensor` (nicht `temp_sensor`), `values.target_temp`,
  `values.trv_setpoint`, `values.sync_state`, `series.t/i/z/s/v/a` (`i` = Ist, `z` = Ziel,
  `s` = Sollwert am Gerät, `a` = Aktivität `h/i/o/w`).
- **`qm guest exec` ist busybox**: kein `grep --include`, kein `du --max-depth`, kein `find -xdev`.
- **Geräte-Eigenheiten** (Tuya TRV602Z, Bosch BTH-RM, Livisi, AVM) in der Skill-Sammlung unter
  `references/device-quirks.md` nachsehen, bevor Neues gebaut wird.

---

## 5. Stand und offene Punkte

- **Aktuell:** `0.62.38b1` (Arbeitsplatz-Zonen, Warnung zur Gerätezuordnung, Befund „Bewohner
  ohne Entität", Schlaf-Log-Fix). 553 Python-Tests auf beiden HA-Linien grün, Karte 66/66.
- **Produktiv** läuft die Version, die der Nutzer zuletzt über HACS installiert hat — vor
  Aussagen immer `raumklima/diagnostics` → `environment.integration` prüfen.
- **Offen:** Handbuch (`docs/{de,en,fr}`) ist auf dem Stand von 0.62.22 und wird erst zum
  Release Candidate aufgefrischt — dann in einem Zug DE/EN/FR, und das Stable baut die PDFs neu.
- **Offen:** Kacheln der Übersicht könnten antippbar werden, um die große Raumkarte zu öffnen,
  auch wenn die Darstellung auf „Kachel" steht.
- **Erledigt:** Anonymisierung (keine Personennamen in Changelog, Handbuch, Tests),
  HVAC-Modus „Auto" (Gerät fährt eigenes Programm), Vorheizen-Modi, Homeoffice, Nachtruhe über
  HA-Entität, Anwesenheits-Temperatur je Raum.

## 6. Erste Schritte für einen neuen Agenten

```bash
# 1) Repo sauber und gleichauf?
git -C /workspace/Raumklima-2 status --porcelain && git -C /workspace/Raumklima-2 fetch -q origin
git -C /workspace/Raumklima-2 rev-list --left-right --count origin/main...HEAD

# 2) Läuft das Produktivsystem, welche Version?
curl -s -H "Authorization: Bearer $TOKEN" http://192.168.178.190:8123/api/config \
  | python3 -c "import sys,json;d=json.load(sys.stdin);print(d['version'],d['state'])"

# 3) Tests auf beiden Linien (siehe Abschnitt 2)

# 4) Offene Issues
python3 - <<'PY'
import json, os, urllib.request
tok = open(os.path.expanduser("~/.git-credentials")).read().split("ghp_")[1].split("@")[0]
req = urllib.request.Request(
    "https://api.github.com/repos/Goldi5/Raumklima-2/issues?state=open",
    headers={"Authorization": f"token ghp_{tok}", "User-Agent": "agent"},
)
for i in json.load(urllib.request.urlopen(req)):
    if "pull_request" not in i:
        print(i["number"], i["title"])
PY
```
