import fs from 'fs';
import path from 'path';
import mjml2html from 'mjml';
import matter from 'gray-matter';
import Handlebars from 'handlebars';
import { parseArgs } from 'node:util';
import { marked } from 'marked';

const POSTS_DIR = path.join(process.cwd(), 'src/content/blog');
const TEMPLATE_PATH = path.join(process.cwd(), 'src/templates/newsletter.mjml');
const OUTPUT_DIR = path.join(process.cwd(), 'dist');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'newsletter.html');
const SITE_URL = 'https://codigoergosum.com'; // Or import from consts if available

// Ensure output dir exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const HORIZONTAL_RULE_LINE = /^(?:---|\*\*\*|___)\s*$/;
const ASTRO_COMPONENT = /<[A-Z][A-Za-z0-9.]*\b[^>\n]*\/>/g;
const FALLBACK_MAX_CHARS = 1000;

function findFirstHorizontalRuleLineIndex(body) {
    const lines = body.split('\n');
    let inFence = false;

    for (let i = 0; i < lines.length; i++) {
        const trimmed = lines[i].trim();
        if (/^```/.test(trimmed)) {
            inFence = !inFence;
            continue;
        }
        if (inFence) continue;
        if (HORIZONTAL_RULE_LINE.test(trimmed)) return i;
    }

    return -1;
}

function sliceBeforeFirstHorizontalRule(body) {
    const hrLineIndex = findFirstHorizontalRuleLineIndex(body);
    if (hrLineIndex === -1) return null;

    return body.split('\n').slice(0, hrLineIndex).join('\n').trim();
}

function stripAuthoringNoise(text) {
    return text
        .replace(/^(import|export)\s[^\n]*\n+/gm, '')
        .replace(ASTRO_COMPONENT, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

function isContentParagraph(paragraph) {
    const trimmed = paragraph.trim();
    return (
        trimmed.length > 0 &&
        !trimmed.startsWith('!') &&
        !trimmed.startsWith('#') &&
        !trimmed.startsWith('<') &&
        !/^(import|export)\s/.test(trimmed)
    );
}

function extractFallbackParagraphs(markdownBody) {
    const paragraphs = markdownBody.split('\n\n').filter(isContentParagraph);

    if (paragraphs.length === 0) return '';

    let selectedText = paragraphs[0];
    let nextIndex = 1;

    if (selectedText.trim().startsWith('>') && paragraphs.length > 1) {
        selectedText += '\n\n' + paragraphs[1];
        nextIndex = 2;
    }

    while (nextIndex < paragraphs.length && selectedText.length < FALLBACK_MAX_CHARS) {
        const candidate = paragraphs[nextIndex];
        const joined = `${selectedText}\n\n${candidate}`;
        if (joined.length > FALLBACK_MAX_CHARS && selectedText.length > 0) break;
        selectedText = joined;
        nextIndex++;
    }

    return selectedText.trim();
}

function extractExcerptMarkdown(markdownBody) {
    const beforeHorizontalRule = sliceBeforeFirstHorizontalRule(markdownBody);
    const source = beforeHorizontalRule ?? extractFallbackParagraphs(markdownBody);
    return stripAuthoringNoise(source);
}

// Helper to recursively find file
function findPostFile(dir, slug) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const file of files) {
        if (file.isDirectory()) {
            const found = findPostFile(path.join(dir, file.name), slug);
            if (found) return found;
        } else if (file.name === `${slug}.md` || file.name === `${slug}.mdx`) {
            return path.join(dir, file.name);
        }
    }
    return null;
}

async function getPost(slug) {
    const filePath = findPostFile(POSTS_DIR, slug);
    
    if (!filePath) {
        throw new Error(`Post not found: ${slug}`);
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const { data, content: markdownBody } = matter(content);

    // Extract excerpt: body until first ---, or fallback for older posts
    let excerpt = data.description;
    if (!excerpt) {
        const excerptMarkdown = extractExcerptMarkdown(markdownBody);
        excerpt = excerptMarkdown ? marked.parse(excerptMarkdown) : '';
    } else {
        // If description exists (from frontmatter), treat it as plain text or simple markdown
        // Just in case, parse it too so styles are consistent
        excerpt = marked.parse(excerpt);
    }

    return {
        ...data,
        slug,
        excerpt,
        url: `${SITE_URL}/blog/${slug}/`,
        heroImage: data.heroImage ? `${SITE_URL}${data.heroImage}` : null
    };
}

async function build() {
    const { values } = parseArgs({
        args: process.argv.slice(2),
        options: {
            slug: {
                type: 'string',
            },
        },
    });

    if (!values.slug) {
        console.error('Error: --slug argument is required.');
        console.error('Usage: node scripts/newsletter/build-html.mjs --slug=my-post-slug');
        process.exit(1);
    }

    console.log(`Building newsletter for post: ${values.slug}...`);
    
    try {
        const post = await getPost(values.slug);
        const template = fs.readFileSync(TEMPLATE_PATH, 'utf-8');
        
        const hbTemplate = Handlebars.compile(template);
        
        const mjmlContent = hbTemplate({
            title: post.title,
            subtitle: post.subtitle,
            excerpt: post.excerpt,
            url: post.url,
            heroImage: post.heroImage,
            author: post.author || 'Código Ergo Sum',
            pubDate: new Date(post.pubDate).toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            }),
            year: new Date().getFullYear(),
            unsubscribeUrl: `${SITE_URL}/unsubscribe` // Placeholder
        });

        const { html, errors } = mjml2html(mjmlContent);

        if (errors.length > 0) {
            console.error('MJML Errors:', errors);
            process.exit(1);
        }

        fs.writeFileSync(OUTPUT_FILE, html);
        console.log(`Newsletter generated at ${OUTPUT_FILE}`);
    } catch (error) {
        console.error('Build failed:', error.message);
        process.exit(1);
    }
}

build().catch(console.error);
