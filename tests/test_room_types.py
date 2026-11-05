"""Raumtypen: jeder Typ hat überall Werte hinterlegt (keine Lücken in den Tabellen)."""

from __future__ import annotations

from custom_components.raumklima.const import ROOM_TYPE_OPTIONS
from custom_components.raumklima.occupancy import ROOM_ECO_AUTO_TYPES
from custom_components.raumklima.planning import NIGHT_ROOM_TYPES, SETBACK_BY_ROOM
from custom_components.raumklima.ventilation import COMFORT_BY_ROOM, ROOM_TYPES, comfort_temperature, recommended_duration


def test_alle_typen_vollstaendig() -> None:
    for typ in ROOM_TYPE_OPTIONS:
        assert typ in SETBACK_BY_ROOM, f"Absenkung fehlt: {typ}"
        assert typ in ROOM_TYPES, f"Lüftwerte fehlen: {typ}"
        assert typ in COMFORT_BY_ROOM, f"Wunschtemperatur fehlt: {typ}"


def test_werte_sind_plausibel() -> None:
    for typ in ROOM_TYPE_OPTIONS:
        kurz, lang = SETBACK_BY_ROOM[typ]
        min_temp, humidity = ROOM_TYPES[typ]
        wunsch = COMFORT_BY_ROOM[typ]
        assert 14.0 <= lang <= kurz <= wunsch, f"{typ}: Absenkung unplausibel"
        assert 14.0 <= min_temp <= wunsch, f"{typ}: Mindesttemperatur unplausibel"
        assert 60.0 <= humidity <= 80.0, f"{typ}: Feuchtegrenze unplausibel"


def test_neue_typen() -> None:
    """Arbeitszimmer, Gästezimmer, Flur und Sportzimmer sind dabei und sinnvoll gesetzt."""
    for typ in ("office", "guest", "hallway", "gym"):
        assert typ in ROOM_TYPE_OPTIONS
        assert comfort_temperature(None, typ) == COMFORT_BY_ROOM[typ]

    assert COMFORT_BY_ROOM["office"] == 20.0  # UBA: Wohnbereich nicht über 20 °C
    assert SETBACK_BY_ROOM["hallway"] == (16.0, 15.0)  # Durchgangsraum darf kühler
    assert SETBACK_BY_ROOM["gym"][1] == 15.0
    # kein Schlafraum → keine Nachtabsenkung über die Ruhezeit
    assert not NIGHT_ROOM_TYPES & {"office", "guest", "hallway", "gym"}
    # leere Räume automatisch absenken (mit mmWave)
    assert {"office", "guest", "hallway", "gym"} <= set(ROOM_ECO_AUTO_TYPES)


def test_lueftdauer_haengt_nicht_am_typ() -> None:
    """Die empfohlene Lüftdauer kommt aus der Außentemperatur, nicht aus dem Raumtyp."""
    assert recommended_duration(2.0, 11) == recommended_duration(2.0, 5)
