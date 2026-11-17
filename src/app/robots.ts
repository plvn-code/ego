import type { MetadataRoute } from "next";
import { site } from "@/lib/config/site";

export default function robots(): MetadataRoute.Robots {
  // Pre-launch: hidden from search engines until NEXT_PUBLIC_ALLOW_INDEXING=true is set in Vercel.
  if (!site.indexable) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/checkout", "/cart", "/account"] },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
