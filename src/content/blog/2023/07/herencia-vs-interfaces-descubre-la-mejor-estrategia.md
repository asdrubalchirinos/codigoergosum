---
title: 'Herencia vs. Interfaces: Descubre la Mejor Estrategia'
pubDate: '2023-07-31'
heroImage: /images/blog/herencia-vs-interfaces-descubre-la-mejor-estrategia/hero.jpeg
author: Asdrúbal Chirinos
tags:
  - poo
  - clean-code
  - arquitectura
  - testing
slug: herencia-vs-interfaces-descubre-la-mejor-estrategia
---

![](/images/blog/herencia-vs-interfaces-descubre-la-mejor-estrategia/hero.jpeg)

caption...

La programación orientada a objetos (POO) es un paradigma ampliamente utilizado en el desarrollo de software moderno. Uno de los pilares fundamentales de la POO es la reutilización de código, para la cuál se utilizan dos mecanismos comunes, la herencia y las interfaces. Aunque ambos tienen sus usos y ventajas, en este artículo exploraremos por qué las interfaces suelen ser preferibles a la herencia en muchos escenarios.

#### Flexibilidad

Una de las principales razones para favorecer las interfaces es que permiten una mayor flexibilidad en la jerarquía de clases. En la POO, una clase solo puede heredar de una sola clase padre, lo que limita su capacidad para reutilizar código de múltiples fuentes. Sin embargo, una clase puede implementar múltiples interfaces, lo que permite una mayor modularidad y una composición más flexible de comportamientos.

#### Eliminación del acoplamiento

El acoplamiento fuerte entre clases puede llevar a una base de código frágil y difícil de mantener. La herencia crea un fuerte acoplamiento entre la clase base y las clases derivadas, lo que significa que cualquier cambio en la clase base puede tener efectos inesperados en las clases derivadas. Las interfaces, por otro lado, fomentan un acoplamiento más débil, ya que solo especifican un contrato que las clases deben seguir. Esto facilita el cambio y la evolución de las clases sin afectar otras partes del código.

#### Promueve el diseño basado en comportamiento

El enfoque de interfaces fomenta un diseño basado en comportamiento más que en jerarquía. En lugar de preocuparse por "qué es" una clase (como en el enfoque de herencia), el diseño se centra en "qué hace" una clase. Esto lleva a un código más limpio, cohesivo y fácil de mantener, ya que las clases se agrupan en función de sus responsabilidades y comportamientos.

#### Facilita el uso de la composición

El uso de interfaces facilita la composición en lugar de la herencia. La composición permite construir objetos complejos combinando varios componentes más pequeños en lugar de crear una jerarquía de clases compleja. Esto mejora la modularidad y la reutilización, lo que conduce a un código más mantenible y extensible.

#### Mejora la capacidad de pruebas unitarias

Las interfaces son especialmente útiles en pruebas unitarias y pruebas de integración. Al diseñar clases con interfaces bien definidas, se pueden crear pruebas más precisas y aisladas, ya que se pueden reemplazar fácilmente implementaciones con objetos simulados (mocks) o stubs que cumplan con esas interfaces.

* * *

Aunque la herencia tiene su lugar y es útil en ciertos contextos, las interfaces ofrecen una alternativa más flexible y poderosa para lograr la reutilización del código y el diseño de sistemas mejor mantenibles y escalables. Al preferir el uso de interfaces sobre la herencia, los desarrolladores pueden escribir código más modular, desacoplado y fácil de mantener, lo que se traduce en un desarrollo de software más efectivo y sostenible a largo plazo.
