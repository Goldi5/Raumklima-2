"""#28: berechnete Ventilzeit getrennt nach Grundlast (Halten) und Bedarf (Aufheizen)."""

from custom_components.raumklima.stats import CSV_COLUMNS, RoomSample, add_room_sample, summarize_room


def _sample(calc, base):
    return RoomSample(
        heating=False, valve=None, reason="normal", target=20.0, effective=20.0, plan_on=True,
        paused=False, temp=20.0, humidity=None, humidity_limit=None, mold=False, window_open=False,
        valve_calc=calc, valve_base=base,
    )


def test_grundlast_und_bedarf_getrennt() -> None:
    day: dict[str, float] = {}
    add_room_sample(day, _sample(20.0, 20.0), 3600)  # 1 h am Ziel: nur Grundlast
    add_room_sample(day, _sample(60.0, 20.0), 3600)  # 1 h Aufheizen: 20 Grundlast + 40 Bedarf
    add_room_sample(day, _sample(10.0, 20.0), 3600)  # leicht über Ziel: Grundlast wird abgebaut
    out = summarize_room([day])
    assert out["valve_calc_h"] == 0.9
    assert out["valve_base_h"] == 0.5
    assert out["valve_demand_h"] == 0.4


def test_ohne_grundlast_alles_bedarf() -> None:
    day: dict[str, float] = {}
    add_room_sample(day, _sample(50.0, None), 3600)
    out = summarize_room([day])
    assert out["valve_base_h"] == 0.0
    assert out["valve_demand_h"] == 0.5


def test_spalten_im_export() -> None:
    names = [c for _k, c in CSV_COLUMNS]
    assert "ventil_grundlast_h" in names and "ventil_bedarf_h" in names
