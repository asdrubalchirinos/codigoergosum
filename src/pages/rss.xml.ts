import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { marked } from "marked";
import fs from "node:fs";
import path from "node:path";
import {
  RSS_FULL_CONTENT_ITEMS,
  SITE_DESCRIPTION,
  SITE_TITLE,
} from "../consts";

const EXCERPT_LENGTH = 500;

function buildExcerpt(
  subtitle: string | undefined,
  body: string | undefined,
): string {
  if (subtitle && subtitle.trim().length > 0) return subtitle.trim();
  if (!body) return "";

  const cleaned = body
    .replace(/```[\s\S]*?```/g, "")
    .replace(/!\[(.*?)\]\((.*?)\)/g, "")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/[#>*`]/g, "")
    .replace(/\n+/g, " ")
    .trim();

  if (cleaned.length <= EXCERPT_LENGTH) return cleaned;
  return `${cleaned.slice(0, EXCERPT_LENGTH).trim()}…`;
}

/**
 * Prepara el markdown de un post (MDX incluido) para convertirlo a HTML:
 * - elimina import/export propios de MDX
 * - convierte <PostReference slug="..." /> en un enlace legible
 */
function prepareMarkdown(body: string, titles: Map<string, string>): string {
  const lines: string[] = [];
  let inFence = false;

  for (const line of body.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      lines.push(line);
      continue;
    }
    if (!inFence) {
      if (/^\s*import\s+.*\bfrom\s+['"]/.test(line)) continue;
      if (/^\s*import\s+['"]/.test(line)) continue;
      if (/^\s*export\s+(const|function|class|default|\{)/.test(line)) continue;

      const reference = line.match(
        /^\s*<PostReference\s+slug=["']([^"']+)["']\s*\/>\s*$/,
      );
      if (reference) {
        const slug = reference[1];
        const title = titles.get(slug) ?? slug;
        lines.push(`> **Ver también:** [${title}](/blog/${slug}/)`);
        continue;
      }
    }
    lines.push(line);
  }

  return lines.join("\n");
}

/** Convierte el markdown a HTML y absolutiza los enlaces/imágenes relativos. */
async function toFeedHtml(
  body: string,
  titles: Map<string, string>,
  site: URL,
): Promise<string> {
  const html = await marked.parse(prepareMarkdown(body, titles), { async: true });
  const origin = site.origin;
  return html.replace(/(href|src)="\/(?!\/)/g, `$1="${origin}/`);
}

function getImageMimeType(imagePath: string): string {
  const ext = imagePath.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "avif":
      return "image/avif";
    case "gif":
      return "image/gif";
    case "svg":
      return "image/svg+xml";
    default:
      return "image/jpeg";
  }
}

function getImageLengthBytes(imagePath: string): number {
  const normalized = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;
  const candidates = [
    path.join(process.cwd(), "public", normalized),
    path.join(process.cwd(), "..", "public", normalized),
    path.join(process.cwd(), "..", "..", "public", normalized),
  ];

  for (const absolutePath of candidates) {
    try {
      if (fs.existsSync(absolutePath)) {
        return fs.statSync(absolutePath).size;
      }
    } catch {
      // Try next candidate.
    }
  }

  return 0;
}

export async function GET(context: { site: URL | undefined }) {
  const site = context.site;
  if (!site) {
    return new Response("RSS requires Astro `site` config.", { status: 500 });
  }

  const posts = await getCollection("blog", ({ data }) => {
    return import.meta.env.PROD
      ? data.draft !== true && data.pubDate <= new Date()
      : true;
  });

  const sortedPosts = posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );

  // Título por slug, para resolver las referencias cruzadas de los posts MDX.
  const titles = new Map<string, string>(
    posts.map((post) => [post.slug, post.data.title]),
  );

  const items = await Promise.all(
    sortedPosts.map(async (post, index) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: buildExcerpt(post.data.subtitle, post.body),
      link: `/blog/${post.slug}/`,
      categories: post.data.tags.length ? post.data.tags : undefined,
      content:
        index < RSS_FULL_CONTENT_ITEMS && post.body
          ? await toFeedHtml(post.body, titles, site)
          : undefined,
      customData: post.data.heroImage
        ? `<enclosure url="${new URL(post.data.heroImage, site).toString()}" type="${getImageMimeType(post.data.heroImage)}" length="${getImageLengthBytes(post.data.heroImage)}" />`
        : undefined,
    })),
  );

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site,
    items,
    customData: `<language>es</language><lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
  });
}
