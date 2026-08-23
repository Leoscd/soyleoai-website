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

## ESTADO ACTUAL — Sesión 21/08/2026 · REDISEÑO «PLANO TÉCNICO»

> **Plan completo y decisiones tomadas: `design/PLAN.md`. Leerlo antes de seguir.**
> Canvas de diseño: https://claude.ai/code/artifact/66bb6a20-62f2-4e0f-b730-005dfd3240fe

**Rama activa:** `feature/redesign-2026` · **sin commitear**

### Hecho en esta sesión
- [x] **Hero rediseñado** — celosía paramétrica de 46 lamas, CSS puro. Verificado a 1440 y 390 px
- [x] **VANTA.NET + three.js eliminados** — 128 KB comprimidos de CDN, fuera
- [x] **CSP endurecido** — `cdnjs` y `jsdelivr` fuera de `script-src` en `vercel.json`
- [x] **Números unificados** — 100+ arquitectos y 20+ empresas en los 4 lugares (antes 50/10)
- [x] **8 secciones diseñadas y aprobadas** en el canvas, pendientes de implementar
- [x] `design/` — artboards fuente + `canvas.json` + `PLAN.md`
- [x] `images/sobre-mi/` — carpeta con `LEEME.txt` para el material de autoridad de Leo

- [x] **Tanda 1 completa** — `#que-podes-hacer`, `#casos-de-exito` y `#como-funciona` migradas
- [x] Fix: el hero se solapaba con el indicador de scroll a 1366×768

### Hecho el 23/08/2026 — Tanda 2a
- [x] **Material de autoridad de Leo recibido y optimizado** — 7 piezas en `images/sobre-mi/`.
      Llegaron como GIF (104 MB, uno de 87 MB); convertidas a H.264 pesan 3,4 MB. Los
      originales quedan en `images/sobre-mi/_fuente/`, ignorado por git.
- [x] **`#modalidad` — sección NUEVA «Así trabajamos»**, va justo antes de `#sobre-mi`.
      2 sesiones reales de pantalla compartida en ventanas 16:9 con lightbox:
      Revit + MCP (control de documentación) y app de envíos a medida.
      No estaba en el plan; se agregó porque el material eran dos historias distintas.
- [x] **`#sobre-mi` rediagramado** — foto grande de ExpoCon que crece para emparejar
      columnas + tira de 3 (FAU UNT · U. de Palermo · ExpoCon), credenciales como lista
      técnica de 1px y métricas sin caja. Se rediagramó respecto del artboard porque
      el material real es vertical, no 3 huecos 4:3 iguales.
- [x] **Copy de `#sobre-mi` reescrito** bajo el eje nuevo: problemas de producción e
      integración de IA en el flujo, no «esencia creativa».
- [x] **Datos del cliente desenfocados** en `sesion-lagos-app.mp4` — quemado en el video
      con ffmpeg, no por CSS: tabla de órdenes, URL, marca y las 2 etiquetas con su nombre.
- [x] Verificado a 1440, 1024 y 390 px. HTML balanceado.

### Hecho el 23/08/2026 — Tandas 2b y 3
- [x] **`#curso`** → rail de 4 hábitos de Pensamiento Crítico con auto-avance cada 7 s,
      pausa al hover/foco y al salir de pantalla. Copy reescrito con enfoque en el cliente:
      «Empezamos por tu problema», «Tu criterio sigue siendo tuyo», «Te enseño a verificar,
      no a confiar», «Te queda un sistema, no un apunte». Foto de Unsplash eliminada.
- [x] **`#consultoria`** → 3 fases sin caja; la elegida se ensancha. Línea de proceso con
      guiones en movimiento. En mobile se apila y la fase activa se marca con regla lateral.
- [x] **`#empresas`** → filas numeradas con velo permanente, barra de acento que crece en
      hover y número en contorno que se rellena. Foto de Unsplash eliminada.
- [x] **`#testimonios`** → fondo a negro pleno, igual que el resto.
- [x] **Teléfono personal eliminado** del menú lateral y de `#contacto`. Cero ocurrencias
      en el repo. **No volver a publicarlo.**
- [x] **Video de Franco** rotulado correctamente: empresa de materiales de construcción.
- [x] **`#sobre-mi`** → el texto ya no arranca con «no vengo de la arquitectura».

### Hecho el 23/08/2026 — Tanda 4 (cierre de secciones)
- [x] **`#recursos`** → filas numeradas con la consola como pieza central. Cajas fuera,
      negro pleno, foto de Unsplash eliminada. Se descartó el carrusel del artboard.
- [x] **`#faq`** → negro pleno.
- [x] **`#casos-de-exito`** → el caso de Pilar salió; entró **CRM inmobiliario**, una
      empresa de flipping: scoring de zonas, análisis por IA y bot de negociación.
      `images/casos/crm-inmobiliario.mp4` (480 KB, venía como GIF de 2,5 MB).
- [x] **Cache-busting** en `css/styles-v2.css` y `js/main-v2.js` — hoy en `?v=20260823b`.
      **Al tocar cualquiera de los dos, subir ese número.**
- [x] **Bug corregido**: el modal de descarga de skills buscaba `.recurso-card`, que dejó
      de existir al rediseñar `#recursos`. Los dos botones de skill estaban rotos.
- [x] `initPtRail()` endurecido: el IntersectionObserver sólo pausa, no habilita.

### Hecho el 23/08/2026 — CIERRE (tanda 5)
- [x] **CSP arreglado — GA4 y Clarity estaban bloqueados.** `script-src` no incluía
      `googletagmanager.com` ni `clarity.ms`, y `connect-src` no incluía
      `google-analytics.com`. Los dos tags estaban en el HTML desde marzo pero el
      navegador los rechazaba: **GA4 nunca recibió un solo dato.** Venía roto desde `main`.
- [x] **`images.unsplash.com` fuera del CSP** — el `.modal-bg` del modal del curso ahora
      es una grilla técnica CSS, sin imagen externa. Cero dominios de imagen de terceros.
- [x] **Videos: los 4 thumbnails tenían `autoplay` sin `preload`** → el navegador bajaba
      30 MB al abrir la home aunque nadie llegara a esa sección. Ahora van con
      `preload="none"` + poster, y arrancan con `initLazyVideos()` al entrar en pantalla.
- [x] **Bug encontrado: los contenedores mentían la duración.** `honorarios-santiago.mp4`
      tenía 33 s de video y **11 min 42 s de audio mudo**; `web-santiago.mp4`, 15 s contra
      5 min 23 s. Con `loop`, esos thumbnails se congelaban minutos entre repeticiones.
      Los 5 audios eran silencio digital (-91 dB): se eliminaron.
- [x] **Reencode + previews.** Full sin audio para el lightbox (CRF 28, se verificó que el
      texto de las capturas de pantalla sigue legible); preview 854×480 para el thumbnail.
      `images/casos/preview/` y `images/casos/poster/` son nuevas.
- [x] **Carga inicial de la home: 33,9 MB → 1,04 MB** (−97 %). Ningún `.mp4` se descarga
      al abrir la página; se verificó contra el log del servidor.
- [x] **Blog conectado.** Los 3 posts existían en `blog/` pero **no los linkeaba nadie** y
      no estaban en el sitemap. Se creó `blog/index.html` (hub, plano técnico), se los
      linkeó desde el menú y el footer, y se les agregó **GA4 + Clarity** (no tenían
      analytics) y Schema `BreadcrumbList`.
- [x] **`sitemap.xml` rehecho** — 5 URLs reales. Salió `pago.html` (Fase 3 cancelada), que
      además quedó con `noindex`. Se le arregló un `<link>` a un CSS inexistente.
- [x] **`og-image.jpg`** — era 1080×1350 (formato Instagram) y pesaba 1,5 MB: las previews
      salían recortadas. Ahora 1200×630, 72 KB, en el lenguaje del rediseño.
- [x] **Favicon** — no existía; cada visita daba 404 en `/favicon.ico`. Se generó el set
      (`favicon.ico` + PNG 32 + apple-touch-icon) y se declaró en las 6 páginas.
- [x] **Código muerto fuera** — `js/hero-canvas.js`, 115 reglas CSS de las cajas viejas
      (incluida `.qph-window`, que el plano técnico reemplazó por `.pt-plate`) y 3
      observers de JS. CSS 5803 → 5072 líneas; JS 1319 → 1227.
      Se verificó regla por regla que ninguna clase viva perdiera estilos.
- [x] **Imágenes** — testimonios 1,8 MB → 31 KB (se servían a 1024 px para mostrarse a
      64 px). Borrados: `escritorio-monitor.png` (1,6 MB, sin usos), `pilar-propuesta.mp4`,
      2 fotos viejas de testimonios y 3 `:Zone.Identifier` que estaban trackeados.
- [x] **CTA de Skool** — no hay URL pública (el acceso es posterior al pago), así que el
      botón dejó de prometer un ingreso directo: dice «Quiero sumarme» y aclara que el
      acceso llega por mail tras la inscripción.
- [x] **Cache-busting** a `?v=20260823b`.

### Próximo paso
- [ ] Merge `feature/redesign-2026` → `main` y push a producción
- [ ] **Verificar en producción que GA4 y Clarity ahora sí reportan** (era el bug de fondo)
- [ ] PageSpeed real sobre soyleoai.com ya desplegado
- [ ] Reenviar la og-image por el depurador de Facebook/LinkedIn para limpiar la caché vieja

### Reglas de este rediseño
- Sin cajas: nada de contenedores con borde y fondo. Reglas de 1px, cotas y grilla.
- Fondo `#000000` pleno en todas las secciones.
- El CSS nuevo **se appendea** al final de `styles-v2.css` bajo su header. No se reescribe lo previo.
- Al migrar una sección con foto de Unsplash, la foto se elimina.
- **Eje del copy:** todo apunta a resolver problemas de producción y a integrar IA en el
  flujo de trabajo. Nada de «esencia creativa» ni de hablar de la herramienta en abstracto.
- **Nunca subir GIFs al sitio.** Convertir a `.mp4` H.264 (mute + loop). No hay ffmpeg
  instalado: usar el binario de `imageio_ffmpeg` (pip, sin sudo).

---

## ESTADO ANTERIOR — Sesión 14/03/2026

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

### Rediseño 2026 — rama `feature/redesign-2026` (sin commitear):
- [x] **Ventanas con chrome** (`.qph-window`) para los 4 videos de TRANSFORMACIÓN — barra de título, luces de semáforo que se encienden en hover, chip "EN VIVO", tilt 3D, reflejo diagonal y animación de arranque al entrar en viewport
- [x] **Maquetas de consola** (`.term`) en las 3 cards de Recursos gratuitos — tipeo carácter por carácter en loop, con output realista por skill
- [x] **Hero** — badge con punto pulsante, CTA secundario `.btn-ghost-large`, fila de métricas con contadores animados, indicador de scroll, entrada escalonada
- [x] **El Programa** — número 01/02/03 como marca de agua + barra de acento que crece al entrar
- [x] **Scroll-reveal genérico** `[data-reveal]` con stagger automático entre hermanos
- [x] **Contraste corregido** en `.btn-primary-large` — el texto era blanco sobre amarillo (~1.7:1, ilegible); ahora negro (~15:1)
- [x] Todo respeta `prefers-reduced-motion`

> El CSS nuevo está appendeado al final de `styles-v2.css` bajo el header `███ REDISEÑO 2026`; el JS al final de `main-v2.js`. No se reescribieron las reglas previas.

### Pendiente inmediato (pre-commit):
- [x] ~~imagen de Pilar~~ — su caso salió de `#casos-de-exito` el 23/08/2026 (entró el CRM inmobiliario)
- [x] ~~URL del Skool~~ — **no aplica**: el acceso es posterior al pago, no hay URL pública que linkear
- [ ] Merge `feature/redesign-2026` → main + push a soyleoai.com

### Pendiente futuro (no bloquea el commit):
- [x] ~~`images/og-image.jpg`~~ — generada 1200×630 el 23/08/2026
- [x] ~~Fotos de Santiago, Horacio, Jose Inigo~~ — las 6 están en `images/testimonials/*.jpg`
- [x] ~~Roles de los 6 testimoniales~~ — completos en `data/testimonials.json`
- [ ] Nombres reales de las 3-4 empresas para reemplazar los ficticios del carrusel
- [ ] Calendly: los 5 CTA de «Agendar consulta» siguen yendo a `#contacto`, no a
      https://calendly.com/leodiazdt/consultas (Fase 4, decisión de Leo)

---

## ORDEN DE SECCIONES ACTUAL (index.html)

1. HERO (celosía paramétrica CSS)
2. LO QUE PODÉS HACER — 4 cards video con fondo arquitectónico
3. CASOS DE ÉXITO — Santiago + Pilar con videos lightbox + carrusel empresas
4. RECURSOS GRATUITOS — video clase + 2 skills descargables con captura de email
5. Carrusel herramientas (superior)
6. EL PROGRAMA (#como-funciona)
7. TESTIMONIOS — carousel con 6 testimonios reales
8. Carrusel herramientas (inferior)
8.5. ASÍ TRABAJAMOS (#modalidad) — 2 sesiones de trabajo reales, screen-share 16:9
9. SOBRE MÍ — muro de autoridad: ExpoCon, FAU UNT, U. de Palermo
10. CURSO PREVIEW (#curso) → abre modal con 9 módulos + precio oculto
11. CONSULTORÍA — 3 cards + botón agendar con pago previo
12. EMPRESAS — sección con imagen de fondo para corporativo
13. FAQ — 8 preguntas accordion
14. CONTACTO + FOOTER (con enlace al blog)

**Fuera de la home:** `/blog/` (hub + 3 posts) · `pago.html` (noindex, Fase 3 cancelada)

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

### FASE 5 — BLOG Y SEO ✅ COMPLETADA
- [x] sitemap.xml, robots.txt, Open Graph, Twitter Card, Schema JSON-LD, canonical
- [x] `/blog/` con 3 posts + hub `blog/index.html`, linkeado desde menú y footer,
      en el sitemap y con analytics propio (23/08/2026)

### FASE 6 — EMAIL MARKETING
- [x] Captura de email para descarga de skills (Web3Forms)
- [ ] Formulario de captura en footer
- [ ] Secuencia de bienvenida (ConvertKit o similar)

### FASE 7 — ANALYTICS
- [x] Google Analytics 4 — `G-E3NEPPHYCB`
- [x] Microsoft Clarity — `w1hoo2jpu8`
- [x] **CSP desbloqueado** (23/08/2026): hasta esa fecha los dos tags estaban en el HTML
      pero el Content-Security-Policy los bloqueaba. No había datos reales antes de eso.
- [ ] PageSpeed > 90 — medir sobre producción una vez desplegado

### FASE 8 — LANZAMIENTO
- [ ] Conseguir imagen de Pilar → pilar-propuesta.jpg
- [ ] URL de Skool para el modal del curso
- [ ] Merge feature/vanta-hero → main
- [ ] Push a soyleoai.com
- [ ] Anuncio en redes (@soy.leo_ai)

---

## CREDENCIALES Y SERVICIOS

- **Web3Forms access_key:** `d13a018a-540d-4e02-ac1c-6554d017cfb1`
- **Skool URL:** no aplica — el acceso se envía por mail después del pago
- **GA4:** `G-E3NEPPHYCB` · **Clarity:** `w1hoo2jpu8` — ambos instalados y permitidos por el CSP

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

*Última actualización: 23/08/2026 (cierre) — Mantenido por Claude Code*
