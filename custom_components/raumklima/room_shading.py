"""Verschattung: Rollläden und Jalousien nach Sonne, Temperatur und Nacht steuern.

Teil von ``RaumklimaController``. Die Fassade kommt aus ``solar_facade``; damit gilt
die Sonnenprognose nur für die Seite, auf die die Fenster zeigen. Handbedienung am
Gerät pausiert die Automatik für die eingestellte Zeit – sonst würde jede Fahrt
sofort wieder überschrieben.
"""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any

from homeassistant.components.cover import CoverEntityFeature
from homeassistant.core import callback
from homeassistant.helpers.event import async_track_time_interval
from homeassistant.util import dt as dt_util

from .const import (
    CONF_SHADING_MANUAL_MINUTES,
    CONF_SHADING_MIN_TEMP,
    CONF_SHADING_MODE,
    CONF_SHADING_NIGHT,
    CONF_SHADING_OUTDOOR_MIN,
    CONF_SHADING_POSITION,
    CONF_SOLAR_FACADE,
    SHADING_INTERVAL,
    SHADING_MODES,
    SHADING_SETTLE_SECONDS,
)
from .decision_log import CAT_DEVICE, CAT_MANUAL
from .logic import to_float
from .msg import tr
from .shared import iso

STATE_OFF = "off"
STATE_UNCONFIGURED = "unconfigured"
STATE_MANUAL = "manual"
STATE_OPEN = "open"
STATE_CLOSED = "closed"
STATE_ADVISE_OPEN = "advise_open"
STATE_ADVISE_CLOSE = "advise_close"
STATE_ERROR = "error"


class ShadingMixin:
    """Verschattung eines Raums – Entscheidung, Fahrt und Handbedienung."""

    @property
    def shading_mode(self) -> str:
        mode = str(self.config.get(CONF_SHADING_MODE) or "off")
        return mode if mode in SHADING_MODES else "off"

    @property
    def shading_covers(self) -> list[str]:
        return list(self.covers)

    @property
    def shading_close_position(self) -> int:
        value = to_float(self.config.get(CONF_SHADING_POSITION))
        return max(0, min(100, int(value if value is not None else 20)))

    def shading_summary(self) -> dict[str, Any]:
        """Zustand für Einstellungen, Karte und Diagnose."""
        covers = []
        for entity_id in self.covers:
            state = self.hass.states.get(entity_id)
            covers.append(
                {
                    "entity_id": entity_id,
                    "name": state.name if state is not None else entity_id,
                    "available": bool(state is not None and state.state not in ("unavailable", "unknown")),
                    "position": self._cover_position(entity_id),
                }
            )
        return {
            "mode": self.shading_mode,
            "covers": covers,
            "position": self.shading_close_position,
            "min_temp": self.config.get(CONF_SHADING_MIN_TEMP),
            "outdoor_min": self.config.get(CONF_SHADING_OUTDOOR_MIN),
            "night": bool(self.config.get(CONF_SHADING_NIGHT)),
            "manual_minutes": self.config.get(CONF_SHADING_MANUAL_MINUTES),
            "state": self._shading_state,
            "reason": self._shading_reason,
            "sun": self._shading_sun,
            "night_now": self._shading_is_night(),
            "manual_until": iso(self._shading_manual_until),
            "active": bool(self.covers) and self.shading_mode != "off",
        }

    def shading_start(self) -> None:
        """Nach dem Laden des Speichers: tatsächlich geschlossene Covers übernehmen."""
        actual_closed = {
            entity_id
            for entity_id in self.covers
            if (position := self._cover_position(entity_id)) is not None
            and position <= self.shading_close_position + 5
        }
        self._shading_closed &= actual_closed
        self._unsubs.append(
            async_track_time_interval(
                self.hass, self._on_shading_interval, timedelta(seconds=SHADING_INTERVAL)
            )
        )

    @callback
    def _on_shading_interval(self, _now: datetime | None = None) -> None:
        self.hass.async_create_task(self.async_evaluate_shading())

    async def async_evaluate_shading(self) -> None:
        """Einmal prüfen und – im Automatikmodus – die Covers fahren."""
        if not self._started:
            return
        if not self.covers:
            self._set_shading_state(STATE_UNCONFIGURED, "no_covers", False)
            return
        mode = self.shading_mode
        if mode == STATE_OFF:
            self._set_shading_state(STATE_OFF, "off", False)
            return
        if self._shading_manual_until is not None:
            if self._shading_manual_until > dt_util.utcnow():
                self._set_shading_state(STATE_MANUAL, "manual", self._shading_sun)
                return
            self._shading_manual_until = None
            self._save()

        night = self._shading_is_night()
        sun = self._shading_sun_expected()
        target, reason = self._shading_desired(night, sun)
        if target is None:
            self._set_shading_state(STATE_OPEN, reason, sun)
            return
        if mode == "advise":
            state = STATE_ADVISE_CLOSE if target == "close" else STATE_ADVISE_OPEN
            self._set_shading_state(state, reason, sun)
            return

        failed = 0
        for entity_id in self.covers:
            if target == "open" and entity_id not in self._shading_closed:
                continue
            if not await self._shading_move(entity_id, target):
                failed += 1
        if failed:
            self._set_shading_state(STATE_ERROR, reason, sun)
            return
        self._set_shading_state(STATE_CLOSED if target == "close" else STATE_OPEN, reason, sun)

    def _shading_desired(self, night: bool, sun: bool) -> tuple[str | None, str]:
        """Ziel und Grund. ``None`` heißt: nichts tun (z. B. keine Temperaturdaten)."""
        if night:
            if bool(self.config.get(CONF_SHADING_NIGHT)):
                return "close", "night"
            return "open", "night_open"
        if not sun:
            return "open", "no_sun"
        hot = self._shading_hot()
        if hot is None:
            return None, "no_data"
        if hot:
            return "close", "sun"
        return "open", "cool"

    def _shading_hot(self) -> bool | None:
        """Ist es warm genug, dass die Sonne den Raum überhitzt?"""
        temp = self.current_temperature
        hub = self.hub
        outdoor = hub.outdoor_temp() if hub is not None else None
        if temp is None and outdoor is None:
            return None
        min_temp = to_float(self.config.get(CONF_SHADING_MIN_TEMP))
        outdoor_min = to_float(self.config.get(CONF_SHADING_OUTDOOR_MIN))
        return bool(
            (temp is not None and min_temp is not None and temp >= min_temp)
            or (outdoor is not None and outdoor_min is not None and outdoor >= outdoor_min)
        )

    def _shading_sun_expected(self) -> bool:
        hub = self.hub
        if hub is None:
            return False
        return bool(hub.sun_expected(self.config.get(CONF_SOLAR_FACADE) or None))

    def _shading_is_night(self) -> bool:
        state = self.hass.states.get("sun.sun")
        if state is not None and state.state in ("above_horizon", "below_horizon"):
            return state.state == "below_horizon"
        hour = dt_util.now().hour
        return hour >= 22 or hour < 6

    def _cover_position(self, entity_id: str) -> float | None:
        state = self.hass.states.get(entity_id)
        if state is None:
            return None
        return to_float(state.attributes.get("current_position"))

    async def _shading_move(self, entity_id: str, target: str) -> bool:
        """Ein Cover fahren. True = Befehl gesendet oder Ziel schon erreicht."""
        state = self.hass.states.get(entity_id)
        if state is None or state.state in ("unavailable", "unknown"):
            return False
        close = target == "close"
        target_pos = self.shading_close_position if close else 100
        position = self._cover_position(entity_id)
        if position is not None and abs(position - target_pos) <= 5:
            if close:
                self._shading_closed.add(entity_id)
            else:
                self._shading_closed.discard(entity_id)
            return True

        features = int(state.attributes.get("supported_features") or 0)
        self._shading_last[entity_id] = {
            "position": position,
            "until": dt_util.utcnow() + timedelta(seconds=SHADING_SETTLE_SECONDS),
        }
        try:
            if features & int(CoverEntityFeature.SET_POSITION):
                await self.hass.services.async_call(
                    "cover",
                    "set_cover_position",
                    {"entity_id": entity_id, "position": target_pos},
                    blocking=True,
                )
            else:
                await self.hass.services.async_call(
                    "cover",
                    "close_cover" if close else "open_cover",
                    {"entity_id": entity_id},
                    blocking=True,
                )
        except Exception as err:  # noqa: BLE001 – ein Gerät darf die anderen nicht blockieren
            self.log(
                CAT_DEVICE,
                tr("Verschattung: {name} nicht erreichbar", name=state.name),
                str(err),
                level="warning",
            )
            return False
        if close:
            self._shading_closed.add(entity_id)
        else:
            self._shading_closed.discard(entity_id)
        return True

    @callback
    def _on_shading_change(self, entity_id: str, old: Any, new: Any) -> None:
        """Handbedienung erkennen: eine Fahrt, die nicht von uns kommt, pausiert die Automatik."""
        if self.shading_mode != "auto" or old is None or new is None:
            return
        position = to_float(new.attributes.get("current_position"))
        old_position = to_float(old.attributes.get("current_position"))
        if position is None:
            return
        now = dt_util.utcnow()
        last = self._shading_last.get(entity_id)
        if last is not None and now < last["until"]:
            last["position"] = position
            return
        if old_position is not None and abs(position - old_position) < 1:
            return
        if last is not None and last.get("position") is not None and abs(position - last["position"]) < 1:
            return

        if position <= self.shading_close_position + 5:
            self._shading_closed.add(entity_id)
        else:
            self._shading_closed.discard(entity_id)
        minutes = int(to_float(self.config.get(CONF_SHADING_MANUAL_MINUTES)) or 0)
        self.log(
            CAT_MANUAL,
            tr("Verschattung von Hand"),
            tr("Automatik pausiert für {m} min", m=minutes) if minutes else tr("Automatik bleibt aus"),
        )
        if minutes:
            self._shading_manual_until = now + timedelta(minutes=minutes)
            self._set_shading_state(STATE_MANUAL, "manual", self._shading_sun)
        self._save()

    @callback
    def _set_shading_state(self, state: str, reason: str, sun: bool) -> None:
        if (state, reason, sun) == (self._shading_state, self._shading_reason, self._shading_sun):
            return
        self._shading_state = state
        self._shading_reason = reason
        self._shading_sun = sun
        self._notify()
