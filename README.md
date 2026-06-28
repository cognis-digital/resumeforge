# resumeforge

A structured profile/resume builder. You keep a single JSON resume; resumeforge
**validates** it against an in-house schema and **renders** it to clean Markdown
or a self-contained, print-ready HTML page (open it in a browser and "Save as
PDF"). Multiple themes are supported, and the validator works as a CI gate.

Zero runtime dependencies. Written in TypeScript, compiled to ESM, runs on Node 20+.


<!-- cognis:example:start -->
## 🔎 Example output

**Sample result format** _(illustrative values — run on your own data for real findings):_

```
{
  "name": "John Doe",
  "contact_info": {
    "email": "johndoe@example.com",
    "phone": "+1-555-1234567"
  },
  "summary": "Highly motivated and detail-oriented professional seeking a challenging role in data analysis.",
  "work_experience": [
    {
      "title": "Data Analyst",
      "company": "ABC Corporation",
      "dates": ["2020-01-01", "2022-06-30"],
      "description": "Analyzed sales trends and developed reports to inform business decisions."
    },
    {
      "title": "Junior Data Scientist",
      "company": "XYZ Inc.",
      "dates": ["2018-09-01", "2019-12-31"],
      "description": "Built predictive models using Python and R, and presented findings to stakeholders."
    }
  ],
  "education": [
    {
      "name": "Master of Science in Data Science",
      "institution": "University of Data Science",
      "dates": ["2015-09-01", "2017-06-30"]
    },
    {
      "name": "Bachelor of Science in Computer Science",
      "institution": "University of Computing",
      "dates": ["2010-09-01", "2014-06-30"]
    }
  ]
}
```

<!-- cognis:example:end -->

## Install / build

```sh
git clone <your-fork>
cd resumeforge
npm install
npm run build
npm test
```

After building, the CLI lives at `dist/cli.js`. You can run it with
`node dist/cli.js …`, or link it globally so the `resumeforge` command is on your
PATH:

```sh
npm link
```

## Usage

### Scaffold a starter resume

```sh
resumeforge new resume.json
```

```
created resume.json — edit it, then run: resumeforge render resume.json --format html -o resume.html
```

### Validate (CI gate — non-zero exit on error)

```sh
resumeforge validate examples/resume.json
```

```
ok: examples/resume.json is a valid resume
```

On a malformed resume the command lists every problem and exits with code `1`:

```sh
resumeforge validate broken.json
```

```
broken.json failed schema validation:
  /basics/name: is required
  /bogus: is not an allowed property
```

### Render to Markdown

```sh
resumeforge render examples/resume.json --format md -o resume.md
```

```
wrote resume.md (md)
```

Produces, for the shipped sample:

```markdown
# Jordan Avery Reyes

*Backend Engineer*

Austin, TX · jordan.reyes@example.com · +1 555 0142 · [Website](https://example.com/jordan) · [GitHub](https://example.com/gh/jordan)

Backend engineer with seven years building reliable data and payments services. I care about clear interfaces, observable systems, and keeping on-call quiet.

## Experience

### Senior Backend Engineer — Northwind Payments
*Apr 2021 – Present · Remote*

Owned the ledger and settlement services behind a multi-currency payouts product.
- Cut settlement reconciliation time from hours to under five minutes by redesigning the batch pipeline.
...
```

### Render to HTML (print-ready)

```sh
resumeforge render examples/resume.json --format html --theme compact -o resume.html
```

```
wrote resume.html (html, compact)
```

The HTML is a single self-contained file — all CSS is inlined, there are no
external requests, and no JavaScript. Open it in any browser and use
**Print → Save as PDF** for a clean, paginated document.

## Commands & options

```
resumeforge render <resume.json> --format <md|html> [--theme <classic|compact>] -o <output>
resumeforge validate <resume.json>
resumeforge new [path]
resumeforge --help
```

| Option | Alias | Applies to | Description |
| --- | --- | --- | --- |
| `--format` | `-f` | render | Output format: `md` or `html` (required) |
| `--theme`  | `-t` | render | HTML theme: `classic` (default) or `compact` |
| `--out`    | `-o` | render | Output file path (required) |
| `--help`   | `-h` | all | Show usage |

## Resume schema

A resume is a single JSON object. Only `basics` (with a non-empty `name`) is
required; every other section is optional. Unknown keys are rejected.

| Section | Type | Notes |
| --- | --- | --- |
| `basics` | object | **required**; `name` required. Optional: `label`, `email`, `phone`, `location`, `summary` |
| `work` | array | each: `company`, `position`, `startDate` required; optional `endDate`, `location`, `summary`, `highlights[]` |
| `education` | array | each: `institution`, `startDate` required; optional `area`, `studyType`, `endDate`, `score` |
| `skills` | array | each: `name` required; optional `keywords[]` |
| `projects` | array | each: `name` required; optional `description`, `url`, `highlights[]` |
| `links` | array | each: `label`, `url` required |

Formats enforced by the validator:

- **Dates** must be `YYYY-MM-DD` and must be real calendar days (e.g. `2021-02-30` is rejected). A missing `endDate` renders as *Present*.
- **Emails** must look like `local@domain.tld`.
- **URLs** (`links[].url`, `projects[].url`) must be valid `http(s)` URLs.

See [`examples/resume.json`](examples/resume.json) for a complete, authored sample.

## Features

- **In-house JSON-Schema-style validator** — supports `type`, `required`,
  `properties`, `additionalProperties`, `items`, `enum`, `format`
  (date/email/uri) and `minLength`. No external schema library.
- **Collects all errors at once** with JSON-pointer-style paths, so one run
  surfaces every problem rather than failing on the first.
- **Two renderers** — Markdown (GitHub-flavored) and a self-contained styled
  HTML page.
- **Multiple themes** — `classic` (serif, print-document feel) and `compact`
  (dense sans-serif). Themes are pure inlined CSS.
- **CI gate** — `validate` exits non-zero on any schema error.
- **Scaffolding** — `new` writes a ready-to-edit starter resume.
- **Zero runtime dependencies**; TypeScript dev-only.

## Development

```sh
npm run build   # tsc -> dist/
npm test        # node --test over dist/test/*.test.js
```

Continuous integration (`.github/workflows/ci.yml`) installs, builds, tests, and
smoke-tests render + validate on Ubuntu with Node 20.

## License

License: COCL 1.0

Maintained by Cognis Digital.
