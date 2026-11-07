"""Bericht ohne Ventilstellung: Gradstunden statt geratener Öffnung.

Hintergrund: Livisi-VRCC-Thermostate (Remscheid) melden keine Ventilstellung. Der Bericht
zeigte dadurch leere Balken – und einen einzigen, der aus einer fremden Wohnung stammte.
"""

from __future__ import annotations

from datetime import date, timedelta

from custom_components.raumklima.health import check_window_flapping
from custom_components.raumklima.report_data import build
from custom_components.raumklima.stats import (
    ROOM_FIELDS,
    RoomSample,
    _empty,
    add_room_sample,
    summarize_room,
)


def _day(*samples: tuple[RoomSample, float]) -> dict[str, float]:
    day = _empty(ROOM_FIELDS)
    for sample, dt in samples:
        add_room_sample(day, sample, dt)
    return day


def _sample(**kw) -> RoomSample:
    base = dict(
        heating=True, valve=None, reason="normal", target=20.0, effective=20.0,
        plan_on=True, paused=False, temp=18.0, humidity=None, humidity_limit=None,
        mold=False, window_open=False, valve_calc=None,
    )
    base.update(kw)
    return RoomSample(**base)


def test_gradstunden_zaehlen_nur_wenn_geregelt_wird() -> None:
    # 1 h bei 2 K unter Ziel = 2 K·h
    warm = _day((_sample(temp=18.0, effective=20.0), 3600))
    assert summarize_room([warm])["deficit_kh"] == 2.0

    # Pause (Fenster) und Absenkung dürfen nicht als Wärmebedarf zählen
    paused = _day((_sample(temp=18.0, effective=20.0, paused=True), 3600))
    assert summarize_room([paused])["deficit_kh"] == 0.0
    off = _day((_sample(temp=18.0, effective=20.0, plan_on=False), 3600))
    assert summarize_room([off])["deficit_kh"] == 0.0

    # über Ziel: kein negativer Bedarf
    warm_room = _day((_sample(temp=22.0, effective=20.0), 3600))
    assert summarize_room([warm_room])["deficit_kh"] == 0.0


def test_has_valve_unterscheidet_kein_signal_von_null_prozent() -> None:
    ohne = _day((_sample(valve=None), 3600))
    assert summarize_room([ohne])["has_valve"] is False
    # 0 % ist eine echte Meldung, kein fehlender Wert
    mit = _day((_sample(valve=0.0), 3600))
    assert summarize_room([mit])["has_valve"] is True
    assert summarize_room([mit])["valve_h"] == 0.0


def test_bericht_wechselt_automatisch_auf_gradstunden() -> None:
    today = date(2026, 11, 6)
    ohne = {"Bad": {today.isoformat(): _day((_sample(temp=18.0, effective=20.0), 3600))}}
    data = build(ohne, {}, "week", today - timedelta(days=6), today)
    assert data["metric"] == "deficit"
    assert data["current"]["rooms"]["Bad"]["deficit_kh"] == 2.0

    mit = {"Bad": {today.isoformat(): _day((_sample(valve=40.0), 3600))}}
    data = build(mit, {}, "week", today - timedelta(days=6), today)
    assert data["metric"] == "valve"


def test_kennzahl_laesst_sich_festsetzen() -> None:
    today = date(2026, 11, 6)
    rooms = {"Bad": {today.isoformat(): _day((_sample(valve=40.0), 3600))}}
    for want in ("deficit", "hours"):
        data = build(rooms, {}, "week", today - timedelta(days=6), today, metric=want)
        assert data["metric"] == want


def test_flattern_wird_gemeldet() -> None:
    assert check_window_flapping(5) is None
    issue = check_window_flapping(40)
    assert issue is not None and issue.code == "window_flapping"


def test_abgeleitetes_preset_warnt_nicht() -> None:
    """FRITZ!DECT: „comfort" heißt nur „Sollwert == Komforttemperatur" (Issue #31)."""
    from custom_components.raumklima.health import check_trv_mode

    assert check_trv_mode("heat", "comfort", derived_preset=True) is None
    issue = check_trv_mode("heat", "comfort")
    assert issue is not None and issue.code == "trv_mode"


def test_ohne_ventil_und_ohne_waermemangel_zaehlen_heizstunden() -> None:
    """Ein gut eingestelltes Haus hat 0 K·h – Gradstunden wären dort ein leerer Bericht."""
    today = date(2026, 11, 7)
    rooms = {"Bad": {today.isoformat(): _day((_sample(temp=21.0, effective=19.0), 3600))}}
    data = build(rooms, {}, "week", today - timedelta(days=6), today)
    assert data["metric"] == "hours"
    assert data["current"]["rooms"]["Bad"]["heating_h"] == 1.0
