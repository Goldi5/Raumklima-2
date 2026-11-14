"""Zustand eines Raums speichern und laden – beide Richtungen an einer Stelle.

Teil von ``RaumklimaController``. Ein Test prüft, dass jeder Schlüssel aus ``_stored_data`` in
``_load_stored`` wieder gelesen wird (tests/test_room_store.py).
"""

from __future__ import annotations

from typing import Any

from .const import OFF_SOURCE_USER
from .shared import iso, parse_dt


class StoreMixin:
    """Zustand des Raums (Wunsch, Boost, Gelerntes …) über Neustarts hinweg."""

    def _stored_data(self) -> dict[str, Any]:
        return {
            "target_temp": self.target_temp,
            "hvac_on": self.hvac_on,
            "hvac_auto": self.hvac_auto,
            "off_source": self.off_source,
            "boost_until": iso(self.boost_until),
            "boost_open": self.boost_open,
            "boost_temperature": self.boost_temperature,
            "window_logic": self.window_logic,
            "trv_on_preset": self.trv_on_preset,
            "preset_learned": self.preset_learned,
            "shift": self.shift,
            "vent": self.vent.export() if self.vent else None,
            "series": self.series.export(),
            "heatup": self.heatup.dump(),
            "heatup_cool": self.heatup.cool_dump(),
            "mold_vapour": self.mold_guard.dump(),
            "rf": self._rf,
            "airing_profile": self.airing.export(),
            "usage_profile": self.usage.export(),
            "outage_durations": list(self._outage_durations),
            "battery_hist": self._battery_hist,
            "shading_closed": sorted(self._shading_closed),
            "shading_manual_until": iso(self._shading_manual_until),
        }

    def _load_stored(self, stored: dict[str, Any]) -> None:
        """Gegenstück zu ``_stored_data`` – jeder gespeicherte Schlüssel wird hier gelesen."""
        self.target_temp = float(stored.get("target_temp", self.target_temp))
        self.hvac_on = bool(stored.get("hvac_on", self.hvac_on))
        self.hvac_auto = bool(stored.get("hvac_auto", self.hvac_auto))
        self.off_source = stored.get("off_source") or (None if self.hvac_on else OFF_SOURCE_USER)
        self.boost_until = parse_dt(stored.get("boost_until"))
        self.boost_open = bool(stored.get("boost_open") or False)
        self.boost_temperature = stored.get("boost_temperature")
        self.window_logic = bool(stored.get("window_logic", self.window_logic))
        self.trv_on_preset = stored.get("trv_on_preset")
        self.preset_learned = stored.get("preset_learned")
        if stored.get("shift") is not None:
            self.shift = float(stored.get("shift") or 0.0)
        self.heatup.load(stored.get("heatup"))
        self.heatup.cool_load(stored.get("heatup_cool"))
        self.mold_guard.load(stored.get("mold_vapour"))
        if isinstance(stored.get("rf"), dict):
            self._rf = stored["rf"]
        for seconds in stored.get("outage_durations") or []:
            try:
                self._outage_durations.append(float(seconds))
            except (TypeError, ValueError):
                continue
        self.airing.load(stored.get("airing_profile"))
        self.usage.load(stored.get("usage_profile"))
        if isinstance(stored.get("battery_hist"), dict):
            self._battery_hist = {
                k: {d: float(v) for d, v in (series or {}).items() if isinstance(v, int | float)}
                for k, series in stored["battery_hist"].items()
                if isinstance(series, dict)
            }
        self.vent.load(stored.get("vent"))
        self.series.load(stored.get("series"))
        self._shading_closed = {
            str(entity_id) for entity_id in (stored.get("shading_closed") or []) if entity_id
        }
        self._shading_manual_until = parse_dt(stored.get("shading_manual_until"))
