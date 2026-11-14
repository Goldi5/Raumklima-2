# Einstellungen 2.0 – Umsetzungsplan

**Stand:** 2026-11-14
**Basis:** 0.62.x (Release 0.62.48b1 auf `main`)
**Zielversion:** 1.1.0
**Entwicklungslinie:** `1.1.0b1` auf dem Branch `next` – Dashboard 2.0 (1.1),
Verschattung (1.2), Fußbodenheizung (1.3), Lernmodell 2.0 (1.4), die
stufenlose Ventilsteuerung (1.5), Klimaanlagen (1.6), Wärmeanforderung (1.7), dynamische Tarife/PV (1.8)
und Auswertung mit Vorhersage (1.9) sind umgesetzt.

**Feature-Freeze 1.0.0:** Der Funktionsumfang von `1.0.0` ist eingefroren. Es kommen
nur noch Fixes, Tests und Dokumentation dazu. Dashboard 2.0, Verschattung,
Auch die Fußbodenheizung und das erweiterte Lernmodell sind umgesetzt.

**1.1 Dashboard 2.0 (umgesetzt):** Die bestehende Strategie
`ll-strategy-dashboard-raumklima` beginnt mit der ursprünglichen Ansicht „Räume“.
Energie und Lernen liegen in einem eigenen Reiter „Energie & Lernen“; die frühere
Ansicht „Heute“ ist entfallen. Die Energiekarte zeigt Zähler, Tarif, Preise,
PV-Eigenverbrauch und eine Euro-Schätzung für 7/30/90 Tage. Die Lernkarte zeigt
Aufheizrate, +2-K-Prognose, Nutzung, Lüftmuster, Präsenzprofil und Schlafzeiten.

**1.2 Verschattung (umgesetzt):** Je Raum lassen sich Rollläden oder Jalousien
auswählen (Integration → Geräte & Technik). Die Raumseite „Fenster & Lüften“
steuert den Modus (Aus, Nur empfehlen, Automatisch), die Schließposition, die
Innen- und Außentemperaturgrenze, das nächtliche Schließen und die Pause nach
Handbedienung. Automatisch nutzt die vorhandene Fassadenprognose
(`solar_facade` + `sun_expected`) und `sun.sun`. Der Status steht in
`settings_summary().shading`.

**1.3 Fußbodenheizung (umgesetzt):** Je Raum lässt sich die Fußbodenheizung
einschalten. Sie nutzt ein breiteres Regelband, eine begrenzte Vorlauf-
temperatur, eine Mindest-Taktzeit und einen Vorlauf vor Zeitfenstern. Optional
lassen sich Vor- und Rücklauffühler auswählen (Integration → Geräte & Technik);
die Raumseite „Regelung“ zeigt Spreizung und Durchfluss-Warnung. Der Zustand
steht in `settings_summary().floor`.

**1.4 Lernmodell 2.0 (umgesetzt):** Das Wärmemodell lernt je Raum die
Aufheizrate, die Abkühlrate und den solaren Zugewinn aus Aufheiz- und
Abkühl-Episoden. Die Lernkarte zeigt die Werte; die Regelung stoppt bei
Sonneneinfluss etwas früher vor dem Ziel, um Überschwingen zu reduzieren. Der
Zustand steht in `settings_summary().thermal`.

**1.5 Stufenlose Ventilsteuerung (umgesetzt):** Für Thermostate mit
einstellbarer Ventilöffnung (z. B. SONOFF TRVZB) kann Raumklima das
`number`-Stellglied direkt fahren. Der Modus „Automatisch“ nutzt es, sobald es
gefunden wurde; „Immer“ erzwingt die direkte Fahrt; „Aus“ bleibt beim Sollwert
am Thermostat. Der Zustand steht in `settings_summary().valve`.

**1.6 Klimaanlagen (umgesetzt):** Kühlen und Heizen haben getrennte Ziele. Die
Klimaanlage bekommt eine Mindestlaufzeit und Mindestpause, damit sie nicht
ständig taktet. Beide Werte stehen je Raum unter „Kühlen“. Die Klimaanlage kann
auch heizen; Raumklima vergleicht dafür COP und Gaspreis und übernimmt nur, wenn
sie günstiger ist.

**1.7 Wärmeanforderung (umgesetzt):** Die Zentrale summiert die Heizlücke aller
fordernden Räume und schlägt einen Vorlauf vor. Der Sensor
`sensor.raumklima_allgemein_warmeanforderung` zeigt „Wärme“/„Bereit“; die Attribute
nennen Summe, Vorlauf und die fordernden Räume.

**1.8 Dynamische Tarife und PV-Überschuss (umgesetzt):** Der Tarif-Sensor kann
als dynamisch markiert werden; die Energiekarte zeigt den aktuellen Preis und den
PV-Überschuss. Ist Strom günstig, startet die Heizung bis zu 60 min vor einem
Zeitfenster. Die Kostenschätzung nutzt weiterhin den aktuellen Preis.

**1.9 Auswertung mit Vorhersage (umgesetzt):** Der Verlauf summiert die vom
Wärmemodell erwartete Temperatur und die Abweichung zum Ist-Wert. CSV und
Bericht enthalten `vorhersage_mittel_C` und `vorhersage_fehler_K`.

**1.10 Demo-Modus (umgesetzt):** In der Dashboard-Konfiguration `demo: true`
setzen; die Strategie zeigt dann eine Demo-Ansicht mit drei simulierten Räumen.
Die Demo-Karte erlaubt Temperatur ändern und Fenster umschalten – ohne Hardware
und ohne persönliche Daten.

**1.11 Raumverwaltung (umgesetzt):** Räume lassen sich in der Einstellungs-Karte
anlegen und löschen, ohne HA-Einstellungen → Geräte & Integrationen.

**1.12 Einrichtungsassistent (umgesetzt):** Geführter Assistent mit
Ja/Nein-Zweigen durch Wohnung, Heizung, PV, Energie, Anwesenheit, Komfort,
Lüften, Verschattung und Fußboden. Er legt die Wohnung/Einstellungen und den Raum
direkt an; danach kann alles in den Einstellungen feinjustiert werden.

**1.13 Energieabrechnung 2.0 (umgesetzt):** Dynamische Tarife werden aus dem
Preisverlauf gemittelt; die Einstellungen zeigen den aktuellen Sensorwert und die
Preisbasis (brutto/netto, MwSt., zusätzliche Abgaben). Die Energiekarte kennt
„Heute“. Der Wetter-Reiter zeigt aktuelle Werte und Heizgrenzen; System &
Diagnose zeigt Version, Entitäten und offene Hinweise.

Dieses Dokument beschreibt den Umbau der Einstellungen und die getrennte
1.0-Entwicklungslinie. Es ist ein Plan, keine Zusage: Phasen und Aufwände
können sich mit den Rückmeldungen aus der Beta ändern.

## 1. Ziel

Die Einstellungen wachsen, sollen aber nicht zu einer endlosen Seite werden.
Stattdessen:

- klare **Bereiche** für globale Themen,
- eine eigene **Detailseite pro Raum**,
- **globale Vorgaben mit Overrides** statt doppelter Pflege,
- **eine Einstellung, ein Ort** – Querverweise statt Kopien.

In den Phasen 1–4 wird nur die Struktur umgebaut. **Keine neuen Funktionen**
in diesem Zeitraum; neue Funktionen docken danach an das neue Gerüst an.

## 2. Entscheidungen

| Frage | Entscheidung |
|---|---|
| Testumgebung | Getrennte Test-HA; Produktion bleibt auf 0.62.x |
| Release-Weg | Gleiches Repo, Branch `next`, **keine HACS-Releases** für 1.0-Betas |
| Versionsnummer | `1.0.0b1` in der `next`-Linie; `1.0.0` erst nach dem Merge |
| Fix-Portierung | Sofort per Cherry-Pick von `main` nach `next` |
| Parallele Installation | Nein; beide Linien laufen nicht gleichzeitig in derselben HA-Instanz |

## 3. Leitprinzipien

1. **Tiefe statt Länge:** maximal zwei Navigationsebenen (Bereich → Raum →
   Unterseite).
2. **Vererbung:** `Standard → Wohnung → Raum → Gerät/Quelle`. Jeder Wert
   zeigt seine Herkunft und lässt sich zurücksetzen.
3. **Keine Datenmigration in Phase 1–4:** Die bestehenden WebSocket-Aufrufe
   (`raumklima/config`, `raumklima/hub/update`, `raumklima/room/update`)
   bleiben unverändert.
4. **Rückrollbar:** Das neue Navigationsgerüst läuft hinter einem Flag; die
   alte Darstellung bleibt als Fallback.
5. **Keine Feature-Arbeit auf `main`:** Dort nur Fixes, Dokumentation,
   Sicherheit und Abhängigkeiten.

## 4. Zielstruktur

### 4.1 Bereiche

| Bereich | Ebene | Inhalt |
|---|---|---|
| **Wohnungen** | global | Wohnungen, Dashboards, Sicherung, Standardwerte |
| **Räume** | pro Raum | Liste → Raum öffnen → Unterseiten |
| **Personen & Anwesenheit** | global | Bewohner, Zone, Urlaub/Gäste, Homeoffice, Kalender, Nacht/Schlaf |
| **Heizung & Energie** | global | Heizsaison, Wetter, Frost, Tarife, Zähler, Berichte |
| **Benachrichtigungen** | global | Empfänger, Ereignisse, Ruhezeiten, Test |
| **System & Diagnose** | global | Version, Diagnose, Support, Reparaturen, Darstellung, Erweitert |

### 4.2 Raum-Unterseiten

| Unterseite | Inhalt |
|---|---|
| **Übersicht** | Status, Warnungen, Schnellaktionen, letzte Entscheidungen |
| **Regelung** | Wunsch, Absenkung, Komfort, Offset, Nacht, Ventil |
| **Zeitplan** | Zeitfenster, geteilter Zeitplan, Vorheizen |
| **Fenster & Lüften** | Kontakte, Lüftungsassistent, CO₂/PM2,5, Lüftfenster |
| **Präsenz** | Melder, Anwesenheits-Temperatur, Lampen, Eco |
| **Heizquellen** | Thermostate/Klimaanlagen, Offsets, Boost-Ziel |
| **Geräte & Sensoren** | Fühler, CO₂/PM2,5, Übertragung, Batterie, Technik |
| **Meldungen** | Push-Hinweise, Empfänger, Lichtsignal |
| **Schimmel** | Schimmelschutz, Wand, Feuchte |
| **Lernen & Verlauf** | Aufheizrate, Entscheidungen, Verlauf |

### 4.3 Mapping heute → neu

| Heute | Neu |
|---|---|
| Allgemein → Erste Schritte | Wohnungen → Erste Schritte |
| Allgemein → Gesundheit der Heizung | System & Diagnose → Gesundheit |
| Allgemein → Wohnung | Wohnungen |
| Allgemein → Anwesenheit/Nacht/Homeoffice/Kalender | Personen & Anwesenheit |
| Allgemein → Heizsaison/Wetter | Heizung & Energie |
| Allgemein → Benachrichtigungen | Benachrichtigungen |
| Allgemein → Berichte | Heizung & Energie → Berichte |
| Allgemein → Lernen | Räume → Raum → Lernen; globale Zusammenfassung unter Wohnungen |
| Allgemein → Darstellung/Erweitert | System & Diagnose |
| Allgemein → Alle Räume auf einen Blick | Räume → Übersicht |
| Raum-Tab → Raum/Heizung/Lüften/… | Raum → Übersicht/Regelung/Zeitplan/Fenster/Präsenz/Quellen/Geräte/Meldungen/Schimmel/Lernen |

## 5. Branch- und Release-Prozess

### 5.1 Branches

| Branch | Zweck | Version |
|---|---|---|
| `main` | Produktivlinie 0.62.x; nur Fixes | `0.62.x` |
| `next` | Einstellungen 2.0 / 1.0 | `1.0.0b1`, `1.0.0b2`, … |
| `maintenance/0.62` | Optional nach dem Merge für eine Übergangszeit | `0.62.x` |

### 5.2 Fixes aus 0.62.x

1. Fix zuerst auf `main` committen und als `v0.62.x` veröffentlichen.
2. Sofort per `git cherry-pick` nach `next` übernehmen.
3. Bei Konflikten (besonders in Dateien, die gerade umgebaut werden) manuell
   portieren und im Commit vermerken: `Port: next`.
4. CI läuft auf beiden Branches; beide müssen grün sein.
5. Fixes klein halten und möglichst nicht gleichzeitig große Umbauten in
   derselben Datei durchführen.

### 5.3 Beta-Betrieb

- 1.0-Betas werden **nicht** als GitHub-Release veröffentlicht, solange die
  Linie getrennt läuft. HACS würde sonst allen Beta-Nutzern 1.0 anbieten.
- Tester installieren `next` manuell auf einer separaten Test-HA.
- Die Produktions-HA bleibt auf der stabilen 0.62.x-Linie.
- Erst kurz vor dem Merge entsteht ein Release Candidate; danach `1.0.0`.

### 5.4 Merge-Kriterien

- Einstellungen 2.0 vollständig: alle Einstellungen erreichbar, keine
  Duplikate, Suche und Deep-Links funktionieren.
- Vererbung und „Zurücksetzen“ getestet, inklusive `false`, `0`, Arrays und
  Objekten.
- Testmatrix bestanden (siehe Abschnitt 8).
- Keine offenen Fehler der Schwere hoch/kritisch.
- Mindestens zwei Wochen Beta ohne kritische Rückmeldungen.
- Upgrade von 0.62.x auf 1.0.0b1 getestet: Konfiguration, Entitäten und
  Dashboards bleiben erhalten.
- Danach: `next` → `main`, Release `1.0.0`, `maintenance/0.62` für eine
  Übergangszeit.

## 6. Phasen

### Phase 0 – Inventar & Landkarte (ca. 1 Tag)

- Alle Einstellungszeilen aus `settings/general.js` und `settings/room.js`
  erfassen.
- Mapping-Tabelle „heute → neu“ anlegen; Duplikate und Waisen markieren.
- Vererbungsregeln und Texte festlegen.
- Beta-/Rollback-Strategie und Branch `next` anlegen.

**Abnahme:** Jede Zeile hat genau einen Zielort; keine offenen Fragen zur
Zuordnung. Ergebnis: [`einstellungen-2-landkarte.md`](einstellungen-2-landkarte.md).

### Phase 1 – Navigationsgerüst (ca. 2–3 Tage)

- `settings/const.js`: `SETTINGS_SECTIONS` mit Label, Icon und Scope.
- `settings.js`: Bereichsnavigation, Raumliste und Breadcrumb; bestehende
  `_general()`-/`_room()`-Inhalte zunächst unverändert einhängen.
- State: `_section`, `_roomId`, `_roomTab`; alte `_tab`-Werte migrieren.
- Mobil: Bereiche als Dropdown oder scrollbare Leiste, keine überquellenden
  Tabs.
- Flag `settings_nav_v2`; alte Darstellung bleibt erreichbar.

**Abnahme:** Alle alten Einstellungen in höchstens zwei Klicks erreichbar;
keine Datenänderung; alter Zustand per Flag wiederherstellbar.

### Phase 2 – „Allgemein“ aufteilen (ca. 2–3 Tage)

- `general.js` in Module aufteilen: `home.js`, `presence.js`, `heating.js`,
  `energy.js`, `notify.js`, `reports.js`, `system.js`.
- „Darstellung“ und „Erweitert“ nach **System & Diagnose** verschieben.
- Leere Platzhalter für **Energie & Tarife** und **Wetter** anlegen.

**Abnahme:** Jede Gruppe erscheint genau einmal; Suche findet sie; Deep-Link
springt richtig.

### Phase 3 – Raum-Unterseiten (ca. 5–7 Tage)

- `room.js` aufteilen in `room/overview.js`, `room/control.js`,
  `room/windows.js`, `room/presence.js`, `room/sources.js`, `room/mold.js`;
  `schedule.js` und `learn.js` einhängen.
- Raumliste mit Status, Warnungen und Override-Kennzeichen.
- Unterseiten-Leiste; auf Mobil horizontal scrollbar.

**Abnahme:** Alle Raum-Einstellungen erreichbar; keine Duplikate;
ungespeicherte Werte überleben den Tab-Wechsel.

**Umgesetzt (Stand Phase 3):**

- Unterseiten-Leiste im Raum mit `data-roomtab`; Auswahl in `_roomTab`,
  Raumwechsel beginnt auf **Übersicht**.
- Die gewachsenen Gruppen bleiben im DOM und tragen `data-room`; `_filter()`
  blendet nur die aktive Unterseite ein. Das hält Suche, gespeicherte
  Aufklapp-Zustände und bestehende Tests stabil. `room/overview.js` liefert
  die neue Zusammenfassung (Status, Ist/Soll, Zeitfenster, Quellen, Fenster,
  Overrides, Schnellzugriff).
- Raumliste zeigt Statuszeile, Warnungen und die Anzahl vom Standard
  abweichender Einstellungen.
- Ungespeicherte Werte (`_local`) bleiben beim Unterseitenwechsel erhalten.

### Phase 4 – Vererbung & Overrides (ca. 3–5 Tage)

- Backend: effektive Werte und Quelle je Einstellung bereitstellen;
  möglichst ohne Schemawechsel.
- UI: Badge „Standard / Wohnung / Raum / Gerät“, „Zurücksetzen“,
  „Für alle Räume übernehmen“ nur bei sicheren Werten mit Bestätigung.
- Audit-Eintrag bei Overrides.

**Abnahme:** Kein Wert ändert sich unbemerkt; Reset funktioniert;
Testmatrix für `false`, `0`, Arrays und Objekte bestanden.

**Umgesetzt (Stand Phase 4):**

- `settings_summary()` liefert zusätzlich `sources` je Einstellung: `default`
  (noch kein Raum-Override), `room` (Wert steht im Raum-Eintrag) oder
  `device` (am Thermostat/Fühler, nicht konfigurierbar). `home` ist für
  spätere Wohnungs-Defaults reserviert, solange es dort keine Werte gibt.
- Die Karte zeigt an den wichtigsten Zeilen ein Herkunfts-Badge
  („Standard“, „Raum“, „Gerät“); das hilft, doppelte Pflege zu erkennen.
- „Für alle Räume übernehmen“ kopiert nur eine sichere Auswahlliste
  (Temperaturen, Fensterzeiten, Vorheizen, Schimmel, Präsenz, Technik) und
  fragt vorher nach. Entitäten, Raumzuordnung und Zeitpläne bleiben außen vor.
- „Auf Standard zurücksetzen“ deckt jetzt alle Raum-Einstellungen ab, auch die
  außerhalb von `DEFAULTS` (z. B. `mold_cap`, `wall`, `co2_limit`, `notify_cap`,
  `trv_interval`). Struktur wie Name, Thermostat, Sensoren und Fensterkontakte
  bleibt unberührt; jede Übernahme landet im Einstellungs-Log (`apply_live_options`).

### Phase 5 – Suche, Deep-Links, Onboarding (ca. 3–4 Tage)

- Globale Suche über Bereiche und Räume; Treffer springen in den Kontext.
- Deep-Links aus „Warum?“, Meldungen und Issues auf die richtige Zeile.
- Einrichtungs-Checkliste als Startseite; „nächste Schritte“.
- Fokus, Tastatur, ARIA, Kontrast.

**Abnahme:** Jede Meldung führt zum passenden Ort; Suche findet auch
versteckte Werte.

**Umgesetzt (Stand Phase 5):**

- Die Suche ist global: Sie durchsucht alle Bereichsgruppen und den aktuellen
  Raum, auch Werte in zugeklappten „Weitere Einstellungen“. Raum-Begriffe wie
  „Wunschtemperatur“ oder „Zeitplan“ finden alle Räume und springen direkt in
  die passende Unterseite. Treffer bleiben beim Tippen im Eingabefeld, weil nur
  der Inhaltsbereich neu gezeichnet wird.
- Deep-Links: Checklistenpunkte, „Warum?“ und Raum-Meldungen springen in den
  passenden Bereich bzw. die passende Raum-Unterseite (`data-goto`,
  `data-goto-room`). Meldungen sind per Tastatur (Enter/Space) erreichbar.
- Die Checkliste „Erste Schritte“ ist Startseite der neuen Navigation und
  verlinkt jeden offenen Punkt direkt an die richtige Stelle.
- Fokus-Ringe für Buttons, Eingaben und Meldungen; `aria-label` an der Suche.

### Phase 6 – Neue Funktionen andocken (je Feature)

Reihenfolge nach Nutzen:

1. Raum-Vorlagen & „Raum kopieren“
2. Schnell-Override (2 h/4 h/8 h, Party, Pause)
3. Selbsttest & Support-Paket
4. Wärmebilanz/Heizlast (#34)
5. Kühlen/Klima 2.0
6. Energie, Tarife, PV
7. Präsenz 2.0 (#29)
8. MCP/Assist
9. Dashboard 2.0 (1.1), Verschattung (1.2), Fußbodenheizung (1.3) und Lernmodell 2.0 (1.4) – eigene Phasen auf `next`.

Jedes Feature bekommt: eigenen Beta-Eintrag, Platz im neuen Gerüst, Tests
und Dokumentation.

**Umgesetzt (Stand 6.1–6.8):** „Raum kopieren“ und benannte Raum-Vorlagen sind
ebenso fertig wie Schnell-Override, Selbsttest, Wärmebilanz, Kühlen, Energie,
Präsenz 2.0 und Assist/Boost. Die Funktionen sitzen im neuen Gerüst und sind
durch Backend- und Frontend-Tests abgedeckt.

**Schnell-Override (6.2):** In der Raum-Übersicht gibt es 2/4/8 Stunden, Party
und Pause. Die Knöpfe nutzen den bestehenden Boost (`raumklima/boost`); „Pause“
beendet ihn. Eine laufende Zeitbegrenzung wird angezeigt.

**Selbsttest & Support-Paket (6.3):** Der Selbsttest prüft Wohnung, Räume,
Thermostate, Temperaturfühler, erreichbare Entitäten und Zeitfenster – rein lesend.
Ergebnis erscheint als Dialog. Das Support-Paket bleibt der bestehende Diagnose-
Export (`raumklima/diagnostics`) mit allen Werten, Entitäten und Log-Zeilen.

**Wärmebilanz (6.4):** Die Raum-Übersicht zeigt Ist/Soll, Ventilstellung,
Aufheizrate, prognostizierte Aufheizzeit für +2 K und Außentemperatur. Das ist eine
read-only Einordnung, keine neue Regel und keine Heizlastberechnung.

**Assist/Boost (6.8):** Das Sprachwerkzeug `raumklima_boost_room` setzt einen Boost
für 5–480 Minuten; `0` beendet ihn. Überwachungsräume werden abgelehnt.

**Kühlen/Klima 2.0 (6.5):** Ist eine AC-Quelle in den Heizquellen konfiguriert, kann
der Raum optional kühlen: oberhalb der Kühlgrenze schaltet Raumklima die
Heizthermostate aus und die Klimaanlage in den Kühlmodus. Die Funktion ist pro Raum
abschaltbar; ohne AC-Quelle passiert nichts.

**Energie, Tarife, PV (6.6):** Zähler, Tarif, PV-Ertrag, Grundpreis und Arbeitspreis
lassen sich wählen. Die Energiequelle bestimmt die Umrechnung: Gas in m³ wird über
Brennwert/Zustandszahl zu kWh, Wärmepumpen nutzen den Stromzähler und optional einen
Wärmezähler samt JAZ, Fernwärme zählt kWh. Tarif-Sensoren werden aus ct/kWh, €/kWh
oder €/m³ normalisiert. PV-Eigenverbrauch ist optional und greift nur bei einem
Gesamtverbrauchszähler. Die Euro-Schätzung im PDF-Bericht nutzt den Zähler; eine
gesetzte Jahresabrechnung hat Vorrang und bleibt der einfache Weg für Mietwohnungen.
Eine eigene Energieseite mit Diagrammen kommt später.

**Präsenz 2.0 (6.7):** Die Raum-Übersicht zeigt jetzt den Präsenzstatus
(belegt / leer / leer – abgesenkt / unbekannt) mit Herkunft aus Meldern und Lampen.
Die Kopfzeile zeigt zusätzlich jede Person einzeln mit ihrem Ort: Zuhause, Zonenname
oder „unterwegs“. Die vorhandene Anwesenheits-Temperatur und das leere-Raum-Absenken
bleiben unverändert; die Übersicht macht den Zustand nur sichtbar.

### Phase 7 – Test, Doku, Release (ca. 2–3 Tage)

- Testmatrix aus Abschnitt 8.
- Frontend-Tests für Navigation/Rendering; Backend-Tests für Vererbung; Build.
  Ruff ist in der Test-CT derzeit nicht installiert und läuft daher nicht.
- Handbuch und Screenshots (DE/EN/FR), CHANGELOG, ROADMAP.
- Release: `1.0.0b1` bündelt Gerüst und Phase 6; danach RC und `1.0.0`.

## 7. Grober Aufwand

| Phase | Aufwand |
|---|---|
| 0 – Inventar | ca. 1 Tag |
| 1 – Navigationsgerüst | ca. 2–3 Tage |
| 2 – Bereiche aufteilen | ca. 2–3 Tage |
| 3 – Raum-Unterseiten | ca. 5–7 Tage |
| 4 – Vererbung | ca. 3–5 Tage |
| 5 – Suche/Deep-Links | ca. 3–4 Tage |
| 7 – Test/Doku/Release | ca. 2–3 Tage |
| **Summe Gerüst** | **ca. 18–26 Personentage** |

Neue Funktionen aus Phase 6 kommen separat dazu.

## 8. Testmatrix

- Desktop und Mobil, helle und dunkle Darstellung.
- Admin und Nicht-Admin.
- 1 Wohnung, 3 Wohnungen; 0, 5 und 20 Räume.
- Bestehende Konfiguration aus 0.62.x auf 1.0.0b1 aktualisieren.
- Sicherung einspielen und Wiederherstellen.
- Entitäten, Dashboards und Automationen bleiben erhalten.
- DE/EN/FR; Datums-, Zeit- und Zahlenformate.
- Mindest-Home-Assistant-Version und aktuelle Version.
- Backend-Tests, Frontend-Tests, Ruff und Build.
- Diagnose und Support-Paket ohne persönliche Daten.

## 9. Risiken

| Risiko | Gegenmaßnahme |
|---|---|
| Scope Creep | Phase 1–4 strikt ohne neue Features |
| UI-Regression | Alter Renderer bleibt per Flag; Tests und Beta |
| Datenverlust | Schreibpfade unverändert, keine Schema-Migration, Sicherung |
| Vererbung unklar | Badges, Reset, Dokumentation, Bestätigung bei „für alle“ |
| Mobile unbedienbar | Bereichs-Dropdown, keine übervollen Tabs |
| i18n vergessen | Neue Strings sofort DE/EN/FR |
| Divergenz der Linien | Fixes sofort per Cherry-Pick; CI auf beiden Branches |
| Konflikte beim Portieren | Fixes klein halten; Umbau-Dateien koordinieren |

## 10. Nächster Schritt

Phase 7 abschließen: Testmatrix auf HA 2026.11.1 fahren, Handbuch und CHANGELOG
fertigstellen, dann Release Candidate und `1.0.0`. Die Beta `1.0.0b1` enthält
bereits das Gerüst und alle Phase-6-Funktionen.

Danach, außerhalb des 1.0.0-Freeze:

1. ~~Dashboard 2.0 (1.1)~~ – umgesetzt: „Räume“, Energie- und Lernkarte,
   `raumklima/energy`, Lernwerte in `settings_summary()`.
2. ~~Verschattung (1.2)~~ – umgesetzt: Auswahl je Raum, Empfehlung/Automatik,
   Fassadenprognose, Nacht und Handbedienung.
3. ~~Fußbodenheizung (1.3)~~ – umgesetzt: Regelband, Vorlauf/Rücklauf, Takt und
   Vorlauf vor Zeitfenstern.
4. ~~Lernmodell 2.0 (1.4)~~ – umgesetzt: Aufheizrate, Abkühlrate, solarer Zugewinn und
   früherer Abstopp vor dem Ziel.
5. ~~Stufenlose Ventilsteuerung (1.5)~~ – umgesetzt: `number`-Stellglied, automatische
   Erkennung, berechnete Öffnung.
6. ~~Klimaanlagen (1.6)~~ – umgesetzt: getrennte Ziele, Mindestlaufzeit/-pause gegen Takten.
7. ~~Wärmeanforderung an den Erzeuger (1.7)~~ – umgesetzt: Summe, Vorlauf-Empfehlung,
   Sensor `warmeanforderung`.
8. ~~Dynamische Tarife und PV-Überschuss (1.8)~~ – umgesetzt: Preisgrenze,
   günstig vorheizen, PV-Überschuss.
9. ~~Auswertung mit Vorhersage (1.9)~~ – umgesetzt: erwartete Temperatur und
   Abweichung im Verlauf/CSV.
