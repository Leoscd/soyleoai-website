# Premium Frontend Designer — Project Memory
# SoyLeoAI.com / ia-arquitectos-website

## CSS Custom Properties (styles-v2.css)
```
--color-black: #0a0a0a
--color-white: #ffffff
--color-accent: #FFDD00          (yellow — brand primary)
--color-accent-hover: #FFCC00
--color-gray-100 through --color-gray-900: light scale (legacy, now only used in modal)
--font-display: 'Space Grotesk', sans-serif
--font-body: 'Inter', sans-serif
--transition / --transition-slow: cubic-bezier(0.4, 0, 0.2, 1)

/* Dark theme tokens (added March 2026) */
--color-surface: #1a1a1a        card/panel backgrounds
--color-surface-2: #242424      hover state of cards
--color-text-primary: #f0f0f0   main body text
--color-text-secondary: rgba(255,255,255,0.65)  muted text
--color-border: rgba(255,255,255,0.08)  subtle borders
```

## Key File Paths
- `/home/leodiazdt/ia-arquitectos-website/index.html` — main landing page (~1011 lines as of March 2026)
- `/home/leodiazdt/ia-arquitectos-website/css/styles-v2.css` — all styles (~2561 lines as of March 2026)
- `/home/leodiazdt/ia-arquitectos-website/js/main-v2.js` — all JS (~694 lines; initQphExpand replaced by initQphLightbox)
- `/home/leodiazdt/ia-arquitectos-website/data/testimonials.json` — 6 real testimonials

## Dark Theme (applied March 2026 — branch feature/vanta-hero)
- body: `background: #0f0f0f`, `color: var(--color-text-primary)`
- Navbar scrolled: `rgba(15,15,15,0.95)` + `backdrop-filter: blur(16px)` — DARK not white
- Logo typographic `.logo-text` always white (dark bg in both nav states)
- sobre-mi: `background: #0f0f0f`; consultoria: `background: #141414`; testimonios: `background: #0f0f0f`
- Cards: `--color-surface` + `--color-border`; text: `--color-text-secondary`
- `.testimonial-card--highlight`: `background: #1f1d10` (warm dark); yellow left border
- Form select: `background-color: #1a1a1a`, dark options
- Sections with image overlays (#curso, #empresas): unchanged, already dark

## Hero Structure (index.html — updated March 2026)
```
<section id="home" class="hero-fullscreen">   ← VANTA.NET renders here
    <div class="hero-bg hero-bg--hidden"></div>
    <div class="hero-overlay"></div>
    <div class="hero-light-point"></div>       ← yellow radial glow orb
    <div class="hero-content-center">
        <h1 class="hero-title-large">
            El arquitecto que usa IA<br>
            no compite por precio. Lidera el
            <span class="word-swap" data-word-a="mercado" data-word-b="futuro">mercado</span>.
        </h1>
        <p class="hero-tagline">Con IA, el límite es tu imaginación.</p>
        <p class="hero-subtitle-large">Automatizá. Presentá. Ganás proyectos.</p>
    </div>
</section>
```

## Word Swap (.word-swap) — FINAL corrected version (March 2026)
- HTML: FLAT single span, NO child elements (__text/__curtain were causing vertical misalignment)
- CSS: `display: inline` (NOT inline-block) — this is what fixes baseline alignment with h1
- Resting: `color: #ffffff`. Active (`.is-active`): `color: var(--color-accent)` (#FFDD00)
- Wipe animation: `@keyframes wipe-reveal` — `from { clip-path: inset(100% 0 0 0) }` → `to { clip-path: inset(0% 0 0 0) }`
  - CRITICAL: first value of inset() is TOP. inset(100% 0 0 0) = fully clipped from above = word hidden
  - inset(0% 0 0 0) = fully visible. This creates a TOP-TO-BOTTOM reveal (curtain drops away downward)
  - WRONG (previous bug): `inset(0 0 100% 0)` — this clips from BOTTOM, reveals bottom-to-top (inverted)
- JS mouseenter sequence (ORDER MATTERS):
  1. `el.textContent = wordB` + `el.classList.add('is-active')` — text/color changes, still invisible via clip-path
  2. `void el.offsetWidth` — MANDATORY reflow; without this browser skips `from` keyframe state
  3. `el.classList.add('is-wiping')` — NOW the animation plays from hidden→visible
  4. setTimeout(350ms): remove `.is-wiping` so clip-path resets
- JS mouseleave: instant — `el.textContent = wordA`, remove `.is-active .is-wiping`, reset `busy = false`
- `busy` boolean prevents overlapping triggers during fast mouse moves
- `.hero-tagline`: muted (rgba 255,255,255,0.45), font-weight:300, sits between h1 and hero-subtitle-large
- NOTE: `.flip-word` CSS still exists in styles-v2.css but NO HTML uses it — do not re-add HTML
- REMOVED: all `__text`, `__curtain`, `.is-sweeping`, `.is-covering`, `.is-revealing` — these caused parpadeo and vertical misalignment
- ROOT CAUSE of original misalignment: `display:inline-block` + `overflow:hidden` on `.word-swap` pushed baseline down
- ROOT CAUSE of wipe not being visible: text + animation class added in same JS tick → browser batches them, skipping `from` frame

## Page Section Order (DOM order in index.html — updated March 2026)
1. `#home` (hero-fullscreen + VANTA.NET)
2. `#que-podes-hacer` (background #0f0f0f)
3. `#casos-de-exito` (background #141414)
4. `#como-funciona` (background #0f0f0f)
5. `#metricas-ia` (background #111111) ← NEW
6. `#sobre-mi` (background #0d0d0d, updated from #0f0f0f)
7. `#curso` (background image overlay)
8. `#consultoria` (background #141414)
9. `#empresas` (background image overlay)
10. `#testimonios` (background #111111, updated from #0f0f0f)
11. `#contacto`
12. `.ia-tools-section` (background #080808) ← NEW — before footer
13. footer

## "Lo que podés hacer" Section (updated March 2026)
- ID: `#que-podes-hacer`, class: `.qph-section` — NOW has background image (same URL as #curso)
- HTML structure: `<div class="qph-bg" style="background-image: url(...)">` + `<div class="qph-overlay">` BEFORE `.container-large`
- Position in DOM: after hero `</section>`, before `#casos-de-exito`
- Layout: `.qph-grid` 2-col desktop / 1-col mobile (breakpoint 768px)
- Card anatomy: `.qph-before` (border-right) | `.qph-arrow` | `.qph-after` — 3-col grid inside card
- Mobile: vertical stack, `.qph-before` gets border-bottom, arrow rotates 90deg
- Entrance: CSS `opacity:0 translateY(28px)` → `.qph-card--visible` via `initQphCards()` (IO, threshold 0.15)
- Stagger: `data-delay="0..3"` → CSS `transition-delay` per `.qph-card--visible[data-delay="N"]`
- `.qph-highlight`: color accent + font-weight:700; `.qph-ia-accent`: yellow on "IA" in title

## QPH Thumbnails + Lightbox (replaced Expand accordion — March 2026)
- REPLACED: `.qph-toggle` + `.qph-expand` accordion pattern is GONE from HTML, CSS, and JS
- NEW: `.qph-thumb` thumbnails sit directly inside cards 1/2/3; card 4 has no thumbnail (no media yet)
- `.qph-thumb` uses `grid-column: 1 / -1`, `aspect-ratio: 16/9`, `border-radius: 8px`, `overflow: hidden`
- `.qph-thumb__media`: img or video tag, `object-fit: cover`, `pointer-events: none`
- `.qph-thumb__overlay`: absolute inset, gradient scrim; `.qph-thumb__play` icon (opacity:0 at rest → 1 on hover with elastic scale)
- For video cards: `<video autoplay muted loop playsinline tabindex="-1" aria-hidden="true">` as the silent preview
- `.qph-thumb__caption`: `grid-column: 1 / -1`, italic, muted white
- `role="button"` + `tabindex="0"` + `aria-label` on `.qph-thumb` for keyboard/screen-reader access
- On hover: `scale(1.02)` on `.qph-thumb`, icon pops in with `cubic-bezier(0.34,1.56,0.64,1)` elastic
- Mobile: hover scale disabled (`transform:none`), icon always partially visible (`opacity:0.75`)
- Lightbox: `#qph-lightbox` — `position:fixed; inset:0; z-index:9999`; hidden via `opacity:0 + pointer-events:none`
- Lightbox open: `.is-open` class → `opacity:1 + pointer-events:auto`; inner panel `scale(0.94→1)` on open
- `.qph-lightbox__backdrop`: `rgba(0,0,0,0.92)`, click closes lightbox
- `.qph-lightbox__close`: fixed top:20px right:24px, 44px circle, rotates 90° on hover
- `initQphLightbox()` replaces `initQphExpand()` — called from DOMContentLoaded
- JS: `openLightbox(thumb)` injects `<img>` or `<video controls autoplay>` into `#qph-lightbox-media`
- JS: on close — pauses and clears lightbox video; resumes thumbnail autoplay via `.play().catch()`
- ESC closes lightbox via its own keydown listener (no conflict with existing ESC handler for menu/modal)
- Media files expected: `images/casos/pilar-propuesta.jpg`, `santiago-honorarios.mp4`, `santiago-web.mp4`

## Casos de Éxito Section (added March 2026)
- ID: `#casos-de-exito`, class: `.casos-section`, background `#141414`
- Two full-width case cards: `.caso-card` with `border-radius:16px`, `background: var(--color-surface)`
- Card anatomy: `.caso-card__meta` (pill label) + `.caso-card__body` (2-col grid)
- `.caso-card__body`: `grid-template-columns: 1fr 1fr`, gap 48px — copy | media
- `.caso-card__body--reversed`: uses `direction: rtl` to flip column order (Pilar's card — media left)
  - Children must reset with `direction: ltr` to avoid RTL text rendering
  - Mobile: reset to `direction: ltr` with `.caso-card__copy { order: -1 }` to ensure copy-first
- `.caso-pill`: yellow pill label, `background: rgba(255,221,0,0.08)`, `border-radius: 100px`
- `.caso-logro-item`: flex row, `.caso-logro-icon` in yellow `--color-accent`
- `.caso-quote`: `border-left: 3px solid var(--color-accent)`, padding-left 20px
- `.caso-resultado`: inline-flex pill with yellow badge — shows "2 días → 1 tarde"
- `.caso-thumb`: `.qph-thumb` subclass, `grid-column: unset`, `margin-top: 0`
- `.caso-thumb--single`: `aspect-ratio: 4/3` (taller crop for document image)
- Entrance: `initCasoCards()` — IO threshold 0.12, adds `.caso-card--visible`
- Stagger: nth-child(2) gets `transition-delay: 150ms`

## Cómo Funciona Section (added March 2026)
- ID: `#como-funciona`, class: `.como-funciona-section`, background `#0f0f0f`
- 3-block grid: `.cf-grid` — `grid-template-columns: repeat(3, 1fr)`, gap 28px desktop
- Tablet (max 1024px): 2-col; 3rd block `grid-column: 1/-1`, max-width 480px centered
- Mobile: 1-col, gap 20px
- `.cf-block`: `border-top: 2px solid var(--color-accent)` (yellow top stripe), `border-radius: 0 0 16px 16px`
- `.cf-block__icon`: 48px flex container, color `--color-accent`
- `.cf-block__tag`: small pill, `background: rgba(255,221,0,0.1)`, yellow text
- Entrance: `initCfBlocks()` — IO threshold 0.15, adds `.cf-block--visible`
- Stagger: nth-child(1/2/3) → `transition-delay: 0/110/220ms`
- CTA: `.cf-cta` centered flex column; button has class `open-curso-modal` (binds at script load via defer)

## Hero Light Orb (.hero-light-point)
- position: absolute; top:-10%; right:10%; 600px circle
- radial-gradient: rgba(255,221,0,0.12) → rgba(255,180,0,0.06) → transparent
- `lightPulse` 6s ease-in-out: scales 1→1.15, opacity 0.7→1
- Mobile: 300px, top:-5%, right:-10%
- `prefers-reduced-motion`: animation:none

## Navbar Logo
- Old: `<img src="images/logo.png">` — REMOVED
- New: `<span class="logo-text">LEO <span class="logo-accent">IA</span></span>`
- `.logo-text`: white always (dark bg both states); `.logo-accent`: yellow always

## Testimonios Carousel
- CSS marquee (`marquee-scroll` keyframe on `.testimonios-track`), not JS slider
- Cards: 380px desktop, 300px mobile; `.carousel-controls` hidden
- Pilar Cichero: `highlight:true` → `.testimonial-card--highlight` (dark warm bg + yellow border)
- No-photo cards: `.testimonial-photo-placeholder` (52px, black bg, yellow initials)

## Section Glow Border System (TAREA 1 — March 2026)
- Pattern applied to: `.qph-section`, `.casos-section`, `.como-funciona-section`, `.metricas-section`, `.sobre-mi-section`, `.testimonios-section`, `.contacto-section`, `.consultoria-section`
- All set `position: relative`
- `::before`: `height: 1px`, linear-gradient 90deg with `rgba(255,221,0,0.12)` at 50% — luminous top edge
- `::after`: large radial ellipse `top:-100px left:50%`, `rgba(255,221,0,0.035)→transparent` — diffuse glow
- All direct children get `position: relative; z-index: 1` so they float above pseudo-elements
- Sections with image overlays (`.curso-preview-section`, `.empresas-section`) excluded — already dark
- Background rhythm: qph #0f0f0f → casos #141414 → como #0f0f0f → metricas #111111 → sobre-mi #0d0d0d → testimonios #111111

## Métricas IA Section (#metricas-ia — March 2026)
- ID: `#metricas-ia`, class: `.metricas-section`, background `#111111`
- Position: after `#como-funciona`, before `#sobre-mi`
- Grid: `.metricas-grid` 2x2 desktop / 1-col mobile (breakpoint 768px)
- Card: `.metrica-card` — `border-top: 2px solid transparent` at rest; hover: `rgba(255,221,0,0.5)` + yellow box-shadow
- Card icon: `.metrica-card__icon` — 44px rounded square, `rgba(255,221,0,0.08)` bg, yellow stroke icon
- Chart area: `.metrica-card__chart` — `height: 80px`, `border-top: 1px solid rgba(255,255,255,0.05)` separator
- Card 1 chart: SVG line chart (polyline + area fill + endpoint dot) — trending up pattern
- Card 2 chart: SVG bar chart — gray "before" bars + yellow "after" bars
- Card 3 chart: SVG flow diagram — 3 yellow circle nodes connected by dashed lines + arrows
- Card 4 chart: `.metrica-chart-terminal` div — dark box simulating terminal output, 3 text lines
  - `.--prompt` (yellow), `.--response` (soft green rgba(180,240,180,0.75)), `.--muted` (dim white)
- Entrance: `initMetricaCards()` — IO threshold 0.15, adds `.metrica-card--visible`
- Stagger: nth-child(1-4) → `transition-delay: 0/120/240/360ms`

## IA Tools Marquee Section (updated March 2026)
- Class: `.ia-tools-section` — appears TWICE in HTML (before AND after `#como-funciona`)
- Second instance uses `<div class="ia-tools-track" id="ia-tools-track-2"></div>` (populated by JS)
- Background: `var(--color-bg, #0f0f0f)` — matches body; `border-top` AND `border-bottom: 1px solid var(--color-border)`
- Padding: `28px 0` — compact band (NOT 48px)
- Label: `.ia-tools-label` — `display: none` (hidden — design decision)
- Wrapper: `.ia-tools-marquee` — `overflow:hidden`, edge fade with `mask-image` 10%→90%
- Track: `.ia-tools-track` — `display: inline-flex`, `width:max-content`, `@keyframes ia-tools-scroll` 20s
  - keyframe: `from translateX(0)` → `to translateX(-50%)`
  - IMPORTANT: `display: inline-flex` (not flex) + `white-space: nowrap`
- Badge: `.ia-tool-badge` — text-only, NO pill: `background: none; border: none; border-radius: 0`
  - `padding: 0 48px` — wide spacing creates separation without visible borders
  - Font: Space Grotesk 1rem (16px), uppercase, `color: rgba(255,255,255,0.3)`
  - Hover: `color: rgba(255,255,255,0.7)`
  - `::before { content: none }` — NO yellow dot (removed by design)
- JS: `initIaToolsMarquee()` — clones 7 originals in track1, copies track1.innerHTML into track2
- `prefers-reduced-motion`: `flex-wrap:wrap`, `width:auto`, `white-space:normal`, `gap:16px`

## Marquee Loop Fix Pattern (critical)
For ANY marquee to loop smoothly without jump:
1. Track must have EXACTLY 2 identical sets of items
2. Track must have `width: max-content` (crucial — without it, -50% doesn't equal one full set)
3. Track must use `display: inline-flex` (or `flex` with `width:max-content` — same result)
4. Animation: `from { transform: translateX(0) }` → `to { transform: translateX(-50%) }`
5. The reset from -50% back to 0 is invisible because visually it looks identical

## Image Background Sections (consistent pattern)
Sections with bg image: `.qph-section`, `.recursos-section`, `.curso-preview-section`, `.empresas-section`
All follow the same 3-layer z-index stack:
- `.xxx-bg` — `position:absolute; inset:0; z-index:0; background-size:cover; background-attachment:fixed; filter:brightness(0.2) saturate(0.4)`
- `.xxx-overlay` — `position:absolute; inset:0; z-index:1; background: linear-gradient(180deg, ...)`
- `.container-large` — `position:relative; z-index:2`
IMPORTANT: Do NOT include these sections in the generic `section > * { z-index:1 }` rule — it overrides the bg/overlay z-indices
Mobile fix: `background-attachment: scroll` (iOS does not support `fixed`)

## Key File Sizes (updated March 2026 after session)
- `index.html` ~1130 lines
- `css/styles-v2.css` ~2900+ lines
- `js/main-v2.js` ~755 lines

## Common Pitfalls
- logo.png is GONE from navbar — use `.logo-text` span only
- Navbar scrolled is DARK — logo and button are always white text
- `.testimonial-card--highlight` is `#1f1d10` (not the old `#f9f7e8`)
- `.form-field select` bg is `#1a1a1a` (not white)
- Old `.testimonios-grid` class gone — do not re-add
- `loadTestimonials()` must run before any carousel init
- `.flip-word` CSS in styles-v2.css is inert (no HTML uses it) — do not re-add the HTML markup
- `.word-swap` MUST be `display:inline` — any `inline-block` + `overflow:hidden` causes vertical misalignment in h1
- `.word-swap` has NO child elements — no `__text`, no `__curtain` — JS operates on `el.textContent` directly
- Old `__curtain` approach (translateY wipe) caused parpadeo; replaced with `clip-path: inset()` animation
- Old `.is-sweeping`, `.is-covering`, `.is-revealing` are fully removed — do not re-introduce them
