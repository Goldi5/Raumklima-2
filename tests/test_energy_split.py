"""PV-Trennung und günstiger Strom."""

from __future__ import annotations

from types import SimpleNamespace

from custom_components.raumklima.hub import RaumklimaHub
from custom_components.raumklima.report_extra import pv_split


def test_pv_split():
    assert pv_split(20.0, 40) == {"pv_kwh": 20.0, "self_kwh": 8.0, "surplus_kwh": 12.0}
    assert pv_split(None, 40) is None


def test_cheap_now_uses_tariff_entity():
    values = {
        "energy_tariff": "sensor.price",
        "energy_price": 0.30,
        "energy_preheat_cheap": True,
        "energy_cheap_price": 0.20,
        "energy_factor": 10.0,
    }
    hass = SimpleNamespace(states=SimpleNamespace(get=lambda eid: SimpleNamespace(
        state="0.15", attributes={"unit_of_measurement": "€/kWh"})))
    fake = SimpleNamespace(hass=hass, opt=lambda key, default=None: values.get(key, default))
    fake.energy_price_now = lambda: RaumklimaHub.energy_price_now(fake)
    assert fake.energy_price_now() == 0.15
    assert RaumklimaHub.energy_cheap_now(fake) is True

    hass.states.get = lambda eid: SimpleNamespace(state="0.30", attributes={})
    assert RaumklimaHub.energy_cheap_now(fake) is False
