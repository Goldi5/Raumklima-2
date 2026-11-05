"""Sprachsteuerung: Werkzeuge für Assist mit KI-Agenten (ChatGPT, Google, Anthropic, Ollama).

Ein Sprachassistent kann Fragen zu Räumen nur beantworten, wenn er die Zahlen kennt. Die
Standard-Sätze von Assist kennen „Wie warm ist es im Bad?" – aber nicht „Muss ich lüften?".
Deshalb bekommt jeder KI-Agent drei Werkzeuge:

* ``raumklima_rooms`` – welche Räume Raumklima kennt (mit einem Satz Zustand)
* ``raumklima_room_status`` – Ist, Soll, Feuchte, CO₂, Fenster, Grund, Lüftbedarf
* ``raumklima_set_room_temperature`` – Wunschtemperatur setzen

Die Werkzeuge erscheinen in jeder Pipeline, die einen KI-Agenten benutzt; der Standard-Agent
von Home Assistant nutzt sie nicht (er arbeitet mit festen Sätzen).
"""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
import voluptuous as vol

from .const import STATUS_HEATING, STATUS_MONITOR
from .msg import tr
from .shared import domain_data
from .ventilation import recommended_duration

try:  # Home Assistant 2026.2 und neuer
    from homeassistant.helpers import llm
except ImportError:  # pragma: no cover - sehr alte Installationen
    llm = None  # type: ignore[assignment]

PROMPT = (
    "Raumklima steuert die Heizung je Raum (Wunschtemperatur, Zeitpläne, Absenkung, Lüften). "
    "Nutze raumklima_rooms für die Raumnamen, raumklima_room_status für Werte und "
    "raumklima_set_room_temperature, wenn jemand eine Temperatur ändern will. "
    "Antworte in der Sprache der Person und nenne Zahlen mit Einheit."
)

# Ab diesen Werten empfiehlt Raumklima Lüften (Feuchte bzw. CO₂)
HUMIDITY_AIRING = 65.0
CO2_AIRING = 1000.0


def _rooms(hass: HomeAssistant) -> list[Any]:
    return [c for c in (domain_data(hass).get("rooms") or {}).values() if getattr(c, "name", None)]


def _resolve(hass: HomeAssistant, name: str) -> tuple[Any | None, str | None]:
    """Raum nach Namen suchen – genau, sonst eindeutig ähnlich."""
    want = (name or "").strip().lower()
    rooms = _rooms(hass)
    for ctrl in rooms:
        if want and ctrl.name.strip().lower() == want:
            return ctrl, None
    hits = [c for c in rooms if want and (want in c.name.lower() or c.name.lower() in want)]
    if len(hits) == 1:
        return hits[0], None
    bekannt = ", ".join(sorted(c.name for c in rooms)) or tr("keine")
    if not hits:
        return None, tr("Kein Raum „{room}“ gefunden. Bekannt sind: {names}", room=name, names=bekannt)
    return None, tr("Mehrere Räume passen zu „{room}“: {names}", room=name, names=", ".join(c.name for c in hits))


def _needs_airing(ctrl: Any) -> tuple[bool, int]:
    """Lüften nötig? (Feuchte oder CO₂ zu hoch) – mit empfohlener Dauer in Minuten."""
    humidity = ctrl.current_humidity
    co2 = ctrl.current_co2
    needed = (humidity is not None and humidity >= HUMIDITY_AIRING) or (co2 is not None and co2 >= CO2_AIRING)
    if not needed:
        return False, 0
    hub = ctrl.hub
    outdoor = hub.outdoor_temp() if hub is not None else None
    return True, int(recommended_duration(outdoor, dt_util.now().month) or 0)


def room_status(ctrl: Any) -> dict[str, Any]:
    """Antwort auf „Wie warm ist es im Bad?" – alle Werte eines Raums."""
    on, target, reason = ctrl.plan()
    airing, minutes = _needs_airing(ctrl)
    status = {
        "room": ctrl.name,
        "current_temperature_c": None if ctrl.current_temperature is None else round(ctrl.current_temperature, 1),
        "target_temperature_c": round(target if on else ctrl.target_temp, 1),
        "wish_temperature_c": round(ctrl.target_temp, 1),
        "heating_now": ctrl.status == STATUS_HEATING,
        "status": ctrl.status,
        "reason": reason,
        "window_open": bool(getattr(ctrl, "window_open", False)),
        "humidity_percent": None if ctrl.current_humidity is None else round(ctrl.current_humidity),
        "co2_ppm": None if ctrl.current_co2 is None else round(ctrl.current_co2),
        "valve_percent": ctrl.valve_position,
        "needs_airing": airing,
        "airing_minutes": minutes,
        "monitor_only": ctrl.status == STATUS_MONITOR,
    }
    hub = ctrl.hub
    if hub is not None:
        status["heating_season_active"] = bool(hub.heating_allowed)
        status["outdoor_temperature_c"] = None if hub.outdoor_temp() is None else round(hub.outdoor_temp(), 1)
    return status


if llm is not None:

    class RoomListTool(llm.Tool):
        """Alle Räume mit einem Satz Zustand."""

        def __init__(self) -> None:
            self.name = "raumklima_rooms"
            self.description = "List the rooms Raumklima controls, with current and target temperature."
            self.parameters = vol.Schema({})

        async def async_call(
            self, hass: HomeAssistant, tool_input: llm.ToolInput, llm_context: llm.LLMContext
        ) -> dict[str, Any]:
            rooms = []
            for ctrl in _rooms(hass):
                on, target, _reason = ctrl.plan()
                rooms.append(
                    {
                        "room": ctrl.name,
                        "current_temperature_c": None
                        if ctrl.current_temperature is None
                        else round(ctrl.current_temperature, 1),
                        "target_temperature_c": round(target if on else ctrl.target_temp, 1),
                        "heating_now": ctrl.status == STATUS_HEATING,
                    }
                )
            return {"success": True, "rooms": rooms} if rooms else {
                "success": False,
                "error": tr("Noch kein Raum eingerichtet."),
            }

    class RoomStatusTool(llm.Tool):
        """Werte eines Raums."""

        def __init__(self) -> None:
            self.name = "raumklima_room_status"
            self.description = (
                "Values of one room: current and target temperature, humidity, CO2, window, "
                "why the heating is as it is, and whether airing is recommended."
            )
            self.parameters = vol.Schema({vol.Required("room"): str})

        async def async_call(
            self, hass: HomeAssistant, tool_input: llm.ToolInput, llm_context: llm.LLMContext
        ) -> dict[str, Any]:
            ctrl, error = _resolve(hass, str(tool_input.tool_args.get("room") or ""))
            if ctrl is None:
                return {"success": False, "error": error}
            return {"success": True, **room_status(ctrl)}

    class SetTemperatureTool(llm.Tool):
        """Wunschtemperatur setzen."""

        def __init__(self) -> None:
            self.name = "raumklima_set_room_temperature"
            self.description = "Set the desired temperature of one room in °C."
            self.parameters = vol.Schema(
                {vol.Required("room"): str, vol.Required("temperature"): vol.Coerce(float)}
            )

        async def async_call(
            self, hass: HomeAssistant, tool_input: llm.ToolInput, llm_context: llm.LLMContext
        ) -> dict[str, Any]:
            ctrl, error = _resolve(hass, str(tool_input.tool_args.get("room") or ""))
            if ctrl is None:
                return {"success": False, "error": error}
            if ctrl.status == STATUS_MONITOR:
                return {
                    "success": False,
                    "error": tr("{room} ist ein Überwachungsraum – dort lässt sich nichts stellen.", room=ctrl.name),
                }
            await ctrl.async_set_target(float(tool_input.tool_args["temperature"]))
            on, target, _reason = ctrl.plan()
            return {
                "success": True,
                "room": ctrl.name,
                "wish_temperature_c": round(ctrl.target_temp, 1),
                "effective_temperature_c": round(target if on else ctrl.target_temp, 1),
            }

    class RaumklimaLLMAPI(llm.API):
        """Schnittstelle für KI-Sprachassistenten."""

        async def async_get_api_instance(self, llm_context: llm.LLMContext) -> llm.APIInstance:
            return llm.APIInstance(self, PROMPT, llm_context, [RoomListTool(), RoomStatusTool(), SetTemperatureTool()])


def async_register(hass: HomeAssistant) -> None:
    """Werkzeuge einmalig anmelden (mehrere Zentralen teilen sie sich)."""
    if llm is None:
        return
    key = "assist_api"
    data = domain_data(hass)
    if data.get(key):
        return
    try:
        llm.async_register_api(hass, RaumklimaLLMAPI(hass=hass, id="raumklima", name="Raumklima"))
    except Exception:  # noqa: BLE001 - ältere Version ohne diese Schnittstelle
        return
    data[key] = True
