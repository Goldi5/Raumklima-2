"""Schimmelschutz als Boden (Befund der externen Prüfung) und reines Lesen von plan()."""

from __future__ import annotations

from datetime import timedelta

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from custom_components.raumklima.const import (
    CONF_HUMIDITY_SENSOR,
    CONF_OUTDOOR_TEMP,
    CONF_QUIET_SETBACK,
    CONF_ROOM_TYPE,
    CONF_SCHEDULES,
)
from custom_components.raumklima.shared import domain_data, get_hub

from .conftest import FakeTrv

HUMID = "sensor.bad_feuchte"
OUTSIDE = "sensor.aussen"


def _humid_bad(hass: HomeAssistant, ctrl, hub) -> None:
    """Bad nach dem Duschen: 19 °C, 88 % – der Schimmelboden liegt dann über allen Absenkungen."""
    hass.states.async_set(HUMID, "88", {"device_class": "humidity", "unit_of_measurement": "%"})
    hass.states.async_set(OUTSIDE, "0.0", {"device_class": "temperature", "unit_of_measurement": "°C"})
    # Der Fühler wird beim Aufbau des Raums übernommen (Änderung löst einen Neuladen aus)
    ctrl.config[CONF_HUMIDITY_SENSOR] = HUMID
    ctrl.humidity_sensor = HUMID
    hub.config[CONF_OUTDOOR_TEMP] = OUTSIDE


async def test_ruhezeit_haelt_schimmelboden(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """Ruhezeit senkt nicht unter den Schimmelschutz – die Doku sagt das ausdrücklich zu."""
    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    hub = get_hub(hass, None)
    now = dt_util.now()
    hub.config["quiet_start"] = (now - timedelta(hours=1)).strftime("%H:%M:%S")
    hub.config["quiet_end"] = (now + timedelta(hours=1)).strftime("%H:%M:%S")
    hub.config[CONF_QUIET_SETBACK] = True
    ctrl.config[CONF_ROOM_TYPE] = "bedroom"
    _humid_bad(hass, ctrl, hub)

    on, target, reason = ctrl.plan()
    assert on is True
    assert reason == "mold"
    assert target > ctrl.setback_long


async def test_zeitplan_haelt_schimmelboden(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """Ein kühles Zeitfenster darf einen feuchten Raum nicht unter den Boden drücken."""
    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    hub = get_hub(hass, None)
    _humid_bad(hass, ctrl, hub)
    ctrl.config[CONF_SCHEDULES] = [
        {"days": [], "start": "00:00:00", "end": "23:59:59", "temperature": 16.0}
    ]

    on, target, reason = ctrl.plan()
    assert on is True
    assert reason == "mold"
    assert target > 16.0


async def test_trockene_luft_bleibt_beim_zeitplan(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """Ohne Feuchteproblem bleibt der Zeitplan unangetastet."""
    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    hub = get_hub(hass, None)
    hass.states.async_set(HUMID, "40", {"device_class": "humidity", "unit_of_measurement": "%"})
    hass.states.async_set(OUTSIDE, "0.0", {"device_class": "temperature", "unit_of_measurement": "°C"})
    # Der Fühler wird beim Aufbau des Raums übernommen (Änderung löst einen Neuladen aus)
    ctrl.config[CONF_HUMIDITY_SENSOR] = HUMID
    ctrl.humidity_sensor = HUMID
    hub.config[CONF_OUTDOOR_TEMP] = OUTSIDE
    ctrl.config[CONF_SCHEDULES] = [
        {"days": [], "start": "00:00:00", "end": "23:59:59", "temperature": 16.0}
    ]

    _on, target, reason = ctrl.plan()
    assert reason == "schedule"
    assert target == 16.0


async def test_boost_bleibt_boost(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """Bewusste Aktion schlägt den Boden – Boost wird nicht umgedeutet."""
    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    hub = get_hub(hass, None)
    _humid_bad(hass, ctrl, hub)
    ctrl.boost_until = dt_util.utcnow() + timedelta(minutes=30)
    ctrl.boost_temperature = 24.0

    _on, target, reason = ctrl.plan()
    assert reason == "boost"
    assert target == 24.0


async def test_peek_verbraucht_keinen_zustand(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """Anzeigen dürfen die Regelung nicht verändern: kein Boost-Ablauf, keine Hysterese."""
    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]

    # abgelaufener Boost: plan() würde ihn verwerfen und speichern, peek_plan() nicht
    ctrl.boost_until = dt_util.utcnow() - timedelta(minutes=1)
    ctrl.boost_temperature = 23.0
    ctrl.peek_plan()
    assert ctrl.boost_until is not None and ctrl.boost_temperature == 23.0

    # Sonnen-Hysterese: peek darf sie nicht scharf stellen
    ctrl._solar_active = False
    ctrl._peeking = True
    try:
        ctrl._solar_applies(get_hub(hass, None))
    finally:
        ctrl._peeking = False
    assert ctrl._solar_active is False
