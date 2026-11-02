// Braucht eine Wohnung ein eigenes Dashboard? (Option A: automatisch anlegen)
import { test } from "node:test";
import assert from "node:assert/strict";
import { rkNeedsDashboard } from "../src/shared.js";

test("neues Dashboard nur anlegen, wenn es fehlt", () => {
  assert.equal(rkNeedsDashboard({}, "heizung-remscheid"), true);
  assert.equal(rkNeedsDashboard({ "heizung-remscheid": {} }, "heizung-remscheid"), false);
  assert.equal(rkNeedsDashboard({}, "/heizung-berlin"), true);          // führender Schrägstrich egal
  assert.equal(rkNeedsDashboard({}, ""), false);                         // kein Pfad → nichts tun
  assert.equal(rkNeedsDashboard({}, null), false);
  assert.equal(rkNeedsDashboard({}, "heizung-berlin", "heizung-berlin"), false);  // ist die aktuelle Seite
  assert.equal(rkNeedsDashboard({}, "heizung-berlin", "/heizung-berlin"), false);
});
