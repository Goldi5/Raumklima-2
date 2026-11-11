"""Hinweise nur an anwesende Personen – und dringende Meldungen weiter an alle."""

from __future__ import annotations

from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import async_mock_service

from custom_components.raumklima.const import KIND_REPORT, KIND_TOO_COLD, KIND_VENT_OPEN

from .conftest import FakeTrv
from .test_features import _setup

PHONE_A = "notify.mobile_app_a"
PHONE_B = "notify.mobile_app_b"


async def _hub(hass: HomeAssistant, opts: dict | None = None):
    hub_entry, _room = await _setup(
        hass, {"recipients": {PHONE_A: [KIND_VENT_OPEN, KIND_TOO_COLD, KIND_REPORT], PHONE_B: [KIND_VENT_OPEN, KIND_TOO_COLD, KIND_REPORT]}, **(opts or {})}
    )
    hub = hub_entry.runtime_data
    hub.persons = {
        "person.a": {"name": "Person A", "present": False},
        "person.b": {"name": "Person B", "present": True},
    }
    return hub


async def test_hint_geht_nur_an_anwesende(hass: HomeAssistant, trv: FakeTrv, sensors) -> None:
    """Person A ist 80 km entfernt – sie soll nicht gefragt werden, ob sie lüften kann."""
    phone_a = async_mock_service(hass, "notify", "mobile_app_a")
    phone_b = async_mock_service(hass, "notify", "mobile_app_b")
    hub = await _hub(hass)

    await hub.async_notify(KIND_VENT_OPEN, "💧 Bad: Bitte lüften", "Luftfeuchte 68 %")
    await hass.async_block_till_done()

    assert [c.data["message"] for c in phone_b] == ["Luftfeuchte 68 %"]
    assert phone_a == []


async def test_dringende_meldung_geht_an_alle(hass: HomeAssistant, trv: FakeTrv, sensors) -> None:
    phone_a = async_mock_service(hass, "notify", "mobile_app_a")
    phone_b = async_mock_service(hass, "notify", "mobile_app_b")
    hub = await _hub(hass)

    await hub.async_notify(KIND_TOO_COLD, "🥶 Bad: Raum kühlt aus", "Nur noch 15 °C")
    await hass.async_block_till_done()

    assert len(phone_a) == 1 and len(phone_b) == 1


async def test_option_aus_schickt_wieder_alles(hass: HomeAssistant, trv: FakeTrv, sensors) -> None:
    phone_a = async_mock_service(hass, "notify", "mobile_app_a")
    phone_b = async_mock_service(hass, "notify", "mobile_app_b")
    hub = await _hub(hass, {"notify_present_only": False})

    await hub.async_notify(KIND_VENT_OPEN, "💧 Bad: Bitte lüften", "Luftfeuchte 68 %")
    await hass.async_block_till_done()

    assert len(phone_a) == 1 and len(phone_b) == 1


async def test_niemand_da_wird_uebersprungen(hass: HomeAssistant, trv: FakeTrv, sensors) -> None:
    phone_a = async_mock_service(hass, "notify", "mobile_app_a")
    phone_b = async_mock_service(hass, "notify", "mobile_app_b")
    hub = await _hub(hass)
    hub.persons["person.b"]["present"] = False

    await hub.async_notify(KIND_VENT_OPEN, "💧 Bad: Bitte lüften", "Luftfeuchte 68 %")
    await hass.async_block_till_done()

    assert phone_a == [] and phone_b == []
    assert any("nicht gesendet" in str(e.get("detail") or e.get("why") or "") for e in hub.log.entries)


async def test_bericht_kommt_auch_bei_abwesenheit(hass: HomeAssistant, trv: FakeTrv, sensors) -> None:
    """Berichte und andere Meldungen sind keine Lüft-Hinweise – sie kommen immer."""
    phone_a = async_mock_service(hass, "notify", "mobile_app_a")
    hub = await _hub(hass)

    await hub.async_notify(KIND_REPORT, "📊 Heizbericht", "Woche 45")
    await hass.async_block_till_done()

    assert len(phone_a) == 1
