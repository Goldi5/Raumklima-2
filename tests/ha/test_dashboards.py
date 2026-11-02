"""Dashboard-Liste für den Wohnungs-Umschalter."""

from __future__ import annotations

from homeassistant.core import HomeAssistant
from homeassistant.setup import async_setup_component


async def test_dashboards_befehl_listet_neue_dashboards(hass: HomeAssistant, setup, hass_ws_client) -> None:
    """Angelegte Dashboards kennt die Zentrale – darauf verlinkt der Umschalter (Issue #10)."""
    assert await async_setup_component(hass, "lovelace", {})
    client = await hass_ws_client(hass)

    await client.send_json_auto_id(
        {"type": "lovelace/dashboards/create", "url_path": "heizung-remscheid", "title": "Remscheid"}
    )
    msg = await client.receive_json()
    assert msg["success"], msg
    await hass.async_block_till_done()

    await client.send_json_auto_id({"type": "raumklima/dashboards"})
    msg = await client.receive_json()
    assert msg["success"], msg
    assert "heizung-remscheid" in msg["result"]["dashboards"]
