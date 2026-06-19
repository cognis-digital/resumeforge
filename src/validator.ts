/**
 * Minimal, dependency-free JSON-Schema-style validator.
 *
 * Supports the keyword subset used by resumeforge: type, required,
 * properties, additionalProperties, items, enum, format (date/email/uri) and
 * minLength. It collects every violation with a JSON-pointer-like path so the
 * CLI can report all problems at once rather than failing on the first.
 */

import type { SchemaNode } from "./schema.js";

export interface ValidationError {
  /** Location of the offending value, e.g. "/work/0/startDate". */
  path: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

// YYYY-MM-DD, with real calendar-day checking applied separately.
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
// Pragmatic email shape: local@domain.tld with no whitespace.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidCalendarDate(value: string): boolean {
  if (!DATE_RE.test(value)) return false;
  const [y, m, d] = value.split("-").map((p) => Number(p));
  if (m < 1 || m > 12 || d < 1 || d > 31) return false;
  const dt = new Date(Date.UTC(y, m - 1, d));
  return (
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() === m - 1 &&
    dt.getUTCDate() === d
  );
}

function isValidUri(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function typeOf(value: unknown): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

function checkFormat(
  value: string,
  format: NonNullable<SchemaNode["format"]>,
  path: string,
  errors: ValidationError[],
): void {
  switch (format) {
    case "date":
      if (!isValidCalendarDate(value)) {
        errors.push({
          path,
          message: `must be a valid date in YYYY-MM-DD format (got "${value}")`,
        });
      }
      break;
    case "email":
      if (!EMAIL_RE.test(value)) {
        errors.push({ path, message: `must be a valid email address (got "${value}")` });
      }
      break;
    case "uri":
      if (!isValidUri(value)) {
        errors.push({
          path,
          message: `must be a valid http(s) URL (got "${value}")`,
        });
      }
      break;
  }
}

function validateNode(
  value: unknown,
  schema: SchemaNode,
  path: string,
  errors: ValidationError[],
): void {
  const actual = typeOf(value);

  if (actual !== schema.type) {
    errors.push({
      path: path || "/",
      message: `expected ${schema.type} but got ${actual}`,
    });
    return; // type mismatch: deeper checks would be noise
  }

  switch (schema.type) {
    case "string": {
      const s = value as string;
      if (schema.minLength !== undefined && s.length < schema.minLength) {
        errors.push({
          path,
          message:
            schema.minLength === 1
              ? "must not be empty"
              : `must be at least ${schema.minLength} characters long`,
        });
      }
      if (schema.enum && !schema.enum.includes(s)) {
        errors.push({
          path,
          message: `must be one of: ${schema.enum.join(", ")}`,
        });
      }
      if (schema.format) checkFormat(s, schema.format, path, errors);
      break;
    }
    case "number": {
      if (schema.enum && !schema.enum.includes(value as number)) {
        errors.push({
          path,
          message: `must be one of: ${schema.enum.join(", ")}`,
        });
      }
      break;
    }
    case "array": {
      if (
        schema.minLength !== undefined &&
        (value as unknown[]).length < schema.minLength
      ) {
        errors.push({
          path,
          message: `must contain at least ${schema.minLength} item(s)`,
        });
      }
      if (schema.items) {
        (value as unknown[]).forEach((el, i) => {
          validateNode(el, schema.items!, `${path}/${i}`, errors);
        });
      }
      break;
    }
    case "object": {
      const obj = value as Record<string, unknown>;
      const props = schema.properties ?? {};

      for (const key of schema.required ?? []) {
        if (!(key in obj) || obj[key] === undefined) {
          errors.push({
            path: `${path}/${key}`,
            message: "is required",
          });
        }
      }

      for (const [key, child] of Object.entries(obj)) {
        const childPath = `${path}/${key}`;
        if (key in props) {
          if (child !== undefined) {
            validateNode(child, props[key], childPath, errors);
          }
        } else if (schema.additionalProperties === false) {
          errors.push({
            path: childPath,
            message: "is not an allowed property",
          });
        }
      }
      break;
    }
    case "boolean":
      break;
  }
}

/** Validate a parsed value against a schema, returning all violations. */
export function validate(data: unknown, schema: SchemaNode): ValidationResult {
  const errors: ValidationError[] = [];
  validateNode(data, schema, "", errors);
  return { valid: errors.length === 0, errors };
}
