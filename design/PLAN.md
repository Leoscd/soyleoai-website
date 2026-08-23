# Rediseño «Plano técnico» — plan de implementación

> Canvas de diseño (fuente de verdad visual):
> https://claude.ai/code/artifact/66bb6a20-62f2-4e0f-b730-005dfd3240fe
> Página **Hero — direcciones** y página **Secciones aprobadas**.

---

## 1. Qué se decidió

| Decisión | Elegido | Cuándo |
|---|---|---|
| Lenguaje visual | **Plano técnico**: grilla, reglas de 1px, cotas, líneas que se dibujan solas | Al inicio |
| Cajas | **Eliminadas** en las 8 secciones (`.qph-card`, `.caso-card`, `.recurso-card`, `.cf-block`, `.consultoria-card`, `.empresa-card`, `.stat-box`) | Al inicio |
| Fondo | **Negro pleno `#000000`** en todas, sin lavados de color | Tras ver la v1 |
| Entrega | **Prototipo funcionando**, no maquetas estáticas | Al inicio |
| Hero | **A · Celosía paramétrica** (46 lamas en onda viajera) | Tras comparar A / B / C |
| CTAs del hero | **Agendar consulta** (amarillo) + **Ver recursos gratis** (fantasma) | Revertido tras probar sin el primero |
| Métrica «2 días → 1 tarde» | **Eliminada** del hero | — |
| Números | **100+** arquitectos · **20+** empresas, en los 4 lugares | Del brief original |
| Fotos de Unsplash | **Se eliminan** al migrar cada sección | Tras elegir negro pleno |
| Ritmo | **Por tandas de 2-3 secciones**, revisando en el navegador entre tandas | — |

**Direcciones de hero descartadas** (siguen en el canvas por si se vuelve atrás):
`HeroDiagrid` (B · fachada de apertura, 240 rombos) y `HeroEstratos` (C · curvas senoidales).

---

## 2. Qué YA está implementado

### Hecho y verificado en el navegador (desktop 1440 + mobile 390)

- **Hero completo** — celosía de 46 lamas, entrepisos, velo de legibilidad, badge sin
  cápsula, métricas de ancho igual con el separador sobre el eje, indicador de scroll.
  Responsive 1024 y 768. Respeta `prefers-reduced-motion`.
- **VANTA.NET + three.js eliminados** — eran 128 KB comprimidos desde dos CDN.
  El hero ahora es CSS puro, cero dependencias externas.
- **CSP endurecido** en `vercel.json` — `cdnjs.cloudflare.com` y `cdn.jsdelivr.net`
  fuera de `script-src`.
- **Números corregidos** — 100+ y 20+ en el badge del hero, las 2 métricas del hero
  y las 2 stats de Sobre mí. Antes decían 50 y 10, y se contradecían entre sí.
- **Fix de solapamiento del hero** — tenía `height:100vh` fijo y `.hero-scroll` absoluto:
  a 1366×768 el SCROLL se dibujaba encima de las métricas. Ahora el hero crece si no entra.
- **Tanda 1 completa** — las 3 secciones migradas, con los 7 videos conectados al lightbox
  existente. Verificadas a 1440 y 390 px.

### Dónde vive el código

| Qué | Dónde |
|---|---|
| Markup del hero | `index.html`, sección `#home` |
| Markup de las secciones | `index.html`, prefijo de clases `pt-` |
| JS de las secciones | `js/main-v2.js`, al final: `initPtTabs/PtAccordion/PtNodes` |
| Estilos nuevos | `css/styles-v2.css`, al final, bajo `███ PLANO TÉCNICO 2026 — HERO` |
| Animaciones | Ya existentes: `initCounters()`, `initScrollReveal()`, `initWordSwap()` y el CSS de `data-stagger`. No hizo falta JS nuevo. |
| Fuentes del diseño | `design/artboards/*.dc.html` + `design/canvas.json` |

---

## 3. Qué falta — en orden

### Tanda 1 — ✅ COMPLETA
- [x] **`#que-podes-hacer`** → 4 pestañas + diagrama Antes/Con IA + placa de video. Foto de Unsplash eliminada.
- [x] **`#casos-de-exito`** → acordeón de 2 casos, 3 videos, marquee de estudios.
- [x] **`#como-funciona`** → diagrama de 3 nodos; el riel se dibuja al entrar en pantalla.

### Tanda 2a — ✅ COMPLETA (23/08/2026)
- [x] **`#modalidad`** → **sección nueva, no estaba en el plan original.** Ver «Por qué se
      agregó» abajo. 2 sesiones de trabajo reales en ventanas 16:9 con lightbox.
- [x] **`#sobre-mi`** → muro de autoridad con el material real de Leo. El artboard
      `SobreMi.dc.html` preveía 3 huecos vacíos iguales; se rediagramó al recibir el material.

**Por qué se agregó `#modalidad`:** el material que trajo Leo no eran 3 piezas
intercambiables sino **dos historias distintas** — 5 piezas verticales de escenario
(autoridad) y 2 screen-shares 16:9 de sesiones con clientes (modalidad de trabajo).
Meterlas en la misma grilla de 4:3 aplanaba las dos. Los screen-shares además son más
persuasivos que cualquier foto de escenario, porque muestran el problema resolviéndose.

### Tanda 2b — ✅ COMPLETA (23/08/2026)
- [x] **`#curso`** (Pensamiento Crítico) → rail de 4 hábitos con auto-avance cada 7 s.
      Foto de Unsplash eliminada. **El copy se reescribió con enfoque en el cliente**:
      ya no describe la doctrina de Leo sino lo que el cliente se lleva.
- [x] **`#testimonios`** → sólo el fondo, a negro pleno como el resto. No estaba en el plan.
- [x] **`#recursos`** → filas numeradas con la consola como pieza central, sin cajas.
      Se descartó el carrusel del artboard: con 3 recursos no hay nada que paginar, y
      apilarlos le da a cada consola el ancho que necesita para leerse.
- [x] **`#faq`** → sólo el fondo, a negro pleno.
- [x] **`#casos-de-exito`** → el caso de Pilar se reemplazó por el CRM inmobiliario
      (empresa de flipping). Pilar sigue en el carrusel de `#testimonios`.
      El título pasó de «arquitectos reales» a «estudios y empresas», que ya no mentía.

### Tanda 3 — ✅ COMPLETA (23/08/2026)
- [x] **`#consultoria`** → 3 fases que se ensanchan al elegirlas. Cajas fuera.
- [x] **`#empresas`** → filas numeradas con velo, barra de acento y número en contorno.
      Foto de Unsplash eliminada.

**Dos correcciones sobre el artboard de Consultoría:**
1. Los `<button>` centran su contenido en vertical. Con las 3 fases estiradas a la misma
   altura, la de texto más corto quedaba 25 px más abajo que las otras dos.
2. El artboard dibujaba el ícono con `stroke-dashoffset: 200` y lo llevaba a 0 al activarse.
   Efecto real: las 2 fases no elegidas mostraban un hueco vacío donde debía ir el ícono.
   Se quitó el dibujado; el ícono ahora siempre se ve y sólo cambia de color.

### Cierre
- [ ] Quitar `images.unsplash.com` del CSP. Queda **1 solo uso**: el `.modal-bg` del modal
      del curso (`index.html`, ~línea 972).
- [ ] Borrar `js/hero-canvas.js` — archivo muerto, cero referencias en el HTML.
- [ ] Limpiar del CSS las reglas de las cajas viejas, una vez que nada las use.
- [ ] Auditoría responsive completa y PageSpeed.

---

## 4. Material que depende de Leo

| Qué | Dónde va | Bloquea |
|---|---|---|
| ~~3 piezas de autoridad~~ ✅ **Entregado 23/08/2026** — 7 piezas, ya optimizadas e integradas | `images/sobre-mi/` — ver `LEEME.txt` ahí | — |
| Confirmar el rótulo exacto de ExpoCon, FAU UNT y U. de Palermo en `.sm-creds` | `index.html`, `#sobre-mi` | No: hay texto conservador puesto |
| ¿Va un canal de contacto en lugar del teléfono? Calendly ya está confirmado | `#contacto`, `.contacto-details` | No |
| Confirmar con Francisco Lagos que su sesión puede publicarse | `#modalidad`, SESIÓN 02 | No: los datos ya van desenfocados |
| URL de Skool | `#link-skool` en el modal del curso | No |
| `og-image.jpg` 1200×630 | `images/` | No |
| Revisar el copy de Pensamiento Crítico | Artboard `PensamientoCritico.dc.html` | Sí, antes de migrar `#curso` |

---

## 5. Cómo se retoma

1. Abrir el canvas (link arriba) y mirar el artboard de la sección a migrar.
2. Los artboards son la referencia exacta: colores, tamaños y animaciones salen de ahí.
3. El CSS nuevo **se appendea** al final de `styles-v2.css`. No se reescribe lo de arriba.
4. Verificar en `python3 -m http.server 8080` a 1440, 1024 y 390 px antes de dar por hecha
   una sección.

### Eje de copy (definido 23/08/2026)

El texto de todas las secciones apunta a **resolver problemas de producción e integración
de IA en el flujo de trabajo**, no a la herramienta ni a la creatividad en abstracto.
Concreto: dónde se va el tiempo, qué parte del proceso se automatiza, qué queda bajo el
criterio del arquitecto. El copy viejo de `#sobre-mi` («no perder la esencia creativa»,
«repensar el proceso creativo») se reescribió entero bajo este eje. Falta aplicarlo a
`#recursos`, `#curso`, `#consultoria` y `#empresas`.

### Caché: por qué «no funcionaba» lo que sí funcionaba

Leo reportó que el rail de `#curso` estaba clavado en el paso 01 y que los clicks en
Consultoría no hacían nada. **El código estaba bien** — se verificó despachando clicks
sobre la página real: `cons--n1`/`cons--n2` cambiaban y el rail avanzaba. Lo que veía era
`css/styles-v2.css` y `js/main-v2.js` cacheados por el navegador.

Arreglado de raíz: los dos assets se sirven con `?v=20260823`. **Al cambiar CSS o JS hay
que subir ese número**, o el problema vuelve — y en producción Vercel cachea más agresivo
que `python3 -m http.server`.

Además se endureció `initPtRail()`: `visible` arranca en `true` y el IntersectionObserver
sólo PAUSA. Antes, si el observer no llegaba a disparar, el rail quedaba clavado en 01
para siempre. Y con `prefers-reduced-motion` el rail no avanza pero el pie ya no promete
que «avanza solo»: dice que los pasos se abren a mano.

### Teléfono personal fuera (23/08/2026)

Leo pidió sacar su número. Estaba en 2 lugares: el menú lateral y `.contacto-details`.
Ambos eliminados; no quedan ocurrencias en el repo. **No volver a publicarlo.**
Los canales que quedan son email, LinkedIn e Instagram.

### Nota técnica: video, no GIF

El material llegó como GIF: 104 MB entre cuatro archivos, uno solo de 87 MB. Convertidos a
H.264 pesan 3,4 MB — **30× menos**. No hay ffmpeg instalado en el sistema; el binario sale de
`python3 -c "import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())"` (pip, sin sudo).
Los originales viven en `images/sobre-mi/_fuente/`, ignorados por git.

---

## 6. Cómo volver atrás

Nada está commiteado. `git checkout -- index.html css/styles-v2.css vercel.json` deja
todo como estaba. Las carpetas `design/` e `images/sobre-mi/` son nuevas y no pisan nada.
