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
- [x] **Cache-busting** `?v=20260823` en `css/styles-v2.css` y `js/main-v2.js`.
      **Al tocar cualquiera de los dos, subir ese número.**
- [x] **Bug corregido**: el modal de descarga de skills buscaba `.recurso-card`, que dejó
      de existir al rediseñar `#recursos`. Los dos botones de skill estaban rotos.
- [x] `initPtRail()` endurecido: el IntersectionObserver sólo pausa, no habilita.

### Próximo paso
Todas las secciones están migradas. Queda el cierre:
- Sacar `images.unsplash.com` del CSP (1 solo uso: `.modal-bg` del modal del curso)
- Borrar `js/hero-canvas.js` — archivo muerto
- Limpiar el CSS de las cajas viejas (`.recurso-card`, `.consultoria-card`, `.empresa-card`,
  `.qph-card`, `.caso-card`, `.cf-block`, `.stat-box`) y sus observers muertos en el JS
- Auditoría responsive completa + PageSpeed
- Commit y merge a `main`

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

*Última actualización: 23/08/2026 — Mantenido por Claude Code*
