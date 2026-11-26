"""Abgleich im Notbetrieb: ohne brauchbaren Raumfühler keinen Abgleich auf den Sollwert rechnen.

Anlass: Bad mit TIMMERFLOTTE-Fühler (Matter), der morgens ausfiel. Raumklima regelte korrekt auf
den Thermostatfühler, rechnete aber weiter den gelernten Abgleich von +1,3 K auf das Ziel – bei
18 °C Ziel standen 19,5 °C am Gerät, obwohl es selbst schon 18,6 °C maß. Gleichzeitig wurde der
Abgleich gegen den alten, gemerkten Raumwert weiter nachgeführt und stieg auf 3,3 K.
"""

from __future__ import annotations

from types import SimpleNamespace

from custom_components.raumklima.controller import RaumklimaController
from custom_components.raumklima.room_trv import TrvMixin


def test_kein_abgleich_im_notbetrieb() -> None:
    room = SimpleNamespace(shift=1.3, ext_sensor_ok=False, current_temperature=18.6)
    assert TrvMixin._shift_for(room, 18.0) == 0.0


def test_abgleich_mit_raumfuehler_bleibt() -> None:
    room = SimpleNamespace(shift=1.3, ext_sensor_ok=True, current_temperature=17.0)
    assert TrvMixin._shift_for(room, 18.0) == 1.3


def test_abgleich_wird_im_notbetrieb_nicht_nachgefuehrt() -> None:
    saved = []
    room = SimpleNamespace(shift=1.3, ext_sensor_ok=False, _ext_value=17.0, trv_temperature=20.6, _save=lambda: saved.append(1))
    RaumklimaController._update_shift(room)
    assert room.shift == 1.3
    assert saved == []
