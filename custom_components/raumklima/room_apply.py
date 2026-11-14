"""Plan ans Gerät bringen: Ein/Aus, Sollwert, weitere Heizquellen, Bosch-Sonderfall.

Teil von ``RaumklimaController`` (als Mixin, damit controller.py überschaubar bleibt)."""

from __future__ import annotations

import asyncio
import logging
from typing import Any

from homeassistant.util import dt as dt_util

from .const import (
    CAL_TARGET,
    CONF_BOOST_SOURCES,
    CONF_HEAT_SOURCES,
    OFF_HVAC,
    OFF_MIN_TEMP,
    OFF_PRESET,
)
from .decision_log import (
    fmt_temp,
)
from .logic import (
    shadow_opening,
    to_float,
    values_match,
)
from .msg import tr
from .planning import (
    schedule_window,
)
from .room_const import (
    REASON_BOOST,
    REASON_COOL,
    REASON_VALVE_CARE,
)
from .room_extra_trvs import AcSource, ExtraTrv
from .room_trv import HEAT_PRESETS

_LOGGER = logging.getLogger(f"{__package__}.controller")  # gleicher Logger-Name wie bisher


class ApplyMixin:
    """Plan ans Gerät bringen: Ein/Aus, Sollwert, weitere Heizquellen, Bosch-Sonderfall."""

    async def _write_off_setpoint(self) -> None:
        """Abschalt-Sollwert schreiben – Gerätegrenze erst hier lesen (Issue #37).

        Solange das Gerät seine Mindesttemperatur nicht meldet, gibt es keinen sinnvollen Wert:
        der frühere Rückfall (5,0 °C) stand dann dauerhaft „unbestätigt" im Sync und löste nach
        fünf Runden eine dringende Meldung aus, obwohl nichts zu tun war.
        """
        low = to_float(self._trv_attr("min_temp"))
        if low is None:
            raise RuntimeError("Mindesttemperatur des Geräts noch unbekannt")
        await self._write_setpoint(low)

    async def _ensure_bosch_manual(self) -> None:
        """Bosch (und kompatible): internes Zeitprogramm deaktivieren.

        Setzt operating_mode auf 'manual', damit externe Setpoints nicht vom
        Geraete-eigenen Zeitplan ueberschrieben werden (Better Thermostat 1.8.0+).
        """
        try:
            await self._call_climate("set_preset_mode", preset_mode="manual")
            _LOGGER.info("%s: Bosch operating_mode auf 'manual' gesetzt", self.name)
        except Exception as exc:  # noqa: BLE001
            _LOGGER.debug("%s: operating_mode 'manual' nicht unterstuetzt: %s", self.name, exc)
        finally:
            self._bosch_manual_pending = False

    def _source_config(self) -> list[dict[str, Any]]:
        """Heizquellen (TRV/AC) mit Metadaten; ohne Konfiguration aus den Zusatz-Thermostaten."""
        raw = self.config.get(CONF_HEAT_SOURCES)
        out: list[dict[str, Any]] = []
        if isinstance(raw, list) and raw:
            for i, item in enumerate(raw):
                if not isinstance(item, dict):
                    continue
                eid = str(item.get("entity") or "").strip()
                if not eid or eid == self.trv:
                    continue
                out.append({
                    "id": str(item.get("id") or f"src{i + 1}"),
                    "entity": eid,
                    "name": str(item.get("name") or eid),
                    "type": str(item.get("type") or "trv"),
                    "offset": to_float(item.get("offset")) or 0.0,
                    "trigger": str(item.get("trigger") or ""),
                    "untouched": bool(item.get("untouched")),
                })
            return out
        return [
            {"id": f"extra:{e}", "entity": e, "name": e, "type": "trv", "offset": 0.0, "trigger": "", "untouched": False}
            for e in self._extra_ids
        ]

    @property
    def all_sources(self) -> list[dict[str, Any]]:
        """Haupt-Thermostat + alle weiteren Quellen."""
        main = {"id": "main", "entity": self.trv, "name": self.name, "type": "trv", "offset": 0.0, "trigger": "", "untouched": False}
        return [main, *self.source_cfg]

    def _active_window(self) -> dict[str, Any] | None:
        return schedule_window(self.schedules, dt_util.now())

    def _selected_ids(self) -> set[str]:
        """Quellen, die im laufenden Fenster (oder außerhalb) aktiv sind."""
        every = {s["id"] for s in self.all_sources if not s["untouched"]}
        win = self._active_window()
        if win is None:
            return every
        chosen = {str(x) for x in (win.get("sources") or [])}
        return chosen or every

    def _boost_ids(self) -> set[str]:
        """Quellen, die während eines Boosts laufen (selected / all / first)."""
        mode = str(self.config.get(CONF_BOOST_SOURCES) or "selected")
        if mode == "all":
            return {s["id"] for s in self.all_sources if not s["untouched"]}
        chosen = self._selected_ids()
        if mode == "first":
            first = next((s["id"] for s in self.all_sources if s["id"] in chosen), None)
            return {first} if first else set()
        return chosen

    def _source_on(self, src: dict[str, Any], want_on: bool, boosting: bool) -> bool | None:
        """Soll die Quelle laufen? None = unangetastet (keine Befehle)."""
        if src["untouched"]:
            return None
        if not want_on:
            return False
        if boosting:
            return src["id"] in self._boost_ids()
        trigger = src.get("trigger")
        if trigger:
            st = self.hass.states.get(trigger)
            if st is not None and st.state == "on":
                return True
        return src["id"] in self._selected_ids()

    def _extra_for(self, entity_id: str) -> ExtraTrv | None:
        return self._extra_by_id.get(entity_id)

    def _ac_for(self, entity_id: str) -> AcSource | None:
        return self._ac_by_id.get(entity_id)

    async def _apply(self, from_measurement: bool = False) -> None:
        """Soll-Zustand berechnen und ans TRV senden (mit Prüfung)."""
        async with self._apply_lock:
            if not self._started:
                return  # Raum wird gerade entladen/neu geladen – nichts mehr senden
            if self.monitor:
                return  # Überwachungsraum: nichts zu regeln, nichts zu senden
            if self.hvac_auto:
                return  # Gerät fährt sein eigenes Programm – nicht dazwischenfunken
            if getattr(self, "_manual_candidate", None) is not None:
                # Gerät hat gerade einen neuen Sollwert gemeldet – erst die Standzeit abwarten,
                # sonst überschreiben wir den Handeingriff mit dem alten Ziel.
                return
            if self.throttled_until and dt_util.utcnow() < self.throttled_until:
                return  # Bremse aktiv – zu viele Befehle in kurzer Zeit
            method = self._off_method()
            plan_on, _target, reason = self.plan()
            self._log_plan(plan_on, _target, reason)
            if _LOGGER.isEnabledFor(logging.DEBUG):
                shadow = self.valve_shadow()
                _LOGGER.debug(
                    "%s: Ventil-Schatten berechnet %s %%, Gerät %s %% (Ziel %s, Ist %s)",
                    self.name, shadow["calc_pct"], shadow["device_pct"],
                    shadow["target_c"], shadow["current_c"],
                )
            want_on = self.hvac_on and not self.paused and plan_on
            if reason == REASON_VALVE_CARE and self.hvac_on:
                want_on = True
            boosting = reason == REASON_BOOST
            if reason == REASON_COOL:
                await self._apply_cooling(_target)
                return
            if self.ac_heat_active:
                await self._send_off(method)
                for ac in self.ac_sources:
                    await ac.apply(bool(want_on), _target)
                await self._apply_extras(False, method, _target, boosting)
                return
            if self.valve_direct:
                if not want_on:
                    await self._send_off(method)
                else:
                    await self._send_on_mode(method)
                    opening = shadow_opening(_target, self.current_temperature, heating=True)
                    if opening is not None:
                        await self._send_valve(opening)
                await self._apply_extras(want_on, method, _target, boosting)
                return
            main_on = self._source_on(self.all_sources[0], want_on, boosting)

            if not main_on:
                await self._send_off(method)
                await self._apply_extras(want_on, method, _target, boosting)
                return
            await self._send_on_mode(method)
            if not await self._send_setpoint(from_measurement):
                return
            await self._apply_extras(want_on, method, _target, boosting)

    async def _apply_cooling(self, target: float) -> None:
        """Zu warm: Heizthermostate aus, Klimaanlagen in den Kühlmodus."""
        method = self._off_method()
        await self._send_off(method)
        for extra in self.extra_trvs:
            try:
                await extra.apply(False, method, target)
            except Exception as err:  # noqa: BLE001 – ein Gerät darf die anderen nicht aufhalten
                _LOGGER.warning("%s: Heizquelle %s (Kühlen): %s", self.name, extra.entity_id, err)
        for ac in self.ac_sources:
            try:
                await ac.apply_cooling(target)
            except Exception as err:  # noqa: BLE001
                _LOGGER.warning("%s: Klimaanlage %s (Kühlen): %s", self.name, ac.entity_id, err)

    async def _send_valve(self, opening: float) -> None:
        """Direkte Ventilöffnung schreiben (number) und bestätigen lassen."""
        if not self.valve_actuator:
            return
        value = round(float(opening), 1)
        await self.sync.request(
            "valve",
            tr("Ventil {p} %", p=f"{value:.0f}"),
            lambda: self._write_valve(value),
            lambda: self._valve_matches(value),
        )

    async def _write_valve(self, value: float) -> None:
        if not self.valve_actuator:
            return
        self._mark_own_write()
        await self.hass.services.async_call(
            "number",
            "set_value",
            {"entity_id": self.valve_actuator, "value": round(float(value), 1)},
            blocking=True,
        )

    def _valve_matches(self, value: float) -> bool:
        state = self.hass.states.get(self.valve_actuator or "")
        step = to_float(state.attributes.get("step")) if state is not None else None
        return values_match(state.state if state is not None else None, value, max(1.0, step or 1.0))

    async def _send_off(self, method: str) -> None:
        """Ausschalten – je nach Art: Preset „off“, HVAC „off“ oder Minimaltemperatur."""
        self.sync.cancel("setpoint")
        self.sync.cancel("hvac")
        self.sync.cancel("valve")
        if self.valve_direct:
            await self.sync.request(
                "valve",
                tr("Ventil 0 %"),
                lambda: self._write_valve(0.0),
                lambda: self._valve_matches(0.0),
            )
            return
        if method == OFF_PRESET:
            current = self._trv_attr("preset_mode")
            if current and current != "off":
                self.trv_on_preset = current
                self._save()
            await self.sync.request(
                "mode",
                "Preset 'off'",
                lambda: self._call_climate("set_preset_mode", preset_mode="off"),
                lambda: self._is_trv_off(self._trv_state(), OFF_PRESET),
            )
        elif method == OFF_HVAC:
            await self.sync.request(
                "mode",
                "HVAC 'off'",
                lambda: self._call_climate("set_hvac_mode", hvac_mode="off"),
                lambda: self._is_trv_off(self._trv_state(), OFF_HVAC),
            )
        else:
            # Die Gerätegrenze erst beim Senden lesen: beim Start ist `min_temp` kurz
            # unbekannt, und der Rückfallwert (5,0 °C) wurde früher als Ziel eingefroren
            # und nie bestätigt (Issue #37). Ist der Wert noch nicht da, scheitert der
            # Versuch ohne Schreibbefehl und wird – ohne Versuchsbudget zu kosten –
            # wiederholt, sobald das Gerät antwortet.
            low = to_float(self._trv_attr("min_temp"))
            await self.sync.request(
                "mode",
                tr("Minimaltemperatur {t}", t=fmt_temp(low)) if low is not None else tr("Minimaltemperatur"),
                self._write_off_setpoint,
                lambda: self._is_trv_off(self._trv_state(), OFF_MIN_TEMP),
            )

    async def _send_on_mode(self, method: str) -> None:
        """Einschalten, Teil 1: Modus/Preset so stellen, dass das Gerät nach Sollwert regelt."""
        if method == OFF_PRESET:
            preset = "comfort" if self.target_via == "comfort_temperature" else self._on_preset()
            current = self._trv_attr("preset_mode")
            if current in HEAT_PRESETS and current != "none" or (current == "none" and preset == "none"):
                self.sync.cancel("mode")  # regelt schon auf den Sollwert – Preset nicht umstellen
            elif preset:
                await self.sync.request(
                    "mode",
                    f"Preset '{preset}'",
                    lambda: self._call_climate("set_preset_mode", preset_mode=preset),
                    lambda: self._trv_attr("preset_mode") in HEAT_PRESETS,
                )
        elif method == OFF_HVAC:
            modes = [m for m in (self._trv_attr("hvac_modes") or []) if m != "off"]
            hvac = "heat" if "heat" in modes else (modes[0] if modes else "heat")
            await self.sync.request(
                "mode",
                f"HVAC '{hvac}'",
                lambda: self._call_climate("set_hvac_mode", hvac_mode=hvac),
                # „auto“ zählt nicht als eingeschaltet, wenn das Gerät dann seinen eigenen Zeitplan
                # fährt (Tado nach Ablauf der manuellen Einstellung) – sonst bliebe es dabei.
                lambda: self.trv_available()
                and getattr(self._trv_state(), "state", "off") != "off"
                and not self._device_own_program(self._trv_state()),
            )
        else:
            self.sync.cancel("mode")
        if method != OFF_HVAC and self._device_own_program(self._trv_state()):
            # Geräte, die über Preset/Mindesttemperatur geschaltet werden, aber auf HVAC „auto“
            # (eigener Wochenplan) stehen: auf „heat“ holen, sonst überschreibt der Plan den Sollwert.
            await self.sync.request(
                "hvac",
                "HVAC 'heat'",
                lambda: self._call_climate("set_hvac_mode", hvac_mode="heat"),
                lambda: self.trv_available() and not self._device_own_program(self._trv_state()),
            )

    async def _send_setpoint(self, from_measurement: bool) -> bool:
        """Einschalten, Teil 2: Sollwert senden. False, wenn es nichts zu senden gab."""
        setpoint = self._desired_setpoint()
        if from_measurement:
            # Bei Kalibrierart "target" nur bei echter Änderung senden
            if self._last_target_setpoint is not None and abs(
                setpoint - self._last_target_setpoint
            ) < 0.5:
                return False
            if not self._cal_interval_passed():
                return False
        if self.target_via == "comfort_temperature" and getattr(self.sync, "verify_delay", 20) < 120:
            # Batteriegeräte melden selten – nicht nach 5 Minuten „nicht bestätigt" rufen.
            self.sync.verify_delay = 120
        if self.sync.is_pending("mode"):
            await asyncio.sleep(2)  # Tuya braucht kurz nach Preset-Wechsel
        self._last_target_setpoint = setpoint
        if self.cal_mode == CAL_TARGET:
            self._last_cal_send = dt_util.utcnow()
        await self.sync.request(
            "setpoint",
            tr("Sollwert {t}", t=fmt_temp(setpoint)),
            lambda: self._write_setpoint(setpoint),
            lambda: self._setpoint_matches(setpoint),
        )
        return True

    async def _apply_extras(self, want_on: bool, method: str, target: float, boosting: bool) -> None:
        """Weitere Heizquellen je Auswahl schalten (TRV oder Klimaanlage)."""
        for src in self.source_cfg:
            on = self._source_on(src, want_on, boosting)
            if on is None:
                continue
            try:
                if src["type"] == "ac":
                    ac = self._ac_for(src["entity"])
                    if ac is not None:
                        await ac.apply(on, target)
                else:
                    extra = self._extra_for(src["entity"])
                    if extra is not None:
                        await extra.apply(on, method, target + float(src["offset"]))
            except Exception as err:  # noqa: BLE001 – eine Quelle darf die anderen nicht aufhalten
                _LOGGER.warning("%s: Heizquelle %s: %s", self.name, src["entity"], err)

    @property
    def trv_report_interval(self) -> float | None:
        """Abstand, in dem das Thermostat von sich aus meldet (Sekunden, Median)."""
        if len(self._trv_reports) < 3:
            return None
        deltas = [
            (b - a).total_seconds()
            for a, b in zip(self._trv_reports, list(self._trv_reports)[1:], strict=False)
        ]
        deltas = [d for d in deltas if 0 < d <= 7200]
        if len(deltas) < 2:
            return None
        deltas.sort()
        return deltas[len(deltas) // 2]

    @property
    def applied_target(self) -> float:
        """Was gerade gilt: berechnetes Ziel (Zeitplan, Boost, Absenkung), sonst der Wunsch."""
        on, target, _reason = self.peek_plan()
        return target if on else self.target_temp

    @property
    def sync_state(self) -> str:
        """Übertragung über alle Thermostate: failed > pending > ok."""
        states = [self.sync.state, *(x.sync.state for x in self.extra_trvs)]
        for s in ("failed", "pending"):
            if s in states:
                return s
        return "ok"
