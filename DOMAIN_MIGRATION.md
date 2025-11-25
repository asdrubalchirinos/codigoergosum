# 🔄 Guía de Migración a Dominio Custom

## Situación Actual

**Configuración actual:**
- URL: `https://asdrubalchirinos.github.io/codigoergosum/`
- Base path: `/codigoergosum`
- Todas las rutas usan: `import.meta.env.BASE_URL` → `/codigoergosum`

**Objetivo:**
- URL: `https://codigoergosum.com`
- Base path: `/` (raíz del dominio)
- Todas las rutas cambiarán automáticamente

---

## 📝 Pasos para Cambiar al Dominio Custom

### Paso 1: Configurar DNS

En tu proveedor de DNS (GoDaddy, Namecheap, Cloudflare, etc.):

```dns
# Registros A para el dominio raíz
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

# Registro CNAME para www
Tipo: CNAME
Host: www
Valor: asdrubalchirinos.github.io
```

**Tiempo de propagación:** 5 minutos a 24 horas

---

### Paso 2: Configurar Dominio en GitHub

1. Ve a tu repositorio: https://github.com/asdrubalchirinos/codigoergosum
2. Click en **Settings** → **Pages**
3. En **Custom domain**, escribe: `codigoergosum.com`
4. Click en **Save**
5. Espera a que GitHub verifique el dominio (puede tardar unos minutos)
6. Una vez verificado, activa **Enforce HTTPS**

---

### Paso 3: Actualizar Configuración de Astro

El archivo `astro.config.mjs` ya tiene las instrucciones comentadas. 

**Cuando el DNS esté propagado:**

```bash
# Edita astro.config.mjs y cambia:
site: 'https://codigoergosum.com',
# Elimina o comenta la línea base:
# base: '/codigoergosum',
```

---

### Paso 4: Rebuild y Deploy

```bash
npm run build
git add astro.config.mjs
git commit -m "Cambiar a dominio custom codigoergosum.com"
git push
```

El GitHub Action se ejecutará automáticamente y desplegará con las nuevas rutas.

---

## 🔍 Qué Cambiará Automáticamente

### URLs

**Antes (subdirectorio):**
- Home: `https://asdrubalchirinos.github.io/codigoergosum/`
- Blog: `https://asdrubalchirinos.github.io/codigoergosum/blog/`
- Posts: `https://asdrubalchirinos.github.io/codigoergosum/blog/mi-post/`
- Imágenes: `https://asdrubalchirinos.github.io/codigoergosum/images/...`

**Después (dominio custom):**
- Home: `https://codigoergosum.com/`
- Blog: `https://codigoergosum.com/blog/`
- Posts: `https://codigoergosum.com/blog/mi-post/`
- Imágenes: `https://codigoergosum.com/images/...`

### Rutas en el Código

**No necesitas cambiar el código manualmente.** Astro usa `import.meta.env.BASE_URL` que:

- Con `base: '/codigoergosum'` → genera rutas `/codigoergosum/...`
- Sin `base` (o `base: '/'`) → genera rutas `/...`

---

## ⚠️ Importante: Orden de Operaciones

### ✅ Opción Recomendada (Sin Downtime)

1. **Primero:** Configura el DNS
2. **Espera:** A que el DNS se propague (verifica con `nslookup codigoergosum.com`)
3. **Luego:** Configura el dominio en GitHub Pages
4. **Después:** Cambia `astro.config.mjs` y haz push
5. **Resultado:** Ambas URLs funcionarán durante la transición

### ❌ Evitar

No cambies `astro.config.mjs` antes de configurar el dominio en GitHub, o tu sitio actual dejará de funcionar temporalmente.

---

## 🧪 Verificación

### Antes de cambiar astro.config.mjs

Verifica que el DNS esté propagado:

```bash
# En terminal
nslookup codigoergosum.com

# Debería mostrar:
# Address: 185.199.108.153
# Address: 185.199.109.153
# (etc.)
```

O usa herramientas online:
- https://dnschecker.org
- https://www.whatsmydns.net

### Después del deploy

1. **Sitio principal:** https://codigoergosum.com
2. **Sitemap:** https://codigoergosum.com/sitemap-index.xml
3. **Robots:** https://codigoergosum.com/robots.txt
4. **Post de prueba:** https://codigoergosum.com/blog/ahora-nadie-es-influencer/
5. **Imágenes:** Verifica que todas carguen correctamente

---

## 📊 Resumen de Cambios en Archivos

### `astro.config.mjs`
```diff
- site: 'https://asdrubalchirinos.github.io',
- base: '/codigoergosum',
+ site: 'https://codigoergosum.com',
+ // base eliminado o comentado
```

### `public/CNAME`
Ya está creado con `codigoergosum.com` ✅

### Todo lo demás
✅ **No requiere cambios** - El código usa `BASE_URL` dinámicamente

---

## 🚀 Timeline Estimado

1. **Configurar DNS:** 5 minutos
2. **Propagación DNS:** 5 min - 24 horas (usualmente < 1 hora)
3. **Verificar en GitHub:** 2 minutos
4. **Cambiar config y deploy:** 5 minutos
5. **Build y deploy automático:** 3 minutos

**Total:** Entre 15 minutos y 1 día (dependiendo del DNS)

---

## 💡 Pro Tip

Mantén comentadas ambas configuraciones en `astro.config.mjs` para poder cambiar fácilmente:

```javascript
export default defineConfig({
  // GitHub Pages subdirectorio
  // site: 'https://asdrubalchirinos.github.io',
  // base: '/codigoergosum',
  
  // Dominio custom
  site: 'https://codigoergosum.com',
  
  integrations: [sitemap()],
  // ...
});
```

Así puedes cambiar entre configuraciones simplemente comentando/descomentando líneas.
