import fs from 'fs/promises';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOG_DIR = path.join(__dirname, '../src/content/blog');
const PUBLIC_IMG_DIR = path.join(__dirname, '../public/images/blog');

async function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: Status Code ${res.statusCode}`));
        return;
      }
      // Create a write stream to the destination file
      // We need to import fs as standard fs for createWriteStream, or use fs/promises and handle it differently.
      // Let's use standard fs for streams.
      import('fs').then((fsStandard) => {
          const fileStream = fsStandard.createWriteStream(destPath);
          res.pipe(fileStream);
          fileStream.on('finish', () => {
            fileStream.close();
            resolve();
          });
          fileStream.on('error', (err) => {
             fsStandard.unlink(destPath, () => {}); // Delete the file async
             reject(err);
          });
      });

    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function processFile(filename) {
  const filePath = path.join(BLOG_DIR, filename);
  let content = await fs.readFile(filePath, 'utf-8');
  const slug = path.basename(filename, '.md');
  const postImgDir = path.join(PUBLIC_IMG_DIR, slug);

  // Regex to find Substack images
  // Example: https://substack-post-media.s3.amazonaws.com/public/images/bc2e480f-bab4-41d8-b475-924ba1853ff6_996x409.png
  const regex = /https:\/\/substack-post-media\.s3\.amazonaws\.com\/[^)\s"]+/g;
  const matches = [...new Set(content.match(regex) || [])]; // Deduplicate matches

  if (matches.length === 0) {
    return;
  }

  console.log(`Processing ${filename}: Found ${matches.length} images.`);

  // Create directory for the post if it doesn't exist
  await fs.mkdir(postImgDir, { recursive: true });

  for (const url of matches) {
    try {
        // Extract filename from URL, handling potential query parameters if any (though usually clean in these links)
        const urlObj = new URL(url);
        const originalName = path.basename(urlObj.pathname);
        // Clean filename just in case
        const cleanName = originalName.replace(/[^a-zA-Z0-9._-]/g, '_');
        const localPath = path.join(postImgDir, cleanName);
        const publicPath = `/images/blog/${slug}/${cleanName}`;

        // Check if file already exists to avoid re-downloading
        try {
            await fs.access(localPath);
            // console.log(`  Skipping ${cleanName} (already exists)`);
        } catch {
            console.log(`  Downloading ${cleanName}...`);
            await downloadImage(url, localPath);
        }

        // Replace URL in content
        // Use replaceAll or a global regex replace for this specific URL
        content = content.split(url).join(publicPath);
        
    } catch (error) {
        console.error(`  Error processing image ${url}:`, error.message);
    }
  }

  await fs.writeFile(filePath, content, 'utf-8');
  console.log(`  Updated ${filename}`);
}

async function main() {
  try {
    const files = await fs.readdir(BLOG_DIR);
    const mdFiles = files.filter(f => f.endsWith('.md'));

    console.log(`Found ${mdFiles.length} markdown files.`);

    for (const file of mdFiles) {
      await processFile(file);
    }

    console.log('Done!');
  } catch (err) {
    console.error('Error:', err);
  }
}

main();
