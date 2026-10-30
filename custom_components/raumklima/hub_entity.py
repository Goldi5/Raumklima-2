"""Basis für die Entitäten der Zentrale „Allgemein“."""

from __future__ import annotations

from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.entity import Entity

from .const import DOMAIN
from .hub import RaumklimaHub


class HubEntity(Entity):
    """Hängt an der Zentrale, kein Polling."""

    _attr_has_entity_name = True
    _attr_should_poll = False

    def __init__(self, hub: RaumklimaHub, key: str) -> None:
        self.hub = hub
        self._attr_unique_id = f"{hub.entry.entry_id}_{key}"
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, hub.entry.entry_id)},
            name="Raumklima Allgemein",
            manufacturer="Raumklima",
            model="Zentrale",
        )

    async def async_added_to_hass(self) -> None:
        self.async_on_remove(self.hub.async_add_listener(self.async_write_ha_state))
