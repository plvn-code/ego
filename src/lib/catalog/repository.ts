import "server-only";
import { activities, categories, colorFilters, looks, products, sizeGuide } from "./data";
import { minPrice, priceFor } from "./price";
import type { Activity, CategorySlug, ColorFamily, Look, Product } from "./types";

/**
 * Catalog repository — the only place the UI reads products from.
 * Today it reads the static seed; later each function becomes a DB query
 * (Prisma) without changing any page or component.
 */

export type SortKey = "new" | "price-asc" | "price-desc";

export interface ProductQuery {
  category?: CategorySlug;
  color?: ColorFamily;
  activity?: Activity;
  size?: string;
  sort?: SortKey;
}

const sorters: Record<SortKey, (a: Product, b: Product) => number> = {
  new: (a, b) => b.publishedAt.localeCompare(a.publishedAt),
  "price-asc": (a, b) => minPrice(a) - minPrice(b),
  "price-desc": (a, b) => minPrice(b) - minPrice(a),
};

/** Letter sizes → Ukrainian sizes (XS 40 · S 42 · M 44 · L 46 · XL 48). */
const LETTER: Record<string, number> = { XS: 40, S: 42, M: 44, L: 46, XL: 48, "2XL": 50 };

/** One size end → Ukrainian size; jeans sizes (34–42, EU) are +6. */
function toUa(part: string): number | null {
  const t = part.trim().toUpperCase().replace("С", "S").replace("М", "M");
  if (t in LETTER) return LETTER[t];
  const n = Number(t);
  if (!Number.isFinite(n)) return null;
  return n < 40 ? n + 6 : n;
}

/** "42-44" covers 42 and 44, "42-46" also 44, "S-L" covers 42–46, "One size" covers everything. */
export function sizeCovers(option: string, size: string) {
  const want = Number(size);
  const parts = option.split(/[-–/]/).map(toUa);
  if (parts.some((x) => x === null)) return true; // One size / універсальний
  const nums = parts as number[];
  return want >= Math.min(...nums) && want <= Math.max(...nums);
}

function fitsSize(p: Product, size: string) {
  return p.options.some((o) => sizeCovers(o, size));
}

export async function listProducts(query: ProductQuery = {}): Promise<Product[]> {
  const { category, color, activity, size, sort = "new" } = query;
  return products
    .filter((p) => !category || p.category === category)
    .filter((p) => !color || p.colors.some((c) => c.family === color))
    .filter((p) => !activity || p.activities.includes(activity))
    .filter((p) => !size || fitsSize(p, size))
    .sort(sorters[sort] ?? sorters.new);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return products.find((p) => p.slug === slug) ?? null;
}

export async function getProductById(id: string): Promise<Product | null> {
  return products.find((p) => p.id === id) ?? null;
}

export async function getProductsBySlugs(slugs: string[]): Promise<Product[]> {
  return slugs.map((s) => products.find((p) => p.slug === s)).filter((p): p is Product => Boolean(p));
}

export async function getAllProductSlugs(): Promise<string[]> {
  return products.map((p) => p.slug);
}

export async function getNewArrivals(limit = 8): Promise<Product[]> {
  return [...products].sort(sorters.new).slice(0, limit);
}

export async function getBestsellers(limit = 8): Promise<Product[]> {
  return products.filter((p) => p.badges?.includes("bestseller")).slice(0, limit);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const others = [...products].filter((p) => p.id !== product.id).sort(sorters.new);
  const sameCollection = product.collection ? others.filter((p) => p.collection === product.collection) : [];
  const sameCategory = others.filter((p) => p.category === product.category && !sameCollection.includes(p));
  const rest = others.filter((p) => !sameCollection.includes(p) && !sameCategory.includes(p));
  return [...sameCollection, ...sameCategory, ...rest].slice(0, limit);
}

export interface ResolvedLook extends Look {
  products: { product: Product; color?: string; price: number }[];
  total: number;
}

function resolveLook(look: Look): ResolvedLook {
  const items = look.items.flatMap((i) => {
    const product = products.find((p) => p.slug === i.slug);
    return product ? [{ product, color: i.color, price: priceFor(product, i.color) }] : [];
  });
  return { ...look, products: items, total: items.reduce((s, i) => s + i.price, 0) };
}

export async function getLooks(): Promise<ResolvedLook[]> {
  return looks.map(resolveLook);
}

/** Sets that include this product — for "Complete the look" on the product page */
export async function getLooksFor(product: Product): Promise<ResolvedLook[]> {
  return looks.filter((l) => l.items.some((i) => i.slug === product.slug)).map(resolveLook);
}

export async function getCategories() {
  const counts = new Map<CategorySlug, number>();
  for (const p of products) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
  return categories.map((c) => ({ ...c, count: counts.get(c.slug) ?? 0 }));
}

export async function getColorFilters() {
  return colorFilters;
}

export async function getActivities() {
  return activities;
}

export async function getSizeGuide() {
  return sizeGuide;
}
