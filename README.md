# Raumklima für Home Assistant

Virtuelles Thermostat pro Raum: regelt nach einem **externen Temperaturfühler**,
pausiert bei **offenem Fenster** und prüft, ob das Heizkörperthermostat (TRV)
jeden Befehl wirklich übernommen hat – robust auch bei kurzen
Verbindungsabbrüchen (z. B. über VPN).

Entwickelt und gedacht für Tuya-TRVs über Zigbee2MQTT (z. B. TRV602Z / TS0601),
funktioniert aber mit jedem `climate`-Thermostat.

## Funktionen (v0.1)

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
   (meist `number.…_local_temperature_calibration`).
3. **Einstellungen:** Verzögerungen, Schwellen, Prüf- und Wiederholungszeiten.

Alles lässt sich später über **Konfigurieren** ändern.

## Wichtig bei Umstieg von der YAML-Lösung

- Die Automationen aus `heizung_raum.yaml` **deaktivieren oder löschen**, sonst
  steuern zwei Systeme dasselbe TRV.
- Die eingebaute Fenstererkennung des TRV (`window_detection`) ausschalten.
- Ab jetzt nur noch `climate.<raum>` bedienen (Dashboard, Sprachassistent).

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

- v0.2: eigene Lovelace-Karte, Presets (Eco/Komfort/Abwesend/Boost), Ventilpflege
- v0.3: Lüftungsassistent (Luftfeuchte/Taupunkt), Benachrichtigungen bei langem
  Lüften, Außentemperatur-Abschaltung
- v0.4: PID-Regelung, Zeitpläne, Mehrraum-Übersicht, Statistik

## Lizenz

MIT
