"""Gewohntes Lüften: lernen, begrenzen, wiedererkennen."""

from __future__ import annotations

from datetime import datetime, timedelta

from custom_components.raumklima.airing_profile import KEEP_DAYS, MAX_EPISODES, AiringProfile


def _monday(hour: int, minute: int = 0) -> datetime:
    return datetime(2026, 11, 2, hour, minute)  # Montag


def test_learned_after_three_episodes() -> None:
    profile = AiringProfile()
    for weeks in range(3):
        profile.record(_monday(5) + timedelta(weeks=weeks), 60)

    assert profile.learned(_monday(5, 10)) is True
    assert profile.learned(_monday(9)) is False


def test_other_weekday_is_not_learned() -> None:
    profile = AiringProfile()
    for weeks in range(3):
        profile.record(_monday(5) + timedelta(weeks=weeks), 45)

    tuesday = _monday(5) + timedelta(days=1)
    assert profile.learned(tuesday) is False


def test_short_airing_is_ignored() -> None:
    profile = AiringProfile()
    profile.record(_monday(5), 0.4)
    assert profile.episodes == []


def test_old_episodes_are_dropped() -> None:
    profile = AiringProfile()
    profile.record(_monday(5), 60)
    old = _monday(5) + timedelta(days=KEEP_DAYS + 5)
    profile.record(old, 60)
    assert all(day >= (_monday(5) - timedelta(days=1)).date().isoformat() for day, *_ in profile.episodes)
    # nach dem Beschneiden zählt nur noch der neue Vorgang
    assert profile.learned(old) is False


def test_episodes_are_bounded() -> None:
    profile = AiringProfile()
    start = _monday(5)
    for i in range(MAX_EPISODES + 50):
        profile.record(start + timedelta(minutes=i), 30)
    assert len(profile.episodes) <= MAX_EPISODES


def test_export_and_load_roundtrip() -> None:
    profile = AiringProfile()
    profile.record(_monday(5), 42.5)
    exported = profile.export()

    again = AiringProfile()
    again.load(exported)
    assert again.episodes == profile.episodes


def test_typical_lists_learned_slots() -> None:
    profile = AiringProfile()
    for weeks in range(3):
        profile.record(_monday(5) + timedelta(weeks=weeks), 60)

    typical = profile.typical()
    assert typical["episodes"] == 3
    assert typical["learned"][0]["time"] == "05:00"
    assert typical["learned"][0]["count"] == 3
    assert typical["learned"][0]["minutes"] == 60
