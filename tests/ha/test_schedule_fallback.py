"""Zeitplan: Wert außerhalb der Fenster (Issue #10)."""

from __future__ import annotations

from homeassistant.core import HomeAssistant

from custom_components.raumklima.const import CONF_SCHEDULE_FALLBACK, CONF_SCHEDULES
from custom_components.raumklima.shared import domain_data

from .conftest import FakeTrv

# Fenster, das jetzt nicht läuft (weit in der Vergangenheit)
NICHT_JETZT = [{"days": [], "start": "00:00:00", "end": "00:01:00", "temperature": 21.0}]


def _ctrl(hass: HomeAssistant, room):
    return domain_data(hass)["rooms"][room.entry_id]


async def test_standard_ist_wunschtemperatur(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """Ohne Einstellung ändert sich nichts: außerhalb der Fenster gilt der Wunsch."""
    _hub, room = setup
    ctrl = _ctrl(hass, room)
    ctrl.config[CONF_SCHEDULES] = NICHT_JETZT
    ctrl.config[CONF_SCHEDULE_FALLBACK] = "wish"
    _on, target, reason = ctrl.plan()
    assert target == ctrl.target_temp
    assert reason != "schedule_fallback"


async def test_laenger_weg_ausserhalb_der_fenster(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    _hub, room = setup
    ctrl = _ctrl(hass, room)
    ctrl.config[CONF_SCHEDULES] = NICHT_JETZT
    ctrl.config[CONF_SCHEDULE_FALLBACK] = "long"
    _on, target, reason = ctrl.plan()
    assert reason == "schedule_fallback"
    assert target == ctrl.setback_long


async def test_sicherung_ist_der_kalteste_wert(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    _hub, room = setup
    ctrl = _ctrl(hass, room)
    hub = ctrl.hub
    assert hub is not None
    ctrl.config[CONF_SCHEDULES] = NICHT_JETZT
    ctrl.config[CONF_SCHEDULE_FALLBACK] = "frost"
    _on, target, reason = ctrl.plan()
    assert reason == "schedule_fallback"
    assert target == hub.frost_floor


async def test_im_fenster_gilt_der_zeitplan(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """Läuft ein Fenster, gewinnt es – der Fallback greift nur dazwischen."""
    _hub, room = setup
    ctrl = _ctrl(hass, room)
    ctrl.config[CONF_SCHEDULES] = [
        {"days": [], "start": "00:00:00", "end": "23:59:59", "temperature": 21.0}
    ]
    ctrl.config[CONF_SCHEDULE_FALLBACK] = "long"
    _on, target, reason = ctrl.plan()
    assert reason == "schedule"
    assert target == 21.0
