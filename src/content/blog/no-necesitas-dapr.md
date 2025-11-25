---
title: ¡No Necesitas Dapr!
subtitle: Descubre por qué las aplicaciones distribuidas y frameworks como Dapr no son necesarios en la mayoría de los casos, y cómo la simplicidad puede ser la mejor estrategia para tus proyectos.
pubDate: "2024-12-03"
heroImage: "/images/blog/no-necesitas-dapr/hero.png"
author: Asdrúbal Chirinos
tags: ["backend", "arquitectura", "devops", "opinion"]
---

El mundo del desarrollo de software y sus tendencias. Desde la contenerización hasta el “cómputo sin servidores” (serverless computing), siempre hay un término de moda. Uno de ellos es **Dapr**, un entorno de ejecución para aplicaciones distribuidas diseñado para simplificar la creación de microservicios. Y aunque frameworks como Dapr son potentes e interesantes, seamos sinceros: **no necesitas Dapr, al menos no para la mayoría de los escenarios.**

![](/images/blog/no-necesitas-dapr/hero.png)

### El furor de las aplicaciones distribuidas

Los sistemas distribuidos, los microservicios y similares han ganado mucha popularidad por buenas razones. Permiten una escalabilidad masiva, resiliencia y arquitecturas desacopladas. Pero aquí está el problema: **no todas las aplicaciones necesitan ser distribuidas.** La complejidad de los sistemas distribuidos a menudo supera con creces los beneficios para aplicaciones de pequeña a mediana escala.

Crear aplicaciones distribuidas no se trata solo de escribir código; implica gestionar la comunicación entre servicios, asegurar la consistencia, manejar fallos y enfrentarse a una serie de desafíos operativos. Frameworks como Dapr abstraen gran parte de esta complejidad, pero no pueden hacerla desaparecer.

### Siguiendo tendencias

Dapr es un framework fantástico para equipos con necesidades específicas, como:

-   **Múltiples microservicios con comunicación interservicios compleja.**

-   **Aplicaciones que requieren alta escalabilidad en múltiples nodos.**

-   **Arquitecturas altamente dependientes de eventos o mecanismos de pub/sub.**


Si tu proyecto no cumple con estos requisitos, adoptar un framework como Dapr puede crear más problemas de los que resuelve.

Por ejemplo, ¿tu proyecto:

-   Tiene un solo equipo trabajando en una aplicación monolítica?

-   Necesita una aplicación sencilla con pocas preocupaciones de escalabilidad?

-   Prioriza la simplicidad y la facilidad de depuración sobre la complejidad arquitectónica?


En estos casos, frameworks como Dapr introducen abstracciones innecesarias. Lo que podría lograrse con APIs REST básicas o procesamiento sincrónico se convierte en una maraña de componentes que requieren orquestación, almacenamiento de estados y observabilidad.

### Apostando por la simplicidad

La atracción por las herramientas novedosas puede cegarnos al hecho de que **la simplicidad a menudo es más valiosa que la complejidad.** Una aplicación monolítica, o incluso un diseño modular bien estructurado, puede satisfacer la mayoría de los casos de uso sin los dolores de cabeza de gestionar componentes distribuidos.

Algunos beneficios de optar por enfoques más simples son:

1.  **Facilidad de Desarrollo:** No necesitas aprender frameworks adicionales ni nuevos paradigmas.

2.  **Depuración Más Rápida:** Una aplicación, un código base, menos capas que analizar.

3.  **Menor Costo:** Evitas sobredimensionar la infraestructura solo para manejar comunicación distribuida.

4.  **Enfoque en lo Importante:** Dedica tiempo a desarrollar lo que importa, no a gestionar complejidades innecesarias.


### Usa la herramienta correcta

Esto no es un ataque contra Dapr o las aplicaciones distribuidas: son invaluables en los casos adecuados. Pero no todas las aplicaciones tienen el tamaño de **Google** o las necesidades de **Netflix.** Antes de subirte al tren de las apps distribuidas, pregúntate:

-   ¿Qué problema estoy tratando de resolver?

-   ¿Este problema se soluciona mejor con un sistema distribuido o con métodos más simples?

-   ¿Cuáles son las ventajas y desventajas en términos de velocidad de desarrollo, gestión operativa y escalabilidad?


En la mayoría de los casos, encontrarás que arquitecturas más simples—monolitos, diseños modulares o enfoques básicos orientados a servicios—cumplen con tus necesidades sin el costo adicional.

* * *

A nuestra industria le encantan las tendencias, y es fácil dejarse llevar por ellas. Pero no adoptes herramientas como Dapr solo porque están de moda. **Adóptalas porque resuelven un problema que realmente tienes.**

Si tu aplicación no exige la complejidad de los sistemas distribuidos, no necesitas Dapr—ni ningún framework similar. Abraza la simplicidad, enfócate en generar valor y deja las arquitecturas distribuidas para cuando realmente sean necesarias.
