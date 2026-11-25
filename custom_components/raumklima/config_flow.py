"""Einrichtungsassistent und Optionen.

Raum anlegen (kurz):
  1. Thermostat wählen
  2. Fühler & Fenster – aus dem Bereich des Thermostats vorgeschlagen
  3. Raum – Typ, Wunschtemperatur, Absenkung (Technik unter „Erweitert“)
  4. nur beim ersten Raum: Allgemein – Bewohner, Wohnung, Benachrichtigungen, Wetter
"""

from __future__ import annotations

from typing import Any

from homeassistant.config_entries import (
    SOURCE_IMPORT,
    ConfigEntry,
    ConfigFlow,
    ConfigFlowResult,
    OptionsFlow,
    OptionsFlowWithReload,
)
from homeassistant.core import callback
from homeassistant.data_entry_flow import FlowResultType
from homeassistant.helpers.selector import (
    EntitySelector,
    EntitySelectorConfig,
    TextSelector,
)
import voluptuous as vol

from .config_schemas import (
    PUSH,
    TTS,
    _devices_schema,
    _flatten_room,
    _has_hub,
    _hub_entries,
    _hub_first_schema,
    _hub_kinds_schema,
    _hub_notify_schema,
    _hub_presence_schema,
    _hub_season_schema,
    _monitor_schema,
    _room_schema,
    _technical_schema,
    _valid_md,
    _validate_calibration,
    find_calibration_entity,
    suggest_for_trv,
    trv_presets,
)
from .const import (
    CAL_OFFSET,
    CAL_TARGET,
    CONF_BUILDING,
    CONF_CALIBRATION_ENTITY,
    CONF_CALIBRATION_MODE,
    CONF_COMFORT_TEMP,
    CONF_ENTRY_TYPE,
    CONF_EXTRA_TRVS,
    CONF_FROST_TEMP,
    CONF_HOME,
    CONF_HUMIDITY_SENSOR,
    CONF_NAME,
    CONF_NOTIFY,
    CONF_OFF_METHOD,
    CONF_OFFSET_MIN_INTERVAL,
    CONF_OFFSET_THRESHOLD,
    CONF_ON_PRESET,
    CONF_RECIPIENTS,
    CONF_RESIDENTS,
    CONF_ROOM_TYPE,
    CONF_SEASON_END,
    CONF_SEASON_START,
    CONF_SENSOR_STALE_MINUTES,
    CONF_SYNC_MAX_RETRIES,
    CONF_SYNC_VERIFY_DELAY,
    CONF_TEMP_SENSOR,
    CONF_TRV,
    CONF_TTS,
    CONF_VENT_FROM,
    CONF_VENT_TO,
    CONF_WINDOWS,
    CONF_ZONE,
    DEFAULT_PUSH_KINDS,
    DEFAULT_TTS_KINDS,
    DEFAULTS,
    DOMAIN,
    ENTRY_HUB,
    HUB_DEFAULTS,
    HUB_UNIQUE_ID,
)
from .retype import retyped_values


# ------------------------------------------------------------------ Einrichtung
class RaumklimaConfigFlow(ConfigFlow, domain=DOMAIN):
    """Raum anlegen; die Zentrale „Allgemein“ entsteht automatisch."""

    VERSION = 1

    def __init__(self) -> None:
        self._data: dict[str, Any] = {}
        self._options: dict[str, Any] = {}
        self._new_home = False
        self._monitor = False

    async def async_step_import(self, data: dict[str, Any]) -> ConfigFlowResult:
        """Zentrale anlegen: „Allgemein“ automatisch beim ersten Raum, weitere Wohnungen auf Wunsch."""
        data = dict(data or {})
        home_name = str(data.pop("home_name", "") or "").strip()
        if home_name:
            slug = "".join(c if c.isalnum() else "_" for c in home_name.lower())
            await self.async_set_unique_id(f"raumklima_home_{slug}")
            self._abort_if_unique_id_configured()
            return self.async_create_entry(
                title=home_name,
                data={CONF_ENTRY_TYPE: ENTRY_HUB},
                options={**HUB_DEFAULTS, "name": home_name, **data},
            )
        await self.async_set_unique_id(HUB_UNIQUE_ID)
        self._abort_if_unique_id_configured()
        return self.async_create_entry(
            title="Allgemein",
            data={CONF_ENTRY_TYPE: ENTRY_HUB},
            options={**HUB_DEFAULTS, **(data or {})},
        )

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Einstieg: neue Wohnung oder Raum zu einer bestehenden Wohnung."""
        # Nur beim Start fragen – danach gehört das Formular dem Thermostat-Schritt.
        if user_input is None and _has_hub(self.hass):
            return await self.async_step_menu()
        return await self.async_step_trv(user_input)

    async def async_step_menu(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Auswahl: Raum ergänzen oder eine zweite Wohnung anlegen."""
        return self.async_show_menu(step_id="menu", menu_options=["add_room", "monitor", "new_home"])

    async def async_step_add_room(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Raum zu einer bestehenden Wohnung hinzufügen."""
        return await self.async_step_trv()

    async def async_step_monitor(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Raum ohne Heizung: nur Temperatur, Feuchte und CO₂ überwachen."""
        self._monitor = True
        if user_input is not None:
            self._data.update(user_input)
            self._data[CONF_TRV] = ""
            return await self.async_step_room()
        return self.async_show_form(step_id="monitor", data_schema=_monitor_schema())

    async def async_step_new_home(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Zweite Wohnung anlegen – der Raum wird direkt an sie gehängt."""
        self._new_home = True
        return await self.async_step_trv()

    async def async_step_trv(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
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
            temp = user_input.get(CONF_TEMP_SENSOR) or ""
            user_input[CONF_TEMP_SENSOR] = temp
            if temp and temp == self._data[CONF_TRV]:
                errors[CONF_TEMP_SENSOR] = "same_entity"
            elif self._data[CONF_TRV] in (user_input.get(CONF_EXTRA_TRVS) or []):
                errors[CONF_EXTRA_TRVS] = "extra_is_main"
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
        presets = [] if self._monitor else trv_presets(self.hass, self._data.get(CONF_TRV, ""))
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
                if self._new_home:
                    return await self.async_step_hub()
                if self._monitor:
                    hubs = _hub_entries(self.hass)
                    if len(hubs) > 1:
                        return await self.async_step_home()
                    if hubs:
                        self._data[CONF_HOME] = hubs[0].entry_id
                        return self._create_room()
                    return await self.async_step_hub()
                if _has_hub(self.hass):
                    hubs = _hub_entries(self.hass)
                    if len(hubs) > 1:
                        return await self.async_step_home()
                    self._data[CONF_HOME] = hubs[0].entry_id
                    return self._create_room()
                return await self.async_step_hub()
        found = None if self._monitor else find_calibration_entity(self.hass, self._data.get(CONF_TRV, ""))
        defaults = {
            CONF_CALIBRATION_ENTITY: found,
            CONF_CALIBRATION_MODE: CAL_OFFSET if found else CAL_TARGET,
        }
        return self.async_show_form(
            step_id="room",
            data_schema=_room_schema(defaults, presets, monitor=self._monitor),
            errors=errors,
            description_placeholders={"found": found or "–"},
        )

    async def async_step_home(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Wohnung wählen – nur wenn es mehrere gibt."""
        hubs = _hub_entries(self.hass)
        if user_input is not None:
            self._data[CONF_HOME] = user_input[CONF_HOME]
            return self._create_room()
        return self.async_show_form(
            step_id="home",
            data_schema=vol.Schema(
                {vol.Required(CONF_HOME): vol.In({e.entry_id: e.title for e in hubs})}
            ),
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
            if self._new_home:
                # Eigene Wohnung: erst anlegen, dann den Raum direkt daran hängen
                hub["home_name"] = user_input[CONF_NAME]
                result = await self.hass.config_entries.flow.async_init(
                    DOMAIN, context={"source": SOURCE_IMPORT}, data=hub
                )
                if result.get("type") is FlowResultType.CREATE_ENTRY:
                    self._data[CONF_HOME] = result["result"].entry_id
                return self._create_room()
            self.hass.async_create_task(
                self.hass.config_entries.flow.async_init(DOMAIN, context={"source": SOURCE_IMPORT}, data=hub)
            )
            return self._create_room()
        zones = [s.entity_id for s in self.hass.states.async_all("zone")]
        schema = _hub_first_schema(self.hass, {CONF_ZONE: "zone.home" if "zone.home" in zones else None})
        if self._new_home:
            schema = schema.extend({vol.Required(CONF_NAME): TextSelector()})
        return self.async_show_form(
            step_id="hub",
            data_schema=schema,
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
        self._home_asked = False

    def _current(self) -> dict[str, Any]:
        return {**DEFAULTS, **self.config_entry.data, **self.config_entry.options}

    async def async_step_init(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        # Bei mehreren Wohnungen zuerst fragen, zu welcher der Raum gehört
        if user_input is None and not self._home_asked and len(_hub_entries(self.hass)) > 1:
            return await self.async_step_home()
        errors: dict[str, str] = {}
        if user_input is not None:
            user_input[CONF_TEMP_SENSOR] = user_input.get(CONF_TEMP_SENSOR) or ""
            user_input.setdefault(CONF_HUMIDITY_SENSOR, None)
            user_input.setdefault(CONF_WINDOWS, [])
            user_input.setdefault(CONF_EXTRA_TRVS, [])
            if not user_input.get(CONF_TRV):
                user_input.pop(CONF_TRV, None)  # leer = weiter nur überwachen
            if user_input.get(CONF_TRV) in user_input[CONF_EXTRA_TRVS]:
                errors[CONF_EXTRA_TRVS] = "extra_is_main"
            else:
                self._options.update(user_input)
                return await self.async_step_room()
        return self.async_show_form(
            step_id="init",
            data_schema=_devices_schema(
                user_input or self._current(),
                with_name=False,
                trv_optional=not (self.config_entry.data.get(CONF_TRV) or ""),
            ),
            errors=errors,
        )

    async def async_step_home(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Wohnung des Raums – nur wenn es mehrere gibt."""
        hubs = _hub_entries(self.hass)
        if user_input is not None:
            self._options[CONF_HOME] = user_input[CONF_HOME]
            self._home_asked = True
            return await self.async_step_init()
        cur = self._current().get(CONF_HOME) or ""
        return self.async_show_form(
            step_id="home",
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_HOME, default=cur if cur in {e.entry_id for e in hubs} else None): vol.In(
                        {e.entry_id: e.title for e in hubs}
                    )
                }
            ),
        )

    async def async_step_room(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        errors: dict[str, str] = {}
        trv = self._options.get(CONF_TRV) or self._current()[CONF_TRV]
        monitor = not trv
        if user_input is not None:
            flat = _flatten_room(user_input)
            errors = _validate_calibration(flat)
            if not errors:
                for key in (CONF_COMFORT_TEMP, CONF_FROST_TEMP, CONF_CALIBRATION_ENTITY):
                    flat.setdefault(key, None)
                self._options.update(flat)
                if monitor:
                    # Kein Gerät: keine Kalibrierung, keine Ausschaltart, keine Antwortzeit abfragen.
                    return self.create_room_options()
                return await self.async_step_technical()
        cur = self._current()
        if not cur.get(CONF_CALIBRATION_ENTITY):
            cur[CONF_CALIBRATION_ENTITY] = find_calibration_entity(self.hass, trv)
        return self.async_show_form(
            step_id="room",
            data_schema=_room_schema(cur, trv_presets(self.hass, trv), monitor=monitor),
            errors=errors,
            description_placeholders={"found": cur.get(CONF_CALIBRATION_ENTITY) or "–"},
        )

    def create_room_options(self) -> ConfigFlowResult:
        """Optionen speichern und dabei den Raumtyp nachziehen (auch ohne Thermostat)."""
        options = {**self.config_entry.options, **self._options}
        old_type = (self.config_entry.options or {}).get(CONF_ROOM_TYPE) or (
            self.config_entry.data or {}
        ).get(CONF_ROOM_TYPE)
        new_type = options.get(CONF_ROOM_TYPE)
        if new_type and new_type != old_type:
            options.update(retyped_values({**self.config_entry.data, **options}, old_type, new_type))
        return self.async_create_entry(data=options)

    async def async_step_technical(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        if user_input is not None:
            self._options.update(user_input)
            return self.create_room_options()
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

    async def async_step_hub_menu(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Rückfall, falls ein Werkzeug die Menüauswahl als Formular schickt."""
        choice = (user_input or {}).get("next_step_id")
        if choice == "notifications":
            return await self.async_step_notifications()
        if choice == "presence":
            return await self.async_step_presence()
        if choice == "season":
            return await self.async_step_season()
        return await self.async_step_init()

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
                CONF_VENT_FROM: user_input.get(CONF_VENT_FROM) or "08:00:00",
                CONF_VENT_TO: user_input.get(CONF_VENT_TO) or "21:00:00",
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
