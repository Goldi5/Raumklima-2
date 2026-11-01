# Roadmap

Geplante Ideen für Raumklima – Reihenfolge = Priorität. Wünsche und Rückmeldungen gern als
[Issue](https://github.com/Goldi5/Raumklima-2/issues). 🇬🇧 Summary at the end.

Stand: Version 0.14.7 (Early Release – Tester gesucht)

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

- [ ] **Boost-Taste** – z. B. „Bad 30 min wärmer“ vor dem Duschen, danach automatisch zurück.
- [ ] **Wochenplan pro Raum (optional)** – z. B. „Arbeitszimmer werktags 8–17 Uhr warm“.
- [ ] **Sprachsteuerung (Assist)** – „Wie warm ist es im Bad?“, „Mach das Wohnzimmer wärmer“, „Muss ich lüften?“
- [ ] **Sturm- und Regenwarnung** – Unwetter vorhergesagt und Fenster offen → Nachricht.
- [ ] **Nutzung lernen und vorheizen** – aus den Präsenzmeldern („Arbeitszimmer ab 8 Uhr belegt“).
- [ ] **Schlafzeiten aus dem Präsenzmelder im Schlafzimmer** – zusätzlich zu Licht und Nachtlüften.

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

Lichtsignal pro Raum · Lüft-Countdown auf dem Sperrbildschirm · „Fenster offen seit …“ · Präsenzmelder
(mmWave/PIR) · PDF-Heizbericht (Woche, Monat, Saison) mit Note, Euro-Schätzung, Wärmebild und Spartipps ·
E-Mail-Versand direkt in Raumklima · „?“-Erklärungen in den Einstellungen · Handbuch als PDF (DE/EN).
Details im [CHANGELOG](CHANGELOG.md).

---

### 🇬🇧 Summary

**Next (tester phase):** “report a bug” button with prefilled GitHub issue · issue templates and a list of
tested thermostats · English push messages and log · setup checklist card · health problems in HA Repairs.
**Features:** boost button · optional weekly schedule per room · voice control (Assist) · storm/rain warning ·
learn room usage from presence sensors and preheat · sleep times from bedroom presence sensor.
**Maintenance:** backup/restore settings · demo mode · Dependabot and test coverage.
**Later:** HACS default list · own iPhone app.
