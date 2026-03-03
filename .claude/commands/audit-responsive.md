---
description: Audita el sitio SoyLeoAI.com en todos los breakpoints y reporta problemas responsive
---

Realizá una auditoría responsive completa del sitio SoyLeoAI.com siguiendo estos pasos:

1. **Leé** `index.html` completo para mapear todas las secciones
2. **Leé** `css/styles-v2.css` enfocándote en los bloques `@media`
3. Para cada sección (`#home`, `#sobre-mi`, `#curso`, `#consultoria`, `#empresas`, `#testimonios`, `#contacto`), evaluá:
   - **375px** (iPhone SE) — viewport más pequeño objetivo
   - **768px** (tablet) — punto de quiebre principal
   - **1200px** (desktop) — referencia base

4. Reportá en formato:

```
## AUDITORÍA RESPONSIVE — SoyLeoAI.com

### #seccion — NombreSección
| Problema | Viewport | Severidad | Fix |
|----------|----------|-----------|-----|
| ...      | 375px    | Alta      | ... |

### Resumen
- Total problemas: X
- Alta: X | Media: X | Baja: X
- Prioridad de fix: [lista ordenada]
```

5. Si encontrás problemas de **Alta** severidad, preguntá si implementar el fix de inmediato.
