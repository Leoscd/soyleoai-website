# Recursos descargables (lead magnets)

Cada recurso es **una ficha en `recursos.json` + un archivo en `archivos/`**. No se escribe HTML:
el script genera `recursos/<slug>/index.html` desde `_plantilla/index.html` (con título y vista
previa para WhatsApp/Instagram) y `landing.js` completa el contenido desde la ficha.

Si editás `recursos.json` o la plantilla a mano, regenerá las páginas:

```bash
python scripts/nuevo-recurso.py --solo-paginas
```

## Agregar un recurso nuevo

```bash
python scripts/nuevo-recurso.py "C:/Users/leona/Downloads/Mi-Guia.pdf"   # o .zip, .xlsx...
```

Pregunta la URL, el título, la bajada y las viñetas; copia el PDF y agrega la ficha.
En el título, lo que va entre *asteriscos* se pinta de dorado.
Después:

```bash
git add recursos && git commit -m "feat: recurso <slug>" && git push
```

Vercel publica en 1-2 minutos. Queda en `soyleoai.com/recursos/<slug>` y aparece solo en el
índice `soyleoai.com/recursos`.

## Qué pasa con los datos

Todos los recursos usan el **mismo formulario y la misma Google Sheet**. La columna `recurso`
indica cuál descargó cada persona, así que una misma persona puede aparecer varias veces, una
por descarga. El email con el link lo manda el Apps Script (copia en `docs/apps-script-recursos.gs`),
que arma el link como `https://soyleoai.com/recursos/archivos/<recurso>.pdf`.

## Archivos

| Archivo | Para qué |
|---|---|
| `recursos.json` | La ficha de cada recurso (lo edita el script) |
| `archivos/<slug>.<ext>` | El archivo que se entrega (PDF, ZIP, XLSX...) |
| `_plantilla/index.html` | Molde de las páginas (no se sirve directo) |
| `<slug>/index.html` | Página generada de cada recurso (no editar a mano) |
| `_assets/landing.css` · `landing.js` | Diseño y lógica del formulario, comunes a todos |
| `_assets/config.js` | URL del Apps Script y ID del Pixel de Meta |
| `index.html` | El índice con todos los recursos |
