// Run with: npm test   (uses Node's built-in test runner, no extra packages).
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseConcerts } from "./api.ts";

test("parseConcerts keeps valid rows, drops bad ones, blocks unsafe image URLs", () => {
  const rows = parseConcerts([
    { title: "A", date: "2026-12-01", location: "Manila", image: "https://x.test/a.jpg" },
    { title: "B", date: "2026-12-02", location: "Cebu", image: "http://x.test/b.jpg" },
    { title: "C", date: "2026-12-03", location: "Davao", image: "//evil.test/c.jpg" },
    { title: "D", date: "2026-12-04", location: "Pasay", image: "javascript:alert(1)" },
    { title: "", date: "2026-12-05", location: "Nowhere" },
    null,
    "junk",
  ]);
  assert.deepEqual(rows.map((r) => r.title), ["A", "B", "C", "D"]);
  assert.equal(rows[0].image, "https://x.test/a.jpg");
  assert.equal(rows[1].image, "");
  assert.equal(rows[2].image, "");
  assert.equal(rows[3].image, "");
});

test("parseConcerts keeps only well-formed ISO dates", () => {
  const [a, b] = parseConcerts([
    { title: "A", date: "Nov 6", location: "X", dateISO: "2026-11-06", endDateISO: "2026-11-14" },
    { title: "B", date: "Nov 7", location: "Y", dateISO: "11/07/2026", endDateISO: "soon" },
  ]);
  assert.equal(a.dateISO, "2026-11-06");
  assert.equal(a.endDateISO, "2026-11-14");
  assert.equal("dateISO" in b, false);
  assert.equal("endDateISO" in b, false);
});

test("parseConcerts respects the limit and non-array input", () => {
  const many = Array.from({ length: 20 }, (_, i) => ({ title: `T${i}`, date: "2026-12-01", location: "L" }));
  assert.equal(parseConcerts(many, 5).length, 5);
  assert.deepEqual(parseConcerts({}), []);
});

test("parseConcerts keeps a trimmed, length-limited imageAlt and omits it when missing", () => {
  const [a, b] = parseConcerts([
    { title: "A", date: "2026-12-01", location: "X", imageAlt: "  Poster for A  " },
    { title: "B", date: "2026-12-02", location: "Y" },
  ]);
  assert.equal(a.imageAlt, "Poster for A");
  assert.equal("imageAlt" in b, false);
});
