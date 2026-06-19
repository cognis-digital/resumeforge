/**
 * Type definitions for the resumeforge resume document.
 *
 * These mirror the in-house schema declared in schema.ts. They are kept as
 * plain interfaces so the renderers can consume a validated document with
 * full type information.
 */

export interface Basics {
  name: string;
  label?: string;
  email?: string;
  phone?: string;
  location?: string;
  summary?: string;
}

export interface WorkEntry {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  location?: string;
  summary?: string;
  highlights?: string[];
}

export interface EducationEntry {
  institution: string;
  area?: string;
  studyType?: string;
  startDate: string;
  endDate?: string;
  score?: string;
}

export interface SkillGroup {
  name: string;
  keywords?: string[];
}

export interface ProjectEntry {
  name: string;
  description?: string;
  url?: string;
  highlights?: string[];
}

export interface LinkEntry {
  label: string;
  url: string;
}

export interface Resume {
  basics: Basics;
  work?: WorkEntry[];
  education?: EducationEntry[];
  skills?: SkillGroup[];
  projects?: ProjectEntry[];
  links?: LinkEntry[];
}
