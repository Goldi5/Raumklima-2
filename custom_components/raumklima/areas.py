"""Raumklima-Entitäten dem Home-Assistant-Bereich zuordnen (für Assist).

Sprachsteuerung wie „Wohnzimmer auf 22 Grad" findet eine Entität nur, wenn sie einem
Bereich zugeordnet ist. Diese Zuordnung fehlte bisher: Die Raum-Entität hing ohne
Bereich in der Registry. Die Zuordnung wird nur **gefüllt**, wenn sie leer ist — eine
vom Nutzer gesetzte Area wird nie überschrieben.
"""

from __future__ import annotations

import logging

from homeassistant.core import HomeAssistant
from homeassistant.helpers import area_registry as ar, device_registry as dr, entity_registry as er

from .const import CONF_TEMP_SENSOR, DOMAIN

_LOGGER = logging.getLogger(__name__)


def _area_of(hass: HomeAssistant, entity_id: str | None) -> str | None:
    """Bereich einer Entität – erst an der Entität, dann am Gerät."""
    if not entity_id:
        return None
    entry = er.async_get(hass).async_get(entity_id)
    if entry is None:
        return None
    if entry.area_id:
        return entry.area_id
    device = dr.async_get(hass).async_get(entry.device_id) if entry.device_id else None
    return device.area_id if device else None


def room_area(hass: HomeAssistant, room) -> str | None:
    """Passenden Bereich für einen Raum finden.

    Reihenfolge: Thermostat → Fensterkontakte → Fühler → Bereich mit gleichem Namen.
    """
    candidates: list[str | None] = [getattr(room, "trv", None)]
    candidates += list(getattr(room, "windows", None) or [])
    candidates.append((getattr(room, "config", None) or {}).get(CONF_TEMP_SENSOR))
    for entity_id in candidates:
        area_id = _area_of(hass, entity_id)
        if area_id:
            return area_id
    # Vergleich über die Liste: async_get_area_by_name wirft in neueren Versionen ValueError
    wanted = (getattr(room, "name", "") or "").strip().lower()
    if wanted:
        for area in ar.async_get(hass).async_list_areas():
            if area.name.strip().lower() == wanted:
                return area.id
    return None


def assign_room_area(hass: HomeAssistant, room) -> int:
    """Alle Entitäten des Raums in den gefundenen Bereich legen – gibt die Anzahl zurück."""
    area_id = room_area(hass, room)
    if not area_id:
        return 0
    entities = er.async_get(hass)
    devices = dr.async_get(hass)
    entry_id = room.entry.entry_id
    moved = 0
    for entry in list(entities.entities.values()):
        if entry.platform != DOMAIN or entry.config_entry_id != entry_id:
            continue
        if entry.area_id:  # vom Nutzer gesetzt – nicht anfassen
            continue
        device = devices.async_get(entry.device_id) if entry.device_id else None
        if getattr(entry, "has_entity_name", False) and device is not None:
            # Entität ohne eigenen Namen erbt den Bereich vom Gerät (neuere HA-Versionen
            # lehnen einen eigenen Bereich sonst ab)
            if not device.area_id:
                devices.async_update_device(device.id, area_id=area_id)
                moved += 1
            continue
        try:
            entities.async_update_entity(entry.entity_id, area_id=area_id)
        except ValueError:  # pragma: no cover – Version ohne eigenen Namen
            continue
        moved += 1
    if moved:
        _LOGGER.debug("%s: %d Entitäten dem Bereich %s zugeordnet (Assist)", room.name, moved, area_id)
    return moved
