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
    fake.tariff_entities = lambda: RaumklimaHub.tariff_entities(fake)
    fake.tariff_value = lambda eid: RaumklimaHub.tariff_value(fake, eid)
    fake.energy_price_now = lambda: RaumklimaHub.energy_price_now(fake)
    fake.electric_price_now = lambda: RaumklimaHub.electric_price_now(fake)
    fake.energy_source = lambda: "electric"
    assert fake.energy_price_now() == 0.15
    assert RaumklimaHub.energy_cheap_now(fake) is True

    hass.states.get = lambda eid: SimpleNamespace(state="0.30", attributes={})
    assert RaumklimaHub.energy_cheap_now(fake) is False


def _hub(values, states):
    hass = SimpleNamespace(states=SimpleNamespace(get=lambda eid: states.get(eid)))
    fake = SimpleNamespace(hass=hass, opt=lambda key, default=None: values.get(key, default))
    fake.energy_source = lambda: values.get("energy_source", "electric")
    fake.tariff_entities = lambda: RaumklimaHub.tariff_entities(fake)
    fake.tariff_value = lambda eid: RaumklimaHub.tariff_value(fake, eid)
    return fake


def test_reserve_preisquelle_springt_ein():
    """Hauptquelle ohne Wert → erste Reserve mit Wert; ct/kWh wird umgerechnet."""
    states = {
        "sensor.anbieter": SimpleNamespace(state="unavailable", attributes={}, name="Anbieter"),
        "sensor.epex": SimpleNamespace(state="32.5", attributes={"unit_of_measurement": "ct/kWh"}, name="EPEX"),
    }
    fake = _hub({"energy_tariff": "sensor.anbieter", "energy_tariff_fallbacks": ["sensor.epex"], "energy_price": 0.3}, states)
    assert RaumklimaHub.energy_price_now(fake) == 0.325


def test_netto_preis_mit_abgaben_und_mwst_gilt_auch_fuer_die_steuerung():
    """Steuerung und Bericht rechnen gleich: (Börse + Abgaben) × MwSt."""
    states = {"sensor.boerse": SimpleNamespace(state="0.10", attributes={"unit_of_measurement": "€/kWh"}, name="B")}
    fake = _hub({
        "energy_tariff": "sensor.boerse", "energy_price_basis": "net", "energy_vat": 19.0, "energy_extra_fee": 0.15,
    }, states)
    assert RaumklimaHub.energy_price_now(fake) == round(0.25 * 1.19, 4)


def test_ohne_preisquelle_gilt_der_feste_preis():
    fake = _hub({"energy_price": 0.31}, {})
    assert RaumklimaHub.energy_price_now(fake) == 0.31
