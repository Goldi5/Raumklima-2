"""Entitäten der Zentrale: Anwesenheit, Heizbetrieb, Urlaub, Gäste, Betriebsart, Heute heizen."""

from __future__ import annotations

from typing import Any

from homeassistant.components.button import ButtonEntity
from homeassistant.components.select import SelectEntity
from homeassistant.components.sensor import (
    SensorDeviceClass,
    SensorEntity,
    SensorStateClass,
)
from homeassistant.components.switch import SwitchEntity
from homeassistant.const import UnitOfTemperature

from .const import CONF_SEASON_MODE, SEASON_MODES
from .hub import RaumklimaHub
from .hub_entity import HubEntity
from .planning import SEASON_STATES, STAGES


class PresenceSensor(HubEntity, SensorEntity):
    _attr_translation_key = "presence"
    _attr_device_class = SensorDeviceClass.ENUM
    _attr_options = STAGES

    def __init__(self, hub: RaumklimaHub) -> None:
        super().__init__(hub, "presence")

    @property
    def native_value(self) -> str:
        return self.hub.stage

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        s = self.hub.summary()
        return {
            "persons": s["persons"],
            "sensed": s["sensed"],
            "home_id": self.hub.entry.entry_id,
            "home_name": self.hub.name,
            "home_dashboard": self.hub.dashboard,
            "last_present": s["last_present"],
            "vacation": s["vacation"],
            "guests": s["guests"],
            "preheat_by": s["preheat_by"],
            "configured": s["presence_configured"],
        }


class SeasonSensor(HubEntity, SensorEntity):
    _attr_translation_key = "heating_mode"
    _attr_device_class = SensorDeviceClass.ENUM
    _attr_options = SEASON_STATES

    def __init__(self, hub: RaumklimaHub) -> None:
        super().__init__(hub, "heating_mode")

    @property
    def native_value(self) -> str:
        return self.hub.decision

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        s = self.hub.summary()
        return {
            "heating_allowed": s["heating_allowed"],
            "in_season": s["in_season"],
            "mean_past_24h": s["mean_past"],
            "mean_forecast_24h": s["mean_forecast"],
            "mean_combined": s["mean_combined"],
            "heating_limit": self.hub.opt("heating_limit"),
            "heat_today_until": s["heat_today_until"],
        }


class OutdoorMeanSensor(HubEntity, SensorEntity):
    _attr_translation_key = "outdoor_mean"
    _attr_device_class = SensorDeviceClass.TEMPERATURE
    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_native_unit_of_measurement = UnitOfTemperature.CELSIUS
    _attr_suggested_display_precision = 1

    def __init__(self, hub: RaumklimaHub) -> None:
        super().__init__(hub, "outdoor_mean")

    @property
    def native_value(self) -> float | None:
        return self.hub.mean_combined


class HealthSensor(HubEntity, SensorEntity):
    """Anzahl offener Hinweise des Gesundheitschecks."""

    _attr_translation_key = "health"
    _attr_state_class = SensorStateClass.MEASUREMENT

    def __init__(self, hub: RaumklimaHub) -> None:
        super().__init__(hub, "health")

    @property
    def native_value(self) -> int:
        return len([i for i in self.hub.insights.all_issues() if i["severity"] != "info"])

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        return {"issues": self.hub.insights.all_issues()}


class VacationSwitch(HubEntity, SwitchEntity):
    _attr_translation_key = "vacation"

    def __init__(self, hub: RaumklimaHub) -> None:
        super().__init__(hub, "vacation")

    @property
    def is_on(self) -> bool:
        return self.hub.vacation

    async def async_turn_on(self, **kwargs: Any) -> None:
        self.hub.set_vacation(True)

    async def async_turn_off(self, **kwargs: Any) -> None:
        self.hub.set_vacation(False)


class GuestsSwitch(HubEntity, SwitchEntity):
    _attr_translation_key = "guests"

    def __init__(self, hub: RaumklimaHub) -> None:
        super().__init__(hub, "guests")

    @property
    def is_on(self) -> bool:
        return self.hub.guests

    async def async_turn_on(self, **kwargs: Any) -> None:
        self.hub.set_guests(True)

    async def async_turn_off(self, **kwargs: Any) -> None:
        self.hub.set_guests(False)


class SeasonModeSelect(HubEntity, SelectEntity):
    _attr_translation_key = "season_mode"
    _attr_options = SEASON_MODES

    def __init__(self, hub: RaumklimaHub) -> None:
        super().__init__(hub, "season_mode")

    @property
    def current_option(self) -> str:
        return str(self.hub.opt(CONF_SEASON_MODE))

    async def async_select_option(self, option: str) -> None:
        entry = self.hub.entry
        self.hass.config_entries.async_update_entry(
            entry, options={**entry.options, CONF_SEASON_MODE: option}
        )


class HeatTodayButton(HubEntity, ButtonEntity):
    _attr_translation_key = "heat_today"

    def __init__(self, hub: RaumklimaHub) -> None:
        super().__init__(hub, "heat_today")

    async def async_press(self) -> None:
        self.hub.heat_today()


def hub_entities(platform: str, hub: RaumklimaHub) -> list:
    if platform == "sensor":
        return [PresenceSensor(hub), SeasonSensor(hub), OutdoorMeanSensor(hub), HealthSensor(hub)]
    if platform == "switch":
        return [VacationSwitch(hub), GuestsSwitch(hub)]
    if platform == "select":
        return [SeasonModeSelect(hub)]
    if platform == "button":
        return [HeatTodayButton(hub)]
    return []
