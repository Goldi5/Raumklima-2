"""Funkverkehr und Batterien eines Raums: Befehle je Tag zählen, Batterie-Restlaufzeit schätzen.

Teil von ``RaumklimaController``. Je Tag wird die Zahl der Funkbefehle gemerkt (14 Tage) und
einmal täglich der Stand jeder Batterie (45 Tage). Daraus entstehen die Hinweise
„Batterie bald leer“ (Gerade durch den Verlauf) und „Thermostat funkt auffällig viel“.
"""

from __future__ import annotations

from datetime import date, datetime, timedelta
from typing import Any

from homeassistant.util import dt as dt_util

from .health import Issue, battery_days_left, check_battery_forecast, check_radio_busy, radio_per_day
from .logic import to_float

RF_KEEP_DAYS = 14
BATTERY_KEEP_DAYS = 45


class RadioMixin:
    """Funkbefehle und Batterieverlauf."""

    def _count_rf(self, attempts: int) -> None:
        """Funkbefehl zählen – je Tag, mit Wiederholungen (Batterie-Diagnose)."""
        today = dt_util.now().date().isoformat()
        if self._rf.get("day") != today:
            self._roll_rf(today)
        self._rf["sent"] = int(self._rf.get("sent") or 0) + 1
        if attempts > 1:
            self._rf["retries"] = int(self._rf.get("retries") or 0) + 1
        self._save()

    def _roll_rf(self, today: str) -> None:
        """Neuer Tag: gestrigen Zähler in den Verlauf, ältere als 14 Tage vergessen."""
        hist = dict(self._rf.get("hist") or {})
        if self._rf.get("day"):
            hist[self._rf["day"]] = int(self._rf.get("sent") or 0)
        cutoff = (date.fromisoformat(today) - timedelta(days=RF_KEEP_DAYS)).isoformat()
        hist = {d: n for d, n in hist.items() if d >= cutoff}
        self._rf = {"day": today, "sent": 0, "retries": 0, "hist": hist}

    @property
    def rf_today(self) -> dict[str, int]:
        """Funkbefehle heute: gesamt und davon Wiederholungen."""
        today = dt_util.now().date().isoformat()
        if self._rf.get("day") != today:
            return {"sent": 0, "retries": 0}
        return {"sent": int(self._rf.get("sent") or 0), "retries": int(self._rf.get("retries") or 0)}

    @property
    def rf_per_day(self) -> float | None:
        """Mittlere Funkbefehle je Tag (letzte 7 Tage)."""
        return radio_per_day(dict(self._rf.get("hist") or {}), dt_util.now().date())

    def record_battery(self, local: datetime) -> None:
        """Einmal am Tag den Stand jeder Batterie merken."""
        day = local.date().isoformat()
        changed = False
        for entity_id in getattr(self, "_batteries", {}).values():
            st = self.hass.states.get(entity_id)
            level = to_float(st.state) if st else None
            if level is None:
                continue
            series = self._battery_hist.setdefault(entity_id, {})
            if day in series:
                continue
            last = series[max(series)] if series else None
            if last is not None and level > last + 15:
                series.clear()  # deutlich gestiegen: Batterie gewechselt – neu anfangen
            series[day] = round(level, 1)
            cutoff = (local.date() - timedelta(days=BATTERY_KEEP_DAYS)).isoformat()
            for d in [d for d in series if d < cutoff]:
                del series[d]
            changed = True
        if changed:
            self._save()

    def battery_forecast(self) -> list[dict[str, Any]]:
        """Je Batterie: geschätzte Tage bis leer (None = noch keine Schätzung)."""
        out = []
        for name, entity_id in getattr(self, "_batteries", {}).items():
            days = battery_days_left(self._battery_hist.get(entity_id) or {})
            out.append({"name": name, "entity_id": entity_id, "days_left": None if days is None else round(days)})
        return out

    def radio_issues(self) -> list[Issue]:
        per_day = self.rf_per_day
        issues = [
            i
            for f in self.battery_forecast()
            if (i := check_battery_forecast(f["name"], f["days_left"], per_day)) is not None
        ]
        if (busy := check_radio_busy(per_day)) is not None and not issues:
            issues.append(busy)
        return issues
