import { marked } from "marked";

export const EXCERPT_LENGTH = 500;

/**
 * Elimina la sintaxis propia de MDX de un cuerpo de post:
 * - líneas `import`/`export` (fuera de bloques de código)
 * - `<PostReference slug="..." />` → enlace legible al post referenciado
 */
export function stripMdxSyntax(
  body: string,
  titles: Map<string, string>,
): string {
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

/** Resumen para <description> / content_text, ya sin sintaxis MDX. */
export function buildExcerpt(
  subtitle: string | undefined,
  body: string | undefined,
  titles: Map<string, string>,
): string {
  if (subtitle && subtitle.trim().length > 0) return subtitle.trim();
  if (!body) return "";

  const cleaned = stripMdxSyntax(body, titles)
    .replace(/```[\s\S]*?```/g, "")
    // blockquotes (citas y referencias a otros posts) ensucian el resumen
    .replace(/^>.*$(?:\n|$)/gm, "")
    .replace(/!\[(.*?)\]\((.*?)\)/g, "")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/[#>*`]/g, "")
    .replace(/\n+/g, " ")
    .trim();

  if (cleaned.length <= EXCERPT_LENGTH) return cleaned;
  return `${cleaned.slice(0, EXCERPT_LENGTH).trim()}…`;
}

/** Cuerpo MDX → HTML listo para content:encoded / content_html. */
export async function toFeedHtml(
  body: string,
  titles: Map<string, string>,
  site: URL,
): Promise<string> {
  const html = await marked.parse(stripMdxSyntax(body, titles), {
    async: true,
  });
  const origin = site.origin;
  // Relativiza enlaces e imágenes para que funcionen fuera del sitio.
  return html.replace(/(href|src)="\/(?!\/)/g, `$1="${origin}/`);
}

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
