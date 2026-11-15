"""Einstellungen sichern und wiederherstellen (ohne Passwörter – die liegen nicht in den Optionen)."""

from __future__ import annotations

import asyncio
from typing import Any

from homeassistant.components import websocket_api
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.util import dt as dt_util
import voluptuous as vol

from .const import CONF_ENTRY_TYPE, CONF_HOME, DEFAULTS, DOMAIN, ENTRY_HUB, HUB_DEFAULTS
from .msg import tr

FORMAT = 1
# Diese Felder gehören zur Installation, nicht zur Sicherung
SKIP = ("entry_id", "name")  # Identität: Räume werden über den Namen zugeordnet


def _entries(hass: HomeAssistant, home: str | None = None) -> tuple[ConfigEntry | None, list[ConfigEntry]]:
    """Zentrale einer Wohnung und ihre Räume.

    Früher: irgendeine (die zuletzt gefundene) Zentrale und alle Räume aller Wohnungen – bei
    zwei Wohnungen landeten Einstellungen der einen in der anderen.
    """
    from .shared import get_hub

    hubs = [e for e in hass.config_entries.async_entries(DOMAIN) if e.data.get(CONF_ENTRY_TYPE) == ENTRY_HUB]
    runtime = get_hub(hass, home)
    hub: ConfigEntry | None = runtime.entry if runtime is not None else (hubs[0] if hubs else None)
    if hub is None:
        return None, []
    hub_ids = {e.entry_id for e in hubs}
    is_default = _is_default(hass, hub)
    rooms: list[ConfigEntry] = []
    for entry in hass.config_entries.async_entries(DOMAIN):
        if entry.data.get(CONF_ENTRY_TYPE) == ENTRY_HUB:
            continue
        room_home = (entry.options or {}).get(CONF_HOME) or (entry.data or {}).get(CONF_HOME)
        if room_home not in hub_ids:
            room_home = None  # ohne (gültige) Zuordnung gehört der Raum zur Standard-Wohnung
        if room_home == hub.entry_id or (room_home is None and is_default):
            rooms.append(entry)
    return hub, rooms


def _is_default(hass: HomeAssistant, hub: ConfigEntry) -> bool:
    from .shared import get_hub

    default = get_hub(hass, None)
    return default is not None and default.entry.entry_id == hub.entry_id


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


def build_backup(hass: HomeAssistant, home: str | None = None) -> dict[str, Any]:
    """Sicherung einer Wohnung als JSON-fähiges Wörterbuch."""
    hub, rooms = _entries(hass, home)
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
    connection.send_result(msg["id"], {"backup": build_backup(hass, msg.get("home"))})


def apply_backup(hass: HomeAssistant, backup: Any, home: str | None = None) -> dict[str, Any]:
    """Sicherung in eine Wohnung einspielen – Räume dieser Wohnung über ihren Namen zugeordnet."""
    if not isinstance(backup, dict) or backup.get("format") not in (None, FORMAT):
        raise ValueError("format")

    hub, rooms = _entries(hass, home)
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
        result = apply_backup(hass, msg["backup"], msg.get("home"))
    except ValueError:
        connection.send_error(msg["id"], "invalid_format", tr("Diese Datei ist keine Raumklima-Sicherung"))
        return

    await asyncio.sleep(0)
    hub, rooms = _entries(hass, msg.get("home"))
    for entry in ([hub] if hub is not None else []) + rooms:
        hass.async_create_task(hass.config_entries.async_reload(entry.entry_id))

    connection.send_result(msg["id"], result)


@callback
def async_register(hass: HomeAssistant) -> None:
    """Befehle anmelden."""
    websocket_api.async_register_command(hass, ws_export)
    websocket_api.async_register_command(hass, ws_import)
