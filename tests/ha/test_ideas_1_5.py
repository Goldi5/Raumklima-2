"""Ideen 1–5: Feuchtequelle, Bauart je Raum, Tagesmittel-Anzeige, Funkbefehle, Benutzername."""

from __future__ import annotations

from datetime import timedelta

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from custom_components.raumklima.const import (
    CONF_HUMIDITY_SENSOR,
    CONF_OUTDOOR_TEMP,
    CONF_WALL,
    WALL_FRSI,
)
from custom_components.raumklima.planning import MoldGuard
from custom_components.raumklima.shared import domain_data, get_hub

from .conftest import FakeTrv

TEMP = "sensor.bad_temp"
HUMID = "sensor.bad_feuchte"
OUTSIDE = "sensor.aussen"


def _wire(hass: HomeAssistant, ctrl, hub) -> None:
    hass.states.async_set(TEMP, "20.0", {"device_class": "temperature", "unit_of_measurement": "°C"})
    hass.states.async_set(HUMID, "65", {"device_class": "humidity", "unit_of_measurement": "%"})
    hass.states.async_set(OUTSIDE, "3.5", {"device_class": "temperature", "unit_of_measurement": "°C"})
    ctrl.temp_sensor = TEMP
    ctrl.humidity_sensor = HUMID
    ctrl.config[CONF_HUMIDITY_SENSOR] = HUMID
    hub.config[CONF_OUTDOOR_TEMP] = OUTSIDE


# ---------------------------------------------------------------- 2) Bauart je Raum
async def test_bauart_aendert_den_schutzwert(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """Außenecke braucht mehr Schutz als eine Innenwand – gleicher Raum, gleiche Feuchte."""
    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    hub = get_hub(hass, None)
    _wire(hass, ctrl, hub)

    ctrl.config[CONF_WALL] = "corner"
    assert ctrl.room_frsi == WALL_FRSI["corner"]
    corner = ctrl.mold_min(hub)

    ctrl.mold_guard = MoldGuard()  # Hysterese zurücksetzen
    ctrl.config[CONF_WALL] = "interior"
    assert ctrl.room_frsi == WALL_FRSI["interior"]
    interior = ctrl.mold_min(hub)

    assert corner is not None and interior is not None
    assert corner > interior, "die Außenecke muss einen höheren Boden verlangen"


async def test_bauart_auto_nimmt_die_wohnung(hass: HomeAssistant, setup) -> None:
    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    hub = get_hub(hass, None)
    ctrl.config[CONF_WALL] = "auto"
    assert ctrl.room_frsi == hub.frsi


# ---------------------------------------------------------------- 4) Funkbefehle zählen
async def test_funkbefehle_werden_gezaehlt(hass: HomeAssistant, setup) -> None:
    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    ctrl._rf = {"day": dt_util.now().date().isoformat(), "sent": 0, "retries": 0}
    for attempts in (1, 1, 2, 3):
        ctrl._count_rf(attempts)
    assert ctrl.rf_today == {"sent": 4, "retries": 2}


async def test_funkbefehle_neuer_tag_beginnt_bei_null(hass: HomeAssistant, setup) -> None:
    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    ctrl._rf = {"day": "2020-01-01", "sent": 99, "retries": 40}
    assert ctrl.rf_today == {"sent": 0, "retries": 0}


# ---------------------------------------------------------------- 1) Feuchtequelle
def test_feuchteverlauf_wird_erkannt() -> None:
    """Steigt der Dampfdruck im 6-h-Fenster deutlich, ist die Quelle im Raum."""
    guard = MoldGuard()
    now = dt_util.utcnow()
    # 12 h bei 45 % (20 °C), dann 6 h bei 62 % – wie im Schlafzimmer beobachtet
    for hours in range(18, 6, -1):
        guard.add(now - timedelta(hours=hours), 20.0, 45.0)
    for hours in range(6, 0, -1):
        guard.add(now - timedelta(hours=hours), 20.0, 62.0)
    delta = guard.trend(now)
    assert delta is not None and delta > 1.2
    change = guard.rh_change(now)
    assert change is not None
    start, end, _hours = change
    assert start < end


def test_ruhige_feuchte_bleibt_still() -> None:
    guard = MoldGuard()
    now = dt_util.utcnow()
    for hours in range(18, 0, -1):
        guard.add(now - timedelta(hours=hours), 20.0, 50.0)
    assert guard.trend(now) is not None
    assert abs(guard.trend(now)) < 0.2


def test_tagesmittel_der_feuchte() -> None:
    guard = MoldGuard()
    now = dt_util.utcnow()
    for hours in range(24, 0, -1):
        guard.add(now - timedelta(hours=hours), 20.0, 60.0)
    assert guard.mean_rh(now) == 60.0


# ---------------------------------------------------------------- 5) Benutzername
async def test_benutzername_landet_im_protokoll(hass: HomeAssistant, setup) -> None:
    """Ohne Aufruf-Kontext bleibt der Text wie bisher – mit Kontext wird der Name genannt."""
    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    ctrl.target_temp = 20.0
    hub = get_hub(hass, None)
    await ctrl.async_set_target(21.0, by="Antje")
    texte = [str(e.get("why") or "") for e in hub.log.entries]
    assert any("Antje" in t for t in texte), texte[-3:]
