"""PDF-Heizbericht zusammensetzen – eine Funktion je Seite."""

from __future__ import annotations

from datetime import datetime
from typing import Any

from .report_pdf_pages import _page_devices, _page_energy, _page_humidity, _page_overview, _page_rooms


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
