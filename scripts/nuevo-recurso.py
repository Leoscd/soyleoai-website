#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Agrega un recurso descargable a soyleoai.com/recursos.

Uso mínimo (todo lo demás se pregunta):
    python scripts/nuevo-recurso.py "C:/Users/leona/Downloads/Mi-Guia.pdf"

Uso directo:
    python scripts/nuevo-recurso.py archivo.pdf --slug revit --titulo "Automatizá *Revit* con IA" \
        --bajada "Lo que se puede automatizar hoy, sin programar." \
        --bullet "Qué tareas conviene automatizar" --bullet "Las 3 herramientas que uso"

El asterisco *así* pinta esa parte del título de dorado.
Copia el PDF a recursos/archivos/<slug>.pdf y agrega la ficha a recursos/recursos.json.
La página queda en https://soyleoai.com/recursos/<slug> — no hay que crear ningún HTML.
"""
import argparse
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
    p.add_argument("pdf", help="Ruta al PDF que querés entregar")
    p.add_argument("--slug", help="Parte final de la URL, ej: revit")
    p.add_argument("--titulo", help="Título del hero. Usá *asteriscos* para la parte dorada")
    p.add_argument("--bajada", help="Frase debajo del título")
    p.add_argument("--bullet", action="append", default=[], help="Viñeta (repetir la opción)")
    p.add_argument("--etiqueta", default="Guía gratuita · PDF", help="Texto del recuadro superior")
    args = p.parse_args()

    origen = Path(args.pdf).expanduser()
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
    destino = ARCHIVOS / f"{slug}.pdf"
    shutil.copyfile(origen, destino)

    catalogo.append({
        "slug": slug,
        "etiqueta": args.etiqueta,
        "titulo": titulo,
        "bajada": bajada,
        "bullets": bullets,
        "pdf": f"/recursos/archivos/{slug}.pdf",
        "fecha": date.today().isoformat(),
    })
    CATALOGO.write_text(json.dumps(catalogo, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(f"\nListo. Archivo copiado a {destino.relative_to(RAIZ)}")
    print(f"Página: https://soyleoai.com/recursos/{slug}  (después de publicar)")
    print("\nPara publicarlo:")
    print(f'  git add recursos && git commit -m "feat: recurso {slug}" && git push')


if __name__ == "__main__":
    main()
