"""Darstellungs-Layout je Wohnung (A3): nur bekannte Felder, nur brauchbare Werte."""

from __future__ import annotations

from custom_components.raumklima.layout import sanitize


def test_leeres_layout() -> None:
    leer = {"order": [], "hidden": [], "size": {}, "color": {}, "beta_floors": False}
    assert sanitize(None) == leer
    assert sanitize("kaputt") == leer


def test_unbekannte_felder_werden_ignoriert() -> None:
    out = sanitize({"order": ["climate.a"], "boese": "x"})
    assert out["order"] == ["climate.a"]
    assert "boese" not in out


def test_groesse_und_farbe_werden_geprueft() -> None:
    out = sanitize(
        {
            "size": {"climate.a": "big", "climate.b": "riesig", "climate.c": "medium"},
            "color": {"climate.a": "#12ab34", "climate.b": "rot"},
        }
    )
    assert out["size"] == {"climate.a": "big", "climate.c": "medium"}
    assert out["color"] == {"climate.a": "#12ab34"}


def test_listen_bleiben_reihenfolge() -> None:
    out = sanitize({"order": ["b", "a", "c"], "hidden": ["c"]})
    assert out["order"] == ["b", "a", "c"]
    assert out["hidden"] == ["c"]


def test_beta_stockwerke_nur_wenn_wirklich_an() -> None:
    """#80: die neue Anordnung bleibt aus, solange niemand sie ausdrücklich einschaltet."""
    assert sanitize({})["beta_floors"] is False
    assert sanitize({"beta_floors": "ja"})["beta_floors"] is False
    assert sanitize({"beta_floors": True})["beta_floors"] is True
