# Changelog

## 0.27.0 – 2026-11-02

### Neu
- **Zeitfenster umsortieren** (Issue #10): Pfeile ▲/▼ an jedem Fenster und ein Knopf **„nach Uhrzeit
  sortieren"**. Die Reihenfolge zählt nur bei überlappenden Fenstern – dann gewinnt das untere; das steht
  jetzt als Hinweis direkt im Editor.

## 0.26.0 – 2026-11-02

### Geändert
- **`climate.<raum>` zeigt das angewendete Ziel** (Issue #12): `temperature` ist jetzt der Wert, auf den
  der Raum gerade regelt — Zeitplan, Boost, Absenkung. Der eingestellte Wunsch steht im neuen Attribut
  `wish` und wird weiterhin mit `climate.set_temperature` gesetzt. Damit sagen Home-Assistant-Kachel und
  Raumklima-Karte dasselbe; die Karte zeigt bei Abweichung „Ziel 19,0° · Wunsch 17,0°".

### Neu
- **„Anwesenheit aus"** (Issue #10): Schalter in *Einstellungen → Allgemein → Anwesenheit & Absenkung*.
  Aus heißt: keine Auswertung von Handys, Zone oder Kalender, keine Absenkung nach Abwesenheit, kein
  Vorheizen, kein Absenken leerer Räume — gedacht für Wohnungen ohne brauchbare Ortung.

## 0.25.1 – 2026-11-02

### Behoben
- **Zeitfelder zeigten AM/PM** (Issue #7): `<input type="time">` wird vom Browser in der Sprache des
  Betriebssystems gezeichnet – die Zeiteinstellung von Home Assistant zählt dabei nicht. Ruhezeit,
  Wochenende, Nachtlüften und die Zeitfenster im Zeitplan sind jetzt eigene HH:MM-Felder; die Eingabe wird
  geprüft und vereinheitlicht („7:5", „0730", „7.05" → „07:05").
- **Fenster-Timer nach Neustart wieder bei null** (Issue #9): Der Öffnungszeitpunkt wurde nur zusammen mit
  anderen Änderungen gespeichert – stand der Raum sonst still, ging er verloren. Beim Öffnen und Schließen
  wird jetzt sofort gesichert.
- **Kachel zeigte bei aktivem Zeitplan den Wunsch statt des Ziels** (Issue #12): Angezeigt wird der Wert,
  auf den der Raum gerade regelt; weicht der Wunsch ab, steht er daneben („Ziel 19,0° · Wunsch 17,0°").
  In Home Assistant bleibt `temperature` weiterhin der Wunsch – dort ist es der Wert, den man einstellt.

## 0.25.0 – 2026-11-02

### Neu
- **Neue Wohnung direkt in der Integration:** *Einstellungen → Geräte & Dienste → Raumklima → Integration
  hinzufügen* fragt jetzt zuerst „Raum in einer bestehenden Wohnung" oder „Neue Wohnung". Bei einer neuen
  Wohnung wird der Raum gleich an sie gehängt (bisher landete jeder neue Raum in der ersten Wohnung).

### Behoben
- **Räume wurden in beiden Wohnungen angezeigt** (Issue #10): Karten ohne `home:` zeigten alle Räume –
  ein selbst gebautes Dashboard wie „Heizung" (Berlin) listete also auch das Sportzimmer aus Remscheid.
  Jetzt richtet sich jede Karte nach dem Dashboard, auf dem sie liegt (Pfad `heizung-<name>` → Wohnung),
  ersatzweise nach `home:` in der Karten-Konfiguration. Betrifft Übersicht, Verlauf, Protokoll, Bericht,
  Einstellungen und die Dashboard-Strategie.

## 0.24.4 – 2026-11-02

### Behoben
- **Wohnungs-Umschalter blieb ausgegraut** (Issue #10): Die Karte prüfte vorhandene Dashboards über
  `hass.dashboards` im Browser. Je nach Stand und Benutzer ist diese Liste leer – dann blieb jede andere
  Wohnung gesperrt, obwohl ihr Dashboard existiert. Die Karte fragt die Liste jetzt bei der Zentrale ab
  (neuer Befehl `raumklima/dashboards`), die Einstellungsseite bekommt sie mit der Konfiguration;
  `hass.dashboards` dient nur noch als Ersatz.

## 0.24.3 – 2026-11-02

### Behoben
- **Raum einer Wohnung zuordnen** (Issue #10): Neue Räume landeten immer in der ersten Wohnung – der
  Assistent fragte die Wohnung nie, das Feld `home` blieb leer und der Raum hing an der Standard-Wohnung.
  Bei mehreren Wohnungen kommt jetzt ein Schritt **Wohnung**. Bestehende Räume lassen sich in
  *Einstellungen → Raum → Wohnung* (oder *Konfigurieren* am Raumeintrag) umhängen; der Raum bindet sofort
  an die andere Wohnung um (Bewohner, Zone, Empfänger).

## 0.24.2 – 2026-11-02

### Behoben
- **Dashboard einer Wohnung** (Issue #10): Die Strategie filtert über `home:` – dort steht die **ID der
  Wohnung** (das Attribut `home` der Raum-Entitäten). „Dashboard anlegen“ schreibt genau diesen Wert;
  `home:` akzeptiert zusätzlich den Wohnungsnamen, damit eine handgeschriebene Konfiguration nicht leer
  bleibt.
- **Fehlendes Dashboard ist jetzt sichtbar und nachholbar**: In *Einstellungen → Wohnung → Dashboard* steht
  bei fehlendem Dashboard der Knopf „anlegen“ (legt es mit der Raumklima-Strategie an, gefiltert auf die
  Wohnung). Zusätzlich prüft die Seite das beim Öffnen einmal je Sitzung (nur Admin) und zieht ein
  fehlendes Dashboard nach – das hilft auch, wenn die Wohnung vor 0.24 angelegt wurde.

## 0.24.1 – 2026-11-02

### Neu
- **Sollwert am Thermostat wird angezeigt** (Issue #11): „Heizt“ und „Temperatur erreicht“ kommen vom
  Thermostat selbst (`hvac_action`), nicht aus einem Vergleich Ist/Soll. Weicht der Sollwert **am Gerät**
  von Raumklimas Ziel ab (eigener Zeitplan, Boost oder von Hand gedreht), steht das jetzt dabei:
  „Heizt · Thermostat 24,0°“. Neues Attribut `trv_target` an `climate.<raum>`.

## 0.24.0 – 2026-11-02

### Neu
- **Eine neue Wohnung bekommt ihr Dashboard automatisch**: *Wohnung anlegen* erzeugt jetzt gleich ein
  Dashboard mit dem Pfad `heizung-<name>`, der Raumklima-Strategie und dem Filter auf die neue Wohnung.
  Der Wohnungs-Umschalter funktioniert damit sofort, ohne dass jemand ein Dashboard von Hand anlegen
  muss. Existiert der Pfad schon, bleibt das vorhandene Dashboard unangetastet.
- Die Pfad-Regel steckt jetzt in `hub.dashboard_slug()` (Backend) und wird von `home/create`
  mitgeliefert – Oberfläche und Backend können nicht auseinanderlaufen.

### Hinweise
- Angelegt wird über die Home-Assistant-Schnittstellen `lovelace/dashboards/create` und
  `lovelace/config/save`, also denselben Weg, den die Oberfläche geht. Klappt das nicht (z. B. bei
  YAML-Dashboards), bleibt die Wohnung trotzdem angelegt – dann das Dashboard von Hand erstellen.

## 0.23.8 – 2026-11-02

### Behoben
- **Wohnungs-Umschalter landete auf dem Standard-Dashboard**: Der Umschalter hat auf `/<dashboard>` der
  Zielwohnung verlinkt, ohne zu prüfen, ob dieses Dashboard überhaupt existiert. Bei einer neu angelegten
  Wohnung ist das Feld zwar vorbelegt (z. B. `heizung-remscheid`), das Dashboard gibt es aber noch nicht –
  der Klick führte ins Leere und Home Assistant zeigte das Standard-Dashboard. Jetzt wird nur verlinkt,
  wenn das Ziel existiert; fehlt es, bleibt der Eintrag sichtbar, aber ohne Sprung (mit Hinweis im Tooltip).
- **Gleiches Problem beim Lüft-Countdown**: Die Push-Nachricht enthielt einen Link auf das Dashboard der
  Wohnung. Fehlt es, wird der Link jetzt weggelassen statt ins Leere zu zeigen.

## 0.23.7 – 2026-11-02

### Behoben
- **Eine neue Wohnung erbt nichts mehr**: Beim Anlegen einer zweiten Wohnung wurden Empfänger,
  Sprachausgaben, Ruhezeiten und die **Wetterquelle** der bestehenden Wohnung übernommen. Eine Wohnung in
  einer anderen Stadt hätte damit mit dem Wetter der ersten gerechnet (Heizsaison, Frost, Sonne) und
  doppelte Meldungen geschickt. Jetzt startet eine neue Wohnung leer – Bewohner, Zone, Empfänger und
  Wetter werden bewusst selbst gewählt.
- **Sonnenstand nimmt die Zone der Wohnung**: Ohne eigene Koordinaten gilt jetzt die Zone, die für die
  Wohnung eingestellt ist (`zone.*` mit Koordinaten) – erst danach der Standort von Home Assistant. Für
  den Normalfall „Home Assistant läuft woanders als die Wohnung“ stimmt der Sonnenstand damit ohne
  Handarbeit; die Felder unter *Wohnung → Erweitert: Standort* bleiben für Sonderfälle.

## 0.23.6 – 2026-11-02

### Geändert
- **Doku: Dashboard in vier Schritten** (Issue #10): Ein neues Home-Assistant-Dashboard startet mit der
  Standard-Strategie – die Raumklima-Strategie muss einmal in der rohen Konfiguration eingetragen werden.
  Die Anleitung zeigt jetzt genau diese Schritte (de/en/fr), sagt dass der Name frei wählbar ist, und
  dass ein bereits vorhandenes Dashboard einfach bearbeitet wird.
- **Doku: Zeitplan je Raum** steht jetzt direkt in der Installationsanleitung
  (*Einstellungen → Raum → Zeitplan*).

### Geplant
- **Zeitpläne zwischen Räumen teilen** (Wunsch aus #10) in die ROADMAP aufgenommen.

## 0.23.5 – 2026-11-02

### Behoben
- **Lüftungs-Assistent meldete sich beim Entladen nicht ab (Regression aus 0.23.4)**: Beim Einbau der
  Fenster-Zeit-Speicherung sind die Abmelde-Zeilen aus `async_stop` hinter das `return` der neuen Hilfs-
  methode gerutscht. Folge: beim Neuladen der Integration lief der 30-Sekunden-Takt des alten Assistenten
  weiter – doppelte Prüfungen, doppelte Meldungen, und der Test meldete einen hängenden Timer.
  Wiederhergestellt; **betroffen war nur 0.23.4**.

## 0.23.4 – 2026-11-02

### Behoben
- **Fenster-Timer überlebt einen Neustart (Issue #9)**: „Seit wann ist das Fenster offen?“ wurde nur im
  Arbeitsspeicher gehalten. Nach einem Neustart von Home Assistant begann der Zähler bei 0 – ein den
  ganzen Tag offenes Fenster galt plötzlich als fünf Minuten offen. Der Zeitpunkt wird jetzt mitgespeichert,
  beim Start einmalig übernommen und beim Schließen verworfen. Die Karte nimmt den frühesten bekannten
  Zeitpunkt (eigener Wert oder `last_changed` des Kontakts), neues Attribut `window_open_since`.

### Hinweise
- Grenze: Wird das Fenster während der Ausfallzeit geschlossen und danach wieder geöffnet, kann der
  Zeitpunkt zu früh liegen – der Timer zeigt dann „länger offen“ statt zu kurz. Bewusst in die sichere
  Richtung gewählt.

## 0.23.3 – 2026-11-02

### Neu
- **Standort: „von HA“-Knopf**: Unter *Wohnung → Erweitert: Standort der Wohnung* steht jetzt der
  Home-Assistant-Standort sichtbar unter dem Feld, und ein Knopf **von HA** übernimmt Breite und Länge
  zum Anpassen; das ✕ leert die Felder wieder (dann gilt Home Assistant). Klarstellung im Text: **leer
  lassen ist der Normalfall** – nichts einzutragen, keine Pflicht.

## 0.23.2 – 2026-11-02

### Behoben
- **Zeitfenster im Editor verschwanden (Issue #8)**: Der Einstellungs-Dump enthielt die gespeicherten
  Zeitfenster nicht. Der Editor startete deshalb leer, und der erste Klick schrieb diese leere Liste
  zurück – damit waren alle Einträge weg. Zeitfenster und Boost-Werte stehen jetzt im Dump; zusätzlich
  setzt der Editor bei jedem Ereignis aus der gespeicherten Konfiguration neu auf statt aus einer leeren
  Liste. Das kann auch künftige Wege dieser Art nicht mehr auslöschen.
- **Zeitformat folgt Home Assistant (Issue #7)**: Mit Sprache Englisch und Zeitformat „24 hours“ zeigte
  die Karte trotzdem 12 h mit AM/PM. Log, Verlauf, „bis“-Zeiten und „seit“-Angaben richten sich jetzt
  nach `hass.locale.time_format` – die HA-Einstellung schlägt die Sprache.

### Geändert
- **Neutrale Texte**: Die Beispiele im Standort-Hinweis und die Platzhalter der zweiten Wohnung nennen
  keine Ortsnamen mehr („z. B. Ferienwohnung“) – gedacht für alle Anwender, nicht für einen Fall.

## 0.23.1 – 2026-11-02

### Geändert
- **Klarere Bezeichnung: Fenster statt Fassade.** Es geht um die Richtung, in die die **Fenster** des
  Raums zeigen – „Fassade" war die Bauphysik-Kurzform dafür (ein Wandfenster sitzt in der Außenwand und
  hat damit dieselbe Richtung). Hinweis und Hilfe sagen jetzt „Fensterausrichtung", nennen den Fall
  zweier Fensterseiten (die mit der größeren Glasfläche zählt) und grenzen Dachfenster aus.
  Verhalten unverändert, der interne Schlüssel bleibt `solar_facade`.

## 0.23.0 – 2026-11-02

### Neu
- **Standort je Wohnung**: Unter *Wohnung → **Erweitert: Standort der Wohnung*** lassen sich Breite und
  Länge setzen. Damit rechnet Raumklima den Sonnenstand dort, wo die Wohnung steht – nicht dort, wo Home
  Assistant läuft. Gedacht für zweite Wohnungen, Ferienwohnungen und mitüberwachte Häuser; über rund
  6 Längengrade Unterschied verschiebt sich der Sonnenlauf um etwa 25 Minuten.
- Ohne Angabe gilt weiter der Standort von Home Assistant; `0/0` zählt nicht als Standort.

## 0.22.2 – 2026-11-02

### Geändert
- **Sonneneintrag in den Expertenbereich**: Die Fassade („Sonne kommt aus") steht nicht mehr zwischen
  den Alltagseinstellungen, sondern unter *Raum → **Erweitert: Sonneneintrag*** – zugeklappt, sofern
  nichts gesetzt ist. Es ist eine grobe Angabe für Sonderfälle, keine Pflicht.
- Der Hinweis sagt jetzt klar, was die Angabe leistet und was nicht: **freie Sicht vorausgesetzt**.
  Haus, Baum oder Balkon davor werden nicht gerechnet – dann besser leer lassen. Die **Etage** ist
  bewusst kein Feld: der Sonnenstand ist in jeder Höhe gleich, unterschiedlich ist nur die Abschattung.

## 0.22.1 – 2026-11-02

### Behoben
- **Sonne nach Fassade ohne eingestellten Standort:** Home Assistant meldet ohne Einrichtung `0/0`
  als Standort. Damit hätte der Fassaden-Filter falsche Sonnenstände gerechnet. Jetzt gilt der Standort
  erst als bekannt, wenn er von 0/0 abweicht – sonst bleibt es bei der reinen Vorhersage (wie ohne
  Fassade). Der Standort kommt aus Home Assistant selbst (Einstellungen → System → Allgemein).

## 0.22.0 – 2026-11-02

### Neu
- **Sonne nach Fassade (Azimut)** – Issue #5: Zur Sonnenseite gibt es jetzt die Angabe *Sonne kommt aus*
  (N/NO/O/SO/S/SW/W/NW). Raumklima rechnet den Sonnenstand (Azimut und Höhenwinkel, NOAA-Formel) für jede
  Vorhersagestunde und zählt nur Sonne, die auf **diese** Fassade scheint (±75°, Höhe über 10°). Ein
  Westzimmer reagiert damit erst nachmittags, ein Ostzimmer nur morgens – vorher zählte jede sonnige Stunde.
  Ohne Angabe bleibt alles wie bisher.

### Hinweise
- Der Sonnenstand kommt ohne Zusatzbibliothek aus (`planning.sun_position`, reine Mathematik, ±1°).
  Ohne Standort in Home Assistant greift weiter die einfache Vorhersage.

## 0.21.0 – 2026-11-02

### Neu
- **Schichtdienst**: Bett- und Aufstehzeiten werden jetzt **je Wochentag** gelernt (vorher nur
  Werktag/Wochenende). Reicht ein Wochentag noch nicht, greift automatisch der Tagestyp, dann alle
  Nächte – nichts muss eingestellt werden. Neue Option *Schichtdienst* (Einstellungen → Allgemein →
  Schlafenszeiten): damit wird zusätzlich **Tagschlaf** erkannt – ins Bett bis 09:00, aufstehen bis
  17:00. Bettzeit und Aufstehen eines Tagschlafs gehören dabei zur selben Nacht.
- **Ruhezeit senkt ab** (neue Option, Standard aus): Während der Ruhezeit werden **Schlafzimmer und
  selten genutzte Räume** auf die Absenkung gebracht – auch wenn jemand zu Hause ist. Genau das
  braucht der Schichtdienst: nach der Nachtschicht wird tagsüber geschlafen und die Heizung bleibt
  aus. Neue Plan-Grund `sleep` (in der Karte „Ruhezeit · Ziel X °C“).

### Hinweise
- Vorrang: ein laufendes **Zeitfenster** und der **Regler am Thermostat** (3 h) schlagen die
  Ruhezeit; vorgeheizt wird während der Ruhezeit nicht. Andere Räume als Schlafzimmer/selten genutzt
  bleiben unberührt.
- Beide Optionen sind neu und standardmäßig **aus** – ohne sie ändert sich nichts.

## 0.20.0 – 2026-11-02

### Neu
- **Vorheizen auf ein Zeitfenster**: Der Raum rechnet aus seiner gelernten Aufheizzeit (°C/h), wann er
  loslegen muss, um zum Beginn des nächsten Zeitfensters warm zu sein – plus 10 Minuten Puffer. Im Beispiel
  „Wohnzimmer 19–21 Uhr 22 °C“ heißt das: rechtzeitig vor 19 Uhr wird angefangen, wenn es sonst nicht
  reichen würde. Neuer Plan-Grund `schedule_preheat` (Attribut `plan_reason`), in der Karte als
  „Vorheizen für Zeitplan · Ziel 22,0 °C“ sichtbar.

### Hinweise
- Vorgeheizt wird nur, wenn der Raum seine Aufheizrate schon gelernt hat (mindestens drei Aufheizvorgänge)
  und jemand zu Hause ist. Ohne gelernte Zeit passiert nichts, bei Abwesenheit gewinnt die Absenkung. Die
  Aufheizrate wächst mit jeder Aufheizung von selbst – nichts einzustellen.

## 0.19.0 – 2026-11-02

### Neu
- **Zeitpläne pro Raum** (Issue #2): Bis zu sechs eigene Zeitfenster je Raum – Wochentage, Von/Bis und
  Zieltemperatur, auch über Mitternacht (z. B. „Wohnzimmer täglich 19–21 Uhr 22 °C, sonst 20 °C“). Der
  Zeitplan setzt nur den Sollwert: Fenster-Pause, Frostschutz, Schimmelschutz und Heizpause bleiben
  vorrangig, und wenn niemand da ist, gewinnt die Absenkung. Kein Zwang zu den `schedule.*`-Helfern – der
  Editor steckt in der Einstellungsseite.
- **Boost („Wärmer für kurze Zeit“)**: Knopf „Wärmer“ in der Raumkarte und `button.<raum>_wärmer_boost`.
  Zusatz zur Wunschtemperatur und Dauer sind je Raum einstellbar (Standard 2 K / 30 min, 5–240 min). Der
  Boost schlägt die Abwesenheits-Absenkung, endet von selbst und lässt sich durch erneutes Drücken beenden.
  Die Raumkarte zeigt die Restzeit.
- Neues Attribut `boost_until` an `climate.<raum>`; neue Plan-Gründe `schedule` und `boost` (im Attribut
  `plan_reason`), sichtbar als Hinweis in Karte und Einstellungen.

### Hinweise
- Die Zeitpläne werden in den Raum-Einstellungen gepflegt (Dashboard → Einstellungen → Raum → **Zeitplan**)
  und wirken sofort, ohne Neustart.

## 0.18.0 – 2026-11-02

### Neu
- **Reihenfolge der Räume im Dashboard** (Issue #4): Die Strategie sortiert die Räume jetzt nach
  **Stockwerk → Bereich → Name** statt nur nach Namen. Über `sort:` in der Dashboard-Konfiguration
  umstellbar: `floor` (Standard), `area` (nur Bereich) oder `name` (nur Name). Räume ohne Stockwerk
  stehen am Ende.
- **Erkennbar, warum ein Raum aus ist** (Issue #3): „Aus" und „abgesenkt" sahen gleich aus, obwohl sie
  verschiedenes bedeuten – abgesenkt wird nur, was eingeschaltet ist. Raumkarte und Übersicht
  unterscheiden jetzt **„Aus"** (in Home Assistant abgeschaltet) von **„Aus – am Thermostat
  abgeschaltet"**. Letzteres passiert, wenn das Thermostat sich selbst abschaltet (eigener Zeitplan,
  Boost, Drehrad) und *Erweitert → Drehen am Thermostat übernehmen* an ist. In der Abwesenheit zeigt die
  Übersicht zusätzlich, wie viele Räume ausgeschaltet sind.
- Neues Attribut `off_source` an `climate.<raum>` (`user` = in Home Assistant abgeschaltet,
  `trv` = am Thermostat) und der Statuswert `off_trv` an `sensor.<raum>_status`.

### Verhalten
- Ein ausgeschalteter Raum wird weiterhin **nicht** abgesenkt – er heizt ohnehin nicht. Die Anzeige sagt
  jetzt, warum er aus ist.

## 0.17.0 – 2026-11-02

### Neu
- **Meldungen mehrsprachig** 🇩🇪 🇬🇧 🇫🇷: Push-Nachrichten, Protokoll, Hinweise im Gesundheitscheck,
  Lüft-Countdown auf dem Sperrbildschirm, Knöpfe in der Push („Erledigt“, „In 10 min erinnern“), Lichtsignal-
  Einträge, die E-Mail-Prüfung und Fehlermeldungen der Karte kommen jetzt in der Systemsprache von
  Home Assistant (*Einstellungen → System → Allgemein*): Deutsch, Französisch, sonst Englisch. Eine Änderung
  der Sprache gilt sofort, ohne Neustart. Zahlen mit Dezimalkomma auf Deutsch und Französisch.
- **Doku und Handbuch auch auf Französisch** 🇫🇷: alle Seiten unter `docs/fr/` (Installation, Bedienung,
  Funktionsweise, Benachrichtigungen, Referenz, FAQ, Fehlerbehebung, Entwickeln), das Handbuch als PDF
  (`Raumklima-Manuel.pdf`) und die Sprachumschaltung in den READMEs.
- Ältere Protokolleinträge behalten die Sprache, in der sie geschrieben wurden.
- Für Entwickler: Texte stehen in `msg_catalog.py`; ein Test prüft, dass jeder Text in allen Sprachen
  vorhanden ist und die Platzhalter passen.

## 0.16.0 – 2026-11-02

### Neu
- **Französisch** 🇫🇷: Einrichtungsdialoge, Dashboard-Karten, alle „?“-Erklärungen und die PDF-Berichte
  (inkl. Push-Titel und Dateinamen) – automatisch, wenn Home Assistant auf Französisch steht. Kurze
  französische Dokumentation unter `docs/fr/`. Erste Übersetzung – Korrekturen gern als Issue.
- Andere Sprachen zeigen weiterhin Englisch.

## 0.15.1 – 2026-11-02

### Behoben
- **Nachtlüften:** Beim Schlafen mit offenem Fenster zeigten Raumkarte und Übersicht nach 10 Minuten
  „Lüftzeit erreicht – bitte schließen“ mit abgelaufenem Countdown, und das Ereignis ging an Automationen
  und Geräte-Auslöser. Jetzt zeigen Karte, Lüftungs-Sensor und Ereignisse beim Nachtlüften keinen
  Lüft-Hinweis – die leise Kältewarnung und der Morgengruß bleiben.

## 0.15.0 – 2026-11-01

### Neu
- **Mehrere Heizkörper pro Raum:** unter „Fühler & Fenster“ bzw. *Geräte & Technik ändern* weitere
  Thermostate wählen. Sie bekommen dieselben Befehle wie das Haupt-Thermostat (an/aus, Preset, Sollwert) –
  jedes mit eigener Prüfung und Wiederholung, eigenem Offset bzw. Sollwert-Ausgleich nach seiner eigenen
  Temperatur und eigener Meldung im Gesundheitscheck, wenn es ausfällt. Ventilstellung als Mittelwert;
  Übertragungsstatus über alle Thermostate. In der Einstellungskarte unter „Thermostat & Fühler“ sichtbar.
- Klargestellt: beliebig viele Fensterkontakte pro Raum (Pause, sobald einer offen ist).

## 0.14.7 – 2026-11-01

### Behoben
- **Sicherheit: E-Mail-Passwort im Protokoll.** Beim Einrichten der E-Mail schrieb das Protokoll
  („Einstellungen geändert“) das Passwort im Klartext mit. Jetzt steht dort nur „gesetzt“/„geändert“;
  bereits gespeicherte Einträge werden beim Start bereinigt. **Wer 0.14.0–0.14.6 genutzt hat, sollte das
  Mail-Passwort (App-Passwort) vorsichtshalber neu erzeugen.**
- **„PDF öffnen“ aus der Push-Nachricht** wurde in der Companion App abgelehnt („ungültige Anmeldung“): die
  App hängt `external_auth=1` an den Link, danach passte die Signatur nicht mehr. Berichte haben jetzt einen
  eigenen Schlüssel im Link – funktioniert in der App, im Browser und aus der Berichtskarte.
- Verlaufskarte stürzte ab („undefined is not iterable“), wenn der Verlauf nicht geladen werden konnte
  oder keine Fühler gewählt waren.

## 0.14.6 – 2026-11-01

### Behoben
- **Erste Seite ließ sich nicht scrollen** – sie sprang immer wieder nach oben. Raumkarten und Übersicht
  zeichneten sich bei *jeder* Zustandsänderung in Home Assistant neu (jede Lampe, jeder Sensor –
  mehrmals pro Sekunde). Jetzt nur noch, wenn sich am eigenen Raum etwas ändert (im Test: 180 → 0
  unnötige Neuzeichnungen in 3 Sekunden). Während gescrollt wird, zeichnen die Karten gar nicht neu,
  sondern holen es danach nach.

## 0.14.5 – 2026-11-01

### Geändert
- **E-Mail ohne Auswahlliste:** statt „PDF per E-Mail an“ mit Liste gibt es einen Schalter **„PDF per
  E-Mail“** und direkt darunter „E-Mail einrichten“. Speichern schaltet den Versand ein; ein vorhandener
  Mail-Dienst aus Home Assistant lässt sich – falls es einen gibt – im aufgeklappten Bereich wählen.

## 0.14.4 – 2026-11-01

### Neu
- **„Zugang prüfen“** beim E-Mail-Einrichten: testet Schritt für Schritt Server, Verschlüsselung,
  Anmeldung und Empfänger – ohne eine Mail zu senden – und sagt bei einem Fehler genau, woran es liegt.
- **1&1** in der Anbieterliste (smtp.1und1.de, Port 587, STARTTLS).

## 0.14.3 – 2026-11-01

### Behoben
- Nach einer Auswahl in einem Auswahlfeld der Einstellungskarte passierte scheinbar nichts, bis man
  woanders hinklickte (die Karte wartete auf das Ende der Eingabe). Jetzt wird sofort übernommen.
- „PDF per E-Mail an“ zeigt nur noch echte Mail-Dienste (SMTP, Google Mail, Mailgun, SendGrid) –
  keine Alexa-Geräte, Fernseher oder Handys mehr.

## 0.14.2 – 2026-11-01

### Geändert
- Auswahl „PDF per E-Mail an“ aufgeräumt: „Eigenes E-Mail-Konto (unten einrichten)“ steht oben, Handys
  (`notify.mobile_app_…`) tauchen nicht mehr auf, andere Mail-Dienste stehen in einer eigenen Gruppe.

## 0.14.1 – 2026-11-01

### Geändert
- „E-Mail einrichten“ steht jetzt immer direkt unter „PDF per E-Mail an“ (vorher erst nach Auswahl von
  „Raumklima“ sichtbar). Speichern schaltet den Mail-Versand automatisch ein.

## 0.14.0 – 2026-11-01

### Neu
- **„?“ hinter jeder Einstellung:** antippen klappt eine kurze Erklärung auf (Deutsch/Englisch) – was die
  Einstellung bewirkt und welcher Wert sinnvoll ist.
- **E-Mail direkt in Raumklima einrichten** – ohne YAML: bei „PDF per E-Mail an“ „Raumklima“ wählen, Anbieter
  aussuchen (Gmail, GMX, WEB.DE, Outlook, T-Online, iCloud, Posteo, IONOS füllen Server und Port aus),
  Benutzer, Passwort, Empfänger eintragen, **Speichern & Test-Mail senden**. Verständliche Fehlermeldungen
  (z. B. „App-Passwort verwenden“). Das Passwort wird nie an die Karte geschickt und ist in der
  Diagnose-Datei ausgeblendet. Ein vorhandener `notify`-Mail-Dienst kann weiter gewählt werden.

### Behoben
- **Seite sprang nach oben:** Die Karten zeichneten sich bei jeder Temperaturänderung neu, dabei sprang
  das Dashboard an den Anfang. Jetzt bleiben Höhe und Scrollposition erhalten; während man tippt oder ein
  Auswahlfeld offen hat, wartet die Einstellungskarte mit dem Aktualisieren.

## 0.13.0 – 2026-11-01

### Neu im PDF-Bericht (jetzt 4 Seiten)
- **Raumklima-Note A–F** aus Wohlfühlzeit, Feuchte und Sparen – mit Verlauf der letzten Wochen/Monate.
- **Euro-Schätzung** (optional): Heizkosten pro Jahr laut Abrechnung eintragen (*Allgemein → Gebäude &
  Schimmelschutz*) – Ersparnis in €, „1 °C weniger ≈ … € im Jahr“.
- **Räume mit Verlaufskurven** (Temperatur, Feuchte), **Rangliste** (sparsamster/wärmster Raum, beste
  Wohlfühlzeit, größte Verbesserung), **Werktag gegen Wochenende**.
- **Feuchte-Ampel** je Raum mit Problemraum, **CO₂-Auswertung**, **Lüft-Bilanz** (Anzahl, Dauer, gekippt
  > 30 min, „Bitte lüften“ → „Luft ausgetauscht“).
- **Wärmebild „Wann wird geheizt?“** (Wochentag × Uhrzeit).
- **Anwesenheit** (Vorheizen, warm bei Ankunft, Raumbelegung, Aufheizzeit je Raum) und **Zuverlässigkeit**
  (Ausfälle, Verbindungsunterbrechungen, Batteriestände).
- Saisonbericht mit **Rückblick**: erster/letzter Heiztag, kältester Tag, längste Heizpause, stärkster Monat.
- **Spartipps mit Zahlen**, z. B. Nachtabsenkung, Heizen an milden Tagen, zu warme Räume, Kippfenster.

### Geändert
- Statistik sammelt zusätzlich: Heizen je Stunde, CO₂, Ergebnis der Lüft-Hinweise, lange Lüftungen,
  Thermostat-Ausfälle und Verbindungsunterbrechungen.

## 0.12.0 – 2026-11-01

### Neu
- **PDF-Heizbericht** für Woche (sonntags 18 Uhr), Monat (am 1.) und Heizsaison (Tag nach Saisonende):
  Kennzahlen, Vergleich mit Vorzeitraum und Vorjahr (auch wetterbereinigt), Diagramm, Tabelle je Raum,
  Auffälligkeiten und Tipps. Sprache wie Home Assistant (Deutsch, sonst Englisch). Erzeugt direkt in
  Home Assistant (Bibliothek fpdf2, wird automatisch installiert).
- **Herunterladen direkt in der Berichtskarte** (signierter Link, keine Ordner), Knöpfe für einen Bericht
  „bis heute“. Ablage im Medienordner `raumklima/`.
- **Push mit „PDF öffnen“** an alle mit „Wochenbericht“, optional **E-Mail mit PDF-Anhang** über einen
  Mail-Dienst (SMTP). Einstellungen unter *Allgemein → Benachrichtigungen allgemein*.
- Statistik zählt jetzt Lüftvorgänge (wurden bisher nicht erfasst) sowie Zeiten „Raum leer – abgesenkt“
  und „belegt“ (Präsenzmelder); die Ersparnis berücksichtigt auch leere Räume.

## 0.11.0 – 2026-11-01

### Neu
- **Präsenzmelder pro Raum** (*Einstellungen → Raum → Präsenzmelder*), mmWave und PIR mit
  unterschiedlicher Gewichtung: mmWave gilt 3 min nach der letzten Meldung als leer, PIR erst nach
  20 min (sieht keine Stillsitzenden). Art automatisch aus der Geräteklasse oder fest einstellbar.
- **Jemand zu Hause:** Sieht ein Melder jemanden, wird nicht abgesenkt – auch ohne Handy.
  Standardmäßig zählen nur mmWave-Melder (PIR reagiert auch auf Haustiere), einstellbar unter
  *Allgemein → Anwesenheit*. Im Urlaub zählen Melder nie.
- **Leeren Raum absenken:** nach 30 min leer 1,5 °C weniger (beides einstellbar), nie unter „kurz weg“
  und den Schimmelschutz; sofort zurück, wenn jemand hereinkommt. „Automatisch“: nur Wohnraum, Küche,
  selten genutzt und nur mit mmWave.
- Raumkarte: „Jemand im Raum“ / „Raum leer seit … – abgesenkt“; Übersicht: Personen-Symbol.
- Lichtsignal blinkt nicht in leeren Räumen.

## 0.10.1 – 2026-11-01

### Neu
- **Wie lange ist das Fenster schon offen?** Die Raumkarte zeigt unter dem Namen „Fenster offen seit
  14:32 · 12 min“ (läuft live mit), die Übersicht die Dauer neben dem Fenster-Symbol jeder Kachel.
  Maßgeblich ist der früheste offene Fensterkontakt, ohne Kontakt die von Raumklima erkannte Öffnung.

## 0.10.0 – 2026-11-01

### Neu
- **Lichtsignal pro Raum:** Lampen auswählen (*Einstellungen → Raum → Lichtsignal*), die bei Hinweisen
  dreimal farbig blinken – blau „Bitte lüften“, orange „Bitte schließen“ / „Raum kühlt aus“, optional
  grün „Luft ausgetauscht“ und rot „Problem mit der Heizung“. Danach bekommt jede Lampe ihren alten
  Zustand zurück. Nicht in der Ruhezeit, beim Nachtlüften oder wenn niemand da ist. Knopf **Test**,
  WebSocket `raumklima/room/light_test`, Optionen `signal_lights` und `light_signals`.
- **Lüft-Countdown auf dem Sperrbildschirm:** neue Nachrichtenart „📱 Lüft-Countdown“ für Empfänger
  `notify.mobile_app_…`. Beim Lüften erscheint ein Countdown als Live-Aktivität (iPhone, iOS 17.2+)
  bzw. Live Update (Android); Farbe und Text wechseln bei „Luft ausgetauscht“, „bitte schließen“,
  „kühlt aus“; beim Schließen verschwindet er. Standardmäßig aus.
- Doku, FAQ und Handbuch (PDF) um beides ergänzt.

## 0.9.1 – 2026-11-01

### Neu
- **Handbuch als PDF** für Einsteiger, Deutsch und Englisch getrennt: Einrichtung Schritt für Schritt,
  Alltag, Einstellungen, häufige Fragen und ein kleines Lexikon. Hängt an jedem Release an
  ([Deutsch](https://github.com/Goldi5/Raumklima-2/releases/latest/download/Raumklima-Handbuch.pdf), [English](https://github.com/Goldi5/Raumklima-2/releases/latest/download/Raumklima-Manual.pdf)).
- Link **Handbuch (PDF)** oben in der Einstellungskarte – in der Sprache von Home Assistant.
- Neue Doku-Seite **Häufige Fragen** (`docs/de/faq.md`, `docs/en/faq.md`).


## 0.9.0 – 2026-11-01

### Neu
- **CO₂-Sensor** je Raum (optional, wird aus dem Bereich vorgeschlagen): ab 1000 ppm „Bitte lüften“ –
  auch wenn Lüften wegen feuchter Außenluft nicht trocknet; „Luft ausgetauscht“ erst unter 800 ppm.
  CO₂-Kachel in der Raumkarte.
- **Kalender:** Läuft ein Termin mit „Urlaub“, „Reise“ … wirkt er wie der Urlaubsschalter, mit
  „Homeoffice“, „zu Hause“ … wie „Gäste da“ (kein Absenken). Wörter einstellbar.
- **Wettervorhersage:** Räume als *Sonnenseite* markieren – bei erwarteter Sonne 1 °C weniger heizen.
  In **Frostnächten** (Vorhersage ≤ −5 °C) wird bei Abwesenheit nur halb so tief abgesenkt.
- **Gesundheitscheck:** Hinweis „Heizkörper kommt kaum hinterher“, wenn das Ventil über einen Tag
  meist fast ganz offen ist und das Ziel trotzdem selten erreicht wird (hydraulischer Abgleich,
  Vorlauftemperatur, Heizkörpergröße).
- **Geräte-Auslöser** für Automationen: Bitte lüften, bitte schließen, kühlt aus, Luft ausgetauscht,
  Fenster geöffnet/geschlossen, Heizung pausiert/läuft wieder, Gesundheitsproblem.
  `raumklima_event` hat dafür neue Typen `window`, `heating`, `health`.
- **CSV-Export** des Heizberichts (Knopf in der Berichtskarte, WebSocket `raumklima/report/export`).
- **Karten auf Englisch**, wenn Home Assistant nicht auf Deutsch eingestellt ist; Zahlen und Uhrzeiten
  im passenden Format.
- Doku: englische Seiten vollständig, Hinweise zu Matter/Thread-Thermostaten, Seite „Entwickeln“.

### Geändert
- Einstellungen aus der Einstellungskarte (Wunsch, Absenkung, Fenster-Verzögerung, Nachtlüften …)
  wirken sofort, ohne den Raum neu zu laden – Fensterzustand, Verlauf und Gesundheitsdaten bleiben
  erhalten. Nur beim Raumtyp startet der Raum kurz neu.
- Code aufgeräumt: Raum- und Zentralenlogik in Teilmodule aufgeteilt, Karte als Module mit Build
  (`frontend/`), Integrationstests mit Home Assistant, Lint (ruff) und feste Action-Versionen in der CI.

### Behoben
- Abwesenheits-Push sprach immer von „Berlin“ – jetzt der Name der Wohnung (nur bei mehreren).
- Karten: ein Präfix (`strip_prefix`) mit Sonderzeichen wurde als regulärer Ausdruck gedeutet.


## 0.8.6 – 2026-11-01

### Behoben
- Beim Neuladen eines Raums (z. B. nach einer Änderung in der Einstellungskarte) liefen die Timer für
  „Thermostat nicht erreichbar“ und „Fenster vermutlich offen“ weiter und konnten in die entladene
  Instanz schreiben; noch wartende Regeldurchläufe senden nach dem Entladen keine Befehle mehr.
- Gesundheitscheck-Karte: Raumnamen mit Sonderzeichen wie „Bad (OG)“ brachen das Kürzen des
  Wohnungs-Präfixes (regulärer Ausdruck); jetzt einfacher Textvergleich.


## 0.8.5 – 2026-11-01

### Behoben
- **Endlosschleife mit dem Thermostat:** Tuya-TRVs (TRV602Z) springen beim Setzen eines Sollwerts im
  Preset „eco“ selbst auf „comfort“. Die Integration hat jedes Mal „eco“ zurückgestellt – im Bad
  stundenlang alle ~3 s. Jetzt gelten eco/comfort/manual/heat als gleichwertig (beide regeln auf den
  Sollwert); zusätzlich: springt ein Thermostat wiederholt auf ein anderes Preset, wird es übernommen
  bzw. 30 min pausiert, und bei mehr als 40 Befehlen in 10 min bremst die Integration 15 min
  (Hinweis im Gesundheitscheck).
- Protokoll: gleiche Einträge kurz hintereinander werden zu einem Eintrag „×N“ zusammengefasst.
- Protokoll-Karte: „Ältere laden“ berücksichtigt die Filter (lud bisher nur ausgeblendete Einträge).
- Bericht: kein wetterbereinigter Vergleich mehr, wenn ein Zeitraum weniger als 72 Messstunden je Raum
  hat; „Wohlfühlzeit“ zählt einen Raum, der ohne Heizen wärmer als sein Ziel ist, als am Ziel.
- README und Doku aktualisiert; ein Test prüft künftig, dass README, Changelog und Karte zur Version passen.


## 0.8.4 – 2026-10-31

### Behoben
- Protokoll (und vorsorglich Zentrale und Bericht) konnten beim Neustart überschrieben werden, wenn
  Räume schon vor dem Laden etwas eintrugen – Home Assistant liefert dann den ungespeicherten Stand
  statt der Datei. Gespeichert wird jetzt erst nach dem Laden.


## 0.8.3 – 2026-10-31

### Geändert
- Protokoll-Karte: zusätzlich zur Live-Übertragung wird alle 5 s nachgesehen (nur neue Einträge),
  beim Zurückkehren auf den Reiter und nach einem Neustart wird nachgeladen. Anzeige „live · Uhrzeit“
  und Hinweis, wenn neue Einträge durch die Filter ausgeblendet sind („Alle zeigen“).
- WebSocket `raumklima/log` mit Parameter `after`.


## 0.8.2 – 2026-10-31

### Behoben
- „Raumfühler meldet sich nicht“ auch, wenn der Fühler seit dem Start noch keinen Wert geliefert hat.


## 0.8.1 – 2026-10-31

### Behoben
- Kurze Aussetzer der Thermostate (unter 1 min) zählen nicht mehr als Funkausfall. Sind alle
  Thermostate gleichzeitig kurz weg, wird das als Verbindungsproblem (Zigbee2MQTT/MQTT/VPN)
  erkannt: ein Hinweis „Verbindung zu den Thermostaten wackelt“ für die Wohnung und höchstens ein
  Protokolleintrag pro halbe Stunde – statt „Funk wackelt“ für jeden Raum und hunderter Einträge.
- Gesundheitscheck meldet jetzt auch einen ausgefallenen Raumfühler („Raumfühler meldet sich nicht“).
- Protokoll: Einträge vom Start vor dem Laden landen nicht mehr doppelt/an falscher Stelle.


## 0.8.0 – 2026-10-31

### Neu
- **Mehrere Wohnungen:** Einstellungen → Allgemein → Wohnung → „Wohnung anlegen“ erstellt eine
  weitere Zentrale mit eigenen Bewohnern, Zone, Empfängern, Heizsaison, Bericht und Protokoll
  (Empfänger, Ruhezeit und Wetter werden als Startwert übernommen). Räume ordnest du im Raum
  unter „Wohnung“ zu; ohne Zuordnung gehören sie zur ersten Wohnung.
- Umschalter „Berlin | Remscheid“ oben in der Übersicht und in den Einstellungen; jede Wohnung
  hat ihr eigenes Dashboard (Adresse einstellbar). Alle Karten und die Dashboard-Strategie
  kennen die Option `home`.
- WebSocket: `raumklima/home/create`; alle Befehle akzeptieren `home`.


## 0.7.0 – 2026-10-31

### Neu
- **Aufheizzeit lernen:** Jeder Raum merkt sich, wie schnell er warm wird (°C pro Stunde, abhängig
  von der Außentemperatur, aus den letzten 30 Aufheizvorgängen). Anzeige in den Raum-Einstellungen.
- **Vorheizen nach Ankunftszeit:** Aus der Annäherung wird die Ankunftszeit geschätzt. Braucht die
  Wohnung z. B. 50 min zum Aufheizen und jemand ist in 55 min da, wird jetzt vorgeheizt – auch weit
  vor der km-Grenze (bis 150 km). Begründung steht im Protokoll.
- **Fenster ohne Kontakt erkennen:** Fällt die Temperatur in 6 min um 1 °C (und draußen ist es
  deutlich kälter), pausiert die Heizung, bis es wieder wärmer wird (10–30 min). Pro Raum:
  Automatisch (nur ohne erreichbaren Kontakt) / Ja / Nein.
- **Feiertage je Bundesland:** Die Nacht vor einem Feiertag gilt wie Wochenende (Ruhezeit,
  Lernen). Einstellung unter Allgemein → Schlafenszeiten.

### Geändert
- „Raum kühlt aus“ kommt nur noch 3× laut, danach alle 30 min leise.
- Temperaturen im Protokoll mit Komma („Sollwert 20,5 °C“).


## 0.6.0 – 2026-10-31

### Neu
- **Schlafenszeiten lernen:** Aus dem Nachtlüften (Fenster abends auf / morgens zu) und optional aus
  **Schlaf-Signalen** (z. B. Licht im Wohnzimmer: abends 20 min alles aus = ins Bett, morgens an =
  aufgestanden) lernt die Integration die typischen Zeiten – getrennt nach Werktag und Wochenende,
  Median der letzten 6 Wochen ab 4 Nächten. Ruhezeit und Nachtlüften-Fenster werden damit nur
  **verlängert**, nie verkürzt; Morgengruß und „Bis … Uhr“ richten sich danach.
- Mit Schlaf-Signalen gilt die Ruhezeit live: Licht aus → Ruhe, Licht morgens an → wach.
- Einstellungen → Allgemein → **Schlafenszeiten**: Lernen an/aus, Signale wählen, gelernte und
  wirksame Zeiten. Alles erscheint im Protokoll.


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
