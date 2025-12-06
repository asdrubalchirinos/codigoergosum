import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import slugify from 'slugify';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const POSTS_DIR = path.join(__dirname, '../src/content/blog');
const IMAGES_DIR = path.join(__dirname, '../public/images/blog');

async function createPost() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Post Title:',
      validate: (input) => input ? true : 'Title is required',
    },
    {
      type: 'confirm',
      name: 'isMdx',
      message: 'Is this an MDX post?',
      default: false,
    },
    {
      type: 'confirm',
      name: 'isEnglish',
      message: 'Is this post in English?',
      default: false,
    },
  ]);

  const fileType = answers.isMdx ? 'mdx' : 'md';

  const slug = slugify(answers.title, {
    lower: true,
    strict: true,
  });

  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const pubDate = `${year}-${month}-${day}`;

  const targetDir = path.join(POSTS_DIR, String(year), month);
  const imageDir = path.join(IMAGES_DIR, slug);

  // Create directories
  fs.mkdirSync(targetDir, { recursive: true });
  fs.mkdirSync(imageDir, { recursive: true });

  // Copy placeholder image
  const placeholderPath = path.join(__dirname, '../public/placeholder.png');
  const heroPath = path.join(imageDir, 'hero.png');
  
  try {
    fs.copyFileSync(placeholderPath, heroPath);
  } catch (err) {
    console.warn('⚠️  Warning: Could not copy placeholder image.', err.message);
  }

  const fileName = `${slug}.${fileType}`;
  const filePath = path.join(targetDir, fileName);

  // Build frontmatter with optional lang field for English posts
  const langLine = answers.isEnglish ? `\nlang: en` : '';
  
  let fileContent = `---
title: ${answers.title}
subtitle: ''
pubDate: '${pubDate}'
heroImage: /images/blog/${slug}/hero.png
author: Asdrúbal Chirinos
featured: false
tags: []
slug: ${slug}${langLine}
---
`;

  if (fileType === 'mdx') {
    fileContent += `
import PostReference from '@components/PostReference.astro';
`;
  }


  if (fs.existsSync(filePath)) {
    console.error(`\n❌ Error: File already exists at ${filePath}`);
    process.exit(1);
  }

  fs.writeFileSync(filePath, fileContent);

  console.log(`\n✅ Post created successfully!`);
  console.log(`📄 File: ${filePath}`);
  console.log(`🖼️  Image Folder: ${imageDir}`);
}

createPost().catch(console.error);
