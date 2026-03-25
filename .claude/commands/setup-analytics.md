Configurá Google Analytics 4 y Microsoft Clarity en SoyLeoAI.com.

## Prerequisitos — preguntale a Leo:
1. ¿Tenés tu GA4 Measurement ID? (formato: G-XXXXXXXXXX)
2. ¿Tenés tu Clarity Project ID? (formato: letras y números)

Si no los tiene, indicale:
- GA4: https://analytics.google.com → Crear propiedad → Web → obtener Measurement ID
- Clarity: https://clarity.microsoft.com → Nuevo proyecto → obtener Project ID

## Pasos de implementación:

1. **Creá /js/analytics.js** con:
   - Snippet de GA4 (gtag.js) con los IDs como variables
   - Snippet de Microsoft Clarity
   - Función trackEvent(name, params) reutilizable
   - Eventos: cta_click, form_submit, video_play, scroll_testimonios

2. **Actualizá todas las páginas HTML** (index.html, pago.html):
   - Agregar <script async src="js/analytics.js"> antes de </body>
   - Usar defer para no bloquear el render

3. **Verificá** que los eventos disparen correctamente revisando el código de los CTAs y el formulario.

4. **Documentá** todos los eventos en un comentario al inicio de analytics.js.

IMPORTANTE: Los IDs van como variables en analytics.js, no hardcodeados en HTML.
