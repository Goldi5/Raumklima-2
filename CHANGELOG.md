# Changelog

## 0.5.0 – 2026-10-31

### Neu
- **Protokoll:** neuer Reiter (Karte `raumklima-log-card`) zeigt live, was wann warum entschieden
  wurde – Anwesenheit (mit Entfernungen), ignorierte Ortungssprünge (VPN), Heizsaison mit
  Mittelwerten, Zieltemperaturen je Raum mit Grund, Fenster/Nachtlüften, jede Nachricht mit
  Empfängern und Lautstärke, Knöpfe in der Push, Thermostat-Befehle und Aussetzer, Gesundheit,
  Änderungen von Hand und an den Einstellungen. Filter nach Raum, Kategorie und Suchtext;
  14 Tage im eigenen Speicher (belastet die HA-Datenbank nicht), auch im Diagnose-Export.
  WebSocket: `raumklima/log`, `raumklima/log/subscribe`.
- **Ruhezeit am Wochenende:** Sa und So endet die Ruhezeit später (Standard 9:00, einstellbar
  unter Allgemein → Benachrichtigungen). Gilt auch für Nachtlüften-Morgengruß und „Bis morgen früh“.


## 0.4.1 – 2026-10-30

### Neu
- **Nachtlüften:** Geht abends (20–3 Uhr, einstellbar) in einem Schlafraum ein Fenster auf, während
  jemand zu Hause ist, gilt das als Schlafen bei offenem Fenster: Heizung wartet, keine Hinweise
  „Fenster schließen“ oder „Raum kühlt aus“ (die sonst trotz Ruhezeit laut kämen). Nur unter 12 °C
  einmal eine leise Warnung; morgens zum Ende der Ruhezeit „Fenster noch offen – Heizung wartet“
  (danach höchstens alle 30 min). Pro Raum: Automatisch (Schlafzimmer, selten genutzt) / Ja / Nein.
  Eigener Zustand „Nachtlüften“ in Zeitleiste und Bericht.

### Behoben
- „Heute nicht mehr“ in der Push galt abends nur bis Mitternacht – jetzt bis zum Ende der Ruhezeit
  am nächsten Morgen (Knopf heißt dann „Bis morgen früh“).


## 0.4.0 – 2026-10-30

### Neu
- **Heizbericht:** neuer Reiter „Bericht“ (Karte `raumklima-report-card`) mit Woche/Monat:
  Heizstunden, wetterbereinigter Vergleich über Heizgradtage, Absenkstunden und geschätzte
  Ersparnis, Wohlfühlzeit, Heizbedarf pro Tag je Raum, Feuchte- und Schimmelstunden,
  „warm bei Ankunft“. Daten werden minütlich gesammelt und 400 Tage als Tageswerte gespeichert.
- **Wochenbericht** als Push sonntags 18 Uhr (Nachrichtenart „📊 Wochenbericht“).
- **Gesundheitscheck** alle 10 min: Batterien, Raum wird nicht warm, Fühler hängt, Funk,
  Fensterkontakt. Anzeige in Bericht, Einstellungen und Raum-Reiter; Sensor
  „Raumklima Allgemein Gesundheit“; Push „🩺 Gesundheit der Heizung“ (max. 1× pro Tag je Problem).
- Bestehende Push-Empfänger bekommen die beiden neuen Nachrichtenarten automatisch.
- WebSocket-Befehl `raumklima/report`.


## 0.3.1 – 2026-10-30

### Geändert
- Einstellungsseite: „Ø 24 h sammelt noch“, solange noch keine Messwerte vorliegen.
- Einstellungsmenü der Zentrale robuster.
- Dokumentation neu: ausführlich auf Deutsch und Englisch mit Screenshots (`docs/`).

## 0.3.0 – 2026-10-30

### Neu
- **Raumklima Allgemein** (Zentrale, wird automatisch angelegt): Empfänger, Ruhezeit,
  Wetterquelle, Anwesenheit und Heizsaison gelten für alle Räume. Bisherige Einstellungen
  der Räume werden übernommen.
- **Wer bekommt was:** pro Empfänger wählbar, welche Nachrichten er bekommt
  (Lüften, Schließen, Auskühlen, Luft ausgetauscht, Fenster offen bei Abwesenheit,
  Abwesenheit/Vorheizen, Heizsaison, Thermostat-Fehler); Testnachricht.
- **Abwesenheit:** Bewohner + Zone der Wohnung; Stufen „kurz weg“ (nach 30 min) und
  „länger weg“ (ab 24 h oder Urlaub) mit Absenkwerten je Raum; **Schimmelschutz** nach
  DIN 4108-2 (Temperaturfaktor je Bauart) bei längerer Abwesenheit; **Vorheizen**, wenn sich
  jemand nähert (Standard 10 km); robuste Ortung (mehrere Handys je Person, Sprungfilter
  gegen VPN-Ausreißer, Genauigkeitsfilter); Schalter Urlaub/Gäste; Drehen am Regler setzt
  die Absenkung 3 h aus.
- **Heizsaison & Heizgrenze:** Saison (Standard 1.10.–30.4.), Heizgrenze nach Tagesmittel
  aus 24 h Messung + 24 h Vorhersage mit Hysterese, Kälteeinbruch-Regel, Betriebsarten
  Automatisch/Immer/Pause, „Heute heizen“, 16-°C-Sicherung, Sommerpflege der Ventile.
- **Neue Hinweise:** „Fenster offen, niemand da“; keine Lüft-Erinnerungen, wenn niemand da ist.
- **Einstellungsseite** im Dashboard komplett bearbeitbar (Allgemein + je Raum).
- **Neuer Einrichtungsassistent:** 3 kurze Schritte mit Vorschlägen aus dem Bereich,
  Technik unter „Erweitert“, Allgemein nur beim ersten Raum.
- Karten zeigen Anwesenheit, Heizbetrieb und abgesenkte Zieltemperaturen.

## 0.2.7 – 2026-10-30

### Geändert
- Zeitleiste „Heizung & Fenster“ ruhiger: Pro Abschnitt (mind. 2 min, einstellbar über
  `min_segment_seconds`, bei langen Zeiträumen automatisch größer) wird der überwiegende
  Zustand gezeigt – kein Flackern mehr durch kurzes Heizt ↔ Erreicht beim Regeln.
- Strategie „Verlauf“: Luftfeuchte und Zeitleiste über die ganze Breite.

## 0.2.6 – 2026-10-30

### Geändert
- Einstellungskarte größer und luftiger (größere Schrift, Regler, Schalter);
  Reiter „Einstellungen“ der Strategie nutzt die volle Breite.
- Ruhezeiten ohne Sekunden (22:00 statt 22:00:00).
- Strategie „Verlauf“: Wettervorhersage oben über die ganze Breite.

## 0.2.5 – 2026-10-30

### Neu
- **Einstellungskarte** `custom:raumklima-settings-card`: Übersicht „Wer bekommt was“
  (Empfänger je Raum, Hinweise aus = durchgestrichen), „Wann gemeldet wird“ mit den
  aktuellen Grenzwerten, Ruhezeit/Wiederholung/Wetterquelle und Tabelle aller Räume.
  Pro Raum: Regler mit +/−, Schalter, Geräte, Kalibrierung und Übertragungsstatus.
- Das Thermostat liefert die Einstellungen als Attribut `settings` (nicht im Verlauf
  gespeichert).
- Die Dashboard-Strategie nutzt die Karte im Reiter „Einstellungen“.

## 0.2.4 – 2026-10-30

### Neu
- **Verlaufskarte** `custom:raumklima-history-card` im Stil der Raumkarten:
  Raumtemperatur, Luftfeuchte oder Zeitleiste „Heizung & Fenster“; Zeitraum
  6 h / 24 h / 7 Tage umschaltbar, Wohlfühlbereich als Band, Raum-Chips mit
  aktuellem Wert zum Ein-/Ausblenden, Tooltip mit allen Räumen.
- Die Dashboard-Strategie nutzt im Reiter „Verlauf“ jetzt diese Karte statt der
  Standard-Diagramme.

## 0.2.3 – 2026-10-30

### Behoben
- Dashboard-Strategie „Raumklima“ meldete „Timeout waiting for strategy element“:
  Die Karte wird jetzt automatisch als **Dashboard-Ressource** eingetragen (und bei
  Updates mit neuer Version aktualisiert), damit HA sie vor dem Dashboard-Aufbau lädt.

## 0.2.2 – 2026-10-30

### Neu
- **Wunschtemperatur** pro Raum (optional, sonst Standard des Raumtyps). Gilt beim
  ersten Start und beim Einschalten eines Raums, der aus war (statt 5 °C o. Ä.).
- **Dashboard-Strategie „Raumklima“**: im Dialog „Dashboard hinzufügen“ wählbar
  (HA 2026.5+), baut Räume/Verlauf/Einstellungen automatisch auf.

### Geändert
- Raumkarte: Skala 14–26 °C (erweitert sich bei Bedarf), Bogen zeigt Ist-Temperatur,
  Knopf das Ziel, bei „Aus“ kein Ziel-Knopf.
- Übersichtskarte: Kachelraster statt langer Zeilen, Option `strip_prefix`.
- Verlauf: ein Diagramm für alle Raumtemperaturen bzw. Feuchten statt einzelner
  Kurven, Zeitleisten statt Ventil-Strichen.

## 0.2.1 – 2026-10-30

### Behoben
- Regler (Feuchtegrenze, Mindesttemperatur, max. Abkühlung) zeigten nach dem
  Ändern weiter den alten Wert an.
- Wird der Raumtyp geändert, gelten jetzt dessen Standardwerte (z. B. Bad 75 %,
  Schlafzimmer 16 °C) statt der zuvor gespeicherten.

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
