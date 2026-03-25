Auditá y optimizá las imágenes de SoyLeoAI.com.

## Pasos:

1. **Listá todas las imágenes** en /images/ con sus tamaños actuales:
   ```bash
   find /home/leodiazdt/ia-arquitectos-website/images -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.webp" -o -name "*.mp4" \) -exec ls -lh {} \;
   ```

2. **Identificá imágenes problemáticas:**
   - Imágenes > 200KB (candidatas a comprimir)
   - Imágenes PNG que podrían ser JPG (fotos)
   - Imágenes sin versión WebP

3. **Verificá en index.html:**
   - ¿Todas las imágenes tienen loading="lazy"? (salvo el hero)
   - ¿Todas tienen atributos width y height?
   - ¿Todas tienen alt text descriptivo?

4. **Para videos (.mp4 en /images/casos/):**
   - Verificar que tengan atributo muted, playsinline, preload="none"
   - Recomendar si conviene usar poster thumbnail

5. **Generá reporte** con:
   - Lista de imágenes ordenadas por peso (de mayor a menor)
   - Estimado de ahorro si se comprimen
   - Comando TinyPNG CLI si está disponible

6. **Aplicá los fixes de HTML** (lazy, width, height, alt) automáticamente si Leo lo aprueba.
