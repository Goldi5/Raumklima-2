"""Test-Grundlagen.

- „rk“: die HA-freien Module (logic, sync, planning …) ohne Home Assistant laden.
- Mit installiertem pytest-homeassistant-custom-component zusätzlich Fixtures für
  echte Integrationstests (Raum + Zentrale mit simuliertem Thermostat).
"""

from __future__ import annotations

from pathlib import Path
import sys
import types

ROOT = Path(__file__).parent.parent
PKG_DIR = ROOT / "custom_components" / "raumklima"

pkg = types.ModuleType("rk")
pkg.__path__ = [str(PKG_DIR)]  # __init__.py (braucht HA) wird nicht ausgeführt
sys.modules["rk"] = pkg

try:  # Integrationstests nur, wenn die HA-Testumgebung installiert ist
    import pytest_homeassistant_custom_component  # noqa: F401
except ImportError:  # pragma: no cover
    collect_ignore_glob = ["ha/*"]
else:
    if str(ROOT) not in sys.path:
        sys.path.insert(0, str(ROOT))
