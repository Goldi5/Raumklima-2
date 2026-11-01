"""Benachrichtigungen: Empfänger je Nachrichtenart, Ruhezeit, Push und Sprachansage."""

from __future__ import annotations

import logging
from typing import TYPE_CHECKING, Any

from homeassistant.util import dt as dt_util

from .const import (
    CONF_RECIPIENTS,
    CONF_TTS,
    URGENT_KINDS,
)
from .decision_log import (
    CAT_NOTIFY,
)
from .planning import (
    in_time_window,
)
from .sleep import night_of

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
            if self._woke_night == night_of(now).isoformat():
                return False  # Licht an am Morgen: alle wach
        times = self.times_for(now)
        return in_time_window(now, times["quiet_start"], times["quiet_end"])

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
        if push or tts:
            level = (data.get("push") or {}).get("interruption-level", "active")
            how = {"passive": "leise", "time-sensitive": "dringend (auch in der Ruhezeit)"}.get(level, "normal")
            self.log.add(
                CAT_NOTIFY,
                f"{title}",
                f"{message} → " + ", ".join([_who(t) for t in push] + [f"{_who(t)} (Sprache)" for t in tts])
                + f"; {how}" + (" – Ruhezeit" if quiet else ""),
                kind=kind,
                room=getattr(room, "name", None),
                entry_id=getattr(getattr(room, "entry", None), "entry_id", None),
            )
        for target in push:
            domain, _, service = target.partition(".")
            if domain != "notify" or not service:
                continue
            try:
                await self.hass.services.async_call(
                    "notify", service, {"title": title, "message": message, "data": data}
                )
            except Exception as err:  # noqa: BLE001
                _LOGGER.warning("Benachrichtigung an %s fehlgeschlagen: %s", target, err)
        if not speak or quiet or only:
            return
        for target in self.targets(kind, "tts"):
            domain, _, service = target.partition(".")
            if domain != "notify" or not service:
                continue
            try:
                await self.hass.services.async_call(
                    "notify", service, {"message": f"{title}. {message}", "data": {"type": "announce"}}
                )
            except Exception as err:  # noqa: BLE001
                _LOGGER.warning("Sprachansage an %s fehlgeschlagen: %s", target, err)

    async def async_test(self, target: str) -> None:
        """Testnachricht an einen Empfänger."""
        domain, _, service = target.partition(".")
        if domain != "notify" or not service:
            raise ValueError(f"Kein notify-Dienst: {target}")
        await self.hass.services.async_call(
            "notify",
            service,
            {"title": "✅ Raumklima", "message": "Testnachricht – so sehen Hinweise der Heizung aus."},
            blocking=True,
        )
