// Erklärungen hinter dem „?“ in der Einstellungskarte. Schlüssel = deutsche Beschriftung der Zeile.
// [Deutsch, Englisch] – kurz, verständlich, ohne Fachchinesisch.
export const HELP = {
  // ---------------------------------------------------------------- Anwesenheit
  "Wer wohnt hier?": [
    "Die Personen, deren Handys zählen. Ist keine davon in der Wohnungs-Zone, gilt die Wohnung nach der Wartezeit als leer und Raumklima senkt ab. Personen legst du in Home Assistant unter Einstellungen → Personen an und verknüpfst dort das Handy (Home-Assistant-App).",
    "The people whose phones count. If none of them is in the home zone, the home counts as empty after the waiting time and Raumklima lowers the temperature. People are created in Home Assistant under Settings → People, where you also link their phone (Home Assistant app).",
  ],
  "Wohnung (Zone)": [
    "Der Bereich auf der Karte, der als „zu Hause“ gilt. Meist „Home“; bei mehreren Wohnungen je Wohnung eine eigene Zone (Einstellungen → Bereiche & Zonen).",
    "The area on the map that counts as “home”. Usually “Home”; with several homes, one zone per home (Settings → Areas & zones).",
  ],
  "Absenken nach": [
    "So lange muss die Wohnung leer sein, bevor abgesenkt wird – damit kurz Brötchen holen nichts auslöst. 30 Minuten sind ein guter Wert.",
    "How long the home must be empty before lowering – so that popping out for bread doesn't trigger anything. 30 minutes is a good value.",
  ],
  "„Länger weg“ ab": [
    "Nach so vielen Stunden ohne jemanden wird von „kurz weg“ auf „länger weg“ umgeschaltet – dann wird tiefer abgesenkt (z. B. über Nacht weg oder auf Reisen).",
    "After this many hours without anyone home, “briefly away” switches to “away longer” and the temperature is lowered further (e.g. away overnight or travelling).",
  ],
  "Vorheizen ab": [
    "Kommt jemand näher als diese Entfernung, wird schon vorgeheizt, damit es bei der Ankunft warm ist. Zusätzlich heizt Raumklima nach der gelernten Aufheizzeit vor. 0 schaltet das Vorheizen nach Entfernung aus.",
    "When someone gets closer than this distance, heating starts early so it is warm on arrival. Raumklima also preheats based on the learned heat-up time. 0 turns distance-based preheating off.",
  ],
  "Präsenzmelder zählen": [
    "Sieht ein Präsenzmelder in einem Raum jemanden, gilt die Wohnung als bewohnt – auch wenn alle Handys weg sind (Besuch, Kinder ohne Handy). „Nur mmWave“ ist der sichere Standard, weil Bewegungsmelder (PIR) auch auf Haustiere reagieren. Im Urlaub zählen Melder nie.",
    "If a presence sensor sees someone in a room, the home counts as occupied – even when all phones are away (visitors, children without a phone). “mmWave only” is the safe default because motion sensors (PIR) also react to pets. During vacation sensors never count.",
  ],
  Urlaub: [
    "Senkt sofort tief ab („länger weg“), egal wo die Handys sind. Endet automatisch, sobald jemand nach Hause kommt.",
    "Lowers the temperature right away (“away longer”), no matter where the phones are. Ends automatically as soon as someone comes home.",
  ],
  "Gäste da": [
    "Solange an, wird nicht abgesenkt – auch wenn alle Bewohner weg sind. Praktisch, wenn Besuch ohne Handy in Home Assistant da ist.",
    "While on, nothing is lowered – even if all residents are away. Handy when visitors without a phone in Home Assistant are staying.",
  ],
  Kalender: [
    "Ein Kalender aus Home Assistant. Läuft gerade ein Termin mit einem der Urlaubs-Wörter im Titel, wirkt er wie der Urlaubsschalter; mit einem der Zuhause-Wörter wie „Gäste da“.",
    "A calendar from Home Assistant. If an event with one of the vacation words in its title is running, it acts like the vacation switch; with one of the at-home words like “guests”.",
  ],
  "… wie Urlaub": [
    "Wörter im Termintitel, die „verreist“ bedeuten, durch Komma getrennt. Groß-/Kleinschreibung egal.",
    "Words in the event title that mean “travelling”, separated by commas. Case doesn't matter.",
  ],
  "… jemand bleibt zu Hause": [
    "Wörter im Termintitel, bei denen nicht abgesenkt werden soll, z. B. Homeoffice – auch wenn das Handy kurz woanders ist.",
    "Words in the event title for which nothing should be lowered, e.g. home office – even if the phone is briefly elsewhere.",
  ],
  // ---------------------------------------------------------------- Heizsaison
  Betriebsart: [
    "Automatisch: geheizt wird nur, wenn es draußen kalt genug ist (Heizgrenze, Heizsaison, Kälteeinbruch). Immer heizen: ganzjährig. Heizpause: nie – außer ein Raum fällt unter die Sicherung.",
    "Automatic: heating only when it is cold enough outside (heating limit, season, cold snap). Always heat: all year. Heating pause: never – unless a room drops below the safety minimum.",
  ],
  Heizgrenze: [
    "Liegt das Tagesmittel draußen (gemessen + Vorhersage) über diesem Wert, braucht das Haus keine Heizung – Raumklima macht Pause. 15 °C passt für die meisten Häuser; gut gedämmt eher 12–14 °C.",
    "If the daily mean outside (measured + forecast) is above this value, the building needs no heating and Raumklima pauses. 15 °C suits most homes; well insulated rather 12–14 °C.",
  ],
  Heizsaison: [
    "Der Zeitraum, in dem normalerweise geheizt wird (Monat-Tag). Außerhalb wird nur bei einem Kälteeinbruch geheizt. Am Tag nach dem Ende kommt auch der Saisonbericht.",
    "The period in which you normally heat (month-day). Outside of it, heating only runs during a cold snap. The day after it ends, the season report is created.",
  ],
  "Kälteeinbruch unter": [
    "Ist es außerhalb der Heizsaison 3 Tage lang kälter als dieser Wert, wird trotzdem geheizt – z. B. bei einem kalten Mai.",
    "If it is colder than this for 3 days outside the heating season, heating runs anyway – e.g. in a cold May.",
  ],
  Sicherung: [
    "Fällt ein Raum während der Heizpause unter diese Temperatur, heizt er trotzdem – Schutz vor Auskühlen und Schimmel.",
    "If a room drops below this temperature during the heating pause, it heats anyway – protection against cooling down and mould.",
  ],
  "Frostnacht: weniger absenken": [
    "Sagt die Vorhersage −5 °C oder kälter, wird bei Abwesenheit nur halb so tief abgesenkt. So kühlen die Wände nicht zu stark aus und der Raum ist schneller wieder warm.",
    "If the forecast says −5 °C or colder, setback during absence is only half as deep. Walls don't cool down too much and the room warms up faster.",
  ],
  "Sommerpflege Ventile": [
    "Im Sommer öffnet Raumklima mittwochs um 11 Uhr die Ventile kurz ganz, damit sie nicht festsitzen.",
    "In summer Raumklima briefly opens the valves fully on Wednesdays at 11:00 so they don't get stuck.",
  ],
  "Heute heizen": [
    "Für milde, aber kühle Tage: heizt 24 Stunden lang, auch wenn die Heizgrenze eigentlich eine Pause vorsieht.",
    "For mild but chilly days: heats for 24 hours even though the heating limit would normally pause.",
  ],
  // ---------------------------------------------------------------- Schlafen
  "Zeiten lernen": [
    "Raumklima merkt sich, wann ihr ins Bett geht und aufsteht (Nachtlüften, Licht aus/an) und passt Ruhezeit und Nachtlüften daran an – verlängert sie nur, verkürzt sie nie.",
    "Raumklima learns when you go to bed and get up (night airing, lights off/on) and adjusts quiet hours and night airing – it only extends them, never shortens.",
  ],
  Feiertage: [
    "Dein Bundesland: Die Nacht vor einem Feiertag gilt dann wie Wochenende (längere Ruhezeit am Morgen).",
    "Your German state: the night before a public holiday then counts like a weekend (longer quiet hours in the morning).",
  ],
  "Schlaf-Signale": [
    "Lampen oder Schalter, an denen Raumklima den Schlaf erkennt: abends alle aus = ins Bett, morgens eins an = aufgestanden.",
    "Lights or switches Raumklima uses to detect sleep: all off in the evening = bedtime, one on in the morning = up.",
  ],
  // ---------------------------------------------------------------- Wohnung
  "Name der Wohnung": [
    "Erscheint im Umschalter oben im Dashboard und in Nachrichten – wichtig, wenn du mehrere Wohnungen hast.",
    "Shown in the switcher at the top of the dashboard and in messages – important if you have several homes.",
  ],
  Dashboard: [
    "Pfad des Raumklima-Dashboards dieser Wohnung. Antippen einer Live-Aktivität oder eines Berichts öffnet diese Seite.",
    "Path of this home's Raumklima dashboard. Tapping a live activity or a report opens this page.",
  ],
  Bauart: [
    "Wie gut die Außenwände dämmen. Daraus berechnet der Schimmelschutz, wie kalt die kälteste Wandstelle wird – bei einem unsanierten Altbau wird deshalb weniger abgesenkt.",
    "How well the outer walls insulate. Mould protection uses this to calculate how cold the coldest spot on the wall gets – an unrenovated old building is lowered less.",
  ],
  "Heizkosten pro Jahr": [
    "Optional: deine Heizkosten pro Jahr laut Abrechnung. Nur für den PDF-Bericht – er rechnet die Ersparnis grob in Euro um und zeigt, was 1 °C weniger im Jahr bringt. Leer lassen = keine Euro-Angaben.",
    "Optional: your yearly heating costs from your bill. Only for the PDF report – it roughly converts savings into euros and shows what 1 °C less saves per year. Leave empty = no euro figures.",
  ],
  // ---------------------------------------------------------------- Benachrichtigungen
  Ruhezeit: [
    "In dieser Zeit kommen Nachrichten leise an und es gibt keine Sprachansagen. Nur Dringendes ist laut: Raum kühlt aus, Fenster offen während niemand da ist, Thermostat reagiert nicht.",
    "During this time messages arrive silently and there are no voice announcements. Only urgent ones are loud: room cooling down, window open while nobody is home, thermostat not responding.",
  ],
  "Wochenende bis": [
    "Am Wochenende endet die Ruhezeit erst zu dieser Uhrzeit – zum Ausschlafen.",
    "On weekends quiet hours end only at this time – for sleeping in.",
  ],
  Nachtlüften: [
    "Wird ein Schlafzimmerfenster in diesem Zeitfenster geöffnet, gilt es als „Schlafen bei offenem Fenster“: keine Lüft-Hinweise, die Heizung wartet bis zum Schließen, morgens ein Gruß.",
    "If a bedroom window is opened in this time window, it counts as “sleeping with the window open”: no airing notices, heating waits until it is closed, a good-morning message.",
  ],
  "… leise warnen unter": [
    "Wird es beim Schlafen mit offenem Fenster kälter als dieser Wert, kommt einmal pro Nacht eine leise Warnung.",
    "If it gets colder than this while sleeping with the window open, a quiet warning is sent once per night.",
  ],
  "Erinnern alle": [
    "Besteht ein Problem weiter (z. B. Fenster offen, Raum kühlt aus), erinnert Raumklima in diesem Abstand – höchstens einige Male.",
    "If a problem persists (e.g. window open, room cooling down), Raumklima reminds you at this interval – only a few times.",
  ],
  Wetterquelle: [
    "Woher die Außentemperatur und die Vorhersage kommen. Am besten ein Wetterdienst mit Vorhersage, z. B. weather.forecast_home – nötig für Heizgrenze, Lüftdauer, Sonnenseite und Frostnacht.",
    "Where the outdoor temperature and forecast come from. Ideally a weather service with a forecast, e.g. weather.forecast_home – needed for heating limit, airing time, sunny side and frost nights.",
  ],
  "Fehler auch in der HA-Glocke": [
    "Reagiert ein Thermostat nicht, erscheint zusätzlich eine Meldung in der Glocke von Home Assistant.",
    "If a thermostat doesn't respond, an additional notification appears in Home Assistant's bell.",
  ],
  "PDF-Berichte": [
    "Welche Berichte automatisch als PDF entstehen: Woche (sonntags 18 Uhr), Monat (am 1.), Heizsaison (nach dem Saisonende). Sie kommen als Push an alle mit „Wochenbericht“ und stehen im Reiter Bericht zum Herunterladen.",
    "Which reports are created automatically as PDF: week (Sundays 18:00), month (on the 1st), heating season (after it ends). They are pushed to everyone with “weekly report” and listed in the Report tab for download.",
  ],
  "PDF per E-Mail an": [
    "Wohin der PDF-Bericht als Anhang geht. Am einfachsten direkt darunter „E-Mail einrichten“ antippen – Anbieter wählen (füllt Server und Port aus), Benutzer, Passwort und Empfänger eintragen, „Speichern & Test-Mail senden“. Bei Gmail, iCloud und Outlook braucht es ein App-Passwort. Hast du schon einen Mail-Dienst in Home Assistant, kannst du auch den wählen.",
    "Where the PDF report is sent as an attachment. Easiest: tap “Set up email” right below – pick your provider (fills in server and port), enter user, password and recipients, then “Save & send test email”. Gmail, iCloud and Outlook need an app password. If you already have a mail service in Home Assistant, you can choose that instead.",
  ],
  Test: ["Erstellt jetzt einen Wochenbericht und schickt ihn an alle Empfänger und per E-Mail.", "Creates a weekly report now and sends it to all recipients and by email."],
  // ---------------------------------------------------------------- Raum: Temperatur
  Wunschtemperatur: [
    "So warm soll der Raum sein, wenn jemand da ist. Gemessen wird mit dem Raumfühler, nicht am Heizkörper. Jedes Grad weniger spart etwa 6 % Heizenergie.",
    "How warm the room should be when someone is home. Measured with the room sensor, not at the radiator. Each degree less saves about 6 % heating energy.",
  ],
  Raumtyp: [
    "Setzt passende Standardwerte für Wunschtemperatur, Feuchtegrenze, Mindesttemperatur und Absenkung (Bad wärmer und feuchter, Schlafzimmer kühler). Beim Wechsel startet der Raum kurz neu.",
    "Sets suitable defaults for desired temperature, humidity limit, minimum temperature and setback (bathroom warmer and more humid, bedroom cooler). Changing it restarts the room briefly.",
  ],
  Wohnung: [
    "Zu welcher Wohnung der Raum gehört – bestimmt Bewohner, Zone, Empfänger und Bericht.",
    "Which home the room belongs to – determines residents, zone, recipients and report.",
  ],
  Sonnenseite: [
    "Für Räume mit großen Süd- oder Westfenstern: Ist Sonne vorhergesagt und der Raum schon fast warm, heizt er 1 °C weniger – die Sonne erledigt den Rest.",
    "For rooms with large south or west windows: if sun is forecast and the room is almost warm, it heats 1 °C less – the sun does the rest.",
  ],
  "Absenkung „kurz weg“": [
    "Zieltemperatur, wenn alle kurz weg sind. Nie tiefer, als der Schimmelschutz erlaubt.",
    "Target temperature when everyone is briefly away. Never lower than mould protection allows.",
  ],
  "Absenkung „länger weg“": [
    "Zieltemperatur bei längerer Abwesenheit oder Urlaub. Feuchte Räume bleiben automatisch wärmer (Schimmelschutz).",
    "Target temperature during longer absence or vacation. Humid rooms automatically stay warmer (mould protection).",
  ],
  Aufheizen: [
    "Wie lange der Raum braucht, um 2 °C wärmer zu werden – Raumklima lernt das aus jedem Aufheizen und heizt danach rechtzeitig vor, bevor jemand ankommt.",
    "How long the room needs to get 2 °C warmer – Raumklima learns this from every heat-up and then preheats in time before someone arrives.",
  ],
  // ---------------------------------------------------------------- Raum: Lüften
  Feuchtegrenze: [
    "Ab dieser Luftfeuchte (15 Minuten lang) kommt „Bitte lüften“ – aber nur, wenn Lüften auch trocknet, die Luft draußen also trockener ist. Ändern über Geräte & Technik.",
    "From this humidity (for 15 minutes) you get “please air the room” – but only if airing actually dries, i.e. the outside air is drier. Change it under devices & technical settings.",
  ],
  Feuchtefühler: [
    "Sensor für die Luftfeuchte im Raum – nötig für Lüft-Hinweise und Schimmelschutz.",
    "Sensor for the room's humidity – needed for airing notices and mould protection.",
  ],
  "Mindesttemperatur beim Lüften": [
    "Fällt der Raum beim Lüften darunter, kommt „Raum kühlt aus – bitte schließen“.",
    "If the room drops below this while airing, you get “room cooling down – please close”.",
  ],
  "Max. Abkühlung beim Lüften": [
    "Kühlt der Raum beim Lüften um mehr als diesen Wert ab, kommt ebenfalls „bitte schließen“ – so kühlen die Wände nicht aus.",
    "If the room cools down by more than this while airing, you also get “please close” – so the walls don't cool down.",
  ],
  Jetzt: ["Aktuelle Feuchte und Taupunkt im Raum.", "Current humidity and dew point in the room."],
  "Empfohlene Lüftdauer": [
    "Wie lange stoßlüften reicht – je kälter es draußen ist, desto kürzer (im Winter oft nur 5 Minuten).",
    "How long airing wide open is enough – the colder it is outside, the shorter (often only 5 minutes in winter).",
  ],
  // ---------------------------------------------------------------- Raum: Fenster
  "Heizung bei offenem Fenster pausieren": [
    "Ist ein Fenster offen, stoppt die Heizung; danach geht es mit der vorherigen Einstellung weiter. Schalte die eingebaute Fenstererkennung des Thermostats aus, damit sich beides nicht stört.",
    "When a window is open, heating stops; afterwards it continues with the previous setting. Turn off the thermostat's built-in window detection so the two don't interfere.",
  ],
  "Pause nach": [
    "So lange muss das Fenster offen sein, bevor die Heizung pausiert – kurzes Öffnen löst nichts aus.",
    "How long the window must be open before heating pauses – briefly opening it doesn't trigger anything.",
  ],
  "Weiter nach": [
    "So lange muss das Fenster zu sein, bevor wieder geheizt wird.",
    "How long the window must be closed before heating resumes.",
  ],
  "Schlafen bei offenem Fenster": [
    "Wird abends im Schlafzimmer gelüftet, gilt das als Nachtlüften: keine Lüft-Hinweise, die Heizung wartet, morgens ein Gruß. Automatisch = ja für Schlafzimmer und selten genutzte Räume.",
    "If the bedroom window is opened in the evening, it counts as night airing: no airing notices, heating waits, a good-morning message. Automatic = yes for bedrooms and rarely used rooms.",
  ],
  Kontakte: ["Die Fensterkontakte dieses Raums und ihr Zustand. Ändern über Geräte & Technik.", "This room's window contacts and their state. Change them under devices & technical settings."],
  "Offenes Fenster an Temperatursturz erkennen": [
    "Ohne (funktionierenden) Fensterkontakt: Fällt die Temperatur in 6 Minuten um 1 °C, nimmt Raumklima ein offenes Fenster an und pausiert. Automatisch = nur, wenn kein Kontakt zuverlässig meldet.",
    "Without a (working) window contact: if the temperature drops 1 °C in 6 minutes, Raumklima assumes an open window and pauses. Automatic = only if no contact reports reliably.",
  ],
  // ---------------------------------------------------------------- Raum: Präsenz
  Melder: [
    "Präsenz- oder Bewegungsmelder in diesem Raum. mmWave (Radar) sieht auch Stillsitzende – sehr zuverlässig. PIR sieht nur Bewegung; Raumklima wartet deshalb länger, bevor der Raum als leer gilt.",
    "Presence or motion sensors in this room. mmWave (radar) also sees people sitting still – very reliable. PIR only sees movement, so Raumklima waits longer before the room counts as empty.",
  ],
  Art: [
    "Automatisch: Geräteklasse „Bewegung“ = PIR, „Anwesenheit/Belegung“ = mmWave. Stimmt das bei deinem Melder nicht, hier fest einstellen.",
    "Automatic: device class “motion” = PIR, “presence/occupancy” = mmWave. If that's wrong for your sensor, set it here.",
  ],
  "Leeren Raum absenken": [
    "Ist niemand im Raum, wird er etwas kühler – kommt jemand herein, sofort wieder warm. Automatisch = nur Wohnraum, Küche und selten genutzte Räume und nur mit mmWave. Schlafzimmer und Bad bleiben warm, außer du stellst „Ja“ ein.",
    "If nobody is in the room it gets a little cooler – when someone comes in, it warms up right away. Automatic = only living room, kitchen and rarely used rooms and only with mmWave. Bedrooms and bathrooms stay warm unless you set “yes”.",
  ],
  "… wenn leer seit": [
    "So lange muss der Raum leer sein, bevor abgesenkt wird. Heizkörper reagieren träge – zu kurz spart kaum etwas.",
    "How long the room must be empty before lowering. Radiators are slow – too short saves hardly anything.",
  ],
  "… um": [
    "So viel kühler wird der leere Raum – nie unter „kurz weg“ und den Schimmelschutz.",
    "How much cooler the empty room gets – never below “briefly away” and mould protection.",
  ],
  // ---------------------------------------------------------------- Raum: Lichtsignal
  Lampen: [
    "Lampen, die bei Hinweisen dreimal farbig blinken und danach wieder so sind wie vorher. Nicht in der Ruhezeit, beim Nachtlüften, wenn niemand da ist oder der Raum leer ist.",
    "Lights that blink three times in colour on notices and then return to how they were. Not during quiet hours, night airing, when nobody is home or the room is empty.",
  ],
  "Blinken bei": [
    "Bei welchen Hinweisen geblinkt wird: blau = bitte lüften, orange = bitte schließen/kühlt aus, grün = Luft ausgetauscht, rot = Problem mit der Heizung.",
    "Which notices make the lights blink: blue = please air, orange = please close/cooling down, green = air exchanged, red = heating problem.",
  ],
  Ausprobieren: ["Lässt die Lampen jetzt einmal blau blinken.", "Makes the lights blink blue once now."],
  // ---------------------------------------------------------------- Raum: Benachrichtigungen & Technik
  "Hinweise für diesen Raum": [
    "Aus = dieser Raum schickt keine Lüft-Hinweise und keinen Lüft-Countdown. Geregelt wird trotzdem.",
    "Off = this room sends no airing notices and no airing countdown. It is still controlled.",
  ],
  Empfänger: ["Wer Nachrichten bekommt, stellst du zentral unter Allgemein → Wer bekommt was ein.", "Who gets messages is set centrally under General → Who gets what."],
  Thermostat: ["Das Thermostat am Heizkörper. Ändern über Geräte & Technik.", "The radiator thermostat. Change it under devices & technical settings."],
  Temperaturfühler: [
    "Der Fühler, nach dem geregelt wird – am besten in Raummitte, nicht am Heizkörper oder in der Sonne.",
    "The sensor used for control – ideally in the middle of the room, not at the radiator or in the sun.",
  ],
  "CO₂-Sensor": [
    "Optional: ab 1000 ppm kommt „Bitte lüften“, „Luft ausgetauscht“ erst unter 800 ppm.",
    "Optional: from 1000 ppm you get “please air the room”, “air exchanged” only below 800 ppm.",
  ],
  Kalibrierung: [
    "Wie das Thermostat dazu gebracht wird, die Raumtemperatur zu „sehen“: Offset (Korrekturwert am Thermostat), Sollwert-Ausgleich (Ziel am Thermostat anpassen) oder keine.",
    "How the thermostat is made to “see” the room temperature: offset (correction value on the thermostat), setpoint compensation (adjust the thermostat target) or none.",
  ],
  "Einschalten mit": [
    "Mit welcher Betriebsart das Thermostat heizt. Automatisch meidet Modi, bei denen manche Thermostate das Ventil einfach ganz öffnen.",
    "Which mode the thermostat heats with. Automatic avoids modes in which some thermostats simply open the valve fully.",
  ],
  "Ausschalten über": [
    "Wie „aus“ ans Thermostat geht: Preset „aus“, HVAC „aus“ oder Minimaltemperatur – je nachdem, was dein Gerät zuverlässig kann.",
    "How “off” is sent to the thermostat: preset “off”, HVAC “off” or minimum temperature – whatever your device handles reliably.",
  ],
  "Drehen am Thermostat übernehmen": [
    "Ja: Drehst du am Thermostat, wird das die neue Wunschtemperatur. Nein: Raumklima stellt den Wert zurück.",
    "Yes: turning the thermostat sets the new desired temperature. No: Raumklima resets the value.",
  ],
  Übertragung: [
    "Jeder Befehl wird nach kurzer Zeit geprüft und bei Bedarf wiederholt – gegen Funk- und VPN-Aussetzer. „Synchron“ heißt: Thermostat hat bestätigt.",
    "Every command is checked after a short time and repeated if needed – against radio and VPN drops. “In sync” means the thermostat has confirmed.",
  ],
};
