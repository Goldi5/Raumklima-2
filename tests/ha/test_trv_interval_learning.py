"""Jedes Gerät lernt seine eigene Funkpause (Issue #33).

FRITZ!DECT funkt alle ~15 Minuten, Tuya über Zigbee2MQTT alle paar Sekunden. Eine feste
Grenze kann beides nicht bedienen: für das eine ist sie Dauerstress, für das andere blind.
"""

from __future__ import annotations

from homeassistant.core import HomeAssistant


async def test_startwert_aus_der_geraetefamilie(hass: HomeAssistant, setup) -> None:
    _hub, room = setup
    from custom_components.raumklima.shared import domain_data

    ctrl = domain_data(hass)["rooms"][room.entry_id]
    ctrl._outage_durations.clear()
    ctrl.config["trv_interval"] = None

    # ohne Messung und ohne Registry-Eintrag: Standard 5 min → Grenze 12 min
    assert ctrl.trv_expected_interval == 300
    assert ctrl.outage_seconds == 720
    assert ctrl.outage_learning is True


async def test_gelernte_funkpause_gewinnt(hass: HomeAssistant, setup) -> None:
    _hub, room = setup
    from custom_components.raumklima.shared import domain_data

    ctrl = domain_data(hass)["rooms"][room.entry_id]
    ctrl.config["trv_interval"] = None
    ctrl._outage_durations.clear()
    # drei Funkpausen von ~15 Minuten (FRITZ!DECT)
    for seconds in (880.0, 900.0, 920.0):
        ctrl._outage_durations.append(seconds)

    assert ctrl.trv_expected_interval == 920  # 80 %-Perzentil
    assert ctrl.outage_seconds == 1960  # 2 × 920 + 120
    assert ctrl.outage_learning is False


async def test_handeingabe_schlaegt_alles(hass: HomeAssistant, setup) -> None:
    _hub, room = setup
    from custom_components.raumklima.shared import domain_data

    ctrl = domain_data(hass)["rooms"][room.entry_id]
    ctrl._outage_durations.clear()
    ctrl._outage_durations.extend([60.0, 60.0, 60.0])
    ctrl.config["trv_interval"] = 15  # Minuten

    assert ctrl.trv_expected_interval == 900
    assert ctrl.outage_seconds == 1920
    assert ctrl.outage_learning is False


async def test_lernproben_ueberleben_den_neustart(hass: HomeAssistant, setup) -> None:
    """Die gelernten Funkpausen müssen im Speicher landen, sonst ist nach jedem Neustart alles weg."""
    _hub, room = setup
    from custom_components.raumklima.shared import domain_data

    ctrl = domain_data(hass)["rooms"][room.entry_id]
    ctrl._outage_durations.clear()
    ctrl._outage_durations.extend([300.0, 600.0, 900.0])

    stored = ctrl._stored_data()
    assert stored["outage_durations"] == [300.0, 600.0, 900.0]
