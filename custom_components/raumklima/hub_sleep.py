"""Schlafenszeiten der Wohnung: Ruhezeit, Nachtlüft-Fenster, gelernte Zeiten."""

from __future__ import annotations

from datetime import datetime, timedelta
import logging
from typing import TYPE_CHECKING, Any

from homeassistant.core import callback
from homeassistant.util import dt as dt_util

from .decision_log import (
    CAT_PRESENCE,
    CAT_SETTINGS,
)
from .holidays_de import holiday_name
from .sleep import BED, WAKE, effective_times, is_weekend_night, night_of

if TYPE_CHECKING:
    pass


_LOGGER = logging.getLogger(__name__)


class SleepMixin:
    """Schlafenszeiten-Teil der Zentrale."""

    @property
    def holiday_state(self) -> str | None:
        return str(self.opt("holiday_state") or "") or None

    @property
    def sleep_signals(self) -> list[str]:
        return [e for e in (self.opt("sleep_signals") or []) if isinstance(e, str)]

    def _signals_on(self) -> bool:
        return any(
            (st := self.hass.states.get(e)) is not None and st.state == "on" for e in self.sleep_signals
        )

    @callback
    def _on_signal_change(self, event: Any) -> None:
        new = event.data.get("new_state")
        if new is None or new.state in ("unavailable", "unknown"):
            return
        self._handle_signal(self.signals.update(self._signals_on(), dt_util.now()), event.data.get("entity_id"))

    def _handle_signal(self, kind: str | None, entity_id: str | None = None) -> None:
        if kind is None:
            return
        local = dt_util.now()
        if kind == BED:
            when = dt_util.as_local(self.signals.bed_at) if self.signals.bed_at else local
            names = ", ".join(self._entity_name(e) for e in self.sleep_signals)
            self.log.add(CAT_PRESENCE, "Schlafenszeit erkannt", f"{names} seit {when:%H:%M} aus – Ruhezeit gilt ab jetzt")
            self.record_sleep(BED, when, "Licht")
        else:
            self._woke_night = night_of(local).isoformat()
            self.log.add(CAT_PRESENCE, "Aufgestanden erkannt", f"{self._entity_name(entity_id or '')} ist an – Ruhezeit endet")
            self.record_sleep(WAKE, local, "Licht")
        self._save()
        self._changed()

    def _entity_name(self, entity_id: str) -> str:
        st = self.hass.states.get(entity_id)
        return str(st.name) if st is not None and getattr(st, "name", None) else entity_id

    def record_sleep(self, kind: str, local: datetime, source: str) -> None:
        """Bett-/Aufstehereignis lernen (auch von Räumen beim Nachtlüften)."""
        night = night_of(local)
        weekend = is_weekend_night(night, self.holiday_state)
        before = self.sleep.learned(weekend).as_dict()
        if not self.sleep.record(kind, local, source):
            return
        self.sleep.prune(local.date())
        after = self.sleep.learned(weekend).as_dict()
        if (before["bed"], before["wake"]) != (after["bed"], after["wake"]) and (after["bed"] or after["wake"]):
            label = "Wochenende" if weekend else "werktags"
            self.log.add(
                CAT_SETTINGS,
                f"Schlafenszeiten gelernt ({label})",
                f"ins Bett ~{after['bed'] or '–'} ({after['nights_bed']} Nächte), aufstehen ~{after['wake'] or '–'} ({after['nights_wake']} Nächte)",
            )
        self._save()

    def times_for(self, local: datetime | None = None) -> dict[str, Any]:
        """Wirksame Ruhe- und Nachtlüftzeiten für die Nacht, zu der „local“ gehört."""
        local = local or dt_util.now()
        self.sleep.state = self.holiday_state
        night = night_of(local)
        weekend = is_weekend_night(night, self.holiday_state)
        end = str(self.opt("quiet_end_weekend") or self.opt("quiet_end")) if weekend else str(self.opt("quiet_end"))
        out = effective_times(
            self.sleep.learned(weekend),
            str(self.opt("quiet_start")),
            end,
            str(self.opt("night_start")),
            str(self.opt("night_end")),
            enabled=bool(self.opt("learn_times")),
        )
        out["weekend"] = weekend
        out["night"] = night.isoformat()
        out["holiday"] = holiday_name(night + timedelta(days=1), self.holiday_state)
        return out

    def morning_after(self, since_local: datetime) -> datetime:
        """Ende der Ruhezeit am Morgen nach „since“ (gelernt, Wochenende beachtet)."""
        times = self.times_for(since_local)
        night = night_of(since_local)
        h, m = (int(x) for x in times["quiet_end"].split(":"))
        morning = datetime.combine(night + timedelta(days=1), datetime.min.time(), since_local.tzinfo).replace(hour=h, minute=m)
        return morning

    def woke_after(self, since_local: datetime) -> bool:
        """Haben Schlaf-Signale nach „since“ schon „aufgestanden“ gemeldet?"""
        return bool(self.sleep_signals) and self._woke_night == night_of(since_local).isoformat() and not self.signals.asleep

    def sleep_summary(self) -> dict[str, Any]:
        now = dt_util.now()
        out: dict[str, Any] = {
            "asleep": self.signals.asleep if self.sleep_signals else None,
            "quiet_now": self.quiet_now(),
            "tonight": self.times_for(now),
        }
        for key, weekend in (("weekday", False), ("weekend", True)):
            sample = now
            while is_weekend_night(night_of(sample), self.holiday_state) != weekend:
                sample += timedelta(days=1)
            out[key] = {**self.sleep.learned(weekend).as_dict(), "effective": self.times_for(sample)}
        return out
