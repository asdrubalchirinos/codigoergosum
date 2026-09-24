import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import matter from 'gray-matter';

const blogDirectory = path.resolve('src/content/blog');
const checkOnly = process.argv.includes('--check');
const postExtensions = new Set(['.md', '.mdx']);

function findPosts(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) return findPosts(entryPath);
    return postExtensions.has(path.extname(entry.name)) ? [entryPath] : [];
  });
}

const tags = new Set();
const issues = [];

for (const filePath of findPosts(blogDirectory)) {
  const relativePath = path.relative(process.cwd(), filePath);

  try {
    const { data } = matter(fs.readFileSync(filePath, 'utf8'));

    if (data.tags === undefined) {
      issues.push(`${relativePath}: falta el campo tags.`);
      continue;
    }

    if (!Array.isArray(data.tags) || !data.tags.every((tag) => typeof tag === 'string')) {
      issues.push(`${relativePath}: tags debe ser un arreglo de strings.`);
      continue;
    }

    const normalizedTags = data.tags.map((tag) => tag.trim());
    if (normalizedTags.some((tag) => !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(tag))) {
      issues.push(`${relativePath}: cada tag debe ser un slug en minúsculas.`);
    }
    if (new Set(normalizedTags).size !== normalizedTags.length) {
      issues.push(`${relativePath}: tiene tags duplicados.`);
    }
    if (normalizedTags.join('\u0000') !== [...normalizedTags].sort().join('\u0000')) {
      issues.push(`${relativePath}: los tags deben estar ordenados alfabéticamente.`);
    }

    normalizedTags.forEach((tag) => tags.add(tag));
  } catch (error) {
    issues.push(`${relativePath}: frontmatter inválido (${error.message}).`);
  }
}

if (!checkOnly) {
  console.log([...tags].sort().join('\n'));
}

if (checkOnly && issues.length > 0) {
  console.error(`\nSe encontraron ${issues.length} problema(s) de tags:`);
  issues.forEach((issue) => console.error(`- ${issue}`));
  process.exitCode = 1;
}
