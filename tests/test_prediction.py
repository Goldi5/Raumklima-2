"""Vorhersage im Verlauf: Ist, Erwartung und Abweichung."""

from __future__ import annotations

from custom_components.raumklima.stats import RoomSample, add_room_sample, summarize_room


def _sample(temp, predicted):
    return RoomSample(
        heating=False, valve=None, reason="normal", target=20.0, effective=20.0,
        plan_on=False, paused=False, temp=temp, humidity=None, humidity_limit=None,
        mold=False, window_open=False, predicted_temp=predicted,
    )


def test_prediction_is_summed_and_compared():
    day = {}
    add_room_sample(day, _sample(20.0, 20.5), 3600)
    r = summarize_room([day])
    assert r["temp_avg"] == 20.0
    assert r["predicted_avg"] == 20.5
    assert r["prediction_error_avg"] == 0.5


def test_no_prediction_keeps_fields_empty():
    r = summarize_room([{}])
    assert r["predicted_avg"] is None
    assert r["prediction_error_avg"] is None
