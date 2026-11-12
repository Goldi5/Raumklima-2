"""Präsenzmelder-Logik ohne Home Assistant."""

from datetime import UTC, datetime, timedelta

from custom_components.raumklima.occupancy import (
    KIND_MMWAVE,
    KIND_PIR,
    Reading,
    occupancy,
    presence_heat,
    recently_seen,
    room_eco_enabled,
    room_eco_target,
    sensor_kind,
)

NOW = datetime(2026, 11, 1, 12, 0, tzinfo=UTC)


def ago(minutes: float) -> datetime:
    return NOW - timedelta(minutes=minutes)


def test_kind_from_device_class():
    assert sensor_kind("occupancy") == KIND_MMWAVE
    assert sensor_kind("presence") == KIND_MMWAVE
    assert sensor_kind("motion") == KIND_PIR
    assert sensor_kind(None) == KIND_PIR
    assert sensor_kind("motion", "mmwave") == KIND_MMWAVE


def test_mmwave_empty_soon_pir_late():
    # mmWave: 5 min aus → leer (Nachlauf 3 min)
    occ, since = occupancy([Reading(KIND_MMWAVE, False, ago(5))], NOW)
    assert occ is False and since == ago(2)
    # PIR: 5 min ohne Bewegung → noch besetzt (Nachlauf 20 min)
    assert occupancy([Reading(KIND_PIR, False, ago(5))], NOW) == (True, None)
    occ, since = occupancy([Reading(KIND_PIR, False, ago(30))], NOW)
    assert occ is False and since == ago(10)


def test_any_on_and_unavailable():
    assert occupancy([Reading(KIND_PIR, True, ago(60)), Reading(KIND_MMWAVE, False, ago(60))], NOW) == (True, None)
    assert occupancy([Reading(KIND_MMWAVE, None, ago(1))], NOW) == (None, None)
    # ausgefallener Melder wird ignoriert
    occ, _ = occupancy([Reading(KIND_MMWAVE, None, ago(1)), Reading(KIND_MMWAVE, False, ago(10))], NOW)
    assert occ is False


def test_recently_seen_weights_pir_lower_for_home():
    pir = [Reading(KIND_PIR, True, ago(1))]
    assert not recently_seen(pir, NOW, (KIND_MMWAVE,))
    assert recently_seen(pir, NOW, (KIND_MMWAVE, KIND_PIR))
    assert recently_seen([Reading(KIND_MMWAVE, False, ago(4))], NOW, (KIND_MMWAVE,))
    assert not recently_seen([Reading(KIND_MMWAVE, False, ago(6))], NOW, (KIND_MMWAVE,))


def test_room_eco_auto_needs_mmwave_and_room_type():
    assert room_eco_enabled("auto", "living", [KIND_MMWAVE])
    assert not room_eco_enabled("auto", "living", [KIND_PIR])
    assert not room_eco_enabled("auto", "bedroom", [KIND_MMWAVE])
    assert room_eco_enabled("on", "bedroom", [KIND_PIR])
    assert not room_eco_enabled("off", "living", [KIND_MMWAVE])
    assert not room_eco_enabled("on", "living", [])


def test_room_eco_target_floor():
    assert room_eco_target(21.0, 1.5, 18.0) == 19.5
    assert room_eco_target(19.0, 1.5, 18.5) == 18.5
    assert room_eco_target(17.0, 1.5, 18.0) == 17.0  # nie über den Wunsch


# ---------------------------------------------------------------- Anwesenheits-Temperatur

D, R = timedelta(minutes=5), timedelta(minutes=5)


def test_anwesenheit_erst_nach_wartezeit_dann_bis_freigabe():
    now = ago(0)
    on = [Reading(KIND_MMWAVE, True, ago(3))]
    active, since, wake = presence_heat(on, now, None, D, R)
    assert not active and since == ago(3) and wake == ago(3) + D  # erst 3 min da
    active, since, wake = presence_heat(on, ago(-3), since, D, R)
    assert active and wake is None  # 6 min da: gilt
    off = [Reading(KIND_MMWAVE, False, ago(-4))]
    active, since2, wake = presence_heat(off, ago(-6), since, D, R)
    assert active and since2 == since and wake == ago(-4) + R  # 2 min leer: gilt weiter
    active, since3, wake = presence_heat(off, ago(-9), since, D, R)
    assert not active and since3 is None  # 5 min leer: vorbei


def test_kurzer_aussetzer_unterbricht_nicht():
    since = ago(20)
    flicker = [Reading(KIND_MMWAVE, False, ago(1))]
    assert presence_heat(flicker, ago(0), since, D, R)[0] is True
    back = [Reading(KIND_MMWAVE, True, ago(0))]
    active, s, _w = presence_heat(back, ago(0), since, D, R)
    assert active and s == since


def test_pir_zaehlt_nur_wenn_gewaehlt():
    pir = [Reading(KIND_PIR, True, ago(30))]
    assert presence_heat(pir, ago(0), None, D, R) == (False, None, None)
    assert presence_heat(pir, ago(0), None, D, R, kinds=(KIND_MMWAVE, KIND_PIR))[0] is True


def test_melder_kurz_weg_haelt_hoechstens_freigabezeit():
    since = ago(30)
    gone = [Reading(KIND_MMWAVE, None, ago(2))]
    active, s, wake = presence_heat(gone, ago(0), since, D, R)
    assert active and s == since and wake == ago(2) + R
    assert presence_heat([Reading(KIND_MMWAVE, None, ago(6))], ago(0), since, D, R) == (False, None, None)


def test_sofort_bei_wartezeit_null():
    on = [Reading(KIND_MMWAVE, True, ago(0))]
    assert presence_heat(on, ago(0), None, timedelta(0), R)[0] is True
