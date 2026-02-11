import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import fs from "node:fs";
import path from "node:path";
import { SITE_DESCRIPTION, SITE_TITLE } from "../consts";

function buildExcerpt(subtitle: string | undefined, body: string | undefined): string {
  if (subtitle && subtitle.trim().length > 0) return subtitle.trim();
  if (!body) return "";

  const cleaned = body
    .replace(/```[\s\S]*?```/g, "")
    .replace(/!\[(.*?)\]\((.*?)\)/g, "")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/[#>*`]/g, "")
    .replace(/\n+/g, " ")
    .trim();

  if (cleaned.length <= 240) return cleaned;
  return `${cleaned.slice(0, 240).trim()}…`;
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
  if (!context.site) {
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

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: buildExcerpt(post.data.subtitle, post.body),
      link: `/blog/${post.slug}/`,
      customData: post.data.heroImage
        ? `<enclosure url="${new URL(post.data.heroImage, context.site).toString()}" type="${getImageMimeType(post.data.heroImage)}" length="${getImageLengthBytes(post.data.heroImage)}" />`
        : undefined,
    })),
    customData: "<language>es</language>",
  });
}
