"""Empfänger-Prüfung: notify-Entitäten sind gültige Ziele, tote Ziele werden gemeldet."""

from __future__ import annotations

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from custom_components.raumklima.insights import target_exists


async def test_notify_entity_zaehlt_als_ziel(hass: HomeAssistant, setup) -> None:
    """Alexa Devices liefert notify-Entitäten – die dürfen nicht als fehlend gelten."""
    hub, _room = setup
    hass.states.async_set("notify.thomas_sonos_one_durchsagen", "unknown")
    hass.config_entries.async_update_entry(
        hub, options={**hub.options, "recipients": {"notify.thomas_sonos_one_durchsagen": ["health"]}}
    )
    await hass.async_block_till_done()

    hub.runtime_data.insights.check_health(dt_util.utcnow())
    await hass.async_block_till_done()

    codes = [issue.code for issue in hub.runtime_data.insights.issues.get("hub", [])]
    assert "notify_targets" not in codes
    assert target_exists(hass, "notify.thomas_sonos_one_durchsagen") is True


async def test_totes_ziel_wird_gemeldet(hass: HomeAssistant, setup) -> None:
    hub, _room = setup
    hass.config_entries.async_update_entry(
        hub, options={**hub.options, "recipients": {"notify.gibt_es_nicht": ["health"]}}
    )
    await hass.async_block_till_done()

    hub.runtime_data.insights.check_health(dt_util.utcnow())
    await hass.async_block_till_done()

    issues = {issue.code: issue for issue in hub.runtime_data.insights.issues.get("hub", [])}
    assert "notify_targets" in issues
    assert "notify.gibt_es_nicht" in issues["notify_targets"].message


async def test_unavailable_ziel_wird_gemeldet(hass: HomeAssistant, setup) -> None:
    """Eine nicht verfügbare Entität kann nichts empfangen."""
    hub, _room = setup
    hass.states.async_set("notify.sonos_durchsagen", "unavailable")
    hass.config_entries.async_update_entry(
        hub, options={**hub.options, "recipients": {"notify.sonos_durchsagen": ["health"]}}
    )
    await hass.async_block_till_done()

    hub.runtime_data.insights.check_health(dt_util.utcnow())
    await hass.async_block_till_done()

    codes = [issue.code for issue in hub.runtime_data.insights.issues.get("hub", [])]
    assert "notify_targets" in codes


async def test_zwei_wohnungen_senden_nur_an_eigene_empfaenger(hass: HomeAssistant, setup) -> None:
    """Zwei Wohnungen teilen keine Empfänger: jede Wohnung sendet nur an ihre eigene Liste."""
    from homeassistant.config_entries import SOURCE_IMPORT

    from custom_components.raumklima.const import DOMAIN

    hub, _room = setup
    hass.config_entries.async_update_entry(
        hub, options={**hub.options, "recipients": {"notify.berlin": ["health"]}}
    )
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": SOURCE_IMPORT}, data={"home_name": "Musterstadt"}
    )
    second = hass.config_entries.async_get_entry(result["result"].entry_id)
    hass.config_entries.async_update_entry(
        second, options={**second.options, "recipients": {"notify.zweite": ["health"]}}
    )
    await hass.async_block_till_done()

    sent: list[tuple[str, str]] = []

    async def _send(call) -> None:
        sent.append((call.service, call.data["message"]))

    hass.services.async_register("notify", "berlin", _send)
    hass.services.async_register("notify", "zweite", _send)

    await hub.runtime_data.async_notify("health", "Test", "berlin")
    await second.runtime_data.async_notify("health", "Test", "zweite")

    assert sent == [("berlin", "berlin"), ("zweite", "zweite")]
