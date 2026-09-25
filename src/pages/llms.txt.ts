import { getCollection } from "astro:content";
import { RSS_FULL_CONTENT_ITEMS, SITE_DESCRIPTION, SITE_TITLE } from "../consts";

// Artículos listados en el índice. El archivo completo está en el sitemap y en el RSS.
const RECENT_POSTS = 50;

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export async function GET(context: { site: URL | undefined }) {
  const site = context.site;
  if (!site) {
    return new Response("llms.txt requires Astro `site` config.", {
      status: 500,
    });
  }

  const absolute = (pathname: string) => new URL(pathname, site).toString();

  const posts = await getCollection("blog", ({ data }) => {
    return import.meta.env.PROD
      ? data.draft !== true && data.pubDate <= new Date()
      : true;
  });

  const sortedPosts = posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );

  const tagCounts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
  }
  const tags = [...tagCounts.entries()].sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
  );

  const newest = sortedPosts[0];
  const recent = sortedPosts.slice(0, RECENT_POSTS);
  const older = Math.max(sortedPosts.length - RECENT_POSTS, 0);

  const lines: string[] = [
    `# ${SITE_TITLE}`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    "Blog personal de Asdrúbal Chirinos. Artículos conceptualizados por el autor y editados con IA. Todo el contenido está en español.",
    "",
    "Sitio estático (Astro): cada artículo en /blog/<slug>/ trae el contenido completo en el HTML, sin JavaScript obligatorio. Para revisar el sitio de forma diaria, en orden de eficiencia:",
    "",
    `- [RSS](${absolute("/rss.xml")}): feed RSS 2.0 con pubDate, categorías y content:encoded (artículo completo) en los ${RSS_FULL_CONTENT_ITEMS} más recientes.`,
    `- [Últimos posts (JSON)](${absolute("/api/latest_posts.json")}): los 10 artículos más recientes con título, fecha, resumen, URL y etiquetas.`,
    `- [Sitemap](${absolute("/sitemap-index.xml")}): todas las URLs; los artículos incluyen <lastmod> para detectar cambios sin descargar el contenido.`,
    "",
    newest
      ? `Última publicación: ${formatDate(newest.data.pubDate)} — ${newest.data.title}`
      : "Sin publicaciones.",
    "",
    "## Artículos recientes",
    "",
    ...recent.map((post) => {
      const summary = post.data.subtitle?.replace(/\s+/g, " ").trim() ?? "";
      const postTags = post.data.tags.join(", ");
      const date = formatDate(post.data.pubDate);
      const parts = [`- [${post.data.title}](${absolute(`/blog/${post.slug}/`)}): ${date}`];
      if (summary) parts.push(` — ${summary}`);
      if (postTags) parts.push(` — etiquetas: ${postTags}`);
      return parts.join("");
    }),
    "",
    `Los ${older} artículos anteriores están en el [índice paginado](${absolute("/blog/")}) y en el [sitemap](${absolute("/sitemap-index.xml")}).`,
    "",
    "## Etiquetas",
    "",
    ...tags.map(
      ([tag, count]) =>
        `- [${tag}](${absolute(`/tags/${encodeURIComponent(tag)}/`)}): ${count} artículo${count === 1 ? "" : "s"}`,
    ),
    "",
    "## Secciones del sitio",
    "",
    `- [Inicio](${absolute("/")}): artículos destacados y últimos posts.`,
    `- [Blog](${absolute("/blog/")}): índice completo paginado.`,
    `- [RSS](${absolute("/rss.xml")}): feed completo.`,
    `- [JSON de últimos posts](${absolute("/api/latest_posts.json")}): salida estructurada.`,
    `- [llms.txt](${absolute("/llms.txt")}): este archivo.`,
    "",
    "## Herramientas para agentes",
    "",
    "- search_blog: tool registrada vía WebMCP en el navegador, que busca en el blog con Pagefind y devuelve título, URL y fragmento de los 5 primeros resultados.",
    "",
    "Respeta robots.txt. El sitio declara Content-Signal: ai-train=no, search=yes, ai-input=yes.",
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
