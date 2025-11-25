# Guía de Despliegue en GitHub Pages

## ✅ Proyecto Listo para Producción

### Cambios Implementados

1. **✓ Sitemap generado** - `sitemap-index.xml` y `sitemap-0.xml`
2. **✓ Página de inicio** - `/index.html` en la raíz
3. **✓ robots.txt** - Configurado para SEO
4. **✓ Package.json** - Actualizado con nombre correcto y scripts
5. **✓ GitHub Actions** - Workflow de deploy automático configurado
6. **✓ TypeScript** - Tipos corregidos, build sin errores

### 📦 Build Stats

- **Páginas generadas**: 273
  - 1 página de inicio
  - 223 posts individuales  
  - 23 páginas de paginación
  - 26 páginas de tags
- **Tamaño**: ~191MB (principalmente imágenes)

---

## 🚀 Pasos para Desplegar

### 1. Sube tu código a GitHub

```bash
git add .
git commit -m "Preparar proyecto para despliegue en GitHub Pages"
git push origin main
```

### 2. Configura GitHub Pages

1. Ve a tu repositorio en GitHub
2. Click en **Settings** (Configuración)
3. En el menú izquierdo, click en **Pages**
4. En **Source**, selecciona **GitHub Actions**

### 3. El Deploy Automático

El workflow `.github/workflows/deploy.yml` se ejecutará automáticamente:
- ✓ En cada push a la rama `main`
- ✓ Puedes ejecutarlo manualmente desde la pestaña Actions

### 4. Configura tu Dominio Custom (opcional)

Si quieres usar `codigoergosum.com`:

1. En GitHub Pages settings, agrega tu dominio custom
2. En tu DNS provider, agrega estos registros:

```
Tipo: A
Host: @
Valor: 185.199.108.153
Valor: 185.199.109.153
Valor: 185.199.110.153
Valor: 185.199.111.153

Tipo: CNAME
Host: www
Valor: <tu-usuario>.github.io
```

3. Espera a que se propague el DNS (puede tomar hasta 24 horas)
4. Activa **Enforce HTTPS** en GitHub Pages

---

## 📝 Comandos Disponibles

```bash
npm run dev         # Servidor de desarrollo
npm run build       # Build de producción + verificación TypeScript
npm run preview     # Preview del build local
npm run deploy      # Build + crear .nojekyll (útil para testing)
```

---

## ✅ Checklist Final

- [x] Build exitoso sin errores
- [x] Sitemap generado correctamente
- [x] Robots.txt configurado
- [x] Index.html en la raíz
- [x] Meta tags Open Graph y Twitter Cards
- [x] GitHub Actions workflow configurado
- [ ] Código subido a GitHub
- [ ] GitHub Pages configurado
- [ ] Dominio custom configurado (opcional)
- [ ] HTTPS activado

---

## 🔍 Verificación Post-Deploy

Después del deploy, verifica:

1. **Sitemap**: `https://codigoergosum.com/sitemap-index.xml`
2. **Robots**: `https://codigoergosum.com/robots.txt`
3. **Home**: `https://codigoergosum.com/`
4. **Blog**: `https://codigoergosum.com/blog/`

---

## 🐛 Troubleshooting

### El sitio no carga estilos/imágenes

Si usas un dominio custom, asegúrate de configurarlo correctamente en GitHub Pages settings.

### El workflow falla

Verifica que tu repositorio tenga permisos para GitHub Pages:
- Settings → Actions → General → Workflow permissions
- Selecciona "Read and write permissions"

### 404 en algunas páginas

Asegúrate de que GitHub Pages esté usando la fuente "GitHub Actions" y no "Deploy from a branch".
