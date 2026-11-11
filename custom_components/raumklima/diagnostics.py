"""Diagnose-Export: alles, was zur Fehlersuche nötig ist – in einer Datei.

Abrufbar auf zwei Wegen:

* Home Assistant → Einstellungen → Geräte → Raumklima → *Diagnose herunterladen*
* Karte → Einstellungen → Knopf **Diagnose** (WebSocket ``raumklima/diagnostics``)

Inhalt: Umgebung, Wohnungs-Zustand, jeder Raum mit Konfiguration und Live-Werten, die
Rohzustände aller beteiligten Entitäten (inklusive Attribute – das klärt Geräte-Fragen wie
„liefert das Thermostat einen Heiz-Zustand?"), das Entscheidungsprotokoll und die letzten
Log-Zeilen der Integration. Zugangsdaten werden redigiert.
"""

from __future__ import annotations

from datetime import UTC, datetime
import platform
import re
from typing import Any

from homeassistant.components.diagnostics import async_redact_data
from homeassistant.const import __version__ as HA_VERSION
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.loader import async_get_integration

from . import RaumklimaConfigEntry
from .const import DOMAIN
from .debug_log import tail as debug_tail

# Alles, was nie in einer Diagnose-Datei landen darf
TO_REDACT = {
    "mail_password",
    "mail_user",
    "mail_from",
    "mail_to",
    "password",
    "token",
    "access_token",
    "api_key",
    "latitude",
    "longitude",
}

# Sieht aus wie eine Entitäts-ID („domain.object_id")
_ENTITY_RE = re.compile(r"^[a-z_]+\.[a-z0-9_]+$")
# Das sind Dienste, keine Zustands-Entitäten – sie stehen nicht in hass.states
_SERVICE_DOMAINS = ("notify", "tts")


def _iso(value: Any) -> str | None:
    return value.isoformat() if value is not None else None


def _service_ids_from(value: Any) -> list[str]:
    """Dienste wie notify.a aus einem Konfigurationswert ziehen."""
    out: list[str] = []
    if isinstance(value, str):
        if _ENTITY_RE.match(value) and value.split(".", 1)[0] in _SERVICE_DOMAINS:
            out.append(value)
    elif isinstance(value, (list, tuple, set)):
        for item in value:
            out.extend(_service_ids_from(item))
    elif isinstance(value, dict):
        for key, item in value.items():
            out.extend(_service_ids_from(key))
            out.extend(_service_ids_from(item))
    return out


def _entity_ids_from(value: Any) -> list[str]:
    """Alle Entitäts-IDs aus einem beliebigen Konfigurationswert ziehen."""
    out: list[str] = []
    if isinstance(value, str):
        if _ENTITY_RE.match(value) and value.split(".", 1)[0] not in _SERVICE_DOMAINS:
            out.append(value)
    elif isinstance(value, (list, tuple, set)):
        for item in value:
            out.extend(_entity_ids_from(item))
    elif isinstance(value, dict):
        for item in value.values():
            out.extend(_entity_ids_from(item))
    return out


def _dump_entity(hass: HomeAssistant, entity_id: str) -> dict[str, Any]:
    """Rohzustand einer Entität – so, wie Home Assistant ihn kennt."""
    state = hass.states.get(entity_id)
    if state is None:
        return {"missing": True}
    out: dict[str, Any] = {
        "state": state.state,
        "last_changed": _iso(state.last_changed),
        "last_updated": _iso(state.last_updated),
        "attributes": dict(state.attributes),
    }
    reported = getattr(state, "last_reported", None)
    if reported is not None:
        out["last_reported"] = _iso(reported)
    return out


def _own_entities(hass: HomeAssistant, entry_id: str) -> list[str]:
    """Alle Entitäten, die diese Integration für den Eintrag angelegt hat."""
    registry = er.async_get(hass)
    return sorted(
        item.entity_id for item in registry.entities.values() if item.config_entry_id == entry_id
    )


def _hub_entities(hass: HomeAssistant, entry_id: str) -> dict[str, Any]:
    """Entitäten der Zentrale selbst – Urlaub, Gäste, Betriebsart, Heute heizen."""
    entities = {eid: _dump_entity(hass, eid) for eid in _own_entities(hass, entry_id)}
    return {
        "entities": entities,
        "unavailable": [
            eid
            for eid, dump in entities.items()
            if dump.get("missing") or dump.get("state") in ("unavailable", "unknown", "none", "")
        ],
    }


def _learned_room(room: Any) -> dict[str, Any]:
    """Was der Raum über die Zeit gelernt hat – erklärt sein Verhalten."""
    hub = getattr(room, "hub", None)
    outdoor = hub.outdoor_temp() if hub is not None else None
    heatup = getattr(room, "heatup", None)
    episodes = list(getattr(heatup, "episodes", []) or [])
    config = dict(getattr(room, "config", {}) or {})
    return {
        "abgleich": {
            "mode": getattr(room, "cal_mode", None),
            "shift": round(float(getattr(room, "shift", 0.0) or 0.0), 2),
            "offset": getattr(room, "offset", None),
        },
        "heatup": {
            "episodes": len(episodes),
            "rate": heatup.rate(outdoor) if heatup is not None else None,
            "minutes_2k": heatup.minutes_needed(2.0, outdoor) if heatup is not None else None,
            "last": [
                {key: episode.get(key) for key in ("start", "target", "outdoor", "rate")}
                for episode in episodes[-3:]
            ],
        },
        "preset": {
            "configured": config.get("on_preset"),
            "learned": getattr(room, "preset_learned", None),
            "device": getattr(room, "trv_on_preset", None),
        },
        "valve_sensor": getattr(room, "valve_sensor", None),
        "schedules": {
            "count": len(config.get("schedules") or []),
            "shared_from": config.get("schedule_from") or None,
            "learn_times": bool(hub.config.get("learn_times")) if hub is not None else None,
        },
        "usage": getattr(room, "usage_summary", {}) or None,
    }


def _learned_hub(hub: Any) -> dict[str, Any]:
    """Was die Wohnung gelernt hat: Anwesenheitsprofil, Lernschalter."""
    profile = getattr(hub, "presence_profile", None)
    out: dict[str, Any] = {}
    if profile is not None:
        weekdays = list(getattr(profile, "days", {}).values())
        summary = profile.summary()
        out["presence"] = {
            "days_total": len(weekdays),
            "days_weekday": sum(1 for day in weekdays if day <= 4),
            "days_weekend": sum(1 for day in weekdays if day >= 5),
            "typical": profile.typical(),
            "weekday_hours": round(sum(1 for value in summary.get("weekday", []) if value >= 0.6) / 4, 1),
            "weekend_hours": round(sum(1 for value in summary.get("weekend", []) if value >= 0.6) / 4, 1),
        }
    config = dict(getattr(hub, "config", {}) or {})
    out["flags"] = {
        "learn_times": config.get("learn_times"),
        "learn_shift": config.get("learn_shift"),
        "season_mode": config.get("season_mode"),
        "presence_kind": config.get("presence_kind"),
    }
    return out


def _room_block(hass: HomeAssistant, entry: RaumklimaConfigEntry) -> dict[str, Any]:
    """Ein Raum: Konfiguration, Live-Werte, Rohzustände, Verfügbarkeit."""
    room = entry.runtime_data
    config = dict(getattr(room, "config", {}) or {})
    values: dict[str, Any] = {}
    if hasattr(room, "diagnostics"):
        try:
            values = room.diagnostics()
        except Exception as err:  # noqa: BLE001 – Diagnose darf nie selbst abstürzen
            values = {"error": f"{type(err).__name__}: {err}"}

    values.pop("config", None)  # steckt schon oben unter "config"
    referenced = _entity_ids_from(config)
    valve = getattr(room, "valve_sensor", None)
    if isinstance(valve, str):
        referenced.append(valve)
    own = _own_entities(hass, entry.entry_id)
    entities = {eid: _dump_entity(hass, eid) for eid in sorted(set(referenced) | set(own))}
    services = {
        sid: {"exists": hass.services.has_service(*sid.split(".", 1))}
        for sid in sorted(set(_service_ids_from(config)))
    }

    unavailable = [
        eid for eid, dump in entities.items() if dump.get("missing") or dump.get("state") == "unavailable"
    ]
    unknown = [eid for eid, dump in entities.items() if dump.get("state") == "unknown"]
    return {
        "name": entry.title,
        "entry_id": entry.entry_id,
        "state": str(entry.state),
        "config": config,
        "learned": _learned_room(room),
        "values": values,
        "series": _series_block(room),
        "entities": entities,
        "services": services,
        "unavailable": unavailable,
        "unknown": unknown,
    }


def _series_block(room: Any) -> dict[str, Any]:
    """Kurve der letzten ~24 h (Ist, Ziel, Gerätesollwert, Ventil, Zustand)."""
    series = getattr(room, "series", None)
    if series is None or not hasattr(series, "export"):
        return {}
    try:
        return series.export()
    except Exception as err:  # noqa: BLE001 – Diagnose darf nie selbst abstürzen
        return {"error": f"{type(err).__name__}: {err}"}


def _setpoint_events(hub: Any, limit: int = 200) -> list[dict[str, Any]]:
    """Sollwertwechsel mit Quelle: unser Schreibvorgang oder eine Änderung am Gerät.

    Die Unterscheidung ist bei „das Thermostat macht, was es will“ die entscheidende Frage –
    im Protokoll stehen beide Fälle als eigene Kategorie, hier stehen sie nebeneinander.
    """
    if hub is None or not hasattr(hub, "log"):
        return []
    out: list[dict[str, Any]] = []
    for entry in hub.log.query(limit=2000):
        cat = str(entry.get("cat") or "")
        msg = str(entry.get("msg") or "")
        if cat not in ("target", "manual", "device"):
            continue
        if not any(word in msg for word in ("Sollwert", "Ziel", "gedreht", "Wunschtemperatur")):
            continue
        if msg.startswith("Thermostat: Sollwert") or "Sollwert gesendet" in msg:
            source = "raumklima"
        elif "gedreht" in msg:
            source = "geraet"
        else:
            source = "plan"
        out.append({"t": entry.get("t"), "room": entry.get("room"), "source": source, "cat": cat, "msg": msg})
        if len(out) >= limit:
            break
    out.reverse()  # chronologisch, älteste zuerst
    return out


def _hub_block(hass: HomeAssistant, entry: RaumklimaConfigEntry) -> dict[str, Any] | None:
    """Wohnung (Zentrale) – ohne Geheimnisse."""
    hub = entry.runtime_data
    if not hasattr(hub, "rooms"):
        hub = getattr(hub, "hub", None)
    if hub is None or not hasattr(hub, "summary"):
        return None
    try:
        data = hub.diagnostics()
    except Exception as err:  # noqa: BLE001
        return {"error": f"{type(err).__name__}: {err}"}
    data.pop("decision_log", None)  # kommt gesammelt unten
    # Die rohen 15-Minuten-Raster (2 × 96 Werte) sind für die Fehlersuche unlesbar –
    # als Kennzahl plus typische Fenster sind sie brauchbar.
    data.pop("presence_profile", None)
    data["learned"] = _learned_hub(hub)
    data["rooms_known"] = sorted(getattr(hub, "rooms", {}) or {})
    if hasattr(hub, "storm_summary"):
        data["storm"] = hub.storm_summary()
    return data


def _secret_values(*configs: Any) -> set[str]:
    """Konkrete Geheimwerte einsammeln – sie stehen auch in Freitext (Protokoll, Meldungen).

    Sucht auch in verschachtelten Einstellungen (z. B. ``mail: {password: …}``), weil die
    Redaktion nach Schlüsselnamen dort ebenfalls greift.
    """
    out: set[str] = set()

    def walk(value: Any, key: str | None = None) -> None:
        if isinstance(value, dict):
            for sub_key, sub_value in value.items():
                walk(sub_value, str(sub_key))
            return
        if isinstance(value, (list, tuple, set)):
            for item in value:
                walk(item, key)
            return
        if key is None or key not in TO_REDACT or not isinstance(value, str):
            return
        if len(value) >= 4:
            out.add(value)
        # Mehrfachwerte („a@x.de, b@y.de") auch einzeln – im Protokoll steht oft nur einer davon.
        for part in re.split(r"[,;\s]+", value):
            if len(part) >= 4:
                out.add(part)

    for config in configs:
        walk(config)
    return out


def _scrub(obj: Any, secrets: set[str]) -> Any:
    """Geheimwerte auch im Fließtext ersetzen (Redaktion greift nur bei Schlüsselnamen)."""
    if not secrets:
        return obj
    if isinstance(obj, str):
        for secret in secrets:
            if secret in obj:
                obj = obj.replace(secret, "**REDACTED**")
        return obj
    if isinstance(obj, list):
        return [_scrub(item, secrets) for item in obj]
    if isinstance(obj, dict):
        return {key: _scrub(value, secrets) for key, value in obj.items()}
    return obj


async def async_get_config_entry_diagnostics(
    hass: HomeAssistant, entry: RaumklimaConfigEntry
) -> dict[str, Any]:
    """Diagnose für einen Raum oder eine Wohnung zusammenstellen."""
    integration = await async_get_integration(hass, DOMAIN)
    now = datetime.now(UTC)

    data = entry.runtime_data
    hub = data if hasattr(data, "rooms") else getattr(data, "hub", None)

    rooms: list[dict[str, Any]] = []
    if hasattr(data, "rooms"):  # Eintrag der Zentrale: alle Räume mitnehmen
        for room_entry in hass.config_entries.async_entries(DOMAIN):
            if room_entry.entry_id == entry.entry_id or not hasattr(room_entry, "runtime_data"):
                continue
            if getattr(room_entry.runtime_data, "hub", None) is not hub:
                continue
            rooms.append(_room_block(hass, room_entry))
    elif hasattr(data, "diagnostics"):  # einzelner Raum
        rooms.append(_room_block(hass, entry))

    bundle: dict[str, Any] = {
        "generated": now.isoformat(),
        "environment": {
            "integration": integration.version,
            "home_assistant": HA_VERSION,
            "python": platform.python_version(),
            "language": hass.config.language,
            "timezone": str(hass.config.time_zone),
            "recorder": "recorder" in hass.config.components,
        },
        "entry": {
            "entry_id": entry.entry_id,
            "title": entry.title,
            "state": str(entry.state),
            "data": dict(entry.data),
            "options": dict(entry.options),
        },
        "home_name": getattr(hub, "name", None) or entry.title,
        "home_id": getattr(getattr(hub, "entry", None), "entry_id", entry.entry_id),
        "hub": _hub_block(hass, entry),
        "hub_entities": _hub_entities(hass, getattr(getattr(hub, "entry", None), "entry_id", entry.entry_id)),
        "rooms": rooms,
        "services": {
            sid: {"exists": hass.services.has_service(*sid.split(".", 1))}
            for sid in sorted(
                set(_service_ids_from(dict(hub.config))) if hub is not None and hasattr(hub, "config") else set()
            )
        },
        "log": hub.log.query(limit=50) if hub is not None and hasattr(hub, "log") else [],
        "events": _setpoint_events(hub),
        "debug": debug_tail(),
    }
    secrets: set[str] = set()
    secrets |= _secret_values(dict(entry.data), dict(entry.options))
    if hub is not None and hasattr(hub, "config"):
        secrets |= _secret_values(dict(hub.config))
    for room_data in rooms:
        secrets |= _secret_values(room_data.get("config") or {})

    return async_redact_data(_scrub(bundle, secrets), TO_REDACT)
