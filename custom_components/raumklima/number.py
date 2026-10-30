"""Regler: Feuchtegrenze, Mindesttemperatur, max. Abkühlung beim Lüften."""

from __future__ import annotations

from homeassistant.components.number import NumberDeviceClass, NumberEntity, NumberMode
from homeassistant.const import PERCENTAGE, EntityCategory, UnitOfTemperature
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from . import RaumklimaConfigEntry
from .entity import RaumklimaEntity

# key, Attribut im Lüftungsassistenten, min, max, step, Einheit, device_class
NUMBERS = [
    ("humidity_limit", 50.0, 90.0, 1.0, PERCENTAGE, NumberDeviceClass.HUMIDITY),
    ("min_temp", 10.0, 22.0, 0.5, UnitOfTemperature.CELSIUS, NumberDeviceClass.TEMPERATURE),
    ("max_drop", 1.0, 8.0, 0.5, UnitOfTemperature.CELSIUS, None),
]


async def async_setup_entry(
    hass: HomeAssistant,
    entry: RaumklimaConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    c = entry.runtime_data
    entities = [
        VentNumber(c, key, low, high, step, unit, dclass)
        for key, low, high, step, unit, dclass in NUMBERS
        if key != "humidity_limit" or c.humidity_sensor
    ]
    async_add_entities(entities)


class VentNumber(RaumklimaEntity, NumberEntity):
    """Einstellwert des Lüftungsassistenten (pro Raum, dauerhaft gespeichert)."""

    _attr_entity_category = EntityCategory.CONFIG
    _attr_mode = NumberMode.BOX

    def __init__(self, controller, key, low, high, step, unit, dclass) -> None:
        super().__init__(controller, key)
        self._key = key
        self._attr_translation_key = key
        self._attr_native_min_value = low
        self._attr_native_max_value = high
        self._attr_native_step = step
        self._attr_native_unit_of_measurement = unit
        self._attr_device_class = dclass

    @property
    def native_value(self) -> float:
        return getattr(self.controller.vent, self._key)

    async def async_set_native_value(self, value: float) -> None:
        self.controller.vent.set_value(self._key, value)
