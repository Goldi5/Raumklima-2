"""Konstanten der Lüftungslogik (Zeiten, Texte) – gemeinsam für Lüften und Benachrichtigung."""

from __future__ import annotations

from datetime import timedelta

from .const import (
    KIND_TOO_COLD,
    KIND_VENT_CLOSE,
    KIND_VENT_DONE,
    KIND_VENT_OPEN,
)
from .msg import N_
from .ventilation import (
    VENT_DONE,
    VENT_PLEASE_CLOSE,
    VENT_PLEASE_OPEN,
    VENT_TOO_COLD,
)

EVAL_INTERVAL = timedelta(seconds=30)
HUMIDITY_HYSTERESIS = 5.0
SNOOZE_MINUTES = 15
PLEASE_OPEN_REPEAT = 30  # min – Erinnerung "bitte lüften"
# So lange muss ein Fenster offen gewesen sein, damit der Tagesdeckel als „gelüftet" gilt.
AIRING_CAP_RESET_MINUTES = 5.0
TTS_AFTER_REPEATS = 2  # Sprachansage ab der 3. Erinnerung "schließen"
TOO_COLD_LOUD = 3  # so oft „kühlt aus“ laut, danach leise
TOO_COLD_QUIET_REPEAT = 30  # min zwischen leisen Erinnerungen
WINDOW_AWAY_AFTER = 2  # min offen, während niemand da ist
WINDOW_AWAY_REPEAT = 30  # min
WINDOW_AWAY_STARTUP = timedelta(minutes=5)  # nach dem Start erst abwarten, bis die Anwesenheit steht
KIND_OF = {
    VENT_PLEASE_OPEN: KIND_VENT_OPEN,
    VENT_PLEASE_CLOSE: KIND_VENT_CLOSE,
    VENT_TOO_COLD: KIND_TOO_COLD,
    VENT_DONE: KIND_VENT_DONE,
}

MESSAGES = {
    VENT_PLEASE_OPEN: (N_("💧 {room}: Bitte lüften"), N_("Luftfeuchte {hum} % – bitte ca. {dur} min stoßlüften.")),
    VENT_PLEASE_CLOSE: (N_("🪟 {room}: Fenster schließen"), N_("Lüftzeit von {dur} min erreicht – bitte schließen.")),
    VENT_TOO_COLD: (N_("🥶 {room}: Raum kühlt aus"), N_("Nur noch {temp} °C – bitte jetzt schließen.")),
    VENT_DONE: (N_("✅ {room}: Luft ausgetauscht"), N_("Luftfeuchte wieder {hum} % – du kannst schließen.")),
}
MESSAGE_CO2 = (N_("🫁 {room}: Bitte lüften"), N_("CO₂ {co2} ppm – die Luft ist verbraucht, bitte ca. {dur} min stoßlüften."))
MESSAGE_PM25 = (N_("🫧 {room}: Luft belastet"), N_("Feinstaub {pm} µg/m³ – bitte ca. {dur} min stoßlüften."))


# So lange muss ein Wert über der Grenze bleiben, bevor gemeldet wird
HIGH_DELAY_MINUTES = 15.0
