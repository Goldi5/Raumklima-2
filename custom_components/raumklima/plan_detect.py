"""Erkennung aus Messwerten und Terminen: Fenster ohne Kontakt, Kalender-Stichworte."""

from __future__ import annotations

from datetime import datetime, timedelta
import re

# ------------------------------------------------------------------ Fenster ohne Kontakt
VIRT_AUTO = "auto"
VIRT_ON = "on"
VIRT_OFF = "off"
VIRT_MODES = [VIRT_AUTO, VIRT_ON, VIRT_OFF]
VIRT_DROP = 1.0  # K Abfall …
VIRT_SPAN = timedelta(minutes=6)  # … innerhalb dieser Zeit
VIRT_OUTDOOR_GAP = 5.0  # K: draußen muss deutlich kälter sein
VIRT_MIN_OPEN = timedelta(minutes=10)
VIRT_MAX_OPEN = timedelta(minutes=30)
VIRT_RECOVER = 0.3  # K über dem Tiefstwert = Fenster wohl wieder zu


def detect_temp_drop(
    points: list[tuple[datetime, float]], now: datetime, outdoor: float | None
) -> float | None:
    """Schneller Temperatursturz (Fenster offen)? Gibt den Abfall in K zurück."""
    recent = [(t, v) for t, v in points if now - t <= VIRT_SPAN]
    if len(recent) < 2:
        return None
    latest = recent[-1][1]
    peak = max(v for _t, v in recent[:-1])
    drop = peak - latest
    if drop < VIRT_DROP:
        return None
    if outdoor is not None and latest - outdoor < VIRT_OUTDOOR_GAP:
        return None  # draußen kaum kälter – eher Messrauschen oder Sonne weg
    return round(drop, 1)


def virtual_window_close_reason(
    opened_at: datetime, now: datetime, lowest: float, current: float | None
) -> str | None:
    """Wann gilt das geschätzte Fenster wieder als zu?"""
    if now - opened_at >= VIRT_MAX_OPEN:
        return "max"
    if current is not None and now - opened_at >= VIRT_MIN_OPEN and current >= lowest + VIRT_RECOVER:
        return "recovered"
    return None


# ------------------------------------------------------------------ Kalender
CAL_AWAY = "away"
CAL_HOME = "home"
CAL_AWAY_WORDS = "Urlaub, Reise, Dienstreise, verreist, vacation, trip"
CAL_HOME_WORDS = "Homeoffice, Home-Office, zu Hause, home office, wfh"


def _words(text: str | None) -> list[str]:
    return [w.strip().lower() for w in str(text or "").split(",") if w.strip()]


def calendar_mode(active: bool, summary: str | None, away_words: str | None, home_words: str | None) -> str | None:
    """Laufender Kalendertermin → „away“ (wie Urlaub), „home“ (wie Gäste: nicht absenken) oder None."""
    if not active or not summary:
        return None
    text = summary.lower()
    if any(_word_in(w, text) for w in _words(away_words)):
        return CAL_AWAY
    if any(_word_in(w, text) for w in _words(home_words)):
        return CAL_HOME
    return None


def _word_in(word: str, text: str) -> bool:
    """Schlagwort als eigenes Wort oder als Ende eines zusammengesetzten Worts.

    „Reise“ trifft „Reise“, „Dienstreise“, „Geschäftsreise“ – aber nicht „Preise“ (nur ein
    Buchstabe davor) und nicht „Reisepass“ (Wort geht weiter). Früher reichte jeder Wortteil.
    """
    pattern = r"(?:(?<!\w)|(?<=\w\w\w))" + re.escape(word) + r"(?!\w)"
    return re.search(pattern, text) is not None
