import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import slugify from 'slugify';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const POSTS_DIR = path.join(__dirname, '../src/content/blog');
const IMAGES_DIR = path.join(__dirname, '../public/images/blog');

// Helper to get today's date in dd/mm/yyyy format
function getTodayFormatted() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  return `${day}/${month}/${year}`;
}

// Helper to validate dd/mm/yyyy format and convert to yyyy-mm-dd
function parseAndValidateDate(input) {
  const trimmed = input.trim();
  
  // Check format with regex
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = trimmed.match(regex);
  
  if (!match) {
    return { valid: false, error: 'Invalid format. Use dd/mm/yyyy' };
  }
  
  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);
  
  // Basic validation
  if (month < 1 || month > 12) {
    return { valid: false, error: 'Invalid month (01-12)' };
  }
  
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) {
    return { valid: false, error: `Invalid day for month ${month} (01-${daysInMonth})` };
  }
  
  // Convert to yyyy-mm-dd format
  const pubDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  
  return { valid: true, pubDate, year, month: String(month).padStart(2, '0') };
}

async function createPost() {
  const todayFormatted = getTodayFormatted();
  
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Post Title:',
      validate: (input) => input ? true : 'Title is required',
    },
    {
      type: 'input',
      name: 'pubDateInput',
      message: `Publication Date (dd/mm/yyyy):`,
      default: todayFormatted,
      validate: (input) => {
        const result = parseAndValidateDate(input);
        return result.valid ? true : result.error;
      },
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

  // Parse the validated date
  const dateResult = parseAndValidateDate(answers.pubDateInput);
  const pubDate = dateResult.pubDate;
  const year = dateResult.year;
  const month = dateResult.month;

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
draft: true
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
