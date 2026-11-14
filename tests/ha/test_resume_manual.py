"""Handverstellung beenden: Zeitplan/Automatik sofort wieder übernehmen."""

from __future__ import annotations

from datetime import timedelta

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from custom_components.raumklima.shared import domain_data

from .conftest import hub_entry, room_entry


async def test_resume_clears_manual_override(hass: HomeAssistant, trv, sensors) -> None:
    hub = hub_entry()
    hub.add_to_hass(hass)
    room = room_entry()
    room.add_to_hass(hass)
    assert await hass.config_entries.async_setup(hub.entry_id)
    await hass.async_block_till_done()
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    ctrl._manual_until = dt_util.utcnow() + timedelta(hours=1)
    ctrl._manual_candidate = 21.0
    assert ctrl.manual_until is not None

    await ctrl.async_resume_manual()
    assert ctrl.manual_until is None
    assert ctrl._manual_candidate is None
