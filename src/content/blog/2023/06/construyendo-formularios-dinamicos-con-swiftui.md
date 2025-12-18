---
title: Construyendo formularios dinámicos con SwiftUI
pubDate: '2023-06-24'
heroImage: /images/blog/2023/06/construyendo-formularios-dinamicos-con-swiftui/hero.png
author: Asdrúbal Chirinos
tags:
  - mobile
  - testing
  - clean-code
slug: construyendo-formularios-dinamicos-con-swiftui
---

Como desarrolladores, a menudo nos encontramos con escenarios en los que necesitamos crear formularios que se adapten dinámicamente a la entrada del usuario. SwiftUI, el moderno y declarativo framework de Apple, ofrece una solución elegante para este desafío. En este artículo, exploraremos cómo aprovechar el poder de SwiftUI para crear de manera dinámica un número variable de vistas `TextField` basadas en la entrada del usuario. Con este conocimiento, estarás preparado para construir interfaces interactivas y amigables para el usuario en una amplia gama de aplicaciones.

**Prerrequisitos**

Para seguir este tutorial, es útil tener un conocimiento básico de SwiftUI y sus conceptos fundamentales. También será beneficioso tener familiaridad con el lenguaje de programación Swift.

**Creando los cimientos**

Comencemos estableciendo los cimientos de nuestro formulario dinámico. Abre Xcode y crea un nuevo proyecto de SwiftUI. En el archivo de vista principal (normalmente ContentView.swift), borra el contenido predeterminado y reemplázalo con el siguiente código:

```
import SwiftUI struct ContentView: View { @State private var numberOfFields = 0 @State private var fieldValues: [String] = [] var body: some View { VStack { Button(action: { numberOfFields += 1 fieldValues.append("") }) { Text("Agregar TextField") } ForEach(0..<numberOfFields, id: \.self) { index in TextField("Ingresa un valor", text: Binding( get: { fieldValues[index] }, set: { fieldValues[index] = $0 } )) .textFieldStyle(RoundedBorderTextFieldStyle()) } } }
}
```

**Explorando el código**

En nuestra estructura `ContentView`, definimos dos propiedades `@State`: `numberOfFields` y `fieldValues`. `numberOfFields` realiza un seguimiento del número actual de vistas `TextField` que se mostrarán, mientras que `fieldValues` es una matriz que almacena el texto ingresado en cada `TextField`.

Dentro de `VStack`, colocamos un botón etiquetado como "Agregar TextField". Cuando el usuario toca este botón, la propiedad `numberOfFields` se incrementa en 1, lo que provoca una nueva representación de la vista. El bucle `ForEach` crea el número correspondiente de vistas `TextField` según el valor actual de `numberOfFields`.

Las vistas `TextField` están vinculadas a los elementos de la matriz `fieldValues` utilizando el inicializador `Binding`. Esto permite que el texto ingresado en cada `TextField` se almacene dinámicamente en el elemento de la matriz correspondiente.

Aplicamos el estilo `RoundedBorderTextFieldStyle()` para dar a nuestras vistas `TextField` una apariencia limpia y visualmente atractiva.

![](/images/blog/2023/06/construyendo-formularios-dinamicos-con-swiftui/hero.png)

**Poniéndolo en acción**

Compila y ejecuta la aplicación en el simulador o en un dispositivo físico, y verás una pantalla con un solo botón etiquetado como "Agregar TextField". Cada vez que toques el botón, se agregará un nuevo `TextField` debajo de él. Puedes ingresar texto en cada campo, y se almacenará de manera dinámica en el elemento de la matriz respectivo.

* * *

Felicidades! Has aprendido cómo crear de manera dinámica un número variable de vistas `TextField` basadas en la entrada del usuario utilizando SwiftUI. Al aplicar este concepto, puedes construir formularios dinámicos, encuestas interactivas e interfaces de recolección de datos que se adaptan perfectamente a los requisitos del usuario.

La naturaleza declarativa de SwiftUI y sus potentes capacidades de enlace de datos permiten a los desarrolladores crear interfaces elegantes y amigables para el usuario con facilidad. Con una exploración adicional, puedes mejorar este concepto al incorporar validación, envío de formularios y elementos de interfaz de usuario adicionales.

Ahora que tienes este valioso conocimiento, adéntrate y crea aplicaciones increíbles que empoderen a los usuarios para interactuar fluida e intuitivamente con tus interfaces. Los formularios dinámicos de SwiftUI son solo el comienzo de tu camino hacia la creación de experiencias de usuario excepcionales.
