"""Meldungsflut eindämmen: Tagesdeckel und CO₂-Grenze je Raum.

Hintergrund: In einem Wohnzimmer mit mehreren Personen liegt das CO₂ abends dauerhaft über
1000 ppm. „Bitte lüften" wiederholte sich alle 30 Minuten – 87 Meldungen in zwei Tagen aus
einem Raum. Der Deckel begrenzt die Wiederholung, die Raum-Grenze hebt die Schwelle an.
"""

from __future__ import annotations

from datetime import timedelta

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from custom_components.raumklima.const import CO2_LIMIT_DEFAULT, NOTIFY_CAP_DEFAULT
from custom_components.raumklima.shared import domain_data
from custom_components.raumklima.ventilation import VENT_PLEASE_CLOSE, VENT_PLEASE_OPEN


async def test_deckel_begrenzt_wiederholte_meldungen(hass: HomeAssistant, setup) -> None:
    """Nach drei Meldungen am Tag ist Schluss – der Zustand bleibt, die Erinnerung schweigt."""
    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    vent = ctrl.vent
    vent._sent_today.clear()
    assert NOTIFY_CAP_DEFAULT == 3

    now = dt_util.utcnow()
    for _ in range(NOTIFY_CAP_DEFAULT):
        assert vent._cap_reached(VENT_PLEASE_OPEN, now) is False
        vent._count_sent(VENT_PLEASE_OPEN, now)

    assert vent._cap_reached(VENT_PLEASE_OPEN, now) is True, "vierte Meldung wird unterdrückt"

    # Neuer Tag: der Deckel ist wieder frei.
    assert vent._cap_reached(VENT_PLEASE_OPEN, now + timedelta(days=1)) is False


async def test_deckel_gilt_nicht_fuer_fenster_schliessen(hass: HomeAssistant, setup) -> None:
    """„Fenster schließen" hängt an einer echten Öffnung und darf nie gedeckelt werden."""
    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    vent = ctrl.vent
    vent._sent_today.clear()

    now = dt_util.utcnow()
    for _ in range(10):
        vent._count_sent(VENT_PLEASE_CLOSE, now)
    assert vent._cap_reached(VENT_PLEASE_CLOSE, now) is False


async def test_deckel_null_schaltet_die_begrenzung_ab(hass: HomeAssistant, setup) -> None:
    """0 = unbegrenzt (bewusste Entscheidung des Nutzers)."""
    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    vent = ctrl.vent
    vent._sent_today.clear()
    vent._cfg["notify_cap"] = 0

    now = dt_util.utcnow()
    for _ in range(20):
        vent._count_sent(VENT_PLEASE_OPEN, now)
    assert vent._cap_reached(VENT_PLEASE_OPEN, now) is False


async def test_co2_grenze_kommt_aus_dem_raum(hass: HomeAssistant, setup) -> None:
    """Ohne Raum-Option gilt 1000 ppm; gesetzt gilt der Raumwert."""
    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    vent = ctrl.vent

    vent._cfg.pop("co2_limit", None)
    assert vent._co2_limit() == CO2_LIMIT_DEFAULT == 1000

    vent._cfg["co2_limit"] = 1200
    assert vent._co2_limit() == 1200

    # Unsinn fällt auf den Standard zurück, statt die Lüftung abzuschalten.
    vent._cfg["co2_limit"] = 99999
    assert vent._co2_limit() == CO2_LIMIT_DEFAULT
