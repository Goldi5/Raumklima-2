# Roadmap

Geplante Ideen für Raumklima – Reihenfolge = Priorität. Wünsche und Rückmeldungen gern als
[Issue](https://github.com/Goldi5/Raumklima-2/issues). 🇬🇧 Summary at the end.

Stand: Version 0.15.0 (Early Release – Tester gesucht)

## 🧪 Tester-Phase (als Nächstes)

- [ ] **Knopf „Fehler melden“ in der Karte** – öffnet ein vorausgefülltes GitHub-Issue mit Raumklima-Version,
      Home-Assistant-Version und Thermostat-Modell (ohne persönliche Daten).
- [ ] **Issue-Vorlagen auf GitHub** – „Fehler“, „Idee“, „Mein Thermostat funktioniert / funktioniert nicht“;
      daraus eine Liste geprüfter Thermostate in der Doku.
- [ ] **Englische Push-Nachrichten und Protokoll** – Dashboard und PDF-Berichte sind schon englisch,
      die Meldungen der Integration noch deutsch.
- [ ] **Einrichtungs-Checkliste als Karte** – Bewohner, Zone, Empfänger, Wetterquelle … werden automatisch
      abgehakt, sobald erledigt.
- [ ] **Meldungen in den HA-Reparaturen** – „Batterie schwach“, „Fühler hängt“ usw. zusätzlich unter
      *Einstellungen → Reparaturen*.

## 🔥 Neue Funktionen

- [ ] **Boost / Übersteuern mit Dauer** – z. B. „Bad 30 min wärmer“ vor dem Duschen oder „bis morgen früh 19 °C“,
      danach automatisch zurück; als Knopf in der Raumkarte und als Preset der Raum-Entität.
- [ ] **Zeitpläne pro Raum (optional)** – über die Zeitplan-Helfer von Home Assistant (`schedule.*`), z. B.
      „Arbeitszimmer werktags 8–17 Uhr warm“; mehrere Pläne pro Raum, umschaltbar (z. B. Normal / Homeoffice /
      Ferien). Anwesenheit, Fenster und Schimmelschutz bleiben vorrangig.
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
      (Ausbau der schon gelernten Aufheizzeit) und plant voraus: rechtzeitig vorheizen, früher aufhören,
      weniger Überschwingen. Bis genug gelernt ist, regelt Raumklima wie bisher.
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

Mehrere Heizkörper pro Raum · Lichtsignal pro Raum · Lüft-Countdown auf dem Sperrbildschirm · „Fenster offen seit …“ · Präsenzmelder
(mmWave/PIR) · PDF-Heizbericht (Woche, Monat, Saison) mit Note, Euro-Schätzung, Wärmebild und Spartipps ·
E-Mail-Versand direkt in Raumklima · „?“-Erklärungen in den Einstellungen · Handbuch als PDF (DE/EN).
Details im [CHANGELOG](CHANGELOG.md).

---

### 🇬🇧 Summary

**Next (tester phase):** “report a bug” button with prefilled GitHub issue · issue templates and a list of
tested thermostats · English push messages and log · setup checklist card · health problems in HA Repairs.
**Features:** boost / override with duration · optional schedules per room via HA `schedule.*` helpers (several,
switchable) · voice control (Assist) · storm/rain warning · learn room usage from presence sensors and preheat ·
sleep times from bedroom presence sensor · monitor-only rooms · direct valve control (e.g. SONOFF TRVZB) ·
room entity assigned to its area for Assist.
**Bigger projects:** self-learning thermal model per room with predictive control · proportional valve control ·
heat pumps and ACs (cooling, separate targets, short-cycle protection, choose the cheaper heat source) ·
blinds/shading · analytics with model prediction.
**Maintenance:** backup/restore settings · demo mode · Dependabot and test coverage.
**Later:** HACS default list · own iPhone app.
