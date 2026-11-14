"""Karten-Schnittstelle: Bericht, PDF, Protokoll, Diagnose, Ablauf-Spur, Export-Link."""

from __future__ import annotations

import re

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
from homeassistant.util import dt as dt_util
import voluptuous as vol

from .const import (
    DOMAIN,
)
from .decision_log import CATEGORIES
from .msg import tr
from .report_data import REPORT_KINDS
from .shared import get_hub
from .ws_common import (
    _hub_or_error,
    _pdf_entry,
)


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/report", vol.Optional("home"): vol.Any(None, str)})
@callback
def ws_report(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    hub = _hub_or_error(hass, connection, msg)
    if hub is None:
        return
    connection.send_result(msg["id"], {**hub.insights.report(), "issues": hub.insights.all_issues()})


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/energy",
        vol.Optional("home"): vol.Any(None, str),
        vol.Optional("days", default=30): vol.All(vol.Coerce(int), vol.Range(1, 365)),
    }
)
@websocket_api.async_response
async def ws_energy(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    """Energie für das Dashboard: Zähler, Tarif und Kosten im Zeitraum."""
    hub = _hub_or_error(hass, connection, msg)
    if hub is None:
        return
    connection.send_result(msg["id"], await hub.insights.async_energy_summary(msg["days"]))


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


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/trace",
        vol.Required("event"): str,
        vol.Optional("data"): dict,
    }
)
@websocket_api.require_admin
@callback
def ws_trace(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    """Debug-Spur aus der Karte aufnehmen (Browser dort hat keine Konsole)."""
    from .trace import add as trace_add

    trace_add(hass, msg["event"], msg.get("data") or {})
    connection.send_result(msg["id"], {"ok": True})


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/trace/list"})
@websocket_api.require_admin
@callback
def ws_trace_list(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    """Die letzten Spur-Zeilen der Karte ausgeben."""
    from .trace import recent

    connection.send_result(msg["id"], {"items": recent()})


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/export/link",
        vol.Required("kind"): vol.In(["backup", "diagnostics"]),
        vol.Optional("home"): vol.Any(None, str),
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_export_link(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    """Download-Link für Sicherung oder Diagnose erzeugen.

    Tablets und die HA-App können Dateien nicht aus einem Skript heraus speichern; ein
    echter Link, den der Nutzer antippt, geht dort. Der Link verfällt nach 15 Minuten.
    """
    from .backup import build_backup
    from .diagnostics import async_get_config_entry_diagnostics
    from .exports import make_link

    stamp = dt_util.now().strftime("%Y-%m-%d")
    kind = msg["kind"]
    if kind == "backup":
        name = f"raumklima-einstellungen-{stamp}.json"
        payload = build_backup(hass)
    else:
        hub = _hub_or_error(hass, connection, msg)
        if hub is None:
            return
        entry = hass.config_entries.async_get_entry(hub.entry.entry_id)
        if entry is None:
            connection.send_error(msg["id"], "not_found", tr("Raum nicht gefunden"))
            return
        payload = await async_get_config_entry_diagnostics(hass, entry)
        home = str(payload.get("home_name") or "wohnung").lower()
        home = re.sub(r"[^a-z0-9]+", "-", home).strip("-") or "wohnung"
        name = f"raumklima-diagnose-{home}-{dt_util.now().strftime('%Y-%m-%d-%H-%M')}.json"

    try:
        url = await make_link(hass, name, payload)
    except OSError as err:
        connection.send_error(msg["id"], "write_failed", str(err))
        return
    # Protokollspur: daran ist erkennbar, ob die Karte im Browser wirklich den neuen
    # Stand lädt – ohne diese Zeile kam der Tipp aus altem Code.
    hub = get_hub(hass, msg.get("home"))
    if hub is not None:
        hub.log.add(
            "settings",
            tr("{kind} bereitgestellt", kind=tr("Sicherung") if kind == "backup" else tr("Diagnose")),
            tr("Download-Link für 15 Minuten: {n}", n=name),
        )
    connection.send_result(msg["id"], {"url": url, "name": name})


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
