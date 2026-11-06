"""Karte ausliefern *und* jede Anfrage protokollieren.

Warum nicht `async_register_static_paths`: eine statische Auslieferung kann nicht sagen,
welcher Browser welche Datei geholt hat. Genau das braucht die Fehlersuche auf dem iPad,
wo es keine Konsole gibt. Diese View schreibt jede Anfrage in die Debug-Spur
(Browser-Kennung, URL mit Version, Status) und liefert die Karte mit ``no-store``, damit
nach einem Update nie wieder eine alte Fassung im Cache hängt.
"""

from __future__ import annotations

import hashlib
from pathlib import Path

from aiohttp import web
from homeassistant.components.http import HomeAssistantView
from homeassistant.core import HomeAssistant

from .const import CARD_URL

CARD_FILE = Path(__file__).parent / "www" / "raumklima-card.js"
_CACHE: dict[str, str] = {"body": "", "hash": ""}


def card_source() -> str:
    """Kartendatei lesen (mit kleinem Cache, damit nicht jede Anfrage die Platte liest)."""
    try:
        stat = CARD_FILE.stat()
    except OSError:
        return ""
    key = f"{stat.st_mtime_ns}:{stat.st_size}"
    if _CACHE.get("key") != key:
        _CACHE["body"] = CARD_FILE.read_text(encoding="utf-8")
        _CACHE["hash"] = hashlib.sha256(_CACHE["body"].encode("utf-8")).hexdigest()[:10]
        _CACHE["key"] = key
    return _CACHE["body"]


class CardView(HomeAssistantView):
    """Liefert die Karte und protokolliert, wer sie in welcher Version geholt hat."""

    url = CARD_URL
    name = "api:raumklima:card"
    requires_auth = False  # die Karte selbst enthält keine Daten

    async def get(self, request: web.Request) -> web.Response:
        hass: HomeAssistant = request.app["hass"]
        body = await hass.async_add_executor_job(card_source)
        if not body:
            return web.Response(status=404, text="raumklima-card.js fehlt")

        from .trace import add as trace_add

        trace_add(
            hass,
            "card_request",
            {
                "url": str(request.rel_url)[:180],
                "ua": str(request.headers.get("User-Agent", ""))[:120],
                "inm": str(request.headers.get("If-None-Match", ""))[:40],
                "hash": _CACHE.get("hash", ""),
            },
        )
        return web.Response(
            text=body,
            content_type="text/javascript",
            headers={
                "Cache-Control": "no-store, must-revalidate",
                "ETag": f'"{_CACHE.get("hash", "0")}"',
            },
        )
