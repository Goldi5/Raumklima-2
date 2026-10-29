"""Gemeinsame Basis für alle Raumklima-Entitäten."""

from __future__ import annotations

from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.entity import Entity

from .const import DOMAIN
from .controller import RaumklimaController


class RaumklimaEntity(Entity):
    """Basis: hängt am Controller, kein Polling."""

    _attr_has_entity_name = True
    _attr_should_poll = False

    def __init__(self, controller: RaumklimaController, key: str) -> None:
        self.controller = controller
        self._attr_unique_id = f"{controller.entry.entry_id}_{key}"
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, controller.entry.entry_id)},
            name=controller.name,
            manufacturer="Raumklima",
            model="Virtuelles Thermostat",
        )

    async def async_added_to_hass(self) -> None:
        self.async_on_remove(self.controller.async_add_listener(self.async_write_ha_state))
