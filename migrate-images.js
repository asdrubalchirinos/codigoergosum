import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOG_DIR = path.join(__dirname, 'src/content/blog');
const IMAGES_DIR = path.join(__dirname, 'public/images/blog');

// Track migration stats
const stats = {
  processed: 0,
  updated: 0,
  moved: 0,
  skipped: 0,
  errors: []
};

/**
 * Recursively find all .md and .mdx files
 */
function findBlogPosts(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findBlogPosts(fullPath, files);
    } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.mdx'))) {
      files.push(fullPath);
    }
  }
  
  return files;
}

/**
 * Extract year and month from date
 */
function getYearMonth(dateStr) {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return { year, month };
}

/**
 * Get slug from file path
 */
function getSlug(filePath) {
  const relativePath = path.relative(BLOG_DIR, filePath);
  // Remove extension and get the filename
  const slug = path.basename(relativePath, path.extname(relativePath));
  return slug;
}

/**
 * Process a single blog post
 */
function processBlogPost(filePath) {
  stats.processed++;
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const { data, content: markdownContent } = matter(content);
    
    // Skip if no heroImage
    if (!data.heroImage) {
      stats.skipped++;
      console.log(`⊘ Skipped (no heroImage): ${path.relative(__dirname, filePath)}`);
      return;
    }
    
    // Skip if heroImage doesn't start with /images/blog/
    if (!data.heroImage.startsWith('/images/blog/')) {
      stats.skipped++;
      console.log(`⊘ Skipped (external image): ${path.relative(__dirname, filePath)}`);
      return;
    }
    
    // Extract current image path
    const currentImagePath = data.heroImage.replace('/images/blog/', '');
    const pathParts = currentImagePath.split('/');
    
    // Check if already in year/month format
    if (pathParts.length >= 3 && /^\d{4}$/.test(pathParts[0]) && /^\d{2}$/.test(pathParts[1])) {
      stats.skipped++;
      console.log(`✓ Already migrated: ${path.relative(__dirname, filePath)}`);
      return;
    }
    
    // Get year/month from pubDate
    const { year, month } = getYearMonth(data.pubDate);
    const slug = getSlug(filePath);
    
    // Build new paths
    const oldImageFolder = path.join(IMAGES_DIR, pathParts[0]);
    const newImageFolder = path.join(IMAGES_DIR, String(year), month, slug);
    const newHeroImagePath = `/images/blog/${year}/${month}/${slug}/${pathParts.slice(1).join('/')}`;
    
    // Check if old image folder exists
    if (!fs.existsSync(oldImageFolder)) {
      stats.skipped++;
      console.log(`⊘ Skipped (image folder not found): ${oldImageFolder}`);
      return;
    }
    
    // Create new directory structure
    fs.mkdirSync(newImageFolder, { recursive: true });
    
    // Move image folder
    const oldFolderContents = fs.readdirSync(oldImageFolder);
    for (const file of oldFolderContents) {
      const oldFilePath = path.join(oldImageFolder, file);
      const newFilePath = path.join(newImageFolder, file);
      
      if (fs.statSync(oldFilePath).isFile()) {
        fs.renameSync(oldFilePath, newFilePath);
      }
    }
    
    // Remove old folder if empty
    if (fs.readdirSync(oldImageFolder).length === 0) {
      fs.rmdirSync(oldImageFolder);
    }
    
    stats.moved++;
    
    // Update frontmatter
    data.heroImage = newHeroImagePath;
    
    // Also update any inline image references in content
    let updatedContent = markdownContent;
    const oldImagePathPattern = new RegExp(`/images/blog/${pathParts[0]}/`, 'g');
    const newImagePathPrefix = `/images/blog/${year}/${month}/${slug}/`;
    updatedContent = updatedContent.replace(oldImagePathPattern, newImagePathPrefix);
    
    // Write updated file
    const updatedFile = matter.stringify(updatedContent, data);
    fs.writeFileSync(filePath, updatedFile, 'utf8');
    
    stats.updated++;
    console.log(`✓ Migrated: ${path.relative(__dirname, filePath)} → ${year}/${month}/${slug}`);
    
  } catch (error) {
    stats.errors.push({ file: filePath, error: error.message });
    console.error(`✗ Error processing ${path.relative(__dirname, filePath)}:`, error.message);
  }
}

/**
 * Main migration function
 */
function migrate() {
  console.log('🚀 Starting image folder migration...\n');
  
  const blogPosts = findBlogPosts(BLOG_DIR);
  console.log(`Found ${blogPosts.length} blog posts\n`);
  
  for (const postPath of blogPosts) {
    processBlogPost(postPath);
  }
  
  console.log('\n📊 Migration Summary:');
  console.log(`   Total processed: ${stats.processed}`);
  console.log(`   Updated: ${stats.updated}`);
  console.log(`   Folders moved: ${stats.moved}`);
  console.log(`   Skipped: ${stats.skipped}`);
  console.log(`   Errors: ${stats.errors.length}`);
  
  if (stats.errors.length > 0) {
    console.log('\n❌ Errors:');
    stats.errors.forEach(({ file, error }) => {
      console.log(`   ${path.relative(__dirname, file)}: ${error}`);
    });
  }
  
  console.log('\n✅ Migration complete!');
}

// Run migration
migrate();
