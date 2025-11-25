# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands

- Install deps: `npm install`
- Start dev server: `npm run dev`
- Build production site to `dist/`: `npm run build`
- Preview local build: `npm run preview`
- Astro CLI helper (subcommands): `npm run astro -- <cmd>`
  - Type-check project: `npm run astro -- check`
  - Get help: `npm run astro -- --help`

Notes
- No lint or test tooling is configured in this repo as of November 24, 2025. If you add them later (e.g., ESLint, Vitest), update this file with the exact commands (including how to run a single test).

## High-level architecture

- Framework and runtime
  - Astro 5 (ESM). Entry scripts in `package.json` use `astro` for dev/build/preview.
  - `astro.config.mjs` sets `site` to `https://codigoergosum.com` and enables the `@astrojs/sitemap` integration for sitemap generation.
  - TypeScript is enabled for authoring and type checking (`tsconfig.json` extends `astro/tsconfigs/strict`), but the site code is primarily `.astro` plus small `.ts` modules.

- Content model
  - Content Collections (Astro Content) defined in `src/content/config.ts` expose a `blog` collection with Zod schema:
    - Required: `title`, `pubDate` (coerced to Date)
    - Optional: `subtitle`, `updatedDate`, `heroImage`, `author`
    - Tags: `tags: string[]` (default `[]`)
    - Featured flag: `featured: boolean` (default `false`)
  - Pages consume `getCollection('blog')` to query Markdown content (frontmatter validated by the schema).

- Page/layout composition
  - Base layout: `src/layouts/BaseLayout.astro`
    - Assembles the document with `<BaseHead/>`, `<Header/>`, `<Footer/>`, and a `<slot/>` for page content.
    - Props: `title`, `description`, `image?` forwarded to head/meta.
  - Head/meta: `src/components/BaseHead.astro`
    - Injects `src/styles/global.css` globally, sets canonical URL (via `Astro.site + Astro.url.pathname`), primary meta, OpenGraph/Twitter cards, and preloads fonts.
  - Header: `src/components/Header.astro`
    - Displays logo (`/codigoergosum.webp`) and the blog title centered. Styles target a max content width of 1024px (matching project specs).
  - Footer: `src/components/Footer.astro`
    - Simple social links (Twitter/GitHub SVGs), copyright year, and author placeholder.
  - Sidebar: `src/components/Sidebar.astro`
    - Computes a tag cloud by aggregating unique `tags` from the `blog` collection.

- Home route behavior
  - `src/pages/index.astro`
    - Imports `SITE_TITLE` and `SITE_DESCRIPTION` from `src/consts.ts`.
    - Queries `blog` posts, sorts by `pubDate` (desc), selects a single `featuredPost` where `data.featured === true`, and renders up to 5 recent posts excluding the featured one.
    - Spanish locale date formatting (`es-ES`).

- Styling system
  - Global tokens and base styles live in `src/styles/global.css` (CSS custom properties for colors, light/dark adjustments, typographic scale, container widths). Images are styled to be responsive by default.

- Public assets
  - `public/` hosts static files like `favicon.svg`, `codigoergosum.webp`, and placeholders. `BaseHead` defaults the social/OG image to `/blog-placeholder-1.jpg` unless overridden via the `image` prop.

- Build output
  - Production builds emit to `dist/` (standard Astro). Use `npm run preview` to locally serve the built site.

## Additional references

- README highlights the standard Astro commands and that dev server runs at `http://localhost:4321` by default.
- Specs in `SPECS.md` describe desired blog features (featured post, recent posts list, tag cloud, layout constraints at 1024px, SEO with canonical and sitemap). The current implementation covers the base layout, home with featured/recent posts, tags sidebar, and sitemap integration.
