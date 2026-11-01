"""Lichtsignal: Lampen im Raum blinken farbig, wenn gelüftet oder geschlossen werden soll.

Blau = bitte lüften, Orange = bitte schließen / Raum kühlt aus, Grün = Luft ausgetauscht,
Rot = Problem mit der Heizung. Danach bekommt jede Lampe ihren vorherigen Zustand zurück
(aus bleibt aus, an bekommt Helligkeit und Farbe zurück). In der Ruhezeit und wenn niemand
zu Hause ist, blinkt nichts.
"""

from __future__ import annotations

import asyncio
import logging
from typing import TYPE_CHECKING, Any

from homeassistant.core import HomeAssistant, State

from .const import CONF_LIGHT_SIGNALS, CONF_LIGHTS, DEFAULT_LIGHT_SIGNALS

if TYPE_CHECKING:
    from .controller import RaumklimaController

_LOGGER = logging.getLogger(__name__)

# Signal → (Farbe, Name fürs Protokoll)
COLORS: dict[str, tuple[tuple[int, int, int], str]] = {
    "open": ((0, 90, 255), "blau – bitte lüften"),
    "close": ((255, 110, 0), "orange – bitte schließen"),
    "done": ((0, 200, 60), "grün – Luft ausgetauscht"),
    "problem": ((255, 0, 0), "rot – Problem"),
}
_COLOR_MODES = {"hs", "xy", "rgb", "rgbw", "rgbww"}
BLINKS = 3
ON_SECONDS = 0.8
OFF_SECONDS = 0.5


def signal_for(kind: str, data: dict[str, Any]) -> str | None:
    """Welches Lichtsignal gehört zu einem Raumklima-Ereignis?"""
    state = data.get("state")
    if kind == "ventilation":
        return {"please_open": "open", "please_close": "close", "too_cold": "close", "done": "done"}.get(state)
    if kind == "health" and state == "problem":
        return "problem"
    return None


def restore_data(state: State) -> dict[str, Any] | None:
    """Daten für light.turn_on, um den vorherigen Zustand wiederherzustellen (None = war aus)."""
    if state.state != "on":
        return None
    attrs = state.attributes
    data: dict[str, Any] = {}
    if attrs.get("brightness") is not None:
        data["brightness"] = attrs["brightness"]
    mode = attrs.get("color_mode")
    if mode == "color_temp" and attrs.get("color_temp_kelvin"):
        data["color_temp_kelvin"] = attrs["color_temp_kelvin"]
    elif mode in _COLOR_MODES and attrs.get("hs_color"):
        data["hs_color"] = list(attrs["hs_color"])
    return data


def supports_color(state: State | None) -> bool:
    modes = (state.attributes.get("supported_color_modes") if state else None) or []
    return any(m in _COLOR_MODES for m in modes)


async def async_blink(hass: HomeAssistant, lights: list[str], signal: str) -> None:
    """Lampen blinken lassen und danach zurücksetzen."""
    color = COLORS[signal][0]
    saved = {e: hass.states.get(e) for e in lights}
    lights = [e for e, st in saved.items() if st is not None and st.state != "unavailable"]
    if not lights:
        return

    async def call(service: str, entity: str, data: dict[str, Any] | None = None) -> None:
        try:
            await hass.services.async_call(
                "light", service, {"entity_id": entity, **(data or {})}, blocking=True
            )
        except Exception as err:  # noqa: BLE001
            _LOGGER.debug("Lichtsignal %s %s: %s", service, entity, err)

    on = {
        e: ({"rgb_color": list(color)} if supports_color(saved[e]) else {}) | {"brightness": 255, "transition": 0}
        for e in lights
    }
    try:
        for i in range(BLINKS):
            await asyncio.gather(*(call("turn_on", e, on[e]) for e in lights))
            await asyncio.sleep(ON_SECONDS)
            if i < BLINKS - 1:
                await asyncio.gather(*(call("turn_off", e, {"transition": 0}) for e in lights))
                await asyncio.sleep(OFF_SECONDS)
    finally:
        restores = []
        for e in lights:
            back = restore_data(saved[e])  # type: ignore[arg-type]
            restores.append(call("turn_off", e) if back is None else call("turn_on", e, back))
        await asyncio.gather(*restores)


class LightSignal:
    """Lichtsignal eines Raums."""

    def __init__(self, controller: RaumklimaController) -> None:
        self.c = controller
        self._task: asyncio.Task | None = None

    @property
    def lights(self) -> list[str]:
        return [e for e in (self.c.config.get(CONF_LIGHTS) or []) if isinstance(e, str)]

    @property
    def signals(self) -> list[str]:
        value = self.c.config.get(CONF_LIGHT_SIGNALS)
        return list(DEFAULT_LIGHT_SIGNALS if value is None else value)

    def on_event(self, kind: str, data: dict[str, Any]) -> None:
        signal = signal_for(kind, data)
        if signal is None or signal not in self.signals or not self.lights:
            return
        hub = self.c.hub
        if hub is not None and (hub.quiet_now() or hub.nobody_home):
            return
        if self.c.night_airing:
            return  # jemand schläft bei offenem Fenster
        if self.c.occupied is False:
            return  # Präsenzmelder: niemand im Raum, der es sehen könnte
        self.start(signal)

    def start(self, signal: str) -> bool:
        """Signal abspielen (auch für den Test-Knopf). False, wenn keine Lampe gewählt ist."""
        if not self.lights or signal not in COLORS:
            return False
        if self._task is not None and not self._task.done():
            return True  # läuft schon
        self.c.log_light(COLORS[signal][1], self.lights)
        self._task = self.c.hass.async_create_task(async_blink(self.c.hass, self.lights, signal))
        return True

    def stop(self) -> None:
        if self._task is not None and not self._task.done():
            self._task.cancel()
        self._task = None
