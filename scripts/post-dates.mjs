import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

// Debe interpretar las fechas igual que `parseDateExact` en src/content/config.ts:
// YYYY-MM-DD es medianoche local, no UTC.
function toDate(value) {
  if (!value) return undefined;
  let date;
  if (value instanceof Date) {
    date = value;
  } else {
    const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})(?:T.*)?$/);
    date = match
      ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
      : new Date(String(value));
  }
  if (Number.isNaN(date.getTime())) return undefined;
  return date;
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
 * Posts publicables (sin draft y sin pubDate futura), ordenados por pubDate
 * descendente, más el mapa URL -> lastmod.
 * `lastmod` usa `updatedDate` si existe y `pubDate` como fallback.
 * @returns {{
 *   byPath: Map<string, string>,
 *   posts: { slug: string, tags: string[], published: string, lastmod: string }[],
 * }}
 */
export function collectPostLastmod() {
  const byPath = new Map();
  const contentDir = path.join(rootDir, "src", "content", "blog");
  const now = new Date();
  /** @type {{ slug: string, tags: string[], published: string, lastmod: string, pubTime: number }[]} */
  const collected = [];

  for (const file of walk(contentDir)) {
    let data;
    try {
      ({ data } = matter(fs.readFileSync(file, "utf8")));
    } catch {
      continue;
    }
    if (data.draft === true) continue;
    const pubDate = toDate(data.pubDate);
    if (!pubDate || pubDate > now) continue;

    const relative = path
      .relative(contentDir, file)
      .replace(/\.mdx?$/, "")
      .split(path.sep)
      .join("/");
    const slug =
      typeof data.slug === "string" && data.slug.trim()
        ? data.slug.trim()
        : relative;
    const published = pubDate.toISOString();
    const lastmod = toDate(data.updatedDate)?.toISOString() ?? published;
    const tags = Array.isArray(data.tags)
      ? data.tags.filter((tag) => typeof tag === "string")
      : [];

    byPath.set(`/blog/${slug}/`, lastmod);
    collected.push({ slug, tags, published, lastmod, pubTime: pubDate.getTime() });
  }

  collected.sort((a, b) => b.pubTime - a.pubTime);

  return {
    byPath,
    posts: collected.map(({ slug, tags, published, lastmod }) => ({
      slug,
      tags,
      published,
      lastmod,
    })),
  };
}
