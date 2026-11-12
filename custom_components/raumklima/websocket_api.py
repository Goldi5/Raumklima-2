"""WebSocket-Schnittstelle für die Karten im Dashboard – meldet die Befehle an.

Die Befehle selbst liegen nach Bereich in ws_hub.py, ws_room.py und ws_report.py,
Prüfregeln und Hilfen in ws_common.py.
"""

from __future__ import annotations

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback

from .ws_common import _installed_version  # noqa: F401 – für Tests und Diagnose
from .ws_hub import ws_config, ws_dashboards, ws_home_create, ws_hub_action, ws_hub_update, ws_mail_test, ws_notify_test
from .ws_report import (
    ws_diagnostics,
    ws_export_link,
    ws_log,
    ws_log_subscribe,
    ws_pdf_create,
    ws_pdf_list,
    ws_report,
    ws_report_export,
    ws_trace,
    ws_trace_list,
)
from .ws_room import ws_boost, ws_layout_get, ws_layout_save, ws_light_test, ws_room_reset, ws_room_update

HANDLERS = (ws_config, ws_hub_update, ws_dashboards, ws_layout_get, ws_layout_save, ws_room_update, ws_room_reset, ws_notify_test, ws_mail_test, ws_light_test, ws_hub_action, ws_boost, ws_report, ws_report_export, ws_pdf_list, ws_pdf_create, ws_log, ws_log_subscribe, ws_home_create, ws_diagnostics, ws_export_link, ws_trace, ws_trace_list)


@callback
def async_register_websocket(hass: HomeAssistant) -> None:
    for handler in HANDLERS:
        websocket_api.async_register_command(hass, handler)
