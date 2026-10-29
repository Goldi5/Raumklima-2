"""Virtuelles Thermostat."""

from __future__ import annotations

from typing import Any

from homeassistant.components.climate import (
    ClimateEntity,
    ClimateEntityFeature,
    HVACAction,
    HVACMode,
)
from homeassistant.const import ATTR_TEMPERATURE, UnitOfTemperature
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from . import RaumklimaConfigEntry
from .entity import RaumklimaEntity


async def async_setup_entry(
    hass: HomeAssistant,
    entry: RaumklimaConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    async_add_entities([RaumklimaClimate(entry.runtime_data)])


class RaumklimaClimate(RaumklimaEntity, ClimateEntity):
    """Thermostat, das nach dem externen Fühler regelt."""

    _attr_name = None  # heißt wie das Gerät (der Raum)
    _attr_translation_key = "raumklima"
    _attr_hvac_modes = [HVACMode.HEAT, HVACMode.OFF]
    # Beide Varianten: native_* ab HA 2026.12, alte Namen für ältere Versionen
    _attr_native_temperature_unit = UnitOfTemperature.CELSIUS
    _attr_temperature_unit = UnitOfTemperature.CELSIUS
    _attr_target_temperature_step = 0.5
    _attr_supported_features = (
        ClimateEntityFeature.TARGET_TEMPERATURE
        | ClimateEntityFeature.TURN_ON
        | ClimateEntityFeature.TURN_OFF
    )

    def __init__(self, controller) -> None:
        super().__init__(controller, "climate")

    @property
    def available(self) -> bool:
        return self.controller.trv_available()

    @property
    def hvac_mode(self) -> HVACMode:
        return HVACMode.HEAT if self.controller.hvac_on else HVACMode.OFF

    @property
    def hvac_action(self) -> HVACAction:
        return self.controller.hvac_action

    @property
    def native_current_temperature(self) -> float | None:
        return self.controller.current_temperature

    @property
    def current_temperature(self) -> float | None:
        return self.controller.current_temperature

    @property
    def current_humidity(self) -> float | None:
        return self.controller.current_humidity

    @property
    def native_target_temperature(self) -> float:
        return self.controller.target_temp

    @property
    def target_temperature(self) -> float:
        return self.controller.target_temp

    @property
    def min_temp(self) -> float:
        return self.controller.trv_min

    @property
    def max_temp(self) -> float:
        return self.controller.trv_max

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        c = self.controller
        return {
            "status": c.status,
            "window_open": c.window_open,
            "paused_by_window": c.paused,
            "trv_temperature": c.trv_temperature,
            "offset": c.offset,
            "sync": c.sync.state,
        }

    async def async_set_temperature(self, **kwargs: Any) -> None:
        if (temp := kwargs.get(ATTR_TEMPERATURE)) is not None:
            await self.controller.async_set_target(temp)
        if (mode := kwargs.get("hvac_mode")) is not None:
            await self.async_set_hvac_mode(mode)

    async def async_set_hvac_mode(self, hvac_mode: HVACMode) -> None:
        await self.controller.async_set_hvac_on(hvac_mode != HVACMode.OFF)

    async def async_turn_on(self) -> None:
        await self.controller.async_set_hvac_on(True)

    async def async_turn_off(self) -> None:
        await self.controller.async_set_hvac_on(False)
