/**
 * check-style.mjs — fail when docs contain em dashes (U+2014) or en dashes
 * (U+2013) outside fenced code blocks and inline code spans. Scans every
 * docs/**\/*.md, *.mdx (front matter included) and _meta.json, plus the
 * help-panel figures (static/img/explain/**\/*.svg, whole file).
 *
 * Usage: node scripts/check-style.mjs [root ...]   (default: docs static/img/explain)
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";

const DASH = /[\u2013\u2014]/;
const HINT = `use a period, comma, colon or parentheses; see 'Writing style' in Logstag Documentation persona.md`;

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (/\.(mdx?|svg)$/.test(name) || name === "_meta.json") yield p;
  }
}

/** Blank out inline code spans (any backtick-run length) so their dashes are ignored. */
function stripInlineCode(line) {
  return line.replace(/(`+)(.+?)\1(?!`)/g, "");
}

/** Return the offending lines of one file as [lineNumber, text]. */
function findOffenders(text, isMarkdown) {
  const hits = [];
  let fence = null; // the opening fence marker while inside a fenced block
  text.split(/\r?\n/).forEach((line, i) => {
    if (isMarkdown) {
      const m = line.match(/^\s*(`{3,}|~{3,})/);
      if (fence) {
        if (m && m[1][0] === fence[0] && m[1].length >= fence.length) fence = null;
        return;
      }
      if (m) { fence = m[1]; return; }
    }
    if (DASH.test(isMarkdown ? stripInlineCode(line) : line)) hits.push([i + 1, line.trim()]);
  });
  return hits;
}

export function checkStyle(roots = ["docs", "static/img/explain"]) {
  const offenders = [];
  const files = roots.filter((r) => existsSync(r)).flatMap((r) => [...walk(resolve(r))]);
  for (const file of files) {
    const isMarkdown = /\.mdx?$/.test(file);
    for (const [line, text] of findOffenders(readFileSync(file, "utf8"), isMarkdown)) {
      const snippet = text.length > 100 ? text.slice(0, 100) + "…" : text;
      const path = relative(process.cwd(), file).split("\\").join("/");
      offenders.push(`${path}:${line}: ${snippet}`);
    }
  }
  if (offenders.length > 0) {
    throw new Error(`style check failed: ${offenders.length} em/en dash(es) outside code\n${offenders.join("\n")}\nHint: ${HINT}`);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    checkStyle(process.argv.length > 2 ? process.argv.slice(2) : undefined);
    console.log("style check passed");
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}
