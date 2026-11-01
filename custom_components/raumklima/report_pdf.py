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
}
WEEKDAYS = {"de": ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"], "en": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}

L = {
    "de": {
        "brand": "RAUMKLIMA · HEIZBERICHT",
        "week": "Woche {w}",
        "month": "{m} {y}",
        "season": "Heizsaison {a}/{b}",
        "created": "erstellt am {d}",
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
    if lang == "de":
        text = text.replace(".", ",")
    return text + unit


def signed(value: float | None, lang: str) -> str:
    if value is None:
        return L[lang]["none"]
    sign = "+" if value > 0 else "-" if value < 0 else "±"
    return f"{sign}{abs(value):.0f} %"


def date_text(d: date, lang: str) -> str:
    return d.strftime("%d.%m.%Y") if lang == "de" else d.strftime("%d %b %Y")


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
    """PDF-Bytes aus den Zahlen von report_data.build()."""
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
        return bytes(pdf.output())

    # ---- Kennzahlen
    gap, w = 4, (full - 12) / 4
    y = pdf.get_y()
    change = data.get("change")
    money = data.get("money")
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

    # ---- Vergleich
    pdf.heading(tx["compare"])

    def col(s: dict[str, Any] | None, key: str, digits: int = 0, unit: str = "", where: str = "total") -> str:
        if s is None:
            return tx["none"]
        value = s[where][key] if where else s[key]
        return num(value, lang, digits, unit)

    rows = [
        [tx["m_heating"], col(cur, "heating_h"), col(prev, "heating_h"), col(ya, "heating_h")],
        [tx["m_valve"], col(cur, "valve_h", 1), col(prev, "valve_h", 1), col(ya, "valve_h", 1)],
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

    # ================================================================ Seite 2
    pdf.add_page()
    pdf.heading(tx["rooms"])
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

    # ================================================================ Seite 3
    pdf.add_page()
    pdf.heading(tx["humidity"])
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

    # ================================================================ Seite 4
    pdf.add_page()
    pres = data.get("presence") or {}
    pdf.heading(tx["presence"])
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
    bad = {n: r for n, r in (rel.get("rooms") or {}).items() if r["sync_failed_h"] or r["trv_down_h"]}
    if bad:
        pdf.table([tx["room"], tx["x_failed"], tx["x_down"]], [[n, num(r["sync_failed_h"], lang, 1), num(r["trv_down_h"], lang, 1)] for n, r in sorted(bad.items())], [full * 0.5, full * 0.25, full * 0.25])
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
    return bytes(pdf.output())
