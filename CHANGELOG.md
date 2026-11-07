# Changelog

## 0.61.0b1 – 2026-11-07

### Behoben
- **„In 15 min erinnern" wirkte bei „Raum kühlt aus" nicht.** Die Prüfung in `vent_manager` nahm
  `too_cold` ausdrücklich aus, obwohl der Knopf bei jeder Meldung angeboten wird. Jetzt gilt die
  Pause für alles, was den Knopf zeigt; die harte Nachtwarnung („sehr kalt") geht weiter ihren
  eigenen Weg und schweigt nicht.
- **Die Pause überlebte keinen Neustart.** `_on_notify_action` speicherte nicht — in der
  Zustandsdatei stand weiterhin `snoozed_until: null`. Jetzt wird nach jeder Knopfaktion gespeichert.

### Hinzugefügt
- **Die Pause ist sichtbar:** neues Attribut `notify_paused_until` an der Klima-Entität und ein Chip
  an der Raumkarte („Pause bis 14:53"). Bisher war nach einem Druck nirgends zu sehen, bis wann Ruhe
  ist.
- **Import-Wächter deckt jetzt alle Exporte aus `shared.js` ab** statt nur `RK_*`/`rk*`. Anlass:
  `loc` fehlte in der Raumkarte — derselbe Fehler wie zuvor bei `RK_VERSION` und `rkLayout`, nur
  diesmal beim Schreiben des neuen Chips aufgefallen. Der Test liest die Exportliste aus
  `shared.js`, prüft nur Kartendateien und hat Zähne (Gegenprobe: `loc` entfernt → rot).
## 0.60.1 – 2026-11-07

### Behoben
- **CI-Lint:** eine Import-Zeile im neuen Test war unsortiert (`I001`), dadurch war die
  „Validate"-Prüfung auf 0.60.0 rot. Keine Auswirkung auf die Integration, nur auf den Testcode.
## 0.60.0 – 2026-11-07

Erste stabile Version seit 0.59.11. Alles hier war vorher als Beta draußen — wer eine Beta
installiert hatte, hat es schon; für alle anderen ist es die Zusammenfassung.

### Regelung
- **Jedes Thermostat lernt seine eigene Antwortzeit.** Die Grenze für „nicht erreichbar" ist nicht mehr
  fest (60 s), sondern folgt dem Gerät: 2 × Meldeabstand + 60 s Reserve, aus den vergangenen
  Funkpausen gelernt und über einen Neustart hinweg gespeichert. FRITZ!DECT (~15 min) meldet damit
  keine Fehlalarme mehr, Zigbee-Geräte weiterhin schnell. Neue Raumeinstellung
  *Thermostat & Fühler → Antwortzeit des Geräts* (automatisch oder fester Wert).
- **Gegenprobe für den Sollwert:** neues Attribut `trv_target_expected` zeigt, was am Gerät stehen
  müsste (Ziel + gelernter Abgleich). Steht das Gerät länger als 15 Minuten daneben, warnt
  *Gesundheit der Heizung* unter „Thermostat übernimmt den Sollwert nicht" — vorher fiel so etwas
  nirgends auf, weil `sync: ok` nur „Befehl abgeschickt" bedeutet.
- **Fenster schlägt Schimmelschutz.** Ein offenes Fenster hat Vorrang vor jeder Feuchte-Absenkung;
  die Meldung dazu war falsch und ist behoben.
- **Bauart je Raum** (Außenecke / Außenwand / innenliegend / wie die Wohnung) bestimmt den fRsi-Wert
  für den Schimmelschutz, statt einer Pauschale für die ganze Wohnung.
- **Startwert statt 20,0 °C:** nach einem Neustart steht der Sollwert nicht mehr kurz auf 20 °C,
  sondern auf der eingestellten Komforttemperatur — keine Zacken mehr im Verlauf.
- **Fremder Sensor aus der Nachbarwohnung** wird nicht mehr als eigenes Ventil übernommen.
- **Feuchtequelle erkennen:** steigt die Feuchte über Stunden trotz Heizung, sagt Raumklima, dass es
  nicht am Heizen liegt.

### Bericht
- **Kennzahl folgt dem Gerät, nicht dem Wunsch:** Ventilstellung → Gradstunden unter Ziel (nur bei
  echtem Mangel) → Heizstunden. Räume ohne Ventilpositions-Meldung (Livisi, Bosch, schlafende
  TRVs) haben damit endlich einen lesbaren Bericht. Wohnungsweit wählbar unter
  *Einstellungen → Bericht → Wärmemenge*.
- **Keine Behauptung „gekippt" mehr.** Ein Fensterkontakt kennt nur auf und zu; der Bericht nennt
  jetzt nur das Gemessene („11,1 h offen bei 16× Lüften") und die Empfehlung, ohne den Zustand zu
  erfinden.
- **CSV enthält den Schattenmodus** (`ventil_berechnet_h` gegen `ventil_voll_offen_h`),
  Gradstunden und das mittlere Tagesziel — damit lässt sich die Regelung auswerten, ohne neue
  Oberfläche.
- **Ventilkachel färbt nach Heizzustand**, nicht nach Prozentwert: 2–6 % im Leerlauf sind
  Ventilschutz und sehen nicht mehr aus wie „heizt noch".
- Gelöschte Räume erscheinen nicht mehr als Geisterzeilen.

### Karte und Dashboard
- **Alle fünf Seiten gleich breit**, und die gepflegte Raum-Reihenfolge gilt überall — auch in
  Verlauf, Protokoll und Bericht (#30, #32).
- **Die Karte kommt über eine eigene View** mit `no-store` und Inhalts-Hash in der URL: nach einem
  Update wird kein alter Stand mehr aus dem Cache gezeigt.
- **Die Karte kann nicht mehr stumm leer bleiben:** Fehler beim Zeichnen stehen als Text in der
  Karte und werden an die Debug-Spur gemeldet. Ein fehlender Import hatte die Berichtskarte
  vollständig leer gelassen, ohne jede Meldung.
- **Debug-Spur und zwei Wächter:** die Karte meldet geladene Version und jeden Klick an den Server;
  Tests prüfen, dass kein Befehl ohne passendes Schema aufgerufen wird und keine benutzte Funktion
  unimportiert bleibt.

### Sichern, Diagnose, Fehler melden
- **Datei vom Server statt Download aus dem Browser:** „Sichern" und „Diagnose" liefern eine
  kurzlebige Adresse (`/api/raumklima/export/<Schlüssel>`, 15 Minuten, einmalig). Das funktioniert
  auf iPad-Safari und in der HA-App, wo Blob-Downloads und Teilen bisher scheiterten.
- **Dialog mit echten Knöpfen** (Teilen, Speichern, Kopieren) und Statuszeile im Dialog; solange er
  offen ist, wird die Karte nicht neu gezeichnet.

## 0.59.43b1 – 2026-11-07

### Behoben
- **Sollwert-Prüfung schweigt, wenn nicht geregelt wird.** Bei ausgeschalteter Heizung (Heizpause,
  Frost, Überwachungsmodus) und bei offenem Fenster steht am Gerät absichtlich ein anderer Wert als
  das Ziel — ohne diese Bedingung hätte die neue Meldung in jedem ausgeschalteten Raum gestanden.
## 0.59.42b1 – 2026-11-07

### Hinzugefügt
- **Sollwert-Gegenprobe:** neues Attribut `trv_target_expected` — der Wert, der am Thermostat stehen
  **müsste** (Ziel + gelernter Abgleich). Damit lässt sich `trv_target` endlich deuten: 18,5 bei Ziel
  21 ist bei einem Abgleich von −2,3 K richtig, ohne Abgleich nicht.
- **Meldung „Thermostat übernimmt den Sollwert nicht":** steht das Gerät länger als 15 Minuten um
  mindestens 0,5 K neben dem erwarteten Wert, erscheint das in *Gesundheit der Heizung* und im
  Protokoll. Vorher meldete `sync: ok` nur „Befehl abgeschickt" — ein Gerät, das den Wert still
  verwirft (eigener Zeitplan, Boost, Automation), fiel nirgends auf. Im Überwachungsmodus, bei
  Heizpause und bei Geräten, die über `comfort_temperature` regeln, wird nicht geprüft.
## 0.59.41b1 – 2026-11-07

### Geändert
- **Ventilkachel färbt nach Heizzustand, nicht nach Prozentwert.** Viele Geräte lassen das Ventil im
  Leerlauf 2–6 % offen (Ventilschutz: Bosch SHc, Livisi VRCC, Homematic). Bei „Temperatur erreicht"
  sah die orange Kachel dadurch aus wie „heizt noch". Die Farbe folgt jetzt `hvac_action`
  (`heating` = orange, sonst neutral); die Zahl bleibt unverändert sichtbar. Ohne `hvac_action`
  bleibt es beim alten Verhalten.
## 0.59.40b1 – 2026-11-07

### Hinzugefügt
- **CSV: mittleres Tagesziel** (`ziel_mittel_C`). Ohne das Ziel lässt sich nicht prüfen, ob die
  berechnete Ventilöffnung zum Raumverhalten passt — die Rechnung hängt direkt an (Ziel − Ist).
  Zusätzlich zu `ventil_voll_offen_h`, `ventil_berechnet_h` und `gradstunden_unter_ziel_Kh`.
## 0.59.39b1 – 2026-11-07

### Hinzugefügt
- **CSV enthält den Schattenmodus:** zwei neue Spalten `ventil_berechnet_h` (was Raumklima aus
  Ziel/Ist rechnen würde) und `gradstunden_unter_ziel_Kh` — neben `ventil_voll_offen_h` (Gerät).
  Damit lässt sich der Schattenmodus je Tag und Raum auswerten, ohne neue Oberfläche: *Bericht → CSV*.
  Einzelwerte live stehen weiter in der Diagnose unter `values.valve_shadow`.
## 0.59.38b1 – 2026-11-07

### Geändert
- **Keine Behauptung „gekippt" mehr.** Ein Fensterkontakt kennt nur auf und zu – ob gekippt, weit offen
  oder Tür einen Spalt, ist nicht messbar. Der Bericht sagt jetzt, was gemessen ist („Fenster 11,1 h
  offen bei 16× Lüften") und gibt nur noch die Empfehlung, ohne den Zustand zu behaupten.
  Betrifft die Befunde im PDF (`report_extra`), den Berichtstext und die Doku in allen drei Sprachen.
- **Notiert für später:** Sensoren, die *geschlossen / gekippt / offen* unterscheiden (z. B. Homematic IP
  oder Bosch Fenstergriffe), könnten den Zustand wirklich liefern — steht in der ROADMAP.
## 0.59.37b1 – 2026-11-07

### Behoben
- **Bündel nachgezogen:** 0.59.36b1 wurde veröffentlicht, bevor die Karte gebaut war (Banner zeigte
  die Vorgängerversion). Diese Version enthält das korrekt gebaute Bündel mit dem Import-Fix.
## 0.59.36b1 – 2026-11-07

### Behoben
- **Berichtskarte blieb komplett leer (in einer Wohnung ohne Ventilstellung).** In `cards/report.js` wurden `rkLayout` und
  `rkRoomsOrdered` benutzt, aber nicht importiert – der `hass`-Setter warf beim ersten Zeichnen eine
  `ReferenceError`, die Karte zeigte nichts, ohne Meldung. Import ergänzt.
- **Die Karte kann nicht mehr stumm leer bleiben:** Zeichnen ist jetzt in `try/catch`, ein Fehler
  steht als Text in der Karte und geht zusätzlich an die Debug-Spur (`report:error`, bei Erfolg
  `report:ok` mit Kennzahl und Raumzahl).

### Geändert
- **Import-Wächter deckt jetzt auch `rk*`-Helfer ab** (`frontend/test/imports.test.mjs`), nicht nur
  `RK_*`-Konstanten — genau diese Lücke hat den leeren Bericht durchgelassen.
## 0.59.35b1 – 2026-11-07

### Behoben
- **Bericht wechselt auf Heizstunden, solange eine Kennzahl kaum Werte hat.** Gradstunden gibt es erst
  seit dem Update – in einem 14-Tage-Fenster wären das ein oder zwei Balken. Liegt für weniger als
  30 % der Tage ein Wert vor, zeichnet die Karte Heizstunden und sagt es im Hinweis.
## 0.59.34b1 – 2026-11-07

### Behoben
- **Karte neu gebaut:** In 0.59.33b1 trug das Bündel noch den Banner der Vorgängerversion (Versionssprung
  ohne `npm run build`) – die Übersicht hätte die falsche Version gezeigt.
## 0.59.33b1 – 2026-11-07

### Behoben
- **Leerer Bericht ohne Ventilstellung:** Der Rückfall auf Gradstunden war gut gemeint, aber in einem
  gut eingestellten Haus sind sie **immer 0 K·h** – die Balken blieben leer. Jetzt gilt:
  Ventilstellung, wenn alle Geräte sie melden → Gradstunden nur, wenn es echten Wärmemangel gab
  (≥ 0,5 K·h im Zeitraum) → sonst **Heizstunden**. Zusätzlich prüft die Karte selbst nach: hat die
  gewählte Kennzahl über den ganzen Zeitraum keinen Wert, zeichnet sie Heizstunden und sagt es im
  Hinweis.
## 0.59.32b1 – 2026-11-06

### Hinzugefügt
- **Jedes Thermostat lernt seine eigene Antwortzeit (#33).** Die Ausfallgrenze kommt nicht mehr aus
  einer festen Zahl, sondern aus den beobachteten Funkpausen (80 %-Perzentil, mindestens drei
  Proben) – FRITZ!DECT braucht ~15 Minuten, Tuya meldet im Sekundentakt. Bis genug Proben da sind,
  gilt der übliche Takt der Gerätefamilie (`fritzbox` 15, `tado` 5, `netatmo` 1, `homematic` 10,
  Zigbee/MQTT 5 Minuten). Während der Lernphase wird nur informiert, nicht gewarnt.
- **Neue Raumeinstellung „Antwortzeit des Geräts"** (*Raum → Thermostat & Fühler*): automatisch
  lernen oder fest 1 / 5 / 15 / 30 Minuten – für Geräte hinter einem Repeater oder mit Sonderfunk.
- **Gelernte Werte überleben den Neustart:** sie liegen im Raum-Speicher (`outage_durations`), nicht
  nur im Arbeitsspeicher. In der Diagnose stehen `trv_interval_min`, `outage_min`,
  `outage_learned` und `outage_samples`.

### Geändert
- **Meldetakt wird nicht mehr aus Wertänderungen geschätzt.** Ein Raum, in dem sich stundenlang
  nichts ändert, sah dadurch „tot" aus. Maßgeblich ist jetzt, wie lange ein Gerät real braucht, bis
  es zurückkommt.
## 0.59.31b1 – 2026-11-06

### Behoben
- **Meldetakt robuster bestimmt:** Geräte melden oft in Schüben (mehrere Attribute innerhalb von
  Sekunden). Der Median lag dadurch bei 0,2 Minuten und die Ausfallgrenze wäre zu scharf geblieben.
  Jetzt zählt das **80 %-Perzentil** der Abstände – der typische Abstand zwischen zwei Schüben.
## 0.59.30b1 – 2026-11-06

### Behoben
- **Meldetakt und Ausfallgrenze stehen jetzt in der Diagnose** (`trv_interval_min`, `outage_min`).
  Ohne die beiden Werte war von außen nicht prüfbar, warum eine Ausfallmeldung kam oder ausblieb.
## 0.59.29b1 – 2026-11-06

### Behoben
- **„Thermostat nicht erreichbar" bei Funk-Thermostaten (#33):** Die Ausfallgrenze war fest auf
  60 Sekunden gesetzt. Geräte, die nur selten melden (FRITZ!DECT etwa alle 15 Minuten), galten
  dadurch dauerhaft als weg. Jetzt gilt **gemessener Meldeabstand × 2 + 1 Minute** (60 s … 60 min),
  vor dem ersten Messwert der übliche Takt der Gerätefamilie. Dieselbe Zahl steht im Protokoll
  („seit 31 min keine Verbindung – das Gerät meldet sich sonst etwa alle 15 min") und in der
  Diagnose (`trv_interval_min`, `outage_min`).
- **Raum-Reihenfolge fehlte in Verlauf, Protokoll und Bericht (#32):** Diese drei Karten holten die
  Räume alphabetisch und luden die gepflegte Reihenfolge gar nicht. Jetzt wie in der Übersicht
  (`rkRoomsOrdered` + `rkLayout`).

### Tests
- `tests/ha/test_trv_outage.py` (3 Fälle): gemessener Takt, Startwert ohne Messung, Reserve bei
  schnellen Geräten.
- `frontend/test/order-cards.test.mjs`: die drei Karten müssen sortieren und das Layout laden.

## 0.59.28b1 – 2026-11-06

### Behoben
- **Kartenbreite: die pauschale 1120-px-Grenze aus 0.59.27b1 ist wieder raus.** Sie traf auch die
  Übersichtskarte, die volle Breite haben soll. Richtig ist die Aufteilung der Ansicht: die
  Kachelreihe oben spannt alle drei Spalten, jeder Raum eine Spalte – so wie die automatisch
  erzeugte Ansicht es ohnehin macht. In bereits gespeicherten Dashboards werden die Abschnitte
  entsprechend gesetzt (Übersicht 3, Räume 1).

## 0.59.27b1 – 2026-11-06

### Geändert
- **Karten laufen nicht mehr über die ganze Seitenbreite:** Auf breiten Bildschirmen war eine
  Raumkarte in der 3-Spalten-Ansicht rund 1500 px breit, der Inhalt stand verloren in der Mitte.
  Alle Karten sind jetzt auf 1120 px begrenzt und zentriert (`--rk-maxw`), auf schmalen Geräten
  unverändert 100 %.

## 0.59.26b1 – 2026-11-06

### Geändert
- **Änderungsprotokoll und Doku ohne Beispiel-Wohnungsnamen:** Beispiele heißen jetzt neutral
  (Wohnung A/B, Ferienwohnung), damit Einträge ohne privaten Zusammenhang verständlich bleiben.

## 0.59.25b1 – 2026-11-06

### Behoben
- **Falsche Warnung „Thermostat rechnet mit eigenem Abschlag" bei FRITZ!DECT (#31).** Die
  AVM-Integration leitet `preset_mode` aus dem Sollwert ab: entspricht er der Komforttemperatur,
  meldet sie „comfort". Raumklima sah darin einen Geräteabschlag, obwohl nichts überstimmt wird.
  Bei Geräten mit abgeleitetem Preset (`fritzbox`) entfällt dieser Zweig; „aus" und „Ventil
  dauerhaft offen" werden weiter geprüft.

## 0.59.24b1 – 2026-11-06

### Behoben
- **Falscher Wechsel auf Gradstunden in einer Wohnung mit Ventilstellung:** Das neue Feld für „Gerät meldet
  eine Ventilstellung" naturgemäß noch keine Historie hatte. Ein gemessener Öffnungswert in der
  Vergangenheit zählt jetzt als Nachweis.
- **Bericht zeigte gelöschte Räume** („Test Überwachung", alte Raumnamen) als Geisterzeilen mit.
  Er enthält nur noch Räume, die aktuell zur Wohnung gehören.

## 0.59.23b1 – 2026-11-06

### Behoben
- **Fremde Wohnung als Ventilsensor** (`room_health.py`): Ein Sensor ohne Bereich aus einer
  anderen Wohnung wurde dem gleichnamigen Raum einer Wohnung zugeordnet, weil unbekannter
  Bereich als „vielleicht passend" galt. Namens-Heuristik verlangt jetzt einen
  **bekannten, gleichen** Bereich.
- **20,0 °C um Mitternacht der Sollwerte:** `target_temp` startete mit 20,0 °C und stand nach
  jedem Neustart/Videogerät-Aussetzer eine Sekunde im Sollwert (Zacken in Bericht und Karte).
  Startwert kommt jetzt aus der Wunschtemperatur des Raums.

### Hinzugefügt
- **Bericht ohne Ventilstellung** (Livisi VRCC, Homematic ohne Positionssensor): Statt leerer
  Balken zeigt der Bericht **Gradstunden unter Ziel** (K·h, gemessen) oder auf Wunsch
  Heizstunden. Auswahl unter *Einstellungen → Wärmemenge im Bericht* (Standard: automatisch).
  PDF und Rangliste („sparsamster Raum", Vergleich je Heizgradtag) benutzen dieselbe Kennzahl.
- **Gesundheit: „Fensterkontakt meldet sehr oft"** – ab 20 Zustandswechseln in 24 h, weil jeder
  Wechsel die Heizung pausiert (im Betrieb gemessen: 194 Wechsel in 3 Tagen bei einem defekten Kontakt).
- **Im Bericht je Raum „x h nicht erreichbar"**, wenn das Thermostat zeitweise weg war.

## 0.59.22b1 – 2026-11-06

### Geändert
- **Alle fünf Dashboard-Seiten gleich breit.** Verlauf, Bericht und Protokoll nutzten im
  Sections-Layout zwei Spalten, Räume und Einstellungen drei – daher der sichtbare Unterschied.
  Jetzt überall drei Spalten (`cards/strategy.js`).
- **Gepflegte Raum-Reihenfolge gilt auch in den Einstellungen** (#30). Bisher sortierte die
  Integration dort alphabetisch (`rkRooms()`, `shared.js:538`), während Dashboard und Übersicht
  die Reihenfolge aus *Darstellung → Reihenfolge* nutzten. Neu: `rkRoomsOrdered()` wendet die
  Reihenfolge an, ohne Räume auszublenden – ein auf „aus" gestellter Raum muss in den
  Einstellungen anklickbar bleiben. Betrifft Raum-Tabs, die Kacheln „Alle Räume auf einen Blick"
  und die Chips „Gäste gelten für".

### Tests
- `frontend/test/room-order.test.mjs` (4 Fälle): Reihenfolge, alte Layouts mit Raumnamen,
  Ausblenden nur im Dashboard, Verhalten ohne Layout.

## 0.59.21b1 – 2026-11-06

### Behoben
- **„Sichern" scheiterte an „extra keys not allowed".** Die Karte schickt bei jedem Aufruf die
  Wohnungs-Kennung `home` mit; `raumklima/backup/export` und `raumklima/backup/import` hatten
  dafür kein Feld im Schema. Home Assistant wies die Nachricht deshalb ab, bevor der Befehl
  lief – auf iPad, iPhone und PC gleichermaßen. Beide Schemata nehmen `home` jetzt an.
- **Regressionstest `tests/test_ws_schemas.py`:** vergleicht, welche Befehle die Karte mit
  `home` aufruft, mit den Schemata im Backend. Ohne den Fix ist der Test rot (geprüft).

## 0.59.20b1 – 2026-11-06

### Behoben
- **`RK_VERSION` war in `cards/settings.js` nicht importiert.** Folge: `ReferenceError` beim
  Fehlerbericht, und alle Aufrufe der Debug-Spur starben still – deshalb war „Sichern" ohne
  jede Rückmeldung. Import ergänzt.
- **Wächter-Test `frontend/test/imports.test.mjs`:** prüft für jede Datei, dass benutzte
  `RK_*`-Konstanten auch importiert sind. Genau dieser Fehler wäre damit sofort aufgefallen.

## 0.59.19b1 – 2026-11-06

### Hinzugefügt
- **Die Karte kommt jetzt von einer eigenen View** statt als statische Datei: jede Anfrage
  steht mit Browser-Kennung, URL und Cache-Header in der Debug-Spur, und die Antwort trägt
  `Cache-Control: no-store`. Damit ist nachweisbar, welche Fassung Tablet und Rechner laden.

## 0.59.18b1 – 2026-11-06

### Hinzugefügt
- **Debug-Spur der Karte:** Die Karte meldet per WebSocket, was sie tut – geladene Version,
  Klick auf „Sichern"/„Diagnose"/„Fehler melden", Antworten, Fehler. Abrufbar über
  `raumklima/trace/list` und sichtbar im Entscheidungsprotokoll („Debug: …"). Nötig, weil auf
  dem iPad keine Browser-Konsole erreichbar ist.
- **Karten-URL mit Inhalts-Hash** (`?v=0.59.18b1-<hash>`): Safari hielt die alte Karte trotz
  Versionswechsel; mit geändertem Hash ist es für den Browser eine andere Datei.

## 0.59.17b1 – 2026-11-06

### Behoben
- **`raumklima/export/link` warf einen Fehler**, weil das Protokoll über `hub.log.add(...)`
  geschrieben wird, nicht über `hub.log(...)`. Der Befehl antwortete mit `unknown_error`, die
  Karte bekam keinen Link. Jetzt kommt die Antwort mit Link, Datei und Protokollzeile.

## 0.59.16b1 – 2026-11-06

### Behoben
- **Der neue Befehl `raumklima/export/link` war nicht registriert** – die Karte fragte ihn an,
  Home Assistant antwortete `unknown_command`, deshalb blieb „Sichern" ohne Wirkung. Jetzt ist er
  in `async_register_websocket` eingetragen (0.59.15b1 war unvollständig).

## 0.59.15b1 – 2026-11-06

### Behoben
- **Sichern und Diagnose auf iPad und in der HA-App: jetzt als Datei vom Server.** Statt eines
  Downloads aus dem Browser (den iOS und WKWebView verwerfen) erzeugt die Integration die Datei
  selbst und gibt einen echten Link aus: `/api/raumklima/export/<Zufallsschlüssel>`, 15 Minuten
  gültig, mit `Content-Disposition: attachment`. Der Dialog hat damit „Datei laden" als ersten
  Knopf; ein Tipp darauf speichert überall.
- **Statuszeile im Dialog** statt Toast hinter dem abdunkelnden Hintergrund.
- **Kein Neuzeichnen, solange der Dialog offen ist** – ein Tipp auf „Teilen"/„Kopieren" ging
  vorher verloren, wenn parallel ein Sensorwert eintraf.
- **Kopieren mit Rückfall:** wenn `navigator.clipboard` blockt, wird das Textfeld markiert und
  `execCommand("copy")` versucht; erst danach die ehrliche Meldung.
- **Protokollspur:** „Sicherung bereitgestellt" im Entscheidungsprotokoll – daran ist ablesbar,
  ob die Karte im Browser den neuen Stand geladen hat.

## 0.59.14b1 – 2026-11-06

### Behoben
- **„Sichern", „Diagnose" und „Fehler melden" gingen auf iPad und in der HA-App nicht.**
  Ursache: Der Download startete erst nach einem `await`, und ein Tab wurde per `link.click()`
  geöffnet – beides verwerfen iPad-Safari und die HA-App (WKWebView) ohne Rückmeldung.
  Jetzt öffnet sich ein Dialog mit echten Knöpfen: **Teilen** (iPhone/iPad: „In Dateien sichern"),
  **Speichern** (Rechner), **Kopieren** und bei Fehlermeldungen ein echter **GitHub-Link** samt
  Textfeld zum Prüfen. „Kopieren" meldet ehrlich, wenn der Browser es blockt, statt es zu behaupten.

## 0.59.13b1 – 2026-11-06

### Behoben
- **Schimmelschutz heizte gegen jede Vernunft.** Mit 24-h-Mittel und kaltem Wetter forderte die
  Rechnung nachts 24–25 °C (Küche und Bad standen live bei 24,5 °C, Ventile 94–100 %, ohne das Ziel
  zu erreichen) und löste dadurch Fehlalarme „Raum wird nicht warm" aus. Jetzt gelten drei Bremsen:
  - **Offenes Fenster hat Vorrang** – kein Feuchte-Boden, und die Lüftzeit zählt nicht ins Mittel.
  - **Stundenbudget** – angehoben wird erst ab 2 h kritischer Wandfeuchte in 24 h; eine Stunde
    nach dem Duschen ist kein Schimmelrisiko.
  - **Deckel** – höchstens Wunsch + 2,5 K, nachts +1,5 K; je Raum einstellbar (0–6 K, 0 = aus).
    Greift der Deckel, rät die Karte zum Lüften statt zu heizen.
- „Raum wird nicht warm" wird bei gedeckeltem Feuchte-Boden nicht mehr gemeldet (kein Gerätefehler).

### Hinzugefügt
- Attribute `mold_capped` und `mold_risk_hours` (Stunden kritischer Wandfeuchte in 24 h).
- Einstellung „Höchstens anheben um" beim Schimmelschutz.
Sammelstelle für den nächsten Release. Hier landen Änderungen, bis sie zu einer Version
zusammengefasst werden – nicht jede Korrektur braucht sofort ein Release.

### Behoben
- **Ventilstellung nach dem Start schneller da** (#15): Der Sensor wurde bisher erst beim nächsten
  Abgleich (bis 10 Minuten) nachgetragen. Jetzt wird in den ersten 20 Minuten alle 30 Sekunden
  nachgesehen und der Nachlauf beendet sich selbst, sobald der Sensor gefunden ist.

## 0.59.12b1 – 2026-11-05

### Hinzugefügt
- **Feuchtequelle erkennen:** steigt die Feuchte über Stunden trotz laufender Heizung, meldet Raumklima
  das – und unterscheidet „lüften statt heizen" (Außenluft trockener) von „Feuchtequelle im Raum"
  (Außenluft feuchter: Wäsche, Duschen, viele Personen). Neue Meldeart „Feuchtequelle" zum Abwählen.
- **Bauart je Raum:** Außenecke / Außenwand / innenliegend / wie die Wohnung. Bestimmt den fRsi-Wert und
  damit, wie viel Schimmelschutz ein Raum wirklich braucht.
- **Anzeige des Zuschlags:** „Schimmelschutz +2,0 °C auf 22,5 °C · 63 % Feuchte im Tagesmittel" am Raum.
- **Funkbefehle je Thermostat gezählt** (gesamt und Wiederholungen), im Wochenbericht in der
  Zuverlässigkeitstabelle – macht Batterie- und Funkprobleme sichtbar.
- **Benutzername im Protokoll:** Änderungen von Hand nennen den Home-Assistant-Benutzer.
- Neue Attribute `mold_min`, `mold_rh`, `rf_sent`, `rf_retries`.

### Hinweis
- Vorabversion: erscheint in HACS nur mit „Beta-Versionen anzeigen".

### Hinzugefügt
- **Beta-Kanal:** Versionen mit `b` am Ende (`0.60.0b1`) erscheinen als Vorabversion ohne PDFs;
  stabile Releases bleiben unverändert und weiterhin „latest". In HACS über **Neu herunterladen →
  Beta-Versionen anzeigen** wählbar (Doku in allen drei Sprachen).
- Version auf Seite 1 der deutschen und französischen Doku-Startseite (fehlte dort ganz; ein Test
  verhindert jetzt, dass die vier Startseiten auseinanderlaufen).

### Hinzugefügt
- Übersicht nennt den Grund, wenn eine Regel das Ziel setzt: „Schimmel 22,5° · Wunsch 19,0°"
  statt „Ziel 22,5° · Wunsch 19,0°" (auch Zeitplan, Boost, Ruhezeit, Abwesenheit, Vorheizen,
  Sonne, Frost, Ventilpflege, Heizpause) – mit EN/FR-Texten.

## 0.59.11 – 2026-11-05

### Behoben
- **Schimmelschutz heizte zu stark und zappelte.** Seit 0.59.5 gilt der Feuchte-Boden überall – gerechnet
  wurde aber mit der *momentanen* Feuchte. Eine Nacht im Schlafzimmer oder Kochen in der Küche hob das Ziel
  um mehrere Grad (im Test: Schlafzimmer mit Wunsch 14,5 °C auf 21,7 °C, Küche auf 22,9 °C), und alle 10
  Minuten ging ein neuer Zehntelgrad-Sollwert ans Thermostat (Funk, Batterie). Jetzt zählt das **Mittel des
  Wasserdampfs der letzten 24 Stunden** – DIN 4108-2 und Schimmelwachstum hängen an anhaltender Feuchte, nicht
  an Spitzen. Der Boden liegt in 0,5-°C-Schritten, steigt sofort und sinkt erst mit 0,7 °C Abstand. Der
  Verlauf übersteht Neustarts. Mit echten Daten der Testwohnung: Schlafzimmer 21,5 → 17,0 °C, Küche 22,3 →
  21,5 °C; dauerhaft feuchte Räume bleiben geschützt.

## 0.59.10 – 2026-11-05

### Behoben
- **Raumtyp ließ sich nicht wirksam ändern.** Bisher blieben die alten Absenkwerte stehen, weil sie beim
  Speichern der Einstellungen als feste Werte abgelegt worden waren – der neue Typ änderte nur die
  Wunschtemperatur, wenn sie leer war. Jetzt gilt beim Typwechsel: Werte, die noch dem Standard des alten
  Typs entsprechen, werden auf den neuen Standard umgestellt; selbst eingetragene Werte bleiben erhalten.
  Gilt für die Karte und für den Optionen-Dialog der Integration.

## 0.59.9 – 2026-11-05

### Neu
- **Vier neue Raumtypen** (Auswahl beim Raum): **Arbeitszimmer**, **Gästezimmer**, **Flur**, **Sportzimmer**.
  Jeder bringt eigene Standardwerte für Wunschtemperatur, Absenkung, Mindesttemperatur beim Lüften und
  Feuchte-Grenze mit – Tabelle in der Referenz (de/en/fr), Quellen Umweltbundesamt und co2online/DIN 4108-2.
  Arbeitszimmer, Gästezimmer, Flur und Sportzimmer senken außerdem automatisch ab, wenn sie leer sind
  (mit mmWave-Melder), weil man dort nicht dauerhaft sitzt.

## 0.59.8 – 2026-11-05

### Neu
- **Außerhalb der Zeitfenster (Issue #10):** Wer nur Heizphasen einträgt, konnte bisher nicht sagen, was
  dazwischen gilt – es war immer die Wunschtemperatur. Jetzt wählbar je Raum: *Wunschtemperatur*
  (Standard, wie bisher), *kurz weg*, *länger weg* oder *Sicherung* (Frostschutz). Vorheizen vor einem
  Fenster bleibt bestehen, der Schimmelschutz bleibt Boden darüber.

## 0.59.7 – 2026-11-05

### Behoben
- **„Bitte lüften – Luftfeuchte 39 %“ bei trockener Luft:** Auslöser war Feinstaub (PM2,5), im Text stand aber
  die Feuchte-Vorlage – es gab schlicht keine Feinstaub-Meldung. Jetzt heißt es „🫧 Wohnzimmer: Luft belastet –
  Feinstaub 46 µg/m³ …“.
- **Feinstaub löst nicht mehr sofort aus:** Wie bei der Feuchte gilt eine **Verzögerung von 15 Minuten** über
  35 µg/m³. Eine Kerze, ein Toaster oder Staubsaugen reicht damit nicht mehr für einen Push; echter Rauch schon.

## 0.59.6 – 2026-11-05

### Neu
- **Mindestdauer Lüften einstellbar:** Standard bleibt die Automatik (60 % der empfohlenen Dauer,
  mindestens 4 Minuten), jetzt aber je Raum fest wählbar (0–30 min) – *Einstellungen → Raum → Lüften*.
- **Schimmelschutz in drei Stufen:** *Streng nach DIN* (Standard, darf über den Wunsch anheben),
  *Nur bis Wunsch* (hebt höchstens bis zur Wunschtemperatur) und *Aus* (kein Feuchte-Boden).
  Jede Stufe erklärt sich in der Einstellung selbst; die Doku (de/en/fr) beschreibt sie.

## 0.59.5 – 2026-11-05

### Behoben
- **Lüften war zu schnell „fertig":** Bisher galt die Luft nach zwei Minuten als ausgetauscht, sobald
  der Fühler unter der Feuchtegrenze lag – im Bad reichte ein kurzes Kippen. Jetzt gilt zusätzlich eine
  **Mindestdauer von 60 % der empfohlenen Lüftdauer (mindestens 4 Minuten)**, die sich nach der
  Außentemperatur richtet: bei 10 min Empfehlung sind es 6 min. Der Kälteschutz bricht weiterhin
  früher ab, wenn der Raum auskühlt.

## 0.59.4 – 2026-11-05

### Intern (Auswertung)
- **Schattenmodus Ventilöffnung:** Raumklima berechnet jetzt zusätzlich einen Soll-Öffnungsgrad
  (P-Regelung auf die Regelabweichung, Totzone 0,15 K, Mindesthub 8 %). Der Wert wird **nie
  geschrieben** – er steht nur in der Diagnose (`valve_shadow`) und als Tagesmittel in den
  Raumstatistiken (`valve_calc_pct_s`), damit sich berechnete und gemeldete Stellung vergleichen
  lassen. Keine Einstellung, keine Anzeige in der Karte. Grundlage für die Entscheidung, ob eine
  eigene Ventilregelung trägt (Roadmap: direkte/stufenlose Ventilsteuerung).

## 0.59.3 – 2026-11-05

### Dokumentation
- **Eigene Anleitung „Sprachsteuerung"** (de/en/fr, auch im Handbuch-PDF): welche Pipeline nötig ist,
  wie man einen KI-Agenten anbindet, wie „Raumklima" in der KI-Integration freigeschaltet wird, was man
  fragen kann – und warum Alexa, Siri und Google-Home-Lautsprecher diesen Weg nicht nutzen können.
  *(0.59.2 und 0.59.3 sind zusammen veröffentlicht – die Dokumentation steckt mit in 0.59.3.)*

### Behoben
- **Anwesenheit (#29):** Meldet keines der eingetragenen Handys einen Standort, steht das jetzt im
  Protokoll („Keine Ortung verfügbar – Standortfreigabe, VPN oder Zonenradius prüfen"), statt still
  abzusenken. Außerdem zählt ein direkt eingetragener Gerätetracker als Bewohner.

## 0.59.1 – 2026-11-05

### Behoben
- **Sprachsteuerung blieb auf Home Assistant 2026.10 stumm:** Werkzeug-Parameter werden dort mit
  ``probatio`` statt ``voluptuous`` beschrieben – die Werkzeuge wurden dadurch nicht nutzbar. Jetzt
  laufen beide Varianten, geprüft gegen 2026.2 und 2026.10.

## 0.59.0 – 2026-11-05

### Neu
- **Sprachsteuerung:** Mit einem KI-Agenten im Assistenten (ChatGPT, Google, Anthropic, Ollama) kennt
  Raumklima jetzt Werkzeuge für Räume und Werte – „Wie warm ist es im Bad?", „Muss ich im Wohnzimmer
  lüften?", „Stell das Schlafzimmer auf 18 Grad". Die Werkzeuge erscheinen automatisch in jeder
  Pipeline mit KI-Agent, ohne Einstellung. Anleitung in der Bedienung (de/en/fr).

### Sicherheit
- **Kein E-Mail-Login ohne Verschlüsselung:** Bisher wurde auch bei „ohne Verschlüsselung“ angemeldet –
  Benutzername, Passwort und der PDF-Bericht gingen dann im Klartext über die Leitung. Jetzt wird die
  Anmeldung in diesem Fall verweigert (mit Hinweis auf STARTTLS/SSL); der Prüfdialog meldet es ebenso.
  Zustandslose Relays im eigenen Netz (ohne Anmeldung) bleiben möglich.
- **Link-Schlüssel für PDF-Berichte laufen ab:** Ein geteilter Link gilt 30 Tage. Danach liefert er
  „nicht gefunden“; beim nächsten Teilen wird ein neuer Schlüssel erzeugt. Der Schlüssel verschwindet
  weiterhin mit dem Bericht selbst.

### Pflege
- **Dependabot** für Actions, Testumgebung und Karten-Abhängigkeiten (`.github/dependabot.yml`).
- **Wöchentlicher Test gegen die neueste Home-Assistant-Version** (`HA neueste Version`) – Brüche und
  Abkündigungen fallen vor dem Release auf, nicht danach.
- Alle Actions sind jetzt auf feste Commits gepinnt (vorher gemischt: Tags und Commits).
- Entwicklungsreste entfernt: `apply_fe.py` und `scripts/preview_deploy.sh` (enthielt interne Adressen).

### Behoben
- **Kopfzeile der Raumkarte bleibt an ihrem Platz:** Ein langer Raumname schob bisher das
  Fenstersymbol, den Status und den Boost-Knopf aus der Zeile (im Betrieb mit einem langen Raumnamen und
  zweizeiligem Status aufgetreten). Jetzt kürzt der Name mit „…“ (vollständiger Name als Tooltip), Fenstersymbol
  und Boost bleiben rechts daneben, und der Status steht in einer eigenen Zeile darunter – lange Texte
  brechen im Chip um, statt zu verrutschen.
- **Ventilstellung aus einer anderen Wohnung:** Bei mehreren Wohnungen in einer Installation konnte ein
  Raum die Ventilstellung eines gleichnamigen Geräts der anderen Wohnung anzeigen (ein Raum zeigte den
  Sensor des gleichnamigen Raums der anderen Wohnung). Jetzt muss der Sensor im selben Bereich liegen; passt keiner,
  bleibt die Anzeige leer – so wie bei Thermostaten, die keine Stellung melden (z. B. RWE VRCC).
- **Schimmelschutz gilt jetzt überall:** Zeitplan und Ruhezeit konnten einen feuchten Raum unter die
  Feuchte-Mindesttemperatur drücken, obwohl die Doku zusagt, dass der Schimmelschutz vorrangig bleibt.
  Jetzt greift er als Boden für jeden Zweig (außer Boost, Ventilpflege und Heizpause) und erscheint im
  Protokoll als Grund „Schimmelschutz – mindestens … nötig“. Auch in der Karte sichtbar.
- **Anzeigen verändern die Regelung nicht mehr:** `effective_target` und andere Anzeigen lesen den Plan
  nur noch (kein Boost-Ablauf mit Speichern, keine Frost-/Sonnen-Hysterese beim Anzeigen).
- **Wunschtemperatur aus der Karte wirkte nicht (#22):** Der neue Wert landete nur in den Einstellungen,
  der laufende Regler behielt seinen alten Sollwert – der Raum heizte weiter auf die alte Temperatur, bis
  er neu geladen wurde. Jetzt übernimmt der Raum den Wert sofort (auch wenn der Raumtyp den Standardwert
  mitbringt). Nebenbei: das Protokoll zeigte bei Änderungen „22,0 → 22,0", weil es den alten Wert erst
  nach dem Speichern las – jetzt steht dort der echte alte Wert.

## 0.58.0 – 2026-11-05

### Behoben
- **„Sichern" hat keine Datei erzeugt:** Der Download lief als Blob-Link, den manche Browser und die
  Home-Assistant-App stillschweigend verwerfen. Jetzt öffnet sich zuerst ein echter Speichern-Dialog
  (Chrome/Edge), sonst der klassische Download – und die Sicherung landet zusätzlich in der
  Zwischenablage. Jeder Schritt meldet sich in der Karte.
- **„Fehler melden" tat nichts:** Der Knopf rief `window.open` auf, was die Home-Assistant-App (Webview)
  verwirft – es passierte scheinbar nichts. Jetzt wird ein echter Link geöffnet und die Issue-Vorlage
  zusätzlich in die Zwischenablage gelegt, mit kurzer Rückmeldung in der Karte.
- **Reihenfolge im Dashboard ging verloren:** Ältere Layouts haben Raumnamen statt Entitäts-IDs gespeichert –
  die gepflegte Reihenfolge wurde dadurch ignoriert und es blieb alphabetisch. Beide Formen werden jetzt
  erkannt, damit „Schlafzimmer nach oben" auch ankommt.
- **Protokoll nennt Einstellungen beim Namen:** Statt `comfort_temperature: 22,0 → 20,5` steht dort jetzt
  „Wunschtemperatur: 22,0 → 20,5" (gleiches für Absenkung, Zeitplan, Präsenzmelder und weitere).
- **Wohnung hielt sich nach einem Neustart 30 Minuten für bewohnt:** Präsenzmelder, die beim Start noch
  „an" standen (wiederhergestellter Zustand), zählten als „gerade jemand gesehen" – der Nachlauf lief an,
  obwohl niemand da war. Jetzt zählt der Nachlauf nur, wenn ein Melder seit dem Start tatsächlich „an"
  gemeldet hat. Handy-Ortung ist davon unberührt.

## 0.57.0 – 2026-11-05

### Neu
- **Eigene Wetterstation als Außentemperatur-Quelle (#21):** In *Einstellungen → Heizsaison & Heizgrenze*
  lässt sich unter „Außentemperatur von" ein eigener Fühler wählen; die Vorhersage kommt weiterhin vom
  Wetterdienst. Fällt der Fühler aus oder ist er nicht verfügbar, gilt automatisch wieder der Wetterdienst.

### Behoben
- **Karte zeigte „Konfigurationsfehler" (#19):** Der neue Knopf „Wiederherstellen" hat das Datei-Feld über
  eine Elementliste statt über das Element selbst gesucht – dadurch brach das Zeichnen der
  Einstellungen-Karte ab, sobald 0.56.0 installiert war. Behoben, dazu ein Rauchtest, der die
  Einstellungen-Karte ohne Browser zeichnet (`frontend/test/settings-smoke.test.mjs`).

## 0.56.0 – 2026-11-05

### Neu
- **Einrichtungs-Checkliste:** Einstellungen → Erste Schritte zeigt, welche Angaben noch fehlen
  (Bewohner, Empfänger, Wetterquelle, Raum mit Thermostat, Fensterkontakt, Zeitplan) und wo man sie
  einträgt; zwei optionale Punkte (Präsenzmelder, Sturmschwelle) sind als optional markiert.
- **Einstellungen sichern und wiederherstellen:** Kopfzeile der Einstellungen → Sichern schreibt alle
  Einstellungen als JSON-Datei (ohne Zugangsdaten), Wiederherstellen spielt sie zurück. Räume werden über
  ihren Namen zugeordnet, unbekannte Räume und fremde Felder werden gemeldet bzw. ignoriert.

### Behoben
- **Falsche Meldung „Empfänger fehlt“ (#19):** Die Gesundheitsprüfung hat Empfänger nur als Dienst
  gesucht – notify-Entitäten (Alexa Devices) galten dadurch als verschwunden, obwohl sie vorhanden
  waren. Jetzt zählen Dienste **und** Entitäten; gemeldet wird nur, was wirklich fehlt oder nicht
  verfügbar ist. Die Warnstufe heißt außerdem „Warnung“ statt „Prüfen“ – das Label sah aus wie ein
  Knopf, auf den man tippen kann.

### Geprüft
- **Home Assistant 2026.11.0:** Integration startet, Entitäten werden angelegt, WebSocket-Befehle und
  Karte funktionieren, keine Fehler im Log. Die neuen Abkündigungen (step_id in Flow-Ergebnissen,
  DeviceInfo als Dataclass, Config-Entry-Funktionen ohne Rückgabewert) betreffen uns nicht.

## 0.55.0 – 2026-11-04

### Neu
- **Zeitplan von einem anderen Raum übernehmen:** Unter Einstellungen → Zeitplan gibt es je Raum die Zeile
  Zeitplan von. Damit nutzt ein Raum die Zeitfenster eines anderen (z. B. Wohnzimmer und Esszimmer abends
  gleich) – gepflegt wird an einer Stelle, Änderungen gelten überall mit. Geteilt wird nur eine Ebene,
  damit keine Ketten oder Ringe entstehen; ohne Auswahl gilt wie bisher der eigene Zeitplan.
- **Nutzung lernen (Vorschlag):** Räume mit Präsenzmelder zählen je Wochentag und Viertelstunde, wann sie
  belegt sind (vier Wochen, nur ja/nein – kein Personenbezug). Im Reiter Lernen steht daraus ein Vorschlag
  wie Mo–Fr 08:00–11:30. Angewendet wird nichts automatisch: ein Zeitfenster legst du selbst an.

## 0.54.0 – 2026-11-04

### Neu
- **Sturm- und Regenwarnung:** Raumklima liest Böen und Regen aus der Wettervorhersage der Wohnung. Ist für
  die nächsten sechs Stunden Sturm (Standard ab 70 km/h) oder Starkregen (ab 8 mm/h) angekündigt **und**
  steht ein Fenster offen, kommt eine Warnung mit Uhrzeit und den betroffenen Räumen – einmal pro Ereignis
  und auch in der Ruhezeit, weil sie dringend ist. Schwellen und Schalter: Einstellungen → Allgemein →
  Benachrichtigung.
- **Bettzeit aus dem Präsenzmelder:** Ist ein Raum vom Typ Schlafzimmer mit eigenem Präsenzmelder 20 Minuten
  belegt, gilt die Bettzeit als erkannt (Ruhezeit, gelernte Schlafenszeit) – zusätzlich zu Lichtsignalen und
  Nachtlüften. Der Melder entscheidet also, ob die Funktion genutzt wird.

## 0.53.0 – 2026-11-04

### Neu
- **Sprachsteuerung (Assist) findet die Räume:** Beim Start werden die Raum-Entität und alle Sensoren und
  Schalter des Raums dem Home-Assistant-Bereich zugeordnet (Thermostat → Fensterkontakt → Fühler →
  Bereich mit gleichem Namen). Damit funktionieren „Wohnzimmer auf 22 Grad" und „Wie warm ist es im Bad?"
  ohne Zusatzarbeit. Eine selbst gesetzte Zuordnung wird **nie** überschrieben.

## 0.52.0 – 2026-11-04

### Neu
- **Knopf „Fehler melden"** in den Einstellungen: öffnet ein neues GitHub-Issue mit Raumklima-Version,
  Home-Assistant-Version, Anzahl der Räume und den Thermostat-Modellen. Bewusst **ohne** Raumnamen,
  Entitäts-IDs oder Zugangsdaten; im Text steht, wie die Diagnose-Datei angehängt wird.
- **Issue-Vorlagen** im Repository: „Fehler melden", „Idee oder Wunsch" und „Mein Thermostat läuft /
  läuft nicht" (Erfahrungsbericht für die Geräteliste).
- **Probleme in den HA-Reparaturen:** schwache Batterie, nicht erreichbarer Fühler und nicht erreichbares
  Thermostat erscheinen zusätzlich unter *Einstellungen → Reparaturen* – je Raum eine Meldung, die
  verschwindet, sobald die Ursache behoben ist.

## 0.51.4 – 2026-11-04

### Geändert
- **Kachel heißt „Ventil" statt „Ventil Ø"**, wenn nur ein Gerät eine Ventilstellung liefert. Das „Ø"
  erscheint erst, wenn wirklich mehrere Ventile gemittelt werden – sonst wirkte der Wert wie ein
  Durchschnitt, obwohl er der Einzelwert ist (Issue #11).

## 0.51.3 – 2026-11-04

### Behoben
- **Falsches „Ventil": Rollladen-Position wurde als Ventilstellung angezeigt** (Issue #11). Die
  automatische Suche akzeptierte jedes Prozent-Signal mit „position" im Namen und erwischte deshalb
  den Positionsgeber eines Rollladenaktors im selben Raum. Jetzt zählt „position" nur noch bei einem
  Gerät, das auch ein Thermostat ist; zuerst werden die Heizkörper-Thermostate des Raums durchsucht.
  Lieber keine Ventilanzeige als eine fremde.

## 0.51.2 – 2026-11-04

### Behoben
- **„Fertig gelüftet" nannte nach CO₂-Lüften wieder die Luftfeuchte:** Der Grund wurde nur im
  Arbeitsspeicher gemerkt. Lag zwischen „bitte lüften" und dem Öffnen des Fensters ein Neustart, war
  er weg. Jetzt wird der Grund beim Öffnen aus den Messwerten bestimmt (Feinstaub vor CO₂ vor Feuchte)
  und im Raum gespeichert; der Text passt auch nach einem Neustart.
- **Unlesbare Einstellungen bei Themes mit transparentem Kartenhintergrund** (z. B. Frosted Glass):
  An drei Stellen wurden Vorder- und Hintergrundfarbe getauscht – bei `card-background-color:
  transparent` wurde die Schrift dadurch unsichtbar (aktiver Reiter, Knopf „Geräte & Technik ändern",
  Speicher-Meldung). Diese Elemente nutzen jetzt eigene, immer lesbare Farben.

## 0.51.1 – 2026-11-04

### Neu
- **notify-Entitäten als Empfänger** (Issue #19): Die offizielle Alexa-Devices-Integration stellt keine
  `notify.<dienst>`-Dienste bereit, sondern `notify.<name>`-**Entitäten** (z. B. „…_durchsagen",
  „…_sprechen"). Beide Formen stehen jetzt in der Empfänger-Auswahl; Entitäten werden über
  `notify.send_message` angesprochen, echte Dienste wie bisher. Damit sind Alexa Devices und Sonos
  ohne Zusatzintegration nutzbar.

## 0.51.0 – 2026-11-04

### Behoben
- **„Gäste gelten für" zeigte leere Chips:** Die Raumliste kam aus dem falschen Datenbestand
  (Konfigurationsliste statt Räume der Wohnung) und enthielt weder Name noch Kennung – dadurch
  blieben alle elf Chips leer und ließen sich keinem Raum zuordnen. Jetzt erscheinen die Räume
  der aktuellen Wohnung mit Namen; gespeichert wird die Raum-Kennung, die die Zentrale erwartet.

## 0.50.1 – 2026-11-04

### Geändert
- Der Filter greift nur für **Lüft-Hinweise** (bitte lüften / schließen / fertig). Berichte,
  Heizsaison- und Ausfallmeldungen kommen weiterhin auch bei Abwesenheit an.

## 0.50.0 – 2026-11-04

### Neu
- **Hinweise nur an anwesende Personen** (Allgemein → Benachrichtigung, Standard an): „Bitte lüften",
  „Fenster schließen" und „fertig gelüftet" gehen nur noch an Empfänger, deren Person laut Ortung
  zu Hause ist. Wer 80 km entfernt ist, wird nicht mehr gefragt, ob er lüften kann.
  Dringende Meldungen (Fenster offen bei Abwesenheit, Frost, Thermostat-Ausfall) gehen weiter an alle.
  Nicht zuordenbare Empfänger (Gruppen, E-Mail, Fremddienste) bleiben unberührt.
  Ist niemand der Empfänger zu Hause, wird der Hinweis übersprungen und im Protokoll vermerkt.

## 0.49.5 – 2026-11-04

### Geändert
- Die Option *Nur wenn jemand im Raum war* erscheint nur noch bei Räumen, denen ein Präsenzmelder
  zugeordnet ist. Ohne Melder war sie wirkungslos und damit nur verwirrend.

## 0.49.4 – 2026-11-04

### Behoben
- **„Fertig gelüftet" nannte den falschen Grund:** Wurde wegen CO₂ gelüftet, kam hinterher
  „Luftfeuchte wieder …". Jetzt richtet sich der Text nach dem Grund (CO₂, Feinstaub, Feuchte).
- **Keine „bitte lüften"-Hinweise in leeren Räumen:** Neue Option *Lüften ohne Erinnerung → Nur wenn
  jemand im Raum war* (Standard an). Hat der Raum einen Präsenzmelder und ist nachweislich leer,
  entfällt der Hinweis — unabhängig davon, was die Wohnungs-Anwesenheit sagt.

## 0.49.3 – 2026-11-04

### Behoben
- **Zwei Raumkarten verschwanden komplett** (zwei Räume mit Batteriesensor): Der Batterie-Hinweis
  aus 0.49.0 nutzte `esc`, das in dieser Datei nicht importiert war. Nur Räume **mit** einem
  Batteriesensor liefen in den Fehler – deshalb fehlten genau diese beiden Karten, auf allen Geräten.
- **Eine Karte kann nicht mehr still verschwinden:** Schlägt das Zeichnen fehl, zeigt die Karte jetzt
  eine sichtbare Fehlermeldung mit Ursache, statt leer zu bleiben.

### Tests
- Neuer Rauchtest für die Raumkarte (Batterie, Überwachungsraum, offenes Fenster) – hätte diesen
  Fehler gefunden.

## 0.49.2 – 2026-11-04

### Behoben
- **Lange Statuszeilen liefen aus der Karte heraus** (iPad und Handy). Der Zusatz „Thermostat 17,0°
  (Abgleich -0,9°)" saß im Status-Chip und schob ihn über den Rand. Er steht jetzt in einer eigenen,
  gekürzten Zeile darunter (mit Tooltip), die Kopfzeile darf umbrechen, und der Chip wird bei sehr
  schmalen Karten beschnitten statt herauszuragen.

## 0.49.1 – 2026-11-04

### Behoben
- **Klick auf die Messwert-Kacheln öffnet den Verlauf.** Bisher führte „Feuchte" auf den
  Benachrichtigungs-Schalter (deshalb die An/Aus-Karte), CO₂, Feinstaub, Ventil, Außen und
  Heizkörper reagierten gar nicht. Jetzt öffnet jede Kachel die zugehörige Sensor-Entität mit
  Verlauf – bei fehlendem Sensor bleibt die Kachel ohne Klick.

## 0.49.0 – 2026-11-04

### Neu
- **Zeitplan überschreiben (Wunsch aus der Community):** Stellst du die Temperatur von Hand – in der
  Karte, in Home Assistant oder über Alexa –, pausiert ein laufender Zeitplan für eine einstellbare
  Zeit (Standard 120 Minuten), danach gilt wieder der Plan. Einstellung je Raum unter *Zeitplan →
  Zeitplan überschreiben*, 0 schaltet es aus. Damit braucht es keine simulierte Anwesenheit mehr.
- **Batteriestand auf der Raumkarte:** Ist eine Batterie im Raum unter 20 %, zeigt die Karte ein
  Warnsymbol mit Prozentwert (schwächstes Gerät). Die Meldung nennt zusätzlich das Gerät.

## 0.48.2 – 2026-11-04

### Behoben
- **Räume, deren Wunsch schon auf dem Absenkwert liegt, melden jetzt „abgesenkt".** Bisher stand dort
  „erreicht", weil es rechnerisch nichts zu senken gab – bei Abwesenheit war das missverständlich
  (z. B. Sportzimmer 18,0 °C Wunsch = 18,0 °C Absenkung). Zeitplanfenster haben weiter Vorrang.

## 0.48.1 – 2026-11-04

### Behoben
- **Diagnose unterscheidet Dienste und Entitäten:** `notify.*`-Empfänger stehen nicht in `hass.states`
  und wurden deshalb als „fehlt" gelistet, obwohl der Dienst einwandfrei funktioniert. Jetzt gibt es
  einen eigenen Block `services` mit `exists`-Prüfung; „nicht verfügbar" meint nur noch echte
  Entitäten. Zusätzlich getrennt: `unknown` (unbenutzte Knöpfe, Kalibrier-Entitäten).

## 0.48.0 – 2026-11-04

### Neu
- **„Gäste da" gilt nur für ausgewählte Räume** (#17): In den Einstellungen der Wohnung stehen unter
  dem Schalter alle Räume als Chips – ausgewählt werden nur die, die bei Besuch nicht abgesenkt
  werden. Ohne Auswahl gilt sie wie bisher für die ganze Wohnung. Die Liste kommt dynamisch aus den
  angelegten Räumen.
- **Schnellere Abfrage je Raum** (#11): Option für träge Geräte wie Homematic – Raumklima fragt das
  Thermostat dann alle zwei Minuten aktiv ab, statt auf die nächste Meldung zu warten. Kostet Funk
  und Batterie, deshalb standardmäßig aus.

### Behoben
- **Fehlender Empfänger wird erkannt:** Zeigt die Empfängerliste auf einen `notify`-Dienst, den es
  nicht mehr gibt, erscheint ein Hinweis „Empfänger fehlt" – vorher liefen Meldungen still ins Leere.

## 0.47.0 – 2026-11-03

### Neu
- **Lüften ohne Erinnerung** – drei Wege, dem alle-fünf-Minuten-„bitte schließen" zu entkommen:
  - **Dauerlüftung ab X Minuten** (Standard 20, 0 = aus): danach keine Pushs mehr, Status wechselt
    auf „Dauerlüftung", die Heizung bleibt aus, bis das Fenster zu ist. Optional eine einzige stille
    Erinnerung nach 90 Minuten.
  - **Lüftfenster je Raum**: frei definierbare Zeiten (mit Wochentagen), in denen nicht erinnert wird –
    z. B. Training morgens von 04:45 bis 06:30.
  - **Gewohntes Lüften lernen**: Öffnungsvorgänge werden mit Wochentag und Viertelstunde gemerkt;
    dreimal im gleichen Raster innerhalb von vier Wochen gilt als gewohnt, dort wird nicht mehr
    erinnert. Sichtbar in den Einstellungen, nie automatisch scharf geschaltet.
- In der Raumkarte steht bei diesen Fällen jetzt „Dauerlüftung", „Gewohntes Lüften" oder
  „Geplantes Lüften" statt „bitte schließen".

### Behoben
- **Snooze und „Stumm" überleben einen Neustart** – vorher kamen die Erinnerungen nach einem
  HA-Neustart sofort wieder.

## 0.46.2 – 2026-11-03

### Behoben
- **Wetterbericht im Verlauf nahm irgendeinen Anbieter.** Die Übersicht folgte ab 0.46.1 der
  Einstellung, der Wetterbericht im Reiter *Verlauf* aber noch der ersten gefundenen Wetter-Entität –
  auf einem System mit mehreren Anbietern war das eine ganz andere Quelle. Jetzt gilt auch dort die
  Wetterquelle der Wohnung.

## 0.46.1 – 2026-11-03

### Behoben
- **Die Übersicht folgt jetzt der Wetterquelle aus den Einstellungen.** Bisher zeigte sie die
  Wetter-Entität, die beim Anlegen des Dashboards hineingeschrieben wurde – eine spätere Änderung
  unter *Einstellungen → Wetterquelle* kam dort nie an. Jetzt gilt die Einstellung der Wohnung,
  die Kopie im Dashboard dient nur noch als Rückfall.
- **Keine falsche Warnung „Thermostat arbeitet nach eigenem Zeitplan“ mehr** bei Geräten, die
  Raumklima selbst über `comfort_temperature` ansteuert (Tuya TRV602Z): Deren Systemmodus heißt
  zwar „auto“, regelt aber auf unsere Zahl. Vorher stand dadurch in jedem Raum „Problem“.

### Dokumentation
- Diagnose-Datei beschrieben (FAQ und Handbuch, de/en/fr).

## 0.46.0 – 2026-11-03

### Neu
- **Diagnose-Datei mit allem, was zur Fehlersuche nötig ist.** Erreichbar über
  *Einstellungen → Geräte → Raumklima → Diagnose herunterladen* und über den neuen Knopf
  **Diagnose** in der Karte. Inhalt: Umgebung (Versionen, Sprache, Zeitzone), Wohnungs-Zustand,
  jeder Raum mit Konfiguration und Live-Werten, die **Rohzustände aller beteiligten Entitäten**
  inklusive Attribute, die letzten 50 Entscheidungen und die letzten 500 Log-Zeilen der
  Integration. Zugangsdaten und Koordinaten werden redigiert – auch im Fließtext.
- **Log-Ringpuffer:** Die Integration hält ihre letzten Log-Zeilen selbst im Speicher (max. 500).
  Damit braucht niemand mehr `logger: debug` in der `configuration.yaml`, um einen Fehler zu melden.

### Behoben
- **Status „erreicht", obwohl geheizt wird**, bei Geräten ohne `hvac_action`, `running_state` und
  Ventilstellung (Aqara E1, Homematic-Wandthermostat): Der Zustand wird jetzt aus der Nachfrage
  abgeleitet (Raumfühler gegen wirksamen Sollwert, 0,3 K). Regelung unverändert. (#18, #11)
- **„Fühler ausgefallen" nach einem Neustart:** Ein gültiger Entitätszustand genügt jetzt; der
  gemerkte Messwert ist nicht mehr Bedingung. (#10)
- **Drehen am Wandthermostat wird übernommen**, auch wenn der Sollwert-Ausgleich läuft – beim
  Zurückrechnen wird der gelernte Versatz herausgerechnet. (#11)

## 0.45.4 – 2026-11-03

### Behoben
- **Einstellungen wieder in voller Breite:** 0.45.3 hatte den Reiter auf ein Raster mit einer Spalte
  gestellt (`max_columns: 1`) – das ist in Home Assistant eine einzige schmale Spalte, nicht die volle
  Breite. Jetzt dasselbe Raster wie die Räume-Ansicht (3 Spalten, Karte über alle).

## 0.45.3 – 2026-11-03

### Behoben
- **Einstellungen sind jetzt genau so breit wie die Übersicht:** Der Reiter war ein Panel-View, alle
  anderen sind Sections-Views – dadurch war die Karte schmaler und anders eingerückt. Jetzt gleicher
  View-Typ und volle Breite.

## 0.45.2 – 2026-11-03

### Geändert
- **Einstellungen so breit wie die Übersicht:** Die Begrenzung auf 1500 px ist entfallen, die
  Innenabstände entsprechen jetzt denen der anderen Karten. Damit stehen alle Karten bündig.

## 0.45.1 – 2026-11-03

### Behoben
- **Abgleich kommt jetzt auch ohne neue Messwerte an:** Bei Kalibrierart „target“ sendet Raumklima den
  Sollwert alle 10 Minuten neu (bisher nur beim Eintreffen einer Messung). Melden die Livisi-/HMIP-Geräte
  lange nichts, blieb der unkompensierte Sollwert sonst stehen.

## 0.45.0 – 2026-11-03

### Behoben
- **Abgleich dauerhaft statt nur im Messmoment (Livisi/HMIP):** Der Versatz zwischen Thermostat- und
  Raumfühler wird jetzt gelernt, geglättet und **gespeichert**; er wirkt bei jedem Schreibvorgang auf den
  Sollwert. Bisher wurde er nur berechnet, wenn gerade ein Messwert eintraf – meldeten die batteriebetriebenen
  Fühler danach lange nicht, blieb der unkompensierte Sollwert stehen und der Raum heizte über das Ziel.
  Beim ersten Wert wird der Versatz direkt übernommen, danach mit 30 % nachgeführt; unplausible Werte
  (über 6 K) werden ignoriert, der Versatz ist auf ±4 K begrenzt.
- Der gelernte Versatz steht als Attribut `offset_auto` am Raum und in der Kachel „Abgleich“.

## 0.44.1 – 2026-11-03

### Geändert
- **Schlafenszeiten ohne Tabelle:** gelernte Bettzeit, Aufstehzeit und Ruhezeit stehen jetzt als Zeilen
  mit Chips (werktags, Wochenende) – damit ist die letzte Tabelle in den Einstellungen entfallen.

## 0.44.0 – 2026-11-03

### Neu
- **Der Lernbereich hat Unterreiter** – je nach Ebene mit passendem Inhalt:

  **Raum:** *Übersicht* (Aufheizrate, Vorheizen, Zuverlässigkeit, aktuelle Entscheidung) ·
  *Entscheidungen* · *So rechnet es*

  **Wohnung:** *Schlafen & Anwesenheit* (gelernte Bett-/Aufstehzeiten, Anwesenheitsprofil, Vorschlag) ·
  *Entscheidungen* · *So rechnet es*

- **Reiter „Entscheidungen“:** Zeitraum (heute / 7 / 14 Tage), Bereich (Heizen, Lüften, Anwesenheit,
  Gesundheit), Kennzahlen (Anzahl, Zieltemperatur geändert, Lüftungen) und ein Verlauf mit Zeit, was
  passiert ist und warum. Eine Zeile antippen zeigt die vollständige Begründung und die mitgelieferten
  Messwerte. Auf Wohnungsebene kommt eine Raumauswahl dazu.

- **„So rechnet es“:** erklärt in Alltagssprache, woher Aufheizrate, Vorheizen, Schlafzeiten und
  Anwesenheitsprofil kommen – und wo die Grenzen liegen.

## 0.43.0 – 2026-11-03

### Neu
- **Feinstaub (PM2,5) als Messgröße:** Ein Raum kann einen PM2,5-Fühler bekommen. Ab **35 µg/m³**
  schlägt Raumklima „Bitte lüften“ vor (Grund `pm25`), als ausgetauscht gilt die Luft unter
  **15 µg/m³**. Der Wert erscheint als eigene Kachel in der Raumkarte und bei Überwachungsräumen.
  Wird beim Anlegen eines Überwachungsraums mit abgefragt.

## 0.42.4 – 2026-11-03

### Geändert
- **Thermostat-Abweichung wird erklärt:** Steht am Gerät ein anderer Sollwert als im Raumziel, zeigt
  der Hinweis jetzt auch den Abgleich – z. B. „Thermostat 16,5° (Abgleich +1,6°)“. Damit ist klar,
  dass 18,0 − 1,6 = 16,4 gewollt ist und nicht zwei Systeme gegeneinander arbeiten.

## 0.42.3 – 2026-11-03

### Behoben
- **Überwachungskarte zeigt keinen Heizkörper mehr:** Die Kachel „Heizkörper –" ist bei Räumen ohne
  Thermostat entfallen.
- **Klick auf eine Überwachungskachel öffnet nichts mehr:** Seit die große Karte im Raster steht, war
  die zusätzliche Detailansicht doppelt (und ohne eigene Gestaltung). Die Kachel ist reine Anzeige.

## 0.42.2 – 2026-11-03

### Behoben
- **„Fehler: rkLayoutChanged is not defined“ beim Speichern der Darstellung:** Die Funktion war
  vorhanden, aber im Einstellungs-Modul nicht importiert. Speichern von Reihenfolge, Größe und Farbe
  funktioniert wieder.

## 0.42.1 – 2026-11-03

### Neu
- **Versionsstand in der Übersicht:** unter der Räume-Zeile steht klein „Raumklima 0.42.1“ – so ist
  ohne Umweg erkennbar, welcher Stand läuft (hilft bei Cache-Fragen und Fehlermeldungen).

## 0.42.0 – 2026-11-03

### Neu
- **Vorschlag aus dem Anwesenheitsprofil:** Sobald eine Woche erfasst ist, zeigt der Lernbereich die
  typische Anwesenheitszeit („17:00 bis 22:30 · Wochenende ab 10:00"). Daraus folgt: Vorheizen beginnt
  30 Minuten vorher, Absenken endet mit der Ankunft – die Heizung läuft nicht ins Leere.

## 0.41.3 – 2026-11-03

### Behoben
- **Überwachungsräume bekommen ihre große Karte:** Das Dashboard hat sie bisher aus dem Kartenraster
  ausgeschlossen, deshalb fehlte die Karte unterhalb der Übersicht. Die Karte zeigt Messwerte,
  Lüfthinweis und Daten – ohne Sollwert, ohne Plus/Minus und ohne Boost.

## 0.41.2 – 2026-11-03

### Neu
- **Überwachungsräume haben eine eigene große Ansicht:** Ein Tipp auf die Kachel öffnet keine
  Thermostatkarte mehr, sondern eine Übersicht mit allen vorhandenen Daten – Temperatur, Feuchte,
  Taupunkt, CO₂, Außenwerte, Fenster und Anwesenheit – samt Begründung („warum lüften?") und
  empfohlener Lüftdauer, mit Zurück-Knopf.

### Geändert
- **Anwesenheitsprofil im Lernbereich** als eigener Abschnitt mit Zweck-Satz: es verbessert die
  Vorschläge für Absenken und Vorheizen.

## 0.41.1 – 2026-11-03

### Neu
- **Anwesenheitsprofil:** Die Zentrale merkt sich im 15-Minuten-Raster (4 Wochen rollierend), wann
  meist jemand zu Hause ist – nur „jemand da oder nicht“, ohne Personenbezug. Angezeigt als Balken
  für werktags und Wochenende, dazu ein Satz wie „meist 17:15–08:00 jemand zu Hause“.
- **Zeitwähler im iOS-Stil:** Zeitfelder öffnen zwei Räder (Stunden, Viertelstunden) zum Durchscrollen
  mit Einrasten; im Feld darunter lässt sich die Zeit weiterhin eintippen.

## 0.41.0 – 2026-11-03

### Neu
- **Gelernte Schlafzeiten im Bereich „Lernen“** (Wohnungsebene): typische Bettzeit und Aufstehzeit
  für werktags und Wochenende, mit Nachtzähler und der daraus abgeleiteten Ruhezeit.

### Geändert
- **Farbe als Abgrenzung:** jede Gruppe trägt ihren Ton an Trennlinie, Symbol und Titel.
- **Heizsaison mit Kalender:** die Datumsfelder öffnen einen Datumswähler (Tag und Monat zählen, das Jahr nicht).
- **Uhrzeiten mit Zeitwähler:** alle Zeitfelder nutzen einen Zeitwähler in 15-Minuten-Schritten.
- **„Alle Räume“ als Kacheln:** Raumname, Raumtyp, große Wunschtemperatur, darunter Absenkung und
  Lüftungsschwelle sowie Symbole für Fensterlogik, Hinweise und Feuchtegrenze.

## 0.40.1 – 2026-11-03

### Geändert
- **„Alle Räume auf einen Blick“ als Zeilen** statt 8-Spalten-Tabelle (in 0.41.0 zu Kacheln weiterentwickelt).
- **Empfänger ohne Sonderkarten:** Personen erscheinen als normale Zeilen mit Kanal-Chips.
- **Mail-Anbieter als Chips** statt Auswahlfeld.

## 0.40.0 – 2026-11-03

### Neu
- **„Lernen & Warum“ in den Einstellungen** (pro Raum): Aufheizrate mit Anzahl der Messungen,
  Vorheizzeit für 2 K, Einschätzung der Zuverlässigkeit (noch unsicher / brauchbar / belastbar),
  die aktuell gültige Entscheidung und darunter die letzten Entscheidungen mit Begründung.

## 0.39.11 – 2026-11-03

### Behoben
- Die Gruppenleiste zeigt nur noch Gruppen, die es wirklich gibt (kein toter „Lernen“-Eintrag).

## 0.39.10 – 2026-11-03

### Behoben
- **Status „heizt" bei Geräten ohne verlässliches `hvac_action`** (Homematic IP): Ist das Ventil zu
  mindestens 5 % offen und liegt der Raum unter dem Sollwert, gilt der Raum als heizend. Bisher zeigte
  die Karte „bereit", obwohl das Ventil geregelt hat.

## 0.39.9 – 2026-11-03

### Neu
- **Wert antippen und direkt eintippen:** Ein Tipp auf die Zahl im Stepper öffnet ein Eingabefeld
  (Enter übernimmt, Escape bricht ab) – statt nur −/+ zu drücken (B).
- **Kurze Schalter paarweise:** Gruppen, die nur aus Schaltern/Segmenten bestehen, zeigen zwei Zeilen
  nebeneinander, sobald die Karte breit genug ist (E).
- **Dezente Zebra-Streifen** in langen Gruppen (D).

## 0.39.8 – 2026-11-03

### Geändert
- **Einstellungen als ein Dokument:** Gruppen sind Abschnitte mit Titel und Trennlinie statt einzelner
  Karten (A + C des Design-Passes).
- **Feste Wertespalte:** Werte und Bedienung sitzen auf einer gemeinsamen rechten Kante, Stepper sind
  gleich breit, Ziffern gleich breit.
- **Zeilen reagieren auf Berührung** (dezente Hervorhebung) – größere Trefferflächen.
- Aufgeräumt: doppelte CSS-Regeln für Zeilen und Gruppen entfernt, dadurch greifen die neuen Regeln
  überhaupt erst.

## 0.39.7 – 2026-11-03

### Geändert
- **Einstellungen in voller Breite:** alle Gruppen untereinander, keine Spalten mehr.
- **Zeilen in Tabellen-Optik:** Beschriftung links, Wert und Bedienung rechts auf einer gemeinsamen
  Kante, gleich breite Ziffern, feine Trennlinien statt Karten pro Zeile. Stepper haben eine feste
  Breite, damit alle −/+ Knöpfe untereinander stehen.

## 0.39.6 – 2026-11-03

### Geändert
- **Durchgehender Satzspiegel in den Einstellungen:** zwei gleich breite Spalten, die sich in der Höhe
  ausgleichen (kein Raster mit halb leeren Reihen mehr). Ist nur eine Gruppe sichtbar, steht sie allein
  und mittig in voller Breite.

## 0.39.5 – 2026-11-03

### Geändert
- **Zwei Spalten nur, wenn mindestens zwei Gruppen sichtbar sind.** Bei einer einzelnen Gruppe
  (z. B. „Raum" → „Temperatur") nutzt sie jetzt die volle Breite statt links zu kleben.

## 0.39.4 – 2026-11-03

### Geändert
- **Baukasten für die Einstellungen (Design-Pass, Stufe 1):** einheitliche Zeilenhöhe (48 px),
  gleiche Abstände, gleiche Schriftgrößen und Höhen für Chips, Knöpfe, Auswahlfelder und Stepper,
  ruhigere Gruppenköpfe. Nur Darstellung – keine Funktion geändert.

## 0.39.3 – 2026-11-03

### Behoben
- **Warnung „Ventil dauerhaft offen"**, wenn ein Thermostat auf Preset `on` steht (Tuya TRV602Z: Ventil
  100 %, heizt über das Ziel hinaus). Im Komfort-Modus (Sollwert über `comfort_temperature`) entfällt sie.
- **Keine voreiligen „Sollwert nicht bestätigt"-Meldungen** mehr bei Geräten, die über die Zahl-Entität
  gesteuert werden: Die Prüfung wartet jetzt 120 s je Versuch statt 20 s (Batteriegeräte melden selten).

## 0.39.2 – 2026-11-03

### Behoben
- **Tuya TRV602Z: `preset "on"` öffnet das Ventil dauerhaft** (im Betrieb gemessen: 100 % bei 21 °C
  Raumtemperatur und 14,5 °C Sollwert). Raumklima schreibt den Sollwert bei diesen Geräten jetzt über
  `preset "comfort"` + `…_comfort_temperature` – der Wert, den das Gerät wirklich regelt. `"on"` gilt
  wieder als „nicht regeln" und wird gemieden; die Warnung „eigener Abschlag" entfällt in diesem Modus.
- Layout-Reihenfolge/Ausblenden wirkt jetzt auch in der Übersichtskarte (Zustandsobjekte ohne `id`).

## 0.38.0 – 2026-11-03

### Behoben
- **Ventilstellung blieb leer, obwohl der Sensor existiert** (#15): Der Sensor wurde nur einmal beim
  Einrichten gesucht. MQTT/Zigbee legen die Entität aber oft erst danach an – danach wurde nie wieder
  gesucht. Jetzt wird bei jedem Abgleich (alle 10 Minuten) nachgesehen, solange keiner gefunden ist.
  Die Raumkarte zeigt die Kachel „Ventil" außerdem nur noch, wenn es überhaupt einen Sensor gibt
  (Livisi-Thermostate liefern keine Ventilstellung).
- **Schrift im Temperaturkreis lief über den Bogen** (iPad/Handy): Text ist jetzt in der Breite
  begrenzt, bricht um und skaliert mit dem Kreis mit.

### Geändert
- Releases werden ab jetzt **gesammelt**: Änderungen stehen unter „Unreleased" und werden in einem Zug
  veröffentlicht, statt nach jeder Korrektur.

## 0.37.1 – 2026-11-03

### Behoben
- **Ventilsensor: gemeinsamer Namensstamm zählt jetzt zuerst** (#15). Thermostat
  `climate.danfoss_ally_buro_mike` und Sensor `sensor.danfoss_ally_buro_mike_valve_opening` gehören
  offensichtlich zusammen – dieser Vergleich fehlte. Er läuft jetzt vor Bereich und Gerätename; bei
  mehreren Treffern gewinnt der längste gemeinsame Namensanfang.

## 0.37.0 – 2026-11-03

### Behoben
- **„Fühler ausgefallen", obwohl der Fühler erreichbar ist** (#11): Das Alter eines Werts zählte als
  Ausfall. Batteriebetriebene Fühler (Homematic, Danfoss) senden aber nur bei Änderung – bei stabiler
  Temperatur bleibt der Wert stundenlang stehen. Jetzt zählt nur noch der Entitätszustand
  (`unavailable`/`unknown`/kein Wert) als Ausfall; das Alter steht als `sensor_age_minutes` für die
  Diagnose bereit.
- **Ventilstellung weiterhin nicht gefunden** (#15): Der Raum-Bereich hängt am *Gerät*, nicht an der
  Entität – die Bereichssuche lief deshalb ins Leere. Sie nutzt jetzt den Gerätebereich, und der
  Namensvergleich akzeptiert zusammengehörige Namen („Danfoss Ally Büro" / „Danfoss Ally Büro Valve").

## 0.36.0 – 2026-11-03

### Behoben
- **Tuya-TRVs (TRV602Z) wurden im falschen Modus betrieben.** Der Modus steckt dort im *Preset*:
  `preset: on` schaltet auf `system_mode: heat` (manuell, Sollwert gilt), `auto` = Geräte-Wochenplan,
  `eco`/`comfort` = Geräte-eigene Temperaturen. Raumklima hat `on` bisher als „Ventil dauerhaft offen“
  eingeschätzt und deshalb jeden manuellen Modus sofort auf `comfort`/`eco` zurückgeschrieben – der
  gesendete Sollwert galt am Gerät nie. `on` zählt jetzt als Heiz-Preset, `manual`/`heat` bleiben
  bevorzugt. Das An-Preset lässt sich zusätzlich je Raum in der Karte setzen (*Einschalten mit*).
- Die Warnung „Thermostat steht auf Dauerbetrieb“ gilt nur noch für `off`/`antifrost`; `on` ist bei
  Tuya der manuelle Heizmodus. Texte, Doku (de/en/fr) und FAQ-Eintrag zum TRV602Z nachgezogen.

## 0.35.0 – 2026-11-03

### Neu
- **Warnung bei Dauer-Presets und Geräte-Abschlägen am Thermostat.** Bisher wurde nur der Modus „Auto“
  erkannt. Tuya-Geräte (TRV602 und Verwandte) drücken ihre Betriebsart aber ins **Preset**: „on“/„off“/
  „antifrost“ überstimmen jeden Sollwert, „eco“/„comfort“/„boost“ rechnen mit einem eigenen Abschlag im
  Gerät. Beides steht jetzt in der Gesundheitsliste – mit dem Hinweis, auf „Heat“ und Preset „none“ zu
  stellen. Meldungen de/en/fr.

## 0.34.1 – 2026-11-03

### Behoben
- **Ventilstellung wurde bei Danfoss Ally nicht gefunden** (#15): Die Integration legt den Sensor auf
  ein *zweites* Gerät, oft ohne Bereich. Gesucht wird jetzt in dieser Reihenfolge: gleiches Gerät,
  gleicher Bereich, gleicher **Gerätename** – und zuletzt der einzige Ventilsensor im System. Ist die
  Zuordnung mehrdeutig, bleibt die Anzeige leer, statt die Ventilstellung eines fremden Raums zu zeigen.

## 0.34.0 – 2026-11-03

### Behoben
- **Räume ohne Funkverbindung tauchten auf fremden Dashboards auf.** Fehlte das Thermostat, zeigte Home
  Assistant die Raum-Entität als „nicht verfügbar" – und verwirft dabei alle Zusatz-Attribute, auch
  `home`. Die Karten konnten den Raum dann keiner Wohnung zuordnen und zeigten ihn überall. Ein Raum
  bleibt jetzt verfügbar; der Zustand steht in `status` („Thermostat nicht erreichbar"). Sichtbar wird
  das als graue Kachel mit Hinweis statt als verschwundener Raum.

## 0.33.1 – 2026-11-03

### Behoben
- **Räume einer anderen Wohnung auf eigenen Dashboards** (Rückmeldung aus dem Betrieb): Eine Karte ohne
  `home:` zeigte **alle** Räume – auch die einer zweiten Wohnung. Die Wohnung lässt sich jetzt auch per
  **Name** setzen (`home: <Name der Wohnung>`), und der Dashboard-Pfad `heizung-<name>` wird ebenfalls erkannt.
  Die Doku sagt jetzt ausdrücklich: ohne `home:` zeigt die Karte alles, und Räume ohne Wohnung erscheinen
  auf jedem Dashboard.
- **Sporadisch roter Test** `test_switch_to_always_via_options`: prüft jetzt die Entscheidung des Raums
  statt eines Zeitrennens gegen die Funkbestätigung.

## 0.33.0 – 2026-11-03

### Behoben
- **„nach Uhrzeit sortieren" stellte Nachtfenster ans Ende** (Issue #10): Ein Fenster 22:00–06:30 begann den
  Tag, landete in der Liste aber hinter den Morgenfenstern. Jetzt stehen Fenster über Mitternacht **vorn**;
  bei gleicher Startzeit zuerst das breitere (mehr Wochentage), danach alphabetisch nach Tagen.
- **Ventilstellung bei eigenem Gerät** (Issue #15): Liegt der Sensor auf einem anderen Gerät als das Thermostat
  (Danfoss Ally), wird jetzt zusätzlich im **selben Bereich** gesucht.

## 0.32.0 – 2026-11-03

### Behoben
- **„Thermostat reagiert nicht" bei langsamen Geräten** (Issue #16): FRITZ!DECT 301/302 melden nur alle
  15 Minuten. Raumklima hat nach 5 Minuten aufgegeben und den Fehler gemeldet, obwohl das Gerät längst
  reagiert hatte. Jetzt wird der **Meldeabstand des Geräts gemessen** (Median der letzten Zustandsmeldungen)
  und die Geduld danach gerichtet — bis zu 30 Minuten. Schnelle Geräte verhalten sich unverändert.
- **„Offset" fehlte in der Raumkarte** (ohne Offset-Entität): Zeigte das Gerät keine Offset-Entität, war die
  Kachel leer, obwohl Raumklima über den Sollwert abgleicht. Jetzt steht dort **„Abgleich ±x°"** (Abweichung
  Fühler ↔ Thermostat), und die Einstellungen erklären den Unterschied.

## 0.31.0 – 2026-11-03

### Neu
- **Dachluke/Dachfenster als Fenster nutzen:** In der Fenster-Auswahl lassen sich jetzt auch `cover`-Geräte
  wählen, nicht nur Kontakte (`binary_sensor`). Eine Kuppel oder Luke gilt als offen, wenn sie `open` oder
  `opening` meldet — oder wenn ihre Position über 0 % liegt (teilweise geöffnet lüftet ebenfalls).
  Alles andere (Lüftungshinweise, „seit wann offen", Heizpause) läuft unverändert.

## 0.30.1 – 2026-11-03

### Geändert
- **Überwachungsräume ohne große Raumkarte:** In der Dashboard-Strategie bekommen Räume ohne Heizung keine
  eigene Raumseite mehr — die wäre ohne Regler leer. Sie erscheinen als Kachel in der Übersicht, mit
  Temperatur, Feuchte, CO₂ und den Lüftungshinweisen; Verlauf, Bericht und Protokoll enthalten sie weiter.

## 0.30.0 – 2026-11-03

### Neu
- **Thermostat nachträglich ergänzen:** In *Geräte & Dienste → Raumklima → Raum → Konfigurieren* ist das
  Thermostat bei einem Überwachungsraum jetzt **optional** — leer lassen heißt „weiter nur messen", ein
  Gerät auswählen macht daraus einen Heizraum (Ziel, Boost, Kalibrierung, Sync kommen mit dem Neuladen).

### Behoben
- **Ventilstellung blieb „unbekannt"** (Issue #15): Gesucht wurde nur nach „position" im Entitätsnamen.
  Danfoss Ally liefert `…_valve_opening`, Homematic `…_valve_position`, Bosch `…_valve_tappet`. Die Erkennung
  prüft jetzt Prozentwert **und** Bezeichnung (position/opening/öffnung/valve/ventil/tappet) am TRV-Gerät.

## 0.29.0 – 2026-11-03

### Neu
- **Räume ohne Heizung – „Nur überwachen":** Ein Raum lässt sich jetzt ohne Thermostat anlegen, etwa im
  Wohnzimmer mit Fußbodenheizung ohne Aktor. Raumklima misst dann nur: Temperatur, Feuchte, CO₂,
  Fensterkontakte, Lüftungshinweise, Schimmelrisiko, Verlauf und Bericht – und schickt **keine** Befehle.
  Kein Ziel, kein Boost, keine Kalibrierung, keine Heizungs-Gesundheitschecks; die Entität bleibt für Karten,
  Verlauf und Bericht bestehen.
  Anlegen: *Geräte & Dienste → Raumklima → Integration hinzufügen → „Nur überwachen (ohne Heizung)"*.

## 0.28.1 – 2026-11-03

### Neu
- **Warnung, wenn das Thermostat nach eigenem Zeitplan läuft** (Issue #13): Steht ein Gerät auf „Auto"
  (oder meldet einen Zeitplan-Preset wie `schedule`/`program`/`timer`), arbeitet es seinen eingebauten
  Wochenplan ab und kann dem widersprechen, was Raumklima vorgibt. Das steht jetzt in der Gesundheitsliste,
  mit dem Hinweis, am Gerät auf „Heat" zu stellen. Betrifft Tuya-, Bosch- und Homematic-Geräte gleichermaßen.

### Behoben
- **Fühler wurde als ausgefallen gemeldet, obwohl er nur unverändert war** (Issue #14): Ein Sensor, der nur
  bei Änderung sendet (z. B. Aqara/Xiaomi), galt nach einer Stunde ohne neuen Wert als „meldet sich nicht".
  Gemeldet wird jetzt nur noch, wenn der Fühler wirklich **nicht erreichbar** ist (`unavailable`/`unknown`);
  ein stabiler Wert bleibt still. Weicht der Fühler dauerhaft vom Thermostatfühler ab, greift weiterhin die
  Plausibilitätsprüfung.

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
  ein selbst gebautes Dashboard einer Wohnung listete also auch Räume der anderen Wohnung.
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
- Abwesenheits-Push sprach immer vom Namen der ersten Wohnung – jetzt der richtige Wohnungsname (nur bei mehreren).
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
- Umschalter zwischen den Wohnungen oben in der Übersicht und in den Einstellungen; jede Wohnung
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
