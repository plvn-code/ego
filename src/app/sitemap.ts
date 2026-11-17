import type { MetadataRoute } from "next";
import { getAllProductSlugs } from "@/lib/catalog/repository";
import { infoPages } from "@/lib/content/info";
import { site } from "@/lib/config/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const statics = ["", "/shop", "/looks", "/about", "/size-guide", "/contacts"];
  const slugs = await getAllProductSlugs();
  return [
    ...statics.map((p) => ({ url: `${site.url}${p}` })),
    ...slugs.map((s) => ({ url: `${site.url}/product/${s}` })),
    ...infoPages.map((p) => ({ url: `${site.url}/info/${p.slug}` })),
  ];
}
