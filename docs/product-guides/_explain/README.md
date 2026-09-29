# HelpPanel ("Explain this") — maintainer guide

How the in-app help panel works, and how to fix, update, add and remove its content.

This folder is the single source for every help entry. The same Markdown files feed two places:

- the book-icon panel inside the Logstag app, and
- the matching reference pages on docs.logstag.com.

Fix a sentence here once and both update. This README is not published: Docusaurus skips folders that start with `_`, and the compiler only reads folders that contain a `_meta.json`.

---

## 1. How it works

```
logstag-docs (this repo, main)                       logstag-frontend              logstag-backend
────────────────────────────────                     ────────────────              ───────────────
_explain/<group>/<key>.md   ─┐                        <HelpTrigger id="group#key"/> GET /api/v1/features
_explain/<group>/_meta.json ─┼─ scripts/build-explain.mjs                           → { helpPanel: true|false }
_explain/config.json        ─┘        │                        │  fetches on demand          (per organization)
                                      ▼                        ▼
                     static/explain/v1/<group>.json  ──►  https://docs.logstag.com/explain/v1/<group>.json
                     static/explain/v1/index.json        (GitHub Pages, deployed on every push to main)
routed page (.mdx) imports the same .md files  ──►  https://docs.logstag.com/product-guides/...#anchor
```

- **Content** is Markdown partials plus one `_meta.json` sidecar per group, in `docs/product-guides/_explain/`.
- **Compiler.** `scripts/build-explain.mjs` turns them into typed JSON blocks (never HTML), one file per group, plus `index.json` and `schema.json`. It runs on `npm start`, `npm run build` and in the deploy workflow. It fails the build on anything it cannot represent.
- **Deploy.** The "Deploy to GitHub Pages" workflow runs on every push to `main` and takes about 1.5–2.5 minutes. The registry is served from `https://docs.logstag.com/explain/v1/` with `Cache-Control: max-age=600`.
- **Frontend.** When a page with a trigger renders, the app fetches `<group>.json`, validates it, and shows the book icon. Trigger ids are type-checked against `lib/help/help-keys.ts` (`HELP_KEYS`). The data is cached for 5 minutes and refetched when the browser tab regains focus.
- **Backend.** `GET /api/v1/features` decides per organization whether triggers appear at all. It is on for every organization by default.
- **Everything fails closed.** A missing entry, a failed fetch, a disabled registry or a disabled organization makes the trigger disappear rather than error.

Vocabulary: a **group** is one JSON file and one app surface (page or tab). An **entry** is one explanation (a metric, chart, table, section or page). An **id** is `group#key`, e.g. `dashboard#metric.instances`.

### How long until users see a change

| Change | Needs | Visible |
|---|---|---|
| Text, title or figure of an existing entry | docs PR merged to `main` | ~2 min deploy + up to 10 min HTTP cache + up to 5 min app cache (worst case ~17 min for an already-open tab; a fresh page load sees it sooner) |
| New entry or group (content) | docs PR | same as above; nothing shows in the app until the frontend mounts a trigger |
| New trigger in the app | frontend PR to `dev` + **manual** frontend build and deploy per environment | after the frontend deploy |
| Turn the panel on/off for organizations | backend environment variable + backend redeploy | within ~5 min of the backend deploy |

---

## 2. Anatomy of a group

```
docs/product-guides/_explain/dashboard/
├── _meta.json                 ← group + all entry metadata
├── metric.instances.md        ← one entry's text (no frontmatter)
├── metric.databases.md
└── ...
docs/product-guides/dashboard.mdx   ← the routed docs page that imports the partials
```

### `_meta.json`

```json
{
  "group": "dashboard",
  "category": "Dashboard",
  "docsPage": "/product-guides/dashboard/",
  "entries": {
    "metric.instances": {
      "file": "metric.instances.md",
      "kind": "metric",
      "title": "Instances",
      "anchor": "#instances",
      "related": ["metric.databases", "metric.connections", "metric.alerts"],
      "app": true
    }
  }
}
```

| Field | Required | What it does |
|---|---|---|
| `group` | yes | The group id: the JSON file name and the part before `#` in trigger ids. It is **not** taken from the folder name. `_explain/activity-explorer/page/` has group `activity-explorer`. |
| `category` | yes | The small eyebrow line above the panel title, e.g. "Activity Explorer · Blocking Chains". |
| `docsPage` | yes | Path of the routed docs page, root-relative with a trailing slash. |
| `entries` | yes | Map of key to entry. |
| `file` | yes | The partial in the same folder. By convention `<key>.md`. |
| `kind` | yes | Badge in the panel header. Use one of `metric`, `chart`, `table`, `section`, `page` (not validated, so a typo just shows a wrong badge). |
| `title` | yes | Panel heading, the trigger's `aria-label` ("Explain: Instances") and the label of Related chips. **Titles live here, not in the `.md`.** |
| `anchor` | should | Heading id on the routed page, e.g. `"#instances"`. Use `""` for page-level entries (links to page top). Nothing checks it (see §6). |
| `related` | no | Keys of other entries **in the same group**. They render as chips that open that entry. A key that does not exist fails the build. |
| `aliases` | no | Old keys this entry still answers to. Use when renaming (§4.5). |
| `app` | no | `false` keeps the entry on the docs page but out of the app. Missing means included. |

Keys follow `<kind>.<slug>` in lowercase letters, digits and hyphens (`metric.connections`, `table.detected-chains`, `page.overview`).

Ignore the old `"figure"` field on a few blocking-chains entries: the compiler no longer reads it.

### The entry `.md`

No frontmatter. The first paragraph is the one-sentence lead, followed by titled sections. Real example (`dashboard/metric.connections.md`):

```markdown
How many client connections are open across the selected instances at this moment.

### How it's calculated

- Served by `GET /api/v1/metrics/connections` — a **point-in-time snapshot**, not a series over the topbar time window.
- ...

### Reading it

Treat this as current load on the estate. ...
```

House conventions: a one-sentence lead that answers "what is this", then `### How it's calculated`, then `### Reading it`. Tables add `### Columns`; per-engine sources add `### Source by engine`. Write for a DBA: technical, precise and verifiable; see `Logstag Documentation persona.md` at the repo root. Most entries run 70–400 words.

### What Markdown is allowed

The panel renders a small, safe subset. The compiler **fails the build** on anything else, except for the two silent cases marked ⚠.

| Use | Renders as |
|---|---|
| First paragraph | lead text |
| More paragraphs | body text |
| `##`, `###` or `####` heading | small section label (`#` and `#####` fail) |
| Bullet or numbered list | dot bullets (⚠ numbers are not kept) |
| List where **every** item is `**Term** — definition` (spaced em dash) | two-column definition list; keep terms short, long terms wrap badly |
| Table whose first header cell is exactly `Engine` (`\| Engine \| Source \|`) | per-engine rows (⚠ columns after the second are ignored) |
| `> **Tip:** ...` | tip callout (the blockquote must start with `**Tip:**`) |
| `**bold**`, `*italic*`, `` `code` ``, links | inline formatting |
| A paragraph that is only an image, under `### Example` | figure (§4.6) |

Not allowed: nested (indented) lists, code fences, other tables, horizontal rules, raw HTML, inline images, `<br>`, and links to hosts other than `docs.logstag.com`, `logstag.com`, `www.logstag.com` and `app.logstag.com`. Root-relative links (`/product-guides/...`) are fine.

> ⚠ **Nested lists are dropped silently.** Sub-bullets vanish from the panel while the docs page still shows them. Write a flat list, or use a definition list instead.

Because `.md` files are compiled as MDX by Docusaurus, keep `{`, `}` and `<` inside backticks.

### The routed docs page

Each group has one `.mdx` page at the path in `docsPage`. It imports every partial and puts it under a heading whose id equals the entry's `anchor`:

```mdx
import Instances from './_explain/dashboard/metric.instances.md';

## Instances {#instances}

<Instances />
```

Headings on the `.mdx` are **not** generated from `_meta.json` titles. A title change is two edits.

---

## 3. Find the file for something you see in the app

Open the panel. Its last line reads `Source: logstag-docs · docs/product-guides/_explain/...md`, and that is the file to edit.

From an id such as `alerts.detail#metric.occurrences`, find the `_meta.json` whose `"group"` is `alerts.detail` (`_explain/alerts/detail/`). The file is `metric.occurrences.md` next to it.

---

## 4. Common tasks

All content changes follow the same path: branch, edit, `npm run build`, PR to `main`, merge. The deploy is automatic. There is no PR check in this repo, so **run `npm run build` locally before opening the PR.** It runs the compiler, and a compiler error on `main` stops the deploy (the previous version stays live).

Branch names in use: `LGSTG-<ticket>-fix(Short-Description)` or `-feat(...)`.

### 4.1 Fix a typo or reword an entry (docs only)

1. Find the file (§3).
2. Edit the text you need:
   - Body text: edit the `.md`.
   - Title or category: edit `_meta.json`.
   - The same wording in the `.mdx` heading or page intro: edit it there too.
3. `npm run build`, PR, merge.

Do not rename a heading on the `.mdx` without updating `anchor`, or the "Open documentation" link stops landing on the section.

### 4.2 Update an entry after a product change

1. Find every affected entry, e.g. `grep -rn "metrics/connections" docs/product-guides/_explain`. Partials cite endpoints and field names.
2. Update "How it's calculated" and "Reading it". Keep the lead to one sentence and stay inside the Markdown subset.
3. Update prose on the routed `.mdx` that is not a partial, such as intro paragraphs and per-engine tables, in the same PR.
4. If the surface itself was added or removed in the product, follow §4.3 or §4.5 as well.

Content-only changes never need a frontend or backend release.

### 4.3 Add an entry to a page that already has help

**Docs (ship first):**

1. Create `docs/product-guides/_explain/<group dir>/<kind>.<slug>.md`.
2. Add the entry to that folder's `_meta.json`: `file`, `kind`, `title`, `anchor`, `related`, `"app": true`. Add the new key to siblings' `related` if useful.
3. On the routed `.mdx`, add the `import`, a heading with `{#<slug>}` matching `anchor`, and the component.
4. `npm run build`, PR, merge.

**Frontend (logstag-frontend, branch `dev`):**

5. Append the key to `HELP_KEYS["<group>"]` in `lib/help/help-keys.ts`.
6. Mount the trigger:

| Surface | How |
|---|---|
| KPI card / tile | `labelSuffix={<HelpTrigger id="group#metric.x" />}` on `MetricCard` / `MetricTile` |
| Chart card | `titleSuffix={<HelpTrigger id="..." />}` (MetricTrendCard, HealthRingCard, AlertsListCard …) |
| Page header | `PageHeader badge={<HelpTrigger id="group#page.overview" />}`; wrap the header in `data-help-anchor=""` |
| Table or section | inline `<HelpTrigger />` beside the title; wrap the card in `data-help-anchor=""` so it is outlined while open |

   Placement rules:
   - Never put a trigger inside a table header cell (`<th>`).
   - Write the id as one string literal (`"group#key"`) so `check:help` can find it.
   - Do not pass component references from a Server Component to a Client Component (the `rsc-smoke` CI job catches this).

7. Run `npm run typecheck`, `npm run lint` and `npm run test:run`, then open a PR to `dev`. An id missing from `HELP_KEYS` fails typecheck.
8. Trigger the frontend dev build and deploy (both are manual), then the prod build and deploy when releasing.

Order: docs first is the clean path. Frontend first is safe for users (the trigger stays hidden until the entry exists), but a missing **group** logs a Sentry warning per session.

### 4.4 Cover a new page (new group)

1. Create a folder `docs/product-guides/_explain/<path>/` with `_meta.json` (`group`, `category`, `docsPage`, `entries`) and the partials. No registration: the compiler finds any folder with a `_meta.json` and adds it to `index.json`.
2. Create the routed `.mdx` at the path in `docsPage`. Give it frontmatter `title`, `sidebar_label` and `description`, the single-source intro sentence the other pages use, the imports and the headings. **Add it to `sidebars.ts`**, which is explicit, not autogenerated.
3. Frontend: add the group and its keys to `HELP_KEYS` and mount the triggers. The page-level entry `page.overview` (`anchor: ""`) goes in `PageHeader badge`.
4. Ship and verify as in §4.3 and §5.

Recent examples: Dashboard (LGSTG-1625), Data Inventory (LGSTG-1628), Insights (LGSTG-1629), and Assets, Users and Audit Logs (LGSTG-1630).

### 4.5 Rename or remove an entry

**Rename a key:**

1. Docs changes:
   - Rename the file and the key in `_meta.json`.
   - Update every sibling `related` that names it (the build fails otherwise).
   - Update the `.mdx` import.
   - Add `"aliases": ["<old key>"]` to the renamed entry, so frontends already deployed with the old id keep working.
2. Frontend: change the key in `HELP_KEYS` and the mounted id. Typecheck flags any stale id.
3. Remove the alias once every environment runs the new frontend. Keys are append-only by convention, so never rename without an alias.

**Remove an entry:**

- Cleanest is frontend first: remove the trigger and the key, and deploy. Then remove the partial, the `_meta.json` entry, the `.mdx` import and heading, and any `related` references. Deleting a partial the `.mdx` still imports fails the docs build.
- To hide it from the app but keep it on the docs page, set `"app": false` and remove it from other entries' `related`.
- Docs first also works. The deployed trigger just disappears (no error), and `check:help` reports a `missing-key`.

### 4.6 Add a figure

1. Create an SVG that:
   - starts with `<svg` (no XML prolog, comment or BOM before it);
   - declares integer `width="…"` and `height="…"`;
   - uses colors that work on light and dark backgrounds;
   - has `role="img"` and an `aria-label`.

   PNG and JPG are not supported. See `static/img/explain/activity-explorer/blocking-chains/cycle.svg`.
2. Save it under `static/img/explain/<group path>/<name>.svg`.
3. In the partial:

   ```markdown
   ### Example

   ![What the diagram shows](/img/explain/<group path>/<name>.svg)

   *One-sentence italic caption.*
   ```

   The `### Example` heading is not shown; the figure takes its place. The docs page shows the same SVG.

### 4.7 Preview locally before a PR

In logstag-docs (Node 20+):

```bash
npm ci
npm run explain -- --docs-origin http://localhost:3111
npm run docusaurus -- start --port 3111
```

- Use `npm run docusaurus -- start` rather than `npm start`. `npm start` recompiles without `--docs-origin`, so deep links point at the live site.
- There is no file watcher for the registry. Re-run `npm run explain -- --docs-origin http://localhost:3111` after each edit.
- The registry is at `http://localhost:3111/explain/v1/index.json`.

In logstag-frontend, point the app at your local registry through `.env.local`, then restart `npm run dev`:

```bash
NEXT_PUBLIC_HELP_REGISTRY_ORIGIN=http://localhost:3111
NEXT_PUBLIC_HELP_PANEL_ENABLED=1   # forces the panel on without the backend flag
```

Check keys against the local registry:

```bash
HELP_REGISTRY_ORIGIN=http://localhost:3111 npm run check:help
```

---

## 5. Verify after shipping

1. **Deploy.** The latest "Deploy to GitHub Pages" run on `main` is green (`gh run list -R techmindpartners/logstag-docs --limit 3`).
2. **Registry.** In `https://docs.logstag.com/explain/v1/index.json`, `generatedAt` is after your merge and `enabled` is `true`. `.../<group>.json` contains your entry's text.
3. **Deep link.** Open the entry's `docsUrl`; it must land on the right section, and nothing else checks this (§6).
4. **Coverage.** In logstag-frontend, `npm run check:help` should end with `TOTAL findings: 0` once both sides have shipped. Add `-- --strict` for a hard pass/fail.
   - `missing-key`: the app mounts an id the docs do not publish, so the trigger is invisible.
   - `unreferenced-entry` / `unreferenced-group`: the docs publish something the app does not mount yet. That's normal when docs ship first.
   - `declared-but-unmounted`: a key in `HELP_KEYS` has no trigger in the code.

   The CI job `help-coverage` runs this on every frontend PR but is **non-blocking** (warnings only).
5. **In the app.** As a user of an organization with `helpPanel: true`, hard-reload the page, click the book icon, and check the title, sections, Related chips, the Source line and "Open documentation".
6. **Errors.** The frontend reports registry problems to Sentry as warnings starting with `help-registry <group>:` (`fetch failed`, `HTTP <status>`, `schema mismatch`). A missing key reports nothing.

---

## 6. Things nothing checks for you

| Gap | What goes wrong | What to do |
|---|---|---|
| `anchor` vs the `.mdx` heading id | "Open documentation" lands on the page top instead of the section | Match `{#id}` to `anchor` and click the link after deploy |
| `kind` value | A typo shows a wrong badge | Use `metric`, `chart`, `table`, `section` or `page` |
| Nested lists | Sub-bullets disappear from the panel | Flat lists only |
| Every partial imported by its `.mdx` | Entry exists in the app but not on the docs site | Add the import + heading in the same PR |
| Frontend keys vs published entries | Trigger silently missing | Run `check:help` after both sides ship |
| New block or inline types | A new Markdown feature needs compiler + frontend schema + renderer changes; until the frontend ships, the whole group fails to parse and **all** of its triggers disappear | Coordinate with the frontend before extending the subset |

---

## 7. Turning the panel off or limiting it

From widest to narrowest:

1. **Registry kill switch, no backend or frontend deploy.** Set `docs/product-guides/_explain/config.json` to `{ "enabled": false }` and merge. After deploy and caches, every trigger disappears for everyone.
2. **Backend, all organizations.** Set the GitHub environment variable `HELPPANEL__ENABLED=false` (environments `DEV_DO` / `PROD_DO` in logstag-backend) and redeploy the API. The app picks it up within about 5 minutes.
3. **Only selected organizations.** Set `HELPPANEL__ENABLED=false` plus `HELPPANEL__ENABLEDORGANIZATIONIDS=<org-guid>,<org-guid>`, then redeploy.

> **Clearing a variable does not turn it off.** The deploy workflows fall back to `true` when a variable is empty or missing. To switch off, set `false` explicitly. To empty the allowlist, set a non-GUID such as `none`.

There is no per-entry switch other than `"app": false`.

---

## 8. Reference

| What | Where |
|---|---|
| Compiler, and the Markdown subset in its header comment | `scripts/build-explain.mjs` (this repo) |
| Registry kill switch | `docs/product-guides/_explain/config.json` |
| Writing voice | `Logstag Documentation persona.md` |
| Deploy | `.github/workflows/deploy.yml` ("Deploy to GitHub Pages") |
| Key contract | logstag-frontend `lib/help/help-keys.ts` |
| Registry fetch, cache, Sentry | logstag-frontend `lib/help/use-help-registry.ts`, `lib/help/registry-schema.ts` |
| Trigger and panel | logstag-frontend `components/help/help-trigger.tsx`, `components/help/help-panel.tsx` |
| Coverage check | logstag-frontend `scripts/check-help-coverage.ts` (`npm run check:help`); CI job `help-coverage` |
| Local env vars | logstag-frontend `.env.example` |
| Organization gate | logstag-backend `src/Logstag.App/Configuration/HelpPanelSettings.cs`; `GET /api/v1/features`; `HELPPANEL__*` in `.github/workflows/deploy.{dev,prod}.do.yml` |
