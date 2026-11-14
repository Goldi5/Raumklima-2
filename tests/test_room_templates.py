"""Raum-Vorlagen: nur sichere Werte speichern."""

from custom_components.raumklima.ws_hub import _room_template_values


class _Room:
    config = {"comfort_temperature": 22, "trv": "climate.x"}

    def settings_summary(self):
        return {"sources": {"comfort_temperature": "room", "trv": "device"}}


def test_nur_quellen_mit_wert_room():
    values = _room_template_values(_Room())
    assert values == {"comfort_temperature": 22}
