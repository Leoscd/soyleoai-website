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

    } catch (error) {
        console.error('❌ Error cargando testimonios:', error);
        loadPlaceholderTestimonials();
    }
}

function createTestimonialCard(testimonial, index) {
    const card = document.createElement('div');
    card.className = 'testimonial-card';
    card.style.animationDelay = `${index * 0.1}s`;

    const photoHTML = testimonial.photo
        ? `<img src="${testimonial.photo}" alt="${testimonial.name}" class="testimonial-photo">`
        : `<div class="testimonial-photo-placeholder">${getInitials(testimonial.name)}</div>`;

    const starsHTML = generateStars(testimonial.rating || 5);

    card.innerHTML = `
        <div class="testimonial-header">
            ${photoHTML}
            <div class="testimonial-info">
                <h4>${testimonial.name}</h4>
                <p class="testimonial-role">${testimonial.role}</p>
            </div>
        </div>
        <p class="testimonial-text">"${testimonial.text}"</p>
        <div class="testimonial-rating">
            ${starsHTML}
        </div>
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
}

// ===========================
// Formulario de Contacto - FormSubmit
// ===========================
const contactForm = document.getElementById('contact-form');

// Configurar URL de redirect dinámicamente
const redirectInput = document.getElementById('form-redirect');
const currentUrl = window.location.origin + window.location.pathname;
redirectInput.value = currentUrl + '?success=true';

// Mostrar estado de "Enviando..." al enviar
contactForm.addEventListener('submit', (e) => {
    const submitButton = contactForm.querySelector('button[type="submit"]');
    submitButton.textContent = 'Enviando...';
    submitButton.disabled = true;

    console.log('Formulario enviado a FormSubmit');
    // El formulario se envía normalmente (no prevenir default)
});

// Detectar cuando regresa con éxito
window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
        alert('✅ ¡Mensaje enviado correctamente! Me pondré en contacto contigo pronto.');

        // Limpiar el parámetro de la URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});

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
    // loadTestimonials(); // Desactivado: testimonios ahora están directamente en el HTML

    // Animación de entrada del hero
    setTimeout(() => {
        const heroContent = document.querySelector('.hero-content-center');
        if (heroContent) {
            heroContent.style.opacity = '1';
        }
    }, 100);
});