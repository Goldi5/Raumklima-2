"""Einstellungen sichern und wiederherstellen."""

from __future__ import annotations

from homeassistant.core import HomeAssistant
import pytest

from custom_components.raumklima.backup import apply_backup, build_backup
from custom_components.raumklima.shared import domain_data


async def test_sicherung_enthaelt_wohnung_und_raeume(hass: HomeAssistant, setup) -> None:
    hub_entry, room = setup
    data = build_backup(hass)

    assert data["format"] == 1
    assert data["created"]
    assert data["hub"], "Wohnungs-Einstellungen fehlen"
    assert room.title in data["rooms"]
    assert "trv" in data["rooms"][room.title]
    assert "entry_id" not in data["rooms"][room.title]


async def test_raeume_werden_ueber_den_namen_zugeordnet(hass: HomeAssistant, setup) -> None:
    _hub, room = setup
    data = build_backup(hass)
    data["rooms"][room.title]["boost_minutes"] = 45

    result = apply_backup(hass, data)

    assert result["rooms"] == [room.title]
    assert result["skipped"] == []
    entry = hass.config_entries.async_get_entry(room.entry_id)
    assert entry.options["boost_minutes"] == 45


async def test_unbekannte_raeume_werden_gemeldet(hass: HomeAssistant, setup) -> None:
    _hub, room = setup
    data = build_backup(hass)
    data["rooms"]["Gibt es nicht"] = {"boost_minutes": 19}

    result = apply_backup(hass, data)

    assert result["skipped"] == ["Gibt es nicht"]
    assert result["rooms"] == [room.title]


async def test_unbekannte_schluessel_werden_ignoriert(hass: HomeAssistant, setup) -> None:
    _hub, room = setup
    data = build_backup(hass)
    data["rooms"][room.title]["boese_einstellung"] = True

    apply_backup(hass, data)

    entry = hass.config_entries.async_get_entry(room.entry_id)
    assert "boese_einstellung" not in entry.options


async def test_fremde_datei_wird_abgelehnt(hass: HomeAssistant, setup) -> None:
    with pytest.raises(ValueError):
        apply_backup(hass, {"format": 99})
    with pytest.raises(ValueError):
        apply_backup(hass, "kein Wörterbuch")


async def test_rueckweg_erhaelt_die_werte(hass: HomeAssistant, setup) -> None:
    """Sichern, Werte ändern, zurückspielen – danach gilt wieder die Sicherung."""
    _hub, room = setup
    entry = hass.config_entries.async_get_entry(room.entry_id)
    hass.config_entries.async_update_entry(entry, options={**entry.options, "boost_minutes": 33})
    original = build_backup(hass)
    hass.config_entries.async_update_entry(entry, options={**entry.options, "boost_minutes": 17})

    apply_backup(hass, original)

    restored = hass.config_entries.async_get_entry(room.entry_id)
    assert restored.options["boost_minutes"] == original["rooms"][room.title]["boost_minutes"]
    assert domain_data(hass)["rooms"].get(room.entry_id) is not None
