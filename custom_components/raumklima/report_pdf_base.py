"""Bausteine des PDF-Heizberichts: Farben, Formatierung, Seitenvorlage, Mini-Diagramme."""

from __future__ import annotations

from datetime import date
from typing import Any

from fpdf import FPDF

from .report_pdf_text import MONTHS, L

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
