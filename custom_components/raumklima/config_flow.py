"""Einrichtungsassistent und Optionen."""

from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant.config_entries import (
    ConfigEntry,
    ConfigFlow,
    ConfigFlowResult,
    OptionsFlowWithReload,
)
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.selector import (
    BooleanSelector,
    EntitySelector,
    EntitySelectorConfig,
    NumberSelector,
    NumberSelectorConfig,
    NumberSelectorMode,
    SelectSelector,
    SelectSelectorConfig,
    SelectSelectorMode,
    TextSelector,
)

from .const import (
    CAL_OFFSET,
    CAL_TARGET,
    CALIBRATION_MODES,
    CONF_CALIBRATION_ENTITY,
    CONF_CALIBRATION_MODE,
    CONF_FOLLOW_TRV,
    CONF_HUMIDITY_SENSOR,
    CONF_NAME,
    CONF_NOTIFY,
    CONF_OFF_METHOD,
    CONF_ON_PRESET,
    CONF_OFFSET_MIN_INTERVAL,
    CONF_OFFSET_THRESHOLD,
    CONF_SENSOR_STALE_MINUTES,
    CONF_SYNC_MAX_RETRIES,
    CONF_SYNC_VERIFY_DELAY,
    CONF_TEMP_SENSOR,
    CONF_TRV,
    CONF_WINDOW_CLOSE_DELAY,
    CONF_WINDOW_OPEN_DELAY,
    CONF_WINDOWS,
    DEFAULTS,
    DOMAIN,
    OFF_METHODS,
    ON_PRESET_AUTO,
)

DEVICE_KEYS = (
    CONF_TRV,
    CONF_TEMP_SENSOR,
    CONF_HUMIDITY_SENSOR,
    CONF_WINDOWS,
    CONF_CALIBRATION_MODE,
    CONF_CALIBRATION_ENTITY,
    CONF_OFF_METHOD,
    CONF_ON_PRESET,
)


def trv_presets(hass: HomeAssistant, trv: str | None) -> list[str]:
    """Presets des TRV (ohne 'off') für die Auswahl."""
    state = hass.states.get(trv) if trv else None
    presets = state.attributes.get("preset_modes") if state else None
    return [p for p in (presets or []) if p and p != "off"]


def find_calibration_entity(hass: HomeAssistant, trv: str) -> str | None:
    """Offset-Entität (number/select) am selben Gerät wie das TRV suchen."""
    registry = er.async_get(hass)
    trv_entry = registry.async_get(trv)
    if trv_entry is None or trv_entry.device_id is None:
        return None
    for entry in er.async_entries_for_device(registry, trv_entry.device_id):
        if entry.domain != "number":
            continue
        haystack = " ".join(
            filter(None, [entry.entity_id, entry.original_name, entry.translation_key])
        ).lower()
        if "calibration" in haystack or "offset" in haystack or "kalibrier" in haystack:
            return entry.entity_id
    return None


def _devices_schema(defaults: dict[str, Any], *, with_name: bool) -> vol.Schema:
    fields: dict[Any, Any] = {}
    if with_name:
        fields[vol.Required(CONF_NAME, default=defaults.get(CONF_NAME, ""))] = TextSelector()
    fields.update(
        {
            vol.Required(CONF_TRV, default=defaults.get(CONF_TRV, vol.UNDEFINED)): EntitySelector(
                EntitySelectorConfig(domain="climate")
            ),
            vol.Required(
                CONF_TEMP_SENSOR, default=defaults.get(CONF_TEMP_SENSOR, vol.UNDEFINED)
            ): EntitySelector(
                EntitySelectorConfig(domain="sensor", device_class="temperature")
            ),
            vol.Optional(
                CONF_HUMIDITY_SENSOR,
                description={"suggested_value": defaults.get(CONF_HUMIDITY_SENSOR)},
            ): EntitySelector(EntitySelectorConfig(domain="sensor", device_class="humidity")),
            vol.Optional(
                CONF_WINDOWS,
                description={"suggested_value": defaults.get(CONF_WINDOWS)},
            ): EntitySelector(EntitySelectorConfig(domain="binary_sensor", multiple=True)),
        }
    )
    return vol.Schema(fields)


def _calibration_schema(defaults: dict[str, Any], presets: list[str]) -> vol.Schema:
    preset_options = [ON_PRESET_AUTO, *presets]
    on_default = defaults.get(CONF_ON_PRESET, ON_PRESET_AUTO)
    if on_default not in preset_options:
        on_default = ON_PRESET_AUTO
    return vol.Schema(
        {
            vol.Required(
                CONF_CALIBRATION_MODE,
                default=defaults.get(CONF_CALIBRATION_MODE, DEFAULTS[CONF_CALIBRATION_MODE]),
            ): SelectSelector(
                SelectSelectorConfig(
                    options=CALIBRATION_MODES,
                    translation_key=CONF_CALIBRATION_MODE,
                    mode=SelectSelectorMode.LIST,
                )
            ),
            vol.Optional(
                CONF_CALIBRATION_ENTITY,
                description={"suggested_value": defaults.get(CONF_CALIBRATION_ENTITY)},
            ): EntitySelector(EntitySelectorConfig(domain="number")),
            vol.Required(
                CONF_OFF_METHOD,
                default=defaults.get(CONF_OFF_METHOD, DEFAULTS[CONF_OFF_METHOD]),
            ): SelectSelector(
                SelectSelectorConfig(
                    options=OFF_METHODS,
                    translation_key=CONF_OFF_METHOD,
                    mode=SelectSelectorMode.DROPDOWN,
                )
            ),
            vol.Required(CONF_ON_PRESET, default=on_default): SelectSelector(
                SelectSelectorConfig(
                    options=preset_options,
                    translation_key=CONF_ON_PRESET,
                    mode=SelectSelectorMode.DROPDOWN,
                    custom_value=True,
                )
            ),
        }
    )


def _number(minimum: float, maximum: float, step: float, unit: str) -> NumberSelector:
    return NumberSelector(
        NumberSelectorConfig(
            min=minimum,
            max=maximum,
            step=step,
            unit_of_measurement=unit,
            mode=NumberSelectorMode.BOX,
        )
    )


def _settings_schema(defaults: dict[str, Any]) -> vol.Schema:
    def d(key: str) -> Any:
        return defaults.get(key, DEFAULTS[key])

    return vol.Schema(
        {
            vol.Required(CONF_WINDOW_OPEN_DELAY, default=d(CONF_WINDOW_OPEN_DELAY)): _number(0, 600, 1, "s"),
            vol.Required(CONF_WINDOW_CLOSE_DELAY, default=d(CONF_WINDOW_CLOSE_DELAY)): _number(0, 600, 1, "s"),
            vol.Required(CONF_OFFSET_THRESHOLD, default=d(CONF_OFFSET_THRESHOLD)): _number(0.1, 2, 0.1, "°C"),
            vol.Required(CONF_OFFSET_MIN_INTERVAL, default=d(CONF_OFFSET_MIN_INTERVAL)): _number(1, 60, 1, "min"),
            vol.Required(CONF_SENSOR_STALE_MINUTES, default=d(CONF_SENSOR_STALE_MINUTES)): _number(10, 360, 5, "min"),
            vol.Required(CONF_SYNC_VERIFY_DELAY, default=d(CONF_SYNC_VERIFY_DELAY)): _number(5, 120, 1, "s"),
            vol.Required(CONF_SYNC_MAX_RETRIES, default=d(CONF_SYNC_MAX_RETRIES)): _number(1, 10, 1, "x"),
            vol.Required(CONF_FOLLOW_TRV, default=d(CONF_FOLLOW_TRV)): BooleanSelector(),
            vol.Required(CONF_NOTIFY, default=d(CONF_NOTIFY)): BooleanSelector(),
        }
    )


def _validate_calibration(data: dict[str, Any]) -> dict[str, str]:
    if data.get(CONF_CALIBRATION_MODE) == CAL_OFFSET and not data.get(CONF_CALIBRATION_ENTITY):
        return {CONF_CALIBRATION_ENTITY: "calibration_entity_required"}
    return {}


class RaumklimaConfigFlow(ConfigFlow, domain=DOMAIN):
    """Raum anlegen: Geräte → Kalibrierung → Einstellungen."""

    VERSION = 1

    def __init__(self) -> None:
        self._data: dict[str, Any] = {}

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        errors: dict[str, str] = {}
        if user_input is not None:
            await self.async_set_unique_id(user_input[CONF_TRV])
            self._abort_if_unique_id_configured()
            if user_input[CONF_TEMP_SENSOR] == user_input[CONF_TRV]:
                errors[CONF_TEMP_SENSOR] = "same_entity"
            else:
                self._data.update(user_input)
                return await self.async_step_calibration()
        return self.async_show_form(
            step_id="user",
            data_schema=_devices_schema(user_input or {}, with_name=True),
            errors=errors,
        )

    async def async_step_calibration(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        errors: dict[str, str] = {}
        if user_input is not None:
            errors = _validate_calibration(user_input)
            if not errors:
                self._data.update(user_input)
                return await self.async_step_settings()
        found = find_calibration_entity(self.hass, self._data[CONF_TRV])
        defaults = user_input or {
            CONF_CALIBRATION_ENTITY: found,
            CONF_CALIBRATION_MODE: CAL_OFFSET if found else CAL_TARGET,
        }
        return self.async_show_form(
            step_id="calibration",
            data_schema=_calibration_schema(
                defaults, trv_presets(self.hass, self._data[CONF_TRV])
            ),
            errors=errors,
            description_placeholders={"found": found or "–"},
        )

    async def async_step_settings(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        if user_input is not None:
            return self.async_create_entry(
                title=self._data[CONF_NAME], data=self._data, options=user_input
            )
        return self.async_show_form(step_id="settings", data_schema=_settings_schema({}))

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: ConfigEntry) -> RaumklimaOptionsFlow:
        return RaumklimaOptionsFlow()


class RaumklimaOptionsFlow(OptionsFlowWithReload):
    """Alles nachträglich ändern, ohne den Raum neu anzulegen."""

    def __init__(self) -> None:
        self._options: dict[str, Any] = {}

    def _current(self) -> dict[str, Any]:
        return {**DEFAULTS, **self.config_entry.data, **self.config_entry.options}

    async def async_step_init(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        if user_input is not None:
            # Leere optionale Felder bewusst als "entfernt" speichern
            user_input.setdefault(CONF_HUMIDITY_SENSOR, None)
            user_input.setdefault(CONF_WINDOWS, [])
            self._options.update(user_input)
            return await self.async_step_calibration()
        return self.async_show_form(
            step_id="init", data_schema=_devices_schema(self._current(), with_name=False)
        )

    async def async_step_calibration(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        errors: dict[str, str] = {}
        if user_input is not None:
            errors = _validate_calibration(user_input)
            if not errors:
                user_input.setdefault(CONF_CALIBRATION_ENTITY, None)
                self._options.update(user_input)
                return await self.async_step_settings()
        defaults = user_input or self._current()
        if not defaults.get(CONF_CALIBRATION_ENTITY):
            defaults = {
                **defaults,
                CONF_CALIBRATION_ENTITY: find_calibration_entity(
                    self.hass, self._options[CONF_TRV]
                ),
            }
        return self.async_show_form(
            step_id="calibration",
            data_schema=_calibration_schema(
                defaults, trv_presets(self.hass, self._options[CONF_TRV])
            ),
            errors=errors,
            description_placeholders={"found": defaults.get(CONF_CALIBRATION_ENTITY) or "–"},
        )

    async def async_step_settings(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        if user_input is not None:
            self._options.update(user_input)
            return self.async_create_entry(data=self._options)
        return self.async_show_form(
            step_id="settings", data_schema=_settings_schema(self._current())
        )
