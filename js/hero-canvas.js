// =====================================================
// hero-canvas.js — Isometric cube mountain for hero
// Cubes of 16×8px each, grey architectural palette.
// Mouse within MOUSE_R px: cubes rise + illuminate.
// =====================================================
(function () {
    'use strict';

    // ── Config ─────────────────────────────────────
    const CW       = 16;    // cube face width  (px)
    const CH       = 8;     // cube face height (px)  — 2:1 ratio = classic iso
    const HW       = CW / 2;
    const HH       = CH / 2;
    const MOUSE_R  = 90;    // interaction radius (px)
    const LIFT     = 5;     // max extra height from mouse
    const LERP     = 0.12;  // smoothing factor (0 = no anim, 1 = instant)

    let canvas, ctx, W, H, G;
    let cubes = [];
    let mouseX = -9999, mouseY = -9999;
    let raf = null;

    // ── Deterministic noise ────────────────────────
    function hash(x, y) {
        const s = Math.sin(x * 113.9 + y * 79.233) * 43758.5453;
        return s - Math.floor(s);
    }

    // ── Mountain height at grid cell (c, r) ───────
    // Returns 0 = no cube, 1-8 = stack height
    function baseHeight(c, r) {
        const nc = c / G - 0.5;   // -0.5 → 0.5
        const nr = r / G - 0.5;
        // Elliptical mountain peak at grid center
        const d  = Math.sqrt(nc * nc * 2.2 + nr * nr * 1.6);
        const peak = Math.max(0, 1 - d * 1.7) * 8;
        // Subtle terrain ridge along the whole row span
        const ridge = Math.max(0, 0.28 - Math.abs(nr) * 1.8) * 2.5;
        // Noise variation
        const n = (hash(c, r) * 2 - 1) * 1.4;
        return Math.max(0, Math.round(peak + ridge + n));
    }

    // ── Isometric grid → screen (sx, sy = ground center) ─
    function gridToScreen(c, r) {
        // Mountain center (G/2, G/2) maps to screen (W/2, H*0.72)
        const ox = W / 2;
        const oy = H * 0.72 - G * HH;
        return {
            x: (c - r) * HW + ox,
            y: (c + r) * HH + oy,
        };
    }

    // ── Build cube array ───────────────────────────
    function buildCubes() {
        cubes = [];
        // Grid size: enough to fill viewport in iso + margin
        G = Math.ceil(Math.max(W, H) / HW * 0.72) + 8;

        for (let r = 0; r < G; r++) {
            for (let c = 0; c < G; c++) {
                const h = baseHeight(c, r);
                if (h === 0) continue;

                const { x, y } = gridToScreen(c, r);

                // Viewport cull with margin
                if (x < -CW * 3 || x > W + CW * 3)     continue;
                if (y - h * CH < -CH * 14 || y > H + CH) continue;

                cubes.push({
                    c, r,
                    bh: h,      // base height (static)
                    lift: 0,    // animated lift from mouse (lerped)
                    lit: 0,     // illumination 0-1 (lerped)
                    sx: x,
                    sy: y,
                });
            }
        }

        // Painter's algorithm: draw back→front (low c+r first)
        cubes.sort((a, b) => (a.c + a.r) - (b.c + b.r));
    }

    // ── Draw one isometric cube ────────────────────
    // (sx, sy) = ground center,  totalH = bh + lift
    function drawCube(sx, sy, totalH, lit) {
        const topY = sy - totalH * CH;

        // Grey architectural palette — slight blue-grey (concrete)
        const tL = Math.round(30 + lit * 38);  // top face:   lighter
        const lL = Math.round(14 + lit * 22);  // left face:  darkest
        const rL = Math.round(22 + lit * 28);  // right face: medium

        // ── Top face (diamond) ──
        ctx.beginPath();
        ctx.moveTo(sx,       topY);
        ctx.lineTo(sx + HW,  topY + HH);
        ctx.lineTo(sx,       topY + CH);
        ctx.lineTo(sx - HW,  topY + HH);
        ctx.closePath();
        ctx.fillStyle = `hsl(210,8%,${tL}%)`;
        ctx.fill();

        // ── Left face (goes from top face down to ground) ──
        ctx.beginPath();
        ctx.moveTo(sx - HW, topY + HH);
        ctx.lineTo(sx,      topY + CH);
        ctx.lineTo(sx,      sy   + CH);
        ctx.lineTo(sx - HW, sy   + HH);
        ctx.closePath();
        ctx.fillStyle = `hsl(210,8%,${lL}%)`;
        ctx.fill();

        // ── Right face ──
        ctx.beginPath();
        ctx.moveTo(sx,      topY + CH);
        ctx.lineTo(sx + HW, topY + HH);
        ctx.lineTo(sx + HW, sy   + HH);
        ctx.lineTo(sx,      sy   + CH);
        ctx.closePath();
        ctx.fillStyle = `hsl(210,8%,${rL}%)`;
        ctx.fill();
    }

    // ── Animation loop ─────────────────────────────
    function tick() {
        // Black background
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, W, H);

        for (const cb of cubes) {
            // Measure distance from mouse to top-center of this cube
            const topCenterY = cb.sy - cb.bh * CH;
            const dx   = mouseX - cb.sx;
            const dy   = mouseY - topCenterY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            const inf = Math.max(0, 1 - dist / MOUSE_R);

            // Smooth lerp
            cb.lift += (inf * LIFT - cb.lift) * LERP;
            cb.lit  += (inf        - cb.lit)  * LERP;

            drawCube(cb.sx, cb.sy, cb.bh + cb.lift, cb.lit);
        }

        raf = requestAnimationFrame(tick);
    }

    // ── Init / resize ──────────────────────────────
    function setup() {
        const hero = document.getElementById('home');
        if (!hero) return;

        if (!canvas) {
            canvas = document.createElement('canvas');
            Object.assign(canvas.style, {
                position:      'absolute',
                top:           '0',
                left:          '0',
                width:         '100%',
                height:        '100%',
                display:       'block',
                zIndex:        '0',
                pointerEvents: 'none',
            });
            // Insert behind all hero children
            hero.insertBefore(canvas, hero.firstChild);
            ctx = canvas.getContext('2d');

            // Mouse tracking on the hero (canvas is pointer-events:none so events bubble up)
            hero.addEventListener('mousemove', e => {
                const rect = hero.getBoundingClientRect();
                mouseX = e.clientX - rect.left;
                mouseY = e.clientY - rect.top;
            }, { passive: true });

            hero.addEventListener('mouseleave', () => {
                mouseX = -9999;
                mouseY = -9999;
            });
        }

        W = canvas.width  = hero.offsetWidth  || window.innerWidth;
        H = canvas.height = hero.offsetHeight || window.innerHeight;

        if (raf) { cancelAnimationFrame(raf); raf = null; }
        buildCubes();
        tick();
    }

    // Debounced resize handler
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(setup, 200);
    }, { passive: true });

    // Boot
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setup);
    } else {
        setup();
    }
}());
