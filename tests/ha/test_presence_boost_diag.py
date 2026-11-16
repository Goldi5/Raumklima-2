"""Rückmeldung aus einer Diagnose: Kinderzimmer beim Heimkommen, Text, Fortsetzen, Boost-Ende, tado."""

from __future__ import annotations

from datetime import timedelta

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import async_fire_time_changed

from .conftest import FakeTrv


async def test_zimmer_wird_vorgeheizt_wenn_sein_bewohner_heranfaehrt(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """Ein Elternteil ist schon da (Wohnung „home“), das Kind fährt heran: sein Zimmer kühlt nicht ab."""
    from custom_components.raumklima.const import CONF_ROOM_PERSONS
    from custom_components.raumklima.planning import STAGE_AWAY_SHORT, STAGE_PREHEAT
    from custom_components.raumklima.shared import domain_data, get_hub

    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    hub = get_hub(hass, None)
    ctrl.config[CONF_ROOM_PERSONS] = ["person.kim"]
    hub.stage = "home"

    hub.persons = {"person.kim": {"name": "Kim", "present": False, "approaching": True, "distance_km": 0.7}}
    assert hub.stage_for_room(ctrl.entry.entry_id) == STAGE_PREHEAT

    # weit weg (außerhalb des Vorheiz-Umkreises) oder fährt weg: abgesenkt wie bisher
    hub.persons = {"person.kim": {"name": "Kim", "present": False, "approaching": True, "distance_km": 80.0}}
    assert hub.stage_for_room(ctrl.entry.entry_id) == STAGE_AWAY_SHORT
    hub.persons = {"person.kim": {"name": "Kim", "present": False, "approaching": False, "distance_km": 0.7}}
    assert hub.stage_for_room(ctrl.entry.entry_id) == STAGE_AWAY_SHORT
    assert hub.room_persons_missing(ctrl.entry.entry_id) == ["Kim"]


async def test_text_nennt_die_fehlende_person(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """Nicht „alle weg“, wenn nur der Bewohner des Zimmers fehlt."""
    from custom_components.raumklima.const import CONF_ROOM_PERSONS
    from custom_components.raumklima.shared import domain_data, get_hub

    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    hub = get_hub(hass, None)
    ctrl.config[CONF_ROOM_PERSONS] = ["person.kim"]
    hub.stage = "home"
    hub.persons = {"person.kim": {"name": "Kim", "present": False, "approaching": False, "distance_km": 5.0}}
    ctrl._last_plan = None
    on, target, reason = ctrl.plan()
    ctrl._log_plan(on, target, reason)
    entries = hub.log.query(limit=5)
    assert any("Kim nicht da" in str(e.get("why") or "") for e in entries)


async def test_fortsetzen_wird_protokolliert(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    from custom_components.raumklima.shared import domain_data, get_hub

    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    hub = get_hub(hass, None)
    await ctrl.async_set_target(ctrl.comfort_temp + 1.5, by="Alex")
    await ctrl.async_resume_manual(by="Alex")
    entries = hub.log.query(limit=10)
    assert any(e["msg"].startswith("Handverstellung beendet") and "Alex" in str(e.get("why")) for e in entries)


async def test_boost_endet_puenktlich(hass: HomeAssistant, setup, trv: FakeTrv, freezer) -> None:
    """Ohne Wecker lief der Boost bis zum nächsten Abgleich (bis 10 min) weiter."""
    from custom_components.raumklima.shared import domain_data

    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    await ctrl.async_set_boost(minutes=5)
    await hass.async_block_till_done()
    assert ctrl.plan()[2] == "boost"
    assert ctrl._expiry_at == ctrl.boost_until  # Wecker steht auf dem Boost-Ende
    sp_boost = trv.setpoint
    freezer.tick(timedelta(minutes=5, seconds=3))
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(minutes=6))
    await hass.async_block_till_done()
    assert not ctrl.boost_active
    assert ctrl.boost_until is None
    assert trv.setpoint < sp_boost
    state = hass.states.get("climate.bad")
    assert state is not None and state.attributes.get("boost_until") is None


def test_own_program_check_tado() -> None:
    from custom_components.raumklima.health import check_own_program

    assert check_own_program(2, tado=True) is None
    issue = check_own_program(3, tado=True)
    assert issue is not None and "tado" in issue.title
    assert check_own_program(5, tado=False).code == "own_program"
