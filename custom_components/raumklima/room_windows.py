"""Fensterlogik eines Raums: Kontakte, Verzögerung, Nachtlüften, Fenster ohne Kontakt."""

from __future__ import annotations

from datetime import datetime
import logging

from homeassistant.core import State, callback
from homeassistant.util import dt as dt_util

from .const import (
    CONF_NIGHT_AIRING,
    CONF_ROOM_TYPE,
    CONF_VIRTUAL_WINDOW,
    CONF_WINDOW_CLOSE_DELAY,
    CONF_WINDOW_OPEN_DELAY,
)
from .decision_log import (
    CAT_TARGET,
    CAT_WINDOW,
    fmt_temp,
)
from .logic import (
    any_open,
    is_valid,
)
from .planning import (
    NIGHT_AUTO,
    NIGHT_OFF,
    NIGHT_ON,
    NIGHT_ROOM_TYPES,
    VIRT_AUTO,
    VIRT_MAX_OPEN,
    VIRT_OFF,
    VIRT_ON,
    detect_temp_drop,
    in_time_window,
    night_airing_applies,
    virtual_window_close_reason,
)

_LOGGER = logging.getLogger(__name__)


class WindowMixin:
    """Fenster-Teil des Raum-Controllers (nutzt dessen Zustand)."""

    @property
    def paused(self) -> bool:
        """Heizung wegen offenem Fenster pausiert?"""
        return self.window_logic and self.window_paused

    @property
    def night_mode(self) -> str:
        return str(self.config.get(CONF_NIGHT_AIRING) or NIGHT_AUTO)

    def night_applies(self) -> bool:
        """Würde ein jetzt geöffnetes Fenster als Nachtlüften zählen?"""
        return self.night_reason()[0]

    def night_reason(self) -> tuple[bool, str]:
        """(Nachtlüften?, Begründung für das Protokoll)."""
        hub = self.hub
        if hub is None:
            return False, "keine Zentrale"
        local = dt_util.now()
        room_type = self.vent.room_type if self.vent else self.config.get(CONF_ROOM_TYPE)
        times = hub.times_for(local)
        start, end = times["night_start"], times["night_end"]
        in_window = in_time_window(local, start, end) or (bool(hub.sleep_signals) and hub.signals.asleep)
        home = not hub.nobody_home
        applies = night_airing_applies(self.night_mode, room_type, in_window, home)
        if self.night_mode == NIGHT_OFF:
            why = "Nachtlüften ist für diesen Raum aus"
        elif self.night_mode != NIGHT_ON and room_type not in NIGHT_ROOM_TYPES:
            why = "kein Schlafraum"
        elif not in_window:
            why = f"{local:%H:%M} liegt nicht im Nachtlüften-Fenster {start}–{end}" + (" (gelernt)" if times["source"]["night_start"] == "learned" else "")
        elif not home:
            why = "niemand zu Hause"
        else:
            why = f"{'Schlafraum' if self.night_mode != NIGHT_ON else 'Nachtlüften an'}, {local:%H:%M} im Fenster {start}–{end}, jemand da"
        return applies, why

    @property
    def night_airing(self) -> bool:
        """Fenster offen, weil bei offenem Fenster geschlafen wird."""
        return self._window_raw and self.night_since is not None

    @property
    def window_open(self) -> bool:
        """Mindestens ein Fenster offen (ohne Verzögerung)."""
        return self._window_raw

    # ================================================================ Fenster ohne Kontakt
    @property
    def virtual_mode(self) -> str:
        return str(self.config.get(CONF_VIRTUAL_WINDOW) or VIRT_AUTO)

    def virtual_enabled(self) -> bool:
        """Temperatursturz-Erkennung aktiv? Automatisch nur ohne (erreichbaren) Kontakt."""
        mode = self.virtual_mode
        if mode == VIRT_OFF:
            return False
        if mode == VIRT_ON:
            return True
        return not self.windows or all(w in self._window_unavail_since for w in self.windows)

    @property
    def window_virtual(self) -> bool:
        """Fenster nur geschätzt offen (kein Kontakt meldet es)."""
        return self.virtual_open_at is not None and not any_open(self._last_valid_windows, self.windows)

    def _windows_open(self) -> bool:
        return any_open(self._last_valid_windows, self.windows) or self.virtual_open_at is not None

    def _check_virtual_window(self, now: datetime, value: float) -> None:
        if not self._started:
            return
        if self.virtual_open_at is not None:
            self._virtual_low = min(self._virtual_low, value)
            reason = virtual_window_close_reason(self.virtual_open_at, now, self._virtual_low, value)
            if reason:
                self._close_virtual(reason)
            return
        if not self.virtual_enabled() or self.paused:
            return
        hub = self.hub
        outdoor = hub.outdoor_temp() if hub is not None else None
        drop = detect_temp_drop(list(self._temp_hist), now, outdoor)
        if drop is None:
            return
        self.virtual_open_at = now
        self._virtual_low = value
        self.log(
            CAT_WINDOW,
            "Fenster vermutlich offen",
            f"Temperatur in wenigen Minuten um {fmt_temp(drop)} gefallen"
            + (f", draußen {fmt_temp(outdoor)}" if outdoor is not None else "")
            + " – Heizung pausiert, bis es wieder wärmer wird (höchstens 30 min)",
        )
        self._virtual_cancel = self._schedule(VIRT_MAX_OPEN.total_seconds() + 5, lambda: self._close_virtual("max"))
        self._evaluate_windows()

    def _close_virtual(self, reason: str) -> None:
        if self.virtual_open_at is None:
            return
        if self._virtual_cancel:
            self._virtual_cancel()
            self._virtual_cancel = None
        minutes = (dt_util.utcnow() - self.virtual_open_at).total_seconds() / 60
        self.virtual_open_at = None
        self.log(
            CAT_WINDOW,
            "Fenster vermutlich wieder zu",
            f"Temperatur steigt wieder (nach {minutes:.0f} min)" if reason == "recovered" else f"nach {minutes:.0f} min – Heizung läuft wieder",
        )
        self._evaluate_windows()

    def _on_window(self, entity_id: str, new: State | None) -> None:
        if new is None or not is_valid(new.state):
            self._window_unavail_since.setdefault(entity_id, dt_util.utcnow())
            return  # Verbindungsabbruch: letzten echten Zustand behalten
        self._window_unavail_since.pop(entity_id, None)
        self._last_valid_windows[entity_id] = new.state
        self._evaluate_windows()

    def _evaluate_windows(self) -> None:
        raw = self._windows_open()
        if raw == self._window_raw and (self._window_timer or raw == self.window_paused):
            return
        was_virtual = self._raw_virtual
        self._window_raw = raw
        self._raw_virtual = raw and self.window_virtual
        if self._raw_virtual or (not raw and was_virtual):
            pass  # geschätztes Fenster: eigene Protokolleinträge, kein Nachtlüften
        elif raw and self.night_since is None:
            night, why = self.night_reason()
            if night:
                self.night_since = dt_util.utcnow()
                self.log(CAT_WINDOW, "Fenster auf – Nachtlüften", f"{why}: keine Lüft-Hinweise, Heizung wartet bis zum Schließen")
                if self.hub is not None:
                    self.hub.record_sleep("bed", dt_util.now(), f"Fenster {self.name}")
            else:
                self.log(CAT_WINDOW, "Fenster auf", f"normales Lüften ({why})" if self.night_mode != NIGHT_OFF and why != "kein Schlafraum" else None)
        elif not raw:
            if self.night_since is not None:
                hours = (dt_util.utcnow() - self.night_since).total_seconds() / 3600
                self.log(CAT_WINDOW, "Fenster zu – Nachtlüften beendet", f"nach {hours:.1f} h".replace(".", ","))
                if self.hub is not None and hours >= 3:
                    self.hub.record_sleep("wake", dt_util.now(), f"Fenster {self.name}")
            else:
                self.log(CAT_WINDOW, "Fenster zu")
            self.night_since = None
        if self.vent:
            self.vent.on_window_raw(raw)
        if self._window_timer:
            self._window_timer()
            self._window_timer = None
        if raw == self.window_paused:
            return  # vor Ablauf der Verzögerung zurückgewechselt
        delay = float(
            self.config[CONF_WINDOW_OPEN_DELAY if raw else CONF_WINDOW_CLOSE_DELAY]
        )
        self._window_timer = self._schedule(delay, self._window_timer_done)

    @callback
    def _window_timer_done(self) -> None:
        self._window_timer = None
        raw = self._windows_open()
        if raw != self.window_paused:
            self.window_paused = raw
            _LOGGER.info(
                "%s: Fenster %s", self.name, "offen – pausiere" if raw else "zu – fortsetzen"
            )
            delay = float(self.config[CONF_WINDOW_OPEN_DELAY if raw else CONF_WINDOW_CLOSE_DELAY])
            if not self.window_logic:
                pass
            elif raw:
                self.log(CAT_TARGET, "Heizung pausiert", f"Fenster seit {delay:.0f} s offen")
            else:
                self.log(CAT_TARGET, "Heizung läuft weiter", f"Fenster seit {delay:.0f} s zu – Ziel {fmt_temp(self.plan()[1])}")
            self._notify()
            self.hass.async_create_task(self._apply())
