"""Karten-Schnittstelle: Wohnung – Einstellungen, E-Mail, Dashboards, Aktionen, neue Wohnung."""

from __future__ import annotations

from typing import Any

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
import voluptuous as vol

from .const import (
    CONF_CO2_SENSOR,
    CONF_HUMIDITY_SENSOR,
    CONF_PM25_SENSOR,
    CONF_SCHEDULES,
    CONF_SMTP_NOTIFY,
    CONF_TEMP_SENSOR,
    CONF_TRV,
    CONF_WINDOWS,
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
    send_via_ha,
    verify as mail_verify,
)
from .msg import tr
from .room_const import ROOM_TEMPLATE_KEYS
from .shared import all_hubs, domain_data, get_hub
from .ws_common import (
    HUB_CHANGES,
    ROOM_CHANGES,
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
    smtp_notify = opts.get(CONF_SMTP_NOTIFY)
    if not msg["send"]:
        if smtp_notify:
            ok = hass.services.has_service("smtp", "send_message") and hass.states.get(smtp_notify) is not None
            steps = [{"step": "smtp", "ok": ok, "msg": tr("HA-SMTP-Dienst und Notify-Entität prüfen")}]
        else:
            steps = await hass.async_add_executor_job(mail_verify, opts)
        connection.send_result(msg["id"], {"ok": all(s["ok"] for s in steps), "steps": steps})
        return
    try:
        if smtp_notify:
            await send_via_ha(
                hass,
                str(smtp_notify),
                tr("Raumklima – Test-Mail"),
                tr("Hallo! So kommen die Heizberichte von Raumklima an."),
            )
            connection.send_result(msg["id"], {"ok": True, "to": [str(smtp_notify)]})
        else:
            await hass.async_add_executor_job(
                mail_send, opts, tr("Raumklima – Test-Mail"), tr("Hallo! So kommen die Heizberichte von Raumklima an.")
            )
            connection.send_result(msg["id"], {"ok": True, "to": recipients(opts.get("mail_to"))})
    except MailError as err:
        connection.send_error(msg["id"], "mail_failed", str(err))
    except Exception as err:  # noqa: BLE001
        connection.send_error(msg["id"], "mail_failed", str(err))


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


@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/self_test", vol.Optional("home"): vol.Any(None, str)}
)
@callback
def ws_self_test(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    """Selbsttest: Wohnung, Räume, Thermostate, Fühler und erreichbare Entitäten prüfen."""
    hub = get_hub(hass, msg.get("home"))
    rooms = list(domain_data(hass)["rooms"].values())
    checks: list[dict[str, object]] = []

    def add(ok: bool, label: str, text: str) -> None:
        checks.append({"ok": bool(ok), "label": label, "text": text})

    add(hub is not None, "Wohnung eingerichtet", "Die Zentrale „Allgemein“ ist vorhanden." if hub else "Keine Zentrale gefunden – bitte die Integration neu einrichten.")
    add(bool(rooms), "Räume vorhanden", f"{len(rooms)} Räume gefunden." if rooms else "Noch kein Raum angelegt.")

    missing_trv = [r.entry.title for r in rooms if not getattr(r, "monitor", False) and not (getattr(r, "config", {}) or {}).get(CONF_TRV)]
    add(not missing_trv, "Thermostat je Raum", "Alle Räume haben ein Thermostat." if not missing_trv else "Ohne Thermostat: " + ", ".join(missing_trv))

    missing_temp = [r.entry.title for r in rooms if not (getattr(r, "config", {}) or {}).get(CONF_TEMP_SENSOR)]
    add(not missing_temp, "Temperaturfühler", "Alle Räume haben einen Temperaturfühler." if not missing_temp else "Ohne Fühler: " + ", ".join(missing_temp))

    unavailable: list[str] = []
    for room in rooms:
        cfg = getattr(room, "config", {}) or {}
        ids = [cfg.get(CONF_TRV), cfg.get(CONF_TEMP_SENSOR), cfg.get(CONF_HUMIDITY_SENSOR), cfg.get(CONF_CO2_SENSOR), cfg.get(CONF_PM25_SENSOR)]
        ids.extend(cfg.get(CONF_WINDOWS) or [])
        for eid in ids:
            if not eid:
                continue
            state = hass.states.get(eid)
            if state is None or state.state in ("unavailable", "unknown", "none", ""):
                unavailable.append(f"{room.entry.title}: {eid}")
    add(not unavailable, "Entitäten erreichbar", "Alle konfigurierten Entitäten sind erreichbar." if not unavailable else "Nicht erreichbar: " + ", ".join(unavailable[:8]))

    without_schedule = [r.entry.title for r in rooms if not ((getattr(r, "config", {}) or {}).get(CONF_SCHEDULES) or [])]
    add(True, "Zeitplan", "Jeder Raum hat mindestens ein Zeitfenster." if not without_schedule else "Ohne Zeitfenster (nur Wunschtemperatur, optional): " + ", ".join(without_schedule))

    connection.send_result(msg["id"], {"ok": all(c["ok"] for c in checks), "checks": checks})


def _room_template_values(room: Any) -> dict[str, Any]:
    """Sichere Raum-Overrides, die als Vorlage gespeichert werden dürfen."""
    sources = (room.settings_summary() or {}).get("sources") or {}
    values: dict[str, Any] = {}
    for key in ROOM_TEMPLATE_KEYS:
        if sources.get(key) != "room":
            continue
        value = room.config.get(key)
        if value is not None:
            values[key] = value
    return values


def _templates(hub: Any) -> list[dict[str, Any]]:
    return [dict(item) for item in (hub.entry.options.get("room_templates") or []) if isinstance(item, dict)]


def _save_templates(hass: HomeAssistant, hub: Any, templates: list[dict[str, Any]]) -> None:
    hass.config_entries.async_update_entry(hub.entry, options={**hub.entry.options, "room_templates": templates})


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/room/template_save",
        vol.Required("entry_id"): str,
        vol.Required("name"): vol.All(str, vol.Length(min=1, max=40)),
        vol.Optional("home"): vol.Any(None, str),
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_room_template_save(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    """Sichere Werte eines Raums als benannte Vorlage speichern."""
    hub = get_hub(hass, msg.get("home"))
    room = domain_data(hass)["rooms"].get(msg["entry_id"])
    if hub is None or room is None:
        connection.send_error(msg["id"], "not_found", tr("Raum oder Wohnung nicht gefunden"))
        return
    values = _room_template_values(room)
    if not values:
        connection.send_error(msg["id"], "no_values", tr("Keine sicheren Werte zum Speichern"))
        return
    name = msg["name"].strip()
    templates = _templates(hub)
    for item in templates:
        if item.get("name") == name:
            item["changes"] = values
            break
    else:
        templates.append({"name": name, "changes": values})
    _save_templates(hass, hub, templates)
    connection.send_result(msg["id"], {"ok": True, "name": name, "count": len(values)})


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/room/template_apply",
        vol.Required("entry_id"): str,
        vol.Required("name"): str,
        vol.Optional("home"): vol.Any(None, str),
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_room_template_apply(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    """Benannte Vorlage auf einen Raum anwenden."""
    hub = get_hub(hass, msg.get("home"))
    entry = hass.config_entries.async_get_entry(msg["entry_id"])
    if hub is None or entry is None:
        connection.send_error(msg["id"], "not_found", tr("Raum oder Wohnung nicht gefunden"))
        return
    template = next((item for item in _templates(hub) if item.get("name") == msg["name"]), None)
    if template is None:
        connection.send_error(msg["id"], "not_found", tr("Vorlage nicht gefunden"))
        return
    try:
        changes = ROOM_CHANGES(dict(template.get("changes") or {}))
    except vol.Invalid as err:
        connection.send_error(msg["id"], "invalid", str(err))
        return
    hass.config_entries.async_update_entry(entry, options={**entry.options, **changes})
    room = domain_data(hass)["rooms"].get(entry.entry_id)
    live = room is not None and room.apply_live_options(changes)
    if not live:
        await hass.config_entries.async_reload(entry.entry_id)
    connection.send_result(msg["id"], {"ok": True, "reloaded": not live, "count": len(changes)})


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/room/template_delete",
        vol.Required("name"): str,
        vol.Optional("home"): vol.Any(None, str),
    }
)
@websocket_api.require_admin
@callback
def ws_room_template_delete(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    """Benannte Vorlage löschen."""
    hub = get_hub(hass, msg.get("home"))
    if hub is None:
        connection.send_error(msg["id"], "not_found", tr("Wohnung nicht gefunden"))
        return
    templates = [item for item in _templates(hub) if item.get("name") != msg["name"]]
    _save_templates(hass, hub, templates)
    connection.send_result(msg["id"], {"ok": True})
