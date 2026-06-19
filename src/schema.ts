/**
 * In-house JSON-Schema-style description of the resume document.
 *
 * Only the subset of keywords the validator (see validator.ts) understands is
 * used here: type, required, properties, items, enum, format and
 * additionalProperties. This is intentionally minimal — no external JSON
 * Schema library is pulled in.
 */

export type SchemaType =
  | "object"
  | "array"
  | "string"
  | "number"
  | "boolean";

export type SchemaFormat = "date" | "email" | "uri";

export interface SchemaNode {
  type: SchemaType;
  /** Property name -> child schema (objects only). */
  properties?: Record<string, SchemaNode>;
  /** Names of required properties (objects only). */
  required?: string[];
  /** Whether keys outside `properties` are allowed (objects only). */
  additionalProperties?: boolean;
  /** Schema applied to each element (arrays only). */
  items?: SchemaNode;
  /** Allowed literal values (strings/numbers). */
  enum?: Array<string | number>;
  /** String format constraint. */
  format?: SchemaFormat;
  /** Minimum length for strings / minimum element count for arrays. */
  minLength?: number;
}

const dateString: SchemaNode = { type: "string", format: "date" };

const workItem: SchemaNode = {
  type: "object",
  required: ["company", "position", "startDate"],
  additionalProperties: false,
  properties: {
    company: { type: "string", minLength: 1 },
    position: { type: "string", minLength: 1 },
    startDate: dateString,
    endDate: dateString,
    location: { type: "string" },
    summary: { type: "string" },
    highlights: { type: "array", items: { type: "string", minLength: 1 } },
  },
};

const educationItem: SchemaNode = {
  type: "object",
  required: ["institution", "startDate"],
  additionalProperties: false,
  properties: {
    institution: { type: "string", minLength: 1 },
    area: { type: "string" },
    studyType: { type: "string" },
    startDate: dateString,
    endDate: dateString,
    score: { type: "string" },
  },
};

const skillItem: SchemaNode = {
  type: "object",
  required: ["name"],
  additionalProperties: false,
  properties: {
    name: { type: "string", minLength: 1 },
    keywords: { type: "array", items: { type: "string", minLength: 1 } },
  },
};

const projectItem: SchemaNode = {
  type: "object",
  required: ["name"],
  additionalProperties: false,
  properties: {
    name: { type: "string", minLength: 1 },
    description: { type: "string" },
    url: { type: "string", format: "uri" },
    highlights: { type: "array", items: { type: "string", minLength: 1 } },
  },
};

const linkItem: SchemaNode = {
  type: "object",
  required: ["label", "url"],
  additionalProperties: false,
  properties: {
    label: { type: "string", minLength: 1 },
    url: { type: "string", format: "uri" },
  },
};

export const resumeSchema: SchemaNode = {
  type: "object",
  required: ["basics"],
  additionalProperties: false,
  properties: {
    basics: {
      type: "object",
      required: ["name"],
      additionalProperties: false,
      properties: {
        name: { type: "string", minLength: 1 },
        label: { type: "string" },
        email: { type: "string", format: "email" },
        phone: { type: "string" },
        location: { type: "string" },
        summary: { type: "string" },
      },
    },
    work: { type: "array", items: workItem },
    education: { type: "array", items: educationItem },
    skills: { type: "array", items: skillItem },
    projects: { type: "array", items: projectItem },
    links: { type: "array", items: linkItem },
  },
};
