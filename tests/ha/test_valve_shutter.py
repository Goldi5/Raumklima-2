"""Ventilsensor-Erkennung: Rollläden sind keine Ventile (Issue #11)."""

from __future__ import annotations

from homeassistant.core import HomeAssistant

from .conftest import FakeTrv


async def test_rollladen_position_ist_kein_ventil(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """Rollladen-Positionsgeber im selben Bereich darf nicht als Ventil gelten."""
    from homeassistant.helpers import device_registry as dr, entity_registry as er

    from custom_components.raumklima.shared import domain_data

    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    devs = dr.async_get(hass)
    regs = er.async_get(hass)

    wth = devs.async_get_or_create(config_entry_id=room.entry_id, identifiers={("demo", "wth-esszimmer")})
    regs.async_get_or_create("climate", "demo", "wth1", suggested_object_id="wth_esszimmer", device_id=wth.id)
    hass.states.async_set("climate.wth_esszimmer", "heat")
    ctrl.trv = "climate.wth_esszimmer"

    shade = devs.async_get_or_create(config_entry_id=room.entry_id, identifiers={("demo", "ra-esszimmer")})
    regs.async_get_or_create(
        "sensor", "demo", "ra1", suggested_object_id="ra_esszimmer_position_ch3", device_id=shade.id
    )
    hass.states.async_set("sensor.ra_esszimmer_position_ch3", "50", {"unit_of_measurement": "%"})

    body = devs.async_get_or_create(config_entry_id=room.entry_id, identifiers={("demo", "heizkoerper")})
    regs.async_get_or_create("climate", "demo", "hk1", suggested_object_id="bad_heizkoerper", device_id=body.id)
    regs.async_get_or_create(
        "sensor", "demo", "hk2", suggested_object_id="bad_ventil_offnungsgrad", device_id=body.id
    )
    hass.states.async_set("sensor.bad_ventil_offnungsgrad", "4", {"unit_of_measurement": "%"})

    assert ctrl._find_valve_sensor() == "sensor.bad_ventil_offnungsgrad"


async def test_rollladen_allein_bleibt_ohne_ventilanzeige(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """Ohne echten Ventilsensor lieber nichts anzeigen als die Rollladenposition."""
    from homeassistant.helpers import device_registry as dr, entity_registry as er

    from custom_components.raumklima.shared import domain_data

    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    devs = dr.async_get(hass)
    regs = er.async_get(hass)

    wth = devs.async_get_or_create(config_entry_id=room.entry_id, identifiers={("demo", "wth-nur")})
    regs.async_get_or_create("climate", "demo", "wth9", suggested_object_id="wth_nur", device_id=wth.id)
    hass.states.async_set("climate.wth_nur", "heat")
    ctrl.trv = "climate.wth_nur"

    shade = devs.async_get_or_create(config_entry_id=room.entry_id, identifiers={("demo", "ra-nur")})
    regs.async_get_or_create(
        "sensor", "demo", "ra9", suggested_object_id="ra_bad_position_ch1", device_id=shade.id
    )
    hass.states.async_set("sensor.ra_bad_position_ch1", "60", {"unit_of_measurement": "%"})

    assert ctrl._find_valve_sensor() is None
