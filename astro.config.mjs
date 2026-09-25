// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import rehypeExternalLinks from 'rehype-external-links';
import remarkBreaks from 'remark-breaks';

import { collectPostLastmod } from './scripts/post-dates.mjs';

// Índice URL -> última fecha de modificación, para emitir <lastmod> en el sitemap.
const { byPath: postLastmod, newest: newestPost } = collectPostLastmod();

/** @param {string} pathname */
function lastmodFor(pathname) {
  if (pathname === '/' || pathname === '/blog/') return newestPost;
  return postLastmod.get(pathname);
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
      // Añade <lastmod> a los posts para que los agentes detecten cambios sin
      // tener que descargar y comparar el sitemap completo.
      serialize(item) {
        const lastmod = lastmodFor(new URL(item.url).pathname);
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
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