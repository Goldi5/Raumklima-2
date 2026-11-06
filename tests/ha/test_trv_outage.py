"""Ausfall-Schwelle folgt dem tatsächlichen Meldetakt des Thermostats (Issue #33).

FRITZ!DECT meldet nur alle 15 Minuten. Die feste Grenze von 60 Sekunden erzeugte dort
Daueralarme („Thermostat nicht erreichbar"), obwohl das Gerät völlig normal funkte.
"""

from __future__ import annotations

from datetime import timedelta

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util


async def test_schwelle_folgt_gemessenem_takt(hass: HomeAssistant, setup) -> None:
    _hub, room = setup
    from custom_components.raumklima.shared import domain_data

    ctrl = domain_data(hass)["rooms"][room.entry_id]
    now = dt_util.utcnow()
    ctrl._trv_reports.clear()
    # vier Meldungen im 15-Minuten-Takt
    for minutes in (45, 30, 15, 0):
        ctrl._trv_reports.append(now - timedelta(minutes=minutes))

    assert ctrl.trv_expected_interval == 900  # 15 min
    # zwei Meldeabstände plus eine Minute Reserve
    assert ctrl.outage_seconds == 1860


async def test_ohne_messwerte_gilt_der_geraetetakt(hass: HomeAssistant, setup) -> None:
    _hub, room = setup
    from custom_components.raumklima.shared import domain_data

    ctrl = domain_data(hass)["rooms"][room.entry_id]
    ctrl._trv_reports.clear()

    # kein Messwert, kein Registry-Eintrag (Testumgebung) → Standard 5 min
    assert ctrl.trv_expected_interval == 300
    assert ctrl.outage_seconds == 660


async def test_schnelles_geraet_behaelt_die_reserve(hass: HomeAssistant, setup) -> None:
    _hub, room = setup
    from custom_components.raumklima.shared import domain_data

    ctrl = domain_data(hass)["rooms"][room.entry_id]
    now = dt_util.utcnow()
    ctrl._trv_reports.clear()
    # Meldetakt 10 s (Zigbee, dauerhaft verbunden) → Schwelle bleibt mindestens 60 s
    for seconds in (30, 20, 10, 0):
        ctrl._trv_reports.append(now - timedelta(seconds=seconds))

    assert ctrl.trv_expected_interval == 10
    # zwei Meldeabstände (20 s) plus die Minute Reserve
    assert ctrl.outage_seconds == 80
