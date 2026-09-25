// @ts-check
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import rehypeExternalLinks from 'rehype-external-links';
import remarkBreaks from 'remark-breaks';

import { BLOG_PAGE_SIZE } from './src/consts.ts';
import { collectPostLastmod } from './scripts/post-dates.mjs';

const { byPath: postLastmod, posts } = collectPostLastmod();

/** @param {{ lastmod: string }[]} list */
function newestLastmod(list) {
  let newest;
  for (const post of list) {
    if (!newest || post.lastmod > newest) newest = post.lastmod;
  }
  return newest;
}

/**
 * @param {{ published: string, lastmod: string }[]} list ordenada por pubDate desc
 * @param {number} pageNumber
 */
function pageLastmod(list, pageNumber) {
  if (!Number.isInteger(pageNumber) || pageNumber < 1) return undefined;
  const start = (pageNumber - 1) * BLOG_PAGE_SIZE;
  const pagePosts = list.slice(start, start + BLOG_PAGE_SIZE);
  if (pagePosts.length === 0) return undefined;
  // Cada post nuevo desplaza el contenido de todas las páginas de la lista.
  return newestLastmod([{ lastmod: list[0].published }, ...pagePosts]);
}

/** @param {string} value */
function decodeSegment(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/** @param {string} pathname */
function lastmodFor(pathname) {
  if (pathname === '/') return newestLastmod(posts);
  if (pathname === '/blog/') return pageLastmod(posts, 1);

  const blogPage = pathname.match(/^\/blog\/(\d+)\/$/);
  if (blogPage) return pageLastmod(posts, Number(blogPage[1]));

  const tagPage = pathname.match(/^\/tags\/([^/]+)\/(?:(\d+)\/)?$/);
  if (tagPage) {
    const tag = decodeSegment(tagPage[1]);
    const pageNumber = tagPage[2] ? Number(tagPage[2]) : 1;
    const tagged = posts.filter((post) => post.tags.includes(tag));
    return pageLastmod(tagged, pageNumber);
  }

  return postLastmod.get(pathname);
}

/** Copia sitemap-index.xml a sitemap.xml para bots que prueban esa ruta. */
function sitemapXmlAlias() {
  return {
    name: 'sitemap-xml-alias',
    hooks: {
      /** @param {{ dir: URL }} options */
      'astro:build:done': async ({ dir }) => {
        const outDir = fileURLToPath(dir);
        await fs.copyFile(
          path.join(outDir, 'sitemap-index.xml'),
          path.join(outDir, 'sitemap.xml'),
        );
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  // Dominio canonical normalizado (usar siempre www para evitar 301 extras)
  site: 'https://www.codigoergosum.com',
  // base removido porque el sitio está en la raíz
  integrations: [
    sitemap({
      // Páginas utilitarias del newsletter: no deben aparecer en el sitemap
      // (además robots.txt las marca como Disallow).
      filter: (page) => !/\/(confirm|unsubscribe)\/?$/.test(page),
      // Añade <lastmod> a posts, paginación y etiquetas para que los agentes
      // detecten cambios sin descargar el contenido.
      serialize(item) {
        const lastmod = lastmodFor(new URL(item.url).pathname);
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
    sitemapXmlAlias(),
    mdx({
      rehypePlugins: [
        [
          rehypeExternalLinks,
          {
            target: '_blank',
            rel: ['noopener', 'noreferrer'],
          },
        ],
      ],
      remarkPlugins: [remarkBreaks],
    }),
  ],
  output: 'static',
  build: {
    format: 'directory',
    assets: '_astro'
  },
  // Muchos lectores y agentes prueban /feed antes que /rss.xml
  redirects: {
    '/feed': '/rss.xml',
  },
  // Asegurar que las imágenes públicas se copien correctamente
  publicDir: './public',
  markdown: {
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          target: '_blank',
          rel: ['noopener', 'noreferrer'],
        },
      ],
    ],
    remarkPlugins: [remarkBreaks],
  },
});