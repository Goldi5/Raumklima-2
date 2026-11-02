"""Sprache der Meldungen (Push, Protokoll, Hinweise): Deutsch, Englisch, Französisch.

Wie bei den Karten ist der deutsche Text zugleich der Schlüssel:

    tr("Fenster auf")                         → "Window opened" (en)
    tr("Ziel {t}", t=fmt_temp(21.5))          → "Cible 21,5 °C" (fr)

Die Übersetzungen stehen in ``msg_catalog.py``. Fehlt eine, erscheint Englisch bzw. Deutsch.
Die Sprache folgt Home Assistant (Einstellungen → System → Allgemein → Sprache) und wird beim
Start und bei jeder Änderung der Systemkonfiguration übernommen. ``N_`` markiert Texte in
Tabellen, die erst beim Anzeigen übersetzt werden.
"""

from __future__ import annotations

from typing import Any

LANG = "de"


def set_language(language: str | None) -> str:
    """Sprache setzen: Deutsch, Französisch, sonst Englisch."""
    global LANG
    low = (language or "").lower()
    LANG = "de" if low.startswith("de") else "fr" if low.startswith("fr") else "en"
    return LANG


def N_(text: str) -> str:
    return text


def tr(de: str, **values: Any) -> str:
    """Text in der aktuellen Sprache, Platzhalter {name} werden gefüllt."""
    template = de
    if LANG != "de":
        from .msg_catalog import CATALOG

        entry = CATALOG.get(de)
        if entry:
            template = entry.get(LANG) or entry.get("en") or de
    if values:
        try:
            return template.format(**values)
        except (KeyError, IndexError, ValueError):
            return de.format(**values)
    return template


def dec(value: float | None, digits: int = 1) -> str:
    """Zahl mit Dezimalkomma (de/fr) bzw. -punkt (en)."""
    if value is None:
        return "–"
    text = f"{value:.{digits}f}"
    return text.replace(".", ",") if LANG in ("de", "fr") else text


def sdec(value: float | None, digits: int = 1) -> str:
    """Wie dec, aber immer mit Vorzeichen (+0,4 / −0,2)."""
    if value is None:
        return "–"
    return ("+" if value >= 0 else "") + dec(value, digits)


WEEKDAYS = {"de": "Mo Di Mi Do Fr Sa So", "en": "Mon Tue Wed Thu Fri Sat Sun", "fr": "lun. mar. mer. jeu. ven. sam. dim."}


def weekday(index: int) -> str:
    """Kurzer Wochentag (0 = Montag) in der aktuellen Sprache."""
    return WEEKDAYS.get(LANG, WEEKDAYS["en"]).split()[index]
