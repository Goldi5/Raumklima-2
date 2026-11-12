"""notify-Entitäten (z. B. Alexa Devices) als Empfänger unterstützen."""

from __future__ import annotations

from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from pytest_homeassistant_custom_component.common import async_mock_service
import voluptuous as vol

from custom_components.raumklima.const import KIND_MOISTURE, KIND_VENT_OPEN
from custom_components.raumklima.notify_targets import notify_choices

from .conftest import FakeTrv
from .test_features import _setup

SONOS = "notify.wohnzimmer_sonos_one_durchsagen"


async def test_auswahl_enthaelt_notify_entitaeten(hass: HomeAssistant, trv: FakeTrv, sensors) -> None:
    """Die offizielle Alexa-Integration liefert Entitäten, keine Dienste."""
    hass.states.async_set(SONOS, "unknown")
    hass.states.async_set("notify.kaputt", "unavailable")
    choices = notify_choices(hass)
    assert SONOS in choices
    assert "notify.kaputt" not in choices  # nicht verfügbar → nicht anbieten


async def test_entitaet_wird_ueber_send_message_angesprochen(hass: HomeAssistant, trv: FakeTrv, sensors) -> None:
    hub_entry, _room = await _setup(hass, {"recipients": {SONOS: [KIND_VENT_OPEN]}})
    hass.states.async_set(SONOS, "unknown")
    send = async_mock_service(hass, "notify", "send_message")

    await hub_entry.runtime_data.async_notify(KIND_VENT_OPEN, "💧 Bad: Bitte lüften", "Luftfeuchte 68 %")
    await hass.async_block_till_done()

    assert len(send) == 1
    assert send[0].data["entity_id"] == SONOS
    assert send[0].data["message"] == "Luftfeuchte 68 %"
    assert send[0].data["title"] == "💧 Bad: Bitte lüften"


async def test_dienst_wird_weiter_klassisch_angesprochen(hass: HomeAssistant, trv: FakeTrv, sensors) -> None:
    """Ein echter Dienst (kein Zustand) läuft weiter über notify.<dienst>."""
    hub_entry, _room = await _setup(hass, {"recipients": {"notify.mobile_app_test": [KIND_VENT_OPEN]}})
    service = async_mock_service(hass, "notify", "mobile_app_test")
    send = async_mock_service(hass, "notify", "send_message")

    await hub_entry.runtime_data.async_notify(KIND_VENT_OPEN, "Titel", "Text")
    await hass.async_block_till_done()

    assert len(service) == 1 and send == []


async def test_entitaet_bekommt_in_ruhezeit_kein_push_data(hass: HomeAssistant, trv: FakeTrv, sensors) -> None:
    """send_message kennt nur message/title – data würde den Aufruf ungültig machen (Issue #45)."""
    hub_entry, _room = await _setup(hass, {"recipients": {SONOS: [KIND_MOISTURE]}})
    hub = hub_entry.runtime_data
    hass.states.async_set(SONOS, "unknown")
    send = async_mock_service(hass, "notify", "send_message")

    hub.quiet_now = lambda: True
    await hub.async_notify(KIND_MOISTURE, "Titel", "Text")
    await hass.async_block_till_done()

    assert len(send) == 1
    assert send[0].data["entity_id"] == SONOS
    assert "data" not in send[0].data


async def test_dienst_bekommt_in_ruhezeit_push_data(hass: HomeAssistant, trv: FakeTrv, sensors) -> None:
    """Companion-App-Dienste bekommen das Push-Attribut weiterhin."""
    hub_entry, _room = await _setup(hass, {"recipients": {"notify.mobile_app_test": [KIND_MOISTURE]}})
    hub = hub_entry.runtime_data
    service = async_mock_service(hass, "notify", "mobile_app_test")

    hub.quiet_now = lambda: True
    await hub.async_notify(KIND_MOISTURE, "Titel", "Text")
    await hass.async_block_till_done()

    assert service[0].data["data"] == {"push": {"interruption-level": "passive"}}


async def test_schickfehler_kommt_ins_protokoll(hass: HomeAssistant, trv: FakeTrv, sensors) -> None:
    """Eine abgelehnte Meldung darf nicht still verschwinden – sie gehört ins Log."""
    hub_entry, _room = await _setup(hass, {"recipients": {"notify.mobile_app_test": [KIND_MOISTURE]}})
    hub = hub_entry.runtime_data

    async def _boom(_call) -> None:
        raise HomeAssistantError("data not allowed")

    # Strenges Schema wie bei notify-Entitäten: message/title, kein data.
    hass.services.async_register(
        "notify",
        "mobile_app_test",
        _boom,
        schema=vol.Schema({vol.Required("message"): str, vol.Optional("title"): str}),
    )

    hub.quiet_now = lambda: True
    await hub.async_notify(KIND_MOISTURE, "Titel", "Text")
    await hass.async_block_till_done()

    assert any("fehlgeschlagen" in (e.get("msg") or "") for e in hub.log.entries)
