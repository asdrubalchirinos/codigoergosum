// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import rehypeExternalLinks from 'rehype-external-links';
import remarkBreaks from 'remark-breaks';

// https://astro.build/config
export default defineConfig({
  // Dominio canonical normalizado (usar siempre www para evitar 301 extras)
  site: 'https://www.codigoergosum.com',
  // base removido porque el sitio está en la raíz
  integrations: [
    sitemap(),
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