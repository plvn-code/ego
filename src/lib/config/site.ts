export const site = {
  name: "EGO",
  handle: "ego.est__",
  tagline: "Women wear · estd 2026",
  motto: "Жіночий одяг, який ти захочеш",
  description:
    "EGO — жіночий одяг, який ти захочеш: костюми, пальта, сукні, худі та боді. Готові капсули до твоєї події, швидка відправка, обмін і повернення.",
  /** Canonical origin: NEXT_PUBLIC_SITE_URL (custom domain) → Vercel production URL → localhost */
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3017"),
  /** Search indexing is off until the client approves the launch */
  indexable: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",
  locale: "uk-UA",
  currency: "UAH",
  socials: {
    instagram: { label: "Instagram", handle: "@ego.est__", url: "https://www.instagram.com/ego.est__/" },
  },
  /** Direct — for questions and help with sizing */
  directUrl: "https://ig.me/m/ego.est__",
  /** Bio: «Швидка відправка · Повернення/обмін». Exact cut-off times and terms — ask the client. */
  delivery: {
    term: "1–3 робочі дні по Україні",
  },
} as const;

export const navigation = [
  { href: "/shop", label: "Каталог" },
  { href: "/shop?sort=new", label: "Новинки" },
  { href: "/looks", label: "Капсули" },
  { href: "/about", label: "Про бренд" },
  { href: "/size-guide", label: "Розміри" },
  { href: "/contacts", label: "Контакти" },
] as const;
