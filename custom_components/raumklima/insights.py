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
    CONF_ENERGY_BASE_SHARE,
    CONF_ENERGY_BATT_IN,
    CONF_ENERGY_BATT_OUT,
    CONF_ENERGY_CHEAP_PRICE,
    CONF_ENERGY_CMP_GAS,
    CONF_ENERGY_CMP_OIL,
    CONF_ENERGY_CMP_POWER,
    CONF_ENERGY_EFFICIENCY,
    CONF_ENERGY_ENABLED,
    CONF_ENERGY_EXTRA_FEE,
    CONF_ENERGY_FACTOR,
    CONF_ENERGY_FEED,
    CONF_ENERGY_GRID,
    CONF_ENERGY_HEAT_ELEC,
    CONF_ENERGY_HEAT_ENTITY,
    CONF_ENERGY_HOUSE,
    CONF_ENERGY_METER,
    CONF_ENERGY_METER_SCOPE,
    CONF_ENERGY_OIL_FACTOR,
    CONF_ENERGY_OIL_MARKET,
    CONF_ENERGY_OIL_PRICE,
    CONF_ENERGY_OIL_PRICE_HISTORY,
    CONF_ENERGY_OIL_WINTER_DAYS,
    CONF_ENERGY_OIL_WINTER_LITERS,
    CONF_ENERGY_PREHEAT_CHEAP,
    CONF_ENERGY_PRICE,
    CONF_ENERGY_PRICE_BASIS,
    CONF_ENERGY_SOURCE,
    CONF_ENERGY_TANK_CAPACITY,
    CONF_ENERGY_TANK_ENTITY,
    CONF_ENERGY_TANK_MIN,
    CONF_ENERGY_TARIFF,
    CONF_ENERGY_TARIFF_DYNAMIC,
    CONF_ENERGY_TARIFF_FALLBACKS,
    CONF_ENERGY_VAT,
    CONF_ENERGY_WW_HEAT,
    CONF_ENERGY_WW_METER,
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
from .energy_calc import (
    battery_shares,
    heat_prices,
    heating_curve,
    hourly_cost,
    parse_forecast,
    ratio,
    self_share,
    shift_potential,
    short_label,
    split_total,
    step_means,
    tariff_to_kwh,
    week_grid,
)
from .health import SEV_INFO, Issue, check_connection, check_notify_targets, check_presence_residents
from .msg import tr
from .oil_tank import price_per_litre, tank_summary
from .report_extra import energy_kwh, metric_value, money, pv_split
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
        unit = str(attrs.get("unit_of_measurement") or "").strip().lower().replace("³", "3")
        source = str(self.hub.opt(CONF_ENERGY_SOURCE) or "auto")
        if source == "auto":
            if attrs.get("device_class") == "gas":
                source = "gas"
            elif unit in ("l", "liter", "liters", "litre", "litres"):
                source = "oil"
            else:
                source = "electric"
        tank = self.hub.opt(CONF_ENERGY_TANK_ENTITY)
        tank_state = self.hass.states.get(tank) if tank else None
        market = self.hub.opt(CONF_ENERGY_OIL_MARKET)
        market_state = self.hass.states.get(market) if market else None
        winter_liters = float(self.hub.opt(CONF_ENERGY_OIL_WINTER_LITERS) or 0)
        winter_days = int(self.hub.opt(CONF_ENERGY_OIL_WINTER_DAYS) or 0)
        price_history = list(self.hub.opt(CONF_ENERGY_OIL_PRICE_HISTORY) or [])
        prices = [float(item.get("price") or 0) for item in price_history if isinstance(item, dict)]
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
            "oil_price": float(self.hub.opt(CONF_ENERGY_OIL_PRICE) or 0),
            "oil_factor": float(self.hub.opt(CONF_ENERGY_OIL_FACTOR) or 10),
            "tank_entity": tank,
            "tank_unit": tank_state.attributes.get("unit_of_measurement") if tank_state is not None else None,
            "tank_capacity": float(self.hub.opt(CONF_ENERGY_TANK_CAPACITY) or 0),
            "tank_min": float(self.hub.opt(CONF_ENERGY_TANK_MIN) or 20),
            "winter_liters": winter_liters,
            "winter_days": winter_days,
            "winter_avg_l_day": winter_liters / winter_days if winter_days > 0 and winter_liters > 0 else None,
            "oil_price_history": price_history[-6:],
            "oil_price_avg": round(sum(prices) / len(prices), 2) if prices else None,
            "oil_market_entity": market,
            "oil_market_unit": market_state.attributes.get("unit_of_measurement") if market_state is not None else None,
            "pv_entity": self.hub.opt(CONF_PV_ENTITY),
            "pv_self_use": float(self.hub.opt(CONF_PV_SELF_USE) or 0),
            "source_set": str(self.hub.opt(CONF_ENERGY_SOURCE) or "auto") != "auto",
            "ww_meter": self.hub.opt(CONF_ENERGY_WW_METER),
            "ww_heat_entity": self.hub.opt(CONF_ENERGY_WW_HEAT),
            "tariff_fallbacks": list(self.hub.opt(CONF_ENERGY_TARIFF_FALLBACKS) or []),
            "house_entity": self.hub.opt(CONF_ENERGY_HOUSE),
            "grid_entity": self.hub.opt(CONF_ENERGY_GRID),
            "base_share": str(self.hub.opt(CONF_ENERGY_BASE_SHARE) or "full"),
            "meter_scope": str(self.hub.opt(CONF_ENERGY_METER_SCOPE) or "heating"),
            "batt_in_entity": self.hub.opt(CONF_ENERGY_BATT_IN),
            "batt_out_entity": self.hub.opt(CONF_ENERGY_BATT_OUT),
            "feed_entity": self.hub.opt(CONF_ENERGY_FEED),
            "heat_elec_entity": self.hub.opt(CONF_ENERGY_HEAT_ELEC),
            "compare_gas": float(self.hub.opt(CONF_ENERGY_CMP_GAS) or 0.11),
            "compare_oil": float(self.hub.opt(CONF_ENERGY_CMP_OIL) or 1.10),
            "compare_power": float(self.hub.opt(CONF_ENERGY_CMP_POWER) or 0.30),
            "price_now": self.hub.energy_price_now(),
            "tariffs": self._tariff_list(),
        }

    def _tariff_list(self) -> list[dict[str, Any]]:
        """Alle Preisquellen mit aktuellem Preis – die erste mit Wert ist die genutzte."""
        out: list[dict[str, Any]] = []
        used = False
        for i, eid in enumerate(self.hub.tariff_entities()):
            state = self.hass.states.get(eid)
            value = self.hub.tariff_value(eid)
            active = value is not None and not used
            used = used or value is not None
            out.append({
                "entity": eid,
                "name": self._source_label(eid),
                "value": value,
                "primary": i == 0,
                "active": active,
                "forecast": len(parse_forecast(state.attributes)) if state is not None else 0,
            })
        return out

    def _source_label(self, entity_id: str) -> str:
        """Kurzer Name einer Preisquelle: ohne Kennungs-Ziffern, mit dem Namen der Integration.

        Aus „Heartbeat … Electricity Price 0323a81a-…“ wird „Heartbeat … Electricity Price“,
        und dreimal „EPEX Spot Data Total Price“ wird zu „… · Energy-Charts.info (DE-LU)“ usw.
        """
        from homeassistant.helpers import entity_registry as er

        state = self.hass.states.get(entity_id)
        name = state.name if state is not None else entity_id
        title = None
        entry = er.async_get(self.hass).async_get(entity_id)
        if entry is not None and entry.config_entry_id:
            ce = self.hass.config_entries.async_get_entry(entry.config_entry_id)
            title = ce.title if ce is not None else None
        return short_label(name, title)

    def price_forecast(self, hours: int = 36) -> list[dict[str, Any]]:
        """Preisvorschau der ersten Quelle, die eine liefert – in €/kWh brutto."""
        now = dt_util.utcnow()
        for eid in self.hub.tariff_entities():
            state = self.hass.states.get(eid)
            if state is None:
                continue
            points = parse_forecast(state.attributes)
            if not points:
                continue
            unit = state.attributes.get("unit_of_measurement")
            out = []
            for start, value in points:
                if start < now - timedelta(hours=1) or start > now + timedelta(hours=hours):
                    continue
                out.append({"t": start.isoformat(), "p": self._normalize_tariff(value, unit, 10.0)})
            if out:
                return out
        return []

    async def async_energy_summary(self, days: int = 30) -> dict[str, Any]:
        """Energie für das Dashboard: Zeitraum, Zählerwerte und Euro-Schätzung."""
        today = dt_util.now().date()
        days = max(1, min(int(days), 365))
        start = today - timedelta(days=days - 1)
        asked = days
        # Erst ab dem ersten Messwert rechnen – sonst zählt z. B. „365 Tage“ zwölf Grundgebühren,
        # obwohl der Zähler erst seit zwei Monaten aufzeichnet.
        meter = self.hub.opt(CONF_ENERGY_METER) if self.hub is not None else None
        first = await self._first_data_day(meter, start, today) if meter else None
        if first is not None and first > start:
            start = first
            days = (today - start).days + 1
        cfg = (await self.async_energy_extras(start, today))["energy"]
        cfg["days"] = days
        cfg["days_asked"] = asked
        cfg["data_from"] = first.isoformat() if first is not None else None
        cur = summarize(self.rooms_by_name(), self.data["home"], start, today)
        annual = self.hub.opt("annual_cost") if self.hub is not None else None
        cost = money(cur, annual, cfg)
        if cost is None and cfg.get("kwh") and cfg.get("price"):
            # zu wenige Heiztage für eine Hochrechnung: nur die Kosten des Zeitraums
            warm = money({**cur, "hdd": max(cur["hdd"], 3.0)}, None, cfg)
            if warm is not None:
                cost = {**warm, "annual": None, "per_degree_year": None, "saved": None}
        if cost is not None and cost.get("period_cost"):
            cost["per_day"] = round(cost["period_cost"] / days, 2)
            cost["rooms"] = self._room_costs(cur, cost["period_cost"], cfg)
        if cost is not None and not cfg.get("meter") and cfg.get("tank"):
            cost["basis"] = "tank"
        if cost is not None and cost.get("period_cost"):
            cost["parts"] = self._cost_parts(cfg, cost)
            if cost.get("annual") is None and cfg.get("meter"):
                annual = await self._annual_from_meter(cfg, cost, today, days)
                if annual is not None:
                    cost["annual"] = annual
                    cost["annual_basis"] = "12m"
        return {
            "start": start.isoformat(),
            "end": today.isoformat(),
            "days": days,
            "days_asked": asked,
            "data_from": cfg["data_from"],
            "energy": cfg,
            "money": cost,
            "forecast": self.price_forecast() if cfg.get("enabled") else [],
        }

    def _cost_parts(self, cfg: dict[str, Any], cost: dict[str, Any]) -> dict[str, Any]:
        """Wohin das Geld ging: Heizung, Warmwasser, Grundgebühr – und was PV/Akku erspart haben."""
        period = float(cost["period_cost"])
        energy = cfg.get("cost_energy")
        kwh = float(cfg.get("kwh") or 0)
        ww = float(cfg.get("ww_kwh") or 0)
        used = kwh + ww
        if energy is None:
            energy = period - float(cost.get("base") or 0) if cost.get("base") is not None else None
        out: dict[str, Any] = {"heat": None, "ww": None, "base": None, "pv_saved": None}
        if energy is not None:
            energy = float(energy)
            ww_part = energy * ww / used if used > 0 else 0.0
            out["heat"] = round(energy - ww_part, 2)
            out["ww"] = round(ww_part, 2) if ww > 0 else None
            out["base"] = round(max(0.0, period - energy), 2)
        free = cfg.get("self_kwh")
        ref = cfg.get("price_avg") or cfg.get("price_paid") or cfg.get("price")
        if free and ref:
            out["pv_saved"] = round(float(free) * float(ref), 2)
        return out

    async def _annual_from_meter(self, cfg: dict[str, Any], cost: dict[str, Any], today: date, days: int) -> float | None:
        """Jahreskosten aus den letzten zwölf Monaten des Zählers – wenn er so lange misst.

        Hilft, wenn die Außentemperatur für eine Hochrechnung nach Gradtagen noch fehlt.
        """
        meter = cfg["meter"]
        year_start = today - timedelta(days=364)
        first = await self._first_data_day(meter, year_start, today)
        if first is None or (first - year_start).days > 35:
            return None
        value = await self._stat_change(meter, year_start, today)
        if value is None:
            return None
        factor = cfg["oil_factor"] if cfg["source"] == "oil" else cfg["factor"]
        year_kwh = energy_kwh(value, cfg["meter_unit"], factor, cfg["source"])
        if not year_kwh:
            return None
        period_kwh = float(cfg.get("kwh_total") or ((cfg.get("kwh") or 0) + (cfg.get("ww_kwh") or 0)))
        energy = cfg.get("cost_energy")
        if energy is None or period_kwh <= 0:
            return None
        if cfg.get("meter_scope") != "total" and cfg.get("ww_kwh"):
            year_kwh += float(cfg["ww_kwh"]) * 365 / max(days, 1)  # Warmwasser-Zähler eigens, grob aufs Jahr
        base_part = max(0.0, float(cost["period_cost"]) - float(energy))
        return round(year_kwh * float(energy) / period_kwh + base_part * 365 / max(days, 1), 2)

    def _room_costs(self, cur: dict[str, Any], period_cost: float, cfg: dict[str, Any]) -> list[dict[str, Any]]:
        """Heizkosten je Raum: nach Ventilöffnung × Stunden (bzw. der Bericht-Kennzahl)."""
        kwh = float(cfg.get("kwh") or 0)
        ww = float(cfg.get("ww_kwh") or 0)
        heat_part = kwh / (kwh + ww) if kwh + ww > 0 else 1.0
        metric = self.report_metric(cur)
        values = {name: metric_value(r, metric) for name, r in cur["rooms"].items()}
        total = sum(values.values())
        if total <= 0:
            return []
        heat_cost = period_cost * heat_part
        return sorted(
            (
                {"name": name, "share": round(100 * v / total, 1), "cost": round(heat_cost * v / total, 2), "value": round(v, 1), "metric": metric}
                for name, v in values.items()
                if v > 0
            ),
            key=lambda r: -r["share"],
        )

    async def async_energy_extras(self, start: date, end: date) -> dict[str, Any]:
        """Zählerstände und Öltank für den Berichtszeitraum holen."""
        cfg = self.energy_config()
        if not cfg["enabled"] or (not cfg["meter"] and not cfg["tank_entity"] and not cfg["oil_market_entity"]):
            return {"energy": cfg}
        cfg["days"] = (end - start).days + 1
        if cfg["source"] == "oil":
            cfg["price"] = self._oil_price_kwh(cfg)
        try:
            tank = await self._tank_summary(cfg["tank_entity"], cfg)
            if tank is not None:
                cfg["tank"] = tank
            market = await self._market_summary(cfg)
            if market is not None:
                cfg["oil_market"] = market
            if cfg["meter"]:
                value = await self._stat_change(cfg["meter"], start, end)
                if value is not None:
                    cfg["meter_value"] = value
                    factor = cfg["oil_factor"] if cfg["source"] == "oil" else cfg["factor"]
                    cfg["kwh"] = energy_kwh(value, cfg["meter_unit"], factor, cfg["source"])
                    unit = (cfg["meter_unit"] or "").strip().lower().replace("³", "3")
                    if unit in ("m3", "m^3"):
                        cfg["m3"] = value
                    if cfg["source"] == "oil":
                        if unit in ("l", "liter", "liters", "litre", "litres"):
                            cfg["liter"] = value
                        elif unit in ("m3", "m^3"):
                            cfg["liter"] = value * 1000.0
                    t_factor = cfg["oil_factor"] if cfg["source"] == "oil" else cfg["factor"]
                    cfg["price"] = self._tariff_price(cfg["tariff"], cfg["price"], t_factor)
                    avg = await self._tariff_average(cfg["tariff"], start, end, t_factor)
                    if avg is not None:
                        cfg["price"] = avg
                        cfg["price_avg"] = round(avg, 4)
                        cfg["price_source"] = "history"
                    else:
                        cfg["price_source"] = "current"
            elif tank is not None and tank.get("consumed_l") is not None:
                cfg["liter"] = tank["consumed_l"]
                cfg["kwh"] = tank.get("consumed_kwh")
                cfg["price_source"] = "tank"
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
            await self._energy_more(cfg, start, end)
        except Exception:
            _LOGGER.debug("Energie-Statistik für den Bericht nicht verfügbar", exc_info=True)
        return {"energy": cfg}

    async def _energy_more(self, cfg: dict[str, Any], start: date, end: date) -> None:
        """Warmwasser, Hausstrom, Arbeitszahl und Kosten Stunde für Stunde."""
        factor = cfg["oil_factor"] if cfg["source"] == "oil" else cfg["factor"]

        async def kwh_of(entity: str | None, src: str | None = None) -> float | None:
            if not entity:
                return None
            value = await self._stat_change(entity, start, end)
            return energy_kwh(value, self._unit_of(entity), factor, src) if value is not None else None

        async def kwh_since(entity: str, first: date, src: str | None = None) -> float | None:
            value = await self._stat_change(entity, first, end)
            return energy_kwh(value, self._unit_of(entity), factor, src) if value is not None else None

        async def later_start(entity: str | None) -> date | None:
            """Erster Messtag, falls ein Zähler erst nach dem Zeitraumbeginn aufzeichnet."""
            first = await self._first_data_day(entity, start, end) if entity else None
            return first if first is not None and first > start else None

        cfg["ww_kwh"] = await kwh_of(cfg.get("ww_meter"), cfg["source"])
        ww_measured = cfg.get("ww_kwh")
        total_scope = cfg.get("meter_scope") == "total" and cfg.get("kwh") is not None and bool(cfg.get("meter"))
        ww_share: float | None = None
        if total_scope:
            # Zähler misst Heizung + Warmwasser: Warmwasser-Zähler teilt nur auf, zählt nicht dazu.
            # Zeichnet er erst später auf, gilt sein Anteil aus der gemeinsamen Zeit für den ganzen Zeitraum.
            total = float(cfg["kwh"])
            ww_est = cfg.get("ww_kwh")
            ww_from = await later_start(cfg.get("ww_meter"))
            if ww_from is not None and ww_est is not None:
                both = await kwh_since(cfg["meter"], ww_from, cfg["source"])
                if both and both > 0:
                    ww_share = max(0.0, min(1.0, float(ww_est) / both))
                    ww_est = total * ww_share
                    cfg["ww_from"] = ww_from.isoformat()
            elif ww_est is not None and total > 0:
                ww_share = max(0.0, min(1.0, float(ww_est) / total))
            heat, ww = split_total(total, ww_est)
            cfg["kwh_total"] = round(total, 2)
            cfg["kwh"] = heat
            cfg["ww_kwh"] = ww
        cfg["ww_heat_kwh"] = await kwh_of(cfg.get("ww_heat_entity"))
        cfg["house_kwh"] = await kwh_of(cfg.get("house_entity"))
        cfg["grid_kwh"] = await kwh_of(cfg.get("grid_entity"))
        if cfg["source"] == "heatpump":
            heat_in = cfg.get("kwh")
            heat_from = await later_start(cfg.get("heat_entity")) if cfg.get("meter") else None
            if heat_from is not None:
                # Wärmemenge erst seit später: Arbeitszahl nur über die gemeinsame Zeit
                part = await kwh_since(cfg["meter"], heat_from, cfg["source"])
                if part is not None and total_scope and ww_share is not None:
                    part *= 1 - ww_share
                heat_in = part
                cfg["cop_from"] = heat_from.isoformat()
            cfg["cop"] = ratio(cfg.get("heat_kwh"), heat_in)
            cfg["cop_ww"] = ratio(cfg.get("ww_heat_kwh"), ww_measured if total_scope else cfg.get("ww_kwh"))
            if cfg.get("heat_elec_entity"):
                # Zweite Sicht: Strom fürs Heizen, wie die Wärmepumpe ihn selbst zählt
                if heat_from is not None:
                    vendor = await kwh_since(cfg["heat_elec_entity"], heat_from)
                else:
                    vendor = await kwh_of(cfg["heat_elec_entity"])
                cfg["heat_elec_kwh"] = round(vendor, 2) if vendor is not None else None
                cfg["cop_vendor"] = ratio(cfg.get("heat_kwh"), vendor)
        used = (cfg.get("kwh") or 0) + (cfg.get("ww_kwh") or 0)
        if cfg.get("house_kwh") and cfg["source"] in ("electric", "heatpump") and used:
            cfg["house_share"] = round(100 * used / cfg["house_kwh"], 1)
        cfg["feed_kwh"] = await kwh_of(cfg.get("feed_entity"))
        cfg["batt_in_kwh"] = await kwh_of(cfg.get("batt_in_entity"))
        cfg["batt_out_kwh"] = await kwh_of(cfg.get("batt_out_entity"))
        if not cfg.get("meter"):
            return
        hours = await self._energy_hours(cfg, start, end, factor)
        if not hours:
            return
        result = hourly_cost(hours, float(cfg.get("price") or 0))
        daily = result.pop("daily")
        priced = any(h.get("price") is not None for h in hours)
        electric = cfg["source"] in ("electric", "heatpump")
        if priced or any(h.get("self") for h in hours):
            cfg["cost_energy"] = result["cost"]
            cfg["price_paid"] = result["price_paid"]
            cfg["cheap_share"] = result["cheap_share"] if electric and cfg.get("tariff_dynamic") else None
            cfg["self_kwh"] = result["self_kwh"]
            cfg["batt_kwh"] = result["batt_kwh"]
            cfg["billed_kwh"] = result["billed_kwh"]
            if result["price_avg"] is not None:
                cfg["price_avg"] = result["price_avg"]
        if priced:
            cfg["week"] = week_grid(hours)
            if electric and cfg.get("tariff_dynamic"):
                cfg["shift_eur"] = shift_potential(hours)
                if result["price_avg"] is not None and result["price_paid"] is not None:
                    paid_kwh = result["billed_kwh"] + result["batt_kwh"]
                    cfg["tariff_saving"] = round((result["price_avg"] - result["price_paid"]) * paid_kwh, 2)
        home = self.data["home"]
        outdoor_more = await self._outdoor_days(start, end)
        series = []
        day = start
        while day <= end:
            key = day.isoformat()
            vals = daily.get(key, {})
            h = home.get(key) or {}
            n = h.get("outdoor_n_s") or 0
            outdoor = round(h["outdoor_s"] / n, 1) if n else outdoor_more.get(key)
            day_kwh, day_ww = vals.get("kwh", 0.0), vals.get("ww", 0.0)
            if total_scope and cfg.get("kwh_total"):
                share = float(cfg.get("ww_kwh") or 0) / float(cfg["kwh_total"])
                day_kwh, day_ww = round(day_kwh * (1 - share), 2), round(day_kwh * share, 2)
            series.append({
                "date": key,
                "kwh": day_kwh,
                "ww": day_ww,
                "cost": vals.get("cost", 0.0),
                "outdoor": outdoor,
            })
            day += timedelta(days=1)
        cfg["daily"] = series
        # Für die Hochrechnung: an wie vielen Tagen die Außentemperatur bekannt ist
        cfg["outdoor_days"] = sum(1 for d in series if d["outdoor"] is not None)
        cfg["curve"] = heating_curve(d for d in series if d["date"] != end.isoformat())
        self._heat_prices(cfg)

    def _heat_prices(self, cfg: dict[str, Any]) -> None:
        """Was kostet 1 kWh Wärme – eigene Heizung und Vergleich."""
        source = cfg["source"]
        kwh = float(cfg.get("kwh") or 0)
        ww = float(cfg.get("ww_kwh") or 0)
        used = kwh + ww
        eff_price = cfg["cost_energy"] / used if cfg.get("cost_energy") is not None and used > 0 else cfg.get("price")
        paid = cfg.get("price_paid") or cfg.get("price")
        own = grid_only = None
        if source == "heatpump":
            cop, cop_ww = cfg.get("cop") or cfg.get("efficiency") or None, cfg.get("cop_ww") or cfg.get("cop")
            if cop and used > 0:
                mix = (kwh * cop + ww * (cop_ww or cop)) / used
                own = eff_price / mix if eff_price else None
                grid_only = paid / mix if paid else None
        elif source == "electric":
            own, grid_only = eff_price, paid
        elif source in ("gas", "oil"):
            own = eff_price / 0.9 if eff_price else None
        elif source == "district":
            own = eff_price
        cfg["heat_prices"] = heat_prices(
            source, own, grid_only,
            float(cfg.get("compare_gas") or 0), float(cfg.get("compare_oil") or 0), float(cfg.get("compare_power") or 0),
            cop_guess=3.5,
        )

    async def _outdoor_days(self, start: date, end: date) -> dict[str, float]:
        """Tagesmittel der Außentemperatur aus der Statistik der eigenen Wetterstation (falls gewählt).

        Raumklima speichert die Außentemperatur erst, seit es läuft – für ältere Tage hilft die
        Langzeitstatistik eines Außenfühlers (Heizkennlinie, Hochrechnung).
        """
        entity = self.hub.opt("outdoor_temp_entity") if self.hub is not None else None
        if not entity:
            return {}
        from homeassistant.components.recorder import get_instance
        from homeassistant.components.recorder.statistics import statistics_during_period

        first = dt_util.as_utc(dt_util.start_of_local_day(start))
        last = dt_util.as_utc(dt_util.start_of_local_day(end + timedelta(days=1)))
        try:
            result = await get_instance(self.hass).async_add_executor_job(
                statistics_during_period, self.hass, first, last, {entity}, "day", None, {"mean"},
            )
        except Exception:  # noqa: BLE001 – dann eben nur Raumklimas eigene Werte
            return {}
        out: dict[str, float] = {}
        for row in result.get(entity) or []:
            value, stamp = row.get("mean"), row.get("start")
            if value is None or stamp is None:
                continue
            if not isinstance(stamp, datetime):
                stamp = dt_util.utc_from_timestamp(float(stamp))
            out[dt_util.as_local(stamp).date().isoformat()] = round(float(value), 1)
        return out

    async def _energy_hours(self, cfg: dict[str, Any], start: date, end: date, factor: float) -> list[dict[str, Any]]:
        """Stundenwerte: Verbrauch Heizung/Warmwasser, Preis, Anteil aus PV/Batterie."""
        meter = await self._stat_rows(cfg["meter"], start, end, "change")
        if not meter:
            return []
        total_scope = cfg.get("meter_scope") == "total"
        ww = (
            await self._stat_rows(cfg.get("ww_meter"), start, end, "change")
            if cfg.get("ww_meter") and not total_scope
            else {}
        )
        electric = cfg["source"] in ("electric", "heatpump")
        house = grid = charge = discharge = {}
        if electric and cfg.get("house_entity") and cfg.get("grid_entity"):
            house = await self._stat_rows(cfg["house_entity"], start, end, "change")
            grid = await self._stat_rows(cfg["grid_entity"], start, end, "change")
            if cfg.get("batt_in_entity") and cfg.get("batt_out_entity"):
                charge = await self._stat_rows(cfg["batt_in_entity"], start, end, "change")
                discharge = await self._stat_rows(cfg["batt_out_entity"], start, end, "change")
        keys = sorted(set(meter) | set(ww))
        price_keys = sorted(set(keys) | set(charge))
        prices: list[dict[float, float]] = []
        for eid in self.hub.tariff_entities():
            prices.append(await self._price_hours(eid, price_keys, factor))
        unit_m = self._unit_of(cfg["meter"])
        unit_w = self._unit_of(cfg["ww_meter"]) if cfg.get("ww_meter") else None
        unit_h = self._unit_of(cfg["house_entity"]) if house else None
        unit_g = self._unit_of(cfg["grid_entity"]) if grid else None
        unit_c = self._unit_of(cfg["batt_in_entity"]) if charge else None
        unit_d = self._unit_of(cfg["batt_out_entity"]) if discharge else None

        def price_at(ts: float) -> float | None:
            return next((p[ts] for p in prices if ts in p), None)

        batt_rows: dict[float, dict[str, Any]] = {}
        if charge or discharge:
            # Akku: auch Stunden ohne Wärmepumpe zählen, denn dort wird geladen
            for ts in sorted(set(house) & set(grid)):
                batt_rows[ts] = {
                    "ts": ts,
                    "house": energy_kwh(house[ts], unit_h, 1.0),
                    "grid": energy_kwh(grid[ts], unit_g, 1.0),
                    "charge": energy_kwh(charge.get(ts, 0.0), unit_c, 1.0) or 0.0,
                    "discharge": energy_kwh(discharge.get(ts, 0.0), unit_d, 1.0) or 0.0,
                    "price": price_at(ts),
                }
            cfg["batt"] = battery_shares(list(batt_rows.values()))
        rows = []
        for ts in keys:
            share = batt = batt_price = None
            if ts in batt_rows:
                share, batt, batt_price = batt_rows[ts]["self"], batt_rows[ts]["batt"], batt_rows[ts]["batt_price"]
            elif ts in house and ts in grid:
                share = self_share(energy_kwh(house[ts], unit_h, 1.0), energy_kwh(grid[ts], unit_g, 1.0))
            local = dt_util.as_local(dt_util.utc_from_timestamp(ts))
            rows.append({
                "ts": ts,
                "day": local.date().isoformat(),
                "local": local,
                "kwh": energy_kwh(meter.get(ts, 0.0), unit_m, factor, cfg["source"]) or 0.0,
                "ww": energy_kwh(ww.get(ts, 0.0), unit_w, factor, cfg["source"]) or 0.0,
                "price": price_at(ts),
                "self": share,
                "batt": batt,
                "batt_price": batt_price,
            })
        return rows

    async def _stat_rows(self, entity_id: str | None, start: date, end: date, kind: str) -> dict[float, float]:
        """Stundenwerte einer Entität aus der Langzeitstatistik: {Zeitstempel: Wert}."""
        if not entity_id:
            return {}
        from homeassistant.components.recorder import get_instance
        from homeassistant.components.recorder.statistics import statistics_during_period

        first = dt_util.as_utc(dt_util.start_of_local_day(start))
        last = dt_util.as_utc(dt_util.start_of_local_day(end + timedelta(days=1)))
        try:
            result = await get_instance(self.hass).async_add_executor_job(
                statistics_during_period, self.hass, first, last, {entity_id}, "hour", None, {kind},
            )
        except Exception:  # noqa: BLE001 – ohne Statistik keine Stundenwerte
            return {}
        out: dict[float, float] = {}
        for row in result.get(entity_id) or []:
            value, stamp = row.get(kind), row.get("start")
            if value is None or stamp is None:
                continue
            if isinstance(stamp, datetime):
                stamp = stamp.timestamp()
            out[float(stamp)] = float(value)
        return out

    async def _price_hours(self, entity_id: str, keys: list[float], factor: float) -> dict[float, float]:
        """Preis je Stunde in €/kWh brutto – aus der Statistik, sonst aus dem Verlauf."""
        if not keys:
            return {}
        start = dt_util.as_local(dt_util.utc_from_timestamp(keys[0])).date()
        end = dt_util.as_local(dt_util.utc_from_timestamp(keys[-1])).date()
        unit = self._unit_of(entity_id)
        means = await self._stat_rows(entity_id, start, end, "mean")
        missing = [k for k in keys if k not in means]
        if missing:
            means.update(await self._history_means(entity_id, missing))
        return {k: self._normalize_tariff(v, unit, factor) for k, v in means.items() if k in set(keys) and v > 0}

    async def _history_means(self, entity_id: str, keys: list[float]) -> dict[float, float]:
        """Preis-Sensoren ohne Statistik (z. B. ohne state_class): Mittel aus dem Verlauf."""
        from homeassistant.components.recorder import get_instance
        from homeassistant.components.recorder.history import state_changes_during_period

        first = dt_util.utc_from_timestamp(keys[0]) - timedelta(hours=1)
        last = dt_util.utc_from_timestamp(keys[-1] + 3600)
        try:
            result = await get_instance(self.hass).async_add_executor_job(
                lambda: state_changes_during_period(
                    self.hass, first, last, entity_id, include_start_time_state=True,
                )
            )
        except Exception:  # noqa: BLE001 – ohne Verlauf bleibt die Reserve-Quelle
            return {}
        points = []
        for st in result.get(entity_id) or []:
            try:
                points.append((st.last_changed.timestamp(), float(st.state)))
            except (TypeError, ValueError, AttributeError):
                continue
        return step_means(points, keys)

    async def _market_summary(self, cfg: dict[str, Any]) -> dict[str, Any] | None:
        """Marktpreis der optionalen Preis-Entität und der 30-Tage-Vergleich."""
        entity = cfg.get("oil_market_entity")
        if not entity:
            return None
        state = self.hass.states.get(entity)
        if state is None:
            return None
        unit = state.attributes.get("unit_of_measurement") or cfg.get("oil_market_unit")
        factor = float(cfg.get("oil_factor") or 10.0)
        try:
            value = price_per_litre(float(state.state), unit, factor)
        except (TypeError, ValueError):
            value = None
        avg = price_per_litre(await self._price_average(entity, 30), unit, factor)
        your_price = float(cfg.get("oil_price") or 0)
        return {
            "entity": entity,
            "unit": unit,
            "value": round(value, 3) if value is not None else None,
            "avg_30d": round(avg, 3) if avg is not None else None,
            "delta_avg": round(value - avg, 3) if value is not None and avg is not None else None,
            "vs_your_price": round(value - your_price, 3) if value is not None and your_price > 0 else None,
        }

    async def _price_average(self, entity_id: str, days: int = 30) -> float | None:
        """Mittelwert einer Preis-Entität aus der Statistik."""
        from homeassistant.components.recorder import get_instance
        from homeassistant.components.recorder.statistics import statistics_during_period

        now = dt_util.utcnow()
        first = dt_util.as_utc(dt_util.start_of_local_day((now - timedelta(days=days)).date()))
        last = dt_util.as_utc(dt_util.start_of_local_day(now.date() + timedelta(days=1)))
        try:
            result = await get_instance(self.hass).async_add_executor_job(
                statistics_during_period,
                self.hass,
                first,
                last,
                {entity_id},
                "day",
                None,
                {"mean"},
            )
        except Exception:  # noqa: BLE001 – ohne Statistik bleibt der aktuelle Preis
            return None
        values = [float(row["mean"]) for row in result.get(entity_id) or [] if row.get("mean") is not None]
        return sum(values) / len(values) if values else None

    def _oil_price_kwh(self, cfg: dict[str, Any]) -> float:
        """Ölpreis von €/Liter auf €/kWh umrechnen."""
        factor = float(cfg.get("oil_factor") or 10.0)
        oil = float(cfg.get("oil_price") or 0)
        return round(oil / factor, 4) if oil > 0 and factor > 0 else 0.0

    async def _tank_summary(self, entity_id: str | None, cfg: dict[str, Any]) -> dict[str, Any] | None:
        """Aktuellen Tankfüllstand und die tägliche Historie auswerten."""
        if not entity_id:
            return None
        state = self.hass.states.get(entity_id)
        current = None
        unit = cfg.get("tank_unit")
        if state is not None:
            unit = state.attributes.get("unit_of_measurement") or unit
            try:
                current = float(state.state)
            except (TypeError, ValueError):
                current = None
        today = dt_util.now().date()
        history = await self._tank_history(entity_id, today - timedelta(days=15))
        return tank_summary(
            history,
            current,
            unit,
            capacity_l=cfg.get("tank_capacity") or 0,
            min_percent=cfg.get("tank_min") or 20,
            factor_kwh_per_l=cfg.get("oil_factor") or 10,
            oil_price_per_l=cfg.get("oil_price") or 0,
            today=today,
        )

    async def _tank_history(self, entity_id: str, start: date) -> list[tuple[date, float]]:
        """Tägliche Mittelwerte des Tankfüllstands aus der Statistik."""
        from homeassistant.components.recorder import get_instance
        from homeassistant.components.recorder.statistics import statistics_during_period

        first = dt_util.as_utc(dt_util.start_of_local_day(start))
        last = dt_util.as_utc(dt_util.start_of_local_day(dt_util.now().date() + timedelta(days=1)))
        try:
            result = await get_instance(self.hass).async_add_executor_job(
                statistics_during_period,
                self.hass,
                first,
                last,
                {entity_id},
                "day",
                None,
                {"mean"},
            )
        except Exception:
            _LOGGER.debug("Tank-Statistik nicht verfügbar", exc_info=True)
            return []
        out: list[tuple[date, float]] = []
        for row in result.get(entity_id) or []:
            mean = row.get("mean")
            stamp = row.get("start")
            if mean is None or stamp is None:
                continue
            try:
                day = dt_util.as_local(dt_util.utc_from_timestamp(float(stamp))).date()
            except (TypeError, ValueError, OSError):
                continue
            out.append((day, float(mean)))
        return out

    def _unit_of(self, entity_id: str) -> str | None:
        state = self.hass.states.get(entity_id)
        return state.attributes.get("unit_of_measurement") if state is not None else None

    async def _first_data_day(self, entity_id: str, start: date, end: date) -> date | None:
        """Erster Tag mit Statistik einer Zähler-Entität im Zeitraum (None = keine Daten)."""
        from homeassistant.components.recorder import get_instance
        from homeassistant.components.recorder.statistics import statistics_during_period

        first = dt_util.as_utc(dt_util.start_of_local_day(start))
        last = dt_util.as_utc(dt_util.start_of_local_day(end + timedelta(days=1)))
        try:
            result = await get_instance(self.hass).async_add_executor_job(
                statistics_during_period, self.hass, first, last, {entity_id}, "day", None, {"change"},
            )
        except Exception:  # noqa: BLE001 – ohne Statistik kein Abschneiden
            return None
        for row in result.get(entity_id) or []:
            stamp = row.get("start")
            if stamp is None or row.get("change") is None:
                continue
            if not isinstance(stamp, datetime):
                stamp = dt_util.utc_from_timestamp(float(stamp))
            return dt_util.as_local(stamp).date()
        return None

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
        """Preis auf €/kWh brutto – dieselbe Rechnung wie in der Steuerung (hub.tariff_value)."""
        return tariff_to_kwh(
            value,
            unit,
            factor,
            str(self.hub.opt(CONF_ENERGY_PRICE_BASIS) or "gross"),
            float(self.hub.opt(CONF_ENERGY_VAT) or 0),
            float(self.hub.opt(CONF_ENERGY_EXTRA_FEE) or 0),
        )

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
