// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  // Dominio canonical normalizado (usar siempre www para evitar 301 extras)
  site: 'https://www.codigoergosum.com',
  // base removido porque el sitio está en la raíz
  integrations: [sitemap(), mdx()],
  output: 'static',
  build: {
    format: 'directory',
    assets: '_astro'
  },
  // Asegurar que las imágenes públicas se copien correctamente
  publicDir: './public'
});