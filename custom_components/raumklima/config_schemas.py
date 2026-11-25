"""Formulare der Einrichtung: Schemas, Vorschläge und Prüfungen für Raum und Zentrale."""

from __future__ import annotations

from typing import Any

from homeassistant.config_entries import (
    ConfigEntry,
)
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import section
from homeassistant.helpers import area_registry as ar, device_registry as dr, entity_registry as er
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
import voluptuous as vol

from .const import (
    BUILDING_TYPES,
    CAL_OFFSET,
    CALIBRATION_MODES_ALL,
    CO2_LIMIT_DEFAULT,
    CO2_LIMIT_OPTIONS,
    CONF_AWAY_DELAY,
    CONF_BUILDING,
    CONF_CALIBRATION_ENTITY,
    CONF_CALIBRATION_MODE,
    CONF_CO2_LIMIT,
    CONF_CO2_SENSOR,
    CONF_COLD_SNAP_TEMP,
    CONF_COMFORT_TEMP,
    CONF_ENTRY_TYPE,
    CONF_EXTRA_TRVS,
    CONF_FLOOR_RETURN,
    CONF_FLOOR_SUPPLY,
    CONF_FOLLOW_TRV,
    CONF_FROST_FLOOR,
    CONF_FROST_TEMP,
    CONF_HEATING_LIMIT,
    CONF_HUMIDITY_SENSOR,
    CONF_LONG_AWAY_HOURS,
    CONF_LOOK_DARK,
    CONF_NAME,
    CONF_NOTIFY_CAP,
    CONF_OFF_METHOD,
    CONF_OFFSET_MIN_INTERVAL,
    CONF_OFFSET_THRESHOLD,
    CONF_ON_PRESET,
    CONF_PM25_SENSOR,
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
    CONF_SHADING_COVERS,
    CONF_SYNC_MAX_RETRIES,
    CONF_SYNC_VERIFY_DELAY,
    CONF_TEMP_SENSOR,
    CONF_TRV,
    CONF_TRV_INTERVAL,
    CONF_TTS,
    CONF_VALVE_CARE,
    CONF_VENT_FROM,
    CONF_VENT_TO,
    CONF_WALL,
    CONF_WINDOW_CLOSE_DELAY,
    CONF_WINDOW_OPEN_DELAY,
    CONF_WINDOWS,
    CONF_WORK_ZONE_MINUTES,
    CONF_WORK_ZONES,
    CONF_ZONE,
    DEFAULTS,
    DOMAIN,
    ENTRY_HUB,
    KIND_LIVE,
    KINDS,
    LOOK_DARK_MODES,
    NOTIFY_CAP_DEFAULT,
    NOTIFY_CAP_OPTIONS,
    OFF_METHODS,
    ON_PRESET_AUTO,
    ROOM_TYPE_OPTIONS,
    SEASON_MODES,
    TRV_INTERVAL_OPTIONS,
    WALL_OPTIONS,
)
from .notify_targets import notify_choices
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
    co2s: list[str] = []
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
        elif entry.domain == "sensor" and dclass == "carbon_dioxide":
            co2s.append(entry.entity_id)
        elif entry.domain == "binary_sensor" and dclass in ("window", "door", "opening"):
            windows.append(entry.entity_id)
    if temps:
        result[CONF_TEMP_SENSOR] = sorted(temps)[0]
    if hums:
        result[CONF_HUMIDITY_SENSOR] = sorted(hums)[0]
    if co2s:
        result[CONF_CO2_SENSOR] = sorted(co2s)[0]
    if windows:
        result[CONF_WINDOWS] = sorted(windows)
    return result


def notify_services(hass: HomeAssistant) -> list[str]:
    """Alle Empfänger als 'notify.xyz' – Dienste und notify-Entitäten."""
    return notify_choices(hass)


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
def _monitor_schema() -> vol.Schema:
    """Raum ohne Heizung: Fühler, sonst nichts."""
    return vol.Schema(
        {
            vol.Required(CONF_NAME): TextSelector(),
            vol.Required(CONF_TEMP_SENSOR): EntitySelector(
                EntitySelectorConfig(domain="sensor", device_class="temperature")
            ),
            vol.Optional(CONF_HUMIDITY_SENSOR): EntitySelector(
                EntitySelectorConfig(domain="sensor", device_class="humidity")
            ),
            vol.Optional(CONF_CO2_SENSOR): EntitySelector(
                EntitySelectorConfig(domain="sensor", device_class="carbon_dioxide")
            ),
            vol.Optional(CONF_PM25_SENSOR): EntitySelector(
                EntitySelectorConfig(domain="sensor", device_class="pm25")
            ),
            vol.Optional(CONF_WINDOWS): EntitySelector(
                EntitySelectorConfig(domain=["binary_sensor", "cover"], multiple=True)
            ),
            vol.Optional(CONF_SHADING_COVERS): EntitySelector(
                EntitySelectorConfig(domain="cover", multiple=True)
            ),
            vol.Optional(CONF_FLOOR_SUPPLY): EntitySelector(
                EntitySelectorConfig(domain="sensor", device_class="temperature")
            ),
            vol.Optional(CONF_FLOOR_RETURN): EntitySelector(
                EntitySelectorConfig(domain="sensor", device_class="temperature")
            ),
        }
    )


def _devices_schema(
    defaults: dict[str, Any], *, with_name: bool, trv_optional: bool = False
) -> vol.Schema:
    fields: dict[Any, Any] = {}
    if with_name:
        fields[vol.Required(CONF_NAME, default=defaults.get(CONF_NAME, ""))] = TextSelector()
    elif trv_optional:
        # Überwachungsraum: Thermostat kann später ergänzt werden – leer heißt „weiter nur messen"
        fields[
            vol.Optional(CONF_TRV, description=_suggest(defaults.get(CONF_TRV)))
        ] = EntitySelector(EntitySelectorConfig(domain="climate"))
    else:
        fields[vol.Required(CONF_TRV, default=defaults.get(CONF_TRV, vol.UNDEFINED))] = EntitySelector(
            EntitySelectorConfig(domain="climate")
        )
    fields.update(
        {
            vol.Optional(
                CONF_TEMP_SENSOR, description=_suggest(defaults.get(CONF_TEMP_SENSOR))
            ): EntitySelector(EntitySelectorConfig(domain="sensor", device_class="temperature")),
            vol.Optional(
                CONF_HUMIDITY_SENSOR, description=_suggest(defaults.get(CONF_HUMIDITY_SENSOR))
            ): EntitySelector(EntitySelectorConfig(domain="sensor", device_class="humidity")),
            vol.Optional(
                CONF_CO2_SENSOR, description=_suggest(defaults.get(CONF_CO2_SENSOR))
            ): EntitySelector(EntitySelectorConfig(domain="sensor", device_class="carbon_dioxide")),
            vol.Optional(
                CONF_PM25_SENSOR, description=_suggest(defaults.get(CONF_PM25_SENSOR))
            ): EntitySelector(EntitySelectorConfig(domain="sensor", device_class="pm25")),
            vol.Optional(
                CONF_WINDOWS, description=_suggest(defaults.get(CONF_WINDOWS))
            ): EntitySelector(EntitySelectorConfig(domain=["binary_sensor", "cover"], multiple=True)),
            vol.Optional(
                CONF_SHADING_COVERS, description=_suggest(defaults.get(CONF_SHADING_COVERS))
            ): EntitySelector(EntitySelectorConfig(domain="cover", multiple=True)),
            vol.Optional(
                CONF_FLOOR_SUPPLY, description=_suggest(defaults.get(CONF_FLOOR_SUPPLY))
            ): EntitySelector(EntitySelectorConfig(domain="sensor", device_class="temperature")),
            vol.Optional(
                CONF_FLOOR_RETURN, description=_suggest(defaults.get(CONF_FLOOR_RETURN))
            ): EntitySelector(EntitySelectorConfig(domain="sensor", device_class="temperature")),
            vol.Optional(
                CONF_EXTRA_TRVS, description=_suggest(defaults.get(CONF_EXTRA_TRVS))
            ): EntitySelector(EntitySelectorConfig(domain="climate", multiple=True)),
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
                options=CALIBRATION_MODES_ALL, translation_key=CONF_CALIBRATION_MODE, mode=SelectSelectorMode.LIST
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


def _room_schema(defaults: dict[str, Any], presets: list[str], monitor: bool = False) -> vol.Schema:
    """Raum-Einstellungen – bei einem Überwachungsraum ohne alles, was einen Sollwert braucht.

    Ohne Thermostat gibt es keine Wunschtemperatur, keine Absenkung, keine Kalibrierung und
    keine Geräteantwortzeit; gefragt werden nur Raumtyp (er bestimmt Feuchte- und Lüftwerte),
    Bauart, CO₂-Grenze und der Hinweis-Deckel.
    """
    room_type = defaults.get(CONF_ROOM_TYPE) or "living"
    short, long = setback_defaults(room_type)
    fields: dict[Any, Any] = {
        vol.Required(CONF_ROOM_TYPE, default=room_type): _select(ROOM_TYPE_OPTIONS, CONF_ROOM_TYPE),
        vol.Optional(
            CONF_WALL, description=_suggest(defaults.get(CONF_WALL) or "auto")
        ): _select(WALL_OPTIONS, CONF_WALL),
        # Auswahl mit Text-Werten: Zahlen-Auswahlen (vol.In mit int) zeigt das HA-Frontend beim
        # erneuten Öffnen leer an, obwohl der Wert gespeichert ist (#69). Gespeichert wird weiter
        # als Zahl (siehe _int_choices).
        vol.Optional(
            CONF_CO2_LIMIT, default=_choice(defaults.get(CONF_CO2_LIMIT), CO2_LIMIT_OPTIONS, CO2_LIMIT_DEFAULT)
        ): _select([str(v) for v in CO2_LIMIT_OPTIONS], CONF_CO2_LIMIT),
        vol.Optional(
            CONF_NOTIFY_CAP, default=_choice(defaults.get(CONF_NOTIFY_CAP), NOTIFY_CAP_OPTIONS, NOTIFY_CAP_DEFAULT)
        ): _select([str(v) for v in NOTIFY_CAP_OPTIONS], CONF_NOTIFY_CAP),
    }
    if not monitor:
        fields[vol.Optional(
            CONF_TRV_INTERVAL, default=_choice(defaults.get(CONF_TRV_INTERVAL), TRV_INTERVAL_OPTIONS, 0)
        )] = _select([str(v) for v in TRV_INTERVAL_OPTIONS], CONF_TRV_INTERVAL)
        fields[vol.Optional(
            CONF_COMFORT_TEMP, description=_suggest(defaults.get(CONF_COMFORT_TEMP))
        )] = _number(12, 26, 0.5, "°C")
        fields[vol.Optional(
            CONF_FROST_TEMP, description=_suggest(defaults.get(CONF_FROST_TEMP, 5.0))
        )] = _number(5, 15, 0.5, "°C")
        fields[vol.Optional(
            CONF_SETBACK_SHORT, description=_suggest(defaults.get(CONF_SETBACK_SHORT, short))
        )] = _number(10, 24, 0.5, "°C")
        fields[vol.Optional(
            CONF_SETBACK_LONG, description=_suggest(defaults.get(CONF_SETBACK_LONG, long))
        )] = _number(8, 22, 0.5, "°C")
        fields[vol.Required(ADVANCED)] = section(
            vol.Schema(_advanced_fields(defaults, presets)), {"collapsed": True}
        )
    return vol.Schema(fields)


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


def _choice(value: Any, options: list[int], fallback: int) -> str:
    """Gespeicherte Zahl als Auswahlwert; Unbekanntes fällt auf den Standard."""
    try:
        number = int(float(value))
    except (TypeError, ValueError):
        return str(fallback)
    return str(number) if number in options else str(fallback)


def _int_choices(data: dict[str, Any]) -> None:
    for key in (CONF_CO2_LIMIT, CONF_NOTIFY_CAP, CONF_TRV_INTERVAL):
        if key in data and data[key] is not None:
            try:
                data[key] = int(float(data[key]))
            except (TypeError, ValueError):
                data.pop(key)


def _flatten_room(user_input: dict[str, Any]) -> dict[str, Any]:
    data = dict(user_input)
    data.update(data.pop(ADVANCED, {}) or {})
    _int_choices(data)
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
            vol.Optional(CONF_VENT_FROM, default=cur.get(CONF_VENT_FROM) or "08:00:00"): TimeSelector(),
            vol.Optional(CONF_VENT_TO, default=cur.get(CONF_VENT_TO) or "21:00:00"): TimeSelector(),
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
        fields[vol.Optional(f"🔊 {target}", default=kinds)] = _select([k for k in KINDS if k != KIND_LIVE], "kind", multiple=True)
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
            vol.Optional(CONF_WORK_ZONES, description=_suggest(cur.get(CONF_WORK_ZONES))): EntitySelector(
                EntitySelectorConfig(domain="zone", multiple=True)
            ),
            vol.Required(CONF_WORK_ZONE_MINUTES, default=cur.get(CONF_WORK_ZONE_MINUTES, 5)): _number(0, 120, 1, "min"),
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
            vol.Required(CONF_LOOK_DARK, default=cur.get(CONF_LOOK_DARK, "auto")): _select(
                LOOK_DARK_MODES, CONF_LOOK_DARK
            ),
        }
    )


def _valid_md(value: str) -> bool:
    month, _, day = str(value).partition("-")
    return month.isdigit() and day.isdigit() and 1 <= int(month) <= 12 and 1 <= int(day) <= 31


def _hub_entries(hass: HomeAssistant) -> list[ConfigEntry]:
    """Alle Wohnungen (Zentrale-Einträge) – für die Auswahl, wenn es mehrere gibt."""
    return [e for e in hass.config_entries.async_entries(DOMAIN) if e.data.get(CONF_ENTRY_TYPE) == ENTRY_HUB]


def _has_hub(hass: HomeAssistant) -> bool:
    return bool(_hub_entries(hass))
