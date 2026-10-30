"""Status-, Sync- und Offset-Sensoren."""

from __future__ import annotations

from homeassistant.components.sensor import (
    SensorDeviceClass,
    SensorEntity,
    SensorStateClass,
)
from homeassistant.const import EntityCategory, UnitOfTemperature, UnitOfTime
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from . import RaumklimaConfigEntry, is_hub_entry
from .hub_platforms import hub_entities
from .const import CAL_OFFSET, STATUSES, SYNC_STATES
from .ventilation import VENT_STATES
from .entity import RaumklimaEntity


async def async_setup_entry(
    hass: HomeAssistant,
    entry: RaumklimaConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    if is_hub_entry(entry):
        async_add_entities(hub_entities("sensor", entry.runtime_data))
        return
    c = entry.runtime_data
    entities: list[SensorEntity] = [StatusSensor(c), SyncSensor(c)]
    if c.cal_mode == CAL_OFFSET:
        entities.append(OffsetSensor(c))
    entities.append(RecommendedDurationSensor(c))
    if c.humidity_sensor:
        entities += [VentilationSensor(c), DewPointSensor(c), AbsHumiditySensor(c)]
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


class VentilationSensor(RaumklimaEntity, SensorEntity):
    """Lüftungsempfehlung."""

    _attr_translation_key = "ventilation"
    _attr_device_class = SensorDeviceClass.ENUM
    _attr_options = VENT_STATES

    def __init__(self, controller) -> None:
        super().__init__(controller, "ventilation")

    @property
    def native_value(self) -> str:
        return self.controller.vent.state

    @property
    def extra_state_attributes(self) -> dict:
        v = self.controller.vent
        return {
            "recommended_minutes": v.duration,
            "airing_remaining_s": v.remaining_seconds,
            "window_open_since": v.window_open_since.isoformat() if v.window_open_since else None,
            "airing_dries": v.dries,
        }


class DewPointSensor(RaumklimaEntity, SensorEntity):
    """Taupunkt im Raum."""

    _attr_translation_key = "dew_point"
    _attr_device_class = SensorDeviceClass.TEMPERATURE
    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_native_unit_of_measurement = UnitOfTemperature.CELSIUS
    _attr_suggested_display_precision = 1

    def __init__(self, controller) -> None:
        super().__init__(controller, "dew_point")

    @property
    def native_value(self) -> float | None:
        return self.controller.vent.dew_point


class AbsHumiditySensor(RaumklimaEntity, SensorEntity):
    """Absolute Feuchte im Raum."""

    _attr_translation_key = "abs_humidity"
    _attr_device_class = SensorDeviceClass.ABSOLUTE_HUMIDITY
    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_native_unit_of_measurement = "g/m³"
    _attr_suggested_display_precision = 1
    _attr_entity_category = EntityCategory.DIAGNOSTIC

    def __init__(self, controller) -> None:
        super().__init__(controller, "abs_humidity")

    @property
    def native_value(self) -> float | None:
        return self.controller.vent.abs_humidity

    @property
    def extra_state_attributes(self) -> dict:
        return {"outdoor": self.controller.vent.outdoor_abs_humidity}


class RecommendedDurationSensor(RaumklimaEntity, SensorEntity):
    """Empfohlene Stoßlüft-Dauer."""

    _attr_translation_key = "recommended_duration"
    _attr_device_class = SensorDeviceClass.DURATION
    _attr_native_unit_of_measurement = UnitOfTime.MINUTES

    def __init__(self, controller) -> None:
        super().__init__(controller, "recommended_duration")

    @property
    def native_value(self) -> int:
        return self.controller.vent.duration

    @property
    def extra_state_attributes(self) -> dict:
        return {"outdoor_temperature": self.controller.vent.outdoor_temp}
