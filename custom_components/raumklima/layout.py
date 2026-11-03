"""Darstellung je Wohnung: Reihenfolge, ausgeblendete Räume, Größe und Farbe.

Der Speicher gehört der Integration, nicht dem Dashboard: so gilt die Auswahl für das
generierte *und* für ein selbst gebautes Dashboard, und sie überlebt YAML-Änderungen.

    .storage/raumklima_layout
    { "<home_id>": { "order": [...], "hidden": [...], "size": {...}, "color": {...} } }
"""

from __future__ import annotations

import logging
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

STORAGE_KEY = f"{DOMAIN}_layout"
STORAGE_VERSION = 1

SIZES = ("big", "tile", "off")


def _empty() -> dict[str, Any]:
    return {"order": [], "hidden": [], "size": {}, "color": {}}


def sanitize(raw: Any) -> dict[str, Any]:
    """Nur bekannte Felder und brauchbare Werte übernehmen."""
    out = _empty()
    if not isinstance(raw, dict):
        return out
    order = raw.get("order")
    if isinstance(order, list):
        out["order"] = [str(x) for x in order if isinstance(x, str) and x][:200]
    hidden = raw.get("hidden")
    if isinstance(hidden, list):
        out["hidden"] = [str(x) for x in hidden if isinstance(x, str) and x][:200]
    size = raw.get("size")
    if isinstance(size, dict):
        out["size"] = {str(k): str(v) for k, v in size.items() if str(v) in SIZES}
    color = raw.get("color")
    if isinstance(color, dict):
        out["color"] = {str(k): str(v) for k, v in color.items() if isinstance(v, str) and v.startswith("#")}
    return out


async def async_setup(hass: HomeAssistant) -> None:
    """Layout-Datei laden (einmal pro Lauf)."""
    store: Store = Store(hass, STORAGE_VERSION, STORAGE_KEY)
    data = await store.async_load() or {}
    buckets = data.get("homes") if isinstance(data, dict) else {}
    data_domain = hass.data.setdefault(DOMAIN, {})
    data_domain["layout"] = sanitize_map(buckets)
    data_domain["layout_store"] = store


def sanitize_map(raw: Any) -> dict[str, dict[str, Any]]:
    if not isinstance(raw, dict):
        return {}
    return {str(k): sanitize(v) for k, v in raw.items()}


def layout_for(hass: HomeAssistant, home_id: str | None) -> dict[str, Any]:
    """Layout einer Wohnung (leer, wenn nichts gespeichert ist)."""
    bucket = (hass.data.get(DOMAIN) or {}).get("layout") or {}
    if not home_id:
        return _empty()
    return bucket.get(home_id) or _empty()


async def async_save(hass: HomeAssistant, home_id: str, layout: Any) -> dict[str, Any]:
    """Layout einer Wohnung speichern und zurückgeben."""
    clean = sanitize(layout)
    data_domain = hass.data.setdefault(DOMAIN, {})
    bucket: dict[str, dict[str, Any]] = data_domain.setdefault("layout", {})
    bucket[home_id] = clean
    store: Store | None = data_domain.get("layout_store")
    if store is not None:
        await store.async_save({"version": STORAGE_VERSION, "homes": bucket})
    return clean
