---
name: blog-tagging-system
description: Clasifica y aplica tags a posts del blog mediante el catálogo controlado y Jev. Úsalo al crear, revisar o actualizar tags en src/content/blog.
paths:
  - src/content/blog/**/*.md
  - src/content/blog/**/*.mdx
---

# Blog Tagging System

Usa `src/content/tag-taxonomy.json` como catálogo controlado. No inventes ni escribas tags fuera de ese catálogo.

## Clasificar un post

Primero ejecuta una evaluación de solo lectura:

```bash
npm run tag-post -- src/content/blog/YYYY/MM/post.mdx
```

El comando necesita `TYPESAFE_API_KEY` en `.env`. Reporta tags de alta confianza, candidatos ambiguos y si el post requiere revisar la creación de un tag nuevo.

No modifiques el frontmatter si hay tags ambiguos, se requieren nuevos tags o no se obtienen entre 3 y 6 tags de alta confianza. Para escribir tags en un post que no tiene ninguno, espera una instrucción explícita y usa:

```bash
npm run tag-post -- src/content/blog/YYYY/MM/post.mdx --write
```

Los tags existentes están protegidos. Sustituirlos requiere autorización explícita y `--write --replace`.

## Mantener el catálogo

Antes de cambiar el catálogo, consulta los tags usados:

```bash
npm run list-tags
```

Un tag nuevo requiere un caso que no esté cubierto por el catálogo. Usa minúsculas y formato slug; agrega una descripción precisa y una categoría interna en `tag-taxonomy.json`.

Después de cambiar una definición o umbral, ejecuta la regresión de solo lectura:

```bash
npm run test:tag-taxonomy
```
