import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllProductSlugs,
  getCategories,
  getLooksFor,
  getProductBySlug,
  getRelatedProducts,
  getSizeGuide,
} from "@/lib/catalog/repository";
import type { SearchParams } from "@/lib/catalog/params";
import { formatPrice } from "@/lib/format";
import { minPrice } from "@/lib/catalog/price";
import { site } from "@/lib/config/site";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchase } from "@/components/product/ProductPurchase";
import { ProductCard } from "@/components/product/ProductCard";
import { Rail } from "@/components/ui/Rail";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return (await getAllProductSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const product = await getProductBySlug((await params).slug);
  if (!product) return {};
  return {
    title: `${product.name} — ${product.kind}`,
    description: product.description,
    openGraph: { images: [product.images[0].src] },
  };
}

export default async function ProductPage({ params, searchParams }: { params: Params; searchParams: SearchParams }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const sp = await searchParams;
  const colorName = typeof sp.color === "string" ? sp.color : undefined;
  const initialColor = Math.max(0, product.colors.findIndex((c) => c.name === colorName));
  const [related, looks, chart, categories] = await Promise.all([
    getRelatedProducts(product, 8),
    getLooksFor(product),
    getSizeGuide(),
    getCategories(),
  ]);
  const category = categories.find((c) => c.slug === product.category)!;
  const look = looks[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: { "@type": "Brand", name: site.name },
    image: product.images.map((i) => `${site.url}${i.src}`),
    offers: {
      "@type": "Offer",
      priceCurrency: "UAH",
      price: minPrice(product),
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${site.url}/product/${product.slug}`,
    },
  };

  return (
    <>
      <div className="container">
        <nav aria-label="Хлібні крихти" style={{ padding: "22px 0" }}>
          <ol className="breadcrumbs">
            <li>
              <Link href="/">Головна</Link>
            </li>
            <li>
              <Link href={`/shop?category=${category.slug}`}>{category.title}</Link>
            </li>
            <li aria-current="page">{product.name}</li>
          </ol>
        </nav>

        <div className="pdp">
          <div>
            <ProductGallery images={product.images} starts={product.colors.map((c) => c.image ?? 0)} initial={product.colors[initialColor]?.image ?? 0} />
          </div>
          <div className="pdp__info">
            <ProductPurchase product={product} chart={chart} initialColor={initialColor} />
          </div>
        </div>
      </div>

      {look && (
        <section className="section section--soft" style={{ marginTop: "clamp(48px, 6vw, 100px)" }}>
          <div className="container ctl">
            <div className="ctl__media">
              <Image src={look.image} alt={`Капсула ${look.name}`} fill sizes="(max-width: 960px) 100vw, 45vw" style={{ objectFit: "cover" }} />
            </div>
            <div className="ctl__body">
              <span className="eyebrow">Доповни образ · {look.tagline}</span>
              <h2 className="title">
                Капсула <em>{look.name}</em>
              </h2>
              <p className="lead">{look.description}</p>
              <div className="ctl__items">
                {look.products.map(({ product: p, color, price }) => {
                  const c = p.colors.find((x) => x.name === color);
                  const img = p.images[c?.image ?? 0];
                  const href = `/product/${p.slug}${c && p.colors.indexOf(c) > 0 ? `?color=${encodeURIComponent(c.name)}` : ""}`;
                  return (
                    <div className="ctl__item" key={p.id}>
                      <Link href={href} className="ctl__thumb">
                        <Image src={img.src} alt={img.alt} fill sizes="84px" style={{ objectFit: "cover" }} />
                      </Link>
                      <div>
                        <Link href={href}>
                          <strong>{p.name}</strong>
                        </Link>
                        <span>
                          {color ?? p.kind} · {formatPrice(price)}
                        </span>
                      </div>
                      {p.id === product.id ? (
                        <span className="tag tag--cream">Ви тут</span>
                      ) : (
                        <Link href={href} className="btn btn--outline btn--sm">
                          Обрати
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="ctl__total">
                <span>Разом за капсулу</span>
                <b>{formatPrice(look.total)}</b>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container">
          <Rail
            label="Схожі товари"
            head={
              <>
                <span className="eyebrow">You may also like</span>
                <h2 className="title">
                  Тобі також <em>сподобається</em>
                </h2>
              </>
            }
          >
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </Rail>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
