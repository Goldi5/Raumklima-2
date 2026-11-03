// Darstellung je Wohnung: Reihenfolge und Ausblenden.
import { test } from "node:test";
import assert from "node:assert/strict";

import { rkLayoutApply } from "../src/shared.js";

test("rkLayoutApply kennt Zustandsobjekte ohne id", () => {
  const rooms = [
    { entity_id: "climate.a", attributes: {} },
    { entity_id: "climate.b", attributes: {} },
    { entity_id: "climate.c", attributes: {} },
  ];
  const layout = { order: ["climate.c", "climate.a"], hidden: [], size: {}, color: {} };
  const out = rkLayoutApply(rooms, layout).map((r) => r.entity_id);
  assert.deepEqual(out, ["climate.c", "climate.a", "climate.b"]);
});

test("rkLayoutApply blendet aus", () => {
  const rooms = [{ id: "x" }, { id: "y" }];
  const out = rkLayoutApply(rooms, { order: [], hidden: ["x"], size: {}, color: {} });
  assert.deepEqual(out.map((r) => r.id), ["y"]);
});
