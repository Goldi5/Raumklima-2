# Einstellungen 2.0 – Landkarte (Phase 0)

**Stand:** 2026-11-13  
**Zweck:** Inventar der heutigen Einstellungen und Zuordnung zum Zielbild aus
[`einstellungen-2.md`](einstellungen-2.md). Keine UI-Änderung; nur Bestandsaufnahme.

## Legende

- **Ebene:** `G` global, `W` Wohnung, `R` Raum, `D` Gerät/Quelle.
- **Status:** `ok` = eindeutig, `prüfen` = Zuordnung oder Aufteilung noch offen,
  `neu` = Zielbereich existiert noch nicht.
- **Ziel:** Bereich → Unterseite.

## 1. Allgemein (`settings/general.js`)

| Heute (Gruppe) | Wichtige Zeilen | Ziel | Ebene | Status |
|---|---|---|---|---|
| Erste Schritte | Checkliste (Bewohner, Empfänger, Wetter, Raum, Fenster, Zeitplan) | Wohnungen → Erste Schritte | G | ok |
| Gesundheit der Heizung | Batterien, „wird nicht warm“, Fühler, Funk, Fensterkontakt | System & Diagnose → Gesundheit | G | ok |
| Anwesenheit & Absenkung | Wer wohnt hier, Zone, Absenken nach, Urlaub, Gäste, Homeoffice, Kalender | Personen & Anwesenheit → Anwesenheit | G | ok |
| Anwesenheit & Absenkung → Weitere | Anwesenheit aus, Gäste gelten für, „länger weg“ ab, Vorheizen ab, Urlaub automatisch, Arbeitsplätze, Präsenzmelder zählen | Personen & Anwesenheit → Anwesenheit (erweitert) | G | ok |
| Heizsaison & Heizgrenze | Betriebsart, Heizgrenze, Heute heizen | Heizung & Energie → Heizsaison | G | ok |
| Heizsaison & Heizgrenze → Weitere | Heizsaison, Außentemperatur von, Kälteeinbruch, Sicherung, Frostnacht, Sommerpflege | Heizung & Energie → Heizsaison & Wetter | G | ok |
| Wer bekommt was | Empfänger-Karten, Empfänger hinzufügen | Benachrichtigungen → Empfänger | G | ok |
| Benachrichtigungen allgemein | Nur an anwesende Personen, Ereignisse, Erinnern alle, Fehler in HA-Glocke | Benachrichtigungen → Allgemein | G | ok |
| Nacht & Ruhezeit | Ruhezeit, Wochenende bis, Ruhezeit senkt ab | Personen & Anwesenheit → Nacht & Schlaf | G | ok |
| Nacht & Ruhezeit → Weitere | Absenkwert nachts, Nachtruhe über Entität, Nachtlüften, leise warnen, Zeiten lernen, Schichtdienst, Feiertage, Schlaf-Signale | Personen & Anwesenheit → Nacht & Schlaf (erweitert) | G | ok |
| Berichte | PDF-Berichte, PDF per E-Mail, Test, Heizkosten pro Jahr | Heizung & Energie → Berichte | G | ok |
| Wohnung | Name, Bauart, Wetterquelle, Dashboard, Standort, weitere Wohnung | Wohnungen → Wohnung | W | ok |
| Alle Räume auf einen Blick | Raumraster mit Status | Räume → Übersicht | W | prüfen ( redundant zur Raumliste?) |

## 2. Raum (`settings/room.js`)

| Heute (Gruppe) | Wichtige Zeilen | Ziel | Ebene | Status |
|---|---|---|---|---|
| Gesundheit | Raumbezogene Warnungen | Raum → Übersicht | R | ok |
| Überwachung | „Kein Thermostat“ (nur Messen) | Raum → Übersicht | R | ok |
| Temperatur | Wunsch, Raumtyp, Wohnung, Absenkung kurz/länger, Aufheizen | Raum → Regelung | R | ok |
| Temperatur → Weitere | Vorheizen, „nicht vor“, „höchstens“, Nachtabsenkung, Sonnenseite, Sonne kommt aus, gilt für Personen | Raum → Regelung (erweitert) | R | prüfen (Vorheizen evtl. Zeitplan) |
| Lüften & Feuchte | Feuchtegrenze, Mindesttemperatur, Jetzt, empfohlene Lüftdauer | Raum → Fenster & Lüften | R | ok |
| Lüften & Feuchte → Weitere | Max. Abkühlung, CO₂-Grenze/Sensor | Raum → Fenster & Lüften (erweitert) | R | ok |
| Schimmelschutz | Schimmelschutz, Wand, Feuchte | Raum → Schimmel | R | ok |
| Fenster | Pause bei offenem Fenster, Kontakte, Pause/Weiter nach, Schlafen bei offenem Fenster, Temperatursturz | Raum → Fenster & Lüften | R | ok |
| Benachrichtigungen | Hinweise für diesen Raum, Empfänger | Raum → Meldungen | R | neu (Unterseite) |
| Thermostat & Fühler / Fühler & Sensoren | Thermostat, weitere Thermostate | Raum → Heizquellen | R/D | prüfen (Aufteilung) |
| Thermostat & Fühler / Fühler & Sensoren | Temperaturfühler, Feuchtefühler, CO₂, PM2,5 | Raum → Geräte & Sensoren | R | neu (Unterseite) |
| Thermostat & Fühler → Technik | Übertragung, Batterie, Ein/Aus, Kalibrierung, Drehen am Thermostat | Raum → Geräte & Sensoren | R/D | neu (Unterseite) |
| Heizquellen | Haupt-Thermostat, weitere Quellen, Typ, Auslöser, Offset, „unangetastet“ | Raum → Heizquellen | R/D | ok |
| Präsenzmelder | Melder, Anwesenheits-Temperatur, Verzögerungen, Lampen, Art, Eco | Raum → Präsenz | R | ok |
| Lichtsignal | Lampen, Blinken bei, Test | Raum → Meldungen | R | neu (Unterseite) |

## 3. Zeitplan und Lüftfenster (`settings/schedule.js`)

| Heute (Gruppe) | Wichtige Zeilen | Ziel | Ebene | Status |
|---|---|---|---|---|
| Zeitplan | Zeitfenster, Quellen je Fenster, Zeitplan von, Außerhalb der Zeitfenster, Überschreiben, Boost-Temperatur/-Dauer, Boost für | Raum → Zeitplan | R | prüfen (Boost evtl. Regelung) |
| Lüften ohne Erinnerung | Lüftfenster, gewohntes Lüften, Mindestdauer, Dauerlüftung, leise Erinnerung, nur wenn jemand im Raum | Raum → Fenster & Lüften | R | ok |

## 4. Lernen (`settings/learn.js`)

| Heute (Gruppe) | Wichtige Zeilen | Ziel | Ebene | Status |
|---|---|---|---|---|
| Lernen & Warum (global) | Schlafzeiten, Anwesenheitsprofil, Vorschlag, Entscheidungen, Erklärungen | Wohnungen → Lernen | W/G | prüfen (eigener Bereich?) |
| Lernen & Warum (Raum) | Aufheizrate, Vorheizen, Warum-Seite, Entscheidungen, Erklärungen | Raum → Lernen & Verlauf | R | ok |

## 5. Darstellung (`settings/layout.js`)

| Heute (Gruppe) | Wichtige Zeilen | Ziel | Ebene | Status |
|---|---|---|---|---|
| Darstellung | Dunkler Look, Reihenfolge, Größe, Farbe | System & Diagnose → Darstellung | W | ok |

## 6. Querschnitt: gleiche Themen, verschiedene Ebenen

Diese Paare sind **keine Duplikate**, müssen aber im neuen UI klar als
„global“ bzw. „nur dieser Raum“ erkennbar sein:

| Thema | Global/Wohnung | Raum | Entscheidung |
|---|---|---|---|
| Nachtabsenkung | Absenkwert nachts | Nachtabsenkung Automatisch/Immer/Nie | Behalten; Herkunft anzeigen |
| Präsenz | Präsenzmelder zählen, Homeoffice, Gäste | konkrete Melder, Anwesenheits-Temperatur, Eco | Behalten; global = Politik, Raum = Geräte |
| Benachrichtigungen | Empfänger, Ereignisse, Ruhezeit | Hinweise für diesen Raum, Empfänger, Lichtsignal | Raum → Meldungen |
| Gesundheit | Gesamtübersicht | Raumwarnungen | Behalten; global = Übersicht |
| Lernen | Schlafzeiten, Anwesenheitsprofil | Aufheizrate, Warum | Behalten; global = Zusammenfassung |
| Wetter | Wetterquelle, Außentemperatur | Sonnenseite/Fassade | Behalten; global = Quelle, Raum = Wirkung |
| Zeitplan | — | Zeitfenster, „Zeitplan von“ | Behalten; Teilen bleibt pro Raum |

## 7. Offene Punkte für Phase 0

1. **Raum-Unterseiten erweitert:** „Meldungen“ und „Geräte & Sensoren“ sind
   nötig, sonst haben Raum-Benachrichtigungen, Fühler und Technik keinen Ort.
2. **Boost:** gehört fachlich eher zu „Regelung“ oder „Heizquellen“ als zum
   Zeitplan; Entscheidung vor Phase 3.
3. **Vorheizen:** gehört es zu „Regelung“ (Raumverhalten) oder „Zeitplan“
   (Start vor dem Fenster)? Empfehlung: Regelung, mit Link zum Zeitplan.
4. **Raum-Wohnung:** Die Zuordnung „Wohnung“ liegt heute unter Temperatur;
   im neuen UI besser in „Übersicht“.
5. **Globales Lernen:** eigener Bereich oder Unterbereich von „Wohnungen“?
   Empfehlung: „Wohnungen → Lernen“, damit die Hauptnavigation klein bleibt.
6. **„Alle Räume auf einen Blick“:** redundant zur neuen Raumliste; prüfen,
   ob die Gruppe entfällt oder als Statusübersicht bleibt.
7. **Erste Schritte:** als Startseite der Einstellungen oder unter „Wohnungen“?
   Empfehlung: Startseite, mit Link in „Wohnungen“.
8. **„Erweitert“:** existiert heute nur als Rail-Eintrag ohne eigene Gruppe;
   im neuen UI unter „System & Diagnose“ als eingeklappter Bereich.

## 8. Ergebnis Phase 0

- Jede heutige Gruppe ist einem Zielbereich zugeordnet.
- Zwei zusätzliche Raum-Unterseiten wurden identifiziert:
  **Meldungen** und **Geräte & Sensoren**.
- Acht offene Entscheidungen sind dokumentiert; keine blockiert Phase 1.
- Nächster Schritt: Phase 1 – Navigationsgerüst hinter `settings_nav_v2`,
  zunächst ohne Zeilen zu verschieben.
