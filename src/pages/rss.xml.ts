import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import fs from "node:fs";
import path from "node:path";
import {
  RSS_FULL_CONTENT_ITEMS,
  SITE_DESCRIPTION,
  SITE_TITLE,
} from "../consts";
import { buildExcerpt, escapeXml, toFeedHtml } from "../utils/feed";

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
    sortedPosts.map(async (post, index) => {
      const enclosure = post.data.heroImage
        ? `<enclosure url="${new URL(post.data.heroImage, site).toString()}" type="${getImageMimeType(post.data.heroImage)}" length="${getImageLengthBytes(post.data.heroImage)}" />`
        : "";
      const creator = escapeXml(post.data.author || "Asdrúbal Chirinos");

      return {
        title: post.data.title,
        pubDate: post.data.pubDate,
        description: buildExcerpt(post.data.subtitle, post.body, titles),
        link: `/blog/${post.slug}/`,
        categories: post.data.tags.length ? post.data.tags : undefined,
        content:
          index < RSS_FULL_CONTENT_ITEMS && post.body
            ? await toFeedHtml(post.body, titles, site)
            : undefined,
        customData: `${enclosure}<dc:creator>${creator}</dc:creator>`,
      };
    }),
  );

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site,
    xmlns: {
      atom: "http://www.w3.org/2005/Atom",
      dc: "http://purl.org/dc/elements/1.1/",
    },
    items,
    customData:
      `<language>es</language>` +
      `<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>` +
      `<atom:link href="${new URL("rss.xml", site).toString()}" rel="self" type="application/rss+xml" />`,
  });
}
