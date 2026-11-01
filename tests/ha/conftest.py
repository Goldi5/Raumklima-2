"""Fixtures: simuliertes Thermostat, Fühler, Fenster und eingerichtete Räume."""

from __future__ import annotations

from collections.abc import Generator
from typing import Any
from unittest.mock import patch

from homeassistant.core import HomeAssistant
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.raumklima.const import (
    CONF_CALIBRATION_MODE,
    CONF_ENTRY_TYPE,
    CONF_NAME,
    CONF_OFF_METHOD,
    CONF_SEASON_MODE,
    CONF_TEMP_SENSOR,
    CONF_TRV,
    CONF_WINDOW_CLOSE_DELAY,
    CONF_WINDOW_OPEN_DELAY,
    CONF_WINDOWS,
    DOMAIN,
    ENTRY_HUB,
    HUB_DEFAULTS,
    HUB_UNIQUE_ID,
)

TRV = "climate.trv_bad"
SENSOR = "sensor.bad_temperatur"
WINDOW = "binary_sensor.bad_fenster"


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations: None) -> None:
    """Eigene Integration in jedem Test erlauben."""


@pytest.fixture(autouse=True)
def no_frontend(hass: HomeAssistant) -> Generator[None]:
    """Karte/Ressourcen brauchen das Frontend (hass_frontend) – im Test überspringen."""
    hass.config.components.add("frontend")
    with patch("custom_components.raumklima._async_register_card", return_value=None):
        yield


class FakeTrv:
    """Ein Thermostat, das Befehle sofort (oder gar nicht) übernimmt."""

    def __init__(self, hass: HomeAssistant, entity_id: str = TRV) -> None:
        self.hass = hass
        self.entity_id = entity_id
        self.calls: list[tuple[str, dict[str, Any]]] = []
        self.connected = True
        self.attrs: dict[str, Any] = {
            "preset_modes": ["manual", "eco", "comfort", "off"],
            "preset_mode": "manual",
            "hvac_modes": ["heat", "off"],
            "temperature": 18.0,
            "current_temperature": 19.0,
            "min_temp": 5.0,
            "max_temp": 30.0,
            "hvac_action": "idle",
        }
        self.state = "heat"
        self.push()

    def push(self) -> None:
        self.hass.states.async_set(self.entity_id, self.state, dict(self.attrs))

    def set(self, **attrs: Any) -> None:
        """Am Gerät verstellt (z. B. jemand dreht am Regler)."""
        self.attrs.update(attrs)
        self.push()

    async def call(self, service: str, **data: Any) -> None:
        self.calls.append((service, data))
        if not self.connected:
            return
        if service == "set_temperature":
            self.attrs["temperature"] = data["temperature"]
        elif service == "set_preset_mode":
            self.attrs["preset_mode"] = data["preset_mode"]
        elif service == "set_hvac_mode":
            self.state = data["hvac_mode"]
        self.push()

    @property
    def setpoint(self) -> float:
        return self.attrs["temperature"]

    @property
    def is_off(self) -> bool:
        return self.attrs["preset_mode"] == "off"


@pytest.fixture
def trv(hass: HomeAssistant) -> Generator[FakeTrv]:
    fake = FakeTrv(hass)

    async def call_climate(self, service: str, **data: Any) -> None:
        await fake.call(service, **data)

    with patch("custom_components.raumklima.controller.RaumklimaController._call_climate", call_climate):
        yield fake


@pytest.fixture
def sensors(hass: HomeAssistant) -> None:
    hass.states.async_set(SENSOR, "19.0", {"unit_of_measurement": "°C", "device_class": "temperature"})
    hass.states.async_set(WINDOW, "off", {"device_class": "window"})


def hub_entry(**options: Any) -> MockConfigEntry:
    return MockConfigEntry(
        domain=DOMAIN,
        title="Allgemein",
        unique_id=HUB_UNIQUE_ID,
        data={CONF_ENTRY_TYPE: ENTRY_HUB},
        options={**HUB_DEFAULTS, CONF_SEASON_MODE: "always", **options},
    )


def room_entry(**options: Any) -> MockConfigEntry:
    return MockConfigEntry(
        domain=DOMAIN,
        title="Bad",
        unique_id=TRV,
        data={
            CONF_NAME: "Bad",
            CONF_TRV: TRV,
            CONF_TEMP_SENSOR: SENSOR,
            CONF_WINDOWS: [WINDOW],
            CONF_CALIBRATION_MODE: "none",
            CONF_OFF_METHOD: "preset",
        },
        options={CONF_WINDOW_OPEN_DELAY: 10, CONF_WINDOW_CLOSE_DELAY: 10, "room_type": "bathroom", **options},
    )


@pytest.fixture
async def setup(hass: HomeAssistant, trv: FakeTrv, sensors: None) -> tuple[MockConfigEntry, MockConfigEntry]:
    """Zentrale + ein Raum (Bad), eingerichtet und gestartet."""
    hub = hub_entry()
    hub.add_to_hass(hass)
    room = room_entry()
    room.add_to_hass(hass)
    # Einrichten der Domain startet alle Einträge (Zentrale und Raum)
    assert await hass.config_entries.async_setup(hub.entry_id)
    await hass.async_block_till_done()
    return hub, room
