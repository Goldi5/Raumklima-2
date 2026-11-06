"""Einstellungen sichern und wiederherstellen (ohne Passwörter – die liegen nicht in den Optionen)."""

from __future__ import annotations

import asyncio
from typing import Any

from homeassistant.components import websocket_api
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.util import dt as dt_util
import voluptuous as vol

from .const import CONF_ENTRY_TYPE, DEFAULTS, DOMAIN, ENTRY_HUB, HUB_DEFAULTS
from .msg import tr

FORMAT = 1
# Diese Felder gehören zur Installation, nicht zur Sicherung
SKIP = ("entry_id", "name")  # Identität: Räume werden über den Namen zugeordnet


def _entries(hass: HomeAssistant) -> tuple[ConfigEntry | None, list[ConfigEntry]]:
    hub: ConfigEntry | None = None
    rooms: list[ConfigEntry] = []
    for entry in hass.config_entries.async_entries(DOMAIN):
        if entry.data.get(CONF_ENTRY_TYPE) == ENTRY_HUB:
            hub = entry
        else:
            rooms.append(entry)
    return hub, rooms


def _clean(options: dict[str, Any], allowed: dict[str, Any]) -> dict[str, Any]:
    return {k: v for k, v in options.items() if (k in allowed or k in IDENTITY) and k not in SKIP}


# Diese Felder stehen in entry.data (Geräte des Raums), nicht in den Optionen
IDENTITY = (
    "trv",
    "temperature_sensor",
    "humidity_sensor",
    "co2_sensor",
    "window_sensors",
    "windows",
    "presence_sensors",
    "valve_sensor",
    "calibration_mode",
    "off_method",
    "room_type",
)


def _split(entry: ConfigEntry, values: dict[str, Any], allowed: dict[str, Any]) -> tuple[dict, dict]:
    """Werte aufteilen: Geräte gehören in entry.data, Einstellungen in die Optionen."""
    data_part: dict[str, Any] = {}
    opt_part: dict[str, Any] = {}
    for key, value in values.items():
        if key in SKIP:
            continue
        if key in entry.data:
            data_part[key] = value
        elif key in allowed:
            opt_part[key] = value
    return data_part, opt_part


def build_backup(hass: HomeAssistant) -> dict[str, Any]:
    """Sicherung als JSON-fähiges Wörterbuch."""
    hub, rooms = _entries(hass)
    return {
        "format": FORMAT,
        "created": dt_util.now().isoformat(timespec="minutes"),
        "hub": _clean(dict(hub.options), HUB_DEFAULTS) if hub is not None else {},
        "rooms": {
            entry.title: _clean({**dict(entry.data), **dict(entry.options)}, {**DEFAULTS, **dict(entry.data)})
            for entry in rooms
        },
    }


@websocket_api.websocket_command(
    {
        vol.Required("type"): "raumklima/backup/export",
        # Die Karte schickt immer die Wohnungs-Kennung mit. Fehlte sie im Schema,
        # lehnte Home Assistant die Nachricht mit "extra keys not allowed" ab –
        # genau daran scheiterte "Sichern" auf allen Geräten.
        vol.Optional("home"): str,
    }
)
@websocket_api.async_response
async def ws_export(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    """Alle Einstellungen als Sicherung ausgeben."""
    connection.send_result(msg["id"], {"backup": build_backup(hass)})


def apply_backup(hass: HomeAssistant, backup: Any) -> dict[str, Any]:
    """Sicherung einspielen – Räume werden über ihren Namen zugeordnet."""
    if not isinstance(backup, dict) or backup.get("format") not in (None, FORMAT):
        raise ValueError("format")

    hub, rooms = _entries(hass)
    hub_opts = backup.get("hub") or {}
    if hub is not None and isinstance(hub_opts, dict) and hub_opts:
        clean = _clean(hub_opts, HUB_DEFAULTS)
        hass.config_entries.async_update_entry(hub, options={**hub.options, **clean})

    wanted = backup.get("rooms") or {}
    applied: list[str] = []
    skipped: list[str] = []
    if isinstance(wanted, dict):
        by_title = {entry.title: entry for entry in rooms}
        for title, values in wanted.items():
            entry = by_title.get(title)
            if entry is None or not isinstance(values, dict):
                skipped.append(str(title))
                continue
            data_part, opt_part = _split(entry, values, DEFAULTS)
            hass.config_entries.async_update_entry(
                entry,
                data={**entry.data, **data_part} if data_part else entry.data,
                options={**entry.options, **opt_part},
            )
            applied.append(title)

    return {
        "hub": bool(hub_opts),
        "rooms": applied,
        "skipped": skipped,
        "message": tr("Sicherung eingespielt: {n} Räume", n=len(applied)),
    }


@websocket_api.websocket_command(
    {
        vol.Required("type"): "raumklima/backup/import",
        vol.Required("backup"): dict,
        vol.Optional("home"): str,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_import(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    """Sicherung einspielen (Antwort erst, wenn die Einträge neu geladen sind)."""
    try:
        result = apply_backup(hass, msg["backup"])
    except ValueError:
        connection.send_error(msg["id"], "invalid_format", tr("Diese Datei ist keine Raumklima-Sicherung"))
        return

    await asyncio.sleep(0)
    for entry in hass.config_entries.async_entries(DOMAIN):
        hass.async_create_task(hass.config_entries.async_reload(entry.entry_id))

    connection.send_result(msg["id"], result)


@callback
def async_register(hass: HomeAssistant) -> None:
    """Befehle anmelden."""
    websocket_api.async_register_command(hass, ws_export)
    websocket_api.async_register_command(hass, ws_import)
