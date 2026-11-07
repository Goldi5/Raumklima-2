"""Raum mit zwei Thermostaten: jedes Gerät bekommt seinen eigenen Sollwert.

Anlass: Der Flur in einer Wohnung hat zwei Thermostate **verschiedener Modelle** und einen
externen Fühler. Die Karte zeigte einen Sollwert und ein Ø-Ventil — man konnte nicht sehen,
welches Gerät hängt oder warum das eine auf 20,0 und das andere auf 21,5 steht.
"""

from __future__ import annotations

from homeassistant.core import HomeAssistant

from custom_components.raumklima.const import DOMAIN

from .conftest import FakeTrv, hub_entry, room_entry

EXTRA = "climate.zusatz"


async def _setup(hass: HomeAssistant, extra: bool = True) -> tuple[object, object]:
    hass.states.async_set(EXTRA, "heat", {"temperature": 19.0, "current_temperature": 18.5})
    hub = hub_entry()
    hub.add_to_hass(hass)
    room = room_entry(**({"extra_trvs": [EXTRA]} if extra else {}))
    room.add_to_hass(hass)
    assert await hass.config_entries.async_setup(hub.entry_id)
    await hass.async_block_till_done()
    return hub, room


async def test_zusatzgeraet_hat_eigenen_erwarteten_sollwert(
    hass: HomeAssistant, trv: FakeTrv, sensors: None
) -> None:
    """Der erwartete Wert kommt aus dem eigenen Abgleich, nicht aus dem Raumwert."""
    _hub, room = await _setup(hass)
    ctrl = hass.data[DOMAIN]["rooms"][room.entry_id]
    extras = ctrl.settings_summary()["extra_trvs"]
    assert extras, "Zusatz-Thermostat fehlt in den Einstellungen"
    assert "setpoint_expected" in extras[0]
    assert extras[0]["entity_id"] == EXTRA


async def test_ohne_zusatzgeraet_keine_zeile(hass: HomeAssistant, trv: FakeTrv, sensors: None) -> None:
    _hub, room = await _setup(hass, extra=False)
    ctrl = hass.data[DOMAIN]["rooms"][room.entry_id]
    assert ctrl.settings_summary()["extra_trvs"] == []


def test_haengendes_zusatzgeraet_wird_mit_namen_gemeldet() -> None:
    """Steht ein Zusatzgerät dauerhaft woanders, nennt die Meldung das Gerät."""
    from custom_components.raumklima.health import check_setpoint_ignored

    issue = check_setpoint_ignored(30, 19.0, 21.0, device="Flur - Thermostat Tür")
    assert issue is not None
    assert issue.code == "setpoint_ignored"
    assert issue.title.startswith("Flur - Thermostat Tür")
    assert "21.0" in issue.message and "19.0" in issue.message
