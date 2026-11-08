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
from custom_components.raumklima.vent_manager import TOO_COLD_LOUD
from custom_components.raumklima.ventilation import (
    VENT_PLEASE_CLOSE,
    VENT_PLEASE_OPEN,
    VENT_TOO_COLD,
)


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


async def test_letzte_meldung_uebersteht_neustart(hass: HomeAssistant, setup, monkeypatch) -> None:
    """Nach einem Neustart gilt die Wiederholungssperre weiter.

    Die Zeitpunkte wurden gespeichert, aber nicht zurückgelesen: jeder Core-Start schickte dieselbe
    Meldung sofort erneut, obwohl sie Minuten vorher schon raus war.
    """
    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    vent = ctrl.vent
    now = dt_util.utcnow()
    vent._last_sent[VENT_PLEASE_OPEN] = now
    vent._repeat_count[VENT_TOO_COLD] = TOO_COLD_LOUD
    stored = vent.export()

    # Neustart: nur der Speicher kommt zurück, der Manager ist neu.
    vent._last_sent.clear()
    vent._repeat_count.clear()
    vent.load(stored)

    assert vent._last_sent[VENT_PLEASE_OPEN] == now, "Zeitpunkt der letzten Meldung geht nicht verloren"
    assert vent._repeat_count[VENT_TOO_COLD] == TOO_COLD_LOUD, "laute Phase bleibt gezählt"


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


async def test_luefthinweise_nur_im_zeitfenster(hass: HomeAssistant, setup) -> None:
    """Außerhalb 08–21 Uhr bleibt es still – geweckt wird niemand zum Lüften."""
    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    vent = ctrl.vent

    nachts = dt_util.as_utc(dt_util.now().replace(hour=3, minute=0, second=0, microsecond=0))
    mittags = dt_util.as_utc(dt_util.now().replace(hour=14, minute=0, second=0, microsecond=0))
    assert vent._vent_hint_allowed(nachts) is False
    assert vent._vent_hint_allowed(mittags) is True


async def test_deckel_erneuert_sich_nach_dem_lueften(hass: HomeAssistant, setup) -> None:
    """„Bis gelüftet wurde und dann erneut": nach einem echten Lüften ist der Deckel frei."""
    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    vent = ctrl.vent
    vent._sent_today.clear()

    now = dt_util.utcnow()
    for _ in range(NOTIFY_CAP_DEFAULT):
        vent._count_sent(VENT_PLEASE_OPEN, now)
    assert vent._cap_reached(VENT_PLEASE_OPEN, now) is True

    # Fenster war sechs Minuten offen und ist jetzt zu → Deckel erneuert
    vent._was_open = True
    vent._open_minutes_last = 6.0
    hass.states.async_set("binary_sensor.bad_fenster", "off", {"device_class": "window"})
    await hass.async_block_till_done()
    vent.update()
    assert vent._cap_reached(VENT_PLEASE_OPEN, now) is False, "nach dem Lüften wieder frei"

    # Kurzes Auf- und Zumachen (30 s) zählt nicht als Lüften
    for _ in range(NOTIFY_CAP_DEFAULT):
        vent._count_sent(VENT_PLEASE_OPEN, now)
    vent._was_open = True
    vent._open_minutes_last = 0.5
    vent.update()
    assert vent._cap_reached(VENT_PLEASE_OPEN, now) is True, "kurzes Öffnen erneuert nichts"
