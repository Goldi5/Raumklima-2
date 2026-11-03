"""Darstellungs-Layout je Wohnung (A3): nur bekannte Felder, nur brauchbare Werte."""

from __future__ import annotations

from custom_components.raumklima.layout import sanitize


def test_leeres_layout() -> None:
    assert sanitize(None) == {"order": [], "hidden": [], "size": {}, "color": {}}
    assert sanitize("kaputt") == {"order": [], "hidden": [], "size": {}, "color": {}}


def test_unbekannte_felder_werden_ignoriert() -> None:
    out = sanitize({"order": ["climate.a"], "boese": "x"})
    assert out["order"] == ["climate.a"]
    assert "boese" not in out


def test_groesse_und_farbe_werden_geprueft() -> None:
    out = sanitize(
        {
            "size": {"climate.a": "big", "climate.b": "riesig"},
            "color": {"climate.a": "#12ab34", "climate.b": "rot"},
        }
    )
    assert out["size"] == {"climate.a": "big"}
    assert out["color"] == {"climate.a": "#12ab34"}


def test_listen_bleiben_reihenfolge() -> None:
    out = sanitize({"order": ["b", "a", "c"], "hidden": ["c"]})
    assert out["order"] == ["b", "a", "c"]
    assert out["hidden"] == ["c"]
