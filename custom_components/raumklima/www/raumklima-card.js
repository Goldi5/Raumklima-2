/* Raumklima 2.0.1b35 – gebaut aus frontend/src (npm run build). Nicht von Hand bearbeiten. */
(() => {
  // src/i18n/en.js
  var EN = {
    "Kalender – jetzt": "Calendar – now",
    "Kalender – als Nächstes": "Calendar – next",
    "kein Einfluss": "no effect",
    "kein Termin": "no event",
    "Als Nächstes": "Next",
    "Übersicht": "Overview",
    "Regelung": "Control",
    "Fenster & Lüften": "Windows & ventilation",
    "Präsenz": "Presence",
    "Geräte & Sensoren": "Devices & sensors",
    "Meldungen": "Messages",
    "Lernen & Verlauf": "Learning & history",
    "Schnellzugriff": "Quick access",
    "Abweichungen": "Deviations",
    "Ziel": "Target",
    "gemessen im Raum": "measured in the room",
    "was die Automatik gerade anstrebt": "what the automation is currently aiming for",
    "{n} angelegt": "{n} configured",
    "{n} Quellen": "{n} sources",
    "alle zu": "all closed",
    "{n} offen": "{n} open",
    "{n} Warnungen": "{n} warnings",
    "{h} % Feuchte": "{h} % humidity",
    "unter „Regelung“ und den anderen Unterseiten änderbar": "editable under “Control” and the other subpages",
    "Herkunft": "Origin",
    "Gerät": "Device",
    "Für alle Räume übernehmen": "Apply to all rooms",
    "Keine sicheren Werte zum Übernehmen": "No safe values to apply",
    "Keine weiteren Räume": "No other rooms",
    "{n} sichere Werte auf {m} Räume übernehmen?": "Apply {n} safe values to {m} rooms?",
    "{n} Räume übernommen": "{n} rooms updated",
    "Standard": "Default",
    "Einstellungen durchsuchen …": "Search settings …",
    "Einstellungen durchsuchen": "Search settings",
    "Suche": "Search",
    "öffnen": "open",
    "dorthin springen": "jump there",
    "zum Raum springen": "jump to room",
    "Einstellungen → Wohnung": "Settings → Home",
    "Raum kopieren": "Copy room",
    "Zielraum": "Target room",
    "Zielraum wählen. Kopiert werden nur sichere Werte – keine Entitäten, Zeitpläne oder Raumzuordnung.": "Choose a target room. Only safe values are copied – no entities, schedules or room assignment.",
    "Kein weiterer Raum in dieser Wohnung.": "No other room in this home.",
    "Keine sicheren Werte zum Kopieren": "No safe values to copy",
    "Raum kopiert": "Room copied",
    "Schnell-Override": "Quick override",
    "2 Stunden": "2 hours",
    "4 Stunden": "4 hours",
    "8 Stunden": "8 hours",
    "Party": "Party",
    "aktiv bis {t}": "active until {t}",
    "Schnell-Override gesetzt": "Quick override set",
    "wärmt kurzzeitig über den Zeitplan hinaus": "heats briefly beyond the schedule",
    "Selbsttest": "Self-test",
    "Prüft Wohnung, Räume, Thermostate, Fühler und Erreichbarkeit": "Checks home, rooms, thermostats, sensors and availability",
    "Die Prüfung ist nur lesend. Bei Fehlern steht der betroffene Raum oder die Entität dabei.": "The check is read-only. Errors name the affected room or entity.",
    "Keine Prüfungen": "No checks",
    "Wohnung eingerichtet": "Home set up",
    "Räume vorhanden": "Rooms present",
    "Thermostat je Raum": "Thermostat per room",
    "Entitäten erreichbar": "Entities reachable",
    "Vorlagen": "Templates",
    "Name der Vorlage": "Template name",
    "Aus diesem Raum speichern": "Save from this room",
    "Vorlage gespeichert": "Template saved",
    "Vorlage angewendet": "Template applied",
    "Vorlage gelöscht": "Template deleted",
    "Vorlage „{n}“ löschen?": "Delete template “{n}”?",
    "Name fehlt": "Name missing",
    "löschen": "delete",
    "Wärmebilanz": "Heat balance",
    "Aufheizen +2 K": "Heat-up +2 K",
    "lernt noch": "still learning",
    "schnelle Einordnung – keine neue Regel": "quick orientation – no new rule",
    "Kühlen": "Cooling",
    "Kühlgrenze": "Cooling limit",
    "Klimaanlage zum Heizen": "Use AC for heating",
    "gerade aktiv – günstiger als Gas": "active now – cheaper than gas",
    "nutzt die Klimaanlage nur, wenn COP und Gaspreis günstiger sind": "uses the AC only when COP and gas price make it cheaper",
    "COP": "COP",
    "Jahresarbeitszahl der Klimaanlage als Wärmepumpe – 3 ist ein typischer Richtwert": "seasonal performance factor of the AC as a heat pump – 3 is a typical value",
    "Gaspreis": "Gas price",
    "€/kWh – nur für den Vergleich „Klimaanlage oder Gas“": "€/kWh – only for the “AC or gas” comparison",
    "Strompreis": "Electricity price",
    "€/kWh – der Zähler misst Gas/Fernwärme; für „Klimaanlage oder Gas“ und günstiges Vorheizen": "€/kWh – the meter measures gas/district heat; for “AC or gas” and cheap preheating",
    "Mindestlaufzeit": "Minimum run time",
    "Mindestpause": "Minimum pause",
    "so lange bleibt die Klimaanlage mindestens an – gegen Takten": "the air conditioner stays on at least this long – prevents cycling",
    "so lange bleibt sie nach dem Ausgehen mindestens aus": "it stays off at least this long after switching off",
    "oberhalb dieser Temperatur kühlt die Klimaanlage": "above this temperature the air conditioning cools",
    "Energie & Lernen": "Energy & learning",
    "Energie-Erfassung": "Energy tracking",
    "dynamisch": "dynamic",
    "{n} kWh Überschuss": "{n} kWh surplus",
    "PV-Überschuss": "PV surplus",
    "startet bis zu 60 min vor einem Zeitfenster, wenn der aktuelle Preis unter der Grenze liegt": "starts up to 60 min before a schedule window when the current price is below the limit",
    "Dynamischer Tarif": "Dynamic tariff",
    "der Tarif-Sensor liefert einen wechselnden Preis – die Karte zeigt ihn; die Kostenschätzung nutzt den aktuellen Wert": "the tariff sensor provides a changing price – the card shows it; the cost estimate uses the current value",
    "Preisgrenze": "Price limit",
    "bis zu diesem Preis gilt Strom als günstig": "electricity counts as cheap up to this price",
    "Bei günstigem Strom vorheizen": "Preheat on cheap electricity",
    "startet bis zu 60 min vor einem Zeitfenster, wenn der aktuellen Preis unter der Grenze liegt": "starts up to 60 min before a schedule window when the current price is below the limit",
    "Energiequelle": "Energy source",
    "Gas-Umrechnung": "Gas conversion",
    "Jahresarbeitszahl": "Seasonal COP",
    "PV-Eigenverbrauch": "PV self-consumption",
    "Wärmemenge": "Heat output",
    "Preis pro kWh in € – gilt, wenn kein Tarif-Sensor gewählt ist": "Price per kWh in € – used when no tariff sensor is selected",
    "kWh je m³ – Brennwert × Zustandszahl; 10 ist ein typischer Näherungswert": "kWh per m³ – calorific value × correction factor; 10 is a typical approximation",
    "optionaler Wärmezähler der Wärmepumpe – sonst zählt nur der Strom": "optional heat meter for the heat pump – otherwise only electricity is counted",
    "optional: Wärme je kWh Strom (JAZ); 0 = unbekannt": "optional: heat per kWh electricity (COP); 0 = unknown",
    "Anteil des PV-Ertrags, der den Verbrauch deckt – nur bei Gesamtverbrauchszähler": "share of PV yield covering consumption – only with a total-consumption meter",
    "bestimmt, wie der Zähler umgerechnet und welcher Tarif erwartet wird": "determines how the meter is converted and which tariff is expected",
    "Strom-, Gas- oder Wärmezähler – wird beim PDF-Bericht ausgewertet": "electricity, gas or heat meter – evaluated for the PDF report",
    "Arbeitspreis-Sensor in €/kWh, ct/kWh oder €/m³ – optional, sonst gilt der feste Preis": "energy-price sensor in €/kWh, ct/kWh or €/m³ – optional, otherwise the fixed price applies",
    "PV-Erzeugung in kWh – optional, nur für den Eigenverbrauch bei Strom und Wärmepumpe": "PV generation in kWh – optional, only for self-consumption with electricity and heat pumps",
    "Gas": "Gas",
    "Wärmepumpe": "Heat pump",
    "Fernwärme": "District heating",
    "Strom": "Electricity",
    "Zuhause": "Home",
    "unterwegs": "Away",
    "Zähler": "Meter",
    "Tarif": "Tariff",
    "PV-Ertrag": "PV yield",
    "MwSt.": "VAT",
    "Preisbasis": "Price basis",
    "Zusätzliche Abgaben": "Additional charges",
    "aktuell {v}": "current {v}",
    "brutto": "gross",
    "brutto = inkl. MwSt./Netzentgelte; netto = der Sensor liefert den Nettopreis": "gross = incl. VAT/network charges; net = the sensor provides the net price",
    "netto": "net",
    "nur bei netto – wird auf den Nettopreis addiert": "only for net – added to the net price",
    "€/kWh – z. B. Netzentgelte, die der Sensor nicht enthält": "€/kWh – e.g. network charges not included in the sensor",
    "Aktuell": "Current",
    "Böen ab dieser Stärke": "Gusts from this strength",
    "Entitäten": "Entities",
    "Home Assistant": "Home Assistant",
    "Integration": "Integration",
    "Nächste Stunden": "Next hours",
    "Offene Hinweise": "Open issues",
    "Python": "Python",
    "Raumklima-Räume": "Raumklima rooms",
    "Sturm": "Storm",
    "Vorhersage unter diesem Wert": "forecast below this value",
    "Wetter-Entität in den Einstellungen wählen": "select a weather entity in the settings",
    "Wind": "Wind",
    "Zeitzone": "Time zone",
    "alle Entitäten in Home Assistant": "all entities in Home Assistant",
    "aus der Wettervorhersage": "from the weather forecast",
    "darunter gilt die Heizsaison": "below this the heating season applies",
    "für die Verschattung und die Sonnenprognose": "for shading and the sun forecast",
    "gefühlte Temperatur": "feels-like temperature",
    "gefühlt {v} °C": "feels like {v} °C",
    "Grundpreis": "Base fee",
    "Arbeitspreis": "Energy price",
    "Energiezähler und Tarife auswerten – Voraussetzung für die Euro-Schätzung im Bericht": "Analyse meters, tariffs and PV yield – prerequisite for the euro estimate in the report",
    "Strom- oder Gaszähler – liefert den Verbrauch für die Schätzung": "Electricity or gas meter – provides consumption for the estimate",
    "Arbeitspreis und Grundgebühr – optional, sonst nur kWh": "Energy price and base fee – optional, otherwise kWh only",
    "PV-Ertrag oder Einspeisung – für die Eigenverbrauchs-Schätzung": "PV yield or feed-in – for self-consumption estimate",
    "monatliche Grundgebühr in €": "monthly base fee in €",
    "Preis pro kWh in €": "price per kWh in €",
    "Präsenzstatus": "Presence status",
    "belegt": "occupied",
    "aus Meldern und Lampen; Anwesenheits-Temperatur gilt, solange jemand im Raum ist": "from sensors and lamps; presence temperature applies while someone is in the room",
    "Boost für": "Boost for",
    "Heizquellen": "Heat sources",
    "Klimaanlage": "Air conditioner",
    "Quelle hinzufügen": "Add source",
    "Bitte zuerst eine Quelle auswählen": "Please select a source first",
    "Quellen": "Sources",
    "Thermostate oder Klimaanlagen, die mit dem Raum laufen": "Thermostats or air conditioners that run with the room",
    "Weitere Quellen": "Other sources",
    "alle Quellen": "all sources",
    "alle Quellen – antippen schließt eine aus": "all sources – tap to exclude one",
    "fest für diese Quelle – z. B. +0,5 K, damit sie früher anläuft": "fixed for this source – e.g. +0.5 K so it starts earlier",
    "führt den Raum; die anderen Quellen folgen der Auswahl": "leads the room; the other sources follow the selection",
    "im Zeitplan gewählt": "selected in the schedule",
    "nur die gewählten Quellen": "only the selected sources",
    "nur die priorisierte": "only the prioritized one",
    "unangetastet": "untouched",
    "welche Quellen der Boost ansteuert – die anderen bleiben in diesem Moment aus": "which sources the boost drives – the others stay off during that time",
    "… Offset": "… offset",
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
    "Zeitplan fortsetzen": "Resume schedule",
    "Wunschtemperatur fortsetzen": "Resume desired temperature",
    "Zeitplan": "Schedule",
    "Zeitfenster {n}": "Time window {n}",
    "Zeitfenster hinzufügen": "Add time window",
    "Zeitfenster": "Time window",
    "Wärmer für kurze Zeit (Boost)": "Warmer for a short while (boost)",
    "Wärmer für kurze Zeit": "Warmer for a short while",
    "Homeoffice-Entität": "Home office entity",
    "eigener Schalter für dieses Büro – z. B. eine input_boolean, die nur für diesen Raum Homeoffice meldet": "own switch for this office – e.g. an input_boolean that signals home office only for this room",
    "Raumklima schreibt den Sollwert 1:1 – nur sinnvoll, wenn Thermostat und Raumfühler sauber übereinstimmen": "Raumklima writes the setpoint 1:1 – only useful when thermostat and room sensor agree",
    "Boost beenden": "End boost",
    "{n} Dashboard(s) für deine Wohnungen angelegt": "{n} dashboard(s) created for your homes",
    "– keiner –": "– none –",
    "gerade: „{s}“": "now: “{s}”",
    "Arbeitspreis-Sensor in €/kWh, ct/kWh, €/m³ oder €/L – optional, sonst gilt der feste Preis": "Energy price sensor in €/kWh, ct/kWh, €/m³ or €/L – optional, otherwise the fixed price applies",
    "Auch in": "Also in",
    "Letzter Winter": "Last winter",
    "Ø Verbrauch": "Ø consumption",
    "Letzter Winter (Liter)": "Last winter (litres)",
    "Letzter Winter (Tage)": "Last winter (days)",
    "Preisverlauf": "Price history",
    "noch kein Preis geändert": "no price changed yet",
    "wird beim Ändern des Ölpreises automatisch notiert": "recorded automatically when the oil price changes",
    "Liter aus dem letzten Winter – für die grobe Planung": "litres from last winter – for rough planning",
    "Zeitraum des letzten Winters": "period of last winter",
    "Marktpreis-Entität": "Market price entity",
    "optionaler Börsen-/Marktpreis in €/L – für den Vergleich": "optional market/stock price in €/L – for comparison",
    "Marktpreis": "Market price",
    "Markt vs. deinem Preis": "Market vs. your price",
    "30-Tage-Ø {v} €/L": "30-day avg {v} €/L",
    "Markt": "Market",
    "Noch kein Zähler, Tank oder Marktpreis gewählt. In den Einstellungen unter „Heizung & Energie“ eine Quelle auswählen.": "No meter, tank or market price selected yet. Choose a source under Settings → Heating & Energy.",
    "Suchen …": "Search …",
    "Bei Wärmepumpe den Stromzähler der WP wählen; Wärmemenge separat. Keine Tages-/Wochenwerte mit Reset.": "For a heat pump choose the heat pump electricity meter; heat output goes in its own field. No daily/weekly values that reset.",
    "PV-Erzeugung in kWh – Gesamtzähler ohne Reset; optional für den Eigenverbrauch bei Strom und Wärmepumpe": "PV yield in kWh – cumulative meter without reset; optional for self-consumption with electricity and heat pump.",
    "Heizöl": "Heating oil",
    "Ölpreis": "Oil price",
    "Preis je Liter Heizöl – wird für die Kosten und den Tank genutzt": "Price per litre of heating oil – used for costs and the tank",
    "kWh je Liter": "kWh per litre",
    "Energieinhalt von einem Liter Heizöl; 10 kWh/L ist ein typischer Wert": "Energy content of one litre of heating oil; 10 kWh/L is typical",
    "Tankfüllstand": "Tank level",
    "optionaler Füllstand in %, L oder m³ – zeigt Restmenge und Bestellhinweis": "optional level in %, L or m³ – shows the remaining amount and reorder hint",
    "Tankinhalt": "Tank capacity",
    "Nenninhalt in Litern – nötig, wenn der Fühler Prozent meldet": "nominal capacity in litres – needed when the sensor reports percent",
    "Öl bestellen ab": "Order oil below",
    "Restmenge in Prozent – darunter erscheint der Bestellhinweis": "remaining amount in percent – below this the reorder hint appears",
    "Strom-, Gas-, Öl- oder Wärmezähler – wird beim PDF-Bericht ausgewertet": "electricity, gas, oil or heat meter – evaluated for the PDF report",
    "Noch kein Zähler oder Tank gewählt. In den Einstellungen unter „Heizung & Energie“ einen Strom-, Gas-, Öl- oder Wärmezähler auswählen.": "No meter or tank selected yet. Choose an electricity, gas, oil or heat meter in Settings under “Heating & Energy”.",
    "reicht noch ~{d} Tage": "lasts about {d} more days",
    "Tank": "Tank",
    "Tankverbrauch": "Tank consumption",
    "Reicht noch": "Lasts",
    "Ölbestellung": "Oil order",
    "jetzt bestellen": "order now",
    "noch Zeit": "still time",
    "Schwelle {v} L": "threshold {v} L",
    "Schulferien-Kalender": "School holiday calendar",
    "Entfeuchter": "Dehumidifier",
    "Entfeuchter läuft": "Dehumidifier is running",
    "Entfeuchter läuft ohne Besserung": "Dehumidifier is running without improvement",
    "Entfeuchter an ab": "Dehumidifier on at",
    "Entfeuchter aus unter": "Dehumidifier off below",
    "Einschaltverzögerung": "Start delay",
    "Strommessung (W)": "Power measurement (W)",
    "Stromzähler (kWh)": "Energy meter (kWh)",
    "Leistung gerade": "Current power",
    "Verbrauch gesamt": "Total consumption",
    "Starts": "Starts",
    "Laufzeit gesamt": "Total runtime",
    "sofort": "immediately",
    "schaltet nach den eigenen Schwellen – nicht bei offenem Fenster": "switches according to its own thresholds – not when a window is open",
    "läuft gerade": "running now",
    "läuft zu lange ohne Besserung – Heizung schützt weiter": "running too long without improvement – heating keeps protecting",
    "an ab Feuchtegrenze, aus 5 % darunter – nicht bei offenem Fenster": "on at the humidity limit, off 5% below – not with the window open",
    "an Ferientagen starten Morgen-Zeitfenster später": "on school holidays, morning time windows start later",
    "Morgens später": "Later in the morning",
    "nur Zeitfenster, die vor 12:00 beginnen – 0 = aus": "only time windows starting before 12:00 – 0 = off",
    "Schulferien – jetzt": "School holidays – now",
    "keine Schulferien": "no school holidays",
    "morgens {n} min später": "in the morning {n} min later",
    "keine Verschiebung": "no shift",
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
    "Fenster geschlossen": "Window closed",
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
    "Raumklima – Raum kompakt": "Raumklima – Compact room",
    "Kompakte Raumkarte mit Ist, Ziel und schneller Regelung": "Compact room card with current temperature, target and quick control",
    "Raumklima – Verlauf": "Raumklima – History",
    "Raumklima – Übersicht": "Raumklima – Overview",
    "Raumtemperatur": "Room temperature",
    "Raumtyp": "Room type",
    "Gespeicherte Werte": "Saved values",
    "CO₂-Grenze · Hinweise pro Tag · Meldetakt des Thermostats": "CO₂ limit · notifications per day · thermostat report interval",
    "Ruhezeit": "Quiet hours",
    "Ruhezeit gerade aktiv": "Quiet hours active",
    "Ruhezeit wirksam": "Effective quiet hours",
    "Raum hinzufügen": "Add room",
    "Nur messen": "Monitor only",
    "Name des neuen Raums": "New room name",
    "Raum löschen": "Delete room",
    "Raum wirklich löschen? Einstellungen, Zeitpläne und Verlauf dieses Raums werden entfernt.": "Delete this room? Its settings, schedules and history will be removed.",
    "Raum gelöscht": "Room deleted",
    "Name und Temperaturfühler wählen": "Choose a name and temperature sensor",
    "Raum „{n}“ angelegt": "Room “{n}” created",
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
    "Schimmelschutz hält {v}° (statt {u}°)": "Mould protection holds {v}° (instead of {u}°)",
    "Schimmelschutz hält {v}°": "Mould protection holds {v}°",
    "Wartet auf Wärme": "Waiting for heat",
    "Wartet": "Waiting",
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
    "Wohnungen je Empfänger": "Homes per recipient",
    "alle Wohnungen": "all homes",
    "keine Wohnung": "no home",
    "{n} von {m} Wohnungen": "{n} of {m} homes",
    "Ein Häkchen heißt: Diese Person bekommt die Meldungen dieser Wohnung. Welche Arten (Lüften, Frost, Bericht …) sie bekommt, steht in den Benachrichtigungen der jeweiligen Wohnung – hier oben für die aktuelle Wohnung.": "A check mark means this person receives messages from that home. Which kinds (airing, frost, report …) they receive is set in the notifications for the respective home – above for the current home.",
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
    "Melder/Gerät hinzufügen": "Add sensor/device",
    "Melder oder Gerät hinzufügen (z. B. PC/Lampe) – dann kann der Raum bei Anwesenheit wärmer werden": "Add sensor/device (e.g. PC/lamp) – the room can then heat on presence",
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
    "SMTP-Bericht": "SMTP report",
    "versendet den PDF-Bericht über Home Assistants SMTP-Integration statt über den eigenen Mail-Client": "sends the PDF report via Home Assistant’s SMTP integration instead of the built-in mail client",
    "– HA-SMTP wählen –": "– select HA SMTP –",
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
    "Alle verfügbaren gewählt": "All available selected",
    "Keine freien Thermostate – bitte „Nur messen“ wählen.": "No free thermostats – please select “Monitor only”.",
    "Keine freien Temperaturfühler – bitte einen bestehenden Messraum entfernen oder „Thermostat“ wählen.": "No free temperature sensors – remove an existing monitoring room or choose “Thermostat”.",
    "Keine weiteren verfügbar": "No further ones available",
    "Hinzufügen": "Add",
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
    "mittlere Karte": "Medium card",
    "lädt …": "loading …",
    "Reihenfolge gilt im generierten Dashboard und in der Übersicht; „große Karte“ zeigt die volle Raumseite, „mittlere Karte“ die kompakte Raumkarte, „Kachel“ nur die Übersicht, „aus“ versteckt den Raum ganz. Farbe färbt Rand und Akzente der Karte.": "The order applies to the generated dashboard and the overview; “Large card” shows the full room page, “Medium card” the compact room card, “Tile” only the overview, “off” hides the room entirely. The colour tints the card’s edge and accents.",
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
    "Debug-Protokoll": "Debug log",
    "DEBUG-Zeilen für die Diagnose mitschreiben; auf eMMC kann das Log groß werden": "Write DEBUG lines to the diagnostics; on eMMC the log can grow large",
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
    "Abbrechen": "Cancel",
    "Abschließen": "Finish",
    "Bitte {f} ausfüllen": "Please fill in {f}",
    "Einrichtung abgeschlossen": "Setup complete",
    "Einstellungen übernommen – kein Raum angelegt (Thermostat oder Temperaturfühler fehlt)": "Settings saved – no room created (thermostat or temperature sensor missing)",
    "Assistent": "Assistant",
    "Einrichtungsassistent": "Setup assistant",
    "Führt Schritt für Schritt durch die Einrichtung": "Guides you through setup step by step",
    "Führt Schritt für Schritt durch das Anlegen eines Raums": "Guides you through adding a room step by step",
    "Keine weiteren Fragen – bereit zum Abschließen.": "No more questions – ready to finish.",
    "Neuer Raum": "New room",
    "Weiter": "Next",
    "– keins –": "– none –",
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
    "Ventilsteuerung": "Valve control",
    "direkt über {e}": "directly via {e}",
    "Sollwert am Thermostat – kein Ventilstellglied gefunden": "setpoint on the thermostat – no valve actuator found",
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
    "unter diesem Wert heizt der Raum immer – wie am Gerät": "below this value the room always heats – like on the device",
    "Immer": "Always",
    "Nachtabsenkung": "Night setback",
    "Nie": "Never",
    "gilt bei der Ruhezeit und wenn der Schalter „Nachtruhe“ an ist – je Raum unter „Nachtabsenkung“ ein- oder ausgeschlossen": "applies during quiet hours and when the “Night mode” switch is on – include or exclude each room under “Night setback”",
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
    "Personen": "People",
    "Schalter": "Switches",
    "Person oder Schalter hinzufügen …": "Add person or switch …",
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
    "… erst nach": "only after",
    "Melder muss so lange jemanden sehen, bevor die Anwesenheits-Temperatur gilt": "the sensor must see someone for this long before the presence temperature applies",
    "HA-Schalter, der Homeoffice mit schaltet – gilt wie der Schalter, ohne Anwesenheitsprüfung": "HA switch that also turns home office on – works like the switch, without the presence check",
    "HA-Schalter, der die Nachtruhe mit schaltet – der eigene Schalter bleibt": "HA switch that also turns on night mode – the built-in switch stays",
    "Homeoffice über Entität": "Home office via entity",
    "Nachtruhe über Entität": "Night mode via entity",
    "so warm, solange ein Melder jemanden im Raum sieht": "this warm while a sensor sees someone in the room",
    "… Homeoffice / zu Hause": "… home office / at home",
    "Komma-getrennt, freie Wahl; ein Termin mit diesem Wort schaltet Homeoffice und senkt nicht ab": "comma-separated, free choice; an event with this word turns home office on and lowers nothing",
    "Automatik am Gerät": "Automatic on the device",
    "Automatik": "Automatic",
    "Arbeitsplätze": "Workplaces",
    "Zonen, in denen gearbeitet wird – wer dort ist, kommt so schnell nicht zurück": "zones where people work – whoever is there will not come back soon",
    "so lange dort, dann gilt die Wohnung sofort als leer (kein Vorheizen, keine Wartezeit)": "there for this long, then the home counts as empty right away (no preheating, no waiting time)",
    "… gilt nach": "… counts after",
    "Nacht": "Night",
    "Berichte": "Reports",
    "Nacht & Ruhezeit": "Night & quiet time",
    "Grenze unter Lüften & Feuchte": "threshold under Airing & humidity",
    "Weitere Einstellungen": "More settings",
    "Homeoffice & Kalender": "Home office & calendar",
    "Dashboard, Standort, weitere Wohnung": "Dashboard, location, another home",
    "Technik": "Technical",
    "vom Standard abweichend": "differs from default",
    "Profi-Ansicht": "Expert view",
    "Alle selten gebrauchten Einstellungen dauerhaft aufklappen": "Keep all rarely used settings expanded",
    "Automatisch: Bewegung = PIR, Anwesenheit/Belegung = mmWave. Für „Raum leer“: 3 min (mmWave) bzw. 20 min (PIR) ohne Meldung": "Automatic: motion = PIR, presence/occupancy = mmWave. For “room empty”: 3 min (mmWave) or 20 min (PIR) without a report",
    "Automatisch: nein – „Bei Anwesenheit“ ist eingestellt, die Wunschtemperatur ist schon der Wert für den leeren Raum": "Automatic: no – “When occupied” is set, the desired temperature already is the value for the empty room",
    "Einschalten ({t})": "Turn on ({t})",
    "Melder hinzufügen – dann kann der Raum bei Anwesenheit wärmer werden": "Add a sensor – then the room can get warmer while someone is in it",
    "Nur Bewegungsmelder (PIR) gewählt – für die Anwesenheits-Temperatur unten „auch Bewegungsmelder“ einschalten oder einen mmWave-Melder hinzufügen.": "Only motion sensors (PIR) selected – for the presence temperature turn on “also motion sensors” below or add an mmWave sensor.",
    "PIR sieht auch Haustiere und nach ein paar Minuten Stillsitzen niemanden mehr – dann „zurück nach“ eher 20 min": "PIR also sees pets and nobody after a few minutes of sitting still – then set “back after” to about 20 min",
    "aus – der Raum heizt nach Wunsch und Zeitplan": "off – the room heats by desired temperature and schedule",
    "ausschalten": "turn off",
    "heizt auf {t} – jemand im Raum": "heating to {t} – someone in the room",
    "jemand da seit {m} min – ab {d} min {t}": "someone there for {m} min – {t} from {d} min",
    "so lange muss jemand im Raum sein – kurz Durchgehen zählt nicht (0 = sofort)": "someone must be in the room this long – walking through does not count (0 = immediately)",
    "so lange ohne Belegung, dann gilt wieder die Temperatur von vorher – kurz rausgehen unterbricht nicht": "this long without occupancy, then the previous temperature applies again – stepping out briefly does not interrupt",
    "so warm, solange jemand im Raum ist – danach wieder die Temperatur von vorher": "this warm while someone is in the room – then the previous temperature again",
    "„Bei Anwesenheit“ liegt nicht über der Wunschtemperatur ({w}) – dann ändert sich nichts. Die Wunschtemperatur ist der Wert, wenn niemand im Raum ist.": "“When occupied” is not above the desired temperature ({w}) – then nothing changes. The desired temperature is the value when nobody is in the room.",
    "… auch Bewegungsmelder": "… also motion sensors",
    "… wenn belegt seit": "… when occupied for",
    "… zurück nach": "… back after",
    "Batterie: {n}": "Battery: {n}",
    "Der Schimmelschutz hebt das Ziel gerade an (Feuchte).": "Mould protection is raising the target right now (humidity).",
    "Lampen zählen als Anwesenheit": "Lamps count as presence",
    "Neu prüfen": "Check again",
    "Prognose ab 7 Tagen Verlauf": "forecast after 7 days of history",
    "Regeln – die erste, die greift, bestimmt das Ziel": "Rules – the first one that applies sets the target",
    "Voraussetzungen": "Requirements",
    "Vorwärmen nach gelernten Zeiten": "Warm up by learned times",
    "Vorwärmen · {v}°": "Warming up · {v}°",
    "Vorwärmen – der Raum ist um diese Zeit meist belegt · <b>{v} °C</b>": "Warming up – the room is usually occupied at this time · <b>{v} °C</b>",
    "bestimmt das Ziel": "sets the target",
    "eine eingeschaltete Lampe (z. B. Schreibtischlampe) heißt: jemand ist im Raum – zählt nur für diesen Raum, nie für „jemand zu Hause“": "a lamp that is on (e.g. desk lamp) means someone is in the room – counts only for this room, never for “someone home”",
    "greift nicht": "does not apply",
    "hält noch etwa {d} Tage": "lasts about {d} more days",
    "lernt noch: ein Zeitraum gilt als typisch, wenn der Raum an 3 der letzten 4 gleichen Wochentage belegt war": "still learning: a time counts as typical when the room was occupied on 3 of the last 4 same weekdays",
    "meist belegt: {u} – so früh vorwärmen, dass es dann warm ist; kommt 30 min niemand, gilt wieder der Wert von vorher": "usually occupied: {u} – warms up early enough to be warm then; if nobody comes within 30 min, the previous value applies again",
    "prüft …": "checking …",
    "würde greifen – nachrangig": "would apply – lower priority",
    "{n} Funkbefehle am Tag (Mittel 7 Tage)": "{n} radio commands a day (7-day average)",
    "Warum (nicht)?": "Why (not)?",
    "Keine Antwort – bitte Raumklima aktualisieren und neu starten.": "No answer – please update Raumklima and restart.",
    "Klassische Ansicht": "Classic view",
    "Neue Ansicht": "New view",
    "Noch keine Räume eingerichtet.": "No rooms set up yet.",
    "Zwischen neuer Bereichsnavigation und klassischer Ansicht wechseln": "Switch between the new section navigation and the classic view",
    "Wohnungen": "Homes",
    "Personen & Anwesenheit": "People & presence",
    "Heizung & Energie": "Heating & energy",
    "System & Diagnose": "System & diagnostics",
    "Energie & Tarife": "Energy & tariffs",
    "Wetter": "Weather",
    "Kommt in einer späteren Beta: Zähler, Tarife und PV-Ertrag.": "Coming in a later beta: meters, tariffs and PV yield.",
    "Kommt in einer späteren Beta: eigene Wetterquelle und Vorhersage je Wohnung.": "Coming in a later beta: your own weather source and forecast per home.",
    "Erweitert": "Advanced",
    "Kommt in einer späteren Beta: technische Einstellungen und Diagnosewerkzeuge.": "Coming in a later beta: technical settings and diagnostic tools.",
    "Energie-Erfassung ist aus. In den Einstellungen unter „Heizung & Energie“ aktivieren.": "Energy tracking is off. Enable it in Settings under “Heating & Energy”.",
    "Noch kein Zähler gewählt. In den Einstellungen unter „Heizung & Energie“ einen Strom-, Gas- oder Wärmezähler auswählen.": "No meter selected yet. Choose an electricity, gas or heat meter in Settings under “Heating & Energy”.",
    "Quelle": "Source",
    "fester Preis": "fixed price",
    "Verbrauch": "Consumption",
    "Kosten": "Cost",
    "Jahr": "Year",
    "PV": "PV",
    "Basis: {b}": "Basis: {b}",
    "noch keine Schätzung": "no estimate yet",
    "Schätzung": "Estimate",
    "Energie nicht verfügbar: {e}": "Energy unavailable: {e}",
    "Lade Energie …": "Loading energy …",
    "Energie": "Energy",
    "Letzte {n} Tage": "Last {n} days",
    "Zähler, Tarif und Kosten": "Meter, tariff and costs",
    "{n} Tage": "{n} days",
    "{n} % Eigenverbrauch": "{n}% self-use",
    "Lernen": "Learning",
    "Was Raumklima aus deinen Daten gelernt hat": "What Raumklima has learned from your data",
    "Aufheizraten": "Heat-up rates",
    "Abkühlung": "cooling",
    "Wärmemodell": "Thermal model",
    "Räume mit Wärmeverlust": "rooms with heat loss",
    "Räume mit Daten": "rooms with data",
    " Tage": " days",
    "Profil vollständig": "profile complete",
    "Profil wächst": "profile growing",
    "gelernte Vorgänge": "learned events",
    "Schlaf": "Sleep",
    "typische Nacht": "typical night",
    "{n} Aufheizvorgänge": "{n} heat-up runs",
    "+2 K in {n} min": "+2 K in {n} min",
    "Noch zu wenig Daten": "Not enough data yet",
    "Nutzung": "Usage",
    "{n} Tage mit Belegung": "{n} days with occupancy",
    "Kein Präsenzprofil": "No presence profile",
    "{n} Vorgänge": "{n} events",
    "typisch": "typical",
    "Noch kein Lüftmuster": "No airing pattern yet",
    "Wochentags": "Weekdays",
    "Lernen ist lesend: Raumklima zeigt hier nur, was es aus den letzten Wochen gelernt hat.": "Learning is read-only: Raumklima only shows what it has learned from recent weeks.",
    "Raumklima – Energie": "Raumklima – Energy",
    "Zähler, Tarif und Kosten im Zeitraum": "Meter, tariff and costs for the period",
    "Alles hier ist simuliert – ohne Home-Assistant-Entitäten und ohne persönliche Daten.": "Everything here is simulated – no Home Assistant entities and no personal data.",
    "Büro": "Office",
    "Demo": "Demo",
    "Demo-Daten": "demo data",
    "Fenster auf": "Open window",
    "Fenster zu": "Close window",
    "Innen {v} °C": "Indoor {v} °C",
    "Raumklima": "Raumklima",
    "Raumklima – Demo": "Raumklima – Demo",
    "Simulierte Räume ohne Hardware": "Simulated rooms without hardware",
    "Soll {v} °C": "Setpoint {v} °C",
    "Wohnzimmer": "Living room",
    "in 45 min": "in 45 min",
    "{v} % Feuchte": "{v} % humidity",
    "Raumklima – Lernen": "Raumklima – Learning",
    "0 % = ganz zu, 100 % = ganz offen – Rollläden ohne Positionsfahrt schließen ganz": "0 % = fully closed, 100 % = fully open – blinds without position control close completely",
    "Empfehlung: schließen": "Recommendation: close",
    "Empfehlung: öffnen": "Recommendation: open",
    "Gerät antwortet nicht": "Device is not responding",
    "Handbedienung pausiert": "Manual control pauses automation",
    "Handbedienung – pausiert": "Manual control – paused",
    "Nacht vorbei": "Night is over",
    "Nachts schließen": "Close at night",
    "Nur empfehlen": "Advise only",
    "Rollläden": "Blinds",
    "Rollläden bleiben, wie sie sind": "Blinds stay as they are",
    "Schließen ab innen": "Close from indoor",
    "Schließposition": "Closed position",
    "Sonne auf der Fassade": "Sun on the facade",
    "Verschattung": "Shading",
    "ab dieser Außentemperatur wird es auch ohne warmen Raum zu warm": "from this outdoor temperature it gets too warm even without a warm room",
    "ab dieser Raumtemperatur hält die Sonne den Raum warm – dann Schatten": "from this room temperature the sun keeps the room warm – then shade",
    "die Karte empfiehlt, fährt aber nicht selbst": "the card recommends but does not move them itself",
    "fährt bei Sonne und nachts – Handbedienung pausiert die Automatik": "moves in sun and at night – manual control pauses the automation",
    "Sollwert am Gerät": "Setpoint on the device",
    "Fußbodenheizung": "Underfloor heating",
    "eigene Regelcharakteristik: träge, mit Vor-/Rücklauf und größerem Band": "own control characteristic: slow, with flow/return and a wider band",
    "Durchfluss in Ordnung": "Flow is fine",
    "Vor-/Rücklauf nicht verbunden": "Flow/return sensors not connected",
    "Spreizung zu klein – Pumpe/Abgleich prüfen": "Spread too small – check pump/balancing",
    "durch die Fußboden-Charakteristik begrenzt und im Takt nachgezogen": "limited by the underfloor characteristic and adjusted on the cycle",
    "Max. Vorlauf": "Max. flow temperature",
    "harte Obergrenze – schützt Boden und Heizkreis": "hard upper limit – protects floor and heating circuit",
    "Min. Raumtemperatur": "Min. room temperature",
    "darunter heizt die Fußbodenheizung nicht": "the underfloor heating does not heat below this",
    "Regelband": "Control band",
    "innerhalb des Bandes bleibt der Sollwert stehen – gegen Überschwingen": "within the band the setpoint stays put – prevents overshoot",
    "Mindest-Taktzeit": "Minimum cycle time",
    "so oft darf der Sollwert höchstens nachgezogen werden": "the setpoint is adjusted at most this often",
    "Vorlauf vor Zeitfenster": "Lead before schedule window",
    "früher starten, damit der träge Boden zum Fenster warm ist": "start earlier so the slow floor is warm when the window starts",
    "Durchfluss-Grenze": "Flow limit",
    "Vorlauf minus Rücklauf unter diesem Wert: Durchfluss prüfen": "flow minus return below this value: check the flow",
    "geschlossen": "closed",
    "keine Rollläden gewählt": "no blinds selected",
    "keine Sonne erwartet": "no sun expected",
    "keine Temperaturdaten": "no temperature data",
    "Fenster/Tür offen – fährt nicht zu": "Window/door open – not closing",
    "keine – unter „Geräte & Technik ändern“ wählen": "none – select under “Change devices & technology”",
    "nach Sonnenuntergang zu, morgens wieder auf – schützt vor Wärmeverlust und Licht": "closed after sunset, open again in the morning – protects against heat loss and light",
    "nur diese Rollläden oder Jalousien werden gefahren – Fensterkontakte bleiben getrennt": "only these blinds or shutters are moved – window contacts stay separate",
    "oder ab außen": "or from outdoor",
    "so lange bleibt die Automatik aus, wenn jemand selbst am Rollladen zieht – 0 = sofort wieder automatisch": "automation stays off this long when someone moves a blind manually – 0 = automatic again immediately",
    "zu kühl für Schatten": "too cool for shade",
    "Werkzeuge": "Tools",
    "Karte": "Card",
    "Sonnenaufgang": "Sunrise",
    "Sonnenuntergang": "Sunset",
    "Quelle für Außentemperatur, Vorhersage, Sonnenseite und Frostnacht": "source for outdoor temperature, forecast, sun side and frost night",
    "nächster Sonnenaufgang": "next sunrise",
    "nächster Sonnenuntergang": "next sunset",
    "Version der Karte im Browser": "version of the card in the browser",
    "Datenquelle": "Data source",
    "WebSocket": "WebSocket",
    "Live-Verbindung zur Integration": "live connection to the integration",
    "Selbsttest, Diagnose-Datei oder Fehlerbericht öffnen": "open self-test, diagnostics file or bug report",
    "aktiv": "active",
    "nicht aktiv": "not active",
    "Warmwasser": "Hot water",
    "Außen °C": "Outdoor °C",
    "Spanne": "Range",
    "Am günstigsten": "Cheapest",
    "Wärmezähler": "Heat meter",
    "Warmwasser-Zähler": "Hot water meter",
    "Hausverbrauch": "House consumption",
    "Netzbezug": "Grid import",
    "Warmwasser-Wärme": "Hot water heat",
    "Zähler liefert": "Meter delivers",
    "Zähler ohne Statistik": "Meter without statistics",
    "Arbeitszahl gemessen": "Efficiency measured",
    "Wärmezähler ohne Werte": "Heat meter without values",
    "Arbeitszahl geschätzt – Wärmezähler fehlt": "Efficiency estimated – heat meter missing",
    "Preis aus {s}": "Price from {s}",
    "keine Preisquelle liefert – fester Preis": "no price source delivers – fixed price",
    "Preisvorschau da": "Price forecast available",
    "keine Preisvorschau": "no price forecast",
    "Energiequelle bitte in den Einstellungen wählen": "Please choose the energy source in the settings",
    "Jahr ≈ {v} €": "Year ≈ {v} €",
    "Jahresprognose ab Heizsaison": "Annual forecast from heating season",
    "Heizung {h} · Warmwasser {w} kWh": "Heating {h} · hot water {w} kWh",
    "Arbeitszahl": "Efficiency (COP)",
    "Heizung, gemessen": "heating, measured",
    "geschätzt (Datenblatt)": "estimated (data sheet)",
    "Wärmezähler fehlt": "heat meter missing",
    "Warmwasser {v}": "hot water {v}",
    "Wärme": "Heat",
    "Bezahlt Ø": "Paid Ø",
    "Mittel {v} ct": "average {v} ct",
    "{p} % in günstigen Stunden": "{p} % in cheap hours",
    "Preis": "Price",
    "Wärme {v} ct/kWh": "heat {v} ct/kWh",
    "je kWh, brutto": "per kWh, gross",
    "Aus PV & Batterie": "From PV & battery",
    "kostet nichts – schon abgezogen": "free – already deducted",
    "Verbrauch pro Tag": "Consumption per day",
    "Wer verbraucht die Wärme?": "Who uses the heat?",
    "nach Ventilöffnung × Stunden – ohne Warmwasser und Grundgebühr": "by valve opening × hours – without hot water and base fee",
    "Preisquellen": "Price sources",
    "Hauptquelle": "Main source",
    "Reserve": "Fallback",
    "liefert nichts": "no value",
    "Details und Sensoren": "Details and sensors",
    "{v} € pro Tag": "{v} € per day",
    "{p} % des Hausstroms": "{p} % of house electricity",
    "Zähler und Preise auswerten – Raumklima rechnet nur aus und steuert die Heizung nicht": "Analyse meters and prices – Raumklima only calculates and does not control the heating system",
    "Wie heizt ihr?": "How do you heat?",
    "bestimmt, welche Zähler und Preise abgefragt werden": "decides which meters and prices are asked for",
    "Strom direkt": "Direct electric",
    "bitte wählen – bisher automatisch erkannt": "please choose – detected automatically so far",
    "Anleitung: Welche Energiequelle passt?": "Guide: which energy source fits?",
    "Wärmepumpe: Luft-, Sole- oder Wasser-Wärmepumpe – auch mit Heizstab, der läuft über denselben Stromzähler.": "Heat pump: air, ground or water source – also with a backup heater, which runs on the same electricity meter.",
    "Strom direkt: Infrarotplatten, Nachtspeicher, Elektroheizkörper – eine kWh Strom ist eine kWh Wärme.": "Direct electric: infrared panels, storage heaters, electric radiators – one kWh of electricity is one kWh of heat.",
    "Gas: Brennwert- oder Heizwerttherme, auch Gasetagenheizung.": "Gas: condensing or standard boiler, including flat-level gas heating.",
    "Fernwärme: Übergabestation im Keller, abgerechnet nach Wärmemenge.": "District heating: transfer station in the basement, billed by heat delivered.",
    "Die Wahl ändert nichts an der Heizung selbst – sie legt nur fest, wie gerechnet wird.": "The choice does not change the heating system – it only defines how things are calculated.",
    "Strom der Wärmepumpe fürs Heizen – Gesamtzähler in kWh": "heat pump electricity for heating – total meter in kWh",
    "Strom der Heizung – Gesamtzähler in kWh": "heating electricity – total meter in kWh",
    "Gaszähler in m³ oder kWh – Gesamtzähler": "gas meter in m³ or kWh – total meter",
    "Liter-Zähler des Brenners – oder leer lassen und den Tank wählen": "burner litre meter – or leave empty and choose the tank",
    "Wärmemengenzähler der Übergabestation in kWh oder MWh": "heat meter of the transfer station in kWh or MWh",
    "Was wird gemessen?": "What is measured?",
    "immer Gesamtzähler, die nur steigen – keine Tages- oder Wochenwerte": "always total meters that only rise – no daily or weekly values",
    "erzeugte Heizwärme – damit wird die Arbeitszahl gemessen statt geschätzt": "heat produced – this measures the efficiency instead of estimating it",
    "kWh je m³ – steht auf der Gasrechnung": "kWh per m³ – shown on the gas bill",
    "nur wenn Warmwasser getrennt gemessen wird – zählt dann mit zu den Kosten": "only if hot water is metered separately – it is then included in the costs",
    "erzeugte Warmwasser-Wärme – für die Arbeitszahl beim Warmwasser": "hot water heat produced – for the hot water efficiency",
    "Füllstand in %, L oder m³ – zeigt Restmenge und Bestellhinweis": "level in %, L or m³ – shows what is left and when to order",
    "Energieinhalt – 10 kWh/L ist typisch": "energy content – 10 kWh/L is typical",
    "aus der letzten Lieferung oder dem Tankbuch": "from the last delivery or the tank log",
    "über wie viele Tage diese Liter reichten": "how many days these litres lasted",
    "optional: Stromverbrauch des ganzen Hauses in kWh": "optional: electricity use of the whole house in kWh",
    "optional: Strom aus dem Netz in kWh – mit Hausverbrauch zählt PV und Batterie Stunde für Stunde": "optional: electricity from the grid in kWh – together with house consumption, PV and battery are counted hour by hour",
    "nur ohne Hausverbrauch und Netzbezug: grobe Schätzung über den Eigenverbrauch": "only without house consumption and grid import: rough estimate via self-consumption",
    "Anteil des PV-Ertrags, der die Heizung deckt": "share of PV yield that covers the heating",
    "Anleitung: Den richtigen Zähler finden": "Guide: finding the right meter",
    "Einstellungen → Geräte & Dienste → deine Heizung öffnen (z. B. Stiebel Eltron, Vaillant, Viessmann, Shelly am Heizungszähler).": "Settings → Devices & services → open your heating system (e.g. Stiebel Eltron, Vaillant, Viessmann, a Shelly on the heating meter).",
    "Den Sensor nehmen, der „gesamt“ oder „total“ heißt und in kWh, m³ oder L zählt. Nicht „heute“ oder „letzte 24 h“ – die springen zurück.": "Pick the sensor called “total” that counts in kWh, m³ or L. Not “today” or “last 24 h” – those reset.",
    "Wärmepumpe: Strom fürs Heizen und – wenn vorhanden – die erzeugte Heizwärme. Meldet sie Warmwasser getrennt, beides auch dort eintragen; Warmwasser zählt zu den Kosten.": "Heat pump: electricity for heating and – if available – the heat produced. If it reports hot water separately, enter both there too; hot water counts towards the costs.",
    "Hausverbrauch und Netzbezug: z. B. vom Smart Meter, Energiemanager oder Wechselrichter. Damit rechnet Raumklima jede Stunde, wie viel Strom aus PV und Batterie kam.": "House consumption and grid import: e.g. from a smart meter, energy manager or inverter. Raumklima then calculates every hour how much electricity came from PV and battery.",
    "Kein Zähler? Dann unter „Berichte“ die Heizkosten pro Jahr laut Abrechnung eintragen.": "No meter? Then enter the annual heating cost from your bill under “Reports”.",
    "€/kWh oder €/m³": "€/kWh or €/m³",
    "Was kostet die kWh?": "What does a kWh cost?",
    "ein Preis für alles – Dashboard, Bericht und Vergleich rechnen gleich": "one price for everything – dashboard, report and comparison calculate the same",
    "Preis je Liter der letzten Lieferung – wird mit Datum notiert": "price per litre of the last delivery – noted with the date",
    "Preisquelle": "Price source",
    "Sensor mit dem Arbeitspreis in {u} – oder fester Preis darunter": "sensor with the energy price in {u} – or a fixed price below",
    "Reserve-Preisquellen": "Fallback price sources",
    "keine weiteren Preis-Sensoren": "no other price sensors",
    "Reihenfolge: {l}": "Order: {l}",
    "springen ein, wenn die Hauptquelle nichts liefert – z. B. EPEX Spot": "step in when the main source delivers nothing – e.g. EPEX Spot",
    "fester Preis je kWh, brutto – steht auf der Rechnung": "fixed price per kWh, gross – shown on the bill",
    "optionaler Heizöl-Marktpreis in €/L – für den Vergleich": "optional heating oil market price in €/L – for comparison",
    "monatliche Grundgebühr in €, brutto": "monthly base fee in €, gross",
    "Grundgebühr-Anteil": "Base fee share",
    "ganz": "all",
    "nach Verbrauch": "by usage",
    "ganz = eigener Wärmepumpen-Zähler; nach Verbrauch = gemeinsamer Hauszähler": "all = separate heat pump meter; by usage = shared house meter",
    "Preis wechselt stündlich – Dashboard zeigt Preiskurve und günstige Stunden": "price changes hourly – the dashboard shows the price curve and cheap hours",
    "Preis ohne Steuern und Netzentgelt?": "Price without taxes and grid fees?",
    "netto = der Sensor liefert nur den Börsen- oder Nettopreis": "net = the sensor only delivers the exchange or net price",
    "€/kWh, die im Sensor fehlen: Netzentgelt, Umlagen, Stromsteuer, Aufschlag": "€/kWh missing from the sensor: grid fee, levies, electricity tax, surcharge",
    "kommt auf Preis und Abgaben drauf": "added to price and levies",
    "Preis jetzt": "Price now",
    "aus {s}": "from {s}",
    "Ölpreis je Liter umgerechnet auf kWh": "oil price per litre converted to kWh",
    "gleicher Wert wie im Dashboard und im Bericht": "same value as in the dashboard and report",
    "Anleitung: Welcher Preis ist der richtige?": "Guide: which price is right?",
    "Am besten der Preis-Sensor deines Anbieters (z. B. 1KOMMA5°, Tibber, Octopus, Rabot): er kennt dein Netzentgelt und die MwSt – nichts weiter eintragen.": "Best: your supplier’s price sensor (e.g. 1KOMMA5°, Tibber, Octopus, Rabot): it knows your grid fee and VAT – nothing else to enter.",
    "Zweitbeste Quelle: die Integration „EPEX Spot“ aus dem Marketplace. Der Börsenpreis ist überall in Deutschland gleich; regional verschieden ist das Netzentgelt.": "Second best: the “EPEX Spot” integration from the Marketplace. The exchange price is the same across Germany; what differs by region is the grid fee.",
    "Den Sensor „Total Price“ von EPEX Spot wählen, wenn dort Aufschlag und MwSt eingetragen sind. Sonst „Market Price“ wählen und hier unter „Preis ohne Steuern und Netzentgelt?“ auf netto stellen und die Abgaben eintragen.": "Pick EPEX Spot’s “Total Price” sensor if surcharge and VAT are set there. Otherwise pick “Market Price”, set net under “Price without taxes and grid fees?” here and enter the levies.",
    "Netzentgelt finden: Netzbetreiber steht auf der Stromrechnung. Auf dessen Website „Preisblatt Netzentgelte Strom“, Zeile Haushalt / ohne Leistungsmessung, Arbeitspreis in ct/kWh.": "Finding the grid fee: the grid operator is named on your electricity bill. On its website, open the grid fee price sheet, household line without power metering, energy price in ct/kWh.",
    "Netzentgelte ändern sich jedes Jahr zum 1. Januar – dann den Wert prüfen. Eine amtliche Tabelle zum Abrufen gibt es nicht.": "Grid fees change every 1 January – check the value then. There is no official table to fetch them automatically.",
    "Mehrere Quellen: die erste ist die Hauptquelle, Reserven springen ein, wenn sie nichts liefert. Fester Arbeitspreis: Preis je kWh von der Rechnung, brutto.": "Several sources: the first is the main source, fallbacks step in when it delivers nothing. Fixed energy price: price per kWh from the bill, gross.",
    "Vergleich mit Klimagerät": "Comparison with air conditioner",
    "nur wenn ein Klimagerät auch heizen darf": "only if an air conditioner may also heat",
    "Leistungszahl beim Heizen laut Datenblatt (bei +7 °C)": "heating COP from the data sheet (at +7 °C)",
    "€/kWh brutto – die Heizung läuft nicht mit Strom, das Klimagerät schon": "€/kWh gross – the heating does not run on electricity, the air conditioner does",
    "– fester Preis –": "– fixed price –",
    "ganztägig": "all day",
    "Breite des Schaltbereichs – 0,5 K heißt: auf bei Ziel −0,25 K, zu bei Ziel +0,25 K": "width of the switching band – 0.5 K means open at target −0.25 K, closed at target +0.25 K",
    "HA-Zeitplan-Helfer (schedule.*) statt der Zeitfenster hier – z. B. einen je Plan anlegen und per Automation umschalten": "HA schedule helper (schedule.*) instead of the windows here – e.g. create one per plan and switch via automation",
    "Hysterese": "Hysteresis",
    "Hysterese (auf/zu)": "Hysteresis (open/closed)",
    "Raumklima öffnet das Ventil ganz unter Ziel − ½ Hysterese und schließt es ganz über Ziel + ½ – weniger Ventilbewegungen, etwas mehr Schwankung": "Raumklima opens the valve fully below target − ½ hysteresis and closes it fully above target + ½ – fewer valve movements, a little more fluctuation",
    "Zeitplan-Helfer": "Schedule helper",
    "eigene Zeitfenster": "own time windows",
    "– eigene Zeitfenster –": "– own time windows –",
    "keine Auswahl = der Raum gilt allen Bewohnern; auch Schalter (z. B. Gast) und Präsenz-Sensoren wählbar": "no selection = the room belongs to all residents; switches (e.g. guest) and presence sensors can be chosen too",
    "nur wenn eine dieser Personen zu Hause ist oder ein gewählter Schalter an – sonst wird der Raum abgesenkt": "only if one of these persons is home or a chosen switch is on – otherwise the room is set back",
    "„an“ im Helfer = Zeitfenster aktiv; eine Temperatur im Datenfeld des Blocks wird übernommen – die Zeitfenster oben gelten dann nicht": "“on” in the helper = window active; a temperature in the block’s data field is used – the windows above no longer apply",
    "Plan „{p}“": "Plan “{p}”",
    "Plan-Umschalter": "Plan switch",
    "ganztägig Wunschtemperatur": "wish temperature all day",
    "gerade: {p} – je Raum unter Zeitplan → Weitere Einstellungen festlegen, was in welchem Plan gilt": "now: {p} – set per room under Schedule → More settings what applies in which plan",
    "gilt gerade": "active now",
    "kein Zeitfenster (außerhalb gilt)": "no time window (outside rule applies)",
    "wie sonst": "as usual",
    "z. B. Auswahl-Helfer „Arbeitszeit / frei / krank“ – jeder Raum bekommt je Plan seinen eigenen Zeitplan": "e.g. a dropdown helper “work / off / sick” – each room gets its own schedule per plan",
    "Zähler misst": "Meter measures",
    "nur Heizung": "heating only",
    "Heizung + Warmwasser": "heating + hot water",
    "der Warmwasser-Zähler teilt dann nur auf und wird nicht dazugezählt – ideal für einen fein messenden Gesamtzähler (z. B. Energiemanager)": "the hot water meter then only splits and is not added – ideal for a finely measuring total meter (e.g. energy manager)",
    "Warmwasser kommt über den eigenen Zähler dazu": "hot water is added via its own meter",
    "Daten ab {d}": "data from {d}",
    "(Wunschtemperatur)": "(desired temperature)",
    "Außerhalb der Fenster wäre es wärmer ({v} °C) als in {n} Fenster(n) – stelle „Außerhalb“ auf „Kurz weg“ oder „Länger weg“": "Outside the windows it would be warmer ({v} °C) than in {n} window(s) – set “Outside” to “Briefly away” or “Away longer”",
    "Zeitplan: ab {u} {v} °C · bis dahin {o} °C": "Schedule: {v} °C from {u} · until then {o} °C",
    "Zeitplan: kein Fenster in den nächsten 24 h · {o} °C": "Schedule: no window in the next 24 h · {o} °C",
    "Zeitplan: {v} °C bis {u} · danach {o} °C": "Schedule: {v} °C until {u} · then {o} °C",
    "Zeitplan: {v} °C ganztägig": "Schedule: {v} °C all day",
    "im Zeitfenster gilt seine Temperatur, außerhalb {v} °C": "inside a window its temperature applies, outside {v} °C",
    "morgen {t}": "tomorrow {t}",
    "· bist du als abwesend gemeldet, gilt die Abwesenheits-Absenkung": "· when you are reported away, the away setback applies",
    "+ {k} kWh aus PV/Akku ≈ {v} € nicht bezahlt": "+ {k} kWh from PV/battery ≈ {v} € not paid",
    "Abrechnung": "bill",
    "Akku entladen": "Battery discharged",
    "Akku geladen": "Battery charged",
    "Akku geladen · davon aus dem Netz": "Battery charged · of which from the grid",
    "Akku: die beiden Gesamtzähler „geladen“ und „entladen“ (z. B. „Battery Energy In/Out“). Lädt der Akku nachts aus dem Netz, ist dieser Strom später nicht kostenlos – Raumklima rechnet ihn zum Preis beim Laden.": "Battery: the two total meters “charged” and “discharged” (e.g. “Battery Energy In/Out”). If the battery charges from the grid at night, that power is not free later – Raumklima counts it at the price when charging.",
    "Aus PV & Akku": "From PV & battery",
    "Außen °C (rechte Achse)": "Outdoor °C (right axis)",
    "Balken antippen zeigt den Tag": "tap a bar to see the day",
    "Börse Ø {v} ct/kWh": "market avg {v} ct/kWh",
    "Dynamischer Tarif gegenüber Börsen-Mittel": "Dynamic tariff vs. market average",
    "Eingespeist": "Fed in",
    "Einspeisung": "Grid feed-in",
    "Gas ({p} ct/kWh, 90 %)": "Gas ({p} ct/kWh, 90 %)",
    "Gaspreis zum Vergleich": "Gas price for comparison",
    "Grundgebühr": "Base fee",
    "Grundgebühr (anteilig)": "Base fee (share)",
    "Grundgebühr {v} € enthalten": "incl. base fee {v} €",
    "Grundlage": "Based on",
    "Günstigste 3 Stunden": "Cheapest 3 hours",
    "Haus": "House",
    "Heizung aus PV/Akku (kostenlos)": "Heating from PV/battery (free)",
    "Heizung aus dem Akku, vorher aus dem Netz geladen": "Heating from the battery, charged from the grid",
    "Heizöl ({p} €/L, 90 %)": "Heating oil ({p} €/L, 90 %)",
    "Jahr: noch zu wenig Daten": "year: not enough data yet",
    "Je 1 °C kälter": "Per 1 °C colder",
    "Kennlinie": "curve",
    "Nur günstigste Stunden genutzt (Obergrenze)": "Only cheapest hours used (upper bound)",
    "PV erzeugt": "PV produced",
    "Passgenauigkeit {p} %": "fit {p} %",
    "Strom laut Wärmepumpe": "Power according to heat pump",
    "Strompreis zum Vergleich": "Power price for comparison",
    "Ventilstunden": "valve hours",
    "Vergleichspreise": "Comparison prices",
    "Verlauf & Lernen": "History & learning",
    "Wärme erzeugt": "Heat produced",
    "Wärme gemessen seit {d}": "heat measured since {d}",
    "Wärmepumpe ({p} ct Strom, JAZ 3,5)": "Heat pump ({p} ct power, SCOP 3.5)",
    "außen": "outdoor",
    "deine Heizung": "your heating",
    "deine Wärmepumpe": "your heat pump",
    "deine Wärmepumpe (mit PV/Akku)": "your heat pump (with PV/battery)",
    "deine Wärmepumpe, nur Netzstrom": "your heat pump, grid power only",
    "ein Tag": "one day",
    "eingespeist": "fed in",
    "gemessen {v}": "measured {v}",
    "gespart": "saved",
    "günstigstes Viertel": "cheapest quarter",
    "je kWh Wärme im Haus – Vergleichspreise in den Einstellungen änderbar": "per kWh of heat in the house – comparison prices can be changed in the settings",
    "kostenlos – schon abgezogen": "free – already deducted",
    "laut Wärmepumpe {v}": "heat pump says {v}",
    "mit Vorschau": "with forecast",
    "normal": "normal",
    "optional: Gesamtzähler „Batterie entladen“ – mit beiden zählt nachts aus dem Netz geladener Akku-Strom zum Ladepreis": "optional: total meter “battery discharged” – with both, battery power charged from the grid at night counts at the charging price",
    "optional: Gesamtzähler „Batterie geladen“ in kWh": "optional: total meter “battery charged” in kWh",
    "optional: Strom fürs Heizen, wie die Wärmepumpe ihn selbst zählt – zeigt die Arbeitszahl zum Vergleich": "optional: heating power as counted by the heat pump itself – shows its efficiency for comparison",
    "optional: Strom ins Netz in kWh – zeigt, wohin der Solarstrom ging": "optional: power fed into the grid in kWh – shows where the solar power went",
    "pro Tag": "per day",
    "teuerstes Viertel": "most expensive quarter",
    "teurer": "more expensive",
    "untere Zeile: Ø Preis je Stunde": "bottom row: avg price per hour",
    "verteilt nach {m} – ohne Warmwasser und Grundgebühr": "split by {m} – without hot water and base fee",
    "viel Strom": "much power",
    "weitere ≈ {v} €": "another ≈ {v} €",
    "wenig": "little",
    "{n} Tage{r}": "{n} days{r}",
    "{p} % des bezahlten Stroms fiel in die günstigsten Stunden – gleichmäßig verteilt wären es 25 %.": "{p} % of the paid power fell into the cheapest hours – evenly spread it would be 25 %.",
    "{r}: {p} % – deutlich mehr als die anderen Räume. Ventil, Fühler oder Wunschtemperatur prüfen.": "{r}: {p} % – clearly more than the other rooms. Check valve, sensor or desired temperature.",
    "{v} kWh aus nachts geladenem Akku bezahlt": "{v} kWh from battery charged at night paid",
    "Ölpreis zum Vergleich": "Oil price for comparison",
    "≈ {v} °C Tagesmittel": "≈ {v} °C daily mean",
    "Jahr ≈ {v} € (letzte 12 Monate)": "year ≈ {v} € (last 12 months)",
    "Strom Wärmepumpe": "Heat pump power",
    "Strom Heizung": "Heating power",
    "Wohin geht das Geld?": "Where does the money go?",
    "Verbrauch pro Monat": "Consumption per month",
    "Strompreis heute & morgen": "Power price today & tomorrow",
    "Wann läuft die Wärmepumpe?": "When does the heat pump run?",
    "Wann wird geheizt?": "When is it heating?",
    "Heizkennlinie deines Hauses": "Your house’s heating curve",
    "Was kostet 1 kWh Wärme?": "What does 1 kWh of heat cost?",
    "PV & Akku": "PV & battery",
    "Was die Heizung im gewählten Zeitraum gekostet hat: jede Stunde Verbrauch × Preis dieser Stunde, Strom aus PV und Akku abgezogen, dazu der Anteil der Grundgebühr. Die Jahreszahl rechnet über die Außentemperatur hoch – oder nimmt die letzten 12 Monate des Zählers.": "What the heating cost in the chosen period: each hour’s consumption × that hour’s price, minus power from PV and battery, plus the share of the base fee. The yearly figure extrapolates via outdoor temperature – or uses the meter’s last 12 months.",
    "Wie viel Energie die Heizung verbraucht hat – bei der Wärmepumpe der Strom. Warmwasser steht getrennt dabei, wenn es einen eigenen Zähler gibt oder aus dem Gesamtzähler aufgeteilt wird.": "How much energy the heating used – for a heat pump, the electricity. Hot water is shown separately if it has its own meter or is split from the total meter.",
    "Wie viel Wärme im Haus angekommen ist – so wie die Wärmepumpe sie selbst zählt. Daraus und aus dem Strom ergibt sich die Arbeitszahl.": "How much heat reached the house – as counted by the heat pump itself. Together with the electricity this gives the efficiency.",
    "Arbeitszahl: wie viel Wärme aus 1 kWh Strom wird. 4 heißt: 1 kWh Strom → 4 kWh Wärme. Stehen zwei Werte da, zählen zwei Zähler den Strom verschieden – die Wärmepumpe rechnet selbst, ein Energiemanager misst an der Leitung. Die Wahrheit liegt meist dazwischen. Gut sind im Winter 3–4,5, beim Warmwasser 2,5–3,5.": "Efficiency (COP): how much heat 1 kWh of power makes. 4 means 1 kWh power → 4 kWh heat. Two values mean two meters count the power differently – the heat pump estimates itself, an energy manager measures on the line. The truth is usually in between. Good in winter: 3–4.5, hot water 2.5–3.5.",
    "Was du im Schnitt je kWh Netzstrom bezahlt hast – gewichtet nach dem Verbrauch jeder Stunde. Liegt der Wert unter dem Börsen-Mittel, lief die Heizung eher in günstigen Stunden.": "What you paid on average per kWh of grid power – weighted by each hour’s consumption. Below the market average means the heating tended to run in cheap hours.",
    "Aktueller Arbeitspreis je kWh, brutto – derselbe Wert, mit dem Dashboard, Bericht und Vergleich rechnen.": "Current energy price per kWh, gross – the same value used by dashboard, report and comparison.",
    "Füllstand des Öltanks und wie lange er bei deinem Verbrauch noch reicht.": "Oil tank level and how long it lasts at your consumption.",
    "Heizöl-Marktpreis der gewählten Entität im Vergleich zum 30-Tage-Mittel – grün heißt: gerade günstiger als im Schnitt.": "Heating oil market price of the chosen entity compared with the 30-day average – green means cheaper than average right now.",
    "Strom, den PV-Anlage und Akku in dieser Zeit für die Heizung geliefert haben – kostet nichts und ist bei den Kosten schon abgezogen. Hat der Akku nachts aus dem Netz geladen, zählt dieser Teil zum Ladepreis.": "Power that PV and battery delivered to the heating in this period – it is free and already deducted from the costs. If the battery charged from the grid at night, that part counts at the charging price.",
    "Wie sich die Kosten aufteilen: Heizung, Warmwasser und der Anteil der Grundgebühr. Rechts steht, was der Strom aus PV und Akku zum Börsen-Mittel gekostet hätte.": "How the costs split: heating, hot water and the share of the base fee. On the right: what the power from PV and battery would have cost at the market average.",
    "Jeder Balken ist ein Tag (ab 60 Tagen ein Monat): unten Heizung, oben Warmwasser. Die rote Linie ist die Außentemperatur – kalte Tage brauchen mehr. Antippen zeigt die Werte des Tages.": "Each bar is a day (a month from 60 days on): heating at the bottom, hot water on top. The red line is the outdoor temperature – cold days need more. Tap to see the day’s values.",
    "Strompreis der nächsten Stunden. Grün ist das günstigste Viertel, orange das teuerste. Die günstigsten drei Stunden am Stück stehen darunter – nur zur Info, Raumklima steuert die Heizung nicht.": "Power price of the coming hours. Green is the cheapest quarter, orange the most expensive. The cheapest three hours in a row are listed below – for information only, Raumklima does not control the heating.",
    "Jedes Kästchen ist eine Stunde der Woche, je kräftiger, desto mehr Verbrauch (Mittel über den Zeitraum). Die untere Zeile zeigt, wann Strom meist günstig (grün) oder teuer (orange) ist. Liegen kräftige Kästchen über Orange, lohnt sich ein Blick in die Einstellungen der Wärmepumpe.": "Each box is an hour of the week; the stronger, the more consumption (average over the period). The bottom row shows when power is usually cheap (green) or expensive (orange). Strong boxes above orange suggest a look at the heat pump settings.",
    "Jeder Punkt ist ein Tag: Verbrauch gegen Außentemperatur. Die Linie zeigt, wie viel mehr jedes Grad Kälte kostet und ab welcher Außentemperatur dein Haus nicht mehr heizen müsste. Wird sie über die Jahre flacher, wurde gedämmt oder besser eingestellt.": "Each dot is a day: consumption against outdoor temperature. The line shows how much more each degree of cold costs and above which outdoor temperature your house would no longer need heating. If it gets flatter over the years, insulation or settings improved.",
    "Was 1 kWh Wärme im Haus kostet – deine Heizung im Vergleich mit anderen Wegen. Bei der Wärmepumpe: Strompreis geteilt durch die Arbeitszahl. Vergleichspreise änderst du in den Einstellungen unter Energie.": "What 1 kWh of heat in the house costs – your heating compared with other options. For a heat pump: power price divided by efficiency. Change the comparison prices in the settings under Energy.",
    "Wohin der Solarstrom ging: in die Heizung, ins übrige Haus oder ins Netz. Mit Akku-Sensoren trennt Raumklima, welcher Akku-Strom vorher aus dem Netz geladen wurde – der ist nicht kostenlos.": "Where the solar power went: into the heating, the rest of the house or the grid. With battery sensors Raumklima separates battery power that was charged from the grid – it is not free.",
    "Die Heizkosten verteilt auf die Räume – nach Ventilöffnung × Stunden (oder Heizstunden, wenn kein Ventil meldet). Fällt ein Raum stark heraus, steht ein Hinweis darunter.": "Heating costs split across rooms – by valve opening × hours (or heating hours if no valve reports). If a room stands out strongly, a note appears below.",
    "Woher der Preis kommt: die Hauptquelle und Reserven, die einspringen, wenn sie nichts liefert. „Mit Vorschau“ heißt: die Quelle kennt auch die Preise der nächsten Stunden.": "Where the price comes from: the main source and backups that step in when it delivers nothing. “With forecast” means the source also knows the prices of the coming hours.",
    "Strom im ganzen Haus": "Electricity for the whole house",
    "übriges Haus": "rest of the house",
    "Heizung inkl. Warmwasser": "heating incl. hot water",
    "Rechnung Versorger": "Supplier bill",
    "Einspeisevergütung ({k} kWh × {p} ct)": "Feed-in tariff ({k} kWh × {p} ct)",
    "Unterm Strich": "Bottom line",
    "Pro Tag": "Per day",
    "Ø Netzstrom": "Avg grid power",
    "Selbst versorgt (PV & Akku)": "Self-supplied (PV & battery)",
    "Einspeisevergütung": "Feed-in tariff",
    "€/kWh – steht im Bescheid des Netzbetreibers; 0 = nicht abziehen": "€/kWh – as stated by your grid operator; 0 = don’t deduct",
    "Was der Strom im ganzen Haus gekostet hat – so wie es der Versorger abrechnet: jede Stunde Netzbezug × Preis dieser Stunde plus die volle Grundgebühr. Akku-Ladung aus dem Netz ist im Netzbezug enthalten. Die Einspeisevergütung wird abgezogen, wenn sie in den Einstellungen eingetragen ist.": "What electricity for the whole house cost – as the supplier bills it: each hour’s grid import × that hour’s price plus the full base fee. Battery charging from the grid is included in the import. The feed-in tariff is deducted if set in the settings.",
    "Alles aus dem Energie-Dashboard von Home Assistant ist schon eingetragen.": "Everything from the Home Assistant energy dashboard is already set.",
    "Im Energie-Dashboard von Home Assistant gefunden": "Found in the Home Assistant energy dashboard",
    "Übernommen werden nur leere Felder – deine Auswahl bleibt.": "Only empty fields are filled – your choices stay.",
    "Übernommen": "Applied",
    "leer lassen geht: wird aus Netzbezug, PV, Einspeisung und Akku errechnet": "can stay empty: calculated from grid import, PV, feed-in and battery",
    "optional: Stromverbrauch des ganzen Hauses in kWh – oder Netzbezug, PV-Ertrag und Einspeisung wählen, dann rechnet Raumklima ihn aus": "optional: power use of the whole house in kWh – or choose grid import, PV yield and feed-in and Raumklima calculates it",
    "Klimaanlage kühlt, wenn der Raum über der Kühlgrenze liegt": "Air conditioning cools when the room is above the cooling limit",
    "keine Klimaanlage": "no air conditioner",
    "Klimaanlage im Reiter „Heizquellen“ mit „Quelle hinzufügen“ eintragen – dann kann der Raum kühlen und mit der Klimaanlage heizen": "Add the air conditioner in the “Heat sources” tab with “Add source” – then the room can cool and heat with it",
    "Wärmepumpe lädt Warmwasser": "Heat pump is charging hot water",
    "Wärmepumpe taut ab": "Heat pump is defrosting",
    "Sperrzeit des Netzbetreibers": "Grid operator lock period",
    "Thermostat misst am Heizkörper schon {v} °C": "Thermostat already measures {v} °C at the radiator",
    "Ventil ist zu": "Valve is closed",
    "Raumklima schreibt die Abweichung zwischen Raumfühler und Thermostat als Korrekturwert ins Gerät – nur bei Geräten mit Kalibrier-Entität. Regelt am genauesten, der Sollwert bleibt unverändert": "Raumklima writes the difference between room sensor and thermostat into the device as a correction value – only for devices with a calibration entity. Most accurate, the setpoint stays unchanged",
    "Raumklima verschiebt den Sollwert am Thermostat um die Abweichung zwischen Raumfühler und Thermostat-Fühler – für Geräte ohne Korrekturwert (z. B. FRITZ!DECT). Regelt genau, das Ventil bewegt sich dafür öfter. Einen Korrekturwert am Gerät selbst auf 0 lassen": "Raumklima shifts the thermostat setpoint by the difference between room sensor and thermostat sensor – for devices without a correction value (e.g. FRITZ!DECT). Accurate, but the valve moves more often. Keep any correction value on the device itself at 0",
    "Raumklima schreibt den Sollwert 1:1 – richtig ohne Raumfühler oder wenn Thermostat und Raumfühler sauber übereinstimmen. Mit Raumfühler am Heizkörper-Thermostat meist zu kalt, weil das Thermostat am warmen Heizkörper misst": "Raumklima writes the setpoint 1:1 – right without a room sensor or when thermostat and room sensor agree. With a room sensor usually too cold, because the thermostat measures at the warm radiator",
    "Raumklima öffnet das Ventil ganz unter Ziel − ½ Hysterese und schließt es ganz über Ziel + ½ – nach dem Raumfühler, nicht nach dem Thermostat. Wählen, wenn ein Thermostat trotz Ausgleich zu früh schließt oder dauernd nachregelt: weniger Ventilbewegungen und Batterie, dafür etwas mehr Schwankung. Braucht einen Raumfühler": "Raumklima opens the valve fully below target − ½ hysteresis and closes it fully above target + ½ – based on the room sensor, not the thermostat. Choose it when a thermostat closes too early or keeps readjusting despite compensation: fewer valve movements and less battery, slightly more fluctuation. Needs a room sensor",
    "„Offset am Thermostat“ erscheint nur bei Geräten mit Kalibrier-Entität": "“Offset on thermostat” only appears for devices with a calibration entity",
    "Lampe/Steckdose hinzufügen": "Add lamp/socket",
    "Lampen und Steckdosen zählen als Anwesenheit": "Lamps and sockets count as presence",
    "eingeschaltet heißt: jemand ist im Raum (z. B. Schreibtischlampe, PC-Steckdose) – zählt nur für diesen Raum, nie für „jemand zu Hause“": "switched on means: someone is in the room (e.g. desk lamp, PC socket) – counts only for this room, never for “someone at home”",
    "eigener Schalter für dieses Büro (z. B. input_boolean je Büro) – dann folgt der Raum nur diesem Schalter, nicht mehr dem allgemeinen Homeoffice": "own switch for this office (e.g. one input_boolean per office) – the room then follows only this switch, no longer the general home office",
    "Anmeldung am Server": "Login to server",
    "„ohne“ nur für Mailserver im eigenen Netz, die ohne Anmeldung annehmen (z. B. Spamfilter auf Port 25)": "“without” only for mail servers in your own network that accept mail without login (e.g. spam filter on port 25)",
    "mit Benutzer/Passwort": "with user/password",
    "ohne": "without",
    "nötig ohne Anmeldung – viele Server lehnen Mails ohne Absender ab": "required without login – many servers reject mail without a sender",
    "Anwesenheit erkennen über": "Detect presence via",
    "GPS und WLAN": "GPS and Wi-Fi",
    "nur GPS": "GPS only",
    "nur WLAN": "Wi-Fi only",
    "WLAN/Router kennt nur „zu Hause“ oder „weg“ – Entfernung und Vorheizen auf der Heimfahrt gehen nur mit GPS": "Wi-Fi/router only knows “home” or “away” – distance and preheating on the way home need GPS",
    "da (WLAN)": "home (Wi-Fi)",
    "da (GPS)": "home (GPS)",
    "Weitere Räume": "Other rooms",
    "Neue Übersicht testen (Beta)": "Try new overview (beta)",
    "nach Stockwerk gruppieren": "group by floor",
    "ordnet Übersicht und Raumkarten nach den Stockwerken aus Home Assistant (Einstellungen → Bereiche → Stockwerke) – Räume ohne Stockwerk stehen unter „Weitere Räume“. Ausschalten stellt die bisherige Ansicht wieder her.": "groups the overview and room cards by the floors from Home Assistant (Settings → Areas → Floors) – rooms without a floor appear under “Other rooms”. Turning it off restores the previous view.",
    "Eigener Homeoffice-Schalter": "Own home office switch",
    "Schalter oder Helfer (z. B. input_boolean „Büro Anna“) – ist er an, heizt dieser Raum wie im Homeoffice. Der Raum folgt dann nicht mehr dem allgemeinen Homeoffice. Für „jemand ist im Raum“ (z. B. „Gast belegt“) passt besser „Melder/Gerät hinzufügen“ oben.": "Switch or helper (e.g. input_boolean “Office Anna”) – when on, this room heats like during home office. The room then no longer follows the general home office. For “someone is in the room” (e.g. “guest room occupied”) use “Add sensor/device” above.",
    "belegt – „{n}“ ist an": "occupied – “{n}” is on",
    "nicht belegt – „{n}“ ist aus, Raum wird abgesenkt": "not occupied – “{n}” is off, room is set back",
    "keine Melder eingetragen": "no sensors set up",
    "aus Meldern, Lampen und den Schaltern unter „Gilt für Personen“": "from sensors, lamps and the switches under “Applies to people”",
    "„{n}“ ist an": "“{n}” is on",
    "„{n}“ ist aus – Raum wird abgesenkt": "“{n}” is off – room is set back",
    "Raum leer": "Room empty",
    "Fremdwärme (Kamin/Holzofen)": "External heat (fireplace/stove)",
    "Schalter, Helfer oder Binärsensor „Ofen brennt“ – solange er an ist, bleiben die Thermostate in diesem Raum zu, Raumklima meldet nichts zu „zu warm“ und lernt nicht": "Switch, helper or binary sensor “stove burning” – while it is on, the thermostats in this room stay closed, Raumklima reports no “too warm” and does not learn",
    "… Nachlauf": "… after-run",
    "so lange nach dem Ausgehen gilt der Ofen noch – er wärmt nach": "the stove still counts this long after it goes out – it keeps radiating heat",
    "Kamin/Holzofen heizt": "Fireplace/stove heating",
    "Kamin/Holzofen": "Fireplace/stove",
    "Boost läuft ohne Zeitlimit": "Boost running without time limit",
    "Boost läuft noch {m} min": "Boost running, {m} min left",
    "Noch nicht gestartet – Dauer wählen": "Not started yet – choose a duration",
    "Assistent schließen": "Close assistant",
    "Tippen: nur dieser Raum · lang drücken: dazu/weg": "Tap: only this room · long press: add/remove",
    "Alle": "All",
    "Handverstellt · zurück auf {t} °C": "Adjusted by hand · back to {t} °C",
    "Der Wunsch weicht vom Grundwert aus den Einstellungen ab (z. B. am Thermostat gedreht).": "The target differs from the base value in the settings (e.g. turned at the thermostat).",
    "Korrektur Raumfühler": "Room sensor correction",
    "Zeigt der Fühler zu wenig oder zu viel an, hier ausgleichen: zeigt er 21,5 °C, sind es aber 22,2 °C, dann +0,7 K. Raumklima rechnet überall mit dem korrigierten Wert.": "If the sensor reads too low or too high, correct it here: it shows 21.5 °C but it is 22.2 °C → +0.7 K. Raumklima uses the corrected value everywhere.",
    "Fester Sollwert": "Fixed setpoint",
    "gerade: {m}": "currently: {m}",
    "Aus-Sollwert": "Off setpoint",
    "Dieser Sollwert gilt, wenn der Raum aus ist – z. B. 16 °C für eine ganze Heizanlage statt der Gerätegrenze": "This setpoint applies while the room is off – e.g. 16 °C for a whole heating system instead of the device limit",
    "Betriebsart nie umschalten": "Never change the operating mode",
    "Raumklima schreibt nur noch Sollwerte und stellt nie Modus oder Preset um – für eine Anlage, die das ganze Haus heizt (z. B. ViCare). Ausschalten dann über Minimaltemperatur oder festen Sollwert.": "Raumklima only writes setpoints and never changes mode or preset – for a system heating the whole house (e.g. ViCare). Switching off then uses the minimum temperature or a fixed setpoint.",
    "Ventil ≈": "Valve ≈",
    "geschätzt": "estimated",
    "misst gerade {raw} °C → mit Korrektur {cor} °C": "reads {raw} °C right now → {cor} °C with correction",
    "Heizt noch nicht": "Not heating yet",
    "Gerät heizt – Raum schon warm": "Device heating – room already warm",
    "Raumklima nimmt den Sollwert am Thermostat zurück": "Raumklima is lowering the setpoint on the thermostat",
    "Volle Breite testen (Beta)": "Try full width (beta)",
    "volle Breite": "full width",
    "Einstellungen, Bericht, Protokoll und Energie nutzen die ganze Bildschirmbreite – hilft auf Klapp-Handys und Tablets im Hochformat, wo Home Assistant sonst nur eine schmale Spalte zeigt. Gilt im generierten Dashboard nach dem Neuladen der Seite; ausschalten stellt die bisherige Ansicht wieder her.": "Settings, report, log and energy use the full screen width – helps on foldables and tablets in portrait, where Home Assistant otherwise shows only one narrow column. Applies to the generated dashboard after reloading the page; switching it off restores the previous view.",
    "+ weitere Personen ({n})": "+ more people ({n})",
    "nur Bewohner zeigen": "show residents only",
    "Tippen zum Aus-/Abwählen. Zählt, sobald eins ihrer Handys in der Zone ist. Nicht gewählte Personen (z. B. admin) werden ausgeblendet und auch sonst nirgends angeboten.": "Tap to select/deselect. Counts as soon as one of their phones is in the zone. People not selected (e.g. admin) are hidden and not offered anywhere else."
  };

  // src/i18n/fr.js
  var FR = {
    "Kalender – jetzt": "Calendrier – maintenant",
    "Kalender – als Nächstes": "Calendrier – suivant",
    "kein Einfluss": "sans effet",
    "kein Termin": "aucun rendez-vous",
    "Als Nächstes": "Suivant",
    "Übersicht": "Vue d’ensemble",
    "Regelung": "Régulation",
    "Fenster & Lüften": "Fenêtres & aération",
    "Präsenz": "Présence",
    "Geräte & Sensoren": "Appareils & capteurs",
    "Meldungen": "Messages",
    "Lernen & Verlauf": "Apprentissage & historique",
    "Schnellzugriff": "Accès rapide",
    "Abweichungen": "Écarts",
    "Ziel": "Consigne",
    "gemessen im Raum": "mesuré dans la pièce",
    "was die Automatik gerade anstrebt": "ce que l’automatisation vise actuellement",
    "{n} angelegt": "{n} configuré(s)",
    "{n} Quellen": "{n} sources",
    "alle zu": "toutes fermées",
    "{n} offen": "{n} ouvertes",
    "{n} Warnungen": "{n} avertissements",
    "{h} % Feuchte": "{h} % d’humidité",
    "unter „Regelung“ und den anderen Unterseiten änderbar": "modifiable sous « Régulation » et les autres sous-pages",
    "Herkunft": "Origine",
    "Gerät": "Appareil",
    "Für alle Räume übernehmen": "Appliquer à toutes les pièces",
    "Keine sicheren Werte zum Übernehmen": "Aucune valeur sûre à appliquer",
    "Keine weiteren Räume": "Aucune autre pièce",
    "{n} sichere Werte auf {m} Räume übernehmen?": "Appliquer {n} valeurs sûres à {m} pièces ?",
    "{n} Räume übernommen": "{n} pièces mises à jour",
    "Standard": "Standard",
    "Einstellungen durchsuchen …": "Rechercher dans les réglages …",
    "Einstellungen durchsuchen": "Rechercher dans les réglages",
    "Suche": "Recherche",
    "öffnen": "ouvrir",
    "dorthin springen": "y accéder",
    "zum Raum springen": "aller à la pièce",
    "Einstellungen → Wohnung": "Réglages → Logement",
    "Raum kopieren": "Copier la pièce",
    "Zielraum": "Pièce cible",
    "Zielraum wählen. Kopiert werden nur sichere Werte – keine Entitäten, Zeitpläne oder Raumzuordnung.": "Choisir une pièce cible. Seules les valeurs sûres sont copiées – ni entités, ni plannings, ni affectation de pièce.",
    "Kein weiterer Raum in dieser Wohnung.": "Aucune autre pièce dans ce logement.",
    "Keine sicheren Werte zum Kopieren": "Aucune valeur sûre à copier",
    "Raum kopiert": "Pièce copiée",
    "Schnell-Override": "Override rapide",
    "2 Stunden": "2 heures",
    "4 Stunden": "4 heures",
    "8 Stunden": "8 heures",
    "Party": "Fête",
    "aktiv bis {t}": "actif jusqu’à {t}",
    "Schnell-Override gesetzt": "Override rapide défini",
    "wärmt kurzzeitig über den Zeitplan hinaus": "chauffe brièvement au-delà du planning",
    "Selbsttest": "Auto-test",
    "Prüft Wohnung, Räume, Thermostate, Fühler und Erreichbarkeit": "Vérifie logement, pièces, thermostats, capteurs et disponibilité",
    "Die Prüfung ist nur lesend. Bei Fehlern steht der betroffene Raum oder die Entität dabei.": "La vérification est en lecture seule. En cas d’erreur, la pièce ou l’entité concernée est indiquée.",
    "Keine Prüfungen": "Aucune vérification",
    "Wohnung eingerichtet": "Logement configuré",
    "Räume vorhanden": "Pièces présentes",
    "Thermostat je Raum": "Thermostat par pièce",
    "Entitäten erreichbar": "Entités joignables",
    "Vorlagen": "Modèles",
    "Name der Vorlage": "Nom du modèle",
    "Aus diesem Raum speichern": "Enregistrer depuis cette pièce",
    "Vorlage gespeichert": "Modèle enregistré",
    "Vorlage angewendet": "Modèle appliqué",
    "Vorlage gelöscht": "Modèle supprimé",
    "Vorlage „{n}“ löschen?": "Supprimer le modèle « {n} » ?",
    "Name fehlt": "Nom manquant",
    "löschen": "supprimer",
    "Wärmebilanz": "Bilan thermique",
    "Aufheizen +2 K": "Montée +2 K",
    "lernt noch": "apprentissage en cours",
    "schnelle Einordnung – keine neue Regel": "orientation rapide – aucune nouvelle règle",
    "Kühlen": "Refroidissement",
    "Kühlgrenze": "Limite de refroidissement",
    "Klimaanlage zum Heizen": "Utiliser la climatisation pour chauffer",
    "gerade aktiv – günstiger als Gas": "active – moins cher que le gaz",
    "nutzt die Klimaanlage nur, wenn COP und Gaspreis günstiger sind": "n’utilise la climatisation que si le COP et le prix du gaz sont plus avantageux",
    "COP": "COP",
    "Jahresarbeitszahl der Klimaanlage als Wärmepumpe – 3 ist ein typischer Richtwert": "coefficient de performance annuel de la climatisation comme pompe à chaleur – 3 est une valeur typique",
    "Gaspreis": "Prix du gaz",
    "€/kWh – nur für den Vergleich „Klimaanlage oder Gas“": "€/kWh – seulement pour la comparaison « climatisation ou gaz »",
    "Strompreis": "Prix de l’électricité",
    "€/kWh – der Zähler misst Gas/Fernwärme; für „Klimaanlage oder Gas“ und günstiges Vorheizen": "€/kWh – le compteur mesure le gaz/réseau de chaleur ; pour « climatisation ou gaz » et le préchauffage bon marché",
    "Mindestlaufzeit": "Durée de marche minimale",
    "Mindestpause": "Pause minimale",
    "so lange bleibt die Klimaanlage mindestens an – gegen Takten": "la climatisation reste allumée au moins ce temps – évite les cycles courts",
    "so lange bleibt sie nach dem Ausgehen mindestens aus": "elle reste éteinte au moins ce temps après l’arrêt",
    "oberhalb dieser Temperatur kühlt die Klimaanlage": "au-delà de cette température, la climatisation refroidit",
    "Energie & Lernen": "Énergie et apprentissage",
    "Energie-Erfassung": "Suivi énergétique",
    "dynamisch": "dynamique",
    "{n} kWh Überschuss": "{n} kWh de surplus",
    "PV-Überschuss": "Surplus PV",
    "startet bis zu 60 min vor einem Zeitfenster, wenn der aktuelle Preis unter der Grenze liegt": "démarre jusqu’à 60 min avant une plage horaire si le prix actuel est sous la limite",
    "Dynamischer Tarif": "Tarif dynamique",
    "der Tarif-Sensor liefert einen wechselnden Preis – die Karte zeigt ihn; die Kostenschätzung nutzt den aktuellen Wert": "le capteur de tarif fournit un prix variable – la carte l’affiche ; l’estimation des coûts utilise la valeur actuelle",
    "Preisgrenze": "Limite de prix",
    "bis zu diesem Preis gilt Strom als günstig": "l’électricité est considérée comme bon marché jusqu’à ce prix",
    "Bei günstigem Strom vorheizen": "Préchauffer en cas d’électricité bon marché",
    "startet bis zu 60 min vor einem Zeitfenster, wenn der aktuellen Preis unter der Grenze liegt": "démarre jusqu’à 60 min avant une plage horaire si le prix actuel est sous la limite",
    "Energiequelle": "Source d’énergie",
    "Gas-Umrechnung": "Conversion du gaz",
    "Jahresarbeitszahl": "COP saisonnier",
    "PV-Eigenverbrauch": "Autoconsommation PV",
    "Wärmemenge": "Chaleur produite",
    "Preis pro kWh in € – gilt, wenn kein Tarif-Sensor gewählt ist": "Prix par kWh en € – utilisé si aucun capteur de tarif n’est sélectionné",
    "kWh je m³ – Brennwert × Zustandszahl; 10 ist ein typischer Näherungswert": "kWh par m³ – pouvoir calorifique × facteur de correction ; 10 est une approximation typique",
    "optionaler Wärmezähler der Wärmepumpe – sonst zählt nur der Strom": "compteur de chaleur optionnel de la pompe à chaleur – sinon seul l’électricité est compté",
    "optional: Wärme je kWh Strom (JAZ); 0 = unbekannt": "optionnel : chaleur par kWh d’électricité (COP) ; 0 = inconnu",
    "Anteil des PV-Ertrags, der den Verbrauch deckt – nur bei Gesamtverbrauchszähler": "part du rendement PV couvrant la consommation – uniquement avec un compteur de consommation totale",
    "bestimmt, wie der Zähler umgerechnet und welcher Tarif erwartet wird": "détermine la conversion du compteur et le tarif attendu",
    "Strom-, Gas- oder Wärmezähler – wird beim PDF-Bericht ausgewertet": "compteur d’électricité, de gaz ou de chaleur – évalué pour le rapport PDF",
    "Arbeitspreis-Sensor in €/kWh, ct/kWh oder €/m³ – optional, sonst gilt der feste Preis": "capteur de prix en €/kWh, ct/kWh ou €/m³ – optionnel, sinon le prix fixe s’applique",
    "PV-Erzeugung in kWh – optional, nur für den Eigenverbrauch bei Strom und Wärmepumpe": "production PV en kWh – optionnel, uniquement pour l’autoconsommation avec électricité et pompe à chaleur",
    "Gas": "Gaz",
    "Wärmepumpe": "Pompe à chaleur",
    "Fernwärme": "Chauffage urbain",
    "Strom": "Électricité",
    "Zuhause": "À la maison",
    "unterwegs": "En déplacement",
    "Zähler": "Compteur",
    "Tarif": "Tarif",
    "PV-Ertrag": "Rendement PV",
    "MwSt.": "TVA",
    "Preisbasis": "Base de prix",
    "Zusätzliche Abgaben": "Charges supplémentaires",
    "aktuell {v}": "actuel {v}",
    "brutto": "brut",
    "brutto = inkl. MwSt./Netzentgelte; netto = der Sensor liefert den Nettopreis": "brut = TVA/charges réseau incluses ; net = le capteur fournit le prix net",
    "netto": "net",
    "nur bei netto – wird auf den Nettopreis addiert": "uniquement en net – ajouté au prix net",
    "€/kWh – z. B. Netzentgelte, die der Sensor nicht enthält": "€/kWh – p. ex. charges réseau non incluses dans le capteur",
    "Aktuell": "Actuel",
    "Böen ab dieser Stärke": "Rafales à partir de cette force",
    "Entitäten": "Entités",
    "Home Assistant": "Home Assistant",
    "Integration": "Intégration",
    "Nächste Stunden": "Prochaines heures",
    "Offene Hinweise": "Remarques ouvertes",
    "Python": "Python",
    "Raumklima-Räume": "Pièces Raumklima",
    "Sturm": "Tempête",
    "Vorhersage unter diesem Wert": "prévision sous cette valeur",
    "Wetter-Entität in den Einstellungen wählen": "choisir une entité météo dans les réglages",
    "Wind": "Vent",
    "Zeitzone": "Fuseau horaire",
    "alle Entitäten in Home Assistant": "toutes les entités dans Home Assistant",
    "aus der Wettervorhersage": "de la prévision météo",
    "darunter gilt die Heizsaison": "en dessous, la saison de chauffe s’applique",
    "für die Verschattung und die Sonnenprognose": "pour l’ombrage et la prévision solaire",
    "gefühlte Temperatur": "température ressentie",
    "gefühlt {v} °C": "ressenti {v} °C",
    "Grundpreis": "Frais fixes",
    "Arbeitspreis": "Prix de l’énergie",
    "Energiezähler und Tarife auswerten – Voraussetzung für die Euro-Schätzung im Bericht": "Analyser compteurs, tarifs et rendement PV – prérequis pour l’estimation en euros dans le rapport",
    "Strom- oder Gaszähler – liefert den Verbrauch für die Schätzung": "Compteur électrique ou gaz – fournit la consommation pour l’estimation",
    "Arbeitspreis und Grundgebühr – optional, sonst nur kWh": "Prix de l’énergie et frais fixes – optionnel, sinon kWh uniquement",
    "PV-Ertrag oder Einspeisung – für die Eigenverbrauchs-Schätzung": "Rendement PV ou injection – pour l’estimation de l’autoconsommation",
    "monatliche Grundgebühr in €": "frais fixes mensuels en €",
    "Preis pro kWh in €": "prix par kWh en €",
    "Präsenzstatus": "Statut de présence",
    "belegt": "occupé",
    "aus Meldern und Lampen; Anwesenheits-Temperatur gilt, solange jemand im Raum ist": "d’après les capteurs et les lampes ; la température de présence s’applique tant que quelqu’un est dans la pièce",
    "Boost für": "Boost pour",
    "Heizquellen": "Sources de chaleur",
    "Klimaanlage": "Climatiseur",
    "Quelle hinzufügen": "Ajouter une source",
    "Bitte zuerst eine Quelle auswählen": "Veuillez d’abord choisir une source",
    "Quellen": "Sources",
    "Thermostate oder Klimaanlagen, die mit dem Raum laufen": "Thermostats ou climatiseurs qui fonctionnent avec la pièce",
    "Weitere Quellen": "Autres sources",
    "alle Quellen": "toutes les sources",
    "alle Quellen – antippen schließt eine aus": "toutes les sources – toucher pour en exclure une",
    "fest für diese Quelle – z. B. +0,5 K, damit sie früher anläuft": "fixe pour cette source – p. ex. +0,5 K pour qu’elle démarre plus tôt",
    "führt den Raum; die anderen Quellen folgen der Auswahl": "dirige la pièce ; les autres sources suivent la sélection",
    "im Zeitplan gewählt": "choisi dans la plage horaire",
    "nur die gewählten Quellen": "uniquement les sources choisies",
    "nur die priorisierte": "uniquement la source prioritaire",
    "unangetastet": "sans intervention",
    "welche Quellen der Boost ansteuert – die anderen bleiben in diesem Moment aus": "quelles sources le boost pilote – les autres restent éteintes pendant ce temps",
    "… Offset": "… offset",
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
    "Zeitplan fortsetzen": "Reprendre le programme",
    "Wunschtemperatur fortsetzen": "Reprendre la température souhaitée",
    "Zeitplan": "Planning",
    "Zeitfenster {n}": "Plage horaire {n}",
    "Zeitfenster hinzufügen": "Ajouter une plage horaire",
    "Zeitfenster": "Plage horaire",
    "Wärmer für kurze Zeit (Boost)": "Plus chaud un moment (boost)",
    "Wärmer für kurze Zeit": "Plus chaud un moment",
    "Homeoffice-Entität": "Entité de télétravail",
    "eigener Schalter für dieses Büro – z. B. eine input_boolean, die nur für diesen Raum Homeoffice meldet": "interrupteur propre à ce bureau – p. ex. une input_boolean qui signale le télétravail uniquement pour cette pièce",
    "Raumklima schreibt den Sollwert 1:1 – nur sinnvoll, wenn Thermostat und Raumfühler sauber übereinstimmen": "Raumklima écrit la consigne 1:1 – utile seulement si le thermostat et la sonde de pièce concordent",
    "Boost beenden": "Terminer le boost",
    "{n} Dashboard(s) für deine Wohnungen angelegt": "{n} tableau(x) de bord créé(s) pour tes logements",
    "– keiner –": "– aucun –",
    "gerade: „{s}“": "en cours : « {s} »",
    "Arbeitspreis-Sensor in €/kWh, ct/kWh, €/m³ oder €/L – optional, sonst gilt der feste Preis": "Capteur de prix en €/kWh, ct/kWh, €/m³ ou €/L – facultatif, sinon le prix fixe s’applique",
    "Auch in": "Aussi dans",
    "Letzter Winter": "Dernier hiver",
    "Ø Verbrauch": "Consommation Ø",
    "Letzter Winter (Liter)": "Dernier hiver (litres)",
    "Letzter Winter (Tage)": "Dernier hiver (jours)",
    "Preisverlauf": "Historique des prix",
    "noch kein Preis geändert": "aucun prix modifié pour l’instant",
    "wird beim Ändern des Ölpreises automatisch notiert": "noté automatiquement lors du changement du prix du fioul",
    "Liter aus dem letzten Winter – für die grobe Planung": "litres du dernier hiver – pour une planification approximative",
    "Zeitraum des letzten Winters": "période du dernier hiver",
    "Marktpreis-Entität": "Entité de prix du marché",
    "optionaler Börsen-/Marktpreis in €/L – für den Vergleich": "prix boursier/du marché facultatif en €/L – pour comparaison",
    "Marktpreis": "Prix du marché",
    "Markt vs. deinem Preis": "Marché vs votre prix",
    "30-Tage-Ø {v} €/L": "moy. 30 j {v} €/L",
    "Markt": "Marché",
    "Noch kein Zähler, Tank oder Marktpreis gewählt. In den Einstellungen unter „Heizung & Energie“ eine Quelle auswählen.": "Aucun compteur, réservoir ou prix de marché sélectionné. Choisissez une source sous Réglages → Chauffage & énergie.",
    "Suchen …": "Rechercher …",
    "Bei Wärmepumpe den Stromzähler der WP wählen; Wärmemenge separat. Keine Tages-/Wochenwerte mit Reset.": "Pour une pompe à chaleur, choisissez le compteur électrique de la PAC ; la chaleur produite va dans son propre champ. Pas de valeurs journalières/hebdomadaires qui se réinitialisent.",
    "PV-Erzeugung in kWh – Gesamtzähler ohne Reset; optional für den Eigenverbrauch bei Strom und Wärmepumpe": "Rendement PV en kWh – compteur cumulé sans remise à zéro ; facultatif pour l’autoconsommation avec l’électricité et la pompe à chaleur.",
    "Heizöl": "Fioul",
    "Ölpreis": "Prix du fioul",
    "Preis je Liter Heizöl – wird für die Kosten und den Tank genutzt": "Prix du litre de fioul – utilisé pour les coûts et le réservoir",
    "kWh je Liter": "kWh par litre",
    "Energieinhalt von einem Liter Heizöl; 10 kWh/L ist ein typischer Wert": "Contenu énergétique d’un litre de fioul ; 10 kWh/L est une valeur typique",
    "Tankfüllstand": "Niveau du réservoir",
    "optionaler Füllstand in %, L oder m³ – zeigt Restmenge und Bestellhinweis": "niveau facultatif en %, L ou m³ – affiche la quantité restante et le rappel de commande",
    "Tankinhalt": "Capacité du réservoir",
    "Nenninhalt in Litern – nötig, wenn der Fühler Prozent meldet": "capacité nominale en litres – nécessaire si le capteur indique un pourcentage",
    "Öl bestellen ab": "Commander le fioul sous",
    "Restmenge in Prozent – darunter erscheint der Bestellhinweis": "quantité restante en pourcentage – en dessous, le rappel de commande apparaît",
    "Strom-, Gas-, Öl- oder Wärmezähler – wird beim PDF-Bericht ausgewertet": "compteur d’électricité, de gaz, de fioul ou de chaleur – évalué pour le rapport PDF",
    "Noch kein Zähler oder Tank gewählt. In den Einstellungen unter „Heizung & Energie“ einen Strom-, Gas-, Öl- oder Wärmezähler auswählen.": "Aucun compteur ou réservoir sélectionné. Choisissez un compteur d’électricité, de gaz, de fioul ou de chaleur dans les réglages sous « Chauffage & énergie ».",
    "reicht noch ~{d} Tage": "dure encore environ {d} jours",
    "Tank": "Réservoir",
    "Tankverbrauch": "Consommation du réservoir",
    "Reicht noch": "Dure encore",
    "Ölbestellung": "Commande de fioul",
    "jetzt bestellen": "commander maintenant",
    "noch Zeit": "encore le temps",
    "Schwelle {v} L": "seuil {v} L",
    "Schulferien-Kalender": "Calendrier des vacances scolaires",
    "Entfeuchter": "Déshumidificateur",
    "Entfeuchter läuft": "Le déshumidificateur tourne",
    "Entfeuchter läuft ohne Besserung": "Le déshumidificateur tourne sans amélioration",
    "Entfeuchter an ab": "Déshumidificateur marche à",
    "Entfeuchter aus unter": "Déshumidificateur arrêt sous",
    "Einschaltverzögerung": "Délai de démarrage",
    "Strommessung (W)": "Mesure de puissance (W)",
    "Stromzähler (kWh)": "Compteur d’énergie (kWh)",
    "Leistung gerade": "Puissance actuelle",
    "Verbrauch gesamt": "Consommation totale",
    "Starts": "Démarrages",
    "Laufzeit gesamt": "Durée de marche totale",
    "sofort": "immédiatement",
    "schaltet nach den eigenen Schwellen – nicht bei offenem Fenster": "commute selon ses propres seuils – pas lorsqu’une fenêtre est ouverte",
    "läuft gerade": "en marche",
    "läuft zu lange ohne Besserung – Heizung schützt weiter": "tourne trop longtemps sans amélioration – le chauffage continue de protéger",
    "an ab Feuchtegrenze, aus 5 % darunter – nicht bei offenem Fenster": "en marche au seuil d’humidité, arrêt 5 % en dessous – pas fenêtre ouverte",
    "an Ferientagen starten Morgen-Zeitfenster später": "les jours de vacances, les plages du matin commencent plus tard",
    "Morgens später": "Plus tard le matin",
    "nur Zeitfenster, die vor 12:00 beginnen – 0 = aus": "uniquement les plages commençant avant 12:00 – 0 = désactivé",
    "Schulferien – jetzt": "Vacances scolaires – maintenant",
    "keine Schulferien": "pas de vacances scolaires",
    "morgens {n} min später": "le matin {n} min plus tard",
    "keine Verschiebung": "aucun décalage",
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
    "Fenster geschlossen": "Fenêtre fermée",
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
    "Raumklima – Raum kompakt": "Raumklima – Pièce compacte",
    "Kompakte Raumkarte mit Ist, Ziel und schneller Regelung": "Carte compacte avec température actuelle, cible et réglage rapide",
    "Raumklima – Verlauf": "Raumklima – Historique",
    "Raumklima – Übersicht": "Raumklima – Aperçu",
    "Raumtemperatur": "Température de la pièce",
    "Raumtyp": "Type de pièce",
    "Gespeicherte Werte": "Valeurs enregistrées",
    "CO₂-Grenze · Hinweise pro Tag · Meldetakt des Thermostats": "Limite CO₂ · notifications par jour · intervalle de rapport du thermostat",
    "Ruhezeit": "Heures calmes",
    "Ruhezeit gerade aktiv": "Heures calmes actives",
    "Ruhezeit wirksam": "Heures calmes effectives",
    "Raum hinzufügen": "Ajouter une pièce",
    "Nur messen": "Surveillance seulement",
    "Name des neuen Raums": "Nom de la nouvelle pièce",
    "Raum löschen": "Supprimer la pièce",
    "Raum wirklich löschen? Einstellungen, Zeitpläne und Verlauf dieses Raums werden entfernt.": "Supprimer cette pièce ? Ses réglages, programmes et historique seront supprimés.",
    "Raum gelöscht": "Pièce supprimée",
    "Name und Temperaturfühler wählen": "Choisir un nom et un capteur de température",
    "Raum „{n}“ angelegt": "Pièce « {n} » créée",
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
    "Schimmelschutz hält {v}° (statt {u}°)": "La protection anti-moisissure maintient {v}° (au lieu de {u}°)",
    "Schimmelschutz hält {v}°": "La protection anti-moisissure maintient {v}°",
    "Wartet auf Wärme": "En attente de chaleur",
    "Wartet": "En attente",
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
    "Wohnungen je Empfänger": "Logements par destinataire",
    "alle Wohnungen": "tous les logements",
    "keine Wohnung": "aucun logement",
    "{n} von {m} Wohnungen": "{n} sur {m} logements",
    "Ein Häkchen heißt: Diese Person bekommt die Meldungen dieser Wohnung. Welche Arten (Lüften, Frost, Bericht …) sie bekommt, steht in den Benachrichtigungen der jeweiligen Wohnung – hier oben für die aktuelle Wohnung.": "Une coche signifie que cette personne reçoit les messages de ce logement. Les types (aérer, gel, rapport …) se règlent dans les notifications du logement concerné – ci-dessus pour le logement actuel.",
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
    "Melder/Gerät hinzufügen": "Ajouter un capteur/appareil",
    "Melder oder Gerät hinzufügen (z. B. PC/Lampe) – dann kann der Raum bei Anwesenheit wärmer werden": "Ajouter un capteur/appareil (p. ex. PC/lampe) – la pièce peut alors chauffer en cas de présence",
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
    "SMTP-Bericht": "Rapport SMTP",
    "versendet den PDF-Bericht über Home Assistants SMTP-Integration statt über den eigenen Mail-Client": "envoie le rapport PDF via l’intégration SMTP de Home Assistant au lieu du client mail intégré",
    "– HA-SMTP wählen –": "– choisir SMTP HA –",
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
    "Alle verfügbaren gewählt": "Tous les disponibles sélectionnés",
    "Keine freien Thermostate – bitte „Nur messen“ wählen.": "Aucun thermostat libre – veuillez choisir « Surveillance seulement ».",
    "Keine freien Temperaturfühler – bitte einen bestehenden Messraum entfernen oder „Thermostat“ wählen.": "Aucun capteur de température libre – supprimez une pièce de surveillance ou choisissez « Thermostat ».",
    "Keine weiteren verfügbar": "Aucun autre disponible",
    "Hinzufügen": "Ajouter",
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
    "mittlere Karte": "Carte moyenne",
    "lädt …": "chargement …",
    "Reihenfolge gilt im generierten Dashboard und in der Übersicht; „große Karte“ zeigt die volle Raumseite, „mittlere Karte“ die kompakte Raumkarte, „Kachel“ nur die Übersicht, „aus“ versteckt den Raum ganz. Farbe färbt Rand und Akzente der Karte.": "L’ordre s’applique au tableau de bord généré et à l’aperçu ; « Grande carte » affiche la page complète de la pièce, « Carte moyenne » la carte compacte, « Tuile » uniquement l’aperçu, « désactivé » masque complètement la pièce. La couleur colore le bord et les accents de la carte.",
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
    "Debug-Protokoll": "Journal de débogage",
    "DEBUG-Zeilen für die Diagnose mitschreiben; auf eMMC kann das Log groß werden": "Écrire les lignes DEBUG dans le diagnostic ; sur eMMC, le journal peut devenir volumineux",
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
    "Abbrechen": "Annuler",
    "Abschließen": "Terminer",
    "Bitte {f} ausfüllen": "Veuillez remplir {f}",
    "Einrichtung abgeschlossen": "Configuration terminée",
    "Einstellungen übernommen – kein Raum angelegt (Thermostat oder Temperaturfühler fehlt)": "Réglages enregistrés – aucune pièce créée (thermostat ou capteur de température manquant)",
    "Assistent": "Assistant",
    "Einrichtungsassistent": "Assistant de configuration",
    "Führt Schritt für Schritt durch die Einrichtung": "Guide pas à pas dans la configuration",
    "Führt Schritt für Schritt durch das Anlegen eines Raums": "Guide pas à pas pour ajouter une pièce",
    "Keine weiteren Fragen – bereit zum Abschließen.": "Plus de questions – prêt à terminer.",
    "Neuer Raum": "Nouvelle pièce",
    "Weiter": "Suivant",
    "– keins –": "– aucun –",
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
    "Ventilsteuerung": "Commande de vanne",
    "direkt über {e}": "directement via {e}",
    "Sollwert am Thermostat – kein Ventilstellglied gefunden": "consigne sur le thermostat – aucun actionneur de vanne trouvé",
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
    "unter diesem Wert heizt der Raum immer – wie am Gerät": "en dessous de cette valeur, la pièce chauffe toujours – comme sur l’appareil",
    "Immer": "Toujours",
    "Nachtabsenkung": "Réduction nocturne",
    "Nie": "Jamais",
    "gilt bei der Ruhezeit und wenn der Schalter „Nachtruhe“ an ist – je Raum unter „Nachtabsenkung“ ein- oder ausgeschlossen": "s’applique pendant les heures calmes et lorsque l’interrupteur « Mode nuit » est activé – incluez ou excluez chaque pièce sous « Réduction nocturne »",
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
    "Personen": "Personnes",
    "Schalter": "Interrupteurs",
    "Person oder Schalter hinzufügen …": "Ajouter une personne ou un interrupteur …",
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
    "… erst nach": "seulement après",
    "Melder muss so lange jemanden sehen, bevor die Anwesenheits-Temperatur gilt": "le capteur doit voir quelqu’un pendant ce temps avant que la température de présence s’applique",
    "HA-Schalter, der Homeoffice mit schaltet – gilt wie der Schalter, ohne Anwesenheitsprüfung": "Interrupteur HA qui active aussi le télétravail – comme l’interrupteur, sans contrôle de présence",
    "HA-Schalter, der die Nachtruhe mit schaltet – der eigene Schalter bleibt": "Interrupteur HA qui active aussi le mode nuit – l’interrupteur interne reste",
    "Homeoffice über Entität": "Télétravail via entité",
    "Nachtruhe über Entität": "Mode nuit via entité",
    "so warm, solange ein Melder jemanden im Raum sieht": "cette température tant qu’un capteur voit quelqu’un dans la pièce",
    "… Homeoffice / zu Hause": "… télétravail / à la maison",
    "Komma-getrennt, freie Wahl; ein Termin mit diesem Wort schaltet Homeoffice und senkt nicht ab": "séparés par des virgules, choix libre ; un rendez-vous avec ce mot active le télétravail et n’abaisse rien",
    "Automatik am Gerät": "Automatique sur l’appareil",
    "Automatik": "Automatique",
    "Arbeitsplätze": "Lieux de travail",
    "Zonen, in denen gearbeitet wird – wer dort ist, kommt so schnell nicht zurück": "zones de travail – ceux qui y sont ne reviennent pas de sitôt",
    "so lange dort, dann gilt die Wohnung sofort als leer (kein Vorheizen, keine Wartezeit)": "présent aussi longtemps, la maison compte alors comme vide immédiatement (pas de préchauffage, pas d’attente)",
    "… gilt nach": "… compte après",
    "Nacht": "Nuit",
    "Berichte": "Rapports",
    "Nacht & Ruhezeit": "Nuit et heures calmes",
    "Grenze unter Lüften & Feuchte": "seuil sous Aération et humidité",
    "Weitere Einstellungen": "Autres réglages",
    "Homeoffice & Kalender": "Télétravail et calendrier",
    "Dashboard, Standort, weitere Wohnung": "Tableau de bord, emplacement, autre logement",
    "Technik": "Technique",
    "vom Standard abweichend": "différent de la valeur par défaut",
    "Profi-Ansicht": "Vue expert",
    "Alle selten gebrauchten Einstellungen dauerhaft aufklappen": "Garder dépliés tous les réglages rarement utilisés",
    "Automatisch: Bewegung = PIR, Anwesenheit/Belegung = mmWave. Für „Raum leer“: 3 min (mmWave) bzw. 20 min (PIR) ohne Meldung": "Automatique : mouvement = PIR, présence/occupation = mmWave. Pour « pièce vide » : 3 min (mmWave) ou 20 min (PIR) sans signal",
    "Automatisch: nein – „Bei Anwesenheit“ ist eingestellt, die Wunschtemperatur ist schon der Wert für den leeren Raum": "Automatique : non – « En présence » est réglé, la température souhaitée est déjà la valeur pour la pièce vide",
    "Einschalten ({t})": "Activer ({t})",
    "Melder hinzufügen – dann kann der Raum bei Anwesenheit wärmer werden": "Ajouter un capteur – la pièce peut alors chauffer davantage quand quelqu’un s’y trouve",
    "Nur Bewegungsmelder (PIR) gewählt – für die Anwesenheits-Temperatur unten „auch Bewegungsmelder“ einschalten oder einen mmWave-Melder hinzufügen.": "Seuls des détecteurs de mouvement (PIR) sont choisis – pour la température de présence, activez « aussi détecteurs de mouvement » ci-dessous ou ajoutez un capteur mmWave.",
    "PIR sieht auch Haustiere und nach ein paar Minuten Stillsitzen niemanden mehr – dann „zurück nach“ eher 20 min": "Un PIR voit aussi les animaux et plus personne après quelques minutes d’immobilité – réglez alors « retour après » plutôt sur 20 min",
    "aus – der Raum heizt nach Wunsch und Zeitplan": "désactivé – la pièce chauffe selon la consigne et le programme",
    "ausschalten": "désactiver",
    "heizt auf {t} – jemand im Raum": "chauffe à {t} – quelqu’un dans la pièce",
    "jemand da seit {m} min – ab {d} min {t}": "quelqu’un là depuis {m} min – {t} dès {d} min",
    "so lange muss jemand im Raum sein – kurz Durchgehen zählt nicht (0 = sofort)": "quelqu’un doit être dans la pièce aussi longtemps – un simple passage ne compte pas (0 = immédiat)",
    "so lange ohne Belegung, dann gilt wieder die Temperatur von vorher – kurz rausgehen unterbricht nicht": "sans occupation pendant ce temps, la température d’avant s’applique de nouveau – sortir brièvement n’interrompt pas",
    "so warm, solange jemand im Raum ist – danach wieder die Temperatur von vorher": "cette température tant que quelqu’un est dans la pièce – ensuite celle d’avant",
    "„Bei Anwesenheit“ liegt nicht über der Wunschtemperatur ({w}) – dann ändert sich nichts. Die Wunschtemperatur ist der Wert, wenn niemand im Raum ist.": "« En présence » n’est pas au-dessus de la température souhaitée ({w}) – rien ne change alors. La température souhaitée est la valeur quand personne n’est dans la pièce.",
    "… auch Bewegungsmelder": "… aussi détecteurs de mouvement",
    "… wenn belegt seit": "… si occupé depuis",
    "… zurück nach": "… retour après",
    "Batterie: {n}": "Pile : {n}",
    "Der Schimmelschutz hebt das Ziel gerade an (Feuchte).": "La protection contre les moisissures relève la consigne en ce moment (humidité).",
    "Lampen zählen als Anwesenheit": "Les lampes comptent comme présence",
    "Neu prüfen": "Vérifier à nouveau",
    "Prognose ab 7 Tagen Verlauf": "prévision après 7 jours d’historique",
    "Regeln – die erste, die greift, bestimmt das Ziel": "Règles – la première qui s’applique fixe la consigne",
    "Voraussetzungen": "Conditions",
    "Vorwärmen nach gelernten Zeiten": "Préchauffer selon les horaires appris",
    "Vorwärmen · {v}°": "Préchauffage · {v}°",
    "Vorwärmen – der Raum ist um diese Zeit meist belegt · <b>{v} °C</b>": "Préchauffage – la pièce est généralement occupée à cette heure · <b>{v} °C</b>",
    "bestimmt das Ziel": "fixe la consigne",
    "eine eingeschaltete Lampe (z. B. Schreibtischlampe) heißt: jemand ist im Raum – zählt nur für diesen Raum, nie für „jemand zu Hause“": "une lampe allumée (p. ex. lampe de bureau) signifie que quelqu’un est dans la pièce – compte seulement pour cette pièce, jamais pour « quelqu’un à la maison »",
    "greift nicht": "ne s’applique pas",
    "hält noch etwa {d} Tage": "tient encore environ {d} jours",
    "lernt noch: ein Zeitraum gilt als typisch, wenn der Raum an 3 der letzten 4 gleichen Wochentage belegt war": "apprend encore : un créneau est typique si la pièce était occupée 3 des 4 derniers mêmes jours de semaine",
    "meist belegt: {u} – so früh vorwärmen, dass es dann warm ist; kommt 30 min niemand, gilt wieder der Wert von vorher": "généralement occupée : {u} – préchauffe assez tôt pour qu’il fasse chaud ; si personne ne vient dans les 30 min, la valeur d’avant s’applique de nouveau",
    "prüft …": "vérification …",
    "würde greifen – nachrangig": "s’appliquerait – priorité inférieure",
    "{n} Funkbefehle am Tag (Mittel 7 Tage)": "{n} commandes radio par jour (moyenne 7 jours)",
    "Warum (nicht)?": "Pourquoi (pas) ?",
    "Keine Antwort – bitte Raumklima aktualisieren und neu starten.": "Pas de réponse – veuillez mettre à jour Raumklima et redémarrer.",
    "Klassische Ansicht": "Vue classique",
    "Neue Ansicht": "Nouvelle vue",
    "Noch keine Räume eingerichtet.": "Aucune pièce configurée pour le moment.",
    "Zwischen neuer Bereichsnavigation und klassischer Ansicht wechseln": "Basculer entre la nouvelle navigation par sections et la vue classique",
    "Wohnungen": "Logements",
    "Personen & Anwesenheit": "Personnes et présence",
    "Heizung & Energie": "Chauffage et énergie",
    "System & Diagnose": "Système et diagnostic",
    "Energie & Tarife": "Énergie et tarifs",
    "Wetter": "Météo",
    "Kommt in einer späteren Beta: Zähler, Tarife und PV-Ertrag.": "Bientôt dans une bêta ultérieure : compteurs, tarifs et production photovoltaïque.",
    "Kommt in einer späteren Beta: eigene Wetterquelle und Vorhersage je Wohnung.": "Bientôt dans une bêta ultérieure : source météo propre et prévisions par logement.",
    "Erweitert": "Avancé",
    "Kommt in einer späteren Beta: technische Einstellungen und Diagnosewerkzeuge.": "Bientôt dans une bêta ultérieure : réglages techniques et outils de diagnostic.",
    "Energie-Erfassung ist aus. In den Einstellungen unter „Heizung & Energie“ aktivieren.": "Le suivi de l’énergie est désactivé. Activez-le dans les réglages sous « Chauffage & énergie ».",
    "Noch kein Zähler gewählt. In den Einstellungen unter „Heizung & Energie“ einen Strom-, Gas- oder Wärmezähler auswählen.": "Aucun compteur sélectionné. Choisissez un compteur d’électricité, de gaz ou de chaleur dans les réglages sous « Chauffage & énergie ».",
    "Quelle": "Source",
    "fester Preis": "prix fixe",
    "Verbrauch": "Consommation",
    "Kosten": "Coût",
    "Jahr": "Année",
    "PV": "PV",
    "Basis: {b}": "Base : {b}",
    "noch keine Schätzung": "pas encore d’estimation",
    "Schätzung": "Estimation",
    "Energie nicht verfügbar: {e}": "Énergie indisponible : {e}",
    "Lade Energie …": "Chargement de l’énergie…",
    "Energie": "Énergie",
    "Letzte {n} Tage": "{n} derniers jours",
    "Zähler, Tarif und Kosten": "Compteur, tarif et coûts",
    "{n} Tage": "{n} jours",
    "{n} % Eigenverbrauch": "{n} % autoconsommation",
    "Lernen": "Apprentissage",
    "Was Raumklima aus deinen Daten gelernt hat": "Ce que Raumklima a appris de vos données",
    "Aufheizraten": "Vitesses de montée",
    "Abkühlung": "refroidissement",
    "Wärmemodell": "Modèle thermique",
    "Räume mit Wärmeverlust": "pièces avec perte de chaleur",
    "Räume mit Daten": "pièces avec données",
    " Tage": " jours",
    "Profil vollständig": "profil complet",
    "Profil wächst": "profil en croissance",
    "gelernte Vorgänge": "événements appris",
    "Schlaf": "Sommeil",
    "typische Nacht": "nuit typique",
    "{n} Aufheizvorgänge": "{n} montées en chauffe",
    "+2 K in {n} min": "+2 K en {n} min",
    "Noch zu wenig Daten": "Pas encore assez de données",
    "Nutzung": "Utilisation",
    "{n} Tage mit Belegung": "{n} jours d’occupation",
    "Kein Präsenzprofil": "Pas de profil de présence",
    "{n} Vorgänge": "{n} événements",
    "typisch": "typique",
    "Noch kein Lüftmuster": "Pas encore de profil d’aération",
    "Wochentags": "En semaine",
    "Lernen ist lesend: Raumklima zeigt hier nur, was es aus den letzten Wochen gelernt hat.": "L’apprentissage est en lecture seule : Raumklima affiche uniquement ce qu’il a appris ces dernières semaines.",
    "Raumklima – Energie": "Raumklima – Énergie",
    "Zähler, Tarif und Kosten im Zeitraum": "Compteur, tarif et coûts sur la période",
    "Alles hier ist simuliert – ohne Home-Assistant-Entitäten und ohne persönliche Daten.": "Tout ici est simulé – sans entités Home Assistant et sans données personnelles.",
    "Büro": "Bureau",
    "Demo": "Démo",
    "Demo-Daten": "données de démo",
    "Fenster auf": "Ouvrir la fenêtre",
    "Fenster zu": "Fermer la fenêtre",
    "Innen {v} °C": "Intérieur {v} °C",
    "Raumklima": "Raumklima",
    "Raumklima – Demo": "Raumklima – Démo",
    "Simulierte Räume ohne Hardware": "Pièces simulées sans matériel",
    "Soll {v} °C": "Consigne {v} °C",
    "Wohnzimmer": "Séjour",
    "in 45 min": "en 45 min",
    "{v} % Feuchte": "{v} % d’humidité",
    "Raumklima – Lernen": "Raumklima – Apprentissage",
    "0 % = ganz zu, 100 % = ganz offen – Rollläden ohne Positionsfahrt schließen ganz": "0 % = complètement fermé, 100 % = complètement ouvert – les volets sans positionnement se ferment complètement",
    "Empfehlung: schließen": "Recommandation : fermer",
    "Empfehlung: öffnen": "Recommandation : ouvrir",
    "Gerät antwortet nicht": "L’appareil ne répond pas",
    "Handbedienung pausiert": "La commande manuelle met l’automatisme en pause",
    "Handbedienung – pausiert": "Commande manuelle – en pause",
    "Nacht vorbei": "La nuit est terminée",
    "Nachts schließen": "Fermer la nuit",
    "Nur empfehlen": "Conseiller seulement",
    "Rollläden": "Volets roulants",
    "Rollläden bleiben, wie sie sind": "Les volets restent tels quels",
    "Schließen ab innen": "Fermer à partir de l’intérieur",
    "Schließposition": "Position de fermeture",
    "Sonne auf der Fassade": "Soleil sur la façade",
    "Verschattung": "Ombrage",
    "ab dieser Außentemperatur wird es auch ohne warmen Raum zu warm": "à partir de cette température extérieure, il fait trop chaud même sans pièce chaude",
    "ab dieser Raumtemperatur hält die Sonne den Raum warm – dann Schatten": "à partir de cette température ambiante, le soleil maintient la pièce au chaud – alors de l’ombre",
    "die Karte empfiehlt, fährt aber nicht selbst": "la carte recommande mais ne les commande pas",
    "fährt bei Sonne und nachts – Handbedienung pausiert die Automatik": "se ferme au soleil et la nuit – la commande manuelle met l’automatisme en pause",
    "Sollwert am Gerät": "Consigne sur l’appareil",
    "Fußbodenheizung": "Plancher chauffant",
    "eigene Regelcharakteristik: träge, mit Vor-/Rücklauf und größerem Band": "caractéristique de régulation propre : lente, avec départ/retour et une plage plus large",
    "Durchfluss in Ordnung": "Débit correct",
    "Vor-/Rücklauf nicht verbunden": "Capteurs de départ/retour non connectés",
    "Spreizung zu klein – Pumpe/Abgleich prüfen": "Écart trop faible – vérifier la pompe/l’équilibrage",
    "durch die Fußboden-Charakteristik begrenzt und im Takt nachgezogen": "limité par la caractéristique du plancher chauffant et ajusté au cycle",
    "Max. Vorlauf": "Départ max.",
    "harte Obergrenze – schützt Boden und Heizkreis": "limite haute stricte – protège le sol et le circuit de chauffage",
    "Min. Raumtemperatur": "Température ambiante min.",
    "darunter heizt die Fußbodenheizung nicht": "le plancher chauffant ne chauffe pas en dessous",
    "Regelband": "Plage de régulation",
    "innerhalb des Bandes bleibt der Sollwert stehen – gegen Überschwingen": "dans la plage, la consigne reste stable – évite les dépassements",
    "Mindest-Taktzeit": "Temps de cycle minimal",
    "so oft darf der Sollwert höchstens nachgezogen werden": "la consigne est ajustée au plus souvent à cette fréquence",
    "Vorlauf vor Zeitfenster": "Avance avant la plage horaire",
    "früher starten, damit der träge Boden zum Fenster warm ist": "démarrer plus tôt pour que le sol lent soit chaud au début de la plage",
    "Durchfluss-Grenze": "Limite de débit",
    "Vorlauf minus Rücklauf unter diesem Wert: Durchfluss prüfen": "départ moins retour sous cette valeur : vérifier le débit",
    "geschlossen": "fermé",
    "keine Rollläden gewählt": "aucun volet sélectionné",
    "keine Sonne erwartet": "aucun soleil prévu",
    "keine Temperaturdaten": "aucune donnée de température",
    "Fenster/Tür offen – fährt nicht zu": "Fenêtre/porte ouverte – ne ferme pas",
    "keine – unter „Geräte & Technik ändern“ wählen": "aucun – à sélectionner sous « Modifier appareils et technique »",
    "nach Sonnenuntergang zu, morgens wieder auf – schützt vor Wärmeverlust und Licht": "fermé après le coucher du soleil, rouvert le matin – protège contre les pertes de chaleur et la lumière",
    "nur diese Rollläden oder Jalousien werden gefahren – Fensterkontakte bleiben getrennt": "seuls ces volets roulants ou stores sont commandés – les contacts de fenêtre restent séparés",
    "oder ab außen": "ou à partir de l’extérieur",
    "so lange bleibt die Automatik aus, wenn jemand selbst am Rollladen zieht – 0 = sofort wieder automatisch": "l’automatisme reste désactivé aussi longtemps après une commande manuelle – 0 = de nouveau automatique immédiatement",
    "zu kühl für Schatten": "trop frais pour de l’ombre",
    "Werkzeuge": "Outils",
    "Karte": "Carte",
    "Sonnenaufgang": "Lever du soleil",
    "Sonnenuntergang": "Coucher du soleil",
    "Quelle für Außentemperatur, Vorhersage, Sonnenseite und Frostnacht": "source de la température extérieure, des prévisions, de l’ensoleillement et de la nuit de gel",
    "nächster Sonnenaufgang": "prochain lever du soleil",
    "nächster Sonnenuntergang": "prochain coucher du soleil",
    "Version der Karte im Browser": "version de la carte dans le navigateur",
    "Datenquelle": "Source de données",
    "WebSocket": "WebSocket",
    "Live-Verbindung zur Integration": "connexion en direct à l’intégration",
    "Selbsttest, Diagnose-Datei oder Fehlerbericht öffnen": "ouvrir l’auto-test, le fichier de diagnostic ou le rapport de bug",
    "aktiv": "actif",
    "nicht aktiv": "inactif",
    "Warmwasser": "Eau chaude",
    "Außen °C": "Extérieur °C",
    "Spanne": "Écart",
    "Am günstigsten": "Le moins cher",
    "Wärmezähler": "Compteur de chaleur",
    "Warmwasser-Zähler": "Compteur eau chaude",
    "Hausverbrauch": "Consommation de la maison",
    "Netzbezug": "Soutirage réseau",
    "Warmwasser-Wärme": "Chaleur eau chaude",
    "Zähler liefert": "Le compteur fournit",
    "Zähler ohne Statistik": "Compteur sans statistiques",
    "Arbeitszahl gemessen": "Rendement mesuré",
    "Wärmezähler ohne Werte": "Compteur de chaleur sans valeurs",
    "Arbeitszahl geschätzt – Wärmezähler fehlt": "Rendement estimé – compteur de chaleur manquant",
    "Preis aus {s}": "Prix de {s}",
    "keine Preisquelle liefert – fester Preis": "aucune source de prix – prix fixe",
    "Preisvorschau da": "Prévision de prix disponible",
    "keine Preisvorschau": "pas de prévision de prix",
    "Energiequelle bitte in den Einstellungen wählen": "Veuillez choisir la source d’énergie dans les réglages",
    "Jahr ≈ {v} €": "Année ≈ {v} €",
    "Jahresprognose ab Heizsaison": "Prévision annuelle dès la saison de chauffe",
    "Heizung {h} · Warmwasser {w} kWh": "Chauffage {h} · eau chaude {w} kWh",
    "Arbeitszahl": "Rendement (COP)",
    "Heizung, gemessen": "chauffage, mesuré",
    "geschätzt (Datenblatt)": "estimé (fiche technique)",
    "Wärmezähler fehlt": "compteur de chaleur manquant",
    "Warmwasser {v}": "eau chaude {v}",
    "Wärme": "Chaleur",
    "Bezahlt Ø": "Payé Ø",
    "Mittel {v} ct": "moyenne {v} ct",
    "{p} % in günstigen Stunden": "{p} % aux heures bon marché",
    "Preis": "Prix",
    "Wärme {v} ct/kWh": "chaleur {v} ct/kWh",
    "je kWh, brutto": "par kWh, TTC",
    "Aus PV & Batterie": "Du PV et de la batterie",
    "kostet nichts – schon abgezogen": "gratuit – déjà déduit",
    "Verbrauch pro Tag": "Consommation par jour",
    "Wer verbraucht die Wärme?": "Qui consomme la chaleur ?",
    "nach Ventilöffnung × Stunden – ohne Warmwasser und Grundgebühr": "selon ouverture de vanne × heures – sans eau chaude ni abonnement",
    "Preisquellen": "Sources de prix",
    "Hauptquelle": "Source principale",
    "Reserve": "Réserve",
    "liefert nichts": "aucune valeur",
    "Details und Sensoren": "Détails et capteurs",
    "{v} € pro Tag": "{v} € par jour",
    "{p} % des Hausstroms": "{p} % de l’électricité de la maison",
    "Zähler und Preise auswerten – Raumklima rechnet nur aus und steuert die Heizung nicht": "Analyser compteurs et prix – Raumklima calcule seulement et ne pilote pas le chauffage",
    "Wie heizt ihr?": "Comment chauffez-vous ?",
    "bestimmt, welche Zähler und Preise abgefragt werden": "détermine quels compteurs et prix sont demandés",
    "Strom direkt": "Électrique direct",
    "bitte wählen – bisher automatisch erkannt": "veuillez choisir – détecté automatiquement jusqu’ici",
    "Anleitung: Welche Energiequelle passt?": "Guide : quelle source d’énergie choisir ?",
    "Wärmepumpe: Luft-, Sole- oder Wasser-Wärmepumpe – auch mit Heizstab, der läuft über denselben Stromzähler.": "Pompe à chaleur : air, sol ou eau – aussi avec résistance d’appoint, qui passe par le même compteur électrique.",
    "Strom direkt: Infrarotplatten, Nachtspeicher, Elektroheizkörper – eine kWh Strom ist eine kWh Wärme.": "Électrique direct : panneaux infrarouges, accumulateurs, radiateurs électriques – un kWh d’électricité donne un kWh de chaleur.",
    "Gas: Brennwert- oder Heizwerttherme, auch Gasetagenheizung.": "Gaz : chaudière à condensation ou classique, y compris chauffage d’étage.",
    "Fernwärme: Übergabestation im Keller, abgerechnet nach Wärmemenge.": "Chauffage urbain : sous-station au sous-sol, facturée à la chaleur livrée.",
    "Die Wahl ändert nichts an der Heizung selbst – sie legt nur fest, wie gerechnet wird.": "Ce choix ne modifie pas le chauffage – il définit seulement le mode de calcul.",
    "Strom der Wärmepumpe fürs Heizen – Gesamtzähler in kWh": "électricité de la PAC pour le chauffage – compteur total en kWh",
    "Strom der Heizung – Gesamtzähler in kWh": "électricité du chauffage – compteur total en kWh",
    "Gaszähler in m³ oder kWh – Gesamtzähler": "compteur de gaz en m³ ou kWh – compteur total",
    "Liter-Zähler des Brenners – oder leer lassen und den Tank wählen": "compteur de litres du brûleur – ou laisser vide et choisir la cuve",
    "Wärmemengenzähler der Übergabestation in kWh oder MWh": "compteur de chaleur de la sous-station en kWh ou MWh",
    "Was wird gemessen?": "Que mesure-t-on ?",
    "immer Gesamtzähler, die nur steigen – keine Tages- oder Wochenwerte": "toujours des compteurs totaux croissants – pas de valeurs journalières ou hebdomadaires",
    "erzeugte Heizwärme – damit wird die Arbeitszahl gemessen statt geschätzt": "chaleur produite – le rendement est alors mesuré et non estimé",
    "kWh je m³ – steht auf der Gasrechnung": "kWh par m³ – indiqué sur la facture de gaz",
    "nur wenn Warmwasser getrennt gemessen wird – zählt dann mit zu den Kosten": "seulement si l’eau chaude est mesurée à part – elle compte alors dans les coûts",
    "erzeugte Warmwasser-Wärme – für die Arbeitszahl beim Warmwasser": "chaleur produite pour l’eau chaude – pour son rendement",
    "Füllstand in %, L oder m³ – zeigt Restmenge und Bestellhinweis": "niveau en %, L ou m³ – affiche le reste et quand commander",
    "Energieinhalt – 10 kWh/L ist typisch": "contenu énergétique – 10 kWh/L est typique",
    "aus der letzten Lieferung oder dem Tankbuch": "de la dernière livraison ou du carnet de cuve",
    "über wie viele Tage diese Liter reichten": "combien de jours ces litres ont duré",
    "optional: Stromverbrauch des ganzen Hauses in kWh": "optionnel : consommation électrique de toute la maison en kWh",
    "optional: Strom aus dem Netz in kWh – mit Hausverbrauch zählt PV und Batterie Stunde für Stunde": "optionnel : électricité soutirée du réseau en kWh – avec la consommation de la maison, PV et batterie sont comptés heure par heure",
    "nur ohne Hausverbrauch und Netzbezug: grobe Schätzung über den Eigenverbrauch": "seulement sans consommation et soutirage : estimation grossière via l’autoconsommation",
    "Anteil des PV-Ertrags, der die Heizung deckt": "part du rendement PV qui couvre le chauffage",
    "Anleitung: Den richtigen Zähler finden": "Guide : trouver le bon compteur",
    "Einstellungen → Geräte & Dienste → deine Heizung öffnen (z. B. Stiebel Eltron, Vaillant, Viessmann, Shelly am Heizungszähler).": "Paramètres → Appareils et services → ouvrir votre chauffage (p. ex. Stiebel Eltron, Vaillant, Viessmann, un Shelly sur le compteur).",
    "Den Sensor nehmen, der „gesamt“ oder „total“ heißt und in kWh, m³ oder L zählt. Nicht „heute“ oder „letzte 24 h“ – die springen zurück.": "Prendre le capteur « total » qui compte en kWh, m³ ou L. Pas « aujourd’hui » ni « dernières 24 h » – ils se remettent à zéro.",
    "Wärmepumpe: Strom fürs Heizen und – wenn vorhanden – die erzeugte Heizwärme. Meldet sie Warmwasser getrennt, beides auch dort eintragen; Warmwasser zählt zu den Kosten.": "Pompe à chaleur : électricité du chauffage et – si disponible – la chaleur produite. Si l’eau chaude est indiquée à part, renseigner aussi les deux ; elle compte dans les coûts.",
    "Hausverbrauch und Netzbezug: z. B. vom Smart Meter, Energiemanager oder Wechselrichter. Damit rechnet Raumklima jede Stunde, wie viel Strom aus PV und Batterie kam.": "Consommation et soutirage : p. ex. compteur communicant, gestionnaire d’énergie ou onduleur. Raumklima calcule alors chaque heure la part venant du PV et de la batterie.",
    "Kein Zähler? Dann unter „Berichte“ die Heizkosten pro Jahr laut Abrechnung eintragen.": "Pas de compteur ? Indiquez alors le coût annuel de la facture sous « Rapports ».",
    "€/kWh oder €/m³": "€/kWh ou €/m³",
    "Was kostet die kWh?": "Combien coûte le kWh ?",
    "ein Preis für alles – Dashboard, Bericht und Vergleich rechnen gleich": "un seul prix pour tout – tableau de bord, rapport et comparaison calculent pareil",
    "Preis je Liter der letzten Lieferung – wird mit Datum notiert": "prix au litre de la dernière livraison – noté avec la date",
    "Preisquelle": "Source de prix",
    "Sensor mit dem Arbeitspreis in {u} – oder fester Preis darunter": "capteur avec le prix de l’énergie en {u} – ou prix fixe ci-dessous",
    "Reserve-Preisquellen": "Sources de prix de réserve",
    "keine weiteren Preis-Sensoren": "aucun autre capteur de prix",
    "Reihenfolge: {l}": "Ordre : {l}",
    "springen ein, wenn die Hauptquelle nichts liefert – z. B. EPEX Spot": "prennent le relais si la source principale ne fournit rien – p. ex. EPEX Spot",
    "fester Preis je kWh, brutto – steht auf der Rechnung": "prix fixe par kWh, TTC – indiqué sur la facture",
    "optionaler Heizöl-Marktpreis in €/L – für den Vergleich": "prix du marché du fioul en €/L (optionnel) – pour comparer",
    "monatliche Grundgebühr in €, brutto": "abonnement mensuel en €, TTC",
    "Grundgebühr-Anteil": "Part de l’abonnement",
    "ganz": "entier",
    "nach Verbrauch": "selon consommation",
    "ganz = eigener Wärmepumpen-Zähler; nach Verbrauch = gemeinsamer Hauszähler": "entier = compteur PAC séparé ; selon consommation = compteur commun de la maison",
    "Preis wechselt stündlich – Dashboard zeigt Preiskurve und günstige Stunden": "le prix change chaque heure – le tableau de bord montre la courbe et les heures bon marché",
    "Preis ohne Steuern und Netzentgelt?": "Prix sans taxes ni frais de réseau ?",
    "netto = der Sensor liefert nur den Börsen- oder Nettopreis": "HT = le capteur ne fournit que le prix de bourse ou HT",
    "€/kWh, die im Sensor fehlen: Netzentgelt, Umlagen, Stromsteuer, Aufschlag": "€/kWh absents du capteur : frais de réseau, taxes, contributions, marge",
    "kommt auf Preis und Abgaben drauf": "s’ajoute au prix et aux taxes",
    "Preis jetzt": "Prix actuel",
    "aus {s}": "de {s}",
    "Ölpreis je Liter umgerechnet auf kWh": "prix du fioul au litre converti en kWh",
    "gleicher Wert wie im Dashboard und im Bericht": "même valeur que dans le tableau de bord et le rapport",
    "Anleitung: Welcher Preis ist der richtige?": "Guide : quel est le bon prix ?",
    "Am besten der Preis-Sensor deines Anbieters (z. B. 1KOMMA5°, Tibber, Octopus, Rabot): er kennt dein Netzentgelt und die MwSt – nichts weiter eintragen.": "Le mieux : le capteur de prix de votre fournisseur (p. ex. 1KOMMA5°, Tibber, Octopus, Rabot) : il connaît vos frais de réseau et la TVA – rien d’autre à saisir.",
    "Zweitbeste Quelle: die Integration „EPEX Spot“ aus dem Marketplace. Der Börsenpreis ist überall in Deutschland gleich; regional verschieden ist das Netzentgelt.": "Deuxième choix : l’intégration « EPEX Spot » du Marketplace. Le prix de bourse est identique partout ; ce qui varie selon la région, ce sont les frais de réseau.",
    "Den Sensor „Total Price“ von EPEX Spot wählen, wenn dort Aufschlag und MwSt eingetragen sind. Sonst „Market Price“ wählen und hier unter „Preis ohne Steuern und Netzentgelt?“ auf netto stellen und die Abgaben eintragen.": "Choisir le capteur « Total Price » d’EPEX Spot si la marge et la TVA y sont saisies. Sinon choisir « Market Price », passer en HT sous « Prix sans taxes ni frais de réseau ? » et saisir les taxes.",
    "Netzentgelt finden: Netzbetreiber steht auf der Stromrechnung. Auf dessen Website „Preisblatt Netzentgelte Strom“, Zeile Haushalt / ohne Leistungsmessung, Arbeitspreis in ct/kWh.": "Trouver les frais de réseau : le gestionnaire figure sur la facture d’électricité. Sur son site, grille tarifaire réseau, ligne ménage sans mesure de puissance, prix en ct/kWh.",
    "Netzentgelte ändern sich jedes Jahr zum 1. Januar – dann den Wert prüfen. Eine amtliche Tabelle zum Abrufen gibt es nicht.": "Les frais de réseau changent chaque 1er janvier – vérifiez alors la valeur. Il n’existe pas de tableau officiel à récupérer.",
    "Mehrere Quellen: die erste ist die Hauptquelle, Reserven springen ein, wenn sie nichts liefert. Fester Arbeitspreis: Preis je kWh von der Rechnung, brutto.": "Plusieurs sources : la première est la principale, les réserves prennent le relais si elle ne fournit rien. Prix fixe : prix par kWh de la facture, TTC.",
    "Vergleich mit Klimagerät": "Comparaison avec la climatisation",
    "nur wenn ein Klimagerät auch heizen darf": "seulement si une climatisation peut aussi chauffer",
    "Leistungszahl beim Heizen laut Datenblatt (bei +7 °C)": "COP en chauffage selon la fiche technique (à +7 °C)",
    "€/kWh brutto – die Heizung läuft nicht mit Strom, das Klimagerät schon": "€/kWh TTC – le chauffage n’est pas électrique, la climatisation oui",
    "– fester Preis –": "– prix fixe –",
    "ganztägig": "toute la journée",
    "Breite des Schaltbereichs – 0,5 K heißt: auf bei Ziel −0,25 K, zu bei Ziel +0,25 K": "largeur de la plage – 0,5 K signifie ouvert à consigne −0,25 K, fermé à consigne +0,25 K",
    "HA-Zeitplan-Helfer (schedule.*) statt der Zeitfenster hier – z. B. einen je Plan anlegen und per Automation umschalten": "assistant de planification HA (schedule.*) au lieu des plages ici – p. ex. un par programme, commuté par automatisation",
    "Hysterese": "Hystérésis",
    "Hysterese (auf/zu)": "Hystérésis (ouvert/fermé)",
    "Raumklima öffnet das Ventil ganz unter Ziel − ½ Hysterese und schließt es ganz über Ziel + ½ – weniger Ventilbewegungen, etwas mehr Schwankung": "Raumklima ouvre entièrement la vanne sous consigne − ½ hystérésis et la ferme au-dessus de consigne + ½ – moins de mouvements, un peu plus de variation",
    "Zeitplan-Helfer": "Assistant de planification",
    "eigene Zeitfenster": "plages propres",
    "– eigene Zeitfenster –": "– plages propres –",
    "keine Auswahl = der Raum gilt allen Bewohnern; auch Schalter (z. B. Gast) und Präsenz-Sensoren wählbar": "aucune sélection = la pièce est à tous ; interrupteurs (p. ex. invité) et capteurs de présence possibles aussi",
    "nur wenn eine dieser Personen zu Hause ist oder ein gewählter Schalter an – sonst wird der Raum abgesenkt": "seulement si une de ces personnes est là ou un interrupteur choisi est activé – sinon la pièce est abaissée",
    "„an“ im Helfer = Zeitfenster aktiv; eine Temperatur im Datenfeld des Blocks wird übernommen – die Zeitfenster oben gelten dann nicht": "« activé » dans l’assistant = plage active ; une température dans le champ de données du bloc est reprise – les plages ci-dessus ne s’appliquent plus",
    "Plan „{p}“": "Programme « {p} »",
    "Plan-Umschalter": "Sélecteur de programme",
    "ganztägig Wunschtemperatur": "température souhaitée toute la journée",
    "gerade: {p} – je Raum unter Zeitplan → Weitere Einstellungen festlegen, was in welchem Plan gilt": "actuellement : {p} – définir par pièce sous Planning → Autres réglages ce qui s’applique dans chaque programme",
    "gilt gerade": "actif maintenant",
    "kein Zeitfenster (außerhalb gilt)": "aucune plage (la règle hors plage s’applique)",
    "wie sonst": "comme d’habitude",
    "z. B. Auswahl-Helfer „Arbeitszeit / frei / krank“ – jeder Raum bekommt je Plan seinen eigenen Zeitplan": "p. ex. une liste « travail / libre / malade » – chaque pièce a son planning par programme",
    "Zähler misst": "Le compteur mesure",
    "nur Heizung": "chauffage seul",
    "Heizung + Warmwasser": "chauffage + eau chaude",
    "der Warmwasser-Zähler teilt dann nur auf und wird nicht dazugezählt – ideal für einen fein messenden Gesamtzähler (z. B. Energiemanager)": "le compteur d’eau chaude ne fait alors que répartir et n’est pas ajouté – idéal pour un compteur total précis (p. ex. gestionnaire d’énergie)",
    "Warmwasser kommt über den eigenen Zähler dazu": "l’eau chaude s’ajoute via son propre compteur",
    "Daten ab {d}": "données depuis le {d}",
    "(Wunschtemperatur)": "(température souhaitée)",
    "Außerhalb der Fenster wäre es wärmer ({v} °C) als in {n} Fenster(n) – stelle „Außerhalb“ auf „Kurz weg“ oder „Länger weg“": "Hors des plages il ferait plus chaud ({v} °C) que dans {n} plage(s) – règle « En dehors » sur « Absence courte » ou « Absent longtemps »",
    "Zeitplan: ab {u} {v} °C · bis dahin {o} °C": "Planning : {v} °C dès {u} · d’ici là {o} °C",
    "Zeitplan: kein Fenster in den nächsten 24 h · {o} °C": "Planning : aucune plage dans les prochaines 24 h · {o} °C",
    "Zeitplan: {v} °C bis {u} · danach {o} °C": "Planning : {v} °C jusqu’à {u} · ensuite {o} °C",
    "Zeitplan: {v} °C ganztägig": "Planning : {v} °C toute la journée",
    "im Zeitfenster gilt seine Temperatur, außerhalb {v} °C": "dans une plage sa température s’applique, en dehors {v} °C",
    "morgen {t}": "demain {t}",
    "· bist du als abwesend gemeldet, gilt die Abwesenheits-Absenkung": "· si tu es signalé absent, l’abaissement d’absence s’applique",
    "+ {k} kWh aus PV/Akku ≈ {v} € nicht bezahlt": "+ {k} kWh du PV/batterie ≈ {v} € non payés",
    "Abrechnung": "facture",
    "Akku entladen": "Batterie déchargée",
    "Akku geladen": "Batterie chargée",
    "Akku geladen · davon aus dem Netz": "Batterie chargée · dont depuis le réseau",
    "Akku: die beiden Gesamtzähler „geladen“ und „entladen“ (z. B. „Battery Energy In/Out“). Lädt der Akku nachts aus dem Netz, ist dieser Strom später nicht kostenlos – Raumklima rechnet ihn zum Preis beim Laden.": "Batterie : les deux compteurs totaux « chargée » et « déchargée » (p. ex. « Battery Energy In/Out »). Si la batterie se charge la nuit sur le réseau, cette électricité n’est pas gratuite ensuite – Raumklima la compte au prix de la charge.",
    "Aus PV & Akku": "Du PV et de la batterie",
    "Außen °C (rechte Achse)": "Extérieur °C (axe de droite)",
    "Balken antippen zeigt den Tag": "touche une barre pour voir le jour",
    "Börse Ø {v} ct/kWh": "bourse moy. {v} ct/kWh",
    "Dynamischer Tarif gegenüber Börsen-Mittel": "Tarif dynamique vs moyenne de la bourse",
    "Eingespeist": "Injecté",
    "Einspeisung": "Injection réseau",
    "Gas ({p} ct/kWh, 90 %)": "Gaz ({p} ct/kWh, 90 %)",
    "Gaspreis zum Vergleich": "Prix du gaz pour comparer",
    "Grundgebühr": "Abonnement",
    "Grundgebühr (anteilig)": "Abonnement (part)",
    "Grundgebühr {v} € enthalten": "dont abonnement {v} €",
    "Grundlage": "Base",
    "Günstigste 3 Stunden": "3 heures les moins chères",
    "Haus": "Maison",
    "Heizung aus PV/Akku (kostenlos)": "Chauffage par PV/batterie (gratuit)",
    "Heizung aus dem Akku, vorher aus dem Netz geladen": "Chauffage par la batterie, chargée sur le réseau",
    "Heizöl ({p} €/L, 90 %)": "Fioul ({p} €/L, 90 %)",
    "Jahr: noch zu wenig Daten": "année : pas encore assez de données",
    "Je 1 °C kälter": "Par 1 °C plus froid",
    "Kennlinie": "courbe",
    "Nur günstigste Stunden genutzt (Obergrenze)": "Seulement les heures les moins chères (maximum)",
    "PV erzeugt": "PV produit",
    "Passgenauigkeit {p} %": "ajustement {p} %",
    "Strom laut Wärmepumpe": "Électricité selon la PAC",
    "Strompreis zum Vergleich": "Prix de l’électricité pour comparer",
    "Ventilstunden": "heures de vanne",
    "Vergleichspreise": "Prix de comparaison",
    "Verlauf & Lernen": "Historique et apprentissage",
    "Wärme erzeugt": "Chaleur produite",
    "Wärme gemessen seit {d}": "chaleur mesurée depuis le {d}",
    "Wärmepumpe ({p} ct Strom, JAZ 3,5)": "PAC ({p} ct électricité, SCOP 3,5)",
    "außen": "extérieur",
    "deine Heizung": "ton chauffage",
    "deine Wärmepumpe": "ta PAC",
    "deine Wärmepumpe (mit PV/Akku)": "ta PAC (avec PV/batterie)",
    "deine Wärmepumpe, nur Netzstrom": "ta PAC, réseau seulement",
    "ein Tag": "un jour",
    "eingespeist": "injecté",
    "gemessen {v}": "mesuré {v}",
    "gespart": "économisés",
    "günstigstes Viertel": "quart le moins cher",
    "je kWh Wärme im Haus – Vergleichspreise in den Einstellungen änderbar": "par kWh de chaleur dans la maison – prix de comparaison modifiables dans les réglages",
    "kostenlos – schon abgezogen": "gratuit – déjà déduit",
    "laut Wärmepumpe {v}": "selon la PAC {v}",
    "mit Vorschau": "avec prévision",
    "normal": "normal",
    "optional: Gesamtzähler „Batterie entladen“ – mit beiden zählt nachts aus dem Netz geladener Akku-Strom zum Ladepreis": "optionnel : compteur total « batterie déchargée » – avec les deux, l’électricité chargée la nuit sur le réseau compte au prix de charge",
    "optional: Gesamtzähler „Batterie geladen“ in kWh": "optionnel : compteur total « batterie chargée » en kWh",
    "optional: Strom fürs Heizen, wie die Wärmepumpe ihn selbst zählt – zeigt die Arbeitszahl zum Vergleich": "optionnel : électricité du chauffage selon la PAC elle-même – affiche son rendement pour comparer",
    "optional: Strom ins Netz in kWh – zeigt, wohin der Solarstrom ging": "optionnel : électricité injectée en kWh – montre où est allé le solaire",
    "pro Tag": "par jour",
    "teuerstes Viertel": "quart le plus cher",
    "teurer": "plus cher",
    "untere Zeile: Ø Preis je Stunde": "ligne du bas : prix moyen par heure",
    "verteilt nach {m} – ohne Warmwasser und Grundgebühr": "réparti selon {m} – sans eau chaude ni abonnement",
    "viel Strom": "beaucoup d’électricité",
    "weitere ≈ {v} €": "encore ≈ {v} €",
    "wenig": "peu",
    "{n} Tage{r}": "{n} jours{r}",
    "{p} % des bezahlten Stroms fiel in die günstigsten Stunden – gleichmäßig verteilt wären es 25 %.": "{p} % de l’électricité payée est tombée dans les heures les moins chères – réparti uniformément, ce serait 25 %.",
    "{r}: {p} % – deutlich mehr als die anderen Räume. Ventil, Fühler oder Wunschtemperatur prüfen.": "{r} : {p} % – nettement plus que les autres pièces. Vérifier vanne, sonde ou température souhaitée.",
    "{v} kWh aus nachts geladenem Akku bezahlt": "{v} kWh de batterie chargée la nuit payés",
    "Ölpreis zum Vergleich": "Prix du fioul pour comparer",
    "≈ {v} °C Tagesmittel": "≈ {v} °C moyenne journalière",
    "Jahr ≈ {v} € (letzte 12 Monate)": "année ≈ {v} € (12 derniers mois)",
    "Strom Wärmepumpe": "Électricité PAC",
    "Strom Heizung": "Électricité chauffage",
    "Wohin geht das Geld?": "Où va l’argent ?",
    "Verbrauch pro Monat": "Consommation par mois",
    "Strompreis heute & morgen": "Prix de l’électricité aujourd’hui et demain",
    "Wann läuft die Wärmepumpe?": "Quand la PAC tourne-t-elle ?",
    "Wann wird geheizt?": "Quand chauffe-t-on ?",
    "Heizkennlinie deines Hauses": "Courbe de chauffe de ta maison",
    "Was kostet 1 kWh Wärme?": "Combien coûte 1 kWh de chaleur ?",
    "PV & Akku": "PV et batterie",
    "Was die Heizung im gewählten Zeitraum gekostet hat: jede Stunde Verbrauch × Preis dieser Stunde, Strom aus PV und Akku abgezogen, dazu der Anteil der Grundgebühr. Die Jahreszahl rechnet über die Außentemperatur hoch – oder nimmt die letzten 12 Monate des Zählers.": "Ce que le chauffage a coûté sur la période : consommation de chaque heure × prix de cette heure, moins le PV et la batterie, plus la part de l’abonnement. Le chiffre annuel extrapole via la température extérieure – ou prend les 12 derniers mois du compteur.",
    "Wie viel Energie die Heizung verbraucht hat – bei der Wärmepumpe der Strom. Warmwasser steht getrennt dabei, wenn es einen eigenen Zähler gibt oder aus dem Gesamtzähler aufgeteilt wird.": "Énergie consommée par le chauffage – pour une PAC, l’électricité. L’eau chaude apparaît à part si elle a son propre compteur ou est séparée du compteur total.",
    "Wie viel Wärme im Haus angekommen ist – so wie die Wärmepumpe sie selbst zählt. Daraus und aus dem Strom ergibt sich die Arbeitszahl.": "Chaleur arrivée dans la maison – comptée par la PAC elle-même. Avec l’électricité, cela donne le rendement.",
    "Arbeitszahl: wie viel Wärme aus 1 kWh Strom wird. 4 heißt: 1 kWh Strom → 4 kWh Wärme. Stehen zwei Werte da, zählen zwei Zähler den Strom verschieden – die Wärmepumpe rechnet selbst, ein Energiemanager misst an der Leitung. Die Wahrheit liegt meist dazwischen. Gut sind im Winter 3–4,5, beim Warmwasser 2,5–3,5.": "Rendement : combien de chaleur produit 1 kWh d’électricité. 4 signifie 1 kWh → 4 kWh de chaleur. Deux valeurs : deux compteurs comptent différemment – la PAC estime elle-même, un gestionnaire d’énergie mesure sur la ligne. La vérité est souvent entre les deux. Bon en hiver : 3–4,5, eau chaude 2,5–3,5.",
    "Was du im Schnitt je kWh Netzstrom bezahlt hast – gewichtet nach dem Verbrauch jeder Stunde. Liegt der Wert unter dem Börsen-Mittel, lief die Heizung eher in günstigen Stunden.": "Ce que tu as payé en moyenne par kWh du réseau – pondéré par la consommation de chaque heure. En dessous de la moyenne de la bourse, le chauffage a plutôt tourné aux heures bon marché.",
    "Aktueller Arbeitspreis je kWh, brutto – derselbe Wert, mit dem Dashboard, Bericht und Vergleich rechnen.": "Prix actuel par kWh, TTC – la même valeur pour le tableau de bord, le rapport et la comparaison.",
    "Füllstand des Öltanks und wie lange er bei deinem Verbrauch noch reicht.": "Niveau de la cuve et combien de temps il dure avec ta consommation.",
    "Heizöl-Marktpreis der gewählten Entität im Vergleich zum 30-Tage-Mittel – grün heißt: gerade günstiger als im Schnitt.": "Prix du marché du fioul de l’entité choisie comparé à la moyenne sur 30 jours – vert : moins cher que la moyenne en ce moment.",
    "Strom, den PV-Anlage und Akku in dieser Zeit für die Heizung geliefert haben – kostet nichts und ist bei den Kosten schon abgezogen. Hat der Akku nachts aus dem Netz geladen, zählt dieser Teil zum Ladepreis.": "Électricité fournie au chauffage par le PV et la batterie – gratuite et déjà déduite des coûts. Si la batterie s’est chargée la nuit sur le réseau, cette part compte au prix de charge.",
    "Wie sich die Kosten aufteilen: Heizung, Warmwasser und der Anteil der Grundgebühr. Rechts steht, was der Strom aus PV und Akku zum Börsen-Mittel gekostet hätte.": "Répartition des coûts : chauffage, eau chaude et part de l’abonnement. À droite : ce que l’électricité du PV et de la batterie aurait coûté au prix moyen.",
    "Jeder Balken ist ein Tag (ab 60 Tagen ein Monat): unten Heizung, oben Warmwasser. Die rote Linie ist die Außentemperatur – kalte Tage brauchen mehr. Antippen zeigt die Werte des Tages.": "Chaque barre est un jour (un mois à partir de 60 jours) : chauffage en bas, eau chaude en haut. La ligne rouge est la température extérieure – les jours froids consomment plus. Touche pour voir les valeurs du jour.",
    "Strompreis der nächsten Stunden. Grün ist das günstigste Viertel, orange das teuerste. Die günstigsten drei Stunden am Stück stehen darunter – nur zur Info, Raumklima steuert die Heizung nicht.": "Prix de l’électricité des prochaines heures. Vert : le quart le moins cher, orange : le plus cher. Les trois heures consécutives les moins chères sont indiquées dessous – pour info seulement, Raumklima ne pilote pas le chauffage.",
    "Jedes Kästchen ist eine Stunde der Woche, je kräftiger, desto mehr Verbrauch (Mittel über den Zeitraum). Die untere Zeile zeigt, wann Strom meist günstig (grün) oder teuer (orange) ist. Liegen kräftige Kästchen über Orange, lohnt sich ein Blick in die Einstellungen der Wärmepumpe.": "Chaque case est une heure de la semaine ; plus elle est intense, plus la consommation est forte (moyenne sur la période). La ligne du bas montre quand l’électricité est souvent bon marché (vert) ou chère (orange). Des cases intenses au-dessus de l’orange invitent à revoir les réglages de la PAC.",
    "Jeder Punkt ist ein Tag: Verbrauch gegen Außentemperatur. Die Linie zeigt, wie viel mehr jedes Grad Kälte kostet und ab welcher Außentemperatur dein Haus nicht mehr heizen müsste. Wird sie über die Jahre flacher, wurde gedämmt oder besser eingestellt.": "Chaque point est un jour : consommation selon la température extérieure. La ligne montre combien coûte chaque degré de froid en plus et à partir de quelle température ta maison n’aurait plus besoin de chauffage. Si elle s’aplatit au fil des ans, l’isolation ou les réglages se sont améliorés.",
    "Was 1 kWh Wärme im Haus kostet – deine Heizung im Vergleich mit anderen Wegen. Bei der Wärmepumpe: Strompreis geteilt durch die Arbeitszahl. Vergleichspreise änderst du in den Einstellungen unter Energie.": "Ce que coûte 1 kWh de chaleur dans la maison – ton chauffage comparé à d’autres solutions. Pour une PAC : prix de l’électricité divisé par le rendement. Modifie les prix de comparaison dans les réglages sous Énergie.",
    "Wohin der Solarstrom ging: in die Heizung, ins übrige Haus oder ins Netz. Mit Akku-Sensoren trennt Raumklima, welcher Akku-Strom vorher aus dem Netz geladen wurde – der ist nicht kostenlos.": "Où est allé le solaire : dans le chauffage, le reste de la maison ou le réseau. Avec les capteurs de batterie, Raumklima sépare l’électricité de batterie chargée sur le réseau – elle n’est pas gratuite.",
    "Die Heizkosten verteilt auf die Räume – nach Ventilöffnung × Stunden (oder Heizstunden, wenn kein Ventil meldet). Fällt ein Raum stark heraus, steht ein Hinweis darunter.": "Coûts de chauffage répartis par pièce – selon ouverture de vanne × heures (ou heures de chauffe si aucune vanne ne remonte). Si une pièce se distingue fortement, une remarque apparaît dessous.",
    "Woher der Preis kommt: die Hauptquelle und Reserven, die einspringen, wenn sie nichts liefert. „Mit Vorschau“ heißt: die Quelle kennt auch die Preise der nächsten Stunden.": "D’où vient le prix : la source principale et les réserves qui prennent le relais si elle ne fournit rien. « Avec prévision » : la source connaît aussi les prix des prochaines heures.",
    "Strom im ganzen Haus": "Électricité de toute la maison",
    "übriges Haus": "reste de la maison",
    "Heizung inkl. Warmwasser": "chauffage avec eau chaude",
    "Rechnung Versorger": "Facture fournisseur",
    "Einspeisevergütung ({k} kWh × {p} ct)": "Tarif de rachat ({k} kWh × {p} ct)",
    "Unterm Strich": "Au final",
    "Pro Tag": "Par jour",
    "Ø Netzstrom": "Moy. électricité réseau",
    "Selbst versorgt (PV & Akku)": "Autoconsommation (PV et batterie)",
    "Einspeisevergütung": "Tarif de rachat",
    "€/kWh – steht im Bescheid des Netzbetreibers; 0 = nicht abziehen": "€/kWh – selon le gestionnaire de réseau ; 0 = ne pas déduire",
    "Was der Strom im ganzen Haus gekostet hat – so wie es der Versorger abrechnet: jede Stunde Netzbezug × Preis dieser Stunde plus die volle Grundgebühr. Akku-Ladung aus dem Netz ist im Netzbezug enthalten. Die Einspeisevergütung wird abgezogen, wenn sie in den Einstellungen eingetragen ist.": "Ce qu’a coûté l’électricité de toute la maison – comme le facture le fournisseur : soutirage de chaque heure × prix de cette heure plus l’abonnement complet. La charge de la batterie sur le réseau est incluse. Le tarif de rachat est déduit s’il est renseigné dans les réglages.",
    "Alles aus dem Energie-Dashboard von Home Assistant ist schon eingetragen.": "Tout ce qui figure dans le tableau de bord énergie de Home Assistant est déjà renseigné.",
    "Im Energie-Dashboard von Home Assistant gefunden": "Trouvé dans le tableau de bord énergie de Home Assistant",
    "Übernommen werden nur leere Felder – deine Auswahl bleibt.": "Seuls les champs vides sont remplis – tes choix restent.",
    "Übernommen": "Repris",
    "leer lassen geht: wird aus Netzbezug, PV, Einspeisung und Akku errechnet": "peut rester vide : calculé à partir du soutirage, du PV, de l’injection et de la batterie",
    "optional: Stromverbrauch des ganzen Hauses in kWh – oder Netzbezug, PV-Ertrag und Einspeisung wählen, dann rechnet Raumklima ihn aus": "optionnel : consommation de toute la maison en kWh – ou choisis soutirage, production PV et injection, Raumklima la calcule",
    "Klimaanlage kühlt, wenn der Raum über der Kühlgrenze liegt": "La climatisation refroidit lorsque la pièce dépasse la limite de refroidissement",
    "keine Klimaanlage": "pas de climatisation",
    "Klimaanlage im Reiter „Heizquellen“ mit „Quelle hinzufügen“ eintragen – dann kann der Raum kühlen und mit der Klimaanlage heizen": "Ajoute la climatisation dans l’onglet « Sources de chaleur » avec « Ajouter une source » – la pièce peut alors refroidir et chauffer avec elle",
    "Wärmepumpe lädt Warmwasser": "La pompe à chaleur charge l’eau chaude",
    "Wärmepumpe taut ab": "La pompe à chaleur dégivre",
    "Sperrzeit des Netzbetreibers": "Période de blocage du gestionnaire de réseau",
    "Thermostat misst am Heizkörper schon {v} °C": "Le thermostat mesure déjà {v} °C au radiateur",
    "Ventil ist zu": "La vanne est fermée",
    "Raumklima schreibt die Abweichung zwischen Raumfühler und Thermostat als Korrekturwert ins Gerät – nur bei Geräten mit Kalibrier-Entität. Regelt am genauesten, der Sollwert bleibt unverändert": "Raumklima écrit l'écart entre la sonde de pièce et le thermostat comme valeur de correction dans l'appareil – seulement pour les appareils avec entité de calibrage. Le plus précis, la consigne reste inchangée",
    "Raumklima verschiebt den Sollwert am Thermostat um die Abweichung zwischen Raumfühler und Thermostat-Fühler – für Geräte ohne Korrekturwert (z. B. FRITZ!DECT). Regelt genau, das Ventil bewegt sich dafür öfter. Einen Korrekturwert am Gerät selbst auf 0 lassen": "Raumklima décale la consigne du thermostat de l'écart entre la sonde de pièce et le capteur du thermostat – pour les appareils sans valeur de correction (p. ex. FRITZ!DECT). Précis, mais la vanne bouge plus souvent. Laisser une correction sur l'appareil lui-même à 0",
    "Raumklima schreibt den Sollwert 1:1 – richtig ohne Raumfühler oder wenn Thermostat und Raumfühler sauber übereinstimmen. Mit Raumfühler am Heizkörper-Thermostat meist zu kalt, weil das Thermostat am warmen Heizkörper misst": "Raumklima écrit la consigne 1:1 – correct sans sonde de pièce ou si thermostat et sonde concordent. Avec sonde de pièce souvent trop froid, car le thermostat mesure près du radiateur chaud",
    "Raumklima öffnet das Ventil ganz unter Ziel − ½ Hysterese und schließt es ganz über Ziel + ½ – nach dem Raumfühler, nicht nach dem Thermostat. Wählen, wenn ein Thermostat trotz Ausgleich zu früh schließt oder dauernd nachregelt: weniger Ventilbewegungen und Batterie, dafür etwas mehr Schwankung. Braucht einen Raumfühler": "Raumklima ouvre la vanne entièrement sous la cible − ½ hystérésis et la ferme au-dessus de la cible + ½ – d'après la sonde de pièce, pas le thermostat. À choisir si un thermostat ferme trop tôt ou réajuste sans cesse malgré la compensation : moins de mouvements et de batterie, un peu plus de variation. Nécessite une sonde de pièce",
    "„Offset am Thermostat“ erscheint nur bei Geräten mit Kalibrier-Entität": "« Offset sur le thermostat » n'apparaît que pour les appareils avec entité de calibrage",
    "Lampe/Steckdose hinzufügen": "Ajouter lampe/prise",
    "Lampen und Steckdosen zählen als Anwesenheit": "Lampes et prises comptent comme présence",
    "eingeschaltet heißt: jemand ist im Raum (z. B. Schreibtischlampe, PC-Steckdose) – zählt nur für diesen Raum, nie für „jemand zu Hause“": "allumé signifie : quelqu'un est dans la pièce (p. ex. lampe de bureau, prise du PC) – compte seulement pour cette pièce, jamais pour « quelqu'un à la maison »",
    "eigener Schalter für dieses Büro (z. B. input_boolean je Büro) – dann folgt der Raum nur diesem Schalter, nicht mehr dem allgemeinen Homeoffice": "interrupteur propre à ce bureau (p. ex. un input_boolean par bureau) – la pièce ne suit alors que cet interrupteur, plus le télétravail général",
    "Anmeldung am Server": "Connexion au serveur",
    "„ohne“ nur für Mailserver im eigenen Netz, die ohne Anmeldung annehmen (z. B. Spamfilter auf Port 25)": "« sans » seulement pour les serveurs de messagerie du réseau local qui acceptent sans connexion (p. ex. filtre anti-spam sur le port 25)",
    "mit Benutzer/Passwort": "avec utilisateur/mot de passe",
    "ohne": "sans",
    "nötig ohne Anmeldung – viele Server lehnen Mails ohne Absender ab": "nécessaire sans connexion – beaucoup de serveurs refusent les mails sans expéditeur",
    "Anwesenheit erkennen über": "Détecter la présence via",
    "GPS und WLAN": "GPS et Wi-Fi",
    "nur GPS": "GPS seulement",
    "nur WLAN": "Wi-Fi seulement",
    "WLAN/Router kennt nur „zu Hause“ oder „weg“ – Entfernung und Vorheizen auf der Heimfahrt gehen nur mit GPS": "Le Wi-Fi/routeur ne connaît que « à la maison » ou « absent » – distance et préchauffage sur le trajet nécessitent le GPS",
    "da (WLAN)": "là (Wi-Fi)",
    "da (GPS)": "là (GPS)",
    "Weitere Räume": "Autres pièces",
    "Neue Übersicht testen (Beta)": "Tester la nouvelle vue (bêta)",
    "nach Stockwerk gruppieren": "grouper par étage",
    "ordnet Übersicht und Raumkarten nach den Stockwerken aus Home Assistant (Einstellungen → Bereiche → Stockwerke) – Räume ohne Stockwerk stehen unter „Weitere Räume“. Ausschalten stellt die bisherige Ansicht wieder her.": "regroupe la vue d'ensemble et les cartes par étages de Home Assistant (Paramètres → Pièces → Étages) – les pièces sans étage sont sous « Autres pièces ». Désactiver rétablit la vue précédente.",
    "Eigener Homeoffice-Schalter": "Interrupteur télétravail propre",
    "Schalter oder Helfer (z. B. input_boolean „Büro Anna“) – ist er an, heizt dieser Raum wie im Homeoffice. Der Raum folgt dann nicht mehr dem allgemeinen Homeoffice. Für „jemand ist im Raum“ (z. B. „Gast belegt“) passt besser „Melder/Gerät hinzufügen“ oben.": "Interrupteur ou entrée (p. ex. input_boolean « Bureau Anna ») – allumé, cette pièce chauffe comme en télétravail. La pièce ne suit alors plus le télétravail général. Pour « quelqu'un est dans la pièce » (p. ex. « chambre d'amis occupée ») utilisez plutôt « Ajouter capteur/appareil » ci-dessus.",
    "belegt – „{n}“ ist an": "occupée – « {n} » est allumé",
    "nicht belegt – „{n}“ ist aus, Raum wird abgesenkt": "non occupée – « {n} » est éteint, pièce abaissée",
    "keine Melder eingetragen": "aucun capteur configuré",
    "aus Meldern, Lampen und den Schaltern unter „Gilt für Personen“": "à partir des capteurs, lampes et interrupteurs sous « S'applique aux personnes »",
    "„{n}“ ist an": "« {n} » est allumé",
    "„{n}“ ist aus – Raum wird abgesenkt": "« {n} » est éteint – pièce abaissée",
    "Raum leer": "Pièce vide",
    "Fremdwärme (Kamin/Holzofen)": "Chaleur externe (cheminée/poêle)",
    "Schalter, Helfer oder Binärsensor „Ofen brennt“ – solange er an ist, bleiben die Thermostate in diesem Raum zu, Raumklima meldet nichts zu „zu warm“ und lernt nicht": "Interrupteur, entrée ou capteur binaire « poêle allumé » – tant qu'il est allumé, les thermostats de cette pièce restent fermés, Raumklima ne signale pas « trop chaud » et n'apprend pas",
    "… Nachlauf": "… temporisation",
    "so lange nach dem Ausgehen gilt der Ofen noch – er wärmt nach": "le poêle compte encore ce temps après extinction – il continue de chauffer",
    "Kamin/Holzofen heizt": "Cheminée/poêle chauffe",
    "Kamin/Holzofen": "Cheminée/poêle",
    "Boost läuft ohne Zeitlimit": "Boost actif sans limite",
    "Boost läuft noch {m} min": "Boost actif, encore {m} min",
    "Noch nicht gestartet – Dauer wählen": "Pas encore démarré – choisir une durée",
    "Assistent schließen": "Fermer l’assistant",
    "Tippen: nur dieser Raum · lang drücken: dazu/weg": "Toucher : seulement cette pièce · appui long : ajouter/retirer",
    "Alle": "Toutes",
    "Handverstellt · zurück auf {t} °C": "Réglé à la main · revenir à {t} °C",
    "Der Wunsch weicht vom Grundwert aus den Einstellungen ab (z. B. am Thermostat gedreht).": "La consigne diffère de la valeur de base des réglages (p. ex. tournée sur le thermostat).",
    "Korrektur Raumfühler": "Correction de la sonde",
    "Zeigt der Fühler zu wenig oder zu viel an, hier ausgleichen: zeigt er 21,5 °C, sind es aber 22,2 °C, dann +0,7 K. Raumklima rechnet überall mit dem korrigierten Wert.": "Si la sonde affiche trop peu ou trop, corrigez ici : elle indique 21,5 °C mais il fait 22,2 °C → +0,7 K. Raumklima utilise partout la valeur corrigée.",
    "Fester Sollwert": "Consigne fixe",
    "gerade: {m}": "actuellement : {m}",
    "Aus-Sollwert": "Consigne d’arrêt",
    "Dieser Sollwert gilt, wenn der Raum aus ist – z. B. 16 °C für eine ganze Heizanlage statt der Gerätegrenze": "Cette consigne s’applique quand la pièce est arrêtée – p. ex. 16 °C pour toute une installation au lieu de la limite de l’appareil",
    "Betriebsart nie umschalten": "Ne jamais changer le mode",
    "Raumklima schreibt nur noch Sollwerte und stellt nie Modus oder Preset um – für eine Anlage, die das ganze Haus heizt (z. B. ViCare). Ausschalten dann über Minimaltemperatur oder festen Sollwert.": "Raumklima n’écrit que des consignes et ne change jamais de mode ni de préréglage – pour une installation qui chauffe toute la maison (p. ex. ViCare). L’arrêt passe alors par la température minimale ou une consigne fixe.",
    "Ventil ≈": "Vanne ≈",
    "geschätzt": "estimé",
    "misst gerade {raw} °C → mit Korrektur {cor} °C": "mesure actuellement {raw} °C → {cor} °C avec la correction",
    "Heizt noch nicht": "Ne chauffe pas encore",
    "Gerät heizt – Raum schon warm": "L’appareil chauffe – pièce déjà chaude",
    "Raumklima nimmt den Sollwert am Thermostat zurück": "Raumklima baisse la consigne du thermostat",
    "Volle Breite testen (Beta)": "Tester la pleine largeur (bêta)",
    "volle Breite": "pleine largeur",
    "Einstellungen, Bericht, Protokoll und Energie nutzen die ganze Bildschirmbreite – hilft auf Klapp-Handys und Tablets im Hochformat, wo Home Assistant sonst nur eine schmale Spalte zeigt. Gilt im generierten Dashboard nach dem Neuladen der Seite; ausschalten stellt die bisherige Ansicht wieder her.": "Réglages, rapport, journal et énergie utilisent toute la largeur de l’écran – utile sur les téléphones pliables et tablettes en portrait, où Home Assistant n’affiche sinon qu’une colonne étroite. S’applique au tableau de bord généré après rechargement de la page ; désactiver rétablit l’affichage précédent.",
    "+ weitere Personen ({n})": "+ autres personnes ({n})",
    "nur Bewohner zeigen": "n’afficher que les habitants",
    "Tippen zum Aus-/Abwählen. Zählt, sobald eins ihrer Handys in der Zone ist. Nicht gewählte Personen (z. B. admin) werden ausgeblendet und auch sonst nirgends angeboten.": "Touchez pour (dé)sélectionner. Compte dès qu’un de leurs téléphones est dans la zone. Les personnes non sélectionnées (p. ex. admin) sont masquées et ne sont proposées nulle part ailleurs."
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
  var RK_VERSION = "2.0.1b35";

  // src/styles.js
  var STYLES = `
  .boostwrap { display:inline-flex; align-items:center; flex:none; border-radius:999px; overflow:hidden;
    background: color-mix(in srgb, var(--primary-text-color) 7%, transparent); color: var(--secondary-text-color); }
  .boostwrap.on { background: var(--rk-heat); color:#fff; }
  .boostbtn { all:unset; cursor:pointer; display:inline-flex; gap:5px; align-items:center; padding:5px 4px 5px 12px; border-radius:0; font-weight:600; font-size:.84rem;
    background: transparent; color: inherit; }
  .boostbtn ha-icon { --mdc-icon-size:16px; }
  .boostbtn.on { background: transparent; color:#fff; }
  .boostmore { all:unset; cursor:pointer; display:inline-flex; align-items:center; padding:5px 9px 5px 0; color:inherit; }
  .boostmore ha-icon { --mdc-icon-size:16px; }
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
  .moldb { display:inline-flex; align-items:center; gap:2px; margin-left:6px; padding:1px 6px; border-radius:999px; font-size:.72rem; font-weight:600;
    color:var(--rk-ok); background:color-mix(in srgb, var(--rk-ok) 14%, transparent); vertical-align:middle; }
  .moldb ha-icon { --mdc-icon-size:13px; }
  .chips .chip { white-space:normal; align-items:center; line-height:1.25; }
  .chips .sel { width:auto; max-width:100%; padding:5px 10px; font-size:.9rem; }
  .name { font-size:1.15rem; font-weight:600; letter-spacing:-.01em; cursor:pointer; flex:1 1 auto; min-width:0;
    color:var(--primary-text-color); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .top > .wins, .top > .boostwrap { flex:none; }
  /* Schmale Raumkarten (viele nebeneinander, #86): Boost nur als Symbol, Name notfalls eigene Zeile */
  ha-card.rcard { container-type: inline-size; }
  @container (max-width: 320px) {
    .top .boostbtn > span { display:none; }
    .top .boostbtn { padding:5px 4px 5px 9px; }
  }
  @container (max-width: 250px) {
    .top { flex-wrap:wrap; row-gap:6px; }
    .top > .name { flex:1 0 100%; white-space:normal; overflow-wrap:anywhere; }
  }
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
  .since.sched { color:var(--secondary-text-color); font-weight:500; justify-content:center; text-align:center; }
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
  .rcard.medium { padding:14px 16px; border-radius:22px; }
  .rcard.medium::before { opacity:.12; }
  .mtop { display:flex; align-items:center; gap:8px; min-width:0; }
  .mname { flex:1 1 auto; min-width:0; font-size:1.05rem; font-weight:600; letter-spacing:-.01em; cursor:pointer;
    color:var(--primary-text-color); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .mflags { display:flex; align-items:center; gap:4px; flex:none; }
  .micon { display:inline-flex; align-items:center; gap:3px; color:var(--secondary-text-color); font-size:.75rem; font-weight:600; font-variant-numeric:tabular-nums; }
  .micon ha-icon { --mdc-icon-size:18px; }
  .micon.open, .micon.dehum { color:var(--rk-air); }
  .micon.warn { color:var(--rk-warn); }
  /* Boost-Knopf der mittleren Karte wie bei der großen: grau ohne Boost, rot mit (#88) */
  .mboost { all:unset; cursor:pointer; width:32px; height:32px; border-radius:50%; display:grid; place-items:center;
    color:var(--secondary-text-color); background:color-mix(in srgb, var(--primary-text-color) 7%, transparent); }
  .mboost.on { color:#fff; background:var(--rk-heat); }
  @media (hover: hover) {
    .mboost:not(.on):hover { color:var(--rk-heat); background:color-mix(in srgb, var(--rk-heat) 14%, transparent); }
  }
  .mboost ha-icon { --mdc-icon-size:18px; }
  .mstatus { display:flex; flex-wrap:wrap; align-items:center; gap:6px; margin-top:8px; min-width:0; }
  .mstatus:empty { display:none; }
  .mstatus .chip { padding:4px 9px; font-size:.76rem; white-space:normal; }
  .mmain { display:flex; align-items:flex-end; gap:10px; margin-top:10px; min-width:0; }
  .mnow { flex:none; font-size:2.1rem; font-weight:300; letter-spacing:-.04em; line-height:1; color:var(--primary-text-color); font-variant-numeric:tabular-nums; }
  .mnow small { font-size:.42em; vertical-align:super; margin-left:2px; color:var(--secondary-text-color); }
  .mtarget { flex:1 1 auto; min-width:0; font-size:.82rem; line-height:1.3; color:var(--secondary-text-color); font-variant-numeric:tabular-nums; overflow-wrap:anywhere; }
  .mtarget b { color:var(--primary-text-color); font-weight:600; }
  .mctrl { display:flex; align-items:center; gap:5px; flex:none; }
  .mctrl button.round { width:34px; height:34px; }
  .mctrl button.round ha-icon { --mdc-icon-size:18px; }
  .mmeta { display:flex; flex-wrap:wrap; gap:4px 10px; margin-top:10px; font-size:.76rem; color:var(--secondary-text-color); font-variant-numeric:tabular-nums; }
  .mmeta:empty { display:none; }
  .mmeta span { display:inline-flex; align-items:center; gap:4px; min-width:0; }
  .mmeta ha-icon { --mdc-icon-size:15px; }
  .mmeta .heat { color:var(--rk-heat); }
  .err { padding:16px; color: var(--rk-cold); }
`;
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
  .lchip.all { padding:6px 12px; border-style:dashed; }
  .lchip { -webkit-touch-callout:none; user-select:none; }
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
  .warnline { display:flex; gap:6px; align-items:flex-start; margin-top:6px; font-size:.82rem; color:var(--rk-warn, #e8a33d); }
  .warnline ha-icon { --mdc-icon-size:16px; flex:none; }
  .estep { display:flex; gap:12px; align-items:flex-start; padding:14px 4px 6px; margin-top:6px; border-top:1px solid var(--divider-color, rgba(127,127,127,.2)); }
  .estep:first-of-type { border-top:0; }
  .estep .en { flex:none; width:26px; height:26px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:.85rem; color:#fff; background: var(--g, var(--rk-warn)); }
  .estep b { display:block; font-size:1rem; }
  .estep small { display:block; color: var(--secondary-text-color); font-size:.82rem; margin-top:2px; }
  .ehabox { margin:8px 0 12px; padding:10px 14px; border-radius:12px; background:color-mix(in srgb, var(--rk-ok) 10%, transparent); font-size:.86rem; }
  .ehabox.done { display:flex; gap:8px; align-items:center; color:var(--secondary-text-color); }
  .ehabox .eh-t { display:flex; gap:8px; align-items:center; margin-bottom:6px; } .ehabox ha-icon { --mdc-icon-size:18px; color:var(--rk-ok); }
  .ehabox ul { list-style:none; margin:0; padding:0; display:grid; gap:4px; }
  .ehabox li { display:flex; justify-content:space-between; gap:10px; } .ehabox li span { color:var(--secondary-text-color); } .ehabox li b { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .ehabox .eh-a { display:flex; justify-content:space-between; align-items:center; gap:10px; margin-top:8px; } .ehabox small { color:var(--secondary-text-color); }
  .eguide { margin:6px 0 10px; border-radius:12px; background: color-mix(in srgb, var(--g, var(--rk-warn)) 7%, transparent); padding:0 14px; }
  .eguide summary { cursor:pointer; padding:11px 0; font-weight:600; font-size:.9rem; color: var(--primary-text-color); display:flex; align-items:center; gap:8px; list-style:none; }
  .eguide summary::-webkit-details-marker { display:none; }
  .eguide summary ha-icon { --mdc-icon-size:18px; color: var(--g, var(--rk-warn)); }
  .eguide ul { margin:0 0 12px; padding-left:20px; font-size:.86rem; line-height:1.55; color: var(--primary-text-color); }
  .eguide li { margin:3px 0; }

  .sub { font-weight:600; font-size:.82rem; margin:12px 0 4px; color: var(--secondary-text-color); text-transform: uppercase; letter-spacing:.03em; }
  .whyrules { display:flex; flex-direction:column; gap:5px; }
  .whyrule { display:flex; flex-wrap:wrap; gap:6px; align-items:center; font-size:.9rem; }
  .whyrule.no { opacity:.55; }
  /* Dialog für Sichern/Diagnose/Fehler: echte Knöpfe statt Popup und Blob-Download
     direkt nach einem await – nur so akzeptieren iPad-Safari und die HA-App das. */
  .sheetwrap { position: fixed; inset: 0; z-index: 60; background: rgba(0, 0, 0, .55); backdrop-filter: blur(2px);
    display: flex; align-items: center; justify-content: center; padding: 14px; }
  .sheet { display: flex; flex-direction: column; gap: 10px; width: min(680px, 100%); max-height: 86vh;
    padding: 16px; border-radius: 18px; background: var(--card-background-color, #fff);
    box-shadow: 0 24px 70px rgba(0, 0, 0, .45); }
  .stitle { font-weight: 700; font-size: 1.05rem; }
  .sheet.onb .stitle { display: flex; align-items: center; gap: 8px; }
  .onbx { margin-left: auto; border: 0; background: transparent; font-size: 22px; line-height: 1; cursor: pointer; color: var(--secondary-text-color, #777); padding: 2px 8px; border-radius: 8px; }
  .onbx:focus-visible { outline: 2px solid var(--rk-heat); }
  .sintro { font-size: .85rem; line-height: 1.35; color: var(--secondary-text-color); }
  .sheet .mf .sel { width:100%; }
  .stext { flex: 1 1 auto; min-height: 160px; width: 100%; resize: vertical; padding: 10px; border-radius: 10px;
    border: 1px solid color-mix(in srgb, var(--primary-text-color) 18%, transparent);
    background: var(--secondary-background-color, #f5f5f5); color: var(--primary-text-color);
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: .78rem; line-height: 1.4; }
  .sbtns { display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-end; }
  .sheet.onb { margin: 12px; width: auto; max-height: none; box-shadow: none; background: var(--card-background-color, #fff); }
  .sheet.onb .chips { justify-content: flex-start; }

  details.adv { margin: 12px 0 2px; border-top: 1px solid color-mix(in srgb, var(--primary-text-color) 10%, transparent); }
  details.adv > summary { cursor: pointer; padding: 12px 2px 4px; font-size: .88rem; font-weight: 600; color: var(--secondary-text-color);
    list-style: none; display: flex; align-items: center; gap: 8px; }
  details.adv > summary::-webkit-details-marker { display: none; }
  details.adv > summary::before { content: "▸"; font-size: .8rem; }
  details.adv[open] > summary::before { content: "▾"; }
  details.more > summary .cnt { margin-left: 2px; padding: 1px 7px; border-radius: 999px; font-size: .72rem; font-weight: 600;
    background: color-mix(in srgb, var(--primary-text-color) 9%, transparent); color: var(--secondary-text-color); }
  details.more > summary .chg { width: 7px; height: 7px; border-radius: 50%; background: var(--rk-heat); }
  details.more[open] { padding-bottom: 6px; }
  .btn.on { background: color-mix(in srgb, var(--c, var(--rk-eco)) 30%, transparent); }
  details.sched-collapse { border:1px solid color-mix(in srgb, var(--primary-text-color) 12%, transparent); border-radius:10px; padding:2px 9px; margin:2px 0; }
  details.sched-collapse > summary { cursor:pointer; padding:8px 2px; font-weight:600; font-size:.86rem; color:var(--secondary-text-color); }
  details.sched-collapse > summary::-webkit-details-marker { display:none; }
  details.sched-collapse > summary::before { content:"▸"; font-size:.8rem; margin-right:4px; }
  details.sched-collapse[open] > summary::before { content:"▾"; }
  details.sched-collapse[open] > summary { margin-bottom:4px; }
  .sched { display:flex; flex-wrap:wrap; gap:8px; align-items:center; }
  .sched .days { display:flex; gap:4px; }
  .sched .d { all:unset; cursor:pointer; width:32px; height:27px; line-height:27px; border-radius:8px; text-align:center; font-size:.78rem; font-weight:600;
    background: color-mix(in srgb, var(--primary-text-color) 6%, transparent); color: var(--secondary-text-color); }
  .sched .d.on { background: var(--rk-heat); color:#fff; }
  .sched input.tm { font:inherit; padding:5px 8px; border-radius:8px; border:1px solid color-mix(in srgb, var(--primary-text-color) 14%, transparent);
    background: transparent; color: var(--primary-text-color); }
  /* HH:MM-Felder: der Browser würde <input type="time"> je nach Betriebssystem mit AM/PM zeichnen */
  .inp.hm, .sched input.tm { width: 76px; text-align: center; font-variant-numeric: tabular-nums; }
  .sched .timebtn { min-height:0; width:76px; padding:5px 8px; border-radius:8px; text-align:center; }
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
  .tabs.roomsub { margin:6px -4px 2px; }
  .tabs.roomsub .tab { padding:8px 14px; font-size:.88rem; }
  /* #101: Auf dem Handy die Raum-Unterseiten umbrechen statt seitlich zu scrollen. */
  @container (max-width: 560px) { .tabs.roomsub { flex-wrap:wrap; overflow-x:visible; } .tabs.roomsub .tab { padding:7px 11px; } }
  .roomhead { position:sticky; top:0; z-index:5; display:flex; align-items:center; gap:10px; margin:12px -4px 0; padding:10px 12px;
    border-radius:14px; border-left:4px solid var(--c, var(--rk-heat));
    background:color-mix(in srgb, var(--card-background-color, #fff) 88%, var(--c, var(--rk-heat)));
    box-shadow:0 4px 14px color-mix(in srgb, var(--primary-text-color) 8%, transparent); }
  .roomhead .dot { flex:none; width:11px; height:11px; border-radius:50%; background:var(--c, var(--rk-heat)); }
  .roomhead small { display:block; font-size:.68rem; font-weight:700; letter-spacing:.06em; text-transform:uppercase; color:var(--secondary-text-color); }
  .roomhead b { display:block; font-size:1.18rem; line-height:1.15; color:var(--primary-text-color); }
  .roomhead .rhome { margin-left:auto; max-width:45%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
    font-size:.78rem; color:var(--secondary-text-color); }
  .searching .roomhead, .searching .roomsub, .searching .resetbar { display:none; }
  .issue[data-goto-room] { cursor:pointer; }
  .issue[data-goto-room]:focus-visible { outline:2px solid var(--rk-air); outline-offset:2px; }
  button:focus-visible, input:focus-visible, select:focus-visible, summary:focus-visible { outline:2px solid var(--rk-air); outline-offset:2px; }
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
  .rail.sects { margin-top:14px; padding-bottom:8px; border-bottom:1px solid color-mix(in srgb, var(--primary-text-color) 10%, transparent); }
  .rail.sects .railbtn { font-size:.95rem; padding:9px 16px; }
  .roomlist { margin-top:14px; }
  .roomlist > .hint { margin-top:10px; }
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
  .src { font-size:.66rem; font-weight:650; line-height:1.2; padding:1px 5px; border-radius:999px;
    color:var(--secondary-text-color); background:color-mix(in srgb, var(--primary-text-color) 7%, transparent); white-space:nowrap; }
  .src-room { color:var(--rk-heat); background:color-mix(in srgb, var(--rk-heat) 14%, transparent); }
  .src-device { color:var(--rk-air); background:color-mix(in srgb, var(--rk-air) 14%, transparent); }
  .src-home { color:var(--rk-eco); background:color-mix(in srgb, var(--rk-eco) 14%, transparent); }
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
  .hint.warn { color: var(--rk-warn); font-weight:600; } .hint.okmsg { color: var(--rk-ok); font-weight:600; } .hint.errmsg { color: var(--rk-cold, #e5484d); font-weight:600; }
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
  .selwrap { display:flex; flex-direction:column; gap:5px; min-width:0; max-width:260px; }
  .selwrap .sel, .selwrap .selsearch { max-width:100%; width:100%; }
  .selsearch { font-weight:500 !important; }
  .inp.short { width: 86px; text-align:center; }
  .people { display:grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 520px), 1fr)); gap:14px; }
  @container (max-width: 560px) {
    /* #101: Auf dem Handy breite Bedienelemente (Auswahlknöpfe, Chips, Schnellzugriff, Listen) unter
       die Beschriftung statt daneben – sonst wird der Text zu einer Ein-Wort-Spalte. Zahlenfelder
       und kurze Werte bleiben rechts daneben. */
    .row:not(:has(> .stepper)):not(:has(> .v)):not(:has(> .tgl)) { grid-template-columns: minmax(0,1fr); row-gap: 10px; }
    .row:not(:has(> .stepper)):not(:has(> .v)):not(:has(> .tgl)) > :not(.l) { justify-self: stretch; min-width: 0; }
    .row { column-gap: 16px; }
    .row .chips { justify-content: flex-start; margin-left: 0; flex-wrap: wrap; }
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
  .twheel { box-sizing:border-box; height:120px; overflow-y:auto; scroll-snap-type:y mandatory; padding:40px 0; width:74px;
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
  .rtile .rchg { font-size:.68rem; font-weight:650; line-height:1.3; padding:1px 6px; border-radius:999px;
    color:var(--primary-text-color); background:color-mix(in srgb, var(--rk-heat) 18%, transparent); }
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
  var DASH_STYLES = `
  .dashcard { --tone: var(--rk-warn); }
  .dhead { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
  .dhead .grow { flex:1 1 180px; min-width:0; }
  .dtitle { display:flex; align-items:center; gap:8px; font-weight:650; font-size:1.05rem; }
  .dtitle ha-icon { --mdc-icon-size:22px; color:var(--tone); }
  .dsub { font-size:.8rem; color:var(--secondary-text-color); margin-top:2px; }
  .dseg { display:flex; gap:4px; flex-wrap:wrap; }
  .dseg button { all:unset; cursor:pointer; padding:5px 10px; border-radius:999px; font-size:.78rem; font-weight:600;
    color:var(--secondary-text-color); background:color-mix(in srgb, var(--primary-text-color) 6%, transparent); }
  .dseg button.on { background:color-mix(in srgb, var(--tone) 18%, transparent); color:var(--tone); }
  .dtiles { display:grid; grid-template-columns:repeat(auto-fit,minmax(112px,1fr)); gap:8px; margin-top:12px; }
  .dtile { border-radius:16px; padding:10px 12px; background:color-mix(in srgb, var(--primary-text-color) 5%, transparent); min-width:0; }
  .dtile .k { display:flex; align-items:center; gap:4px; font-size:.72rem; text-transform:uppercase; letter-spacing:.06em; color:var(--secondary-text-color); }
  .dtile .k ha-icon { --mdc-icon-size:14px; }
  .dtile .n { margin-top:3px; font-size:1.35rem; font-weight:600; line-height:1.15; font-variant-numeric:tabular-nums; color:var(--primary-text-color); }
  .dtile .n small { margin-left:4px; font-size:.72rem; font-weight:500; color:var(--secondary-text-color); }
  .dtile .d { margin-top:3px; font-size:.76rem; color:var(--secondary-text-color); }
  .drows { display:grid; gap:6px; margin-top:12px; }
  .drow { display:flex; align-items:baseline; justify-content:space-between; gap:10px; padding:8px 10px; border-radius:12px;
    background:color-mix(in srgb, var(--primary-text-color) 4%, transparent); font-size:.86rem; }
  .drow .l { display:flex; align-items:center; gap:6px; color:var(--secondary-text-color); min-width:0; }
  .drow .l ha-icon { --mdc-icon-size:15px; flex:none; }
  .drow .v { font-weight:600; text-align:right; font-variant-numeric:tabular-nums; overflow-wrap:anywhere; }
  .dempty { display:flex; align-items:flex-start; gap:9px; margin-top:12px; padding:12px 14px; border-radius:14px;
    background:color-mix(in srgb, var(--rk-warn) 10%, transparent); color:var(--secondary-text-color); font-size:.9rem; line-height:1.35; }
  .dempty ha-icon { --mdc-icon-size:20px; color:var(--rk-warn); flex:none; }
  .dlrow { padding:10px 12px; border-radius:14px; background:color-mix(in srgb, var(--primary-text-color) 4%, transparent); }
  .dlrow .ltop { display:flex; align-items:center; gap:8px; min-width:0; }
  .dlrow .ltop .name { flex:1 1 auto; font-weight:600; font-size:.92rem; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .dlrow .ltop .pct { font-size:.76rem; font-weight:600; color:var(--tone); }
  .dlrow .meta { margin-top:5px; font-size:.82rem; color:var(--secondary-text-color); line-height:1.35; }
  .dlrow .tags { display:flex; flex-wrap:wrap; gap:5px; margin-top:7px; }
  .dlrow .tag { display:inline-flex; align-items:center; gap:4px; padding:3px 8px; border-radius:999px; font-size:.72rem;
    color:var(--secondary-text-color); background:color-mix(in srgb, var(--primary-text-color) 6%, transparent); }
  .dlrow .tag ha-icon { --mdc-icon-size:13px; }
  .dbar { height:6px; border-radius:6px; background:color-mix(in srgb, var(--tone) 16%, transparent); overflow:hidden; margin-top:7px; }
  .dbar > i { display:block; height:100%; background:var(--tone); border-radius:6px; }
  .dnote { margin-top:9px; font-size:.78rem; color:var(--secondary-text-color); }
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

  // src/util.js
  var esc = (v) => String(v ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  var escRe = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  function rkRelevantPersons(all, residents, keep = []) {
    const list = Array.isArray(all) ? all : [];
    const res = Array.isArray(residents) ? residents : [];
    if (!res.length) return list;
    return list.filter((p) => res.includes(p.id) || keep.includes(p.id));
  }
  function rkSensorReading(state, offset) {
    const raw = parseFloat(state);
    if (!Number.isFinite(raw)) return null;
    const off = Number(offset) || 0;
    return { raw, corrected: Math.round((raw + off) * 10) / 10 };
  }
  function toneVar(tone) {
    return `var(--rk-${tone || "off"})`;
  }

  // src/rooms.js
  var RK_COLORS = ["#ff7a45", "#4f9dff", "#a78bfa", "#2ec4a6", "#ffb020", "#f472b6", "#22d3ee", "#84cc16"];
  var RK_LAYOUT_EMPTY = { order: [], hidden: [], size: {}, color: {}, beta_floors: false, beta_panel: false };
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
  function rkEnhanceSelects(html, { admin = true, min = 8 } = {}) {
    const coll = new Intl.Collator(loc(), { sensitivity: "base", numeric: true });
    const re = /<select class="sel"([^>]*)>([\s\S]*?)<\/select>/g;
    let out = "";
    let last = 0;
    let m;
    while (m = re.exec(html)) {
      const [whole, attrs, inner] = m;
      const opts = inner.match(/<option\b[^>]*>[\s\S]*?<\/option>/g) || [];
      let repl = whole;
      if (opts.length > min && !/<optgroup/.test(inner)) {
        const text = (o) => o.replace(/<[^>]+>/g, "").trim();
        const empty = opts.filter((o) => /value=""/.test(o));
        const rest = opts.filter((o) => !/value=""/.test(o));
        const sorted = /data-nosort/.test(attrs) ? rest : [...rest].sort((a, b) => coll.compare(text(a), text(b)));
        repl = `<select class="sel"${attrs}>${[...empty, ...sorted].join("")}</select>`;
        const before = html.slice(Math.max(0, m.index - 400), m.index);
        const wrapped = before.lastIndexOf("data-selsearch") > before.lastIndexOf("</select>");
        if (!wrapped) {
          const dis = /\sdisabled\b/.test(attrs) || !admin ? "disabled" : "";
          repl = `<div class="selwrap" data-selwrap><input class="inp selsearch" type="search" placeholder="${esc(t("Suchen …"))}" aria-label="${esc(t("Suchen …"))}" data-selsearch autocomplete="off" ${dis}>${repl}</div>`;
        }
      }
      out += html.slice(last, m.index) + repl;
      last = m.index + whole.length;
    }
    return out + html.slice(last);
  }
  function rkOccupancy(a) {
    const sw = a && a.room_switches || [];
    const on = sw.filter((x) => x.on).map((x) => x.name);
    if (a && a.occupied === true) return { in: true, why: t("Jemand im Raum") };
    if (on.length) return { in: true, why: t("„{n}“ ist an", { n: on.join("“, „") }) };
    if (sw.length) return { in: false, switch: true, why: t("„{n}“ ist aus – Raum wird abgesenkt", { n: sw.map((x) => x.name).join("“, „") }) };
    if (a && a.occupied === false) return { in: false, switch: false, why: t("Raum leer") };
    return null;
  }
  function rkFloorOf(hass, entityId) {
    const ent = (hass && hass.entities || {})[entityId] || {};
    const dev = ent.device_id ? (hass && hass.devices || {})[ent.device_id] || {} : {};
    const area = (hass && hass.areas || {})[ent.area_id || dev.area_id] || null;
    return area && area.floor_id ? (hass && hass.floors || {})[area.floor_id] || null : null;
  }
  function rkFloorGroups(hass, rooms) {
    const groups = /* @__PURE__ */ new Map();
    for (const r of rooms || []) {
      const fl = rkFloorOf(hass, r.id || r.entity_id);
      const key = fl ? fl.floor_id || fl.name : "";
      if (!groups.has(key)) groups.set(key, { floor: fl, rooms: [] });
      groups.get(key).rooms.push(r);
    }
    if (![...groups.values()].some((g) => g.floor)) return [];
    const lvl = (g) => g.floor ? g.floor.level ?? 0 : Number.MAX_SAFE_INTEGER;
    return [...groups.values()].sort((a, b) => lvl(a) - lvl(b) || String(a.floor ? a.floor.name : "").localeCompare(String(b.floor ? b.floor.name : ""))).map((g) => ({ ...g, name: g.floor ? g.floor.name : t("Weitere Räume"), icon: g.floor && g.floor.icon || (g.floor ? "mdi:home-floor-" + Math.max(0, Math.min(3, g.floor.level ?? 0)) : "mdi:home-outline") }));
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

  // src/labels.js
  var RK_ROOM_TYPES = tmap({ living: "Wohnraum", kitchen: "Küche", bedroom: "Schlafzimmer", bathroom: "Bad", children: "Kinderzimmer", office: "Arbeitszimmer", guest: "Gästezimmer", hallway: "Flur", gym: "Sportzimmer", rarely_used: "Selten genutzt" });
  var RK_CAL = tmap({ offset: "Offset am Thermostat", target: "Sollwert-Ausgleich", none: "Ohne Abgleich", hysteresis: "Hysterese (auf/zu)" });
  var RK_OFF = tmap({ auto: "Automatisch", preset: "Preset „aus“", hvac: "Modus „aus“", min_temp: "Minimaltemperatur", setpoint: "Fester Sollwert" });
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
      const jump = i.entry_id ? ` data-goto-room="${esc(i.entry_id)}" role="button" tabindex="0" title="${t("zum Raum springen")}"` : "";
      return `<div class="issue"${jump} style="--c:${toneVar(sv[0])}"><ha-icon icon="${sv[1]}"></ha-icon><div><b>${withRoom && i.room ? esc(prefix ? i.room.startsWith(prefix) ? i.room.slice(prefix.length).trimStart() : i.room : i.room) + ": " : ""}${esc(i.title)}</b><small>${esc(i.message)}</small></div><span class="tag">${sv[2]}</span></div>`;
    }).join("")}</div>`;
  }
  function rkPretty(target) {
    const s = String(target || "").replace(/^(notify|tts|media_player)\./, "").replace(/^mobile_app_/, "");
    return s.split("_").filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join(" ") || target;
  }

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
  var STATUS = tmap({
    heating: { label: "Heizt", icon: "mdi:fire", tone: "heat" },
    idle: { label: "Temperatur erreicht", icon: "mdi:check-circle", tone: "ok" },
    waiting: { label: "Heizt noch nicht", icon: "mdi:timer-sand", tone: "heat" },
    window_open: { label: "Pausiert – Fenster offen", icon: "mdi:window-open-variant", tone: "air" },
    off: { label: "Aus", icon: "mdi:power", tone: "off" },
    off_trv: { label: "Aus – am Thermostat abgeschaltet", icon: "mdi:power-plug-off", tone: "off" },
    sensor_unavailable: { label: "Fühler ausgefallen", icon: "mdi:thermometer-alert", tone: "warn" },
    trv_unavailable: { label: "Thermostat nicht erreichbar", icon: "mdi:lan-disconnect", tone: "warn" },
    season_off: { label: "Heizpause", icon: "mdi:weather-sunny", tone: "off" },
    external_heat: { label: "Kamin/Holzofen heizt", icon: "mdi:fireplace", tone: "heat" },
    setback: { label: "Abgesenkt – niemand da", icon: "mdi:home-export-outline", tone: "eco" },
    night_airing: { label: "Nachtlüften – Fenster offen", icon: "mdi:weather-night", tone: "air" }
  });
  function waitReasonText(r) {
    if (!r || !r.kind) return "";
    if (r.kind === "dhw") return t("Wärmepumpe lädt Warmwasser");
    if (r.kind === "defrost") return t("Wärmepumpe taut ab");
    if (r.kind === "lock") return t("Sperrzeit des Netzbetreibers");
    if (r.kind === "trv_satisfied") return t("Thermostat misst am Heizkörper schon {v} °C", { v: fmt(r.value) });
    if (r.kind === "valve_closed") return t("Ventil ist zu");
    return "";
  }
  function statusFor(a) {
    const s = STATUS[a.status] || STATUS.idle;
    if (a.status === "heating" && a.heating_warm) return { label: t("Gerät heizt – Raum schon warm"), icon: "mdi:fire-alert", tone: "warn", reason: a.overheat_trim ? t("Raumklima nimmt den Sollwert am Thermostat zurück") : "" };
    const why = a.status === "waiting" ? waitReasonText(a.wait_reason) : "";
    return why ? { ...s, label: `${s.label} – ${why}`, reason: why } : s;
  }
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
  function moldBadge(a) {
    const u = a && a.mold_under;
    if (!u || a.plan_reason !== "mold" || a.effective_target == null) return "";
    const tip = u.target != null ? t("Schimmelschutz hält {v}° (statt {u}°)", { v: fmt(a.effective_target), u: fmt(u.target) }) : t("Schimmelschutz hält {v}°", { v: fmt(a.effective_target) });
    return `<span class="moldb" title="${esc(tip)}"><ha-icon icon="mdi:shield-half-full"></ha-icon>${esc(fmt(a.effective_target))}°</span>`;
  }
  function planTag(a) {
    const r = a && a.plan_reason;
    if (!r || r === "normal" || r === "manual" || r === "monitor") return "";
    const map = {
      mold: "Schimmel",
      schedule: "Zeitplan",
      schedule_preheat: "Vorheizen",
      presence_preheat: "Vorwärmen",
      home_office: "Homeoffice",
      presence: "Anwesend",
      device_auto: "Automatik",
      boost: "Boost",
      sleep: "Ruhezeit",
      away_short: "Abgesenkt",
      away_long: "Abgesenkt",
      room_empty: "Leer",
      solar: "Sonne",
      frost: "Frost",
      valve_care: "Ventilpflege",
      season: "Heizpause",
      external_heat: "Kamin/Holzofen"
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
      if (r === "presence_preheat") return t("Vorwärmen · {v}°", { v: fmt(tgt) });
      if (r === "home_office") return t("Homeoffice · {v}°", { v: fmt(tgt) });
      if (r === "presence") return t("Anwesend · {v}°", { v: fmt(tgt) });
      if (r === "device_auto") return t("Automatik am Gerät");
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
    if (r === "presence_preheat" && a.effective_target != null) return t("Vorwärmen – der Raum ist um diese Zeit meist belegt · <b>{v} °C</b>", { v: fmt(a.effective_target) });
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
    const own = (d) => d.hasAttribute("data-more") || d.hasAttribute("data-schedcollapse") || d.hasAttribute("data-mailbox");
    const keyOf = (d) => d.dataset.guide || d.dataset.keep || `${d.className}|${((d.querySelector("summary") || {}).textContent || "").trim().slice(0, 80)}`;
    const opened = /* @__PURE__ */ new Map();
    if (root.querySelectorAll) root.querySelectorAll("details").forEach((d) => {
      if (!own(d)) opened.set(keyOf(d), d.open);
    });
    const drafts = /* @__PURE__ */ new Map();
    if (root.querySelectorAll) root.querySelectorAll("[data-draft]").forEach((el) => {
      if (el.value) drafts.set(el.dataset.draft, el.value);
    });
    root.innerHTML = html;
    if (drafts.size) {
      root.querySelectorAll("[data-draft]").forEach((el) => {
        const v = drafts.get(el.dataset.draft);
        if (v !== void 0 && !el.value) el.value = v;
        else if (v !== void 0 && el.tagName === "SELECT") el.value = v;
      });
    }
    if (opened.size) {
      root.querySelectorAll("details").forEach((d) => {
        if (own(d)) return;
        const k = keyOf(d);
        if (opened.has(k) && d.open !== opened.get(k)) d.open = opened.get(k);
      });
    }
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
  function rkTrackPointer(host) {
    if (host._rkPtrTracked || !host.shadowRoot || !host.shadowRoot.addEventListener) return;
    host._rkPtrTracked = true;
    host.shadowRoot.addEventListener("pointerdown", () => {
      host._rkPtr = true;
    }, true);
    const up = () => {
      if (!host._rkPtr) return;
      host._rkPtr = false;
      const after = host._rkAfterPtr;
      host._rkAfterPtr = null;
      if (after) setTimeout(after, 60);
    };
    window.addEventListener("pointerup", up, true);
    window.addEventListener("pointercancel", up, true);
  }
  function rkPointerHeld(host, after) {
    if (!host._rkPtr) return false;
    host._rkAfterPtr = after;
    return true;
  }
  var fmt = (v, d = 1) => v === null || v === void 0 || isNaN(v) ? "–" : Number(v).toLocaleString(loc(), { minimumFractionDigits: d, maximumFractionDigits: d });
  var humTone = (h) => h === null || h === void 0 ? "off" : h < 40 ? "warn" : h <= 60 ? "ok" : h < 70 ? "warn" : "cold";
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
  var SEG = tmap({
    season_off: { c: "color-mix(in srgb, var(--rk-off) 25%, transparent)", l: "Heizpause" },
    external_heat: { c: "color-mix(in srgb, var(--rk-heat) 45%, transparent)", l: "Kamin/Holzofen" },
    setback: { c: "var(--rk-eco)", l: "Abgesenkt" },
    heating: { c: "var(--rk-heat)", l: "Heizt" },
    idle: { c: "var(--rk-ok)", l: "Erreicht" },
    waiting: { c: "color-mix(in srgb, var(--rk-heat) 45%, transparent)", l: "Wartet" },
    window_open: { c: "var(--rk-air)", l: "Fenster offen" },
    night_airing: { c: "color-mix(in srgb, var(--rk-air) 55%, #1e2a5a)", l: "Nachtlüften" },
    off: { c: "color-mix(in srgb, var(--rk-off) 45%, transparent)", l: "Aus" },
    sensor_unavailable: { c: "var(--rk-warn)", l: "Fühler fehlt" },
    trv_unavailable: { c: "var(--rk-cold)", l: "TRV weg" }
  });
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
@media (hover: hover){.bschip:hover{border-color:var(--rk-heat,#e8590c)}}
.bschip.def{border-color:var(--rk-heat,#e8590c);font-weight:600}
.bslabel.on{color:var(--rk-heat,#e8590c);font-weight:600}
`;
  function boostMinutes(a) {
    const n = Number(a && a.settings && a.settings.boost_minutes);
    return Number.isFinite(n) && n > 0 ? Math.max(5, Math.min(240, n)) : 30;
  }
  function rkHandAdjusted(a, mon, isOff) {
    if (mon || isOff || !a) return false;
    if ((a.settings && a.settings.schedules || []).length) return false;
    if (a.boost_until || a.boost_open) return false;
    const wish = Number(a.wish);
    const base = Number(a.comfort_temperature);
    if (!Number.isFinite(wish) || !Number.isFinite(base)) return false;
    return Math.abs(wish - base) >= 0.25;
  }
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
      this._config = { ...config, variant: config.variant === "medium" ? "medium" : "full" };
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
      return this._config && this._config.variant === "medium" ? 3 : 6;
    }
    getGridOptions() {
      return { columns: 6, min_columns: 4, rows: "auto" };
    }
    set hass(hass) {
      this._hass = hass;
      setLang(hass);
      const st = hass.states[this._config.entity];
      const ids = [this._config.entity, ...Object.values(this._siblings()), ...st && st.attributes.window_entities || [], ...st && st.attributes.dehumidifier_entity ? [st.attributes.dehumidifier_entity] : []];
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
    // Zeitplan in einer Zeile: „20 °C bis 20:00 · danach 17 °C“ (Issue #52)
    _schedLine(a) {
      const st = a.schedule_status;
      if (!st) return "";
      const hm = (iso) => {
        const d = new Date(iso);
        if (Number.isNaN(d.getTime())) return "";
        const time = rkTime(d, { hour: "2-digit", minute: "2-digit" });
        const today = /* @__PURE__ */ new Date();
        const days = Math.round((new Date(d.getFullYear(), d.getMonth(), d.getDate()) - new Date(today.getFullYear(), today.getMonth(), today.getDate())) / 864e5);
        if (days === 0) return time;
        if (days === 1) return t("morgen {t}", { t: time });
        return `${d.toLocaleDateString(loc(), { weekday: "short" })} ${time}`;
      };
      let text;
      if (st.active) {
        text = st.until ? t("Zeitplan: {v} °C bis {u} · danach {o} °C", { v: fmt(st.temp, 1), u: hm(st.until), o: fmt(st.after != null ? st.after : st.outside, 1) }) : t("Zeitplan: {v} °C ganztägig", { v: fmt(st.temp, 1) });
      } else if (st.next) {
        text = t("Zeitplan: ab {u} {v} °C · bis dahin {o} °C", { u: hm(st.next), v: fmt(st.next_temp, 1), o: fmt(st.outside, 1) });
      } else {
        text = t("Zeitplan: kein Fenster in den nächsten 24 h · {o} °C", { o: fmt(st.outside, 1) });
      }
      return `<div class="since sched"><ha-icon icon="mdi:calendar-clock"></ha-icon><span>${esc(text)}</span></div>`;
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
      const chip = (mode, min, label, isDef = false) => `<button class="bschip${isDef ? " def" : ""}" data-bs="${mode}"${min ? ` data-min="${min}"` : ""}>${label}</button>`;
      const def = Number(boostMinutes(a));
      const fixed = [[15, t("15 min")], [30, t("30 min")], [60, t("1 h")], [120, t("2 h")]];
      return `<style>${BOOST_CSS}</style>
      <div class="bsheet">
        <div class="bshead"><ha-icon icon="mdi:fire"></ha-icon><span>${t("Wärmer für kurze Zeit")}</span><button class="bsx" data-bsclose aria-label="${t("schließen")}">×</button></div>
        <div class="btl">
          <div class="btlbar"><i class="btlfill" style="width:${width}%"></i></div>
          <div class="btlticks">${ticks}</div>
        </div>
        <div class="bslabel ${active ? "on" : ""}">${active ? mins == null ? t("Boost läuft ohne Zeitlimit") : t("Boost läuft noch {m} min", { m: mins }) : t("Noch nicht gestartet – Dauer wählen")}</div>
        <div class="bschips">
          ${fixed.some(([m]) => m === def) ? "" : chip("minutes", null, `${t("{n} min", { n: def })} (${t("Standard")})`, true)}
          ${fixed.map(([m, label]) => chip("minutes", m, m === def ? `${label} (${t("Standard")})` : label, m === def)).join("")}
          ${chip("next", null, t("Bis Zeitfenster"))}${chip("unlimited", null, t("Ohne Limit"))}
          ${active ? chip("off", null, t("Beenden")) : ""}
        </div>
      </div>`;
    }
    async _resume() {
      const st = this._hass && this._hass.states[this._config.entity];
      const entry = st && st.attributes && st.attributes.room;
      if (!entry) return;
      try {
        await this._hass.connection.sendMessagePromise({ type: "raumklima/room/resume", entry_id: entry });
        this._pending = null;
        this._render();
      } catch (e) {
        console.error("raumklima resume:", e);
      }
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
    _renderMedium({ a, sib, mon, status, target, isOff, name, accent, winOpen }) {
      const cfgS = a.settings || {};
      const boostMin = boostMinutes(a);
      const boostOn = !!(a.boost_until || a.boost_open);
      const calOff = a.offset != null ? a.offset : a.offset_auto;
      const trvNote = !mon && a.trv_target != null && a.temperature != null && Math.abs(a.trv_target - a.temperature) >= 0.3 ? calOff != null && Math.abs(calOff) >= 0.1 ? t("Thermostat {v}° (Abgleich {o}°)", { v: fmt(a.trv_target), o: (calOff > 0 ? "+" : "") + fmt(calOff) }) : t("Thermostat {v}°", { v: fmt(a.trv_target) }) : "";
      const targetText = mon ? a.humidity_sensor ? `${fmt(a.current_humidity, 0)} %` : t("nur Messen") : this._pending != null ? t("Ziel <b>{v} °C</b>", { v: fmt(target) }) : planText(a, isOff, true);
      const meta = [
        a.humidity_sensor && !mon ? `<span><ha-icon icon="mdi:water-percent"></ha-icon>${fmt(a.current_humidity, 0)} %</span>` : "",
        a.valve_position != null ? `<span class="${a.hvac_action === "heating" ? "heat" : ""}"><ha-icon icon="mdi:valve"></ha-icon>${t("Ventil")} ${fmt(a.valve_position, 0)} %</span>` : "",
        a.outdoor_temperature != null ? `<span><ha-icon icon="mdi:weather-partly-cloudy"></ha-icon>${t("außen")} ${fmt(a.outdoor_temperature)}°</span>` : ""
      ].join("");
      const look = rkLook(this._config);
      const dark = look !== "classic" && rkDark(this._hass, this._config, cfgS);
      this._html = `<style>${STYLES}${rkLookStyles(look)}</style>
      <ha-card class="rcard medium ${look === "classic" ? "" : look}${dark ? " dark" : ""}" style="--tone:${toneVar(status.tone)}; --accent:${accent || "transparent"}">
        <div class="mtop">
          <div class="mname" data-more="${this._config.entity}" title="${esc(name)}">${name}</div>
          <div class="mflags">
            ${a.window_open !== void 0 ? `<span class="micon ${winOpen ? "open" : ""}" title="${winOpen ? t("Fenster offen") : t("Fenster geschlossen")}"><ha-icon icon="${winOpen ? "mdi:window-open-variant" : "mdi:window-closed-variant"}"></ha-icon></span>` : ""}
            ${!mon && sib.boost ? `<button class="mboost ${boostOn ? "on" : ""}" data-boostmain title="${boostOn ? t("Boost beenden") : `${t("Dauer des Boosts")}: ${t("{n} min", { n: boostMin })}`}" aria-label="${boostOn ? t("Boost beenden") : `${t("Dauer des Boosts")}: ${t("{n} min", { n: boostMin })}`}"><ha-icon icon="mdi:fire"></ha-icon></button>` : ""}
          </div>
        </div>
        <div class="mstatus">
          <span class="chip"><ha-icon icon="${status.icon}"></ha-icon>${status.label}${mon ? "" : moldBadge(a)}</span>
          ${a.dehumidifier_active ? `<span class="micon dehum" title="${esc(a.dehumidifier_maxed ? t("Entfeuchter läuft ohne Besserung") : t("Entfeuchter läuft"))}"><ha-icon icon="mdi:air-humidifier"></ha-icon>${a.dehumidifier_since ? `<span>${rkDuration(Date.now() - Date.parse(a.dehumidifier_since))}</span>` : ""}</span>` : ""}
          ${a.battery && a.battery.low ? `<span class="micon warn" title="${esc(t("Batterie {p} %", { p: a.battery.level }))}"><ha-icon icon="mdi:battery-alert-variant-outline"></ha-icon></span>` : ""}
          ${boostOn ? `<span class="chip" style="--tone:var(--rk-heat)"><ha-icon icon="mdi:fire"></ha-icon>${t("Boost")} ${a.boost_open ? "∞" : t("bis {t}", { t: rkClock(Date.parse(a.boost_until)) })}</span>` : ""}
        </div>
        ${trvNote ? `<div class="trvnote" title="${esc(trvNote)}"><ha-icon icon="mdi:thermometer-lines"></ha-icon><span>${trvNote}</span></div>` : ""}
        ${winOpen && this._winSince ? `<div class="since"><ha-icon icon="mdi:window-open-variant"></ha-icon><span data-since></span></div>` : ""}
        <div class="mmain">
          <div class="mnow">${fmt(a.current_temperature)}<small>°C</small></div>
          <div class="mtarget">${targetText}</div>
          ${mon ? "" : `<div class="mctrl">
            <button class="round" data-step="-0.5" ${isOff ? "disabled" : ""} aria-label="${t("kälter")}"><ha-icon icon="mdi:minus"></ha-icon></button>
            <button class="round" data-power aria-label="${t("an/aus")}" style="${isOff ? "" : "color:var(--tone)"}"><ha-icon icon="mdi:power"></ha-icon></button>
            <button class="round" data-step="0.5" ${isOff ? "disabled" : ""} aria-label="${t("wärmer")}"><ha-icon icon="mdi:plus"></ha-icon></button>
          </div>`}
        </div>
        ${meta ? `<div class="mmeta">${meta}</div>` : ""}
      </ha-card>`;
      this._bind(isOff);
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
      const status = mon ? { label: t("Überwachung"), icon: "mdi:eye-outline", tone: "eco" } : statusFor(a);
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
      if (this._config.variant === "medium") {
        this._renderMedium({ a, sib, mon, status, target, isOff, name, accent, winOpen });
        return;
      }
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
        a.valve_position === null || a.valve_position === void 0 ? a.valve_estimate != null && !mon ? stat("mdi:valve", t("Ventil ≈"), `${fmt(a.valve_estimate, 0)} %<small>${t("geschätzt")}</small>`, a.valve_estimate > 0 ? "heat" : null, null) : "" : stat("mdi:valve", (a.valve_sources || 0) > 1 ? t("Ventil Ø") : t("Ventil"), `${fmt(a.valve_position, 0)} %`, valveTone, a.valve_sensor),
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
      const boostMin = boostMinutes(a);
      const boostLabel = t("{n} min", { n: boostMin });
      const boostOn = !!(a.boost_until || a.boost_open);
      this._html = `<style>${STYLES}${rkLookStyles(look)}</style>
      <ha-card class="rcard ${look === "classic" ? "" : look}${dark ? " dark" : ""}" style="--tone:${toneVar(status.tone)}; --accent:${accent || "transparent"}">
        <div class="top">
          <div class="name" data-more="${this._config.entity}" title="${esc(name)}">${name}</div>
          ${a.window_open !== void 0 ? `<div class="wins"><ha-icon class="${winOpen ? "open" : ""}" icon="${winOpen ? "mdi:window-open-variant" : "mdi:window-closed-variant"}"></ha-icon></div>` : ""}
          ${!mon && sib.boost ? `<span class="boostwrap ${boostOn ? "on" : ""}">
            <button class="boostbtn ${boostOn ? "on" : ""}" data-boostmain title="${boostOn ? t("Boost beenden") : `${t("Dauer des Boosts")}: ${boostLabel}`}" aria-label="${boostOn ? t("Boost beenden") : `${t("Dauer des Boosts")}: ${boostLabel}`}"><ha-icon icon="mdi:fire"></ha-icon>${a.boost_open ? `<span>∞</span>` : a.boost_until ? `<span>${t("bis {t}", { t: rkClock(Date.parse(a.boost_until)) })}</span>` : `<span>${t("Boost")} ${boostLabel}</span>`}</button>
            <button class="boostmore" data-boostopen title="${t("Dauer des Boosts")}" aria-label="${t("Dauer des Boosts")}"><ha-icon icon="mdi:chevron-down"></ha-icon></button>
          </span>` : ""}
        </div>
        ${this._boostOpen ? this._boostSheet(a) : ""}
        <div class="chips">
          <span class="chip"><ha-icon icon="${status.icon}"></ha-icon>${status.label}${mon ? "" : moldBadge(a)}</span>
          ${a.dehumidifier_active ? `<span class="chip" style="--tone:${a.dehumidifier_maxed ? "var(--rk-warn)" : "var(--rk-air)"}" title="${esc(a.dehumidifier_entity || "")}"><ha-icon icon="mdi:air-humidifier"></ha-icon>${a.dehumidifier_maxed ? t("Entfeuchter läuft ohne Besserung") : t("Entfeuchter läuft")}${a.dehumidifier_since ? ` · ${rkDuration(Date.now() - Date.parse(a.dehumidifier_since))}` : ""}</span>` : ""}
          ${a.battery && a.battery.low ? `<span class="chip" style="--tone:var(--rk-warn)" title="${esc(a.battery.name)}"><ha-icon icon="mdi:battery-alert-variant-outline"></ha-icon>${t("Batterie {p} %", { p: a.battery.level })}</span>` : ""}
          ${a.notify_paused_until ? `<span class="chip" style="--tone:var(--rk-warn)" title="${t("Hinweise für diesen Raum pausiert")}"><ha-icon icon="mdi:bell-off-outline"></ha-icon>${t("Pause bis {time}", { time: new Date(a.notify_paused_until).toLocaleTimeString(loc(), { hour: "2-digit", minute: "2-digit" }) })}</span>` : ""}
        </div>
        ${trvNote ? `<div class="trvnote" title="${esc(trvNote)}"><ha-icon icon="mdi:thermometer-lines"></ha-icon><span>${trvNote}</span></div>` : ""}
        ${(() => {
        const o = rkOccupancy(a);
        if (!o) return "";
        const text = o.in ? o.why : o.switch ? o.why : "";
        return `<div class="since occ ${o.in ? "in" : ""}" title="${esc(o.why)}"><ha-icon icon="${o.in ? "mdi:account" : "mdi:account-off-outline"}"></ha-icon><span ${!o.in && !o.switch ? "data-empty" : ""}>${esc(text)}</span></div>`;
      })()}
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
        ${mon || isOff ? "" : this._schedLine(a)}
        <div class="stats">${stats}</div>
        ${devLine}
        <div class="actions">
          ${!mon && a.override_until && Date.parse(a.override_until) > Date.now() ? `<button class="pill" data-resume style="--c:var(--rk-eco)"><ha-icon icon="mdi:calendar-check-outline"></ha-icon>${(a.settings && a.settings.schedules || []).length ? t("Zeitplan fortsetzen") : t("Wunschtemperatur fortsetzen")}</button>` : rkHandAdjusted(a, mon, isOff) ? `<button class="pill" data-resume style="--c:var(--rk-eco)" title="${t("Der Wunsch weicht vom Grundwert aus den Einstellungen ab (z. B. am Thermostat gedreht).")}"><ha-icon icon="mdi:hand-back-left-outline"></ha-icon>${t("Handverstellt · zurück auf {t} °C", { t: fmt(Number(a.comfort_temperature), 1) })}</button>` : ""}
          ${wlogic ? `<button class="pill ${wlogic.state === "on" ? "on" : ""}" data-toggle="${sib.window_logic}"><ha-icon icon="mdi:window-shutter-auto"></ha-icon>${t("Fensterlogik")}</button>` : ""}
          ${notif ? `<button class="pill ${notif.state === "on" ? "on" : ""}" data-toggle="${sib.notifications}"><ha-icon icon="${notif.state === "on" ? "mdi:bell-ring-outline" : "mdi:bell-off-outline"}"></ha-icon>${t("Hinweise")}</button>` : ""}
          ${mon ? "" : `<span class="sync ${syncCls}"><ha-icon icon="${a.sync === "ok" ? "mdi:check-circle-outline" : "mdi:sync"}"></ha-icon>${syncLabel}</span>`}
        </div>
      </ha-card>`;
      this._bind(isOff);
    }
    _bind(isOff) {
      this.shadowRoot.querySelectorAll("[data-step]").forEach((b) => b.addEventListener("click", () => this._step(parseFloat(b.dataset.step))));
      const p = this.shadowRoot.querySelector("[data-power]");
      if (p) p.addEventListener("click", () => this._call("climate", isOff ? "turn_on" : "turn_off", { entity_id: this._config.entity }));
      this.shadowRoot.querySelectorAll("[data-toggle]").forEach((b) => b.addEventListener("click", () => this._call("switch", "toggle", { entity_id: b.dataset.toggle })));
      const resume = this.shadowRoot.querySelector("[data-resume]");
      if (resume) resume.addEventListener("click", (ev) => {
        ev.stopPropagation();
        this._resume();
      });
      this.shadowRoot.querySelectorAll("[data-boostmain]").forEach((b) => b.addEventListener("click", (ev) => {
        ev.stopPropagation();
        const st = this._hass.states[this._config.entity];
        const attrs = st && st.attributes;
        if (attrs && (attrs.boost_until || attrs.boost_open)) {
          this._boost("off");
        } else {
          this._boost("minutes");
        }
      }));
      this.shadowRoot.querySelectorAll("[data-boostopen]").forEach((b) => b.addEventListener("click", (ev) => {
        ev.stopPropagation();
        this._boostOpen = !this._boostOpen;
        this._render();
        const sheet = this._boostOpen && this.shadowRoot.querySelector(".bsheet");
        if (sheet && sheet.scrollIntoView) sheet.scrollIntoView({ block: "nearest", behavior: "smooth" });
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
  var RaumklimaMediumCard = class extends RaumklimaCard {
    setConfig(config) {
      super.setConfig({ ...config, variant: "medium" });
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
      const hoSt = hubIds.home_office ? this._hass.states[hubIds.home_office] : null;
      const hoActive = !!(hoSt && (hoSt.state === "on" || hoSt.attributes.active_now));
      const pres = presSt ? PRESENCE[presSt.state] : null;
      const seas = seasSt ? SEASON[seasSt.state] : null;
      const people = presSt ? Object.entries(presSt.attributes.persons || {}) : [];
      const cal = this._cfg && this._cfg.hub && this._cfg.hub.state && this._cfg.hub.state.calendar || null;
      const calCur = cal && (cal.events || [])[0];
      const calNext = cal && (cal.upcoming || [])[0];
      const calWhen = (e) => e && e.all_day ? String(e.start || "").slice(0, 10) : String(e && e.start || "").slice(11, 16);
      const calLine = calCur || calNext ? `<div class="cal" style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:8px 0 0;font-size:.8rem;color:var(--secondary-text-color)">${calCur ? `<span class="chip">📅 ${esc(calCur.summary)} · ${calWhen(calCur)}</span>` : ""}${calNext ? `<span class="next" style="opacity:.8">${t("Als Nächstes")}: ${esc(calNext.summary)} · ${calWhen(calNext)}</span>` : ""}</div>` : "";
      const row = (r) => {
        const a = r.attributes;
        const mon = a.monitor === true;
        const s = mon ? { label: t("Überwachung"), tone: "eco", icon: "mdi:eye-outline" } : statusFor(a);
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
          ${(() => {
          const o = rkOccupancy(a);
          if (!o || !o.in && !o.switch) return "";
          return `<ha-icon class="occ${o.in ? "" : " off"}" icon="${o.in ? "mdi:account" : "mdi:account-off-outline"}" title="${esc(o.why)}"></ha-icon>`;
        })()}
          ${a.dehumidifier_active ? `<span class="dehum${a.dehumidifier_maxed ? " maxed" : ""}" title="${esc(a.dehumidifier_maxed ? t("Entfeuchter läuft ohne Besserung") : t("Entfeuchter läuft"))}"><ha-icon icon="mdi:air-humidifier"></ha-icon>${a.dehumidifier_since ? `<span>${rkDuration(Date.now() - Date.parse(a.dehumidifier_since))}</span>` : ""}</span>` : ""}
          ${a.window_open ? `<span class="wopen"><ha-icon class="win" icon="mdi:window-open-variant"></ha-icon>${(() => {
          const s2 = rkOpenSince(this._hass, a);
          return s2 ? `<span title="${t("offen seit {c}", { c: rkClock(s2) })}">${rkDuration(Date.now() - s2)}</span>` : "";
        })()}</span>` : ""}</div>
        <div class="rn">${esc(name)}</div>
        <div class="rs">${label}${mon ? "" : moldBadge(a)}${trvNote}</div>
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
      .floor + .floor { margin-top:22px; }
      .fhead { display:flex; align-items:center; gap:8px; margin:6px 2px 10px; font-weight:650; font-size:.95rem; color:var(--primary-text-color); }
      .fhead ha-icon { --mdc-icon-size:20px; color:var(--secondary-text-color); }
      .fhead span { font-weight:500; font-size:.8rem; color:var(--secondary-text-color); }
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
      .occ.off { color: var(--secondary-text-color); opacity:.8; }
      .dehum { display:inline-flex; align-items:center; gap:3px; margin-left:auto; margin-right:6px; padding:1px 6px 1px 4px; border-radius:999px; background:color-mix(in srgb, var(--rk-air) 16%, transparent); color:var(--rk-air); font-size:.78rem; font-weight:600; font-variant-numeric:tabular-nums; }
      .dehum ha-icon { --mdc-icon-size:16px; animation: rkdehum 2.4s ease-in-out infinite; }
      .dehum.maxed { color:var(--rk-warn); background:color-mix(in srgb, var(--rk-warn) 16%, transparent); }
      .occ + .dehum { margin-left:0; }
      @keyframes rkdehum { 0%,100% { opacity:1; } 50% { opacity:.45; } }
      @media (prefers-reduced-motion: reduce) { .dehum ha-icon { animation:none; } }
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
        ${pres && presSt.attributes.configured ? people.map(([id, p]) => {
        const place = p.place === "home" ? t("Zuhause") : p.place === "away" ? t("unterwegs") : p.place && p.place !== "unknown" ? p.place : t("unbekannt");
        const isHome = p.present === true || p.place === "home";
        const tone = isHome ? "ok" : p.approaching ? "warn" : p.place === "away" ? "cold" : p.place && p.place !== "unknown" ? "air" : "off";
        const icon = isHome ? "mdi:home-account" : p.approaching ? "mdi:car-arrow-right" : p.place === "away" ? "mdi:home-export-outline" : p.place && p.place !== "unknown" ? "mdi:map-marker-outline" : "mdi:account-question-outline";
        return `<span class="chip" data-more="${esc(id)}" style="--tone:${toneVar(tone)};cursor:pointer"><ha-icon icon="${icon}"></ha-icon>${esc(p.name)} · ${esc(place)}</span>`;
      }).join("") : ""}
        ${pres && presSt.attributes.configured && presSt.state === "preheat" && presSt.attributes.preheat_by ? `<span class="chip" data-more="${hubIds.presence}" style="--tone:${toneVar("heat")};cursor:pointer"><ha-icon icon="mdi:home-clock"></ha-icon>${t("Vorheizen")} · ${esc(presSt.attributes.preheat_by)}</span>` : ""}
        ${seas ? `<span class="chip" data-more="${hubIds.heating_mode}" style="--tone:${toneVar(seas.tone)};cursor:pointer"><ha-icon icon="${seas.icon}"></ha-icon>${seas.label}${seasSt.attributes.mean_combined != null ? ` · Ø ${fmt(seasSt.attributes.mean_combined)}°` : ""}</span>` : ""}
        ${hoActive ? `<span class="chip" data-more="${hubIds.home_office}" style="--tone:${toneVar("heat")};cursor:pointer"><ha-icon icon="mdi:home-city"></ha-icon>${t("Homeoffice")}</span>` : ""}
      </div>
      ${calLine}
      ${(() => {
        const groups = this._layout && this._layout.beta_floors ? rkFloorGroups(this._hass, rows) : [];
        if (!groups.length) return `<div class="rooms">${rows.map(row).join("")}</div>`;
        return groups.map((g) => `<div class="floor"><div class="fhead"><ha-icon icon="${esc(g.icon)}"></ha-icon>${esc(g.name)}<span>${g.rooms.length}</span></div><div class="rooms">${g.rooms.map(row).join("")}</div></div>`).join("");
      })()}
    </ha-card>`;
      this.shadowRoot.querySelectorAll("[data-more]").forEach((b) => b.addEventListener("click", () => this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: b.dataset.more }, bubbles: true, composed: true }))));
      this.shadowRoot.querySelectorAll("[data-nav]").forEach((el) => el.addEventListener("click", () => {
        history.pushState(null, "", el.dataset.nav);
        window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: false } }));
      }));
    }
  };

  // src/cards/history.js
  function rkSoloToggle(hidden, allIds, id, additive) {
    const next = new Set(hidden);
    if (additive) {
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    }
    const visible = allIds.filter((x) => !hidden.has(x));
    if (visible.length === 1 && visible[0] === id) return /* @__PURE__ */ new Set();
    return new Set(allIds.filter((x) => x !== id));
  }
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
      const fresh = rkRooms(hass, this._config.strip_prefix || "", rkHomeId(hass, this._config));
      this._rooms = this._layout ? rkRoomsOrdered(fresh, this._layout) : fresh;
      const roomKey = fresh.map((r) => r.id).sort().join("|");
      const changed = roomKey !== this._roomKey;
      this._roomKey = roomKey;
      if (!this._layout && !this._layoutLoading) {
        this._layoutLoading = true;
        rkLayout(hass, rkHomeId(hass, this._config)).then((L) => {
          this._layout = L;
          this._rooms = rkRoomsOrdered(this._rooms || [], L);
          this._draw();
        });
      }
      if (first || changed) this._load();
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
    // Monotone Kurve (Fritsch–Carlson): glatt, aber ohne Über- und Unterschwinger. Die frühere
    // Catmull-Rom-Kurve schoss bei Fühlern mit 0,5-K-Stufen (FRITZ!DECT) über die Messwerte hinaus
    // und ließ Linien benachbarter Räume scheinbar kreuzen (#73).
    _smooth(pts) {
      const n = pts.length;
      if (n < 2) return n ? `M${pts[0][0]},${pts[0][1]}` : "";
      const dx = [], m = [];
      for (let i = 0; i < n - 1; i++) {
        dx.push(pts[i + 1][0] - pts[i][0]);
        m.push(dx[i] ? (pts[i + 1][1] - pts[i][1]) / dx[i] : 0);
      }
      const tan = [m[0]];
      for (let i = 1; i < n - 1; i++) tan.push(m[i - 1] * m[i] <= 0 ? 0 : 3 * (dx[i - 1] + dx[i]) / ((2 * dx[i] + dx[i - 1]) / m[i - 1] + (dx[i] + 2 * dx[i - 1]) / m[i]));
      tan.push(m[n - 2]);
      let d = `M${pts[0][0]},${pts[0][1]}`;
      for (let i = 0; i < n - 1; i++) {
        const h = dx[i] / 3;
        d += ` C${pts[i][0] + h},${pts[i][1] + tan[i] * h} ${pts[i + 1][0] - h},${pts[i + 1][1] - tan[i + 1] * h} ${pts[i + 1][0]},${pts[i + 1][1]}`;
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
      const all = () => [...this.shadowRoot.querySelectorAll("[data-room]")].map((x) => x.dataset.room);
      this.shadowRoot.querySelectorAll("[data-room]").forEach((b) => {
        let timer = null;
        let long = false;
        b.addEventListener("pointerdown", () => {
          long = false;
          timer = setTimeout(() => {
            long = true;
          }, 500);
        });
        const clear = () => {
          clearTimeout(timer);
          timer = null;
        };
        b.addEventListener("pointerup", clear);
        b.addEventListener("pointerleave", clear);
        b.addEventListener("contextmenu", (ev) => ev.preventDefault());
        b.addEventListener("click", (ev) => {
          const additive = long || ev.ctrlKey || ev.metaKey || ev.shiftKey;
          long = false;
          this._hidden = rkSoloToggle(this._hidden, all(), b.dataset.room, additive);
          this._draw();
        });
      });
      const allBtn = this.shadowRoot.querySelector("[data-allrooms]");
      if (allBtn) allBtn.addEventListener("click", () => {
        this._hidden = /* @__PURE__ */ new Set();
        this._draw();
      });
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
        return `<button class="lchip ${this._hidden.has(r.id) ? "off" : ""}" data-room="${r.id}" style="--c:${r.color}" title="${t("Tippen: nur dieser Raum · lang drücken: dazu/weg")}"><i></i>${esc(r.name)}<b>${isNaN(v) ? "–" : fmt(v, m === "temperature" ? 1 : 0) + unit}</b></button>`;
      }).join("") + (rooms.some((r) => this._hidden.has(r.id)) ? `<button class="lchip all" data-allrooms>${t("Alle")}</button>` : "");
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
          return `<div class="r" style="--c:${s.r.color}"><span><i></i>${esc(s.r.name)}</span><b>${fmt(p[1], m === "temperature" ? 1 : 0)}${unit}</b></div>`;
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
        return `<div class="n">${esc(r.name)}</div><div class="bar">${status}${wins}</div>`;
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
    "Korrektur Raumfühler": ["Gleicht einen Fühler aus, der dauerhaft zu viel oder zu wenig misst. Zeigt er 21,5 °C, sind es aber 22,2 °C, dann +0,7 K eintragen. Raumklima rechnet überall mit dem korrigierten Wert.", "Corrects a sensor that reads consistently too high or too low. If it shows 21.5 °C but it is 22.2 °C, enter +0.7 K. Raumklima uses the corrected value everywhere.", "Corrige une sonde qui mesure toujours trop ou trop peu. Si elle affiche 21,5 °C alors qu’il fait 22,2 °C, saisissez +0,7 K. Raumklima utilise partout la valeur corrigée."],
    "Aus-Sollwert": ["Bei „Ausschalten über: fester Sollwert“ stellt Raumklima das Gerät auf diesen Wert statt auf seine Mindesttemperatur – sinnvoll, wenn eine einzige Anlage das ganze Haus heizt.", "With “switch off via: fixed setpoint”, Raumklima sets the device to this value instead of its minimum – useful when one system heats the whole house.", "Avec « arrêt par : consigne fixe », Raumklima règle l’appareil sur cette valeur au lieu de son minimum – utile quand une seule installation chauffe toute la maison."],
    "Betriebsart nie umschalten": ["Raumklima schreibt nur Sollwerte und stellt nie Modus oder Preset um. Für Anlagen, bei denen ein Moduswechsel mehr betrifft als den Raum, z. B. Viessmann/ViCare (Heizen = Dauerbetrieb, Aus = auch kein Warmwasser).", "Raumklima only writes setpoints and never changes mode or preset. For systems where a mode change affects more than the room, e.g. Viessmann/ViCare (heat = permanent operation, off = no hot water either).", "Raumklima n’écrit que des consignes et ne change jamais de mode ni de préréglage. Pour les installations où un changement de mode concerne plus que la pièce, p. ex. Viessmann/ViCare."],
    "Fremdwärme (Kamin/Holzofen)": ["Schalter, Helfer oder Sensor, der „Ofen brennt“ meldet. Ist er an, bleiben die Thermostate des Raums zu, damit sie nicht gegen den Ofen heizen. Frostschutz gilt weiter.", "Switch, helper or sensor reporting “stove is burning”. While it is on, the room’s thermostats stay closed so they don’t heat against the stove. Frost protection still applies.", "Interrupteur, entrée ou capteur signalant « le poêle brûle ». Tant qu’il est actif, les thermostats de la pièce restent fermés pour ne pas chauffer contre le poêle. La protection antigel reste active."],
    "… Nachlauf": ["So lange bleiben die Thermostate nach dem Ausschalten noch zu, weil Kamin oder Ofen nachglühen. 0 = sofort wieder normal regeln.", "How long the thermostats stay closed after switching off, because the fireplace or stove keeps glowing. 0 = return to normal control immediately.", "Durée pendant laquelle les thermostats restent fermés après l’arrêt, car la cheminée ou le poêle continue de rayonner. 0 = reprise immédiate de la régulation."],
    "Kühlen": ["Klimaanlage kühlt, wenn der Raum über der Kühlgrenze liegt.", "Air conditioning cools when the room is above the cooling limit.", "La climatisation refroidit lorsque la pièce dépasse la limite de refroidissement."],
    "Klimaanlage zum Heizen": ["Erlaubt der Klimaanlage, den Raum auch zu heizen. Raumklima vergleicht dafür COP und Gaspreis; nur wenn die Klimaanlage günstiger ist, übernimmt sie.", "Allows the AC to heat the room. Raumklima compares COP and gas price; it only takes over when the AC is cheaper.", "Autorise la climatisation à chauffer la pièce. Raumklima compare le COP et le prix du gaz ; elle ne prend le relais que si elle est moins chère."],
    "Sollwert am Gerät": ["Der Sollwert, der tatsächlich am Thermostat oder Stellglied steht – kann durch Handbedienung oder Geräte-Zeitplan abweichen.", "The setpoint actually present on the thermostat or actuator – can differ due to manual control or the device schedule.", "La consigne réellement présente sur le thermostat ou l’actionneur – peut différer en cas de commande manuelle ou de programme de l’appareil."],
    "COP": ["Jahresarbeitszahl der Klimaanlage als Wärmepumpe. 3 bedeutet: 1 kWh Strom liefert 3 kWh Wärme. Höher ist besser.", "Seasonal performance factor of the AC as a heat pump. 3 means 1 kWh of electricity delivers 3 kWh of heat. Higher is better.", "Coefficient de performance annuel de la climatisation comme pompe à chaleur. 3 signifie que 1 kWh d’électricité fournit 3 kWh de chaleur. Plus haut est mieux."],
    "Kühlgrenze": ["Oberhalb dieser Temperatur kühlt die Klimaanlage.", "Above this temperature the air conditioning cools.", "Au-delà de cette température, la climatisation refroidit."],
    "Mindestlaufzeit": ["So lange bleibt die Klimaanlage nach dem Einschalten mindestens an. Größere Werte verhindern häufiges Takten, kosten aber Komfort.", "The air conditioner stays on for at least this long after switching on. Larger values prevent frequent cycling but cost comfort.", "La climatisation reste allumée au moins ce temps après la mise en marche. Des valeurs plus élevées évitent les cycles fréquents, mais coûtent du confort."],
    "Mindestpause": ["So lange bleibt die Klimaanlage nach dem Ausschalten mindestens aus. Das schützt den Kompressor und reduziert unnötige Starts.", "The air conditioner stays off for at least this long after switching off. This protects the compressor and reduces unnecessary starts.", "La climatisation reste éteinte au moins ce temps après l’arrêt. Cela protège le compresseur et réduit les démarrages inutiles."],
    "Energie-Erfassung": ["Zähler, Tarife und PV-Ertrag auswerten.", "Analyse meters, tariffs and PV yield.", "Analyse compteurs, tarifs et rendement PV."],
    "Energiequelle": [
      "Legt fest, wie der Zähler gelesen wird: Gas in m³ über Brennwert und Zustandszahl, Heizöl in Litern über den Energieinhalt, Wärmepumpen zählen Strom und optional die erzeugte Wärme, Fernwärme zählt kWh.",
      "Defines how the meter is read: gas in m³ via calorific value and correction factor, heating oil in litres via its energy content, heat pumps count electricity and optionally the heat produced, district heating counts kWh.",
      "Définit la lecture du compteur : le gaz en m³ via le pouvoir calorifique et le facteur de correction, le fioul en litres via son contenu énergétique, les pompes à chaleur comptent l’électricité et éventuellement la chaleur produite, le chauffage urbain compte les kWh."
    ],
    "Gas-Umrechnung": [
      "Wie viele kWh stecken in einem m³ Gas? Brennwert × Zustandszahl; 10 kWh/m³ ist ein typischer Näherungswert. Genau steht beides auf der Gasabrechnung.",
      "How many kWh are in one m³ of gas? Calorific value × correction factor; 10 kWh/m³ is a typical approximation. Both are shown on the gas bill.",
      "Combien de kWh contient un m³ de gaz ? Pouvoir calorifique × facteur de correction ; 10 kWh/m³ est une approximation typique. Les deux figurent sur la facture de gaz."
    ],
    "Wärmemenge": ["Erzeugte Heizwärme der Wärmepumpe als Gesamtzähler in kWh (z. B. „Erzeugte Heizwärme gesamt“). Zusammen mit dem Stromzähler ergibt das die gemessene Arbeitszahl – und damit, was eine kWh Wärme wirklich kostet.", "Heat produced by the heat pump as a total meter in kWh (e.g. “heat produced total”). Together with the electricity meter this gives the measured efficiency – and what a kWh of heat really costs.", "Chaleur produite par la PAC en compteur total kWh (p. ex. « chaleur produite totale »). Avec le compteur électrique, cela donne le rendement mesuré – et le vrai coût d’un kWh de chaleur."],
    "Jahresarbeitszahl": [
      "Wie viel Wärme die Wärmepumpe aus einer kWh Strom macht. 3,0 ist ein guter Richtwert; 0 lässt die Angabe offen und rechnet nur mit Strom.",
      "How much heat the heat pump makes from one kWh of electricity. 3.0 is a good reference; 0 leaves it open and counts electricity only.",
      "Combien de chaleur la pompe à chaleur produit à partir d’un kWh d’électricité. 3,0 est une bonne référence ; 0 laisse la valeur ouverte et ne compte que l’électricité."
    ],
    "PV-Eigenverbrauch": [
      "Welcher Anteil des PV-Ertrags den eigenen Verbrauch deckt. Nur eintragen, wenn der Zähler den Gesamtverbrauch misst – bei einem reinen Netzbezugszähler ist der PV-Anteil schon abgezogen.",
      "Which share of PV yield covers your own consumption. Only enter this if the meter measures total consumption – with a grid-import-only meter the PV share is already deducted.",
      "Part du rendement PV couvrant votre propre consommation. À renseigner uniquement si le compteur mesure la consommation totale – avec un compteur de soutirage réseau, la part PV est déjà déduite."
    ],
    "Zähler": ["Verbrauchsquelle. Bei einer Wärmepumpe den Stromzähler der Wärmepumpe wählen (kWh, dauerhaft steigend); Tages- oder Wochenwerte mit Reset sind ungeeignet. Die Wärmemenge kommt separat in ihr eigenes Feld.", "Consumption source. For a heat pump, choose the heat pump electricity meter (kWh, continuously increasing); daily or weekly values that reset are unsuitable. Heat output goes in its own field.", "Source de consommation. Pour une pompe à chaleur, choisissez le compteur électrique de la PAC (kWh, croissant en continu) ; les valeurs journalières ou hebdomadaires qui se réinitialisent ne conviennent pas. La chaleur produite va dans son propre champ."],
    "PV-Ertrag": ["PV-Erzeugung oder Einspeisung als Gesamtzähler, der immer weiter steigt (kWh, `total_increasing`). Tages- oder Wochenwerte mit Reset sind ungeeignet.", "PV yield or feed-in as a lifetime total that keeps increasing (kWh, `total_increasing`). Daily or weekly values that reset are unsuitable.", "Rendement PV ou injection en compteur cumulé qui augmente en continu (kWh, `total_increasing`). Les valeurs journalières ou hebdomadaires qui se réinitialisent ne conviennent pas."],
    "Aktuell": ["Aktueller Messwert der gewählten Entität.", "Current reading of the selected entity.", "Valeur actuelle de l’entité choisie."],
    "Entitäten": ["Anzahl aller Entitäten in Home Assistant.", "Number of all entities in Home Assistant.", "Nombre de toutes les entités dans Home Assistant."],
    "Home Assistant": ["Version von Home Assistant.", "Home Assistant version.", "Version de Home Assistant."],
    "Integration": ["Version der Raumklima-Integration.", "Raumklima integration version.", "Version de l’intégration Raumklima."],
    "Offene Hinweise": ["Anzahl der offenen Gesundheitshinweise.", "Number of open health notices.", "Nombre d’avis de santé ouverts."],
    "Python": ["Python-Version von Home Assistant.", "Python version used by Home Assistant.", "Version Python utilisée par Home Assistant."],
    "Sturm": ["Böen-Schwelle für die Sturmwarnung.", "Gust threshold for the storm warning.", "Seuil de rafales pour l’alerte tempête."],
    "Wind": ["Windgeschwindigkeit aus der Wetterquelle.", "Wind speed from the weather source.", "Vitesse du vent de la source météo."],
    "Zeitzone": ["Zeitzone von Home Assistant.", "Home Assistant time zone.", "Fuseau horaire de Home Assistant."],
    "Preisbasis": ["Ob der Tarif-Sensor brutto oder netto liefert.", "Whether the tariff sensor reports gross or net.", "Si le capteur de tarif indique brut ou net."],
    "MwSt.": ["Mehrwertsteuer für den Nettopreis.", "VAT for the net price.", "TVA pour le prix net."],
    "Zusätzliche Abgaben": ["Nur nötig, wenn der Preis-Sensor den reinen Börsenpreis liefert: Netzentgelt, Umlagen, Stromsteuer, Konzessionsabgabe und Aufschlag des Anbieters in €/kWh. Bei „netto“ kommt die MwSt auf beides drauf. Netzentgelte ändern sich jedes Jahr zum 1. Januar.", "Only needed if the price sensor delivers the bare exchange price: grid fee, levies, electricity tax, concession fee and supplier surcharge in €/kWh. With “net”, VAT is added to both. Grid fees change every 1 January.", "Seulement si le capteur fournit le prix de bourse brut : frais de réseau, contributions, taxe, redevance et marge du fournisseur en €/kWh. En « HT », la TVA s’ajoute aux deux. Les frais de réseau changent chaque 1er janvier."],
    "Feuchte": ["Relative Luftfeuchte aus der Wetterquelle.", "Relative humidity from the weather source.", "Humidité relative de la source météo."],
    "Sonne": ["Stand der Sonne über/unter dem Horizont.", "Sun position above/below the horizon.", "Position du soleil au-dessus/en dessous de l’horizon."],
    "Kälteeinbruch": ["Schwelle für die Kälteeinbruch-Warnung.", "Threshold for the cold-snap warning.", "Seuil d’alerte de vague de froid."],
    "Räume": ["Anzahl der Raumklima-Räume.", "Number of Raumklima rooms.", "Nombre de pièces Raumklima."],
    "Grundpreis": ["Monatliche Grundgebühr in € brutto, wie auf der Rechnung. Zählt anteilig zu den Kosten des Zeitraums.", "Monthly base fee in € gross, as on the bill. Counted pro rata in the period’s costs.", "Abonnement mensuel en € TTC, comme sur la facture. Compté au prorata dans les coûts de la période."],
    "Arbeitspreis": ["Fester Preis je kWh brutto von der Rechnung. Gilt, wenn keine Preisquelle gewählt ist oder keine einen Wert liefert.", "Fixed price per kWh gross from the bill. Used when no price source is chosen or none delivers a value.", "Prix fixe par kWh TTC de la facture. Utilisé si aucune source de prix n’est choisie ou n’en fournit."],
    "Ölpreis": ["Preis je Liter Heizöl. Raumklima rechnet ihn über den Energieinhalt auf kWh um.", "Price per litre of heating oil. Raumklima converts it to kWh via the energy content.", "Prix du litre de fioul. Raumklima le convertit en kWh via le contenu énergétique."],
    "kWh je Liter": ["Energieinhalt eines Liters Heizöl. 10 kWh/L ist ein typischer Näherungswert; genau steht er auf der Lieferung.", "Energy content of one litre of heating oil. 10 kWh/L is a typical approximation; the exact value is on the delivery note.", "Contenu énergétique d’un litre de fioul. 10 kWh/L est une approximation typique ; la valeur exacte figure sur la livraison."],
    "Tankfüllstand": ["Optionaler Fühler für den Öltank. Aus sinkendem Füllstand schätzt Raumklima Verbrauch und Resttage; Nachfüllungen werden ignoriert.", "Optional oil tank sensor. From a falling level Raumklima estimates consumption and remaining days; refills are ignored.", "Capteur facultatif du réservoir de fioul. À partir du niveau qui baisse, Raumklima estime la consommation et les jours restants ; les remplissages sont ignorés."],
    "Tankinhalt": ["Nenninhalt des Tanks in Litern. Nötig, wenn der Fühler Prozent statt Liter meldet.", "Nominal tank capacity in litres. Needed when the sensor reports percent instead of litres.", "Capacité nominale du réservoir en litres. Nécessaire si le capteur indique des pourcentages au lieu de litres."],
    "Öl bestellen ab": ["Restmenge in Prozent, ab der der Bestellhinweis erscheint. Zusätzlich warnt Raumklima, wenn der Vorrat weniger als 14 Tage reicht.", "Remaining amount in percent at which the reorder hint appears. Raumklima also warns when the supply lasts less than 14 days.", "Quantité restante en pourcentage à partir de laquelle le rappel de commande apparaît. Raumklima avertit aussi si la réserve dure moins de 14 jours."],
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
    "Marktpreis-Entität": ["Optionale Entität mit dem aktuellen Markt-/Börsenpreis in €/L. Raumklima vergleicht sie mit dem 30-Tage-Mittel und deinem eigenen Preis.", "Optional entity with the current market/stock price in €/L. Raumklima compares it with the 30-day average and your own price.", "Entité facultative avec le prix actuel du marché/boursier en €/L. Raumklima le compare à la moyenne sur 30 jours et à votre propre prix."],
    "Letzter Winter (Liter)": ["Liter aus dem letzten Winter. Raumklima rechnet daraus einen groben Tagesverbrauch für die Planung.", "Litres from last winter. Raumklima derives a rough daily consumption for planning.", "Litres du dernier hiver. Raumklima en déduit une consommation journalière approximative pour la planification."],
    "Letzter Winter (Tage)": ["Zeitraum des letzten Winters in Tagen, damit der Tagesverbrauch stimmt.", "Period of last winter in days so the daily consumption is right.", "Période du dernier hiver en jours pour que la consommation journalière soit correcte."],
    "Preisverlauf": ["Preise, die beim Ändern des Ölpreises automatisch notiert werden. Der letzte Wert gilt für die Kostenschätzung.", "Prices recorded automatically when the oil price changes. The latest value is used for the cost estimate.", "Prix notés automatiquement lors du changement du prix du fioul. La dernière valeur sert à l’estimation des coûts."],
    "Entfeuchter": [
      "Ein optionaler Luftentfeuchter (Steckdose/Schalter, Ventilator oder natives Entfeuchter-Gerät). Er schaltet nach den beiden Schwellen darunter, nicht nach dem Lüfthinweis. Bei offenem Fenster aus. Während der Entfeuchter läuft, verzichtet Raumklima auf den Schimmelschutz-Heizboost; nach drei Stunden ohne Besserung schützt die Heizung wieder.",
      "An optional dehumidifier (smart plug/switch, fan or native dehumidifier device). It switches on the two thresholds below, not on the airing notice. Off while a window is open. While it runs, Raumklima skips the mold-guard heating boost; after three hours without improvement, the heating protects again.",
      "Un déshumidificateur facultatif (prise/interrupteur, ventilateur ou appareil natif). Il fonctionne selon les deux seuils ci-dessous, pas selon le rappel d’aération. Arrêt quand une fenêtre est ouverte. Pendant son fonctionnement, Raumklima renonce au coup de chauffage anti-moisissure ; après trois heures sans amélioration, le chauffage protège à nouveau."
    ],
    "Entfeuchter an ab": [
      "Ab dieser Luftfeuchte schaltet der Entfeuchter ein. Ohne eigenen Wert gilt die Feuchtegrenze des Raums. Unabhängig davon, wann „Bitte lüften“ kommt.",
      "The dehumidifier switches on at this humidity. Without a value of its own, the room's humidity limit applies. Independent of when “please air” appears.",
      "Le déshumidificateur démarre à cette humidité. Sans valeur propre, le seuil d’humidité de la pièce s’applique. Indépendamment du moment où « Merci d’aérer » apparaît."
    ],
    "Entfeuchter aus unter": [
      "Darunter schaltet der Entfeuchter wieder aus. Der Wert muss unter der Einschaltschwelle liegen; ohne eigenen Wert sind es fünf Prozent darunter. Die Differenz verhindert häufiges Ein und Aus.",
      "Below this the dehumidifier switches off again. The value must be below the switch-on threshold; without a value of its own it is five percent below. The gap prevents frequent switching.",
      "En dessous, le déshumidificateur s’arrête. La valeur doit être inférieure au seuil de démarrage ; sans valeur propre, elle est cinq pour cent en dessous. L’écart évite les commutations fréquentes."
    ],
    "Einschaltverzögerung": [
      "So lange muss die Feuchte dauerhaft über der Einschaltschwelle bleiben, bevor der Entfeuchter startet. 0 = sofort. Gegen kurze Duschspitzen, die sonst ein und kurz darauf wieder aus schalten.",
      "How long humidity must stay above the switch-on threshold before the dehumidifier starts. 0 = immediately. Prevents short shower spikes from switching it on and off again.",
      "Durée pendant laquelle l’humidité doit rester au-dessus du seuil de démarrage avant que le déshumidificateur démarre. 0 = immédiat. Évite que de courtes pointes de douche le fassent démarrer puis arrêter."
    ],
    "Strommessung (W)": [
      "Optionaler Leistungssensor der schaltbaren Steckdose, z. B. `sensor.…_power` in Watt. Er zeigt die aktuelle Leistung an; ohne Zähler wird kein Verbrauch berechnet.",
      "Optional power sensor of the switched plug, e.g. `sensor.…_power` in watts. Shows current draw; without an energy meter no consumption is calculated.",
      "Capteur de puissance facultatif de la prise commutable, p. ex. `sensor.…_power` en watts. Affiche la puissance actuelle ; sans compteur d’énergie, la consommation n’est pas calculée."
    ],
    "Stromzähler (kWh)": [
      "Optionaler kWh-Zähler der Steckdose. Raumklima zählt die Differenz mit und rechnet mit dem Strompreis der Wohnung die Kosten aus.",
      "Optional kWh meter of the plug. Raumklima counts the difference and calculates cost using the home's electricity price.",
      "Compteur d’énergie kWh facultatif de la prise. Raumklima additionne la différence et calcule le coût avec le prix de l’électricité du foyer."
    ],
    "Leistung gerade": [
      "Aktuelle Leistung des Entfeuchters in Watt, wenn ein Leistungssensor hinterlegt ist.",
      "Current dehumidifier draw in watts when a power sensor is configured.",
      "Puissance actuelle du déshumidificateur en watts lorsqu’un capteur de puissance est configuré."
    ],
    "Verbrauch gesamt": [
      "Gesamter Verbrauch des Entfeuchters aus dem optionalen kWh-Zähler. Die Kosten erscheinen, wenn unter Allgemein → Energie & Tarife ein Strompreis hinterlegt ist.",
      "Total dehumidifier consumption from the optional kWh meter. Cost appears when an electricity price is set under Settings → Energy & tariffs.",
      "Consommation totale du déshumidificateur depuis le compteur kWh facultatif. Le coût apparaît si un prix de l’électricité est défini sous Réglages → Énergie et tarifs."
    ],
    "Starts": [
      "Wie oft der Entfeuchter seit dem letzten Speichern eingeschaltet wurde.",
      "How often the dehumidifier has been switched on since the last save.",
      "Nombre de démarrages du déshumidificateur depuis la dernière sauvegarde."
    ],
    "Laufzeit gesamt": [
      "Summe aller Laufphasen des Entfeuchters.",
      "Sum of all dehumidifier run phases.",
      "Somme de toutes les phases de marche du déshumidificateur."
    ],
    "Schulferien-Kalender": [
      "Ein Kalender mit ganztägigen Ferienterminen. Läuft heute ein Termin, starten Zeitfenster, die vor 12:00 beginnen, um die eingestellte Zeit später – die gespeicherten Zeiten bleiben unverändert.",
      "A calendar with all-day school holiday events. If an event is active today, time windows starting before 12:00 begin later by the configured amount – the stored times stay unchanged.",
      "Un calendrier avec des événements de vacances scolaires sur toute la journée. Si un événement est actif aujourd’hui, les plages commençant avant 12:00 commencent plus tard du nombre de minutes réglé – les horaires enregistrés restent inchangés."
    ],
    "… wie Urlaub": [
      "Wörter im Termintitel, die „verreist“ bedeuten, durch Komma getrennt. Groß-/Kleinschreibung egal.",
      "Words in the event title that mean “travelling”, separated by commas. Case doesn't matter.",
      "Mots du titre d’un événement qui signifient « en voyage », séparés par des virgules. Majuscules/minuscules indifférentes."
    ],
    "… Homeoffice / zu Hause": [
      "Frei wählbare Wörter im Termintitel (Komma-getrennt) – „Homeoffice“ ist nur der Vorschlag. Ein laufender Termin mit einem dieser Wörter schaltet Homeoffice ein und senkt nicht ab, auch wenn das Handy kurz woanders ist.",
      "Freely chosen words in the event title (comma-separated) – “home office” is only the default. A running event containing one of them turns home office on and lowers nothing, even if the phone is briefly elsewhere.",
      "Mots librement choisis dans le titre de l’événement (séparés par des virgules) – « télétravail » n’est qu’une proposition. Un rendez-vous en cours contenant un de ces mots active le télétravail et n’abaisse rien, même si le téléphone est brièvement ailleurs."
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
    "Sonnenaufgang": [
      "Zeitpunkt des nächsten Sonnenaufgangs – hilft bei der Verschattung und beim Vorheizen am Morgen.",
      "Time of the next sunrise – useful for shading and morning preheating.",
      "Heure du prochain lever du soleil – utile pour l’occultation et le préchauffage matinal."
    ],
    "Sonnenuntergang": [
      "Zeitpunkt des nächsten Sonnenuntergangs – danach fährt die Verschattung je Einstellung herunter.",
      "Time of the next sunset – afterwards shading closes or opens according to its setting.",
      "Heure du prochain coucher du soleil – ensuite l’occultation se ferme ou s’ouvre selon le réglage."
    ],
    "Karte": [
      "Version der Karte, die gerade im Browser läuft. Weicht sie von der Integration ab, die Seite mit Strg+Shift+R neu laden.",
      "Version of the card currently running in the browser. If it differs from the integration, reload the page with Ctrl+Shift+R.",
      "Version de la carte actuellement chargée dans le navigateur. Si elle diffère de l’intégration, rechargez avec Ctrl+Shift+R."
    ],
    "Datenquelle": [
      "Die Karte liest die Werte live über die WebSocket-Verbindung von Home Assistant – ohne Umweg über eine Datei.",
      "The card reads values live from Home Assistant over the WebSocket connection – without a file in between.",
      "La carte lit les valeurs en direct depuis Home Assistant via la connexion WebSocket – sans passer par un fichier."
    ],
    "Werkzeuge": [
      "Schnellzugriff auf Selbsttest, Diagnose-Datei und Fehlerbericht – ohne den Umweg über den Kopf der Karte.",
      "Quick access to self-test, diagnostics file and bug report – without going through the card header.",
      "Accès rapide à l’auto-test, au fichier de diagnostic et au rapport de bug – sans passer par l’en-tête de la carte."
    ],
    "Frostschutz": [
      "Die absolute Untergrenze wie am Thermostat: Fällt der Raum darunter, heizt Raumklima auf diesen Wert – unabhängig von Zeitplan, Abwesenheit oder Heizpause.",
      "The absolute lower limit, like on the thermostat: if the room drops below it, Raumklima heats to this value – regardless of schedule, absence or heating pause.",
      "La limite inférieure absolue, comme sur le thermostat : si la pièce descend en dessous, Raumklima chauffe jusqu’à cette valeur – indépendamment du programme, de l’absence ou de la pause."
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
    "SMTP-Bericht": ["Wählt eine Home-Assistant-SMTP-Entität. Der PDF-Bericht wird dann über HA und dessen SMTP-Integration gesendet; die Mail-Zugangsdaten liegen nicht mehr bei Raumklima.", "Selects a Home Assistant SMTP entity. The PDF report is then sent via HA’s SMTP integration; mail credentials no longer stay in Raumklima.", "Choisit une entité SMTP Home Assistant. Le rapport PDF est alors envoyé via l’intégration SMTP de HA ; les identifiants mail ne restent plus dans Raumklima."],
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
    "Arbeitsplätze": [
      "Zonen, die als Arbeitsplatz gelten (z. B. die Schule oder das Büro). Wer dort ist, gilt sofort als weg: kein Vorheizen, keine Wartezeit – auch wenn der Arbeitsplatz nur zwei Kilometer entfernt ist.",
      "Zones that count as a workplace (e.g. school or office). Whoever is there counts as away right away: no preheating, no waiting time – even if the workplace is only two kilometres away.",
      "Zones considérées comme lieu de travail (p. ex. école ou bureau). Celui qui s’y trouve compte immédiatement comme absent : pas de préchauffage, pas d’attente – même à deux kilomètres seulement."
    ],
    "… gilt nach": [
      "So viele Minuten muss jemand am Arbeitsplatz sein, bevor das gilt – ein kurzer Halt auf dem Weg löst nichts aus.",
      "How many minutes someone must be at the workplace before this applies – a short stop on the way changes nothing.",
      "Nombre de minutes nécessaires sur le lieu de travail avant que cela s’applique – un bref arrêt en chemin ne change rien."
    ],
    "Homeoffice": [
      "Schalter für Tage, an denen du zu Hause arbeitest. Im eingestellten Fenster heizen die gewählten Räume auf Wunschtemperatur, der Zeitplan ist so lange ausgesetzt — danach läuft er weiter. Ein Kalendertermin mit „Homeoffice“ schaltet dasselbe automatisch.",
      "Switch for days you work from home. During the set window the selected rooms heat to the wish temperature and the schedule is paused — afterwards it runs again. A calendar event containing “home office” switches the same on automatically.",
      "Interrupteur pour les jours de télétravail. Pendant la plage définie, les pièces choisies chauffent à la consigne et la plage horaire est suspendue — ensuite elle reprend. Un rendez-vous contenant « télétravail » active la même chose automatiquement."
    ],
    "Nachtruhe über Entität": [
      "Ein vorhandener HA-Schalter (input_boolean, switch) schaltet die Nachtruhe mit. An = Nachtabsenkung gilt, aus = normaler Zeitplan. Der eingebaute Schalter bleibt zusätzlich nutzbar.",
      "An existing HA switch (input_boolean, switch) also turns night mode on. On = night setback applies, off = normal schedule. The built-in switch keeps working too.",
      "Un interrupteur HA existant (input_boolean, switch) active aussi le mode nuit. Activé = l’abaissement nocturne s’applique, désactivé = plage horaire normale. L’interrupteur intégré reste utilisable."
    ],
    "Homeoffice über Entität": [
      "Ein vorhandener HA-Schalter schaltet Homeoffice mit — wie der eingebaute Schalter, also ohne Anwesenheitsprüfung. Gedacht für Wandtaster oder ein Dashboard-Kachel.",
      "An existing HA switch also turns home office on — like the built-in switch, so without the presence check. Meant for wall buttons or a dashboard tile.",
      "Un interrupteur HA existant active aussi le télétravail — comme l’interrupteur intégré, donc sans contrôle de présence. Prévoir pour boutons muraux ou une tuile du tableau de bord."
    ],
    "Quellen": [
      "Welche Heizquellen in diesem Zeitfenster laufen. Ohne Auswahl: alle. Antippen schließt eine aus – sie wird dann ausgeschaltet, nicht nur stummgeschaltet.",
      "Which heat sources run in this schedule window. Without a selection: all. Tapping one excludes it — it is switched off, not just muted.",
      "Quelles sources de chaleur fonctionnent pendant cette plage horaire. Sans sélection : toutes. Toucher une source l’exclut — elle est éteinte, pas seulement silencieuse."
    ],
    "Haupt-Thermostat": [
      "Das Thermostat, das den Raum führt. Die anderen Quellen folgen der Auswahl im Zeitplan und bekommen denselben Sollwert (plus ihren Offset).",
      "The thermostat that leads the room. The other sources follow the schedule selection and get the same target (plus their offset).",
      "Le thermostat qui dirige la pièce. Les autres sources suivent la sélection de la plage horaire et reçoivent la même consigne (plus leur offset)."
    ],
    "… Offset": [
      "Fester Zuschlag nur für diese Quelle – z. B. +0,5 K, damit sie früher anläuft. Der Raumfühler bleibt der Haupt-Thermostat.",
      "Fixed offset for this source only — e.g. +0.5 K so it starts earlier. The room sensor stays with the main thermostat.",
      "Décalage fixe pour cette source uniquement — p. ex. +0,5 K pour qu’elle démarre plus tôt. Le capteur de la pièce reste au thermostat principal."
    ],
    "Weitere Quellen": [
      "Thermostate oder Klimaanlagen, die mit dem Raum laufen. Nur die im Zeitfenster gewählten werden angesteuert; „unangetastet“ bleibt ganz in Ruhe.",
      "Thermostats or air conditioners that run with the room. Only the ones selected in the schedule window are driven; “untouched” is left completely alone.",
      "Thermostats ou climatiseurs qui fonctionnent avec la pièce. Seules les sources choisies dans la plage horaire sont pilotées ; « sans intervention » reste totalement en paix."
    ],
    "Bei Anwesenheit": [
      "Temperatur, solange jemand im Raum ist – z. B. Arbeitszimmer: Wunschtemperatur 18,5 °C (niemand da), bei Anwesenheit 21 °C. Ist der Raum „… wenn belegt seit“ belegt, wird geheizt; nach „… zurück nach“ ohne Belegung gilt wieder der Wert von vorher (Wunsch, Zeitplan oder Absenkung). Es zählen nur mmWave-Melder, außer „auch Bewegungsmelder“ ist an. „aus“ schaltet die Regel ab.",
      "Temperature while someone is in the room – e.g. office: desired 18.5 °C (nobody there), 21 °C when occupied. Once the room has been occupied for “… when occupied for”, it heats; after “… back after” without occupancy the previous value applies again (desired, schedule or setback). Only mmWave sensors count unless “also motion sensors” is on. “off” disables the rule.",
      "Température tant que quelqu’un est dans la pièce – p. ex. bureau : consigne 18,5 °C (personne), 21 °C en présence. Dès que la pièce est occupée depuis « … si occupé depuis », elle chauffe ; après « … retour après » sans occupation, la valeur d’avant s’applique de nouveau (consigne, programme ou abaissement). Seuls les capteurs mmWave comptent, sauf si « aussi détecteurs de mouvement » est activé. « désactivé » coupe la règle."
    ],
    "Vorwärmen nach gelernten Zeiten": [
      "Raumklima merkt sich, wann der Raum belegt ist (je Wochentag und Viertelstunde, nur die letzten vier Wochen). War er an 3 der letzten 4 gleichen Wochentage zur selben Zeit belegt, gilt das als üblich – dann wird so früh auf „Bei Anwesenheit“ vorgewärmt, dass es zu Beginn warm ist. Kommt 30 Minuten nach dem üblichen Beginn niemand, gilt wieder der Wert von vorher. Nicht im Urlaub und nicht, wenn alle weg sind.",
      "Raumklima remembers when the room is occupied (per weekday and quarter hour, only the last four weeks). If it was occupied at the same time on 3 of the last 4 same weekdays, that counts as usual – then it warms up to “When occupied” early enough to be warm at the start. If nobody comes within 30 minutes of the usual start, the previous value applies again. Not during vacation and not when everyone is away.",
      "Raumklima retient quand la pièce est occupée (par jour de semaine et quart d’heure, seulement les quatre dernières semaines). Si elle était occupée à la même heure 3 des 4 derniers mêmes jours de semaine, c’est considéré comme habituel – elle préchauffe alors à « En présence » assez tôt pour qu’il fasse chaud au début. Si personne ne vient dans les 30 minutes, la valeur d’avant s’applique de nouveau. Pas en vacances ni quand tout le monde est absent."
    ],
    "Lampen und Steckdosen zählen als Anwesenheit": [
      "Eine eingeschaltete Lampe oder Steckdose (z. B. PC) zählt wie ein Melder: jemand ist im Raum. Gut für Räume ohne mmWave-Melder oder als Ergänzung (Schreibtischlampe im Arbeitszimmer). Ist die Lampe aus, gilt der Raum nach 2 Minuten als leer – außer ein Melder sieht noch jemanden. Lampen zählen nur für diesen Raum, nie für „jemand zu Hause“.",
      "A lamp or socket (e.g. PC) that is on counts like a sensor: someone is in the room. Good for rooms without an mmWave sensor or as an addition (desk lamp in the office). Once the lamp is off, the room counts as empty after 2 minutes – unless a sensor still sees someone. Lamps only count for this room, never for “someone home”.",
      "Une lampe ou une prise (p. ex. PC) allumée compte comme un capteur : quelqu’un est dans la pièce. Utile pour les pièces sans capteur mmWave ou en complément (lampe de bureau). Une fois la lampe éteinte, la pièce est vide après 2 minutes – sauf si un capteur voit encore quelqu’un. Les lampes ne comptent que pour cette pièce, jamais pour « quelqu’un à la maison »."
    ],
    "… wenn belegt seit": [
      "So viele Minuten muss der Melder jemanden im Raum sehen, bevor die Anwesenheits-Temperatur gilt. 0 = sofort. Standard 5 min – wer nur kurz durchgeht, löst nichts aus.",
      "The sensor must see someone in the room for this many minutes before the presence temperature applies. 0 = immediately. Default 5 min – walking through briefly triggers nothing.",
      "Le capteur doit voir quelqu’un dans la pièce pendant ce nombre de minutes avant que la température de présence s’applique. 0 = immédiat. Par défaut 5 min – un simple passage ne déclenche rien."
    ],
    "… zurück nach": [
      "Sieht der Melder so viele Minuten niemanden mehr, gilt wieder die Temperatur von vorher (Wunsch, Zeitplan oder Absenkung). Wer kürzer rausgeht, kommt in den warmen Raum zurück – die Wartezeit beginnt dann nicht neu. Standard 5 min; mit einem Bewegungsmelder (PIR) eher 20 min.",
      "Once the sensor has seen nobody for this many minutes, the previous temperature applies again (desired, schedule or setback). Leave for a shorter time and you come back to a warm room – the waiting time does not start over. Default 5 min; with a motion sensor (PIR) rather 20 min.",
      "Si le capteur ne voit plus personne pendant ce nombre de minutes, la température d’avant s’applique de nouveau (souhaitée, programme ou abaissement). Une sortie plus courte ne change rien – l’attente ne recommence pas. Par défaut 5 min ; avec un détecteur de mouvement (PIR), plutôt 20 min."
    ],
    "… auch Bewegungsmelder": [
      "Normalerweise zählen für die Anwesenheits-Temperatur nur mmWave-Melder (Radar): Ein Bewegungsmelder (PIR) sieht auch Haustiere und erkennt Stillsitzende nach ein paar Minuten nicht mehr. Einschalten, wenn im Raum nur ein PIR hängt und keine Tiere stören.",
      "Normally only mmWave (radar) sensors count for the presence temperature: a motion sensor (PIR) also sees pets and stops seeing people who sit still after a few minutes. Turn on if the room only has a PIR and no pets interfere.",
      "Normalement, seuls les capteurs mmWave (radar) comptent pour la température de présence : un détecteur de mouvement (PIR) voit aussi les animaux et ne voit plus une personne immobile après quelques minutes. À activer si la pièce n’a qu’un PIR et pas d’animaux."
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
    "Nachtabsenkung": [
      "Ob dieser Raum während der Ruhezeit abgesenkt wird. „Automatisch“ nimmt nur Schlafzimmer und selten genutzte Räume, „Immer“ auch Wohnräume, „Nie“ keinen.",
      "Whether this room is set back during quiet hours. “Automatic” covers bedrooms and rarely used rooms, “Always” also living rooms, “Never” none.",
      "Si cette pièce est abaissée pendant les heures calmes. « Automatique » ne concerne que les chambres et pièces peu utilisées, « Toujours » aussi les séjours, « Jamais » aucune."
    ],
    "Absenkwert nachts": [
      "Auf welche Temperatur die Nachtabsenkung geht: kurz weg, länger weg oder Frostschutz. Gilt für die Ruhezeit und für den Schalter „Nachtruhe“.",
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
      "Wie das Thermostat die Raumtemperatur berücksichtigt. Sollwert-Ausgleich (Standard): Ziel am Thermostat um die Abweichung verschieben – genau, das Ventil bewegt sich öfter. Hysterese: Ventil nach dem Raumfühler ganz auf/ganz zu – weniger Bewegung und Batterie, etwas mehr Schwankung. Ohne Abgleich: Sollwert 1:1, für Räume ohne Raumfühler. „Offset am Thermostat“ erscheint nur bei Geräten mit Kalibrier-Entität.",
      "How the thermostat takes the room temperature into account. Setpoint compensation (default): shift the thermostat target by the difference – accurate, the valve moves more often. Hysteresis: valve fully open/closed based on the room sensor – fewer movements and less battery, slightly more fluctuation. No compensation: setpoint 1:1, for rooms without a room sensor. “Offset on thermostat” only appears for devices with a calibration entity.",
      "Comment le thermostat tient compte de la température de la pièce. Compensation de consigne (par défaut) : décaler la cible du thermostat de l'écart – précis, la vanne bouge plus souvent. Hystérésis : vanne entièrement ouverte/fermée selon la sonde de pièce – moins de mouvements et de batterie, un peu plus de variation. Sans compensation : consigne 1:1, pour les pièces sans sonde. « Offset sur le thermostat » n'apparaît que pour les appareils avec entité de calibrage."
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
    ],
    "Verschattung": [
      "Steuert ausgewählte Rollläden oder Jalousien: aus, nur empfehlen oder automatisch bei Sonne und nachts.",
      "Controls selected blinds or shutters: off, advise only, or automatic in sun and at night.",
      "Commande les volets ou stores sélectionnés : arrêt, conseil seulement ou automatique au soleil et la nuit."
    ],
    "Rollläden": [
      "Diese Rollläden oder Jalousien fährt die Verschattung. Auswahl unter „Geräte & Technik ändern“ am Raum; Fensterkontakte bleiben davon getrennt.",
      "These blinds or shutters are moved by shading. Select them under “Change devices & technology” for the room; window contacts remain separate.",
      "Ces volets ou stores sont commandés par l’ombrage. Sélection sous « Modifier appareils et technique » pour la pièce ; les contacts de fenêtre restent séparés."
    ],
    "Schließen ab innen": [
      "Ab dieser Raumtemperatur wird es ohne Schatten zu warm – die Sonne heizt den Raum dann stärker auf, als er braucht.",
      "From this room temperature it gets too warm without shade – the sun then heats the room more than needed.",
      "À partir de cette température ambiante, il fait trop chaud sans ombre – le soleil chauffe alors la pièce plus que nécessaire."
    ],
    "oder ab außen": [
      "Zusätzlicher Auslöser: Ist es draußen schon so warm, wird auch ein noch kühlerer Raum beschattet, damit die Sonne ihn nicht aufheizt.",
      "Additional trigger: if it is already this warm outside, even a cooler room is shaded so the sun does not heat it up.",
      "Déclencheur supplémentaire : s’il fait déjà aussi chaud dehors, une pièce encore fraîche est aussi ombragée pour que le soleil ne la réchauffe pas."
    ],
    "Schließposition": [
      "Wie weit der Rollladen bei Sonne schließt: 0 % ist ganz zu, 100 % ganz offen. Geräte ohne Positionsfahrt fahren beim Schließen ganz zu.",
      "How far the blind closes in sun: 0 % is fully closed, 100 % fully open. Devices without position control close fully.",
      "Jusqu’où le volet se ferme au soleil : 0 % complètement fermé, 100 % complètement ouvert. Les appareils sans positionnement se ferment complètement."
    ],
    "Nachts schließen": [
      "Schließt nach Sonnenuntergang und öffnet morgens wieder. Das schützt vor Wärmeverlust und hält Licht draußen – unabhängig von der Sonnenprognose.",
      "Closes after sunset and opens again in the morning. This protects against heat loss and keeps light out – regardless of the sun forecast.",
      "Ferme après le coucher du soleil et rouvre le matin. Cela protège des pertes de chaleur et garde la lumière dehors – indépendamment de la prévision solaire."
    ],
    "Handbedienung pausiert": [
      "Wie lange die Automatik nach einer Handbedienung am Rollladen aussetzt. 0 bedeutet: Beim nächsten Prüflauf wird sofort wieder automatisch gefahren.",
      "How long the automation pauses after someone moves a blind manually. 0 means it resumes automatically on the next check.",
      "Combien de temps l’automatisme s’arrête après une commande manuelle. 0 signifie qu’il reprend automatiquement au prochain contrôle."
    ],
    "Ventilsteuerung": [
      "Fährt die Ventilöffnung direkt über ein `number`-Stellglied (z. B. SONOFF TRVZB), statt nur den Sollwert am Thermostat zu setzen. „Automatisch“ nutzt das Stellglied, wenn es gefunden wurde; „Immer“ erzwingt es; „Aus“ bleibt beim Sollwert.",
      "Drives the valve opening directly via a `number` actuator (e.g. SONOFF TRVZB) instead of only setting the thermostat setpoint. “Automatic” uses the actuator when found; “Always” forces it; “Off” keeps the setpoint.",
      "Commande l’ouverture de la vanne directement via un actionneur `number` (p. ex. SONOFF TRVZB) au lieu de régler seulement la consigne du thermostat. « Automatique » utilise l’actionneur s’il est trouvé ; « Toujours » le force ; « Arrêt » conserve la consigne."
    ],
    "Fußbodenheizung": [
      "Eigene Regelcharakteristik für träge Flächen: breiteres Band, begrenzter Vorlauf und ein einstellbarer Takt statt enger Thermostatsprünge.",
      "Own control characteristic for slow surfaces: wider band, limited flow temperature and an adjustable cycle instead of tight thermostat steps.",
      "Caractéristique de régulation propre pour les surfaces lentes : plage plus large, départ limité et cycle réglable au lieu de pas de thermostat serrés."
    ],
    "Max. Vorlauf": [
      "Harte Obergrenze für den Sollwert der Fußbodenheizung. Sie schützt Boden und Heizkreis, ist aber kein Ersatz für die hydraulische Begrenzung der Anlage.",
      "Hard upper limit for the underfloor heating setpoint. It protects the floor and heating circuit but does not replace the system’s hydraulic limit.",
      "Limite haute stricte pour la consigne du plancher chauffant. Elle protège le sol et le circuit, mais ne remplace pas la limitation hydraulique de l’installation."
    ],
    "Min. Raumtemperatur": [
      "Unter dieser Temperatur heizt die Fußbodenheizung nicht. Zusammen mit der Absenkung verhindert das ein Auskühlen des Estrichs.",
      "The underfloor heating does not heat below this temperature. Together with the setback it prevents the screed from cooling down.",
      "Le plancher chauffant ne chauffe pas sous cette température. Avec l’abaissement, cela évite que la chape ne refroidisse."
    ],
    "Regelband": [
      "Innerhalb dieses Bandes bleibt der Sollwert stehen. Das bremst Überschwingen bei der träge reagierenden Fläche.",
      "Within this band the setpoint stays put. This damps overshoot on the slow-reacting surface.",
      "Dans cette plage, la consigne reste stable. Cela amortit les dépassements sur la surface à réaction lente."
    ],
    "Mindest-Taktzeit": [
      "So oft darf der Sollwert höchstens nachgezogen werden. Größere Werte schonen Stellglieder und reduzieren Funkverkehr.",
      "The setpoint is adjusted at most this often. Larger values protect actuators and reduce radio traffic.",
      "La consigne est ajustée au plus souvent à cette fréquence. Des valeurs plus élevées ménagent les actionneurs et réduisent le trafic radio."
    ],
    "Vorlauf vor Zeitfenster": [
      "Wie viele Minuten vor einem Zeitplanfenster die Fußbodenheizung früher startet. Der träge Boden braucht länger als ein Heizkörper.",
      "How many minutes before a schedule window the underfloor heating starts earlier. The slow floor needs longer than a radiator.",
      "Combien de minutes avant une plage horaire le plancher chauffant démarre plus tôt. Le sol lent demande plus de temps qu’un radiateur."
    ],
    "Durchfluss-Grenze": [
      "Vorlauf minus Rücklauf unter diesem Wert deutet auf zu wenig Durchfluss hin. Dann Pumpe, Ventile und hydraulischen Abgleich prüfen.",
      "Flow minus return below this value suggests too little flow. Then check the pump, valves and hydraulic balancing.",
      "Départ moins retour sous cette valeur indique un débit trop faible. Vérifier alors la pompe, les vannes et l’équilibrage hydraulique."
    ],
    "Dynamischer Tarif": ["Der Preis wechselt jede Stunde oder Viertelstunde. Raumklima rechnet dann jede Stunde mit ihrem eigenen Preis und zeigt im Dashboard Preiskurve, günstige Stunden und den im Schnitt bezahlten Preis. Gesteuert wird nichts.", "The price changes every hour or quarter hour. Raumklima then charges each hour at its own price and shows the price curve, cheap hours and the average price paid on the dashboard. Nothing is controlled.", "Le prix change chaque heure ou quart d’heure. Raumklima calcule alors chaque heure à son propre prix et affiche la courbe, les heures bon marché et le prix moyen payé. Rien n’est piloté."],
    "Warmwasser-Zähler": ["Zähler, der nur das Warmwasser misst (bei Wärmepumpen oft „Verbrauchte Warmwasserenergie gesamt“). Warmwasser zählt zu den Kosten, erscheint im Dashboard aber als eigener Balken – die Raumkosten zeigen nur das Heizen.", "Meter that measures hot water only (for heat pumps often “consumed hot water energy total”). Hot water counts towards the costs but shows as its own bar on the dashboard – room costs only cover heating.", "Compteur qui ne mesure que l’eau chaude (pour les PAC souvent « énergie eau chaude consommée totale »). L’eau chaude compte dans les coûts mais apparaît à part – les coûts par pièce ne couvrent que le chauffage."],
    "Warmwasser-Wärme": ["Erzeugte Wärme fürs Warmwasser in kWh. Zusammen mit dem Warmwasser-Zähler ergibt das die Arbeitszahl beim Warmwasser – meist niedriger als beim Heizen, weil das Wasser heißer wird.", "Heat produced for hot water in kWh. Together with the hot water meter this gives the hot water efficiency – usually lower than for heating because the water gets hotter.", "Chaleur produite pour l’eau chaude en kWh. Avec le compteur d’eau chaude, cela donne le rendement pour l’eau chaude – souvent plus bas qu’en chauffage car l’eau est plus chaude."],
    "Hausverbrauch": ["Stromverbrauch des ganzen Hauses als Gesamtzähler in kWh – vom Smart Meter, Energiemanager oder Wechselrichter. Damit zeigt das Dashboard, welchen Anteil die Heizung am Hausstrom hat.", "Electricity use of the whole house as a total meter in kWh – from a smart meter, energy manager or inverter. The dashboard then shows the heating’s share of house electricity.", "Consommation électrique de toute la maison en compteur total kWh – compteur communicant, gestionnaire d’énergie ou onduleur. Le tableau de bord montre alors la part du chauffage."],
    "Netzbezug": ["Strom, der aus dem Netz kam (Gesamtzähler in kWh). Mit dem Hausverbrauch rechnet Raumklima jede Stunde aus, wie viel Strom aus PV und Batterie kam – dieser Anteil kostet nichts und wird von den Heizkosten abgezogen.", "Electricity drawn from the grid (total meter in kWh). Together with house consumption, Raumklima works out every hour how much came from PV and battery – that share is free and is deducted from the heating cost.", "Électricité soutirée du réseau (compteur total en kWh). Avec la consommation de la maison, Raumklima calcule chaque heure la part du PV et de la batterie – gratuite et déduite du coût du chauffage."],
    "Preisquelle": ["Sensor mit dem Arbeitspreis. Am besten der Sensor deines Anbieters, weil er Netzentgelt und MwSt schon enthält. Ohne Sensor gilt der feste Arbeitspreis. Einheit egal: €/kWh, ct/kWh, €/MWh, €/m³ oder €/L werden umgerechnet.", "Sensor with the energy price. Ideally your supplier’s sensor, as it already includes grid fee and VAT. Without a sensor the fixed price applies. Any unit works: €/kWh, ct/kWh, €/MWh, €/m³ or €/L are converted.", "Capteur du prix de l’énergie. Idéalement celui de votre fournisseur, qui inclut déjà frais de réseau et TVA. Sans capteur, le prix fixe s’applique. Toute unité convient : €/kWh, ct/kWh, €/MWh, €/m³ ou €/L sont convertis."],
    "Reserve-Preisquellen": ["Weitere Preis-Sensoren, z. B. EPEX Spot von Energy-Charts, SMARD oder Awattar. Liefert die Hauptquelle nichts – Ausfall oder fehlender Verlauf –, nimmt Raumklima die nächste in der angetippten Reihenfolge.", "Further price sensors, e.g. EPEX Spot from Energy-Charts, SMARD or Awattar. If the main source delivers nothing – outage or missing history – Raumklima uses the next one in the order you tapped.", "Autres capteurs de prix, p. ex. EPEX Spot via Energy-Charts, SMARD ou Awattar. Si la source principale ne fournit rien – panne ou historique manquant –, Raumklima prend la suivante dans l’ordre choisi."],
    "Grundgebühr-Anteil": ["„Ganz“, wenn die Heizung einen eigenen Zähler mit eigener Grundgebühr hat (typisch Wärmepumpentarif). „Nach Verbrauch“ bei einem gemeinsamen Hauszähler: dann zählt nur der Anteil der Heizung am Hausverbrauch.", "“All” if the heating has its own meter with its own base fee (typical for heat pump tariffs). “By usage” for a shared house meter: then only the heating’s share of house consumption counts.", "« Entier » si le chauffage a son propre compteur et abonnement (typique des tarifs PAC). « Selon consommation » pour un compteur commun : seule la part du chauffage compte."],
    "Preis jetzt": ["Der Preis je kWh, mit dem Raumklima gerade rechnet – brutto, nach Umrechnung. Derselbe Wert gilt für Dashboard, Bericht und den Vergleich mit dem Klimagerät.", "The price per kWh Raumklima is using right now – gross, after conversion. The same value is used by the dashboard, the report and the air conditioner comparison.", "Le prix par kWh utilisé actuellement par Raumklima – TTC, après conversion. La même valeur sert au tableau de bord, au rapport et à la comparaison avec la climatisation."],
    "Strompreis": ["Nur bei Gas, Öl oder Fernwärme: der Strompreis je kWh brutto. Er wird für den Vergleich gebraucht, ob ein Klimagerät günstiger heizt als die Hauptheizung.", "Only for gas, oil or district heating: the electricity price per kWh, gross. It is needed to compare whether an air conditioner heats more cheaply than the main heating.", "Uniquement pour gaz, fioul ou chauffage urbain : le prix de l’électricité par kWh TTC. Il sert à comparer si une climatisation chauffe moins cher que le chauffage principal."],
    "Hysterese": ["Breite des Schaltbereichs in K. Unter Ziel minus die Hälfte öffnet Raumklima das Ventil ganz (Sollwert am Thermostat ganz hoch), über Ziel plus die Hälfte schließt es ganz. Größer = seltener Ventilbewegungen, aber mehr Temperaturschwankung.", "Width of the switching band in K. Below target minus half of it Raumklima opens the valve fully (setpoint all the way up), above target plus half it closes it fully. Larger = fewer valve movements but more temperature swing.", "Largeur de la plage en K. Sous la consigne moins la moitié, Raumklima ouvre la vanne entièrement (consigne au maximum), au-dessus de la consigne plus la moitié il la ferme. Plus grand = moins de mouvements mais plus de variation."],
    "Zeitplan-Helfer": ["Ein Zeitplan-Helfer aus Home Assistant (Einstellungen → Geräte & Dienste → Helfer → Zeitplan) statt der eigenen Zeitfenster. Ist er „an“, gilt das Zeitfenster; steht im Datenfeld des Blocks „temperature: 21“, wird diese Temperatur genommen, sonst die Wunschtemperatur. Vorgeheizt wird auf den nächsten Start.", "A Home Assistant schedule helper (Settings → Devices & services → Helpers → Schedule) instead of the room’s own windows. While it is “on” the window applies; if the block’s data field holds “temperature: 21” that temperature is used, otherwise the wish temperature. Preheating aims at the next start.", "Un assistant de planification Home Assistant (Paramètres → Appareils et services → Entrées → Planification) à la place des plages propres. Tant qu’il est « activé », la plage s’applique ; si le champ de données du bloc contient « temperature: 21 », cette température est reprise, sinon la température souhaitée. Le préchauffage vise le prochain début."],
    "Plan-Umschalter": ["Ein Auswahl-Helfer (input_select), eine Auswahl-Entität oder ein Schalter, der zwischen Plänen umschaltet – z. B. „Arbeitszeit“, „frei“, „krank“. In jedem Raum legst du unter Zeitplan → Weitere Einstellungen fest, was in welchem Plan gilt: die eigenen Zeitfenster, ein Zeitplan-Helfer, ganztägig die Wunschtemperatur oder gar kein Zeitfenster. Ein Wechsel wirkt sofort.", "A dropdown helper (input_select), a select entity or a switch that switches between plans – e.g. “work”, “off”, “sick”. In each room, under Schedule → More settings, you choose what applies in which plan: the room’s own windows, a schedule helper, the wish temperature all day or no window at all. A change takes effect immediately.", "Une liste déroulante (input_select), une entité de sélection ou un interrupteur qui change de programme – p. ex. « travail », « libre », « malade ». Dans chaque pièce, sous Planning → Autres réglages, on choisit ce qui s’applique dans chaque programme : les plages propres, un assistant de planification, la température souhaitée toute la journée ou aucune plage. Le changement est immédiat."],
    "Zähler misst": ["„Nur Heizung“: Der Zähler misst den Strom (bzw. das Gas) fürs Heizen; ein Warmwasser-Zähler wird dazugezählt. „Heizung + Warmwasser“: Der Zähler misst beides zusammen – z. B. ein Energiemanager, der den Wärmepumpen-Strom stündlich misst. Der Warmwasser-Zähler teilt dann nur auf. Tipp: Für Kosten bei dynamischem Strompreis den Zähler nehmen, der am feinsten misst (stündlich statt einmal am Tag).", "“Heating only”: the meter measures the electricity (or gas) for heating; a hot water meter is added. “Heating + hot water”: the meter measures both – e.g. an energy manager metering the heat pump hourly. The hot water meter then only splits. Tip: for costs with dynamic prices use the meter that measures most finely (hourly rather than once a day).", "« Chauffage seul » : le compteur mesure l’électricité (ou le gaz) du chauffage ; un compteur d’eau chaude s’ajoute. « Chauffage + eau chaude » : le compteur mesure les deux – p. ex. un gestionnaire d’énergie mesurant la PAC chaque heure. Le compteur d’eau chaude ne fait alors que répartir. Conseil : avec un prix dynamique, prendre le compteur le plus fin (horaire plutôt qu’une fois par jour)."],
    "Strom laut Wärmepumpe": ["Der Strom fürs Heizen, wie die Wärmepumpe ihn selbst zählt (z. B. Stiebel „verbrauchte Heizenergie gesamt“). Viele Wärmepumpen schätzen diesen Wert nur. Raumklima zeigt dann zwei Arbeitszahlen: laut Wärmepumpe und gemessen mit deinem Zähler – die Wahrheit liegt meist dazwischen.", "Heating power as counted by the heat pump itself (e.g. Stiebel “consumed heating energy total”). Many heat pumps only estimate it. Raumklima then shows two efficiencies: according to the heat pump and measured with your meter – the truth is usually in between.", "L’électricité du chauffage telle que la PAC la compte elle-même (p. ex. Stiebel « énergie de chauffage consommée totale »). Beaucoup de PAC ne font que l’estimer. Raumklima affiche alors deux rendements : selon la PAC et mesuré avec ton compteur – la vérité est souvent entre les deux."],
    "Einspeisung": ["Gesamtzähler für den Strom, der ins Netz geht (z. B. „Grid Feed Energy In“ oder „Einspeisung gesamt“). Damit zeigt das Dashboard, wohin der Solarstrom ging: Heizung, übriges Haus oder Netz.", "Total meter for power fed into the grid (e.g. “Grid Feed Energy In” or “feed-in total”). The dashboard then shows where the solar power went: heating, rest of the house or grid.", "Compteur total de l’électricité injectée dans le réseau (p. ex. « Grid Feed Energy In »). Le tableau de bord montre alors où est allé le solaire : chauffage, reste de la maison ou réseau."],
    "Akku geladen": ["Gesamtzähler „Batterie geladen“ in kWh (z. B. „Battery Energy In“). Zusammen mit „Akku entladen“ erkennt Raumklima, wenn der Akku nachts aus dem Netz lädt – dieser Strom ist später nicht kostenlos, sondern kostet den Preis beim Laden.", "Total meter “battery charged” in kWh (e.g. “Battery Energy In”). Together with “battery discharged”, Raumklima detects when the battery charges from the grid at night – that power is not free later but costs the charging price.", "Compteur total « batterie chargée » en kWh (p. ex. « Battery Energy In »). Avec « batterie déchargée », Raumklima détecte quand la batterie se charge la nuit sur le réseau – cette électricité n’est pas gratuite ensuite mais coûte le prix de charge."],
    "Akku entladen": ["Gesamtzähler „Batterie entladen“ in kWh (z. B. „Battery Energy Out“). Raumklima verfolgt Stunde für Stunde, wie viel des gespeicherten Stroms aus PV und wie viel aus dem Netz stammt, und rechnet den Netz-Anteil zum Ladepreis.", "Total meter “battery discharged” in kWh (e.g. “Battery Energy Out”). Raumklima tracks hour by hour how much of the stored power came from PV and how much from the grid, and charges the grid part at the charging price.", "Compteur total « batterie déchargée » en kWh (p. ex. « Battery Energy Out »). Raumklima suit heure par heure la part d’électricité stockée venant du PV ou du réseau et compte la part réseau au prix de charge."],
    "Gaspreis zum Vergleich": ["Gaspreis je kWh, brutto, inklusive Netzentgelt – nur für die Karte „Was kostet 1 kWh Wärme?“. Gerechnet wird mit 90 % Wirkungsgrad der Therme.", "Gas price per kWh, gross, incl. network charges – only for the card “What does 1 kWh of heat cost?”. Calculated with 90 % boiler efficiency.", "Prix du gaz par kWh, TTC, acheminement compris – uniquement pour la carte « Combien coûte 1 kWh de chaleur ? ». Calcul avec un rendement de chaudière de 90 %."],
    "Ölpreis zum Vergleich": ["Heizölpreis je Liter, brutto – nur für den Vergleich „Was kostet 1 kWh Wärme?“. Gerechnet mit 10 kWh je Liter und 90 % Wirkungsgrad.", "Heating oil price per litre, gross – only for the comparison “What does 1 kWh of heat cost?”. Calculated with 10 kWh per litre and 90 % efficiency.", "Prix du fioul par litre, TTC – uniquement pour la comparaison « Combien coûte 1 kWh de chaleur ? ». Calcul avec 10 kWh par litre et 90 % de rendement."],
    "Strompreis zum Vergleich": ["Strompreis je kWh, brutto – zeigt bei Gas-, Öl- oder Fernwärme-Häusern, was dieselbe Wärme mit einer Wärmepumpe kosten würde (Jahresarbeitszahl 3,5).", "Power price per kWh, gross – for gas, oil or district-heating homes this shows what the same heat would cost with a heat pump (seasonal efficiency 3.5).", "Prix de l’électricité par kWh, TTC – pour les maisons au gaz, fioul ou réseau de chaleur, montre ce que coûterait la même chaleur avec une PAC (rendement saisonnier 3,5)."],
    "Morgens später": ["Läuft heute ein Ferientermin im Schulferien-Kalender, beginnen Zeitfenster, die vor 12 Uhr starten, um diese Zeit später – z. B. 60 Minuten. Die gespeicherten Zeiten bleiben unverändert.", "If a school-holiday entry runs today, time windows starting before noon begin this much later – e.g. 60 minutes. The stored times stay unchanged.", "Si un jour de vacances scolaires figure aujourd’hui dans le calendrier, les plages qui commencent avant midi débutent d’autant plus tard – p. ex. 60 minutes. Les heures enregistrées ne changent pas."],
    "Einspeisevergütung": ["Was du je eingespeister kWh bekommst, in €/kWh – steht im Bescheid des Netzbetreibers. Bei Anlagen mit Teileinspeisung zählt der Mischsatz: z. B. 17 kWp, in Betrieb seit Dezember 2024 = (10 × 8,03 + 7 × 6,95) / 17 ≈ 0,0758 €/kWh. Der Block „Strom im ganzen Haus“ zieht die Vergütung von der Rechnung ab.", "What you get per kWh fed into the grid, in €/kWh – as stated by your grid operator. With partial feed-in the blended rate applies: e.g. 17 kWp commissioned December 2024 in Germany = (10 × 8.03 + 7 × 6.95) / 17 ≈ 0.0758 €/kWh. The block “Electricity for the whole house” deducts it from the bill.", "Ce que tu reçois par kWh injecté, en €/kWh – selon le gestionnaire de réseau. En injection partielle, c’est le taux mixte : p. ex. 17 kWc mis en service en décembre 2024 en Allemagne = (10 × 8,03 + 7 × 6,95) / 17 ≈ 0,0758 €/kWh. Le bloc « Électricité de toute la maison » le déduit de la facture."]
  };

  // src/fields.js
  var RK_NUM = {
    away_delay: { unit: " min", step: 5, min: 0, max: 240, dec: 0 },
    school_shift_minutes: { unit: " min", step: 15, min: 0, max: 180, dec: 0 },
    long_away_hours: { unit: " h", step: 1, min: 2, max: 168, dec: 0 },
    preheat_km: { unit: " km", step: 1, min: 0, max: 200, dec: 0 },
    vacation_km: { unit: " km", step: 10, min: 0, max: 1e3, dec: 0 },
    vacation_hours: { unit: " h", step: 1, min: 1, max: 96, dec: 0 },
    work_zone_minutes: { unit: " min", step: 1, min: 0, max: 120, dec: 0 },
    heating_limit: { unit: " °C", step: 0.5, min: 5, max: 25, dec: 1 },
    cold_snap_temp: { unit: " °C", step: 0.5, min: 0, max: 20, dec: 1 },
    frost_floor: { unit: " °C", step: 0.5, min: 5, max: 20, dec: 1 },
    night_alarm_temp: { unit: " °C", step: 0.5, min: 5, max: 20, dec: 1 },
    storm_gust_kmh: { unit: " km/h", step: 10, min: 30, max: 200, dec: 0 },
    storm_rain_mm: { unit: " mm/h", step: 1, min: 1, max: 50, dec: 0 },
    repeat_minutes: { unit: " min", step: 1, min: 1, max: 60, dec: 0 },
    boost_temperature: { unit: " K", step: 0.5, min: 0.5, max: 5, dec: 1 },
    boost_minutes: { unit: " min", step: 5, min: 5, max: 240, dec: 0 },
    override_minutes: { unit: " min", step: 15, min: 0, max: 480, dec: 0 },
    airing_min_minutes: { unit: " min", step: 1, min: 0, max: 30, dec: 0 },
    long_airing_minutes: { unit: " min", step: 5, min: 0, max: 180, dec: 0 },
    long_airing_remind: { unit: " min", step: 15, min: 0, max: 240, dec: 0 },
    comfort_temperature: { unit: " °C", step: 0.5, min: 12, max: 26, dec: 1 },
    frost_temperature: { unit: " °C", step: 0.5, min: 5, max: 15, dec: 1 },
    off_temperature: { unit: " °C", step: 0.5, min: 5, max: 25, dec: 1 },
    sensor_offset: { unit: " K", step: 0.1, min: -5, max: 5, dec: 1 },
    setback_short: { unit: " °C", step: 0.5, min: 10, max: 24, dec: 1 },
    setback_long: { unit: " °C", step: 0.5, min: 8, max: 22, dec: 1 },
    preheat_lead_min: { unit: " min", step: 15, min: 15, max: 360, dec: 0 },
    mold_cap: { unit: " K", step: 0.5, min: 0, max: 6, dec: 1 },
    dehumidifier_on: { unit: " %", step: 1, min: 30, max: 90, dec: 0 },
    dehumidifier_off: { unit: " %", step: 1, min: 20, max: 90, dec: 0 },
    dehumidifier_delay: { unit: " min", step: 1, min: 0, max: 120, dec: 0 },
    energy_base: { unit: " €", step: 1, min: 0, max: 1e3, dec: 2 },
    energy_price: { unit: " €", step: 0.01, min: 0, max: 2, dec: 2 },
    energy_feed_price: { unit: " €/kWh", step: 1e-4, min: 0, max: 1, dec: 4 },
    energy_compare_gas: { unit: " €/kWh", step: 0.01, min: 0, max: 2, dec: 2 },
    energy_compare_oil: { unit: " €/L", step: 0.05, min: 0, max: 5, dec: 2 },
    energy_compare_power: { unit: " €/kWh", step: 0.01, min: 0, max: 2, dec: 2 },
    energy_cheap_price: { unit: " €", step: 0.01, min: 0, max: 2, dec: 2 },
    energy_vat: { unit: " %", step: 0.5, min: 0, max: 30, dec: 1 },
    energy_extra_fee: { unit: " €", step: 0.01, min: 0, max: 1, dec: 2 },
    energy_factor: { unit: " kWh/m³", step: 0.5, min: 0, max: 20, dec: 1 },
    energy_efficiency: { unit: "", step: 0.1, min: 0, max: 6, dec: 1 },
    energy_oil_price: { unit: " €/L", step: 0.01, min: 0, max: 3, dec: 2 },
    energy_oil_winter_liters: { unit: " L", step: 10, min: 0, max: 1e5, dec: 0 },
    energy_oil_winter_days: { unit: " Tage", step: 1, min: 0, max: 365, dec: 0 },
    energy_oil_factor: { unit: " kWh/L", step: 0.1, min: 5, max: 15, dec: 1 },
    energy_tank_capacity: { unit: " L", step: 10, min: 0, max: 5e4, dec: 0 },
    energy_tank_min: { unit: " %", step: 1, min: 0, max: 100, dec: 0 },
    pv_self_use: { unit: " %", step: 5, min: 0, max: 100, dec: 0 },
    cool_setpoint: { unit: " °C", step: 0.5, min: 18, max: 30, dec: 1 },
    ac_min_on: { unit: " min", step: 1, min: 1, max: 120, dec: 0 },
    ac_min_off: { unit: " min", step: 1, min: 1, max: 120, dec: 0 },
    hysteresis_k: { unit: " K", step: 0.1, min: 0.2, max: 2, dec: 1 },
    ac_cop: { unit: "", step: 0.1, min: 1, max: 6, dec: 1 },
    gas_price: { unit: " €/kWh", step: 0.01, min: 0, max: 1, dec: 2 },
    electric_price: { unit: " €/kWh", step: 0.01, min: 0, max: 2, dec: 2 },
    shading_position: { unit: " %", step: 5, min: 0, max: 100, dec: 0 },
    shading_min_temp: { unit: " °C", step: 0.5, min: 5, max: 30, dec: 1 },
    shading_outdoor_min: { unit: " °C", step: 1, min: 0, max: 35, dec: 0 },
    shading_manual_minutes: { unit: " min", step: 15, min: 0, max: 480, dec: 0 },
    floor_max_temp: { unit: " °C", step: 0.5, min: 20, max: 35, dec: 1 },
    floor_min_temp: { unit: " °C", step: 0.5, min: 10, max: 26, dec: 1 },
    floor_band: { unit: " K", step: 0.5, min: 0.5, max: 5, dec: 1 },
    floor_cycle_min: { unit: " min", step: 5, min: 5, max: 180, dec: 0 },
    floor_lead_min: { unit: " min", step: 15, min: 0, max: 360, dec: 0 },
    floor_flow_min: { unit: " K", step: 0.5, min: 0, max: 20, dec: 1 },
    window_open_delay: { unit: " s", step: 5, min: 0, max: 600, dec: 0 },
    window_close_delay: { unit: " s", step: 5, min: 0, max: 600, dec: 0 },
    presence_target: { unit: " °C", step: 0.5, min: 5, max: 30, dec: 1 },
    presence_delay_min: { unit: " min", step: 1, min: 0, max: 30, dec: 0 },
    presence_release_min: { unit: " min", step: 1, min: 1, max: 30, dec: 0 },
    room_eco_after: { unit: " min", step: 5, min: 5, max: 240, dec: 0 },
    external_heat_after: { unit: " min", step: 5, min: 0, max: 180, dec: 0 },
    room_eco_drop: { unit: " °C", step: 0.5, min: 0.5, max: 4, dec: 1 }
  };

  // src/cards/settings/const.js
  var RK_GROUP_META = {
    home: { label: "Wohnung", icon: "mdi:home-outline" },
    room: { label: "Raum", icon: "mdi:door-open" },
    heating: { label: "Heizung", icon: "mdi:radiator" },
    health: { label: "Gesundheit", icon: "mdi:heart-pulse" },
    energy: { label: "Energie & Tarife", icon: "mdi:lightning-bolt" },
    weather: { label: "Wetter", icon: "mdi:weather-partly-cloudy" },
    air: { label: "Lüften", icon: "mdi:weather-windy" },
    shade: { label: "Verschattung", icon: "mdi:blinds" },
    presence: { label: "Anwesenheit", icon: "mdi:account-multiple-outline" },
    night: { label: "Nacht", icon: "mdi:weather-night" },
    notify: { label: "Benachrichtigungen", icon: "mdi:bell-outline" },
    reports: { label: "Berichte", icon: "mdi:file-chart-outline" },
    learn: { label: "Lernen", icon: "mdi:chart-line" },
    layout: { label: "Darstellung", icon: "mdi:view-dashboard-outline" },
    advanced: { label: "Erweitert", icon: "mdi:cog-outline" }
  };
  var RK_IMPLICIT = {
    preheat_mode: "auto",
    quiet_mode: "auto",
    mold_cap: 1.5,
    wall: "auto",
    night_airing: "auto",
    virtual_window: "auto",
    co2_limit: 1e3,
    trv_interval: 0,
    fast_poll: false,
    schedule_fallback: "wish",
    override_minutes: 120,
    boost_sources: "selected",
    airing_min_minutes: 0,
    long_airing_minutes: 20,
    long_airing_remind: 90,
    airing_occupied_only: true,
    home_office_from: "08:00",
    home_office_to: "17:00",
    home_office_check: true,
    home_sensors: "mmwave",
    work_zone_minutes: 5,
    vacation_km: 0,
    vacation_hours: 12,
    night_level: "long",
    report_metric: "auto",
    storm_gust_kmh: 70,
    storm_rain_mm: 8,
    presence_delay_min: 5,
    presence_release_min: 5,
    presence_pir: false,
    presence_kind: "auto",
    room_eco: "auto",
    solar_gain: false,
    presence_off: false,
    presence_source: "both",
    learn_shift: false,
    frost_night: false
  };
  var RK_LAYOUT_COLORS = ["#1eb6a6", "#34a86e", "#e8982e", "#e2643c", "#7c6adc", "#3c8cdc", "#c94f8a", "#7a8288"];
  var RK_GROUP_ORDER = ["home", "room", "heating", "health", "air", "shade", "presence", "night", "notify", "reports", "learn", "layout", "advanced"];
  var NAV2_DEFAULT = true;
  var SETTINGS_SECTIONS = [
    { id: "home", label: "Wohnungen", icon: "mdi:home-outline", groups: ["home", "learn"] },
    { id: "rooms", label: "Räume", icon: "mdi:door-open", groups: [] },
    { id: "presence", label: "Personen & Anwesenheit", icon: "mdi:account-multiple-outline", groups: ["presence", "night"] },
    { id: "energy", label: "Heizung & Energie", icon: "mdi:radiator", groups: ["energy", "weather", "heating", "reports"] },
    { id: "notify", label: "Benachrichtigungen", icon: "mdi:bell-outline", groups: ["notify"] },
    { id: "system", label: "System & Diagnose", icon: "mdi:cog-outline", groups: ["health", "layout", "advanced"] }
  ];
  var SETTINGS_ROOM_GROUPS = ["room", "heating", "air", "shade", "presence", "notify", "learn"];
  var ROOM_TABS = [
    { id: "overview", label: "Übersicht", icon: "mdi:view-dashboard-outline" },
    { id: "control", label: "Regelung", icon: "mdi:thermometer" },
    { id: "schedule", label: "Zeitplan", icon: "mdi:calendar-clock" },
    { id: "windows", label: "Fenster & Lüften", icon: "mdi:window-open-variant" },
    { id: "presence", label: "Präsenz", icon: "mdi:motion-sensor" },
    { id: "sources", label: "Heizquellen", icon: "mdi:radiator" },
    { id: "devices", label: "Geräte & Sensoren", icon: "mdi:thermometer-lines" },
    { id: "notify", label: "Meldungen", icon: "mdi:bell-outline" },
    { id: "mold", label: "Schimmel", icon: "mdi:shield-home-outline" },
    { id: "learn", label: "Lernen & Verlauf", icon: "mdi:chart-line" }
  ];
  var ROOM_TAB_DEFAULT = "overview";
  var ROOM_APPLY_KEYS = [
    "comfort_temperature",
    "setback_short",
    "setback_long",
    "frost_temperature",
    "window_open_delay",
    "window_close_delay",
    "preheat_mode",
    "preheat_lead_min",
    "preheat_not_before",
    "quiet_mode",
    "night_airing",
    "virtual_window",
    "solar_gain",
    "mold_mode",
    "mold_cap",
    "dehumidifier_on",
    "dehumidifier_off",
    "dehumidifier_delay",
    "dehumidifier_power",
    "dehumidifier_energy",
    "wall",
    "cooling",
    "cool_setpoint",
    "ac_min_on",
    "ac_min_off",
    "shading_mode",
    "shading_position",
    "shading_min_temp",
    "shading_outdoor_min",
    "shading_night",
    "shading_manual_minutes",
    "floor_heating",
    "floor_max_temp",
    "floor_min_temp",
    "floor_band",
    "floor_cycle_min",
    "floor_lead_min",
    "floor_flow_min",
    "co2_limit",
    "notify_cap",
    "presence_target",
    "presence_delay_min",
    "presence_release_min",
    "presence_pir",
    "presence_learn",
    "room_eco",
    "room_eco_after",
    "room_eco_drop",
    "airing_min_minutes",
    "long_airing_minutes",
    "long_airing_remind",
    "airing_occupied_only",
    "fast_poll",
    "trv_interval",
    "valve_control",
    "schedule_fallback",
    "boost_temperature",
    "boost_minutes",
    "override_minutes"
  ];
  var ROOM_SEARCH = [
    { terms: ["wunschtemperatur", "solltemperatur", "komfort", "temperatur"], tab: "control", label: "Regelung" },
    { terms: ["zeitplan", "zeitfenster", "vorheizen"], tab: "schedule", label: "Zeitplan" },
    { terms: ["fenster", "lüften", "feuchte", "co2"], tab: "windows", label: "Fenster & Lüften" },
    { terms: ["verschattung", "rollladen", "jalousie", "sonnenschutz"], tab: "windows", label: "Verschattung" },
    { terms: ["fußbodenheizung", "fussbodenheizung", "vorlauf", "rücklauf", "spreizung", "fließ"], tab: "control", label: "Fußbodenheizung" },
    { terms: ["präsenz", "anwesenheit", "melder"], tab: "presence", label: "Präsenz" },
    { terms: ["heizquelle", "thermostat", "klimaanlage", "klimagerät", "klima", "ac", "split", "kühlen", "quelle hinzufügen"], tab: "sources", label: "Heizquellen" },
    { terms: ["ventil", "ventilsteuerung", "stellglied", "trvzb"], tab: "devices", label: "Ventilsteuerung" },
    { terms: ["sensor", "batterie", "funk", "kalibrierung"], tab: "devices", label: "Geräte & Sensoren" },
    { terms: ["meldung", "empfänger", "lichtsignal"], tab: "notify", label: "Meldungen" },
    { terms: ["schimmel", "wand"], tab: "mold", label: "Schimmel" },
    { terms: ["lernen", "aufheizen", "verlauf"], tab: "learn", label: "Lernen & Verlauf" }
  ];
  var RK_SHADE = () => ({
    off: t("Aus"),
    advise: t("Nur empfehlen"),
    auto: t("Automatisch")
  });
  var RK_VALVE = () => ({
    off: t("Aus"),
    auto: t("Automatisch"),
    on: t("Immer")
  });
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

  // src/cards/settings/sections/home.js
  var HomeSectionMethods = {
    _groupHomeWelcome(ctx) {
      const { ch, st } = ctx;
      return this._grp("home", "Erste Schritte", "mdi:check-decagram-outline", "ok", this._checkRows(st, ch), "span");
    },
    _groupHomeApartment(ctx) {
      const { ch, st, H } = ctx;
      const frsi = fmt({ unrenovated: 0.6, renovated: 0.7, new: 0.8 }[this._hubOpt("building_type")] || 0.7, 2);
      const homes = this._cfg.homes || [];
      const homeRows = [
        this._row("Name der Wohnung", `<input class="inp" data-hubtext="name" value="${esc(this._hubOpt("name") || "")}" placeholder="${t("z. B. Ferienwohnung")}" ${this._admin ? "" : "disabled"}>`, "erscheint im Umschalter oben im Dashboard"),
        this._row("Bauart", this._segs(H, "building_type", RK_BUILDING, this._hubOpt("building_type"))),
        `<div class="hint">${t("Der Schimmelschutz rechnet bei längerer Abwesenheit mit der kältesten Wandstelle (Temperaturfaktor {f} nach DIN 4108-2). Ist die Raumluft feucht, wird weniger abgesenkt – warme Luft nimmt mehr Feuchte auf und die Wand bleibt unter 80 % Feuchte.", { f: frsi })}</div>`,
        this._row("Wetterquelle", this._select(H, "weather_entity", ch.weather || [], this._hubOpt("weather_entity"), "– wählen –"), st.outdoor_temperature != null ? t("Draußen gerade {v} °C", { v: fmt(st.outdoor_temperature) }) : ""),
        this._more("home-more", "Dashboard, Standort, weitere Wohnung", [
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
            return this._row(
              "Standort der Wohnung",
              `<span class="v"><input type="number" class="inp short" step="0.0001" min="-90" max="90" data-hubgeo="latitude" value="${lat ?? ""}" placeholder="${t("Breite")}" ${this._admin ? "" : "disabled"}> <input type="number" class="inp short" step="0.0001" min="-180" max="180" data-hubgeo="longitude" value="${lon ?? ""}" placeholder="${t("Länge")}" ${this._admin ? "" : "disabled"}> ${this._admin ? `<button class="mini" data-geohass title="${t("Werte von Home Assistant übernehmen")}">${t("von HA")}</button>${own ? `<button class="mini x" data-geoclear title="${t("leeren – dann gilt Home Assistant")}">✕</button>` : ""}` : ""}</span>`,
              t("Leer lassen = es gilt der Standort aus der Zone dieser Wohnung ({zone}{zl}). Ist keine Zone gesetzt, gilt der Standort von Home Assistant ({lat} / {lon}). Nur eintragen, wenn die Wohnung woanders liegt – daraus rechnet Raumklima den Sonnenstand; „von HA“ übernimmt die HA-Werte zum Anpassen.", {
                zone: zn || t("keine Zone gesetzt"),
                zl: zlat != null && zlon != null ? `, ${fmt(zlat, 4)} / ${fmt(zlon, 4)}` : "",
                lat: haLat,
                lon: haLon
              })
            );
          })(),
          this._admin ? `<div class="addrow"><input class="inp" id="newHome" placeholder="${t("Neue Wohnung, z. B. Ferienwohnung")}"><button class="btn" data-newhome style="--c:var(--rk-ok)"><ha-icon icon="mdi:home-plus-outline"></ha-icon>${t("Wohnung anlegen")}</button></div>` : "",
          `<div class="hint">${homes.length > 1 ? t("{n} Wohnungen: {list}. Jede hat eigene Bewohner, Zone, Empfänger, Heizsaison und Protokoll; Räume ordnest du im Raum unter „Wohnung“ zu.", { n: homes.length, list: homes.map((h) => esc(h.name) + " (" + t("{n} Räume", { n: h.rooms.length }) + ")").join(", ") }) : t("Für eine zweite Wohnung (z. B. Ferienwohnung) mit eigenen Bewohnern, Zone und Empfängern hier anlegen. Bestehende Räume bleiben in dieser Wohnung.")}</div>`
        ].join(""), "hub", ["dashboard", "latitude", "longitude"])
      ].join("");
      return this._grp("home", "Wohnung", "mdi:home-switch-outline", "air", homeRows);
    },
    _groupLearn(ctx) {
      return this._learnHub(ctx.st);
    }
  };

  // src/cards/settings/sections/presence.js
  var PresenceSectionMethods = {
    _groupPresence(ctx) {
      const { ch, st, H, hubIds, pres, residents, persons } = ctx;
      const allPersons = ch.persons || [];
      const shownPersons = this._allPersons ? allPersons : rkRelevantPersons(allPersons, residents);
      const hiddenCount = allPersons.length - shownPersons.length;
      const personChips = shownPersons.map((p) => {
        const on = residents.includes(p.id);
        const info = persons[p.id];
        const where = info ? info.present ? info.source === "wifi" ? t("da (WLAN)") : info.source === "gps" ? t("da (GPS)") : t("da") : info.distance_km != null ? `${fmt(info.distance_km, info.distance_km < 10 ? 1 : 0)} km` : t("unbekannt") : "";
        return `<button class="chip2 ${on ? "" : "off"}" data-person="${p.id}" style="--c:${on ? info && info.present ? "var(--rk-ok)" : "var(--rk-eco)" : "var(--rk-off)"}" ${this._admin ? "" : "disabled"}><i></i>${esc(p.name)}${on && where ? ` · ${where}` : ""}</button>`;
      }).join("") + (hiddenCount > 0 ? `<button class="chip2 off" data-allpersons="1" style="--c:var(--rk-off)">${t("+ weitere Personen ({n})", { n: hiddenCount })}</button>` : this._allPersons && residents.length ? `<button class="chip2 off" data-allpersons="0" style="--c:var(--rk-off)">${t("nur Bewohner zeigen")}</button>` : "");
      const presRows = [
        `<div class="status"><span class="chip" style="--tone:${toneVar(pres.tone)}"><ha-icon icon="${pres.icon}"></ha-icon>${pres.label}${st.stage === "preheat" && st.preheat_by ? ` · ${esc(st.preheat_by)}` : ""}</span>${st.presence_configured || this._hubOpt("presence_off") ? "" : `<span class="chip" style="--tone:var(--rk-warn)"><ha-icon icon="mdi:information-outline"></ha-icon>${t("Bewohner und Zone wählen, dann ist es aktiv")}</span>`}</div>`,
        this._row("Wer wohnt hier?", `<div class="chips">${personChips || this._v("keine Personen in HA", true)}</div>`, "Tippen zum Aus-/Abwählen. Zählt, sobald eins ihrer Handys in der Zone ist. Nicht gewählte Personen (z. B. admin) werden ausgeblendet und auch sonst nirgends angeboten."),
        this._row("Wohnung (Zone)", this._select(H, "zone", ch.zones || [], this._hubOpt("zone"), "– wählen –")),
        this._row(
          "Anwesenheit erkennen über",
          this._segs(H, "presence_source", { both: t("GPS und WLAN"), gps: t("nur GPS"), wifi: t("nur WLAN") }, this._hubOpt("presence_source") || "both"),
          "WLAN/Router kennt nur „zu Hause“ oder „weg“ – Entfernung und Vorheizen auf der Heimfahrt gehen nur mit GPS"
        ),
        this._row("Absenken nach", this._num(H, "away_delay", this._hubOpt("away_delay")), "damit kurze Wege nichts auslösen"),
        this._row("Urlaub", this._toggle(hubIds.vacation), "endet automatisch bei Ankunft"),
        this._row("Gäste da", this._toggle(hubIds.guests), "nicht absenken, auch wenn alle Bewohner weg sind"),
        this._row("Homeoffice", this._toggle(hubIds.home_office), "im Fenster gilt der Wunsch, der Zeitplan pausiert"),
        this._more("pres-ho", "Homeoffice & Kalender", [
          (() => {
            const items = Array.from({ length: 96 }, (_x, q) => {
              const h = Math.floor(q / 4), m = q % 4 * 15;
              const id = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
              return { id, name: id };
            });
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
            "Homeoffice nur wenn jemand da",
            this._optToggle(H, "home_office_check", this._hubOpt("home_office_check") !== false),
            "gilt für Kalendertermine; der Schalter heizt auch ohne Ortung"
          ),
          this._row(
            "Homeoffice über Entität",
            this._select(H, "home_office_entity", ch.signals || [], this._hubOpt("home_office_entity"), "– keiner –"),
            "HA-Schalter, der Homeoffice mit schaltet – gilt wie der Schalter, ohne Anwesenheitsprüfung"
          ),
          this._row(
            "Kalender",
            this._select(H, "calendar_entity", ch.calendars || [], this._hubOpt("calendar_entity"), "– keiner –"),
            st.calendar && st.calendar.mode ? t("gerade: „{s}“", { s: esc(st.calendar.summary || "") }) : "Termine mit diesen Wörtern steuern die Anwesenheit"
          ),
          this._hubOpt("calendar_entity") ? this._row("… wie Urlaub", `<input class="inp" data-hubtext="calendar_away_words" value="${esc(this._hubOpt("calendar_away_words") || "")}" ${this._admin ? "" : "disabled"}>`, "Komma-getrennt; absenken wie „länger weg“, sobald niemand da ist") : "",
          this._hubOpt("calendar_entity") ? this._row("… Homeoffice / zu Hause", `<input class="inp" data-hubtext="calendar_home_words" value="${esc(this._hubOpt("calendar_home_words") || "")}" ${this._admin ? "" : "disabled"}>`, "Komma-getrennt, freie Wahl; ein Termin mit diesem Wort schaltet Homeoffice und senkt nicht ab") : "",
          this._row(
            "Schulferien-Kalender",
            this._select(H, "school_calendar_entity", ch.calendars || [], this._hubOpt("school_calendar_entity"), "– keiner –"),
            st.school_holiday ? t("gerade: „{s}“", { s: esc(st.school_holiday) }) : "an Ferientagen starten Morgen-Zeitfenster später"
          ),
          this._hubOpt("school_calendar_entity") ? this._row("Morgens später", this._num(H, "school_shift_minutes", this._hubOpt("school_shift_minutes")), "nur Zeitfenster, die vor 12:00 beginnen – 0 = aus") : "",
          this._row(
            "Plan-Umschalter",
            this._select(H, "plan_selector", ch.plan_selectors || [], this._hubOpt("plan_selector"), "– keiner –"),
            this._hubOpt("plan_selector") ? t("gerade: {p} – je Raum unter Zeitplan → Weitere Einstellungen festlegen, was in welchem Plan gilt", { p: esc((st.plan || {}).now || "–") }) : "z. B. Auswahl-Helfer „Arbeitszeit / frei / krank“ – jeder Raum bekommt je Plan seinen eigenen Zeitplan"
          ),
          this._hubOpt("school_calendar_entity") ? this._row(t("Schulferien – jetzt"), this._v(st.school_holiday ? `${esc(st.school_holiday)} · ${st.school_shift_minutes ? t("morgens {n} min später", { n: st.school_shift_minutes }) : t("keine Verschiebung")}` : t("keine Schulferien"), !st.school_holiday), "") : ""
        ].join(""), "hub", ["home_office_from", "home_office_to", "home_office_rooms", "home_office_check", "home_office_entity", "calendar_entity", "school_calendar_entity", "school_shift_minutes"]),
        ...(() => {
          const cal = st.calendar;
          if (!cal) return [];
          const cur = (cal.events || [])[0];
          const up = cal.upcoming || [];
          const when = (e) => e && e.all_day ? esc(String(e.start || "").slice(0, 10)) : esc(String(e && e.start || "").slice(11, 16));
          const label = (e) => e && e.mode === "home" ? t("Homeoffice") : e && e.mode === "away" ? t("Urlaub") : t("kein Einfluss");
          return [
            this._row(t("Kalender – jetzt"), this._v(cur ? `${esc(cur.summary)} · ${when(cur)} · ${label(cur)}` : t("kein Termin"), !cur), ""),
            ...up.slice(0, 5).map((e) => this._row(t("Kalender – als Nächstes"), this._v(`${esc(e.summary)} · ${when(e)} · ${label(e)}`, true), ""))
          ];
        })(),
        this._more("pres-more", "Weitere Einstellungen", [
          this._row(
            "Anwesenheit aus",
            this._optToggle(H, "presence_off", !!this._hubOpt("presence_off")),
            "keine Auswertung: nichts wird nach Anwesenheit abgesenkt, nichts vorgeheizt, keine Weg-Meldungen – gedacht, wenn keine Ortung möglich ist"
          ),
          this._row(
            "Gäste gelten für",
            `<div class="chips">${this._orderedRooms().map((r) => {
              const rid = (r.attrs && r.attrs.settings || {}).entry_id || r.id;
              const chosen = (this._hubOpt("guests_rooms") || []).includes(rid);
              return `<button class="chip2 ${chosen ? "" : "off"}" data-guestroom="${rid}" title="${esc(r.name)}"><i></i>${esc(r.name)}</button>`;
            }).join("")}</div>`,
            (this._hubOpt("guests_rooms") || []).length ? t("nur diese Räume werden nicht abgesenkt") : t("keine Auswahl = alle Räume der Wohnung")
          ),
          this._row("„Länger weg“ ab", this._num(H, "long_away_hours", this._hubOpt("long_away_hours"))),
          this._row("Vorheizen ab", this._num(H, "preheat_km", this._hubOpt("preheat_km")), "wenn sich jemand nähert"),
          this._row("Urlaub automatisch ab", this._num(H, "vacation_km", this._hubOpt("vacation_km") ?? 0), "sind alle Bewohner weiter weg, gilt nach der Wartezeit Urlaub – 0 = aus"),
          this._row("… nach", this._num(H, "vacation_hours", this._hubOpt("vacation_hours") ?? 12), "erst so lange weit weg zählt als Urlaub (Tagesausflug löst nicht aus)"),
          this._row("Arbeitsplätze", `<div class="chips">${(ch.zones || []).map((z) => {
            const chosen = (this._hubOpt("work_zones") || []).includes(z.id);
            return `<button class="chip2 ${chosen ? "" : "off"}" data-workzone="${z.id}" title="${esc(z.name)}"><i></i>${esc(z.name)}</button>`;
          }).join("")}</div>`, "Zonen, in denen gearbeitet wird – wer dort ist, kommt so schnell nicht zurück"),
          this._row("… gilt nach", this._num(H, "work_zone_minutes", this._hubOpt("work_zone_minutes") ?? 5), "so lange dort, dann gilt die Wohnung sofort als leer (kein Vorheizen, keine Wartezeit)"),
          this._row(
            "Präsenzmelder zählen",
            this._segs(H, "home_sensors", RK_HOMESENS, this._hubOpt("home_sensors") || "mmwave"),
            st.sensed && st.sensed.length ? t("gerade jemand in: {r}", { r: esc(st.sensed.join(", ")) }) : "sieht ein Melder jemanden, wird nicht abgesenkt – PIR löst auch bei Haustieren aus, darum standardmäßig nur mmWave; im Urlaub zählen Melder nie"
          )
        ].join(""), "hub", ["presence_off", "guests_rooms", "long_away_hours", "preheat_km", "vacation_km", "vacation_hours", "work_zones", "work_zone_minutes", "home_sensors"])
      ].join("");
      return this._grp("presence", "Anwesenheit & Absenkung", "mdi:home-account", "eco", presRows);
    },
    _groupNight(ctx) {
      const { ch, st, H } = ctx;
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
        this._row("Ruhezeit", `<span class="v">${this._timeField("quiet_start", this._hubOpt("quiet_start"))} – ${this._timeField("quiet_end", this._hubOpt("quiet_end"))}</span>`, "nur Dringendes (kühlt aus, Fenster offen bei Abwesenheit, Thermostat-Fehler) kommt laut"),
        this._row("Wochenende bis", `<span class="v">${this._timeField("quiet_end_weekend", this._hubOpt("quiet_end_weekend"))}</span>`, "Sa und So endet die Ruhezeit später – zum Ausschlafen"),
        this._row("Ruhezeit senkt ab", this._optToggle(H, "quiet_setback", !!this._hubOpt("quiet_setback")), "während der Ruhezeit werden Schlafzimmer und selten genutzte Räume abgesenkt – auch wenn jemand zu Hause ist"),
        lrn("weekday", "Werktags"),
        lrn("weekend", "Wochenende"),
        this._more("night-more", "Weitere Einstellungen", [
          this._row("Absenkwert nachts", this._select(H, "night_level", [{ id: "short", name: t("Kurz weg") }, { id: "long", name: t("Länger weg") }, { id: "frost", name: t("Frostschutz") }], this._hubOpt("night_level") || "long"), "gilt bei der Ruhezeit und wenn der Schalter „Nachtruhe“ an ist – je Raum unter „Nachtabsenkung“ ein- oder ausgeschlossen"),
          this._row(
            "Nachtruhe über Entität",
            this._select(H, "night_entity", ch.signals || [], this._hubOpt("night_entity"), "– keiner –"),
            "HA-Schalter, der die Nachtruhe mit schaltet – der eigene Schalter bleibt"
          ),
          this._row("Nachtlüften", `<span class="v">${this._timeField("night_start", this._hubOpt("night_start"))} – ${this._timeField("night_end", this._hubOpt("night_end"))}</span>`, "Fenster in Schlafräumen, das in dieser Zeit aufgeht, gilt als Schlafen bei offenem Fenster – keine Lüft-Hinweise, morgens ein Gruß"),
          this._row("… leise warnen unter", this._num(H, "night_alarm_temp", this._hubOpt("night_alarm_temp")), "einmal pro Nacht"),
          this._row("Zeiten lernen", this._optToggle(H, "learn_times", !!this._hubOpt("learn_times")), "aus Nachtlüften und Licht – verlängert Ruhezeit und Nachtlüften nur, verkürzt nie"),
          this._row("Schichtdienst", this._optToggle(H, "learn_shift", !!this._hubOpt("learn_shift")), "auch Tagschlaf lernen: ins Bett bis 09:00, aufstehen bis 17:00 – für Nachtschicht und Wechselschicht"),
          this._row("Feiertage", this._select(H, "holiday_state", ch.states || [], this._hubOpt("holiday_state") || "", "– keine –"), sl.tonight && sl.tonight.holiday ? t("morgen: {h} – Ruhezeit wie am Wochenende", { h: esc(sl.tonight.holiday) }) : "Nacht vor einem Feiertag gilt wie Wochenende"),
          this._row("Schlaf-Signale", `<div class="chips">${sigChips || this._v("keine", true)}</div>`, "Lichter: abends alle 20 min aus = ins Bett, morgens eins an = aufgestanden"),
          this._admin && sigAvail.length ? `<div class="addrow"><select class="sel" id="addSig">${sigAvail.map((x) => `<option value="${esc(x.id)}">${esc(x.name)}</option>`).join("")}</select><button class="btn" data-sigadd style="--c:var(--rk-eco)"><ha-icon icon="mdi:lightbulb-plus-outline"></ha-icon>${t("Signal hinzufügen")}</button></div>` : "",
          `<div class="hint">${t("Jede Nacht zählt einmal (frühestes Ereignis). Gelernt wird zuerst je Wochentag (Schichtdienst), sonst nach Werktag und Wochenende (Fr→Sa, Sa→So); gelernt wird der typische Wert (Median) der letzten 6 Wochen, sobald 4 Nächte da sind. Die Ruhezeit beginnt 30 min vor der typischen Bettzeit und endet 30 min nach dem Aufstehen – aber nie kürzer als eingestellt.")}</div>`
        ].join(""), "hub", ["night_level", "night_entity", "night_start", "night_end", "night_alarm_temp", "learn_times", "learn_shift", "holiday_state", "sleep_signals"])
      ].join("");
      return this._grp("night", "Nacht & Ruhezeit", "mdi:sleep", "eco", sleepRows, "span");
    }
  };

  // src/cards/settings/sections/heating.js
  var HeatingSectionMethods = {
    _groupHeating(ctx) {
      const { ch, st, H, seas } = ctx;
      const mode = this._hubOpt("season_mode");
      const mdToInput = (v) => v && /^\d{2}-\d{2}$/.test(v) ? `2000-${v}` : "";
      const seasRows = [
        `<div class="status"><span class="chip" style="--tone:${toneVar(seas.tone)}"><ha-icon icon="${seas.icon}"></ha-icon>${seas.label}</span>
        <span class="chip" style="--tone:var(--rk-off)"><ha-icon icon="mdi:thermometer"></ha-icon>${t("Ø 24 h {p} · Vorhersage {f}", { p: st.mean_past == null ? t("sammelt noch") : fmt(st.mean_past) + "°", f: st.mean_forecast == null ? "–" : fmt(st.mean_forecast) + "°" })}</span></div>`,
        this._row("Betriebsart", this._segs(H, "season_mode", RK_MODES, mode)),
        this._row("Heizgrenze", this._num(H, "heating_limit", this._hubOpt("heating_limit")), "Tagesmittel außen, darüber Heizpause (nach 2 milden Tagen)"),
        this._row("Heute heizen", st.heat_today_until ? `<button class="btn" data-action="cancel_heat_today" style="--c:var(--rk-heat)"><ha-icon icon="mdi:close"></ha-icon>${t("Beenden")}</button>` : `<button class="btn" data-action="heat_today" style="--c:var(--rk-heat)" ${this._admin ? "" : "disabled"}><ha-icon icon="mdi:fire"></ha-icon>${t("24 h heizen")}</button>`, "für milde, aber kühle Tage"),
        this._more("seas-more", "Weitere Einstellungen", [
          this._row("Heizsaison", `<span class="v"><input class="inp short" type="date" data-md="season_start" value="${mdToInput(this._hubOpt("season_start"))}" ${this._admin ? "" : "disabled"}> ${t("bis")} <input class="inp short" type="date" data-md="season_end" value="${mdToInput(this._hubOpt("season_end"))}" ${this._admin ? "" : "disabled"}></span>`, "Kalender antippen – Tag und Monat zählen, das Jahr ist egal"),
          this._row("Außentemperatur von", this._select(H, "outdoor_temp_entity", ch.outdoor || [], this._hubOpt("outdoor_temp_entity"), "Wetterdienst"), "eigene Wetterstation statt Wetterdienst – die Vorhersage kommt weiterhin vom Wetterdienst"),
          this._row("Kälteeinbruch unter", this._num(H, "cold_snap_temp", this._hubOpt("cold_snap_temp")), "3 Tage darunter → heizt auch außerhalb der Saison"),
          this._row("Sicherung", this._num(H, "frost_floor", this._hubOpt("frost_floor")), "fällt ein Raum darunter, heizt er immer"),
          this._row("Frostnacht: weniger absenken", this._optToggle(H, "frost_night", !!this._hubOpt("frost_night")), "unter −5 °C laut Vorhersage nur halb so tief – der Raum ist schneller wieder warm"),
          this._row("Sommerpflege Ventile", this._optToggle(H, "valve_care", !!this._hubOpt("valve_care")), "mittwochs 11 Uhr kurz öffnen")
        ].join(""), "hub", ["season_start", "season_end", "outdoor_temp_entity", "cold_snap_temp", "frost_floor", "frost_night", "valve_care"])
      ].join("");
      return this._grp("heating", "Heizsaison & Heizgrenze", "mdi:radiator", "heat", seasRows);
    }
  };

  // src/cards/settings/sections/energy.js
  var EnergySectionMethods = {
    _sensorInfo(entityId) {
      const st = entityId ? this._hass && this._hass.states[entityId] : null;
      if (!st) return "–";
      const v = Number.parseFloat(st.state);
      if (!Number.isFinite(v)) return st.state;
      const unit = st.attributes.unit_of_measurement || "";
      return `${fmt(v, 2)} ${unit}`.trim();
    },
    // Vorschläge aus dem Energie-Dashboard von Home Assistant: nur leere Felder, nur auf Knopfdruck
    _haEnergyBanner(source) {
      if (this._haSug === void 0 && this._hass) {
        this._haSug = null;
        this._hass.callWS({ type: "raumklima/energy/ha_suggest", ...this._homeMsg() }).then((r) => {
          this._haSug = r || { items: [] };
          this._sig = null;
          this._render();
        }).catch(() => {
          this._haSug = { items: [] };
        });
      }
      const sug = this._haSug;
      if (!sug || !sug.items) return "";
      const label = {
        energy_grid_entity: "Netzbezug",
        energy_feed_entity: "Einspeisung",
        energy_feed_price: "Einspeisevergütung",
        energy_tariff: "Preisquelle",
        energy_price: "Arbeitspreis",
        pv_entity: "PV-Ertrag",
        energy_battery_in_entity: "Akku geladen",
        energy_battery_out_entity: "Akku entladen",
        energy_meter: "Zähler"
      };
      const open = sug.items.filter((x) => x.empty && this._hubOpt(x.key) in { undefined: 1, null: 1, "": 1, 0: 1 });
      if (!open.length) {
        return sug.items.length ? `<div class="ehabox done"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${t("Alles aus dem Energie-Dashboard von Home Assistant ist schon eingetragen.")}</div>` : "";
      }
      const val = (x) => typeof x.value === "number" ? `${fmt(x.value, x.key === "energy_feed_price" ? 4 : 3)} €/kWh` : esc(x.name || x.value);
      return `<div class="ehabox"><div class="eh-t"><ha-icon icon="mdi:home-lightning-bolt-outline"></ha-icon><b>${t("Im Energie-Dashboard von Home Assistant gefunden")}</b></div>
      <ul>${open.map((x) => `<li><span>${t(label[x.key] || x.key)}</span><b>${val(x)}</b></li>`).join("")}</ul>
      <div class="eh-a"><small>${t("Übernommen werden nur leere Felder – deine Auswahl bleibt.")}</small><button class="btn" data-haenergy>${t("Übernehmen")}</button></div></div>`;
    },
    _groupEnergy() {
      const H = this._hubOpt.bind(this);
      const raw = H("energy_source") || "auto";
      const source = raw === "auto" ? "" : raw;
      const choices = this._cfg && this._cfg.choices || {};
      const energy = choices.energy || [];
      const meters = source === "oil" ? [...new Map([...energy, ...choices.oil || []].map((x) => [x.id, x])).values()] : energy;
      const heat = choices.heat || energy;
      const tariffs = choices.tariff || [];
      const electric = source === "heatpump" || source === "electric";
      const now = (id, empty) => id ? t("aktuell {v}", { v: this._sensorInfo(id) }) : t(empty);
      const step = (n, title, sub) => `<div class="estep"><span class="en">${n}</span><div><b>${t(title)}</b>${sub ? `<small>${t(sub)}</small>` : ""}</div></div>`;
      const guide = (title, lines) => `<details class="eguide" data-guide="${esc(title)}"${this._guideOpen && this._guideOpen.has(title) ? " open" : ""}><summary><ha-icon icon="mdi:book-open-variant"></ha-icon>${t(title)}</summary><ul>${lines.map((l) => `<li>${l}</li>`).join("")}</ul></details>`;
      const on = !!H("energy_enabled");
      const head = this._row(
        "Energie-Erfassung",
        this._optToggle("hub", "energy_enabled", on),
        "Zähler und Preise auswerten – Raumklima rechnet nur aus und steuert die Heizung nicht"
      );
      if (!on) return this._grp("energy", "Energie & Tarife", "mdi:lightning-bolt", "warn", head);
      const s1 = [
        step(1, "Wie heizt ihr?", "bestimmt, welche Zähler und Preise abgefragt werden"),
        this._row("Energiequelle", this._segs("hub", "energy_source", {
          heatpump: t("Wärmepumpe"),
          gas: t("Gas"),
          oil: t("Heizöl"),
          district: t("Fernwärme"),
          electric: t("Strom direkt")
        }, source), source ? "" : "bitte wählen – bisher automatisch erkannt"),
        guide("Anleitung: Welche Energiequelle passt?", [
          t("Wärmepumpe: Luft-, Sole- oder Wasser-Wärmepumpe – auch mit Heizstab, der läuft über denselben Stromzähler."),
          t("Strom direkt: Infrarotplatten, Nachtspeicher, Elektroheizkörper – eine kWh Strom ist eine kWh Wärme."),
          t("Gas: Brennwert- oder Heizwerttherme, auch Gasetagenheizung."),
          t("Fernwärme: Übergabestation im Keller, abgerechnet nach Wärmemenge."),
          t("Die Wahl ändert nichts an der Heizung selbst – sie legt nur fest, wie gerechnet wird.")
        ])
      ];
      if (!source) {
        return this._grp("energy", "Energie & Tarife", "mdi:lightning-bolt", "warn", [head, ...s1].join(""));
      }
      const haBanner = this._haEnergyBanner(source);
      const meterHint = {
        heatpump: "Strom der Wärmepumpe fürs Heizen – Gesamtzähler in kWh",
        electric: "Strom der Heizung – Gesamtzähler in kWh",
        gas: "Gaszähler in m³ oder kWh – Gesamtzähler",
        oil: "Liter-Zähler des Brenners – oder leer lassen und den Tank wählen",
        district: "Wärmemengenzähler der Übergabestation in kWh oder MWh"
      }[source];
      const s2 = [
        step(2, "Was wird gemessen?", "immer Gesamtzähler, die nur steigen – keine Tages- oder Wochenwerte"),
        this._row("Zähler", this._select("hub", "energy_meter", meters, H("energy_meter"), "– wählen –"), now(H("energy_meter"), meterHint)),
        source !== "oil" && source !== "district" ? this._row(
          "Zähler misst",
          this._segs("hub", "energy_meter_scope", { heating: t("nur Heizung"), total: t("Heizung + Warmwasser") }, H("energy_meter_scope") || "heating"),
          (H("energy_meter_scope") || "heating") === "total" ? "der Warmwasser-Zähler teilt dann nur auf und wird nicht dazugezählt – ideal für einen fein messenden Gesamtzähler (z. B. Energiemanager)" : "Warmwasser kommt über den eigenen Zähler dazu"
        ) : "",
        source === "heatpump" ? this._row(
          "Wärmemenge",
          this._select("hub", "energy_heat_entity", heat, H("energy_heat_entity"), "– keiner –"),
          now(H("energy_heat_entity"), "erzeugte Heizwärme – damit wird die Arbeitszahl gemessen statt geschätzt")
        ) : "",
        source === "heatpump" && H("energy_heat_entity") ? this._row(
          "Strom laut Wärmepumpe",
          this._select("hub", "energy_heat_elec_entity", meters, H("energy_heat_elec_entity"), "– keiner –"),
          now(H("energy_heat_elec_entity"), "optional: Strom fürs Heizen, wie die Wärmepumpe ihn selbst zählt – zeigt die Arbeitszahl zum Vergleich")
        ) : "",
        source === "heatpump" && !H("energy_heat_entity") ? this._row(
          "Jahresarbeitszahl",
          this._num("hub", "energy_efficiency", H("energy_efficiency") ?? 0),
          "nur ohne Wärmezähler: Wert aus dem Datenblatt, 0 = unbekannt"
        ) : "",
        source === "gas" ? this._row("Gas-Umrechnung", this._num("hub", "energy_factor", H("energy_factor") ?? 10), "kWh je m³ – steht auf der Gasrechnung") : "",
        source !== "oil" ? this._row(
          "Warmwasser-Zähler",
          this._select("hub", "energy_ww_meter", meters, H("energy_ww_meter"), "– keiner –"),
          now(H("energy_ww_meter"), "nur wenn Warmwasser getrennt gemessen wird – zählt dann mit zu den Kosten")
        ) : "",
        source === "heatpump" ? this._row(
          "Warmwasser-Wärme",
          this._select("hub", "energy_ww_heat_entity", heat, H("energy_ww_heat_entity"), "– keiner –"),
          now(H("energy_ww_heat_entity"), "erzeugte Warmwasser-Wärme – für die Arbeitszahl beim Warmwasser")
        ) : "",
        ...source === "oil" ? [
          this._row(
            "Tankfüllstand",
            this._select("hub", "energy_tank_entity", choices.tank || [], H("energy_tank_entity"), "– keiner –"),
            now(H("energy_tank_entity"), "Füllstand in %, L oder m³ – zeigt Restmenge und Bestellhinweis")
          ),
          H("energy_tank_entity") ? this._row("Tankinhalt", this._num("hub", "energy_tank_capacity", H("energy_tank_capacity") ?? 0), "Nenninhalt in Litern – nötig, wenn der Fühler Prozent meldet") : "",
          H("energy_tank_entity") ? this._row("Öl bestellen ab", this._num("hub", "energy_tank_min", H("energy_tank_min") ?? 20), "Restmenge in Prozent – darunter erscheint der Bestellhinweis") : "",
          this._row("kWh je Liter", this._num("hub", "energy_oil_factor", H("energy_oil_factor") ?? 10), "Energieinhalt – 10 kWh/L ist typisch"),
          this._row("Letzter Winter (Liter)", this._num("hub", "energy_oil_winter_liters", H("energy_oil_winter_liters") ?? 0), "aus der letzten Lieferung oder dem Tankbuch"),
          this._row("Letzter Winter (Tage)", this._num("hub", "energy_oil_winter_days", H("energy_oil_winter_days") ?? 0), "über wie viele Tage diese Liter reichten")
        ] : [],
        electric ? this._row(
          "Hausverbrauch",
          this._select("hub", "energy_house_entity", energy, H("energy_house_entity"), "– keiner –"),
          H("energy_house_entity") ? now(H("energy_house_entity"), "") : H("energy_grid_entity") && H("pv_entity") && H("energy_feed_entity") ? t("leer lassen geht: wird aus Netzbezug, PV, Einspeisung und Akku errechnet") : t("optional: Stromverbrauch des ganzen Hauses in kWh – oder Netzbezug, PV-Ertrag und Einspeisung wählen, dann rechnet Raumklima ihn aus")
        ) : "",
        electric ? this._row(
          "Netzbezug",
          this._select("hub", "energy_grid_entity", energy, H("energy_grid_entity"), "– keiner –"),
          now(H("energy_grid_entity"), "optional: Strom aus dem Netz in kWh – mit Hausverbrauch zählt PV und Batterie Stunde für Stunde")
        ) : "",
        electric ? this._row(
          "Einspeisung",
          this._select("hub", "energy_feed_entity", energy, H("energy_feed_entity"), "– keiner –"),
          now(H("energy_feed_entity"), "optional: Strom ins Netz in kWh – zeigt, wohin der Solarstrom ging")
        ) : "",
        electric && H("energy_feed_entity") ? this._row(
          "Einspeisevergütung",
          this._num("hub", "energy_feed_price", H("energy_feed_price") ?? 0),
          "€/kWh – steht im Bescheid des Netzbetreibers; 0 = nicht abziehen"
        ) : "",
        electric && (H("energy_house_entity") || H("energy_feed_entity")) && H("energy_grid_entity") ? this._row(
          "Akku geladen",
          this._select("hub", "energy_battery_in_entity", energy, H("energy_battery_in_entity"), "– keiner –"),
          now(H("energy_battery_in_entity"), "optional: Gesamtzähler „Batterie geladen“ in kWh")
        ) : "",
        electric && (H("energy_house_entity") || H("energy_feed_entity")) && H("energy_grid_entity") ? this._row(
          "Akku entladen",
          this._select("hub", "energy_battery_out_entity", energy, H("energy_battery_out_entity"), "– keiner –"),
          now(H("energy_battery_out_entity"), "optional: Gesamtzähler „Batterie entladen“ – mit beiden zählt nachts aus dem Netz geladener Akku-Strom zum Ladepreis")
        ) : "",
        electric && !(H("energy_house_entity") && H("energy_grid_entity")) ? this._row(
          "PV-Ertrag",
          this._select("hub", "pv_entity", choices.pv || [], H("pv_entity"), "– keiner –"),
          now(H("pv_entity"), "nur ohne Hausverbrauch und Netzbezug: grobe Schätzung über den Eigenverbrauch")
        ) : "",
        electric && H("pv_entity") && !(H("energy_house_entity") && H("energy_grid_entity")) ? this._row("PV-Eigenverbrauch", this._num("hub", "pv_self_use", H("pv_self_use") ?? 0), "Anteil des PV-Ertrags, der die Heizung deckt") : "",
        guide("Anleitung: Den richtigen Zähler finden", [
          t("Einstellungen → Geräte & Dienste → deine Heizung öffnen (z. B. Stiebel Eltron, Vaillant, Viessmann, Shelly am Heizungszähler)."),
          t("Den Sensor nehmen, der „gesamt“ oder „total“ heißt und in kWh, m³ oder L zählt. Nicht „heute“ oder „letzte 24 h“ – die springen zurück."),
          t("Wärmepumpe: Strom fürs Heizen und – wenn vorhanden – die erzeugte Heizwärme. Meldet sie Warmwasser getrennt, beides auch dort eintragen; Warmwasser zählt zu den Kosten."),
          t("Hausverbrauch und Netzbezug: z. B. vom Smart Meter, Energiemanager oder Wechselrichter. Damit rechnet Raumklima jede Stunde, wie viel Strom aus PV und Batterie kam."),
          t("Akku: die beiden Gesamtzähler „geladen“ und „entladen“ (z. B. „Battery Energy In/Out“). Lädt der Akku nachts aus dem Netz, ist dieser Strom später nicht kostenlos – Raumklima rechnet ihn zum Preis beim Laden."),
          t("Kein Zähler? Dann unter „Berichte“ die Heizkosten pro Jahr laut Abrechnung eintragen.")
        ])
      ];
      const fb = H("energy_tariff_fallbacks") || [];
      const primary = H("energy_tariff");
      const others = tariffs.filter((x) => x.id !== primary);
      const priceUnit = source === "oil" ? "€/L" : source === "gas" ? "€/kWh oder €/m³" : "€/kWh";
      const s3 = [
        step(3, "Was kostet die kWh?", "ein Preis für alles – Dashboard, Bericht und Vergleich rechnen gleich"),
        source === "oil" ? this._row("Ölpreis", this._num("hub", "energy_oil_price", H("energy_oil_price") ?? 1.1), "Preis je Liter der letzten Lieferung – wird mit Datum notiert") : this._row(
          "Preisquelle",
          this._select("hub", "energy_tariff", tariffs, primary, "– fester Preis –"),
          primary ? now(primary, "") : t("Sensor mit dem Arbeitspreis in {u} – oder fester Preis darunter", { u: priceUnit })
        ),
        electric && primary ? this._row(
          "Reserve-Preisquellen",
          `<div class="chips">${others.map((x) => {
            const chosen = fb.includes(x.id);
            return `<button class="chip2 ${chosen ? "" : "off"}" data-tarfb="${esc(x.id)}" title="${esc(x.id)}" ${this._admin ? "" : "disabled"}><i></i>${esc(x.name)}</button>`;
          }).join("") || `<span class="v mute">${t("keine weiteren Preis-Sensoren")}</span>`}</div>`,
          fb.length ? t("Reihenfolge: {l}", { l: esc(fb.map((id) => (tariffs.find((x) => x.id === id) || { name: id }).name).join(" → ")) }) : "springen ein, wenn die Hauptquelle nichts liefert – z. B. EPEX Spot"
        ) : "",
        source !== "oil" && !primary ? this._row("Arbeitspreis", this._num("hub", "energy_price", H("energy_price") ?? 0.3), "fester Preis je kWh, brutto – steht auf der Rechnung") : "",
        source === "oil" ? this._row(
          "Marktpreis-Entität",
          this._select("hub", "energy_oil_market_entity", choices.oil_market || [], H("energy_oil_market_entity"), "– keiner –"),
          now(H("energy_oil_market_entity"), "optionaler Heizöl-Marktpreis in €/L – für den Vergleich")
        ) : "",
        source === "oil" ? this._row("Preisverlauf", this._v((() => {
          const h = H("energy_oil_price_history") || [];
          const last = h[h.length - 1];
          return last ? `${esc(last.date)} · ${fmt(last.price, 2)} €/L` : t("noch kein Preis geändert");
        })(), !(H("energy_oil_price_history") || []).length), "wird beim Ändern des Ölpreises automatisch notiert") : "",
        this._row("Grundpreis", this._num("hub", "energy_base", H("energy_base") ?? 0), "monatliche Grundgebühr in €, brutto"),
        electric && H("energy_house_entity") ? this._row(
          "Grundgebühr-Anteil",
          this._segs("hub", "energy_base_share", { full: t("ganz"), usage: t("nach Verbrauch") }, H("energy_base_share") || "full"),
          "ganz = eigener Wärmepumpen-Zähler; nach Verbrauch = gemeinsamer Hauszähler"
        ) : "",
        electric && primary ? this._row("Dynamischer Tarif", this._optToggle("hub", "energy_tariff_dynamic", !!H("energy_tariff_dynamic")), "Preis wechselt stündlich – Dashboard zeigt Preiskurve und günstige Stunden") : "",
        this._more("energy-price", "Preis ohne Steuern und Netzentgelt?", [
          primary ? this._row("Preisbasis", this._segs("hub", "energy_price_basis", { gross: t("brutto"), net: t("netto") }, H("energy_price_basis") || "gross"), "netto = der Sensor liefert nur den Börsen- oder Nettopreis") : "",
          primary ? this._row("Zusätzliche Abgaben", this._num("hub", "energy_extra_fee", H("energy_extra_fee") ?? 0), "€/kWh, die im Sensor fehlen: Netzentgelt, Umlagen, Stromsteuer, Aufschlag") : "",
          primary && H("energy_price_basis") === "net" ? this._row("MwSt.", this._num("hub", "energy_vat", H("energy_vat") ?? 19), "kommt auf Preis und Abgaben drauf") : ""
        ].join(""), "hub", ["energy_price_basis", "energy_extra_fee", "energy_vat"]),
        this._row("Preis jetzt", this._v(`${fmt(this._energyPriceNow(), 3)} €/kWh`, false), this._energyPriceSub(source)),
        this._more("energy-compare", "Vergleichspreise", [
          source !== "gas" ? this._row("Gaspreis zum Vergleich", this._num("hub", "energy_compare_gas", H("energy_compare_gas") ?? 0.11), "€/kWh brutto – für „Was kostet 1 kWh Wärme?“") : "",
          source !== "oil" ? this._row("Ölpreis zum Vergleich", this._num("hub", "energy_compare_oil", H("energy_compare_oil") ?? 1.1), "€/L brutto – für „Was kostet 1 kWh Wärme?“") : "",
          source !== "heatpump" ? this._row("Strompreis zum Vergleich", this._num("hub", "energy_compare_power", H("energy_compare_power") ?? 0.3), "€/kWh brutto – was eine Wärmepumpe bei dir kosten würde (Arbeitszahl 3,5)") : ""
        ].join(""), "hub", ["energy_compare_gas", "energy_compare_oil", "energy_compare_power"]),
        guide("Anleitung: Welcher Preis ist der richtige?", [
          t("Am besten der Preis-Sensor deines Anbieters (z. B. 1KOMMA5°, Tibber, Octopus, Rabot): er kennt dein Netzentgelt und die MwSt – nichts weiter eintragen."),
          t("Zweitbeste Quelle: die Integration „EPEX Spot“ aus dem Marketplace. Der Börsenpreis ist überall in Deutschland gleich; regional verschieden ist das Netzentgelt."),
          t("Den Sensor „Total Price“ von EPEX Spot wählen, wenn dort Aufschlag und MwSt eingetragen sind. Sonst „Market Price“ wählen und hier unter „Preis ohne Steuern und Netzentgelt?“ auf netto stellen und die Abgaben eintragen."),
          t("Netzentgelt finden: Netzbetreiber steht auf der Stromrechnung. Auf dessen Website „Preisblatt Netzentgelte Strom“, Zeile Haushalt / ohne Leistungsmessung, Arbeitspreis in ct/kWh."),
          t("Netzentgelte ändern sich jedes Jahr zum 1. Januar – dann den Wert prüfen. Eine amtliche Tabelle zum Abrufen gibt es nicht."),
          t("Mehrere Quellen: die erste ist die Hauptquelle, Reserven springen ein, wenn sie nichts liefert. Fester Arbeitspreis: Preis je kWh von der Rechnung, brutto.")
        ])
      ];
      const s4 = [
        step(4, "Vergleich mit Klimagerät", "nur wenn ein Klimagerät auch heizen darf"),
        this._row("COP", this._num("hub", "ac_cop", H("ac_cop") ?? 3), "Leistungszahl beim Heizen laut Datenblatt (bei +7 °C)"),
        !electric ? this._row("Strompreis", this._num("hub", "electric_price", H("electric_price") ?? 0), "€/kWh brutto – die Heizung läuft nicht mit Strom, das Klimagerät schon") : ""
      ];
      const rows = [head, ...s1, haBanner, ...s2, ...s3, this._more("energy-ac", "Vergleich mit Klimagerät", s4.join(""), "hub", ["ac_cop", "electric_price"])].join("");
      return this._grp("energy", "Energie & Tarife", "mdi:lightning-bolt", "warn", rows);
    },
    _energyPriceNow() {
      const e = (this._cfg && this._cfg.hub && this._cfg.hub.state || {}).energy || {};
      return e.price ?? 0;
    },
    _energyPriceSub(source) {
      const e = (this._cfg && this._cfg.hub && this._cfg.hub.state || {}).energy || {};
      if (e.source_name) return t("aus {s}", { s: esc(e.source_name) });
      return source === "oil" ? "Ölpreis je Liter umgerechnet auf kWh" : "gleicher Wert wie im Dashboard und im Bericht";
    },
    _groupWeather() {
      const H = this._hubOpt.bind(this);
      const choices = this._cfg && this._cfg.choices || {};
      const w = H("weather_entity") ? this._hass && this._hass.states[H("weather_entity")] : null;
      const sun = this._hass && this._hass.states["sun.sun"];
      const a = w && w.attributes || {};
      const time = (iso) => iso ? new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "–";
      const rows = [
        this._row(
          "Wetterquelle",
          this._select("hub", "weather_entity", choices.weather || [], H("weather_entity"), "– wählen –"),
          t("Quelle für Außentemperatur, Vorhersage, Sonnenseite und Frostnacht")
        ),
        this._row(
          "Außentemperatur von",
          this._select("hub", "outdoor_temp_entity", choices.outdoor || [], H("outdoor_temp_entity"), "Wetterdienst"),
          t("eigene Wetterstation statt Wetterdienst – die Vorhersage kommt weiterhin vom Wetterdienst")
        ),
        this._row(
          "Aktuell",
          this._v(w ? `${esc(a.weather || w.state)} · ${fmt(a.temperature)} °C` : "–", !w),
          w && a.apparent_temperature != null ? t("gefühlt {v} °C", { v: fmt(a.apparent_temperature) }) : ""
        ),
        this._row("Feuchte", this._v(w && a.humidity != null ? `${fmt(a.humidity, 0)} %` : "–", !w), ""),
        this._row("Wind", this._v(w && a.wind_speed != null ? `${fmt(a.wind_speed, 1)} km/h` : "–", !w), ""),
        this._row("Sonne", this._v(sun ? t(sun.state === "above_horizon" ? "über dem Horizont" : "unter dem Horizont") : "–", !sun), t("für die Verschattung und die Sonnenprognose")),
        // next_rising/next_setting = Sonnenauf-/-untergang (next_dawn/next_dusk wären die Dämmerung)
        this._row("Sonnenaufgang", this._v(time((sun && sun.attributes || {}).next_rising), !sun), t("nächster Sonnenaufgang")),
        this._row("Sonnenuntergang", this._v(time((sun && sun.attributes || {}).next_setting), !sun), t("nächster Sonnenuntergang")),
        this._row("Heizgrenze", this._v(`${fmt(this._hubOpt("heating_limit") ?? 15, 1)} °C`, false), t("darunter gilt die Heizsaison")),
        this._row("Kälteeinbruch", this._v(`${fmt(this._hubOpt("cold_snap_temp") ?? 12, 1)} °C`, false), t("Vorhersage unter diesem Wert")),
        this._row("Sturm", this._v(`${fmt(this._hubOpt("storm_gust_kmh") ?? 70, 0)} km/h`, false), t("Böen ab dieser Stärke"))
      ];
      return this._grp("weather", "Wetter", "mdi:weather-partly-cloudy", "air", rows.join(""), "span");
    },
    _groupReports(ctx) {
      const { ch, H } = ctx;
      const reportRows = [
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
        this._hubOpt("report_email") && this._admin ? this._row("Test", `<button class="btn" data-pdftest style="--c:var(--rk-heat)"><ha-icon icon="mdi:email-fast-outline"></ha-icon>${t("Wochenbericht jetzt senden")}</button>`) : "",
        this._more("rep-more", "Weitere Einstellungen", [
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
          this._row("Heizkosten pro Jahr", `<span class="v"><input type="number" class="inp" min="0" max="20000" step="50" data-hubnum="annual_cost" value="${this._hubOpt("annual_cost") ?? ""}" placeholder="${t("z. B. 1400")}" ${this._admin ? "" : "disabled"} style="width:110px"> €</span>`, "optional, laut Abrechnung – nur für die Euro-Schätzung im PDF-Bericht (Ersparnis, „1 °C weniger = … €“)")
        ].join(""), "hub", ["report_metric", "annual_cost"])
      ].join("");
      return this._grp("reports", "Berichte", "mdi:file-chart-outline", "heat", reportRows);
    }
  };

  // src/cards/settings/sections/notify.js
  var NotifySectionMethods = {
    _groupRecipients(ctx) {
      const { ch } = ctx;
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
      return this._grp("notify", "Wer bekommt was", "mdi:account-voice", "air", `${cards}${addRow}`, "span") + this._groupRecipientHomes();
    },
    _groupRecipientHomes() {
      const current = this._cfg && this._cfg.hub && this._cfg.hub.entry_id || null;
      const homes = (this._cfg && this._cfg.homes || []).map((h) => ({
        ...h,
        recipients: h.recipients || (h.entry_id === current ? this._hubOpt("recipients") || {} : {})
      }));
      if (homes.length < 2) return "";
      const targets = [...new Set(homes.flatMap((h) => Object.keys(h.recipients || {})))].sort();
      if (!targets.length) return "";
      const rows = targets.map((target) => {
        const chips = homes.map((h) => {
          const on = Object.prototype.hasOwnProperty.call(h.recipients || {}, target);
          return `<button class="chip2 ${on ? "" : "off"}" data-recipient-home="${esc(target)}" data-home-id="${esc(h.entry_id)}" title="${esc(h.name)}" ${this._admin ? "" : "disabled"}>${esc(h.name)}</button>`;
        }).join("");
        const count = homes.filter((h) => Object.prototype.hasOwnProperty.call(h.recipients || {}, target)).length;
        const summary = count === homes.length ? t("alle Wohnungen") : count === 0 ? t("keine Wohnung") : t("{n} von {m} Wohnungen", { n: count, m: homes.length });
        return `<div class="row"><div class="l"><span class="lbl">${esc(rkPretty(target))}</span><small>${summary} · ${esc(target)}</small></div><div class="chips">${chips}</div></div>`;
      }).join("");
      return this._grp(
        "notify",
        "Wohnungen je Empfänger",
        "mdi:home-group",
        "air",
        `<div class="hint">${t("Ein Häkchen heißt: Diese Person bekommt die Meldungen dieser Wohnung. Welche Arten (Lüften, Frost, Bericht …) sie bekommt, steht in den Benachrichtigungen der jeweiligen Wohnung – hier oben für die aktuelle Wohnung.")}</div>${rows}`
      );
    },
    _groupNotify(ctx) {
      const { H } = ctx;
      const notiRows = [
        this._row(
          "Lüfthinweise von",
          `<span class="v">${this._timeField("vent_from", this._hubOpt("vent_from") || "08:00:00")} – ${this._timeField("vent_to", this._hubOpt("vent_to") || "21:00:00")}</span>`,
          t("Bitte lüften, Fenster schließen und Luft ausgetauscht nur in dieser Zeit – nachts bleibt es still, Raum kühlt aus, Frost und Gerätefehler melden sich weiter")
        ),
        this._row("Nur an anwesende Personen", this._optToggle(H, "notify_present_only", this._hubOpt("notify_present_only") ?? true), t("Lüft-Hinweise nur an Handys von Personen, die laut Ortung zu Hause sind – dringende Meldungen (Fenster offen bei Abwesenheit, Frost, Ausfall) gehen weiter an alle")),
        this._row(
          "Sturm- und Regenwarnung",
          this._optToggle(H, "storm_warning", this._hubOpt("storm_warning") ?? true),
          t("warnt, wenn Sturm oder Starkregen angekündigt ist und ein Fenster offen steht – kommt auch in der Ruhezeit")
        ),
        this._more("noti-more", "Weitere Einstellungen", [
          this._row(
            "… Böen ab",
            this._num(H, "storm_gust_kmh", this._hubOpt("storm_gust_kmh") ?? 70),
            t("ab dieser Böenstärke gilt es als Sturm")
          ),
          this._row(
            "… Regen ab",
            this._num(H, "storm_rain_mm", this._hubOpt("storm_rain_mm") ?? 8),
            t("ab dieser Regenmenge gilt es als Starkregen")
          ),
          this._row("Erinnern alle", this._num(H, "repeat_minutes", this._hubOpt("repeat_minutes")), "solange das Problem besteht"),
          this._row("Fehler auch in der HA-Glocke", this._optToggle(H, "notify_on_failure", !!this._hubOpt("notify_on_failure"))),
          this._row("SMTP-Bericht", this._select("hub", "smtp_notify", this._cfg.choices.smtp_entities || (this._cfg.choices.notify || []).map((n) => ({ id: n, name: rkPretty(n) })), this._hubOpt("smtp_notify") || "", "– HA-SMTP wählen –"), t("versendet den PDF-Bericht über Home Assistants SMTP-Integration statt über den eigenen Mail-Client"))
        ].join(""), "hub", ["storm_gust_kmh", "storm_rain_mm", "repeat_minutes", "notify_on_failure", "smtp_notify"])
      ].join("");
      return this._grp("notify", "Benachrichtigungen allgemein", "mdi:bell-cog-outline", "warn", notiRows);
    }
  };

  // src/cards/settings/sections/system.js
  var SystemSectionMethods = {
    _groupHealth(ctx) {
      const { st } = ctx;
      const issues = st.issues || [];
      const bad = issues.filter((i) => i.severity !== "info").length;
      const healthTone = issues.some((i) => i.severity === "alert") ? "cold" : bad ? "warn" : "ok";
      const healthExtra = `<span class="chip" style="--tone:${toneVar(healthTone)}">${bad ? t("{n} offen", { n: bad }) : "ok"}</span>`;
      return this._grp("health", "Gesundheit der Heizung", "mdi:heart-pulse", healthTone, rkIssueList(issues, true, this._config.strip_prefix) + `<div class="hint">${t("Prüft alle 10 Minuten: Batterien, Raum wird trotz offenem Ventil nicht warm, Fühler hängt, Funkaussetzer, Fensterkontakt still. Meldungen gehen an alle mit „🩺 Gesundheit“.")}</div>`, "span", healthExtra);
    },
    _groupLayout() {
      return this._layoutGroup();
    },
    _groupAdvanced() {
      const c = this._cfg || {};
      const h = this._hass || {};
      const cfg = h.config || {};
      const rows = [
        this._row("Integration", this._v(esc(c.version || "–"), false), ""),
        this._row("Home Assistant", this._v(esc(cfg.version || "–"), false), ""),
        this._row("Python", this._v(esc(c.python || cfg.python_version || "–"), false), ""),
        this._row("Zeitzone", this._v(esc(cfg.time_zone || "–"), false), ""),
        this._row("Entitäten", this._v(String(Object.keys(h.states || {}).length), false), t("alle Entitäten in Home Assistant")),
        this._row("Räume", this._v(String((this._rooms || []).length), false), t("Raumklima-Räume")),
        this._row("Offene Hinweise", this._v(String((c.hub && c.hub.state && c.hub.state.issues || []).length), false), t("Gesundheit der Heizung")),
        this._row("Karte", this._v(RK_VERSION, false), t("Version der Karte im Browser")),
        this._row("Datenquelle", this._v("WebSocket", false), t("Live-Verbindung zur Integration")),
        this._row("Debug-Protokoll", this._optToggle("hub", "debug_log", this._hubOpt("debug_log") ?? true), t("DEBUG-Zeilen für die Diagnose mitschreiben; auf eMMC kann das Log groß werden")),
        this._row("Werkzeuge", `<div class="chips"><button class="btn" data-selftest style="--c:var(--rk-ok)"><ha-icon icon="mdi:clipboard-check-outline"></ha-icon>${t("Selbsttest")}</button><button class="btn" data-diag style="--c:var(--rk-eco)"><ha-icon icon="mdi:file-download-outline"></ha-icon>${t("Diagnose")}</button><button class="btn" data-bug style="--c:var(--rk-warn)"><ha-icon icon="mdi:bug-outline"></ha-icon>${t("Fehler melden")}</button></div>`, t("Selbsttest, Diagnose-Datei oder Fehlerbericht öffnen"))
      ];
      return this._grp("advanced", "System & Diagnose", "mdi:cog-outline", "off", rows.join(""), "span");
    }
  };

  // src/cards/settings/room/overview.js
  var RoomOverviewMethods = {
    _roomOverviewGroup(r) {
      const a = r.attrs || {};
      const s = a.settings || {};
      if (a.monitor) return "";
      const id = s.entry_id;
      const target = a.effective_target != null ? a.effective_target : a.temperature;
      const ranges = (this._roomOpt(r, "schedules") ?? s.schedules ?? []).length;
      const sources = (this._roomOpt(r, "heat_sources") ?? s.heat_sources ?? []).length;
      const windows = a.window_entities || [];
      const open = windows.filter((w) => rkWindowOpen(this._hass, w)).length;
      const changed = (s.changed || []).length;
      const plan = a.plan_reason && a.plan_reason !== "normal" ? planText(a, false) : "";
      const go = (tab, label, icon) => `<button class="btn small" data-roomtab="${tab}" style="--c:var(--rk-eco)"><ha-icon icon="${icon}"></ha-icon>${t(label)}</button>`;
      const quick = [
        [120, "2 Stunden", "2h"],
        [240, "4 Stunden", "4h"],
        [480, "8 Stunden", "8h"],
        [240, "Party", "party"],
        [0, "Pause", "off"]
      ];
      const balance = [
        s.valve_position != null ? `${t("Ventil")} ${fmt(s.valve_position, 0)} %` : "",
        s.heatup && s.heatup.rate != null ? `${t("Aufheizrate")} ${fmt(s.heatup.rate, 1)} K/h` : "",
        s.heatup && s.heatup.minutes_2k != null ? `${t("Aufheizen +2 K")} ${s.heatup.minutes_2k} min` : "",
        s.frost_temperature != null ? `${t("Frostschutz")} ${fmt(s.frost_temperature)} °C` : "",
        s.outdoor_temperature != null ? `${t("Draußen")} ${fmt(s.outdoor_temperature)} °C` : ""
      ].filter(Boolean).join(" · ") || t("lernt noch");
      const rows = [
        plan ? `<div class="status"><span class="chip" style="--tone:var(--rk-eco)"><ha-icon icon="mdi:information-outline"></ha-icon>${plan}</span></div>` : "",
        this._row(
          t("Jetzt"),
          this._v([
            a.current_temperature != null ? `${fmt(a.current_temperature)} °C` : "",
            a.current_humidity != null ? t("{h} % Feuchte", { h: fmt(a.current_humidity, 0) }) : ""
          ].filter(Boolean).join(" · ") || "–"),
          t("gemessen im Raum"),
          this._srcBadge(r, "temperature_sensor")
        ),
        this._row(
          t("Ziel"),
          this._v(target != null ? `${fmt(target)} °C` : "–"),
          t("was die Automatik gerade anstrebt"),
          this._srcBadge(r, "comfort_temperature")
        ),
        this._row(t("Wärmebilanz"), this._v(balance), t("schnelle Einordnung – keine neue Regel")),
        this._row(t("Zeitfenster"), this._v(ranges ? t("{n} angelegt", { n: ranges }) : t("keine"), !ranges), "", this._srcBadge(r, "schedules")),
        this._row(t("Heizquellen"), this._v(sources ? t("{n} Quellen", { n: sources }) : t("keine"), !sources), "", this._srcBadge(r, "heat_sources")),
        windows.length ? this._row(t("Fenster"), this._v(open ? t("{n} offen", { n: open }) : t("alle zu"), !open), "", this._srcBadge(r, "windows")) : "",
        changed ? this._row(t("Abweichungen"), this._v(t("{n} Einstellungen vom Standard abweichend", { n: changed })), t("unter „Regelung“ und den anderen Unterseiten änderbar")) : "",
        this._row(
          t("Schnell-Override"),
          `<div class="chips">${quick.map(([min, label, key]) => `<button class="chip2 ${a.boost_open && key === "party" ? "on" : ""}" data-roomboost="${key}" data-entry="${id}" data-min="${min}" style="--c:var(--rk-heat)" ${this._admin ? "" : "disabled"}><i></i>${t(label)}</button>`).join("")}</div>`,
          a.boost_open ? t("läuft ohne Zeitlimit") : a.boost_until ? t("aktiv bis {t}", { t: new Date(a.boost_until).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }) : t("wärmt kurzzeitig über den Zeitplan hinaus")
        ),
        (() => {
          const sw = a.room_switches || [];
          const swOn = sw.filter((x) => x.on);
          const swTxt = sw.length ? swOn.length ? t("belegt – „{n}“ ist an", { n: swOn.map((x) => x.name).join("“, „") }) : t("nicht belegt – „{n}“ ist aus, Raum wird abgesenkt", { n: sw.map((x) => x.name).join("“, „") }) : "";
          const melder = a.occupied === true ? t("belegt") : a.occupied === false ? a.room_eco ? t("leer – abgesenkt") : t("leer") : "";
          const text = melder && swTxt ? `${melder} · ${swTxt}` : melder || swTxt || t("keine Melder eingetragen");
          const busy = a.occupied === true || swOn.length > 0;
          return this._row(t("Präsenzstatus"), this._v(esc(text), !busy), t("aus Meldern, Lampen und den Schaltern unter „Gilt für Personen“"));
        })(),
        this._row(
          t("Schnellzugriff"),
          // #101: alle Unterseiten des Raums, nicht nur vier
          `<div class="chips">${ROOM_TABS.filter((x) => x.id !== "overview").map((x) => go(x.id, x.label, x.icon)).join("")}</div>`
        )
      ];
      return this._grp("room", "Übersicht", "mdi:view-dashboard-outline", "air", rows.filter(Boolean).join(""), "span");
    }
  };

  // src/cards/settings/sheet.js
  var SheetMethods = {
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
    },
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
    },
    // ---------------------------------------------------------------- Dialog
    _openSheet(sheet) {
      this._trace("sheet:open", { title: sheet && sheet.title, download: Boolean(sheet && sheet.download) });
      this._sheet = sheet;
      this._render();
    },
    _closeSheet() {
      this._sheet = null;
      this._sig = null;
      this._render();
    },
    _sheetStatus(text) {
      if (!this._sheet) return;
      this._sheet.status = text;
      const el = this.shadowRoot && this.shadowRoot.querySelector("[data-sheet-status]");
      if (el) {
        el.textContent = text;
        el.style.display = text ? "block" : "none";
      }
    },
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
    },
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
    },
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
    },
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
    },
    async _exportLink(kind) {
      try {
        return await this._hass.callWS({ type: "raumklima/export/link", kind, ...this._homeMsg() });
      } catch (e) {
        return {};
      }
    },
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
    },
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
    },
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
  };

  // src/cards/settings/general.js
  var GeneralMethods = {
    // Raumkacheln – gemeinsam für „Alle Räume“ und die Räume-Liste (Phase 1).
    _roomTiles(q = "") {
      const issues = this._cfg && this._cfg.hub && this._cfg.hub.state && this._cfg.hub.state.issues || [];
      const needle = String(q || "").toLowerCase().trim();
      return this._orderedRooms().filter(
        (r) => !needle || String(r.name || "").toLowerCase().includes(needle) || String((r.attrs.settings || {}).name || "").toLowerCase().includes(needle)
      ).map((r) => {
        const s = r.attrs.settings || {};
        const notif = (this._st(r.sib.notifications) || {}).state === "on";
        const wl = (this._st(r.sib.window_logic) || {}).state === "on";
        const roomIssues = issues.filter((i) => i.entry_id === s.entry_id && i.severity !== "info");
        const changed = (s.changed || []).length;
        const plan = r.attrs.plan_reason && r.attrs.plan_reason !== "normal" ? planText(r.attrs, false, true) : "";
        const flags = [
          roomIssues.length ? `<ha-icon icon="mdi:alert-circle" style="color:var(--rk-warn)" title="${t("{n} Warnungen", { n: roomIssues.length })}"></ha-icon>` : "",
          wl ? `<ha-icon icon="mdi:window-open-variant" title="${t("Fensterlogik an")}"></ha-icon>` : "",
          notif ? `<ha-icon icon="mdi:bell-outline" title="${t("Hinweise an")}"></ha-icon>` : "",
          r.attrs.humidity_limit != null ? `<ha-icon icon="mdi:water-percent" title="${fmt(r.attrs.humidity_limit, 0)} %"></ha-icon>` : "",
          changed ? `<span class="rchg" title="${t("{n} Einstellungen vom Standard abweichend", { n: changed })}">${changed}</span>` : ""
        ].join("");
        return `<button class="rtile" data-tab="${r.id}" style="--c:${r.color}">
        <span class="rtop"><span class="rname">${esc(r.name)}</span><span class="rtyp">${RK_ROOM_TYPES[s.room_type] || s.room_type || "–"}</span></span>
        <span class="rbig">${fmt(r.attrs.comfort_temperature)}<i>°</i></span>
        ${plan ? `<span class="rsub">${plan}</span>` : ""}
        <span class="rsub">${t("Absenkung")} ${fmt(s.setback_short)} / ${fmt(s.setback_long)} °C · ${t("Frost")} ${fmt(s.frost_temperature ?? 5)} °C</span>
        <span class="rsub">${t("Lüften ab {v} °C", { v: fmt(r.attrs.min_temp) })}</span>
        <span class="rflags">${flags}</span></button>`;
      }).join("");
    },
    // ---------------------------------------------------------------- Allgemein
    _generalCtx() {
      const ch = this._cfg.choices || {};
      const st = this._cfg.hub.state || {};
      return {
        ch,
        st,
        H: "hub",
        hubIds: rkHub(this._hass),
        pres: PRESENCE[st.stage] || PRESENCE.home,
        seas: SEASON[st.decision] || SEASON.heating,
        residents: this._hubOpt("residents") || [],
        persons: st.persons || {}
      };
    },
    _timeField(key, val) {
      const hm = String(val || "").slice(0, 5);
      return `<button class="timebtn" data-timeopen="${key}" data-val="${hm}" ${this._admin ? "" : "disabled"}>${hm || "–:–"}</button>`;
    },
    _sectionBody(id, ctx) {
      switch (id) {
        case "rooms":
          return this._roomList();
        case "presence":
          return `${this._groupPresence(ctx)}${this._groupNight(ctx)}`;
        case "energy":
          return `${this._groupEnergy()}${this._groupWeather()}${this._groupHeating(ctx)}${this._groupReports(ctx)}`;
        case "notify":
          return `${this._groupRecipients(ctx)}${this._groupNotify(ctx)}`;
        case "system":
          return `${this._groupHealth(ctx)}${this._groupLayout()}${this._groupAdvanced()}`;
        default:
          return `${this._groupHomeWelcome(ctx)}${this._groupHomeApartment(ctx)}${this._groupLearn(ctx)}`;
      }
    },
    _general() {
      if (this._err) return `<div class="hint">${t("Einstellungen konnten nicht geladen werden: {e}", { e: esc(this._err) })}</div>`;
      if (!this._cfg) return `<div class="hint">${t("Lade Einstellungen …")}</div>`;
      if (!this._cfg.hub) return `<div class="hint">${t("„Raumklima Allgemein“ wird gerade eingerichtet – bitte die Seite gleich neu laden.")}</div>`;
      const ctx = this._generalCtx();
      if (this._nav2) {
        const sec = SETTINGS_SECTIONS.find((x) => x.id === this._section) || SETTINGS_SECTIONS[0];
        return `<div class="groups">${this._sectionBody(sec.id, ctx)}</div>`;
      }
      return `<div class="groups">${[
        this._groupHomeWelcome(ctx),
        this._groupHealth(ctx),
        this._groupPresence(ctx),
        this._groupHeating(ctx),
        this._groupRecipients(ctx),
        this._groupNotify(ctx),
        this._groupNight(ctx),
        this._groupReports(ctx),
        this._groupHomeApartment(ctx),
        this._groupLearn(ctx),
        this._groupLayout()
      ].join("")}</div>`;
    },
    _roomSearchBlock(q) {
      const needle = String(q || "").toLowerCase().trim();
      if (!needle) return "";
      const hit = ROOM_SEARCH.find((x) => x.terms.some((term) => needle.includes(term) || term.includes(needle)));
      if (!hit) return "";
      const rooms = this._orderedRooms().filter((r) => !r.attrs.monitor || hit.tab !== "sources");
      if (!rooms.length) return "";
      return `<div class="grp roomhits" data-g="search-rooms"><div class="gh"><div class="ic"><ha-icon icon="mdi:door-open"></ha-icon></div><b>${t("Räume")}</b><span class="chip" style="--tone:var(--rk-air)">${t(hit.label)}</span></div><div class="rws"><div class="roomgrid">${rooms.map((r) => `<button class="rtile" data-goto="roomtab:${r.id}:${hit.tab}" style="--c:${r.color}"><span class="rtop"><span class="rname">${esc(r.name)}</span><span class="rtyp">${t(hit.label)}</span></span><span class="rsub">${t("öffnen")}</span></button>`).join("")}</div></div></div>`;
    },
    _tabLabel(tab) {
      const found = ROOM_TABS.find((x) => x.id === tab);
      return found ? t(found.label) : tab;
    },
    // Treffer in den Einstellungen anderer Räume – als „Auch in“-Leiste.
    // Bewusst ohne DOM-Zwang: fehlt querySelectorAll (Tests), bleibt die Liste leer.
    _roomSettingHits(q) {
      const needle = String(q || "").toLowerCase().trim();
      if (!needle || typeof document === "undefined") return [];
      let box;
      try {
        box = document.createElement("div");
      } catch (e) {
        return [];
      }
      if (!box || typeof box.querySelectorAll !== "function") return [];
      const hits = [];
      for (const room of this._orderedRooms()) {
        if (room.id === this._tab) continue;
        box.innerHTML = this._room(room);
        const tabs = [...new Set([...box.querySelectorAll(".grp[data-room]")].filter((el) => String(el.textContent || "").toLowerCase().includes(needle)).map((el) => el.dataset.room || ROOM_TAB_DEFAULT))];
        for (const tab of tabs) hits.push({ room, tab });
      }
      return hits;
    },
    // Phase 5: globale Suche. Alle Bereichsgruppen werden einmal gezeichnet; _filter()
    // blendet die Treffer ein. Der aktuelle Raum bleibt dabei sichtbar, damit auch
    // Raumeinstellungen gefunden werden.
    _searchBody(q) {
      const ctx = this._generalCtx();
      const groups = SETTINGS_SECTIONS.filter((x) => x.id !== "rooms").map((x) => this._sectionBody(x.id, ctx)).join("");
      const room = (this._rooms || []).find((r) => r.id === this._tab);
      const roomGroups = room ? this._room(room) : "";
      const nameHits = this._roomTiles(q);
      const roomBlock = nameHits ? `<div class="grp roomhits" data-g="search-rooms"><div class="gh"><div class="ic"><ha-icon icon="mdi:door-open"></ha-icon></div><b>${t("Räume")}</b></div><div class="rws"><div class="roomgrid">${nameHits}</div></div></div>` : this._roomSearchBlock(q);
      const settingHits = this._roomSettingHits(q);
      const settingBlock = settingHits.length ? `<div class="grp roomhits" data-g="search-rooms"><div class="gh"><div class="ic"><ha-icon icon="mdi:map-search-outline"></ha-icon></div><b>${t("Auch in")}</b><span class="chip" style="--tone:var(--rk-air)">${settingHits.length}</span></div><div class="rws"><div class="roomgrid">${settingHits.map((h) => `<button class="rtile" data-goto="roomtab:${h.room.id}:${h.tab}" style="--c:${h.room.color}"><span class="rtop"><span class="rname">${esc(h.room.name)}</span><span class="rtyp">${esc(this._tabLabel(h.tab))}</span></span><span class="rsub">${t("öffnen")}</span></button>`).join("")}</div></div></div>` : "";
      return `<div class="groups searching">${roomGroups}${groups}${roomBlock}${settingBlock}</div>`;
    },
    _mailSetup(mailServices = []) {
      const o = (k) => this._mailForm && this._mailForm[k] !== void 0 ? this._mailForm[k] : this._hubOpt(k) ?? "";
      const cur = String(this._hubOpt("report_email") || "");
      const viaService = cur.startsWith("notify.");
      const active = cur === "raumklima";
      const ok = active && !!(this._hubOpt("mail_server") && this._hubOpt("mail_to"));
      const open = this._mailOpen ?? (active && !ok);
      const dis = this._admin ? "" : "disabled";
      const sec = o("mail_security") || "starttls";
      const auth = o("mail_auth") === "" ? true : o("mail_auth") !== false;
      const provs = Object.entries(RK_MAIL_PROVIDERS).map(([k, p]) => `<option value="${k}" ${p[0] === o("mail_server") ? "selected" : ""}>${esc(p[3])}</option>`).join("");
      const field = (key, label, type = "text", ph = "", hint = "") => `<label class="mf"><span>${t(label)}${hint ? `<small>${t(hint)}</small>` : ""}</span>
      <input class="inp" data-mail="${key}" type="${type}" value="${type === "password" ? "" : esc(String(o(key)))}" placeholder="${esc(ph)}" autocomplete="${type === "password" ? "new-password" : "off"}" ${dis}></label>`;
      return `<details class="mailbox" ${open ? "open" : ""} data-mailbox>
      <summary><ha-icon icon="mdi:email-outline"></ha-icon>${t("E-Mail einrichten")} ${viaService ? `<span class="ok">● ${t("über {s}", { s: esc(rkPretty(cur)) })}</span>` : ok ? `<span class="ok">● ${t("eingerichtet")}</span>` : `<span class="no">○ ${t("noch nicht eingerichtet")} – ${t("hier antippen")}</span>`}</summary>
      <div class="mailform">
        <label class="mf"><span>${t("Anbieter")}<small>${t("füllt Server, Port und Verschlüsselung aus")}</small></span>
          <div class="segs mailprov">${Object.entries(RK_MAIL_PROVIDERS).map(([k, p]) => `<button class="${p[0] === o("mail_server") ? "on" : ""}" data-mailprov="${k}" ${dis}>${esc(p[3])}</button>`).join("")}<button data-mailprov="other" ${dis}>${t("Anderer Anbieter")}</button></div></label>
        <label class="mf"><span>${t("Anmeldung am Server")}<small>${t("„ohne“ nur für Mailserver im eigenen Netz, die ohne Anmeldung annehmen (z. B. Spamfilter auf Port 25)")}</small></span><div class="segs">${[[true, t("mit Benutzer/Passwort")], [false, t("ohne")]].map(([v, l]) => `<button class="${v === auth ? "on" : ""}" data-mailauth="${v}" ${dis}>${l}</button>`).join("")}</div></label>
        ${auth ? field("mail_user", "Benutzer", "email", "name@gmx.de", "meist deine E-Mail-Adresse") : ""}
        ${auth ? field("mail_password", "Passwort", "password", this._hubOpt("mail_password_set") ? t("gespeichert – leer lassen zum Behalten") : "", "bei Gmail, iCloud, Outlook: App-Passwort") : ""}
        ${auth ? "" : field("mail_from", "Absender", "email", "raumklima@example.de", "nötig ohne Anmeldung – viele Server lehnen Mails ohne Absender ab")}
        ${field("mail_to", "Empfänger", "text", "ich@example.de, partner@example.de", "mehrere mit Komma")}
        <details class="adv"><summary>${t("Server-Einstellungen")}</summary>
          ${field("mail_server", "Server", "text", "smtp.example.de")}
          ${field("mail_port", "Port", "number", "587")}
          <label class="mf"><span>${t("Verschlüsselung")}</span><div class="segs">${["starttls", "ssl", "none"].map((v) => `<button class="${v === sec ? "on" : ""}" data-mailsec="${v}" ${dis}>${{ starttls: "STARTTLS", ssl: "SSL/TLS", none: t("keine") }[v]}</button>`).join("")}</div></label>
          ${auth ? field("mail_from", "Absender", "email", "", "leer = Benutzer") : ""}
        </details>
        <div class="mailact"><button class="btn" data-mailcheck ${dis}><ha-icon icon="mdi:shield-check-outline"></ha-icon>${t("Zugang prüfen")}</button><button class="btn primary" data-mailsave ${dis}><ha-icon icon="mdi:email-check-outline"></ha-icon>${t("Speichern & Test-Mail senden")}</button></div>
        ${this._mailSteps ? `<div class="msteps">${this._mailSteps.map((s) => `<div class="mstep ${s.ok ? "ok" : "bad"}"><b>${s.ok ? "✓" : "✕"}</b><span><b>${esc(t({ connect: "Server erreichbar", tls: "Verschlüsselung", login: "Anmeldung", recipients: "Empfänger" }[s.step] || s.step))}</b> – ${esc(s.msg)}</span></div>`).join("")}</div>` : ""}
        ${this._mailMsg ? `<div class="hint ${this._mailMsg[0]}">${esc(this._mailMsg[1])}</div>` : ""}
        ${mailServices.length || viaService ? `<label class="mf"><span>${t("Oder vorhandenen Mail-Dienst nutzen")}<small>${t("statt der Zugangsdaten oben")}</small></span>
          <select class="sel" data-sel="hub" data-key="report_email" ${dis}><option value="${active ? "raumklima" : ""}">${t("– nein, Zugangsdaten oben –")}</option>${[.../* @__PURE__ */ new Set([...mailServices, ...viaService ? [cur] : []])].map((n) => `<option value="${esc(n)}" ${n === cur ? "selected" : ""}>${esc(rkPretty(n))}</option>`).join("")}</select></label>` : ""}
        <div class="hint">${t("Das Passwort wird nur in Home Assistant gespeichert und nie angezeigt. Tipp: Für Gmail unter myaccount.google.com → Sicherheit → App-Passwörter ein eigenes Passwort für Raumklima erstellen.")}</div>
      </div></details>`;
    }
  };

  // src/cards/settings/layout.js
  var LayoutMethods = {
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
    },
    _layoutSave() {
      const home = this._homeId();
      const L = this._layout || { order: [], hidden: [], size: {}, color: {} };
      rkLayoutRemember(L, home);
      this._hass.callWS({ type: "raumklima/layout/save", home, layout: L }).then(() => {
        rkLayoutChanged(home);
        this._flash(t("Gespeichert"));
      }).catch((e) => this._flash(t("Fehler: {e}", { e: e.message || e })));
    },
    _orderedRooms() {
      return rkRoomsOrdered(this._rooms || [], this._layout);
    },
    _layoutList() {
      const L = this._layout || { order: [], hidden: [], size: {}, color: {} };
      return rkLayoutApply(this._rooms || [], L);
    },
    _layoutGroup() {
      if (!this._layout) {
        return this._grp("layout", "Darstellung", "mdi:view-dashboard-outline", "air", this._row("Reihenfolge", this._v("lädt …", true)));
      }
      const L = this._layout;
      const list = this._layoutList();
      const rows = list.map((r, i) => {
        const size = (L.size || {})[r.id] || "big";
        const col = (L.color || {})[r.id] || "";
        const arrow = (dir, glyph, on) => `<button class="mini" data-lmove="${r.id}" data-dir="${dir}" ${on ? "" : "disabled"} aria-label="${dir < 0 ? t("nach oben") : t("nach unten")}">${glyph}</button>`;
        const sizes = [["big", t("große Karte")], ["medium", t("mittlere Karte")], ["tile", t("Kachel")], ["off", t("aus")]].map(([k, lab]) => `<button class="chip2 ${size === k ? "" : "off"}" data-lsize="${r.id}" data-v="${k}">${lab}</button>`).join("");
        const dots = RK_LAYOUT_COLORS.map(
          (c) => `<button class="dotbtn ${col === c ? "on" : ""}" style="--c:${c}" data-lcolor="${r.id}" data-v="${c}" aria-label="${c}" title="${c}"></button>`
        ).join("");
        return `<div class="lrow">
        <div class="ltop"><span class="lname">${arrow(-1, "▲", i > 0)}${arrow(1, "▼", i < list.length - 1)}<b>${esc(r.name)}</b></span><div class="chips">${sizes}</div></div>
        <div class="lbot"><span class="llab">${t("Farbe")}</span><div class="dots">${dots}</div></div>
      </div>`;
      }).join("");
      const foot = `<div class="hint">${t("Reihenfolge gilt im generierten Dashboard und in der Übersicht; „große Karte“ zeigt die volle Raumseite, „mittlere Karte“ die kompakte Raumkarte, „Kachel“ nur die Übersicht, „aus“ versteckt den Raum ganz. Farbe färbt Rand und Akzente der Karte.")}</div>
      <div class="addrow"><button class="btn" data-lsave style="--c:var(--rk-heat)"><ha-icon icon="mdi:content-save-outline"></ha-icon>${t("Speichern")}</button></div>`;
      const look = this._row(t("Dunkler Look"), this._segs("hub", "look_dark", { auto: t("Automatisch"), on: t("Immer dunkel"), off: t("Immer hell") }, this._hubOpt("look_dark") || "auto"), t("gilt für alle Räume und Karten dieser Wohnung"));
      const floors = this._row(
        t("Neue Übersicht testen (Beta)"),
        `<div class="segs">${[[false, t("aus")], [true, t("nach Stockwerk gruppieren")]].map(([v, l]) => `<button class="${!!L.beta_floors === v ? "on" : ""}" data-lfloors="${v}">${l}</button>`).join("")}</div>`,
        t("ordnet Übersicht und Raumkarten nach den Stockwerken aus Home Assistant (Einstellungen → Bereiche → Stockwerke) – Räume ohne Stockwerk stehen unter „Weitere Räume“. Ausschalten stellt die bisherige Ansicht wieder her.")
      );
      const panel = this._row(
        t("Volle Breite testen (Beta)"),
        `<div class="segs">${[[false, t("aus")], [true, t("volle Breite")]].map(([v, l]) => `<button class="${!!L.beta_panel === v ? "on" : ""}" data-lpanel="${v}">${l}</button>`).join("")}</div>`,
        t("Einstellungen, Bericht, Protokoll und Energie nutzen die ganze Bildschirmbreite – hilft auf Klapp-Handys und Tablets im Hochformat, wo Home Assistant sonst nur eine schmale Spalte zeigt. Gilt im generierten Dashboard nach dem Neuladen der Seite; ausschalten stellt die bisherige Ansicht wieder her.")
      );
      return this._grp("layout", "Darstellung", "mdi:view-dashboard-outline", "air", look + floors + panel + rows + foot);
    }
  };

  // src/cards/settings/schedule.js
  var ScheduleMethods = {
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
    },
    _schedList(id, stored) {
      this._sched = this._sched || {};
      if (!(id in this._sched)) {
        this._sched[id] = (stored || []).map((w) => ({
          days: [...w.days || []],
          start: w.start || "19:00",
          end: w.end || "21:00",
          temperature: Number(w.temperature ?? 22),
          sources: [...w.sources || []]
        }));
      }
      return this._sched[id];
    },
    _schedLen(id) {
      return (this._sched[id] || []).length;
    },
    _schedStart(w) {
      const [h, m] = String(w && w.start || "00:00").split(":").map((x) => parseInt(x, 10) || 0);
      return h * 60 + m;
    },
    _schedEnd(w) {
      const [h, m] = String(w && w.end || "00:00").split(":").map((x) => parseInt(x, 10) || 0);
      return h * 60 + m;
    },
    _pushSched(id) {
      const list = (this._sched[id] || []).map((w) => ({
        days: [...w.days || []].sort((a, b) => a - b),
        start: w.start,
        end: w.end,
        temperature: w.temperature,
        sources: [...w.sources || []].sort()
      }));
      this._setRoom(id, { schedules: list }, 700);
    },
    _schedWin(id, w, i, ro) {
      const days = w.days || [];
      const on = (d) => !days.length || days.includes(d);
      const btn = [0, 1, 2, 3, 4, 5, 6].map((d) => `<button class="d ${on(d) ? "on" : ""}" data-schedday="${id}|${i}|${d}" title="${esc(schedDayName(d))}">${esc(schedDayName(d))}</button>`).join("");
      return `<div class="sched">
      <div class="days">${btn}</div>
      ${this._tmBtn("sched:" + id + "|" + i + "|start", w.start, ro, t("von"))}
      ${this._tmBtn("sched:" + id + "|" + i + "|end", w.end, ro, t("bis"))}
      <span class="v temp">${fmt(w.temperature)} °C</span>
      ${ro ? "" : `<div class="stepper"><button data-schedtemp="${id}|${i}" data-d="-1" aria-label="${t("weniger")}">−</button><button data-schedtemp="${id}|${i}" data-d="1" aria-label="${t("mehr")}">+</button></div>
      <div class="stepper mv"><button data-schedmove="${id}|${i}|-1" title="${t("nach oben")}" aria-label="${t("nach oben")}" ${i === 0 ? "disabled" : ""}>▲</button><button data-schedmove="${id}|${i}|1" title="${t("nach unten")}" aria-label="${t("nach unten")}" ${i === this._schedLen(id) - 1 ? "disabled" : ""}>▼</button></div>
      <button class="del" data-scheddel="${id}|${i}" title="${t("entfernen")}" aria-label="${t("entfernen")}"><ha-icon icon="mdi:close"></ha-icon></button>`}
    </div>`;
    },
    _schedSourcesRow(id, w, i, ro) {
      const room = (this._rooms || []).find((x) => (x.attrs.settings || {}).entry_id === id);
      const sources = room && room.attrs.heat_sources || [];
      if (!sources.length) return "";
      const chosen = w.sources || [];
      const all = chosen.length === 0;
      const chips = sources.map((src) => {
        const on = all || chosen.includes(src.id);
        const off = src.untouched ? " off" : "";
        const dis = ro || src.untouched ? " disabled" : "";
        return `<button class="chip2 ${on ? "" : "off"}${off}" data-schedsrc="${id}|${i}|${esc(src.id)}" title="${esc(src.entity)}"${dis}><i></i>${esc(src.name)}</button>`;
      }).join("");
      return this._row("Quellen", `<div class="chips">${chips}</div>`, all ? t("alle Quellen – antippen schließt eine aus") : t("nur die gewählten Quellen"));
    },
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
        editable ? this._select(scope, "schedule_from", [{ id: "", name: t("eigener Zeitplan") }, ...others], fromId) : this._v(shared ? esc(others.find((o) => o.id === fromId).name) : t("eigener Zeitplan")),
        shared ? t("Die Zeitfenster werden im gewählten Raum gepflegt – Änderungen gelten hier automatisch mit") : t("Zeitfenster einmal pflegen und für mehrere Räume nutzen")
      );
      const fallback = this._roomOpt(r, "schedule_fallback") ?? s.schedule_fallback ?? "wish";
      const rows = [];
      const boostRows = [
        this._row(
          "Wärmer für kurze Zeit (Boost)",
          editable ? this._num(scope, "boost_temperature", boostTemp) : this._v(`${fmt(boostTemp, 1)} K`),
          t("so viel wärmer als die Wunschtemperatur – der Knopf „Wärmer“ am Raum startet ihn")
        ),
        this._row(
          "Dauer des Boosts",
          editable ? this._num(scope, "boost_minutes", boostMin) : this._v(`${boostMin} min`),
          t("danach gilt wieder Zeitplan bzw. Automatik")
        )
      ];
      const helpers = (this._cfg && this._cfg.choices || {}).schedules || [];
      const helper = this._roomOpt(r, "schedule_entity") ?? s.schedule_entity ?? "";
      const helperRow = helpers.length || helper ? this._row(
        "Zeitplan-Helfer",
        editable ? this._select(scope, "schedule_entity", helpers, helper, "– eigene Zeitfenster –") : this._v(helper || t("eigene Zeitfenster")),
        helper ? t("„an“ im Helfer = Zeitfenster aktiv; eine Temperatur im Datenfeld des Blocks wird übernommen – die Zeitfenster oben gelten dann nicht") : t("HA-Zeitplan-Helfer (schedule.*) statt der Zeitfenster hier – z. B. einen je Plan anlegen und per Automation umschalten")
      ) : "";
      const plan = (this._cfg && this._cfg.hub && this._cfg.hub.state || {}).plan || {};
      const planMap = this._roomOpt(r, "schedule_by_plan") ?? s.schedule_by_plan ?? {};
      const planLabel = (o) => o === "on" ? t("an") : o === "off" ? t("aus") : o;
      const planRows = (plan.options || []).map((o) => {
        const cur = planMap[o] || "";
        const opts = [
          ["", t("wie sonst")],
          ["own", t("eigene Zeitfenster")],
          ["always", t("ganztägig Wunschtemperatur")],
          ["never", t("kein Zeitfenster (außerhalb gilt)")],
          ...helpers.map((h) => [h.id, h.name])
        ];
        const sel = editable ? `<select class="sel" data-planmap="${esc(o)}" data-scope="${scope}" data-cur="${esc(JSON.stringify(planMap))}" ${this._admin ? "" : "disabled"}>${opts.map(([v, n]) => `<option value="${esc(v)}" ${v === cur ? "selected" : ""}>${esc(n)}</option>`).join("")}</select>` : this._v((opts.find(([v]) => v === cur) || opts[0])[1]);
        return this._row(t("Plan „{p}“", { p: planLabel(o) }), sel, plan.now === o ? t("gilt gerade") : "");
      }).join("");
      const wish = Number(this._roomOpt(r, "comfort_temperature") ?? s.comfort_temperature ?? 21);
      const outsideVal = {
        short: Number(this._roomOpt(r, "setback_short") ?? s.setback_short),
        long: Number(this._roomOpt(r, "setback_long") ?? s.setback_long),
        frost: Number(this._roomOpt(r, "frost_temperature") ?? s.frost_temperature)
      }[fallback];
      const outside = Number.isFinite(outsideVal) && outsideVal < wish ? outsideVal : wish;
      const colder = list.filter((w) => Number(w.temperature) < outside - 0.05);
      const fbHint = [
        t("im Zeitfenster gilt seine Temperatur, außerhalb {v} °C", { v: fmt(outside, 1) }),
        fallback === "wish" ? t("(Wunschtemperatur)") : "",
        t("· bist du als abwesend gemeldet, gilt die Abwesenheits-Absenkung")
      ].filter(Boolean).join(" ");
      const fbWarn = colder.length ? `<div class="warnline"><ha-icon icon="mdi:alert-outline"></ha-icon>${esc(t("Außerhalb der Fenster wäre es wärmer ({v} °C) als in {n} Fenster(n) – stelle „Außerhalb“ auf „Kurz weg“ oder „Länger weg“", { v: fmt(outside, 1), n: colder.length }))}</div>` : "";
      const fallbackRow = this._row(
        "Außerhalb der Zeitfenster",
        (editable ? this._segs(scope, "schedule_fallback", RK_SCHED_FALLBACK, fallback) : this._v(RK_SCHED_FALLBACK[fallback] || "–")) + fbWarn,
        fbHint
      );
      const moreRows = [
        planRows,
        helperRow,
        shareRow,
        this._row(
          "Zeitplan überschreiben",
          editable ? this._num(scope, "override_minutes", this._roomOpt(r, "override_minutes") ?? s.override_minutes ?? 120) : this._v(`${this._roomOpt(r, "override_minutes") ?? s.override_minutes ?? 120} min`),
          t("so lange gilt deine Handverstellung (HA oder Alexa), danach wieder der Zeitplan – 0 schaltet es aus")
        ),
        this._row(
          "Boost für",
          editable ? this._select(scope, "boost_sources", [
            { id: "selected", name: t("im Zeitplan gewählt") },
            { id: "all", name: t("alle Quellen") },
            { id: "first", name: t("nur die priorisierte") }
          ], this._roomOpt(r, "boost_sources") ?? "selected") : this._v(
            { selected: t("im Zeitplan gewählt"), all: t("alle Quellen"), first: t("nur die priorisierte") }[this._roomOpt(r, "boost_sources") ?? "selected"]
          ),
          t("welche Quellen der Boost ansteuert – die anderen bleiben in diesem Moment aus")
        )
      ];
      const windowRows = [];
      if (!list.length) {
        windowRows.push(this._row("Zeitfenster", this._v("keine – die Automatik regelt wie gewohnt", true), t("z. B. abends 19–21 Uhr wärmer")));
      } else {
        list.forEach((w, i) => {
          windowRows.push(this._row(t("Zeitfenster {n}", { n: i + 1 }), this._schedWin(id, w, i, ro), esc(schedDaysLabel(w.days))));
          windowRows.push(this._schedSourcesRow(id, w, i, ro));
        });
      }
      if (list.length > 3) {
        const opened = !!(this._schedOpen && this._schedOpen.get(id));
        rows.push(`<details class="sched-collapse" data-schedcollapse="${esc(id)}"${opened ? " open" : ""}><summary>${t("Zeitfenster")} (${list.length})</summary>${windowRows.join("")}</details>`);
      } else {
        rows.push(...windowRows);
      }
      if (!ro && list.length && !shared) {
        rows.push(`<div class="row"><div class="l"><span class="lbl"></span></div><div class="addrow"><button class="add" data-schedsort="${id}"><ha-icon icon="mdi:sort-clock-ascending-outline"></ha-icon>${t("nach Uhrzeit sortieren")}</button><span class="hint">${t("Reihenfolge zählt nur, wenn sich Fenster überschneiden – dann gewinnt das untere")}</span></div></div>`);
      }
      if (!ro && !shared) {
        rows.push(`<div class="row"><div class="l"><span class="lbl"></span></div><div><button class="add" data-schedadd="${id}"><ha-icon icon="mdi:plus"></ha-icon>${t("Zeitfenster hinzufügen")}</button></div></div>`);
      }
      rows.push(fallbackRow);
      rows.push(...boostRows);
      rows.push(this._more("sched-more", "Weitere Einstellungen", moreRows.join(""), r, ["schedule_by_plan", "schedule_entity", "schedule_from", "override_minutes", "boost_sources"]));
      return this._grp("heating", "Zeitplan", "mdi:calendar-clock", "eco", rows.join(""), "span");
    },
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
    },
    _pushAir(id) {
      const list = (this._air[id] || []).map((w) => ({ days: [...w.days || []].sort((a, b) => a - b), start: w.start, end: w.end }));
      this._setRoom(id, { airing_windows: list }, 700);
    },
    _airWin(id, w, i, ro) {
      const days = w.days || [];
      const on = (d) => !days.length || days.includes(d);
      const btn = [0, 1, 2, 3, 4, 5, 6].map((d) => `<button class="d ${on(d) ? "on" : ""}" data-airday="${id}|${i}|${d}" title="${esc(schedDayName(d))}">${esc(schedDayName(d))}</button>`).join("");
      return `<div class="sched">
      <div class="days">${btn}</div>
      ${this._tmBtn("air:" + id + "|" + i + "|start", w.start, ro, t("von"))}
      ${this._tmBtn("air:" + id + "|" + i + "|end", w.end, ro, t("bis"))}
      ${ro ? "" : `<button class="del" data-airdel="${id}|${i}" title="${t("entfernen")}" aria-label="${t("entfernen")}"><ha-icon icon="mdi:close"></ha-icon></button>`}
    </div>`;
    },
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
      const rows = [];
      const learnRows = [
        this._row(
          "Gewohntes Lüften erkennen",
          editable ? this._optToggle(scope, "learn_airing", !!learn) : this._v(learn ? t("an") : t("aus")),
          learned ? t("erkannt: {n}× im gleichen Zeitraster (4 Wochen)", { n: learned }) : t("lernt, wann du regelmäßig länger lüftest – dort dann keine Erinnerungen")
        )
      ];
      const moreRows = [
        this._row(
          "Mindestdauer Lüften",
          editable ? this._num(scope, "airing_min_minutes", airMin) : this._v(airMin ? `${airMin} min` : t("automatisch")),
          airMin ? t("so lange bleibt „Lüften läuft“ mindestens stehen, auch wenn die Feuchte schon passt") : t("automatisch: 60 % der empfohlenen Dauer, mindestens 4 Minuten (gerade {v} min)", { v: recMin })
        ),
        this._row(
          "Dauerlüftung ab",
          editable ? this._num(scope, "long_airing_minutes", longMin) : this._v(`${longMin} min`),
          t("danach keine Erinnerungen mehr, bis das Fenster zu ist – 0 schaltet es aus")
        ),
        this._row(
          "Leise Erinnerung danach",
          editable ? this._num(scope, "long_airing_remind", lateMin) : this._v(`${lateMin} min`),
          t("eine einzige, stille Meldung bei sehr langem Lüften – 0 = aus")
        ),
        ...presEff.length ? [this._row(
          "Nur wenn jemand im Raum war",
          editable ? this._optToggle(scope, "airing_occupied_only", this._roomOpt(r, "airing_occupied_only") ?? s.airing_occupied_only ?? true) : this._v(this._roomOpt(r, "airing_occupied_only") ?? s.airing_occupied_only ?? true ? t("an") : t("aus")),
          t("kein „bitte lüften“ in leeren Räumen – nur mit Präsenzmelder möglich")
        )] : []
      ];
      if (!list.length) {
        rows.push(this._row("Lüftfenster", this._v("keine – es wird normal erinnert", true), t("z. B. Training morgens: in dieser Zeit keine Hinweise")));
      } else {
        list.forEach((w, i) => rows.push(this._row(t("Lüftfenster {n}", { n: i + 1 }), this._airWin(id, w, i, ro), esc(schedDaysLabel(w.days)))));
      }
      if (!ro && list.length < 6) {
        rows.push(`<div class="row"><div class="l"><span class="lbl"></span></div><div><button class="add" data-airadd="${id}"><ha-icon icon="mdi:plus"></ha-icon>${t("Zeitfenster hinzufügen")}</button></div></div>`);
      }
      rows.push(...learnRows);
      rows.push(this._more("airing-more", "Weitere Einstellungen", moreRows.join(""), r, ["airing_min_minutes", "long_airing_minutes", "long_airing_remind", "airing_occupied_only"]));
      return this._grp("air", "Lüften ohne Erinnerung", "mdi:weather-windy-variant", "air", rows.join(""), "span");
    },
    // Uhrzeit eines Zeitfensters: Knopf öffnet den Zeitwähler (Viertelstunden, freie Eingabe möglich)
    _tmBtn(key, val, ro, label) {
      const v = String(val || "").slice(0, 5);
      return `<button class="tm timebtn" data-timeopen="${esc(key)}" data-val="${esc(v)}" ${ro ? "disabled" : ""} aria-label="${esc(label)}" title="${esc(label)}">${esc(v || "–:–")}</button>`;
    },
    // Gewählte Uhrzeit in ein Zeitplan- oder Lüftfenster übernehmen ("sched:<raum>|<i>|start").
    _setWinTime(key, v) {
      const [kind, rest] = [key.slice(0, key.indexOf(":")), key.slice(key.indexOf(":") + 1)];
      const [id, i, which] = rest.split("|");
      if (which !== "start" && which !== "end") return false;
      const list = kind === "sched" ? this._schedList(id, this._schedSeed(id) || []) : kind === "air" ? this._airList(id, []) : null;
      const w = list && list[parseInt(i, 10)];
      if (!w) return false;
      w[which] = v;
      if (kind === "sched") this._pushSched(id);
      else this._pushAir(id);
      this._render();
      return true;
    },
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
    },
    _openTime(key, val) {
      const pop = this.shadowRoot.querySelector("[data-tpick]");
      if (!pop) return;
      pop.hidden = false;
      const [hRaw, mRaw] = String(val || "07:00").split(":");
      const h = Math.max(0, Math.min(23, parseInt(hRaw, 10) || 0));
      const m = Math.max(0, Math.min(3, Math.round((parseInt(mRaw, 10) || 0) / 15)));
      const exact = /^\d{1,2}:\d{2}$/.test(String(val || "")) ? `${String(h).padStart(2, "0")}:${String(Math.max(0, Math.min(59, parseInt(mRaw, 10) || 0))).padStart(2, "0")}` : null;
      this._tp = { key, h, m, open: true, text: exact || void 0 };
      pop.querySelector("[data-twh]").scrollTop = h * 40;
      pop.querySelector("[data-twmn]").scrollTop = m * 40;
      pop.querySelector("[data-tin]").value = exact || `${String(h).padStart(2, "0")}:${String(m * 15).padStart(2, "0")}`;
      this._timeMark(pop);
    },
    _timeMark(pop) {
      pop.querySelectorAll("[data-th]").forEach((b) => b.classList.toggle("on", Number(b.dataset.th) === this._tp.h));
      pop.querySelectorAll("[data-tm]").forEach((b) => b.classList.toggle("on", Number(b.dataset.tm) === this._tp.m));
    },
    // Nach einem Neuzeichnen (z. B. Speichern im Hintergrund) den offenen Zeitwähler wieder zeigen
    _reopenTime() {
      const tp = this._tp;
      if (!tp || !tp.open) return;
      const pop = this.shadowRoot.querySelector("[data-tpick]");
      if (!pop) return;
      pop.hidden = false;
      pop.querySelector("[data-twh]").scrollTop = tp.h * 40;
      pop.querySelector("[data-twmn]").scrollTop = tp.m * 40;
      pop.querySelector("[data-tin]").value = tp.text || `${String(tp.h).padStart(2, "0")}:${String(tp.m * 15).padStart(2, "0")}`;
      this._timeMark(pop);
    },
    _timeSync(pop) {
      if (!this._tp) return;
      const h = Math.round(pop.querySelector("[data-twh]").scrollTop / 40);
      const m = Math.round(pop.querySelector("[data-twmn]").scrollTop / 40);
      const nh = Math.max(0, Math.min(23, h)), nm = Math.max(0, Math.min(3, m));
      if (this._tp.text && nh === this._tp.h && nm === this._tp.m) return;
      this._tp.text = void 0;
      this._tp.h = nh;
      this._tp.m = nm;
      this._timeMark(pop);
      pop.querySelector("[data-tin]").value = `${String(this._tp.h).padStart(2, "0")}:${String(this._tp.m * 15).padStart(2, "0")}`;
    }
  };

  // src/cards/settings/room.js
  var RoomMethods = {
    // Gruppen einer Raum-Unterseite zuordnen, ohne die gewachsenen Gruppen-Bausteine
    // doppelt zu pflegen. _filter() blendet anschließend alles außer der aktiven Seite aus.
    _roomSub(tab, html) {
      return String(html || "").replace('<div class="grp ', `<div data-room="${tab}" class="grp `);
    },
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
      const comfort = this._roomOpt(r, "comfort_temperature") ?? a.comfort_temperature;
      const roomType = this._roomOpt(r, "room_type") ?? s.room_type;
      const sbShort = this._roomOpt(r, "setback_short") ?? s.setback_short;
      const sbLong = this._roomOpt(r, "setback_long") ?? s.setback_long;
      const frost = this._roomOpt(r, "frost_temperature") ?? s.frost_temperature ?? 5;
      const co2 = this._roomOpt(r, "co2_limit") ?? 1e3;
      const notifyCap = this._roomOpt(r, "notify_cap") ?? 3;
      const trvInterval = this._roomOpt(r, "trv_interval") ?? s.trv_interval ?? 0;
      const calHelp = {
        offset: t("Raumklima schreibt die Abweichung zwischen Raumfühler und Thermostat als Korrekturwert ins Gerät – nur bei Geräten mit Kalibrier-Entität. Regelt am genauesten, der Sollwert bleibt unverändert"),
        target: t("Raumklima verschiebt den Sollwert am Thermostat um die Abweichung zwischen Raumfühler und Thermostat-Fühler – für Geräte ohne Korrekturwert (z. B. FRITZ!DECT). Regelt genau, das Ventil bewegt sich dafür öfter. Einen Korrekturwert am Gerät selbst auf 0 lassen"),
        none: t("Raumklima schreibt den Sollwert 1:1 – richtig ohne Raumfühler oder wenn Thermostat und Raumfühler sauber übereinstimmen. Mit Raumfühler am Heizkörper-Thermostat meist zu kalt, weil das Thermostat am warmen Heizkörper misst"),
        hysteresis: t("Raumklima öffnet das Ventil ganz unter Ziel − ½ Hysterese und schließt es ganz über Ziel + ½ – nach dem Raumfühler, nicht nach dem Thermostat. Wählen, wenn ein Thermostat trotz Ausgleich zu früh schließt oder dauernd nachregelt: weniger Ventilbewegungen und Batterie, dafür etwas mehr Schwankung. Braucht einen Raumfühler")
      };
      const wOpen = this._roomOpt(r, "window_open_delay") ?? s.window_open_delay;
      const wClose = this._roomOpt(r, "window_close_delay") ?? s.window_close_delay;
      const nightMode = this._roomOpt(r, "night_airing") ?? s.night_airing ?? "auto";
      const cooling = this._roomOpt(r, "cooling") ?? s.cooling ?? false;
      const coolSet = this._roomOpt(r, "cool_setpoint") ?? s.cool_setpoint ?? 26;
      const acCount = (a.ac_sources || []).length;
      const moldMode = this._roomOpt(r, "mold_mode") ?? s.mold_mode ?? "strict";
      const deh = this._roomOpt(r, "dehumidifier_entity") ?? s.dehumidifier_entity ?? "";
      const dehChoices = this._cfg && this._cfg.choices && this._cfg.choices.dehumidifier || [];
      const ventLimit = a.humidity_limit ?? (sib.humidity_limit ? this._st(sib.humidity_limit)?.state : null);
      const dehOn = this._roomOpt(r, "dehumidifier_on") ?? s.dehumidifier_on ?? ventLimit ?? null;
      const dehOff = this._roomOpt(r, "dehumidifier_off") ?? s.dehumidifier_off ?? (dehOn != null ? Math.max(0, Number(dehOn) - 5) : null);
      const dehDelay = this._roomOpt(r, "dehumidifier_delay") ?? s.dehumidifier_delay ?? 0;
      const dehPower = this._roomOpt(r, "dehumidifier_power") ?? s.dehumidifier_power ?? "";
      const dehEnergy = this._roomOpt(r, "dehumidifier_energy") ?? s.dehumidifier_energy ?? "";
      const dehPowerChoices = this._cfg && this._cfg.choices && this._cfg.choices.dehumidifier_power || [];
      const dehEnergyChoices = this._cfg && this._cfg.choices && this._cfg.choices.dehumidifier_energy || [];
      const dehPrice = this._cfg && this._cfg.hub && this._cfg.hub.options ? this._cfg.hub.options.electric_price : null;
      const dehCost = dehPrice != null && a.dehumidifier_energy != null ? a.dehumidifier_energy * Number(dehPrice) : null;
      const virtMode = this._roomOpt(r, "virtual_window") ?? s.virtual_window ?? "auto";
      const editable = this._admin && cfgRoom;
      const push = Object.keys(this._cfg && this._cfg.hub && this._cfg.hub.options.recipients || {});
      const plan = a.plan_reason && a.plan_reason !== "normal" ? planText(a, false) : null;
      const rIssues = (this._cfg && this._cfg.hub && this._cfg.hub.state && this._cfg.hub.state.issues || []).filter((i) => i.entry_id === id);
      const sub = (tab, html) => this._roomSub(tab, html);
      const tabBar = this._nav2 ? `<div class="tabs roomsub">${ROOM_TABS.map((x) => `<button class="tab ${x.id === (this._roomTab || ROOM_TAB_DEFAULT) ? "on" : ""}" data-roomtab="${x.id}"><ha-icon icon="${x.icon}"></ha-icon>${t(x.label)}</button>`).join("")}</div>` : "";
      const home = a.home_name || (this._cfg && this._cfg.homes || []).find((h) => h.entry_id === a.home)?.name || "";
      const roomHead = `<div class="roomhead" style="--c:${r.color || "var(--rk-heat)"}"><span class="dot"></span><div><small>${t("Raum")}</small><b>${esc(r.name)}</b></div>${home ? `<span class="rhome">${esc(home)}</span>` : ""}</div>`;
      return `${roomHead}${tabBar}<div class="groups">
      ${sub("overview", rIssues.length ? this._grp("heating", "Gesundheit", "mdi:heart-pulse", rIssues.some((i) => i.severity === "alert") ? "cold" : "warn", rkIssueList(rIssues, false), "span") : "")}
      ${sub("overview", this._roomOverviewGroup(r))}
      ${sub("overview", a.monitor ? this._grp("room", "Überwachung", "mdi:eye-outline", "eco", [
        this._row("Kein Thermostat", this._v("nur Messen und Hinweise", true), "Temperatur, Feuchte, CO₂ und Lüftungshinweise – ohne Heizungsregelung. Ein Thermostat lässt sich später in der Integration nachtragen.")
      ].join(""), "span") : "")}
      ${sub("control", a.monitor ? "" : this._grp("room", "Temperatur", "mdi:thermometer", "heat", [
        plan ? `<div class="status"><span class="chip" style="--tone:var(--rk-eco)"><ha-icon icon="mdi:information-outline"></ha-icon>${plan}</span></div>` : "",
        this._row("Wunschtemperatur", editable ? this._num(scope, "comfort_temperature", comfort) : this._v(`${fmt(comfort)} °C`), "beim Einschalten und als Grundwert", this._srcBadge(r, "comfort_temperature")),
        this._row(
          "Raumtyp",
          editable ? this._select(scope, "room_type", Object.entries(RK_ROOM_TYPES).map(([k, v]) => ({ id: k, name: v })), roomType) : this._v(RK_ROOM_TYPES[roomType] || "–"),
          t("jederzeit änderbar – Standardwerte des neuen Typs werden übernommen, eigene Werte bleiben")
        ),
        this._row("Gespeicherte Werte", `<div class="chips"><span class="chip2">CO₂ ${fmt(co2, 0)} ppm</span><span class="chip2">${notifyCap === 0 ? t("unbegrenzt") : t("{n} je Tag", { n: notifyCap })}</span><span class="chip2">${trvInterval === 0 ? t("automatisch") : t("{n} min", { n: trvInterval })}</span></div>`, "CO₂-Grenze · Hinweise pro Tag · Meldetakt des Thermostats"),
        (this._cfg && this._cfg.homes || []).length > 1 ? this._row("Wohnung", editable ? this._select(scope, "home", this._cfg.homes.map((h) => ({ id: h.entry_id, name: h.name })), a.home || "") : this._v(esc(a.home_name || "–")), "Raum gehört zu dieser Wohnung (Bewohner, Zone, Empfänger)") : "",
        this._row("Absenkung „kurz weg“", editable ? this._num(scope, "setback_short", sbShort) : this._v(`${fmt(sbShort)} °C`), "wenn alle weg sind", this._srcBadge(r, "setback_short")),
        this._row("Absenkung „länger weg“", editable ? this._num(scope, "setback_long", sbLong) : this._v(`${fmt(sbLong)} °C`), "ab 24 h oder Urlaub – Schimmelschutz hält feuchte Räume wärmer", this._srcBadge(r, "setback_long")),
        this._row("Frostschutz", editable ? this._num(scope, "frost_temperature", frost) : this._v(`${fmt(frost)} °C`), "unter diesem Wert heizt der Raum immer – wie am Gerät", this._srcBadge(r, "frost_temperature")),
        this._row(
          "Aufheizen",
          this._v(s.heatup && s.heatup.minutes_2k != null ? t("~{m} min für +2 °C", { m: s.heatup.minutes_2k }) : t("lernt noch ({n}/3)", { n: s.heatup && s.heatup.episodes || 0 }), !(s.heatup && s.heatup.minutes_2k != null)),
          s.heatup && s.heatup.rate ? t("{r} °C/h bei aktuellem Wetter · aus {n} Aufheizvorgängen · steuert, wann vorgeheizt wird", { r: fmt(s.heatup.rate, 1), n: s.heatup.episodes }) : "danach heizt die Wohnung rechtzeitig vor, bevor jemand ankommt"
        ),
        this._more("temp-more", "Weitere Einstellungen", [
          (() => {
            const pm = this._roomOpt(r, "preheat_mode") ?? "auto";
            const rows = [this._row(
              "Vorheizen",
              editable ? this._segs(scope, "preheat_mode", RK_PREHEAT, pm) : this._v(RK_PREHEAT[pm] || "–"),
              pm === "off" ? t("heizt erst zum Beginn des Zeitfensters – der Raum ist dann noch kalt") : pm === "auto" ? t("startet so früh, wie die gelernte Aufheizzeit es verlangt") : pm === "clock" ? t("startet nicht vor der eingestellten Uhrzeit – zum Beginn evtl. noch nicht ganz warm") : t("startet höchstens so viele Minuten vor dem Zeitfenster"),
              this._srcBadge(r, "preheat_mode")
            )];
            if (pm === "clock") {
              const cur = this._roomOpt(r, "preheat_not_before") ?? "05:00";
              const items = Array.from({ length: 24 }, (_x, h) => ({ id: `${String(h).padStart(2, "0")}:00`, name: t("ab {h}:00", { h }) }));
              rows.push(this._row("… nicht vor", editable ? this._select(scope, "preheat_not_before", items, cur) : this._v(cur)));
            }
            if (pm === "lead") {
              const lead = this._roomOpt(r, "preheat_lead_min") ?? 90;
              rows.push(this._row("… höchstens", editable ? this._num(scope, "preheat_lead_min", lead) : this._v(`${lead} min`), t("so viele Minuten vor dem Zeitfenster")));
            }
            return rows.join("");
          })(),
          (() => {
            const qm = this._roomOpt(r, "quiet_mode") ?? "auto";
            return this._row(
              "Nachtabsenkung",
              editable ? this._segs(scope, "quiet_mode", RK_QUIET, qm) : this._v(RK_QUIET[qm] || "–"),
              qm === "off" ? t("wird nachts nicht abgesenkt") : qm === "on" ? t("wird abgesenkt, sobald Ruhezeit ist oder der Schalter „Nachtruhe“ an ist") : t("wie bisher: nur Schlafzimmer und selten genutzte Räume"),
              this._srcBadge(r, "quiet_mode")
            );
          })(),
          this._row(
            "Sonnenseite",
            editable ? this._optToggle(scope, "solar_gain", !!(this._roomOpt(r, "solar_gain") ?? s.solar_gain)) : this._v(s.solar_gain ? "ja" : "nein"),
            a.plan_reason === "solar" ? "gerade: Sonne erwartet – 1 °C weniger" : t("bei Sonne 1 °C weniger heizen – die Sonne wärmt mit"),
            this._srcBadge(r, "solar_gain")
          ),
          acCount ? this._row(
            "Kühlen",
            editable ? this._optToggle(scope, "cooling", cooling) : this._v(cooling ? t("ja") : t("nein")),
            t("Klimaanlage kühlt, wenn der Raum über der Kühlgrenze liegt"),
            this._srcBadge(r, "cooling")
          ) : this._row(
            "Kühlen",
            this._v(t("keine Klimaanlage"), true),
            t("Klimaanlage im Reiter „Heizquellen“ mit „Quelle hinzufügen“ eintragen – dann kann der Raum kühlen und mit der Klimaanlage heizen")
          ),
          acCount && cooling ? this._row(
            "Kühlgrenze",
            editable ? this._num(scope, "cool_setpoint", coolSet) : this._v(`${fmt(coolSet)} °C`),
            t("oberhalb dieser Temperatur kühlt die Klimaanlage"),
            this._srcBadge(r, "cool_setpoint")
          ) : "",
          acCount && cooling ? this._row(
            "Mindestlaufzeit",
            editable ? this._num(scope, "ac_min_on", this._roomOpt(r, "ac_min_on") ?? s.ac_min_on ?? 10) : this._v(`${this._roomOpt(r, "ac_min_on") ?? s.ac_min_on ?? 10} min`),
            t("so lange bleibt die Klimaanlage mindestens an – gegen Takten"),
            this._srcBadge(r, "ac_min_on")
          ) : "",
          acCount && cooling ? this._row(
            "Mindestpause",
            editable ? this._num(scope, "ac_min_off", this._roomOpt(r, "ac_min_off") ?? s.ac_min_off ?? 10) : this._v(`${this._roomOpt(r, "ac_min_off") ?? s.ac_min_off ?? 10} min`),
            t("so lange bleibt sie nach dem Ausgehen mindestens aus"),
            this._srcBadge(r, "ac_min_off")
          ) : "",
          acCount ? this._row(
            "Klimaanlage zum Heizen",
            editable ? this._optToggle(scope, "ac_heat", !!(this._roomOpt(r, "ac_heat") ?? s.ac_heat)) : this._v(this._roomOpt(r, "ac_heat") ?? s.ac_heat ? t("ja") : t("nein")),
            s.ac_heat_active ? t("gerade aktiv – günstiger als Gas") : t("nutzt die Klimaanlage nur, wenn COP und Gaspreis günstiger sind"),
            this._srcBadge(r, "ac_heat")
          ) : "",
          (() => {
            const fac = this._roomOpt(r, "solar_facade") ?? s.solar_facade ?? "";
            return this._row(
              "Sonne kommt aus",
              editable ? this._select(scope, "solar_facade", RK_FACADES(), fac) : this._v(rkFacadeName(fac)),
              t("Richtung, in die die Fenster dieses Raums zeigen – vereinfacht, freie Sicht vorausgesetzt. Haus, Baum, Balkon oder ein tiefes Gewände davor zählt nicht mit; dann lieber leer lassen (nur Vorhersage). Bei zwei Fensterseiten: die mit der größeren Glasfläche."),
              this._srcBadge(r, "solar_facade")
            );
          })(),
          (() => {
            const ch = this._cfg && this._cfg.choices || {};
            const groups = [
              // #103: nur die Bewohner der Wohnung (bereits gewählte bleiben sichtbar)
              [t("Personen"), rkRelevantPersons(ch.persons || [], this._hubOpt("residents") || [], this._roomOpt(r, "room_persons") ?? s.room_persons ?? [])],
              [t("Schalter"), ch.room_switches || []]
            ].filter(([, items]) => items.length);
            if (!groups.some(([, items]) => items.length)) return "";
            const all = groups.flatMap(([, items]) => items);
            const cur = this._roomOpt(r, "room_persons") ?? s.room_persons ?? [];
            const selected = cur.map((pid) => {
              const p = all.find((x) => x.id === pid);
              return `<span class="chip2" style="--c:var(--rk-ok)"><i></i>${esc(p ? p.name : pid)}${editable ? `<button class="mini x" data-roomperson="${esc(pid)}" data-entry="${esc(id)}" title="${esc(t("entfernen"))}" aria-label="${esc(t("entfernen"))}">✕</button>` : ""}</span>`;
            }).join("");
            const rest = all.filter((p) => !cur.includes(p.id));
            const options = groups.map(([label, items]) => {
              const free = items.filter((p) => !cur.includes(p.id));
              return free.length ? `<optgroup label="${esc(label)}">${free.map((p) => `<option value="${esc(p.id)}">${esc(p.name)}</option>`).join("")}</optgroup>` : "";
            }).join("");
            const add = editable && rest.length ? `<select class="sel" data-roompersonadd="${esc(id)}" aria-label="${esc(t("Person oder Schalter hinzufügen …"))}"><option value="">${esc(t("Person oder Schalter hinzufügen …"))}</option>${options}</select>` : "";
            return this._row(
              "Gilt für Personen",
              `<div class="chips">${selected}${add}</div>`,
              cur.length ? t("nur wenn eine dieser Personen zu Hause ist oder ein gewählter Schalter an – sonst wird der Raum abgesenkt") : t("keine Auswahl = der Raum gilt allen Bewohnern; auch Schalter (z. B. Gast) und Präsenz-Sensoren wählbar"),
              this._srcBadge(r, "room_persons")
            );
          })()
        ].join(""), r, ["preheat_mode", "quiet_mode", "solar_gain", "solar_facade", "room_persons"])
      ].join("")))}
      ${sub("control", mon ? "" : this._floorGroup(r))}
      ${sub("schedule", mon ? "" : this._scheduleGroup(r, id, editable))}
      ${sub("windows", this._grp("air", "Lüften & Feuchte", "mdi:water-percent", "air", [
        sib.humidity_limit ? this._row("Feuchtegrenze", this._numStepper(sib.humidity_limit, " %", 0), "ab hier: „Bitte lüften“") : this._row("Feuchtefühler", this._v("keiner", true)),
        this._row(
          "Entfeuchter",
          editable ? this._select(scope, "dehumidifier_entity", dehChoices, deh, "– keiner –") : this._v(a.dehumidifier_entity ? esc(this._name(a.dehumidifier_entity)) : "keiner", !a.dehumidifier_entity),
          a.dehumidifier_active ? t("läuft gerade") : a.dehumidifier_entity && a.dehumidifier_state === "unavailable" ? t("nicht erreichbar") : a.dehumidifier_maxed ? t("läuft zu lange ohne Besserung – Heizung schützt weiter") : t("schaltet nach den eigenen Schwellen – nicht bei offenem Fenster"),
          this._srcBadge(r, "dehumidifier_entity")
        ),
        deh && dehOn != null ? this._row(
          "Entfeuchter an ab",
          editable ? this._num(scope, "dehumidifier_on", dehOn) : this._v(`${fmt(dehOn, 0)} %`),
          "eigene Schwelle – unabhängig vom Lüfthinweis „Bitte lüften“",
          this._srcBadge(r, "dehumidifier_on")
        ) : "",
        deh && dehOff != null ? this._row(
          "Entfeuchter aus unter",
          editable ? this._num(scope, "dehumidifier_off", dehOff) : this._v(`${fmt(dehOff, 0)} %`),
          "darunter wieder aus – muss mindestens 1 % unter dem Einschalten liegen",
          this._srcBadge(r, "dehumidifier_off")
        ) : "",
        deh ? this._row(
          "Einschaltverzögerung",
          editable ? this._num(scope, "dehumidifier_delay", dehDelay) : this._v(dehDelay ? `${fmt(dehDelay, 0)} min` : t("sofort")),
          "0 = sofort; so lange muss die Feuchte dauerhaft über der Einschaltschwelle bleiben – gegen kurze Duschspitzen",
          this._srcBadge(r, "dehumidifier_delay")
        ) : "",
        deh ? this._row(
          "Strommessung (W)",
          editable ? this._select(scope, "dehumidifier_power", dehPowerChoices, dehPower, "– keine –") : this._v(dehPower ? esc(this._name(dehPower)) : "–", !dehPower),
          "optionaler Leistungssensor der schaltbaren Steckdose",
          this._srcBadge(r, "dehumidifier_power")
        ) : "",
        deh ? this._row(
          "Stromzähler (kWh)",
          editable ? this._select(scope, "dehumidifier_energy", dehEnergyChoices, dehEnergy, "– keiner –") : this._v(dehEnergy ? esc(this._name(dehEnergy)) : "–", !dehEnergy),
          "optionaler kWh-Zähler für Verbrauch und Kosten",
          this._srcBadge(r, "dehumidifier_energy")
        ) : "",
        deh && a.dehumidifier_power != null ? this._row("Leistung gerade", this._v(`${fmt(a.dehumidifier_power, 0)} W`), "aktueller Verbrauch des Entfeuchters") : "",
        deh && a.dehumidifier_energy != null ? this._row(
          "Verbrauch gesamt",
          this._v(`${fmt(a.dehumidifier_energy, 2)} kWh${dehCost != null ? ` · ca. ${fmt(dehCost, 2)} €` : ""}`),
          dehCost != null ? "gerechnet mit dem Strompreis der Wohnung" : "Strompreis unter Allgemein → Energie & Tarife hinterlegen"
        ) : "",
        deh && a.dehumidifier_runs ? this._row("Starts", this._v(`${a.dehumidifier_runs}`), "wie oft der Entfeuchter seit dem Speichern eingeschaltet wurde") : "",
        deh && a.dehumidifier_runtime_min != null ? this._row("Laufzeit gesamt", this._v(`${fmt(a.dehumidifier_runtime_min, 0)} min`), "Summe aller Laufphasen") : "",
        this._row("Mindesttemperatur beim Lüften", this._numStepper(sib.min_temp, " °C", 1), "darunter: „Raum kühlt aus“"),
        this._row("Jetzt", this._v(a.current_humidity != null ? t("{h} % · Taupunkt {d} °C", { h: fmt(a.current_humidity, 0), d: fmt(a.dew_point) }) : "–")),
        this._row("Empfohlene Lüftdauer", this._v(a.recommended_minutes ? `${a.recommended_minutes} min` : "–"), a.outdoor_temperature != null ? t("bei {v} °C draußen", { v: fmt(a.outdoor_temperature) }) : ""),
        this._more("air-more", "Weitere Einstellungen", [
          this._row("Max. Abkühlung beim Lüften", this._numStepper(sib.max_drop, " °C", 1)),
          s.co2_sensor ? this._row(
            "CO₂-Grenze",
            editable ? this._select(
              scope,
              "co2_limit",
              [800, 1e3, 1200, 1500].map((v) => ({ id: String(v), name: `${v} ppm` })),
              String(this._roomOpt(r, "co2_limit") ?? 1e3)
            ) : this._v(`${this._roomOpt(r, "co2_limit") ?? 1e3} ppm`),
            t("1000 ppm ist der klassische Richtwert – in einem Wohnzimmer mit mehreren Personen liegt man abends dauerhaft darüber, 1200 ppm sind dort realistischer"),
            this._srcBadge(r, "co2_limit")
          ) : ""
        ].join(""), r, ["co2_limit"])
      ].join("")))}
      ${sub("mold", mon ? "" : this._grp("air", "Schimmelschutz", "mdi:shield-home-outline", "ok", [
        this._row(
          "Schimmelschutz",
          editable ? this._segs(scope, "mold_mode", RK_MOLD, moldMode) : this._v(RK_MOLD[moldMode] || "–"),
          moldMode === "strict" ? t("hebt den Sollwert so weit an, dass die kälteste Wandstelle unter 80 % Feuchte bleibt (DIN 4108-2) – begrenzt durch den Zuschlag darunter") : moldMode === "wish" ? t("hebt nur bis zur Wunschtemperatur an – tiefer wird nicht abgesenkt, aber auch nicht darüber geheizt") : t("kein Feuchte-Boden: der Raum fährt genau den eingestellten Wert – bei hoher Feuchte droht Schimmel an kalten Wänden"),
          this._srcBadge(r, "mold_mode")
        ),
        this._more("mold-more", "Weitere Einstellungen", [
          moldMode !== "off" ? this._row(
            "Höchstens anheben um",
            editable ? this._num(scope, "mold_cap", this._roomOpt(r, "mold_cap") ?? s.mold_cap ?? 1.5) : this._v(`${fmt(this._roomOpt(r, "mold_cap") ?? s.mold_cap ?? 1.5)} K`),
            t("Heizen löst kein Feuchteproblem: über diesem Zuschlag wird nicht weiter geheizt, sondern zum Lüften geraten (nachts 1,5 K)"),
            this._srcBadge(r, "mold_cap")
          ) : "",
          this._row(
            "Bauart",
            editable ? this._select(scope, "wall", Object.entries(RK_WALL).map(([k, v]) => ({ id: k, name: v })), this._roomOpt(r, "wall") ?? "auto") : this._v(RK_WALL[this._roomOpt(r, "wall") ?? "auto"]),
            t("bestimmt, wie kalt die kälteste Wandstelle wird: eine Außenecke braucht mehr Schutz als eine Innenwand"),
            this._srcBadge(r, "wall")
          )
        ].join(""), r, ["mold_cap", "wall"])
      ].join("")))}
      ${sub("sources", a.monitor ? "" : this._sourceGroup(r, id, editable))}
      ${sub("windows", this._grp("air", "Fenster", "mdi:window-open-variant", "ok", [
        mon ? "" : this._row("Heizung bei offenem Fenster pausieren", this._toggle(sib.window_logic)),
        this._row("Kontakte", `<div class="chips">${contacts}</div>`),
        this._more("win-more", "Weitere Einstellungen", [
          mon ? "" : this._row("Pause nach", editable ? this._num(scope, "window_open_delay", wOpen) : this._v(`${wOpen ?? "–"} s`), "", this._srcBadge(r, "window_open_delay")),
          mon ? "" : this._row("Weiter nach", editable ? this._num(scope, "window_close_delay", wClose) : this._v(`${wClose ?? "–"} s`), "", this._srcBadge(r, "window_close_delay")),
          this._row(
            "Schlafen bei offenem Fenster",
            editable ? this._segs(scope, "night_airing", RK_NIGHT, nightMode) : this._v(RK_NIGHT[nightMode] || "–"),
            nightMode === "auto" ? ["bedroom", "rarely_used"].includes(roomType) ? "Automatisch: ja, weil Schlafraum" : "Automatisch: nein, kein Schlafraum" : "abends geöffnet = Nachtlüften: keine Lüft-Hinweise, Heizung wartet",
            this._srcBadge(r, "night_airing")
          ),
          mon ? "" : this._row(
            "Offenes Fenster an Temperatursturz erkennen",
            editable ? this._segs(scope, "virtual_window", RK_NIGHT, virtMode) : this._v(RK_NIGHT[virtMode] || "–"),
            (a.window_virtual ? t("gerade: Fenster vermutlich offen · ") : "") + t(virtMode === "auto" ? s.virtual_active ? "Automatisch: aktiv (kein Kontakt erreichbar)" : "Automatisch: aus, der Kontakt meldet zuverlässig" : "fällt es in 6 min um 1 °C, pausiert die Heizung bis es wieder wärmer wird"),
            this._srcBadge(r, "virtual_window")
          )
        ].join(""), r, ["window_open_delay", "window_close_delay", "night_airing", "virtual_window"])
      ].join("")))}
      ${sub("windows", this._airingGroup(r, id, editable))}
      ${sub("windows", (() => {
        const shade = s.shading || {};
        const mode = this._roomOpt(r, "shading_mode") ?? shade.mode ?? "off";
        const pos = this._roomOpt(r, "shading_position") ?? shade.position ?? 20;
        const minT = this._roomOpt(r, "shading_min_temp") ?? shade.min_temp ?? 22;
        const outT = this._roomOpt(r, "shading_outdoor_min") ?? shade.outdoor_min ?? 18;
        const night = this._roomOpt(r, "shading_night") ?? shade.night ?? false;
        const manual = this._roomOpt(r, "shading_manual_minutes") ?? shade.manual_minutes ?? 120;
        const covers = shade.covers || [];
        const states = {
          off: t("Aus"),
          unconfigured: t("keine Rollläden gewählt"),
          manual: t("Handbedienung – pausiert"),
          open: t("offen"),
          closed: t("geschlossen"),
          advise_open: t("Empfehlung: öffnen"),
          advise_close: t("Empfehlung: schließen"),
          error: t("Gerät antwortet nicht")
        };
        const reasons = {
          off: "",
          no_covers: "",
          manual: "",
          night: t("Nacht"),
          night_open: t("Nacht vorbei"),
          sun: t("Sonne auf der Fassade"),
          no_sun: t("keine Sonne erwartet"),
          cool: t("zu kühl für Schatten"),
          no_data: t("keine Temperaturdaten"),
          window_open: t("Fenster/Tür offen – fährt nicht zu")
        };
        const status = [states[shade.state] || "–", reasons[shade.reason] || ""].filter(Boolean).join(" · ");
        return this._grp("shade", "Verschattung", "mdi:blinds", "ok", [
          this._row(
            "Verschattung",
            editable ? this._segs(scope, "shading_mode", RK_SHADE(), mode) : this._v(t("Aus")),
            mode === "off" ? t("Rollläden bleiben, wie sie sind") : mode === "advise" ? t("die Karte empfiehlt, fährt aber nicht selbst") : t("fährt bei Sonne und nachts – Handbedienung pausiert die Automatik"),
            this._srcBadge(r, "shading_mode")
          ),
          this._row(
            "Rollläden",
            covers.length ? `<div class="chips">${covers.map((x) => `<span class="chip2" style="--c:${x.available === false ? "var(--rk-cold)" : "var(--rk-ok)"}" title="${esc(x.entity_id)}"><i></i>${esc(x.name)}${x.position != null ? ` · ${fmt(x.position, 0)} %` : ""}</span>`).join("")}</div>` : this._v(t("keine – unter „Geräte & Technik ändern“ wählen"), true),
            t("nur diese Rollläden oder Jalousien werden gefahren – Fensterkontakte bleiben getrennt")
          ),
          this._row("Jetzt", this._v(status || "–", shade.active === false), reasons[shade.reason] || ""),
          mode !== "off" ? this._row(
            "Schließen ab innen",
            editable ? this._num(scope, "shading_min_temp", minT) : this._v(`${fmt(minT)} °C`),
            t("ab dieser Raumtemperatur hält die Sonne den Raum warm – dann Schatten"),
            this._srcBadge(r, "shading_min_temp")
          ) : "",
          mode !== "off" ? this._row(
            "oder ab außen",
            editable ? this._num(scope, "shading_outdoor_min", outT) : this._v(`${fmt(outT)} °C`),
            t("ab dieser Außentemperatur wird es auch ohne warmen Raum zu warm"),
            this._srcBadge(r, "shading_outdoor_min")
          ) : "",
          mode !== "off" ? this._row(
            "Schließposition",
            editable ? this._num(scope, "shading_position", pos) : this._v(`${fmt(pos, 0)} %`),
            t("0 % = ganz zu, 100 % = ganz offen – Rollläden ohne Positionsfahrt schließen ganz"),
            this._srcBadge(r, "shading_position")
          ) : "",
          mode !== "off" ? this._row(
            "Nachts schließen",
            editable ? this._optToggle(scope, "shading_night", !!night) : this._v(night ? t("ja") : t("nein")),
            t("nach Sonnenuntergang zu, morgens wieder auf – schützt vor Wärmeverlust und Licht"),
            this._srcBadge(r, "shading_night")
          ) : "",
          this._more("shade-more", "Weitere Einstellungen", [
            this._row(
              "Handbedienung pausiert",
              editable ? this._num(scope, "shading_manual_minutes", manual) : this._v(`${manual} min`),
              t("so lange bleibt die Automatik aus, wenn jemand selbst am Rollladen zieht – 0 = sofort wieder automatisch"),
              this._srcBadge(r, "shading_manual_minutes")
            )
          ].join(""), r, ["shading_manual_minutes"])
        ].join(""));
      })())}
      ${sub("presence", this._presenceGroup(r, id, editable))}
      ${sub("learn", this._learnRoom(r))}
      ${sub("notify", this._lightGroup(r, id, editable))}
      ${sub("notify", this._grp("notify", "Benachrichtigungen", "mdi:bell-outline", "warn", [
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
      ].join("")))}
      ${sub("devices", this._grp("heating", mon ? "Fühler & Sensoren" : "Thermostat & Fühler", mon ? "mdi:thermometer-lines" : "mdi:radiator", "off", [
        mon ? "" : this._row("Thermostat", this._v(esc(this._name(s.trv))), [(s.extra_trvs || []).length ? "Haupt-Thermostat" : "", s.valve_reported === false ? t("meldet keine Ventilöffnung") : ""].filter(Boolean).join(" · ")),
        !mon && (s.extra_trvs || []).length ? this._row("Weitere Thermostate", `<div class="chips">${s.extra_trvs.map((x) => `<span class="chip2" style="--c:${!x.available ? "var(--rk-cold)" : x.sync === "ok" ? "var(--rk-ok)" : "var(--rk-warn)"}" title="${esc(x.entity_id)}${x.setpoint_expected != null ? ` · ${t("erwartet {v}°", { v: fmt(x.setpoint_expected) })}` : ""}"><i></i>${esc(x.name)} · ${x.available ? `${fmt(x.temperature)}° → ${fmt(x.setpoint)}°${x.valve != null ? ` · ${fmt(x.valve, 0)} %` : ""}` : t("nicht erreichbar")}</span>`).join("")}</div>`, "bekommen dieselben Befehle, jedes mit eigener Prüfung und eigenem Korrekturwert – Offset für einen einzelnen Heizkörper unter „Heizquellen“ setzen") : "",
        this._row("Temperaturfühler", this._v(esc(this._name(a.temperature_sensor)))),
        a.temperature_sensor ? this._row(
          "Korrektur Raumfühler",
          editable ? this._num(scope, "sensor_offset", this._roomOpt(r, "sensor_offset") ?? s.sensor_offset ?? 0) : this._v(`${fmt(this._roomOpt(r, "sensor_offset") ?? s.sensor_offset ?? 0, 1)} K`),
          [(() => {
            const rd = rkSensorReading(this._st(a.temperature_sensor)?.state, this._roomOpt(r, "sensor_offset") ?? s.sensor_offset ?? 0);
            return rd ? t("misst gerade {raw} °C → mit Korrektur {cor} °C", { raw: fmt(rd.raw, 1), cor: fmt(rd.corrected, 1) }) : "";
          })(), t("Zeigt der Fühler zu wenig oder zu viel an, hier ausgleichen: zeigt er 21,5 °C, sind es aber 22,2 °C, dann +0,7 K. Raumklima rechnet überall mit dem korrigierten Wert.")].filter(Boolean).join(" · ")
        ) : "",
        this._row("Feuchtefühler", this._v(a.humidity_entity ? esc(this._name(a.humidity_entity)) : "keiner", !a.humidity_entity)),
        this._row("CO₂-Sensor", this._v(s.co2_sensor ? esc(this._name(s.co2_sensor)) : "keiner", !s.co2_sensor), s.co2_sensor ? t("Grenze unter Lüften & Feuchte") : ""),
        this._row("Feinstaubfühler", this._v(s.pm25_sensor ? esc(this._name(s.pm25_sensor)) : "keiner", !s.pm25_sensor), s.pm25_sensor ? "PM2,5 – ab 35 µg/m³: „Bitte lüften“" : ""),
        mon ? "" : this._row(
          "Ventilsteuerung",
          editable ? this._segs(scope, "valve_control", RK_VALVE(), (s.valve || {}).mode || "off") : this._v(RK_VALVE()[(s.valve || {}).mode] || "–"),
          (s.valve || {}).direct ? t("direkt über {e}", { e: esc(this._name((s.valve || {}).actuator || "")) }) : t("Sollwert am Thermostat – kein Ventilstellglied gefunden"),
          this._srcBadge(r, "valve_control")
        ),
        mon ? "" : this._row("Übertragung", `<span class="v" style="color:${toneVar(sync[1])}">● ${sync[0]}</span>`, t("prüft nach {s} s · bis zu {n} Wiederholungen", { s: s.sync_verify_delay ?? "–", n: s.sync_max_retries ?? "–" })),
        ...(s.battery_forecast || []).map((b) => this._row(
          t("Batterie: {n}", { n: b.name }),
          this._v(b.days_left == null ? t("Prognose ab 7 Tagen Verlauf") : t("hält noch etwa {d} Tage", { d: b.days_left }), b.days_left == null || b.days_left < 30),
          s.rf_per_day != null ? t("{n} Funkbefehle am Tag (Mittel 7 Tage)", { n: s.rf_per_day }) : ""
        )),
        this._more("dev-more", "Technik", [
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
          mon ? "" : this._row(
            "Kalibrierung",
            editable ? this._segs(scope, "calibration_mode", s.calibration_entity ? RK_CAL : { target: RK_CAL.target, none: RK_CAL.none, hysteresis: RK_CAL.hysteresis }, s.calibration_mode || "target") : this._v(RK_CAL[s.calibration_mode] || "–"),
            (calHelp[s.calibration_mode || "target"] || calHelp.target) + (s.calibration_entity ? "" : " · " + t("„Offset am Thermostat“ erscheint nur bei Geräten mit Kalibrier-Entität"))
          ),
          !mon && s.calibration_mode === "hysteresis" ? this._row(
            "Hysterese",
            editable ? this._num(scope, "hysteresis_k", this._roomOpt(r, "hysteresis_k") ?? s.hysteresis_k ?? 0.5) : this._v(`${fmt(this._roomOpt(r, "hysteresis_k") ?? s.hysteresis_k ?? 0.5, 1)} K`),
            t("Breite des Schaltbereichs – 0,5 K heißt: auf bei Ziel −0,25 K, zu bei Ziel +0,25 K")
          ) : "",
          mon ? "" : this._row("Einschalten mit", this._v(s.on_preset === "auto_detect" || !s.on_preset ? t("Automatisch") : t("Preset „{p}“", { p: esc(s.on_preset) }))),
          mon ? "" : this._row(
            "Ausschalten über",
            editable ? this._select(scope, "off_method", Object.entries(RK_OFF).map(([k, v]) => ({ id: k, name: v })), s.off_method || "auto") : this._v(RK_OFF[s.off_method] || s.off_method || "–"),
            s.off_method === "auto" && s.off_method_active ? t("gerade: {m}", { m: RK_OFF[s.off_method_active] || s.off_method_active }) : ""
          ),
          !mon && (s.off_method === "setpoint" || s.off_method_active === "setpoint") ? this._row(
            "Aus-Sollwert",
            editable ? this._num(scope, "off_temperature", this._roomOpt(r, "off_temperature") ?? s.off_temperature ?? 16) : this._v(`${fmt(s.off_temperature ?? 16)} °C`),
            t("Dieser Sollwert gilt, wenn der Raum aus ist – z. B. 16 °C für eine ganze Heizanlage statt der Gerätegrenze")
          ) : "",
          mon ? "" : this._row(
            "Betriebsart nie umschalten",
            editable ? this._optToggle(scope, "keep_mode", !!(this._roomOpt(r, "keep_mode") ?? s.keep_mode)) : this._v(s.keep_mode ? t("ja") : t("nein")),
            t("Raumklima schreibt nur noch Sollwerte und stellt nie Modus oder Preset um – für eine Anlage, die das ganze Haus heizt (z. B. ViCare). Ausschalten dann über Minimaltemperatur oder festen Sollwert.")
          ),
          mon ? "" : this._row("Drehen am Thermostat übernehmen", this._v(s.follow_trv ? t("ja") : t("nein")))
        ].join(""), r, ["fast_poll", "trv_interval"])
      ].join(""), `span cols`))}
    </div>
    <div class="foot">
      ${sib.calibrate ? `<button class="btn" data-press="${sib.calibrate}" style="--c:var(--rk-heat)"><ha-icon icon="mdi:tune-vertical"></ha-icon>${t("Jetzt kalibrieren")}</button>` : ""}
      <button class="btn primary" data-nav="/config/integrations/integration/raumklima"><ha-icon icon="mdi:cog"></ha-icon>${t("Geräte & Technik ändern")}</button>
    </div>
    <div class="hint">${t("Werte mit + / − werden nach kurzer Pause gespeichert; der Raum übernimmt sie sofort. Geräte (Thermostat, Fühler, Kontakte) und Technik änderst du unter „Geräte & Technik ändern“ → Zahnrad beim Raum „{r}“.", { r: esc(r.name) })}</div>`;
    },
    _floorGroup(r) {
      const s = r.attrs.settings || {};
      const f = s.floor || {};
      const id = s.entry_id;
      const scope = `room:${id}`;
      const editable = this._admin && this._cfgRoom(r);
      const enabled = !!(this._roomOpt(r, "floor_heating") ?? f.enabled);
      const rows = [
        this._row(
          "Fußbodenheizung",
          editable ? this._optToggle(scope, "floor_heating", enabled) : this._v(enabled ? t("ja") : t("nein")),
          t("eigene Regelcharakteristik: träge, mit Vor-/Rücklauf und größerem Band"),
          this._srcBadge(r, "floor_heating")
        )
      ];
      if (!enabled) return this._grp("heating", "Fußbodenheizung", "mdi:heating-coil", "heat", rows.join(""), "span");
      const state = f.state || "no_sensors";
      const stateText = { off: t("aus"), ok: t("Durchfluss in Ordnung"), no_sensors: t("Vor-/Rücklauf nicht verbunden"), low_flow: t("Spreizung zu klein – Pumpe/Abgleich prüfen") }[state] || state;
      const tone = state === "low_flow" ? "warn" : state === "ok" ? "ok" : "off";
      rows.push(this._row("Jetzt", this._v(`${fmt(f.supply)} / ${fmt(f.return)} °C${f.delta != null ? ` · Δ ${fmt(f.delta, 1)} K` : ""}`, state !== "ok"), stateText));
      rows.push(this._row("Sollwert am Gerät", this._v(f.setpoint != null ? `${fmt(f.setpoint, 1)} °C` : "–"), t("durch die Fußboden-Charakteristik begrenzt und im Takt nachgezogen")));
      if (editable) {
        rows.push(this._row("Max. Vorlauf", this._num(scope, "floor_max_temp", this._roomOpt(r, "floor_max_temp") ?? f.max_temp ?? 27), t("harte Obergrenze – schützt Boden und Heizkreis"), this._srcBadge(r, "floor_max_temp")));
        rows.push(this._row("Min. Raumtemperatur", this._num(scope, "floor_min_temp", this._roomOpt(r, "floor_min_temp") ?? f.min_temp ?? 18), t("darunter heizt die Fußbodenheizung nicht"), this._srcBadge(r, "floor_min_temp")));
        rows.push(this._row("Regelband", this._num(scope, "floor_band", this._roomOpt(r, "floor_band") ?? f.band ?? 1), t("innerhalb des Bandes bleibt der Sollwert stehen – gegen Überschwingen"), this._srcBadge(r, "floor_band")));
        rows.push(this._row("Mindest-Taktzeit", this._num(scope, "floor_cycle_min", this._roomOpt(r, "floor_cycle_min") ?? f.cycle_min ?? 30), t("so oft darf der Sollwert höchstens nachgezogen werden"), this._srcBadge(r, "floor_cycle_min")));
        rows.push(this._row("Vorlauf vor Zeitfenster", this._num(scope, "floor_lead_min", this._roomOpt(r, "floor_lead_min") ?? f.lead_min ?? 60), t("früher starten, damit der träge Boden zum Fenster warm ist"), this._srcBadge(r, "floor_lead_min")));
        rows.push(this._row("Durchfluss-Grenze", this._num(scope, "floor_flow_min", this._roomOpt(r, "floor_flow_min") ?? f.flow_min ?? 5), t("Vorlauf minus Rücklauf unter diesem Wert: Durchfluss prüfen"), this._srcBadge(r, "floor_flow_min")));
      }
      return this._grp("heating", "Fußbodenheizung", "mdi:heating-coil", tone, rows.join(""), "span");
    },
    _srcList(id) {
      const room = (this._rooms || []).find((x) => (x.attrs.settings || {}).entry_id === id);
      const cur = room && (this._roomOpt(room, "heat_sources") ?? (room.attrs.settings || {}).heat_sources) || [];
      return cur.map((x) => ({ ...x }));
    },
    _sourceGroup(r, id, editable) {
      const s = r.attrs.settings || {};
      const scope = `room:${id}`;
      const all = this._cfg && this._cfg.choices && this._cfg.choices.climate || [];
      const sigs = this._cfg && this._cfg.choices && this._cfg.choices.signals || [];
      const list = (this._roomOpt(r, "heat_sources") ?? s.heat_sources ?? []).map((x) => ({ ...x }));
      const used = new Set([s.trv, ...list.map((x) => x.entity)].filter(Boolean));
      const avail = all.filter((x) => !used.has(x.id));
      const rows = [
        this._row("Haupt-Thermostat", this._v(esc(this._name(s.trv || "")), true), t("führt den Raum; die anderen Quellen folgen der Auswahl"))
      ];
      list.forEach((src, idx) => {
        const trigOpts = [{ id: "", name: t("– keiner –") }, ...sigs];
        const off = src.untouched ? "" : " off";
        rows.push(this._row(
          esc(src.name || src.entity),
          `<div class="chips">
          <select class="sel" data-srcfield="${id}|${idx}|type">
            <option value="trv"${src.type !== "ac" ? " selected" : ""}>${t("Thermostat")}</option>
            <option value="ac"${src.type === "ac" ? " selected" : ""}>${t("Klimaanlage")}</option>
          </select>
          <select class="sel" data-srcfield="${id}|${idx}|trigger">
            ${trigOpts.map((o) => `<option value="${esc(o.id)}"${(src.trigger || "") === o.id ? " selected" : ""}>${esc(o.name)}</option>`).join("")}
          </select>
          <button class="chip2${off}" data-srcuntouched="${id}|${idx}"><i></i>${t("unangetastet")}</button>
          <button class="mini x" data-srcdel="${id}|${idx}" title="${t("entfernen")}">✕</button>
        </div>`,
          `${esc(src.entity)} · ${t("Offset")} ${src.offset > 0 ? "+" : ""}${fmt(src.offset, 1)} K`
        ));
        rows.push(this._row(
          "… Offset",
          editable ? `<div class="stepper"><button data-srcstep="${id}|${idx}|-0.5" aria-label="${t("weniger")}">−</button><span class="v">${src.offset > 0 ? "+" : ""}${fmt(src.offset, 1)} K</span><button data-srcstep="${id}|${idx}|0.5" aria-label="${t("mehr")}">+</button></div>` : this._v(`${src.offset > 0 ? "+" : ""}${fmt(src.offset, 1)} K`),
          t("fest für diese Quelle – z. B. +0,5 K, damit sie früher anläuft")
        ));
      });
      if (!list.length) rows.push(this._row("Weitere Quellen", this._v(t("keine"), true), t("Thermostate oder Klimaanlagen, die mit dem Raum laufen")));
      const extItems = this._cfg && this._cfg.choices && this._cfg.choices.external_heat || [];
      const extCur = this._roomOpt(r, "external_heat_entity") ?? s.external_heat_entity ?? "";
      rows.push(this._row(
        "Fremdwärme (Kamin/Holzofen)",
        editable ? this._select(scope, "external_heat_entity", extItems, extCur, t("– keine –")) : this._v(extCur ? this._name(extCur) : t("keine"), !extCur),
        t("Schalter, Helfer oder Binärsensor „Ofen brennt“ – solange er an ist, bleiben die Thermostate in diesem Raum zu, Raumklima meldet nichts zu „zu warm“ und lernt nicht")
      ));
      if (extCur) rows.push(this._row("… Nachlauf", this._num(scope, "external_heat_after", this._roomOpt(r, "external_heat_after") ?? s.external_heat_after ?? 30), t("so lange nach dem Ausgehen gilt der Ofen noch – er wärmt nach")));
      if (editable && avail.length) {
        rows.push(`<div class="row"><div class="l"><span class="lbl"></span></div><div class="addrow"><select class="sel" id="addSrc-${id}">${avail.map((x) => `<option value="${esc(x.id)}">${esc(x.name)}</option>`).join("")}</select><button class="btn" data-srcadd="${id}" style="--c:var(--rk-eco)"><ha-icon icon="mdi:plus"></ha-icon>${t("Quelle hinzufügen")}</button></div></div>`);
      }
      return this._grp("heating", "Heizquellen", "mdi:radiator", "heat", rows.join(""), "span");
    },
    _presenceGroup(r, id, editable) {
      const a = r.attrs, s = a.settings || {};
      const scope = `room:${id}`;
      const homeOfficeChoices = this._cfg && this._cfg.choices && this._cfg.choices.home_office || [];
      const homeOfficeEntity = this._roomOpt(r, "home_office_entity") ?? s.home_office_entity ?? "";
      const kinds = s.presence_sensors || {};
      const list = this._roomOpt(r, "presence_sensors") ?? Object.keys(kinds);
      const all = [...new Map([
        ...this._cfg && this._cfg.choices && this._cfg.choices.presence || [],
        ...this._cfg && this._cfg.choices && this._cfg.choices.presence_devices || []
      ].map((x) => [x.id, x])).values()];
      const info = Object.fromEntries(all.map((x) => [x.id, x]));
      const pk = this._roomOpt(r, "presence_kind") ?? s.presence_kind ?? "auto";
      const kindOf = (e) => pk === "mmwave" || pk === "pir" ? pk : kinds[e] || info[e] && info[e].kind || "pir";
      const badge = (k) => `<b class="kb">${k === "mmwave" ? "mmWave" : "PIR"}</b>`;
      const chips = list.map((e) => {
        const on = this._st(e) && this._st(e).state === "on";
        return `<span class="chip2" style="--c:${on ? "var(--rk-ok)" : "var(--rk-off)"}"><i></i>${esc(info[e] && info[e].name || this._name(e))} ${badge(kindOf(e))}${editable ? ` <button class="mini x" data-presrm="${esc(e)}" data-entry="${id}" title="${t("entfernen")}">✕</button>` : ""}</span>`;
      }).join("");
      const avail = all.filter((x) => !list.includes(x.id));
      const addRow = editable && avail.length ? `<div class="addrow"><select class="sel" id="addPres-${id}">${avail.map((x) => `<option value="${esc(x.id)}">${esc(x.name)} (${x.kind === "mmwave" ? "mmWave" : "PIR"})</option>`).join("")}</select><button class="btn" data-presadd="${id}" style="--c:var(--rk-ok)"><ha-icon icon="mdi:plus"></ha-icon>${t("Melder/Gerät hinzufügen")}</button></div>` : "";
      const lights = this._roomOpt(r, "presence_lights") ?? [];
      const allLights = this._cfg && this._cfg.choices && (this._cfg.choices.presence_lights || this._cfg.choices.lights) || [];
      const lightName = (e) => (allLights.find((x) => x.id === e) || {}).name || this._name(e);
      const lightChips = lights.map((e) => {
        const on = this._st(e) && this._st(e).state === "on";
        return `<span class="chip2" style="--c:${on ? "var(--rk-warn)" : "var(--rk-off)"}"><i></i>${esc(lightName(e))}${editable ? ` <button class="mini x" data-plightrm="${esc(e)}" data-entry="${id}" title="${t("entfernen")}">✕</button>` : ""}</span>`;
      }).join("");
      const lightAvail = allLights.filter((x) => !lights.includes(x.id));
      const lightAdd = editable && lightAvail.length ? `<div class="addrow"><select class="sel" id="addPLight-${id}">${lightAvail.map((x) => `<option value="${esc(x.id)}">${esc(x.name)}</option>`).join("")}</select><button class="btn" data-plightadd="${id}" style="--c:var(--rk-warn)"><ha-icon icon="mdi:lightbulb-on-outline"></ha-icon>${t("Lampe/Steckdose hinzufügen")}</button></div>` : "";
      const lightRow = this._row("Lampen und Steckdosen zählen als Anwesenheit", lights.length ? `<div class="chips">${lightChips}</div>` : this._v("keine", true), "eingeschaltet heißt: jemand ist im Raum (z. B. Schreibtischlampe, PC-Steckdose) – zählt nur für diesen Raum, nie für „jemand zu Hause“");
      const homeOfficeRow = this._row(
        "Eigener Homeoffice-Schalter",
        editable ? this._select(scope, "home_office_entity", homeOfficeChoices, homeOfficeEntity, "– keiner –") : this._v(homeOfficeEntity ? esc(this._name(homeOfficeEntity)) : t("keiner"), !homeOfficeEntity),
        "Schalter oder Helfer (z. B. input_boolean „Büro Anna“) – ist er an, heizt dieser Raum wie im Homeoffice. Der Raum folgt dann nicht mehr dem allgemeinen Homeoffice. Für „jemand ist im Raum“ (z. B. „Gast belegt“) passt besser „Melder/Gerät hinzufügen“ oben."
      );
      if (!list.length) {
        return this._grp("presence", "Präsenzmelder", "mdi:motion-sensor", "ok", [
          this._row("Melder", this._v("keine", true), "Melder oder Gerät hinzufügen (z. B. PC/Lampe) – dann kann der Raum bei Anwesenheit wärmer werden"),
          addRow,
          lightRow,
          lightAdd,
          homeOfficeRow
        ].join(""));
      }
      const eco = this._roomOpt(r, "room_eco") ?? s.room_eco ?? "auto";
      const after = this._roomOpt(r, "room_eco_after") ?? s.room_eco_after ?? 30;
      const drop = this._roomOpt(r, "room_eco_drop") ?? s.room_eco_drop ?? 1.5;
      const pt = Number(this._roomOpt(r, "presence_target") || 0);
      const pd = Number(this._roomOpt(r, "presence_delay_min") ?? 5);
      const pr = Number(this._roomOpt(r, "presence_release_min") ?? 5);
      const pir = !!this._roomOpt(r, "presence_pir");
      const wish = Number(this._roomOpt(r, "comfort_temperature") ?? a.comfort_temperature ?? 20);
      const learn = this._roomOpt(r, "presence_learn") ?? true;
      const counting = [...list.filter((e) => kindOf(e) === "mmwave" || pir), ...lights];
      const hasPir = list.some((e) => kindOf(e) === "pir");
      const since = a.presence_since ? Math.max(0, Math.floor((Date.now() - Date.parse(a.presence_since)) / 6e4)) : null;
      let state = a.occupied === true ? t("jemand im Raum") : a.occupied === false ? a.room_eco ? t("leer – abgesenkt") : t("leer") : t("unbekannt");
      let tone = a.occupied ? "var(--rk-ok)" : "var(--rk-off)";
      if (pt && a.presence_heat) {
        state = t("heizt auf {t} – jemand im Raum", { t: `${fmt(pt)} °C` });
        tone = "var(--rk-heat)";
      } else if (pt && since != null) {
        state = t("jemand da seit {m} min – ab {d} min {t}", { m: since, d: pd, t: `${fmt(pt)} °C` });
      }
      const warn = [];
      if (pt && !counting.length) warn.push(t("Nur Bewegungsmelder (PIR) gewählt – für die Anwesenheits-Temperatur unten „auch Bewegungsmelder“ einschalten oder einen mmWave-Melder hinzufügen."));
      if (pt && pt <= wish) warn.push(t("„Bei Anwesenheit“ liegt nicht über der Wunschtemperatur ({w}) – dann ändert sich nichts. Die Wunschtemperatur ist der Wert, wenn niemand im Raum ist.", { w: `${fmt(wish)} °C` }));
      const ptCtl = !editable ? this._v(pt ? `${fmt(pt)} °C` : t("aus"), !pt) : pt ? `<span class="inline">${this._num(scope, "presence_target", pt)} <button class="mini x" data-setopt="${scope}" data-key="presence_target" data-v="0" title="${t("ausschalten")}">${t("aus")}</button></span>` : `<button class="btn" data-setopt="${scope}" data-key="presence_target" data-v="${Math.min(30, wish + 2)}" style="--c:var(--rk-heat)"><ha-icon icon="mdi:account-arrow-up-outline"></ha-icon>${t("Einschalten ({t})", { t: `${fmt(Math.min(30, wish + 2))} °C` })}</button>`;
      const rows = [
        `<div class="status"><span class="chip" style="--tone:${tone}"><ha-icon icon="${a.occupied ? "mdi:account" : "mdi:account-off-outline"}"></ha-icon>${state}</span></div>`,
        ...warn.map((w) => `<div class="hint warn">${w}</div>`),
        this._row("Melder", `<div class="chips">${chips}</div>`, "mmWave (Radar) sieht auch Stillsitzende · PIR nur Bewegung"),
        addRow,
        // Lampen/Steckdosen gut sichtbar direkt unter den Meldern (#72) – vorher unter „Weitere Einstellungen“
        lightRow,
        lightAdd,
        homeOfficeRow,
        this._row(
          "Bei Anwesenheit",
          ptCtl,
          pt ? t("so warm, solange jemand im Raum ist – danach wieder die Temperatur von vorher") : t("aus – der Raum heizt nach Wunsch und Zeitplan")
        ),
        pt ? this._row("… wenn belegt seit", editable ? this._num(scope, "presence_delay_min", pd) : this._v(`${pd} min`), t("so lange muss jemand im Raum sein – kurz Durchgehen zählt nicht (0 = sofort)")) : "",
        pt ? this._row("… zurück nach", editable ? this._num(scope, "presence_release_min", pr) : this._v(`${pr} min`), t("so lange ohne Belegung, dann gilt wieder die Temperatur von vorher – kurz rausgehen unterbricht nicht")) : "",
        pt ? this._row(
          "Vorwärmen nach gelernten Zeiten",
          editable ? this._optToggle(scope, "presence_learn", learn) : this._v(learn ? t("ja") : t("nein")),
          a.usage ? t("meist belegt: {u} – so früh vorwärmen, dass es dann warm ist; kommt 30 min niemand, gilt wieder der Wert von vorher", { u: a.usage }) : t("lernt noch: ein Zeitraum gilt als typisch, wenn der Raum an 3 der letzten 4 gleichen Wochentage belegt war")
        ) : ""
      ];
      const more = [
        this._row("Art", editable ? this._segs(scope, "presence_kind", RK_PKIND, pk) : this._v(RK_PKIND[pk]), "Automatisch: Bewegung = PIR, Anwesenheit/Belegung = mmWave. Für „Raum leer“: 3 min (mmWave) bzw. 20 min (PIR) ohne Meldung"),
        pt && hasPir ? this._row("… auch Bewegungsmelder", editable ? this._optToggle(scope, "presence_pir", pir) : this._v(pir ? t("ja") : t("nein")), t("PIR sieht auch Haustiere und nach ein paar Minuten Stillsitzen niemanden mehr – dann „zurück nach“ eher 20 min")) : "",
        this._row(
          "Leeren Raum absenken",
          editable ? this._segs(scope, "room_eco", RK_NIGHT, eco) : this._v(RK_NIGHT[eco]),
          eco === "auto" ? pt ? t("Automatisch: nein – „Bei Anwesenheit“ ist eingestellt, die Wunschtemperatur ist schon der Wert für den leeren Raum") : s.room_eco_enabled ? "Automatisch: ja (mmWave, passender Raumtyp)" : "Automatisch: nein – nur Wohnraum, Küche, selten genutzt und nur mit mmWave" : ""
        ),
        eco === "on" || eco === "auto" && s.room_eco_enabled ? this._row("… wenn leer seit", editable ? this._num(scope, "room_eco_after", after) : this._v(`${after} min`)) : "",
        eco === "on" || eco === "auto" && s.room_eco_enabled ? this._row("… um", editable ? this._num(scope, "room_eco_drop", drop) : this._v(`${fmt(drop)} °C`), "nie unter „kurz weg“ und den Schimmelschutz; kommt jemand rein, sofort zurück") : ""
      ];
      rows.push(this._more("pres-more", "Weitere Einstellungen", more.join(""), r, ["presence_kind", "presence_pir", "room_eco", "room_eco_after", "room_eco_drop"]));
      return this._grp("presence", "Präsenzmelder", "mdi:motion-sensor", "ok", rows.join(""));
    },
    _lightGroup(r, id, editable) {
      const s = r.attrs.settings || {};
      const lights = this._roomOpt(r, "signal_lights") ?? s.signal_lights ?? [];
      const sigs = this._roomOpt(r, "light_signals") ?? s.light_signals ?? ["open", "close"];
      const all = this._cfg && this._cfg.choices && this._cfg.choices.lights || [];
      const names = Object.fromEntries(all.map((x) => [x.id, x.name]));
      const chips = lights.map((e) => `<span class="chip2" style="--c:var(--rk-air)"><i></i>${esc(names[e] || this._name(e))}${editable ? ` <button class="mini x" data-lightrm="${esc(e)}" data-entry="${id}" title="${t("entfernen")}">✕</button>` : ""}</span>`).join("");
      const avail = all.filter((x) => !lights.includes(x.id));
      const sigChips = Object.entries(RK_LIGHT_SIGNALS).map(([k, [c, l]]) => `<button class="chip2 ${sigs.includes(k) ? "" : "off"}" style="--c:${c}" data-lsig="${k}" data-entry="${id}" ${editable ? "" : "disabled"}><i></i>${l}</button>`).join("");
      return this._grp("notify", "Lichtsignal", "mdi:lightbulb-on-outline", "air", [
        this._row("Lampen", `<div class="chips">${chips || this._v("keine", true)}</div>`, "blinken 3× in der Farbe des Hinweises, danach wie vorher"),
        editable && avail.length ? `<div class="addrow"><select class="sel" id="addLight-${id}">${avail.map((x) => `<option value="${esc(x.id)}">${esc(x.name)}</option>`).join("")}</select><button class="btn" data-lightadd="${id}" style="--c:var(--rk-air)"><ha-icon icon="mdi:lightbulb-plus-outline"></ha-icon>${t("Lampe hinzufügen")}</button></div>` : "",
        this._row("Blinken bei", `<div class="chips">${sigChips}</div>`, "Blau = lüften · Orange = schließen · Grün = fertig · Rot = Problem"),
        lights.length && this._admin ? this._row("Ausprobieren", `<button class="btn" data-lighttest="${id}" style="--c:var(--rk-air)"><ha-icon icon="mdi:play"></ha-icon>${t("Test")}</button>`) : "",
        `<div class="hint">${t("Nicht in der Ruhezeit, nicht beim Schlafen mit offenem Fenster und nicht, wenn niemand zu Hause ist. Lampen ohne Farbe blinken einfach hell.")}</div>`
      ].join(""));
    },
    // 24-h-Balken: 96 Viertelstunden, Höhe = Anteil der Tage mit Anwesenheit
    _presenceBars(arr) {
      if (!Array.isArray(arr) || !arr.length) return this._v("–", true);
      const cells = arr.map((v) => `<i style="height:${Math.max(8, Math.round(v * 100))}%;opacity:${(0.18 + v * 0.82).toFixed(2)}"></i>`).join("");
      return `<div class="pbars" title="${t("Anteil der Tage mit jemand zu Hause")}">${cells}</div>`;
    },
    _presenceText(arr) {
      if (!Array.isArray(arr) || !arr.length) return "";
      const on = arr.map((v, i) => v >= 0.5 ? i : -1).filter((i) => i >= 0);
      if (!on.length) return t("keine klare Zeit – meist niemand zu Hause");
      const lab = (i) => `${String(Math.floor(i / 4) % 24).padStart(2, "0")}:${String(i % 4 * 15).padStart(2, "0")}`;
      const a = lab(on[0]);
      const b = lab((on[on.length - 1] + 1) % 96);
      return t("meist {a}–{b} jemand zu Hause", { a, b });
    }
  };

  // src/cards/settings/learn.js
  var LearnMethods = {
    // Gelernte Schlafzeiten (Wohnungsebene) – gehört zum Lernen, nicht zu den Einstellrädern.
    // ---------------------------------------------------------------- Lernen (Unterreiter)
    _learnTabs(active, keys) {
      const names = { why: "Warum (nicht)?", overview: "Übersicht", sleep: "Schlafen & Anwesenheit", decisions: "Entscheidungen", how: "So rechnet es" };
      return `<div class="ltabs">${keys.map((k) => `<button class="ltab ${k === active ? "on" : ""}" data-ltab="${k}">${t(names[k])}</button>`).join("")}</div>`;
    },
    // Wohnungsebene: Schlafzeiten, Anwesenheitsprofil, Entscheidungen, Erklärung
    _learnHub(st) {
      const tab = this._ltabHub || "sleep";
      const body = tab === "sleep" ? this._sleepRows(st) : tab === "decisions" ? this._decisions(null) : this._howRows("home");
      return this._grp("learn", t("Lernen & Warum"), "mdi:chart-line", "eco", this._learnTabs(tab, ["sleep", "decisions", "how"]) + body);
    },
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
        this._v([tip.weekday ? tip.weekday.from === tip.weekday.to ? t("ganztägig") : t("{a} bis {b}", { a: tip.weekday.from, b: tip.weekday.to }) : "", tip.weekend ? t("Wochenende ab {a}", { a: tip.weekend.from }) : ""].filter(Boolean).join(" · ")),
        t("Vorheizen beginnt 30 Minuten vorher, Absenken endet mit der Ankunft – so bleibt es beim Wunsch, ohne dass die Heizung leer läuft.")
      ) : this._row(t("Vorschlag"), this._v(t("sammelt noch"), true), t("ab einer erfassten Woche"));
      const profile = head + (hasProfile ? [bars(pp.weekday, "Werktags"), bars(pp.weekend, "Wochenende")].join("") : this._row(t("Anwesenheit am Tag"), this._v(t("sammelt noch"), true), t("wird ab der ersten Woche sichtbar – nur ja/nein, nie wer")));
      return [line("weekday", "Werktags"), line("weekend", "Wochenende"), profile, tipRow].join("");
    },
    // Einrichtungs-Checkliste: was fehlt noch, und wo stellt man es ein
    _checkRows(st, ch) {
      const rooms = this._rooms || [];
      const opts = (r) => r.attrs.settings || {};
      const any = (fn) => rooms.some(fn);
      const first = (fn) => rooms.find(fn);
      const tabTarget = (tab, fn = () => true) => {
        const r = first(fn);
        return r ? `roomtab:${r.id}:${tab}` : "section:rooms";
      };
      const people = (this._hubOpt("residents") || []).length;
      const rec = Object.keys(this._hubOpt("recipients") || {}).length;
      const items = [
        [t("Bewohner hinterlegt"), people > 0, t("Einstellungen → Anwesenheit & Absenkung"), "group:presence:presence"],
        [t("Empfänger für Meldungen"), rec > 0, t("Einstellungen → Wer bekommt was"), "group:notify:notify"],
        [t("Wetterquelle gewählt"), !!this._hubOpt("weather_entity"), t("Einstellungen → Wohnung"), "group:home:home"],
        [t("Raum mit Thermostat"), any((r) => opts(r).trv), t("Raum → Geräte"), tabTarget("devices", (r) => opts(r).trv)],
        [t("Fensterkontakt eingetragen"), any((r) => (opts(r).windows || []).length), t("Raum → Fenster & Lüften"), tabTarget("windows", (r) => (opts(r).windows || []).length)],
        [t("Zeitplan angelegt"), any((r) => (opts(r).schedules || []).length), t("Raum → Zeitplan"), tabTarget("schedule", (r) => (opts(r).schedules || []).length)]
      ];
      const optional = [
        [t("Präsenzmelder eingetragen"), any((r) => (opts(r).presence_sensors || []).length), t("Raum → Anwesenheit im Raum"), tabTarget("presence", (r) => (opts(r).presence_sensors || []).length)],
        [t("Sturmschwelle geprüft"), this._hubOpt("storm_warning") != null, t("Einstellungen → Sturm- und Regenwarnung"), "group:notify:notify"]
      ];
      const done = items.filter((i) => i[1]).length;
      const chip = (on, optionalItem) => `<span class="chip2 ${on ? "" : "off"}" style="--c:var(--rk-${on ? "ok" : optionalItem ? "air" : "warn"})"><i></i>${on ? t("erledigt") : optionalItem ? t("optional") : t("offen")}</span>`;
      const open = (target) => `<button class="mini" data-goto="${target}" title="${t("dorthin springen")}">${t("öffnen")}</button>`;
      const next = items.find((i) => !i[1]) || optional.find((i) => !i[1]);
      const rows = [
        this._row(
          t("{a} von {b} erledigt", { a: done, b: items.length }),
          `<span class="chip2" style="--c:var(--rk-${done === items.length ? "ok" : "warn"})"><i></i>${done === items.length ? t("bereit") : t("noch offen")}</span>${next ? open(next[3]) : ""}`,
          t("die wichtigsten Schritte, damit Raumklima sinnvoll regeln kann")
        ),
        ...items.map(([label, on, where, target]) => this._row(label, `${chip(on, false)}${on ? "" : open(target)}`, where)),
        ...optional.map(([label, on, where, target]) => this._row(label, `${chip(on, true)}${on ? "" : open(target)}`, `${where} · ${t("bringt mehr Genauigkeit, ist aber nicht nötig")}`))
      ];
      return rows.join("");
    },
    // Raum-Ebene: Aufheizrate & Co., Entscheidungen, Erklärung
    _learnRoom(r) {
      const a = r.attrs, s = a.settings || {}, h = s.heatup || {}, id = s.entry_id;
      if (!id || a.monitor) return "";
      const tab = this._ltabRoom || "why";
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
      const body = tab === "why" ? this._whyRows(id) : tab === "overview" ? overview : tab === "decisions" ? this._decisions(id) : this._howRows("room");
      return this._grp("learn", t("Lernen & Warum"), "mdi:chart-line", "eco", this._learnTabs(tab, ["why", "overview", "decisions", "how"]) + body);
    },
    // „Warum heizt der Raum (nicht)?“ – fragt die Integration (raumklima/room/why), nichts wird verändert
    _whyRows(id) {
      this._why = this._why || {};
      const res = this._why[id];
      if (!res || res.loading) {
        if (!res) {
          this._why[id] = { loading: true };
          Promise.resolve().then(() => this._whyFetch(id));
        }
        return `<div class="hint">${t("prüft …")}</div>`;
      }
      if (res.error) return `<div class="hint warn">${esc(res.error)}</div>`;
      if (!res.verdict) return `<div class="hint warn">${t("Keine Antwort – bitte Raumklima aktualisieren und neu starten.")}</div>`;
      const icon = (ok) => `<ha-icon icon="${ok ? "mdi:check-circle" : "mdi:alert-circle"}" style="color:var(${ok ? "--rk-ok" : "--rk-warn"})"></ha-icon>`;
      const state = { wins: [t("bestimmt das Ziel"), "heat"], later: [t("würde greifen – nachrangig"), "eco"], no: [t("greift nicht"), "off"], info: [t("Hinweis"), "warn"] };
      const checks = res.checks.map((c) => this._row(`${icon(c.ok)} ${esc(c.label)}`, this._v(c.text, !c.ok))).join("");
      const rules = res.rules.map((r) => {
        const [label, tone] = state[r.state] || ["", "off"];
        const val = r.target != null && r.state !== "no" ? ` · ${r.on ? `${fmt(r.target)} °C` : t("aus")}` : r.text ? ` · ${esc(r.text)}` : "";
        return `<div class="whyrule ${r.state}"><span class="chip2" style="--c:var(--rk-${tone})"><i></i>${label}</span> <b>${esc(r.label)}</b>${val}</div>`;
      }).join("");
      return `<div class="status"><span class="chip" style="--tone:var(${res.heating ? "--rk-heat" : "--rk-off"})"><ha-icon icon="${res.heating ? "mdi:fire" : "mdi:fire-off"}"></ha-icon>${esc(res.verdict)}</span>
      <button class="btn" data-whyrefresh="${id}" style="--c:var(--rk-eco)"><ha-icon icon="mdi:refresh"></ha-icon>${t("Neu prüfen")}</button>
      <button class="btn" data-goto="roomtab:${id}:control" style="--c:var(--rk-heat)"><ha-icon icon="mdi:thermometer"></ha-icon>${t("Regelung")}</button>
      <button class="btn" data-goto="roomtab:${id}:schedule" style="--c:var(--rk-eco)"><ha-icon icon="mdi:calendar-clock"></ha-icon>${t("Zeitplan")}</button>
      <button class="btn" data-goto="roomtab:${id}:windows" style="--c:var(--rk-air)"><ha-icon icon="mdi:window-open-variant"></ha-icon>${t("Fenster & Lüften")}</button></div>
      ${res.mold_raised ? `<div class="hint warn">${t("Der Schimmelschutz hebt das Ziel gerade an (Feuchte).")}</div>` : ""}
      <div class="sub">${t("Voraussetzungen")}</div>${checks}
      ${res.valve != null ? this._row(t("Ventil"), this._v(`${fmt(res.valve, 0)} %`)) : ""}
      <div class="sub">${t("Regeln – die erste, die greift, bestimmt das Ziel")}</div><div class="whyrules">${rules}</div>`;
    },
    async _whyFetch(id) {
      try {
        this._why[id] = await this._hass.callWS({ type: "raumklima/room/why", entry_id: id });
      } catch (e) {
        this._why[id] = { error: t("Fehler: {e}", { e: e.message || e }) };
      }
      this._sig = null;
      this._render();
    },
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
    },
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
    },
    _decRoomChips() {
      const cur = this._decRoom || "all";
      const list = [["all", t("Alle Räume")], ...this._rooms.map((r) => [r.id, r.name])];
      return list.map(([id, name]) => `<button class="chip2 ${id === cur ? "" : "off"}" data-droom="${esc(id)}">${esc(name)}</button>`).join("");
    },
    _decRow(e) {
      const d = new Date(e.t);
      const sameDay = !isNaN(d.getTime()) && d.toDateString() === (/* @__PURE__ */ new Date()).toDateString();
      const when = isNaN(d.getTime()) ? "" : sameDay ? d.toLocaleTimeString(loc(), { hour: "2-digit", minute: "2-digit" }) : d.toLocaleString(loc(), { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
      const many = e.n > 1 ? ` ×${e.n}` : "";
      const why = e.why ? `<small>${esc(e.why)}</small>` : "";
      const extra = [e.room ? esc(e.room) : "", e.data ? esc(Object.entries(e.data).map(([k, v]) => `${k}: ${v}`).join(" · ")) : ""].filter(Boolean).join(" · ");
      return `<details class="dec"><summary><span class="wtime">${esc(when)}</span><span class="dl"><b>${esc(e.msg)}${many}</b>${why}</span></summary>
      <div class="dfull">${e.why ? `<p>${esc(e.why)}</p>` : ""}${extra ? `<p class="ddata">${extra}</p>` : ""}</div></details>`;
    },
    _paintDec(box, list) {
      box.innerHTML = list.length ? list.map((e) => this._decRow(e)).join("") : `<div class="hint">${t("Keine Entscheidungen in diesem Zeitraum.")}</div>`;
      const kpi = this.shadowRoot.querySelector("[data-dkpi]");
      if (!kpi) return;
      const sets = list.filter((e) => e.cat === "target").length;
      const air = list.filter((e) => e.cat === "window").length;
      kpi.innerHTML = [[String(list.length), t("Entscheidungen")], [`${sets}×`, t("Ziel geändert")], [`${air}×`, t("Lüften")]].map(([b, s]) => `<div class="dkpi"><b>${b}</b><span>${s}</span></div>`).join("");
    },
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
  };

  // src/cards/settings/bind_general.js
  var BindGeneralMethods = {
    _bindGeneral(k) {
      const { on, $, ws, apply, sp, roomList, mailSettings, roomLights, roomPres } = k;
      on("click", "[data-tab]", (el) => () => {
        this._onboardLeave();
        this._tab = el.dataset.tab;
        this._search = "";
        if (this._nav2) {
          this._section = "rooms";
          this._group = null;
        }
        this._sig = null;
        this._render();
      });
      on("click", "[data-section]", (el) => () => {
        this._onboardLeave();
        this._section = el.dataset.section;
        this._search = "";
        if (this._section === "rooms") this._tab = "general";
        this._group = null;
        try {
          localStorage.setItem("raumklima-settings-section", this._section);
        } catch (e) {
        }
        this._sig = null;
        this._render();
      });
      on("click", "[data-nav2]", () => {
        this._onboardLeave();
        this._nav2 = !this._nav2;
        this._group = null;
        try {
          localStorage.setItem("raumklima-settings-nav-v2", this._nav2 ? "1" : "0");
        } catch (e) {
        }
        this._sig = null;
        this._render();
      });
      on("click", "[data-roomtab]", (el) => () => {
        this._onboardLeave();
        this._roomTab = el.dataset.roomtab;
        this._sig = null;
        this._render();
      });
      on("click", "[data-goto]", (el) => () => this._goto(el.dataset.goto));
      on("click", "[data-goto-room]", (el) => () => this._gotoRoomByEntry(el.dataset.gotoRoom));
      on("keydown", "[data-goto-room]", (el) => (ev) => {
        if (ev.key !== "Enter" && ev.key !== " ") return;
        ev.preventDefault();
        this._gotoRoomByEntry(el.dataset.gotoRoom);
      });
      on("click", "[data-applyall]", (el) => () => {
        this._applyToAllRooms(el.dataset.applyall);
      });
      on("click", "[data-roomboost]", (el) => () => {
        const mode = el.dataset.roomboost === "off" ? "off" : "minutes";
        const minutes = Number(el.dataset.min || 0);
        const payload = { type: "raumklima/boost", entry_id: el.dataset.entry, mode };
        if (mode === "minutes" && minutes > 0) payload.minutes = minutes;
        this._hass.callWS(payload).then(() => {
          this._flash(t("Schnell-Override gesetzt"));
          this._render();
        }).catch((e) => this._flash(t("Fehler: {e}", { e: e.message || e })));
      });
      on("click", "[data-copyroom]", (el) => () => {
        this._copyRoom = el.dataset.copyroom;
        this._sig = null;
        this._render();
      });
      on("click", "[data-copyroom-close]", () => () => {
        this._copyRoom = null;
        this._sig = null;
        this._render();
      });
      on("click", "[data-copyroom-go]", (el) => () => {
        this._copyRoomGo(el.dataset.copyroomGo);
      });
      on("click", "[data-template-save]", (el) => () => {
        this._saveRoomTemplate(el.dataset.templateSave);
      });
      on("click", "[data-template-apply]", (el) => () => {
        this._applyRoomTemplate(el.dataset.templateApply);
      });
      on("click", "[data-template-delete]", (el) => () => {
        this._deleteRoomTemplate(el.dataset.templateDelete);
      });
      on("click", ".railbtn", (el) => () => {
        if (el.dataset.section) return;
        this._group = el.dataset.g;
        this._filter();
      });
      on("click", "[data-lmove]", (el) => () => {
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
      });
      on("click", "[data-lsize]", (el) => () => {
        const L = this._layout;
        this._layout = { ...L, size: { ...L.size || {}, [el.dataset.lsize]: el.dataset.v } };
        this._layoutSave();
        this._sig = null;
        this._render();
      });
      on("click", "[data-lcolor]", (el) => () => {
        const L = this._layout;
        this._layout = { ...L, color: { ...L.color || {}, [el.dataset.lcolor]: el.dataset.v } };
        this._layoutSave();
        this._sig = null;
        this._render();
      });
      on("click", "[data-lsave]", (el) => () => this._layoutSave());
      on("click", "[data-lpanel]", (el) => () => {
        this._layout = { ...this._layout, beta_panel: el.dataset.lpanel === "true" };
        this._layoutSave();
        this._sig = null;
        this._render();
      });
      on("click", "[data-lfloors]", (el) => () => {
        this._layout = { ...this._layout, beta_floors: el.dataset.lfloors === "true" };
        this._layoutSave();
        this._sig = null;
        this._render();
      });
      on("click", "[data-resetroom]", (el) => () => {
        if (!window.confirm(t("Alle Einstellungen dieses Raums auf Standard zurücksetzen? Geräte und Wohnung bleiben erhalten."))) return;
        ws({ type: "raumklima/room/reset", entry_id: el.dataset.resetroom }).then(() => this._flash(t("Auf Standard zurückgesetzt"))).catch(() => {
        });
      });
      on("click", "details.more > summary", (el) => () => {
        const d = el.parentElement;
        this._moreOpen.set(d.dataset.more, !d.open);
        d.dataset.open = d.open ? "0" : "1";
      });
      on("click", "details.eguide > summary", (el) => () => {
        const d = el.parentElement;
        this._guideOpen = this._guideOpen || /* @__PURE__ */ new Set();
        if (d.open) this._guideOpen.delete(d.dataset.guide);
        else this._guideOpen.add(d.dataset.guide);
      });
      on("click", "details.sched-collapse > summary", (el) => () => {
        const d = el.parentElement;
        this._schedOpen = this._schedOpen || /* @__PURE__ */ new Map();
        this._schedOpen.set(d.dataset.schedcollapse, !d.open);
      });
      on("click", "[data-pro]", (el) => () => {
        this._pro = !this._pro;
        this._moreOpen.clear();
        try {
          localStorage.setItem("raumklima-settings-pro", this._pro ? "1" : "0");
        } catch (e) {
        }
        this._render();
      });
      const search = this.shadowRoot.querySelector("#rks");
      if (search) search.addEventListener("input", () => {
        this._search = search.value;
        const body = this.shadowRoot.getElementById("rkbody");
        if (body) {
          body.innerHTML = this._bodyHtml();
          this._filter();
        } else this._filter();
      });
      on("click", "[data-tgl]", (el) => () => this._hass.callService("switch", "toggle", { entity_id: el.dataset.tgl }));
      on("click", "[data-press]", (el) => () => this._hass.callService("button", "press", { entity_id: el.dataset.press }));
      on("click", "[data-num]", (el) => () => {
        const s = this._st(el.dataset.num);
        if (!s) return;
        const step = parseFloat(s.attributes.step) || 1;
        const min = parseFloat(s.attributes.min), max = parseFloat(s.attributes.max);
        let v = Math.round((parseFloat(s.state) + step * parseInt(el.dataset.d, 10)) * 100) / 100;
        if (!isNaN(min)) v = Math.max(min, v);
        if (!isNaN(max)) v = Math.min(max, v);
        this._hass.callService("number", "set_value", { entity_id: el.dataset.num, value: v });
      });
      on("click", "[data-opt]", (el) => () => {
        const step = parseFloat(el.dataset.step), min = parseFloat(el.dataset.min), max = parseFloat(el.dataset.max);
        const cur = parseFloat(el.dataset.val);
        let v = Math.round(((isNaN(cur) ? min : cur) + step * parseInt(el.dataset.d, 10)) * 100) / 100;
        v = Math.min(max, Math.max(min, v));
        apply(el.dataset.opt, { [el.dataset.key]: v });
      });
      on("click", "[data-setopt]", (el) => () => apply(el.dataset.setopt, { [el.dataset.key]: parseFloat(el.dataset.v) }));
      on("click", "[data-optbool]", (el) => () => apply(el.dataset.optbool, { [el.dataset.key]: el.dataset.val !== "1" }));
      on("click", ".stepper span", (span) => () => {
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
      });
    }
  };

  // src/cards/settings/bind_schedule.js
  var BindScheduleMethods = {
    _bindSchedule(k) {
      const { on, $, ws, apply, sp, roomList, mailSettings, roomLights, roomPres } = k;
      on("click", "[data-roomperson]", (el) => () => {
        const entry = el.dataset.entry;
        const cur = roomList(entry, "room_persons", []);
        const next = cur.includes(el.dataset.roomperson) ? cur.filter((x) => x !== el.dataset.roomperson) : [...cur, el.dataset.roomperson];
        this._setRoom(entry, { room_persons: next }, 300);
      });
      on("change", "[data-roompersonadd]", (el) => () => {
        const entry = el.dataset.roompersonadd;
        const value = el.value;
        if (!value) return;
        const cur = roomList(entry, "room_persons", []);
        if (!cur.includes(value)) this._setRoom(entry, { room_persons: [...cur, value] }, 300);
        el.blur();
      });
      on("click", "[data-guestroom]", (el) => () => {
        const rid = el.dataset.guestroom;
        const cur = [...this._hubOpt("guests_rooms") || []];
        const next = cur.includes(rid) ? cur.filter((x) => x !== rid) : [...cur, rid];
        this._local = this._local || {};
        this._local["hub:guests_rooms"] = next;
        this._setHub({ guests_rooms: next }, 300);
        this._flash(t("Gespeichert"));
      });
      on("click", "[data-haenergy]", () => () => {
        const items = (this._haSug && this._haSug.items || []).filter((x) => x.empty);
        const changes = {};
        for (const x of items) {
          const cur = this._hubOpt(x.key);
          if (cur === void 0 || cur === null || cur === "" || cur === 0) changes[x.key] = x.value;
        }
        if (!Object.keys(changes).length) return;
        this._haSug = void 0;
        this._setHub(changes, 100);
        this._flash(t("Übernommen"));
      });
      on("click", "[data-tarfb]", (el) => () => {
        const id = el.dataset.tarfb;
        const cur = [...this._hubOpt("energy_tariff_fallbacks") || []];
        const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
        this._local = this._local || {};
        this._local["hub:energy_tariff_fallbacks"] = next;
        this._setHub({ energy_tariff_fallbacks: next }, 300);
        this._flash(t("Gespeichert"));
      });
      on("click", "[data-workzone]", (el) => () => {
        const zid = el.dataset.workzone;
        const cur = [...this._hubOpt("work_zones") || []];
        const next = cur.includes(zid) ? cur.filter((x) => x !== zid) : [...cur, zid];
        this._local = this._local || {};
        this._local["hub:work_zones"] = next;
        this._setHub({ work_zones: next }, 300);
        this._flash(t("Gespeichert"));
      });
      on("click", "[data-horoom]", (el) => () => {
        const rid = el.dataset.horoom;
        const cur = [...this._hubOpt("home_office_rooms") || []];
        const next = cur.includes(rid) ? cur.filter((x) => x !== rid) : [...cur, rid];
        this._local = this._local || {};
        this._local["hub:home_office_rooms"] = next;
        this._setHub({ home_office_rooms: next }, 300);
        this._flash(t("Gespeichert"));
      });
      on("click", "[data-airadd]", (el) => () => {
        const id = el.dataset.airadd;
        const list = this._airList(id, []);
        if (list.length >= 6) return;
        list.push({ days: [], start: "04:45", end: "06:30" });
        this._pushAir(id);
      });
      on("click", "[data-airdel]", (el) => () => {
        const [id, i] = String(el.dataset.airdel).split("|");
        this._airList(id, []).splice(parseInt(i, 10), 1);
        this._pushAir(id);
      });
      on("click", "[data-airday]", (el) => () => {
        const [id, i, d] = String(el.dataset.airday).split("|");
        const w = this._airList(id, [])[parseInt(i, 10)];
        if (!w) return;
        const day = parseInt(d, 10);
        w.days = w.days.includes(day) ? w.days.filter((x) => x !== day) : [...w.days, day].sort((a, b) => a - b);
        this._pushAir(id);
      });
      on("click", "[data-schedadd]", (el) => () => {
        const id = el.dataset.schedadd;
        const list = this._schedList(id, this._schedSeed(id) || []);
        const room = (this._rooms || []).find((x) => (x.attrs.settings || {}).entry_id === id);
        const base = room ? this._roomOpt(room, "comfort_temperature") ?? (room.attrs.settings || {}).comfort_temperature ?? 22 : 22;
        const first = list.length === 0;
        list.push({ days: [], start: "19:00", end: "21:00", temperature: Math.round(base * 2) / 2, sources: [] });
        this._pushSched(id);
        const st = room && room.attrs.settings || {};
        if (first && room && !(st.changed || []).includes("schedule_fallback") && this._roomOpt(room, "schedule_fallback") === void 0) {
          this._setRoom(id, { schedule_fallback: "short" }, 700);
        }
      });
      on("click", "[data-schedsrc]", (el) => () => {
        const [id, i, sid] = sp(el.dataset.schedsrc);
        const w = this._schedList(id, this._schedSeed(id) || [])[parseInt(i, 10)];
        if (!w) return;
        const room = (this._rooms || []).find((x) => (x.attrs.settings || {}).entry_id === id);
        const sources = (room && room.attrs.heat_sources || []).filter((x) => !x.untouched);
        const ids = sources.map((x) => x.id);
        const chosen = w.sources && w.sources.length ? [...w.sources] : [...ids];
        w.sources = chosen.includes(sid) ? chosen.filter((x) => x !== sid) : [...chosen, sid];
        if (w.sources.length === ids.length) w.sources = [];
        this._pushSched(id);
      });
      on("click", "[data-scheddel]", (el) => () => {
        const [id, i] = sp(el.dataset.scheddel);
        this._schedList(id, this._schedSeed(id) || []).splice(parseInt(i, 10), 1);
        this._pushSched(id);
      });
      on("click", "[data-schedday]", (el) => () => {
        const [id, i, d] = sp(el.dataset.schedday);
        const w = this._schedList(id, this._schedSeed(id) || [])[parseInt(i, 10)];
        if (!w) return;
        const day = parseInt(d, 10);
        w.days = w.days.includes(day) ? w.days.filter((x) => x !== day) : [...w.days, day].sort((a, b) => a - b);
        this._pushSched(id);
      });
      on("click", "[data-schedmove]", (el) => () => {
        const [id, i, dir] = sp(el.dataset.schedmove);
        const list = this._schedList(id, this._schedSeed(id) || []);
        const a = parseInt(i, 10);
        const b = a + parseInt(dir, 10);
        if (a < 0 || b < 0 || a >= list.length || b >= list.length) return;
        [list[a], list[b]] = [list[b], list[a]];
        this._pushSched(id);
      });
      on("click", "[data-schedsort]", (el) => async () => {
        const id = el.dataset.schedsort;
        const list = this._schedList(id, this._schedSeed(id) || []);
        list.sort((x, y) => {
          const a = rkSchedSortKey(x);
          const b = rkSchedSortKey(y);
          return a[0] - b[0] || a[1] - b[1] || a[2].localeCompare(b[2]);
        });
        this._flash(t("Zeitfenster nach Uhrzeit sortiert"));
        this._pushSched(id);
      });
      on("click", "[data-schedtemp]", (el) => () => {
        const [id, i] = sp(el.dataset.schedtemp);
        const w = this._schedList(id, this._schedSeed(id) || [])[parseInt(i, 10)];
        if (!w) return;
        const v = Math.round((w.temperature + 0.5 * parseInt(el.dataset.d, 10)) * 2) / 2;
        w.temperature = Math.min(30, Math.max(5, v));
        this._pushSched(id);
      });
      on("change", "[data-srcfield]", (el) => () => {
        const [id, idx, field] = el.dataset.srcfield.split("|");
        const list = this._srcList(id);
        const item = list[parseInt(idx, 10)];
        if (!item) return;
        item[field] = el.value;
        this._setRoom(id, { heat_sources: list }, 700);
      });
      on("click", "[data-srcstep]", (el) => () => {
        const [id, idx, delta] = el.dataset.srcstep.split("|");
        const list = this._srcList(id);
        const item = list[parseInt(idx, 10)];
        if (!item) return;
        item.offset = Math.max(-5, Math.min(5, Math.round(((Number(item.offset) || 0) + Number(delta)) * 2) / 2));
        this._setRoom(id, { heat_sources: list }, 700);
      });
      on("click", "[data-srcuntouched]", (el) => () => {
        const [id, idx] = el.dataset.srcuntouched.split("|");
        const list = this._srcList(id);
        const item = list[parseInt(idx, 10)];
        if (!item) return;
        item.untouched = !item.untouched;
        this._setRoom(id, { heat_sources: list }, 700);
      });
      on("click", "[data-srcdel]", (el) => () => {
        const [id, idx] = el.dataset.srcdel.split("|");
        const list = this._srcList(id);
        list.splice(parseInt(idx, 10), 1);
        this._setRoom(id, { heat_sources: list }, 700);
      });
      on("click", "[data-srcadd]", (el) => () => {
        const id = el.dataset.srcadd;
        const sel = this._addSelect(el);
        const entity = sel ? sel.value : "";
        if (!entity) {
          this._flash(t("Bitte zuerst eine Quelle auswählen"));
          return;
        }
        const st = this._st(entity);
        const modes = st && st.attributes && st.attributes.hvac_modes || [];
        const type = modes.includes("cool") || modes.includes("fan_only") ? "ac" : "trv";
        const choice = (this._cfg && this._cfg.choices && this._cfg.choices.climate || []).find((x) => x.id === entity) || {};
        const list = this._srcList(id);
        list.push({ id: `src${Date.now()}`, entity, name: choice.name || this._name(entity), type, offset: 0, trigger: "", untouched: false });
        this._setRoom(id, { heat_sources: list }, 700);
      });
      on("click", "[data-seg]", (el) => () => apply(el.dataset.seg, { [el.dataset.key]: el.dataset.val }));
      on("input", "[data-selsearch]", (el) => () => {
        const wrap = el.closest("[data-selwrap]");
        const sel = wrap && wrap.querySelector("select");
        if (!sel) return;
        if (!sel._rkOptions) {
          sel._rkOptions = [...sel.options].map((o) => ({ value: o.value, text: o.textContent }));
        }
        const q = el.value.trim().toLowerCase();
        const current = sel.value;
        sel.innerHTML = sel._rkOptions.filter((o) => !q || o.text.toLowerCase().includes(q) || o.value.toLowerCase().includes(q)).map((o) => `<option value="${esc(o.value)}">${esc(o.text)}</option>`).join("");
        if ([...sel.options].some((o) => o.value === current)) sel.value = current;
      });
      on("change", "[data-sel]", (el) => () => {
        el.blur();
        apply(el.dataset.sel, { [el.dataset.key]: el.value || null });
      });
      on("change", "[data-planmap]", (el) => () => {
        el.blur();
        let map = {};
        try {
          map = JSON.parse(el.dataset.cur || "{}");
        } catch (e) {
          map = {};
        }
        if (el.value) map[el.dataset.planmap] = el.value;
        else delete map[el.dataset.planmap];
        apply(el.dataset.scope, { schedule_by_plan: map });
      });
      on("change", ".addrow select", (el) => () => el.blur());
      on("change", "[data-md]", (el) => () => {
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
      });
    }
  };

  // src/cards/settings/bind_hub.js
  var BindHubMethods = {
    _bindHub(k) {
      const { on, $, ws, apply, sp, roomList, mailSettings, roomLights, roomPres } = k;
      on("click", "[data-ltab]", (el) => () => {
        if (this._tab === "general") this._ltabHub = el.dataset.ltab;
        else this._ltabRoom = el.dataset.ltab;
        this._dec = {};
        this._render();
      });
      on("click", "[data-whyrefresh]", (el) => () => {
        this._why = this._why || {};
        delete this._why[el.dataset.whyrefresh];
        this._render();
      });
      on("click", "[data-drange]", (el) => () => {
        this._decRange = Number(el.dataset.drange);
        this._dec = {};
        this._render();
      });
      on("click", "[data-dcat]", (el) => () => {
        this._decCat = el.dataset.dcat;
        this._dec = {};
        this._render();
      });
      on("click", "[data-droom]", (el) => () => {
        this._decRoom = el.dataset.droom;
        this._dec = {};
        this._render();
      });
      on("click", "[data-timeopen]", (el) => () => this._openTime(el.dataset.timeopen, el.dataset.val));
      const tpop = this.shadowRoot.querySelector("[data-tpick]");
      if (tpop) {
        let tid = 0;
        ["[data-twh]", "[data-twmn]"].forEach((sel) => tpop.querySelector(sel).addEventListener("scroll", () => {
          clearTimeout(tid);
          tid = setTimeout(() => this._timeSync(tpop), 90);
        }));
        tpop.querySelectorAll("[data-th], [data-tm]").forEach((b) => b.addEventListener("click", () => {
          const wheel = b.parentElement;
          const i = Number(b.dataset.th ?? b.dataset.tm);
          if (wheel.scrollTo) wheel.scrollTo({ top: i * 40, behavior: "smooth" });
          else wheel.scrollTop = i * 40;
        }));
        tpop.querySelector("[data-tclose]").addEventListener("click", () => {
          tpop.hidden = true;
          if (this._tp) this._tp.open = false;
        });
        tpop.querySelector("[data-tok]").addEventListener("click", () => {
          const v = rkTimeValue(tpop.querySelector("[data-tin]").value);
          if (!v) {
            this._flash(t("Bitte Uhrzeit als HH:MM eingeben"));
            return;
          }
          const key = this._tp && this._tp.key;
          tpop.hidden = true;
          if (this._tp) this._tp.open = false;
          if (!key) return;
          if (/^(sched|air):/.test(key)) this._setWinTime(key, v);
          else this._setHub({ [key]: v + ":00" }, 200);
        });
        tpop.querySelector("[data-tin]").addEventListener("input", (ev) => {
          if (this._tp) this._tp.text = ev.target.value;
          const v = rkTimeValue(ev.target.value);
          if (!v) return;
          const [h, m] = v.split(":");
          const hh = Math.max(0, Math.min(23, parseInt(h, 10) || 0));
          const mm = Math.max(0, Math.min(3, Math.round((parseInt(m, 10) || 0) / 15)));
          if (this._tp) {
            this._tp.h = hh;
            this._tp.m = mm;
            this._tp.text = ev.target.value;
          }
          tpop.querySelector("[data-twh]").scrollTop = hh * 40;
          tpop.querySelector("[data-twmn]").scrollTop = mm * 40;
        });
      }
      on("change", "[data-time]", (el) => () => {
        const key = el.dataset.time;
        const v = rkTimeValue(el.value);
        if (!v) {
          this._flash(t("Bitte Uhrzeit als HH:MM eingeben"));
          el.value = String(this._hubOpt(key) || "").slice(0, 5);
          return;
        }
        el.value = v;
        this._setHub({ [key]: v + ":00" }, 200);
      });
      on("click", "[data-allpersons]", (el) => () => {
        this._allPersons = el.dataset.allpersons === "1";
        this._sig = null;
        this._render();
      });
      on("click", "[data-person]", (el) => () => {
        const list = [...this._hubOpt("residents") || []];
        const i = list.indexOf(el.dataset.person);
        if (i >= 0) list.splice(i, 1);
        else list.push(el.dataset.person);
        this._setHub({ residents: list });
      });
      on("click", "[data-home]", (el) => () => {
        this._home = el.dataset.home;
        this._tab = "general";
        this._local = {};
        this._sig = null;
        this._load();
      });
      on("change", "[data-hubnum]", (el) => () => {
        const v = el.value.trim() === "" ? null : Math.max(0, Math.min(2e4, parseFloat(el.value.replace(",", "."))));
        this._setHub({ [el.dataset.hubnum]: Number.isNaN(v) ? null : v }, 200);
      });
      on("change", "[data-hubtext]", (el) => () => this._setHub({ [el.dataset.hubtext]: el.value.trim() }, 200));
      on("click", "[data-geohass]", (el) => () => {
        const c = this._hass.config || {};
        this._setHub({ latitude: c.latitude, longitude: c.longitude }, 200);
      });
      on("click", "[data-geoclear]", (el) => () => this._setHub({ latitude: null, longitude: null }, 200));
      on("change", "[data-hubgeo]", (el) => () => {
        const key = el.dataset.hubgeo;
        const limit = key === "latitude" ? 90 : 180;
        const raw = el.value.trim().replace(",", ".");
        const v = raw === "" ? null : Math.max(-limit, Math.min(limit, parseFloat(raw)));
        this._setHub({ [key]: Number.isNaN(v) ? null : v }, 200);
      });
      on("click", "[data-mkdash]", (el) => async () => {
        const p = el.dataset.mkdash;
        const made = await this._ensureDashboard(p, this._hubOpt("name") || p, this._cfg.hub.entry_id);
        this._flash(made ? t("Dashboard „{d}“ angelegt", { d: made }) : t("Anlegen nicht möglich – bitte in den Einstellungen unter Dashboards prüfen"));
        if (made) {
          await this._load();
        } else {
          this._render();
        }
      });
      on("click", "[data-deleteroom]", (el) => () => this._deleteRoom(el.dataset.deleteroom));
      on("change", '[data-onb="trv"]', () => () => {
        this._onboardCollect();
        this._render();
      });
      on("change", '[data-onb="heat_type"]', () => () => {
        this._onboardCollect();
        if (this._onboard && this._onboard.data.heat_type === "monitor") this._onboard.data.extra_trvs = [];
        this._render();
      });
      on("click", "[data-onboard]", () => () => this._onboardStart());
      on("click", "[data-onbnext]", () => () => this._onboardNext(1));
      on("click", "[data-onbback]", () => () => this._onboardNext(-1));
      on("click", "[data-onbclose]", () => () => this._onboardClose());
      on("click", "[data-onbfinish]", () => () => this._onboardFinish());
      on("click", "[data-onbaddbtn]", (el) => () => {
        const sel = this.shadowRoot.querySelector(`[data-onbadd="${el.dataset.onbaddbtn}"]`);
        if (sel && sel.value) this._onboardAdd(el.dataset.onbaddbtn, sel.value);
      });
      on("click", "[data-onbrm]", (el) => () => {
        const [key, value] = el.dataset.onbrm.split("|");
        this._onboardRemove(key, value);
      });
      on("click", '[data-onbtype="toggle"]', (el) => () => {
        el.classList.toggle("on");
        el.dataset.val = el.classList.contains("on") ? "1" : "0";
        this._onboardCollect();
        this._render();
      });
      on("click", "[data-newhome]", (el) => async () => {
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
      });
    }
  };

  // src/cards/settings/bind_notify.js
  var BindNotifyMethods = {
    _bindNotify(k) {
      const { on, $, ws, apply, sp, roomList, mailSettings, roomLights, roomPres } = k;
      const mailbox = this.shadowRoot.querySelector("[data-mailbox]");
      if (mailbox) mailbox.addEventListener("toggle", () => {
        this._mailOpen = mailbox.open;
      });
      on("input", "[data-mail]", (el) => () => {
        this._mailForm = { ...this._mailForm || {}, [el.dataset.mail]: el.value };
      });
      on("click", "[data-mailprov]", (el) => () => {
        const p = RK_MAIL_PROVIDERS[el.dataset.mailprov];
        this.shadowRoot.querySelectorAll("[data-mailprov]").forEach((b) => b.classList.toggle("on", b === el));
        if (!p) return;
        this._mailForm = { ...this._mailForm || {}, mail_server: p[0], mail_port: String(p[1]), mail_security: p[2] };
        for (const [k2, v] of Object.entries({ mail_server: p[0], mail_port: p[1] })) {
          const inp = this.shadowRoot.querySelector(`[data-mail="${k2}"]`);
          if (inp) inp.value = v;
        }
        this.shadowRoot.querySelectorAll("[data-mailsec]").forEach((b) => b.classList.toggle("on", b.dataset.mailsec === p[2]));
      });
      on("click", "[data-mailauth]", (el) => () => {
        this._mailForm = { ...this._mailForm || {}, mail_auth: el.dataset.mailauth === "true" };
        this._sig = null;
        this._render();
      });
      on("click", "[data-mailsec]", (el) => () => {
        this._mailForm = { ...this._mailForm || {}, mail_security: el.dataset.mailsec };
        this.shadowRoot.querySelectorAll("[data-mailsec]").forEach((b) => b.classList.toggle("on", b === el));
      });
      on("click", "[data-mailtoggle]", (el) => () => {
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
      });
      on("click", "[data-mailcheck]", (el) => async () => {
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
      });
      on("click", "[data-mailsave]", (el) => async () => {
        this._mailSteps = null;
        const f = { ...this._mailForm || {} };
        const changes = { report_email: "raumklima" };
        for (const k2 of ["mail_server", "mail_port", "mail_security", "mail_auth", "mail_user", "mail_password", "mail_from", "mail_to"]) {
          if (f[k2] === void 0) continue;
          changes[k2] = k2 === "mail_auth" ? f[k2] !== false : k2 === "mail_port" ? f[k2] === "" ? null : parseInt(f[k2], 10) : String(f[k2]).trim();
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
      });
      on("click", "[data-help]", (el) => (ev) => {
        ev.stopPropagation();
        const k2 = el.dataset.help;
        if (this._helpOpen.has(k2)) this._helpOpen.delete(k2);
        else this._helpOpen.add(k2);
        this._sig = null;
        this._render();
      });
      on("click", "[data-rpdf]", (el) => () => {
        const list = [...this._hubOpt("report_pdf") ?? ["week", "month", "season"]];
        const i = list.indexOf(el.dataset.rpdf);
        if (i >= 0) list.splice(i, 1);
        else list.push(el.dataset.rpdf);
        this._setHub({ report_pdf: list });
      });
      on("click", "[data-pdftest]", (el) => async () => {
        el.disabled = true;
        const r = await ws({ type: "raumklima/report/pdf/create", kind: "week", send: true, ...this._homeMsg() });
        el.disabled = false;
        if (r) this._flash(t("Bericht gesendet: {f}", { f: r.file }));
      });
      on("click", "[data-presrm]", (el) => () => {
        this._setRoom(el.dataset.entry, { presence_sensors: roomPres(el.dataset.entry).filter((x) => x !== el.dataset.presrm) }, 200);
      });
      on("click", "[data-presadd]", (el) => () => {
        const sel = this._addSelect(el);
        if (sel && sel.value) this._setRoom(el.dataset.presadd, { presence_sensors: [...roomPres(el.dataset.presadd), sel.value] }, 200);
      });
      on("click", "[data-plightadd]", (el) => () => {
        const sel = this._addSelect(el);
        if (sel && sel.value) this._setRoom(el.dataset.plightadd, { presence_lights: [...roomLights(el.dataset.plightadd), sel.value] }, 200);
      });
      on("click", "[data-plightrm]", (el) => () => {
        this._setRoom(el.dataset.entry, { presence_lights: roomLights(el.dataset.entry).filter((e) => e !== el.dataset.plightrm) }, 200);
      });
      on("click", "[data-lightrm]", (el) => () => {
        this._setRoom(el.dataset.entry, { signal_lights: roomList(el.dataset.entry, "signal_lights", []).filter((x) => x !== el.dataset.lightrm) }, 200);
      });
      on("click", "[data-lightadd]", (el) => () => {
        const sel = this._addSelect(el);
        if (sel && sel.value) this._setRoom(el.dataset.lightadd, { signal_lights: [...roomList(el.dataset.lightadd, "signal_lights", []), sel.value] }, 200);
      });
      on("click", "[data-lsig]", (el) => () => {
        const list = roomList(el.dataset.entry, "light_signals", ["open", "close"]);
        const i = list.indexOf(el.dataset.lsig);
        if (i >= 0) list.splice(i, 1);
        else list.push(el.dataset.lsig);
        this._setRoom(el.dataset.entry, { light_signals: list }, 600);
      });
      on("click", "[data-lighttest]", (el) => async () => {
        const r = await ws({ type: "raumklima/room/light_test", entry_id: el.dataset.lighttest });
        if (r) this._flash("Lampen blinken blau");
      });
      on("click", "[data-sigrm]", (el) => () => {
        this._setHub({ sleep_signals: (this._hubOpt("sleep_signals") || []).filter((x) => x !== el.dataset.sigrm) });
      });
      on("click", "[data-sigadd]", (el) => () => {
        const sel = this._addSelect(el);
        if (sel && sel.value) this._setHub({ sleep_signals: [...this._hubOpt("sleep_signals") || [], sel.value] });
      });
      on("click", "[data-kind]", (el) => () => {
        const key = el.dataset.ch === "tts" ? "tts" : "recipients";
        const table = JSON.parse(JSON.stringify(this._hubOpt(key) || {}));
        const list = table[el.dataset.target] || [];
        const i = list.indexOf(el.dataset.kind);
        if (i >= 0) list.splice(i, 1);
        else list.push(el.dataset.kind);
        table[el.dataset.target] = list;
        this._setHub({ [key]: table });
      });
      on("click", "[data-remove]", (el) => () => {
        const key = el.dataset.ch === "tts" ? "tts" : "recipients";
        const table = JSON.parse(JSON.stringify(this._hubOpt(key) || {}));
        delete table[el.dataset.remove];
        this._setHub({ [key]: table }, 100);
      });
      on("click", "[data-recipient-home]", (el) => async () => {
        if (!this._admin) return;
        const homeId = el.dataset.homeId;
        const home = (this._cfg.homes || []).find((h) => h.entry_id === homeId);
        if (!home) return;
        const target = el.dataset.recipientHome;
        const table = JSON.parse(JSON.stringify(home.recipients || {}));
        if (Object.prototype.hasOwnProperty.call(table, target)) {
          delete table[target];
        } else {
          const known = (this._cfg.homes || []).map((h) => (h.recipients || {})[target]).find((list) => Array.isArray(list) && list.length);
          table[target] = known ? [...known] : [...RK_DEFAULT_PUSH];
        }
        await this._setHubAt(homeId, { recipients: table });
      });
      on("click", "[data-add]", (el) => () => {
        const sel = this.shadowRoot.getElementById("addTarget");
        if (!sel || !sel.value) return;
        const key = el.dataset.add === "tts" ? "tts" : "recipients";
        const table = JSON.parse(JSON.stringify(this._hubOpt(key) || {}));
        table[sel.value] = el.dataset.add === "tts" ? ["too_cold"] : [...RK_DEFAULT_PUSH];
        this._setHub({ [key]: table }, 100);
      });
      on("click", "[data-test]", (el) => async () => {
        const r = await ws({ type: "raumklima/notify/test", target: el.dataset.test, ...this._homeMsg() });
        if (r) this._flash(t("Testnachricht an {n} gesendet", { n: rkPretty(el.dataset.test) }));
      });
      on("click", "[data-selftest]", () => () => {
        this._hass.callWS({ type: "raumklima/self_test", ...this._homeMsg() }).then((res) => {
          const text = (res && res.checks || []).map((c) => `${c.ok ? "✓" : "✕"} ${t(c.label)}: ${c.text}`).join("\n");
          this._openSheet({ title: t("Selbsttest"), intro: t("Die Prüfung ist nur lesend. Bei Fehlern steht der betroffene Raum oder die Entität dabei."), text: text || t("Keine Prüfungen") });
        }).catch((e) => this._flash(t("Fehler: {e}", { e: e.message || e })));
      });
      on("click", "[data-diag]", (el) => () => {
        this._trace("click", { what: "diagnose" });
        this._downloadDiagnostics();
      });
      on("click", "[data-backup]", (el) => () => {
        this._trace("click", { what: "sichern" });
        this._backupExport();
      });
      const restoreInput = this.shadowRoot.getElementById("rkrestore");
      on("click", "[data-restore]", (el) => () => restoreInput?.click());
      if (restoreInput) restoreInput.addEventListener("change", async () => {
        const file = restoreInput.files && restoreInput.files[0];
        if (file) await this._backupImport(file);
        restoreInput.value = "";
      });
      on("click", "[data-bug]", (el) => () => {
        this._trace("click", { what: "bug" });
        this._openBugReport();
      });
      $("[data-sheet-close]").forEach(
        (el) => el.addEventListener("click", (ev) => {
          if (ev.target !== el || el.classList.contains("sheet")) return;
          this._closeSheet();
        })
      );
      on("click", "[data-sheet-copy]", (el) => () => {
        this._trace("sheet:copy");
        this._sheetCopy();
      });
      on("click", "[data-sheet-share]", (el) => () => {
        this._trace("sheet:share", { share: Boolean(navigator.share) });
        this._sheetShare();
      });
      on("click", "[data-sheet-save]", (el) => () => {
        this._trace("sheet:save");
        this._sheetSave();
      });
      on("click", "[data-action]", (el) => async () => {
        await ws({ type: "raumklima/hub/action", action: el.dataset.action, ...this._homeMsg() });
        this._load();
      });
      on("click", "[data-nav]", (el) => () => {
        history.pushState(null, "", el.dataset.nav);
        window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: false } }));
      });
    }
  };

  // src/cards/settings/bind.js
  var BindMethods = {
    // Ein Listener je Ereignistyp an der Schatten-Wurzel. Er läuft vom Ziel nach außen (wie das
    // normale Aufsteigen eines Ereignisses) und ruft jeden passenden Handler; stopPropagation() im
    // Handler beendet den Lauf wie gewohnt. Neu gezeichnete Teile brauchen so kein neues Anbinden.
    _delegate() {
      if (this._delegating) return;
      this._delegating = true;
      for (const type of ["click", "change", "input", "keydown"]) {
        this.shadowRoot.addEventListener(type, (ev) => {
          for (let node = ev.target; node && node !== this.shadowRoot; node = node.parentNode) {
            if (node.nodeType !== 1) continue;
            for (const h of this._handlers || []) {
              if (h.type === type && node.matches(h.sel)) h.make(node)(ev);
            }
            if (ev.cancelBubble) break;
          }
        });
      }
    },
    // Auswahl neben einem Hinzufügen-Knopf: relativ suchen (nicht über eine ID) und den
    // Fokus lösen, damit _renderSoon das Neuzeichnen nicht bis zum Verlassen des Feldes zurückhält.
    _addSelect(el) {
      const sel = (el.closest(".addrow") || el.parentElement || el).querySelector("select");
      if (sel) sel.blur();
      return sel;
    },
    _bind() {
      this._handlers = [];
      const on = (type, sel, make) => this._handlers.push({ type, sel, make });
      this._delegate();
      const $ = (sel) => this.shadowRoot.querySelectorAll(sel);
      const ws = (msg) => this._hass.callWS(msg).catch((e) => this._flash(t("Fehler: {e}", { e: e.message || e })));
      const apply = (scope, changes) => {
        if (scope === "hub") this._setHub(changes);
        else this._setRoom(scope.slice(5), changes);
      };
      const sp = (v) => String(v).split("|");
      const roomList = (entry, key, fallback) => {
        const room = (this._rooms || []).find((x) => (x.attrs.settings || {}).entry_id === entry);
        const s = room && room.attrs.settings || {};
        return [...(room && this._roomOpt(room, key)) ?? s[key] ?? fallback];
      };
      const mailSettings = () => {
        const f = { ...this._mailForm || {} };
        const out = {};
        for (const k2 of ["mail_server", "mail_port", "mail_security", "mail_auth", "mail_user", "mail_password", "mail_from", "mail_to"]) {
          if (f[k2] === void 0) continue;
          out[k2] = k2 === "mail_auth" ? f[k2] !== false : k2 === "mail_port" ? f[k2] === "" ? null : parseInt(f[k2], 10) : String(f[k2]).trim();
        }
        return out;
      };
      const roomLights = (entry) => {
        const room = (this._rooms || []).find((x) => (x.attrs.settings || {}).entry_id === entry);
        const local = room ? this._roomOpt(room, "presence_lights") : null;
        return [...local || []];
      };
      const roomPres = (entry) => {
        const room = (this._rooms || []).find((x) => (x.attrs.settings || {}).entry_id === entry);
        const local = room && this._roomOpt(room, "presence_sensors");
        return [...local ?? Object.keys((room && room.attrs.settings || {}).presence_sensors || {})];
      };
      const k = { on, $, ws, apply, sp, roomList, mailSettings, roomLights, roomPres };
      BindGeneralMethods._bindGeneral.call(this, k);
      BindScheduleMethods._bindSchedule.call(this, k);
      BindHubMethods._bindHub.call(this, k);
      BindNotifyMethods._bindNotify.call(this, k);
    }
  };

  // src/cards/settings/onboarding.js
  var STEPS = [
    {
      id: "start",
      title: "Willkommen",
      fields: [],
      intro: "Der Assistent fragt die wichtigsten Punkte ab. Du kannst jederzeit abbrechen und später in den Einstellungen weitermachen."
    },
    {
      id: "home",
      title: "Wohnung",
      fields: [
        { key: "home_name", label: "Name der Wohnung", type: "text", placeholder: "z. B. Zuhause", required: true },
        { key: "zone", label: "Zone", type: "select", choices: "zones", allowEmpty: true },
        { key: "weather_entity", label: "Wetterquelle", type: "select", choices: "weather", allowEmpty: true }
      ]
    },
    {
      id: "heat",
      title: "Heizung",
      fields: [
        { key: "room_name", label: "Name des Raums", type: "text", placeholder: "z. B. Bad", required: true },
        { key: "heat_type", label: "Art der Heizung", type: "select", options: [["trv", "Thermostat"], ["floor", "Fußbodenheizung"], ["monitor", "Nur messen"]], required: true },
        { key: "room_type", label: "Raumtyp", type: "select", options: Object.entries(RK_ROOM_TYPES), required: true }
      ]
    },
    {
      id: "trv",
      title: "Thermostat & Fühler",
      fields: [
        { key: "trv", label: "Thermostat", type: "select", choices: "climate", required: true, show: (d) => d.heat_type !== "monitor" },
        { key: "extra_trvs", label: "Weitere Thermostate", type: "multi", choices: "climate", show: (d) => d.heat_type !== "monitor" },
        { key: "temperature_sensor", label: "Temperaturfühler", type: "select", choices: "outdoor", required: true },
        { key: "humidity_sensor", label: "Feuchtefühler (optional)", type: "select", choices: "humidity", allowEmpty: true },
        { key: "window_sensors", label: "Fensterkontakte (optional)", type: "multi", choices: "windows" }
      ]
    },
    {
      id: "pv",
      title: "Photovoltaik",
      fields: [
        { key: "pv_yes", label: "PV-Anlage vorhanden?", type: "toggle" },
        { key: "pv_entity", label: "PV-Ertrag", type: "select", choices: "pv", show: (d) => d.pv_yes, allowEmpty: true },
        { key: "pv_self_use", label: "Eigenverbrauch", type: "number", unit: " %", show: (d) => d.pv_yes, min: 0, max: 100, step: 5 }
      ]
    },
    {
      id: "energy",
      title: "Energie & Tarif",
      fields: [
        { key: "energy_source", label: "Quelle", type: "select", options: [["auto", "Automatisch"], ["electric", "Strom"], ["gas", "Gas"], ["oil", "Heizöl"], ["heatpump", "Wärmepumpe"], ["district", "Fernwärme"]] },
        { key: "energy_meter", label: "Zähler", type: "select", choices: "energy", allowEmpty: true },
        { key: "energy_tariff", label: "Tarif", type: "select", choices: "tariff", allowEmpty: true },
        { key: "energy_price", label: "Arbeitspreis", type: "number", unit: " €/kWh", min: 0, max: 2, step: 0.01 },
        { key: "energy_base", label: "Grundpreis", type: "number", unit: " €", min: 0, max: 1e3, step: 1 }
      ]
    },
    {
      id: "presence",
      title: "Anwesenheit",
      fields: [
        { key: "presence_sensors", label: "Präsenzmelder", type: "multi", choices: "presence" },
        { key: "presence_kind", label: "Auswertung", type: "select", options: [["auto", "Automatisch"], ["mmwave", "mmWave"], ["pir", "PIR"]] }
      ]
    },
    {
      id: "comfort",
      title: "Komfort & Absenkung",
      fields: [
        { key: "comfort_temperature", label: "Wunschtemperatur", type: "number", unit: " °C", min: 12, max: 26, step: 0.5 },
        { key: "setback_short", label: "Absenkung kurz weg", type: "number", unit: " °C", min: 10, max: 24, step: 0.5 },
        { key: "setback_long", label: "Absenkung länger weg", type: "number", unit: " °C", min: 8, max: 22, step: 0.5 },
        { key: "frost_temperature", label: "Frostschutz", type: "number", unit: " °C", min: 5, max: 15, step: 0.5 }
      ]
    },
    {
      id: "air",
      title: "Lüften",
      fields: [
        { key: "co2_limit", label: "CO₂-Grenze", type: "select", options: [["800", "800 ppm"], ["1000", "1000 ppm"], ["1200", "1200 ppm"], ["1500", "1500 ppm"]] }
      ]
    },
    {
      id: "shade",
      title: "Verschattung",
      fields: [
        { key: "shading_covers", label: "Rollläden/Jalousien", type: "multi", choices: "covers" },
        { key: "shading_mode", label: "Modus", type: "select", options: [["off", "Aus"], ["advise", "Nur empfehlen"], ["auto", "Automatisch"]] }
      ]
    },
    {
      id: "floor",
      title: "Fußbodenheizung",
      show: (d) => d.heat_type === "floor",
      fields: [
        { key: "floor_supply", label: "Vorlauffühler", type: "select", choices: "outdoor", allowEmpty: true },
        { key: "floor_return", label: "Rücklauffühler", type: "select", choices: "outdoor", allowEmpty: true }
      ]
    },
    {
      id: "summary",
      title: "Fertig",
      fields: [],
      intro: "Der Assistent legt die Wohnung an, übernimmt die Energie-/Tarifdaten und erstellt den Raum. Du kannst danach alles in den Einstellungen feinjustieren."
    }
  ];
  var EMPTY = {
    home_name: "",
    room_name: "",
    heat_type: "trv",
    room_type: "living",
    energy_source: "auto",
    extra_trvs: [],
    presence_kind: "auto",
    co2_limit: 1e3,
    shading_mode: "off",
    pv_yes: false,
    pv_self_use: 0,
    energy_price: 0.3,
    energy_base: 0,
    floor_supply: "",
    floor_return: ""
  };
  var OnboardingMethods = {
    _onboardFreeClimates() {
      const used = /* @__PURE__ */ new Set();
      for (const r of this._rooms || []) {
        const trv = ((r.attrs || {}).settings || {}).trv || "";
        if (trv) used.add(trv);
      }
      return (this._cfg && this._cfg.choices && this._cfg.choices.climate || []).filter((x) => !used.has(x.id));
    },
    _onboardMonitorSensors() {
      const used = /* @__PURE__ */ new Set();
      for (const r of this._rooms || []) {
        const settings = (r.attrs || {}).settings || {};
        if (!settings.trv && settings.temperature_sensor) used.add(settings.temperature_sensor);
      }
      return used;
    },
    _onboardStart() {
      const roomOnly = (this._rooms || []).length > 0;
      const free = this._onboardFreeClimates();
      const data = { ...EMPTY, trv: free.length ? free[0].id : "" };
      if (!free.length) data.heat_type = "monitor";
      this._onboard = { step: 0, roomOnly, data };
      this._onboardOpen = true;
      this._render();
    },
    _onboardClose() {
      this._onboardOpen = false;
      this._onboard = null;
      this._render();
    },
    /** Wer im offenen Assistenten einen Reiter antippt, will dorthin – Assistent schließen (#90). */
    _onboardLeave() {
      if (!this._onboardOpen) return;
      this._onboardOpen = false;
      this._onboard = null;
    },
    _onboardVisible() {
      const d = this._onboard && this._onboard.data || {};
      return STEPS.filter((s) => {
        if (this._onboard && this._onboard.roomOnly && (s.id === "start" || s.id === "home" || s.id === "pv" || s.id === "energy")) return false;
        return !s.show || s.show(d);
      });
    },
    _onboardCollect() {
      const root = this.shadowRoot;
      if (!root || !this._onboard) return;
      root.querySelectorAll("[data-onb]").forEach((el) => {
        const key = el.dataset.onb;
        if (el.type === "checkbox") this._onboard.data[key] = !!el.checked;
        else if (el.dataset.onbtype === "toggle") this._onboard.data[key] = el.classList.contains("on");
        else if (el.multiple) this._onboard.data[key] = Array.from(el.selectedOptions || []).map((o) => o.value).filter(Boolean);
        else if (el.dataset.onbtype === "number") this._onboard.data[key] = el.value === "" ? null : Number(el.value);
        else this._onboard.data[key] = el.value;
      });
    },
    _onboardNext(delta) {
      this._onboardCollect();
      const steps = this._onboardVisible();
      const step = steps[this._onboard.step];
      if (step && step.fields) {
        for (const f of step.fields) {
          if (!f.required) continue;
          const v = this._onboard.data[f.key];
          if (v === void 0 || v === null || v === "" || Array.isArray(v) && !v.length) {
            this._flash(t("Bitte {f} ausfüllen", { f: t(f.label) }));
            return;
          }
        }
      }
      const next = Math.max(0, Math.min(steps.length - 1, this._onboard.step + delta));
      this._onboard.step = next;
      this._render();
    },
    _onboardField(f, value) {
      const v = value ?? this._onboard.data[f.key];
      const id = `onb-${f.key}`;
      if (f.type === "select") {
        let choices = f.choices ? this._cfg && this._cfg.choices && this._cfg.choices[f.choices] || [] : (f.options || []).map(([id2, name]) => ({ id: id2, name }));
        if (f.choices === "climate" && f.key === "trv") {
          const used = new Set((this._rooms || []).map((r) => ((r.attrs || {}).settings || {}).trv || "").filter(Boolean));
          choices = choices.filter((x) => !used.has(x.id));
        }
        if (f.key === "trv" && !choices.length) return `<div class="hint">${t("Keine freien Thermostate – bitte „Nur messen“ wählen.")}</div>`;
        if (f.key === "temperature_sensor" && this._onboard.data.heat_type === "monitor") {
          const used = this._onboardMonitorSensors();
          choices = choices.filter((x) => !used.has(x.id));
          if (!choices.length) {
            this._onboard.data.temperature_sensor = "";
            return `<div class="hint">${t("Keine freien Temperaturfühler – bitte einen bestehenden Messraum entfernen oder „Thermostat“ wählen.")}</div>`;
          }
        }
        const opts = (f.allowEmpty ? [["", t("– keins –")]] : []).concat(choices.map((x) => [x.id, x.name]));
        return `<select class="sel" id="${id}" data-onb="${f.key}" data-onbtype="select">${opts.map(([oid, name]) => `<option value="${esc(oid)}"${String(v ?? "") === String(oid) ? " selected" : ""}>${esc(name)}</option>`).join("")}</select>`;
      }
      if (f.type === "multi") {
        let choices = f.choices ? this._cfg && this._cfg.choices && this._cfg.choices[f.choices] || [] : [];
        const cur = Array.isArray(v) ? v : [];
        if (f.key === "extra_trvs") {
          const used = new Set((this._rooms || []).map((r) => ((r.attrs || {}).settings || {}).trv || "").filter(Boolean));
          const main = this._onboard && this._onboard.data.trv || choices[0]?.id;
          choices = choices.filter((x) => !used.has(x.id) && x.id !== main);
        }
        const selected = cur.map((sid) => {
          const c = choices.find((x) => x.id === sid);
          return `<span class="chip2" style="--c:var(--rk-ok)"><i></i>${esc(c ? c.name : sid)} <button class="mini x" data-onbrm="${esc(f.key)}|${esc(sid)}" title="${t("entfernen")}">✕</button></span>`;
        }).join("") || `<span class="v mute">${t("keine")}</span>`;
        const avail = choices.filter((x) => !cur.includes(x.id));
        const add = avail.length ? `<div class="addrow"><select class="sel" data-onbadd="${esc(f.key)}">${avail.map((x) => `<option value="${esc(x.id)}">${esc(x.name)}</option>`).join("")}</select><button class="btn" data-onbaddbtn="${esc(f.key)}" style="--c:var(--rk-eco)"><ha-icon icon="mdi:plus"></ha-icon>${t("Hinzufügen")}</button></div>` : cur.length ? `<div class="hint">${t("Keine weiteren verfügbar")}</div>` : "";
        return `<div class="chips">${selected}</div>${add}`;
      }
      if (f.type === "toggle") {
        const on = !!v;
        return `<button class="tgl ${on ? "on" : ""}" data-onb="${f.key}" data-onbtype="toggle" data-val="${on ? 1 : 0}" aria-label="${t("umschalten")}"></button>`;
      }
      if (f.type === "number") {
        return `<input class="inp" type="number" id="${id}" data-onb="${f.key}" data-onbtype="number" value="${v ?? ""}" min="${f.min ?? ""}" max="${f.max ?? ""}" step="${f.step ?? 1}">`;
      }
      return `<input class="inp" id="${id}" data-onb="${f.key}" data-onbtype="text" value="${esc(v ?? "")}" placeholder="${esc(f.placeholder || "")}">`;
    },
    _onboardAdd(key, value) {
      if (!this._onboard || !value) return;
      const cur = Array.isArray(this._onboard.data[key]) ? this._onboard.data[key] : [];
      if (!cur.includes(value)) this._onboard.data[key] = [...cur, value];
      this._render();
    },
    _onboardRemove(key, value) {
      if (!this._onboard) return;
      const cur = Array.isArray(this._onboard.data[key]) ? this._onboard.data[key] : [];
      this._onboard.data[key] = cur.filter((x) => x !== value);
      this._render();
    },
    _onboardHtml() {
      if (!this._onboardOpen || !this._onboard) return "";
      const steps = this._onboardVisible();
      const step = steps[this._onboard.step] || steps[0];
      const fields = (step.fields || []).filter((f) => !f.show || f.show(this._onboard.data));
      const body = fields.map((f) => `<label class="mf"><span>${t(f.label)}</span>${this._onboardField(f)}</label>`).join("");
      const last = this._onboard.step >= steps.length - 1;
      return `<div class="sheet onb" role="dialog" aria-modal="false">
        <div class="stitle"><ha-icon icon="mdi:rocket-launch-outline"></ha-icon><span>${t("Einrichtungsassistent")} · ${t(step.title)}</span><button class="onbx" data-onbclose title="${t("Assistent schließen")}" aria-label="${t("Assistent schließen")}">×</button></div>
        <div class="sintro">${t(this._onboard.roomOnly ? "Neuer Raum – die Wohnung bleibt unverändert." : step.intro || "Schritt {n} von {m}", { n: this._onboard.step + 1, m: steps.length })}</div>
        ${body || `<div class="hint">${t("Keine weiteren Fragen – bereit zum Abschließen.")}</div>`}
        <div class="sbtns">
          ${this._onboard.step > 0 ? `<button class="btn" data-onbback style="--c:var(--rk-off)"><ha-icon icon="mdi:arrow-left"></ha-icon>${t("Zurück")}</button>` : ""}
          ${last ? `<button class="btn primary" data-onbfinish><ha-icon icon="mdi:check"></ha-icon>${t("Abschließen")}</button>` : `<button class="btn primary" data-onbnext><ha-icon icon="mdi:arrow-right"></ha-icon>${t("Weiter")}</button>`}
          <button class="btn" data-onbclose style="--c:var(--rk-off)">${t("Abbrechen")}</button>
        </div>
    </div>`;
    },
    async _onboardFinish() {
      this._onboardCollect();
      const d = this._onboard.data;
      const hubChanges = {};
      if (!this._onboard.roomOnly) {
        if (d.home_name) hubChanges.name = d.home_name;
        if (d.zone !== void 0) hubChanges.zone = d.zone || null;
        if (d.weather_entity !== void 0) hubChanges.weather_entity = d.weather_entity || null;
        if (d.energy_source) hubChanges.energy_source = d.energy_source;
        if (d.energy_meter !== void 0) hubChanges.energy_meter = d.energy_meter || null;
        if (d.energy_tariff !== void 0) hubChanges.energy_tariff = d.energy_tariff || null;
        if (d.energy_price !== void 0) hubChanges.energy_price = Number(d.energy_price ?? 0.3);
        if (d.energy_base !== void 0) hubChanges.energy_base = Number(d.energy_base ?? 0);
        if (d.energy_meter) hubChanges.energy_enabled = true;
        if (d.pv_yes && d.pv_entity) {
          hubChanges.pv_entity = d.pv_entity;
          hubChanges.pv_self_use = Number(d.pv_self_use ?? 0);
        }
      }
      try {
        if (Object.keys(hubChanges).length) {
          await this._hass.callWS({ type: "raumklima/hub/update", changes: hubChanges, ...this._homeMsg() });
        }
        const create = d.heat_type !== "monitor" ? d.trv && d.temperature_sensor : d.temperature_sensor;
        if (create) {
          const roomChanges = {
            name: d.room_name || d.home_name || t("Neuer Raum"),
            trv: d.heat_type === "monitor" ? "" : d.trv || "",
            temperature_sensor: d.temperature_sensor,
            room_type: d.room_type || "living"
          };
          if (d.humidity_sensor) roomChanges.humidity_sensor = d.humidity_sensor;
          if ((d.window_sensors || []).length) roomChanges.window_sensors = d.window_sensors;
          if ((d.extra_trvs || []).length) roomChanges.extra_trvs = d.extra_trvs;
          if ((d.shading_covers || []).length) roomChanges.shading_covers = d.shading_covers;
          if (d.heat_type === "floor") {
            if (d.floor_supply) roomChanges.floor_supply = d.floor_supply;
            if (d.floor_return) roomChanges.floor_return = d.floor_return;
          }
          if (d.comfort_temperature !== void 0 && d.comfort_temperature !== null) roomChanges.comfort_temperature = Number(d.comfort_temperature);
          if (d.setback_short !== void 0 && d.setback_short !== null) roomChanges.setback_short = Number(d.setback_short);
          if (d.setback_long !== void 0 && d.setback_long !== null) roomChanges.setback_long = Number(d.setback_long);
          if (d.frost_temperature !== void 0 && d.frost_temperature !== null) roomChanges.frost_temperature = Number(d.frost_temperature);
          const created = await this._hass.callWS({ type: "raumklima/room/create", ...roomChanges, ...this._homeMsg() });
          const extra = {};
          if (d.co2_limit !== void 0) extra.co2_limit = Number(d.co2_limit);
          if (d.presence_kind) extra.presence_kind = d.presence_kind;
          if ((d.presence_sensors || []).length) extra.presence_sensors = d.presence_sensors;
          if (d.shading_mode) extra.shading_mode = d.shading_mode;
          if (d.heat_type === "floor") extra.floor_heating = true;
          if (created && created.entry_id && Object.keys(extra).length) {
            await this._hass.callWS({ type: "raumklima/room/update", entry_id: created.entry_id, changes: extra });
          }
        }
        this._onboardOpen = false;
        this._onboard = null;
        this._flash(create ? t("Einrichtung abgeschlossen") : t("Einstellungen übernommen – kein Raum angelegt (Thermostat oder Temperaturfühler fehlt)"));
        await this._load();
        this._section = "rooms";
        this._tab = "general";
        this._render();
      } catch (e) {
        this._flash(t("Fehler: {e}", { e: e.message || e }));
      }
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
      if (this._nav2 === void 0) {
        try {
          const v = localStorage.getItem("raumklima-settings-nav-v2");
          this._nav2 = v == null ? NAV2_DEFAULT : v === "1";
        } catch (e) {
          this._nav2 = NAV2_DEFAULT;
        }
      }
      if (this._section === void 0) {
        try {
          const v = localStorage.getItem("raumklima-settings-section");
          this._section = SETTINGS_SECTIONS.some((x) => x.id === v) ? v : "home";
        } catch (e) {
          this._section = "home";
        }
      }
      if (this._roomTab === void 0) this._roomTab = ROOM_TAB_DEFAULT;
      if (this._sheet === void 0) this._sheet = null;
      if (this._copyRoom === void 0) this._copyRoom = null;
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
      if (rkPointerHeld(this, () => this._render())) return;
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
            if (!rkPointerHeld(this, () => this._render())) setTimeout(() => this._render(), 50);
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
    _hubOpt(key) {
      if (this._local["hub:" + key] !== void 0) return this._local["hub:" + key];
      return this._cfg && this._cfg.hub ? this._cfg.hub.options[key] : void 0;
    }
    _roomOpt(room, key) {
      const rid = room.entry_id || room.attrs && room.attrs.settings && room.attrs.settings.entry_id || room.id;
      const lk = `room:${rid}:${key}`;
      if (this._local[lk] !== void 0) return this._local[lk];
      const r = this._cfgRoom(room);
      if (!r) return void 0;
      if (key === "setback_short" || key === "setback_long" || key === "comfort_temperature" || key === "frost_temperature") return r[key];
      return r.options[key];
    }
    // Herkunft eines Werts (Phase 4): Standard, Wohnung, Raum oder Gerät.
    _roomSource(room, key) {
      const s = room.attrs && room.attrs.settings || {};
      const src = (s.sources || {})[key];
      if (src) return src;
      return (s.changed || []).includes(key) ? "room" : "default";
    }
    _srcBadge(room, key) {
      const src = this._roomSource(room, key);
      const label = { default: "Standard", room: "Raum", home: "Wohnung", device: "Gerät" }[src] || "";
      return `<span class="src src-${src}" title="${t("Herkunft")}: ${t(label)}">${t(label)}</span>`;
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
    async _setHubAt(home, changes) {
      try {
        await this._hass.callWS({ type: "raumklima/hub/update", home: home || this._homeMsg().home, changes });
        this._flash("Gespeichert");
      } catch (e) {
        this._flash(t("Fehler: {e}", { e: e.message || e }));
      }
      await this._load();
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
    _row(label, value, sub, badge = "") {
      const help = HELP[label];
      this._helpOpen = this._helpOpen || /* @__PURE__ */ new Set();
      const open = help && this._helpOpen.has(label);
      const q = help ? `<button class="qm ${open ? "on" : ""}" data-help="${esc(label)}" title="${t("Erklärung")}" aria-label="${t("Erklärung")}" aria-expanded="${open}">?</button>` : "";
      const box = open ? `<div class="helpbox">${esc(help[{ de: 0, en: 1, fr: 2 }[getLang()] ?? 1])}</div>` : "";
      return `<div class="row"><div class="l"><span class="lbl">${t(label)}${q}${badge}</span>${sub ? `<small>${t(sub)}</small>` : ""}</div>${value}</div>${box}`;
    }
    _v(text, mute) {
      return `<span class="v ${mute ? "mute" : ""}">${t(String(text))}</span>`;
    }
    _grp(g, title, icon, tone, rows, cls = "", extra = "") {
      const rowCount = (rows.match(/class="row"/g) || []).length;
      const ctlCount = (rows.match(/class="tgl/g) || []).length + (rows.match(/class="segs"/g) || []).length;
      const pairable = rowCount >= 4 && rowCount % 2 === 0 && ctlCount >= rowCount && !/tblwrap|class="people"|roomrow|whyrow|mailprov|stepper|numedit|<details/.test(rows);
      return `<div class="grp ${cls}${pairable ? " pair" : ""}" data-g="${g}" style="--g:${toneVar(tone)}"><div class="gh"><div class="ic"><ha-icon icon="${icon}"></ha-icon></div><b>${t(title)}</b>${extra}</div><div class="rws">${rows}</div></div>`;
    }
    // Wert weicht vom Standard ab? (dann klappt der Aufklapper von selbst auf)
    _changed(scope, keys) {
      const hub = scope === "hub";
      const cfg = this._cfg || {};
      const defs = hub ? cfg.hub && cfg.hub.defaults : cfg.room_defaults;
      return (keys || []).some((k) => {
        const v = hub ? this._hubOpt(k) : this._roomOpt(scope, k);
        if (v === void 0 || v === null || v === "") return false;
        const d = defs && k in defs ? defs[k] : RK_IMPLICIT[k];
        if (d === void 0) {
          if (!defs) return false;
          return Array.isArray(v) ? v.length > 0 : typeof v === "object" ? Object.keys(v).length > 0 : !!v;
        }
        return JSON.stringify(v) !== JSON.stringify(d);
      });
    }
    // Selten gebrauchte Zeilen einklappen. Offen, wenn Profi-Ansicht an ist, der Nutzer es geöffnet hat
    // oder ein Wert darin vom Standard abweicht – nichts Geändertes bleibt versteckt.
    _more(id, title, rows, scope, keys = []) {
      if (!rows || !/class="row"|class="addrow"/.test(rows)) return rows || "";
      const key = `${id}:${scope === "hub" ? "hub" : this._tab}`;
      const n = (rows.match(/class="row"/g) || []).length;
      const changed = this._changed(scope, keys);
      const user = this._moreOpen ? this._moreOpen.get(key) : void 0;
      const open = this._pro || (user !== void 0 ? user : changed);
      return `<details class="adv more" data-more="${key}" data-open="${open ? 1 : 0}"${open ? " open" : ""}><summary>${t(title)}<span class="cnt">${n}</span>${changed ? `<span class="chg" title="${t("vom Standard abweichend")}"></span>` : ""}</summary>${rows}</details>`;
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
    // Zahl-Einstellung: Einheit, Schrittweite und Grenzen stehen einmal in fields.js (RK_NUM)
    _num(scope, key, value) {
      const f = RK_NUM[key];
      if (!f) throw new Error(`RK_NUM: „${key}" fehlt in fields.js`);
      return this._optStepper(scope, key, value, f.unit, f.step, f.min, f.max, f.dec);
    }
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
      const options = `${empty !== void 0 ? `<option value="">${esc(t(empty))}</option>` : ""}${items.map((it) => `<option value="${esc(it.id)}" ${it.id === current ? "selected" : ""}>${esc(it.name)}</option>`).join("")}`;
      const select = `<select class="sel" data-sel="${scope}" data-key="${key}" ${this._admin ? "" : "disabled"}>${options}</select>`;
      if (items.length < 8) return select;
      return `<div class="selwrap" data-selwrap><input class="inp selsearch" type="search" placeholder="${esc(t("Suchen …"))}" aria-label="${esc(t("Suchen …"))}" data-selsearch autocomplete="off" ${this._admin ? "" : "disabled"}>${select}</div>`;
    }
    // ---------------------------------------------------------------- Lernen & Warum
    // ---------------------------------------------------------------- Rendern
    _render() {
      if (!this._hass || !this._rooms) return;
      rkTrackPointer(this);
      if (this._onboardOpen && this._onboardCollect) this._onboardCollect();
      if (this._pro === void 0) {
        try {
          this._pro = localStorage.getItem("raumklima-settings-pro") === "1";
        } catch (e) {
          this._pro = false;
        }
      }
      this._moreOpen = this._moreOpen || /* @__PURE__ */ new Map();
      this._schedOpen = this._schedOpen || /* @__PURE__ */ new Map();
      if (this._renderSoon()) return;
      const rooms = this._orderedRooms();
      const nav2 = !!this._nav2;
      const section = nav2 ? SETTINGS_SECTIONS.find((x) => x.id === this._section) || SETTINGS_SECTIONS[0] : null;
      if (nav2 && section.id !== this._section) this._section = section.id;
      if (this._tab !== "general" && !rooms.find((r) => r.id === this._tab)) this._tab = "general";
      if (this._roomTabRoom !== this._tab) {
        this._roomTabRoom = this._tab;
        this._roomTab = ROOM_TAB_DEFAULT;
      }
      if (!ROOM_TABS.some((x) => x.id === this._roomTab)) this._roomTab = ROOM_TAB_DEFAULT;
      const inRooms = !nav2 || section.id === "rooms";
      const room = inRooms ? rooms.find((r) => r.id === this._tab) : null;
      this._allowedGroups = !nav2 ? null : section.id === "rooms" ? room ? [...SETTINGS_ROOM_GROUPS] : [] : [...section.groups];
      if (nav2 && this._allowedGroups && !this._allowedGroups.includes(this._group)) this._group = this._allowedGroups[0] || null;
      const body = this._bodyHtml();
      const tabs = `<button class="tab ${this._tab === "general" ? "on" : ""}" data-tab="general"><ha-icon icon="mdi:home-cog-outline"></ha-icon>${t("Allgemein")}</button>` + rooms.map((r) => {
        const sick = (this._cfg && this._cfg.hub && this._cfg.hub.state && this._cfg.hub.state.issues || []).some((i) => i.entry_id === (r.attrs.settings || {}).entry_id && i.severity !== "info");
        return `<button class="tab ${this._tab === r.id ? "on" : ""}" data-tab="${r.id}" style="--c:${r.color}"><span class="dot"></span>${esc(r.name)}${sick ? ` <ha-icon icon="mdi:alert-circle" style="color:var(--rk-warn)"></ha-icon>` : ""}</button>`;
      }).join("");
      const sectionBar = nav2 ? `<div class="rail sects">${SETTINGS_SECTIONS.map((x) => `<button class="railbtn ${section.id === x.id ? "on" : ""}" data-section="${x.id}"><ha-icon icon="${x.icon}"></ha-icon>${t(x.label)}</button>`).join("")}</div>` : `<div class="tabs">${tabs}</div>`;
      const railGroups = nav2 ? this._allowedGroups || [] : RK_GROUP_ORDER;
      const showSearch = true;
      const showRail = railGroups.length > 0 && !(nav2 && section.id === "rooms" && room) && !(nav2 && String(this._search || "").trim());
      const homes = this._cfg && this._cfg.homes || [];
      const me = homes.find((h) => h.entry_id === this._homeId());
      this._ctxHome = me ? me.name : this._config && this._config.home || t("Wohnung");
      const homeBar = homes.length > 1 && !this._config.home ? `<div class="tabs homes">${homes.map((h) => `<button class="tab ${h.entry_id === this._homeId() ? "on" : ""}" data-home="${h.entry_id}"><ha-icon icon="mdi:home-outline"></ha-icon>${esc(h.name)}</button>`).join("")}</div>` : "";
      rkPaint(this, rkEnhanceSelects(`<style>${STYLES}${HISTORY_STYLES}${SETTINGS_STYLES}${ISSUE_STYLES}</style>
      <ha-card class="settings" style="--tone:${toneVar("off")}">
        <div class="hhead"><div class="htitle"><ha-icon icon="mdi:tune-variant"></ha-icon>${esc(this._config.title || t("Einstellungen"))}</div><a class="btn" href="${rkManualUrl()}" target="_blank" rel="noopener" style="--c:var(--rk-heat)" title="${t("Anleitung, Funktionen und häufige Fragen")}"><ha-icon icon="mdi:book-open-variant"></ha-icon>${t("Handbuch (PDF)")}</a><button class="btn" data-onboard style="--c:var(--rk-heat)" title="${t("Führt Schritt für Schritt durch die Einrichtung")}"><ha-icon icon="mdi:rocket-launch-outline"></ha-icon>${t("Einrichtungsassistent")}</button><button class="btn" data-selftest style="--c:var(--rk-ok)" title="${t("Prüft Wohnung, Räume, Thermostate, Fühler und Erreichbarkeit")}"><ha-icon icon="mdi:clipboard-check-outline"></ha-icon>${t("Selbsttest")}</button><button class="btn" data-diag style="--c:var(--rk-eco)" title="${t("Alle Werte, Entitäten und die letzten Log-Zeilen als Datei")}"><ha-icon icon="mdi:file-download-outline"></ha-icon>${t("Diagnose")}</button>
          <button class="btn" data-backup style="--c:var(--rk-eco)" title="${t("Alle Einstellungen als Datei sichern – ohne Passwörter")}"><ha-icon icon="mdi:content-save-outline"></ha-icon>${t("Sichern")}</button>
          ${this._admin ? `<button class="btn" data-restore style="--c:var(--rk-eco)" title="${t("Sicherung einspielen – Räume werden über ihren Namen zugeordnet")}"><ha-icon icon="mdi:content-save-arrow-left-outline"></ha-icon>${t("Wiederherstellen")}</button><input type="file" id="rkrestore" accept="application/json,.json" style="display:none">` : ""}<button class="btn" data-bug style="--c:var(--rk-warn)" title="${t("Öffnet ein neues GitHub-Issue mit Version, Home-Assistant-Version und Thermostat-Modell – ohne Raumnamen oder Entitäten")}"><ha-icon icon="mdi:bug-outline"></ha-icon>${t("Fehler melden")}</button><button class="btn ${this._nav2 ? "on" : ""}" data-nav2 aria-pressed="${this._nav2 ? "true" : "false"}" style="--c:var(--rk-eco)" title="${t("Zwischen neuer Bereichsnavigation und klassischer Ansicht wechseln")}"><ha-icon icon="${this._nav2 ? "mdi:table-large" : "mdi:view-dashboard-outline"}"></ha-icon>${this._nav2 ? t("Klassische Ansicht") : t("Neue Ansicht")}</button><button class="btn ${this._pro ? "on" : ""}" data-pro aria-pressed="${this._pro ? "true" : "false"}" style="--c:var(--rk-eco)" title="${t("Alle selten gebrauchten Einstellungen dauerhaft aufklappen")}"><ha-icon icon="${this._pro ? "mdi:unfold-less-horizontal" : "mdi:unfold-more-horizontal"}"></ha-icon>${t("Profi-Ansicht")}</button>${this._admin ? "" : `<span class="chip" style="--tone:var(--rk-warn)">${t("Nur Ansicht – Ändern erfordert Admin")}</span>`}</div>
        ${homeBar}
        ${sectionBar}
        <div class="crumb" id="rkc"></div>
        ${room ? `<div class="resetbar">${nav2 ? `<button class="btn" data-section="rooms" style="--c:var(--rk-eco)"><ha-icon icon="mdi:arrow-left"></ha-icon>${t("Räume")}</button>` : ""}${(() => {
        const n = ((room.attrs.settings || {}).changed || []).length;
        return n ? `<span>${t("{n} Einstellungen vom Standard abweichend", { n })}</span>${this._admin ? `<button class="btn small" data-copyroom="${room.id}"><ha-icon icon="mdi:content-copy"></ha-icon>${t("Raum kopieren")}</button><button class="btn small" data-applyall="${room.id}"><ha-icon icon="mdi:content-duplicate"></ha-icon>${t("Für alle Räume übernehmen")}</button>` : ""}<button class="btn small" data-resetroom="${room.id}"><ha-icon icon="mdi:backup-restore"></ha-icon>${t("Auf Standard zurücksetzen")}</button>${this._admin && (room.attrs.settings || {}).entry_id ? `<button class="btn small" data-deleteroom="${esc((room.attrs.settings || {}).entry_id)}" style="--c:var(--rk-cold)"><ha-icon icon="mdi:delete-outline"></ha-icon>${t("Raum löschen")}</button>` : ""}` : `<span>${t("Alles auf Standard")}</span>`;
      })()}</div>` : ""}
        ${showSearch ? `<div class="searchrow"><input id="rks" type="search" placeholder="${t("Einstellungen durchsuchen …")}" aria-label="${t("Einstellungen durchsuchen")}" autocomplete="off" value="${esc(this._search || "")}"></div>` : ""}
        ${showRail ? `<div class="rail">${railGroups.map((g) => `<button class="railbtn" data-g="${g}"><ha-icon icon="${RK_GROUP_META[g].icon}"></ha-icon>${t(RK_GROUP_META[g].label)}</button>`).join("")}</div>` : ""}
        <div class="nosearch" style="display:none">${t("Kein Treffer – anderen Begriff versuchen")}</div>
        <div id="rkbody">${body}</div>
        ${this._copyRoom ? this._copyRoomHtml() : ""}
        ${this._sheetHtml()}
        ${this._toast ? `<div class="toast">${esc(this._toast)}</div>` : ""}
        ${this._timePop()}
      </ha-card>`, { admin: this._admin }));
      this._bind();
      this._reopenTime();
      this._filter();
      this._decFetch();
    }
    //Phase 5: aktueller Inhalt – bei aktiver Suche alle Bereiche plus aktueller Raum.
    _bodyHtml() {
      if (this._onboardOpen) return this._onboardHtml();
      const nav2 = !!this._nav2;
      const section = nav2 ? SETTINGS_SECTIONS.find((x) => x.id === this._section) || SETTINGS_SECTIONS[0] : null;
      const rooms = this._orderedRooms();
      const inRooms = !nav2 || section.id === "rooms";
      const room = inRooms ? rooms.find((r) => r.id === this._tab) : null;
      if (nav2 && String(this._search || "").trim()) return this._searchBody(this._search);
      return nav2 && section.id === "rooms" && !room ? this._roomList() : room ? this._room(room) : this._general();
    }
    // Deep-Link aus Checkliste, „Warum?“ oder Meldung.
    _goto(target) {
      this._onboardLeave();
      const [kind, a, b] = String(target || "").split(":");
      this._search = "";
      this._group = null;
      if (kind === "section") {
        this._nav2 = true;
        this._section = SETTINGS_SECTIONS.some((x) => x.id === a) ? a : "home";
        this._tab = "general";
      } else if (kind === "room") {
        this._nav2 = true;
        this._section = "rooms";
        this._tab = a;
        this._roomTab = ROOM_TAB_DEFAULT;
      } else if (kind === "roomtab") {
        this._nav2 = true;
        this._section = "rooms";
        this._tab = a;
        this._roomTab = ROOM_TABS.some((x) => x.id === b) ? b : ROOM_TAB_DEFAULT;
      } else if (kind === "group") {
        this._nav2 = true;
        this._section = SETTINGS_SECTIONS.some((x) => x.id === a) ? a : "home";
        this._group = b || null;
        this._tab = "general";
      }
      try {
        localStorage.setItem("raumklima-settings-section", this._section);
      } catch (e) {
      }
      this._sig = null;
      this._render();
    }
    _gotoRoomByEntry(entryId) {
      const room = (this._rooms || []).find((r) => (r.attrs.settings || {}).entry_id === entryId);
      this._goto(room ? `room:${room.id}` : "section:system");
    }
    async _deleteRoom(entryId) {
      if (!entryId) return;
      if (typeof window.confirm === "function" && !window.confirm(t("Raum wirklich löschen? Einstellungen, Zeitpläne und Verlauf dieses Raums werden entfernt."))) return;
      try {
        await this._hass.callWS({ type: "raumklima/room/delete", entry_id: entryId });
        this._tab = "general";
        this._section = "rooms";
        this._flash(t("Raum gelöscht"));
        await this._load();
      } catch (e) {
        this._flash(t("Fehler: {e}", { e: e.message || e }));
      }
    }
    // Räume-Liste (Phase 1): Einstieg in die Raum-Detailseite.
    _roomList() {
      const rooms = this._orderedRooms();
      const addRow = this._admin ? `<div class="addrow">
      <button class="btn" data-onboard style="--c:var(--rk-heat)" title="${t("Führt Schritt für Schritt durch das Anlegen eines Raums")}"><ha-icon icon="mdi:plus"></ha-icon>${t("Raum hinzufügen")}</button>
    </div>` : "";
      return `<div class="roomlist" style="--g:var(--rk-heat)">
      <div class="gh"><div class="ic"><ha-icon icon="mdi:door-open"></ha-icon></div><b>${t("Räume")}</b></div>
      ${rooms.length ? `<div class="roomgrid">${this._roomTiles()}</div><div class="hint">${t("Tippe auf einen Raum, um seine Einstellungen zu ändern.")}</div>` : `<div class="hint">${t("Noch keine Räume eingerichtet.")}</div>`}
      ${addRow}
    </div>`;
    }
    // Phase 6.1: einen Raum als Vorlage auf einen anderen Raum kopieren.
    _copyRoomHtml() {
      const from = (this._rooms || []).find((r) => r.id === this._copyRoom);
      if (!from) return "";
      const home = from.attrs.home || this._homeId();
      const targets = this._orderedRooms().filter(
        (r) => r.id !== from.id && (r.attrs.home || this._homeId()) === home && (r.attrs.settings || {}).entry_id
      );
      const templates = this._cfg && this._cfg.hub && this._cfg.hub.options && this._cfg.hub.options.room_templates || [];
      return `<div class="sheetwrap">
      <div class="sheet" role="dialog" aria-modal="true">
        <div class="stitle">${t("Raum kopieren")}</div>
        <div class="sintro">${t("Zielraum wählen. Kopiert werden nur sichere Werte – keine Entitäten, Zeitpläne oder Raumzuordnung.")}</div>
        ${targets.length ? `<label class="mf"><span>${t("Zielraum")}</span><select class="sel" id="copyTarget">${targets.map((r) => `<option value="${esc(r.id)}">${esc(r.name)}</option>`).join("")}</select></label>` : `<div class="hint">${t("Kein weiterer Raum in dieser Wohnung.")}</div>`}
        <div class="sbtns"><button class="btn primary" data-copyroom-go="${from.id}" ${targets.length ? "" : "disabled"}><ha-icon icon="mdi:content-copy"></ha-icon>${t("Kopieren")}</button><button class="btn" data-copyroom-close style="--c:var(--rk-off)">${t("Schließen")}</button></div>
        <div class="sub">${t("Vorlagen")}</div>
        <div class="chips">${templates.map((x) => `<button class="chip2" data-template-apply="${esc(x.name)}" style="--c:var(--rk-eco)"><i></i>${esc(x.name)}</button><button class="mini x" data-template-delete="${esc(x.name)}" title="${t("löschen")}">✕</button>`).join("") || `<span class="v mute">${t("keine")}</span>`}</div>
        <div class="addrow"><input class="inp" id="templateName" placeholder="${t("Name der Vorlage")}" maxlength="40"><button class="btn" data-template-save="${from.id}" style="--c:var(--rk-eco)"><ha-icon icon="mdi:content-save"></ha-icon>${t("Aus diesem Raum speichern")}</button></div>
      </div>
    </div>`;
    }
    async _saveRoomTemplate(roomId) {
      const input = this.shadowRoot && this.shadowRoot.querySelector("#templateName");
      const name = input ? input.value.trim() : "";
      if (!name) {
        this._flash(t("Name fehlt"));
        return;
      }
      const room = (this._rooms || []).find((r) => r.id === roomId);
      const entryId = (room && room.attrs.settings || {}).entry_id;
      if (!entryId) return;
      try {
        await this._hass.callWS({ type: "raumklima/room/template_save", entry_id: entryId, name, ...this._homeMsg() });
        this._copyRoom = null;
        this._flash(t("Vorlage gespeichert"));
        await this._load();
      } catch (e) {
        this._flash(t("Fehler: {e}", { e: e.message || e }));
      }
    }
    async _applyRoomTemplate(name) {
      const targetEl = this.shadowRoot && this.shadowRoot.querySelector("#copyTarget");
      const target = targetEl ? (this._rooms || []).find((r) => r.id === targetEl.value) : null;
      const entryId = (target && target.attrs.settings || {}).entry_id;
      if (!entryId) return;
      try {
        await this._hass.callWS({ type: "raumklima/room/template_apply", entry_id: entryId, name, ...this._homeMsg() });
        this._copyRoom = null;
        this._flash(t("Vorlage angewendet"));
        await this._load();
      } catch (e) {
        this._flash(t("Fehler: {e}", { e: e.message || e }));
      }
    }
    _deleteRoomTemplate(name) {
      if (!window.confirm(t("Vorlage „{n}“ löschen?", { n: name }))) return;
      this._hass.callWS({ type: "raumklima/room/template_delete", name, ...this._homeMsg() }).then(() => {
        this._flash(t("Vorlage gelöscht"));
        return this._load();
      }).catch((e) => this._flash(t("Fehler: {e}", { e: e.message || e })));
    }
    async _copyRoomGo(roomId) {
      const from = (this._rooms || []).find((r) => r.id === roomId);
      const targetEl = this.shadowRoot && this.shadowRoot.querySelector("#copyTarget");
      const target = targetEl ? (this._rooms || []).find((r) => r.id === targetEl.value) : null;
      if (!from || !target) return;
      const s = from.attrs.settings || {};
      const changes = {};
      for (const key of ROOM_APPLY_KEYS) {
        if ((s.sources || {})[key] !== "room") continue;
        const value = this._roomOpt(from, key);
        if (value === void 0 || value === null) continue;
        changes[key] = value;
      }
      if (!Object.keys(changes).length) {
        this._flash(t("Keine sicheren Werte zum Kopieren"));
        return;
      }
      const entryId = (target.attrs.settings || {}).entry_id;
      if (!entryId) return;
      try {
        await this._hass.callWS({ type: "raumklima/room/update", entry_id: entryId, changes });
        this._copyRoom = null;
        this._flash(t("Raum kopiert"));
        this._render();
      } catch (e) {
        this._flash(t("Fehler: {e}", { e: e.message || e }));
      }
    }
    // Phase 4: ausgewählte sichere Werte auf die anderen Räume derselben Wohnung legen.
    async _applyToAllRooms(roomId) {
      const room = (this._rooms || []).find((r) => r.id === roomId);
      if (!room) return;
      const s = room.attrs.settings || {};
      const changes = {};
      for (const key of ROOM_APPLY_KEYS) {
        if ((s.sources || {})[key] !== "room") continue;
        const value = this._roomOpt(room, key);
        if (value === void 0 || value === null) continue;
        changes[key] = value;
      }
      const home = room.attrs.home || this._homeId();
      const targets = (this._rooms || []).filter(
        (r) => r.id !== roomId && (r.attrs.settings || {}).entry_id && (r.attrs.home || this._homeId()) === home
      );
      if (!Object.keys(changes).length) {
        this._flash(t("Keine sicheren Werte zum Übernehmen"));
        return;
      }
      if (!targets.length) {
        this._flash(t("Keine weiteren Räume"));
        return;
      }
      if (typeof window.confirm === "function" && !window.confirm(t("{n} sichere Werte auf {m} Räume übernehmen?", { n: Object.keys(changes).length, m: targets.length }))) return;
      let ok = 0;
      for (const target of targets) {
        const id = (target.attrs.settings || {}).entry_id;
        try {
          await this._hass.callWS({ type: "raumklima/room/update", entry_id: id, changes });
          ok += 1;
        } catch (e) {
        }
      }
      this._flash(t("{n} Räume übernommen", { n: ok }));
      this._render();
    }
    // Gruppenleiste + Suche: blendet Gruppen im bereits gezeichneten Inhalt aus.
    _filter() {
      const root = this.shadowRoot;
      if (!root) return;
      const q = String(this._search || "").toLowerCase().trim();
      const searching = !!q && !!this._nav2;
      const secs = [...root.querySelectorAll(".grp")];
      const allowed = !searching && this._nav2 && this._allowedGroups ? new Set(this._allowedGroups) : null;
      const order = searching ? RK_GROUP_ORDER : this._nav2 && this._allowedGroups ? this._allowedGroups : RK_GROUP_ORDER;
      const room = !this._nav2 || this._section === "rooms" ? (this._rooms || []).find((r) => r.id === this._tab) : null;
      const roomTab = !searching && this._nav2 && room ? this._roomTab || ROOM_TAB_DEFAULT : null;
      const present = /* @__PURE__ */ new Set();
      let active = null;
      let shown = 0;
      if (!roomTab) {
        for (const g of order) {
          if (secs.some((el) => (el.dataset.g || "advanced") === g)) {
            active = g;
            break;
          }
        }
        if (this._group && secs.some((el) => (el.dataset.g || "advanced") === this._group) && (!allowed || allowed.has(this._group))) active = this._group;
      }
      secs.forEach((el) => {
        const g = el.dataset.g || "advanced";
        if (allowed && !allowed.has(g)) {
          el.style.display = "none";
          return;
        }
        present.add(g);
        const hit = !q || el.textContent.toLowerCase().includes(q);
        const tab = el.dataset.room || ROOM_TAB_DEFAULT;
        const vis = q ? hit : roomTab ? tab === roomTab : g === active;
        el.style.display = vis ? "" : "none";
        if (vis) shown += 1;
      });
      root.querySelectorAll("details.more").forEach((d) => {
        d.open = q ? d.textContent.toLowerCase().includes(q) : d.dataset.open === "1";
      });
      const visible = secs.filter((el) => el.style.display !== "none");
      secs.forEach((el) => el.classList.toggle("solo", visible.length === 1 && el.style.display !== "none"));
      root.querySelector(".groups")?.classList.toggle("solo", visible.length === 1);
      root.querySelectorAll(".railbtn").forEach((b) => {
        if (b.dataset.section) return;
        if (!root.querySelector(`.grp[data-g="${b.dataset.g}"]`)) b.remove();
      });
      root.querySelectorAll(".railbtn").forEach((b) => {
        if (b.dataset.section) return;
        const g = b.dataset.g;
        b.classList.toggle("empty", !present.has(g));
        b.classList.toggle("on", !q && g === active);
      });
      const nos = root.querySelector(".nosearch");
      if (nos) nos.style.display = q && !shown && root.querySelector(".searchrow") ? "" : "none";
      const crumb = root.querySelector("#rkc");
      if (crumb) {
        const parts = [this._ctxHome || t("Wohnung")];
        if (q) {
          parts.push(t("Suche"));
        } else if (this._nav2) {
          const sec = SETTINGS_SECTIONS.find((x) => x.id === this._section);
          if (sec) parts.push(t(sec.label));
          if (room) {
            parts.push(room.name);
            const rt = ROOM_TABS.find((x) => x.id === roomTab);
            if (rt) parts.push(t(rt.label));
          } else if (active && RK_GROUP_META[active]) {
            parts.push(t(RK_GROUP_META[active].label));
          }
        } else {
          parts.push(room ? room.name : t("Allgemein"), t(RK_GROUP_META[active || "home"].label));
        }
        crumb.innerHTML = parts.map((x, i) => i === parts.length - 1 ? `<b>${esc(x)}</b>` : `${esc(x)} <span>›</span>`).join(" ");
      }
    }
  };
  Object.assign(RaumklimaSettingsCard.prototype, SheetMethods, GeneralMethods, LayoutMethods, ScheduleMethods, RoomMethods, RoomOverviewMethods, LearnMethods, BindMethods, HomeSectionMethods, PresenceSectionMethods, HeatingSectionMethods, EnergySectionMethods, NotifySectionMethods, SystemSectionMethods, OnboardingMethods);

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
  .filters .newhint { min-height:1.6em; margin:0; }
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
      this._roomSel = this._roomSel ?? new Set(Array.isArray(saved.rooms) ? saved.rooms : saved.room ? [saved.room] : []);
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
          if (r && (r.attrs.settings || {}).entry_id) this._roomSel = /* @__PURE__ */ new Set([(r.attrs.settings || {}).entry_id]);
        }
        this._load();
        this._subscribe();
        this._render();
      }
    }
    _save() {
      try {
        localStorage.setItem("raumklima-log-filter", JSON.stringify({ rooms: [...this._roomSel], cats: [...this._cats] }));
      } catch (e) {
      }
    }
    async _load(older) {
      try {
        const msg = { type: "raumklima/log", limit: 300, ...this._config.home ? { home: this._config.home } : {} };
        if (this._cats.size < Object.keys(RK_LOG_CATS).length) msg.categories = [...this._cats];
        if (this._roomSel.size) msg.entry_ids = [...this._roomSel];
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
        if (this._roomSel.size && e.eid && !this._roomSel.has(e.eid)) return false;
        if (this._roomSel.size && !e.eid && !["presence", "season"].includes(e.cat)) return false;
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
      const roomChips = [`<button class="chip2 ${this._roomSel.size ? "off" : ""}" data-room="" style="--c:var(--rk-off)"><i></i>${t("Alle Räume")}</button>`].concat(this._rooms.map((r) => {
        const id = (r.attrs.settings || {}).entry_id;
        return `<button class="chip2 ${this._roomSel.has(id) ? "" : "off"}" data-room="${id}" style="--c:${r.color}"><i></i>${esc(r.name)}</button>`;
      })).join("");
      const catChips = Object.entries(RK_LOG_CATS).map(([k, m]) => `<button class="chip2 ${this._cats.has(k) ? "" : "off"}" data-cat="${k}" style="--c:${toneVar(m[2])}"><ha-icon icon="${m[1]}"></ha-icon>${m[0]}</button>`).join("");
      const empty = this._err ? `<div class="err">${t("Protokoll nicht verfügbar: {e}", { e: esc(this._err) })}</div>` : !this._entries.length ? `<div class="empty">${t("Noch keine Einträge. Ab jetzt steht hier jede Entscheidung mit Begründung.")}</div>` : !list.length ? `<div class="empty">${t("Keine Einträge für diese Auswahl.")}</div>` : "";
      const focus = this.shadowRoot.activeElement && this.shadowRoot.activeElement.classList.contains("srch");
      this._html = `<style>${STYLES}${HISTORY_STYLES}${SETTINGS_STYLES}${REPORT_STYLES}${LOG_STYLES}</style>
      <ha-card class="log" style="--tone:${toneVar("off")}">
        <div class="hhead"><div class="htitle"><ha-icon icon="mdi:text-box-search-outline"></ha-icon><div>${esc(this._config.title || t("Protokoll"))}<div class="rsub">${t("Was wann warum entschieden wurde · 14 Tage")}</div></div></div>
          <span class="live ${this._liveOff ? "off" : ""}" title="${t("neue Einträge kommen sofort, zusätzlich wird alle 5 s nachgesehen")}"><i></i>${this._liveOff ? t("alle 5 s") : "live"}<span class="ts">${this._stamp ? ` · ${rkTime(this._stamp)}` : ""}</span></span></div>
        <div class="filters">
          <div class="chips">${roomChips}</div>
          <div class="chips">${catChips}</div>
          <input class="srch" placeholder="${t("Suchen … (z. B. Offset, Heizpause)")}" value="${esc(this._q)}">
          <!-- Hinweis unter den Filtern, damit die Knöpfe beim Ein-/Ausblenden nicht springen (#81) -->
          <div class="hint newhint">${this._hiddenNew ? `${t("+{n} neue Einträge sind durch die Filter ausgeblendet (z. B. Thermostat-Befehle).", { n: this._hiddenNew })} <button class="mini" data-showall>${t("Alle zeigen")}</button>` : ""}</div>
        </div>
        ${empty}${html}
        ${this._entries.length && !this._end ? `<div class="more"><button class="btn" data-more><ha-icon icon="mdi:history"></ha-icon>${t("Ältere laden")}</button></div>` : ""}
      </ha-card>`;
      const $ = (s2) => this.shadowRoot.querySelectorAll(s2);
      $("[data-room]").forEach((b) => b.addEventListener("click", () => {
        const id = b.dataset.room;
        if (!id) this._roomSel = /* @__PURE__ */ new Set();
        else if (this._roomSel.has(id)) this._roomSel.delete(id);
        else this._roomSel.add(id);
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
        this._roomSel = /* @__PURE__ */ new Set();
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

  // src/cards/energy.js
  var SOURCES = {
    auto: "automatisch",
    electric: "Strom",
    gas: "Gas",
    heatpump: "Wärmepumpe",
    district: "Fernwärme",
    oil: "Heizöl"
  };
  var HELP_E = {
    cost: "Was die Heizung im gewählten Zeitraum gekostet hat: jede Stunde Verbrauch × Preis dieser Stunde, Strom aus PV und Akku abgezogen, dazu der Anteil der Grundgebühr. Die Jahreszahl rechnet über die Außentemperatur hoch – oder nimmt die letzten 12 Monate des Zählers.",
    use: "Wie viel Energie die Heizung verbraucht hat – bei der Wärmepumpe der Strom. Warmwasser steht getrennt dabei, wenn es einen eigenen Zähler gibt oder aus dem Gesamtzähler aufgeteilt wird.",
    heat: "Wie viel Wärme im Haus angekommen ist – so wie die Wärmepumpe sie selbst zählt. Daraus und aus dem Strom ergibt sich die Arbeitszahl.",
    cop: "Arbeitszahl: wie viel Wärme aus 1 kWh Strom wird. 4 heißt: 1 kWh Strom → 4 kWh Wärme. Stehen zwei Werte da, zählen zwei Zähler den Strom verschieden – die Wärmepumpe rechnet selbst, ein Energiemanager misst an der Leitung. Die Wahrheit liegt meist dazwischen. Gut sind im Winter 3–4,5, beim Warmwasser 2,5–3,5.",
    paid: "Was du im Schnitt je kWh Netzstrom bezahlt hast – gewichtet nach dem Verbrauch jeder Stunde. Liegt der Wert unter dem Börsen-Mittel, lief die Heizung eher in günstigen Stunden.",
    price: "Aktueller Arbeitspreis je kWh, brutto – derselbe Wert, mit dem Dashboard, Bericht und Vergleich rechnen.",
    tank: "Füllstand des Öltanks und wie lange er bei deinem Verbrauch noch reicht.",
    market: "Heizöl-Marktpreis der gewählten Entität im Vergleich zum 30-Tage-Mittel – grün heißt: gerade günstiger als im Schnitt.",
    self: "Strom, den PV-Anlage und Akku in dieser Zeit für die Heizung geliefert haben – kostet nichts und ist bei den Kosten schon abgezogen. Hat der Akku nachts aus dem Netz geladen, zählt dieser Teil zum Ladepreis.",
    money: "Wie sich die Kosten aufteilen: Heizung, Warmwasser und der Anteil der Grundgebühr. Rechts steht, was der Strom aus PV und Akku zum Börsen-Mittel gekostet hätte.",
    daily: "Jeder Balken ist ein Tag (ab 60 Tagen ein Monat): unten Heizung, oben Warmwasser. Die rote Linie ist die Außentemperatur – kalte Tage brauchen mehr. Antippen zeigt die Werte des Tages.",
    pricechart: "Strompreis der nächsten Stunden. Grün ist das günstigste Viertel, orange das teuerste. Die günstigsten drei Stunden am Stück stehen darunter – nur zur Info, Raumklima steuert die Heizung nicht.",
    week: "Jedes Kästchen ist eine Stunde der Woche, je kräftiger, desto mehr Verbrauch (Mittel über den Zeitraum). Die untere Zeile zeigt, wann Strom meist günstig (grün) oder teuer (orange) ist. Liegen kräftige Kästchen über Orange, lohnt sich ein Blick in die Einstellungen der Wärmepumpe.",
    curve: "Jeder Punkt ist ein Tag: Verbrauch gegen Außentemperatur. Die Linie zeigt, wie viel mehr jedes Grad Kälte kostet und ab welcher Außentemperatur dein Haus nicht mehr heizen müsste. Wird sie über die Jahre flacher, wurde gedämmt oder besser eingestellt.",
    heatprice: "Was 1 kWh Wärme im Haus kostet – deine Heizung im Vergleich mit anderen Wegen. Bei der Wärmepumpe: Strompreis geteilt durch die Arbeitszahl. Vergleichspreise änderst du in den Einstellungen unter Energie.",
    pv: "Wohin der Solarstrom ging: in die Heizung, ins übrige Haus oder ins Netz. Mit Akku-Sensoren trennt Raumklima, welcher Akku-Strom vorher aus dem Netz geladen wurde – der ist nicht kostenlos.",
    rooms: "Die Heizkosten verteilt auf die Räume – nach Ventilöffnung × Stunden (oder Heizstunden, wenn kein Ventil meldet). Fällt ein Raum stark heraus, steht ein Hinweis darunter.",
    house: "Was der Strom im ganzen Haus gekostet hat – so wie es der Versorger abrechnet: jede Stunde Netzbezug × Preis dieser Stunde plus die volle Grundgebühr. Akku-Ladung aus dem Netz ist im Netzbezug enthalten. Die Einspeisevergütung wird abgezogen, wenn sie in den Einstellungen eingetragen ist.",
    sources: "Woher der Preis kommt: die Hauptquelle und Reserven, die einspringen, wenn sie nichts liefert. „Mit Vorschau“ heißt: die Quelle kennt auch die Preise der nächsten Stunden."
  };
  var HK = Object.fromEntries(Object.keys(HELP_E).map((k) => [k, k]));
  var ENERGY_STYLES = `
  .equal { display:flex; flex-wrap:wrap; gap:6px; margin-top:10px; }
  .eq { display:inline-flex; align-items:center; gap:5px; padding:4px 10px; border-radius:999px; font-size:.76rem; font-weight:600; }
  .eq ha-icon { --mdc-icon-size:14px; }
  .eq.ok { background:color-mix(in srgb, var(--rk-ok) 14%, transparent); color:color-mix(in srgb, var(--rk-ok) 70%, var(--primary-text-color)); }
  .eq.warn { background:color-mix(in srgb, var(--rk-warn) 14%, transparent); color:color-mix(in srgb, var(--rk-warn) 70%, var(--primary-text-color)); }
  .egrid { display:grid; grid-template-columns:repeat(auto-fit,minmax(min(100%,380px),1fr)); gap:10px; margin-top:12px; }
  .ebox { border-radius:16px; padding:12px 14px; background:color-mix(in srgb, var(--primary-text-color) 4%, transparent); min-width:0; }
  .ebox .eh { display:flex; align-items:center; gap:7px; font-size:.9rem; margin-bottom:8px; }
  .ebox .eh ha-icon { --mdc-icon-size:18px; color:var(--tone); }
  .echart { width:100%; height:150px; display:block; }
  .echart .bheat, .eleg i.bheat { fill:var(--rk-heat); background:var(--rk-heat); }
  .echart .bww, .eleg i.bww { fill:var(--rk-air); background:var(--rk-air); }
  .echart .ltemp { fill:none; stroke:var(--rk-cold); stroke-width:2; vector-effect:non-scaling-stroke; }
  .eleg i.ltemp { height:2px !important; background:var(--rk-cold); }
  .eleg { display:flex; gap:14px; flex-wrap:wrap; font-size:.76rem; color:var(--secondary-text-color); margin-top:4px; }
  .eleg span { display:inline-flex; align-items:center; gap:5px; }
  .eleg i { display:inline-block; width:10px; height:10px; border-radius:2px; }
  .eaxis { display:flex; justify-content:space-between; font-size:.72rem; color:var(--secondary-text-color); margin-top:2px; }
  .estrip { display:flex; align-items:flex-end; gap:1px; height:90px; }
  .estrip i { flex:1; border-radius:2px 2px 0 0; background:color-mix(in srgb, var(--primary-text-color) 18%, transparent); }
  .estrip i.cheap { background:var(--rk-ok); }
  .estrip i.dear { background:var(--rk-warn); }
  .estrip i.now { outline:2px solid var(--primary-text-color); outline-offset:1px; }
  .erooms { display:grid; gap:7px; }
  .eroom { display:grid; grid-template-columns:minmax(70px,120px) 1fr auto; gap:10px; align-items:center; font-size:.84rem; }
  .eroom span { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .eroom .trk { height:8px; border-radius:4px; background:color-mix(in srgb, var(--primary-text-color) 8%, transparent); overflow:hidden; }
  .eroom .trk i { display:block; height:100%; background:var(--rk-heat); border-radius:4px; }
  .enote { font-size:.74rem; color:var(--secondary-text-color); margin-top:8px; }
  .etiles { grid-template-columns:repeat(auto-fit,minmax(170px,1fr)); }
  .dtile .k .grow, .eh .grow { flex:1; min-width:0; }
  .eq-q { flex:none; width:18px; height:18px; border-radius:50%; border:1.5px solid color-mix(in srgb, var(--secondary-text-color) 70%, transparent); background:none; color:var(--secondary-text-color); font:700 11px/1 inherit; cursor:pointer; padding:0; display:inline-flex; align-items:center; justify-content:center; }
  .eq-q.on, .eq-q:hover { background:var(--tone); border-color:var(--tone); color:#fff; }
  .ehelp { margin:6px 0 8px; padding:8px 10px; border-radius:10px; font-size:.8rem; line-height:1.4; text-transform:none; letter-spacing:0; background:color-mix(in srgb, var(--tone) 12%, transparent); color:var(--primary-text-color); }
  .ebox.wide { grid-column:1 / -1; }
  .ech { display:grid; grid-template-columns:52px 1fr; grid-template-rows:var(--h) 20px; column-gap:6px; }
  .ech.two { grid-template-columns:52px 1fr 40px; }
  .ech .ecv { position:relative; }
  .ech svg { width:100%; height:100%; display:block; overflow:visible; }
  .ey { position:relative; font-size:.7rem; color:var(--secondary-text-color); font-variant-numeric:tabular-nums; }
  .ey span { position:absolute; transform:translateY(-50%); white-space:nowrap; }
  .ey.l span { right:0; } .ey.r span { left:0; color:var(--rk-cold); }
  .ex { grid-column:2; position:relative; font-size:.7rem; color:var(--secondary-text-color); }
  .ex span { position:absolute; top:4px; transform:translateX(-50%); white-space:nowrap; }
  .egl { stroke:color-mix(in srgb, var(--primary-text-color) 12%, transparent); stroke-width:1; vector-effect:non-scaling-stroke; }
  .bheat { fill:var(--rk-heat); } .bww { fill:var(--rk-air); }
  .ebar { cursor:pointer; } .ebar .ehit { fill:transparent; } .ebar:hover .ehit, .ebar.sel .ehit { fill:color-mix(in srgb, var(--primary-text-color) 7%, transparent); }
  .ltemp { fill:none; stroke:var(--rk-cold); stroke-width:2; vector-effect:non-scaling-stroke; }
  .pcheap { fill:var(--rk-ok); background:var(--rk-ok); } .pmid { fill:color-mix(in srgb, var(--primary-text-color) 30%, transparent); background:color-mix(in srgb, var(--primary-text-color) 30%, transparent); } .pdear { fill:var(--rk-warn); background:var(--rk-warn); }
  .enow { stroke:var(--primary-text-color); stroke-width:2; vector-effect:non-scaling-stroke; }
  .eleg i.enowi { width:2px !important; background:var(--primary-text-color); }
  .lfit { stroke:var(--rk-warn); stroke-width:2; stroke-dasharray:6 5; vector-effect:non-scaling-stroke; }
  .eleg i.lfiti { height:2px !important; background:var(--rk-warn); }
  .pdot { stroke:var(--rk-heat); stroke-opacity:.85; stroke-width:10; stroke-linecap:round; vector-effect:non-scaling-stroke; }
  .eleg i.bheat { background:var(--rk-heat); } .eleg i.bww { background:var(--rk-air); } .eleg i.s-base { background:var(--rk-off); }
  .eleg .mute { margin-left:auto; opacity:.8; } .eleg .grow-r { margin-left:auto; }
  .esel { display:flex; flex-wrap:wrap; gap:6px 14px; margin-top:8px; padding:8px 10px; border-radius:10px; font-size:.82rem; background:color-mix(in srgb, var(--primary-text-color) 6%, transparent); }
  .c-heat { color:var(--rk-heat); } .c-ww { color:var(--rk-air); } .c-ok { color:var(--rk-ok); }
  .ekvs { display:grid; gap:6px; margin-top:10px; }
  .ekv { display:flex; justify-content:space-between; gap:10px; padding:7px 10px; border-radius:10px; font-size:.82rem; background:color-mix(in srgb, var(--primary-text-color) 5%, transparent); }
  .ekv span { color:var(--secondary-text-color); } .ekv b { text-align:right; font-variant-numeric:tabular-nums; }
  .emoney { display:flex; height:28px; border-radius:8px; overflow:hidden; margin:4px 0 8px; gap:2px; }
  .emoney div { display:flex; align-items:center; justify-content:center; min-width:0; overflow:hidden; white-space:nowrap; font-size:.76rem; font-weight:650; color:#111; padding:0 6px; }
  .s-heat { background:var(--rk-heat); } .s-ww { background:var(--rk-air); } .s-base { background:var(--rk-off); }
  .s-house2 { background:#c9a227; } .eleg i.s-house2 { background:#c9a227; }
  .s-pv { background:var(--rk-ok); } .s-house { background:color-mix(in srgb, var(--rk-ok) 55%, #fff); } .s-feed { background:#38506a; color:#dde !important; }
  .ewk { display:grid; gap:2px; overflow-x:auto; }
  .ewk-h, .ewk-r { display:grid; grid-template-columns:26px repeat(24, minmax(9px,1fr)); gap:2px; align-items:center; }
  .ewk-h span { font-size:.62rem; color:var(--secondary-text-color); }
  .ewk-r span { font-size:.7rem; color:var(--secondary-text-color); }
  .ewk-r i { height:14px; border-radius:3px; background:color-mix(in srgb, var(--rk-heat) calc(var(--a) * 100%), transparent); }
  .ewk-r i.nod { background:color-mix(in srgb, var(--primary-text-color) 4%, transparent); }
  .ewk-p { margin-top:4px; } .ewk-r.ewk-p i { height:8px; }
  .ewk-r.ewk-p i.pcheap { background:var(--rk-ok); } .ewk-r.ewk-p i.pdear { background:var(--rk-warn); } .ewk-r.ewk-p i.pmid { background:color-mix(in srgb, var(--primary-text-color) 30%, transparent); }
  .eleg i.ewk-lo { background:color-mix(in srgb, var(--rk-heat) 12%, transparent); }
  .ehps { display:grid; gap:8px; }
  .ehp { display:grid; grid-template-columns:minmax(120px,1.2fr) 1fr auto; gap:10px; align-items:center; font-size:.82rem; }
  .ehp .trk { height:16px; border-radius:6px; background:color-mix(in srgb, var(--primary-text-color) 6%, transparent); overflow:hidden; }
  .ehp .trk i { display:block; height:100%; border-radius:6px; background:var(--rk-off); }
  .ehp .trk i.hp-own { background:var(--rk-ok); } .ehp .trk i.hp-own_grid { background:var(--rk-heat); }
  .ehp b { font-variant-numeric:tabular-nums; }
  .eroom { grid-template-columns:minmax(70px,120px) 1fr 48px 64px !important; } .eroom small, .eroom b { text-align:right; }
  .eroom small { color:var(--secondary-text-color); font-size:.74rem; white-space:nowrap; }
  .ewarn { display:flex; gap:6px; align-items:flex-start; margin-top:8px; font-size:.8rem; color:var(--rk-warn); }
  .ewarn ha-icon { --mdc-icon-size:16px; flex:none; }
  .esrcs { display:grid; grid-template-columns:minmax(0,1fr); gap:6px; }
  .esrc { display:flex; align-items:center; gap:8px; padding:7px 10px; border-radius:10px; background:color-mix(in srgb, var(--primary-text-color) 5%, transparent); font-size:.82rem; }
  .esrc ha-icon { --mdc-icon-size:16px; color:var(--secondary-text-color); flex:none; } .esrc.on ha-icon { color:var(--rk-ok); }
  .esrc .grow { flex:1; min-width:0; } .esrc .nm { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .esrc small { color:var(--secondary-text-color); font-size:.72rem; } .esrc b { white-space:nowrap; font-variant-numeric:tabular-nums; }
  @media (max-width: 600px) { .ech { grid-template-columns:40px 1fr; } .ech.two { grid-template-columns:40px 1fr 32px; } .ehp { grid-template-columns:1fr auto; } .ehp .trk { grid-column:1 / -1; grid-row:2; } }
  .eraw { margin-top:12px; }
  .eraw summary { cursor:pointer; font-size:.86rem; font-weight:600; color:var(--secondary-text-color); padding:6px 2px; }
`;
  var RaumklimaEnergyCard = class extends HTMLElement {
    set _html(html) {
      rkPaint(this, html);
    }
    static getConfigForm() {
      return {
        schema: [
          { name: "title", selector: { text: {} } },
          { name: "days", selector: { number: { min: 1, max: 365, step: 1 } } },
          { name: "home", selector: { text: {} } }
        ]
      };
    }
    static getStubConfig() {
      return { days: 30 };
    }
    setConfig(config) {
      this._config = { days: 30, ...config };
      this._days = Number(this._config.days) || 30;
      if (!this.shadowRoot) this.attachShadow({ mode: "open" });
    }
    getCardSize() {
      return 5;
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
      if (first) this._load();
      else if (this._data && hass.language !== this._lang) this._render();
      this._lang = hass.language;
    }
    _home() {
      const id = this._config.home || rkHomeId(this._hass, this._config);
      return id ? { home: id } : {};
    }
    async _load() {
      if (!this._hass) return;
      try {
        this._data = await this._hass.callWS({ type: "raumklima/energy", days: this._days, ...this._home() });
        this._err = null;
      } catch (e) {
        this._err = e && e.message ? e.message : String(e);
      }
      this._render();
    }
    _source(e) {
      return t(SOURCES[e.source] || e.source || "automatisch");
    }
    // Kleines „?“: öffnet unter der Überschrift eine kurze Erklärung (Zustand bleibt beim Neuzeichnen)
    _q(key) {
      if (!HELP_E[key]) return "";
      const open = this._help && this._help.has(key);
      return `<button class="eq-q${open ? " on" : ""}" data-help="${key}" aria-label="${t("Erklärung")}" title="${t("Erklärung")}">?</button>`;
    }
    _helpText(key) {
      return this._help && this._help.has(key) && HELP_E[key] ? `<div class="ehelp">${t(HELP_E[key])}</div>` : "";
    }
    _tile(label, icon, value, unit, detail, tone = "warn", help = "") {
      return `<div class="dtile"><div class="k"><ha-icon icon="${icon}"></ha-icon><span class="grow">${t(label)}</span>${this._q(help)}</div>
      <div class="n" style="color:${toneVar(tone)}">${value}${unit ? `<small>${unit}</small>` : ""}</div>
      ${detail ? `<div class="d">${detail}</div>` : ""}</div>`;
    }
    _row(label, icon, value) {
      return `<div class="drow"><div class="l"><ha-icon icon="${icon}"></ha-icon>${t(label)}</div><div class="v">${value}</div></div>`;
    }
    _kv(label, value) {
      return `<div class="ekv"><span>${label}</span><b>${value}</b></div>`;
    }
    _empty(icon, text) {
      return `<div class="dempty"><ha-icon icon="${icon}"></ha-icon><div>${t(text)}</div></div>`;
    }
    _box(title, icon, body, help = "", wide = false) {
      return `<section class="ebox${wide ? " wide" : ""}"><div class="eh"><ha-icon icon="${icon}"></ha-icon><b class="grow">${t(title)}</b>${this._q(help)}</div>${this._helpText(help)}${body}</section>`;
    }
    // Achse mit runden Schritten: 0, 10, 20, 30 …
    _ticks(max, n = 4) {
      const raw = Math.max(max, 1e-3) / n;
      const mag = 10 ** Math.floor(Math.log10(raw));
      const step = [1, 2, 2.5, 5, 10].map((f) => f * mag).find((v) => v >= raw) || 10 * mag;
      const top = step * Math.ceil(max / step || 1);
      const out = [];
      for (let v = 0; v <= top + step / 2; v += step) out.push(Number(v.toFixed(6)));
      return { top, ticks: out };
    }
    // Diagramm-Rahmen: Achse links (und optional rechts), Beschriftung unten – Text bleibt scharf,
    // die Balken skalieren mit der Breite der Karte.
    _frame(svg, left, right, bottom, height = 170) {
      const lab = (list, cls) => `<div class="ey ${cls}">${list.map((l) => `<span style="top:${l.y.toFixed(1)}%">${l.t}</span>`).join("")}</div>`;
      return `<div class="ech${right ? " two" : ""}" style="--h:${height}px">${lab(left, "l")}<div class="ecv"><svg viewBox="0 0 1000 ${height}" preserveAspectRatio="none">${svg}</svg></div>${right ? lab(right, "r") : ""}
      <div class="ex">${bottom.map((b) => `<span style="left:${b.x.toFixed(1)}%">${b.t}</span>`).join("")}</div></div>`;
    }
    // Tagesbalken (bis 62 Tage) bzw. Monatsbalken: Heizung + Warmwasser gestapelt, Außentemperatur als Linie
    _dailyChart(daily) {
      let rows = (daily || []).map((d) => ({ ...d, label: d.date }));
      if (rows.length < 2 || !rows.some((d) => d.kwh + d.ww > 0)) return "";
      const monthly = rows.length > 62;
      if (monthly) {
        const m = /* @__PURE__ */ new Map();
        rows.forEach((d) => {
          const k = d.date.slice(0, 7);
          const x = m.get(k) || { date: k, label: k, kwh: 0, ww: 0, cost: 0, ts: [], n: 0 };
          x.kwh += d.kwh;
          x.ww += d.ww;
          x.cost += d.cost;
          x.n += 1;
          if (d.outdoor != null) x.ts.push(d.outdoor);
          m.set(k, x);
        });
        rows = [...m.values()].map((x) => ({ ...x, outdoor: x.ts.length ? x.ts.reduce((a, b) => a + b, 0) / x.ts.length : null }));
      }
      const H = 170, W = 1e3, top = 8;
      const { top: max, ticks } = this._ticks(Math.max(...rows.map((d) => d.kwh + d.ww)));
      const bw = W / rows.length;
      const y = (v) => H - v / max * (H - top);
      const temps = rows.map((d) => d.outdoor).filter((v) => v != null);
      const tlo = temps.length ? Math.floor(Math.min(...temps, 0) / 5) * 5 : 0;
      const thi = temps.length ? Math.ceil(Math.max(...temps, 10) / 5) * 5 : 10;
      const ty = (v) => H - (v - tlo) / Math.max(thi - tlo, 1) * (H - top);
      const sel = this._sel != null && this._sel < rows.length ? this._sel : null;
      let svg = ticks.map((v) => `<line x1="0" x2="${W}" y1="${y(v).toFixed(1)}" y2="${y(v).toFixed(1)}" class="egl"/>`).join("");
      svg += rows.map((d, i) => {
        const x = i * bw + bw * 0.14, w = bw * 0.72;
        const hk = H - y(d.kwh), hw = H - y(d.ww);
        return `<g data-day="${i}" class="ebar${sel === i ? " sel" : ""}"><rect x="${(i * bw).toFixed(1)}" y="0" width="${bw.toFixed(1)}" height="${H}" class="ehit"/><rect x="${x.toFixed(1)}" y="${(y(d.kwh) - hw).toFixed(1)}" width="${w.toFixed(1)}" height="${hw.toFixed(1)}" class="bww"/><rect x="${x.toFixed(1)}" y="${y(d.kwh).toFixed(1)}" width="${w.toFixed(1)}" height="${hk.toFixed(1)}" class="bheat"/></g>`;
      }).join("");
      if (temps.length >= 2) {
        const pts = rows.map((d, i) => d.outdoor == null ? null : `${((i + 0.5) * bw).toFixed(1)},${ty(d.outdoor).toFixed(1)}`).filter(Boolean);
        svg += `<polyline points="${pts.join(" ")}" class="ltemp"/>`;
      }
      const left = ticks.map((v) => ({ y: y(v) / H * 100, t: `${fmt(v, 0)} kWh` }));
      const right = temps.length >= 2 ? [tlo, (tlo + thi) / 2, thi].map((v) => ({ y: ty(v) / H * 100, t: `${fmt(v, 0)} °C` })) : null;
      const every = monthly ? 1 : rows.length > 31 ? 14 : 7;
      const bottom = rows.map((d, i) => ({ i, d })).filter(({ i }) => (rows.length - 1 - i) % every === 0).map(({ i, d }) => ({ x: (i + 0.5) / rows.length * 100, t: monthly ? this._month(d.date) : this._dayLabel(d.date) }));
      const hasWw = rows.some((d) => d.ww > 0);
      const legend = `<div class="eleg"><span><i class="bheat"></i>${t("Heizung")} kWh</span>${hasWw ? `<span><i class="bww"></i>${t("Warmwasser")} kWh</span>` : ""}${temps.length >= 2 ? `<span><i class="ltemp"></i>${t("Außen °C (rechte Achse)")}</span>` : ""}<span class="mute">${t("Balken antippen zeigt den Tag")}</span></div>`;
      const pick = sel != null ? rows[sel] : null;
      const info = pick ? `<div class="esel"><b>${monthly ? this._month(pick.date) : this._dayLabel(pick.date, true)}</b>
      <span class="c-heat">${t("Heizung")} ${fmt(pick.kwh, 1)} kWh</span>${pick.ww > 0 ? `<span class="c-ww">${t("Warmwasser")} ${fmt(pick.ww, 1)} kWh</span>` : ""}
      <span>${t("Kosten")} ${fmt(pick.cost, 2)} €</span>${pick.outdoor != null ? `<span>${t("außen")} ${fmt(pick.outdoor, 1)} °C</span>` : ""}</div>` : "";
      return this._frame(svg, left, right, bottom) + legend + info;
    }
    _dayLabel(iso, long = false) {
      const d = /* @__PURE__ */ new Date(`${iso}T12:00:00`);
      return d.toLocaleDateString(loc(), long ? { weekday: "short", day: "numeric", month: "numeric" } : { day: "numeric", month: "numeric" });
    }
    _month(key) {
      return (/* @__PURE__ */ new Date(`${key}-15T12:00:00`)).toLocaleDateString(loc(), { month: "short", year: "2-digit" });
    }
    // Preiskurve mit Achse in ct, „jetzt“-Strich, Farben nach Vierteln
    _priceChart(points) {
      if (!points || points.length < 4) return "";
      const vals = points.map((p) => p.p * 100);
      const sorted = [...vals].sort((a, b) => a - b);
      const lo = sorted[Math.floor(sorted.length * 0.25)], hi = sorted[Math.floor(sorted.length * 0.75)];
      const min = Math.floor(Math.min(...vals) / 5) * 5, max = Math.ceil(Math.max(...vals) / 5) * 5;
      const H = 150, W = 1e3, bw = W / points.length;
      const y = (v) => H - (v - min) / Math.max(max - min, 1) * (H - 6);
      const now = Date.now();
      let nowIdx = points.findIndex((p, i) => {
        const a = new Date(p.t).getTime(), b = i + 1 < points.length ? new Date(points[i + 1].t).getTime() : a + 36e5;
        return a <= now && now < b;
      });
      let svg = [];
      for (let v = min; v <= max; v += 5) svg.push(`<line x1="0" x2="${W}" y1="${y(v).toFixed(1)}" y2="${y(v).toFixed(1)}" class="egl"/>`);
      svg = svg.join("") + points.map((p, i) => {
        const v = p.p * 100;
        const cls = v <= lo ? "pcheap" : v >= hi ? "pdear" : "pmid";
        return `<rect x="${(i * bw).toFixed(2)}" y="${y(v).toFixed(1)}" width="${Math.max(bw - 0.6, 0.8).toFixed(2)}" height="${(H - y(v)).toFixed(1)}" class="${cls}"/>`;
      }).join("");
      if (nowIdx >= 0) svg += `<line x1="${(nowIdx * bw).toFixed(1)}" x2="${(nowIdx * bw).toFixed(1)}" y1="0" y2="${H}" class="enow"/>`;
      const left = [];
      for (let v = min; v <= max; v += 5) left.push({ y: y(v) / H * 100, t: `${fmt(v, 0)} ct` });
      const bottom = [];
      const step = Math.max(1, Math.ceil(points.length / 4));
      for (let i = step; i < points.length; i += step) {
        const d = new Date(points[i].t);
        bottom.push({ x: (i + 0.5) / points.length * 100, t: d.toLocaleString(loc(), { weekday: "short", hour: "2-digit", minute: "2-digit" }) });
      }
      const per = points.length > 1 ? Math.max(1, Math.round(36e5 / (new Date(points[1].t) - new Date(points[0].t)))) : 1;
      const win = 3 * per;
      let best = null;
      for (let i = Math.max(0, nowIdx); i + win <= points.length; i++) {
        const avg = points.slice(i, i + win).reduce((a, b) => a + b.p, 0) / win;
        if (!best || avg < best.avg) best = { i, avg };
      }
      const hm = (d) => d.toLocaleString(loc(), { weekday: "short", hour: "2-digit", minute: "2-digit" });
      const cur = nowIdx >= 0 ? points[nowIdx] : null;
      const rows = [
        cur ? this._kv(t("Jetzt"), `${fmt(cur.p * 100, 1)} ct/kWh`) : "",
        this._kv(t("Spanne"), `${fmt(sorted[0], 1)} – ${fmt(sorted[sorted.length - 1], 1)} ct/kWh`),
        best ? this._kv(t("Günstigste 3 Stunden"), `${esc(hm(new Date(points[best.i].t)))} · Ø ${fmt(best.avg * 100, 1)} ct/kWh`) : ""
      ].join("");
      const legend = `<div class="eleg"><span><i class="pcheap"></i>${t("günstigstes Viertel")}</span><span><i class="pmid"></i>${t("normal")}</span><span><i class="pdear"></i>${t("teuerstes Viertel")}</span><span><i class="enowi"></i>${t("jetzt")}</span></div>`;
      return this._frame(svg, left, null, bottom, H) + legend + `<div class="ekvs">${rows}</div>`;
    }
    // Wochentag × Stunde: wann läuft die Heizung – darunter der Ø-Preis je Stunde
    _weekGrid(week, cheapShare) {
      if (!week || !week.kwh) return "";
      const all = week.kwh.flat().filter((v) => v != null);
      if (!all.length) return "";
      const max = Math.max(...all, 0.01);
      const days = [0, 1, 2, 3, 4, 5, 6].map((i) => new Date(2026, 10, 2 + i).toLocaleDateString(loc(), { weekday: "short" }));
      const pr = (week.price || []).filter((v) => v != null);
      const ps = [...pr].sort((a, b) => a - b);
      const plo = ps[Math.floor(ps.length * 0.25)], phi = ps[Math.floor(ps.length * 0.75)];
      const head = `<div class="ewk-h"><span></span>${Array.from({ length: 24 }, (_, h) => `<span>${h % 6 === 0 ? h : ""}</span>`).join("")}</div>`;
      const body = week.kwh.map((row, d) => `<div class="ewk-r"><span>${esc(days[d])}</span>${row.map((v, h) => v == null ? `<i class="nod"></i>` : `<i style="--a:${(0.1 + 0.9 * (v / max)).toFixed(2)}" title="${esc(days[d])} ${h}:00 · Ø ${fmt(v, 2)} kWh"></i>`).join("")}</div>`).join("");
      const price = pr.length ? `<div class="ewk-r ewk-p"><span>ct</span>${(week.price || []).map((p, h) => p == null ? `<i class="nod"></i>` : `<i class="${p <= plo ? "pcheap" : p >= phi ? "pdear" : "pmid"}" title="${h}:00 · Ø ${fmt(p * 100, 1)} ct/kWh"></i>`).join("")}</div>` : "";
      const legend = `<div class="eleg"><span><i class="ewk-lo"></i>${t("wenig")}</span><span><i class="bheat"></i>${t("viel Strom")}</span>${price ? `<span>${t("untere Zeile: Ø Preis je Stunde")}</span>` : ""}</div>`;
      const note = cheapShare != null ? `<div class="enote">${t("{p} % des bezahlten Stroms fiel in die günstigsten Stunden – gleichmäßig verteilt wären es 25 %.", { p: cheapShare })}</div>` : "";
      return `<div class="ewk">${head}${body}${price}</div>${legend}${note}`;
    }
    // Heizkennlinie: Tage als Punkte, Gerade, Steigung und Heizgrenze
    _curve(c, price) {
      if (!c || !c.points) return "";
      const ts = c.points.map((p) => p.t), ks = c.points.map((p) => p.kwh);
      const tlo = Math.floor(Math.min(...ts) - 1), thi = Math.max(Math.ceil(Math.max(...ts) + 1), Math.min(Math.ceil(c.limit), tlo + 25));
      const { top: kmax, ticks } = this._ticks(Math.max(...ks, c.intercept + c.per_kelvin * -tlo));
      const H = 170, W = 1e3;
      const x = (v) => (v - tlo) / Math.max(thi - tlo, 1) * W;
      const y = (v) => H - Math.max(0, v) / kmax * (H - 8);
      let svg = ticks.map((v) => `<line x1="0" x2="${W}" y1="${y(v).toFixed(1)}" y2="${y(v).toFixed(1)}" class="egl"/>`).join("");
      const f = (tt) => c.intercept - c.per_kelvin * tt;
      svg += `<line x1="${x(tlo)}" y1="${y(f(tlo)).toFixed(1)}" x2="${x(thi)}" y2="${y(f(thi)).toFixed(1)}" class="lfit"/>`;
      svg += c.points.map((p) => `<line x1="${x(p.t).toFixed(1)}" y1="${y(p.kwh).toFixed(1)}" x2="${x(p.t).toFixed(1)}" y2="${y(p.kwh).toFixed(1)}" class="pdot"><title>${fmt(p.t, 1)} °C · ${fmt(p.kwh, 1)} kWh</title></line>`).join("");
      const left = ticks.map((v) => ({ y: y(v) / H * 100, t: `${fmt(v, 0)} kWh` }));
      const bottom = [];
      const st = thi - tlo > 12 ? 4 : 2;
      for (let v = Math.ceil(tlo / st) * st; v <= thi; v += st) bottom.push({ x: x(v) / W * 100, t: `${fmt(v, 0)} °C` });
      const rows = [
        this._kv(t("Je 1 °C kälter"), `≈ +${fmt(c.per_kelvin, 1)} kWh ${t("pro Tag")}${price ? ` (≈ ${fmt(c.per_kelvin * price, 2)} €)` : ""}`),
        c.limit > 0 && c.limit < 25 ? this._kv(t("Heizgrenze"), t("≈ {v} °C Tagesmittel", { v: fmt(c.limit, 1) })) : "",
        this._kv(t("Grundlage"), t("{n} Tage{r}", { n: c.n, r: c.r2 != null ? ` · ${t("Passgenauigkeit {p} %", { p: fmt(c.r2 * 100, 0) })}` : "" }))
      ].join("");
      return this._frame(svg, left, null, bottom, H) + `<div class="eleg"><span><i class="bheat"></i>${t("ein Tag")}</span><span><i class="lfiti"></i>${t("Kennlinie")}</span></div><div class="ekvs">${rows}</div>`;
    }
    _heatPrices(e) {
      const list = e.heat_prices || [];
      if (!list.length) return "";
      const names = {
        own: e.source === "heatpump" ? e.self_kwh ? t("deine Wärmepumpe (mit PV/Akku)") : t("deine Wärmepumpe") : t("deine Heizung"),
        own_grid: t("deine Wärmepumpe, nur Netzstrom"),
        heatpump: t("Wärmepumpe ({p} ct Strom, JAZ 3,5)", { p: fmt((e.compare_power || 0) * 100, 0) }),
        gas: t("Gas ({p} ct/kWh, 90 %)", { p: fmt((e.compare_gas || 0) * 100, 0) }),
        oil: t("Heizöl ({p} €/L, 90 %)", { p: fmt(e.compare_oil || 0, 2) })
      };
      const max = Math.max(...list.map((x) => x.ct), 1);
      const bars = list.map((x) => `<div class="ehp"><span>${esc(names[x.id] || x.id)}</span><div class="trk"><i class="hp-${x.id}" style="width:${Math.max(4, 100 * x.ct / max).toFixed(0)}%"></i></div><b>${fmt(x.ct, 1)} ct</b></div>`).join("");
      const extra = [
        e.tariff_saving != null ? this._kv(t("Dynamischer Tarif gegenüber Börsen-Mittel"), e.tariff_saving >= 0 ? `<span class="c-ok">− ${fmt(e.tariff_saving, 2)} € ${t("gespart")}</span>` : `+ ${fmt(-e.tariff_saving, 2)} € ${t("teurer")}`) : "",
        e.shift_eur != null && e.shift_eur > 0 ? this._kv(t("Nur günstigste Stunden genutzt (Obergrenze)"), t("weitere ≈ {v} €", { v: fmt(e.shift_eur, 0) })) : ""
      ].join("");
      return `<div class="ehps">${bars}</div><div class="enote">${t("je kWh Wärme im Haus – Vergleichspreise in den Einstellungen änderbar")}</div>${extra ? `<div class="ekvs">${extra}</div>` : ""}`;
    }
    _pvBox(e) {
      const pv = e.pv_kwh, feed = e.feed_kwh, b = e.batt || null;
      if (pv == null && !b && !e.self_kwh) return "";
      const parts = [];
      const heat = e.self_kwh || 0;
      if (pv != null && pv > 0) {
        const fed = feed != null ? Math.min(feed, pv) : null;
        const house = fed != null ? Math.max(0, pv - fed - heat) : null;
        const seg = (v, cls, label) => v > 0 ? `<div class="${cls}" style="flex:${v.toFixed(1)}" title="${label}">${label}</div>` : "";
        parts.push(`<div class="emoney">${seg(Math.min(heat, pv), "s-pv", `${fmt(heat, 0)} kWh`)}${house != null ? seg(house, "s-house", `${fmt(house, 0)} kWh`) : ""}${fed != null ? seg(fed, "s-feed", `${fmt(fed, 0)} kWh`) : ""}</div>
        <div class="eleg"><span><i class="s-pv"></i>${t("Heizung")}</span>${house != null ? `<span><i class="s-house"></i>${t("Haus")}</span>` : ""}${fed != null ? `<span><i class="s-feed"></i>${t("eingespeist")}</span>` : ""}</div>`);
      }
      const rows = [
        pv != null ? this._kv(t("PV erzeugt"), `${fmt(pv, 0)} kWh`) : "",
        feed != null ? this._kv(t("Eingespeist"), `${fmt(feed, 0)} kWh`) : "",
        e.self_kwh ? this._kv(t("Heizung aus PV/Akku (kostenlos)"), `${fmt(e.self_kwh, 0)} kWh`) : "",
        e.batt_kwh ? this._kv(t("Heizung aus dem Akku, vorher aus dem Netz geladen"), `${fmt(e.batt_kwh, 0)} kWh`) : "",
        b ? this._kv(t("Akku geladen · davon aus dem Netz"), `${fmt(b.charge, 0)} kWh · ${fmt(b.grid_charge, 0)} kWh${b.grid_charge > 0 && b.grid_charge_cost ? ` (Ø ${fmt(b.grid_charge_cost / b.grid_charge * 100, 1)} ct)` : ""}`) : ""
      ].join("");
      return parts.join("") + `<div class="ekvs">${rows}</div>`;
    }
    _houseBox(h, e) {
      if (!h || h.grid_kwh == null) return "";
      const seg = (v, cls, label) => v > 0 ? `<div class="${cls}" style="flex:${v.toFixed(2)}" title="${label}">${label}</div>` : "";
      const heat = h.heat_cost != null ? h.heat_cost : 0;
      const bar = `<div class="emoney">${seg(heat, "s-heat", `${t("Heizung")} ${fmt(heat, 2)} €`)}${seg(h.rest_cost != null ? h.rest_cost : h.grid_cost, "s-house2", `${t("übriges Haus")} ${fmt(h.rest_cost != null ? h.rest_cost : h.grid_cost, 2)} €`)}${seg(h.base, "s-base", `${t("Grundgebühr")} ${fmt(h.base, 2)} €`)}</div>
      <div class="eleg"><span><i class="bheat"></i>${t("Heizung inkl. Warmwasser")}</span><span><i class="s-house2"></i>${t("übriges Haus")}</span><span><i class="s-base"></i>${t("Grundgebühr")}</span></div>`;
      const rows = [
        this._kv(t("Netzbezug"), `${fmt(h.grid_kwh, 0)} kWh · ${fmt(h.grid_cost, 2)} €`),
        this._kv(t("Grundgebühr"), `${fmt(h.base, 2)} €`),
        this._kv(`<b>${t("Rechnung Versorger")}</b>`, `${fmt(h.bill, 2)} €`),
        h.feed_eur != null ? this._kv(t("Einspeisevergütung ({k} kWh × {p} ct)", { k: fmt(h.feed_kwh, 0), p: fmt((e.feed_price || 0) * 100, 2) }), `<span class="c-ok">− ${fmt(h.feed_eur, 2)} €</span>`) : "",
        h.feed_eur != null ? this._kv(`<b>${t("Unterm Strich")}</b>`, `${fmt(h.net, 2)} € · ${t("{v} € pro Tag", { v: fmt(h.per_day, 2) })}`) : this._kv(t("Pro Tag"), `${fmt(h.per_day, 2)} €`),
        h.price_avg != null ? this._kv(t("Ø Netzstrom"), `${fmt(h.price_avg * 100, 1)} ct/kWh`) : "",
        h.self_share != null ? this._kv(t("Selbst versorgt (PV & Akku)"), `${fmt(h.self_share, 0)} % ${t("von")} ${fmt(h.house_kwh, 0)} kWh`) : ""
      ].join("");
      return bar + `<div class="ekvs">${rows}</div>`;
    }
    _roomsBox(rooms) {
      if (!rooms.length) return "";
      const top = rooms[0].share || 1;
      const fair = 100 / rooms.length;
      const unit = { valve: t("Ventilstunden"), deficit: t("Gradstunden"), hours: t("Heizstunden") };
      const short = { valve: "h", deficit: "K·h", hours: "h" };
      const odd = rooms.length >= 3 ? rooms.filter((r) => r.share >= Math.max(2 * fair, 30)) : [];
      return `<div class="erooms">${rooms.slice(0, 10).map((r) => `<div class="eroom"><span>${esc(r.name)}</span><div class="trk"><i style="width:${Math.max(4, 100 * r.share / top).toFixed(0)}%"></i></div><small title="${esc(unit[r.metric] || "")}">${r.value != null ? `${fmt(r.value, 0)} ${short[r.metric] || ""}` : ""}</small><b>${fmt(r.cost, 2)} €</b></div>`).join("")}</div>
      ${odd.map((r) => `<div class="ewarn"><ha-icon icon="mdi:alert-outline"></ha-icon>${t("{r}: {p} % – deutlich mehr als die anderen Räume. Ventil, Fühler oder Wunschtemperatur prüfen.", { r: esc(r.name), p: fmt(r.share, 0) })}</div>`).join("")}
      <div class="enote">${t("verteilt nach {m} – ohne Warmwasser und Grundgebühr", { m: unit[(rooms[0] || {}).metric] || unit.valve })}</div>`;
    }
    _rawRows(d, e) {
      const tank = e.tank || null;
      const market = e.oil_market || null;
      const tankValue = tank ? tank.current_percent != null ? fmt(tank.current_percent, 0) : tank.current_l != null ? fmt(tank.current_l, 0) : "–" : "–";
      const tankUnit = tank && tank.current_percent != null ? " %" : " L";
      const ent = (id) => `<span data-more="${esc(id)}" style="cursor:pointer">${esc(id)}</span>`;
      return [
        this._row("Quelle", "mdi:transmission-tower", esc(this._source(e))),
        e.meter ? this._row("Zähler", "mdi:counter", ent(e.meter)) : "",
        e.heat_entity ? this._row("Wärmezähler", "mdi:radiator", ent(e.heat_entity)) : "",
        e.ww_meter ? this._row("Warmwasser-Zähler", "mdi:water-boiler", ent(e.ww_meter)) : "",
        e.house_entity ? this._row("Hausverbrauch", "mdi:home-lightning-bolt-outline", ent(e.house_entity)) : "",
        e.grid_entity ? this._row("Netzbezug", "mdi:transmission-tower-import", ent(e.grid_entity)) : "",
        e.feed_entity ? this._row("Einspeisung", "mdi:transmission-tower-export", ent(e.feed_entity)) : "",
        e.batt_in_entity ? this._row("Akku geladen", "mdi:battery-arrow-up-outline", ent(e.batt_in_entity)) : "",
        e.batt_out_entity ? this._row("Akku entladen", "mdi:battery-arrow-down-outline", ent(e.batt_out_entity)) : "",
        e.heat_elec_entity ? this._row("Strom laut Wärmepumpe", "mdi:heat-pump-outline", `${ent(e.heat_elec_entity)}${e.heat_elec_kwh != null ? ` · ${fmt(e.heat_elec_kwh, 0)} kWh` : ""}`) : "",
        e.source === "oil" ? this._row("Ölpreis", "mdi:oil", `${fmt(e.oil_price, 2)} €/L`) : "",
        tank ? this._row("Tankverbrauch", "mdi:chart-timeline-variant", tank.consumed_l != null ? `${fmt(tank.consumed_l, 1)} L` : "–") : "",
        tank ? this._row("Reicht noch", "mdi:calendar-clock", tank.days_left != null ? t("{n} Tage", { n: tank.days_left }) : t("lernt noch")) : "",
        tank ? this._row("Ölbestellung", "mdi:truck-delivery-outline", tank.order ? t("jetzt bestellen") : t("noch Zeit")) : "",
        tank ? this._row("Tank", "mdi:oil-level", `${tankValue}${tankUnit}${tank.threshold_l != null ? ` · ${t("Schwelle {v} L", { v: fmt(tank.threshold_l, 0) })}` : ""}`) : "",
        e.winter_liters ? this._row("Letzter Winter", "mdi:snowflake", `${fmt(e.winter_liters, 0)} L${e.winter_days ? ` · ${t("{n} Tage", { n: e.winter_days })}` : ""}`) : "",
        e.winter_avg_l_day != null ? this._row("Ø Verbrauch", "mdi:chart-timeline-variant", `${fmt(e.winter_avg_l_day, 1)} L/Tag`) : "",
        market ? this._row("Marktpreis", "mdi:chart-line", market.value != null ? `${fmt(market.value, 2)} €/L` : "–") : "",
        market && market.vs_your_price != null ? this._row("Markt vs. deinem Preis", "mdi:scale-balance", `${market.vs_your_price > 0 ? "+" : ""}${fmt(market.vs_your_price, 2)} €/L`) : "",
        e.oil_price_history && e.oil_price_history.length ? this._row("Preisverlauf", "mdi:tag-history", (() => {
          const last = e.oil_price_history[e.oil_price_history.length - 1] || {};
          return `${esc(last.date || "–")} · ${fmt(last.price, 2)} €/L${e.oil_price_avg != null ? ` · Ø ${fmt(e.oil_price_avg, 2)}` : ""}`;
        })()) : "",
        this._row("Tarif", "mdi:tag-outline", e.tariff ? `${ent(e.tariff)}${e.tariff_dynamic ? ` · ${t("dynamisch")}` : ""}` : t("fester Preis")),
        this._row("Arbeitspreis", "mdi:currency-eur", `${fmt(e.price, 3)} €/kWh`),
        this._row("Grundpreis", "mdi:calendar-month-outline", `${fmt(e.base, 2)} €/${t("Monat")}`),
        e.heat_kwh != null ? this._row("Wärmemenge", "mdi:radiator", `${fmt(e.heat_kwh, 1)} kWh`) : "",
        e.ww_heat_kwh != null ? this._row("Warmwasser-Wärme", "mdi:water-boiler", `${fmt(e.ww_heat_kwh, 1)} kWh`) : "",
        e.efficiency > 0 ? this._row("Jahresarbeitszahl", "mdi:gauge", fmt(e.efficiency, 1)) : "",
        e.pv_entity ? this._row("PV-Ertrag", "mdi:solar-power", `${fmt(e.pv_kwh, 1)} kWh${e.pv_self_use ? ` · ${t("{n} % Eigenverbrauch", { n: fmt(e.pv_self_use, 0) })}` : ""}`) : "",
        e.surplus_kwh != null ? this._row("PV-Überschuss", "mdi:solar-power-variant", `${fmt(e.surplus_kwh, 1)} kWh`) : "",
        this._row("Zeitraum", "mdi:calendar-range", `${d.start} – ${d.end}`)
      ].join("");
    }
    _quality(e) {
      const chips = [];
      const ok = (txt) => chips.push(`<span class="eq ok"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${txt}</span>`);
      const warn = (txt) => chips.push(`<span class="eq warn"><ha-icon icon="mdi:alert-circle-outline"></ha-icon>${txt}</span>`);
      if (e.meter) (e.kwh != null ? ok : warn)(t(e.kwh != null ? "Zähler liefert" : "Zähler ohne Statistik"));
      if (e.source === "heatpump") (e.heat_entity ? e.cop != null ? ok : warn : warn)(t(e.heat_entity ? e.cop != null ? "Arbeitszahl gemessen" : "Wärmezähler ohne Werte" : "Arbeitszahl geschätzt – Wärmezähler fehlt"));
      if (e.tariff) {
        const active = (e.tariffs || []).find((x) => x.active);
        (active ? ok : warn)(active ? t("Preis aus {s}", { s: esc(active.name) }) : t("keine Preisquelle liefert – fester Preis"));
        if (e.tariff_dynamic) (active && active.forecast ? ok : warn)(t(active && active.forecast ? "Preisvorschau da" : "keine Preisvorschau"));
      }
      if (e.source_set === false) warn(t("Energiequelle bitte in den Einstellungen wählen"));
      return chips.length ? `<div class="equal">${chips.join("")}</div>` : "";
    }
    _body(d) {
      const e = d.energy || {};
      if (!e.enabled) {
        return this._empty("mdi:lightning-bolt-off", "Energie-Erfassung ist aus. In den Einstellungen unter „Heizung & Energie“ aktivieren.");
      }
      if (!e.meter && !e.tank && !e.oil_market) {
        return this._empty("mdi:counter", "Noch kein Zähler, Tank oder Marktpreis gewählt. In den Einstellungen unter „Heizung & Energie“ eine Quelle auswählen.");
      }
      const money = d.money || {};
      const kwhHeat = e.kwh == null ? money.kwh : e.kwh;
      const ww = e.ww_kwh || 0;
      const total = kwhHeat == null ? null : kwhHeat + ww;
      const cost = money.period_cost;
      const tank = e.tank || null;
      const market = e.oil_market || null;
      const electric = e.source === "heatpump" || e.source === "electric";
      const kwh = (v) => `${fmt(v, v >= 10 ? 0 : 1)} kWh`;
      const annual = money.annual != null ? t(money.annual_basis === "12m" ? "Jahr ≈ {v} € (letzte 12 Monate)" : "Jahr ≈ {v} €", { v: fmt(money.annual, 0) }) : money.period_cost != null ? t("Jahr: noch zu wenig Daten") : "";
      const costDetail = [
        money.per_day != null ? t("{v} € pro Tag", { v: fmt(money.per_day, 2) }) : "",
        annual,
        money.parts && money.parts.base ? t("Grundgebühr {v} € enthalten", { v: fmt(money.parts.base, 2) }) : "",
        money.basis === "tank" ? t("Basis: {b}", { b: t("Tank") }) : money.basis === "bill" ? t("Basis: {b}", { b: t("Abrechnung") }) : ""
      ].filter(Boolean).join(" · ");
      const useLabel = { heatpump: "Strom Wärmepumpe", electric: "Strom Heizung", gas: "Gas", oil: "Heizöl", district: "Fernwärme" }[e.source] || "Verbrauch";
      const useDetail = [
        ww > 0 ? `${t("Heizung")} ${kwh(kwhHeat)} · ${t("Warmwasser")} ${kwh(ww)}` : "",
        e.liter != null ? `${fmt(e.liter, 0)} L` : e.m3 != null ? `${fmt(e.m3, 1)} m³` : "",
        e.house_share != null ? t("{p} % des Hausstroms", { p: fmt(e.house_share, 0) }) : ""
      ].filter(Boolean).join(" · ");
      const tiles = [
        this._tile("Kosten", "mdi:currency-eur", cost == null ? "–" : fmt(cost, 2), "€", costDetail || t("noch keine Schätzung"), "heat", HK.cost),
        this._tile(useLabel, "mdi:lightning-bolt", total == null ? "–" : fmt(total, total >= 100 ? 0 : 1), "kWh", useDetail, "warn", HK.use)
      ];
      if (e.source === "heatpump" && e.heat_kwh != null) {
        const heatAll = e.heat_kwh + (e.ww_heat_kwh || 0);
        tiles.push(this._tile(
          "Wärme erzeugt",
          "mdi:radiator",
          fmt(heatAll, 0),
          "kWh",
          [e.ww_heat_kwh ? `${t("Heizung")} ${kwh(e.heat_kwh)} · ${t("Warmwasser")} ${kwh(e.ww_heat_kwh)}` : "", e.cop_from ? t("Wärme gemessen seit {d}", { d: this._dayLabel(e.cop_from) }) : ""].filter(Boolean).join(" · "),
          "heat",
          HK.heat
        ));
      }
      if (e.source === "heatpump") {
        const a = e.cop, b = e.cop_vendor;
        const val = a != null && b != null && Math.abs(a - b) >= 0.15 ? `${fmt(Math.min(a, b), 1)} – ${fmt(Math.max(a, b), 1)}` : a != null ? fmt(a, 1) : b != null ? fmt(b, 1) : e.efficiency > 0 ? fmt(e.efficiency, 1) : "–";
        tiles.push(this._tile(
          "Arbeitszahl",
          "mdi:gauge",
          val,
          "",
          [b != null ? t("laut Wärmepumpe {v}", { v: fmt(b, 1) }) : "", a != null ? t("gemessen {v}", { v: fmt(a, 1) }) : e.efficiency > 0 ? t("geschätzt (Datenblatt)") : t("Wärmezähler fehlt"), e.cop_ww != null ? t("Warmwasser {v}", { v: fmt(e.cop_ww, 1) }) : ""].filter(Boolean).join(" · "),
          "ok",
          HK.cop
        ));
      } else if (e.source === "district" && e.heat_kwh != null) {
        tiles.push(this._tile("Wärme", "mdi:radiator", fmt(e.heat_kwh, 0), "kWh", "", "ok", HK.heat));
      }
      if (e.price_paid != null && e.tariff_dynamic) {
        tiles.push(this._tile("Bezahlt Ø", "mdi:tag-outline", fmt(e.price_paid * 100, 1), "ct/kWh", [
          e.price_avg != null ? t("Börse Ø {v} ct/kWh", { v: fmt(e.price_avg * 100, 1) }) : "",
          e.cheap_share != null ? t("{p} % in günstigen Stunden", { p: e.cheap_share }) : ""
        ].filter(Boolean).join(" · "), e.price_avg != null && e.price_paid <= e.price_avg ? "ok" : "warn", HK.paid));
      } else {
        tiles.push(this._tile("Preis", "mdi:tag-outline", fmt((e.price_now ?? e.price) * 100, 1), "ct/kWh", t("je kWh, brutto"), "warn", HK.price));
      }
      if (tank) {
        const tv = tank.current_percent != null ? fmt(tank.current_percent, 0) : tank.current_l != null ? fmt(tank.current_l, 0) : "–";
        tiles.push(this._tile(
          "Tank",
          "mdi:oil-level",
          tv,
          tank.current_percent != null ? "%" : "L",
          [tank.current_l != null ? `${fmt(tank.current_l, 0)} L` : "", tank.days_left != null ? t("reicht noch ~{d} Tage", { d: tank.days_left }) : tank.order ? t("jetzt bestellen") : t("lernt noch")].filter(Boolean).join(" · "),
          tank.order ? "warn" : "ok",
          HK.tank
        ));
      }
      if (market) {
        tiles.push(this._tile(
          "Markt",
          "mdi:chart-line",
          market.value != null ? fmt(market.value, 2) : "–",
          "€/L",
          market.avg_30d != null ? t("30-Tage-Ø {v} €/L", { v: fmt(market.avg_30d, 2) }) : "",
          market.delta_avg != null && market.delta_avg <= 0 ? "ok" : "warn",
          HK.market
        ));
      }
      if (e.self_kwh) {
        tiles.push(this._tile(
          "Aus PV & Akku",
          "mdi:solar-power",
          fmt(e.self_kwh, 0),
          "kWh",
          [t("kostenlos – schon abgezogen"), e.batt_kwh ? t("{v} kWh aus nachts geladenem Akku bezahlt", { v: fmt(e.batt_kwh, 0) }) : ""].filter(Boolean).join(" · "),
          "ok",
          HK.self
        ));
      }
      const parts = money.parts || null;
      let moneyBar = "";
      if (parts && (parts.heat || parts.ww || parts.base)) {
        const seg = (v, cls, label) => v > 0 ? `<div class="${cls}" style="flex:${v.toFixed(2)}" title="${label}">${label}</div>` : "";
        moneyBar = this._box("Wohin geht das Geld?", "mdi:cash-multiple", `<div class="emoney">${seg(parts.heat || 0, "s-heat", `${t("Heizung")} ${fmt(parts.heat, 2)} €`)}${seg(parts.ww || 0, "s-ww", `${t("Warmwasser")} ${fmt(parts.ww, 2)} €`)}${seg(parts.base || 0, "s-base", `${t("Grundgebühr")} ${fmt(parts.base, 2)} €`)}</div>
        <div class="eleg"><span><i class="bheat"></i>${t("Heizung")}</span>${parts.ww ? `<span><i class="bww"></i>${t("Warmwasser")}</span>` : ""}${parts.base ? `<span><i class="s-base"></i>${t("Grundgebühr (anteilig)")}</span>` : ""}${parts.pv_saved ? `<span class="c-ok grow-r">${t("+ {k} kWh aus PV/Akku ≈ {v} € nicht bezahlt", { k: fmt(e.self_kwh, 0), v: fmt(parts.pv_saved, 0) })}</span>` : ""}</div>`, HK.money, true);
      }
      const boxes = [];
      const chart = this._dailyChart(e.daily);
      if (chart) boxes.push(this._box((e.daily || []).length > 62 ? "Verbrauch pro Monat" : "Verbrauch pro Tag", "mdi:chart-bar", chart, HK.daily, true));
      const strip = electric ? this._priceChart(d.forecast) : "";
      if (strip) boxes.push(this._box("Strompreis heute & morgen", "mdi:chart-timeline-variant", strip, HK.pricechart));
      const wk = this._weekGrid(e.week, e.tariff_dynamic ? e.cheap_share : null);
      if (wk) boxes.push(this._box(e.source === "heatpump" ? "Wann läuft die Wärmepumpe?" : "Wann wird geheizt?", "mdi:clock-outline", wk, HK.week));
      const curve = this._curve(e.curve, e.price_paid || e.price);
      if (curve) boxes.push(this._box("Heizkennlinie deines Hauses", "mdi:thermometer-lines", curve, HK.curve));
      const hp = this._heatPrices(e);
      if (hp) boxes.push(this._box("Was kostet 1 kWh Wärme?", "mdi:cash", hp, HK.heatprice));
      const house = electric ? this._houseBox(e.house, e) : "";
      if (house) boxes.push(this._box("Strom im ganzen Haus", "mdi:home-lightning-bolt-outline", house, HK.house));
      const pv = electric ? this._pvBox(e) : "";
      if (pv) boxes.push(this._box("PV & Akku", "mdi:solar-power-variant", pv, HK.pv));
      const rooms = this._roomsBox(money.rooms || []);
      if (rooms) boxes.push(this._box("Wer verbraucht die Wärme?", "mdi:home-thermometer-outline", rooms, HK.rooms));
      const srcs = e.tariffs || [];
      if (srcs.length > 1) {
        boxes.push(this._box("Preisquellen", "mdi:swap-vertical", `<div class="esrcs">${srcs.map((x) => `<div class="esrc${x.active ? " on" : ""}">
        <ha-icon icon="${x.active ? "mdi:check-circle" : "mdi:circle-outline"}"></ha-icon>
        <div class="grow"><div class="nm" title="${esc(x.entity)}">${esc(x.name)}</div><small>${t(x.primary ? "Hauptquelle" : "Reserve")}${x.forecast ? ` · ${t("mit Vorschau")}` : ""}</small></div>
        <b>${x.value != null ? `${fmt(x.value * 100, 1)} ct/kWh` : t("liefert nichts")}</b></div>`).join("")}</div>`, HK.sources));
      }
      const tileHelp = ["cost", "use", "heat", "cop", "paid", "price", "tank", "market", "self"].map((k) => this._helpText(k)).join("");
      return `<div class="dtiles etiles">${tiles.join("")}</div>${tileHelp}
      ${this._quality(e)}
      <div class="egrid">${moneyBar}${boxes.join("")}</div>
      <details class="eraw"${this._rawOpen ? " open" : ""}><summary>${t("Details und Sensoren")}</summary><div class="drows">${this._rawRows(d, e)}</div></details>`;
    }
    _render() {
      if (!this._hass) return;
      const d = this._data;
      let body;
      if (this._err) body = this._empty("mdi:alert-circle-outline", "Energie nicht verfügbar: {e}".replace("{e}", esc(this._err)));
      else if (!d) body = `<div class="dempty"><ha-icon icon="mdi:loading"></ha-icon><div>${t("Lade Energie …")}</div></div>`;
      else body = this._body(d);
      const title = this._config.title || t("Energie");
      const clipped = d && d.data_from && d.days_asked && d.days < d.days_asked;
      const sub = d ? `${clipped ? t("Daten ab {d}", { d: d.start }) : t("Letzte {n} Tage", { n: d.days })} · ${d.start} – ${d.end}` : t("Zähler, Tarif und Kosten");
      this._html = `<style>${STYLES}${DASH_STYLES}${ENERGY_STYLES}</style>
      <ha-card class="dashcard" style="--tone:${toneVar("warn")}">
        <div class="dhead"><div class="grow"><div class="dtitle"><ha-icon icon="mdi:lightning-bolt-outline"></ha-icon><div>${esc(title)}<div class="dsub">${esc(sub)}</div></div></div></div>
          <div class="dseg">${[1, 7, 30, 90, 180, 365].map((n) => `<button class="${n === this._days ? "on" : ""}" data-days="${n}">${n === 1 ? t("Heute") : t("{n} Tage", { n })}</button>`).join("")}</div>
        </div>
        ${body}
      </ha-card>`;
      this.shadowRoot.querySelectorAll("[data-days]").forEach((b) => b.addEventListener("click", () => {
        this._days = Number(b.dataset.days);
        this._sel = null;
        this._load();
      }));
      this.shadowRoot.querySelectorAll("[data-help]").forEach((b) => b.addEventListener("click", (ev) => {
        ev.stopPropagation();
        this._help = this._help || /* @__PURE__ */ new Set();
        const k = b.dataset.help;
        if (this._help.has(k)) this._help.delete(k);
        else this._help.add(k);
        this._render();
      }));
      this.shadowRoot.querySelectorAll("[data-day]").forEach((g) => g.addEventListener("click", () => {
        const i = Number(g.getAttribute("data-day"));
        this._sel = this._sel === i ? null : i;
        this._render();
      }));
      const raw = this.shadowRoot.querySelector("details.eraw");
      if (raw) raw.addEventListener("toggle", () => {
        this._rawOpen = raw.open;
      });
      this.shadowRoot.querySelectorAll("[data-more]").forEach((b) => b.addEventListener("click", () => this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: b.dataset.more }, bubbles: true, composed: true }))));
    }
  };

  // src/cards/learning.js
  var RaumklimaLearningCard = class extends HTMLElement {
    set _html(html) {
      rkPaint(this, html);
    }
    static getConfigForm() {
      return {
        schema: [
          { name: "title", selector: { text: {} } },
          { name: "home", selector: { text: {} } },
          { name: "strip_prefix", selector: { text: {} } }
        ]
      };
    }
    static getStubConfig() {
      return {};
    }
    setConfig(config) {
      this._config = { ...config };
      if (!this.shadowRoot) this.attachShadow({ mode: "open" });
    }
    getCardSize() {
      return 8;
    }
    getGridOptions() {
      return { columns: "full", rows: "auto" };
    }
    connectedCallback() {
      this.style.display = "block";
      this._poll = setInterval(() => this._loadHub(), 15 * 60 * 1e3);
    }
    disconnectedCallback() {
      clearInterval(this._poll);
    }
    set hass(hass) {
      const first = !this._hass;
      this._hass = hass;
      setLang(hass);
      this._rooms = rkRooms(hass, this._config.strip_prefix || "", rkHomeId(hass, this._config));
      if (!this._layout) {
        rkLayout(hass, rkHomeId(hass, this._config)).then((L) => {
          this._layout = L || {};
          this._rooms = rkRoomsOrdered(this._rooms || [], this._layout);
          this._render();
        }).catch(() => {
        });
      }
      if (first) this._loadHub();
      else this._render();
    }
    _home() {
      const id = this._config.home || rkHomeId(this._hass, this._config);
      return id ? { home: id } : {};
    }
    async _loadHub() {
      if (!this._hass) return;
      try {
        const cfg = await this._hass.callWS({ type: "raumklima/config", ...this._home() });
        this._hub = cfg && cfg.hub ? cfg.hub.state : null;
        this._err = null;
      } catch (e) {
        this._err = e && e.message ? e.message : String(e);
      }
      this._render();
    }
    _tile(label, icon, value, unit, detail, tone = "ok") {
      return `<div class="dtile"><div class="k"><ha-icon icon="${icon}"></ha-icon>${t(label)}</div>
      <div class="n" style="color:${toneVar(tone)}">${value}${unit ? `<small>${unit}</small>` : ""}</div>
      ${detail ? `<div class="d">${detail}</div>` : ""}</div>`;
    }
    _tag(icon, text) {
      return `<span class="tag"><ha-icon icon="${icon}"></ha-icon>${esc(text)}</span>`;
    }
    _tip() {
      const tip = this._hub && this._hub.presence_tip || {};
      if (!tip.ready) return "";
      const span = (x) => x.from === x.to ? t("ganztägig") : `${x.from}–${x.to}`;
      const part = (key, label) => tip[key] ? `${t(label)} ${span(tip[key])}` : "";
      return [part("weekday", "Wochentags"), part("weekend", "Wochenende")].filter(Boolean).join(" · ");
    }
    _sleep() {
      const s = this._hub && this._hub.sleep || {};
      const bed = s.weekday && s.weekday.bed;
      const wake = s.weekday && s.weekday.wake;
      return bed && wake ? `${bed}–${wake}` : "–";
    }
    _roomRow(room) {
      const s = room.attrs && room.attrs.settings || {};
      const h = s.heatup || {};
      const th = s.thermal || {};
      const usage = s.usage || {};
      const airing = s.airing || {};
      const top = ((s.airing_top || {}).learned || [])[0];
      const episodes = Number(h.episodes) || 0;
      const rate = h.rate;
      const minutes = h.minutes_2k;
      const pct = rate != null ? Math.min(100, Math.round(episodes / 5 * 100)) : 0;
      const heat = episodes && rate != null ? `${fmt(rate, 1)} K/h · ${t("+2 K in {n} min", { n: minutes == null ? "–" : fmt(minutes, 0) })} · ${t("{n} Aufheizvorgänge", { n: episodes })}` + (th.cool_rate != null ? ` · ${fmt(th.cool_rate, 1)} K/h ${t("Abkühlung")}` : "") + (th.solar_gain != null && th.solar_gain > 0 ? ` · ${t("Sonne")} +${fmt(th.solar_gain, 1)} K/h` : "") : t("Noch zu wenig Daten");
      const use = usage.text ? `${t("Nutzung")}: ${usage.text}` : usage.days_seen ? t("{n} Tage mit Belegung", { n: usage.days_seen }) : t("Kein Präsenzprofil");
      const air = airing.episodes ? `${t("Lüften")}: ${t("{n} Vorgänge", { n: airing.episodes })}${top ? ` · ${t("typisch")} ${top.time} (${top.count}×)` : ""}` : t("Noch kein Lüftmuster");
      return `<div class="dlrow">
      <div class="ltop"><span class="name" data-more="${esc(room.id)}" style="cursor:pointer">${esc(room.name)}</span><span class="pct">${rate != null ? `${pct} %` : ""}</span></div>
      <div class="dbar"><i style="width:${pct}%"></i></div>
      <div class="meta">${esc(heat)}</div>
      <div class="tags">${this._tag("mdi:account-clock-outline", use)}${this._tag("mdi:weather-windy", air)}</div>
    </div>`;
    }
    _render() {
      if (!this._hass) return;
      const rooms = this._rooms || [];
      const withHeat = rooms.filter((r) => {
        const h = ((r.attrs || {}).settings || {}).heatup || {};
        return h.rate != null && Number(h.episodes) > 0;
      }).length;
      const airings = rooms.reduce((n, r) => n + Number((((r.attrs || {}).settings || {}).airing || {}).episodes || 0), 0);
      const withModel = rooms.filter((r) => {
        const th = ((r.attrs || {}).settings || {}).thermal || {};
        return th.ready && th.cool_rate != null;
      }).length;
      const profile = this._hub && this._hub.presence_profile || {};
      const days = Number((profile.days || {}).weekday || 0) + Number((profile.days || {}).weekend || 0);
      const tip = this._tip();
      const title = this._config.title || t("Lernen");
      const sub = tip ? `${t("Vorschlag")}: ${tip}` : t("Was Raumklima aus deinen Daten gelernt hat");
      const body = rooms.length ? `<div class="dlrow">${rooms.map((r) => this._roomRow(r)).join("")}</div>` : `<div class="dempty"><ha-icon icon="mdi:school-outline"></ha-icon><div>${t("Noch keine Räume eingerichtet.")}</div></div>`;
      this._html = `<style>${STYLES}${DASH_STYLES}</style>
      <ha-card class="dashcard" style="--tone:${toneVar("eco")}">
        <div class="dhead"><div class="grow"><div class="dtitle"><ha-icon icon="mdi:brain"></ha-icon><div>${esc(title)}<div class="dsub">${esc(sub)}</div></div></div></div></div>
        <div class="dtiles">
          ${this._tile("Aufheizraten", "mdi:fire", `${withHeat}/${rooms.length}`, "", t("Räume mit Daten"), "heat")}
          ${this._tile("Wärmemodell", "mdi:chart-bell-curve", `${withModel}/${rooms.length}`, "", t("Räume mit Wärmeverlust"), "eco")}
          ${this._tile("Anwesenheit", "mdi:account-clock-outline", days, t(" Tage"), profile.complete ? t("Profil vollständig") : t("Profil wächst"), "ok")}
          ${this._tile("Lüften", "mdi:weather-windy", airings, "", t("gelernte Vorgänge"), "air")}
          ${this._tile("Schlaf", "mdi:power-sleep", this._sleep(), "", t("typische Nacht"), "eco")}
        </div>
        ${body}
        <div class="dnote">${t("Lernen ist lesend: Raumklima zeigt hier nur, was es aus den letzten Wochen gelernt hat.")}</div>
      </ha-card>`;
      this.shadowRoot.querySelectorAll("[data-more]").forEach((b) => b.addEventListener("click", () => this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: b.dataset.more }, bubbles: true, composed: true }))));
    }
  };

  // src/cards/demo.js
  var STATUS2 = {
    heating: { label: "Heizt", icon: "mdi:fire", tone: "heat" },
    idle: { label: "Bereit", icon: "mdi:check-circle-outline", tone: "ok" },
    setback: { label: "Absenkt", icon: "mdi:weather-night", tone: "eco" },
    window: { label: "Fenster offen", icon: "mdi:window-open-variant", tone: "air" }
  };
  var SAMPLE = [
    { id: "bad", name: "Bad", temp: 21.5, target: 22, humidity: 62, status: "heating", window: false },
    { id: "wohnen", name: "Wohnzimmer", temp: 20.8, target: 21, humidity: 48, status: "idle", window: false },
    { id: "buero", name: "Büro", temp: 19.2, target: 20, humidity: 40, status: "setback", window: true }
  ];
  var RaumklimaDemoCard = class extends HTMLElement {
    set _html(html) {
      rkPaint(this, html);
    }
    static getConfigForm() {
      return { schema: [{ name: "title", selector: { text: {} } }] };
    }
    static getStubConfig() {
      return {};
    }
    setConfig(config) {
      this._config = { ...config };
      if (!this.shadowRoot) this.attachShadow({ mode: "open" });
    }
    getCardSize() {
      return 8;
    }
    getGridOptions() {
      return { columns: "full", rows: "auto" };
    }
    connectedCallback() {
      this.style.display = "block";
    }
    set hass(hass) {
      this._hass = hass;
      setLang(hass);
      this._render();
    }
    constructor() {
      super();
      this._rooms = SAMPLE.map((r) => ({ ...r }));
    }
    _step(id, delta) {
      const room = this._rooms.find((r) => r.id === id);
      if (!room) return;
      room.target = Math.max(5, Math.min(30, Math.round((room.target + delta) * 2) / 2));
      this._render();
    }
    _window(id) {
      const room = this._rooms.find((r) => r.id === id);
      if (!room) return;
      room.window = !room.window;
      room.status = room.window ? "window" : "idle";
      this._render();
    }
    _tile(label, icon, value, unit, detail, tone = "ok") {
      return `<div class="dtile"><div class="k"><ha-icon icon="${icon}"></ha-icon>${t(label)}</div>
      <div class="n" style="color:${toneVar(tone)}">${value}${unit ? `<small>${unit}</small>` : ""}</div>
      ${detail ? `<div class="d">${detail}</div>` : ""}</div>`;
    }
    _render() {
      if (!this._hass) return;
      const rooms = this._rooms.map((r) => {
        const st = STATUS2[r.status] || STATUS2.idle;
        const label = r.id === "bad" ? t("Bad") : r.id === "wohnen" ? t("Wohnzimmer") : t("Büro");
        return `<div class="dlrow">
        <div class="ltop"><span class="name">${esc(label)}</span><span class="pct" style="color:${toneVar(st.tone)}">${t(st.label)}</span></div>
        <div class="dbar"><i style="width:${Math.min(100, Math.max(0, (r.temp - 14) / 14 * 100))}%"></i></div>
        <div class="meta">${t("Innen {v} °C", { v: fmt(r.temp, 1) })} · ${t("Soll {v} °C", { v: fmt(r.target, 1) })} · ${t("{v} % Feuchte", { v: fmt(r.humidity, 0) })}</div>
        <div class="tags">
          <button class="chip2" data-demo-step="${r.id}|-0.5">− 0,5</button>
          <button class="chip2" data-demo-step="${r.id}|0.5">+ 0,5</button>
          <button class="chip2${r.window ? "" : " off"}" data-demo-window="${r.id}"><i></i>${r.window ? t("Fenster zu") : t("Fenster auf")}</button>
        </div>
      </div>`;
      }).join("");
      this._html = `<style>${STYLES}${DASH_STYLES}</style>
      <ha-card class="dashcard" style="--tone:${toneVar("eco")}">
        <div class="dhead"><div class="grow"><div class="dtitle"><ha-icon icon="mdi:flask-outline"></ha-icon><div>${esc(this._config.title || t("Demo"))}<div class="dsub">${t("Simulierte Räume ohne Hardware")}</div></div></div></div></div>
        <div class="dtiles">
          ${this._tile("Räume", "mdi:home-group", "3", "", t("Demo-Daten"), "eco")}
          ${this._tile("Energie", "mdi:lightning-bolt", "128", " kWh", "42,50 € · 30 % PV", "warn")}
          ${this._tile("Lernen", "mdi:brain", "+2 K", "", t("in 45 min"), "ok")}
        </div>
        <div class="dlrow">${rooms}</div>
        <div class="dnote">${t("Alles hier ist simuliert – ohne Home-Assistant-Entitäten und ohne persönliche Daten.")}</div>
      </ha-card>`;
      this.shadowRoot.querySelectorAll("[data-demo-step]").forEach((b) => b.addEventListener("click", () => {
        const [id, delta] = b.dataset.demoStep.split("|");
        this._step(id, Number(delta));
      }));
      this.shadowRoot.querySelectorAll("[data-demo-window]").forEach((b) => b.addEventListener("click", () => this._window(b.dataset.demoWindow)));
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
      if (config.demo) {
        return {
          title: config.title || t("Raumklima"),
          views: [{
            title: t("Demo"),
            path: "demo",
            icon: "mdi:flask-outline",
            type: "sections",
            max_columns: 3,
            sections: [{ type: "grid", column_span: 3, cards: [{ type: "custom:raumklima-demo-card", grid_options: { columns: "full" } }] }]
          }]
        };
      }
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
      const overviewCard = { type: "custom:raumklima-overview-card", ...H, title: config.title || t("Heizung"), weather, strip_prefix: prefix, grid_options: { columns: "full" } };
      const insightsView = {
        title: t("Energie"),
        path: "energie-lernen",
        icon: "mdi:lightning-bolt",
        type: "sections",
        max_columns: 3,
        sections: [
          { type: "grid", column_span: 3, cards: [{ type: "custom:raumklima-energy-card", ...H, days: config.energy_days || 30, grid_options: { columns: "full" } }] }
        ]
      };
      const roomCard = (r) => {
        const size = rkLayoutSize(layout, r.id);
        return { type: "grid", cards: [{ type: "custom:raumklima-card", entity: r.id, name: r.name, accent: r.color, variant: size === "medium" ? "medium" : "full", grid_options: { columns: "full" } }] };
      };
      const big = shown.filter((r) => rkLayoutSize(layout, r.id) !== "tile");
      const roomSections = () => {
        const groups = layout && layout.beta_floors ? rkFloorGroups(hass, big) : [];
        if (!groups.length) return big.map(roomCard);
        return groups.flatMap((g) => [
          { type: "grid", column_span: 3, cards: [{ type: "heading", heading: g.name, icon: g.icon, heading_style: "title" }] },
          ...g.rooms.map(roomCard)
        ]);
      };
      const roomsView = {
        title: t("Räume"),
        path: "raeume",
        icon: "mdi:home-thermometer",
        type: "sections",
        max_columns: 3,
        sections: [
          { type: "grid", column_span: 3, cards: [overviewCard] },
          // Überwachungsräume haben keine Heizung – die große Raumkarte wäre leer,
          // sie erscheinen nur als Kachel in der Übersicht.
          // Auch Überwachungsräume (ohne Thermostat) bekommen eine große Karte – die Karte
          // blendet Bedienung und Sollwert selbst aus und zeigt nur Messwerte und Hinweise.
          ...roomSections()
        ]
      };
      const hist = (mode) => ({ type: "custom:raumklima-history-card", ...H, mode, hours: 24, strip_prefix: prefix, grid_options: { columns: "full" } });
      const historyView = {
        title: t("Verlauf & Lernen"),
        path: "verlauf",
        icon: "mdi:chart-line",
        type: "sections",
        max_columns: 3,
        sections: [
          ...weather ? [{ type: "grid", column_span: 3, cards: [{ type: "weather-forecast", entity: weather, forecast_type: "hourly", show_current: true, show_forecast: true, grid_options: { columns: "full" } }] }] : [],
          { type: "grid", column_span: 3, cards: [hist("temperature")] },
          { type: "grid", column_span: 3, cards: [hist("humidity")] },
          { type: "grid", column_span: 3, cards: [hist("timeline")] },
          { type: "grid", column_span: 3, cards: [{ type: "custom:raumklima-learning-card", ...H, strip_prefix: prefix, grid_options: { columns: "full" } }] }
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
      if (layout && layout.beta_panel) {
        for (const v of [insightsView, reportView, logView, settingsView]) {
          const card = { ...v.sections[0].cards[0] };
          delete card.grid_options;
          delete v.sections;
          delete v.max_columns;
          v.type = "panel";
          v.cards = [card];
        }
      }
      return { title: config.title || t("Heizung"), views: [roomsView, insightsView, historyView, reportView, logView, settingsView] };
    }
  };

  // src/index.js
  if (!customElements.get("raumklima-card")) customElements.define("raumklima-card", RaumklimaCard);
  if (!customElements.get("raumklima-medium-card")) customElements.define("raumklima-medium-card", RaumklimaMediumCard);
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
      { type: "raumklima-medium-card", name: t("Raumklima – Raum kompakt"), description: t("Kompakte Raumkarte mit Ist, Ziel und schneller Regelung"), preview: true },
      { type: "raumklima-overview-card", name: t("Raumklima – Übersicht"), description: t("Alle Räume und Außenklima auf einen Blick"), preview: true },
      { type: "raumklima-settings-card", name: t("Raumklima – Einstellungen"), description: t("Was eingestellt ist, wer welche Hinweise bekommt – mit Reglern"), preview: false },
      { type: "raumklima-history-card", name: t("Raumklima – Verlauf"), description: t("Temperatur, Luftfeuchte oder Zeitleiste aller Räume"), preview: false },
      { type: "raumklima-log-card", name: t("Raumklima – Protokoll"), description: t("Was wann warum entschieden wurde – live, mit Filtern"), preview: false },
      { type: "raumklima-report-card", name: t("Raumklima – Heizbericht"), description: t("Woche und Monat: Heizstunden, Ersparnis, wetterbereinigter Vergleich, Gesundheit"), preview: false },
      { type: "raumklima-energy-card", name: t("Raumklima – Energie"), description: t("Zähler, Tarif und Kosten im Zeitraum"), preview: false },
      { type: "raumklima-learning-card", name: t("Raumklima – Lernen"), description: t("Was Raumklima aus deinen Daten gelernt hat"), preview: false },
      { type: "raumklima-demo-card", name: t("Raumklima – Demo"), description: t("Simulierte Räume ohne Hardware"), preview: true }
    );
  }
  if (!customElements.get("raumklima-settings-card")) customElements.define("raumklima-settings-card", RaumklimaSettingsCard);
  if (!customElements.get("raumklima-history-card")) customElements.define("raumklima-history-card", RaumklimaHistoryCard);
  if (!customElements.get("raumklima-log-card")) customElements.define("raumklima-log-card", RaumklimaLogCard);
  if (!customElements.get("raumklima-report-card")) customElements.define("raumklima-report-card", RaumklimaReportCard);
  if (!customElements.get("raumklima-energy-card")) customElements.define("raumklima-energy-card", RaumklimaEnergyCard);
  if (!customElements.get("raumklima-learning-card")) customElements.define("raumklima-learning-card", RaumklimaLearningCard);
  if (!customElements.get("raumklima-demo-card")) customElements.define("raumklima-demo-card", RaumklimaDemoCard);
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
