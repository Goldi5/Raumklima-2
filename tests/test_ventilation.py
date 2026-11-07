"""Tests der Lüftungslogik."""

import pytest

from rk.ventilation import (
    VENT_AIRING,
    VENT_DONE,
    VENT_OK,
    VENT_PLEASE_CLOSE,
    VENT_PLEASE_OPEN,
    VENT_TOO_COLD,
    VentInput,
    absolute_humidity,
    airing_dries,
    dew_point,
    done_text,
    evaluate,
    in_quiet_hours,
    mold_risk,
    open_allowed,
    recommended_duration,
)


def base(**kw) -> VentInput:
    v = dict(
        window_open=False, open_minutes=0, room_temp=21.0, temp_at_open=21.0,
        humidity=55.0, humidity_high_minutes=0, humidity_limit=70.0,
        humidity_hysteresis=5.0, min_temp=18.0, max_drop=3.0, duration=5, dries=True,
    )
    v.update(kw)
    return VentInput(**v)


def test_dew_point_and_abs_humidity_plausible() -> None:
    assert dew_point(20, 50) == pytest.approx(9.3, abs=0.2)
    assert absolute_humidity(20, 50) == pytest.approx(8.6, abs=0.2)
    assert dew_point(None, 50) is None


@pytest.mark.parametrize("temp,minutes", [(-5, 4), (2, 5), (8, 10), (12, 15), (18, 20), (25, 30)])
def test_duration_by_outdoor(temp: float, minutes: int) -> None:
    assert recommended_duration(temp, 1) == minutes


def test_duration_month_fallback() -> None:
    assert recommended_duration(None, 1) == 5
    assert recommended_duration(None, 7) == 30


def test_airing_dries() -> None:
    assert airing_dries(10.0, 5.0)
    assert not airing_dries(10.0, 9.5)  # Sommer, schwül
    assert airing_dries(10.0, None)


def test_please_open_needs_delay_and_dries() -> None:
    assert evaluate(base(humidity=72, humidity_high_minutes=5)) == VENT_OK
    assert evaluate(base(humidity=72, humidity_high_minutes=20)) == VENT_PLEASE_OPEN
    assert evaluate(base(humidity=72, humidity_high_minutes=20, dries=False)) == VENT_OK


def test_window_states() -> None:
    assert evaluate(base(window_open=True, open_minutes=1)) == VENT_AIRING
    assert evaluate(base(window_open=True, open_minutes=6)) == VENT_PLEASE_CLOSE
    assert evaluate(base(window_open=True, open_minutes=4, humidity=60)) == VENT_DONE


def test_ausgetauschte_luft_mahnt_nicht_zum_schliessen() -> None:
    """Nach „Luft ausgetauscht" im selben Lüftvorgang kein „Fenster schließen" mehr.

    Vorher meldete die Integration „✅ Luft ausgetauscht – du kannst schließen" und eine
    Minute später „🪟 Fenster schließen – Lüftzeit von 5 min erreicht", danach alle fünf
    Minuten erneut.
    """
    assert evaluate(base(window_open=True, open_minutes=6)) == VENT_PLEASE_CLOSE
    assert evaluate(base(window_open=True, open_minutes=6, done_reported=True)) == VENT_DONE
    # Ohne brauchbare Luftwerte bleibt die Zeitgrenze zuständig (kein „fertig" ohne Messung).
    assert evaluate(base(window_open=True, open_minutes=12, humidity=None)) == VENT_PLEASE_CLOSE


def test_mindestdauer_verhindert_fruehes_fertig() -> None:
    """Feuchte schon gut, aber die Luft ist noch nicht ausgetauscht (Fühler am Fenster)."""
    # empfohlen 10 min (Winter) → mindestens 6 min
    assert evaluate(base(window_open=True, open_minutes=3, humidity=60, duration=10)) == VENT_AIRING
    assert evaluate(base(window_open=True, open_minutes=6, humidity=60, duration=10)) == VENT_DONE
    # empfohlen 5 min → mindestens 4 min
    assert evaluate(base(window_open=True, open_minutes=3, humidity=60, duration=5)) == VENT_AIRING
    # Kälteschutz bricht weiterhin früher ab
    assert evaluate(base(window_open=True, open_minutes=2, humidity=60, duration=10, room_temp=17.0)) == VENT_TOO_COLD


def test_mindestdauer_haengt_an_der_aussentemperatur() -> None:
    from custom_components.raumklima.ventilation import min_airing_minutes

    assert min_airing_minutes(4) == 4
    assert min_airing_minutes(5) == 4
    assert min_airing_minutes(10) == 6
    assert min_airing_minutes(15) == 9
    assert min_airing_minutes(0) == 4


def test_too_cold_has_priority() -> None:
    assert evaluate(base(window_open=True, open_minutes=1, room_temp=17.5)) == VENT_TOO_COLD
    assert evaluate(base(window_open=True, open_minutes=1, room_temp=19.5, temp_at_open=23.0)) == VENT_TOO_COLD
    assert evaluate(base(window_open=True, open_minutes=9, room_temp=17.0)) == VENT_TOO_COLD


def test_mold_risk() -> None:
    assert mold_risk(72, 20, 4)
    assert not mold_risk(72, 20, 1)
    assert mold_risk(66, 15, 0)


def test_quiet_hours_over_midnight() -> None:
    assert in_quiet_hours(23, 0, "22:00", "07:00")
    assert in_quiet_hours(6, 59, "22:00:00", "07:00:00")
    assert not in_quiet_hours(12, 0, "22:00", "07:00")
    assert in_quiet_hours(13, 0, "12:00", "14:00")


from rk.ventilation import comfort_temperature


def test_comfort_temperature_defaults() -> None:
    assert comfort_temperature(None, "living") == 20.0
    assert comfort_temperature(None, "bathroom") == 22.0
    assert comfort_temperature("", "bedroom") == 17.0
    assert comfort_temperature(21.5, "bedroom") == 21.5
    assert comfort_temperature(None, None) == 20.0


# ------------------------------------------------------------------ CO₂
def _v(**kw):
    from rk.ventilation import VentInput

    base = dict(
        window_open=False, open_minutes=0, room_temp=21.0, temp_at_open=None, humidity=50.0,
        humidity_high_minutes=0, humidity_limit=70.0, humidity_hysteresis=5.0, min_temp=18.0,
        max_drop=3.0, duration=10, dries=True,
    )
    base.update(kw)
    return VentInput(**base)


def test_co2_high_asks_to_open_even_if_outside_is_humid() -> None:
    from rk.ventilation import VENT_OK, VENT_PLEASE_OPEN, evaluate, vent_reason

    assert evaluate(_v(co2=1250, dries=False)) == VENT_PLEASE_OPEN
    assert vent_reason(_v(co2=1250)) == "co2"
    assert evaluate(_v(co2=900)) == VENT_OK


def test_airing_done_needs_humidity_and_co2_good() -> None:
    from rk.ventilation import VENT_AIRING, VENT_DONE, evaluate

    # Feuchte gut, CO₂ noch hoch → weiter lüften
    assert evaluate(_v(window_open=True, open_minutes=3, humidity=50, co2=950)) == VENT_AIRING
    assert evaluate(_v(window_open=True, open_minutes=6, humidity=50, co2=700)) == VENT_DONE
    # nur CO₂-Fühler
    assert evaluate(_v(window_open=True, open_minutes=6, humidity=None, co2=700)) == VENT_DONE
    # gar kein Fühler → nie „ausgetauscht“
    assert evaluate(_v(window_open=True, open_minutes=3, humidity=None, co2=None)) == VENT_AIRING


def _basis(**over) -> "VentInput":
    from custom_components.raumklima.ventilation import VentInput

    base = dict(window_open=False, open_minutes=0, room_temp=21.0, temp_at_open=None,
                humidity=50.0, humidity_high_minutes=0, humidity_limit=70.0,
                humidity_hysteresis=5.0, min_temp=16.0, max_drop=4.0, duration=10, dries=True)
    base.update(over)
    return VentInput(**base)


def test_feinstaub_loest_lueften_aus() -> None:
    """Feinstaub meldet erst nach der Verzögerung – sonst reicht eine Kerze."""
    from custom_components.raumklima.ventilation import VENT_OK, VENT_PLEASE_OPEN, evaluate, vent_reason

    kurz = _basis(pm25=45.0, pm25_high_minutes=5)
    assert evaluate(kurz) == VENT_OK  # Spitze, noch keine Meldung
    assert vent_reason(kurz) != "pm25"

    v = _basis(pm25=45.0, pm25_high_minutes=16)
    assert evaluate(v) == VENT_PLEASE_OPEN
    assert vent_reason(v) == "pm25"


def test_feinstaub_unter_grenze_ist_ok() -> None:
    from custom_components.raumklima.ventilation import VENT_OK, evaluate

    assert evaluate(_basis(pm25=20.0)) == VENT_OK


def test_feinstaub_haelt_lueften_bis_es_besser_ist() -> None:
    from custom_components.raumklima.ventilation import VENT_AIRING, VENT_DONE, evaluate

    offen = dict(window_open=True, open_minutes=6)
    assert evaluate(_basis(pm25=28.0, **offen)) == VENT_AIRING
    assert evaluate(_basis(pm25=12.0, **offen)) == VENT_DONE


def test_done_text_folgt_dem_grund() -> None:
    """Nach CO₂-Lüften keine Feuchte-Meldung mehr (Rückmeldung aus der Praxis)."""
    assert "CO₂" in done_text("co2", True)
    assert "Feinstaub" in done_text("pm25", True)
    assert done_text("humidity", True) is None
    assert "frisch" in done_text(None, False)


def test_open_hint_only_for_occupied_rooms() -> None:
    assert open_allowed(True, True, True) is True
    assert open_allowed(None, True, True) is True   # unklar → lieber melden
    assert open_allowed(False, True, True) is False  # Raum nachweislich leer
    assert open_allowed(False, False, True) is True  # kein Melder → Wohnungs-Anwesenheit gilt
    assert open_allowed(False, True, False) is True  # Option aus

def test_feinstaub_meldung_nennt_feinstaub_nicht_feuchte() -> None:
    """Die Meldung muss den Grund nennen – vorher stand dort die Luftfeuchte."""
    from custom_components.raumklima.msg import tr
    from custom_components.raumklima.vent_manager import MESSAGE_PM25

    title, body = MESSAGE_PM25
    text = tr(body, room="Wohnzimmer", pm="46", dur=10)
    assert "Feinstaub" in text and "46" in text
    assert "Luftfeuchte" not in text
    assert "Wohnzimmer" in tr(title, room="Wohnzimmer", pm="46", dur=10)
