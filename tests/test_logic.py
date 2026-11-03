"""Tests der Rechenlogik."""

import pytest

from rk.logic import (
    any_open,
    calc_offset,
    calc_target_setpoint,
    heating_demand,
    plausible_reading,
    retry_delay,
    to_float,
    values_match,
)


def test_offset_first_calibration() -> None:
    # TRV am Heizkörper misst 23.0, Raum hat 20.5 -> Offset -2.5
    assert calc_offset(20.5, 23.0, 0.0) == -2.5


def test_offset_uses_raw_value() -> None:
    # TRV meldet schon mit Offset -2.5: 20.6 -> Rohwert 23.1 -> neuer Offset -2.6
    # Änderung 0.1 liegt unter Schwelle 0.3 -> nichts senden
    assert calc_offset(20.5, 20.6, -2.5) is None


def test_offset_no_oscillation_when_correct() -> None:
    assert calc_offset(20.5, 20.5, -2.5) is None


def test_offset_sent_above_threshold() -> None:
    assert calc_offset(20.0, 21.0, -2.0) == -3.0


def test_offset_clamped() -> None:
    assert calc_offset(10.0, 30.0, 0.0) == -10.0
    assert calc_offset(30.0, 10.0, 0.0) == 10.0


@pytest.mark.parametrize("external,trv", [(None, 20.0), (20.0, None)])
def test_offset_missing_values(external: float | None, trv: float | None) -> None:
    assert calc_offset(external, trv, 0.0) is None


def test_offset_force_threshold_zero() -> None:
    assert calc_offset(20.0, 20.2, 0.0, threshold=0.0) == -0.2


def test_target_setpoint_compensates() -> None:
    # TRV misst 2 °C mehr als der Raum -> Sollwert 21 + 2 = 23
    assert calc_target_setpoint(21.0, 20.0, 22.0) == 23.0


def test_target_setpoint_rounded_and_clamped() -> None:
    assert calc_target_setpoint(21.0, 20.0, 21.3) == 22.5
    assert calc_target_setpoint(29.0, 15.0, 25.0, high=30.0) == 30.0
    assert calc_target_setpoint(21.0, None, 22.0) == 21.0


def test_values_match_tolerance() -> None:
    assert values_match("21.2", 21.0, 0.25)
    assert not values_match("21.5", 21.0, 0.25)
    assert not values_match("unavailable", 21.0, 0.25)


def test_to_float() -> None:
    assert to_float("1.5") == 1.5
    assert to_float("unknown") is None
    assert to_float("nan") is None
    assert to_float(None) is None


def test_any_open_ignores_missing() -> None:
    windows = ["a", "b"]
    assert not any_open({"a": "off"}, windows)
    assert any_open({"a": "off", "b": "on"}, windows)


def test_retry_delay_grows_then_slow() -> None:
    assert [retry_delay(i, 20, 5, 300) for i in range(1, 7)] == [20, 40, 60, 80, 100, 300]


def test_plausible_reading() -> None:
    assert plausible_reading(20.0, None, None)
    assert plausible_reading(21.0, 20.0, 60)
    assert not plausible_reading(25.0, 20.0, 60)
    assert plausible_reading(25.0, 20.0, 600)  # lange her -> ok


from rk.logic import choose_on_preset

TRV602Z = ["none", "off", "antifrost", "eco", "comfort", "auto", "on"]
CAND = ["manual", "heat", "eco", "comfort", "none"]
AVOID = ["on", "off", "antifrost", "auto", "boost", "holiday", "away"]


def test_on_preset_trv602z_prefers_eco_never_on() -> None:
    assert choose_on_preset(TRV602Z, "auto_detect", "on", candidates=CAND, avoid=AVOID) == "eco"


def test_on_preset_configured_wins() -> None:
    assert choose_on_preset(TRV602Z, "comfort", None, candidates=CAND, avoid=AVOID) == "comfort"


def test_on_preset_manual_device() -> None:
    assert choose_on_preset(["off", "manual", "auto"], None, None, candidates=CAND, avoid=AVOID) == "manual"


def test_on_preset_remembered_fallback_unless_avoided() -> None:
    assert choose_on_preset(["off", "x", "y"], None, "y", candidates=CAND, avoid=AVOID) == "y"
    assert choose_on_preset(["off", "on", "z"], None, "on", candidates=CAND, avoid=AVOID) == "z"


def test_on_preset_none_available() -> None:
    assert choose_on_preset(["off"], None, None, candidates=CAND, avoid=AVOID) is None


def test_fensterzustand_aus_cover() -> None:
    """Dachluke (cover) zählt als Fenster: open/opening oder teilweise geöffnet."""
    from types import SimpleNamespace

    from custom_components.raumklima.logic import window_open_state

    assert window_open_state("cover.luke", SimpleNamespace(state="open", attributes={})) == "on"
    assert window_open_state("cover.luke", SimpleNamespace(state="opening", attributes={})) == "on"
    assert window_open_state("cover.luke", SimpleNamespace(state="closed", attributes={"current_position": 0})) == "off"
    assert window_open_state("cover.luke", SimpleNamespace(state="closed", attributes={"current_position": 30})) == "on"
    assert window_open_state("binary_sensor.fenster", SimpleNamespace(state="on", attributes={})) == "on"
    assert window_open_state("binary_sensor.fenster", SimpleNamespace(state="off", attributes={})) == "off"
    assert window_open_state("cover.luke", SimpleNamespace(state="unavailable", attributes={})) is None


def test_abgleich_wird_auf_den_sollwert_gerechnet() -> None:
    """Livisi/HMIP: Gerät misst kälter als der Raum – Sollwert muss tiefer gesetzt werden."""
    from custom_components.raumklima.logic import clamp, round_step

    target, shift = 18.0, -1.2
    # 16,8 wird auf die Gerätestufe 0,5 gerundet → 17,0
    assert clamp(round_step(target + shift, 0.5), 6.0, 30.0) == 17.0


def test_heating_demand_below_target() -> None:
    assert heating_demand(18.4, 19.0) is True


def test_heating_demand_reached() -> None:
    assert heating_demand(19.0, 19.0) is False
    assert heating_demand(19.2, 19.0) is False


def test_heating_demand_within_threshold() -> None:
    # 0,2 K darunter gilt noch als erreicht (kein Flackern)
    assert heating_demand(18.8, 19.0) is False


def test_heating_demand_missing_values() -> None:
    assert heating_demand(None, 19.0) is False
    assert heating_demand(18.0, None) is False
