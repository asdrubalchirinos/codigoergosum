---
title: Más allá del SELECT * FROM
subtitle: >-
  Sumérgete en el mundo de las bases de datos: comprensión profunda,
  almacenamiento y optimización
pubDate: '2023-09-15'
heroImage: /images/blog/2023/09/mas-alla-del-select-from/hero.jpeg
author: Asdrúbal Chirinos
tags:
  - backend
  - devops
  - ia
slug: mas-alla-del-select-from
---

![](/images/blog/2023/09/mas-alla-del-select-from/hero.jpeg)

Imagen creada por inteligencia artificial. Ideogram.ai

En el ámbito de la programación, es común que los profesionales se centren en el aprendizaje de las consultas SQL (Structured Query Language), pero a menudo se pasan por alto los conceptos fundamentales de las bases de datos. Este artículo te llevará a un viaje más allá de las consultas SQL, explorando no solo cómo funcionan las bases de datos, sino también por qué se crearon, su relación con el almacenamiento en discos duros y los tipos esenciales de índices, incluyendo los poco discutidos Clustered, Non-Clustered, únicos y Full-Text.

### El Propósito de las Bases de Datos

Para entender plenamente las bases de datos, es crucial retroceder en el tiempo y preguntarse por qué se crearon. Las bases de datos surgieron como una respuesta a la necesidad de organizar, almacenar y acceder a grandes cantidades de datos de manera eficiente. Sin ellas, sería como buscar una aguja en un pajar. Las bases de datos existen para simplificar la gestión de datos, permitiendo un acceso rápido y organizado.

### Bases de Datos y Almacenamiento en Disco

Las bases de datos y los discos duros tienen una relación íntima. Las bases de datos necesitan almacenar datos de manera física, y esto se hace en discos duros u otros dispositivos de almacenamiento. Comprender cómo los datos se almacenan en disco y cómo se acceden a ellos puede marcar la diferencia en la eficiencia de una base de datos. La gestión del espacio en disco, la fragmentación y la optimización son aspectos clave de esta relación.

### El Intrincado Mundo de los Índices

Ahora, llegamos a uno de los aspectos más profundos y esenciales: los índices. Aparte de los índices simples, hay dos tipos principales de índices: Clustered y Non-Clustered. Los índices Clustered determinan el orden físico de los datos en la tabla, lo que puede mejorar el rendimiento de ciertas consultas. Los índices Non-Clustered proporcionan una vía de acceso rápida a los datos, actuando como un índice de un libro. Además, existen índices únicos que aseguran que no haya duplicados y los índices Full-Text, que permiten búsquedas de texto completo en grandes cantidades de datos.

### Expandiendo tu Dominio

Si aspiras a roles más avanzados como programador, comprender estos conceptos es esencial. Preguntas sobre la diferencia entre índices Clustered y Non-Clustered, así como sobre índices únicos y Full-Text, son comunes en entrevistas técnicas. Asegúrate de estar preparado para abordar estas cuestiones con confianza.

Hay varios libros y recursos que pueden ayudarte a profundizar en los temas de bases de datos, almacenamiento en disco y estructuras de índices. Aquí te proporciono algunas recomendaciones:

-   **Fundamentals of Database Systems por Ramez Elmasri y Shamkant B. Navathe:** Este libro es ampliamente utilizado en cursos de bases de datos y ofrece una sólida introducción a los conceptos fundamentales.

-   **Database Systems: The Complete Book por Hector Garcia-Molina, Jeffrey D. Ullman y Jennifer Widom:** Este libro incluye una sección sólida sobre almacenamiento en disco y estructuras de acceso.

-   **Designing Data-Intensive Applications por Martin Kleppmann:** Aunque se centra en aplicaciones de datos, explora conceptos importantes sobre almacenamiento y optimización de datos.


* * *

Mientras que las consultas SQL son un componente crítico de la programación, explorar los fundamentos profundos es lo que te convertirá en un profesional más versátil y competente. Desde la razón de ser de las bases de datos hasta su relación con el almacenamiento en disco y la complejidad de los diversos tipos de índices, este viaje hacia lo profundo te equipará para enfrentar desafíos más complejos y entrevistas técnicas con confianza.
