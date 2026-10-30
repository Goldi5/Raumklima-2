# Raumklima für Home Assistant

Virtuelles Thermostat pro Raum: regelt nach einem **externen Temperaturfühler**,
pausiert bei **offenem Fenster** und prüft, ob das Heizkörperthermostat (TRV)
jeden Befehl wirklich übernommen hat – robust auch bei kurzen
Verbindungsabbrüchen (z. B. über VPN).

Entwickelt und gedacht für Tuya-TRVs über Zigbee2MQTT (z. B. TRV602Z / TS0601),
funktioniert aber mit jedem `climate`-Thermostat.

**Aktuelle Version: 0.2.1** – Änderungen siehe [CHANGELOG.md](CHANGELOG.md).

## Funktionen

- **Automatischer Offset:** Das TRV bekommt laufend einen Korrekturwert
  (`local_temperature_calibration`), damit es die echte Raumtemperatur „sieht“.
  - Rückrechnung auf den Rohwert (kein Aufschaukeln)
  - Senden erst ab einstellbarer Änderung (Standard 0,3 °C) und mit Mindestabstand
  - Ausreißer-Filter, keine Nachführung bei offenem Fenster
  - Alternative Kalibrierart „Sollwert anpassen“ für TRVs ohne Offset
- **Fensterlogik:** beliebig viele Kontakte, getrennte Verzögerung für Auf/Zu
  (Standard je 10 s). Die Einstellung bleibt erhalten und wird nach dem Schließen
  wiederhergestellt – auch nach einem Neustart.
- **Schutz bei Verbindungsabbrüchen**
  - `unavailable`/`unknown` lösen keine Fenster-Ereignisse aus
  - Jeder Befehl wird nach 20 s geprüft und mit wachsendem Abstand wiederholt
  - Nur der neueste Soll-Zustand wird verfolgt (keine veraltete Warteschlange)
  - Sofortiges Nachsenden, sobald das TRV wieder erreichbar ist
  - Abgleich alle 10 min als Sicherheitsnetz
  - Benachrichtigung, wenn das TRV nach X Versuchen nicht reagiert
- **Fühler ausgefallen?** Dann regelt das TRV mit eigenem Sensor weiter, der
  Offset wird eingefroren und der Status zeigt eine Warnung.
- **Änderungen am TRV** werden wahlweise übernommen oder zurückgesetzt
  (Kindersicherung).
- Erkennt automatisch, wie das TRV ausgeschaltet wird (Preset `off`,
  HVAC `off` oder Minimaltemperatur).
- **Preset zum Heizen** wird automatisch gewählt (`manual` → `heat` → `eco` →
  `comfort`) und ist pro Raum einstellbar. Presets wie `on`, `auto` oder
  `antifrost` werden gemieden, weil das TRV darin nicht auf den Sollwert regelt.
- **Preset-Wechsel am TRV** (z. B. jemand drückt am Gerät auf Eco) überschreibt
  die Solltemperatur nicht: Raumklima stellt Preset und Sollwert wieder her.
- **Offset-Startwert:** Meldet das TRV noch keinen Offset (`unknown`, typisch bei
  Tuya), sendet Raumklima einmalig 0 und kalibriert danach normal.

## Lüftungsassistent (ab 0.2)

Bewertet pro Raum Luftfeuchte, Fenster und Temperatur und meldet sich per
Push (iPhone mit Knöpfen *Erledigt · In 15 min erinnern · Heute nicht mehr*) und
optional per Sprachansage (z. B. Alexa).

| Meldung | Auslöser |
|---|---|
| 💧 Bitte lüften | Feuchte ≥ Grenze (Standard 70 %, Bad 75 %) seit 15 min, Fenster zu – und draußen ist die Luft absolut trockener |
| 🪟 Fenster schließen | Fenster länger offen als die empfohlene Lüftdauer |
| 🥶 Raum kühlt aus | unter Mindesttemperatur (Wohnraum 18 °C, Schlafzimmer/selten genutzt 16 °C) oder mehr als 3 °C abgekühlt |
| ✅ Luft ausgetauscht | Fenster offen und Feuchte wieder unter Grenze − 5 % |

Empfohlene Lüftdauer nach Außentemperatur (Wetter-Entität, z. B. Pirate Weather):
unter 0 °C 4 min · 0–5 °C 5 min · 5–10 °C 10 min · 10–15 °C 15 min ·
15–20 °C 20 min · darüber 30 min. Ohne Außenwerte gilt die Monatstabelle von
co2online. Ruhezeiten (Standard 22–7 Uhr): nur stille Push-Nachrichten.

Grundlagen: Umweltbundesamt, co2online, LAUG.

Für eigene Automationen feuert Raumklima das Ereignis `raumklima_event`
(`type: ventilation`, `state`, `room`).

## Raumklima-Karte (ab 0.2)

Wird mit der Integration ausgeliefert und automatisch geladen – keine extra
Installation:

```yaml
type: custom:raumklima-overview-card   # alle Räume + Außenklima
title: Heizung
---
type: custom:raumklima-card            # ein Raum
entity: climate.finja_berlin_wohnzimmer
```

## Entitäten pro Raum

| Entität | Bedeutung |
|---|---|
| `climate.<raum>` | Das Thermostat, das du bedienst |
| `sensor.<raum>_status` | Heizt / Temperatur erreicht / Pausiert – Fenster offen / Aus / Fühler ausgefallen / Thermostat nicht erreichbar |
| `sensor.<raum>_synchronisierung` | OK / Ausstehend / Fehlgeschlagen |
| `sensor.<raum>_kalibrier_offset` | Aktueller Offset |
| `binary_sensor.<raum>_fenster` | Mindestens ein Fenster offen |
| `binary_sensor.<raum>_problem` | Fühler/TRV weg oder Befehl nicht bestätigt |
| `switch.<raum>_fensterlogik` | Fensterfunktion ein/aus |
| `button.<raum>_jetzt_kalibrieren` | Offset sofort neu berechnen |
| `sensor.<raum>_luftung` | OK / Bitte lüften / Lüftet / Luft ausgetauscht / Bitte schließen / Kühlt aus |
| `sensor.<raum>_taupunkt`, `…_absolute_feuchte` | Raumklima-Werte |
| `sensor.<raum>_empfohlene_luftdauer` | aus Außentemperatur |
| `binary_sensor.<raum>_schimmelrisiko` | dauerhaft feucht oder kalt und feucht |
| `number.<raum>_feuchtegrenze…`, `…_mindesttemperatur…`, `…_max_abkuhlung…` | pro Raum einstellbar |
| `switch.<raum>_luftungs_benachrichtigungen` | Hinweise ein/aus |

## Installation über HACS

1. HACS → ⋮ → **Benutzerdefinierte Repositories** → URL dieses Repos, Typ
   **Integration**.
2. „Raumklima“ installieren, Home Assistant neu starten.
3. Einstellungen → Geräte & Dienste → **Integration hinzufügen** → „Raumklima“.

Manuell: Ordner `custom_components/raumklima` nach `/config/custom_components/`
kopieren und neu starten.

## Einrichtung

1. **Raum:** Name, TRV, externer Fühler, optional Luftfeuchte und Fensterkontakte.
2. **Kalibrierung:** Die Offset-Entität des TRV wird automatisch gesucht
   (meist `number.…_local_temperature_calibration`). Außerdem: wie das TRV
   ausgeschaltet wird und welches Preset zum Heizen dient (Standard: automatisch).
3. **Einstellungen:** Verzögerungen, Schwellen, Prüf- und Wiederholungszeiten.

Alles lässt sich später über **Konfigurieren** ändern.

## Wichtig bei Umstieg von der YAML-Lösung

- Die Automationen aus `heizung_raum.yaml` **deaktivieren oder löschen**, sonst
  steuern zwei Systeme dasselbe TRV.
- Die eingebaute Fenstererkennung des TRV (`window_detection`) ausschalten.
- Ab jetzt nur noch `climate.<raum>` bedienen (Dashboard, Sprachassistent).

## Hinweise zum Tuya TRV602Z (TS0601)

Im echten Betrieb getestet. Wichtig zu wissen:

| Preset | Verhalten am TRV602Z | Für Raumklima |
|---|---|---|
| `on` | **Ventil dauerhaft offen**, ignoriert den Sollwert | ❌ nie verwenden |
| `eco` | Regelt auf den gesendeten Sollwert (lädt beim Umschalten kurz `eco_temperature`) | ✅ empfohlen (Automatik wählt es) |
| `comfort` | Regelt, lädt beim Umschalten `comfort_temperature` | ✅ möglich |
| `auto` | Folgt dem Wochenprogramm im Gerät | ❌ |
| `off` / `antifrost` | Aus bzw. Frostschutz | nur zum Ausschalten |

Weitere Empfehlungen:

- **Hysterese** (`select.…_hysteresis`) auf `comfort` stellen: Das Ventil öffnet
  stufenlos statt nur ganz auf/zu.
- Die eingebaute Fenstererkennung (`window_detection`) ausschalten.
- Der Treiber kennt keinen echten „manuellen“ Modus – Zuordnung laut
  [zigbee-herdsman-converters](https://github.com/Koenkk/zigbee-herdsman-converters):
  `0 off · 1 antifrost · 2 eco · 3 comfort · 4 auto · 5 on`.

## Hinweis zu Zigbee2MQTT

Z2M meldet geänderte Werte standardmäßig „optimistisch“ zurück, sobald der
Zigbee-Befehl erfolgreich war. Geht der Befehl schon zwischen Home Assistant
und Z2M verloren (z. B. VPN-Abbruch), bleibt der Wert unverändert – genau das
erkennt die Prüfung. Wer es ganz streng möchte, setzt in Z2M für das TRV
`optimistic: false`; dann zählt nur, was das Gerät selbst zurückmeldet.

## Entwicklung

```bash
pip install pytest
pytest tests        # Logik und Wiederhol-Mechanik, ohne Home Assistant
```

Fehlersuche: Einstellungen → Geräte → Raum → **Diagnose herunterladen**, oder in
`configuration.yaml`:

```yaml
logger:
  logs:
    custom_components.raumklima: debug
```

## Fahrplan

- v0.2: Dashboard/Lovelace-Karte, Presets (Eco/Komfort/Abwesend/Boost), Ventilpflege
- v0.3: Lüftungsassistent (Luftfeuchte/Taupunkt), Benachrichtigungen bei langem
  Lüften, Außentemperatur-Abschaltung
- v0.4: PID-Regelung, Zeitpläne, Mehrraum-Übersicht, Statistik

## Lizenz

MIT
