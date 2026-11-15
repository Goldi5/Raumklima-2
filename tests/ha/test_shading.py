"""Verschattung: Sonne schließt, Empfehlung fährt nicht, Handbedienung pausiert."""

from __future__ import annotations

from unittest.mock import AsyncMock, patch

from homeassistant.core import HomeAssistant

from custom_components.raumklima.const import CONF_SHADING_MODE
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


async def test_shading_faehrt_nicht_vor_offene_tuer(hass: HomeAssistant, trv, sensors) -> None:
    """Offene Balkontür: Rollladen bleibt oben – sonst sperrt man sich aus."""
    from .conftest import WINDOW

    _room, ctrl = await _setup_room(hass)
    hass.states.async_set(WINDOW, "on", {"device_class": "door"})
    await hass.async_block_till_done()
    with (
        patch.object(ctrl, "_shading_sun_expected", return_value=True),
        patch.object(ctrl, "_shading_is_night", return_value=False),
        patch("homeassistant.core.ServiceRegistry.async_call", new=AsyncMock()) as call,
    ):
        await ctrl.async_evaluate_shading()
    assert not [c for c in call.await_args_list if c.args[0] == "cover"]
    assert ctrl.shading_summary()["reason"] == "window_open"


async def test_shading_hysterese_oeffnet_nicht_sofort(hass: HomeAssistant, trv, sensors) -> None:
    """Zu wegen Sonne: knapp unter der Grenze bleibt er zu (kein Auf/Zu alle 5 Minuten)."""
    _room, ctrl = await _setup_room(hass, shading_min_temp=22.0, shading_outdoor_min=40.0)
    ctrl._shading_state, ctrl._shading_reason = STATE_CLOSED, "sun"
    with patch.object(type(ctrl), "current_temperature", new=21.5):
        assert ctrl._shading_hot() is True
    with patch.object(type(ctrl), "current_temperature", new=20.9):
        assert ctrl._shading_hot() is False


async def test_shading_ohne_position_faehrt_nicht_dauernd(hass: HomeAssistant, trv, sensors) -> None:
    _room, ctrl = await _setup_room(hass)
    hass.states.async_set(COVER, "closed", {"supported_features": 3})
    await hass.async_block_till_done()
    with patch("homeassistant.core.ServiceRegistry.async_call", new=AsyncMock()) as call:
        assert await ctrl._shading_move(COVER, "close") is True
    call.assert_not_awaited()
