#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Agrega un recurso descargable (PDF, ZIP, XLSX...) a soyleoai.com/recursos.

Uso mínimo (todo lo demás se pregunta):
    python scripts/nuevo-recurso.py "C:/Users/leona/Downloads/Mi-Guia.pdf"
    python scripts/nuevo-recurso.py "C:/Users/leona/Downloads/Herramienta.zip"

Uso directo:
    python scripts/nuevo-recurso.py archivo.pdf --slug revit --titulo "Automatizá *Revit* con IA" \
        --bajada "Lo que se puede automatizar hoy, sin programar." \
        --bullet "Qué tareas conviene automatizar" --bullet "Las 3 herramientas que uso"

Regenerar las páginas (por ejemplo, después de editar recursos.json a mano):
    python scripts/nuevo-recurso.py --solo-paginas

El asterisco *así* pinta esa parte del título de dorado.
Copia el archivo a recursos/archivos/<slug>.<ext>, agrega la ficha a recursos/recursos.json y
genera recursos/<slug>/index.html (con título y vista previa para WhatsApp/Instagram).
La página queda en https://soyleoai.com/recursos/<slug> — no hay que escribir ningún HTML.
"""
import argparse
import html
import json
import re
import shutil
import sys
import unicodedata
from datetime import date
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
CATALOGO = RAIZ / "recursos" / "recursos.json"
ARCHIVOS = RAIZ / "recursos" / "archivos"
PLANTILLA = RAIZ / "recursos" / "_plantilla" / "index.html"
OG_IMAGE = "https://soyleoai.com/images/og-image.jpg"


def generar_paginas(catalogo):
    """Escribe recursos/<slug>/index.html con el título y la vista previa (WhatsApp, Instagram,
    Google) ya en el HTML. El contenido visible lo sigue poniendo landing.js desde recursos.json."""
    base = PLANTILLA.read_text(encoding="utf-8")
    patron = re.compile(r'<title>.*?</title>\s*<meta name="description"[^>]*>', re.S)
    for r in catalogo:
        titulo = html.escape(r["titulo"].replace("*", ""), quote=True)
        bajada = html.escape(re.sub(r"<[^>]+>", "", r["bajada"]).replace("*", ""), quote=True)
        url = f"https://soyleoai.com/recursos/{r['slug']}"
        cabecera = "\n".join([
            f"<title>{titulo} · SoyLeo AI</title>",
            f'<meta name="description" content="{bajada}">',
            f'<link rel="canonical" href="{url}">',
            f'<meta property="og:title" content="{titulo}">',
            f'<meta property="og:description" content="{bajada}">',
            f'<meta property="og:url" content="{url}">',
            f'<meta property="og:image" content="{OG_IMAGE}">',
            '<meta name="twitter:card" content="summary_large_image">',
        ])
        destino = RAIZ / "recursos" / r["slug"] / "index.html"
        destino.parent.mkdir(parents=True, exist_ok=True)
        destino.write_text(patron.sub(lambda _: cabecera, base, count=1), encoding="utf-8")
    print(f"Páginas generadas: {', '.join(r['slug'] for r in catalogo)}")


def slugify(texto):
    texto = unicodedata.normalize("NFKD", texto).encode("ascii", "ignore").decode()
    texto = re.sub(r"[^a-zA-Z0-9]+", "-", texto).strip("-").lower()
    return re.sub(r"-+", "-", texto)


def preguntar(etiqueta, obligatorio=True, defecto=""):
    while True:
        valor = input(f"{etiqueta}{f' [{defecto}]' if defecto else ''}: ").strip() or defecto
        if valor or not obligatorio:
            return valor
        print("  (hace falta un valor)")


def main():
    p = argparse.ArgumentParser(description="Agrega un recurso descargable a /recursos")
    p.add_argument("archivo", nargs="?", help="Ruta al archivo que querés entregar (PDF, ZIP, XLSX...)")
    p.add_argument("--solo-paginas", action="store_true", help="Solo regenera las páginas desde recursos.json")
    p.add_argument("--slug", help="Parte final de la URL, ej: revit")
    p.add_argument("--titulo", help="Título del hero. Usá *asteriscos* para la parte dorada")
    p.add_argument("--bajada", help="Frase debajo del título")
    p.add_argument("--bullet", action="append", default=[], help="Viñeta (repetir la opción)")
    p.add_argument("--etiqueta", help="Texto del recuadro superior (por defecto según el formato)")
    args = p.parse_args()

    if args.solo_paginas:
        generar_paginas(json.loads(CATALOGO.read_text(encoding="utf-8")))
        return
    if not args.archivo:
        p.error("falta el archivo a entregar")

    origen = Path(args.archivo).expanduser()
    if not origen.is_file():
        sys.exit(f"No encuentro el archivo: {origen}")

    slug = args.slug or slugify(preguntar("URL (ej: revit)", defecto=slugify(origen.stem)))
    catalogo = json.loads(CATALOGO.read_text(encoding="utf-8")) if CATALOGO.exists() else []
    if any(r["slug"] == slug for r in catalogo):
        sys.exit(f"Ya existe un recurso con la URL /recursos/{slug}. Elegí otra o editá recursos.json.")

    titulo = args.titulo or preguntar("Título (usá *asteriscos* para la parte dorada)")
    bajada = args.bajada or preguntar("Bajada (una frase)")
    bullets = args.bullet
    if not bullets:
        print("Viñetas (Enter vacío para terminar):")
        while len(bullets) < 6:
            b = preguntar(f"  viñeta {len(bullets) + 1}", obligatorio=not bullets)
            if not b:
                break
            bullets.append(b)

    ARCHIVOS.mkdir(parents=True, exist_ok=True)
    extension = origen.suffix.lower()
    formato = extension.lstrip(".").upper()
    destino = ARCHIVOS / f"{slug}{extension}"
    shutil.copyfile(origen, destino)

    catalogo.append({
        "slug": slug,
        "etiqueta": args.etiqueta or ("Herramienta gratuita · ZIP" if formato == "ZIP" else f"Guía gratuita · {formato}"),
        "titulo": titulo,
        "bajada": bajada,
        "bullets": bullets,
        "archivo": f"/recursos/archivos/{slug}{extension}",
        "formato": formato,
        "fecha": date.today().isoformat(),
    })
    CATALOGO.write_text(json.dumps(catalogo, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    generar_paginas(catalogo)

    print(f"\nListo. Archivo copiado a {destino.relative_to(RAIZ)}")
    print(f"Página: https://soyleoai.com/recursos/{slug}  (después de publicar)")
    print("\nPara publicarlo:")
    print(f'  git add recursos && git commit -m "feat: recurso {slug}" && git push')


if __name__ == "__main__":
    main()
