"""Diagnose-Export (Einstellungen → Geräte → Raum → Diagnose herunterladen)."""

from __future__ import annotations

from typing import Any

from homeassistant.components.diagnostics import async_redact_data
from homeassistant.core import HomeAssistant

from . import RaumklimaConfigEntry

TO_REDACT = {"mail_password", "mail_user", "mail_from", "mail_to"}


async def async_get_config_entry_diagnostics(
    hass: HomeAssistant, entry: RaumklimaConfigEntry
) -> dict[str, Any]:
    # Zugangsdaten für den Mail-Versand nie in die Diagnose-Datei
    return async_redact_data(entry.runtime_data.diagnostics(), TO_REDACT)
