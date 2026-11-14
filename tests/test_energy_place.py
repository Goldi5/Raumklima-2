"""Ortsname je Person für die Chips in der Übersicht."""

from types import SimpleNamespace

from custom_components.raumklima.hub_presence import PresenceMixin


class States:
    def __init__(self, values):
        self.values = values

    def get(self, entity_id):
        return self.values.get(entity_id)


def _state(state, **attributes):
    return SimpleNamespace(state=state, attributes=attributes)


def _place(state):
    fake = SimpleNamespace(hass=SimpleNamespace(states=States({
        "zone.home": _state("0", friendly_name="Zuhause"),
        "zone.work": _state("0", friendly_name="Emma-Schule"),
    })))
    return PresenceMixin._person_place(fake, state)


def test_person_place():
    assert _place(_state("home", in_zones=["zone.home"])) == "home"
    assert _place(_state("work", in_zones=["zone.work"])) == "Emma-Schule"
    assert _place(_state("not_home")) == "away"
    assert _place(_state("unknown")) == "unknown"
    assert _place(None) == "unknown"
