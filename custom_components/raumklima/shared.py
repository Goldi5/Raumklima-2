"""Gemeinsame Daten aller Raumklima-Einträge (Zentralen und Räume) und kleine Helfer."""

from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING, Any

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from .const import DOMAIN

if TYPE_CHECKING:
    from .hub import RaumklimaHub


def domain_data(hass: HomeAssistant) -> dict[str, Any]:
    """Gemeinsame Daten: Zentrale und alle Räume."""
    data = hass.data.setdefault(DOMAIN, {"hub": None, "rooms": {}})
    data.setdefault("hubs", {})
    return data


def get_hub(hass: HomeAssistant, home: str | None = None) -> RaumklimaHub | None:
    """Zentrale einer Wohnung (entry_id) – ohne Angabe die erste/Standard-Wohnung."""
    data = domain_data(hass)
    hubs: dict[str, RaumklimaHub] = data["hubs"]
    if home and home in hubs:
        return hubs[home]
    return data.get("hub") or next(iter(hubs.values()), None)


def all_hubs(hass: HomeAssistant) -> list[RaumklimaHub]:
    return list(domain_data(hass)["hubs"].values())


def iso(value: datetime | None) -> str | None:
    return value.isoformat() if value else None


def parse_dt(value: Any) -> datetime | None:
    return dt_util.parse_datetime(value) if isinstance(value, str) else None
