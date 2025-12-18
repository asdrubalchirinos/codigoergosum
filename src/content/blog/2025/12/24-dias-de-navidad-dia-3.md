---
title: 'Día 3 de 24: removeDiacritics'
subtitle: Las 24 funciones antes de navidad
pubDate: '2025-12-03'
heroImage: /images/blog/2025/12/24-dias-de-navidad-dia-3/hero.png
author: Asdrúbal Chirinos
featured: true
tags:
  - web
  - javascript
slug: 24-dias-de-navidad-dia-3
---
En este nuevo día avanzamos un paso más en nuestra serie, retomando el hilo de las pequeñas utilidades que simplifican tareas frecuentes en proyectos reales. Hoy nos enfocamos en una función que aporta limpieza y consistencia a cualquier flujo de texto, algo clave cuando se trabaja con datos multilenguaje o cuando se construyen URLs limpias.

## removeDiacritics

Esta función elimina los diacríticos de una cadena aprovechando la normalización Unicode. Resulta muy útil cuando necesitamos homogeneizar texto, generar claves comparables o preparar cadenas para procesos donde los acentos causan problemas. Aunque existen métodos nativos para normalizar, esta implementación añade una capa de compatibilidad al intentar usar propiedades Unicode modernas y ofrecer un fallback para entornos sin ese soporte. Esto facilita integrarla en aplicaciones diversas sin depender de la versión del motor JavaScript.

Ventajas y usos típicos:

* Preparar texto para búsquedas sin acentos.
* Normalizar claves internas o identificadores.
* Construir sistemas de comparación consistentes entre idiomas.
* Mejorar la generación de slugs cuando se desea mayor control.

### Código de la función

```js
/**
 * Elimina diacríticos de una cadena usando normalización Unicode.
 * Usa \p{Diacritic} si está disponible; si no, elimina el rango combinante básico.
 * @param {string} str
 * @returns {string}
 */
export function removeDiacritics(str) {
  if (typeof str !== 'string') return '';
  const nfd = str.normalize('NFD');
  let result;
  try {
    result = nfd.replace(/\p{Diacritic}/gu, '');
  } catch {
    // Fallback para entornos sin soporte Unicode property escapes
    result = nfd.replace(/[\u0300-\u036f]/g, '');
  }
  return result.normalize('NFC');
}
```

## Cómo usarla

#### Caso básico

```js
removeDiacritics('Canción');
// Resultado: "Cancion"
```

#### Textos con múltiples acentos

```js
removeDiacritics('Árboles, pingüinos y café');
// Resultado: "Arboles, pinguinos y cafe"
```

#### Uso combinado con validaciones o generación de claves

```js
const normalizedKey = removeDiacritics('Categoría Especial').toLowerCase();
// Resultado: "categoria especial"
```

Este tipo de normalización permite trabajar con datos más estables en sistemas donde el usuario introduce texto en diferentes idiomas o desde distintos dispositivos.

---

Seguimos avanzando en este calendario lleno de pequeñas joyas de utilidad. Mañana traeremos otra función que complementa este camino y que seguro encaja en muchos de tus proyectos.
