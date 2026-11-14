# Einstellungen 2.0 – Umsetzungsplan

**Stand:** 2026-11-13  
**Basis:** 0.62.x (aktuell 0.62.49b1)
**Zielversion:** 1.0.0  
**Entwicklungslinie:** `1.0.0b1` auf dem Branch `next`

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
Zuordnung.

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

### Phase 4 – Vererbung & Overrides (ca. 3–5 Tage)

- Backend: effektive Werte und Quelle je Einstellung bereitstellen;
  möglichst ohne Schemawechsel.
- UI: Badge „Standard / Wohnung / Raum / Gerät“, „Zurücksetzen“,
  „Für alle Räume übernehmen“ nur bei sicheren Werten mit Bestätigung.
- Audit-Eintrag bei Overrides.

**Abnahme:** Kein Wert ändert sich unbemerkt; Reset funktioniert;
Testmatrix für `false`, `0`, Arrays und Objekte bestanden.

### Phase 5 – Suche, Deep-Links, Onboarding (ca. 3–4 Tage)

- Globale Suche über Bereiche und Räume; Treffer springen in den Kontext.
- Deep-Links aus „Warum?“, Meldungen und Issues auf die richtige Zeile.
- Einrichtungs-Checkliste als Startseite; „nächste Schritte“.
- Fokus, Tastatur, ARIA, Kontrast.

**Abnahme:** Jede Meldung führt zum passenden Ort; Suche findet auch
versteckte Werte.

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
9. Dashboard 2.0, Verschattung, Fußbodenheizung

Jedes Feature bekommt: eigenen Beta-Eintrag, Platz im neuen Gerüst, Tests
und Dokumentation.

### Phase 7 – Test, Doku, Release (ca. 2–3 Tage)

- Testmatrix aus Abschnitt 8.
- Frontend-Tests für Navigation/Rendering; Backend-Tests für Vererbung;
  Ruff; Build.
- Handbuch und Screenshots (DE/EN/FR), CHANGELOG, ROADMAP.
- Release: `1.0.0b1` Gerüst, `b2` Bereiche, `b3` Raum-Unterseiten,
  `b4` Vererbung, dann RC und `1.0.0`.

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

Phase 0 starten: Inventar und Mapping-Tabelle, ohne die UI zu ändern. Danach
Branch `next` anlegen, das Navigationsgerüst hinter dem Flag bauen und mit
den ersten Testern prüfen.
