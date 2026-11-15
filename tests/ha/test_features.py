"""Neue Funktionen: CO₂, Kalender, Sonne/Frostnacht, Geräte-Auslöser, CSV-Export."""

from __future__ import annotations

from datetime import date, timedelta
from unittest.mock import patch

from homeassistant.components.device_automation import DeviceAutomationType
from homeassistant.core import HomeAssistant, SupportsResponse
from homeassistant.helpers import device_registry as dr
from homeassistant.setup import async_setup_component
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_get_device_automations

from custom_components.raumklima.const import DOMAIN
from custom_components.raumklima.planning import ForecastHour
from custom_components.raumklima.room_dehumidify import DehumidifierManager

from .conftest import SENSOR, WINDOW, FakeTrv, hub_entry, room_entry

CO2 = "sensor.bad_co2"


async def _setup(hass: HomeAssistant, hub_opts: dict | None = None, **room_opts) -> tuple[MockConfigEntry, MockConfigEntry]:
    hub = hub_entry(**(hub_opts or {}))
    hub.add_to_hass(hass)
    room = room_entry(**room_opts)
    room.add_to_hass(hass)
    assert await hass.config_entries.async_setup(hub.entry_id)
    await hass.async_block_till_done()
    return hub, room


# ------------------------------------------------------------------ CO₂
async def test_co2_asks_to_air(hass: HomeAssistant, trv: FakeTrv, sensors) -> None:
    hass.states.async_set(CO2, "650", {"unit_of_measurement": "ppm", "device_class": "carbon_dioxide"})
    await _setup(hass, co2_sensor=CO2)
    assert hass.states.get("climate.bad").attributes["co2"] == 650
    hass.states.async_set(CO2, "1300", {"unit_of_measurement": "ppm", "device_class": "carbon_dioxide"})
    await hass.async_block_till_done()
    attrs = hass.states.get("climate.bad").attributes
    assert attrs["ventilation"] == "please_open"
    assert attrs["ventilation_reason"] == "co2"


# ------------------------------------------------------------------ Kalender
async def test_calendar_vacation_and_homeoffice(hass: HomeAssistant, trv: FakeTrv, sensors) -> None:
    hass.states.async_set("calendar.familie", "off", {"message": ""})
    hass.states.async_set("zone.home", "0", {"latitude": 52.5, "longitude": 13.4, "radius": 100})
    hass.states.async_set("person.b", "not_home", {"device_trackers": []})
    hub, _room = await _setup(hass, {"calendar_entity": "calendar.familie", "residents": ["person.b"], "zone": "zone.home"})
    h = hub.runtime_data
    h.last_present = dt_util.utcnow() - timedelta(hours=1)

    hass.states.async_set("calendar.familie", "on", {"message": "Urlaub Ostsee"})
    await hass.async_block_till_done()
    assert h.calendar_mode == "away"
    assert h.stage == "away_long"
    assert trv.setpoint < 22.0  # abgesenkt

    hass.states.async_set("calendar.familie", "on", {"message": "Homeoffice"})
    await hass.async_block_till_done()
    assert h.calendar_mode == "home"
    assert h.stage == "guests"
    assert trv.setpoint == 22.0


async def test_school_holidays_shift_morning_schedule(
    hass: HomeAssistant, trv: FakeTrv, sensors, freezer
) -> None:
    """Ein ganztägiger Ferientermin verschiebt nur das Morgenfenster."""
    from custom_components.raumklima.planning import schedule_target

    freezer.move_to("2026-06-15 14:00:00+00:00")  # 07:00 Ortszeit
    hass.states.async_set("calendar.school", "on", {"message": "Sommerferien"})
    events: list[dict] = [{"summary": "Sommerferien", "start": "2026-06-15", "end": "2026-06-17"}]

    async def _events(call):
        return {call.data["entity_id"]: {"events": events if call.data["entity_id"] == "calendar.school" else []}}

    hass.services.async_register("calendar", "get_events", _events, supports_response=SupportsResponse.ONLY)
    hub, room = await _setup(
        hass,
        {"school_calendar_entity": "calendar.school", "school_shift_minutes": 60},
        schedules=[{"start": "06:00", "end": "08:00", "temperature": 24.0}],
    )
    h = hub.runtime_data
    ctrl = room.runtime_data
    await h.async_check_calendar()
    assert h.school_holiday == "Sommerferien"
    assert ctrl.schedules[0]["start"] == "06:00"
    assert ctrl.plan_schedules[0]["start"] == "07:00"
    assert ctrl.plan_schedules[0]["end"] == "09:00"
    assert schedule_target(ctrl.plan_schedules, dt_util.now()) == 24.0
    assert h.school_holiday_dates == {date(2026, 6, 15), date(2026, 6, 16)}
    nxt = ctrl.next_plan_window(dt_util.now())
    assert nxt is not None and (nxt[0].hour, nxt[0].minute) == (7, 0)

    events = []
    await h.async_check_calendar()
    assert h.school_holiday is None
    assert ctrl.plan_schedules[0]["start"] == "06:00"


# ------------------------------------------------------------------ Wetter
def _forecast(now, conds, temps=None):
    return [ForecastHour(now + timedelta(hours=i), (temps or [5] * len(conds))[i], c) for i, c in enumerate(conds)]


async def test_sunny_room_heats_one_degree_less(hass: HomeAssistant, trv: FakeTrv, sensors) -> None:
    hass.states.async_set(SENSOR, "21.8")
    hub, room = await _setup(hass, solar_gain=True)
    h = hub.runtime_data
    controller = room.runtime_data
    h.forecast_hourly = _forecast(dt_util.utcnow(), ["sunny"] * 4)
    controller.on_hub_change()
    await hass.async_block_till_done()
    assert controller.plan() == (True, 21.0, "solar")
    assert trv.setpoint == 21.0
    # Sonne weg → wieder Wunschtemperatur
    h.forecast_hourly = _forecast(dt_util.utcnow(), ["cloudy"] * 4)
    controller.on_hub_change()
    await hass.async_block_till_done()
    assert trv.setpoint == 22.0


async def test_frost_night_halves_setback(hass: HomeAssistant, trv: FakeTrv, sensors) -> None:
    hub, room = await _setup(hass)
    h, controller = hub.runtime_data, room.runtime_data
    h.set_vacation(True)
    # Präsenz ist nicht eingerichtet → Stufe direkt setzen
    h.stage = "away_long"
    assert controller.plan()[1] == 16.0  # Bad: länger weg 16 °C
    h.forecast_hourly = _forecast(dt_util.utcnow(), ["clear-night"] * 6, temps=[-2, -4, -7, -8, -6, -4])
    assert controller.plan()[1] == 19.0  # halb so tief: (16 + 22) / 2
    assert controller.frost_night_low == -8


# ------------------------------------------------------------------ Geräte-Auslöser
async def test_device_triggers(hass: HomeAssistant, trv: FakeTrv, sensors) -> None:
    _hub, room = await _setup(hass)
    registry = dr.async_get(hass)
    if hasattr(registry, "async_get_device_by_identifier"):
        # ab Home Assistant 2026.3 ersetzt async_get_device(identifiers=…) diese Form
        device = registry.async_get_device_by_identifier((DOMAIN, room.entry_id), room.entry_id)
    else:
        device = registry.async_get_device(identifiers={(DOMAIN, room.entry_id)})
    triggers = await async_get_device_automations(hass, DeviceAutomationType.TRIGGER, device.id)
    types = {t["type"] for t in triggers}
    assert {"window_opened", "vent_please_open", "heating_paused"} <= types

    calls = []
    hass.services.async_register("test", "record", lambda call: calls.append(call.data))
    assert await async_setup_component(
        hass,
        "automation",
        {
            "automation": {
                "trigger": {"platform": "device", "domain": DOMAIN, "device_id": device.id, "type": "window_opened"},
                "action": {"service": "test.record", "data": {"ok": True}},
            }
        },
    )
    hass.states.async_set(WINDOW, "on")
    await hass.async_block_till_done()
    assert calls == [{"ok": True}]


# ------------------------------------------------------------------ CSV
async def test_csv_export(hass: HomeAssistant, trv: FakeTrv, sensors, hass_ws_client) -> None:
    hub, _room = await _setup(hass)
    hub.runtime_data.insights._on_tick(dt_util.utcnow())
    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": "raumklima/report/export"})
    msg = await client.receive_json()
    assert msg["success"], msg
    assert msg["result"]["filename"].endswith(".csv")
    lines = msg["result"]["csv"].strip().split("\n")
    assert lines[0].startswith("Datum;Raum;")
    assert len(lines) == 2 and ";Bad;" in lines[1]


def test_dashboard_slug() -> None:
    """Standard-Dashboardpfad einer Wohnung (auch für das automatische Anlegen)."""
    from custom_components.raumklima.hub import dashboard_slug

    assert dashboard_slug("Wohnung B") == "heizung-wohnung-b"
    assert dashboard_slug("Allgemein") == "heizung"
    assert dashboard_slug("Ferien Wohnung") == "heizung-ferien-wohnung"
    assert dashboard_slug("Größe") == "heizung-groesse"
    assert dashboard_slug("") == "heizung"



async def test_dehumidifier_switches_at_humidity_limit(
    hass: HomeAssistant, trv: FakeTrv, sensors, freezer
) -> None:
    """Entfeuchter schaltet an der Feuchtegrenze und mit Hysterese wieder aus."""
    calls: list[str] = []

    async def _fake_call(self, entity: str, on: bool) -> None:
        calls.append("turn_on" if on else "turn_off")
        hass.states.async_set(entity, "on" if on else "off")

    _hub, room = await _setup(hass, dehumidifier_entity="switch.dehumidifier")
    hass.states.async_set("switch.dehumidifier", "off")
    ctrl = room.runtime_data
    limit = ctrl.vent.humidity_limit

    with patch.object(DehumidifierManager, "_call", _fake_call):
        trv.set(current_humidity=limit + 2)
        ctrl.dehumidifier.update()
        await hass.async_block_till_done()
        assert calls[-1] == "turn_on"
        assert ctrl.dehumidifier.active

        freezer.tick(timedelta(minutes=11))
        trv.set(current_humidity=limit - 6)
        ctrl.dehumidifier.update()
        await hass.async_block_till_done()
        assert calls[-1] == "turn_off"
        assert not ctrl.dehumidifier.active
