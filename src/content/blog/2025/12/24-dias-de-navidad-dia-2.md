---
title: 'Día 2 de 24: truncateText'
subtitle: Las 24 funciones antes de navidad
pubDate: '2025-12-02'
heroImage: /images/blog/2025/12/24-dias-de-navidad-dia-2/hero.png
author: Asdrúbal Chirinos
featured: true
tags:
  - web
  - javascript
slug: 24-dias-de-navidad-dia-2
---

Continúa nuestra cuenta regresiva. Ayer comenzamos con una función sencilla para capitalizar textos y hoy seguimos con otra herramienta práctica para cualquier interfaz, API o contenido dinámico. La idea de esta serie es compartir pequeñas piezas listas para usarse en cualquier proyecto, sin dependencias innecesarias y con una sola responsabilidad bien definida.

Cada día agregamos un nuevo bloque a esta colección navideña. Hoy toca una función de utilidad muy común cuando manejamos contenido extenso: truncar texto sin romper la lectura.

---

## truncateText

Cuando tienes títulos, resúmenes, descripciones largas o contenido generado por usuarios, normalmente necesitas acotarlo a un máximo de caracteres. Pero no siempre quieres un corte brusco que termine en mitad de una palabra. Esta función resuelve justamente eso.

`truncateText` ajusta un texto a una longitud máxima y agrega un sufijo configurable. Además, incluye un modo opcional `wordBoundary` que intenta evitar cortar palabras de forma abrupta.

---

## Función

```js
/**
 * Trunca un texto a una longitud máxima agregando un sufijo (por defecto "…").
 * Opcional: modo wordBoundary intenta no cortar la última palabra.
 * @param {string} str Texto de entrada.
 * @param {number} maxLength Longitud máxima total incluida la elipsis.
 * @param {object} [options]
 * @param {string} [options.ellipsis='…'] Sufijo usado al truncar.
 * @param {boolean} [options.wordBoundary=false] No cortar palabra final si es posible.
 * @returns {string}
 */
export function truncateText(str, maxLength, options = {}) {
  if (typeof str !== 'string') return '';
  const { ellipsis = '…', wordBoundary = false } = options;
  if (maxLength <= 0) return '';
  if (str.length <= maxLength) return str;
  const sliceLength = Math.max(0, maxLength - ellipsis.length);
  let base = str.slice(0, sliceLength);
  if (wordBoundary) {
    const lastSpace = base.lastIndexOf(' ');
    if (lastSpace > 0) base = base.slice(0, lastSpace);
  }
  return base.replace(/\s+$/,'') + ellipsis;
}
```

---

## Cómo usarla

#### Caso básico

```js
truncateText("Un texto bastante largo que necesita ajustarse", 20);
// Resultado: "Un texto bastante…"
```

#### Evitar cortar la última palabra

```js
truncateText(
  "Un texto bastante largo que necesita ajustarse",
  20,
  { wordBoundary: true }
);
// Resultado: "Un texto…"
```

#### Personalizar el sufijo

```js
truncateText(
  "Contenido que debería terminar de forma personalizada",
  25,
  { ellipsis: "..." }
);
// Resultado: "Contenido que debería..."
```

#### Evitar resultados vacíos

Si el `maxLength` es menor o igual a cero, se devuelve una cadena vacía. Si el texto ya es corto, se devuelve tal cual.

---

Mañana seguimos con la función del Día 3. Esta colección apenas comienza y cada día agregará una herramienta más para tu .js toolbox decembrina.
