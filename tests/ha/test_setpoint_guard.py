"""Sollwert-Ausreißer: Guard und Verlauf für die Diagnose."""

from __future__ import annotations

from homeassistant.core import HomeAssistant

from custom_components.raumklima.shared import domain_data


async def test_guard_blocks_setpoint_far_above_expected(
    hass: HomeAssistant, setup, trv
) -> None:
    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]

    ctrl.target_temp = 22.0
    assert ctrl.trv_expected_target == 22.0
    assert ctrl.guard_setpoint(26.0) is None
    assert ctrl.guard_setpoint(22.0) == 22.0


async def test_setpoint_history_records_target_and_block(
    hass: HomeAssistant, setup, trv
) -> None:
    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    ctrl.target_temp = 22.0

    ctrl.record_setpoint(26.0, ctrl.trv_expected_target, blocked=True)
    entry = ctrl.setpoint_history[-1]
    assert entry["setpoint"] == 26.0
    assert entry["target"] == 22.0
    assert entry["expected"] == 22.0
    assert entry["blocked"] is True