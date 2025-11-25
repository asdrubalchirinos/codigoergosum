# Guía de Troubleshooting - Imágenes Rotas

## 🔍 Diagnóstico del Problema

Las imágenes están en `/dist/images/blog/` y las rutas en el HTML son correctas (`/images/blog/...`), pero pueden aparecer rotas dependiendo de cómo despliegues el sitio.

## ✅ Soluciones Según tu Escenario

### Escenario 1: Dominio Custom (codigoergosum.com)

**Estado**: ✅ Ya configurado correctamente

Las rutas absolutas (`/images/...`) funcionarán perfectamente cuando:
- Despliegues en GitHub Pages con dominio custom
- El sitio esté en la raíz del dominio

**No requiere cambios adicionales.**

---

### Escenario 2: GitHub Pages sin dominio custom

Si tu sitio está en `https://usuario.github.io/codigoergosum/`:

1. **Descomentar la línea `base`** en `astro.config.mjs`:

```javascript
export default defineConfig({
  site: 'https://codigoergosum.com',
  base: '/codigoergosum',  // ← Descomentar esta línea
  // ...
});
```

2. **Rebuild**:
```bash
npm run build
```

Esto hará que todas las rutas sean relativas a `/codigoergosum/`.

---

### Escenario 3: Servidor Local (Testing)

Si estás probando localmente montando `/dist` con un servidor simple:

#### Opción A: Servidor desde la raíz de dist

```bash
cd dist
python3 -m http.server 8000
# o
npx serve .
```

Luego accede a `http://localhost:8000`

#### Opción B: Usar Astro Preview

```bash
npm run preview
```

Este comando sirve el sitio correctamente con todas las rutas.

---

### Escenario 4: Servidor Web (Nginx, Apache)

Si despliegas en un servidor web tradicional, asegúrate de:

#### Nginx

```nginx
server {
    listen 80;
    server_name codigoergosum.com;
    root /var/www/codigoergosum/dist;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### Apache

```apache
<VirtualHost *:80>
    ServerName codigoergosum.com
    DocumentRoot /var/www/codigoergosum/dist
    
    <Directory /var/www/codigoergosum/dist>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
        
        # Rewrite para SPA
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
</VirtualHost>
```

---

## 🐛 Verificación Rápida

### 1. Verifica que las imágenes existen

```bash
ls -la dist/images/blog/ahora-nadie-es-influencer/
```

Deberías ver:
- `hero.png`
- `content-1.jpeg`
- etc.

### 2. Verifica las rutas en el HTML

```bash
cat dist/index.html | grep "images/blog" | head -5
```

Deberías ver rutas como:
- `src="/images/blog/..."`
- O si usas `base`: `src="/codigoergosum/images/blog/..."`

### 3. Prueba con Astro Preview

```bash
npm run preview
```

Abre `http://localhost:4321` - Si las imágenes funcionan aquí, el problema es la configuración del servidor.

---

## 📊 Información del Build Actual

- **Imágenes copiadas**: ✅ 209 carpetas en `/dist/images/blog/`
- **Rutas en HTML**: ✅ `/images/blog/...` (absolutas)
- **Tamaño total**: ~191MB (considera optimizar imágenes)
- **Configuración**: Dominio custom en raíz

---

## 🚀 Recomendación

Si estás desplegando en **GitHub Pages con dominio custom** (codigoergosum.com):
- ✅ La configuración actual es correcta
- ✅ Las imágenes funcionarán automáticamente
- ⚠️ Asegúrate de configurar el CNAME en GitHub

Si estás probando **localmente**:
- Usa `npm run preview` en lugar de montar `/dist` directamente
- O usa `npx serve dist` desde la raíz del proyecto

---

## 💡 Optimización Adicional

Para reducir el tamaño del build (191MB → ~50MB):

1. Instala herramientas de optimización:
```bash
npm install --save-dev sharp @astrojs/image
```

2. Las imágenes se optimizarán automáticamente en el build

¿En qué escenario estás desplegando? Te ayudo a configurarlo específicamente.
