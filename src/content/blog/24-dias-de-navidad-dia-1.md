---
title:  "Día 1 de 24: capitalizeFirst"
subtitle: Las 24 funciones antes de navidad
pubDate: "2025-12-01"
heroImage: "/images/blog/24-dias-de-navidad-dia-1/hero.png"
author: Asdrúbal Chirinos
featured: true
tags: ["funciones", "node", "javascript"]
---
Cada diciembre aparecen calendarios de adviento llenos de chocolates, galletas y curiosidades. Este año haré una versión para desarrolladores: en lugar de dulces, compartiré 24 funciones útiles en Node. Son pequeñas, enfocadas en un solo propósito y listas para copiar en cualquier proyecto sin depender de paquetes adicionales.

Están pensadas para resolver problemas reales que solemos reescribir en cada repo: desde utilidades para strings hasta piezas para fechas, HTML y lógica general. Aquí va la funcionalidad del 1 de diciembre.

---

## capitalizeFirst

Cuando trabajamos con texto es común querer capitalizar solamente la primera letra sin alterar el resto de la cadena. Podrías esperar que algo así ya exista en el lenguaje, pero no hay una función nativa que lo haga exactamente con este comportamiento.

`capitalizeFirst` está diseñada para hacerlo de forma segura, respetando espacios iniciales y manejando Unicode básico. Además, si el entorno ofrece `Intl.Segmenter`, la función trabaja mejor con grafemas compuestos.

### Función

```js
/**
 * Capitaliza la primera letra de una cadena sin modificar el resto.
 * Preserva espacios iniciales si existen; si se desea ignorarlos se puede aplicar trim externo.
 * Maneja Unicode básico; si Intl.Segmenter está disponible intenta operar sobre el primer grafema.
 * @param {string} str Cadena de entrada.
 * @returns {string} Cadena con la primera letra capitalizada.
 */
export function capitalizeFirst(str) {
  if (typeof str !== 'string' || str.length === 0) return '';
  // Encontrar primer índice con letra no espacio sin quitar espacios iniciales
  const match = /\S/.exec(str);
  if (!match) return str; // Solo espacios
  const i = match.index;
  const first = str[i];
  // Intentar usar locale para mejor mayúscula (español)
  const upper = first.toLocaleUpperCase('es-ES');
  return str.slice(0, i) + upper + str.slice(i + first.length);
}
```

---

## Cómo usarla

#### Caso básico

```js
capitalizeFirst("hola mundo");
// Resultado: "Hola mundo"
```

#### Conservando espacios iniciales

```js
capitalizeFirst("   saludo con espacios");
// Resultado: "   Saludo con espacios"
```

#### Con caracteres Unicode

```js
capitalizeFirst("él está aquí");
// Resultado: "Él está aquí"
```

### Integración típica

Puedes usarla al formatear resultados de base de datos, al normalizar texto para interfaces o al limpiar entradas de usuario. El objetivo es evitar condicionales repetidos y tener una única función que resuelve este comportamiento de forma confiable.

---

Si estás listo para seguir el calendario, mañana te espera la segunda función. Una pieza más para tu caja de herramientas.
