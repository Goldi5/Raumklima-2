"""Debug-Spur der Karte (Browser) zum Server.

Die Karte läuft im Browser des Nutzers – dort kommt man ohne Web Inspector nicht hin,
und auf dem iPad gibt es keinen. Deshalb meldet die Karte ihre Schritte per WebSocket
hierher: geladene Version, Klick auf einen Knopf, Antworten und Fehler. Die Spur landet
im Entscheidungsprotokoll und im Speicher, abrufbar über ``raumklima/trace/list``.
"""

from __future__ import annotations

from collections import deque
from datetime import datetime
from typing import Any

from homeassistant.core import HomeAssistant

MAX_TRACES = 200
TRACES: deque[dict[str, Any]] = deque(maxlen=MAX_TRACES)


def add(hass: HomeAssistant, event: str, data: dict[str, Any] | None = None) -> None:
    """Eine Spur-Zeile ablegen (Zeit, Ereignis, Angaben)."""
    entry = {
        "t": datetime.now().astimezone().isoformat(timespec="seconds"),
        "event": str(event)[:60],
        "data": {k: str(v)[:200] for k, v in (data or {}).items()},
    }
    TRACES.append(entry)
    from .shared import all_hubs

    for hub in all_hubs(hass):
        hub.log.add("settings", f"Debug: {entry['event']}", " · ".join(f"{k}={v}" for k, v in entry["data"].items()))
        break


def recent() -> list[dict[str, Any]]:
    return list(TRACES)
