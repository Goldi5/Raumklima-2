"""Raumtyp nachträglich ändern: Standardwerte mitziehen, eigene Werte behalten."""

from __future__ import annotations

from collections.abc import Mapping
from typing import Any

from .const import CONF_COMFORT_TEMP, CONF_SETBACK_LONG, CONF_SETBACK_SHORT
from .planning import setback_defaults
from .ventilation import COMFORT_BY_ROOM, DEFAULT_ROOM_TYPE


def retyped_values(
    config: Mapping[str, Any], old_type: str | None, new_type: str
) -> dict[str, float]:
    """Werte, die noch auf dem Standard des alten Raumtyps stehen, auf den neuen umstellen.

    Wer nichts eigenes eingetragen hat, bekommt die Standardwerte des neuen Typs.
    Eigene Einstellungen (abweichend vom alten Standard) bleiben unangetastet.
    """
    old_short, old_long = setback_defaults(old_type)
    new_short, new_long = setback_defaults(new_type)
    old_comfort = COMFORT_BY_ROOM.get(old_type or DEFAULT_ROOM_TYPE, 20.0)
    new_comfort = COMFORT_BY_ROOM.get(new_type, 20.0)
    out: dict[str, float] = {}
    for key, old, new in (
        (CONF_COMFORT_TEMP, old_comfort, new_comfort),
        (CONF_SETBACK_SHORT, old_short, new_short),
        (CONF_SETBACK_LONG, old_long, new_long),
    ):
        if abs(old - new) < 0.05:
            continue
        value = config.get(key)
        if value is None:
            continue
        try:
            current = float(value)
        except (TypeError, ValueError):
            continue
        if abs(current - old) < 0.05:
            out[key] = new
    return out
