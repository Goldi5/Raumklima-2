"""Ringpuffer der letzten Log-Zeilen dieser Integration.

Zweck: In der Diagnose-Datei stehen die letzten Zeilen der Integration, ohne dass jemand
``logger:`` mit ``debug`` in die ``configuration.yaml`` schreiben muss (das bremst Home
Assistant insgesamt aus). Der Puffer hängt nur am Logger ``custom_components.raumklima``
und ist auf die letzten Zeilen begrenzt – er wächst nicht.
"""

from __future__ import annotations

from collections import deque
from contextlib import suppress
from datetime import UTC, datetime, timedelta
import logging
from typing import Any

# So viele Zeilen wandern höchstens in die Diagnose-Datei
MAX_LINES = 3000
# Warnungen und Fehler bekommen einen eigenen Platz: bei DEBUG ist der Puffer nach einigen
# Minuten voll, und ein Traceback wäre dann längst herausgedreht worden.
MAX_WARNINGS = 300
# Ältere Zeilen interessieren in der Diagnose nicht mehr.
MAX_AGE_HOURS = 12.0

_LINES: deque[dict[str, Any]] = deque(maxlen=MAX_LINES)
_WARNINGS: deque[dict[str, Any]] = deque(maxlen=MAX_WARNINGS)
_INSTALLED = False


class RingBufferHandler(logging.Handler):
    """Sammelt Log-Zeilen im Speicher (kein Schreiben auf die Platte)."""

    def emit(self, record: logging.LogRecord) -> None:
        # Logging darf nie selbst eine Ausnahme auslösen
        with suppress(Exception):
            line = {
                "time": datetime.fromtimestamp(record.created, tz=UTC).isoformat(),
                "level": record.levelname,
                "logger": record.name.removeprefix("custom_components.raumklima."),
                "message": record.getMessage(),
            }
            _LINES.append(line)
            if record.levelno >= logging.WARNING:
                _WARNINGS.append(line)


def install() -> None:
    """Handler einmalig an den Integrations-Logger hängen."""
    global _INSTALLED
    if _INSTALLED:
        return
    logger = logging.getLogger("custom_components.raumklima")
    if any(isinstance(handler, RingBufferHandler) for handler in logger.handlers):
        _INSTALLED = True
        return
    handler = RingBufferHandler(level=logging.DEBUG)
    logger.addHandler(handler)
    # Nur dieser Logger wird gesprächiger – andere Integrationen und der HA-Kern nicht.
    if logger.level == logging.NOTSET or logger.level > logging.DEBUG:
        logger.setLevel(logging.DEBUG)
    _INSTALLED = True


def tail(limit: int = MAX_LINES, max_age_hours: float | None = MAX_AGE_HOURS) -> list[dict[str, Any]]:
    """Warnungen plus die letzten Zeilen, älteste zuerst.

    ``max_age_hours`` schneidet alte Zeilen ab: bei DEBUG ist der Puffer sonst binnen Minuten
    gefüllt und die Diagnose zeigt nur ein winziges Fenster.
    """
    if limit <= 0:
        return []
    cutoff = None
    if max_age_hours:
        cutoff = datetime.now(tz=UTC) - timedelta(hours=max_age_hours)

    def fresh(line: dict[str, Any]) -> bool:
        if cutoff is None:
            return True
        with suppress(Exception):
            return datetime.fromisoformat(str(line.get("time"))) >= cutoff
        return True

    def key(line: dict[str, Any]) -> tuple[str, str, str]:
        return (str(line.get("time")), str(line.get("logger")), str(line.get("message")))

    # Warnungen zuerst nehmen: sie dürfen nicht dem Ringpuffer zum Opfer fallen, nur weil sie
    # älter sind als die letzten DEBUG-Zeilen.
    warnings = [line for line in _WARNINGS if fresh(line)][-limit:]
    seen = {key(line) for line in warnings}
    rest = [line for line in _LINES if fresh(line) and key(line) not in seen]
    room = max(limit - len(warnings), 0)
    picked = warnings + (rest[-room:] if room else [])
    return sorted(picked, key=lambda item: str(item.get("time")))


STORE_KEY = "raumklima.debug_log"
STORE_VERSION = 1


async def async_restore(hass: Any) -> None:
    """Puffer vom letzten Lauf zurückholen – ein Neustart löscht sonst die Vorgeschichte.

    Gespeichert wird beim Beenden von Home Assistant; geladen nur, was jünger ist als
    ``MAX_AGE_HOURS``. Fehler sind egal: dann beginnt der Puffer eben leer.
    """
    from homeassistant.const import EVENT_HOMEASSISTANT_STOP
    from homeassistant.helpers.storage import Store

    store: Store = Store(hass, STORE_VERSION, STORE_KEY)
    with suppress(Exception):
        data = await store.async_load() or {}
        cutoff = datetime.now(tz=UTC) - timedelta(hours=MAX_AGE_HOURS)

        def young(line: Any) -> bool:
            with suppress(Exception):
                return isinstance(line, dict) and datetime.fromisoformat(str(line.get("time"))) >= cutoff
            return False

        old_lines = [line for line in data.get("lines") or [] if young(line)]
        old_warn = [line for line in data.get("warnings") or [] if young(line)]
        # vor die neuen Zeilen dieses Laufs stellen
        current, current_w = list(_LINES), list(_WARNINGS)
        _LINES.clear()
        _WARNINGS.clear()
        _LINES.extend(old_lines + [{"time": datetime.now(tz=UTC).isoformat(), "level": "INFO", "logger": "debug_log", "message": "— Neustart —"}] + current)
        _WARNINGS.extend(old_warn + current_w)

    async def _save(_event: Any = None) -> None:
        with suppress(Exception):
            await store.async_save({"lines": list(_LINES), "warnings": list(_WARNINGS)})

    hass.bus.async_listen_once(EVENT_HOMEASSISTANT_STOP, _save)


def clear() -> None:
    """Puffer leeren (für Tests)."""
    _LINES.clear()
    _WARNINGS.clear()
