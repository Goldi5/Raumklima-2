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
    CONF_BOOST_MINUTES,
    CONF_BOOST_TEMP,
    CONF_CALIBRATION_ENTITY,
    CONF_CALIBRATION_MODE,
    CONF_CO2_SENSOR,
    CONF_COMFORT_TEMP,
    CONF_EXTRA_TRVS,
    CONF_FAST_POLL,
    CONF_HOME,
    CONF_HUMIDITY_SENSOR,
    CONF_NAME,
    CONF_OVERRIDE_MINUTES,
    CONF_PM25_SENSOR,
    CONF_ROOM_TYPE,
    CONF_SCHEDULE_FROM,
    CONF_SCHEDULES,
    CONF_SETBACK_LONG,
    CONF_SETBACK_SHORT,
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
    OFF_SOURCE_USER,
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
)
from .decision_log import (
    CAT_DEVICE,
    CAT_MANUAL,
    CAT_NOTIFY,
    fmt_temp,
)
from .health import (
    HistoryPoint,
)
from .heatup import HeatupTracker
from .hub import RaumklimaHub
from .logic import (
    any_open,
    clamp,
    heating_demand,
    is_valid,
    plausible_reading,
    to_float,
    window_open_state,
)
from .msg import tr
from .planning import (
    AWAY_STAGES,
    MoldGuard,
    next_schedule_window,
    schedule_target,
    setback_defaults,
)
from .room_apply import ApplyMixin
from .room_const import (
    REASON_SEASON,
    STORAGE_VERSION,
    VALVE_CARE,
)
from .room_extra_trvs import AcSource, ExtraTrv
from .room_health import HealthMixin
from .room_lights import LightSignal
from .room_mold import MoldMixin
from .room_plan import PlanMixin
from .room_presence import PresenceMixin
from .room_radio import RadioMixin
from .room_settings import SettingsMixin
from .room_store import StoreMixin
from .room_trv import MANUAL_OVERRIDE, TrvMixin
from .room_windows import WindowMixin
from .series import RoomSeries
from .shared import domain_data, get_hub
from .sync import SyncManager
from .usage_profile import UsageProfile
from .vent_manager import VentilationManager
from .ventilation import MIN_USEFUL_TARGET, comfort_temperature

_LOGGER = logging.getLogger(__name__)




class RaumklimaController(StoreMixin, RadioMixin, PlanMixin, MoldMixin, ApplyMixin, SettingsMixin, WindowMixin, TrvMixin, HealthMixin, PresenceMixin):
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
        self._store.async_delay_save(self._stored_data, 5)

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
        if not self.hvac_on or self.paused or not self.peek_plan()[0]:
            return HVACAction.OFF
        action = self._trv_attr("hvac_action")
        # Die gemeldete Ventilstellung ist das direkteste Signal. Manche Geräte (z. B. Bosch über
        # die SHC-Zentrale) melden „heizt“, solange der Modus Heizen ist – auch bei geschlossenem
        # Ventil (Issue #34). Steht das Ventil nachweislich zu, heizt der Raum nicht.
        valve = self.valve_position
        if valve is None:
            valve = self._trv_attr("valve_position")
        try:
            if valve is not None and float(valve) < VALVE_HEATING_MIN:
                return HVACAction.IDLE
        except (TypeError, ValueError):
            pass
        if action == HVACAction.HEATING or self._trv_attr("running_state") == "heat":
            return HVACAction.HEATING
        # Manche Geräte (z. B. Homematic IP) lassen hvac_action auf "idle", obwohl das Ventil regelt.
        # Dann entscheidet die Ventilstellung – zusammen mit Soll/Ist, damit "offen, aber Ziel erreicht"
        # nicht als Heizen gilt.
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
        on, _target, reason = self.peek_plan()
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
            nxt = next_schedule_window(self.schedules, local_now)
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






