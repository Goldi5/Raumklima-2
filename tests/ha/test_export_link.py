"""Download-Link für Sicherung/Diagnose: funktioniert ohne Zwischenablage und ohne Teilen."""

from __future__ import annotations

import json
import time

from aiohttp import web
from homeassistant.core import HomeAssistant

from custom_components.raumklima.exports import _LINKS, TTL_SECONDS, ExportView, make_link


class _Request(dict):
    """Minimaler Request: die View braucht nur `app` für den Dateipfad."""

    def __init__(self, app: dict) -> None:
        super().__init__()
        self.app = app


async def test_link_liefert_datei(hass: HomeAssistant) -> None:
    """Ein echter Link, den der Nutzer antippt – mit Content-Disposition zum Speichern."""
    url = await make_link(hass, "raumklima-test.json", {"hallo": "welt"})
    assert url.startswith("/api/raumklima/export/")
    token = url.rsplit("/", 1)[-1]
    assert token in _LINKS

    path, name, _expires = _LINKS[token]
    assert name == "raumklima-test.json"
    assert json.loads(path.read_text(encoding="utf-8")) == {"hallo": "welt"}

    resp = await ExportView().get(_Request({}), token)
    assert isinstance(resp, web.FileResponse)
    assert "attachment" in resp.headers["Content-Disposition"]
    assert "raumklima-test.json" in resp.headers["Content-Disposition"]
    path.unlink(missing_ok=True)


async def test_unbekannter_schluessel_ist_404(hass: HomeAssistant) -> None:
    resp = await ExportView().get(_Request({}), "gibtsnicht")
    assert resp.status == 404


async def test_abgelaufener_link_ist_404(hass: HomeAssistant) -> None:
    url = await make_link(hass, "alt.json", {"x": 1})
    token = url.rsplit("/", 1)[-1]
    path, name, _expires = _LINKS[token]
    _LINKS[token] = (path, name, time.monotonic() - 1)

    resp = await ExportView().get(_Request({}), token)
    assert resp.status == 404
    assert token not in _LINKS  # abgelaufene Einträge werden vergessen
    path.unlink(missing_ok=True)


def test_view_ist_ohne_anmeldung_erreichbar() -> None:
    """Der Zufallsschlüssel im Pfad ist der Nachweis – sonst könnte das iPad nichts laden."""
    assert ExportView.requires_auth is False
    assert TTL_SECONDS <= 3600
