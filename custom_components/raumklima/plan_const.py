"""Grundwerte der Planung: Anwesenheits-Stufen, Saison-Zustände, Absenkung je Raumtyp."""

from __future__ import annotations

# ------------------------------------------------------------------ Konstanten
STAGE_HOME = "home"
STAGE_GUESTS = "guests"
STAGE_PREHEAT = "preheat"
STAGE_AWAY_SHORT = "away_short"
STAGE_AWAY_LONG = "away_long"
STAGES = [STAGE_HOME, STAGE_GUESTS, STAGE_PREHEAT, STAGE_AWAY_SHORT, STAGE_AWAY_LONG]
AWAY_STAGES = (STAGE_AWAY_SHORT, STAGE_AWAY_LONG)

SEASON_HEATING = "heating"
SEASON_PAUSE = "pause"
SEASON_COLD_SNAP = "cold_snap"
SEASON_HEAT_TODAY = "heat_today"
SEASON_ALWAYS = "always"
SEASON_MANUAL_PAUSE = "manual_pause"
SEASON_STATES = [
    SEASON_HEATING,
    SEASON_PAUSE,
    SEASON_COLD_SNAP,
    SEASON_HEAT_TODAY,
    SEASON_ALWAYS,
    SEASON_MANUAL_PAUSE,
]

# Temperaturfaktor fRsi der kältesten Stelle (Außenecke) je Bauart
BUILDING_FRSI = {"unrenovated": 0.60, "renovated": 0.70, "new": 0.80}
SURFACE_RH_LIMIT = 0.80  # DIN 4108-2: Schimmelkriterium an der Oberfläche

# Absenkwerte je Raumtyp (kurz weg, länger weg) – Verbraucherzentrale/vzbv:
# kurze Abwesenheit ~18 °C, länger nicht unter 16 °C
SETBACK_BY_ROOM = {
    "living": (18.0, 16.0),
    "kitchen": (18.0, 16.0),
    "children": (18.0, 16.0),
    "bathroom": (18.0, 16.0),
    "office": (18.0, 16.0),  # tagsüber genutzt: kurz weg nur 2 K
    "guest": (17.0, 16.0),  # meist unbenutzt, bei Besuch wird hochgestellt
    "hallway": (16.0, 15.0),  # Durchgangsraum, darf kühler
    "gym": (17.0, 15.0),  # beim Sport kühl, sonst selten genutzt
    "bedroom": (16.0, 16.0),
    "rarely_used": (16.0, 16.0),
}


def setback_defaults(room_type: str | None) -> tuple[float, float]:
    """Absenkwerte (kurz, länger) für einen Raumtyp."""
    return SETBACK_BY_ROOM.get(room_type or "living", (18.0, 16.0))
