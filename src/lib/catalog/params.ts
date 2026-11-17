import type { SortKey } from "./repository";
import type { Activity, CategorySlug, ColorFamily } from "./types";

export type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const SORTS: SortKey[] = ["new", "price-asc", "price-desc"];
const CATEGORIES: CategorySlug[] = ["suits", "outerwear", "knit", "dresses", "bodysuits", "tops", "bottoms"];
const COLORS: ColorFamily[] = ["black", "milk", "grey", "beige", "brown", "red", "pink", "blue", "green", "yellow"];
const ACTIVITIES: Activity[] = ["everyday", "event", "office", "cozy"];
/** Ukrainian sizes; letter and jeans sizes are mapped onto them in repository.ts */
export const SIZES = ["42", "44", "46", "48"] as const;

const pick = <T extends string>(value: string | undefined, allowed: readonly T[]) =>
  value && (allowed as readonly string[]).includes(value) ? (value as T) : undefined;

export function parseListParams(sp: Record<string, string | string[] | undefined>) {
  const one = (k: string) => (Array.isArray(sp[k]) ? sp[k]?.[0] : sp[k]) as string | undefined;
  return {
    sort: pick(one("sort"), SORTS) ?? "new",
    category: pick(one("category"), CATEGORIES),
    color: pick(one("color"), COLORS),
    activity: pick(one("activity"), ACTIVITIES),
    size: pick(one("size"), SIZES),
  };
}
