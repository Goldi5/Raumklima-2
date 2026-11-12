"""Speichern und Laden des Raum-Zustands passen zusammen: jeder gespeicherte Schlüssel wird gelesen."""

import ast
from pathlib import Path

SRC = (Path(__file__).parent.parent / "custom_components/raumklima/room_store.py").read_text()


def _method(name: str) -> ast.FunctionDef:
    tree = ast.parse(SRC)
    return next(n for n in ast.walk(tree) if isinstance(n, ast.FunctionDef) and n.name == name)


def test_jeder_gespeicherte_schluessel_wird_geladen() -> None:
    saved = {k.value for k in next(n for n in ast.walk(_method("_stored_data")) if isinstance(n, ast.Dict)).keys}
    read = {
        n.args[0].value
        for n in ast.walk(_method("_load_stored"))
        if isinstance(n, ast.Call) and getattr(n.func, "attr", "") == "get" and n.args and isinstance(n.args[0], ast.Constant)
    } | {
        n.slice.value for n in ast.walk(_method("_load_stored")) if isinstance(n, ast.Subscript) and isinstance(n.slice, ast.Constant)
    }
    assert saved - read == set(), f"gespeichert, aber nie geladen: {sorted(saved - read)}"
    assert read - saved == set(), f"geladen, aber nie gespeichert: {sorted(read - saved)}"
