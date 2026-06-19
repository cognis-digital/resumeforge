/** Shared formatting helpers used by the renderers. */

import type { WorkEntry, EducationEntry } from "./types.js";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** Render a YYYY-MM-DD date as "Mon YYYY" (e.g. "Mar 2021"). */
export function formatDate(value: string | undefined): string {
  if (!value) return "";
  const [y, m] = value.split("-").map((p) => Number(p));
  if (!y || !m || m < 1 || m > 12) return value;
  return `${MONTHS[m - 1]} ${y}`;
}

/** Render a start/end range, defaulting a missing end to "Present". */
export function formatRange(
  startDate: string,
  endDate: string | undefined,
): string {
  const start = formatDate(startDate);
  const end = endDate ? formatDate(endDate) : "Present";
  return `${start} – ${end}`;
}

/** Date range for a work or education entry. */
export function entryRange(entry: WorkEntry | EducationEntry): string {
  return formatRange(entry.startDate, entry.endDate);
}

/** Escape characters that have meaning in HTML text/attribute contexts. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
