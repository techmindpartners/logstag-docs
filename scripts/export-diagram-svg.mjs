/**
 * export-diagram-svg.mjs — export a rendered Archify diagram as light.svg and
 * dark.svg with an animated data flow, plus light-still.svg and
 * dark-still.svg without it, for the ArchifyDiagram component.
 *
 * The Archify CLI has no SVG export, and the viewer draws its flow animation
 * with JavaScript that exports leave out. This script opens the diagram HTML
 * in headless Chrome, takes the viewer's own SVG export for each theme (the
 * still file), and adds a dot to every relationship that travels from its
 * source to its target. The dots use SVG animation (SMIL), which runs in an
 * <img> without JavaScript. A node sends its dots once one has reached it, so
 * the flow cascades downstream as in the viewer. The page shows the still
 * file to readers who prefer reduced motion, and the animated file also hides
 * its dots for them when opened on its own.
 *
 * Needs Node 22+ (global WebSocket) and Google Chrome; set CHROME_PATH when
 * Chrome is not at the macOS default location.
 *
 * Usage:
 *   node scripts/export-diagram-svg.mjs <diagram.html> <out-dir>
 */
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const [html, outDir] = process.argv.slice(2);
if (!html || !outDir) {
  console.error("Usage: node scripts/export-diagram-svg.mjs <diagram.html> <out-dir>");
  process.exit(1);
}
const CHROME = process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Runs inside the viewer page: exports the SVG for `theme` and returns it as
 * is and with the flow added. Lengths and colors come from the live diagram,
 * which shows the same theme.
 */
async function exportSvgs(theme) {
  const SPEED = 200; // px per second along a relationship
  const MIN_TRAVEL = 0.5;
  const MAX_TRAVEL = 1.6;
  const HANDOFF = 0.15; // pause at a node before its own dots leave
  const REST = 1.2; // pause after the last dot lands, before the cycle repeats
  const SVG_NS = "http://www.w3.org/2000/svg";
  const XLINK_NS = "http://www.w3.org/1999/xlink";

  window.__exports.length = 0;
  await Archify.exportMenu.run(`svg-${theme}`);
  const blob = window.__exports.find((b) => b.type.startsWith("image/svg"));
  const still = await blob.text();
  const doc = new DOMParser().parseFromString(still, "image/svg+xml");
  const svg = doc.documentElement;

  const live = document.querySelector(".diagram-container svg");
  const edges = [...svg.querySelectorAll("path[data-edge-key]")].map((path) => {
    const key = path.getAttribute("data-edge-key");
    const livePath = live.querySelector(`path[data-edge-key="${key}"]`);
    const travel = Math.min(MAX_TRAVEL, Math.max(MIN_TRAVEL, livePath.getTotalLength() / SPEED));
    path.setAttribute("id", `flow-path-${key}`);
    return { key, from: path.getAttribute("data-edge-from"), to: path.getAttribute("data-edge-to"), travel, color: getComputedStyle(livePath).stroke };
  });

  // Earliest arrival at each node; nodes nothing points to start the cycle.
  const arrive = {};
  const sources = new Set(edges.map((e) => e.from).filter((id) => !edges.some((e) => e.to === id)));
  for (const id of sources) arrive[id] = 0;
  const depart = (e) => arrive[e.from] + (sources.has(e.from) ? 0 : HANDOFF);
  for (let changed = true; changed; ) {
    changed = false;
    for (const e of edges) {
      if (arrive[e.from] === undefined) continue;
      const at = depart(e) + e.travel;
      if (arrive[e.to] === undefined || at < arrive[e.to] - 1e-9) {
        arrive[e.to] = at;
        changed = true;
      }
    }
  }
  // Nodes that only a closed loop reaches have no arrival; start them at 0.
  for (const e of edges) if (arrive[e.from] === undefined) arrive[e.from] = 0;
  const cycle = Number((Math.max(...edges.map((e) => depart(e) + e.travel)) + REST).toFixed(2));

  const el = (name, attrs, parent) => {
    const node = doc.createElementNS(SVG_NS, name);
    for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
    parent.appendChild(node);
    return node;
  };
  const style = el("style", {}, svg);
  // The head's outline takes the label mask color, so it stands out on its own line.
  style.textContent = `.flow-head { stroke: var(--mask); stroke-width: 1.4; }
    @media (prefers-reduced-motion: reduce) { .flow { display: none; } }`;
  const flow = el("g", { class: "flow", "aria-hidden": "true" }, svg);
  const t = (seconds) => (seconds / cycle).toFixed(4);
  // Each relationship gets a head with a soft halo and two fading tail dots
  // that trail it by `lag` seconds.
  const comet = [
    { lag: 0, r: 4, halo: 10 },
    { lag: 0.07, r: 2.8, opacity: 0.55 },
    { lag: 0.14, r: 2, opacity: 0.3 },
  ];
  for (const e of edges) {
    for (const part of comet) {
      const start = depart(e) + part.lag;
      const end = start + e.travel;
      const dot = el("g", { fill: e.color, opacity: "0" }, flow);
      if (part.halo) el("circle", { r: part.halo, opacity: "0.2" }, dot);
      el("circle", part.halo ? { r: part.r, class: "flow-head" } : { r: part.r }, dot);
      const motion = el("animateMotion", { dur: `${cycle}s`, repeatCount: "indefinite", calcMode: "linear", keyPoints: "0;0;1;1", keyTimes: `0;${t(start)};${t(end)};1` }, dot);
      const mpath = el("mpath", { href: `#flow-path-${e.key}` }, motion);
      mpath.setAttributeNS(XLINK_NS, "xlink:href", `#flow-path-${e.key}`);
      const peak = String(part.opacity ?? 1);
      el("animate", { attributeName: "opacity", dur: `${cycle}s`, repeatCount: "indefinite", calcMode: "linear", values: `0;0;${peak};${peak};0;0`, keyTimes: `0;${t(start)};${t(start + 0.08)};${t(end - 0.08)};${t(end)};1` }, dot);
    }
  }
  return { still, animated: new XMLSerializer().serializeToString(doc) };
}

const profile = mkdtempSync(join(tmpdir(), "export-diagram-"));
const port = 9300 + Math.floor(Math.random() * 600);
const chrome = spawn(CHROME, ["--headless=new", "--disable-gpu", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "--window-size=1440,900", "about:blank"], { stdio: "ignore" });

try {
  let target;
  for (let i = 0; i < 50 && !target; i++) {
    await sleep(200);
    try {
      target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === "page");
    } catch {}
  }
  if (!target) throw new Error(`Chrome did not start: ${CHROME}`);

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
  let nextId = 0;
  const pending = new Map();
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    pending.get(msg.id)?.(msg);
    pending.delete(msg.id);
  };
  const send = (method, params = {}) =>
    new Promise((r) => { const id = ++nextId; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
  const evaluate = async (expression) => {
    const { result } = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text);
    return result.result.value;
  };

  // Keep the viewer's export blobs instead of downloading them.
  await send("Page.enable");
  await send("Page.addScriptToEvaluateOnNewDocument", {
    source: `window.__exports = [];
      const createObjectURL = URL.createObjectURL.bind(URL);
      URL.createObjectURL = (blob) => { window.__exports.push(blob); return createObjectURL(blob); };
      HTMLAnchorElement.prototype.click = function () {};`,
  });
  for (const theme of ["light", "dark"]) {
    await send("Page.navigate", { url: `${pathToFileURL(resolve(html)).href}?theme=${theme}` });
    for (let i = 0; i < 50 && !(await evaluate("typeof Archify !== 'undefined' && !!Archify.exportMenu && document.readyState === 'complete'")); i++) await sleep(200);
    const { still, animated } = await evaluate(`(${exportSvgs})(${JSON.stringify(theme)})`);
    for (const [name, svg] of [[`${theme}.svg`, animated], [`${theme}-still.svg`, still]]) {
      const file = join(outDir, name);
      writeFileSync(file, svg);
      console.log(`export-diagram-svg: ${file} (${Math.round(svg.length / 1024)} KB)`);
    }
  }
  ws.close();
} finally {
  const exited = new Promise((r) => chrome.once("exit", r));
  chrome.kill();
  await exited;
  rmSync(profile, { recursive: true, force: true, maxRetries: 5 });
}
