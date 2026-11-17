/**
 * Catalog domain types.
 * These mirror the future database schema (see README.md → roadmap) so that
 * swapping the static seed for Prisma/Postgres doesn't touch the UI.
 */

export type CategorySlug = "suits" | "outerwear" | "knit" | "dresses" | "bodysuits" | "tops" | "bottoms";

/** Colour families for the colour filter */
export type ColorFamily = "black" | "milk" | "grey" | "beige" | "brown" | "red" | "pink" | "blue" | "green" | "yellow";

/** Occasion («привід»): EGO sells ready capsules «до твоєї події» */
export type Activity = "everyday" | "event" | "office" | "cozy";

export interface ProductColor {
  name: string;
  /** Swatch colour */
  hex: string;
  family: ColorFamily;
  /** Index of the first gallery photo in this colour */
  image?: number;
  /** Price override for this colour (e.g. Red fleece costs more than Black) */
  price?: number;
  /** Out of stock, coming back («Очікується»): shown with its photos, but can't be ordered */
  soon?: boolean;
}

export interface ProductImage {
  src: string;
  alt: string;
}

/** Body measurements in cm, one row per size */
export interface SizeChart {
  columns: string[];
  rows: { size: string; values: string[] }[];
  note?: string;
}

export interface Product {
  id: string;
  slug: string;
  /** Model name as the brand writes it («SAPFIR», «HOME») or a plain Ukrainian name when the post has none */
  name: string;
  /** Garment type in Ukrainian: "Сукня міні" */
  kind: string;
  /** Named capsule the item belongs to */
  collection?: string;
  /** Short line shown above the name */
  tagline?: string;
  /** Base price (UAH); a colour may override it — always read it through priceFor() */
  price: number;
  compareAtPrice?: number;
  currency: "UAH";
  category: CategorySlug;
  activities: Activity[];
  colors: ProductColor[];
  /** Sizes exactly as published: ["42-44", "46-48"], ["One size"], ["34", "36"] */
  options: string[];
  /** Fabric line, only when the brand states it */
  fabric?: string;
  composition?: string;
  description: string;
  details: string[];
  care: string[];
  /** Model's parameters / size worn, when published */
  modelNote?: string;
  images: ProductImage[];
  badges?: ("new" | "bestseller" | "limited")[];
  /** Original Instagram posts (@ego.est__) — handy for the admin panel later */
  sources: string[];
  publishedAt: string; // ISO date of the latest post
  inStock: boolean;
  /** Sewn to order: lead time before dispatch, e.g. "5–7 робочих днів" — shown on PDP, card and in the order message */
  madeToOrder?: string;
}

export interface Category {
  slug: CategorySlug;
  title: string;
  description: string;
  image: string;
}

/** A styled set ("look") sold as separate items */
export interface Look {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  items: { slug: string; color?: string }[];
}

export interface ColorFilter {
  family: ColorFamily;
  label: string;
  hex: string;
}

export interface ActivityInfo {
  slug: Activity;
  title: string;
  image: string;
}
