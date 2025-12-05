---
title: ¿Qué sabes sobre Programación Funcional?
subtitle: >-
  Explora las diferencias entre Programación Funcional y Orientada a Objetos,
  junto a la importancia de controlar los efectos secundarios en tu código.
pubDate: '2023-08-08'
heroImage: /images/blog/que-sabes-sobre-programacion-funcional/hero.jpeg
author: Asdrúbal Chirinos
tags:
  - funcional
  - poo
  - clean-code
  - python
slug: que-sabes-sobre-programacion-funcional
---

![](/images/blog/que-sabes-sobre-programacion-funcional/hero.jpeg)

Programación Funcional. [Foto de Jeswin Thomas](https://www.pexels.com/photo/person-writing-on-white-board-3781338/)

En el mundo de la programación se nos presentan diferentes enfoques de cómo construir software. La Programación Funcional es uno de estos paradigmas, ofreciendo una perspectiva única para desarrollar aplicaciones sólidas y eficientes. En este artículo, exploraremos qué es la Programación Funcional, cómo difiere de la Programación Orientada a Objetos.

### **Entendiendo la Programación Funcional**

La Programación Funcional se basa en la idea de que los programas son construidos a partir de funciones, similar a cómo se trabaja en matemáticas. En lugar de modificar estados y datos, la Programación Funcional se enfoca en la evaluación de funciones y la manipulación de datos inmutables. Es como armar un rompecabezas, donde cada pieza encaja perfectamente en su lugar y no cambia durante el proceso.

### **Ejemplos de Programación Funcional**

Vamos a ilustrar esto con un ejemplo sencillo. Supongamos que queremos calcular el cuadrado de una lista de números utilizando Programación Funcional en Python:

```
# Programación Funcional
def calcular_cuadrado(numero): return numero * numero numeros = [1, 2, 3, 4, 5]
cuadrados = list(map(calcular_cuadrado, numeros))
print(cuadrados)
```

Aquí, hemos definido la función `calcular_cuadrado` que toma un número y devuelve su cuadrado. Luego, utilizamos la función `map` para aplicar esta función a cada elemento de la lista `numeros`, obteniendo una lista de cuadrados.

### **Comparación con la Programación Orientada a Objetos**

En contraste, la Programación Orientada a Objetos (POO) se centra en modelar el mundo real a través de objetos que encapsulan datos y comportamientos. Veamos cómo se vería el mismo ejemplo en un enfoque orientado a objetos:

```
# Programación Orientada a Objetos
class Numero: def __init__(self, valor): self.valor = valor def calcular_cuadrado(self): return self.valor * self.valor numeros = [Numero(1), Numero(2), Numero(3), Numero(4), Numero(5)]
cuadrados = [numero.calcular_cuadrado() for numero in numeros]
print(cuadrados)
```

En este caso, creamos una clase `Numero` que tiene un atributo `valor` y un método `calcular_cuadrado` para calcular el cuadrado. Luego, creamos instancias de esta clase para cada número en la lista y llamamos al método correspondiente.

### **Ventajas de la Programación Funcional**

La Programación Funcional tiene varias ventajas, incluyendo:

1.  **Concisión y Legibilidad:** Las funciones puras son fáciles de entender y mantener, lo que mejora la legibilidad del código.

2.  **Facilita la Paralelización:** Dado que las funciones puras no tienen efectos secundarios, son ideales para la paralelización, lo que puede mejorar el rendimiento en sistemas multicore.

3.  **Reducción de Errores:** Al evitar efectos secundarios, se reducen los posibles errores relacionados con el estado del programa.


#### **Comprendiendo los Efectos Secundarios**

Hemos mencionado varias veces el termino efectos secundarios, ¿pero que son?, son como las consecuencias no deseadas que pueden ocurrir cuando realizamos acciones adicionales más allá de lo que una función debería hacer. Por ejemplo, si una función cambia variables fuera de su alcance o realiza operaciones que afectan el entorno, se considera que tiene efectos secundarios. Los efectos secundarios pueden hacer que el comportamiento del código sea impredecible y dificultan el razonamiento sobre cómo interactúan diferentes partes del programa.

#### **Importancia de Controlar los Efectos Secundarios**

Controlar los efectos secundarios es fundamental para crear código confiable y predecible. Al limitar dónde y cuándo ocurren, podemos evitar sorpresas y facilitar la depuración y el mantenimiento del código. En la Programación Funcional, se hace un esfuerzo consciente para minimizar los efectos secundarios, lo que lleva a un código más claro y robusto.

* * *

La Programación Funcional ofrece una perspectiva fresca y poderosa para desarrollar software al centrarse en funciones y datos inmutables. A medida que exploramos este enfoque, es importante reconocer cómo se compara con otros paradigmas como la Programación Orientada a Objetos. Además, comprender los efectos secundarios y su impacto en el código nos brinda herramientas para escribir programas más confiables y mantenibles.
