"""Ringpuffer der letzten Log-Zeilen dieser Integration.

Zweck: In der Diagnose-Datei stehen die letzten Zeilen der Integration, ohne dass jemand
``logger:`` mit ``debug`` in die ``configuration.yaml`` schreiben muss (das bremst Home
Assistant insgesamt aus). Der Puffer hängt nur am Logger ``custom_components.raumklima``
und ist auf die letzten Zeilen begrenzt – er wächst nicht.
"""

from __future__ import annotations

from collections import deque
from contextlib import suppress
from datetime import UTC, datetime
import logging
from typing import Any

# So viele Zeilen wandern höchstens in die Diagnose-Datei
MAX_LINES = 500

_LINES: deque[dict[str, Any]] = deque(maxlen=MAX_LINES)
_INSTALLED = False


class RingBufferHandler(logging.Handler):
    """Sammelt Log-Zeilen im Speicher (kein Schreiben auf die Platte)."""

    def emit(self, record: logging.LogRecord) -> None:
        # Logging darf nie selbst eine Ausnahme auslösen
        with suppress(Exception):
            _LINES.append(
                {
                    "time": datetime.fromtimestamp(record.created, tz=UTC).isoformat(),
                    "level": record.levelname,
                    "logger": record.name.removeprefix("custom_components.raumklima."),
                    "message": record.getMessage(),
                }
            )


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


def tail(limit: int = MAX_LINES) -> list[dict[str, Any]]:
    """Die letzten Zeilen, älteste zuerst."""
    if limit <= 0:
        return []
    return list(_LINES)[-limit:]


def clear() -> None:
    """Puffer leeren (für Tests)."""
    _LINES.clear()
