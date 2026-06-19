/** Render a validated resume document to clean GitHub-flavored Markdown. */

import type { Resume } from "./types.js";
import { entryRange } from "./util.js";

function contactLine(resume: Resume): string {
  const { basics } = resume;
  const parts: string[] = [];
  if (basics.location) parts.push(basics.location);
  if (basics.email) parts.push(basics.email);
  if (basics.phone) parts.push(basics.phone);
  for (const link of resume.links ?? []) {
    parts.push(`[${link.label}](${link.url})`);
  }
  return parts.join(" · ");
}

export function renderMarkdown(resume: Resume): string {
  const { basics } = resume;
  const lines: string[] = [];

  lines.push(`# ${basics.name}`);
  if (basics.label) lines.push("", `*${basics.label}*`);

  const contact = contactLine(resume);
  if (contact) lines.push("", contact);

  if (basics.summary) lines.push("", basics.summary);

  if (resume.work && resume.work.length > 0) {
    lines.push("", "## Experience");
    for (const job of resume.work) {
      lines.push("", `### ${job.position} — ${job.company}`);
      const meta = [entryRange(job), job.location].filter(Boolean).join(" · ");
      if (meta) lines.push(`*${meta}*`);
      if (job.summary) lines.push("", job.summary);
      for (const h of job.highlights ?? []) lines.push(`- ${h}`);
    }
  }

  if (resume.education && resume.education.length > 0) {
    lines.push("", "## Education");
    for (const ed of resume.education) {
      const degree = [ed.studyType, ed.area].filter(Boolean).join(", ");
      const heading = degree
        ? `${degree} — ${ed.institution}`
        : ed.institution;
      lines.push("", `### ${heading}`);
      const meta = [entryRange(ed), ed.score ? `Score: ${ed.score}` : ""]
        .filter(Boolean)
        .join(" · ");
      if (meta) lines.push(`*${meta}*`);
    }
  }

  if (resume.skills && resume.skills.length > 0) {
    lines.push("", "## Skills");
    for (const group of resume.skills) {
      const kw = group.keywords?.length ? `: ${group.keywords.join(", ")}` : "";
      lines.push(`- **${group.name}**${kw}`);
    }
  }

  if (resume.projects && resume.projects.length > 0) {
    lines.push("", "## Projects");
    for (const proj of resume.projects) {
      const title = proj.url ? `[${proj.name}](${proj.url})` : proj.name;
      lines.push("", `### ${title}`);
      if (proj.description) lines.push(proj.description);
      for (const h of proj.highlights ?? []) lines.push(`- ${h}`);
    }
  }

  return lines.join("\n").trimStart() + "\n";
}
