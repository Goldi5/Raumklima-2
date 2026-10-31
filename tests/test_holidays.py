from datetime import date

from rk.holidays_de import easter, holiday_name
from rk.sleep import is_weekend_night


def test_easter():
    assert easter(2026) == date(2026, 4, 5)
    assert easter(2027) == date(2027, 3, 28)


def test_states():
    assert holiday_name(date(2026, 3, 8), "BE") == "Frauentag"
    assert holiday_name(date(2026, 3, 8), "NW") is None
    assert holiday_name(date(2026, 11, 1), "NW") == "Allerheiligen"
    assert holiday_name(date(2026, 6, 4), "NW") == "Fronleichnam"
    assert holiday_name(date(2026, 10, 31), "BB") == "Reformationstag"
    assert holiday_name(date(2026, 11, 18), "SN") == "Buß- und Bettag"
    assert holiday_name(date(2026, 12, 25), "BE") == "1. Weihnachtstag"


def test_holiday_eve_counts_as_weekend():
    # Mi 30.12.2026 → Do 31.12. kein Feiertag; Do 31.12. → Fr 1.1. Neujahr
    assert not is_weekend_night(date(2026, 12, 30), "BE")
    assert is_weekend_night(date(2026, 12, 31), "BE")
    assert is_weekend_night(date(2026, 10, 31), "NW")  # Sa→So sowieso
    assert is_weekend_night(date(2026, 6, 3), "NW")  # vor Fronleichnam
    assert not is_weekend_night(date(2026, 6, 3), "BE")
