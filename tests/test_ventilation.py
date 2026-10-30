"""Tests der Lüftungslogik."""

import pytest

from rk.ventilation import (
    VENT_AIRING,
    VENT_DONE,
    VENT_OK,
    VENT_PLEASE_CLOSE,
    VENT_PLEASE_OPEN,
    VENT_TOO_COLD,
    VentInput,
    absolute_humidity,
    airing_dries,
    dew_point,
    evaluate,
    in_quiet_hours,
    mold_risk,
    recommended_duration,
)


def base(**kw) -> VentInput:
    v = dict(
        window_open=False, open_minutes=0, room_temp=21.0, temp_at_open=21.0,
        humidity=55.0, humidity_high_minutes=0, humidity_limit=70.0,
        humidity_hysteresis=5.0, min_temp=18.0, max_drop=3.0, duration=5, dries=True,
    )
    v.update(kw)
    return VentInput(**v)


def test_dew_point_and_abs_humidity_plausible() -> None:
    assert dew_point(20, 50) == pytest.approx(9.3, abs=0.2)
    assert absolute_humidity(20, 50) == pytest.approx(8.6, abs=0.2)
    assert dew_point(None, 50) is None


@pytest.mark.parametrize("temp,minutes", [(-5, 4), (2, 5), (8, 10), (12, 15), (18, 20), (25, 30)])
def test_duration_by_outdoor(temp: float, minutes: int) -> None:
    assert recommended_duration(temp, 1) == minutes


def test_duration_month_fallback() -> None:
    assert recommended_duration(None, 1) == 5
    assert recommended_duration(None, 7) == 30


def test_airing_dries() -> None:
    assert airing_dries(10.0, 5.0)
    assert not airing_dries(10.0, 9.5)  # Sommer, schwül
    assert airing_dries(10.0, None)


def test_please_open_needs_delay_and_dries() -> None:
    assert evaluate(base(humidity=72, humidity_high_minutes=5)) == VENT_OK
    assert evaluate(base(humidity=72, humidity_high_minutes=20)) == VENT_PLEASE_OPEN
    assert evaluate(base(humidity=72, humidity_high_minutes=20, dries=False)) == VENT_OK


def test_window_states() -> None:
    assert evaluate(base(window_open=True, open_minutes=1)) == VENT_AIRING
    assert evaluate(base(window_open=True, open_minutes=6)) == VENT_PLEASE_CLOSE
    assert evaluate(base(window_open=True, open_minutes=3, humidity=60)) == VENT_DONE


def test_too_cold_has_priority() -> None:
    assert evaluate(base(window_open=True, open_minutes=1, room_temp=17.5)) == VENT_TOO_COLD
    assert evaluate(base(window_open=True, open_minutes=1, room_temp=19.5, temp_at_open=23.0)) == VENT_TOO_COLD
    assert evaluate(base(window_open=True, open_minutes=9, room_temp=17.0)) == VENT_TOO_COLD


def test_mold_risk() -> None:
    assert mold_risk(72, 20, 4)
    assert not mold_risk(72, 20, 1)
    assert mold_risk(66, 15, 0)


def test_quiet_hours_over_midnight() -> None:
    assert in_quiet_hours(23, 0, "22:00", "07:00")
    assert in_quiet_hours(6, 59, "22:00:00", "07:00:00")
    assert not in_quiet_hours(12, 0, "22:00", "07:00")
    assert in_quiet_hours(13, 0, "12:00", "14:00")


from rk.ventilation import comfort_temperature  # noqa: E402


def test_comfort_temperature_defaults() -> None:
    assert comfort_temperature(None, "living") == 20.0
    assert comfort_temperature(None, "bathroom") == 22.0
    assert comfort_temperature("", "bedroom") == 17.0
    assert comfort_temperature(21.5, "bedroom") == 21.5
    assert comfort_temperature(None, None) == 20.0
