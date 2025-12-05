---
title: Robert C. Martin y su legado
subtitle: Los principios SOLID
pubDate: '2023-03-06'
heroImage: /images/blog/robert-c-martin-y-su-legado/hero.jpeg
author: Asdrúbal Chirinos
tags:
  - clean-code
  - poo
  - arquitectura
  - testing
slug: robert-c-martin-y-su-legado
---

SOLID es un acrónimo que representa los cinco principios fundamentales de la programación orientada a objetos. Estos principios fueron definidos por Robert C. Martin (también conocido como "Uncle Bob") con el objetivo de establecer pautas para desarrollar software de alta calidad, flexible y fácil de mantener.

![](/images/blog/robert-c-martin-y-su-legado/hero.jpeg)

Robert C. Martin “Uncle Bob”

**Los principios SOLID son:**

-   **S**ingle Responsibility Principle (Responsabilidad Única)

-   **O**pen-Closed (Abierto-Cerrado)

-   **L**iskov Substitution (Sustitución de Liskov)

-   **I**nterface Segregation (Segregación de interfaces)

-   **D**ependency Inversion (Inversión de dependencia)


Cada uno de estos principios está diseñado para abordar un aspecto específico de la programación orientada a objetos y puede ser aplicado en cualquier lenguaje de programación. Al seguir estos principios, los desarrolladores pueden crear software modular, escalable y fácil de mantener.

Hace poco publique una serie de tweets explicando con ejemplos simples estos principios. Los ejemplos esta escritos en Swift, pero los mismos son aplicables a cualquier otro lenguaje orientado a objetos.

... y para aquellos que me estén saltando de sus asientos diciendo que Swift no es un lenguaje orientado a objetos sino a protocolos, déjenme decirles que en realidad Swift es un lenguaje multiparadigma que admite tanto la programación orientada a objetos como la programación basada en protocolos.

Ahora vayamos a los ejemplos.

* * *

**Principio de responsabilidad única**

En este ejemplo, la clase NetworkService es responsable de realizar la solicitud de red y el UserViewController es responsable de gestionar la respuesta y actualizar la interfaz de usuario.

![No alt text provided for this image](/images/blog/robert-c-martin-y-su-legado/16b3c4ca-8a72-461f-aa32-b853dd15931f_874x1000.jpeg "No alt text provided for this image")

* * *

**Principio abierto-cerrado**

En este ejemplo, el protocolo Shape define el método area(), y las clases Rectangle y Circle se ajustan al protocolo, pero están abiertas a la ampliación mediante la adición de nuevas formas que se ajusten al protocolo, pero cerradas a la modificación.

![No alt text provided for this image](/images/blog/robert-c-martin-y-su-legado/753002d4-fe9f-4eb5-a4b8-df97042d15ea_920x1192.jpeg "No alt text provided for this image")

* * *

**Principio de sustitución de Liskov**

Ej: Las clases Coche y Moto heredan de Vehículo y sobreescriben el método startEngine(), permitiendo que los objetos de las subclases se utilicen dondequiera que se utilicen los objetos de la superclase, sin afectar a la corrección del programa.

![No alt text provided for this image](/images/blog/robert-c-martin-y-su-legado/b8c07dd9-5dd0-4bae-925c-30894b809c05_920x904.jpeg "No alt text provided for this image")

* * *

**Principio de segregación de interfaces**

En este ejemplo, la clase Penguin sólo necesita ajustarse a los protocolos Swimmable y Runnable, no necesita ajustarse al protocolo Flyable, por lo que no está obligada a implementar el método fly().

![No alt text provided for this image](/images/blog/robert-c-martin-y-su-legado/ce638689-a938-4771-8a9a-402b324567f3_832x904.jpeg "No alt text provided for this image")

* * *

**Principio de inversión de dependencia**

En este ejemplo, la clase DataProcessor depende de una abstracción (protocolo DataFetcher) en lugar de una implementación específica, lo que la hace más flexible y fácil de probar.

![No alt text provided for this image](/images/blog/robert-c-martin-y-su-legado/13a97666-b9fa-47a8-9b80-c5586f717254_874x1000.jpeg "No alt text provided for this image")

* * *

Entonces, los principios SOLID son una guía útil para los desarrolladores que buscan crear software de alta calidad y evitar los problemas comunes de la programación orientada a objetos, como el acoplamiento excesivo y la falta de cohesión en las clases y métodos.
