"""Batterie-Prognose und Funkverkehr (health.py)."""

from datetime import date, timedelta

from rk.health import (
    battery_days_left,
    check_battery_forecast,
    check_radio_busy,
    radio_per_day,
)

D0 = date(2026, 11, 1)


def _series(start: float, per_day: float, days: int) -> dict[str, float]:
    return {(D0 + timedelta(days=i)).isoformat(): start - per_day * i for i in range(days)}


def test_gerade_durch_den_verlauf() -> None:
    # 1 % pro Tag, heute 50 % → bis 10 % noch 40 Tage
    days = battery_days_left(_series(63, 1.0, 14))
    assert days is not None and 39 <= days <= 41


def test_zu_kurz_oder_kein_abfall_keine_schaetzung() -> None:
    assert battery_days_left(_series(80, 1.0, 5)) is None  # erst 5 Tage
    assert battery_days_left(_series(80, 0.1, 20)) is None  # 2 % Abfall: Rauschen
    assert battery_days_left({}) is None


def test_hinweis_nur_wenn_bald_leer() -> None:
    assert check_battery_forecast("Thermostat Bad", 45, None) is None
    issue = check_battery_forecast("Thermostat Bad", 12, 220)
    assert issue is not None and "12 Tage" in issue.message and "220" in issue.message
    assert "funkt" not in check_battery_forecast("Thermostat Bad", 12, 40).message


def test_funkbefehle_je_tag() -> None:
    today = D0 + timedelta(days=10)
    hist = {(today - timedelta(days=i)).isoformat(): 200 for i in range(1, 8)}
    hist[today.isoformat()] = 999  # heute zählt nicht (Tag läuft noch)
    assert radio_per_day(hist, today) == 200
    assert check_radio_busy(200) is not None
    assert check_radio_busy(80) is None
    assert radio_per_day({D0.isoformat(): 500}, today) is None  # zu wenig Tage
