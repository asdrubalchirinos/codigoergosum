---
name: Blog Post References
description: Adds related-post cross-links to blog MDX using PostReference. Use when linking related articles, adding PostReference, suggesting cross-references, or relating posts to a new draft.
---

# Blog Post References

Relaciona un post nuevo (o en edición) con otros del blog insertando `<PostReference slug="..." />` en el cuerpo del MDX, donde el tema del párrafo anterior lo justifica.

## Core Principles

1. **Relevance over volume**: 3–6 referencias bien ubicadas; evita saturar el artículo.
2. **Contextual placement**: Cada `PostReference` va **después** del párrafo o bloque que conecta con el post enlazado, no al azar ni todos al final.
3. **Scope explícito**: Si el usuario pide un alcance (p. ej. «solo 2026», «mismo año», «mismos tags»), respétalo. Si no dice nada, busca en todo el blog.
4. **Slugs reales**: Solo usa `slug` que existan en `src/content/blog/`. Nunca inventes slugs.
5. **No auto-referencia**: Excluye el `slug` del post que estás editando.
6. **Preferir publicados**: Prioriza posts con `draft: false`; incluye borradores solo si el usuario lo pide o no hay alternativa temática clara.

## Workflow

### 1. Leer el post objetivo

Abre el `.mdx` del post a enlazar. Identifica:

- `slug` (para excluirlo)
- `tags` del frontmatter
- Secciones y argumentos principales
- Si falta el import, añádelo una sola vez tras el frontmatter:

```mdx
import PostReference from '@components/PostReference.astro';
```

### 2. Listar candidatos

Desde la raíz del repo:

```bash
# Todos los posts (año | slug | título | tags)
bash .agent/skills/blog-post-references/scripts/list-posts.sh

# Solo un año
bash .agent/skills/blog-post-references/scripts/list-posts.sh 2026

# Posts que comparten al menos un tag con el post objetivo
bash .agent/skills/blog-post-references/scripts/list-posts.sh --tags-from src/content/blog/2026/05/el-porque-antes-del-que.mdx
```

Lee el **título**, **subtitle** y, si hace falta, el inicio del cuerpo de los candidatos más prometedores.

### 3. Seleccionar posts relacionados

Prioriza candidatos que cumplan **varios** de estos criterios:

| Criterio | Señal |
|----------|--------|
| Tags compartidos | Misma taxonomía (`liderazgo`, `ia`, etc.) |
| Tema paralelo | Misma pregunta o tensión (propósito, cultura, construir sin porqué) |
| Hilo del blog | Posts que ya se referencian entre sí en la misma línea argumental |
| Complemento | Un post profundiza en una idea que el actual solo menciona |

Descarta posts tangenciales aunque compartan un tag genérico (`opinion`).

### 4. Ubicar cada referencia

Para cada post elegido:

1. Encuentra la sección del artículo objetivo donde encaja naturalmente.
2. Inserta una línea en blanco y luego el componente en su propia línea:

```mdx
Texto del párrafo que conecta con la idea del otro post.

<PostReference slug="slug-del-otro-post" />
```

3. No pongas dos `PostReference` seguidos sin contenido entre medias.
4. No repitas el mismo `slug` dos veces en el mismo artículo.

### 5. Verificar

- [ ] El import de `PostReference` está presente
- [ ] Cada `slug` existe en otro `.mdx` bajo `src/content/blog/`
- [ ] Ninguna referencia apunta al propio post
- [ ] Las referencias respetan el alcance pedido por el usuario (año, tags, etc.)
- [ ] Hay coherencia entre el párrafo anterior y el post enlazado

## Formato

```mdx
<PostReference slug="el-reto-nunca-fue-construir" />
```

- Atributo único: `slug` (valor del frontmatter `slug:` del post destino, no la ruta del archivo).
- El componente renderiza tarjeta con título, subtítulo, fecha e imagen del post enlazado.

## Ejemplo

Post: «El porqué antes del qué» — propósito, cultura, construir sin sentido.

| Ubicación en el artículo | `slug` | Por qué |
|--------------------------|--------|---------|
| Tras hablar del «porqué» personal/organizacional | `el-por-que-antes-del-habito` | Misma línea sobre identidad y porqué |
| Tras «obsesión por construir» | `el-reto-nunca-fue-construir` | Construir sin claridad de qué/por qué |
| Tras propósito y cultura | `cuando-el-talento-no-basta-alineacion-cultura-y-pertenencia` | Alineación y pertenencia |
| Tras «misión compartida» | `el-compromiso-incomodo` | Compromiso vs. cumplir tareas |
| Cierre sobre valor del impacto | `no-pagas-por-codigo-pagas-por-resolver-problemas` | Valor en el problema, no en el output |

## Relación con otros skills

- **Tags**: Si el post no tiene tags, usa primero `.agent/skills/blog-tagging-system/SKILL.md`; los tags ayudan a encontrar candidatos con `list-posts.sh --tags-from`.
