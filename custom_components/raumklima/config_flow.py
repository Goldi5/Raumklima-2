"""Einrichtungsassistent und Optionen.

Raum anlegen (kurz):
  1. Thermostat wählen
  2. Fühler & Fenster – aus dem Bereich des Thermostats vorgeschlagen
  3. Raum – Typ, Wunschtemperatur, Absenkung (Technik unter „Erweitert“)
  4. nur beim ersten Raum: Allgemein – Bewohner, Wohnung, Benachrichtigungen, Wetter
"""

from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant.config_entries import (
    SOURCE_IMPORT,
    ConfigEntry,
    ConfigFlow,
    ConfigFlowResult,
    OptionsFlow,
    OptionsFlowWithReload,
)
from homeassistant.core import HomeAssistant, callback
from homeassistant.data_entry_flow import section
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import device_registry as dr
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
    TimeSelector,
)

from .const import (
    BUILDING_TYPES,
    CAL_OFFSET,
    CAL_TARGET,
    CALIBRATION_MODES,
    CONF_AWAY_DELAY,
    CONF_BUILDING,
    CONF_CALIBRATION_ENTITY,
    CONF_CALIBRATION_MODE,
    CONF_COLD_SNAP_TEMP,
    CONF_COMFORT_TEMP,
    CONF_ENTRY_TYPE,
    CONF_FOLLOW_TRV,
    CONF_FROST_FLOOR,
    CONF_HEATING_LIMIT,
    CONF_HUMIDITY_SENSOR,
    CONF_LONG_AWAY_HOURS,
    CONF_NAME,
    CONF_NOTIFY,
    CONF_OFF_METHOD,
    CONF_OFFSET_MIN_INTERVAL,
    CONF_OFFSET_THRESHOLD,
    CONF_ON_PRESET,
    CONF_PREHEAT_KM,
    CONF_RECIPIENTS,
    CONF_RESIDENTS,
    CONF_ROOM_TYPE,
    CONF_SEASON_END,
    CONF_SEASON_MODE,
    CONF_SEASON_START,
    CONF_SENSOR_STALE_MINUTES,
    CONF_SETBACK_LONG,
    CONF_SETBACK_SHORT,
    CONF_SYNC_MAX_RETRIES,
    CONF_SYNC_VERIFY_DELAY,
    CONF_TEMP_SENSOR,
    CONF_TRV,
    CONF_TTS,
    CONF_VALVE_CARE,
    CONF_WINDOW_CLOSE_DELAY,
    CONF_WINDOW_OPEN_DELAY,
    CONF_WINDOWS,
    CONF_ZONE,
    DEFAULT_PUSH_KINDS,
    DEFAULT_TTS_KINDS,
    DEFAULTS,
    DOMAIN,
    ENTRY_HUB,
    HUB_DEFAULTS,
    HUB_UNIQUE_ID,
    KINDS,
    OFF_METHODS,
    ON_PRESET_AUTO,
    ROOM_TYPE_OPTIONS,
    SEASON_MODES,
)
from .planning import setback_defaults

ADVANCED = "advanced"
PUSH = "push_targets"
TTS = "tts_targets_hub"


# ------------------------------------------------------------------ Hilfen
def trv_presets(hass: HomeAssistant, trv: str | None) -> list[str]:
    """Presets des TRV (ohne 'off') für die Auswahl."""
    state = hass.states.get(trv) if trv else None
    presets = state.attributes.get("preset_modes") if state else None
    return [p for p in (presets or []) if p and p != "off"]


def find_calibration_entity(hass: HomeAssistant, trv: str) -> str | None:
    """Offset-Entität (number) am selben Gerät wie das TRV suchen."""
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


def suggest_for_trv(hass: HomeAssistant, trv: str) -> dict[str, Any]:
    """Name, Fühler und Fensterkontakte aus dem Bereich des Thermostats vorschlagen."""
    ents = er.async_get(hass)
    devs = dr.async_get(hass)
    areas = ar.async_get(hass)
    trv_entry = ents.async_get(trv)
    if trv_entry is None:
        return {}
    trv_dev = devs.async_get(trv_entry.device_id) if trv_entry.device_id else None
    area_id = trv_entry.area_id or (trv_dev.area_id if trv_dev else None)
    result: dict[str, Any] = {}
    if area_id and (area := areas.async_get_area(area_id)):
        result[CONF_NAME] = area.name
    elif trv_dev:
        result[CONF_NAME] = (trv_dev.name_by_user or trv_dev.name or "").replace("Thermostat", "").strip()
    if not area_id:
        return result
    temps: list[str] = []
    hums: list[str] = []
    windows: list[str] = []
    for entry in ents.entities.values():
        if entry.disabled_by or entry.device_id == trv_entry.device_id:
            continue
        dev = devs.async_get(entry.device_id) if entry.device_id else None
        if (entry.area_id or (dev.area_id if dev else None)) != area_id:
            continue
        dclass = entry.device_class or entry.original_device_class
        if entry.domain == "sensor" and dclass == "temperature":
            temps.append(entry.entity_id)
        elif entry.domain == "sensor" and dclass == "humidity":
            hums.append(entry.entity_id)
        elif entry.domain == "binary_sensor" and dclass in ("window", "door", "opening"):
            windows.append(entry.entity_id)
    if temps:
        result[CONF_TEMP_SENSOR] = sorted(temps)[0]
    if hums:
        result[CONF_HUMIDITY_SENSOR] = sorted(hums)[0]
    if windows:
        result[CONF_WINDOWS] = sorted(windows)
    return result


def notify_services(hass: HomeAssistant) -> list[str]:
    """Alle notify-Dienste als 'notify.xyz' (für die Auswahl)."""
    services = hass.services.async_services().get("notify", {})
    return sorted(
        f"notify.{name}" for name in services if name not in ("send_message", "persistent_notification")
    )


def _number(minimum: float, maximum: float, step: float, unit: str) -> NumberSelector:
    return NumberSelector(
        NumberSelectorConfig(
            min=minimum, max=maximum, step=step, unit_of_measurement=unit, mode=NumberSelectorMode.BOX
        )
    )


def _select(options: list[str], key: str, multiple: bool = False, custom: bool = False) -> SelectSelector:
    return SelectSelector(
        SelectSelectorConfig(
            options=options,
            translation_key=key,
            multiple=multiple,
            custom_value=custom,
            mode=SelectSelectorMode.DROPDOWN,
        )
    )


def _suggest(value: Any) -> dict[str, Any]:
    return {"suggested_value": value}


# ------------------------------------------------------------------ Schemas Raum
def _devices_schema(defaults: dict[str, Any], *, with_name: bool) -> vol.Schema:
    fields: dict[Any, Any] = {}
    if with_name:
        fields[vol.Required(CONF_NAME, default=defaults.get(CONF_NAME, ""))] = TextSelector()
    else:
        fields[vol.Required(CONF_TRV, default=defaults.get(CONF_TRV, vol.UNDEFINED))] = EntitySelector(
            EntitySelectorConfig(domain="climate")
        )
    fields.update(
        {
            vol.Required(
                CONF_TEMP_SENSOR, default=defaults.get(CONF_TEMP_SENSOR, vol.UNDEFINED)
            ): EntitySelector(EntitySelectorConfig(domain="sensor", device_class="temperature")),
            vol.Optional(
                CONF_HUMIDITY_SENSOR, description=_suggest(defaults.get(CONF_HUMIDITY_SENSOR))
            ): EntitySelector(EntitySelectorConfig(domain="sensor", device_class="humidity")),
            vol.Optional(
                CONF_WINDOWS, description=_suggest(defaults.get(CONF_WINDOWS))
            ): EntitySelector(EntitySelectorConfig(domain="binary_sensor", multiple=True)),
        }
    )
    return vol.Schema(fields)


def _advanced_fields(defaults: dict[str, Any], presets: list[str]) -> dict[Any, Any]:
    preset_options = [ON_PRESET_AUTO, *presets]
    on_default = defaults.get(CONF_ON_PRESET, ON_PRESET_AUTO)
    if on_default not in preset_options:
        on_default = ON_PRESET_AUTO

    def d(key: str) -> Any:
        return defaults.get(key, DEFAULTS[key])

    return {
        vol.Required(CONF_CALIBRATION_MODE, default=d(CONF_CALIBRATION_MODE)): SelectSelector(
            SelectSelectorConfig(
                options=CALIBRATION_MODES, translation_key=CONF_CALIBRATION_MODE, mode=SelectSelectorMode.LIST
            )
        ),
        vol.Optional(
            CONF_CALIBRATION_ENTITY, description=_suggest(defaults.get(CONF_CALIBRATION_ENTITY))
        ): EntitySelector(EntitySelectorConfig(domain="number")),
        vol.Required(CONF_OFF_METHOD, default=d(CONF_OFF_METHOD)): _select(OFF_METHODS, CONF_OFF_METHOD),
        vol.Required(CONF_ON_PRESET, default=on_default): _select(
            preset_options, CONF_ON_PRESET, custom=True
        ),
        vol.Required(CONF_WINDOW_OPEN_DELAY, default=d(CONF_WINDOW_OPEN_DELAY)): _number(0, 600, 1, "s"),
        vol.Required(CONF_WINDOW_CLOSE_DELAY, default=d(CONF_WINDOW_CLOSE_DELAY)): _number(0, 600, 1, "s"),
        vol.Required(CONF_FOLLOW_TRV, default=d(CONF_FOLLOW_TRV)): BooleanSelector(),
    }


def _room_schema(defaults: dict[str, Any], presets: list[str]) -> vol.Schema:
    room_type = defaults.get(CONF_ROOM_TYPE) or "living"
    short, long = setback_defaults(room_type)
    return vol.Schema(
        {
            vol.Required(CONF_ROOM_TYPE, default=room_type): _select(ROOM_TYPE_OPTIONS, CONF_ROOM_TYPE),
            vol.Optional(
                CONF_COMFORT_TEMP, description=_suggest(defaults.get(CONF_COMFORT_TEMP))
            ): _number(12, 26, 0.5, "°C"),
            vol.Optional(
                CONF_SETBACK_SHORT, description=_suggest(defaults.get(CONF_SETBACK_SHORT, short))
            ): _number(10, 24, 0.5, "°C"),
            vol.Optional(
                CONF_SETBACK_LONG, description=_suggest(defaults.get(CONF_SETBACK_LONG, long))
            ): _number(8, 22, 0.5, "°C"),
            vol.Required(ADVANCED): section(
                vol.Schema(_advanced_fields(defaults, presets)), {"collapsed": True}
            ),
        }
    )


def _technical_schema(defaults: dict[str, Any]) -> vol.Schema:
    def d(key: str) -> Any:
        return defaults.get(key, DEFAULTS[key])

    return vol.Schema(
        {
            vol.Required(CONF_OFFSET_THRESHOLD, default=d(CONF_OFFSET_THRESHOLD)): _number(0.1, 2, 0.1, "°C"),
            vol.Required(CONF_OFFSET_MIN_INTERVAL, default=d(CONF_OFFSET_MIN_INTERVAL)): _number(1, 60, 1, "min"),
            vol.Required(CONF_SENSOR_STALE_MINUTES, default=d(CONF_SENSOR_STALE_MINUTES)): _number(10, 360, 5, "min"),
            vol.Required(CONF_SYNC_VERIFY_DELAY, default=d(CONF_SYNC_VERIFY_DELAY)): _number(5, 120, 1, "s"),
            vol.Required(CONF_SYNC_MAX_RETRIES, default=d(CONF_SYNC_MAX_RETRIES)): _number(1, 10, 1, "x"),
        }
    )


def _validate_calibration(data: dict[str, Any]) -> dict[str, str]:
    if data.get(CONF_CALIBRATION_MODE) == CAL_OFFSET and not data.get(CONF_CALIBRATION_ENTITY):
        return {ADVANCED: "calibration_entity_required"}
    return {}


def _flatten_room(user_input: dict[str, Any]) -> dict[str, Any]:
    data = dict(user_input)
    data.update(data.pop(ADVANCED, {}) or {})
    return data


# ------------------------------------------------------------------ Schemas Allgemein
def _hub_first_schema(hass: HomeAssistant, defaults: dict[str, Any]) -> vol.Schema:
    return vol.Schema(
        {
            vol.Optional(CONF_RESIDENTS, description=_suggest(defaults.get(CONF_RESIDENTS))): EntitySelector(
                EntitySelectorConfig(domain="person", multiple=True)
            ),
            vol.Optional(CONF_ZONE, description=_suggest(defaults.get(CONF_ZONE))): EntitySelector(
                EntitySelectorConfig(domain="zone")
            ),
            vol.Optional(PUSH, description=_suggest(defaults.get(PUSH) or [])): _select(
                notify_services(hass), "notify_target", multiple=True, custom=True
            ),
            vol.Optional("weather_entity", description=_suggest(defaults.get("weather_entity"))): EntitySelector(
                EntitySelectorConfig(domain=["weather", "sensor"])
            ),
            vol.Required(CONF_BUILDING, default=defaults.get(CONF_BUILDING, "renovated")): _select(
                BUILDING_TYPES, CONF_BUILDING
            ),
        }
    )


def _hub_notify_schema(hass: HomeAssistant, cur: dict[str, Any]) -> vol.Schema:
    targets = notify_services(hass)
    return vol.Schema(
        {
            vol.Optional(PUSH, description=_suggest(list((cur.get(CONF_RECIPIENTS) or {}).keys()))): _select(
                targets, "notify_target", multiple=True, custom=True
            ),
            vol.Optional(TTS, description=_suggest(list((cur.get(CONF_TTS) or {}).keys()))): _select(
                [t for t in targets if "alexa" in t or "tts" in t] or targets,
                "notify_target",
                multiple=True,
                custom=True,
            ),
            vol.Required("quiet_start", default=cur.get("quiet_start") or "22:00:00"): TimeSelector(),
            vol.Required("quiet_end", default=cur.get("quiet_end") or "07:00:00"): TimeSelector(),
            vol.Required("repeat_minutes", default=cur.get("repeat_minutes") or 5): _number(1, 60, 1, "min"),
            vol.Optional("weather_entity", description=_suggest(cur.get("weather_entity"))): EntitySelector(
                EntitySelectorConfig(domain=["weather", "sensor"])
            ),
            vol.Required("notify_on_failure", default=bool(cur.get("notify_on_failure", True))): BooleanSelector(),
        }
    )


def _hub_kinds_schema(push: dict[str, list[str]], tts: dict[str, list[str]]) -> vol.Schema:
    fields: dict[Any, Any] = {}
    for target, kinds in push.items():
        fields[vol.Optional(target, default=kinds)] = _select(KINDS, "kind", multiple=True)
    for target, kinds in tts.items():
        fields[vol.Optional(f"🔊 {target}", default=kinds)] = _select(KINDS, "kind", multiple=True)
    return vol.Schema(fields)


def _hub_presence_schema(cur: dict[str, Any]) -> vol.Schema:
    return vol.Schema(
        {
            vol.Optional(CONF_RESIDENTS, description=_suggest(cur.get(CONF_RESIDENTS))): EntitySelector(
                EntitySelectorConfig(domain="person", multiple=True)
            ),
            vol.Optional(CONF_ZONE, description=_suggest(cur.get(CONF_ZONE))): EntitySelector(
                EntitySelectorConfig(domain="zone")
            ),
            vol.Required(CONF_AWAY_DELAY, default=cur[CONF_AWAY_DELAY]): _number(0, 240, 5, "min"),
            vol.Required(CONF_LONG_AWAY_HOURS, default=cur[CONF_LONG_AWAY_HOURS]): _number(2, 168, 1, "h"),
            vol.Required(CONF_PREHEAT_KM, default=cur[CONF_PREHEAT_KM]): _number(0, 200, 1, "km"),
            vol.Required(CONF_BUILDING, default=cur[CONF_BUILDING]): _select(BUILDING_TYPES, CONF_BUILDING),
        }
    )


def _hub_season_schema(cur: dict[str, Any]) -> vol.Schema:
    return vol.Schema(
        {
            vol.Required(CONF_SEASON_MODE, default=cur[CONF_SEASON_MODE]): _select(SEASON_MODES, CONF_SEASON_MODE),
            vol.Required(CONF_SEASON_START, default=cur[CONF_SEASON_START]): TextSelector(),
            vol.Required(CONF_SEASON_END, default=cur[CONF_SEASON_END]): TextSelector(),
            vol.Required(CONF_HEATING_LIMIT, default=cur[CONF_HEATING_LIMIT]): _number(5, 25, 0.5, "°C"),
            vol.Required(CONF_COLD_SNAP_TEMP, default=cur[CONF_COLD_SNAP_TEMP]): _number(0, 20, 0.5, "°C"),
            vol.Required(CONF_FROST_FLOOR, default=cur[CONF_FROST_FLOOR]): _number(5, 20, 0.5, "°C"),
            vol.Required(CONF_VALVE_CARE, default=cur[CONF_VALVE_CARE]): BooleanSelector(),
        }
    )


def _valid_md(value: str) -> bool:
    month, _, day = str(value).partition("-")
    return month.isdigit() and day.isdigit() and 1 <= int(month) <= 12 and 1 <= int(day) <= 31


def _has_hub(hass: HomeAssistant) -> bool:
    return any(e.data.get(CONF_ENTRY_TYPE) == ENTRY_HUB for e in hass.config_entries.async_entries(DOMAIN))


# ------------------------------------------------------------------ Einrichtung
class RaumklimaConfigFlow(ConfigFlow, domain=DOMAIN):
    """Raum anlegen; die Zentrale „Allgemein“ entsteht automatisch."""

    VERSION = 1

    def __init__(self) -> None:
        self._data: dict[str, Any] = {}
        self._options: dict[str, Any] = {}

    async def async_step_import(self, data: dict[str, Any]) -> ConfigFlowResult:
        """Zentrale „Allgemein“ anlegen (automatisch beim ersten Raum)."""
        await self.async_set_unique_id(HUB_UNIQUE_ID)
        self._abort_if_unique_id_configured()
        return self.async_create_entry(
            title="Allgemein",
            data={CONF_ENTRY_TYPE: ENTRY_HUB},
            options={**HUB_DEFAULTS, **(data or {})},
        )

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Schritt 1: Thermostat."""
        if user_input is not None:
            await self.async_set_unique_id(user_input[CONF_TRV])
            self._abort_if_unique_id_configured()
            self._data[CONF_TRV] = user_input[CONF_TRV]
            return await self.async_step_devices()
        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema(
                {vol.Required(CONF_TRV): EntitySelector(EntitySelectorConfig(domain="climate"))}
            ),
        )

    async def async_step_devices(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Schritt 2: Fühler & Fenster – vorgeschlagen aus dem Bereich."""
        errors: dict[str, str] = {}
        if user_input is not None:
            if user_input[CONF_TEMP_SENSOR] == self._data[CONF_TRV]:
                errors[CONF_TEMP_SENSOR] = "same_entity"
            else:
                self._data.update(user_input)
                return await self.async_step_room()
        defaults = user_input or suggest_for_trv(self.hass, self._data[CONF_TRV])
        return self.async_show_form(
            step_id="devices",
            data_schema=_devices_schema(defaults, with_name=True),
            errors=errors,
            description_placeholders={"trv": self._data[CONF_TRV]},
        )

    async def async_step_room(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Schritt 3: Raum (Technik unter „Erweitert“)."""
        errors: dict[str, str] = {}
        presets = trv_presets(self.hass, self._data[CONF_TRV])
        if user_input is not None:
            flat = _flatten_room(user_input)
            errors = _validate_calibration(flat)
            if not errors:
                for key in (CONF_CALIBRATION_MODE, CONF_CALIBRATION_ENTITY, CONF_OFF_METHOD, CONF_ON_PRESET):
                    if key in flat:
                        self._data[key] = flat.pop(key)
                self._options = {**{k: DEFAULTS[k] for k in (
                    CONF_OFFSET_THRESHOLD, CONF_OFFSET_MIN_INTERVAL, CONF_SENSOR_STALE_MINUTES,
                    CONF_SYNC_VERIFY_DELAY, CONF_SYNC_MAX_RETRIES, CONF_NOTIFY,
                )}, **flat}
                if _has_hub(self.hass):
                    return self._create_room()
                return await self.async_step_hub()
        found = find_calibration_entity(self.hass, self._data[CONF_TRV])
        defaults = {
            CONF_CALIBRATION_ENTITY: found,
            CONF_CALIBRATION_MODE: CAL_OFFSET if found else CAL_TARGET,
        }
        return self.async_show_form(
            step_id="room",
            data_schema=_room_schema(defaults, presets),
            errors=errors,
            description_placeholders={"found": found or "–"},
        )

    async def async_step_hub(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Schritt 4 (nur beim ersten Raum): gilt für die ganze Wohnung."""
        if user_input is not None:
            hub = {
                CONF_RESIDENTS: user_input.get(CONF_RESIDENTS) or [],
                CONF_ZONE: user_input.get(CONF_ZONE),
                CONF_RECIPIENTS: {t: list(DEFAULT_PUSH_KINDS) for t in user_input.get(PUSH) or []},
                "weather_entity": user_input.get("weather_entity"),
                CONF_BUILDING: user_input.get(CONF_BUILDING, "renovated"),
            }
            self.hass.async_create_task(
                self.hass.config_entries.flow.async_init(DOMAIN, context={"source": SOURCE_IMPORT}, data=hub)
            )
            return self._create_room()
        zones = [s.entity_id for s in self.hass.states.async_all("zone")]
        return self.async_show_form(
            step_id="hub",
            data_schema=_hub_first_schema(
                self.hass, {CONF_ZONE: "zone.home" if "zone.home" in zones else None}
            ),
        )

    def _create_room(self) -> ConfigFlowResult:
        return self.async_create_entry(
            title=self._data[CONF_NAME], data=self._data, options=self._options
        )

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: ConfigEntry) -> OptionsFlow:
        if config_entry.data.get(CONF_ENTRY_TYPE) == ENTRY_HUB:
            return HubOptionsFlow()
        return RaumklimaOptionsFlow()


# ------------------------------------------------------------------ Optionen Raum
class RaumklimaOptionsFlow(OptionsFlowWithReload):
    """Raum nachträglich ändern: Geräte → Raum → Technik."""

    def __init__(self) -> None:
        self._options: dict[str, Any] = {}

    def _current(self) -> dict[str, Any]:
        return {**DEFAULTS, **self.config_entry.data, **self.config_entry.options}

    async def async_step_init(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        if user_input is not None:
            user_input.setdefault(CONF_HUMIDITY_SENSOR, None)
            user_input.setdefault(CONF_WINDOWS, [])
            self._options.update(user_input)
            return await self.async_step_room()
        return self.async_show_form(
            step_id="init", data_schema=_devices_schema(self._current(), with_name=False)
        )

    async def async_step_room(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        errors: dict[str, str] = {}
        trv = self._options.get(CONF_TRV) or self._current()[CONF_TRV]
        if user_input is not None:
            flat = _flatten_room(user_input)
            errors = _validate_calibration(flat)
            if not errors:
                for key in (CONF_COMFORT_TEMP, CONF_CALIBRATION_ENTITY):
                    flat.setdefault(key, None)
                self._options.update(flat)
                return await self.async_step_technical()
        cur = self._current()
        if not cur.get(CONF_CALIBRATION_ENTITY):
            cur[CONF_CALIBRATION_ENTITY] = find_calibration_entity(self.hass, trv)
        return self.async_show_form(
            step_id="room",
            data_schema=_room_schema(cur, trv_presets(self.hass, trv)),
            errors=errors,
            description_placeholders={"found": cur.get(CONF_CALIBRATION_ENTITY) or "–"},
        )

    async def async_step_technical(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        if user_input is not None:
            self._options.update(user_input)
            return self.async_create_entry(data={**self.config_entry.options, **self._options})
        return self.async_show_form(step_id="technical", data_schema=_technical_schema(self._current()))


# ------------------------------------------------------------------ Optionen Allgemein
class HubOptionsFlow(OptionsFlow):
    """Allgemein: Benachrichtigungen, Anwesenheit, Heizsaison (ohne Neustart der Räume)."""

    def __init__(self) -> None:
        self._pending: dict[str, Any] = {}

    def _cur(self) -> dict[str, Any]:
        return {**HUB_DEFAULTS, **self.config_entry.options}

    def _save(self, changes: dict[str, Any]) -> ConfigFlowResult:
        return self.async_create_entry(data={**self.config_entry.options, **changes})

    async def async_step_init(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        return self.async_show_menu(step_id="hub_menu", menu_options=["notifications", "presence", "season"])

    async def async_step_notifications(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        cur = self._cur()
        if user_input is not None:
            old_push = cur.get(CONF_RECIPIENTS) or {}
            old_tts = cur.get(CONF_TTS) or {}
            self._pending = {
                CONF_RECIPIENTS: {t: old_push.get(t, list(DEFAULT_PUSH_KINDS)) for t in user_input.get(PUSH) or []},
                CONF_TTS: {t: old_tts.get(t, list(DEFAULT_TTS_KINDS)) for t in user_input.get(TTS) or []},
                "quiet_start": user_input["quiet_start"],
                "quiet_end": user_input["quiet_end"],
                "repeat_minutes": user_input["repeat_minutes"],
                "weather_entity": user_input.get("weather_entity"),
                "notify_on_failure": user_input["notify_on_failure"],
            }
            if self._pending[CONF_RECIPIENTS] or self._pending[CONF_TTS]:
                return await self.async_step_kinds()
            return self._save(self._pending)
        return self.async_show_form(step_id="notifications", data_schema=_hub_notify_schema(self.hass, cur))

    async def async_step_kinds(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        push = self._pending[CONF_RECIPIENTS]
        tts = self._pending[CONF_TTS]
        if user_input is not None:
            self._pending[CONF_RECIPIENTS] = {t: user_input.get(t, []) for t in push}
            self._pending[CONF_TTS] = {t: user_input.get(f"🔊 {t}", []) for t in tts}
            return self._save(self._pending)
        return self.async_show_form(step_id="kinds", data_schema=_hub_kinds_schema(push, tts))

    async def async_step_presence(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        if user_input is not None:
            user_input.setdefault(CONF_RESIDENTS, [])
            user_input.setdefault(CONF_ZONE, None)
            return self._save(user_input)
        return self.async_show_form(step_id="presence", data_schema=_hub_presence_schema(self._cur()))

    async def async_step_season(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        errors: dict[str, str] = {}
        if user_input is not None:
            for key in (CONF_SEASON_START, CONF_SEASON_END):
                if not _valid_md(user_input[key]):
                    errors[key] = "invalid_date"
            if not errors:
                return self._save(user_input)
        return self.async_show_form(
            step_id="season", data_schema=_hub_season_schema(self._cur()), errors=errors
        )
