"""Lüftungsassistent: bewertet Feuchte, Fenster und Temperatur, benachrichtigt."""

from __future__ import annotations

from collections.abc import Callable
from datetime import datetime, timedelta
import logging
from typing import TYPE_CHECKING, Any

from homeassistant.core import Event, callback
from homeassistant.helpers.event import async_track_time_interval
from homeassistant.util import dt as dt_util

from .const import (
    CONF_HUMIDITY_SENSOR,
    CONF_NOTIFY_TARGETS,
    CONF_QUIET_END,
    CONF_QUIET_START,
    CONF_REPEAT_MINUTES,
    CONF_ROOM_TYPE,
    CONF_TTS_TARGETS,
    CONF_WEATHER,
    KIND_TOO_COLD,
    KIND_VENT_CLOSE,
    KIND_VENT_DONE,
    KIND_VENT_OPEN,
    KIND_WINDOW_AWAY,
    CONF_NIGHT_ALARM,
    NOTIFY_ACTION_EVENT,
)
from .logic import to_float
from .planning import NIGHT_ALARM_TEMP, NIGHT_MORNING_REPEAT, morning_after, mute_until
from .ventilation import (
    DEFAULT_ROOM_TYPE,
    ROOM_TYPES,
    VENT_AIRING,
    VENT_DONE,
    VENT_OK,
    VENT_PLEASE_CLOSE,
    VENT_PLEASE_OPEN,
    VENT_TOO_COLD,
    VentInput,
    absolute_humidity,
    airing_dries,
    dew_point,
    evaluate,
    in_quiet_hours,
    mold_risk,
    recommended_duration,
)

if TYPE_CHECKING:
    from .controller import RaumklimaController

_LOGGER = logging.getLogger(__name__)
EVAL_INTERVAL = timedelta(seconds=30)
HUMIDITY_HYSTERESIS = 5.0
SNOOZE_MINUTES = 15
PLEASE_OPEN_REPEAT = 30  # min – Erinnerung "bitte lüften"
TTS_AFTER_REPEATS = 2  # Sprachansage ab der 3. Erinnerung "schließen"
WINDOW_AWAY_AFTER = 2  # min offen, während niemand da ist
WINDOW_AWAY_REPEAT = 30  # min
KIND_OF = {
    VENT_PLEASE_OPEN: KIND_VENT_OPEN,
    VENT_PLEASE_CLOSE: KIND_VENT_CLOSE,
    VENT_TOO_COLD: KIND_TOO_COLD,
    VENT_DONE: KIND_VENT_DONE,
}

MESSAGES = {
    VENT_PLEASE_OPEN: ("💧 {room}: Bitte lüften", "Luftfeuchte {hum:.0f} % – bitte ca. {dur} min stoßlüften."),
    VENT_PLEASE_CLOSE: ("🪟 {room}: Fenster schließen", "Lüftzeit von {dur} min erreicht – bitte schließen."),
    VENT_TOO_COLD: ("🥶 {room}: Raum kühlt aus", "Nur noch {temp:.1f} °C – bitte jetzt schließen."),
    VENT_DONE: ("✅ {room}: Luft ausgetauscht", "Luftfeuchte wieder {hum:.0f} % – du kannst schließen."),
}


class VentilationManager:
    """Lüftungsassistent für einen Raum."""

    def __init__(self, controller: RaumklimaController, stored: dict[str, Any] | None) -> None:
        self.c = controller
        self.hass = controller.hass
        cfg = controller.config
        self.room_type: str = cfg.get(CONF_ROOM_TYPE) or DEFAULT_ROOM_TYPE
        default_min, default_hum = ROOM_TYPES.get(self.room_type, ROOM_TYPES[DEFAULT_ROOM_TYPE])
        # Über Regler (number) einstellbar, dauerhaft gespeichert
        self.humidity_limit: float = default_hum
        self.min_temp: float = default_min
        self.max_drop: float = 3.0
        self.enabled: bool = True
        self.load(stored)
        self._cfg = cfg
        self._window_away_sent: datetime | None = None

        self.state: str = VENT_OK
        self.window_open_since: datetime | None = None
        self.temp_at_open: float | None = None
        self.humidity_high_since: datetime | None = None
        self.snooze_until: datetime | None = None
        self.muted_until: datetime | None = None
        self._last_sent: dict[str, datetime] = {}
        self._repeat_count: dict[str, int] = {}
        self._night_alarm_sent = False
        self._night_morning_sent: datetime | None = None
        self._unsubs: list[Callable[[], None]] = []

    def load(self, stored: dict[str, Any] | None) -> None:
        """Gespeicherte Reglerwerte übernehmen."""
        if not stored:
            return
        # Raumtyp geändert? Dann gelten dessen Standardwerte statt der alten
        if stored.get("room_type", self.room_type) == self.room_type:
            self.humidity_limit = float(stored.get("humidity_limit", self.humidity_limit))
            self.min_temp = float(stored.get("min_temp", self.min_temp))
        self.max_drop = float(stored.get("max_drop", self.max_drop))
        self.enabled = bool(stored.get("enabled", self.enabled))

    # ------------------------------------------------------------ Zentrale oder Raum
    def _hub_opt(self, key: str, room_key: str, fallback: Any) -> Any:
        hub = self.c.hub
        if hub is not None:
            value = hub.opt(key)
            if value not in (None, "", []):
                return value
        value = self._cfg.get(room_key)
        return fallback if value in (None, "") else value

    @property
    def weather(self) -> str | None:
        hub = self.c.hub
        if hub is not None and hub.weather:
            return hub.weather
        return self._cfg.get(CONF_WEATHER)

    @property
    def quiet_start(self) -> str:
        return str(self._hub_opt("quiet_start", CONF_QUIET_START, "22:00"))

    @property
    def quiet_end(self) -> str:
        return str(self._hub_opt("quiet_end", CONF_QUIET_END, "07:00"))

    @property
    def repeat_minutes(self) -> float:
        return float(self._hub_opt("repeat_minutes", CONF_REPEAT_MINUTES, 5))

    @property
    def notify_targets(self) -> list[str]:
        hub = self.c.hub
        if hub is not None:
            return sorted({t for k in KIND_OF.values() for t in hub.targets(k)})
        return list(self._cfg.get(CONF_NOTIFY_TARGETS) or [])

    @property
    def tts_targets(self) -> list[str]:
        hub = self.c.hub
        if hub is not None:
            return sorted({t for k in KIND_OF.values() for t in hub.targets(k, "tts")})
        return list(self._cfg.get(CONF_TTS_TARGETS) or [])

    # ------------------------------------------------------------ Lifecycle
    async def async_start(self) -> None:
        self._unsubs.append(
            async_track_time_interval(self.hass, self._on_tick, EVAL_INTERVAL)
        )
        self._unsubs.append(
            self.hass.bus.async_listen(NOTIFY_ACTION_EVENT, self._on_notify_action)
        )
        if self.c.window_open:
            self.window_open_since = dt_util.utcnow()
            self.temp_at_open = self.c.current_temperature
        self.update()

    def async_stop(self) -> None:
        for unsub in self._unsubs:
            unsub()
        self._unsubs.clear()

    def export(self) -> dict[str, Any]:
        return {
            "room_type": self.room_type,
            "humidity_limit": self.humidity_limit,
            "min_temp": self.min_temp,
            "max_drop": self.max_drop,
            "enabled": self.enabled,
        }

    # ------------------------------------------------------------ Messwerte
    @property
    def humidity(self) -> float | None:
        return self.c.current_humidity

    def _weather_attr(self, attr: str) -> float | None:
        if not self.weather:
            return None
        state = self.hass.states.get(self.weather)
        if state is None:
            return None
        if self.weather.startswith("weather."):
            return to_float(state.attributes.get(attr))
        # Alternativ: ein Temperatur-Sensor (nur Temperatur)
        return to_float(state.state) if attr == "temperature" else None

    @property
    def outdoor_temp(self) -> float | None:
        return self._weather_attr("temperature")

    @property
    def outdoor_humidity(self) -> float | None:
        return self._weather_attr("humidity")

    @property
    def dew_point(self) -> float | None:
        return dew_point(self.c.current_temperature, self.humidity)

    @property
    def abs_humidity(self) -> float | None:
        return absolute_humidity(self.c.current_temperature, self.humidity)

    @property
    def outdoor_abs_humidity(self) -> float | None:
        return absolute_humidity(self.outdoor_temp, self.outdoor_humidity)

    @property
    def duration(self) -> int:
        return recommended_duration(self.outdoor_temp, dt_util.now().month)

    @property
    def open_minutes(self) -> float:
        if not self.window_open_since:
            return 0.0
        return (dt_util.utcnow() - self.window_open_since).total_seconds() / 60

    @property
    def remaining_seconds(self) -> int | None:
        if not self.window_open_since:
            return None
        return max(0, int(self.duration * 60 - self.open_minutes * 60))

    @property
    def mold_risk(self) -> bool:
        hours = 0.0
        if self.humidity_high_since:
            hours = (dt_util.utcnow() - self.humidity_high_since).total_seconds() / 3600
        return mold_risk(self.humidity, self.c.current_temperature, hours)

    @property
    def dries(self) -> bool:
        return airing_dries(self.abs_humidity, self.outdoor_abs_humidity)

    # ------------------------------------------------------------ Ereignisse
    @callback
    def on_window_raw(self, is_open: bool) -> None:
        """Vom Controller bei echtem Fensterwechsel (ohne Verzögerung)."""
        if is_open and not self.window_open_since:
            self.window_open_since = dt_util.utcnow()
            self.temp_at_open = self.c.current_temperature
            self._repeat_count.pop(VENT_PLEASE_CLOSE, None)
            self._repeat_count.pop(VENT_TOO_COLD, None)
            self._night_alarm_sent = False
            self._night_morning_sent = None
        elif not is_open and self.window_open_since:
            self.window_open_since = None
            self.temp_at_open = None
            self._last_sent.pop(VENT_PLEASE_OPEN, None)
            self.humidity_high_since = None if (self.humidity or 0) < self.humidity_limit else dt_util.utcnow()
        self.update()

    @callback
    def _on_tick(self, _now: datetime) -> None:
        self.update()

    @callback
    def update(self) -> None:
        """Neu bewerten und ggf. benachrichtigen."""
        hum = self.humidity
        now = dt_util.utcnow()
        if hum is not None and hum >= self.humidity_limit:
            if self.humidity_high_since is None:
                self.humidity_high_since = now
        elif hum is not None and hum < self.humidity_limit - HUMIDITY_HYSTERESIS:
            self.humidity_high_since = None
        high_minutes = (
            (now - self.humidity_high_since).total_seconds() / 60 if self.humidity_high_since else 0.0
        )
        new = evaluate(
            VentInput(
                window_open=self.c.window_open,
                open_minutes=self.open_minutes,
                room_temp=self.c.current_temperature,
                temp_at_open=self.temp_at_open,
                humidity=hum,
                humidity_high_minutes=high_minutes,
                humidity_limit=self.humidity_limit,
                humidity_hysteresis=HUMIDITY_HYSTERESIS,
                min_temp=self.min_temp,
                max_drop=self.max_drop,
                duration=self.duration,
                dries=self.dries,
            )
        )
        changed = new != self.state
        self.state = new
        self._check_window_away()
        if self.c.night_airing:
            self._night_update(now, changed)
        elif new in MESSAGES:
            self._maybe_send(new, changed)
        elif changed and new in (VENT_OK, VENT_AIRING):
            self._clear_phone_notification()
        if changed:
            self.c.fire_event("ventilation", {"state": new})
            self.c.notify_listeners()

    # ------------------------------------------------------------ Nachtlüften
    def _night_update(self, now: datetime, changed: bool) -> None:
        """Schlafen bei offenem Fenster: keine Lüft-Hinweise, nur Kälte-Notfall und Morgengruß."""
        if changed and self.state in (VENT_PLEASE_CLOSE, VENT_TOO_COLD):
            self._clear_phone_notification()
        hub = self.c.hub
        if not self.enabled or hub is None:
            return
        temp = self.c.current_temperature
        alarm = float(hub.opt(CONF_NIGHT_ALARM) or NIGHT_ALARM_TEMP)
        if temp is not None and temp < alarm and not self._night_alarm_sent:
            self._night_alarm_sent = True
            hub.notify(
                KIND_TOO_COLD,
                f"🌙 {self.c.name}: sehr kalt",
                f"Das Fenster ist offen und es sind nur noch {temp:.1f} °C. Vielleicht doch schließen?",
                data={"tag": f"{self._tag()}_night", "group": "raumklima", "push": {"interruption-level": "passive"}},
                speak=False,
            )
        if self.muted_until and now < self.muted_until:
            return
        if self.snooze_until and now < self.snooze_until:
            return
        since = self.c.night_since
        if since is None:
            return
        morning = dt_util.as_utc(morning_after(dt_util.as_local(since), self.quiet_end))
        if now < morning:
            return
        last = self._night_morning_sent
        if last and now - last < NIGHT_MORNING_REPEAT:
            return
        self._night_morning_sent = now
        self.hass.async_create_task(
            self._send(
                VENT_PLEASE_CLOSE,
                f"☀️ {self.c.name}: Fenster noch offen",
                "Guten Morgen! Die Heizung wartet – sobald das Fenster zu ist, wird der Raum wieder warm.",
                speak=False,
            )
        )

    # ------------------------------------------------------------ Benachrichtigung
    def _check_window_away(self) -> None:
        """Fenster offen, aber niemand zu Hause → einmal melden (alle 30 min)."""
        hub = self.c.hub
        if hub is None or not self.enabled or not self.c.window_open or not hub.nobody_home:
            if not self.c.window_open:
                self._window_away_sent = None
            return
        if self.open_minutes < WINDOW_AWAY_AFTER:
            return
        now = dt_util.utcnow()
        if self._window_away_sent and now - self._window_away_sent < timedelta(minutes=WINDOW_AWAY_REPEAT):
            return
        self._window_away_sent = now
        hub.notify(
            KIND_WINDOW_AWAY,
            f"🚪 {self.c.name}: Fenster offen",
            f"Seit {self.open_minutes:.0f} min offen – und niemand ist zu Hause.",
            data={"tag": f"{self._tag()}_away", "group": "raumklima"},
        )

    def _maybe_send(self, kind: str, changed: bool) -> None:
        hub = self.c.hub
        if not self.enabled:
            return
        if hub is not None:
            if not hub.has_targets(KIND_OF[kind]):
                return
            if hub.nobody_home:
                return  # niemand da, der lüften oder schließen könnte
        elif not self.notify_targets and not self.tts_targets:
            return
        now = dt_util.utcnow()
        if self.muted_until and now < self.muted_until:
            return
        if self.snooze_until and now < self.snooze_until and kind != VENT_TOO_COLD:
            return
        last = self._last_sent.get(kind)
        if kind == VENT_DONE:
            if last and self.window_open_since and last > self.window_open_since:
                return  # pro Lüftvorgang nur einmal
        elif kind == VENT_PLEASE_OPEN:
            if last and now - last < timedelta(minutes=PLEASE_OPEN_REPEAT):
                return
        elif last and not changed and now - last < timedelta(minutes=self.repeat_minutes):
            return
        self._last_sent[kind] = now
        count = self._repeat_count.get(kind, 0)
        self._repeat_count[kind] = count + 1
        title, body = MESSAGES[kind]
        values = {
            "room": self.c.name,
            "hum": self.humidity or 0,
            "dur": self.duration,
            "temp": self.c.current_temperature or 0,
        }
        self.hass.async_create_task(
            self._send(
                kind,
                title.format(**values),
                body.format(**values),
                speak=(kind == VENT_TOO_COLD or count >= TTS_AFTER_REPEATS)
                and kind != VENT_DONE,
            )
        )

    def _mute_label(self) -> str:
        return "Heute nicht mehr" if mute_until(dt_util.now(), self.quiet_end).hour == 0 else "Bis morgen früh"

    def _tag(self) -> str:
        return f"raumklima_{self.c.entry.entry_id}"

    def _action_id(self, action: str) -> str:
        return f"RAUMKLIMA_{action}_{self.c.entry.entry_id}"

    async def _send(self, kind: str, title: str, message: str, speak: bool) -> None:
        hub = self.c.hub
        if hub is not None:
            await hub.async_notify(
                KIND_OF[kind],
                title,
                message,
                data={
                    "tag": self._tag(),
                    "group": "raumklima",
                    "actions": [
                        {"action": self._action_id("DONE"), "title": "Erledigt"},
                        {"action": self._action_id("SNOOZE"), "title": f"In {SNOOZE_MINUTES} min erinnern"},
                        {"action": self._action_id("MUTE"), "title": self._mute_label()},
                    ],
                },
                speak=speak,
            )
            return
        now = dt_util.now()
        quiet = in_quiet_hours(now.hour, now.minute, self.quiet_start, self.quiet_end)
        data: dict[str, Any] = {
            "tag": self._tag(),
            "group": "raumklima",
            "actions": [
                {"action": self._action_id("DONE"), "title": "Erledigt"},
                {"action": self._action_id("SNOOZE"), "title": f"In {SNOOZE_MINUTES} min erinnern"},
                {"action": self._action_id("MUTE"), "title": self._mute_label()},
            ],
            "push": {"interruption-level": "time-sensitive" if kind == VENT_TOO_COLD else "active"},
        }
        if quiet and kind != VENT_TOO_COLD:
            data["push"] = {"interruption-level": "passive"}
        for target in self.notify_targets:
            domain, _, service = target.partition(".")
            if domain != "notify" or not service:
                continue
            try:
                await self.hass.services.async_call(
                    "notify", service, {"title": title, "message": message, "data": data}
                )
            except Exception as err:  # noqa: BLE001
                _LOGGER.warning("%s: Benachrichtigung an %s fehlgeschlagen: %s", self.c.name, target, err)
        if speak and not quiet:
            for target in self.tts_targets:
                domain, _, service = target.partition(".")
                if domain != "notify" or not service:
                    continue
                try:
                    await self.hass.services.async_call(
                        "notify", service, {"message": f"{title}. {message}", "data": {"type": "announce"}}
                    )
                except Exception as err:  # noqa: BLE001
                    _LOGGER.warning("%s: Sprachansage an %s fehlgeschlagen: %s", self.c.name, target, err)

    def _clear_phone_notification(self) -> None:
        for target in self.notify_targets:
            domain, _, service = target.partition(".")
            if domain == "notify" and service:
                self.hass.async_create_task(
                    self.hass.services.async_call(
                        "notify", service, {"message": "clear_notification", "data": {"tag": self._tag()}}
                    )
                )

    @callback
    def _on_notify_action(self, event: Event) -> None:
        action = str(event.data.get("action", ""))
        if not action.endswith(self.c.entry.entry_id):
            return
        now = dt_util.utcnow()
        if action == self._action_id("SNOOZE"):
            self.snooze_until = now + timedelta(minutes=SNOOZE_MINUTES)
        elif action == self._action_id("MUTE"):
            self.muted_until = dt_util.as_utc(mute_until(dt_util.now(), self.quiet_end))
        elif action == self._action_id("DONE"):
            self.snooze_until = now + timedelta(minutes=SNOOZE_MINUTES)
        _LOGGER.info("%s: Benachrichtigungs-Aktion %s", self.c.name, action)
        self.c.notify_listeners()

    # ------------------------------------------------------------ Einstellen
    def set_value(self, key: str, value: float) -> None:
        setattr(self, key, float(value))
        self.c.save()
        self.update()
        self.c.notify_listeners()

    def set_enabled(self, enabled: bool) -> None:
        self.enabled = enabled
        if enabled:
            self.muted_until = None
            self.snooze_until = None
        self.c.save()
        self.c.notify_listeners()

    def attributes(self) -> dict[str, Any]:
        return {
            "ventilation": self.state,
            "humidity_limit": self.humidity_limit,
            "min_temp": self.min_temp,
            "dew_point": self.dew_point,
            "abs_humidity": self.abs_humidity,
            "outdoor_temperature": self.outdoor_temp,
            "outdoor_humidity": self.outdoor_humidity,
            "outdoor_abs_humidity": self.outdoor_abs_humidity,
            "airing_dries": self.dries,
            "recommended_minutes": self.duration,
            "window_open_since": self.window_open_since.isoformat() if self.window_open_since else None,
            "airing_remaining_s": self.remaining_seconds,
            "mold_risk": self.mold_risk,
            "notifications": self.enabled,
            "snoozed_until": self.snooze_until.isoformat() if self.snooze_until else None,
            "muted_until": self.muted_until.isoformat() if self.muted_until else None,
        }

    def diagnostics(self) -> dict[str, Any]:
        return {
            **self.attributes(),
            "room_type": self.room_type,
            "weather": self.weather,
            "notify_targets": self.notify_targets,
            "tts_targets": self.tts_targets,
            "quiet": [self.quiet_start, self.quiet_end],
            "humidity_high_since": self.humidity_high_since.isoformat() if self.humidity_high_since else None,
            "last_sent": {k: v.isoformat() for k, v in self._last_sent.items()},
            "humidity_sensor": self.c.config.get(CONF_HUMIDITY_SENSOR),
        }
