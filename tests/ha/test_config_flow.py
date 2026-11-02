"""Einrichtungsassistent: erster Raum legt die Zentrale mit an."""

from __future__ import annotations

from homeassistant import config_entries
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.raumklima.const import CONF_ENTRY_TYPE, CONF_HOME, DOMAIN, ENTRY_HUB

from .conftest import SENSOR, TRV, WINDOW, FakeTrv


async def test_first_room_creates_hub(hass: HomeAssistant, trv: FakeTrv, sensors) -> None:
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})
    assert result["type"] is FlowResultType.FORM and result["step_id"] == "user"

    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"trv": TRV})
    assert result["step_id"] == "devices"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {"name": "Bad", "temperature_sensor": SENSOR, "window_sensors": [WINDOW]}
    )
    assert result["step_id"] == "room"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"room_type": "bathroom", "advanced": {"calibration_mode": "target", "off_method": "auto", "on_preset": "auto_detect",
                                               "window_open_delay": 10, "window_close_delay": 10, "follow_trv_changes": True}},
    )
    assert result["step_id"] == "hub"

    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"building_type": "renovated"})
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert result["title"] == "Bad"
    await hass.async_block_till_done()

    entries = hass.config_entries.async_entries(DOMAIN)
    assert len(entries) == 2
    assert sum(1 for e in entries if e.data.get(CONF_ENTRY_TYPE) == ENTRY_HUB) == 1


async def _flow_start(hass: HomeAssistant):
    """Assistent starten – bei bestehender Wohnung kommt zuerst das Menü."""
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})
    if result["step_id"] == "menu":
        result = await hass.config_entries.flow.async_configure(result["flow_id"], {"next_step_id": "add_room"})
    return result


async def test_same_trv_twice_aborts(hass: HomeAssistant, setup) -> None:
    result = await _flow_start(hass)
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"trv": TRV})
    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "already_configured"



async def test_extra_thermostat_cannot_be_main(hass: HomeAssistant, trv: FakeTrv, sensors) -> None:
    hass.states.async_set("climate.trv_bad_2", "heat", {})
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": "user"})
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"trv": TRV})
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {"name": "Bad", "temperature_sensor": SENSOR, "extra_trvs": [TRV]}
    )
    assert result["errors"] == {"extra_trvs": "extra_is_main"}
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {"name": "Bad", "temperature_sensor": SENSOR, "extra_trvs": ["climate.trv_bad_2"]}
    )
    assert result["step_id"] == "room"


ROOM_STEP = {
    "room_type": "bathroom",
    "advanced": {
        "calibration_mode": "target",
        "off_method": "auto",
        "on_preset": "auto_detect",
        "window_open_delay": 10,
        "window_close_delay": 10,
        "follow_trv_changes": True,
    },
}


async def _zweite_wohnung(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        domain=DOMAIN, title="Ferienwohnung", data={CONF_ENTRY_TYPE: ENTRY_HUB}, options={"name": "Ferienwohnung"}
    )
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


async def test_zweite_wohnung_fragt_nach_wohnung(hass: HomeAssistant, setup, sensors) -> None:
    """Bei zwei Wohnungen fragt der Assistent, zu welcher der neue Raum gehört."""
    zweite = await _zweite_wohnung(hass)
    trv2 = FakeTrv(hass, "climate.trv_kueche")

    result = await _flow_start(hass)
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"trv": trv2.entity_id})
    assert result["step_id"] == "devices"
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {"name": "Küche", "temperature_sensor": SENSOR, "window_sensors": []}
    )
    assert result["step_id"] == "room"
    result = await hass.config_entries.flow.async_configure(result["flow_id"], ROOM_STEP)
    assert result["step_id"] == "home"
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"home": zweite.entry_id})
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert result["result"].data[CONF_HOME] == zweite.entry_id


async def test_raum_in_andere_wohnung_verschieben(hass: HomeAssistant, setup, hass_ws_client) -> None:
    """Wohnung eines bestehenden Raums wechseln – der Raum hängt danach an der anderen Wohnung."""
    _hub, room = setup
    zweite = await _zweite_wohnung(hass)

    client = await hass_ws_client(hass)
    await client.send_json_auto_id(
        {"type": "raumklima/room/update", "entry_id": room.entry_id, "changes": {CONF_HOME: zweite.entry_id}}
    )
    msg = await client.receive_json()
    assert msg["success"], msg
    await hass.async_block_till_done()

    st = hass.states.get("climate.bad")
    assert st is not None
    assert st.attributes["home"] == zweite.entry_id
    assert st.attributes["home_name"] == "Ferienwohnung"


async def test_neue_wohnung_ueber_die_integration(hass: HomeAssistant, setup, sensors) -> None:
    """„Neue Wohnung" im Assistenten: eigener Eintrag, und der Raum hängt daran."""
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})
    assert result["step_id"] == "menu"
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"next_step_id": "new_home"})
    assert result["step_id"] == "user"

    trv2 = FakeTrv(hass, "climate.trv_kueche")
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"trv": trv2.entity_id})
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {"name": "Küche", "temperature_sensor": SENSOR, "window_sensors": []}
    )
    result = await hass.config_entries.flow.async_configure(result["flow_id"], ROOM_STEP)
    assert result["step_id"] == "hub"
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {"name": "Ferienwohnung", "building_type": "renovated"}
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    home = result["result"].data[CONF_HOME]
    hubs = {
        e.entry_id: e.title
        for e in hass.config_entries.async_entries(DOMAIN)
        if e.data.get(CONF_ENTRY_TYPE) == ENTRY_HUB
    }
    assert hubs.get(home) == "Ferienwohnung"
