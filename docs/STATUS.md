# Status

_Last updated: 2026-11-17._ Update this file at the end of every session.

## Done (2026-11-17)

- Project created from the NUDES architecture (`~/Desktop/nudes`), UI re-themed to **white + graphite**: graphite ticker, intro curtain, footer and «Evening» feature; light Montserrat headings (the logo font); client logo cut from their Instagram post.
- Instagram @ego.est__ researched: 215 posts (157 carousels, 54 reels, 4 photos), captions in `research/captions.txt`, 8 highlights (Відгуки, Огляди, Костюми, Живі відео, Купальники, Look, SOS, Сукні — not parsed).
- Catalogue: **50 products, 260 photos** — autumn/winter 2026 first (Sep–Nov posts), plus the strongest summer/evening pieces. 7 categories, 4 occasions, 6 capsules (Grey Mood, Date Night, Chocolate, Office Chic, Evening, Total Milk).
- Pages: home (intro, hero ×4, categories, new arrivals, Evening feature, colours, capsules, bestsellers, HOME hoodie feature with 9 swatches, occasions, fabrics, manifesto, Instagram marquee, perks), `/shop` with filters, product page, `/looks`, `/about`, `/size-guide`, `/contacts` + FAQ, info pages, cart, checkout, wishlist.
- Checked: tsc + lint clean, build OK, 1440 and 390 px, no horizontal overflow.

## Questions for the client

1. **Model names.** Instagram names are used as is (SAPFIR, HOME, Bloom, PERSONALITY, SAN FRANCISCO, MELANSH, MINI KASHEMIR, DoberDollar, In My Prime Era). All others are ours: Mesh, Backless, Alpaca, Fluffy, Thermo, Wrap Waist, Drape, Snow, Open Back, Bomber Coat, NEYLON (from the reel caption), Cozy Piping, Two Tone, Belted, French Lace, Soft Knit, Zip Knit, Seam, Tie, Train, Velour Flare, Trench & Skirt, Architect, Fur Cuff, Crinkle, Lace Hem, Organza, Pink Piping, Date, Leather, Plush, Lace Classic, Lace Corset, Stripe, Boyfriend, Slip, Polka, Old Money, Silk, Peony, Riviera — approve or send their names.
2. **Stock.** Which of the 50 models are still available (summer dresses, satin sets, silk top are from May–Aug)? Anything sold out to hide?
3. **Colours without photos** (shown as «Також є: …»): e.g. MELANSH black/beige/pink, Backless suit barbie, MINI KASHEMIR melange/milk/black, Train dress red/chocolate, Bomber Coat milk… — photos would let us make them selectable.
4. **Fluffy faux-fur jacket**: the post has no colour names — we called them «Світла» / «Темна».
5. **Delivery & returns**: bio says only «Швидка відправка · Повернення/обмін». Need: dispatch time / cut-off, delivery cost, return period (days), who pays return shipping, payment methods (card / IBAN / COD), international shipping?
6. **Size chart**: the site shows an approximate Ukrainian chart (42–48) — send theirs if they have one.
7. **Contacts**: phone / Telegram / e-mail, city, FOP details for the public offer.
8. **Telegram bot** for orders: token from @BotFather + chat id → `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`.
9. **Domain** and whether to deploy on Vercel.
10. Better-quality originals of the photos (Instagram gives 960–1440 px), and a vector logo if they have one.

## Next steps

1. Show the client, collect answers to the questions above.
2. GitHub repo + Vercel (ask the user first), bot env, domain, launch (`NEXT_PUBLIC_ALLOW_INDEXING=true`).
