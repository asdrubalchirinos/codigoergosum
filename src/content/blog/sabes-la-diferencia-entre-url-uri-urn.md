---
title: ¿Sabes la diferencia entre URL, URI, URN?
pubDate: "2023-06-29"
heroImage: "/images/blog/sabes-la-diferencia-entre-url-uri-urn/hero.webp"
author: Asdrúbal Chirinos
tags: ["web", "backend", "devops"]
---

![](/images/blog/sabes-la-diferencia-entre-url-uri-urn/hero.webp)

En el mundo del desarrollo web y la búsqueda de información, es común encontrarse con términos y siglas que pueden generar confusión. Entre ellos se encuentran URL, URI y URN, que a menudo se usan de manera intercambiable. Sin embargo, cada uno de estos conceptos tiene un significado específico y cumple una función distinta. Es importante comprender las diferencias entre URL, URI y URN, especialmente si te dedicas al desarrollo web o la ingeniería de software. En este artículo, exploraremos y compararemos estos términos para que puedas entender su definición, funcionalidad y aplicaciones.

#### ¿Qué es una URL?

URL significa "Uniform Resource Locator" (Localizador Uniforme de Recursos). Es el término más comúnmente utilizado y se refiere a una cadena de caracteres que identifica un recurso específico en internet. Una URL generalmente está compuesta por varios elementos, como el protocolo (por ejemplo, HTTP, HTTPS), el nombre de dominio (o dirección IP), la ruta y parámetros de consulta opcionales. Por ejemplo, `https://www.ejemplo.com/blog?articulo=123` es una URL en la que "`https`" es el protocolo, "`www.ejemplo.com"` es el nombre de dominio, "`/blog`" es la ruta y "`?articulo=123`" es un parámetro de consulta. Las URL se utilizan principalmente para localizar y acceder a recursos como páginas web, imágenes, documentos o APIs.

#### ¿Qué es una URI?

URI significa "Uniform Resource Identifier" (Identificador Uniforme de Recursos). Es un término más amplio que incluye tanto las URL como otro subconjunto llamado URN. Una URI es una cadena de caracteres utilizada para identificar o nombrar un recurso en internet. A diferencia de las URL, las URIs no necesariamente proporcionan los medios para acceder directamente al recurso. En cambio, funcionan como identificadores o etiquetas para recursos. En otras palabras, todas las URL son URIs, pero no todas las URIs son URL. El objetivo principal de una URI es identificar de manera única un recurso, sin importar si se puede acceder directamente a él o no.

#### ¿Qué es una URN?

URN significa "Uniform Resource Name" (Nombre Uniforme de Recurso). Es un subconjunto de las URIs y se utiliza como un identificador persistente e independiente de la ubicación para un recurso. Mientras que las URL pueden cambiar si el recurso cambia de ubicación o accesibilidad, las URN permanecen constantes a lo largo del tiempo. El propósito de las URN es proporcionar una forma consistente de identificar recursos a largo plazo, incluso si su ubicación física o de red cambia. Las URN se utilizan principalmente para recursos que requieren persistencia a largo plazo, como documentos académicos, libros o artefactos digitales. Por ejemplo, una URN podría tener el siguiente formato: `urn:isbn:0-345-39180-2`, donde "`isbn:0-345-39180-2`" es el identificador único de un libro.

#### Diferencias entre URL, URI y URN:

1\. **Funcionalidad**: las URL se utilizan para localizar y acceder directamente a los recursos, mientras que las URIs funcionan como identificadores de recursos y las URNs proporcionan nombres persistentes para los recursos.

2\. **Alcance**: las URL son un subconjunto de las URIs y brindan tanto el identificador del recurso como los medios para acceder a él. Por otro lado, las URNs son un subconjunto de las URIs y se centran únicamente en proporcionar un identificador persistente.

3\. **Persistencia**: las URL están sujetas a cambios si la ubicación o accesibilidad del recurso cambia. En contraste, las URNs se mantienen constantes a lo largo del tiempo, asegurando una persistencia a largo plazo.

4\. **Ejemplos**: `https://www.ejemplo.com/pagina` es una URL, mientras que `urn:isbn:0-345-39180-2` es una URN.

* * *

En resumen, URL, URI y URN son conceptos relacionados pero con diferencias significativas en el desarrollo web. La URL es el término más conocido y se utiliza para localizar y acceder directamente a los recursos en internet. Las URIs abarcan tanto las URL como las URNs, y su función principal es identificar recursos de manera única. Las URNs se destacan por su capacidad de proporcionar nombres persistentes para los recursos, incluso cuando cambia su ubicación o accesibilidad. Al comprender estas diferencias, podrás utilizar cada uno de estos términos de manera adecuada y aprovechar al máximo sus funcionalidades.
