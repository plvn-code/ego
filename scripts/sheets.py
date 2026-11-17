"""Contact sheets of originals/ig/<code>/*.jpg — one row per post, labelled (research/sheets/sheet_N.jpg)."""
import json, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageOps
ROOT = Path(__file__).resolve().parent.parent
d = {p["code"]: p for p in json.load(open(ROOT / "research/ig.json"))["posts"]}
codes = sorted((ROOT / "originals/ig").iterdir(), key=lambda p: -(d[p.name]["taken"] or 0))
TH = 300; TW = 225; PER = 7
for s in range(0, len(codes), PER):
    rows = codes[s:s + PER]
    W = 260 + TW * 12
    img = Image.new("RGB", (W, TH * len(rows)), "white"); dr = ImageDraw.Draw(img)
    for r, c in enumerate(rows):
        cap = d[c.name]["caption"].split("\n")
        dr.text((6, r * TH + 6), c.name, fill="black")
        for k, line in enumerate(cap[:8]): dr.text((6, r * TH + 24 + k * 14), line[:40].encode("latin-1", "replace").decode("latin-1"), fill="gray")
        for k, f in enumerate(sorted(c.glob("*.jpg"))[:12]):
            im = ImageOps.fit(ImageOps.exif_transpose(Image.open(f)).convert("RGB"), (TW - 4, TH - 4))
            img.paste(im, (260 + k * TW, r * TH + 2)); dr.text((262 + k * TW, r * TH + 4), f.stem, fill="red")
    img.save(ROOT / f"research/sheets/sheet_{s // PER}.jpg", quality=80)
print((len(codes) + PER - 1) // PER, "sheets")
