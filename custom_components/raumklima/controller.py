"""Kernlogik: ein Raum mit TRV, externem Fühler und Fensterkontakten.

Aufgeteilt in room_windows (Fensterlogik), room_trv (Thermostat ansteuern,
Offset, Schutz gegen Endlosschleifen) und room_health (Gesundheitscheck, Diagnose).
"""

from __future__ import annotations

import asyncio
from collections import deque
from collections.abc import Callable
from datetime import datetime, timedelta
import logging
from typing import Any

from homeassistant.components.climate import HVACAction
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import (
    Event,
    EventStateChangedData,
    HassJob,
    HomeAssistant,
    State,
    callback,
)
from homeassistant.helpers.event import (
    async_call_later,
    async_track_state_change_event,
    async_track_time_interval,
)
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .airing_profile import AiringProfile
from .const import (
    BOOST_MINUTES_MAX,
    BOOST_MINUTES_MIN,
    BOOST_TEMP_MAX,
    BOOST_TEMP_MIN,
    CAL_OFFSET,
    CAL_TARGET,
    CALIBRATION_INTERVAL,
    CONF_AIRING_MIN_MINUTES,
    CONF_AIRING_OCCUPIED_ONLY,
    CONF_AIRING_WINDOWS,
    CONF_BOOST_MINUTES,
    CONF_BOOST_SOURCES,
    CONF_BOOST_TEMP,
    CONF_CALIBRATION_ENTITY,
    CONF_CALIBRATION_MODE,
    CONF_CO2_LIMIT,
    CONF_CO2_SENSOR,
    CONF_COMFORT_TEMP,
    CONF_EXTRA_TRVS,
    CONF_FAST_POLL,
    CONF_FOLLOW_TRV,
    CONF_HEAT_SOURCES,
    CONF_HOME,
    CONF_HUMIDITY_SENSOR,
    CONF_LEARN_AIRING,
    CONF_LIGHT_SIGNALS,
    CONF_LIGHTS,
    CONF_LONG_AIRING,
    CONF_LONG_AIRING_REMIND,
    CONF_LOOK_DARK,
    CONF_MOLD_CAP,
    CONF_MOLD_MODE,
    CONF_NAME,
    CONF_NIGHT_AIRING,
    CONF_NOTIFY,
    CONF_NOTIFY_CAP,
    CONF_OFF_METHOD,
    CONF_ON_PRESET,
    CONF_OVERRIDE_MINUTES,
    CONF_PM25_SENSOR,
    CONF_PREHEAT_LEAD,
    CONF_PREHEAT_MODE,
    CONF_PREHEAT_NOT_BEFORE,
    CONF_PRESENCE,
    CONF_PRESENCE_DELAY,
    CONF_PRESENCE_KIND,
    CONF_PRESENCE_OFF,
    CONF_PRESENCE_TARGET,
    CONF_QUIET_MODE,
    CONF_QUIET_SETBACK,
    CONF_ROOM_ECO,
    CONF_ROOM_ECO_AFTER,
    CONF_ROOM_ECO_DROP,
    CONF_ROOM_PERSONS,
    CONF_ROOM_TYPE,
    CONF_SCHEDULE_FALLBACK,
    CONF_SCHEDULE_FROM,
    CONF_SCHEDULES,
    CONF_SENSOR_STALE_MINUTES,
    CONF_SETBACK_LONG,
    CONF_SETBACK_SHORT,
    CONF_SOLAR,
    CONF_SOLAR_FACADE,
    CONF_SYNC_MAX_RETRIES,
    CONF_SYNC_VERIFY_DELAY,
    CONF_TEMP_SENSOR,
    CONF_TRV,
    CONF_TRV_INTERVAL,
    CONF_VIRTUAL_WINDOW,
    CONF_WALL,
    CONF_WEATHER,
    CONF_WINDOW_CLOSE_DELAY,
    CONF_WINDOW_OPEN_DELAY,
    CONF_WINDOWS,
    DEFAULTS,
    DOMAIN,
    EVENT_RAUMKLIMA,
    KIND_MOISTURE,
    MAX_SENSOR_JUMP,
    MOLD_CAP_MAX,
    OFF_HVAC,
    OFF_MIN_TEMP,
    OFF_PRESET,
    OFF_SOURCE_TRV,
    OFF_SOURCE_USER,
    PREHEAT_MARGIN_MINUTES,
    RECONCILE_INTERVAL,
    SENSOR_JUMP_WINDOW,
    SLOW_RETRY_INTERVAL,
    STATUS_HEATING,
    STATUS_IDLE,
    STATUS_MONITOR,
    STATUS_NIGHT,
    STATUS_OFF,
    STATUS_OFF_TRV,
    STATUS_SEASON,
    STATUS_SENSOR,
    STATUS_SETBACK,
    STATUS_TRV,
    STATUS_WINDOW,
    VALVE_HEATING_MIN,
    WALL_FRSI,
)
from .decision_log import (
    CAT_DEVICE,
    CAT_MANUAL,
    CAT_NOTIFY,
    CAT_SETTINGS,
    CAT_TARGET,
    fmt_temp,
)
from .health import (
    HistoryPoint,
)
from .heatup import HeatupTracker
from .hub import RaumklimaHub, _change_text
from .logic import (
    any_open,
    clamp,
    heating_demand,
    is_valid,
    plausible_reading,
    to_float,
    values_match,
    window_open_state,
)
from .msg import N_, tr
from .occupancy import room_eco_target
from .planning import (
    AWAY_STAGES,
    NIGHT_ROOM_TYPES,
    SOLAR_REDUCTION,
    STAGE_AWAY_LONG,
    STAGE_AWAY_SHORT,
    MoldGuard,
    frost_night_setback,
    next_schedule_window,
    round_up_half,
    saturation_pressure,
    schedule_target,
    schedule_window,
    setback_defaults,
    setback_target,
)
from .room_extra_trvs import AcSource, ExtraTrv
from .room_health import HealthMixin
from .room_lights import LightSignal
from .room_presence import PresenceMixin
from .room_trv import HEAT_PRESETS, MANUAL_OVERRIDE, TrvMixin
from .room_windows import WindowMixin
from .series import RoomSeries
from .shared import domain_data, get_hub, iso, parse_dt
from .sync import SyncManager
from .usage_profile import UsageProfile
from .vent_manager import VentilationManager
from .ventilation import MIN_USEFUL_TARGET, comfort_temperature

_LOGGER = logging.getLogger(__name__)
STORAGE_VERSION = 1
VALVE_CARE = timedelta(minutes=3)

TRV_OUTAGE_SECONDS = 60  # kürzere Aussetzer gelten nicht als Ausfall
REASON_NORMAL = "normal"
REASON_MONITOR = "monitor"
REASON_MANUAL = "manual"
# Feuchtequelle: ab diesem Zuwachs (hPa) in 6 h gilt die Feuchte als „entsteht im Raum"
MESSAGE_MOISTURE_DRY = (
    N_("💧 {room}: Feuchte steigt – lüften statt heizen"),
    N_(
        "In {hours} h von {from} auf {to} %. Draußen ist die Luft trockener: einmal kräftig "
        "stoßlüften bringt mehr als höher heizen."
    ),
)
MESSAGE_MOISTURE_DAMP = (
    N_("🧺 {room}: Feuchtequelle im Raum"),
    N_(
        "In {hours} h von {from} auf {to} %. Lüften hilft gerade nicht – die Außenluft ist "
        "feuchter. Wäsche, Duschen oder viele Personen im Raum?"
    ),
)
# Ab wie vielen Stunden kritischer Wandfeuchte (in 24 h) der Schutz anhebt
MOLD_MIN_HOURS = 2.0
# Deckel über dem Wunsch: tagsüber 2,5 K, nachts 1,5 K (dann lüftet niemand)
MOLD_CAP_DEFAULT = 2.5
MOLD_CAP_NIGHT = 1.5
MOISTURE_RISE = 1.2
MOISTURE_COOLDOWN = timedelta(hours=12)
REASON_SEASON = "season"
REASON_FROST = "frost"
REASON_VALVE_CARE = "valve_care"
REASON_SOLAR = "solar"
REASON_EMPTY = "room_empty"
REASON_SCHEDULE = "schedule"
REASON_BOOST = "boost"
REASON_SCHEDULE_PREHEAT = "schedule_preheat"
REASON_SLEEP = "sleep"
REASON_MOLD = "mold"
REASON_SCHEDULE_FALLBACK = "schedule_fallback"
REASON_HOME_OFFICE = "home_office"
REASON_PRESENCE = "presence"
REASON_DEVICE_AUTO = "device_auto"
# Schimmelschutz-Stufen (Raum-Einstellung)
MOLD_STRICT = "strict"
MOLD_WISH = "wish"
MOLD_OFF = "off"
# Zeitplan: Wert außerhalb der Fenster
SCHEDULE_FALLBACK_WISH = "wish"
SCHEDULE_FALLBACK_SHORT = "short"
SCHEDULE_FALLBACK_LONG = "long"
SCHEDULE_FALLBACK_FROST = "frost"
# Bei diesen Gründen greift der Schimmelschutz nicht ein (bewusste Aktion oder Heizung ohnehin aus)
MOLD_EXEMPT = frozenset(
    {REASON_VALVE_CARE, REASON_FROST, REASON_SEASON, REASON_BOOST, REASON_MONITOR, REASON_MOLD}
)
# Diese Einstellungen wirken sofort, ohne den Raum neu zu laden
LIVE_OPTIONS = frozenset(
    {
        CONF_COMFORT_TEMP,
        CONF_SETBACK_SHORT,
        CONF_SETBACK_LONG,
        CONF_WINDOW_OPEN_DELAY,
        CONF_WINDOW_CLOSE_DELAY,
        CONF_NIGHT_AIRING,
        CONF_VIRTUAL_WINDOW,
        CONF_HOME,
        CONF_SOLAR,
        CONF_SOLAR_FACADE,
        CONF_LIGHTS,
        CONF_LIGHT_SIGNALS,
        CONF_PRESENCE,
        CONF_PRESENCE_KIND,
        CONF_ROOM_ECO,
        CONF_ROOM_ECO_AFTER,
        CONF_ROOM_ECO_DROP,
        CONF_SCHEDULES,
        CONF_BOOST_TEMP,
        CONF_BOOST_MINUTES,
        CONF_OVERRIDE_MINUTES,
        CONF_AIRING_OCCUPIED_ONLY,
        CONF_FAST_POLL,
        CONF_LONG_AIRING,
        CONF_LONG_AIRING_REMIND,
        CONF_AIRING_WINDOWS,
        CONF_LEARN_AIRING,
        CONF_AIRING_MIN_MINUTES,
        CONF_TRV_INTERVAL,
        CONF_CO2_LIMIT,
        CONF_NOTIFY_CAP,
        CONF_MOLD_CAP,
        CONF_MOLD_MODE,
        CONF_PREHEAT_LEAD,
        CONF_PREHEAT_MODE,
        CONF_PREHEAT_NOT_BEFORE,
        CONF_QUIET_MODE,
        CONF_ROOM_PERSONS,
        CONF_WALL,
        CONF_SCHEDULE_FALLBACK,
    }
)


class RaumklimaController(WindowMixin, TrvMixin, HealthMixin, PresenceMixin):
    """Steuert genau einen Raum."""

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        self.hass = hass
        self.entry = entry
        self.config: dict[str, Any] = {**DEFAULTS, **entry.data, **entry.options}
        self.name: str = self.config[CONF_NAME]
        # Leeres Thermostat = Überwachungsraum (nur Sensoren, keine Heizung)
        self.trv: str = str(self.config.get(CONF_TRV) or "")
        self.monitor: bool = not self.trv
        self.temp_sensor: str = self.config[CONF_TEMP_SENSOR]
        self.humidity_sensor: str | None = self.config.get(CONF_HUMIDITY_SENSOR)
        self.co2_sensor: str | None = self.config.get(CONF_CO2_SENSOR) or None
        self.pm25_sensor: str | None = self.config.get(CONF_PM25_SENSOR) or None
        self.windows: list[str] = list(self.config.get(CONF_WINDOWS) or [])
        self._extra_ids: list[str] = [
            e for e in (self.config.get(CONF_EXTRA_TRVS) or []) if e and e != self.trv
        ]
        self.cal_mode: str = self.config[CONF_CALIBRATION_MODE]
        # Geglättete Abweichung „Thermostat misst − Raumfühler misst“.
        # Wird gelernt und bleibt erhalten, auch wenn der Fühler lange nicht meldet (Livisi/HMIP).
        self.shift: float = 0.0
        self.cal_entity: str | None = self.config.get(CONF_CALIBRATION_ENTITY)
        if self.cal_mode == CAL_OFFSET and not self.cal_entity:
            _LOGGER.warning(
                "%s: Kalibrierart Offset ohne Kalibrier-Entität – nutze 'target'",
                self.name,
            )
            self.cal_mode = CAL_TARGET

        # Dauerhafter Zustand (Store). Kein geratener Startwert: 20,0 °C stand nach jedem
        # Neustart für eine Sekunde im Sollwert und erzeugte Zacken im Bericht.
        self.target_temp: float = float(self.config.get(CONF_COMFORT_TEMP) or 20.0)
        self.hvac_on: bool = True
        self.hvac_auto: bool = False  # Gerät fährt sein eigenes Programm (Karten-Modus „Auto“)
        # Warum der Raum aus ist (None = an): OFF_SOURCE_USER / OFF_SOURCE_TRV
        self.off_source: str | None = None
        # Boost: zeitlich begrenzt wärmer (None = kein Boost)
        self.boost_until: datetime | None = None
        self.boost_open: bool = False  # Boost ohne Zeitlimit, bis „Beenden"
        self.boost_temperature: float | None = None
        self.window_logic: bool = True
        self.trv_on_preset: str | None = None

        # Laufzeit
        self.window_paused = False
        # Zeitpunkte der Fenster-Öffnungen (24 h): ein klemmender Kontakt erzeugt Heizpausen
        # im Minutentakt – das fällt nur so auf, nicht in der Temperaturkurve.
        self._window_flips: deque[datetime] = deque(maxlen=400)
        self._window_raw = False
        self.night_since: datetime | None = None  # Schlafen bei offenem Fenster seit
        self._last_valid_windows: dict[str, str | None] = {}
        self._window_timer: Callable[[], None] | None = None
        self._ext_value: float | None = None
        self._ext_time: datetime | None = None
        self._ext_candidate: float | None = None
        self._last_cal_send: datetime | None = None
        self._last_cal_value: float | None = None
        self._last_target_setpoint: float | None = None
        self._preset_changed_at: datetime | None = None
        self._unsubs: list[Callable[[], None]] = []
        self._listeners: list[Callable[[], None]] = []
        self._apply_lock = asyncio.Lock()
        self.valve_sensor: str | None = None
        self._valve_hunt_until: datetime | None = None  # Zeitfenster für die Nachsuche
        self._valve_last_try: datetime | None = None
        self._frost_active = False
        self._solar_active = False
        self.frost_night_low: float | None = None
        self._manual_until: datetime | None = None
        self._valve_care_until: datetime | None = None
        self._started = False
        # Gesundheitscheck
        self.health_hist: deque[HistoryPoint] = deque(maxlen=150)
        self._unavail_events: deque[datetime] = deque(maxlen=50)
        self._ext_changed_at: datetime | None = None
        self._trv_at_ext_change: float | None = None
        self._window_unavail_since: dict[str, datetime] = {}
        # Seit wann steht das Gerät auf einem anderen Sollwert als erwartet (Gesundheitsprüfung).
        self._setpoint_off_since: dict[str, datetime] = {}
        # Fenster ohne Kontakt (Temperatursturz)
        self._temp_hist: deque[tuple[datetime, float]] = deque(maxlen=40)
        self.mold_guard = MoldGuard()
        self.virtual_open_at: datetime | None = None
        self._raw_virtual = False
        self._trv_down_since: datetime | None = None
        # Beobachtete Funkpausen (Sekunden) – daraus lernt der Raum seine eigene Ausfallgrenze.
        self._outage_durations: deque[float] = deque(maxlen=24)
        self._started_at: datetime = dt_util.utcnow()
        # Schutz gegen Endlosschleifen mit dem Thermostat
        self.preset_learned: str | None = None
        self._preset_flips: deque[tuple[datetime, str]] = deque(maxlen=20)
        self._restore_paused_until: datetime | None = None
        self._sends: deque[datetime] = deque(maxlen=200)
        self.throttled_until: datetime | None = None
        self._trv_down_cancel: Callable[[], None] | None = None
        self.heatup = HeatupTracker()
        self.airing = AiringProfile()
        self.usage = UsageProfile()
        self._virtual_low: float = 0.0
        self._virtual_cancel: Callable[[], None] | None = None
        self._batteries: dict[str, str] = {}
        self._store: Store[dict[str, Any]] = Store(
            hass, STORAGE_VERSION, f"{DOMAIN}.{entry.entry_id}"
        )

        self.vent = VentilationManager(self, None)
        # Kurve für die Diagnose-Datei (4-Minuten-Raster, zusätzlich bei Änderungen).
        self.series = RoomSeries()
        self.lights = LightSignal(self)
        self.source_cfg = self._source_config()
        self._extra_ids = [s["entity"] for s in self.source_cfg if s["type"] == "trv"]
        self.extra_trvs = [ExtraTrv(self, e) for e in self._extra_ids]
        self.ac_sources = [AcSource(self, s) for s in self.source_cfg if s["type"] == "ac"]
        self._extra_by_id = {x.entity_id: x for x in self.extra_trvs}
        self._ac_by_id = {x.entity_id: x for x in self.ac_sources}
        self._rf: dict[str, Any] = {"day": "", "sent": 0, "retries": 0}
        self.sync = SyncManager(
            schedule=self._schedule,
            run_task=lambda coro: hass.async_create_task(coro),
            is_target_available=self.trv_available,
            verify_delay=float(self.config[CONF_SYNC_VERIFY_DELAY]),
            max_retries=int(self.config[CONF_SYNC_MAX_RETRIES]),
            slow_interval=SLOW_RETRY_INTERVAL,
            device_interval=lambda: self.trv_report_interval,
            on_change=self._notify,
            on_failed=self._on_sync_failed,
            on_send=self._count_rf,
            on_recovered=self._on_sync_recovered,
            on_event=self._on_sync_event,
        )
        # Livisi bestätigt Sollwerte verzögert – verify_delay anheben
        try:
            import homeassistant.helpers.entity_registry as er
            _reg = er.async_get(hass)
            _entry = _reg.async_get(self.trv)
            if _entry is not None and _entry.platform == "livisi" and self.sync.verify_delay < 60:
                self.sync.verify_delay = 60.0
        except Exception:  # noqa: BLE001
            pass
        self._last_plan: tuple[bool, float, str] | None = None
        self._peeking = False  # plan() nur lesen, keine Zustände verbrauchen
        self._trv_reports: deque[datetime] = deque(maxlen=6)

    # ================================================================ Lifecycle
    async def async_start(self) -> None:
        """Gespeicherten Zustand laden, Listener registrieren, abgleichen."""
        stored = await self._store.async_load()
        if stored:
            self.target_temp = float(stored.get("target_temp", self.target_temp))
            self.hvac_on = bool(stored.get("hvac_on", self.hvac_on))
            self.hvac_auto = bool(stored.get("hvac_auto", self.hvac_auto))
            self.off_source = stored.get("off_source") or (None if self.hvac_on else OFF_SOURCE_USER)
            self.boost_until = parse_dt(stored.get("boost_until"))
            self.boost_open = bool(stored.get("boost_open") or False)
            self.boost_temperature = stored.get("boost_temperature")
            self.window_logic = bool(stored.get("window_logic", self.window_logic))
            self.trv_on_preset = stored.get("trv_on_preset")
            self.preset_learned = stored.get("preset_learned")
            if stored.get("shift") is not None:
                self.shift = float(stored.get("shift") or 0.0)
            self.heatup.load(stored.get("heatup"))
            self.mold_guard.load(stored.get("mold_vapour"))
            if isinstance(stored.get("rf"), dict):
                self._rf = stored["rf"]
            for seconds in stored.get("outage_durations") or []:
                try:
                    self._outage_durations.append(float(seconds))
                except (TypeError, ValueError):
                    continue
            self.airing.load(stored.get("airing_profile"))
            self.usage.load(stored.get("usage_profile"))
        elif self.trv_available():
            # Erster Start: Wunschtemperatur statt Zufallswert am TRV (Eco-Speicher, 5 °C …)
            self.target_temp = self.comfort_temp
            self.hvac_on = not self._is_trv_off(self._trv_state(), self._off_method())
            self.off_source = None if self.hvac_on else OFF_SOURCE_TRV
            preset = self._trv_attr("preset_mode")
            if preset and preset != "off":
                self.trv_on_preset = preset
            self._save()

        self.vent.load((stored or {}).get("vent"))
        self.series.load((stored or {}).get("series"))
        self.valve_sensor = self._find_valve_sensor()
        for extra in self.extra_trvs:
            extra.discover()
        self._batteries = self._find_batteries()

        tracked = [self.trv, self.temp_sensor, *self.windows, *(e for x in self.extra_trvs for e in x.tracked()), *(e for x in self.ac_sources for e in x.tracked())]
        if self.humidity_sensor:
            tracked.append(self.humidity_sensor)
        if self.co2_sensor:
            tracked.append(self.co2_sensor)
        if self.pm25_sensor:
            tracked.append(self.pm25_sensor)
        if self.config.get(CONF_WEATHER):
            tracked.append(self.config[CONF_WEATHER])
        if self.valve_sensor:
            tracked.append(self.valve_sensor)
        if self.cal_entity:
            tracked.append(self.cal_entity)
        self._unsubs.append(
            async_track_state_change_event(self.hass, tracked, self._on_state_change)
        )
        self._unsubs.append(
            async_track_time_interval(
                self.hass, self._on_reconcile, timedelta(seconds=RECONCILE_INTERVAL)
            )
        )
        self._unsubs.append(
            async_track_time_interval(
                self.hass, self._on_cal_interval, timedelta(seconds=CALIBRATION_INTERVAL)
            )
        )
        # Träge Geräte (Homematic & Co.) melden Ventilstellungen erst spät – optional nachfragen.
        self._unsubs.append(
            async_track_time_interval(self.hass, self._on_fast_poll, timedelta(seconds=120))
        )

        # Startzustand: Fenster ohne Verzögerung übernehmen
        for entity in self.windows:
            state = self.hass.states.get(entity)
            if state and is_valid(state.state):
                self._last_valid_windows[entity] = window_open_state(entity, state)
        self._window_raw = any_open(self._last_valid_windows, self.windows)
        if not self._window_raw and self.vent.restored_open is not None:
            # Der Kontakt war beim Start stumm (Funkloch) – laut Speicher ist das Fenster aber
            # offen. Dann ist das keine neue Öffnung: ohne diese Zeile protokolliert jeder
            # Neustart „Fenster auf“, pausiert erneut und schreibt kurz den Sollwert ans Gerät.
            self._window_raw = True
        self.window_paused = self._window_raw
        if self._window_raw and self.night_applies():
            self.night_since = dt_util.utcnow()
        self._ingest_sensor(self.hass.states.get(self.temp_sensor))
        await self.vent.async_start()
        self.track_presence()
        self.update_presence(initial=True)

        domain_data(self.hass)["rooms"][self.entry.entry_id] = self
        self._started = True
        self.hass.async_create_task(self._apply())
        self.hass.async_create_task(self.async_calibrate())

    async def async_stop(self) -> None:
        """Alles abmelden."""
        self._started = False
        domain_data(self.hass)["rooms"].pop(self.entry.entry_id, None)
        for unsub in self._unsubs:
            unsub()
        self._unsubs.clear()
        for attr in ("_window_timer", "_trv_down_cancel", "_virtual_cancel"):
            cancel = getattr(self, attr)
            if cancel:
                cancel()
                setattr(self, attr, None)
        self.sync.cancel_all()
        self.lights.stop()
        for extra in self.extra_trvs:
            extra.stop()
        self.stop_presence()
        if self.vent:
            self.vent.async_stop()
        await self._store.async_save(self._stored_data())

    def _stored_data(self) -> dict[str, Any]:
        return {
            "target_temp": self.target_temp,
            "hvac_on": self.hvac_on,
            "hvac_auto": self.hvac_auto,
            "off_source": self.off_source,
            "boost_until": iso(self.boost_until),
            "boost_open": self.boost_open,
            "boost_temperature": self.boost_temperature,
            "window_logic": self.window_logic,
            "trv_on_preset": self.trv_on_preset,
            "preset_learned": self.preset_learned,
            "shift": self.shift,
            "vent": self.vent.export() if self.vent else None,
            "series": self.series.export(),
            "heatup": self.heatup.dump(),
            "mold_vapour": self.mold_guard.dump(),
            "rf": self._rf,
            "airing_profile": self.airing.export(),
            "usage_profile": self.usage.export(),
            "outage_durations": list(self._outage_durations),
        }

    # ---------------------------------------------------------------- Gewohntes Lüften
    def record_airing(self, when: datetime, minutes: float) -> None:
        """Einen abgeschlossenen Lüftvorgang für das Lernen merken."""
        self.airing.record(dt_util.as_local(when), minutes)
        self._save()

    @callback
    def record_usage(self) -> None:
        """Belegung für das Nutzungsprofil festhalten (nur mit Präsenzmelder)."""
        if not self.presence_sensors:
            return
        if self.usage.mark(dt_util.now(), self.occupied is True):
            self._save()

    @property
    def usage_summary(self) -> dict[str, Any]:
        return self.usage.summary() if self.presence_sensors else {}

    def airing_learned(self, when: datetime) -> bool:
        return self.airing.learned(when)

    def airing_count(self, when: datetime) -> int:
        return self.airing.count(when)

    def _save(self) -> None:
        self._store.async_delay_save(self._stored_data, 5)

    def save(self) -> None:
        """Öffentlich: Zustand speichern (z. B. vom Lüftungsassistenten)."""
        self._save()

    @callback
    def notify_listeners(self) -> None:
        self._notify()

    @callback
    def settings_summary(self) -> dict[str, Any]:
        """Was eingestellt ist – für die Einstellungs-Karte."""
        cfg = self.config
        vent = self.vent
        hub = self.hub
        entry = self.hass.config_entries.async_get_entry(self.entry.entry_id) or self.entry
        own = {**(entry.data or {}), **(entry.options or {})}
        # Struktur (Raumtyp, erkannte Abgleichart) ist keine Einstellung – nicht mitzählen.
        skip = {CONF_ROOM_TYPE, CONF_CALIBRATION_MODE}
        changed = sorted(k for k, v in DEFAULTS.items() if k in own and own.get(k) != v and k not in skip)
        for key in (CONF_SCHEDULES, CONF_PRESENCE, CONF_LIGHTS, CONF_SOLAR_FACADE):
            if own.get(key):
                changed.append(key)
        return {
            "entry_id": self.entry.entry_id,
            "mold_mode": self.config.get(CONF_MOLD_MODE),
            "airing_min_minutes": self.config.get(CONF_AIRING_MIN_MINUTES),
            "schedule_fallback": self.config.get(CONF_SCHEDULE_FALLBACK),
            "changed": changed,
            "trv": self.trv,
            "valve_reported": self.valve_position is not None,
            "valve_own": self.valve_own,
            "room_type": vent.room_type if vent else cfg.get(CONF_ROOM_TYPE),
            "weather_entity": vent.weather if vent else cfg.get(CONF_WEATHER),
            "notify_targets": vent.notify_targets if vent else [],
            "tts_targets": vent.tts_targets if vent else [],
            "quiet_start": vent.quiet_start if vent else None,
            "quiet_end": vent.quiet_end if vent else None,
            "repeat_minutes": vent.repeat_minutes if vent else None,
            "max_drop": vent.max_drop if vent else None,
            "hub": bool(hub),
            "look_dark": hub.opt(CONF_LOOK_DARK) if hub is not None else "auto",
            "comfort_temperature": cfg.get(CONF_COMFORT_TEMP),
            "setback_short": self.setback_short,
            "setback_long": self.setback_long,
            "night_airing": self.night_mode,
            "virtual_window": self.virtual_mode,
            "solar_gain": bool(self.config.get(CONF_SOLAR)),
            "solar_facade": self.config.get(CONF_SOLAR_FACADE) or "",
            "schedules": self.schedules,
            "schedule_from": self.config.get(CONF_SCHEDULE_FROM) or "",
            "boost_temperature": cfg.get(CONF_BOOST_TEMP),
            "boost_minutes": cfg.get(CONF_BOOST_MINUTES),
            "presence_sensors": self.sensor_kinds(),
            "presence_kind": self.config.get(CONF_PRESENCE_KIND) or "auto",
            "room_eco": self.room_eco_mode,
            "room_eco_enabled": self.room_eco_enabled(),
            "room_eco_after": self.room_eco_after,
            "room_eco_drop": self.room_eco_drop,
            "extra_trvs": [x.summary() for x in self.extra_trvs],
            "ac_sources": [x.summary() for x in self.ac_sources],
            "heat_sources": [
                {k: src.get(k) for k in ("id", "entity", "name", "type", "offset", "trigger", "untouched")}
                for src in self.all_sources
            ],
            "boost_sources": self.config.get(CONF_BOOST_SOURCES) or "selected",
            "signal_lights": self.lights.lights,
            "light_signals": self.lights.signals,
            "virtual_active": self.virtual_enabled(),
            "heatup": {
                "episodes": len(self.heatup.episodes),
                "rate": self.heatup.rate(self.hub.outdoor_temp() if self.hub else None),
                "minutes_2k": self.heatup.minutes_needed(2.0, self.hub.outdoor_temp() if self.hub else None),
            },
            "humidity_sensor": cfg.get(CONF_HUMIDITY_SENSOR),
            "co2_sensor": self.co2_sensor,
            "pm25_sensor": self.pm25_sensor,
            "temperature_sensor": cfg.get(CONF_TEMP_SENSOR),
            "windows": self.windows,
            "comfort_configured": cfg.get(CONF_COMFORT_TEMP) not in (None, "", 0),
            "window_open_delay": cfg.get(CONF_WINDOW_OPEN_DELAY),
            "window_close_delay": cfg.get(CONF_WINDOW_CLOSE_DELAY),
            "calibration_mode": cfg.get(CONF_CALIBRATION_MODE),
            "calibration_entity": cfg.get(CONF_CALIBRATION_ENTITY),
            "on_preset": cfg.get(CONF_ON_PRESET),
            "off_method": cfg.get(CONF_OFF_METHOD),
            "follow_trv": cfg.get(CONF_FOLLOW_TRV),
            "notify_on_failure": cfg.get(CONF_NOTIFY),
            "sensor_stale_minutes": cfg.get(CONF_SENSOR_STALE_MINUTES),
            "sync_verify_delay": cfg.get(CONF_SYNC_VERIFY_DELAY),
            "sync_max_retries": cfg.get(CONF_SYNC_MAX_RETRIES),
        }

    def apply_live_options(self, changes: dict[str, Any]) -> bool:
        """Einstellungen aus der Karte übernehmen, ohne den Raum neu zu laden.

        False, wenn eine Änderung einen Neustart braucht (z. B. Raumtyp mit eigenen Standardwerten).
        """
        if not self._started or not set(changes) <= LIVE_OPTIONS:
            return False
        changed = {k: v for k, v in changes.items() if self.config.get(k) != v}
        if not changed:
            return True
        old_hub = self.hub
        old_values = {k: self.config.get(k) for k in changed}
        # self.config ist dasselbe Objekt, das auch der Lüftungsassistent nutzt
        self.config.update(changed)
        self.log(
            CAT_SETTINGS,
            tr("Einstellungen geändert"),
            ", ".join(_change_text(k, old_values[k], v) for k, v in changed.items()),
        )
        # Wunschtemperatur aus den Einstellungen muss den laufenden Sollwert nachziehen –
        # sonst heizt der Raum weiter auf den alten Wert, bis er neu geladen wird (Issue #22).
        if changed.keys() & {CONF_COMFORT_TEMP, CONF_ROOM_TYPE}:
            new_wish = self.comfort_temp
            if new_wish != self.target_temp:
                self.target_temp = new_wish
                self.log(
                    CAT_SETTINGS,
                    tr("Wunschtemperatur übernommen"),
                    tr("neuer Sollwert {t} aus den Einstellungen", t=fmt_temp(new_wish)),
                )
        if changed.keys() & {CONF_PRESENCE, CONF_PRESENCE_KIND, CONF_ROOM_ECO, CONF_ROOM_ECO_AFTER, CONF_ROOM_ECO_DROP}:
            self.track_presence()
            self.update_presence()
        if self.virtual_open_at is not None and not self.virtual_enabled():
            self._close_virtual("off")
        new_hub = self.hub
        if new_hub is not old_hub:
            for hub in (old_hub, new_hub):
                if hub is not None:
                    hub.notify_entities()
        self._notify()
        self.hass.async_create_task(self._apply())
        return True

    @staticmethod
    def _fmt_opt(value: Any) -> str:
        if value is None or value == "":
            return tr("Standard")
        if isinstance(value, float):
            return fmt_temp(value) if value < 40 else f"{value:.0f}"
        return str(value)

    def fire_event(self, kind: str, data: dict[str, Any]) -> None:
        """Ereignis für eigene Automationen (raumklima_event)."""
        self.hass.bus.async_fire(
            EVENT_RAUMKLIMA,
            {"type": kind, "room": self.name, "entry_id": self.entry.entry_id, **data},
        )
        self.lights.on_event(kind, data)
        field = {"please_open": "vent_open_n", "done": "vent_done_n", "please_close": "vent_close_n", "too_cold": "vent_cold_n"}.get(data.get("state")) if kind == "ventilation" else None
        hub = self.hub
        if field and hub is not None:
            hub.insights.count(self.entry.entry_id, field)

    def log_light(self, what: str, lights: list[str]) -> None:
        names = []
        for entity_id in lights:
            st = self.hass.states.get(entity_id)
            names.append(st.name if st else entity_id)
        self.log(CAT_NOTIFY, tr("Lichtsignal: {what}", what=tr(what)), ", ".join(names))




    # ================================================================ Listener
    @callback
    def async_add_listener(self, update: Callable[[], None]) -> Callable[[], None]:
        """Entitäten melden sich hier für Updates an."""
        self._listeners.append(update)

        @callback
        def remove() -> None:
            self._listeners.remove(update)

        return remove

    @callback
    def _notify(self) -> None:
        for update in list(self._listeners):
            update()

    @callback
    def _schedule(self, delay: float, action: Callable[[], Any]) -> Callable[[], None]:
        job = HassJob(callback(lambda _now: action()), cancel_on_shutdown=True)
        return async_call_later(self.hass, delay, job)







    async def _write_off_setpoint(self) -> None:
        """Abschalt-Sollwert schreiben – Gerätegrenze erst hier lesen (Issue #37).

        Solange das Gerät seine Mindesttemperatur nicht meldet, gibt es keinen sinnvollen Wert:
        der frühere Rückfall (5,0 °C) stand dann dauerhaft „unbestätigt" im Sync und löste nach
        fünf Runden eine dringende Meldung aus, obwohl nichts zu tun war.
        """
        low = to_float(self._trv_attr("min_temp"))
        if low is None:
            raise RuntimeError("Mindesttemperatur des Geräts noch unbekannt")
        await self._write_setpoint(low)

    def _update_shift(self) -> None:
        """Abweichung zwischen Thermostat- und Raumfühler nachführen und dauerhaft merken.

        Die Livisi/HMIP-Thermostate regeln auf ihren eigenen Fühler. Liegt der um 1,2 K unter dem
        Raumfühler, muss der Sollwert um 1,2 K tiefer gesetzt werden – sonst heizt der Raum über.
        Früher wurde das nur im Moment einer Messung gerechnet; meldet der Fühler danach lange nicht
        (Batteriegeräte), blieb der unkompensierte Wert stehen.
        """
        ext = self._ext_value
        trv = self.trv_temperature
        if ext is None or trv is None:
            return
        diff = trv - ext
        if abs(diff) > 6.0:  # unplausibel (Fühler defekt, Fenster offen) – nicht übernehmen
            return
        diff = max(-4.0, min(4.0, diff))
        # Beim ersten Mal direkt übernehmen, danach sanft nachführen.
        new = round(diff if self.shift == 0.0 else self.shift * 0.7 + diff * 0.3, 2)
        if abs(new - self.shift) < 0.05:
            return
        self.shift = new
        self._save()

    @property
    def sensor_ok(self) -> bool:
        """Externer Fühler liefert einen brauchbaren Wert.

        Das Alter allein zählt nicht: batteriebetriebene Fühler (Homematic, Danfoss) senden nur bei
        Änderung. Ein drei Stunden alter Wert ist bei stabiler Temperatur weiterhin gültig – vorher
        meldete der Raum „Fühler ausgefallen", obwohl das Gerät erreichbar war (Issue #11).
        Ein echter Ausfall zeigt sich am Entitätszustand (unavailable/unknown/kein Wert).
        """
        state = self.hass.states.get(self.temp_sensor)
        if state is None or not is_valid(state.state):
            return False
        # Ein gültiger Zustand genügt: der gemerkte Wert kann fehlen, wenn der Fühler beim Start
        # der Zentrale noch nicht bereit war (Tuya ZTH01 meldet erst Minuten später) – Issue #10.
        return self._ext_value is not None or to_float(state.state) is not None

    @property
    def sensor_age_minutes(self) -> float | None:
        """Minuten seit der letzten Meldung des Fühlers (nur für Diagnose/Protokoll)."""
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
        """Raumtemperatur: externer Fühler, im Notfall das TRV."""
        if self.sensor_ok:
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
        if value is not None:
            return value
        return self.trv_humidity

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

    @property
    def schedules(self) -> list[dict[str, Any]]:
        """Zeitplan dieses Raums – oder der eines anderen Raums (geteilt).

        Geteilt wird nur eine Ebene: der Zielraum nutzt dessen eigenen Zeitplan, damit
        keine Ketten oder Ringe entstehen können.
        """
        source = str(self.config.get(CONF_SCHEDULE_FROM) or "").strip()
        if source and source != self.entry.entry_id and self.hub is not None:
            other = (getattr(self.hub, "rooms", {}) or {}).get(source)
            if other is not None and other is not self:
                return list((other.config or {}).get(CONF_SCHEDULES) or [])
        return list(self.config.get(CONF_SCHEDULES) or [])

    @property
    def offset(self) -> float | None:
        if not self.cal_entity:
            return None
        state = self.hass.states.get(self.cal_entity)
        return to_float(state.state) if state else None

    # ================================================================ Planung
    @property
    def hub(self) -> RaumklimaHub | None:
        return get_hub(self.hass, self.config.get(CONF_HOME))

    @property
    def manual_until(self) -> datetime | None:
        """Bis wann eine Handverstellung gilt (Abwesenheit oder pausierter Zeitplan)."""
        if self._manual_until is None:
            return None
        return self._manual_until if self._manual_until > dt_util.utcnow() else None

    @property
    def override_minutes(self) -> float:
        """So lange pausiert ein Zeitplan, wenn jemand von Hand die Temperatur stellt (0 = aus)."""
        value = to_float(self.config.get(CONF_OVERRIDE_MINUTES))
        return value if value is not None else 120.0

    @property
    def setback_short(self) -> float:
        value = to_float(self.config.get(CONF_SETBACK_SHORT))
        return value if value is not None else setback_defaults(self.config.get(CONF_ROOM_TYPE))[0]

    @property
    def setback_long(self) -> float:
        value = to_float(self.config.get(CONF_SETBACK_LONG))
        return value if value is not None else setback_defaults(self.config.get(CONF_ROOM_TYPE))[1]

    def plan(self) -> tuple[bool, float, str]:
        """(heizen?, Zieltemperatur, Grund) – Regelkette mit Schimmelschutz als Boden.

        Die Doku sagt zu, dass der Schimmelschutz vorrangig bleibt („Der Zeitplan setzt nur den
        Sollwert: Fenster, Frost, Schimmel, Heizpause und Abwesenheit bleiben vorrangig“). Deshalb
        gilt er als Nachbedingung für *jeden* Zweig, der unter dem Feuchte-Boden liegen würde –
        auch Zeitplan und Ruhezeit, die ihn vorher nicht geprüft haben.
        """
        on, target, reason = self._plan_rules()
        return self._mold_floor(on, target, reason)

    def _mold_floor(self, on: bool, target: float, reason: str) -> tuple[bool, float, str]:
        """Schimmelschutz als Boden – Stufe je Raum (streng / nur bis Wunsch / aus).

        Drei Bremsen verhindern, dass die Rechnung ins Absurde läuft:

        * offenes Fenster: kein Boden (Heizen gegen ein offenes Fenster ist Verschwendung)
        * Stundenbudget: nur wenn die Wandfläche über längere Zeit über 80 % lag
        * Deckel: höchstens Wunsch + 2,5 K (nachts 1,5 K), weil Heizen kein Feuchteproblem löst
        """
        mode = self.config.get(CONF_MOLD_MODE) or MOLD_STRICT
        window_open = bool(self.paused or self.window_paused)
        if mode == MOLD_OFF or not on or reason in MOLD_EXEMPT or not self.humidity_capable or window_open:
            self._mold_raw = None  # Schutz greift nicht: Hysterese zurücksetzen
            self._mold_capped = False
            return on, target, reason
        hub = self.hub
        if hub is None:
            return on, target, reason
        mold = self.mold_min(hub)
        if mold is None:
            self._mold_raw = None
            self._mold_capped = False
            return on, target, reason

        # Stundenbudget: kurze Spitzen (Kochen, Duschen) heizen wir nicht weg.
        budget = self.mold_guard.surface_rh_hours(dt_util.utcnow())
        if budget < MOLD_MIN_HOURS:
            self._mold_capped = False
            return on, target, reason

        if mode == MOLD_WISH:
            mold = min(mold, self.target_temp)  # nur bis zum Wunsch anheben

        cap = self.mold_cap
        if self.hub is not None and self.hub.quiet_now():
            cap = min(cap, MOLD_CAP_NIGHT)
        limit = round_up_half(self.target_temp + cap)
        capped = mold > limit + 0.05
        mold = min(mold, limit)
        self._mold_capped = capped
        if target >= mold - 0.05:
            return on, target, reason
        return True, min(mold, self.trv_max), REASON_MOLD

    @property
    def mold_cap(self) -> float:
        """Wie weit der Feuchte-Boden den Wunsch höchstens anheben darf (K)."""
        try:
            value = float(self.config.get(CONF_MOLD_CAP, MOLD_CAP_DEFAULT))
        except (TypeError, ValueError):
            value = MOLD_CAP_DEFAULT
        return max(0.0, min(MOLD_CAP_MAX, value))

    @property
    def mold_capped(self) -> bool:
        """Hat der Deckel begrenzt? Dann ist Lüften die Antwort, nicht Heizen."""
        return bool(getattr(self, "_mold_capped", False))

    @property
    def mold_risk_hours(self) -> float:
        """Stunden der letzten 24 h mit kritischer Wandfeuchte."""
        return self.mold_guard.surface_rh_hours(dt_util.utcnow())

    def surface_humidity(self) -> float | None:
        """Relative Feuchte an der kältesten Wandstelle in Prozent."""
        hub = self.hub
        temp = self.current_temperature
        rh = self.current_humidity
        if hub is None or temp is None or rh is None or rh <= 0:
            return None
        outdoor = hub.outdoor_temp()
        if outdoor is None:
            return None
        vapour = rh / 100.0 * saturation_pressure(temp)
        surface_temp = outdoor + self.room_frsi * (temp - outdoor)
        saturation = saturation_pressure(surface_temp)
        if saturation <= 0:
            return None
        return round(100.0 * vapour / saturation, 1)

    @property
    def room_frsi(self) -> float:
        """Temperaturfaktor der kältesten Wandstelle – Raum vor Wohnung.

        Eine Außenecke (0,62) wird deutlich kälter als eine Innenwand (0,82) und braucht
        deshalb mehr Schutz; ein innenliegendes Bad praktisch keinen.
        """
        wall = str(self.config.get(CONF_WALL) or "auto")
        if wall in WALL_FRSI:
            return WALL_FRSI[wall]
        hub = self.hub
        return hub.frsi if hub is not None else 0.70

    def mold_min(self, hub: RaumklimaHub) -> float | None:
        """Feuchte-Mindesttemperatur aus dem 24-h-Mittel (siehe ``MoldGuard``)."""
        return self.mold_guard.floor(
            dt_util.utcnow(), self.current_temperature, self.current_humidity, hub.outdoor_temp(), self.room_frsi
        )

    def _count_rf(self, attempts: int) -> None:
        """Funkbefehl zählen – je Tag, mit Wiederholungen (Batterie-Diagnose)."""
        today = dt_util.now().date().isoformat()
        if self._rf.get("day") != today:
            self._rf = {"day": today, "sent": 0, "retries": 0}
        self._rf["sent"] = int(self._rf.get("sent") or 0) + 1
        if attempts > 1:
            self._rf["retries"] = int(self._rf.get("retries") or 0) + 1
        self._save()

    @property
    def rf_today(self) -> dict[str, int]:
        """Funkbefehle heute: gesamt und davon Wiederholungen."""
        today = dt_util.now().date().isoformat()
        if self._rf.get("day") != today:
            return {"sent": 0, "retries": 0}
        return {"sent": int(self._rf.get("sent") or 0), "retries": int(self._rf.get("retries") or 0)}

    @property
    def mold_rh(self) -> float | None:
        """Mittlere relative Feuchte der letzten 24 h (Grundlage des Feuchte-Bodens)."""
        return self.mold_guard.mean_rh(dt_util.utcnow())

    def check_moisture_source(self, now: datetime) -> None:
        """Steigt die Feuchte im Raum, obwohl geheizt wird? Dann liegt die Ursache im Zimmer."""
        if self.monitor or not self.humidity_capable or self.paused or self.window_logic and self.window_paused:
            return
        sent = getattr(self, "_moisture_sent", None)
        if sent is not None and now - sent < MOISTURE_COOLDOWN:
            return
        delta = self.mold_guard.trend(now)
        change = self.mold_guard.rh_change(now)
        if delta is None or change is None or delta < MOISTURE_RISE:
            return
        hub = self.hub
        if hub is None:
            return
        start, end, hours = change
        vent = self.vent
        dries = vent.dries if vent is not None else True
        title_key, body_key = MESSAGE_MOISTURE_DRY if dries else MESSAGE_MOISTURE_DAMP
        fields = {
            "room": self.name,
            "hours": f"{hours:.0f}",
            "from": f"{start:.0f}",
            "to": f"{end:.0f}",
        }
        title = tr(title_key, **fields)
        body = tr(body_key, **fields)
        self._moisture_sent = now
        self.log(CAT_SETTINGS, title, body)
        hub.notify(
            KIND_MOISTURE,
            title,
            body,
            data={"tag": f"{self.entry.entry_id}_moisture", "group": "raumklima"},
            speak=False,
            room=self,
        )

    def record_mold_sample(self, now: datetime) -> None:
        """Jede Minute aus der Statistik: Feuchte für das 24-h-Mittel merken."""
        # Bei offenem Fenster nicht mitschreiben: die Lüftzeit würde das 24-h-Mittel
        # verwässern und den Boden nach dem Schließen unnötig hoch halten.
        if (
            self.humidity_sensor
            and not self.paused
            and not self.window_paused
            and self.mold_guard.add(
                now, self.current_temperature, self.current_humidity, self.surface_humidity()
            )
        ):
            self._save()
        self.check_moisture_source(now)

    @property
    def presence_target(self) -> float:
        """Temperatur, solange ein Melder jemanden im Raum sieht (0 = aus)."""
        try:
            return float(self.config.get(CONF_PRESENCE_TARGET) or 0.0)
        except (TypeError, ValueError):
            return 0.0

    @property
    def presence_delay_min(self) -> float:
        """Wartezeit, bis die Anwesenheits-Temperatur gilt (0 = sofort)."""
        try:
            return float(self.config.get(CONF_PRESENCE_DELAY) or 0.0)
        except (TypeError, ValueError):
            return 0.0

    def _presence_ready(self, now: datetime) -> bool:
        """Ist die Anwesenheits-Temperatur nach der Wartezeit freigegeben?"""
        delay = self.presence_delay_min
        if delay <= 0:
            return True
        since = self.occupied_since
        return since is not None and (now - since) >= timedelta(minutes=delay)

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

    def _night_setback_applies(self, hub: Any) -> bool:
        """Gilt die Nachtabsendung für diesen Raum?

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
        """Regelkette ohne Nachbedingung (siehe ``plan()``)."""
        if self.monitor:
            return False, self.target_temp, REASON_MONITOR
        if self.hvac_auto:
            return False, self.target_temp, REASON_DEVICE_AUTO
        now = dt_util.utcnow()
        if self._valve_care_until and now < self._valve_care_until:
            return True, self.trv_max, REASON_VALVE_CARE
        hub = self.hub
        if hub is None:
            return True, self.target_temp, REASON_NORMAL
        if not hub.heating_allowed:
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
        self._frost_active = False
        # Boost: bewusste Nutzeraktion – schlägt die Absenkung bei Abwesenheit
        if self.boost_open or self.boost_until is not None:
            if self.boost_open or now < self.boost_until:
                boost = self.boost_temperature if self.boost_temperature is not None else self.target_temp
                return True, min(boost, self.trv_max), REASON_BOOST
            if not self._peeking:
                self.boost_until = None
                self.boost_temperature = None
                self._save()
        # Jemand im Raum: auf die Anwesenheits-Temperatur heizen (z. B. Arbeitszimmer 19 → 21)
        if (
            self.presence_target > 0
            and self.occupied is True
            and not hub.vacation
            and self._presence_ready(now)
        ):
            return True, min(self.presence_target, self.trv_max), REASON_PRESENCE
        # Homeoffice: im eingestellten Fenster gilt der Wunsch, der Zeitplan pausiert
        if not hub.vacation and hub.home_office_applies(self.entry.entry_id):
            return True, min(self.target_temp, self.trv_max), REASON_HOME_OFFICE
        stage = hub.stage_for_room(self.entry.entry_id)
        if stage in AWAY_STAGES:
            if self._manual_until and now < self._manual_until:
                return True, self.target_temp, REASON_MANUAL
            mold = None
            if self.humidity_capable and (self.config.get(CONF_MOLD_MODE) or MOLD_STRICT) != MOLD_OFF:
                mold = self.mold_min(hub)
            target = setback_target(
                self.target_temp, stage, self.setback_short, self.setback_long, mold
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
            if schedule_target(self.schedules, dt_util.now()) is None:
                return True, target, stage
        manual_until = self._manual_until
        if not self._peeking:
            # Nur *abgelaufene* Handverstellungen verwerfen – eine laufende muss bleiben,
            # sonst wäre sie nach dem ersten plan()-Aufruf schon weg (Zeitplan-Pause).
            if manual_until is not None and manual_until <= now:
                manual_until = None
                self._manual_until = None
                self._save()
            self.frost_night_low = None
        # Zeitplan: eigener Wunsch für dieses Fenster, schlägt Leer-Absenkung und Sonne
        local_now = dt_util.now()
        sched = schedule_target(self.schedules, local_now)
        if sched is not None:
            if manual_until and now < manual_until and not values_match(self.target_temp, sched, 0.05):
                # Von Hand gestellt: der Zeitplan pausiert bis override_minutes abgelaufen sind
                return True, min(self.target_temp, self.trv_max), REASON_MANUAL
            return True, min(sched, self.trv_max), REASON_SCHEDULE
        # Ruhezeit: Schlafräume werden abgesenkt, auch wenn jemand zu Hause ist – nach einer
        # Nachtschicht wird tagsüber geschlafen. Der Regler am Thermostat gilt weiter.
        if self._night_setback_applies(hub):
            if manual_until and now < manual_until:
                return True, self.target_temp, REASON_MANUAL
            return True, hub.night_target(self), REASON_SLEEP
        # Vorheizen auf das nächste Zeitfenster – nur mit gelernter Aufheizzeit
        nxt = next_schedule_window(self.config.get(CONF_SCHEDULES), local_now)
        cur = self.current_temperature
        if nxt is not None and cur is not None and self._preheat_allowed(nxt[0], local_now):
            start, want = nxt
            need = self.heatup.minutes_needed(want - cur, hub.outdoor_temp())
            if need is not None and local_now + timedelta(minutes=need + PREHEAT_MARGIN_MINUTES) >= start:
                return True, min(want, self.trv_max), REASON_SCHEDULE_PREHEAT
        # Zeitplan vorhanden, aber gerade kein Fenster: der gewählte Wert außerhalb gilt
        fb = self.config.get(CONF_SCHEDULE_FALLBACK) or SCHEDULE_FALLBACK_WISH
        if self.schedules and fb != SCHEDULE_FALLBACK_WISH:
            outside = {
                SCHEDULE_FALLBACK_SHORT: self.setback_short,
                SCHEDULE_FALLBACK_LONG: self.setback_long,
                SCHEDULE_FALLBACK_FROST: hub.frost_floor,
            }.get(fb)
            if outside is not None and outside < self.target_temp - 0.05:
                return True, min(outside, self.trv_max), REASON_SCHEDULE_FALLBACK
        # „Anwesenheit aus": auch der leere Raum senkt nicht ab (Issue #10)
        if self.room_eco_applies() and not hub.opt(CONF_PRESENCE_OFF):
            floor = self.setback_short
            if self.humidity_capable:
                mold = self.mold_min(hub)
                if mold is not None:
                    floor = max(floor, mold)
            target = room_eco_target(self.target_temp, self.room_eco_drop, floor)
            if target < self.target_temp:
                return True, target, REASON_EMPTY
        if self._solar_applies(hub):
            return True, self.target_temp - SOLAR_REDUCTION, REASON_SOLAR
        return True, self.target_temp, REASON_NORMAL

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

    @callback
    def on_hub_change(self) -> None:
        """Zentrale hat sich geändert (Anwesenheit, Heizsaison, Einstellungen)."""
        if not self._started:
            return
        self._notify()
        self.hass.async_create_task(self._apply())

    async def async_valve_care(self) -> None:
        """Sommerpflege: Ventil kurz ganz öffnen, damit es nicht festsitzt."""
        if not self.trv_available() or not self.hvac_on:
            return
        self._valve_care_until = dt_util.utcnow() + VALVE_CARE
        await self._apply()

        @callback
        def _done() -> None:
            self._valve_care_until = None
            self.hass.async_create_task(self._apply())

        self._schedule(VALVE_CARE.total_seconds() + 1, _done)

    @property
    def hvac_action(self) -> HVACAction:
        if self.hvac_auto:
            action = self._trv_attr("hvac_action")
            return action if action in (HVACAction.HEATING, HVACAction.IDLE) else HVACAction.IDLE
        if not self.hvac_on or self.paused or not self.plan()[0]:
            return HVACAction.OFF
        action = self._trv_attr("hvac_action")
        if action == HVACAction.HEATING or self._trv_attr("running_state") == "heat":
            return HVACAction.HEATING
        # Manche Geräte (z. B. Homematic IP) lassen hvac_action auf "idle", obwohl das Ventil regelt.
        # Dann entscheidet die Ventilstellung – zusammen mit Soll/Ist, damit "offen, aber Ziel erreicht"
        # nicht als Heizen gilt.
        valve = self._trv_attr("valve_position")
        try:
            valve_open = valve is not None and float(valve) >= VALVE_HEATING_MIN
        except (TypeError, ValueError):
            valve_open = False
        if valve is None and action is None and self._trv_attr("running_state") is None:
            # Geräte ohne jeden Heiz-Signalwert (Aqara E1, HmIP-WTH): aus der Nachfrage ableiten.
            return HVACAction.HEATING if heating_demand(self.current_temperature, self.effective_target) else HVACAction.IDLE
        if valve_open:
            current, target = self._trv_attr("current_temperature"), self._trv_attr("temperature")
            try:
                if current is None or target is None or float(current) < float(target) + 0.3:
                    return HVACAction.HEATING
            except (TypeError, ValueError):
                return HVACAction.HEATING
        return HVACAction.IDLE

    @property
    def status(self) -> str:
        if self.monitor:
            return STATUS_MONITOR
        if not self.trv_available():
            return STATUS_TRV
        if not self.hvac_on:
            return STATUS_OFF_TRV if self.off_source == OFF_SOURCE_TRV else STATUS_OFF
        if self.paused:
            return STATUS_NIGHT if self.night_airing else STATUS_WINDOW
        on, _target, reason = self.plan()
        if not on and reason == REASON_SEASON:
            return STATUS_SEASON
        if not self.sensor_ok:
            return STATUS_SENSOR
        if reason in AWAY_STAGES:
            return STATUS_SETBACK
        if self.hvac_action == HVACAction.HEATING:
            return STATUS_HEATING
        return STATUS_IDLE






    # ================================================================ Bedienung
    async def async_set_target(self, temperature: float, by: str | None = None) -> None:
        new = clamp(float(temperature), self.trv_min, self.trv_max)
        on, current, reason = self.plan()
        override = reason in AWAY_STAGES and new > current
        now = dt_util.utcnow()
        if override:
            # Jemand will es trotz Abwesenheit wärmer → Absenkung für 3 h aussetzen
            self._manual_until = now + MANUAL_OVERRIDE
        elif self.override_minutes > 0 and schedule_target(self.schedules, dt_util.now()) is not None:
            # In einem laufenden Zeitfenster: von Hand gestellt heißt „für X Minuten mein Wunsch".
            self._manual_until = now + timedelta(minutes=self.override_minutes)
        if new != self.target_temp:
            self.log(
                CAT_MANUAL,
                tr("Wunschtemperatur {old} → {new}", old=fmt_temp(self.target_temp), new=fmt_temp(new)),
                tr("in Home Assistant geändert")
                + (tr(" von {who}", who=by) if by else "")
                + (tr("; Absenkung für 3 h ausgesetzt") if override else ""),
            )
        self.target_temp = new
        self._save()
        self._notify()
        await self._apply()

    @property
    def comfort_temp(self) -> float:
        """Wunschtemperatur (eingestellt oder Standard des Raumtyps)."""
        return comfort_temperature(
            self.config.get(CONF_COMFORT_TEMP), self.config.get(CONF_ROOM_TYPE)
        )

    async def async_set_hvac_mode(self, mode: str) -> None:
        """Heat / Auto / Off aus der Karte.

        ``auto`` heißt: Raumklima pausiert für diesen Raum und das Gerät fährt sein
        eigenes Wochenprogramm — es wird kein Sollwert mehr geschrieben.
        """
        mode = str(mode or "").lower()
        if mode == "auto":
            if not self.hvac_auto:
                self.log(
                    CAT_MANUAL,
                    tr("Automatik am Gerät"),
                    tr("Raumklima pausiert – das Thermostat fährt sein eigenes Programm"),
                )
            self.hvac_auto = True
            self.hvac_on = True
            self.off_source = None
            self._save()
            self._notify()
            await self._hand_over_to_device()
            return
        if self.hvac_auto:
            self.hvac_auto = False
            self.log(CAT_MANUAL, tr("Automatik beendet"), tr("Raumklima übernimmt wieder"))
            self._save()
            self._notify()
        await self.async_set_hvac_on(mode != "off")

    async def _hand_over_to_device(self) -> None:
        """Gerät auf sein eigenes Programm stellen (Preset „auto“/„schedule“)."""
        presets = [str(p).lower() for p in (self._trv_attr("preset_modes") or [])]
        target = next((p for p in ("auto", "schedule", "program", "programme", "timer", "timed") if p in presets), None)
        if target is None:
            return
        try:
            await self._call_climate("set_preset_mode", preset_mode=target)
            _LOGGER.info("%s: Gerät auf eigenes Programm gestellt (%s)", self.name, target)
        except Exception as exc:  # noqa: BLE001
            _LOGGER.debug("%s: Preset %s nicht setzbar: %s", self.name, target, exc)

    async def async_set_hvac_on(self, on: bool) -> None:
        if on and self.hvac_auto:
            # „Ein“ heißt: Raumklima übernimmt wieder
            self.hvac_auto = False
            self.log(CAT_MANUAL, tr("Automatik beendet"), tr("Raumklima übernimmt wieder"))
        if on and not self.hvac_on and self.target_temp < MIN_USEFUL_TARGET:
            # Raum war aus (Sollwert-Rest wie 5 °C) → mit Wunschtemperatur starten
            self.target_temp = self.comfort_temp
        if on != self.hvac_on:
            self.log(CAT_MANUAL, tr("Raum eingeschaltet") if on else tr("Raum ausgeschaltet"), tr("in Home Assistant"))
        self.hvac_on = on
        self.off_source = None if on else OFF_SOURCE_USER
        self._save()
        self._notify()
        await self._apply()

    async def async_set_boost(self, minutes: int | None = None, temperature: float | None = None) -> None:
        """Zeitlich begrenzt wärmer heizen („30 min wärmer"), danach gilt wieder der Rest."""
        if temperature is not None:
            offset = max(BOOST_TEMP_MIN, min(BOOST_TEMP_MAX, float(temperature)))
            self.boost_temperature = min(self.comfort_temp + offset, self.trv_max)
        await self._set_boost(
            minutes if minutes is not None else int(self.config.get(CONF_BOOST_MINUTES) or 30)
        )

    async def async_boost(self, mode: str = "minutes", minutes: int | None = None) -> None:
        """Boost mit Ziel: ``minutes`` | ``next`` (bis zum nächsten Zeitfenster) | ``unlimited`` | ``off``."""
        if mode == "off":
            await self.async_clear_boost()
            return
        if mode == "unlimited":
            await self._set_boost(None, open_ended=True)
            return
        if mode == "next":
            local_now = dt_util.now()
            nxt = next_schedule_window(self.config.get(CONF_SCHEDULES), local_now)
            if nxt is None:
                await self._set_boost(120)
                return
            start, _want = nxt
            delta = (start - local_now).total_seconds() / 60
            await self._set_boost(max(5, min(480, int(delta))))
            return
        await self._set_boost(minutes if minutes is not None else int(self.config.get(CONF_BOOST_MINUTES) or 30))

    async def _set_boost(self, minutes: int | None, open_ended: bool = False) -> None:
        """Boost setzen – ``open_ended`` heißt: bis zum Ausschalten."""
        offset = float(self.config.get(CONF_BOOST_TEMP) or 2.0)
        offset = max(BOOST_TEMP_MIN, min(BOOST_TEMP_MAX, offset))
        self.boost_temperature = min(self.comfort_temp + offset, self.trv_max)
        if open_ended:
            self.boost_open = True
            self.boost_until = None
            self.log(
                CAT_MANUAL,
                tr("Boost {t} ohne Zeitlimit", t=fmt_temp(self.boost_temperature)),
                tr("läuft, bis du den Boost beendest"),
            )
        else:
            duration = max(BOOST_MINUTES_MIN, min(BOOST_MINUTES_MAX, int(minutes or 30)))
            self.boost_open = False
            self.boost_until = dt_util.utcnow() + timedelta(minutes=duration)
            self.log(
                CAT_MANUAL,
                tr("Boost {t} für {m} min", t=fmt_temp(self.boost_temperature), m=duration),
                tr("in Home Assistant"),
            )
        if not self.hvac_on:
            self.hvac_on = True
            self.off_source = None
        self._save()
        self._notify()
        await self._apply()

    async def async_clear_boost(self) -> None:
        """Laufenden Boost vorzeitig beenden."""
        if self.boost_until is None and not self.boost_open:
            return
        self.boost_open = False
        self.boost_until = None
        self.boost_temperature = None
        self.log(CAT_MANUAL, tr("Boost beendet"), tr("in Home Assistant"))
        self._save()
        self._notify()
        await self._apply()

    @property
    def boost_active(self) -> bool:
        return self.boost_open or (self.boost_until is not None and dt_util.utcnow() < self.boost_until)

    async def async_set_window_logic(self, enabled: bool) -> None:
        self.window_logic = enabled
        self._save()
        self._notify()
        await self._apply()

    # ================================================================ Ereignisse
    @callback
    def _on_state_change(self, event: Event[EventStateChangedData]) -> None:
        entity_id = event.data["entity_id"]
        old = event.data["old_state"]
        new = event.data["new_state"]

        if self.valve_sensor is None:
            # MQTT/Zigbee legen die Ventilstellung erst nach dem Start an (#15). Nachgesehen wird
            # in den ersten 30 Minuten, aber höchstens alle 15 Sekunden – beim Startfeuer sonst
            # sofort aufgebraucht.
            now = dt_util.utcnow()
            if self._valve_hunt_until is None:
                self._valve_hunt_until = now + timedelta(minutes=30)
            if now < self._valve_hunt_until and (
                self._valve_last_try is None or (now - self._valve_last_try).total_seconds() >= 15
            ):
                self._valve_last_try = now
                self._try_valve_sensor()

        if entity_id in self.windows:
            self._on_window(entity_id, new)
        elif entity_id == self.temp_sensor:
            if self._ingest_sensor(new):
                self.hass.async_create_task(self.async_calibrate())
        elif entity_id == self.trv:
            self._trv_reports.append(dt_util.utcnow())
            self._on_trv(old, new)
        elif entity_id == self.cal_entity:
            self.sync.check_all()
        else:
            for extra in self.extra_trvs:
                if entity_id in extra.tracked():
                    extra.sync.check_all()
                    if self.cal_mode == CAL_OFFSET and entity_id == extra.entity_id and old is not None and new is not None and old.attributes.get("current_temperature") != new.attributes.get("current_temperature"):
                        self.hass.async_create_task(extra.calibrate())
        if self.vent:
            self.vent.update()
        self._sample_series()
        self._notify()

    def _ingest_sensor(self, state: State | None) -> bool:
        """Messwert prüfen und übernehmen. True bei neuem gültigem Wert."""
        if state is None:
            return False
        value = to_float(state.state)
        if value is None:
            return False  # unavailable/unknown: letzten Wert behalten
        now = dt_util.utcnow()
        since = (now - self._ext_time).total_seconds() if self._ext_time else None
        if not plausible_reading(
            value,
            self._ext_value,
            since,
            max_jump=MAX_SENSOR_JUMP,
            window=SENSOR_JUMP_WINDOW,
        ) and (self._ext_candidate is None or abs(value - self._ext_candidate) > 0.5):
            # Ausreißer? Nur übernehmen, wenn der nächste Wert ihn bestätigt
            _LOGGER.debug("%s: unplausibler Messwert %s verworfen", self.name, value)
            self._ext_candidate = value
            return False
        self._ext_candidate = None
        if value != self._ext_value:
            self._ext_changed_at = now
            self._trv_at_ext_change = self.trv_temperature
        self._ext_value = value
        self._ext_time = now
        self._temp_hist.append((now, value))
        self._check_virtual_window(now, value)
        return True











    def _on_trv(self, old: State | None, new: State | None) -> None:
        was_ok = old is not None and is_valid(old.state)
        is_ok = new is not None and is_valid(new.state)
        if was_ok and not is_ok:
            # Erst nach einer Minute als Ausfall werten – kurze Aussetzer (MQTT/VPN) sind normal
            self._trv_down_since = dt_util.utcnow()
            if self._trv_down_cancel:
                self._trv_down_cancel()
            self._trv_down_cancel = self._schedule(self.outage_seconds, self._trv_down_confirmed)
        if is_ok and not was_ok:
            _LOGGER.info("%s: TRV wieder erreichbar – sende Ausstehendes", self.name)
            if self._trv_down_cancel:
                self._trv_down_cancel()
                self._trv_down_cancel = None
            if self._trv_down_since is not None:
                seconds = (dt_util.utcnow() - self._trv_down_since).total_seconds()
                self._trv_down_since = None
                # Jede Funkpause ist eine Lernprobe für die eigene Ausfallgrenze (#33).
                if 5.0 <= seconds <= 7200.0:
                    self._outage_durations.append(seconds)
                if seconds < self.outage_seconds:
                    if self.hub is not None:
                        self.hub.note_trv_blip(self, seconds)
                else:
                    self.log(CAT_DEVICE, tr("Thermostat wieder erreichbar"), tr("nach {m} min – offene Befehle werden sofort gesendet", m=f"{seconds / 60:.0f}"))
            self.hass.async_create_task(self.sync.retry_all_now())
            return
        if not (is_ok and was_ok):
            return
        if old.attributes.get("preset_mode") != new.attributes.get("preset_mode"):
            self._preset_changed_at = dt_util.utcnow()
        # Vor check_all: bestätigt dieses Update einen eigenen Befehl, sind die
        # Jobs noch offen und es wird nicht als manuelle Änderung gewertet.
        self._detect_manual_change(old, new)
        self._update_shift()
        self.sync.check_all()
        # Bosch (und kompatible): internes Zeitprogramm deaktivieren - sonst ignoriert
        # das Geraet externe Setpoints und heizt nach eigenem Plan (Better Thermostat:
        # manual-Modus beim Start). Nur wenn das Geraet operating_mode ausweist.
        om = new.attributes.get("operating_mode")
        if om is not None and om != "manual" and not getattr(self, "_bosch_manual_pending", False):
            self._bosch_manual_pending = True
            self.hass.async_create_task(self._ensure_bosch_manual())
        if self.cal_mode == CAL_OFFSET:
            if old.attributes.get("current_temperature") != new.attributes.get(
                "current_temperature"
            ):
                self.hass.async_create_task(self.async_calibrate())
        elif self.cal_mode == CAL_TARGET:
            self.hass.async_create_task(self._apply(from_measurement=True))


    @callback
    def _try_valve_sensor(self) -> bool:
        """Ventilsensor nachträglich suchen (MQTT/Zigbee legen ihn erst nach dem Start an, #15)."""
        if self.valve_sensor is not None:
            return True
        found = self._find_valve_sensor()
        if not found:
            return False
        self.valve_sensor = found
        self._unsubs.append(async_track_state_change_event(self.hass, [found], self._on_state_change))
        return True

    @callback
    def _on_fast_poll(self, _now: datetime) -> None:
        """Alle zwei Minuten beim Gerät nachfragen (nur wenn der Raum es verlangt)."""
        if not self.config.get(CONF_FAST_POLL):
            return
        ids = [self.trv] + [t.entity_id for t in self.extra_trvs if getattr(t, "entity_id", None)] + [t.entity_id for t in self.ac_sources if getattr(t, "entity_id", None)]
        if not ids:
            return
        self.hass.async_create_task(
            self.hass.services.async_call(
                "homeassistant", "update_entity", {"entity_id": ids}, blocking=False
            )
        )

    @callback
    def _series_action(self) -> str:
        """Kurzschlüssel des Heiz-Zustands – ohne `plan()`, das hat hier nichts zu suchen."""
        if self.monitor:
            return "m"
        if self.paused:
            return "w"
        if not self.hvac_on:
            return "o"
        return "h" if self.hvac_action == HVACAction.HEATING else "i"

    @callback
    def _sample_series(self) -> None:
        """Einen Punkt für die Diagnose-Kurve aufnehmen (nur wenn Raster oder Änderung)."""
        if not getattr(self, "_started", False):
            return
        self.series.maybe_add(
            dt_util.utcnow(),
            current=self.current_temperature,
            target=self.target_temp,
            setpoint=self.trv_target,
            valve=self.valve_position,
            action=self._series_action(),
        )

    @callback
    def _on_reconcile(self, _now: datetime) -> None:
        """Sicherheitsnetz: Fenster neu bewerten und Soll-Zustand abgleichen."""
        if self.valve_sensor is None:
            # Sicherheitsnetz, falls der schnelle Nachlauf schon beendet ist.
            self._try_valve_sensor()
        for entity in self.windows:
            state = self.hass.states.get(entity)
            if state and is_valid(state.state):
                self._last_valid_windows[entity] = window_open_state(entity, state)
        self._evaluate_windows()
        self._sample_series()
        self._save()
        self.hass.async_create_task(self._apply())

    @callback
    def _on_cal_interval(self, _now: datetime) -> None:
        """Alle 10 Minuten: Abgleich nachführen.

        Bei Kalibrierart „target“ wird der Sollwert neu gesendet – so kommt der gelernte Versatz auch
        dann an, wenn das Thermostat zwischendurch keine Messwerte meldet (Livisi/HMIP, Batteriegeräte).
        """
        if self.cal_mode == CAL_TARGET:
            self.hass.async_create_task(self._apply(from_measurement=True))
            return
        self.hass.async_create_task(self.async_calibrate())







    async def _ensure_bosch_manual(self) -> None:
        """Bosch (und kompatible): internes Zeitprogramm deaktivieren.

        Setzt operating_mode auf 'manual', damit externe Setpoints nicht vom
        Geraete-eigenen Zeitplan ueberschrieben werden (Better Thermostat 1.8.0+).
        """
        try:
            await self._call_climate("set_preset_mode", preset_mode="manual")
            _LOGGER.info("%s: Bosch operating_mode auf 'manual' gesetzt", self.name)
        except Exception as exc:  # noqa: BLE001
            _LOGGER.debug("%s: operating_mode 'manual' nicht unterstuetzt: %s", self.name, exc)
        finally:
            self._bosch_manual_pending = False

    def _source_config(self) -> list[dict[str, Any]]:
        """Heizquellen (TRV/AC) mit Metadaten; ohne Konfiguration aus den Zusatz-Thermostaten."""
        raw = self.config.get(CONF_HEAT_SOURCES)
        out: list[dict[str, Any]] = []
        if isinstance(raw, list) and raw:
            for i, item in enumerate(raw):
                if not isinstance(item, dict):
                    continue
                eid = str(item.get("entity") or "").strip()
                if not eid or eid == self.trv:
                    continue
                out.append({
                    "id": str(item.get("id") or f"src{i + 1}"),
                    "entity": eid,
                    "name": str(item.get("name") or eid),
                    "type": str(item.get("type") or "trv"),
                    "offset": to_float(item.get("offset")) or 0.0,
                    "trigger": str(item.get("trigger") or ""),
                    "untouched": bool(item.get("untouched")),
                })
            return out
        return [
            {"id": f"extra:{e}", "entity": e, "name": e, "type": "trv", "offset": 0.0, "trigger": "", "untouched": False}
            for e in self._extra_ids
        ]

    @property
    def all_sources(self) -> list[dict[str, Any]]:
        """Haupt-Thermostat + alle weiteren Quellen."""
        main = {"id": "main", "entity": self.trv, "name": self.name, "type": "trv", "offset": 0.0, "trigger": "", "untouched": False}
        return [main, *self.source_cfg]

    def _active_window(self) -> dict[str, Any] | None:
        return schedule_window(self.schedules, dt_util.now())

    def _selected_ids(self) -> set[str]:
        """Quellen, die im laufenden Fenster (oder außerhalb) aktiv sind."""
        every = {s["id"] for s in self.all_sources if not s["untouched"]}
        win = self._active_window()
        if win is None:
            return every
        chosen = {str(x) for x in (win.get("sources") or [])}
        return chosen or every

    def _boost_ids(self) -> set[str]:
        """Quellen, die während eines Boosts laufen (selected / all / first)."""
        mode = str(self.config.get(CONF_BOOST_SOURCES) or "selected")
        if mode == "all":
            return {s["id"] for s in self.all_sources if not s["untouched"]}
        chosen = self._selected_ids()
        if mode == "first":
            first = next((s["id"] for s in self.all_sources if s["id"] in chosen), None)
            return {first} if first else set()
        return chosen

    def _source_on(self, src: dict[str, Any], want_on: bool, boosting: bool) -> bool | None:
        """Soll die Quelle laufen? None = unangetastet (keine Befehle)."""
        if src["untouched"]:
            return None
        if not want_on:
            return False
        if boosting:
            return src["id"] in self._boost_ids()
        trigger = src.get("trigger")
        if trigger:
            st = self.hass.states.get(trigger)
            if st is not None and st.state == "on":
                return True
        return src["id"] in self._selected_ids()

    def _extra_for(self, entity_id: str) -> ExtraTrv | None:
        return self._extra_by_id.get(entity_id)

    def _ac_for(self, entity_id: str) -> AcSource | None:
        return self._ac_by_id.get(entity_id)

    async def _apply(self, from_measurement: bool = False) -> None:
        """Soll-Zustand berechnen und ans TRV senden (mit Prüfung)."""
        async with self._apply_lock:
            if not self._started:
                return  # Raum wird gerade entladen/neu geladen – nichts mehr senden
            if self.monitor:
                return  # Überwachungsraum: nichts zu regeln, nichts zu senden
            if self.hvac_auto:
                return  # Gerät fährt sein eigenes Programm – nicht dazwischenfunken
            if getattr(self, "_manual_candidate", None) is not None:
                # Gerät hat gerade einen neuen Sollwert gemeldet – erst die Standzeit abwarten,
                # sonst überschreiben wir den Handeingriff mit dem alten Ziel.
                return
            if self.throttled_until and dt_util.utcnow() < self.throttled_until:
                return  # Bremse aktiv – zu viele Befehle in kurzer Zeit
            method = self._off_method()
            plan_on, _target, reason = self.plan()
            self._log_plan(plan_on, _target, reason)
            if _LOGGER.isEnabledFor(logging.DEBUG):
                shadow = self.valve_shadow()
                _LOGGER.debug(
                    "%s: Ventil-Schatten berechnet %s %%, Gerät %s %% (Ziel %s, Ist %s)",
                    self.name, shadow["calc_pct"], shadow["device_pct"],
                    shadow["target_c"], shadow["current_c"],
                )
            want_on = self.hvac_on and not self.paused and plan_on
            if reason == REASON_VALVE_CARE and self.hvac_on:
                want_on = True
            boosting = reason == REASON_BOOST
            main_on = self._source_on(self.all_sources[0], want_on, boosting)

            if not main_on:
                self.sync.cancel("setpoint")
                if method == OFF_PRESET:
                    current = self._trv_attr("preset_mode")
                    if current and current != "off":
                        self.trv_on_preset = current
                        self._save()
                    await self.sync.request(
                        "mode",
                        "Preset 'off'",
                        lambda: self._call_climate("set_preset_mode", preset_mode="off"),
                        lambda: self._is_trv_off(self._trv_state(), OFF_PRESET),
                    )
                elif method == OFF_HVAC:
                    await self.sync.request(
                        "mode",
                        "HVAC 'off'",
                        lambda: self._call_climate("set_hvac_mode", hvac_mode="off"),
                        lambda: self._is_trv_off(self._trv_state(), OFF_HVAC),
                    )
                else:
                    # Die Gerätegrenze erst beim Senden lesen: beim Start ist `min_temp` kurz
                    # unbekannt, und der Rückfallwert (5,0 °C) wurde früher als Ziel eingefroren
                    # und nie bestätigt (Issue #37). Ist der Wert noch nicht da, scheitert der
                    # Versuch ohne Schreibbefehl und wird – ohne Versuchsbudget zu kosten –
                    # wiederholt, sobald das Gerät antwortet.
                    low = to_float(self._trv_attr("min_temp"))
                    await self.sync.request(
                        "mode",
                        tr("Minimaltemperatur {t}", t=fmt_temp(low)) if low is not None else tr("Minimaltemperatur"),
                        self._write_off_setpoint,
                        lambda: self._is_trv_off(self._trv_state(), OFF_MIN_TEMP),
                    )
                await self._apply_extras(want_on, method, _target, boosting)
                return

            # --- an: zuerst Modus, dann Sollwert
            if method == OFF_PRESET:
                preset = "comfort" if self.target_via == "comfort_temperature" else self._on_preset()
                current = self._trv_attr("preset_mode")
                if current in HEAT_PRESETS and current != "none" or (current == "none" and preset == "none"):
                    self.sync.cancel("mode")  # regelt schon auf den Sollwert – Preset nicht umstellen
                elif preset:
                    await self.sync.request(
                        "mode",
                        f"Preset '{preset}'",
                        lambda: self._call_climate("set_preset_mode", preset_mode=preset),
                        lambda: self._trv_attr("preset_mode") in HEAT_PRESETS,
                    )
            elif method == OFF_HVAC:
                modes = [m for m in (self._trv_attr("hvac_modes") or []) if m != "off"]
                hvac = "heat" if "heat" in modes else (modes[0] if modes else "heat")
                await self.sync.request(
                    "mode",
                    f"HVAC '{hvac}'",
                    lambda: self._call_climate("set_hvac_mode", hvac_mode=hvac),
                    lambda: self.trv_available()
                    and getattr(self._trv_state(), "state", "off") != "off",
                )
            else:
                self.sync.cancel("mode")

            setpoint = self._desired_setpoint()
            if from_measurement:
                # Bei Kalibrierart "target" nur bei echter Änderung senden
                if self._last_target_setpoint is not None and abs(
                    setpoint - self._last_target_setpoint
                ) < 0.5:
                    return
                if not self._cal_interval_passed():
                    return
            if self.target_via == "comfort_temperature" and getattr(self.sync, "verify_delay", 20) < 120:
                # Batteriegeräte melden selten – nicht nach 5 Minuten „nicht bestätigt" rufen.
                self.sync.verify_delay = 120
            if self.sync.is_pending("mode"):
                await asyncio.sleep(2)  # Tuya braucht kurz nach Preset-Wechsel
            self._last_target_setpoint = setpoint
            if self.cal_mode == CAL_TARGET:
                self._last_cal_send = dt_util.utcnow()
            await self.sync.request(
                "setpoint",
                tr("Sollwert {t}", t=fmt_temp(setpoint)),
                lambda: self._write_setpoint(setpoint),
                lambda: self._setpoint_matches(setpoint),
            )
            await self._apply_extras(want_on, method, _target, boosting)

    async def _apply_extras(self, want_on: bool, method: str, target: float, boosting: bool) -> None:
        """Weitere Heizquellen je Auswahl schalten (TRV oder Klimaanlage)."""
        for src in self.source_cfg:
            on = self._source_on(src, want_on, boosting)
            if on is None:
                continue
            try:
                if src["type"] == "ac":
                    ac = self._ac_for(src["entity"])
                    if ac is not None:
                        await ac.apply(on, target)
                else:
                    extra = self._extra_for(src["entity"])
                    if extra is not None:
                        await extra.apply(on, method, target + float(src["offset"]))
            except Exception as err:  # noqa: BLE001 – eine Quelle darf die anderen nicht aufhalten
                _LOGGER.warning("%s: Heizquelle %s: %s", self.name, src["entity"], err)

    def peek_plan(self) -> tuple[bool, float, str]:
        """Wie ``plan()``, aber ohne den Von-Hand-Vorrang zu verbrauchen (für die Anzeige)."""
        self._peeking = True
        try:
            return self.plan()
        finally:
            self._peeking = False

    @property
    def trv_report_interval(self) -> float | None:
        """Abstand, in dem das Thermostat von sich aus meldet (Sekunden, Median)."""
        if len(self._trv_reports) < 3:
            return None
        deltas = [
            (b - a).total_seconds()
            for a, b in zip(self._trv_reports, list(self._trv_reports)[1:], strict=False)
        ]
        deltas = [d for d in deltas if 0 < d <= 7200]
        if len(deltas) < 2:
            return None
        deltas.sort()
        return deltas[len(deltas) // 2]

    @property
    def applied_target(self) -> float:
        """Was gerade gilt: berechnetes Ziel (Zeitplan, Boost, Absenkung), sonst der Wunsch."""
        on, target, _reason = self.peek_plan()
        return target if on else self.target_temp

    @property
    def sync_state(self) -> str:
        """Übertragung über alle Thermostate: failed > pending > ok."""
        states = [self.sync.state, *(x.sync.state for x in self.extra_trvs)]
        for s in ("failed", "pending"):
            if s in states:
                return s
        return "ok"

    # ================================================================ Protokoll
    def _log_plan(self, on: bool, target: float, reason: str) -> None:
        """Zieländerungen mit Begründung protokollieren (nur bei Änderung)."""
        key = (on, round(target, 1), reason)
        if key == self._last_plan:
            return
        first = self._last_plan is None
        self._last_plan = key
        hub = self.hub
        why = {
            REASON_NORMAL: tr("Wunschtemperatur {t}", t=fmt_temp(self.target_temp)),
            REASON_MANUAL: tr("von Hand wärmer gestellt – Absenkung 3 h ausgesetzt"),
            REASON_SEASON: tr("Heizpause (mild draußen)"),
            REASON_FROST: tr("Heizpause, aber unter der Sicherung {t}", t=fmt_temp(hub.frost_floor if hub else None)),
            REASON_VALVE_CARE: tr("Sommerpflege: Ventil kurz öffnen"),
            REASON_EMPTY: tr(
                "Raum seit {m} min leer (Präsenzmelder) – {d} weniger (Wunsch {t})",
                m=f"{self.room_eco_after:.0f}", d=fmt_temp(self.room_eco_drop), t=fmt_temp(self.target_temp),
            ),
            REASON_SOLAR: tr("Sonne erwartet – {d} weniger, sie heizt mit (Wunsch {t})", d=fmt_temp(SOLAR_REDUCTION), t=fmt_temp(self.target_temp)),
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
        if self.frost_night_low is not None and reason in AWAY_STAGES:
            why += tr(", Frostnacht ({t} erwartet): nur halb so tief abgesenkt", t=fmt_temp(self.frost_night_low))
        elif reason == STAGE_AWAY_LONG and target > self.setback_long:
            why += tr(", Schimmelschutz hält {t} (Feuchte {h} %)", t=fmt_temp(target), h=f"{self.current_humidity or 0:.0f}")
        msg = tr("Ziel {t}", t=fmt_temp(target)) if on else tr("Heizung aus")
        self.log(CAT_TARGET, (tr("Start: ") if first else "") + msg, why, target=target, reason=reason)









