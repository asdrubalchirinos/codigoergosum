import { marked } from "marked";

export const EXCERPT_LENGTH = 500;

const POST_REFERENCE = /<PostReference\s+slug=["']([^"']+)["']\s*\/>/g;
// Cierre, auto-cierre o apertura con atributos. Evita genéricos TS (`Promise<Response>`).
const JSX_COMPONENT =
  /<\/[A-Z][A-Za-z0-9]*\s*>|<([A-Z][A-Za-z0-9]*)(?:\s[^<>]*?)?\s*\/>|<([A-Z][A-Za-z0-9]*)\s+[^<>]*?>/g;
const INLINE_CODE = /`[^`]*`/g;

function referenceMarkdown(slug: string, titles: Map<string, string>): string {
  const title = titles.get(slug) ?? slug;
  return `**Ver también:** [${title}](/blog/${slug}/)`;
}

/** Quita componentes JSX PascalCase sin tocar código inline ni genéricos TS. */
function stripJsxComponents(line: string): string {
  const stubs: string[] = [];
  const masked = line.replace(INLINE_CODE, (code) => {
    stubs.push(code);
    return `\0CODE${stubs.length - 1}\0`;
  });
  return masked
    .replace(JSX_COMPONENT, "")
    .replace(/\0CODE(\d+)\0/g, (_, index: string) => stubs[Number(index)]);
}

/**
 * Elimina la sintaxis propia de MDX de un cuerpo de post:
 * - líneas `import`/`export` (fuera de bloques de código)
 * - `<PostReference slug="..." />` → enlace legible al post referenciado
 * - otros componentes JSX PascalCase (no genéricos TypeScript ni código `` `...` ``)
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
    if (inFence) {
      lines.push(line);
      continue;
    }
    if (/^\s*import\s+.*\bfrom\s+['"]/.test(line)) continue;
    if (/^\s*import\s+['"]/.test(line)) continue;
    if (/^\s*export\s+(const|function|class|default|\{)/.test(line)) continue;

    const onlyReference = line.match(
      /^\s*<PostReference\s+slug=["']([^"']+)["']\s*\/>\s*$/,
    );
    if (onlyReference) {
      lines.push(`> ${referenceMarkdown(onlyReference[1], titles)}`);
      continue;
    }

    const withReferences = line.replace(POST_REFERENCE, (_, slug: string) =>
      referenceMarkdown(slug, titles),
    );
    lines.push(stripJsxComponents(withReferences));
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
    breaks: true,
  });
  const origin = site.origin;
  // Absolutiza enlaces e imágenes para que funcionen fuera del sitio.
  const absolute = html.replace(/(href|src)="\/(?!\/)/g, `$1="${origin}/`);
  return absolute.replace(
    /<a href="(https?:\/\/[^"]+)"/g,
    (match, href: string) => {
      let linkOrigin: string;
      try {
        linkOrigin = new URL(href).origin;
      } catch {
        return match;
      }
      if (linkOrigin === origin) return match;
      return `<a href="${href}" target="_blank" rel="noopener noreferrer"`;
    },
  );
}

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
