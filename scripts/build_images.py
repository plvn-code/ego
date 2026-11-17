"""Builds public/images/products/<slug>/NN.jpg (3:4, ≤1200×1600, q84) from originals/ig.
Run: ~/Desktop/nudes/research/.venv/bin/python -I scripts/build_images.py   (needs Pillow)"""
import json, shutil, sys
from pathlib import Path
from PIL import Image, ImageOps
sys.path.insert(0, str(Path(__file__).resolve().parent))
from catalog_images import EDITORIAL, PRODUCTS

ROOT = Path(__file__).resolve().parent.parent
IG = ROOT / "originals/ig"
OUT = ROOT / "public/images/products"
ED = ROOT / "public/images/editorial"

def crop34(im, g="c"):
    w, h = im.size
    if w / h > 0.75:
        nw = round(h * 0.75); x = (w - nw) // 2
        return im.crop((x, 0, x + nw, h))
    nh = round(w / 0.75)
    y = {"t": 0, "b": h - nh}.get(g, (h - nh) // 2)
    return im.crop((0, y, w, y + nh))

def save(src, dst, g="c"):
    im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
    im = crop34(im, g)
    if im.width > 1200:
        im = im.resize((1200, 1600), Image.LANCZOS)
    dst.parent.mkdir(parents=True, exist_ok=True)
    im.save(dst, "JPEG", quality=84, optimize=True, progressive=True)

if __name__ == "__main__":
    shutil.rmtree(OUT, ignore_errors=True)
    shutil.rmtree(ED, ignore_errors=True)
    for name, f in EDITORIAL.items():
        save(IG / f"{f}.jpg", ED / f"{name}.jpg")
    counts = {}
    for slug, frames in PRODUCTS.items():
        for i, f in enumerate(frames):
            name, g = (f if isinstance(f, tuple) else (f, "c"))
            save(IG / f"{name}.jpg", OUT / slug / f"{i + 1:02d}.jpg", g)
        counts[slug] = len(frames)
    (ROOT / "src/lib/catalog/image-counts.json").write_text(json.dumps(counts, indent=1))
    print(len(counts), "products", sum(counts.values()), "photos")
