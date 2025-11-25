# ⚙️ Configuración de GitHub Pages - Paso a Paso

## 🎯 Tu repositorio
**URL**: https://github.com/asdrubalchirinos/codigoergosum

---

## 📋 Pasos de Configuración

### 1️⃣ Habilitar GitHub Pages

1. Ve a tu repositorio: https://github.com/asdrubalchirinos/codigoergosum
2. Click en **Settings** (⚙️ Configuración)
3. En el menú lateral izquierdo, busca **Pages**
4. En **Source** (Fuente), selecciona: **GitHub Actions**
   - ⚠️ NO selecciones "Deploy from a branch"
   - ✅ DEBE ser "GitHub Actions"

![GitHub Pages Source](https://docs.github.com/assets/cb-47267/images/help/pages/publishing-source-drop-down.png)

---

### 2️⃣ Verificar Permisos del Workflow

1. En tu repositorio, ve a **Settings** → **Actions** → **General**
2. Busca la sección **Workflow permissions**
3. Selecciona: **Read and write permissions**
4. Marca el checkbox: **Allow GitHub Actions to create and approve pull requests**
5. Click en **Save**

---

### 3️⃣ Ejecutar el Deployment

El workflow ya se ejecutó automáticamente cuando hiciste `git push`. Para verificar:

1. Ve a la pestaña **Actions** en tu repositorio
2. Deberías ver un workflow ejecutándose o completado: "Deploy to GitHub Pages"
3. Click en él para ver los detalles

**Estados posibles:**
- 🟡 **Amarillo (En progreso)**: El deploy está corriendo
- 🟢 **Verde (Success)**: ¡Deploy exitoso!
- 🔴 **Rojo (Failed)**: Hay un error (ver sección de troubleshooting)

---

### 4️⃣ Acceder a tu Sitio

Una vez que el workflow termine exitosamente:

**Sin dominio custom:**
```
https://asdrubalchirinos.github.io/codigoergosum/
```

**Con dominio custom (codigoergosum.com):**
1. Ve a **Settings** → **Pages**
2. En **Custom domain**, escribe: `codigoergosum.com`
3. Click en **Save**
4. Espera a que se verifique el dominio

---

## 🌐 Configurar Dominio Custom (Opcional)

### Paso 1: Configurar DNS

En tu proveedor de DNS (GoDaddy, Namecheap, Cloudflare, etc.), agrega estos registros:

```dns
Tipo: A
Host: @
Valor: 185.199.108.153

Tipo: A
Host: @
Valor: 185.199.109.153

Tipo: A
Host: @
Valor: 185.199.110.153

Tipo: A
Host: @
Valor: 185.199.111.153

Tipo: CNAME
Host: www
Valor: asdrubalchirinos.github.io
```

### Paso 2: Configurar en GitHub

1. Ve a **Settings** → **Pages**
2. En **Custom domain**, escribe: `codigoergosum.com`
3. Click en **Save**
4. Espera la verificación del dominio (puede tardar hasta 24 horas)
5. Una vez verificado, marca: **Enforce HTTPS**

---

## ✅ Verificación

### Workflow Exitoso
En la pestaña **Actions**, deberías ver algo así:

```
✓ Deploy to GitHub Pages
  ├─ build (2m 15s)
  │  ├─ Checkout
  │  ├─ Setup Node
  │  ├─ Install dependencies
  │  ├─ Build with Astro (273 pages)
  │  └─ Upload artifact
  └─ deploy (30s)
     └─ Deploy to GitHub Pages
```

### Sitio Live
Verifica que tu sitio esté disponible:
- Sin dominio: https://asdrubalchirinos.github.io/codigoergosum/
- Con dominio: https://codigoergosum.com

### Verificar Recursos
1. **Sitemap**: https://codigoergosum.com/sitemap-index.xml
2. **Robots**: https://codigoergosum.com/robots.txt
3. **Imágenes**: https://codigoergosum.com/images/blog/ahora-nadie-es-influencer/hero.png

---

## 🐛 Troubleshooting

### Error: "Resource not accessible by integration"

**Solución:**
1. Ve a **Settings** → **Actions** → **General**
2. En **Workflow permissions**, selecciona "Read and write permissions"
3. Guarda y vuelve a ejecutar el workflow

### Error: "Page build failed"

**Solución:**
1. Verifica que en **Settings** → **Pages** → **Source** esté seleccionado "GitHub Actions"
2. NO debe estar en "Deploy from a branch"

### El sitio se ve sin estilos

**Si estás usando `usuario.github.io/repo`:**

1. Edita `astro.config.mjs`
2. Descomenta la línea:
```javascript
base: '/codigoergosum',
```
3. Haz commit y push:
```bash
git add astro.config.mjs
git commit -m "Configurar base path para GitHub Pages"
git push
```

### Las imágenes no cargan

**Para repositorio en subdirectorio:**
- Edita `astro.config.mjs` y activa `base: '/codigoergosum'`

**Para dominio custom:**
- La configuración actual es correcta, solo espera a que el DNS se propague

---

## 🔄 Deployments Futuros

Cada vez que hagas cambios:

```bash
git add .
git commit -m "Descripción de cambios"
git push
```

El workflow se ejecutará automáticamente y actualizará tu sitio en ~3 minutos.

---

## 📊 Información del Workflow

- **Trigger**: Automático en push a `main`, o manual desde Actions
- **Node version**: 20
- **Build time**: ~2-3 minutos
- **Pages generadas**: 273
- **Caché**: Activado para `node_modules`

---

## ✨ Siguiente Paso

Ve a la pestaña **Actions** en tu repositorio para ver el estado del deployment:

👉 https://github.com/asdrubalchirinos/codigoergosum/actions

Si todo está verde ✅, tu sitio ya está live!
