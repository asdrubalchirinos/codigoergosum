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
  
  // Validate date is today or in the future
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const inputDate = new Date(year, month - 1, day);
  inputDate.setHours(0, 0, 0, 0);
  
  if (inputDate < today) {
    return { valid: false, error: 'Date must be today or in the future' };
  }
  
  // Convert to yyyy-mm-dd format
  const pubDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  
  return { valid: true, pubDate, year, month: String(month).padStart(2, '0') };
}

// Helper to get the default date (next available slot or today)
function getDefaultDate() {
  try {
    // 1. Find latest year
    const years = fs.readdirSync(POSTS_DIR)
      .filter(f => /^\d{4}$/.test(f) && fs.statSync(path.join(POSTS_DIR, f)).isDirectory())
      .sort((a, b) => b - a); // Descending

    for (const year of years) {
      const yearPath = path.join(POSTS_DIR, year);
      
      // 2. Find latest month in that year
      const months = fs.readdirSync(yearPath)
        .filter(f => /^\d{2}$/.test(f) && fs.statSync(path.join(yearPath, f)).isDirectory())
        .sort((a, b) => b - a); // Descending

      for (const month of months) {
        const monthPath = path.join(yearPath, month);
        
        // 3. Scan files in that month
        const files = fs.readdirSync(monthPath)
          .filter(f => (f.endsWith('.md') || f.endsWith('.mdx')));

        let maxDate = null;

        for (const file of files) {
          const content = fs.readFileSync(path.join(monthPath, file), 'utf-8');
          // Extract pubDate: 'YYYY-MM-DD'
          const match = content.match(/pubDate:\s*['"]?(\d{4}-\d{2}-\d{2})['"]?/);
          
          if (match) {
            const date = new Date(match[1]);
            // Adjust for timezone offset to treat it as UTC/Local correctly for comparison
            // Or simply compare string values since format is YYYY-MM-DD
            if (!maxDate || match[1] > maxDate.str) {
              maxDate = { obj: date, str: match[1] };
            }
          }
        }

        if (maxDate) {
          // Found the latest post!
          // Calculate next day
          // Create date from the string components to avoid timezone issues
          const [y, m, d] = maxDate.str.split('-').map(Number);
          const lastDate = new Date(y, m - 1, d);
          
          const nextDate = new Date(lastDate);
          nextDate.setDate(lastDate.getDate() + 1);
          
          // Ensure suggested date is not earlier than today
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          nextDate.setHours(0, 0, 0, 0);
          
          const suggestedDate = nextDate < today ? today : nextDate;
          
          // Format as dd/mm/yyyy
          const dayStr = String(suggestedDate.getDate()).padStart(2, '0');
          const monthStr = String(suggestedDate.getMonth() + 1).padStart(2, '0');
          const yearStr = suggestedDate.getFullYear();
          
          return `${dayStr}/${monthStr}/${yearStr}`;
        }
      }
    }
  } catch (err) {
    // In case of error (e.g. empty folders), silent fail to today
    // console.error(err);
  }

  // Fallback to today if no posts found
  return getTodayFormatted();
}

async function createPost() {
  const defaultDate = getDefaultDate();
  
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
      default: defaultDate,
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
  const imageDir = path.join(IMAGES_DIR, String(year), month, slug);

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
heroImage: /images/blog/${year}/${month}/${slug}/hero.png
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
