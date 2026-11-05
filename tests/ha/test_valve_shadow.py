"""Schattenmodus für die Ventilöffnung: berechnen und protokollieren, nie schreiben."""

from __future__ import annotations

from homeassistant.core import HomeAssistant

from custom_components.raumklima.logic import shadow_opening
from custom_components.raumklima.shared import domain_data

from .conftest import FakeTrv


# ---------------------------------------------------------------- reine Berechnung
def test_totzone_haelt_ventil_zu() -> None:
    assert shadow_opening(21.0, 21.0) == 0.0
    assert shadow_opening(21.0, 20.9) == 0.0  # innerhalb 0,15 K


def test_abweichung_oeffnet_linear() -> None:
    klein = shadow_opening(21.0, 20.5)
    mittel = shadow_opening(21.0, 20.0)
    assert klein is not None and mittel is not None
    assert 15 <= klein < mittel < 100


def test_voll_offen_und_begrenzt() -> None:
    assert shadow_opening(21.0, 19.0) == 93.1
    assert shadow_opening(21.0, 15.0) == 100.0


def test_ohne_regelung_keine_zahl() -> None:
    assert shadow_opening(None, 20.0) is None
    assert shadow_opening(21.0, None) is None
    assert shadow_opening(21.0, 18.0, heating=False) is None


# ---------------------------------------------------------------- im Raum
async def test_raum_berechnet_schatten_ohne_zu_schreiben(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """Der Schattenwert steht in der Diagnose – und das Thermostat bekommt keinen neuen Befehl."""
    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    ctrl.valve_sensor = "sensor.bad_position"
    hass.states.async_set("sensor.bad_position", "31", {"unit_of_measurement": "%"})
    ctrl.target_temp = 21.0
    hass.states.async_set(ctrl.temp_sensor, "20.0", {"unit_of_measurement": "°C"})

    vorher = trv.setpoint
    schatten = ctrl.valve_shadow()
    assert schatten["calc_pct"] is not None and schatten["calc_pct"] > 0
    assert schatten["device_pct"] == 31.0
    assert schatten["diff_pct"] == round(schatten["calc_pct"] - 31.0, 1)
    assert ctrl.diagnostics()["valve_shadow"]["calc_pct"] == schatten["calc_pct"]
    assert trv.setpoint == vorher  # nichts geschrieben

    sample = ctrl.stats_sample()
    assert sample.valve_calc == schatten["calc_pct"]
