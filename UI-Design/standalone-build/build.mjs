// Bundle a Next.js (app router) design folder into ONE self-contained HTML file.
//   node build.mjs <design-folder> [--out file.html]
// Opens by double-click (file://), no npm/server needed to VIEW it. Routes become
// hash routes (#/portfolio/holdings). Build tools install in a temp dir, never in the design.
import fs from "fs"; import path from "path"; import os from "os"; import { execSync } from "child_process";
import crypto from "crypto"; import { fileURLToPath } from "url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const outIdx = args.indexOf("--out");
const outArg = outIdx >= 0 ? args.splice(outIdx, 2)[1] : null;
const DESIGN = args[0] ? path.resolve(args[0]) : null;
if (!DESIGN || !fs.existsSync(path.join(DESIGN, "package.json"))) {
  console.error("Usage: bash build.sh <design-folder>   (folder must contain package.json)"); process.exit(1);
}
const name = path.basename(DESIGN);
const OUT = outArg ? path.resolve(outArg) : path.join(path.dirname(DESIGN), `${name}-standalone.html`);
const fwd = p => p.split(path.sep).join("/");
const warn = m => console.warn("  ! " + m);
const pkg = JSON.parse(fs.readFileSync(path.join(DESIGN, "package.json"), "utf8"));
const deps = { ...pkg.dependencies };

// ── locate app dir, source root, @ alias ──
const appDir = ["src/app", "app"].map(d => path.join(DESIGN, d)).find(d => fs.existsSync(d));
if (!appDir) { console.error("No src/app or app folder: not an app-router Next.js project."); process.exit(1); }
let srcRoot = path.dirname(appDir);
try {
  const ts = fs.readFileSync(path.join(DESIGN, "tsconfig.json"), "utf8");
  const m = /"@\/\*"\s*:\s*\[\s*"\.\/([^"*]*)\*"/.exec(ts);
  if (m) srcRoot = path.join(DESIGN, m[1]);
} catch {}

// ── discover pages and layouts ──
const pageFiles = []; const layoutAt = new Map(); let notFoundFile = null;
const isCode = f => /\.(tsx|ts|jsx|js)$/.test(f);
(function walk(dir, segs) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "api" || e.name.startsWith("@") || e.name.startsWith("_") || e.name.startsWith("(.")) continue;
      walk(full, /^\(.*\)$/.test(e.name) ? segs : [...segs, e.name]);
    } else if (isCode(e.name)) {
      const base = e.name.replace(/\.\w+$/, "");
      if (base === "page") pageFiles.push({ file: full, segs, dir });
      if (base === "layout") layoutAt.set(dir, full);
      if (base === "not-found" && dir === appDir) notFoundFile = full;
    }
  }
})(appDir, []);
if (!pageFiles.length) { console.error("No page files found."); process.exit(1); }
const rootLayout = layoutAt.get(appDir) ?? null;

// ── CSS from the root layout's imports ──
let cssSources = [];
if (rootLayout) {
  const code = fs.readFileSync(rootLayout, "utf8");
  for (const m of code.matchAll(/import\s+["']([^"']+\.css)["']/g)) {
    const p = m[1].startsWith("@/") ? path.join(srcRoot, m[1].slice(2)) : path.resolve(path.dirname(rootLayout), m[1]);
    if (fs.existsSync(p)) cssSources.push(p);
  }
}
if (!cssSources.length) {
  const g = ["globals.css", "global.css"].map(f => path.join(appDir, f)).find(fs.existsSync); if (g) cssSources.push(g);
}
let title = name;
if (rootLayout) { const m = /title:\s*(?:\{[^}]*default:\s*)?["'`]([^"'`]+)["'`]/.exec(fs.readFileSync(rootLayout, "utf8")); if (m) title = m[1]; }

// ── work dir with tools + the design's browser-side dependencies ──
const SERVER_ONLY = /^(next|react|react-dom|pg|postgres|mysql2?|drizzle-orm|drizzle-kit|dotenv|better-sqlite3|bcrypt|bcryptjs|jsonwebtoken|server-only|typescript|eslint.*|postcss|tailwindcss|@tailwindcss\/.*|@types\/.*|@prisma\/.*|prisma|next-auth|nodemailer|stripe)$/;
const reactVer = (deps.react || "19").replace(/^[\^~]/, "");
const twDep = (pkg.devDependencies?.tailwindcss || deps.tailwindcss || "4.1.17").replace(/^[\^~]/, "");
const twMajor = Number(twDep.split(".")[0]);
const hasOwnModules = fs.existsSync(path.join(DESIGN, "node_modules", "react"));
const wantDeps = Object.entries(deps).filter(([k]) => !SERVER_ONLY.test(k)).map(([k, v]) => `${k}@${v}`);
const installList = [`react@${reactVer}`, `react-dom@${reactVer}`, "esbuild", ...(hasOwnModules ? [] : wantDeps),
  ...(twMajor >= 4 ? [`tailwindcss@${twDep}`, `@tailwindcss/cli@${twDep}`] : [])];
const stamp = crypto.createHash("md5").update(installList.join("|")).digest("hex").slice(0, 10);
const W = path.join(os.tmpdir(), `meridian-standalone-${name}-${stamp}`);
if (!fs.existsSync(path.join(W, ".ready"))) {
  console.log("Installing build tools into", W, "(one-off, temp folder)...");
  fs.mkdirSync(W, { recursive: true }); fs.writeFileSync(path.join(W, "package.json"), '{"name":"b","private":true}');
  execSync(`npm i --no-audit --no-fund --legacy-peer-deps ${installList.map(s => JSON.stringify(s)).join(" ")}`, { cwd: W, stdio: "inherit" });
  fs.writeFileSync(path.join(W, ".ready"), "");
}
const nm = path.join(W, "node_modules");
const reactRoot = hasOwnModules ? path.join(DESIGN, "node_modules") : nm;

// ── generate the entry ──
const imp = []; let n = 0; const ref = f => { const id = "M" + n++; imp.push(`import ${id} from ${JSON.stringify(fwd(f))};`); return id; };
const layoutChain = dir => { const chain = []; let d = dir; while (d.length >= appDir.length) { if (d !== appDir && layoutAt.has(d)) chain.unshift(ref(layoutAt.get(d))); if (d === appDir) break; d = path.dirname(d); } return chain; };
const routes = pageFiles.map(p => `{ segs: ${JSON.stringify(p.segs)}, Page: ${ref(p.file)}, layouts: [${layoutChain(p.dir).join(",")}] }`);
const entry = `
import React, { useEffect, useState, Component } from "react";
import { createRoot } from "react-dom/client";
import { ParamsContext, RedirectSignal, NotFoundSignal, currentPath } from "@@nav";
${imp.join("\n")}
${rootLayout ? `import RootLayout from ${JSON.stringify(fwd(rootLayout))};` : ""}
${notFoundFile ? `import NotFoundPage from ${JSON.stringify(fwd(notFoundFile))};` : ""}
{ const ce = console.error; console.error = (...a) => { if (a.some(x => x instanceof RedirectSignal || x instanceof NotFoundSignal)) return; ce.apply(console, a); }; }
const routes = [${routes.join(",\n")}];
const rank = r => r.segs.reduce((s, x) => s + (x.startsWith("[[") ? 0 : x.startsWith("[...") ? 1 : x.startsWith("[") ? 2 : 3), 0);
routes.sort((a, b) => rank(b) - rank(a));
function match(path) {
  const parts = path.split("/").filter(Boolean);
  for (const r of routes) {
    const params = {}; let i = 0, ok = true;
    for (const s of r.segs) {
      if (s.startsWith("[[...")) { params[s.slice(5, -2)] = parts.slice(i); i = parts.length; }
      else if (s.startsWith("[...")) { if (i >= parts.length) { ok = false; break; } params[s.slice(4, -1)] = parts.slice(i); i = parts.length; }
      else if (s.startsWith("[")) { if (i >= parts.length) { ok = false; break; } params[s.slice(1, -1)] = decodeURIComponent(parts[i++]); }
      else if (parts[i] === s) i++; else { ok = false; break; }
    }
    if (ok && i === parts.length) return { route: r, params };
  }
  return null;
}
const thenable = p => Object.assign(Promise.resolve(p), p);
function unwrap(el) {
  if (el && el.type === "html") { if (el.props.className) document.documentElement.className = el.props.className; return unwrap(React.Children.toArray(el.props.children).find(c => c?.type === "body") ?? el.props.children); }
  if (el && el.type === "body") { if (el.props.className) document.body.className = el.props.className; return el.props.children; }
  return el;
}
class Boundary extends Component {
  state = { sig: null };
  static getDerivedStateFromError(e) { return (e instanceof RedirectSignal || e instanceof NotFoundSignal) ? { sig: e } : null; }
  componentDidCatch(e) { if (e instanceof RedirectSignal) window.location.hash = e.to; else if (!(e instanceof NotFoundSignal)) console.error(e); }
  componentDidUpdate(prev) { if (prev.pathKey !== this.props.pathKey && this.state.sig) this.setState({ sig: null }); }
  render() { return this.state.sig instanceof NotFoundSignal ? <NotFound /> : this.state.sig ? null : this.props.children; }
}
function NotFound() { return ${notFoundFile ? "<NotFoundPage />" : `<div style={{ padding: 40, fontFamily: "system-ui" }}><h2>404</h2><p>No page at this route.</p></div>`}; }
function AsyncPage({ Page, params }) {
  const [node, setNode] = useState(null); const [err, setErr] = useState(null);
  useEffect(() => { let live = true; setNode(null); Promise.resolve(Page({ params: thenable(params), searchParams: thenable({}) })).then(r => live && setNode(r)).catch(e => live && setErr(e)); return () => { live = false; }; }, [Page, JSON.stringify(params)]);
  if (err) throw err; return node;
}
const isAsync = f => f?.constructor?.name === "AsyncFunction";
function Shell({ children }) { return ${rootLayout ? "unwrap(RootLayout({ children, params: thenable({}) }))" : "children"}; }
function App() {
  const [path, setPath] = useState(currentPath);
  useEffect(() => { const on = () => { setPath(currentPath()); window.scrollTo(0, 0); }; window.addEventListener("hashchange", on); setPath(currentPath()); return () => window.removeEventListener("hashchange", on); }, []);
  const m = match(path);
  let body;
  if (!m) body = <NotFound />;
  else {
    const { route, params } = m; const P = route.Page;
    body = isAsync(P) ? <AsyncPage Page={P} params={params} /> : <P params={thenable(params)} searchParams={thenable({})} />;
    for (const L of [...route.layouts].reverse()) body = <L params={thenable(params)}>{body}</L>;
    body = <ParamsContext.Provider value={params}>{body}</ParamsContext.Provider>;
  }
  return <Shell><Boundary pathKey={path}>{body}</Boundary></Shell>;
}
createRoot(document.getElementById("root")).render(<App />);
`.replace('"@@nav"', JSON.stringify(fwd(path.join(HERE, "shims/navigation.jsx"))));
const entryFile = path.join(W, "entry.jsx"); fs.writeFileSync(entryFile, entry);

// ── bundle JS ──
const sh = f => fwd(path.join(HERE, "shims", f));
const alias = {
  "next/link": sh("link.jsx"), "next/navigation": sh("navigation.jsx"), "next/image": sh("image.jsx"),
  "next/font/google": sh("font.js"), "next/font/local": sh("font.js"), "@": fwd(srcRoot),
  react: fwd(path.join(reactRoot, "react")), "react-dom": fwd(path.join(reactRoot, "react-dom")),
};
const esb = path.join(nm, ".bin", "esbuild");
const loaders = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".avif", ".svg", ".woff", ".woff2", ".ttf", ".otf"].map(e => `--loader:${e}=dataurl`);
const jsOut = path.join(W, "app.js");
try {
  execSync([JSON.stringify(esb), JSON.stringify(entryFile), "--bundle", "--minify", "--format=iife", "--jsx=automatic", '--define:process.env.NODE_ENV=\\"production\\"',
    ...Object.entries(alias).map(([k, v]) => `--alias:${k}=${JSON.stringify(v)}`), ...loaders, "--loader:.css=empty", `--outfile=${JSON.stringify(jsOut)}`].join(" "),
    { cwd: W, stdio: "inherit", env: { ...process.env, NODE_PATH: hasOwnModules ? path.join(DESIGN, "node_modules") : nm } });
} catch { console.error("\nBundling failed (see the error above). Likely a server-only import in a page, or an unsupported Next feature."); process.exit(1); }

// ── CSS ──
let css = "";
for (const src of cssSources) {
  let text = fs.readFileSync(src, "utf8");
  if (/@import\s+["']tailwindcss["']/.test(text)) {
    if (twMajor < 4) { warn("Tailwind v3 is not supported by this script; tailwind classes will be unstyled."); css += text; continue; }
    text = text.replace(/(@import\s+["']tailwindcss["'];?)/, `$1\n@source "${fwd(srcRoot)}";`);
    const inF = path.join(W, "in.css"), outF = path.join(W, "out.css"); fs.writeFileSync(inF, text);
    execSync(`${JSON.stringify(path.join(nm, ".bin", "tailwindcss"))} -i ${JSON.stringify(inF)} -o ${JSON.stringify(outF)} --minify`, { cwd: W, stdio: "pipe" });
    css += fs.readFileSync(outF, "utf8");
  } else css += text;
}
// ── inline /public assets referenced by absolute path ──
let js = fs.readFileSync(jsOut, "utf8");
const pub = path.join(DESIGN, "public");
if (fs.existsSync(pub)) {
  const mime = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", gif: "image/gif", webp: "image/webp", avif: "image/avif", svg: "image/svg+xml", ico: "image/x-icon", woff: "font/woff", woff2: "font/woff2", ttf: "font/ttf" };
  (function walk(d, rel) { for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const r = rel + "/" + e.name, full = path.join(d, e.name);
    if (e.isDirectory()) { walk(full, r); continue; }
    const ext = e.name.split(".").pop().toLowerCase(); if (!mime[ext] || fs.statSync(full).size > 3e6) continue;
    const uri = `data:${mime[ext]};base64,${fs.readFileSync(full).toString("base64")}`;
    for (const q of ['"', "'", "`"]) { js = js.split(q + r + q).join(q + uri + q); css = css.split(`url(${q}${r}${q})`).join(`url(${q}${uri}${q})`); }
    css = css.split(`url(${r})`).join(`url(${uri})`);
  } })(pub, "");
}
if (/url\(\s*["']?(?!data:|#|https?:)/.test(css)) warn("CSS still references a relative url(); that asset may not load from file://.");
if (/https?:\/\/fonts\.googleapis|fonts\.gstatic/.test(css + js)) warn("Uses web fonts from the internet; they only load while online.");

const html = `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">\n<title>${title.replace(/</g, "&lt;")}</title>\n<style>${css}</style></head>\n<body><div id="root"></div>\n<script>${js.replace(/<\/script/g, "<\\/script")}</script></body></html>`;
fs.writeFileSync(OUT, html);
console.log(`\nWrote ${OUT} (${(html.length / 1024).toFixed(0)} KB)\nRoutes: ${pageFiles.map(p => "/" + p.segs.join("/")).join("  ")}\nOpen it by double-clicking. Links use #/path routing.`);
