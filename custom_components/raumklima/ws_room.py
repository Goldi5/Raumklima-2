"""Karten-Schnittstelle: Raum – Einstellungen, Zurücksetzen, Boost, Lichttest, Darstellung."""

from __future__ import annotations

from types import MappingProxyType
from typing import Any

from homeassistant.components import websocket_api
from homeassistant.config_entries import ConfigEntry, ConfigEntryState
from homeassistant.core import HomeAssistant, callback
import voluptuous as vol

from .const import (
    CONF_CALIBRATION_MODE,
    CONF_COMFORT_TEMP,
    CONF_ENTRY_TYPE,
    CONF_EXTRA_TRVS,
    CONF_FLOOR_RETURN,
    CONF_FLOOR_SUPPLY,
    CONF_HOME,
    CONF_HUMIDITY_SENSOR,
    CONF_NAME,
    CONF_OFF_METHOD,
    CONF_PM25_SENSOR,
    CONF_ROOM_TYPE,
    CONF_SCHEDULES,
    CONF_SETBACK_LONG,
    CONF_SETBACK_SHORT,
    CONF_SHADING_COVERS,
    CONF_TEMP_SENSOR,
    CONF_TRV,
    CONF_WINDOWS,
    CONF_CO2_SENSOR,
    DEFAULTS,
    DOMAIN,
    ENTRY_HUB,
    LIGHT_SIGNALS,
)
from .msg import tr
from .retype import retyped_values
from .room_const import reset_room_options
from .shared import domain_data
from .ws_common import (
    ROOM_CHANGES,
    _hub_or_error,
)


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/boost",
        vol.Required("entry_id"): str,
        vol.Optional("mode", default="minutes"): vol.In(("minutes", "next", "unlimited", "off")),
        vol.Optional("minutes"): vol.All(vol.Coerce(int), vol.Range(5, 480)),
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_boost(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    """Boost setzen: feste Minuten, bis zum nächsten Zeitfenster, unbegrenzt oder beenden."""
    room = domain_data(hass)["rooms"].get(msg["entry_id"])
    if room is None:
        connection.send_error(msg["id"], "not_found", tr("Raum nicht gefunden"))
        return
    await room.async_boost(msg["mode"], msg.get("minutes"))
    connection.send_result(
        msg["id"],
        {
            "ok": True,
            "boost_until": room.boost_until.isoformat() if room.boost_until else None,
            "boost_open": bool(room.boost_open),
            "boost_active": room.boost_active,
        },
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/room/update",
        vol.Required("entry_id"): str,
        vol.Required("changes"): dict,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_room_update(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    entry = hass.config_entries.async_get_entry(msg["entry_id"])
    if entry is None or entry.domain != DOMAIN:
        connection.send_error(msg["id"], "not_found", tr("Raum nicht gefunden"))
        return
    try:
        changes = ROOM_CHANGES(msg["changes"])
    except vol.Invalid as err:
        connection.send_error(msg["id"], "invalid", str(err))
        return
    # Raumtyp geändert: Standardwerte des neuen Typs übernehmen, eigene Werte behalten
    adjusted: dict[str, float] = {}
    if CONF_ROOM_TYPE in changes:
        old_type = (entry.options or {}).get(CONF_ROOM_TYPE) or (entry.data or {}).get(CONF_ROOM_TYPE)
        if changes[CONF_ROOM_TYPE] != old_type:
            merged = {**(entry.data or {}), **(entry.options or {})}
            adjusted = retyped_values(merged, old_type, changes[CONF_ROOM_TYPE])
            changes = {**adjusted, **changes}
    hass.config_entries.async_update_entry(entry, options={**entry.options, **changes})
    room = domain_data(hass)["rooms"].get(entry.entry_id)
    live = room is not None and room.apply_live_options(changes)
    if not live:
        await hass.config_entries.async_reload(entry.entry_id)
    result: dict[str, Any] = {"ok": True, "reloaded": not live}
    if adjusted:
        result["adjusted"] = adjusted  # nur wenn der Raumtyp Werte nachgezogen hat
    connection.send_result(msg["id"], result)


@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/layout/get", vol.Optional("home"): vol.Any(None, str)}
)
@websocket_api.async_response
async def ws_layout_get(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    """Darstellung (Reihenfolge, ausgeblendet, Größe, Farbe) einer Wohnung lesen."""
    from .layout import layout_for

    home = msg.get("home")
    if home is None:
        hub = _hub_or_error(hass, connection, msg)
        if hub is None:
            return
        home = hub.entry.entry_id
    connection.send_result(msg["id"], {"home": home, "layout": layout_for(hass, home)})


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/layout/save",
        vol.Required("layout"): dict,
        vol.Optional("home"): vol.Any(None, str),
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_layout_save(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    """Darstellung einer Wohnung speichern."""
    from .layout import async_save

    home = msg.get("home")
    if home is None:
        hub = _hub_or_error(hass, connection, msg)
        if hub is None:
            return
        home = hub.entry.entry_id
    saved = await async_save(hass, home, msg["layout"])
    connection.send_result(msg["id"], {"home": home, "layout": saved})


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/room/resume",
        vol.Required("entry_id"): str,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_room_resume(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    """Handverstellung beenden und Zeitplan/Automatik sofort fortsetzen."""
    room = domain_data(hass)["rooms"].get(msg["entry_id"])
    if room is None:
        connection.send_error(msg["id"], "not_found", tr("Raum nicht gefunden"))
        return
    await room.async_resume_manual()
    connection.send_result(msg["id"], {"ok": True, "override_until": None})


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/room/create",
        vol.Required("name"): str,
        vol.Required("temperature_sensor"): str,
        vol.Optional("trv", default=""): str,
        vol.Optional("home", default=""): str,
        vol.Optional("room_type", default="living"): str,
        vol.Optional("humidity_sensor"): vol.Any(None, str),
        vol.Optional("co2_sensor"): vol.Any(None, str),
        vol.Optional("pm25_sensor"): vol.Any(None, str),
        vol.Optional("window_sensors", default=[]): [str],
        vol.Optional("shading_covers", default=[]): [str],
        vol.Optional("floor_supply"): vol.Any(None, str),
        vol.Optional("floor_return"): vol.Any(None, str),
        vol.Optional("extra_trvs", default=[]): [str],
        vol.Optional("comfort_temperature"): vol.Any(None, vol.Coerce(float)),
        vol.Optional("setback_short"): vol.Any(None, vol.Coerce(float)),
        vol.Optional("setback_long"): vol.Any(None, vol.Coerce(float)),
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_room_create(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    """Raum direkt in der Integration anlegen – ohne HA-Einstellungen."""
    trv = str(msg.get("trv") or "").strip()
    temp = str(msg["temperature_sensor"]).strip()
    name = str(msg["name"]).strip()
    if not name or not temp:
        connection.send_error(msg["id"], "invalid", tr("Name und Temperaturfühler sind erforderlich"))
        return
    unique_id = trv or f"monitor:{temp}"
    for entry in hass.config_entries.async_entries(DOMAIN):
        if entry.data.get(CONF_ENTRY_TYPE) == ENTRY_HUB:
            continue
        if entry.unique_id == unique_id or entry.data.get(CONF_TRV) == trv and trv:
            connection.send_error(msg["id"], "already_configured", tr("Dieses Thermostat ist schon einem Raum zugeordnet."))
            return
    home = str(msg.get("home") or "").strip()
    if not home:
        hubs = [e for e in hass.config_entries.async_entries(DOMAIN) if e.data.get(CONF_ENTRY_TYPE) == ENTRY_HUB]
        if not hubs:
            connection.send_error(msg["id"], "no_home", tr("Bitte zuerst eine Wohnung anlegen."))
            return
        home = hubs[0].entry_id
    data = {
        CONF_NAME: name,
        CONF_TRV: trv,
        CONF_TEMP_SENSOR: temp,
        CONF_HUMIDITY_SENSOR: msg.get("humidity_sensor") or None,
        CONF_CO2_SENSOR: msg.get("co2_sensor") or None,
        CONF_PM25_SENSOR: msg.get("pm25_sensor") or None,
        CONF_WINDOWS: list(msg.get("window_sensors") or []),
        CONF_SHADING_COVERS: list(msg.get("shading_covers") or []),
        CONF_FLOOR_SUPPLY: msg.get("floor_supply") or "",
        CONF_FLOOR_RETURN: msg.get("floor_return") or "",
        CONF_ROOM_TYPE: str(msg.get("room_type") or "living"),
        CONF_CALIBRATION_MODE: "target" if trv else "none",
        CONF_OFF_METHOD: "auto",
        CONF_HOME: home,
        CONF_EXTRA_TRVS: list(msg.get("extra_trvs") or []),
        CONF_SCHEDULES: [],
    }
    options = dict(DEFAULTS)
    for key in (CONF_COMFORT_TEMP, CONF_SETBACK_SHORT, CONF_SETBACK_LONG):
        if msg.get(key) is not None:
            options[key] = msg[key]
    entry = ConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title=name,
        data=data,
        options=options,
        unique_id=unique_id,
        source="user",
        discovery_keys=MappingProxyType({}),
        subentries_data=None,
    )
    try:
        await hass.config_entries.async_add(entry)
        await hass.async_block_till_done()
    except Exception as err:  # noqa: BLE001
        connection.send_error(msg["id"], "create_failed", str(err))
        return
    connection.send_result(msg["id"], {"ok": True, "entry_id": entry.entry_id, "title": name})


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/room/delete",
        vol.Required("entry_id"): str,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_room_delete(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    """Raum aus der Integration entfernen."""
    entry = hass.config_entries.async_get_entry(msg["entry_id"])
    if entry is None or entry.domain != DOMAIN or entry.data.get(CONF_ENTRY_TYPE) == ENTRY_HUB:
        connection.send_error(msg["id"], "not_found", tr("Raum nicht gefunden"))
        return
    try:
        await hass.config_entries.async_remove(entry.entry_id)
        await hass.async_block_till_done()
    except Exception as err:  # noqa: BLE001
        connection.send_error(msg["id"], "delete_failed", str(err))
        return
    connection.send_result(msg["id"], {"ok": True})


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/room/reset",
        vol.Required("entry_id"): str,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_room_reset(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    """Raum-Einstellungen auf die Standardwerte zurückstellen (Geräte bleiben)."""
    entry = hass.config_entries.async_get_entry(msg["entry_id"])
    if entry is None or entry.domain != DOMAIN:
        connection.send_error(msg["id"], "not_found", tr("Raum nicht gefunden"))
        return
    options = reset_room_options(dict(entry.options or {}))
    hass.config_entries.async_update_entry(entry, options=options)
    await hass.config_entries.async_reload(entry.entry_id)
    connection.send_result(msg["id"], {"ok": True})


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/room/light_test",
        vol.Required("entry_id"): str,
        vol.Optional("signal", default="open"): vol.In(LIGHT_SIGNALS),
    }
)
@websocket_api.require_admin
@callback
def ws_light_test(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    room = domain_data(hass)["rooms"].get(msg["entry_id"])
    if room is None:
        connection.send_error(msg["id"], "not_found", tr("Raum nicht gefunden"))
        return
    if not room.lights.start(msg["signal"]):
        connection.send_error(msg["id"], "no_lights", tr("Keine Lampe gewählt"))
        return
    connection.send_result(msg["id"], {"ok": True})


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/room/why", vol.Required("entry_id"): str})
@callback
def ws_room_why(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    """„Warum heizt der Raum (nicht)?“ – Voraussetzungen und Regelkette (nur lesen)."""
    room = domain_data(hass)["rooms"].get(msg["entry_id"])
    if room is None:
        connection.send_error(msg["id"], "not_found", tr("Raum nicht gefunden"))
        return
    connection.send_result(msg["id"], room.explain())
