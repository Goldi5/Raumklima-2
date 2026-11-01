/* Raumklima 0.8.6 – gebaut aus frontend/src (npm run build). Nicht von Hand bearbeiten. */
(() => {
  // src/i18n/en.js
  var EN = {
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
    "↓ {v}° · Wunsch {w}°": "↓ {v}° · desired {w}°"
  };

  // src/i18n.js
  var lang = "de";
  var locale = "de-DE";
  function setLang(hass) {
    const l = String(hass && (hass.locale && hass.locale.language || hass.language) || "de");
    lang = l.toLowerCase().startsWith("de") ? "de" : "en";
    locale = lang === "de" ? "de-DE" : l;
  }
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
  var RK_VERSION = "0.8.6";

  // src/shared.js
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
    report: ["📊", "Wochenbericht"]
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
        this.shadowRoot.innerHTML = `<style>${STYLES}</style><ha-card><div class="err">${t("Entität {e} nicht gefunden", { e: this._config.entity })}</div></ha-card>`;
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
      this._recMin = a.recommended_minutes || 5;
      let banner = "";
      if (vent && a.ventilation !== "ok") {
        const showBar = winOpen && this._openSince && ["airing", "please_close", "done"].includes(a.ventilation);
        const extra = a.ventilation === "please_open" ? `<span>${t("{h} % · ca. {m} min", { h: fmt(a.current_humidity, 0), m: this._recMin })}</span>` : showBar ? `<span class="count" data-count>–</span>` : "";
        banner = `<div class="banner" style="--vt:${toneVar(vent.tone)}">
          <ha-icon icon="${vent.icon}"></ha-icon><span class="grow">${vent.label}${showBar ? ` · ${this._recMin} min` : ""}</span>${extra}
        </div>${showBar ? `<div class="bar" style="--vt:${toneVar(vent.tone)}"><i data-bar style="width:0%"></i></div>` : ""}`;
      }
      const stat = (icon, label, value, tone, entity) => `<div class="stat" ${entity ? `data-more="${entity}" style="cursor:pointer"` : ""}><div class="l"><ha-icon icon="${icon}"></ha-icon>${label}</div>
        <div class="v ${tone ? "tone" : ""}" style="${tone ? `--st:${toneVar(tone)}` : ""}">${value}</div></div>`;
      const stats = [
        a.humidity_sensor ? stat("mdi:water-percent", t("Feuchte"), `${fmt(a.current_humidity, 0)} %`, humTone(a.current_humidity), sib.ventilation) : "",
        a.dew_point !== void 0 && a.dew_point !== null ? stat("mdi:water-thermometer", t("Taupunkt"), `${fmt(a.dew_point)}°`, null, sib.dew_point) : "",
        stat("mdi:valve", t("Ventil"), a.valve_position === null || a.valve_position === void 0 ? "–" : `${fmt(a.valve_position, 0)} %`, a.valve_position > 0 ? "heat" : null),
        a.outdoor_temperature !== void 0 && a.outdoor_temperature !== null ? stat("mdi:weather-partly-cloudy", t("Außen"), `${fmt(a.outdoor_temperature)}°<small>${fmt(a.outdoor_humidity, 0)} %</small>`, null) : "",
        stat("mdi:radiator", t("Heizkörper"), `${fmt(a.trv_temperature)}°`, null),
        a.offset !== void 0 && a.offset !== null ? stat("mdi:tune-variant", t("Offset"), `${a.offset > 0 ? "+" : ""}${fmt(a.offset)}°`, null, sib.offset) : ""
      ].join("");
      const syncCls = a.sync === "ok" ? "" : a.sync;
      const syncLabel = { ok: t("synchron"), pending: t("sendet …"), failed: t("keine Antwort") }[a.sync] || a.sync;
      const notif = sib.notifications ? this._hass.states[sib.notifications] : null;
      const wlogic = sib.window_logic ? this._hass.states[sib.window_logic] : null;
      this.shadowRoot.innerHTML = `<style>${STYLES}</style>
      <ha-card style="--tone:${toneVar(status.tone)}">
        <div class="top">
          <div class="name" data-more="${this._config.entity}">${name}</div>
          ${a.window_open !== void 0 ? `<div class="wins"><ha-icon class="${winOpen ? "open" : ""}" icon="${winOpen ? "mdi:window-open-variant" : "mdi:window-closed-variant"}"></ha-icon></div>` : ""}
          <span class="chip"><ha-icon icon="${status.icon}"></ha-icon>${status.label}</span>
        </div>
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
      this._render();
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
          ${a.window_open ? `<ha-icon class="win" icon="mdi:window-open-variant"></ha-icon>` : ""}</div>
        <div class="rn">${name}</div>
        <div class="rs">${label}</div>
        <div class="rbottom">
          <div class="rt">${fmt(a.current_temperature)}°</div>
          <div class="rmeta">${off ? t("aus") : a.plan_reason === "season" ? t("Pause") : a.effective_target != null && a.effective_target < a.temperature ? t("↓ {v}° · Wunsch {w}°", { v: fmt(a.effective_target), w: fmt(a.temperature) }) : t("Ziel {v}°", { v: fmt(a.temperature) })}${a.humidity_sensor ? `<b style="--st:${toneVar(humTone(a.current_humidity))}">${fmt(a.current_humidity, 0)} %</b>` : ""}</div>
        </div>
      </div>`;
      };
      this.shadowRoot.innerHTML = `<style>${STYLES}
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
      if (!ids.length) {
        this._data = {};
        this._draw();
        return;
      }
      const end = /* @__PURE__ */ new Date();
      const start = new Date(end.getTime() - this._hours * 3600 * 1e3);
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
        this._range = [start.getTime(), end.getTime()];
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
        this.shadowRoot.innerHTML = this._shell(`<div class="legend">${legend}</div><div class="chart"><div class="empty">${t("Lade Verlauf …")}</div></div>`);
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
      this.shadowRoot.innerHTML = this._shell(`<div class="legend">${legend}</div><div class="chart" style="--h:${H}px">${body}</div>`);
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
        this.shadowRoot.innerHTML = this._shell(`<div class="empty">${t("Lade Verlauf …")}</div>`);
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
      this.shadowRoot.innerHTML = this._shell(`<div class="tl">${rows}</div><div class="tlx">${xl}</div><div class="tleg">${leg}</div>`);
      this._bind();
    }
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
      this._render();
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
      return `<div class="row"><div class="l">${t(label)}${sub ? `<small>${t(sub)}</small>` : ""}</div>${value}</div>`;
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
        this._row("Urlaub", this._toggle(hubIds.vacation), "endet automatisch bei Ankunft"),
        this._row("Gäste da", this._toggle(hubIds.guests), "nicht absenken, auch wenn alle Bewohner weg sind")
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
        `<div class="hint">${t("Der Schimmelschutz rechnet bei längerer Abwesenheit mit der kältesten Wandstelle (Temperaturfaktor {f} nach DIN 4108-2). Ist die Raumluft feucht, wird weniger abgesenkt – warme Luft nimmt mehr Feuchte auf und die Wand bleibt unter 80 % Feuchte.", { f: frsi })}</div>`
      ].join("");
      const push = this._hubOpt("recipients") || {};
      const tts = this._hubOpt("tts") || {};
      const palette = ["#4f9dff", "#ff7a45", "#2ec4a6", "#a78bfa", "#ffb020"];
      const kinds = this._cfg.kinds || Object.keys(RK_KINDS);
      const card = (target, list, channel, i) => {
        const chips = kinds.map((k) => `<button class="chip2 ${list.includes(k) ? "" : "off"}" data-kind="${k}" data-target="${esc(target)}" data-ch="${channel}" title="${RK_KINDS[k][1]}" ${this._admin ? "" : "disabled"}>${RK_KINDS[k][0]} ${RK_KINDS[k][1]}</button>`).join("");
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
        this._row("Fehler auch in der HA-Glocke", this._optToggle(H, "notify_on_failure", !!this._hubOpt("notify_on_failure")))
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
      ${this._grp("Benachrichtigungen", "mdi:bell-outline", "warn", [
        this._row("Hinweise für diesen Raum", this._toggle(sib.notifications)),
        this._row("Empfänger", push.length ? `<div class="chips">${push.map((tg) => `<span class="chip2"><i></i>${esc(rkPretty(tg))}</span>`).join("")}</div>` : this._v("niemand", true), "zentral unter Allgemein → Wer bekommt was")
      ].join(""))}
      ${this._grp("Thermostat & Fühler", "mdi:radiator", "off", [
        this._row("Thermostat", this._v(esc(this._name(s.trv)))),
        this._row("Temperaturfühler", this._v(esc(this._name(a.temperature_sensor)))),
        this._row("Feuchtefühler", this._v(a.humidity_entity ? esc(this._name(a.humidity_entity)) : "keiner", !a.humidity_entity)),
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
    // ---------------------------------------------------------------- Rendern
    _render() {
      if (!this._hass || !this._rooms) return;
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
      const scrollY = this.shadowRoot.host ? window.scrollY : 0;
      this.shadowRoot.innerHTML = `<style>${STYLES}${HISTORY_STYLES}${SETTINGS_STYLES}${ISSUE_STYLES}</style>
      <ha-card class="settings" style="--tone:${toneVar("off")}">
        <div class="hhead"><div class="htitle"><ha-icon icon="mdi:tune-variant"></ha-icon>${esc(this._config.title || t("Einstellungen"))}</div>${this._admin ? "" : `<span class="chip" style="--tone:var(--rk-warn)">${t("Nur Ansicht – Ändern erfordert Admin")}</span>`}</div>
        ${homeBar}
        <div class="tabs">${tabs}</div>
        ${body}
        ${this._toast ? `<div class="toast">${esc(this._toast)}</div>` : ""}
      </ha-card>`;
      if (scrollY) window.scrollTo(0, scrollY);
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
      $("[data-sel]").forEach((el) => el.addEventListener("change", () => apply(el.dataset.sel, { [el.dataset.key]: el.value || null })));
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
      this.shadowRoot.innerHTML = `<style>${STYLES}${HISTORY_STYLES}${SETTINGS_STYLES}${ISSUE_STYLES}${REPORT_STYLES}</style>
      <ha-card class="report" style="--tone:${toneVar("off")}">
        <div class="hhead"><div class="htitle"><ha-icon icon="mdi:chart-box-outline"></ha-icon><div>${esc(this._config.title || t("Heizbericht"))}${since ? `<div class="rsub">${t("Daten seit {d}", { d: since })}</div>` : ""}</div></div>
          <div class="segs"><button class="${P === "week" ? "on" : ""}" data-p="week">${t("Diese Woche")}</button><button class="${P === "month" ? "on" : ""}" data-p="month">${t("Dieser Monat")}</button></div></div>
        ${body}
      </ha-card>`;
      this.shadowRoot.querySelectorAll("[data-p]").forEach((b) => b.addEventListener("click", () => {
        this._period = b.dataset.p;
        this._render();
      }));
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
      this.shadowRoot.innerHTML = `<style>${STYLES}${HISTORY_STYLES}${SETTINGS_STYLES}${REPORT_STYLES}${LOG_STYLES}</style>
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
