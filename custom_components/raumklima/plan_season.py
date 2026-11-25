"""Heizsaison: Heizgrenze mit Tagesmittel und Vorhersage, Hysterese, Kälteeinbruch."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date, datetime, timedelta

from .plan_const import SEASON_ALWAYS, SEASON_COLD_SNAP, SEASON_HEAT_TODAY, SEASON_HEATING, SEASON_MANUAL_PAUSE, SEASON_PAUSE


# ------------------------------------------------------------------ Heizsaison
def parse_md(value: str, fallback: tuple[int, int]) -> tuple[int, int]:
    """'10-01' oder '01.10.' → (Monat, Tag)."""
    try:
        text = str(value).strip().strip(".")
        if "." in text:
            d, m = text.split(".")[:2]
            return int(m), int(d)
        m, d = text.split("-")[-2:]
        return int(m), int(d)
    except (ValueError, AttributeError):
        return fallback


def in_season(today: date, start: str, end: str) -> bool:
    """Liegt das Datum in der Heizsaison (auch über den Jahreswechsel)?"""
    sm, sd = parse_md(start, (10, 1))
    em, ed = parse_md(end, (4, 30))
    t = (today.month, today.day)
    s, e = (sm, sd), (em, ed)
    if s <= e:
        return s <= t <= e
    return t >= s or t <= e


def combined_mean(past: float | None, forecast: float | None) -> float | None:
    """Mittel aus den letzten 24 h und den nächsten 24 h (was vorhanden ist)."""
    values = [v for v in (past, forecast) if v is not None]
    return round(sum(values) / len(values), 1) if values else None


@dataclass
class SeasonState:
    """Merker der Heizsaison-Logik (wird gespeichert)."""

    heating: bool | None = None
    mild_since: datetime | None = None
    cold_since: datetime | None = None
    cold_snap: bool = False
    extra: dict = field(default_factory=dict)


@dataclass
class SeasonConfig:
    start: str = "10-01"
    end: str = "04-30"
    limit: float = 15.0
    off_hysteresis: float = 1.0
    off_after_hours: float = 48.0
    cold_temp: float = 12.0
    cold_days: float = 3.0


def season_step(
    state: SeasonState,
    now: datetime,
    mean_past: float | None,
    mean_forecast: float | None,
    cfg: SeasonConfig,
) -> SeasonState:
    """Heizbedarf neu bewerten (automatische Betriebsart)."""
    season = in_season(now.date(), cfg.start, cfg.end)
    mean = combined_mean(mean_past, mean_forecast)

    # Kälteeinbruch (auch außerhalb der Saison): 3 Tage Tagesmittel unter 12 °C
    if mean_past is not None and mean_past < cfg.cold_temp:
        state.cold_since = state.cold_since or now
        if now - state.cold_since >= timedelta(days=cfg.cold_days):
            state.cold_snap = True
    else:
        state.cold_since = None
        if state.cold_snap and mean_past is not None and mean_past > cfg.cold_temp + 1:
            state.cold_snap = False

    if not season:
        state.heating = False
        state.mild_since = None
        return state

    if mean is None:
        state.heating = True if state.heating is None else state.heating
        return state
    if state.heating is None:
        state.heating = mean < cfg.limit + cfg.off_hysteresis
        return state
    if state.heating:
        if mean > cfg.limit + cfg.off_hysteresis:
            state.mild_since = state.mild_since or now
            if now - state.mild_since >= timedelta(hours=cfg.off_after_hours):
                state.heating = False
                state.mild_since = None
        else:
            state.mild_since = None
    elif mean < cfg.limit:
        state.heating = True
        state.mild_since = None
    return state


def season_decision(
    mode: str,
    state: SeasonState,
    heat_today: bool,
    season: bool,
) -> str:
    """Ergebnis für die Anzeige und die Räume."""
    if heat_today:
        return SEASON_HEAT_TODAY
    if mode == "always":
        return SEASON_ALWAYS
    if mode == "pause":
        return SEASON_MANUAL_PAUSE
    if state.heating and season:
        return SEASON_HEATING
    if state.cold_snap:
        return SEASON_COLD_SNAP
    return SEASON_PAUSE


def season_allows_heating(decision: str) -> bool:
    return decision in (SEASON_HEATING, SEASON_COLD_SNAP, SEASON_HEAT_TODAY, SEASON_ALWAYS)
