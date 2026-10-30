"""Fensterlogik ein/aus."""

from __future__ import annotations

from typing import Any

from homeassistant.components.switch import SwitchEntity
from homeassistant.const import EntityCategory
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from . import RaumklimaConfigEntry, is_hub_entry
from .hub_platforms import hub_entities
from .entity import RaumklimaEntity


async def async_setup_entry(
    hass: HomeAssistant,
    entry: RaumklimaConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    if is_hub_entry(entry):
        async_add_entities(hub_entities("switch", entry.runtime_data))
        return
    entities: list[SwitchEntity] = [NotificationSwitch(entry.runtime_data)]
    if entry.runtime_data.windows:
        entities.append(WindowLogicSwitch(entry.runtime_data))
    async_add_entities(entities)


class WindowLogicSwitch(RaumklimaEntity, SwitchEntity):
    """Heizung bei offenem Fenster pausieren."""

    _attr_translation_key = "window_logic"
    _attr_entity_category = EntityCategory.CONFIG

    def __init__(self, controller) -> None:
        super().__init__(controller, "window_logic")

    @property
    def is_on(self) -> bool:
        return self.controller.window_logic

    async def async_turn_on(self, **kwargs: Any) -> None:
        await self.controller.async_set_window_logic(True)

    async def async_turn_off(self, **kwargs: Any) -> None:
        await self.controller.async_set_window_logic(False)


class NotificationSwitch(RaumklimaEntity, SwitchEntity):
    """Lüftungs-Benachrichtigungen ein/aus."""

    _attr_translation_key = "notifications"

    def __init__(self, controller) -> None:
        super().__init__(controller, "notifications")

    @property
    def is_on(self) -> bool:
        return self.controller.vent.enabled

    async def async_turn_on(self, **kwargs: Any) -> None:
        self.controller.vent.set_enabled(True)

    async def async_turn_off(self, **kwargs: Any) -> None:
        self.controller.vent.set_enabled(False)
