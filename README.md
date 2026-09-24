# Código Ergo Sum

Blog minimalista sobre desarrollo web, tecnología y filosofía del código.

## 🌐 Sitio Web

**URL:** [https://codigoergosum.com](https://codigoergosum.com)

## 📊 Información del Proyecto

- **Framework:** Astro 5.16.0
- **Lenguaje:** TypeScript (strict mode)
- **Contenido:** 223 artículos en Markdown
- **Gestión de Contenido:** Astro Content Collections
- **Estilos:** CSS vanilla con custom properties
- **SEO:** Sitemap automático, Open Graph, Twitter Cards

## 🚀 Estructura del Proyecto

```
codigoergosum/
├── src/
│   ├── components/          # Componentes Astro reutilizables
│   │   ├── BaseHead.astro   # Meta tags, SEO, Open Graph
│   │   ├── Header.astro     # Navegación principal
│   │   ├── Footer.astro     # Footer con redes sociales
│   │   └── Sidebar.astro    # Sidebar con "Acerca de" y tags
│   ├── content/
│   │   ├── blog/           # 223 posts en Markdown
│   │   └── config.ts       # Schema de validación con Zod
│   ├── layouts/
│   │   └── BaseLayout.astro # Layout base del sitio
│   ├── pages/
│   │   ├── index.astro     # Página principal
│   │   ├── blog/
│   │   │   ├── [...slug].astro  # Post individual
│   │   │   └── [...page].astro  # Lista paginada
│   │   └── tags/
│   │       └── [tag].astro      # Posts por etiqueta
│   ├── styles/
│   │   └── global.css      # Estilos globales
│   └── consts.ts           # Constantes del sitio
├── public/
│   ├── images/
│   │   └── blog/           # 209 carpetas organizadas por slug
│   ├── favicon.svg
│   └── codigoergosum.webp
└── package.json
```

## 🎨 Características

### ✨ Funcionalidades Principales

- **Post Destacado**: Sistema de featured post en la home
- **Paginación**: 10 posts por página
- **Sistema de Tags**: Navegación por etiquetas
- **Compartir en Redes**: X, Threads, LinkedIn, Facebook, WhatsApp
- **SEO Optimizado**: Meta tags completos, sitemap automático
- **Responsive Design**: Diseño adaptable a todos los dispositivos
- **Modo Oscaro**: Soporte con `prefers-color-scheme`

### 📝 Schema de Posts

Cada post en Markdown incluye:

```yaml
---
title: string              # Obligatorio
subtitle: string           # Opcional
pubDate: Date              # Obligatorio
updatedDate: Date          # Opcional
heroImage: string          # Opcional - Ruta a imagen
author: string             # Opcional
tags: string[]             # Array de etiquetas
featured: boolean          # Post destacado en home
---
```

### 🖼️ Organización de Imágenes

Las imágenes están organizadas por slug del post:

```
public/images/blog/
├── nombre-del-post/
│   ├── hero.png           # Imagen destacada
│   ├── content-1.jpeg     # Primera imagen del contenido
│   └── content-2.png      # Segunda imagen del contenido
└── otro-post/
    └── hero.png
```

## 🛠️ Comandos

| Comando                   | Descripción                                      |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Instala dependencias                             |
| `npm run dev`             | Inicia servidor de desarrollo (`localhost:4321`) |
| `npm run build`           | Construye el sitio para producción en `./dist/`  |
| `npm run preview`         | Previsualiza el build local                      |
| `npm run astro ...`       | Ejecuta comandos CLI de Astro                    |
| `npm run astro -- check`  | Verifica tipos TypeScript                        |

### Clasificación de tags con Jev

El catálogo permitido está en `src/content/tag-taxonomy.json`. Para evaluar un post, configura `TYPESAFE_API_KEY` en un archivo `.env` (parte de `.env.example`) y ejecuta:

```bash
npm run tag-post -- src/content/blog/YYYY/MM/mi-post.mdx
```

El comando solo reporta la propuesta por defecto. Para escribirla en un post sin tags, usa `--write`; si el resultado es ambiguo o el artículo requiere una categoría nueva, no hará cambios. Los tags existentes solo se reemplazan con `--write --replace`.

```bash
npm run tag-post -- src/content/blog/YYYY/MM/mi-post.mdx --write
```

## 📱 Breakpoints Responsive

- **Mobile**: hasta 639px
- **Mobile Grande**: min-width 640px
- **Tablet**: min-width 768px
- **Desktop**: min-width 1024px
- **Desktop Grande**: min-width 1280px

## 🎯 Diseño

- **Max-width**: 1024px (contenedor centrado)
- **Colores**: Variables CSS con soporte de modo oscuro
- **Tipografía**: Inter (system-ui fallback)
- **Layout**: Header + Main + Footer + Sidebar

## 📄 Documentación Adicional

- `SPECS.md` - Especificaciones técnicas y requisitos del proyecto
- `WARP.md` - Configuración para Warp terminal

## 🚢 Deploy

El sitio genera archivos estáticos en `/dist/` listos para deploy en:
- Netlify
- Vercel
- GitHub Pages
- Cloudflare Pages
- Cualquier hosting estático

## 📧 Autor

**Asdrúbal "Astro" Chirinos**

---

**Migrado desde Substack** | Construido con ❤️ usando Astro
