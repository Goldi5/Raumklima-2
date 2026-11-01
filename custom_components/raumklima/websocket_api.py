"""WebSocket-Schnittstelle für die Einstellungs-Karte im Dashboard."""

from __future__ import annotations

from typing import Any

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
import voluptuous as vol

from .const import (
    BUILDING_TYPES,
    CONF_AWAY_DELAY,
    CONF_BUILDING,
    CONF_COLD_SNAP_TEMP,
    CONF_COMFORT_TEMP,
    CONF_FROST_FLOOR,
    CONF_HEATING_LIMIT,
    CONF_HOME,
    CONF_LONG_AWAY_HOURS,
    CONF_NIGHT_AIRING,
    CONF_NIGHT_ALARM,
    CONF_NIGHT_END,
    CONF_NIGHT_START,
    CONF_PREHEAT_KM,
    CONF_RECIPIENTS,
    CONF_RESIDENTS,
    CONF_ROOM_TYPE,
    CONF_SEASON_END,
    CONF_SEASON_MODE,
    CONF_SEASON_START,
    CONF_SETBACK_LONG,
    CONF_SETBACK_SHORT,
    CONF_TTS,
    CONF_VALVE_CARE,
    CONF_VIRTUAL_WINDOW,
    CONF_WINDOW_CLOSE_DELAY,
    CONF_WINDOW_OPEN_DELAY,
    CONF_ZONE,
    DOMAIN,
    HUB_DEFAULTS,
    KINDS,
    ROOM_TYPE_OPTIONS,
    SEASON_MODES,
)
from .decision_log import CATEGORIES
from .holidays_de import STATES
from .hub import RaumklimaHub, all_hubs, domain_data, get_hub
from .planning import NIGHT_MODES, VIRT_MODES

_KINDS = [vol.In(KINDS)]
_TARGETS = vol.Schema({str: _KINDS})


def _hub_or_error(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> RaumklimaHub | None:
    """Zentrale der gewünschten Wohnung – oder Fehler an die Karte senden."""
    hub = get_hub(hass, msg.get("home"))
    if hub is None:
        connection.send_error(msg["id"], "no_hub", "Raumklima Allgemein ist nicht eingerichtet")
    return hub

def _md(value: Any) -> str:
    """'MM-TT' prüfen (Saisonbeginn/-ende)."""
    text = str(value)
    month, _, day = text.partition("-")
    if not (month.isdigit() and day.isdigit() and 1 <= int(month) <= 12 and 1 <= int(day) <= 31):
        raise vol.Invalid("Format MM-TT erwartet")
    return f"{int(month):02d}-{int(day):02d}"


def _time(value: Any) -> str:
    """'HH:MM' oder 'HH:MM:SS' prüfen."""
    parts = str(value).split(":")
    if len(parts) not in (2, 3) or not all(p.isdigit() for p in parts):
        raise vol.Invalid("Format HH:MM erwartet")
    h, m = int(parts[0]), int(parts[1])
    if not (0 <= h < 24 and 0 <= m < 60):
        raise vol.Invalid("Ungültige Uhrzeit")
    return f"{h:02d}:{m:02d}:00"


HUB_CHANGES = vol.Schema(
    {
        vol.Optional(CONF_RECIPIENTS): _TARGETS,
        vol.Optional(CONF_TTS): _TARGETS,
        vol.Optional("quiet_start"): _time,
        vol.Optional("quiet_end"): _time,
        vol.Optional("quiet_end_weekend"): _time,
        vol.Optional("learn_times"): bool,
        vol.Optional("name"): str,
        vol.Optional("dashboard"): str,
        vol.Optional("holiday_state"): vol.Any(None, vol.In(["", *STATES])),
        vol.Optional("sleep_signals"): [str],
        vol.Optional("repeat_minutes"): vol.All(vol.Coerce(float), vol.Range(1, 120)),
        vol.Optional("weather_entity"): vol.Any(None, str),
        vol.Optional("notify_on_failure"): bool,
        vol.Optional(CONF_RESIDENTS): [str],
        vol.Optional(CONF_ZONE): vol.Any(None, str),
        vol.Optional(CONF_AWAY_DELAY): vol.All(vol.Coerce(float), vol.Range(0, 600)),
        vol.Optional(CONF_LONG_AWAY_HOURS): vol.All(vol.Coerce(float), vol.Range(1, 720)),
        vol.Optional(CONF_PREHEAT_KM): vol.All(vol.Coerce(float), vol.Range(0, 500)),
        vol.Optional(CONF_BUILDING): vol.In(BUILDING_TYPES),
        vol.Optional(CONF_SEASON_MODE): vol.In(SEASON_MODES),
        vol.Optional(CONF_SEASON_START): _md,
        vol.Optional(CONF_SEASON_END): _md,
        vol.Optional(CONF_HEATING_LIMIT): vol.All(vol.Coerce(float), vol.Range(5, 25)),
        vol.Optional(CONF_COLD_SNAP_TEMP): vol.All(vol.Coerce(float), vol.Range(0, 20)),
        vol.Optional(CONF_FROST_FLOOR): vol.All(vol.Coerce(float), vol.Range(5, 20)),
        vol.Optional(CONF_VALVE_CARE): bool,
        vol.Optional(CONF_NIGHT_START): _time,
        vol.Optional(CONF_NIGHT_END): _time,
        vol.Optional(CONF_NIGHT_ALARM): vol.All(vol.Coerce(float), vol.Range(5, 20)),
    }
)

ROOM_CHANGES = vol.Schema(
    {
        vol.Optional(CONF_COMFORT_TEMP): vol.Any(None, vol.All(vol.Coerce(float), vol.Range(12, 26))),
        vol.Optional(CONF_ROOM_TYPE): vol.In(ROOM_TYPE_OPTIONS),
        vol.Optional(CONF_SETBACK_SHORT): vol.All(vol.Coerce(float), vol.Range(10, 24)),
        vol.Optional(CONF_SETBACK_LONG): vol.All(vol.Coerce(float), vol.Range(8, 22)),
        vol.Optional(CONF_WINDOW_OPEN_DELAY): vol.All(vol.Coerce(float), vol.Range(0, 600)),
        vol.Optional(CONF_WINDOW_CLOSE_DELAY): vol.All(vol.Coerce(float), vol.Range(0, 600)),
        vol.Optional(CONF_NIGHT_AIRING): vol.In(NIGHT_MODES),
        vol.Optional(CONF_VIRTUAL_WINDOW): vol.In(VIRT_MODES),
        vol.Optional(CONF_HOME): vol.Any(None, str),
    }
)


@callback
def async_register_websocket(hass: HomeAssistant) -> None:
    for handler in (ws_config, ws_hub_update, ws_room_update, ws_notify_test, ws_hub_action, ws_report, ws_log, ws_log_subscribe, ws_home_create):
        websocket_api.async_register_command(hass, handler)


def _choices(hass: HomeAssistant) -> dict[str, Any]:
    services = hass.services.async_services().get("notify", {})
    notify = sorted(
        f"notify.{name}" for name in services if name not in ("send_message", "persistent_notification")
    )
    def ents(domain: str) -> list[dict[str, str]]:
        return sorted(
            ({"id": s.entity_id, "name": s.name} for s in hass.states.async_all(domain)),
            key=lambda x: x["name"].lower(),
        )
    return {
        "notify": notify,
        "persons": ents("person"),
        "zones": ents("zone"),
        "weather": ents("weather"),
        "signals": ents("light") + ents("switch") + ents("input_boolean"),
        "states": [{"id": k, "name": v} for k, v in STATES.items()],
    }


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/config", vol.Optional("home"): vol.Any(None, str)})
@callback
def ws_config(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    hub = get_hub(hass, msg.get("home"))
    rooms = []
    for entry_id, room in domain_data(hass)["rooms"].items():
        rooms.append(
            {
                "entry_id": entry_id,
                "title": room.entry.title,
                "options": {**room.entry.data, **room.entry.options},
                "setback_short": room.setback_short,
                "setback_long": room.setback_long,
                "comfort_temperature": room.comfort_temp,
            }
        )
    connection.send_result(
        msg["id"],
        {
            "hub": (
                {
                    "entry_id": hub.entry.entry_id,
                    "options": {**HUB_DEFAULTS, **hub.entry.options},
                    "state": hub.summary(),
                }
                if hub
                else None
            ),
            "rooms": rooms,
            "homes": [
                {"entry_id": h.entry.entry_id, "name": h.name, "default": h.is_default, "dashboard": h.dashboard,
                 "rooms": list(h.rooms)}
                for h in all_hubs(hass)
            ],
            "kinds": KINDS,
            "choices": _choices(hass),
            "admin": connection.user.is_admin,
        },
    )


@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/hub/update", vol.Optional("home"): vol.Any(None, str), vol.Required("changes"): dict}
)
@websocket_api.require_admin
@callback
def ws_hub_update(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    hub = _hub_or_error(hass, connection, msg)
    if hub is None:
        return
    try:
        changes = HUB_CHANGES(msg["changes"])
    except vol.Invalid as err:
        connection.send_error(msg["id"], "invalid", str(err))
        return
    entry = hub.entry
    hass.config_entries.async_update_entry(entry, options={**entry.options, **changes})
    connection.send_result(msg["id"], {"ok": True})


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
        connection.send_error(msg["id"], "not_found", "Raum nicht gefunden")
        return
    try:
        changes = ROOM_CHANGES(msg["changes"])
    except vol.Invalid as err:
        connection.send_error(msg["id"], "invalid", str(err))
        return
    hass.config_entries.async_update_entry(entry, options={**entry.options, **changes})
    room = domain_data(hass)["rooms"].get(entry.entry_id)
    live = room is not None and room.apply_live_options(changes)
    if not live:
        await hass.config_entries.async_reload(entry.entry_id)
    connection.send_result(msg["id"], {"ok": True, "reloaded": not live})


@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/notify/test", vol.Optional("home"): vol.Any(None, str), vol.Required("target"): str}
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_notify_test(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    hub = _hub_or_error(hass, connection, msg)
    if hub is None:
        return
    try:
        await hub.async_test(msg["target"])
    except Exception as err:  # noqa: BLE001
        connection.send_error(msg["id"], "failed", str(err))
        return
    connection.send_result(msg["id"], {"ok": True})


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/hub/action", vol.Optional("home"): vol.Any(None, str),
        vol.Required("action"): vol.In(["heat_today", "cancel_heat_today", "vacation", "guests"]),
        vol.Optional("value"): bool,
    }
)
@websocket_api.require_admin
@callback
def ws_hub_action(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    hub = _hub_or_error(hass, connection, msg)
    if hub is None:
        return
    action = msg["action"]
    if action == "heat_today":
        hub.heat_today()
    elif action == "cancel_heat_today":
        hub.cancel_heat_today()
    elif action == "vacation":
        hub.set_vacation(bool(msg.get("value", True)))
    elif action == "guests":
        hub.set_guests(bool(msg.get("value", True)))
    connection.send_result(msg["id"], {"ok": True})


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/report", vol.Optional("home"): vol.Any(None, str)})
@callback
def ws_report(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    hub = _hub_or_error(hass, connection, msg)
    if hub is None:
        return
    connection.send_result(msg["id"], {**hub.insights.report(), "issues": hub.insights.all_issues()})


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/log", vol.Optional("home"): vol.Any(None, str),
        vol.Optional("limit", default=300): vol.All(vol.Coerce(int), vol.Range(1, 2000)),
        vol.Optional("before"): vol.Coerce(int),
        vol.Optional("after"): vol.Coerce(int),
        vol.Optional("entry_id"): str,
        vol.Optional("categories"): [vol.In(CATEGORIES)],
    }
)
@callback
def ws_log(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    """Entscheidungsprotokoll, neueste zuerst."""
    hub = _hub_or_error(hass, connection, msg)
    if hub is None:
        return
    entries = hub.log.query(
        limit=msg["limit"], before=msg.get("before"), after=msg.get("after"), entry_id=msg.get("entry_id"),
        categories=msg.get("categories")
    )
    connection.send_result(msg["id"], {"entries": entries, "categories": CATEGORIES})


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/log/subscribe", vol.Optional("home"): vol.Any(None, str)})
@callback
def ws_log_subscribe(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    """Neue Protokolleinträge live schicken."""
    hub = _hub_or_error(hass, connection, msg)
    if hub is None:
        return

    @callback
    def forward(entry: dict) -> None:
        connection.send_message(websocket_api.event_message(msg["id"], entry))

    connection.subscriptions[msg["id"]] = hub.log.subscribe(forward)
    connection.send_result(msg["id"])


@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/home/create", vol.Required("name"): vol.All(str, vol.Length(min=1, max=40))}
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_home_create(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    """Weitere Wohnung (eigene Zentrale) anlegen."""
    from homeassistant.config_entries import SOURCE_IMPORT

    default = get_hub(hass)
    inherit = {}
    if default is not None:
        # Empfänger und Wetter als Startwert übernehmen – pro Wohnung später änderbar
        for key in ("recipients", "tts", "quiet_start", "quiet_end", "quiet_end_weekend", "weather_entity"):
            inherit[key] = default.opt(key)
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": SOURCE_IMPORT}, data={**inherit, "home_name": msg["name"].strip()}
    )
    if result.get("type") != "create_entry":
        connection.send_error(msg["id"], "exists", "Diese Wohnung gibt es schon")
        return
    connection.send_result(msg["id"], {"entry_id": result["result"].entry_id})
