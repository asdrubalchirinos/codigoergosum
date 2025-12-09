import fs from 'fs';
import path from 'path';
import mjml2html from 'mjml';
import matter from 'gray-matter';
import Handlebars from 'handlebars';
import { parseArgs } from 'node:util';

const POSTS_DIR = path.join(process.cwd(), 'src/content/blog');
const TEMPLATE_PATH = path.join(process.cwd(), 'src/templates/newsletter.mjml');
const OUTPUT_DIR = path.join(process.cwd(), 'dist');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'newsletter.html');
const SITE_URL = 'https://codigoergosum.com'; // Or import from consts if available

// Ensure output dir exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
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

    // Extract a clean excerpt from the markdown body if description is missing
    // Simple heuristic: first paragraph
    let excerpt = data.description;
    if (!excerpt) {
        const paragraphs = markdownBody.split('\n\n');
        // Find first paragraph that is not an image (starts with !) and has text
        excerpt = paragraphs.find(p => {
            const trimmed = p.trim();
            return trimmed.length > 0 && !trimmed.startsWith('!') && !trimmed.startsWith('#') && !trimmed.startsWith('<');
        }) || '';
        
        // Strip markdown syntax roughly
        excerpt = excerpt.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1').replace(/[*_`]/g, '');
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
