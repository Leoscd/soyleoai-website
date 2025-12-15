// ===========================
// Configuración de MercadoPago
// ===========================

// IMPORTANTE: Reemplaza 'YOUR_PUBLIC_KEY' con tu Public Key de MercadoPago
// Obtén tu Public Key en: https://www.mercadopago.com.ar/developers/panel/credentials
const MP_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

// Productos disponibles
const PRODUCTS = {
    curso: {
        id: 'curso-ia-arquitectos',
        title: 'Curso de IA para Arquitectos',
        description: 'Programa completo de capacitación en inteligencia artificial aplicada a la arquitectura',
        price: 50000, // Precio en centavos (500.00 ARS)
        currency: 'ARS'
    },
    consultoria: {
        id: 'consultoria-ia',
        title: 'Consultoría personalizada',
        description: 'Sesión de consultoría personalizada para implementación de IA',
        price: 100000,
        currency: 'ARS'
    },
    empresa: {
        id: 'capacitacion-empresas',
        title: 'Capacitación para empresas',
        description: 'Workshop corporativo de IA para equipos de arquitectura',
        price: 300000,
        currency: 'ARS'
    }
};

// Códigos de descuento
const DISCOUNT_CODES = {
    'PROMO10': 10, // 10% de descuento
    'PROMO20': 20,
    'ARQUITECTO15': 15
};

// Estado de la aplicación
let selectedProduct = PRODUCTS.curso;
let appliedDiscount = 0;
let mercadopago = null;

// ===========================
// Inicialización
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    // Obtener producto desde URL (si viene de index.html)
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('producto');

    if (productId && PRODUCTS[productId]) {
        selectedProduct = PRODUCTS[productId];
    }

    // Actualizar UI con el producto seleccionado
    updateProductDisplay();
    updatePrices();

    // Inicializar MercadoPago
    initMercadoPago();

    // Event listeners
    document.getElementById('apply-coupon').addEventListener('click', applyCoupon);
    document.getElementById('logo-img').addEventListener('error', function() {
        this.style.display = 'none';
    });
});

// ===========================
// Funciones de MercadoPago
// ===========================
function initMercadoPago() {
    if (MP_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
        showMockPayment();
        return;
    }

    try {
        mercadopago = new MercadoPago(MP_PUBLIC_KEY);
        createCheckoutButton();
    } catch (error) {
        console.error('Error inicializando MercadoPago:', error);
        showMockPayment();
    }
}

function createCheckoutButton() {
    // Opción 1: Botón de Wallet (recomendado)
    const mp = new MercadoPago(MP_PUBLIC_KEY, {
        locale: 'es-AR'
    });

    // Crear preferencia de pago
    createPreference().then(preferenceId => {
        mp.bricks().create("wallet", "wallet_container", {
            initialization: {
                preferenceId: preferenceId,
            },
            customization: {
                texts: {
                    valueProp: 'smart_option',
                },
            },
        });
    });
}

async function createPreference() {
    // En producción, esto debe hacerse en el backend por seguridad
    // Esta es una versión simplificada para demostración

    const buyerName = document.getElementById('buyer-name').value;
    const buyerEmail = document.getElementById('buyer-email').value;

    const totalAmount = calculateTotal();

    const preference = {
        items: [
            {
                id: selectedProduct.id,
                title: selectedProduct.title,
                description: selectedProduct.description,
                quantity: 1,
                currency_id: selectedProduct.currency,
                unit_price: totalAmount / 100
            }
        ],
        payer: {
            name: buyerName,
            email: buyerEmail
        },
        back_urls: {
            success: window.location.origin + '/success.html',
            failure: window.location.origin + '/failure.html',
            pending: window.location.origin + '/pending.html'
        },
        auto_return: 'approved',
        notification_url: window.location.origin + '/api/webhook', // URL de tu backend
    };

    try {
        // Aquí debes hacer una llamada a tu backend para crear la preferencia
        // const response = await fetch('/api/create-preference', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(preference)
        // });
        // const data = await response.json();
        // return data.preferenceId;

        // Por ahora, retornamos un ID mock
        console.log('Preferencia a crear:', preference);
        return 'PREFERENCE_ID_MOCK';

    } catch (error) {
        console.error('Error creando preferencia:', error);
        return null;
    }
}

// ===========================
// Versión Mock para Testing
// ===========================
function showMockPayment() {
    const walletContainer = document.getElementById('wallet_container');

    walletContainer.innerHTML = `
        <div style="background: linear-gradient(135deg, #009ee3 0%, #0062a3 100%); padding: 2rem; border-radius: 12px; text-align: center; color: white;">
            <h3 style="margin-bottom: 1rem;">🔧 Modo de Prueba - MercadoPago</h3>
            <p style="margin-bottom: 1.5rem; opacity: 0.9;">Para activar pagos reales:</p>
            <ol style="text-align: left; margin: 0 auto; max-width: 400px; margin-bottom: 1.5rem; opacity: 0.9;">
                <li style="margin-bottom: 0.5rem;">Regístrate en <a href="https://www.mercadopago.com.ar" target="_blank" style="color: white; text-decoration: underline;">MercadoPago</a></li>
                <li style="margin-bottom: 0.5rem;">Obtén tu Public Key en el panel de desarrolladores</li>
                <li style="margin-bottom: 0.5rem;">Reemplaza 'YOUR_PUBLIC_KEY' en js/payment.js</li>
                <li>Configura un backend para crear las preferencias de pago</li>
            </ol>
            <button class="btn btn-primary" onclick="simulatePayment()" style="background: white; color: #009ee3; padding: 1rem 2rem; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
                Simular Pago (Demo)
            </button>
        </div>
    `;
}

function simulatePayment() {
    const name = document.getElementById('buyer-name').value;
    const email = document.getElementById('buyer-email').value;
    const document_input = document.getElementById('buyer-document').value;

    if (!name || !email || !document_input) {
        alert('Por favor completa todos los campos requeridos');
        return;
    }

    const walletContainer = document.getElementById('wallet_container');
    walletContainer.classList.add('loading');

    setTimeout(() => {
        walletContainer.classList.remove('loading');
        alert('¡Pago simulado exitoso! En producción, aquí se procesaría el pago real con MercadoPago.');

        // Simular redirección a página de éxito
        // window.location.href = 'success.html';
    }, 2000);
}

// ===========================
// Gestión de Precios
// ===========================
function calculateSubtotal() {
    return selectedProduct.price;
}

function calculateDiscount() {
    const subtotal = calculateSubtotal();
    return Math.floor((subtotal * appliedDiscount) / 100);
}

function calculateTotal() {
    return calculateSubtotal() - calculateDiscount();
}

function updatePrices() {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const total = calculateTotal();

    document.getElementById('subtotal').textContent = formatPrice(subtotal);
    document.getElementById('discount').textContent = discount > 0 ? `-${formatPrice(discount)}` : '$0';
    document.getElementById('total').textContent = formatPrice(total);
}

function formatPrice(amountInCents) {
    const amount = amountInCents / 100;
    return `$${amount.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// ===========================
// Cupones de Descuento
// ===========================
function applyCoupon() {
    const couponInput = document.getElementById('coupon-input');
    const code = couponInput.value.trim().toUpperCase();

    if (!code) {
        alert('Por favor ingresa un código de descuento');
        return;
    }

    if (DISCOUNT_CODES[code]) {
        appliedDiscount = DISCOUNT_CODES[code];
        updatePrices();
        alert(`¡Cupón aplicado! Descuento del ${appliedDiscount}%`);
        couponInput.disabled = true;
        document.getElementById('apply-coupon').textContent = 'Aplicado ✓';
        document.getElementById('apply-coupon').disabled = true;
    } else {
        alert('Código de descuento inválido');
    }
}

// ===========================
// Actualizar Display del Producto
// ===========================
function updateProductDisplay() {
    const productContainer = document.getElementById('selected-product');

    productContainer.querySelector('h3').textContent = selectedProduct.title;
    productContainer.querySelector('p').textContent = selectedProduct.description;
}

// ===========================
// Validación del Formulario
// ===========================
function validateForm() {
    const name = document.getElementById('buyer-name').value;
    const email = document.getElementById('buyer-email').value;
    const document_input = document.getElementById('buyer-document').value;

    if (!name || !email || !document_input) {
        alert('Por favor completa todos los campos requeridos (*)');
        return false;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor ingresa un email válido');
        return false;
    }

    return true;
}

// ===========================
// INSTRUCCIONES PARA INTEGRACIÓN REAL
// ===========================
/*

PASOS PARA ACTIVAR MERCADOPAGO EN PRODUCCIÓN:

1. OBTENER CREDENCIALES:
   - Regístrate en https://www.mercadopago.com.ar
   - Ve a https://www.mercadopago.com.ar/developers/panel/credentials
   - Copia tu "Public Key" de producción

2. CONFIGURAR ESTE ARCHIVO:
   - Reemplaza 'YOUR_PUBLIC_KEY' en la línea 7 con tu Public Key real

3. CREAR BACKEND (REQUERIDO):
   El backend debe manejar:

   a) Endpoint para crear preferencias de pago:
      POST /api/create-preference
      {
        "items": [...],
        "payer": {...},
        "back_urls": {...}
      }

      Respuesta: { "preferenceId": "123456" }

   b) Endpoint webhook para notificaciones:
      POST /api/webhook
      Recibe notificaciones de MercadoPago sobre el estado del pago

4. EJEMPLO DE BACKEND (Node.js + Express):

   const mercadopago = require('mercadopago');

   mercadopago.configure({
       access_token: 'YOUR_ACCESS_TOKEN'
   });

   app.post('/api/create-preference', async (req, res) => {
       const preference = {
           items: req.body.items,
           payer: req.body.payer,
           back_urls: req.body.back_urls,
           auto_return: 'approved',
           notification_url: 'https://tudominio.com/api/webhook'
       };

       try {
           const response = await mercadopago.preferences.create(preference);
           res.json({ preferenceId: response.body.id });
       } catch (error) {
           res.status(500).json({ error: error.message });
       }
   });

   app.post('/api/webhook', async (req, res) => {
       const { type, data } = req.body;

       if (type === 'payment') {
           // Procesar pago
           // Actualizar base de datos
           // Enviar email de confirmación
       }

       res.sendStatus(200);
   });

5. PÁGINAS DE RESPUESTA:
   Crea estas páginas para manejar las respuestas:
   - success.html (pago exitoso)
   - failure.html (pago fallido)
   - pending.html (pago pendiente)

6. TESTING:
   Usa las credenciales de TEST antes de pasar a producción
   Tarjetas de prueba: https://www.mercadopago.com.ar/developers/es/docs/checkout-api/integration-test/test-cards

*/