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

from .const import (
    CONF_ENERGY_BASE,
    CONF_ENERGY_EFFICIENCY,
    CONF_ENERGY_ENABLED,
    CONF_ENERGY_FACTOR,
    CONF_ENERGY_HEAT_ENTITY,
    CONF_ENERGY_METER,
    CONF_ENERGY_PRICE,
    CONF_ENERGY_PRICE_BASIS,
    CONF_ENERGY_VAT,
    CONF_ENERGY_EXTRA_FEE,
    CONF_ENERGY_SOURCE,
    CONF_ENERGY_CHEAP_PRICE,
    CONF_ENERGY_PREHEAT_CHEAP,
    CONF_ENERGY_TARIFF,
    CONF_ENERGY_TARIFF_DYNAMIC,
    CONF_PV_ENTITY,
    CONF_PV_SELF_USE,
    CONF_RECIPIENTS,
    CONF_REPORT_METRIC,
    CONF_RESIDENTS,
    CONF_TTS,
    DOMAIN,
    KIND_HEALTH,
    KIND_REPORT,
    REPORT_METRIC_DEFAULT,
)
from .health import SEV_INFO, Issue, check_connection, check_notify_targets, check_presence_residents
from .msg import tr
from .report_extra import energy_kwh, money, pv_split
from .stats import add_home_sample, add_room_sample, compare, export_rows, prune, rows_to_csv, summarize, week_message

if TYPE_CHECKING:
    from .hub import RaumklimaHub

_LOGGER = logging.getLogger(__name__)
TICK = timedelta(seconds=60)
HEALTH_EVERY = timedelta(minutes=10)
RENOTIFY = timedelta(hours=24)


def shorten_names(names: list[str]) -> dict[str, str]:
    """Gemeinsamen Wort-Präfix entfernen („Haus A Bad“ → „Bad“)."""
    if len(names) < 2:
        return {n: n for n in names}
    words = [n.split() for n in names]
    common = 0
    while all(len(w) > common + 1 for w in words) and len({w[common] for w in words}) == 1:
        common += 1
    return {n: " ".join(w[common:]) for n, w in zip(names, words, strict=True)}


def target_exists(hass: HomeAssistant, target: str) -> bool:
    """Gibt es das Ziel noch? Dienst *oder* notify-Entität (Alexa Devices liefert Entitäten)."""
    if "." not in target:
        return True
    domain, name = target.split(".", 1)
    if hass.services.has_service(domain, name):
        return True
    state = hass.states.get(target)
    return state is not None and state.state != "unavailable"


class Insights:
    """Sammelt Tageswerte je Raum, prüft die Gesundheit und erstellt Berichte."""

    def __init__(self, hass: HomeAssistant, hub: RaumklimaHub) -> None:
        self.hass = hass
        self.hub = hub
        self._store: Store[dict[str, Any]] = Store(hass, 1, f"{DOMAIN}.stats{hub.store_suffix}")
        self.data: dict[str, Any] = {"rooms": {}, "names": {}, "home": {}, "notified": {}}
        self.issues: dict[str, list[Issue]] = {}
        self._last_tick: datetime | None = None
        self._pruned: date | None = None
        self._unsubs: list[Callable[[], None]] = []

    async def async_start(self) -> None:
        stored = await self._store.async_load()
        self._loaded = True
        if stored:
            self.data.update(stored)
        self._unsubs.append(async_track_time_interval(self.hass, self._on_tick, TICK))
        self._unsubs.append(async_track_time_interval(self.hass, self._on_health, HEALTH_EVERY))
        self._unsubs.append(
            async_track_time_change(self.hass, self._on_weekly, hour=18, minute=0, second=0)
        )
        self._unsubs.append(
            async_track_time_change(self.hass, self._on_daily, hour=9, minute=5, second=0)
        )

    async def async_stop(self) -> None:
        for unsub in self._unsubs:
            unsub()
        self._unsubs.clear()
        if getattr(self, "_loaded", False):
            await self._store.async_save(self.data)

    def save(self) -> None:
        self._save()

    def _save(self) -> None:
        if getattr(self, "_loaded", False):
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
        seen = getattr(self, "_rf_seen", {})
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
        self._rf_seen = seen
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

    def count(self, entry_id: str, field: str, home: bool = False) -> None:
        """Ereignis des Tages zählen (z. B. „Luft ausgetauscht“, Funkaussetzer)."""
        today = self._today()
        day = self.data["home"].setdefault(today, {}) if home else self.data["rooms"].setdefault(entry_id, {}).setdefault(today, {})
        day[field] = day.get(field, 0) + 1

    def count_airing(self, entry_id: str) -> None:
        """Ein Fenster wurde zum Lüften geöffnet (nicht Nachtlüften)."""
        day = self.data["rooms"].setdefault(entry_id, {}).setdefault(self._today(), {})
        day["airings"] = day.get("airings", 0) + 1

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
            for issue in issues:
                if issue.code not in old:
                    room.fire_event("health", {"state": "problem", "code": issue.code, "title": issue.title, "severity": issue.severity})
                    room.log("health", tr("Problem erkannt: {title}", title=issue.title), issue.message, level="info" if issue.severity == SEV_INFO else "warn")
            for code in old - {i.code for i in issues}:
                room.log("health", tr("Problem behoben"), code)
            if {i.code for i in issues} != old:
                changed = True
                room.notify_listeners()
            for issue in issues:
                key = f"{entry_id}:{issue.code}"
                last = dt_util.parse_datetime(notified[key]) if key in notified else None
                if issue.severity == SEV_INFO or (last and now - last < RENOTIFY):
                    continue
                notified[key] = now.isoformat()
                self.hub.notify(KIND_HEALTH, f"🩺 {room.name}: {issue.title}", issue.message, speak=False, room=room)
            # Erledigte Probleme vergessen, damit sie beim Wiederauftreten erneut gemeldet werden
            for key in [k for k in notified if k.startswith(f"{entry_id}:")]:
                if key.split(":", 1)[1] not in {i.code for i in issues}:
                    del notified[key]
        # Wohnungs-Ebene: Verbindung (alle Thermostate gleichzeitig kurz weg)
        day = [b for b in self.hub.connection_blips if now - b[0] <= timedelta(hours=24)]
        conn = check_connection(len(day), (sum(b[1] for b in day) / len(day)) if day else None)
        hub_issues = [conn] if conn else []
        # Empfänger, die es nicht mehr gibt: sonst laufen Hinweise ins Leere
        configured = set(self.hub.opt(CONF_RECIPIENTS) or {}) | set(self.hub.opt(CONF_TTS) or {})
        missing = sorted(t for t in configured if not target_exists(self.hass, t))
        targets = check_notify_targets(missing)
        if targets:
            hub_issues.append(targets)
        # Bewohner, deren Entität es nicht mehr gibt: Anwesenheit wäre blind
        gone = [p for p in (self.hub.opt(CONF_RESIDENTS) or []) if self.hass.states.get(p) is None]
        residents_missing = check_presence_residents(gone)
        if residents_missing:
            hub_issues.append(residents_missing)
        if {i.code for i in hub_issues} != {i.code for i in self.issues.get("hub", [])}:
            changed = True
        self.issues["hub"] = hub_issues
        if changed:
            self.hub.notify_entities()
        self._save()

    def all_issues(self) -> list[dict[str, Any]]:
        out = []
        for entry_id, issues in self.issues.items():
            room = self.hub.rooms.get(entry_id)
            name = room.name if room else (self.hub.name if entry_id == "hub" else entry_id)
            for issue in issues:
                out.append({"room": name, "entry_id": entry_id, **issue.as_dict()})
        return out

    # ------------------------------------------------------------ Bericht
    def short_names(self) -> dict[str, str]:
        """entry_id → kurzer Raumname (gemeinsames Präfix entfernt)."""
        names = self.data.get("names", {})
        current = {eid: r.name for eid, r in self.hub.rooms.items()}
        full = {eid: current.get(eid) or names.get(eid, eid) for eid in {*self.data["rooms"], *current}}
        short = shorten_names(list(full.values()))
        return {eid: short[n] for eid, n in full.items()}

    def rooms_by_name(self) -> dict[str, dict[str, dict[str, float]]]:
        """Nur Räume, die es **jetzt** gibt.

        Gelöschte Räume und Räume, die in eine andere Wohnung verschoben wurden, liegen noch
        im Speicher – sie dürfen im Bericht nicht als Geisterzeilen auftauchen.
        """
        short = self.short_names()
        current = set(self.hub.rooms) if self.hub is not None else set(self.data["rooms"])
        return {short[eid]: days for eid, days in self.data["rooms"].items() if eid in current}

    def energy_config(self) -> dict[str, Any]:
        """Energie-Einstellungen der Wohnung – ohne Messwerte, für die Anzeige und den Bericht."""
        if self.hub is None:
            return {"enabled": False}
        meter = self.hub.opt(CONF_ENERGY_METER)
        state = self.hass.states.get(meter) if meter else None
        attrs = state.attributes if state is not None else {}
        source = str(self.hub.opt(CONF_ENERGY_SOURCE) or "auto")
        if source == "auto":
            source = "gas" if attrs.get("device_class") == "gas" else "electric"
        return {
            "enabled": bool(self.hub.opt(CONF_ENERGY_ENABLED)),
            "source": source,
            "meter": meter,
            "meter_unit": attrs.get("unit_of_measurement"),
            "tariff": self.hub.opt(CONF_ENERGY_TARIFF),
            "tariff_dynamic": bool(self.hub.opt(CONF_ENERGY_TARIFF_DYNAMIC)),
            "price_basis": str(self.hub.opt(CONF_ENERGY_PRICE_BASIS) or "gross"),
            "vat": float(self.hub.opt(CONF_ENERGY_VAT) or 0),
            "extra_fee": float(self.hub.opt(CONF_ENERGY_EXTRA_FEE) or 0),
            "cheap_price": float(self.hub.opt(CONF_ENERGY_CHEAP_PRICE) or 0),
            "preheat_cheap": bool(self.hub.opt(CONF_ENERGY_PREHEAT_CHEAP)),
            "price": float(self.hub.opt(CONF_ENERGY_PRICE) or 0),
            "base": float(self.hub.opt(CONF_ENERGY_BASE) or 0),
            "factor": float(self.hub.opt(CONF_ENERGY_FACTOR) or 10.0),
            "heat_entity": self.hub.opt(CONF_ENERGY_HEAT_ENTITY),
            "efficiency": float(self.hub.opt(CONF_ENERGY_EFFICIENCY) or 0),
            "pv_entity": self.hub.opt(CONF_PV_ENTITY),
            "pv_self_use": float(self.hub.opt(CONF_PV_SELF_USE) or 0),
        }

    async def async_energy_summary(self, days: int = 30) -> dict[str, Any]:
        """Energie für das Dashboard: Zeitraum, Zählerwerte und Euro-Schätzung."""
        today = dt_util.now().date()
        days = max(1, min(int(days), 365))
        start = today - timedelta(days=days - 1)
        cfg = (await self.async_energy_extras(start, today))["energy"]
        cfg["days"] = days
        cur = summarize(self.rooms_by_name(), self.data["home"], start, today)
        annual = self.hub.opt("annual_cost") if self.hub is not None else None
        cost = money(cur, annual, cfg)
        if cost is None and cfg.get("kwh") and cfg.get("price"):
            kwh = float(cfg["kwh"])
            price = float(cfg["price"])
            offset = 0.0
            if cfg.get("source") in ("electric", "heatpump") and cfg.get("pv_kwh"):
                share = max(0.0, min(100.0, float(cfg.get("pv_self_use") or 0))) / 100
                offset = max(0.0, float(cfg["pv_kwh"])) * share
            period = max(0.0, kwh - offset) * price + max(0.0, float(cfg.get("base") or 0)) * days / 30.44
            if period > 0:
                cost = {
                    "period_cost": round(period, 2),
                    "annual": round(period * 365 / days, 2),
                    "basis": "meter",
                    "source": cfg.get("source"),
                    "kwh": round(kwh, 1),
                }
        return {
            "start": start.isoformat(),
            "end": today.isoformat(),
            "days": days,
            "energy": cfg,
            "money": cost,
        }

    async def async_energy_extras(self, start: date, end: date) -> dict[str, Any]:
        """Zählerstände für den Berichtszeitraum holen – nur wenn Energie-Erfassung an ist."""
        cfg = self.energy_config()
        if not cfg["enabled"] or not cfg["meter"]:
            return {"energy": cfg}
        cfg["days"] = (end - start).days + 1
        try:
            value = await self._stat_change(cfg["meter"], start, end)
            if value is not None:
                cfg["meter_value"] = value
                cfg["kwh"] = energy_kwh(value, cfg["meter_unit"], cfg["factor"])
                if (cfg["meter_unit"] or "").strip().lower().replace("³", "3") in ("m3", "m^3"):
                    cfg["m3"] = value
                cfg["price"] = self._tariff_price(cfg["tariff"], cfg["price"], cfg["factor"])
                avg = await self._tariff_average(cfg["tariff"], start, end, cfg["factor"])
                if avg is not None:
                    cfg["price"] = avg
                    cfg["price_avg"] = round(avg, 4)
                    cfg["price_source"] = "history"
                else:
                    cfg["price_source"] = "current"
            if cfg["heat_entity"]:
                heat = await self._stat_change(cfg["heat_entity"], start, end)
                if heat is not None:
                    cfg["heat_kwh"] = energy_kwh(heat, self._unit_of(cfg["heat_entity"]), 1.0)
            if cfg["pv_entity"]:
                pv = await self._stat_change(cfg["pv_entity"], start, end)
                if pv is not None:
                    pv_kwh = energy_kwh(pv, self._unit_of(cfg["pv_entity"]), 1.0)
                    cfg["pv_kwh"] = pv_kwh
                    split = pv_split(pv_kwh, cfg.get("pv_self_use"))
                    if split:
                        cfg.update(split)
        except Exception:  # noqa: BLE001 - Recorder fehlt oder Statistik noch nicht bereit
            _LOGGER.debug("Energie-Statistik für den Bericht nicht verfügbar", exc_info=True)
        return {"energy": cfg}

    def _unit_of(self, entity_id: str) -> str | None:
        state = self.hass.states.get(entity_id)
        return state.attributes.get("unit_of_measurement") if state is not None else None

    async def _stat_change(self, entity_id: str, start: date, end: date) -> float | None:
        """Summierte Änderung einer Zähler-Entität im Zeitraum [start, end]."""
        from homeassistant.components.recorder import get_instance
        from homeassistant.components.recorder.statistics import statistics_during_period

        first = dt_util.as_utc(dt_util.start_of_local_day(start))
        last = dt_util.as_utc(dt_util.start_of_local_day(end + timedelta(days=1)))
        result = await get_instance(self.hass).async_add_executor_job(
            statistics_during_period,
            self.hass,
            first,
            last,
            {entity_id},
            "hour",
            None,
            {"change"},
        )
        rows = result.get(entity_id) or []
        total = sum(float(row.get("change") or 0) for row in rows)
        return total if rows else None

    def _normalize_tariff(self, value: float, unit: str | None, factor: float) -> float:
        """Preis auf €/kWh bringen und die eingestellte Preisbasis anwenden."""
        unit = str(unit or "").lower().replace("³", "3")
        if "ct" in unit or "cent" in unit:
            value /= 100
        elif "/mwh" in unit:
            value /= 1000
        elif "/m3" in unit or "/m^3" in unit:
            value /= factor or 10.0
        basis = str(self.hub.opt(CONF_ENERGY_PRICE_BASIS) or "gross")
        vat = float(self.hub.opt(CONF_ENERGY_VAT) or 0)
        extra = float(self.hub.opt(CONF_ENERGY_EXTRA_FEE) or 0)
        if basis == "net":
            value = value * (1 + vat / 100) + extra
        else:
            value = value + extra
        return round(value, 4) if value > 0 else 0.0

    def _tariff_price(self, entity_id: str | None, fallback: float, factor: float) -> float:
        """Tarif-Entität lesen und auf €/kWh normalisieren."""
        state = self.hass.states.get(entity_id) if entity_id else None
        if state is None:
            return fallback
        try:
            value = float(state.state)
        except (TypeError, ValueError):
            return fallback
        unit = state.attributes.get("unit_of_measurement")
        return self._normalize_tariff(value, unit, factor) or fallback

    async def _tariff_average(self, entity_id: str | None, start: date, end: date, factor: float) -> float | None:
        """Durchschnittspreis aus der Statistik – für dynamische Tarife."""
        if not entity_id:
            return None
        from homeassistant.components.recorder import get_instance
        from homeassistant.components.recorder.statistics import statistics_during_period

        first = dt_util.as_utc(dt_util.start_of_local_day(start))
        last = dt_util.as_utc(dt_util.start_of_local_day(end + timedelta(days=1)))
        result = await get_instance(self.hass).async_add_executor_job(
            statistics_during_period,
            self.hass,
            first,
            last,
            {entity_id},
            "hour",
            None,
            {"mean"},
        )
        rows = result.get(entity_id) or []
        values = [float(row["mean"]) for row in rows if row.get("mean") is not None]
        if not values:
            return None
        unit = self._unit_of(entity_id)
        return self._normalize_tariff(sum(values) / len(values), unit, factor)

    def report_extras(self) -> dict[str, Any]:
        """Live-Werte für den PDF-Bericht: Raumtypen, Aufheizzeiten, Batterien, Heizkosten."""
        short = self.short_names()
        extras: dict[str, Any] = {
            "room_types": {},
            "heatup": {},
            "batteries": {},
            "annual_cost": self.hub.opt("annual_cost"),
            "energy": self.energy_config(),
        }
        outdoor = self.hub.outdoor_temp()
        for eid, room in self.hub.rooms.items():
            name = short.get(eid, room.name)
            extras["room_types"][name] = room.config.get("room_type")
            minutes = room.heatup.minutes_needed(2.0, outdoor)
            if minutes is not None:
                extras["heatup"][name] = minutes
            levels = {}
            for dev, entity in room._batteries.items():
                st = self.hass.states.get(entity)
                try:
                    levels[dev] = float(st.state) if st else None
                except ValueError:
                    continue
            levels = {k: v for k, v in levels.items() if v is not None}
            if levels:
                extras["batteries"][name] = levels
        return extras

    def report(self, today: date | None = None) -> dict[str, Any]:
        """Woche, Vorwoche, Monat, Vormonat und Tageswerte der letzten 31 Tage."""
        today = today or dt_util.now().date()
        rooms = self.rooms_by_name()
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
                    "rooms": {
                        n: {
                            "heating_h": r["heating_h"],
                            "valve_h": r["valve_h"],
                            "valve_calc_h": r["valve_calc_h"],
                            "deficit_kh": r["deficit_kh"],
                            "setback_h": r["setback_h"],
                        }
                        for n, r in s["rooms"].items()
                    },
                }
            )
        first = min((k for days in rooms.values() for k in days), default=None)
        return {
            "metric": self.report_metric(month),
            "since": first,
            "week": week,
            "prev_week": prev_week,
            "week_change": compare(week, prev_week),
            "month": month,
            "prev_month": prev_month,
            "month_change": compare(month, prev_month),
            "daily": daily,
        }

    def report_metric(self, summary: dict[str, Any]) -> str:
        """Womit der Bericht die Wärmemenge misst.

        ``auto`` nimmt die Ventilstellung nur, wenn **jeder** Raum mit Daten sie meldet –
        gemischt wäre der Balkenvergleich wertlos. Sonst Gradstunden (gemessen, nicht geschätzt).
        """
        want = (self.hub.opt(CONF_REPORT_METRIC) if self.hub else None) or REPORT_METRIC_DEFAULT
        if want in ("valve", "deficit", "hours"):
            return want
        rooms = (summary.get("rooms") or {}).values()
        used = [r for r in rooms if r.get("hours", 0) >= 1]
        if used and all(r.get("has_valve") for r in used):
            return "valve"
        # Gradstunden sind ehrlich, aber bei gut eingestellten Räumen immer 0 – dann wäre der
        # Bericht leer. Erst wenn es echten Wärmemangel gab, danach zählen; sonst Heizstunden.
        deficit = sum(float(r.get("deficit_kh") or 0.0) for r in used)
        return "deficit" if deficit >= 0.5 else "hours"

    def export_csv(self, days: int | None = None, today: date | None = None) -> str:
        """Tageswerte je Raum als CSV (für Tabellenkalkulation)."""
        today = today or dt_util.now().date()
        rooms = self.rooms_by_name()
        first = min((k for d in rooms.values() for k in d), default=today.isoformat())
        start = date.fromisoformat(first)
        if days:
            start = max(start, today - timedelta(days=days - 1))
        return rows_to_csv(export_rows(rooms, self.data["home"], start, today))

    @callback
    def _on_weekly(self, now: datetime) -> None:
        local = dt_util.as_local(now)
        if local.weekday() != 6:
            return
        today = local.date()
        start = today - timedelta(days=6)
        rooms = self.rooms_by_name()
        cur = summarize(rooms, self.data["home"], start, today)
        if cur["total"]["hours"] < 24:
            return  # noch zu wenige Daten
        prev = summarize(rooms, self.data["home"], start - timedelta(days=7), start - timedelta(days=1))
        short = week_message(cur, compare(cur, prev))
        self.hass.async_create_task(self._weekly(today, short))

    async def _weekly(self, today: date, short: str) -> None:
        """Wochenbericht als PDF mit Link – sonst wie bisher nur die Kurzfassung."""
        if not await self.hub.pdf.async_weekly(today, short):
            self.hub.notify(KIND_REPORT, tr("📊 Heizung diese Woche"), short, speak=False)

    @callback
    def _on_daily(self, now: datetime) -> None:
        self.hass.async_create_task(self.hub.pdf.async_scheduled(now))
