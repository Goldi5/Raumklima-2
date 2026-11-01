"""Raumklima – virtuelles Thermostat mit externem Fühler, Fensterlogik, Lüftungsassistent,
Abwesenheit und Heizsaison."""

from __future__ import annotations

import json
import logging
from pathlib import Path
from typing import Any

from homeassistant.components.frontend import add_extra_js_url
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import SOURCE_IMPORT, ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.typing import ConfigType

from .const import (
    CARD_URL,
    CONF_ENTRY_TYPE,
    CONF_NOTIFY,
    CONF_NOTIFY_TARGETS,
    CONF_QUIET_END,
    CONF_QUIET_START,
    CONF_RECIPIENTS,
    CONF_REPEAT_MINUTES,
    CONF_TTS,
    CONF_TTS_TARGETS,
    CONF_WEATHER,
    DEFAULT_PUSH_KINDS,
    DEFAULT_TTS_KINDS,
    DOMAIN,
    ENTRY_HUB,
    HUB_PLATFORMS,
    PLATFORMS,
)

_LOGGER = logging.getLogger(__name__)
# Beim Import (läuft im Executor) lesen, nicht im Event-Loop
VERSION: str = json.loads((Path(__file__).parent / "manifest.json").read_text()).get("version", "0")
CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)

type RaumklimaConfigEntry = ConfigEntry[Any]


def is_hub_entry(entry: ConfigEntry) -> bool:
    """Zentrale „Allgemein“ statt Raum?"""
    return entry.data.get(CONF_ENTRY_TYPE) == ENTRY_HUB


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Karte (Frontend) einmalig bereitstellen und automatisch laden."""
    from .shared import domain_data
    from .websocket_api import async_register_websocket

    domain_data(hass)
    await _async_register_card(hass)
    async_register_websocket(hass)
    if getattr(hass, "http", None) is not None:
        from .reports import ReportView

        hass.http.register_view(ReportView())
    return True


async def _async_register_card(hass: HomeAssistant) -> None:
    """Karte ausliefern und als Dashboard-Ressource eintragen."""
    card = Path(__file__).parent / "www" / "raumklima-card.js"
    try:
        await hass.http.async_register_static_paths(
            [StaticPathConfig(CARD_URL, str(card), cache_headers=False)]
        )
    except RuntimeError as err:  # bereits registriert (z. B. nach Reload)
        _LOGGER.debug("Karte schon registriert: %s", err)
    await _async_register_resource(hass)


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


def _ensure_hub(hass: HomeAssistant, room: ConfigEntry) -> None:
    """Zentrale einmalig anlegen – mit den bisherigen Einstellungen des Raums."""
    from .shared import domain_data

    if any(is_hub_entry(e) for e in hass.config_entries.async_entries(DOMAIN)):
        return
    data = domain_data(hass)
    if data.get("hub_flow"):
        return
    data["hub_flow"] = True
    opts = {**room.data, **room.options}
    migrated = {
        CONF_RECIPIENTS: {t: list(DEFAULT_PUSH_KINDS) for t in opts.get(CONF_NOTIFY_TARGETS) or []},
        CONF_TTS: {t: list(DEFAULT_TTS_KINDS) for t in opts.get(CONF_TTS_TARGETS) or []},
        "quiet_start": opts.get(CONF_QUIET_START) or "22:00:00",
        "quiet_end": opts.get(CONF_QUIET_END) or "07:00:00",
        "repeat_minutes": opts.get(CONF_REPEAT_MINUTES) or 5,
        "weather_entity": opts.get(CONF_WEATHER),
        "notify_on_failure": opts.get(CONF_NOTIFY, True),
    }
    _LOGGER.info("Lege Raumklima Allgemein an (Einstellungen aus %s übernommen)", room.title)
    hass.async_create_task(
        hass.config_entries.flow.async_init(
            DOMAIN, context={"source": SOURCE_IMPORT}, data=migrated
        )
    )


async def async_setup_entry(hass: HomeAssistant, entry: RaumklimaConfigEntry) -> bool:
    """Einen Raum oder die Zentrale einrichten."""
    from .hub import RaumklimaHub
    from .shared import domain_data

    if is_hub_entry(entry):
        hub = RaumklimaHub(hass, entry)
        entry.runtime_data = hub
        data = domain_data(hass)
        data["hubs"][entry.entry_id] = hub
        if hub.is_default or data.get("hub") is None:
            data["hub"] = hub
        await hass.config_entries.async_forward_entry_setups(entry, HUB_PLATFORMS)
        await hub.async_start()
        entry.async_on_unload(entry.add_update_listener(_async_hub_updated))
        for room in list(domain_data(hass)["rooms"].values()):
            room.on_hub_change()
        return True

    from .controller import RaumklimaController

    controller = RaumklimaController(hass, entry)
    entry.runtime_data = controller
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    await controller.async_start()
    _ensure_hub(hass, entry)
    return True


async def _async_hub_updated(hass: HomeAssistant, entry: ConfigEntry) -> None:
    await entry.runtime_data.async_options_updated()


async def async_unload_entry(hass: HomeAssistant, entry: RaumklimaConfigEntry) -> bool:
    """Einen Raum oder die Zentrale entladen."""
    from .shared import domain_data

    if is_hub_entry(entry):
        unloaded = await hass.config_entries.async_unload_platforms(entry, HUB_PLATFORMS)
        if unloaded:
            await entry.runtime_data.async_stop()
            data = domain_data(hass)
            data["hubs"].pop(entry.entry_id, None)
            if data.get("hub") is entry.runtime_data:
                data["hub"] = next(iter(data["hubs"].values()), None)
            data["hub_flow"] = False
            for room in list(data["rooms"].values()):
                room.on_hub_change()
        return unloaded
    unloaded = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unloaded:
        await entry.runtime_data.async_stop()
    return unloaded


async def async_remove_entry(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Zentrale gelöscht → beim nächsten Raumstart neu anlegen dürfen."""
    if is_hub_entry(entry):
        from .shared import domain_data

        domain_data(hass)["hub_flow"] = False
