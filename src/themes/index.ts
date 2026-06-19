/**
 * Self-contained CSS themes for the HTML renderer. Each theme is a complete
 * stylesheet inlined into the output so the resulting page has zero external
 * dependencies and prints cleanly to PDF.
 */

export type ThemeName = "classic" | "compact";

const SHARED_PRINT = `
@page { margin: 14mm; }
@media print {
  body { background: #fff; }
  .page { box-shadow: none; margin: 0; max-width: none; }
  a { color: inherit; text-decoration: none; }
}
* { box-sizing: border-box; }
ul { margin: 0.3rem 0 0.6rem; padding-left: 1.2rem; }
li { margin: 0.15rem 0; }
a { color: #2563eb; }
`;

const CLASSIC = `
${SHARED_PRINT}
body {
  font-family: Georgia, "Times New Roman", serif;
  color: #1f2933;
  background: #f4f5f7;
  margin: 0;
  line-height: 1.5;
}
.page {
  max-width: 760px;
  margin: 2rem auto;
  padding: 3rem 3.5rem;
  background: #fff;
  box-shadow: 0 1px 6px rgba(0,0,0,0.12);
}
h1 { font-size: 2rem; margin: 0 0 0.2rem; letter-spacing: 0.01em; }
.label { font-size: 1.05rem; color: #52606d; font-style: italic; margin: 0 0 0.6rem; }
.contact { font-size: 0.9rem; color: #52606d; margin-bottom: 1.2rem; }
.contact span:not(:last-child)::after { content: " · "; }
.summary { margin: 0 0 1.4rem; }
h2 {
  font-size: 1.15rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border-bottom: 2px solid #1f2933;
  padding-bottom: 0.25rem;
  margin: 1.6rem 0 0.8rem;
}
.entry { margin-bottom: 1.1rem; }
.entry-head { display: flex; justify-content: space-between; gap: 1rem; }
.entry-title { font-weight: bold; font-size: 1.02rem; }
.entry-meta { color: #616e7c; font-size: 0.85rem; white-space: nowrap; }
.entry-sub { color: #52606d; font-style: italic; font-size: 0.92rem; }
.skill-group { margin: 0.3rem 0; }
.skill-group strong { color: #1f2933; }
`;

const COMPACT = `
${SHARED_PRINT}
body {
  font-family: "Segoe UI", Helvetica, Arial, sans-serif;
  color: #20242b;
  background: #eef1f4;
  margin: 0;
  line-height: 1.38;
  font-size: 13px;
}
.page {
  max-width: 720px;
  margin: 1.5rem auto;
  padding: 2rem 2.4rem;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
}
h1 { font-size: 1.6rem; margin: 0; color: #14532d; }
.label { font-size: 0.95rem; color: #4b5563; margin: 0.1rem 0 0.4rem; }
.contact { font-size: 0.8rem; color: #4b5563; margin-bottom: 0.8rem; }
.contact span:not(:last-child)::after { content: " | "; color: #9aa5b1; }
.summary { margin: 0 0 1rem; }
h2 {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #14532d;
  margin: 1rem 0 0.4rem;
  border-bottom: 1px solid #cbd5e1;
  padding-bottom: 0.15rem;
}
.entry { margin-bottom: 0.7rem; }
.entry-head { display: flex; justify-content: space-between; gap: 0.8rem; }
.entry-title { font-weight: 600; }
.entry-meta { color: #6b7280; font-size: 0.78rem; white-space: nowrap; }
.entry-sub { color: #4b5563; font-size: 0.82rem; }
.skill-group { margin: 0.15rem 0; }
.skill-group strong { color: #14532d; }
`;

const THEMES: Record<ThemeName, string> = {
  classic: CLASSIC,
  compact: COMPACT,
};

export function getThemeCss(name: ThemeName): string {
  return THEMES[name].trim();
}

export function isThemeName(value: string): value is ThemeName {
  return value === "classic" || value === "compact";
}
