"""Verschattung: Sonne schließt, Empfehlung fährt nicht, Handbedienung pausiert."""

from __future__ import annotations

from unittest.mock import AsyncMock, patch

from homeassistant.core import HomeAssistant

from custom_components.raumklima.const import CONF_SHADING_COVERS, CONF_SHADING_MODE
from custom_components.raumklima.room_shading import (
    STATE_ADVISE_CLOSE,
    STATE_CLOSED,
    STATE_MANUAL,
)
from custom_components.raumklima.shared import domain_data

from .conftest import hub_entry, room_entry

COVER = "cover.bad_rollladen"


async def _setup_room(hass: HomeAssistant, **options):
    hass.states.async_set(
        COVER,
        "open",
        {"current_position": 100, "supported_features": 4, "device_class": "shutter"},
    )
    hub = hub_entry()
    hub.add_to_hass(hass)
    opts = {
        "shading_covers": [COVER],
        "shading_mode": "auto",
        "shading_min_temp": 18.0,
        "shading_outdoor_min": 0.0,
    }
    opts.update(options)
    room = room_entry(**opts)
    room.add_to_hass(hass)
    assert await hass.config_entries.async_setup(hub.entry_id)
    await hass.async_block_till_done()
    return room, domain_data(hass)["rooms"][room.entry_id]


async def test_shading_closes_on_sun(hass: HomeAssistant, trv, sensors) -> None:
    room, ctrl = await _setup_room(hass)
    assert ctrl.covers == [COVER]
    with (
        patch.object(ctrl, "_shading_sun_expected", return_value=True),
        patch.object(ctrl, "_shading_is_night", return_value=False),
        patch("homeassistant.core.ServiceRegistry.async_call", new=AsyncMock()) as call,
    ):
        await ctrl.async_evaluate_shading()
    assert ctrl.shading_summary()["state"] == STATE_CLOSED
    call.assert_awaited_once()
    assert call.await_args.args[:2] == ("cover", "set_cover_position")
    assert call.await_args.args[2] == {"entity_id": COVER, "position": 20}


async def test_shading_advises_without_moving(hass: HomeAssistant, trv, sensors) -> None:
    room, ctrl = await _setup_room(hass, **{CONF_SHADING_MODE: "advise"})
    with (
        patch.object(ctrl, "_shading_sun_expected", return_value=True),
        patch.object(ctrl, "_shading_is_night", return_value=False),
        patch("homeassistant.core.ServiceRegistry.async_call", new=AsyncMock()) as call,
    ):
        await ctrl.async_evaluate_shading()
    assert ctrl.shading_summary()["state"] == STATE_ADVISE_CLOSE
    call.assert_not_awaited()


async def test_shading_manual_move_pauses(hass: HomeAssistant, trv, sensors) -> None:
    room, ctrl = await _setup_room(hass)
    ctrl._shading_last.clear()
    hass.states.async_set(COVER, "closed", {"current_position": 20, "supported_features": 4})
    await hass.async_block_till_done()
    hass.states.async_set(COVER, "open", {"current_position": 100, "supported_features": 4})
    await hass.async_block_till_done()
    summary = ctrl.shading_summary()
    assert summary["state"] == STATE_MANUAL
    assert summary["manual_until"] is not None
