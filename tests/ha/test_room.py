"""Raum mit simuliertem Thermostat: Regeln, Fenster, Bedienung, Neuladen."""

from __future__ import annotations

from datetime import timedelta

from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import async_fire_time_changed

from custom_components.raumklima.const import CONF_CALIBRATION_MODE, DOMAIN

from .conftest import SENSOR, TRV, WINDOW, FakeTrv, hub_entry, room_entry


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


async def test_heating_inferred_without_device_signal(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """Aqara E1 / HmIP-WTH melden keinen Heiz-Zustand – dann zählt die Nachfrage (Issue #18, #11)."""
    trv.attrs.pop("hvac_action")
    trv.push()
    await hass.async_block_till_done()
    await advance(hass, 1)
    assert hass.states.get("climate.bad").attributes.get("hvac_action") == "heating"

    # In zwei Schritten, damit der Sprung-Schutz echte Messwerte nicht verwirft (3 K).
    hass.states.async_set(SENSOR, "21.0", {"unit_of_measurement": "°C", "device_class": "temperature"})
    await hass.async_block_till_done()
    await advance(hass, 2)
    hass.states.async_set(SENSOR, "22.6", {"unit_of_measurement": "°C", "device_class": "temperature"})
    await hass.async_block_till_done()
    await advance(hass, 2)
    assert hass.states.get("climate.bad").attributes.get("hvac_action") == "idle"


async def test_sensor_valid_even_without_stored_reading(hass: HomeAssistant, setup) -> None:
    """Fühler liefert einen gültigen Wert, obwohl beim Start noch keiner ankam (Issue #10)."""
    hass.states.async_set(SENSOR, "20.5", {"unit_of_measurement": "°C", "device_class": "temperature"})
    await hass.async_block_till_done()
    await advance(hass, 1)
    status = hass.states.get("climate.bad").attributes.get("status")
    assert status != "sensor_unavailable"


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
    assert data["rooms"][0]["values"]["trv_available"] is True
    assert data["rooms"][0]["entities"]["climate.bad"]["state"] == "heat"
    hub_data = await async_get_config_entry_diagnostics(hass, hub)
    assert isinstance(hub_data["log"], list) and hub_data["log"]
    assert hub_data["debug"] is not None
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


async def test_preheats_before_schedule_window(
    hass: HomeAssistant, setup, trv: FakeTrv, freezer
) -> None:
    """Mit gelernter Aufheizzeit wird vor dem Zeitfenster angefangen (Phase 4)."""
    from datetime import timedelta

    from homeassistant.util import dt as dt_util

    from custom_components.raumklima.const import CONF_SCHEDULES
    from custom_components.raumklima.shared import domain_data

    # Feste Uhrzeit: sonst liegt „in 60 Minuten" je nach Tageszeit hinter Mitternacht
    # und das Fenster gilt als bereits laufend (HA-Tests laufen in US/Pacific).
    freezer.move_to("2026-06-15 12:00:00+00:00")

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


async def test_home_location_overrides_hass_location(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """Eine fern überwachte Wohnung nutzt ihren eigenen Standort für den Sonnenstand."""
    from custom_components.raumklima.const import CONF_LATITUDE, CONF_LONGITUDE
    from custom_components.raumklima.shared import get_hub

    _hub, _room = setup
    hub = get_hub(hass, None)
    assert hub.sun_location == (hass.config.latitude, hass.config.longitude)

    hub.config[CONF_LATITUDE] = 52.51
    hub.config[CONF_LONGITUDE] = 13.40
    assert hub.sun_location == (52.51, 13.40)  # Berlin statt Remscheid

    # 0/0 gilt nicht als Standort → Rückfall auf Home Assistant
    hub.config[CONF_LATITUDE] = 0.0
    hub.config[CONF_LONGITUDE] = 0.0
    assert hub.sun_location == (hass.config.latitude, hass.config.longitude)


async def test_settings_dump_has_schedules(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """Der Zeitplan-Editor muss die gespeicherten Fenster sehen (Issue #8)."""
    from custom_components.raumklima.const import CONF_BOOST_MINUTES, CONF_BOOST_TEMP, CONF_SCHEDULES
    from custom_components.raumklima.shared import domain_data

    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    fenster = {"days": [0, 2], "start": "19:00", "end": "21:00", "temperature": 22.0}
    assert ctrl.apply_live_options(
        {CONF_SCHEDULES: [fenster], CONF_BOOST_TEMP: 3.0, CONF_BOOST_MINUTES: 45}
    )
    await hass.async_block_till_done()
    settings = ctrl.settings_summary()
    assert settings["schedules"] == [fenster]
    assert settings["boost_temperature"] == 3.0
    assert settings["boost_minutes"] == 45


async def test_window_open_since_survives_restart(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """Der Öffnungszeitpunkt wandert in den Speicher und wird genau einmal übernommen (Issue #9)."""
    from custom_components.raumklima.shared import domain_data
    from custom_components.raumklima.vent_manager import VentilationManager

    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    alt = dt_util.utcnow() - timedelta(hours=3)
    ctrl.vent.window_open_since = alt

    stored = ctrl._stored_data()
    assert stored["vent"]["window_open_since"] == alt.isoformat()

    # Neustart: neuer Lüftungs-Assistent übernimmt den gespeicherten Zeitpunkt
    neu = VentilationManager(ctrl, None)
    neu.load(stored["vent"])
    assert neu._take_restored() == alt
    assert neu._take_restored() is None  # nur einmal – danach gilt „jetzt"


async def test_climate_exposes_window_open_since(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """Die Karte bekommt den Öffnungszeitpunkt als Attribut (Grundlage für den Timer)."""
    from custom_components.raumklima.shared import domain_data

    _hub, room = setup
    hass.states.async_set(WINDOW, "on", {"device_class": "window"})
    await hass.async_block_till_done()
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    assert ctrl.vent.window_open_since is not None
    st = hass.states.get("climate.bad")
    assert st is not None and st.attributes.get("window_open_since") == ctrl.vent.window_open_since.isoformat()


async def test_sun_location_prefers_zone(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """Ohne eigene Koordinaten zählt die Zone der Wohnung – nicht der Standort der Zentrale."""
    from custom_components.raumklima.const import CONF_LATITUDE, CONF_LONGITUDE, CONF_ZONE
    from custom_components.raumklima.shared import get_hub

    _hub, _room = setup
    hub = get_hub(hass, None)
    hass.states.async_set("zone.gunterstr_berlin", "1", {"latitude": 52.5, "longitude": 13.4})
    hub.config[CONF_ZONE] = "zone.gunterstr_berlin"
    assert hub.sun_location == (52.5, 13.4)

    # eigene Angabe schlägt die Zone
    hub.config[CONF_LATITUDE] = 51.18
    hub.config[CONF_LONGITUDE] = 7.19
    assert hub.sun_location == (51.18, 7.19)


async def test_climate_exposes_trv_target(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """Der Sollwert am Thermostat wird ausgeliefert – er erklärt abweichende Statusanzeigen (Issue #11)."""
    from custom_components.raumklima.shared import domain_data

    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    # Der Wert spiegelt, was wirklich am Thermostat steht
    geraet = hass.states.get("climate.trv_bad")
    assert ctrl.trv_target == geraet.attributes.get("temperature")
    st = hass.states.get("climate.bad")
    assert st is not None and st.attributes.get("trv_target") == ctrl.trv_target


async def test_room_exposes_home_entry_id(hass: HomeAssistant, setup) -> None:
    """`home` ist die ID der Wohnung – genau darauf filtert die Dashboard-Strategie (Issue #10)."""
    hub, _room = setup  # setup liefert (Zentrale, Raum) als ConfigEntries
    st = hass.states.get("climate.bad")
    assert st is not None
    assert st.attributes.get("home") == hub.entry_id



async def test_window_open_und_close_speichern_sofort(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """Beim Öffnen und Schließen wird sofort gesichert (Issue #9)."""
    from custom_components.raumklima.shared import domain_data

    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    calls: list[int] = []
    ctrl.save = lambda: calls.append(1)  # type: ignore[method-assign]

    ctrl.vent.on_window_raw(True)
    assert calls, "Beim Öffnen muss der Zustand gesichert werden"
    ctrl.vent.on_window_raw(False)
    assert len(calls) == 2, "Auch das Schließen muss gesichert werden"


async def test_temperature_zeigt_angewendetes_ziel(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """Aktives Zeitfenster: `temperature` ist das Fensterziel, `wish` der Wunsch (Issue #12)."""
    from custom_components.raumklima.const import CONF_SCHEDULES
    from custom_components.raumklima.shared import domain_data

    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    ctrl.target_temp = 17.0
    assert ctrl.apply_live_options(
        {CONF_SCHEDULES: [{"days": [], "start": "00:00", "end": "23:59", "temperature": 19.0}]}
    )
    await hass.async_block_till_done()
    await advance(hass, 5)

    st = hass.states.get("climate.bad")
    assert st is not None
    assert st.attributes["temperature"] == 19.0, "Ziel ist das, worauf der Raum regelt"
    assert st.attributes["wish"] == 17.0, "Wunsch bleibt der eingestellte Wert"


async def test_health_meldet_automatik_modus(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """Steht das Thermostat auf Auto, erscheint es in der Gesundheitsliste (Issue #13)."""
    from custom_components.raumklima.shared import domain_data

    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    before = {i.code for i in ctrl.health_issues(dt_util.utcnow())}
    assert "trv_mode" not in before

    trv.state = "auto"
    trv.push()
    codes = {i.code for i in ctrl.health_issues(dt_util.utcnow())}
    assert "trv_mode" in codes


async def test_dauer_preset_bei_offenem_fenster_ist_kein_fehler(hass: HomeAssistant, setup, trv: FakeTrv, monkeypatch) -> None:
    """Bei Fensterpause schalten **wir** das Ventil aus – das darf kein Fehlalarm sein.

    Vorher meldete die Gesundheitsliste bei jeder Lüftung „Thermostat steht auf Dauerbetrieb"
    (Preset `off`, das wir selbst gesetzt haben) und der Problem-Sensor der Karte blieb rot.
    """
    from custom_components.raumklima.shared import domain_data

    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    trv.state = "off"
    trv.set(preset_mode="off")

    # Ohne Pause bleibt das Preset „off" ein Befund: das Gerät heizt dann gar nicht.
    monkeypatch.setattr(type(ctrl), "paused", property(lambda self: False))
    assert "trv_mode" in {i.code for i in ctrl.health_issues(dt_util.utcnow())}

    # Mit Fensterpause ist genau dieses Preset gewollt – keine Meldung.
    monkeypatch.setattr(type(ctrl), "paused", property(lambda self: True))
    assert "trv_mode" not in {i.code for i in ctrl.health_issues(dt_util.utcnow())}


async def test_ueberwachungsraum_hat_kein_ziel(hass: HomeAssistant, sensors) -> None:
    """Raum ohne Heizung: kein Ziel, keine Modi, kein Boost – aber Temperatur und Status Überwachung."""
    from custom_components.raumklima.const import STATUS_MONITOR

    hub = hub_entry()
    hub.add_to_hass(hass)
    room = room_entry(trv="")
    room.add_to_hass(hass)
    assert await hass.config_entries.async_setup(room.entry_id)
    await hass.async_block_till_done()

    c = room.runtime_data
    assert c.monitor is True
    assert c.status == STATUS_MONITOR

    st = hass.states.get("climate.bad")
    assert st is not None, "Überwachungsraum bleibt eine Entität (Karten, Verlauf, Bericht)"
    assert st.attributes["monitor"] is True
    assert st.attributes.get("temperature") is None
    assert st.attributes["hvac_modes"] == []
    assert st.attributes.get("current_temperature") is not None

    assert not [e for e in hass.states.async_entity_ids("button") if "boost" in e.lower()]


async def test_thermostat_im_optionsdialog_optional(hass: HomeAssistant, sensors) -> None:
    """Im Optionsdialog eines Überwachungsraums ist das Thermostat optional (leer = weiter messen)."""
    hub = hub_entry()
    hub.add_to_hass(hass)
    room = room_entry(trv="")
    room.add_to_hass(hass)
    assert await hass.config_entries.async_setup(room.entry_id)
    await hass.async_block_till_done()

    result = await hass.config_entries.options.async_init(room.entry_id)
    assert result["step_id"] == "init"
    # ohne Thermostat absenden: muss durchgehen (vorher war das Feld Pflicht)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"temperature_sensor": SENSOR, "window_sensors": [], "extra_trvs": []},
    )
    assert result["step_id"] == "room"


async def test_thermostat_nachtraeglich_ergaenzen(hass: HomeAssistant, sensors, trv: FakeTrv) -> None:
    """Wird ein Thermostat nachgetragen, wird aus dem Überwachungsraum ein Heizraum."""
    from custom_components.raumklima.const import CONF_TRV

    hub = hub_entry()
    hub.add_to_hass(hass)
    room = room_entry(trv="")
    room.add_to_hass(hass)
    assert await hass.config_entries.async_setup(room.entry_id)
    await hass.async_block_till_done()
    assert room.runtime_data.monitor is True

    hass.config_entries.async_update_entry(room, options={**room.options, CONF_TRV: TRV})
    await hass.async_block_till_done()
    assert await hass.config_entries.async_reload(room.entry_id)
    await hass.async_block_till_done()

    assert room.runtime_data.monitor is False
    st = hass.states.get("climate.bad")
    assert st is not None
    assert st.attributes["monitor"] is False
    assert st.attributes["hvac_modes"] == ["heat", "off"]
    assert st.attributes.get("temperature") is not None


async def test_ventilsensor_wird_am_geraet_erkannt(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """Danfoss Ally liefert die Ventilstellung als eigenen Sensor (…_valve_opening, Issue #15)."""
    from homeassistant.helpers import device_registry as dr, entity_registry as er

    from custom_components.raumklima.shared import domain_data

    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    devs = dr.async_get(hass)
    regs = er.async_get(hass)
    device = devs.async_get_or_create(config_entry_id=room.entry_id, identifiers={("demo", "ally1")})
    regs.async_get_or_create("climate", "demo", "c1", suggested_object_id="ally_thermostat", device_id=device.id)
    regs.async_get_or_create("sensor", "demo", "v1", suggested_object_id="ally_valve_opening", device_id=device.id)
    hass.states.async_set("sensor.ally_valve_opening", "42", {"unit_of_measurement": "%"})
    ctrl.trv = "climate.ally_thermostat"

    assert ctrl._find_valve_sensor() == "sensor.ally_valve_opening"


async def test_ventilsensor_auf_eigenem_geraet_gleichen_namens(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """Danfoss Ally legt die Ventilstellung auf ein zweites Gerät mit gleichem Namen (Issue #15)."""
    from homeassistant.helpers import device_registry as dr, entity_registry as er

    from custom_components.raumklima.shared import domain_data

    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    devs = dr.async_get(hass)
    regs = er.async_get(hass)

    trv_dev = devs.async_get_or_create(
        config_entry_id=room.entry_id, identifiers={("demo", "ally2")}, name="Danfoss Ally Büro Mike"
    )
    regs.async_get_or_create("climate", "demo", "c2", suggested_object_id="ally_buero", device_id=trv_dev.id)
    valve_dev = devs.async_get_or_create(
        config_entry_id=room.entry_id, identifiers={("demo", "ally2-valve")}, name="Danfoss Ally Büro Mike"
    )
    regs.async_get_or_create(
        "sensor", "demo", "v2", suggested_object_id="danfoss_ally_buero_mike_valve_opening", device_id=valve_dev.id
    )
    hass.states.async_set("sensor.danfoss_ally_buero_mike_valve_opening", "42", {"unit_of_measurement": "%"})
    ctrl.trv = "climate.ally_buero"

    assert ctrl._find_valve_sensor() == "sensor.danfoss_ally_buero_mike_valve_opening"


async def test_ventilsensor_mehrdeutig_wird_nicht_geraten(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """Zwei fremde Ventilsensoren ohne Bezug: lieber nichts anzeigen als den falschen Raum."""
    from homeassistant.helpers import device_registry as dr, entity_registry as er

    from custom_components.raumklima.shared import domain_data

    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    devs = dr.async_get(hass)
    regs = er.async_get(hass)
    for i, name in enumerate(("Fremd A", "Fremd B")):
        dev = devs.async_get_or_create(config_entry_id=room.entry_id, identifiers={("demo", f"f{i}")}, name=name)
        eid = f"sensor.fremd_{i}_valve_opening"
        regs.async_get_or_create("sensor", "demo", f"fv{i}", suggested_object_id=f"fremd_{i}_valve_opening", device_id=dev.id)
        hass.states.async_set(eid, "30", {"unit_of_measurement": "%"})

    assert ctrl._find_valve_sensor() is None


async def test_fuehler_gilt_nicht_als_ausgefallen_nur_weil_der_wert_alt_ist(hass: HomeAssistant, setup, trv: FakeTrv, freezer) -> None:
    """Fühler, die nur bei Änderung senden, sind nicht ausgefallen (Issue #11)."""
    from datetime import timedelta

    from custom_components.raumklima.shared import domain_data

    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    assert ctrl.sensor_ok

    freezer.tick(timedelta(hours=3))
    await hass.async_block_till_done()

    assert ctrl.sensor_ok, "Alter allein darf keinen Ausfall erzeugen"
    assert ctrl.sensor_age_minutes is not None and ctrl.sensor_age_minutes > 60
    state = hass.states.get("climate.bad")
    assert state is not None and state.attributes.get("status") != "sensor_unavailable"


async def test_ventilsensor_ueber_gemeinsamen_namensstamm(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """climate.danfoss_ally_buro_mike ↔ sensor.danfoss_ally_buro_mike_valve_opening (Issue #15)."""
    from homeassistant.helpers import device_registry as dr, entity_registry as er

    from custom_components.raumklima.shared import domain_data

    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    devs = dr.async_get(hass)
    regs = er.async_get(hass)

    trv_dev = devs.async_get_or_create(config_entry_id=room.entry_id, identifiers={("demo", "st1")}, name="Danfoss Ally Büro Mike")
    regs.async_get_or_create("climate", "demo", "st1c", suggested_object_id="danfoss_ally_buro_mike", device_id=trv_dev.id)
    valve_dev = devs.async_get_or_create(config_entry_id=room.entry_id, identifiers={("demo", "st1v")}, name="Danfoss Ventilplatine")
    regs.async_get_or_create(
        "sensor", "demo", "st1s", suggested_object_id="danfoss_ally_buro_mike_valve_opening", device_id=valve_dev.id
    )
    hass.states.async_set("sensor.danfoss_ally_buro_mike_valve_opening", "42", {"unit_of_measurement": "%"})
    ctrl.trv = "climate.danfoss_ally_buro_mike"

    assert ctrl._find_valve_sensor() == "sensor.danfoss_ally_buro_mike_valve_opening"


async def test_ventilsensor_ueber_bereich_des_geraets(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """Der Bereich steht am Gerät, nicht an der Entität – darüber muss die Suche greifen."""
    from homeassistant.helpers import area_registry as ar, device_registry as dr, entity_registry as er

    from custom_components.raumklima.shared import domain_data

    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    areas = ar.async_get(hass)
    area = areas.async_create("Werkstatt")
    devs = dr.async_get(hass)
    regs = er.async_get(hass)

    trv_dev = devs.async_get_or_create(
        config_entry_id=room.entry_id, identifiers={("demo", "t9")}, name="Thermostat Werkstatt", suggested_area=area.name
    )
    regs.async_get_or_create("climate", "demo", "c9", suggested_object_id="werkstatt_thermostat", device_id=trv_dev.id)
    valve_dev = devs.async_get_or_create(
        config_entry_id=room.entry_id, identifiers={("demo", "t9v")}, name="Ventilplatine", suggested_area=area.name
    )
    regs.async_get_or_create("sensor", "demo", "v9", suggested_object_id="werkstatt_valve_opening", device_id=valve_dev.id)
    hass.states.async_set("sensor.werkstatt_valve_opening", "55", {"unit_of_measurement": "%"})
    ctrl.trv = "climate.werkstatt_thermostat"

    assert ctrl._find_valve_sensor() == "sensor.werkstatt_valve_opening"


async def test_geaenderte_einstellungen_werden_gemeldet(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """Die Karte zeigt, wie viele Einstellungen vom Standard abweichen."""
    from custom_components.raumklima.shared import domain_data

    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    before = ctrl.settings_summary()["changed"]
    assert "window_open_delay" not in before

    hass.config_entries.async_update_entry(room, options={**room.options, "window_open_delay": 30})
    await hass.async_block_till_done()
    assert "window_open_delay" in ctrl.settings_summary()["changed"]


async def test_dachluke_zaehlt_als_fenster(hass: HomeAssistant, sensors) -> None:
    """Eine Dachluke (cover) wird wie ein Fensterkontakt behandelt."""
    from pytest_homeassistant_custom_component.common import MockConfigEntry

    from custom_components.raumklima.const import (
        CONF_NAME,
        CONF_TEMP_SENSOR,
        CONF_TRV,
        CONF_WINDOWS,
        DOMAIN,
    )

    hass.states.async_set("cover.dachluke", "closed", {"current_position": 0, "device_class": "window"})
    hub = hub_entry()
    hub.add_to_hass(hass)
    room = MockConfigEntry(
        domain=DOMAIN,
        title="Gästebad",
        unique_id="cover.dachluke",
        data={
            CONF_NAME: "Gästebad",
            CONF_TRV: TRV,
            CONF_TEMP_SENSOR: SENSOR,
            CONF_WINDOWS: ["cover.dachluke"],
        },
        options={"room_type": "bathroom", "window_open_delay": 10, "window_close_delay": 10},
    )
    room.add_to_hass(hass)
    assert await hass.config_entries.async_setup(room.entry_id)
    await hass.async_block_till_done()

    ctrl = room.runtime_data
    assert ctrl.window_open is False

    hass.states.async_set("cover.dachluke", "open", {"current_position": 100})
    await hass.async_block_till_done()
    await advance(hass, 20)
    assert ctrl.window_open is True


async def test_meldeabstand_des_thermostats_wird_gemessen(
    hass: HomeAssistant, setup, trv: FakeTrv, freezer
) -> None:
    """FRITZ!DECT meldet nur alle 15 min – daraus ergibt sich die Geduld (Issue #16)."""
    from datetime import timedelta

    from custom_components.raumklima.shared import domain_data

    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    assert ctrl.trv_report_interval is None

    for i in range(4):
        freezer.tick(timedelta(minutes=15))
        trv.set(temperature=19.0 + (i % 2) * 0.5)
        await hass.async_block_till_done()

    interval = ctrl.trv_report_interval
    assert interval is not None
    assert 850 <= interval <= 950


async def test_room_stays_available_when_trv_is_gone(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """Fehlendes Thermostat ist ein Status, kein Ausfall: die Wohnung bleibt am Raum erkennbar."""
    from .conftest import TRV

    state = hass.states.get("climate.bad")
    assert state is not None and state.state != "unavailable"

    hass.states.async_set(TRV, "unavailable")
    await hass.async_block_till_done()

    state = hass.states.get("climate.bad")
    assert state is not None and state.state != "unavailable"
    assert state.attributes["status"] == "trv_unavailable"
    # Ohne dieses Attribut landet der Raum auf dem Dashboard der falschen Wohnung
    assert "home" in state.attributes


async def test_manual_change_at_trv_is_adopted_with_cal_target(
    hass: HomeAssistant, trv: FakeTrv, sensors: None
) -> None:
    """Drehen am Wandthermostat wird übernommen, auch wenn der Sollwert-Ausgleich läuft (#11)."""
    hub = hub_entry()
    hub.add_to_hass(hass)
    room = room_entry(**{CONF_CALIBRATION_MODE: "target"})
    room.add_to_hass(hass)
    assert await hass.config_entries.async_setup(hub.entry_id)
    await hass.async_block_till_done()
    await advance(hass, 1)

    trv.set(temperature=21.5)
    await hass.async_block_till_done()
    await advance(hass, 2)

    # Fühler und TRV zeigen hier denselben Wert -> Abgleich 0, der Wunsch kommt 1:1 an.
    assert hass.states.get("climate.bad").attributes["temperature"] == 21.5


async def test_room_at_setback_level_still_reports_setback(hass: HomeAssistant, trv: FakeTrv, sensors: None) -> None:
    """Wunsch = Absenkwert: nichts zu senken, aber der Raum ist trotzdem „abgesenkt"."""
    from custom_components.raumklima.const import CONF_SETBACK_SHORT
    from custom_components.raumklima.shared import domain_data

    hub = hub_entry()
    hub.add_to_hass(hass)
    room = room_entry(**{CONF_SETBACK_SHORT: 18.0})
    room.add_to_hass(hass)
    assert await hass.config_entries.async_setup(hub.entry_id)
    await hass.async_block_till_done()

    hub_obj = hub.runtime_data
    hub_obj.stage = "away_short"
    controller = domain_data(hass)["rooms"][room.entry_id]
    controller.target_temp = 18.0
    controller.notify_listeners()
    await hass.async_block_till_done()

    assert hass.states.get("climate.bad").attributes["status"] == "setback"
    assert hass.states.get("climate.bad").attributes["temperature"] == 18.0


async def test_manual_change_overrides_schedule_for_a_while(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """Von Hand gestellt pausiert den Zeitplan (René-Wunsch: „2 h wärmer über Alexa")."""
    from custom_components.raumklima.const import CONF_SCHEDULES
    from custom_components.raumklima.shared import domain_data

    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    assert ctrl.apply_live_options(
        {
            CONF_SCHEDULES: [{"days": [], "start": "00:00", "end": "23:59", "temperature": 19.0}],
            "override_minutes": 120,
        }
    )
    await hass.async_block_till_done()
    assert ctrl.plan()[2] == "schedule"

    await hass.services.async_call(
        "climate", "set_temperature", {"entity_id": "climate.bad", "temperature": 21.5}, blocking=True
    )
    await hass.async_block_till_done()

    on, target, reason = ctrl.plan()
    assert reason == "manual"
    assert target == 21.5
    assert hass.states.get("climate.bad").attributes["temperature"] == 21.5

    # Nach Ablauf der Pause gilt wieder der Zeitplan
    from datetime import timedelta as _td

    from homeassistant.util import dt as _dt

    ctrl._manual_until = _dt.utcnow() - _td(minutes=1)
    assert ctrl.plan()[2] == "schedule"
    assert ctrl.plan()[1] == 19.0


async def test_ventilsensor_aus_anderer_wohnung_wird_nicht_genommen(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """Zwei Wohnungen in einer Installation: „Finja“ darf nicht den Sensor aus „Finja Berlin“ erben.

    Beide RWE-Thermostate (VRCC) melden keine Ventilstellung. Der Namensstamm „Finja“ passte aber
    auf ein Gerät der anderen Wohnung („Finja Berlin - Wohnzimmer Thermostat“) – deshalb zeigte
    genau ein Raum einen fremden Wert. Jetzt entscheidet der Bereich mit.
    """
    from homeassistant.helpers import area_registry as ar, device_registry as dr, entity_registry as er

    from custom_components.raumklima.shared import domain_data

    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    areas = ar.async_get(hass)
    devs = dr.async_get(hass)
    regs = er.async_get(hass)

    eigen = areas.async_create("Finja")
    fremd = areas.async_create("Finja Berlin")

    trv_dev = devs.async_get_or_create(
        config_entry_id=room.entry_id, identifiers={("demo", "vrcc-finja")}, name="Finja", suggested_area="Finja"
    )
    devs.async_update_device(trv_dev.id, area_id=eigen.id)
    regs.async_get_or_create("climate", "demo", "vrcc-c", suggested_object_id="finja", device_id=trv_dev.id)

    fremd_dev = devs.async_get_or_create(
        config_entry_id=room.entry_id,
        identifiers={("demo", "berlin-wz")},
        name="Finja Berlin - Wohnzimmer Thermostat",
    )
    devs.async_update_device(fremd_dev.id, area_id=fremd.id)
    regs.async_get_or_create("climate", "demo", "berlin-c", suggested_object_id="finja_berlin_wz", device_id=fremd_dev.id)
    regs.async_get_or_create(
        "sensor", "demo", "berlin-p", suggested_object_id="finja_berlin_wohnzimmer_thermostat_position", device_id=fremd_dev.id
    )
    hass.states.async_set("sensor.finja_berlin_wohnzimmer_thermostat_position", "14", {"unit_of_measurement": "%"})
    ctrl.trv = "climate.finja"

    assert ctrl._find_valve_sensor() is None


async def test_erwarteter_sollwert_ignoriert_abschlag_im_kalten_raum(
    hass: HomeAssistant, setup, monkeypatch
) -> None:
    """Der erwartete Sollwert muss denselben Abgleich nutzen wie der Schreibpfad.

    Anlass: Der Raum lag unter dem Ziel, deshalb schrieb die Integration 21,0 °C ohne Abschlag.
    Erwartet wurden aber 20,5 °C (Ziel + Abgleich) — die Gegenprobe meldete „Thermostat
    übernimmt den Sollwert nicht", obwohl das Gerät genau den geschriebenen Wert hatte.
    """
    from custom_components.raumklima.const import CAL_TARGET
    from custom_components.raumklima.shared import domain_data

    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    ctrl.cal_mode = CAL_TARGET  # Abgleich über den Sollwert (wie im gemeldeten Raum)
    ctrl.shift = -0.5
    ctrl.target_temp = 20.5

    # Raum zu kalt (unter Ziel − 0,2 K): Abgleich wird ausgesetzt → Erwartung ist das Ziel
    monkeypatch.setattr(type(ctrl), "current_temperature", property(lambda self: 19.0))
    assert ctrl.trv_expected_target == 20.5, "kein Abschlag, solange der Raum zu kalt ist"

    # Raum warm: Abgleich gilt wieder → Erwartung ist Ziel + Abgleich
    monkeypatch.setattr(type(ctrl), "current_temperature", property(lambda self: 21.0))
    assert ctrl.trv_expected_target == 20.0


async def test_aus_ohne_bekannte_minimaltemperatur_schreibt_nichts(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """Issue #37: Beim Start ist `min_temp` unbekannt – dann nicht den Rückfallwert 5,0 schreiben.

    Vorher fror der Aus-Befehl den Fallback ein, das Gerät bestätigte ihn nie (es kennt z. B.
    min_temp 4,0), und nach fünf Runden kam eine dringende Meldung – bei jedem Neustart.
    """
    from custom_components.raumklima.shared import domain_data

    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    ctrl.config["off_method"] = "min_temp"

    # Gerät meldet beim Start noch keine Grenzen
    trv.attrs.pop("min_temp", None)
    trv.push()
    await hass.async_block_till_done()

    await ctrl.async_set_hvac_on(False)
    await advance(hass, 5)
    written = [float(c[1].get("temperature", -1)) for c in trv.calls if c[0] == "set_temperature"]
    assert 5.0 not in written, f"kein Rückfallwert, solange die Grenze unbekannt ist: {written}"

    # Sobald die Grenze bekannt ist, wird sie auch geschrieben.
    trv.set(min_temp=4.0)
    await advance(hass, 60)
    assert [
        c for c in trv.calls if c[0] == "set_temperature" and float(c[1].get("temperature", -1)) == 4.0
    ], "mit bekannter Grenze wird abgeschaltet"
