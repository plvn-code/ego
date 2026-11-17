"""Download photo frames of selected Instagram posts into originals/ig/<code>/NN.jpg (skips video frames)."""
import json, sys, urllib.request, concurrent.futures as cf
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
d = json.load(open(ROOT / "research/ig.json"))
posts = {p["code"]: p for p in d["posts"]}
codes = sys.argv[1:]
jobs = []
for c in codes:
    for i, m in enumerate(posts[c]["media"]):
        if m["video"] or not m["url"]:
            continue
        out = ROOT / "originals/ig" / c / f"{i:02d}.jpg"
        if not out.exists():
            jobs.append((m["url"], out))
def get(job):
    url, out = job
    out.parent.mkdir(parents=True, exist_ok=True)
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    out.write_bytes(urllib.request.urlopen(req, timeout=30).read())
    return out
with cf.ThreadPoolExecutor(8) as ex:
    n = sum(1 for _ in ex.map(get, jobs))
print(n, "files")
