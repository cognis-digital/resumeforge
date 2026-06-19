/** Starter resume produced by `resumeforge new`. */

import type { Resume } from "./types.js";

export const starterResume: Resume = {
  basics: {
    name: "Your Name",
    label: "Your Professional Title",
    email: "you@example.com",
    phone: "+1 555 0100",
    location: "City, Country",
    summary:
      "A short professional summary. Replace this with two or three sentences about who you are and what you do.",
  },
  work: [
    {
      company: "Example Company",
      position: "Your Role",
      startDate: "2022-01-01",
      location: "City, Country",
      summary: "What the role involved.",
      highlights: [
        "A concrete, measurable achievement.",
        "Another accomplishment worth listing.",
      ],
    },
  ],
  education: [
    {
      institution: "Your University",
      studyType: "Bachelor of Science",
      area: "Your Field",
      startDate: "2017-09-01",
      endDate: "2021-06-01",
    },
  ],
  skills: [
    { name: "Languages", keywords: ["TypeScript", "Python"] },
    { name: "Tools", keywords: ["Git", "Docker"] },
  ],
  projects: [
    {
      name: "A Project",
      description: "One line about the project.",
      url: "https://example.com",
      highlights: ["What you built or shipped."],
    },
  ],
  links: [{ label: "Website", url: "https://example.com" }],
};

export function starterJson(): string {
  return JSON.stringify(starterResume, null, 2) + "\n";
}
