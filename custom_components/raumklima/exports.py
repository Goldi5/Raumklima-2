"""Kurzlebige Download-Links für Sicherung und Diagnose.

Warum das nötig ist: iPad-Safari und die Home-Assistant-App (WKWebView) verwerfen
Blob-Downloads, die erst nach einem ``await`` ausgelöst werden, und öffnen keine Tabs,
die ein Skript anklickt. Ein echter Datei-Link, den der Nutzer antippt, funktioniert
dagegen überall. Dafür legt die Integration die Datei kurz ab und gibt eine URL mit
Zufallsschlüssel aus, die nach 15 Minuten verfällt.
"""

from __future__ import annotations

import json
from pathlib import Path
import secrets
import time
from typing import Any

from aiohttp import web
from homeassistant.components.http import HomeAssistantView
from homeassistant.core import HomeAssistant

TTL_SECONDS = 900  # 15 Minuten reichen zum Antippen und Sichern
_LINKS: dict[str, tuple[Path, str, float]] = {}


class ExportView(HomeAssistantView):
    """Liefert die zuvor erzeugte Datei einmalig über einen Zufallsschlüssel aus."""

    url = "/api/raumklima/export/{token}"
    name = "api:raumklima:export"
    requires_auth = False  # der Zufallsschlüssel im Pfad ist der Nachweis

    async def get(self, request: web.Request, token: str) -> web.StreamResponse:
        entry = _LINKS.get(token)
        if entry is None or entry[2] < time.monotonic():
            _LINKS.pop(token, None)
            return web.Response(status=404)
        path, name, _expires = entry
        return web.FileResponse(
            path,
            headers={
                "Content-Type": "application/json",
                "Content-Disposition": f'attachment; filename="{name}"',
                "Cache-Control": "no-store",
            },
        )


def _folder(hass: HomeAssistant) -> Path:
    folder = Path(hass.config.path("raumklima_exports"))
    folder.mkdir(parents=True, exist_ok=True)
    return folder


def _prune(folder: Path) -> None:
    now = time.monotonic()
    for key, (path, _name, expires) in list(_LINKS.items()):
        if expires < now:
            _LINKS.pop(key, None)
            path.unlink(missing_ok=True)


def _write(hass: HomeAssistant, name: str, payload: Any) -> str:
    """Datei schreiben und Link ausgeben (läuft im Executor)."""
    folder = _folder(hass)
    _prune(folder)
    token = secrets.token_urlsafe(12)
    path = folder / f"{token}.json"
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    _LINKS[token] = (path, name, time.monotonic() + TTL_SECONDS)
    return f"/api/raumklima/export/{token}"


async def make_link(hass: HomeAssistant, name: str, payload: Any) -> str:
    """Download-Link für ein JSON-Paket erzeugen (Name bleibt der Dateiname)."""
    return await hass.async_add_executor_job(_write, hass, name, payload)
