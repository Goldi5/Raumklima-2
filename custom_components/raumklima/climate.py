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
from homeassistant.util import dt as dt_util

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
    _attr_hvac_modes = [HVACMode.HEAT, HVACMode.AUTO, HVACMode.OFF]
    # Beide Varianten: native_* ab HA 2026.12, alte Namen für ältere Versionen
    _attr_native_temperature_unit = UnitOfTemperature.CELSIUS
    _attr_temperature_unit = UnitOfTemperature.CELSIUS
    _attr_target_temperature_step = 0.5
    # Einstellungs-Übersicht nicht bei jeder Änderung in die Datenbank schreiben
    _unrecorded_attributes = frozenset({"settings", "plan_reason", "presence", "heating_mode"})
    _attr_supported_features = (
        ClimateEntityFeature.TARGET_TEMPERATURE
        | ClimateEntityFeature.TURN_ON
        | ClimateEntityFeature.TURN_OFF
    )

    def __init__(self, controller) -> None:
        super().__init__(controller, "climate")

    @property
    def available(self) -> bool:
        """Immer verfügbar: ein fehlendes Thermostat ist ein Status, kein Ausfall des Raums.

        Sonst zeigt Home Assistant die Entität als "unavailable" und verwirft dabei die
        Zusatz-Attribute – inklusive `home`. Ein Raum ohne Funkverbindung tauchte dadurch
        auf dem Dashboard der *anderen* Wohnung auf, weil die Karte das Attribut nicht
        mehr finden konnte. Der Zustand steht jetzt in `status` (trv_unavailable).
        """
        return True

    @property
    def supported_features(self) -> ClimateEntityFeature:
        return ClimateEntityFeature(0) if self.controller.monitor else self._attr_supported_features

    @property
    def hvac_modes(self) -> list[HVACMode]:
        return [] if self.controller.monitor else self._attr_hvac_modes

    @property
    def hvac_mode(self) -> HVACMode | None:
        if self.controller.monitor:
            return None
        if not self.controller.hvac_on:
            return HVACMode.OFF
        return HVACMode.AUTO if self.controller.hvac_auto else HVACMode.HEAT

    @property
    def hvac_action(self) -> HVACAction | None:
        if self.controller.monitor:
            return None
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
    def native_target_temperature(self) -> float | None:
        if self.controller.monitor:
            return None
        return self.controller.applied_target

    @property
    def target_temperature(self) -> float | None:
        """Das Ziel, das gerade gilt – nicht der Wunsch (der steht im Attribut ``wish``).

        Überwachungsräume haben kein Ziel: sie zeigen nur, was gemessen wird.
        """
        if self.controller.monitor:
            return None
        return self.controller.applied_target

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
            "off_source": c.off_source,
            "boost_until": c.boost_until.isoformat() if (c.boost_until and c.boost_active) else None,
            "boost_open": bool(c.boost_open and c.boost_active),
            "window_open": c.window_open,
            "window_open_since": (
                c.vent.window_open_since.isoformat()
                if c.vent is not None and c.vent.window_open_since is not None
                else None
            ),
            "paused_by_window": c.paused,
            "trv_temperature": c.trv_temperature,
            "trv_target": c.trv_target,
            "trv_target_expected": c.trv_expected_target,
            "notify_paused_until": (
                dt_util.as_local(c.vent.notify_paused_until).isoformat()
                if c.vent is not None and c.vent.notify_paused_until is not None
                else None
            ),
            "offset": c.offset,
            "sync": c.sync_state,
            "valve_position": c.valve_position,
            "valve_own": c.valve_own,
            "pm25": c.current_pm25,
            "offset_auto": round(c.shift, 2),
            "valve_sensor": c.valve_sensor,
            "valve_sources": c.valve_sources,
            "usage": c.usage_summary.get("text") or None,
            "usage_windows": c.usage_summary.get("windows") or [],
            "battery": c.battery_low,
            "hvac_auto": self.controller.hvac_auto,
            "override_until": (
                c.manual_until.isoformat()
                if getattr(c, "manual_until", None) is not None
                else None
            ),
            "mold_min": c.mold_min(hub) if (hub := c.hub) is not None else None,
            "mold_capped": c.mold_capped,
            "mold_risk_hours": c.mold_risk_hours,
            "mold_rh": c.mold_rh,
            "rf_sent": c.rf_today["sent"],
            "rf_retries": c.rf_today["retries"],
            "target_via": c.target_via,
            "comfort_temperature": c.comfort_temp,
            "calibration_mode": c.cal_mode,
            "wish": None if c.monitor else c.target_temp,
            "monitor": c.monitor,
            "temperature_sensor": c.temp_sensor,
            "humidity_entity": c.humidity_sensor,
            "window_entities": c.windows,
            "humidity_sensor": bool(c.humidity_sensor),
            "humidity_source": c.humidity_source,
            **(c.vent.attributes() if c.vent else {}),
            **c.presence_attributes(),
            "settings": c.settings_summary(),
            **self._plan_attributes(),
        }

    def _plan_attributes(self) -> dict[str, Any]:
        c = self.controller
        on, target, reason = c.plan()
        hub = c.hub
        return {
            "effective_target": target if on else None,
            "plan_reason": reason,
            "presence": hub.stage if hub else None,
            "night_airing": c.night_airing,
            "home": hub.entry.entry_id if hub else None,
            "room": c.entry.entry_id,
            "home_name": hub.name if hub else None,
            "window_virtual": c.window_virtual,
            "heating_mode": hub.decision if hub else None,
        }

    async def _user_name(self) -> str | None:
        """Wer hat es geändert? Name des HA-Benutzers aus dem Aufruf-Kontext."""
        context = getattr(self, "_context", None)
        user_id = getattr(context, "user_id", None) if context is not None else None
        if not user_id:
            return None
        try:
            user = await self.hass.auth.async_get_user(user_id)
        except Exception:  # noqa: BLE001 – Name ist Beiwerk, nie ein Grund zum Abbruch
            return None
        return getattr(user, "name", None) if user is not None else None

    async def async_set_temperature(self, **kwargs: Any) -> None:
        if self.controller.monitor:
            return  # Überwachungsraum: nichts einzustellen
        if (temp := kwargs.get(ATTR_TEMPERATURE)) is not None:
            await self.controller.async_set_target(temp, by=await self._user_name())
        if (mode := kwargs.get("hvac_mode")) is not None:
            await self.async_set_hvac_mode(mode)

    async def async_set_hvac_mode(self, hvac_mode: HVACMode) -> None:
        if self.controller.monitor:
            return
        await self.controller.async_set_hvac_mode(str(getattr(hvac_mode, "value", hvac_mode)))

    async def async_turn_on(self) -> None:
        await self.controller.async_set_hvac_on(True)

    async def async_turn_off(self) -> None:
        await self.controller.async_set_hvac_on(False)
