"""Raumklima – virtuelles Thermostat mit externem Fühler, Fensterlogik und Lüftungsassistent."""

from __future__ import annotations

import json
import logging
from pathlib import Path

from homeassistant.components.frontend import add_extra_js_url
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.typing import ConfigType

from .const import CARD_URL, DOMAIN, PLATFORMS
from .controller import RaumklimaController

_LOGGER = logging.getLogger(__name__)
# Beim Import (läuft im Executor) lesen, nicht im Event-Loop
VERSION: str = json.loads((Path(__file__).parent / "manifest.json").read_text()).get("version", "0")
CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)

type RaumklimaConfigEntry = ConfigEntry[RaumklimaController]


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Karte (Frontend) einmalig bereitstellen und automatisch laden."""
    card = Path(__file__).parent / "www" / "raumklima-card.js"
    try:
        await hass.http.async_register_static_paths(
            [StaticPathConfig(CARD_URL, str(card), cache_headers=False)]
        )
        add_extra_js_url(hass, f"{CARD_URL}?v={VERSION}")
    except RuntimeError as err:  # bereits registriert (z. B. nach Reload)
        _LOGGER.debug("Karte schon registriert: %s", err)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: RaumklimaConfigEntry) -> bool:
    """Einen Raum einrichten."""
    controller = RaumklimaController(hass, entry)
    entry.runtime_data = controller
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    await controller.async_start()
    return True


async def async_unload_entry(hass: HomeAssistant, entry: RaumklimaConfigEntry) -> bool:
    """Einen Raum entladen."""
    unloaded = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unloaded:
        await entry.runtime_data.async_stop()
    return unloaded
