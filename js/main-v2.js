// ===========================
// VERSIÓN ACTUALIZADA - 28 OCT 2025
// ===========================
console.log('🚀 main-v2.js cargado correctamente - Versión 28-OCT con cache-busting mejorado para testimonios reales');

// ===========================
// Overlay Menu Toggle
// ===========================
const menuToggle = document.getElementById('menu-toggle');
const overlayMenu = document.getElementById('overlay-menu');
const closeMenu = document.getElementById('close-menu');
const menuLinks = document.querySelectorAll('.menu-link');

menuToggle.addEventListener('click', () => {
    overlayMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
});

closeMenu.addEventListener('click', () => {
    overlayMenu.classList.remove('active');
    document.body.style.overflow = '';
});

menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        overlayMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ===========================
// Modal del Curso
// ===========================
const modalCurso = document.getElementById('modal-curso');
const openCursoButtons = document.querySelectorAll('.open-curso-modal');
const closeCursoModal = document.getElementById('close-curso-modal');
const modalOverlay = modalCurso.querySelector('.modal-overlay');

openCursoButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        modalCurso.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

closeCursoModal.addEventListener('click', () => {
    modalCurso.classList.remove('active');
    document.body.style.overflow = '';
});

modalOverlay.addEventListener('click', () => {
    modalCurso.classList.remove('active');
    document.body.style.overflow = '';
});

// Cerrar con ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        overlayMenu.classList.remove('active');
        modalCurso.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ===========================
// Smooth Scroll
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offset = 0;
                const targetPosition = target.offsetTop - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ===========================
// Cargar Testimonios
// ===========================
async function loadTestimonials() {
    try {
        // Agregar timestamp + random para forzar recarga sin caché
        const cacheBuster = new Date().getTime() + Math.random();
        const response = await fetch(`data/testimonials.json?v=${cacheBuster}`, {
            cache: 'no-store', // Forzar no usar caché
            headers: {
                'Cache-Control': 'no-cache'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const testimonials = await response.json();
        console.log('✅ Testimonios REALES cargados correctamente:', testimonials);

        const container = document.getElementById('testimonios-container');
        container.innerHTML = ''; // Limpiar contenedor

        testimonials.forEach((testimonial, index) => {
            const card = createTestimonialCard(testimonial, index);
            container.appendChild(card);
        });

        // Duplicar cards para loop infinito del marquee
        initMarquee();

    } catch (error) {
        console.error('❌ Error cargando testimonios:', error);
        loadPlaceholderTestimonials();
    }
}

function createTestimonialCard(testimonial, index) {
    const card = document.createElement('div');

    // Base class + highlight variant for featured testimonials (e.g. Pilar Cichero)
    let cardClass = 'testimonial-card';
    if (testimonial.highlight === true) {
        cardClass += ' testimonial-card--highlight';
    }
    card.className = cardClass;
    card.style.animationDelay = `${index * 0.1}s`;

    // Photo or initials placeholder (black circle, yellow text)
    const photoHTML = testimonial.photo
        ? `<img src="${testimonial.photo}" alt="${testimonial.name}" class="testimonial-photo" loading="lazy">`
        : `<div class="testimonial-photo-placeholder">${getInitials(testimonial.name)}</div>`;

    const starsHTML = generateStars(testimonial.rating || 5);

    // Order: header → rating → text (rating before text for better visual hierarchy)
    card.innerHTML = `
        <div class="testimonial-header">
            ${photoHTML}
            <div class="testimonial-info">
                <h4>${testimonial.name}</h4>
                <p class="testimonial-role">${testimonial.role}</p>
            </div>
        </div>
        <div class="testimonial-rating">
            ${starsHTML}
        </div>
        <p class="testimonial-text">"${testimonial.text}"</p>
    `;

    return card;
}

function getInitials(name) {
    return name
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

function generateStars(rating) {
    let stars = '';
    for (let i = 0; i < 5; i++) {
        stars += `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="${i < rating ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
        `;
    }
    return stars;
}

// ===========================
// Marquee — loop infinito (la animación la maneja CSS)
// ===========================
function initMarquee() {
    const track = document.getElementById('testimonios-container');
    if (!track || track.children.length === 0) return;

    // Clonar todas las cards originales y appendearlas al final.
    // La animación CSS mueve el track -50% → exactamente un set completo.
    const originals = Array.from(track.children);
    originals.forEach(card => {
        const clone = card.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
    });
}

function loadPlaceholderTestimonials() {
    const placeholderData = [
        {
            name: "María González",
            role: "Arquitecta Independiente",
            text: "El curso transformó completamente mi forma de trabajar. Ahora puedo generar conceptos iniciales en minutos y dedicar más tiempo al diseño creativo.",
            rating: 5
        },
        {
            name: "Carlos Martínez",
            role: "Director, Estudio AM Arquitectos",
            text: "Implementamos IA en nuestro flujo de trabajo y los resultados son increíbles. Reducimos tiempos de presentación en un 60%.",
            rating: 5
        },
        {
            name: "Ana López",
            role: "Arquitecta Senior",
            text: "Leo tiene un don para explicar conceptos complejos de manera simple. Ahora uso IA diariamente en mis proyectos.",
            rating: 5
        }
    ];

    const container = document.getElementById('testimonios-container');
    placeholderData.forEach((testimonial, index) => {
        const card = createTestimonialCard(testimonial, index);
        container.appendChild(card);
    });

    initMarquee();
}

// ===========================
// Formulario de Contacto - Web3Forms (fetch API)
// ===========================
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const formMessage = document.getElementById('form-message');

// --- Validación client-side ---
function validateForm(formData) {
    const name = formData.get('name') ? formData.get('name').trim() : '';
    const email = formData.get('email') ? formData.get('email').trim() : '';
    const service = formData.get('service') ? formData.get('service').trim() : '';
    const message = formData.get('message') ? formData.get('message').trim() : '';

    if (!name) {
        return 'Por favor ingresá tu nombre completo.';
    }
    if (!email) {
        return 'Por favor ingresá tu email.';
    }
    // Validación básica de formato email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'Por favor ingresá un email válido.';
    }
    if (!service) {
        return 'Por favor seleccioná un servicio de interés.';
    }
    if (!message) {
        return 'Por favor escribí un mensaje.';
    }
    return null; // null = sin errores
}

// --- Mostrar mensaje de estado ---
function showFormMessage(type, text) {
    formMessage.className = 'form-message form-message--' + type;
    formMessage.textContent = text;
    formMessage.style.display = 'block';
    // Scroll suave al mensaje
    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideFormMessage() {
    formMessage.style.display = 'none';
    formMessage.className = 'form-message';
    formMessage.textContent = '';
}

// --- Submit handler con fetch ---
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideFormMessage();

        const formData = new FormData(contactForm);

        // Validación client-side
        const validationError = validateForm(formData);
        if (validationError) {
            showFormMessage('error', validationError);
            return;
        }

        // Estado: loading
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;
        submitBtn.classList.add('btn--loading');

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Estado: éxito
                showFormMessage('success', '¡Mensaje enviado correctamente! Me pondre en contacto con vos pronto.');
                contactForm.reset();
                submitBtn.textContent = 'Mensaje enviado';
                // Restaurar botón después de 4 segundos
                setTimeout(() => {
                    submitBtn.textContent = 'Enviar mensaje';
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('btn--loading');
                }, 4000);
            } else {
                throw new Error(data.message || 'Error al enviar');
            }

        } catch (error) {
            console.error('Error al enviar formulario Web3Forms:', error);
            // Estado: error
            showFormMessage('error', 'Hubo un error al enviar. Por favor intentá de nuevo o escribinos directamente a leodiazdt@gmail.com');
            submitBtn.textContent = 'Enviar mensaje';
            submitBtn.disabled = false;
            submitBtn.classList.remove('btn--loading');
        }
    });
}

// ===========================
// Parallax en Hero
// ===========================
window.addEventListener('scroll', () => {
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        const scrolled = window.pageYOffset;
        heroBg.style.transform = `translateY(${scrolled * 0.5}px) scale(1.1)`;
    }
});

// ===========================
// Intersection Observer para Animaciones
// ===========================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar elementos animables
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.consultoria-card, .empresa-card, .testimonial-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });

});

// ===========================
// Navbar Scroll Effect — transparente en hero, blanca al scrollear
// ===========================
const navbar = document.querySelector('.navbar-minimal');
const heroThreshold = window.innerHeight * 0.6;

window.addEventListener('scroll', () => {
    if (window.pageYOffset > heroThreshold) {
        navbar.classList.add('navbar-scrolled');
    } else {
        navbar.classList.remove('navbar-scrolled');
    }
}, { passive: true });

// ===========================
// Word Swap — "mercado" ↔ "futuro" clip-path wipe
//
// Simplified version: operates directly on the .word-swap span,
// which is display:inline. No child __text/__curtain elements.
// clip-path inset(0 0 100%→0% 0) creates a top-to-bottom reveal.
//
// mouseenter (showing wordA):
//   1. Swap text to wordB immediately (will be hidden by clip-path)
//   2. Add .is-active (turns text yellow) + .is-wiping (wipe animation)
//   3. After 350ms remove .is-wiping so clip-path resets cleanly
//
// mouseleave (showing wordB):
//   Instant — swap text back to wordA, remove .is-active
//   No animation on exit
//
// busy flag prevents overlapping triggers on rapid mouse moves.
// ===========================
function initWordSwap() {
    const el = document.querySelector('.word-swap');
    if (!el) return;

    const wordA = el.dataset.wordA;   // "mercado"
    const wordB = el.dataset.wordB;   // "futuro"
    if (!wordA || !wordB) return;

    // WIPE_DURATION must match @keyframes wipe-down duration in CSS
    const WIPE_DURATION = 350;

    let busy = false;

    el.addEventListener('mouseenter', () => {
        // Only trigger when showing wordA and not mid-animation
        if (busy || el.classList.contains('is-active')) return;
        busy = true;

        // 1. Swap text + activate yellow colour FIRST (hidden by clip-path initial state)
        el.textContent = wordB;
        el.classList.add('is-active');

        // 2. Force reflow so the browser registers the "from" keyframe state
        //    before the animation class is applied. Without this, the browser
        //    may skip the initial clip-path: inset(100% 0 0 0) state entirely.
        void el.offsetWidth;

        // 3. Now add the wipe class — browser animates from hidden → visible
        el.classList.add('is-wiping');

        // Remove wipe class once animation completes so clip-path resets
        setTimeout(() => {
            el.classList.remove('is-wiping');
            busy = false;
        }, WIPE_DURATION);
    });

    el.addEventListener('mouseleave', () => {
        // Only act when showing wordB
        if (!el.classList.contains('is-active')) return;
        // Instant: no animation — swap text and colour back
        el.textContent = wordA;
        el.classList.remove('is-active', 'is-wiping');
    });
}

// ===========================
// "Lo que podés hacer" Section — IntersectionObserver entrance
// Cards start at opacity:0 translateY(28px) via CSS.
// Observer adds .qph-card--visible when they cross 15% threshold.
// Stagger delays are encoded via data-delay attribute on each card.
// ===========================
function initQphCards() {
    const cards = document.querySelectorAll('.qph-card');
    if (!cards.length) return;

    // Skip animation for users who prefer reduced motion (CSS also handles this,
    // but the observer still needs to make cards visible immediately)
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('qph-card--visible');
                observer.unobserve(entry.target); // Animate once
            }
        });
    }, { threshold: 0.15 });

    cards.forEach(card => {
        if (prefersReduced) {
            // Make visible immediately with no transition
            card.classList.add('qph-card--visible');
        } else {
            observer.observe(card);
        }
    });
}

// ===========================
// "Lo que podés hacer" — QPH Lightbox
//
// Clicking a `.qph-thumb` opens the single `#qph-lightbox` overlay,
// injecting either an <img> or a <video controls> into its media wrap.
//
// For video thumbnails: the silent autoplay preview is paused while the
// lightbox is open; the lightbox video has full controls and sound.
//
// Closing: X button, backdrop click, or ESC key.
// Accessibility: role="dialog" + aria-modal on the overlay element;
// focus is trapped to the close button while open.
// ===========================
function initQphLightbox() {
    const lightbox     = document.getElementById('qph-lightbox');
    const mediaWrap    = document.getElementById('qph-lightbox-media');
    const closeBtn     = document.getElementById('qph-lightbox-close');
    const backdrop     = lightbox ? lightbox.querySelector('.qph-lightbox__backdrop') : null;

    if (!lightbox || !mediaWrap || !closeBtn || !backdrop) return;

    // Track which thumbnail video is currently playing (to restore on close)
    let activeThumbnailVideo = null;
    // Track the element that triggered open (for focus restoration on close)
    let openerElement = null;

    // ── Open lightbox ──
    function openLightbox(thumb) {
        const type = thumb.dataset.lightboxType;    // "image" | "video"
        const src  = thumb.dataset.lightboxSrc;
        const alt  = thumb.dataset.lightboxAlt || '';

        // Clear any previous media
        mediaWrap.innerHTML = '';

        if (type === 'image') {
            const img = document.createElement('img');
            img.src = src;
            img.alt = alt;
            mediaWrap.appendChild(img);
        } else if (type === 'video') {
            const video = document.createElement('video');
            video.src = src;
            video.controls = true;
            video.playsinline = true;
            video.autoplay = true;
            // Accent-coloured controls where supported
            mediaWrap.appendChild(video);
        }

        // Pause the silent thumbnail video while lightbox is open
        activeThumbnailVideo = thumb.querySelector('video');
        if (activeThumbnailVideo) {
            activeThumbnailVideo.pause();
        }

        // Record opener for focus restoration
        openerElement = thumb;

        // Show overlay — CSS transition handles fade + scale
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        // Move focus to close button
        closeBtn.focus();
    }

    // ── Close lightbox ──
    function closeLightbox() {
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';

        // Pause and discard lightbox video to release memory
        const lightboxVideo = mediaWrap.querySelector('video');
        if (lightboxVideo) {
            lightboxVideo.pause();
            lightboxVideo.src = '';
        }
        mediaWrap.innerHTML = '';

        // Resume the thumbnail autoplay
        if (activeThumbnailVideo) {
            activeThumbnailVideo.play().catch(() => {
                // Autoplay may be blocked on some browsers — silently ignore
            });
            activeThumbnailVideo = null;
        }

        // Restore focus to the element that opened the lightbox
        if (openerElement) {
            openerElement.focus();
            openerElement = null;
        }
    }

    // ── Bind thumbnail clicks (click + Enter/Space for keyboard) ──
    document.querySelectorAll('.qph-thumb').forEach(thumb => {
        thumb.addEventListener('click', () => openLightbox(thumb));

        // Keyboard activation (role="button" but native element is div)
        thumb.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(thumb);
            }
        });
    });

    // ── Close triggers ──
    closeBtn.addEventListener('click', closeLightbox);
    backdrop.addEventListener('click', closeLightbox);

    // ESC key — integrated with the existing ESC handler in this file
    // by checking lightbox state inside the document keydown listener
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('is-open')) {
            closeLightbox();
        }
    });
}

// ===========================
// Casos de Éxito — IntersectionObserver entrance
// .caso-card starts at opacity:0 translateY(32px) via CSS.
// Observer adds .caso-card--visible when 15% of card is in view.
// ===========================
function initCasoCards() {
    const cards = document.querySelectorAll('.caso-card');
    if (!cards.length) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('caso-card--visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    cards.forEach(card => {
        if (prefersReduced) {
            card.classList.add('caso-card--visible');
        } else {
            observer.observe(card);
        }
    });
}

// ===========================
// Cómo Funciona — IntersectionObserver entrance
// .cf-block starts at opacity:0 translateY(28px) via CSS.
// Observer adds .cf-block--visible when 15% of block is in view.
// ===========================
function initCfBlocks() {
    const blocks = document.querySelectorAll('.cf-block');
    if (!blocks.length) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('cf-block--visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    blocks.forEach(block => {
        if (prefersReduced) {
            block.classList.add('cf-block--visible');
        } else {
            observer.observe(block);
        }
    });
}


// ===========================
// IA Tools Marquee — loop infinito
// Duplica los badges del track para que la animación CSS sea continua.
// También puebla el segundo carrusel (#ia-tools-track-2) si existe.
// Sin pausa en hover: el carrusel es puramente decorativo.
// ===========================
function initIaToolsMarquee() {
    const track = document.getElementById('ia-tools-track');
    if (!track || track.children.length === 0) return;

    // Clonar todos los badges y appendearlos al final del track principal.
    // La animación CSS mueve el track -50% → exactamente un set completo.
    const originals = Array.from(track.children);
    originals.forEach(badge => {
        const clone = badge.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
    });

    // Poblar el segundo carrusel (inferior) si existe en el DOM.
    // Copia el HTML ya duplicado del track principal para el mismo loop infinito.
    const track2 = document.getElementById('ia-tools-track-2');
    if (track2) {
        track2.innerHTML = track.innerHTML;
        // Marcar todos los clones del segundo track como aria-hidden
        Array.from(track2.children).forEach(badge => {
            badge.setAttribute('aria-hidden', 'true');
        });
    }
}

// ===========================
// Inicialización
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    // Load 6 real testimonials from JSON and boot the carousel
    loadTestimonials();

    // Hero word-swap chip: "mercado" ↔ "futuro" curtain wipe
    initWordSwap();

    // "Lo que podés hacer" cards scroll-entrance
    initQphCards();

    // Casos de Éxito cards scroll-entrance
    initCasoCards();

    // Cómo Funciona blocks scroll-entrance
    initCfBlocks();

    // "Lo que podés hacer" lightbox — thumbnails → full-screen overlay
    // Note: initQphLightbox() binds to ALL .qph-thumb elements globally,
    // including the nuevos thumbnails in #casos-de-exito.
    initQphLightbox();

    // Métricas IA section — scroll-entrance para las 4 cards

    // IA Tools marquee — duplicar badges para loop infinito CSS
    initIaToolsMarquee();

    // Animación de entrada del hero
    setTimeout(() => {
        const heroContent = document.querySelector('.hero-content-center');
        if (heroContent) {
            heroContent.style.opacity = '1';
        }
    }, 100);

    // ── Precio toggle en modal del curso ──────────────────────────────
    (function initPrecioToggle() {
        const btn = document.getElementById('toggle-precio');
        const reveal = document.getElementById('precio-reveal');
        if (!btn || !reveal) return;

        btn.addEventListener('click', () => {
            const isOpen = btn.getAttribute('aria-expanded') === 'true';
            btn.setAttribute('aria-expanded', String(!isOpen));
            if (isOpen) {
                reveal.hidden = true;
            } else {
                reveal.hidden = false;
            }
        });
    })();

    // ── Modal de Skill Email ──────────────────────────────────────────
    (function initSkillEmailModal() {
        const modal    = document.getElementById('modal-skill-email');
        const closeBtn = document.getElementById('close-skill-modal');
        const overlay  = modal ? modal.querySelector('.modal-skill-overlay') : null;
        const form     = document.getElementById('skill-email-form');
        const nameField    = document.getElementById('skill-form-name');
        const linkField    = document.getElementById('skill-form-link');
        const subjectField = document.getElementById('skill-form-subject');
        const msgBox   = document.getElementById('skill-form-message');
        const submitBtn = document.getElementById('skill-form-btn');

        if (!modal) return;

        // Abrir modal desde botones de skill
        document.querySelectorAll('[data-drive]').forEach(btn => {
            btn.addEventListener('click', e => {
                e.preventDefault();
                const driveLink = btn.dataset.drive;
                // .rec-item es el contenedor nuevo de #recursos; .recurso-card era el viejo.
                const card = btn.closest('.rec-item, .recurso-card');
                const heading = card ? card.querySelector('h3') : null;
                const skillName = heading ? heading.textContent.trim() : 'Skill';

                // Pasar datos al form oculto
                nameField.value    = skillName;
                linkField.value    = driveLink;
                subjectField.value = `Nueva descarga: ${skillName} — SoyLeoAI`;

                // Actualizar título del modal
                modal.querySelector('.modal-skill-title').textContent = `Recibí "${skillName}" en tu email`;

                openSkillModal();
            });
        });

        function openSkillModal() {
            modal.classList.add('is-open');
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                const emailInput = document.getElementById('skill-email-input');
                if (emailInput) emailInput.focus();
            }, 400);
        }

        function closeSkillModal() {
            modal.classList.remove('is-open');
            document.body.style.overflow = '';
            // Reset form
            setTimeout(() => {
                form.reset();
                msgBox.hidden = true;
                msgBox.className = 'skill-form-message';
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Enviar skill a mi email <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>';
            }, 350);
        }

        closeBtn.addEventListener('click', closeSkillModal);
        overlay.addEventListener('click', closeSkillModal);
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && modal.classList.contains('is-open')) closeSkillModal();
        });

        // Submit — Web3Forms
        form.addEventListener('submit', async e => {
            e.preventDefault();

            const emailInput = document.getElementById('skill-email-input');
            if (!emailInput.value || !emailInput.validity.valid) {
                emailInput.focus();
                return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';
            msgBox.hidden = true;

            try {
                // Agregar campo message con el link para que Web3Forms lo incluya
                let messageInput = form.querySelector('[name="message"]');
                if (!messageInput) {
                    messageInput = document.createElement('input');
                    messageInput.type = 'hidden';
                    messageInput.name = 'message';
                    form.appendChild(messageInput);
                }
                messageInput.value = `Solicitud de descarga de skill:\n\nSkill: ${nameField.value}\nLink de descarga: ${linkField.value}\n\nEl usuario recibirá este link en su email.`;

                const formData = new FormData(form);
                const res = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });
                const data = await res.json();

                if (data.success) {
                    const dl = linkField.value;
                    const sn = nameField.value;
                    msgBox.hidden = false;
                    msgBox.className = 'skill-form-message success';
                    msgBox.innerHTML = `✓ ¡Gracias! Tu descarga está lista:<br><br><a href="${dl}" target="_blank" rel="noopener" style="color:#FFDD00;font-weight:700;text-decoration:underline;">Descargar ${sn} →</a><br><br><span style="font-size:0.8rem;opacity:0.6">Guardamos tu email para enviarte novedades.</span>`;
                    submitBtn.textContent = '¡Enviado!';
                } else {
                    throw new Error(data.message || 'Error al enviar');
                }
            } catch (err) {
                console.error('Error al enviar skill email:', err);
                msgBox.hidden = false;
                msgBox.className = 'skill-form-message error';
                msgBox.textContent = 'Hubo un error. Intentá de nuevo o escribinos a leodiazdt@gmail.com';
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Enviar skill a mi email <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>';
            }
        });
    })();

    // ── FAQ Accordion ──────────────────────────────────────────────
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const isOpen = btn.getAttribute('aria-expanded') === 'true';
            const answer = btn.nextElementSibling;

            // Cerrar todos los demás
            document.querySelectorAll('.faq-question[aria-expanded="true"]').forEach(other => {
                if (other !== btn) {
                    other.setAttribute('aria-expanded', 'false');
                    other.nextElementSibling.style.maxHeight = null;
                }
            });

            // Toggle este
            if (isOpen) {
                btn.setAttribute('aria-expanded', 'false');
                answer.style.maxHeight = null;
            } else {
                btn.setAttribute('aria-expanded', 'true');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // Auto-abrir modal del curso si se llega desde el blog
    if (sessionStorage.getItem('openCursoModal') === '1') {
        sessionStorage.removeItem('openCursoModal');
        setTimeout(() => {
            modalCurso.classList.add('active');
            document.body.style.overflow = 'hidden';
        }, 1200);
    }
});

// ═══════════════════════════════════════════════════════════════════
// ███  REDISEÑO 2026 — motor de animaciones
// ═══════════════════════════════════════════════════════════════════
//   initTerminals()    → tipea las consolas de #recursos, en loop
//   initCounters()     → cuenta 0 → N en las métricas del hero y #sobre-mi
//   initScrollReveal() → entrada desde abajo para [data-reveal]
// Todo respeta prefers-reduced-motion.
// ═══════════════════════════════════════════════════════════════════

const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;


// ─── Consolas de #recursos ─────────────────────────────────────────
// Cada .term reproduce su secuencia cuando entra en viewport y la
// repite en loop mientras siga visible. Las líneas con [data-type] se
// escriben carácter por carácter; el resto aparece de golpe.
function initTerminals() {
    const terminals = document.querySelectorAll('[data-term]');
    if (!terminals.length) return;

    terminals.forEach(term => {
        const lines = Array.from(term.querySelectorAll('.term__line'));
        if (!lines.length) return;

        // Guardamos el texto original: las líneas tipeadas se vacían al arrancar
        lines.forEach(line => { line.dataset.text = line.textContent; });

        // Reduced motion: mostramos todo estático y salimos
        if (prefersReducedMotion()) {
            term.classList.add('is-running');
            lines.forEach(line => line.classList.add('is-shown'));
            return;
        }

        let timers  = [];
        let visible = false;
        let running = false;

        const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };
        const wait = (ms, fn) => { timers.push(setTimeout(fn, ms)); };

        function reset() {
            lines.forEach(line => {
                line.classList.remove('is-shown', 'is-typing');
                if (line.hasAttribute('data-type')) line.textContent = '';
            });
        }

        // Tipeo con jitter para que no suene mecánico
        function typeLine(el, done) {
            const full = el.dataset.text;
            el.textContent = '';
            el.classList.add('is-shown', 'is-typing');
            let i = 0;

            (function step() {
                if (!visible) return;
                el.textContent = full.slice(0, ++i);
                if (i < full.length) {
                    wait(32 + Math.random() * 42, step);
                } else {
                    el.classList.remove('is-typing');
                    wait(280, done);
                }
            })();
        }

        function play(index) {
            if (!visible) return;

            // Fin de la secuencia: pausa y vuelve a empezar
            if (index >= lines.length) {
                wait(4200, () => { if (visible) start(); });
                return;
            }

            const el = lines[index];
            if (el.hasAttribute('data-type')) {
                typeLine(el, () => play(index + 1));
            } else {
                el.classList.add('is-shown');
                wait(300, () => play(index + 1));
            }
        }

        function start() {
            clearTimers();
            reset();
            running = true;
            term.classList.add('is-running');
            wait(220, () => play(0));
        }

        const io = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                visible = entry.isIntersecting;
                if (visible && !running) {
                    start();
                } else if (!visible) {
                    clearTimers();
                    running = false;
                }
            });
        }, { threshold: 0.4 });

        io.observe(term);
    });
}


// ─── Contadores numéricos ──────────────────────────────────────────
// <span data-count-to="50" data-count-suffix="+">50+</span>
function initCounters() {
    const counters = document.querySelectorAll('[data-count-to]');
    if (!counters.length) return;

    const reduced = prefersReducedMotion();

    const run = el => {
        const target   = parseFloat(el.dataset.countTo);
        const suffix   = el.dataset.countSuffix || '';
        const duration = 1400;
        const startTs  = performance.now();

        if (reduced || Number.isNaN(target)) {
            el.textContent = target + suffix;
            return;
        }

        (function frame(now) {
            const p = Math.min((now - startTs) / duration, 1);
            // easeOutExpo — arranca rápido y frena suave
            const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
            el.textContent = Math.round(target * eased) + suffix;
            if (p < 1) requestAnimationFrame(frame);
        })(startTs);
    };

    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            run(entry.target);
            io.unobserve(entry.target);   // una sola vez
        });
    }, { threshold: 0.6 });

    counters.forEach(el => io.observe(el));
}


// ─── Scroll-reveal genérico ────────────────────────────────────────
// Los elementos hermanos con [data-reveal] se escalonan solos.
function initScrollReveal() {
    const items = document.querySelectorAll('[data-reveal]');
    if (!items.length) return;

    if (prefersReducedMotion()) {
        items.forEach(el => el.classList.add('is-revealed'));
        return;
    }

    // Delay escalonado según la posición del elemento entre sus hermanos
    items.forEach(el => {
        const siblings = Array.from(el.parentElement.children)
            .filter(child => child.hasAttribute('data-reveal'));
        const index = siblings.indexOf(el);
        if (index > 0) el.style.transitionDelay = `${Math.min(index, 5) * 90}ms`;
    });

    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-revealed');
            io.unobserve(entry.target);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    items.forEach(el => io.observe(el));
}


document.addEventListener('DOMContentLoaded', () => {
    initTerminals();
    initCounters();
    initScrollReveal();
});


// ═══════════════════════════════════════════════════════════════════
// ███  PLANO TÉCNICO 2026 — interactividad de las secciones
// ═══════════════════════════════════════════════════════════════════
//   initPtTabs()      → #que-podes-hacer: 4 pestañas, cambia qph--nN
//   initPtAccordion() → #casos-de-exito: acordeón, cambia res--openN
//   initPtNodes()     → #como-funciona: nodos 01/02/03, cambia prog--nN
//   initPtRail()      → #curso: 4 hábitos con auto-avance, cambia pc--nN
//   initPtFases()     → #consultoria: 3 fases, cambia cons--nN
//
// El patrón es siempre el mismo: el estado vive en UNA clase de la
// sección raíz, y el CSS decide qué se ve. Sin manipular estilos
// inline, así las transiciones las maneja el CSS entero.
// Los <button> nativos ya dan Enter/Espacio y foco, no hace falta JS.
// ═══════════════════════════════════════════════════════════════════

function ptSwapClass(root, prefix, count, index) {
    for (let i = 0; i < count; i++) root.classList.remove(prefix + i);
    if (index !== null) root.classList.add(prefix + index);
}

function initPtTabs() {
    const sec = document.querySelector('[data-pt-tabs]');
    if (!sec) return;
    sec.querySelectorAll('.pt-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            ptSwapClass(sec, 'qph--n', 4, tab.dataset.i);
        });
    });
}

function initPtAccordion() {
    const sec = document.querySelector('[data-pt-acc]');
    if (!sec) return;
    const casos = Array.from(sec.querySelectorAll('.pt-caso'));

    function sync() {
        casos.forEach(c => {
            const abierto = sec.classList.contains('res--open' + c.dataset.i);
            c.querySelector('.pt-caso__head').setAttribute('aria-expanded', abierto ? 'true' : 'false');
        });
    }

    casos.forEach(caso => {
        caso.querySelector('.pt-caso__head').addEventListener('click', () => {
            const i = caso.dataset.i;
            const yaAbierto = sec.classList.contains('res--open' + i);
            // Clic sobre el caso abierto lo cierra
            ptSwapClass(sec, 'res--open', casos.length, yaAbierto ? null : i);
            sync();
        });
    });
    sync();
}

function initPtNodes() {
    const sec = document.querySelector('[data-pt-nodes]');
    if (!sec) return;

    sec.querySelectorAll('.pt-node').forEach(node => {
        node.addEventListener('click', () => {
            ptSwapClass(sec, 'prog--n', 3, node.dataset.i);
        });
    });

    // El riel se dibuja recién cuando el diagrama entra en pantalla
    const diag = sec.querySelector('.pt-diag');
    if (!diag) return;
    if (!('IntersectionObserver' in window)) { diag.classList.add('is-drawn'); return; }
    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            diag.classList.add('is-drawn');
            io.unobserve(entry.target);
        });
    }, { threshold: 0.25 });
    io.observe(diag);
}

// Pensamiento Crítico: el rail avanza solo cada 7 s. Se pausa con el mouse
// encima y también cuando la sección no está en pantalla — si no, el usuario
// vuelve y encuentra el paso 3 abierto sin haber visto pasar el 1 y el 2.
function initPtRail() {
    const sec = document.querySelector('[data-pt-rail]');
    if (!sec) return;
    const rail = sec.querySelector('.pc-rail');
    const steps = Array.from(sec.querySelectorAll('.pc-step'));
    if (!rail || !steps.length) return;

    const STEP_MS = 7000;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let index = 0;
    let timer = null;
    // Arranca en true a propósito: el IntersectionObserver sólo PAUSA cuando la
    // sección sale de pantalla. Si empezara en false y el observer no llegara a
    // disparar, el rail se quedaría clavado en el paso 01 para siempre.
    let visible = true;
    let held = false;

    function paint() {
        ptSwapClass(sec, 'pc--n', steps.length, index);
        steps.forEach((step, n) => {
            const head = step.querySelector('.pc-step__head');
            if (head) head.setAttribute('aria-expanded', String(n === index));
        });
    }

    function stop() {
        if (timer) { clearInterval(timer); timer = null; }
        rail.classList.remove('is-running');
    }

    function start() {
        stop();
        if (reduced || !visible || held) return;
        rail.classList.add('is-running');
        timer = setInterval(() => {
            index = (index + 1) % steps.length;
            paint();
            // Reinicia la animación de la barra de progreso del paso nuevo
            rail.classList.remove('is-running');
            void rail.offsetWidth;
            rail.classList.add('is-running');
        }, STEP_MS);
    }

    steps.forEach(step => {
        const head = step.querySelector('.pc-step__head');
        if (!head) return;
        head.addEventListener('click', () => {
            index = Number(step.dataset.i);
            paint();
            start();   // al elegir a mano, el reloj arranca de cero
        });
    });

    rail.addEventListener('mouseenter', () => { held = true; stop(); });
    rail.addEventListener('mouseleave', () => { held = false; start(); });
    rail.addEventListener('focusin',  () => { held = true; stop(); });
    rail.addEventListener('focusout', () => { held = false; start(); });

    paint();

    // Con movimiento reducido no hay auto-avance. El pie deja de prometer que
    // «avanza solo» y pasa a decir que los pasos se abren a mano.
    if (reduced) { rail.classList.add('is-static'); return; }

    rail.classList.add('is-visible');
    start();

    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            visible = entry.isIntersecting;
            rail.classList.toggle('is-visible', visible);
            if (visible) start(); else stop();
        });
    }, { threshold: 0.15 });
    io.observe(rail);
}

function initPtFases() {
    const sec = document.querySelector('[data-pt-fases]');
    if (!sec) return;
    sec.querySelectorAll('.cons-fase').forEach(fase => {
        fase.addEventListener('click', () => {
            ptSwapClass(sec, 'cons--n', 3, fase.dataset.i);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initPtTabs();
    initPtAccordion();
    initPtNodes();
    initPtRail();
    initPtFases();
});
