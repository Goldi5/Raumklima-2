"""Einrichtungsassistent: erster Raum legt die Zentrale mit an."""

from __future__ import annotations

from homeassistant import config_entries
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.raumklima.const import CONF_ENTRY_TYPE, CONF_HOME, CONF_TRV, DOMAIN, ENTRY_HUB

from .conftest import SENSOR, TRV, WINDOW, FakeTrv, hub_entry, room_entry


def test_ueberwachungsraum_schema_ohne_heizfelder() -> None:
    """Ohne Thermostat werden keine Heizwerte abgefragt – Raumtyp und CO₂ bleiben."""
    from custom_components.raumklima.config_flow import _room_schema

    def names(schema) -> set[str]:
        return {str(key) for key in schema.schema}

    monitor = names(_room_schema({}, [], monitor=True))
    assert {"room_type", "wall", "co2_limit", "notify_cap"} <= monitor
    assert not {"comfort_temperature", "setback_short", "setback_long", "trv_interval", "advanced"} & monitor

    normal = names(_room_schema({}, []))
    assert {"comfort_temperature", "setback_short", "setback_long", "trv_interval", "advanced"} <= normal


async def test_ueberwachungsraum_ueberspringt_technik(hass: HomeAssistant, trv: FakeTrv, sensors) -> None:
    """Der Änderungsdialog endet bei einem Raum ohne Thermostat ohne Technik-Schritt."""
    from custom_components.raumklima.shared import domain_data

    hub = hub_entry()
    hub.add_to_hass(hass)
    room = room_entry(trv="")
    room.add_to_hass(hass)
    assert await hass.config_entries.async_setup(hub.entry_id)
    await hass.async_block_till_done()
    assert domain_data(hass)["rooms"][room.entry_id].monitor is True

    result = await hass.config_entries.options.async_init(room.entry_id)
    assert result["step_id"] == "init"
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"temperature_sensor": SENSOR, "window_sensors": [WINDOW], "extra_trvs": []},
    )
    assert result["step_id"] == "room", result
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"room_type": "living"})
    assert result["type"] is FlowResultType.CREATE_ENTRY, result


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


async def test_ueberwachungsraum_ueber_den_assistenten(hass: HomeAssistant, setup, sensors) -> None:
    """„Nur überwachen": Raum ohne Thermostat anlegen (Fußbodenheizung ohne Aktor)."""
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})
    assert result["step_id"] == "menu"
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"next_step_id": "monitor"})
    assert result["step_id"] == "monitor"
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {"name": "Wohnzimmer", "temperature_sensor": SENSOR}
    )
    assert result["step_id"] == "room"
    # Ohne Thermostat fragt der Schritt nur Raumtyp, Bauart, CO₂-Grenze und Hinweis-Deckel ab.
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"room_type": "living"})
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert result["result"].data[CONF_TRV] == ""
