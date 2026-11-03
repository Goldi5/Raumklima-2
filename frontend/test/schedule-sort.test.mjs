import { test } from "node:test";
import assert from "node:assert/strict";

import { rkSchedSortKey } from "../src/shared.js";

const byKey = (x, y) => {
  const a = rkSchedSortKey(x);
  const b = rkSchedSortKey(y);
  return a[0] - b[0] || a[1] - b[1] || a[2].localeCompare(b[2]);
};

test("Nachtfenster steht vorn (Issue #10)", () => {
  const list = [
    { start: "06:30", end: "22:00", days: [0, 1, 2, 3] },
    { start: "22:00", end: "06:30", days: [0, 1, 2, 3, 4] },
    { start: "08:00", end: "23:00", days: [5] },
    { start: "06:30", end: "23:00", days: [4] },
  ];
  const sorted = [...list].sort(byKey);
  assert.deepEqual(
    sorted.map((w) => `${w.start}-${w.end}`),
    ["22:00-06:30", "06:30-22:00", "06:30-23:00", "08:00-23:00"]
  );
});

test("gleiche Startzeit: mehr Wochentage zuerst", () => {
  const list = [
    { start: "06:30", end: "22:00", days: [4] },
    { start: "06:30", end: "22:00", days: [0, 1, 2, 3] },
  ];
  assert.equal([...list].sort(byKey)[0].days.length, 4);
});
