"""Lädt die HA-freien Module (logic, sync) ohne Home Assistant."""

from pathlib import Path
import sys
import types

PKG_DIR = Path(__file__).parent.parent / "custom_components" / "raumklima"

pkg = types.ModuleType("rk")
pkg.__path__ = [str(PKG_DIR)]  # __init__.py (braucht HA) wird nicht ausgeführt
sys.modules["rk"] = pkg
