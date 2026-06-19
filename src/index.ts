/** Public library surface used by the CLI and tests. */

import type { Resume } from "./types.js";
import { resumeSchema } from "./schema.js";
import { validate, type ValidationResult } from "./validator.js";
import { renderMarkdown } from "./render-markdown.js";
import { renderHtml } from "./render-html.js";
import type { ThemeName } from "./themes/index.js";

export type { Resume } from "./types.js";
export type { ValidationError, ValidationResult } from "./validator.js";
export type { ThemeName } from "./themes/index.js";
export { isThemeName } from "./themes/index.js";
export { starterJson, starterResume } from "./scaffold.js";

/** Validate an already-parsed value against the resume schema. */
export function validateResume(data: unknown): ValidationResult {
  return validate(data, resumeSchema);
}

/** Parse JSON text, then validate. Throws on malformed JSON. */
export function parseAndValidate(text: string): {
  result: ValidationResult;
  data: unknown;
} {
  const data = JSON.parse(text);
  return { result: validateResume(data), data };
}

export function toMarkdown(resume: Resume): string {
  return renderMarkdown(resume);
}

export function toHtml(resume: Resume, theme: ThemeName): string {
  return renderHtml(resume, theme);
}
