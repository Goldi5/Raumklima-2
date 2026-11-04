"""Raum-Entitäten dem HA-Bereich zuordnen, damit Assist sie findet."""

from __future__ import annotations

from homeassistant.core import HomeAssistant
from homeassistant.helpers import area_registry as ar, device_registry as dr, entity_registry as er

from custom_components.raumklima.areas import assign_room_area, room_area
from custom_components.raumklima.shared import domain_data

from .conftest import FakeTrv


async def _room_with_area(hass: HomeAssistant, setup, area_name: str = "Wohnzimmer"):
    """Thermostat mit Bereich anlegen und dem Raum zuweisen."""
    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    area = ar.async_get(hass).async_create(area_name)
    devs = dr.async_get(hass)
    regs = er.async_get(hass)
    device = devs.async_get_or_create(
        config_entry_id=room.entry_id, identifiers={("demo", "trv-area")}, name="TRV Test"
    )
    devs.async_update_device(device.id, area_id=area.id)
    regs.async_get_or_create("climate", "demo", "t-area", suggested_object_id="bad_trv", device_id=device.id)
    ctrl.trv = "climate.bad_trv"
    return ctrl, area


async def test_raum_entitaet_bekommt_den_bereich_des_thermostats(
    hass: HomeAssistant, setup, trv: FakeTrv
) -> None:
    ctrl, area = await _room_with_area(hass, setup)

    assert room_area(hass, ctrl) == area.id
    moved = assign_room_area(hass, ctrl)
    assert moved > 0

    regs = er.async_get(hass)
    entry = regs.async_get("climate.bad")
    assert entry is not None
    device = dr.async_get(hass).async_get(entry.device_id) if entry.device_id else None
    # je nach HA-Version liegt der Bereich an der Entität oder am Gerät
    assert entry.area_id == area.id or (device is not None and device.area_id == area.id)


async def test_vom_nutzer_gesetzter_bereich_bleibt(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    ctrl, area = await _room_with_area(hass, setup)
    other = ar.async_get(hass).async_create("Mein Bereich")
    regs = er.async_get(hass)
    devs = dr.async_get(hass)
    entity = regs.async_get("climate.bad")
    devs.async_update_device(entity.device_id, area_id=other.id)

    assign_room_area(hass, ctrl)

    assert devs.async_get(entity.device_id).area_id == other.id


async def test_ohne_bereich_passiert_nichts(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    ctrl.trv = ""
    ctrl.windows = []
    ctrl.config["temperature_sensor"] = None

    assert room_area(hass, ctrl) is None
    assert assign_room_area(hass, ctrl) == 0
