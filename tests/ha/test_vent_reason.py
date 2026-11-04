"""„Fertig gelüftet" nennt den richtigen Grund – auch nach einem Neustart."""

from __future__ import annotations

from homeassistant.core import HomeAssistant

from custom_components.raumklima.const import DOMAIN

from .conftest import WINDOW, FakeTrv, hub_entry, room_entry

CO2 = "sensor.bad_co2"


async def _setup_room(hass: HomeAssistant, **options) -> tuple[object, object]:
    hub = hub_entry()
    hub.add_to_hass(hass)
    room = room_entry(**options)
    room.add_to_hass(hass)
    assert await hass.config_entries.async_setup(hub.entry_id)
    await hass.async_block_till_done()
    return hub, room


async def test_grund_kommt_aus_den_messwerten(hass: HomeAssistant, trv: FakeTrv, sensors: None) -> None:
    """Ohne vorherige Aufforderung: CO₂ hoch + Fenster auf → Grund „co2"."""
    hass.states.async_set(CO2, "1400", {"unit_of_measurement": "ppm", "device_class": "carbon_dioxide"})
    _hub, room = await _setup_room(hass, co2_sensor=CO2)
    vent = hass.data[DOMAIN]["rooms"][room.entry_id].vent
    assert vent is not None

    hass.states.async_set(WINDOW, "on", {"device_class": "window"})
    await hass.async_block_till_done()

    assert vent._airing_reason == "co2"


async def test_grund_ueberlebt_neustart(hass: HomeAssistant, trv: FakeTrv, sensors: None) -> None:
    """Der Grund steht im Speicher und kommt beim Laden zurück."""
    hass.states.async_set(CO2, "1400", {"unit_of_measurement": "ppm", "device_class": "carbon_dioxide"})
    _hub, room = await _setup_room(hass, co2_sensor=CO2)
    vent = hass.data[DOMAIN]["rooms"][room.entry_id].vent

    hass.states.async_set(WINDOW, "on", {"device_class": "window"})
    await hass.async_block_till_done()
    assert vent._airing_reason == "co2"

    stored = vent.export()
    assert stored.get("airing_reason") == "co2"

    vent._airing_reason = None
    vent.load(stored)
    assert vent._airing_reason == "co2"


async def test_unbekannter_grund_wird_ignoriert(hass: HomeAssistant, trv: FakeTrv, sensors: None) -> None:
    """Kaputte Speicherwerte dürfen keinen falschen Text erzeugen."""
    _hub, room = await _setup_room(hass)
    vent = hass.data[DOMAIN]["rooms"][room.entry_id].vent
    vent.load({"airing_reason": "irgendwas"})
    assert vent._airing_reason is None
