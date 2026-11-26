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
    CAL_OFFSET,
    CAL_TARGET,
    CALIBRATION_INTERVAL,
    CONF_CALIBRATION_ENTITY,
    CONF_CALIBRATION_MODE,
    CONF_CO2_SENSOR,
    CONF_COMFORT_TEMP,
    CONF_EXTRA_TRVS,
    CONF_FAST_POLL,
    CONF_FLOOR_RETURN,
    CONF_FLOOR_SUPPLY,
    CONF_FROST_TEMP,
    CONF_HOME,
    CONF_HUMIDITY_SENSOR,
    CONF_NAME,
    CONF_OVERRIDE_MINUTES,
    CONF_PM25_SENSOR,
    CONF_ROOM_TYPE,
    CONF_SETBACK_LONG,
    CONF_SETBACK_SHORT,
    CONF_SHADING_COVERS,
    CONF_SYNC_MAX_RETRIES,
    CONF_SYNC_VERIFY_DELAY,
    CONF_TEMP_SENSOR,
    CONF_TRV,
    CONF_WEATHER,
    CONF_WINDOWS,
    DEFAULTS,
    DOMAIN,
    EVENT_RAUMKLIMA,
    MAX_SENSOR_JUMP,
    OFF_SOURCE_TRV,
    RECONCILE_INTERVAL,
    SENSOR_JUMP_WINDOW,
    SLOW_RETRY_INTERVAL,
)
from .decision_log import (
    CAT_DEVICE,
    CAT_NOTIFY,
)
from .health import (
    HistoryPoint,
)
from .heatup import HeatupTracker
from .hub import RaumklimaHub
from .logic import (
    any_open,
    is_valid,
    plausible_reading,
    to_float,
    window_open_state,
)
from .msg import tr
from .planning import (
    MoldGuard,
    setback_defaults,
)
from .room_apply import ApplyMixin
from .room_const import (
    STORAGE_VERSION,
    VALVE_CARE,
)
from .room_control import ControlMixin
from .room_dehumidify import DehumidifierManager
from .room_extra_trvs import AcSource, ExtraTrv
from .room_floor import FloorMixin
from .room_health import HealthMixin
from .room_lights import LightSignal
from .room_mold import MoldMixin
from .room_plan import PlanMixin
from .room_presence import PresenceMixin
from .room_radio import RadioMixin
from .room_readings import ReadingsMixin
from .room_schedule import ScheduleMixin
from .room_settings import SettingsMixin
from .room_shading import ShadingMixin
from .room_status import StatusMixin
from .room_store import StoreMixin
from .room_trv import TrvMixin
from .room_windows import WindowMixin
from .series import RoomSeries
from .shared import domain_data, get_hub
from .sync import SyncManager
from .usage_profile import UsageProfile
from .vent_manager import VentilationManager

_LOGGER = logging.getLogger(__name__)




class RaumklimaController(ReadingsMixin, ScheduleMixin, StatusMixin, ControlMixin, StoreMixin, RadioMixin, PlanMixin, MoldMixin, ApplyMixin, SettingsMixin, ShadingMixin, FloorMixin, WindowMixin, TrvMixin, HealthMixin, PresenceMixin):
    """Steuert genau einen Raum."""

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        self.hass = hass
        self.entry = entry
        self.config: dict[str, Any] = {**DEFAULTS, **entry.data, **entry.options}
        self.name: str = self.config[CONF_NAME]
        # Leeres Thermostat = Überwachungsraum (nur Sensoren, keine Heizung)
        self.trv: str = str(self.config.get(CONF_TRV) or "")
        self.monitor: bool = not self.trv
        self.temp_sensor: str = str(self.config.get(CONF_TEMP_SENSOR) or "")
        self.humidity_sensor: str | None = self.config.get(CONF_HUMIDITY_SENSOR)
        self.co2_sensor: str | None = self.config.get(CONF_CO2_SENSOR) or None
        self.pm25_sensor: str | None = self.config.get(CONF_PM25_SENSOR) or None
        self.windows: list[str] = list(self.config.get(CONF_WINDOWS) or [])
        raw_covers = self.config.get(CONF_SHADING_COVERS) or []
        if isinstance(raw_covers, str):
            raw_covers = [raw_covers]
        self.covers: list[str] = list(dict.fromkeys(str(e) for e in raw_covers if e))
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
        self._restored_night: datetime | None = None  # aus dem Speicher, einmalig zu übernehmen
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
        self.valve_actuator: str | None = None
        self._valve_hunt_until: datetime | None = None  # Zeitfenster für die Nachsuche
        self._valve_last_try: datetime | None = None
        self._frost_active = False
        self._solar_active = False
        self.frost_night_low: float | None = None
        self._manual_until: datetime | None = None
        # Verschattung: zuletzt von uns geschlossene Covers und pausierte Automatik.
        self._shading_closed: set[str] = set()
        self._shading_manual_until: datetime | None = None
        self._shading_last: dict[str, dict[str, Any]] = {}
        self._shading_state: str = "off"
        self._shading_reason: str = "off"
        self._shading_sun: bool = False
        self.floor_supply: str | None = self.config.get(CONF_FLOOR_SUPPLY) or None
        self.floor_return: str | None = self.config.get(CONF_FLOOR_RETURN) or None
        self._floor_last_setpoint: float | None = None
        self._floor_last_change: datetime | None = None
        self._valve_care_until: datetime | None = None
        self._started = False
        # Gesundheitscheck
        self.health_hist: deque[HistoryPoint] = deque(maxlen=150)
        self._unavail_events: deque[datetime] = deque(maxlen=50)
        # Wann das Gerät von selbst in seinen eingebauten Zeitplan gesprungen ist (Gesundheit)
        self._own_program_events: deque[datetime] = deque(maxlen=50)
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
        # Letzte Sollwerte mit Plan-Ziel – für die Diagnose (#64: „warum 26 °C?“).
        self._setpoint_history: list[dict[str, Any]] = []
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
        self.dehumidifier = DehumidifierManager(self)
        # Kurve für die Diagnose-Datei (4-Minuten-Raster, zusätzlich bei Änderungen).
        self.series = RoomSeries()
        self.lights = LightSignal(self)
        self.source_cfg = self._source_config()
        self._extra_ids = [s["entity"] for s in self.source_cfg if s["type"] == "trv"]
        self.extra_trvs = [ExtraTrv(self, e) for e in self._extra_ids]
        self.ac_sources = [AcSource(self, s) for s in self.source_cfg if s["type"] == "ac"]
        self._extra_by_id = {x.entity_id: x for x in self.extra_trvs}
        self._ac_by_id = {x.entity_id: x for x in self.ac_sources}
        self._rf: dict[str, Any] = {"day": "", "sent": 0, "retries": 0, "hist": {}}
        self._battery_hist: dict[str, dict[str, float]] = {}  # Batterie-Entität → {Datum: %}
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
            self._load_stored(stored)
        elif self.trv_available():
            # Erster Start: Wunschtemperatur statt Zufallswert am TRV (Eco-Speicher, 5 °C …)
            self.target_temp = self.comfort_temp
            self.hvac_on = not self._is_trv_off(self._trv_state(), self._off_method())
            self.off_source = None if self.hvac_on else OFF_SOURCE_TRV
            preset = self._trv_attr("preset_mode")
            if preset and preset != "off":
                self.trv_on_preset = preset
            self._save()

        if not stored:
            self.vent.load(None)
            self.series.load(None)
        self.valve_sensor = self._find_valve_sensor()
        self.valve_actuator = self._find_valve_actuator()
        for extra in self.extra_trvs:
            extra.discover()
        self._batteries = self._find_batteries()

        tracked = [self.trv, self.temp_sensor, *self.windows, *self.covers, *(e for x in self.extra_trvs for e in x.tracked()), *(e for x in self.ac_sources for e in x.tracked())]
        if self.humidity_sensor:
            tracked.append(self.humidity_sensor)
        if self.co2_sensor:
            tracked.append(self.co2_sensor)
        if self.pm25_sensor:
            tracked.append(self.pm25_sensor)
        if self.floor_supply:
            tracked.append(self.floor_supply)
        if self.floor_return:
            tracked.append(self.floor_return)
        if self.config.get(CONF_WEATHER):
            tracked.append(self.config[CONF_WEATHER])
        if self.valve_sensor:
            tracked.append(self.valve_sensor)
        if self.valve_actuator:
            tracked.append(self.valve_actuator)
        if self.cal_entity:
            tracked.append(self.cal_entity)
        self._unsubs.append(
            async_track_state_change_event(self.hass, tracked, self._on_state_change)
        )
        self._aux_unsub = None
        self.track_aux()
        self._unsubs.append(lambda: self._aux_unsub() if self._aux_unsub else None)
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
        # Boost oder Handverstellung aus dem Speicher: Ende pünktlich wecken
        self._schedule_expiry()
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
        restored_night, self._restored_night = self._restored_night, None
        if self._window_raw and restored_night is not None and self.vent.restored_open is not None and self.vent.restored_open <= restored_night <= dt_util.utcnow():
            self.night_since = restored_night  # vor dem Neustart schon Nachtlüften
        elif self._window_raw and self.night_applies():
            self.night_since = dt_util.utcnow()
        self._ingest_sensor(self.hass.states.get(self.temp_sensor))
        await self.vent.async_start()
        self.dehumidifier.update()
        self.track_presence()
        self.update_presence(initial=True)

        domain_data(self.hass)["rooms"][self.entry.entry_id] = self
        self.shading_start()
        self._started = True
        self._schedule_plan_wake()
        self.hass.async_create_task(self._apply())
        self.hass.async_create_task(self.async_calibrate())
        self.hass.async_create_task(self.async_evaluate_shading())

    async def async_stop(self) -> None:
        """Alles abmelden."""
        self._started = False
        self._stopped = True
        domain_data(self.hass)["rooms"].pop(self.entry.entry_id, None)
        for unsub in self._unsubs:
            unsub()
        self._unsubs.clear()
        # Alle eigenen Timer abbrechen – sonst speichert z. B. die Bestätigung eines Handeingriffs
        # nach dem Neuladen noch den alten Zustand und überschreibt den des neuen Raums.
        for attr in ("_window_timer", "_trv_down_cancel", "_virtual_cancel", "_manual_timer", "_valve_care_cancel", "_expiry_cancel", "_plan_wake_cancel"):
            cancel = getattr(self, attr, None)
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
        return self.usage.summary() if self.presence_inputs else {}

    def airing_learned(self, when: datetime) -> bool:
        return self.airing.learned(when)

    def airing_count(self, when: datetime) -> int:
        return self.airing.count(when)

    def _save(self) -> None:
        if getattr(self, "_stopped", False):
            return  # entladen: nicht mehr in den (dann neuen) Speicher schreiben
        self._store.async_delay_save(self._stored_data, 5)
        self._schedule_expiry()
        self._schedule_plan_wake()

    @callback
    def _schedule_expiry(self) -> None:
        """Wecker auf das Ende von Boost oder Handverstellung – damit beides auf die Minute endet.

        Ohne Wecker fiel das Ende erst beim nächsten Abgleich auf (bis zu 10 min später): das
        Thermostat blieb so lange warm, und die Karte zeigte ein abgelaufenes „bis …“.
        """
        if getattr(self, "_stopped", False) or getattr(self, "hass", None) is None:
            return
        now = dt_util.utcnow()
        ends = [t for t in (getattr(self, "boost_until", None), getattr(self, "_manual_until", None)) if t is not None and t > now]
        when = min(ends) if ends else None
        if when == getattr(self, "_expiry_at", None):
            return
        cancel = getattr(self, "_expiry_cancel", None)
        if cancel:
            cancel()
        self._expiry_cancel = None
        self._expiry_at = when
        if when is None:
            return

        def fire() -> None:
            self._expiry_cancel = None
            self._expiry_at = None
            self._notify()
            self.hass.async_create_task(self._apply())

        # eine Sekunde nach dem Ende, damit „jetzt < Ende“ sicher nicht mehr gilt
        self._expiry_cancel = self._schedule((when - now).total_seconds() + 1, fire)

    @callback
    def _schedule_plan_wake(self) -> None:
        """Wecker auf den nächsten Zeitplanwechsel bzw. Vorheizbeginn.

        Vorher wurde ein neuer Block erst beim nächsten Abgleich übernommen – bis zu 10 min zu spät.
        """
        if getattr(self, "_stopped", False) or getattr(self, "hass", None) is None or not getattr(self, "_started", False):
            return
        try:
            local = self.next_plan_change(dt_util.now())
        except Exception:
            _LOGGER.debug("%s: Zeitplan-Wecker nicht berechenbar", self.name, exc_info=True)
            local = None
        when = dt_util.as_utc(local) if local is not None else None
        if when == getattr(self, "_plan_wake_at", None):
            return
        cancel = getattr(self, "_plan_wake_cancel", None)
        if cancel:
            cancel()
        self._plan_wake_cancel = None
        self._plan_wake_at = when
        if when is None:
            return

        def fire() -> None:
            self._plan_wake_cancel = None
            self._plan_wake_at = None
            self._notify()
            self.hass.async_create_task(self._apply())
            self._schedule_plan_wake()

        delay = max(1.0, (when - dt_util.utcnow()).total_seconds() + 1)
        self._plan_wake_cancel = self._schedule(delay, fire)

    def save(self) -> None:
        """Öffentlich: Zustand speichern (z. B. vom Lüftungsassistenten)."""
        self._save()

    @callback
    def notify_listeners(self) -> None:
        self._notify()

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







    def _update_shift(self) -> None:
        """Abweichung zwischen Thermostat- und Raumfühler nachführen und dauerhaft merken.

        Die Livisi/HMIP-Thermostate regeln auf ihren eigenen Fühler. Liegt der um 1,2 K unter dem
        Raumfühler, muss der Sollwert um 1,2 K tiefer gesetzt werden – sonst heizt der Raum über.
        Früher wurde das nur im Moment einer Messung gerechnet; meldet der Fühler danach lange nicht
        (Batteriegeräte), blieb der unkompensierte Wert stehen.
        """
        if not self.ext_sensor_ok:
            # Fühler ausgefallen oder hängend: der gemerkte Wert ist alt. Gegen ihn nachzuführen
            # würde den Abgleich mit jeder Heizminute weiter aufblähen (Bad: 1,3 → 3,3 K).
            return
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

    @property
    def frost_temp(self) -> float:
        """Absoluter Frostschutz des Raums – wie am Gerät, standardmäßig 5 °C."""
        value = to_float(self.config.get(CONF_FROST_TEMP))
        return value if value is not None else 5.0

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
            self._valve_care_cancel = None
            self._valve_care_until = None
            self.hass.async_create_task(self._apply())

        self._valve_care_cancel = self._schedule(VALVE_CARE.total_seconds() + 1, _done)








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

        if entity_id in self.covers:
            self._on_shading_change(entity_id, old, new)
        if entity_id in self.windows:
            self._on_window(entity_id, new)
        elif entity_id == self.temp_sensor:
            if self._ingest_sensor(new):
                self.hass.async_create_task(self.async_calibrate())
        elif entity_id == self.trv:
            self._trv_reports.append(dt_util.utcnow())
            self._on_trv(old, new)
        elif entity_id == self.cal_entity or entity_id == self.valve_actuator:
            self.sync.check_all()
        else:
            for extra in self.extra_trvs:
                if entity_id in extra.tracked():
                    extra.sync.check_all()
                    if self.cal_mode == CAL_OFFSET and entity_id == extra.entity_id and old is not None and new is not None and old.attributes.get("current_temperature") != new.attributes.get("current_temperature"):
                        self.hass.async_create_task(extra.calibrate())
        if self.vent:
            self.vent.update()
        self.dehumidifier.update()
        self._sample_series()
        self._notify()

    def _ingest_sensor(self, state: State | None) -> bool:
        """Messwert prüfen und übernehmen. True bei neuem gültigem Wert."""
        if state is None:
            return False
        value = to_float(state.state)
        if value is None:
            return False  # unavailable/unknown: letzten Wert behalten
        value = round(value + self.sensor_offset, 2)  # Korrektur des Raumfühlers (#98)
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
        self._recheck_night_airing()
        self.dehumidifier.update()
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
