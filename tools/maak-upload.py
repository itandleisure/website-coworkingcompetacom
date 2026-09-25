"""Maakt een schone uploadmap + zip-bestand voor Vimexx.

Gebruik:  python tools/maak-upload.py
Resultaat (naast de projectmap):
  coworking-competa-UPLOAD/       -> inhoud hiervan komt in public_html
  coworking-competa-upload.zip    -> zelfde inhoud als zip (handig voor bestandsbeheer)
"""
import shutil
import zipfile
from pathlib import Path

PROJECT = Path(__file__).resolve().parent.parent
UIT = PROJECT.parent / "coworking-competa-UPLOAD"
ZIP = PROJECT.parent / "coworking-competa-upload.zip"

# Alles wat NIET online hoort
OVERSLAAN_MAPPEN = {".claude", "tools", ".git"}
OVERSLAAN_PADEN = {Path("images/origineel"), Path("images/nieuw")}
OVERSLAAN_BESTANDEN = {"CLAUDE.md", "logo-opties.html", "desktop.ini", ".DS_Store", "Thumbs.db"}


def hoort_online(pad: Path) -> bool:
    rel = pad.relative_to(PROJECT)
    if rel.parts[0] in OVERSLAAN_MAPPEN:
        return False
    if any(rel == p or p in rel.parents for p in OVERSLAAN_PADEN):
        return False
    if pad.name in OVERSLAAN_BESTANDEN or pad.suffix in {".py", ".md"}:
        return False
    return True


if UIT.exists():
    shutil.rmtree(UIT)
bestanden = sorted(p for p in PROJECT.rglob("*") if p.is_file() and hoort_online(p))

totaal = 0
with zipfile.ZipFile(ZIP, "w", zipfile.ZIP_DEFLATED) as z:
    for bron in bestanden:
        rel = bron.relative_to(PROJECT)
        doel = UIT / rel
        doel.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(bron, doel)
        z.write(bron, rel.as_posix())
        totaal += bron.stat().st_size

print(f"{len(bestanden)} bestanden, {totaal / 1024 / 1024:.1f} MB")
print(f"Map: {UIT}")
print(f"Zip: {ZIP} ({ZIP.stat().st_size / 1024 / 1024:.1f} MB)")
for bron in bestanden:
    print("  ", bron.relative_to(PROJECT).as_posix())
