# EGO — online store (client project)

Online store for **EGO** (Instagram @ego.est__, «EGO · women wear · estd 2026», ~2.9K followers) — women's clothing: suits (fleece, velour, knit, raincoat fabric), coats / trenches / bombers / faux fur, hoodies & longsleeves, dresses, bodysuits & corsets, shirts, jeans. Bio: «Жіночий одяг який ти захочеш · Швидка відправка · Повернення/обмін · Готові капсули до твоєї події». Until now they sold only via Instagram Direct. The repo owner is a developer (studio Superio) building the site for that client.

Built 2026-11-17 by copying the architecture of `~/Desktop/nudes` (the reference the user gave: nudes-fit.vercel.app) — cart → checkout → order to Telegram → «Дякуємо». Brief: «классный, дорогой, качественный сайт с анимациями, но в меру», **white + graphite**.

**Talk to the user in Russian.** Site UI copy is **Ukrainian**, informal «ти» like the brand's Instagram. Prices in **UAH** (`1 450 ₴`).

Before doing anything substantial, read `docs/STATUS.md` (done / open questions for the client).

## Commands

```bash
npm run build && npx next start -p 3017     # 3005 nudes · 3016 kishka · 3017 ego
npm run dev -- -p 3018                     # dev: orders are printed to the terminal instead of Telegram
npm run lint && npx tsc --noEmit           # must stay clean
open -a "Google Chrome" http://localhost:3017
~/Desktop/nudes/research/.venv/bin/python -I scripts/build_images.py   # rebuild public/images (Pillow venv borrowed from nudes)
```

GitHub: `origin` = github.com/plvn-code/ego (branch `main`; GitHub CLI at `~/.local/bin/gh`) — commit and push after each finished task. No Vercel project yet.

Restart only our port: `kill $(lsof -ti tcp:3017 -sTCP:LISTEN)`. After visible changes: build, restart, check 390px and 1440px (Playwright MCP), then tell the user. `node_modules` is a **symlink** to `~/Desktop/nudes/node_modules` (same package.json; the Mac is short on disk) — run `npm install` here only if dependencies change.

## Stack

Next.js 15 App Router · React 19 · TypeScript strict · plain CSS (`src/app/globals.css`; EGO overrides are the last block of the file) · self-hosted fonts in `public/fonts` — Montserrat variable 100–900 (the logo typeface; headings set at 300 with `em` at 500) + Lato (text) · `next/image`. No DB / auth / online payment by design. Orders → Telegram via `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` (`.env.example`, `src/lib/orders/notify.ts`); without them production refuses orders on purpose.

## Layout

```
src/app/            / · /shop (?category= &color= &size= &activity= &sort=) · /product/[slug] (?color=) · /looks (капсули) · /about
                    /size-guide · /contacts · /cart · /checkout · /wishlist · /info/[slug] (delivery, returns, offer, privacy)
                    api/orders (POST → validate → recompute from catalog → Telegram)
src/lib/catalog/    types.ts · data.ts (products, capsules, categories, colours, occasions, size chart) · repository.ts (ONLY read path)
                    image-counts.json — written by build_images.py, read by data.ts (photo count per slug)
src/lib/config/site.ts   brand, Instagram, Direct link, delivery wording
public/brand/       ego-logo(-white).png (full lockup, cut from post DXu_OHcAvZK), ego-mark(-white).png (EGO letters), icons
public/images/      products/<slug>/NN.jpg (3:4, ≤1200×1600) · editorial/*.jpg (hero, capsules, Instagram marquee)
scripts/            catalog_images.py (slug → Instagram frames, EDITORIAL map) · build_images.py · fetch_ig.py · sheets.py
originals/ig/<post>/NN.jpg   Instagram frames (git-ignored)   research/ig.json, captions.txt, sheets/ (git-ignored)
```

## Rules

- **Never invent product facts** (price, sizes, colours, fabric). Source: post captions (`research/captions.txt`, `research/ig.json`). Model names: where the post has a name it is used as is (SAPFIR, HOME, Bloom, PERSONALITY, SAN FRANCISCO, MELANSH, MINI KASHEMIR, DoberDollar, «in my prime era»); the other short English names (Backless, Drape, Fur Cuff…) are ours — listed in STATUS as a question.
- Supplier model codes from captions (1660kd, 312MA…) are kept out of the UI.
- Product colours: only colours **with their own photos** are selectable (`colors[].image` = first photo index, photos of one colour back to back, ordered by `image`). Published colours without photos go to `more` → «Також є: … — фото надішлемо в Direct».
- Occasions (`Activity`): everyday / event / office / cozy. Sizes are Ukrainian (42–48); `sizeCovers()` in repository.ts maps letters (S=42…) and jeans (34 = 40) for the size filter.
- New product: add frames in `scripts/catalog_images.py`, run build_images.py, add a `P({...})` entry in data.ts (`rm -rf .next/cache/images` before restart if photos changed).
- Palette: white + graphite only (`--graphite #1f2023`, `--ink #232427`, pearl greys). No colour accents. Motion moderate, everything behind `prefers-reduced-motion`.
- Photos: only clean frames from photo posts (no reels / video stills); MELANSH frames carry the brand's own «PREMIUM ЯКІСТЬ by EGO.est» card design — that's their layout, kept.
- Keep the security baseline: CSP/headers in `next.config.ts`, server recomputes prices, never commit `.env*`, `originals/`, `research/`.
