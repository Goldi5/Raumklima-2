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
    except RuntimeError as err:  # bereits registriert (z. B. nach Reload)
        _LOGGER.debug("Karte schon registriert: %s", err)
    await _async_register_resource(hass)
    return True


async def _async_register_resource(hass: HomeAssistant) -> None:
    """Karte als Dashboard-Ressource eintragen (nötig für die Dashboard-Strategie).

    Extra-Module lädt HA erst nach dem Dashboard-Aufbau – zu spät für
    Strategien. Ressourcen lädt HA vorher. Bei YAML-Ressourcen: Rückfall.
    """
    url = f"{CARD_URL}?v={VERSION}"
    data = hass.data.get("lovelace")
    resources = getattr(data, "resources", None)
    if (
        resources is None
        or getattr(data, "resource_mode", "storage") != "storage"
        or not hasattr(resources, "async_create_item")
    ):
        add_extra_js_url(hass, url)
        return
    try:
        await resources.async_get_info()  # lädt die Sammlung bei Bedarf
        for item in resources.async_items():
            if str(item.get("url", "")).split("?")[0] == CARD_URL:
                if item.get("url") != url:
                    await resources.async_update_item(item["id"], {"res_type": "module", "url": url})
                return
        await resources.async_create_item({"res_type": "module", "url": url})
    except Exception as err:  # noqa: BLE001 – interne API, lieber Rückfall als Absturz
        _LOGGER.warning("Ressource konnte nicht eingetragen werden (%s) – nutze Extra-Modul", err)
        add_extra_js_url(hass, url)


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
