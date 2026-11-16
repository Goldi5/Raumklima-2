"""Gast-Schalter pro Raum (#53), Zeitplan-Helfer (#52) und Hysterese-Regelung (#54)."""

from __future__ import annotations

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from custom_components.raumklima.const import (
    CAL_HYSTERESIS,
    CONF_HYSTERESIS_K,
    CONF_ROOM_PERSONS,
    CONF_SCHEDULE_ENTITY,
)
from custom_components.raumklima.planning import STAGE_AWAY_SHORT
from custom_components.raumklima.shared import domain_data, get_hub

from .conftest import SENSOR, FakeTrv


async def test_schalter_zaehlt_wie_person(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """#53: input_boolean in „Gilt für Personen“ – an = Raum bleibt warm, aus = Absenkung."""
    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    hub = get_hub(hass, None)
    hass.states.async_set("input_boolean.gast", "off")
    ctrl.config[CONF_ROOM_PERSONS] = ["input_boolean.gast"]
    hub.stage = "home"
    assert hub.stage_for_room(ctrl.entry.entry_id) == STAGE_AWAY_SHORT
    hass.states.async_set("input_boolean.gast", "on")
    assert hub.stage_for_room(ctrl.entry.entry_id) == "home"


async def test_zeitplan_helfer_steuert_das_zeitfenster(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """#52: Helfer an → Zeitfenster mit Temperatur aus dem Block; aus → kein Zeitfenster."""
    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    hass.states.async_set("schedule.bad", "on", {"temperature": 23.5, "next_event": "2099-01-01T06:00:00+00:00"})
    ctrl.config[CONF_SCHEDULE_ENTITY] = "schedule.bad"
    ctrl.track_aux()
    on, target, reason = ctrl.plan()
    assert on and target == 23.5 and reason == "schedule"

    hass.states.async_set("schedule.bad", "off", {"next_event": "2099-01-01T06:00:00+00:00"})
    await hass.async_block_till_done()
    _on, _target, reason = ctrl.plan()
    assert reason != "schedule"
    nxt = ctrl.next_plan_window(dt_util.now())
    assert nxt is not None and nxt[0] > dt_util.now()

    # ohne Temperatur im Block gilt die Wunschtemperatur
    hass.states.async_set("schedule.bad", "on", {})
    on, target, reason = ctrl.plan()
    assert on and reason == "schedule" and target == ctrl.target_temp


async def test_hysterese_schaltet_ganz_auf_und_ganz_zu(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """#54: unter Ziel − h/2 Sollwert ganz hoch, über Ziel + h/2 ganz runter, dazwischen halten."""
    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    ctrl.cal_mode = CAL_HYSTERESIS
    ctrl.config[CONF_HYSTERESIS_K] = 0.5
    target = ctrl.effective_target

    def measure(value: float) -> None:
        hass.states.async_set(SENSOR, str(value), {"unit_of_measurement": "°C", "device_class": "temperature"})

    measure(target - 0.4)
    await hass.async_block_till_done()
    assert ctrl._hysteresis_setpoint(target) == ctrl.trv_max
    measure(target + 0.1)  # im Band: bleibt offen
    await hass.async_block_till_done()
    assert ctrl._hysteresis_setpoint(target) == ctrl.trv_max
    measure(target + 0.3)
    await hass.async_block_till_done()
    assert ctrl._hysteresis_setpoint(target) == ctrl.trv_min
    measure(target - 0.1)  # im Band: bleibt zu
    await hass.async_block_till_done()
    assert ctrl._hysteresis_setpoint(target) == ctrl.trv_min
    assert ctrl.trv_expected_target == ctrl.trv_min


async def test_plan_umschalter_waehlt_zeitplan_je_raum(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """#52: Auswahl-Helfer „Arbeitszeit/frei/krank“ – je Plan eigene Zeitplan-Quelle pro Raum."""
    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    hub = get_hub(hass, None)
    hass.states.async_set("input_select.plan", "Arbeitszeit", {"options": ["Arbeitszeit", "frei", "krank"]})
    hass.states.async_set("schedule.buero_arbeit", "off", {})
    hub.config = {**hub.config, "plan_selector": "input_select.plan"}
    ctrl.config["schedule_by_plan"] = {"Arbeitszeit": "schedule.buero_arbeit", "krank": "always", "frei": "never"}
    assert hub.plan_options() == ["Arbeitszeit", "frei", "krank"]

    assert ctrl.schedule_entity == "schedule.buero_arbeit"
    _on, _t, reason = ctrl.plan()
    assert reason != "schedule"  # Helfer ist aus

    hass.states.async_set("input_select.plan", "krank", {"options": ["Arbeitszeit", "frei", "krank"]})
    on, target, reason = ctrl.plan()
    assert on and reason == "schedule" and target == ctrl.target_temp  # ganztägig Wunsch

    hass.states.async_set("input_select.plan", "frei", {"options": ["Arbeitszeit", "frei", "krank"]})
    _on, _t, reason = ctrl.plan()
    assert reason != "schedule"

    # Plan ohne Eintrag → wie sonst (hier: eigene Zeitfenster, keine vorhanden)
    ctrl.config["schedule_by_plan"] = {"krank": "own"}
    hass.states.async_set("input_select.plan", "krank", {"options": ["Arbeitszeit", "frei", "krank"]})
    assert ctrl.schedule_entity is None
