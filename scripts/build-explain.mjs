/**
 * build-explain.mjs — compile "Explain this" content partials into a panel registry.
 *
 * Source of truth: content-only markdown partials (Docusaurus `_` partial
 * convention) plus a `_meta.json` sidecar per folder holding key, kind,
 * title, category, figure, anchor, related[] — partials must not carry
 * frontmatter (Docusaurus warns).
 * Output:
 *   1. explain-registry.json — what the app would bundle (or the docs site
 *      would emit as static JSON for runtime fetching).
 *   2. Optionally injects the registry into the pilot HTML (--inject <file>).
 *
 * In the real setup this script lives in logstag-docs/scripts/ and the FE CI
 * (or the docs deploy workflow) runs it. The transform maps a constrained
 * markdown subset onto the panel's typography classes:
 *   first <p>            → .xp-lead
 *   ## Heading           → .xp-h        (## Example additionally mounts the figure)
 *   - list               → .xp-list
 *   - **Term** — def     → .xp-dl rows  (definition list)
 *   > **Tip:** …         → .xp-tip callout
 *   | Engine | … | table → .xp-engines rows
 *   `code`               → code.tk
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { marked } from "marked";

// Usage: node build-explain.mjs [partialsDir] [--inject <html file>]
const argv = process.argv.slice(2);
const injectIdx = argv.indexOf("--inject");
const injectTarget = injectIdx !== -1 ? argv[injectIdx + 1] : null;
const positional = argv.filter((a, i) => i !== injectIdx && i !== injectIdx + 1);
const PARTIALS_DIR = resolve(
  positional[0] ??
    new URL("./partials/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")
);
const STATIC_DIR = resolve(PARTIALS_DIR, "../../../../../static");
const DOCS_ORIGIN = "https://docs.logstag.com";
const SOURCE_PREFIX = "docs/product-guides/_explain/activity-explorer/blocking-chains/";

marked.setOptions({ gfm: true });

/* ── markdown → panel HTML ── */
function transform(md, fm) {
  let html = marked.parse(md).trim();

  // inline code → token chip
  html = html.replaceAll("<code>", '<code class="tk">');

  // headings (h2–h4) → panel section labels; "Example" mounts the figure slot
  html = html.replace(/<h([234])[^>]*>(.*?)<\/h\1>/g, (m, lvl, text) => {
    const label = `<div class="xp-h">${text}</div>`;
    if (text.trim().toLowerCase() === "example" && fm.figure) {
      return `${label}\n<div class="xp-fig" data-figure="${fm.figure}"></div>`;
    }
    return label;
  });

  // an italic-only paragraph right after the figure slot is docs-site fallback
  // text ("shown in the in-app panel") — the live figure replaces it here
  html = html.replace(/(<div class="xp-fig"[^>]*><\/div>)\s*<p><em>[\s\S]*?<\/em><\/p>/g, "$1");

  // figure images from the docs static dir: `![alt](/img/…)` followed by an
  // optional italic caption. The SVG file is inlined so the panel shows the
  // exact asset the docs site serves; the caption renders on both surfaces.
  html = html.replace(
    /<p><img src="(\/img\/[^"]+\.svg)" alt="[^"]*"\s*\/?><\/p>(?:\s*<p><em>([\s\S]*?)<\/em><\/p>)?/g,
    (m, src, cap) => {
      const svg = readFileSync(join(STATIC_DIR, src), "utf8").trim();
      const caption = cap ? `<div class="xp-figcap">${cap}</div>` : "";
      return `<div class="xp-fig xp-fig-img">${svg}${caption}</div>`;
    }
  );

  // engine tables → xp-engines rows
  html = html.replace(/<table>[\s\S]*?<\/table>/g, (tbl) => {
    const headers = [...tbl.matchAll(/<th>(.*?)<\/th>/g)].map((m) => m[1]);
    if (headers[0] !== "Engine") return tbl;
    const rows = [...tbl.matchAll(/<tr>\s*<td>([\s\S]*?)<\/td>\s*<td>([\s\S]*?)<\/td>\s*<\/tr>/g)]
      .map(([, eng, src]) => `<div class="row"><span class="eng">${eng.trim()}</span><span>${src.trim()}</span></div>`)
      .join("");
    return `<div class="xp-engines">${rows}</div>`;
  });

  // definition-style lists (every item "**Term** — definition") → xp-dl
  html = html.replace(/<ul>[\s\S]*?<\/ul>/g, (ul) => {
    const items = [...ul.matchAll(/<li>([\s\S]*?)<\/li>/g)].map((m) => m[1].trim());
    const defs = items.map((it) => it.match(/^<strong>(.+?)<\/strong>\s*—\s*([\s\S]+)$/));
    if (items.length && defs.every(Boolean)) {
      const rows = defs
        .map((d) => `<div class="row"><span class="k">${d[1]}</span><span class="v">${d[2]}</span></div>`)
        .join("");
      return `<div class="xp-dl">${rows}</div>`;
    }
    return ul.replace("<ul>", '<ul class="xp-list">');
  });

  // tip blockquote → callout (icon injected by the app)
  html = html.replace(
    /<blockquote>\s*<p><strong>Tip:<\/strong>\s*([\s\S]*?)<\/p>\s*<\/blockquote>/g,
    '<div class="xp-tip"><span class="xp-tip-ic"></span><span>$1</span></div>'
  );

  // first paragraph → lead
  html = html.replace("<p>", '<p class="xp-lead">');

  return html;
}

/* ── read partials (content-only .md + _meta.json sidecar) ── */
const meta = JSON.parse(readFileSync(join(PARTIALS_DIR, "_meta.json"), "utf8"));
const titleOf = Object.fromEntries(
  Object.entries(meta.entries).map(([k, e]) => [k, e.title])
);

const registry = {};
for (const [key, e] of Object.entries(meta.entries)) {
  for (const req of ["file", "kind", "title"]) {
    if (!e[req]) throw new Error(`_meta.json#${key}: missing field "${req}"`);
  }
  for (const r of e.related ?? []) {
    if (!titleOf[r]) throw new Error(`_meta.json#${key}: related key "${r}" does not exist`);
  }
  const content = readFileSync(join(PARTIALS_DIR, e.file), "utf8");
  registry[key] = {
    category: meta.category,
    kind: e.kind[0].toUpperCase() + e.kind.slice(1),
    title: e.title,
    figure: e.figure ?? null,
    docs: DOCS_ORIGIN + meta.docsPage + (e.anchor ?? ""),
    related: (e.related ?? []).map((k) => [k, titleOf[k]]),
    source: SOURCE_PREFIX + e.file,
    bodyHtml: transform(content, e),
  };
}

const json = JSON.stringify(registry, null, 2);
writeFileSync(resolve("explain-registry.json"), json);
console.log(`registry: ${Object.keys(registry).length} entries → ${resolve("explain-registry.json")}`);

/* ── optional: inject into the pilot HTML ── */
if (injectTarget) {
  const target = injectTarget;
  let html = readFileSync(target, "utf8");
  const START = "/*__EXPLAIN_REGISTRY__*/";
  const END = "/*__END_EXPLAIN_REGISTRY__*/";
  const replacement = `const HELP = ${START} ${json} ${END};`;
  const before = html;
  if (html.includes(START)) {
    html = html.replace(
      new RegExp(`const HELP = ${START.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&")}[\\s\\S]*?${END.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&")};`),
      replacement
    );
  } else {
    // first run: swap out the hand-written literal (tolerate CRLF endings)
    html = html.replace(/const HELP = \{[\s\S]*?\};\r?\n\r?\n(\/\* ─── explain panel behavior)/, `${replacement}\n\n$1`);
  }
  if (html === before) throw new Error(`inject: no HELP block matched in ${target}`);
  writeFileSync(target, html);
  console.log(`injected registry into ${target}`);
}
