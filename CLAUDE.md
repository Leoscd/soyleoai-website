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
**Último commit:** `86acd58` — feat: dark theme + logo texto + hero light orb + título
**Última sesión:** `14/03/2026` — Rediseño completo de secciones, videos, recursos, FAQ, modal curso

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
│   ├── main-v2.js          ← JavaScript principal (FAQ accordion + skill modal + precio toggle)
│   └── payment.js          ← Lógica de pagos (pendiente integración real)
├── data/
│   └── testimonials.json   ← 6 testimonios reales cargados dinámicamente
├── images/
│   ├── logo.png            ← YA NO SE USA (reemplazado por logo texto CSS)
│   ├── leo-foto.jpg
│   ├── escritorio-monitor.png
│   ├── testimonials/
│   │   ├── Pilar-Cichero.jpg
│   │   ├── Julian-Barrionuevo.jpg
│   │   ├── ana-lopez.png
│   │   └── (pendiente: Santiago, Horacio, Jose Inigo)
│   └── casos/
│       ├── honorarios-santiago.mp4   ← App de honorarios (Santiago)
│       ├── web-santiago.mp4          ← Web del estudio (Santiago)
│       ├── presupuesto.mp4           ← Presupuesto de fundaciones
│       ├── render-eugenia.mp4        ← Render controlado con IA (Eugenia)
│       └── pilar-propuesta.jpg       ← PENDIENTE — Leo consigue la imagen de Pilar
├── js/
│   └── hero-canvas.js      ← Canvas isométrico creado pero NO referenciado en HTML
└── .claude/
    ├── agents/             ← 8 agentes especializados
    └── commands/           ← Skills /audit-* /setup-* /optimize-*
```

### Ramas git:
- `main` — versión anterior estable
- `feature/vanta-hero` — rama activa (LISTA PARA MERGE, falta solo pilar-propuesta.jpg)

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
- **Deploy:** `git push origin feature/vanta-hero` → luego merge a main

### Reglas para subagentes:
- No modificar `index.html` sin leer el archivo completo primero
- Variables de entorno van SIEMPRE en `.env.local` (local) y en Vercel Dashboard (producción)
- Nunca hardcodear credenciales en el código
- Al crear archivos nuevos, respetar la estructura de carpetas existente
- Cada tarea que se complete debe marcarse con `[x]` en este archivo

---

## ESTADO ACTUAL — Sesión 14/03/2026

### Completado en sesiones anteriores:
- [x] Diseño y maquetado del sitio
- [x] Testimonios reales cargando desde JSON (6 testimonios)
- [x] Logo texto CSS "LEO IA", branding definido
- [x] Repositorio GitHub + Vercel + dominio soyleoai.com con SSL
- [x] Formulario de contacto con Web3Forms
- [x] Fondo VANTA.NET en hero + navbar scroll + flip-word + dark theme
- [x] SEO técnico: sitemap.xml, robots.txt, Open Graph, Twitter Card, Schema JSON-LD
- [x] Security headers en vercel.json: CSP, HSTS, Referrer-Policy, Permissions-Policy
- [x] Performance: lazy loading, defer, preconnects
- [x] 8 agentes Claude + 7 skills creados

### Completado en sesión 14/03/2026:
- [x] **4 videos de demostración** copiados a `images/casos/` (honorarios, web, presupuesto, render-eugenia)
- [x] **Sección "Lo que podés hacer"** rediseñada con 4 cards video glassmorphism + imagen de fondo arquitectónica
- [x] **Casos de éxito** (Santiago + Pilar) con videos clicables en lightbox — paths actualizados
- [x] **Carrusel de empresas** — QStudio, Sinergia, Estudio Ramos, CAN + relleno, loop infinito sin salto
- [x] **Carrusel de herramientas** — texto puro sin cápsulas, duplicado antes Y después de #como-funciona
- [x] **Sección Recursos gratuitos** con imagen de fondo + 3 cards glassmorphism:
  - Video clase 11 min → https://youtu.be/7vYDKHOzATY
  - Skill de Presupuestos → Google Drive (ZIP)
  - Skill de Reportes de Obra → Google Drive
- [x] **Modal de email para skills** — Web3Forms captura el lead + muestra link de descarga inmediata
- [x] **Modal del curso rediseñado** — glassmorphism oscuro, 9 módulos actualizados, precio oculto $300 USD
- [x] **Sección Consultoría** — botón "Agendar consultoría" con nota "Previo pago · Cupos limitados"
- [x] **FAQ** con 8 preguntas + accordion JS animado (una a la vez)
- [x] **Testimonios movidos** a después de #como-funciona
- [x] **Orden de secciones actualizado** (ver abajo)

### Pendiente inmediato (pre-commit):
- [ ] `images/casos/pilar-propuesta.jpg` — Leo consigue imagen de Pilar (screenshot de la propuesta)
- [ ] URL del Skool → reemplazar `https://skool.com` en `#link-skool` del modal
- [ ] Merge feature/vanta-hero → main + push a soyleoai.com

### Pendiente futuro (no bloquea el commit):
- [ ] `images/og-image.jpg` (1200×630px) — Leo lo crea
- [ ] Fotos de Santiago, Horacio, Jose Inigo → `images/testimonials/`
- [ ] Roles de los 6 testimoniales
- [ ] Nombres reales de las 3-4 empresas para reemplazar los ficticios del carrusel

---

## ORDEN DE SECCIONES ACTUAL (index.html)

1. HERO (VANTA.NET)
2. LO QUE PODÉS HACER — 4 cards video con fondo arquitectónico
3. CASOS DE ÉXITO — Santiago + Pilar con videos lightbox + carrusel empresas
4. RECURSOS GRATUITOS — video clase + 2 skills descargables con captura de email
5. Carrusel herramientas (superior)
6. EL PROGRAMA (#como-funciona)
7. TESTIMONIOS — carousel con 6 testimonios reales
8. Carrusel herramientas (inferior)
9. SOBRE MÍ
10. CURSO PREVIEW (#curso) → abre modal con 9 módulos + precio oculto
11. CONSULTORÍA — 3 cards + botón agendar con pago previo
12. EMPRESAS — sección con imagen de fondo para corporativo
13. FAQ — 8 preguntas accordion
14. CONTACTO + FOOTER

---

## MÓDULOS DEL CURSO (actualizados 14/03/2026)

1. Herramientas de IA
2. Introducción a la IA en Arquitectura
3. Aplicaciones Prácticas (imágenes + chatbots)
4. Extracción y Transformación de Datos
5. Optimización de Presupuestos
6. Tus Apps a Medida
7. Skills (automatización)
8. Modo Agentes (Gemini CLI + Claude Code)
9. Freepik Renders con IA (Eugenia)

**Precio:** $300 USD (oculto hasta que el usuario hace clic en "Ver inversión")
**Plataforma:** Skool (URL pendiente de Leo)
**Garantía:** Si no optimizás 10 horas semanales, continúa sin costo

---

## SKILLS DESCARGABLES (Recursos gratuitos)

| Skill | Drive | Estado |
|-------|-------|--------|
| Skill de Presupuestos (ZIP) | `1BnE6SEAD8DkBxKOC2cTJclsNDL1_iH6g` | ✅ activo |
| Skill de Reportes de Obra | `138BDHk8pI-xFtKRNBofcA-3MScui-6wF` | ✅ activo |

Flujo: usuario ingresa email → Web3Forms notifica a Leo → usuario ve link de descarga en el modal.

---

## ROADMAP DE TAREAS

### FASE 1 — DEPLOYMENT ✅ COMPLETADA
### FASE 2 — FORMULARIO DE CONTACTO ✅ COMPLETADA
### FASE 3 — PASARELAS DE PAGO ~~(CANCELADA — se usa Skool)~~

### FASE 4 — SISTEMA DE RESERVAS
- [ ] Verificar que Calendly siga activo y conectado a Google Calendar
- [ ] Crear `reservas.html` con widget de Calendly embebido
- [ ] Botón "Agendar consultoría" → apuntar a `/reservas.html` (actualmente va a #contacto)

### FASE 5 — BLOG Y SEO ✅ PARCIALMENTE COMPLETADA
- [x] sitemap.xml, robots.txt, Open Graph, Twitter Card, Schema JSON-LD, canonical
- [ ] Crear carpeta `/blog/` con 3 posts iniciales

### FASE 6 — EMAIL MARKETING
- [x] Captura de email para descarga de skills (Web3Forms)
- [ ] Formulario de captura en footer
- [ ] Secuencia de bienvenida (ConvertKit o similar)

### FASE 7 — ANALYTICS
- [ ] Google Analytics 4
- [ ] Microsoft Clarity
- [ ] PageSpeed > 90

### FASE 8 — LANZAMIENTO
- [ ] Conseguir imagen de Pilar → pilar-propuesta.jpg
- [ ] URL de Skool para el modal del curso
- [ ] Merge feature/vanta-hero → main
- [ ] Push a soyleoai.com
- [ ] Anuncio en redes (@soy.leo_ai)

---

## CREDENCIALES Y SERVICIOS

- **Web3Forms access_key:** `d13a018a-540d-4e02-ac1c-6554d017cfb1`
- **Skool URL:** pendiente (Leo lo provee)
- **GA4 / Clarity:** pendiente de instalar

---

## COMANDOS FRECUENTES

```bash
# Ver el sitio localmente
cd ~/ia-arquitectos-website && python3 -m http.server 8080

# Subir cambios a producción
git add . && git commit -m "descripción" && git push origin feature/vanta-hero

# Acceso desde Windows (WSL)
# \\wsl$\Ubuntu\home\leodiazdt\ia-arquitectos-website
# \\wsl.localhost\Ubuntu\home\leodiazdt\ia-arquitectos-website  (Windows 11)
```

---

*Última actualización: 14/03/2026 — Mantenido por Claude Code*
