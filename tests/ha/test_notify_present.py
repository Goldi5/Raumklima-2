"""Hinweise nur an anwesende Personen – und dringende Meldungen weiter an alle."""

from __future__ import annotations

from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import async_mock_service

from custom_components.raumklima.const import KIND_TOO_COLD, KIND_VENT_OPEN

from .conftest import FakeTrv
from .test_features import _setup

CHRISTIAN = "notify.mobile_app_christian"
ANTJE = "notify.mobile_app_antje"


async def _hub(hass: HomeAssistant, opts: dict | None = None):
    hub_entry, _room = await _setup(
        hass, {"recipients": {CHRISTIAN: [KIND_VENT_OPEN, KIND_TOO_COLD], ANTJE: [KIND_VENT_OPEN, KIND_TOO_COLD]}, **(opts or {})}
    )
    hub = hub_entry.runtime_data
    hub.persons = {
        "person.christian": {"name": "Christian", "present": False},
        "person.antje": {"name": "Antje", "present": True},
    }
    return hub


async def test_hint_geht_nur_an_anwesende(hass: HomeAssistant, trv: FakeTrv, sensors) -> None:
    """Christian ist 80 km entfernt – er soll nicht gefragt werden, ob er lüften kann."""
    christian = async_mock_service(hass, "notify", "mobile_app_christian")
    antje = async_mock_service(hass, "notify", "mobile_app_antje")
    hub = await _hub(hass)

    await hub.async_notify(KIND_VENT_OPEN, "💧 Bad: Bitte lüften", "Luftfeuchte 68 %")
    await hass.async_block_till_done()

    assert [c.data["message"] for c in antje] == ["Luftfeuchte 68 %"]
    assert christian == []


async def test_dringende_meldung_geht_an_alle(hass: HomeAssistant, trv: FakeTrv, sensors) -> None:
    christian = async_mock_service(hass, "notify", "mobile_app_christian")
    antje = async_mock_service(hass, "notify", "mobile_app_antje")
    hub = await _hub(hass)

    await hub.async_notify(KIND_TOO_COLD, "🥶 Bad: Raum kühlt aus", "Nur noch 15 °C")
    await hass.async_block_till_done()

    assert len(christian) == 1 and len(antje) == 1


async def test_option_aus_schickt_wieder_alles(hass: HomeAssistant, trv: FakeTrv, sensors) -> None:
    christian = async_mock_service(hass, "notify", "mobile_app_christian")
    antje = async_mock_service(hass, "notify", "mobile_app_antje")
    hub = await _hub(hass, {"notify_present_only": False})

    await hub.async_notify(KIND_VENT_OPEN, "💧 Bad: Bitte lüften", "Luftfeuchte 68 %")
    await hass.async_block_till_done()

    assert len(christian) == 1 and len(antje) == 1


async def test_niemand_da_wird_uebersprungen(hass: HomeAssistant, trv: FakeTrv, sensors) -> None:
    christian = async_mock_service(hass, "notify", "mobile_app_christian")
    antje = async_mock_service(hass, "notify", "mobile_app_antje")
    hub = await _hub(hass)
    hub.persons["person.antje"]["present"] = False

    await hub.async_notify(KIND_VENT_OPEN, "💧 Bad: Bitte lüften", "Luftfeuchte 68 %")
    await hass.async_block_till_done()

    assert christian == [] and antje == []
    assert any("nicht gesendet" in str(e.get("detail") or e.get("why") or "") for e in hub.log.entries)
