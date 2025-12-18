---
title: Comparación entre REST y RPC
subtitle: Entendiendo las diferencias y decidiendo cuándo implementar cada enfoque
pubDate: '2024-05-27'
heroImage: /images/blog/2024/05/comparacion-entre-rest-y-rpc/hero.png
author: Asdrúbal Chirinos
tags:
  - backend
  - arquitectura
slug: comparacion-entre-rest-y-rpc
---

![](/images/blog/2024/05/comparacion-entre-rest-y-rpc/hero.png)

En los servicios web y las APIs, REST y RPC son dos de los estilos arquitectónicos más comúnmente utilizados . Cada uno tiene sus características únicas, casos de uso y ventajas.

Exploraremos las diferencias entre REST y RPC, junto con algunos ejemplos prácticos para ilustrar cómo y cuándo usar cada uno.

#### **¿Qué es REST?**

**REST (Representational State Transfer)** es un estilo arquitectónico diseñado para aplicaciones en red. Se basa en un protocolo de comunicaciones sin estado, cliente-servidor y cacheable; el protocolo HTTP es casi siempre utilizado.

**Características Clave:**

1.  **Sin Estado**: Cada solicitud del cliente al servidor debe contener toda la información necesaria para entender y procesar la solicitud. El servidor no almacena ninguna información de sesión sobre el cliente.

2.  **Basado en Recursos**: La arquitectura REST se centra en acceder a recursos nombrados a través de una interfaz única y consistente. Estos recursos son identificados por URLs.

3.  **Métodos HTTP**: REST utiliza métodos HTTP estándar (GET, POST, PUT, DELETE, etc.) para realizar operaciones en recursos.

4.  **Representación**: Los recursos pueden ser representados en varios formatos como JSON, XML, HTML, etc. El cliente especifica el formato deseado usando el encabezado `Accept`.

5.  **Escalabilidad y Rendimiento**: Debido a que REST no tiene estado, puede escalar horizontalmente fácilmente.


**Ejemplo:**

Imagina que estás construyendo una aplicación de comercio electrónico. Necesitas gestionar productos, pedidos y clientes. Usando REST, podrías crear endpoints como estos:

-   `GET /productos` – Obtiene una lista de productos.

-   `POST /productos` – Agrega un nuevo producto.

-   `GET /productos/{id}` – Obtiene los detalles de un producto específico por ID.

-   `PUT /productos/{id}` – Actualiza un producto específico por ID.

-   `DELETE /productos/{id}` – Elimina un producto específico por ID.


Este enfoque hace que tu API sea intuitiva y fácil de entender, aprovechando los métodos HTTP estándar para diferentes operaciones.

#### **¿Qué es RPC?**

**RPC (Remote Procedure Call))** es un protocolo que permite a un programa solicitar un servicio desde un programa ubicado en otra computadora en una red. Abstrae el mecanismo de llamada a procedimientos para permitir al programador llamar a procedimientos en sistemas remotos como si fueran llamadas locales.

**Características Clave:**

1.  **Procedural**: RPC está diseñado para invocar procedimientos (métodos) en servidores remotos, similar a llamar a una función en código local.

2.  **Acoplamiento Estrecho**: A menudo conduce a un acoplamiento más estrecho entre el cliente y el servidor porque el cliente necesita conocer los métodos específicos a llamar.

3.  **Protocolo Agnóstico**: Puede implementarse sobre varios protocolos como HTTP, TCP, etc.

4.  **Síncrono y Asíncrono**: Soporta operaciones tanto síncronas como asíncronas.

5.  **Serialización**: Requiere mecanismos para serializar y deserializar parámetros y valores de retorno, como Protocol Buffers, Thrift o JSON-RPC.


**Ejemplo:**

Considera un escenario donde estás construyendo una plataforma de trading de alta frecuencia. La velocidad y el rendimiento son críticos. Usando RPC, podrías tener métodos como:

-   `comprarAccion("AAPL", 100)` – Compra 100 acciones de Apple.

-   `venderAccion("AAPL", 50)` – Vende 50 acciones de Apple.

-   `obtenerPortafolio()` – Obtiene el portafolio actual.


En este caso, la invocación directa de métodos hace que RPC sea una opción eficiente para las transacciones rápidas y numerosas típicas en sistemas de trading.

### **Comparando REST y RPC**

-   **Estilo Arquitectónico vs. Protocolo de Comunicación**: REST es más un estilo arquitectónico que aprovecha la naturaleza sin estado de HTTP, mientras que RPC es un protocolo de comunicación centrado en ejecutar funciones en sistemas remotos.

-   **Flexibilidad vs. Eficiencia**: REST ofrece más flexibilidad y escalabilidad con recursos y representaciones, mientras que RPC puede ser más eficiente y directo para operaciones directas.

-   **Facilidad de Uso**: El uso de métodos y códigos de estado HTTP estándar de REST puede simplificar el diseño y uso de la API, mientras que RPC podría requerir más esfuerzo para manejar la serialización, el descubrimiento de métodos y el manejo de errores.


### **Cuándo Usar REST**

-   **Servicios Web**: REST se usa comúnmente para servicios web debido a su simplicidad y la ubicuidad de HTTP.

-   **Microservicios**: Las APIs REST se utilizan ampliamente para permitir que los microservicios se comuniquen entre sí.

-   **APIs Públicas**: Si estás diseñando una API que será consumida por una variedad de clientes, el enfoque estandarizado y el uso de métodos HTTP hacen que REST sea una elección ideal.


### **Cuándo Usar RPC**

-   **Servicios Internos**: Comúnmente utilizado para la comunicación entre servicios internos dentro de un sistema.

-   **Aplicaciones Críticas en Rendimiento**: A menudo preferido cuando el rendimiento y la eficiencia son críticos, ya que puede ser más directo y rápido que REST para ciertas operaciones.

-   **Operaciones Complejas**: Cuando las operaciones involucran múltiples pasos o transacciones, RPC puede simplificar la interacción al agruparlas en una sola llamada.


* * *

Tanto REST como RPC tienen sus fortalezas y debilidades y son adecuados para diferentes tipos de aplicaciones. REST se utiliza típicamente para servicios web y APIs que requieren escalabilidad y flexibilidad, mientras que RPC se utiliza para la comunicación entre servicios internos donde el rendimiento es una preocupación clave. La elección entre ellos depende de los requisitos específicos de tu aplicación, incluidos factores como la naturaleza de las operaciones, las necesidades de escalabilidad y la complejidad del desarrollo.
