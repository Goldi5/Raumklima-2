"""Schimmelschutz mit Verstand: Fenster, Deckel, Stundenbudget (Ideen A–E)."""

from __future__ import annotations

from datetime import timedelta

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from custom_components.raumklima.const import CONF_HUMIDITY_SENSOR, CONF_OUTDOOR_TEMP, CONF_WALL
from custom_components.raumklima.planning import MoldGuard, saturation_pressure
from custom_components.raumklima.shared import domain_data, get_hub

TEMP = "sensor.bad_temp"
HUMID = "sensor.bad_feuchte"
OUTSIDE = "sensor.aussen"


def _wire(hass: HomeAssistant, ctrl, hub, *, temp: float, humidity: float, outside: float = 0.5) -> None:
    hass.states.async_set(TEMP, str(temp), {"device_class": "temperature", "unit_of_measurement": "°C"})
    hass.states.async_set(HUMID, str(humidity), {"device_class": "humidity", "unit_of_measurement": "%"})
    hass.states.async_set(OUTSIDE, str(outside), {"device_class": "temperature", "unit_of_measurement": "°C"})
    ctrl.temp_sensor = TEMP
    ctrl.humidity_sensor = HUMID
    ctrl.config[CONF_HUMIDITY_SENSOR] = HUMID
    hub.config[CONF_OUTDOOR_TEMP] = OUTSIDE


def _feed(guard: MoldGuard, hours: int, rh: float, surface: float) -> None:
    now = dt_util.utcnow()
    for h in range(hours, 0, -1):
        guard.add(now - timedelta(hours=h), 22.0, rh, surface)


# ---------------------------------------------------------------- A) Fenster
async def test_offenes_fenster_schaltet_den_boden_ab(hass: HomeAssistant, setup) -> None:
    """Bei offenem Fenster darf kein Feuchte-Boden gelten – Heizen dagegen ist Verschwendung."""
    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    hub = get_hub(hass, None)
    _wire(hass, ctrl, hub, temp=19.0, humidity=68.0)
    ctrl.config["mold_mode"] = "strict"
    _feed(ctrl.mold_guard, 6, 68.0, 90.0)  # Budget über der Grenze

    ohne = ctrl.plan()
    ctrl.window_paused = True
    mit = ctrl.plan()
    assert ohne[2] == "mold"
    assert mit[2] != "mold", "offenes Fenster muss den Boden aussetzen"
    assert ctrl.mold_capped is False


# ---------------------------------------------------------------- B) Deckel
async def test_deckel_begrenzt_den_zuschlag(hass: HomeAssistant, setup) -> None:
    """Heizen löst kein Feuchteproblem: höchstens Wunsch + Deckel."""
    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    hub = get_hub(hass, None)
    ctrl.config["mold_mode"] = "strict"
    ctrl.config["mold_cap"] = 2.0
    ctrl.config[CONF_WALL] = "corner"  # kalte Ecke: hoher Boden
    ctrl.target_temp = 19.0
    _wire(hass, ctrl, hub, temp=22.0, humidity=70.0, outside=-2.0)
    _feed(ctrl.mold_guard, 8, 70.0, 92.0)

    on, target, reason = ctrl.plan()
    assert reason == "mold"
    assert target <= 21.5, f"Deckel 2,0 K auf 19 → höchstens 21,0/21,5, war {target}"
    assert ctrl.mold_capped is True


async def test_ohne_deckel_greift_keiner(hass: HomeAssistant, setup) -> None:
    """Deckel 0 heißt: gar keine Anhebung."""
    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    hub = get_hub(hass, None)
    ctrl.config["mold_mode"] = "strict"
    ctrl.config["mold_cap"] = 0.0
    ctrl.target_temp = 19.0
    _wire(hass, ctrl, hub, temp=22.0, humidity=70.0, outside=-2.0)
    _feed(ctrl.mold_guard, 8, 70.0, 92.0)
    _on, target, reason = ctrl.plan()
    assert reason != "mold"
    assert target == 19.0


# ---------------------------------------------------------------- C) Stundenbudget
async def test_kurze_spitze_heizt_nicht(hass: HomeAssistant, setup) -> None:
    """Eine Stunde über 80 % ist keine Schimmelgefahr – da hilft Lüften, nicht Heizen."""
    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    hub = get_hub(hass, None)
    ctrl.config["mold_mode"] = "strict"
    ctrl.target_temp = 19.0
    _wire(hass, ctrl, hub, temp=22.0, humidity=70.0, outside=-2.0)
    _feed(ctrl.mold_guard, 1, 70.0, 92.0)  # nur eine Stunde kritisch
    _on, target, reason = ctrl.plan()
    assert reason != "mold"
    assert target == 19.0


def test_budget_zaehlt_stunden() -> None:
    guard = MoldGuard()
    now = dt_util.utcnow()
    for h in range(10, 0, -1):
        guard.add(now - timedelta(hours=h), 22.0, 60.0, 85.0 if h <= 4 else 60.0)
    assert guard.surface_rh_hours(now) >= 3.5
    assert guard.surface_rh_hours(now) <= 4.5


def test_wandfeuchte_rechnung() -> None:
    """Wandtemperatur = außen + fRsi × (innen − außen); daraus die relative Feuchte."""
    temp, rh, outside, frsi = 22.0, 60.0, 0.0, 0.7
    vapour = rh / 100.0 * saturation_pressure(temp)
    surface = outside + frsi * (temp - outside)
    surface_rh = 100.0 * vapour / saturation_pressure(surface)
    assert 75 < surface_rh < 95, surface_rh


# ---------------------------------------------------------------- E) Bauart
async def test_aussenwand_ist_kritischer_als_innenwand(hass: HomeAssistant, setup) -> None:
    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    ctrl.config[CONF_WALL] = "wall"
    assert ctrl.room_frsi < 0.8
    ctrl.config[CONF_WALL] = "interior"
    assert ctrl.room_frsi > 0.8
