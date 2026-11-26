"""Messwerte eines Raums: Temperatur, Feuchte, CO₂, Feinstaub, Fühlerzustand (Teil von RaumklimaController)."""

from __future__ import annotations

from typing import Any

from homeassistant.util import dt as dt_util

from .const import CONF_SENSOR_STALE_MINUTES
from .decision_log import CAT_DEVICE
from .logic import (
    is_valid,
    to_float,
)
from .msg import dec, tr
from .room_const import FROZEN_FALLBACK_DELTA, FROZEN_MIN_MINUTES


class ReadingsMixin:
    """Messwerte eines Raums: Temperatur, Feuchte, CO₂, Feinstaub, Fühlerzustand (Teil von RaumklimaController)."""

    @property
    def has_room_sensor(self) -> bool:
        """Ist ein eigener Raumfühler eingetragen? (seit 2.0.1b7 optional, #68)"""
        return bool(self.temp_sensor)

    @property
    def sensor_ok(self) -> bool:
        """Liefert der Raum eine brauchbare Temperatur?

        Mit eigenem Raumfühler entscheidet dieser (``ext_sensor_ok``). Ohne Raumfühler regelt
        Raumklima auf den Fühler des Thermostats – das ist dann kein Ausfall, sondern so
        eingestellt (#68: FRITZ!DECT ohne externen Fühler meldete „Fühler ausgefallen“).
        """
        if not self.has_room_sensor:
            return not self.monitor and self.trv_temperature is not None
        return self.ext_sensor_ok

    @property
    def ext_sensor_ok(self) -> bool:
        """Externer Fühler liefert einen brauchbaren Wert.

        Das Alter allein zählt nicht: batteriebetriebene Fühler (Homematic, Danfoss) senden nur bei
        Änderung. Ein drei Stunden alter Wert ist bei stabiler Temperatur weiterhin gültig – vorher
        meldete der Raum „Fühler ausgefallen", obwohl das Gerät erreichbar war (Issue #11).
        Ein echter Ausfall zeigt sich am Entitätszustand (unavailable/unknown/kein Wert).
        """
        if not self.has_room_sensor:
            return False
        state = self.hass.states.get(self.temp_sensor)
        if state is None or not is_valid(state.state):
            return False
        if self.ext_sensor_frozen:
            return False  # hängt nachweislich – Notbetrieb mit dem Thermostatfühler (#94)
        # Ein gültiger Zustand genügt: der gemerkte Wert kann fehlen, wenn der Fühler beim Start
        # der Zentrale noch nicht bereit war (Tuya ZTH01 meldet erst Minuten später) – Issue #10.
        return self._ext_value is not None or to_float(state.state) is not None

    @property
    def ext_sensor_frozen(self) -> bool:
        """Hängt der Raumfühler (#94)? Nur wenn drei Dinge zusammenkommen:

        * seit ``sensor_stale_minutes`` (mind. 2 h) keine einzige Meldung des Fühlers,
        * sein Wert seit dieser Zeit unverändert,
        * und das Thermostat hat sich in der Zeit um mindestens 2,5 K bewegt.

        Ein ruhiger, gültiger Wert bleibt damit gültig (#11/#14: batteriebetriebene Fühler senden nur
        bei Änderung) – ein ausgefallener Fühler, der nur seinen letzten Wert stehen lässt, nicht.
        """
        changed = getattr(self, "_ext_changed_at", None)
        trv_then = getattr(self, "_trv_at_ext_change", None)
        trv_now = self.trv_temperature
        age = self.sensor_age_minutes
        frozen = False
        if changed is not None and trv_then is not None and trv_now is not None and age is not None:
            limit = max(float(self.config.get(CONF_SENSOR_STALE_MINUTES) or 60), FROZEN_MIN_MINUTES)
            unchanged = (dt_util.utcnow() - changed).total_seconds() / 60
            frozen = age >= limit and unchanged >= limit and abs(trv_now - trv_then) >= FROZEN_FALLBACK_DELTA
        if frozen != getattr(self, "_ext_frozen_logged", False):
            self._ext_frozen_logged = frozen
            self.log(
                CAT_DEVICE,
                tr("Raumfühler hängt – geregelt wird mit dem Thermostatfühler") if frozen else tr("Raumfühler meldet sich wieder"),
                tr("Seit {m} min keine Meldung, das Thermostat hat sich um {d} K bewegt", m=f"{age:.0f}", d=dec(abs(trv_now - trv_then)))
                if frozen else None,
                level="warning" if frozen else "info",
            )
        return frozen

    @property
    def sensor_age_minutes(self) -> float | None:
        """Minuten seit der letzten Meldung des Fühlers (auch für ``ext_sensor_frozen``)."""
        state = self.hass.states.get(self.temp_sensor)
        if state is None:
            return None
        last = getattr(state, "last_reported", None) or state.last_updated
        return (dt_util.utcnow() - last).total_seconds() / 60





    def log(self, cat: str, msg: str, why: str | None = None, level: str = "info", **data: Any) -> None:
        """Ins Entscheidungsprotokoll schreiben (falls die Zentrale läuft)."""
        hub = self.hub
        if hub is not None:
            hub.log.add(cat, msg, why, room=self.name, entry_id=self.entry.entry_id, level=level, **data)



    @property
    def current_temperature(self) -> float | None:
        """Raumtemperatur: externer Fühler, ohne Fühler oder im Notfall das TRV."""
        if self.ext_sensor_ok:
            if self._ext_value is not None:
                return self._ext_value
            state = self.hass.states.get(self.temp_sensor)
            return to_float(state.state) if state is not None else None
        return self.trv_temperature

    @property
    def current_humidity(self) -> float | None:
        """Raumfeuchte: eigener Fühler, sonst das, was das Thermostat selbst misst.

        Viele Thermostate haben einen Feuchtefühler (Livisi, Bosch, FRITZ!DECT, Tuya) – bei
        einigen steht der Wert nur als Attribut an der `climate`-Entität und lässt sich im
        Dialog nicht auswählen. Ohne Rückfall blieben Lüftungshinweise und Schimmelschutz dort
        stumm, obwohl die Zahl vorhanden ist.
        """
        state = self.hass.states.get(self.humidity_sensor) if self.humidity_sensor else None
        value = to_float(state.state) if state is not None else None
        if value is not None and 0 < value <= 100:
            return value  # 0 % oder > 100 % ist ein Fühlerfehler, kein Messwert (#85)
        trv = self.trv_humidity
        return trv if trv is not None and 0 < trv <= 100 else None

    @property
    def trv_humidity(self) -> float | None:
        """Feuchte, die das Raumthermostat selbst meldet (`current_humidity`)."""
        if not self.trv:
            return None
        state = self.hass.states.get(self.trv)
        return to_float((state.attributes or {}).get("current_humidity")) if state is not None else None

    @property
    def humidity_capable(self) -> bool:
        """Kann dieser Raum überhaupt eine Feuchte auswerten?

        Eigener Fühler oder der Feuchtefühler im Thermostat. Bewusst nicht „Wert ist gerade da":
        ein Gerät, das nur sporadisch meldet, soll die Entitäten trotzdem einmal bekommen.
        """
        if self.humidity_sensor:
            return True
        if self.trv_humidity is not None:
            return True
        state = self.hass.states.get(self.trv) if self.trv else None
        return state is not None and "current_humidity" in (state.attributes or {})

    @property
    def humidity_source(self) -> str | None:
        """Woher die Feuchte kommt – „sensor", „trv" oder nichts (für Diagnose und Karte)."""
        if self.current_humidity is None:
            return None
        if self.humidity_sensor:
            state = self.hass.states.get(self.humidity_sensor)
            if state is not None and to_float(state.state) is not None:
                return "sensor"
        return "trv"

    @property
    def current_pm25(self) -> float | None:
        if not self.pm25_sensor:
            return None
        state = self.hass.states.get(self.pm25_sensor)
        return to_float(state.state) if state else None

    @property
    def current_co2(self) -> float | None:
        if not self.co2_sensor:
            return None
        state = self.hass.states.get(self.co2_sensor)
        return to_float(state.state) if state else None
