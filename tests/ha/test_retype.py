"""Raumtyp nachträglich ändern: Standardwerte ziehen nach, eigene Werte bleiben."""

from __future__ import annotations

from homeassistant.core import HomeAssistant

from custom_components.raumklima.retype import retyped_values

# living: Wunsch 20, Absenkung 18/16 · office: 20, 18/16 · gym: 19, 17/15 · hallway: 18, 16/15


def test_standardwerte_folgen_dem_neuen_typ() -> None:
    """Wer nichts eigenes eingetragen hat, bekommt die Werte des neuen Typs."""
    config = {"comfort_temperature": None, "setback_short": 18.0, "setback_long": 16.0}
    out = retyped_values(config, "living", "gym")  # living 18/16 → gym 17/15
    assert out["setback_short"] == 17.0
    assert out["setback_long"] == 15.0


def test_eigene_werte_bleiben() -> None:
    """19 °C ist kein Standard des alten Typs – also selbst eingetragen und bleibt."""
    config = {"comfort_temperature": 19.0, "setback_short": 18.0, "setback_long": 16.0}
    out = retyped_values(config, "rarely_used", "gym")
    # 19 °C ist nicht der Standard von "selten genutzt" (17) → eigener Wert, bleibt
    assert "comfort_temperature" not in out
    assert "setback_short" not in out  # 18 != 16 (Standard rarely_used)
    assert out["setback_long"] == 15.0  # 16 war Standard → folgt dem neuen Typ


def test_gleiche_standards_aendern_nichts() -> None:
    """Wohnraum → Arbeitszimmer hat dieselben Werte: nichts zu tun."""
    config = {"comfort_temperature": None, "setback_short": 18.0, "setback_long": 16.0}
    assert retyped_values(config, "living", "office") == {}


def test_nicht_gesetzte_werte_bleiben_leer() -> None:
    """Nicht gesetzte Werte folgen ohnehin dem Typ – nicht künstlich festschreiben."""
    assert retyped_values({}, "living", "gym") == {}


async def test_karte_typwechsel_schreibt_standards(hass: HomeAssistant, setup) -> None:
    """Karte ändert den Raumtyp – die Optionen tragen danach die Werte des neuen Typs."""
    _hub, room = setup
    entry = hass.config_entries.async_get_entry(room.entry_id)
    assert entry is not None
    hass.config_entries.async_update_entry(
        entry, options={**entry.options, "room_type": "rarely_used", "setback_short": 16.0, "setback_long": 16.0}
    )

    from custom_components.raumklima.retype import retyped_values

    merged = {**entry.data, **entry.options}
    adjusted = retyped_values(merged, "rarely_used", "gym")
    hass.config_entries.async_update_entry(entry, options={**entry.options, **adjusted, "room_type": "gym"})
    await hass.async_block_till_done()

    entry = hass.config_entries.async_get_entry(room.entry_id)
    assert entry is not None
    assert entry.options["room_type"] == "gym"
    assert entry.options["setback_short"] == 17.0
    assert entry.options["setback_long"] == 15.0
