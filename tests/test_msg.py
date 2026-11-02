"""Meldungen mehrsprachig: Katalog vollständig, Platzhalter gleich, Sprache folgt Home Assistant."""

import ast
from pathlib import Path
import string

import pytest

from custom_components.raumklima import msg
from custom_components.raumklima.msg_catalog import _ROWS, CATALOG

PKG = Path(__file__).parent.parent / "custom_components" / "raumklima"


def _literals() -> dict[str, str]:
    """Alle Texte in tr("…") und N_("…") des Pakets (deutscher Text → Datei)."""
    found: dict[str, str] = {}
    for path in sorted(PKG.glob("*.py")):
        for node in ast.walk(ast.parse(path.read_text(encoding="utf-8"))):
            if isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and node.func.id in ("tr", "N_") and node.args:
                arg = node.args[0]
                if isinstance(arg, ast.Constant) and isinstance(arg.value, str):
                    found.setdefault(arg.value, path.name)
    return found


def _fields(text: str) -> set[str]:
    return {name for _, name, _, _ in string.Formatter().parse(text) if name}


@pytest.fixture(autouse=True)
def _german_afterwards():
    yield
    msg.set_language("de")


def test_catalog_complete():
    missing = {de: f for de, f in _literals().items() if de not in CATALOG}
    assert not missing, f"Übersetzung fehlt: {missing}"


def test_catalog_has_no_duplicates_or_leftovers():
    keys = [row[0] for row in _ROWS]
    assert len(keys) == len(set(keys))
    unused = set(keys) - set(_literals())
    assert not unused, f"Nicht mehr benutzt: {unused}"


def test_placeholders_match():
    for de, langs in CATALOG.items():
        for lang, text in langs.items():
            assert text, (de, lang)
            assert _fields(text) == _fields(de), (de, lang, text)


def test_language_and_numbers():
    assert msg.set_language("de-CH") == "de"
    assert msg.tr("Ziel {t}", t="21,5 °C") == "Ziel 21,5 °C"
    assert msg.dec(21.46) == "21,5"
    assert msg.set_language("fr") == "fr"
    assert msg.tr("Fenster auf") == "Fenêtre ouverte"
    assert msg.dec(-0.25, 2) == "-0,25"
    assert msg.sdec(0.4) == "+0,4"
    assert msg.weekday(0) == "lun."
    assert msg.set_language("it") == "en"
    assert msg.tr("Raum nicht gefunden") == "Room not found"
    assert msg.dec(21.46) == "21.5"
    assert msg.weekday(6) == "Sun"
    assert msg.tr("unbekannter Text {x}", x=1) == "unbekannter Text 1"
