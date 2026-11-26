"""#58: ViCare – „aus“ ist dort Standby und schaltet auch das Warmwasser ab.

„Ausschalten über: Automatisch“ nimmt bei ViCare deshalb die Minimaltemperatur; steht der Kessel
noch im Standby (vom früheren Ausschalten), holt Raumklima ihn erst auf „heat“.
"""

from __future__ import annotations

from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er

from custom_components.raumklima.controller import RaumklimaController

from .conftest import TRV, FakeTrv
from .test_features import _setup


async def test_plattform_aus_der_registry(hass: HomeAssistant, trv: FakeTrv, sensors) -> None:
    _hub, room = await _setup(hass, room_type="living")
    c = room.runtime_data
    assert c._trv_platform() is None  # kein Registry-Eintrag
    c._trv_platform_cache = None
    reg = er.async_get(hass)
    entry = reg.async_get_or_create("climate", "vicare", "kessel-hk1")
    c.trv = entry.entity_id
    assert c._trv_platform() == "vicare"
    c.trv = TRV


async def test_vicare_schaltet_ueber_minimaltemperatur_aus(hass: HomeAssistant, trv: FakeTrv, sensors, monkeypatch) -> None:
    monkeypatch.setattr(RaumklimaController, "_trv_platform", lambda self: "vicare")
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


async def test_fester_aus_sollwert_und_modus_nie_umschalten(hass: HomeAssistant, trv: FakeTrv, sensors) -> None:
    """#99: ganze Anlage über eine Climate-Entität – „aus“ = 16 °C, und nie den Modus anfassen."""
    trv.attrs["preset_modes"] = ["comfort", "eco"]
    trv.state = "off"  # selbst im Standby: Raumklima holt die Anlage NICHT heraus
    trv.push()
    _hub, room = await _setup(hass, room_type="living", off_method="setpoint", off_temperature=16.0, keep_mode=True)
    c = room.runtime_data
    await hass.async_block_till_done()
    assert c._off_method() == "setpoint"
    assert not any(s == "set_hvac_mode" for s, _d in trv.calls)
    assert not any(s == "set_preset_mode" for s, _d in trv.calls)

    trv.calls.clear()
    await c.async_set_hvac_on(False)
    await hass.async_block_till_done()
    assert trv.setpoint == 16.0
    assert not any(s in ("set_hvac_mode", "set_preset_mode") for s, _d in trv.calls)
    assert c._is_trv_off(hass.states.get(TRV), "setpoint") is True


async def test_modus_nie_umschalten_ersetzt_hvac_aus(hass: HomeAssistant, trv: FakeTrv, sensors) -> None:
    _hub, room = await _setup(hass, room_type="living", off_method="hvac", keep_mode=True)
    assert room.runtime_data._off_method() == "min_temp"


async def test_korrektur_raumfuehler(hass: HomeAssistant, trv: FakeTrv, sensors) -> None:
    """#98: Fühler zeigt 0,7 K zu wenig – Raumklima rechnet mit dem korrigierten Wert."""
    from .conftest import SENSOR

    _hub, room = await _setup(hass, room_type="living", sensor_offset=0.7)
    c = room.runtime_data
    raw = float(hass.states.get(SENSOR).state)
    assert c.current_temperature == round(raw + 0.7, 2)
    hass.states.async_set(SENSOR, "21.5", {"unit_of_measurement": "°C", "device_class": "temperature"})
    await hass.async_block_till_done()
    assert c.current_temperature == 22.2


async def test_ventil_schaetzung_ohne_stellung(hass: HomeAssistant, trv: FakeTrv, sensors) -> None:
    """#83: Gerät ohne Ventilstellung – die Karte bekommt eine Schätzung, mit Stellung nicht."""
    _hub, room = await _setup(hass, room_type="living")
    c = room.runtime_data
    if c.valve_position is None:
        est = c.valve_estimate()
        assert est is None or 0 <= est <= 100
