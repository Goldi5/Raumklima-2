"""Karten-Schnittstelle: Wohnung – Einstellungen, E-Mail, Dashboards, Aktionen, neue Wohnung."""

from __future__ import annotations

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
import voluptuous as vol

from .const import (
    DEFAULTS,
    DOMAIN,
    HUB_DEFAULTS,
    KINDS,
)
from .mailer import (
    MAIL_KEYS,
    MailError,
    recipients,
    send as mail_send,
    verify as mail_verify,
)
from .msg import tr
from .shared import all_hubs, domain_data, get_hub
from .ws_common import (
    HUB_CHANGES,
    _choices,
    _hub_or_error,
    _installed_version,
    _known_dashboards,
)


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
                    # Standardwerte: die Karte klappt „Weitere Einstellungen" nur auf, wenn etwas abweicht
                    "defaults": HUB_DEFAULTS,
                }
                if hub
                else None
            ),
            "rooms": rooms,
            "room_defaults": DEFAULTS,
            "homes": [
                {"entry_id": h.entry.entry_id, "name": h.name, "default": h.is_default, "dashboard": h.dashboard,
                 "rooms": list(h.rooms)}
                for h in all_hubs(hass)
            ],
            "dashboards": _known_dashboards(hass),
            "kinds": KINDS,
            "choices": _choices(hass),
            "admin": connection.user.is_admin,
            # Version der Installation – die Karte vergleicht damit ihre eigene und warnt,
            # wenn der Browser noch eine alte Datei hält.
            "version": _installed_version(),
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
