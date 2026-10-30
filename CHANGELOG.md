# Changelog

## 0.1.2 – 2026-10-30

### Behoben
- Meldet das TRV noch keinen Kalibrier-Offset (Zustand `unknown`, typisch bei
  Tuya-TRVs bis zum ersten Setzen), wurde nie kalibriert. Raumklima sendet jetzt
  einmalig `0` als Startwert und kalibriert danach normal.

## 0.1.1 – 2026-10-30

### Neu
- Option **„Preset zum Heizen (An)“** pro Raum im Kalibrierungs-Schritt
  (Standard: automatisch).

### Geändert
- Die Automatik wählt das An-Preset in der Reihenfolge `manual` → `heat` → `eco`
  → `comfort` und meidet `on`, `auto`, `antifrost` usw.

### Behoben
- **TRV602Z:** Das Preset `on` bedeutet „Ventil dauerhaft offen“. Bisher konnte
  Raumklima es als An-Preset wählen, wodurch der Raum ungeregelt durchheizte.
- Ein Preset-Wechsel am TRV (z. B. auf `eco`, das `eco_temperature` lädt) wurde
  als neue Solltemperatur übernommen. Jetzt stellt Raumklima Preset und Sollwert
  wieder her.

## 0.1.0 – 2026-10-29

Erste Version: virtuelles Thermostat mit externem Fühler (automatischer Offset),
Fensterlogik mit getrennten Verzögerungen, Sync-Prüfung mit Wiederholung bei
Verbindungsabbrüchen, Notbetrieb bei Fühlerausfall, Einrichtung über die
Oberfläche (Deutsch/Englisch).
