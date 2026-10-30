"""Heizbericht und Gesundheitscheck für die ganze Wohnung."""

from __future__ import annotations

from collections.abc import Callable
from datetime import date, datetime, timedelta
import logging
from typing import TYPE_CHECKING, Any

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.event import async_track_time_change, async_track_time_interval
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .const import DOMAIN, KIND_HEALTH, KIND_REPORT
from .health import SEV_INFO, Issue
from .stats import add_home_sample, add_room_sample, compare, prune, summarize, week_message

if TYPE_CHECKING:
    from .hub import RaumklimaHub

_LOGGER = logging.getLogger(__name__)
TICK = timedelta(seconds=60)
HEALTH_EVERY = timedelta(minutes=10)
RENOTIFY = timedelta(hours=24)


def shorten_names(names: list[str]) -> dict[str, str]:
    """Gemeinsamen Wort-Präfix entfernen („Finja Berlin Bad“ → „Bad“)."""
    if len(names) < 2:
        return {n: n for n in names}
    words = [n.split() for n in names]
    common = 0
    while all(len(w) > common + 1 for w in words) and len({w[common] for w in words}) == 1:
        common += 1
    return {n: " ".join(w[common:]) for n, w in zip(names, words)}


class Insights:
    """Sammelt Tageswerte je Raum, prüft die Gesundheit und erstellt Berichte."""

    def __init__(self, hass: HomeAssistant, hub: RaumklimaHub) -> None:
        self.hass = hass
        self.hub = hub
        self._store: Store[dict[str, Any]] = Store(hass, 1, f"{DOMAIN}.stats")
        self.data: dict[str, Any] = {"rooms": {}, "names": {}, "home": {}, "notified": {}}
        self.issues: dict[str, list[Issue]] = {}
        self._last_tick: datetime | None = None
        self._pruned: date | None = None
        self._unsubs: list[Callable[[], None]] = []

    async def async_start(self) -> None:
        stored = await self._store.async_load()
        if stored:
            self.data.update(stored)
        self._unsubs.append(async_track_time_interval(self.hass, self._on_tick, TICK))
        self._unsubs.append(async_track_time_interval(self.hass, self._on_health, HEALTH_EVERY))
        self._unsubs.append(
            async_track_time_change(self.hass, self._on_weekly, hour=18, minute=0, second=0)
        )

    async def async_stop(self) -> None:
        for unsub in self._unsubs:
            unsub()
        self._unsubs.clear()
        await self._store.async_save(self.data)

    def _save(self) -> None:
        self._store.async_delay_save(lambda: self.data, 300)

    # ------------------------------------------------------------ Sammeln
    def _today(self) -> str:
        return dt_util.now().date().isoformat()

    @callback
    def _on_tick(self, now: datetime) -> None:
        dt = 60.0 if self._last_tick is None else (now - self._last_tick).total_seconds()
        self._last_tick = now
        dt = max(0.0, min(dt, 180.0))  # Lücken (Neustart) nicht hochrechnen
        today = self._today()
        for entry_id, room in list(self.hub.rooms.items()):
            try:
                sample = room.stats_sample()
                room.record_history(now)
            except Exception as err:  # noqa: BLE001 – Statistik darf die Regelung nie stören
                _LOGGER.debug("Statistik %s: %s", entry_id, err)
                continue
            day = self.data["rooms"].setdefault(entry_id, {}).setdefault(today, {})
            add_room_sample(day, sample, dt)
            self.data["names"][entry_id] = room.name
        home = self.data["home"].setdefault(today, {})
        add_home_sample(home, self.hub.away, self.hub.outdoor_temp(), dt)
        if self._pruned != dt_util.now().date():
            self._pruned = dt_util.now().date()
            for days in self.data["rooms"].values():
                prune(days, self._pruned)
            prune(self.data["home"], self._pruned)
        self._save()

    def on_arrival(self) -> None:
        """Jemand ist angekommen: war es schon warm?"""
        today = self._today()
        for entry_id, room in self.hub.rooms.items():
            day = self.data["rooms"].setdefault(entry_id, {}).setdefault(today, {})
            day["arrivals"] = day.get("arrivals", 0) + 1
            temp = room.current_temperature
            if temp is not None and temp >= room.target_temp - 1.0:
                day["arrivals_warm"] = day.get("arrivals_warm", 0) + 1

    def on_preheat(self) -> None:
        home = self.data["home"].setdefault(self._today(), {})
        home["preheats"] = home.get("preheats", 0) + 1

    # ------------------------------------------------------------ Gesundheit
    @callback
    def _on_health(self, now: datetime) -> None:
        self.check_health(now)

    def check_health(self, now: datetime | None = None) -> None:
        now = now or dt_util.utcnow()
        notified: dict[str, str] = self.data.setdefault("notified", {})
        changed = False
        for entry_id, room in list(self.hub.rooms.items()):
            try:
                issues = room.health_issues(now)
            except Exception as err:  # noqa: BLE001
                _LOGGER.debug("Gesundheit %s: %s", entry_id, err)
                continue
            old = {i.code for i in self.issues.get(entry_id, [])}
            self.issues[entry_id] = issues
            if {i.code for i in issues} != old:
                changed = True
                room.notify_listeners()
            for issue in issues:
                key = f"{entry_id}:{issue.code}"
                last = dt_util.parse_datetime(notified[key]) if key in notified else None
                if issue.severity == SEV_INFO or (last and now - last < RENOTIFY):
                    continue
                notified[key] = now.isoformat()
                self.hub.notify(KIND_HEALTH, f"🩺 {room.name}: {issue.title}", issue.message, speak=False)
            # Erledigte Probleme vergessen, damit sie beim Wiederauftreten erneut gemeldet werden
            for key in [k for k in notified if k.startswith(f"{entry_id}:")]:
                if key.split(":", 1)[1] not in {i.code for i in issues}:
                    del notified[key]
        if changed:
            self.hub.notify_entities()
        self._save()

    def all_issues(self) -> list[dict[str, Any]]:
        out = []
        for entry_id, issues in self.issues.items():
            room = self.hub.rooms.get(entry_id)
            for issue in issues:
                out.append({"room": room.name if room else entry_id, "entry_id": entry_id, **issue.as_dict()})
        return out

    # ------------------------------------------------------------ Bericht
    def _rooms_by_name(self) -> dict[str, dict[str, dict[str, float]]]:
        names = self.data.get("names", {})
        current = {eid: r.name for eid, r in self.hub.rooms.items()}
        full = {eid: current.get(eid) or names.get(eid, eid) for eid in self.data["rooms"]}
        short = shorten_names(list(full.values()))
        return {short[full[eid]]: days for eid, days in self.data["rooms"].items()}

    def report(self, today: date | None = None) -> dict[str, Any]:
        """Woche, Vorwoche, Monat, Vormonat und Tageswerte der letzten 31 Tage."""
        today = today or dt_util.now().date()
        rooms = self._rooms_by_name()
        home = self.data["home"]
        week_start = today - timedelta(days=today.weekday())
        prev_week_start = week_start - timedelta(days=7)
        month_start = today.replace(day=1)
        prev_month_end = month_start - timedelta(days=1)
        prev_month_start = prev_month_end.replace(day=1)
        week = summarize(rooms, home, week_start, today)
        prev_week = summarize(rooms, home, prev_week_start, week_start - timedelta(days=1))
        month = summarize(rooms, home, month_start, today)
        prev_month = summarize(rooms, home, prev_month_start, prev_month_end)
        daily = []
        for i in range(30, -1, -1):
            d = today - timedelta(days=i)
            s = summarize(rooms, home, d, d)
            daily.append(
                {
                    "date": d.isoformat(),
                    "hdd": s["hdd"],
                    "outdoor": s["outdoor_avg"],
                    "rooms": {n: {"heating_h": r["heating_h"], "valve_h": r["valve_h"], "setback_h": r["setback_h"]} for n, r in s["rooms"].items()},
                }
            )
        first = min((k for days in rooms.values() for k in days), default=None)
        return {
            "since": first,
            "week": week,
            "prev_week": prev_week,
            "week_change": compare(week, prev_week),
            "month": month,
            "prev_month": prev_month,
            "month_change": compare(month, prev_month),
            "daily": daily,
        }

    @callback
    def _on_weekly(self, now: datetime) -> None:
        local = dt_util.as_local(now)
        if local.weekday() != 6:
            return
        today = local.date()
        start = today - timedelta(days=6)
        rooms = self._rooms_by_name()
        cur = summarize(rooms, self.data["home"], start, today)
        if cur["total"]["hours"] < 24:
            return  # noch zu wenige Daten
        prev = summarize(rooms, self.data["home"], start - timedelta(days=7), start - timedelta(days=1))
        self.hub.notify(KIND_REPORT, "📊 Heizung diese Woche", week_message(cur, compare(cur, prev)), speak=False)
