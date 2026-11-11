/* Raumklima 0.62.34b1 – gebaut aus frontend/src (npm run build). Nicht von Hand bearbeiten. */
(() => {
  // src/i18n/en.js
  var EN = {
    "auch „Abgleich“ genannt: das Gerät kennt keinen Offset – Raumklima verschiebt stattdessen den Sollwert um die Abweichung zwischen Fühler und Thermostat": "also called “balancing”: the device has no offset, so Raumklima shifts the setpoint by the difference between sensor and thermostat",
    "Lüfthinweise von": "Air hints from",
    "Bitte lüften, Fenster schließen und Luft ausgetauscht nur in dieser Zeit – nachts bleibt es still, Raum kühlt aus, Frost und Gerätefehler melden sich weiter": "Please air, close the window and air exchanged only within this time – silent at night; room cooling down, frost and device faults still report",
    "Höchstens je Tag": "At most per day",
    "unbegrenzt": "unlimited",
    "{n} je Tag": "{n} per day",
    "gilt für wiederkehrende Hinweise (Bitte lüften, Fenster bleibt offen) – Fenster schließen und Luft ausgetauscht bleiben frei": "applies to recurring hints (please air, window stays open) – close the window and air exchanged stay unlimited",
    "CO₂-Grenze": "CO₂ threshold",
    "1000 ppm ist der klassische Richtwert – in einem Wohnzimmer mit mehreren Personen liegt man abends dauerhaft darüber, 1200 ppm sind dort realistischer": "1000 ppm is the classic guideline – a living room with several people sits above it all evening, 1200 ppm is more realistic there",
    "ab der Grenze unten: Bitte lüften": "above the threshold below: please air",
    "Anlegen nicht möglich – bitte in den Einstellungen unter Dashboards prüfen": "Could not create it – please check Settings → Dashboards",
    "Breite": "Latitude",
    "Dashboard mit der Raumklima-Strategie anlegen": "Create dashboard with the Raumklima strategy",
    "Dashboard „{d}“ angelegt": "Dashboard “{d}” created",
    "Dauer des Boosts": "Boost duration",
    "Boost · Ziel <b>{v} °C</b>": "Boost · target <b>{v} °C</b>",
    "Boost": "Boost",
    "Erweitert: Sonneneintrag": "Advanced: solar gain",
    "Erweitert: Standort der Wohnung": "Advanced: location of the home",
    "Für diese Wohnung gibt es noch kein Dashboard „{d}“ – der Knopf legt es mit der Raumklima-Strategie an (gefiltert auf diese Wohnung).": "This home has no dashboard “{d}” yet – the button creates it with the Raumklima strategy (filtered to this home).",
    "Für diese Wohnung ist noch kein eigenes Dashboard eingerichtet – erst anlegen, dann lässt sich umschalten.": "No dashboard has been set up for this home yet – create one first, then you can switch.",
    "Für eine zweite Wohnung (z. B. Ferienwohnung) mit eigenen Bewohnern, Zone und Empfängern hier anlegen. Bestehende Räume bleiben in dieser Wohnung.": "Create a second home here (e.g. a holiday flat) with its own residents, zone and recipients. Existing rooms stay in this home.",
    "Handbuch (PDF)": "Manual (PDF)",
    "Anleitung, Funktionen und häufige Fragen": "Setup, features and frequently asked questions",
    "Jede Nacht zählt einmal (frühestes Ereignis). Gelernt wird zuerst je Wochentag (Schichtdienst), sonst nach Werktag und Wochenende (Fr→Sa, Sa→So); gelernt wird der typische Wert (Median) der letzten 6 Wochen, sobald 4 Nächte da sind. Die Ruhezeit beginnt 30 min vor der typischen Bettzeit und endet 30 min nach dem Aufstehen – aber nie kürzer als eingestellt.": "Each night counts once (earliest event). Learning starts per weekday (shift work), otherwise by weekday/weekend (Fri→Sat, Sat→Sun); the typical value (median) of the last 6 weeks is learned once 4 nights are in. Quiet time begins 30 min before the typical bedtime and ends 30 min after getting up – but never shorter than configured.",
    "Leer lassen = es gilt der Standort aus der Zone dieser Wohnung ({zone}{zl}). Ist keine Zone gesetzt, gilt der Standort von Home Assistant ({lat} / {lon}). Nur eintragen, wenn die Wohnung woanders liegt – daraus rechnet Raumklima den Sonnenstand; „von HA“ übernimmt die HA-Werte zum Anpassen.": "Leave it empty = the location comes from this home’s zone ({zone}{zl}). If no zone is set, Home Assistant’s location applies ({lat} / {lon}). Only enter it if the home sits elsewhere – Raumklima computes the sun’s position from it; “from HA” copies the Home Assistant values for adjusting.",
    "Länge": "Longitude",
    "Neue Wohnung, z. B. Ferienwohnung": "New home, e.g. holiday flat",
    "Nord": "North",
    "Nordost": "North-east",
    "Nordwest": "North-west",
    "Ost": "East",
    "Richtung, in die die Fenster dieses Raums zeigen – vereinfacht, freie Sicht vorausgesetzt. Haus, Baum, Balkon oder ein tiefes Gewände davor zählt nicht mit; dann lieber leer lassen (nur Vorhersage). Bei zwei Fensterseiten: die mit der größeren Glasfläche.": "Direction the windows of this room face – simplified, assumes a clear view. A building, tree, balcony or deep reveal in front is not taken into account; in that case better leave it empty (forecast only). With two window sides: the one with the larger glass area.",
    "Ruhezeit senkt ab": "Quiet time sets back",
    "Ruhezeit · Ziel <b>{v} °C</b>": "Quiet time · target <b>{v} °C</b>",
    "Schimmelschutz · Ziel <b>{v} °C</b>": "Mould protection · target <b>{v} °C</b>",
    "Schichtdienst": "Shift work",
    "Sonne kommt aus": "Sun comes from",
    "Standort der Wohnung": "Location of the home",
    "Süd": "South",
    "Südost": "South-east",
    "Südwest": "South-west",
    "Tageswerte je Raum als Tabelle (CSV)": "Daily values per room as a table (CSV)",
    "Export fehlgeschlagen: {e}": "Export failed: {e}",
    "Kalender": "Calendar",
    "Thermostat {v}°": "Thermostat {v}°",
    "Vorheizen für Zeitplan · <b>{v} °C</b>": "Preheating for schedule · <b>{v} °C</b>",
    "Werte von Home Assistant übernehmen": "Take over Home Assistant’s values",
    "West": "West",
    "Wohnung „{n}“ angelegt – Dashboard „{d}“ gleich mit": "Home “{n}” created – dashboard “{d}” included",
    "anlegen": "create",
    "auch Tagschlaf lernen: ins Bett bis 09:00, aufstehen bis 17:00 – für Nachtschicht und Wechselschicht": "also learn daytime sleep: bedtime up to 09:00, getting up up to 17:00 – for night and rotating shifts",
    "bei Sonne 1 °C weniger heizen – die Sonne wärmt mit": "heat 1 °C less when the sun is out – it warms the room",
    "egal – nur Vorhersage": "any – forecast only",
    "keine Zone gesetzt": "no zone set",
    "leeren – dann gilt Home Assistant": "clear – then Home Assistant applies",
    "nur Vorhersage": "forecast only",
    "von HA": "from HA",
    "vorhanden": "present",
    "während der Ruhezeit werden Schlafzimmer und selten genutzte Räume abgesenkt – auch wenn jemand zu Hause ist": "during quiet time, bedrooms and rarely used rooms are set back – even when somebody is at home",
    "z. B. Ferienwohnung": "e.g. Holiday flat",
    "z. B. abends 19–21 Uhr wärmer": "e.g. warmer in the evening from 7 to 9 pm",
    "von": "from",
    "täglich": "daily",
    "so viel wärmer als die Wunschtemperatur – der Knopf „Wärmer“ am Raum startet ihn": "that much warmer than the desired temperature – the “Warmer” button on the room starts it",
    "noch {m} min": "{m} min left",
    "keine – die Automatik regelt wie gewohnt": "none – the automation works as usual",
    "danach gilt wieder Zeitplan bzw. Automatik": "afterwards the schedule or the automation applies again",
    "Zeitplan · Ziel <b>{v} °C</b>": "Schedule · target <b>{v} °C</b>",
    "Zeitplan": "Schedule",
    "Zeitfenster {n}": "Time window {n}",
    "Zeitfenster hinzufügen": "Add time window",
    "Zeitfenster": "Time window",
    "Wärmer für kurze Zeit (Boost)": "Warmer for a short while (boost)",
    "Wärmer für kurze Zeit": "Warmer for a short while",
    "{n} Dashboard(s) für deine Wohnungen angelegt": "{n} dashboard(s) created for your homes",
    "– keiner –": "– none –",
    "gerade: „{s}“": "now: “{s}”",
    "Termine mit diesen Wörtern steuern die Anwesenheit": "Events with these words control presence",
    "… wie Urlaub": "… like vacation",
    "Komma-getrennt; absenken wie „länger weg“, sobald niemand da ist": "comma-separated; set back like “away longer” as soon as nobody is home",
    "… jemand bleibt zu Hause": "… someone stays home",
    "Komma-getrennt; dann wird nicht abgesenkt": "comma-separated; no setback then",
    "Frostnacht: weniger absenken": "Frost night: smaller setback",
    "unter −5 °C laut Vorhersage nur halb so tief – der Raum ist schneller wieder warm": "below −5 °C forecast only half as deep – the room warms up faster",
    "Sonnenseite": "Sunny side",
    "gerade: Sonne erwartet – 1 °C weniger": "now: sun expected – 1 °C less",
    "bei Sonne laut Vorhersage 1 °C weniger heizen – die Sonne wärmt mit": "heat 1 °C less when the forecast says sun – the sun helps",
    "Sonne heizt mit · Ziel <b>{v} °C</b>": "Sun helps · target <b>{v} °C</b>",
    "+{n} neue Einträge sind durch die Filter ausgeblendet (z. B. Thermostat-Befehle).": "+{n} new entries are hidden by the filters (e.g. thermostat commands).",
    "1 Hinweis": "1 notice",
    "1 Raum aus": "1 room off",
    "24 h heizen": "Heat for 24 h",
    "3 Tage darunter → heizt auch außerhalb der Saison": "3 days below → heats outside the season too",
    "7 T": "7 d",
    "<b>{v} %</b> warm bei Ankunft": "<b>{v} %</b> warm on arrival",
    "<b>{v} h</b> abgesenkt": "<b>{v} h</b> set back",
    "<b>{v} h</b> geheizt": "<b>{v} h</b> heated",
    "Abgesenkt": "Set back",
    "Abgesenkt <b>{v} °C</b> · Wunsch {w}°": "Set back <b>{v} °C</b> · desired {w}°",
    "Abgesenkt – niemand da": "Set back – nobody home",
    "Absenken nach": "Set back after",
    "Absenkung kurz / länger": "Setback short / long",
    "Absenkung „kurz weg“": "Setback “briefly away”",
    "Absenkung „länger weg“": "Setback “away longer”",
    "Abwesenheit & Vorheizen": "Away & preheating",
    "Adresse des Dashboards dieser Wohnung (für den Umschalter)": "Path of this home's dashboard (for the switcher)",
    "Alle Räume": "All rooms",
    "Alle Räume auf einen Blick": "All rooms at a glance",
    "Alle Räume und Außenklima auf einen Blick": "All rooms and outdoor climate at a glance",
    "Alle weg": "Everyone away",
    "Alle zeigen": "Show all",
    "Alles in Ordnung – Thermostate, Fühler, Batterien und Funk unauffällig.": "All good – thermostats, sensors, batteries and radio look fine.",
    "Allgemein": "General",
    "Als Push hinzufügen": "Add as push",
    "Als Sprachansage": "Add as announcement",
    "Altbau saniert": "Old building, renovated",
    "Altbau unsaniert": "Old building, unrenovated",
    "Anwesenheit": "Presence",
    "Anwesenheit & Absenkung": "Presence & setback",
    "Anzeigename (optional)": "Display name (optional)",
    "Aufheizen": "Heat-up",
    "Aufstehen": "Get up",
    "Aus": "Off",
    "Aus – am Thermostat abgeschaltet": "Off – switched off at the thermostat",
    "Ausschalten über": "Turn off via",
    "Automatisch": "Automatic",
    "Außen": "Outdoor",
    "Bad": "Bathroom",
    "CO₂-Sensor": "CO₂ sensor",
    "ab 1000 ppm: „Bitte lüften“": "from 1000 ppm: “Please air the room”",
    "Balken = wie lange die Ventile umgerechnet voll offen waren (Maß für die Wärmemenge). Punkte = Heizgradtage: je kälter es draußen war, desto höher. Hohe Balken an milden Tagen sind ein Hinweis auf offene Fenster oder zu hohe Wunschtemperaturen.": "Bars = how long the valves were fully open, converted (a measure of heat delivered). Dots = heating degree days: the colder outside, the higher. High bars on mild days hint at open windows or desired temperatures that are too high.",
    "Bauart": "Building type",
    "Beenden": "Stop",
    "Bei {p} % der Ankünfte war es schon warm": "On {p} % of arrivals it was already warm",
    "Benachrichtigungen": "Notifications",
    "Benachrichtigungen allgemein": "Notifications – general",
    "Bericht": "Report",
    "Bericht nicht verfügbar: {e}": "Report not available: {e}",
    "Betriebsart": "Mode",
    "Bewohner und Zone wählen, dann ist es aktiv": "Choose residents and zone to activate",
    "Bitte als MM-TT eingeben, z. B. 10-01": "Please enter as MM-DD, e.g. 10-01",
    "Bitte ein Raumklima-Thermostat (entity) angeben": "Please specify a Raumklima thermostat (entity)",
    "Bitte einen Namen eingeben": "Please enter a name",
    "Bitte lüften": "Please air the room",
    "Dashboard": "Dashboard",
    "Daten seit {d}": "Data since {d}",
    "Der Bericht sammelt ab jetzt jede Minute, was die Heizung tut. Nach ein paar Stunden stehen hier die ersten Werte, aussagekräftig wird es nach einer Woche.": "From now on the report records every minute what the heating does. First values appear after a few hours; it becomes meaningful after a week.",
    "Der Schimmelschutz rechnet bei längerer Abwesenheit mit der kältesten Wandstelle (Temperaturfaktor {f} nach DIN 4108-2). Ist die Raumluft feucht, wird weniger abgesenkt – warme Luft nimmt mehr Feuchte auf und die Wand bleibt unter 80 % Feuchte.": "During longer absences, mould protection calculates with the coldest spot on the wall (temperature factor {f} per DIN 4108-2). If the air is humid, the setback is smaller – warm air holds more moisture and the wall stays below 80 % humidity.",
    "Details": "Details",
    "Die Ersparnis ist eine Abschätzung nach der Faustregel der Verbraucherzentrale (≈ 6 % weniger Heizenergie je Grad Absenkung). „Wetterbereinigt“ vergleicht den Heizbedarf je Heizgradtag – ein kalter Monat macht ihn also nicht schlechter.": "Savings are an estimate using the common rule of thumb (≈ 6 % less heating energy per degree of setback). “Weather-adjusted” compares heating demand per heating degree day – so a cold month doesn't make it look worse.",
    "Diese Woche": "This week",
    "Dieser Monat": "This month",
    "Draußen": "Outdoor",
    "Draußen gerade {v} °C": "Currently {v} °C outside",
    "Drehen am Thermostat übernehmen": "Follow changes at the thermostat",
    "Dringend": "Urgent",
    "Einschalten mit": "Turn on with",
    "Einstellungen": "Settings",
    "Einstellungen konnten nicht geladen werden: {e}": "Settings could not be loaded: {e}",
    "Empfohlene Lüftdauer": "Recommended airing time",
    "Empfänger": "Recipients",
    "Entität {e} nicht gefunden": "Entity {e} not found",
    "Erinnern alle": "Remind every",
    "Erreicht": "Reached",
    "Fehler auch in der HA-Glocke": "Also show errors in the HA notifications",
    "Fehler: {e}": "Error: {e}",
    "Fehlgeschlagen": "Failed",
    "Feiertage": "Public holidays",
    "Fenster": "Windows",
    "Fenster in Schlafräumen, das in dieser Zeit aufgeht, gilt als Schlafen bei offenem Fenster – keine Lüft-Hinweise, morgens ein Gruß": "A bedroom window opened during this time counts as sleeping with the window open – no airing notices, a greeting in the morning",
    "Fenster offen": "Window open",
    "Fenster offen, niemand da": "Window open, nobody home",
    "Fenster schließen": "Close the window",
    "Fensterkontakt offen": "Window contact open",
    "Fensterlogik": "Window logic",
    "Feuchte": "Humidity",
    "Feuchtefühler": "Humidity sensor",
    "Feuchtegrenze": "Humidity limit",
    "Format MM-TT, außerhalb nur bei Kälteeinbruch": "Format MM-DD; outside only during a cold snap",
    "Frostschutz <b>{v} °C</b>": "Frost protection <b>{v} °C</b>",
    "Fühler ausgefallen": "Sensor failed",
    "Fühler fehlt": "Sensor missing",
    "Gebäude & Schimmelschutz": "Building & mould protection",
    "Geräte & Technik ändern": "Change devices & technical settings",
    "Gespart": "Saved",
    "Gespeichert": "Saved",
    "Gespeichert – Raum übernimmt die Werte": "Saved – the room applies the values",
    "Gestern": "Yesterday",
    "Gesundheit": "Health",
    "Gesundheit der Heizung": "Heating health",
    "Gäste da": "Guests present",
    "HGT": "HDD",
    "Heizbedarf pro Tag": "Heating demand per day",
    "Heizbericht": "Heating report",
    "Heizgradtage (Kälte draußen)": "Heating degree days (cold outside)",
    "Heizgrenze": "Heating limit",
    "Heizkörper": "Radiator",
    "Heizpause": "Heating paused",
    "Heizpause (Hand)": "Heating paused (manual)",
    "Heizsaison": "Heating season",
    "Heizsaison & Heizgrenze": "Heating season & limit",
    "Heizsaison Start/Ende": "Heating season start/end",
    "Heizstunden": "Heating hours",
    "Heizt": "Heating",
    "Heizung": "Heating",
    "Heizung & Fenster": "Heating & windows",
    "Heizung & Fenster (Zeitleiste)": "Heating & windows (timeline)",
    "Heizung aus": "Heating off",
    "Heizung bei offenem Fenster pausieren": "Pause heating while a window is open",
    "Heizung, Lüften und Klima aller Raumklima-Räume – baut sich automatisch auf": "Heating, airing and climate of all Raumklima rooms – builds itself",
    "Heute": "Today",
    "Heute heizen": "Heat today",
    "Hinweis": "Info",
    "Hinweise": "Notices",
    "Hinweise für diesen Raum": "Notices for this room",
    "Immer heizen": "Always heat",
    "Inhalt": "Content",
    "Ins Bett": "Bedtime",
    "Ja": "Yes",
    "Jede Nacht zählt einmal (frühestes Ereignis), getrennt nach Werktag und Wochenende (Fr→Sa, Sa→So); gelernt wird der typische Wert (Median) der letzten 6 Wochen, sobald 4 Nächte da sind. Die Ruhezeit beginnt 30 min vor der typischen Bettzeit und endet 30 min nach dem Aufstehen – aber nie kürzer als eingestellt.": "Each night counts once (earliest event), separately for weekdays and weekends (Fri→Sat, Sat→Sun); the typical value (median) of the last 6 weeks is learned once 4 nights are recorded. Quiet hours start 30 min before the typical bedtime and end 30 min after getting up – but never shorter than configured.",
    "Jemand da": "Someone home",
    "Jetzt": "Now",
    "Jetzt kalibrieren": "Calibrate now",
    "Kalibrierung": "Calibration",
    "Keine": "None",
    "Keine Daten im Zeitraum": "No data in this period",
    "Keine Einträge für diese Auswahl.": "No entries for this selection.",
    "Keine Ruhezeit": "No quiet hours",
    "Kinderzimmer": "Children's room",
    "Kontakte": "Contacts",
    "Kälteeinbruch": "Cold snap",
    "Kälteeinbruch unter": "Cold snap below",
    "Küche": "Kitchen",
    "Lade Bericht …": "Loading report …",
    "Lade Einstellungen …": "Loading settings …",
    "Lade Verlauf …": "Loading history …",
    "Licht aus – alle schlafen": "Lights off – everyone asleep",
    "Lichter: abends alle 20 min aus = ins Bett, morgens eins an = aufgestanden": "Lights: all off for 20 min in the evening = bedtime, one on in the morning = up",
    "Luft ausgetauscht": "Air exchanged",
    "Luft ausgetauscht – du kannst schließen": "Air exchanged – you can close",
    "Luftfeuchte": "Humidity",
    "Länger weg": "Away longer",
    "Lüften & Feuchte": "Airing & humidity",
    "Lüftet": "Airing",
    "Lüftzeit erreicht – bitte schließen": "Airing time reached – please close",
    "Max. Abkühlung beim Lüften": "Max. cooling while airing",
    "Mindesttemperatur beim Lüften": "Minimum temperature while airing",
    "Minimaltemperatur": "Minimum temperature",
    "Minimum Lüften": "Airing minimum",
    "Modus „aus“": "Mode “off”",
    "Nachrichten": "Messages",
    "Nachtlüften": "Night airing",
    "Nachtlüften – Fenster offen": "Night airing – window open",
    "Name der Wohnung": "Name of the home",
    "Nein": "No",
    "Neubau / gedämmt": "New / insulated",
    "Noch kein Empfänger – unten hinzufügen.": "No recipient yet – add one below.",
    "Noch keine Einträge. Ab jetzt steht hier jede Entscheidung mit Begründung.": "No entries yet. From now on every decision appears here with its reason.",
    "Nur Ansicht – Ändern erfordert Admin": "View only – changes require admin",
    "Offenes Fenster an Temperatursturz erkennen": "Detect open window from temperature drop",
    "Offset": "Offset",
    "Offset am Thermostat": "Offset at the thermostat",
    "Ohne Abgleich": "No correction",
    "Fühler & Sensoren": "Sensors",
    "Pause": "Paused",
    "Pause nach": "Pause after",
    "Pausiert – Fenster offen": "Paused – window open",
    "Preset „aus“": "Preset “off”",
    "Preset „{p}“": "Preset “{p}”",
    "Protokoll": "Log",
    "Protokoll nicht verfügbar: {e}": "Log not available: {e}",
    "Warnung": "Warning",
    "Prüfen": "Check",
    "Prüft alle 10 Minuten: Batterien, Raum wird trotz offenem Ventil nicht warm, Fühler hängt, Funkaussetzer, Fensterkontakt still. Meldungen gehen an alle mit „🩺 Gesundheit“.": "Checks every 10 minutes: batteries, room not warming despite an open valve, stuck sensor, radio dropouts, silent window contact. Notices go to everyone with “🩺 Health”.",
    "Push aufs Handy": "Push to phone",
    "Raum": "Room",
    "Raum (Raumklima-Thermostat)": "Room (Raumklima thermostat)",
    "Raum kühlt aus": "Room cooling down",
    "Raum kühlt aus – jetzt schließen": "Room cooling down – close now",
    "Raum ±1 °C am Ziel": "Room within ±1 °C of target",
    "Raumklima – Einstellungen": "Raumklima – Settings",
    "Raumklima – Heizbericht": "Raumklima – Heating report",
    "Raumklima – Protokoll": "Raumklima – Log",
    "Raumklima – Raum": "Raumklima – Room",
    "Raumklima – Verlauf": "Raumklima – History",
    "Raumklima – Übersicht": "Raumklima – Overview",
    "Raumtemperatur": "Room temperature",
    "Raumtyp": "Room type",
    "Ruhezeit": "Quiet hours",
    "Ruhezeit gerade aktiv": "Quiet hours active",
    "Ruhezeit wirksam": "Effective quiet hours",
    "Räume": "Rooms",
    "Sa und So endet die Ruhezeit später – zum Ausschlafen": "On Sat and Sun quiet hours end later – to sleep in",
    "Schlaf-Signale": "Sleep signals",
    "Schlafen bei offenem Fenster": "Sleeping with the window open",
    "Schlafenszeiten": "Sleep times",
    "Schlafzimmer": "Bedroom",
    "Selten genutzt": "Rarely used",
    "Sicherung": "Safety minimum",
    "Signal hinzufügen": "Add signal",
    "So,Mo,Di,Mi,Do,Fr,Sa": "Su,Mo,Tu,We,Th,Fr,Sa",
    "Sollwert-Ausgleich": "Setpoint compensation",
    "Sommerpflege Ventile": "Summer valve exercise",
    "Sprachansage · nie in der Ruhezeit": "Voice announcement · never during quiet hours",
    "Suchen … (z. B. Offset, Heizpause)": "Search … (e.g. offset, paused)",
    "Synchron": "In sync",
    "TRV weg": "TRV gone",
    "Tagesmittel außen, darüber Heizpause (nach 2 milden Tagen)": "Daily outdoor mean; above it heating pauses (after 2 mild days)",
    "Taupunkt": "Dew point",
    "Temperatur": "Temperature",
    "Temperatur erreicht": "Temperature reached",
    "Temperatur, Luftfeuchte oder Zeitleiste aller Räume": "Temperature, humidity or timeline of all rooms",
    "Temperaturfühler": "Temperature sensor",
    "Test": "Test",
    "Testnachricht an {n} gesendet": "Test message sent to {n}",
    "Thermostat": "Thermostat",
    "Thermostat & Fühler": "Thermostat & sensors",
    "Thermostat nicht erreichbar": "Thermostat unreachable",
    "Thermostat reagiert nicht": "Thermostat not responding",
    "Thermostat, Lüften und Klima eines Raums": "Thermostat, airing and climate of a room",
    "Thermostat-Befehle": "Thermostat commands",
    "Tippe auf einen Raum, um seine Einstellungen zu ändern.": "Tap a room to change its settings.",
    "Tippen zum Aus-/Abwählen. Zählt, sobald eins ihrer Handys in der Zone ist.": "Tap to select/deselect. Counts as soon as one of their phones is in the zone.",
    "Titel": "Title",
    "Typ": "Type",
    "Urlaub": "Vacation",
    "Ventil": "Valve",
    "Ventil voll offen ≈ {v} h": "Valve fully open ≈ {v} h",
    "Ventil ≈ {v} h": "Valve ≈ {v} h",
    "Ventilpflege läuft": "Valve exercise running",
    "Verlauf": "History",
    "Verlauf nicht verfügbar: {e}": "History not available: {e}",
    "Von Hand": "Manual",
    "Vorheizen": "Preheating",
    "Vorheizen ab": "Preheat from",
    "Vormonat": "previous month",
    "Vorwoche": "previous week",
    "Warum": "Why",
    "Was eingestellt ist, wer welche Hinweise bekommt – mit Reglern": "What is configured and who gets which notices – with controls",
    "Was wann warum entschieden wurde · 14 Tage": "What was decided when and why · 14 days",
    "Was wann warum entschieden wurde – live, mit Filtern": "What was decided when and why – live, with filters",
    "Weiter nach": "Resume after",
    "Wer bekommt was": "Who gets what",
    "Wer wohnt hier?": "Who lives here?",
    "Werktags": "Weekdays",
    "Werte mit + / − werden nach kurzer Pause gespeichert; der Raum übernimmt sie sofort. Geräte (Thermostat, Fühler, Kontakte) und Technik änderst du unter „Geräte & Technik ändern“ → Zahnrad beim Raum „{r}“.": "Values changed with + / − are saved after a short pause and applied by the room right away. Change devices (thermostat, sensors, contacts) and technical settings under “Change devices & technical settings” → cog next to room “{r}”.",
    "Wetter (optional)": "Weather (optional)",
    "Wetterbereinigt": "Weather-adjusted",
    "Wetterquelle": "Weather source",
    "Wird übertragen": "Sending",
    "Woche und Monat: Heizstunden, Ersparnis, wetterbereinigter Vergleich, Gesundheit": "Week and month: heating hours, savings, weather-adjusted comparison, health",
    "Wochenbericht": "Weekly report",
    "Wochenende": "Weekend",
    "Wochenende bis": "Weekend until",
    "Wohlfühlbereich": "Comfort range",
    "Wohlfühlzeit": "Comfort time",
    "Wohnraum": "Living room",
    "Wohnung": "Home",
    "Wohnung (Zone)": "Home (zone)",
    "Wohnung anlegen": "Create home",
    "Wohnung „{n}“ angelegt": "Home “{n}” created",
    "Wunsch": "Desired",
    "Wunschtemperatur": "Desired temperature",
    "Zeiten lernen": "Learn times",
    "Ziel & Heizung": "Target & heating",
    "Ziel <b>{v} °C</b>": "Target <b>{v} °C</b>",
    "Ziel <b>{v} °C</b> · von Hand": "Target <b>{v} °C</b> · manual",
    "Ziel {v}°": "Target {v}°",
    "ab 24 h oder Urlaub – Schimmelschutz hält feuchte Räume wärmer": "from 24 h or vacation – mould protection keeps humid rooms warmer",
    "aktuell {v} °C": "currently {v} °C",
    "alle 5 s": "every 5 s",
    "alle waren da": "everyone was home",
    "alles gut": "all good",
    "an": "on",
    "an/aus": "on/off",
    "aus": "off",
    "aus Nachtlüften und Licht – verlängert Ruhezeit und Nachtlüften nur, verkürzt nie": "from night airing and lights – only extends quiet hours and night airing, never shortens",
    "außen {v} °C": "outdoor {v} °C",
    "außen · {h} %": "outdoor · {h} %",
    "bei {v} °C draußen": "at {v} °C outside",
    "beim Einschalten und als Grundwert": "when turning on and as base value",
    "bis": "to",
    "bis {t}": "until {t}",
    "da": "home",
    "damit kurze Wege nichts auslösen": "so short trips don't trigger anything",
    "darunter: „Raum kühlt aus“": "below: “Room cooling down”",
    "durch Absenkung (6 % je Grad)": "from setback (6 % per degree)",
    "einmal pro Nacht": "once per night",
    "endet automatisch bei Ankunft": "ends automatically on arrival",
    "entfernen": "remove",
    "erscheint im Umschalter oben im Dashboard": "shown in the switcher at the top of the dashboard",
    "fällt ein Raum darunter, heizt er immer": "if a room drops below, it always heats",
    "für milde, aber kühle Tage": "for mild but chilly days",
    "gelernt": "learned",
    "gerade: Fenster vermutlich offen · ": "now: window probably open · ",
    "im Schnitt −{v} °C": "on average −{v} °C",
    "ja": "yes",
    "je Heizgradtag ggü. {vs}": "per heating degree day vs. {vs}",
    "jetzt": "now",
    "keine": "none",
    "keine Antwort": "no response",
    "keine Personen in HA": "no persons in HA",
    "keiner": "none",
    "kälter": "colder",
    "lernt noch ({n}/3)": "still learning ({n}/3)",
    "mehr": "more",
    "mittwochs 11 Uhr kurz öffnen": "open briefly on Wednesdays at 11:00",
    "morgen: {h} – Ruhezeit wie am Wochenende": "tomorrow: {h} – quiet hours like on weekends",
    "nein": "no",
    "neue Einträge kommen sofort, zusätzlich wird alle 5 s nachgesehen": "new entries arrive instantly; additionally checked every 5 s",
    "nicht absenken, auch wenn alle Bewohner weg sind": "don't set back, even if all residents are away",
    "niemand": "nobody",
    "noch keine {vs}": "no {vs} yet",
    "nur Dringendes (kühlt aus, Fenster offen bei Abwesenheit, Thermostat-Fehler) kommt laut": "only urgent notices (cooling down, window open while away, thermostat errors) make a sound",
    "offen": "open",
    "prüft nach {s} s · bis zu {n} Wiederholungen": "checks after {s} s · up to {n} retries",
    "sammelt noch": "collecting",
    "sendet …": "sending …",
    "solange das Problem besteht": "as long as the problem persists",
    "synchron": "in sync",
    "umschalten": "toggle",
    "unbekannt": "unknown",
    "weniger": "less",
    "wenn alle weg sind": "when everyone is away",
    "wenn sich jemand nähert": "when someone approaches",
    "wärmer": "warmer",
    "zentral unter Allgemein → Wer bekommt was": "centrally under General → Who gets what",
    "zu": "closed",
    "zu mild für einen Vergleich": "too mild for a comparison",
    "zuletzt {t}": "last {t}",
    "{d} ggü. {vs}": "{d} vs. {vs}",
    "{h} % · Taupunkt {d} °C": "{h} % · dew point {d} °C",
    "{h} % · ca. {m} min": "{h} % · approx. {m} min",
    "{c} ppm · ca. {m} min": "{c} ppm · approx. {m} min",
    "{n} Heizgradtage": "{n} heating degree days",
    "{n} Hinweise": "{n} notices",
    "{n} Räume": "{n} rooms",
    "{n} Wohnungen: {list}. Jede hat eigene Bewohner, Zone, Empfänger, Heizsaison und Protokoll; Räume ordnest du im Raum unter „Wohnung“ zu.": "{n} homes: {list}. Each has its own residents, zone, recipients, heating season and log; assign rooms in the room under “Home”.",
    "{n} heizen": "{n} heating",
    "{n} offen": "{n} open",
    "{n} Räume aus": "{n} rooms off",
    "{n}/4 Nächte": "{n}/4 nights",
    "{n}× vorgeheizt": "preheated {n}×",
    "{r} Räume · {h} heizen · {w} Fenster offen": "{r} rooms · {h} heating · {w} windows open",
    "{r} °C/h bei aktuellem Wetter · aus {n} Aufheizvorgängen · steuert, wann vorgeheizt wird": "{r} °C/h in current weather · from {n} heat-ups · controls when preheating starts",
    "{v} h Fenster offen": "{v} h window open",
    "{v} h Nachtlüften": "{v} h night airing",
    "{v} h Schimmelrisiko": "{v} h mould risk",
    "{v} h zu feucht": "{v} h too humid",
    "~{m} min für +2 °C": "~{m} min for +2 °C",
    "Ältere laden": "Load older",
    "Ø 24 h {p} · Vorhersage {f}": "Ø 24 h {p} · forecast {f}",
    "Ø <b>{v} %</b> Feuchte": "Ø <b>{v} %</b> humidity",
    "Übertragung": "Transmission",
    "– keine –": "– none –",
    "– wählen –": "– choose –",
    "„Länger weg“ ab": "“Away longer” from",
    "„Raumklima Allgemein“ wird gerade eingerichtet – bitte die Seite gleich neu laden.": "“Raumklima General” is being set up – please reload the page in a moment.",
    "… leise warnen unter": "… quiet warning below",
    "↓ {v}° · Wunsch {w}°": "↓ {v}° · desired {w}°",
    "Ausprobieren": "Try it",
    "Bitte schließen": "Please close",
    "Blau = lüften · Orange = schließen · Grün = fertig · Rot = Problem": "Blue = air the room · orange = close · green = done · red = problem",
    "Blinken bei": "Blink on",
    "Lampe hinzufügen": "Add light",
    "Lampen": "Lights",
    "Lampen blinken blau": "Lights are blinking blue",
    "Lichtsignal": "Light signal",
    "Lüft-Countdown auf dem Sperrbildschirm": "Airing countdown on the lock screen",
    "Nicht in der Ruhezeit, nicht beim Schlafen mit offenem Fenster und nicht, wenn niemand zu Hause ist. Lampen ohne Farbe blinken einfach hell.": "Not during quiet hours, not while sleeping with the window open and not when nobody is home. Lights without colour simply blink bright.",
    "Problem mit der Heizung": "Problem with the heating",
    "blinken 3× in der Farbe des Hinweises, danach wie vorher": "blink 3× in the colour of the notice, then back to how they were",
    "Fenster offen seit {c} · {d}": "Window open since {c} · {d}",
    "offen seit {c}": "open since {c}",
    "{d} Tg. {h} h": "{d} d {h} h",
    "{h} h {m} min": "{h} h {m} min",
    "{n} min": "{n} min",
    "{n} s": "{n} s",
    "Art": "Type",
    "Jemand im Raum": "Someone in the room",
    "Leeren Raum absenken": "Lower empty room",
    "Melder": "Sensors",
    "Melder hinzufügen": "Add sensor",
    "PIR": "PIR",
    "Präsenzmelder": "Presence sensors",
    "Präsenzmelder zählen": "Presence sensors count",
    "Raum leer · Ziel <b>{v} °C</b>": "Room empty · target <b>{v} °C</b>",
    "gerade jemand in: {r}": "someone in: {r}",
    "jemand im Raum": "someone in the room",
    "leer": "empty",
    "leer – abgesenkt": "empty – lowered",
    "mmWave": "mmWave",
    "mmWave (Radar) sieht auch Stillsitzende · PIR nur Bewegung": "mmWave (radar) also sees people sitting still · PIR only movement",
    "mmWave + PIR": "mmWave + PIR",
    "nur mmWave": "mmWave only",
    "… um": "… by",
    "… wenn leer seit": "… when empty for",
    "Raum leer seit {d}": "Room empty for {d}",
    "Raum leer seit {d} – abgesenkt": "Room empty for {d} – lowered",
    "sieht ein Melder jemanden, wird nicht abgesenkt – PIR löst auch bei Haustieren aus, darum standardmäßig nur mmWave; im Urlaub zählen Melder nie": "if a sensor sees someone, no setback – PIR also triggers on pets, so mmWave only by default; sensors never count during vacation",
    "Automatisch: Bewegung = PIR, Anwesenheit/Belegung = mmWave. Leer nach 3 min (mmWave) bzw. 20 min (PIR) ohne Meldung": "Automatic: motion = PIR, presence/occupancy = mmWave. Empty after 3 min (mmWave) or 20 min (PIR) without detection",
    "Automatisch: ja (mmWave, passender Raumtyp)": "Automatic: yes (mmWave, suitable room type)",
    "Automatisch: nein – nur Wohnraum, Küche, selten genutzt und nur mit mmWave": "Automatic: no – only living room, kitchen, rarely used and only with mmWave",
    "nie unter „kurz weg“ und den Schimmelschutz; kommt jemand rein, sofort zurück": "never below “briefly away” and mould protection; back immediately when someone comes in",
    "Bericht gesendet: {f}": "Report sent: {f}",
    "Download fehlgeschlagen: {e}": "Download failed: {e}",
    "Herunterladen": "Download",
    "Mail-Dienst (SMTP) in Home Assistant einrichten, dann hier wählen – die PDF kommt als Anhang": "set up a mail service (SMTP) in Home Assistant, then choose it here – the PDF comes as an attachment",
    "Monat": "Month",
    "Noch keine PDF-Berichte. Sie entstehen automatisch: Woche sonntags 18 Uhr, Monat am 1., Heizsaison nach dem Saisonende – oder jetzt mit den Knöpfen oben (bis heute).": "No PDF reports yet. They are created automatically: week on Sundays 18:00, month on the 1st, heating season after the season ends – or now with the buttons above (up to today).",
    "PDF konnte nicht erstellt werden: {e}": "PDF could not be created: {e}",
    "PDF per E-Mail an": "Email PDF to",
    "PDF-Berichte": "PDF reports",
    "Woche": "Week",
    "Wochenbericht jetzt senden": "Send weekly report now",
    "automatisch erstellen: Woche sonntags 18 Uhr, Monat am 1., Heizsaison nach Saisonende – Push mit Link an alle mit „Wochenbericht“": "create automatically: week on Sundays 18:00, month on the 1st, heating season after it ends – push with link to everyone with “weekly report”",
    "bis heute": "up to today",
    "– keine E-Mail –": "– no email –",
    "Heizkosten pro Jahr": "Heating costs per year",
    "optional, laut Abrechnung – nur für die Euro-Schätzung im PDF-Bericht (Ersparnis, „1 °C weniger = … €“)": "optional, from your bill – only for the euro estimate in the PDF report (savings, “1 °C less = … €”)",
    "z. B. 1400": "e.g. 1400",
    "Erklärung": "Explanation",
    "Anbieter": "Provider",
    "Anderer Anbieter": "Other provider",
    "Das Passwort wird nur in Home Assistant gespeichert und nie angezeigt. Tipp: Für Gmail unter myaccount.google.com → Sicherheit → App-Passwörter ein eigenes Passwort für Raumklima erstellen.": "The password is only stored in Home Assistant and never shown. Tip: for Gmail, create a separate password for Raumklima under myaccount.google.com → Security → App passwords.",
    "E-Mail einrichten": "Set up email",
    "Raumklima (direkt hier einrichten)": "Raumklima (set up right here)",
    "Sende Test-Mail …": "Sending test email …",
    "Server-Einstellungen": "Server settings",
    "Speichern & Test-Mail senden": "Save & send test email",
    "Test-Mail an {to} gesendet – bitte Posteingang (und Spam) prüfen.": "Test email sent to {to} – please check your inbox (and spam).",
    "Verschlüsselung": "Encryption",
    "eingerichtet": "set up",
    "füllt Server, Port und Verschlüsselung aus": "fills in server, port and encryption",
    "gespeichert – leer lassen zum Behalten": "saved – leave empty to keep",
    "noch nicht eingerichtet": "not set up yet",
    "„Raumklima“ wählen und unten die Zugangsdaten eintragen – die PDF kommt als Anhang": "choose “Raumklima” and enter the login below – the PDF comes as an attachment",
    "Benutzer": "User",
    "Passwort": "Password",
    "Server": "Server",
    "Port": "Port",
    "Absender": "Sender",
    "meist deine E-Mail-Adresse": "usually your email address",
    "bei Gmail, iCloud, Outlook: App-Passwort": "for Gmail, iCloud, Outlook: app password",
    "mehrere mit Komma": "several separated by commas",
    "leer = Benutzer": "empty = user",
    "hier antippen": "tap here",
    "unten bei „E-Mail einrichten“ die Zugangsdaten eintragen – die PDF kommt als Anhang": "enter your login below under “Set up email” – the PDF comes as an attachment",
    "Eigenes E-Mail-Konto (unten einrichten)": "Own email account (set up below)",
    "Vorhandener Mail-Dienst in Home Assistant": "Existing mail service in Home Assistant",
    "Zugang prüfen": "Check login",
    "Server erreichbar": "Server reachable",
    "Anmeldung": "Login",
    "Prüfe Zugang …": "Checking login …",
    "Alles in Ordnung – du kannst speichern und eine Test-Mail senden.": "All good – you can save and send a test email.",
    "Da stimmt noch etwas nicht – siehe oben.": "Something isn't right yet – see above.",
    "PDF per E-Mail": "PDF by email",
    "die PDF kommt als Anhang an die Empfänger unten": "the PDF is sent as an attachment to the recipients below",
    "darunter einmal „E-Mail einrichten“ – danach kommt jeder Bericht auch per Mail": "set up email below once – then every report also arrives by email",
    "über {s}": "via {s}",
    "Oder vorhandenen Mail-Dienst nutzen": "Or use an existing mail service",
    "statt der Zugangsdaten oben": "instead of the login above",
    "– nein, Zugangsdaten oben –": "– no, use the login above –",
    "Bitte erst unten die Zugangsdaten eintragen und speichern.": "Please enter and save the login below first.",
    "Weitere Thermostate": "Further thermostats",
    "Haupt-Thermostat": "main thermostat",
    "bekommen dieselben Befehle, jedes mit eigener Prüfung und eigenem Korrekturwert": "get the same commands, each with its own check and correction",
    "nicht erreichbar": "unreachable",
    "Ventil Ø": "Valve avg",
    "Bitte Uhrzeit als HH:MM eingeben": "Please enter the time as HH:MM",
    "Ziel {v}° · Wunsch {w}°": "Target {v}° · wish {w}°",
    "Anwesenheit aus": "Presence off",
    "keine Auswertung: nichts wird nach Anwesenheit abgesenkt, nichts vorgeheizt, keine Weg-Meldungen – gedacht, wenn keine Ortung möglich ist": "no evaluation at all: nothing is lowered for absence, nothing preheated, no away messages – for setups without any tracking",
    "nach oben": "up",
    "nach unten": "down",
    "nach Uhrzeit sortieren": "sort by time",
    "Zeitfenster nach Uhrzeit sortiert": "time windows sorted by start",
    "Reihenfolge zählt nur, wenn sich Fenster überschneiden – dann gewinnt das untere": "the order only matters when windows overlap – the lower one wins",
    "Überwachung": "Monitoring",
    "nur Messen": "measuring only",
    "Kein Thermostat": "No thermostat",
    "nur Messen und Hinweise": "measuring and hints only",
    "Temperatur, Feuchte, CO₂ und Lüftungshinweise – ohne Heizungsregelung. Ein Thermostat lässt sich später in der Integration nachtragen.": "Temperature, humidity, CO₂ and ventilation hints – without heating control. A thermostat can be added later in the integration.",
    "Abgleich": "Correction",
    "das Gerät kennt keinen Offset – Raumklima verschiebt stattdessen den Sollwert um die Abweichung zwischen Fühler und Thermostat": "the device has no offset entity – Raumklima shifts the setpoint by the difference between sensor and thermostat instead",
    "Abgesenkt · Wunsch {w}°": "Setback · wish {w}°",
    "Zeitplan · {v}°": "Schedule · {v}°",
    "Boost · {v}°": "Boost · {v}°",
    "Ruhezeit · {v}°": "Quiet time · {v}°",
    "Schimmel · {v}°": "Mould · {v}°",
    "Sonne · {v}°": "Sun · {v}°",
    "Vorheizen · {v}°": "Preheat · {v}°",
    "Leer · {v}°": "Empty · {v}°",
    "Von Hand · {v}°": "Manual · {v}°",
    "Frostschutz {v}°": "Frost {v}°",
    "Einstellung suchen …": "Search settings …",
    "Kein Treffer – anderen Begriff versuchen": "No match – try another term",
    "{n} Einstellungen vom Standard abweichend": "{n} settings differ from the default",
    "Auf Standard zurücksetzen": "Reset to default",
    "Alle Einstellungen dieses Raums auf Standard zurücksetzen? Geräte und Wohnung bleiben erhalten.": "Reset all settings of this room to their defaults? Devices and home stay as they are.",
    "Auf Standard zurückgesetzt": "Reset to defaults",
    "Alles auf Standard": "Everything at default",
    "Darstellung": "Appearance",
    "Kachel": "Tile",
    "Reihenfolge": "Order",
    "Speichern": "Save",
    "große Karte": "Large card",
    "lädt …": "loading …",
    "Reihenfolge gilt im generierten Dashboard und in der Übersicht; Größe „Kachel“ blendet die große Raumseite aus, „aus“ versteckt den Raum ganz. Farbe färbt Rand und Akzente der Karte.": "The order applies to the generated dashboard and the overview; “Tile” hides the large room page, “off” hides the room entirely. The colour tints the card’s edge and accents.",
    "Farbe": "Colour",
    "Aufheizrate": "Heat-up rate",
    "Gerade gilt": "Currently applies",
    "Lade …": "Loading …",
    "Lernen & Warum": "Learning & why",
    "Noch keine Entscheidungen protokolliert.": "No decisions recorded yet.",
    "Protokoll konnte nicht geladen werden.": "The log could not be loaded.",
    "Vorheizen für 2 K": "Preheat for 2 K",
    "Warum? Letzte Entscheidungen": "Why? Recent decisions",
    "Wie sicher?": "How reliable?",
    "aus {n} Aufheizvorgängen gemessen": "measured from {n} heat-up runs",
    "belastbar": "reliable",
    "brauchbar": "usable",
    "mehr Aufheizvorgänge, verlässlichere Vorhersage": "more heat-up runs, more reliable prediction",
    "noch nicht gelernt": "not learned yet",
    "noch unsicher": "still uncertain",
    "so entscheidet die Automatik im Moment": "this is how the automation decides right now",
    "so früh beginnt das Vorheizen vor einem Zeitfenster": "preheating starts this early before a schedule window",
    "was zuletzt entschieden wurde und weshalb": "what was decided recently and why",
    "{v} °C/h": "{v} °C/h",
    "Lüften ab {v} °C": "Airing from {v} °C",
    "Absenkung": "Setback",
    "Fensterlogik an": "Window logic on",
    "Hinweise an": "Notifications on",
    "Kalender antippen – Tag und Monat zählen, das Jahr ist egal": "Tap the calendar – day and month matter, the year does not",
    "auf ~{v}": "up ~{v}",
    "ins Bett ~{v}": "to bed ~{v}",
    "noch zu wenige Nächte – 4 sind nötig": "not enough nights yet – 4 are needed",
    "{b} von 4 Nächten (Bett) · {w} von 4 (Aufstehen)": "{b} of 4 nights (bed) · {w} of 4 (getting up)",
    "Anteil der Tage mit jemand zu Hause": "Share of days with someone at home",
    "Anwesenheit am Tag": "Presence during the day",
    "Uhr": "h",
    "Uhrzeit": "Time",
    "keine klare Zeit – meist niemand zu Hause": "no clear time – usually nobody at home",
    "meist {a}–{b} jemand zu Hause": "usually someone at home {a}–{b}",
    "schließen": "close",
    "wird ab der ersten Woche sichtbar – nur ja/nein, nie wer": "appears after the first week – only yes/no, never who",
    "Übernehmen": "Apply",
    "CO₂ bei {c} ppm – ab 1000 ppm wird es stickig.": "CO₂ at {c} ppm – above 1000 ppm the air gets stale.",
    "Die Luft ist gerade nicht in Ordnung.": "The air is not right at the moment.",
    "Dieser Raum hat kein Thermostat: Raumklima misst hier nur und gibt Hinweise. Geheizt wird über die Heizung, die diesen Raum versorgt.": "This room has no thermostat: Raumklima only measures here and gives hints. Heating is handled by the heating that serves this room.",
    "Empfohlen: etwa {m} Minuten lüften.": "Recommended: air for about {m} minutes.",
    "Feuchte bei {h} % – lüften senkt die Schimmelgefahr.": "Humidity at {h} % – airing lowers the mould risk.",
    "Kein Feuchtefühler – bewertet nur die Temperatur.": "No humidity sensor – only the temperature is assessed.",
    "Luft und Klima sind in Ordnung.": "Air and climate are fine.",
    "Zurück": "Back",
    "Überwachung · kein Thermostat": "Monitoring · no thermostat",
    "Anwesenheitsprofil": "Presence profile",
    "Aus diesem Profil schlägt Raumklima Absenk- und Vorheizzeiten vor.": "Raumklima uses this profile to suggest setback and preheating times.",
    "Vorheizen beginnt 30 Minuten vorher, Absenken endet mit der Ankunft – so bleibt es beim Wunsch, ohne dass die Heizung leer läuft.": "Preheating starts 30 minutes earlier, setback ends on arrival – so it stays at the target without heating an empty home.",
    "Vorschlag": "Suggestion",
    "Wochenende ab {a}": "weekend from {a}",
    "ab einer erfassten Woche": "after one recorded week",
    "{a} bis {b}": "{a} to {b}",
    "Thermostat {v}° (Abgleich {o}°)": "Thermostat {v}° (offset {o}°)",
    "Feinstaub": "Particulate matter",
    "Feinstaubfühler": "Particulate sensor",
    "15-Minuten-Raster": "15-minute grid",
    "Alle 15 Minuten ein Häkchen „jemand da oder nicht“, rollierend 4 Wochen. Es wird nie erfasst, wer zu Hause ist.": "Every 15 minutes a tick for “someone home or not”, rolling over 4 weeks. It never records who is at home.",
    "Antippen einer Zeile zeigt die vollständige Begründung.": "Tap a row to see the full reason.",
    "Aus der Aufheizrate und der Außentemperatur wird geschätzt, wie viele Minuten vor einem Zeitfenster gestartet werden muss.": "The heat-up rate and outdoor temperature are used to estimate how many minutes before a schedule window heating must start.",
    "Bereich": "Area",
    "Entscheidungen": "Decisions",
    "Gemessen wird, wie schnell der Raum bei geöffnetem Ventil wärmer wird – nur ab 0,3 K Anstieg, damit Messrauschen nicht zählt.": "It measures how fast the room warms up with the valve open – only from a 0.3 K rise, so sensor noise does not count.",
    "Genauigkeit": "Accuracy",
    "Gezählt wird jede Nacht einmal, aus Nachtlüften und Lichtsignalen. Ruhezeit beginnt 30 Minuten vor der typischen Bettzeit.": "Each night counts once, from night airing and light signals. Quiet time starts 30 minutes before the typical bedtime.",
    "Grenzen": "Limits",
    "Heizpause → Abwesenheit → Boost → Zeitfenster → Ruhezeit → Vorheizen → leer/Sonne → Wunsch. Das oberste zutreffende gewinnt.": "Heating pause → away → boost → schedule → quiet time → preheat → empty/solar → wish. The topmost match wins.",
    "Keine Entscheidungen in diesem Zeitraum.": "No decisions in this period.",
    "Lüften": "Airing",
    "Median aus echten Vorgängen": "median from real runs",
    "Median der letzten 6 Wochen": "median of the last 6 weeks",
    "Rate × fehlende Kelvin": "rate × missing kelvin",
    "Schlafzeiten": "Sleep times",
    "Unter 3 Vorgängen unsicher, ab 6 belastbar. Mehr Messungen = engere Vorhersage; alte Werte verfallen mit der Zeit.": "Below 3 runs uncertain, from 6 reliable. More measurements mean a tighter prediction; old values fade over time.",
    "Urlaub, Schichtdienst und unregelmäßige Tage verfälschen das Profil. Deshalb schlägt Raumklima nur vor und stellt nichts von selbst um.": "Holidays, shift work and irregular days distort the profile. That is why Raumklima only suggests and never changes anything by itself.",
    "Zeitfenster, in denen an mindestens 60 % der Tage jemand da war, gelten als typische Anwesenheit – daraus folgen Vorheiz- und Absenkzeiten.": "Times when someone was home on at least 60 % of days count as typical presence – preheating and setback times follow from it.",
    "Zeitraum": "Period",
    "Ziel geändert": "target changed",
    "aus dem Profil": "from the profile",
    "ehrlich": "honest",
    "feste Reihenfolge": "fixed order",
    "wächst mit Messungen": "grows with measurements",
    "Diagnose": "Diagnostics",
    "Diagnose wird erstellt …": "Creating diagnostics …",
    "Diagnose heruntergeladen": "Diagnostics downloaded",
    "Alle Werte, Entitäten und die letzten Log-Zeilen als Datei": "All values, entities and the latest log lines in one file",
    "Lüften ohne Erinnerung": "Airing without reminders",
    "Dauerlüftung ab": "Long airing from",
    "danach keine Erinnerungen mehr, bis das Fenster zu ist – 0 schaltet es aus": "after that no reminders until the window is closed – 0 disables it",
    "Leise Erinnerung danach": "Quiet reminder after",
    "eine einzige, stille Meldung bei sehr langem Lüften – 0 = aus": "a single silent message for very long airing – 0 = off",
    "Gewohntes Lüften erkennen": "Recognise habitual airing",
    "lernt, wann du regelmäßig länger lüftest – dort dann keine Erinnerungen": "learns when you regularly air for longer – no reminders there",
    "erkannt: {n}× im gleichen Zeitraster (4 Wochen)": "recognised: {n}× in the same time slot (4 weeks)",
    "Lüftfenster": "Airing window",
    "Lüftfenster {n}": "Airing window {n}",
    "keine – es wird normal erinnert": "none – reminders work as usual",
    "z. B. Training morgens: in dieser Zeit keine Hinweise": "e.g. morning workout: no reminders during this time",
    "Dauerlüftung": "Long airing",
    "Gewohntes Lüften": "Habitual airing",
    "Geplantes Lüften": "Planned airing",
    "Dauerlüftung – ich erinnere nicht": "Long airing – no reminders",
    "Gewohntes Lüften – keine Erinnerung": "Habitual airing – no reminders",
    "Geplantes Lüften – keine Erinnerung": "Planned airing – no reminders",
    "Gäste gelten für": "Guests apply to",
    "nur diese Räume werden nicht abgesenkt": "only these rooms are not set back",
    "keine Auswahl = alle Räume der Wohnung": "no selection = all rooms of the apartment",
    "Schnellere Abfrage": "Faster polling",
    "fragt das Thermostat alle 2 Minuten aktiv ab – für träge Geräte (Homematic & Co.), kostet Funk und Batterie": "actively asks the thermostat every 2 minutes – for sluggish devices (Homematic & co.), costs radio time and battery",
    "Batterie {p} %": "Battery {p} %",
    "Zeitplan überschreiben": "Override schedule",
    "so lange gilt deine Handverstellung (HA oder Alexa), danach wieder der Zeitplan – 0 schaltet es aus": "how long your manual setting (HA or Alexa) applies, then the schedule returns – 0 disables it",
    "Karte konnte nicht gezeichnet werden": "The card could not be rendered",
    "Nur wenn jemand im Raum war": "Only if someone was in the room",
    "keine „bitte lüften“-Hinweise in leeren Räumen (nur mit Präsenzmelder möglich)": "no “please air” hints in empty rooms (only possible with a presence sensor)",
    "kein „bitte lüften“ in leeren Räumen – nur mit Präsenzmelder möglich": "no “please air” in empty rooms – only possible with a presence sensor",
    "Nur an anwesende Personen": "Only to people who are home",
    "Lüft-Hinweise nur an Handys von Personen, die laut Ortung zu Hause sind – dringende Meldungen (Fenster offen bei Abwesenheit, Frost, Ausfall) gehen weiter an alle": "airing hints only to phones of people who are home according to location – urgent messages (window open while away, frost, failure) still go to everyone",
    "Fehler melden": "Report a bug",
    "Öffnet ein neues GitHub-Issue mit Version, Home-Assistant-Version und Thermostat-Modell – ohne Raumnamen oder Entitäten": "opens a new GitHub issue with version, Home Assistant version and thermostat model – without room names or entities",
    "Sturm- und Regenwarnung": "Storm and rain warning",
    "warnt, wenn Sturm oder Starkregen angekündigt ist und ein Fenster offen steht – kommt auch in der Ruhezeit": "warns when a storm or heavy rain is forecast and a window is open – also during quiet hours",
    "… Böen ab": "… gusts from",
    "ab dieser Böenstärke gilt es als Sturm": "from this gust speed it counts as a storm",
    "… Regen ab": "… rain from",
    "ab dieser Regenmenge gilt es als Starkregen": "from this amount of rain it counts as heavy rain",
    "Sturm & Starkregen": "Storm & heavy rain",
    "Zeitplan von": "Schedule from",
    "eigener Zeitplan": "own schedule",
    "Die Zeitfenster werden im gewählten Raum gepflegt – Änderungen gelten hier automatisch mit": "the windows are maintained in the selected room – changes apply here automatically",
    "Zeitfenster einmal pflegen und für mehrere Räume nutzen": "maintain the windows once and use them for several rooms",
    "Übliche Nutzung": "Typical usage",
    "sammelt noch – nur mit Präsenzmelder": "still collecting – presence sensor required",
    "Vorschlag aus der Belegung je Wochentag; ein Zeitfenster legst du selbst an": "suggestion from occupancy per weekday; you create a schedule window yourself",
    "Sichern": "Back up",
    "Wiederherstellen": "Restore",
    "Alle Einstellungen als Datei sichern – ohne Passwörter": "save all settings as a file – without passwords",
    "Sicherung einspielen – Räume werden über ihren Namen zugeordnet": "apply a backup – rooms are matched by their name",
    "Sicherung wird erstellt …": "creating backup …",
    "Sicherung gespeichert": "backup saved",
    "Sicherung fehlgeschlagen: {e}": "backup failed: {e}",
    "Einstellungen aus dieser Datei einspielen? Die aktuellen Einstellungen werden überschrieben.": "apply the settings from this file? current settings will be overwritten.",
    "Eingespielt: {n} Räume": "restored: {n} rooms",
    "Eingespielt: {n} Räume · {m} nicht gefunden": "restored: {n} rooms · {m} not found",
    "Erste Schritte": "First steps",
    "Bewohner hinterlegt": "Residents set up",
    "Empfänger für Meldungen": "Notification recipients",
    "Wetterquelle gewählt": "Weather source selected",
    "Raum mit Thermostat": "Room with thermostat",
    "Fensterkontakt eingetragen": "Window contact added",
    "Zeitplan angelegt": "Schedule created",
    "Präsenzmelder eingetragen": "Presence sensor added",
    "Sturmschwelle geprüft": "Storm threshold checked",
    "{a} von {b} erledigt": "{a} of {b} done",
    "bereit": "ready",
    "noch offen": "still open",
    "erledigt": "done",
    "optional": "optional",
    "die wichtigsten Schritte, damit Raumklima sinnvoll regeln kann": "the most important steps so Raumklima can control sensibly",
    "Einstellungen → Anwesenheit & Absenkung": "Settings → Presence & setback",
    "Einstellungen → Wer bekommt was": "Settings → Who gets what",
    "Einstellungen → Benachrichtigungen allgemein": "Settings → Notifications",
    "Raum → Geräte": "Room → Devices",
    "Raum → Fenster & Lüften": "Room → Windows & airing",
    "Raum → Zeitplan": "Room → Schedule",
    "Raum → Anwesenheit im Raum": "Room → Presence in room",
    "Einstellungen → Sturm- und Regenwarnung": "Settings → Storm and rain warning",
    "bringt mehr Genauigkeit, ist aber nicht nötig": "adds accuracy but is not required",
    "Außentemperatur von": "Outdoor temperature from",
    "Wetterdienst": "Weather service",
    "eigene Wetterstation statt Wetterdienst – die Vorhersage kommt weiterhin vom Wetterdienst": "your own weather station instead of the weather service – the forecast still comes from the weather service",
    "Fehler melden: Issue-Vorlage geöffnet – Link liegt in der Zwischenablage": "Report a problem: issue template opened – link copied to clipboard",
    "Fehler melden: Issue-Vorlage im neuen Tab geöffnet": "Report a problem: issue template opened in a new tab",
    "Fehler melden: Link zum Issue – bitte im Browser öffnen: {url}": "Report a problem: issue link – please open it in a browser: {url}",
    "Sicherung gespeichert: {name}": "Backup saved: {name}",
    "Sicherung gespeichert: {name} · liegt zusätzlich in der Zwischenablage": "Backup saved: {name} · also copied to the clipboard",
    "Sicherung gespeichert: {name} – falls keine Datei kam, blockt der Browser den Download": "Backup saved: {name} – if no file appeared, the browser is blocking the download",
    "Sicherung wird geprüft …": "Checking backup …",
    "Streng nach DIN": "Strict per DIN",
    "Nur bis Wunsch": "Only up to wish",
    "Schimmelschutz": "Mould protection",
    "hebt den Sollwert so weit an, dass die kälteste Wandstelle unter 80 % Feuchte bleibt (DIN 4108-2) – auch über den Wunsch hinaus": "raises the target so that the coldest wall spot stays below 80 % humidity (DIN 4108-2) – even above the wish",
    "hebt nur bis zur Wunschtemperatur an – tiefer wird nicht abgesenkt, aber auch nicht darüber geheizt": "raises only up to the desired temperature – never set back below it, but never heated above it either",
    "kein Feuchte-Boden: der Raum fährt genau den eingestellten Wert – bei hoher Feuchte droht Schimmel an kalten Wänden": "no humidity floor: the room runs exactly at the set value – with high humidity, cold walls risk mould",
    "Mindestdauer Lüften": "Minimum airing time",
    "automatisch": "automatic",
    "so lange bleibt „Lüften läuft“ mindestens stehen, auch wenn die Feuchte schon passt": "“airing in progress” stays at least this long, even if humidity is already fine",
    "automatisch: 60 % der empfohlenen Dauer, mindestens 4 Minuten (gerade {v} min)": "automatic: 60 % of the recommended time, at least 4 minutes (currently {v} min)",
    "Kurz weg": "Briefly away",
    "Außerhalb der Zeitfenster": "Outside the schedule windows",
    "wie bisher: ohne laufendes Fenster gilt die Wunschtemperatur": "as before: without an active window the desired temperature applies",
    "zwischen den Fenstern wird auf „kurz weg“ abgesenkt": "between windows the room drops to “briefly away”",
    "zwischen den Fenstern wird auf „länger weg“ abgesenkt – für Räume, die nur stundenweise genutzt werden": "between windows the room drops to “longer away” – for rooms used only a few hours a day",
    "zwischen den Fenstern gilt nur der Frostschutz – der kälteste erlaubte Wert": "between windows only frost protection applies – the lowest allowed value",
    "Arbeitszimmer": "Office",
    "Gästezimmer": "Guest room",
    "Flur": "Hallway",
    "Sportzimmer": "Home gym",
    "jederzeit änderbar – Standardwerte des neuen Typs werden übernommen, eigene Werte bleiben": "changeable at any time – the new type's defaults are applied, your own values are kept",
    "Schimmel": "Mould",
    "Leer": "Empty",
    "Sonne": "Sun",
    "Frost": "Frost",
    "Ventilpflege": "Valve care",
    "{tag} {v}° · Wunsch {w}°": "{tag} {v}° · target {w}°",
    "{tag} {v}°": "{tag} {v}°",
    "Die Karte im Browser ist älter als die Integration – Seite mit Strg+Shift+R neu laden.": "The card in the browser is older than the integration – reload with Ctrl+Shift+R.",
    "neu: {v} – Seite neu laden": "new: {v} – reload page",
    "Schimmel +{d}°": "Mould +{d}°",
    "Schimmelschutz <b>+{d} °C</b> auf {v} °C · {rh} % Feuchte im Tagesmittel": "Mould protection <b>+{d} °C</b> to {v} °C · {rh} % humidity (24 h average)",
    "Schimmelschutz <b>{v} °C</b>": "Mould protection <b>{v} °C</b>",
    "bestimmt, wie kalt die kälteste Wandstelle wird: eine Außenecke braucht mehr Schutz als eine Innenwand": "sets how cold the coldest wall spot gets: an outer corner needs more protection than an inside wall",
    "wie die Wohnung": "as the home",
    "Außenecke": "outer corner",
    "Außenwand": "outer wall",
    "innenliegend": "internal",
    "Feuchtequelle im Raum": "Humidity source",
    "Höchstens anheben um": "Raise by at most",
    "Heizen löst kein Feuchteproblem: über diesem Zuschlag wird nicht weiter geheizt, sondern zum Lüften geraten (nachts 1,5 K)": "Heating does not fix humidity: beyond this uplift it stops heating and advises airing (1.5 K at night)",
    "Feuchte zu hoch für die Wand · {rh} % im Tagesmittel, {h} h kritisch – bitte lüften": "Humidity too high for this wall · {rh} % (24 h average), {h} h critical – please air",
    "hebt den Sollwert so weit an, dass die kälteste Wandstelle unter 80 % Feuchte bleibt (DIN 4108-2) – begrenzt durch den Zuschlag darunter": "raises the setpoint until the coldest wall spot stays below 80 % humidity (DIN 4108-2) – limited by the uplift below",
    "GitHub öffnen": "Open GitHub",
    "Teilen": "Share",
    "Kopieren": "Copy",
    "Schließen": "Close",
    "Sicherung erstellt": "Backup created",
    "Enthält alle Räume, Zeitpläne und Einstellungen dieser Wohnung. Auf dem iPhone/iPad über „Teilen“ in Dateien sichern, am Rechner über „Speichern“.": "Contains all rooms, schedules and settings of this home. On iPhone/iPad use Share → Save to Files, on a computer use Save.",
    "Gespeichert: {name} – falls keine Datei kam, bitte Teilen benutzen": "Saved: {name} – if no file appeared, please use Share",
    "Kopiert – jetzt im Ziel einfügen": "Copied – now paste it",
    "Kopieren hat der Browser blockiert – Text bitte im Feld markieren": "The browser blocked copying – please select the text in the field",
    "Zum Melden eines Fehlers: teilen oder speichern – die Datei enthält Werte, Entitäten und die letzten Protokollzeilen, aber keine Zugangsdaten.": "To report a problem: share or save – the file contains values, entities and the last log lines, but no credentials.",
    "Text prüfen – es stehen keine Raumnamen oder Zugangsdaten darin –, dann GitHub öffnen und den Text einfügen. Auf dem iPhone oder iPad geht auch Teilen oder Kopieren.": "Check the text – it contains no room names or credentials – then open GitHub and paste it. On iPhone or iPad you can also share or copy.",
    "Datei laden": "Load file",
    "Gespeichert: {name} – falls keine Datei kam, bitte Datei laden benutzen": "Saved: {name} – if no file appeared, please use Load file",
    "Kopieren hat der Browser blockiert – Text bitte im Feld markieren und selbst kopieren": "The browser blocked copying – please select the text in the field and copy it",
    "Geteilt": "Shared",
    "Zum Melden eines Fehlers: die Datei laden und an das Issue anhängen. Sie enthält Werte, Entitäten und die letzten Protokollzeilen, aber keine Zugangsdaten.": "To report a problem: load the file and attach it to the issue. It contains values, entities and the last log lines, but no credentials.",
    "Wärmemenge im Bericht": "Heat delivered in the report",
    "Ventilstellung": "Valve position",
    "Gradstunden": "Degree-hours",
    "automatisch = Ventilstellung, wenn jedes Thermostat sie meldet – sonst Gradstunden unter Ziel (gemessen, nicht geschätzt)": "automatic = valve position if every thermostat reports it – otherwise degree-hours below target (measured, not estimated)",
    "{v} K·h unter Ziel": "{v} K·h below target",
    "{v} h geheizt": "{v} h heating",
    "{v} h nicht erreichbar": "{v} h unreachable",
    "Balken = Gradstunden unter Ziel (K·h): wie weit die Räume über die Zeit unter ihrem Ziel lagen. Das ist gemessen, nicht geschätzt – die Geräte melden keine Ventilstellung.": "Bars = degree-hours below target (K·h): how far the rooms were below their target over time. Measured, not estimated – the devices do not report a valve position.",
    "Balken = Heizstunden: wie lange die Räume Wärme angefordert haben.": "Bars = heating hours: how long the rooms asked for heat.",
    "Balken = wie lange die Ventile umgerechnet voll offen waren (Maß für die Wärmemenge).": "Bars = how long the valves were fully open, converted (a measure of heat delivered).",
    "Punkte = Heizgradtage: je kälter es draußen war, desto höher. Hohe Balken an milden Tagen sind ein Hinweis auf offene Fenster oder zu hohe Wunschtemperaturen.": "Dots = heating degree days: the colder it was outside, the higher. Tall bars on mild days point to open windows or too high target temperatures.",
    "Antwortzeit des Geräts": "Device response time",
    "automatisch lernen": "learn automatically",
    "1 Minute": "1 minute",
    "5 Minuten": "5 minutes",
    "15 Minuten": "15 minutes",
    "30 Minuten": "30 minutes",
    "wie lange das Gerät schweigen darf, ohne als ausgefallen zu gelten – automatisch lernt es aus den Funkpausen (FRITZ!DECT braucht ~15 Minuten)": "how long the device may stay silent before it counts as unreachable – automatic learns from the radio pauses (FRITZ!DECT needs ~15 minutes)",
    "Bericht konnte nicht gezeichnet werden: {e}": "The report could not be drawn: {e}",
    "Hinweise für diesen Raum pausiert": "Notifications paused for this room",
    "Pause bis {time}": "Paused until {time}",
    "Dunkler Look": "Dark look",
    "Immer dunkel": "Always dark",
    "Immer hell": "Always light",
    "gilt für alle Karten dieser Wohnung": "applies to all cards of this home",
    "{n} Thermostate": "{n} thermostats",
    "Haupt": "Main",
    "erwartet {v}°": "expected {v}°",
    "Jedes Thermostat mit eigenem Sollwert und eigener Öffnung": "Each thermostat with its own setpoint and opening",
    "gilt für alle Räume und Karten dieser Wohnung": "applies to all rooms and cards of this home",
    "meldet keine Ventilöffnung": "reports no valve opening",
    "Absenkwert nachts": "Night setback value",
    "Frostschutz": "Frost protection",
    "Immer": "Always",
    "Nachtabsendung": "Night setback",
    "Nie": "Never",
    "gilt bei der Ruhezeit und wenn der Schalter „Nachtruhe“ an ist – je Raum unter „Nachtabsendung“ ein- oder ausgeschlossen": "applies during quiet hours and when the “Night mode” switch is on – include or exclude each room under “Night setback”",
    "wie bisher: nur Schlafzimmer und selten genutzte Räume": "as before: only bedrooms and rarely used rooms",
    "wird abgesenkt, sobald Ruhezeit ist oder der Schalter „Nachtruhe“ an ist": "is set back as soon as quiet hours apply or the “Night mode” switch is on",
    "wird nachts nicht abgesenkt": "is not set back at night",
    "1 h": "1 h",
    "15 min": "15 min",
    "2 h": "2 h",
    "30 min": "30 min",
    "Bis Zeitfenster": "Until next schedule",
    "Ohne Limit": "No limit",
    "Wie lange soll es wärmer sein?": "How long should it stay warmer?",
    "läuft noch {m} min": "{m} min left",
    "läuft ohne Zeitlimit": "runs without time limit",
    "Gilt für Personen": "Applies to people",
    "Urlaub automatisch ab": "Vacation detected beyond",
    "… nach": "… after",
    "erst so lange weit weg zählt als Urlaub (Tagesausflug löst nicht aus)": "only after this long does being far away count as vacation (a day trip does not trigger it)",
    "keine Auswahl = der Raum gilt allen Bewohnern": "no selection = the room applies to all residents",
    "nur wenn eine dieser Personen zu Hause ist – sonst wird der Raum abgesenkt": "only while one of these people is home – otherwise the room is set back",
    "sind alle Bewohner weiter weg, gilt nach der Wartezeit Urlaub – 0 = aus": "if all residents are farther away, vacation applies after the delay – 0 = off",
    "Erst zum Zeitplan": "Only at the schedule",
    "Frühestens ab": "Not before",
    "Frühestens vorher": "At most this early",
    "ab {h}:00": "from {h}:00",
    "heizt erst zum Beginn des Zeitfensters – der Raum ist dann noch kalt": "heats only when the schedule starts – the room is still cold then",
    "so viele Minuten vor dem Zeitfenster": "this many minutes before the schedule",
    "startet höchstens so viele Minuten vor dem Zeitfenster": "starts at most this many minutes before the schedule",
    "startet nicht vor der eingestellten Uhrzeit – zum Beginn evtl. noch nicht ganz warm": "never starts before the set time – may not be fully warm at the start",
    "startet so früh, wie die gelernte Aufheizzeit es verlangt": "starts as early as the learned heat-up time requires",
    "… höchstens": "… at most",
    "… nicht vor": "… not before",
    "Homeoffice": "Home office",
    "Homeoffice gilt für": "Home office applies to",
    "Homeoffice · {v}°": "Home office · {v}°",
    "Homeoffice-Fenster": "Home office window",
    "im Fenster gilt der Wunsch, der Zeitplan pausiert": "during the window the wish applies, the schedule pauses",
    "keine Auswahl = alle Räume mit Thermostat": "no selection = all rooms with a thermostat",
    "nur diese Räume werden auf Wunsch geheizt": "only these rooms are heated to the wish",
    "in dieser Zeit heizen die gewählten Räume auf Wunsch; danach läuft der Zeitplan weiter": "during this time the selected rooms heat to the wish; afterwards the schedule runs again",
    "Homeoffice nur wenn jemand da": "Home office only when someone is home",
    "gilt für Kalendertermine; der Schalter heizt auch ohne Ortung": "applies to calendar events; the switch heats even without presence tracking",
    "0 °C = aus; sonst gilt der Zeitplan": "0 °C = off; otherwise the schedule applies",
    "Anwesend · {v}°": "Occupied · {v}°",
    "Bei Anwesenheit": "When someone is present",
    "HA-Schalter, der Homeoffice mit schaltet – gilt wie der Schalter, ohne Anwesenheitsprüfung": "HA switch that also turns home office on – works like the switch, without the presence check",
    "HA-Schalter, der die Nachtruhe mit schaltet – der eigene Schalter bleibt": "HA switch that also turns on night mode – the built-in switch stays",
    "Homeoffice über Entität": "Home office via entity",
    "Nachtruhe über Entität": "Night mode via entity",
    "so warm, solange ein Melder jemanden im Raum sieht": "this warm while a sensor sees someone in the room"
  };

  // src/i18n/fr.js
  var FR = {
    "auch „Abgleich“ genannt: das Gerät kennt keinen Offset – Raumklima verschiebt stattdessen den Sollwert um die Abweichung zwischen Fühler und Thermostat": "aussi appelé « équilibrage » : l’appareil n’a pas d’offset, Raumklima décale donc la consigne de l’écart entre capteur et thermostat",
    "Lüfthinweise von": "Conseils d’aération à partir de",
    "Bitte lüften, Fenster schließen und Luft ausgetauscht nur in dieser Zeit – nachts bleibt es still, Raum kühlt aus, Frost und Gerätefehler melden sich weiter": "Aérer, fermer la fenêtre et air renouvelé uniquement pendant cette plage – silencieux la nuit ; refroidissement, gel et pannes d’appareil continuent d’alerter",
    "Höchstens je Tag": "Au maximum par jour",
    "unbegrenzt": "illimité",
    "{n} je Tag": "{n} par jour",
    "gilt für wiederkehrende Hinweise (Bitte lüften, Fenster bleibt offen) – Fenster schließen und Luft ausgetauscht bleiben frei": "vaut pour les rappels récurrents (aérer, fenêtre reste ouverte) – fermer la fenêtre et air renouvelé restent sans limite",
    "CO₂-Grenze": "Seuil de CO₂",
    "1000 ppm ist der klassische Richtwert – in einem Wohnzimmer mit mehreren Personen liegt man abends dauerhaft darüber, 1200 ppm sind dort realistischer": "1000 ppm est la valeur de référence classique – dans un salon avec plusieurs personnes on la dépasse toute la soirée, 1200 ppm y sont plus réalistes",
    "ab der Grenze unten: Bitte lüften": "au-dessus du seuil ci-dessous : aérer",
    "Anlegen nicht möglich – bitte in den Einstellungen unter Dashboards prüfen": "Création impossible – vérifie Réglages → Tableaux de bord",
    "Breite": "Latitude",
    "Dashboard mit der Raumklima-Strategie anlegen": "Créer le tableau de bord avec la stratégie Raumklima",
    "Dashboard „{d}“ angelegt": "Tableau de bord « {d} » créé",
    "Dauer des Boosts": "Durée du boost",
    "Boost · Ziel <b>{v} °C</b>": "Boost · cible <b>{v} °C</b>",
    "Boost": "Boost",
    "Erweitert: Sonneneintrag": "Avancé : apport solaire",
    "Erweitert: Standort der Wohnung": "Avancé : emplacement du logement",
    "Für diese Wohnung gibt es noch kein Dashboard „{d}“ – der Knopf legt es mit der Raumklima-Strategie an (gefiltert auf diese Wohnung).": "Ce logement n'a pas encore de tableau de bord « {d} » – le bouton le crée avec la stratégie Raumklima (filtré sur ce logement).",
    "Für diese Wohnung ist noch kein eigenes Dashboard eingerichtet – erst anlegen, dann lässt sich umschalten.": "Aucun tableau de bord n’a encore été créé pour ce logement – créez-le d’abord, ensuite vous pourrez basculer.",
    "Für eine zweite Wohnung (z. B. Ferienwohnung) mit eigenen Bewohnern, Zone und Empfängern hier anlegen. Bestehende Räume bleiben in dieser Wohnung.": "Créer ici un second logement (p. ex. une résidence secondaire) avec ses propres habitants, sa zone et ses destinataires. Les pièces existantes restent dans ce logement.",
    "Handbuch (PDF)": "Manuel (PDF)",
    "Anleitung, Funktionen und häufige Fragen": "Installation, fonctions et questions fréquentes",
    "Jede Nacht zählt einmal (frühestes Ereignis). Gelernt wird zuerst je Wochentag (Schichtdienst), sonst nach Werktag und Wochenende (Fr→Sa, Sa→So); gelernt wird der typische Wert (Median) der letzten 6 Wochen, sobald 4 Nächte da sind. Die Ruhezeit beginnt 30 min vor der typischen Bettzeit und endet 30 min nach dem Aufstehen – aber nie kürzer als eingestellt.": "Chaque nuit compte une fois (événement le plus tôt). L’apprentissage se fait d’abord par jour de la semaine (travail posté), sinon par semaine/week-end (ven→sam, sam→dim) ; la valeur typique (médiane) des 6 dernières semaines est apprise dès 4 nuits. L’heure de repos commence 30 min avant le coucher typique et se termine 30 min après le lever – mais jamais plus courte que le réglage.",
    "Leer lassen = es gilt der Standort aus der Zone dieser Wohnung ({zone}{zl}). Ist keine Zone gesetzt, gilt der Standort von Home Assistant ({lat} / {lon}). Nur eintragen, wenn die Wohnung woanders liegt – daraus rechnet Raumklima den Sonnenstand; „von HA“ übernimmt die HA-Werte zum Anpassen.": "Laisser vide = l’emplacement vient de la zone de ce logement ({zone}{zl}). Sans zone, celui de Home Assistant s’applique ({lat} / {lon}). À remplir seulement si le logement est ailleurs – Raumklima en calcule la position du soleil ; « de HA » reprend les valeurs de Home Assistant pour les ajuster.",
    "Länge": "Longitude",
    "Neue Wohnung, z. B. Ferienwohnung": "Nouveau logement, p. ex. résidence secondaire",
    "Nord": "Nord",
    "Nordost": "Nord-est",
    "Nordwest": "Nord-ouest",
    "Ost": "Est",
    "Richtung, in die die Fenster dieses Raums zeigen – vereinfacht, freie Sicht vorausgesetzt. Haus, Baum, Balkon oder ein tiefes Gewände davor zählt nicht mit; dann lieber leer lassen (nur Vorhersage). Bei zwei Fensterseiten: die mit der größeren Glasfläche.": "Direction vers laquelle donnent les fenêtres de cette pièce – simplifié, vue dégagée supposée. Un bâtiment, un arbre, un balcon ou un ébrasement profond devant n’est pas pris en compte ; dans ce cas, mieux vaut laisser vide (prévision seule). Avec deux côtés vitrés : celui qui a la plus grande surface vitrée.",
    "Ruhezeit senkt ab": "L’heure de repos abaisse",
    "Ruhezeit · Ziel <b>{v} °C</b>": "Heure de repos · cible <b>{v} °C</b>",
    "Schimmelschutz · Ziel <b>{v} °C</b>": "Protection moisissure · cible <b>{v} °C</b>",
    "Schichtdienst": "Travail posté",
    "Sonne kommt aus": "Le soleil vient de",
    "Standort der Wohnung": "Emplacement du logement",
    "Süd": "Sud",
    "Südost": "Sud-est",
    "Südwest": "Sud-ouest",
    "Tageswerte je Raum als Tabelle (CSV)": "Valeurs journalières par pièce en tableau (CSV)",
    "Export fehlgeschlagen: {e}": "Échec de l’export : {e}",
    "Kalender": "Calendrier",
    "Thermostat {v}°": "Thermostat {v}°",
    "Vorheizen für Zeitplan · <b>{v} °C</b>": "Préchauffage pour le planning · <b>{v} °C</b>",
    "Werte von Home Assistant übernehmen": "Reprendre les valeurs de Home Assistant",
    "West": "Ouest",
    "Wohnung „{n}“ angelegt – Dashboard „{d}“ gleich mit": "Logement « {n} » créé – tableau de bord « {d} » inclus",
    "anlegen": "créer",
    "auch Tagschlaf lernen: ins Bett bis 09:00, aufstehen bis 17:00 – für Nachtschicht und Wechselschicht": "apprendre aussi le sommeil de jour : coucher jusqu’à 09:00, lever jusqu’à 17:00 – pour le travail de nuit et en équipes",
    "bei Sonne 1 °C weniger heizen – die Sonne wärmt mit": "chauffer 1 °C de moins quand le soleil est là – il réchauffe la pièce",
    "egal – nur Vorhersage": "peu importe – prévision seule",
    "keine Zone gesetzt": "aucune zone définie",
    "leeren – dann gilt Home Assistant": "vider – Home Assistant s’applique alors",
    "nur Vorhersage": "prévision seule",
    "von HA": "de HA",
    "vorhanden": "présent",
    "während der Ruhezeit werden Schlafzimmer und selten genutzte Räume abgesenkt – auch wenn jemand zu Hause ist": "pendant l’heure de repos, les chambres et les pièces peu utilisées sont abaissées – même si quelqu’un est à la maison",
    "z. B. Ferienwohnung": "p. ex. résidence secondaire",
    "z. B. abends 19–21 Uhr wärmer": "p. ex. plus chaud le soir de 19 h à 21 h",
    "von": "de",
    "täglich": "tous les jours",
    "so viel wärmer als die Wunschtemperatur – der Knopf „Wärmer“ am Raum startet ihn": "c’est le surplus par rapport à la température souhaitée – le bouton « Plus chaud » de la pièce le lance",
    "noch {m} min": "encore {m} min",
    "keine – die Automatik regelt wie gewohnt": "aucune – la régulation fonctionne comme d’habitude",
    "danach gilt wieder Zeitplan bzw. Automatik": "ensuite, le planning ou la régulation s’applique de nouveau",
    "Zeitplan · Ziel <b>{v} °C</b>": "Planning · cible <b>{v} °C</b>",
    "Zeitplan": "Planning",
    "Zeitfenster {n}": "Plage horaire {n}",
    "Zeitfenster hinzufügen": "Ajouter une plage horaire",
    "Zeitfenster": "Plage horaire",
    "Wärmer für kurze Zeit (Boost)": "Plus chaud un moment (boost)",
    "Wärmer für kurze Zeit": "Plus chaud un moment",
    "{n} Dashboard(s) für deine Wohnungen angelegt": "{n} tableau(x) de bord créé(s) pour tes logements",
    "– keiner –": "– aucun –",
    "gerade: „{s}“": "en cours : « {s} »",
    "Termine mit diesen Wörtern steuern die Anwesenheit": "Les événements contenant ces mots pilotent la présence",
    "… wie Urlaub": "… comme vacances",
    "Komma-getrennt; absenken wie „länger weg“, sobald niemand da ist": "séparés par des virgules ; abaisser comme « absent longtemps » dès que personne n’est là",
    "… jemand bleibt zu Hause": "… quelqu’un reste à la maison",
    "Komma-getrennt; dann wird nicht abgesenkt": "séparés par des virgules ; pas d’abaissement dans ce cas",
    "Frostnacht: weniger absenken": "Nuit de gel : abaisser moins",
    "unter −5 °C laut Vorhersage nur halb so tief – der Raum ist schneller wieder warm": "sous −5 °C prévus, abaissement réduit de moitié – la pièce se réchauffe plus vite",
    "Sonnenseite": "Côté ensoleillé",
    "gerade: Sonne erwartet – 1 °C weniger": "en cours : soleil prévu – 1 °C de moins",
    "bei Sonne laut Vorhersage 1 °C weniger heizen – die Sonne wärmt mit": "chauffer 1 °C de moins quand le soleil est prévu – le soleil aide",
    "Sonne heizt mit · Ziel <b>{v} °C</b>": "Le soleil aide · cible <b>{v} °C</b>",
    "+{n} neue Einträge sind durch die Filter ausgeblendet (z. B. Thermostat-Befehle).": "+{n} nouvelles entrées sont masquées par les filtres (p. ex. commandes au thermostat).",
    "1 Hinweis": "1 remarque",
    "1 Raum aus": "1 pièce à l’arrêt",
    "24 h heizen": "Chauffer 24 h",
    "3 Tage darunter → heizt auch außerhalb der Saison": "3 jours en dessous → chauffe aussi hors saison",
    "7 T": "7 j",
    "<b>{v} %</b> warm bei Ankunft": "<b>{v} %</b> chaud à l’arrivée",
    "<b>{v} h</b> abgesenkt": "<b>{v} h</b> abaissé",
    "<b>{v} h</b> geheizt": "<b>{v} h</b> chauffé",
    "Abgesenkt": "Abaissé",
    "Abgesenkt <b>{v} °C</b> · Wunsch {w}°": "Abaissé <b>{v} °C</b> · souhaité {w}°",
    "Abgesenkt – niemand da": "Abaissé – personne à la maison",
    "Absenken nach": "Abaisser après",
    "Absenkung kurz / länger": "Abaissement court / long",
    "Absenkung „kurz weg“": "Abaissement « brève absence »",
    "Absenkung „länger weg“": "Abaissement « absent longtemps »",
    "Abwesenheit & Vorheizen": "Absence & préchauffage",
    "Adresse des Dashboards dieser Wohnung (für den Umschalter)": "Chemin du tableau de bord de ce logement (pour le sélecteur)",
    "Alle Räume": "Toutes les pièces",
    "Alle Räume auf einen Blick": "Toutes les pièces en un coup d’œil",
    "Alle Räume und Außenklima auf einen Blick": "Toutes les pièces et le climat extérieur en un coup d’œil",
    "Alle weg": "Tout le monde est parti",
    "Alle zeigen": "Tout afficher",
    "Alles in Ordnung – Thermostate, Fühler, Batterien und Funk unauffällig.": "Tout va bien – thermostats, sondes, piles et radio sans anomalie.",
    "Allgemein": "Général",
    "Als Push hinzufügen": "Ajouter en push",
    "Als Sprachansage": "Ajouter en annonce vocale",
    "Altbau saniert": "Ancien bâtiment rénové",
    "Altbau unsaniert": "Ancien bâtiment non rénové",
    "Anwesenheit": "Présence",
    "Anwesenheit & Absenkung": "Présence & abaissement",
    "Anzeigename (optional)": "Nom affiché (facultatif)",
    "Aufheizen": "Montée en température",
    "Aufstehen": "Lever",
    "Aus": "Arrêt",
    "Aus – am Thermostat abgeschaltet": "Arrêt – éteint au thermostat",
    "Ausschalten über": "Éteindre via",
    "Automatisch": "Automatique",
    "Außen": "Extérieur",
    "Bad": "Salle de bain",
    "CO₂-Sensor": "Capteur de CO₂",
    "ab 1000 ppm: „Bitte lüften“": "à partir de 1000 ppm : « Merci d’aérer »",
    "Balken = wie lange die Ventile umgerechnet voll offen waren (Maß für die Wärmemenge). Punkte = Heizgradtage: je kälter es draußen war, desto höher. Hohe Balken an milden Tagen sind ein Hinweis auf offene Fenster oder zu hohe Wunschtemperaturen.": "Barres = durée équivalente des vannes entièrement ouvertes (mesure de la chaleur fournie). Points = degrés-jours de chauffage : plus il faisait froid dehors, plus ils sont hauts. Des barres hautes par temps doux indiquent des fenêtres ouvertes ou des températures souhaitées trop élevées.",
    "Bauart": "Type de bâtiment",
    "Beenden": "Arrêter",
    "Bei {p} % der Ankünfte war es schon warm": "À {p} % des arrivées, il faisait déjà chaud",
    "Benachrichtigungen": "Notifications",
    "Benachrichtigungen allgemein": "Notifications – général",
    "Bericht": "Rapport",
    "Bericht nicht verfügbar: {e}": "Rapport indisponible : {e}",
    "Betriebsart": "Mode",
    "Bewohner und Zone wählen, dann ist es aktiv": "Choisir les habitants et la zone pour activer",
    "Bitte als MM-TT eingeben, z. B. 10-01": "Saisir au format MM-JJ, p. ex. 10-01",
    "Bitte ein Raumklima-Thermostat (entity) angeben": "Indiquer un thermostat Raumklima (entité)",
    "Bitte einen Namen eingeben": "Saisir un nom",
    "Bitte lüften": "Merci d’aérer",
    "Dashboard": "Tableau de bord",
    "Daten seit {d}": "Données depuis le {d}",
    "Der Bericht sammelt ab jetzt jede Minute, was die Heizung tut. Nach ein paar Stunden stehen hier die ersten Werte, aussagekräftig wird es nach einer Woche.": "Dès maintenant, le rapport enregistre chaque minute ce que fait le chauffage. Les premières valeurs apparaissent après quelques heures ; il devient parlant après une semaine.",
    "Der Schimmelschutz rechnet bei längerer Abwesenheit mit der kältesten Wandstelle (Temperaturfaktor {f} nach DIN 4108-2). Ist die Raumluft feucht, wird weniger abgesenkt – warme Luft nimmt mehr Feuchte auf und die Wand bleibt unter 80 % Feuchte.": "En cas d’absence prolongée, la protection contre les moisissures calcule avec le point le plus froid du mur (facteur de température {f} selon DIN 4108-2). Si l’air est humide, l’abaissement est plus faible – l’air chaud retient plus d’humidité et le mur reste sous 80 % d’humidité.",
    "Details": "Détails",
    "Die Ersparnis ist eine Abschätzung nach der Faustregel der Verbraucherzentrale (≈ 6 % weniger Heizenergie je Grad Absenkung). „Wetterbereinigt“ vergleicht den Heizbedarf je Heizgradtag – ein kalter Monat macht ihn also nicht schlechter.": "L’économie est une estimation selon la règle empirique (≈ 6 % d’énergie de chauffage en moins par degré d’abaissement). « Corrigé du climat » compare le besoin de chauffage par degré-jour – un mois froid ne le dégrade donc pas.",
    "Diese Woche": "Cette semaine",
    "Dieser Monat": "Ce mois-ci",
    "Draußen": "Extérieur",
    "Draußen gerade {v} °C": "Actuellement {v} °C dehors",
    "Drehen am Thermostat übernehmen": "Reprendre les réglages faits au thermostat",
    "Dringend": "Urgent",
    "Einschalten mit": "Allumer avec",
    "Einstellungen": "Paramètres",
    "Einstellungen konnten nicht geladen werden: {e}": "Impossible de charger les paramètres : {e}",
    "Empfohlene Lüftdauer": "Durée d’aération recommandée",
    "Empfänger": "Destinataires",
    "Entität {e} nicht gefunden": "Entité {e} introuvable",
    "Erinnern alle": "Rappeler toutes les",
    "Erreicht": "Atteinte",
    "Fehler auch in der HA-Glocke": "Afficher aussi les erreurs dans les notifications HA",
    "Fehler: {e}": "Erreur : {e}",
    "Fehlgeschlagen": "Échec",
    "Feiertage": "Jours fériés",
    "Fenster": "Fenêtres",
    "Fenster in Schlafräumen, das in dieser Zeit aufgeht, gilt als Schlafen bei offenem Fenster – keine Lüft-Hinweise, morgens ein Gruß": "Une fenêtre de chambre ouverte pendant cette période compte comme sommeil fenêtre ouverte – pas de rappels d’aération, un bonjour le matin",
    "Fenster offen": "Fenêtre ouverte",
    "Fenster offen, niemand da": "Fenêtre ouverte, personne à la maison",
    "Fenster schließen": "Fermer la fenêtre",
    "Fensterkontakt offen": "Contact de fenêtre ouvert",
    "Fensterlogik": "Logique fenêtre",
    "Feuchte": "Humidité",
    "Feuchtefühler": "Capteur d’humidité",
    "Feuchtegrenze": "Seuil d’humidité",
    "Format MM-TT, außerhalb nur bei Kälteeinbruch": "Format MM-JJ ; en dehors seulement en cas de vague de froid",
    "Frostschutz <b>{v} °C</b>": "Hors-gel <b>{v} °C</b>",
    "Fühler ausgefallen": "Sonde en panne",
    "Fühler fehlt": "Sonde manquante",
    "Gebäude & Schimmelschutz": "Bâtiment & protection contre les moisissures",
    "Geräte & Technik ändern": "Modifier appareils & réglages techniques",
    "Gespart": "Économisé",
    "Gespeichert": "Enregistré",
    "Gespeichert – Raum übernimmt die Werte": "Enregistré – la pièce applique les valeurs",
    "Gestern": "Hier",
    "Gesundheit": "Santé",
    "Gesundheit der Heizung": "Santé du chauffage",
    "Gäste da": "Invités présents",
    "HGT": "DJC",
    "Heizbedarf pro Tag": "Besoin de chauffage par jour",
    "Heizbericht": "Rapport de chauffage",
    "Heizgradtage (Kälte draußen)": "Degrés-jours de chauffage (froid dehors)",
    "Heizgrenze": "Seuil de chauffage",
    "Heizkörper": "Radiateur",
    "Heizpause": "Chauffage en pause",
    "Heizpause (Hand)": "Chauffage en pause (manuel)",
    "Heizsaison": "Saison de chauffage",
    "Heizsaison & Heizgrenze": "Saison & seuil de chauffage",
    "Heizsaison Start/Ende": "Début/fin de la saison de chauffage",
    "Heizstunden": "Heures de chauffe",
    "Heizt": "Chauffe",
    "Heizung": "Chauffage",
    "Heizung & Fenster": "Chauffage & fenêtres",
    "Heizung & Fenster (Zeitleiste)": "Chauffage & fenêtres (chronologie)",
    "Heizung aus": "Chauffage arrêté",
    "Heizung bei offenem Fenster pausieren": "Mettre le chauffage en pause quand une fenêtre est ouverte",
    "Heizung, Lüften und Klima aller Raumklima-Räume – baut sich automatisch auf": "Chauffage, aération et climat de toutes les pièces Raumklima – se construit tout seul",
    "Heute": "Aujourd’hui",
    "Heute heizen": "Chauffer aujourd’hui",
    "Hinweis": "Info",
    "Hinweise": "Remarques",
    "Hinweise für diesen Raum": "Remarques pour cette pièce",
    "Immer heizen": "Toujours chauffer",
    "Inhalt": "Contenu",
    "Ins Bett": "Coucher",
    "Ja": "Oui",
    "Jede Nacht zählt einmal (frühestes Ereignis), getrennt nach Werktag und Wochenende (Fr→Sa, Sa→So); gelernt wird der typische Wert (Median) der letzten 6 Wochen, sobald 4 Nächte da sind. Die Ruhezeit beginnt 30 min vor der typischen Bettzeit und endet 30 min nach dem Aufstehen – aber nie kürzer als eingestellt.": "Chaque nuit compte une fois (premier événement), séparément pour la semaine et le week-end (ven→sam, sam→dim) ; la valeur typique (médiane) des 6 dernières semaines est apprise dès que 4 nuits sont enregistrées. Les heures calmes commencent 30 min avant l’heure de coucher typique et finissent 30 min après le lever – mais jamais plus courtes que réglé.",
    "Jemand da": "Quelqu’un est là",
    "Jetzt": "Maintenant",
    "Jetzt kalibrieren": "Calibrer maintenant",
    "Kalibrierung": "Calibrage",
    "Keine": "Aucune",
    "Keine Daten im Zeitraum": "Aucune donnée sur la période",
    "Keine Einträge für diese Auswahl.": "Aucune entrée pour cette sélection.",
    "Keine Ruhezeit": "Pas d’heures calmes",
    "Kinderzimmer": "Chambre d’enfant",
    "Kontakte": "Contacts",
    "Kälteeinbruch": "Vague de froid",
    "Kälteeinbruch unter": "Vague de froid sous",
    "Küche": "Cuisine",
    "Lade Bericht …": "Chargement du rapport …",
    "Lade Einstellungen …": "Chargement des paramètres …",
    "Lade Verlauf …": "Chargement de l’historique …",
    "Licht aus – alle schlafen": "Lumières éteintes – tout le monde dort",
    "Lichter: abends alle 20 min aus = ins Bett, morgens eins an = aufgestanden": "Lumières : toutes éteintes 20 min le soir = coucher, une allumée le matin = levé",
    "Luft ausgetauscht": "Air renouvelé",
    "Luft ausgetauscht – du kannst schließen": "Air renouvelé – vous pouvez fermer",
    "Luftfeuchte": "Humidité",
    "Länger weg": "Absent longtemps",
    "Lüften & Feuchte": "Aération & humidité",
    "Lüftet": "Aération",
    "Lüftzeit erreicht – bitte schließen": "Durée d’aération atteinte – merci de fermer",
    "Max. Abkühlung beim Lüften": "Refroidissement max. pendant l’aération",
    "Mindesttemperatur beim Lüften": "Température minimale pendant l’aération",
    "Minimaltemperatur": "Température minimale",
    "Minimum Lüften": "Aération minimale",
    "Modus „aus“": "Mode « arrêt »",
    "Nachrichten": "Messages",
    "Nachtlüften": "Aération nocturne",
    "Nachtlüften – Fenster offen": "Aération nocturne – fenêtre ouverte",
    "Name der Wohnung": "Nom du logement",
    "Nein": "Non",
    "Neubau / gedämmt": "Neuf / isolé",
    "Noch kein Empfänger – unten hinzufügen.": "Pas encore de destinataire – ajoutez-en un ci-dessous.",
    "Noch keine Einträge. Ab jetzt steht hier jede Entscheidung mit Begründung.": "Pas encore d’entrées. Désormais, chaque décision apparaît ici avec sa raison.",
    "Nur Ansicht – Ändern erfordert Admin": "Lecture seule – les modifications nécessitent un administrateur",
    "Offenes Fenster an Temperatursturz erkennen": "Détecter une fenêtre ouverte à la chute de température",
    "Offset": "Décalage",
    "Offset am Thermostat": "Décalage au thermostat",
    "Ohne Abgleich": "Sans correction",
    "Fühler & Sensoren": "Capteurs",
    "Pause": "Pause",
    "Pause nach": "Pause après",
    "Pausiert – Fenster offen": "En pause – fenêtre ouverte",
    "Preset „aus“": "Préréglage « arrêt »",
    "Preset „{p}“": "Préréglage « {p} »",
    "Protokoll": "Journal",
    "Protokoll nicht verfügbar: {e}": "Journal indisponible : {e}",
    "Warnung": "Avertissement",
    "Prüfen": "À vérifier",
    "Prüft alle 10 Minuten: Batterien, Raum wird trotz offenem Ventil nicht warm, Fühler hängt, Funkaussetzer, Fensterkontakt still. Meldungen gehen an alle mit „🩺 Gesundheit“.": "Vérifie toutes les 10 minutes : piles, pièce qui ne chauffe pas malgré la vanne ouverte, sonde bloquée, coupures radio, contact de fenêtre muet. Les alertes vont à tous ceux qui ont « 🩺 Santé ».",
    "Push aufs Handy": "Push sur le téléphone",
    "Raum": "Pièce",
    "Raum (Raumklima-Thermostat)": "Pièce (thermostat Raumklima)",
    "Raum kühlt aus": "La pièce se refroidit",
    "Raum kühlt aus – jetzt schließen": "La pièce se refroidit – fermer maintenant",
    "Raum ±1 °C am Ziel": "Pièce à ±1 °C de la cible",
    "Raumklima – Einstellungen": "Raumklima – Paramètres",
    "Raumklima – Heizbericht": "Raumklima – Rapport de chauffage",
    "Raumklima – Protokoll": "Raumklima – Journal",
    "Raumklima – Raum": "Raumklima – Pièce",
    "Raumklima – Verlauf": "Raumklima – Historique",
    "Raumklima – Übersicht": "Raumklima – Aperçu",
    "Raumtemperatur": "Température de la pièce",
    "Raumtyp": "Type de pièce",
    "Ruhezeit": "Heures calmes",
    "Ruhezeit gerade aktiv": "Heures calmes actives",
    "Ruhezeit wirksam": "Heures calmes effectives",
    "Räume": "Pièces",
    "Sa und So endet die Ruhezeit später – zum Ausschlafen": "Le samedi et le dimanche, les heures calmes finissent plus tard – pour faire la grasse matinée",
    "Schlaf-Signale": "Signaux de sommeil",
    "Schlafen bei offenem Fenster": "Dormir fenêtre ouverte",
    "Schlafenszeiten": "Heures de sommeil",
    "Schlafzimmer": "Chambre",
    "Selten genutzt": "Peu utilisée",
    "Sicherung": "Minimum de sécurité",
    "Signal hinzufügen": "Ajouter un signal",
    "So,Mo,Di,Mi,Do,Fr,Sa": "Di,Lu,Ma,Me,Je,Ve,Sa",
    "Sollwert-Ausgleich": "Compensation de consigne",
    "Sommerpflege Ventile": "Dégommage d’été des vannes",
    "Sprachansage · nie in der Ruhezeit": "Annonce vocale · jamais pendant les heures calmes",
    "Suchen … (z. B. Offset, Heizpause)": "Rechercher … (p. ex. décalage, pause)",
    "Synchron": "Synchronisé",
    "TRV weg": "TRV absent",
    "Tagesmittel außen, darüber Heizpause (nach 2 milden Tagen)": "Moyenne extérieure journalière ; au-dessus, le chauffage se met en pause (après 2 jours doux)",
    "Taupunkt": "Point de rosée",
    "Temperatur": "Température",
    "Temperatur erreicht": "Température atteinte",
    "Temperatur, Luftfeuchte oder Zeitleiste aller Räume": "Température, humidité ou chronologie de toutes les pièces",
    "Temperaturfühler": "Sonde de température",
    "Test": "Test",
    "Testnachricht an {n} gesendet": "Message de test envoyé à {n}",
    "Thermostat": "Thermostat",
    "Thermostat & Fühler": "Thermostat & sondes",
    "Thermostat nicht erreichbar": "Thermostat injoignable",
    "Thermostat reagiert nicht": "Le thermostat ne répond pas",
    "Thermostat, Lüften und Klima eines Raums": "Thermostat, aération et climat d’une pièce",
    "Thermostat-Befehle": "Commandes au thermostat",
    "Tippe auf einen Raum, um seine Einstellungen zu ändern.": "Touchez une pièce pour en modifier les paramètres.",
    "Tippen zum Aus-/Abwählen. Zählt, sobald eins ihrer Handys in der Zone ist.": "Touchez pour sélectionner/désélectionner. Compte dès qu’un de leurs téléphones est dans la zone.",
    "Titel": "Titre",
    "Typ": "Type",
    "Urlaub": "Vacances",
    "Ventil": "Vanne",
    "Ventil voll offen ≈ {v} h": "Vanne entièrement ouverte ≈ {v} h",
    "Ventil ≈ {v} h": "Vanne ≈ {v} h",
    "Ventilpflege läuft": "Dégommage des vannes en cours",
    "Verlauf": "Historique",
    "Verlauf nicht verfügbar: {e}": "Historique indisponible : {e}",
    "Von Hand": "Manuel",
    "Vorheizen": "Préchauffage",
    "Vorheizen ab": "Préchauffer à partir de",
    "Vormonat": "mois précédent",
    "Vorwoche": "semaine précédente",
    "Warum": "Pourquoi",
    "Was eingestellt ist, wer welche Hinweise bekommt – mit Reglern": "Ce qui est réglé et qui reçoit quelles remarques – avec des réglages",
    "Was wann warum entschieden wurde · 14 Tage": "Ce qui a été décidé, quand et pourquoi · 14 jours",
    "Was wann warum entschieden wurde – live, mit Filtern": "Ce qui a été décidé, quand et pourquoi – en direct, avec filtres",
    "Weiter nach": "Reprendre après",
    "Wer bekommt was": "Qui reçoit quoi",
    "Wer wohnt hier?": "Qui habite ici ?",
    "Werktags": "En semaine",
    "Werte mit + / − werden nach kurzer Pause gespeichert; der Raum übernimmt sie sofort. Geräte (Thermostat, Fühler, Kontakte) und Technik änderst du unter „Geräte & Technik ändern“ → Zahnrad beim Raum „{r}“.": "Les valeurs modifiées avec + / − sont enregistrées après une courte pause et appliquées aussitôt par la pièce. Les appareils (thermostat, sondes, contacts) et la technique se modifient sous « Modifier appareils & réglages techniques » → roue dentée de la pièce « {r} ».",
    "Wetter (optional)": "Météo (facultatif)",
    "Wetterbereinigt": "Corrigé du climat",
    "Wetterquelle": "Source météo",
    "Wird übertragen": "Envoi en cours",
    "Woche und Monat: Heizstunden, Ersparnis, wetterbereinigter Vergleich, Gesundheit": "Semaine et mois : heures de chauffe, économies, comparaison corrigée du climat, santé",
    "Wochenbericht": "Rapport hebdomadaire",
    "Wochenende": "Week-end",
    "Wochenende bis": "Week-end jusqu’à",
    "Wohlfühlbereich": "Zone de confort",
    "Wohlfühlzeit": "Temps de confort",
    "Wohnraum": "Séjour",
    "Wohnung": "Logement",
    "Wohnung (Zone)": "Logement (zone)",
    "Wohnung anlegen": "Créer un logement",
    "Wohnung „{n}“ angelegt": "Logement « {n} » créé",
    "Wunsch": "Souhaité",
    "Wunschtemperatur": "Température souhaitée",
    "Zeiten lernen": "Apprendre les horaires",
    "Ziel & Heizung": "Cible & chauffage",
    "Ziel <b>{v} °C</b>": "Cible <b>{v} °C</b>",
    "Ziel <b>{v} °C</b> · von Hand": "Cible <b>{v} °C</b> · manuel",
    "Ziel {v}°": "Cible {v}°",
    "ab 24 h oder Urlaub – Schimmelschutz hält feuchte Räume wärmer": "à partir de 24 h ou en vacances – la protection contre les moisissures garde les pièces humides plus chaudes",
    "aktuell {v} °C": "actuellement {v} °C",
    "alle 5 s": "toutes les 5 s",
    "alle waren da": "tout le monde était là",
    "alles gut": "tout va bien",
    "an": "activé",
    "an/aus": "marche/arrêt",
    "aus": "désactivé",
    "aus Nachtlüften und Licht – verlängert Ruhezeit und Nachtlüften nur, verkürzt nie": "d’après l’aération nocturne et les lumières – prolonge seulement les heures calmes et l’aération nocturne, ne les raccourcit jamais",
    "außen {v} °C": "extérieur {v} °C",
    "außen · {h} %": "extérieur · {h} %",
    "bei {v} °C draußen": "par {v} °C dehors",
    "beim Einschalten und als Grundwert": "à l’allumage et comme valeur de base",
    "bis": "à",
    "bis {t}": "jusqu’à {t}",
    "da": "présent",
    "damit kurze Wege nichts auslösen": "pour que les petits trajets ne déclenchent rien",
    "darunter: „Raum kühlt aus“": "en dessous : « La pièce se refroidit »",
    "durch Absenkung (6 % je Grad)": "grâce à l’abaissement (6 % par degré)",
    "einmal pro Nacht": "une fois par nuit",
    "endet automatisch bei Ankunft": "se termine automatiquement à l’arrivée",
    "entfernen": "retirer",
    "erscheint im Umschalter oben im Dashboard": "apparaît dans le sélecteur en haut du tableau de bord",
    "fällt ein Raum darunter, heizt er immer": "si une pièce descend en dessous, elle chauffe toujours",
    "für milde, aber kühle Tage": "pour les jours doux mais frais",
    "gelernt": "appris",
    "gerade: Fenster vermutlich offen · ": "en cours : fenêtre probablement ouverte · ",
    "im Schnitt −{v} °C": "en moyenne −{v} °C",
    "ja": "oui",
    "je Heizgradtag ggü. {vs}": "par degré-jour par rapport à {vs}",
    "jetzt": "maintenant",
    "keine": "aucun",
    "keine Antwort": "pas de réponse",
    "keine Personen in HA": "aucune personne dans HA",
    "keiner": "aucun",
    "kälter": "plus froid",
    "lernt noch ({n}/3)": "apprend encore ({n}/3)",
    "mehr": "plus",
    "mittwochs 11 Uhr kurz öffnen": "ouvrir brièvement le mercredi à 11 h",
    "morgen: {h} – Ruhezeit wie am Wochenende": "demain : {h} – heures calmes comme le week-end",
    "nein": "non",
    "neue Einträge kommen sofort, zusätzlich wird alle 5 s nachgesehen": "les nouvelles entrées arrivent aussitôt ; vérification en plus toutes les 5 s",
    "nicht absenken, auch wenn alle Bewohner weg sind": "ne pas abaisser, même si tous les habitants sont absents",
    "niemand": "personne",
    "noch keine {vs}": "pas encore de {vs}",
    "nur Dringendes (kühlt aus, Fenster offen bei Abwesenheit, Thermostat-Fehler) kommt laut": "seules les urgences (refroidissement, fenêtre ouverte en absence, erreurs de thermostat) sont sonores",
    "offen": "ouverte",
    "prüft nach {s} s · bis zu {n} Wiederholungen": "vérifie après {s} s · jusqu’à {n} répétitions",
    "sammelt noch": "collecte en cours",
    "sendet …": "envoi …",
    "solange das Problem besteht": "tant que le problème persiste",
    "synchron": "synchronisé",
    "umschalten": "basculer",
    "unbekannt": "inconnu",
    "weniger": "moins",
    "wenn alle weg sind": "quand tout le monde est parti",
    "wenn sich jemand nähert": "quand quelqu’un approche",
    "wärmer": "plus chaud",
    "zentral unter Allgemein → Wer bekommt was": "de façon centrale sous Général → Qui reçoit quoi",
    "zu": "fermée",
    "zu mild für einen Vergleich": "trop doux pour une comparaison",
    "zuletzt {t}": "dernière fois {t}",
    "{d} ggü. {vs}": "{d} par rapport à {vs}",
    "{h} % · Taupunkt {d} °C": "{h} % · point de rosée {d} °C",
    "{h} % · ca. {m} min": "{h} % · env. {m} min",
    "{c} ppm · ca. {m} min": "{c} ppm · env. {m} min",
    "{n} Heizgradtage": "{n} degrés-jours de chauffage",
    "{n} Hinweise": "{n} remarques",
    "{n} Räume": "{n} pièces",
    "{n} Wohnungen: {list}. Jede hat eigene Bewohner, Zone, Empfänger, Heizsaison und Protokoll; Räume ordnest du im Raum unter „Wohnung“ zu.": "{n} logements : {list}. Chacun a ses propres habitants, zone, destinataires, saison de chauffage et journal ; une pièce s’attribue dans la pièce sous « Logement ».",
    "{n} heizen": "{n} chauffent",
    "{n} offen": "{n} ouvertes",
    "{n} Räume aus": "{n} pièces à l’arrêt",
    "{n}/4 Nächte": "{n}/4 nuits",
    "{n}× vorgeheizt": "préchauffé {n}×",
    "{r} Räume · {h} heizen · {w} Fenster offen": "{r} pièces · {h} chauffent · {w} fenêtres ouvertes",
    "{r} °C/h bei aktuellem Wetter · aus {n} Aufheizvorgängen · steuert, wann vorgeheizt wird": "{r} °C/h avec la météo actuelle · d’après {n} montées en température · détermine quand préchauffer",
    "{v} h Fenster offen": "{v} h fenêtre ouverte",
    "{v} h Nachtlüften": "{v} h d’aération nocturne",
    "{v} h Schimmelrisiko": "{v} h de risque de moisissures",
    "{v} h zu feucht": "{v} h trop humide",
    "~{m} min für +2 °C": "~{m} min pour +2 °C",
    "Ältere laden": "Charger plus ancien",
    "Ø 24 h {p} · Vorhersage {f}": "Ø 24 h {p} · prévision {f}",
    "Ø <b>{v} %</b> Feuchte": "Ø <b>{v} %</b> d’humidité",
    "Übertragung": "Transmission",
    "– keine –": "– aucune –",
    "– wählen –": "– choisir –",
    "„Länger weg“ ab": "« Absent longtemps » à partir de",
    "„Raumklima Allgemein“ wird gerade eingerichtet – bitte die Seite gleich neu laden.": "« Raumklima Général » est en cours de configuration – rechargez la page dans un instant.",
    "… leise warnen unter": "… alerte discrète sous",
    "↓ {v}° · Wunsch {w}°": "↓ {v}° · souhaité {w}°",
    "Ausprobieren": "Essayer",
    "Bitte schließen": "Merci de fermer",
    "Blau = lüften · Orange = schließen · Grün = fertig · Rot = Problem": "Bleu = aérer · orange = fermer · vert = terminé · rouge = problème",
    "Blinken bei": "Clignoter pour",
    "Lampe hinzufügen": "Ajouter une lampe",
    "Lampen": "Lampes",
    "Lampen blinken blau": "Les lampes clignotent en bleu",
    "Lichtsignal": "Signal lumineux",
    "Lüft-Countdown auf dem Sperrbildschirm": "Compte à rebours d’aération sur l’écran verrouillé",
    "Nicht in der Ruhezeit, nicht beim Schlafen mit offenem Fenster und nicht, wenn niemand zu Hause ist. Lampen ohne Farbe blinken einfach hell.": "Pas pendant les heures calmes, pas en dormant fenêtre ouverte et pas quand personne n’est là. Les lampes sans couleur clignotent simplement en blanc.",
    "Problem mit der Heizung": "Problème de chauffage",
    "blinken 3× in der Farbe des Hinweises, danach wie vorher": "clignotent 3× dans la couleur de la remarque, puis reviennent à leur état précédent",
    "Fenster offen seit {c} · {d}": "Fenêtre ouverte depuis {c} · {d}",
    "offen seit {c}": "ouverte depuis {c}",
    "{d} Tg. {h} h": "{d} j {h} h",
    "{h} h {m} min": "{h} h {m} min",
    "{n} min": "{n} min",
    "{n} s": "{n} s",
    "Art": "Type",
    "Jemand im Raum": "Quelqu’un dans la pièce",
    "Leeren Raum absenken": "Abaisser la pièce vide",
    "Melder": "Détecteurs",
    "Melder hinzufügen": "Ajouter un détecteur",
    "PIR": "PIR",
    "Präsenzmelder": "Détecteurs de présence",
    "Präsenzmelder zählen": "Détecteurs de présence pris en compte",
    "Raum leer · Ziel <b>{v} °C</b>": "Pièce vide · cible <b>{v} °C</b>",
    "gerade jemand in: {r}": "quelqu’un dans : {r}",
    "jemand im Raum": "quelqu’un dans la pièce",
    "leer": "vide",
    "leer – abgesenkt": "vide – abaissée",
    "mmWave": "mmWave",
    "mmWave (Radar) sieht auch Stillsitzende · PIR nur Bewegung": "mmWave (radar) voit aussi les personnes immobiles · PIR seulement le mouvement",
    "mmWave + PIR": "mmWave + PIR",
    "nur mmWave": "mmWave uniquement",
    "… um": "… de",
    "… wenn leer seit": "… si vide depuis",
    "Raum leer seit {d}": "Pièce vide depuis {d}",
    "Raum leer seit {d} – abgesenkt": "Pièce vide depuis {d} – abaissée",
    "sieht ein Melder jemanden, wird nicht abgesenkt – PIR löst auch bei Haustieren aus, darum standardmäßig nur mmWave; im Urlaub zählen Melder nie": "si un détecteur voit quelqu’un, pas d’abaissement – le PIR réagit aussi aux animaux, donc mmWave uniquement par défaut ; en vacances, les détecteurs ne comptent jamais",
    "Automatisch: Bewegung = PIR, Anwesenheit/Belegung = mmWave. Leer nach 3 min (mmWave) bzw. 20 min (PIR) ohne Meldung": "Automatique : mouvement = PIR, présence/occupation = mmWave. Vide après 3 min (mmWave) ou 20 min (PIR) sans détection",
    "Automatisch: ja (mmWave, passender Raumtyp)": "Automatique : oui (mmWave, type de pièce adapté)",
    "Automatisch: nein – nur Wohnraum, Küche, selten genutzt und nur mit mmWave": "Automatique : non – seulement séjour, cuisine, peu utilisée et seulement avec mmWave",
    "nie unter „kurz weg“ und den Schimmelschutz; kommt jemand rein, sofort zurück": "jamais sous « brève absence » ni la protection contre les moisissures ; retour immédiat quand quelqu’un entre",
    "Bericht gesendet: {f}": "Rapport envoyé : {f}",
    "Download fehlgeschlagen: {e}": "Échec du téléchargement : {e}",
    "Herunterladen": "Télécharger",
    "Mail-Dienst (SMTP) in Home Assistant einrichten, dann hier wählen – die PDF kommt als Anhang": "configurer un service mail (SMTP) dans Home Assistant puis le choisir ici – le PDF arrive en pièce jointe",
    "Monat": "Mois",
    "Noch keine PDF-Berichte. Sie entstehen automatisch: Woche sonntags 18 Uhr, Monat am 1., Heizsaison nach dem Saisonende – oder jetzt mit den Knöpfen oben (bis heute).": "Pas encore de rapports PDF. Ils sont créés automatiquement : semaine le dimanche à 18 h, mois le 1er, saison de chauffage après sa fin – ou maintenant avec les boutons ci-dessus (jusqu’à aujourd’hui).",
    "PDF konnte nicht erstellt werden: {e}": "Impossible de créer le PDF : {e}",
    "PDF per E-Mail an": "Envoyer le PDF à",
    "PDF-Berichte": "Rapports PDF",
    "Woche": "Semaine",
    "Wochenbericht jetzt senden": "Envoyer le rapport hebdomadaire maintenant",
    "automatisch erstellen: Woche sonntags 18 Uhr, Monat am 1., Heizsaison nach Saisonende – Push mit Link an alle mit „Wochenbericht“": "création automatique : semaine le dimanche à 18 h, mois le 1er, saison de chauffage après sa fin – push avec lien à tous ceux qui ont « rapport hebdomadaire »",
    "bis heute": "jusqu’à aujourd’hui",
    "– keine E-Mail –": "– pas d’e-mail –",
    "Heizkosten pro Jahr": "Coûts de chauffage par an",
    "optional, laut Abrechnung – nur für die Euro-Schätzung im PDF-Bericht (Ersparnis, „1 °C weniger = … €“)": "facultatif, d’après votre facture – uniquement pour l’estimation en euros du rapport PDF (économies, « 1 °C de moins = … € »)",
    "z. B. 1400": "p. ex. 1400",
    "Erklärung": "Explication",
    "Anbieter": "Fournisseur",
    "Anderer Anbieter": "Autre fournisseur",
    "Das Passwort wird nur in Home Assistant gespeichert und nie angezeigt. Tipp: Für Gmail unter myaccount.google.com → Sicherheit → App-Passwörter ein eigenes Passwort für Raumklima erstellen.": "Le mot de passe est enregistré uniquement dans Home Assistant et n’est jamais affiché. Astuce : pour Gmail, créez un mot de passe dédié à Raumklima sous myaccount.google.com → Sécurité → Mots de passe d’application.",
    "E-Mail einrichten": "Configurer l’e-mail",
    "Raumklima (direkt hier einrichten)": "Raumklima (configurer ici)",
    "Sende Test-Mail …": "Envoi de l’e-mail de test …",
    "Server-Einstellungen": "Paramètres du serveur",
    "Speichern & Test-Mail senden": "Enregistrer & envoyer un e-mail de test",
    "Test-Mail an {to} gesendet – bitte Posteingang (und Spam) prüfen.": "E-mail de test envoyé à {to} – vérifiez votre boîte de réception (et les spams).",
    "Verschlüsselung": "Chiffrement",
    "eingerichtet": "configuré",
    "füllt Server, Port und Verschlüsselung aus": "renseigne serveur, port et chiffrement",
    "gespeichert – leer lassen zum Behalten": "enregistré – laisser vide pour le conserver",
    "noch nicht eingerichtet": "pas encore configuré",
    "„Raumklima“ wählen und unten die Zugangsdaten eintragen – die PDF kommt als Anhang": "choisir « Raumklima » et saisir les identifiants ci-dessous – le PDF arrive en pièce jointe",
    "Benutzer": "Utilisateur",
    "Passwort": "Mot de passe",
    "Server": "Serveur",
    "Port": "Port",
    "Absender": "Expéditeur",
    "meist deine E-Mail-Adresse": "généralement votre adresse e-mail",
    "bei Gmail, iCloud, Outlook: App-Passwort": "pour Gmail, iCloud, Outlook : mot de passe d’application",
    "mehrere mit Komma": "plusieurs séparés par des virgules",
    "leer = Benutzer": "vide = utilisateur",
    "hier antippen": "toucher ici",
    "unten bei „E-Mail einrichten“ die Zugangsdaten eintragen – die PDF kommt als Anhang": "saisir les identifiants ci-dessous sous « Configurer l’e-mail » – le PDF arrive en pièce jointe",
    "Eigenes E-Mail-Konto (unten einrichten)": "Compte e-mail personnel (configurer ci-dessous)",
    "Vorhandener Mail-Dienst in Home Assistant": "Service mail existant dans Home Assistant",
    "Zugang prüfen": "Vérifier l’accès",
    "Server erreichbar": "Serveur joignable",
    "Anmeldung": "Connexion",
    "Prüfe Zugang …": "Vérification de l’accès …",
    "Alles in Ordnung – du kannst speichern und eine Test-Mail senden.": "Tout est en ordre – vous pouvez enregistrer et envoyer un e-mail de test.",
    "Da stimmt noch etwas nicht – siehe oben.": "Quelque chose ne va pas encore – voir ci-dessus.",
    "PDF per E-Mail": "PDF par e-mail",
    "die PDF kommt als Anhang an die Empfänger unten": "le PDF est envoyé en pièce jointe aux destinataires ci-dessous",
    "darunter einmal „E-Mail einrichten“ – danach kommt jeder Bericht auch per Mail": "configurer l’e-mail une fois ci-dessous – ensuite chaque rapport arrive aussi par e-mail",
    "über {s}": "via {s}",
    "Oder vorhandenen Mail-Dienst nutzen": "Ou utiliser un service mail existant",
    "statt der Zugangsdaten oben": "au lieu des identifiants ci-dessus",
    "– nein, Zugangsdaten oben –": "– non, identifiants ci-dessus –",
    "Bitte erst unten die Zugangsdaten eintragen und speichern.": "Saisissez et enregistrez d’abord les identifiants ci-dessous.",
    "Weitere Thermostate": "Thermostats supplémentaires",
    "Haupt-Thermostat": "thermostat principal",
    "bekommen dieselben Befehle, jedes mit eigener Prüfung und eigenem Korrekturwert": "reçoivent les mêmes commandes, chacun avec sa propre vérification et sa propre correction",
    "nicht erreichbar": "injoignable",
    "Ventil Ø": "Vanne Ø",
    "Bitte Uhrzeit als HH:MM eingeben": "Merci d'indiquer l'heure au format HH:MM",
    "Ziel {v}° · Wunsch {w}°": "Consigne {v}° · souhait {w}°",
    "Anwesenheit aus": "Présence désactivée",
    "keine Auswertung: nichts wird nach Anwesenheit abgesenkt, nichts vorgeheizt, keine Weg-Meldungen – gedacht, wenn keine Ortung möglich ist": "aucune évaluation : rien n'est abaissé selon la présence, rien n'est préchauffé, aucun message d'absence – prévu quand la localisation est impossible",
    "nach oben": "vers le haut",
    "nach unten": "vers le bas",
    "nach Uhrzeit sortieren": "trier par heure",
    "Zeitfenster nach Uhrzeit sortiert": "fenêtres triées par heure de début",
    "Reihenfolge zählt nur, wenn sich Fenster überschneiden – dann gewinnt das untere": "l'ordre ne compte que si les fenêtres se chevauchent – la plus basse l'emporte",
    "Überwachung": "Surveillance",
    "nur Messen": "mesure seule",
    "Kein Thermostat": "Pas de thermostat",
    "nur Messen und Hinweise": "mesures et conseils uniquement",
    "Temperatur, Feuchte, CO₂ und Lüftungshinweise – ohne Heizungsregelung. Ein Thermostat lässt sich später in der Integration nachtragen.": "Température, humidité, CO₂ et conseils d’aération – sans régulation du chauffage. Un thermostat peut être ajouté plus tard dans l’intégration.",
    "Abgleich": "Correction",
    "das Gerät kennt keinen Offset – Raumklima verschiebt stattdessen den Sollwert um die Abweichung zwischen Fühler und Thermostat": "l’appareil n’a pas d’entité d’offset – Raumklima décale la consigne de l’écart entre la sonde et le thermostat",
    "Abgesenkt · Wunsch {w}°": "Réduit · souhait {w}°",
    "Zeitplan · {v}°": "Programme · {v}°",
    "Boost · {v}°": "Boost · {v}°",
    "Ruhezeit · {v}°": "Heures calmes · {v}°",
    "Schimmel · {v}°": "Moisissure · {v}°",
    "Sonne · {v}°": "Soleil · {v}°",
    "Vorheizen · {v}°": "Préchauffage · {v}°",
    "Leer · {v}°": "Vide · {v}°",
    "Von Hand · {v}°": "Manuel · {v}°",
    "Frostschutz {v}°": "Hors gel {v}°",
    "Einstellung suchen …": "Rechercher un réglage …",
    "Kein Treffer – anderen Begriff versuchen": "Aucun résultat – essayez un autre terme",
    "{n} Einstellungen vom Standard abweichend": "{n} réglages diffèrent de la valeur par défaut",
    "Auf Standard zurücksetzen": "Réinitialiser",
    "Alle Einstellungen dieses Raums auf Standard zurücksetzen? Geräte und Wohnung bleiben erhalten.": "Réinitialiser tous les réglages de cette pièce ? Les appareils et la maison restent inchangés.",
    "Auf Standard zurückgesetzt": "Réinitialisé",
    "Alles auf Standard": "Tout par défaut",
    "Darstellung": "Apparence",
    "Kachel": "Tuile",
    "Reihenfolge": "Ordre",
    "Speichern": "Enregistrer",
    "große Karte": "Grande carte",
    "lädt …": "chargement …",
    "Reihenfolge gilt im generierten Dashboard und in der Übersicht; Größe „Kachel“ blendet die große Raumseite aus, „aus“ versteckt den Raum ganz. Farbe färbt Rand und Akzente der Karte.": "L’ordre s’applique au tableau de bord généré et à l’aperçu ; « Tuile » masque la grande page de la pièce, « aus » masque complètement la pièce. La couleur colore le bord et les accents de la carte.",
    "Farbe": "Couleur",
    "Aufheizrate": "Vitesse de montée",
    "Gerade gilt": "S'applique actuellement",
    "Lade …": "Chargement …",
    "Lernen & Warum": "Apprentissage & pourquoi",
    "Noch keine Entscheidungen protokolliert.": "Aucune décision enregistrée pour l'instant.",
    "Protokoll konnte nicht geladen werden.": "Le journal n'a pas pu être chargé.",
    "Vorheizen für 2 K": "Préchauffage pour 2 K",
    "Warum? Letzte Entscheidungen": "Pourquoi ? Décisions récentes",
    "Wie sicher?": "Fiabilité ?",
    "aus {n} Aufheizvorgängen gemessen": "mesuré sur {n} montées en température",
    "belastbar": "fiable",
    "brauchbar": "utilisable",
    "mehr Aufheizvorgänge, verlässlichere Vorhersage": "plus de montées mesurées, prévision plus fiable",
    "noch nicht gelernt": "pas encore appris",
    "noch unsicher": "encore incertain",
    "so entscheidet die Automatik im Moment": "voilà comment l'automatisme décide en ce moment",
    "so früh beginnt das Vorheizen vor einem Zeitfenster": "le préchauffage démarre aussi tôt avant une plage horaire",
    "was zuletzt entschieden wurde und weshalb": "ce qui a été décidé récemment et pourquoi",
    "{v} °C/h": "{v} °C/h",
    "Lüften ab {v} °C": "Aérer dès {v} °C",
    "Absenkung": "Abaissement",
    "Fensterlogik an": "Logique fenêtre active",
    "Hinweise an": "Notifications actives",
    "Kalender antippen – Tag und Monat zählen, das Jahr ist egal": "Touchez le calendrier – le jour et le mois comptent, l'année non",
    "auf ~{v}": "lever ~{v}",
    "ins Bett ~{v}": "au lit ~{v}",
    "noch zu wenige Nächte – 4 sind nötig": "pas encore assez de nuits – 4 sont nécessaires",
    "{b} von 4 Nächten (Bett) · {w} von 4 (Aufstehen)": "{b} nuits sur 4 (coucher) · {w} sur 4 (lever)",
    "Anteil der Tage mit jemand zu Hause": "Part des jours avec quelqu'un à la maison",
    "Anwesenheit am Tag": "Présence dans la journée",
    "Uhr": "h",
    "Uhrzeit": "Heure",
    "keine klare Zeit – meist niemand zu Hause": "pas d'heure claire – généralement personne à la maison",
    "meist {a}–{b} jemand zu Hause": "généralement quelqu'un à la maison de {a} à {b}",
    "schließen": "fermer",
    "wird ab der ersten Woche sichtbar – nur ja/nein, nie wer": "visible après la première semaine – seulement oui/non, jamais qui",
    "Übernehmen": "Appliquer",
    "CO₂ bei {c} ppm – ab 1000 ppm wird es stickig.": "CO₂ à {c} ppm – au-delà de 1000 ppm l'air devient confiné.",
    "Die Luft ist gerade nicht in Ordnung.": "L'air n'est pas correct en ce moment.",
    "Dieser Raum hat kein Thermostat: Raumklima misst hier nur und gibt Hinweise. Geheizt wird über die Heizung, die diesen Raum versorgt.": "Cette pièce n'a pas de thermostat : Raumklima mesure seulement et donne des conseils. Le chauffage est assuré par celui qui dessert la pièce.",
    "Empfohlen: etwa {m} Minuten lüften.": "Conseil : aérer environ {m} minutes.",
    "Feuchte bei {h} % – lüften senkt die Schimmelgefahr.": "Humidité à {h} % – aérer réduit le risque de moisissure.",
    "Kein Feuchtefühler – bewertet nur die Temperatur.": "Pas de capteur d'humidité – seule la température est évaluée.",
    "Luft und Klima sind in Ordnung.": "L'air et le climat sont corrects.",
    "Zurück": "Retour",
    "Überwachung · kein Thermostat": "Surveillance · sans thermostat",
    "Anwesenheitsprofil": "Profil de présence",
    "Aus diesem Profil schlägt Raumklima Absenk- und Vorheizzeiten vor.": "Raumklima utilise ce profil pour proposer des heures d'abaissement et de préchauffage.",
    "Vorheizen beginnt 30 Minuten vorher, Absenken endet mit der Ankunft – so bleibt es beim Wunsch, ohne dass die Heizung leer läuft.": "Le préchauffage démarre 30 minutes plus tôt, l'abaissement s'arrête à l'arrivée – la consigne est tenue sans chauffer une maison vide.",
    "Vorschlag": "Suggestion",
    "Wochenende ab {a}": "week-end dès {a}",
    "ab einer erfassten Woche": "après une semaine enregistrée",
    "{a} bis {b}": "de {a} à {b}",
    "Thermostat {v}° (Abgleich {o}°)": "Thermostat {v}° (décalage {o}°)",
    "Feinstaub": "Particules fines",
    "Feinstaubfühler": "Capteur de particules",
    "15-Minuten-Raster": "grille de 15 minutes",
    "Alle 15 Minuten ein Häkchen „jemand da oder nicht“, rollierend 4 Wochen. Es wird nie erfasst, wer zu Hause ist.": "Toutes les 15 minutes une coche « quelqu'un est là ou non », sur 4 semaines glissantes. Il n'est jamais noté qui est à la maison.",
    "Antippen einer Zeile zeigt die vollständige Begründung.": "Touchez une ligne pour voir la justification complète.",
    "Aus der Aufheizrate und der Außentemperatur wird geschätzt, wie viele Minuten vor einem Zeitfenster gestartet werden muss.": "La vitesse de montée et la température extérieure servent à estimer combien de minutes avant une plage horaire il faut démarrer.",
    "Bereich": "Domaine",
    "Entscheidungen": "Décisions",
    "Gemessen wird, wie schnell der Raum bei geöffnetem Ventil wärmer wird – nur ab 0,3 K Anstieg, damit Messrauschen nicht zählt.": "On mesure la rapidité de réchauffement vanne ouverte – seulement à partir de 0,3 K de hausse, pour ignorer le bruit de mesure.",
    "Genauigkeit": "Précision",
    "Gezählt wird jede Nacht einmal, aus Nachtlüften und Lichtsignalen. Ruhezeit beginnt 30 Minuten vor der typischen Bettzeit.": "Chaque nuit compte une fois, à partir de l'aération nocturne et des signaux lumineux. Les heures calmes commencent 30 minutes avant l'heure du coucher.",
    "Grenzen": "Limites",
    "Heizpause → Abwesenheit → Boost → Zeitfenster → Ruhezeit → Vorheizen → leer/Sonne → Wunsch. Das oberste zutreffende gewinnt.": "Pause de chauffe → absence → boost → plage horaire → heures calmes → préchauffage → vide/soleil → consigne. Le premier qui s'applique gagne.",
    "Keine Entscheidungen in diesem Zeitraum.": "Aucune décision sur cette période.",
    "Lüften": "Aération",
    "Median aus echten Vorgängen": "médiane sur de vraies montées",
    "Median der letzten 6 Wochen": "médiane des 6 dernières semaines",
    "Rate × fehlende Kelvin": "vitesse × kelvin manquants",
    "Schlafzeiten": "Heures de sommeil",
    "Unter 3 Vorgängen unsicher, ab 6 belastbar. Mehr Messungen = engere Vorhersage; alte Werte verfallen mit der Zeit.": "Moins de 3 montées : incertain ; dès 6 : fiable. Plus de mesures = prévision plus précise ; les anciennes valeurs s'estompent.",
    "Urlaub, Schichtdienst und unregelmäßige Tage verfälschen das Profil. Deshalb schlägt Raumklima nur vor und stellt nichts von selbst um.": "Vacances, travail posté et journées irrégulières faussent le profil. C'est pourquoi Raumklima ne fait que proposer et ne change rien tout seul.",
    "Zeitfenster, in denen an mindestens 60 % der Tage jemand da war, gelten als typische Anwesenheit – daraus folgen Vorheiz- und Absenkzeiten.": "Les plages où quelqu'un était là au moins 60 % des jours comptent comme présence typique – d'où les heures de préchauffage et d'abaissement.",
    "Zeitraum": "Période",
    "Ziel geändert": "consigne modifiée",
    "aus dem Profil": "d'après le profil",
    "ehrlich": "honnête",
    "feste Reihenfolge": "ordre fixe",
    "wächst mit Messungen": "augmente avec les mesures",
    "Diagnose": "Diagnostic",
    "Diagnose wird erstellt …": "Création du diagnostic …",
    "Diagnose heruntergeladen": "Diagnostic téléchargé",
    "Alle Werte, Entitäten und die letzten Log-Zeilen als Datei": "Toutes les valeurs, entités et les dernières lignes de journal dans un fichier",
    "Lüften ohne Erinnerung": "Aérer sans rappels",
    "Dauerlüftung ab": "Aération longue à partir de",
    "danach keine Erinnerungen mehr, bis das Fenster zu ist – 0 schaltet es aus": "ensuite plus de rappels jusqu'à la fermeture – 0 désactive",
    "Leise Erinnerung danach": "Rappel discret après",
    "eine einzige, stille Meldung bei sehr langem Lüften – 0 = aus": "un seul message discret pour une aération très longue – 0 = désactivé",
    "Gewohntes Lüften erkennen": "Reconnaître les aérations habituelles",
    "lernt, wann du regelmäßig länger lüftest – dort dann keine Erinnerungen": "apprend quand vous aérez régulièrement plus longtemps – aucun rappel à ces moments",
    "erkannt: {n}× im gleichen Zeitraster (4 Wochen)": "reconnu : {n}× dans le même créneau (4 semaines)",
    "Lüftfenster": "Créneau d'aération",
    "Lüftfenster {n}": "Créneau d'aération {n}",
    "keine – es wird normal erinnert": "aucun – les rappels fonctionnent normalement",
    "z. B. Training morgens: in dieser Zeit keine Hinweise": "p. ex. sport le matin : aucun rappel pendant ce créneau",
    "Dauerlüftung": "Aération longue",
    "Gewohntes Lüften": "Aération habituelle",
    "Geplantes Lüften": "Aération planifiée",
    "Dauerlüftung – ich erinnere nicht": "Aération longue – sans rappel",
    "Gewohntes Lüften – keine Erinnerung": "Aération habituelle – sans rappel",
    "Geplantes Lüften – keine Erinnerung": "Aération planifiée – sans rappel",
    "Gäste gelten für": "Les invités concernent",
    "nur diese Räume werden nicht abgesenkt": "seules ces pièces ne sont pas réduites",
    "keine Auswahl = alle Räume der Wohnung": "aucune sélection = toutes les pièces du logement",
    "Schnellere Abfrage": "Interrogation plus rapide",
    "fragt das Thermostat alle 2 Minuten aktiv ab – für träge Geräte (Homematic & Co.), kostet Funk und Batterie": "interroge le thermostat toutes les 2 minutes – pour les appareils lents (Homematic & co.), coûte de la radio et de la batterie",
    "Batterie {p} %": "Batterie {p} %",
    "Zeitplan überschreiben": "Remplacer le programme",
    "so lange gilt deine Handverstellung (HA oder Alexa), danach wieder der Zeitplan – 0 schaltet es aus": "durée pendant laquelle votre réglage manuel (HA ou Alexa) s'applique, ensuite le programme reprend – 0 le désactive",
    "Karte konnte nicht gezeichnet werden": "La carte n'a pas pu être dessinée",
    "Nur wenn jemand im Raum war": "Seulement si quelqu’un était dans la pièce",
    "keine „bitte lüften“-Hinweise in leeren Räumen (nur mit Präsenzmelder möglich)": "aucun rappel « aérez » dans les pièces vides (possible uniquement avec un détecteur de présence)",
    "kein „bitte lüften“ in leeren Räumen – nur mit Präsenzmelder möglich": "aucun « aérez » dans les pièces vides – possible uniquement avec un détecteur de présence",
    "Nur an anwesende Personen": "Seulement aux personnes présentes",
    "Lüft-Hinweise nur an Handys von Personen, die laut Ortung zu Hause sind – dringende Meldungen (Fenster offen bei Abwesenheit, Frost, Ausfall) gehen weiter an alle": "rappels d’aération uniquement vers les téléphones des personnes présentes selon la géolocalisation – les messages urgents (fenêtre ouverte en absence, gel, panne) vont toujours à tout le monde",
    "Fehler melden": "Signaler un bug",
    "Öffnet ein neues GitHub-Issue mit Version, Home-Assistant-Version und Thermostat-Modell – ohne Raumnamen oder Entitäten": "ouvre un ticket GitHub avec la version, la version de Home Assistant et le modèle du thermostat – sans noms de pièces ni entités",
    "Sturm- und Regenwarnung": "Alerte tempête et pluie",
    "warnt, wenn Sturm oder Starkregen angekündigt ist und ein Fenster offen steht – kommt auch in der Ruhezeit": "avertit lorsqu’une tempête ou de fortes pluies sont annoncées et qu’une fenêtre est ouverte – aussi pendant les heures calmes",
    "… Böen ab": "… rafales dès",
    "ab dieser Böenstärke gilt es als Sturm": "à partir de cette vitesse, on parle de tempête",
    "… Regen ab": "… pluie dès",
    "ab dieser Regenmenge gilt es als Starkregen": "à partir de cette quantité, on parle de fortes pluies",
    "Sturm & Starkregen": "Tempête et fortes pluies",
    "Zeitplan von": "Programme de",
    "eigener Zeitplan": "programme propre",
    "Die Zeitfenster werden im gewählten Raum gepflegt – Änderungen gelten hier automatisch mit": "les plages sont gérées dans la pièce choisie – les modifications s’appliquent ici automatiquement",
    "Zeitfenster einmal pflegen und für mehrere Räume nutzen": "gérer les plages une seule fois et les utiliser pour plusieurs pièces",
    "Übliche Nutzung": "Utilisation habituelle",
    "sammelt noch – nur mit Präsenzmelder": "collecte en cours – capteur de présence requis",
    "Vorschlag aus der Belegung je Wochentag; ein Zeitfenster legst du selbst an": "suggestion issue de l’occupation par jour de la semaine ; vous créez vous-même une plage",
    "Sichern": "Sauvegarder",
    "Wiederherstellen": "Restaurer",
    "Alle Einstellungen als Datei sichern – ohne Passwörter": "enregistrer tous les réglages dans un fichier – sans mots de passe",
    "Sicherung einspielen – Räume werden über ihren Namen zugeordnet": "appliquer une sauvegarde – les pièces sont associées par leur nom",
    "Sicherung wird erstellt …": "création de la sauvegarde …",
    "Sicherung gespeichert": "sauvegarde enregistrée",
    "Sicherung fehlgeschlagen: {e}": "échec de la sauvegarde : {e}",
    "Einstellungen aus dieser Datei einspielen? Die aktuellen Einstellungen werden überschrieben.": "appliquer les réglages de ce fichier ? les réglages actuels seront écrasés.",
    "Eingespielt: {n} Räume": "restauré : {n} pièces",
    "Eingespielt: {n} Räume · {m} nicht gefunden": "restauré : {n} pièces · {m} introuvables",
    "Erste Schritte": "Premiers pas",
    "Bewohner hinterlegt": "Occupants définis",
    "Empfänger für Meldungen": "Destinataires des messages",
    "Wetterquelle gewählt": "Source météo choisie",
    "Raum mit Thermostat": "Pièce avec thermostat",
    "Fensterkontakt eingetragen": "Contact de fenêtre ajouté",
    "Zeitplan angelegt": "Programme créé",
    "Präsenzmelder eingetragen": "Capteur de présence ajouté",
    "Sturmschwelle geprüft": "Seuil de tempête vérifié",
    "{a} von {b} erledigt": "{a} sur {b} terminés",
    "bereit": "prêt",
    "noch offen": "encore ouvert",
    "erledigt": "fait",
    "optional": "optionnel",
    "die wichtigsten Schritte, damit Raumklima sinnvoll regeln kann": "les étapes essentielles pour que Raumklima régule utilement",
    "Einstellungen → Anwesenheit & Absenkung": "Réglages → Présence et réduction",
    "Einstellungen → Wer bekommt was": "Réglages → Qui reçoit quoi",
    "Einstellungen → Benachrichtigungen allgemein": "Réglages → Notifications",
    "Raum → Geräte": "Pièce → Appareils",
    "Raum → Fenster & Lüften": "Pièce → Fenêtres et aération",
    "Raum → Zeitplan": "Pièce → Programme",
    "Raum → Anwesenheit im Raum": "Pièce → Présence dans la pièce",
    "Einstellungen → Sturm- und Regenwarnung": "Réglages → Alerte tempête et pluie",
    "bringt mehr Genauigkeit, ist aber nicht nötig": "apporte de la précision, mais n’est pas nécessaire",
    "Außentemperatur von": "Température extérieure de",
    "Wetterdienst": "Service météo",
    "eigene Wetterstation statt Wetterdienst – die Vorhersage kommt weiterhin vom Wetterdienst": "votre propre station météo au lieu du service météo – les prévisions viennent toujours du service météo",
    "Fehler melden: Issue-Vorlage geöffnet – Link liegt in der Zwischenablage": "Signaler un problème : modèle de ticket ouvert – lien copié dans le presse-papiers",
    "Fehler melden: Issue-Vorlage im neuen Tab geöffnet": "Signaler un problème : modèle de ticket ouvert dans un nouvel onglet",
    "Fehler melden: Link zum Issue – bitte im Browser öffnen: {url}": "Signaler un problème : lien du ticket – à ouvrir dans un navigateur : {url}",
    "Sicherung gespeichert: {name}": "Sauvegarde enregistrée : {name}",
    "Sicherung gespeichert: {name} · liegt zusätzlich in der Zwischenablage": "Sauvegarde enregistrée : {name} · également copiée dans le presse-papiers",
    "Sicherung gespeichert: {name} – falls keine Datei kam, blockt der Browser den Download": "Sauvegarde enregistrée : {name} – si aucun fichier n’apparaît, le navigateur bloque le téléchargement",
    "Sicherung wird geprüft …": "Vérification de la sauvegarde …",
    "Streng nach DIN": "Strict selon DIN",
    "Nur bis Wunsch": "Jusqu'à la consigne",
    "Schimmelschutz": "Protection anti-moisissure",
    "hebt den Sollwert so weit an, dass die kälteste Wandstelle unter 80 % Feuchte bleibt (DIN 4108-2) – auch über den Wunsch hinaus": "remonte la consigne pour que le point de mur le plus froid reste sous 80 % d'humidité (DIN 4108-2) – même au-dessus de la consigne",
    "hebt nur bis zur Wunschtemperatur an – tiefer wird nicht abgesenkt, aber auch nicht darüber geheizt": "remonte seulement jusqu'à la température souhaitée – jamais abaissé plus bas, mais jamais chauffé au-dessus non plus",
    "kein Feuchte-Boden: der Raum fährt genau den eingestellten Wert – bei hoher Feuchte droht Schimmel an kalten Wänden": "aucun plancher d'humidité : la pièce suit exactement la valeur réglée – avec une humidité élevée, risque de moisissure sur les murs froids",
    "Mindestdauer Lüften": "Durée minimale d'aération",
    "automatisch": "automatique",
    "so lange bleibt „Lüften läuft“ mindestens stehen, auch wenn die Feuchte schon passt": "« aération en cours » reste affiché au moins aussi longtemps, même si l'humidité est déjà bonne",
    "automatisch: 60 % der empfohlenen Dauer, mindestens 4 Minuten (gerade {v} min)": "automatique : 60 % de la durée recommandée, au moins 4 minutes (actuellement {v} min)",
    "Kurz weg": "Absence courte",
    "Außerhalb der Zeitfenster": "En dehors des plages horaires",
    "wie bisher: ohne laufendes Fenster gilt die Wunschtemperatur": "comme avant : sans plage active, la température souhaitée s'applique",
    "zwischen den Fenstern wird auf „kurz weg“ abgesenkt": "entre les plages, la pièce passe en « absence courte »",
    "zwischen den Fenstern wird auf „länger weg“ abgesenkt – für Räume, die nur stundenweise genutzt werden": "entre les plages, la pièce passe en « absence longue » – pour les pièces utilisées quelques heures par jour",
    "zwischen den Fenstern gilt nur der Frostschutz – der kälteste erlaubte Wert": "entre les plages, seule la protection hors gel s'applique – la valeur minimale autorisée",
    "Arbeitszimmer": "Bureau",
    "Gästezimmer": "Chambre d'amis",
    "Flur": "Couloir",
    "Sportzimmer": "Salle de sport",
    "jederzeit änderbar – Standardwerte des neuen Typs werden übernommen, eigene Werte bleiben": "modifiable à tout moment – les valeurs par défaut du nouveau type sont reprises, vos valeurs restent",
    "Schimmel": "Moisissure",
    "Leer": "Vide",
    "Sonne": "Soleil",
    "Frost": "Gel",
    "Ventilpflege": "Entretien vanne",
    "{tag} {v}° · Wunsch {w}°": "{tag} {v}° · consigne {w}°",
    "{tag} {v}°": "{tag} {v}°",
    "Die Karte im Browser ist älter als die Integration – Seite mit Strg+Shift+R neu laden.": "La carte du navigateur est plus ancienne que l'intégration – rechargez avec Ctrl+Shift+R.",
    "neu: {v} – Seite neu laden": "nouveau : {v} – recharger la page",
    "Schimmel +{d}°": "Moisissure +{d}°",
    "Schimmelschutz <b>+{d} °C</b> auf {v} °C · {rh} % Feuchte im Tagesmittel": "Protection moisissure <b>+{d} °C</b> à {v} °C · {rh} % d'humidité (moyenne 24 h)",
    "Schimmelschutz <b>{v} °C</b>": "Protection moisissure <b>{v} °C</b>",
    "bestimmt, wie kalt die kälteste Wandstelle wird: eine Außenecke braucht mehr Schutz als eine Innenwand": "détermine la température du point de paroi le plus froid : un angle extérieur demande plus de protection qu'une cloison",
    "wie die Wohnung": "comme le logement",
    "Außenecke": "angle extérieur",
    "Außenwand": "mur extérieur",
    "innenliegend": "intérieur",
    "Feuchtequelle im Raum": "Source d'humidité",
    "Höchstens anheben um": "Hausse maximale de",
    "Heizen löst kein Feuchteproblem: über diesem Zuschlag wird nicht weiter geheizt, sondern zum Lüften geraten (nachts 1,5 K)": "Chauffer ne résout pas l'humidité : au-delà de cette hausse, le chauffage s'arrête et l'aération est conseillée (1,5 K la nuit)",
    "Feuchte zu hoch für die Wand · {rh} % im Tagesmittel, {h} h kritisch – bitte lüften": "Humidité trop élevée pour ce mur · {rh} % (moyenne 24 h), {h} h critiques – aérez",
    "hebt den Sollwert so weit an, dass die kälteste Wandstelle unter 80 % Feuchte bleibt (DIN 4108-2) – begrenzt durch den Zuschlag darunter": "élève la consigne jusqu'à ce que le point de paroi le plus froid reste sous 80 % d'humidité (DIN 4108-2) – limité par la hausse ci-dessous",
    "GitHub öffnen": "Ouvrir GitHub",
    "Teilen": "Partager",
    "Kopieren": "Copier",
    "Schließen": "Fermer",
    "Sicherung erstellt": "Sauvegarde créée",
    "Enthält alle Räume, Zeitpläne und Einstellungen dieser Wohnung. Auf dem iPhone/iPad über „Teilen“ in Dateien sichern, am Rechner über „Speichern“.": "Contient toutes les pièces, programmes et réglages de ce logement. Sur iPhone/iPad via Partager → Enregistrer dans Fichiers, sur ordinateur via Enregistrer.",
    "Gespeichert: {name} – falls keine Datei kam, bitte Teilen benutzen": "Enregistré : {name} – si aucun fichier n'apparaît, utilisez Partager",
    "Kopiert – jetzt im Ziel einfügen": "Copié – collez-le maintenant",
    "Kopieren hat der Browser blockiert – Text bitte im Feld markieren": "Le navigateur a bloqué la copie – sélectionnez le texte dans le champ",
    "Zum Melden eines Fehlers: teilen oder speichern – die Datei enthält Werte, Entitäten und die letzten Protokollzeilen, aber keine Zugangsdaten.": "Pour signaler un problème : partager ou enregistrer – le fichier contient des valeurs, des entités et les dernières lignes de journal, sans identifiants.",
    "Text prüfen – es stehen keine Raumnamen oder Zugangsdaten darin –, dann GitHub öffnen und den Text einfügen. Auf dem iPhone oder iPad geht auch Teilen oder Kopieren.": "Vérifiez le texte – il ne contient ni noms de pièces ni identifiants –, puis ouvrez GitHub et collez-le. Sur iPhone ou iPad, partager ou copier fonctionne aussi.",
    "Datei laden": "Charger le fichier",
    "Gespeichert: {name} – falls keine Datei kam, bitte Datei laden benutzen": "Enregistré : {name} – si aucun fichier n'apparaît, utilisez Charger le fichier",
    "Kopieren hat der Browser blockiert – Text bitte im Feld markieren und selbst kopieren": "Le navigateur a bloqué la copie – sélectionnez le texte et copiez-le",
    "Geteilt": "Partagé",
    "Zum Melden eines Fehlers: die Datei laden und an das Issue anhängen. Sie enthält Werte, Entitäten und die letzten Protokollzeilen, aber keine Zugangsdaten.": "Pour signaler un problème : chargez le fichier et joignez-le au ticket. Il contient des valeurs, des entités et les dernières lignes de journal, sans identifiants.",
    "Wärmemenge im Bericht": "Chaleur fournie dans le rapport",
    "Ventilstellung": "Position de vanne",
    "Gradstunden": "Degrés-heures",
    "automatisch = Ventilstellung, wenn jedes Thermostat sie meldet – sonst Gradstunden unter Ziel (gemessen, nicht geschätzt)": "automatique = position de vanne si chaque thermostat la transmet – sinon degrés-heures sous la cible (mesuré, pas estimé)",
    "{v} K·h unter Ziel": "{v} K·h sous la cible",
    "{v} h geheizt": "{v} h de chauffe",
    "{v} h nicht erreichbar": "{v} h injoignable",
    "Balken = Gradstunden unter Ziel (K·h): wie weit die Räume über die Zeit unter ihrem Ziel lagen. Das ist gemessen, nicht geschätzt – die Geräte melden keine Ventilstellung.": "Barres = degrés-heures sous la cible (K·h) : à quel point les pièces sont restées sous leur cible. Mesuré, pas estimé – les appareils ne transmettent pas la position de vanne.",
    "Balken = Heizstunden: wie lange die Räume Wärme angefordert haben.": "Barres = heures de chauffe : combien de temps les pièces ont demandé de la chaleur.",
    "Balken = wie lange die Ventile umgerechnet voll offen waren (Maß für die Wärmemenge).": "Barres = durée pendant laquelle les vannes étaient entièrement ouvertes, convertie (mesure de la chaleur fournie).",
    "Punkte = Heizgradtage: je kälter es draußen war, desto höher. Hohe Balken an milden Tagen sind ein Hinweis auf offene Fenster oder zu hohe Wunschtemperaturen.": "Points = degrés-jours de chauffe : plus il faisait froid dehors, plus haut. Des barres hautes par temps doux indiquent des fenêtres ouvertes ou des consignes trop élevées.",
    "Antwortzeit des Geräts": "Délai de réponse de l’appareil",
    "automatisch lernen": "apprentissage automatique",
    "1 Minute": "1 minute",
    "5 Minuten": "5 minutes",
    "15 Minuten": "15 minutes",
    "30 Minuten": "30 minutes",
    "wie lange das Gerät schweigen darf, ohne als ausgefallen zu gelten – automatisch lernt es aus den Funkpausen (FRITZ!DECT braucht ~15 Minuten)": "combien de temps l’appareil peut rester silencieux avant d’être considéré injoignable – automatique apprend des pauses radio (FRITZ!DECT a besoin d’environ 15 minutes)",
    "Bericht konnte nicht gezeichnet werden: {e}": "Le rapport n’a pas pu être dessiné : {e}",
    "Hinweise für diesen Raum pausiert": "Notifications en pause pour cette pièce",
    "Pause bis {time}": "En pause jusqu’à {time}",
    "Dunkler Look": "Apparence sombre",
    "Immer dunkel": "Toujours sombre",
    "Immer hell": "Toujours clair",
    "gilt für alle Karten dieser Wohnung": "vaut pour toutes les cartes de ce logement",
    "{n} Thermostate": "{n} thermostats",
    "Haupt": "Principal",
    "erwartet {v}°": "attendu {v}°",
    "Jedes Thermostat mit eigenem Sollwert und eigener Öffnung": "Chaque thermostat avec sa propre consigne et ouverture",
    "gilt für alle Räume und Karten dieser Wohnung": "vaut pour toutes les pièces et cartes de ce logement",
    "meldet keine Ventilöffnung": "ne signale pas d’ouverture de vanne",
    "Absenkwert nachts": "Valeur de réduction nocturne",
    "Frostschutz": "Hors gel",
    "Immer": "Toujours",
    "Nachtabsendung": "Réduction nocturne",
    "Nie": "Jamais",
    "gilt bei der Ruhezeit und wenn der Schalter „Nachtruhe“ an ist – je Raum unter „Nachtabsendung“ ein- oder ausgeschlossen": "s’applique pendant les heures calmes et lorsque l’interrupteur « Mode nuit » est activé – incluez ou excluez chaque pièce sous « Réduction nocturne »",
    "wie bisher: nur Schlafzimmer und selten genutzte Räume": "comme avant : uniquement les chambres et les pièces peu utilisées",
    "wird abgesenkt, sobald Ruhezeit ist oder der Schalter „Nachtruhe“ an ist": "est abaissée dès que les heures calmes s’appliquent ou que l’interrupteur « Mode nuit » est activé",
    "wird nachts nicht abgesenkt": "n’est pas abaissée la nuit",
    "1 h": "1 h",
    "15 min": "15 min",
    "2 h": "2 h",
    "30 min": "30 min",
    "Bis Zeitfenster": "Jusqu’à la prochaine plage",
    "Ohne Limit": "Sans limite",
    "Wie lange soll es wärmer sein?": "Pendant combien de temps faire plus chaud ?",
    "läuft noch {m} min": "encore {m} min",
    "läuft ohne Zeitlimit": "fonctionne sans limite de temps",
    "Gilt für Personen": "Concerne les personnes",
    "Urlaub automatisch ab": "Vacances détectées au-delà de",
    "… nach": "… après",
    "erst so lange weit weg zählt als Urlaub (Tagesausflug löst nicht aus)": "ce n’est qu’après ce délai qu’être loin compte comme des vacances (une excursion d’un jour ne déclenche rien)",
    "keine Auswahl = der Raum gilt allen Bewohnern": "aucune sélection = la pièce concerne tous les habitants",
    "nur wenn eine dieser Personen zu Hause ist – sonst wird der Raum abgesenkt": "seulement si l’une de ces personnes est présente – sinon la pièce est abaissée",
    "sind alle Bewohner weiter weg, gilt nach der Wartezeit Urlaub – 0 = aus": "si tous les habitants sont plus loin, les vacances s’appliquent après le délai – 0 = désactivé",
    "Erst zum Zeitplan": "Seulement à la plage",
    "Frühestens ab": "Pas avant",
    "Frühestens vorher": "Au plus tôt",
    "ab {h}:00": "à partir de {h}:00",
    "heizt erst zum Beginn des Zeitfensters – der Raum ist dann noch kalt": "chauffe seulement au début de la plage – la pièce est encore froide",
    "so viele Minuten vor dem Zeitfenster": "autant de minutes avant la plage",
    "startet höchstens so viele Minuten vor dem Zeitfenster": "démarre au plus tôt ce nombre de minutes avant la plage",
    "startet nicht vor der eingestellten Uhrzeit – zum Beginn evtl. noch nicht ganz warm": "ne démarre pas avant l’heure définie – peut ne pas être tout à fait chaud au début",
    "startet so früh, wie die gelernte Aufheizzeit es verlangt": "démarre aussi tôt que le temps de chauffe appris l’exige",
    "… höchstens": "… au plus",
    "… nicht vor": "… pas avant",
    "Homeoffice": "Télétravail",
    "Homeoffice gilt für": "Télétravail s’applique à",
    "Homeoffice · {v}°": "Télétravail · {v}°",
    "Homeoffice-Fenster": "Plage de télétravail",
    "im Fenster gilt der Wunsch, der Zeitplan pausiert": "pendant la plage, la consigne s’applique et la plage horaire est suspendue",
    "keine Auswahl = alle Räume mit Thermostat": "aucune sélection = toutes les pièces avec thermostat",
    "nur diese Räume werden auf Wunsch geheizt": "seules ces pièces sont chauffées à la consigne",
    "in dieser Zeit heizen die gewählten Räume auf Wunsch; danach läuft der Zeitplan weiter": "pendant cette période, les pièces choisies chauffent à la consigne ; ensuite la plage horaire reprend",
    "Homeoffice nur wenn jemand da": "Télétravail seulement si quelqu’un est là",
    "gilt für Kalendertermine; der Schalter heizt auch ohne Ortung": "s’applique aux rendez-vous du calendrier ; l’interrupteur chauffe même sans détection de présence",
    "0 °C = aus; sonst gilt der Zeitplan": "0 °C = désactivé ; sinon la plage horaire s’applique",
    "Anwesend · {v}°": "Présence · {v}°",
    "Bei Anwesenheit": "En cas de présence",
    "HA-Schalter, der Homeoffice mit schaltet – gilt wie der Schalter, ohne Anwesenheitsprüfung": "Interrupteur HA qui active aussi le télétravail – comme l’interrupteur, sans contrôle de présence",
    "HA-Schalter, der die Nachtruhe mit schaltet – der eigene Schalter bleibt": "Interrupteur HA qui active aussi le mode nuit – l’interrupteur interne reste",
    "Homeoffice über Entität": "Télétravail via entité",
    "Nachtruhe über Entität": "Mode nuit via entité",
    "so warm, solange ein Melder jemanden im Raum sieht": "cette température tant qu’un capteur voit quelqu’un dans la pièce"
  };

  // src/i18n.js
  var TABLES = { en: EN, fr: FR };
  var lang = "de";
  var locale = "de-DE";
  var hour12 = null;
  function setLang(hass) {
    const l = String(hass && (hass.locale && hass.locale.language || hass.language) || "de");
    const low = l.toLowerCase();
    lang = low.startsWith("de") ? "de" : low.startsWith("fr") ? "fr" : "en";
    locale = lang === "de" ? "de-DE" : l;
    const tf = String(hass && hass.locale && hass.locale.time_format || "language");
    hour12 = tf === "12" ? true : tf === "24" ? false : null;
  }
  function timeOpts(extra) {
    const opts = extra ? { ...extra } : {};
    if (hour12 !== null) opts.hour12 = hour12;
    return opts;
  }
  function rkTime(d, opts) {
    return d.toLocaleTimeString(locale, timeOpts(opts));
  }
  var getLang = () => lang;
  var loc = () => locale;
  function t(de, vars) {
    let s = lang === "de" ? de : TABLES[lang][de] ?? EN[de] ?? de;
    if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => k in vars ? vars[k] : m);
    return s;
  }
  function tmap(obj) {
    return new Proxy(obj, {
      get(target, key) {
        const v = target[key];
        if (typeof v === "string") return t(v);
        if (Array.isArray(v)) return v.map((x) => typeof x === "string" ? t(x) : x);
        if (v && typeof v === "object") return tmap(v);
        return v;
      }
    });
  }

  // src/version.js
  var RK_VERSION = "0.62.34b1";

  // src/shared.js
  var rkManualUrl = () => `https://github.com/Goldi5/Raumklima-2/releases/latest/download/${getLang() === "de" ? "Raumklima-Handbuch.pdf" : "Raumklima-Manual.pdf"}`;
  function rkBugReportUrl({ version, haVersion, language, rooms, homeCount, thermostats, parts = false }) {
    const models = [...new Set(thermostats.filter(Boolean))].sort();
    const body = [
      "### Was passiert",
      "<!-- kurz beschreiben, was du beobachtest -->",
      "",
      "### Was du erwartet hast",
      "",
      "### Umgebung (automatisch ausgefüllt)",
      `- Raumklima: ${version || "?"}`,
      `- Home Assistant: ${haVersion || "?"}`,
      `- Sprache: ${language || "?"}`,
      `- Räume: ${rooms} in ${homeCount} Wohnung(en)`,
      `- Thermostate: ${models.length ? models.join(", ") : "unbekannt"}`,
      "",
      "### Diagnose-Datei",
      "Bitte *Einstellungen → Allgemein → Diagnose* anklicken und die JSON-Datei hier anhängen.",
      "Darin stehen Werte, Entitäten und die letzten Protokollzeilen – ohne Zugangsdaten.",
      ""
    ].join("\n");
    const query = [
      `title=${encodeURIComponent("[Fehler] ")}`,
      `body=${encodeURIComponent(body)}`,
      "labels=bug"
    ].join("&");
    const url = `https://github.com/Goldi5/Raumklima-2/issues/new?${query}`;
    return parts ? { url, body } : url;
  }
  var escRe = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  var STATUS = tmap({
    heating: { label: "Heizt", icon: "mdi:fire", tone: "heat" },
    idle: { label: "Temperatur erreicht", icon: "mdi:check-circle", tone: "ok" },
    window_open: { label: "Pausiert – Fenster offen", icon: "mdi:window-open-variant", tone: "air" },
    off: { label: "Aus", icon: "mdi:power", tone: "off" },
    off_trv: { label: "Aus – am Thermostat abgeschaltet", icon: "mdi:power-plug-off", tone: "off" },
    sensor_unavailable: { label: "Fühler ausgefallen", icon: "mdi:thermometer-alert", tone: "warn" },
    trv_unavailable: { label: "Thermostat nicht erreichbar", icon: "mdi:lan-disconnect", tone: "warn" },
    season_off: { label: "Heizpause", icon: "mdi:weather-sunny", tone: "off" },
    setback: { label: "Abgesenkt – niemand da", icon: "mdi:home-export-outline", tone: "eco" },
    night_airing: { label: "Nachtlüften – Fenster offen", icon: "mdi:weather-night", tone: "air" }
  });
  var PRESENCE = tmap({
    home: { label: "Jemand da", icon: "mdi:home-account", tone: "ok" },
    guests: { label: "Gäste da", icon: "mdi:account-group", tone: "ok" },
    preheat: { label: "Vorheizen", icon: "mdi:car-arrow-right", tone: "heat" },
    away_short: { label: "Alle weg", icon: "mdi:home-export-outline", tone: "eco" },
    away_long: { label: "Länger weg", icon: "mdi:bag-suitcase", tone: "eco" }
  });
  var SEASON = tmap({
    heating: { label: "Heizsaison", icon: "mdi:radiator", tone: "heat" },
    pause: { label: "Heizpause", icon: "mdi:weather-sunny", tone: "off" },
    cold_snap: { label: "Kälteeinbruch", icon: "mdi:snowflake-thermometer", tone: "cold" },
    heat_today: { label: "Heute heizen", icon: "mdi:fire-circle", tone: "heat" },
    always: { label: "Immer heizen", icon: "mdi:radiator", tone: "heat" },
    manual_pause: { label: "Heizpause (Hand)", icon: "mdi:radiator-off", tone: "off" }
  });
  function rkNeedsDashboard(dashboards, path, current = "") {
    const p = String(path || "").replace(/^\//, "");
    if (!p) return false;
    if (p === String(current || "").replace(/^\//, "")) return false;
    return !Object.prototype.hasOwnProperty.call(dashboards || {}, p);
  }
  function rkHomes(hass) {
    return Object.values(hass.entities || {}).filter((e) => e.platform === "raumklima" && e.translation_key === "presence" && hass.states[e.entity_id]).map((e) => {
      const a = hass.states[e.entity_id].attributes;
      return { id: a.home_id, name: a.home_name || t("Allgemein"), dashboard: a.home_dashboard, presence: e.entity_id };
    }).filter((h) => h.id);
  }
  function rkSchedSortKey(w) {
    const mins = (v) => {
      const [h, m] = String(v || "00:00").split(":").map((x) => parseInt(x, 10) || 0);
      return h * 60 + m;
    };
    const start = mins(w && w.start);
    const end = mins(w && w.end);
    const days = w && w.days || [];
    return [start >= end ? start - 1440 : start, -days.length, String(days.join(""))];
  }
  function rkTimeValue(text) {
    const s = String(text || "").trim();
    const parts = s.split(/[:. ]+/).filter(Boolean);
    const digits = s.replace(/\D/g, "");
    let h;
    let min;
    if (parts.length >= 2) {
      h = parseInt(parts[0], 10);
      min = parseInt(parts[1], 10);
    } else if (digits.length <= 2) {
      h = parseInt(digits, 10);
      min = 0;
    } else {
      h = parseInt(digits.slice(0, digits.length - 2), 10);
      min = parseInt(digits.slice(-2), 10);
    }
    if (!Number.isFinite(h) || !Number.isFinite(min) || h < 0 || h > 23 || min < 0 || min > 59) return "";
    return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
  }
  var RK_UMLAUT = { ä: "ae", ö: "oe", ü: "ue", ß: "ss" };
  function rkSlug(v) {
    return String(v || "").toLowerCase().replace(/[äöüß]/g, (c) => RK_UMLAUT[c]).replace(/[^a-z0-9]/g, "");
  }
  function rkHomeId(hass, config = {}) {
    const hs = rkHomes(hass);
    const want = String(config && config.home || "").trim();
    if (want) {
      const hit = hs.find((h) => h.id === want) || hs.find((h) => h.name === want) || hs.find((h) => rkSlug(h.name) === rkSlug(want));
      return hit ? hit.id : want;
    }
    const path = String(hass && hass.panelUrl || "").replace(/^\//, "");
    if (path) {
      const byPath = hs.find((h) => String(h.dashboard || "").replace(/^\//, "") === path);
      if (byPath) return byPath.id;
      const seg = path.split("/")[0];
      const hit = hs.find((h) => rkSlug(h.name) && seg.endsWith(rkSlug(h.name)));
      if (hit) return hit.id;
    }
    return null;
  }
  function rkHub(hass, home) {
    const out = {};
    const reg = Object.values(hass.entities || {});
    const all = reg.filter((e) => e.platform === "raumklima" && e.translation_key === "presence");
    const pres = home && all.find((e) => (hass.states[e.entity_id] || { attributes: {} }).attributes.home_id === home) || all[0];
    if (!pres) return out;
    for (const e of reg) if (e.device_id === pres.device_id && e.translation_key) out[e.translation_key] = e.entity_id;
    return out;
  }
  function planTag(a) {
    const r = a && a.plan_reason;
    if (!r || r === "normal" || r === "manual" || r === "monitor") return "";
    const map = {
      mold: "Schimmel",
      schedule: "Zeitplan",
      schedule_preheat: "Vorheizen",
      home_office: "Homeoffice",
      presence: "Anwesend",
      boost: "Boost",
      sleep: "Ruhezeit",
      away_short: "Abgesenkt",
      away_long: "Abgesenkt",
      room_empty: "Leer",
      solar: "Sonne",
      frost: "Frost",
      valve_care: "Ventilpflege",
      season: "Heizpause"
    };
    return map[r] ? t(map[r]) : "";
  }
  function planText(a, off, compact = false) {
    if (off) return t("Heizung aus");
    const r = a.plan_reason;
    if (r === "season") return t("Heizpause");
    if (r === "valve_care") return t("Ventilpflege läuft");
    const tgt = a.effective_target != null ? a.effective_target : a.temperature;
    const wish = a.wish != null ? a.wish : a.temperature;
    if (compact) {
      if (r === "frost") return t("Frostschutz {v}°", { v: fmt(tgt) });
      if (r === "away_short" || r === "away_long") return t("Abgesenkt · Wunsch {w}°", { w: fmt(wish) });
      if (r === "manual") return t("Von Hand · {v}°", { v: fmt(a.temperature) });
      if (r === "room_empty") return t("Leer · {v}°", { v: fmt(tgt) });
      if (r === "schedule") return t("Zeitplan · {v}°", { v: fmt(tgt) });
      if (r === "boost") return t("Boost · {v}°", { v: fmt(tgt) });
      if (r === "schedule_preheat") return t("Vorheizen · {v}°", { v: fmt(tgt) });
      if (r === "home_office") return t("Homeoffice · {v}°", { v: fmt(tgt) });
      if (r === "presence") return t("Anwesend · {v}°", { v: fmt(tgt) });
      if (r === "sleep") return t("Ruhezeit · {v}°", { v: fmt(tgt) });
      if (r === "mold") {
        const plus = a.mold_min != null && wish != null ? a.mold_min - wish : null;
        if (plus != null && plus >= 0.2) return t("Schimmel +{d}°", { d: fmt(plus) });
        return t("Schimmel · {v}°", { v: fmt(tgt) });
      }
      if (r === "solar") return t("Sonne · {v}°", { v: fmt(tgt) });
      return t("Ziel {v}°", { v: fmt(a.temperature) });
    }
    if (r === "frost") return t("Frostschutz <b>{v} °C</b>", { v: fmt(a.effective_target) });
    if (r === "mold") {
      const plus = a.mold_min != null && wish != null ? a.mold_min - wish : null;
      const rh = a.mold_rh != null ? fmt(a.mold_rh, 0) : null;
      if (a.mold_capped) {
        return t("Feuchte zu hoch für die Wand · {rh} % im Tagesmittel, {h} h kritisch – bitte lüften", {
          rh: rh || "–",
          h: a.mold_risk_hours != null ? fmt(a.mold_risk_hours, 1) : "–"
        });
      }
      if (plus != null && plus >= 0.2 && rh) {
        return t("Schimmelschutz <b>+{d} °C</b> auf {v} °C · {rh} % Feuchte im Tagesmittel", {
          d: fmt(plus),
          v: fmt(a.mold_min),
          rh
        });
      }
      return t("Schimmelschutz <b>{v} °C</b>", { v: fmt(a.effective_target) });
    }
    if ((r === "away_short" || r === "away_long") && a.effective_target != null)
      return t("Abgesenkt <b>{v} °C</b> · Wunsch {w}°", { v: fmt(a.effective_target), w: fmt(wish) });
    if (r === "manual") return t("Ziel <b>{v} °C</b> · von Hand", { v: fmt(a.temperature) });
    if (r === "room_empty" && a.effective_target != null) return t("Raum leer · Ziel <b>{v} °C</b>", { v: fmt(a.effective_target) });
    if (r === "schedule" && a.effective_target != null) return t("Zeitplan · Ziel <b>{v} °C</b>", { v: fmt(a.effective_target) });
    if (r === "boost" && a.effective_target != null) return t("Boost · Ziel <b>{v} °C</b>", { v: fmt(a.effective_target) });
    if (r === "schedule_preheat" && a.effective_target != null) return t("Vorheizen für Zeitplan · <b>{v} °C</b>", { v: fmt(a.effective_target) });
    if (r === "sleep" && a.effective_target != null) return t("Ruhezeit · Ziel <b>{v} °C</b>", { v: fmt(a.effective_target) });
    if (r === "mold" && a.effective_target != null) return t("Schimmelschutz · Ziel <b>{v} °C</b>", { v: fmt(a.effective_target) });
    if (r === "solar" && a.effective_target != null) return t("Sonne heizt mit · Ziel <b>{v} °C</b>", { v: fmt(a.effective_target) });
    return t("Ziel <b>{v} °C</b>", { v: fmt(a.temperature) });
  }
  var VENT = tmap({
    ok: null,
    please_open: { label: "Bitte lüften", icon: "mdi:air-filter", tone: "air" },
    airing: { label: "Lüftet", icon: "mdi:weather-windy", tone: "air" },
    done: { label: "Luft ausgetauscht – du kannst schließen", icon: "mdi:check-decagram", tone: "ok" },
    please_close: { label: "Lüftzeit erreicht – bitte schließen", icon: "mdi:window-closed-variant", tone: "warn" },
    too_cold: { label: "Raum kühlt aus – jetzt schließen", icon: "mdi:snowflake-alert", tone: "cold" }
  });
  function rkWindowOpen(hass, id) {
    const st = hass.states[id];
    if (!st) return false;
    if (String(id).startsWith("cover.")) {
      if (["open", "opening"].includes(st.state)) return true;
      const pos = st.attributes && st.attributes.current_position;
      return pos != null && Number(pos) > 0;
    }
    return st.state === "on";
  }
  function rkOpenSince(hass, a) {
    if (!a || !a.window_open) return null;
    const times = (a.window_entities || []).map((e) => hass.states[e]).filter((s) => s && (s.state === "on" || (s.entity_id || "").startsWith("cover.") && ["open", "opening"].includes(s.state)) && s.last_changed).map((s) => Date.parse(s.last_changed));
    if (a.window_open_since) times.push(Date.parse(a.window_open_since));
    return times.length ? Math.min(...times.filter((x) => !isNaN(x))) : null;
  }
  function rkDuration(ms) {
    const s = Math.max(0, Math.floor(ms / 1e3));
    if (s < 60) return t("{n} s", { n: s });
    const m = Math.floor(s / 60);
    if (m < 60) return t("{n} min", { n: m });
    const h = Math.floor(m / 60);
    if (h < 24) return t("{h} h {m} min", { h, m: String(m % 60).padStart(2, "0") });
    return t("{d} Tg. {h} h", { d: Math.floor(h / 24), h: h % 24 });
  }
  function rkClock(ms) {
    const d = new Date(ms);
    const time = rkTime(d, { hour: "2-digit", minute: "2-digit" });
    return Date.now() - ms > 20 * 3600 * 1e3 ? `${d.toLocaleDateString(loc(), { weekday: "short" })} ${time}` : time;
  }
  function rkPaint(host, html) {
    const root = host.shadowRoot;
    const h = host.offsetHeight;
    const y = window.scrollY;
    const scrollers = [];
    for (let el = host.parentElement || host.getRootNode() && host.getRootNode().host; el; el = el.parentElement || el.getRootNode() && el.getRootNode().host) {
      if (el.scrollTop) scrollers.push([el, el.scrollTop]);
    }
    if (h) host.style.minHeight = `${h}px`;
    root.innerHTML = html;
    if (window.scrollY !== y) window.scrollTo(0, y);
    for (const [el, top] of scrollers) if (el.scrollTop !== top) el.scrollTop = top;
    clearTimeout(host._rkHold);
    host._rkHold = setTimeout(() => {
      host.style.minHeight = "";
    }, 600);
  }
  var rkLastScroll = 0;
  if (typeof window !== "undefined") {
    const mark = () => {
      rkLastScroll = Date.now();
    };
    for (const ev of ["scroll", "wheel", "touchmove"]) window.addEventListener(ev, mark, { capture: true, passive: true });
  }
  var rkScrolling = () => Date.now() - rkLastScroll < 600;
  function rkLater(host, fn) {
    clearTimeout(host._rkLater);
    host._rkLater = setTimeout(() => rkScrolling() ? rkLater(host, fn) : fn(), 700);
  }
  function rkChanged(host, hass, ids) {
    const refs = ids.map((id) => hass.states[id]);
    const prev = host._rkRefs;
    host._rkRefs = refs;
    return !prev || prev.length !== refs.length || refs.some((r, i) => r !== prev[i]);
  }
  function rkBusy(host) {
    const a = host.shadowRoot && host.shadowRoot.activeElement;
    return !!a && ["INPUT", "SELECT", "TEXTAREA"].includes(a.tagName);
  }
  var fmt = (v, d = 1) => v === null || v === void 0 || isNaN(v) ? "–" : Number(v).toLocaleString(loc(), { minimumFractionDigits: d, maximumFractionDigits: d });
  var humTone = (h) => h === null || h === void 0 ? "off" : h < 40 ? "warn" : h <= 60 ? "ok" : h < 70 ? "warn" : "cold";
  var STYLES = `
  .boostbtn { all:unset; cursor:pointer; display:inline-flex; gap:5px; align-items:center; padding:5px 12px; border-radius:999px; font-weight:600; font-size:.84rem;
    background: color-mix(in srgb, var(--primary-text-color) 7%, transparent); color: var(--secondary-text-color); }
  .boostbtn ha-icon { --mdc-icon-size:16px; }
  .boostbtn.on { background: var(--rk-heat); color:#fff; }
  :host { --rk-heat:#ff7a45; --rk-ok:#2ec4a6; --rk-air:#4f9dff; --rk-warn:#ffb020; --rk-cold:#ff4d6d; --rk-off:#8a94a6; --rk-eco:#8b7cf6; }
  ha-card { display:block; position:relative; box-sizing:border-box; overflow:hidden; border-radius:28px; padding:20px; isolation:isolate;
    background: var(--ha-card-background, var(--card-background-color)); transition: box-shadow .3s; }
  ha-card::before { content:""; position:absolute; inset:-40% -20% auto auto; width:320px; height:320px; z-index:-1;
    background: radial-gradient(circle, var(--tone) 0%, transparent 65%); opacity:.18; transition: background .6s; }
  /* Kopfzeile: Name (kürzt bei Bedarf), Fenstersymbol und Boost bleiben an ihrem Platz.
     Der Status steht darunter in einer eigenen Zeile – so verschiebt sich nichts mehr. */
  .top { display:flex; align-items:center; gap:10px; flex-wrap:nowrap; min-width:0; }
  .chips { display:flex; flex-wrap:wrap; align-items:center; gap:6px; margin-top:7px; min-width:0; }
  .chips:empty { display:none; }
  /* Lange Statustexte dürfen im Chip umbrechen – lieber zwei Zeilen im Chip als abgeschnitten */
  .chips .chip { white-space:normal; align-items:center; line-height:1.25; }
  .name { font-size:1.15rem; font-weight:600; letter-spacing:-.01em; cursor:pointer; flex:1 1 auto; min-width:0;
    color:var(--primary-text-color); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .top > .wins, .top > .boostbtn { flex:none; }
  .chip { display:inline-flex; align-items:center; gap:6px; padding:6px 12px; border-radius:999px; font-size:.82rem; font-weight:600;
    color:var(--tone); background: color-mix(in srgb, var(--tone) 14%, transparent); white-space:nowrap;
    flex:0 1 auto; min-width:0; max-width:100%; overflow:hidden; text-overflow:ellipsis; }
  .chip ha-icon { flex:none; }
  /* Zusatzinfo (Gerätesollwert/Abgleich) bekommt eine eigene Zeile – sonst schiebt sie den Chip aus der Karte */
  .trvnote { display:flex; align-items:center; gap:6px; margin-top:6px; min-width:0;
    font-size:.8rem; color:var(--secondary-text-color); font-variant-numeric:tabular-nums; }
  .trvnote ha-icon { --mdc-icon-size:15px; flex:none; }
  .trvnote span { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .chip ha-icon { --mdc-icon-size:16px; }
  .wins { display:flex; gap:4px; color:var(--secondary-text-color); }
  .wins ha-icon { --mdc-icon-size:20px; }
  .wins .open { color: var(--rk-air); }
  .since { display:flex; align-items:center; gap:6px; margin-top:6px; font-size:.85rem; font-weight:600; color:var(--rk-air); font-variant-numeric:tabular-nums; }
  .since ha-icon { --mdc-icon-size:16px; }
  .since.occ { color:var(--secondary-text-color); margin-top:2px; font-weight:500; }
  .since.occ.in { color:var(--rk-ok); }
  /* Raumfarbe: schmaler Rand oben und Hauch im Hintergrund, Status bleibt am Ring */
  .rcard { border-top: 4px solid var(--accent, transparent); }
  .rcard { background-image: linear-gradient(color-mix(in srgb, var(--accent, transparent) 7%, transparent), transparent 120px); }
  .dial { position:relative; display:grid; place-items:center; margin:8px auto 4px; width:min(240px,100%); aspect-ratio:1/0.82; container-type: inline-size; }
  .dial svg { position:absolute; inset:0; width:100%; height:100%; overflow:visible; }
  .track { stroke: color-mix(in srgb, var(--primary-text-color) 9%, transparent); }
  .fill { stroke: var(--tone); transition: stroke-dasharray .6s ease, stroke .6s; filter: drop-shadow(0 0 6px color-mix(in srgb, var(--tone) 55%, transparent)); }
  .knob { fill: var(--ha-card-background, var(--card-background-color)); stroke: var(--tone); stroke-width:3; filter: drop-shadow(0 2px 4px rgba(0,0,0,.25)); }
  .fill.muted { stroke: var(--rk-off); filter:none; opacity:.5; }
  .scale { font-size:10px; fill: var(--secondary-text-color); }
  .tlabel { font-size:11px; font-weight:600; fill: var(--tone); }
  /* Text bleibt IM Ring: Breite begrenzen und umbrechen, sonst schneidet er den Bogen (iPad/Handy). */
  .center { text-align:center; z-index:1; margin-top:-6px; max-width:58%; min-width:0; }
  .now { font-size:2.9rem; font-size:clamp(2.1rem, 17cqw, 3.1rem); font-weight:300; letter-spacing:-.04em; line-height:1; font-variant-numeric: tabular-nums; color:var(--primary-text-color); }
  .now small { font-size:.42em; vertical-align: super; margin-left:2px; color:var(--secondary-text-color); }
  .target { margin-top:6px; font-size:.82rem; line-height:1.25; color:var(--secondary-text-color); font-variant-numeric: tabular-nums; text-wrap: balance; overflow-wrap:anywhere; }
  .target b { color:var(--primary-text-color); font-weight:600; }
  .ctrl { display:flex; justify-content:center; align-items:center; gap:18px; margin-top:4px; }
  button.round { all:unset; cursor:pointer; width:48px; height:48px; border-radius:50%; display:grid; place-items:center;
    background: color-mix(in srgb, var(--primary-text-color) 7%, transparent); color:var(--primary-text-color); transition: transform .15s, background .2s; }
  button.round:hover { background: color-mix(in srgb, var(--tone) 22%, transparent); }
  button.round:active { transform: scale(.92); }
  button.round[disabled] { opacity:.35; pointer-events:none; }
  .banner { margin-top:16px; border-radius:18px; padding:12px 14px; display:flex; align-items:center; gap:10px;
    color: var(--vt); background: color-mix(in srgb, var(--vt) 13%, transparent); font-weight:600; font-size:.9rem; }
  .banner .grow { flex:1; }
  .bar { height:6px; border-radius:6px; background: color-mix(in srgb, var(--vt) 18%, transparent); overflow:hidden; margin-top:8px; }
  .bar > i { display:block; height:100%; background: var(--vt); border-radius:6px; transition: width 1s linear; }
  .count { font-variant-numeric: tabular-nums; }
  .stats { display:grid; grid-template-columns: repeat(auto-fit, minmax(92px, 1fr)); gap:8px; margin-top:16px; }
  .stat { border-radius:16px; padding:10px 12px; background: color-mix(in srgb, var(--primary-text-color) 5%, transparent); }
  .stat .l { font-size:.72rem; text-transform:uppercase; letter-spacing:.06em; color:var(--secondary-text-color); display:flex; align-items:center; gap:4px; }
  .stat .l ha-icon { --mdc-icon-size:14px; }
  .stat .v { font-size:1.05rem; font-weight:600; margin-top:2px; font-variant-numeric: tabular-nums; color:var(--primary-text-color); }
  .stat .v.tone { color: var(--st); }
  .stat .v small { font-size:.75rem; font-weight:500; color:var(--secondary-text-color); margin-left:4px; }
  .actions { display:flex; gap:8px; margin-top:14px; flex-wrap:wrap; }
  .pill { all:unset; cursor:pointer; display:inline-flex; align-items:center; gap:6px; padding:8px 12px; border-radius:999px; font-size:.82rem; font-weight:600;
    background: color-mix(in srgb, var(--primary-text-color) 6%, transparent); color:var(--secondary-text-color); transition: background .2s, color .2s; }
  .pill.on { background: color-mix(in srgb, var(--tone) 16%, transparent); color: var(--tone); }
  .pill ha-icon { --mdc-icon-size:16px; }
  .sync { margin-left:auto; display:inline-flex; align-items:center; gap:4px; font-size:.75rem; color:var(--secondary-text-color); }
  .sync ha-icon { --mdc-icon-size:14px; }
  .sync.pending { color: var(--rk-warn); } .sync.failed { color: var(--rk-cold); }
  .err { padding:16px; color: var(--rk-cold); }
`;
  function toneVar(tone) {
    return `var(--rk-${tone || "off"})`;
  }
  var DAY_LOCALE = { de: "de-DE", en: "en-GB", fr: "fr-FR" };
  function schedDayName(index) {
    const d = new Date(2026, 10, 2 + Number(index));
    return new Intl.DateTimeFormat(DAY_LOCALE[getLang()] || "en-GB", { weekday: "short" }).format(d);
  }
  function schedDaysLabel(days) {
    const list = (days || []).slice().sort((a, b) => a - b);
    if (!list.length || list.length === 7) return t("täglich");
    return list.map(schedDayName).join(" ");
  }
  var RK_COLORS = ["#ff7a45", "#4f9dff", "#a78bfa", "#2ec4a6", "#ffb020", "#f472b6", "#22d3ee", "#84cc16"];
  var SEG = tmap({
    season_off: { c: "color-mix(in srgb, var(--rk-off) 25%, transparent)", l: "Heizpause" },
    setback: { c: "var(--rk-eco)", l: "Abgesenkt" },
    heating: { c: "var(--rk-heat)", l: "Heizt" },
    idle: { c: "var(--rk-ok)", l: "Erreicht" },
    window_open: { c: "var(--rk-air)", l: "Fenster offen" },
    night_airing: { c: "color-mix(in srgb, var(--rk-air) 55%, #1e2a5a)", l: "Nachtlüften" },
    off: { c: "color-mix(in srgb, var(--rk-off) 45%, transparent)", l: "Aus" },
    sensor_unavailable: { c: "var(--rk-warn)", l: "Fühler fehlt" },
    trv_unavailable: { c: "var(--rk-cold)", l: "TRV weg" }
  });
  var RK_LAYOUT_EMPTY = { order: [], hidden: [], size: {}, color: {} };
  var RK_LAYOUT_CACHE = /* @__PURE__ */ new Map();
  function rkLayout(hass, home) {
    const key = String(home || "");
    if (!RK_LAYOUT_CACHE.has(key)) {
      RK_LAYOUT_CACHE.set(
        key,
        hass.callWS({ type: "raumklima/layout/get", home: home || null }).then((r) => ({ ...RK_LAYOUT_EMPTY, ...r && r.layout || {} })).catch(() => ({ ...RK_LAYOUT_EMPTY }))
      );
    }
    return RK_LAYOUT_CACHE.get(key);
  }
  function rkLayoutRemember(layout, home) {
    if (layout) RK_LAYOUT_CACHE.set(String(home || ""), Promise.resolve({ ...RK_LAYOUT_EMPTY, ...layout }));
  }
  function rkLayoutChanged(home) {
    try {
      window.dispatchEvent(new CustomEvent("raumklima-layout", { detail: { home: String(home || "") } }));
    } catch (e) {
    }
  }
  function rkOnLayoutChanged(handler) {
    const fn = (e) => handler(e && e.detail && e.detail.home || "");
    window.addEventListener("raumklima-layout", fn);
    return () => window.removeEventListener("raumklima-layout", fn);
  }
  function rkOrderPos(order, r) {
    const key = r && (r.id || r.entity_id) || "";
    let i = order.indexOf(key);
    if (i < 0) {
      const name = r && (r.name || r.attributes && r.attributes.friendly_name) || "";
      if (name) i = order.indexOf(name);
    }
    return i < 0 ? order.length : i;
  }
  function rkRoomsOrdered(rooms, layout) {
    const order = (layout || RK_LAYOUT_EMPTY).order || [];
    return [...rooms || []].sort((a, b) => rkOrderPos(order, a) - rkOrderPos(order, b));
  }
  function rkLayoutApply(rooms, layout) {
    const L = layout || RK_LAYOUT_EMPTY;
    const hidden = new Set(L.hidden || []);
    const order = L.order || [];
    const keyOf = (r) => r && (r.id || r.entity_id) || "";
    return rooms.filter((r) => !hidden.has(keyOf(r))).sort((a, b) => rkOrderPos(order, a) - rkOrderPos(order, b));
  }
  function rkLayoutSize(layout, id) {
    return ((layout || RK_LAYOUT_EMPTY).size || {})[id] || null;
  }
  function rkLayoutColor(layout, id) {
    return ((layout || RK_LAYOUT_EMPTY).color || {})[id] || null;
  }
  function rkRooms(hass, prefix, home) {
    const reg = Object.values(hass.entities || {});
    const rooms = reg.filter((e) => e.platform === "raumklima" && e.entity_id.startsWith("climate.")).map((e) => {
      const st = hass.states[e.entity_id];
      const sib = {};
      reg.forEach((x) => {
        if (x.device_id === e.device_id && x.platform === "raumklima" && x.translation_key) sib[x.translation_key] = x.entity_id;
      });
      const full = st && st.attributes.friendly_name || e.entity_id;
      return { id: e.entity_id, name: prefix ? full.replace(new RegExp("^" + escRe(prefix) + "\\s*"), "") : full, attrs: st ? st.attributes : {}, sib };
    }).sort((a, b) => a.name.localeCompare(b.name));
    const mine = home ? rooms.filter((r) => !r.attrs.home || r.attrs.home === home) : rooms;
    mine.forEach((r, i) => {
      r.color = RK_COLORS[i % RK_COLORS.length];
    });
    return mine;
  }
  var RK_ROOM_TYPES = tmap({ living: "Wohnraum", kitchen: "Küche", bedroom: "Schlafzimmer", bathroom: "Bad", children: "Kinderzimmer", office: "Arbeitszimmer", guest: "Gästezimmer", hallway: "Flur", gym: "Sportzimmer", rarely_used: "Selten genutzt" });
  var RK_CAL = tmap({ offset: "Offset am Thermostat", target: "Sollwert-Ausgleich", none: "Ohne Abgleich" });
  var RK_OFF = tmap({ auto: "Automatisch", preset: "Preset „aus“", hvac: "Modus „aus“", min_temp: "Minimaltemperatur" });
  var RK_SYNC = tmap({ ok: ["Synchron", "ok"], pending: ["Wird übertragen", "warn"], failed: ["Fehlgeschlagen", "cold"] });
  var RK_BUILDING = tmap({ unrenovated: "Altbau unsaniert", renovated: "Altbau saniert", new: "Neubau / gedämmt" });
  var RK_NIGHT = tmap({ auto: "Automatisch", on: "Ja", off: "Nein" });
  var RK_WALL = tmap({
    auto: "wie die Wohnung",
    corner: "Außenecke",
    wall: "Außenwand",
    interior: "innenliegend"
  });
  var RK_MOLD = tmap({ strict: "Streng nach DIN", wish: "Nur bis Wunsch", off: "Aus" });
  var RK_QUIET = tmap({ auto: "Automatisch", on: "Immer", off: "Nie" });
  var RK_PREHEAT = tmap({ auto: "Automatisch", clock: "Frühestens ab", lead: "Frühestens vorher", off: "Erst zum Zeitplan" });
  var RK_SCHED_FALLBACK = tmap({ wish: "Wunschtemperatur", short: "Kurz weg", long: "Länger weg", frost: "Sicherung" });
  var RK_MAIL_PROVIDERS = {
    gmail: ["smtp.gmail.com", 587, "starttls", "Gmail"],
    gmx: ["mail.gmx.net", 587, "starttls", "GMX"],
    webde: ["smtp.web.de", 587, "starttls", "WEB.DE"],
    outlook: ["smtp-mail.outlook.com", 587, "starttls", "Outlook / Hotmail"],
    tonline: ["securesmtp.t-online.de", 465, "ssl", "T-Online"],
    icloud: ["smtp.mail.me.com", 587, "starttls", "iCloud"],
    posteo: ["posteo.de", 587, "starttls", "Posteo"],
    einsundeins: ["smtp.1und1.de", 587, "starttls", "1&1"],
    ionos: ["smtp.ionos.de", 587, "starttls", "IONOS"]
  };
  var RK_PKIND = tmap({ auto: "Automatisch", mmwave: "mmWave", pir: "PIR" });
  var RK_HOMESENS = tmap({ mmwave: "nur mmWave", all: "mmWave + PIR", off: "keine" });
  var RK_MODES = tmap({ auto: "Automatisch", always: "Immer heizen", pause: "Heizpause" });
  var RK_KINDS = tmap({
    vent_open: ["💧", "Bitte lüften"],
    vent_close: ["🪟", "Fenster schließen"],
    too_cold: ["🥶", "Raum kühlt aus"],
    vent_done: ["✅", "Luft ausgetauscht"],
    window_away: ["🚪", "Fenster offen, niemand da"],
    presence: ["🏠", "Abwesenheit & Vorheizen"],
    season: ["🍂", "Heizsaison Start/Ende"],
    trv_failure: ["⚠️", "Thermostat reagiert nicht"],
    health: ["🩺", "Gesundheit der Heizung"],
    report: ["📊", "Wochenbericht"],
    storm: ["🌪", "Sturm & Starkregen"],
    moisture: ["🧺", "Feuchtequelle im Raum"],
    live: ["📱", "Lüft-Countdown auf dem Sperrbildschirm"]
  });
  var RK_LIGHT_SIGNALS = tmap({
    open: ["#005aff", "Bitte lüften"],
    close: ["#ff6e00", "Bitte schließen"],
    done: ["#00c83c", "Luft ausgetauscht"],
    problem: ["#ff0000", "Problem mit der Heizung"]
  });
  var RK_DEFAULT_PUSH = ["vent_open", "vent_close", "too_cold", "vent_done", "window_away", "season", "trv_failure", "health", "report", "moisture"];
  var RK_SEV = tmap({ alert: ["cold", "mdi:alert-octagon-outline", "Dringend"], warn: ["warn", "mdi:alert-outline", "Warnung"], info: ["air", "mdi:information-outline", "Hinweis"] });
  function rkIssueList(issues, withRoom, prefix) {
    if (!issues || !issues.length) return `<div class="hok"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${t("Alles in Ordnung – Thermostate, Fühler, Batterien und Funk unauffällig.")}</div>`;
    const order = { alert: 0, warn: 1, info: 2 };
    return `<div class="issues">${[...issues].sort((a, b) => order[a.severity] - order[b.severity]).map((i) => {
      const sv = RK_SEV[i.severity] || RK_SEV.info;
      return `<div class="issue" style="--c:${toneVar(sv[0])}"><ha-icon icon="${sv[1]}"></ha-icon><div><b>${withRoom && i.room ? esc(prefix ? i.room.startsWith(prefix) ? i.room.slice(prefix.length).trimStart() : i.room : i.room) + ": " : ""}${esc(i.title)}</b><small>${esc(i.message)}</small></div><span class="tag">${sv[2]}</span></div>`;
    }).join("")}</div>`;
  }
  var ISSUE_STYLES = `
  .issues { display:grid; gap:10px; }
  .issue { display:grid; grid-template-columns: 26px 1fr auto; gap:12px; align-items:center; padding:12px 14px; border-radius:16px;
    background: color-mix(in srgb, var(--c) 9%, var(--ha-card-background, var(--card-background-color))); border:1px solid color-mix(in srgb, var(--c) 22%, transparent); }
  .issue > ha-icon { color: var(--c); --mdc-icon-size:24px; }
  .issue b { display:block; font-size:1rem; color:var(--primary-text-color); }
  .issue small { display:block; font-size:.88rem; color:var(--secondary-text-color); margin-top:2px; line-height:1.35; }
  .issue .tag { font-size:.78rem; font-weight:700; padding:3px 9px; border-radius:999px; background: color-mix(in srgb, var(--c) 18%, transparent); color: color-mix(in srgb, var(--c) 70%, var(--primary-text-color)); }
  .hok { display:flex; align-items:center; gap:10px; font-size:.98rem; color:var(--primary-text-color); }
  .hok ha-icon { color: var(--rk-ok); }
`;
  function rkPretty(target) {
    const s = String(target || "").replace(/^(notify|tts|media_player)\./, "").replace(/^mobile_app_/, "");
    return s.split("_").filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join(" ") || target;
  }
  var esc = (v) => String(v ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  var HISTORY_STYLES = `
  .hhead { display:flex; align-items:center; gap:12px; flex-wrap:wrap; }
  .htitle { font-size:1.15rem; font-weight:650; letter-spacing:-.01em; flex:1; color:var(--primary-text-color); display:flex; align-items:center; gap:8px; }
  .htitle ha-icon { color: var(--tone); --mdc-icon-size:22px; }
  .seg { display:inline-flex; padding:3px; border-radius:999px; background: color-mix(in srgb, var(--primary-text-color) 6%, transparent); }
  .seg button { all:unset; cursor:pointer; padding:6px 12px; border-radius:999px; font-size:.8rem; font-weight:600; color:var(--secondary-text-color); }
  .seg button.on { background: var(--ha-card-background, var(--card-background-color)); color: var(--primary-text-color); box-shadow: 0 1px 4px rgba(0,0,0,.12); }
  .legend { display:flex; flex-wrap:wrap; gap:8px; margin:14px 0 6px; }
  .lchip { all:unset; cursor:pointer; display:inline-flex; align-items:center; gap:8px; padding:6px 12px 6px 8px; border-radius:999px; font-size:.82rem; font-weight:600;
    background: color-mix(in srgb, var(--c) 12%, transparent); color: var(--primary-text-color); transition: opacity .2s, background .2s; }
  .lchip i { width:10px; height:10px; border-radius:50%; background: var(--c); box-shadow: 0 0 0 3px color-mix(in srgb, var(--c) 25%, transparent); }
  .lchip b { font-variant-numeric: tabular-nums; color: var(--c); }
  .lchip.off { opacity:.4; background: color-mix(in srgb, var(--primary-text-color) 5%, transparent); }
  .chart { position:relative; height: var(--h, 240px); margin-top:6px; }
  .chart svg { width:100%; height:100%; overflow:visible; display:block; }
  .grid line { stroke: color-mix(in srgb, var(--primary-text-color) 8%, transparent); stroke-dasharray: 3 5; }
  .ylab, .xlab { font-size:10.5px; fill: var(--secondary-text-color); font-variant-numeric: tabular-nums; }
  .band { fill: color-mix(in srgb, var(--rk-ok) 10%, transparent); }
  .bandlab { font-size:10px; fill: color-mix(in srgb, var(--rk-ok) 80%, var(--secondary-text-color)); font-weight:600; }
  .line { fill:none; stroke-width:2.4; stroke-linecap:round; stroke-linejoin:round; transition: opacity .2s; }
  .hover-line { stroke: color-mix(in srgb, var(--primary-text-color) 35%, transparent); stroke-width:1; }
  .tip { position:absolute; top:6px; pointer-events:none; padding:10px 12px; border-radius:14px; font-size:.8rem; min-width:150px;
    background: color-mix(in srgb, var(--ha-card-background, var(--card-background-color)) 92%, transparent); backdrop-filter: blur(8px);
    box-shadow: 0 8px 28px rgba(0,0,0,.18); border:1px solid color-mix(in srgb, var(--primary-text-color) 8%, transparent); color:var(--primary-text-color); }
  .tip .t { font-weight:650; margin-bottom:6px; color: var(--secondary-text-color); }
  .tip .r { display:flex; align-items:center; gap:8px; justify-content:space-between; }
  .tip .r span { display:flex; align-items:center; gap:6px; }
  .tip .r i { width:8px; height:8px; border-radius:50%; background: var(--c); }
  .tip .r b { font-variant-numeric: tabular-nums; }
  .empty { padding:40px 0; text-align:center; color: var(--secondary-text-color); }
  .tl { display:grid; grid-template-columns: 110px 1fr; gap:10px 14px; align-items:center; margin-top:14px; }
  .tl .n { font-weight:600; font-size:.88rem; color:var(--primary-text-color); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .tl .bar { position:relative; height:22px; border-radius:8px; overflow:hidden; background: color-mix(in srgb, var(--primary-text-color) 5%, transparent); }
  .tl .bar > i { position:absolute; top:0; bottom:0; border-radius:0; }
  .tl .bar > em { position:absolute; top:-2px; bottom:-2px; border-radius:4px; outline: 2px solid var(--rk-air); outline-offset:-2px; background: repeating-linear-gradient(45deg, color-mix(in srgb, var(--rk-air) 22%, transparent) 0 4px, transparent 4px 8px); }
  .tlx { display:flex; justify-content:space-between; margin:6px 0 0 124px; font-size:10.5px; color: var(--secondary-text-color); }
  .tleg { display:flex; flex-wrap:wrap; gap:14px; margin-top:14px; font-size:.78rem; color: var(--secondary-text-color); }
  .tleg span { display:inline-flex; align-items:center; gap:6px; }
  .tleg i { width:14px; height:10px; border-radius:3px; background: var(--c); }
`;
  var SETTINGS_STYLES = `
  /* Dialog für Sichern/Diagnose/Fehler: echte Knöpfe statt Popup und Blob-Download
     direkt nach einem await – nur so akzeptieren iPad-Safari und die HA-App das. */
  .sheetwrap { position: fixed; inset: 0; z-index: 60; background: rgba(0, 0, 0, .55); backdrop-filter: blur(2px);
    display: flex; align-items: center; justify-content: center; padding: 14px; }
  .sheet { display: flex; flex-direction: column; gap: 10px; width: min(680px, 100%); max-height: 86vh;
    padding: 16px; border-radius: 18px; background: var(--card-background-color, #fff);
    box-shadow: 0 24px 70px rgba(0, 0, 0, .45); }
  .stitle { font-weight: 700; font-size: 1.05rem; }
  .sintro { font-size: .85rem; line-height: 1.35; color: var(--secondary-text-color); }
  .stext { flex: 1 1 auto; min-height: 160px; width: 100%; resize: vertical; padding: 10px; border-radius: 10px;
    border: 1px solid color-mix(in srgb, var(--primary-text-color) 18%, transparent);
    background: var(--secondary-background-color, #f5f5f5); color: var(--primary-text-color);
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: .78rem; line-height: 1.4; }
  .sbtns { display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-end; }

  details.adv { margin: 12px 0 2px; border-top: 1px solid color-mix(in srgb, var(--primary-text-color) 10%, transparent); }
  details.adv > summary { cursor: pointer; padding: 12px 2px 4px; font-size: .88rem; font-weight: 600; color: var(--secondary-text-color);
    list-style: none; display: flex; align-items: center; gap: 8px; }
  details.adv > summary::-webkit-details-marker { display: none; }
  details.adv > summary::before { content: "▸"; font-size: .8rem; }
  details.adv[open] > summary::before { content: "▾"; }
  .sched { display:flex; flex-wrap:wrap; gap:8px; align-items:center; }
  .sched .days { display:flex; gap:4px; }
  .sched .d { all:unset; cursor:pointer; width:32px; height:27px; line-height:27px; border-radius:8px; text-align:center; font-size:.78rem; font-weight:600;
    background: color-mix(in srgb, var(--primary-text-color) 6%, transparent); color: var(--secondary-text-color); }
  .sched .d.on { background: var(--rk-heat); color:#fff; }
  .sched input.tm { font:inherit; padding:5px 8px; border-radius:8px; border:1px solid color-mix(in srgb, var(--primary-text-color) 14%, transparent);
    background: transparent; color: var(--primary-text-color); }
  /* HH:MM-Felder: der Browser würde <input type="time"> je nach Betriebssystem mit AM/PM zeichnen */
  .inp.hm, .sched input.tm { width: 76px; text-align: center; font-variant-numeric: tabular-nums; }
  .sched .temp { min-width:58px; text-align:right; font-variant-numeric: tabular-nums; }
  .sched .del { all:unset; cursor:pointer; padding:3px 7px; border-radius:8px; color: var(--rk-cold); }
  .sched .add { all:unset; cursor:pointer; display:inline-flex; gap:6px; align-items:center; margin-top:8px; padding:7px 14px; border-radius:10px;
    font-weight:600; background: color-mix(in srgb, var(--primary-text-color) 6%, transparent); color: var(--primary-text-color); }
  /* Gleiche Breite und Innenabstände wie die Übersicht – Karten sollen bündig stehen. */
  ha-card.settings { container-type: inline-size; padding: 20px 22px; }
  @media (max-width: 600px) { ha-card.settings { padding: 16px 14px; } }
  ha-card.settings .htitle { font-size:1.45rem; }
  ha-card.settings .htitle ha-icon { --mdc-icon-size:28px; }
  .tabs { display:flex; gap:6px; overflow-x:auto; scrollbar-width:none; margin:14px -4px 4px; padding:2px 4px 6px; }
  .tabs::-webkit-scrollbar { display:none; }
  .tabs.homes { margin-bottom:0; } .tabs.homes .tab { font-size:1.02rem; }
  .tab { all:unset; cursor:pointer; white-space:nowrap; padding:10px 18px; border-radius:999px; font-size:.98rem; font-weight:600; color:var(--secondary-text-color);
    background: color-mix(in srgb, var(--primary-text-color) 5%, transparent); display:inline-flex; align-items:center; gap:6px; }
  .tab ha-icon { --mdc-icon-size:16px; }
  /* Kein Farbtausch: Hintergrund- und Textfarbe kommen aus derselben Quelle, sonst wird bei
     Themes mit transparentem Kartenhintergrund (Frosted Glass) die Schrift unsichtbar. */
  .tab.on { background: color-mix(in srgb, var(--primary-text-color) 16%, transparent); color: var(--primary-text-color); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-text-color) 30%, transparent); }
  .tab .dot { width:7px; height:7px; border-radius:50%; background: var(--c, var(--rk-ok)); }
  /* Brotkrumen, Suche und Gruppenleiste (Einstellungen) */
  .crumb { margin:10px 4px 0; font-size:.82rem; color:var(--secondary-text-color); display:flex; gap:6px; align-items:center; flex-wrap:wrap; }
  .crumb b { color:var(--primary-text-color); font-weight:600; }
  .lrow { padding:12px 2px; border-top:1px solid color-mix(in srgb, var(--primary-text-color) 8%, transparent); display:flex; flex-direction:column; gap:8px; }
  .lrow:first-child { border-top:0; padding-top:4px; }
  .ltop { display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap; }
  .lbot { display:flex; align-items:center; gap:10px; }
  .llab { font-size:.8rem; color:var(--secondary-text-color); min-width:46px; }
  .dots { display:flex; gap:8px; flex-wrap:wrap; }
  .dotbtn { all:unset; cursor:pointer; width:22px; height:22px; border-radius:50%; background:var(--c); border:2px solid transparent; }
  .dotbtn.on { border-color: var(--primary-text-color); }
  .lname { display:inline-flex; align-items:center; gap:4px; }
  .lname .mini { all:unset; cursor:pointer; padding:0 4px; color:var(--secondary-text-color); font-size:.8rem; }
  .lname .mini[disabled] { opacity:.25; cursor:default; }
  .resetbar { display:flex; gap:10px; align-items:center; justify-content:space-between; flex-wrap:wrap; margin:8px 4px 0; font-size:.82rem; color:var(--secondary-text-color); }
  .resetbar .btn { padding:6px 12px; font-size:.82rem; }
  .searchrow { display:flex; gap:8px; align-items:center; margin:10px 4px 0; }
  .searchrow input { flex:1; min-width:0; padding:10px 14px; border-radius:12px; border:1px solid color-mix(in srgb, var(--primary-text-color) 12%, transparent);
    background: color-mix(in srgb, var(--primary-text-color) 4%, transparent); color:var(--primary-text-color); font-size:.95rem; }
  .searchrow input:focus { outline:2px solid color-mix(in srgb, var(--rk-heat) 40%, transparent); }
  .rail { display:flex; gap:6px; overflow-x:auto; scrollbar-width:none; margin:10px -4px 2px; padding:2px 4px 6px; }
  .rail::-webkit-scrollbar { display:none; }
  .railbtn { all:unset; cursor:pointer; white-space:nowrap; padding:8px 14px; border-radius:10px; font-size:.9rem; font-weight:600; color:var(--secondary-text-color);
    background: color-mix(in srgb, var(--primary-text-color) 4%, transparent); display:inline-flex; align-items:center; gap:6px; }
  .railbtn ha-icon { --mdc-icon-size:16px; }
  .railbtn.on { background: color-mix(in srgb, var(--rk-heat) 16%, transparent); color:var(--primary-text-color); }
  .railbtn.empty { display:none; }
  .nosearch { padding:24px 8px; text-align:center; color:var(--secondary-text-color); font-size:.95rem; }
  /* Ein Dokument: alle Gruppen untereinander als Abschnitte, keine Einzelkarten. */
  .groups { display:block; margin-top:10px; }
  /* Farbe als Abgrenzung: Trennlinie und Titel tragen den Ton der Gruppe. */
  .grp { min-width:0; padding:16px 2px 6px; border-top:1px solid color-mix(in srgb, var(--g, var(--primary-text-color)) 30%, transparent); }
  .grp > .gh b { color: color-mix(in srgb, var(--g, var(--primary-text-color)) 55%, var(--primary-text-color)); }
  .grp:first-child { border-top:0; padding-top:6px; }
  .grp.span { column-span:none; }
  @container (min-width: 1100px) { .grp.cols .rws { columns:2; column-gap:64px; } .grp.cols .row { break-inside:avoid; } }
  .gh { display:flex; align-items:center; gap:10px; margin:0 0 8px; flex-wrap:wrap; }
  .gh .ic { width:34px; height:34px; border-radius:10px; display:grid; place-items:center; background: color-mix(in srgb, var(--g) 16%, transparent); color: var(--g); flex:none; }
  .gh .ic ha-icon { --mdc-icon-size:19px; }
  .gh b { font-size:1.02rem; font-weight:600; letter-spacing:.01em; color:var(--primary-text-color); flex:1; }

  /* Tabellenzeile: Beschriftung links, Wert und Bedienung rechts auf einer Kante. */
  .row { display:grid; grid-template-columns:minmax(0,1fr) minmax(190px, max-content); align-items:center;
         column-gap:28px; row-gap:4px; min-height:52px; padding:11px 6px; margin:0 -6px; border-radius:10px;
         border-top:1px solid color-mix(in srgb, var(--primary-text-color) 7%, transparent); }
  .rws > .row:first-child, .row:first-of-type { border-top:0; }
  .row:hover { background: color-mix(in srgb, var(--primary-text-color) 4%, transparent); }
  .row > :not(.l) { justify-self:end; }
  .row .v { font-variant-numeric:tabular-nums; text-align:right; }
  .row > .stepper { width:190px; }
  .row .l { font-size:.98rem; color:var(--primary-text-color); min-width:0; }
  .row .l small { display:block; margin-top:2px; font-size:.8rem; line-height:1.3; color:var(--secondary-text-color); }
  .row .lbl { display:inline-flex; align-items:center; gap:6px; }
  .row .stepper:not(.ro) span { cursor:pointer; border-radius:8px; padding:2px 6px; margin:0 2px; }
  .row .stepper:not(.ro) span:hover { background: color-mix(in srgb, var(--primary-text-color) 8%, transparent); }
  .stepper input.numedit { width:70px; text-align:center; font:inherit; padding:3px 4px; border-radius:8px;
    border:1px solid color-mix(in srgb, var(--rk-heat) 55%, transparent); background:var(--card-background-color); color:var(--primary-text-color); }
  /* Dezente Zebra-Streifen, damit das Auge in langen Gruppen die Zeile hält. */
  .rws > .row:nth-of-type(even) { background: color-mix(in srgb, var(--primary-text-color) 2.5%, transparent); }
  @container (min-width: 1100px) {
    .grp.pair .rws { display:grid; grid-template-columns:1fr 1fr; column-gap:56px; }
    .grp.pair .rws > .row { border-top:1px solid color-mix(in srgb, var(--primary-text-color) 7%, transparent); }
    .grp.pair .rws > .row:nth-of-type(-n+2) { border-top:0; }
  }
  .qm { all:unset; cursor:pointer; flex:none; width:18px; height:18px; border-radius:50%; display:inline-grid; place-items:center; font-size:.72rem; font-weight:700;
    color: var(--secondary-text-color); border:1.5px solid color-mix(in srgb, var(--secondary-text-color) 55%, transparent); }
  .qm:hover, .qm.on { color:#fff; background: var(--g, var(--rk-air)); border-color: var(--g, var(--rk-air)); }
  .qm:focus-visible { outline:2px solid var(--g, var(--rk-air)); outline-offset:2px; }
  .mailbox { margin:4px 0 10px; border-radius:14px; background: color-mix(in srgb, var(--g, var(--rk-air)) 7%, transparent); padding:4px 12px; }
  .mailbox > summary, .adv > summary { cursor:pointer; padding:10px 0; font-weight:600; display:flex; align-items:center; gap:8px; color: var(--primary-text-color); }
  .mailbox > summary .ok { color: var(--rk-ok); font-weight:500; font-size:.85rem; } .mailbox > summary .no { color: var(--secondary-text-color); font-weight:500; font-size:.85rem; }
  .adv > summary { font-weight:500; font-size:.9rem; color: var(--secondary-text-color); }
  .mailform { display:flex; flex-direction:column; gap:10px; padding-bottom:12px; }
  .mf { display:flex; flex-direction:column; align-items:stretch; gap:4px; }
  .mf > span { color: var(--primary-text-color); } .mf small { display:block; color: var(--secondary-text-color); font-size:.8rem; }
  .mf .inp, .mf .sel { width:100%; box-sizing:border-box; text-align:left; }
  .mf .segs { align-self:flex-start; }
  .mailact { display:flex; justify-content:flex-end; gap:8px; flex-wrap:wrap; }
  .msteps { display:flex; flex-direction:column; gap:6px; }
  .mstep { display:flex; gap:10px; align-items:flex-start; padding:8px 10px; border-radius:10px; font-size:.88rem; line-height:1.35; color: var(--primary-text-color); }
  .mstep > b { flex:none; width:20px; height:20px; border-radius:50%; display:grid; place-items:center; color:#fff; font-size:.75rem; }
  .mstep.ok { background: color-mix(in srgb, var(--rk-ok) 10%, transparent); } .mstep.ok > b { background: var(--rk-ok); }
  .mstep.bad { background: color-mix(in srgb, var(--rk-cold, #e5484d) 10%, transparent); } .mstep.bad > b { background: var(--rk-cold, #e5484d); }
  .hint.okmsg { color: var(--rk-ok); font-weight:600; } .hint.errmsg { color: var(--rk-cold, #e5484d); font-weight:600; }
  .helpbox { margin:-4px 0 10px; padding:10px 12px; border-radius:12px; font-size:.88rem; line-height:1.45; color: var(--primary-text-color);
    background: color-mix(in srgb, var(--g, var(--rk-air)) 10%, var(--card-background-color, #fff)); border-left:3px solid var(--g, var(--rk-air)); }
  .row .l small { display:block; color:var(--secondary-text-color); font-size:.84rem; margin-top:1px; }
  .row .v { font-size:1rem; font-weight:600; color:var(--primary-text-color); text-align:right; font-variant-numeric:tabular-nums; }
  .row .v.mute { color:var(--secondary-text-color); font-weight:500; }
  .stepper.mv button { font-size:.7rem; padding:2px 5px; }
  .stepper.mv button[disabled] { opacity:.3; cursor:default; }
  .stepper { display:inline-flex; align-items:center; gap:4px; background: var(--ha-card-background, var(--card-background-color)); border-radius:999px; padding:3px; box-shadow: 0 1px 3px rgba(0,0,0,.08); flex:none; }
  .stepper button { all:unset; cursor:pointer; width:34px; height:34px; border-radius:50%; display:grid; place-items:center; font-size:1.2rem; font-weight:700; color:var(--g); background: color-mix(in srgb, var(--g) 12%, transparent); }
  .stepper button:active { transform: scale(.92); }
  .stepper span { min-width:70px; text-align:center; font-weight:650; font-variant-numeric:tabular-nums; font-size:1.05rem; color:var(--primary-text-color); }
  .stepper.ro button { display:none; }
  .tgl { all:unset; cursor:pointer; width:52px; height:30px; border-radius:999px; position:relative; background: color-mix(in srgb, var(--primary-text-color) 18%, transparent); transition: background .2s; flex:none; }
  .tgl::after { content:""; position:absolute; top:3px; left:3px; width:24px; height:24px; border-radius:50%; background:#fff; box-shadow:0 1px 3px rgba(0,0,0,.25); transition: transform .2s; }
  .tgl.on { background: var(--g, var(--rk-ok)); }
  .tgl.on::after { transform: translateX(22px); }
  .tgl[disabled] { opacity:.5; cursor:default; }
  .segs { display:inline-flex; flex-wrap:wrap; gap:4px; padding:3px; border-radius:16px; background: color-mix(in srgb, var(--primary-text-color) 6%, transparent); }
  .segs button { all:unset; cursor:pointer; padding:8px 12px; border-radius:13px; font-size:.88rem; font-weight:600; color:var(--secondary-text-color); }
  .segs button.on { background: var(--ha-card-background, var(--card-background-color)); color: var(--primary-text-color); box-shadow: 0 1px 4px rgba(0,0,0,.12); }
  .chips { display:flex; flex-wrap:wrap; gap:6px; justify-content:flex-end; }
  .chip2 { all:unset; display:inline-flex; align-items:center; gap:6px; padding:6px 12px; border-radius:999px; font-size:.9rem; font-weight:600; background: color-mix(in srgb, var(--c, var(--rk-air)) 14%, transparent); color: var(--primary-text-color); }
  button.chip2 { cursor:pointer; }
  .chip2 .kb { font-size:.68rem; font-weight:700; padding:1px 6px; border-radius:6px; background: color-mix(in srgb, var(--primary-text-color) 10%, transparent); color: var(--secondary-text-color); }
  .chip2 i { width:7px; height:7px; border-radius:50%; background: var(--c, var(--rk-air)); }
  .chip2.off { opacity:.45; }
  .chip2.strike { opacity:.45; text-decoration: line-through; }
  .sel, .inp { font: inherit; font-size:.95rem; font-weight:600; padding:8px 12px; border-radius:12px; border:1px solid color-mix(in srgb, var(--primary-text-color) 14%, transparent);
    background: var(--ha-card-background, var(--card-background-color)); color: var(--primary-text-color); max-width: 260px; }
  .inp.short { width: 86px; text-align:center; }
  .people { display:grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 520px), 1fr)); gap:14px; }
  @container (max-width: 560px) {
    .row { flex-wrap: wrap; row-gap: 8px; }
    .row .l { flex: 1 1 100%; }
    .row > :last-child { margin-left: auto; }
    .row .chips { justify-content: flex-start; margin-left: 0; }
    .segs { width: 100%; }
    .segs button { flex: 1; text-align: center; }
    .person { padding: 12px; }
  }
  .person { display:flex; gap:14px; align-items:flex-start; padding:16px; border-radius:18px; background: var(--ha-card-background, var(--card-background-color)); box-shadow: 0 1px 4px rgba(0,0,0,.06); }
  .av { width:48px; height:48px; border-radius:14px; flex:none; display:grid; place-items:center; font-weight:700; font-size:1.2rem; color:#fff; background: linear-gradient(135deg, var(--c), color-mix(in srgb, var(--c) 60%, #000)); }
  .av ha-icon { --mdc-icon-size:22px; }
  .person .pb { flex:1; min-width:0; }
  .person .ph { display:flex; align-items:center; gap:8px; }
  .person .ph b { flex:1; font-size:1.08rem; color:var(--primary-text-color); }
  .person small { display:block; font-size:.86rem; color:var(--secondary-text-color); margin:1px 0 9px; }
  .person .chips { justify-content:flex-start; }
  .mini { all:unset; cursor:pointer; padding:5px 10px; border-radius:10px; font-size:.8rem; font-weight:650; color: var(--secondary-text-color); background: color-mix(in srgb, var(--primary-text-color) 6%, transparent); }
  .mini.x { padding:5px 9px; }
  .addrow { display:flex; flex-wrap:wrap; gap:10px; align-items:center; margin-top:14px; }
  /* Unterreiter im Lernbereich */
  .ltabs { display:flex; gap:8px; flex-wrap:wrap; margin:2px 0 12px; }
  .ltab { border:0; cursor:pointer; font:inherit; font-size:.85rem; padding:8px 14px; border-radius:12px;
          color:var(--secondary-text-color); background:color-mix(in srgb, var(--primary-text-color) 5%, transparent); }
  .ltab.on { color:#fff; background:color-mix(in srgb, var(--g, var(--rk-eco)) 88%, #000); }
  .dbar { display:flex; align-items:center; gap:12px; padding:8px 2px; flex-wrap:wrap;
          border-top:1px solid color-mix(in srgb, var(--primary-text-color) 7%, transparent); }
  .dbar .dlab { min-width:74px; font-size:.78rem; color:var(--secondary-text-color); }
  .dkpis { display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:10px; margin:10px 0 6px; }
  .dkpi { padding:10px 12px; border-radius:12px; background:color-mix(in srgb, var(--primary-text-color) 4%, transparent); }
  .dkpi b { display:block; font-size:1.35rem; font-weight:600; font-variant-numeric:tabular-nums; }
  .dkpi span { font-size:.78rem; color:var(--secondary-text-color); }
  .decs { margin-top:4px; }
  .dec { border-top:1px solid color-mix(in srgb, var(--primary-text-color) 7%, transparent); }
  .dec:first-of-type { border-top:0; }
  .dec summary { display:grid; grid-template-columns:104px minmax(0,1fr); column-gap:18px; padding:10px 2px; cursor:pointer; list-style:none; }
  .dec summary::-webkit-details-marker { display:none; }
  .dec .dl b { font-size:.92rem; font-weight:600; display:block; }
  .dec .dl small { display:block; margin-top:2px; font-size:.8rem; color:var(--secondary-text-color); }
  .dec .dfull { padding:2px 2px 12px 122px; }
  .dec .dfull p { margin:0 0 4px; font-size:.82rem; }
  .dec .dfull .ddata { color:var(--secondary-text-color); font-variant-numeric:tabular-nums; }
  /* „Warum?" – Zeit links, Entscheidung und Begründung rechts. */
  .why { margin-top:4px; }
  .whyhead { border-top:1px solid color-mix(in srgb, var(--primary-text-color) 8%, transparent); }
  .whyrow { display:grid; grid-template-columns:104px minmax(0,1fr); column-gap:18px;
            padding:9px 2px; border-top:1px solid color-mix(in srgb, var(--primary-text-color) 7%, transparent); }
  .whyrow:first-of-type { border-top:0; }
  .whyrow .wtime { font-size:.8rem; color:var(--secondary-text-color); font-variant-numeric:tabular-nums; }
  .whyrow .wl b { font-size:.9rem; font-weight:600; }
  /* Zeitwähler (iOS-artig): zwei Räder, die einrasten */
  .timebtn { min-height:36px; padding:7px 14px; border-radius:12px; font:inherit; font-size:.88rem;
             font-variant-numeric:tabular-nums; cursor:pointer; color:inherit;
             background:color-mix(in srgb, var(--primary-text-color) 6%, transparent);
             border:1px solid color-mix(in srgb, var(--primary-text-color) 12%, transparent); }
  .tpick { position:fixed; left:50%; bottom:24px; transform:translateX(-50%); z-index:60;
           width:min(300px, 92vw); padding:14px 16px 16px; border-radius:20px;
           background:var(--card-background-color, #fff); color:var(--primary-text-color);
           box-shadow:0 18px 50px rgba(0,0,0,.28); }
  .tpickhead { display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; }
  .tpickbody { display:flex; align-items:center; justify-content:center; gap:6px; }
  .twheel { height:120px; overflow-y:auto; scroll-snap-type:y mandatory; padding:40px 0; width:74px;
            text-align:center; scrollbar-width:none; }
  .twheel::-webkit-scrollbar { display:none; }
  .twheel button { display:block; width:100%; height:40px; scroll-snap-align:center; border:0; background:none;
                   font:inherit; font-size:1.25rem; color:var(--secondary-text-color); cursor:pointer;
                   font-variant-numeric:tabular-nums; }
  .twheel button.on { color:var(--primary-text-color); font-weight:600; font-size:1.45rem; }
  .twheel.small { width:64px; }
  .tcolon { font-size:1.3rem; color:var(--secondary-text-color); }
  .tpickunit { font-size:.8rem; color:var(--secondary-text-color); }
  .tpickfoot { display:flex; gap:8px; margin-top:10px; }
  .tpickfoot .inp { flex:1; }

  /* Anwesenheitsprofil: 96 Viertelstunden als Balken */
  .pbars { display:flex; align-items:flex-end; gap:1px; height:46px; width:min(420px, 44vw); }
  .pbars i { flex:1; min-width:1px; border-radius:1px 1px 0 0; background:var(--g, var(--rk-eco)); display:block; }

  /* Raumkacheln (Alle Räume auf einen Blick) */
  .roomgrid { display:grid; grid-template-columns:repeat(auto-fit, minmax(210px, 1fr)); gap:12px; }
  .rtile { display:flex; flex-direction:column; gap:2px; text-align:left; cursor:pointer;
           padding:14px 16px 12px; border-radius:16px; font:inherit; color:inherit;
           border:1px solid color-mix(in srgb, var(--primary-text-color) 9%, transparent);
           box-shadow: inset 3px 0 0 var(--c, var(--rk-off)); }
  .rtile:hover { border-color: color-mix(in srgb, var(--c, var(--primary-text-color)) 45%, transparent); }
  .rtile .rtop { display:flex; align-items:baseline; justify-content:space-between; gap:8px; }
  .rtile .rname { font-weight:600; font-size:.95rem; }
  .rtile .rtyp { font-size:.75rem; color:var(--secondary-text-color); white-space:nowrap; }
  .rtile .rbig { font-size:1.9rem; font-weight:600; line-height:1.1; font-variant-numeric:tabular-nums; }
  .rtile .rbig i { font-size:1.1rem; font-style:normal; color:var(--secondary-text-color); }
  .rtile .rsub { font-size:.8rem; color:var(--secondary-text-color); font-variant-numeric:tabular-nums; }
  .rtile .rflags { display:flex; gap:8px; margin-top:4px; color:var(--secondary-text-color); }
  .rtile .rflags ha-icon { --mdc-icon-size:17px; }
  .whyrow .wl small { display:block; margin-top:2px; font-size:.8rem; color:var(--secondary-text-color); line-height:1.35; }
  .msgs { display:grid; gap:10px; }
  .msg { display:grid; grid-template-columns: 40px 1fr auto; gap:14px; align-items:center; padding:14px 16px; border-radius:16px; background: var(--ha-card-background, var(--card-background-color)); box-shadow: 0 1px 4px rgba(0,0,0,.06); }
  .msg .e { font-size:1.5rem; text-align:center; }
  .msg b { font-size:1.02rem; color:var(--primary-text-color); display:block; }
  .msg small { font-size:.88rem; color:var(--secondary-text-color); }
  .msg .tag { font-size:.8rem; font-weight:700; padding:3px 8px; border-radius:999px; background: color-mix(in srgb, var(--c) 16%, transparent); color: color-mix(in srgb, var(--c) 75%, var(--primary-text-color)); white-space:nowrap; }
  .status { display:flex; flex-wrap:wrap; gap:8px; margin: 2px 0 8px; }
  .tbl { width:100%; border-collapse:separate; border-spacing:0 8px; font-size:1rem; }
  .tblwrap { overflow-x:auto; margin: 0 -4px; padding: 0 4px; }
  .tbl th { text-align:left; font-weight:600; font-size:.8rem; text-transform:uppercase; letter-spacing:.04em; color:var(--secondary-text-color); padding:0 10px 2px; white-space:nowrap; }
  .tbl td { padding:14px 12px; background: var(--ha-card-background, var(--card-background-color)); white-space:nowrap; font-variant-numeric:tabular-nums; color:var(--primary-text-color); }
  .tbl tr td:first-child { border-radius:14px 0 0 14px; font-weight:650; }
  .tbl tr td:last-child { border-radius:0 14px 14px 0; }
  .tbl tbody tr { cursor:pointer; }
  .tbl .rn { display:flex; align-items:center; gap:8px; }
  .tbl .rn i { width:9px; height:9px; border-radius:50%; background: var(--c); }
  .ok { color: var(--rk-ok); } .no { color: var(--secondary-text-color); }
  .tbl.sm td { padding:10px 12px; } .tbl.sm tbody tr { cursor:default; }
  .lt { font-size:.72rem; font-weight:700; padding:1px 6px; border-radius:999px; background: color-mix(in srgb, var(--rk-eco) 18%, transparent); color: color-mix(in srgb, var(--rk-eco) 75%, var(--primary-text-color)); vertical-align:1px; }
  .foot { display:flex; flex-wrap:wrap; gap:10px; margin-top:16px; }
  .btn { all:unset; cursor:pointer; display:inline-flex; align-items:center; gap:8px; padding:12px 20px; border-radius:16px; font-weight:600; font-size:1rem;
    background: color-mix(in srgb, var(--c, var(--primary-text-color)) 9%, transparent); color: var(--primary-text-color); }
  .btn ha-icon { --mdc-icon-size:18px; color: var(--c, var(--primary-text-color)); }
  .btn.primary { background: var(--rk-air); color: #fff; }
  .btn.primary ha-icon { color: inherit; }
  .hint { font-size:.9rem; color:var(--secondary-text-color); margin-top:12px; line-height:1.45; }
  .toast { position:sticky; bottom:8px; margin-top:12px; padding:10px 14px; border-radius:14px; font-size:.9rem; font-weight:600; background: var(--rk-eco); color: #fff; width:max-content; max-width:100%; }
`;
  var REPORT_STYLES = `
  .pdfmk { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:10px; }
  .pdflist { display:flex; flex-direction:column; gap:6px; }
  .pdfrow { display:flex; align-items:center; gap:10px; padding:8px 10px; border-radius:12px; background: color-mix(in srgb, var(--primary-text-color) 4%, transparent); }
  .pdfrow > ha-icon { color: var(--rk-cold, #e5484d); --mdc-icon-size:26px; }
  .pdfi { flex:1; display:flex; flex-direction:column; min-width:0; }
  .pdfi b { font-weight:600; color: var(--primary-text-color); }
  .pdfi small { color: var(--secondary-text-color); font-size:.8rem; }
  .pdfi .no { font-weight:500; color: var(--secondary-text-color); font-size:.8rem; }
  ha-card.report { container-type: inline-size; padding: 24px 26px; }
  @media (max-width: 600px) { ha-card.report { padding: 18px 16px; } }
  .rsub { font-size:.9rem; color:var(--secondary-text-color); margin-top:2px; }
  .tiles { display:grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap:12px; margin-top:18px; }
  @container (min-width: 640px) { .tiles { grid-template-columns: repeat(3, minmax(0,1fr)); } }
  @container (min-width: 980px) { .tiles { grid-template-columns: repeat(6, minmax(0,1fr)); } }
  .tile { border-radius:20px; padding:16px; background: color-mix(in srgb, var(--c) 9%, transparent); border:1px solid color-mix(in srgb, var(--c) 16%, transparent); min-width:0; }
  .tile .k { font-size:.82rem; font-weight:600; color:var(--secondary-text-color); display:flex; align-items:center; gap:6px; }
  .tile .k ha-icon { --mdc-icon-size:16px; color: var(--c); }
  .tile .n { font-size:1.9rem; font-weight:700; letter-spacing:-.02em; color:var(--primary-text-color); margin-top:6px; font-variant-numeric:tabular-nums; line-height:1.1; }
  .tile .n small { font-size:.95rem; font-weight:600; color:var(--secondary-text-color); margin-left:2px; }
  .tile .d { font-size:.82rem; color:var(--secondary-text-color); margin-top:4px; }
  .tile .d.good { color: var(--rk-ok); font-weight:650; } .tile .d.bad { color: var(--rk-cold); font-weight:650; }
  .rsec { margin-top:26px; }
  .rsec h3 { margin:0 0 12px; font-size:1.05rem; font-weight:650; color:var(--primary-text-color); display:flex; align-items:center; gap:8px; }
  .rsec h3 ha-icon { --mdc-icon-size:20px; color:var(--secondary-text-color); }
  .days { display:flex; align-items:flex-end; gap:3px; height:150px; padding-top:8px; }
  .day { flex:1; min-width:0; display:flex; flex-direction:column; justify-content:flex-end; height:100%; position:relative; }
  .day .stk { display:flex; flex-direction:column-reverse; border-radius:5px 5px 2px 2px; overflow:hidden; min-height:2px; background: color-mix(in srgb, var(--rk-off) 15%, transparent); }
  .day .stk i { display:block; background: var(--c); }
  .day.today .stk { outline:2px solid var(--primary-text-color); outline-offset:1px; }
  .day .hdd { position:absolute; left:50%; width:6px; height:6px; margin-left:-3px; border-radius:50%; background: var(--rk-air); box-shadow:0 0 0 2px var(--ha-card-background, var(--card-background-color)); }
  .daylab { display:flex; gap:3px; margin-top:6px; }
  .daylab span { flex:1; min-width:0; text-align:center; font-size:.7rem; color:var(--secondary-text-color); overflow:hidden; }
  .lg { display:flex; flex-wrap:wrap; gap:6px 14px; margin-top:10px; font-size:.84rem; color:var(--secondary-text-color); }
  .lg span { display:inline-flex; align-items:center; gap:6px; }
  .lg i { width:10px; height:10px; border-radius:3px; background: var(--c); }
  .lg i.dot { border-radius:50%; }
  .rrows { display:grid; gap:10px; }
  .rrow { display:grid; grid-template-columns: minmax(90px, 160px) 1fr; gap:14px; align-items:center; padding:12px 14px; border-radius:16px; background: color-mix(in srgb, var(--primary-text-color) 3.5%, transparent); }
  .rrow .nm { font-weight:650; color:var(--primary-text-color); display:flex; align-items:center; gap:8px; min-width:0; }
  .rrow .nm i { width:10px; height:10px; border-radius:50%; background: var(--c); flex:none; }
  .rrow .nm span { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .rbar { height:12px; border-radius:999px; background: color-mix(in srgb, var(--rk-off) 14%, transparent); overflow:hidden; display:flex; }
  .rbar i { display:block; height:100%; }
  .facts { display:flex; flex-wrap:wrap; gap:6px 14px; margin-top:8px; font-size:.84rem; color:var(--secondary-text-color); font-variant-numeric:tabular-nums; }
  .facts b { color:var(--primary-text-color); font-weight:650; }
  .facts .w { color: var(--rk-warn); font-weight:650; }
  @container (max-width: 520px) { .rrow { grid-template-columns: 1fr; gap:8px; } }
  .empty { padding:24px 0 8px; color:var(--secondary-text-color); line-height:1.5; }
`;
  var ROOM_COLORS = ["#ff7a45", "#4f9dff", "#2ec4a6", "#a78bfa", "#ffb020", "#f472b6", "#22d3ee", "#84cc16"];
  function rkVersionMismatch(cfg, own) {
    const server = cfg && cfg.version;
    if (!server || !own) return "";
    return String(server) === String(own) ? "" : String(server);
  }
  function rkLook(config) {
    const look = config && config.look;
    if (look === "classic" || look === "glass") return look;
    return "modern";
  }
  function rkDark(hass, config, settings) {
    const own = config && config.dark;
    if (own === true || own === "on") return true;
    if (own === false || own === "off") return false;
    const want = settings && settings.look_dark || "auto";
    if (want === "on") return true;
    if (want === "off") return false;
    return !!(hass && hass.themes && hass.themes.darkMode);
  }
  function rkLookStyles(look) {
    return look === "modern" ? MODERN_STYLES : look === "glass" ? GLASS_STYLES : "";
  }
  var MODERN_STYLES = `
  .modern { border-radius: 26px; }
  /* Panel hinter dem Raster – gibt der Fläche Halt, ohne das Markup zu ändern */
  .modern .rooms { gap: 12px; padding: 10px; border-radius: 24px;
    background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
    border: 1px solid color-mix(in srgb, var(--primary-text-color) 8%, transparent); }
  .modern .room { container-type: inline-size; min-height: 140px; padding: 15px 16px; border-radius: 20px;
    border: 1px solid color-mix(in srgb, var(--tone) 30%, transparent);
    background:
      radial-gradient(120% 110% at 18% 0%, color-mix(in srgb, var(--tone) 32%, transparent), transparent 68%),
      color-mix(in srgb, var(--primary-text-color) 4%, var(--ha-card-background, var(--card-background-color))); }
  .modern .room:hover { transform: translateY(-3px);
    box-shadow: 0 12px 26px -14px color-mix(in srgb, var(--tone) 70%, transparent);
    background:
      radial-gradient(120% 110% at 18% 0%, color-mix(in srgb, var(--tone) 42%, transparent), transparent 72%),
      color-mix(in srgb, var(--primary-text-color) 5%, var(--ha-card-background, var(--card-background-color))); }
  .modern .dot { border-radius: 14px; background: color-mix(in srgb, var(--tone) 18%, transparent);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--tone) 22%, transparent); }
  .modern .rn { font-size: 1.03rem; letter-spacing: -.015em; }
  .modern .rt { font-size: clamp(1.9rem, 22cqw, 3rem); letter-spacing: -.05em; }
  .modern .rmeta { font-size: .76rem; }
  /* Raumkarte: gleiche Sprache, ohne die Aufteilung anzufassen */
  .modern .name { font-size: 1.22rem; letter-spacing: -.02em; }
  .modern .stat { border-radius: 16px; background: color-mix(in srgb, var(--primary-text-color) 4%, transparent); }
  .modern .stat .v { font-weight: 300; letter-spacing: -.03em; }
  /* Auf dunklem Grund verschluckt die Fläche die Tönung – dort kräftiger mischen.
     Die Klasse setzt die Karte (Theme + Wohnungs-Einstellung), nicht die Systemabfrage. */
  .modern.dark .room,
  .modern.dark .room:hover { background:
      radial-gradient(120% 110% at 18% 0%, color-mix(in srgb, var(--tone) 46%, transparent), transparent 70%),
      color-mix(in srgb, var(--primary-text-color) 6%, var(--ha-card-background, var(--card-background-color)));
      border-color: color-mix(in srgb, var(--tone) 40%, transparent); }
  .modern.dark .rooms { background: color-mix(in srgb, var(--primary-text-color) 7%, transparent); }
`;
  var GLASS_STYLES = `
  .glass { border-radius: 28px; border: 1px solid color-mix(in srgb, #fff 26%, transparent);
    background: color-mix(in srgb, var(--ha-card-background, #fff) 42%, transparent);
    -webkit-backdrop-filter: blur(20px) saturate(1.4); backdrop-filter: blur(20px) saturate(1.4);
    box-shadow: 0 18px 40px -28px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.28); }
  .glass .rooms { gap: 12px; padding: 10px; border-radius: 24px;
    background: color-mix(in srgb, #fff 10%, transparent); border: 1px solid color-mix(in srgb, #fff 18%, transparent); }
  .glass .room { container-type: inline-size; min-height: 140px; padding: 15px 16px; border-radius: 22px;
    border: 1px solid color-mix(in srgb, #fff 30%, transparent);
    background: linear-gradient(155deg, color-mix(in srgb, var(--tone) 34%, transparent), color-mix(in srgb, #fff 10%, transparent) 62%);
    -webkit-backdrop-filter: blur(16px) saturate(1.5); backdrop-filter: blur(16px) saturate(1.5);
    box-shadow: inset 0 1px 0 rgba(255,255,255,.35); }
  .glass .room:hover { transform: translateY(-3px);
    box-shadow: 0 20px 38px -26px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.4); }
  .glass .dot { border-radius: 14px; background: color-mix(in srgb, #fff 22%, transparent);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, #fff 30%, transparent); }
  .glass .rn { font-size: 1.03rem; letter-spacing: -.015em; }
  .glass .rt { font-size: clamp(1.9rem, 22cqw, 3rem); letter-spacing: -.05em; }
  .glass .chip, .glass .hm { background: color-mix(in srgb, #fff 18%, transparent); }
  .glass .name { font-size: 1.22rem; letter-spacing: -.02em; }
  .glass .stat { border-radius: 18px; background: color-mix(in srgb, #fff 12%, transparent);
    box-shadow: inset 0 1px 0 rgba(255,255,255,.22); }
  .glass .stat .v { font-weight: 300; letter-spacing: -.03em; }
  .glass.dark { background: color-mix(in srgb, #14181f 55%, transparent); border-color: color-mix(in srgb, #fff 16%, transparent); }
  .glass.dark .room { background: linear-gradient(155deg, color-mix(in srgb, var(--tone) 40%, transparent), color-mix(in srgb, #fff 6%, transparent) 62%);
    border-color: color-mix(in srgb, #fff 20%, transparent); }
  .glass.dark .rooms { background: color-mix(in srgb, #fff 6%, transparent); }
`;

  // src/cards/room.js
  var BOOST_CSS = `
.bsheet{margin:8px 12px 4px;padding:10px 12px;border-radius:14px;background:var(--card-background-color,#fff);box-shadow:0 2px 10px rgba(0,0,0,.12);position:relative;z-index:3}
.bshead{display:flex;align-items:center;gap:8px;font-weight:600;color:var(--primary-text-color,#111)}
.bshead ha-icon{color:var(--rk-heat,#e8590c)}
.bshead span{flex:1}
.bsx{border:0;background:transparent;font-size:22px;line-height:1;color:var(--secondary-text-color,#777);cursor:pointer}
.btl{margin:10px 0 4px}
.btlbar{position:relative;height:10px;border-radius:6px;background:rgba(120,120,120,.18);overflow:hidden}
.btlfill{position:absolute;left:0;top:0;bottom:0;border-radius:6px;background:var(--rk-heat,#e8590c);opacity:.85}
.btlticks{position:relative;height:14px;font-size:10px;color:var(--secondary-text-color,#888)}
.btlticks span{position:absolute;transform:translateX(-50%)}
.bslabel{font-size:12px;color:var(--secondary-text-color,#777);margin:2px 0 8px}
.bschips{display:flex;flex-wrap:wrap;gap:6px}
.bschip{border:1px solid rgba(120,120,120,.35);background:transparent;border-radius:999px;padding:6px 12px;font:inherit;font-size:13px;cursor:pointer;color:inherit}
.bschip:hover{border-color:var(--rk-heat,#e8590c)}
`;
  var RaumklimaCard = class extends HTMLElement {
    // Neu zeichnen ohne Springen der Seite
    set _html(html) {
      rkPaint(this, html);
    }
    static getConfigForm() {
      return {
        schema: [
          { name: "entity", required: true, selector: { entity: { domain: "climate", integration: "raumklima" } } },
          { name: "name", selector: { text: {} } }
        ],
        computeLabel: (s) => ({ entity: t("Raum (Raumklima-Thermostat)"), name: t("Anzeigename (optional)") })[s.name]
      };
    }
    static getStubConfig(hass) {
      const e = Object.values(hass.entities || {}).find((x) => x.platform === "raumklima" && x.entity_id.startsWith("climate."));
      return { entity: e ? e.entity_id : "" };
    }
    setConfig(config) {
      if (!config.entity) throw new Error(t("Bitte ein Raumklima-Thermostat (entity) angeben"));
      this._config = config;
      this._pending = null;
      if (!this.shadowRoot) this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
      this._timer = setInterval(() => this._tick(), 1e3);
    }
    disconnectedCallback() {
      clearInterval(this._timer);
    }
    getCardSize() {
      return 6;
    }
    getGridOptions() {
      return { columns: 6, min_columns: 4, rows: "auto" };
    }
    set hass(hass) {
      this._hass = hass;
      setLang(hass);
      const st = hass.states[this._config.entity];
      const ids = [this._config.entity, ...Object.values(this._siblings()), ...st && st.attributes.window_entities || []];
      if (!rkChanged(this, hass, ids) && this.shadowRoot && this.shadowRoot.firstChild) return;
      if (rkScrolling()) {
        rkLater(this, () => this._render());
        return;
      }
      this._render();
    }
    _siblings() {
      const reg = this._hass.entities || {};
      const me = reg[this._config.entity];
      const out = {};
      if (!me || !me.device_id) return out;
      for (const e of Object.values(reg)) {
        if (e.device_id === me.device_id && e.platform === "raumklima" && e.translation_key) out[e.translation_key] = e.entity_id;
      }
      return out;
    }
    _call(domain, service, data) {
      return this._hass.callService(domain, service, data);
    }
    _step(delta) {
      const st = this._hass.states[this._config.entity];
      if (!st) return;
      const a = st.attributes;
      const mon = a.monitor === true;
      const base = this._pending ?? a.wish ?? a.temperature ?? 20;
      const next = Math.min(a.max_temp ?? 30, Math.max(a.min_temp ?? 5, Math.round((base + delta) * 2) / 2));
      this._pending = next;
      this._render();
      clearTimeout(this._debounce);
      this._debounce = setTimeout(() => {
        this._call("climate", "set_temperature", { entity_id: this._config.entity, temperature: next });
        setTimeout(() => {
          this._pending = null;
        }, 1500);
      }, 700);
    }
    _moreInfo(entityId) {
      this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId }, bubbles: true, composed: true }));
    }
    _boostSheet(a) {
      const active = !!(a.boost_until || a.boost_open);
      const until = a.boost_until ? Date.parse(a.boost_until) : null;
      const mins = until ? Math.max(0, Math.round((until - Date.now()) / 6e4)) : null;
      const span = 360;
      const width = mins == null ? 100 : Math.min(100, mins / span * 100);
      const ticks = [0, 1, 2, 3, 4, 5, 6].map((h) => {
        const d = new Date(Date.now() + h * 36e5);
        return `<span style="left:${h / 6 * 100}%">${h === 6 ? "" : d.toLocaleTimeString(loc(), { hour: "2-digit" })}</span>`;
      }).join("");
      const chip = (mode, min, label) => `<button class="bschip" data-bs="${mode}"${min ? ` data-min="${min}"` : ""}>${label}</button>`;
      return `<style>${BOOST_CSS}</style>
      <div class="bsheet">
        <div class="bshead"><ha-icon icon="mdi:fire"></ha-icon><span>${t("Wärmer für kurze Zeit")}</span><button class="bsx" data-bsclose aria-label="${t("schließen")}">×</button></div>
        <div class="btl">
          <div class="btlbar"><i class="btlfill" style="width:${width}%"></i></div>
          <div class="btlticks">${ticks}</div>
        </div>
        <div class="bslabel">${active ? mins == null ? t("läuft ohne Zeitlimit") : t("läuft noch {m} min", { m: mins }) : t("Wie lange soll es wärmer sein?")}</div>
        <div class="bschips">
          ${chip("minutes", 15, t("15 min"))}${chip("minutes", 30, t("30 min"))}${chip("minutes", 60, t("1 h"))}${chip("minutes", 120, t("2 h"))}
          ${chip("next", null, t("Bis Zeitfenster"))}${chip("unlimited", null, t("Ohne Limit"))}
          ${active ? chip("off", null, t("Beenden")) : ""}
        </div>
      </div>`;
    }
    async _boost(mode, minutes) {
      const st = this._hass.states[this._config.entity];
      const entry = st && st.attributes && st.attributes.room;
      if (!entry) return;
      const payload = { type: "raumklima/boost", entry_id: entry, mode };
      if (minutes) payload.minutes = Number(minutes);
      try {
        await this._hass.connection.sendMessagePromise(payload);
      } catch (e) {
        console.error("raumklima boost:", e);
      }
      this._boostOpen = false;
      this._render();
    }
    _tick() {
      const bl = this.shadowRoot && this.shadowRoot.querySelector("[data-boostleft]");
      if (bl && this._boostUntil) {
        const m = Math.max(0, Math.round((this._boostUntil - Date.now()) / 6e4));
        bl.textContent = t("noch {m} min", { m });
      }
      const since = this.shadowRoot && this.shadowRoot.querySelector("[data-since]");
      if (since && this._winSince) since.textContent = t("Fenster offen seit {c} · {d}", { c: rkClock(this._winSince), d: rkDuration(Date.now() - this._winSince) });
      const empty = this.shadowRoot && this.shadowRoot.querySelector("[data-empty]");
      if (empty && this._emptySince) empty.textContent = t(this._roomEco ? "Raum leer seit {d} – abgesenkt" : "Raum leer seit {d}", { d: rkDuration(Date.now() - this._emptySince) });
      const el = this.shadowRoot && this.shadowRoot.querySelector("[data-count]");
      if (!el || !this._openSince) return;
      const total = this._recMin * 60;
      const passed = (Date.now() - this._openSince) / 1e3;
      const left = Math.max(0, total - passed);
      el.textContent = `${Math.floor(left / 60)}:${String(Math.floor(left % 60)).padStart(2, "0")}`;
      const bar = this.shadowRoot.querySelector("[data-bar]");
      if (bar) bar.style.width = `${Math.min(100, passed / total * 100)}%`;
    }
    _arc(cur, target, off) {
      const vals = [cur, target].filter((v) => v !== null && v !== void 0);
      const min = Math.min(14, ...vals.map((v) => Math.floor(v - 1)));
      const max = Math.max(26, ...vals.map((v) => Math.ceil(v + 1)));
      const R = 100, cx = 120, cy = 112, start = 135, sweep = 270;
      const pos = (v) => start + (Math.min(max, Math.max(min, v)) - min) / (max - min) * sweep;
      const pt = (deg, r = R) => {
        const a = deg * Math.PI / 180;
        return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
      };
      const path = (a, b) => {
        const [x1, y1] = pt(a), [x2, y2] = pt(b);
        return `M ${x1} ${y1} A ${R} ${R} 0 ${b - a > 180 ? 1 : 0} 1 ${x2} ${y2}`;
      };
      const c = cur === null || cur === void 0 ? start : pos(cur);
      let knob = "";
      if (!off && target !== null && target !== void 0) {
        const tp = pos(target);
        const [kx, ky] = pt(tp);
        knob = `<circle class="knob" cx="${kx}" cy="${ky}" r="11"/><circle cx="${kx}" cy="${ky}" r="4.5" fill="var(--tone)"/>`;
      }
      const [ax, ay] = pt(start, R + 18), [bx, by] = pt(start + sweep, R + 18);
      return `<svg viewBox="0 0 240 200" aria-hidden="true">
      <path class="track" d="${path(start, start + sweep)}" stroke-width="14" fill="none" stroke-linecap="round"/>
      ${cur === null || cur === void 0 ? "" : `<path class="fill ${off ? "muted" : ""}" d="${path(start, Math.max(start + 0.5, c))}" stroke-width="14" fill="none" stroke-linecap="round"/>`}
      ${knob}
      <text x="${ax}" y="${ay}" text-anchor="middle" class="scale">${min}°</text>
      <text x="${bx}" y="${by}" text-anchor="middle" class="scale">${max}°</text>
    </svg>`;
    }
    _render() {
      try {
        this._renderInner();
      } catch (e) {
        console.error("raumklima-card:", e);
        this._html = `<style>${STYLES}</style><ha-card class="rcard"><div class="err">${esc(t("Karte konnte nicht gezeichnet werden"))}: ${esc(String(e && e.message || e))}</div></ha-card>`;
      }
    }
    _renderInner() {
      if (!this._hass || !this._config) return;
      const st = this._hass.states[this._config.entity];
      if (!st) {
        this._html = `<style>${STYLES}</style><ha-card class="rcard"><div class="err">${t("Entität {e} nicht gefunden", { e: this._config.entity })}</div></ha-card>`;
        return;
      }
      const a = st.attributes;
      const sib = this._siblings();
      const mon = a.monitor === true;
      const status = mon ? { label: t("Überwachung"), icon: "mdi:eye-outline", tone: "eco" } : STATUS[a.status] || STATUS.idle;
      let vent = VENT[a.ventilation] || null;
      if (vent && a.ventilation === "please_close" && a.airing_phase) {
        const phases = {
          long: { label: t("Dauerlüftung – ich erinnere nicht"), icon: "mdi:weather-windy", tone: "air" },
          learned: { label: t("Gewohntes Lüften – keine Erinnerung"), icon: "mdi:history", tone: "air" },
          planned: { label: t("Geplantes Lüften – keine Erinnerung"), icon: "mdi:calendar-clock", tone: "air" }
        };
        vent = phases[a.airing_phase] || vent;
      }
      const target = this._pending ?? a.temperature;
      const isOff = st.state === "off";
      const name = this._config.name || a.friendly_name || t("Raum");
      const accent = this._config.accent || null;
      const winOpen = a.window_open;
      this._openSince = a.window_open_since ? Date.parse(a.window_open_since) : null;
      this._boostUntil = a.boost_until ? Date.parse(a.boost_until) : null;
      this._winSince = rkOpenSince(this._hass, a);
      this._emptySince = a.occupied === false && a.empty_since ? Date.parse(a.empty_since) : null;
      this._roomEco = !!a.room_eco;
      this._recMin = a.recommended_minutes || 5;
      let banner = "";
      if (vent && a.ventilation !== "ok" && !a.night_airing) {
        const showBar = winOpen && this._openSince && ["airing", "please_close", "done"].includes(a.ventilation);
        const extra = a.ventilation === "please_open" ? `<span>${a.ventilation_reason === "co2" ? t("{c} ppm · ca. {m} min", { c: fmt(a.co2, 0), m: this._recMin }) : t("{h} % · ca. {m} min", { h: fmt(a.current_humidity, 0), m: this._recMin })}</span>` : showBar ? `<span class="count" data-count>–</span>` : "";
        banner = `<div class="banner" style="--vt:${toneVar(vent.tone)}">
          <ha-icon icon="${vent.icon}"></ha-icon><span class="grow">${vent.label}${showBar ? ` · ${this._recMin} min` : ""}</span>${extra}
        </div>${showBar ? `<div class="bar" style="--vt:${toneVar(vent.tone)}"><i data-bar style="width:0%"></i></div>` : ""}`;
      }
      const stat = (icon, label, value, tone, entity) => `<div class="stat" ${entity ? `data-more="${entity}" style="cursor:pointer"` : ""}><div class="l"><ha-icon icon="${icon}"></ha-icon>${label}</div>
        <div class="v ${tone ? "tone" : ""}" style="${tone ? `--st:${toneVar(tone)}` : ""}">${value}</div></div>`;
      const cfgS = a.settings || {};
      const valveTone = a.hvac_action ? a.hvac_action === "heating" ? "heat" : null : a.valve_position > 0 ? "heat" : null;
      const stats = [
        a.humidity_sensor ? stat("mdi:water-percent", t("Feuchte"), `${fmt(a.current_humidity, 0)} %`, humTone(a.current_humidity), cfgS.humidity_sensor || a.humidity_entity) : "",
        a.co2 != null ? stat("mdi:molecule-co2", "CO₂", `${fmt(a.co2, 0)}<small>ppm</small>`, a.co2 >= 1400 ? "cold" : a.co2 >= 1e3 ? "warn" : "ok", cfgS.co2_sensor) : "",
        a.pm25 != null ? stat("mdi:molecule", t("Feinstaub"), `${fmt(a.pm25, 0)}<small>µg/m³</small>`, a.pm25 >= 50 ? "cold" : a.pm25 >= 35 ? "warn" : "ok", cfgS.pm25_sensor) : "",
        a.dew_point !== void 0 && a.dew_point !== null ? stat("mdi:water-thermometer", t("Taupunkt"), `${fmt(a.dew_point)}°`, null, sib.dew_point) : "",
        // Keine gemeldete Öffnung (Livisi, RWE VRCC) → Kachel weglassen statt „–" anzeigen.
        a.valve_position === null || a.valve_position === void 0 ? "" : stat("mdi:valve", (a.valve_sources || 0) > 1 ? t("Ventil Ø") : t("Ventil"), `${fmt(a.valve_position, 0)} %`, valveTone, a.valve_sensor),
        a.outdoor_temperature !== void 0 && a.outdoor_temperature !== null ? stat("mdi:weather-partly-cloudy", t("Außen"), `${fmt(a.outdoor_temperature)}°<small>${fmt(a.outdoor_humidity, 0)} %</small>`, null, cfgS.weather_entity) : "",
        mon ? "" : stat("mdi:radiator", t("Heizkörper"), `${fmt(a.trv_temperature)}°`, null, cfgS.trv),
        // „Offset" gibt es nur, wenn das Gerät eine Offset-Entität hat. Sonst regelt
        // Raumklima über den Sollwert – dann zeigen wir die Abweichung Fühler↔Thermostat.
        (() => {
          if (a.offset !== void 0 && a.offset !== null) {
            return stat("mdi:tune-variant", t("Offset"), `${a.offset > 0 ? "+" : ""}${fmt(a.offset)}°`, null, sib.offset);
          }
          if (a.calibration_mode === "target" && a.offset_auto != null && Math.abs(a.offset_auto) >= 0.1) {
            return stat("mdi:tune-variant", t("Abgleich"), `${a.offset_auto > 0 ? "+" : ""}${fmt(a.offset_auto)}°`, Math.abs(a.offset_auto) >= 1 ? "warn" : null, null);
          }
          if (a.calibration_mode === "target" && a.current_temperature != null && a.trv_temperature != null) {
            const d = a.current_temperature - a.trv_temperature;
            return stat("mdi:tune-variant", t("Abgleich"), `${d > 0 ? "+" : ""}${fmt(d)}°`, Math.abs(d) >= 1 ? "warn" : null, null);
          }
          return "";
        })()
      ].join("");
      const extras = a.settings && a.settings.extra_trvs || [];
      const shortName = (n) => String(n || "").split(" - ").pop();
      const mainValve = a.valve_own;
      const devLine = extras.length ? `<div class="devs" title="${esc(t("Jedes Thermostat mit eigenem Sollwert und eigener Öffnung"))}">
          <ha-icon icon="mdi:radiator"></ha-icon>
          <span>${t("{n} Thermostate", { n: extras.length + 1 })}</span>
          ${mainValve != null ? `<b>${t("Haupt")} ${fmt(mainValve, 0)} %</b>` : ""}
          ${extras.map((x) => {
        const valve = x.valve != null && x.available ? `${fmt(x.valve, 0)} %` : "";
        return `<b class="${!x.available ? "off" : x.sync === "ok" ? "" : "warn"}" title="${esc(x.name)}${x.available && x.setpoint_expected != null ? ` · ${t("erwartet {v}°", { v: fmt(x.setpoint_expected) })}` : ""}">${esc(shortName(x.name))}${valve ? ` ${valve}` : ""}</b>`;
      }).join("")}
        </div>` : "";
      const syncCls = a.sync === "ok" ? "" : a.sync;
      const syncLabel = { ok: t("synchron"), pending: t("sendet …"), failed: t("keine Antwort") }[a.sync] || a.sync;
      const notif = sib.notifications ? this._hass.states[sib.notifications] : null;
      const wlogic = sib.window_logic ? this._hass.states[sib.window_logic] : null;
      const calOff = a.offset != null ? a.offset : a.offset_auto;
      const trvNote = !mon && a.trv_target != null && a.temperature != null && Math.abs(a.trv_target - a.temperature) >= 0.3 ? calOff != null && Math.abs(calOff) >= 0.1 ? t("Thermostat {v}° (Abgleich {o}°)", { v: fmt(a.trv_target), o: (calOff > 0 ? "+" : "") + fmt(calOff) }) : t("Thermostat {v}°", { v: fmt(a.trv_target) }) : "";
      const look = rkLook(this._config);
      const dark = look !== "classic" && rkDark(this._hass, this._config, a.settings || {});
      this._html = `<style>${STYLES}${rkLookStyles(look)}</style>
      <ha-card class="rcard ${look === "classic" ? "" : look}${dark ? " dark" : ""}" style="--tone:${toneVar(status.tone)}; --accent:${accent || "transparent"}">
        <div class="top">
          <div class="name" data-more="${this._config.entity}" title="${esc(name)}">${name}</div>
          ${a.window_open !== void 0 ? `<div class="wins"><ha-icon class="${winOpen ? "open" : ""}" icon="${winOpen ? "mdi:window-open-variant" : "mdi:window-closed-variant"}"></ha-icon></div>` : ""}
          ${!mon && sib.boost ? `<button class="boostbtn ${a.boost_until || a.boost_open ? "on" : ""}" data-boostopen title="${t("Wärmer für kurze Zeit")}" aria-label="${t("Wärmer für kurze Zeit")}"><ha-icon icon="mdi:fire-plus"></ha-icon>${a.boost_open ? `<span>∞</span>` : a.boost_until ? `<span>${t("bis {t}", { t: rkClock(Date.parse(a.boost_until)) })}</span>` : t("Boost")}</button>` : ""}
        </div>
        <div class="chips">
          <span class="chip"><ha-icon icon="${status.icon}"></ha-icon>${status.label}</span>
          ${a.battery && a.battery.low ? `<span class="chip" style="--tone:var(--rk-warn)" title="${esc(a.battery.name)}"><ha-icon icon="mdi:battery-alert-variant-outline"></ha-icon>${t("Batterie {p} %", { p: a.battery.level })}</span>` : ""}
          ${a.notify_paused_until ? `<span class="chip" style="--tone:var(--rk-warn)" title="${t("Hinweise für diesen Raum pausiert")}"><ha-icon icon="mdi:bell-off-outline"></ha-icon>${t("Pause bis {time}", { time: new Date(a.notify_paused_until).toLocaleTimeString(loc(), { hour: "2-digit", minute: "2-digit" }) })}</span>` : ""}
        </div>
        ${trvNote ? `<div class="trvnote" title="${esc(trvNote)}"><ha-icon icon="mdi:thermometer-lines"></ha-icon><span>${trvNote}</span></div>` : ""}
        ${a.occupied === true || a.occupied === false ? `<div class="since occ ${a.occupied ? "in" : ""}"><ha-icon icon="${a.occupied ? "mdi:account" : "mdi:account-off-outline"}"></ha-icon><span ${a.occupied ? "" : "data-empty"}>${a.occupied ? t("Jemand im Raum") : ""}</span></div>` : ""}
        ${winOpen && this._winSince ? `<div class="since"><ha-icon icon="mdi:window-open-variant"></ha-icon><span data-since></span></div>` : ""}
        <div class="dial">
          ${mon ? "" : this._arc(a.current_temperature, target, isOff)}
          <div class="center">
            <div class="now">${fmt(a.current_temperature)}<small>°C</small></div>
            <div class="target">${mon ? [a.humidity_sensor ? `${fmt(a.current_humidity, 0)} %` : "", a.co2_sensor ? `${fmt(a.current_co2, 0)} ppm` : ""].filter(Boolean).join(" · ") || t("nur Messen") : this._pending != null ? t("Ziel <b>{v} °C</b>", { v: fmt(target) }) : planText(a, isOff, true)}</div>
          </div>
        </div>
        ${mon ? "" : `<div class="ctrl">
          <button class="round" data-step="-0.5" ${isOff ? "disabled" : ""} aria-label="${t("kälter")}"><ha-icon icon="mdi:minus"></ha-icon></button>
          <button class="round" data-power aria-label="${t("an/aus")}" style="${isOff ? "" : "color:var(--tone)"}"><ha-icon icon="mdi:power"></ha-icon></button>
          <button class="round" data-step="0.5" ${isOff ? "disabled" : ""} aria-label="${t("wärmer")}"><ha-icon icon="mdi:plus"></ha-icon></button>
        </div>`}
        ${banner}
        <div class="stats">${stats}</div>
        ${devLine}
        ${this._boostOpen ? this._boostSheet(a) : ""}
        <div class="actions">
          ${wlogic ? `<button class="pill ${wlogic.state === "on" ? "on" : ""}" data-toggle="${sib.window_logic}"><ha-icon icon="mdi:window-shutter-auto"></ha-icon>${t("Fensterlogik")}</button>` : ""}
          ${notif ? `<button class="pill ${notif.state === "on" ? "on" : ""}" data-toggle="${sib.notifications}"><ha-icon icon="${notif.state === "on" ? "mdi:bell-ring-outline" : "mdi:bell-off-outline"}"></ha-icon>${t("Hinweise")}</button>` : ""}
          ${mon ? "" : `<span class="sync ${syncCls}"><ha-icon icon="${a.sync === "ok" ? "mdi:check-circle-outline" : "mdi:sync"}"></ha-icon>${syncLabel}</span>`}
        </div>
      </ha-card>`;
      this.shadowRoot.querySelectorAll("[data-step]").forEach((b) => b.addEventListener("click", () => this._step(parseFloat(b.dataset.step))));
      const p = this.shadowRoot.querySelector("[data-power]");
      if (p) p.addEventListener("click", () => this._call("climate", isOff ? "turn_on" : "turn_off", { entity_id: this._config.entity }));
      this.shadowRoot.querySelectorAll("[data-toggle]").forEach((b) => b.addEventListener("click", () => this._call("switch", "toggle", { entity_id: b.dataset.toggle })));
      this.shadowRoot.querySelectorAll("[data-boostopen]").forEach((b) => b.addEventListener("click", (ev) => {
        ev.stopPropagation();
        this._boostOpen = !this._boostOpen;
        this._render();
      }));
      this.shadowRoot.querySelectorAll("[data-bs]").forEach((b) => b.addEventListener("click", (ev) => {
        ev.stopPropagation();
        this._boost(b.dataset.bs, b.dataset.min);
      }));
      this.shadowRoot.querySelectorAll("[data-bsclose]").forEach((b) => b.addEventListener("click", (ev) => {
        ev.stopPropagation();
        this._boostOpen = false;
        this._render();
      }));
      this.shadowRoot.querySelectorAll("[data-more]").forEach((b) => b.addEventListener("click", () => this._moreInfo(b.dataset.more)));
      this._tick();
    }
  };

  // src/cards/overview.js
  var RaumklimaOverviewCard = class extends HTMLElement {
    // Neu zeichnen ohne Springen der Seite
    set _html(html) {
      rkPaint(this, html);
    }
    static getConfigForm() {
      return {
        schema: [
          { name: "title", selector: { text: {} } },
          { name: "weather", selector: { entity: { domain: "weather" } } }
        ],
        computeLabel: (s) => ({ title: t("Titel"), weather: t("Wetter (optional)") })[s.name]
      };
    }
    static getStubConfig() {
      return { title: t("Heizung") };
    }
    setConfig(config) {
      this._config = config || {};
      if (!this.shadowRoot) this.attachShadow({ mode: "open" });
    }
    getCardSize() {
      return 4;
    }
    getGridOptions() {
      return { columns: 12, rows: "auto" };
    }
    set hass(hass) {
      this._hass = hass;
      setLang(hass);
      if (!this._dashAsked) {
        this._dashAsked = true;
        hass.callWS({ type: "raumklima/dashboards" }).then((r) => {
          this._known = new Set(r && r.dashboards || []);
          this._render();
        }).catch(() => {
        });
      }
      if (!this._weatherAsked) {
        this._weatherAsked = true;
        hass.callWS({ type: "raumklima/config", home: rkHomeId(hass, this._config) }).then((r) => {
          const wx = r && r.hub && r.hub.options && r.hub.options.weather_entity;
          if (wx && wx !== this._hubWeather) {
            this._hubWeather = wx;
            this._render();
          }
        }).catch(() => {
        });
      }
      if (!this._layoutAsked) {
        this._layoutAsked = true;
        rkLayout(hass, rkHomeId(hass, this._config)).then((L) => {
          this._layout = L;
          this._render();
        }).catch(() => {
        });
      }
      const own = Object.values(hass.entities || {}).filter((e) => e.platform === "raumklima").map((e) => e.entity_id);
      const wins = own.filter((id) => id.startsWith("climate.")).flatMap((id) => hass.states[id] && hass.states[id].attributes.window_entities || []);
      if (!rkChanged(this, hass, [...own, ...wins]) && this.shadowRoot && this.shadowRoot.firstChild) return;
      if (rkScrolling()) {
        rkLater(this, () => this._render());
        return;
      }
      this._render();
    }
    connectedCallback() {
      this._timer = setInterval(() => rkScrolling() ? null : this._render(), 3e4);
      this._layoutUnsub = rkOnLayoutChanged(() => this._reloadLayout());
    }
    disconnectedCallback() {
      clearInterval(this._timer);
      if (this._layoutUnsub) this._layoutUnsub();
    }
    _reloadLayout() {
      this._layoutAsked = true;
      rkLayout(this._hass, rkHomeId(this._hass, this._config)).then((L) => {
        this._layout = L;
        this._sig = null;
        this._render();
      }).catch(() => {
      });
    }
    _render() {
      if (!this._hass) return;
      const homeId = rkHomeId(this._hass, this._config);
      const rooms = Object.values(this._hass.entities || {}).filter((e) => e.platform === "raumklima" && e.entity_id.startsWith("climate.")).map((e) => this._hass.states[e.entity_id]).filter(Boolean).filter((r) => !homeId || !r.attributes.home || r.attributes.home === homeId).sort((a, b) => (a.attributes.friendly_name || "").localeCompare(b.attributes.friendly_name || ""));
      const rows = rkLayoutApply(rooms, this._layout);
      const homes = rkHomes(this._hass);
      const curHome = homeId || rooms[0] && rooms[0].attributes.home;
      const curPath = String(this._hass && this._hass.panelUrl || "").replace(/^\//, "");
      const dashTarget = (h) => {
        const path = String(h.dashboard || "").replace(/^\//, "");
        if (!path) return { ok: false, path };
        const known = this._hass && this._hass.dashboards || {};
        const server = this._known instanceof Set ? this._known.has(path) : false;
        return { ok: path === curPath || server || Object.prototype.hasOwnProperty.call(known, path), path };
      };
      const homeBar = homes.length > 1 ? `<div class="homes">${homes.map((h) => {
        const on = h.id === curHome;
        const d = dashTarget(h);
        const title = on || d.ok ? "" : t("Für diese Wohnung ist noch kein eigenes Dashboard eingerichtet – erst anlegen, dann lässt sich umschalten.");
        return `<a class="hm ${on ? "on" : ""}${d.ok || on ? "" : " nodash"}" ${on || !d.ok ? "" : `data-nav="/${esc(d.path)}"`} title="${esc(title)}"><ha-icon icon="mdi:home-outline"></ha-icon>${esc(h.name)}</a>`;
      }).join("")}</div>` : "";
      const heating = rows.filter((r) => r.attributes.status === "heating").length;
      const windows = rows.filter((r) => r.attributes.window_open).length;
      const offRooms = rows.filter((r) => r.state === "off").length;
      const warn = rows.filter((r) => ["please_open", "please_close", "too_cold"].includes(r.attributes.ventilation) || r.attributes.sync === "failed" || ["sensor_unavailable", "trv_unavailable"].includes(r.attributes.status)).length;
      const wxId = this._hubWeather || this._config.weather;
      const w = wxId ? this._hass.states[wxId] : null;
      const outT = w ? w.attributes.temperature : rows.map((r) => r.attributes.outdoor_temperature).find((v) => v !== void 0 && v !== null);
      const outH = w ? w.attributes.humidity : rows.map((r) => r.attributes.outdoor_humidity).find((v) => v !== void 0 && v !== null);
      const allSync = rows.every((r) => r.attributes.sync === "ok");
      const hubIds = rkHub(this._hass, curHome);
      const presSt = hubIds.presence ? this._hass.states[hubIds.presence] : null;
      const seasSt = hubIds.heating_mode ? this._hass.states[hubIds.heating_mode] : null;
      const pres = presSt ? PRESENCE[presSt.state] : null;
      const seas = seasSt ? SEASON[seasSt.state] : null;
      const here = presSt ? Object.values(presSt.attributes.persons || {}).filter((p) => p.present).map((p) => p.name) : [];
      const row = (r) => {
        const a = r.attributes;
        const mon = a.monitor === true;
        const s = mon ? { label: t("Überwachung"), tone: "eco", icon: "mdi:eye-outline" } : STATUS[a.status] || STATUS.idle;
        const v = VENT[a.ventilation];
        const off = r.state === "off";
        const tone = v && a.ventilation !== "ok" ? v.tone : s.tone;
        const label = v && a.ventilation !== "ok" ? v.label : s.label;
        const trvNote = a.trv_target != null && a.temperature != null && Math.abs(a.trv_target - a.temperature) >= 0.3 ? ` · ${a.offset != null && Math.abs(a.offset) >= 0.1 ? t("Thermostat {v}° (Abgleich {o}°)", { v: fmt(a.trv_target), o: (a.offset > 0 ? "+" : "") + fmt(a.offset) }) : t("Thermostat {v}°", { v: fmt(a.trv_target) })}` : "";
        const prefix = this._config.strip_prefix ?? "";
        const name = (a.friendly_name || "").replace(new RegExp("^" + escRe(prefix) + "\\s*"), "");
        const applied = a.effective_target != null ? a.effective_target : a.temperature;
        const wish = a.wish != null ? a.wish : a.temperature;
        const wishDiffers = applied != null && wish != null && Math.abs(applied - wish) >= 0.05;
        const tag = planTag(a);
        const targetText = mon ? "" : off ? t("aus") : a.plan_reason === "season" ? t("Pause") : tag ? wishDiffers ? t("{tag} {v}° · Wunsch {w}°", { tag, v: fmt(applied), w: fmt(wish) }) : t("{tag} {v}°", { tag, v: fmt(applied) }) : wishDiffers ? applied < wish ? t("↓ {v}° · Wunsch {w}°", { v: fmt(applied), w: fmt(wish) }) : t("Ziel {v}° · Wunsch {w}°", { v: fmt(applied), w: fmt(wish) }) : t("Ziel {v}°", { v: fmt(applied) });
        return `<div class="room${mon ? " static" : ""}" ${mon ? "" : `data-more="${r.entity_id}"`} style="--tone:${toneVar(tone)}">
        <div class="rtop"><div class="dot"><ha-icon icon="${v && a.ventilation !== "ok" ? v.icon : s.icon}"></ha-icon></div>
          ${a.occupied === true ? `<ha-icon class="occ" icon="mdi:account" title="${t("Jemand im Raum")}"></ha-icon>` : ""}
          ${a.window_open ? `<span class="wopen"><ha-icon class="win" icon="mdi:window-open-variant"></ha-icon>${(() => {
          const s2 = rkOpenSince(this._hass, a);
          return s2 ? `<span title="${t("offen seit {c}", { c: rkClock(s2) })}">${rkDuration(Date.now() - s2)}</span>` : "";
        })()}</span>` : ""}</div>
        <div class="rn">${name}</div>
        <div class="rs">${label}${trvNote}</div>
        <div class="rbottom">
          <div class="rt">${fmt(a.current_temperature)}°</div>
          <div class="rmeta">${targetText}${a.humidity_sensor ? `<b style="--st:${toneVar(humTone(a.current_humidity))}">${fmt(a.current_humidity, 0)} %</b>` : ""}</div>
        </div>
      </div>`;
      };
      const look = rkLook(this._config);
      const settings = rows[0] && rows[0].attributes.settings || {};
      const dark = look !== "classic" && rkDark(this._hass, this._config, settings);
      this._html = `<style>${STYLES}${rkLookStyles(look)}
      .head { display:flex; align-items:flex-end; gap:16px; flex-wrap:wrap; }
      .title { font-size:1.5rem; font-weight:650; letter-spacing:-.02em; color:var(--primary-text-color); }
      .sub { color:var(--secondary-text-color); font-size:.9rem; margin-top:2px; }
      .ver { display:block; margin-top:3px; font-size:.72rem; letter-spacing:.02em;
             color:color-mix(in srgb, var(--secondary-text-color) 75%, transparent); }
      .out { text-align:right; color:var(--primary-text-color); }
      .out b { font-size:1.6rem; font-weight:300; letter-spacing:-.03em; }
      .out span { display:block; font-size:.78rem; color:var(--secondary-text-color); }
      .kpis { display:flex; gap:8px; margin:16px 0 8px; flex-wrap:wrap; }
      .rooms { display:grid; gap:10px; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); }
      .room.static { cursor:default; }
      .room { display:flex; flex-direction:column; gap:2px; padding:14px; border-radius:20px; cursor:pointer; min-height:130px;
        background: color-mix(in srgb, var(--tone) 7%, color-mix(in srgb, var(--primary-text-color) 3%, transparent));
        border: 1px solid color-mix(in srgb, var(--tone) 18%, transparent); transition: transform .15s, background .2s; }
      .room:hover { transform: translateY(-2px); background: color-mix(in srgb, var(--tone) 12%, transparent); }
      .rtop { display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; }
      .dot { width:36px; height:36px; border-radius:12px; display:grid; place-items:center; color:var(--tone); background: color-mix(in srgb, var(--tone) 16%, transparent); }
      .dot ha-icon { --mdc-icon-size:20px; }
      .win { color: var(--rk-air); --mdc-icon-size:20px; }
      .occ { color: var(--rk-ok); --mdc-icon-size:18px; margin-left:auto; margin-right:6px; }
      .wopen { display:inline-flex; align-items:center; gap:4px; color:var(--rk-air); font-size:.78rem; font-weight:600; font-variant-numeric:tabular-nums; }
      .rn { font-weight:650; color:var(--primary-text-color); }
      .rs { font-size:.78rem; color: var(--tone); font-weight:600; }
      .homes { display:flex; gap:6px; margin:-4px 0 14px; flex-wrap:wrap; }
      .hm { all:unset; cursor:pointer; display:inline-flex; align-items:center; gap:6px; padding:8px 16px; border-radius:999px; font-weight:650; font-size:.95rem;
        color:var(--secondary-text-color); background: color-mix(in srgb, var(--primary-text-color) 6%, transparent); }
      .hm ha-icon { --mdc-icon-size:17px; }
      .hm.on { background: color-mix(in srgb, var(--primary-text-color) 16%, transparent); color: var(--primary-text-color); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-text-color) 30%, transparent); cursor:default; }
      .hm.nodash { opacity:.5; cursor:default; }
      .rbottom { margin-top:auto; display:flex; align-items:flex-end; justify-content:space-between; gap:8px; }
      .rt { font-size:1.7rem; font-weight:300; letter-spacing:-.03em; font-variant-numeric: tabular-nums; color:var(--primary-text-color); line-height:1; }
      .rmeta { text-align:right; font-size:.78rem; color:var(--secondary-text-color); display:flex; flex-direction:column; gap:2px; }
      .rmeta b { color: var(--st); font-weight:650; }
    </style>
    <ha-card class="${look === "classic" ? "" : look}${dark ? " dark" : ""}" style="--tone:${toneVar(warn ? "warn" : heating ? "heat" : "ok")}">
      ${homeBar}
      <div class="head">
        <div style="flex:1;min-width:0"><div class="title">${this._config.title || t("Heizung")}</div>
          <div class="sub">${t("{r} Räume · {h} heizen · {w} Fenster offen", { r: rows.length, h: heating, w: windows })}<span class="ver">Raumklima ${RK_VERSION}${(() => {
        const neu = rkVersionMismatch(this._cfg, RK_VERSION);
        return neu ? ` <span title="${esc(t("Die Karte im Browser ist älter als die Integration – Seite mit Strg+Shift+R neu laden."))}" style="color:var(--rk-warn)">· ${esc(t("neu: {v} – Seite neu laden", { v: neu }))}</span>` : "";
      })()}</span></div></div>
        ${outT !== void 0 && outT !== null ? `<div class="out"><b>${fmt(outT)}°</b><span>${t("außen · {h} %", { h: fmt(outH, 0) })}</span></div>` : ""}
      </div>
      <div class="kpis">
        <span class="chip" style="--tone:${toneVar(heating ? "heat" : "off")}"><ha-icon icon="mdi:fire"></ha-icon>${t("{n} heizen", { n: heating })}</span>
        ${pres && presSt && ["away_short", "away_long"].includes(presSt.state) && offRooms ? `<span class="chip" style="--tone:${toneVar("off")}"><ha-icon icon="mdi:power-plug-off"></ha-icon>${offRooms > 1 ? t("{n} Räume aus", { n: offRooms }) : t("1 Raum aus")}</span>` : ""}
        <span class="chip" style="--tone:${toneVar(windows ? "air" : "off")}"><ha-icon icon="mdi:window-open-variant"></ha-icon>${t("{n} offen", { n: windows })}</span>
        <span class="chip" style="--tone:${toneVar(warn ? "warn" : "ok")}"><ha-icon icon="${warn ? "mdi:alert-circle-outline" : "mdi:check-circle-outline"}"></ha-icon>${warn ? warn > 1 ? t("{n} Hinweise", { n: warn }) : t("1 Hinweis") : t("alles gut")}</span>
        <span class="chip" style="--tone:${toneVar(allSync ? "ok" : "warn")}"><ha-icon icon="mdi:sync"></ha-icon>${allSync ? t("synchron") : t("sendet …")}</span>
        ${pres && presSt.attributes.configured ? `<span class="chip" data-more="${hubIds.presence}" style="--tone:${toneVar(pres.tone)};cursor:pointer"><ha-icon icon="${pres.icon}"></ha-icon>${presSt.state === "home" && here.length ? here.join(", ") : pres.label}${presSt.state === "preheat" && presSt.attributes.preheat_by ? ` · ${presSt.attributes.preheat_by}` : ""}</span>` : ""}
        ${seas ? `<span class="chip" data-more="${hubIds.heating_mode}" style="--tone:${toneVar(seas.tone)};cursor:pointer"><ha-icon icon="${seas.icon}"></ha-icon>${seas.label}${seasSt.attributes.mean_combined != null ? ` · Ø ${fmt(seasSt.attributes.mean_combined)}°` : ""}</span>` : ""}
      </div>
      <div class="rooms">${rows.map(row).join("")}</div>
    </ha-card>`;
      this.shadowRoot.querySelectorAll("[data-more]").forEach((b) => b.addEventListener("click", () => this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: b.dataset.more }, bubbles: true, composed: true }))));
      this.shadowRoot.querySelectorAll("[data-nav]").forEach((el) => el.addEventListener("click", () => {
        history.pushState(null, "", el.dataset.nav);
        window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: false } }));
      }));
    }
  };

  // src/cards/history.js
  var RaumklimaHistoryCard = class extends HTMLElement {
    // Neu zeichnen ohne Springen der Seite
    set _html(html) {
      rkPaint(this, html);
    }
    static getConfigForm() {
      return {
        schema: [
          { name: "mode", selector: { select: { options: [
            { value: "temperature", label: t("Raumtemperatur") },
            { value: "humidity", label: t("Luftfeuchte") },
            { value: "timeline", label: t("Heizung & Fenster (Zeitleiste)") }
          ] } } },
          { name: "title", selector: { text: {} } },
          { name: "hours", selector: { number: { min: 1, max: 168, step: 1 } } },
          { name: "strip_prefix", selector: { text: {} } },
          { name: "min_segment_seconds", selector: { number: { min: 0, max: 3600, step: 15, unit_of_measurement: "s" } } }
        ]
      };
    }
    static getStubConfig() {
      return { mode: "temperature", hours: 24 };
    }
    setConfig(config) {
      this._config = { mode: "temperature", hours: 24, ...config };
      this._hours = this._config.hours;
      this._hidden = /* @__PURE__ */ new Set();
      this._data = null;
      if (!this.shadowRoot) this.attachShadow({ mode: "open" });
    }
    getCardSize() {
      return this._config.mode === "timeline" ? 4 : 6;
    }
    getGridOptions() {
      return { columns: "full", rows: "auto" };
    }
    connectedCallback() {
      this.style.display = "block";
      this._ro = new ResizeObserver(() => {
        const w = this.clientWidth;
        if (w && w !== this._lastW) {
          this._lastW = w;
          this._lastDraw = 0;
          this._draw();
        }
      });
      this._ro.observe(this);
      this._poll = setInterval(() => this._load(), 5 * 60 * 1e3);
    }
    disconnectedCallback() {
      this._ro && this._ro.disconnect();
      clearInterval(this._poll);
    }
    set hass(hass) {
      const first = !this._hass;
      this._hass = hass;
      setLang(hass);
      if (first || !this._rooms) this._rooms = rkRooms(hass, this._config.strip_prefix || "", rkHomeId(hass, this._config));
      if (!this._layout) {
        rkLayout(hass, rkHomeId(hass, this._config)).then((L) => {
          this._layout = L;
          this._rooms = rkRoomsOrdered(this._rooms || [], L);
          this._draw();
        });
      }
      if (first) this._load();
      else this._draw(true);
    }
    _entities() {
      const m = this._config.mode;
      if (m === "temperature") return this._rooms.map((r) => r.attrs.temperature_sensor).filter(Boolean);
      if (m === "humidity") return this._rooms.map((r) => r.attrs.humidity_entity).filter(Boolean);
      return this._rooms.flatMap((r) => [r.sib.status, ...r.attrs.window_entities || []]).filter(Boolean);
    }
    async _load() {
      if (!this._hass || !this._rooms) return;
      const ids = this._entities();
      const end = /* @__PURE__ */ new Date();
      const start = new Date(end.getTime() - this._hours * 3600 * 1e3);
      this._range = [start.getTime(), end.getTime()];
      if (!ids.length) {
        this._data = {};
        this._draw();
        return;
      }
      try {
        const res = await this._hass.callWS({
          type: "history/history_during_period",
          start_time: start.toISOString(),
          end_time: end.toISOString(),
          entity_ids: ids,
          minimal_response: true,
          no_attributes: true,
          significant_changes_only: false
        });
        this._data = res || {};
        this._error = null;
      } catch (e) {
        this._data = {};
        this._error = String(e && e.message ? e.message : e);
      }
      this._draw();
    }
    _series(entityId) {
      const raw = this._data && this._data[entityId] || [];
      const pts = [];
      for (const p of raw) {
        const ts = (p.lu ?? p.lc ?? 0) * 1e3;
        const v = parseFloat(p.s);
        if (!isNaN(v)) pts.push([Math.max(ts, this._range[0]), v]);
      }
      const now = this._hass.states[entityId];
      if (now && !isNaN(parseFloat(now.state))) pts.push([Date.now(), parseFloat(now.state)]);
      const step = this._hours > 48 ? 30 * 6e4 : this._hours > 12 ? 10 * 6e4 : 5 * 6e4;
      const out = [];
      let bucket = null, sum = 0, n = 0;
      for (const [ts, v] of pts) {
        const b = Math.floor(ts / step) * step;
        if (bucket !== null && b !== bucket) {
          out.push([bucket + step / 2, sum / n]);
          sum = 0;
          n = 0;
        }
        bucket = b;
        sum += v;
        n++;
      }
      if (n) out.push([bucket + step / 2, sum / n]);
      return out;
    }
    _smooth(pts) {
      if (pts.length < 2) return pts.length ? `M${pts[0][0]},${pts[0][1]}` : "";
      let d = `M${pts[0][0]},${pts[0][1]}`;
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
        const k = 0.18;
        d += ` C${p1[0] + (p2[0] - p0[0]) * k},${p1[1] + (p2[1] - p0[1]) * k} ${p2[0] - (p3[0] - p1[0]) * k},${p2[1] - (p3[1] - p1[1]) * k} ${p2[0]},${p2[1]}`;
      }
      return d;
    }
    _fmtTime(ts) {
      const d = new Date(ts);
      return this._hours > 48 ? d.toLocaleDateString(loc(), { weekday: "short", day: "numeric" }) : rkTime(d, { hour: "2-digit", minute: "2-digit" });
    }
    _shell(body) {
      const m = this._config.mode;
      const meta = { temperature: [t("Raumtemperatur"), "mdi:thermometer", "heat"], humidity: [t("Luftfeuchte"), "mdi:water-percent", "air"], timeline: [t("Heizung & Fenster"), "mdi:radiator", "ok"] }[m];
      const title = this._config.title || meta[0];
      const ranges = [[6, "6 h"], [24, "24 h"], [168, t("7 T")]];
      return `<style>${STYLES}${HISTORY_STYLES}</style>
      <ha-card style="--tone:${toneVar(meta[2])}">
        <div class="hhead">
          <div class="htitle"><ha-icon icon="${meta[1]}"></ha-icon>${title}</div>
          <div class="seg">${ranges.map(([h, l]) => `<button data-h="${h}" class="${this._hours === h ? "on" : ""}">${l}</button>`).join("")}</div>
        </div>
        ${body}
      </ha-card>`;
    }
    _bind() {
      this.shadowRoot.querySelectorAll("[data-h]").forEach((b) => b.addEventListener("click", () => {
        this._hours = parseInt(b.dataset.h, 10);
        this._data = null;
        this._draw();
        this._load();
      }));
      this.shadowRoot.querySelectorAll("[data-room]").forEach((b) => b.addEventListener("click", () => {
        const id = b.dataset.room;
        this._hidden.has(id) ? this._hidden.delete(id) : this._hidden.add(id);
        this._draw();
      }));
    }
    _draw(liveOnly) {
      if (!this._hass || !this._rooms) return;
      if (liveOnly && this._lastDraw && Date.now() - this._lastDraw < 3e4) return;
      this._lastDraw = Date.now();
      if (this._config.mode === "timeline") return this._drawTimeline();
      return this._drawLines();
    }
    _drawLines() {
      const m = this._config.mode;
      const key = m === "temperature" ? "temperature_sensor" : "humidity_entity";
      const unit = m === "temperature" ? "°" : " %";
      const rooms = this._rooms.filter((r) => r.attrs[key]);
      const legend = rooms.map((r) => {
        const st = this._hass.states[r.attrs[key]];
        const v = st ? parseFloat(st.state) : NaN;
        return `<button class="lchip ${this._hidden.has(r.id) ? "off" : ""}" data-room="${r.id}" style="--c:${r.color}"><i></i>${r.name}<b>${isNaN(v) ? "–" : fmt(v, m === "temperature" ? 1 : 0) + unit}</b></button>`;
      }).join("");
      if (!this._data) {
        this._html = this._shell(`<div class="legend">${legend}</div><div class="chart"><div class="empty">${t("Lade Verlauf …")}</div></div>`);
        return this._bind();
      }
      const cw = this.shadowRoot.querySelector(".chart");
      const W = Math.max(280, cw && cw.clientWidth || this.clientWidth - 48), H = 240, padL = 34, padR = 8, padT = 10, padB = 24;
      const series = rooms.filter((r) => !this._hidden.has(r.id)).map((r) => ({ r, pts: this._series(r.attrs[key]) })).filter((s) => s.pts.length);
      const all = series.flatMap((s) => s.pts.map((p) => p[1]));
      const band = m === "temperature" ? [19, 22] : [40, 60];
      let lo = Math.min(...all, band[0]), hi = Math.max(...all, band[1]);
      if (!isFinite(lo)) {
        lo = band[0];
        hi = band[1];
      }
      const stepY = m === "temperature" ? hi - lo > 8 ? 2 : 1 : 10;
      lo = Math.floor((lo - 0.5) / stepY) * stepY;
      hi = Math.ceil((hi + 0.5) / stepY) * stepY;
      const [t0, t1] = this._range;
      const x = (ts) => padL + (ts - t0) / (t1 - t0) * (W - padL - padR);
      const y = (v) => padT + (1 - (v - lo) / (hi - lo)) * (H - padT - padB);
      let grid = "";
      for (let v = lo; v <= hi + 1e-9; v += stepY) grid += `<line x1="${padL}" x2="${W - padR}" y1="${y(v)}" y2="${y(v)}"/><text class="ylab" x="${padL - 6}" y="${y(v) + 3.5}" text-anchor="end">${fmt(v, 0)}${unit.trim() === "%" ? "" : "°"}</text>`;
      const ticks = this._hours > 48 ? 7 : W < 520 ? 3 : this._hours > 12 ? 4 : 6;
      let xl = "";
      for (let i = 0; i <= ticks; i++) {
        const ts = t0 + (t1 - t0) * i / ticks;
        xl += `<text class="xlab" x="${x(ts)}" y="${H - 6}" text-anchor="${i === 0 ? "start" : i === ticks ? "end" : "middle"}">${i === ticks ? t("jetzt") : this._fmtTime(ts)}</text>`;
      }
      const defs = series.map((s, i) => `<linearGradient id="g${i}" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="${s.r.color}" stop-opacity=".22"/><stop offset="100%" stop-color="${s.r.color}" stop-opacity="0"/></linearGradient>`).join("");
      const paths = series.map((s, i) => {
        const pts = s.pts.map(([ts, v]) => [x(ts), y(v)]);
        const d = this._smooth(pts);
        const area = series.length <= 2 ? `<path d="${d} L${pts[pts.length - 1][0]},${H - padB} L${pts[0][0]},${H - padB} Z" fill="url(#g${i})"/>` : "";
        return `${area}<path class="line" d="${d}" stroke="${s.r.color}"/><circle cx="${pts[pts.length - 1][0]}" cy="${pts[pts.length - 1][1]}" r="3.5" fill="${s.r.color}"/>`;
      }).join("");
      const bandSvg = `<rect class="band" x="${padL}" width="${W - padL - padR}" y="${y(band[1])}" height="${y(band[0]) - y(band[1])}" rx="6"/><text class="bandlab" x="${W - padR - 6}" y="${y(band[1]) + 13}" text-anchor="end">${t("Wohlfühlbereich")}</text>`;
      const body = series.length ? `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><defs>${defs}</defs>${bandSvg}<g class="grid">${grid}</g>${xl}${paths}<line class="hover-line" x1="0" x2="0" y1="${padT}" y2="${H - padB}" style="display:none"/></svg><div class="tip" style="display:none"></div>` : `<div class="empty">${this._error ? t("Verlauf nicht verfügbar: {e}", { e: this._error }) : t("Keine Daten im Zeitraum")}</div>`;
      this._html = this._shell(`<div class="legend">${legend}</div><div class="chart" style="--h:${H}px">${body}</div>`);
      this._bind();
      const chart = this.shadowRoot.querySelector(".chart");
      const svg = chart.querySelector("svg");
      if (!svg) return;
      const hl = svg.querySelector(".hover-line"), tip = chart.querySelector(".tip");
      const near = (pts, ts) => {
        let best = null;
        for (const p of pts) if (!best || Math.abs(p[0] - ts) < Math.abs(best[0] - ts)) best = p;
        return best;
      };
      chart.addEventListener("mousemove", (ev) => {
        const rect = svg.getBoundingClientRect();
        const px = (ev.clientX - rect.left) / rect.width * W;
        if (px < padL || px > W - padR) {
          hl.style.display = "none";
          tip.style.display = "none";
          return;
        }
        const ts = t0 + (px - padL) / (W - padL - padR) * (t1 - t0);
        hl.setAttribute("x1", px);
        hl.setAttribute("x2", px);
        hl.style.display = "";
        const rows = series.map((s) => {
          const p = near(s.pts, ts);
          return `<div class="r" style="--c:${s.r.color}"><span><i></i>${s.r.name}</span><b>${fmt(p[1], m === "temperature" ? 1 : 0)}${unit}</b></div>`;
        }).join("");
        tip.innerHTML = `<div class="t">${new Date(ts).toLocaleDateString(loc(), { weekday: "short" })} ${rkTime(new Date(ts), { hour: "2-digit", minute: "2-digit" })}</div>${rows}`;
        tip.style.display = "";
        const left = ev.clientX - chart.getBoundingClientRect().left;
        tip.style.left = `${left > chart.clientWidth / 2 ? left - tip.offsetWidth - 14 : left + 14}px`;
      });
      chart.addEventListener("mouseleave", () => {
        hl.style.display = "none";
        tip.style.display = "none";
      });
    }
    _drawTimeline() {
      if (!this._data) {
        this._html = this._shell(`<div class="empty">${t("Lade Verlauf …")}</div>`);
        return this._bind();
      }
      const [t0, t1] = this._range;
      const pct = (ts) => (Math.max(t0, Math.min(t1, ts)) - t0) / (t1 - t0) * 100;
      const bucket = Math.max((this._config.min_segment_seconds ?? 120) * 1e3, (t1 - t0) / 200);
      const spans = (id, map, merge) => {
        const raw = (this._data[id] || []).map((p) => [(p.lu ?? p.lc ?? 0) * 1e3, p.s]);
        const now = this._hass.states[id];
        if (now) raw.push([Date.now(), now.state]);
        let out = [];
        for (let i = 0; i < raw.length; i++) {
          const [ts, s] = raw[i];
          const end = i + 1 < raw.length ? raw[i + 1][0] : t1;
          if (end > t0) out.push([Math.max(ts, t0), end, s]);
        }
        if (merge && out.length) {
          const m = [];
          const start = out[0][0];
          let k = 0;
          for (let bs = start; bs < t1; bs += bucket) {
            const be = Math.min(bs + bucket, t1);
            const tally = {};
            while (k < out.length && out[k][1] <= bs) k++;
            for (let j = k; j < out.length && out[j][0] < be; j++) {
              const ov = Math.min(be, out[j][1]) - Math.max(bs, out[j][0]);
              if (ov > 0) tally[out[j][2]] = (tally[out[j][2]] || 0) + ov;
            }
            const st = Object.keys(tally).sort((x, y) => tally[y] - tally[x])[0];
            if (!st) continue;
            const last = m[m.length - 1];
            if (last && last[2] === st && last[1] >= bs - 1) last[1] = be;
            else m.push([bs, be, st]);
          }
          out = m;
        }
        return out.map(([a, b, s]) => map(a, b, s)).join("");
      };
      const rows = this._rooms.map((r) => {
        const status = r.sib.status ? spans(r.sib.status, (a, b, s) => {
          const seg = SEG[s];
          return seg ? `<i style="left:${pct(a)}%;width:${Math.max(0.3, pct(b) - pct(a))}%;background:${seg.c}" title="${seg.l}"></i>` : "";
        }, true) : "";
        const wins = (r.attrs.window_entities || []).map((w) => spans(w, (a, b, s) => s === "on" ? `<em style="left:${pct(a)}%;width:${Math.max(0.4, pct(b) - pct(a))}%" title="${t("Fenster offen")}"></em>` : "")).join("");
        return `<div class="n">${r.name}</div><div class="bar">${status}${wins}</div>`;
      }).join("");
      const ticks = this._hours > 48 ? 7 : 6;
      const xl = Array.from({ length: ticks + 1 }, (_, i) => `<span>${i === ticks ? t("jetzt") : this._fmtTime(t0 + (t1 - t0) * i / ticks)}</span>`).join("");
      const leg = ["heating", "idle", "setback", "window_open", "night_airing", "off", "season_off"].map((k) => `<span><i style="--c:${SEG[k].c}"></i>${SEG[k].l}</span>`).join("") + `<span><i style="--c:transparent;outline:2px solid var(--rk-air);background:repeating-linear-gradient(45deg, color-mix(in srgb, var(--rk-air) 30%, transparent) 0 3px, transparent 3px 6px)"></i>${t("Fensterkontakt offen")}</span>`;
      this._html = this._shell(`<div class="tl">${rows}</div><div class="tlx">${xl}</div><div class="tleg">${leg}</div>`);
      this._bind();
    }
  };

  // src/help.js
  var HELP = {
    "Feinstaubfühler": [
      "PM2,5-Fühler im Raum. Ab 35 µg/m³ schlägt Raumklima Lüften vor, unter 15 µg/m³ gilt die Luft als ausgetauscht.",
      "PM2.5 sensor in the room. From 35 µg/m³ Raumklima suggests airing; below 15 µg/m³ the air counts as exchanged.",
      "Capteur PM2.5 dans la pièce. Dès 35 µg/m³ Raumklima conseille d'aérer ; sous 15 µg/m³ l'air est considéré comme renouvelé."
    ],
    "Reihenfolge": [
      "Legt fest, in welcher Reihenfolge die Räume auf der Übersicht erscheinen – die erste Karte steht oben.",
      "Sets the order of the rooms in the overview – the first card is on top.",
      "Définit l'ordre des pièces dans la vue d'ensemble – la première carte est en haut."
    ],
    "Anwesenheit aus": [
      "Schaltet nur die Anwesenheits-Auswertung ab. Zeitfenster, Boost, Ruhezeit, Lüftung und Bericht laufen weiter.",
      "Turns off only the presence evaluation. Schedules, boost, quiet time, airing and reports keep running.",
      "Désactive uniquement l'évaluation de présence. Plages horaires, boost, heures calmes, aération et rapports continuent."
    ],
    "Kein Thermostat": [
      "Überwachungsraum ohne Heizungsregelung: Raumklima misst, warnt und berichtet, fasst aber keinen Sollwert an.",
      "Monitoring room without heating control: Raumklima measures, warns and reports but never touches a setpoint.",
      "Pièce de surveillance sans régulation : Raumklima mesure, avertit et rapporte sans toucher à une consigne."
    ],
    "Wer wohnt hier?": [
      "Die Personen, deren Handys zählen. Ist keine davon in der Wohnungs-Zone, gilt die Wohnung nach der Wartezeit als leer und Raumklima senkt ab. Personen legst du in Home Assistant unter Einstellungen → Personen an und verknüpfst dort das Handy (Home-Assistant-App).",
      "The people whose phones count. If none of them is in the home zone, the home counts as empty after the waiting time and Raumklima lowers the temperature. People are created in Home Assistant under Settings → People, where you also link their phone (Home Assistant app).",
      "Les personnes dont les téléphones comptent. Si aucune n’est dans la zone du logement, celui-ci est considéré comme vide après le délai d’attente et Raumklima abaisse la température. Les personnes se créent dans Home Assistant sous Paramètres → Personnes, où l’on associe aussi le téléphone (application Home Assistant)."
    ],
    "Wohnung (Zone)": [
      "Der Bereich auf der Karte, der als „zu Hause“ gilt. Meist „Home“; bei mehreren Wohnungen je Wohnung eine eigene Zone (Einstellungen → Bereiche & Zonen).",
      "The area on the map that counts as “home”. Usually “Home”; with several homes, one zone per home (Settings → Areas & zones).",
      "La zone sur la carte qui compte comme « à la maison ». Le plus souvent « Home » ; avec plusieurs logements, une zone par logement (Paramètres → Pièces & zones)."
    ],
    "Absenken nach": [
      "So lange muss die Wohnung leer sein, bevor abgesenkt wird – damit kurz Brötchen holen nichts auslöst. 30 Minuten sind ein guter Wert.",
      "How long the home must be empty before lowering – so that popping out for bread doesn't trigger anything. 30 minutes is a good value.",
      "Durée pendant laquelle le logement doit être vide avant d’abaisser – pour qu’aller chercher du pain ne déclenche rien. 30 minutes est une bonne valeur."
    ],
    "„Länger weg“ ab": [
      "Nach so vielen Stunden ohne jemanden wird von „kurz weg“ auf „länger weg“ umgeschaltet – dann wird tiefer abgesenkt (z. B. über Nacht weg oder auf Reisen).",
      "After this many hours without anyone home, “briefly away” switches to “away longer” and the temperature is lowered further (e.g. away overnight or travelling).",
      "Après autant d’heures sans personne, on passe de « brève absence » à « absent longtemps » – l’abaissement est alors plus fort (p. ex. absent la nuit ou en voyage)."
    ],
    "Vorheizen ab": [
      "Kommt jemand näher als diese Entfernung, wird schon vorgeheizt, damit es bei der Ankunft warm ist. Zusätzlich heizt Raumklima nach der gelernten Aufheizzeit vor. 0 schaltet das Vorheizen nach Entfernung aus.",
      "When someone gets closer than this distance, heating starts early so it is warm on arrival. Raumklima also preheats based on the learned heat-up time. 0 turns distance-based preheating off.",
      "Quand quelqu’un s’approche à moins de cette distance, le préchauffage commence pour qu’il fasse chaud à l’arrivée. Raumklima préchauffe aussi selon le temps de montée en température appris. 0 désactive le préchauffage par la distance."
    ],
    "Präsenzmelder zählen": [
      "Sieht ein Präsenzmelder in einem Raum jemanden, gilt die Wohnung als bewohnt – auch wenn alle Handys weg sind (Besuch, Kinder ohne Handy). „Nur mmWave“ ist der sichere Standard, weil Bewegungsmelder (PIR) auch auf Haustiere reagieren. Im Urlaub zählen Melder nie.",
      "If a presence sensor sees someone in a room, the home counts as occupied – even when all phones are away (visitors, children without a phone). “mmWave only” is the safe default because motion sensors (PIR) also react to pets. During vacation sensors never count.",
      "Si un détecteur de présence voit quelqu’un dans une pièce, le logement est considéré comme occupé – même si tous les téléphones sont partis (invités, enfants sans téléphone). « mmWave uniquement » est le réglage sûr par défaut, car les détecteurs de mouvement (PIR) réagissent aussi aux animaux. En vacances, les détecteurs ne comptent jamais."
    ],
    "Urlaub": [
      "Senkt sofort tief ab („länger weg“), egal wo die Handys sind. Endet automatisch, sobald jemand nach Hause kommt.",
      "Lowers the temperature right away (“away longer”), no matter where the phones are. Ends automatically as soon as someone comes home.",
      "Abaisse fortement tout de suite (« absent longtemps »), où que soient les téléphones. Se termine automatiquement dès que quelqu’un rentre."
    ],
    "Gäste da": [
      "Solange an, wird nicht abgesenkt – auch wenn alle Bewohner weg sind. Praktisch, wenn Besuch ohne Handy in Home Assistant da ist.",
      "While on, nothing is lowered – even if all residents are away. Handy when visitors without a phone in Home Assistant are staying.",
      "Tant qu’il est activé, rien n’est abaissé – même si tous les habitants sont partis. Pratique quand des invités sans téléphone dans Home Assistant sont présents."
    ],
    "Kalender": [
      "Ein Kalender aus Home Assistant. Läuft gerade ein Termin mit einem der Urlaubs-Wörter im Titel, wirkt er wie der Urlaubsschalter; mit einem der Zuhause-Wörter wie „Gäste da“.",
      "A calendar from Home Assistant. If an event with one of the vacation words in its title is running, it acts like the vacation switch; with one of the at-home words like “guests”.",
      "Un calendrier de Home Assistant. Si un événement contenant l’un des mots « vacances » est en cours, il agit comme l’interrupteur Vacances ; avec l’un des mots « à la maison », comme « Invités présents »."
    ],
    "… wie Urlaub": [
      "Wörter im Termintitel, die „verreist“ bedeuten, durch Komma getrennt. Groß-/Kleinschreibung egal.",
      "Words in the event title that mean “travelling”, separated by commas. Case doesn't matter.",
      "Mots du titre d’un événement qui signifient « en voyage », séparés par des virgules. Majuscules/minuscules indifférentes."
    ],
    "… jemand bleibt zu Hause": [
      "Wörter im Termintitel, bei denen nicht abgesenkt werden soll, z. B. Homeoffice – auch wenn das Handy kurz woanders ist.",
      "Words in the event title for which nothing should be lowered, e.g. home office – even if the phone is briefly elsewhere.",
      "Mots du titre d’un événement pour lesquels il ne faut pas abaisser, p. ex. télétravail – même si le téléphone est brièvement ailleurs."
    ],
    "Betriebsart": [
      "Automatisch: geheizt wird nur, wenn es draußen kalt genug ist (Heizgrenze, Heizsaison, Kälteeinbruch). Immer heizen: ganzjährig. Heizpause: nie – außer ein Raum fällt unter die Sicherung.",
      "Automatic: heating only when it is cold enough outside (heating limit, season, cold snap). Always heat: all year. Heating pause: never – unless a room drops below the safety minimum.",
      "Automatique : chauffe seulement quand il fait assez froid dehors (seuil de chauffage, saison, vague de froid). Toujours chauffer : toute l’année. Chauffage en pause : jamais – sauf si une pièce descend sous le minimum de sécurité."
    ],
    "Heizgrenze": [
      "Liegt das Tagesmittel draußen (gemessen + Vorhersage) über diesem Wert, braucht das Haus keine Heizung – Raumklima macht Pause. 15 °C passt für die meisten Häuser; gut gedämmt eher 12–14 °C.",
      "If the daily mean outside (measured + forecast) is above this value, the building needs no heating and Raumklima pauses. 15 °C suits most homes; well insulated rather 12–14 °C.",
      "Si la moyenne journalière extérieure (mesurée + prévue) dépasse cette valeur, la maison n’a pas besoin de chauffage – Raumklima fait une pause. 15 °C convient à la plupart des maisons ; bien isolée plutôt 12–14 °C."
    ],
    "Heizsaison": [
      "Der Zeitraum, in dem normalerweise geheizt wird (Monat-Tag). Außerhalb wird nur bei einem Kälteeinbruch geheizt. Am Tag nach dem Ende kommt auch der Saisonbericht.",
      "The period in which you normally heat (month-day). Outside of it, heating only runs during a cold snap. The day after it ends, the season report is created.",
      "Période où l’on chauffe normalement (mois-jour). En dehors, on ne chauffe qu’en cas de vague de froid. Le lendemain de la fin arrive aussi le rapport de saison."
    ],
    "Kälteeinbruch unter": [
      "Ist es außerhalb der Heizsaison 3 Tage lang kälter als dieser Wert, wird trotzdem geheizt – z. B. bei einem kalten Mai.",
      "If it is colder than this for 3 days outside the heating season, heating runs anyway – e.g. in a cold May.",
      "S’il fait plus froid que cette valeur pendant 3 jours hors saison, on chauffe quand même – p. ex. lors d’un mois de mai froid."
    ],
    "Sicherung": [
      "Fällt ein Raum während der Heizpause unter diese Temperatur, heizt er trotzdem – Schutz vor Auskühlen und Schimmel.",
      "If a room drops below this temperature during the heating pause, it heats anyway – protection against cooling down and mould.",
      "Si une pièce descend sous cette température pendant la pause de chauffage, elle chauffe quand même – protection contre le refroidissement et les moisissures."
    ],
    "Frostnacht: weniger absenken": [
      "Sagt die Vorhersage −5 °C oder kälter, wird bei Abwesenheit nur halb so tief abgesenkt. So kühlen die Wände nicht zu stark aus und der Raum ist schneller wieder warm.",
      "If the forecast says −5 °C or colder, setback during absence is only half as deep. Walls don't cool down too much and the room warms up faster.",
      "Si la prévision annonce −5 °C ou moins, l’abaissement en cas d’absence est réduit de moitié. Les murs refroidissent moins et la pièce se réchauffe plus vite."
    ],
    "Sommerpflege Ventile": [
      "Im Sommer öffnet Raumklima mittwochs um 11 Uhr die Ventile kurz ganz, damit sie nicht festsitzen.",
      "In summer Raumklima briefly opens the valves fully on Wednesdays at 11:00 so they don't get stuck.",
      "En été, Raumklima ouvre brièvement les vannes en grand le mercredi à 11 h pour qu’elles ne se grippent pas."
    ],
    "Heute heizen": [
      "Für milde, aber kühle Tage: heizt 24 Stunden lang, auch wenn die Heizgrenze eigentlich eine Pause vorsieht.",
      "For mild but chilly days: heats for 24 hours even though the heating limit would normally pause.",
      "Pour les jours doux mais frais : chauffe pendant 24 heures, même si le seuil de chauffage prévoit une pause."
    ],
    "Zeiten lernen": [
      "Raumklima merkt sich, wann ihr ins Bett geht und aufsteht (Nachtlüften, Licht aus/an) und passt Ruhezeit und Nachtlüften daran an – verlängert sie nur, verkürzt sie nie.",
      "Raumklima learns when you go to bed and get up (night airing, lights off/on) and adjusts quiet hours and night airing – it only extends them, never shortens.",
      "Raumklima retient quand vous allez au lit et vous levez (aération nocturne, lumières éteintes/allumées) et adapte les heures calmes et l’aération nocturne – il les prolonge seulement, ne les raccourcit jamais."
    ],
    "Feiertage": [
      "Dein Bundesland: Die Nacht vor einem Feiertag gilt dann wie Wochenende (längere Ruhezeit am Morgen).",
      "Your German state: the night before a public holiday then counts like a weekend (longer quiet hours in the morning).",
      "Votre Land (Allemagne) : la nuit précédant un jour férié compte alors comme un week-end (heures calmes plus longues le matin)."
    ],
    "Schlaf-Signale": [
      "Lampen oder Schalter, an denen Raumklima den Schlaf erkennt: abends alle aus = ins Bett, morgens eins an = aufgestanden.",
      "Lights or switches Raumklima uses to detect sleep: all off in the evening = bedtime, one on in the morning = up.",
      "Lampes ou interrupteurs qui permettent à Raumklima de reconnaître le sommeil : tout éteint le soir = coucher, un allumé le matin = levé."
    ],
    "Name der Wohnung": [
      "Erscheint im Umschalter oben im Dashboard und in Nachrichten – wichtig, wenn du mehrere Wohnungen hast.",
      "Shown in the switcher at the top of the dashboard and in messages – important if you have several homes.",
      "Apparaît dans le sélecteur en haut du tableau de bord et dans les messages – important si vous avez plusieurs logements."
    ],
    "Dashboard": [
      "Pfad des Raumklima-Dashboards dieser Wohnung. Antippen einer Live-Aktivität oder eines Berichts öffnet diese Seite.",
      "Path of this home's Raumklima dashboard. Tapping a live activity or a report opens this page.",
      "Chemin du tableau de bord Raumklima de ce logement. Toucher une activité en direct ou un rapport ouvre cette page."
    ],
    "Bauart": [
      "Wie gut die Außenwände dämmen. Daraus berechnet der Schimmelschutz, wie kalt die kälteste Wandstelle wird – bei einem unsanierten Altbau wird deshalb weniger abgesenkt.",
      "How well the outer walls insulate. Mould protection uses this to calculate how cold the coldest spot on the wall gets – an unrenovated old building is lowered less.",
      "Qualité d’isolation des murs extérieurs. La protection contre les moisissures en déduit la température du point le plus froid du mur – dans un ancien bâtiment non rénové, l’abaissement est donc plus faible."
    ],
    "Heizkosten pro Jahr": [
      "Optional: deine Heizkosten pro Jahr laut Abrechnung. Nur für den PDF-Bericht – er rechnet die Ersparnis grob in Euro um und zeigt, was 1 °C weniger im Jahr bringt. Leer lassen = keine Euro-Angaben.",
      "Optional: your yearly heating costs from your bill. Only for the PDF report – it roughly converts savings into euros and shows what 1 °C less saves per year. Leave empty = no euro figures.",
      "Facultatif : vos coûts de chauffage annuels d’après la facture. Uniquement pour le rapport PDF – il convertit grossièrement l’économie en euros et montre ce que rapporte 1 °C de moins par an. Laisser vide = pas de montants en euros."
    ],
    "Ruhezeit": [
      "In dieser Zeit kommen Nachrichten leise an und es gibt keine Sprachansagen. Nur Dringendes ist laut: Raum kühlt aus, Fenster offen während niemand da ist, Thermostat reagiert nicht.",
      "During this time messages arrive silently and there are no voice announcements. Only urgent ones are loud: room cooling down, window open while nobody is home, thermostat not responding.",
      "Pendant cette période, les messages arrivent en silence et il n’y a pas d’annonces vocales. Seules les urgences sont sonores : pièce qui se refroidit, fenêtre ouverte en l’absence de tous, thermostat qui ne répond pas."
    ],
    "Wochenende bis": [
      "Am Wochenende endet die Ruhezeit erst zu dieser Uhrzeit – zum Ausschlafen.",
      "On weekends quiet hours end only at this time – for sleeping in.",
      "Le week-end, les heures calmes ne se terminent qu’à cette heure – pour faire la grasse matinée."
    ],
    "Nachtlüften": [
      "Wird ein Schlafzimmerfenster in diesem Zeitfenster geöffnet, gilt es als „Schlafen bei offenem Fenster“: keine Lüft-Hinweise, die Heizung wartet bis zum Schließen, morgens ein Gruß.",
      "If a bedroom window is opened in this time window, it counts as “sleeping with the window open”: no airing notices, heating waits until it is closed, a good-morning message.",
      "Si une fenêtre de chambre est ouverte pendant cette plage, cela compte comme « dormir fenêtre ouverte » : pas de rappels d’aération, le chauffage attend la fermeture, un bonjour le matin."
    ],
    "… leise warnen unter": [
      "Wird es beim Schlafen mit offenem Fenster kälter als dieser Wert, kommt einmal pro Nacht eine leise Warnung.",
      "If it gets colder than this while sleeping with the window open, a quiet warning is sent once per night.",
      "S’il fait plus froid que cette valeur en dormant fenêtre ouverte, une alerte discrète est envoyée une fois par nuit."
    ],
    "Erinnern alle": [
      "Besteht ein Problem weiter (z. B. Fenster offen, Raum kühlt aus), erinnert Raumklima in diesem Abstand – höchstens einige Male.",
      "If a problem persists (e.g. window open, room cooling down), Raumklima reminds you at this interval – only a few times.",
      "Si un problème persiste (p. ex. fenêtre ouverte, pièce qui se refroidit), Raumklima rappelle à cet intervalle – quelques fois au maximum."
    ],
    "Wetterquelle": [
      "Woher die Außentemperatur und die Vorhersage kommen. Am besten ein Wetterdienst mit Vorhersage, z. B. weather.forecast_home – nötig für Heizgrenze, Lüftdauer, Sonnenseite und Frostnacht.",
      "Where the outdoor temperature and forecast come from. Ideally a weather service with a forecast, e.g. weather.forecast_home – needed for heating limit, airing time, sunny side and frost nights.",
      "D’où viennent la température extérieure et la prévision. Idéalement un service météo avec prévision, p. ex. weather.forecast_home – nécessaire pour le seuil de chauffage, la durée d’aération, le côté ensoleillé et les nuits de gel."
    ],
    "Fehler auch in der HA-Glocke": [
      "Reagiert ein Thermostat nicht, erscheint zusätzlich eine Meldung in der Glocke von Home Assistant.",
      "If a thermostat doesn't respond, an additional notification appears in Home Assistant's bell.",
      "Si un thermostat ne répond pas, une notification apparaît en plus dans la cloche de Home Assistant."
    ],
    "PDF-Berichte": [
      "Welche Berichte automatisch als PDF entstehen: Woche (sonntags 18 Uhr), Monat (am 1.), Heizsaison (nach dem Saisonende). Sie kommen als Push an alle mit „Wochenbericht“ und stehen im Reiter Bericht zum Herunterladen.",
      "Which reports are created automatically as PDF: week (Sundays 18:00), month (on the 1st), heating season (after it ends). They are pushed to everyone with “weekly report” and listed in the Report tab for download.",
      "Quels rapports sont créés automatiquement en PDF : semaine (dimanche 18 h), mois (le 1er), saison de chauffage (après sa fin). Ils sont envoyés en push à tous ceux qui ont « Rapport hebdomadaire » et sont téléchargeables dans l’onglet Rapport."
    ],
    "PDF per E-Mail": [
      "Schickt jeden PDF-Bericht zusätzlich als Mail-Anhang. Einmal darunter „E-Mail einrichten“ aufklappen: Anbieter wählen (füllt Server und Port aus), Benutzer, Passwort und Empfänger eintragen, „Zugang prüfen“ und dann „Speichern & Test-Mail senden“ – danach ist der Schalter an. Bei Gmail, iCloud und Outlook braucht es ein App-Passwort.",
      "Also sends every PDF report as an email attachment. Open “Set up email” below once: pick your provider (fills in server and port), enter user, password and recipients, “Check login”, then “Save & send test email” – the switch is then on. Gmail, iCloud and Outlook need an app password.",
      "Envoie en plus chaque rapport PDF en pièce jointe. Ouvrez une fois « Configurer l’e-mail » ci-dessous : choisissez le fournisseur (renseigne serveur et port), saisissez utilisateur, mot de passe et destinataires, « Vérifier l’accès » puis « Enregistrer & envoyer un e-mail de test » – l’interrupteur est alors activé. Gmail, iCloud et Outlook nécessitent un mot de passe d’application."
    ],
    "Test": [
      "Erstellt jetzt einen Wochenbericht und schickt ihn an alle Empfänger und per E-Mail.",
      "Creates a weekly report now and sends it to all recipients and by email.",
      "Crée maintenant un rapport hebdomadaire et l’envoie à tous les destinataires et par e-mail."
    ],
    "Wunschtemperatur": [
      "So warm soll der Raum sein, wenn jemand da ist. Gemessen wird mit dem Raumfühler, nicht am Heizkörper. Jedes Grad weniger spart etwa 6 % Heizenergie.",
      "How warm the room should be when someone is home. Measured with the room sensor, not at the radiator. Each degree less saves about 6 % heating energy.",
      "La température voulue dans la pièce quand quelqu’un est là. Mesurée avec la sonde de la pièce, pas au radiateur. Chaque degré de moins économise environ 6 % d’énergie de chauffage."
    ],
    "Raumtyp": [
      "Setzt passende Standardwerte für Wunschtemperatur, Feuchtegrenze, Mindesttemperatur und Absenkung (Bad wärmer und feuchter, Schlafzimmer kühler). Beim Wechsel startet der Raum kurz neu.",
      "Sets suitable defaults for desired temperature, humidity limit, minimum temperature and setback (bathroom warmer and more humid, bedroom cooler). Changing it restarts the room briefly.",
      "Définit des valeurs par défaut adaptées pour la température souhaitée, le seuil d’humidité, la température minimale et l’abaissement (salle de bain plus chaude et plus humide, chambre plus fraîche). En cas de changement, la pièce redémarre brièvement."
    ],
    "Wohnung": [
      "Zu welcher Wohnung der Raum gehört – bestimmt Bewohner, Zone, Empfänger und Bericht.",
      "Which home the room belongs to – determines residents, zone, recipients and report.",
      "Le logement auquel appartient la pièce – détermine habitants, zone, destinataires et rapport."
    ],
    "Außentemperatur von": [
      "Woher die Außentemperatur kommt. Eine eigene Wetterstation ist genauer als der Wetterdienst; die Vorhersage für die Heizgrenze kommt weiterhin vom Wetterdienst.",
      "Where the outdoor temperature comes from. Your own station is more accurate than a weather service; the forecast for the heating limit still comes from the service.",
      "D'où vient la température extérieure. Votre propre station est plus précise qu'un service météo ; la prévision pour la limite de chauffe vient toujours du service."
    ],
    "Nur an anwesende Personen": [
      "Lüft-Hinweise gehen nur an Handys von Personen, die laut Ortung zu Hause sind. Dringende Meldungen (Fenster offen bei Abwesenheit, Frost, Ausfall) gehen weiter an alle.",
      "Airing hints go only to phones of people who are home according to tracking. Urgent messages (window open while away, frost, failure) still go to everyone.",
      "Les rappels d'aération ne vont qu'aux téléphones des personnes présentes selon la localisation. Les messages urgents (fenêtre ouverte en absence, gel, panne) vont toujours à tout le monde."
    ],
    "Lüftfenster": [
      "Zeiten, in denen keine Lüft-Hinweise kommen – etwa beim Training morgens. Die Regelung läuft weiter, nur die Erinnerungen schweigen.",
      "Times when no airing hints are sent – for example during morning training. Control keeps running, only the reminders stay quiet.",
      "Plages sans rappels d'aération – par exemple pendant l'entraînement du matin. La régulation continue, seuls les rappels se taisent."
    ],
    "Homeoffice": [
      "Schalter für Tage, an denen du zu Hause arbeitest. Im eingestellten Fenster heizen die gewählten Räume auf Wunschtemperatur, der Zeitplan ist so lange ausgesetzt — danach läuft er weiter. Ein Kalendertermin mit „Homeoffice“ schaltet dasselbe automatisch.",
      "Switch for days you work from home. During the set window the selected rooms heat to the wish temperature and the schedule is paused — afterwards it runs again. A calendar event containing “home office” switches the same on automatically.",
      "Interrupteur pour les jours de télétravail. Pendant la plage définie, les pièces choisies chauffent à la consigne et la plage horaire est suspendue — ensuite elle reprend. Un rendez-vous contenant « télétravail » active la même chose automatiquement."
    ],
    "Nachtruhe über Entität": [
      "Ein vorhandener HA-Schalter (input_boolean, switch) schaltet die Nachtruhe mit. An = Nachtabsendung gilt, aus = normaler Zeitplan. Der eingebaute Schalter bleibt zusätzlich nutzbar.",
      "An existing HA switch (input_boolean, switch) also turns night mode on. On = night setback applies, off = normal schedule. The built-in switch keeps working too.",
      "Un interrupteur HA existant (input_boolean, switch) active aussi le mode nuit. Activé = l’abaissement nocturne s’applique, désactivé = plage horaire normale. L’interrupteur intégré reste utilisable."
    ],
    "Homeoffice über Entität": [
      "Ein vorhandener HA-Schalter schaltet Homeoffice mit — wie der eingebaute Schalter, also ohne Anwesenheitsprüfung. Gedacht für Wandtaster oder ein Dashboard-Kachel.",
      "An existing HA switch also turns home office on — like the built-in switch, so without the presence check. Meant for wall buttons or a dashboard tile.",
      "Un interrupteur HA existant active aussi le télétravail — comme l’interrupteur intégré, donc sans contrôle de présence. Prévoir pour boutons muraux ou une tuile du tableau de bord."
    ],
    "Bei Anwesenheit": [
      "Temperatur, auf die der Raum geht, solange ein Präsenzmelder jemanden im Raum sieht — z. B. Arbeitszimmer 19 °C, bei Anwesenheit 21 °C. 0 °C schaltet die Regel aus; danach gilt wieder Zeitplan bzw. Absenkung.",
      "Temperature the room heats to while a presence sensor sees someone in it — e.g. office 19 °C, 21 °C when present. 0 °C turns the rule off; the schedule or setback applies again.",
      "Température vers laquelle la pièce chauffe tant qu’un capteur de présence voit quelqu’un — p. ex. bureau 19 °C, 21 °C en cas de présence. 0 °C désactive la règle ; la plage horaire ou l’abaissement reprend."
    ],
    "Homeoffice nur wenn jemand da": [
      "Aus dem Kalender gilt Homeoffice nur, wenn die Ortung jemanden zu Hause sieht — ein Termin allein reicht nicht, man kann ja im Büro sitzen. Der Schalter „Homeoffice“ wird bewusst gedrückt und heizt auch ohne Ortung. Ausschalten, wenn der Kalender allein entscheiden soll.",
      "From the calendar, home office only applies when presence tracking sees someone at home — an event alone is not enough, you may be at the office. The “Home office” switch is pressed on purpose and heats without presence tracking. Turn this off if the calendar should decide alone.",
      "Depuis le calendrier, le télétravail ne s’applique que si la détection voit quelqu’un à la maison — un rendez-vous seul ne suffit pas, on peut être au bureau. L’interrupteur « Télétravail » est actionné volontairement et chauffe sans détection. Désactiver si le calendrier doit décider seul."
    ],
    "Homeoffice-Fenster": [
      "Von wann bis wann Homeoffice gilt. Außerhalb dieser Zeit verhält sich der Raum wie immer — der Zeitplan gilt.",
      "When home office applies. Outside this window the room behaves as usual — the schedule applies.",
      "De quand à quand le télétravail s’applique. En dehors de cette plage, la pièce se comporte comme d’habitude — la plage horaire s’applique."
    ],
    "Homeoffice gilt für": [
      "Nur diese Räume werden im Homeoffice-Fenster auf Wunsch geheizt — gedacht für Büro und Wohnzimmer. Ohne Auswahl gilt es für alle Räume mit Thermostat.",
      "Only these rooms are heated to the wish during the home office window — meant for office and living room. Without a selection it applies to all rooms with a thermostat.",
      "Seules ces pièces sont chauffées à la consigne pendant la plage de télétravail — prévu pour le bureau et le salon. Sans sélection, cela s’applique à toutes les pièces avec thermostat."
    ],
    "Vorheizen": [
      "Ob und wie früh der Raum vor dem nächsten Zeitfenster warm wird. „Automatisch“ startet so früh, wie die gelernte Aufheizzeit es verlangt – bei langsam warm werdenden Räumen auch mitten in der Nacht.",
      "Whether and how early the room warms up before the next schedule window. “Automatic” starts as early as the learned heat-up time requires – for slow rooms that can be in the middle of the night.",
      "Si et à quel point la pièce chauffe avant la prochaine plage. « Automatique » démarre aussi tôt que le temps de chauffe appris l’exige – pour les pièces lentes, parfois en pleine nuit."
    ],
    "… nicht vor": [
      "Frühestens ab dieser Uhrzeit wird vorgeheizt. Zum Beginn des Zeitfensters kann der Raum dann noch etwas kälter sein.",
      "Preheating starts no earlier than this time. At the start of the schedule the room may still be a little cooler.",
      "Le préchauffage ne commence pas avant cette heure. Au début de la plage, la pièce peut être encore un peu plus froide."
    ],
    "… höchstens": [
      "Höchstens so viele Minuten vor dem Zeitfenster beginnt das Vorheizen. Reicht die Zeit nicht, ist der Raum zum Start noch nicht ganz warm.",
      "Preheating starts at most this many minutes before the schedule. If that is not enough, the room is not fully warm at the start.",
      "Le préchauffage commence au plus tôt ce nombre de minutes avant la plage. Si ce n’est pas assez, la pièce n’est pas tout à fait chaude au début."
    ],
    "Urlaub automatisch ab": [
      "Sind alle Bewohner weiter als diese Entfernung entfernt und das länger als die eingestellte Dauer, gilt Urlaub (Frostschutz). 0 schaltet die Erkennung aus.",
      "If all residents are farther away than this and for longer than the set duration, vacation applies (frost protection). 0 turns detection off.",
      "Si tous les habitants sont plus loin que cette distance et plus longtemps que la durée définie, les vacances s’appliquent (hors gel). 0 désactive la détection."
    ],
    "… nach": [
      "So lange müssen alle schon weit weg sein. Ein Tagesausflug löst damit keinen Urlaub aus.",
      "All residents must have been that far away for this long. A day trip does not trigger vacation.",
      "Tous les habitants doivent être aussi loin depuis ce délai. Une excursion d’un jour ne déclenche pas de vacances."
    ],
    "Gilt für Personen": [
      "Der Raum wird nur warm gehalten, wenn eine dieser Personen zu Hause ist – gedacht für Kinder- und Gästezimmer. Ohne Auswahl gilt der Raum allen Bewohnern.",
      "The room is only kept warm while one of these people is home – meant for children’s and guest rooms. Without a selection the room applies to all residents.",
      "La pièce n’est chauffée que si l’une de ces personnes est présente – prévu pour les chambres d’enfants et d’amis. Sans sélection, la pièce concerne tous les habitants."
    ],
    "Nachtabsendung": [
      "Ob dieser Raum während der Ruhezeit abgesenkt wird. „Automatisch“ nimmt nur Schlafzimmer und selten genutzte Räume, „Immer“ auch Wohnräume, „Nie“ keinen.",
      "Whether this room is set back during quiet hours. “Automatic” covers bedrooms and rarely used rooms, “Always” also living rooms, “Never” none.",
      "Si cette pièce est abaissée pendant les heures calmes. « Automatique » ne concerne que les chambres et pièces peu utilisées, « Toujours » aussi les séjours, « Jamais » aucune."
    ],
    "Absenkwert nachts": [
      "Auf welche Temperatur die Nachtabsendung geht: kurz weg, länger weg oder Frostschutz. Gilt für die Ruhezeit und für den Schalter „Nachtruhe“.",
      "Which temperature the night setback uses: short away, longer away or frost protection. Applies to quiet hours and to the “Night mode” switch.",
      "Température utilisée pour la réduction nocturne : absence courte, absence prolongée ou hors gel. Vaut pour les heures calmes et l'interrupteur « Mode nuit »."
    ],
    "Sonnenseite": [
      "Für Räume mit großen Süd- oder Westfenstern: Ist Sonne vorhergesagt und der Raum schon fast warm, heizt er 1 °C weniger – die Sonne erledigt den Rest.",
      "For rooms with large south or west windows: if sun is forecast and the room is almost warm, it heats 1 °C less – the sun does the rest.",
      "Pour les pièces avec de grandes fenêtres au sud ou à l’ouest : si le soleil est prévu et que la pièce est presque chaude, elle chauffe 1 °C de moins – le soleil fait le reste."
    ],
    "Sonne kommt aus": [
      "Die Himmelsrichtung, in die die Fenster dieses Raums zeigen – also die Seite, auf der die meiste Glasfläche sitzt. Mit dieser Angabe zählt nur Sonne, die nach Sonnenstand (Azimut und Höhe) wirklich durchs Fenster kommt: ein Westzimmer reagiert erst nachmittags, ein Ostzimmer nur morgens. Die Etage spielt keine Rolle, der Sonnenstand ist in jeder Höhe gleich – unterschiedlich ist nur, was im Weg steht (Haus, Baum, Balkon, tiefes Gewände), und das ist bewusst nicht modelliert. Dachfenster passen nicht in dieses Schema: dort lieber leer lassen. Ohne Angabe zählt jede sonnige Stunde der Vorhersage.",
      "The compass direction the windows of this room face – the side with the most glass. With this value, only sun that really comes through the window counts, judged by the sun’s azimuth and elevation: a west room reacts in the afternoon, an east room only in the morning. The floor does not matter, the sun’s position is the same at any height – only what is in the way differs (building, tree, balcony, deep reveal), and that is deliberately not modelled. Roof windows do not fit this scheme: better leave it empty there. Without a value, every sunny hour in the forecast counts.",
      "L’orientation vers laquelle donnent les fenêtres de cette pièce – le côté avec le plus de vitrage. Avec cette valeur, seul le soleil qui entre vraiment par la fenêtre compte, d’après l’azimut et la hauteur du soleil : une pièce à l’ouest réagit l’après-midi, une pièce à l’est seulement le matin. L’étage n’a pas d’importance, la position du soleil est identique à toute hauteur – seule diffère la présence d’obstacles (bâtiment, arbre, balcon, ébrasement profond), volontairement non modélisée. Les fenêtres de toit ne correspondent pas à ce schéma : mieux vaut laisser vide. Sans valeur, chaque heure ensoleillée de la prévision compte."
    ],
    "Schichtdienst": [
      "Lernt Bett- und Aufstehzeiten je Wochentag, nicht nur nach Werktag und Wochenende. Eingeschaltet werden auch Tagschlaf-Zeiten erkannt: ins Bett bis 09:00, aufstehen bis 17:00 – für Nachtschicht und Wechselschicht.",
      "Learns bedtime and getting-up times per weekday, not just weekday versus weekend. When on, daytime sleep is detected too: bedtime up to 09:00, getting up up to 17:00 – for night and rotating shifts.",
      "Apprend le coucher et le lever par jour de la semaine, pas seulement semaine et week-end. Activé, le sommeil de jour est aussi détecté : coucher jusqu’à 09:00, lever jusqu’à 17:00 – pour le travail de nuit et en équipes."
    ],
    "Ruhezeit senkt ab": [
      "Während der Ruhezeit werden Schlafzimmer und selten genutzte Räume auf die Absenkung gebracht – auch wenn jemand zu Hause ist. So bleibt die Heizung aus, während nach der Nachtschicht geschlafen wird. Ein Zeitfenster und der Regler am Thermostat gehen vor.",
      "During quiet time, bedrooms and rarely used rooms are set back to the setback temperature – even when somebody is at home. So the heating stays off while you sleep after a night shift. A time window and the dial on the thermostat take precedence.",
      "Pendant l’heure de repos, les chambres et les pièces peu utilisées passent à la température d’abaissement – même si quelqu’un est à la maison. Le chauffage reste donc arrêté pendant le sommeil après une nuit de travail. Une plage horaire et le bouton du thermostat restent prioritaires."
    ],
    "Standort der Wohnung": [
      "Die echten Koordinaten dieser Wohnung. Leer lassen ist der Normalfall: dann gilt der Standort der Zone, die oben eingestellt ist – und ohne Zone der Standort von Home Assistant (beides steht unter dem Feld). Nur wenn die Wohnung woanders liegt als ihre Zone, hier Koordinaten eintragen; daraus rechnet Raumklima den Sonnenstand für den Sonnenabzug nach Fensterausrichtung. Der Knopf „von HA“ übernimmt die Home-Assistant-Werte sichtbar, das ✕ leert die Felder wieder.",
      "The real coordinates of this home. Leaving it empty is the normal case: the zone set above defines the location – and without a zone, Home Assistant’s location applies (both shown below the field). Only if the home sits elsewhere than its zone, enter coordinates here; Raumklima computes the sun’s position from them for the window-based solar gain. The “from HA” button copies Home Assistant’s values, ✕ clears the fields again.",
      "Les vraies coordonnées de ce logement. Laisser vide est le cas normal : c’est la zone réglée plus haut qui définit l’emplacement – et sans zone, celui de Home Assistant (les deux sont indiqués sous le champ). Si le logement se trouve ailleurs que sa zone, indiquez ici des coordonnées ; Raumklima en calcule la position du soleil pour l’apport solaire selon l’orientation des fenêtres. Le bouton « de HA » reprend les valeurs de Home Assistant, ✕ vide les champs."
    ],
    "Zeitfenster": [
      "Ein eigenes Zeitfenster für diesen Raum: Wochentage (keine Auswahl = jeden Tag), von/bis und Zieltemperatur, auch über Mitternacht. Es setzt nur den Sollwert – Fenster, Frost, Schimmel und Abwesenheit bleiben vorrangig, und bei gelerntem Raum wird rechtzeitig vorgeheizt.",
      "A time window for this room: weekdays (none selected = every day), from/to and target temperature, also across midnight. It only sets the target – windows, frost, mould and absence stay in charge, and a room with a learned heat-up rate starts preheating in time.",
      "Une plage horaire pour cette pièce : jours de la semaine (aucun = tous les jours), de/à et température cible, aussi après minuit. Elle ne règle que la consigne – fenêtre, gel, moisissures et absence restent prioritaires, et une pièce dont la vitesse de chauffe est apprise préchauffe à temps."
    ],
    "Absenkung „kurz weg“": [
      "Zieltemperatur, wenn alle kurz weg sind. Nie tiefer, als der Schimmelschutz erlaubt.",
      "Target temperature when everyone is briefly away. Never lower than mould protection allows.",
      "Température cible quand tout le monde est brièvement absent. Jamais plus bas que ce que permet la protection contre les moisissures."
    ],
    "Absenkung „länger weg“": [
      "Zieltemperatur bei längerer Abwesenheit oder Urlaub. Feuchte Räume bleiben automatisch wärmer (Schimmelschutz).",
      "Target temperature during longer absence or vacation. Humid rooms automatically stay warmer (mould protection).",
      "Température cible en cas d’absence prolongée ou de vacances. Les pièces humides restent automatiquement plus chaudes (protection contre les moisissures)."
    ],
    "Aufheizen": [
      "Wie lange der Raum braucht, um 2 °C wärmer zu werden – Raumklima lernt das aus jedem Aufheizen und heizt danach rechtzeitig vor, bevor jemand ankommt.",
      "How long the room needs to get 2 °C warmer – Raumklima learns this from every heat-up and then preheats in time before someone arrives.",
      "Temps nécessaire à la pièce pour gagner 2 °C – Raumklima l’apprend à chaque montée en température et préchauffe ensuite à temps avant l’arrivée de quelqu’un."
    ],
    "Feuchtegrenze": [
      "Ab dieser Luftfeuchte (15 Minuten lang) kommt „Bitte lüften“ – aber nur, wenn Lüften auch trocknet, die Luft draußen also trockener ist. Ändern über Geräte & Technik.",
      "From this humidity (for 15 minutes) you get “please air the room” – but only if airing actually dries, i.e. the outside air is drier. Change it under devices & technical settings.",
      "À partir de cette humidité (pendant 15 minutes) arrive « Merci d’aérer » – mais seulement si l’aération assèche vraiment, donc si l’air extérieur est plus sec. Se modifie dans Appareils & réglages techniques."
    ],
    "Feuchtefühler": [
      "Sensor für die Luftfeuchte im Raum – nötig für Lüft-Hinweise und Schimmelschutz.",
      "Sensor for the room's humidity – needed for airing notices and mould protection.",
      "Capteur d’humidité de la pièce – nécessaire pour les rappels d’aération et la protection contre les moisissures."
    ],
    "Mindesttemperatur beim Lüften": [
      "Fällt der Raum beim Lüften darunter, kommt „Raum kühlt aus – bitte schließen“.",
      "If the room drops below this while airing, you get “room cooling down – please close”.",
      "Si la pièce descend en dessous pendant l’aération, arrive « La pièce se refroidit – merci de fermer »."
    ],
    "Max. Abkühlung beim Lüften": [
      "Kühlt der Raum beim Lüften um mehr als diesen Wert ab, kommt ebenfalls „bitte schließen“ – so kühlen die Wände nicht aus.",
      "If the room cools down by more than this while airing, you also get “please close” – so the walls don't cool down.",
      "Si la pièce se refroidit de plus que cette valeur pendant l’aération, arrive aussi « merci de fermer » – pour que les murs ne refroidissent pas."
    ],
    "Jetzt": [
      "Aktuelle Feuchte und Taupunkt im Raum.",
      "Current humidity and dew point in the room.",
      "Humidité et point de rosée actuels dans la pièce."
    ],
    "Empfohlene Lüftdauer": [
      "Wie lange stoßlüften reicht – je kälter es draußen ist, desto kürzer (im Winter oft nur 5 Minuten).",
      "How long airing wide open is enough – the colder it is outside, the shorter (often only 5 minutes in winter).",
      "Durée suffisante pour aérer en grand – plus il fait froid dehors, plus elle est courte (souvent 5 minutes en hiver)."
    ],
    "Heizung bei offenem Fenster pausieren": [
      "Ist ein Fenster offen, stoppt die Heizung; danach geht es mit der vorherigen Einstellung weiter. Schalte die eingebaute Fenstererkennung des Thermostats aus, damit sich beides nicht stört.",
      "When a window is open, heating stops; afterwards it continues with the previous setting. Turn off the thermostat's built-in window detection so the two don't interfere.",
      "Si une fenêtre est ouverte, le chauffage s’arrête ; ensuite il reprend avec le réglage précédent. Désactivez la détection de fenêtre intégrée au thermostat pour éviter les conflits."
    ],
    "Pause nach": [
      "So lange muss das Fenster offen sein, bevor die Heizung pausiert – kurzes Öffnen löst nichts aus.",
      "How long the window must be open before heating pauses – briefly opening it doesn't trigger anything.",
      "Durée pendant laquelle la fenêtre doit être ouverte avant la pause du chauffage – une courte ouverture ne déclenche rien."
    ],
    "Weiter nach": [
      "So lange muss das Fenster zu sein, bevor wieder geheizt wird.",
      "How long the window must be closed before heating resumes.",
      "Durée pendant laquelle la fenêtre doit être fermée avant que le chauffage reprenne."
    ],
    "Schlafen bei offenem Fenster": [
      "Wird abends im Schlafzimmer gelüftet, gilt das als Nachtlüften: keine Lüft-Hinweise, die Heizung wartet, morgens ein Gruß. Automatisch = ja für Schlafzimmer und selten genutzte Räume.",
      "If the bedroom window is opened in the evening, it counts as night airing: no airing notices, heating waits, a good-morning message. Automatic = yes for bedrooms and rarely used rooms.",
      "Si l’on aère la chambre le soir, cela compte comme aération nocturne : pas de rappels d’aération, le chauffage attend, un bonjour le matin. Automatique = oui pour les chambres et les pièces peu utilisées."
    ],
    "Kontakte": [
      "Die Fensterkontakte dieses Raums und ihr Zustand. Ändern über Geräte & Technik.",
      "This room's window contacts and their state. Change them under devices & technical settings.",
      "Les contacts de fenêtre de cette pièce et leur état. Se modifient dans Appareils & réglages techniques."
    ],
    "Offenes Fenster an Temperatursturz erkennen": [
      "Ohne (funktionierenden) Fensterkontakt: Fällt die Temperatur in 6 Minuten um 1 °C, nimmt Raumklima ein offenes Fenster an und pausiert. Automatisch = nur, wenn kein Kontakt zuverlässig meldet.",
      "Without a (working) window contact: if the temperature drops 1 °C in 6 minutes, Raumklima assumes an open window and pauses. Automatic = only if no contact reports reliably.",
      "Sans contact de fenêtre (fonctionnel) : si la température baisse de 1 °C en 6 minutes, Raumklima suppose une fenêtre ouverte et fait une pause. Automatique = seulement si aucun contact ne signale de façon fiable."
    ],
    "Melder": [
      "Präsenz- oder Bewegungsmelder in diesem Raum. mmWave (Radar) sieht auch Stillsitzende – sehr zuverlässig. PIR sieht nur Bewegung; Raumklima wartet deshalb länger, bevor der Raum als leer gilt.",
      "Presence or motion sensors in this room. mmWave (radar) also sees people sitting still – very reliable. PIR only sees movement, so Raumklima waits longer before the room counts as empty.",
      "Détecteurs de présence ou de mouvement de cette pièce. Le mmWave (radar) voit aussi les personnes immobiles – très fiable. Le PIR ne voit que le mouvement ; Raumklima attend donc plus longtemps avant de considérer la pièce comme vide."
    ],
    "Art": [
      "Automatisch: Geräteklasse „Bewegung“ = PIR, „Anwesenheit/Belegung“ = mmWave. Stimmt das bei deinem Melder nicht, hier fest einstellen.",
      "Automatic: device class “motion” = PIR, “presence/occupancy” = mmWave. If that's wrong for your sensor, set it here.",
      "Automatique : classe d’appareil « mouvement » = PIR, « présence/occupation » = mmWave. Si cela ne correspond pas à votre détecteur, réglez-le ici."
    ],
    "Leeren Raum absenken": [
      "Ist niemand im Raum, wird er etwas kühler – kommt jemand herein, sofort wieder warm. Automatisch = nur Wohnraum, Küche und selten genutzte Räume und nur mit mmWave. Schlafzimmer und Bad bleiben warm, außer du stellst „Ja“ ein.",
      "If nobody is in the room it gets a little cooler – when someone comes in, it warms up right away. Automatic = only living room, kitchen and rarely used rooms and only with mmWave. Bedrooms and bathrooms stay warm unless you set “yes”.",
      "Quand personne n’est dans la pièce, elle devient un peu plus fraîche – quand quelqu’un entre, elle se réchauffe aussitôt. Automatique = seulement séjour, cuisine et pièces peu utilisées, et seulement avec mmWave. Chambres et salle de bain restent chaudes, sauf si vous choisissez « Oui »."
    ],
    "… wenn leer seit": [
      "So lange muss der Raum leer sein, bevor abgesenkt wird. Heizkörper reagieren träge – zu kurz spart kaum etwas.",
      "How long the room must be empty before lowering. Radiators are slow – too short saves hardly anything.",
      "Durée pendant laquelle la pièce doit être vide avant d’abaisser. Les radiateurs réagissent lentement – trop court n’économise presque rien."
    ],
    "… um": [
      "So viel kühler wird der leere Raum – nie unter „kurz weg“ und den Schimmelschutz.",
      "How much cooler the empty room gets – never below “briefly away” and mould protection.",
      "De combien la pièce vide est refroidie – jamais sous « brève absence » ni la protection contre les moisissures."
    ],
    "Lampen": [
      "Lampen, die bei Hinweisen dreimal farbig blinken und danach wieder so sind wie vorher. Nicht in der Ruhezeit, beim Nachtlüften, wenn niemand da ist oder der Raum leer ist.",
      "Lights that blink three times in colour on notices and then return to how they were. Not during quiet hours, night airing, when nobody is home or the room is empty.",
      "Lampes qui clignotent trois fois en couleur lors des remarques puis reviennent à leur état précédent. Pas pendant les heures calmes, l’aération nocturne, quand personne n’est là ou quand la pièce est vide."
    ],
    "Blinken bei": [
      "Bei welchen Hinweisen geblinkt wird: blau = bitte lüften, orange = bitte schließen/kühlt aus, grün = Luft ausgetauscht, rot = Problem mit der Heizung.",
      "Which notices make the lights blink: blue = please air, orange = please close/cooling down, green = air exchanged, red = heating problem.",
      "Pour quelles remarques les lampes clignotent : bleu = merci d’aérer, orange = merci de fermer/refroidissement, vert = air renouvelé, rouge = problème de chauffage."
    ],
    "Ausprobieren": [
      "Lässt die Lampen jetzt einmal blau blinken.",
      "Makes the lights blink blue once now.",
      "Fait clignoter les lampes une fois en bleu maintenant."
    ],
    "Hinweise für diesen Raum": [
      "Aus = dieser Raum schickt keine Lüft-Hinweise und keinen Lüft-Countdown. Geregelt wird trotzdem.",
      "Off = this room sends no airing notices and no airing countdown. It is still controlled.",
      "Désactivé = cette pièce n’envoie ni rappels d’aération ni compte à rebours. Elle reste régulée."
    ],
    "Empfänger": [
      "Wer Nachrichten bekommt, stellst du zentral unter Allgemein → Wer bekommt was ein.",
      "Who gets messages is set centrally under General → Who gets what.",
      "Qui reçoit les messages se règle de façon centrale sous Général → Qui reçoit quoi."
    ],
    "Thermostat": [
      "Das Thermostat am Heizkörper. Ändern über Geräte & Technik.",
      "The radiator thermostat. Change it under devices & technical settings.",
      "Le thermostat du radiateur. Se modifie dans Appareils & réglages techniques."
    ],
    "Weitere Thermostate": [
      "Für Räume mit mehreren Heizkörpern. Diese Thermostate bekommen dieselben Befehle wie das Haupt-Thermostat (an/aus, Preset, Sollwert) – jedes mit eigener Prüfung, eigenem Korrekturwert und eigener Fehlermeldung. Fällt eins aus, heizen die anderen weiter. Hinzufügen oder entfernen über Geräte & Technik → Zahnrad beim Raum.",
      "For rooms with several radiators. These thermostats get the same commands as the main thermostat (on/off, preset, setpoint) – each with its own check, its own correction and its own failure notice. If one fails, the others keep heating. Add or remove them under devices & technical settings → gear icon of the room.",
      "Pour les pièces avec plusieurs radiateurs. Ces thermostats reçoivent les mêmes commandes que le thermostat principal (marche/arrêt, préréglage, consigne) – chacun avec sa propre vérification, sa propre correction et sa propre alerte. Si l’un tombe en panne, les autres continuent de chauffer. Ajouter ou retirer dans Appareils & réglages techniques → roue dentée de la pièce."
    ],
    "Temperaturfühler": [
      "Der Fühler, nach dem geregelt wird – am besten in Raummitte, nicht am Heizkörper oder in der Sonne.",
      "The sensor used for control – ideally in the middle of the room, not at the radiator or in the sun.",
      "La sonde selon laquelle on régule – idéalement au milieu de la pièce, pas au radiateur ni au soleil."
    ],
    "CO₂-Sensor": [
      "Optional: ab 1000 ppm kommt „Bitte lüften“, „Luft ausgetauscht“ erst unter 800 ppm.",
      "Optional: from 1000 ppm you get “please air the room”, “air exchanged” only below 800 ppm.",
      "Facultatif : à partir de 1000 ppm arrive « Merci d’aérer », « Air renouvelé » seulement sous 800 ppm."
    ],
    "Kalibrierung": [
      "Wie das Thermostat dazu gebracht wird, die Raumtemperatur zu „sehen“: Offset (Korrekturwert am Thermostat), Sollwert-Ausgleich (Ziel am Thermostat anpassen) oder keine.",
      "How the thermostat is made to “see” the room temperature: offset (correction value on the thermostat), setpoint compensation (adjust the thermostat target) or none.",
      "Comment le thermostat est amené à « voir » la température de la pièce : décalage (valeur de correction au thermostat), compensation de consigne (adapter la cible au thermostat) ou aucune."
    ],
    "Einschalten mit": [
      "Mit welcher Betriebsart das Thermostat heizt. Automatisch meidet Modi, bei denen manche Thermostate das Ventil einfach ganz öffnen.",
      "Which mode the thermostat heats with. Automatic avoids modes in which some thermostats simply open the valve fully.",
      "Le mode avec lequel le thermostat chauffe. Automatique évite les modes où certains thermostats ouvrent simplement la vanne en grand."
    ],
    "Ausschalten über": [
      "Wie „aus“ ans Thermostat geht: Preset „aus“, HVAC „aus“ oder Minimaltemperatur – je nachdem, was dein Gerät zuverlässig kann.",
      "How “off” is sent to the thermostat: preset “off”, HVAC “off” or minimum temperature – whatever your device handles reliably.",
      "Comment « arrêt » est envoyé au thermostat : préréglage « arrêt », mode HVAC « arrêt » ou température minimale – selon ce que votre appareil gère de façon fiable."
    ],
    "Drehen am Thermostat übernehmen": [
      "Ja: Drehst du am Thermostat, wird das die neue Wunschtemperatur. Nein: Raumklima stellt den Wert zurück.",
      "Yes: turning the thermostat sets the new desired temperature. No: Raumklima resets the value.",
      "Oui : si vous tournez le thermostat, cela devient la nouvelle température souhaitée. Non : Raumklima remet la valeur."
    ],
    "Übertragung": [
      "Jeder Befehl wird nach kurzer Zeit geprüft und bei Bedarf wiederholt – gegen Funk- und VPN-Aussetzer. „Synchron“ heißt: Thermostat hat bestätigt.",
      "Every command is checked after a short time and repeated if needed – against radio and VPN drops. “In sync” means the thermostat has confirmed.",
      "Chaque commande est vérifiée peu après et répétée si nécessaire – contre les coupures radio et VPN. « Synchronisé » signifie que le thermostat a confirmé."
    ]
  };

  // src/cards/settings.js
  var RK_GROUP_OF = {
    "Wohnung": "home",
    "Alle Räume auf einen Blick": "home",
    "Heizsaison & Heizgrenze": "heating",
    "Gesundheit der Heizung": "heating",
    "Anwesenheit & Absenkung": "presence",
    "Schlafenszeiten": "presence",
    "Gebäude & Schimmelschutz": "presence",
    "Wer bekommt was": "notify",
    "Benachrichtigungen allgemein": "notify",
    "Temperatur": "room",
    "Überwachung": "room",
    "Zeitplan": "heating",
    "Thermostat & Fühler": "heating",
    "Fühler & Sensoren": "air",
    "Gesundheit": "heating",
    "Lüften & Feuchte": "air",
    "Fenster": "air",
    "Lichtsignal": "air",
    "Präsenzmelder": "presence",
    "Benachrichtigungen": "notify",
    "Darstellung": "layout",
    "Lernen & Warum": "learn"
  };
  var RK_GROUP_META = {
    home: { label: "Wohnung", icon: "mdi:home-outline" },
    room: { label: "Raum", icon: "mdi:door-open" },
    heating: { label: "Heizung", icon: "mdi:radiator" },
    air: { label: "Lüften", icon: "mdi:weather-windy" },
    presence: { label: "Anwesenheit", icon: "mdi:account-multiple-outline" },
    notify: { label: "Benachrichtigungen", icon: "mdi:bell-outline" },
    learn: { label: "Lernen", icon: "mdi:chart-line" },
    layout: { label: "Darstellung", icon: "mdi:view-dashboard-outline" },
    advanced: { label: "Erweitert", icon: "mdi:cog-outline" }
  };
  var RK_LAYOUT_COLORS = ["#1eb6a6", "#34a86e", "#e8982e", "#e2643c", "#7c6adc", "#3c8cdc", "#c94f8a", "#7a8288"];
  var RK_GROUP_ORDER = ["home", "room", "heating", "air", "presence", "notify", "learn", "layout", "advanced"];
  var RK_FACADES = () => [
    { id: "", name: t("egal – nur Vorhersage") },
    { id: "N", name: t("Nord") },
    { id: "NO", name: t("Nordost") },
    { id: "O", name: t("Ost") },
    { id: "SO", name: t("Südost") },
    { id: "S", name: t("Süd") },
    { id: "SW", name: t("Südwest") },
    { id: "W", name: t("West") },
    { id: "NW", name: t("Nordwest") }
  ];
  var rkFacadeName = (v) => v ? (RK_FACADES().find((f) => f.id === v) || {}).name || v : t("nur Vorhersage");
  var RaumklimaSettingsCard = class extends HTMLElement {
    static getConfigForm() {
      return { schema: [{ name: "title", selector: { text: {} } }, { name: "strip_prefix", selector: { text: {} } }] };
    }
    static getStubConfig() {
      return {};
    }
    setConfig(config) {
      this._config = { ...config };
      this._tab = this._tab || "general";
      if (this._sheet === void 0) this._sheet = null;
      this._local = this._local || {};
      this._timers = this._timers || {};
      if (!this.shadowRoot) this.attachShadow({ mode: "open" });
    }
    getCardSize() {
      return 14;
    }
    getGridOptions() {
      return { columns: "full", rows: "auto" };
    }
    connectedCallback() {
      this.style.display = "block";
      this._poll = setInterval(() => this._load(), 6e4);
    }
    disconnectedCallback() {
      clearInterval(this._poll);
    }
    set hass(hass) {
      const first = !this._hass;
      this._hass = hass;
      setLang(hass);
      this._rooms = rkRooms(hass, this._config.strip_prefix || "", this._homeId());
      if (first) {
        this._trace("card", { layout: "settings" });
        this._load();
        this._loadLayout();
      }
      const hubIds = rkHub(hass, this._homeId());
      const sig = JSON.stringify([
        this._rooms.map((r) => [r.attrs, Object.values(r.sib).map((id) => hass.states[id] && hass.states[id].state)]),
        Object.values(hubIds).map((id) => hass.states[id] && [hass.states[id].state, hass.states[id].attributes]),
        this._tab,
        this._cfgVer,
        this._toast
      ]);
      if (sig === this._sig) return;
      this._sig = sig;
      if (this._sheet) return;
      if (rkScrolling()) {
        rkLater(this, () => this._render());
        return;
      }
      this._render();
    }
    _renderSoon() {
      if (rkBusy(this)) {
        if (!this._waiting) {
          this._waiting = true;
          this.shadowRoot.addEventListener("focusout", () => {
            this._waiting = false;
            setTimeout(() => this._render(), 50);
          }, { once: true });
        }
        return true;
      }
      return false;
    }
    _homeId() {
      return this._home || rkHomeId(this._hass, this._config) || this._cfg && this._cfg.hub && this._cfg.hub.entry_id || null;
    }
    _homeMsg() {
      const h = this._home || this._config.home;
      return h ? { home: h } : {};
    }
    async _load() {
      if (!this._hass) return;
      try {
        this._cfg = await this._hass.callWS({ type: "raumklima/config", ...this._homeMsg() });
        this._rooms = rkRooms(this._hass, this._config.strip_prefix || "", this._homeId());
        this._err = null;
      } catch (e) {
        this._err = String(e && e.message ? e.message : e);
      }
      this._cfgVer = (this._cfgVer || 0) + 1;
      this._sig = null;
      this._render();
      if (this._admin && !this._dashRepaired && this._cfg) {
        this._dashRepaired = true;
        this._repairDashboards();
      }
    }
    async _repairDashboards() {
      const homes = this._cfg && this._cfg.homes || [];
      let made = 0;
      for (const h of homes) {
        if (await this._ensureDashboard(h.dashboard, h.name, h.entry_id)) made++;
      }
      if (made) {
        this._flash(t("{n} Dashboard(s) für deine Wohnungen angelegt", { n: made }));
        this._render();
      }
    }
    // ---------------------------------------------------------------- Speichern
    _openBugReport() {
      const rooms = this._rooms || [];
      const thermostats = rooms.map((r) => {
        const ent = (this._hass.entities || {})[r.id] || {};
        const dev = (this._hass.devices || {})[ent.device_id] || {};
        return [dev.manufacturer, dev.model].filter(Boolean).join(" ") || ent.platform || "";
      });
      const { url, body } = rkBugReportUrl({
        version: RK_VERSION,
        haVersion: this._hass.config && this._hass.config.version,
        language: this._hass.language,
        rooms: rooms.length,
        homeCount: (this._cfg && this._cfg.homes || []).length,
        thermostats,
        parts: true
      });
      this._openSheet({
        title: t("Fehler melden"),
        intro: t("Text prüfen – es stehen keine Raumnamen oder Zugangsdaten darin –, dann GitHub öffnen und den Text einfügen. Auf dem iPhone oder iPad geht auch Teilen oder Kopieren."),
        text: body,
        url,
        share: true
      });
    }
    // ---------------------------------------------------------------- Dialog
    _openSheet(sheet) {
      this._trace("sheet:open", { title: sheet && sheet.title, download: Boolean(sheet && sheet.download) });
      this._sheet = sheet;
      this._render();
    }
    _closeSheet() {
      this._sheet = null;
      this._sig = null;
      this._render();
    }
    _sheetStatus(text) {
      if (!this._sheet) return;
      this._sheet.status = text;
      const el = this.shadowRoot && this.shadowRoot.querySelector("[data-sheet-status]");
      if (el) {
        el.textContent = text;
        el.style.display = text ? "block" : "none";
      }
    }
    _sheetHtml() {
      const s = this._sheet;
      if (!s) return "";
      const buttons = [];
      if (s.url) {
        buttons.push(
          `<a class="btn" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer" style="--c:var(--rk-warn)"><ha-icon icon="mdi:github"></ha-icon>${t("GitHub öffnen")}</a>`
        );
      }
      if (s.share) {
        buttons.push(
          `<button class="btn" data-sheet-share style="--c:var(--rk-heat)"><ha-icon icon="mdi:share-variant"></ha-icon>${t("Teilen")}</button>`
        );
      }
      if (s.filename) {
        buttons.push(
          `<button class="btn" data-sheet-save style="--c:var(--rk-eco)"><ha-icon icon="mdi:content-save"></ha-icon>${t("Speichern")}</button>`
        );
      }
      buttons.push(
        `<button class="btn" data-sheet-copy style="--c:var(--rk-ok)"><ha-icon icon="mdi:content-copy"></ha-icon>${t("Kopieren")}</button>`
      );
      return `<div class="sheetwrap" data-sheet-close>
      <div class="sheet" role="dialog" aria-modal="true">
        <div class="stitle">${esc(s.title)}</div>
        <div class="sintro">${esc(s.intro || "")}</div>
        ${s.download ? `<a class="btn wide" href="${esc(s.download)}" download="${esc(s.filename || "")}" style="--c:var(--rk-eco)"><ha-icon icon="mdi:download"></ha-icon>${t("Datei laden")}</a>` : ""}
        <textarea class="stext" readonly rows="8" spellcheck="false">${esc(s.text || "")}</textarea>
        <div class="sstatus" data-sheet-status style="display:${s.status ? "block" : "none"}">${esc(s.status || "")}</div>
        <div class="sbtns">${buttons.join("")}<button class="btn" data-sheet-close style="--c:var(--rk-off)">${t("Schließen")}</button></div>
      </div>
    </div>`;
    }
    async _sheetCopy() {
      const text = this._sheet && this._sheet.text || "";
      try {
        await navigator.clipboard.writeText(text);
        this._sheetStatus(t("Kopiert – jetzt im Ziel einfügen"));
        return true;
      } catch (e) {
        try {
          const field = this.shadowRoot.querySelector(".stext");
          if (field) {
            field.focus();
            field.select();
            const ok = document.execCommand("copy");
            if (ok) {
              this._sheetStatus(t("Kopiert – jetzt im Ziel einfügen"));
              return true;
            }
          }
        } catch (err) {
        }
        this._sheetStatus(t("Kopieren hat der Browser blockiert – Text bitte im Feld markieren und selbst kopieren"));
        return false;
      }
    }
    async _sheetShare() {
      const text = this._sheet && this._sheet.text || "";
      const name = this._sheet && this._sheet.filename || "raumklima.txt";
      try {
        const file = new File([text], name, { type: name.endsWith(".json") ? "application/json" : "text/plain" });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: this._sheet && this._sheet.title || "Raumklima" });
          this._sheetStatus(t("Geteilt"));
          return;
        }
        if (navigator.share) {
          await navigator.share({ text });
          this._sheetStatus(t("Geteilt"));
          return;
        }
        await this._sheetCopy();
      } catch (e) {
        if (e && e.name === "AbortError") return;
        await this._sheetCopy();
      }
    }
    _sheetSave() {
      const s = this._sheet;
      if (!s) return;
      const blob = new Blob([s.text || ""], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = s.filename || "raumklima.json";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5e3);
      this._sheetStatus(t("Gespeichert: {name} – falls keine Datei kam, bitte Datei laden benutzen", { name: s.filename || "" }));
    }
    async _exportLink(kind) {
      try {
        return await this._hass.callWS({ type: "raumklima/export/link", kind, ...this._homeMsg() });
      } catch (e) {
        return {};
      }
    }
    async _backupExport() {
      try {
        this._flash(t("Sicherung wird erstellt …"));
        this._trace("backup:start");
        const res = await this._hass.callWS({ type: "raumklima/backup/export", ...this._homeMsg() });
        this._trace("backup:data", { ok: Boolean(res && res.backup) });
        const text = JSON.stringify(res.backup, null, 2);
        const stamp = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
        const name = `raumklima-einstellungen-${stamp}.json`;
        const link = await this._exportLink("backup");
        this._trace("backup:link", { ok: Boolean(link && link.url), name: link && link.name });
        this._openSheet({
          title: t("Sicherung erstellt"),
          intro: t("Enthält alle Räume, Zeitpläne und Einstellungen dieser Wohnung. Auf dem iPhone/iPad über „Teilen“ in Dateien sichern, am Rechner über „Speichern“."),
          text,
          filename: link.name || name,
          download: link.url || "",
          share: true
        });
      } catch (err) {
        this._trace("backup:error", { e: err && (err.message || err) || "?" });
        this._flash(t("Sicherung fehlgeschlagen: {e}", { e: err.message || err }));
      }
    }
    async _backupImport(file) {
      try {
        this._flash(t("Sicherung wird geprüft …"));
        const text = await file.text();
        const backup = JSON.parse(text);
        if (!confirm(t("Einstellungen aus dieser Datei einspielen? Die aktuellen Einstellungen werden überschrieben."))) return;
        const res = await this._hass.callWS({ type: "raumklima/backup/import", backup, ...this._homeMsg() });
        const missing = (res.skipped || []).length;
        this._flash(missing ? t("Eingespielt: {n} Räume · {m} nicht gefunden", { n: (res.rooms || []).length, m: missing }) : t("Eingespielt: {n} Räume", { n: (res.rooms || []).length }));
        this._cfg = await this._hass.callWS({ type: "raumklima/config", ...this._homeMsg() });
        this._render();
      } catch (err) {
        this._flash(t("Sicherung fehlgeschlagen: {e}", { e: err.message || err }));
      }
    }
    async _downloadDiagnostics() {
      try {
        this._flash(t("Diagnose wird erstellt …"));
        this._trace("diag:start");
        const data = await this._hass.callWS({ type: "raumklima/diagnostics", ...this._homeMsg() });
        this._trace("diag:data", { ok: Boolean(data) });
        const text = JSON.stringify(data, null, 2);
        const link = await this._exportLink("diagnostics");
        this._openSheet({
          title: t("Diagnose"),
          intro: t("Zum Melden eines Fehlers: die Datei laden und an das Issue anhängen. Sie enthält Werte, Entitäten und die letzten Protokollzeilen, aber keine Zugangsdaten."),
          text,
          filename: link.name || "raumklima-diagnose.json",
          download: link.url || "",
          share: true
        });
      } catch (e) {
        this._trace("diag:error", { e: e.message || String(e) });
        this._flash(t("Fehler: {e}", { e: e.message || e }));
      }
    }
    _hubOpt(key) {
      if (this._local["hub:" + key] !== void 0) return this._local["hub:" + key];
      return this._cfg && this._cfg.hub ? this._cfg.hub.options[key] : void 0;
    }
    _roomOpt(room, key) {
      const lk = `room:${room.entry_id}:${key}`;
      if (this._local[lk] !== void 0) return this._local[lk];
      const r = this._cfgRoom(room);
      if (!r) return void 0;
      if (key === "setback_short" || key === "setback_long" || key === "comfort_temperature") return r[key];
      return r.options[key];
    }
    _cfgRoom(room) {
      const id = (room.attrs.settings || {}).entry_id;
      return this._cfg ? (this._cfg.rooms || []).find((r) => r.entry_id === id) : null;
    }
    _setHub(changes, delay = 700) {
      for (const [k, v] of Object.entries(changes)) this._local["hub:" + k] = v;
      this._pendingHub = { ...this._pendingHub || {}, ...changes };
      clearTimeout(this._timers.hub);
      this._timers.hub = setTimeout(() => this._flushHub(), delay);
      this._sig = null;
      this._render();
    }
    async _flushHub() {
      const changes = this._pendingHub;
      this._pendingHub = null;
      if (!changes) return;
      try {
        await this._hass.callWS({ type: "raumklima/hub/update", changes, ...this._homeMsg() });
        this._flash("Gespeichert");
      } catch (e) {
        this._flash(t("Fehler: {e}", { e: e.message || e }));
      }
      await this._load();
      for (const k of Object.keys(changes)) delete this._local["hub:" + k];
    }
    _setRoom(entryId, changes, delay = 1500) {
      for (const [k, v] of Object.entries(changes)) this._local[`room:${entryId}:${k}`] = v;
      this._pendingRoom = this._pendingRoom || {};
      this._pendingRoom[entryId] = { ...this._pendingRoom[entryId] || {}, ...changes };
      clearTimeout(this._timers["room:" + entryId]);
      this._timers["room:" + entryId] = setTimeout(() => this._flushRoom(entryId), delay);
      this._sig = null;
      this._render();
    }
    async _flushRoom(entryId) {
      const changes = (this._pendingRoom || {})[entryId];
      delete this._pendingRoom[entryId];
      if (!changes) return;
      try {
        await this._hass.callWS({ type: "raumklima/room/update", entry_id: entryId, changes });
        this._flash("Gespeichert – Raum übernimmt die Werte");
      } catch (e) {
        this._flash(t("Fehler: {e}", { e: e.message || e }));
      }
      await this._load();
      if (this._sched) delete this._sched[entryId];
      for (const k of Object.keys(changes)) delete this._local[`room:${entryId}:${k}`];
    }
    // Bekannte Dashboards: die Zentrale ist maßgeblich, hass.dashboards nur Ersatz.
    _dashKnown() {
      const list = this._cfg && this._cfg.dashboards || [];
      if (list.length) return Object.fromEntries(list.map((p) => [p, 1]));
      return this._hass.dashboards || {};
    }
    // Für eine neue Wohnung gleich ein Dashboard mit der Raumklima-Strategie anlegen
    async _ensureDashboard(path, name, entryId) {
      const p = String(path || "").replace(/^\//, "");
      const cur = String(this._hass && this._hass.panelUrl || "").replace(/^\//, "");
      if (!rkNeedsDashboard(this._dashKnown(), p, cur)) return null;
      try {
        await this._hass.callWS({
          type: "lovelace/dashboards/create",
          url_path: p,
          title: name,
          icon: "mdi:home-thermometer",
          show_in_sidebar: true,
          require_admin: false
        });
        await this._hass.callWS({
          type: "lovelace/config/save",
          url_path: p,
          config: { strategy: { type: "custom:raumklima", home: entryId } }
        });
        if (this._hass.dashboards) {
          this._hass.dashboards[p] = this._hass.dashboards[p] || { title: name, mode: "storage", show_in_sidebar: true };
        }
        if (this._cfg && Array.isArray(this._cfg.dashboards) && !this._cfg.dashboards.includes(p)) {
          this._cfg.dashboards.push(p);
        }
        return p;
      } catch (e) {
        return null;
      }
    }
    // Debug-Spur zum Server: auf dem iPad gibt es keine Konsole, deshalb meldet die Karte
    // ihre Schritte selbst. Fehler dürfen die Bedienung nie stören.
    _trace(event, data = {}) {
      try {
        this._hass.callWS({
          type: "raumklima/trace",
          event,
          data: { ...data, version: RK_VERSION, ua: String(navigator.userAgent || "").slice(0, 120) }
        }).catch(() => {
        });
      } catch (e) {
      }
    }
    _flash(text) {
      this._toast = t(text);
      clearTimeout(this._timers.toast);
      this._timers.toast = setTimeout(() => {
        this._toast = null;
        this._sig = null;
        this._render();
      }, 2500);
      this._sig = null;
      this._render();
    }
    get _admin() {
      return !this._cfg || this._cfg.admin !== false;
    }
    // ---------------------------------------------------------------- Bausteine
    _st(id) {
      return id ? this._hass.states[id] : void 0;
    }
    _name(id) {
      const s = this._st(id);
      return s && s.attributes.friendly_name || id || "–";
    }
    _row(label, value, sub) {
      const help = HELP[label];
      this._helpOpen = this._helpOpen || /* @__PURE__ */ new Set();
      const open = help && this._helpOpen.has(label);
      const q = help ? `<button class="qm ${open ? "on" : ""}" data-help="${esc(label)}" title="${t("Erklärung")}" aria-label="${t("Erklärung")}" aria-expanded="${open}">?</button>` : "";
      const box = open ? `<div class="helpbox">${esc(help[{ de: 0, en: 1, fr: 2 }[getLang()] ?? 1])}</div>` : "";
      return `<div class="row"><div class="l"><span class="lbl">${t(label)}${q}</span>${sub ? `<small>${t(sub)}</small>` : ""}</div>${value}</div>${box}`;
    }
    _v(text, mute) {
      return `<span class="v ${mute ? "mute" : ""}">${t(String(text))}</span>`;
    }
    _grp(title, icon, tone, rows, cls = "", extra = "") {
      const g = RK_GROUP_OF[title] || "advanced";
      const rowCount = (rows.match(/class="row"/g) || []).length;
      const ctlCount = (rows.match(/class="tgl/g) || []).length + (rows.match(/class="segs"/g) || []).length;
      const pairable = rowCount >= 4 && rowCount % 2 === 0 && ctlCount >= rowCount && !/tblwrap|class="people"|roomrow|whyrow|mailprov|stepper|numedit/.test(rows);
      return `<div class="grp ${cls}${pairable ? " pair" : ""}" data-g="${g}" style="--g:${toneVar(tone)}"><div class="gh"><div class="ic"><ha-icon icon="${icon}"></ha-icon></div><b>${t(title)}</b>${extra}</div><div class="rws">${rows}</div></div>`;
    }
    _stepper(attrs, value, unit, dec) {
      const ro = !this._admin;
      return `<div class="stepper ${ro ? "ro" : ""}"><button ${attrs} data-d="-1" aria-label="${t("weniger")}">−</button><span>${value == null || isNaN(value) ? "–" : fmt(value, dec)}${unit}</span><button ${attrs} data-d="1" aria-label="${t("mehr")}">+</button></div>`;
    }
    // Stepper für Zahl-Entitäten (number.*)
    _numStepper(id, unit, dec = 0) {
      const s = this._st(id);
      if (!s) return `<span class="v mute">–</span>`;
      return this._stepper(`data-num="${id}"`, parseFloat(s.state), unit, dec);
    }
    // Stepper für Optionen (Zentrale oder Raum)
    _optStepper(scope, key, value, unit, step, min, max, dec = 0) {
      return this._stepper(`data-opt="${scope}" data-key="${key}" data-step="${step}" data-min="${min}" data-max="${max}" data-val="${value ?? ""}"`, value, unit, dec);
    }
    _toggle(id, on) {
      const s = this._st(id);
      if (!s && on === void 0) return `<span class="v mute">–</span>`;
      const isOn = on !== void 0 ? on : s.state === "on";
      return `<button class="tgl ${isOn ? "on" : ""}" ${id ? `data-tgl="${id}"` : ""} ${this._admin ? "" : "disabled"} aria-label="${t("umschalten")}"></button>`;
    }
    _optToggle(scope, key, on) {
      return `<button class="tgl ${on ? "on" : ""}" data-optbool="${scope}" data-key="${key}" data-val="${on ? 1 : 0}" ${this._admin ? "" : "disabled"} aria-label="${t("umschalten")}"></button>`;
    }
    _segs(scope, key, options, current) {
      return `<div class="segs">${Object.entries(options).map(([v, l]) => `<button class="${v === current ? "on" : ""}" data-seg="${scope}" data-key="${key}" data-val="${v}" ${this._admin ? "" : "disabled"}>${l}</button>`).join("")}</div>`;
    }
    _select(scope, key, items, current, empty) {
      return `<select class="sel" data-sel="${scope}" data-key="${key}" ${this._admin ? "" : "disabled"}>${empty !== void 0 ? `<option value="">${t(empty)}</option>` : ""}${items.map((it) => `<option value="${esc(it.id)}" ${it.id === current ? "selected" : ""}>${esc(it.name)}</option>`).join("")}</select>`;
    }
    // ---------------------------------------------------------------- Allgemein
    _general() {
      if (this._err) return `<div class="hint">${t("Einstellungen konnten nicht geladen werden: {e}", { e: esc(this._err) })}</div>`;
      if (!this._cfg) return `<div class="hint">${t("Lade Einstellungen …")}</div>`;
      if (!this._cfg.hub) return `<div class="hint">${t("„Raumklima Allgemein“ wird gerade eingerichtet – bitte die Seite gleich neu laden.")}</div>`;
      const ch = this._cfg.choices || {};
      const st = this._cfg.hub.state || {};
      const hubIds = rkHub(this._hass);
      const pres = PRESENCE[st.stage] || PRESENCE.home;
      const seas = SEASON[st.decision] || SEASON.heating;
      const residents = this._hubOpt("residents") || [];
      const persons = st.persons || {};
      const H = "hub";
      const personChips = (ch.persons || []).map((p) => {
        const on = residents.includes(p.id);
        const info = persons[p.id];
        const where = info ? info.present ? t("da") : info.distance_km != null ? `${fmt(info.distance_km, info.distance_km < 10 ? 1 : 0)} km` : t("unbekannt") : "";
        return `<button class="chip2 ${on ? "" : "off"}" data-person="${p.id}" style="--c:${on ? info && info.present ? "var(--rk-ok)" : "var(--rk-eco)" : "var(--rk-off)"}" ${this._admin ? "" : "disabled"}><i></i>${esc(p.name)}${on && where ? ` · ${where}` : ""}</button>`;
      }).join("");
      const presRows = [
        `<div class="status"><span class="chip" style="--tone:${toneVar(pres.tone)}"><ha-icon icon="${pres.icon}"></ha-icon>${pres.label}${st.stage === "preheat" && st.preheat_by ? ` · ${esc(st.preheat_by)}` : ""}</span>${st.presence_configured || this._hubOpt("presence_off") ? "" : `<span class="chip" style="--tone:var(--rk-warn)"><ha-icon icon="mdi:information-outline"></ha-icon>${t("Bewohner und Zone wählen, dann ist es aktiv")}</span>`}</div>`,
        this._row(
          "Anwesenheit aus",
          this._optToggle(H, "presence_off", !!this._hubOpt("presence_off")),
          "keine Auswertung: nichts wird nach Anwesenheit abgesenkt, nichts vorgeheizt, keine Weg-Meldungen – gedacht, wenn keine Ortung möglich ist"
        ),
        this._row("Wer wohnt hier?", `<div class="chips">${personChips || this._v("keine Personen in HA", true)}</div>`, "Tippen zum Aus-/Abwählen. Zählt, sobald eins ihrer Handys in der Zone ist."),
        this._row("Wohnung (Zone)", this._select(H, "zone", ch.zones || [], this._hubOpt("zone"), "– wählen –")),
        this._row("Absenken nach", this._optStepper(H, "away_delay", this._hubOpt("away_delay"), " min", 5, 0, 240), "damit kurze Wege nichts auslösen"),
        this._row("„Länger weg“ ab", this._optStepper(H, "long_away_hours", this._hubOpt("long_away_hours"), " h", 1, 2, 168)),
        this._row("Vorheizen ab", this._optStepper(H, "preheat_km", this._hubOpt("preheat_km"), " km", 1, 0, 200), "wenn sich jemand nähert"),
        this._row("Urlaub automatisch ab", this._optStepper(H, "vacation_km", this._hubOpt("vacation_km") ?? 0, " km", 10, 0, 1e3), "sind alle Bewohner weiter weg, gilt nach der Wartezeit Urlaub – 0 = aus"),
        this._row("… nach", this._optStepper(H, "vacation_hours", this._hubOpt("vacation_hours") ?? 12, " h", 1, 1, 96), "erst so lange weit weg zählt als Urlaub (Tagesausflug löst nicht aus)"),
        this._row(
          "Präsenzmelder zählen",
          this._segs(H, "home_sensors", RK_HOMESENS, this._hubOpt("home_sensors") || "mmwave"),
          st.sensed && st.sensed.length ? t("gerade jemand in: {r}", { r: esc(st.sensed.join(", ")) }) : "sieht ein Melder jemanden, wird nicht abgesenkt – PIR löst auch bei Haustieren aus, darum standardmäßig nur mmWave; im Urlaub zählen Melder nie"
        ),
        this._row("Urlaub", this._toggle(hubIds.vacation), "endet automatisch bei Ankunft"),
        this._row("Gäste da", this._toggle(hubIds.guests), "nicht absenken, auch wenn alle Bewohner weg sind"),
        this._row(
          "Gäste gelten für",
          `<div class="chips">${this._orderedRooms().map((r) => {
            const rid = (r.attrs && r.attrs.settings || {}).entry_id || r.id;
            const chosen = (this._hubOpt("guests_rooms") || []).includes(rid);
            return `<button class="chip2 ${chosen ? "" : "off"}" data-guestroom="${rid}" title="${esc(r.name)}"><i></i>${esc(r.name)}</button>`;
          }).join("")}</div>`,
          (this._hubOpt("guests_rooms") || []).length ? t("nur diese Räume werden nicht abgesenkt") : t("keine Auswahl = alle Räume der Wohnung")
        ),
        this._row("Homeoffice", this._toggle(hubIds.home_office), "im Fenster gilt der Wunsch, der Zeitplan pausiert"),
        this._row(
          "Nachtruhe über Entität",
          this._select(H, "night_entity", ch.signals || [], this._hubOpt("night_entity"), "– keiner –"),
          "HA-Schalter, der die Nachtruhe mit schaltet – der eigene Schalter bleibt"
        ),
        this._row(
          "Homeoffice über Entität",
          this._select(H, "home_office_entity", ch.signals || [], this._hubOpt("home_office_entity"), "– keiner –"),
          "HA-Schalter, der Homeoffice mit schaltet – gilt wie der Schalter, ohne Anwesenheitsprüfung"
        ),
        this._row(
          "Homeoffice nur wenn jemand da",
          this._optToggle(H, "home_office_check", this._hubOpt("home_office_check") !== false),
          "gilt für Kalendertermine; der Schalter heizt auch ohne Ortung"
        ),
        (() => {
          const items = Array.from({ length: 24 }, (_x, h) => ({ id: `${String(h).padStart(2, "0")}:00`, name: `${String(h).padStart(2, "0")}:00` }));
          const from = this._hubOpt("home_office_from") || "08:00";
          const to = this._hubOpt("home_office_to") || "17:00";
          return this._row(
            "Homeoffice-Fenster",
            `<span class="inline">${this._select(H, "home_office_from", items, from)} – ${this._select(H, "home_office_to", items, to)}</span>`,
            "in dieser Zeit heizen die gewählten Räume auf Wunsch; danach läuft der Zeitplan weiter"
          );
        })(),
        this._row(
          "Homeoffice gilt für",
          `<div class="chips">${this._orderedRooms().map((r) => {
            const rid = (r.attrs && r.attrs.settings || {}).entry_id || r.id;
            const chosen = (this._hubOpt("home_office_rooms") || []).includes(rid);
            return `<button class="chip2 ${chosen ? "" : "off"}" data-horoom="${rid}" title="${esc(r.name)}"><i></i>${esc(r.name)}</button>`;
          }).join("")}</div>`,
          (this._hubOpt("home_office_rooms") || []).length ? t("nur diese Räume werden auf Wunsch geheizt") : t("keine Auswahl = alle Räume mit Thermostat")
        ),
        this._row(
          "Kalender",
          this._select(H, "calendar_entity", ch.calendars || [], this._hubOpt("calendar_entity"), "– keiner –"),
          st.calendar && st.calendar.mode ? t("gerade: „{s}“", { s: esc(st.calendar.summary || "") }) : "Termine mit diesen Wörtern steuern die Anwesenheit"
        ),
        this._hubOpt("calendar_entity") ? this._row("… wie Urlaub", `<input class="inp" data-hubtext="calendar_away_words" value="${esc(this._hubOpt("calendar_away_words") || "")}" ${this._admin ? "" : "disabled"}>`, "Komma-getrennt; absenken wie „länger weg“, sobald niemand da ist") : "",
        this._hubOpt("calendar_entity") ? this._row("… jemand bleibt zu Hause", `<input class="inp" data-hubtext="calendar_home_words" value="${esc(this._hubOpt("calendar_home_words") || "")}" ${this._admin ? "" : "disabled"}>`, "Komma-getrennt; dann wird nicht abgesenkt") : ""
      ].join("");
      const mode = this._hubOpt("season_mode");
      const mdToInput = (v) => v && /^\d{2}-\d{2}$/.test(v) ? `2000-${v}` : "";
      const seasRows = [
        `<div class="status"><span class="chip" style="--tone:${toneVar(seas.tone)}"><ha-icon icon="${seas.icon}"></ha-icon>${seas.label}</span>
        <span class="chip" style="--tone:var(--rk-off)"><ha-icon icon="mdi:thermometer"></ha-icon>${t("Ø 24 h {p} · Vorhersage {f}", { p: st.mean_past == null ? t("sammelt noch") : fmt(st.mean_past) + "°", f: st.mean_forecast == null ? "–" : fmt(st.mean_forecast) + "°" })}</span></div>`,
        this._row("Betriebsart", this._segs(H, "season_mode", RK_MODES, mode)),
        this._row("Heizgrenze", this._optStepper(H, "heating_limit", this._hubOpt("heating_limit"), " °C", 0.5, 5, 25, 1), "Tagesmittel außen, darüber Heizpause (nach 2 milden Tagen)"),
        this._row("Heizsaison", `<span class="v"><input class="inp short" type="date" data-md="season_start" value="${mdToInput(this._hubOpt("season_start"))}" ${this._admin ? "" : "disabled"}> ${t("bis")} <input class="inp short" type="date" data-md="season_end" value="${mdToInput(this._hubOpt("season_end"))}" ${this._admin ? "" : "disabled"}></span>`, "Kalender antippen – Tag und Monat zählen, das Jahr ist egal"),
        this._row("Außentemperatur von", this._select(H, "outdoor_temp_entity", ch.outdoor || [], this._hubOpt("outdoor_temp_entity"), "Wetterdienst"), "eigene Wetterstation statt Wetterdienst – die Vorhersage kommt weiterhin vom Wetterdienst"),
        this._row("Kälteeinbruch unter", this._optStepper(H, "cold_snap_temp", this._hubOpt("cold_snap_temp"), " °C", 0.5, 0, 20, 1), "3 Tage darunter → heizt auch außerhalb der Saison"),
        this._row("Sicherung", this._optStepper(H, "frost_floor", this._hubOpt("frost_floor"), " °C", 0.5, 5, 20, 1), "fällt ein Raum darunter, heizt er immer"),
        this._row("Frostnacht: weniger absenken", this._optToggle(H, "frost_night", !!this._hubOpt("frost_night")), "unter −5 °C laut Vorhersage nur halb so tief – der Raum ist schneller wieder warm"),
        this._row("Sommerpflege Ventile", this._optToggle(H, "valve_care", !!this._hubOpt("valve_care")), "mittwochs 11 Uhr kurz öffnen"),
        this._row("Heute heizen", st.heat_today_until ? `<button class="btn" data-action="cancel_heat_today" style="--c:var(--rk-heat)"><ha-icon icon="mdi:close"></ha-icon>${t("Beenden")}</button>` : `<button class="btn" data-action="heat_today" style="--c:var(--rk-heat)" ${this._admin ? "" : "disabled"}><ha-icon icon="mdi:fire"></ha-icon>${t("24 h heizen")}</button>`, "für milde, aber kühle Tage")
      ].join("");
      const sl = st.sleep || {};
      const signals = this._hubOpt("sleep_signals") || [];
      const sigNames = Object.fromEntries((ch.signals || []).map((x) => [x.id, x.name]));
      const sigChips = signals.map((id) => `<span class="chip2" style="--c:var(--rk-eco)"><i></i>${esc(sigNames[id] || this._name(id))}${this._admin ? ` <button class="mini x" data-sigrm="${esc(id)}" title="${t("entfernen")}">✕</button>` : ""}</span>`).join("");
      const sigAvail = (ch.signals || []).filter((x) => !signals.includes(x.id));
      const lrn = (k, label) => {
        const v = sl[k] || {};
        const e = v.effective || {};
        const src = e.source || {};
        const learned = (key) => src[key] === "learned" ? ` · ${t("gelernt")}` : "";
        const chips = [
          v.bed ? `<span class="chip2" style="--c:var(--rk-eco)"><i></i>${t("ins Bett ~{v}", { v: v.bed })}${learned("night_start")}</span>` : `<span class="chip2" style="--c:var(--rk-off)"><i></i>${t("{n}/4 Nächte", { n: v.nights_bed || 0 })}</span>`,
          v.wake ? `<span class="chip2" style="--c:var(--rk-eco)"><i></i>${t("auf ~{v}", { v: v.wake })}${learned("wake")}</span>` : "",
          e.quiet_start ? `<span class="chip2"><i></i>${t("Ruhezeit")} ${e.quiet_start}–${e.quiet_end}</span>` : ""
        ].filter(Boolean).join("");
        return this._row(t(label), `<div class="chips">${chips}</div>`, "");
      };
      const sleepRows = [
        `<div class="status"><span class="chip" style="--tone:${sl.quiet_now ? "var(--rk-eco)" : "var(--rk-ok)"}"><ha-icon icon="${sl.quiet_now ? "mdi:sleep" : "mdi:white-balance-sunny"}"></ha-icon>${sl.quiet_now ? t("Ruhezeit gerade aktiv") : t("Keine Ruhezeit")}</span>${sl.asleep ? `<span class="chip" style="--tone:var(--rk-eco)"><ha-icon icon="mdi:lightbulb-off-outline"></ha-icon>${t("Licht aus – alle schlafen")}</span>` : ""}</div>`,
        this._row("Zeiten lernen", this._optToggle(H, "learn_times", !!this._hubOpt("learn_times")), "aus Nachtlüften und Licht – verlängert Ruhezeit und Nachtlüften nur, verkürzt nie"),
        this._row("Schichtdienst", this._optToggle(H, "learn_shift", !!this._hubOpt("learn_shift")), "auch Tagschlaf lernen: ins Bett bis 09:00, aufstehen bis 17:00 – für Nachtschicht und Wechselschicht"),
        this._row("Ruhezeit senkt ab", this._optToggle(H, "quiet_setback", !!this._hubOpt("quiet_setback")), "während der Ruhezeit werden Schlafzimmer und selten genutzte Räume abgesenkt – auch wenn jemand zu Hause ist"),
        this._row("Absenkwert nachts", this._select(H, "night_level", [{ id: "short", name: t("Kurz weg") }, { id: "long", name: t("Länger weg") }, { id: "frost", name: t("Frostschutz") }], this._hubOpt("night_level") || "long"), "gilt bei der Ruhezeit und wenn der Schalter „Nachtruhe“ an ist – je Raum unter „Nachtabsendung“ ein- oder ausgeschlossen"),
        this._row("Feiertage", this._select(H, "holiday_state", ch.states || [], this._hubOpt("holiday_state") || "", "– keine –"), sl.tonight && sl.tonight.holiday ? t("morgen: {h} – Ruhezeit wie am Wochenende", { h: esc(sl.tonight.holiday) }) : "Nacht vor einem Feiertag gilt wie Wochenende"),
        this._row("Schlaf-Signale", `<div class="chips">${sigChips || this._v("keine", true)}</div>`, "Lichter: abends alle 20 min aus = ins Bett, morgens eins an = aufgestanden"),
        this._admin && sigAvail.length ? `<div class="addrow"><select class="sel" id="addSig">${sigAvail.map((x) => `<option value="${esc(x.id)}">${esc(x.name)}</option>`).join("")}</select><button class="btn" data-sigadd style="--c:var(--rk-eco)"><ha-icon icon="mdi:lightbulb-plus-outline"></ha-icon>${t("Signal hinzufügen")}</button></div>` : "",
        lrn("weekday", "Werktags"),
        lrn("weekend", "Wochenende"),
        `<div class="hint">${t("Jede Nacht zählt einmal (frühestes Ereignis). Gelernt wird zuerst je Wochentag (Schichtdienst), sonst nach Werktag und Wochenende (Fr→Sa, Sa→So); gelernt wird der typische Wert (Median) der letzten 6 Wochen, sobald 4 Nächte da sind. Die Ruhezeit beginnt 30 min vor der typischen Bettzeit und endet 30 min nach dem Aufstehen – aber nie kürzer als eingestellt.")}</div>`
      ].join("");
      const homes = this._cfg.homes || [];
      const homeRows = [
        this._row("Name der Wohnung", `<input class="inp" data-hubtext="name" value="${esc(this._hubOpt("name") || "")}" placeholder="${t("z. B. Ferienwohnung")}" ${this._admin ? "" : "disabled"}>`, "erscheint im Umschalter oben im Dashboard"),
        (() => {
          const dh = homes.find((h) => h.entry_id === this._cfg.hub.entry_id) || {};
          const dp = dh.dashboard || "";
          const fehlt = this._admin && rkNeedsDashboard(this._dashKnown(), dp, String(this._hass && this._hass.panelUrl || "").replace(/^\//, ""));
          return this._row(
            "Dashboard",
            `<input class="inp" data-hubtext="dashboard" value="${esc(this._hubOpt("dashboard") || "")}" placeholder="${esc(dp || "heizung")}" ${this._admin ? "" : "disabled"}>${fehlt ? ` <button class="mini" data-mkdash="${esc(dp)}" title="${t("Dashboard mit der Raumklima-Strategie anlegen")}">${t("anlegen")}</button>` : ` <span class="lt">${t("vorhanden")}</span>`}`,
            fehlt ? t("Für diese Wohnung gibt es noch kein Dashboard „{d}“ – der Knopf legt es mit der Raumklima-Strategie an (gefiltert auf diese Wohnung).", { d: dp }) : t("Adresse des Dashboards dieser Wohnung (für den Umschalter)")
          );
        })(),
        (() => {
          const lat = this._hubOpt("latitude"), lon = this._hubOpt("longitude");
          const hl = this._hass.config || {};
          const haLat = hl.latitude != null ? fmt(hl.latitude, 4) : "–";
          const haLon = hl.longitude != null ? fmt(hl.longitude, 4) : "–";
          const zn = this._hubOpt("zone") || "";
          const zst = zn ? this._st(zn) : null;
          const zlat = zst && zst.attributes ? zst.attributes.latitude : null;
          const zlon = zst && zst.attributes ? zst.attributes.longitude : null;
          const own = lat != null || lon != null;
          return `<details class="adv"${own ? " open" : ""}><summary>${t("Erweitert: Standort der Wohnung")}</summary>${this._row(
            "Standort der Wohnung",
            `<span class="v"><input type="number" class="inp short" step="0.0001" min="-90" max="90" data-hubgeo="latitude" value="${lat ?? ""}" placeholder="${t("Breite")}" ${this._admin ? "" : "disabled"}> <input type="number" class="inp short" step="0.0001" min="-180" max="180" data-hubgeo="longitude" value="${lon ?? ""}" placeholder="${t("Länge")}" ${this._admin ? "" : "disabled"}> ${this._admin ? `<button class="mini" data-geohass title="${t("Werte von Home Assistant übernehmen")}">${t("von HA")}</button>${own ? `<button class="mini x" data-geoclear title="${t("leeren – dann gilt Home Assistant")}">✕</button>` : ""}` : ""}</span>`,
            t("Leer lassen = es gilt der Standort aus der Zone dieser Wohnung ({zone}{zl}). Ist keine Zone gesetzt, gilt der Standort von Home Assistant ({lat} / {lon}). Nur eintragen, wenn die Wohnung woanders liegt – daraus rechnet Raumklima den Sonnenstand; „von HA“ übernimmt die HA-Werte zum Anpassen.", {
              zone: zn || t("keine Zone gesetzt"),
              zl: zlat != null && zlon != null ? `, ${fmt(zlat, 4)} / ${fmt(zlon, 4)}` : "",
              lat: haLat,
              lon: haLon
            })
          )}</details>`;
        })(),
        this._admin ? `<div class="addrow"><input class="inp" id="newHome" placeholder="${t("Neue Wohnung, z. B. Ferienwohnung")}"><button class="btn" data-newhome style="--c:var(--rk-ok)"><ha-icon icon="mdi:home-plus-outline"></ha-icon>${t("Wohnung anlegen")}</button></div>` : "",
        `<div class="hint">${homes.length > 1 ? t("{n} Wohnungen: {list}. Jede hat eigene Bewohner, Zone, Empfänger, Heizsaison und Protokoll; Räume ordnest du im Raum unter „Wohnung“ zu.", { n: homes.length, list: homes.map((h) => esc(h.name) + " (" + t("{n} Räume", { n: h.rooms.length }) + ")").join(", ") }) : t("Für eine zweite Wohnung (z. B. Ferienwohnung) mit eigenen Bewohnern, Zone und Empfängern hier anlegen. Bestehende Räume bleiben in dieser Wohnung.")}</div>`
      ].join("");
      const frsi = fmt({ unrenovated: 0.6, renovated: 0.7, new: 0.8 }[this._hubOpt("building_type")] || 0.7, 2);
      const buildRows = [
        this._row("Bauart", this._segs(H, "building_type", RK_BUILDING, this._hubOpt("building_type"))),
        this._row("Heizkosten pro Jahr", `<span class="v"><input type="number" class="inp" min="0" max="20000" step="50" data-hubnum="annual_cost" value="${this._hubOpt("annual_cost") ?? ""}" placeholder="${t("z. B. 1400")}" ${this._admin ? "" : "disabled"} style="width:110px"> €</span>`, "optional, laut Abrechnung – nur für die Euro-Schätzung im PDF-Bericht (Ersparnis, „1 °C weniger = … €“)"),
        `<div class="hint">${t("Der Schimmelschutz rechnet bei längerer Abwesenheit mit der kältesten Wandstelle (Temperaturfaktor {f} nach DIN 4108-2). Ist die Raumluft feucht, wird weniger abgesenkt – warme Luft nimmt mehr Feuchte auf und die Wand bleibt unter 80 % Feuchte.", { f: frsi })}</div>`
      ].join("");
      const push = this._hubOpt("recipients") || {};
      const tts = this._hubOpt("tts") || {};
      const palette = ["#4f9dff", "#ff7a45", "#2ec4a6", "#a78bfa", "#ffb020"];
      const kinds = this._cfg.kinds || Object.keys(RK_KINDS);
      const card = (target, list, channel, i) => {
        const ks = kinds.filter((k) => k !== "live" || channel === "push" && target.startsWith("notify.mobile_app_"));
        const chips = ks.map((k) => `<button class="chip2 ${list.includes(k) ? "" : "off"}" data-kind="${k}" data-target="${esc(target)}" data-ch="${channel}" title="${RK_KINDS[k][1]}" ${this._admin ? "" : "disabled"}>${RK_KINDS[k][0]} ${RK_KINDS[k][1]}</button>`).join("");
        return `<div class="row"><div class="l">
        <span class="rn" style="--c:${palette[i % palette.length]}"><i></i>${esc(rkPretty(target))}</span>
        <small>${channel === "tts" ? t("Sprachansage · nie in der Ruhezeit") : t("Push aufs Handy")} · ${esc(target)}</small></div>
        <div class="chips">${chips}${this._admin ? `<button class="mini" data-test="${esc(target)}">${t("Test")}</button><button class="mini x" data-remove="${esc(target)}" data-ch="${channel}" title="${t("entfernen")}">✕</button>` : ""}</div></div>`;
      };
      const cards = [...Object.entries(push).map(([tg, l], i) => card(tg, l || [], "push", i)), ...Object.entries(tts).map(([tg, l], i) => card(tg, l || [], "tts", i + 3))].join("") || `<div class="hint">${t("Noch kein Empfänger – unten hinzufügen.")}</div>`;
      const avail = (ch.notify || []).filter((tg) => !(tg in push) && !(tg in tts));
      const addRow = this._admin && avail.length ? `<div class="addrow">
        <select class="sel" id="addTarget">${avail.map((tg) => `<option value="${esc(tg)}">${esc(rkPretty(tg))} (${esc(tg)})</option>`).join("")}</select>
        <button class="btn" data-add="push" style="--c:var(--rk-air)"><ha-icon icon="mdi:cellphone-message"></ha-icon>${t("Als Push hinzufügen")}</button>
        <button class="btn" data-add="tts" style="--c:var(--rk-eco)"><ha-icon icon="mdi:speaker-message"></ha-icon>${t("Als Sprachansage")}</button></div>` : "";
      const hm = (v) => String(v || "").slice(0, 5);
      const tf = (key, val) => `<button class="timebtn" data-timeopen="${key}" data-val="${hm(val)}" ${this._admin ? "" : "disabled"}>${hm(val) || "–:–"}</button>`;
      const notiRows = [
        this._row("Nur an anwesende Personen", this._optToggle(H, "notify_present_only", this._hubOpt("notify_present_only") ?? true), t("Lüft-Hinweise nur an Handys von Personen, die laut Ortung zu Hause sind – dringende Meldungen (Fenster offen bei Abwesenheit, Frost, Ausfall) gehen weiter an alle")),
        this._row(
          "Sturm- und Regenwarnung",
          this._optToggle(H, "storm_warning", this._hubOpt("storm_warning") ?? true),
          t("warnt, wenn Sturm oder Starkregen angekündigt ist und ein Fenster offen steht – kommt auch in der Ruhezeit")
        ),
        this._row(
          "… Böen ab",
          this._optStepper(H, "storm_gust_kmh", this._hubOpt("storm_gust_kmh") ?? 70, " km/h", 10, 30, 200, 0),
          t("ab dieser Böenstärke gilt es als Sturm")
        ),
        this._row(
          "… Regen ab",
          this._optStepper(H, "storm_rain_mm", this._hubOpt("storm_rain_mm") ?? 8, " mm/h", 1, 1, 50, 0),
          t("ab dieser Regenmenge gilt es als Starkregen")
        ),
        this._row("Ruhezeit", `<span class="v">${tf("quiet_start", this._hubOpt("quiet_start"))} – ${tf("quiet_end", this._hubOpt("quiet_end"))}</span>`, "nur Dringendes (kühlt aus, Fenster offen bei Abwesenheit, Thermostat-Fehler) kommt laut"),
        this._row("Wochenende bis", `<span class="v">${tf("quiet_end_weekend", this._hubOpt("quiet_end_weekend"))}</span>`, "Sa und So endet die Ruhezeit später – zum Ausschlafen"),
        this._row(
          "Lüfthinweise von",
          `<span class="v">${tf("vent_from", this._hubOpt("vent_from") || "08:00:00")} – ${tf("vent_to", this._hubOpt("vent_to") || "21:00:00")}</span>`,
          t("Bitte lüften, Fenster schließen und Luft ausgetauscht nur in dieser Zeit – nachts bleibt es still, Raum kühlt aus, Frost und Gerätefehler melden sich weiter")
        ),
        this._row("Nachtlüften", `<span class="v">${tf("night_start", this._hubOpt("night_start"))} – ${tf("night_end", this._hubOpt("night_end"))}</span>`, "Fenster in Schlafräumen, das in dieser Zeit aufgeht, gilt als Schlafen bei offenem Fenster – keine Lüft-Hinweise, morgens ein Gruß"),
        this._row("… leise warnen unter", this._optStepper(H, "night_alarm_temp", this._hubOpt("night_alarm_temp"), " °C", 0.5, 5, 20, 1), "einmal pro Nacht"),
        this._row("Erinnern alle", this._optStepper(H, "repeat_minutes", this._hubOpt("repeat_minutes"), " min", 1, 1, 60), "solange das Problem besteht"),
        this._row("Wetterquelle", this._select(H, "weather_entity", ch.weather || [], this._hubOpt("weather_entity"), "– wählen –"), st.outdoor_temperature != null ? t("Draußen gerade {v} °C", { v: fmt(st.outdoor_temperature) }) : ""),
        this._row("Fehler auch in der HA-Glocke", this._optToggle(H, "notify_on_failure", !!this._hubOpt("notify_on_failure"))),
        this._row(
          "Wärmemenge im Bericht",
          this._select(H, "report_metric", [
            { id: "auto", name: t("automatisch") },
            { id: "valve", name: t("Ventilstellung") },
            { id: "deficit", name: t("Gradstunden") },
            { id: "hours", name: t("Heizstunden") }
          ], this._hubOpt("report_metric") || "auto"),
          "automatisch = Ventilstellung, wenn jedes Thermostat sie meldet – sonst Gradstunden unter Ziel (gemessen, nicht geschätzt)"
        ),
        this._row(
          "PDF-Berichte",
          `<div class="chips">${Object.entries({ week: t("Woche"), month: t("Monat"), season: t("Heizsaison") }).map(([k, l]) => {
            const on = (this._hubOpt("report_pdf") ?? ["week", "month", "season"]).includes(k);
            return `<button class="chip2 ${on ? "" : "off"}" data-rpdf="${k}" style="--c:var(--rk-heat)" ${this._admin ? "" : "disabled"}><i></i>${l}</button>`;
          }).join("")}</div>`,
          "automatisch erstellen: Woche sonntags 18 Uhr, Monat am 1., Heizsaison nach Saisonende – Push mit Link an alle mit „Wochenbericht“"
        ),
        this._row(
          "PDF per E-Mail",
          `<button class="tgl ${this._hubOpt("report_email") ? "on" : ""}" data-mailtoggle ${this._admin ? "" : "disabled"} aria-label="${t("umschalten")}"></button>`,
          this._hubOpt("report_email") ? "die PDF kommt als Anhang an die Empfänger unten" : "darunter einmal „E-Mail einrichten“ – danach kommt jeder Bericht auch per Mail"
        ),
        this._mailSetup(ch.mail || []),
        this._hubOpt("report_email") && this._admin ? this._row("Test", `<button class="btn" data-pdftest style="--c:var(--rk-heat)"><ha-icon icon="mdi:email-fast-outline"></ha-icon>${t("Wochenbericht jetzt senden")}</button>`) : ""
      ].join("");
      const yes = (b) => b ? `<span class="ok">● ${t("an")}</span>` : `<span class="no">○ ${t("aus")}</span>`;
      const rowsT = this._orderedRooms().map((r) => {
        const s = r.attrs.settings || {};
        const notif = (this._st(r.sib.notifications) || {}).state === "on";
        const wl = (this._st(r.sib.window_logic) || {}).state === "on";
        const flags = [
          wl ? `<ha-icon icon="mdi:window-open-variant" title="${t("Fensterlogik an")}"></ha-icon>` : "",
          notif ? `<ha-icon icon="mdi:bell-outline" title="${t("Hinweise an")}"></ha-icon>` : "",
          r.attrs.humidity_limit != null ? `<ha-icon icon="mdi:water-percent" title="${fmt(r.attrs.humidity_limit, 0)} %"></ha-icon>` : ""
        ].join("");
        return `<button class="rtile" data-tab="${r.id}" style="--c:${r.color}">
        <span class="rtop"><span class="rname">${r.name}</span><span class="rtyp">${RK_ROOM_TYPES[s.room_type] || s.room_type || "–"}</span></span>
        <span class="rbig">${fmt(r.attrs.comfort_temperature)}<i>°</i></span>
        <span class="rsub">${t("Absenkung")} ${fmt(s.setback_short)} / ${fmt(s.setback_long)} °C</span>
        <span class="rsub">${t("Lüften ab {v} °C", { v: fmt(r.attrs.min_temp) })}</span>
        <span class="rflags">${flags}</span></button>`;
      }).join("");
      const issues = st.issues || [];
      const bad = issues.filter((i) => i.severity !== "info").length;
      const healthTone = issues.some((i) => i.severity === "alert") ? "cold" : bad ? "warn" : "ok";
      const healthExtra = `<span class="chip" style="--tone:${toneVar(healthTone)}">${bad ? t("{n} offen", { n: bad }) : "ok"}</span>`;
      return `<div class="groups">
      ${this._grp("Gesundheit der Heizung", "mdi:heart-pulse", healthTone, rkIssueList(issues, true, this._config.strip_prefix) + `<div class="hint">${t("Prüft alle 10 Minuten: Batterien, Raum wird trotz offenem Ventil nicht warm, Fühler hängt, Funkaussetzer, Fensterkontakt still. Meldungen gehen an alle mit „🩺 Gesundheit“.")}</div>`, "span", healthExtra)}
      ${this._grp("Erste Schritte", "mdi:check-decagram-outline", "ok", this._checkRows(st, ch), "span")}
      ${this._grp("Anwesenheit & Absenkung", "mdi:home-account", "eco", presRows)}
      ${this._grp("Heizsaison & Heizgrenze", "mdi:radiator", "heat", seasRows)}
      ${this._grp("Wer bekommt was", "mdi:account-voice", "air", `${cards}${addRow}`, "span")}
      ${this._grp("Benachrichtigungen allgemein", "mdi:bell-cog-outline", "warn", notiRows)}
      ${this._grp("Schlafenszeiten", "mdi:sleep", "eco", sleepRows, "span")}
      ${this._grp("Gebäude & Schimmelschutz", "mdi:home-city-outline", "ok", buildRows)}
      ${this._grp("Wohnung", "mdi:home-switch-outline", "air", homeRows)}
      ${this._grp("Alle Räume auf einen Blick", "mdi:table", "off", `<div class="roomgrid">${rowsT}</div><div class="hint">${t("Tippe auf einen Raum, um seine Einstellungen zu ändern.")}</div>`, "span")}
      ${this._learnHub(st)}
      ${this._layoutGroup()}
    </div>`;
    }
    // ---------------------------------------------------------------- Darstellung (A3)
    _loadLayout() {
      const home = this._homeId();
      rkLayout(this._hass, home).then((L) => {
        if (JSON.stringify(L) === JSON.stringify(this._layout || {})) return;
        this._layout = L;
        this._sig = null;
        this._render();
      }).catch(() => {
      });
    }
    _layoutSave() {
      const home = this._homeId();
      const L = this._layout || { order: [], hidden: [], size: {}, color: {} };
      rkLayoutRemember(L, home);
      this._hass.callWS({ type: "raumklima/layout/save", home, layout: L }).then(() => {
        rkLayoutChanged(home);
        this._flash(t("Gespeichert"));
      }).catch((e) => this._flash(t("Fehler: {e}", { e: e.message || e })));
    }
    /** Räume in der gepflegten Reihenfolge – „aus" blendet hier bewusst nichts aus. */
    _orderedRooms() {
      return rkRoomsOrdered(this._rooms || [], this._layout);
    }
    _layoutList() {
      const L = this._layout || { order: [], hidden: [], size: {}, color: {} };
      return rkLayoutApply(this._rooms || [], L);
    }
    _layoutGroup() {
      if (!this._layout) {
        return this._grp("Darstellung", "mdi:view-dashboard-outline", "air", this._row("Reihenfolge", this._v("lädt …", true)));
      }
      const L = this._layout;
      const list = this._layoutList();
      const rows = list.map((r, i) => {
        const size = (L.size || {})[r.id] || "big";
        const col = (L.color || {})[r.id] || "";
        const arrow = (dir, glyph, on) => `<button class="mini" data-lmove="${r.id}" data-dir="${dir}" ${on ? "" : "disabled"} aria-label="${dir < 0 ? t("nach oben") : t("nach unten")}">${glyph}</button>`;
        const sizes = [["big", t("große Karte")], ["tile", t("Kachel")], ["off", t("aus")]].map(([k, lab]) => `<button class="chip2 ${size === k ? "" : "off"}" data-lsize="${r.id}" data-v="${k}">${lab}</button>`).join("");
        const dots = RK_LAYOUT_COLORS.map(
          (c) => `<button class="dotbtn ${col === c ? "on" : ""}" style="--c:${c}" data-lcolor="${r.id}" data-v="${c}" aria-label="${c}" title="${c}"></button>`
        ).join("");
        return `<div class="lrow">
        <div class="ltop"><span class="lname">${arrow(-1, "▲", i > 0)}${arrow(1, "▼", i < list.length - 1)}<b>${esc(r.name)}</b></span><div class="chips">${sizes}</div></div>
        <div class="lbot"><span class="llab">${t("Farbe")}</span><div class="dots">${dots}</div></div>
      </div>`;
      }).join("");
      const foot = `<div class="hint">${t("Reihenfolge gilt im generierten Dashboard und in der Übersicht; Größe „Kachel“ blendet die große Raumseite aus, „aus“ versteckt den Raum ganz. Farbe färbt Rand und Akzente der Karte.")}</div>
      <div class="addrow"><button class="btn" data-lsave style="--c:var(--rk-heat)"><ha-icon icon="mdi:content-save-outline"></ha-icon>${t("Speichern")}</button></div>`;
      const look = this._row(t("Dunkler Look"), this._segs("hub", "look_dark", { auto: t("Automatisch"), on: t("Immer dunkel"), off: t("Immer hell") }, this._hubOpt("look_dark") || "auto"), t("gilt für alle Räume und Karten dieser Wohnung"));
      return this._grp("Darstellung", "mdi:view-dashboard-outline", "air", look + rows + foot);
    }
    // ---------------------------------------------------------------- Raum
    // ---------------------------------------------------------------- Zeitpläne
    // Raum-Referenz je Eintrag merken, damit Ereignisse aus dem Zeitplan-Editor immer aus der
    // gespeicherten Konfiguration neu aufsetzen können (Issue #8: sonst überschreibt ein Klick
    // die vorhandenen Zeitfenster mit einer leeren Liste).
    _schedSeed(id) {
      const r = (this._roomRefs || {})[id];
      if (!r) return null;
      const s = r.attrs.settings || {};
      return this._roomOpt(r, "schedules") ?? s.schedules ?? [];
    }
    _schedList(id, stored) {
      this._sched = this._sched || {};
      if (!(id in this._sched)) {
        this._sched[id] = (stored || []).map((w) => ({
          days: [...w.days || []],
          start: w.start || "19:00",
          end: w.end || "21:00",
          temperature: Number(w.temperature ?? 22)
        }));
      }
      return this._sched[id];
    }
    _schedLen(id) {
      return (this._sched[id] || []).length;
    }
    /** Minuten seit Mitternacht. */
    _schedStart(w) {
      const [h, m] = String(w && w.start || "00:00").split(":").map((x) => parseInt(x, 10) || 0);
      return h * 60 + m;
    }
    _schedEnd(w) {
      const [h, m] = String(w && w.end || "00:00").split(":").map((x) => parseInt(x, 10) || 0);
      return h * 60 + m;
    }
    _pushSched(id) {
      const list = (this._sched[id] || []).map((w) => ({
        days: [...w.days || []].sort((a, b) => a - b),
        start: w.start,
        end: w.end,
        temperature: w.temperature
      }));
      this._setRoom(id, { schedules: list }, 700);
    }
    _schedWin(id, w, i, ro) {
      const days = w.days || [];
      const on = (d) => !days.length || days.includes(d);
      const btn = [0, 1, 2, 3, 4, 5, 6].map((d) => `<button class="d ${on(d) ? "on" : ""}" data-schedday="${id}|${i}|${d}" title="${esc(schedDayName(d))}">${esc(schedDayName(d))}</button>`).join("");
      return `<div class="sched">
      <div class="days">${btn}</div>
      <input class="tm inp" type="text" inputmode="numeric" maxlength="5" placeholder="HH:MM" value="${w.start}" data-schedtime="${id}|${i}|start" ${ro ? "disabled" : ""} aria-label="${t("von")}">
      <input class="tm inp" type="text" inputmode="numeric" maxlength="5" placeholder="HH:MM" value="${w.end}" data-schedtime="${id}|${i}|end" ${ro ? "disabled" : ""} aria-label="${t("bis")}">
      <span class="v temp">${fmt(w.temperature)} °C</span>
      ${ro ? "" : `<div class="stepper"><button data-schedtemp="${id}|${i}" data-d="-1" aria-label="${t("weniger")}">−</button><button data-schedtemp="${id}|${i}" data-d="1" aria-label="${t("mehr")}">+</button></div>
      <div class="stepper mv"><button data-schedmove="${id}|${i}|-1" title="${t("nach oben")}" aria-label="${t("nach oben")}" ${i === 0 ? "disabled" : ""}>▲</button><button data-schedmove="${id}|${i}|1" title="${t("nach unten")}" aria-label="${t("nach unten")}" ${i === this._schedLen(id) - 1 ? "disabled" : ""}>▼</button></div>
      <button class="del" data-scheddel="${id}|${i}" title="${t("entfernen")}" aria-label="${t("entfernen")}"><ha-icon icon="mdi:close"></ha-icon></button>`}
    </div>`;
    }
    _scheduleGroup(r, id, editable) {
      this._roomRefs = this._roomRefs || {};
      this._roomRefs[id] = r;
      const s = r.attrs.settings || {};
      const scope = `room:${id}`;
      const ro = !editable;
      const boostTemp = this._roomOpt(r, "boost_temperature") ?? s.boost_temperature ?? 2;
      const boostMin = this._roomOpt(r, "boost_minutes") ?? s.boost_minutes ?? 30;
      const list = this._schedList(id, this._roomOpt(r, "schedules") ?? s.schedules ?? []);
      const fromId = this._roomOpt(r, "schedule_from") ?? s.schedule_from ?? "";
      const others = (this._rooms || []).filter((x) => x.id !== r.id).map((x) => ({ id: (x.attrs.settings || {}).entry_id || x.id, name: x.name }));
      const shared = !!fromId && others.some((o) => o.id === fromId);
      const shareRow = this._row(
        "Zeitplan von",
        editable ? this._select(scope, "schedule_from", [{ id: "", name: t("eigener Zeitplan") }, ...others], fromId) : this._v(shared ? others.find((o) => o.id === fromId).name : t("eigener Zeitplan")),
        shared ? t("Die Zeitfenster werden im gewählten Raum gepflegt – Änderungen gelten hier automatisch mit") : t("Zeitfenster einmal pflegen und für mehrere Räume nutzen")
      );
      const fallback = this._roomOpt(r, "schedule_fallback") ?? s.schedule_fallback ?? "wish";
      const rows = [
        shareRow,
        this._row(
          "Außerhalb der Zeitfenster",
          editable ? this._segs(scope, "schedule_fallback", RK_SCHED_FALLBACK, fallback) : this._v(RK_SCHED_FALLBACK[fallback] || "–"),
          fallback === "wish" ? t("wie bisher: ohne laufendes Fenster gilt die Wunschtemperatur") : fallback === "short" ? t("zwischen den Fenstern wird auf „kurz weg“ abgesenkt") : fallback === "long" ? t("zwischen den Fenstern wird auf „länger weg“ abgesenkt – für Räume, die nur stundenweise genutzt werden") : t("zwischen den Fenstern gilt nur der Frostschutz – der kälteste erlaubte Wert")
        ),
        this._row(
          "Wärmer für kurze Zeit (Boost)",
          editable ? this._optStepper(scope, "boost_temperature", boostTemp, " K", 0.5, 0.5, 5, 1) : this._v(`${fmt(boostTemp, 1)} K`),
          t("so viel wärmer als die Wunschtemperatur – der Knopf „Wärmer“ am Raum startet ihn")
        ),
        this._row(
          "Zeitplan überschreiben",
          editable ? this._optStepper(scope, "override_minutes", this._roomOpt(r, "override_minutes") ?? s.override_minutes ?? 120, " min", 15, 0, 480) : this._v(`${this._roomOpt(r, "override_minutes") ?? s.override_minutes ?? 120} min`),
          t("so lange gilt deine Handverstellung (HA oder Alexa), danach wieder der Zeitplan – 0 schaltet es aus")
        ),
        this._row(
          "Dauer des Boosts",
          editable ? this._optStepper(scope, "boost_minutes", boostMin, " min", 5, 5, 240) : this._v(`${boostMin} min`),
          t("danach gilt wieder Zeitplan bzw. Automatik")
        )
      ];
      if (!list.length) {
        rows.push(this._row("Zeitfenster", this._v("keine – die Automatik regelt wie gewohnt", true), t("z. B. abends 19–21 Uhr wärmer")));
      } else {
        list.forEach((w, i) => rows.push(this._row(t("Zeitfenster {n}", { n: i + 1 }), this._schedWin(id, w, i, ro), esc(schedDaysLabel(w.days)))));
      }
      if (!ro && list.length && !shared) {
        rows.push(`<div class="row"><div class="l"><span class="lbl"></span></div><div class="addrow"><button class="add" data-schedsort="${id}"><ha-icon icon="mdi:sort-clock-ascending-outline"></ha-icon>${t("nach Uhrzeit sortieren")}</button><span class="hint">${t("Reihenfolge zählt nur, wenn sich Fenster überschneiden – dann gewinnt das untere")}</span></div></div>`);
      }
      if (!ro && list.length < 6 && !shared) {
        rows.push(`<div class="row"><div class="l"><span class="lbl"></span></div><div><button class="add" data-schedadd="${id}"><ha-icon icon="mdi:plus"></ha-icon>${t("Zeitfenster hinzufügen")}</button></div></div>`);
      }
      return this._grp("Zeitplan", "mdi:calendar-clock", "eco", rows.join(""), "span");
    }
    // ---------------------------------------------------------------- Lüften ohne Erinnerung
    _airList(id, stored) {
      this._air = this._air || {};
      if (!(id in this._air)) {
        this._air[id] = (stored || []).map((w) => ({
          days: [...w.days || []],
          start: w.start || "04:45",
          end: w.end || "06:30"
        }));
      }
      return this._air[id];
    }
    _pushAir(id) {
      const list = (this._air[id] || []).map((w) => ({ days: [...w.days || []].sort((a, b) => a - b), start: w.start, end: w.end }));
      this._setRoom(id, { airing_windows: list }, 700);
    }
    _airWin(id, w, i, ro) {
      const days = w.days || [];
      const on = (d) => !days.length || days.includes(d);
      const btn = [0, 1, 2, 3, 4, 5, 6].map((d) => `<button class="d ${on(d) ? "on" : ""}" data-airday="${id}|${i}|${d}" title="${esc(schedDayName(d))}">${esc(schedDayName(d))}</button>`).join("");
      return `<div class="sched">
      <div class="days">${btn}</div>
      <input class="tm inp" type="text" inputmode="numeric" maxlength="5" placeholder="HH:MM" value="${w.start}" data-airtime="${id}|${i}|start" ${ro ? "disabled" : ""} aria-label="${t("von")}">
      <input class="tm inp" type="text" inputmode="numeric" maxlength="5" placeholder="HH:MM" value="${w.end}" data-airtime="${id}|${i}|end" ${ro ? "disabled" : ""} aria-label="${t("bis")}">
      ${ro ? "" : `<button class="del" data-airdel="${id}|${i}" title="${t("entfernen")}" aria-label="${t("entfernen")}"><ha-icon icon="mdi:close"></ha-icon></button>`}
    </div>`;
    }
    _airingGroup(r, id, editable) {
      const s = r.attrs.settings || {};
      const scope = `room:${id}`;
      const ro = !editable;
      const airMin = this._roomOpt(r, "airing_min_minutes") ?? s.airing_min_minutes ?? 0;
      const recMin = r.attrs.recommended_minutes ?? 10;
      const longMin = this._roomOpt(r, "long_airing_minutes") ?? s.long_airing_minutes ?? 20;
      const lateMin = this._roomOpt(r, "long_airing_remind") ?? s.long_airing_remind ?? 90;
      const learn = this._roomOpt(r, "learn_airing") ?? s.learn_airing ?? true;
      const learned = Number(s.airing_learned || 0);
      const list = this._airList(id, this._roomOpt(r, "airing_windows") ?? s.airing_windows ?? []);
      const presEff = this._roomOpt(r, "presence_sensors") ?? Object.keys(s.presence_sensors || {});
      const rows = [
        this._row(
          "Mindestdauer Lüften",
          editable ? this._optStepper(scope, "airing_min_minutes", airMin, " min", 1, 0, 30) : this._v(airMin ? `${airMin} min` : t("automatisch")),
          airMin ? t("so lange bleibt „Lüften läuft“ mindestens stehen, auch wenn die Feuchte schon passt") : t("automatisch: 60 % der empfohlenen Dauer, mindestens 4 Minuten (gerade {v} min)", { v: recMin })
        ),
        this._row(
          "Dauerlüftung ab",
          editable ? this._optStepper(scope, "long_airing_minutes", longMin, " min", 5, 0, 180) : this._v(`${longMin} min`),
          t("danach keine Erinnerungen mehr, bis das Fenster zu ist – 0 schaltet es aus")
        ),
        this._row(
          "Leise Erinnerung danach",
          editable ? this._optStepper(scope, "long_airing_remind", lateMin, " min", 15, 0, 240) : this._v(`${lateMin} min`),
          t("eine einzige, stille Meldung bei sehr langem Lüften – 0 = aus")
        ),
        ...presEff.length ? [this._row(
          "Nur wenn jemand im Raum war",
          editable ? this._optToggle(scope, "airing_occupied_only", this._roomOpt(r, "airing_occupied_only") ?? s.airing_occupied_only ?? true) : this._v(this._roomOpt(r, "airing_occupied_only") ?? s.airing_occupied_only ?? true ? t("an") : t("aus")),
          t("kein „bitte lüften“ in leeren Räumen – nur mit Präsenzmelder möglich")
        )] : [],
        this._row(
          "Gewohntes Lüften erkennen",
          editable ? this._optToggle(scope, "learn_airing", !!learn) : this._v(learn ? t("an") : t("aus")),
          learned ? t("erkannt: {n}× im gleichen Zeitraster (4 Wochen)", { n: learned }) : t("lernt, wann du regelmäßig länger lüftest – dort dann keine Erinnerungen")
        )
      ];
      if (!list.length) {
        rows.push(this._row("Lüftfenster", this._v("keine – es wird normal erinnert", true), t("z. B. Training morgens: in dieser Zeit keine Hinweise")));
      } else {
        list.forEach((w, i) => rows.push(this._row(t("Lüftfenster {n}", { n: i + 1 }), this._airWin(id, w, i, ro), esc(schedDaysLabel(w.days)))));
      }
      if (!ro && list.length < 6) {
        rows.push(`<div class="row"><div class="l"><span class="lbl"></span></div><div><button class="add" data-airadd="${id}"><ha-icon icon="mdi:plus"></ha-icon>${t("Zeitfenster hinzufügen")}</button></div></div>`);
      }
      return this._grp("Lüften ohne Erinnerung", "mdi:weather-windy-variant", "air", rows.join(""), "span");
    }
    _room(r) {
      const a = r.attrs, s = a.settings || {}, sib = r.sib;
      const mon = a.monitor === true;
      const cfgRoom = this._cfgRoom(r);
      const id = s.entry_id;
      const scope = `room:${id}`;
      const sync = RK_SYNC[a.sync] || ["–", "off"];
      const contacts = (a.window_entities || []).map((w) => {
        const st = this._st(w);
        const open = !!(st && rkWindowOpen(this._hass, w));
        return `<span class="chip2" style="--c:${open ? "var(--rk-air)" : "var(--rk-off)"}"><i></i>${esc(this._name(w).replace(/^.*?(fenster|window)/i, (m, x) => x))} · ${open ? t("offen") : t("zu")}</span>`;
      }).join("") || `<span class="v mute">${t("keine")}</span>`;
      const offTxt = a.offset !== void 0 && a.offset !== null ? t("aktuell {v} °C", { v: (a.offset > 0 ? "+" : "") + fmt(a.offset, 1) }) : "";
      const comfort = this._roomOpt(r, "comfort_temperature") ?? a.comfort_temperature;
      const roomType = this._roomOpt(r, "room_type") ?? s.room_type;
      const sbShort = this._roomOpt(r, "setback_short") ?? s.setback_short;
      const sbLong = this._roomOpt(r, "setback_long") ?? s.setback_long;
      const wOpen = this._roomOpt(r, "window_open_delay") ?? s.window_open_delay;
      const wClose = this._roomOpt(r, "window_close_delay") ?? s.window_close_delay;
      const nightMode = this._roomOpt(r, "night_airing") ?? s.night_airing ?? "auto";
      const moldMode = this._roomOpt(r, "mold_mode") ?? s.mold_mode ?? "strict";
      const virtMode = this._roomOpt(r, "virtual_window") ?? s.virtual_window ?? "auto";
      const editable = this._admin && cfgRoom;
      const push = Object.keys(this._cfg && this._cfg.hub && this._cfg.hub.options.recipients || {});
      const plan = a.plan_reason && a.plan_reason !== "normal" ? planText(a, false) : null;
      const rIssues = (this._cfg && this._cfg.hub && this._cfg.hub.state && this._cfg.hub.state.issues || []).filter((i) => i.entry_id === id);
      return `<div class="groups">
      ${rIssues.length ? this._grp("Gesundheit", "mdi:heart-pulse", rIssues.some((i) => i.severity === "alert") ? "cold" : "warn", rkIssueList(rIssues, false), "span") : ""}
      ${a.monitor ? this._grp("Überwachung", "mdi:eye-outline", "eco", [
        this._row("Kein Thermostat", this._v("nur Messen und Hinweise", true), "Temperatur, Feuchte, CO₂ und Lüftungshinweise – ohne Heizungsregelung. Ein Thermostat lässt sich später in der Integration nachtragen.")
      ].join(""), "span") : ""}
      ${a.monitor ? "" : this._grp("Temperatur", "mdi:thermometer", "heat", [
        plan ? `<div class="status"><span class="chip" style="--tone:var(--rk-eco)"><ha-icon icon="mdi:information-outline"></ha-icon>${plan}</span></div>` : "",
        this._row("Wunschtemperatur", editable ? this._optStepper(scope, "comfort_temperature", comfort, " °C", 0.5, 12, 26, 1) : this._v(`${fmt(comfort)} °C`), "beim Einschalten und als Grundwert"),
        this._row(
          "Raumtyp",
          editable ? this._select(scope, "room_type", Object.entries(RK_ROOM_TYPES).map(([k, v]) => ({ id: k, name: v })), roomType) : this._v(RK_ROOM_TYPES[roomType] || "–"),
          t("jederzeit änderbar – Standardwerte des neuen Typs werden übernommen, eigene Werte bleiben")
        ),
        this._row(
          "Bauart",
          editable ? this._select(scope, "wall", Object.entries(RK_WALL).map(([k, v]) => ({ id: k, name: v })), this._roomOpt(r, "wall") ?? "auto") : this._v(RK_WALL[this._roomOpt(r, "wall") ?? "auto"]),
          t("bestimmt, wie kalt die kälteste Wandstelle wird: eine Außenecke braucht mehr Schutz als eine Innenwand")
        ),
        (this._cfg && this._cfg.homes || []).length > 1 ? this._row("Wohnung", editable ? this._select(scope, "home", this._cfg.homes.map((h) => ({ id: h.entry_id, name: h.name })), a.home || "") : this._v(esc(a.home_name || "–")), "Raum gehört zu dieser Wohnung (Bewohner, Zone, Empfänger)") : "",
        this._row(
          "Sonnenseite",
          editable ? this._optToggle(scope, "solar_gain", !!(this._roomOpt(r, "solar_gain") ?? s.solar_gain)) : this._v(s.solar_gain ? "ja" : "nein"),
          a.plan_reason === "solar" ? "gerade: Sonne erwartet – 1 °C weniger" : t("bei Sonne 1 °C weniger heizen – die Sonne wärmt mit")
        ),
        (() => {
          const fac = this._roomOpt(r, "solar_facade") ?? s.solar_facade ?? "";
          return `<details class="adv"${fac ? " open" : ""}><summary>${t("Erweitert: Sonneneintrag")}</summary>${this._row(
            "Sonne kommt aus",
            editable ? this._select(scope, "solar_facade", RK_FACADES(), fac) : this._v(rkFacadeName(fac)),
            t("Richtung, in die die Fenster dieses Raums zeigen – vereinfacht, freie Sicht vorausgesetzt. Haus, Baum, Balkon oder ein tiefes Gewände davor zählt nicht mit; dann lieber leer lassen (nur Vorhersage). Bei zwei Fensterseiten: die mit der größeren Glasfläche.")
          )}</details>`;
        })(),
        this._row("Absenkung „kurz weg“", editable ? this._optStepper(scope, "setback_short", sbShort, " °C", 0.5, 10, 24, 1) : this._v(`${fmt(sbShort)} °C`), "wenn alle weg sind"),
        this._row(
          "Aufheizen",
          this._v(s.heatup && s.heatup.minutes_2k != null ? t("~{m} min für +2 °C", { m: s.heatup.minutes_2k }) : t("lernt noch ({n}/3)", { n: s.heatup && s.heatup.episodes || 0 }), !(s.heatup && s.heatup.minutes_2k != null)),
          (() => {
            const pm = this._roomOpt(r, "preheat_mode") ?? "auto";
            const rows = [this._row(
              "Vorheizen",
              editable ? this._segs(scope, "preheat_mode", RK_PREHEAT, pm) : this._v(RK_PREHEAT[pm] || "–"),
              pm === "off" ? t("heizt erst zum Beginn des Zeitfensters – der Raum ist dann noch kalt") : pm === "auto" ? t("startet so früh, wie die gelernte Aufheizzeit es verlangt") : pm === "clock" ? t("startet nicht vor der eingestellten Uhrzeit – zum Beginn evtl. noch nicht ganz warm") : t("startet höchstens so viele Minuten vor dem Zeitfenster")
            )];
            if (pm === "clock") {
              const cur = this._roomOpt(r, "preheat_not_before") ?? "05:00";
              const items = Array.from({ length: 24 }, (_x, h) => ({ id: `${String(h).padStart(2, "0")}:00`, name: t("ab {h}:00", { h }) }));
              rows.push(this._row("… nicht vor", editable ? this._select(scope, "preheat_not_before", items, cur) : this._v(cur)));
            }
            if (pm === "lead") {
              const lead = this._roomOpt(r, "preheat_lead_min") ?? 90;
              rows.push(this._row("… höchstens", editable ? this._optStepper(scope, "preheat_lead_min", lead, " min", 15, 15, 360) : this._v(`${lead} min`), t("so viele Minuten vor dem Zeitfenster")));
            }
            return rows.join("");
          })(),
          (() => {
            const pt = Number(this._roomOpt(r, "presence_target") || 0);
            return this._row(
              "Bei Anwesenheit",
              editable ? this._optStepper(scope, "presence_target", pt, " °C", 0.5, 0, 30) : this._v(pt ? `${pt} °C` : t("aus")),
              pt ? t("so warm, solange ein Melder jemanden im Raum sieht") : t("0 °C = aus; sonst gilt der Zeitplan")
            );
          })(),
          s.heatup && s.heatup.rate ? t("{r} °C/h bei aktuellem Wetter · aus {n} Aufheizvorgängen · steuert, wann vorgeheizt wird", { r: fmt(s.heatup.rate, 1), n: s.heatup.episodes }) : "danach heizt die Wohnung rechtzeitig vor, bevor jemand ankommt"
        ),
        this._row("Absenkung „länger weg“", editable ? this._optStepper(scope, "setback_long", sbLong, " °C", 0.5, 8, 22, 1) : this._v(`${fmt(sbLong)} °C`), "ab 24 h oder Urlaub – Schimmelschutz hält feuchte Räume wärmer"),
        (() => {
          const qm = this._roomOpt(r, "quiet_mode") ?? "auto";
          return this._row(
            "Nachtabsendung",
            editable ? this._segs(scope, "quiet_mode", RK_QUIET, qm) : this._v(RK_QUIET[qm] || "–"),
            qm === "off" ? t("wird nachts nicht abgesenkt") : qm === "on" ? t("wird abgesenkt, sobald Ruhezeit ist oder der Schalter „Nachtruhe“ an ist") : t("wie bisher: nur Schlafzimmer und selten genutzte Räume")
          );
        })(),
        (() => {
          const persons = this._cfg && this._cfg.choices && this._cfg.choices.persons || [];
          if (!persons.length) return "";
          const cur = this._roomOpt(r, "room_persons") ?? s.room_persons ?? [];
          return this._row(
            "Gilt für Personen",
            `<div class="chips">${persons.map((p) => `<button class="chip2 ${cur.includes(p.id) ? "" : "off"}" data-roomperson="${p.id}" data-entry="${id}" ${editable ? "" : "disabled"}><i></i>${esc(p.name)}</button>`).join("")}</div>`,
            cur.length ? t("nur wenn eine dieser Personen zu Hause ist – sonst wird der Raum abgesenkt") : t("keine Auswahl = der Raum gilt allen Bewohnern")
          );
        })()
      ].join(""))}
      ${mon ? "" : this._scheduleGroup(r, id, editable)}
      ${this._grp("Lüften & Feuchte", "mdi:water-percent", "air", [
        sib.humidity_limit ? this._row("Feuchtegrenze", this._numStepper(sib.humidity_limit, " %", 0), "ab hier: „Bitte lüften“") : this._row("Feuchtefühler", this._v("keiner", true)),
        this._row("Mindesttemperatur beim Lüften", this._numStepper(sib.min_temp, " °C", 1), "darunter: „Raum kühlt aus“"),
        this._row("Max. Abkühlung beim Lüften", this._numStepper(sib.max_drop, " °C", 1)),
        this._row("Jetzt", this._v(a.current_humidity != null ? t("{h} % · Taupunkt {d} °C", { h: fmt(a.current_humidity, 0), d: fmt(a.dew_point) }) : "–")),
        this._row("Empfohlene Lüftdauer", this._v(a.recommended_minutes ? `${a.recommended_minutes} min` : "–"), a.outdoor_temperature != null ? t("bei {v} °C draußen", { v: fmt(a.outdoor_temperature) }) : "")
      ].join(""))}
      ${this._grp("Fenster", "mdi:window-open-variant", "ok", [
        mon ? "" : this._row("Heizung bei offenem Fenster pausieren", this._toggle(sib.window_logic)),
        mon ? "" : this._row("Pause nach", editable ? this._optStepper(scope, "window_open_delay", wOpen, " s", 5, 0, 600) : this._v(`${wOpen ?? "–"} s`)),
        mon ? "" : this._row("Weiter nach", editable ? this._optStepper(scope, "window_close_delay", wClose, " s", 5, 0, 600) : this._v(`${wClose ?? "–"} s`)),
        mon ? "" : this._row(
          "Schimmelschutz",
          editable ? this._segs(scope, "mold_mode", RK_MOLD, moldMode) : this._v(RK_MOLD[moldMode] || "–"),
          moldMode === "strict" ? t("hebt den Sollwert so weit an, dass die kälteste Wandstelle unter 80 % Feuchte bleibt (DIN 4108-2) – begrenzt durch den Zuschlag darunter") : moldMode === "wish" ? t("hebt nur bis zur Wunschtemperatur an – tiefer wird nicht abgesenkt, aber auch nicht darüber geheizt") : t("kein Feuchte-Boden: der Raum fährt genau den eingestellten Wert – bei hoher Feuchte droht Schimmel an kalten Wänden")
        ),
        !mon && moldMode !== "off" ? this._row(
          "Höchstens anheben um",
          editable ? this._optStepper(
            scope,
            "mold_cap",
            this._roomOpt(r, "mold_cap") ?? s.mold_cap ?? 2.5,
            " K",
            0,
            6,
            0.5,
            1
          ) : this._v(`${fmt(this._roomOpt(r, "mold_cap") ?? s.mold_cap ?? 2.5)} K`),
          t("Heizen löst kein Feuchteproblem: über diesem Zuschlag wird nicht weiter geheizt, sondern zum Lüften geraten (nachts 1,5 K)")
        ) : "",
        this._row(
          "Schlafen bei offenem Fenster",
          editable ? this._segs(scope, "night_airing", RK_NIGHT, nightMode) : this._v(RK_NIGHT[nightMode] || "–"),
          nightMode === "auto" ? ["bedroom", "rarely_used"].includes(roomType) ? "Automatisch: ja, weil Schlafraum" : "Automatisch: nein, kein Schlafraum" : "abends geöffnet = Nachtlüften: keine Lüft-Hinweise, Heizung wartet"
        ),
        this._row("Kontakte", `<div class="chips">${contacts}</div>`),
        mon ? "" : this._row(
          "Offenes Fenster an Temperatursturz erkennen",
          editable ? this._segs(scope, "virtual_window", RK_NIGHT, virtMode) : this._v(RK_NIGHT[virtMode] || "–"),
          (a.window_virtual ? t("gerade: Fenster vermutlich offen · ") : "") + t(virtMode === "auto" ? s.virtual_active ? "Automatisch: aktiv (kein Kontakt erreichbar)" : "Automatisch: aus, der Kontakt meldet zuverlässig" : "fällt es in 6 min um 1 °C, pausiert die Heizung bis es wieder wärmer wird")
        )
      ].join(""))}
      ${this._airingGroup(r, id, editable)}
      ${this._presenceGroup(r, id, editable)}
      ${this._learnRoom(r)}
      ${this._lightGroup(r, id, editable)}
      ${this._grp("Benachrichtigungen", "mdi:bell-outline", "warn", [
        this._row("Hinweise für diesen Raum", this._toggle(sib.notifications)),
        this._row(
          "Höchstens je Tag",
          editable ? this._select(
            scope,
            "notify_cap",
            [0, 2, 3, 5, 10].map((v) => ({ id: String(v), name: v === 0 ? t("unbegrenzt") : t("{n} je Tag", { n: v }) })),
            String(this._roomOpt(r, "notify_cap") ?? 3)
          ) : this._v(this._roomOpt(r, "notify_cap") === 0 ? t("unbegrenzt") : t("{n} je Tag", { n: this._roomOpt(r, "notify_cap") ?? 3 })),
          t("gilt für wiederkehrende Hinweise (Bitte lüften, Fenster bleibt offen) – Fenster schließen und Luft ausgetauscht bleiben frei")
        ),
        this._row("Empfänger", push.length ? `<div class="chips">${push.map((tg) => `<span class="chip2"><i></i>${esc(rkPretty(tg))}</span>`).join("")}</div>` : this._v("niemand", true), "zentral unter Allgemein → Wer bekommt was")
      ].join(""))}
      ${this._grp(mon ? "Fühler & Sensoren" : "Thermostat & Fühler", mon ? "mdi:thermometer-lines" : "mdi:radiator", "off", [
        mon ? "" : this._row("Thermostat", this._v(esc(this._name(s.trv))), [(s.extra_trvs || []).length ? "Haupt-Thermostat" : "", s.valve_reported === false ? t("meldet keine Ventilöffnung") : ""].filter(Boolean).join(" · ")),
        !mon && (s.extra_trvs || []).length ? this._row("Weitere Thermostate", `<div class="chips">${s.extra_trvs.map((x) => `<span class="chip2" style="--c:${!x.available ? "var(--rk-cold)" : x.sync === "ok" ? "var(--rk-ok)" : "var(--rk-warn)"}" title="${esc(x.entity_id)}${x.setpoint_expected != null ? ` · ${t("erwartet {v}°", { v: fmt(x.setpoint_expected) })}` : ""}"><i></i>${esc(x.name)} · ${x.available ? `${fmt(x.temperature)}° → ${fmt(x.setpoint)}°${x.valve != null ? ` · ${fmt(x.valve, 0)} %` : ""}` : t("nicht erreichbar")}</span>`).join("")}</div>`, "bekommen dieselben Befehle, jedes mit eigener Prüfung und eigenem Korrekturwert") : "",
        mon ? "" : this._row(
          "Schnellere Abfrage",
          editable ? this._optToggle(scope, "fast_poll", !!(this._roomOpt(r, "fast_poll") ?? s.fast_poll)) : this._v(this._roomOpt(r, "fast_poll") ?? s.fast_poll ? t("an") : t("aus")),
          t("fragt das Thermostat alle 2 Minuten aktiv ab – für träge Geräte (Homematic & Co.), kostet Funk und Batterie")
        ),
        mon ? "" : this._row(
          "Antwortzeit des Geräts",
          editable ? this._select(
            scope,
            "trv_interval",
            [
              { id: "0", name: t("automatisch lernen") },
              { id: "1", name: t("1 Minute") },
              { id: "5", name: t("5 Minuten") },
              { id: "15", name: t("15 Minuten") },
              { id: "30", name: t("30 Minuten") }
            ],
            String(this._roomOpt(r, "trv_interval") ?? s.trv_interval ?? 0)
          ) : this._v(this._roomOpt(r, "trv_interval") || t("automatisch")),
          t("wie lange das Gerät schweigen darf, ohne als ausgefallen zu gelten – automatisch lernt es aus den Funkpausen (FRITZ!DECT braucht ~15 Minuten)")
        ),
        this._row("Temperaturfühler", this._v(esc(this._name(a.temperature_sensor)))),
        this._row("Feuchtefühler", this._v(a.humidity_entity ? esc(this._name(a.humidity_entity)) : "keiner", !a.humidity_entity)),
        this._row("CO₂-Sensor", this._v(s.co2_sensor ? esc(this._name(s.co2_sensor)) : "keiner", !s.co2_sensor), s.co2_sensor ? t("ab der Grenze unten: Bitte lüften") : ""),
        this._row(
          "CO₂-Grenze",
          editable ? this._select(
            scope,
            "co2_limit",
            [800, 1e3, 1200, 1500].map((v) => ({ id: String(v), name: `${v} ppm` })),
            String(this._roomOpt(r, "co2_limit") ?? 1e3)
          ) : this._v(`${this._roomOpt(r, "co2_limit") ?? 1e3} ppm`),
          t("1000 ppm ist der klassische Richtwert – in einem Wohnzimmer mit mehreren Personen liegt man abends dauerhaft darüber, 1200 ppm sind dort realistischer")
        ),
        this._row("Feinstaubfühler", this._v(s.pm25_sensor ? esc(this._name(s.pm25_sensor)) : "keiner", !s.pm25_sensor), s.pm25_sensor ? "PM2,5 – ab 35 µg/m³: „Bitte lüften“" : ""),
        mon ? "" : this._row(
          "Kalibrierung",
          editable ? this._segs(scope, "calibration_mode", s.calibration_entity ? RK_CAL : { target: RK_CAL.target, none: RK_CAL.none }, s.calibration_mode || "target") : this._v(RK_CAL[s.calibration_mode] || "–"),
          s.calibration_mode === "target" ? t("auch „Abgleich“ genannt: das Gerät kennt keinen Offset – Raumklima verschiebt stattdessen den Sollwert um die Abweichung zwischen Fühler und Thermostat") : offTxt
        ),
        mon ? "" : this._row("Einschalten mit", this._v(s.on_preset === "auto_detect" || !s.on_preset ? t("Automatisch") : t("Preset „{p}“", { p: esc(s.on_preset) }))),
        mon ? "" : this._row("Ausschalten über", this._v(RK_OFF[s.off_method] || s.off_method || "–")),
        mon ? "" : this._row("Drehen am Thermostat übernehmen", this._v(s.follow_trv ? t("ja") : t("nein"))),
        mon ? "" : this._row("Übertragung", `<span class="v" style="color:${toneVar(sync[1])}">● ${sync[0]}</span>`, t("prüft nach {s} s · bis zu {n} Wiederholungen", { s: s.sync_verify_delay ?? "–", n: s.sync_max_retries ?? "–" }))
      ].join(""), "span cols")}
    </div>
    <div class="foot">
      ${sib.calibrate ? `<button class="btn" data-press="${sib.calibrate}" style="--c:var(--rk-heat)"><ha-icon icon="mdi:tune-vertical"></ha-icon>${t("Jetzt kalibrieren")}</button>` : ""}
      <button class="btn primary" data-nav="/config/integrations/integration/raumklima"><ha-icon icon="mdi:cog"></ha-icon>${t("Geräte & Technik ändern")}</button>
    </div>
    <div class="hint">${t("Werte mit + / − werden nach kurzer Pause gespeichert; der Raum übernimmt sie sofort. Geräte (Thermostat, Fühler, Kontakte) und Technik änderst du unter „Geräte & Technik ändern“ → Zahnrad beim Raum „{r}“.", { r: esc(r.name) })}</div>`;
    }
    _mailSetup(mailServices = []) {
      const o = (k) => this._mailForm && this._mailForm[k] !== void 0 ? this._mailForm[k] : this._hubOpt(k) ?? "";
      const cur = String(this._hubOpt("report_email") || "");
      const viaService = cur.startsWith("notify.");
      const active = cur === "raumklima";
      const ok = active && !!(this._hubOpt("mail_server") && this._hubOpt("mail_to"));
      const open = this._mailOpen ?? (active && !ok);
      const dis = this._admin ? "" : "disabled";
      const sec = o("mail_security") || "starttls";
      const provs = Object.entries(RK_MAIL_PROVIDERS).map(([k, p]) => `<option value="${k}" ${p[0] === o("mail_server") ? "selected" : ""}>${esc(p[3])}</option>`).join("");
      const field = (key, label, type = "text", ph = "", hint = "") => `<label class="mf"><span>${t(label)}${hint ? `<small>${t(hint)}</small>` : ""}</span>
      <input class="inp" data-mail="${key}" type="${type}" value="${type === "password" ? "" : esc(String(o(key)))}" placeholder="${esc(ph)}" autocomplete="${type === "password" ? "new-password" : "off"}" ${dis}></label>`;
      return `<details class="mailbox" ${open ? "open" : ""} data-mailbox>
      <summary><ha-icon icon="mdi:email-outline"></ha-icon>${t("E-Mail einrichten")} ${viaService ? `<span class="ok">● ${t("über {s}", { s: esc(rkPretty(cur)) })}</span>` : ok ? `<span class="ok">● ${t("eingerichtet")}</span>` : `<span class="no">○ ${t("noch nicht eingerichtet")} – ${t("hier antippen")}</span>`}</summary>
      <div class="mailform">
        <label class="mf"><span>${t("Anbieter")}<small>${t("füllt Server, Port und Verschlüsselung aus")}</small></span>
          <div class="segs mailprov">${Object.entries(RK_MAIL_PROVIDERS).map(([k, p]) => `<button class="${p[0] === o("mail_server") ? "on" : ""}" data-mailprov="${k}" ${dis}>${esc(p[3])}</button>`).join("")}<button data-mailprov="other" ${dis}>${t("Anderer Anbieter")}</button></div></label>
        ${field("mail_user", "Benutzer", "email", "name@gmx.de", "meist deine E-Mail-Adresse")}
        ${field("mail_password", "Passwort", "password", this._hubOpt("mail_password_set") ? t("gespeichert – leer lassen zum Behalten") : "", "bei Gmail, iCloud, Outlook: App-Passwort")}
        ${field("mail_to", "Empfänger", "text", "ich@example.de, partner@example.de", "mehrere mit Komma")}
        <details class="adv"><summary>${t("Server-Einstellungen")}</summary>
          ${field("mail_server", "Server", "text", "smtp.example.de")}
          ${field("mail_port", "Port", "number", "587")}
          <label class="mf"><span>${t("Verschlüsselung")}</span><div class="segs">${["starttls", "ssl", "none"].map((v) => `<button class="${v === sec ? "on" : ""}" data-mailsec="${v}" ${dis}>${{ starttls: "STARTTLS", ssl: "SSL/TLS", none: t("keine") }[v]}</button>`).join("")}</div></label>
          ${field("mail_from", "Absender", "email", "", "leer = Benutzer")}
        </details>
        <div class="mailact"><button class="btn" data-mailcheck ${dis}><ha-icon icon="mdi:shield-check-outline"></ha-icon>${t("Zugang prüfen")}</button><button class="btn primary" data-mailsave ${dis}><ha-icon icon="mdi:email-check-outline"></ha-icon>${t("Speichern & Test-Mail senden")}</button></div>
        ${this._mailSteps ? `<div class="msteps">${this._mailSteps.map((s) => `<div class="mstep ${s.ok ? "ok" : "bad"}"><b>${s.ok ? "✓" : "✕"}</b><span><b>${esc(t({ connect: "Server erreichbar", tls: "Verschlüsselung", login: "Anmeldung", recipients: "Empfänger" }[s.step] || s.step))}</b> – ${esc(s.msg)}</span></div>`).join("")}</div>` : ""}
        ${this._mailMsg ? `<div class="hint ${this._mailMsg[0]}">${esc(this._mailMsg[1])}</div>` : ""}
        ${mailServices.length || viaService ? `<label class="mf"><span>${t("Oder vorhandenen Mail-Dienst nutzen")}<small>${t("statt der Zugangsdaten oben")}</small></span>
          <select class="sel" data-sel="hub" data-key="report_email" ${dis}><option value="${active ? "raumklima" : ""}">${t("– nein, Zugangsdaten oben –")}</option>${[.../* @__PURE__ */ new Set([...mailServices, ...viaService ? [cur] : []])].map((n) => `<option value="${esc(n)}" ${n === cur ? "selected" : ""}>${esc(rkPretty(n))}</option>`).join("")}</select></label>` : ""}
        <div class="hint">${t("Das Passwort wird nur in Home Assistant gespeichert und nie angezeigt. Tipp: Für Gmail unter myaccount.google.com → Sicherheit → App-Passwörter ein eigenes Passwort für Raumklima erstellen.")}</div>
      </div></details>`;
    }
    _presenceGroup(r, id, editable) {
      const a = r.attrs, s = a.settings || {};
      const scope = `room:${id}`;
      const kinds = s.presence_sensors || {};
      const list = this._roomOpt(r, "presence_sensors") ?? Object.keys(kinds);
      const all = this._cfg && this._cfg.choices && this._cfg.choices.presence || [];
      const info = Object.fromEntries(all.map((x) => [x.id, x]));
      const kindOf = (e) => kinds[e] || info[e] && info[e].kind || "pir";
      const badge = (k) => `<b class="kb">${k === "mmwave" ? "mmWave" : "PIR"}</b>`;
      const chips = list.map((e) => {
        const on = this._st(e) && this._st(e).state === "on";
        return `<span class="chip2" style="--c:${on ? "var(--rk-ok)" : "var(--rk-off)"}"><i></i>${esc(info[e] && info[e].name || this._name(e))} ${badge(kindOf(e))}${editable ? ` <button class="mini x" data-presrm="${esc(e)}" data-entry="${id}" title="${t("entfernen")}">✕</button>` : ""}</span>`;
      }).join("");
      const avail = all.filter((x) => !list.includes(x.id));
      const eco = this._roomOpt(r, "room_eco") ?? s.room_eco ?? "auto";
      const after = this._roomOpt(r, "room_eco_after") ?? s.room_eco_after ?? 30;
      const drop = this._roomOpt(r, "room_eco_drop") ?? s.room_eco_drop ?? 1.5;
      const pk = this._roomOpt(r, "presence_kind") ?? s.presence_kind ?? "auto";
      const state = a.occupied === true ? t("jemand im Raum") : a.occupied === false ? a.room_eco ? t("leer – abgesenkt") : t("leer") : t("unbekannt");
      return this._grp("Präsenzmelder", "mdi:motion-sensor", "ok", [
        list.length ? `<div class="status"><span class="chip" style="--tone:${a.occupied ? "var(--rk-ok)" : "var(--rk-off)"}"><ha-icon icon="${a.occupied ? "mdi:account" : "mdi:account-off-outline"}"></ha-icon>${state}</span></div>` : "",
        this._row("Melder", `<div class="chips">${chips || this._v("keine", true)}</div>`, "mmWave (Radar) sieht auch Stillsitzende · PIR nur Bewegung"),
        editable && avail.length ? `<div class="addrow"><select class="sel" id="addPres-${id}">${avail.map((x) => `<option value="${esc(x.id)}">${esc(x.name)} (${x.kind === "mmwave" ? "mmWave" : "PIR"})</option>`).join("")}</select><button class="btn" data-presadd="${id}" style="--c:var(--rk-ok)"><ha-icon icon="mdi:plus"></ha-icon>${t("Melder hinzufügen")}</button></div>` : "",
        list.length ? this._row("Art", editable ? this._segs(scope, "presence_kind", RK_PKIND, pk) : this._v(RK_PKIND[pk]), "Automatisch: Bewegung = PIR, Anwesenheit/Belegung = mmWave. Leer nach 3 min (mmWave) bzw. 20 min (PIR) ohne Meldung") : "",
        list.length ? this._row(
          "Leeren Raum absenken",
          editable ? this._segs(scope, "room_eco", RK_NIGHT, eco) : this._v(RK_NIGHT[eco]),
          eco === "auto" ? s.room_eco_enabled ? "Automatisch: ja (mmWave, passender Raumtyp)" : "Automatisch: nein – nur Wohnraum, Küche, selten genutzt und nur mit mmWave" : ""
        ) : "",
        list.length && (eco === "on" || eco === "auto" && s.room_eco_enabled) ? this._row("… wenn leer seit", editable ? this._optStepper(scope, "room_eco_after", after, " min", 5, 5, 240) : this._v(`${after} min`)) : "",
        list.length && (eco === "on" || eco === "auto" && s.room_eco_enabled) ? this._row("… um", editable ? this._optStepper(scope, "room_eco_drop", drop, " °C", 0.5, 0.5, 4, 1) : this._v(`${fmt(drop)} °C`), "nie unter „kurz weg“ und den Schimmelschutz; kommt jemand rein, sofort zurück") : ""
      ].join(""));
    }
    _lightGroup(r, id, editable) {
      const s = r.attrs.settings || {};
      const lights = this._roomOpt(r, "signal_lights") ?? s.signal_lights ?? [];
      const sigs = this._roomOpt(r, "light_signals") ?? s.light_signals ?? ["open", "close"];
      const all = this._cfg && this._cfg.choices && this._cfg.choices.lights || [];
      const names = Object.fromEntries(all.map((x) => [x.id, x.name]));
      const chips = lights.map((e) => `<span class="chip2" style="--c:var(--rk-air)"><i></i>${esc(names[e] || this._name(e))}${editable ? ` <button class="mini x" data-lightrm="${esc(e)}" data-entry="${id}" title="${t("entfernen")}">✕</button>` : ""}</span>`).join("");
      const avail = all.filter((x) => !lights.includes(x.id));
      const sigChips = Object.entries(RK_LIGHT_SIGNALS).map(([k, [c, l]]) => `<button class="chip2 ${sigs.includes(k) ? "" : "off"}" style="--c:${c}" data-lsig="${k}" data-entry="${id}" ${editable ? "" : "disabled"}><i></i>${l}</button>`).join("");
      return this._grp("Lichtsignal", "mdi:lightbulb-on-outline", "air", [
        this._row("Lampen", `<div class="chips">${chips || this._v("keine", true)}</div>`, "blinken 3× in der Farbe des Hinweises, danach wie vorher"),
        editable && avail.length ? `<div class="addrow"><select class="sel" id="addLight-${id}">${avail.map((x) => `<option value="${esc(x.id)}">${esc(x.name)}</option>`).join("")}</select><button class="btn" data-lightadd="${id}" style="--c:var(--rk-air)"><ha-icon icon="mdi:lightbulb-plus-outline"></ha-icon>${t("Lampe hinzufügen")}</button></div>` : "",
        this._row("Blinken bei", `<div class="chips">${sigChips}</div>`, "Blau = lüften · Orange = schließen · Grün = fertig · Rot = Problem"),
        lights.length && this._admin ? this._row("Ausprobieren", `<button class="btn" data-lighttest="${id}" style="--c:var(--rk-air)"><ha-icon icon="mdi:play"></ha-icon>${t("Test")}</button>`) : "",
        `<div class="hint">${t("Nicht in der Ruhezeit, nicht beim Schlafen mit offenem Fenster und nicht, wenn niemand zu Hause ist. Lampen ohne Farbe blinken einfach hell.")}</div>`
      ].join(""));
    }
    // Gelernte Schlafzeiten (Wohnungsebene) – gehört zum Lernen, nicht zu den Einstellrädern.
    // ---------------------------------------------------------------- Lernen (Unterreiter)
    _learnTabs(active, keys) {
      const names = { overview: "Übersicht", sleep: "Schlafen & Anwesenheit", decisions: "Entscheidungen", how: "So rechnet es" };
      return `<div class="ltabs">${keys.map((k) => `<button class="ltab ${k === active ? "on" : ""}" data-ltab="${k}">${t(names[k])}</button>`).join("")}</div>`;
    }
    // Wohnungsebene: Schlafzeiten, Anwesenheitsprofil, Entscheidungen, Erklärung
    _learnHub(st) {
      const tab = this._ltabHub || "sleep";
      const body = tab === "sleep" ? this._sleepRows(st) : tab === "decisions" ? this._decisions(null) : this._howRows("home");
      return this._grp(t("Lernen & Warum"), "mdi:chart-line", "eco", this._learnTabs(tab, ["sleep", "decisions", "how"]) + body);
    }
    _sleepRows(st) {
      const sl = st && st.sleep || {};
      const line = (k, label) => {
        const v = sl[k] || {};
        const e = v.effective || {};
        const parts = [v.bed ? t("ins Bett ~{v}", { v: v.bed }) : "", v.wake ? t("auf ~{v}", { v: v.wake }) : ""].filter(Boolean);
        const sub = parts.length ? `${t("{b} von 4 Nächten (Bett) · {w} von 4 (Aufstehen)", { b: v.nights_bed || 0, w: v.nights_wake || 0 })}${e.quiet_start ? ` · ${t("Ruhezeit")} ${e.quiet_start}–${e.quiet_end}` : ""}` : t("noch zu wenige Nächte – 4 sind nötig");
        return this._row(t(label), this._v(parts.length ? parts.join(" · ") : t("sammelt noch"), !parts.length), sub);
      };
      const pp = st && st.presence_profile || {};
      const days = pp.days || {};
      const hasProfile = (days.weekday || 0) + (days.weekend || 0) > 0;
      const bars = (arr, label) => this._row(t(label), this._presenceBars(arr), this._presenceText(arr));
      const head = `<div class="row whyhead"><div class="l"><span class="lbl">${t("Anwesenheitsprofil")}</span><small>${t("Aus diesem Profil schlägt Raumklima Absenk- und Vorheizzeiten vor.")}</small></div></div>`;
      const tip = st && st.presence_tip || {};
      const tipRow = tip.ready ? this._row(
        t("Vorschlag"),
        this._v([tip.weekday ? t("{a} bis {b}", { a: tip.weekday.from, b: tip.weekday.to }) : "", tip.weekend ? t("Wochenende ab {a}", { a: tip.weekend.from }) : ""].filter(Boolean).join(" · ")),
        t("Vorheizen beginnt 30 Minuten vorher, Absenken endet mit der Ankunft – so bleibt es beim Wunsch, ohne dass die Heizung leer läuft.")
      ) : this._row(t("Vorschlag"), this._v(t("sammelt noch"), true), t("ab einer erfassten Woche"));
      const profile = head + (hasProfile ? [bars(pp.weekday, "Werktags"), bars(pp.weekend, "Wochenende")].join("") : this._row(t("Anwesenheit am Tag"), this._v(t("sammelt noch"), true), t("wird ab der ersten Woche sichtbar – nur ja/nein, nie wer")));
      return [line("weekday", "Werktags"), line("weekend", "Wochenende"), profile, tipRow].join("");
    }
    // Einrichtungs-Checkliste: was fehlt noch, und wo stellt man es ein
    _checkRows(st, ch) {
      const rooms = this._rooms || [];
      const opts = (r) => r.attrs.settings || {};
      const any = (fn) => rooms.some(fn);
      const people = (this._hubOpt("residents") || []).length;
      const rec = Object.keys(this._hubOpt("recipients") || {}).length;
      const items = [
        [t("Bewohner hinterlegt"), people > 0, t("Einstellungen → Anwesenheit & Absenkung")],
        [t("Empfänger für Meldungen"), rec > 0, t("Einstellungen → Wer bekommt was")],
        [t("Wetterquelle gewählt"), !!this._hubOpt("weather_entity"), t("Einstellungen → Benachrichtigungen allgemein")],
        [t("Raum mit Thermostat"), any((r) => opts(r).trv), t("Raum → Geräte")],
        [t("Fensterkontakt eingetragen"), any((r) => (opts(r).windows || []).length), t("Raum → Fenster & Lüften")],
        [t("Zeitplan angelegt"), any((r) => (opts(r).schedules || []).length), t("Raum → Zeitplan")]
      ];
      const optional = [
        [t("Präsenzmelder eingetragen"), any((r) => (opts(r).presence_sensors || []).length), t("Raum → Anwesenheit im Raum")],
        [t("Sturmschwelle geprüft"), this._hubOpt("storm_warning") != null, t("Einstellungen → Sturm- und Regenwarnung")]
      ];
      const done = items.filter((i) => i[1]).length;
      const chip = (on, optionalItem) => `<span class="chip2 ${on ? "" : "off"}" style="--c:var(--rk-${on ? "ok" : optionalItem ? "air" : "warn"})"><i></i>${on ? t("erledigt") : optionalItem ? t("optional") : t("offen")}</span>`;
      const rows = [
        this._row(
          t("{a} von {b} erledigt", { a: done, b: items.length }),
          `<span class="chip2" style="--c:var(--rk-${done === items.length ? "ok" : "warn"})"><i></i>${done === items.length ? t("bereit") : t("noch offen")}</span>`,
          t("die wichtigsten Schritte, damit Raumklima sinnvoll regeln kann")
        ),
        ...items.map(([label, on, where]) => this._row(label, chip(on, false), where)),
        ...optional.map(([label, on, where]) => this._row(label, chip(on, true), `${where} · ${t("bringt mehr Genauigkeit, ist aber nicht nötig")}`))
      ];
      return rows.join("");
    }
    // Raum-Ebene: Aufheizrate & Co., Entscheidungen, Erklärung
    _learnRoom(r) {
      const a = r.attrs, s = a.settings || {}, h = s.heatup || {}, id = s.entry_id;
      if (!id || a.monitor) return "";
      const tab = this._ltabRoom || "overview";
      const eps = Number(h.episodes || 0);
      const sure = eps >= 6 ? [t("belastbar"), "ok"] : eps >= 3 ? [t("brauchbar"), "warn"] : [t("noch unsicher"), "off"];
      const overview = [
        this._row(
          t("Aufheizrate"),
          this._v(h.rate != null ? t("{v} °C/h", { v: fmt(h.rate, 1) }) : t("noch nicht gelernt"), h.rate == null),
          t("aus {n} Aufheizvorgängen gemessen", { n: eps })
        ),
        this._row(
          t("Vorheizen für 2 K"),
          this._v(h.minutes_2k != null ? t("{n} min", { n: h.minutes_2k }) : "–", h.minutes_2k == null),
          t("so früh beginnt das Vorheizen vor einem Zeitfenster")
        ),
        this._row(
          t("Wie sicher?"),
          `<span class="chip2" style="--c:var(--rk-${sure[1]})"><i></i>${sure[0]}</span>`,
          t("mehr Aufheizvorgänge, verlässlichere Vorhersage")
        ),
        this._row(t("Gerade gilt"), `<span class="v">${planText(a, false)}</span>`, t("so entscheidet die Automatik im Moment")),
        this._row(
          t("Übliche Nutzung"),
          this._v(a.usage || t("sammelt noch – nur mit Präsenzmelder"), !a.usage),
          t("Vorschlag aus der Belegung je Wochentag; ein Zeitfenster legst du selbst an")
        )
      ].join("");
      const body = tab === "overview" ? overview : tab === "decisions" ? this._decisions(id) : this._howRows("room");
      return this._grp(t("Lernen & Warum"), "mdi:chart-line", "eco", this._learnTabs(tab, ["overview", "decisions", "how"]) + body);
    }
    _howRows(scope) {
      const rows = scope === "room" ? [
        this._row(t("Aufheizrate"), this._v(t("Median aus echten Vorgängen")), t("Gemessen wird, wie schnell der Raum bei geöffnetem Ventil wärmer wird – nur ab 0,3 K Anstieg, damit Messrauschen nicht zählt.")),
        this._row(t("Vorheizen"), this._v(t("Rate × fehlende Kelvin")), t("Aus der Aufheizrate und der Außentemperatur wird geschätzt, wie viele Minuten vor einem Zeitfenster gestartet werden muss.")),
        this._row(t("Entscheidungen"), this._v(t("feste Reihenfolge")), t("Heizpause → Abwesenheit → Boost → Zeitfenster → Ruhezeit → Vorheizen → leer/Sonne → Wunsch. Das oberste zutreffende gewinnt.")),
        this._row(t("Genauigkeit"), this._v(t("wächst mit Messungen")), t("Unter 3 Vorgängen unsicher, ab 6 belastbar. Mehr Messungen = engere Vorhersage; alte Werte verfallen mit der Zeit."))
      ] : [
        this._row(t("Schlafzeiten"), this._v(t("Median der letzten 6 Wochen")), t("Gezählt wird jede Nacht einmal, aus Nachtlüften und Lichtsignalen. Ruhezeit beginnt 30 Minuten vor der typischen Bettzeit.")),
        this._row(t("Anwesenheit"), this._v(t("15-Minuten-Raster")), t("Alle 15 Minuten ein Häkchen „jemand da oder nicht“, rollierend 4 Wochen. Es wird nie erfasst, wer zu Hause ist.")),
        this._row(t("Vorschlag"), this._v(t("aus dem Profil")), t("Zeitfenster, in denen an mindestens 60 % der Tage jemand da war, gelten als typische Anwesenheit – daraus folgen Vorheiz- und Absenkzeiten.")),
        this._row(t("Grenzen"), this._v(t("ehrlich")), t("Urlaub, Schichtdienst und unregelmäßige Tage verfälschen das Profil. Deshalb schlägt Raumklima nur vor und stellt nichts von selbst um."))
      ];
      return rows.join("");
    }
    // ---------------------------------------------------------------- Entscheidungen
    _decisions(entryId) {
      const range = this._decRange ?? 0;
      const cat = this._decCat ?? "all";
      const rangeChips = [[0, "Heute"], [7, "7 Tage"], [14, "14 Tage"]].map(([k, l]) => `<button class="chip2 ${k === range ? "" : "off"}" data-drange="${k}">${t(l)}</button>`).join("");
      const catChips = [["all", "Alle"], ["target", "Heizen"], ["window", "Lüften"], ["presence", "Anwesenheit"], ["health", "Gesundheit"]].map(([k, l]) => `<button class="chip2 ${k === cat ? "" : "off"}" data-dcat="${k}">${t(l)}</button>`).join("");
      const roomChips = entryId ? "" : `<div class="dbar"><span class="dlab">${t("Raum")}</span><div class="chips">${this._decRoomChips()}</div></div>`;
      return `<div class="dbar"><span class="dlab">${t("Zeitraum")}</span><div class="chips">${rangeChips}</div></div>
      ${roomChips}
      <div class="dbar"><span class="dlab">${t("Bereich")}</span><div class="chips">${catChips}</div></div>
      <div class="dkpis" data-dkpi></div>
      <div class="decs" data-decs="${esc(entryId || "")}"><div class="hint">${t("Lade …")}</div></div>
      <div class="hint">${t("Antippen einer Zeile zeigt die vollständige Begründung.")}</div>`;
    }
    _decRoomChips() {
      const cur = this._decRoom || "all";
      const list = [["all", t("Alle Räume")], ...this._rooms.map((r) => [r.id, r.name])];
      return list.map(([id, name]) => `<button class="chip2 ${id === cur ? "" : "off"}" data-droom="${esc(id)}">${esc(name)}</button>`).join("");
    }
    _decRow(e) {
      const d = new Date(e.t);
      const sameDay = !isNaN(d.getTime()) && d.toDateString() === (/* @__PURE__ */ new Date()).toDateString();
      const when = isNaN(d.getTime()) ? "" : sameDay ? d.toLocaleTimeString(loc(), { hour: "2-digit", minute: "2-digit" }) : d.toLocaleString(loc(), { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
      const many = e.n > 1 ? ` ×${e.n}` : "";
      const why = e.why ? `<small>${esc(e.why)}</small>` : "";
      const extra = [e.room ? esc(e.room) : "", e.data ? esc(Object.entries(e.data).map(([k, v]) => `${k}: ${v}`).join(" · ")) : ""].filter(Boolean).join(" · ");
      return `<details class="dec"><summary><span class="wtime">${esc(when)}</span><span class="dl"><b>${esc(e.msg)}${many}</b>${why}</span></summary>
      <div class="dfull">${e.why ? `<p>${esc(e.why)}</p>` : ""}${extra ? `<p class="ddata">${extra}</p>` : ""}</div></details>`;
    }
    _paintDec(box, list) {
      box.innerHTML = list.length ? list.map((e) => this._decRow(e)).join("") : `<div class="hint">${t("Keine Entscheidungen in diesem Zeitraum.")}</div>`;
      const kpi = this.shadowRoot.querySelector("[data-dkpi]");
      if (!kpi) return;
      const sets = list.filter((e) => e.cat === "target").length;
      const air = list.filter((e) => e.cat === "window").length;
      kpi.innerHTML = [[String(list.length), t("Entscheidungen")], [`${sets}×`, t("Ziel geändert")], [`${air}×`, t("Lüften")]].map(([b, s]) => `<div class="dkpi"><b>${b}</b><span>${s}</span></div>`).join("");
    }
    async _decFetch() {
      const root = this.shadowRoot;
      const box = root && root.querySelector("[data-decs]");
      if (!box) return;
      const entryId = box.dataset.decs || null;
      const range = this._decRange ?? 0;
      const cat = this._decCat ?? "all";
      const key = `${entryId || "all"}|${range}|${cat}|${this._decRoom || ""}`;
      this._dec = this._dec || {};
      if (this._dec[key]) return this._paintDec(box, this._dec[key]);
      if (this._decBusy) return;
      this._decBusy = true;
      try {
        const msg = { type: "raumklima/log", limit: 400 };
        if (entryId) msg.entry_id = entryId;
        if (cat !== "all") msg.categories = [cat];
        const res = await this._hass.callWS(msg);
        const since = range === 0 ? (/* @__PURE__ */ new Date()).setHours(0, 0, 0, 0) : Date.now() - range * 864e5;
        let list = (res.entries || []).filter((e) => Date.parse(e.t) >= since);
        if (!entryId && this._decRoom && this._decRoom !== "all") list = list.filter((e) => e.eid === this._decRoom);
        this._dec[key] = list;
        this._paintDec(box, list);
      } catch (e) {
        box.innerHTML = `<div class="hint">${t("Protokoll konnte nicht geladen werden.")}</div>`;
      } finally {
        this._decBusy = false;
      }
    }
    // iOS-artiger Zeitwähler: Stunden- und Viertelstunden-Rad zum Durchscrollen.
    _timePop() {
      const hh = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
      const mm = ["00", "15", "30", "45"];
      return `<div class="tpick" data-tpick hidden>
      <div class="tpickhead"><b>${t("Uhrzeit")}</b><button class="mini x" data-tclose title="${t("schließen")}">✕</button></div>
      <div class="tpickbody">
        <div class="twheel" data-twh>${hh.map((h, i) => `<button data-th="${i}" class="${i === 0 ? "on" : ""}">${h}</button>`).join("")}</div>
        <span class="tcolon">:</span>
        <div class="twheel small" data-twmn>${mm.map((m, i) => `<button data-tm="${i}" class="${i === 0 ? "on" : ""}">${m}</button>`).join("")}</div>
        <span class="tpickunit">${t("Uhr")}</span>
      </div>
      <div class="tpickfoot">
        <input class="inp" data-tin inputmode="numeric" maxlength="5" placeholder="HH:MM">
        <button class="btn primary" data-tok>${t("Übernehmen")}</button>
      </div>
    </div>`;
    }
    _openTime(key, val) {
      const pop = this.shadowRoot.querySelector("[data-tpick]");
      if (!pop) return;
      pop.hidden = false;
      const [hRaw, mRaw] = String(val || "07:00").split(":");
      const h = Math.max(0, Math.min(23, parseInt(hRaw, 10) || 0));
      const m = Math.max(0, Math.min(3, Math.round((parseInt(mRaw, 10) || 0) / 15)));
      this._tp = { key, h, m };
      pop.querySelector("[data-twh]").scrollTop = h * 40;
      pop.querySelector("[data-twmn]").scrollTop = m * 40;
      pop.querySelector("[data-tin]").value = `${String(h).padStart(2, "0")}:${String(m * 15).padStart(2, "0")}`;
    }
    _timeSync(pop) {
      if (!this._tp) return;
      const h = Math.round(pop.querySelector("[data-twh]").scrollTop / 40);
      const m = Math.round(pop.querySelector("[data-twmn]").scrollTop / 40);
      this._tp.h = Math.max(0, Math.min(23, h));
      this._tp.m = Math.max(0, Math.min(3, m));
      pop.querySelectorAll("[data-th]").forEach((b) => b.classList.toggle("on", Number(b.dataset.th) === this._tp.h));
      pop.querySelectorAll("[data-tm]").forEach((b) => b.classList.toggle("on", Number(b.dataset.tm) === this._tp.m));
      pop.querySelector("[data-tin]").value = `${String(this._tp.h).padStart(2, "0")}:${String(this._tp.m * 15).padStart(2, "0")}`;
    }
    // 24-h-Balken: 96 Viertelstunden, Höhe = Anteil der Tage mit Anwesenheit
    _presenceBars(arr) {
      if (!Array.isArray(arr) || !arr.length) return this._v("–", true);
      const cells = arr.map((v) => `<i style="height:${Math.max(8, Math.round(v * 100))}%;opacity:${(0.18 + v * 0.82).toFixed(2)}"></i>`).join("");
      return `<div class="pbars" title="${t("Anteil der Tage mit jemand zu Hause")}">${cells}</div>`;
    }
    _presenceText(arr) {
      if (!Array.isArray(arr) || !arr.length) return "";
      const on = arr.map((v, i) => v >= 0.5 ? i : -1).filter((i) => i >= 0);
      if (!on.length) return t("keine klare Zeit – meist niemand zu Hause");
      const lab = (i) => `${String(Math.floor(i / 4) % 24).padStart(2, "0")}:${String(i % 4 * 15).padStart(2, "0")}`;
      const a = lab(on[0]);
      const b = lab((on[on.length - 1] + 1) % 96);
      return t("meist {a}–{b} jemand zu Hause", { a, b });
    }
    // ---------------------------------------------------------------- Lernen & Warum
    // ---------------------------------------------------------------- Rendern
    _render() {
      if (!this._hass || !this._rooms) return;
      if (this._renderSoon()) return;
      const rooms = this._orderedRooms();
      if (this._tab !== "general" && !rooms.find((r) => r.id === this._tab)) this._tab = "general";
      const tabs = `<button class="tab ${this._tab === "general" ? "on" : ""}" data-tab="general"><ha-icon icon="mdi:home-cog-outline"></ha-icon>${t("Allgemein")}</button>` + rooms.map((r) => {
        const sick = (this._cfg && this._cfg.hub && this._cfg.hub.state && this._cfg.hub.state.issues || []).some((i) => i.entry_id === (r.attrs.settings || {}).entry_id && i.severity !== "info");
        return `<button class="tab ${this._tab === r.id ? "on" : ""}" data-tab="${r.id}" style="--c:${r.color}"><span class="dot"></span>${r.name}${sick ? ` <ha-icon icon="mdi:alert-circle" style="color:var(--rk-warn)"></ha-icon>` : ""}</button>`;
      }).join("");
      const room = rooms.find((r) => r.id === this._tab);
      const body = room ? this._room(room) : this._general();
      const homes = this._cfg && this._cfg.homes || [];
      const me = homes.find((h) => h.entry_id === this._homeId());
      this._ctxHome = me ? me.name : this._config && this._config.home || t("Wohnung");
      const homeBar = homes.length > 1 && !this._config.home ? `<div class="tabs homes">${homes.map((h) => `<button class="tab ${h.entry_id === this._homeId() ? "on" : ""}" data-home="${h.entry_id}"><ha-icon icon="mdi:home-outline"></ha-icon>${esc(h.name)}</button>`).join("")}</div>` : "";
      rkPaint(this, `<style>${STYLES}${HISTORY_STYLES}${SETTINGS_STYLES}${ISSUE_STYLES}</style>
      <ha-card class="settings" style="--tone:${toneVar("off")}">
        <div class="hhead"><div class="htitle"><ha-icon icon="mdi:tune-variant"></ha-icon>${esc(this._config.title || t("Einstellungen"))}</div><a class="btn" href="${rkManualUrl()}" target="_blank" rel="noopener" style="--c:var(--rk-heat)" title="${t("Anleitung, Funktionen und häufige Fragen")}"><ha-icon icon="mdi:book-open-variant"></ha-icon>${t("Handbuch (PDF)")}</a><button class="btn" data-diag style="--c:var(--rk-eco)" title="${t("Alle Werte, Entitäten und die letzten Log-Zeilen als Datei")}"><ha-icon icon="mdi:file-download-outline"></ha-icon>${t("Diagnose")}</button>
          <button class="btn" data-backup style="--c:var(--rk-eco)" title="${t("Alle Einstellungen als Datei sichern – ohne Passwörter")}"><ha-icon icon="mdi:content-save-outline"></ha-icon>${t("Sichern")}</button>
          ${this._admin ? `<button class="btn" data-restore style="--c:var(--rk-eco)" title="${t("Sicherung einspielen – Räume werden über ihren Namen zugeordnet")}"><ha-icon icon="mdi:content-save-arrow-left-outline"></ha-icon>${t("Wiederherstellen")}</button><input type="file" id="rkrestore" accept="application/json,.json" style="display:none">` : ""}<button class="btn" data-bug style="--c:var(--rk-warn)" title="${t("Öffnet ein neues GitHub-Issue mit Version, Home-Assistant-Version und Thermostat-Modell – ohne Raumnamen oder Entitäten")}"><ha-icon icon="mdi:bug-outline"></ha-icon>${t("Fehler melden")}</button>${this._admin ? "" : `<span class="chip" style="--tone:var(--rk-warn)">${t("Nur Ansicht – Ändern erfordert Admin")}</span>`}</div>
        ${homeBar}
        <div class="tabs">${tabs}</div>
        <div class="crumb" id="rkc"></div>
        ${room ? `<div class="resetbar">${(() => {
        const n = ((room.attrs.settings || {}).changed || []).length;
        return n ? `<span>${t("{n} Einstellungen vom Standard abweichend", { n })}</span><button class="btn small" data-resetroom="${room.id}"><ha-icon icon="mdi:backup-restore"></ha-icon>${t("Auf Standard zurücksetzen")}</button>` : `<span>${t("Alles auf Standard")}</span>`;
      })()}</div>` : ""}
        <div class="searchrow"><input id="rks" type="search" placeholder="${t("Einstellung suchen …")}" autocomplete="off" value="${esc(this._search || "")}"></div>
        <div class="rail">${RK_GROUP_ORDER.map((g) => `<button class="railbtn" data-g="${g}"><ha-icon icon="${RK_GROUP_META[g].icon}"></ha-icon>${t(RK_GROUP_META[g].label)}</button>`).join("")}</div>
        <div class="nosearch" style="display:none">${t("Kein Treffer – anderen Begriff versuchen")}</div>
        ${body}
        ${this._sheetHtml()}
        ${this._toast ? `<div class="toast">${esc(this._toast)}</div>` : ""}
        ${this._timePop()}
      </ha-card>`);
      this._bind();
      this._filter();
      this._decFetch();
    }
    // Gruppenleiste + Suche: blendet Gruppen im bereits gezeichneten Inhalt aus.
    _filter() {
      const root = this.shadowRoot;
      if (!root) return;
      const q = String(this._search || "").toLowerCase().trim();
      const secs = [...root.querySelectorAll(".grp")];
      const present = /* @__PURE__ */ new Set();
      let active = null;
      let shown = 0;
      for (const g of RK_GROUP_ORDER) {
        if (secs.some((el) => (el.dataset.g || "advanced") === g)) {
          active = g;
          break;
        }
      }
      if (this._group && secs.some((el) => (el.dataset.g || "advanced") === this._group)) active = this._group;
      secs.forEach((el) => {
        const g = el.dataset.g || "advanced";
        present.add(g);
        const hit = !q || el.textContent.toLowerCase().includes(q);
        const vis = q ? hit : g === active;
        el.style.display = vis ? "" : "none";
        if (vis) shown += 1;
      });
      const visible = secs.filter((el) => el.style.display !== "none");
      secs.forEach((el) => el.classList.toggle("solo", visible.length === 1 && el.style.display !== "none"));
      root.querySelector(".groups")?.classList.toggle("solo", visible.length === 1);
      root.querySelectorAll(".railbtn").forEach((b) => {
        if (!root.querySelector(`.grp[data-g="${b.dataset.g}"]`)) b.remove();
      });
      root.querySelectorAll(".railbtn").forEach((b) => {
        const g = b.dataset.g;
        b.classList.toggle("empty", !present.has(g));
        b.classList.toggle("on", !q && g === active);
      });
      const nos = root.querySelector(".nosearch");
      if (nos) nos.style.display = q && !shown ? "" : "none";
      const crumb = root.querySelector("#rkc");
      if (crumb) {
        const room = (this._rooms || []).find((r) => r.id === this._tab);
        const parts = [this._ctxHome || t("Wohnung"), room ? room.name : t("Allgemein"), t(RK_GROUP_META[active || "home"].label)];
        crumb.innerHTML = parts.map((x, i) => i === parts.length - 1 ? `<b>${esc(x)}</b>` : `${esc(x)} <span>›</span>`).join(" ");
      }
    }
    _bind() {
      const $ = (sel) => this.shadowRoot.querySelectorAll(sel);
      const ws = (msg) => this._hass.callWS(msg).catch((e) => this._flash(t("Fehler: {e}", { e: e.message || e })));
      $("[data-tab]").forEach((el) => el.addEventListener("click", () => {
        this._tab = el.dataset.tab;
        this._sig = null;
        this._render();
      }));
      $(".railbtn").forEach((el) => el.addEventListener("click", () => {
        this._group = el.dataset.g;
        this._filter();
      }));
      $("[data-lmove]").forEach((el) => el.addEventListener("click", () => {
        const L = this._layout;
        const list = this._layoutList().map((r) => r.id);
        const i = list.indexOf(el.dataset.lmove);
        const j = i + parseInt(el.dataset.dir, 10);
        if (i < 0 || j < 0 || j >= list.length) return;
        [list[i], list[j]] = [list[j], list[i]];
        this._layout = { ...L, order: list };
        this._layoutSave();
        this._sig = null;
        this._filter();
      }));
      $("[data-lsize]").forEach((el) => el.addEventListener("click", () => {
        const L = this._layout;
        this._layout = { ...L, size: { ...L.size || {}, [el.dataset.lsize]: el.dataset.v } };
        this._layoutSave();
        this._sig = null;
        this._render();
      }));
      $("[data-lcolor]").forEach((el) => el.addEventListener("click", () => {
        const L = this._layout;
        this._layout = { ...L, color: { ...L.color || {}, [el.dataset.lcolor]: el.dataset.v } };
        this._layoutSave();
        this._sig = null;
        this._render();
      }));
      $("[data-lsave]").forEach((el) => el.addEventListener("click", () => this._layoutSave()));
      $("[data-resetroom]").forEach((el) => el.addEventListener("click", () => {
        if (!window.confirm(t("Alle Einstellungen dieses Raums auf Standard zurücksetzen? Geräte und Wohnung bleiben erhalten."))) return;
        ws({ type: "raumklima/room/reset", entry_id: el.dataset.resetroom }).then(() => this._flash(t("Auf Standard zurückgesetzt"))).catch(() => {
        });
      }));
      const search = this.shadowRoot.querySelector("#rks");
      if (search) search.addEventListener("input", () => {
        this._search = search.value;
        this._filter();
      });
      $("[data-tgl]").forEach((el) => el.addEventListener("click", () => this._hass.callService("switch", "toggle", { entity_id: el.dataset.tgl })));
      $("[data-press]").forEach((el) => el.addEventListener("click", () => this._hass.callService("button", "press", { entity_id: el.dataset.press })));
      $("[data-num]").forEach((el) => el.addEventListener("click", () => {
        const s = this._st(el.dataset.num);
        if (!s) return;
        const step = parseFloat(s.attributes.step) || 1;
        const min = parseFloat(s.attributes.min), max = parseFloat(s.attributes.max);
        let v = Math.round((parseFloat(s.state) + step * parseInt(el.dataset.d, 10)) * 100) / 100;
        if (!isNaN(min)) v = Math.max(min, v);
        if (!isNaN(max)) v = Math.min(max, v);
        this._hass.callService("number", "set_value", { entity_id: el.dataset.num, value: v });
      }));
      const apply = (scope, changes) => {
        if (scope === "hub") this._setHub(changes);
        else this._setRoom(scope.slice(5), changes);
      };
      $("[data-opt]").forEach((el) => el.addEventListener("click", () => {
        const step = parseFloat(el.dataset.step), min = parseFloat(el.dataset.min), max = parseFloat(el.dataset.max);
        const cur = parseFloat(el.dataset.val);
        let v = Math.round(((isNaN(cur) ? min : cur) + step * parseInt(el.dataset.d, 10)) * 100) / 100;
        v = Math.min(max, Math.max(min, v));
        apply(el.dataset.opt, { [el.dataset.key]: v });
      }));
      $("[data-optbool]").forEach((el) => el.addEventListener("click", () => apply(el.dataset.optbool, { [el.dataset.key]: el.dataset.val !== "1" })));
      $(".stepper span").forEach((span) => span.addEventListener("click", () => {
        const box = span.closest(".stepper");
        const btn = box && box.querySelector("button");
        if (!box || !btn || !this._admin || box.classList.contains("ro") || span.querySelector("input")) return;
        const d = btn.dataset;
        if (d.schedtemp || d.schedmove) return;
        let cur = parseFloat(d.val), step = parseFloat(d.step) || 0.5, min = parseFloat(d.min), max = parseFloat(d.max);
        if (d.num) {
          const st = this._st(d.num);
          if (!st) return;
          const a = st.attributes || {};
          cur = parseFloat(st.state);
          step = parseFloat(a.step) || 0.5;
          min = parseFloat(a.min);
          max = parseFloat(a.max);
        }
        const html = span.innerHTML;
        const inp = document.createElement("input");
        inp.type = "number";
        inp.inputMode = "decimal";
        inp.className = "numedit";
        inp.step = String(step);
        if (!isNaN(min)) inp.min = String(min);
        if (!isNaN(max)) inp.max = String(max);
        inp.value = isNaN(cur) ? "" : String(cur);
        span.innerHTML = ``;
        span.appendChild(inp);
        inp.focus();
        inp.select();
        let done = false;
        const finish = (ok) => {
          if (done) return;
          done = true;
          let v = parseFloat(String(inp.value).replace(",", "."));
          span.innerHTML = html;
          if (!ok || isNaN(v)) return;
          v = Math.round(v / step) * step;
          if (!isNaN(min)) v = Math.max(min, v);
          if (!isNaN(max)) v = Math.min(max, v);
          v = Math.round(v * 100) / 100;
          if (d.num) this._hass.callService("number", "set_value", { entity_id: d.num, value: v });
          else if (d.opt) apply(d.opt, { [d.key]: v });
        };
        inp.addEventListener("blur", () => finish(true));
        inp.addEventListener("keydown", (ev) => {
          if (ev.key === "Enter") {
            ev.preventDefault();
            finish(true);
          } else if (ev.key === "Escape") {
            ev.preventDefault();
            finish(false);
          }
        });
      }));
      const sp = (v) => String(v).split("|");
      $("[data-roomperson]").forEach((el) => el.addEventListener("click", () => {
        const entry = el.dataset.entry;
        const cur = roomList(entry, "room_persons", []);
        const next = cur.includes(el.dataset.roomperson) ? cur.filter((x) => x !== el.dataset.roomperson) : [...cur, el.dataset.roomperson];
        this._setRoom(entry, { room_persons: next }, 300);
      }));
      $("[data-guestroom]").forEach((el) => el.addEventListener("click", () => {
        const rid = el.dataset.guestroom;
        const cur = [...this._hubOpt("guests_rooms") || []];
        const next = cur.includes(rid) ? cur.filter((x) => x !== rid) : [...cur, rid];
        this._local = this._local || {};
        this._local["hub:guests_rooms"] = next;
        this._setHub({ guests_rooms: next }, 300);
        this._flash(t("Gespeichert"));
      }));
      $("[data-horoom]").forEach((el) => el.addEventListener("click", () => {
        const rid = el.dataset.horoom;
        const cur = [...this._hubOpt("home_office_rooms") || []];
        const next = cur.includes(rid) ? cur.filter((x) => x !== rid) : [...cur, rid];
        this._local = this._local || {};
        this._local["hub:home_office_rooms"] = next;
        this._setHub({ home_office_rooms: next }, 300);
        this._flash(t("Gespeichert"));
      }));
      $("[data-airadd]").forEach((el) => el.addEventListener("click", () => {
        const id = el.dataset.airadd;
        const list = this._airList(id, []);
        if (list.length >= 6) return;
        list.push({ days: [], start: "04:45", end: "06:30" });
        this._pushAir(id);
      }));
      $("[data-airdel]").forEach((el) => el.addEventListener("click", () => {
        const [id, i] = String(el.dataset.airdel).split("|");
        this._airList(id, []).splice(parseInt(i, 10), 1);
        this._pushAir(id);
      }));
      $("[data-airday]").forEach((el) => el.addEventListener("click", () => {
        const [id, i, d] = String(el.dataset.airday).split("|");
        const w = this._airList(id, [])[parseInt(i, 10)];
        if (!w) return;
        const day = parseInt(d, 10);
        w.days = w.days.includes(day) ? w.days.filter((x) => x !== day) : [...w.days, day].sort((a, b) => a - b);
        this._pushAir(id);
      }));
      $("[data-airtime]").forEach((el) => el.addEventListener("change", () => {
        const [id, i, which] = String(el.dataset.airtime).split("|");
        const w = this._airList(id, [])[parseInt(i, 10)];
        if (!w) return;
        const v = rkTimeValue(el.value);
        if (!v) {
          this._flash(t("Bitte Uhrzeit als HH:MM eingeben"));
          el.value = w[which] || "";
          return;
        }
        el.value = v;
        w[which] = v;
        this._pushAir(id);
      }));
      $("[data-schedadd]").forEach((el) => el.addEventListener("click", () => {
        const id = el.dataset.schedadd;
        const list = this._schedList(id, this._schedSeed(id) || []);
        if (list.length >= 6) return;
        const room = (this._rooms || []).find((x) => (x.attrs.settings || {}).entry_id === id);
        const base = room ? this._roomOpt(room, "comfort_temperature") ?? (room.attrs.settings || {}).comfort_temperature ?? 22 : 22;
        list.push({ days: [], start: "19:00", end: "21:00", temperature: Math.round(base * 2) / 2 });
        this._pushSched(id);
      }));
      $("[data-scheddel]").forEach((el) => el.addEventListener("click", () => {
        const [id, i] = sp(el.dataset.scheddel);
        this._schedList(id, this._schedSeed(id) || []).splice(parseInt(i, 10), 1);
        this._pushSched(id);
      }));
      $("[data-schedday]").forEach((el) => el.addEventListener("click", () => {
        const [id, i, d] = sp(el.dataset.schedday);
        const w = this._schedList(id, this._schedSeed(id) || [])[parseInt(i, 10)];
        if (!w) return;
        const day = parseInt(d, 10);
        w.days = w.days.includes(day) ? w.days.filter((x) => x !== day) : [...w.days, day].sort((a, b) => a - b);
        this._pushSched(id);
      }));
      $("[data-schedtime]").forEach((el) => el.addEventListener("change", () => {
        const [id, i, which] = sp(el.dataset.schedtime);
        const w = this._schedList(id, this._schedSeed(id) || [])[parseInt(i, 10)];
        if (!w) return;
        const v = rkTimeValue(el.value);
        if (!v) {
          this._flash(t("Bitte Uhrzeit als HH:MM eingeben"));
          el.value = w[which] || "";
          return;
        }
        el.value = v;
        w[which] = v;
        this._pushSched(id);
      }));
      $("[data-schedmove]").forEach((el) => el.addEventListener("click", () => {
        const [id, i, dir] = sp(el.dataset.schedmove);
        const list = this._schedList(id, this._schedSeed(id) || []);
        const a = parseInt(i, 10);
        const b = a + parseInt(dir, 10);
        if (a < 0 || b < 0 || a >= list.length || b >= list.length) return;
        [list[a], list[b]] = [list[b], list[a]];
        this._pushSched(id);
      }));
      $("[data-schedsort]").forEach((el) => el.addEventListener("click", async () => {
        const id = el.dataset.schedsort;
        const list = this._schedList(id, this._schedSeed(id) || []);
        list.sort((x, y) => {
          const a = rkSchedSortKey(x);
          const b = rkSchedSortKey(y);
          return a[0] - b[0] || a[1] - b[1] || a[2].localeCompare(b[2]);
        });
        this._flash(t("Zeitfenster nach Uhrzeit sortiert"));
        this._pushSched(id);
      }));
      $("[data-schedtemp]").forEach((el) => el.addEventListener("click", () => {
        const [id, i] = sp(el.dataset.schedtemp);
        const w = this._schedList(id, this._schedSeed(id) || [])[parseInt(i, 10)];
        if (!w) return;
        const v = Math.round((w.temperature + 0.5 * parseInt(el.dataset.d, 10)) * 2) / 2;
        w.temperature = Math.min(30, Math.max(5, v));
        this._pushSched(id);
      }));
      $("[data-seg]").forEach((el) => el.addEventListener("click", () => apply(el.dataset.seg, { [el.dataset.key]: el.dataset.val })));
      $("[data-sel]").forEach((el) => el.addEventListener("change", () => {
        el.blur();
        apply(el.dataset.sel, { [el.dataset.key]: el.value || null });
      }));
      $("[data-md]").forEach((el) => el.addEventListener("change", () => {
        const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(el.value.trim());
        if (iso) {
          this._setHub({ [el.dataset.md]: `${iso[2]}-${iso[3]}` }, 200);
          return;
        }
        const m = /^(\d{1,2})[-.](\d{1,2})\.?$/.exec(el.value.trim());
        if (!m) {
          this._flash("Bitte als MM-TT eingeben, z. B. 10-01");
          return;
        }
        const [mm, dd] = el.value.includes(".") ? [m[2], m[1]] : [m[1], m[2]];
        this._setHub({ [el.dataset.md]: `${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}` }, 200);
      }));
      $("[data-ltab]").forEach((el) => el.addEventListener("click", () => {
        if (this._tab === "general") this._ltabHub = el.dataset.ltab;
        else this._ltabRoom = el.dataset.ltab;
        this._dec = {};
        this._render();
      }));
      $("[data-drange]").forEach((el) => el.addEventListener("click", () => {
        this._decRange = Number(el.dataset.drange);
        this._dec = {};
        this._render();
      }));
      $("[data-dcat]").forEach((el) => el.addEventListener("click", () => {
        this._decCat = el.dataset.dcat;
        this._dec = {};
        this._render();
      }));
      $("[data-droom]").forEach((el) => el.addEventListener("click", () => {
        this._decRoom = el.dataset.droom;
        this._dec = {};
        this._render();
      }));
      $("[data-timeopen]").forEach((el) => el.addEventListener("click", () => this._openTime(el.dataset.timeopen, el.dataset.val)));
      const tpop = this.shadowRoot.querySelector("[data-tpick]");
      if (tpop) {
        let tid = 0;
        ["[data-twh]", "[data-twmn]"].forEach((sel) => tpop.querySelector(sel).addEventListener("scroll", () => {
          clearTimeout(tid);
          tid = setTimeout(() => this._timeSync(tpop), 90);
        }));
        tpop.querySelector("[data-tclose]").addEventListener("click", () => {
          tpop.hidden = true;
        });
        tpop.querySelector("[data-tok]").addEventListener("click", () => {
          const v = rkTimeValue(tpop.querySelector("[data-tin]").value);
          if (!v) {
            this._flash(t("Bitte Uhrzeit als HH:MM eingeben"));
            return;
          }
          const key = this._tp && this._tp.key;
          tpop.hidden = true;
          if (key) this._setHub({ [key]: v + ":00" }, 200);
        });
        tpop.querySelector("[data-tin]").addEventListener("input", (ev) => {
          const v = rkTimeValue(ev.target.value);
          if (!v) return;
          const [h, m] = v.split(":");
          tpop.querySelector("[data-twh]").scrollTop = (parseInt(h, 10) || 0) * 40;
          tpop.querySelector("[data-twmn]").scrollTop = Math.round((parseInt(m, 10) || 0) / 15) * 40;
        });
      }
      $("[data-time]").forEach((el) => el.addEventListener("change", () => {
        const key = el.dataset.time;
        const v = rkTimeValue(el.value);
        if (!v) {
          this._flash(t("Bitte Uhrzeit als HH:MM eingeben"));
          el.value = String(this._hubOpt(key) || "").slice(0, 5);
          return;
        }
        el.value = v;
        this._setHub({ [key]: v + ":00" }, 200);
      }));
      $("[data-person]").forEach((el) => el.addEventListener("click", () => {
        const list = [...this._hubOpt("residents") || []];
        const i = list.indexOf(el.dataset.person);
        if (i >= 0) list.splice(i, 1);
        else list.push(el.dataset.person);
        this._setHub({ residents: list });
      }));
      $("[data-home]").forEach((el) => el.addEventListener("click", () => {
        this._home = el.dataset.home;
        this._tab = "general";
        this._local = {};
        this._sig = null;
        this._load();
      }));
      $("[data-hubnum]").forEach((el) => el.addEventListener("change", () => {
        const v = el.value.trim() === "" ? null : Math.max(0, Math.min(2e4, parseFloat(el.value.replace(",", "."))));
        this._setHub({ [el.dataset.hubnum]: Number.isNaN(v) ? null : v }, 200);
      }));
      $("[data-hubtext]").forEach((el) => el.addEventListener("change", () => this._setHub({ [el.dataset.hubtext]: el.value.trim() }, 200)));
      $("[data-geohass]").forEach((el) => el.addEventListener("click", () => {
        const c = this._hass.config || {};
        this._setHub({ latitude: c.latitude, longitude: c.longitude }, 200);
      }));
      $("[data-geoclear]").forEach((el) => el.addEventListener("click", () => this._setHub({ latitude: null, longitude: null }, 200)));
      $("[data-hubgeo]").forEach((el) => el.addEventListener("change", () => {
        const key = el.dataset.hubgeo;
        const limit = key === "latitude" ? 90 : 180;
        const raw = el.value.trim().replace(",", ".");
        const v = raw === "" ? null : Math.max(-limit, Math.min(limit, parseFloat(raw)));
        this._setHub({ [key]: Number.isNaN(v) ? null : v }, 200);
      }));
      $("[data-mkdash]").forEach((el) => el.addEventListener("click", async () => {
        const p = el.dataset.mkdash;
        const made = await this._ensureDashboard(p, this._hubOpt("name") || p, this._cfg.hub.entry_id);
        this._flash(made ? t("Dashboard „{d}“ angelegt", { d: made }) : t("Anlegen nicht möglich – bitte in den Einstellungen unter Dashboards prüfen"));
        if (made) {
          await this._load();
        } else {
          this._render();
        }
      }));
      $("[data-newhome]").forEach((el) => el.addEventListener("click", async () => {
        const inp = this.shadowRoot.getElementById("newHome");
        const name = inp && inp.value.trim();
        if (!name) {
          this._flash("Bitte einen Namen eingeben");
          return;
        }
        try {
          const r = await this._hass.callWS({ type: "raumklima/home/create", name });
          this._home = r.entry_id;
          this._tab = "general";
          this._local = {};
          const made = await this._ensureDashboard(r.dashboard, name, r.entry_id);
          this._flash(made ? t("Wohnung „{n}“ angelegt – Dashboard „{d}“ gleich mit", { n: name, d: made }) : t("Wohnung „{n}“ angelegt", { n: name }));
          await this._load();
        } catch (e) {
          this._flash(t("Fehler: {e}", { e: e.message || e }));
        }
      }));
      const roomList = (entry, key, fallback) => {
        const room = (this._rooms || []).find((x) => (x.attrs.settings || {}).entry_id === entry);
        const s = room && room.attrs.settings || {};
        return [...(room && this._roomOpt(room, key)) ?? s[key] ?? fallback];
      };
      const mailbox = this.shadowRoot.querySelector("[data-mailbox]");
      if (mailbox) mailbox.addEventListener("toggle", () => {
        this._mailOpen = mailbox.open;
      });
      $("[data-mail]").forEach((el) => el.addEventListener("input", () => {
        this._mailForm = { ...this._mailForm || {}, [el.dataset.mail]: el.value };
      }));
      $("[data-mailprov]").forEach((el) => el.addEventListener("click", () => {
        const p = RK_MAIL_PROVIDERS[el.dataset.mailprov];
        this.shadowRoot.querySelectorAll("[data-mailprov]").forEach((b) => b.classList.toggle("on", b === el));
        if (!p) return;
        this._mailForm = { ...this._mailForm || {}, mail_server: p[0], mail_port: String(p[1]), mail_security: p[2] };
        for (const [k, v] of Object.entries({ mail_server: p[0], mail_port: p[1] })) {
          const inp = this.shadowRoot.querySelector(`[data-mail="${k}"]`);
          if (inp) inp.value = v;
        }
        this.shadowRoot.querySelectorAll("[data-mailsec]").forEach((b) => b.classList.toggle("on", b.dataset.mailsec === p[2]));
      }));
      $("[data-mailsec]").forEach((el) => el.addEventListener("click", () => {
        this._mailForm = { ...this._mailForm || {}, mail_security: el.dataset.mailsec };
        this.shadowRoot.querySelectorAll("[data-mailsec]").forEach((b) => b.classList.toggle("on", b === el));
      }));
      const mailSettings = () => {
        const f = { ...this._mailForm || {} };
        const out = {};
        for (const k of ["mail_server", "mail_port", "mail_security", "mail_user", "mail_password", "mail_from", "mail_to"]) {
          if (f[k] === void 0) continue;
          out[k] = k === "mail_port" ? f[k] === "" ? null : parseInt(f[k], 10) : String(f[k]).trim();
        }
        return out;
      };
      $("[data-mailtoggle]").forEach((el) => el.addEventListener("click", () => {
        if (this._hubOpt("report_email")) {
          this._setHub({ report_email: null }, 200);
          return;
        }
        if (this._hubOpt("mail_server") && this._hubOpt("mail_to")) {
          this._setHub({ report_email: "raumklima" }, 200);
          return;
        }
        this._mailOpen = true;
        this._mailMsg = ["", t("Bitte erst unten die Zugangsdaten eintragen und speichern.")];
        this._sig = null;
        this._render();
      }));
      $("[data-mailcheck]").forEach((el) => el.addEventListener("click", async () => {
        el.disabled = true;
        this._mailSteps = null;
        this._mailMsg = ["", t("Prüfe Zugang …")];
        this._sig = null;
        this._render();
        try {
          const r = await this._hass.callWS({ type: "raumklima/mail/test", send: false, settings: mailSettings(), ...this._homeMsg() });
          this._mailSteps = r.steps;
          this._mailMsg = r.ok ? ["okmsg", t("Alles in Ordnung – du kannst speichern und eine Test-Mail senden.")] : ["errmsg", t("Da stimmt noch etwas nicht – siehe oben.")];
        } catch (e) {
          this._mailMsg = ["errmsg", t("Fehler: {e}", { e: e.message || e })];
        }
        this._sig = null;
        this._render();
      }));
      $("[data-mailsave]").forEach((el) => el.addEventListener("click", async () => {
        this._mailSteps = null;
        const f = { ...this._mailForm || {} };
        const changes = { report_email: "raumklima" };
        for (const k of ["mail_server", "mail_port", "mail_security", "mail_user", "mail_password", "mail_from", "mail_to"]) {
          if (f[k] === void 0) continue;
          changes[k] = k === "mail_port" ? f[k] === "" ? null : parseInt(f[k], 10) : String(f[k]).trim();
        }
        el.disabled = true;
        this._mailMsg = ["", t("Sende Test-Mail …")];
        this._sig = null;
        this._render();
        try {
          await this._hass.callWS({ type: "raumklima/hub/update", changes, ...this._homeMsg() });
          const { report_email: _re, ...settings } = changes;
          const r = await this._hass.callWS({ type: "raumklima/mail/test", settings, ...this._homeMsg() });
          this._mailMsg = ["okmsg", t("Test-Mail an {to} gesendet – bitte Posteingang (und Spam) prüfen.", { to: (r.to || []).join(", ") })];
          this._mailForm = {};
        } catch (e) {
          this._mailMsg = ["errmsg", t("Fehler: {e}", { e: e.message || e })];
        }
        await this._load();
      }));
      $("[data-help]").forEach((el) => el.addEventListener("click", (ev) => {
        ev.stopPropagation();
        const k = el.dataset.help;
        if (this._helpOpen.has(k)) this._helpOpen.delete(k);
        else this._helpOpen.add(k);
        this._sig = null;
        this._render();
      }));
      $("[data-rpdf]").forEach((el) => el.addEventListener("click", () => {
        const list = [...this._hubOpt("report_pdf") ?? ["week", "month", "season"]];
        const i = list.indexOf(el.dataset.rpdf);
        if (i >= 0) list.splice(i, 1);
        else list.push(el.dataset.rpdf);
        this._setHub({ report_pdf: list });
      }));
      $("[data-pdftest]").forEach((el) => el.addEventListener("click", async () => {
        el.disabled = true;
        const r = await ws({ type: "raumklima/report/pdf/create", kind: "week", send: true, ...this._homeMsg() });
        el.disabled = false;
        if (r) this._flash(t("Bericht gesendet: {f}", { f: r.file }));
      }));
      $("[data-presrm]").forEach((el) => el.addEventListener("click", () => {
        this._setRoom(el.dataset.entry, { presence_sensors: roomPres(el.dataset.entry).filter((x) => x !== el.dataset.presrm) }, 200);
      }));
      $("[data-presadd]").forEach((el) => el.addEventListener("click", () => {
        const sel = this.shadowRoot.getElementById(`addPres-${el.dataset.presadd}`);
        if (sel && sel.value) this._setRoom(el.dataset.presadd, { presence_sensors: [...roomPres(el.dataset.presadd), sel.value] }, 200);
      }));
      const roomPres = (entry) => {
        const room = (this._rooms || []).find((x) => (x.attrs.settings || {}).entry_id === entry);
        const local = room && this._roomOpt(room, "presence_sensors");
        return [...local ?? Object.keys((room && room.attrs.settings || {}).presence_sensors || {})];
      };
      $("[data-lightrm]").forEach((el) => el.addEventListener("click", () => {
        this._setRoom(el.dataset.entry, { signal_lights: roomList(el.dataset.entry, "signal_lights", []).filter((x) => x !== el.dataset.lightrm) }, 200);
      }));
      $("[data-lightadd]").forEach((el) => el.addEventListener("click", () => {
        const sel = this.shadowRoot.getElementById(`addLight-${el.dataset.lightadd}`);
        if (sel && sel.value) this._setRoom(el.dataset.lightadd, { signal_lights: [...roomList(el.dataset.lightadd, "signal_lights", []), sel.value] }, 200);
      }));
      $("[data-lsig]").forEach((el) => el.addEventListener("click", () => {
        const list = roomList(el.dataset.entry, "light_signals", ["open", "close"]);
        const i = list.indexOf(el.dataset.lsig);
        if (i >= 0) list.splice(i, 1);
        else list.push(el.dataset.lsig);
        this._setRoom(el.dataset.entry, { light_signals: list }, 600);
      }));
      $("[data-lighttest]").forEach((el) => el.addEventListener("click", async () => {
        const r = await ws({ type: "raumklima/room/light_test", entry_id: el.dataset.lighttest });
        if (r) this._flash("Lampen blinken blau");
      }));
      $("[data-sigrm]").forEach((el) => el.addEventListener("click", () => {
        this._setHub({ sleep_signals: (this._hubOpt("sleep_signals") || []).filter((x) => x !== el.dataset.sigrm) });
      }));
      $("[data-sigadd]").forEach((el) => el.addEventListener("click", () => {
        const sel = this.shadowRoot.getElementById("addSig");
        if (sel && sel.value) this._setHub({ sleep_signals: [...this._hubOpt("sleep_signals") || [], sel.value] });
      }));
      $("[data-kind]").forEach((el) => el.addEventListener("click", () => {
        const key = el.dataset.ch === "tts" ? "tts" : "recipients";
        const table = JSON.parse(JSON.stringify(this._hubOpt(key) || {}));
        const list = table[el.dataset.target] || [];
        const i = list.indexOf(el.dataset.kind);
        if (i >= 0) list.splice(i, 1);
        else list.push(el.dataset.kind);
        table[el.dataset.target] = list;
        this._setHub({ [key]: table });
      }));
      $("[data-remove]").forEach((el) => el.addEventListener("click", () => {
        const key = el.dataset.ch === "tts" ? "tts" : "recipients";
        const table = JSON.parse(JSON.stringify(this._hubOpt(key) || {}));
        delete table[el.dataset.remove];
        this._setHub({ [key]: table }, 100);
      }));
      $("[data-add]").forEach((el) => el.addEventListener("click", () => {
        const sel = this.shadowRoot.getElementById("addTarget");
        if (!sel || !sel.value) return;
        const key = el.dataset.add === "tts" ? "tts" : "recipients";
        const table = JSON.parse(JSON.stringify(this._hubOpt(key) || {}));
        table[sel.value] = el.dataset.add === "tts" ? ["too_cold"] : [...RK_DEFAULT_PUSH];
        this._setHub({ [key]: table }, 100);
      }));
      $("[data-test]").forEach((el) => el.addEventListener("click", async () => {
        const r = await ws({ type: "raumklima/notify/test", target: el.dataset.test, ...this._homeMsg() });
        if (r) this._flash(t("Testnachricht an {n} gesendet", { n: rkPretty(el.dataset.test) }));
      }));
      $("[data-diag]").forEach((el) => el.addEventListener("click", () => {
        this._trace("click", { what: "diagnose" });
        this._downloadDiagnostics();
      }));
      $("[data-backup]").forEach((el) => el.addEventListener("click", () => {
        this._trace("click", { what: "sichern" });
        this._backupExport();
      }));
      const restoreInput = this.shadowRoot.getElementById("rkrestore");
      $("[data-restore]").forEach((el) => el.addEventListener("click", () => restoreInput?.click()));
      if (restoreInput) restoreInput.addEventListener("change", async () => {
        const file = restoreInput.files && restoreInput.files[0];
        if (file) await this._backupImport(file);
        restoreInput.value = "";
      });
      $("[data-bug]").forEach((el) => el.addEventListener("click", () => {
        this._trace("click", { what: "bug" });
        this._openBugReport();
      }));
      $("[data-sheet-close]").forEach(
        (el) => el.addEventListener("click", (ev) => {
          if (ev.target !== el || el.classList.contains("sheet")) return;
          this._closeSheet();
        })
      );
      $("[data-sheet-copy]").forEach((el) => el.addEventListener("click", () => {
        this._trace("sheet:copy");
        this._sheetCopy();
      }));
      $("[data-sheet-share]").forEach((el) => el.addEventListener("click", () => {
        this._trace("sheet:share", { share: Boolean(navigator.share) });
        this._sheetShare();
      }));
      $("[data-sheet-save]").forEach((el) => el.addEventListener("click", () => {
        this._trace("sheet:save");
        this._sheetSave();
      }));
      $("[data-action]").forEach((el) => el.addEventListener("click", async () => {
        await ws({ type: "raumklima/hub/action", action: el.dataset.action, ...this._homeMsg() });
        this._load();
      }));
      $("[data-nav]").forEach((el) => el.addEventListener("click", () => {
        history.pushState(null, "", el.dataset.nav);
        window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: false } }));
      }));
    }
  };

  // src/cards/report.js
  var RaumklimaReportCard = class extends HTMLElement {
    // Neu zeichnen ohne Springen der Seite
    set _html(html) {
      rkPaint(this, html);
    }
    static getConfigForm() {
      return { schema: [{ name: "title", selector: { text: {} } }, { name: "strip_prefix", selector: { text: {} } }] };
    }
    static getStubConfig() {
      return {};
    }
    setConfig(config) {
      this._config = { ...config };
      this._period = this._period || "week";
      if (!this.shadowRoot) this.attachShadow({ mode: "open" });
    }
    getCardSize() {
      return 10;
    }
    getGridOptions() {
      return { columns: "full", rows: "auto" };
    }
    connectedCallback() {
      this.style.display = "block";
      this._poll = setInterval(() => this._load(), 10 * 60 * 1e3);
    }
    disconnectedCallback() {
      clearInterval(this._poll);
    }
    set hass(hass) {
      const first = !this._hass;
      this._hass = hass;
      setLang(hass);
      if (first) {
        this._colors();
        rkLayout(hass, rkHomeId(hass, this._config)).then((L) => {
          this._layout = L;
          this._order = this._roomOrder();
          this._render();
        });
        this._load();
        this._render();
      }
    }
    /** Position je Raumname aus der gepflegten Reihenfolge (Namen wie im Server gekürzt). */
    _roomOrder() {
      const rooms = rkRoomsOrdered(rkRooms(this._hass, this._config.strip_prefix || "", rkHomeId(this._hass, this._config)), this._layout);
      const map = /* @__PURE__ */ new Map();
      rooms.forEach((r, i) => map.set(r.name, i));
      return map;
    }
    _pos(name) {
      const map = this._order;
      if (!map || !map.size) return 1e6;
      if (map.has(name)) return map.get(name);
      for (const [room, i] of map) {
        if (room.endsWith(" " + name) || name.endsWith(" " + room)) return i;
      }
      return 1e6;
    }
    // Fehler dürfen die Karte nie leer lassen: Meldung an den Server schicken und den Text
    // anzeigen. Auf dem iPad gibt es keine Konsole, und ein leerer Tab sagt niemandem etwas.
    _trace(event, data = {}) {
      try {
        this._hass.callWS({ type: "raumklima/trace", event, data: { ...data, version: RK_VERSION } }).catch(() => {
        });
      } catch (e) {
      }
    }
    _colors() {
      const rooms = rkRooms(this._hass, this._config.strip_prefix || "", rkHomeId(this._hass, this._config));
      this._roomColor = (name) => {
        const r = rooms.find((x) => x.name === name) || rooms.find((x) => x.name.endsWith(" " + name) || name.endsWith(" " + x.name));
        return r ? r.color : null;
      };
    }
    async _load() {
      if (!this._hass) return;
      try {
        this._data = await this._hass.callWS({ type: "raumklima/report", ...this._config.home ? { home: this._config.home } : {} });
        this._err = null;
        this._pdfs = (await this._hass.callWS({ type: "raumklima/report/pdf/list", ...this._config.home ? { home: this._config.home } : {} })).reports;
      } catch (e) {
        this._err = e.message || String(e);
      }
      this._render();
    }
    _tile(label, icon, tone, value, unit, detail, detailCls = "") {
      return `<div class="tile" style="--c:${toneVar(tone)}"><div class="k"><ha-icon icon="${icon}"></ha-icon>${t(label)}</div>
      <div class="n">${value}${unit ? `<small>${unit}</small>` : ""}</div>${detail ? `<div class="d ${detailCls}">${detail}</div>` : ""}</div>`;
    }
    _render() {
      if (!this._hass) return;
      const d = this._data;
      const P = this._period;
      let body;
      if (this._err) body = `<div class="err">${t("Bericht nicht verfügbar: {e}", { e: esc(this._err) })}</div>`;
      else if (!d) body = `<div class="empty">${t("Lade Bericht …")}</div>`;
      else {
        try {
          body = this._body(d, P);
          this._trace("report:ok", { metric: d.metric || "?", rooms: Object.keys((d[P] || {}).rooms || {}).length });
        } catch (e) {
          const msg = String(e && (e.stack || e.message) || e).slice(0, 300);
          this._trace("report:error", { e: msg });
          body = `<div class="err">${t("Bericht konnte nicht gezeichnet werden: {e}", { e: esc(msg) })}</div>`;
        }
      }
      const since = d && d.since ? (/* @__PURE__ */ new Date(d.since + "T00:00:00")).toLocaleDateString(loc(), { day: "numeric", month: "long" }) : null;
      this._html = `<style>${STYLES}${HISTORY_STYLES}${SETTINGS_STYLES}${ISSUE_STYLES}${REPORT_STYLES}</style>
      <ha-card class="report" style="--tone:${toneVar("off")}">
        <div class="hhead"><div class="htitle"><ha-icon icon="mdi:chart-box-outline"></ha-icon><div>${esc(this._config.title || t("Heizbericht"))}${since ? `<div class="rsub">${t("Daten seit {d}", { d: since })}</div>` : ""}</div></div>
          <div class="segs"><button class="${P === "week" ? "on" : ""}" data-p="week">${t("Diese Woche")}</button><button class="${P === "month" ? "on" : ""}" data-p="month">${t("Dieser Monat")}</button></div>
          <button class="btn" data-csv title="${t("Tageswerte je Raum als Tabelle (CSV)")}"><ha-icon icon="mdi:file-delimited-outline"></ha-icon>CSV</button></div>
        ${body}
        ${this._pdfSection()}
      </ha-card>`;
      this.shadowRoot.querySelectorAll("[data-p]").forEach((b) => b.addEventListener("click", () => {
        this._period = b.dataset.p;
        this._render();
      }));
      this.shadowRoot.querySelectorAll("[data-csv]").forEach((b) => b.addEventListener("click", () => this._csv()));
      this.shadowRoot.querySelectorAll("[data-mkpdf]").forEach((b) => b.addEventListener("click", () => this._makePdf(b.dataset.mkpdf)));
      this.shadowRoot.querySelectorAll("[data-pdf]").forEach((b) => b.addEventListener("click", () => this._download(b.dataset.pdf, b.dataset.file)));
    }
    _pdfSection() {
      const kinds = { week: t("Woche"), month: t("Monat"), season: t("Heizsaison") };
      const list = (this._pdfs || []).slice(0, 8);
      const day = (s) => (/* @__PURE__ */ new Date(s + "T00:00:00")).toLocaleDateString(loc(), { day: "2-digit", month: "2-digit", year: "numeric" });
      const rows = list.map((r) => `<div class="pdfrow"><ha-icon icon="mdi:file-pdf-box"></ha-icon>
        <div class="pdfi"><b>${kinds[r.kind] || r.kind}${r.current ? ` <span class="no">${t("bis heute")}</span>` : ""}</b><small>${day(r.start)} – ${day(r.end)} · ${Math.max(1, Math.round(r.size / 1024))} KB</small></div>
        <button class="btn" data-pdf="${esc(r.url)}" data-file="${esc(r.file)}"><ha-icon icon="mdi:download"></ha-icon>${t("Herunterladen")}</button></div>`).join("");
      return `<div class="rsec"><h3><ha-icon icon="mdi:file-pdf-box"></ha-icon>${t("PDF-Berichte")}</h3>
      <div class="pdfmk">${Object.entries(kinds).map(([k, l]) => `<button class="btn" data-mkpdf="${k}" ${this._busy ? "disabled" : ""}><ha-icon icon="${this._busy === k ? "mdi:loading" : "mdi:plus"}"></ha-icon>${l}</button>`).join("")}</div>
      ${rows ? `<div class="pdflist">${rows}</div>` : `<div class="hint">${t("Noch keine PDF-Berichte. Sie entstehen automatisch: Woche sonntags 18 Uhr, Monat am 1., Heizsaison nach dem Saisonende – oder jetzt mit den Knöpfen oben (bis heute).")}</div>`}
      ${this._pdfMsg ? `<div class="hint">${esc(this._pdfMsg)}</div>` : ""}</div>`;
    }
    async _makePdf(kind) {
      this._busy = kind;
      this._pdfMsg = null;
      this._render();
      try {
        const r = await this._hass.callWS({ type: "raumklima/report/pdf/create", kind, ...this._config.home ? { home: this._config.home } : {} });
        this._busy = null;
        await this._load();
        await this._download(r.url, r.file);
      } catch (e) {
        this._busy = null;
        this._pdfMsg = t("PDF konnte nicht erstellt werden: {e}", { e: e.message || e });
        this._render();
      }
    }
    async _download(url, file) {
      try {
        const href = url.includes("token=") ? url : (await this._hass.callWS({ type: "auth/sign_path", path: url, expires: 120 })).path;
        const a = document.createElement("a");
        a.href = href;
        a.download = file || "";
        a.target = "_blank";
        a.style.display = "none";
        document.body.appendChild(a);
        a.dispatchEvent(new MouseEvent("click"));
        a.remove();
      } catch (e) {
        this._pdfMsg = t("Download fehlgeschlagen: {e}", { e: e.message || e });
        this._render();
      }
    }
    async _csv() {
      try {
        const r = await this._hass.callWS({ type: "raumklima/report/export", ...this._config.home ? { home: this._config.home } : {} });
        const url = URL.createObjectURL(new Blob(["\uFEFF" + r.csv], { type: "text/csv;charset=utf-8" }));
        const a = document.createElement("a");
        a.href = url;
        a.download = r.filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 5e3);
      } catch (e) {
        alert(t("Export fehlgeschlagen: {e}", { e: e.message || e }));
      }
    }
    _body(d, P) {
      const cur = d[P], prev = d[P === "week" ? "prev_week" : "prev_month"], change = d[P === "week" ? "week_change" : "month_change"];
      const T = cur.total;
      const vs = P === "week" ? t("Vorwoche") : t("Vormonat");
      if (!T.hours) {
        return `<div class="empty">${t("Der Bericht sammelt ab jetzt jede Minute, was die Heizung tut. Nach ein paar Stunden stehen hier die ersten Werte, aussagekräftig wird es nach einer Woche.")}</div><div class="rsec"><h3><ha-icon icon="mdi:heart-pulse"></ha-icon>${t("Gesundheit")}</h3>${rkIssueList(d.issues, true, this._config.strip_prefix)}</div>`;
      }
      const diff = (a, b, unit, dec = 0) => {
        if (!prev.total.hours || a == null || b == null) return "";
        const x = a - b;
        return t("{d} ggü. {vs}", { d: `${x > 0 ? "+" : x < 0 ? "−" : "±"}${fmt(Math.abs(x), dec)}${unit}`, vs });
      };
      const tiles = [
        this._tile("Heizstunden", "mdi:fire", "heat", fmt(T.heating_h, 0), " h", t("Ventil voll offen ≈ {v} h", { v: fmt(T.valve_h, 1) })),
        this._tile(
          "Wetterbereinigt",
          "mdi:scale-balance",
          change == null ? "off" : change <= 0 ? "ok" : "cold",
          change == null ? "–" : `${change > 0 ? "+" : change < 0 ? "−" : "±"}${Math.abs(change)}`,
          change == null ? "" : " %",
          change == null ? cur.hdd < 5 ? t("zu mild für einen Vergleich") : t("noch keine {vs}", { vs }) : t("je Heizgradtag ggü. {vs}", { vs }),
          change == null ? "" : change <= 0 ? "good" : "bad"
        ),
        this._tile("Abgesenkt", "mdi:home-export-outline", "eco", fmt(T.setback_h, 0), " h", T.setback_h ? t("im Schnitt −{v} °C", { v: fmt(T.setback_avg_k, 1) }) : t("alle waren da")),
        this._tile("Gespart", "mdi:piggy-bank-outline", "ok", T.saving_pct ? "≈ " + fmt(T.saving_pct, 1) : "0", " %", t("durch Absenkung (6 % je Grad)")),
        this._tile("Wohlfühlzeit", "mdi:emoticon-happy-outline", "ok", T.on_target_pct == null ? "–" : T.on_target_pct, T.on_target_pct == null ? "" : " %", t("Raum ±1 °C am Ziel")),
        this._tile("Draußen", "mdi:thermometer", "air", cur.outdoor_avg == null ? "–" : fmt(cur.outdoor_avg, 1), cur.outdoor_avg == null ? "" : " °C", t("{n} Heizgradtage", { n: fmt(cur.hdd, 0) }) + (diff(cur.hdd, prev.hdd, "", 0) ? " · " + diff(cur.hdd, prev.hdd, "", 0) : ""))
      ].join("");
      const n = P === "week" ? 14 : 31;
      const days = Array.isArray(d.daily) ? d.daily.slice(-n) : [];
      const metric = d.metric || "valve";
      const valKey = { valve: "valve_h", deficit: "deficit_kh", hours: "heating_h" }[metric] || "valve_h";
      const withValue = (k) => days.filter((x) => Object.values(x.rooms).some((r) => (Number(r[k]) || 0) > 0)).length;
      const fewValues = withValue(valKey) < Math.max(2, days.length * 0.3);
      const drawn = metric !== "valve" && fewValues && withValue("heating_h") > 0 ? "hours" : metric;
      const drawKey = { valve: "valve_h", deficit: "deficit_kh", hours: "heating_h" }[drawn] || "valve_h";
      const valOf = (r) => r && Number(r[drawKey]) || 0;
      const valText = (v) => drawn === "deficit" ? t("{v} K·h unter Ziel", { v: fmt(v, 1) }) : drawn === "hours" ? t("{v} h geheizt", { v: fmt(v, 0) }) : t("Ventil ≈ {v} h", { v: fmt(v, 1) });
      const barHint = drawn === "deficit" ? t("Balken = Gradstunden unter Ziel (K·h): wie weit die Räume über die Zeit unter ihrem Ziel lagen. Das ist gemessen, nicht geschätzt – die Geräte melden keine Ventilstellung.") : drawn === "hours" ? t("Balken = Heizstunden: wie lange die Räume Wärme angefordert haben.") : t("Balken = wie lange die Ventile umgerechnet voll offen waren (Maß für die Wärmemenge).");
      const names = Object.keys(cur.rooms).sort((a, b) => this._pos(a) - this._pos(b) || a.localeCompare(b));
      const color = (nm, i) => this._roomColor(nm) || ROOM_COLORS[i % ROOM_COLORS.length];
      const maxV = Math.max(1, ...days.map((x) => Object.values(x.rooms).reduce((s, r) => s + valOf(r), 0)));
      const maxH = Math.max(1, ...days.map((x) => x.hdd || 0));
      const today = d.daily[d.daily.length - 1].date;
      const wd = t("So,Mo,Di,Mi,Do,Fr,Sa").split(",");
      const bars = days.map((x) => {
        const tot = Object.values(x.rooms).reduce((s, r) => s + valOf(r), 0);
        const segs = names.map((nm, i) => {
          const v = valOf(x.rooms[nm]);
          return v ? `<i style="--c:${color(nm, i)};height:${(100 * v / tot).toFixed(1)}%"></i>` : "";
        }).join("");
        const tip = `${x.date}: ${valText(tot)}${x.outdoor != null ? ` · ${t("außen {v} °C", { v: fmt(x.outdoor, 1) })}` : ""}${x.hdd ? ` · ${fmt(x.hdd, 0)} ${t("HGT")}` : ""}`;
        return `<div class="day ${x.date === today ? "today" : ""}" title="${esc(tip)}"><div class="stk" style="height:${(100 * tot / maxV).toFixed(1)}%">${segs}</div>${x.hdd ? `<span class="hdd" style="bottom:${(100 * x.hdd / maxH).toFixed(1)}%"></span>` : ""}</div>`;
      }).join("");
      const labs = days.map((x, i) => {
        const dt = /* @__PURE__ */ new Date(x.date + "T12:00:00");
        const show = n <= 14 || i % 3 === 0 || x.date === today;
        return `<span>${show ? n <= 14 ? wd[dt.getDay()] : dt.getDate() + "." : ""}</span>`;
      }).join("");
      const legend = names.map((nm, i) => `<span><i style="--c:${color(nm, i)}"></i>${esc(nm)}</span>`).join("") + `<span><i class="dot" style="--c:var(--rk-air)"></i>${t("Heizgradtage (Kälte draußen)")}</span>`;
      const maxRoom = Math.max(1, ...names.map((nm) => valOf(cur.rooms[nm])));
      const rrows = names.map((nm, i) => {
        const r = cur.rooms[nm];
        const facts = [
          `<span>${t("<b>{v} h</b> geheizt", { v: fmt(r.heating_h, 0) })}</span>`,
          r.setback_h ? `<span>${t("<b>{v} h</b> abgesenkt", { v: fmt(r.setback_h, 0) })}</span>` : "",
          r.temp_avg != null ? `<span>Ø <b>${fmt(r.temp_avg, 1)} °C</b></span>` : "",
          r.humidity_avg != null ? `<span>${t("Ø <b>{v} %</b> Feuchte", { v: r.humidity_avg })}</span>` : "",
          r.humid_h >= 1 ? `<span class="w">${t("{v} h zu feucht", { v: fmt(r.humid_h, 0) })}</span>` : "",
          r.mold_h >= 1 ? `<span class="w">${t("{v} h Schimmelrisiko", { v: fmt(r.mold_h, 0) })}</span>` : "",
          r.window_pause_h >= 0.5 ? `<span>${t("{v} h Fenster offen", { v: fmt(r.window_pause_h, 1) })}</span>` : "",
          r.night_h >= 0.5 ? `<span>${t("{v} h Nachtlüften", { v: fmt(r.night_h, 0) })}</span>` : "",
          r.arrivals_warm_pct != null ? `<span>${t("<b>{v} %</b> warm bei Ankunft", { v: r.arrivals_warm_pct })}</span>` : "",
          r.trv_down_h >= 0.5 ? `<span class="w">${t("{v} h nicht erreichbar", { v: fmt(r.trv_down_h, 0) })}</span>` : ""
        ].join("");
        return `<div class="rrow" style="--c:${color(nm, i)}"><div class="nm"><i></i><span>${esc(nm)}</span></div>
        <div><div class="rbar" title="${valText(valOf(r))}"><i style="width:${(100 * valOf(r) / maxRoom).toFixed(1)}%;background:var(--c)"></i></div><div class="facts">${facts}</div></div></div>`;
      }).join("");
      const arrivals = T.arrivals ? t("Bei {p} % der Ankünfte war es schon warm", { p: T.arrivals_warm_pct ?? "–" }) + (cur.preheats ? " · " + t("{n}× vorgeheizt", { n: cur.preheats }) : "") : "";
      return `<div class="tiles">${tiles}</div>
      ${d.issues && d.issues.length ? `<div class="rsec"><h3><ha-icon icon="mdi:heart-pulse"></ha-icon>${t("Gesundheit")}</h3>${rkIssueList(d.issues, true, this._config.strip_prefix)}</div>` : ""}
      <div class="rsec"><h3><ha-icon icon="mdi:calendar-month-outline"></ha-icon>${t("Heizbedarf pro Tag")}</h3>
        <div class="days">${bars}</div><div class="daylab">${labs}</div><div class="lg">${legend}</div>
        <div class="hint">${barHint} ${t("Punkte = Heizgradtage: je kälter es draußen war, desto höher. Hohe Balken an milden Tagen sind ein Hinweis auf offene Fenster oder zu hohe Wunschtemperaturen.")}</div></div>
      <div class="rsec"><h3><ha-icon icon="mdi:door"></ha-icon>${t("Räume")}</h3><div class="rrows">${rrows}</div>
        ${arrivals ? `<div class="hint">${arrivals}.</div>` : ""}</div>
      <div class="hint">${t("Die Ersparnis ist eine Abschätzung nach der Faustregel der Verbraucherzentrale (≈ 6 % weniger Heizenergie je Grad Absenkung). „Wetterbereinigt“ vergleicht den Heizbedarf je Heizgradtag – ein kalter Monat macht ihn also nicht schlechter.")}</div>`;
    }
  };

  // src/cards/log.js
  var RK_LOG_CATS = tmap({
    presence: ["Anwesenheit", "mdi:home-account", "eco"],
    season: ["Heizsaison", "mdi:radiator", "heat"],
    target: ["Ziel & Heizung", "mdi:thermometer-auto", "ok"],
    window: ["Fenster", "mdi:window-open-variant", "air"],
    notify: ["Nachrichten", "mdi:bell-ring-outline", "warn"],
    manual: ["Von Hand", "mdi:hand-back-right-outline", "eco"],
    health: ["Gesundheit", "mdi:heart-pulse", "cold"],
    device: ["Thermostat-Befehle", "mdi:access-point", "off"],
    settings: ["Einstellungen", "mdi:cog-outline", "off"]
  });
  var LOG_STYLES = `
  ha-card.log { container-type: inline-size; padding: 24px 26px; }
  @media (max-width: 600px) { ha-card.log { padding: 18px 14px; } }
  .live { display:inline-flex; align-items:center; gap:6px; font-size:.82rem; font-weight:600; color:var(--secondary-text-color); }
  .live i { width:8px; height:8px; border-radius:50%; background: var(--rk-ok); box-shadow: 0 0 0 0 color-mix(in srgb, var(--rk-ok) 60%, transparent); animation: rkpulse 2s infinite; }
  .live.off i { background: var(--rk-off); animation:none; }
  @keyframes rkpulse { 0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--rk-ok) 55%, transparent); } 70% { box-shadow: 0 0 0 8px transparent; } 100% { box-shadow: 0 0 0 0 transparent; } }
  .filters { display:grid; gap:10px; margin:16px 0 6px; }
  .filters .chips { justify-content:flex-start; }
  .chip2 ha-icon { --mdc-icon-size:15px; color: var(--c); }
  .srch { font: inherit; font-size:.95rem; padding:10px 14px; border-radius:14px; border:1px solid color-mix(in srgb, var(--primary-text-color) 14%, transparent);
    background: var(--ha-card-background, var(--card-background-color)); color: var(--primary-text-color); width:100%; box-sizing:border-box; }
  .lday { margin-top:18px; }
  .ldayh { position:sticky; top:0; z-index:1; font-size:.8rem; font-weight:700; text-transform:uppercase; letter-spacing:.05em; color:var(--secondary-text-color);
    padding:6px 0; background: var(--ha-card-background, var(--card-background-color)); }
  .ev { display:grid; grid-template-columns: 46px 34px 1fr; gap:10px; align-items:start; padding:10px 0; border-top:1px solid color-mix(in srgb, var(--primary-text-color) 6%, transparent); }
  .ev:first-of-type { border-top:0; }
  .ev .tm { font-size:.86rem; font-weight:600; color:var(--secondary-text-color); font-variant-numeric:tabular-nums; padding-top:6px; }
  .ev .ic { width:34px; height:34px; border-radius:11px; display:grid; place-items:center; background: color-mix(in srgb, var(--c) 15%, transparent); color: var(--c); }
  .ev .ic ha-icon { --mdc-icon-size:18px; }
  .ev .bd { min-width:0; }
  .ev .ms { font-size:.98rem; font-weight:600; color:var(--primary-text-color); line-height:1.35; }
  .ev .rm { display:inline-block; font-size:.75rem; font-weight:700; padding:2px 8px; border-radius:999px; margin-right:6px; vertical-align:1px;
    background: color-mix(in srgb, var(--rc, var(--rk-off)) 16%, transparent); color: color-mix(in srgb, var(--rc, var(--rk-off)) 70%, var(--primary-text-color)); }
  .ev .wy { font-size:.86rem; color:var(--secondary-text-color); margin-top:3px; line-height:1.4; overflow-wrap:anywhere; }
  .ev .wy b { font-weight:600; color: color-mix(in srgb, var(--primary-text-color) 75%, var(--secondary-text-color)); }
  .ev.warn .ms { color: color-mix(in srgb, var(--rk-warn) 60%, var(--primary-text-color)); }
  .ev.new { animation: rkflash 1.6s ease-out; }
  @keyframes rkflash { from { background: color-mix(in srgb, var(--rk-ok) 14%, transparent); } to { background: transparent; } }
  .more { display:flex; justify-content:center; margin-top:16px; }
  .rep { display:inline-block; font-size:.75rem; font-weight:700; padding:2px 8px; border-radius:999px; margin-left:6px; vertical-align:1px;
    background: color-mix(in srgb, var(--rk-warn) 18%, transparent); color: color-mix(in srgb, var(--rk-warn) 70%, var(--primary-text-color)); }
`;
  var RaumklimaLogCard = class extends HTMLElement {
    // Neu zeichnen ohne Springen der Seite
    set _html(html) {
      rkPaint(this, html);
    }
    static getConfigForm() {
      return { schema: [{ name: "title", selector: { text: {} } }, { name: "strip_prefix", selector: { text: {} } }, { name: "entity", selector: { entity: { domain: "climate", integration: "raumklima" } } }] };
    }
    static getStubConfig() {
      return {};
    }
    setConfig(config) {
      this._config = { ...config };
      this._entries = this._entries || [];
      let saved = {};
      try {
        saved = JSON.parse(localStorage.getItem("raumklima-log-filter") || "{}");
      } catch (e) {
        saved = {};
      }
      this._room = this._room ?? saved.room ?? "";
      this._cats = this._cats || new Set(saved.cats || Object.keys(RK_LOG_CATS).filter((c) => c !== "device"));
      this._q = this._q || "";
      if (!this.shadowRoot) this.attachShadow({ mode: "open" });
    }
    getCardSize() {
      return 12;
    }
    getGridOptions() {
      return { columns: "full", rows: "auto" };
    }
    connectedCallback() {
      this.style.display = "block";
      if (this._hass) {
        this._load();
        if (!this._unsub) this._subscribe();
      }
      clearInterval(this._poll);
      this._poll = setInterval(() => this._poll5(), 5e3);
      this._onVis = () => {
        if (document.visibilityState === "visible") this._poll5();
      };
      document.addEventListener("visibilitychange", this._onVis);
    }
    disconnectedCallback() {
      clearInterval(this._poll);
      document.removeEventListener("visibilitychange", this._onVis);
      if (this._unsub) {
        this._unsub.then((u) => u && u()).catch(() => {
        });
        this._unsub = null;
      }
    }
    _add(list) {
      const known = new Set(this._entries.map((e) => e.id + "|" + e.t));
      const fresh = list.filter((e) => !known.has(e.id + "|" + e.t));
      if (!fresh.length) return false;
      this._entries = [...fresh, ...this._entries].sort((a, b) => a.t < b.t ? 1 : a.t > b.t ? -1 : 0);
      const vis = fresh.filter((e) => this._visible([e]).length);
      this._fresh = new Set(fresh.map((e) => e.id));
      this._hiddenNew = (this._hiddenNew || 0) + (fresh.length - vis.length);
      return true;
    }
    async _poll5() {
      if (!this._hass || document.visibilityState === "hidden" || this._polling) return;
      this._polling = true;
      try {
        const newest = this._entries.length ? Math.max(...this._entries.map((e) => e.id || 0)) : null;
        const msg = { type: "raumklima/log", limit: 100, ...newest ? { after: newest } : {}, ...this._config.home ? { home: this._config.home } : {} };
        const res = await this._hass.callWS(msg);
        const changed = this._add(res.entries);
        this._stamp = /* @__PURE__ */ new Date();
        if (changed) this._render();
        else {
          const st = this.shadowRoot.querySelector(".live .ts");
          if (st) st.textContent = " · " + rkTime(this._stamp);
        }
      } catch (e) {
      }
      this._polling = false;
    }
    set hass(hass) {
      const first = !this._hass;
      this._hass = hass;
      setLang(hass);
      if (first) {
        this._rooms = rkRooms(hass, this._config.strip_prefix || "", rkHomeId(hass, this._config));
        rkLayout(hass, rkHomeId(hass, this._config)).then((L) => {
          this._layout = L;
          this._rooms = rkRoomsOrdered(this._rooms || [], L);
          this._render();
        });
        if (this._config.entity) {
          const r = this._rooms.find((x) => x.id === this._config.entity);
          if (r) this._room = (r.attrs.settings || {}).entry_id || "";
        }
        this._load();
        this._subscribe();
        this._render();
      }
    }
    _save() {
      try {
        localStorage.setItem("raumklima-log-filter", JSON.stringify({ room: this._room, cats: [...this._cats] }));
      } catch (e) {
      }
    }
    async _load(older) {
      try {
        const msg = { type: "raumklima/log", limit: 300, ...this._config.home ? { home: this._config.home } : {} };
        if (this._cats.size < Object.keys(RK_LOG_CATS).length) msg.categories = [...this._cats];
        if (this._room) msg.entry_id = this._room;
        if (older && this._entries.length) msg.before = Math.min(...this._entries.map((e) => e.id || Infinity));
        const res = await this._hass.callWS(msg);
        this._entries = older ? [...this._entries, ...res.entries] : res.entries;
        this._end = res.entries.length < 300;
        this._err = null;
        this._stamp = /* @__PURE__ */ new Date();
        if (!older) this._hiddenNew = 0;
      } catch (e) {
        this._err = e.message || String(e);
      }
      this._render();
    }
    _subscribe() {
      if (!this._hass || !this._hass.connection || this._unsub) return;
      this._unsub = this._hass.connection.subscribeMessage((entry) => {
        this._add([entry]);
        this._stamp = /* @__PURE__ */ new Date();
        this._liveOff = false;
        this._render();
      }, { type: "raumklima/log/subscribe", ...this._config.home ? { home: this._config.home } : {} }).catch(() => {
        this._unsub = null;
        this._liveOff = true;
        this._render();
        return null;
      });
    }
    _roomOf(e) {
      if (!e.eid) return null;
      return this._rooms.find((r) => (r.attrs.settings || {}).entry_id === e.eid) || null;
    }
    _visible(src) {
      const q = this._q.trim().toLowerCase();
      return (src || this._entries).filter((e) => {
        if (!this._cats.has(e.cat) && RK_LOG_CATS[e.cat]) return false;
        if (this._room && e.eid && e.eid !== this._room) return false;
        if (this._room && !e.eid && !["presence", "season"].includes(e.cat)) return false;
        if (q && !`${e.msg} ${e.why || ""} ${e.room || ""}`.toLowerCase().includes(q)) return false;
        return true;
      });
    }
    _strip(s) {
      const p = this._config.strip_prefix;
      return p ? String(s).replace(new RegExp("^" + escRe(p) + "\\s*"), "").replace(new RegExp("(\\s)" + escRe(p) + "\\s+", "g"), "$1") : s;
    }
    _render() {
      if (!this._hass) return;
      const list = this._visible();
      const dayKey = (d) => d.toLocaleDateString(loc(), { weekday: "short", day: "numeric", month: "short" });
      const today = dayKey(/* @__PURE__ */ new Date()), yest = dayKey(new Date(Date.now() - 864e5));
      let html = "", cur = null;
      for (const e of list) {
        const d = new Date(e.t);
        const k = dayKey(d);
        if (k !== cur) {
          if (cur !== null) html += `</div>`;
          cur = k;
          html += `<div class="lday"><div class="ldayh">${k === today ? t("Heute") : k === yest ? t("Gestern") : k}</div>`;
        }
        const meta = RK_LOG_CATS[e.cat] || [e.cat, "mdi:information-outline", "off"];
        const room = this._roomOf(e);
        const roomName = room ? room.name : e.room ? this._strip(e.room) : null;
        html += `<div class="ev ${e.lvl === "warn" ? "warn" : ""} ${this._fresh && this._fresh.has && this._fresh.has(e.id) ? "new" : ""}" style="--c:${toneVar(meta[2])}">
        <div class="tm">${rkTime(d, { hour: "2-digit", minute: "2-digit" })}</div>
        <div class="ic" title="${meta[0]}"><ha-icon icon="${meta[1]}"></ha-icon></div>
        <div class="bd"><div class="ms">${roomName ? `<span class="rm" style="--rc:${room ? room.color : "var(--rk-off)"}">${esc(roomName)}</span>` : ""}${esc(this._strip(e.msg))}${e.n > 1 ? ` <span class="rep" title="${t("zuletzt {t}", { t: rkTime(new Date(e.t_last || e.t)) })}">×${e.n} · ${t("bis {t}", { t: rkTime(new Date(e.t_last || e.t), { hour: "2-digit", minute: "2-digit" }) })}</span>` : ""}</div>
        ${e.why ? `<div class="wy"><b>${e.cat === "notify" && e.msg.indexOf("Knopf") !== 0 ? t("Inhalt") : e.cat === "device" || e.cat === "settings" ? t("Details") : t("Warum")}:</b> ${esc(this._strip(e.why))}</div>` : ""}</div></div>`;
      }
      if (cur !== null) html += `</div>`;
      this._fresh = null;
      const roomChips = [`<button class="chip2 ${this._room ? "off" : ""}" data-room="" style="--c:var(--rk-off)"><i></i>${t("Alle Räume")}</button>`].concat(this._rooms.map((r) => {
        const id = (r.attrs.settings || {}).entry_id;
        return `<button class="chip2 ${this._room === id ? "" : "off"}" data-room="${id}" style="--c:${r.color}"><i></i>${esc(r.name)}</button>`;
      })).join("");
      const catChips = Object.entries(RK_LOG_CATS).map(([k, m]) => `<button class="chip2 ${this._cats.has(k) ? "" : "off"}" data-cat="${k}" style="--c:${toneVar(m[2])}"><ha-icon icon="${m[1]}"></ha-icon>${m[0]}</button>`).join("");
      const empty = this._err ? `<div class="err">${t("Protokoll nicht verfügbar: {e}", { e: esc(this._err) })}</div>` : !this._entries.length ? `<div class="empty">${t("Noch keine Einträge. Ab jetzt steht hier jede Entscheidung mit Begründung.")}</div>` : !list.length ? `<div class="empty">${t("Keine Einträge für diese Auswahl.")}</div>` : "";
      const focus = this.shadowRoot.activeElement && this.shadowRoot.activeElement.classList.contains("srch");
      this._html = `<style>${STYLES}${HISTORY_STYLES}${SETTINGS_STYLES}${REPORT_STYLES}${LOG_STYLES}</style>
      <ha-card class="log" style="--tone:${toneVar("off")}">
        <div class="hhead"><div class="htitle"><ha-icon icon="mdi:text-box-search-outline"></ha-icon><div>${esc(this._config.title || t("Protokoll"))}<div class="rsub">${t("Was wann warum entschieden wurde · 14 Tage")}</div></div></div>
          <span class="live ${this._liveOff ? "off" : ""}" title="${t("neue Einträge kommen sofort, zusätzlich wird alle 5 s nachgesehen")}"><i></i>${this._liveOff ? t("alle 5 s") : "live"}<span class="ts">${this._stamp ? ` · ${rkTime(this._stamp)}` : ""}</span></span></div>
        ${this._hiddenNew ? `<div class="hint" style="margin-top:8px">${t("+{n} neue Einträge sind durch die Filter ausgeblendet (z. B. Thermostat-Befehle).", { n: this._hiddenNew })} <button class="mini" data-showall>${t("Alle zeigen")}</button></div>` : ""}
        <div class="filters">
          <div class="chips">${roomChips}</div>
          <div class="chips">${catChips}</div>
          <input class="srch" placeholder="${t("Suchen … (z. B. Offset, Heizpause)")}" value="${esc(this._q)}">
        </div>
        ${empty}${html}
        ${this._entries.length && !this._end ? `<div class="more"><button class="btn" data-more><ha-icon icon="mdi:history"></ha-icon>${t("Ältere laden")}</button></div>` : ""}
      </ha-card>`;
      const $ = (s2) => this.shadowRoot.querySelectorAll(s2);
      $("[data-room]").forEach((b) => b.addEventListener("click", () => {
        this._room = b.dataset.room;
        this._save();
        this._render();
        this._load();
      }));
      $("[data-cat]").forEach((b) => b.addEventListener("click", () => {
        const c = b.dataset.cat;
        this._cats.has(c) ? this._cats.delete(c) : this._cats.add(c);
        this._save();
        this._render();
        this._load();
      }));
      $("[data-more]").forEach((b) => b.addEventListener("click", () => this._load(true)));
      $("[data-showall]").forEach((b) => b.addEventListener("click", () => {
        this._cats = new Set(Object.keys(RK_LOG_CATS));
        this._room = "";
        this._hiddenNew = 0;
        this._save();
        this._load();
      }));
      const s = this.shadowRoot.querySelector(".srch");
      s.addEventListener("input", () => {
        this._q = s.value;
        clearTimeout(this._qt);
        this._qt = setTimeout(() => this._render(), 250);
      });
      if (focus) {
        s.focus();
        s.setSelectionRange(s.value.length, s.value.length);
      }
    }
  };

  // src/cards/strategy.js
  function roomSort(config = {}) {
    const collator = new Intl.Collator(void 0, { numeric: true, sensitivity: "base" });
    const mode = config.sort || "floor";
    const byName = (a, b) => collator.compare(a.name, b.name);
    const areaName = (r) => r.area ? r.area.name : "";
    const floorName = (r) => r.floor ? r.floor.name : "";
    const level = (r) => r.floor ? r.floor.level ?? 0 : Number.MAX_SAFE_INTEGER;
    return (a, b) => {
      if (mode === "name") return byName(a, b);
      if (mode === "area") {
        return areaName(a) === areaName(b) ? byName(a, b) : collator.compare(areaName(a), areaName(b));
      }
      if (level(a) !== level(b)) return level(a) - level(b);
      if (floorName(a) !== floorName(b)) return collator.compare(floorName(a), floorName(b));
      return areaName(a) === areaName(b) ? byName(a, b) : collator.compare(areaName(a), areaName(b));
    };
  }
  var RaumklimaDashboardStrategy = class extends HTMLElement {
    static async generate(config, hass) {
      setLang(hass);
      const prefix = config.strip_prefix ?? "";
      const homeId = rkHomeId(hass, config) || "";
      const reg = Object.values(hass.entities || {});
      const rooms = reg.filter((e) => e.platform === "raumklima" && e.entity_id.startsWith("climate.")).map((e) => {
        const st = hass.states[e.entity_id];
        const sib = {};
        reg.forEach((x) => {
          if (x.device_id === e.device_id && x.platform === "raumklima" && x.translation_key) sib[x.translation_key] = x.entity_id;
        });
        const full = st && st.attributes.friendly_name || e.entity_id;
        const name = prefix ? full.replace(new RegExp("^" + escRe(prefix) + "\\s*"), "") : full;
        const ent = (hass.entities || {})[e.entity_id] || {};
        const dev = ent.device_id ? (hass.devices || {})[ent.device_id] || {} : {};
        const area = (hass.areas || {})[ent.area_id || dev.area_id] || null;
        const floor = area && area.floor_id ? (hass.floors || {})[area.floor_id] || null : null;
        return { id: e.entity_id, name, attrs: st ? st.attributes : {}, sib, area, floor };
      }).filter((r) => !homeId || !r.attrs.home || r.attrs.home === homeId).sort(roomSort(config));
      const H = homeId ? { home: homeId } : {};
      const layout = await rkLayout(hass, homeId).catch(() => null);
      const shown = rkLayoutApply(rooms, layout);
      shown.forEach((r, i) => {
        r.color = rkLayoutColor(layout, r.id) || ROOM_COLORS[i % ROOM_COLORS.length];
      });
      let weather = config.weather;
      if (!weather && homeId) {
        try {
          const cfg = await hass.callWS({ type: "raumklima/config", home: homeId });
          weather = cfg && cfg.hub && cfg.hub.options && cfg.hub.options.weather_entity || void 0;
        } catch (e) {
        }
      }
      if (!weather) weather = Object.keys(hass.states).find((id) => id.startsWith("weather."));
      const roomsView = {
        title: t("Räume"),
        path: "raeume",
        icon: "mdi:home-thermometer",
        type: "sections",
        max_columns: 3,
        sections: [
          { type: "grid", column_span: 3, cards: [{ type: "custom:raumklima-overview-card", ...H, title: config.title || t("Heizung"), weather, strip_prefix: prefix, grid_options: { columns: "full" } }] },
          // Überwachungsräume haben keine Heizung – die große Raumkarte wäre leer,
          // sie erscheinen nur als Kachel in der Übersicht.
          // Auch Überwachungsräume (ohne Thermostat) bekommen eine große Karte – die Karte
          // blendet Bedienung und Sollwert selbst aus und zeigt nur Messwerte und Hinweise.
          ...shown.filter((r) => rkLayoutSize(layout, r.id) !== "tile").map((r) => ({ type: "grid", cards: [{ type: "custom:raumklima-card", entity: r.id, name: r.name, accent: r.color, grid_options: { columns: "full" } }] }))
        ]
      };
      const hist = (mode) => ({ type: "custom:raumklima-history-card", ...H, mode, hours: 24, strip_prefix: prefix, grid_options: { columns: "full" } });
      const historyView = {
        title: t("Verlauf"),
        path: "verlauf",
        icon: "mdi:chart-line",
        type: "sections",
        max_columns: 3,
        sections: [
          ...weather ? [{ type: "grid", column_span: 3, cards: [{ type: "weather-forecast", entity: weather, forecast_type: "hourly", show_current: true, show_forecast: true, grid_options: { columns: "full" } }] }] : [],
          { type: "grid", column_span: 3, cards: [hist("temperature")] },
          { type: "grid", column_span: 3, cards: [hist("humidity")] },
          { type: "grid", column_span: 3, cards: [hist("timeline")] }
        ]
      };
      const settingsView = {
        title: t("Einstellungen"),
        path: "einstellungen",
        icon: "mdi:tune-variant",
        type: "sections",
        max_columns: 3,
        sections: [{ type: "grid", column_span: 3, cards: [{ type: "custom:raumklima-settings-card", ...H, strip_prefix: prefix, grid_options: { columns: "full" } }] }]
      };
      const reportView = {
        title: t("Bericht"),
        path: "bericht",
        icon: "mdi:chart-box-outline",
        type: "sections",
        max_columns: 3,
        sections: [{ type: "grid", column_span: 3, cards: [{ type: "custom:raumklima-report-card", ...H, strip_prefix: prefix, grid_options: { columns: "full" } }] }]
      };
      const logView = {
        title: t("Protokoll"),
        path: "protokoll",
        icon: "mdi:text-box-search-outline",
        type: "sections",
        max_columns: 3,
        sections: [{ type: "grid", column_span: 3, cards: [{ type: "custom:raumklima-log-card", ...H, strip_prefix: prefix, grid_options: { columns: "full" } }] }]
      };
      return { title: config.title || t("Heizung"), views: [roomsView, historyView, reportView, logView, settingsView] };
    }
  };

  // src/index.js
  if (!customElements.get("raumklima-card")) customElements.define("raumklima-card", RaumklimaCard);
  if (!customElements.get("raumklima-overview-card")) customElements.define("raumklima-overview-card", RaumklimaOverviewCard);
  var storedLang = null;
  try {
    storedLang = JSON.parse(localStorage.getItem("selectedLanguage") || "null");
  } catch (e) {
    storedLang = null;
  }
  setLang({ language: storedLang || navigator.language || "de" });
  window.customCards = window.customCards || [];
  if (!window.customCards.find((c) => c.type === "raumklima-card")) {
    window.customCards.push(
      { type: "raumklima-card", name: t("Raumklima – Raum"), description: t("Thermostat, Lüften und Klima eines Raums"), preview: true },
      { type: "raumklima-overview-card", name: t("Raumklima – Übersicht"), description: t("Alle Räume und Außenklima auf einen Blick"), preview: true },
      { type: "raumklima-settings-card", name: t("Raumklima – Einstellungen"), description: t("Was eingestellt ist, wer welche Hinweise bekommt – mit Reglern"), preview: false },
      { type: "raumklima-history-card", name: t("Raumklima – Verlauf"), description: t("Temperatur, Luftfeuchte oder Zeitleiste aller Räume"), preview: false },
      { type: "raumklima-log-card", name: t("Raumklima – Protokoll"), description: t("Was wann warum entschieden wurde – live, mit Filtern"), preview: false },
      { type: "raumklima-report-card", name: t("Raumklima – Heizbericht"), description: t("Woche und Monat: Heizstunden, Ersparnis, wetterbereinigter Vergleich, Gesundheit"), preview: false }
    );
  }
  if (!customElements.get("raumklima-settings-card")) customElements.define("raumklima-settings-card", RaumklimaSettingsCard);
  if (!customElements.get("raumklima-history-card")) customElements.define("raumklima-history-card", RaumklimaHistoryCard);
  if (!customElements.get("raumklima-log-card")) customElements.define("raumklima-log-card", RaumklimaLogCard);
  if (!customElements.get("raumklima-report-card")) customElements.define("raumklima-report-card", RaumklimaReportCard);
  if (!customElements.get("ll-strategy-dashboard-raumklima")) customElements.define("ll-strategy-dashboard-raumklima", RaumklimaDashboardStrategy);
  window.customStrategies = window.customStrategies || [];
  if (!window.customStrategies.find((x) => x.type === "raumklima")) {
    window.customStrategies.push({
      type: "raumklima",
      strategyType: "dashboard",
      name: "Raumklima",
      description: t("Heizung, Lüften und Klima aller Raumklima-Räume – baut sich automatisch auf"),
      documentationURL: "https://github.com/Goldi5/Raumklima-2"
    });
  }
  console.info(`%c RAUMKLIMA-CARD %c ${RK_VERSION} `, "background:#ff7a45;color:#fff;border-radius:4px 0 0 4px;padding:2px 6px", "background:#2ec4a6;color:#fff;border-radius:0 4px 4px 0;padding:2px 6px");
})();
