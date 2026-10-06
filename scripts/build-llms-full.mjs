/**
 * build-llms-full.mjs — concatenate every docs page into static/llms-full.txt
 * so AI assistants can read the whole documentation in one request
 * (https://llmstxt.org). static/llms.txt is the hand-written index.
 *
 * Pages are emitted in sidebar order, followed by any doc that is not in the
 * sidebar. sidebars.ts is read as text, not imported: the deploy runs Node 20,
 * which cannot load TypeScript. Every quoted string in it that names a doc id
 * counts, in order of appearance. Doc ids and URLs follow Docusaurus: the
 * `id` frontmatter replaces the file name, `slug` overrides the URL (relative
 * slugs resolve against the doc's folder), and index.md/README.md or a file
 * named like its folder is the folder's page. Pages marked `draft` or
 * `unlisted` are left out, as they are not public.
 *
 * For each page:
 *   - frontmatter is parsed with gray-matter (the parser Docusaurus uses) and
 *     dropped; its `title` (or the first `# ` heading) is used
 *   - `import X from '…/_explain/….md'` partials are inlined where `<X />`
 *     stands on its own line
 *   - relative .md/.mdx links, root-relative links/images and relative links
 *     into static/ become absolute https://docs.logstag.com URLs. Any other
 *     relative link is left as is with a warning: Docusaurus content-hashes
 *     co-located images, so they have no stable URL; move them to static/.
 *   - other MDX (imports, exports, JSX components) is left as is with a
 *     warning, since it has no plain-text form
 * Code fences and inline code are passed through untouched.
 *
 * Usage:
 *   node scripts/build-llms-full.mjs [--out <file>]
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { basename, dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DOCS = join(ROOT, "docs");
const STATIC = join(ROOT, "static");
const ORIGIN = "https://docs.logstag.com";

const outArg = process.argv.indexOf("--out");
const OUT = outArg > -1 ? resolve(process.argv[outArg + 1]) : join(STATIC, "llms-full.txt");

const toPosix = (p) => p.split(sep).join("/");
const warnings = [];
const warn = (file, message) => warnings.push(`${toPosix(relative(ROOT, file))}: ${message}`);

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

/** Doc id and URL path, the way the Docusaurus docs plugin derives them. */
function locate(file, data) {
  const folder = toPosix(relative(DOCS, dirname(file))).replace(/^\.$/, "");
  const name = basename(file).replace(/\.mdx?$/, "");
  const inFolder = (path) => (folder ? `${folder}/${path}` : path);
  const id = inFolder(data.id ?? name);

  let path;
  if (data.slug) path = String(data.slug).startsWith("/") ? String(data.slug) : `/${inFolder(data.slug)}`;
  else if (/^(index|readme)$/i.test(name) || name === basename(folder)) path = `/${folder}`;
  else path = `/${inFolder(data.id ?? name)}`;
  return { id, url: ORIGIN + (path.endsWith("/") ? path : `${path}/`) };
}

const docs = new Map(); // id -> { file, data, body, url }
for (const file of walk(DOCS)) {
  const { data, content } = matter(readFileSync(file, "utf8"));
  if (data.draft === true || data.unlisted === true) continue;
  const { id, url } = locate(file, data);
  docs.set(id, { file, data, body: content, url });
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

/** Make the links on one prose line absolute; inline code spans are skipped. */
function absolutizeLine(line, file) {
  return line
    .split(/(`[^`]*`)/)
    .map((part, i) =>
      i % 2
        ? part
        : part.replace(/(!?\[[^\]]*\])\(([^)\s]+)([^)]*)\)/g, (all, label, href, rest) => {
            if (/^[a-z]+:/i.test(href) || href.startsWith("#")) return all;
            const [path, hash = ""] = href.split("#");
            const target = resolve(dirname(file), path);
            let url;
            if (path.startsWith("/")) url = ORIGIN + path;
            else if (/\.mdx?$/.test(path)) url = urlByFile.get(target);
            else if (target.startsWith(STATIC + sep)) url = `${ORIGIN}/${toPosix(relative(STATIC, target))}`;
            if (!url) {
              warn(file, `relative link left as is (no stable URL): ${href}`);
              return all;
            }
            return `${label}(${url}${hash ? `#${hash}` : ""}${rest})`;
          }),
    )
    .join("");
}

/** Warn about MDX that has no plain-text form and is passed through as is. */
function checkMdx(line, file) {
  const prose = line.replace(/`[^`]*`/g, "");
  if (/^(import|export)\s/.test(prose)) warn(file, `MDX ${prose.split(/\s/)[0]} left as is: ${line.trim()}`);
  else if (/<[A-Z]\w*[\s/>]/.test(prose)) warn(file, `JSX component left as is: ${line.trim()}`);
}

function render(doc) {
  // Partials are resolved against their own file, then inlined unchanged
  const partials = new Map();
  let text = mapProse(doc.body, (line) => {
    const imp = line.match(/^import\s+(\w+)\s+from\s+['"](.+\.mdx?)['"];?\s*$/);
    if (!imp) return [line];
    const file = resolve(dirname(doc.file), imp[2]);
    partials.set(imp[1], mapProse(readFileSync(file, "utf8").trim(), (l) => [absolutizeLine(l, file)]));
    return [];
  });

  let h1 = null;
  text = mapProse(text, (line) => {
    const heading = line.match(/^# (.+)$/);
    if (heading && h1 === null) {
      h1 = heading[1].trim();
      return [];
    }
    const tag = line.match(/^\s*<(\w+)\s*\/>\s*$/);
    if (tag && partials.has(tag[1])) return [partials.get(tag[1])];
    checkMdx(line, doc.file);
    return [absolutizeLine(line, doc.file)];
  });

  const title = doc.data.title || h1 || doc.url;
  return `# ${title}\n\nSource: ${doc.url}\n\n${text.replace(/\n{3,}/g, "\n\n").trim()}\n`;
}

const header = readFileSync(join(STATIC, "llms.txt"), "utf8").replace(/\r\n/g, "\n").split("\n## ")[0].trim();
const pages = order.map((id) => render(docs.get(id)));
writeFileSync(OUT, `${header}\n\nThis file contains the full Logstag documentation, one page after another.\n\n---\n\n${pages.join("\n---\n\n")}`);
for (const w of warnings) console.warn(`llms-full: ${w}`);
console.log(`llms-full: ${pages.length} pages → ${toPosix(relative(ROOT, OUT))}`);
