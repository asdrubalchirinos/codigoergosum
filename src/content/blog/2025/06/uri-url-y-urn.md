---
title: 'URI, URL y URN'
subtitle: Lo que nunca te has atrevido a preguntar
pubDate: '2025-06-02'
heroImage: /images/blog/uri-url-y-urn/hero.webp
author: Asdrúbal Chirinos
tags:
  - web
  - backend
  - devops
slug: uri-url-y-urn
---

![](/images/blog/uri-url-y-urn/hero.webp)

En tecnología, hay conceptos que escuchamos tanto que terminamos asumiendo que los entendemos. Y entre los más confundidos está este trío: **URI, URL y URN**.

Si alguna vez los usaste como sinónimos o te dio pena preguntar cúal es la diferencia, este artículo es para ti.

> 💡 ***Spoiler:** No son lo mismo, aunque están relacionados.*

* * *

## ¿Qué es una URI?

**URI** significa *Uniform Resource Identifier* (Identificador Uniforme de Recursos).
Es el término más **amplio**, el que **engloba todo**.

> 🔍 *Un URI puede ser una URL, una URN o incluso ambos.*

### Ejemplos válidos de URI:

-   https://openai.com → es también una URL

-   `urn:isbn:0451450523` → es también una URN

-   `mailto:persona@ejemplo.com` → es también una URL


* * *

## ¿Qué es una URL?

**URL** significa *Uniform Resource Locator* (Localizador Uniforme de Recursos).
Es un **tipo de URI** que **incluye información sobre cómo localizar y acceder al recurso**.

### ¿Qué incluye una URL?

-   El **protocolo o esquema** → `https`, `ftp`, `mailto`, etc.

-   La **ubicación exacta** del recurso → host, puerto, ruta, etc.


> 📬 Aunque hay debate técnico, *mailto:* se considera una URL según los estándares, ya que indica el protocolo para interactuar con un recurso (una dirección de correo).

### Ejemplos de URL:

-   `https://ejemplo.com/index.html`

-   `ftp://servidor.com/archivo.zip`

-   `mailto:contacto@empresa.com`


> 📌 *Toda URL es un URI, pero no todo URI es una URL.*

* * *

## ¿Qué es una URN?

**URN** significa *Uniform Resource Name* (Nombre Uniforme de Recurso).
Es un **tipo de URI** que **identifica un recurso por su nombre**, sin indicar su localización ni cómo acceder a él.

### Ejemplos de URN:

-   `urn:isbn:0451450523` → un libro por su ISBN

-   `urn:uuid:6ba7b810-9dad-11d1-80b4-00c04fd430c8` → identificador único


> 🎯 *Una URN es útil cuando necesitas identificadores permanentes, sin importar su localización física o digital.*

* * *

## ¿Por qué importa todo esto?

Quizás no lo necesites para el día a día si trabajas construyendo sitios web, pero si estás desarrollando APIs, diseñando sistemas distribuidos, manejando identificadores únicos o escribiendo documentación técnica, **comprender la diferencia es clave**.

Además, te da una ventaja: sabrás usar el término correcto en el contexto correcto.

![](/images/blog/uri-url-y-urn/content-1.png)

* * *

Ahora ya lo sabes: **URI, URL y URN no son lo mismo**, pero están conectados.

-   Si necesitas señalar **dónde** está algo: usa una **URL**

-   Si solo necesitas un **identificador permanente**: usa una **URN**

-   Y si no estás seguro o quieres englobar todo: habla de **URI**


Así que la próxima vez que te enfrentes a esos términos, estarás un paso adelante.
Porque lo que nunca te atreviste a preguntar… ya tiene respuesta.

![](/images/blog/uri-url-y-urn/content-2.png)
