import { test } from "node:test";
import assert from "node:assert/strict";
import { toMarkdown, toHtml, type Resume } from "../index.js";
import { starterResume } from "../scaffold.js";

const sample: Resume = {
  basics: {
    name: "Casey <Tester>",
    label: "Engineer",
    email: "casey@example.com",
    location: "Denver, CO",
    summary: "Short summary.",
  },
  work: [
    {
      company: "Acme",
      position: "Dev",
      startDate: "2020-03-01",
      highlights: ["Did a thing", "Did another thing"],
    },
  ],
  skills: [{ name: "Languages", keywords: ["TS", "Go"] }],
  links: [{ label: "Site", url: "https://example.com" }],
};

test("markdown includes name as H1", () => {
  const md = toMarkdown(sample);
  assert.match(md, /^# Casey <Tester>/);
});

test("markdown formats dates and uses Present for open end", () => {
  const md = toMarkdown(sample);
  assert.match(md, /Mar 2020 – Present/);
});

test("markdown renders highlights as bullets", () => {
  const md = toMarkdown(sample);
  assert.match(md, /- Did a thing/);
  assert.match(md, /- Did another thing/);
});

test("markdown renders skills with keywords", () => {
  const md = toMarkdown(sample);
  assert.match(md, /\*\*Languages\*\*: TS, Go/);
});

test("html is a self-contained document with inlined style", () => {
  const html = toHtml(sample, "classic");
  assert.match(html, /^<!doctype html>/);
  assert.match(html, /<style>/);
  assert.doesNotMatch(html, /<link /, "should have no external stylesheet links");
  assert.doesNotMatch(html, /<script/, "should have no scripts");
});

test("html escapes special characters in content", () => {
  const html = toHtml(sample, "classic");
  assert.match(html, /Casey &lt;Tester&gt;/);
  assert.doesNotMatch(html, /<h1>Casey <Tester>/);
});

test("classic and compact themes produce different css", () => {
  const classic = toHtml(sample, "classic");
  const compact = toHtml(sample, "compact");
  assert.notEqual(classic, compact);
  assert.match(classic, /Georgia/);
  assert.match(compact, /Segoe UI/);
});

test("html includes mailto and external links", () => {
  const html = toHtml(sample, "classic");
  assert.match(html, /mailto:casey@example.com/);
  assert.match(html, /href="https:\/\/example.com"/);
});

test("renderers handle the starter resume without throwing", () => {
  assert.doesNotThrow(() => toMarkdown(starterResume));
  assert.doesNotThrow(() => toHtml(starterResume, "compact"));
});
