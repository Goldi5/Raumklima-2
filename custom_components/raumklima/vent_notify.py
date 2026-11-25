"""Lüft-Benachrichtigungen: Senden, Stummschalten, Aktionsknöpfe am Handy (Teil von VentilationManager)."""

from __future__ import annotations

from datetime import datetime, timedelta
import logging
from typing import TYPE_CHECKING, Any

from homeassistant.core import Event, callback
from homeassistant.util import dt as dt_util

from .const import (
    CONF_AIRING_OCCUPIED_ONLY,
    KIND_WINDOW_AWAY,
    VENT_HINT_KINDS,
)
from .msg import dec, tr, weekday
from .planning import mute_until
from .ventilation import (
    VENT_DONE,
    VENT_PLEASE_OPEN,
    VENT_TOO_COLD,
    done_text,
    in_quiet_hours,
    open_allowed,
)

if TYPE_CHECKING:
    pass

from .vent_const import (
    KIND_OF,
    MESSAGE_CO2,
    MESSAGE_PM25,
    MESSAGES,
    PLEASE_OPEN_REPEAT,
    SNOOZE_MINUTES,
    TOO_COLD_LOUD,
    TOO_COLD_QUIET_REPEAT,
    TTS_AFTER_REPEATS,
    WINDOW_AWAY_AFTER,
    WINDOW_AWAY_REPEAT,
    WINDOW_AWAY_STARTUP,
)

_LOGGER = logging.getLogger(__name__.rsplit(".", 1)[0] + ".vent_manager")


class VentNotifyMixin:
    """Lüft-Benachrichtigungen: Senden, Stummschalten, Aktionsknöpfe am Handy (Teil von VentilationManager)."""

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
        started = getattr(self.c, "_started_at", None)
        if started is not None and dt_util.utcnow() - started < WINDOW_AWAY_STARTUP:
            return  # direkt nach dem Start ist die Anwesenheit noch nicht sicher
        now = dt_util.utcnow()
        if self._window_away_sent and now - self._window_away_sent < timedelta(minutes=WINDOW_AWAY_REPEAT):
            return
        self._window_away_sent = now
        hub.notify(
            KIND_WINDOW_AWAY,
            tr("🚪 {room}: Fenster offen", room=self.c.name),
            tr("Seit {m} min offen – und niemand ist zu Hause.", m=f"{self.open_minutes:.0f}"),
            data={"tag": f"{self._tag()}_away", "group": "raumklima"},
            room=self.c,
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
        if kind == VENT_PLEASE_OPEN and not open_allowed(
            self.c.occupied,
            bool(self.c.presence_sensors),
            bool(self._room_opt(CONF_AIRING_OCCUPIED_ONLY, True)),
        ):
            return  # Raum ist nachweislich leer – Hinweis bringt niemandem etwas
        now = dt_util.utcnow()
        if self.muted_until and now < self.muted_until:
            return
        if self.snooze_until and now < self.snooze_until:
            # Gilt für jede Meldung, die den Knopf anbietet – auch für „Raum kühlt aus".
            # Die harte Nachtwarnung schickt der Aufrufer an dieser Stelle vorbei.
            return
        if self._cap_reached(kind, now):
            return  # Tagesdeckel erreicht – der Zustand bleibt, die Erinnerung schweigt
        if KIND_OF.get(kind) in VENT_HINT_KINDS and not self._vent_hint_allowed(now):
            return  # außerhalb der eingestellten Lüft-Zeit (nachts still)
        last = self._last_sent.get(kind)
        if kind == VENT_DONE:
            if last and self.window_open_since and last > self.window_open_since:
                return  # pro Lüftvorgang nur einmal
        elif kind == VENT_PLEASE_OPEN:
            if last and now - last < timedelta(minutes=PLEASE_OPEN_REPEAT):
                return
        elif (
            kind == VENT_TOO_COLD
            and self._repeat_count.get(kind, 0) >= TOO_COLD_LOUD
            and last
            and now - last < timedelta(minutes=TOO_COLD_QUIET_REPEAT)
        ):
            return  # nach drei lauten Meldungen nur noch alle 30 min leise
        elif last and not changed and now - last < timedelta(minutes=self.repeat_minutes):
            return
        self._last_sent[kind] = now
        self._count_sent(kind, now)
        count = self._repeat_count.get(kind, 0)
        calm = kind == VENT_TOO_COLD and count >= TOO_COLD_LOUD
        self._repeat_count[kind] = count + 1
        title, body = MESSAGES[kind]
        if kind == VENT_PLEASE_OPEN:
            self._airing_reason = self.reason
            if self.reason == "co2":
                title, body = MESSAGE_CO2
            elif self.reason == "pm25":
                title, body = MESSAGE_PM25
        elif kind == VENT_DONE:
            # Text nach dem Grund richten, wegen dem gelüftet wurde – aber nur, wenn der passende
            # Messwert jetzt vorliegt (sonst bliebe im Text ein leerer Platzhalter)
            reason = self._airing_reason
            if reason == "co2" and self.c.current_co2 is None or reason == "pm25" and self.c.current_pm25 is None:
                reason = None
            override = done_text(reason, self.humidity is not None)
            if override:
                body = override
        values = {
            "room": self.c.name,
            "hum": f"{self.humidity or 0:.0f}",
            "dur": self.duration,
            "temp": dec(self.c.current_temperature or 0),
            "co2": f"{self.c.current_co2 or 0:.0f}",
            "pm": f"{self.c.current_pm25 or 0:.0f}",
        }
        self.hass.async_create_task(
            self._send(
                kind,
                tr(title, **values),
                tr(body, **values),
                speak=(kind == VENT_TOO_COLD or count >= TTS_AFTER_REPEATS)
                and kind != VENT_DONE
                and not calm,
                calm=calm,
            )
        )
        if kind == VENT_TOO_COLD and count + 1 == TOO_COLD_LOUD:
            self.c.log(
                "notify",
                tr("„Raum kühlt aus“ ab jetzt leise"),
                tr("schon {n}× laut gemeldet – weitere Erinnerungen alle {m} min ohne Ton", n=TOO_COLD_LOUD, m=TOO_COLD_QUIET_REPEAT),
            )

    def _mute_until(self) -> datetime:
        """„Heute nicht mehr“: tagsüber bis Mitternacht, abends/nachts bis zum (gelernten) Morgen."""
        local = dt_util.now()
        hub = self.c.hub
        if hub is None:
            return mute_until(local, self.quiet_end, self.quiet_end_weekend)
        morning = hub.morning_after(local)
        if local.hour >= 18 or morning.date() == local.date():
            return morning
        return (local + timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0)

    def _mute_label(self) -> str:
        until = self._mute_until()
        return tr("Heute nicht mehr") if (until.hour, until.minute) == (0, 0) else tr("Bis {time} Uhr", time=f"{until:%H:%M}")

    def _tag(self) -> str:
        return f"raumklima_{self.c.entry.entry_id}"

    def _action_id(self, action: str) -> str:
        return f"RAUMKLIMA_{action}_{self.c.entry.entry_id}"

    async def _send(self, kind: str, title: str, message: str, speak: bool, calm: bool = False) -> None:
        hub = self.c.hub
        if hub is not None:
            await hub.async_notify(
                KIND_OF[kind],
                title,
                message,
                data={
                    **({"push": {"interruption-level": "passive"}} if calm else {}),
                    "tag": self._tag(),
                    "group": "raumklima",
                    "actions": [
                        {"action": self._action_id("DONE"), "title": tr("Erledigt")},
                        {"action": self._action_id("SNOOZE"), "title": tr("In {m} min erinnern", m=SNOOZE_MINUTES)},
                        {"action": self._action_id("MUTE"), "title": self._mute_label()},
                    ],
                },
                speak=speak,
                room=self.c,
            )
            return
        now = dt_util.now()
        quiet = in_quiet_hours(now.hour, now.minute, self.quiet_start, self.quiet_end)
        data: dict[str, Any] = {
            "tag": self._tag(),
            "group": "raumklima",
            "actions": [
                {"action": self._action_id("DONE"), "title": tr("Erledigt")},
                {"action": self._action_id("SNOOZE"), "title": tr("In {m} min erinnern", m=SNOOZE_MINUTES)},
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
            self.muted_until = dt_util.as_utc(self._mute_until())
        elif action == self._action_id("DONE"):
            self.snooze_until = now + timedelta(minutes=SNOOZE_MINUTES)
        _LOGGER.info("%s: Benachrichtigungs-Aktion %s", self.c.name, action)
        until = self.muted_until if action == self._action_id("MUTE") else self.snooze_until
        label = {"MUTE": tr("„Heute nicht mehr“"), "SNOOZE": tr("„Später erinnern“"), "DONE": tr("„Erledigt“")}.get(
            action.removeprefix("RAUMKLIMA_").split("_", 1)[0], action
        )
        self.c.save()  # Pause muss einen Neustart überstehen
        self.c.log(
            "notify",
            tr("Knopf {label} in der Push gedrückt", label=label),
            tr("keine Lüft-Hinweise bis {day} {time}", day=weekday(dt_util.as_local(until).weekday()), time=f"{dt_util.as_local(until):%H:%M}") if until else None,
        )
        self.c.notify_listeners()

    @property
    def notify_paused_until(self) -> datetime | None:
        """Bis wann keine Hinweise mehr kommen (Knopf „später"/„heute nicht mehr")."""
        now = dt_util.utcnow()
        active = [t for t in (self.snooze_until, self.muted_until) if t and t > now]
        return max(active) if active else None
