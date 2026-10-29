"""Fenster offen / Problem."""

from __future__ import annotations

from homeassistant.components.binary_sensor import (
    BinarySensorDeviceClass,
    BinarySensorEntity,
)
from homeassistant.const import EntityCategory
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from . import RaumklimaConfigEntry
from .const import STATUS_SENSOR, STATUS_TRV, SYNC_FAILED
from .entity import RaumklimaEntity


async def async_setup_entry(
    hass: HomeAssistant,
    entry: RaumklimaConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    c = entry.runtime_data
    entities: list[BinarySensorEntity] = [ProblemSensor(c)]
    if c.windows:
        entities.append(WindowSensor(c))
    async_add_entities(entities)


class WindowSensor(RaumklimaEntity, BinarySensorEntity):
    """Mindestens ein Fenster offen."""

    _attr_translation_key = "window"
    _attr_device_class = BinarySensorDeviceClass.WINDOW

    def __init__(self, controller) -> None:
        super().__init__(controller, "window")

    @property
    def is_on(self) -> bool:
        return self.controller.window_open

    @property
    def extra_state_attributes(self) -> dict:
        return {"heating_paused": self.controller.paused}


class ProblemSensor(RaumklimaEntity, BinarySensorEntity):
    """Sensor fehlt, TRV weg oder Befehle nicht bestätigt."""

    _attr_translation_key = "problem"
    _attr_device_class = BinarySensorDeviceClass.PROBLEM
    _attr_entity_category = EntityCategory.DIAGNOSTIC

    def __init__(self, controller) -> None:
        super().__init__(controller, "problem")

    @property
    def is_on(self) -> bool:
        c = self.controller
        return c.status in (STATUS_SENSOR, STATUS_TRV) or c.sync.state == SYNC_FAILED
