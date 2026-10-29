"""Raumklima – virtuelles Thermostat mit externem Fühler und Fensterlogik."""

from __future__ import annotations

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import PLATFORMS
from .controller import RaumklimaController

type RaumklimaConfigEntry = ConfigEntry[RaumklimaController]


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
