import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT, "public", "blog");
const ARTICLE_FILES = [
  "src/db/articlesData.ts",
  "src/db/extraArticles.ts",
  "src/db/finalArticles.ts",
  "src/db/moreArticles.ts",
];

const GRADIENTS = [
  ["#6366f1", "#a855f7"],
  ["#0ea5e9", "#6366f1"],
  ["#10b981", "#0ea5e9"],
  ["#f59e0b", "#ef4444"],
  ["#8b5cf6", "#ec4899"],
  ["#14b8a6", "#22c55e"],
];

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wrap(text, max) {
  const words = String(text).split(" ");
  const lines = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length <= max) cur = (cur + " " + w).trim();
    else { if (cur) lines.push(cur); cur = w; }
    if (lines.length === 2) break;
  }
  if (cur && lines.length < 2) lines.push(cur);
  return lines;
}

function buildSvg(title) {
  const t = String(title || "NABDA");
  const [c1, c2] = GRADIENTS[hash(t) % GRADIENTS.length];
  const lines = wrap(t, 34);
  const y0 = lines.length === 1 ? 345 : 315;
  const textEls = lines
    .map((l, i) => `<text x="600" y="${y0 + i * 78}" text-anchor="middle" font-family="Noto Sans Arabic, Arial, sans-serif" font-size="54" font-weight="700" fill="#ffffff">${esc(l)}</text>`)
    .join("\n  ");
  return `<svg width="1200" height="675" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="675" fill="url(#g)"/>
  <circle cx="1060" cy="110" r="190" fill="rgba(255,255,255,0.08)"/>
  <circle cx="110" cy="580" r="230" fill="rgba(255,255,255,0.06)"/>
  ${textEls}
  <text x="600" y="600" text-anchor="middle" font-family="Arial, sans-serif" font-size="26" fill="rgba(255,255,255,0.9)">NABDA نابدا</text>
</svg>`;
}

const refs = new Map();
const combined = /(title|image|infographic):\s*"((?:[^"\\]|\\.)*)"/g;
for (const file of ARTICLE_FILES) {
  const full = path.join(ROOT, file);
  if (!fs.existsSync(full)) { console.log("SKIP (غير موجود):", file); continue; }
  const src = fs.readFileSync(full, "utf8");
  let lastTitle = "";
  for (const m of src.matchAll(combined)) {
    if (m[1] === "title") lastTitle = m[2];
    else refs.set(m[2], { title: lastTitle || m[2] });
  }
}

const mapping = {};
for (const name of refs.keys()) {
  const ext = path.extname(name).toLowerCase();
  if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
    mapping[name] = name.replace(/\.[^.]+$/, "") + ".svg";
  }
}

let generated = 0;
for (const [oldName, newName] of Object.entries(mapping)) {
  const target = path.join(BLOG_DIR, newName);
  if (fs.existsSync(target)) continue;
  const svg = buildSvg(refs.get(oldName)?.title || newName);
  fs.writeFileSync(target, svg, "utf8");
  generated++;
}

let rewritten = 0;
for (const file of ARTICLE_FILES) {
  const full = path.join(ROOT, file);
  if (!fs.existsSync(full)) continue;
  let src = fs.readFileSync(full, "utf8");
  const before = src;
  src = src.replace(/(image|infographic):\s*"([^"]+)"/g, (fullMatch, field, name) => {
    if (mapping[name]) return `${field}: "${mapping[name]}"`;
    return fullMatch;
  });
  if (src !== before) { fs.writeFileSync(full, src, "utf8"); rewritten++; }
}

console.log("✅ تحويلات:", Object.keys(mapping).length);
console.log("✅ SVG مولّدة:", generated);
console.log("✅ ملفات .ts معدّلة:", rewritten);

let dbUpdated = false;
try {
  const { Pool } = await import("pg");
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("لا يوجد DATABASE_URL في .env.local");
  const pool = new Pool({ connectionString: url });
  const r = await pool.query(`
    UPDATE blog_posts
    SET image      = regexp_replace(image,      '\\.(jpg|jpeg|png|webp)$', '.svg'),
        infographic = regexp_replace(infographic, '\\.(jpg|jpeg|png|webp)$', '.svg')
    WHERE image ~ '\\.(jpg|jpeg|png|webp)$' OR infographic ~ '\\.(jpg|jpeg|png|webp)$'
  `);
  console.log("✅ صفوف قاعدة البيانات المحدّثة:", r.rowCount ?? "?");
  dbUpdated = true;
  await pool.end();
} catch (e) {
  console.error("⚠️ تعذّر تحديث قاعدة البيانات تلقائياً:", e.message);
  console.error("   نفّذ هذا SQL يدوياً في Neon SQL Editor:");
  console.error("   UPDATE blog_posts SET image = regexp_replace(image, '\\.(jpg|jpeg|png|webp)$', '.svg'), infographic = regexp_replace(infographic, '\\.(jpg|jpeg|png|webp)$', '.svg') WHERE image ~ '\\.(jpg|jpeg|png|webp)$' OR infographic ~ '\\.(jpg|jpeg|png|webp)$';");
}

if (!dbUpdated) process.exitCode = 1;
