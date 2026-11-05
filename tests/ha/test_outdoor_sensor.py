"""Außentemperatur aus eigener Wetterstation (Issue #21)."""

from __future__ import annotations

from homeassistant.core import HomeAssistant


async def test_eigener_fuehler_hat_vorrang(hass: HomeAssistant, setup) -> None:
    hub_entry, _room = setup
    hub = hub_entry.runtime_data
    hass.states.async_set("weather.dienst", "sunny", {"temperature": 4.0})
    hass.states.async_set("sensor.garten_temperatur", "11.5", {"device_class": "temperature"})
    hass.config_entries.async_update_entry(
        hub_entry,
        options={**hub_entry.options, "weather_entity": "weather.dienst", "outdoor_temp_entity": "sensor.garten_temperatur"},
    )
    await hass.async_block_till_done()

    assert hub.outdoor_temp() == 11.5


async def test_ohne_fuehler_gilt_der_wetterdienst(hass: HomeAssistant, setup) -> None:
    hub_entry, _room = setup
    hub = hub_entry.runtime_data
    hass.states.async_set("weather.dienst", "sunny", {"temperature": 4.0})
    hass.config_entries.async_update_entry(
        hub_entry, options={**hub_entry.options, "weather_entity": "weather.dienst", "outdoor_temp_entity": None}
    )
    await hass.async_block_till_done()

    assert hub.outdoor_temp() == 4.0


async def test_ausgefallener_fuehler_faellt_auf_wetter_zurueck(hass: HomeAssistant, setup) -> None:
    """Sensor weg oder „unavailable": die Regelung darf nicht blind werden."""
    hub_entry, _room = setup
    hub = hub_entry.runtime_data
    hass.states.async_set("weather.dienst", "sunny", {"temperature": 3.5})
    hass.states.async_set("sensor.garten_temperatur", "unavailable", {"device_class": "temperature"})
    hass.config_entries.async_update_entry(
        hub_entry,
        options={**hub_entry.options, "weather_entity": "weather.dienst", "outdoor_temp_entity": "sensor.garten_temperatur"},
    )
    await hass.async_block_till_done()

    assert hub.outdoor_temp() == 3.5
