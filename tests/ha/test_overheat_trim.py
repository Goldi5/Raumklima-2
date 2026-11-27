"""Gerät heizt, obwohl der Raum schon warm ist (tado): Sollwert zurücknehmen, mit Hysterese."""

from __future__ import annotations

from unittest.mock import patch

from homeassistant.core import HomeAssistant

from custom_components.raumklima.const import OVERHEAT_TRIM_K
from custom_components.raumklima.shared import domain_data


def _room(ctrl, temp: float, heating: bool):
    cls = type(ctrl)
    return (
        patch.object(cls, "current_temperature", new=temp),
        patch.object(cls, "ext_sensor_ok", new=True),
        patch.object(cls, "_device_heating", return_value=heating),
    )


def _trim(ctrl, temp: float, heating: bool, target: float = 22.0) -> float:
    a, b, c = _room(ctrl, temp, heating)
    with a, b, c:
        return ctrl._overheat_trim(target)


async def test_ruecknahme_nur_wenn_geraet_bei_warmem_raum_heizt(hass: HomeAssistant, setup, trv) -> None:
    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    # Raum am Ziel oder knapp drüber: nichts
    assert _trim(ctrl, 22.3, True) == 0.0
    # Deutlich drüber, Gerät heizt aber nicht: nichts
    assert _trim(ctrl, 22.8, False) == 0.0
    # Deutlich drüber und Gerät heizt: zurücknehmen
    assert _trim(ctrl, 22.6, True) == OVERHEAT_TRIM_K
    assert ctrl.overheat_trim_active
    # Gerät hört auf, Raum noch über dem Ziel: Rücknahme bleibt (kein Hin und Her)
    assert _trim(ctrl, 22.2, False) == OVERHEAT_TRIM_K
    # Raum wieder am Ziel: normaler Sollwert
    assert _trim(ctrl, 22.0, False) == 0.0
    assert not ctrl.overheat_trim_active


async def test_ruecknahme_loest_sich_bei_neuem_ziel(hass: HomeAssistant, setup, trv) -> None:
    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    assert _trim(ctrl, 22.7, True) == OVERHEAT_TRIM_K
    # Neues Ziel (z. B. Zeitplan): Rücknahme gilt nur für das alte
    assert _trim(ctrl, 22.7, False, target=23.0) == 0.0
    assert not ctrl.overheat_trim_active


async def test_ohne_raumfuehler_keine_ruecknahme(hass: HomeAssistant, setup, trv) -> None:
    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    cls = type(ctrl)
    with patch.object(cls, "current_temperature", new=23.0), patch.object(cls, "ext_sensor_ok", new=False), patch.object(
        cls, "_device_heating", return_value=True
    ):
        assert ctrl._overheat_trim(22.0) == 0.0
