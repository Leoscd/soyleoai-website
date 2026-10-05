# Diagnósticos de procesos e IA por empresa

Cada empresa tiene su formulario en dos etapas, con las mismas métricas para comparar antes y después:
el **diagnóstico inicial** y la **medición final** (después de implementar IA).

Cada etapa tiene su propio link con un **código secreto** de 16 caracteres:
`soyleoai.com/diagnostico/<código>`. El nombre de la empresa no aparece en la URL, así que nadie puede
cambiarla para entrar al formulario de otra empresa ni pasar de una etapa a otra.

## Dónde están las empresas y los links

No están en este repositorio, que es público. Viven en la pestaña **"Empresas"** de la Google Sheet
**"Diagnósticos SoyLeo AI"**, que es privada. La web le pregunta al Apps Script por un código y recibe
solo el nombre, la etapa y las áreas de ese código. El Apps Script también rechaza las respuestas
con un código que no esté en la lista o que esté cerrado.

| Columna | Para qué |
|---|---|
| `codigo` | Se genera solo. No lo compartas fuera de la empresa |
| `empresa` | Identificador corto, por ejemplo `saez-sanchez`. Nombra la pestaña de respuestas |
| `nombre` | Cómo se muestra en la página |
| `etapa` | `inicial` o `final` |
| `abierta` | Destildala para cerrar el formulario |
| `areas` | Separadas por comas |
| `link` | El link para mandar a los empleados |

**Sumar una empresa:** agregá dos filas (una `inicial` y una `final`) y usá el menú
**Diagnósticos → Generar links faltantes**. No hace falta tocar la web ni volver a publicar.

**Si un link se filtra:** borrá su código en la Sheet y volvé a usar *Generar links faltantes*.
El link viejo deja de funcionar.

## Qué pasa con los datos

Las respuestas van a la misma Sheet, una pestaña por empresa y etapa (`saez-sanchez · inicial`,
`saez-sanchez · final`). Las pestañas y columnas se crean solas.
El backend es un Apps Script (copia en `docs/apps-script-diagnosticos.gs`); su URL va en `_assets/config.js`.
Mientras el formulario no esté enviado, las respuestas quedan guardadas en el navegador de cada persona.

Las páginas no aparecen en Google (`noindex` y `robots.txt`).

## Archivos

| Archivo | Para qué |
|---|---|
| `_form/index.html` | La página (Vercel la sirve en `/diagnostico/<código>`) |
| `_assets/diagnostico.js` | Preguntas de cada etapa y lógica del formulario |
| `_assets/diagnostico.css` | Agregados al diseño de las landings de recursos |
| `_assets/config.js` | URL del Apps Script |

Para probar en local (sin las reescrituras de Vercel):
`python -m http.server 8080` y abrir `http://localhost:8080/diagnostico/_form/?t=<código>`.
