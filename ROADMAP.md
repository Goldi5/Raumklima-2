# Roadmap

Geplante Ideen für Raumklima – Reihenfolge = Priorität. Wünsche und Rückmeldungen gern als
[Issue](https://github.com/Goldi5/Raumklima-2/issues). 🇬🇧 Summary at the end.

Stand: Version 0.34.0 (Early Release – Tester gesucht)

## 🧪 Tester-Phase (als Nächstes)

- [ ] **Knopf „Fehler melden“ in der Karte** – öffnet ein vorausgefülltes GitHub-Issue mit Raumklima-Version,
      Home-Assistant-Version und Thermostat-Modell (ohne persönliche Daten).
- [ ] **Issue-Vorlagen auf GitHub** – „Fehler“, „Idee“, „Mein Thermostat funktioniert / funktioniert nicht“;
      daraus eine Liste geprüfter Thermostate in der Doku.
- [ ] **Einrichtungs-Checkliste als Karte** – Bewohner, Zone, Empfänger, Wetterquelle … werden automatisch
      abgehakt, sobald erledigt.
- [ ] **Meldungen in den HA-Reparaturen** – „Batterie schwach“, „Fühler hängt“ usw. zusätzlich unter
      *Einstellungen → Reparaturen*.

## 🔥 Neue Funktionen

- [x] **Boost mit Dauer** (0.19.0) – „Bad 30 min wärmer“: Knopf „Wärmer“ in der Raumkarte und
      `button.<raum>_wärmer_boost`; Zusatz und Dauer sind je Raum einstellbar, danach gilt wieder Zeitplan
      bzw. Automatik. Der Boost schlägt auch die Abwesenheits-Absenkung (bewusste Aktion), nicht aber Frost
      oder Heizpause.
- [x] **Zeitpläne pro Raum** (0.19.0) – eigene Zeitfenster je Raum (bis zu 6) mit Wochentagen, Von/Bis und
      Zieltemperatur, auch über Mitternacht. *Bewusst ohne die HA-`schedule.*`-Helfer* – die Einstellungsseite
      bringt den Editor mit. Anwesenheit, Fenster, Frost, Schimmelschutz und Heizsaison bleiben vorrangig.
- [x] **Sonne nach Fassade** (0.22.0) – Fassade je Raum (N/NO/O/…/NW); mit Sonnenstand (Azimut und
      Höhenwinkel) zählt nur Sonne, die wirklich auf diese Wand scheint. Ein Westzimmer reagiert erst
      nachmittags, ein Ostzimmer nur morgens (Issue #5).
- [x] **Schichtdienst** (0.21.0) – Bett-/Aufstehzeiten werden je Wochentag gelernt; Option
      „Schichtdienst“ erkennt zusätzlich Tagschlaf (ins Bett bis 09:00, aufstehen bis 17:00). Option
      „Ruhezeit senkt ab“ bringt Schlafzimmer und selten genutzte Räume während der Ruhezeit auf die
      Absenkung, auch wenn jemand zu Hause ist. Zeitplan und Regler am Thermostat bleiben vorrangig.
- [x] **Vorheizen auf ein Zeitfenster** (0.20.0) – der Raum rechnet aus seiner gelernten Aufheizzeit
      (°C/h), wann er loslegen muss, um zum Beginn des nächsten Zeitfensters warm zu sein (10 min Puffer);
      ohne gelernte Zeit passiert nichts, bei Abwesenheit gewinnt die Absenkung.
- [ ] **Zeitpläne zwischen Räumen teilen** – ein Zeitfenster einmal anlegen und mehreren Räumen zuweisen
      (z. B. Wohnzimmer + Esszimmer abends gleich), statt es je Raum zu wiederholen.
- [ ] **Sprachsteuerung (Assist)** – „Wie warm ist es im Bad?“, „Mach das Wohnzimmer wärmer“, „Muss ich lüften?“
- [ ] **Sturm- und Regenwarnung** – Unwetter vorhergesagt und Fenster offen → Nachricht.
- [ ] **Nutzung lernen und vorheizen** – aus den Präsenzmeldern („Arbeitszimmer ab 8 Uhr belegt“).
- [ ] **Schlafzeiten aus dem Präsenzmelder im Schlafzimmer** – zusätzlich zu Licht und Nachtlüften.
- [ ] **Raum nur überwachen** – z. B. Keller, Balkon oder ein Raum ohne Thermostat: Temperatur, Feuchte,
      Lüft-Hinweise und Schimmelschutz, aber keine Regelung.
- [ ] **Direkte Ventilsteuerung** – für Thermostate, deren Ventilöffnung als Zahl einstellbar ist
      (z. B. SONOFF TRVZB): gleichmäßige Öffnung statt Auf/Zu – leiser, weniger Ventilbewegungen.
- [ ] **Sprachsteuerung über die Raum-Entität verbessern** – Raum-Entität dem Bereich zuordnen, damit Assist
      „Wohnzimmer auf 22 Grad“ eindeutig findet (Hinweis: Thermostate selbst für Assist ausblenden).

## 🧠 Größere Vorhaben

- [ ] **Lernendes Wärmemodell pro Raum** – lernt Wärmeverlust, Heizleistung und Sonneneinfluss jedes Raums
      (Ausbau der schon gelernten Aufheizzeit) und plant voraus: früher aufhören, weniger Überschwingen.
      Das rechtzeitige Vorheizen vor einem Zeitfenster ist bereits umgesetzt (0.20.0). Bis genug gelernt ist,
      regelt Raumklima wie bisher.
- [ ] **Stufenlose Ventilsteuerung** – statt „heizen/nicht heizen“ einen berechneten Sollwert bzw. eine
      Ventilöffnung nach Bedarf – gleichmäßigere Temperatur.
- [ ] **Wärmepumpen und Klimaanlagen** – auch kühlen, getrennte Ziele für Heizen/Kühlen, Schutz gegen
      häufiges Takten; in Räumen mit Heizkörper *und* Klimagerät die günstigere Wärmequelle wählen.
- [ ] **Rollläden und Verschattung** – bei viel vorhergesagter Sonne beschatten, nachts schließen
      (hält Wärme drin), manuelles Verstellen erkennen.
- [ ] **Auswertung mit Vorhersage** – im Verlauf zusätzlich, was das Wärmemodell erwartet hatte
      (hilft, Probleme wie offene Fenster oder zu schwache Heizkörper zu erkennen).

## 🛠️ Pflege

- [ ] **Einstellungen sichern und wiederherstellen** – als Datei, z. B. bei Umzug oder Neuinstallation.
- [ ] **Demo-Modus** – simulierte Räume zum Ausprobieren ohne Hardware, für Screenshots ohne persönliche Daten
      und englische Bilder.
- [ ] **Automatische Updates der Abhängigkeiten** (Dependabot) und Testabdeckung in der CI.

## 🕓 Später

- [ ] Aufnahme in die HACS-Standardliste (nach der Tester-Phase).
- [ ] Eigene iPhone-App – erst, wenn es viele Nutzer gibt; bis dahin Home-Assistant-App mit
      Live-Aktivität und Push.

## ✅ Erledigt (Auszug)

Push-Nachrichten, Protokoll und Hinweise auf Deutsch, Englisch und Französisch · Französisch für Dashboard, Dialoge und PDF-Berichte · Mehrere Heizkörper pro Raum · Lichtsignal pro Raum · Lüft-Countdown auf dem Sperrbildschirm · „Fenster offen seit …“ · Präsenzmelder
(mmWave/PIR) · PDF-Heizbericht (Woche, Monat, Saison) mit Note, Euro-Schätzung, Wärmebild und Spartipps ·
E-Mail-Versand direkt in Raumklima · „?“-Erklärungen in den Einstellungen · Handbuch als PDF (DE/EN).
Details im [CHANGELOG](CHANGELOG.md).

---

### 🇬🇧 Summary

**Next (tester phase):** “report a bug” button with prefilled GitHub issue · issue templates and a list of
tested thermostats · setup checklist card · health problems in HA Repairs.
**Features:** boost / override with duration · optional schedules per room via HA `schedule.*` helpers (several,
switchable) · voice control (Assist) · storm/rain warning · learn room usage from presence sensors and preheat ·
sleep times from bedroom presence sensor · monitor-only rooms · direct valve control (e.g. SONOFF TRVZB) ·
room entity assigned to its area for Assist.
**Bigger projects:** self-learning thermal model per room with predictive control · proportional valve control ·
heat pumps and ACs (cooling, separate targets, short-cycle protection, choose the cheaper heat source) ·
blinds/shading · analytics with model prediction.
**Maintenance:** backup/restore settings · demo mode · Dependabot and test coverage.
**Later:** HACS default list · own iPhone app.
