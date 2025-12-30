import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import matter from 'gray-matter';

// Configuration
const OLLAMA_API = 'http://localhost:11434/api/generate';
const MODEL = process.env.OLLAMA_MODEL || 'llama3.2';
const BLOG_DIR = 'src/content/blog';

// ANSI colors for output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    red: '\x1b[31m',
    dim: '\x1b[2m',
    cyan: '\x1b[36m'
};

/**
 * Recursively get all .md and .mdx files from a directory
 */
function getAllBlogFiles(dir) {
    const files = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...getAllBlogFiles(fullPath));
        } else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) {
            files.push(fullPath);
        }
    }
    return files;
}

/**
 * Extract all unique tags from existing blog posts
 */
function getExistingTags() {
    const blogPath = path.resolve(process.cwd(), BLOG_DIR);
    const allFiles = getAllBlogFiles(blogPath);
    const tagSet = new Set();

    for (const filePath of allFiles) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const parsed = matter(content);
            
            if (parsed.data.tags && Array.isArray(parsed.data.tags)) {
                parsed.data.tags.forEach(tag => tagSet.add(tag));
            }
        } catch (error) {
            // Skip files that can't be parsed
        }
    }

    return Array.from(tagSet).sort();
}

async function generateTags(content, existingTags) {
    const tagList = existingTags.length > 0 
        ? existingTags.join(', ') 
        : 'No existing tags yet';

    const prompt = `
You are an expert tech blog editor. Analyze the following blog post content and generate a list of 3 to 5 relevant tags.

EXISTING TAGS IN THE BLOG: [${tagList}]

CRITICAL INSTRUCTIONS:
1. You MUST prefer selecting tags from the EXISTING TAGS list above.
2. Only suggest a NEW tag if the topic is genuinely not covered by any existing tag.
3. If you must suggest a new tag, prefix it with [NEW] so it can be reviewed.
4. All tags MUST be in Spanish (e.g., "desarrollo-web", "inteligencia-artificial").
5. Output ONLY a raw JSON array of strings. No markdown, no explanations.

Example output: ["javascript", "desarrollo-web", "[NEW] computacion-cuantica"]

Blog Post:
${content.substring(0, 3000)}... (truncated)
`;

    try {
        const response = await fetch(OLLAMA_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: MODEL,
                prompt: prompt,
                stream: false
            })
        });

        if (!response.ok) {
            throw new Error(`Ollama API error: ${response.statusText}`);
        }

        const data = await response.json();
        const cleanResponse = data.response.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanResponse);
    } catch (error) {
        console.error(`${colors.red}Error generating tags with ${MODEL}:${colors.reset}`, error.message);
        return null;
    }
}

/**
 * Process tags: separate existing from new, clean up [NEW] prefix
 */
function processTags(tags) {
    const reused = [];
    const newTags = [];

    for (const tag of tags) {
        if (tag.startsWith('[NEW]')) {
            const cleanTag = tag.replace('[NEW]', '').trim();
            newTags.push(cleanTag);
        } else {
            reused.push(tag);
        }
    }

    return { reused, newTags, allTags: [...reused, ...newTags] };
}

function getPendingPosts() {
    try {
        const statusOutput = execSync('git status --porcelain').toString();
        const files = statusOutput
            .split('\n')
            .filter(line => line.trim() !== '')
            .map(line => {
                const status = line.substring(0, 2);
                const filename = line.substring(3).trim();
                return { status, filename };
            })
            .filter(file => {
                return (
                    (file.filename.endsWith('.md') || file.filename.endsWith('.mdx')) &&
                    file.filename.includes(BLOG_DIR)
                );
            });

        return files;
    } catch (error) {
        console.error(`${colors.red}Error checking git status:${colors.reset}`, error.message);
        return [];
    }
}

async function main() {
    console.log(`${colors.blue}🔍 Checking for pending blog posts...${colors.reset}`);
    
    // Step 1: Get existing tags vocabulary
    console.log(`${colors.dim}📚 Loading existing tags vocabulary...${colors.reset}`);
    const existingTags = getExistingTags();
    console.log(`${colors.dim}   Found ${existingTags.length} unique tags: [${existingTags.slice(0, 5).join(', ')}${existingTags.length > 5 ? '...' : ''}]${colors.reset}`);
    
    const pendingFiles = getPendingPosts();

    if (pendingFiles.length === 0) {
        console.log(`${colors.yellow}No pending blog posts found.${colors.reset}`);
        return;
    }

    console.log(`${colors.dim}Found ${pendingFiles.length} candidate(s).${colors.reset}`);

    for (const file of pendingFiles) {
        const filePath = path.resolve(process.cwd(), file.filename);
        
        if (!fs.existsSync(filePath)) continue;

        const fileContent = fs.readFileSync(filePath, 'utf8');
        const parsed = matter(fileContent);

        // Skip if tags already exist and are not empty
        if (parsed.data.tags && Array.isArray(parsed.data.tags) && parsed.data.tags.length > 0) {
            console.log(`${colors.dim}⏭️  Skipping ${file.filename} (tags already exist)${colors.reset}`);
            continue;
        }

        console.log(`${colors.blue}🤖 Generating tags for: ${colors.green}${file.filename}${colors.reset} using ${colors.blue}${MODEL}${colors.reset}...`);
        
        const generatedTags = await generateTags(parsed.content, existingTags);

        if (generatedTags && Array.isArray(generatedTags)) {
            const { reused, newTags, allTags } = processTags(generatedTags);
            
            // Update frontmatter with clean tags
            parsed.data.tags = allTags;
            
            const newContent = matter.stringify(parsed.content, parsed.data);
            fs.writeFileSync(filePath, newContent);
            
            // Display results
            if (reused.length > 0) {
                console.log(`${colors.green}   ✅ Reutilizados: [${reused.join(', ')}]${colors.reset}`);
            }
            if (newTags.length > 0) {
                console.log(`${colors.yellow}   ⚠️  Nuevos sugeridos: [${newTags.join(', ')}] ← Revisar si son necesarios${colors.reset}`);
            }
            console.log(`${colors.cyan}   📝 Tags guardados: [${allTags.join(', ')}]${colors.reset}`);
        } else {
            console.log(`${colors.red}❌ Failed to generate valid tags for ${file.filename}${colors.reset}`);
        }
    }
}

main();
