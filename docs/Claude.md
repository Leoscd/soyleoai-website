# 🚀 PROYECTO SOYLEOAI.COM - Plan de Implementación
**Última actualización:** 15 de Diciembre 2025
**Estado del proyecto:** 95% completo localmente - Pendiente deployment y configuraciones

---

## 📋 ÍNDICE RÁPIDO
1. [Estado Actual](#estado-actual)
2. [Dominio y Hosting](#dominio-y-hosting)
3. [Roadmap de Implementación](#roadmap-de-implementación)
4. [Tareas por Fase](#tareas-por-fase)
5. [Credenciales y Servicios](#credenciales-y-servicios)
6. [Checklist Pre-Lanzamiento](#checklist-pre-lanzamiento)
7. [Comandos Útiles](#comandos-útiles)

---

## 🎯 ESTADO ACTUAL

### ✅ Lo que YA está hecho:
- Sitio web completo en `/home/leodiazdt/ia-arquitectos-website/`
- Diseño moderno y responsive (95% completo)
- Página principal: `index-v2.html` (será renombrada a `index.html`)
- Página de pagos: `pago.html` (requiere integración real)
- Testimonios reales cargando desde JSON
- Colores corporativos y branding definidos

### 🔴 Lo que FALTA:
- Inicializar Git y subir a GitHub
- Deployment en Vercel (hosting gratuito)
- Conectar dominio soyleoai.com desde GoDaddy
- Integrar pasarelas de pago reales (Mercado Pago + Stripe)
- Sistema de reservas (Calendly)
- Blog para SEO
- Email marketing (ConvertKit)
- Analytics (Google Analytics, Clarity)

---

## 🌐 DOMINIO Y HOSTING

### Situación del Dominio
- **Dominio:** soyleoai.com (comprado en GoDaddy)
- **Estado actual:** Apuntando a system.io
- **Objetivo:** Redirigir a Vercel (nuestro sitio propio)

### ⚠️ IMPORTANTE: Pasos para cambiar DNS en GoDaddy

**ANTES de cambiar el DNS, asegúrate de:**
1. Tener el sitio desplegado en Vercel y funcionando
2. Verificar que Vercel te da los registros DNS correctos
3. Hacer backup de la configuración actual de GoDaddy

**Pasos para cambiar DNS:**

1. **Login en GoDaddy:**
   - Ir a https://www.godaddy.com
   - My Products → Domains → soyleoai.com

2. **Acceder a DNS Management:**
   - Click en los 3 puntos → "Manage DNS"

3. **Eliminar registros antiguos (system.io):**
   - Buscar registros tipo A, CNAME que apunten a system.io
   - Click en el ícono de basura para eliminarlos
   - ⚠️ **TOMAR SCREENSHOT ANTES DE ELIMINAR** (por si necesitas revertir)

4. **Agregar registros de Vercel:**
   - Vercel te dará estos valores (cuando conectes el dominio en Vercel):
     ```
     Tipo: A
     Nombre: @
     Valor: 76.76.21.21
     TTL: 600

     Tipo: CNAME
     Nombre: www
     Valor: cname.vercel-dns.com
     TTL: 600
     ```

5. **Guardar cambios y esperar:**
   - Propagación DNS: 2-48 horas (usualmente 4-6 horas)
   - Verificar en: https://dnschecker.org

### Plan de Hosting
- **Plataforma elegida:** Vercel
- **Por qué Vercel:**
  - ✅ Gratis (hasta 100GB bandwidth/mes)
  - ✅ Deploy automático desde GitHub
  - ✅ SSL gratis (HTTPS)
  - ✅ Soporte para Vercel Functions (backend serverless)
  - ✅ Fácil de usar

---

## 🗓️ ROADMAP DE IMPLEMENTACIÓN

### **SEMANA 1: DEPLOYMENT Y PAGOS** (Prioridad CRÍTICA)
- [ ] Fase 1: Git + GitHub + Vercel + Dominio
- [ ] Fase 2: Pasarelas de Pago (Mercado Pago + Stripe)

### **SEMANA 2: MARKETING Y CAPTACIÓN**
- [ ] Fase 3: Sistema de Reservas (Calendly)
- [ ] Fase 4: Blog para SEO
- [ ] Fase 5: Email Marketing + Lead Magnets

### **SEMANA 3: CONTENIDO Y OPTIMIZACIÓN**
- [ ] Fase 6: Contenido Adicional (testimonios, casos de éxito)
- [ ] Fase 7: Analytics y Optimización

### **SEMANA 4: LANZAMIENTO**
- [ ] Testing completo
- [ ] Cambiar pagos a modo PRODUCCIÓN
- [ ] Lanzamiento oficial

---

## 📦 TAREAS POR FASE

## FASE 1: DEPLOYMENT BÁSICO ⚡
**Tiempo estimado:** 2-3 horas
**Prioridad:** 🔴 CRÍTICA

### Tareas:
- [ ] **1.1 Preparar proyecto para Git**
  ```bash
  cd /home/leodiazdt/ia-arquitectos-website
  mv index-v2.html index.html  # Renombrar archivo principal
  ```

- [ ] **1.2 Crear archivos de configuración**
  - [ ] `.gitignore` (excluir .env, .vercel, node_modules)
  - [ ] `vercel.json` (configuración de Vercel)
  - [ ] `package.json` (dependencias para Vercel Functions)

- [ ] **1.3 Inicializar Git**
  ```bash
  git init
  git add .
  git commit -m "Initial commit: SoyLeoAI website"
  ```

- [ ] **1.4 Crear repositorio en GitHub**
  - Ir a https://github.com/new
  - Nombre: `soyleoai-website`
  - Visibilidad: Private
  - NO inicializar con README
  - Conectar repo local:
    ```bash
    git remote add origin https://github.com/[TU-USUARIO]/soyleoai-website.git
    git branch -M main
    git push -u origin main
    ```

- [ ] **1.5 Deploy en Vercel**
  - Registrarse en https://vercel.com
  - New Project → Import desde GitHub
  - Seleccionar `soyleoai-website`
  - Framework: "Other"
  - Deploy
  - Resultado: URL temporal (ej: soyleoai-website.vercel.app)

- [ ] **1.6 Conectar dominio GoDaddy a Vercel**
  - En Vercel: Settings → Domains → Add `soyleoai.com` y `www.soyleoai.com`
  - Vercel mostrará registros DNS necesarios
  - En GoDaddy: Seguir pasos de la sección "Dominio y Hosting" arriba
  - Esperar propagación DNS (2-48h)

**Resultado esperado:** Sitio visible en https://soyleoai.com con SSL

---

## FASE 2: PASARELAS DE PAGO 💳
**Tiempo estimado:** 6-8 horas
**Prioridad:** 🔴 ALTA

### Tareas:

- [ ] **2.1 Registrarse y obtener credenciales**

  **Mercado Pago:**
  - [ ] Registrarse en https://www.mercadopago.com.ar
  - [ ] Ir a Developers → Credenciales
  - [ ] Obtener en modo TEST:
    - Public Key: `TEST-xxx`
    - Access Token: `TEST-xxx`
  - [ ] Guardar para configurar en Vercel

  **Stripe:**
  - [ ] Registrarse en https://stripe.com
  - [ ] Dashboard → Developers → API Keys
  - [ ] Obtener en modo TEST:
    - Publishable key: `pk_test_xxx`
    - Secret key: `sk_test_xxx`
  - [ ] Configurar webhook y obtener: `whsec_xxx`

- [ ] **2.2 Crear estructura de APIs serverless**
  - [ ] Crear carpeta `/api/mercadopago/`
  - [ ] Crear `/api/mercadopago/create-preference.js`
  - [ ] Crear `/api/mercadopago/webhook.js`
  - [ ] Crear carpeta `/api/stripe/`
  - [ ] Crear `/api/stripe/create-checkout.js`
  - [ ] Crear `/api/stripe/webhook.js`

- [ ] **2.3 Actualizar frontend de pagos**
  - [ ] Modificar `/js/payment.js` para conectar con APIs
  - [ ] Reemplazar `MP_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'` con llamada a API
  - [ ] Implementar flujo de Mercado Pago
  - [ ] Implementar flujo de Stripe

- [ ] **2.4 Crear páginas de confirmación**
  - [ ] Crear `success.html` (pago exitoso)
  - [ ] Crear `failure.html` (pago fallido)
  - [ ] Crear `pending.html` (pago pendiente)

- [ ] **2.5 Configurar variables de entorno en Vercel**
  - En Vercel Dashboard → Settings → Environment Variables
  - Agregar:
    ```
    MP_PUBLIC_KEY=TEST-xxx
    MP_ACCESS_TOKEN=TEST-xxx
    STRIPE_PUBLISHABLE_KEY=pk_test_xxx
    STRIPE_SECRET_KEY=sk_test_xxx
    STRIPE_WEBHOOK_SECRET=whsec_xxx
    SITE_URL=https://soyleoai.com
    ```

- [ ] **2.6 Actualizar `package.json` con dependencias**
  ```json
  {
    "dependencies": {
      "mercadopago": "^1.5.17",
      "stripe": "^14.0.0"
    }
  }
  ```

- [ ] **2.7 Testing de pagos**
  - [ ] Probar pago con Mercado Pago (tarjeta de prueba)
  - [ ] Probar pago con Stripe (tarjeta de prueba: 4242 4242 4242 4242)
  - [ ] Verificar que llega a página de éxito
  - [ ] Verificar que webhooks reciben notificaciones

**Resultado esperado:** Sistema de pagos funcional en modo TEST

---

## FASE 3: SISTEMA DE RESERVAS 📅
**Tiempo estimado:** 2-3 horas
**Prioridad:** 🟡 ALTA

### Tareas:

- [ ] **3.1 Configurar Calendly**
  - [ ] Registrarse en https://calendly.com
  - [ ] Conectar con Google Calendar
  - [ ] Crear evento: "Consulta Gratuita 30min"
  - [ ] Personalizar:
    - Logo: Subir logo de SoyLeo
    - Colores: #FFDD00 (amarillo), #0a0a0a (negro)
    - Preguntas: "¿Qué servicio te interesa?"
  - [ ] Obtener link del evento (ej: calendly.com/leodiazdt/consulta)

- [ ] **3.2 Crear página de reservas**
  - [ ] Crear `reservas.html`
  - [ ] Embeber widget de Calendly (inline)
  - [ ] Usar mismo navbar que `index.html`

- [ ] **3.3 Actualizar CTAs en el sitio**
  - [ ] En `index.html`, cambiar todos los links:
    - De: `<a href="#contacto">Agendar consulta</a>`
    - A: `<a href="/reservas.html">Agendar consulta</a>`
  - [ ] Agregar "Reservas" en menú de navegación

**Resultado esperado:** Sistema de reservas online funcionando

---

## FASE 4: BLOG PARA SEO 📝
**Tiempo estimado:** 8-10 horas
**Prioridad:** 🟡 MEDIA-ALTA

### Tareas:

- [ ] **4.1 Crear estructura del blog**
  - [ ] Crear carpeta `/blog/`
  - [ ] Crear `/blog/index.html` (lista de posts)
  - [ ] Crear `/blog/data/posts.json` (metadata)
  - [ ] Crear `/css/blog.css`
  - [ ] Crear `/js/blog.js` (cargar posts dinámicamente)

- [ ] **4.2 Escribir posts iniciales (3-5 posts)**
  - [ ] Post 1: "Cómo la IA puede ahorrar 10+ horas semanales a arquitectos"
  - [ ] Post 2: "Caso de éxito: Presupuestos automatizados con IA"
  - [ ] Post 3: "5 herramientas de IA que todo arquitecto debe conocer"
  - [ ] Post 4: "De 3 días a 6 horas: Automatización de presupuestos"
  - [ ] Post 5: "¿Tu estudio necesita IA? Checklist de 5 minutos"

- [ ] **4.3 SEO técnico**
  - [ ] Crear `sitemap.xml` con todas las URLs
  - [ ] Crear `robots.txt`
  - [ ] Agregar meta tags (title, description) en cada página
  - [ ] Agregar Open Graph tags
  - [ ] Implementar Schema Markup (JSON-LD) para el curso

- [ ] **4.4 Google Search Console**
  - [ ] Registrarse en https://search.google.com/search-console
  - [ ] Agregar propiedad: soyleoai.com
  - [ ] Verificar con DNS (agregar TXT record en GoDaddy)
  - [ ] Enviar sitemap.xml

**Resultado esperado:** Blog funcionando, indexable por Google

---

## FASE 5: EMAIL MARKETING 📧
**Tiempo estimado:** 4-6 horas
**Prioridad:** 🟡 MEDIA-ALTA

### Tareas:

- [ ] **5.1 Configurar ConvertKit**
  - [ ] Registrarse en https://convertkit.com
  - [ ] Configurar remitente: Leo <leodiazdt@gmail.com>
  - [ ] Crear formularios:
    - "Newsletter General"
    - "Descargar Masterclass"
  - [ ] Crear tags: lead-general, interesado-curso, descargo-masterclass

- [ ] **5.2 Crear página de recursos**
  - [ ] Crear `/recursos/index.html`
  - [ ] Diseñar grid de recursos gratuitos:
    - Masterclass (video de 20 min)
    - eBook: "10 Casos de Uso de IA"
    - Plantillas: "30 Prompts Esenciales"
    - Checklist

- [ ] **5.3 Crear landing page de masterclass**
  - [ ] Grabar masterclass de 20 minutos
  - [ ] Subir a YouTube (unlisted) o Vimeo
  - [ ] Crear `/recursos/masterclass/index.html`
  - [ ] Embeber video
  - [ ] CTA: Agendar consulta

- [ ] **5.4 Implementar capturas de email**
  - [ ] Newsletter en footer de `index.html` (formulario ConvertKit)
  - [ ] Exit-intent popup (modal al salir del sitio)
  - [ ] Formulario en página de recursos

- [ ] **5.5 Crear secuencia de emails en ConvertKit**
  - [ ] Email 0 (inmediato): Bienvenida + link masterclass
  - [ ] Email 1 (día 2): Caso de éxito + invitación consulta
  - [ ] Email 2 (día 5): 3 tips prácticos + link blog
  - [ ] Email 3 (día 10): Oferta curso con descuento

- [ ] **5.6 Crear política de privacidad**
  - [ ] Crear `privacidad.html`
  - [ ] Agregar link en footer de todas las páginas

**Resultado esperado:** Sistema de email marketing capturando y nutriendo leads

---

## FASE 6: CONTENIDO ADICIONAL 🎨
**Tiempo estimado:** 6-8 horas
**Prioridad:** 🟢 MEDIA

### Tareas:

- [ ] **6.1 Expandir testimonios**
  - [ ] Agregar 7-12 testimonios más en `data/testimonials.json`
  - [ ] Conseguir fotos (reales o avatares profesionales)
  - [ ] Crear página `testimonios.html` con todos los testimonios

- [ ] **6.2 Videos de casos de éxito**
  - [ ] Grabar video de automatización de presupuestos (3-5 min)
  - [ ] Grabar video de generación de programas (3-5 min)
  - [ ] Subir a YouTube
  - [ ] Crear `/recursos/casos-exito/index.html`
  - [ ] Embeber videos con estadísticas destacadas

- [ ] **6.3 Agregar sección FAQ**
  - [ ] En `index.html`, antes del footer
  - [ ] Implementar acordeón JavaScript
  - [ ] 6-8 preguntas frecuentes:
    - ¿Necesito conocimientos técnicos?
    - ¿Cuánto tiempo debo dedicar?
    - ¿Funciona para mi especialidad?
    - ¿Puedo pagar en cuotas?
    - ¿Hay soporte después del curso?
    - Garantía de 10 horas

- [ ] **6.4 Crear instructivos descargables**
  - [ ] Diseñar en Canva:
    - "Cómo configurar ChatGPT para arquitectura"
    - "30 Prompts esenciales para arquitectos"
    - "Checklist: ¿Tu estudio necesita IA?"
  - [ ] Exportar como PDF
  - [ ] Subir a `/recursos/instructivos/`
  - [ ] Ofrecer a cambio de email

**Resultado esperado:** Sitio con abundante contenido de valor

---

## FASE 7: ANALYTICS Y OPTIMIZACIÓN 📊
**Tiempo estimado:** 3-4 horas
**Prioridad:** 🟢 MEDIA

### Tareas:

- [ ] **7.1 Google Analytics 4**
  - [ ] Crear propiedad en https://analytics.google.com
  - [ ] Obtener Measurement ID: G-XXXXXXXXX
  - [ ] Instalar script en todas las páginas HTML
  - [ ] Configurar conversiones:
    - form_submit
    - begin_checkout
    - purchase
    - click_agendar_consulta

- [ ] **7.2 Crear `/js/analytics.js`**
  - [ ] Eventos personalizados para CTAs
  - [ ] Tracking de apertura modal del curso
  - [ ] Tracking de envío de formularios
  - [ ] Tracking de pagos

- [ ] **7.3 Microsoft Clarity**
  - [ ] Registrarse en https://clarity.microsoft.com
  - [ ] Crear proyecto
  - [ ] Instalar código en todas las páginas
  - [ ] Ver heatmaps y grabaciones

- [ ] **7.4 Meta Pixel (opcional, si usarás Facebook Ads)**
  - [ ] Crear pixel en https://business.facebook.com
  - [ ] Instalar código base
  - [ ] Configurar eventos

- [ ] **7.5 Optimización de performance**
  - [ ] Comprimir todas las imágenes con TinyPNG (< 200KB)
  - [ ] Agregar `loading="lazy"` a todas las imágenes
  - [ ] Minificar CSS y JS
  - [ ] Test en PageSpeed Insights (objetivo: > 90)

**Resultado esperado:** Visibilidad completa del funnel, sitio rápido

---

## 🔑 CREDENCIALES Y SERVICIOS

### Servicios a Registrarse:
- [ ] **GitHub** - https://github.com (repo del código)
- [ ] **Vercel** - https://vercel.com (hosting)
- [ ] **Mercado Pago** - https://www.mercadopago.com.ar (pagos Argentina)
- [ ] **Stripe** - https://stripe.com (pagos internacionales)
- [ ] **Calendly** - https://calendly.com (reservas)
- [ ] **ConvertKit** - https://convertkit.com (email marketing)
- [ ] **Google Analytics** - https://analytics.google.com (analytics)
- [ ] **Google Search Console** - https://search.google.com/search-console (SEO)
- [ ] **Microsoft Clarity** - https://clarity.microsoft.com (heatmaps)

### Variables de Entorno (Configurar en Vercel):
```bash
# Mercado Pago
MP_PUBLIC_KEY=TEST-xxx              # Luego cambiar a PROD
MP_ACCESS_TOKEN=TEST-xxx            # Luego cambiar a PROD

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_xxx  # Luego cambiar a pk_live
STRIPE_SECRET_KEY=sk_test_xxx       # Luego cambiar a sk_live
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Site
SITE_URL=https://soyleoai.com

# Analytics
GA4_MEASUREMENT_ID=G-xxx
META_PIXEL_ID=xxx (opcional)
CLARITY_ID=xxx
```

---

## ✅ CHECKLIST PRE-LANZAMIENTO

### Funcionalidad
- [ ] Todos los links internos funcionan
- [ ] Formulario de contacto envía correctamente
- [ ] Mercado Pago procesa pagos (TEST mode)
- [ ] Stripe procesa pagos (TEST mode)
- [ ] Calendly permite agendar citas
- [ ] Lead magnets se entregan automáticamente
- [ ] Emails de ConvertKit llegan
- [ ] Responsive perfecto en móvil/tablet
- [ ] Probado en Chrome, Firefox, Safari, Edge

### Contenido
- [ ] Ortografía revisada
- [ ] Imágenes optimizadas (< 200KB)
- [ ] Videos cargan correctamente
- [ ] 10-15 testimonios con fotos
- [ ] CTAs claros y visibles
- [ ] Información de contacto actualizada
- [ ] Precios correctos

### SEO
- [ ] Meta title y description en todas las páginas
- [ ] Open Graph tags
- [ ] Sitemap.xml enviado a Search Console
- [ ] Robots.txt configurado
- [ ] Alt text en todas las imágenes
- [ ] Schema markup implementado

### Legal/Seguridad
- [ ] Política de privacidad publicada
- [ ] Link a privacidad en footer
- [ ] HTTPS activo (SSL de Vercel)
- [ ] Variables de entorno en Vercel (NO en código)

### Analytics
- [ ] Google Analytics instalado
- [ ] Eventos personalizados funcionando
- [ ] Conversiones configuradas
- [ ] Clarity activo

### 🔴 CRÍTICO - ANTES DE LANZAR:
- [ ] **Cambiar credenciales de TEST a PRODUCCIÓN**
  - [ ] Mercado Pago: TEST-xxx → PROD-xxx
  - [ ] Stripe: pk_test_xxx → pk_live_xxx
- [ ] **Probar compra real con tarjeta propia**
- [ ] **Verificar email de confirmación**
- [ ] **Mercado Pago: cuenta verificada**
- [ ] **Stripe: cuenta activada (no restricted)**

---

## 🛠️ COMANDOS ÚTILES

### Ver el sitio localmente:
```bash
cd ~/ia-arquitectos-website
python3 -m http.server 8080
# Abrir: http://localhost:8080
```

### Comandos Git básicos:
```bash
# Ver estado
git status

# Agregar cambios
git add .

# Hacer commit
git commit -m "Descripción de cambios"

# Subir a GitHub
git push origin main

# Ver historial
git log --oneline
```

### Vercel CLI (opcional):
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy desde terminal
vercel

# Deploy a producción
vercel --prod
```

### Ubicación del proyecto en Windows (WSL):
```
\\wsl$\Ubuntu\home\leodiazdt\ia-arquitectos-website
```

---

## 📞 INFORMACIÓN DE CONTACTO

### Datos del sitio:
- **Email:** leodiazdt@gmail.com
- **Teléfono:** +54 381 627 4439
- **LinkedIn:** linkedin.com/in/leo-iml
- **Instagram:** @soy.leo_ai

### Curso:
- **Título:** "IA en Arquitectura - Transformando Flujos de Trabajo Profesionales"
- **Modalidad:** 10 encuentros intensivos, 6 semanas
- **Link externo:** https://leoscd.github.io/IA_arquitectura/
- **Garantía:** Si no optimizas 10 horas semanales, continúa sin costo

### Colores corporativos:
- **Amarillo principal:** #FFDD00
- **Amarillo hover:** #FFCC00
- **Negro:** #0a0a0a
- **Blanco:** #ffffff

---

## 📝 NOTAS IMPORTANTES

### Prioridades para empezar:
1. **PRIMERO:** Fase 1 (Deployment) - Sin esto, nada más funciona
2. **SEGUNDO:** Fase 2 (Pagos) - Core del negocio
3. **TERCERO:** Fase 3 (Reservas) - Generación de leads

### Orden sugerido de trabajo:
```
DÍA 1-2:   Fase 1 completa (Git + Vercel + Dominio)
DÍA 3-5:   Fase 2 completa (Pagos en modo TEST)
DÍA 6-7:   Fase 3 completa (Calendly)
DÍA 8-10:  Fase 4 (Blog - 3 posts mínimo)
DÍA 11-13: Fase 5 (Email marketing)
DÍA 14-17: Fase 6 (Contenido adicional)
DÍA 18-19: Fase 7 (Analytics)
DÍA 20-21: Testing y ajustes
DÍA 22-25: Cambiar a PRODUCCIÓN y lanzar
```

### Riesgos comunes y soluciones:
- **DNS no propaga:** Esperar 24-48h, verificar en dnschecker.org
- **Webhooks fallan:** Revisar logs en Vercel, verificar URLs
- **Emails van a spam:** Configurar SPF/DKIM, usar servicio confiable
- **Sitio lento:** Comprimir imágenes, lazy loading, minificar CSS/JS

---

## 🎯 MÉTRICAS DE ÉXITO

### Mes 1 (Post-lanzamiento):
- 500+ visitantes únicos
- 20+ leads capturados
- 5+ consultas agendadas
- 1+ venta del curso

### Mes 3:
- 2000+ visitantes únicos
- 100+ leads capturados
- 20+ consultas agendadas
- 5+ ventas del curso

### Tasas objetivo:
- **Tráfico → Lead:** 2-5%
- **Lead → Consulta:** 15-25%
- **Consulta → Venta:** 30-50%
- **Tasa de rebote:** < 50%
- **Tiempo en sitio:** > 2 minutos

---

## 📚 RECURSOS ÚTILES

### Tutoriales y Docs:
- Vercel: https://vercel.com/docs
- Mercado Pago SDK: https://www.mercadopago.com.ar/developers/es/docs
- Stripe Docs: https://stripe.com/docs
- ConvertKit: https://help.convertkit.com

### Herramientas de desarrollo:
- TinyPNG (comprimir imágenes): https://tinypng.com
- Canva (diseño): https://www.canva.com
- Google PageSpeed: https://pagespeed.web.dev
- DNS Checker: https://dnschecker.org

---

## 🔄 ACTUALIZACIÓN DE ESTE ARCHIVO

**Cada vez que completes una tarea:**
1. Marca el checkbox con `[x]`
2. Agrega fecha de completado si es relevante
3. Anota cualquier problema o aprendizaje

**Para retomar el proyecto:**
1. Lee la sección "Estado Actual"
2. Revisa checklist de la fase actual
3. Continúa desde la siguiente tarea pendiente

---

**Guardado por:** Claude Code Assistant
**Fecha de creación:** 15 de Diciembre 2025
**Proyecto:** SoyLeoAI.com - Plataforma de Capacitaciones en IA para Arquitectos
