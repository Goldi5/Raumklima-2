"""#58: ViCare – „aus“ ist dort Standby und schaltet auch das Warmwasser ab.

„Ausschalten über: Automatisch“ nimmt bei ViCare deshalb die Minimaltemperatur; steht der Kessel
noch im Standby (vom früheren Ausschalten), holt Raumklima ihn erst auf „heat“.
"""

from __future__ import annotations

from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er

from .conftest import TRV, FakeTrv
from .test_features import _setup


def _as_vicare(hass: HomeAssistant) -> None:
    reg = er.async_get(hass)
    entry = reg.async_get_or_create("climate", "vicare", "kessel-hk1", suggested_object_id=TRV.split(".", 1)[1])
    assert entry.entity_id == TRV


async def test_vicare_schaltet_ueber_minimaltemperatur_aus(hass: HomeAssistant, trv: FakeTrv, sensors) -> None:
    _as_vicare(hass)
    trv.attrs["preset_modes"] = ["comfort", "eco"]
    trv.attrs["preset_mode"] = "comfort"
    trv.state = "off"  # noch Standby vom früheren „Modus aus“
    trv.push()
    _hub, room = await _setup(hass, room_type="living", off_method="auto")
    c = room.runtime_data
    await hass.async_block_till_done()
    assert c._off_method() == "min_temp"
    # Raum ist zu kalt → heizen: erst aus dem Standby holen
    assert ("set_hvac_mode", {"hvac_mode": "heat"}) in trv.calls
    assert trv.state == "heat"

    trv.calls.clear()
    await c.async_set_hvac_on(False)
    await hass.async_block_till_done()
    # aus = Minimaltemperatur, nicht Standby
    assert ("set_hvac_mode", {"hvac_mode": "off"}) not in trv.calls
    assert trv.state == "heat"
    assert trv.setpoint == 5.0


async def test_andere_geraete_bleiben_bei_modus_aus(hass: HomeAssistant, trv: FakeTrv, sensors) -> None:
    trv.attrs["preset_modes"] = ["comfort", "eco"]
    trv.push()
    _hub, room = await _setup(hass, room_type="living", off_method="auto")
    assert room.runtime_data._off_method() == "hvac"


async def test_aufschlag_haelt_ventil_am_ziel_nicht_offen(hass: HomeAssistant, trv: FakeTrv, sensors) -> None:
    """#89: Thermostat misst am Heizkörper 3 K mehr. Unter dem Ziel steht Ziel + 3 K am Gerät,
    am Ziel nur noch das Ziel – sonst sitzt das Gerät auf seinem Sollwert und heizt weiter."""
    from .conftest import SENSOR

    trv.attrs["current_temperature"] = 22.0
    trv.push()
    _hub, room = await _setup(hass, room_type="living", calibration_mode="target")
    c = room.runtime_data
    await hass.async_block_till_done()
    c.shift = 3.0
    target = c.target_temp
    hass.states.async_set(SENSOR, str(target - 1.0), {"unit_of_measurement": "°C", "device_class": "temperature"})
    await hass.async_block_till_done()
    assert c._desired_setpoint() >= target + 2.5
    hass.states.async_set(SENSOR, str(target), {"unit_of_measurement": "°C", "device_class": "temperature"})
    await hass.async_block_till_done()
    assert c._desired_setpoint() == target
    assert c.trv_expected_target == target
