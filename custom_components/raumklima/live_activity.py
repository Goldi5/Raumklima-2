"""Lüft-Countdown auf dem Sperrbildschirm (Live-Aktivität / Live Update der Home-Assistant-App).

Sobald das Fenster zum Lüften offen ist, erscheint auf dem Handy ein Countdown mit der
empfohlenen Lüftdauer – auf dem iPhone als Live-Aktivität (Sperrbildschirm, Dynamic Island),
auf Android als Live Update. Der Timer läuft auf dem Handy selbst; Raumklima schickt nur bei
einem neuen Zustand ein Update (Luft getauscht, bitte schließen, kühlt aus) und beendet die
Anzeige, wenn das Fenster zu ist.

Voraussetzung: Empfänger ``notify.mobile_app_…`` mit der Nachrichtenart „Lüft-Countdown“.
"""

from __future__ import annotations

import logging
from typing import TYPE_CHECKING, Any

from .const import KIND_LIVE
from .decision_log import CAT_NOTIFY
from .ventilation import VENT_AIRING, VENT_DONE, VENT_PLEASE_CLOSE, VENT_TOO_COLD

if TYPE_CHECKING:
    from .vent_manager import VentilationManager

_LOGGER = logging.getLogger(__name__)

LIVE_STATES = (VENT_AIRING, VENT_DONE, VENT_PLEASE_CLOSE, VENT_TOO_COLD)

# Zustand → (Text, Symbol, Farbe)
LOOK: dict[str, tuple[str, str, str]] = {
    VENT_AIRING: ("Fenster offen – empfohlen {dur} min", "mdi:window-open-variant", "#2196F3"),
    VENT_DONE: ("Luft ausgetauscht – du kannst schließen", "mdi:check-circle-outline", "#4CAF50"),
    VENT_PLEASE_CLOSE: ("Lüftzeit erreicht – bitte schließen", "mdi:window-closed-variant", "#FF9800"),
    VENT_TOO_COLD: ("Raum kühlt aus – bitte jetzt schließen", "mdi:snowflake-thermometer", "#F44336"),
}


def live_payload(room: str, state: str, minutes: int, remaining: int | None, first: bool, url: str | None) -> dict[str, Any]:
    """Daten für notify.mobile_app_… (siehe Companion-Doku „Live Activities“)."""
    text, icon, color = LOOK[state]
    data: dict[str, Any] = {
        "live_update": True,
        "notification_icon": icon,
        "notification_icon_color": color,
        "color": color,
        "critical_text": f"{minutes} min" if state == VENT_AIRING else room,
    }
    if state == VENT_AIRING and remaining:
        data |= {"chronometer": True, "when": remaining, "when_relative": True, "progress_bar_direction": "decreasing"}
    if not first:
        data |= {"silent": True, "alert_once": True}
    if url:
        data["url"] = url
    return {"title": f"Lüften · {room}", "message": text.format(dur=minutes), "data": data}


class LiveCountdown:
    """Live-Aktivität eines Raums."""

    def __init__(self, vent: VentilationManager) -> None:
        self.v = vent
        self._sent: list[str] = []  # Handys mit laufender Anzeige
        self._state: str | None = None

    @property
    def tag(self) -> str:
        return f"raumklima_live_{self.v.c.entry.entry_id}"

    def targets(self) -> list[str]:
        hub = self.v.c.hub
        if hub is None:
            return []
        return [t for t in hub.targets(KIND_LIVE) if t.startswith("notify.mobile_app_")]

    def update(self, state: str) -> None:
        """Nach jedem Zustandswechsel des Lüftungsassistenten aufrufen."""
        c = self.v.c
        show = (
            state in LIVE_STATES
            and c.window_open
            and not c.night_airing
            and not c.window_virtual
            and self.v.enabled
        )
        if not show:
            self.end()
            return
        targets = self.targets()
        if not targets or state == self._state:
            return
        first = not self._sent
        hub = c.hub
        url = f"/{hub.dashboard}" if hub is not None and hub.dashboard else None
        payload = live_payload(c.name, state, self.v.duration, self.v.remaining_seconds, first, url)
        if first and hub is not None:
            hub.log.add(
                CAT_NOTIFY,
                "Lüft-Countdown aufs Handy",
                f"{self.v.duration} min → " + ", ".join(t.removeprefix("notify.mobile_app_") for t in targets),
                kind=KIND_LIVE,
                room=c.name,
                entry_id=c.entry.entry_id,
            )
        self._state = state
        self._sent = targets
        for target in targets:
            self._call(target, {**payload, "data": {**payload["data"], "tag": self.tag}})

    def end(self) -> None:
        """Anzeige auf allen Handys beenden."""
        for target in self._sent:
            self._call(target, {"message": "clear_notification", "data": {"tag": self.tag}})
        self._sent = []
        self._state = None

    def _call(self, target: str, data: dict[str, Any]) -> None:
        service = target.partition(".")[2]
        hass = self.v.hass

        async def run() -> None:
            try:
                await hass.services.async_call("notify", service, data)
            except Exception as err:  # noqa: BLE001
                _LOGGER.debug("Live-Aktivität an %s: %s", target, err)

        hass.async_create_task(run())
