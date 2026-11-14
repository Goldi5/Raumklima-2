"""Räume direkt über die Integration anlegen und löschen."""

from __future__ import annotations

from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.typing import WebSocketGenerator

from custom_components.raumklima.shared import domain_data

from .conftest import hub_entry, room_entry


async def test_room_create_delete_via_ws(
    hass: HomeAssistant,
    trv,
    sensors,
    hass_ws_client: WebSocketGenerator,
) -> None:
    hub = hub_entry()
    hub.add_to_hass(hass)
    room = room_entry()
    room.add_to_hass(hass)
    assert await hass.config_entries.async_setup(hub.entry_id)
    await hass.async_block_till_done()
    client = await hass_ws_client(hass)

    hass.states.async_set("sensor.new_temp", "20.0", {"unit_of_measurement": "°C", "device_class": "temperature"})
    await client.send_json_auto_id({
        "type": "raumklima/room/create",
        "name": "Neuer Raum",
        "trv": "",
        "temperature_sensor": "sensor.new_temp",
        "room_type": "living",
    })
    msg = await client.receive_json()
    assert msg["success"], msg
    entry_id = msg["result"]["entry_id"]
    await hass.async_block_till_done()
    assert entry_id in domain_data(hass)["rooms"]

    await client.send_json_auto_id({"type": "raumklima/room/delete", "entry_id": entry_id})
    msg = await client.receive_json()
    assert msg["success"], msg
    await hass.async_block_till_done()
    assert entry_id not in domain_data(hass)["rooms"]
