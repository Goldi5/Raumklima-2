"""Jetzt kalibrieren."""

from __future__ import annotations

from homeassistant.components.button import ButtonEntity
from homeassistant.const import EntityCategory
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from . import RaumklimaConfigEntry, is_hub_entry
from .const import CAL_NONE
from .entity import RaumklimaEntity
from .hub_platforms import hub_entities


async def async_setup_entry(
    hass: HomeAssistant,
    entry: RaumklimaConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    if is_hub_entry(entry):
        async_add_entities(hub_entities("button", entry.runtime_data))
        return
    entities = [BoostButton(entry.runtime_data)]
    if entry.runtime_data.cal_mode != CAL_NONE:
        entities.append(CalibrateButton(entry.runtime_data))
    async_add_entities(entities)


class BoostButton(RaumklimaEntity, ButtonEntity):
    """Zeitlich begrenzt wärmer – erneut drücken beendet den Boost."""

    _attr_translation_key = "boost"

    def __init__(self, controller) -> None:
        super().__init__(controller, "boost")

    async def async_press(self) -> None:
        if self.controller.boost_active:
            await self.controller.async_clear_boost()
        else:
            await self.controller.async_set_boost()


class CalibrateButton(RaumklimaEntity, ButtonEntity):
    """Offset sofort neu berechnen und senden."""

    _attr_translation_key = "calibrate"
    _attr_entity_category = EntityCategory.CONFIG

    def __init__(self, controller) -> None:
        super().__init__(controller, "calibrate")

    async def async_press(self) -> None:
        await self.controller.async_calibrate(force=True)
