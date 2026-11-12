"""Jeder Grund der Regelkette hat einen lesbaren Text im Protokoll (nicht das Rohwort „presence")."""

from pathlib import Path
import re

PKG = Path(__file__).parent.parent / "custom_components/raumklima"
CONST = (PKG / "room_const.py").read_text()
SRC = (PKG / "room_plan.py").read_text()


def test_jeder_grund_hat_einen_protokolltext() -> None:
    reasons = set(re.findall(r"^(REASON_\w+) = ", CONST, re.M))
    body = SRC[SRC.index("    def _log_plan("):]
    body = body[: body.index("}.get(reason, reason)")]
    mapped = set(re.findall(r"^\s+(REASON_\w+): tr\(", body, re.M))
    missing = sorted(reasons - mapped)
    assert not missing, f"ohne Protokolltext: {missing}"
