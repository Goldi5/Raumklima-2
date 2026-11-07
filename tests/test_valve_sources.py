"""Ventilöffnung: je **Gerät** einmal zählen, nicht je Entität.

Anlass: Ein Raum mit Livisi-Thermostat (meldet keine Öffnung) und einem Moes BRT-100-TRV, dessen
Positions-Sensor als Raum-Ventilsensor eingetragen war. Beide Einträge gehörten zum selben Gerät —
die Karte behauptete „2 Quellen" und zeigte „Haupt 25 %", obwohl das Livisi nichts messen kann.

Die Prüfung arbeitet auf den Properties aus `room_health` mit einem einfachen Stellvertreter:
kein HA-Aufbau nötig, die Rechnung ist das Interessante.
"""

from __future__ import annotations

from types import SimpleNamespace

from custom_components.raumklima.room_health import HealthMixin

READINGS = HealthMixin.valve_readings
SOURCES = HealthMixin.valve_sources
POSITION = HealthMixin.valve_position
OWN = HealthMixin.valve_own


def _fake(sensor: str | None, extra: dict[str, float], main: str, devices: dict[str, str]):
    """Stellvertreter mit genau den Attributen, die die Properties lesen."""
    hass = SimpleNamespace(states=SimpleNamespace(get=lambda eid: SimpleNamespace(state="25")))
    obj = SimpleNamespace(
        hass=hass,
        valve_sensor=sensor,
        extra_trvs=[SimpleNamespace(entity_id=eid, valve=v) for eid, v in extra.items()],
        trv=main,
    )
    obj._valve_device = lambda entity_id: devices.get(entity_id or "", "")
    # `valve_position`/`valve_own` lesen `self.valve_readings` – beim Stellvertreter vorberechnen
    obj.valve_readings = READINGS.fget(obj)
    return obj


def test_position_und_zusatzgeraet_zaehlen_einmal() -> None:
    # Sensor und Zusatz-Thermostat sitzen auf demselben MQTT-Gerät
    obj = _fake(
        "sensor.tuer_position",
        {"climate.tuer": 25.0},
        main="climate.livisi",
        devices={
            "sensor.tuer_position": "dev-tuer",
            "climate.tuer": "dev-tuer",
            "climate.livisi": "dev-livisi",
        },
    )
    assert SOURCES.fget(obj) == 1, "dasselbe Gerät darf nicht zweimal zählen"
    assert POSITION.fget(obj) == 25.0
    assert OWN.fget(obj) is None, "das Hauptgerät (Livisi) meldet keine Öffnung"


def test_hauptgeraet_mit_eigener_oeffnung() -> None:
    obj = _fake(
        "sensor.haupt_position",
        {},
        main="climate.haupt",
        devices={"sensor.haupt_position": "dev-haupt", "climate.haupt": "dev-haupt"},
    )
    assert SOURCES.fget(obj) == 1
    assert OWN.fget(obj) == 25.0
    assert POSITION.fget(obj) == 25.0


def test_zwei_echte_geraete_ergeben_mittelwert() -> None:
    # Sensor liefert 25 %, das zweite Gerät 40 % → Mittelwert 32,5
    obj = _fake(
        "sensor.a_position",
        {"climate.b": 40.0},
        main="climate.a",
        devices={"sensor.a_position": "dev-a", "climate.a": "dev-a", "climate.b": "dev-b"},
    )
    assert SOURCES.fget(obj) == 2
    assert OWN.fget(obj) == 25.0
    assert POSITION.fget(obj) == 32.5
