"""Regelkette: die Rangfolge steht in PLAN_RULES – jede Regel existiert und greift an ihrem Platz."""

from __future__ import annotations

from datetime import timedelta

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from custom_components.raumklima.room_const import PLAN_RULES
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


async def test_warum_heizt_der_raum(hass: HomeAssistant, setup, trv: FakeTrv, hass_ws_client) -> None:
    """Prüfseite: genau eine Regel bestimmt das Ziel, nachrangige werden genannt, nichts wird verändert."""
    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    ctrl.config["schedules"] = [{"days": [], "start": "00:00", "end": "23:59", "temperature": 23.5}]
    ctrl.boost_until = dt_util.utcnow() + timedelta(minutes=10)
    ctrl.boost_temperature = 25.0
    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": "raumklima/room/why", "entry_id": room.entry_id})
    msg = await client.receive_json()
    assert msg["success"], msg
    res = msg["result"]
    states = {r["rule"]: r["state"] for r in res["rules"]}
    assert states["_rule_boost"] == "wins"
    assert states["_rule_schedule"] == "later"
    assert [r for r in res["rules"] if r["state"] == "wins"] == [next(r for r in res["rules"] if r["rule"] == "_rule_boost")]
    assert res["target"] == 25.0 and res["verdict"]
    assert {c["label"] for c in res["checks"]} >= {"Heizsaison", "Fenster", "Raumfühler"}
    # abgelaufener Boost wird von der Prüfseite nicht aufgeräumt
    ctrl.boost_until = dt_util.utcnow() - timedelta(minutes=1)
    ctrl.explain()
    assert ctrl.boost_until is not None


async def test_vorwaermen_nach_gelernten_zeiten(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """Typisch belegt ab dem nächsten Block: vorher auf die Anwesenheits-Temperatur, ohne Besuch 30 min später zurück."""
    _hub, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    ctrl.target_temp = 18.5
    ctrl.config["presence_target"] = 21.0
    now = dt_util.now()
    start = (now + timedelta(minutes=20)).replace(second=0, microsecond=0)
    start = start.replace(minute=(start.minute // 15) * 15)
    ctrl.usage.next_block = lambda local, **_kw: (start, start + timedelta(hours=2))
    assert ctrl.plan()[1:] == (21.0, "presence_preheat"), "ohne gelernte Aufheizzeit: 30 min Vorlauf"
    ctrl.usage.next_block = lambda local, **_kw: (now - timedelta(minutes=40), now + timedelta(hours=1))
    assert ctrl.plan()[2] != "presence_preheat", "40 min nach Beginn ohne Besuch: zurück"
    ctrl.config["presence_learn"] = False
    ctrl.usage.next_block = lambda local, **_kw: (start, start + timedelta(hours=2))
    assert ctrl.plan()[2] != "presence_preheat", "abschaltbar"
