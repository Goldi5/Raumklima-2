"""Schrittweite je Thermostat: nur das Gerät, das nur ganze Grad kann, bekommt ganze Grad.

Anlass: Ein Moes BRT-100 (`target_temp_step: 1.0`) machte aus einem Wunsch von 21,5 °C ein 22,0 °C.
Raumklima schrieb weiter 0,5-Schritte und verglich die Antwort mit 0,25 K Toleranz — das Gerät konnte
den Wunsch nie bestätigen, der Auftrag blieb dauerhaft „sendet …". Gemessen am Gerät:
21,0 → hält, 21,5 → 22,0, 18,5 → 19,0.
"""

from __future__ import annotations

from custom_components.raumklima.logic import (
    calc_target_setpoint,
    device_step,
    round_device,
    setpoint_tolerance,
    values_match,
)


def test_geraet_ohne_angabe_rechnet_in_halben_graden() -> None:
    assert device_step(None) == 0.5
    assert device_step("unknown") == 0.5
    assert device_step(0) == 0.5
    assert device_step(0.5) == 0.5


def test_geraet_mit_ganzen_graden_wird_erkannt() -> None:
    assert device_step(1.0) == 1.0
    # Halbe Wünsche landen auf der nächsten ganzen Stufe – so macht es das Gerät selbst
    assert round_device(21.5, 1.0) == 22.0
    assert round_device(18.5, 1.0) == 19.0
    assert round_device(21.4, 1.0) == 21.0


def test_ausgleich_respektiert_die_schrittweite() -> None:
    """Gerät fühlt kälter als der Raum → sein Sollwert muss runter, damit der Raum das Ziel trifft."""
    # Raum 21,1, Gerät 20,0 → 21,0 + (20,0 − 21,1) = 19,9 → 1,0-Raster: 20,0
    assert calc_target_setpoint(21.0, 21.1, 20.0, step=1.0) == 20.0
    # dasselbe mit 0,5-Raster (Tuya): 19,9 → 20,0
    assert calc_target_setpoint(21.0, 21.1, 20.0, step=0.5) == 20.0
    # halbe Stufe: 21,0 + (20,0 − 20,6) = 20,4 → 20,5
    assert calc_target_setpoint(21.0, 20.6, 20.0, step=0.5) == 20.5
    # Gerät fühlt wärmer als der Raum → Sollwert rauf
    assert calc_target_setpoint(21.0, 20.0, 22.0, step=1.0) == 23.0


def test_toleranz_ist_nie_enger_als_die_halbe_schrittweite() -> None:
    assert setpoint_tolerance(0.5, 0.25) == 0.25
    assert setpoint_tolerance(1.0, 0.25) == 0.5
    assert setpoint_tolerance(0.1, 0.25) == 0.25


def test_bestaetigung_klappt_mit_der_richtigen_toleranz() -> None:
    """21,5 gewünscht, Gerät antwortet 22,0: mit 0,25 K nie bestätigt, mit 0,5 K schon."""
    assert values_match(22.0, 21.5, 0.25) is False
    assert values_match(22.0, 21.5, setpoint_tolerance(1.0, 0.25)) is True
