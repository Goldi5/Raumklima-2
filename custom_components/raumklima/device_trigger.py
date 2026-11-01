"""Geräte-Auslöser für Automationen: „Bitte lüften“, „Fenster geöffnet“, „Heizung pausiert“ …

Im Automationseditor unter Gerät → Raum auswählbar. Technisch hört jeder Auslöser
auf das Ereignis ``raumklima_event`` des Raums (siehe Doku „Referenz“).
"""

from __future__ import annotations

from typing import Any

from homeassistant.components.device_automation import DEVICE_TRIGGER_BASE_SCHEMA
from homeassistant.components.homeassistant.triggers import event as event_trigger
from homeassistant.const import CONF_DEVICE_ID, CONF_DOMAIN, CONF_PLATFORM, CONF_TYPE
from homeassistant.core import CALLBACK_TYPE, HomeAssistant
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers.trigger import TriggerActionType, TriggerInfo
from homeassistant.helpers.typing import ConfigType
import voluptuous as vol

from .const import CONF_ENTRY_TYPE, DOMAIN, ENTRY_HUB, EVENT_RAUMKLIMA

# Auslöser → erwartete Ereignisdaten
TRIGGERS: dict[str, dict[str, str]] = {
    "vent_please_open": {"type": "ventilation", "state": "please_open"},
    "vent_please_close": {"type": "ventilation", "state": "please_close"},
    "vent_too_cold": {"type": "ventilation", "state": "too_cold"},
    "vent_done": {"type": "ventilation", "state": "done"},
    "window_opened": {"type": "window", "state": "open"},
    "window_closed": {"type": "window", "state": "closed"},
    "heating_paused": {"type": "heating", "state": "paused"},
    "heating_resumed": {"type": "heating", "state": "resumed"},
    "health_problem": {"type": "health", "state": "problem"},
}

TRIGGER_SCHEMA = DEVICE_TRIGGER_BASE_SCHEMA.extend({vol.Required(CONF_TYPE): vol.In(TRIGGERS)})


def room_entry_id(hass: HomeAssistant, device_id: str) -> str | None:
    """Config-Entry-ID des Raums zu einem Gerät (None für die Zentrale oder fremde Geräte)."""
    device = dr.async_get(hass).async_get(device_id)
    if device is None:
        return None
    for domain, ident in device.identifiers:
        if domain != DOMAIN:
            continue
        entry = hass.config_entries.async_get_entry(ident)
        if entry is not None and entry.data.get(CONF_ENTRY_TYPE) != ENTRY_HUB:
            return entry.entry_id
    return None


async def async_get_triggers(hass: HomeAssistant, device_id: str) -> list[dict[str, Any]]:
    if room_entry_id(hass, device_id) is None:
        return []
    return [
        {CONF_PLATFORM: "device", CONF_DOMAIN: DOMAIN, CONF_DEVICE_ID: device_id, CONF_TYPE: kind}
        for kind in TRIGGERS
    ]


async def async_attach_trigger(
    hass: HomeAssistant,
    config: ConfigType,
    action: TriggerActionType,
    trigger_info: TriggerInfo,
) -> CALLBACK_TYPE:
    entry_id = room_entry_id(hass, config[CONF_DEVICE_ID])
    event_config = event_trigger.TRIGGER_SCHEMA(
        {
            event_trigger.CONF_PLATFORM: "event",
            event_trigger.CONF_EVENT_TYPE: EVENT_RAUMKLIMA,
            event_trigger.CONF_EVENT_DATA: {"entry_id": entry_id, **TRIGGERS[config[CONF_TYPE]]},
        }
    )
    return await event_trigger.async_attach_trigger(hass, event_config, action, trigger_info, platform_type="device")
