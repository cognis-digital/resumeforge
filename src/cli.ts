#!/usr/bin/env node
/**
 * resumeforge command-line interface.
 *
 * Commands:
 *   render <resume.json> --format md|html [--theme classic|compact] -o <out>
 *   validate <resume.json>
 *   new [path]
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import {
  parseAndValidate,
  toMarkdown,
  toHtml,
  starterJson,
  isThemeName,
  type Resume,
  type ThemeName,
  type ValidationResult,
} from "./index.js";

const USAGE = `resumeforge — structured resume builder

Usage:
  resumeforge render <resume.json> --format <md|html> [--theme <classic|compact>] -o <output>
  resumeforge validate <resume.json>
  resumeforge new [path]
  resumeforge --help

Options:
  --format, -f   Output format: md or html (required for render)
  --theme, -t    HTML theme: classic (default) or compact
  --out, -o      Output file path (required for render)
  --help, -h     Show this help
`;

interface ParsedArgs {
  positionals: string[];
  options: Record<string, string>;
}

function parseArgs(argv: string[]): ParsedArgs {
  const positionals: string[] = [];
  const options: Record<string, string> = {};
  const aliases: Record<string, string> = {
    f: "format",
    t: "theme",
    o: "out",
    h: "help",
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      options.help = "true";
      continue;
    }
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const next = argv[i + 1];
      if (next !== undefined && !next.startsWith("-")) {
        options[key] = next;
        i++;
      } else {
        options[key] = "true";
      }
    } else if (arg.startsWith("-") && arg.length === 2) {
      const key = aliases[arg.slice(1)] ?? arg.slice(1);
      const next = argv[i + 1];
      if (next !== undefined && !next.startsWith("-")) {
        options[key] = next;
        i++;
      } else {
        options[key] = "true";
      }
    } else {
      positionals.push(arg);
    }
  }
  return { positionals, options };
}

function fail(message: string): never {
  process.stderr.write(`error: ${message}\n`);
  process.exit(1);
}

function printValidationErrors(result: ValidationResult): void {
  for (const err of result.errors) {
    const where = err.path === "/" || err.path === "" ? "(root)" : err.path;
    process.stderr.write(`  ${where}: ${err.message}\n`);
  }
}

function loadResume(file: string): Resume {
  const path = resolve(file);
  if (!existsSync(path)) fail(`file not found: ${file}`);
  let text: string;
  try {
    text = readFileSync(path, "utf8");
  } catch (err) {
    return fail(`could not read ${file}: ${(err as Error).message}`);
  }

  let parsed;
  try {
    parsed = parseAndValidate(text);
  } catch (err) {
    return fail(`invalid JSON in ${file}: ${(err as Error).message}`);
  }

  if (!parsed.result.valid) {
    process.stderr.write(`${file} failed schema validation:\n`);
    printValidationErrors(parsed.result);
    process.exit(1);
  }
  return parsed.data as Resume;
}

function cmdValidate(args: ParsedArgs): void {
  const file = args.positionals[0];
  if (!file) fail("validate requires a resume file path");

  const path = resolve(file);
  if (!existsSync(path)) fail(`file not found: ${file}`);

  let parsed;
  try {
    parsed = parseAndValidate(readFileSync(path, "utf8"));
  } catch (err) {
    return fail(`invalid JSON in ${file}: ${(err as Error).message}`);
  }

  if (parsed.result.valid) {
    process.stdout.write(`ok: ${file} is a valid resume\n`);
    process.exit(0);
  }
  process.stderr.write(`${file} failed schema validation:\n`);
  printValidationErrors(parsed.result);
  process.exit(1);
}

function cmdRender(args: ParsedArgs): void {
  const file = args.positionals[0];
  if (!file) fail("render requires a resume file path");

  const format = args.options.format;
  if (!format) fail("render requires --format (md or html)");
  if (format !== "md" && format !== "html") {
    fail(`unknown format "${format}" (expected md or html)`);
  }

  const out = args.options.out;
  if (!out) fail("render requires --out (output file path)");

  const themeRaw = args.options.theme ?? "classic";
  if (!isThemeName(themeRaw)) {
    fail(`unknown theme "${themeRaw}" (expected classic or compact)`);
  }
  const theme: ThemeName = themeRaw;

  const resume = loadResume(file);
  const output = format === "md" ? toMarkdown(resume) : toHtml(resume, theme);

  try {
    writeFileSync(resolve(out), output, "utf8");
  } catch (err) {
    return fail(`could not write ${out}: ${(err as Error).message}`);
  }
  process.stdout.write(`wrote ${out} (${format}${format === "html" ? `, ${theme}` : ""})\n`);
}

function cmdNew(args: ParsedArgs): void {
  const target = args.positionals[0] ?? "resume.json";
  const path = resolve(target);
  if (existsSync(path)) {
    fail(`refusing to overwrite existing file: ${target}`);
  }
  try {
    writeFileSync(path, starterJson(), "utf8");
  } catch (err) {
    return fail(`could not write ${target}: ${(err as Error).message}`);
  }
  process.stdout.write(
    `created ${target} — edit it, then run: resumeforge render ${target} --format html -o resume.html\n`,
  );
}

function main(): void {
  const argv = process.argv.slice(2);
  const args = parseArgs(argv);

  if (args.options.help || args.positionals.length === 0) {
    process.stdout.write(USAGE);
    process.exit(args.positionals.length === 0 ? 1 : 0);
  }

  const command = args.positionals.shift();
  switch (command) {
    case "render":
      cmdRender(args);
      break;
    case "validate":
      cmdValidate(args);
      break;
    case "new":
      cmdNew(args);
      break;
    default:
      fail(`unknown command "${command}" (see resumeforge --help)`);
  }
}

main();
