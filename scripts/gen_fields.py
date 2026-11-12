"""frontend/src/fields.js aus custom_components/raumklima/fields.py erzeugen."""

from importlib import util
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
spec = util.spec_from_file_location("rk_fields", ROOT / "custom_components/raumklima/fields.py")
mod = util.module_from_spec(spec)
spec.loader.exec_module(mod)
(ROOT / "frontend/src/fields.js").write_text(mod.to_js(), encoding="utf-8")
print("frontend/src/fields.js geschrieben")
