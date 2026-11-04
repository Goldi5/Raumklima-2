"""Probleme als Home-Assistant-Reparaturen melden.

Statt nur im eigenen Protokoll zu stehen, erscheinen echte Störungen unter
*Einstellungen → Reparaturen*: schwache Batterie, nicht erreichbarer Fühler,
nicht erreichbares Thermostat. Verschwindet die Ursache, verschwindet auch die
Meldung – deshalb wird bei jedem Durchlauf angelegt *oder* gelöscht.
"""

from __future__ import annotations

import logging

from homeassistant.core import HomeAssistant
from homeassistant.helpers import issue_registry as ir
from homeassistant.helpers.issue_registry import IssueSeverity

from .const import DOMAIN, STATUS_SENSOR, STATUS_TRV

_LOGGER = logging.getLogger(__name__)


def _sync_issue(
    hass: HomeAssistant,
    issue_id: str,
    active: bool,
    translation_key: str,
    placeholders: dict[str, str],
    severity: IssueSeverity,
) -> None:
    """Reparatur anlegen oder entfernen."""
    if active:
        ir.async_create_issue(
            hass,
            DOMAIN,
            issue_id,
            is_fixable=False,
            severity=severity,
            translation_key=translation_key,
            translation_placeholders=placeholders,
        )
    else:
        ir.async_delete_issue(hass, DOMAIN, issue_id)


def sync_repairs(hass: HomeAssistant, hub) -> None:
    """Alle Räume der Wohnung abgleichen."""
    for room in getattr(hub, "rooms", {}).values():
        entry_id = room.entry.entry_id
        name = room.name

        battery = room.battery_low or {}
        level = battery.get("level")
        _sync_issue(
            hass,
            f"battery_{entry_id}",
            bool(battery.get("low")),
            "battery_low",
            {"room": name, "level": "–" if level is None else f"{float(level):.0f}"},
            IssueSeverity.WARNING,
        )

        status = getattr(room, "status", "")
        _sync_issue(
            hass,
            f"sensor_{entry_id}",
            status == STATUS_SENSOR,
            "sensor_unavailable",
            {"room": name},
            IssueSeverity.WARNING,
        )
        _sync_issue(
            hass,
            f"trv_{entry_id}",
            status == STATUS_TRV,
            "trv_unavailable",
            {"room": name},
            IssueSeverity.ERROR,
        )


def clear_repairs(hass: HomeAssistant, hub) -> None:
    """Beim Entladen alle eigenen Meldungen zurücknehmen."""
    for room in getattr(hub, "rooms", {}).values():
        entry_id = room.entry.entry_id
        for kind in ("battery", "sensor", "trv"):
            ir.async_delete_issue(hass, DOMAIN, f"{kind}_{entry_id}")
