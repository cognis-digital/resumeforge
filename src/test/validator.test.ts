import { test } from "node:test";
import assert from "node:assert/strict";
import { validateResume } from "../index.js";
import { starterResume } from "../scaffold.js";

test("starter resume is valid", () => {
  const result = validateResume(starterResume);
  assert.equal(result.valid, true, JSON.stringify(result.errors));
});

test("minimal resume with only basics.name is valid", () => {
  const result = validateResume({ basics: { name: "A" } });
  assert.equal(result.valid, true);
});

test("missing basics is reported as required", () => {
  const result = validateResume({});
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => e.path === "/basics" && e.message === "is required"));
});

test("missing basics.name is reported", () => {
  const result = validateResume({ basics: {} });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => e.path === "/basics/name"));
});

test("empty required string fails minLength", () => {
  const result = validateResume({ basics: { name: "" } });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => e.path === "/basics/name" && /empty/.test(e.message)));
});

test("unknown top-level key is rejected", () => {
  const result = validateResume({ basics: { name: "A" }, nope: 1 });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => e.path === "/nope" && /not an allowed property/.test(e.message)));
});

test("unknown nested key is rejected", () => {
  const result = validateResume({ basics: { name: "A", twitter: "x" } });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => e.path === "/basics/twitter"));
});

test("invalid email format is reported", () => {
  const result = validateResume({ basics: { name: "A", email: "not-an-email" } });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => e.path === "/basics/email" && /email/.test(e.message)));
});

test("invalid date format is reported", () => {
  const result = validateResume({
    basics: { name: "A" },
    work: [{ company: "C", position: "P", startDate: "2021/01/01" }],
  });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => e.path === "/work/0/startDate" && /date/.test(e.message)));
});

test("impossible calendar date is rejected", () => {
  const result = validateResume({
    basics: { name: "A" },
    work: [{ company: "C", position: "P", startDate: "2021-02-30" }],
  });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => e.path === "/work/0/startDate"));
});

test("valid calendar date passes", () => {
  const result = validateResume({
    basics: { name: "A" },
    work: [{ company: "C", position: "P", startDate: "2020-02-29" }],
  });
  assert.equal(result.valid, true, JSON.stringify(result.errors));
});

test("invalid uri in link is reported", () => {
  const result = validateResume({
    basics: { name: "A" },
    links: [{ label: "Site", url: "ftp://example.com" }],
  });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => e.path === "/links/0/url"));
});

test("wrong type for array is reported", () => {
  const result = validateResume({ basics: { name: "A" }, work: "nope" });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => e.path === "/work" && /expected array/.test(e.message)));
});

test("multiple errors are all collected", () => {
  const result = validateResume({ basics: {}, bogus: 1 });
  assert.equal(result.valid, false);
  assert.ok(result.errors.length >= 2);
});
