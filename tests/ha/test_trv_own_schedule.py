"""Thermostat fällt in seinen eigenen Zeitplan zurück (Tado) – das ist kein Drehen am Gerät.

Anlass (Diagnose vom 12.11.2026): Tado führt eine von Raumklima gesetzte Temperatur als
„manuelle Einstellung bis zum nächsten Zeitblock“. Läuft die ab, springt Tado auf HVAC „auto“
und den Wert aus seinem Wochenplan (17,0 °C). Raumklima nahm das als „Am Thermostat gedreht“
und machte 17,1 °C zur neuen Wunschtemperatur – statt 21 °C.
"""

from __future__ import annotations

from datetime import timedelta

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import async_fire_time_changed

from custom_components.raumklima.const import CONF_OFF_METHOD

from .conftest import FakeTrv, hub_entry, room_entry

TADO = {
    "preset_modes": ["away", "home", "auto"],
    "preset_mode": "auto",  # Tado: Geofencing, kein Zeitplan
    "hvac_modes": ["off", "auto", "heat"],
    "default_overlay_type": "TADO_MODE",
    "target_temp_step": 0.1,
}


async def advance(hass: HomeAssistant, seconds: float) -> None:
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=seconds))
    await hass.async_block_till_done()


async def _setup_tado(hass: HomeAssistant, trv: FakeTrv):
    trv.attrs.update(TADO)
    trv.push()
    hub = hub_entry()
    hub.add_to_hass(hass)
    room = room_entry(**{CONF_OFF_METHOD: "auto"})
    room.add_to_hass(hass)
    assert await hass.config_entries.async_setup(hub.entry_id)
    await hass.async_block_till_done()
    await advance(hass, 900)  # Nachlauf eigener Schreibbefehle abwarten


async def test_tado_zeitplan_wird_nicht_zum_wunsch(hass: HomeAssistant, trv: FakeTrv, sensors: None) -> None:
    await _setup_tado(hass, trv)
    wish = hass.states.get("climate.bad").attributes["temperature"]
    sent = trv.setpoint
    assert trv.state == "heat"
    # Manuelle Einstellung bei Tado abgelaufen: Gerät fährt wieder seinen Wochenplan
    trv.state = "auto"
    trv.set(temperature=17.0)
    await hass.async_block_till_done()
    await advance(hass, 60)
    assert hass.states.get("climate.bad").attributes["temperature"] == wish, "Geräteplan wurde zum Wunsch"
    assert trv.state == "heat", "Gerät nicht aus seinem Zeitplan zurückgeholt"
    assert trv.setpoint == sent


async def test_tado_drehen_am_geraet_bleibt_handeingriff(hass: HomeAssistant, trv: FakeTrv, sensors: None) -> None:
    """Dreht jemand am Tado, steht es auf „heat“ – das bleibt ein Handeingriff."""
    await _setup_tado(hass, trv)
    trv.set(temperature=19.0)
    await hass.async_block_till_done()
    await advance(hass, 60)
    assert hass.states.get("climate.bad").attributes["temperature"] == 19.0
