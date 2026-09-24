import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import matter from 'gray-matter';
import taxonomy from '../src/content/tag-taxonomy.json' with { type: 'json' };

const AUTO_TAG_THRESHOLD = 0.8;
const REVIEW_THRESHOLD = 0.6;
const MIN_TAGS = 3;
const MAX_TAGS = 6;
const BLOG_DIRECTORY = path.resolve('src/content/blog');
const API_URL = process.env.TYPESAFE_API_URL || 'https://api.typesafe.ai/v1/systemone';
const MODEL = process.env.JEV_MODEL || 'jev-latest';

function usage() {
  console.log(`Uso: npm run tag-post -- <post.md[x]> [--write] [--replace] [--json]

Evalúa un post únicamente contra src/content/tag-taxonomy.json.
Por defecto no modifica archivos. --write escribe los tags solo si el post no tiene
tags, hay entre ${MIN_TAGS} y ${MAX_TAGS} tags de alta confianza y no requiere revisión.
Usa --replace para sustituir tags existentes de forma explícita.`);
}

function parseArguments(argumentsList) {
  const flags = new Set(argumentsList.filter((argument) => argument.startsWith('--')));
  const file = argumentsList.find((argument) => !argument.startsWith('--'));
  const allowedFlags = new Set(['--write', '--replace', '--json', '--help']);

  if ([...flags].some((flag) => !allowedFlags.has(flag))) {
    throw new Error(`Opción no reconocida: ${[...flags].find((flag) => !allowedFlags.has(flag))}`);
  }
  if (flags.has('--replace') && !flags.has('--write')) {
    throw new Error('--replace requiere --write.');
  }
  return { file, flags };
}

function getPostPath(file) {
  const postPath = path.resolve(file);
  const relativePath = path.relative(BLOG_DIRECTORY, postPath);

  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
    throw new Error('El post debe estar dentro de src/content/blog.');
  }
  if (!['.md', '.mdx'].includes(path.extname(postPath)) || !fs.existsSync(postPath)) {
    throw new Error('Indica un archivo .md o .mdx existente.');
  }
  return postPath;
}

function buildState(data, content) {
  const article = content
    .replace(/^import .*$/gm, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 12000);

  return {
    title: data.title || '',
    subtitle: data.subtitle || '',
    language: data.lang || 'es',
    article,
    tagCatalog: Object.entries(taxonomy.tags).map(([tag, definition]) => ({
      tag,
      description: definition.description
    }))
  };
}

function buildQuestions() {
  const questions = {
    primary_category: {
      type: 'choice',
      instructions: '¿Cuál es la categoría principal del texto? Elige la que mejor describa su tesis central.',
      criteria: taxonomy.categories
    },
    needs_new_tag_review: {
      type: 'noul',
      instructions: `¿La tesis central del texto no está cubierta adecuadamente por ningún tag de \`tagCatalog\`? Responde sí solo si ningún tag existente representa la idea principal; no porque falte un matiz menor.`
    }
  };

  const tagQuestionIds = new Map();
  Object.entries(taxonomy.tags).forEach(([tag, definition], index) => {
    const questionId = `tag_${index}`;
    tagQuestionIds.set(questionId, tag);
    questions[questionId] = {
      type: 'noul',
      instructions: `¿El texto trata de forma sustancial sobre el tag "${tag}"? Definición: ${definition.description} Responde no si solo se menciona de pasada.`
    };
  });

  return { questions, tagQuestionIds };
}

async function askJev(state, questions) {
  if (!process.env.TYPESAFE_API_KEY) {
    throw new Error('Falta TYPESAFE_API_KEY. Agrégala a .env sin incluirla en Git.');
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.TYPESAFE_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ state, model: MODEL, questions })
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`Jev respondió ${response.status}: ${payload.error?.message || payload.error || response.statusText}`);
  }
  if (!payload.answers) {
    throw new Error('Jev respondió sin answers.');
  }
  return payload;
}

function evaluateAnswers(answers, tagQuestionIds) {
  const candidates = [...tagQuestionIds.entries()]
    .map(([questionId, tag]) => ({
      tag,
      probability: answers[questionId]?.noul ?? 0,
      threshold: taxonomy.tags[tag].autoThreshold ?? AUTO_TAG_THRESHOLD
    }))
    .sort((left, right) => right.probability - left.probability);
  const automatic = candidates
    .filter((candidate) => candidate.probability >= candidate.threshold)
    .slice(0, MAX_TAGS);
  const review = candidates.filter(
    (candidate) => candidate.probability >= REVIEW_THRESHOLD && candidate.probability < candidate.threshold
  );
  const needsNewTagReview = (answers.needs_new_tag_review?.noul ?? 0) >= REVIEW_THRESHOLD;

  return {
    category: answers.primary_category?.choice,
    categoryConfidence: answers.primary_category?.confidence,
    automatic,
    review,
    needsNewTagReview,
    newTagProbability: answers.needs_new_tag_review?.noul ?? 0,
    canWrite: automatic.length >= MIN_TAGS && !needsNewTagReview && review.length === 0
  };
}

function formatResult(result) {
  const percentages = (items) => items.map(({ tag, probability }) => `${tag} (${Math.round(probability * 100)}%)`).join(', ') || 'ninguno';
  return [
    `Categoría principal: ${result.category || 'sin respuesta'}${result.categoryConfidence === undefined ? '' : ` (${Math.round(result.categoryConfidence * 100)}%)`}`,
    `Tags de alta confianza: ${percentages(result.automatic)}`,
    `Tags para revisión: ${percentages(result.review)}`,
    `¿Requiere nuevo tag?: ${result.needsNewTagReview ? 'sí' : 'no'} (${Math.round(result.newTagProbability * 100)}%)`,
    `¿Se puede escribir automáticamente?: ${result.canWrite ? 'sí' : 'no'}`
  ].join('\n');
}

async function main() {
  const { file, flags } = parseArguments(process.argv.slice(2));
  if (flags.has('--help') || !file) {
    usage();
    process.exitCode = flags.has('--help') ? 0 : 1;
    return;
  }

  const postPath = getPostPath(file);
  const source = fs.readFileSync(postPath, 'utf8');
  const parsed = matter(source);
  const { questions, tagQuestionIds } = buildQuestions();
  const payload = await askJev(buildState(parsed.data, parsed.content), questions);
  const result = evaluateAnswers(payload.answers, tagQuestionIds);

  if (flags.has('--json')) {
    console.log(JSON.stringify({ model: payload.model || MODEL, result, usage: payload.usage }, null, 2));
  } else {
    console.log(formatResult(result));
  }

  if (!flags.has('--write')) return;
  const hasExistingTags = Array.isArray(parsed.data.tags) && parsed.data.tags.length > 0;
  if (hasExistingTags && !flags.has('--replace')) {
    throw new Error('El post ya tiene tags. Usa --replace junto con --write para sustituirlos.');
  }
  if (!result.canWrite) {
    throw new Error('La clasificación requiere revisión; no se modificó el post.');
  }

  parsed.data.tags = result.automatic.map(({ tag }) => tag).sort((left, right) => left.localeCompare(right));
  fs.writeFileSync(postPath, matter.stringify(parsed.content, parsed.data));
  console.log(`Tags escritos en ${path.relative(process.cwd(), postPath)}.`);
}

main().catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
});
