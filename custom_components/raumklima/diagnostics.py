"""Diagnose-Export (Einstellungen → Geräte → Raum → Diagnose herunterladen)."""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant

from . import RaumklimaConfigEntry


async def async_get_config_entry_diagnostics(
    hass: HomeAssistant, entry: RaumklimaConfigEntry
) -> dict[str, Any]:
    return entry.runtime_data.diagnostics()
