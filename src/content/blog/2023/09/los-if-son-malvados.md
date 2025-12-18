---
title: Los 'IF' son Malvados
subtitle: >-
  Descubre estrategias efectivas para eliminar el exceso de IF en tu código y
  mejorar su claridad y mantenibilidad.
pubDate: '2023-09-27'
heroImage: /images/blog/2023/09/los-if-son-malvados/hero.jpeg
author: Asdrúbal Chirinos
tags:
  - clean-code
  - testing
slug: los-if-son-malvados
---

![](/images/blog/2023/09/los-if-son-malvados/hero.jpeg)

Las declaraciones condicionales, a menudo conocidas como "IF" en la programación, son una parte fundamental de los lenguajes de programación. Nos permiten tomar decisiones y controlar el flujo de nuestro código. Sin embargo, el abuso de las declaraciones IF puede llevar a un código difícil de leer, mantener y depurar. En este artículo, exploraremos diversas estrategias para evitar el uso y el abuso de las declaraciones IF, y por qué es esencial hacerlo.

## ¿Cual es el Problema?

Antes de adentrarnos en las soluciones, comprendamos por qué el uso excesivo de las declaraciones IF puede ser problemático:

1.  **Legibilidad:** Un código lleno de declaraciones IF anidadas se vuelve difícil de comprender. Es como navegar por un laberinto, lo que dificulta que los desarrolladores entiendan la lógica y mantengan el código.

2.  **Mantenibilidad**: El código con demasiadas declaraciones IF a menudo es frágil. Un pequeño cambio en los requisitos puede llevar a actualizaciones en cascada en múltiples condiciones IF, aumentando la probabilidad de introducir errores.

3.  **Testabilidad:** Los IF excesivos dificultan la escritura de pruebas unitarias exhaustivas. Cada rama en su código aumenta la cantidad de casos de prueba necesarios, lo que hace que las pruebas sean más complejas y consuman más tiempo.

4.  **Escalabilidad:** A medida que su base de código crece, mantener numerosas condiciones IF se vuelve difícil de manejar. Esto puede obstaculizar la escalabilidad de su proyecto y dificultar la incorporación de nuevos miembros al equipo.


## Estrategias para Evitar los IF

### Polimorfismo

Utilice los principios de la programación orientada a objetos, como el polimorfismo. En lugar de verificar el tipo de un objeto y realizar diferentes acciones, cree una interfaz o clase abstracta e implemente esta en varias subclases. De esta manera, puede llamar a métodos en objetos sin necesidad de comprobar IF, lo que promueve un código modular y más fácil de mantener.

#### Ejemplo usando IF para controlar el flujo del código:

```
class Vehiculo { conducir() { return "Conduciendo un vehículo"; }
} class Coche extends Vehiculo { conducir() { return "Conduciendo un coche"; }
} class Moto extends Vehiculo { conducir() { return "Conduciendo una moto"; }
} // Uso de IF para decidir qué tipo de vehículo se conduce
function conducirVehiculo(vehiculo) { if (vehiculo instanceof Coche) { return "Conduciendo un coche"; } else if (vehiculo instanceof Moto) { return "Conduciendo una moto"; } else { return "Conduciendo un vehículo"; }
} const vehiculo1 = new Coche();
const vehiculo2 = new Moto();
const vehiculo3 = new Vehiculo(); console.log(conducirVehiculo(vehiculo1)); // "Conduciendo un coche"
console.log(conducirVehiculo(vehiculo2)); // "Conduciendo una moto"
console.log(conducirVehiculo(vehiculo3)); // "Conduciendo un vehículo"
```

Ahora, el mismo ejemplo utilizando **polimorfismo**:

```
class Vehiculo { conducir() { return "Conduciendo un vehículo"; }
} class Coche extends Vehiculo { conducir() { return "Conduciendo un coche"; }
} class Moto extends Vehiculo { conducir() { return "Conduciendo una moto"; }
} const vehiculo1 = new Coche();
const vehiculo2 = new Moto();
const vehiculo3 = new Vehiculo(); console.log(vehiculo1.conducir()); // "Conduciendo un coche"
console.log(vehiculo2.conducir()); // "Conduciendo una moto"
console.log(vehiculo3.conducir()); // "Conduciendo un vehículo"
```

### Cambie a Diccionarios o Mapas

Si sus declaraciones IF mapean claves a valores o comportamientos, considere usar diccionarios o mapas (arreglos asociativos). Muchos lenguajes de programación proporcionan estructuras de datos que le permiten lograr esto de manera más elegante, mejorando la legibilidad del código.

#### Ejemplo usando IF para mapear nombres de frutas a colores:

```
function obtenerColorFruta(fruta) { if (fruta === "manzana") { return "rojo"; } else if (fruta === "plátano") { return "amarillo"; } else if (fruta === "uva") { return "morado"; } else { return "desconocido"; }
} console.log(`El color de la manzana es ${obtenerColorFruta("manzana")}`);
console.log(`El color de la pera es ${obtenerColorFruta("pera")}`);
```

Ahora, el mismo ejemplo utilizando un **diccionario**:

```
const frutasColores = { "manzana": "rojo", "plátano": "amarillo", "uva": "morado"
}; function obtenerColorFruta(fruta) { return frutasColores[fruta] || "desconocido";
} console.log(`El color de la manzana es ${obtenerColorFruta("manzana")}`);
console.log(`El color de la pera es ${obtenerColorFruta("pera")}`);
```

### Patrón de Estrategia

Implemente el Patrón de Estrategia para encapsular algoritmos. Defina una familia de algoritmos, encapsule cada uno y haga que sean intercambiables sin alterar el código del cliente. Esto promueve la flexibilidad del código y la facilidad de mantenimiento.

#### **Ejemplo utilizando solo IF**:

Supongamos que estamos construyendo un sistema de envío de mensajes, y queremos aplicar diferentes estrategias de envío basadas en el tipo de mensaje (correo electrónico, SMS, notificación push, etc.). Usaremos IF para seleccionar la estrategia de envío adecuada:

```
class Mensaje { constructor(tipo) { this.tipo = tipo; } enviar(destino, contenido) { if (this.tipo === "email") { console.log(`Enviando correo electrónico a ${destino}: ${contenido}`); } else if (this.tipo === "sms") { console.log(`Enviando SMS a ${destino}: ${contenido}`); } else if (this.tipo === "push") { console.log(`Enviando notificación push a ${destino}: ${contenido}`); } else { console.log("Tipo de mensaje no válido"); } }
} const mensajeEmail = new Mensaje("email");
mensajeEmail.enviar("usuario@example.com", "Hola, ¿cómo estás?"); const mensajeSMS = new Mensaje("sms");
mensajeSMS.enviar("+123456789", "Hola desde un SMS!"); const mensajePush = new Mensaje("push");
mensajePush.enviar("Dispositivo123", "¡Tienes una nueva notificación!"); const mensajeInvalido = new Mensaje("invalido");
mensajeInvalido.enviar("destino", "Este mensaje no se enviará");
```

Ahora, implementemos el mismo escenario utilizando el patrón de estrategia, donde cada tipo de mensaje tiene su propia estrategia de envío:

```
// Creamos las estrategias de envío
class EstrategiaEmail { enviar(destino, contenido) { console.log(`Enviando correo electrónico a ${destino}: ${contenido}`); }
} class EstrategiaSMS { enviar(destino, contenido) { console.log(`Enviando SMS a ${destino}: ${contenido}`); }
} class EstrategiaPush { enviar(destino, contenido) { console.log(`Enviando notificación push a ${destino}: ${contenido}`); }
} // Creamos la clase de contexto que selecciona la estrategia adecuada
class Mensaje { constructor(estrategia) { this.estrategia = estrategia; } enviar(destino, contenido) { this.estrategia.enviar(destino, contenido); }
} // Usamos el patrón de estrategia para enviar mensajes
const mensajeEmail = new Mensaje(new EstrategiaEmail());
mensajeEmail.enviar("usuario@example.com", "Hola, ¿cómo estás?"); const mensajeSMS = new Mensaje(new EstrategiaSMS());
mensajeSMS.enviar("+123456789", "Hola desde un SMS!"); const mensajePush = new Mensaje(new EstrategiaPush());
mensajePush.enviar("Dispositivo123", "¡Tienes una nueva notificación!");
```

### Técnicas de Programación Funcional

Apliquemos conceptos de programación funcional, como la asignación, la filtración y la reducción de colecciones, para reemplazar la lógica IF compleja. El código funcional tiende a ser más conciso, legible y más fácil de probar.

**Ejemplo de Programación Funcional**:

Supongamos que tenemos una lista de números y queremos filtrar los números pares de esa lista utilizando la programación funcional en lugar de un bucle `for` con `if`:

```
// Lista de números
const numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Función de filtrado para números pares
const esPar = numero => numero % 2 === 0; // Usamos la función de filtrado y programación funcional
const numerosPares = numeros.filter(esPar); console.log("Números pares:", numerosPares);
```

### Cláusulas de Guardia y Retornos Tempranos

Use cláusulas de guardia o retornos tempranos para manejar casos excepcionales al comienzo de una función. Esto simplifica la lógica principal al eliminar declaraciones IF anidadas, mejorando la claridad del código.

#### **Ejemplo de Evitar la Profundidad de Anidamiento**:

```
function validarAccesoUsuario(usuario) { // Cláusula de guardia: Verifica si el usuario está autenticado if (!usuario.autenticado) { console.log("Usuario no autenticado."); return false; // Retorno temprano si el usuario no está autenticado } // Cláusula de guardia: Verifica si el usuario tiene permisos de administrador if (usuario.rol !== "admin") { console.log("Usuario no tiene permisos de administrador."); return false; // Retorno temprano si el usuario no es administrador } // Cláusula de guardia: Verifica si el usuario tiene más de 18 años if (usuario.edad < 18) { console.log("El usuario debe ser mayor de 18 años."); return false; // Retorno temprano si el usuario es menor de 18 años } // Lógica principal para acceder a los recursos console.log("Acceso permitido a los recursos."); return true;
}
```

### Otras estrategias para Evitar los IF son:

-   **Máquinas de Estados:** Para gestionar transiciones de estado complejas, considere el uso de máquinas de estados. Le permiten modelar y controlar el comportamiento del sistema sin depender en gran medida de declaraciones condicionales, lo que resulta en un código más fácil de mantener.

-   **Coincidencia de Patrones:** Algunos lenguajes modernos ofrecen construcciones de coincidencia de patrones que le permiten emparejar estructuras de datos y realizar acciones basadas en patrones, haciendo que su código sea más expresivo y legible.

-   **Refactorice en Funciones y Clases:** Divida su código en funciones y clases más pequeñas y reutilizables. Esto no solo reduce la complejidad, sino que también elimina la necesidad de lógica IF intrincada dentro de las funciones.

-   **Use Patrones de Diseño:** Familiarícese con patrones de diseño como Factory, Observer, Decorator y Command. Estos patrones ofrecen soluciones elegantes a problemas de diseño comunes sin recurrir a declaraciones IF excesivas.


## Por Qué Evitar los IFs es Importante

Al utilizar estas estrategias y minimizar el uso de declaraciones IF, puede mejorar significativamente la legibilidad, mantenibilidad y testabilidad de su código. Aquí está por qué es importante:

1.  **Código Legible:** Un código fácil de leer y comprender es menos propenso a errores y más fácil de mantener.

2.  **Código Mantenible:** Menos declaraciones IF reduce el riesgo de introducir errores al realizar cambios o agregar características.

3.  **Testabilidad:** El código con menos lógica de bifurcación es más fácil de probar de manera exhaustiva, lo que conduce a un software más robusto.

4.  **Escalabilidad:** A medida que su proyecto crece, un código limpio y sin IF excesivos facilita la adición de nueva funcionalidad y la incorporación de nuevos desarrolladores.


* * *

Los "IF" pueden ser una construcción fundamental en la programación, pero su uso excesivo y abuso pueden llevar a un código malvado en términos de legibilidad, mantenibilidad y escalabilidad. Al adoptar estrategias alternativas como el polimorfismo, los diccionarios, la programación funcional y los patrones de diseño, puede crear un código más limpio, más mantenible y más fácil de probar. Recuerde, el objetivo no es eliminar las declaraciones IF por completo, sino usarlas con prudencia y estratégicamente para mejorar la calidad de su código. Al hacerlo, creará software más robusto y más fácil de trabajar, ahorrando tiempo y esfuerzo a largo plazo.
