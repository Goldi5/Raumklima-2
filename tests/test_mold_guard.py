"""Schimmelschutz aus dem 24-h-Mittel: ruhig, in 0,5er-Schritten, ohne Koch- und Duschspitzen."""

from datetime import UTC, datetime, timedelta

from rk.planning import MoldGuard, mold_safe_min_temp

T0 = datetime(2026, 11, 5, 12, 0, tzinfo=UTC)


def _fill(guard: MoldGuard, hours: float, temp: float, rh: float, start: datetime = T0) -> datetime:
    now = start
    for _ in range(int(hours * 12)):
        guard.add(now, temp, rh)
        now += timedelta(minutes=5)
    return now


def test_frisch_wie_bisher_nur_aufgerundet() -> None:
    g = MoldGuard()
    raw = mold_safe_min_temp(18.5, 70, 5.0, 0.70)
    floor = g.floor(T0, 18.5, 70, 5.0, 0.70)
    assert floor is not None and raw is not None
    assert floor * 2 == int(floor * 2)  # 0,5er-Schritt
    assert raw <= floor < raw + 0.5


def test_kurze_spitze_aendert_den_boden_nicht() -> None:
    g = MoldGuard()
    now = _fill(g, 23.5, 20.0, 50)
    calm = g.floor(now, 20.0, 50, 5.0)
    # Kochen/Duschen: eine halbe Stunde 75 %
    now = _fill(g, 0.5, 20.0, 75, start=now)
    spike = g.floor(now, 20.0, 75, 5.0)
    assert spike is not None and calm is not None
    assert spike - calm <= 0.5
    # momentan gerechnet wären es mehrere Grad mehr
    assert mold_safe_min_temp(20.0, 75, 5.0) - calm > 3


def test_anhaltende_feuchte_hebt_den_boden() -> None:
    g = MoldGuard()
    now = _fill(g, 24, 18.5, 70)
    floor = g.floor(now, 18.5, 70, 5.0)
    assert floor is not None and floor >= round(mold_safe_min_temp(18.5, 70, 5.0), 1) - 0.01


def test_hysterese_nach_unten() -> None:
    g = MoldGuard()
    first = g.floor(T0, 18.5, 70, 5.0)
    second = g.floor(T0, 18.5, 69, 5.0)  # etwas trockener: Rechnung sinkt um wenige Zehntel
    assert second == first
    much_drier = g.floor(T0, 18.5, 55, 5.0)
    assert much_drier < first


def test_speichern_und_laden() -> None:
    g = MoldGuard()
    _fill(g, 2, 19.0, 60)
    h = MoldGuard()
    h.load(g.dump())
    assert len(h.samples) == len(g.samples)
    h.load([["kaputt"], None, ["2026-11-05T12:00:00+00:00", "x"]])
    assert h.samples == []


def test_nur_24_stunden() -> None:
    g = MoldGuard()
    _fill(g, 30, 19.0, 60)
    assert g.samples[-1][0] - g.samples[0][0] <= timedelta(hours=24)


def test_ohne_werte_kein_boden() -> None:
    g = MoldGuard()
    assert g.floor(T0, None, None, 5.0) is None
    assert g.floor(T0, 20.0, 50, None) is None
    assert g.floor(T0, 20.0, 40, 18.0) is None  # draußen warm


def test_stundenbudget_verteilt_luecken_nicht() -> None:
    """Nach 8 h ohne Messung (Fenster offen) zählt 1 h feuchte Wand als 1 h – nicht mehr."""
    g = MoldGuard()
    now = T0
    for _ in range(12):  # 1 h über der Grenze
        g.add(now, 18.0, 70, 85.0)
        now += timedelta(minutes=5)
    now += timedelta(hours=8)  # Lücke: Fenster offen, keine Messwerte
    for _ in range(36):  # 3 h unkritisch
        g.add(now, 18.0, 50, 60.0)
        now += timedelta(minutes=5)
    assert 0.9 <= g.surface_rh_hours(now) <= 1.2
