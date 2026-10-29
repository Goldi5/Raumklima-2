"""Status-, Sync- und Offset-Sensoren."""

from __future__ import annotations

from homeassistant.components.sensor import (
    SensorDeviceClass,
    SensorEntity,
    SensorStateClass,
)
from homeassistant.const import EntityCategory, UnitOfTemperature
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from . import RaumklimaConfigEntry
from .const import CAL_OFFSET, STATUSES, SYNC_STATES
from .entity import RaumklimaEntity


async def async_setup_entry(
    hass: HomeAssistant,
    entry: RaumklimaConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    c = entry.runtime_data
    entities: list[SensorEntity] = [StatusSensor(c), SyncSensor(c)]
    if c.cal_mode == CAL_OFFSET:
        entities.append(OffsetSensor(c))
    async_add_entities(entities)


class StatusSensor(RaumklimaEntity, SensorEntity):
    """Warum heizt es (nicht)?"""

    _attr_translation_key = "status"
    _attr_device_class = SensorDeviceClass.ENUM
    _attr_options = STATUSES

    def __init__(self, controller) -> None:
        super().__init__(controller, "status")

    @property
    def native_value(self) -> str:
        return self.controller.status


class SyncSensor(RaumklimaEntity, SensorEntity):
    """Wurden alle Befehle vom TRV bestätigt?"""

    _attr_translation_key = "sync"
    _attr_device_class = SensorDeviceClass.ENUM
    _attr_options = SYNC_STATES
    _attr_entity_category = EntityCategory.DIAGNOSTIC

    def __init__(self, controller) -> None:
        super().__init__(controller, "sync")

    @property
    def native_value(self) -> str:
        return self.controller.sync.state

    @property
    def extra_state_attributes(self) -> dict:
        return {
            "attempt": self.controller.sync.max_attempt,
            "pending": [job.description for job in self.controller.sync.jobs.values()],
        }


class OffsetSensor(RaumklimaEntity, SensorEntity):
    """Aktueller Kalibrier-Offset am TRV."""

    _attr_translation_key = "offset"
    _attr_device_class = SensorDeviceClass.TEMPERATURE
    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_native_unit_of_measurement = UnitOfTemperature.CELSIUS
    _attr_entity_category = EntityCategory.DIAGNOSTIC
    _attr_suggested_display_precision = 1

    def __init__(self, controller) -> None:
        super().__init__(controller, "offset")

    @property
    def native_value(self) -> float | None:
        return self.controller.offset

    @property
    def extra_state_attributes(self) -> dict:
        return {
            "room_temperature": self.controller.current_temperature,
            "trv_temperature": self.controller.trv_temperature,
        }
