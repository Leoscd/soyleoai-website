Realizá una auditoría de performance de SoyLeoAI.com orientada a Core Web Vitals.

## Pasos a seguir:

1. **Lee index.html completo** e identificá:
   - Scripts en <head> sin async/defer (bloquean render)
   - Imágenes sin loading="lazy" (salvo las above-the-fold del hero)
   - Imágenes sin width/height definidos (causan CLS)
   - Fuentes Google Fonts sin preconnect
   - CSS bloqueante no crítico

2. **Revisá las imágenes en /images/**:
   - Listá todas las imágenes con sus extensiones
   - Identificá las que deberían estar en formato WebP
   - Señalá las que probablemente superan 200KB

3. **Revisá vercel.json**:
   - ¿Tiene Cache-Control para imágenes, CSS y JS?
   - ¿Usa compresión (gzip/brotli)?

4. **Generá reporte** con:
   - 🚨 CRÍTICO: problemas que afectan LCP o CLS
   - ⚠️ MEJORAR: optimizaciones de impacto medio
   - 💡 SUGERENCIA: mejoras opcionales

5. **Listá las 3 acciones de mayor impacto** para mejorar PageSpeed rápido.
