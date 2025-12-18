---
title: 'Async Await: El Punto de Partida'
pubDate: '2023-06-28'
heroImage: /images/blog/2023/06/async-await-el-punto-de-partida/hero.jpeg
author: Asdrúbal Chirinos
tags:
  - javascript
  - clean-code
  - backend
slug: async-await-el-punto-de-partida
---

![](/images/blog/2023/06/async-await-el-punto-de-partida/hero.jpeg)

En el ámbito de la programación, los desarrolladores a menudo se encuentran con situaciones en las que necesitan ejecutar tareas que consumen mucho tiempo sin bloquear el hilo principal de ejecución. Tradicionalmente, el manejo de tales escenarios implicaba el uso de callbacks o la gestión explícita de hilos. Sin embargo, la introducción del paradigma "async" y "await" revolucionó la programación asíncrona, ofreciendo un enfoque más elegante y legible.

#### Entendiendo Async Await

El paradigma "async" y "await" se trata de escribir código asíncrono que parece síncrono. Al marcar un método o función como "async", indicamos que puede ejecutarse de forma asíncrona sin bloquear el hilo principal. La palabra clave "await" se utiliza dentro de un método "async" para pausar la ejecución hasta que una operación asíncrona esperada se complete, permitiendo que se procesen otras tareas simultáneamente. Este enfoque elimina la necesidad de devoluciones de llamada (callbacks) o mecanismos de hilos complejos, lo que resulta en un código más legible y fácil de mantener.

#### ¿Quién fue el primero en implementar Async Await?

El concepto de "async" y "await" se introdujo por primera vez en C#, lenguaje de programación moderno, orientado a objetos y de propósito general desarrollado por Microsoft. C# llevó este poderoso paradigma a la vanguardia, permitiendo a los desarrolladores escribir código asíncrono de manera más sencilla e intuitiva. Al adoptar "async" y "await", C# desbloqueó el potencial para manejar de manera eficiente operaciones que consumen mucho tiempo, como solicitudes de red o operaciones de archivos, al tiempo que mantiene el código limpio y comprensible.

#### JavaScript/TypeScript: Desarrollo web asíncrono

La adopción del paradigma "async" y "await" se expandió más allá de C# y se introdujo en otros lenguajes de programación. En el ámbito del desarrollo web, JavaScript dio un gran paso con la introducción de "async" y "await" en ECMAScript 2017 (ES8). Los desarrolladores de JavaScript ahora pueden escribir código asíncrono de manera similar a código síncrono, aprovechando "async" y "await" para manejar promesas y realizar operaciones sin bloqueo sin problemas. Este avance mejoró en gran medida la legibilidad y mantenibilidad del código asíncrono en JavaScript, beneficiando tanto a las aplicaciones de lado del servidor en Node.js como a los frameworks de frontend como React, Angular y Vue.js.

#### Python: Abrazando la programación asíncrona

Python, un lenguaje de programación versátil y ampliamente utilizado, incorporó el paradigma "async" y "await" en la versión 3.5. Con la introducción de la biblioteca asyncio, los desarrolladores de Python obtuvieron soporte nativo para escribir código asíncrono. Al utilizar "async" y "await", los programadores de Python pueden crear corutinas, esperar operaciones asíncronas y aprovechar el bucle de eventos de Python para manejar tareas concurrentes de manera eficiente. Esta mejora abrió nuevas posibilidades para aplicaciones Python de alto rendimiento, especialmente en áreas como web scraping y procesamiento de datos concurrentes.

#### Más allá de C# y JavaScript

La influencia de "async" y "await" se extiende más allá de C# y JavaScript. Lenguajes de programación como C++, Rust y Kotlin también han adoptado este paradigma. C++20 introdujo las corutinas con las palabras clave "co\_await" y "co\_yield", lo que permite la programación asíncrona. Rust, conocido por su enfoque en rendimiento y seguridad, estabilizó el soporte de "async" y "await", lo que permite a los desarrolladores escribir aplicaciones Rust eficientes y concurrentes. Kotlin, un lenguaje basado en JVM, adoptó "async" y "await" en la versión 1.5, permitiendo a los desarrolladores escribir código asíncrono más expresivo y eficiente.

* * *

La aparición del paradigma "async" y "await" ha transformado el panorama de la programación asíncrona, haciéndola más accesible, legible y fácil de mantener en varios lenguajes de programación. Desde sus orígenes en C# hasta su proliferación en JavaScript, Python, C++, Rust, Kotlin y más, "async" y "await" han empoderado a los desarrolladores para manejar operaciones asíncronas de manera más intuitiva y eficiente. Al adoptar este poderoso paradigma, los programadores pueden desbloquear todo el potencial de la programación asíncrona, lo que conduce a aplicaciones más escalables, receptivas y eficientes.
