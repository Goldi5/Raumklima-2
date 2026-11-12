"""Benachrichtigungen: Empfänger je Nachrichtenart, Ruhezeit, Push und Sprachansage."""

from __future__ import annotations

import logging
from typing import TYPE_CHECKING, Any

from homeassistant.util import dt as dt_util

from .const import (
    CONF_NIGHT_LEVEL,
    CONF_NOTIFY_PRESENT_ONLY,
    CONF_RECIPIENTS,
    CONF_TTS,
    PRESENT_ONLY_KINDS,
    URGENT_KINDS,
)
from .decision_log import (
    CAT_NOTIFY,
    CAT_PRESENCE,
)
from .msg import tr
from .notify_filter import keep_present
from .notify_targets import is_entity_target
from .planning import (
    in_time_window,
)

if TYPE_CHECKING:
    pass


_LOGGER = logging.getLogger(__name__)


def _who(target: str) -> str:
    name = target.split(".", 1)[-1].removeprefix("mobile_app_")
    return " ".join(w.capitalize() for w in name.split("_") if w) or target


class NotifyMixin:
    """Benachrichtigungs-Teil der Zentrale."""

    def targets(self, kind: str, channel: str = "push") -> list[str]:
        table = self.opt(CONF_RECIPIENTS if channel == "push" else CONF_TTS) or {}
        return [t for t, kinds in table.items() if kind in (kinds or [])]

    def has_targets(self, kind: str) -> bool:
        return bool(self.targets(kind) or self.targets(kind, "tts"))

    def quiet_now(self) -> bool:
        now = dt_util.now()
        if self.sleep_signals:
            if self.signals.asleep:
                return True
            if self._woke_night == self.sleep.night_for(now).isoformat():
                return False  # Licht an am Morgen: alle wach
        times = self.times_for(now)
        return in_time_window(now, times["quiet_start"], times["quiet_end"])

    def night_setback_now(self) -> bool:
        """Gilt die Nachtabsenkung gerade? (Schalter „Nachtruhe“ oder Ruhezeit).

        Getrennt von ``quiet_now()``: der Schalter soll die Heizung absenken, aber keine
        Benachrichtigungen stumm schalten.
        """
        if getattr(self, "night_manual", False) or self.night_entity_on():
            return True
        return self.quiet_now()

    def night_target(self, room: Any) -> float:
        """Ziel der Nachtabsenkung: kurz weg, länger weg oder Frostschutz."""
        level = self.opt(CONF_NIGHT_LEVEL) or "long"
        if level == "short":
            return room.setback_short
        if level == "frost":
            return self.frost_floor
        return room.setback_long

    def set_night_manual(self, on: bool) -> None:
        """Schalter „Nachtruhe“ – bewusste Aktion, unabhängig von der Uhrzeit."""
        self.night_manual = bool(on)
        self.log.add(
            CAT_PRESENCE,
            tr("Nachtruhe {s}", s=tr("eingeschaltet") if on else tr("ausgeschaltet")),
            tr("von Hand geschaltet – gilt bis zum Ausschalten"),
        )
        self._changed()

    def notify(
        self,
        kind: str,
        title: str,
        message: str,
        data: dict[str, Any] | None = None,
        speak: bool = True,
        room: Any = None,
    ) -> None:
        self.hass.async_create_task(self.async_notify(kind, title, message, data, speak, room=room))

    async def async_notify(
        self,
        kind: str,
        title: str,
        message: str,
        data: dict[str, Any] | None = None,
        speak: bool = True,
        only: str | None = None,
        room: Any = None,
    ) -> None:
        """An alle Empfänger senden, die diese Nachrichtenart gewählt haben."""
        quiet = self.quiet_now()
        data = dict(data or {})
        if quiet and kind not in URGENT_KINDS:
            data["push"] = {"interruption-level": "passive"}
        elif kind in URGENT_KINDS:
            data.setdefault("push", {"interruption-level": "time-sensitive"})
        push = [only] if only else self.targets(kind)
        tts = [] if not speak or quiet or only else self.targets(kind, "tts")
        # Hinweise (nicht kritische Meldungen) nur an Personen, die zu Hause sind
        if kind in PRESENT_ONLY_KINDS and not only:
            pref = self.opt(CONF_NOTIFY_PRESENT_ONLY)
            only_present = True if pref is None else bool(pref)
            before = len(push) + len(tts)
            push = keep_present(push, self.persons, only_present)
            tts = keep_present(tts, self.persons, only_present)
            if before and not push and not tts:
                self.log.add(
                    CAT_NOTIFY,
                    f"{title}",
                    tr("nicht gesendet – niemand der Empfänger ist zu Hause"),
                    kind=kind,
                    room=getattr(room, "name", None),
                    entry_id=getattr(getattr(room, "entry", None), "entry_id", None),
                )
                return
        if push or tts:
            level = (data.get("push") or {}).get("interruption-level", "active")
            how = {"passive": tr("leise"), "time-sensitive": tr("dringend (auch in der Ruhezeit)")}.get(level, tr("normal"))
            self.log.add(
                CAT_NOTIFY,
                f"{title}",
                f"{message} → " + ", ".join([_who(t) for t in push] + [tr("{who} (Sprache)", who=_who(t)) for t in tts])
                + f"; {how}" + (tr(" – Ruhezeit") if quiet else ""),
                kind=kind,
                room=getattr(room, "name", None),
                entry_id=getattr(getattr(room, "entry", None), "entry_id", None),
            )
        for target in push:
            await self._async_send(target, title, message, data)
        if not speak or quiet or only:
            return
        for target in self.targets(kind, "tts"):
            await self._async_send(target, "", f"{title}. {message}", {"type": "announce"})

    async def _async_send(self, target: str, title: str, message: str, data: dict[str, Any] | None = None) -> None:
        """An einen Dienst oder eine notify-Entität senden."""
        if not target.startswith("notify."):
            return
        payload: dict[str, Any] = {"message": message}
        if title:
            payload["title"] = title
        entity_target = is_entity_target(self.hass, target)
        # notify-Entitäten (Telegram, Alexa Devices) sprechen send_message an und
        # kennen nur message/title. `data` (Push-Optionen wie interruption-level) würde
        # den Aufruf ungültig machen und die Meldung still verschlucken (Issue #45).
        if data and not entity_target:
            payload["data"] = data
        try:
            if entity_target:
                await self.hass.services.async_call("notify", "send_message", {**payload, "entity_id": target})
            else:
                await self.hass.services.async_call("notify", target.split(".", 1)[1], payload)
        except Exception as err:  # noqa: BLE001
            _LOGGER.warning("Benachrichtigung an %s fehlgeschlagen: %s", target, err)
            self.log.add(
                CAT_NOTIFY,
                tr("Benachrichtigung an {target} fehlgeschlagen", target=_who(target)),
                tr("Der Dienst hat den Aufruf abgelehnt: {err}", err=str(err)),
            )

    async def async_test(self, target: str) -> None:
        """Testnachricht an einen Empfänger."""
        if not target.startswith("notify."):
            raise ValueError(f"Kein notify-Dienst: {target}")
        await self._async_send(
            target, "✅ Raumklima", tr("Testnachricht – so sehen Hinweise der Heizung aus.")
        )
