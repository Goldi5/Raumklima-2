"""Heizsaison: Außentemperatur, Wettervorhersage, Heizgrenze, „Heute heizen“, Sommerpflege."""

from __future__ import annotations

from datetime import datetime, timedelta
import logging
from typing import TYPE_CHECKING

from homeassistant.core import callback
from homeassistant.util import dt as dt_util

from .const import (
    CONF_COLD_SNAP_TEMP,
    CONF_FROST_NIGHT,
    CONF_HEATING_LIMIT,
    CONF_LATITUDE,
    CONF_LONGITUDE,
    CONF_OUTDOOR_TEMP,
    CONF_SEASON_END,
    CONF_SEASON_MODE,
    CONF_SEASON_START,
    CONF_VALVE_CARE,
    CONF_ZONE,
    KIND_SEASON,
)
from .decision_log import (
    CAT_MANUAL,
    CAT_SEASON,
    fmt_temp,
)
from .logic import to_float
from .msg import N_, dec, tr
from .planning import (
    ForecastHour,
    SeasonConfig,
    combined_mean,
    frost_night_min,
    in_season,
    location_known,
    season_allows_heating,
    season_decision,
    season_step,
    sun_expected,
)
from .shared import parse_dt

if TYPE_CHECKING:
    pass


_LOGGER = logging.getLogger(__name__)

HEAT_TODAY = timedelta(hours=24)

SEASON_TEXT = {
    "heating": N_("Heizen"),
    "pause": N_("Heizpause"),
    "cold_snap": N_("Kälteeinbruch"),
    "heat_today": N_("Heute heizen"),
    "always": N_("Immer heizen"),
    "manual_pause": N_("Heizpause (von Hand)"),
}


class SeasonMixin:
    """Heizsaison-Teil der Zentrale."""

    def outdoor_temp(self) -> float | None:
        """Außentemperatur: eigene Wetterstation, sonst Wert des Wetterdienstes.

        Eine eingetragene Fühler-Entität hat Vorrang. Liefert sie keinen gültigen Wert
        (ausgefallen, „unavailable"), gilt weiter der Wetterdienst – so bleibt die
        Regelung bei einem Sensorausfall handlungsfähig.
        """
        own = str(self.opt(CONF_OUTDOOR_TEMP) or "").strip()
        if own:
            own_state = self.hass.states.get(own)
            own_value = to_float(own_state.state) if own_state is not None else None
            if own_value is not None:
                return own_value
        weather = self.weather
        state = self.hass.states.get(weather) if weather else None
        if state is None:
            return None
        if weather.startswith("weather."):
            return to_float(state.attributes.get("temperature"))
        return to_float(state.state)

    @callback
    def _on_sample_tick(self, _now: datetime) -> None:
        self._sample_outdoor()

    def _sample_outdoor(self) -> None:
        now = dt_util.utcnow()
        temp = self.outdoor_temp()
        if temp is not None:
            self.samples.append((now, temp))
        cutoff = now - timedelta(hours=72)
        self.samples = [(w, t) for w, t in self.samples if w >= cutoff]
        last24 = [t for w, t in self.samples if w >= now - timedelta(hours=24)]
        span = (now - min((w for w, _ in self.samples), default=now)).total_seconds() / 3600
        self.mean_past = round(sum(last24) / len(last24), 1) if last24 and span >= 3 else None
        self._evaluate_season()

    @callback
    def _on_forecast_tick(self, _now: datetime) -> None:
        self.hass.async_create_task(self._async_update_forecast())

    async def _async_update_forecast(self) -> None:
        weather = self.weather
        if not weather or not weather.startswith("weather."):
            self.mean_forecast = None
            self.forecast_hourly = []
            return
        temps: list[float] = []
        hourly: list[ForecastHour] = []
        for kind in ("hourly", "daily"):
            try:
                resp = await self.hass.services.async_call(
                    "weather",
                    "get_forecasts",
                    {"entity_id": weather, "type": kind},
                    blocking=True,
                    return_response=True,
                )
            except Exception as err:  # noqa: BLE001 – Wetterdienst nicht erreichbar o. ä.
                _LOGGER.debug("Vorhersage (%s) nicht verfügbar: %s", kind, err)
                continue
            forecast = ((resp or {}).get(weather) or {}).get("forecast") or []
            now = dt_util.utcnow()
            if kind == "hourly":
                for item in forecast:
                    when = parse_dt(item.get("datetime"))
                    temp = to_float(item.get("temperature"))
                    if when and temp is not None and when <= now + timedelta(hours=24):
                        temps.append(temp)
                        hourly.append(
                            ForecastHour(
                                when,
                                temp,
                                item.get("condition"),
                                to_float(item.get("cloud_coverage")),
                                to_float(item.get("wind_gust_speed")) or to_float(item.get("wind_speed")),
                                to_float(item.get("precipitation")),
                            )
                        )
            elif forecast:
                hi = to_float(forecast[0].get("temperature"))
                lo = to_float(forecast[0].get("templow"))
                temps = [t for t in (hi, lo) if t is not None]
            if temps:
                break
        self.mean_forecast = round(sum(temps) / len(temps), 1) if temps else None
        self.forecast_hourly = hourly
        self._evaluate_season()

    @property
    def sun_location(self) -> tuple[float, float]:
        """Standort der Wohnung: eigene Koordinaten, sonst die von Home Assistant.

        Wichtig, wenn eine Wohnung fern überwacht wird (Home Assistant in Remscheid, Wohnung in
        Berlin): der Sonnenstand hängt am Ort der Wohnung, nicht am Ort der Zentrale.
        """
        lat, lon = self.opt(CONF_LATITUDE), self.opt(CONF_LONGITUDE)
        if location_known(lat, lon):
            return float(lat), float(lon)
        # Zone der Wohnung: steht bei den meisten richtig und spart die Handarbeit
        zone = self.opt(CONF_ZONE)
        if zone:
            state = self.hass.states.get(str(zone))
            if state is not None:
                zlat = state.attributes.get("latitude")
                zlon = state.attributes.get("longitude")
                if location_known(zlat, zlon):
                    return float(zlat), float(zlon)
        return self.hass.config.latitude, self.hass.config.longitude

    def sun_expected(self, facade: str | None = None) -> bool:
        """Scheint laut Vorhersage in den nächsten Stunden die Sonne auf diese Fassade?"""
        lat, lon = self.sun_location
        return sun_expected(self.forecast_hourly, dt_util.utcnow(), facade, lat, lon)

    @property
    def frost_night(self) -> float | None:
        """Tiefstwert der nächsten 12 h, falls eine Frostnacht (≤ −5 °C) kommt und die Option an ist."""
        if not self.opt(CONF_FROST_NIGHT):
            return None
        return frost_night_min(self.forecast_hourly, dt_util.utcnow())

    def _season_config(self) -> SeasonConfig:
        return SeasonConfig(
            start=str(self.opt(CONF_SEASON_START)),
            end=str(self.opt(CONF_SEASON_END)),
            limit=float(self.opt(CONF_HEATING_LIMIT)),
            cold_temp=float(self.opt(CONF_COLD_SNAP_TEMP)),
        )

    @property
    def in_season(self) -> bool:
        cfg = self._season_config()
        return in_season(dt_util.now().date(), cfg.start, cfg.end)

    @property
    def mean_combined(self) -> float | None:
        return combined_mean(self.mean_past, self.mean_forecast)

    def _evaluate_season(self) -> None:
        now = dt_util.now()
        if self.heat_today_until and dt_util.utcnow() > self.heat_today_until:
            self.heat_today_until = None
        self.season = season_step(self.season, now, self.mean_past, self.mean_forecast, self._season_config())
        new = season_decision(
            str(self.opt(CONF_SEASON_MODE)),
            self.season,
            self.heat_today_until is not None,
            self.in_season,
        )
        if new != self.decision:
            old, self.decision = self.decision, new
            _LOGGER.info("Heizbetrieb: %s → %s", old, new)
            self.log.add(
                CAT_SEASON,
                tr("Heizbetrieb: {old} → {new}", old=tr(SEASON_TEXT.get(old, old)), new=tr(SEASON_TEXT.get(new, new))),
                self._season_why(new),
                decision=new,
                mean_past=self.mean_past,
                mean_forecast=self.mean_forecast,
            )
            self._announce_season(old, new)
            self._save()
            self._changed()
        else:
            self._save()
            self._changed(rooms=False)

    def _season_why(self, decision: str) -> str:
        limit = float(self.opt(CONF_HEATING_LIMIT))
        base = tr(
            "Ø letzte 24 h {past}, Vorhersage 24 h {fc}, zusammen {comb} – Heizgrenze {limit}",
            past=fmt_temp(self.mean_past), fc=fmt_temp(self.mean_forecast), comb=fmt_temp(self.mean_combined), limit=fmt_temp(limit, 0),
        )
        reason = {
            "heating": tr("unter der Heizgrenze") if self.in_season else tr("Heizsaison"),
            "pause": tr("seit 48 h mild") if self.in_season else tr("außerhalb der Heizsaison"),
            "cold_snap": tr("3 Tage unter {t} – Kälteeinbruch", t=fmt_temp(float(self.opt(CONF_COLD_SNAP_TEMP)), 0)),
            "heat_today": tr("„Heute heizen“ gedrückt (24 h)"),
            "always": tr("Betriebsart „Immer heizen“"),
            "manual_pause": tr("Betriebsart „Heizpause“"),
        }.get(decision, "")
        return f"{reason}; {base}" if reason else base

    def _announce_season(self, old: str, new: str) -> None:
        mean = self.mean_combined
        limit = float(self.opt(CONF_HEATING_LIMIT))
        detail = tr("Außen-Mittel {mean} °C, Heizgrenze {limit} °C.", mean=dec(mean), limit=f"{limit:.0f}") if mean is not None else ""
        heating_now = season_allows_heating(new)
        if heating_now == season_allows_heating(old):
            return
        if old in ("heat_today", "always", "manual_pause") or new in ("heat_today", "always", "manual_pause"):
            return  # von Hand ausgelöst – keine Meldung nötig
        if new == "heating":
            self.notify(KIND_SEASON, tr("🍂 Heizsaison"), tr("Es ist kühl genug – die Heizung arbeitet wieder. {detail}", detail=detail))
        elif new == "cold_snap":
            self.notify(KIND_SEASON, tr("🥶 Kälteeinbruch"), tr("Seit 3 Tagen kalt – es wird trotz Sommerzeit geheizt. {detail}", detail=detail))
        elif new == "pause":
            self.notify(KIND_SEASON, tr("☀️ Heizpause"), tr("Draußen ist es mild genug – die Heizung pausiert. {detail}", detail=detail))

    @property
    def heating_allowed(self) -> bool:
        return season_allows_heating(self.decision)

    def heat_today(self) -> None:
        self.log.add(CAT_MANUAL, tr("„Heute heizen“ gedrückt"), tr("heizt 24 h, egal wie mild es ist"))
        self.heat_today_until = dt_util.utcnow() + HEAT_TODAY
        self._evaluate_season()

    def cancel_heat_today(self) -> None:
        self.log.add(CAT_MANUAL, tr("„Heute heizen“ beendet"))
        self.heat_today_until = None
        self._evaluate_season()

    @callback
    def _on_valve_care(self, now: datetime) -> None:
        if dt_util.as_local(now).weekday() != 2 or not self.opt(CONF_VALVE_CARE):
            return
        if self.heating_allowed:
            return
        _LOGGER.info("Sommerpflege: Ventile werden kurz bewegt")
        self.log.add(CAT_SEASON, tr("Sommerpflege: Ventile werden kurz geöffnet"), tr("mittwochs 11 Uhr in der Heizpause, damit nichts festsitzt"))
        for room in list(self.rooms.values()):
            self.hass.async_create_task(room.async_valve_care())
