"""Sturm- und Starkregenwarnung: Auswahl aus der Vorhersage und Meldung."""

from __future__ import annotations

from datetime import timedelta

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from custom_components.raumklima.const import KIND_STORM
from custom_components.raumklima.planning import ForecastHour, first_storm
from custom_components.raumklima.shared import domain_data

from .conftest import FakeTrv


def _hour(hours: float, *, gust: float | None = None, rain: float | None = None) -> ForecastHour:
    return ForecastHour(dt_util.utcnow() + timedelta(hours=hours), 12.0, "rainy", None, gust, rain)


def test_frueheste_stunde_gewinnt() -> None:
    hours = [_hour(1, gust=40, rain=0), _hour(2, gust=95, rain=0), _hour(3, gust=120, rain=0)]
    hit = first_storm(hours, dt_util.utcnow(), 70, 8)
    assert hit is not None
    assert hit[1] == "gust"
    assert hit[2] == 95


def test_regen_zaehlt_ebenfalls() -> None:
    hit = first_storm([_hour(1, gust=20, rain=12)], dt_util.utcnow(), 70, 8)
    assert hit is not None
    assert hit[1] == "rain"


def test_vergangenheit_und_ferne_zukunft_zaehlen_nicht() -> None:
    hours = [_hour(-1, gust=99), _hour(9, gust=99)]
    assert first_storm(hours, dt_util.utcnow(), 70, 8) is None


def test_ruhiges_wetter_ergibt_nichts() -> None:
    hours = [_hour(1, gust=30, rain=0.2), _hour(2, gust=45, rain=1.0)]
    assert first_storm(hours, dt_util.utcnow(), 70, 8) is None


async def test_warnung_einmal_bei_offenem_fenster(
    hass: HomeAssistant, setup, trv: FakeTrv, monkeypatch
) -> None:
    hub_entry, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    hub = hub_entry.runtime_data

    monkeypatch.setattr(type(ctrl), "paused", property(lambda self: True))
    hub.forecast_hourly = [_hour(1, gust=95, rain=0)]

    calls: list[tuple] = []
    monkeypatch.setattr(hub, "notify", lambda *a, **k: calls.append((a, k)))

    hub.check_storm()
    assert calls, "keine Warnung trotz Sturm und offenem Fenster"
    assert calls[0][0][0] == KIND_STORM
    assert "95" in calls[0][0][2]

    hub.check_storm()
    assert len(calls) == 1


async def test_ohne_offenes_fenster_keine_warnung(
    hass: HomeAssistant, setup, trv: FakeTrv, monkeypatch
) -> None:
    hub_entry, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    hub = hub_entry.runtime_data

    monkeypatch.setattr(type(ctrl), "paused", property(lambda self: False))
    hub.forecast_hourly = [_hour(1, gust=95, rain=0)]

    calls: list[tuple] = []
    monkeypatch.setattr(hub, "notify", lambda *a, **k: calls.append((a, k)))

    hub.check_storm()
    assert calls == []
