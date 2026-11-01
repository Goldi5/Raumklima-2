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
    pdf.set_y(48)

    if not total["hours"]:
        pdf.set_font("Helvetica", size=11)
        pdf.set_text_color(*NAVY)
        pdf.multi_cell(0, 6, clean(tx["nodata"]))
        return bytes(pdf.output())

    # ---- Kennzahlen
    gap, w = 4, (pdf.w - 30 - 12) / 4
    y = pdf.get_y()
    change = data.get("change")
    pdf.kpi(15, y, w, tx["heating"], num(total["heating_h"], lang, 0, " h"),
            tx["vs_prev"].format(c=signed(change, lang)) if change is not None else tx["heating_sub"], HEAT)
    pdf.kpi(15 + (w + gap), y, w, tx["saving"], "≈ " + num(total["saving_pct"], lang, 0, " %") if total["saving_pct"] else "0 %", tx["saving_sub"], OK)
    pdf.kpi(15 + 2 * (w + gap), y, w, tx["comfort"], num(total["on_target_pct"], lang, 0, " %"), tx["comfort_sub"], AIR)
    pdf.kpi(15 + 3 * (w + gap), y, w, tx["outdoor"], num(cur["outdoor_avg"], lang, 1, " °C"), tx["outdoor_sub"].format(h=num(cur["hdd"], lang, 0)), NAVY)
    pdf.set_y(y + 28)

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
    full = pdf.w - 30
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

    # ---- Räume
    pdf.add_page()
    pdf.heading(tx["rooms"])
    room_rows = []
    for name, r in sorted(cur["rooms"].items()):
        if not r["hours"]:
            continue
        room_rows.append([
            name,
            num(r["heating_h"], lang, 0),
            num(r["temp_avg"], lang, 1),
            num(r["humidity_avg"], lang, 0),
            num(r["humid_h"], lang, 0),
            str(r["airings"]),
            num(r["airing_h"], lang, 1),
            num(r["setback_h"] + r.get("empty_h", 0), lang, 0),
            num(r["on_target_pct"], lang, 0, " %"),
        ])
    widths = [full * 0.22] + [full * 0.78 / 8] * 8
    pdf.table([tx["room"], tx["c_heat"], tx["c_temp"], tx["c_hum"], tx["c_humid"], tx["c_air"], tx["c_win"], tx["c_set"], tx["c_ok"]], room_rows, widths)

    # ---- Auffälligkeiten
    pdf.heading(tx["findings"])
    for sev, text in data["findings"]:
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

    pdf.ln(4)
    pdf.set_font("Helvetica", "I", 7.5)
    pdf.set_text_color(*GREY)
    pdf.multi_cell(0, 4, clean(tx["notes"]))
    return bytes(pdf.output())
