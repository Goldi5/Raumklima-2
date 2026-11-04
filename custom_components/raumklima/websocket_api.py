"""WebSocket-Schnittstelle für die Einstellungs-Karte im Dashboard."""

from __future__ import annotations

from typing import Any

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
from homeassistant.util import dt as dt_util
import voluptuous as vol

from .const import (
    BOOST_MINUTES_MAX,
    BOOST_MINUTES_MIN,
    BOOST_TEMP_MAX,
    BOOST_TEMP_MIN,
    BUILDING_TYPES,
    CONF_AIRING_OCCUPIED_ONLY,
    CONF_AIRING_WINDOWS,
    CONF_AWAY_DELAY,
    CONF_BOOST_MINUTES,
    CONF_BOOST_TEMP,
    CONF_BUILDING,
    CONF_CALENDAR,
    CONF_CALENDAR_AWAY,
    CONF_CALENDAR_HOME,
    CONF_COLD_SNAP_TEMP,
    CONF_COMFORT_TEMP,
    CONF_FAST_POLL,
    CONF_FROST_FLOOR,
    CONF_FROST_NIGHT,
    CONF_GUESTS_ROOMS,
    CONF_HEATING_LIMIT,
    CONF_HOME,
    CONF_HOME_SENSORS,
    CONF_LATITUDE,
    CONF_LEARN_AIRING,
    CONF_LEARN_SHIFT,
    CONF_LIGHT_SIGNALS,
    CONF_LIGHTS,
    CONF_LONG_AIRING,
    CONF_LONG_AIRING_REMIND,
    CONF_LONG_AWAY_HOURS,
    CONF_LONGITUDE,
    CONF_NIGHT_AIRING,
    CONF_NIGHT_ALARM,
    CONF_NIGHT_END,
    CONF_NIGHT_START,
    CONF_NOTIFY_PRESENT_ONLY,
    CONF_ON_PRESET,
    CONF_OVERRIDE_MINUTES,
    CONF_PREHEAT_KM,
    CONF_PRESENCE,
    CONF_PRESENCE_KIND,
    CONF_QUIET_SETBACK,
    CONF_RECIPIENTS,
    CONF_RESIDENTS,
    CONF_ROOM_ECO,
    CONF_ROOM_ECO_AFTER,
    CONF_ROOM_ECO_DROP,
    CONF_ROOM_TYPE,
    CONF_SCHEDULES,
    CONF_SEASON_END,
    CONF_SEASON_MODE,
    CONF_SEASON_START,
    CONF_SETBACK_LONG,
    CONF_SETBACK_SHORT,
    CONF_SOLAR,
    CONF_SOLAR_FACADE,
    CONF_TTS,
    CONF_VALVE_CARE,
    CONF_VIRTUAL_WINDOW,
    CONF_WINDOW_CLOSE_DELAY,
    CONF_WINDOW_OPEN_DELAY,
    CONF_ZONE,
    DEFAULTS,
    DOMAIN,
    HOME_SENSOR_MODES,
    HUB_DEFAULTS,
    KINDS,
    LIGHT_SIGNALS,
    PRESENCE_KINDS,
    ROOM_ECO_MODES,
    ROOM_TYPE_OPTIONS,
    SCHEDULE_MAX,
    SCHEDULE_TEMP_MAX,
    SCHEDULE_TEMP_MIN,
    SEASON_MODES,
    SOLAR_FACADE_OPTIONS,
)
from .decision_log import CATEGORIES
from .holidays_de import STATES
from .hub import RaumklimaHub
from .mailer import (
    BUILTIN as MAIL_BUILTIN,
    MAIL_KEYS,
    SECURITY as MAIL_SECURITY,
    MailError,
    recipients,
    send as mail_send,
    verify as mail_verify,
)
from .msg import tr
from .notify_targets import notify_choices
from .occupancy import sensor_kind
from .planning import NIGHT_MODES, VIRT_MODES
from .report_data import REPORT_KINDS
from .reports import CONF_REPORT_EMAIL, CONF_REPORT_PDF, URL as REPORT_URL
from .shared import all_hubs, domain_data, get_hub

_KINDS = [vol.In(KINDS)]
_TARGETS = vol.Schema({str: _KINDS})


def _hub_or_error(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> RaumklimaHub | None:
    """Zentrale der gewünschten Wohnung – oder Fehler an die Karte senden."""
    hub = get_hub(hass, msg.get("home"))
    if hub is None:
        connection.send_error(msg["id"], "no_hub", tr("Raumklima Allgemein ist nicht eingerichtet"))
    return hub

def _md(value: Any) -> str:
    """'MM-TT' prüfen (Saisonbeginn/-ende)."""
    text = str(value)
    month, _, day = text.partition("-")
    if not (month.isdigit() and day.isdigit() and 1 <= int(month) <= 12 and 1 <= int(day) <= 31):
        raise vol.Invalid(tr("Format MM-TT erwartet"))
    return f"{int(month):02d}-{int(day):02d}"


def _time(value: Any) -> str:
    """'HH:MM' oder 'HH:MM:SS' prüfen."""
    parts = str(value).split(":")
    if len(parts) not in (2, 3) or not all(p.isdigit() for p in parts):
        raise vol.Invalid(tr("Format HH:MM erwartet"))
    h, m = int(parts[0]), int(parts[1])
    if not (0 <= h < 24 and 0 <= m < 60):
        raise vol.Invalid(tr("Ungültige Uhrzeit"))
    return f"{h:02d}:{m:02d}:00"


HUB_CHANGES = vol.Schema(
    {
        vol.Optional(CONF_RECIPIENTS): _TARGETS,
        vol.Optional(CONF_TTS): _TARGETS,
        vol.Optional(CONF_NOTIFY_PRESENT_ONLY): bool,
        vol.Optional("quiet_start"): _time,
        vol.Optional("quiet_end"): _time,
        vol.Optional("quiet_end_weekend"): _time,
        vol.Optional("learn_times"): bool,
        vol.Optional(CONF_LEARN_SHIFT): bool,
        vol.Optional(CONF_QUIET_SETBACK): bool,
        vol.Optional("name"): str,
        vol.Optional("dashboard"): str,
        vol.Optional("holiday_state"): vol.Any(None, vol.In(["", *STATES])),
        vol.Optional("sleep_signals"): [str],
        vol.Optional("repeat_minutes"): vol.All(vol.Coerce(float), vol.Range(1, 120)),
        vol.Optional(CONF_GUESTS_ROOMS): vol.All([str], vol.Length(max=30)),
        vol.Optional("weather_entity"): vol.Any(None, str),
        vol.Optional("notify_on_failure"): bool,
        vol.Optional(CONF_RESIDENTS): [str],
        vol.Optional(CONF_ZONE): vol.Any(None, str),
        vol.Optional(CONF_AWAY_DELAY): vol.All(vol.Coerce(float), vol.Range(0, 600)),
        vol.Optional(CONF_LONG_AWAY_HOURS): vol.All(vol.Coerce(float), vol.Range(1, 720)),
        vol.Optional(CONF_PREHEAT_KM): vol.All(vol.Coerce(float), vol.Range(0, 500)),
        vol.Optional(CONF_LATITUDE): vol.Any(None, vol.All(vol.Coerce(float), vol.Range(-90, 90))),
        vol.Optional(CONF_LONGITUDE): vol.Any(None, vol.All(vol.Coerce(float), vol.Range(-180, 180))),
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
        vol.Optional(CONF_CALENDAR): vol.Any(None, str),
        vol.Optional(CONF_CALENDAR_AWAY): vol.All(str, vol.Length(max=300)),
        vol.Optional(CONF_CALENDAR_HOME): vol.All(str, vol.Length(max=300)),
        vol.Optional(CONF_FROST_NIGHT): bool,
        vol.Optional(CONF_HOME_SENSORS): vol.In(HOME_SENSOR_MODES),
        vol.Optional(CONF_REPORT_PDF): [vol.In(REPORT_KINDS)],
        vol.Optional(CONF_REPORT_EMAIL): vol.Any(None, MAIL_BUILTIN, vol.Match(r"^notify\.\w+$")),
        vol.Optional("mail_server"): vol.All(str, vol.Length(max=200)),
        vol.Optional("mail_port"): vol.Any(None, vol.All(vol.Coerce(int), vol.Range(1, 65535))),
        vol.Optional("mail_security"): vol.In(MAIL_SECURITY),
        vol.Optional("mail_user"): vol.All(str, vol.Length(max=200)),
        vol.Optional("mail_password"): vol.All(str, vol.Length(max=300)),
        vol.Optional("mail_from"): vol.All(str, vol.Length(max=200)),
        vol.Optional("mail_to"): vol.All(str, vol.Length(max=500)),
        vol.Optional("annual_cost"): vol.Any(None, vol.All(vol.Coerce(float), vol.Range(0, 20000))),
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
        vol.Optional(CONF_SOLAR): bool,
        vol.Optional(CONF_SOLAR_FACADE): vol.In(SOLAR_FACADE_OPTIONS),
        vol.Optional(CONF_LIGHTS): vol.All([vol.Match(r"^light\.")], vol.Length(max=10)),
        vol.Optional(CONF_LIGHT_SIGNALS): [vol.In(LIGHT_SIGNALS)],
        vol.Optional(CONF_PRESENCE): vol.All([vol.Match(r"^binary_sensor\.")], vol.Length(max=6)),
        vol.Optional(CONF_PRESENCE_KIND): vol.In(PRESENCE_KINDS),
        vol.Optional(CONF_ROOM_ECO): vol.In(ROOM_ECO_MODES),
        vol.Optional(CONF_ROOM_ECO_AFTER): vol.All(vol.Coerce(float), vol.Range(5, 240)),
        vol.Optional(CONF_ROOM_ECO_DROP): vol.All(vol.Coerce(float), vol.Range(0.5, 4)),
        # Zeitpläne: {days: [0..6], start: "HH:MM", end: "HH:MM", temperature: °C}
        vol.Optional(CONF_SCHEDULES): vol.Any(
            None,
            vol.All(
                [
                    {
                        vol.Required("start"): vol.Match(r"^\d{1,2}:\d{2}$"),
                        vol.Required("end"): vol.Match(r"^\d{1,2}:\d{2}$"),
                        vol.Required("temperature"): vol.All(
                            vol.Coerce(float), vol.Range(SCHEDULE_TEMP_MIN, SCHEDULE_TEMP_MAX)
                        ),
                        vol.Optional("days", default=[]): [
                            vol.All(vol.Coerce(int), vol.Range(0, 6))
                        ],
                    }
                ],
                vol.Length(max=SCHEDULE_MAX),
            ),
        ),
        vol.Optional(CONF_ON_PRESET): vol.Any(None, str),
        vol.Optional(CONF_BOOST_TEMP): vol.All(vol.Coerce(float), vol.Range(BOOST_TEMP_MIN, BOOST_TEMP_MAX)),
        vol.Optional(CONF_BOOST_MINUTES): vol.All(vol.Coerce(int), vol.Range(BOOST_MINUTES_MIN, BOOST_MINUTES_MAX)),
        # Lüften ohne Erinnerung: Dauerlüftung, Zeitfenster, gewohntes Lüften
        vol.Optional(CONF_LONG_AIRING): vol.All(vol.Coerce(float), vol.Range(0, 180)),
        vol.Optional(CONF_LONG_AIRING_REMIND): vol.All(vol.Coerce(float), vol.Range(0, 240)),
        vol.Optional(CONF_LEARN_AIRING): vol.Boolean(),
        vol.Optional(CONF_FAST_POLL): vol.Boolean(),
        vol.Optional(CONF_AIRING_OCCUPIED_ONLY): vol.Boolean(),
        vol.Optional(CONF_OVERRIDE_MINUTES): vol.All(vol.Coerce(float), vol.Range(0, 480)),
        vol.Optional(CONF_AIRING_WINDOWS): vol.Any(
            None,
            vol.All(
                [
                    {
                        vol.Required("start"): vol.Match(r"^\d{1,2}:\d{2}$"),
                        vol.Required("end"): vol.Match(r"^\d{1,2}:\d{2}$"),
                        vol.Optional("days", default=[]): [vol.All(vol.Coerce(int), vol.Range(0, 6))],
                    }
                ],
                vol.Length(max=6),
            ),
        ),
    }
)


@callback
def async_register_websocket(hass: HomeAssistant) -> None:
    for handler in (ws_config, ws_hub_update, ws_dashboards, ws_layout_get, ws_layout_save, ws_room_update, ws_room_reset, ws_notify_test, ws_mail_test, ws_light_test, ws_hub_action, ws_report, ws_report_export, ws_pdf_list, ws_pdf_create, ws_log, ws_log_subscribe, ws_home_create, ws_diagnostics):
        websocket_api.async_register_command(hass, handler)


MAIL_PLATFORMS = ("smtp", "google_mail", "mailgun", "sendgrid")


def _mail_services(hass: HomeAssistant) -> list[str]:
    """Nur echte Mail-Dienste (SMTP & Co.) – nicht Alexa, Handys oder Fernseher."""
    try:
        from homeassistant.components.notify.legacy import NOTIFY_SERVICES
    except ImportError:  # ältere/neuere HA-Version
        return []
    services = hass.data.get(NOTIFY_SERVICES, {})
    out = []
    for platform in MAIL_PLATFORMS:
        for svc in services.get(platform, []):
            name = getattr(svc, "_service_name", None)
            if name:
                out.append(f"notify.{name}")
    return sorted(set(out))


def _known_dashboards(hass: HomeAssistant) -> list[str]:
    """Alle Dashboards, die Home Assistant kennt (auch ohne Seitenleiste).

    Die Karte kann sich nicht auf ``hass.dashboards`` verlassen – je nach Stand und
    Benutzer ist die Liste im Browser leer, dann wäre der Wohnungs-Umschalter dauerhaft
    ausgegraut. Hier fragen wir die Wahrheit der Zentrale ab.
    """
    data = hass.data.get("lovelace")
    known = getattr(data, "dashboards", None) if data is not None else None
    return sorted(str(p) for p in (known or {}) if p)


def _choices(hass: HomeAssistant) -> dict[str, Any]:
    notify = notify_choices(hass)
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
        "calendars": ents("calendar"),
        "signals": ents("light") + ents("switch") + ents("input_boolean"),
        "lights": ents("light"),
        "mail": _mail_services(hass),
        "presence": sorted(
            (
                {"id": s.entity_id, "name": s.name, "kind": sensor_kind(s.attributes.get("device_class"))}
                for s in hass.states.async_all("binary_sensor")
                if s.attributes.get("device_class") in ("motion", "occupancy", "presence")
            ),
            key=lambda x: x["name"].lower(),
        ),
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
                    "options": {
                        **HUB_DEFAULTS,
                        **hub.entry.options,
                        "mail_password": "",
                        "mail_password_set": bool(hub.entry.options.get("mail_password")),
                    },
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
            "dashboards": _known_dashboards(hass),
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
    if not changes.get("mail_password"):
        changes.pop("mail_password", None)  # leer = altes Passwort behalten (wird nie an die Karte geschickt)
    entry = hub.entry
    hass.config_entries.async_update_entry(entry, options={**entry.options, **changes})
    connection.send_result(msg["id"], {"ok": True})


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/mail/test",
        vol.Optional("home"): vol.Any(None, str),
        vol.Optional("settings", default=dict): dict,
        vol.Optional("send", default=True): bool,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_mail_test(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    """Test-Mail mit den gespeicherten (oder gerade eingegebenen) Zugangsdaten."""
    hub = _hub_or_error(hass, connection, msg)
    if hub is None:
        return
    given = {k: v for k, v in msg["settings"].items() if k in MAIL_KEYS and v not in (None, "")}
    opts = {**hub.entry.options, **given}
    if not msg["send"]:
        # nur prüfen: Verbindung, Verschlüsselung, Anmeldung – ohne Mail
        steps = await hass.async_add_executor_job(mail_verify, opts)
        connection.send_result(msg["id"], {"ok": all(s["ok"] for s in steps), "steps": steps})
        return
    try:
        await hass.async_add_executor_job(
            mail_send, opts, tr("Raumklima – Test-Mail"), tr("Hallo! So kommen die Heizberichte von Raumklima an.")
        )
    except MailError as err:
        connection.send_error(msg["id"], "mail_failed", str(err))
        return
    connection.send_result(msg["id"], {"ok": True, "to": recipients(opts.get("mail_to"))})


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/dashboards"})
@websocket_api.async_response
async def ws_dashboards(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    """Vorhandene Dashboards – damit der Umschalter nur auf echte Ziele verlinkt."""
    connection.send_result(msg["id"], {"dashboards": _known_dashboards(hass)})


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
    hass.config_entries.async_update_entry(entry, options={**entry.options, **changes})
    room = domain_data(hass)["rooms"].get(entry.entry_id)
    live = room is not None and room.apply_live_options(changes)
    if not live:
        await hass.config_entries.async_reload(entry.entry_id)
    connection.send_result(msg["id"], {"ok": True, "reloaded": not live})


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
    options = dict(entry.options or {})
    options.update(DEFAULTS)
    # Listen/Zeichenketten ohne Standardwert ausdrücklich leeren
    options.update(
        {
            CONF_SCHEDULES: [],
            CONF_PRESENCE: [],
            CONF_LIGHTS: [],
            CONF_SOLAR_FACADE: "",
        }
    )
    hass.config_entries.async_update_entry(entry, options=options)
    await hass.config_entries.async_reload(entry.entry_id)
    connection.send_result(msg["id"], {"ok": True})


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
        vol.Required("type"): f"{DOMAIN}/report/export",
        vol.Optional("home"): vol.Any(None, str),
        vol.Optional("days"): vol.All(vol.Coerce(int), vol.Range(1, 400)),
    }
)
@callback
def ws_report_export(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    """Heizbericht als CSV (Tageswerte je Raum)."""
    hub = _hub_or_error(hass, connection, msg)
    if hub is None:
        return
    slug = "".join(c if c.isalnum() else "-" for c in hub.name.lower()).strip("-") or "wohnung"
    connection.send_result(
        msg["id"],
        {"filename": f"raumklima-{slug}-{dt_util.now().date().isoformat()}.csv", "csv": hub.insights.export_csv(msg.get("days"))},
    )


def _pdf_entry(entry: dict, hub: RaumklimaHub | None = None) -> dict:
    url = (hub.pdf.signed_url(entry["file"]) if hub else None) or f"{REPORT_URL}/{entry['file']}"
    return {k: v for k, v in entry.items() if not k.startswith("_") and k != "token"} | {"url": url}


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/report/pdf/list", vol.Optional("home"): vol.Any(None, str)})
@callback
def ws_pdf_list(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    """Vorhandene PDF-Berichte (Download über auth/sign_path + url)."""
    hub = _hub_or_error(hass, connection, msg)
    if hub is None:
        return
    connection.send_result(msg["id"], {"reports": [_pdf_entry(r, hub) for r in hub.pdf.listing()]})


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/report/pdf/create",
        vol.Optional("home"): vol.Any(None, str),
        vol.Required("kind"): vol.In(REPORT_KINDS),
        vol.Optional("current", default=True): bool,
        vol.Optional("send", default=False): bool,
    }
)
@websocket_api.async_response
async def ws_pdf_create(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    """PDF jetzt erstellen (bis heute bzw. letzter abgeschlossener Zeitraum) – optional verschicken (nur Admin)."""
    hub = _hub_or_error(hass, connection, msg)
    if hub is None:
        return
    if msg["send"] and not connection.user.is_admin:
        connection.send_error(msg["id"], "unauthorized", tr("Nur Administratoren können verschicken"))
        return
    try:
        entry = await hub.pdf.async_create(msg["kind"], current=msg["current"])
        if msg["send"]:
            await hub.pdf.async_send(entry)
    except Exception as err:  # noqa: BLE001
        connection.send_error(msg["id"], "failed", str(err))
        return
    connection.send_result(msg["id"], _pdf_entry(entry, hub))


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


@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/diagnostics", vol.Optional("home"): vol.Any(None, str)}
)
@websocket_api.async_response
async def ws_diagnostics(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    """Vollständige Diagnose als JSON – für den Knopf in den Einstellungen."""
    hub = _hub_or_error(hass, connection, msg)
    if hub is None:
        return
    from .diagnostics import async_get_config_entry_diagnostics

    entry = hass.config_entries.async_get_entry(hub.entry.entry_id)
    if entry is None:
        connection.send_error(msg["id"], "not_found", "Eintrag nicht gefunden")
        return
    connection.send_result(msg["id"], await async_get_config_entry_diagnostics(hass, entry))


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

    from .hub import dashboard_slug

    # Bewusst nichts von der bestehenden Wohnung übernehmen: fremde Empfänger, fremdes Wetter und
    # fremde Zonen wären falsch (eine neue Wohnung liegt woanders und schickt sonst doppelt Meldungen).
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": SOURCE_IMPORT}, data={"home_name": msg["name"].strip()}
    )
    if result.get("type") != "create_entry":
        connection.send_error(msg["id"], "exists", tr("Diese Wohnung gibt es schon"))
        return
    connection.send_result(
        msg["id"], {"entry_id": result["result"].entry_id, "dashboard": dashboard_slug(msg["name"].strip())}
    )
