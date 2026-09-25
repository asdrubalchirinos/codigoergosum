import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

function toIso(value) {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.mdx?$/.test(entry.name)) out.push(full);
  }
  return out;
}

/**
 * Mapa de URL de post -> última fecha de modificación (ISO).
 * Usa `updatedDate` si existe y `pubDate` como fallback.
 */
export function collectPostLastmod() {
  const byPath = new Map();
  const contentDir = path.join(rootDir, "src", "content", "blog");
  let newest;

  for (const file of walk(contentDir)) {
    let data;
    try {
      ({ data } = matter(fs.readFileSync(file, "utf8")));
    } catch {
      continue;
    }
    if (data.draft === true) continue;
    const relative = path
      .relative(contentDir, file)
      .replace(/\.mdx?$/, "")
      .split(path.sep)
      .join("/");
    const slug = typeof data.slug === "string" && data.slug.trim() ? data.slug.trim() : relative;
    const lastmod = toIso(data.updatedDate) ?? toIso(data.pubDate);
    if (!lastmod) continue;
    byPath.set(`/blog/${slug}/`, lastmod);
    if (!newest || lastmod > newest) newest = lastmod;
  }

  return { byPath, newest };
}
