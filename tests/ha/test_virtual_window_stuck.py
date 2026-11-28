"""#102: Geschätztes Fenster (kein Kontakt) darf nicht dauerhaft „offen“ hängen bleiben."""

from __future__ import annotations

from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.raumklima.const import (
    CONF_CALIBRATION_MODE,
    CONF_COMFORT_TEMP,
    CONF_ROOM_TYPE,
    CONF_SETBACK_SHORT,
    CONF_WINDOWS,
    DOMAIN,
)
from custom_components.raumklima.room_const import reset_room_options
from custom_components.raumklima.shared import domain_data

from .conftest import FakeTrv, hub_entry, room_entry


def _room_without_contact(**options) -> MockConfigEntry:
    entry = room_entry(**options)
    data = dict(entry.data)
    data[CONF_WINDOWS] = []
    return MockConfigEntry(domain=DOMAIN, title=entry.title, unique_id=entry.unique_id, data=data, options=dict(entry.options))


async def test_gespeichertes_offen_ohne_kontakt_wird_beim_start_verworfen(
    hass: HomeAssistant, trv: FakeTrv, sensors, hass_storage
) -> None:
    hub = hub_entry()
    hub.add_to_hass(hass)
    room = _room_without_contact()
    room.add_to_hass(hass)
    # Vor dem Neustart stand ein geschätztes Fenster „offen“ (seit 07:13:44)
    hass_storage[f"{DOMAIN}.{room.entry_id}"] = {
        "version": 1,
        "key": f"{DOMAIN}.{room.entry_id}",
        "data": {"vent": {"window_open_since": "2026-11-28T06:13:44+00:00"}},
    }
    assert await hass.config_entries.async_setup(hub.entry_id)
    await hass.async_block_till_done()
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    assert ctrl.window_open is False
    assert ctrl.window_paused is False
    assert ctrl.vent.window_open_since is None
    assert ctrl.vent.restored_open is None


async def test_haengendes_offen_ohne_kontakt_heilt_sich_selbst(hass: HomeAssistant, trv: FakeTrv, sensors) -> None:
    hub = hub_entry()
    hub.add_to_hass(hass)
    room = _room_without_contact()
    room.add_to_hass(hass)
    assert await hass.config_entries.async_setup(hub.entry_id)
    await hass.async_block_till_done()
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    # Zustand wie im Issue: „offen“, aber kein geschätztes Fenster mehr aktiv
    ctrl._window_raw = True
    ctrl.virtual_open_at = None
    from homeassistant.util import dt as dt_util

    ctrl._check_virtual_window(dt_util.utcnow(), 21.0)
    assert ctrl.window_open is False


def test_reset_behaelt_raumtyp_und_kalibrierung() -> None:
    out = reset_room_options(
        {CONF_ROOM_TYPE: "bathroom", CONF_CALIBRATION_MODE: "target", CONF_COMFORT_TEMP: 23.0, CONF_SETBACK_SHORT: 19.0}
    )
    assert out[CONF_ROOM_TYPE] == "bathroom"
    assert out[CONF_CALIBRATION_MODE] == "target"
    # Standards des Raumtyps statt der eines Wohnraums
    from custom_components.raumklima.plan_const import setback_defaults
    from custom_components.raumklima.ventilation import COMFORT_BY_ROOM

    assert out[CONF_SETBACK_SHORT] == setback_defaults("bathroom")[0]
    assert out[CONF_COMFORT_TEMP] == COMFORT_BY_ROOM["bathroom"]


def test_reset_nimmt_raumtyp_aus_den_daten() -> None:
    out = reset_room_options({}, {CONF_ROOM_TYPE: "bedroom"})
    from custom_components.raumklima.plan_const import setback_defaults

    assert CONF_ROOM_TYPE not in out or out[CONF_ROOM_TYPE] in (None, "bedroom")
    assert out[CONF_SETBACK_SHORT] == setback_defaults("bedroom")[0]
