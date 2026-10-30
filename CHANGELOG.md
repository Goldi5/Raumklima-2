# Changelog

## 0.2.0 – 2026-10-30

### Neu
- **Lüftungsassistent:** Bitte lüften / Fenster schließen / Raum kühlt aus /
  Luft ausgetauscht – mit Außenklima (Wetter-Entität), absoluter Feuchte und
  empfohlener Lüftdauer nach Außentemperatur.
- **Benachrichtigungen** an frei wählbare notify-Dienste, iPhone-Knöpfe
  (Erledigt, In 15 min erinnern, Heute nicht mehr), Ruhezeiten, optionale
  Sprachansagen.
- Neue Entitäten: Lüftung, Taupunkt, absolute Feuchte, empfohlene Lüftdauer,
  Schimmelrisiko, Regler für Feuchtegrenze/Mindesttemperatur/max. Abkühlung,
  Schalter für Benachrichtigungen; Ventilstellung als Attribut.
- **Raumklima-Karte** (`custom:raumklima-card`) und **Übersichtskarte**
  (`custom:raumklima-overview-card`), automatisch geladen.
- Einrichtungsassistent: neuer Schritt „Lüften & Benachrichtigungen“ mit Raumtyp.
- Ereignis `raumklima_event` für eigene Automationen.

## 0.1.3 – 2026-10-30

### Behoben
- Nach einem Preset-Wechsel meldet der TRV602Z den gespeicherten Wert (z. B.
  `eco_temperature`) erst im nächsten Update. Dieser wurde als neue
  Solltemperatur übernommen. Jetzt gilt eine Schonfrist von 60 s, in der
  Sollwert-Änderungen ignoriert und der eigene Sollwert wiederhergestellt wird.

### Geändert
- Raumklima erscheint jetzt unter **Integrationen** statt unter **Helfer**.

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
