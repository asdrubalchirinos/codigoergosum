---
title: ¡No Más Commits Caóticos!
subtitle: >-
  Aprende cómo redactar commits efectivos para aumentar tu productividad y
  fortalecer la colaboración en tu equipo de desarrollo.
pubDate: '2023-10-02'
heroImage: /images/blog/2023/10/no-mas-commits-caoticos/hero.jpeg
author: Asdrúbal Chirinos
tags:
  - git
  - clean-code
  - productividad
  - liderazgo
slug: no-mas-commits-caoticos
---

![](/images/blog/2023/10/no-mas-commits-caoticos/hero.jpeg)

*¿Qué tan malo puede ser un commit?"*, te preguntarás mientras te enfrentas al historial de tu proyecto, lleno de commits enigmáticos, crípticos y, a veces, simplemente absurdos. Has llegado a ese punto en el que encuentras joyas como:

`git commit -m "arreglar"`

O este otro clásico:

`git commit -m "cambios varios"`

Y, por supuesto, no podemos olvidar el infame:

`git commit -m "asdfghjkl"`

¡Nah y no digas que no!, porque hasta yo he caído en esa trampa, así que tranquilo, no estás solo. La falta de claridad en los commits es un problema común que puede afectar tu productividad y la colaboración en equipo. Afortunadamente, hay una solución simple y poderosa: los **Semantic Commit Messages**.

## El Desfile de los Commits Misteriosos

Imagina que eres un detective del código, investigando el misterioso caso de tu proyecto de software, o sea, eres el líder de un equipo de desarrollo. Te adentras en el historial de commits esperando encontrar pistas claras y significativas. Sin embargo, en lugar de pistas claras y reveladoras, te encuentras con "arreglos", "cambios varios" y otras palabras que no te dicen nada. ¡vaya!

## Por qué los Commits Importan

Los commits son más que simples mensajes en tu historial de versiones; tienen un propósito real y pueden tener un impacto significativo en el desarrollo y la colaboración del equipo. Los commits caóticos, que carecen de claridad y estructura, pueden convertirse en un obstáculo tanto para la colaboración en equipo como para la productividad. Ahora, echemos un vistazo a algunas formas específicas en las que estos commits pueden afectarte:

**Pérdida de Contexto:** Un buen commit no solo debe decir '**qué'** se hizo, sino también '**por qué'** se hizo. Los commits vagos dejan a todos en la oscuridad, sin entender el propósito de un cambio en el código. Esto lleva a una pérdida de contexto, y los desarrolladores pasan más tiempo tratando de entender que escribiendo código nuevo.

**Merge Dolorosos:** Cuando varios desarrolladores trabajan en un proyecto, los commits vagos hacen que los merges sean un verdadero desafío. Sin una idea clara de lo que ha cambiado en cada commit, los merges se vuelven propensas a conflictos y errores.

**Depuración Frustrante:** ¿Alguna vez has intentado rastrear un error en el código y te has encontrado con un commit que dice "arreglo"? ¡Buena suerte tratando de entender qué se arregló! Los commits informativos hacen que la depuración sea mucho más eficiente y menos frustrante.

## La Solución: Semantic Commit Messages

La buena noticia es que existe una forma simple de evitar este caos de commits y mejorar tu productividad al mismo tiempo: los Semantic Commit Messages. Estos mensajes siguen un formato predefinido que incluye un encabezado breve y una descripción opcional más detallada. Esto hace que tus commits sean comprensibles de un vistazo y facilita la búsqueda en el historial.

Formato: `<tipo>(<ámbito>): <asunto>`

```
feat: Agregar función de autenticación por huella dactilar
^--^ ^--------------------------------------------------^
| |
| +-> Resumen en tiempo presente.
|
+-------> Tipo: chore, docs, feat, fix, refactor, style, o test.
```

Aquí hay ejemplos prácticos de cómo utilizar Semantic Commit Messages:

1.  **feat:** Usado para nuevas características o funcionalidades para los usuarios finales.
    *Ejemplo: \`feat: Agregar función de autenticación por huella dactilar\`*

2.  **fix:** Reservado para correcciones de errores que afectan a los usuarios finales.
    *Ejemplo: \`fix: Solucionar error de inicio de sesión que bloqueaba a los usuarios\`*

3.  **docs:** Utilizado para cambios en la documentación del proyecto.
    *Ejemplo: \`docs: Actualizar guía de instalación\`*

4.  **style:** Se aplica a cambios relacionados con el formato del código.
    *Ejemplo: \`style: Alinear código según estándares de estilo\`*

5.  **refactor**: Usado cuando se realizan modificaciones en el código de producción para mejorar su estructura o legibilidad.
    *Ejemplo: \`refactor: Reorganizar clases para reducir la complejidad\`*

6.  **test:** Reservado para adiciones o mejoras en pruebas. Ejemplo: \`test: Agregar pruebas de unidad para la función de exportación\`

7.  **chore:** Utilizado para tareas de mantenimiento y mejoras en la infraestructura del proyecto.
    *Ejemplo: \`chore: Actualizar dependencias de construcción y pruebas\`*


Es importante destacar que, si bien los **Semantic Commit Messages** se enfocan principalmente en responder al **'qué'** y, en cierta medida, el **'dónde'**, indicado en el <ámbito>, se recomienda encarecidamente agregar una explicación sobre el **'por qué'** detrás de cada cambio

Ejemplo:

```
`feat(auth): Agregar autenticación por huella dactilar Agrega una función de autenticación por huella dactilar para mejorar la seguridad y la comodidad de los usuarios al iniciar sesión.`
```

* * *

Estos ejemplos ilustran cómo Semantic Commit Messages pueden proporcionar claridad y coherencia en el historial de commits de un proyecto. Mantén tu código organizado y comprensible, y verás cómo tu productividad y colaboración en equipo se disparan. ¡Nunca más te enfrentarás a commits misteriosos en tu proyecto!
