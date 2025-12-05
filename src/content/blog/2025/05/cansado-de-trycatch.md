---
title: ¿Cansado de try/catch?
subtitle: Manejo limpio de errores en JavaScript reduciendo el uso del try/catch
pubDate: '2025-05-29'
heroImage: /images/blog/cansado-de-trycatch/hero.png
author: Asdrúbal Chirinos
tags:
  - javascript
  - clean-code
  - funcional
slug: cansado-de-trycatch
---

![JavaScript Banner](/images/blog/cansado-de-trycatch/a8f92ba8-79fe-427e-9a69-b354f5176657_1000x420.png "JavaScript Banner")

Una queja común entre quienes escribimos JavaScript es lo rápido que los bloques try/catch invaden nuestro código, especialmente al trabajar con lógica asíncrona o funciones que pueden fallar.

Pero… ¿y si hubiera una forma más limpia de manejar errores, sin comprometer claridad ni estabilidad?

* * *

## Presentando el patrón \[resultado, error\]

Empecemos con un caso básico: una función divide que puede fallar si el divisor es cero.

> *Este patrón está inspirado en el manejo de errores en Go, donde las funciones suelen devolver un valor y un error como parte de su contrato. En lugar de depender de excepciones, se espera que el desarrollador maneje los errores explícitamente.*

```
function divide(a, b) { if (b === 0) return [undefined, new Error("División por cero")]; return [a / b, undefined];
} const [resultado, error] = divide(10, 0); if (error) { console.error(error.message);
} else { console.log("Resultado:", resultado);
}
```

**¿Qué está pasando aquí?**

En vez de lanzar una excepción, la función devuelve una tupla:

-   **El primer valor es el resultado** (o undefined si hubo error)

-   **El segundo valor es el error** (o undefined si todo salió bien)


* * *

## Ventajas del patrón

-   Sin excepciones que interrumpan el flujo

-   Control explícito del resultado y del error

-   Lógica más legible, más predecible


* * *

## El límite: funciones que lanzan errores

El patrón anterior funciona perfecto con funciones que tú controlas directamente y puedes hacer que devuelvan errores en lugar de lanzarlos.

Pero… que pasa si trabajas con librerías como *Axios*, donde lanza un error automáticamente si algo sale mal (timeout, 4xx, 5xx…).

En este caso, si no usas forzosamente un *try/catch*, tu app va crashear.

```
const res = await axios.get("/api/data"); // Si falla, lanza excepción
```

* * *

## La solución: encapsular

La idea es mantener la lógica principal limpia, pero aceptar que el *try/catch* sigue siendo necesario… solo que en un solo lugar.

```
async function safe(fn) { try { return [await fn(), undefined]; } catch (e) { return [undefined, e]; }
}
```

Y luego, hacemos uso de nuestro patrón:

```
const [res, err] = await safe(() => axios.get("/api/data")); if (err) { console.error("Error en la API:", err.message);
} else { console.log("Datos:", res.data);
}
```

* * *

## La idea central se mantiene

Ok, sí… ahora hay un *try/catch*.

Pero lo aislamos.

La lógica principal ya no necesita escribirlo una y otra vez.

* * *

## Bonus: crea tus propios helpers

Puedes llevar esto más lejos creando funciones específicas para distintos métodos:

```
const safeGet = (url, config) => safe(() => axios.get(url, config));
const safePost = (url, data, config) => safe(() => axios.post(url, data, config)); const [res, err] = await safePost("/api/data", { name: "JS" });
```

* * *

## Checklist final

Qué hemos logrado al aplicar este patrón:

-   Sin *try/catch* anidados

-   Flujo más limpio y predecible

-   Código más legible

-   Reutilizable con cualquier promesa


* * *

Como sucede con el resto de los patrones, este no es una bala de plata.

No te exime del manejo de errores, pero te da un marco más limpio para hacerlo.

En un lenguaje tan flexible (y caótico) como *JavaScript*, vale la pena encontrar patrones que te den orden sin perder libertad.

![](/images/blog/cansado-de-trycatch/content-1.png)
