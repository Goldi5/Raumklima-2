"""Gesundheitscheck, Bericht-Stichproben und Diagnose eines Raums."""

from __future__ import annotations

from datetime import datetime, timedelta
import logging
from typing import Any

from homeassistant.const import ATTR_TEMPERATURE
from homeassistant.helpers import device_registry as dr, entity_registry as er
from homeassistant.util import dt as dt_util

from .const import (
    CONF_TRV_INTERVAL,
    STATUS_HEATING,
    STATUS_TRV,
)
from .decision_log import (
    CAT_DEVICE,
    CAT_TARGET,
    fmt_temp,
)
from .health import (
    DERIVED_PRESET_PLATFORMS,
    HistoryPoint,
    Issue,
    check_battery,
    check_hydraulic,
    check_not_warming,
    check_radio,
    check_sensor_frozen,
    check_sensor_missing,
    check_trv_mode,
    check_window,
    check_window_flapping,
)
from .logic import (
    is_valid,
    shadow_opening,
    to_float,
)
from .msg import dec, tr
from .stats import RoomSample

_LOGGER = logging.getLogger(__name__)

# Üblicher Meldetakt je Gerätefamilie in Sekunden – nur Startwert, bis Messwerte da sind.
REPORT_SECONDS_BY_PLATFORM = {
    "fritzbox": 900,  # AVM pollt die Box im 15-Minuten-Takt
    "homematicip_cloud": 600,
    "homematic": 600,
    "deconz": 300,
    "zha": 300,
    "mqtt": 300,
}
REPORT_SECONDS_DEFAULT = 300
OUTAGE_SAMPLES_MIN = 3  # so viele beobachtete Funkpausen, bevor die eigene Zeit gilt




def _entity_stem(entity_id: str) -> str:
    """Namensstamm einer Entität: ``climate.danfoss_ally_buro_mike`` → ``danfoss_ally_buro_mike``."""
    obj = str(entity_id or "").split(".", 1)[-1]
    for suffix in ("_thermostat", "_trv", "_valve", "_climate", "_heizkorper", "_heizkoerper"):
        if obj.endswith(suffix):
            obj = obj[: -len(suffix)]
    return obj


def _common_prefix(a: str, b: str) -> int:
    n = 0
    for x, y in zip(a, b, strict=False):
        if x != y:
            break
        n += 1
    return n


def _name_related(candidate: str, target: str) -> bool:
    """Gehören zwei Gerätenamen zusammen? („Danfoss Ally Büro" vs. „Danfoss Ally Büro Valve")"""
    a = (candidate or "").strip().lower()
    b = (target or "").strip().lower()
    if not a or not b:
        return False
    return a == b or a.startswith(b) or b.startswith(a)


class HealthMixin:
    """Gesundheits- und Diagnose-Teil des Raum-Controllers."""

    def _find_valve_sensor(self) -> str | None:
        """Ventilstellung passend zum Thermostat finden.

        Nicht jedes Gerät nennt sie „position": Danfoss Ally liefert ``…_valve_opening``,
        Homematic ``…_valve_position``, Bosch ``…_valve_tappet`` (Issue #15). Deshalb über
        den Prozentwert und die Bezeichnung suchen, nicht über einen festen Namen.

        Gesucht wird in dieser Reihenfolge: gleiches Gerät, gleicher Bereich, gleicher
        Gerätename (Danfoss Ally legt den Sensor auf ein *eigenes* Gerät), und zuletzt der
        einzige Ventilsensor im System. Ist die Zuordnung mehrdeutig, wird bewusst nichts
        gewählt – lieber keine Anzeige als die Ventilstellung eines fremden Raums.
        """
        registry = er.async_get(self.hass)
        devices = dr.async_get(self.hass)
        trv_entry = registry.async_get(self.trv)
        if trv_entry is None:
            return None
        # „position" allein ist zu unscharf: Rollladenaktoren heißen genauso
        # (Issue #11 – ein Rollladen-Positionssensor wurde als Ventil angezeigt).
        strong = ("valve", "ventil", "öffnung", "oeffnung", "opening", "tappet")
        weak = ("position",)
        heating_devices = {
            e.device_id for e in registry.entities.values() if e.domain == "climate" and e.device_id
        }

        def usable(entry) -> bool:
            if entry.domain != "sensor" or entry.disabled_by:
                return False
            state = self.hass.states.get(entry.entity_id)
            unit = str((state.attributes.get("unit_of_measurement") if state else "") or "")
            if "%" not in unit:
                return False  # Batterie, RSSI, Ventilhub-Historie usw. aussortieren
            hay = f"{entry.entity_id} {entry.original_name or ''} {entry.translation_key or ''}".lower()
            if any(k in hay for k in strong):
                return True
            # „position" nur bei einem Gerät, das auch ein Thermostat ist
            return any(k in hay for k in weak) and entry.device_id in heating_devices

        def pick(entries) -> str | None:
            for entry in entries:
                if usable(entry):
                    return entry.entity_id
            return None

        def area_of(entry) -> str | None:
            """Bereich steht meist am Gerät, nicht an der Entität."""
            if entry.area_id:
                return entry.area_id
            dev = devices.async_get(entry.device_id) if entry.device_id else None
            return dev.area_id if dev else None

        trv_area = area_of(trv_entry)

        def same_area(entry) -> bool:
            """Gehört der Sensor zum selben Raum? Unbekannter Bereich zählt als „vielleicht“."""
            area = area_of(entry)
            return not trv_area or area in (None, trv_area)

        def same_known_area(entry) -> bool:
            """Streng: nur ein **bekannter**, gleicher Bereich zählt.

            Nötig für die Namens-Heuristik: ein Sensor ohne Bereich aus einer anderen Wohnung
            („Finja Berlin Küche“) passte sonst auf den Raum „Finja“ in Remscheid – dessen
            Bericht zeigte dann fremde Ventilwerte.
            """
            return bool(trv_area) and area_of(entry) == trv_area

        if trv_entry.device_id:
            hit = pick(er.async_entries_for_device(registry, trv_entry.device_id))
            if hit:
                return hit
        # Gleicher Namensstamm in der entity_id: der stärkste Hinweis überhaupt
        # (climate.danfoss_ally_buro_mike ↔ sensor.danfoss_ally_buro_mike_valve_opening).
        stem = _entity_stem(self.trv)
        if len(stem) >= 4:
            related = [
                e
                for e in registry.entities.values()
                if (other := _entity_stem(e.entity_id))
                and other != stem
                and (other.startswith(stem) or stem.startswith(other))
                # Namensgleichheit allein reicht nicht: nur bei bekanntem, gleichem Bereich
                and same_known_area(e)
            ]
            # der längste gemeinsame Namensanfang gewinnt (bei mehreren Kandidaten)
            related.sort(key=lambda e: -_common_prefix(_entity_stem(e.entity_id), stem))
            hit = pick(related)
            if hit:
                return hit

        device = devices.async_get(trv_entry.device_id) if trv_entry.device_id else None
        trv_name = ((device.name_by_user or device.name) if device else "") or ""

        # Heizkörper-Thermostate im Raum zuerst: dort sitzt das Ventil
        for extra in getattr(self, "extra_trvs", []):
            extra_entry = registry.async_get(getattr(extra, "entity_id", ""))
            if extra_entry is not None and extra_entry.device_id:
                hit = pick(er.async_entries_for_device(registry, extra_entry.device_id))
                if hit:
                    return hit

        trv_area = area_of(trv_entry)
        if trv_area:
            hit = pick([e for e in registry.entities.values() if area_of(e) == trv_area])
            if hit:
                return hit

        def name_of(entry) -> str:
            dev = devices.async_get(entry.device_id) if entry.device_id else None
            return ((dev.name_by_user or dev.name) if dev else "") or ""

        if trv_name:
            same = [
                e
                for e in registry.entities.values()
                if e.device_id and _name_related(name_of(e), trv_name) and same_known_area(e)
            ]
            hit = pick(same)
            if hit:
                return hit

        loose = [e.entity_id for e in registry.entities.values() if usable(e) and same_area(e)]
        return loose[0] if len(loose) == 1 else None

    @property
    def battery_low(self) -> dict[str, Any] | None:
        """Schwächste Batterie im Raum – für Karte und Diagnose."""
        levels: dict[str, float] = {}
        for name, entity_id in getattr(self, "_batteries", {}).items():
            state = self.hass.states.get(entity_id)
            value = to_float(state.state) if state else None
            if value is not None:
                levels[name] = value
        if not levels:
            return None
        name, level = min(levels.items(), key=lambda kv: kv[1])
        return {"name": name, "level": round(level), "low": level < 20}

    def _find_batteries(self) -> dict[str, str]:
        """Batterie-Sensoren der beteiligten Geräte (TRV, Fühler, Kontakte): Gerätename → Entität."""
        ents = er.async_get(self.hass)
        devs = dr.async_get(self.hass)
        found: dict[str, str] = {}
        for entity_id in [self.trv, *getattr(self, "_extra_ids", []), self.temp_sensor, self.humidity_sensor, *self.windows]:
            entry = ents.async_get(entity_id) if entity_id else None
            if entry is None or entry.device_id is None:
                continue
            device = devs.async_get(entry.device_id)
            name = (device.name_by_user or device.name) if device else entity_id
            for cand in er.async_entries_for_device(ents, entry.device_id):
                dclass = cand.device_class or cand.original_device_class
                if cand.domain == "sensor" and dclass == "battery" and not cand.disabled_by:
                    found.setdefault(name or cand.entity_id, cand.entity_id)
                    break
        return found

    @property
    def valve_sources(self) -> int:
        """Wie viele Geräte liefern gerade wirklich eine Ventilstellung?"""
        count = 0
        if self.valve_sensor:
            state = self.hass.states.get(self.valve_sensor)
            if state is not None and to_float(state.state) is not None:
                count += 1
        count += sum(1 for trv in getattr(self, "extra_trvs", []) if trv.valve is not None)
        return count

    @property
    def valve_position(self) -> float | None:
        """Ventilstellung – bei mehreren Heizkörpern der Mittelwert."""
        values = []
        if self.valve_sensor:
            state = self.hass.states.get(self.valve_sensor)
            values.append(to_float(state.state) if state else None)
        values += [x.valve for x in getattr(self, "extra_trvs", [])]
        values = [v for v in values if v is not None]
        return round(sum(values) / len(values), 1) if values else None

    # ================================================================ Bericht & Gesundheit
    def trv_report_platform(self) -> str:
        """Plattform des Thermostats (für den Startwert, bevor Messwerte vorliegen)."""
        entry = er.async_get(self.hass).async_get(self.trv)
        return (entry.platform if entry is not None else "") or ""

    @property
    def trv_expected_interval(self) -> float:
        """Wie lange darf das Gerät normalerweise schweigen? (Sekunden)

        Reihenfolge: Handeingabe im Raum → aus den Funkpausen gelernt → Startwert der
        Gerätefamilie. FRITZ!DECT etwa funkt nur alle 15 Minuten; eine feste Minute
        Schwelle erzeugt dort Daueralarme (Issue #33).
        """
        override = self.config.get(CONF_TRV_INTERVAL)
        try:
            minutes = float(override or 0)
        except (TypeError, ValueError):
            minutes = 0.0
        if minutes > 0:
            return minutes * 60
        learned = self._learned_silence()
        if learned is not None:
            return learned
        return float(REPORT_SECONDS_BY_PLATFORM.get(self.trv_report_platform(), REPORT_SECONDS_DEFAULT))

    def _learned_silence(self) -> float | None:
        """80 %-Perzentil der beobachteten Ausfalldauern – die übliche Funkpause.

        Nicht die Häufigkeit von Wertänderungen messen: in einem Raum, in dem sich nichts
        ändert, sähe das Gerät sonst „tot" aus. Gelernt wird aus dem, was ein Gerät real
        braucht, bis es zurückkommt.
        """
        durations = sorted(
            d for d in getattr(self, "_outage_durations", ()) if 5.0 <= d <= 7200.0
        )
        if len(durations) < OUTAGE_SAMPLES_MIN:
            return None
        return durations[min(len(durations) - 1, int(len(durations) * 0.8))]

    @property
    def outage_learning(self) -> bool:
        """Noch keine eigene Erfahrung – dann bitte nicht warnen, sondern beobachten."""
        override = self.config.get(CONF_TRV_INTERVAL)
        try:
            if float(override or 0) > 0:
                return False
        except (TypeError, ValueError):
            pass
        return self._learned_silence() is None

    @property
    def outage_seconds(self) -> float:
        """Ab wann gilt das Gerät als ausgefallen? Zwei Funkpausen plus zwei Minuten."""
        return max(120.0, min(self.trv_expected_interval * 2 + 120, 3600.0))

    def _preset_is_derived(self) -> bool:
        """Leitet die Integration das Preset nur aus dem Sollwert ab (AVM/FRITZ!DECT)?

        Bei FRITZ!DECT heißt ``preset_mode == "comfort"`` lediglich „Sollwert entspricht der
        Komforttemperatur" – keine Geräteeinstellung, die etwas überstimmt.
        """
        entry = er.async_get(self.hass).async_get(self.trv)
        return bool(entry and entry.platform in DERIVED_PRESET_PLATFORMS)

    @property
    def window_flips_24h(self) -> int:
        """Wie oft ein echter Fensterkontakt in 24 h seinen Zustand gewechselt hat."""
        cutoff = dt_util.utcnow() - timedelta(hours=24)
        return sum(1 for t in getattr(self, "_window_flips", ()) if t >= cutoff)

    def valve_shadow(self) -> dict[str, Any]:
        """Schattenmodus: berechneter Öffnungsgrad neben dem, den das Gerät meldet.

        Wird **nie** geschrieben – nur zum Auswerten, ob eine eigene Ventilregelung tragen würde.
        """
        on, target, reason = self.peek_plan()
        heating = bool(on and self.hvac_on and not self.paused)
        calc = shadow_opening(target, self.current_temperature, heating=heating)
        device = self.valve_position
        return {
            "calc_pct": calc,
            "device_pct": device,
            "diff_pct": None if calc is None or device is None else round(calc - device, 1),
            "target_c": round(target, 1),
            "current_c": None if self.current_temperature is None else round(self.current_temperature, 1),
            "hvac_on": self.hvac_on,
            "paused": self.paused,
            "reason": reason,
            "valve_sources": self.valve_sources,
        }

    def stats_sample(self) -> RoomSample:
        on, target, reason = self.plan()
        return RoomSample(
            heating=self.status == STATUS_HEATING,
            valve=self.valve_position,
            valve_calc=(self.valve_shadow().get("calc_pct")),
            reason=reason,
            target=self.target_temp,
            effective=target,
            plan_on=on and self.hvac_on,
            paused=self.paused,
            temp=self.current_temperature,
            humidity=self.current_humidity,
            humidity_limit=self.vent.humidity_limit if self.humidity_sensor else None,
            mold=self.vent.mold_risk,
            window_open=self.window_open,
            night=self.night_airing,
            occupied=self.occupied,
            co2=self.current_co2,
            sync_failed=self.sync.state == "failed",
            trv_down=self.status == STATUS_TRV,
            hour=dt_util.now().hour,
        )

    def heatup_needed(self) -> int | None:
        """Minuten bis zur Wunschtemperatur, wenn jetzt normal geheizt würde."""
        hub = self.hub
        cur = self.current_temperature
        if hub is None or cur is None or not self.hvac_on or not hub.heating_allowed:
            return None
        return self.heatup.minutes_needed(self.target_temp - cur, hub.outdoor_temp())

    def record_history(self, now: datetime) -> None:
        self.record_mold_sample(now)
        on, target, _reason = self.plan()
        hub = self.hub
        regulating = on and self.hvac_on and not self.paused and self.trv_available() and self.sensor_ok
        ep = self.heatup.update(now, self.current_temperature, target, regulating, hub.outdoor_temp() if hub else None)
        if ep is not None:
            self.log(
                CAT_TARGET,
                tr("Aufgeheizt: +{rise} in {m} min", rise=fmt_temp(ep.rise), m=f"{ep.minutes:.0f}"),
                tr("{rate} °C pro Stunde", rate=dec(ep.rate))
                + (tr(" bei {t} draußen", t=fmt_temp(ep.outdoor)) if ep.outdoor is not None else "")
                + tr(" – gelernt aus {n} Aufheizvorgängen", n=len(self.heatup.episodes)),
            )
            self._save()
        self.health_hist.append(
            HistoryPoint(
                when=now,
                valve=self.valve_position,
                temp=self.current_temperature,
                target=target,
                regulating=on and self.hvac_on and not self.paused and self.trv_available(),
                mold_capped=self.mold_capped,
            )
        )

    def _ext_available(self) -> bool:
        """Liefert der Raumfühler überhaupt einen gültigen Wert? (nicht: „sendet gerade nichts")"""
        state = self.hass.states.get(self.temp_sensor)
        return state is not None and is_valid(state.state)

    def health_issues(self, now: datetime) -> list[Issue]:
        issues: list[Issue] = []
        levels = {}
        for name, entity in self._batteries.items():
            state = self.hass.states.get(entity)
            value = to_float(state.state) if state else None
            if value is not None:
                levels[name] = value
        issues += check_battery(levels)
        if self.monitor:
            # Überwachungsraum: nur Fühler, Batterien und Fenster – nichts am Thermostat
            issues += [
                i
                for i in (
                    check_sensor_missing(
                        None
                        if self.sensor_ok
                        else (now - (self._ext_time or self._started_at)).total_seconds() / 3600,
                        available=self._ext_available(),
                    ),
                    check_window(
                        self.vent.open_minutes / 60 if self.window_open else None,
                        max(
                            ((now - t).total_seconds() / 3600 for t in self._window_unavail_since.values()),
                            default=None,
                        ),
                    ),
                )
                if i is not None
            ]
            return issues
        trv_state = self.hass.states.get(self.trv)
        for check in (
            check_not_warming(list(self.health_hist), now),
            check_hydraulic(list(self.health_hist), now) if self.valve_sensor else None,
            check_sensor_frozen(
                (now - self._ext_changed_at).total_seconds() / 3600 if self._ext_changed_at else None,
                (self.trv_temperature - self._trv_at_ext_change)
                if self.trv_temperature is not None and self._trv_at_ext_change is not None
                else None,
            ),
            Issue("throttled", "warn", tr("Thermostat und Integration verstellen sich"), tr("Zu viele Befehle in kurzer Zeit – die Integration pausiert kurz. Zeitplan/Automatik am Thermostat oder andere Automationen prüfen."))
            if self.throttled_until and now < self.throttled_until else None,
            check_sensor_missing(
                None if self.sensor_ok else (now - (self._ext_time or self._started_at)).total_seconds() / 3600,
                available=self._ext_available(),
            ),
            check_radio(
                sum(1 for t in self._unavail_events if now - t <= timedelta(hours=24)),
                self.sync.state == "failed",
            ),
            check_trv_mode(
                trv_state.state if trv_state else None,
                (trv_state.attributes or {}).get("preset_mode") if trv_state else None,
                device_preset=self.target_via == "comfort_temperature",
                derived_preset=self._preset_is_derived(),
            ),
            check_window_flapping(self.window_flips_24h),
            check_window(
                self.vent.open_minutes / 60 if self.window_open else None,
                max(((now - t).total_seconds() / 3600 for t in self._window_unavail_since.values()), default=None),
            ),
        ):
            if check is not None:
                issues.append(check)
        for extra in getattr(self, "extra_trvs", []):
            issues += extra.issues()
        return issues

    @property
    def issues(self) -> list[Issue]:
        hub = self.hub
        return hub.insights.issues.get(self.entry.entry_id, []) if hub else []

    def _trv_down_confirmed(self) -> None:
        self._trv_down_cancel = None
        if self._trv_down_since is None or self.trv_available():
            return
        self._unavail_events.append(self._trv_down_since)
        minutes = (dt_util.utcnow() - self._trv_down_since).total_seconds() / 60
        self.log(
            CAT_DEVICE,
            tr("Thermostat nicht erreichbar"),
            tr(
                "seit {m} min keine Verbindung – das Gerät meldet sich sonst etwa alle {i} min; "
                "letzter Stand bleibt, Befehle werden nachgeholt",
                m=f"{minutes:.0f}",
                i=f"{self.trv_expected_interval / 60:.0f}",
            ),
            level="info" if self.outage_learning else "warn",
        )

    # ================================================================ Diagnose
    def diagnostics(self) -> dict[str, Any]:
        return {
            "config": self.config,
            "target_temp": self.target_temp,
            "hvac_on": self.hvac_on,
            "window_logic": self.window_logic,
            "window_raw": self._window_raw,
            "window_paused": self.window_paused,
            "last_valid_windows": self._last_valid_windows,
            "external_temperature": self._ext_value,
            "external_time": self._ext_time.isoformat() if self._ext_time else None,
            "sensor_ok": self.sensor_ok,
            "trv_available": self.trv_available(),
            "trv_temperature": self.trv_temperature,
            "trv_setpoint": self._trv_attr(ATTR_TEMPERATURE),
            "trv_preset": self._trv_attr("preset_mode"),
            "trv_on_preset": self.trv_on_preset,
            # Meldetakt und daraus folgende Ausfallgrenze (Issue #33) – macht Fehlalarme prüfbar
            "trv_interval_min": round(self.trv_expected_interval / 60, 1),
            "outage_min": round(self.outage_seconds / 60, 1),
            "outage_learned": not self.outage_learning,
            "outage_samples": len(getattr(self, "_outage_durations", ())),
            "off_method": self._off_method(),
            "calibration_mode": self.cal_mode,
            "offset": self.offset,
            "last_offset_sent": self._last_cal_value,
            "last_cal_send": self._last_cal_send.isoformat() if self._last_cal_send else None,
            "sync_state": self.sync.state,
            "sync_jobs": {
                key: {"description": job.description, "attempts": job.attempts}
                for key, job in self.sync.jobs.items()
            },
            "status": self.status,
            "plan": list(self.plan()),
            "manual_until": self._manual_until.isoformat() if self._manual_until else None,
            "valve_sensor": self.valve_sensor,
            "valve_position": self.valve_position,
            "valve_shadow": self.valve_shadow(),
            "ventilation": self.vent.diagnostics() if self.vent else None,
        }
