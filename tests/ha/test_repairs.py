"""Reparaturen: schwache Batterie, fehlender Fühler, stummes Thermostat."""

from __future__ import annotations

from types import SimpleNamespace

from homeassistant.core import HomeAssistant
from homeassistant.helpers import issue_registry as ir

from custom_components.raumklima.const import DOMAIN, STATUS_SENSOR, STATUS_TRV
from custom_components.raumklima.repairs import clear_repairs, sync_repairs


def _room(entry_id: str = "abc", *, level: float | None = 12.0, status: str = "heating"):
    return SimpleNamespace(
        entry=SimpleNamespace(entry_id=entry_id),
        name="Bad",
        battery_low={"low": level is not None and level < 20, "level": level},
        status=status,
    )


def _hub(*rooms):
    return SimpleNamespace(rooms={r.entry.entry_id: r for r in rooms})


def _issue(hass: HomeAssistant, issue_id: str):
    return ir.async_get(hass).async_get_issue(DOMAIN, issue_id)


def test_schwache_batterie_wird_gemeldet_und_verschwindet(hass: HomeAssistant) -> None:
    room = _room()
    sync_repairs(hass, _hub(room))
    issue = _issue(hass, "battery_abc")
    assert issue is not None
    assert issue.translation_key == "battery_low"
    assert issue.translation_placeholders["room"] == "Bad"
    assert issue.translation_placeholders["level"] == "12"

    room.battery_low = {"low": False, "level": 90.0}
    sync_repairs(hass, _hub(room))
    assert _issue(hass, "battery_abc") is None


def test_fuehler_fehlt_wird_gemeldet(hass: HomeAssistant) -> None:
    room = _room(status=STATUS_SENSOR)
    sync_repairs(hass, _hub(room))
    assert _issue(hass, "sensor_abc") is not None
    assert _issue(hass, "trv_abc") is None


def test_thermostat_stumm_wird_gemeldet(hass: HomeAssistant) -> None:
    room = _room(status=STATUS_TRV)
    sync_repairs(hass, _hub(room))
    issue = _issue(hass, "trv_abc")
    assert issue is not None
    assert issue.translation_key == "trv_unavailable"


def test_gesunder_raum_hat_keine_meldung(hass: HomeAssistant) -> None:
    sync_repairs(hass, _hub(_room(level=95.0)))
    assert not [i for i in ("battery_abc", "sensor_abc", "trv_abc") if _issue(hass, i)]


def test_entladen_raeumt_auf(hass: HomeAssistant) -> None:
    room = _room(status=STATUS_TRV)
    hub = _hub(room)
    sync_repairs(hass, hub)
    assert _issue(hass, "trv_abc") is not None
    clear_repairs(hass, hub)
    assert _issue(hass, "trv_abc") is None
