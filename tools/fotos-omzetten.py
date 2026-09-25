"""Zet foto's om naar kleine WebP-bestanden voor de website.

Gebruik:  python tools/fotos-omzetten.py <bronbestand> <nieuwe-naam> [max-breedte]
Voorbeeld: python tools/fotos-omzetten.py images/nieuw/IMG_1234.jpg werkplek-competa-bureau
Resultaat: images/werkplek-competa-bureau.webp
"""
import sys
from pathlib import Path
from PIL import Image, ImageOps

MAP = Path(__file__).resolve().parent.parent / "images"


def omzetten(bron, naam, max_breedte=1600, kwaliteit=80):
    img = ImageOps.exif_transpose(Image.open(bron))  # telefoonfoto's goed draaien
    if img.mode not in ("RGB", "RGBA"):
        img = img.convert("RGBA" if "A" in img.getbands() else "RGB")
    if img.width > max_breedte:
        img = img.resize((max_breedte, round(img.height * max_breedte / img.width)), Image.LANCZOS)
    doel = MAP / f"{naam}.webp"
    img.save(doel, "WEBP", quality=kwaliteit, method=6)
    print(f"{doel.name}: {img.width}x{img.height}, {doel.stat().st_size // 1024} KB")
    return img.width, img.height


if __name__ == "__main__":
    omzetten(sys.argv[1], sys.argv[2], int(sys.argv[3]) if len(sys.argv) > 3 else 1600)
