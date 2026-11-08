"""Kurven für die Diagnose-Datei: Raster, Änderungspunkte, Speicher-Rundreise."""

from __future__ import annotations

from datetime import UTC, datetime, timedelta

from custom_components.raumklima.series import MAX_SAMPLES, STEP_SECONDS, RoomSeries


def _t(minutes: int) -> datetime:
    return datetime(2026, 11, 8, 12, 0, tzinfo=UTC) + timedelta(minutes=minutes)


def _add(series: RoomSeries, minutes: int, *, current=20.0, target=21.0, setpoint=21.0, valve=0.0, action="i") -> bool:
    return series.maybe_add(
        _t(minutes), current=current, target=target, setpoint=setpoint, valve=valve, action=action
    )


def test_leere_kurve_hat_alle_spalten() -> None:
    data = RoomSeries().export()
    assert data["t0"] is None
    assert data["t"] == []
    assert data["legend"]["h"] == "heating"


def test_raster_und_aenderung() -> None:
    series = RoomSeries()
    assert _add(series, 0) is True
    # Innerhalb des Rasters ohne Änderung: kein Punkt
    assert _add(series, 1) is False
    # Innerhalb des Rasters, aber 0,4 K wärmer: Punkt
    assert _add(series, 1, current=20.4) is True
    # Raster erreicht: Punkt, auch ohne Änderung
    assert _add(series, 0 + STEP_SECONDS // 60) is True
    assert len(series) == 3


def test_ventilsprung_zaehlt_als_aenderung() -> None:
    series = RoomSeries()
    _add(series, 0, valve=0)
    assert _add(series, 1, valve=25) is True
    assert _add(series, 2, valve=28) is False


def test_puffer_bleibt_begrenzt() -> None:
    series = RoomSeries()
    for minute in range(MAX_SAMPLES + 40):
        _add(series, minute * 5, current=20 + (minute % 3) * 0.5)
    assert len(series) <= MAX_SAMPLES


def test_export_und_laden_erhalten_die_werte() -> None:
    series = RoomSeries()
    _add(series, 0, current=19.4, target=21.0, setpoint=20.5, valve=12, action="h")
    _add(series, 5, current=19.9, target=21.0, setpoint=20.5, valve=40, action="h")
    data = series.export()
    assert data["t"] == [0, 300]
    assert data["i"] == [19.4, 19.9]
    assert data["a"] == ["h", "h"]

    neu = RoomSeries()
    neu.load(data)
    assert neu.export() == data


def test_kaputte_daten_werden_ignoriert() -> None:
    series = RoomSeries()
    series.load(None)
    series.load({"t0": "keine-zeit", "t": [0]})
    series.load({"t0": "2026-11-08T12:00:00+00:00", "t": [0, 60], "i": [20.0]})
    data = series.export()
    assert data["t"] == [0, 60]
    assert data["i"][0] == 20.0
    assert data["i"][1] is None
