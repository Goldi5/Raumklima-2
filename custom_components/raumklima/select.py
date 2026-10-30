"""Auswahl der Zentrale (Betriebsart Heizsaison)."""

from __future__ import annotations

from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from . import RaumklimaConfigEntry, is_hub_entry
from .hub_platforms import hub_entities


async def async_setup_entry(
    hass: HomeAssistant,
    entry: RaumklimaConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    if is_hub_entry(entry):
        async_add_entities(hub_entities("select", entry.runtime_data))
