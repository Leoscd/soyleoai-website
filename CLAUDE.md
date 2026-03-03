# CLAUDE.md — SoyLeoAI.com
> Este archivo es leído automáticamente por Claude Code al iniciar cualquier sesión en este directorio.
> Mantenerlo actualizado es clave para que los subagentes trabajen con el contexto correcto.

---

## PROYECTO
**Nombre:** SoyLeoAI.com
**Descripción:** Landing page + plataforma de capacitación en IA para arquitectos
**Propietario:** Leo Díaz — leodiazdt@gmail.com | +54 381 627 4439
**Dominio:** soyleoai.com (comprado en GoDaddy)
**Repositorio:** https://github.com/Leoscd/soyleoai-website
**Hosting:** Vercel (plan gratuito)
**Último commit:** `c8d1cde` — Initial commit con landing completa

---

## ESTRUCTURA DEL PROYECTO

```
ia-arquitectos-website/
├── CLAUDE.md               ← Este archivo (contexto para Claude)
├── index.html              ← Página principal
├── pago.html               ← Página de pagos
├── vercel.json             ← Configuración de Vercel (ya configurado)
├── package.json            ← Dependencias: mercadopago, stripe
├── .env.local              ← Variables de entorno locales (NO subir a git)
├── .gitignore              ← Excluye .env.local, .vercel, node_modules
├── css/
│   ├── styles-v2.css       ← Estilos principales
│   └── payment.css         ← Estilos de la página de pagos
├── js/
│   ├── main-v2.js          ← JavaScript principal
│   └── payment.js          ← Lógica de pagos (pendiente integración real)
├── data/
│   └── testimonials.json   ← 3 testimonios reales cargados dinámicamente
├── images/
│   ├── logo.png
│   ├── leo-foto.jpg
│   ├── escritorio-monitor.png
│   └── testimonials/
│       ├── Pilar-Cichero.jpg
│       ├── Julian-Barrionuevo.jpg
│       └── ana-lopez.png
└── docs/
    ├── Claude.md                    ← Plan detallado por fases (referencia)
    └── ESTADO-ACTUAL-27-OCT-2025.md ← Historial de trabajo anterior
```

---

## STACK Y CONVENCIONES

- **Frontend:** HTML5 + CSS3 + Vanilla JavaScript (sin frameworks)
- **Backend:** Vercel Serverless Functions (Node.js) — carpeta `/api/`
- **Fuentes:** Space Grotesk + Inter (Google Fonts)
- **Colores corporativos:**
  - Amarillo principal: `#FFDD00`
  - Amarillo hover: `#FFCC00`
  - Negro: `#0a0a0a`
  - Blanco: `#ffffff`
- **Servidor local:** `python3 -m http.server 8080` → http://localhost:8080
- **Deploy:** `git push origin main` → Vercel despliega automáticamente

### Reglas para subagentes:
- No modificar `index.html` sin leer el archivo completo primero
- Variables de entorno van SIEMPRE en `.env.local` (local) y en Vercel Dashboard (producción)
- Nunca hardcodear credenciales en el código
- Al crear archivos nuevos, respetar la estructura de carpetas existente
- Cada tarea que se complete debe marcarse con `[x]` en este archivo

---

## ESTADO ACTUAL — Marzo 2026

### Completado:
- [x] Diseño y maquetado del sitio (95% completo)
- [x] Testimonios reales cargando desde JSON
- [x] Logo, imágenes y branding definidos
- [x] Repositorio en GitHub: `Leoscd/soyleoai-website`
- [x] Vercel conectado al repositorio
- [x] `vercel.json` configurado con headers de seguridad
- [x] `.gitignore` y `.env.local` configurados
- [x] Dominio `soyleoai.com` conectado a Vercel (pendiente propagación DNS)

### Bloqueante actual:
- [ ] **Confirmar baja de system.io** y cambio de DNS en GoDaddy a Vercel:
  ```
  Tipo: A     | Nombre: @   | Valor: 76.76.21.21       | TTL: 600
  Tipo: CNAME | Nombre: www | Valor: cname.vercel-dns.com | TTL: 600
  ```
  Verificar propagación en: https://dnschecker.org

---

## ROADMAP DE TAREAS

### FASE 1 — DEPLOYMENT (COMPLETADA EXCEPTO DNS)
- [x] Git + GitHub + Vercel conectados
- [ ] DNS de GoDaddy apuntando a Vercel (esperando baja de system.io)
- [ ] Verificar sitio en https://soyleoai.com con SSL activo

### FASE 2 — FORMULARIO DE CONTACTO
- [x] Reemplazar FormSubmit (tenía error 524) por Web3Forms
  - Obtener Access Key en https://web3forms.com
  - Actualizar `action` en el formulario de `index.html`
  - Actualizar redirect URL de localhost a `https://soyleoai.com`
- **Subagente sugerido:** `claude "implementa Web3Forms en el formulario de contacto de index.html"`

### FASE 3 — PASARELAS DE PAGO
- [ ] Crear carpeta `/api/`
- [ ] Crear `/api/mercadopago/create-preference.js`
- [ ] Crear `/api/mercadopago/webhook.js`
- [ ] Crear `/api/stripe/create-checkout.js`
- [ ] Crear `/api/stripe/webhook.js`
- [ ] Actualizar `js/payment.js` para llamar a las APIs
- [ ] Crear `success.html`, `failure.html`, `pending.html`
- [ ] Configurar variables de entorno en Vercel Dashboard:
  ```
  MP_PUBLIC_KEY, MP_ACCESS_TOKEN
  STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
  SITE_URL=https://soyleoai.com
  ```
- **Subagente sugerido:** `claude "crea las APIs serverless de Mercado Pago en /api/mercadopago/"`

### FASE 4 — SISTEMA DE RESERVAS
- [ ] Configurar Calendly (https://calendly.com)
  - Conectar con Google Calendar
  - Evento: "Consulta Gratuita 30min"
  - Colores: #FFDD00 y #0a0a0a
- [ ] Crear `reservas.html` con widget de Calendly embebido
- [ ] Actualizar CTAs en `index.html` → apuntar a `/reservas.html`
- **Subagente sugerido:** `claude "crea reservas.html con widget de Calendly embebido"`

### FASE 5 — BLOG Y SEO
- [ ] Crear carpeta `/blog/`
- [ ] Crear `/blog/index.html` (lista de posts)
- [ ] Crear `/blog/data/posts.json`
- [ ] Crear 3 posts iniciales en HTML
- [ ] Crear `sitemap.xml` y `robots.txt`
- [ ] Agregar meta tags Open Graph en todas las páginas
- [ ] Agregar Schema Markup (JSON-LD)
- **Subagente sugerido:** `claude "crea la estructura del blog con 3 posts iniciales y SEO técnico"`

### FASE 6 — EMAIL MARKETING
- [ ] Registrarse en ConvertKit (https://convertkit.com)
- [ ] Crear formulario de captura de emails en footer
- [ ] Agregar exit-intent popup modal
- [ ] Crear `/recursos/index.html` con lead magnets
- [ ] Crear secuencia de 4 emails de bienvenida
- [ ] Crear `privacidad.html`
- **Subagente sugerido:** `claude "agrega formulario de captura de emails en footer de index.html"`

### FASE 7 — ANALYTICS
- [ ] Instalar Google Analytics 4 (G-XXXXXXXXX en todas las páginas)
- [ ] Crear `/js/analytics.js` con eventos personalizados
- [ ] Instalar Microsoft Clarity
- [ ] Comprimir imágenes con TinyPNG (objetivo: < 200KB cada una)
- [ ] Agregar `loading="lazy"` a todas las imágenes
- [ ] Test en PageSpeed Insights (objetivo: > 90)
- **Subagente sugerido:** `claude "instala GA4 y Clarity en todas las páginas HTML del proyecto"`

### FASE 8 — LANZAMIENTO
- [ ] Cambiar credenciales de TEST a PRODUCCIÓN (Mercado Pago + Stripe)
- [ ] Probar compra real con tarjeta propia
- [ ] Checklist completo de QA (links, formularios, pagos, mobile)
- [ ] Anuncio en redes sociales (@soy.leo_ai)

---

## CÓMO USAR SUBAGENTES DESDE VSCODE

Abrir terminal en VSCode (`Ctrl+\``) y ejecutar:

```bash
# Ir al proyecto
cd ~/ia-arquitectos-website

# Lanzar un subagente para una tarea específica
claude "lee el CLAUDE.md y luego [descripción de la tarea]"
```

### Ejemplos de subagentes listos para usar:
```bash
# Formulario de contacto
claude "lee el CLAUDE.md y reemplaza FormSubmit por Web3Forms en el formulario de index.html"

# APIs de pago
claude "lee el CLAUDE.md y crea las APIs serverless de Mercado Pago en /api/mercadopago/"

# Página de reservas
claude "lee el CLAUDE.md y crea reservas.html con widget de Calendly"

# Blog
claude "lee el CLAUDE.md y crea la estructura del blog en /blog/ con 3 posts iniciales"

# Analytics
claude "lee el CLAUDE.md y agrega Google Analytics 4 y Microsoft Clarity a todas las páginas HTML"
```

---

## CREDENCIALES Y SERVICIOS

> Las credenciales reales van en `.env.local` (local) y en Vercel Dashboard → Settings → Environment Variables.
> Nunca en el código.

### Variables de entorno a configurar en Vercel:
```
MP_PUBLIC_KEY=           # Mercado Pago (TEST-xxx → luego PROD)
MP_ACCESS_TOKEN=         # Mercado Pago
STRIPE_PUBLISHABLE_KEY=  # Stripe (pk_test_xxx → luego pk_live_xxx)
STRIPE_SECRET_KEY=       # Stripe
STRIPE_WEBHOOK_SECRET=   # Stripe webhook
SITE_URL=https://soyleoai.com
GA4_MEASUREMENT_ID=      # Google Analytics
CLARITY_ID=              # Microsoft Clarity
```

### Servicios pendientes de registro:
- [ ] Mercado Pago Developers → https://www.mercadopago.com.ar/developers
- [ ] Stripe → https://stripe.com
- [ ] Calendly → https://calendly.com
- [ ] ConvertKit → https://convertkit.com
- [ ] Google Analytics → https://analytics.google.com
- [ ] Google Search Console → https://search.google.com/search-console
- [ ] Microsoft Clarity → https://clarity.microsoft.com

---

## INFORMACIÓN DEL CURSO

- **Título:** "IA en Arquitectura - Transformando Flujos de Trabajo Profesionales"
- **Modalidad:** 10 encuentros intensivos, 6 semanas
- **Garantía:** Si no optimizás 10 horas semanales, continúa sin costo
- **Link externo actual:** https://leoscd.github.io/IA_arquitectura/
- **LinkedIn:** linkedin.com/in/leo-iml
- **Instagram:** @soy.leo_ai

---

## COMANDOS FRECUENTES

```bash
# Ver el sitio localmente
cd ~/ia-arquitectos-website && python3 -m http.server 8080

# Subir cambios a producción
git add . && git commit -m "descripción" && git push origin main

# Acceso desde Windows (WSL)
# \\wsl$\Ubuntu\home\leodiazdt\ia-arquitectos-website
```

---

*Última actualización: Marzo 2026 — Mantenido por Claude Code*
