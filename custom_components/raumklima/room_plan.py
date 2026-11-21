"""Regelkette: welches Ziel gilt gerade, und warum (siehe PLAN_RULES).

Teil von ``RaumklimaController`` (als Mixin, damit controller.py überschaubar bleibt)."""

from __future__ import annotations

from datetime import datetime, timedelta
import logging
from typing import Any

from homeassistant.util import dt as dt_util

from .const import (
    CONF_COOL_SETPOINT,
    CONF_COOLING,
    CONF_FLOOR_LEAD_MIN,
    CONF_MOLD_MODE,
    CONF_PREHEAT_LEAD,
    CONF_PREHEAT_MODE,
    CONF_PREHEAT_NOT_BEFORE,
    CONF_PRESENCE_LEARN,
    CONF_PRESENCE_OFF,
    CONF_QUIET_MODE,
    CONF_QUIET_SETBACK,
    CONF_ROOM_TYPE,
    CONF_SCHEDULE_FALLBACK,
    CONF_SOLAR,
    CONF_SOLAR_FACADE,
    PREHEAT_MARGIN_MINUTES,
    PRESENCE_PREHEAT_DEFAULT,
    PRESENCE_PREHEAT_GRACE,
)
from .decision_log import (
    CAT_TARGET,
    fmt_temp,
)
from .hub import RaumklimaHub
from .logic import (
    values_match,
)
from .msg import tr
from .occupancy import room_eco_target
from .planning import (
    AWAY_STAGES,
    NIGHT_ROOM_TYPES,
    SOLAR_REDUCTION,
    STAGE_AWAY_LONG,
    STAGE_AWAY_SHORT,
    frost_night_setback,
    schedule_target,
    schedule_window_end,
    setback_target,
)
from .room_const import (
    MOLD_OFF,
    MOLD_STRICT,
    PLAN_RULES,
    REASON_BOOST,
    REASON_COOL,
    REASON_DEVICE_AUTO,
    REASON_EMPTY,
    REASON_FROST,
    REASON_HOME_OFFICE,
    REASON_MANUAL,
    REASON_MOLD,
    REASON_MONITOR,
    REASON_NORMAL,
    REASON_PRESENCE,
    REASON_PRESENCE_PREHEAT,
    REASON_SCHEDULE,
    REASON_SCHEDULE_FALLBACK,
    REASON_SCHEDULE_PREHEAT,
    REASON_SEASON,
    REASON_SLEEP,
    REASON_SOLAR,
    REASON_VALVE_CARE,
    RULE_LABELS,
    SCHEDULE_FALLBACK_FROST,
    SCHEDULE_FALLBACK_LONG,
    SCHEDULE_FALLBACK_SHORT,
    SCHEDULE_FALLBACK_WISH,
    PlanResult,
    _PlanContext,
)

_LOGGER = logging.getLogger(f"{__package__}.controller")  # gleicher Logger-Name wie bisher


COOL_HYSTERESIS = 1.0  # K unter der Kühlgrenze, bis das Kühlen endet


class PlanMixin:
    """Regelkette: welches Ziel gilt gerade, und warum (siehe PLAN_RULES)."""

    def plan(self) -> tuple[bool, float, str]:
        """(heizen?, Zieltemperatur, Grund) – Regelkette mit Schimmelschutz als Boden.

        Die Doku sagt zu, dass der Schimmelschutz vorrangig bleibt („Der Zeitplan setzt nur den
        Sollwert: Fenster, Frost, Schimmel, Heizpause und Abwesenheit bleiben vorrangig“). Deshalb
        gilt er als Nachbedingung für *jeden* Zweig, der unter dem Feuchte-Boden liegen würde –
        auch Zeitplan und Ruhezeit, die ihn vorher nicht geprüft haben.
        """
        on, target, reason = self._plan_rules()
        under = (on, target, reason)
        on, target, reason = self._mold_floor(on, target, reason)
        # Was ohne Schimmelschutz gegolten hätte – die Karte zeigt dann beides
        # („Abgesenkt – niemand da“ + Schild „hält 17,5° statt 16,5°“).
        self._mold_under = (
            {"reason": under[2], "target": under[1] if under[0] else None}
            if reason == REASON_MOLD and under[2] != REASON_MOLD
            else None
        )
        return self._frost_floor(on, target, reason)

    def _frost_floor(self, on: bool, target: float, reason: str) -> tuple[bool, float, str]:
        """Absoluter Frostschutz des Raums als Untergrenze (Standard 5 °C).

        Eine Untergrenze, keine eigene Regel: Liegt der Raum darunter, wird mindestens auf den
        Frostschutz geheizt – ein höherer Wunsch, Boost oder Zeitplan gilt aber weiter (eine
        Regel vorn in der Kette hätte sie bis 5 °C verdrängt). Halbes Kelvin Hysterese, damit
        es an der Grenze nicht taktet.
        """
        if self.monitor or self.hvac_auto:
            return on, target, reason
        cur = self.current_temperature
        limit = self.frost_temp
        active = bool(getattr(self, "_room_frost_active", False))
        if cur is None or active and cur >= limit + 0.5:
            active = False
        elif not active and cur < limit:
            active = True
        if not self._peeking:
            self._room_frost_active = active
        if not active:
            return on, target, reason
        if on and target >= limit:
            return on, target, reason
        return True, min(limit, self.trv_max), REASON_FROST

    def _preheat_allowed(self, start: datetime, now: datetime) -> bool:
        """Darf jetzt vorgeheizt werden? (Issue #10: nicht mitten in der Nacht)

        ``auto``  – so früh, wie die gelernte Aufheizzeit es verlangt (bisheriges Verhalten)
        ``lead``  – höchstens X Minuten vor dem Zeitfenster
        ``clock`` – frühestens ab der eingestellten Uhrzeit
        ``off``   – gar nicht; geheizt wird erst zum Beginn des Zeitfensters
        """
        mode = str(self.config.get(CONF_PREHEAT_MODE) or "auto")
        if mode == "off":
            return False
        if mode == "lead":
            lead = max(0, int(self.config.get(CONF_PREHEAT_LEAD) or 90))
            return now >= start - timedelta(minutes=lead)
        if mode == "clock":
            hhmm = str(self.config.get(CONF_PREHEAT_NOT_BEFORE) or "05:00")
            hour, _sep, minute = hhmm.partition(":")
            try:
                allowed = now.replace(hour=int(hour), minute=int(minute or 0), second=0, microsecond=0)
            except (TypeError, ValueError):
                return True
            return now >= allowed
        return True

    def next_plan_change(self, local_now: datetime) -> datetime | None:
        """Nächster Zeitpunkt, an dem sich das Ziel laut Zeitplan ändert (lokal).

        Beginn des nächsten Fensters, Ende des laufenden und der berechnete Vorheizbeginn –
        damit der Raum auf die Minute umschaltet statt erst beim nächsten 10-Minuten-Abgleich.
        """
        if self.schedule_entity:
            return None  # Helfer melden ihre Wechsel selbst
        times: list[datetime] = []
        end = schedule_window_end(self.plan_schedules, local_now)
        if end is not None:
            times.append(end)
        nxt = self.next_plan_window(local_now)
        if nxt is not None:
            start, want = nxt
            times.append(start)
            hub = self.hub
            cur = self.current_temperature
            mode = str(self.config.get(CONF_PREHEAT_MODE) or "auto")
            if hub is not None and cur is not None and want is not None and mode != "off":
                need = self.heatup.minutes_needed(float(want) - cur, hub.outdoor_temp())
                if need:
                    at = start - timedelta(minutes=need + PREHEAT_MARGIN_MINUTES)
                    if mode == "lead":
                        lead = max(0, int(self.config.get(CONF_PREHEAT_LEAD) or 90))
                        at = max(at, start - timedelta(minutes=lead))
                    elif mode == "clock":
                        hour, _sep, minute = str(self.config.get(CONF_PREHEAT_NOT_BEFORE) or "05:00").partition(":")
                        try:
                            allowed = at.replace(hour=int(hour), minute=int(minute or 0), second=0, microsecond=0)
                        except (TypeError, ValueError):
                            allowed = at
                        at = max(at, allowed)
                    times.append(at)
        future = [t for t in times if t > local_now]
        return min(future) if future else None

    def _night_setback_applies(self, hub: Any) -> bool:
        """Gilt die Nachtabsenkung für diesen Raum?

        Reihenfolge: Raum-Option (auto/on/off) vor Raumtyp, ausdrücklicher Schalter
        „Nachtruhe" vor der Uhrzeit. ``auto`` heißt wie bisher: nur Schlafzimmer und
        selten genutzte Räume, und nur mit der Wohnungs-Option „Ruhezeit senkt ab".
        """
        mode = str(self.config.get(CONF_QUIET_MODE) or "auto")
        if mode == "off" or not hub.night_setback_now():
            return False
        if mode == "on":
            return True
        if getattr(hub, "night_manual", False):
            return True
        if not hub.opt(CONF_QUIET_SETBACK):
            return False
        return self.config.get(CONF_ROOM_TYPE) in NIGHT_ROOM_TYPES

    def _plan_rules(self) -> tuple[bool, float, str]:
        """Regelkette ohne Nachbedingung (siehe ``plan()``).

        Die Reihenfolge in ``PLAN_RULES`` *ist* die Rangfolge: die erste Regel, die ein Ergebnis
        liefert, gewinnt. Jede Regel steht für sich und gibt ``None`` zurück, wenn sie nicht greift.
        """
        ctx = _PlanContext(now=dt_util.utcnow(), local_now=dt_util.now(), hub=self.hub)
        for name in PLAN_RULES:
            result = getattr(self, name)(ctx)
            if result is not None:
                return result
        return True, self.target_temp, REASON_NORMAL

    def _rule_monitor(self, ctx: _PlanContext) -> PlanResult:
        """Überwachungsraum ohne Thermostat: nie heizen."""
        if self.monitor:
            return False, self.target_temp, REASON_MONITOR
        return None

    def _rule_device_auto(self, ctx: _PlanContext) -> PlanResult:
        """HVAC-Modus Auto: das Gerät fährt sein eigenes Programm."""
        if self.hvac_auto:
            return False, self.target_temp, REASON_DEVICE_AUTO
        return None

    def _rule_valve_care(self, ctx: _PlanContext) -> PlanResult:
        """Sommerpflege: Ventil kurz ganz öffnen."""
        if self._valve_care_until and ctx.now < self._valve_care_until:
            return True, self.trv_max, REASON_VALVE_CARE
        return None

    def _rule_cool(self, ctx: _PlanContext) -> PlanResult:
        """Zu warm und Klimaanlage vorhanden: kühlen statt heizen."""
        if not self.config.get(CONF_COOLING) or not self.ac_sources:
            return None
        if self.monitor or self.hvac_auto:
            return None
        # Raum ausgeschaltet oder Fenster offen: nicht kühlen (sonst lief die Anlage gegen das Fenster)
        if not self.hvac_on or self.paused or self.window_paused:
            self._set_cool_active(False)
            return None
        if self.boost_open or (self.boost_until and ctx.now < self.boost_until):
            return None
        ready = [
            ac for ac in self.ac_sources
            if ac.available() and "cool" in ((ac.state.attributes or {}).get("hvac_modes") or [])
        ]
        if not ready:
            return None
        current = self.current_temperature
        limit = float(self.config.get(CONF_COOL_SETPOINT) or 26.0)
        # Hysterese: ab über der Grenze kühlen, erst 1 K darunter wieder freigeben – die Anlage
        # hält die Grenze selbst; ohne Hysterese ging sie bei 25,9 °C aus und bei 26,1 °C an.
        active = bool(getattr(self, "_cool_active", False))
        if current is None or active and current <= limit - COOL_HYSTERESIS:
            active = False
        elif not active and current > limit:
            active = True
        self._set_cool_active(active)
        if not active:
            return None
        return False, limit, REASON_COOL

    def _set_cool_active(self, active: bool) -> None:
        if not self._peeking:
            self._cool_active = active

    def _rule_no_hub(self, ctx: _PlanContext) -> PlanResult:
        """Ohne Zentrale gilt schlicht der Wunsch."""
        if ctx.hub is None:
            return True, self.target_temp, REASON_NORMAL
        return None

    def _rule_season(self, ctx: _PlanContext) -> PlanResult:
        """Heizpause – mit Sicherung: fällt der Raum unter den Frostboden, heizt er trotzdem."""
        hub = ctx.hub
        if hub.heating_allowed:
            self._frost_active = False
            return None
        floor = hub.frost_floor
        cur = self.current_temperature
        if self._frost_active and (cur is None or cur >= floor + 1):
            if not self._peeking:
                self._frost_active = False
        elif not self._frost_active and cur is not None and cur < floor and not self._peeking:
            self._frost_active = True
        if self._frost_active:
            return True, min(floor + 1, self.trv_max), REASON_FROST
        return False, self.target_temp, REASON_SEASON

    def _rule_boost(self, ctx: _PlanContext) -> PlanResult:
        """Boost: bewusste Nutzeraktion – schlägt die Absenkung bei Abwesenheit."""
        if not (self.boost_open or self.boost_until is not None):
            return None
        if self.boost_open or ctx.now < self.boost_until:
            boost = self.boost_temperature if self.boost_temperature is not None else self.target_temp
            return True, min(boost, self.trv_max), REASON_BOOST
        if not self._peeking:
            self.boost_until = None
            self.boost_temperature = None
            self._save()
        return None

    def _rule_presence(self, ctx: _PlanContext) -> PlanResult:
        """Jemand im Raum: auf die Anwesenheits-Temperatur heizen (z. B. Arbeitszimmer 19 → 21)."""
        if self.presence_heat_active and not ctx.hub.vacation:
            return True, min(self.presence_target, self.trv_max), REASON_PRESENCE
        return None

    def _rule_home_office(self, ctx: _PlanContext) -> PlanResult:
        """Homeoffice: im eingestellten Fenster gilt der Wunsch, der Zeitplan pausiert."""
        hub = ctx.hub
        if hub.vacation:
            return None
        if hub.home_office_applies(self.entry.entry_id) or self.room_home_office_on:
            return True, min(self.target_temp, self.trv_max), REASON_HOME_OFFICE
        return None

    def _rule_away(self, ctx: _PlanContext) -> PlanResult:
        """Niemand zu Hause: Absenkung „kurz weg" / „länger weg" (mit Schimmelschutz und Frostnacht)."""
        hub = ctx.hub
        stage = hub.stage_for_room(self.entry.entry_id)
        if stage not in AWAY_STAGES:
            return None
        if self._manual_until and ctx.now < self._manual_until:
            return True, self.target_temp, REASON_MANUAL
        mold = None
        if self.humidity_capable and (self.config.get(CONF_MOLD_MODE) or MOLD_STRICT) != MOLD_OFF:
            mold = self.mold_min(hub)
        # Bei Abwesenheit nie wärmer als der gerade gültige Zeitplan.
        base = self.target_temp
        scheduled = schedule_target(self.plan_schedules, ctx.local_now)
        if scheduled is not None:
            base = min(base, scheduled)
        target = setback_target(
            base, stage, self.setback_short, self.setback_long, mold
        )
        frost = hub.frost_night
        if not self._peeking:
            self.frost_night_low = frost if target < self.target_temp else None
        if frost is not None and target < self.target_temp:
            target = min(self.target_temp, max(target, frost_night_setback(target, self.target_temp)))
        if target < self.target_temp:
            return True, target, stage
        # Nichts zu senken (Wunsch liegt schon auf dem Absenkwert, z. B. Sportzimmer 18,0 °C):
        # trotzdem als „abgesenkt" melden – außer ein Zeitplanfenster gilt gerade.
        if schedule_target(self.plan_schedules, ctx.local_now) is None:
            return True, target, stage
        return None

    def _rule_expire_manual(self, ctx: _PlanContext) -> PlanResult:
        """Kein Ergebnis – räumt nur auf: abgelaufene Handverstellung verwerfen.

        Nur *abgelaufene* Handverstellungen verwerfen – eine laufende muss bleiben, sonst wäre
        sie nach dem ersten plan()-Aufruf schon weg (Zeitplan-Pause).
        """
        ctx.manual_until = self._manual_until
        if not self._peeking:
            if ctx.manual_until is not None and ctx.manual_until <= ctx.now:
                ctx.manual_until = None
                self._manual_until = None
                self._save()
            self.frost_night_low = None
        return None

    def _rule_schedule(self, ctx: _PlanContext) -> PlanResult:
        """Zeitplan: eigener Wunsch für dieses Fenster, schlägt Leer-Absenkung und Sonne."""
        if self.schedule_entity:
            # Zeitplan-Helfer statt eigener Zeitfenster (Issue #52)
            helper = self.helper_window()
            if helper is None or not helper[0]:
                return None
            sched = helper[1] if helper[1] is not None else self.target_temp
        else:
            sched = schedule_target(self.plan_schedules, ctx.local_now)
        if sched is None:
            return None
        if ctx.manual_active and not values_match(self.target_temp, sched, 0.05):
            # Von Hand gestellt: der Zeitplan pausiert bis override_minutes abgelaufen sind
            return True, min(self.target_temp, self.trv_max), REASON_MANUAL
        # Lückenloser Zeitplan (jede Stunde belegt): ohne diese Prüfung gewinnt immer der
        # laufende Block, und das Vorheizen auf den nächsten, wärmeren Block käme nie dran.
        pre = self._rule_preheat(ctx)
        if pre is not None and pre[1] > min(sched, self.trv_max) + 0.05:
            return pre
        return True, min(sched, self.trv_max), REASON_SCHEDULE

    def _rule_night(self, ctx: _PlanContext) -> PlanResult:
        """Ruhezeit: Schlafräume werden abgesenkt, auch wenn jemand zu Hause ist.

        Nach einer Nachtschicht wird tagsüber geschlafen. Der Regler am Thermostat gilt weiter.
        """
        if not self._night_setback_applies(ctx.hub):
            return None
        if ctx.manual_active:
            return True, self.target_temp, REASON_MANUAL
        return True, ctx.hub.night_target(self), REASON_SLEEP

    def _rule_preheat(self, ctx: _PlanContext) -> PlanResult:
        """Vorheizen auf das nächste Zeitfenster – nur mit gelernter Aufheizzeit."""
        nxt = self.next_plan_window(ctx.local_now)
        cur = self.current_temperature
        if nxt is None or cur is None or not self._preheat_allowed(nxt[0], ctx.local_now):
            return None
        start, want = nxt
        if ctx.hub.energy_cheap_now() and ctx.local_now + timedelta(minutes=60) >= start:
            return True, min(want, self.trv_max), REASON_SCHEDULE_PREHEAT
        need = self.heatup.minutes_needed(want - cur, ctx.hub.outdoor_temp())
        if need is not None and ctx.local_now + timedelta(minutes=need + PREHEAT_MARGIN_MINUTES) >= start:
            return True, min(want, self.trv_max), REASON_SCHEDULE_PREHEAT
        if self.floor_mode:
            floor_lead = float(self.config.get(CONF_FLOOR_LEAD_MIN) or 0)
            if floor_lead and ctx.local_now + timedelta(minutes=floor_lead) >= start:
                return True, min(want, self.trv_max), REASON_SCHEDULE_PREHEAT
        return None

    def _rule_presence_preheat(self, ctx: _PlanContext) -> PlanResult:
        """Vorwärmen vor einer gelernten Belegungszeit (Präsenzmelder + „Bei Anwesenheit“).

        Ist der Raum z. B. Mo–Fr ab 08:00 typischerweise belegt, wird so früh auf die
        Anwesenheits-Temperatur geheizt, dass es um 08:00 warm ist. Kommt bis 30 min nach dem
        gelernten Beginn niemand, gilt wieder der Wert von vorher – kein Heizen für ein leeres Zimmer.
        """
        target = self.presence_target
        if target <= 0 or not self.config.get(CONF_PRESENCE_LEARN, True) or ctx.hub.vacation:
            return None
        block = self.usage.next_block(ctx.local_now)
        cur = self.current_temperature
        if block is None or cur is None:
            return None
        start = block[0]
        if ctx.local_now >= start:
            if ctx.local_now - start <= timedelta(minutes=PRESENCE_PREHEAT_GRACE):
                return True, min(target, self.trv_max), REASON_PRESENCE_PREHEAT
            return None
        need = self.heatup.minutes_needed(target - cur, ctx.hub.outdoor_temp())
        lead = PRESENCE_PREHEAT_DEFAULT if need is None else need + PREHEAT_MARGIN_MINUTES
        if ctx.local_now + timedelta(minutes=lead) >= start:
            return True, min(target, self.trv_max), REASON_PRESENCE_PREHEAT
        return None

    def schedule_outside_temp(self, hub: RaumklimaHub | None) -> float:
        """Was außerhalb der Zeitfenster gilt – nie wärmer als die Wunschtemperatur."""
        fb = self.config.get(CONF_SCHEDULE_FALLBACK) or SCHEDULE_FALLBACK_WISH
        outside = {
            SCHEDULE_FALLBACK_SHORT: self.setback_short,
            SCHEDULE_FALLBACK_LONG: self.setback_long,
            # „Frostschutz“ außerhalb der Fenster hieß bis 1.1 die Sicherung der Wohnung
            # (Standard 16 °C) – der neue Raumwert (5 °C) darf das nicht still absenken.
            SCHEDULE_FALLBACK_FROST: max(self.frost_temp, hub.frost_floor if hub is not None else self.frost_temp),
        }.get(fb)
        if outside is not None and outside < self.target_temp - 0.05:
            return min(outside, self.trv_max)
        return min(self.target_temp, self.trv_max)

    def _rule_schedule_fallback(self, ctx: _PlanContext) -> PlanResult:
        """Zeitplan vorhanden, aber gerade kein Fenster: der gewählte Wert außerhalb gilt."""
        fb = self.config.get(CONF_SCHEDULE_FALLBACK) or SCHEDULE_FALLBACK_WISH
        if not (self.schedules or self.schedule_entity) or fb == SCHEDULE_FALLBACK_WISH:
            return None
        outside = self.schedule_outside_temp(ctx.hub)
        if outside < self.target_temp - 0.05:
            return True, outside, REASON_SCHEDULE_FALLBACK
        return None

    def schedule_status(self, local_now: datetime) -> dict[str, Any] | None:
        """Für die Raumkarte: „20 °C bis 20:00 · danach 17 °C“ bzw. „ab 06:00 22 °C“."""
        hub = self.hub
        outside = self.schedule_outside_temp(hub)
        if self.schedule_entity:
            helper = self.helper_window()
            if helper is None:
                return None
            on, temp, change = helper
            want = min(temp if temp is not None else self.target_temp, self.trv_max)
            return {
                "source": "helper",
                "active": on,
                "temp": want if on else None,
                "until": change.isoformat() if on and change is not None else None,
                "next": change.isoformat() if not on and change is not None else None,
                "next_temp": want if not on and change is not None else None,
                "outside": outside,
            }
        sched = self.plan_schedules
        if not sched:
            return None
        temp = schedule_target(sched, local_now)
        end = schedule_window_end(sched, local_now)
        nxt = self.next_plan_window(local_now)
        # „danach“: schließt der nächste Block direkt an, gilt dessen Temperatur –
        # nur bei einer Lücke der Wert außerhalb der Zeitfenster.
        after = outside
        if end is not None and nxt is not None and abs((nxt[0] - end).total_seconds()) <= 120:
            after = min(nxt[1], self.trv_max)
        return {
            "after": after if end is not None else None,
            "source": "own",
            "active": temp is not None,
            "temp": min(temp, self.trv_max) if temp is not None else None,
            "until": end.isoformat() if end is not None else None,
            "next": nxt[0].isoformat() if nxt is not None else None,
            "next_temp": min(nxt[1], self.trv_max) if nxt is not None else None,
            "outside": outside,
        }

    def _rule_empty_room(self, ctx: _PlanContext) -> PlanResult:
        """Leerer Raum (Präsenzmelder): etwas kühler. „Anwesenheit aus" schaltet das ab (Issue #10)."""
        hub = ctx.hub
        if not self.room_eco_applies() or hub.opt(CONF_PRESENCE_OFF):
            return None
        floor = self.setback_short
        if self.humidity_capable:
            mold = self.mold_min(hub)
            if mold is not None:
                floor = max(floor, mold)
        target = room_eco_target(self.target_temp, self.room_eco_drop, floor)
        if target < self.target_temp:
            return True, target, REASON_EMPTY
        return None

    def _rule_solar(self, ctx: _PlanContext) -> PlanResult:
        """Sonnenseite: bei erwarteter Sonne etwas weniger – sie heizt mit."""
        if self._solar_applies(ctx.hub):
            return True, self.target_temp - SOLAR_REDUCTION, REASON_SOLAR
        return None

    def _solar_applies(self, hub: RaumklimaHub) -> bool:
        """Sonnen-Raum: bei erwarteter Sonne 1 °C weniger – einmal an, bis die Sonne weg ist (keine Schwingung)."""
        if not self.config.get(CONF_SOLAR) or not hub.sun_expected(self.config.get(CONF_SOLAR_FACADE)):
            if not self._peeking:
                self._solar_active = False
            return False
        if not self._solar_active:
            cur = self.current_temperature
            active = cur is not None and cur >= self.target_temp - 0.5
            if not self._peeking:
                self._solar_active = active
            return active
        return True

    @property
    def effective_target(self) -> float:
        """Geltendes Ziel zum Anzeigen – ohne Zustand zu verbrauchen (Boost-Ablauf, Hysterese)."""
        return self.peek_plan()[1]

    def explain(self) -> dict[str, Any]:
        """„Warum heizt der Raum (nicht)?“ – Voraussetzungen und jede Regel der Rangfolge.

        Läuft wie ``peek_plan`` ohne Nebenwirkung. Je Regel: ``wins`` (bestimmt das Ziel),
        ``later`` (würde greifen, ist aber nachrangig) oder ``no`` (greift gerade nicht).
        """
        self._peeking = True
        try:
            ctx = _PlanContext(now=dt_util.utcnow(), local_now=dt_util.now(), hub=self.hub)
            rules: list[dict[str, Any]] = []
            winner = None
            for name in PLAN_RULES:
                if name == "_rule_no_hub" and ctx.hub is not None:
                    continue  # hat eine Wohnung – die Regel ist nur ein Rückfall
                if ctx.hub is None and winner is not None:
                    break  # ohne Wohnung können die folgenden Regeln nicht gefragt werden
                result = getattr(self, name)(ctx)
                if name == "_rule_expire_manual":
                    if ctx.manual_active:
                        rules.append({"rule": name, "label": tr(RULE_LABELS[name]), "state": "info",
                                      "text": tr("bis {t}", t=dt_util.as_local(ctx.manual_until).strftime("%H:%M"))})
                    continue
                state = "no" if result is None else ("later" if winner else "wins")
                entry: dict[str, Any] = {"rule": name, "label": tr(RULE_LABELS.get(name, name)), "state": state}
                if result is not None:
                    entry["target"] = result[1]
                    entry["on"] = result[0]
                    winner = winner or (name, result)
                rules.append(entry)
            on, target, reason = self.plan()
        finally:
            self._peeking = False
        hub = self.hub
        cur = self.current_temperature
        valve = self.valve_position
        checks = [
            self._check(hub is None or hub.heating_allowed, tr("Heizsaison"),
                        tr("an") if hub is None or hub.heating_allowed else tr("Heizpause – die Heizung bleibt aus")),
            self._check(self.hvac_on, tr("Thermostat eingeschaltet"), tr("ja") if self.hvac_on else tr("aus (von Hand oder in Home Assistant)")),
            self._check(not self.window_open, tr("Fenster"), tr("zu") if not self.window_open else tr("offen – Heizung pausiert")),
            self._check(self.trv_available() if not self.monitor else True, tr("Thermostat erreichbar"),
                        tr("ja") if self.monitor or self.trv_available() else tr("nicht erreichbar (Funk, Batterie, Zigbee2MQTT)")),
            self._check(self.sync_state != "failed", tr("Befehle bestätigt"),
                        {"ok": tr("ja"), "pending": tr("wartet auf Bestätigung"), "failed": tr("nicht bestätigt – Gerät übernimmt den Sollwert nicht")}.get(self.sync_state, self.sync_state)),
            self._check(self.sensor_ok, tr("Raumfühler"), fmt_temp(cur) if self.sensor_ok else tr("liefert keine Werte – Notbetrieb mit Thermostat-Fühler")),
        ]
        heating = self.hvac_action == "heating"
        if not on or not self.hvac_on or self.paused:
            verdict = tr("Heizt nicht – {why}", why=self._verdict_reason(on, reason))
        elif cur is not None and cur >= target - 0.1:
            verdict = tr("Ziel {t} erreicht – Ventil regelt nur nach", t=fmt_temp(target))
        elif heating:
            verdict = tr("Heizt auf {t}", t=fmt_temp(target))
        else:
            verdict = tr("Soll heizen auf {t}, das Thermostat meldet aber kein Heizen", t=fmt_temp(target))
        return {
            "verdict": verdict,
            "heating": heating,
            "target": target,
            "reason": reason,
            "current": cur,
            "valve": valve,
            "checks": checks,
            "rules": rules,
            "mold_raised": reason == REASON_MOLD,
        }

    @staticmethod
    def _check(ok: bool, label: str, text: str) -> dict[str, Any]:
        return {"ok": bool(ok), "label": label, "text": text}

    def _verdict_reason(self, on: bool, reason: str) -> str:
        if self.window_open:
            return tr("Fenster offen")
        if not self.hvac_on:
            return tr("Thermostat ausgeschaltet")
        if reason == REASON_SEASON:
            return tr("Heizpause")
        if reason == REASON_MONITOR:
            return tr("nur Messen")
        if reason == REASON_DEVICE_AUTO:
            return tr("Gerät fährt sein eigenes Programm")
        return tr("Regel „{r}“", r=reason)

    def peek_plan(self) -> tuple[bool, float, str]:
        """Wie ``plan()``, aber ohne den Von-Hand-Vorrang zu verbrauchen (für die Anzeige)."""
        self._peeking = True
        try:
            return self.plan()
        finally:
            self._peeking = False

    # ================================================================ Protokoll
    def _log_plan(self, on: bool, target: float, reason: str) -> None:
        """Zieländerungen mit Begründung protokollieren (nur bei Änderung)."""
        key = (on, round(target, 1), reason)
        if key == self._last_plan:
            return
        first = self._last_plan is None
        self._last_plan = key
        why = {
            REASON_NORMAL: tr("Wunschtemperatur {t}", t=fmt_temp(self.target_temp)),
            REASON_MANUAL: tr("von Hand wärmer gestellt – Absenkung 3 h ausgesetzt"),
            REASON_SEASON: tr("Heizpause (mild draußen)"),
            REASON_FROST: tr("Frostschutz – heizt auf {t}", t=fmt_temp(target)),
            REASON_VALVE_CARE: tr("Sommerpflege: Ventil kurz öffnen"),
            REASON_EMPTY: tr(
                "Raum seit {m} min leer (Präsenzmelder) – {d} weniger (Wunsch {t})",
                m=f"{self.room_eco_after:.0f}", d=fmt_temp(self.room_eco_drop), t=fmt_temp(self.target_temp),
            ),
            REASON_PRESENCE: tr(
                "jemand im Raum (Präsenzmelder) – {t}, zurück nach {m} min ohne Belegung",
                t=fmt_temp(self.presence_target), m=f"{self.presence_release_min:.0f}",
            ),
            REASON_SCHEDULE: tr("Zeitplan – {t}", t=fmt_temp(target)),
            REASON_SCHEDULE_PREHEAT: tr("Vorheizen für das nächste Zeitfenster – {t}", t=fmt_temp(target)),
            REASON_PRESENCE_PREHEAT: tr("Vorwärmen – der Raum ist um diese Zeit meist belegt – {t}", t=fmt_temp(target)),
            REASON_BOOST: tr("Boost – {t}", t=fmt_temp(target)),
            REASON_HOME_OFFICE: tr("Homeoffice – Wunschtemperatur {t}", t=fmt_temp(target)),
            REASON_MONITOR: tr("nur Messen, kein Thermostat"),
            REASON_DEVICE_AUTO: tr("Gerät im Auto-Modus – fährt sein eigenes Programm"),
            REASON_SOLAR: tr("Sonne erwartet – {d} weniger, sie heizt mit (Wunsch {t})", d=fmt_temp(SOLAR_REDUCTION), t=fmt_temp(self.target_temp)),
            REASON_COOL: tr("Kühlen – {t}", t=fmt_temp(target)),
            REASON_SLEEP: tr("Ruhezeit – Schlafraum abgesenkt auf {t}", t=fmt_temp(self.setback_long)),
            REASON_SCHEDULE_FALLBACK: tr(
                "außerhalb der Zeitfenster – {t}", t=fmt_temp(target)
            ),
            REASON_MOLD: tr(
                "Schimmelschutz – mindestens {t} nötig (Feuchte {h} %)",
                t=fmt_temp(target), h=f"{self.current_humidity or 0:.0f}",
            ),
            STAGE_AWAY_SHORT: tr("alle weg – Absenkung „kurz weg“ {t}", t=fmt_temp(self.setback_short)),
            STAGE_AWAY_LONG: tr("länger weg – Absenkung {t}", t=fmt_temp(self.setback_long)),
        }.get(reason, reason)
        missing = self.hub.room_persons_missing(self.entry.entry_id) if self.hub is not None and reason in AWAY_STAGES else []
        if missing:
            # Nur die zugeordneten Personen fehlen – andere sind zu Hause
            why = tr(
                "{who} nicht da – Absenkung {t}",
                who=" & ".join(missing),
                t=fmt_temp(self.setback_long if reason == STAGE_AWAY_LONG else self.setback_short),
            )
        if self.frost_night_low is not None and reason in AWAY_STAGES:
            why += tr(", Frostnacht ({t} erwartet): nur halb so tief abgesenkt", t=fmt_temp(self.frost_night_low))
        elif reason == STAGE_AWAY_LONG and target > self.setback_long:
            why += tr(", Schimmelschutz hält {t} (Feuchte {h} %)", t=fmt_temp(target), h=f"{self.current_humidity or 0:.0f}")
        msg = tr("Ziel {t}", t=fmt_temp(target)) if on else tr("Heizung aus")
        self.log(CAT_TARGET, (tr("Start: ") if first else "") + msg, why, target=target, reason=reason)
