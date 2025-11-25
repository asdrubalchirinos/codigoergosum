# SPEC v1.1

**Proyecto:** Blog minimalista Astro **Nombre:** Código Ergo Sum
**Stack:** Astro, Markdown

## 1. Objetivo

Construir un blog minimalista desarrollado con Astro, basado en
contenido Markdown, con diseño moderno, responsivo y optimizado para
SEO, siguiendo un layout editorial inspirado en Medium y Substack.

## 2. Fuentes de datos

Los posts provienen de archivos Markdown en una carpeta dedicada.

Cada archivo debe incluir en el frontmatter: - slug - titulo -
subtitulo - imagenDestacada (archivo local) - fecha - autor -
etiquetas - cuerpo

El cuerpo admite: - Bloques de código - Imágenes locales - Enlaces
internos hacia otros posts

## 3. Diseño general y layout

### 3.1 Header

-   Full width
-   Contenedor interno centrado con max width de 1024 px
-   Contenido:
    -   Logo pequeño a la izquierda
    -   Nombre del blog centrado

### 3.2 Footer

-   Full width
-   Contenedor interno centrado con max width de 1024 px
-   Contenido:
    -   Redes sociales
    -   Copyright
    -   Autor

### 3.3 Contenido principal

-   Contenedor centrado
-   max-width: 1024 px
-   padding horizontal: 1 rem
-   margin: auto

## 4. Breakpoints del diseño

-   Mobile base: hasta 639 px
-   Móvil grande: min-width 640 px
-   Tablet: min-width 768 px
-   Desktop: min-width 1024 px
-   Desktop grande: min-width 1280 px

## 5. Estructura del blog

### 5.1 Plantilla base

Incluye Header, Footer y contenedor max-width 1024 px.

### 5.2 Home

Incluye: - Post destacado - Posts recientes - Sidebar Acerca de

### 5.3 Listado de posts

Incluye: - Paginación - Lista de posts - Sidebar

### 5.4 Post individual

Incluye: - titulo - subtitulo - imagen destacada - fecha - autor -
etiquetas - contenido - compartir en X, LinkedIn y WhatsApp

## 6. SEO

Incluye: - Metadata - OpenGraph - Canonical - Sitemap automático - URL
por slug

## 7. Implementación técnica

-   Lectura de Markdown
-   Generación de rutas
-   Orden por fecha
-   Etiquetas
-   Paginación
-   Imágenes locales
-   Layout responsivo

## 8. Entregables

-   Proyecto base en Astro
-   Componentes
-   Plantillas
-   Markdown de ejemplo
-   Configuración de post destacado
-   Documentación mínima