"""Zeitplan eines anderen Raums übernehmen."""

from __future__ import annotations

from types import SimpleNamespace

from homeassistant.core import HomeAssistant

from custom_components.raumklima.shared import domain_data

from .conftest import FakeTrv

SCHED = [{"days": [0, 1, 2], "start": "19:00", "end": "21:00", "temperature": 22.0}]


async def test_fremder_zeitplan_gilt(hass: HomeAssistant, setup, trv: FakeTrv, monkeypatch) -> None:
    hub_entry, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    hub = hub_entry.runtime_data
    other = SimpleNamespace(
        entry=SimpleNamespace(entry_id="wohnzimmer-entry"),
        config={"schedules": SCHED},
        name="Wohnzimmer",
        hub=hub,
    )
    domain_data(hass)["rooms"][other.entry.entry_id] = other
    monkeypatch.setattr(type(ctrl), "hub", property(lambda self: hub))

    ctrl.config["schedule_from"] = other.entry.entry_id

    assert ctrl.schedules == SCHED


async def test_eigener_zeitplan_bleibt_ohne_auswahl(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    ctrl.config["schedules"] = SCHED
    ctrl.config["schedule_from"] = ""

    assert ctrl.schedules == SCHED


async def test_selbstbezug_und_fehlendes_ziel_werden_ignoriert(
    hass: HomeAssistant, setup, trv: FakeTrv
) -> None:
    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    ctrl.config["schedules"] = SCHED

    ctrl.config["schedule_from"] = room.entry_id  # auf sich selbst
    assert ctrl.schedules == SCHED

    ctrl.config["schedule_from"] = "gibt-es-nicht"
    assert ctrl.schedules == SCHED


async def test_geteilter_zeitplan_ohne_eigene_fenster(
    hass: HomeAssistant, setup, trv: FakeTrv, monkeypatch
) -> None:
    """Der übernehmende Raum hat selbst keine Fenster – er nutzt die des anderen."""
    hub_entry, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    hub = hub_entry.runtime_data
    other = SimpleNamespace(
        entry=SimpleNamespace(entry_id="kuche-entry"),
        config={"schedules": SCHED},
        name="Küche",
        hub=hub,
    )
    domain_data(hass)["rooms"][other.entry.entry_id] = other
    monkeypatch.setattr(type(ctrl), "hub", property(lambda self: hub))
    ctrl.config["schedules"] = []
    ctrl.config["schedule_from"] = other.entry.entry_id

    assert ctrl.schedules == SCHED


async def test_vorheizen_mit_fremdem_zeitplan(hass: HomeAssistant, setup, trv: FakeTrv, monkeypatch, freezer) -> None:
    """Auch mit „Zeitplan von" wird vor dem Fenster des anderen Raums vorgeheizt."""
    from datetime import timedelta

    from homeassistant.util import dt as dt_util

    freezer.move_to("2026-06-15 12:00:00+00:00")
    hub_entry, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    hub = hub_entry.runtime_data
    start = (dt_util.now() + timedelta(minutes=60)).strftime("%H:%M")
    other = SimpleNamespace(
        entry=SimpleNamespace(entry_id="buero-entry"),
        config={"schedules": [{"days": [], "start": start, "end": "23:59", "temperature": 26.0}]},
        name="Büro",
        hub=hub,
    )
    domain_data(hass)["rooms"][other.entry.entry_id] = other
    monkeypatch.setattr(type(ctrl), "hub", property(lambda self: hub))
    ctrl.config["schedules"] = []
    ctrl.config["schedule_from"] = other.entry.entry_id
    ctrl.heatup.episodes = [{"rate": 1.0, "outdoor": 5.0, "minutes": 60, "rise": 1.0}] * 3

    on, target, reason = ctrl.plan()
    assert (on, target, reason) == (True, 26.0, "schedule_preheat")
