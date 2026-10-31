"""Entscheidungsprotokoll: was wann warum entschieden wurde.

Ein Ringpuffer der letzten Entscheidungen (14 Tage, höchstens 5000 Einträge) im eigenen
Speicher – unabhängig von der HA-Datenbank, damit nichts das Recorder-Volumen aufbläht.
"""

from __future__ import annotations

from collections import deque
from collections.abc import Callable
from datetime import datetime, timedelta
import logging
from typing import Any

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

MAX_ENTRIES = 5000
KEEP = timedelta(days=14)
SAVE_DELAY = 60

CAT_PRESENCE = "presence"
CAT_SEASON = "season"
CAT_TARGET = "target"
CAT_WINDOW = "window"
CAT_NOTIFY = "notify"
CAT_DEVICE = "device"
CAT_HEALTH = "health"
CAT_MANUAL = "manual"
CAT_SETTINGS = "settings"
CATEGORIES = [
    CAT_PRESENCE,
    CAT_SEASON,
    CAT_TARGET,
    CAT_WINDOW,
    CAT_NOTIFY,
    CAT_DEVICE,
    CAT_HEALTH,
    CAT_MANUAL,
    CAT_SETTINGS,
]


def fmt_temp(value: float | None, digits: int = 1) -> str:
    """20.5 → „20,5 °C“."""
    if value is None:
        return "–"
    return f"{value:.{digits}f} °C".replace(".", ",").replace("-", "−")


class DecisionLog:
    """Ringpuffer mit Speicher und Live-Abonnenten."""

    def __init__(self, hass: HomeAssistant, suffix: str = "") -> None:
        self.hass = hass
        self._store: Store[dict[str, Any]] = Store(hass, 1, f"{DOMAIN}.log{suffix}")
        self.entries: deque[dict[str, Any]] = deque(maxlen=MAX_ENTRIES)
        self._listeners: list[Callable[[dict[str, Any]], None]] = []
        self._seq = 0

    async def async_load(self) -> None:
        stored = await self._store.async_load()
        early = list(self.entries)  # Einträge, die vor dem Laden entstanden sind (Start der Räume)
        if stored:
            self.entries.clear()
            self.entries.extend(stored.get("entries", []))
            self._seq = max(int(stored.get("seq", 0)), max((e.get("id", 0) for e in self.entries), default=0))
            for entry in early:
                self._seq += 1
                entry["id"] = self._seq
                self.entries.append(entry)
        self._prune()

    async def async_save(self) -> None:
        await self._store.async_save(self._data())

    def _data(self) -> dict[str, Any]:
        return {"seq": self._seq, "entries": list(self.entries)}

    def _prune(self) -> None:
        cutoff = (dt_util.utcnow() - KEEP).isoformat()
        while self.entries and self.entries[0]["t"] < cutoff:
            self.entries.popleft()

    @callback
    def add(
        self,
        cat: str,
        msg: str,
        why: str | None = None,
        *,
        room: str | None = None,
        entry_id: str | None = None,
        level: str = "info",
        **data: Any,
    ) -> dict[str, Any]:
        """Eintrag anlegen. „msg“ = was, „why“ = warum (beides für Menschen lesbar)."""
        self._seq += 1
        entry: dict[str, Any] = {
            "id": self._seq,
            "t": dt_util.utcnow().isoformat(),
            "cat": cat,
            "msg": msg,
        }
        if why:
            entry["why"] = why
        if room:
            entry["room"] = room
        if entry_id:
            entry["eid"] = entry_id
        if level != "info":
            entry["lvl"] = level
        if data:
            entry["data"] = {k: v for k, v in data.items() if v is not None}
        self.entries.append(entry)
        _LOGGER.debug("[%s] %s%s – %s", cat, f"{room}: " if room else "", msg, why or "")
        if self._seq % 200 == 0:
            self._prune()
        self._store.async_delay_save(self._data, SAVE_DELAY)
        for listener in list(self._listeners):
            try:
                listener(entry)
            except Exception:  # noqa: BLE001
                _LOGGER.exception("Protokoll-Abonnent fehlgeschlagen")
        return entry

    @callback
    def subscribe(self, listener: Callable[[dict[str, Any]], None]) -> Callable[[], None]:
        self._listeners.append(listener)

        @callback
        def remove() -> None:
            if listener in self._listeners:
                self._listeners.remove(listener)

        return remove

    def query(
        self,
        *,
        limit: int = 300,
        before: int | None = None,
        entry_id: str | None = None,
        categories: list[str] | None = None,
        since: datetime | None = None,
    ) -> list[dict[str, Any]]:
        """Neueste zuerst."""
        out: list[dict[str, Any]] = []
        since_iso = since.isoformat() if since else None
        for entry in reversed(self.entries):
            if before is not None and entry["id"] >= before:
                continue
            if since_iso and entry["t"] < since_iso:
                break
            if entry_id and entry.get("eid") not in (entry_id, None):
                continue
            if entry_id and entry.get("eid") is None and entry["cat"] not in (CAT_PRESENCE, CAT_SEASON):
                continue
            if categories and entry["cat"] not in categories:
                continue
            out.append(entry)
            if len(out) >= limit:
                break
        return out
