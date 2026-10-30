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
    if c.humidity_sensor:
        entities.append(MoldRiskSensor(c))
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
        if c.status in (STATUS_SENSOR, STATUS_TRV) or c.sync.state == SYNC_FAILED:
            return True
        return any(i.severity != "info" for i in c.issues)

    @property
    def extra_state_attributes(self) -> dict:
        return {"issues": [i.as_dict() for i in self.controller.issues]}


class MoldRiskSensor(RaumklimaEntity, BinarySensorEntity):
    """Schimmelrisiko: dauerhaft hohe Feuchte oder kalt und feucht."""

    _attr_translation_key = "mold_risk"
    _attr_device_class = BinarySensorDeviceClass.MOISTURE

    def __init__(self, controller) -> None:
        super().__init__(controller, "mold_risk")

    @property
    def is_on(self) -> bool:
        return self.controller.vent.mold_risk
