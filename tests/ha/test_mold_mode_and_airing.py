"""Schimmel-Stufen und einstellbare Mindestdauer fürs Lüften."""

from __future__ import annotations

from datetime import timedelta

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from custom_components.raumklima.const import (
    CONF_AIRING_MIN_MINUTES,
    CONF_MOLD_MODE,
    CONF_OUTDOOR_TEMP,
    CONF_QUIET_SETBACK,
    CONF_ROOM_TYPE,
)
from custom_components.raumklima.shared import domain_data, get_hub

from .conftest import FakeTrv, seed_mold_budget

HUMID = "sensor.bad_feuchte"
OUTSIDE = "sensor.aussen"


def _humid(hass: HomeAssistant, ctrl, hub) -> None:
    hass.states.async_set(HUMID, "88", {"device_class": "humidity", "unit_of_measurement": "%"})
    hass.states.async_set(OUTSIDE, "0.0", {"device_class": "temperature", "unit_of_measurement": "°C"})
    ctrl.config["humidity_sensor"] = HUMID
    ctrl.humidity_sensor = HUMID
    seed_mold_budget(ctrl)
    hub.config[CONF_OUTDOOR_TEMP] = OUTSIDE


def _setup_room(hass: HomeAssistant, setup):
    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    hub = get_hub(hass, None)
    now = dt_util.now()
    hub.config["quiet_start"] = (now - timedelta(hours=1)).strftime("%H:%M:%S")
    hub.config["quiet_end"] = (now + timedelta(hours=1)).strftime("%H:%M:%S")
    hub.config[CONF_QUIET_SETBACK] = True
    ctrl.config[CONF_ROOM_TYPE] = "bedroom"
    _humid(hass, ctrl, hub)
    return ctrl, hub


async def test_schimmel_streng_hebt_ueber_den_wunsch(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    ctrl, hub = _setup_room(hass, setup)
    # Tagsüber prüfen: nachts greift der kleinere Deckel (1,5 K) – siehe test_mold_guardrails
    hub.config[CONF_QUIET_SETBACK] = False
    ctrl.config[CONF_ROOM_TYPE] = "living"
    ctrl.config[CONF_MOLD_MODE] = "strict"
    ctrl.target_temp = 14.5
    _on, target, reason = ctrl.plan()
    assert reason == "mold"
    assert target > ctrl.target_temp


async def test_schimmel_nur_bis_wunsch(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """Stufe „nur bis Wunsch": der Boden hebt nicht über den Wunsch an."""
    ctrl, hub = _setup_room(hass, setup)
    hub.config[CONF_QUIET_SETBACK] = False  # tagsüber prüfen (nachts gilt der 1,5-K-Deckel)
    ctrl.config[CONF_ROOM_TYPE] = "living"
    ctrl.target_temp = 14.5

    ctrl.config[CONF_MOLD_MODE] = "off"
    _on_off, target_off, reason_off = ctrl.plan()

    ctrl.config[CONF_MOLD_MODE] = "wish"
    _on, target_wish, reason_wish = ctrl.plan()

    ctrl.config[CONF_MOLD_MODE] = "strict"
    _on_s, target_strict, reason_strict = ctrl.plan()

    assert reason_off != "mold" and reason_wish != "mold"
    assert target_wish == target_off          # nichts angehoben
    assert reason_strict == "mold"            # strenge Stufe greift
    assert target_strict > target_wish


async def test_schimmel_aus_geht_auf_absenkung(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    ctrl, _hub = _setup_room(hass, setup)
    ctrl.config[CONF_MOLD_MODE] = "off"
    _on, target, reason = ctrl.plan()
    assert reason != "mold"
    assert target == ctrl.setback_long


async def test_mindestdauer_kommt_aus_der_einstellung(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """0 = automatisch, gesetzter Wert gewinnt."""
    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    assert ctrl.vent is not None

    ctrl.config[CONF_AIRING_MIN_MINUTES] = 0
    assert ctrl.vent._min_minutes() is None

    ctrl.config[CONF_AIRING_MIN_MINUTES] = 9
    assert ctrl.vent._min_minutes() == 9


def test_mindestdauer_schlaegt_die_empfehlung() -> None:
    from custom_components.raumklima.ventilation import VENT_AIRING, VENT_DONE, VentInput, evaluate

    base = dict(
        window_open=True,
        open_minutes=5,
        room_temp=21.0,
        temp_at_open=21.0,
        humidity=55.0,
        humidity_high_minutes=0,
        humidity_limit=70.0,
        humidity_hysteresis=5.0,
        min_temp=18.0,
        max_drop=3.0,
        duration=10,
        dries=True,
        min_minutes=9,
    )
    assert evaluate(VentInput(**base)) == VENT_AIRING
    assert evaluate(VentInput(**{**base, "open_minutes": 9})) == VENT_DONE
