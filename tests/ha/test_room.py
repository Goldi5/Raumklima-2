"""Raum mit simuliertem Thermostat: Regeln, Fenster, Bedienung, Neuladen."""

from __future__ import annotations

from datetime import timedelta

from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import async_fire_time_changed

from custom_components.raumklima.const import DOMAIN

from .conftest import SENSOR, WINDOW, FakeTrv


async def advance(hass: HomeAssistant, seconds: float) -> None:
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=seconds))
    await hass.async_block_till_done()


async def test_setup_creates_entities_and_sends_target(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    hub, room = setup
    assert hub.state is ConfigEntryState.LOADED
    assert room.state is ConfigEntryState.LOADED
    state = hass.states.get("climate.bad")
    assert state is not None
    # Erster Start: Wunschtemperatur des Raumtyps Bad (22 °C) statt 18 °C vom Thermostat
    assert state.attributes["temperature"] == 22.0
    assert trv.setpoint == 22.0


async def test_set_temperature_from_ha(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    await hass.services.async_call(
        "climate", "set_temperature", {"entity_id": "climate.bad", "temperature": 20.5}, blocking=True
    )
    await hass.async_block_till_done()
    assert trv.setpoint == 20.5
    assert hass.states.get("climate.bad").attributes["temperature"] == 20.5


async def test_window_pauses_and_resumes(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    hass.states.async_set(WINDOW, "on", {"device_class": "window"})
    await hass.async_block_till_done()
    assert not trv.is_off  # Verzögerung 10 s läuft noch
    await advance(hass, 11)
    assert trv.is_off
    assert hass.states.get("climate.bad").attributes.get("hvac_action") == "off"

    hass.states.async_set(WINDOW, "off", {"device_class": "window"})
    await hass.async_block_till_done()
    await advance(hass, 11)
    assert not trv.is_off
    assert trv.setpoint == 22.0


async def test_short_window_blip_is_ignored(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    hass.states.async_set(WINDOW, "on")
    await hass.async_block_till_done()
    await advance(hass, 3)
    hass.states.async_set(WINDOW, "off")
    await hass.async_block_till_done()
    await advance(hass, 20)
    assert not any(c == ("set_preset_mode", {"preset_mode": "off"}) for c in trv.calls)


async def test_window_contact_unavailable_keeps_last_state(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    hass.states.async_set(WINDOW, "unavailable")
    await hass.async_block_till_done()
    await advance(hass, 20)
    assert not trv.is_off


async def test_manual_change_at_trv_is_followed(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    trv.set(temperature=19.0)
    await hass.async_block_till_done()
    assert hass.states.get("climate.bad").attributes["temperature"] == 19.0


async def test_eco_comfort_flip_does_not_fight(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """Tuya springt selbst zwischen eco und comfort – nicht zurückstellen (0.8.5)."""
    before = len(trv.calls)
    for preset in ("comfort", "eco", "comfort", "eco"):
        trv.set(preset_mode=preset)
        await hass.async_block_till_done()
    preset_calls = [c for c in trv.calls[before:] if c[0] == "set_preset_mode"]
    assert preset_calls == []


async def test_lost_command_is_repeated(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    trv.connected = False
    await hass.services.async_call(
        "climate", "set_temperature", {"entity_id": "climate.bad", "temperature": 21.0}, blocking=True
    )
    assert trv.setpoint == 22.0
    trv.connected = True
    await advance(hass, 25)
    assert trv.setpoint == 21.0


async def test_turn_off_and_on(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    await hass.services.async_call("climate", "turn_off", {"entity_id": "climate.bad"}, blocking=True)
    await hass.async_block_till_done()
    assert trv.is_off
    assert hass.states.get("climate.bad").state == "off"
    await hass.services.async_call("climate", "turn_on", {"entity_id": "climate.bad"}, blocking=True)
    await hass.async_block_till_done()
    assert not trv.is_off


async def test_status_says_off_in_home_assistant(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """„Aus" ist nicht gleich „Aus" (#3): in Home Assistant abgeschaltet."""
    await hass.services.async_call("climate", "turn_off", {"entity_id": "climate.bad"}, blocking=True)
    await hass.async_block_till_done()
    attrs = hass.states.get("climate.bad").attributes
    assert attrs["status"] == "off"
    assert attrs["off_source"] == "user"


async def test_status_says_off_at_thermostat(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """Schaltet das Thermostat selbst ab (eigener Zeitplan, Boost, Drehrad), ist das an der Anzeige erkennbar."""
    trv.set(preset_mode="off")
    await hass.async_block_till_done()
    attrs = hass.states.get("climate.bad").attributes
    assert attrs["status"] == "off_trv"
    assert attrs["off_source"] == "trv"


async def test_unload_stops_all_timers(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    _hub, room = setup
    hass.states.async_set(WINDOW, "on")
    await hass.async_block_till_done()
    assert await hass.config_entries.async_unload(room.entry_id)
    await hass.async_block_till_done()
    calls = len(trv.calls)
    await advance(hass, 3600)
    assert len(trv.calls) == calls  # nach dem Entladen wird nichts mehr gesendet


async def test_sensor_outlier_is_ignored(hass: HomeAssistant, setup) -> None:
    hass.states.async_set(SENSOR, "30.0")
    await hass.async_block_till_done()
    assert hass.states.get("climate.bad").attributes["current_temperature"] == 19.0
    hass.states.async_set(SENSOR, "30.1")  # bestätigt → übernehmen
    await hass.async_block_till_done()
    assert hass.states.get("climate.bad").attributes["current_temperature"] == 30.1


async def test_diagnostics(hass: HomeAssistant, setup) -> None:
    from custom_components.raumklima.diagnostics import async_get_config_entry_diagnostics

    hub, room = setup
    data = await async_get_config_entry_diagnostics(hass, room)
    assert data["trv_available"] is True
    hub_data = await async_get_config_entry_diagnostics(hass, hub)
    assert "decision_log" in hub_data
    assert hass.data[DOMAIN]["rooms"][room.entry_id].name == "Bad"


async def test_schedule_sets_target(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """Ein laufendes Zeitfenster setzt den Sollwert (Issue #2)."""
    from custom_components.raumklima.const import CONF_SCHEDULES
    from custom_components.raumklima.shared import domain_data

    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    assert ctrl.apply_live_options(
        {CONF_SCHEDULES: [{"days": [], "start": "00:00", "end": "23:59", "temperature": 23.5}]}
    )
    await hass.async_block_till_done()
    on, target, reason = ctrl.plan()
    assert reason == "schedule"
    assert target == 23.5


async def test_absence_beats_schedule(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """Niemand da → abgesenkt, auch wenn ein Zeitfenster läuft."""
    from custom_components.raumklima.const import CONF_SCHEDULES
    from custom_components.raumklima.planning import STAGE_AWAY_LONG, STAGE_HOME
    from custom_components.raumklima.shared import domain_data, get_hub

    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    ctrl.apply_live_options(
        {CONF_SCHEDULES: [{"days": [], "start": "00:00", "end": "23:59", "temperature": 23.5}]}
    )
    hub = get_hub(hass, None)
    hub.stage = STAGE_AWAY_LONG
    on, target, reason = ctrl.plan()
    assert reason != "schedule"
    assert target < 23.5
    hub.stage = STAGE_HOME


async def test_boost_is_warmer_and_beats_absence(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """Boost ist wärmer als der Wunsch, schlägt die Abwesenheit und endet nach der Zeit."""
    from custom_components.raumklima.planning import STAGE_AWAY_LONG, STAGE_HOME
    from custom_components.raumklima.shared import domain_data, get_hub

    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    await ctrl.async_set_boost(minutes=30, temperature=2.0)
    assert ctrl.boost_active
    on, target, reason = ctrl.plan()
    assert reason == "boost"
    assert target == min(ctrl.comfort_temp + 2.0, ctrl.trv_max)

    hub = get_hub(hass, None)
    hub.stage = STAGE_AWAY_LONG
    assert ctrl.plan()[2] == "boost"  # bewusste Aktion schlägt die Absenkung

    ctrl.boost_until = dt_util.utcnow() - timedelta(minutes=1)  # abgelaufen
    assert ctrl.plan()[2] != "boost"
    assert not ctrl.boost_active
    hub.stage = STAGE_HOME


async def test_boost_button_starts_and_stops(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """Der Boost-Knopf startet den Boost und beendet ihn beim zweiten Druck."""
    from homeassistant.helpers import entity_registry as er

    _hub, room = setup
    # über den translation_key finden – die Entitäts-ID hängt von der Sprache ab
    eid = next(
        e.entity_id
        for e in er.async_get(hass).entities.values()
        if e.platform == "raumklima" and e.translation_key == "boost"
    )
    assert hass.states.get(eid) is not None, "Boost-Knopf fehlt"
    await hass.services.async_call("button", "press", {"entity_id": eid}, blocking=True)
    await hass.async_block_till_done()
    assert hass.states.get("climate.bad").attributes["boost_until"] is not None
    await hass.services.async_call("button", "press", {"entity_id": eid}, blocking=True)
    await hass.async_block_till_done()
    assert hass.states.get("climate.bad").attributes["boost_until"] is None


async def test_preheats_before_schedule_window(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """Mit gelernter Aufheizzeit wird vor dem Zeitfenster angefangen (Phase 4)."""
    from datetime import timedelta

    from homeassistant.util import dt as dt_util

    from custom_components.raumklima.const import CONF_SCHEDULES
    from custom_components.raumklima.shared import domain_data

    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    # gelernter Wert: 1 K/h (drei Episoden sind das Minimum für eine Rate)
    ctrl.heatup.episodes = [{"rate": 1.0, "outdoor": 5.0, "minutes": 60, "rise": 1.0}] * 3
    start = (dt_util.now() + timedelta(minutes=60)).strftime("%H:%M")
    ctrl.apply_live_options(
        {CONF_SCHEDULES: [{"days": [], "start": start, "end": "23:59", "temperature": 26.0}]}
    )
    await hass.async_block_till_done()
    on, target, reason = ctrl.plan()
    assert reason == "schedule_preheat"
    assert on is True
    assert target == 26.0


async def test_preheat_only_with_rate_and_when_somebody_is_home(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """Ohne gelernte Aufheizzeit und bei Abwesenheit wird nicht vorgeheizt."""
    from datetime import timedelta

    from homeassistant.util import dt as dt_util

    from custom_components.raumklima.const import CONF_SCHEDULES
    from custom_components.raumklima.planning import STAGE_AWAY_LONG, STAGE_HOME
    from custom_components.raumklima.shared import domain_data, get_hub

    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    start = (dt_util.now() + timedelta(minutes=60)).strftime("%H:%M")
    ctrl.apply_live_options(
        {CONF_SCHEDULES: [{"days": [], "start": start, "end": "23:59", "temperature": 26.0}]}
    )
    await hass.async_block_till_done()

    # nichts gelernt → kein Vorheizen
    ctrl.heatup.episodes = []
    assert ctrl.plan()[2] != "schedule_preheat"

    # gelernt, aber niemand da → die Absenkung gewinnt
    ctrl.heatup.episodes = [{"rate": 1.0, "outdoor": 5.0, "minutes": 60, "rise": 1.0}] * 3
    hub = get_hub(hass, None)
    hub.stage = STAGE_AWAY_LONG
    on, target, reason = ctrl.plan()
    assert reason != "schedule_preheat"
    assert target < 26.0
    hub.stage = STAGE_HOME


async def test_quiet_time_sets_back_bedroom(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """Ruhezeit senkt den Schlafraum ab, auch wenn jemand zu Hause ist (Schichtdienst)."""
    from datetime import timedelta

    from homeassistant.util import dt as dt_util

    from custom_components.raumklima.const import CONF_QUIET_SETBACK, CONF_ROOM_TYPE
    from custom_components.raumklima.shared import domain_data, get_hub

    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    hub = get_hub(hass, None)
    now = dt_util.now()
    hub.config["quiet_start"] = (now - timedelta(hours=1)).strftime("%H:%M:%S")
    hub.config["quiet_end"] = (now + timedelta(hours=1)).strftime("%H:%M:%S")
    hub.config[CONF_QUIET_SETBACK] = True
    ctrl.config[CONF_ROOM_TYPE] = "bedroom"

    on, target, reason = ctrl.plan()
    assert reason == "sleep"
    assert on is True
    assert target == ctrl.setback_long


async def test_quiet_time_needs_bedroom_and_setting(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """Ruhezeit senkt nur Schlafräume ab – und nur, wenn es eingeschaltet ist."""
    from datetime import timedelta

    from homeassistant.util import dt as dt_util

    from custom_components.raumklima.const import CONF_QUIET_SETBACK, CONF_ROOM_TYPE
    from custom_components.raumklima.shared import domain_data, get_hub

    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    hub = get_hub(hass, None)
    now = dt_util.now()
    hub.config["quiet_start"] = (now - timedelta(hours=1)).strftime("%H:%M:%S")
    hub.config["quiet_end"] = (now + timedelta(hours=1)).strftime("%H:%M:%S")

    # eingeschaltet, aber kein Schlafraum (Bad) → kein Absenken
    hub.config[CONF_QUIET_SETBACK] = True
    assert ctrl.config[CONF_ROOM_TYPE] == "bathroom"
    assert ctrl.plan()[2] != "sleep"

    # Schlafraum, aber nicht eingeschaltet → kein Absenken
    ctrl.config[CONF_ROOM_TYPE] = "bedroom"
    hub.config[CONF_QUIET_SETBACK] = False
    assert ctrl.plan()[2] != "sleep"


async def test_solar_uses_room_facade(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """Die Fassade des Raums wird an die Sonnenprüfung durchgereicht (Issue #5)."""
    from custom_components.raumklima.const import CONF_SOLAR, CONF_SOLAR_FACADE
    from custom_components.raumklima.shared import domain_data

    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    seen: list[object] = []
    ctrl.hub.sun_expected = lambda facade=None: (seen.append(facade), True)[1]  # type: ignore[method-assign]
    assert ctrl.apply_live_options({CONF_SOLAR: True, CONF_SOLAR_FACADE: "W"})
    await hass.async_block_till_done()
    assert ctrl.config[CONF_SOLAR_FACADE] == "W"
    ctrl.plan()
    assert seen and all(v == "W" for v in seen)

