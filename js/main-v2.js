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