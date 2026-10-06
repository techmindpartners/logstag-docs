/**
 * build-llms-full.mjs — concatenate every docs page into static/llms-full.txt
 * so AI assistants can read the whole documentation in one request
 * (https://llmstxt.org). static/llms.txt is the hand-written index.
 *
 * Pages are emitted in sidebar order, followed by any doc that is not in the
 * sidebar. sidebars.ts is read as text, not imported: the deploy runs Node 20,
 * which cannot load TypeScript. Every quoted string in it that names a doc id
 * counts, in order of appearance. For each page:
 *   - frontmatter is parsed with gray-matter (the parser Docusaurus uses) and
 *     dropped; its `title` (or the first `# ` heading) is used
 *   - `import X from '…/_explain/….md'` partials are inlined where `<X />` is
 *   - relative .md/.mdx links, root-relative links/images and relative links
 *     into static/ become absolute https://docs.logstag.com URLs. Any other
 *     relative link is left as is with a warning: Docusaurus content-hashes
 *     co-located images, so they have no stable URL; move them to static/.
 * Code fences are passed through untouched.
 *
 * Usage:
 *   node scripts/build-llms-full.mjs [--out <file>]
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DOCS = join(ROOT, "docs");
const ORIGIN = "https://docs.logstag.com";

const outArg = process.argv.indexOf("--out");
const OUT = outArg > -1 ? resolve(process.argv[outArg + 1]) : join(ROOT, "static", "llms-full.txt");

const toPosix = (p) => p.split(sep).join("/");

// --- collect docs ------------------------------------------------------------

function walk(dir) {
  const files = [];
  for (const name of readdirSync(dir)) {
    if (name.startsWith("_")) continue; // _explain partials, _category_ files
    const full = join(dir, name);
    if (statSync(full).isDirectory()) files.push(...walk(full));
    else if (/\.mdx?$/.test(name)) files.push(full);
  }
  return files;
}

function parseFrontmatter(src) {
  const { data, content } = matter(src);
  return { data, body: content };
}

function permalink(id, data) {
  if (data.slug) return data.slug.endsWith("/") ? data.slug : `${data.slug}/`;
  const path = id.endsWith("/index") ? id.slice(0, -"index".length) : `${id}/`;
  return `/${path}`;
}

const docs = new Map(); // id -> { file, data, body, url }
for (const file of walk(DOCS)) {
  const id = toPosix(relative(DOCS, file)).replace(/\.mdx?$/, "");
  const { data, body } = parseFrontmatter(readFileSync(file, "utf8"));
  docs.set(id, { file, data, body, url: ORIGIN + permalink(id, data) });
}
const urlByFile = new Map([...docs.values()].map((d) => [d.file, d.url]));

// --- sidebar order -----------------------------------------------------------

const sidebarSource = readFileSync(join(ROOT, "sidebars.ts"), "utf8")
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/\/\/.*$/gm, "");
const quoted = [...sidebarSource.matchAll(/["']([^"'\n]+)["']/g)].map((m) => m[1]);
const order = [...new Set(quoted.filter((id) => docs.has(id)))];
for (const id of docs.keys()) if (!order.includes(id)) order.push(id);

// --- transform ---------------------------------------------------------------

const STATIC = join(ROOT, "static");
const warnings = [];

function absolutize(text, file) {
  return text.replace(/(!?\[[^\]]*\])\(([^)\s]+)([^)]*)\)/g, (all, label, href, rest) => {
    if (/^[a-z]+:/i.test(href) || href.startsWith("#")) return all;
    const [path, hash = ""] = href.split("#");
    const target = resolve(dirname(file), path);
    let url;
    if (path.startsWith("/")) url = ORIGIN + path;
    else if (/\.mdx?$/.test(path)) url = urlByFile.get(target);
    else if (target.startsWith(STATIC + sep)) url = `${ORIGIN}/${toPosix(relative(STATIC, target))}`;
    if (!url) {
      warnings.push(`${toPosix(relative(ROOT, file))}: ${href}`);
      return all;
    }
    return `${label}(${url}${hash ? `#${hash}` : ""}${rest})`;
  });
}

/** Apply fn to every line outside fenced code blocks. */
function mapProse(text, fn) {
  let fence = null;
  return text
    .split(/\r?\n/)
    .flatMap((line) => {
      const f = line.match(/^\s*(```+|~~~+)/);
      if (f) {
        if (!fence) fence = f[1];
        else if (line.trim().startsWith(fence)) fence = null;
        return [line];
      }
      return fence ? [line] : fn(line);
    })
    .join("\n");
}

function render(doc) {
  const partials = new Map();
  let text = mapProse(doc.body, (line) => {
    const imp = line.match(/^import\s+(\w+)\s+from\s+['"](.+\.mdx?)['"];?\s*$/);
    if (imp) {
      const file = resolve(dirname(doc.file), imp[2]);
      partials.set(imp[1], absolutize(readFileSync(file, "utf8").trim(), file));
      return [];
    }
    return [line];
  });
  let h1 = null;
  text = mapProse(text, (line) => {
    const heading = line.match(/^# (.+)$/);
    if (heading && h1 === null) {
      h1 = heading[1].trim();
      return [];
    }
    const tag = line.match(/^\s*<(\w+)\s*\/>\s*$/);
    return tag && partials.has(tag[1]) ? [partials.get(tag[1])] : [line];
  });
  text = absolutize(text, doc.file);

  const title = doc.data.title || h1 || doc.url;
  return `# ${title}\n\nSource: ${doc.url}\n\n${text.replace(/\n{3,}/g, "\n\n").trim()}\n`;
}

const header = readFileSync(join(ROOT, "static", "llms.txt"), "utf8").split(/\r?\n## /)[0].trim();
const pages = order.map((id) => render(docs.get(id)));
writeFileSync(OUT, `${header}\n\nThis file contains the full Logstag documentation, one page after another.\n\n---\n\n${pages.join("\n---\n\n")}`);
for (const w of warnings) console.warn(`llms-full: relative link left as is (no stable URL): ${w}`);
console.log(`llms-full: ${pages.length} pages → ${toPosix(relative(ROOT, OUT))}`);
