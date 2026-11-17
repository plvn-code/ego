import type { Product } from "./types";

/** Price of a product in the given colour: the colour's own price if it has one, else the base price. */
export function priceFor(product: Product, colorName?: string): number {
  return product.colors.find((c) => c.name === colorName)?.price ?? product.price;
}

/** Lowest price across colours — for sorting, JSON-LD and "від …" labels. */
export function minPrice(product: Product): number {
  return Math.min(product.price, ...product.colors.map((c) => c.price ?? product.price));
}
