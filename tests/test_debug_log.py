"""Debug-Ringpuffer: Warnungen dürfen nicht von DEBUG-Zeilen herausgedreht werden."""

from __future__ import annotations

import logging

from custom_components.raumklima import debug_log


def _emit(handler: logging.Handler, level: int, message: str) -> None:
    handler.emit(
        logging.LogRecord(
            name="custom_components.raumklima.test",
            level=level,
            pathname=__file__,
            lineno=1,
            msg=message,
            args=(),
            exc_info=None,
        )
    )


def test_warnung_ueberlebt_viele_debug_zeilen() -> None:
    debug_log.clear()
    handler = debug_log.RingBufferHandler()

    _emit(handler, logging.WARNING, "Thermostat antwortet nicht")
    for index in range(debug_log.MAX_LINES + 120):
        _emit(handler, logging.DEBUG, f"Ventil-Schatten {index}")

    messages = [line["message"] for line in debug_log.tail()]
    assert "Thermostat antwortet nicht" in messages, "Warnung wurde herausgedreht"
    assert len(messages) <= debug_log.MAX_LINES
    assert messages[-1] == f"Ventil-Schatten {debug_log.MAX_LINES + 119}"


def test_alte_zeilen_fallen_raus() -> None:
    debug_log.clear()
    handler = debug_log.RingBufferHandler()
    alt = logging.LogRecord(
        name="custom_components.raumklima.test",
        level=logging.INFO,
        pathname=__file__,
        lineno=1,
        msg="von gestern",
        args=(),
        exc_info=None,
    )
    alt.created = alt.created - 7 * 3600
    handler.emit(alt)

    assert debug_log.tail(max_age_hours=6) == []
    assert [line["message"] for line in debug_log.tail(max_age_hours=24)] == ["von gestern"]
