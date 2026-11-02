/* Raumklima 0.15.1 – gebaut aus frontend/src (npm run build). Nicht von Hand bearbeiten. */
(() => {
  // src/i18n/en.js
  var EN = {
    "Handbuch (PDF)": "Manual (PDF)",
    "Anleitung, Funktionen und häufige Fragen": "Setup, features and frequently asked questions",
    "Tageswerte je Raum als Tabelle (CSV)": "Daily values per room as a table (CSV)",
    "Export fehlgeschlagen: {e}": "Export failed: {e}",
    "Kalender": "Calendar",
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
    "Für eine zweite Wohnung (z. B. Remscheid) mit eigenen Bewohnern, Zone und Empfängern hier anlegen. Bestehende Räume bleiben in dieser Wohnung.": "Create a second home here (e.g. a holiday flat) with its own residents, zone and recipients. Existing rooms stay in this home.",
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
    "Neue Wohnung, z. B. Remscheid": "New home, e.g. Holiday flat",
    "Noch kein Empfänger – unten hinzufügen.": "No recipient yet – add one below.",
    "Noch keine Einträge. Ab jetzt steht hier jede Entscheidung mit Begründung.": "No entries yet. From now on every decision appears here with its reason.",
    "Nur Ansicht – Ändern erfordert Admin": "View only – changes require admin",
    "Offenes Fenster an Temperatursturz erkennen": "Detect open window from temperature drop",
    "Offset": "Offset",
    "Offset am Thermostat": "Offset at the thermostat",
    "Pause": "Paused",
    "Pause nach": "Pause after",
    "Pausiert – Fenster offen": "Paused – window open",
    "Preset „aus“": "Preset “off”",
    "Preset „{p}“": "Preset “{p}”",
    "Protokoll": "Log",
    "Protokoll nicht verfügbar: {e}": "Log not available: {e}",
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
    "z. B. Berlin": "e.g. Berlin",
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
    "Ventil Ø": "Valve avg"
  };

  // src/i18n.js
  var lang = "de";
  var locale = "de-DE";
  function setLang(hass) {
    const l = String(hass && (hass.locale && hass.locale.language || hass.language) || "de");
    lang = l.toLowerCase().startsWith("de") ? "de" : "en";
    locale = lang === "de" ? "de-DE" : l;
  }
  var getLang = () => lang;
  var loc = () => locale;
  function t(de, vars) {
    let s = lang === "de" ? de : EN[de] ?? de;
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
  var RK_VERSION = "0.15.1";

  // src/shared.js
  var rkManualUrl = () => `https://github.com/Goldi5/Raumklima-2/releases/latest/download/${getLang() === "de" ? "Raumklima-Handbuch.pdf" : "Raumklima-Manual.pdf"}`;
  var escRe = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  var STATUS = tmap({
    heating: { label: "Heizt", icon: "mdi:fire", tone: "heat" },
    idle: { label: "Temperatur erreicht", icon: "mdi:check-circle", tone: "ok" },
    window_open: { label: "Pausiert – Fenster offen", icon: "mdi:window-open-variant", tone: "air" },
    off: { label: "Aus", icon: "mdi:power", tone: "off" },
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
  function rkHomes(hass) {
    return Object.values(hass.entities || {}).filter((e) => e.platform === "raumklima" && e.translation_key === "presence" && hass.states[e.entity_id]).map((e) => {
      const a = hass.states[e.entity_id].attributes;
      return { id: a.home_id, name: a.home_name || t("Allgemein"), dashboard: a.home_dashboard, presence: e.entity_id };
    }).filter((h) => h.id);
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
  function planText(a, off) {
    if (off) return t("Heizung aus");
    const r = a.plan_reason;
    if (r === "season") return t("Heizpause");
    if (r === "frost") return t("Frostschutz <b>{v} °C</b>", { v: fmt(a.effective_target) });
    if (r === "valve_care") return t("Ventilpflege läuft");
    if ((r === "away_short" || r === "away_long") && a.effective_target != null)
      return t("Abgesenkt <b>{v} °C</b> · Wunsch {w}°", { v: fmt(a.effective_target), w: fmt(a.temperature) });
    if (r === "manual") return t("Ziel <b>{v} °C</b> · von Hand", { v: fmt(a.temperature) });
    if (r === "room_empty" && a.effective_target != null) return t("Raum leer · Ziel <b>{v} °C</b>", { v: fmt(a.effective_target) });
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
  function rkOpenSince(hass, a) {
    if (!a || !a.window_open) return null;
    const times = (a.window_entities || []).map((e) => hass.states[e]).filter((s) => s && s.state === "on" && s.last_changed).map((s) => Date.parse(s.last_changed));
    if (times.length) return Math.min(...times);
    return a.window_open_since ? Date.parse(a.window_open_since) : null;
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
    const time = d.toLocaleTimeString(loc(), { hour: "2-digit", minute: "2-digit" });
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
  :host { --rk-heat:#ff7a45; --rk-ok:#2ec4a6; --rk-air:#4f9dff; --rk-warn:#ffb020; --rk-cold:#ff4d6d; --rk-off:#8a94a6; --rk-eco:#8b7cf6; }
  ha-card { display:block; position:relative; box-sizing:border-box; overflow:hidden; border-radius:28px; padding:20px; isolation:isolate;
    background: var(--ha-card-background, var(--card-background-color)); transition: box-shadow .3s; }
  ha-card::before { content:""; position:absolute; inset:-40% -20% auto auto; width:320px; height:320px; z-index:-1;
    background: radial-gradient(circle, var(--tone) 0%, transparent 65%); opacity:.18; transition: background .6s; }
  .top { display:flex; align-items:center; gap:12px; }
  .name { font-size:1.15rem; font-weight:600; letter-spacing:-.01em; cursor:pointer; flex:1; color:var(--primary-text-color); }
  .chip { display:inline-flex; align-items:center; gap:6px; padding:6px 12px; border-radius:999px; font-size:.82rem; font-weight:600;
    color:var(--tone); background: color-mix(in srgb, var(--tone) 14%, transparent); white-space:nowrap; }
  .chip ha-icon { --mdc-icon-size:16px; }
  .wins { display:flex; gap:4px; color:var(--secondary-text-color); }
  .wins ha-icon { --mdc-icon-size:20px; }
  .wins .open { color: var(--rk-air); }
  .since { display:flex; align-items:center; gap:6px; margin-top:6px; font-size:.85rem; font-weight:600; color:var(--rk-air); font-variant-numeric:tabular-nums; }
  .since ha-icon { --mdc-icon-size:16px; }
  .since.occ { color:var(--secondary-text-color); margin-top:2px; font-weight:500; }
  .since.occ.in { color:var(--rk-ok); }
  .dial { position:relative; display:grid; place-items:center; margin:8px auto 4px; width:min(240px,100%); aspect-ratio:1/0.82; }
  .dial svg { position:absolute; inset:0; width:100%; height:100%; overflow:visible; }
  .track { stroke: color-mix(in srgb, var(--primary-text-color) 9%, transparent); }
  .fill { stroke: var(--tone); transition: stroke-dasharray .6s ease, stroke .6s; filter: drop-shadow(0 0 6px color-mix(in srgb, var(--tone) 55%, transparent)); }
  .knob { fill: var(--ha-card-background, var(--card-background-color)); stroke: var(--tone); stroke-width:3; filter: drop-shadow(0 2px 4px rgba(0,0,0,.25)); }
  .fill.muted { stroke: var(--rk-off); filter:none; opacity:.5; }
  .scale { font-size:10px; fill: var(--secondary-text-color); }
  .tlabel { font-size:11px; font-weight:600; fill: var(--tone); }
  .center { text-align:center; z-index:1; margin-top:-6px; }
  .now { font-size:3.2rem; font-weight:300; letter-spacing:-.04em; line-height:1; font-variant-numeric: tabular-nums; color:var(--primary-text-color); }
  .now small { font-size:1.2rem; vertical-align: super; margin-left:2px; color:var(--secondary-text-color); }
  .target { margin-top:6px; font-size:.9rem; color:var(--secondary-text-color); font-variant-numeric: tabular-nums; }
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
  var RK_ROOM_TYPES = tmap({ living: "Wohnraum", kitchen: "Küche", bedroom: "Schlafzimmer", bathroom: "Bad", children: "Kinderzimmer", rarely_used: "Selten genutzt" });
  var RK_CAL = tmap({ offset: "Offset am Thermostat", target: "Sollwert-Ausgleich", none: "Keine" });
  var RK_OFF = tmap({ auto: "Automatisch", preset: "Preset „aus“", hvac: "Modus „aus“", min_temp: "Minimaltemperatur" });
  var RK_SYNC = tmap({ ok: ["Synchron", "ok"], pending: ["Wird übertragen", "warn"], failed: ["Fehlgeschlagen", "cold"] });
  var RK_BUILDING = tmap({ unrenovated: "Altbau unsaniert", renovated: "Altbau saniert", new: "Neubau / gedämmt" });
  var RK_NIGHT = tmap({ auto: "Automatisch", on: "Ja", off: "Nein" });
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
    live: ["📱", "Lüft-Countdown auf dem Sperrbildschirm"]
  });
  var RK_LIGHT_SIGNALS = tmap({
    open: ["#005aff", "Bitte lüften"],
    close: ["#ff6e00", "Bitte schließen"],
    done: ["#00c83c", "Luft ausgetauscht"],
    problem: ["#ff0000", "Problem mit der Heizung"]
  });
  var RK_DEFAULT_PUSH = ["vent_open", "vent_close", "too_cold", "vent_done", "window_away", "season", "trv_failure", "health", "report"];
  var RK_SEV = tmap({ alert: ["cold", "mdi:alert-octagon-outline", "Dringend"], warn: ["warn", "mdi:alert-outline", "Prüfen"], info: ["air", "mdi:information-outline", "Hinweis"] });
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
  ha-card.settings { container-type: inline-size; padding: 26px 28px; max-width: 1500px; margin: 12px auto; }
  @media (max-width: 600px) { ha-card.settings { padding: 18px 16px; margin: 0; } }
  ha-card.settings .htitle { font-size:1.45rem; }
  ha-card.settings .htitle ha-icon { --mdc-icon-size:28px; }
  .tabs { display:flex; gap:6px; overflow-x:auto; scrollbar-width:none; margin:14px -4px 4px; padding:2px 4px 6px; }
  .tabs::-webkit-scrollbar { display:none; }
  .tabs.homes { margin-bottom:0; } .tabs.homes .tab { font-size:1.02rem; }
  .tab { all:unset; cursor:pointer; white-space:nowrap; padding:10px 18px; border-radius:999px; font-size:.98rem; font-weight:600; color:var(--secondary-text-color);
    background: color-mix(in srgb, var(--primary-text-color) 5%, transparent); display:inline-flex; align-items:center; gap:6px; }
  .tab ha-icon { --mdc-icon-size:16px; }
  .tab.on { background: var(--primary-text-color); color: var(--ha-card-background, var(--card-background-color)); }
  .tab .dot { width:7px; height:7px; border-radius:50%; background: var(--c, var(--rk-ok)); }
  .groups { display:grid; grid-template-columns: 1fr; gap:18px; margin-top:14px; }
  @container (min-width: 720px) { .groups { grid-template-columns: 1fr 1fr; } }
  @container (min-width: 1000px) { .grp.cols .rws { columns: 2; column-gap: 56px; } .grp.cols .row { break-inside: avoid; } }
  .grp { border-radius:24px; padding:20px 22px; background: color-mix(in srgb, var(--g, var(--rk-off)) 7%, transparent); border:1px solid color-mix(in srgb, var(--g, var(--rk-off)) 14%, transparent); min-width:0; }
  .grp.span { grid-column: 1 / -1; }
  .gh { display:flex; align-items:center; gap:10px; margin-bottom:10px; flex-wrap:wrap; }
  .gh .ic { width:40px; height:40px; border-radius:12px; display:grid; place-items:center; background: color-mix(in srgb, var(--g) 18%, transparent); color: var(--g); flex:none; }
  .gh .ic ha-icon { --mdc-icon-size:22px; }
  .gh b { font-size:1.15rem; color:var(--primary-text-color); flex:1; }
  .row { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:12px 0; border-top:1px solid color-mix(in srgb, var(--primary-text-color) 6%, transparent); min-height:30px; }
  .rws > .row:first-child { border-top:0; }
  .row .l { font-size:1rem; color:var(--primary-text-color); min-width:0; }
  .row .lbl { display:inline-flex; align-items:center; gap:6px; }
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
  .btn.primary { background: var(--primary-text-color); color: var(--ha-card-background, var(--card-background-color)); }
  .btn.primary ha-icon { color: inherit; }
  .hint { font-size:.9rem; color:var(--secondary-text-color); margin-top:12px; line-height:1.45; }
  .toast { position:sticky; bottom:8px; margin-top:12px; padding:10px 14px; border-radius:14px; font-size:.9rem; font-weight:600; background: var(--primary-text-color); color: var(--ha-card-background, var(--card-background-color)); width:max-content; max-width:100%; }
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

  // src/cards/room.js
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
      const base = this._pending ?? a.temperature ?? 20;
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
    _tick() {
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
      if (!this._hass || !this._config) return;
      const st = this._hass.states[this._config.entity];
      if (!st) {
        this._html = `<style>${STYLES}</style><ha-card><div class="err">${t("Entität {e} nicht gefunden", { e: this._config.entity })}</div></ha-card>`;
        return;
      }
      const a = st.attributes;
      const sib = this._siblings();
      const status = STATUS[a.status] || STATUS.idle;
      const vent = VENT[a.ventilation] || null;
      const target = this._pending ?? a.temperature;
      const isOff = st.state === "off";
      const name = this._config.name || a.friendly_name || t("Raum");
      const winOpen = a.window_open;
      this._openSince = a.window_open_since ? Date.parse(a.window_open_since) : null;
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
      const stats = [
        a.humidity_sensor ? stat("mdi:water-percent", t("Feuchte"), `${fmt(a.current_humidity, 0)} %`, humTone(a.current_humidity), sib.ventilation) : "",
        a.co2 != null ? stat("mdi:molecule-co2", "CO₂", `${fmt(a.co2, 0)}<small>ppm</small>`, a.co2 >= 1400 ? "cold" : a.co2 >= 1e3 ? "warn" : "ok") : "",
        a.dew_point !== void 0 && a.dew_point !== null ? stat("mdi:water-thermometer", t("Taupunkt"), `${fmt(a.dew_point)}°`, null, sib.dew_point) : "",
        stat("mdi:valve", ((a.settings || {}).extra_trvs || []).length ? t("Ventil Ø") : t("Ventil"), a.valve_position === null || a.valve_position === void 0 ? "–" : `${fmt(a.valve_position, 0)} %`, a.valve_position > 0 ? "heat" : null),
        a.outdoor_temperature !== void 0 && a.outdoor_temperature !== null ? stat("mdi:weather-partly-cloudy", t("Außen"), `${fmt(a.outdoor_temperature)}°<small>${fmt(a.outdoor_humidity, 0)} %</small>`, null) : "",
        stat("mdi:radiator", t("Heizkörper"), `${fmt(a.trv_temperature)}°`, null),
        a.offset !== void 0 && a.offset !== null ? stat("mdi:tune-variant", t("Offset"), `${a.offset > 0 ? "+" : ""}${fmt(a.offset)}°`, null, sib.offset) : ""
      ].join("");
      const syncCls = a.sync === "ok" ? "" : a.sync;
      const syncLabel = { ok: t("synchron"), pending: t("sendet …"), failed: t("keine Antwort") }[a.sync] || a.sync;
      const notif = sib.notifications ? this._hass.states[sib.notifications] : null;
      const wlogic = sib.window_logic ? this._hass.states[sib.window_logic] : null;
      this._html = `<style>${STYLES}</style>
      <ha-card style="--tone:${toneVar(status.tone)}">
        <div class="top">
          <div class="name" data-more="${this._config.entity}">${name}</div>
          ${a.window_open !== void 0 ? `<div class="wins"><ha-icon class="${winOpen ? "open" : ""}" icon="${winOpen ? "mdi:window-open-variant" : "mdi:window-closed-variant"}"></ha-icon></div>` : ""}
          <span class="chip"><ha-icon icon="${status.icon}"></ha-icon>${status.label}</span>
        </div>
        ${a.occupied === true || a.occupied === false ? `<div class="since occ ${a.occupied ? "in" : ""}"><ha-icon icon="${a.occupied ? "mdi:account" : "mdi:account-off-outline"}"></ha-icon><span ${a.occupied ? "" : "data-empty"}>${a.occupied ? t("Jemand im Raum") : ""}</span></div>` : ""}
        ${winOpen && this._winSince ? `<div class="since"><ha-icon icon="mdi:window-open-variant"></ha-icon><span data-since></span></div>` : ""}
        <div class="dial">
          ${this._arc(a.current_temperature, target, isOff)}
          <div class="center">
            <div class="now">${fmt(a.current_temperature)}<small>°C</small></div>
            <div class="target">${this._pending != null ? t("Ziel <b>{v} °C</b>", { v: fmt(target) }) : planText(a, isOff)}</div>
          </div>
        </div>
        <div class="ctrl">
          <button class="round" data-step="-0.5" ${isOff ? "disabled" : ""} aria-label="${t("kälter")}"><ha-icon icon="mdi:minus"></ha-icon></button>
          <button class="round" data-power aria-label="${t("an/aus")}" style="${isOff ? "" : "color:var(--tone)"}"><ha-icon icon="mdi:power"></ha-icon></button>
          <button class="round" data-step="0.5" ${isOff ? "disabled" : ""} aria-label="${t("wärmer")}"><ha-icon icon="mdi:plus"></ha-icon></button>
        </div>
        ${banner}
        <div class="stats">${stats}</div>
        <div class="actions">
          ${wlogic ? `<button class="pill ${wlogic.state === "on" ? "on" : ""}" data-toggle="${sib.window_logic}"><ha-icon icon="mdi:window-shutter-auto"></ha-icon>${t("Fensterlogik")}</button>` : ""}
          ${notif ? `<button class="pill ${notif.state === "on" ? "on" : ""}" data-toggle="${sib.notifications}"><ha-icon icon="${notif.state === "on" ? "mdi:bell-ring-outline" : "mdi:bell-off-outline"}"></ha-icon>${t("Hinweise")}</button>` : ""}
          <span class="sync ${syncCls}"><ha-icon icon="${a.sync === "ok" ? "mdi:check-circle-outline" : "mdi:sync"}"></ha-icon>${syncLabel}</span>
        </div>
      </ha-card>`;
      this.shadowRoot.querySelectorAll("[data-step]").forEach((b) => b.addEventListener("click", () => this._step(parseFloat(b.dataset.step))));
      const p = this.shadowRoot.querySelector("[data-power]");
      if (p) p.addEventListener("click", () => this._call("climate", isOff ? "turn_on" : "turn_off", { entity_id: this._config.entity }));
      this.shadowRoot.querySelectorAll("[data-toggle]").forEach((b) => b.addEventListener("click", () => this._call("switch", "toggle", { entity_id: b.dataset.toggle })));
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
    }
    disconnectedCallback() {
      clearInterval(this._timer);
    }
    _render() {
      if (!this._hass) return;
      const rooms = Object.values(this._hass.entities || {}).filter((e) => e.platform === "raumklima" && e.entity_id.startsWith("climate.")).map((e) => this._hass.states[e.entity_id]).filter(Boolean).filter((r) => !this._config.home || !r.attributes.home || r.attributes.home === this._config.home).sort((a, b) => (a.attributes.friendly_name || "").localeCompare(b.attributes.friendly_name || ""));
      const homes = rkHomes(this._hass);
      const curHome = this._config.home || rooms[0] && rooms[0].attributes.home;
      const homeBar = homes.length > 1 ? `<div class="homes">${homes.map((h) => `<a class="hm ${h.id === curHome ? "on" : ""}" ${h.id === curHome ? "" : `data-nav="/${esc(h.dashboard || "")}"`}><ha-icon icon="mdi:home-outline"></ha-icon>${esc(h.name)}</a>`).join("")}</div>` : "";
      const heating = rooms.filter((r) => r.attributes.status === "heating").length;
      const windows = rooms.filter((r) => r.attributes.window_open).length;
      const warn = rooms.filter((r) => ["please_open", "please_close", "too_cold"].includes(r.attributes.ventilation) || r.attributes.sync === "failed" || ["sensor_unavailable", "trv_unavailable"].includes(r.attributes.status)).length;
      const w = this._config.weather ? this._hass.states[this._config.weather] : null;
      const outT = w ? w.attributes.temperature : rooms.map((r) => r.attributes.outdoor_temperature).find((v) => v !== void 0 && v !== null);
      const outH = w ? w.attributes.humidity : rooms.map((r) => r.attributes.outdoor_humidity).find((v) => v !== void 0 && v !== null);
      const allSync = rooms.every((r) => r.attributes.sync === "ok");
      const hubIds = rkHub(this._hass, curHome);
      const presSt = hubIds.presence ? this._hass.states[hubIds.presence] : null;
      const seasSt = hubIds.heating_mode ? this._hass.states[hubIds.heating_mode] : null;
      const pres = presSt ? PRESENCE[presSt.state] : null;
      const seas = seasSt ? SEASON[seasSt.state] : null;
      const here = presSt ? Object.values(presSt.attributes.persons || {}).filter((p) => p.present).map((p) => p.name) : [];
      const row = (r) => {
        const a = r.attributes;
        const s = STATUS[a.status] || STATUS.idle;
        const v = VENT[a.ventilation];
        const off = r.state === "off";
        const tone = v && a.ventilation !== "ok" ? v.tone : s.tone;
        const label = v && a.ventilation !== "ok" ? v.label : s.label;
        const prefix = this._config.strip_prefix ?? "";
        const name = (a.friendly_name || "").replace(new RegExp("^" + escRe(prefix) + "\\s*"), "");
        return `<div class="room" data-more="${r.entity_id}" style="--tone:${toneVar(tone)}">
        <div class="rtop"><div class="dot"><ha-icon icon="${v && a.ventilation !== "ok" ? v.icon : s.icon}"></ha-icon></div>
          ${a.occupied === true ? `<ha-icon class="occ" icon="mdi:account" title="${t("Jemand im Raum")}"></ha-icon>` : ""}
          ${a.window_open ? `<span class="wopen"><ha-icon class="win" icon="mdi:window-open-variant"></ha-icon>${(() => {
          const s2 = rkOpenSince(this._hass, a);
          return s2 ? `<span title="${t("offen seit {c}", { c: rkClock(s2) })}">${rkDuration(Date.now() - s2)}</span>` : "";
        })()}</span>` : ""}</div>
        <div class="rn">${name}</div>
        <div class="rs">${label}</div>
        <div class="rbottom">
          <div class="rt">${fmt(a.current_temperature)}°</div>
          <div class="rmeta">${off ? t("aus") : a.plan_reason === "season" ? t("Pause") : a.effective_target != null && a.effective_target < a.temperature ? t("↓ {v}° · Wunsch {w}°", { v: fmt(a.effective_target), w: fmt(a.temperature) }) : t("Ziel {v}°", { v: fmt(a.temperature) })}${a.humidity_sensor ? `<b style="--st:${toneVar(humTone(a.current_humidity))}">${fmt(a.current_humidity, 0)} %</b>` : ""}</div>
        </div>
      </div>`;
      };
      this._html = `<style>${STYLES}
      .head { display:flex; align-items:flex-end; gap:16px; flex-wrap:wrap; }
      .title { font-size:1.5rem; font-weight:650; letter-spacing:-.02em; color:var(--primary-text-color); }
      .sub { color:var(--secondary-text-color); font-size:.9rem; margin-top:2px; }
      .out { text-align:right; color:var(--primary-text-color); }
      .out b { font-size:1.6rem; font-weight:300; letter-spacing:-.03em; }
      .out span { display:block; font-size:.78rem; color:var(--secondary-text-color); }
      .kpis { display:flex; gap:8px; margin:16px 0 8px; flex-wrap:wrap; }
      .rooms { display:grid; gap:10px; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); }
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
      .hm.on { background: var(--primary-text-color); color: var(--ha-card-background, var(--card-background-color)); cursor:default; }
      .rbottom { margin-top:auto; display:flex; align-items:flex-end; justify-content:space-between; gap:8px; }
      .rt { font-size:1.7rem; font-weight:300; letter-spacing:-.03em; font-variant-numeric: tabular-nums; color:var(--primary-text-color); line-height:1; }
      .rmeta { text-align:right; font-size:.78rem; color:var(--secondary-text-color); display:flex; flex-direction:column; gap:2px; }
      .rmeta b { color: var(--st); font-weight:650; }
    </style>
    <ha-card style="--tone:${toneVar(warn ? "warn" : heating ? "heat" : "ok")}">
      ${homeBar}
      <div class="head">
        <div style="flex:1;min-width:0"><div class="title">${this._config.title || t("Heizung")}</div>
          <div class="sub">${t("{r} Räume · {h} heizen · {w} Fenster offen", { r: rooms.length, h: heating, w: windows })}</div></div>
        ${outT !== void 0 && outT !== null ? `<div class="out"><b>${fmt(outT)}°</b><span>${t("außen · {h} %", { h: fmt(outH, 0) })}</span></div>` : ""}
      </div>
      <div class="kpis">
        <span class="chip" style="--tone:${toneVar(heating ? "heat" : "off")}"><ha-icon icon="mdi:fire"></ha-icon>${t("{n} heizen", { n: heating })}</span>
        <span class="chip" style="--tone:${toneVar(windows ? "air" : "off")}"><ha-icon icon="mdi:window-open-variant"></ha-icon>${t("{n} offen", { n: windows })}</span>
        <span class="chip" style="--tone:${toneVar(warn ? "warn" : "ok")}"><ha-icon icon="${warn ? "mdi:alert-circle-outline" : "mdi:check-circle-outline"}"></ha-icon>${warn ? warn > 1 ? t("{n} Hinweise", { n: warn }) : t("1 Hinweis") : t("alles gut")}</span>
        <span class="chip" style="--tone:${toneVar(allSync ? "ok" : "warn")}"><ha-icon icon="mdi:sync"></ha-icon>${allSync ? t("synchron") : t("sendet …")}</span>
        ${pres && presSt.attributes.configured ? `<span class="chip" data-more="${hubIds.presence}" style="--tone:${toneVar(pres.tone)};cursor:pointer"><ha-icon icon="${pres.icon}"></ha-icon>${presSt.state === "home" && here.length ? here.join(", ") : pres.label}${presSt.state === "preheat" && presSt.attributes.preheat_by ? ` · ${presSt.attributes.preheat_by}` : ""}</span>` : ""}
        ${seas ? `<span class="chip" data-more="${hubIds.heating_mode}" style="--tone:${toneVar(seas.tone)};cursor:pointer"><ha-icon icon="${seas.icon}"></ha-icon>${seas.label}${seasSt.attributes.mean_combined != null ? ` · Ø ${fmt(seasSt.attributes.mean_combined)}°` : ""}</span>` : ""}
      </div>
      <div class="rooms">${rooms.map(row).join("")}</div>
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
      if (first || !this._rooms) this._rooms = rkRooms(hass, this._config.strip_prefix || "", this._config.home);
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
      return this._hours > 48 ? d.toLocaleDateString(loc(), { weekday: "short", day: "numeric" }) : d.toLocaleTimeString(loc(), { hour: "2-digit", minute: "2-digit" });
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
        tip.innerHTML = `<div class="t">${new Date(ts).toLocaleString(loc(), { weekday: "short", hour: "2-digit", minute: "2-digit" })}</div>${rows}`;
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
    // ---------------------------------------------------------------- Anwesenheit
    "Wer wohnt hier?": [
      "Die Personen, deren Handys zählen. Ist keine davon in der Wohnungs-Zone, gilt die Wohnung nach der Wartezeit als leer und Raumklima senkt ab. Personen legst du in Home Assistant unter Einstellungen → Personen an und verknüpfst dort das Handy (Home-Assistant-App).",
      "The people whose phones count. If none of them is in the home zone, the home counts as empty after the waiting time and Raumklima lowers the temperature. People are created in Home Assistant under Settings → People, where you also link their phone (Home Assistant app)."
    ],
    "Wohnung (Zone)": [
      "Der Bereich auf der Karte, der als „zu Hause“ gilt. Meist „Home“; bei mehreren Wohnungen je Wohnung eine eigene Zone (Einstellungen → Bereiche & Zonen).",
      "The area on the map that counts as “home”. Usually “Home”; with several homes, one zone per home (Settings → Areas & zones)."
    ],
    "Absenken nach": [
      "So lange muss die Wohnung leer sein, bevor abgesenkt wird – damit kurz Brötchen holen nichts auslöst. 30 Minuten sind ein guter Wert.",
      "How long the home must be empty before lowering – so that popping out for bread doesn't trigger anything. 30 minutes is a good value."
    ],
    "„Länger weg“ ab": [
      "Nach so vielen Stunden ohne jemanden wird von „kurz weg“ auf „länger weg“ umgeschaltet – dann wird tiefer abgesenkt (z. B. über Nacht weg oder auf Reisen).",
      "After this many hours without anyone home, “briefly away” switches to “away longer” and the temperature is lowered further (e.g. away overnight or travelling)."
    ],
    "Vorheizen ab": [
      "Kommt jemand näher als diese Entfernung, wird schon vorgeheizt, damit es bei der Ankunft warm ist. Zusätzlich heizt Raumklima nach der gelernten Aufheizzeit vor. 0 schaltet das Vorheizen nach Entfernung aus.",
      "When someone gets closer than this distance, heating starts early so it is warm on arrival. Raumklima also preheats based on the learned heat-up time. 0 turns distance-based preheating off."
    ],
    "Präsenzmelder zählen": [
      "Sieht ein Präsenzmelder in einem Raum jemanden, gilt die Wohnung als bewohnt – auch wenn alle Handys weg sind (Besuch, Kinder ohne Handy). „Nur mmWave“ ist der sichere Standard, weil Bewegungsmelder (PIR) auch auf Haustiere reagieren. Im Urlaub zählen Melder nie.",
      "If a presence sensor sees someone in a room, the home counts as occupied – even when all phones are away (visitors, children without a phone). “mmWave only” is the safe default because motion sensors (PIR) also react to pets. During vacation sensors never count."
    ],
    Urlaub: [
      "Senkt sofort tief ab („länger weg“), egal wo die Handys sind. Endet automatisch, sobald jemand nach Hause kommt.",
      "Lowers the temperature right away (“away longer”), no matter where the phones are. Ends automatically as soon as someone comes home."
    ],
    "Gäste da": [
      "Solange an, wird nicht abgesenkt – auch wenn alle Bewohner weg sind. Praktisch, wenn Besuch ohne Handy in Home Assistant da ist.",
      "While on, nothing is lowered – even if all residents are away. Handy when visitors without a phone in Home Assistant are staying."
    ],
    Kalender: [
      "Ein Kalender aus Home Assistant. Läuft gerade ein Termin mit einem der Urlaubs-Wörter im Titel, wirkt er wie der Urlaubsschalter; mit einem der Zuhause-Wörter wie „Gäste da“.",
      "A calendar from Home Assistant. If an event with one of the vacation words in its title is running, it acts like the vacation switch; with one of the at-home words like “guests”."
    ],
    "… wie Urlaub": [
      "Wörter im Termintitel, die „verreist“ bedeuten, durch Komma getrennt. Groß-/Kleinschreibung egal.",
      "Words in the event title that mean “travelling”, separated by commas. Case doesn't matter."
    ],
    "… jemand bleibt zu Hause": [
      "Wörter im Termintitel, bei denen nicht abgesenkt werden soll, z. B. Homeoffice – auch wenn das Handy kurz woanders ist.",
      "Words in the event title for which nothing should be lowered, e.g. home office – even if the phone is briefly elsewhere."
    ],
    // ---------------------------------------------------------------- Heizsaison
    Betriebsart: [
      "Automatisch: geheizt wird nur, wenn es draußen kalt genug ist (Heizgrenze, Heizsaison, Kälteeinbruch). Immer heizen: ganzjährig. Heizpause: nie – außer ein Raum fällt unter die Sicherung.",
      "Automatic: heating only when it is cold enough outside (heating limit, season, cold snap). Always heat: all year. Heating pause: never – unless a room drops below the safety minimum."
    ],
    Heizgrenze: [
      "Liegt das Tagesmittel draußen (gemessen + Vorhersage) über diesem Wert, braucht das Haus keine Heizung – Raumklima macht Pause. 15 °C passt für die meisten Häuser; gut gedämmt eher 12–14 °C.",
      "If the daily mean outside (measured + forecast) is above this value, the building needs no heating and Raumklima pauses. 15 °C suits most homes; well insulated rather 12–14 °C."
    ],
    Heizsaison: [
      "Der Zeitraum, in dem normalerweise geheizt wird (Monat-Tag). Außerhalb wird nur bei einem Kälteeinbruch geheizt. Am Tag nach dem Ende kommt auch der Saisonbericht.",
      "The period in which you normally heat (month-day). Outside of it, heating only runs during a cold snap. The day after it ends, the season report is created."
    ],
    "Kälteeinbruch unter": [
      "Ist es außerhalb der Heizsaison 3 Tage lang kälter als dieser Wert, wird trotzdem geheizt – z. B. bei einem kalten Mai.",
      "If it is colder than this for 3 days outside the heating season, heating runs anyway – e.g. in a cold May."
    ],
    Sicherung: [
      "Fällt ein Raum während der Heizpause unter diese Temperatur, heizt er trotzdem – Schutz vor Auskühlen und Schimmel.",
      "If a room drops below this temperature during the heating pause, it heats anyway – protection against cooling down and mould."
    ],
    "Frostnacht: weniger absenken": [
      "Sagt die Vorhersage −5 °C oder kälter, wird bei Abwesenheit nur halb so tief abgesenkt. So kühlen die Wände nicht zu stark aus und der Raum ist schneller wieder warm.",
      "If the forecast says −5 °C or colder, setback during absence is only half as deep. Walls don't cool down too much and the room warms up faster."
    ],
    "Sommerpflege Ventile": [
      "Im Sommer öffnet Raumklima mittwochs um 11 Uhr die Ventile kurz ganz, damit sie nicht festsitzen.",
      "In summer Raumklima briefly opens the valves fully on Wednesdays at 11:00 so they don't get stuck."
    ],
    "Heute heizen": [
      "Für milde, aber kühle Tage: heizt 24 Stunden lang, auch wenn die Heizgrenze eigentlich eine Pause vorsieht.",
      "For mild but chilly days: heats for 24 hours even though the heating limit would normally pause."
    ],
    // ---------------------------------------------------------------- Schlafen
    "Zeiten lernen": [
      "Raumklima merkt sich, wann ihr ins Bett geht und aufsteht (Nachtlüften, Licht aus/an) und passt Ruhezeit und Nachtlüften daran an – verlängert sie nur, verkürzt sie nie.",
      "Raumklima learns when you go to bed and get up (night airing, lights off/on) and adjusts quiet hours and night airing – it only extends them, never shortens."
    ],
    Feiertage: [
      "Dein Bundesland: Die Nacht vor einem Feiertag gilt dann wie Wochenende (längere Ruhezeit am Morgen).",
      "Your German state: the night before a public holiday then counts like a weekend (longer quiet hours in the morning)."
    ],
    "Schlaf-Signale": [
      "Lampen oder Schalter, an denen Raumklima den Schlaf erkennt: abends alle aus = ins Bett, morgens eins an = aufgestanden.",
      "Lights or switches Raumklima uses to detect sleep: all off in the evening = bedtime, one on in the morning = up."
    ],
    // ---------------------------------------------------------------- Wohnung
    "Name der Wohnung": [
      "Erscheint im Umschalter oben im Dashboard und in Nachrichten – wichtig, wenn du mehrere Wohnungen hast.",
      "Shown in the switcher at the top of the dashboard and in messages – important if you have several homes."
    ],
    Dashboard: [
      "Pfad des Raumklima-Dashboards dieser Wohnung. Antippen einer Live-Aktivität oder eines Berichts öffnet diese Seite.",
      "Path of this home's Raumklima dashboard. Tapping a live activity or a report opens this page."
    ],
    Bauart: [
      "Wie gut die Außenwände dämmen. Daraus berechnet der Schimmelschutz, wie kalt die kälteste Wandstelle wird – bei einem unsanierten Altbau wird deshalb weniger abgesenkt.",
      "How well the outer walls insulate. Mould protection uses this to calculate how cold the coldest spot on the wall gets – an unrenovated old building is lowered less."
    ],
    "Heizkosten pro Jahr": [
      "Optional: deine Heizkosten pro Jahr laut Abrechnung. Nur für den PDF-Bericht – er rechnet die Ersparnis grob in Euro um und zeigt, was 1 °C weniger im Jahr bringt. Leer lassen = keine Euro-Angaben.",
      "Optional: your yearly heating costs from your bill. Only for the PDF report – it roughly converts savings into euros and shows what 1 °C less saves per year. Leave empty = no euro figures."
    ],
    // ---------------------------------------------------------------- Benachrichtigungen
    Ruhezeit: [
      "In dieser Zeit kommen Nachrichten leise an und es gibt keine Sprachansagen. Nur Dringendes ist laut: Raum kühlt aus, Fenster offen während niemand da ist, Thermostat reagiert nicht.",
      "During this time messages arrive silently and there are no voice announcements. Only urgent ones are loud: room cooling down, window open while nobody is home, thermostat not responding."
    ],
    "Wochenende bis": [
      "Am Wochenende endet die Ruhezeit erst zu dieser Uhrzeit – zum Ausschlafen.",
      "On weekends quiet hours end only at this time – for sleeping in."
    ],
    Nachtlüften: [
      "Wird ein Schlafzimmerfenster in diesem Zeitfenster geöffnet, gilt es als „Schlafen bei offenem Fenster“: keine Lüft-Hinweise, die Heizung wartet bis zum Schließen, morgens ein Gruß.",
      "If a bedroom window is opened in this time window, it counts as “sleeping with the window open”: no airing notices, heating waits until it is closed, a good-morning message."
    ],
    "… leise warnen unter": [
      "Wird es beim Schlafen mit offenem Fenster kälter als dieser Wert, kommt einmal pro Nacht eine leise Warnung.",
      "If it gets colder than this while sleeping with the window open, a quiet warning is sent once per night."
    ],
    "Erinnern alle": [
      "Besteht ein Problem weiter (z. B. Fenster offen, Raum kühlt aus), erinnert Raumklima in diesem Abstand – höchstens einige Male.",
      "If a problem persists (e.g. window open, room cooling down), Raumklima reminds you at this interval – only a few times."
    ],
    Wetterquelle: [
      "Woher die Außentemperatur und die Vorhersage kommen. Am besten ein Wetterdienst mit Vorhersage, z. B. weather.forecast_home – nötig für Heizgrenze, Lüftdauer, Sonnenseite und Frostnacht.",
      "Where the outdoor temperature and forecast come from. Ideally a weather service with a forecast, e.g. weather.forecast_home – needed for heating limit, airing time, sunny side and frost nights."
    ],
    "Fehler auch in der HA-Glocke": [
      "Reagiert ein Thermostat nicht, erscheint zusätzlich eine Meldung in der Glocke von Home Assistant.",
      "If a thermostat doesn't respond, an additional notification appears in Home Assistant's bell."
    ],
    "PDF-Berichte": [
      "Welche Berichte automatisch als PDF entstehen: Woche (sonntags 18 Uhr), Monat (am 1.), Heizsaison (nach dem Saisonende). Sie kommen als Push an alle mit „Wochenbericht“ und stehen im Reiter Bericht zum Herunterladen.",
      "Which reports are created automatically as PDF: week (Sundays 18:00), month (on the 1st), heating season (after it ends). They are pushed to everyone with “weekly report” and listed in the Report tab for download."
    ],
    "PDF per E-Mail": [
      "Schickt jeden PDF-Bericht zusätzlich als Mail-Anhang. Einmal darunter „E-Mail einrichten“ aufklappen: Anbieter wählen (füllt Server und Port aus), Benutzer, Passwort und Empfänger eintragen, „Zugang prüfen“ und dann „Speichern & Test-Mail senden“ – danach ist der Schalter an. Bei Gmail, iCloud und Outlook braucht es ein App-Passwort.",
      "Also sends every PDF report as an email attachment. Open “Set up email” below once: pick your provider (fills in server and port), enter user, password and recipients, “Check login”, then “Save & send test email” – the switch is then on. Gmail, iCloud and Outlook need an app password."
    ],
    Test: ["Erstellt jetzt einen Wochenbericht und schickt ihn an alle Empfänger und per E-Mail.", "Creates a weekly report now and sends it to all recipients and by email."],
    // ---------------------------------------------------------------- Raum: Temperatur
    Wunschtemperatur: [
      "So warm soll der Raum sein, wenn jemand da ist. Gemessen wird mit dem Raumfühler, nicht am Heizkörper. Jedes Grad weniger spart etwa 6 % Heizenergie.",
      "How warm the room should be when someone is home. Measured with the room sensor, not at the radiator. Each degree less saves about 6 % heating energy."
    ],
    Raumtyp: [
      "Setzt passende Standardwerte für Wunschtemperatur, Feuchtegrenze, Mindesttemperatur und Absenkung (Bad wärmer und feuchter, Schlafzimmer kühler). Beim Wechsel startet der Raum kurz neu.",
      "Sets suitable defaults for desired temperature, humidity limit, minimum temperature and setback (bathroom warmer and more humid, bedroom cooler). Changing it restarts the room briefly."
    ],
    Wohnung: [
      "Zu welcher Wohnung der Raum gehört – bestimmt Bewohner, Zone, Empfänger und Bericht.",
      "Which home the room belongs to – determines residents, zone, recipients and report."
    ],
    Sonnenseite: [
      "Für Räume mit großen Süd- oder Westfenstern: Ist Sonne vorhergesagt und der Raum schon fast warm, heizt er 1 °C weniger – die Sonne erledigt den Rest.",
      "For rooms with large south or west windows: if sun is forecast and the room is almost warm, it heats 1 °C less – the sun does the rest."
    ],
    "Absenkung „kurz weg“": [
      "Zieltemperatur, wenn alle kurz weg sind. Nie tiefer, als der Schimmelschutz erlaubt.",
      "Target temperature when everyone is briefly away. Never lower than mould protection allows."
    ],
    "Absenkung „länger weg“": [
      "Zieltemperatur bei längerer Abwesenheit oder Urlaub. Feuchte Räume bleiben automatisch wärmer (Schimmelschutz).",
      "Target temperature during longer absence or vacation. Humid rooms automatically stay warmer (mould protection)."
    ],
    Aufheizen: [
      "Wie lange der Raum braucht, um 2 °C wärmer zu werden – Raumklima lernt das aus jedem Aufheizen und heizt danach rechtzeitig vor, bevor jemand ankommt.",
      "How long the room needs to get 2 °C warmer – Raumklima learns this from every heat-up and then preheats in time before someone arrives."
    ],
    // ---------------------------------------------------------------- Raum: Lüften
    Feuchtegrenze: [
      "Ab dieser Luftfeuchte (15 Minuten lang) kommt „Bitte lüften“ – aber nur, wenn Lüften auch trocknet, die Luft draußen also trockener ist. Ändern über Geräte & Technik.",
      "From this humidity (for 15 minutes) you get “please air the room” – but only if airing actually dries, i.e. the outside air is drier. Change it under devices & technical settings."
    ],
    Feuchtefühler: [
      "Sensor für die Luftfeuchte im Raum – nötig für Lüft-Hinweise und Schimmelschutz.",
      "Sensor for the room's humidity – needed for airing notices and mould protection."
    ],
    "Mindesttemperatur beim Lüften": [
      "Fällt der Raum beim Lüften darunter, kommt „Raum kühlt aus – bitte schließen“.",
      "If the room drops below this while airing, you get “room cooling down – please close”."
    ],
    "Max. Abkühlung beim Lüften": [
      "Kühlt der Raum beim Lüften um mehr als diesen Wert ab, kommt ebenfalls „bitte schließen“ – so kühlen die Wände nicht aus.",
      "If the room cools down by more than this while airing, you also get “please close” – so the walls don't cool down."
    ],
    Jetzt: ["Aktuelle Feuchte und Taupunkt im Raum.", "Current humidity and dew point in the room."],
    "Empfohlene Lüftdauer": [
      "Wie lange stoßlüften reicht – je kälter es draußen ist, desto kürzer (im Winter oft nur 5 Minuten).",
      "How long airing wide open is enough – the colder it is outside, the shorter (often only 5 minutes in winter)."
    ],
    // ---------------------------------------------------------------- Raum: Fenster
    "Heizung bei offenem Fenster pausieren": [
      "Ist ein Fenster offen, stoppt die Heizung; danach geht es mit der vorherigen Einstellung weiter. Schalte die eingebaute Fenstererkennung des Thermostats aus, damit sich beides nicht stört.",
      "When a window is open, heating stops; afterwards it continues with the previous setting. Turn off the thermostat's built-in window detection so the two don't interfere."
    ],
    "Pause nach": [
      "So lange muss das Fenster offen sein, bevor die Heizung pausiert – kurzes Öffnen löst nichts aus.",
      "How long the window must be open before heating pauses – briefly opening it doesn't trigger anything."
    ],
    "Weiter nach": [
      "So lange muss das Fenster zu sein, bevor wieder geheizt wird.",
      "How long the window must be closed before heating resumes."
    ],
    "Schlafen bei offenem Fenster": [
      "Wird abends im Schlafzimmer gelüftet, gilt das als Nachtlüften: keine Lüft-Hinweise, die Heizung wartet, morgens ein Gruß. Automatisch = ja für Schlafzimmer und selten genutzte Räume.",
      "If the bedroom window is opened in the evening, it counts as night airing: no airing notices, heating waits, a good-morning message. Automatic = yes for bedrooms and rarely used rooms."
    ],
    Kontakte: ["Die Fensterkontakte dieses Raums und ihr Zustand. Ändern über Geräte & Technik.", "This room's window contacts and their state. Change them under devices & technical settings."],
    "Offenes Fenster an Temperatursturz erkennen": [
      "Ohne (funktionierenden) Fensterkontakt: Fällt die Temperatur in 6 Minuten um 1 °C, nimmt Raumklima ein offenes Fenster an und pausiert. Automatisch = nur, wenn kein Kontakt zuverlässig meldet.",
      "Without a (working) window contact: if the temperature drops 1 °C in 6 minutes, Raumklima assumes an open window and pauses. Automatic = only if no contact reports reliably."
    ],
    // ---------------------------------------------------------------- Raum: Präsenz
    Melder: [
      "Präsenz- oder Bewegungsmelder in diesem Raum. mmWave (Radar) sieht auch Stillsitzende – sehr zuverlässig. PIR sieht nur Bewegung; Raumklima wartet deshalb länger, bevor der Raum als leer gilt.",
      "Presence or motion sensors in this room. mmWave (radar) also sees people sitting still – very reliable. PIR only sees movement, so Raumklima waits longer before the room counts as empty."
    ],
    Art: [
      "Automatisch: Geräteklasse „Bewegung“ = PIR, „Anwesenheit/Belegung“ = mmWave. Stimmt das bei deinem Melder nicht, hier fest einstellen.",
      "Automatic: device class “motion” = PIR, “presence/occupancy” = mmWave. If that's wrong for your sensor, set it here."
    ],
    "Leeren Raum absenken": [
      "Ist niemand im Raum, wird er etwas kühler – kommt jemand herein, sofort wieder warm. Automatisch = nur Wohnraum, Küche und selten genutzte Räume und nur mit mmWave. Schlafzimmer und Bad bleiben warm, außer du stellst „Ja“ ein.",
      "If nobody is in the room it gets a little cooler – when someone comes in, it warms up right away. Automatic = only living room, kitchen and rarely used rooms and only with mmWave. Bedrooms and bathrooms stay warm unless you set “yes”."
    ],
    "… wenn leer seit": [
      "So lange muss der Raum leer sein, bevor abgesenkt wird. Heizkörper reagieren träge – zu kurz spart kaum etwas.",
      "How long the room must be empty before lowering. Radiators are slow – too short saves hardly anything."
    ],
    "… um": [
      "So viel kühler wird der leere Raum – nie unter „kurz weg“ und den Schimmelschutz.",
      "How much cooler the empty room gets – never below “briefly away” and mould protection."
    ],
    // ---------------------------------------------------------------- Raum: Lichtsignal
    Lampen: [
      "Lampen, die bei Hinweisen dreimal farbig blinken und danach wieder so sind wie vorher. Nicht in der Ruhezeit, beim Nachtlüften, wenn niemand da ist oder der Raum leer ist.",
      "Lights that blink three times in colour on notices and then return to how they were. Not during quiet hours, night airing, when nobody is home or the room is empty."
    ],
    "Blinken bei": [
      "Bei welchen Hinweisen geblinkt wird: blau = bitte lüften, orange = bitte schließen/kühlt aus, grün = Luft ausgetauscht, rot = Problem mit der Heizung.",
      "Which notices make the lights blink: blue = please air, orange = please close/cooling down, green = air exchanged, red = heating problem."
    ],
    Ausprobieren: ["Lässt die Lampen jetzt einmal blau blinken.", "Makes the lights blink blue once now."],
    // ---------------------------------------------------------------- Raum: Benachrichtigungen & Technik
    "Hinweise für diesen Raum": [
      "Aus = dieser Raum schickt keine Lüft-Hinweise und keinen Lüft-Countdown. Geregelt wird trotzdem.",
      "Off = this room sends no airing notices and no airing countdown. It is still controlled."
    ],
    Empfänger: ["Wer Nachrichten bekommt, stellst du zentral unter Allgemein → Wer bekommt was ein.", "Who gets messages is set centrally under General → Who gets what."],
    Thermostat: ["Das Thermostat am Heizkörper. Ändern über Geräte & Technik.", "The radiator thermostat. Change it under devices & technical settings."],
    "Weitere Thermostate": [
      "Für Räume mit mehreren Heizkörpern. Diese Thermostate bekommen dieselben Befehle wie das Haupt-Thermostat (an/aus, Preset, Sollwert) – jedes mit eigener Prüfung, eigenem Korrekturwert und eigener Fehlermeldung. Fällt eins aus, heizen die anderen weiter. Hinzufügen oder entfernen über Geräte & Technik → Zahnrad beim Raum.",
      "For rooms with several radiators. These thermostats get the same commands as the main thermostat (on/off, preset, setpoint) – each with its own check, its own correction and its own failure notice. If one fails, the others keep heating. Add or remove them under devices & technical settings → gear icon of the room."
    ],
    Temperaturfühler: [
      "Der Fühler, nach dem geregelt wird – am besten in Raummitte, nicht am Heizkörper oder in der Sonne.",
      "The sensor used for control – ideally in the middle of the room, not at the radiator or in the sun."
    ],
    "CO₂-Sensor": [
      "Optional: ab 1000 ppm kommt „Bitte lüften“, „Luft ausgetauscht“ erst unter 800 ppm.",
      "Optional: from 1000 ppm you get “please air the room”, “air exchanged” only below 800 ppm."
    ],
    Kalibrierung: [
      "Wie das Thermostat dazu gebracht wird, die Raumtemperatur zu „sehen“: Offset (Korrekturwert am Thermostat), Sollwert-Ausgleich (Ziel am Thermostat anpassen) oder keine.",
      "How the thermostat is made to “see” the room temperature: offset (correction value on the thermostat), setpoint compensation (adjust the thermostat target) or none."
    ],
    "Einschalten mit": [
      "Mit welcher Betriebsart das Thermostat heizt. Automatisch meidet Modi, bei denen manche Thermostate das Ventil einfach ganz öffnen.",
      "Which mode the thermostat heats with. Automatic avoids modes in which some thermostats simply open the valve fully."
    ],
    "Ausschalten über": [
      "Wie „aus“ ans Thermostat geht: Preset „aus“, HVAC „aus“ oder Minimaltemperatur – je nachdem, was dein Gerät zuverlässig kann.",
      "How “off” is sent to the thermostat: preset “off”, HVAC “off” or minimum temperature – whatever your device handles reliably."
    ],
    "Drehen am Thermostat übernehmen": [
      "Ja: Drehst du am Thermostat, wird das die neue Wunschtemperatur. Nein: Raumklima stellt den Wert zurück.",
      "Yes: turning the thermostat sets the new desired temperature. No: Raumklima resets the value."
    ],
    Übertragung: [
      "Jeder Befehl wird nach kurzer Zeit geprüft und bei Bedarf wiederholt – gegen Funk- und VPN-Aussetzer. „Synchron“ heißt: Thermostat hat bestätigt.",
      "Every command is checked after a short time and repeated if needed – against radio and VPN drops. “In sync” means the thermostat has confirmed."
    ]
  };

  // src/cards/settings.js
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
      if (first) this._load();
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
      return this._home || this._config.home || this._cfg && this._cfg.hub && this._cfg.hub.entry_id || null;
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
    }
    // ---------------------------------------------------------------- Speichern
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
      for (const k of Object.keys(changes)) delete this._local[`room:${entryId}:${k}`];
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
      const box = open ? `<div class="helpbox">${esc(help[getLang() === "de" ? 0 : 1])}</div>` : "";
      return `<div class="row"><div class="l"><span class="lbl">${t(label)}${q}</span>${sub ? `<small>${t(sub)}</small>` : ""}</div>${value}</div>${box}`;
    }
    _v(text, mute) {
      return `<span class="v ${mute ? "mute" : ""}">${t(String(text))}</span>`;
    }
    _grp(title, icon, tone, rows, cls = "", extra = "") {
      return `<div class="grp ${cls}" style="--g:${toneVar(tone)}"><div class="gh"><div class="ic"><ha-icon icon="${icon}"></ha-icon></div><b>${t(title)}</b>${extra}</div><div class="rws">${rows}</div></div>`;
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
        `<div class="status"><span class="chip" style="--tone:${toneVar(pres.tone)}"><ha-icon icon="${pres.icon}"></ha-icon>${pres.label}${st.stage === "preheat" && st.preheat_by ? ` · ${esc(st.preheat_by)}` : ""}</span>${st.presence_configured ? "" : `<span class="chip" style="--tone:var(--rk-warn)"><ha-icon icon="mdi:information-outline"></ha-icon>${t("Bewohner und Zone wählen, dann ist es aktiv")}</span>`}</div>`,
        this._row("Wer wohnt hier?", `<div class="chips">${personChips || this._v("keine Personen in HA", true)}</div>`, "Tippen zum Aus-/Abwählen. Zählt, sobald eins ihrer Handys in der Zone ist."),
        this._row("Wohnung (Zone)", this._select(H, "zone", ch.zones || [], this._hubOpt("zone"), "– wählen –")),
        this._row("Absenken nach", this._optStepper(H, "away_delay", this._hubOpt("away_delay"), " min", 5, 0, 240), "damit kurze Wege nichts auslösen"),
        this._row("„Länger weg“ ab", this._optStepper(H, "long_away_hours", this._hubOpt("long_away_hours"), " h", 1, 2, 168)),
        this._row("Vorheizen ab", this._optStepper(H, "preheat_km", this._hubOpt("preheat_km"), " km", 1, 0, 200), "wenn sich jemand nähert"),
        this._row(
          "Präsenzmelder zählen",
          this._segs(H, "home_sensors", RK_HOMESENS, this._hubOpt("home_sensors") || "mmwave"),
          st.sensed && st.sensed.length ? t("gerade jemand in: {r}", { r: esc(st.sensed.join(", ")) }) : "sieht ein Melder jemanden, wird nicht abgesenkt – PIR löst auch bei Haustieren aus, darum standardmäßig nur mmWave; im Urlaub zählen Melder nie"
        ),
        this._row("Urlaub", this._toggle(hubIds.vacation), "endet automatisch bei Ankunft"),
        this._row("Gäste da", this._toggle(hubIds.guests), "nicht absenken, auch wenn alle Bewohner weg sind"),
        this._row(
          "Kalender",
          this._select(H, "calendar_entity", ch.calendars || [], this._hubOpt("calendar_entity"), "– keiner –"),
          st.calendar && st.calendar.mode ? t("gerade: „{s}“", { s: esc(st.calendar.summary || "") }) : "Termine mit diesen Wörtern steuern die Anwesenheit"
        ),
        this._hubOpt("calendar_entity") ? this._row("… wie Urlaub", `<input class="inp" data-hubtext="calendar_away_words" value="${esc(this._hubOpt("calendar_away_words") || "")}" ${this._admin ? "" : "disabled"}>`, "Komma-getrennt; absenken wie „länger weg“, sobald niemand da ist") : "",
        this._hubOpt("calendar_entity") ? this._row("… jemand bleibt zu Hause", `<input class="inp" data-hubtext="calendar_home_words" value="${esc(this._hubOpt("calendar_home_words") || "")}" ${this._admin ? "" : "disabled"}>`, "Komma-getrennt; dann wird nicht abgesenkt") : ""
      ].join("");
      const mode = this._hubOpt("season_mode");
      const mdToInput = (v) => esc(v || "");
      const seasRows = [
        `<div class="status"><span class="chip" style="--tone:${toneVar(seas.tone)}"><ha-icon icon="${seas.icon}"></ha-icon>${seas.label}</span>
        <span class="chip" style="--tone:var(--rk-off)"><ha-icon icon="mdi:thermometer"></ha-icon>${t("Ø 24 h {p} · Vorhersage {f}", { p: st.mean_past == null ? t("sammelt noch") : fmt(st.mean_past) + "°", f: st.mean_forecast == null ? "–" : fmt(st.mean_forecast) + "°" })}</span></div>`,
        this._row("Betriebsart", this._segs(H, "season_mode", RK_MODES, mode)),
        this._row("Heizgrenze", this._optStepper(H, "heating_limit", this._hubOpt("heating_limit"), " °C", 0.5, 5, 25, 1), "Tagesmittel außen, darüber Heizpause (nach 2 milden Tagen)"),
        this._row("Heizsaison", `<span class="v"><input class="inp short" data-md="season_start" value="${mdToInput(this._hubOpt("season_start"))}" ${this._admin ? "" : "disabled"}> ${t("bis")} <input class="inp short" data-md="season_end" value="${mdToInput(this._hubOpt("season_end"))}" ${this._admin ? "" : "disabled"}></span>`, "Format MM-TT, außerhalb nur bei Kälteeinbruch"),
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
      const lrn = (k) => {
        const v = sl[k] || {};
        const e = v.effective || {};
        const s = e.source || {};
        const mark = (key) => s[key] === "learned" ? ` <span class="lt">${t("gelernt")}</span>` : "";
        return `<tr><td>${k === "weekday" ? t("Werktags") : t("Wochenende")}</td>
        <td>${v.bed ? "~" + v.bed : `<span class="no">${t("{n}/4 Nächte", { n: v.nights_bed || 0 })}</span>`}</td>
        <td>${v.wake ? "~" + v.wake : `<span class="no">${t("{n}/4 Nächte", { n: v.nights_wake || 0 })}</span>`}</td>
        <td>${e.quiet_start || "–"}${mark("quiet_start")} – ${e.quiet_end || "–"}${mark("quiet_end")}</td>
        <td>${e.night_start || "–"}${mark("night_start")} – ${e.night_end || "–"}${mark("night_end")}</td></tr>`;
      };
      const sleepRows = [
        `<div class="status"><span class="chip" style="--tone:${sl.quiet_now ? "var(--rk-eco)" : "var(--rk-ok)"}"><ha-icon icon="${sl.quiet_now ? "mdi:sleep" : "mdi:white-balance-sunny"}"></ha-icon>${sl.quiet_now ? t("Ruhezeit gerade aktiv") : t("Keine Ruhezeit")}</span>${sl.asleep ? `<span class="chip" style="--tone:var(--rk-eco)"><ha-icon icon="mdi:lightbulb-off-outline"></ha-icon>${t("Licht aus – alle schlafen")}</span>` : ""}</div>`,
        this._row("Zeiten lernen", this._optToggle(H, "learn_times", !!this._hubOpt("learn_times")), "aus Nachtlüften und Licht – verlängert Ruhezeit und Nachtlüften nur, verkürzt nie"),
        this._row("Feiertage", this._select(H, "holiday_state", ch.states || [], this._hubOpt("holiday_state") || "", "– keine –"), sl.tonight && sl.tonight.holiday ? t("morgen: {h} – Ruhezeit wie am Wochenende", { h: esc(sl.tonight.holiday) }) : "Nacht vor einem Feiertag gilt wie Wochenende"),
        this._row("Schlaf-Signale", `<div class="chips">${sigChips || this._v("keine", true)}</div>`, "Lichter: abends alle 20 min aus = ins Bett, morgens eins an = aufgestanden"),
        this._admin && sigAvail.length ? `<div class="addrow"><select class="sel" id="addSig">${sigAvail.map((x) => `<option value="${esc(x.id)}">${esc(x.name)}</option>`).join("")}</select><button class="btn" data-sigadd style="--c:var(--rk-eco)"><ha-icon icon="mdi:lightbulb-plus-outline"></ha-icon>${t("Signal hinzufügen")}</button></div>` : "",
        `<div class="tblwrap"><table class="tbl sm"><thead><tr><th></th><th>${t("Ins Bett")}</th><th>${t("Aufstehen")}</th><th>${t("Ruhezeit wirksam")}</th><th>${t("Nachtlüften")}</th></tr></thead><tbody>${lrn("weekday")}${lrn("weekend")}</tbody></table></div>`,
        `<div class="hint">${t("Jede Nacht zählt einmal (frühestes Ereignis), getrennt nach Werktag und Wochenende (Fr→Sa, Sa→So); gelernt wird der typische Wert (Median) der letzten 6 Wochen, sobald 4 Nächte da sind. Die Ruhezeit beginnt 30 min vor der typischen Bettzeit und endet 30 min nach dem Aufstehen – aber nie kürzer als eingestellt.")}</div>`
      ].join("");
      const homes = this._cfg.homes || [];
      const homeRows = [
        this._row("Name der Wohnung", `<input class="inp" data-hubtext="name" value="${esc(this._hubOpt("name") || "")}" placeholder="${t("z. B. Berlin")}" ${this._admin ? "" : "disabled"}>`, "erscheint im Umschalter oben im Dashboard"),
        this._row("Dashboard", `<input class="inp" data-hubtext="dashboard" value="${esc(this._hubOpt("dashboard") || "")}" placeholder="${esc((homes.find((h) => h.entry_id === this._cfg.hub.entry_id) || {}).dashboard || "heizung")}" ${this._admin ? "" : "disabled"}>`, "Adresse des Dashboards dieser Wohnung (für den Umschalter)"),
        this._admin ? `<div class="addrow"><input class="inp" id="newHome" placeholder="${t("Neue Wohnung, z. B. Remscheid")}"><button class="btn" data-newhome style="--c:var(--rk-ok)"><ha-icon icon="mdi:home-plus-outline"></ha-icon>${t("Wohnung anlegen")}</button></div>` : "",
        `<div class="hint">${homes.length > 1 ? t("{n} Wohnungen: {list}. Jede hat eigene Bewohner, Zone, Empfänger, Heizsaison und Protokoll; Räume ordnest du im Raum unter „Wohnung“ zu.", { n: homes.length, list: homes.map((h) => esc(h.name) + " (" + t("{n} Räume", { n: h.rooms.length }) + ")").join(", ") }) : t("Für eine zweite Wohnung (z. B. Remscheid) mit eigenen Bewohnern, Zone und Empfängern hier anlegen. Bestehende Räume bleiben in dieser Wohnung.")}</div>`
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
        return `<div class="person"><div class="av" style="--c:${palette[i % palette.length]}">${channel === "tts" ? `<ha-icon icon="mdi:speaker"></ha-icon>` : esc(rkPretty(target)[0] || "?")}</div>
        <div class="pb"><div class="ph"><b>${esc(rkPretty(target))}</b>${this._admin ? `<button class="mini" data-test="${esc(target)}">${t("Test")}</button><button class="mini x" data-remove="${esc(target)}" data-ch="${channel}" title="${t("entfernen")}">✕</button>` : ""}</div>
        <small>${channel === "tts" ? t("Sprachansage · nie in der Ruhezeit") : t("Push aufs Handy")} · ${esc(target)}</small>
        <div class="chips">${chips}</div></div></div>`;
      };
      const cards = [...Object.entries(push).map(([tg, l], i) => card(tg, l || [], "push", i)), ...Object.entries(tts).map(([tg, l], i) => card(tg, l || [], "tts", i + 3))].join("") || `<div class="hint">${t("Noch kein Empfänger – unten hinzufügen.")}</div>`;
      const avail = (ch.notify || []).filter((tg) => !(tg in push) && !(tg in tts));
      const addRow = this._admin && avail.length ? `<div class="addrow">
        <select class="sel" id="addTarget">${avail.map((tg) => `<option value="${esc(tg)}">${esc(rkPretty(tg))} (${esc(tg)})</option>`).join("")}</select>
        <button class="btn" data-add="push" style="--c:var(--rk-air)"><ha-icon icon="mdi:cellphone-message"></ha-icon>${t("Als Push hinzufügen")}</button>
        <button class="btn" data-add="tts" style="--c:var(--rk-eco)"><ha-icon icon="mdi:speaker-message"></ha-icon>${t("Als Sprachansage")}</button></div>` : "";
      const hm = (v) => String(v || "").slice(0, 5);
      const notiRows = [
        this._row("Ruhezeit", `<span class="v"><input type="time" class="inp" data-time="quiet_start" value="${hm(this._hubOpt("quiet_start"))}" ${this._admin ? "" : "disabled"}> – <input type="time" class="inp" data-time="quiet_end" value="${hm(this._hubOpt("quiet_end"))}" ${this._admin ? "" : "disabled"}></span>`, "nur Dringendes (kühlt aus, Fenster offen bei Abwesenheit, Thermostat-Fehler) kommt laut"),
        this._row("Wochenende bis", `<span class="v"><input type="time" class="inp" data-time="quiet_end_weekend" value="${hm(this._hubOpt("quiet_end_weekend"))}" ${this._admin ? "" : "disabled"}></span>`, "Sa und So endet die Ruhezeit später – zum Ausschlafen"),
        this._row("Nachtlüften", `<span class="v"><input type="time" class="inp" data-time="night_start" value="${hm(this._hubOpt("night_start"))}" ${this._admin ? "" : "disabled"}> – <input type="time" class="inp" data-time="night_end" value="${hm(this._hubOpt("night_end"))}" ${this._admin ? "" : "disabled"}></span>`, "Fenster in Schlafräumen, das in dieser Zeit aufgeht, gilt als Schlafen bei offenem Fenster – keine Lüft-Hinweise, morgens ein Gruß"),
        this._row("… leise warnen unter", this._optStepper(H, "night_alarm_temp", this._hubOpt("night_alarm_temp"), " °C", 0.5, 5, 20, 1), "einmal pro Nacht"),
        this._row("Erinnern alle", this._optStepper(H, "repeat_minutes", this._hubOpt("repeat_minutes"), " min", 1, 1, 60), "solange das Problem besteht"),
        this._row("Wetterquelle", this._select(H, "weather_entity", ch.weather || [], this._hubOpt("weather_entity"), "– wählen –"), st.outdoor_temperature != null ? t("Draußen gerade {v} °C", { v: fmt(st.outdoor_temperature) }) : ""),
        this._row("Fehler auch in der HA-Glocke", this._optToggle(H, "notify_on_failure", !!this._hubOpt("notify_on_failure"))),
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
      const rowsT = this._rooms.map((r) => {
        const s = r.attrs.settings || {};
        const notif = (this._st(r.sib.notifications) || {}).state === "on";
        const wl = (this._st(r.sib.window_logic) || {}).state === "on";
        return `<tr data-tab="${r.id}"><td><span class="rn" style="--c:${r.color}"><i></i>${r.name}</span></td>
        <td>${RK_ROOM_TYPES[s.room_type] || s.room_type || "–"}</td>
        <td>${fmt(r.attrs.comfort_temperature)} °C</td>
        <td>${fmt(s.setback_short)} / ${fmt(s.setback_long)} °C</td>
        <td>${fmt(r.attrs.min_temp)} °C</td>
        <td>${r.attrs.humidity_limit != null ? fmt(r.attrs.humidity_limit, 0) + " %" : "–"}</td>
        <td>${yes(wl)}</td><td>${yes(notif)}</td></tr>`;
      }).join("");
      const issues = st.issues || [];
      const bad = issues.filter((i) => i.severity !== "info").length;
      const healthTone = issues.some((i) => i.severity === "alert") ? "cold" : bad ? "warn" : "ok";
      const healthExtra = `<span class="chip" style="--tone:${toneVar(healthTone)}">${bad ? t("{n} offen", { n: bad }) : "ok"}</span>`;
      return `<div class="groups">
      ${this._grp("Gesundheit der Heizung", "mdi:heart-pulse", healthTone, rkIssueList(issues, true, this._config.strip_prefix) + `<div class="hint">${t("Prüft alle 10 Minuten: Batterien, Raum wird trotz offenem Ventil nicht warm, Fühler hängt, Funkaussetzer, Fensterkontakt still. Meldungen gehen an alle mit „🩺 Gesundheit“.")}</div>`, "span", healthExtra)}
      ${this._grp("Anwesenheit & Absenkung", "mdi:home-account", "eco", presRows)}
      ${this._grp("Heizsaison & Heizgrenze", "mdi:radiator", "heat", seasRows)}
      ${this._grp("Wer bekommt was", "mdi:account-voice", "air", `<div class="people">${cards}</div>${addRow}`, "span")}
      ${this._grp("Benachrichtigungen allgemein", "mdi:bell-cog-outline", "warn", notiRows)}
      ${this._grp("Schlafenszeiten", "mdi:sleep", "eco", sleepRows, "span")}
      ${this._grp("Gebäude & Schimmelschutz", "mdi:home-city-outline", "ok", buildRows)}
      ${this._grp("Wohnung", "mdi:home-switch-outline", "air", homeRows)}
      ${this._grp("Alle Räume auf einen Blick", "mdi:table", "off", `<div class="tblwrap"><table class="tbl"><thead><tr><th>${t("Raum")}</th><th>${t("Typ")}</th><th>${t("Wunsch")}</th><th>${t("Absenkung kurz / länger")}</th><th>${t("Minimum Lüften")}</th><th>${t("Feuchte")}</th><th>${t("Fensterlogik")}</th><th>${t("Hinweise")}</th></tr></thead><tbody>${rowsT}</tbody></table></div><div class="hint">${t("Tippe auf einen Raum, um seine Einstellungen zu ändern.")}</div>`, "span")}
    </div>`;
    }
    // ---------------------------------------------------------------- Raum
    _room(r) {
      const a = r.attrs, s = a.settings || {}, sib = r.sib;
      const cfgRoom = this._cfgRoom(r);
      const id = s.entry_id;
      const scope = `room:${id}`;
      const sync = RK_SYNC[a.sync] || ["–", "off"];
      const contacts = (a.window_entities || []).map((w) => {
        const st = this._st(w);
        const open = st && st.state === "on";
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
      const virtMode = this._roomOpt(r, "virtual_window") ?? s.virtual_window ?? "auto";
      const editable = this._admin && cfgRoom;
      const push = Object.keys(this._cfg && this._cfg.hub && this._cfg.hub.options.recipients || {});
      const plan = a.plan_reason && a.plan_reason !== "normal" ? planText(a, false) : null;
      const rIssues = (this._cfg && this._cfg.hub && this._cfg.hub.state && this._cfg.hub.state.issues || []).filter((i) => i.entry_id === id);
      return `<div class="groups">
      ${rIssues.length ? this._grp("Gesundheit", "mdi:heart-pulse", rIssues.some((i) => i.severity === "alert") ? "cold" : "warn", rkIssueList(rIssues, false), "span") : ""}
      ${this._grp("Temperatur", "mdi:thermometer", "heat", [
        plan ? `<div class="status"><span class="chip" style="--tone:var(--rk-eco)"><ha-icon icon="mdi:information-outline"></ha-icon>${plan}</span></div>` : "",
        this._row("Wunschtemperatur", editable ? this._optStepper(scope, "comfort_temperature", comfort, " °C", 0.5, 12, 26, 1) : this._v(`${fmt(comfort)} °C`), "beim Einschalten und als Grundwert"),
        this._row("Raumtyp", editable ? this._select(scope, "room_type", Object.entries(RK_ROOM_TYPES).map(([k, v]) => ({ id: k, name: v })), roomType) : this._v(RK_ROOM_TYPES[roomType] || "–")),
        (this._cfg && this._cfg.homes || []).length > 1 ? this._row("Wohnung", editable ? this._select(scope, "home", this._cfg.homes.map((h) => ({ id: h.entry_id, name: h.name })), a.home || "") : this._v(esc(a.home_name || "–")), "Raum gehört zu dieser Wohnung (Bewohner, Zone, Empfänger)") : "",
        this._row(
          "Sonnenseite",
          editable ? this._optToggle(scope, "solar_gain", !!(this._roomOpt(r, "solar_gain") ?? s.solar_gain)) : this._v(s.solar_gain ? "ja" : "nein"),
          a.plan_reason === "solar" ? "gerade: Sonne erwartet – 1 °C weniger" : "bei Sonne laut Vorhersage 1 °C weniger heizen – die Sonne wärmt mit"
        ),
        this._row("Absenkung „kurz weg“", editable ? this._optStepper(scope, "setback_short", sbShort, " °C", 0.5, 10, 24, 1) : this._v(`${fmt(sbShort)} °C`), "wenn alle weg sind"),
        this._row(
          "Aufheizen",
          this._v(s.heatup && s.heatup.minutes_2k != null ? t("~{m} min für +2 °C", { m: s.heatup.minutes_2k }) : t("lernt noch ({n}/3)", { n: s.heatup && s.heatup.episodes || 0 }), !(s.heatup && s.heatup.minutes_2k != null)),
          s.heatup && s.heatup.rate ? t("{r} °C/h bei aktuellem Wetter · aus {n} Aufheizvorgängen · steuert, wann vorgeheizt wird", { r: fmt(s.heatup.rate, 1), n: s.heatup.episodes }) : "danach heizt die Wohnung rechtzeitig vor, bevor jemand ankommt"
        ),
        this._row("Absenkung „länger weg“", editable ? this._optStepper(scope, "setback_long", sbLong, " °C", 0.5, 8, 22, 1) : this._v(`${fmt(sbLong)} °C`), "ab 24 h oder Urlaub – Schimmelschutz hält feuchte Räume wärmer")
      ].join(""))}
      ${this._grp("Lüften & Feuchte", "mdi:water-percent", "air", [
        sib.humidity_limit ? this._row("Feuchtegrenze", this._numStepper(sib.humidity_limit, " %", 0), "ab hier: „Bitte lüften“") : this._row("Feuchtefühler", this._v("keiner", true)),
        this._row("Mindesttemperatur beim Lüften", this._numStepper(sib.min_temp, " °C", 1), "darunter: „Raum kühlt aus“"),
        this._row("Max. Abkühlung beim Lüften", this._numStepper(sib.max_drop, " °C", 1)),
        this._row("Jetzt", this._v(a.current_humidity != null ? t("{h} % · Taupunkt {d} °C", { h: fmt(a.current_humidity, 0), d: fmt(a.dew_point) }) : "–")),
        this._row("Empfohlene Lüftdauer", this._v(a.recommended_minutes ? `${a.recommended_minutes} min` : "–"), a.outdoor_temperature != null ? t("bei {v} °C draußen", { v: fmt(a.outdoor_temperature) }) : "")
      ].join(""))}
      ${this._grp("Fenster", "mdi:window-open-variant", "ok", [
        this._row("Heizung bei offenem Fenster pausieren", this._toggle(sib.window_logic)),
        this._row("Pause nach", editable ? this._optStepper(scope, "window_open_delay", wOpen, " s", 5, 0, 600) : this._v(`${wOpen ?? "–"} s`)),
        this._row("Weiter nach", editable ? this._optStepper(scope, "window_close_delay", wClose, " s", 5, 0, 600) : this._v(`${wClose ?? "–"} s`)),
        this._row(
          "Schlafen bei offenem Fenster",
          editable ? this._segs(scope, "night_airing", RK_NIGHT, nightMode) : this._v(RK_NIGHT[nightMode] || "–"),
          nightMode === "auto" ? ["bedroom", "rarely_used"].includes(roomType) ? "Automatisch: ja, weil Schlafraum" : "Automatisch: nein, kein Schlafraum" : "abends geöffnet = Nachtlüften: keine Lüft-Hinweise, Heizung wartet"
        ),
        this._row("Kontakte", `<div class="chips">${contacts}</div>`),
        this._row(
          "Offenes Fenster an Temperatursturz erkennen",
          editable ? this._segs(scope, "virtual_window", RK_NIGHT, virtMode) : this._v(RK_NIGHT[virtMode] || "–"),
          (a.window_virtual ? t("gerade: Fenster vermutlich offen · ") : "") + t(virtMode === "auto" ? s.virtual_active ? "Automatisch: aktiv (kein Kontakt erreichbar)" : "Automatisch: aus, der Kontakt meldet zuverlässig" : "fällt es in 6 min um 1 °C, pausiert die Heizung bis es wieder wärmer wird")
        )
      ].join(""))}
      ${this._presenceGroup(r, id, editable)}
      ${this._lightGroup(r, id, editable)}
      ${this._grp("Benachrichtigungen", "mdi:bell-outline", "warn", [
        this._row("Hinweise für diesen Raum", this._toggle(sib.notifications)),
        this._row("Empfänger", push.length ? `<div class="chips">${push.map((tg) => `<span class="chip2"><i></i>${esc(rkPretty(tg))}</span>`).join("")}</div>` : this._v("niemand", true), "zentral unter Allgemein → Wer bekommt was")
      ].join(""))}
      ${this._grp("Thermostat & Fühler", "mdi:radiator", "off", [
        this._row("Thermostat", this._v(esc(this._name(s.trv))), (s.extra_trvs || []).length ? "Haupt-Thermostat" : ""),
        (s.extra_trvs || []).length ? this._row("Weitere Thermostate", `<div class="chips">${s.extra_trvs.map((x) => `<span class="chip2" style="--c:${!x.available ? "var(--rk-cold)" : x.sync === "ok" ? "var(--rk-ok)" : "var(--rk-warn)"}" title="${esc(x.entity_id)}"><i></i>${esc(x.name)} · ${x.available ? `${fmt(x.temperature)}° → ${fmt(x.setpoint)}°${x.valve != null ? ` · ${fmt(x.valve, 0)} %` : ""}` : t("nicht erreichbar")}</span>`).join("")}</div>`, "bekommen dieselben Befehle, jedes mit eigener Prüfung und eigenem Korrekturwert") : "",
        this._row("Temperaturfühler", this._v(esc(this._name(a.temperature_sensor)))),
        this._row("Feuchtefühler", this._v(a.humidity_entity ? esc(this._name(a.humidity_entity)) : "keiner", !a.humidity_entity)),
        this._row("CO₂-Sensor", this._v(s.co2_sensor ? esc(this._name(s.co2_sensor)) : "keiner", !s.co2_sensor), s.co2_sensor ? "ab 1000 ppm: „Bitte lüften“" : ""),
        this._row("Kalibrierung", this._v(RK_CAL[s.calibration_mode] || "–"), offTxt),
        this._row("Einschalten mit", this._v(s.on_preset === "auto_detect" || !s.on_preset ? t("Automatisch") : t("Preset „{p}“", { p: esc(s.on_preset) }))),
        this._row("Ausschalten über", this._v(RK_OFF[s.off_method] || s.off_method || "–")),
        this._row("Drehen am Thermostat übernehmen", this._v(s.follow_trv ? t("ja") : t("nein"))),
        this._row("Übertragung", `<span class="v" style="color:${toneVar(sync[1])}">● ${sync[0]}</span>`, t("prüft nach {s} s · bis zu {n} Wiederholungen", { s: s.sync_verify_delay ?? "–", n: s.sync_max_retries ?? "–" }))
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
          <select class="sel" data-mailprov ${dis}><option value="">${t("– wählen –")}</option>${provs}<option value="other">${t("Anderer Anbieter")}</option></select></label>
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
    // ---------------------------------------------------------------- Rendern
    _render() {
      if (!this._hass || !this._rooms) return;
      if (this._renderSoon()) return;
      const rooms = this._rooms;
      if (this._tab !== "general" && !rooms.find((r) => r.id === this._tab)) this._tab = "general";
      const tabs = `<button class="tab ${this._tab === "general" ? "on" : ""}" data-tab="general"><ha-icon icon="mdi:home-cog-outline"></ha-icon>${t("Allgemein")}</button>` + rooms.map((r) => {
        const sick = (this._cfg && this._cfg.hub && this._cfg.hub.state && this._cfg.hub.state.issues || []).some((i) => i.entry_id === (r.attrs.settings || {}).entry_id && i.severity !== "info");
        return `<button class="tab ${this._tab === r.id ? "on" : ""}" data-tab="${r.id}" style="--c:${r.color}"><span class="dot"></span>${r.name}${sick ? ` <ha-icon icon="mdi:alert-circle" style="color:var(--rk-warn)"></ha-icon>` : ""}</button>`;
      }).join("");
      const room = rooms.find((r) => r.id === this._tab);
      const body = room ? this._room(room) : this._general();
      const homes = this._cfg && this._cfg.homes || [];
      const homeBar = homes.length > 1 && !this._config.home ? `<div class="tabs homes">${homes.map((h) => `<button class="tab ${h.entry_id === this._homeId() ? "on" : ""}" data-home="${h.entry_id}"><ha-icon icon="mdi:home-outline"></ha-icon>${esc(h.name)}</button>`).join("")}</div>` : "";
      rkPaint(this, `<style>${STYLES}${HISTORY_STYLES}${SETTINGS_STYLES}${ISSUE_STYLES}</style>
      <ha-card class="settings" style="--tone:${toneVar("off")}">
        <div class="hhead"><div class="htitle"><ha-icon icon="mdi:tune-variant"></ha-icon>${esc(this._config.title || t("Einstellungen"))}</div><a class="btn" href="${rkManualUrl()}" target="_blank" rel="noopener" style="--c:var(--rk-heat)" title="${t("Anleitung, Funktionen und häufige Fragen")}"><ha-icon icon="mdi:book-open-variant"></ha-icon>${t("Handbuch (PDF)")}</a>${this._admin ? "" : `<span class="chip" style="--tone:var(--rk-warn)">${t("Nur Ansicht – Ändern erfordert Admin")}</span>`}</div>
        ${homeBar}
        <div class="tabs">${tabs}</div>
        ${body}
        ${this._toast ? `<div class="toast">${esc(this._toast)}</div>` : ""}
      </ha-card>`);
      this._bind();
    }
    _bind() {
      const $ = (sel) => this.shadowRoot.querySelectorAll(sel);
      const ws = (msg) => this._hass.callWS(msg).catch((e) => this._flash(t("Fehler: {e}", { e: e.message || e })));
      $("[data-tab]").forEach((el) => el.addEventListener("click", () => {
        this._tab = el.dataset.tab;
        this._sig = null;
        this._render();
      }));
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
      $("[data-seg]").forEach((el) => el.addEventListener("click", () => apply(el.dataset.seg, { [el.dataset.key]: el.dataset.val })));
      $("[data-sel]").forEach((el) => el.addEventListener("change", () => {
        el.blur();
        apply(el.dataset.sel, { [el.dataset.key]: el.value || null });
      }));
      $("[data-md]").forEach((el) => el.addEventListener("change", () => {
        const m = /^(\d{1,2})[-.](\d{1,2})\.?$/.exec(el.value.trim());
        if (!m) {
          this._flash("Bitte als MM-TT eingeben, z. B. 10-01");
          return;
        }
        const [mm, dd] = el.value.includes(".") ? [m[2], m[1]] : [m[1], m[2]];
        this._setHub({ [el.dataset.md]: `${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}` }, 200);
      }));
      $("[data-time]").forEach((el) => el.addEventListener("change", () => el.value && this._setHub({ [el.dataset.time]: el.value + ":00" }, 200)));
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
      $("[data-newhome]").forEach((el) => el.addEventListener("click", async () => {
        const inp = this.shadowRoot.getElementById("newHome");
        const name = inp && inp.value.trim();
        if (!name) {
          this._flash("Bitte einen Namen eingeben");
          return;
        }
        try {
          const r = await this._hass.callWS({ type: "raumklima/home/create", name });
          this._flash(t("Wohnung „{n}“ angelegt", { n: name }));
          this._home = r.entry_id;
          this._tab = "general";
          this._local = {};
          setTimeout(() => this._load(), 1500);
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
      $("[data-mailprov]").forEach((el) => el.addEventListener("change", () => {
        const p = RK_MAIL_PROVIDERS[el.value];
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
        this._load();
        this._render();
      }
    }
    _colors() {
      const rooms = rkRooms(this._hass, this._config.strip_prefix || "", this._config.home);
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
      else body = this._body(d, P);
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
      const days = d.daily.slice(-n);
      const names = Object.keys(cur.rooms).sort((a, b) => a.localeCompare(b));
      const color = (nm, i) => this._roomColor(nm) || ROOM_COLORS[i % ROOM_COLORS.length];
      const maxV = Math.max(1, ...days.map((x) => Object.values(x.rooms).reduce((s, r) => s + r.valve_h, 0)));
      const maxH = Math.max(1, ...days.map((x) => x.hdd || 0));
      const today = d.daily[d.daily.length - 1].date;
      const wd = t("So,Mo,Di,Mi,Do,Fr,Sa").split(",");
      const bars = days.map((x) => {
        const tot = Object.values(x.rooms).reduce((s, r) => s + r.valve_h, 0);
        const segs = names.map((nm, i) => {
          const v = (x.rooms[nm] || {}).valve_h || 0;
          return v ? `<i style="--c:${color(nm, i)};height:${(100 * v / tot).toFixed(1)}%"></i>` : "";
        }).join("");
        const tip = `${x.date}: ${t("Ventil ≈ {v} h", { v: fmt(tot, 1) })}${x.outdoor != null ? ` · ${t("außen {v} °C", { v: fmt(x.outdoor, 1) })}` : ""}${x.hdd ? ` · ${fmt(x.hdd, 0)} ${t("HGT")}` : ""}`;
        return `<div class="day ${x.date === today ? "today" : ""}" title="${esc(tip)}"><div class="stk" style="height:${(100 * tot / maxV).toFixed(1)}%">${segs}</div>${x.hdd ? `<span class="hdd" style="bottom:${(100 * x.hdd / maxH).toFixed(1)}%"></span>` : ""}</div>`;
      }).join("");
      const labs = days.map((x, i) => {
        const dt = /* @__PURE__ */ new Date(x.date + "T12:00:00");
        const show = n <= 14 || i % 3 === 0 || x.date === today;
        return `<span>${show ? n <= 14 ? wd[dt.getDay()] : dt.getDate() + "." : ""}</span>`;
      }).join("");
      const legend = names.map((nm, i) => `<span><i style="--c:${color(nm, i)}"></i>${esc(nm)}</span>`).join("") + `<span><i class="dot" style="--c:var(--rk-air)"></i>${t("Heizgradtage (Kälte draußen)")}</span>`;
      const maxRoom = Math.max(1, ...names.map((nm) => cur.rooms[nm].valve_h));
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
          r.arrivals_warm_pct != null ? `<span>${t("<b>{v} %</b> warm bei Ankunft", { v: r.arrivals_warm_pct })}</span>` : ""
        ].join("");
        return `<div class="rrow" style="--c:${color(nm, i)}"><div class="nm"><i></i><span>${esc(nm)}</span></div>
        <div><div class="rbar" title="${t("Ventil voll offen ≈ {v} h", { v: fmt(r.valve_h, 1) })}"><i style="width:${(100 * r.valve_h / maxRoom).toFixed(1)}%;background:var(--c)"></i></div><div class="facts">${facts}</div></div></div>`;
      }).join("");
      const arrivals = T.arrivals ? t("Bei {p} % der Ankünfte war es schon warm", { p: T.arrivals_warm_pct ?? "–" }) + (cur.preheats ? " · " + t("{n}× vorgeheizt", { n: cur.preheats }) : "") : "";
      return `<div class="tiles">${tiles}</div>
      ${d.issues && d.issues.length ? `<div class="rsec"><h3><ha-icon icon="mdi:heart-pulse"></ha-icon>${t("Gesundheit")}</h3>${rkIssueList(d.issues, true, this._config.strip_prefix)}</div>` : ""}
      <div class="rsec"><h3><ha-icon icon="mdi:calendar-month-outline"></ha-icon>${t("Heizbedarf pro Tag")}</h3>
        <div class="days">${bars}</div><div class="daylab">${labs}</div><div class="lg">${legend}</div>
        <div class="hint">${t("Balken = wie lange die Ventile umgerechnet voll offen waren (Maß für die Wärmemenge). Punkte = Heizgradtage: je kälter es draußen war, desto höher. Hohe Balken an milden Tagen sind ein Hinweis auf offene Fenster oder zu hohe Wunschtemperaturen.")}</div></div>
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
          if (st) st.textContent = " · " + this._stamp.toLocaleTimeString(loc());
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
        this._rooms = rkRooms(hass, this._config.strip_prefix || "", this._config.home);
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
        <div class="tm">${d.toLocaleTimeString(loc(), { hour: "2-digit", minute: "2-digit" })}</div>
        <div class="ic" title="${meta[0]}"><ha-icon icon="${meta[1]}"></ha-icon></div>
        <div class="bd"><div class="ms">${roomName ? `<span class="rm" style="--rc:${room ? room.color : "var(--rk-off)"}">${esc(roomName)}</span>` : ""}${esc(this._strip(e.msg))}${e.n > 1 ? ` <span class="rep" title="${t("zuletzt {t}", { t: new Date(e.t_last || e.t).toLocaleTimeString(loc()) })}">×${e.n} · ${t("bis {t}", { t: new Date(e.t_last || e.t).toLocaleTimeString(loc(), { hour: "2-digit", minute: "2-digit" }) })}</span>` : ""}</div>
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
          <span class="live ${this._liveOff ? "off" : ""}" title="${t("neue Einträge kommen sofort, zusätzlich wird alle 5 s nachgesehen")}"><i></i>${this._liveOff ? t("alle 5 s") : "live"}<span class="ts">${this._stamp ? ` · ${this._stamp.toLocaleTimeString(loc())}` : ""}</span></span></div>
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
  var RaumklimaDashboardStrategy = class extends HTMLElement {
    static async generate(config, hass) {
      setLang(hass);
      const prefix = config.strip_prefix ?? "";
      const reg = Object.values(hass.entities || {});
      const rooms = reg.filter((e) => e.platform === "raumklima" && e.entity_id.startsWith("climate.")).map((e) => {
        const st = hass.states[e.entity_id];
        const sib = {};
        reg.forEach((x) => {
          if (x.device_id === e.device_id && x.platform === "raumklima" && x.translation_key) sib[x.translation_key] = x.entity_id;
        });
        const full = st && st.attributes.friendly_name || e.entity_id;
        const name = prefix ? full.replace(new RegExp("^" + escRe(prefix) + "\\s*"), "") : full;
        return { id: e.entity_id, name, attrs: st ? st.attributes : {}, sib };
      }).filter((r) => !config.home || !r.attrs.home || r.attrs.home === config.home).sort((a, b) => a.name.localeCompare(b.name));
      const H = config.home ? { home: config.home } : {};
      rooms.forEach((r, i) => {
        r.color = ROOM_COLORS[i % ROOM_COLORS.length];
      });
      const weather = config.weather || (Object.keys(hass.states).find((id) => id.startsWith("weather.")) ?? void 0);
      const roomsView = {
        title: t("Räume"),
        path: "raeume",
        icon: "mdi:home-thermometer",
        type: "sections",
        max_columns: 3,
        sections: [
          { type: "grid", column_span: 3, cards: [{ type: "custom:raumklima-overview-card", ...H, title: config.title || t("Heizung"), weather: config.weather, strip_prefix: prefix, grid_options: { columns: "full" } }] },
          ...rooms.map((r) => ({ type: "grid", cards: [{ type: "custom:raumklima-card", entity: r.id, name: r.name, grid_options: { columns: "full" } }] }))
        ]
      };
      const hist = (mode) => ({ type: "custom:raumklima-history-card", ...H, mode, hours: 24, strip_prefix: prefix, grid_options: { columns: "full" } });
      const historyView = {
        title: t("Verlauf"),
        path: "verlauf",
        icon: "mdi:chart-line",
        type: "sections",
        max_columns: 2,
        sections: [
          ...weather ? [{ type: "grid", column_span: 2, cards: [{ type: "weather-forecast", entity: weather, forecast_type: "hourly", show_current: true, show_forecast: true, grid_options: { columns: "full" } }] }] : [],
          { type: "grid", column_span: 2, cards: [hist("temperature")] },
          { type: "grid", column_span: 2, cards: [hist("humidity")] },
          { type: "grid", column_span: 2, cards: [hist("timeline")] }
        ]
      };
      const settingsView = {
        title: t("Einstellungen"),
        path: "einstellungen",
        icon: "mdi:tune-variant",
        type: "panel",
        cards: [{ type: "custom:raumklima-settings-card", ...H, strip_prefix: prefix }]
      };
      const reportView = {
        title: t("Bericht"),
        path: "bericht",
        icon: "mdi:chart-box-outline",
        type: "sections",
        max_columns: 2,
        sections: [{ type: "grid", column_span: 2, cards: [{ type: "custom:raumklima-report-card", ...H, strip_prefix: prefix, grid_options: { columns: "full" } }] }]
      };
      const logView = {
        title: t("Protokoll"),
        path: "protokoll",
        icon: "mdi:text-box-search-outline",
        type: "sections",
        max_columns: 2,
        sections: [{ type: "grid", column_span: 2, cards: [{ type: "custom:raumklima-log-card", ...H, strip_prefix: prefix, grid_options: { columns: "full" } }] }]
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
