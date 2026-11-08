# Roadmap

Geplante Ideen für Raumklima – Reihenfolge = Priorität. Wünsche und Rückmeldungen gern als
[Issue](https://github.com/Goldi5/Raumklima-2/issues). 🇬🇧 Summary at the end.

Stand: Version 0.62.22

## 🧪 Tester-Phase (als Nächstes)

- [x] **Knopf „Fehler melden“** (0.52.0) – öffnet ein vorausgefülltes GitHub-Issue mit Raumklima-Version,
      Home-Assistant-Version und Thermostat-Modell (ohne Raumnamen, Entitäten oder Zugangsdaten).
- [x] **Issue-Vorlagen auf GitHub** (0.52.0) – „Fehler“, „Idee“, „Mein Thermostat läuft / läuft nicht“;
      dazu die Liste geprüfter Geräte in der Doku (Geräte & Thermostate).
- [x] **Einrichtungs-Checkliste** (0.56.0) – in den Einstellungen unter „Erste Schritte“: Bewohner, Empfänger,
      Wetterquelle, Raum mit Thermostat, Fensterkontakt und Zeitplan werden abgehakt, sobald erledigt; je Punkt
      steht dabei, wo man ihn einträgt.
- [x] **Meldungen in den HA-Reparaturen** (0.52.0) – schwache Batterie, nicht erreichbarer Fühler,
      nicht erreichbares Thermostat erscheinen unter *Einstellungen → Reparaturen* und verschwinden mit
      der Ursache.

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
- [x] **Zeitpläne zwischen Räumen teilen** (0.55.0) – ein Raum kann den Zeitplan eines anderen übernehmen
      (Zeitplan von). Gepflegt wird er an einer Stelle, Änderungen gelten überall mit; nur eine Ebene,
      damit keine Ketten entstehen.
- [ ] **Sprachsteuerung (Assist)** – „Wie warm ist es im Bad?“, „Mach das Wohnzimmer wärmer“, „Muss ich lüften?“
- [x] **Sturm- und Regenwarnung** (0.54.0) – Böen und Regen aus der Wettervorhersage; steht ein Fenster
      offen, kommt einmal pro Ereignis eine Warnung (auch in der Ruhezeit). Schwellen einstellbar.
- [x] **Nutzung lernen** (0.55.0) – Räume mit Präsenzmelder zählen je Wochentag und Viertelstunde, wann
      sie belegt sind; im Reiter Lernen steht der Vorschlag (Mo–Fr 08:00–11:30). Angewendet wird nichts
      automatisch – ein Zeitfenster legst du selbst an.
- [x] **Schlafzeiten aus dem Präsenzmelder im Schlafzimmer** (0.54.0) – ist ein Raum vom Typ Schlafzimmer
      20 Minuten belegt (mit eigenem Melder), gilt die Bettzeit als erkannt – zusätzlich zu Licht und
      Nachtlüften.
- [ ] **Direkte Ventilsteuerung** – für Thermostate, deren Ventilöffnung als Zahl einstellbar ist
      (z. B. SONOFF TRVZB): gleichmäßige Öffnung statt Auf/Zu – leiser, weniger Ventilbewegungen.
- [x] **Sprachsteuerung über die Raum-Entität** (0.53.0) – die Raum-Entität (und alle Sensoren/Schalter des
      Raums) wird beim Start dem Home-Assistant-Bereich zugeordnet, damit Assist „Wohnzimmer auf 22 Grad“
      eindeutig findet. Eine selbst gesetzte Zuordnung bleibt unangetastet; Thermostate kann man für Assist
      zusätzlich ausblenden, wenn sie doppelt antworten.

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
- [ ] **Wärmeanforderung an den Erzeuger** – Summe über alle Räume, daraus eine gewünschte
      Vorlauftemperatur bzw. ein Signal „es wird Wärme gebraucht“ (passt zum Hinweis „Heizkörper kommt
      kaum hinterher“). Zusammen mit Wärmepumpe/Klima planen, nicht vorher.
- [ ] **Energie und Kosten aus Zählern** – Gas-/Wärmemengenzähler und Stromzähler aus Home Assistant statt
      manuell eingetragener Jahreskosten; das PDF rechnet dann mit echten Verbräuchen.
- [ ] **Dynamische Tarife und PV-Überschuss** – Vorheizen, wenn Strom günstig ist oder die Sonne liefert.
- [ ] **Auswertung mit Vorhersage** – im Verlauf zusätzlich, was das Wärmemodell erwartet hatte
      (hilft, Probleme wie offene Fenster oder zu schwache Heizkörper zu erkennen).

## 🛠️ Pflege

- [x] **Einstellungen sichern und wiederherstellen** (0.56.0) – als JSON-Datei ohne Zugangsdaten, Räume werden über den Namen zugeordnet.
- [ ] **Demo-Modus** – simulierte Räume zum Ausprobieren ohne Hardware, für Screenshots ohne persönliche Daten
      und englische Bilder.
- [x] **Automatische Updates der Abhängigkeiten** (Dependabot) und wöchentlicher Test gegen die
      neueste Home-Assistant-Version.
- [ ] **Testabdeckung messen** und in der CI anzeigen.
- [ ] **E-Mail über Home-Assistants SMTP-Integration** statt eigenem Client – dann lägen die
      Mail-Zugangsdaten gar nicht mehr bei Raumklima. Erst sinnvoll, wenn eine Mindestversion
      festgelegt ist, ab der `smtp.send_message` Anhänge kann (2026.11).

## 🕓 Später

- [ ] Aufnahme in die HACS-Standardliste (nach der Tester-Phase).
- [ ] Eigene iPhone-App – erst, wenn es viele Nutzer gibt; bis dahin Home-Assistant-App mit
      Live-Aktivität und Push.

## ✅ Erledigt (Auszug)

Push-Nachrichten, Protokoll und Hinweise auf Deutsch, Englisch und Französisch · Französisch für Dashboard, Dialoge und PDF-Berichte · Mehrere Heizkörper pro Raum · Lichtsignal pro Raum · Lüft-Countdown auf dem Sperrbildschirm · „Fenster offen seit …“ · Präsenzmelder
(mmWave/PIR) · PDF-Heizbericht (Woche, Monat, Saison) mit Note, Euro-Schätzung, Wärmebild und Spartipps ·
E-Mail-Versand direkt in Raumklima · „?“-Erklärungen in den Einstellungen · Handbuch als PDF (DE/EN/FR) · Einstellungen neu aufgebaut (Gruppenleiste mit Farbe, Suche, Raum-Chips, Darstellung mit Reihenfolge/Größe/Farbe, Kalender- und Zeitwähler, Versionsanzeige) · Lernen mit Unterreitern (Aufheizrate, Schlafzeiten, Anwesenheitsprofil, Entscheidungen mit Begründung) · Überwachungsraum mit eigener großer Karte · Feinstaub PM2,5 · Tuya-TRV602Z: Sollwert über `comfort_temperature`, Warnung bei dauerhaft offenem Ventil.
Überwachungsraum ohne Thermostat (messen, anmahnen, berichten) · Fehler-melden-Knopf mit
vorausgefülltem Issue · Issue-Vorlagen · Probleme in den HA-Reparaturen.
Details im [CHANGELOG](CHANGELOG.md).

---

### 🇬🇧 Summary

**Done in the tester phase:** “report a bug” button with a prefilled GitHub issue (version, HA version,
thermostat model – no room names or entities) · issue templates and a list of tested devices · problems
shown in HA Repairs (battery, sensor, thermostat).
**Next:** setup checklist card.
**Features:** share schedules between rooms · voice control (Assist) and room entity assigned to its area ·
storm/rain warning · learn room usage from presence sensors and preheat · sleep times from bedroom presence
sensor · direct/proportional valve control (needs devices that expose it) · monitor-only rooms (done).
**Bigger projects:** self-learning thermal model per room with predictive control · proportional valve control ·
heat pumps and ACs (cooling, separate targets, short-cycle protection, choose the cheaper heat source) ·
blinds/shading · analytics with model prediction.
**Maintenance:** backup/restore settings · demo mode · Dependabot and test coverage.
**Later:** HACS default list · own iPhone app.
**Idea (no guessing):** use window sensors that report more than open/closed – Homematic IP or Bosch
window handles distinguish *closed / tilted / open*. Only then can the report name a tilted window;
a plain reed contact cannot, so Raumklima keeps saying just “open” and never infers a tilt.
