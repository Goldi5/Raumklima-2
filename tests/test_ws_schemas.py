"""Jeder von der Karte aufgerufene Befehl muss die Wohnungs-Kennung annehmen.

Anlass: Die Karte schickt bei fast jedem Aufruf ``home`` mit. Fehlte ``home`` im Schema,
antwortete Home Assistant mit „extra keys not allowed" – „Sichern" scheiterte dadurch auf
allen Geräten, ohne dass ein Test anschlug. Dieser Test liest beide Seiten aus dem Quelltext:
die Aufrufe der Karte und die Schemata der Integration.
"""

from __future__ import annotations

from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent.parent
BACKEND = ROOT / "custom_components" / "raumklima"
FRONTEND = ROOT / "frontend" / "src"


def _command_blocks() -> dict[str, str]:
    """Befehl -> Text seines Schema-Blocks (aus allen Python-Dateien)."""
    blocks: dict[str, str] = {}
    for path in BACKEND.glob("*.py"):
        src = path.read_text(encoding="utf-8")
        for match in re.finditer(r"websocket_command\(\s*\{(.*?)\}\s*\)", src, re.S):
            body = match.group(1)
            name = re.search(r'"(?:raumklima|\{DOMAIN\})/([a-z/]+)"', body)
            if name:
                blocks[name.group(1)] = body
    return blocks


def _called_with_home() -> set[str]:
    """Befehle, die die Karte mit ``_homeMsg()`` aufruft."""
    names: set[str] = set()
    for path in FRONTEND.rglob("*.js"):
        src = path.read_text(encoding="utf-8")
        for match in re.finditer(r'type: "raumklima/([a-z/]+)"(.{0,120}?)_homeMsg', src, re.S):
            names.add(match.group(1))
    return names


def test_genutzte_befehle_existieren() -> None:
    blocks = _command_blocks()
    called = _called_with_home()
    assert called, "keine Aufrufe gefunden – Muster geändert?"
    missing = sorted(called - set(blocks))
    assert not missing, f"Befehl fehlt im Backend: {missing}"


def test_genutzte_befehle_nehmen_home_an() -> None:
    blocks = _command_blocks()
    without = sorted(name for name in _called_with_home() if '"home"' not in blocks.get(name, ""))
    assert not without, f"Schema ohne 'home' (Karte schickt es mit): {without}"


def test_raumkalibrierung_ist_schaltbar() -> None:
    """Die Kalibrierart steht in der Karte als Schalter – das Schema muss sie annehmen.

    Anlass: In der Karte war „Kalibrierung" nur eine Anzeige; wer sie ändern wollte, fand
    keinen Weg (zwei Melder suchten vergeblich). Jetzt schickt die Karte
    ``calibration_mode`` über ``raumklima/room/update`` – fehlt der Schlüssel im Schema,
    antwortet Home Assistant mit „extra keys not allowed" und die Auswahl springt zurück.
    """
    src = (BACKEND / "ws_common.py").read_text(encoding="utf-8")
    match = re.search(r"ROOM_CHANGES = vol\.Schema\((.+?)\n\)\n", src, re.S)
    assert match, "ROOM_CHANGES nicht gefunden – Muster geändert?"
    assert "CONF_CALIBRATION_MODE" in match.group(1), "ROOM_CHANGES nimmt die Kalibrierart nicht an"
    frontend = "\n".join(p.read_text(encoding="utf-8") for p in sorted((FRONTEND / "cards").rglob("settings*.js")) + sorted((FRONTEND / "cards" / "settings").glob("*.js")))
    assert '_segs(scope, "calibration_mode"' in frontend, "Karte bietet den Schalter nicht an"
