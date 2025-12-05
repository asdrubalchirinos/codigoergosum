---
title: Los 4 Pilares de la Programación Orientada a Objetos (POO)
pubDate: '2023-08-03'
heroImage: >-
  /images/blog/los-4-pilares-de-la-programacion-orientada-a-objetos-poo/hero.jpeg
author: Asdrúbal Chirinos
tags:
  - poo
  - clean-code
  - arquitectura
slug: los-4-pilares-de-la-programacion-orientada-a-objetos-poo
---

La Programación Orientada a Objetos (POO) es un paradigma de programación que permite organizar el código de manera más estructurada y modular, facilitando la creación y mantenimiento de sistemas complejos. En la POO, existen cuatro pilares fundamentales que son clave para comprender cómo se estructuran los programas y cómo interactúan los objetos entre sí. Estos pilares son: **Abstracción, Encapsulación, Herencia y Polimorfismo**. En este artículo, explicaremos cada uno de ellos utilizando ejemplos en C# de fácil comprensión.

![](/images/blog/los-4-pilares-de-la-programacion-orientada-a-objetos-poo/hero.jpeg)

**Los cuatro (4) pilares de la POO: Abstracción, Encapsulación, Herencia y Polimorfismo**.

### Abstracción

La abstracción se trata de identificar las características esenciales de un objeto y enfocarse en lo que hace, en lugar de cómo lo hace. En el contexto de la POO, esto implica definir una interfaz que describe cómo interactuaremos con el objeto, sin preocuparnos por los detalles internos de su implementación. Imaginemos un automóvil; no necesitamos saber cómo funciona el motor internamente para conducirlo, simplemente utilizamos el volante, el acelerador y el freno. Así, la abstracción nos permite simplificar la complejidad y diseñar nuestros objetos para que se centren en sus funciones principales.

**Ejemplo en C#**

```
// Abstracción: Definimos la interfaz IVehiculo con métodos Acelerar y Frenar
public interface IVehiculo
{ void Acelerar(); void Frenar();
} // Implementación concreta de la interfaz IVehiculo para Automovil
public class Automovil : IVehiculo
{ public void Acelerar() { Console.WriteLine("El automóvil está acelerando."); } public void Frenar() { Console.WriteLine("El automóvil está frenando."); }
}
```

En el ejemplo, creamos una interfaz `IVehiculo` que declara dos métodos `Acelerar()` y `Frenar()`. Luego, la clase `Automovil` implementa esta interfaz y define cómo acelerar y frenar un automóvil sin revelar su implementación interna.

### Encapsulación

La encapsulación es el acto de ocultar los detalles internos de un objeto y exponer solo una interfaz pública para interactuar con él. Esto se logra mediante la protección de los atributos internos (usando modificadores de acceso como \`private\`) y proporcionando métodos públicos que permitan acceder y modificar estos atributos de manera controlada. En otras palabras, el objeto tiene el control total sobre sus datos y operaciones internas, evitando modificaciones no autorizadas desde fuera de la clase. La encapsulación promueve la seguridad y el mantenimiento del código, ya que cualquier cambio en la implementación interna no afectará a los clientes que utilizan la interfaz pública.

**Ejemplo en C#**

```
// Encapsulación: Ocultamos el atributo saldo y proporcionamos métodos públicos para interactuar con él
public class CuentaBancaria
{ // Marcamos atributo como privado para ocultarlo private double saldo; public void Depositar(double cantidad) { saldo += cantidad; } public void Retirar(double cantidad) { if (cantidad <= saldo) { saldo -= cantidad; } else { Console.WriteLine("Saldo insuficiente."); } } public double ObtenerSaldo() { return saldo; }
}
```

En el ejemplo, tenemos una clase `CuentaBancaria` con un atributo `saldo` privado y tres métodos públicos `Depositar()`, `Retirar()` y `ObtenerSaldo()`, que actúan como puntos de acceso controlados a ese saldo. Los clientes no pueden acceder directamente al saldo sin utilizar estos métodos públicos, lo que asegura un manejo seguro de los datos internos de la cuenta.

### Herencia

La herencia es un mecanismo que permite crear nuevas clases basadas en clases existentes, aprovechando la estructura y comportamiento de la clase base. Robert C. Martin nos advierte que la herencia debe usarse con precaución y solo cuando existe una relación lógica de "es-un" entre las clases. Por ejemplo, si tenemos una clase \`Animal\`, podemos crear clases derivadas como \`Perro\` y \`Gato\`, que heredarán atributos y métodos comunes de la clase base. Sin embargo, el mal uso de la herencia puede llevar a un código complejo y difícil de mantener, por lo que es importante aplicarla de manera coherente y significativa.

**Ejemplo en C#**

```
// Herencia: Creamos una clase base Animal y una clase derivada Perro
public class Animal
{ public void EmitirSonido() { Console.WriteLine("El animal hace un sonido."); }
} public class Gato : Animal
{ // El gato hereda el método EmitirSonido() de la clase Animal
}
```

En el ejemplo, tenemos una clase base `Animal` con un método `EmitirSonido()`, y una clase derivada `Gato` que hereda de `Animal`. El `Gato` hereda el comportamiento de `EmitirSonido()` de la clase base, lo que nos permite reutilizar y extender la funcionalidad común entre diferentes tipos de animales.

### Polimorfismo

El polimorfismo es un concepto que nos permite tratar objetos de diferentes clases de manera uniforme, siempre y cuando compartan una relación de herencia o implementen una interfaz común. En C#, esto se logra mediante la herencia, donde las clases derivadas pueden sobrescribir los métodos de la clase base para proporcionar su propia implementación. Este enfoque flexible y extensible del polimorfismo nos permite escribir métodos genéricos y reutilizables que pueden trabajar con diversas clases derivadas.

**Ejemplo en C#**

```
// Polimorfismo: Creamos una clase abstracta Figura con método abstracto CalcularArea
public abstract class Figura
{ public abstract double CalcularArea();
} // Clase derivada Cuadrado que sobrescribe el método CalcularArea
public class Cuadrado : Figura
{ private double lado; public Cuadrado(double lado) { this.lado = lado; } public override double CalcularArea() { return lado * lado; }
} // Clase derivada Circulo que sobrescribe el método CalcularArea
public class Circulo : Figura
{ private double radio; public Circulo(double radio) { this.radio = radio; } public override double CalcularArea() { return Math.PI * radio * radio; }
}
```

En el ejemplo, creamos una clase abstracta `Figura` con un método abstracto `CalcularArea()`. Luego, definimos dos clases derivadas `Cuadrado` y `Circulo` que heredan de `Figura` y sobrescriben el método `CalcularArea()` para calcular el área específica de cada figura. Gracias al polimorfismo, podemos tratar ambas formas geométricas de manera uniforme a través de la clase base `Figura`, lo que nos permite escribir código más genérico y reutilizable.

* * *

La Programación Orientada a Objetos se basa en cuatro pilares fundamentales: **Abstracción, Encapsulación, Herencia y Polimorfismo**. Cada uno de estos pilares es esencial para crear código modular, reutilizable y fácil de mantener. Al dominar estos conceptos, los programadores pueden construir sistemas más robustos y comprensibles, lo que les permitirá crecer como desarrolladores y enfrentar con confianza desafíos más complejos en el futuro.
