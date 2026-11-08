"""Gerät schaltet beim Abschalten selbst auf „heizen" – sofort nachziehen (Issue #37, Nachtrag).

Beim Setzen der Minimaltemperatur wechseln manche Geräte (TRVZB, Bosch) selbst in den Heizmodus.
Das ist Folge unseres eigenen Schreibens und darf nicht als Handeingriff zählen — seit 0.62.15b1
wird es ignoriert. Offen blieb: das Gerät stand dann bis zum nächsten Abgleich im Heizmodus
(bei 5-Minuten-Takt bis zu zehn Minuten), obwohl der Raum längst aus sein wollte.

Jetzt zieht die Integration den Aus-Zustand sofort nach — aber nur, wenn das Gerät tatsächlich
nicht aus ist. Sonst würde jeder Poll eines ausgeschalteten Raums einen Schreibbefehl auslösen.
"""

from __future__ import annotations

from homeassistant.core import HomeAssistant

from custom_components.raumklima.const import DOMAIN

from .conftest import FakeTrv


async def _off(hass: HomeAssistant) -> None:
    await hass.services.async_call("climate", "turn_off", {"entity_id": "climate.bad"}, blocking=True)
    await hass.async_block_till_done()


async def test_gruppe_nachziehen_wenn_geraet_nach_eigenem_schreiben_heizt(
    hass: HomeAssistant, setup, trv: FakeTrv
) -> None:
    """Eigener Schreibbefehl → Gerät meldet „heizen" → Aus-Zustand wird sofort nachgesetzt."""
    _, room = setup
    await _off(hass)
    assert trv.is_off

    ctrl = hass.data[DOMAIN]["rooms"][room.entry_id]
    ctrl._mark_own_write()
    calls_vorher = len(trv.calls)

    # Gerät wechselt von sich aus in den Heizmodus (Folge des Minimaltemperatur-Schreibens)
    trv.set(preset_mode="manual")
    await hass.async_block_till_done()

    assert ctrl.hvac_on is False, "eigenes Schreiben darf den Raum nicht einschalten"
    assert len(trv.calls) > calls_vorher, "der Aus-Zustand wurde nicht nachgezogen"
    assert trv.is_off, "das Gerät steht nach dem Nachziehen wieder aus"


async def test_kein_schreibbefehl_wenn_geraet_schon_aus_ist(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """Gegenprobe: steht das Gerät korrekt aus, entsteht kein weiterer Befehl (kein Poll-Sturm)."""
    _, room = setup
    await _off(hass)
    assert trv.is_off

    ctrl = hass.data[DOMAIN]["rooms"][room.entry_id]
    calls_vorher = len(trv.calls)

    for _ in range(3):
        ctrl._mark_own_write()
        trv.set(preset_mode="off")  # Gerät meldet erneut „aus"
        await hass.async_block_till_done()

    assert len(trv.calls) == calls_vorher, "im Aus-Zustand darf nichts nachgeschickt werden"
