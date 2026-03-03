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

        // Boot the carousel after all cards are in the DOM
        initCarousel();

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
        ? `<img src="${testimonial.photo}" alt="${testimonial.name}" class="testimonial-photo">`
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
// Carousel Engine
// ===========================
function initCarousel() {
    const track       = document.getElementById('testimonios-container');
    const wrapper     = track ? track.closest('.testimonios-carousel-wrapper') : null;
    const dotsContainer = document.getElementById('carousel-dots');
    const prevBtn     = wrapper ? wrapper.querySelector('.carousel-prev') : null;
    const nextBtn     = wrapper ? wrapper.querySelector('.carousel-next') : null;

    if (!track || !wrapper || !dotsContainer || !prevBtn || !nextBtn) return;

    const cards = Array.from(track.querySelectorAll('.testimonial-card'));
    if (cards.length === 0) return;

    // ── How many cards are visible at current viewport ──
    function getVisibleCount() {
        const w = window.innerWidth;
        if (w >= 1024) return 3;
        if (w >= 768)  return 2;
        return 1;
    }

    // ── State ──
    let currentIndex  = 0;
    let visibleCount  = getVisibleCount();
    let autoTimer     = null;
    let isInteracting = false; // true while user touches / hovers

    // ── Total number of "pages" (stops) ──
    function totalStops() {
        return Math.max(1, cards.length - visibleCount + 1);
    }

    // ── Move the track to show the card at `index` ──
    function goTo(index) {
        const stops = totalStops();

        // Loop clamp — wrap around at boundaries
        if (index >= stops) index = 0;
        if (index < 0)      index = stops - 1;

        currentIndex = index;

        // Card width includes the 32px gap between cards
        const cardEl        = cards[0];
        const cardWidth     = cardEl.getBoundingClientRect().width;
        const computedGap   = 32; // matches CSS gap: 32px on .testimonios-track
        const offset        = currentIndex * (cardWidth + computedGap);

        track.style.transform = `translateX(-${offset}px)`;

        // Update dots
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    // ── Build dots based on current stop count ──
    function buildDots() {
        dotsContainer.innerHTML = '';
        const stops = totalStops();

        for (let i = 0; i < stops; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot' + (i === currentIndex ? ' active' : '');
            dot.setAttribute('aria-label', `Ir al testimonio ${i + 1}`);
            dot.addEventListener('click', () => {
                goTo(i);
                resetAutoTimer();
            });
            dotsContainer.appendChild(dot);
        }
    }

    // ── Auto-advance ──
    function startAutoTimer() {
        stopAutoTimer();
        autoTimer = setInterval(() => {
            if (!isInteracting) {
                goTo(currentIndex + 1);
            }
        }, 4000);
    }

    function stopAutoTimer() {
        if (autoTimer) {
            clearInterval(autoTimer);
            autoTimer = null;
        }
    }

    function resetAutoTimer() {
        stopAutoTimer();
        startAutoTimer();
    }

    // ── Pause on mouse hover (desktop) ──
    wrapper.addEventListener('mouseenter', () => {
        isInteracting = true;
    });
    wrapper.addEventListener('mouseleave', () => {
        isInteracting = false;
    });

    // ── Pause on touch (mobile) ──
    wrapper.addEventListener('touchstart', () => {
        isInteracting = true;
    }, { passive: true });
    wrapper.addEventListener('touchend', () => {
        // Resume after a brief delay so the last swipe gesture doesn't immediately advance
        setTimeout(() => { isInteracting = false; }, 800);
    }, { passive: true });

    // ── Swipe support (touch) ──
    let touchStartX = 0;
    wrapper.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });
    wrapper.addEventListener('touchend', (e) => {
        const delta = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(delta) > 40) {
            goTo(delta > 0 ? currentIndex + 1 : currentIndex - 1);
            resetAutoTimer();
        }
    }, { passive: true });

    // ── Prev / Next buttons ──
    prevBtn.addEventListener('click', () => {
        goTo(currentIndex - 1);
        resetAutoTimer();
    });
    nextBtn.addEventListener('click', () => {
        goTo(currentIndex + 1);
        resetAutoTimer();
    });

    // ── Rebuild on resize (debounced) ──
    let resizeTimer = null;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const newVisible = getVisibleCount();
            if (newVisible !== visibleCount) {
                visibleCount = newVisible;
                // Clamp current index so it doesn't exceed new stop count
                if (currentIndex >= totalStops()) {
                    currentIndex = totalStops() - 1;
                }
                buildDots();
                goTo(currentIndex);
            }
        }, 150);
    }, { passive: true });

    // ── Initial render ──
    buildDots();
    goTo(0);
    startAutoTimer();
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

    // Boot carousel for fallback data as well
    initCarousel();
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
// Navbar Scroll Effect
// ===========================
let lastScroll = 0;
const navbar = document.querySelector('.navbar-minimal');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.padding = '16px 0';
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        navbar.style.padding = '24px 0';
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    }

    lastScroll = currentScroll;
});

// ===========================
// Inicialización
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    // Load 6 real testimonials from JSON and boot the carousel
    loadTestimonials();

    // Animación de entrada del hero
    setTimeout(() => {
        const heroContent = document.querySelector('.hero-content-center');
        if (heroContent) {
            heroContent.style.opacity = '1';
        }
    }, 100);
});