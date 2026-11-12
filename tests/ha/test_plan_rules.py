"""Regelkette: die Rangfolge steht in PLAN_RULES – jede Regel existiert und greift an ihrem Platz."""

from __future__ import annotations

from datetime import timedelta

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from custom_components.raumklima.controller import PLAN_RULES
from custom_components.raumklima.shared import domain_data

from .conftest import FakeTrv


async def test_jede_regel_existiert_und_ist_eindeutig(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    assert len(set(PLAN_RULES)) == len(PLAN_RULES)
    for name in PLAN_RULES:
        assert callable(getattr(ctrl, name)), name
    defined = {n for n in dir(type(ctrl)) if n.startswith("_rule_")}
    assert defined == set(PLAN_RULES), "Regel definiert, aber nicht in der Rangfolge (oder umgekehrt)"


async def test_rangfolge(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """Boost schlägt Zeitplan, Zeitplan schlägt den Wunsch; ohne alles gilt der Wunsch."""
    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    assert PLAN_RULES.index("_rule_boost") < PLAN_RULES.index("_rule_away") < PLAN_RULES.index("_rule_schedule")
    assert PLAN_RULES.index("_rule_schedule") < PLAN_RULES.index("_rule_night") < PLAN_RULES.index("_rule_solar")

    base = ctrl.plan()
    assert base[2] == "normal"

    ctrl.config["schedules"] = [{"days": [], "start": "00:00", "end": "23:59", "temperature": 23.5}]
    assert ctrl.plan()[1:] == (23.5, "schedule")

    ctrl.boost_until = dt_util.utcnow() + timedelta(minutes=10)
    ctrl.boost_temperature = 25.0
    assert ctrl.plan()[1:] == (25.0, "boost")

    # abgelaufener Boost: räumt sich selbst auf, der Zeitplan gilt wieder
    ctrl.boost_until = dt_util.utcnow() - timedelta(minutes=1)
    assert ctrl.plan()[1:] == (23.5, "schedule")
    assert ctrl.boost_until is None


async def test_anzeige_verbraucht_nichts(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """peek_plan() darf einen abgelaufenen Boost nicht aufräumen – das tut erst plan()."""
    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    ctrl.boost_until = dt_util.utcnow() - timedelta(minutes=1)
    ctrl.boost_temperature = 25.0
    ctrl.peek_plan()
    assert ctrl.boost_until is not None
    _ = ctrl.hvac_action  # reine Anzeige
    assert ctrl.boost_until is not None
    ctrl.plan()
    assert ctrl.boost_until is None
