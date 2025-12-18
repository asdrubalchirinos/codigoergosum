---
title: 'CSS Anidado: Adiós Preprocesadores'
subtitle: 'Anidamiento CSS: La nueva forma de estilizar fácilmente tus elementos HTML'
pubDate: '2023-09-05'
heroImage: /images/blog/2023/09/css-anidado-adios-preprocesadores/hero.jpeg
author: Asdrúbal Chirinos
tags:
  - css
  - web
  - clean-code
slug: css-anidado-adios-preprocesadores
---

![](/images/blog/2023/09/css-anidado-adios-preprocesadores/hero.jpeg)

Imagen generada por inteligencia artificial. Ideogram.ai. Prompt: a monitor inside a nest displaying the word CSS, painting, poster, illustration

Cuando se trata de diseñar y dar estilo a páginas web, CSS (Cascading Style Sheets) es una herramienta fundamental. Con el tiempo, CSS ha evolucionado y ha introducido nuevas características para hacer que la escritura de hojas de estilo sea más eficiente y organizada. Una de las últimas incorporaciones a este lenguaje es la función de "Nesting" o anidamiento de estilos, que ha revolucionado la forma en que los desarrolladores web estructuran sus estilos.

## **¿Qué es Nesting en CSS?**

Nesting en CSS es una característica que permite a los desarrolladores anidar reglas de estilo dentro de otras reglas de estilo. Esta característica es similar a la funcionalidad de anidamiento proporcionada por preprocesadores CSS como Sass o LESS. Con el anidamiento de CSS, los desarrolladores pueden reducir la repetición de código y el tamaño de las hojas de estilo, al tiempo que mejoran la organización y la facilidad de mantenimiento.

Una de las ventajas clave del anidamiento de CSS es que permite a los desarrolladores agrupar reglas de estilo relacionadas en conjunto, lo que facilita la correspondencia de estilos con el HTML que están diseñando. Por ejemplo, si un componente con una clase `.anidado` se eliminara de un proyecto, todo el grupo de reglas de estilo relacionadas podría eliminarse de forma sencilla, en lugar de tener que buscar instancias de selectores relacionados dispersos por todo el archivo CSS.

## **Sintaxis de Nesting en CSS**

La sintaxis del anidamiento en CSS permite que los desarrolladores aniden reglas de estilo dentro de otras reglas de estilo. Esto se hace colocando la regla de estilo anidada dentro del bloque de declaración de la regla de estilo principal. Por ejemplo, si deseas dar estilo a un elemento `.hijo` que es descendiente de un elemento `.padre`, puedes usar la siguiente sintaxis:

```
.padre { color: azul; .hijo { color: rojo; }
}
```

En este ejemplo, el selector de clase `.hijo` está anidado dentro del selector de clase `.padre`. Esto significa que el selector `.hijo` anidado solo se aplicará a elementos que sean descendientes de elementos con la clase `.padre`.

Alternativamente, puedes usar el símbolo `&` para indicar explícitamente dónde debe ubicarse la clase principal. El siguiente ejemplo es funcionalmente equivalente al anterior:

```
.padre { color: azul; & .hijo { color: rojo; }
}
```

Estos dos ejemplos demuestran la sintaxis básica del anidamiento en CSS. Es importante destacar que el anidamiento de CSS requiere que los selectores anidados comiencen con un selector relativo o el selector de anidamiento (`&`). De lo contrario, la regla anidada se ignorará.

## **Usando Nesting en Producción**

Sí, puedes usar el anidamiento de CSS en producción ahora mismo. Sin embargo, es importante tener en cuenta que no todos los navegadores admiten esta característica todavía. A la fecha, agosto de 2023, el anidamiento de CSS está disponible en Chrome 112 y también se puede probar en Safari Technical Preview 162. Firefox admite la nueva versión de la especificación, mientras que Chrome y Safari admiten la versión antigua de la especificación y requieren el selector de anidamiento `&` para el anidamiento de selectores de tipo.

Si deseas utilizar el anidamiento de CSS en producción, asegúrate de que los navegadores de tu audiencia objetivo admitan esta característica. Puedes utilizar herramientas como **[Can I Use](https://caniuse.com/css-nesting)** para verificar la compatibilidad del navegador con el anidamiento de CSS y otras tecnologías web.

## **Mejores Prácticas**

-   **Organización**: El anidamiento puede ayudarte a organizar tus hojas de estilo agrupando reglas de estilo relacionadas. Esto facilita la correspondencia de estilos con el HTML y puede mejorar la mantenibilidad de tus hojas de estilo.

-   **Reducción del tamaño del archivo**: Al reducir la necesidad de repetir selectores, el anidamiento puede ayudarte a reducir el tamaño de tus hojas de estilo.

-   **Refactorización**: Si se elimina un componente de un proyecto, puedes eliminar todo el grupo de reglas de estilo relacionadas en lugar de tener que buscar instancias de selectores relacionados.

-   **Compatibilidad hacia atrás**: Las primeras versiones de la especificación no permitían el anidamiento de selectores de tipo sin el selector de anidamiento `&`. A la fecha de escritura (agosto de 2023), Firefox admite la nueva versión de la especificación, mientras que Chrome y Safari admiten la versión antigua de la especificación y requieren el selector de anidamiento `&` para el anidamiento de selectores de tipo. Por lo tanto, es una buena idea utilizar el selector de anidamiento `&` para garantizar la compatibilidad hacia atrás.


El anidamiento de CSS es una herramienta poderosa para escribir CSS más limpio y eficiente, y puede hacer que tus hojas de estilo sean más fáciles de gestionar, especialmente en proyectos más grandes. ¡Aprovecha esta característica para mejorar tus habilidades de diseño web!
