"""fields.py ist die eine Quelle für Zahl-Einstellungen: Karte und Backend passen dazu."""

from importlib import util
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
spec = util.spec_from_file_location("rk_fields", ROOT / "custom_components/raumklima/fields.py")
fields = util.module_from_spec(spec)
spec.loader.exec_module(fields)


def test_fields_js_ist_aktuell() -> None:
    js = (ROOT / "frontend/src/fields.js").read_text(encoding="utf-8")
    assert js == fields.to_js(), "frontend/src/fields.js veraltet – python scripts/gen_fields.py ausführen"


def test_karte_bleibt_in_den_grenzen_des_backends() -> None:
    for key, f in fields.NUM.items():
        assert f.step > 0 and f.ui_min < f.ui_max, key
        if not float(f.step).is_integer():
            assert f.dec >= 1, f"{key}: Schritt {f.step} ohne Nachkommastelle"
        if f.kind is None:
            continue
        assert f.lo is not None and f.hi is not None, key
        assert f.lo <= f.ui_min and f.ui_max <= f.hi, f"{key}: Karte {f.ui_min}…{f.ui_max}, Backend {f.lo}…{f.hi}"


def test_jedes_feld_wird_im_backend_geprueft() -> None:
    src = (ROOT / "custom_components/raumklima/ws_common.py").read_text(encoding="utf-8")
    for key, f in fields.NUM.items():
        if f.kind is not None:
            assert f'num_schema("{key}")' in src, f"{key}: keine Prüfregel in ws_common.py"
