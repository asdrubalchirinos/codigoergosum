---
title: ¿Es la recursión tan mala como la pintan?
subtitle: >-
  Descubre si la recursión es realmente esencial en el desarrollo de software.
  Ejemplos reveladores te mostrarán la respuesta.
pubDate: '2023-09-28'
heroImage: /images/blog/2023/09/es-la-recursion-tan-mala-como-la-pintan/hero.jpeg
author: Asdrúbal Chirinos
tags:
  - clean-code
  - funcional
slug: es-la-recursion-tan-mala-como-la-pintan
---

![](/images/blog/2023/09/es-la-recursion-tan-mala-como-la-pintan/hero.jpeg)

Imagen generada por inteligencia artificial. Ideogram.ai. Prompt: An image of a never-ending spiral staircase, each step repeating infinitely.

La recursión es un concepto ampliamente enseñado en cursos académicos de programación y algoritmos. Cuando era estudiante de informática, me encontré con ejemplos de funciones recursivas, desde el clásico cálculo del factorial hasta algoritmos de búsqueda en árboles binarios. Sin embargo, a medida que avanzaba en mi carrera y comenzaba a trabajar en proyectos de desarrollo de software en el mundo real, a menudo me preguntaba si la recursión era tan relevante y valiosa como se me hizo creer en el aula.

## **Mi Perspectiva sobre la Recursión**

Primero, es importante entender qué es la recursión. En términos simples, la recursión es una técnica de programación en la que una función se llama a sí misma para resolver un problema más grande al dividirlo en subproblemas más pequeños. Esta técnica puede llevar a soluciones elegantes y concisas para ciertos tipos de problemas. Sin embargo, la pregunta clave es si estas soluciones son prácticas en situaciones del mundo real.

## **Uso Académico vs. Producción**

**Uso Académico**: La recursión es una herramienta valiosa en el ámbito académico. Ayuda a los estudiantes, como yo en su momento, a comprender conceptos fundamentales de programación y algoritmos, como la estructura de datos de las listas enlazadas, los árboles binarios o los algoritmos de ordenamiento recursivos. La recursión fomenta un pensamiento abstracto y la capacidad de dividir problemas complejos en tareas más simples. Además, puede dar lugar a soluciones elegantes que son fáciles de entender y depurar en un entorno de laboratorio.

**Producción de Software**: En el mundo real, el uso de la recursión es más selectivo. Se vuelve esencial en situaciones donde la estructura del problema es intrínsecamente recursiva o cuando simplifica significativamente la solución. Por ejemplo, en aplicaciones de procesamiento de árboles de decisión o en la manipulación de estructuras de datos recursivas, como los árboles AVL, la recursión puede ofrecer ventajas notables en términos de claridad y simplicidad del código.

## **Las Desventajas de la Recursión**

A pesar de sus ventajas en el contexto académico y en ciertos problemas del mundo real, la recursión tiene limitaciones importantes que deben ser consideradas:

**Consumo de Memoria**: Las funciones recursivas a menudo utilizan más memoria, ya que cada llamada recursiva agrega una nueva instancia de la función a la pila de llamadas. Esto puede resultar en desbordamientos de pila en problemas con profundidad de recursión significativa.

**Rendimiento**: En comparación con las soluciones iterativas (que utilizan bucles), las funciones recursivas pueden ser más lentas debido al costo adicional de administrar la pila de llamadas y a veces a la falta de optimización del compilador.

**Depuración**: Los errores en funciones recursivas pueden ser difíciles de rastrear y depurar debido a la naturaleza de las llamadas en cascada. Identificar el punto exacto de falla puede ser complicado.

## **Ejemplo Clásico: Cálculo de la Serie de Fibonacci**

Un ejemplo clásico que ilustra la diferencia entre la recursión y la iteración eficiente es el cálculo de la serie de Fibonacci. La serie de Fibonacci es una secuencia matemática en la que cada número es la suma de los dos números anteriores en la secuencia. La secuencia comienza con 0 y 1, y los primeros números de la serie son 0, 1, 1, 2, 3, 5, 8, 13, 21, y así sucesivamente.

**Enfoque Recursivo**:

Un enfoque recursivo para calcular el número de Fibonacci de un valor `n` podría verse así en pseudocódigo:

```
function fibonacci(n): if n <= 0: return 0 elif n == 1: return 1 else: return fibonacci(n-1) + fibonacci(n-2)
```

Este enfoque utiliza recursión para calcular los números de Fibonacci, pero tiene un rendimiento pobre para valores grandes de `n` debido a la cantidad significativa de cálculos repetitivos.

**Enfoque No Recursivo (Iterativo)**:

Una forma más eficiente de calcular los números de Fibonacci es utilizando un enfoque iterativo con un bucle, que evita los cálculos redundantes. Aquí hay un ejemplo en pseudocódigo:

```
function fibonacci(n): if n <= 0: return 0 elif n == 1: return 1 fib = [0, 1] for i in range(2, n+1): next_fib = fib[0] + fib[1] fib[0], fib[1] = fib[1], next_fib return fib[1]
```

Este enfoque no recursivo utiliza un bucle para calcular el número de Fibonacci deseado sin repetir cálculos innecesarios. Es mucho más eficiente en términos de tiempo de ejecución y consumo de memoria para valores grandes de `n`.

* * *

Entonces, ¿es la recursión tan mala como algunos la pintan? La respuesta depende. Dependerá del contexto y del problema en cuestión. La recursión es una herramienta valiosa que puede facilitar la comprensión y la resolución de ciertos problemas, especialmente en entornos académicos y en aplicaciones específicas. Sin embargo, en la producción de software, es importante considerar cuidadosamente los aspectos de rendimiento, consumo de memoria y facilidad de depuración antes de decidir si la recursión es la mejor opción. El ejemplo del cálculo de la serie de Fibonacci ilustra cómo un enfoque no recursivo puede ser más eficiente y adecuado para ciertos problemas en el mundo real. En última instancia, la recursión es una herramienta en mi arsenal como programador, y su uso sabio y selectivo es esencial para crear software robusto y eficiente en el mundo real.
