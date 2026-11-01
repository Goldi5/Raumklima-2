"""Thermostat ansteuern: Zustand lesen, Ein/Aus-Art, Presets, Offset, Schutz gegen Endlosschleifen."""

from __future__ import annotations

from datetime import timedelta
import logging
from typing import Any

from homeassistant.components import persistent_notification
from homeassistant.const import ATTR_ENTITY_ID, ATTR_TEMPERATURE
from homeassistant.core import State, callback
from homeassistant.util import dt as dt_util

from .const import (
    CAL_OFFSET,
    CAL_TARGET,
    CONF_FOLLOW_TRV,
    CONF_NOTIFY,
    CONF_OFF_METHOD,
    CONF_OFFSET_MIN_INTERVAL,
    CONF_OFFSET_THRESHOLD,
    CONF_ON_PRESET,
    DOMAIN,
    KIND_TRV_FAILURE,
    OFF_AUTO,
    OFF_HVAC,
    OFF_MIN_TEMP,
    OFF_PRESET,
    OFFSET_MATCH_TOLERANCE,
    OFFSET_MAX,
    OFFSET_MIN,
    OFFSET_STEP,
    ON_PRESET_AUTO,
    ON_PRESET_AVOID,
    ON_PRESET_CANDIDATES,
    PRESET_GRACE_SECONDS,
    SETPOINT_MATCH_TOLERANCE,
    SLOW_RETRY_INTERVAL,
)
from .decision_log import (
    CAT_DEVICE,
    CAT_MANUAL,
    fmt_temp,
)
from .logic import (
    calc_offset,
    calc_target_setpoint,
    choose_on_preset,
    clamp,
    is_valid,
    to_float,
    values_match,
)
from .planning import (
    AWAY_STAGES,
)
from .sync import SyncJob

_LOGGER = logging.getLogger(__name__)

MANUAL_OVERRIDE = timedelta(hours=3)  # Drehen am Regler während Absenkung
# Presets, in denen das Thermostat auf den gesendeten Sollwert regelt – gleichwertig.
# Tuya-TRVs (z. B. TRV602Z) springen beim Sollwert-Setzen selbst zwischen eco und comfort.
HEAT_PRESETS = frozenset({"manual", "heat", "eco", "comfort", "none"})
PRESET_FIGHT_COUNT = 4  # so oft springt das Thermostat selbst aufs gleiche Preset …
PRESET_FIGHT_WINDOW = timedelta(minutes=10)  # … in dieser Zeit → nicht mehr dagegen ankämpfen
PRESET_BACKOFF = timedelta(minutes=30)
SEND_LIMIT = 40  # mehr Befehle in 10 min → Bremse
SEND_WINDOW = timedelta(minutes=10)
SEND_BACKOFF = timedelta(minutes=15)


class TrvMixin:
    """Thermostat-Teil des Raum-Controllers."""

    # ================================================================ Zustände
    def _trv_state(self) -> State | None:
        return self.hass.states.get(self.trv)

    def _trv_attr(self, attr: str, default: Any = None) -> Any:
        state = self._trv_state()
        return state.attributes.get(attr, default) if state else default

    def trv_available(self) -> bool:
        """TRV erreichbar?"""
        state = self._trv_state()
        return state is not None and is_valid(state.state)

    @property
    def trv_min(self) -> float:
        return to_float(self._trv_attr("min_temp")) or 5.0

    @property
    def trv_max(self) -> float:
        return to_float(self._trv_attr("max_temp")) or 30.0

    @property
    def trv_temperature(self) -> float | None:
        """Vom TRV gemeldete Ist-Temperatur (inkl. Offset)."""
        return to_float(self._trv_attr("current_temperature"))

    def _detect_manual_change(self, old: State, new: State) -> None:
        """Änderungen direkt am TRV erkennen (nicht von uns gesendet)."""
        if self.sync.jobs or self.paused or self._apply_lock.locked():
            return
        method = self._off_method()
        follow = bool(self.config[CONF_FOLLOW_TRV])
        was_off = self._is_trv_off(old, method)
        now_off = self._is_trv_off(new, method)
        old_p = old.attributes.get("preset_mode")
        new_p = new.attributes.get("preset_mode")
        if was_off != now_off and method != OFF_MIN_TEMP:
            if follow:
                self.hvac_on = not now_off
                self._save()
                _LOGGER.info("%s: TRV am Gerät %s", self.name, "aus" if now_off else "an")
                self.log(CAT_MANUAL, f"Am Thermostat {'ausgeschaltet' if now_off else 'eingeschaltet'}", "„Drehen am Thermostat übernehmen“ ist an")
            else:
                self.log(CAT_MANUAL, "Am Thermostat geschaltet – zurückgestellt", "„Drehen am Thermostat übernehmen“ ist aus")
                self.hass.async_create_task(self._apply())
            return
        if now_off:
            return
        if new_p != old_p:
            # Preset-Wechsel lädt am TRV oft einen gespeicherten Wert (z. B.
            # eco_temperature). Den nicht als Wunsch übernehmen, sondern
            # Preset und Sollwert der Integration wiederherstellen.
            _LOGGER.info(
                "%s: Preset am TRV auf '%s' geändert – stelle '%s' wieder her",
                self.name,
                new_p,
                self._on_preset(),
            )
            if new_p == self._on_preset():
                return  # steht schon auf dem gewünschten Preset
            if new_p in HEAT_PRESETS and old_p in HEAT_PRESETS and new_p != "none":
                # eco ↔ comfort: regelt weiter auf den Sollwert. Nicht zurückstellen,
                # nur den Sollwert prüfen (das Thermostat lädt beim Wechsel evtl. einen eigenen Wert).
                self.hass.async_create_task(self._apply())
                return
            if self._handle_preset_fight(new_p):
                return
            self.log(CAT_DEVICE, f"Preset am Thermostat „{new_p}“ – stelle „{self._on_preset()}“ wieder her", "Preset-Wechsel laden am Gerät alte Werte, das ist kein Wunsch")
            self.hass.async_create_task(self._apply())
            return
        if self.cal_mode == CAL_TARGET:
            return
        old_t = to_float(old.attributes.get(ATTR_TEMPERATURE))
        new_t = to_float(new.attributes.get(ATTR_TEMPERATURE))
        if new_t is None or old_t == new_t:
            return
        if values_match(new_t, self._desired_setpoint(), SETPOINT_MATCH_TOLERANCE):
            return
        if self._preset_changed_at and dt_util.utcnow() - self._preset_changed_at < timedelta(
            seconds=PRESET_GRACE_SECONDS
        ):
            # Tuya lädt beim Preset-Wechsel den gespeicherten Wert oft erst im
            # nächsten Update nach – das ist kein Wunsch des Nutzers.
            _LOGGER.debug("%s: Sollwert %s kurz nach Preset-Wechsel ignoriert", self.name, new_t)
            self.hass.async_create_task(self._apply())
            return
        if follow:
            _LOGGER.info("%s: Sollwert am TRV geändert auf %s", self.name, new_t)
            away = self.plan()[2] in AWAY_STAGES
            self.log(
                CAT_MANUAL,
                f"Am Thermostat gedreht: {fmt_temp(new_t)}",
                "wird neue Wunschtemperatur" + ("; Absenkung für 3 h ausgesetzt" if away else ""),
            )
            if away:
                self._manual_until = dt_util.utcnow() + MANUAL_OVERRIDE
            self.target_temp = new_t
            self._save()
        else:
            self.hass.async_create_task(self._apply())

    # ================================================================ TRV steuern
    def _off_method(self) -> str:
        method = self.config[CONF_OFF_METHOD]
        if method != OFF_AUTO:
            return method
        if "off" in (self._trv_attr("preset_modes") or []):
            return OFF_PRESET
        if "off" in (self._trv_attr("hvac_modes") or []):
            return OFF_HVAC
        return OFF_MIN_TEMP

    def _is_trv_off(self, state: State | None, method: str) -> bool:
        if state is None:
            return False
        if method == OFF_PRESET:
            return state.attributes.get("preset_mode") == "off"
        if method == OFF_HVAC:
            return state.state == "off"
        return values_match(
            state.attributes.get(ATTR_TEMPERATURE), self.trv_min, SETPOINT_MATCH_TOLERANCE
        )

    def _handle_preset_fight(self, new_p: str | None) -> bool:
        """Springt das Thermostat immer wieder selbst auf ein Preset? Dann nicht endlos dagegenhalten."""
        now = dt_util.utcnow()
        if self._restore_paused_until and now < self._restore_paused_until:
            return True  # Pause: nicht zurückstellen
        self._preset_flips.append((now, str(new_p)))
        same = [t for t, p in self._preset_flips if p == str(new_p) and now - t <= PRESET_FIGHT_WINDOW]
        if len(same) < PRESET_FIGHT_COUNT:
            return False
        self._preset_flips.clear()
        available = self._trv_attr("preset_modes") or []
        if new_p and new_p in available and new_p not in ON_PRESET_AVOID and new_p != "off":
            self.preset_learned = new_p
            self._save()
            self.log(
                CAT_DEVICE,
                f"Thermostat bleibt bei „{new_p}“ – wird übernommen",
                f"es ist {len(same)}× in 10 min von selbst darauf gesprungen; „{new_p}“ regelt genauso auf den Sollwert, also kein Hin und Her mehr",
                level="warn",
            )
            self.hass.async_create_task(self._apply())
            return True
        self._restore_paused_until = now + PRESET_BACKOFF
        self.log(
            CAT_DEVICE,
            f"Thermostat springt immer wieder auf „{new_p}“ – 30 min Pause",
            "damit Thermostat und Integration sich nicht endlos verstellen (Batterie). Zeitplan oder Automatik am Thermostat prüfen.",
            level="warn",
        )
        return True

    def _on_preset(self) -> str | None:
        available = self._trv_attr("preset_modes") or []
        if self.preset_learned and self.preset_learned in available:
            return self.preset_learned
        return choose_on_preset(
            self._trv_attr("preset_modes") or [],
            self.config.get(CONF_ON_PRESET),
            self.trv_on_preset,
            candidates=ON_PRESET_CANDIDATES,
            avoid=ON_PRESET_AVOID,
            auto_value=ON_PRESET_AUTO,
        )

    def _desired_setpoint(self) -> float:
        target = self.effective_target
        if self.cal_mode == CAL_TARGET and self.sensor_ok:
            return calc_target_setpoint(
                target,
                self._ext_value,
                self.trv_temperature,
                low=self.trv_min,
                high=self.trv_max,
            )
        return clamp(target, self.trv_min, self.trv_max)

    async def _call_climate(self, service: str, **data: Any) -> None:
        await self.hass.services.async_call(
            "climate",
            service,
            {ATTR_ENTITY_ID: self.trv, **data},
            blocking=True,
        )

    @callback
    def _on_sync_event(self, event: str, job: SyncJob) -> None:
        if event == "send":
            now = dt_util.utcnow()
            self._sends.append(now)
            recent = [t for t in self._sends if now - t <= SEND_WINDOW]
            if len(recent) > SEND_LIMIT and not (self.throttled_until and now < self.throttled_until):
                self.throttled_until = now + SEND_BACKOFF
                self._sends.clear()
                self.log(
                    CAT_DEVICE,
                    "Zu viele Befehle – 15 min Pause",
                    f"{len(recent)} Befehle in 10 min ans Thermostat; irgendetwas stellt es immer wieder zurück. Schützt die Batterie.",
                    level="warn",
                )
            self.log(CAT_DEVICE, f"Thermostat: {job.description}", job.why)
        elif event == "confirmed":
            self.log(CAT_DEVICE, f"Thermostat bestätigt: {job.description}", f"nach {job.attempts} Versuchen")
        elif event == "failed":
            self.log(CAT_DEVICE, f"Thermostat reagiert nicht: {job.description}", f"{job.attempts} Versuche ohne Bestätigung – versuche weiter alle 5 min", level="warn")

    # ================================================================ Offset
    def _cal_interval_passed(self) -> bool:
        if self._last_cal_send is None:
            return True
        minutes = float(self.config[CONF_OFFSET_MIN_INTERVAL])
        return dt_util.utcnow() - self._last_cal_send >= timedelta(minutes=minutes)

    async def async_calibrate(self, force: bool = False) -> None:
        """Automatischen Offset berechnen und senden."""
        if self.cal_mode != CAL_OFFSET or not self.cal_entity:
            if self.cal_mode == CAL_TARGET and force:
                self._last_cal_send = None
                self._last_target_setpoint = None
                await self._apply(from_measurement=True)
            return
        if self.paused and not force:
            return  # Zugluft verfälscht den Fühler
        if not self.sensor_ok or not self.trv_available():
            return
        cal_state = self.hass.states.get(self.cal_entity)
        if cal_state is None or cal_state.state == "unavailable":
            return
        if self.sync.is_pending("offset"):
            return  # vorherigen Offset erst bestätigen lassen
        if cal_state.state == "unknown":
            # Tuya-TRVs melden den Offset erst nach dem ersten Setzen. Einmal 0
            # senden, damit ein bekannter Ausgangswert für die Rechnung existiert.
            await self._send_offset(0.0)
            return
        if not force and not self._cal_interval_passed():
            return

        low = max(OFFSET_MIN, to_float(cal_state.attributes.get("min")) or OFFSET_MIN)
        high = min(OFFSET_MAX, to_float(cal_state.attributes.get("max")) or OFFSET_MAX)
        step = to_float(cal_state.attributes.get("step")) or OFFSET_STEP
        new = calc_offset(
            self._ext_value,
            self.trv_temperature,
            to_float(cal_state.state),
            threshold=0.0 if force else float(self.config[CONF_OFFSET_THRESHOLD]),
            low=low,
            high=high,
            step=step,
        )
        if new is None:
            return
        _LOGGER.debug(
            "%s: Offset %s -> %s (Raum %s, TRV %s)",
            self.name,
            cal_state.state,
            new,
            self._ext_value,
            self.trv_temperature,
        )
        await self._send_offset(new)

    async def _send_offset(self, new: float) -> None:
        if not self.cal_entity:
            return
        self._last_cal_send = dt_util.utcnow()
        self._last_cal_value = new
        entity = self.cal_entity
        await self.sync.request(
            "offset",
            f"Offset {fmt_temp(new)}",
            lambda: self.hass.services.async_call(
                "number",
                "set_value",
                {ATTR_ENTITY_ID: entity, "value": new},
                blocking=True,
            ),
            lambda: values_match(
                (self.hass.states.get(entity) or State(entity, "unknown")).state,
                new,
                OFFSET_MATCH_TOLERANCE,
            ),
            why=f"Raumfühler {fmt_temp(self._ext_value)}, Thermostat misst {fmt_temp(self.trv_temperature)}",
        )

    # ================================================================ Meldungen
    def _notification_id(self) -> str:
        return f"{DOMAIN}_{self.entry.entry_id}_sync"

    @callback
    def _on_sync_failed(self, job: SyncJob) -> None:
        hub = self.hub
        if hub and hub.has_targets(KIND_TRV_FAILURE):
            hub.notify(
                KIND_TRV_FAILURE,
                f"⚠️ {self.name}: Thermostat reagiert nicht",
                f"{job.description} wurde nach {job.attempts} Versuchen nicht bestätigt.",
                speak=False,
            )
        notify_bell = hub.opt("notify_on_failure") if hub else self.config[CONF_NOTIFY]
        if not notify_bell:
            return
        persistent_notification.async_create(
            self.hass,
            (
                f"{job.description} wurde nach {job.attempts} Versuchen nicht vom "
                f"Thermostat bestätigt. Raumklima versucht es alle "
                f"{SLOW_RETRY_INTERVAL // 60} min weiter."
            ),
            title=f"Raumklima {self.name}: Thermostat reagiert nicht",
            notification_id=self._notification_id(),
        )

    @callback
    def _on_sync_recovered(self) -> None:
        persistent_notification.async_dismiss(self.hass, self._notification_id())
