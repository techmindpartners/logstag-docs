/**
 * build-explain.mjs — compile "Explain this" (HelpPanel) content into the
 * registry the dashboard fetches at runtime.
 *
 * Source of truth (per page group):
 *   docs/…/_explain/<group>/ (any depth)
 *     _meta.json   — group, category, docsPage, entries{key → file, kind,
 *                    title, anchor, related[], aliases[], app}
 *     *.md         — content-only markdown partials (no frontmatter);
 *                    the docs site embeds them via MDX imports
 *   docs/product-guides/_explain/config.json — { "enabled": bool } registry
 *                    kill switch, stamped into every emitted file
 *
 * Output (--out, default static/explain/v1 so `docusaurus build`/`start`
 * ship it with the site):
 *   <group>.json   — schemaVersion, enabled, group, category, docsPage,
 *                    entries{key → …, blocks[]}
 *   index.json     — group listing
 *   schema.json    — JSON Schema for group files (the FE contract)
 *
 * Content is emitted as TYPED BLOCKS, not HTML — the app renders them as
 * React components, so runtime-fetched content can never inject markup.
 * Inline text is a token list: text / b / i / code / a. Link and figure
 * URLs must resolve to an allowlisted host or the build fails.
 *
 * Markdown subset per partial:
 *   first paragraph        → lead
 *   ### Heading            → section          (h2–h4 accepted)
 *   ### Example            → figure slot: next `![alt](/img/….svg)` becomes
 *                            the figure; an italic paragraph after it is the
 *                            shared caption
 *   - list                 → list
 *   - **Term** — def       → dl (definition rows) when every item matches
 *   | Engine | … | table   → engines rows
 *   > **Tip:** …           → tip callout
 *
 * Usage:
 *   node scripts/build-explain.mjs [--out <dir>] [--docs-origin <url>]
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync, statSync } from "node:fs";
import { join, resolve, basename } from "node:path";
import { marked } from "marked";

/* ── CLI ── */
const argv = process.argv.slice(2);
function takeFlag(name) {
  const i = argv.indexOf(name);
  if (i === -1) return null;
  const value = argv[i + 1];
  argv.splice(i, 2);
  return value;
}
const DOCS_ORIGIN = (takeFlag("--docs-origin") ?? "https://docs.logstag.com").replace(/\/$/, "");
const OUT_DIR = resolve(takeFlag("--out") ?? "static/explain/v1");
const DOCS_ROOT = resolve("docs");
const STATIC_ROOT = resolve("static");
const SCHEMA_VERSION = 1;

const originHost = new URL(DOCS_ORIGIN).host;
const ALLOWED_HOSTS = new Set([originHost, "docs.logstag.com", "logstag.com", "www.logstag.com", "app.logstag.com"]);

function assertAllowedUrl(url, where) {
  const host = new URL(url).host;
  if (!ALLOWED_HOSTS.has(host)) {
    throw new Error(`${where}: host "${host}" is not allowlisted (${url})`);
  }
  return url;
}

/* ── discover groups: any dir under an _explain folder with a _meta.json ── */
function findGroups(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (!statSync(p).isDirectory()) continue;
    if (existsSync(join(p, "_meta.json"))) acc.push(p);
    findGroups(p, acc);
  }
  return acc;
}
const explainRoots = [];
(function findExplainRoots(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (!statSync(p).isDirectory()) continue;
    if (name === "_explain") explainRoots.push(p);
    else findExplainRoots(p);
  }
})(DOCS_ROOT);
const groupDirs = explainRoots.flatMap((r) => findGroups(r));
if (groupDirs.length === 0) throw new Error("no _explain groups found");

/* ── registry kill switch ── */
const configPath = join(DOCS_ROOT, "product-guides", "_explain", "config.json");
const ENABLED = existsSync(configPath)
  ? JSON.parse(readFileSync(configPath, "utf8")).enabled !== false
  : true;

/* ── inline tokens ── */
function flattenText(tokens) {
  let out = "";
  for (const t of tokens ?? []) {
    if (t.tokens) out += flattenText(t.tokens);
    else out += t.text ?? "";
  }
  return out;
}
function toInlines(tokens, ctx) {
  const out = [];
  for (const t of tokens ?? []) {
    switch (t.type) {
      case "text":
        if (t.tokens) out.push(...toInlines(t.tokens, ctx));
        else if (t.text) out.push({ t: "text", v: t.text });
        break;
      case "strong": out.push({ t: "b", v: flattenText(t.tokens) }); break;
      case "em":     out.push({ t: "i", v: flattenText(t.tokens) }); break;
      case "codespan": out.push({ t: "code", v: t.text }); break;
      case "link": {
        const href = t.href.startsWith("/") ? DOCS_ORIGIN + t.href : t.href;
        assertAllowedUrl(href, `${ctx}: link`);
        out.push({ t: "a", href, v: flattenText(t.tokens) });
        break;
      }
      case "escape": out.push({ t: "text", v: t.text }); break;
      default:
        throw new Error(`${ctx}: unsupported inline token "${t.type}"`);
    }
  }
  return out;
}

/* ── svg intrinsic size ── */
function svgSize(localPath, where) {
  const svg = readFileSync(localPath, "utf8");
  const w = svg.match(/^<svg[^>]*\bwidth="(\d+)"/)?.[1];
  const h = svg.match(/^<svg[^>]*\bheight="(\d+)"/)?.[1];
  if (!w || !h) throw new Error(`${where}: SVG must declare width/height attributes (${localPath})`);
  return { width: Number(w), height: Number(h) };
}

/* ── markdown → blocks ── */
function toBlocks(md, ctx) {
  const tokens = marked.lexer(md);
  const blocks = [];
  let sawLead = false;
  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];
    switch (tok.type) {
      case "space": break;
      case "heading": {
        if (tok.depth < 2 || tok.depth > 4) throw new Error(`${ctx}: h${tok.depth} not allowed`);
        const title = flattenText(tok.tokens);
        if (/^example$/i.test(title.trim())) break; // the figure carries the section
        blocks.push({ type: "section", title });
        break;
      }
      case "paragraph": {
        const inner = tok.tokens ?? [];
        if (inner.length === 1 && inner[0].type === "image") {
          const img = inner[0];
          const src = img.href.startsWith("/") ? DOCS_ORIGIN + img.href : img.href;
          assertAllowedUrl(src, `${ctx}: figure`);
          if (!img.href.startsWith("/img/")) throw new Error(`${ctx}: figures must live under /img/ (${img.href})`);
          const { width, height } = svgSize(join(STATIC_ROOT, img.href), ctx);
          let caption;
          // optional italic caption paragraph right after the image
          for (let j = i + 1; j < tokens.length; j++) {
            if (tokens[j].type === "space") continue;
            const nx = tokens[j].tokens ?? [];
            if (tokens[j].type === "paragraph" && nx.length === 1 && nx[0].type === "em") {
              caption = flattenText(nx[0].tokens);
              i = j;
            }
            break;
          }
          blocks.push({ type: "figure", src, alt: img.text ?? "", width, height, ...(caption ? { caption } : {}) });
          break;
        }
        const inlines = toInlines(inner, ctx);
        if (!sawLead) { blocks.push({ type: "lead", inlines }); sawLead = true; }
        else blocks.push({ type: "p", inlines });
        break;
      }
      case "list": {
        const items = tok.items.map((it) => toInlines(it.tokens?.[0]?.tokens ?? it.tokens, ctx));
        const asDl = items.map((inls) => {
          if (inls[0]?.t !== "b") return null;
          const rest = inls.slice(1);
          if (rest[0]?.t !== "text" || !rest[0].v.startsWith(" — ")) return null;
          return { term: inls[0].v, def: [{ t: "text", v: rest[0].v.slice(3) }, ...rest.slice(1)] };
        });
        if (items.length > 0 && asDl.every(Boolean)) blocks.push({ type: "dl", rows: asDl });
        else blocks.push({ type: "list", items });
        break;
      }
      case "table": {
        const header = flattenText(tok.header[0].tokens);
        if (header !== "Engine") throw new Error(`${ctx}: only "Engine | Source" tables are supported`);
        const rows = tok.rows.map((cells) => ({
          engine: flattenText(cells[0].tokens),
          source: toInlines(cells[1].tokens, ctx),
        }));
        blocks.push({ type: "engines", rows });
        break;
      }
      case "blockquote": {
        const para = (tok.tokens ?? []).find((t) => t.type === "paragraph");
        const inner = para?.tokens ?? [];
        if (inner[0]?.type !== "strong" || !/^tip:$/i.test(flattenText(inner[0].tokens).trim())) {
          throw new Error(`${ctx}: blockquotes must start with **Tip:**`);
        }
        const rest = toInlines(inner.slice(1), ctx);
        if (rest[0]?.t === "text") rest[0] = { t: "text", v: rest[0].v.replace(/^\s+/, "") };
        blocks.push({ type: "tip", inlines: rest });
        break;
      }
      default:
        throw new Error(`${ctx}: unsupported block token "${tok.type}"`);
    }
  }
  if (!sawLead) throw new Error(`${ctx}: partial must start with a lead paragraph`);
  return blocks;
}

/* ── build groups ── */
mkdirSync(OUT_DIR, { recursive: true });
const generatedAt = new Date().toISOString();
const indexGroups = [];

for (const dir of groupDirs) {
  const meta = JSON.parse(readFileSync(join(dir, "_meta.json"), "utf8"));
  for (const req of ["group", "category", "docsPage", "entries"]) {
    if (!meta[req]) throw new Error(`${dir}/_meta.json: missing "${req}"`);
  }
  const appEntries = Object.entries(meta.entries).filter(([, e]) => e.app !== false);
  const titleOf = Object.fromEntries(appEntries.map(([k, e]) => [k, e.title]));

  const entries = {};
  for (const [key, e] of appEntries) {
    for (const req of ["file", "kind", "title"]) {
      if (!e[req]) throw new Error(`${meta.group}#${key}: missing "${req}"`);
    }
    const ctx = `${meta.group}#${key}`;
    for (const r of e.related ?? []) {
      if (!titleOf[r]) throw new Error(`${ctx}: related key "${r}" missing or app:false`);
    }
    const md = readFileSync(join(dir, e.file), "utf8");
    const docsUrl = assertAllowedUrl(DOCS_ORIGIN + meta.docsPage + (e.anchor ?? ""), ctx);
    entries[key] = {
      key,
      kind: e.kind,
      title: e.title,
      docsUrl,
      source: join(dir, e.file).replace(/\\/g, "/").split("/docs/").pop().replace(/^/, "docs/"),
      ...(e.aliases?.length ? { aliases: e.aliases } : {}),
      related: (e.related ?? []).map((k) => ({ key: k, title: titleOf[k] })),
      blocks: toBlocks(md, ctx),
    };
  }

  const file = {
    schemaVersion: SCHEMA_VERSION,
    enabled: ENABLED,
    generatedAt,
    group: meta.group,
    category: meta.category,
    docsPage: DOCS_ORIGIN + meta.docsPage,
    entries,
  };
  writeFileSync(join(OUT_DIR, `${meta.group}.json`), JSON.stringify(file, null, 2) + "\n");
  indexGroups.push({ group: meta.group, category: meta.category, path: `${meta.group}.json`, entries: Object.keys(entries).length });
  console.log(`group ${meta.group}: ${Object.keys(entries).length} entries`);
}

writeFileSync(join(OUT_DIR, "index.json"), JSON.stringify({
  schemaVersion: SCHEMA_VERSION, enabled: ENABLED, generatedAt, groups: indexGroups,
}, null, 2) + "\n");

/* ── FE contract ── */
const inlineSchema = {
  type: "object",
  oneOf: [
    { properties: { t: { const: "text" }, v: { type: "string" } }, required: ["t", "v"], additionalProperties: false },
    { properties: { t: { const: "b" }, v: { type: "string" } }, required: ["t", "v"], additionalProperties: false },
    { properties: { t: { const: "i" }, v: { type: "string" } }, required: ["t", "v"], additionalProperties: false },
    { properties: { t: { const: "code" }, v: { type: "string" } }, required: ["t", "v"], additionalProperties: false },
    { properties: { t: { const: "a" }, v: { type: "string" }, href: { type: "string" } }, required: ["t", "v", "href"], additionalProperties: false },
  ],
};
const inlines = { type: "array", items: inlineSchema };
const schema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "Logstag HelpPanel registry group file",
  type: "object",
  required: ["schemaVersion", "enabled", "group", "category", "entries"],
  properties: {
    schemaVersion: { const: 1 },
    enabled: { type: "boolean" },
    generatedAt: { type: "string" },
    group: { type: "string" },
    category: { type: "string" },
    docsPage: { type: "string" },
    entries: {
      type: "object",
      additionalProperties: {
        type: "object",
        required: ["key", "kind", "title", "docsUrl", "blocks"],
        properties: {
          key: { type: "string" },
          kind: { enum: ["metric", "table", "page", "chart", "section"] },
          title: { type: "string" },
          docsUrl: { type: "string" },
          source: { type: "string" },
          aliases: { type: "array", items: { type: "string" } },
          related: { type: "array", items: { type: "object", required: ["key", "title"], properties: { key: { type: "string" }, title: { type: "string" } } } },
          blocks: {
            type: "array",
            items: {
              type: "object",
              oneOf: [
                { properties: { type: { const: "lead" }, inlines }, required: ["type", "inlines"] },
                { properties: { type: { const: "p" }, inlines }, required: ["type", "inlines"] },
                { properties: { type: { const: "section" }, title: { type: "string" } }, required: ["type", "title"] },
                { properties: { type: { const: "list" }, items: { type: "array", items: inlines } }, required: ["type", "items"] },
                { properties: { type: { const: "dl" }, rows: { type: "array", items: { type: "object", required: ["term", "def"], properties: { term: { type: "string" }, def: inlines } } } }, required: ["type", "rows"] },
                { properties: { type: { const: "engines" }, rows: { type: "array", items: { type: "object", required: ["engine", "source"], properties: { engine: { type: "string" }, source: inlines } } } }, required: ["type", "rows"] },
                { properties: { type: { const: "tip" }, inlines }, required: ["type", "inlines"] },
                { properties: { type: { const: "figure" }, src: { type: "string" }, alt: { type: "string" }, width: { type: "number" }, height: { type: "number" }, caption: { type: "string" } }, required: ["type", "src", "alt", "width", "height"] },
              ],
            },
          },
        },
      },
    },
  },
};
writeFileSync(join(OUT_DIR, "schema.json"), JSON.stringify(schema, null, 2) + "\n");
console.log(`registry → ${OUT_DIR} (${indexGroups.length} groups, enabled=${ENABLED})`);
