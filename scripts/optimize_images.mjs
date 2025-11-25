import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOG_DIR = path.join(__dirname, '../src/content/blog');
const PUBLIC_IMG_DIR = path.join(__dirname, '../public/images/blog');

const MAX_WIDTH = 1020;
const QUALITY = 80;

// Supported image extensions
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.tiff', '.gif'];

async function optimizeImage(filePath) {
  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();

    let pipeline = image;
    let changed = false;

    // Resize if wider than MAX_WIDTH
    if (metadata.width > MAX_WIDTH) {
      pipeline = pipeline.resize({ width: MAX_WIDTH });
      changed = true;
    }

    // Always re-encode to optimize size, even if dimensions didn't change
    // We need to know the format to set quality
    const format = metadata.format;
    
    // Apply compression based on format
    switch (format) {
      case 'jpeg':
      case 'jpg':
        pipeline = pipeline.jpeg({ quality: QUALITY, mozjpeg: true });
        break;
      case 'png':
        pipeline = pipeline.png({ quality: QUALITY, compressionLevel: 8 });
        break;
      case 'webp':
        pipeline = pipeline.webp({ quality: QUALITY });
        break;
      case 'avif':
        pipeline = pipeline.avif({ quality: QUALITY });
        break;
      case 'tiff':
        pipeline = pipeline.tiff({ quality: QUALITY });
        break;
      case 'gif':
        // Sharp has limited GIF optimization support, but we can try
        // Often better to leave GIFs alone or use specific tools, but user asked to optimize all.
        // Re-encoding animated GIFs can be tricky with simple sharp pipeline.
        // Let's skip resizing/re-encoding GIFs to avoid breaking animations unless explicitly handled.
        // For now, let's only process static images safely or simple re-encoding.
        // If it's animated, sharp might only process the first frame by default unless `animated: true` is set.
        // Let's skip GIF optimization for safety in this V1 unless we are sure.
        // User said "optimize images", usually implies photos.
        // Let's stick to safe formats.
        if (metadata.pages > 1) {
             // console.log(`Skipping animated GIF: ${path.basename(filePath)}`);
             return;
        }
        break;
    }

    // To save to the same file, we typically write to a buffer then write back, 
    // or write to a temp file and rename. Buffer is easiest for reasonable sized images.
    const buffer = await pipeline.toBuffer();
    
    // Compare sizes
    const originalStats = await fs.stat(filePath);
    const originalSize = originalStats.size;
    const newSize = buffer.length;

    if (newSize < originalSize) {
        await fs.writeFile(filePath, buffer);
        console.log(`  Optimized ${path.basename(filePath)}: ${(originalSize / 1024).toFixed(2)}KB -> ${(newSize / 1024).toFixed(2)}KB`);
    } else {
        // If optimization didn't save space (can happen with already optimized images), 
        // but we resized it, we should still save it?
        // User said "reduce images that have more than 1020px".
        // So if we resized, we MUST save.
        if (changed) {
             await fs.writeFile(filePath, buffer);
             console.log(`  Resized ${path.basename(filePath)} (size increased/same: ${(originalSize / 1024).toFixed(2)}KB -> ${(newSize / 1024).toFixed(2)}KB)`);
        } else {
             // console.log(`  Skipped ${path.basename(filePath)} (no size reduction)`);
        }
    }

  } catch (error) {
    console.error(`  Error optimizing ${filePath}:`, error.message);
  }
}

async function processPost(filename) {
  const slug = path.basename(filename, '.md');
  const postImgDir = path.join(PUBLIC_IMG_DIR, slug);

  try {
    await fs.access(postImgDir);
  } catch {
    // Directory doesn't exist, skip
    return;
  }

  const files = await fs.readdir(postImgDir);
  
  // Filter for image files
  const imageFiles = files.filter(f => IMAGE_EXTENSIONS.includes(path.extname(f).toLowerCase()));

  if (imageFiles.length > 0) {
      console.log(`Checking images for: ${slug}`);
      for (const file of imageFiles) {
        await optimizeImage(path.join(postImgDir, file));
      }
  }
}

async function main() {
  try {
    console.log('Starting image optimization...');
    const files = await fs.readdir(BLOG_DIR);
    const mdFiles = files.filter(f => f.endsWith('.md'));

    for (const file of mdFiles) {
      await processPost(file);
    }

    console.log('Image optimization complete!');
  } catch (err) {
    console.error('Error:', err);
  }
}

main();
