"""Wächter: „Thermostat übernimmt den Sollwert nicht" darf nicht raten und nicht schweigen.

Anlass (#31): Ein Melder sah Ziel 21 °C, aber das Gerät stand auf 18,5 °C. Das war korrekt —
21 + (−2,34) Abgleich = 18,5. Deshalb prüft die Meldung gegen den **erwarteten** Wert
(Ziel + gelernter Abgleich), nicht gegen das Ziel, und erst nach einer Wartezeit: ein
Gerät braucht Sekunden bis Minuten, bis der geschriebene Wert ankommt.
"""

from __future__ import annotations

import pytest

from custom_components.raumklima.health import (
    SETPOINT_IGNORE_MINUTES,
    SEV_WARN,
    check_setpoint_ignored,
)


def test_abgleich_ist_kein_fehler() -> None:
    """Ziel 21, Abgleich −2,34 → Gerät steht auf 18,5. Genau richtig."""
    assert check_setpoint_ignored(120, 18.5, 18.5) is None


def test_kurze_abweichung_ist_kein_fehler() -> None:
    """Nach dem Schreiben steht der alte Wert noch eine Weile da."""
    assert check_setpoint_ignored(SETPOINT_IGNORE_MINUTES - 1, 18.5, 21.0) is None


def test_dauerhafte_abweichung_meldet_sich() -> None:
    issue = check_setpoint_ignored(45, 18.5, 21.0)
    assert issue is not None
    assert issue.code == "setpoint_ignored"
    assert issue.severity == SEV_WARN
    assert "18.5" in issue.message and "21.0" in issue.message
    assert "45" in issue.message


def test_rundungsrest_unter_halber_grad_zaehlt_nicht() -> None:
    """Rest vom 0,5-K-Raster ist kein Fehlzustand — eine ganze Stufe daneben schon."""
    assert check_setpoint_ignored(120, 20.6, 21.0) is None
    assert check_setpoint_ignored(120, 20.5, 21.0) is not None


@pytest.mark.parametrize(("actual", "expected"), [(None, 21.0), (21.0, None)])
def test_unbekannte_werte_melden_nichts(actual: float | None, expected: float | None) -> None:
    assert check_setpoint_ignored(120, actual, expected) is None


def test_wartezeit_folgt_dem_meldetakt() -> None:
    """Ein Gerät, das alle 15 Minuten funkt, kann nach 20 Minuten nicht gefolgt sein (#35)."""
    # 15-min-Gerät: erst ab 30 Minuten melden
    assert check_setpoint_ignored(20, 23.0, 22.5, needed=30) is None
    assert check_setpoint_ignored(31, 23.0, 22.5, needed=30) is not None
    # Zigbee (5 min): 15 Minuten bleiben die Untergrenze
    assert check_setpoint_ignored(14, 23.0, 22.5, needed=10) is None
