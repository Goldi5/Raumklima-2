"""Knopf „In 15 min erinnern": muss ankommen, wirken und sichtbar sein.

Anlass: Der Knopf wurde auf der Uhr gedrückt, das Ereignis kam an (Protokollzeile) – aber
1. die Pause galt nicht für „Raum kühlt aus" (`kind != VENT_TOO_COLD` in `_notify_kind`),
2. sie wurde nicht gespeichert (`snoozed_until: null`), und
3. sie war in der Oberfläche nirgends zu sehen.
"""

from __future__ import annotations

from homeassistant.core import HomeAssistant

from custom_components.raumklima.const import DOMAIN

from .conftest import FakeTrv, hub_entry, room_entry


async def _setup(hass: HomeAssistant) -> tuple[object, object]:
    hub = hub_entry()
    hub.add_to_hass(hass)
    room = room_entry()
    room.add_to_hass(hass)
    assert await hass.config_entries.async_setup(hub.entry_id)
    await hass.async_block_till_done()
    return hub, room


async def test_snooze_knopf_setzt_pause(hass: HomeAssistant, trv: FakeTrv, sensors: None) -> None:
    _hub, room = await _setup(hass)
    ctrl = hass.data[DOMAIN]["rooms"][room.entry_id]

    hass.bus.async_fire(
        "mobile_app_notification_action",
        {"action": f"RAUMKLIMA_SNOOZE_{room.entry_id}"},
    )
    await hass.async_block_till_done()

    assert ctrl.vent.snooze_until is not None
    assert ctrl.vent.notify_paused_until is not None
    # gespeichert, damit ein Neustart die Pause nicht vergisst
    assert ctrl.vent.export()["snoozed_until"] is not None


async def test_pause_ist_in_der_oberflaeche_sichtbar(
    hass: HomeAssistant, trv: FakeTrv, sensors: None
) -> None:
    _hub, room = await _setup(hass)
    hass.bus.async_fire(
        "mobile_app_notification_action",
        {"action": f"RAUMKLIMA_SNOOZE_{room.entry_id}"},
    )
    await hass.async_block_till_done()

    state = hass.states.get("climate.bad")
    assert state is not None
    assert state.attributes.get("notify_paused_until")


async def test_fremde_aktion_wird_ignoriert(hass: HomeAssistant, trv: FakeTrv, sensors: None) -> None:
    """Ein Druck auf eine alte Push (andere Wohnung) darf hier nichts pausieren."""
    _hub, room = await _setup(hass)
    ctrl = hass.data[DOMAIN]["rooms"][room.entry_id]

    hass.bus.async_fire("mobile_app_notification_action", {"action": "RAUMKLIMA_SNOOZE_andere"})
    await hass.async_block_till_done()

    assert ctrl.vent.snooze_until is None
    assert ctrl.vent.notify_paused_until is None


async def test_dunkler_look_steht_in_den_raum_attributen(
    hass: HomeAssistant, trv: FakeTrv, sensors: None
) -> None:
    """Die Karten lesen die Optik-Einstellung aus `settings` – ohne eigenen Serveraufruf."""
    _hub, room = await _setup(hass)
    state = hass.states.get("climate.bad")
    assert state is not None
    assert state.attributes["settings"]["look_dark"] == "auto"
