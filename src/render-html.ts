/**
 * Render a validated resume document to a single self-contained HTML page.
 * All styling is inlined from the selected theme so the file can be opened
 * directly in a browser and printed to PDF with no external requests.
 */

import type { Resume } from "./types.js";
import { entryRange, escapeHtml } from "./util.js";
import { getThemeCss, type ThemeName } from "./themes/index.js";

function e(value: string): string {
  return escapeHtml(value);
}

function contactHtml(resume: Resume): string {
  const { basics } = resume;
  const parts: string[] = [];
  if (basics.location) parts.push(`<span>${e(basics.location)}</span>`);
  if (basics.email)
    parts.push(
      `<span><a href="mailto:${e(basics.email)}">${e(basics.email)}</a></span>`,
    );
  if (basics.phone) parts.push(`<span>${e(basics.phone)}</span>`);
  for (const link of resume.links ?? []) {
    parts.push(
      `<span><a href="${e(link.url)}">${e(link.label)}</a></span>`,
    );
  }
  return parts.length ? `<div class="contact">${parts.join("")}</div>` : "";
}

function highlightsHtml(highlights: string[] | undefined): string {
  if (!highlights || highlights.length === 0) return "";
  const items = highlights.map((h) => `<li>${e(h)}</li>`).join("");
  return `<ul>${items}</ul>`;
}

function workHtml(resume: Resume): string {
  if (!resume.work || resume.work.length === 0) return "";
  const entries = resume.work
    .map((job) => {
      const sub = job.location ? `<div class="entry-sub">${e(job.location)}</div>` : "";
      const summary = job.summary ? `<p>${e(job.summary)}</p>` : "";
      return `<div class="entry">
  <div class="entry-head">
    <span class="entry-title">${e(job.position)} — ${e(job.company)}</span>
    <span class="entry-meta">${e(entryRange(job))}</span>
  </div>
  ${sub}
  ${summary}
  ${highlightsHtml(job.highlights)}
</div>`;
    })
    .join("\n");
  return `<section><h2>Experience</h2>${entries}</section>`;
}

function educationHtml(resume: Resume): string {
  if (!resume.education || resume.education.length === 0) return "";
  const entries = resume.education
    .map((ed) => {
      const degree = [ed.studyType, ed.area].filter(Boolean).join(", ");
      const title = degree ? `${degree} — ${ed.institution}` : ed.institution;
      const score = ed.score ? `<div class="entry-sub">Score: ${e(ed.score)}</div>` : "";
      return `<div class="entry">
  <div class="entry-head">
    <span class="entry-title">${e(title)}</span>
    <span class="entry-meta">${e(entryRange(ed))}</span>
  </div>
  ${score}
</div>`;
    })
    .join("\n");
  return `<section><h2>Education</h2>${entries}</section>`;
}

function skillsHtml(resume: Resume): string {
  if (!resume.skills || resume.skills.length === 0) return "";
  const groups = resume.skills
    .map((g) => {
      const kw = g.keywords?.length ? `: ${e(g.keywords.join(", "))}` : "";
      return `<div class="skill-group"><strong>${e(g.name)}</strong>${kw}</div>`;
    })
    .join("\n");
  return `<section><h2>Skills</h2>${groups}</section>`;
}

function projectsHtml(resume: Resume): string {
  if (!resume.projects || resume.projects.length === 0) return "";
  const entries = resume.projects
    .map((p) => {
      const title = p.url
        ? `<a href="${e(p.url)}">${e(p.name)}</a>`
        : e(p.name);
      const desc = p.description ? `<p>${e(p.description)}</p>` : "";
      return `<div class="entry">
  <div class="entry-title">${title}</div>
  ${desc}
  ${highlightsHtml(p.highlights)}
</div>`;
    })
    .join("\n");
  return `<section><h2>Projects</h2>${entries}</section>`;
}

export function renderHtml(resume: Resume, theme: ThemeName): string {
  const { basics } = resume;
  const css = getThemeCss(theme);
  const label = basics.label
    ? `<div class="label">${e(basics.label)}</div>`
    : "";
  const summary = basics.summary
    ? `<p class="summary">${e(basics.summary)}</p>`
    : "";

  const body = [
    `<h1>${e(basics.name)}</h1>`,
    label,
    contactHtml(resume),
    summary,
    workHtml(resume),
    educationHtml(resume),
    skillsHtml(resume),
    projectsHtml(resume),
  ]
    .filter(Boolean)
    .join("\n");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${e(basics.name)} — Resume</title>
<style>
${css}
</style>
</head>
<body>
<main class="page">
${body}
</main>
</body>
</html>
`;
}
