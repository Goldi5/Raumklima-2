"""Wunschtemperatur aus den Einstellungen zieht den laufenden Sollwert nach (Issue #22)."""

from __future__ import annotations

from homeassistant.core import HomeAssistant


async def test_wunschtemperatur_zieht_sofort_nach(hass: HomeAssistant, setup) -> None:
    """Karte schreibt die Option – der Raum muss ohne Neustart mit dem neuen Wert rechnen."""
    _hub, room = setup
    from custom_components.raumklima.shared import domain_data

    ctrl = domain_data(hass)["rooms"][room.entry_id]
    ctrl.config["comfort_temperature"] = 22.0
    ctrl.target_temp = 22.0
    await hass.async_block_till_done()

    assert ctrl.apply_live_options({"comfort_temperature": 21.0}) is True
    await hass.async_block_till_done()

    assert ctrl.target_temp == 21.0
    assert ctrl.comfort_temp == 21.0


async def test_gleicher_wert_aendert_nichts(hass: HomeAssistant, setup) -> None:
    _hub, room = setup
    from custom_components.raumklima.shared import domain_data

    ctrl = domain_data(hass)["rooms"][room.entry_id]
    ctrl.config["comfort_temperature"] = 21.0
    ctrl.target_temp = 21.0

    assert ctrl.apply_live_options({"comfort_temperature": 21.0}) is True
    assert ctrl.target_temp == 21.0
