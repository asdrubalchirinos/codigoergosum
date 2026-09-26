import { getCollection } from "astro:content";
import {
  RSS_FULL_CONTENT_ITEMS,
  SITE_DESCRIPTION,
  SITE_TITLE,
} from "../consts";
import { buildExcerpt, toFeedHtml } from "../utils/feed";

const AUTHOR = { name: "Asdrúbal Chirinos", url: "https://x.com/achirinos" };

export async function GET(context: { site: URL | undefined }) {
  const site = context.site;
  if (!site) {
    return new Response("JSON Feed requires Astro `site` config.", {
      status: 500,
    });
  }

  const posts = await getCollection("blog", ({ data }) => {
    return import.meta.env.PROD
      ? data.draft !== true && data.pubDate <= new Date()
      : true;
  });

  const sortedPosts = posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );

  const titles = new Map<string, string>(
    posts.map((post) => [post.slug, post.data.title]),
  );

  const items = await Promise.all(
    sortedPosts.map(async (post, index) => {
      const url = new URL(`/blog/${post.slug}/`, site).toString();
      const item: Record<string, unknown> = {
        id: url,
        url,
        title: post.data.title,
        date_published: post.data.pubDate.toISOString(),
        authors: [{ name: post.data.author || AUTHOR.name }],
        tags: post.data.tags.length ? post.data.tags : undefined,
        kind: post.data.kind,
      };

      if (post.data.updatedDate) {
        item.date_modified = post.data.updatedDate.toISOString();
      }
      if (post.data.heroImage) {
        item.image = new URL(post.data.heroImage, site).toString();
      }

      if (index < RSS_FULL_CONTENT_ITEMS && post.body) {
        item.content_html = await toFeedHtml(post.body, titles, site);
      } else {
        item.content_text = buildExcerpt(post.data.subtitle, post.body, titles);
      }

      return item;
    }),
  );

  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    title: SITE_TITLE,
    home_page_url: new URL("/", site).toString(),
    feed_url: new URL("/feed.json", site).toString(),
    description: SITE_DESCRIPTION,
    language: "es",
    authors: [AUTHOR],
    items,
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: { "Content-Type": "application/feed+json; charset=utf-8" },
  });
}
