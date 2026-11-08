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
MAX_LINES = 500
# Warnungen und Fehler bekommen einen eigenen Platz: bei DEBUG sind 500 Zeilen nach wenigen
# Minuten voll, und ein Traceback wäre dann längst herausgedreht worden.
MAX_WARNINGS = 200
# Ältere Zeilen interessieren in der Diagnose nicht mehr.
MAX_AGE_HOURS = 6.0

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


def clear() -> None:
    """Puffer leeren (für Tests)."""
    _LINES.clear()
    _WARNINGS.clear()
