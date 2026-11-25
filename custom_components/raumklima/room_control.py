"""Bedienung eines Raums: Wunschtemperatur, Ein/Aus, Boost, Übergabe ans Gerät (Teil von RaumklimaController)."""

from __future__ import annotations

from datetime import datetime, timedelta
import logging
from typing import Any

from homeassistant.util import dt as dt_util

from .const import (
    BOOST_MINUTES_MAX,
    BOOST_MINUTES_MIN,
    BOOST_TEMP_MAX,
    BOOST_TEMP_MIN,
    CONF_BOOST_MINUTES,
    CONF_BOOST_TEMP,
    CONF_COMFORT_TEMP,
    CONF_ROOM_TYPE,
    OFF_SOURCE_USER,
)
from .decision_log import (
    CAT_MANUAL,
    fmt_temp,
)
from .logic import (
    clamp,
)
from .msg import tr
from .planning import (
    AWAY_STAGES,
)
from .room_trv import MANUAL_OVERRIDE
from .ventilation import MIN_USEFUL_TARGET, comfort_temperature

_LOGGER = logging.getLogger(__name__.rsplit(".", 1)[0] + ".controller")


class ControlMixin:
    """Bedienung eines Raums: Wunschtemperatur, Ein/Aus, Boost, Übergabe ans Gerät (Teil von RaumklimaController)."""

    # ================================================================ Bedienung
    async def async_resume_manual(self, by: str | None = None) -> None:
        """Handverstellung beenden: auf die in den Einstellungen hinterlegte Wunschtemperatur."""
        if self._manual_until is not None or self.target_temp != self.comfort_temp:
            # Mitschreiben – sonst sieht man später nicht, warum eine Handverstellung endete
            self.log(
                CAT_MANUAL,
                tr("Handverstellung beendet – Automatik fortgesetzt"),
                tr("„Fortsetzen“ getippt") + (tr(" von {who}", who=by) if by else ""),
            )
        self.target_temp = self.comfort_temp
        self._manual_until = None
        self._manual_candidate = None
        self._save()
        self._notify()
        await self._apply()

    @property
    def setpoint_history(self) -> list[dict[str, Any]]:
        """Letzte Sollwerte für die Diagnose (max. 24 h, newest last)."""
        return list(self._setpoint_history)

    def record_setpoint(
        self,
        setpoint: float,
        expected: float | None,
        *,
        blocked: bool = False,
    ) -> None:
        """Sollwert-Wechsel mit Plan-Ziel protokollieren (Diagnose, #64)."""
        now = dt_util.utcnow()
        try:
            _, target, reason = self.peek_plan()
        except Exception:  # noqa: BLE001 – Diagnose darf nie selbst abstürzen
            target, reason = self.effective_target, None
        self._setpoint_history.append(
            {
                "t": now.isoformat(),
                "setpoint": round(float(setpoint), 1),
                "target": round(float(target), 1),
                "expected": round(float(expected), 1) if expected is not None else None,
                "reason": reason,
                "blocked": blocked,
            }
        )
        cutoff = now - timedelta(hours=24)
        self._setpoint_history = [
            entry
            for entry in self._setpoint_history
            if datetime.fromisoformat(str(entry.get("t"))) >= cutoff
        ][-500:]

    async def async_set_target(self, temperature: float, by: str | None = None) -> None:
        new = clamp(float(temperature), self.trv_min, self.trv_max)
        on, current, reason = self.plan()
        override = reason in AWAY_STAGES and new > current
        now = dt_util.utcnow()
        changed = new != self.target_temp
        if changed:
            if override:
                # Jemand will es trotz Abwesenheit wärmer → Absenkung für 3 h aussetzen
                self._manual_until = now + MANUAL_OVERRIDE
            elif self.override_minutes > 0:
                # Auch ohne Zeitplan: Die Handverstellung bekommt ein Zeitfenster, damit die
                # Karte „Zeitplan fortsetzen“ bzw. „Wunschtemperatur fortsetzen“ zeigen kann.
                self._manual_until = now + timedelta(minutes=self.override_minutes)
        if changed:
            self.log(
                CAT_MANUAL,
                tr("Wunschtemperatur {old} → {new}", old=fmt_temp(self.target_temp), new=fmt_temp(new)),
                tr("in Home Assistant geändert")
                + (tr(" von {who}", who=by) if by else "")
                + (tr("; Absenkung für 3 h ausgesetzt") if override else ""),
            )
        self.target_temp = new
        self._save()
        self._notify()
        await self._apply()

    @property
    def comfort_temp(self) -> float:
        """Wunschtemperatur (eingestellt oder Standard des Raumtyps)."""
        return comfort_temperature(
            self.config.get(CONF_COMFORT_TEMP), self.config.get(CONF_ROOM_TYPE)
        )

    async def async_set_hvac_mode(self, mode: str) -> None:
        """Heat / Auto / Off aus der Karte.

        ``auto`` heißt: Raumklima pausiert für diesen Raum und das Gerät fährt sein
        eigenes Wochenprogramm — es wird kein Sollwert mehr geschrieben.
        """
        mode = str(mode or "").lower()
        if mode == "auto":
            if not self.hvac_auto:
                self.log(
                    CAT_MANUAL,
                    tr("Automatik am Gerät"),
                    tr("Raumklima pausiert – das Thermostat fährt sein eigenes Programm"),
                )
            self.hvac_auto = True
            self.hvac_on = True
            self.off_source = None
            self._save()
            self._notify()
            await self._hand_over_to_device()
            return
        if self.hvac_auto:
            self.hvac_auto = False
            self.log(CAT_MANUAL, tr("Automatik beendet"), tr("Raumklima übernimmt wieder"))
            self._save()
            self._notify()
        await self.async_set_hvac_on(mode != "off")

    async def _hand_over_to_device(self) -> None:
        """Gerät auf sein eigenes Programm stellen (Preset „auto“/„schedule“)."""
        presets = [str(p).lower() for p in (self._trv_attr("preset_modes") or [])]
        target = next((p for p in ("auto", "schedule", "program", "programme", "timer", "timed") if p in presets), None)
        if target is None:
            return
        try:
            await self._call_climate("set_preset_mode", preset_mode=target)
            _LOGGER.info("%s: Gerät auf eigenes Programm gestellt (%s)", self.name, target)
        except Exception as exc:  # noqa: BLE001
            _LOGGER.debug("%s: Preset %s nicht setzbar: %s", self.name, target, exc)

    async def async_set_hvac_on(self, on: bool) -> None:
        if on and self.hvac_auto:
            # „Ein“ heißt: Raumklima übernimmt wieder
            self.hvac_auto = False
            self.log(CAT_MANUAL, tr("Automatik beendet"), tr("Raumklima übernimmt wieder"))
        if on and not self.hvac_on and self.target_temp < MIN_USEFUL_TARGET:
            # Raum war aus (Sollwert-Rest wie 5 °C) → mit Wunschtemperatur starten
            self.target_temp = self.comfort_temp
        if on != self.hvac_on:
            self.log(CAT_MANUAL, tr("Raum eingeschaltet") if on else tr("Raum ausgeschaltet"), tr("in Home Assistant"))
        self.hvac_on = on
        self.off_source = None if on else OFF_SOURCE_USER
        self._save()
        self._notify()
        await self._apply()

    async def async_set_boost(self, minutes: int | None = None, temperature: float | None = None) -> None:
        """Zeitlich begrenzt wärmer heizen („30 min wärmer"), danach gilt wieder der Rest."""
        if temperature is not None:
            offset = max(BOOST_TEMP_MIN, min(BOOST_TEMP_MAX, float(temperature)))
            self.boost_temperature = min(self.comfort_temp + offset, self.trv_max)
        await self._set_boost(
            minutes if minutes is not None else int(self.config.get(CONF_BOOST_MINUTES) or 30)
        )

    async def async_boost(self, mode: str = "minutes", minutes: int | None = None) -> None:
        """Boost mit Ziel: ``minutes`` | ``next`` (bis zum nächsten Zeitfenster) | ``unlimited`` | ``off``."""
        if mode == "off":
            await self.async_clear_boost()
            return
        if mode == "unlimited":
            await self._set_boost(None, open_ended=True)
            return
        if mode == "next":
            local_now = dt_util.now()
            nxt = self.next_plan_window(local_now)
            if nxt is None:
                await self._set_boost(120)
                return
            start, _want = nxt
            delta = (start - local_now).total_seconds() / 60
            await self._set_boost(max(5, min(480, int(delta))))
            return
        await self._set_boost(minutes if minutes is not None else int(self.config.get(CONF_BOOST_MINUTES) or 30))

    async def _set_boost(self, minutes: int | None, open_ended: bool = False) -> None:
        """Boost setzen – ``open_ended`` heißt: bis zum Ausschalten."""
        offset = float(self.config.get(CONF_BOOST_TEMP) or 2.0)
        offset = max(BOOST_TEMP_MIN, min(BOOST_TEMP_MAX, offset))
        self.boost_temperature = min(self.comfort_temp + offset, self.trv_max)
        if open_ended:
            self.boost_open = True
            self.boost_until = None
            self.log(
                CAT_MANUAL,
                tr("Boost {t} ohne Zeitlimit", t=fmt_temp(self.boost_temperature)),
                tr("läuft, bis du den Boost beendest"),
            )
        else:
            duration = max(BOOST_MINUTES_MIN, min(BOOST_MINUTES_MAX, int(minutes or 30)))
            self.boost_open = False
            self.boost_until = dt_util.utcnow() + timedelta(minutes=duration)
            self.log(
                CAT_MANUAL,
                tr("Boost {t} für {m} min", t=fmt_temp(self.boost_temperature), m=duration),
                tr("in Home Assistant"),
            )
        if not self.hvac_on:
            self.hvac_on = True
            self.off_source = None
        self._save()
        self._notify()
        await self._apply()

    async def async_clear_boost(self) -> None:
        """Laufenden Boost vorzeitig beenden."""
        if self.boost_until is None and not self.boost_open:
            return
        self.boost_open = False
        self.boost_until = None
        self.boost_temperature = None
        self.log(CAT_MANUAL, tr("Boost beendet"), tr("in Home Assistant"))
        self._save()
        self._notify()
        await self._apply()

    @property
    def boost_active(self) -> bool:
        return self.boost_open or (self.boost_until is not None and dt_util.utcnow() < self.boost_until)

    async def async_set_window_logic(self, enabled: bool) -> None:
        self.window_logic = enabled
        self._save()
        self._notify()
        await self._apply()
