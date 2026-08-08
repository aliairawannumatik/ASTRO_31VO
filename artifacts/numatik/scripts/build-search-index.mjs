#!/usr/bin/env node
/**
 * build-search-index.mjs
 *
 * Generates public/search-index.json: a small, pre-extracted index of
 * every routed page's title + readable text content.
 *
 * WHY THIS EXISTS
 * MenuPage used to import the raw .tsx source of every page (900+ files,
 * ~23MB) directly into the browser bundle with `import.meta.glob(..., { eager: true })`
 * just so it could text-search inside them. That made the menu chunk huge
 * and slow to load, AND it matched against raw JSX/code syntax (className
 * strings, import statements, etc), producing noisy results.
 *
 * This script does the heavy lifting once, at build time / dev-start time,
 * on the file system (fast, no bundle cost), and writes a compact JSON file
 * that the client fetches on demand only when the user opens search.
 *
 * Run: node scripts/build-search-index.mjs
 * (also wired into "predev" and "prebuild" in package.json)
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC_DIR = path.join(ROOT, "src");
const APP_TSX = path.join(SRC_DIR, "App.tsx");
const OUT_FILE = path.join(ROOT, "public", "search-index.json");

const MAX_CONTENT_CHARS = 1200; // keep each entry small; enough for a good snippet

/** Resolve an import specifier like "./pages/foo/Bar" to an actual file on disk. */
async function resolveImportPath(importSpecifier) {
  const base = path.resolve(SRC_DIR, importSpecifier);
  for (const ext of [".tsx", ".ts"]) {
    if (existsSync(base + ext)) return base + ext;
  }
  // Already has an extension, or is an index file
  for (const ext of ["", "/index.tsx", "/index.ts"]) {
    if (existsSync(base + ext)) return base + ext;
  }
  return null;
}

const TAILWIND_TOKEN_RE = /^[a-z]+(?:-[a-z0-9]+)+(?:\/\d+)?$|^(sm|md|lg|xl|2xl|hover|focus|active|dark|group-hover):/;

function isReadableSentence(str) {
  const s = str.trim();
  if (s.length < 3 || s.length > 200) return false;
  if (!/[a-zA-Z]/.test(s)) return false;
  if (!s.includes(" ")) return false; // single tokens are usually class names/ids
  // Filter obvious code/path noise
  if (/^(https?:|\/[a-z]|@\/|\.\/|\.\.\/)/.test(s)) return false;
  if (/[{}<>`]/.test(s)) return false;

  // Reject strings that are mostly Tailwind utility-class tokens
  // (e.g. "rounded-xl bg-gradient-to-br from-cyan-500/20 border p-3")
  const tokens = s.split(/\s+/);
  const classyCount = tokens.filter((t) => TAILWIND_TOKEN_RE.test(t)).length;
  if (classyCount / tokens.length > 0.4) return false;

  return true;
}

function extractReadableText(source) {
  const found = new Set();

  // 1) JSX text nodes: text sitting directly between > and 
  const jsxTextRe = />([^<>{}\n][^<>{}]{2,200})</g;
  let m;
  while ((m = jsxTextRe.exec(source))) {
    const text = m[1].replace(/\s+/g, " ").trim();
    if (isReadableSentence(text)) found.add(text);
  }

  // 2) Quoted string literals that read like sentences (covers inline
  //    language-conditional strings like `language === "id" ? "..." : ...`)
  const stringLitRe = /["']([^"'\n]{3,200})["']/g;
  while ((m = stringLitRe.exec(source))) {
    const text = m[1].replace(/\s+/g, " ").trim();
    if (isReadableSentence(text)) found.add(text);
  }

  return Array.from(found);
}

function extractTitle(source, fallback) {
  const h1 = source.match(/<h1[^>]*>\s*([^<{}\n]{2,120})\s*<\/h1>/);
  if (h1) return h1[1].replace(/\s+/g, " ").trim();
  const h2 = source.match(/<h2[^>]*>\s*([^<{}\n]{2,120})\s*<\/h2>/);
  if (h2) return h2[1].replace(/\s+/g, " ").trim();
  return fallback;
}

function titleFromPath(routePath) {
  return routePath
    .split("/")
    .filter(Boolean)
    .join(" ")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

async function main() {
  const appSource = await readFile(APP_TSX, "utf8");

  // Map: componentName -> resolved import specifier (e.g. "./pages/foo/Bar")
  const lazyImportRe = /const\s+(\w+)\s*=\s*lazy\(\s*\(\)\s*=>\s*import\(\s*["']([^"']+)["']\s*\)/g;
  const componentToSpecifier = new Map();
  let m;
  while ((m = lazyImportRe.exec(appSource))) {
    componentToSpecifier.set(m[1], m[2]);
  }

  // Extract routes: <Route path="..." ... element={<ComponentName
  const routeRe = /<Route\s+path=["']([^"']+)["'][^>]*element=\{<(\w+)/g;
  const routes = [];
  while ((m = routeRe.exec(appSource))) {
    const [, routePath, componentName] = m;
    if (routePath.includes(":") || routePath.includes("*") || routePath === "/") continue;
    routes.push({ routePath, componentName });
  }

  console.log(`Found ${routes.length} indexable routes, ${componentToSpecifier.size} lazy components.`);

  const fileCache = new Map(); // resolved file path -> source text
  const index = [];
  let skipped = 0;

  for (const { routePath, componentName } of routes) {
    const specifier = componentToSpecifier.get(componentName);
    if (!specifier) {
      skipped++;
      continue;
    }
    const resolved = await resolveImportPath(specifier);
    if (!resolved) {
      skipped++;
      continue;
    }

    let source = fileCache.get(resolved);
    if (source === undefined) {
      source = await readFile(resolved, "utf8");
      fileCache.set(resolved, source);
    }

    const fallbackTitle = titleFromPath(routePath);
    const title = extractTitle(source, fallbackTitle);
    const texts = extractReadableText(source);
    let content = texts.join(" \u00b7 ");
    if (content.length > MAX_CONTENT_CHARS) content = content.slice(0, MAX_CONTENT_CHARS);

    index.push({ path: routePath, title, content });
  }

  await mkdir(path.dirname(OUT_FILE), { recursive: true });
  await writeFile(OUT_FILE, JSON.stringify(index), "utf8");

  const sizeKb = (Buffer.byteLength(JSON.stringify(index)) / 1024).toFixed(1);
  console.log(`Wrote ${index.length} entries (${skipped} skipped, unresolved) -> ${path.relative(ROOT, OUT_FILE)} (${sizeKb} KB)`);
}

main().catch((err) => {
  console.error("build-search-index failed:", err);
  process.exit(1);
});
