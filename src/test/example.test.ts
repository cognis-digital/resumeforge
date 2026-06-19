import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { parseAndValidate, toMarkdown, toHtml, type Resume } from "../index.js";

const here = dirname(fileURLToPath(import.meta.url));
// dist/test -> project root
const examplePath = resolve(here, "..", "..", "examples", "resume.json");

test("shipped examples/resume.json parses and validates", () => {
  const text = readFileSync(examplePath, "utf8");
  const { result } = parseAndValidate(text);
  assert.equal(result.valid, true, JSON.stringify(result.errors));
});

test("shipped example renders to both formats", () => {
  const { data } = parseAndValidate(readFileSync(examplePath, "utf8"));
  const resume = data as Resume;
  const md = toMarkdown(resume);
  assert.match(md, /# Jordan Avery Reyes/);
  assert.match(md, /## Experience/);

  const html = toHtml(resume, "compact");
  assert.match(html, /Jordan Avery Reyes/);
  assert.match(html, /^<!doctype html>/);
});
