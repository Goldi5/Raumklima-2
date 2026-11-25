"""PDF-Heizbericht zeichnen (fpdf2, ohne Browser, ohne Internet).

Seite 1: Kopf, Kennzahlen, Vergleich mit Vorzeitraum/Vorjahr, Diagramm.
Seite 2: Räume im Detail, Auffälligkeiten und Tipps.
Schrift: Helvetica (eingebaut) mit Windows-1252 – Umlaute, „“, – und € gehen; andere Zeichen
(₂, →, Emojis) werden ersetzt.

Fassade: Der Inhalt liegt in den Teilmodulen ``report_pdf_text``, ``report_pdf_base``, ``report_pdf_pages``, ``report_pdf_render``;
alle Namen bleiben hier importierbar.
"""

from __future__ import annotations

from .report_pdf_base import (  # noqa: F401
    _REPLACE,
    AIR,
    ALERT,
    GRADE_COLOR,
    GREY,
    HEAT,
    LIGHT,
    LIGHT_COLOR,
    LINE,
    NAVY,
    OK,
    SEV_COLOR,
    WARN,
    _heat_color,
    _Pdf,
    _period_line,
    _sparkline,
    clean,
    date_text,
    num,
    signed,
    title_for,
)
from .report_pdf_pages import (  # noqa: F401
    _energy_chart,
    _page_devices,
    _page_energy,
    _page_humidity,
    _page_overview,
    _page_rooms,
)
from .report_pdf_render import (  # noqa: F401
    render,
)
from .report_pdf_text import (  # noqa: F401
    MONTHS,
    WEEKDAYS,
    L,
)
