---
title: COBOL a Través de los Años
subtitle: >-
  Explora la fascinante historia de COBOL en la tecnología empresarial y
  acompáñame en mi viaje personal junto a este influyente lenguaje de
  programación.
pubDate: '2023-09-19'
heroImage: /images/blog/2023/09/cobol-a-traves-de-los-anos/hero.jpeg
author: Asdrúbal Chirinos
tags:
  - nostalgia
  - carrera
  - soft-skills
slug: cobol-a-traves-de-los-anos
---

![](/images/blog/2023/09/cobol-a-traves-de-los-anos/hero.jpeg)

En los años 80, cuando todavía usaba discos de 5 1/4 y mis sonidos favoritos seguian siendo los pitidos de 4 bits de mi Atari 2600, tuve el privilegio de entrar en contacto con un lenguaje de programación que, en aquel entonces, parecía la piedra angular de la tecnología empresarial. Hablo de COBOL, o Common Business Oriented Language, un lenguaje que, aunque muchos consideran antiguo, sigue vivo y coleando en el mundo de la programación actual. Permíteme llevarte en un viaje por el tiempo, entrelazando mi propia experiencia personal con este fascinante lenguaje

## **El Origen**

Corría el año 1959, yo no nacía aún, cuando [Mary Hawes](https://en.wikipedia.org/wiki/Mary_K._Hawes), pionera en programación y miembro del Comité de Planificación para el Lenguaje COBOL, expresó la necesidad de un lenguaje de programación común para aplicaciones comerciales. Esta semilla dio lugar al nacimiento de COBOL, un lenguaje diseñado para ser legible por humanos y adecuado para procesar datos comerciales. COBOL se convirtió en un estándar y fue adoptado rápidamente por muchas empresas.

## **La Época de Gloria y Mi Encuentro con COBOL**

En los años 80, COBOL todavía brillaba con fuerza. Era el lenguaje de elección para las aplicaciones empresariales críticas, desde sistemas de nómina hasta gestión de inventarios y contabilidad. Fue por ese tiempo, cuando tenía apenas 12 años, cuando me encontré con COBOL. Mi viaje en el mundo de la programación ya había comenzado con BASIC, que sirvió como punto de partida, una introducción a la lógica detrás de la programación.

Sin embargo, COBOL era una bestia diferente. Las estructuras de COBOL, con sus "DIVISIONS" y su enfoque en la legibilidad empresarial, parecían enigmáticas en comparación con la simplicidad de BASIC. Pero como cualquier desafío, lo enfrenté con determinación.

### **La Arquitectura COBOL**

COBOL se asemeja a la forma en que pensamos sobre procesos comerciales. Su diseño se enfoca en la legibilidad humana y en la creación de estructuras claras que facilitan la comprensión de aplicaciones empresariales complejas. Una de las características más distintivas de COBOL es su estructura organizada en "DIVISIONS" (divisiones), que proporciona un enfoque claro y metódico para diseñar programas COBOL.

#### **Las Divisiones COBOL**

Estas divisiones, como se les conoce en COBOL, desempeñan roles específicos en la estructura del programa:

1.  **Identification Division**: Esta división actúa como la portada del programa, proporcionando información esencial como el nombre del programa, el autor y la fecha de creación.

2.  **Environment Division**: En esta sección, se especifica el entorno en el que se ejecutará el programa COBOL, incluyendo la configuración de archivos y la asignación de dispositivos de entrada/salida, entre otros.

3.  **Data Division**: La Data Division es crítica, ya que aquí se define la estructura de datos utilizada en el programa. Esto incluye la declaración de variables, registros y tablas, así como su organización y almacenamiento.

4.  **Procedure Division**: La Procedure Division es donde reside la lógica del programa. Aquí se codifican las instrucciones que realizan cálculos, procesan datos y toman decisiones.


Ahora, proporcionemos un ejemplo simple de un programa típico de COBOL para ilustrar cómo estas divisiones funcionan juntas de manera coherente:

```
IDENTIFICATION DIVISION.
PROGRAM-ID. CalculoPromedio.
AUTHOR. TuNombre.
DATE-WRITTEN. 18/09/2023. ENVIRONMENT DIVISION.
CONFIGURATION SECTION.
SOURCE-COMPUTER. IBM-PC. DATA DIVISION.
WORKING-STORAGE SECTION.
01 Numero1 PIC 9(3).
01 Numero2 PIC 9(3).
01 Numero3 PIC 9(3).
01 Promedio PIC 9(3). PROCEDURE DIVISION.
Display "Ingrese el primer número: ".
Accept Numero1.
Display "Ingrese el segundo número: ".
Accept Numero2.
Display "Ingrese el tercer número: ".
Accept Numero3. Compute Promedio = (Numero1 + Numero2 + Numero3) / 3. Display "El promedio es: " Promedio. STOP RUN.
```

En este ejemplo:

Programa COBOL que calcula el promedio de tres números ingresados por el usuario:

-   La Identification Division contiene información sobre el programa y su autor.

-   La Environment Division especifica la configuración para una computadora tipo IBM-PC.

-   La Data Division define las variables que utilizaremos, en este caso, tres números y una variable para el promedio.

-   En la Procedure Division, se le pide al usuario que ingrese los números, se realiza el cálculo del promedio y se muestra el resultado.


La estructura clara de las divisiones hace que sea fácil entender la funcionalidad de este programa COBOL, lo que lo hace ideal para aplicaciones empresariales donde la claridad y la mantenibilidad son esenciales.

### La Caída

Como toda estrella, COBOL tuvo su declive. A medida que avanzaba la década de 1980, los lenguajes orientados a objetos como C++ y Java comenzaron a ganar terreno. COBOL fue etiquetado como anticuado y poco atractivo para las nuevas generaciones de programadores. Muchas empresas optaron por reescribir sus aplicaciones en lenguajes más modernos, y COBOL fue relegado al olvido en muchas organizaciones.

## El Renacimiento

Sin embargo, COBOL no murió. Sorprendentemente, se ha mantenido relevante a lo largo de los años debido a una simple razón: las aplicaciones comerciales que se crearon en COBOL seguían siendo esenciales para muchas empresas. Reemplazar sistemas críticos de larga data no era tarea sencilla ni económica. Entonces, COBOL se mantuvo en funcionamiento, incluso cuando otros lenguajes lo eclipsaban.

## Lecciones de COBOL

Mi experiencia con este lenguaje me ha enseñado que, en el mundo de la tecnología, lo antiguo no queda necesariamente en desuso. COBOL continúa desempeñando un papel crucial en muchas instituciones financieras y gubernamentales, lo que subraya su fiabilidad a lo largo del tiempo. Además, destaca la importancia de la adaptación y la evolución en el ámbito tecnológico.

* * *

La próxima vez que escuches que este lenguaje es obsoleto, recuerda que tiene un lugar especial en la historia de la programación y sigue desafiando las expectativas en un entorno tecnológico en constante cambio. COBOL es un recordatorio de que lo antiguo puede ser valioso, o al menos, seguir siendo útil. Mi viaje desde BASIC hasta esta tecnología fue un marcado diferenciador en mi trayectoria de aprendizaje en programación.
