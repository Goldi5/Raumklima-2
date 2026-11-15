"""PDF-Heizbericht zeichnen (fpdf2, ohne Browser, ohne Internet).

Seite 1: Kopf, Kennzahlen, Vergleich mit Vorzeitraum/Vorjahr, Diagramm.
Seite 2: Räume im Detail, Auffälligkeiten und Tipps.
Schrift: Helvetica (eingebaut) mit Windows-1252 – Umlaute, „“, – und € gehen; andere Zeichen
(₂, →, Emojis) werden ersetzt.
"""

from __future__ import annotations

from datetime import date, datetime
from typing import Any

from fpdf import FPDF

NAVY = (27, 34, 48)
HEAT = (255, 122, 69)
AIR = (79, 157, 255)
OK = (46, 196, 166)
WARN = (255, 176, 32)
ALERT = (229, 72, 77)
GREY = (110, 118, 130)
LIGHT = (244, 245, 247)
LINE = (225, 228, 233)
SEV_COLOR = {"alert": ALERT, "warn": WARN, "info": AIR, "good": OK}

MONTHS = {
    "de": ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
    "en": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    "fr": ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
}
WEEKDAYS = {"de": ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"], "en": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], "fr": ["lun", "mar", "mer", "jeu", "ven", "sam", "dim"]}

L = {
    "de": {
        "brand": "RAUMKLIMA · HEIZBERICHT",
        "week": "Woche {w}",
        "month": "{m} {y}",
        "season": "Heizsaison {a}/{b}",
        "created": "erstellt am {d}",
        "period": "Zeitraum",
        "heating": "Heizstunden",
        "heating_sub": "alle Räume zusammen",
        "saving": "Ersparnis",
        "saving_sub": "durch Absenkung",
        "comfort": "Wohlfühlzeit",
        "comfort_sub": "auf Zieltemperatur",
        "outdoor": "Außen Ø",
        "outdoor_sub": "{h} Heizgradtage",
        "vs_prev": "{c} ggü. Vorzeitraum",
        "compare": "Vergleich",
        "metric": "Kennzahl",
        "this": "Dieser Zeitraum",
        "prev": "Vorzeitraum",
        "ya": "Vorjahr",
        "m_heating": "Heizstunden",
        "m_valve": "Ventil-Volllaststunden",
        "m_deficit": "Gradstunden unter Ziel (K·h)",
        "m_hours": "Heizstunden",
        "m_hdd": "Heizgradtage",
        "m_outdoor": "Außentemperatur Ø",
        "m_setback": "Abgesenkt (h)",
        "m_comfort": "Auf Zieltemperatur",
        "m_humid": "Zu feucht (h)",
        "m_airings": "Lüftvorgänge",
        "m_airing": "Fenster offen (h)",
        "m_weather": "Wetterbereinigt",
        "chart": "Heizstunden pro Tag und Außentemperatur",
        "chart_season": "Heizstunden pro Monat und Außentemperatur",
        "rooms": "Räume",
        "room": "Raum",
        "c_heat": "Heizst.",
        "c_temp": "Ø °C",
        "c_hum": "Ø %",
        "c_humid": "zu feucht h",
        "c_air": "Lüften",
        "c_win": "Fenster h",
        "c_set": "abges. h",
        "c_ok": "am Ziel",
        "findings": "Auffälligkeiten und Tipps",
        "nodata": "Für diesen Zeitraum liegen noch keine Messwerte vor.",
        "score": "Raumklima-Note",
        "score_sub": "{p} von 100 Punkten",
        "score_hist": "Verlauf",
        "money": "≈ {e} € gespart (Schätzung)",
        "energy": "Energie und Kosten",
        "e_value": "Wert",
        "e_source": "Quelle",
        "e_meter": "Zähler",
        "e_tariff": "Tarif",
        "e_price": "Arbeitspreis",
        "e_base": "Grundpreis",
        "e_kwh": "Verbrauch",
        "e_cost": "Kosten",
        "e_year": "Jahr",
        "e_pv": "PV-Ertrag",
        "e_heat": "Wärmemenge",
        "e_tank": "Tank",
        "e_tank_use": "Tankverbrauch",
        "e_reicht": "Reicht noch",
        "e_order": "Ölbestellung",
        "e_market": "Marktpreis",
        "e_none": "Keine Energie-Erfassung eingerichtet.",
        "e_now": "gerade",
        "e_today": "heute",
        "e_days": "{n} Tage",
        "e_yes": "ja",
        "e_no": "nein",
        "src_electric": "Strom",
        "src_gas": "Gas",
        "src_oil": "Heizöl",
        "src_heatpump": "Wärmepumpe",
        "src_district": "Fernwärme",
        "glance": "Auf einen Blick",
        "top_tips": "Die wichtigsten Tipps",
        "cost_kpi": "Kosten",
        "per_day": "{v} € pro Tag",
        "e_use": "Verbrauch",
        "e_use_sub": "Heizung {h} · Warmwasser {w} kWh",
        "e_cop": "Arbeitszahl",
        "e_cop_sub": "Heizung, gemessen",
        "e_cop_ww": "Warmwasser {v}",
        "e_annual": "Hochrechnung Jahr",
        "e_annual_sub": "nach Gradtagen",
        "e_annual_none": "ab Heizsaison",
        "e_paid": "Bezahlt Ø",
        "e_paid_sub": "Mittel {m} ct · {p} % günstig",
        "e_self": "Aus PV & Batterie",
        "e_self_sub": "kostet nichts",
        "e_house": "Anteil Hausstrom",
        "e_house_sub": "{h} kWh Haus gesamt",
        "e_daily": "Verbrauch pro Tag",
        "e_leg_heat": "Heizung",
        "e_leg_ww": "Warmwasser",
        "e_leg_out": "Außen °C",
        "e_rooms": "Wer verbraucht die Wärme?",
        "e_rooms_note": "nach Ventilöffnung × Stunden, ohne Warmwasser und Grundgebühr",
        "e_details": "Einzelwerte",
        "e_sources": "Datenquellen",
        "e_ww_heat": "Warmwasser-Wärme",
        "e_ww": "Warmwasser",
        "e_m3": "Gas",
        "e_liter": "Heizöl",
        "e_oilprice": "Ölpreis",
        "e_30d": "Marktpreis 30-Tage-Ø",
        "e_unit_year": " €",
        "e_heat_price": "Wärmepreis",
        "e_fallbacks": "Reserve-Preisquellen",
        "e_house_meter": "Hausverbrauch",
        "e_grid": "Netzbezug",
        "e_ww_meter": "Warmwasser-Zähler",
        "c_trend": "Verlauf °C / %",
        "ranking": "Rangliste",
        "r_eco": "Sparsamster Raum",
        "r_eco_v": "{v} h Volllast/Tag",
        "r_warm": "Wärmster Raum",
        "r_comfort": "Beste Wohlfühlzeit",
        "r_improved": "Größte Verbesserung",
        "weekday": "Werktag und Wochenende",
        "wd": "Werktage",
        "we": "Wochenende",
        "w_heat": "Heizstunden pro Tag",
        "w_comfort": "Auf Zieltemperatur",
        "w_away": "Niemand da (h pro Tag)",
        "w_temp": "Ø Temperatur",
        "humidity": "Feuchte und Schimmel",
        "h_light": "Ampel",
        "h_avg": "Ø Feuchte",
        "h_humid": "zu feucht h",
        "h_mold": "Schimmel h",
        "h_co2": "CO2 Ø ppm",
        "h_co2h": "CO2 > 1000 h",
        "h_problem": "Problemraum: {r} – öfter kurz stoßlüften, Türen beim Duschen/Kochen zu.",
        "h_none": "Keine Feuchtefühler – keine Auswertung möglich.",
        "airing": "Lüft-Bilanz",
        "a_n": "Lüften",
        "a_avg": "Ø Dauer",
        "a_long": "> 30 min",
        "a_asked": "„Bitte lüften“",
        "a_done": "fertig",
        "a_cold": "kühlt aus",
        "a_ok": "Erfolg",
        "a_none": "Noch keine Lüftvorgänge erfasst.",
        "heatmap": "Wann wird geheizt?",
        "heatmap_sub": "Anteil der Zeit, in der geheizt wird – je Wochentag und Stunde (alle Räume)",
        "heatmap_none": "Das Wärmebild entsteht ab jetzt – nach ein paar Tagen ist es hier zu sehen.",
        "presence": "Anwesenheit",
        "p_away": "Niemand zu Hause",
        "p_preheat": "Vorgeheizt",
        "p_arrive": "Warm bei Ankunft",
        "p_occ": "Raum belegt (Präsenzmelder)",
        "p_heatup": "Aufheizzeit für +2 °C",
        "p_times": "{n}×",
        "reliability": "Zuverlässigkeit",
        "x_failed": "keine Antwort h",
        "x_down": "nicht erreichbar h",
        "rf_cmds": "Funkbefehle (Wiederholungen)",
        "x_blips": "Kurze Verbindungsunterbrechungen zu allen Thermostaten: {n}×",
        "x_bat": "Batterien",
        "x_ok": "Keine Ausfälle – alle Thermostate haben zuverlässig geantwortet.",
        "highlights": "Die Heizsaison im Rückblick",
        "s_first": "Erster Heiztag",
        "s_last": "Letzter Heiztag",
        "s_cold": "Kältester Tag",
        "s_pause": "Längste Heizpause",
        "s_pause_v": "{n} Tage (bis {d})",
        "s_top": "Monat mit dem höchsten Bedarf",
        "tips": "Spartipps",
        "notes": "Heizstunden: Zeit, in der ein Thermostat heizt. Wetterbereinigt: Ventilöffnung je Heizgradtag – "
        "eine kältere Woche zählt nicht als schlechter. Ersparnis: Faustregel ~6 % je Grad Absenkung.",
        "footer": "Raumklima für Home Assistant · Seite {p}/{n}",
        "none": "–",
    },
    "en": {
        "brand": "RAUMKLIMA · HEATING REPORT",
        "week": "Week {w}",
        "month": "{m} {y}",
        "season": "Heating season {a}/{b}",
        "created": "created {d}",
        "period": "Period",
        "heating": "Heating hours",
        "heating_sub": "all rooms together",
        "saving": "Savings",
        "saving_sub": "from setback",
        "comfort": "Comfort time",
        "comfort_sub": "at target temperature",
        "outdoor": "Outdoor avg",
        "outdoor_sub": "{h} heating degree days",
        "vs_prev": "{c} vs previous period",
        "compare": "Comparison",
        "metric": "Metric",
        "this": "This period",
        "prev": "Previous",
        "ya": "Year ago",
        "m_heating": "Heating hours",
        "m_valve": "Valve full-load hours",
        "m_deficit": "Degree-hours below target (K·h)",
        "m_hours": "Heating hours",
        "m_hdd": "Heating degree days",
        "m_outdoor": "Outdoor temperature avg",
        "m_setback": "Set back (h)",
        "m_comfort": "At target temperature",
        "m_humid": "Too humid (h)",
        "m_airings": "Airings",
        "m_airing": "Window open (h)",
        "m_weather": "Weather-adjusted",
        "chart": "Heating hours per day and outdoor temperature",
        "chart_season": "Heating hours per month and outdoor temperature",
        "rooms": "Rooms",
        "room": "Room",
        "c_heat": "Heat h",
        "c_temp": "Avg °C",
        "c_hum": "Avg %",
        "c_humid": "humid h",
        "c_air": "Airings",
        "c_win": "Window h",
        "c_set": "Setback h",
        "c_ok": "at target",
        "findings": "Findings and tips",
        "nodata": "No measurements for this period yet.",
        "score": "Raumklima grade",
        "score_sub": "{p} of 100 points",
        "score_hist": "History",
        "money": "≈ {e} € saved (estimate)",
        "energy": "Energy and costs",
        "e_value": "Value",
        "e_source": "Source",
        "e_meter": "Meter",
        "e_tariff": "Tariff",
        "e_price": "Unit price",
        "e_base": "Base price",
        "e_kwh": "Consumption",
        "e_cost": "Costs",
        "e_year": "Year",
        "e_pv": "PV yield",
        "e_heat": "Heat output",
        "e_tank": "Tank",
        "e_tank_use": "Tank consumption",
        "e_reicht": "Lasts",
        "e_order": "Oil order",
        "e_market": "Market price",
        "e_none": "No energy tracking configured.",
        "e_now": "now",
        "e_today": "today",
        "e_days": "{n} days",
        "e_yes": "yes",
        "e_no": "no",
        "src_electric": "Electricity",
        "src_gas": "Gas",
        "src_oil": "Heating oil",
        "src_heatpump": "Heat pump",
        "src_district": "District heat",
        "glance": "At a glance",
        "top_tips": "Top tips",
        "cost_kpi": "Costs",
        "per_day": "{v} € per day",
        "e_use": "Consumption",
        "e_use_sub": "heating {h} · hot water {w} kWh",
        "e_cop": "Efficiency",
        "e_cop_sub": "heating, measured",
        "e_cop_ww": "hot water {v}",
        "e_annual": "Annual forecast",
        "e_annual_sub": "by degree days",
        "e_annual_none": "from heating season",
        "e_paid": "Paid Ø",
        "e_paid_sub": "average {m} ct · {p} % cheap",
        "e_self": "From PV & battery",
        "e_self_sub": "free of charge",
        "e_house": "Share of house power",
        "e_house_sub": "{h} kWh house total",
        "e_daily": "Consumption per day",
        "e_leg_heat": "Heating",
        "e_leg_ww": "Hot water",
        "e_leg_out": "Outdoor °C",
        "e_rooms": "Who uses the heat?",
        "e_rooms_note": "by valve opening × hours, without hot water and base fee",
        "e_details": "Values",
        "e_sources": "Data sources",
        "e_ww_heat": "Hot water heat",
        "e_ww": "Hot water",
        "e_m3": "Gas",
        "e_liter": "Heating oil",
        "e_oilprice": "Oil price",
        "e_30d": "Market 30-day avg.",
        "e_unit_year": " €",
        "e_heat_price": "Heat price",
        "e_fallbacks": "Fallback price sources",
        "e_house_meter": "House consumption",
        "e_grid": "Grid import",
        "e_ww_meter": "Hot water meter",
        "c_trend": "Trend °C / %",
        "ranking": "Ranking",
        "r_eco": "Most economical room",
        "r_eco_v": "{v} full-load h/day",
        "r_warm": "Warmest room",
        "r_comfort": "Best comfort time",
        "r_improved": "Biggest improvement",
        "weekday": "Weekdays and weekend",
        "wd": "Weekdays",
        "we": "Weekend",
        "w_heat": "Heating hours per day",
        "w_comfort": "At target temperature",
        "w_away": "Nobody home (h per day)",
        "w_temp": "Avg temperature",
        "humidity": "Humidity and mould",
        "h_light": "Status",
        "h_avg": "Avg humidity",
        "h_humid": "humid h",
        "h_mold": "mould h",
        "h_co2": "CO2 avg ppm",
        "h_co2h": "CO2 > 1000 h",
        "h_problem": "Problem room: {r} – air briefly more often, keep doors closed while showering/cooking.",
        "h_none": "No humidity sensors – no analysis possible.",
        "airing": "Airing summary",
        "a_n": "Airings",
        "a_avg": "Avg length",
        "a_long": "> 30 min",
        "a_asked": "“Please air”",
        "a_done": "done",
        "a_cold": "cooling",
        "a_ok": "Success",
        "a_none": "No airings recorded yet.",
        "heatmap": "When is it heating?",
        "heatmap_sub": "Share of time heating – per weekday and hour (all rooms)",
        "heatmap_none": "The heat map is collected from now on – it shows up here after a few days.",
        "presence": "Presence",
        "p_away": "Nobody home",
        "p_preheat": "Preheated",
        "p_arrive": "Warm on arrival",
        "p_occ": "Room occupied (presence sensors)",
        "p_heatup": "Heat-up time for +2 °C",
        "p_times": "{n}×",
        "reliability": "Reliability",
        "x_failed": "no response h",
        "x_down": "unreachable h",
        "rf_cmds": "radio commands (retries)",
        "x_blips": "Short connection drops to all thermostats: {n}×",
        "x_bat": "Batteries",
        "x_ok": "No failures – all thermostats responded reliably.",
        "highlights": "The heating season in review",
        "s_first": "First heating day",
        "s_last": "Last heating day",
        "s_cold": "Coldest day",
        "s_pause": "Longest heating pause",
        "s_pause_v": "{n} days (until {d})",
        "s_top": "Month with the highest demand",
        "tips": "Saving tips",
        "notes": "Heating hours: time a thermostat is heating. Weather-adjusted: valve opening per heating degree day – "
        "a colder week doesn't count as worse. Savings: rule of thumb ~6 % per degree of setback.",
        "footer": "Raumklima for Home Assistant · page {p}/{n}",
        "none": "–",
    },
    "fr": {
        "brand": "RAUMKLIMA · RAPPORT DE CHAUFFAGE",
        "week": "Semaine {w}",
        "month": "{m} {y}",
        "season": "Saison de chauffage {a}/{b}",
        "created": "créé le {d}",
        "period": "Période",
        "heating": "Heures de chauffe",
        "heating_sub": "toutes les pièces",
        "saving": "Économies",
        "saving_sub": "par l’abaissement",
        "comfort": "Temps de confort",
        "comfort_sub": "à la température cible",
        "outdoor": "Extérieur moy.",
        "outdoor_sub": "{h} degrés-jours de chauffage",
        "vs_prev": "{c} vs période préc.",
        "compare": "Comparaison",
        "metric": "Indicateur",
        "this": "Cette période",
        "prev": "Précédente",
        "ya": "Il y a un an",
        "m_heating": "Heures de chauffe",
        "m_valve": "Heures vanne pleine ouverture",
        "m_deficit": "Degrés-heures sous la cible (K·h)",
        "m_hours": "Heures de chauffe",
        "m_hdd": "Degrés-jours de chauffage",
        "m_outdoor": "Température extérieure moy.",
        "m_setback": "Abaissé (h)",
        "m_comfort": "À la température cible",
        "m_humid": "Trop humide (h)",
        "m_airings": "Aérations",
        "m_airing": "Fenêtre ouverte (h)",
        "m_weather": "Corrigé du climat",
        "chart": "Heures de chauffe par jour et température extérieure",
        "chart_season": "Heures de chauffe par mois et température extérieure",
        "rooms": "Pièces",
        "room": "Pièce",
        "c_heat": "Chauffe h",
        "c_temp": "Moy. °C",
        "c_hum": "Moy. %",
        "c_humid": "humide h",
        "c_air": "Aérations",
        "c_win": "Fenêtre h",
        "c_set": "Abaissé h",
        "c_ok": "à la cible",
        "findings": "Constats et conseils",
        "nodata": "Pas encore de mesures pour cette période.",
        "score": "Note Raumklima",
        "score_sub": "{p} points sur 100",
        "score_hist": "Évolution",
        "money": "≈ {e} € économisés (estimation)",
        "energy": "Énergie et coûts",
        "e_value": "Valeur",
        "e_source": "Source",
        "e_meter": "Compteur",
        "e_tariff": "Tarif",
        "e_price": "Prix unitaire",
        "e_base": "Frais fixes",
        "e_kwh": "Consommation",
        "e_cost": "Coûts",
        "e_year": "Année",
        "e_pv": "Rendement PV",
        "e_heat": "Chaleur produite",
        "e_tank": "Réservoir",
        "e_tank_use": "Consommation du réservoir",
        "e_reicht": "Dure encore",
        "e_order": "Commande de fioul",
        "e_market": "Prix du marché",
        "e_none": "Aucun suivi d’énergie configuré.",
        "e_now": "maintenant",
        "e_today": "aujourd’hui",
        "e_days": "{n} jours",
        "e_yes": "oui",
        "e_no": "non",
        "src_electric": "Électricité",
        "src_gas": "Gaz",
        "src_oil": "Fioul",
        "src_heatpump": "Pompe à chaleur",
        "src_district": "Chaleur réseau",
        "glance": "En un coup d’œil",
        "top_tips": "Les meilleurs conseils",
        "cost_kpi": "Coûts",
        "per_day": "{v} € par jour",
        "e_use": "Consommation",
        "e_use_sub": "chauffage {h} · eau chaude {w} kWh",
        "e_cop": "Rendement",
        "e_cop_sub": "chauffage, mesuré",
        "e_cop_ww": "eau chaude {v}",
        "e_annual": "Prévision annuelle",
        "e_annual_sub": "selon degrés-jours",
        "e_annual_none": "dès la saison de chauffe",
        "e_paid": "Payé Ø",
        "e_paid_sub": "moyenne {m} ct · {p} % bon marché",
        "e_self": "Du PV et de la batterie",
        "e_self_sub": "gratuit",
        "e_house": "Part de la maison",
        "e_house_sub": "{h} kWh maison au total",
        "e_daily": "Consommation par jour",
        "e_leg_heat": "Chauffage",
        "e_leg_ww": "Eau chaude",
        "e_leg_out": "Extérieur °C",
        "e_rooms": "Qui consomme la chaleur ?",
        "e_rooms_note": "selon ouverture de vanne × heures, sans eau chaude ni abonnement",
        "e_details": "Valeurs",
        "e_sources": "Sources des données",
        "e_ww_heat": "Chaleur eau chaude",
        "e_ww": "Eau chaude",
        "e_m3": "Gaz",
        "e_liter": "Fioul",
        "e_oilprice": "Prix du fioul",
        "e_30d": "Marché moyenne 30 j",
        "e_unit_year": " €",
        "e_heat_price": "Prix de la chaleur",
        "e_fallbacks": "Sources de prix de réserve",
        "e_house_meter": "Consommation maison",
        "e_grid": "Soutirage réseau",
        "e_ww_meter": "Compteur eau chaude",
        "c_trend": "Évolution °C / %",
        "ranking": "Classement",
        "r_eco": "Pièce la plus économe",
        "r_eco_v": "{v} h pleine charge/jour",
        "r_warm": "Pièce la plus chaude",
        "r_comfort": "Meilleur temps de confort",
        "r_improved": "Plus forte amélioration",
        "weekday": "Semaine et week-end",
        "wd": "En semaine",
        "we": "Week-end",
        "w_heat": "Heures de chauffe par jour",
        "w_comfort": "À la température cible",
        "w_away": "Personne à la maison (h par jour)",
        "w_temp": "Température moy.",
        "humidity": "Humidité et moisissures",
        "h_light": "État",
        "h_avg": "Humidité moy.",
        "h_humid": "humide h",
        "h_mold": "moisissures h",
        "h_co2": "CO2 moy. ppm",
        "h_co2h": "CO2 > 1000 h",
        "h_problem": "Pièce à problème : {r} – aérer brièvement plus souvent, garder les portes fermées pendant la douche/la cuisine.",
        "h_none": "Pas de capteur d’humidité – analyse impossible.",
        "airing": "Bilan d’aération",
        "a_n": "Aérations",
        "a_avg": "Durée moy.",
        "a_long": "> 30 min",
        "a_asked": "« Aérer »",
        "a_done": "terminé",
        "a_cold": "refroidit",
        "a_ok": "Réussite",
        "a_none": "Aucune aération enregistrée pour l’instant.",
        "heatmap": "Quand chauffe-t-on ?",
        "heatmap_sub": "Part du temps de chauffe – par jour de la semaine et par heure (toutes les pièces)",
        "heatmap_none": "La carte de chaleur est collectée à partir de maintenant – elle apparaîtra ici après quelques jours.",
        "presence": "Présence",
        "p_away": "Personne à la maison",
        "p_preheat": "Préchauffé",
        "p_arrive": "Chaud à l’arrivée",
        "p_occ": "Pièce occupée (détecteurs de présence)",
        "p_heatup": "Temps de montée pour +2 °C",
        "p_times": "{n}×",
        "reliability": "Fiabilité",
        "x_failed": "sans réponse h",
        "x_down": "injoignable h",
        "rf_cmds": "commandes radio (répétitions)",
        "x_blips": "Courtes coupures de connexion avec tous les thermostats : {n}×",
        "x_bat": "Piles",
        "x_ok": "Aucune panne – tous les thermostats ont répondu de façon fiable.",
        "highlights": "Retour sur la saison de chauffage",
        "s_first": "Premier jour de chauffe",
        "s_last": "Dernier jour de chauffe",
        "s_cold": "Jour le plus froid",
        "s_pause": "Plus longue pause de chauffage",
        "s_pause_v": "{n} jours (jusqu’au {d})",
        "s_top": "Mois au besoin le plus élevé",
        "tips": "Conseils d’économie",
        "notes": "Heures de chauffe : temps pendant lequel un thermostat chauffe. Corrigé du climat : ouverture de vanne par degré-jour – "
        "une semaine plus froide ne compte pas comme moins bonne. Économies : règle empirique ~6 % par degré d’abaissement.",
        "footer": "Raumklima pour Home Assistant · page {p}/{n}",
        "none": "–",
    },
}

_REPLACE = {
    "₂": "2", "→": "->", "←": "<-", "≈": "~", "−": "-", "≤": "<=", "≥": ">=", "✓": "", "✕": "x",
    "‑": "-", " ": " ", " ": " ",
}


def clean(text: str) -> str:
    """Nur Zeichen, die die eingebaute Schrift kann (Windows-1252)."""
    for a, b in _REPLACE.items():
        text = text.replace(a, b)
    return text.encode("cp1252", "ignore").decode("cp1252").strip() if text else text


def num(value: Any, lang: str, digits: int = 1, unit: str = "") -> str:
    if value is None:
        return L[lang]["none"]
    text = f"{value:.{digits}f}"
    if lang in ("de", "fr"):
        text = text.replace(".", ",")
    return text + unit


def signed(value: float | None, lang: str) -> str:
    if value is None:
        return L[lang]["none"]
    sign = "+" if value > 0 else "-" if value < 0 else "±"
    return f"{sign}{abs(value):.0f} %"


def date_text(d: date, lang: str) -> str:
    if lang == "de":
        return d.strftime("%d.%m.%Y")
    if lang == "fr":
        return d.strftime("%d/%m/%Y")
    return d.strftime("%d %b %Y")


def title_for(kind: str, start: date, end: date, lang: str) -> str:
    tx = L[lang]
    if kind == "week":
        return tx["week"].format(w=start.isocalendar()[1])
    if kind == "month":
        return tx["month"].format(m=MONTHS[lang][start.month - 1], y=start.year)
    return tx["season"].format(a=start.year, b=str(end.year)[-2:] if end.year != start.year else end.year)


class _Pdf(FPDF):
    def __init__(self, lang: str) -> None:
        super().__init__(format="A4")
        self.lang = lang
        self.core_fonts_encoding = "windows-1252"
        self.set_auto_page_break(True, margin=18)
        self.set_margins(15, 15, 15)
        self.alias_nb_pages("{nb}")

    def footer(self) -> None:
        self.set_y(-12)
        self.set_font("Helvetica", size=7.5)
        self.set_text_color(*GREY)
        self.cell(0, 5, clean(L[self.lang]["footer"].format(p=self.page_no(), n="{nb}")), align="C")

    # -------------------------------------------------------------- Bausteine
    def heading(self, text: str) -> None:
        self.ln(3)
        self.set_font("Helvetica", "B", 12.5)
        self.set_text_color(*NAVY)
        self.cell(0, 7, clean(text), new_x="LMARGIN", new_y="NEXT")
        self.set_draw_color(*HEAT)
        self.set_line_width(0.6)
        self.line(self.l_margin, self.get_y(), self.l_margin + 18, self.get_y())
        self.ln(3)

    def kpi(self, x: float, y: float, w: float, label: str, value: str, sub: str, color: tuple[int, int, int]) -> None:
        self.set_fill_color(*LIGHT)
        self.rect(x, y, w, 24, style="F", round_corners=True, corner_radius=2.5)
        self.set_fill_color(*color)
        self.rect(x, y + 3, 1.2, 18, style="F")
        self.set_xy(x + 4, y + 3)
        self.set_font("Helvetica", size=7.5)
        self.set_text_color(*GREY)
        self.cell(w - 6, 4, clean(label.upper()))
        self.set_xy(x + 4, y + 8)
        self.set_font("Helvetica", "B", 16)
        self.set_text_color(*NAVY)
        self.cell(w - 6, 8, clean(value))
        self.set_xy(x + 4, y + 17)
        self.set_font("Helvetica", size=7.5)
        self.set_text_color(*GREY)
        self.cell(w - 6, 4, clean(sub))

    def table(self, header: list[str], rows: list[list[str]], widths: list[float], align_first: str = "L") -> None:
        self.set_font("Helvetica", "B", 8.5)
        self.set_fill_color(*NAVY)
        self.set_text_color(255, 255, 255)
        for i, h in enumerate(header):
            self.cell(widths[i], 7, clean(h), fill=True, align=align_first if i == 0 else "R")
        self.ln()
        self.set_font("Helvetica", size=8.5)
        for n, row in enumerate(rows):
            if self.will_page_break(6.5):
                self.add_page()
            self.set_fill_color(*(LIGHT if n % 2 else (255, 255, 255)))
            self.set_text_color(*NAVY)
            for i, c in enumerate(row):
                self.cell(widths[i], 6.5, clean(c), fill=True, align=align_first if i == 0 else "R")
            self.ln()

    def chart(self, points: list[dict[str, Any]], labels: list[str], height: float = 52) -> None:
        x0, y0 = self.l_margin + 8, self.get_y() + 2
        w = self.w - self.l_margin - self.r_margin - 16
        h = height
        values = [p["heating_h"] or 0 for p in points]
        temps = [p["outdoor"] for p in points if p["outdoor"] is not None]
        top = max(values + [1.0])
        self.set_draw_color(*LINE)
        self.set_line_width(0.2)
        for i in range(5):
            yy = y0 + h - h * i / 4
            self.line(x0, yy, x0 + w, yy)
            self.set_font("Helvetica", size=6.5)
            self.set_text_color(*GREY)
            self.set_xy(x0 - 9, yy - 2)
            self.cell(8, 4, num(top * i / 4, self.lang, 0), align="R")
        n = max(len(points), 1)
        slot = w / n
        bw = min(slot * 0.62, 14)
        self.set_fill_color(*HEAT)
        for i, v in enumerate(values):
            bh = h * v / top
            if bh > 0:
                self.rect(x0 + i * slot + (slot - bw) / 2, y0 + h - bh, bw, bh, style="F")
        # Außentemperatur als Linie (eigene Skala, rechts)
        if temps:
            lo, hi = min(temps + [0.0]), max(temps + [10.0])
            span = max(hi - lo, 1.0)
            pts = [
                (x0 + i * slot + slot / 2, y0 + h - h * ((p["outdoor"] - lo) / span))
                for i, p in enumerate(points)
                if p["outdoor"] is not None
            ]
            self.set_draw_color(*AIR)
            self.set_line_width(0.6)
            for a, b in zip(pts, pts[1:], strict=False):
                self.line(a[0], a[1], b[0], b[1])
            self.set_fill_color(*AIR)
            for px, py in pts:
                self.ellipse(px - 0.8, py - 0.8, 1.6, 1.6, style="F")
            self.set_font("Helvetica", size=6.5)
            self.set_text_color(*AIR)
            for val in (lo, hi):
                self.set_xy(x0 + w + 1, y0 + h - h * ((val - lo) / span) - 2)
                self.cell(8, 4, num(val, self.lang, 0, "°"))
        # Beschriftung unten (nicht zu dicht)
        step = max(1, round(n / 16))
        self.set_font("Helvetica", size=6.5)
        self.set_text_color(*GREY)
        for i, lab in enumerate(labels):
            if i % step:
                continue
            self.set_xy(x0 + i * slot, y0 + h + 1)
            self.cell(slot * step, 4, clean(lab), align="L" if step > 1 else "C")
        self.set_y(y0 + h + 7)


GRADE_COLOR = {"A": OK, "B": (120, 200, 90), "C": WARN, "D": (255, 140, 60), "E": HEAT, "F": ALERT}
LIGHT_COLOR = {"green": OK, "yellow": WARN, "red": ALERT}


def _heat_color(v: float | None) -> tuple[int, int, int]:
    if v is None:
        return (240, 241, 244)
    v = max(0.0, min(1.0, v))
    return tuple(round(255 + (c - 255) * v) for c in HEAT)  # weiß → orange


def _sparkline(pdf: _Pdf, x: float, y: float, w: float, h: float, values: list[float | None], color: tuple[int, int, int]) -> None:
    pts = [(i, v) for i, v in enumerate(values) if v is not None]
    if len(pts) < 2:
        return
    lo, hi = min(v for _, v in pts), max(v for _, v in pts)
    span = max(hi - lo, 0.5)
    n = max(len(values) - 1, 1)
    xy = [(x + w * i / n, y + h - h * (v - lo) / span) for i, v in pts]
    pdf.set_draw_color(*color)
    pdf.set_line_width(0.35)
    for a, b in zip(xy, xy[1:], strict=False):
        pdf.line(a[0], a[1], b[0], b[1])


def render(data: dict[str, Any], home: str, created: datetime) -> bytes:
    """PDF-Bytes aus den Zahlen von report_data.build() – eine Funktion je Seite."""
    pdf, has_data = _page_overview(data, home, created)
    if not has_data:
        return bytes(pdf.output())  # keine Heizstunden: nur Seite 1 mit Hinweis
    _page_energy(pdf, data)
    _page_rooms(pdf, data)
    _page_humidity(pdf, data)
    _page_devices(pdf, data)
    return bytes(pdf.output())


def _period_line(pdf: _Pdf, data: dict[str, Any]) -> None:
    """Datumsbereich auf jeder Seite – auch wenn der Bericht „Woche“ heißt."""
    lang = data["lang"]
    start = date.fromisoformat(data["start"])
    end = date.fromisoformat(data["end"])
    pdf.set_font("Helvetica", size=8.5)
    pdf.set_text_color(*GREY)
    pdf.cell(
        0,
        5,
        clean(f"{L[lang]['period']}: {date_text(start, lang)} – {date_text(end, lang)}"),
        new_x="LMARGIN",
        new_y="NEXT",
    )
    pdf.ln(1)


def _page_overview(data: dict[str, Any], home: str, created: datetime) -> tuple[_Pdf, bool]:
    """Seite 1: Kopf mit Note, Kennzahlen, Vergleich, Verlaufsdiagramm. (pdf, hat Daten?)"""
    lang = data["lang"]
    tx = L[lang]
    start, end = date.fromisoformat(data["start"]), date.fromisoformat(data["end"])
    cur, prev, ya = data["current"], data["previous"], data["year_ago"]
    total = cur["total"]
    pdf = _Pdf(lang)
    pdf.set_title(clean(f"Raumklima – {title_for(data['kind'], start, end, lang)}"))
    pdf.set_author("Raumklima")
    pdf.add_page()
    full = pdf.w - 30

    # ---- Kopf
    pdf.set_fill_color(*NAVY)
    pdf.rect(0, 0, pdf.w, 40, style="F")
    pdf.set_xy(15, 10)
    pdf.set_font("Helvetica", "B", 8)
    pdf.set_text_color(*HEAT)
    pdf.cell(0, 4, tx["brand"], new_x="LMARGIN", new_y="NEXT")
    pdf.set_x(15)
    pdf.set_font("Helvetica", "B", 22)
    pdf.set_text_color(255, 255, 255)
    pdf.cell(0, 11, clean(title_for(data["kind"], start, end, lang)), new_x="LMARGIN", new_y="NEXT")
    pdf.set_x(15)
    pdf.set_font("Helvetica", size=9)
    pdf.set_text_color(200, 205, 214)
    sub = f"{date_text(start, lang)} – {date_text(end, lang)}"
    if home:
        sub += f" · {home}"
    sub += " · " + tx["created"].format(d=date_text(created.date(), lang))
    pdf.cell(0, 5, clean(sub))
    score = data.get("score")
    if score:
        points, grade = score
        cx = pdf.w - 30
        pdf.set_fill_color(*GRADE_COLOR.get(grade, GREY))
        pdf.ellipse(cx - 11, 8, 22, 22, style="F")
        pdf.set_xy(cx - 11, 14)
        pdf.set_font("Helvetica", "B", 20)
        pdf.set_text_color(255, 255, 255)
        pdf.cell(22, 10, grade, align="C")
        pdf.set_xy(cx - 22, 31)
        pdf.set_font("Helvetica", size=7)
        pdf.set_text_color(200, 205, 214)
        pdf.cell(44, 4, clean(f"{tx['score']} · {points}/100"), align="C")
    pdf.set_y(48)

    if not total["hours"]:
        pdf.set_font("Helvetica", size=11)
        pdf.set_text_color(*NAVY)
        pdf.multi_cell(0, 6, clean(tx["nodata"]))
        return pdf, False

    # ---- Kennzahlen
    gap, w = 4, (full - 12) / 4
    y = pdf.get_y()
    change = data.get("change")
    money = data.get("money")
    if money and money.get("period_cost"):
        pdf.kpi(15, y, w, tx["cost_kpi"], num(money["period_cost"], lang, 0, " €"),
                tx["per_day"].format(v=num(money["period_cost"] / max(data["days"], 1), lang, 2)), HEAT)
    else:
        pdf.kpi(15, y, w, tx["heating"], num(total["heating_h"], lang, 0, " h"),
                tx["vs_prev"].format(c=signed(change, lang)) if change is not None else tx["heating_sub"], HEAT)
    pdf.kpi(15 + (w + gap), y, w, tx["saving"], "≈ " + num(total["saving_pct"], lang, 0, " %") if total["saving_pct"] else "0 %",
            tx["money"].format(e=money["saved"]) if money else tx["saving_sub"], OK)
    pdf.kpi(15 + 2 * (w + gap), y, w, tx["comfort"], num(total["on_target_pct"], lang, 0, " %"), tx["comfort_sub"], AIR)
    pdf.kpi(15 + 3 * (w + gap), y, w, tx["outdoor"], num(cur["outdoor_avg"], lang, 1, " °C"), tx["outdoor_sub"].format(h=num(cur["hdd"], lang, 0)), NAVY)
    pdf.set_y(y + 27)
    hist = [h for h in data.get("score_history") or [] if h[1]]
    if len(hist) >= 2:
        pdf.set_font("Helvetica", size=7.5)
        pdf.set_text_color(*GREY)
        pdf.cell(22, 6, clean(tx["score"] + ":"))
        for label, grade in data["score_history"]:
            if not grade:
                continue
            x0 = pdf.get_x()
            pdf.set_fill_color(*GRADE_COLOR.get(grade, GREY))
            pdf.rect(x0, pdf.get_y() + 1, 5, 4, style="F", round_corners=True, corner_radius=1)
            pdf.set_text_color(255, 255, 255)
            pdf.set_font("Helvetica", "B", 7)
            pdf.cell(5, 6, grade, align="C")
            pdf.set_text_color(*GREY)
            pdf.set_font("Helvetica", size=6.5)
            pdf.cell(13, 6, clean(label))
        pdf.ln(6)

    # ---- Auf einen Blick: was war los, und die drei besten Tipps
    if data.get("story"):
        pdf.heading(tx["glance"])
        box_y = pdf.get_y()
        pdf.set_font("Helvetica", size=10)
        pdf.set_text_color(*NAVY)
        pdf.set_x(19)
        pdf.multi_cell(full - 8, 5.6, clean(" ".join(data["story"])), new_x="LMARGIN", new_y="NEXT")
        pdf.set_fill_color(*HEAT)
        pdf.rect(15, box_y, 1.2, pdf.get_y() - box_y, style="F")
        pdf.ln(2)
    if data.get("tips"):
        pdf.heading(tx["top_tips"])
        for i, tip in enumerate(data["tips"][:3], 1):
            y0 = pdf.get_y()
            pdf.set_fill_color(*OK)
            pdf.ellipse(15, y0 + 0.4, 5, 5, style="F")
            pdf.set_xy(15, y0 + 0.6)
            pdf.set_font("Helvetica", "B", 8)
            pdf.set_text_color(255, 255, 255)
            pdf.cell(5, 4.6, str(i), align="C")
            pdf.set_xy(23, y0)
            pdf.set_font("Helvetica", size=9.5)
            pdf.set_text_color(*NAVY)
            pdf.multi_cell(full - 8, 5.2, clean(tip), new_x="LMARGIN", new_y="NEXT")
            pdf.ln(1)

    # ---- Vergleich
    if pdf.will_page_break(80):
        pdf.add_page()
    pdf.heading(tx["compare"])

    def col(s: dict[str, Any] | None, key: str, digits: int = 0, unit: str = "", where: str = "total") -> str:
        if s is None:
            return tx["none"]
        value = s[where][key] if where else s[key]
        return num(value, lang, digits, unit)

    metric = data.get("metric") or "valve"
    metric_key = {"valve": "valve_h", "deficit": "deficit_kh", "hours": "heating_h"}[metric]
    metric_label = {"valve": "m_valve", "deficit": "m_deficit", "hours": "m_hours"}[metric]
    rows = [
        [tx["m_heating"], col(cur, "heating_h"), col(prev, "heating_h"), col(ya, "heating_h")],
        [tx[metric_label], col(cur, metric_key, 1), col(prev, metric_key, 1), col(ya, metric_key, 1)],
        [tx["m_hdd"], col(cur, "hdd", 0, "", ""), col(prev, "hdd", 0, "", ""), col(ya, "hdd", 0, "", "")],
        [tx["m_outdoor"], col(cur, "outdoor_avg", 1, " °C", ""), col(prev, "outdoor_avg", 1, " °C", ""), col(ya, "outdoor_avg", 1, " °C", "")],
        [tx["m_setback"], col(cur, "setback_h"), col(prev, "setback_h"), col(ya, "setback_h")],
        [tx["m_comfort"], col(cur, "on_target_pct", 0, " %"), col(prev, "on_target_pct", 0, " %"), col(ya, "on_target_pct", 0, " %")],
        [tx["m_humid"], col(cur, "humid_h"), col(prev, "humid_h"), col(ya, "humid_h")],
        [tx["m_airings"], col(cur, "airings"), col(prev, "airings"), col(ya, "airings")],
        [tx["m_airing"], col(cur, "airing_h", 1), col(prev, "airing_h", 1), col(ya, "airing_h", 1)],
        [tx["m_weather"], "", signed(change, lang), signed(data.get("change_year"), lang)],
    ]
    pdf.table([tx["metric"], tx["this"], tx["prev"], tx["ya"]], rows, [full * 0.4, full * 0.2, full * 0.2, full * 0.2])

    # ---- Diagramm
    points = data["series"]
    if data["kind"] == "season":
        labels = [MONTHS[lang][date.fromisoformat(p["date"]).month - 1][:3] for p in points]
    elif data["kind"] == "week":
        labels = [WEEKDAYS[lang][date.fromisoformat(p["date"]).weekday()] for p in points]
    else:
        labels = [str(date.fromisoformat(p["date"]).day) for p in points]
    if pdf.will_page_break(75):
        pdf.add_page()
    pdf.heading(tx["chart_season" if data["kind"] == "season" else "chart"])
    pdf.chart(points, labels)
    return pdf, True


def _energy_chart(pdf: _Pdf, daily: list[dict[str, Any]], lang: str, tx: dict[str, str]) -> None:
    """Tagesbalken Heizung + Warmwasser gestapelt, Außentemperatur als Linie."""
    days = daily[-62:]
    if len(days) < 2:
        return
    x0, y0 = pdf.l_margin + 8, pdf.get_y() + 2
    w = pdf.w - pdf.l_margin - pdf.r_margin - 16
    h = 46.0
    top = max([float(d.get("kwh") or 0) + float(d.get("ww") or 0) for d in days] + [1.0])
    pdf.set_draw_color(*LINE)
    pdf.set_line_width(0.2)
    for k in range(5):
        yy = y0 + h - h * k / 4
        pdf.line(x0, yy, x0 + w, yy)
        pdf.set_font("Helvetica", size=6.5)
        pdf.set_text_color(*GREY)
        pdf.set_xy(x0 - 9, yy - 2)
        pdf.cell(8, 4, num(top * k / 4, lang, 0), align="R")
    slot = w / len(days)
    bw = min(slot * 0.7, 12)
    for k, d in enumerate(days):
        heat = float(d.get("kwh") or 0)
        ww = float(d.get("ww") or 0)
        bx = x0 + k * slot + (slot - bw) / 2
        hh, hw = h * heat / top, h * ww / top
        if hh > 0:
            pdf.set_fill_color(*HEAT)
            pdf.rect(bx, y0 + h - hh, bw, hh, style="F")
        if hw > 0:
            pdf.set_fill_color(*AIR)
            pdf.rect(bx, y0 + h - hh - hw, bw, hw, style="F")
    temps = [(k, d["outdoor"]) for k, d in enumerate(days) if d.get("outdoor") is not None]
    if len(temps) >= 2:
        lo, hi = min(t for _, t in temps) - 1, max(t for _, t in temps) + 1
        pts = [(x0 + (k + 0.5) * slot, y0 + h - h * (t - lo) / (hi - lo)) for k, t in temps]
        pdf.set_draw_color(*NAVY)
        pdf.set_line_width(0.5)
        for a, b in zip(pts, pts[1:], strict=False):
            pdf.line(a[0], a[1], b[0], b[1])
        pdf.set_font("Helvetica", size=6.5)
        pdf.set_text_color(*NAVY)
        for val in (lo + 1, hi - 1):
            pdf.set_xy(x0 + w + 1, y0 + h - h * (val - lo) / (hi - lo) - 2)
            pdf.cell(8, 4, num(val, lang, 0, "°"))
    step = max(1, round(len(days) / 12))
    pdf.set_font("Helvetica", size=6.5)
    pdf.set_text_color(*GREY)
    for k, d in enumerate(days):
        if k % step:
            continue
        dd = date.fromisoformat(d["date"])
        pdf.set_xy(x0 + k * slot, y0 + h + 1)
        pdf.cell(slot * step, 4, f"{dd.day}.{dd.month}." if lang != "en" else f"{dd.month}/{dd.day}")
    # Legende
    pdf.set_xy(x0, y0 + h + 6)
    for label, color in ((tx["e_leg_heat"], HEAT), (tx["e_leg_ww"], AIR), (tx["e_leg_out"], NAVY)):
        if label == tx["e_leg_ww"] and not any(d.get("ww") for d in days):
            continue
        if label == tx["e_leg_out"] and len(temps) < 2:
            continue
        xx = pdf.get_x()
        pdf.set_fill_color(*color)
        pdf.rect(xx, pdf.get_y() + 1.3, 3, 3, style="F")
        pdf.set_x(xx + 4)
        pdf.cell(pdf.get_string_width(clean(label)) + 6, 5.5, clean(label))
    pdf.set_y(y0 + h + 13)


def _page_energy(pdf: _Pdf, data: dict[str, Any]) -> None:
    """Energie und Kosten: Kennzahlen je Energieart, Tagesverlauf, Kosten je Raum, Einzelwerte, Quellen."""
    lang = data["lang"]
    tx = L[lang]
    e = data.get("energy") or {}
    pdf.add_page()
    pdf.heading(tx["energy"])
    _period_line(pdf, data)
    if not e or not e.get("enabled"):
        pdf.set_font("Helvetica", size=10)
        pdf.set_text_color(*GREY)
        pdf.cell(0, 8, clean(tx["e_none"]), new_x="LMARGIN", new_y="NEXT")
        return

    money = data.get("money") or {}
    source = e.get("source")
    src_name = tx.get(f"src_{source}") or str(source or "–")
    kwh = e.get("kwh")
    ww = e.get("ww_kwh") or 0
    total = (kwh or 0) + ww if kwh is not None else None
    cost = money.get("period_cost")
    annual = money.get("annual")
    tank = e.get("tank") or {}
    full = pdf.w - 30
    days = max(int(data.get("days") or 1), 1)
    pdf.set_font("Helvetica", size=8.5)
    pdf.set_text_color(*GREY)
    pdf.cell(0, 5, clean(src_name), new_x="LMARGIN", new_y="NEXT")
    pdf.ln(1)

    def row(tiles: list[tuple[str, str, str, tuple[int, int, int]]]) -> None:
        if not tiles:
            return
        tw = (full - 4 * (len(tiles) - 1)) / len(tiles)
        y = pdf.get_y()
        for k, (label, value, sub, color) in enumerate(tiles):
            pdf.kpi(15 + k * (tw + 4), y, tw, label, value, sub, color)
        pdf.set_y(y + 28)

    first = [
        (tx["cost_kpi"], f"{num(cost, lang, 2)} €" if cost is not None else "–",
         tx["per_day"].format(v=num(cost / days, lang, 2)) if cost else "", HEAT),
        (tx["e_use"], f"{num(total, lang, 0)} kWh" if total is not None else "–",
         tx["e_use_sub"].format(h=num(kwh, lang, 0), w=num(ww, lang, 0)) if ww else "", HEAT),
    ]
    if source == "heatpump":
        cop = e.get("cop") or (e.get("efficiency") or None)
        sub = tx["e_cop_sub"] if e.get("cop") else ""
        if e.get("cop_ww"):
            sub = (sub + " · " if sub else "") + tx["e_cop_ww"].format(v=num(e["cop_ww"], lang, 1))
        first.append((tx["e_cop"], num(cop, lang, 1) if cop else "–", sub, OK))
    elif source == "oil" and tank:
        value = tank.get("current_percent")
        first.append((tx["e_tank"], f"{num(value, lang, 0)} %" if value is not None else f"{num(tank.get('current_l'), lang, 0)} L",
                      tx["e_days"].format(n=tank["days_left"]) if tank.get("days_left") is not None else "", WARN))
    elif source == "gas" and e.get("m3") is not None:
        first.append((tx["e_m3"], f"{num(e['m3'], lang, 1)} m³", "", AIR))
    first.append((tx["e_annual"], f"{num(annual, lang, 0)} €" if annual is not None else "–",
                  tx["e_annual_sub"] if annual is not None else tx["e_annual_none"], AIR))
    row(first)

    second = []
    if e.get("price_paid") is not None and e.get("tariff_dynamic"):
        sub = tx["e_paid_sub"].format(m=num((e.get("price_avg") or 0) * 100, lang, 1), p=e.get("cheap_share") if e.get("cheap_share") is not None else "–")
        second.append((tx["e_paid"], f"{num(e['price_paid'] * 100, lang, 1)} ct", sub, OK))
    else:
        second.append((tx["e_price"], f"{num((e.get('price') or 0) * 100, lang, 1)} ct", "", OK))
    if source == "heatpump" and e.get("cop"):
        second.append((tx["e_heat_price"], f"{num((e.get('price_paid') or e.get('price') or 0) / e['cop'] * 100, lang, 1)} ct", "", OK))
    if e.get("self_kwh"):
        second.append((tx["e_self"], f"{num(e['self_kwh'], lang, 0)} kWh", tx["e_self_sub"], OK))
    if e.get("house_share") is not None:
        second.append((tx["e_house"], num(e["house_share"], lang, 0, " %"), tx["e_house_sub"].format(h=num(e.get("house_kwh"), lang, 0)), AIR))
    if len(second) > 1:
        row(second)

    if e.get("daily"):
        if pdf.will_page_break(70):
            pdf.add_page()
        pdf.heading(tx["e_daily"])
        _energy_chart(pdf, e["daily"], lang, tx)

    rooms = data.get("room_costs") or []
    if rooms:
        if pdf.will_page_break(14 + 6 * min(len(rooms), 10)):
            pdf.add_page()
        pdf.heading(tx["e_rooms"])
        top = rooms[0]["share"] or 1
        for r in rooms[:10]:
            y = pdf.get_y()
            pdf.set_font("Helvetica", size=9)
            pdf.set_text_color(*NAVY)
            pdf.set_xy(15, y)
            pdf.cell(42, 5.5, clean(r["name"])[:28])
            pdf.set_fill_color(*LIGHT)
            pdf.rect(58, y + 1.5, full - 70, 3, style="F", round_corners=True, corner_radius=1.5)
            pdf.set_fill_color(*HEAT)
            pdf.rect(58, y + 1.5, max(1.5, (full - 70) * r["share"] / top), 3, style="F", round_corners=True, corner_radius=1.5)
            pdf.set_xy(15 + full - 12, y)
            pdf.set_font("Helvetica", "B", 9)
            pdf.cell(12, 5.5, f"{num(r['cost'], lang, 2)} €", align="R")
            pdf.set_y(y + 6)
        pdf.set_font("Helvetica", "I", 7.5)
        pdf.set_text_color(*GREY)
        pdf.cell(0, 5, clean(tx["e_rooms_note"]), new_x="LMARGIN", new_y="NEXT")

    # ---- Einzelwerte
    rows = [
        [tx["e_kwh"], f"{num(kwh, lang, 1)} kWh" if kwh is not None else "–"],
    ]
    if ww:
        rows.append([tx["e_ww"], f"{num(ww, lang, 1)} kWh"])
    if e.get("heat_kwh") is not None:
        rows.append([tx["e_heat"], f"{num(e['heat_kwh'], lang, 1)} kWh"])
    if e.get("ww_heat_kwh") is not None:
        rows.append([tx["e_ww_heat"], f"{num(e['ww_heat_kwh'], lang, 1)} kWh"])
    rows.append([tx["e_price"], f"{num(e.get('price'), lang, 3)} €/kWh"])
    rows.append([tx["e_base"], f"{num(e.get('base'), lang, 2)} €"])
    rows.append([tx["e_cost"], f"{num(cost, lang, 2)} €" if cost is not None else "–"])
    if e.get("pv_kwh") is not None and not e.get("self_kwh"):
        rows.append([tx["e_pv"], f"{num(e['pv_kwh'], lang, 1)} kWh"])
    if source == "oil":
        rows.append([tx["e_oilprice"], f"{num(e.get('oil_price'), lang, 2)} €/L"])
        if e.get("liter") is not None:
            rows.append([tx["e_liter"], f"{num(e.get('liter'), lang, 1)} L"])
        if tank:
            if tank.get("current_l") is not None:
                rows.append([tx["e_tank"], f"{num(tank['current_l'], lang, 0)} L"])
            if tank.get("consumed_l") is not None:
                rows.append([tx["e_tank_use"], f"{num(tank['consumed_l'], lang, 1)} L"])
            if tank.get("days_left") is not None:
                rows.append([tx["e_reicht"], tx["e_days"].format(n=tank["days_left"])])
            rows.append([tx["e_order"], tx["e_yes"] if tank.get("order") else tx["e_no"]])
        market = e.get("oil_market") or {}
        if market.get("value") is not None:
            rows.append([tx["e_market"], f"{num(market['value'], lang, 2)} €/L"])
        if market.get("avg_30d") is not None:
            rows.append([tx["e_30d"], f"{num(market['avg_30d'], lang, 2)} €/L"])
    if pdf.will_page_break(14 + 6.5 * len(rows)):
        pdf.add_page()
    pdf.heading(tx["e_details"])
    pdf.table([tx["metric"], tx["e_value"]], rows, [full * 0.55, full * 0.45])

    # ---- Datenquellen (kleingedruckt – nur hier stehen Entitäten)
    sources = [
        (tx["e_meter"], e.get("meter")),
        (tx["e_heat"], e.get("heat_entity")),
        (tx["e_ww_meter"], e.get("ww_meter")),
        (tx["e_ww_heat"], e.get("ww_heat_entity")),
        (tx["e_house_meter"], e.get("house_entity")),
        (tx["e_grid"], e.get("grid_entity")),
        (tx["e_tariff"], e.get("tariff")),
        (tx["e_fallbacks"], ", ".join(e.get("tariff_fallbacks") or []) or None),
    ]
    sources = [(k, v) for k, v in sources if v]
    if sources:
        pdf.ln(3)
        pdf.set_font("Helvetica", "B", 7.5)
        pdf.set_text_color(*GREY)
        pdf.cell(0, 4.5, clean(tx["e_sources"]), new_x="LMARGIN", new_y="NEXT")
        pdf.set_font("Helvetica", size=7)
        for k, v in sources:
            if pdf.will_page_break(4):
                pdf.add_page()
            pdf.cell(45, 4, clean(k))
            pdf.multi_cell(full - 45, 4, clean(str(v)), new_x="LMARGIN", new_y="NEXT")


def _page_rooms(pdf: _Pdf, data: dict[str, Any]) -> None:
    """Seite 2: Räume im Vergleich, Rangliste, Werktag/Wochenende."""
    lang = data["lang"]
    tx = L[lang]
    cur = data["current"]
    full = pdf.w - 30
    pdf.add_page()
    pdf.heading(tx["rooms"])
    _period_line(pdf, data)
    trends = data.get("trends") or {}
    names = [n for n, r in sorted(cur["rooms"].items()) if r["hours"]]
    widths = [full * 0.2] + [full * 0.09] * 6 + [full * 0.26]
    header = [tx["room"], tx["c_heat"], tx["c_temp"], tx["c_hum"], tx["c_win"], tx["c_set"], tx["c_ok"], tx["c_trend"]]
    pdf.set_font("Helvetica", "B", 8.5)
    pdf.set_fill_color(*NAVY)
    pdf.set_text_color(255, 255, 255)
    for i, hd in enumerate(header):
        pdf.cell(widths[i], 7, clean(hd), fill=True, align="L" if i in (0, 7) else "R")
    pdf.ln()
    pdf.set_font("Helvetica", size=8.5)
    for n_i, name in enumerate(names):
        r = cur["rooms"][name]
        pdf.set_fill_color(*(LIGHT if n_i % 2 else (255, 255, 255)))
        pdf.set_text_color(*NAVY)
        cells = [name, num(r["heating_h"], lang, 0), num(r["temp_avg"], lang, 1), num(r["humidity_avg"], lang, 0),
                 num(r["airing_h"], lang, 1), num(r["setback_h"] + r.get("empty_h", 0), lang, 0), num(r["on_target_pct"], lang, 0, " %")]
        y0 = pdf.get_y()
        for i, c in enumerate(cells):
            pdf.cell(widths[i], 8, clean(c), fill=True, align="L" if i == 0 else "R")
        x0 = pdf.get_x()
        pdf.cell(widths[7], 8, "", fill=True)
        t = trends.get(name) or {}
        _sparkline(pdf, x0 + 2, y0 + 1.5, widths[7] / 2 - 4, 5, t.get("temp", []), HEAT)
        _sparkline(pdf, x0 + widths[7] / 2 + 1, y0 + 1.5, widths[7] / 2 - 4, 5, t.get("hum", []), AIR)
        pdf.ln()

    rank = data.get("ranking") or {}
    if rank:
        pdf.heading(tx["ranking"])
        tiles = []
        if "eco" in rank:
            tiles.append((tx["r_eco"], rank["eco"][0], tx["r_eco_v"].format(v=num(rank["eco"][1], lang, 1)), OK))
        if "warm" in rank:
            tiles.append((tx["r_warm"], rank["warm"][0], num(rank["warm"][1], lang, 1, " °C"), HEAT))
        if "comfort" in rank:
            tiles.append((tx["r_comfort"], rank["comfort"][0], num(rank["comfort"][1], lang, 0, " %"), AIR))
        if "improved" in rank:
            tiles.append((tx["r_improved"], rank["improved"][0], signed(rank["improved"][1], lang), OK))
        tw = (full - 4 * (len(tiles) - 1)) / len(tiles)
        y = pdf.get_y()
        for i, (label, room, value, color) in enumerate(tiles):
            pdf.kpi(15 + i * (tw + 4), y, tw, label, room, value, color)
        pdf.set_y(y + 28)

    wk = data.get("weekday")
    if wk:
        pdf.heading(tx["weekday"])
        a, b = wk["weekday"], wk["weekend"]
        rows = [
            [tx["w_heat"], num(a["heating_h"], lang, 1), num(b["heating_h"], lang, 1)],
            [tx["w_comfort"], num(a["comfort"], lang, 0, " %"), num(b["comfort"], lang, 0, " %")],
            [tx["w_temp"], num(a["temp_avg"], lang, 1, " °C"), num(b["temp_avg"], lang, 1, " °C")],
            [tx["w_away"], num(a["away_h"], lang, 1), num(b["away_h"], lang, 1)],
        ]
        pdf.table([tx["metric"], tx["wd"], tx["we"]], rows, [full * 0.5, full * 0.25, full * 0.25])


def _page_humidity(pdf: _Pdf, data: dict[str, Any]) -> None:
    """Seite 3: Feuchte-Ampel, Licht-/Lüftsignale, Wärmebild."""
    lang = data["lang"]
    tx = L[lang]
    cur = data["current"]
    full = pdf.w - 30
    names = [n for n, r in sorted(cur["rooms"].items()) if r["hours"]]
    pdf.add_page()
    pdf.heading(tx["humidity"])
    _period_line(pdf, data)
    hum = data.get("humidity") or {}
    co2 = data.get("co2") or {}
    lights = hum.get("lights") or {}
    if any(v for v in lights.values()):
        widths = [full * 0.24, full * 0.1, full * 0.13, full * 0.13, full * 0.13, full * 0.13, full * 0.14]
        pdf.set_font("Helvetica", "B", 8.5)
        pdf.set_fill_color(*NAVY)
        pdf.set_text_color(255, 255, 255)
        for i, hd in enumerate([tx["room"], tx["h_light"], tx["h_avg"], tx["h_humid"], tx["h_mold"], tx["h_co2"], tx["h_co2h"]]):
            pdf.cell(widths[i], 7, clean(hd), fill=True, align="L" if i == 0 else ("C" if i == 1 else "R"))
        pdf.ln()
        pdf.set_font("Helvetica", size=8.5)
        for n_i, name in enumerate(names):
            r = cur["rooms"][name]
            light = lights.get(name)
            pdf.set_fill_color(*(LIGHT if n_i % 2 else (255, 255, 255)))
            pdf.set_text_color(*NAVY)
            y0 = pdf.get_y()
            pdf.cell(widths[0], 6.5, clean(name), fill=True)
            x0 = pdf.get_x()
            pdf.cell(widths[1], 6.5, "" if light else tx["none"], fill=True, align="C")
            if light:
                pdf.set_fill_color(*LIGHT_COLOR[light])
                pdf.ellipse(x0 + widths[1] / 2 - 1.6, y0 + 1.6, 3.2, 3.2, style="F")
                pdf.set_fill_color(*(LIGHT if n_i % 2 else (255, 255, 255)))
            c = co2.get(name) or {}
            for i, v in enumerate([num(r["humidity_avg"], lang, 0, " %"), num(r["humid_h"], lang, 0), num(r["mold_h"], lang, 0),
                                   num(c.get("avg"), lang, 0), num(c.get("high_h"), lang, 0)]):
                pdf.cell(widths[i + 2], 6.5, clean(v), fill=True, align="R")
            pdf.ln()
        if hum.get("problem"):
            pdf.ln(2)
            pdf.set_font("Helvetica", size=9)
            pdf.set_text_color(*NAVY)
            pdf.multi_cell(0, 5, clean(tx["h_problem"].format(r=hum["problem"])))
    else:
        pdf.set_font("Helvetica", size=9)
        pdf.set_text_color(*GREY)
        pdf.cell(0, 6, clean(tx["h_none"]), new_x="LMARGIN", new_y="NEXT")

    pdf.heading(tx["airing"])
    air = data.get("airing") or []
    if air:
        rows = [[a["room"], str(a["airings"]), num(a["avg_min"], lang, 0, " min"), str(a["long"]), str(a["asked"]), str(a["done"]), str(a["cold"]), num(a["success_pct"], lang, 0, " %")] for a in air]
        pdf.table([tx["room"], tx["a_n"], tx["a_avg"], tx["a_long"], tx["a_asked"], tx["a_done"], tx["a_cold"], tx["a_ok"]], rows, [full * 0.23] + [full * 0.11] * 7)
    else:
        pdf.set_font("Helvetica", size=9)
        pdf.set_text_color(*GREY)
        pdf.cell(0, 6, clean(tx["a_none"]), new_x="LMARGIN", new_y="NEXT")

    if pdf.will_page_break(70):
        pdf.add_page()
    pdf.heading(tx["heatmap"])
    grid = data.get("heatmap")
    if grid:
        pdf.set_font("Helvetica", size=7.5)
        pdf.set_text_color(*GREY)
        pdf.cell(0, 4, clean(tx["heatmap_sub"]), new_x="LMARGIN", new_y="NEXT")
        pdf.ln(1)
        cw, ch = (full - 12) / 24, 5.5
        x0, y0 = 15 + 12, pdf.get_y()
        for wd in range(7):
            pdf.set_xy(15, y0 + wd * ch)
            pdf.set_font("Helvetica", size=7)
            pdf.set_text_color(*GREY)
            pdf.cell(11, ch, WEEKDAYS[lang][wd])
            for h in range(24):
                pdf.set_fill_color(*_heat_color(grid[wd][h]))
                pdf.rect(x0 + h * cw + 0.2, y0 + wd * ch + 0.2, cw - 0.4, ch - 0.4, style="F")
        pdf.set_font("Helvetica", size=6.5)
        for h in range(0, 24, 3):
            pdf.set_xy(x0 + h * cw, y0 + 7 * ch + 0.5)
            pdf.cell(cw * 3, 4, f"{h:02d}")
        pdf.set_y(y0 + 7 * ch + 7)
    else:
        pdf.set_font("Helvetica", size=9)
        pdf.set_text_color(*GREY)
        pdf.multi_cell(0, 5, clean(tx["heatmap_none"]))


def _page_devices(pdf: _Pdf, data: dict[str, Any]) -> None:
    """Seite 4: Anwesenheit, Aufheizzeiten, Funk und Batterien, Höhepunkte, Tipps und Befunde."""
    lang = data["lang"]
    tx = L[lang]
    full = pdf.w - 30
    pdf.add_page()
    pres = data.get("presence") or {}
    pdf.heading(tx["presence"])
    _period_line(pdf, data)
    rows = [
        [tx["p_away"], num(pres.get("away_h"), lang, 0, " h")],
        [tx["p_preheat"], tx["p_times"].format(n=pres.get("preheats", 0))],
        [tx["p_arrive"], f"{num(pres.get('arrivals_warm_pct'), lang, 0, ' %')} ({tx['p_times'].format(n=pres.get('arrivals', 0))})" if pres.get("arrivals") else tx["none"]],
    ]
    for n, v in sorted((pres.get("occupied") or {}).items()):
        rows.append([f"{tx['p_occ']}: {n}", num(v, lang, 0, " %")])
    for n, v in sorted((pres.get("heatup") or {}).items()):
        rows.append([f"{tx['p_heatup']}: {n}", num(v, lang, 0, " min")])
    pdf.table([tx["metric"], tx["this"]], rows, [full * 0.7, full * 0.3])

    rel = data.get("reliability") or {}
    pdf.heading(tx["reliability"])
    # Auffällig: viele Funkbefehle (Batterie) oder Wiederholungen – zeigt schwache Geräte/Funkwege.
    bad = {
        n: r
        for n, r in (rel.get("rooms") or {}).items()
        if r.get("sync_failed_h") or r.get("trv_down_h") or (r.get("rf_sent") or 0) >= 200
    }
    if bad:
        pdf.table(
            [tx["room"], tx["x_failed"], tx["x_down"], tx["rf_cmds"]],
            [
                [
                    n,
                    num(r["sync_failed_h"], lang, 1),
                    num(r["trv_down_h"], lang, 1),
                    f"{int(r.get('rf_sent') or 0)} ({int(r.get('rf_retries') or 0)})",
                ]
                for n, r in sorted(bad.items())
            ],
            [full * 0.4, full * 0.2, full * 0.2, full * 0.2],
        )
    else:
        pdf.set_font("Helvetica", size=9)
        pdf.set_text_color(*NAVY)
        pdf.cell(0, 6, clean(tx["x_ok"]), new_x="LMARGIN", new_y="NEXT")
    if rel.get("blips"):
        pdf.set_font("Helvetica", size=9)
        pdf.set_text_color(*NAVY)
        pdf.cell(0, 6, clean(tx["x_blips"].format(n=rel["blips"])), new_x="LMARGIN", new_y="NEXT")
    bats = [(room, dev, lvl) for room, devs in sorted((rel.get("batteries") or {}).items()) for dev, lvl in sorted(devs.items())]
    if bats:
        pdf.ln(1)
        pdf.set_font("Helvetica", "B", 9)
        pdf.set_text_color(*NAVY)
        pdf.cell(0, 6, clean(tx["x_bat"]), new_x="LMARGIN", new_y="NEXT")
        bw = full / 3
        for i, (_room, dev, lvl) in enumerate(bats):
            if i % 3 == 0 and i:
                pdf.ln(5.5)
            x0, y0 = 15 + (i % 3) * bw, pdf.get_y()
            pdf.set_fill_color(*(ALERT if lvl < 20 else WARN if lvl < 35 else OK))
            pdf.rect(x0, y0 + 1.5, 8 * max(lvl, 3) / 100, 2.5, style="F")
            pdf.set_draw_color(*LINE)
            pdf.rect(x0, y0 + 1.5, 8, 2.5)
            pdf.set_xy(x0 + 10, y0)
            pdf.set_font("Helvetica", size=7.5)
            pdf.set_text_color(*NAVY)
            pdf.cell(bw - 11, 5.5, clean(f"{dev} · {lvl:.0f} %"))
        pdf.ln(7)

    hl = data.get("highlights")
    if hl:
        pdf.heading(tx["highlights"])
        rows = []
        if "first" in hl:
            rows.append([tx["s_first"], date_text(date.fromisoformat(hl["first"]), lang)])
            rows.append([tx["s_last"], date_text(date.fromisoformat(hl["last"]), lang)])
        if "coldest" in hl:
            rows.append([tx["s_cold"], f"{date_text(date.fromisoformat(hl['coldest'][0]), lang)} · {num(hl['coldest'][1], lang, 1, ' °C')}"])
        if "pause" in hl:
            rows.append([tx["s_pause"], tx["s_pause_v"].format(n=hl["pause"][0], d=date_text(date.fromisoformat(hl["pause"][1]), lang))])
        if "top_month" in hl:
            m = date.fromisoformat(hl["top_month"][0])
            rows.append([tx["s_top"], f"{MONTHS[lang][m.month - 1]} {m.year} · {num(hl['top_month'][1], lang, 0, ' h')}"])
        pdf.table([tx["metric"], ""], rows, [full * 0.55, full * 0.45])

    def bullets(items: list[tuple[str, str]]) -> None:
        for sev, text in items:
            if pdf.will_page_break(8):
                pdf.add_page()
            y = pdf.get_y()
            pdf.set_fill_color(*SEV_COLOR.get(sev, AIR))
            pdf.ellipse(16, y + 1.6, 2.4, 2.4, style="F")
            pdf.set_xy(21, y)
            pdf.set_font("Helvetica", size=9.5)
            pdf.set_text_color(*NAVY)
            pdf.multi_cell(pdf.w - 36, 5.2, clean(text), new_x="LMARGIN", new_y="NEXT")
            pdf.ln(1.2)

    if data.get("tips"):
        pdf.heading(tx["tips"])
        bullets([("good", t) for t in data["tips"]])
    pdf.heading(tx["findings"])
    bullets(data["findings"])

    pdf.ln(4)
    pdf.set_font("Helvetica", "I", 7.5)
    pdf.set_text_color(*GREY)
    pdf.multi_cell(0, 4, clean(tx["notes"]))
