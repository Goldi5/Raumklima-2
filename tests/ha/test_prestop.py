"""Vor-Stopp gegen Überschwingen: nur beim sonnigen Aufheizen, nicht dauerhaft."""

from __future__ import annotations

from unittest.mock import patch

from homeassistant.core import HomeAssistant

from custom_components.raumklima.shared import domain_data


def _at(ctrl, temp: float):
    return patch.object(type(ctrl), "current_temperature", new=temp)


async def test_vorstopp_nur_nach_aufheizen_und_loest_sich(hass: HomeAssistant, setup, trv) -> None:
    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    with patch.object(ctrl.heatup, "pre_stop", return_value=0.3), patch.object(ctrl.hub, "sun_expected", return_value=True):
        # Dauerzustand nahe am Ziel: kein Vor-Stopp (früher: dauerhaft 0,3 K zu kalt)
        with _at(ctrl, 20.8):
            assert ctrl._prestop_amount(21.0) == 0.0
        # Aufheizen: erst deutlich darunter (scharf), dann kurz vor dem Ziel einrasten
        with _at(ctrl, 19.5):
            assert ctrl._prestop_amount(21.0) == 0.0
        with _at(ctrl, 20.75):
            assert ctrl._prestop_amount(21.0) == 0.3
        with _at(ctrl, 20.6):
            assert ctrl._prestop_amount(21.0) == 0.3, "Hysterese: nicht bei jedem Messwert springen"
        # Ziel erreicht: wieder normaler Sollwert, und kein erneutes Einrasten ohne neues Aufheizen
        with _at(ctrl, 21.0):
            assert ctrl._prestop_amount(21.0) == 0.0
        with _at(ctrl, 20.8):
            assert ctrl._prestop_amount(21.0) == 0.0


async def test_vorstopp_ohne_sonne_nicht(hass: HomeAssistant, setup, trv) -> None:
    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    with patch.object(ctrl.heatup, "pre_stop", return_value=0.3), patch.object(ctrl.hub, "sun_expected", return_value=False):
        with _at(ctrl, 19.5):
            ctrl._prestop_amount(21.0)
        with _at(ctrl, 20.8):
            assert ctrl._prestop_amount(21.0) == 0.0
