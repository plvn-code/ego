import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { getActivities, getCategories, getColorFilters, listProducts } from "@/lib/catalog/repository";
import { parseListParams, SIZES, type SearchParams } from "@/lib/catalog/params";
import { ProductCard } from "@/components/product/ProductCard";
import { SortSelect } from "@/components/catalog/SortSelect";

export const metadata: Metadata = {
  title: "Каталог",
  description: "Костюми, пальта, сукні, худі, боді та джинси EGO — жіночий одяг, який ти захочеш.",
};

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const params = parseListParams(await searchParams);
  const [products, categories, colors, activities] = await Promise.all([
    listProducts(params),
    getCategories(),
    getColorFilters(),
    getActivities(),
  ]);
  const category = categories.find((c) => c.slug === params.category);
  const activity = activities.find((a) => a.slug === params.activity);
  const color = colors.find((c) => c.family === params.color);

  /** Builds a /shop URL from the current filters with one key changed (undefined removes it). */
  const href = (patch: Record<string, string | undefined>) => {
    const q = new URLSearchParams();
    const merged = { category: params.category, color: params.color, size: params.size, activity: params.activity, sort: params.sort === "new" ? undefined : params.sort, ...patch };
    for (const [k, v] of Object.entries(merged)) if (v) q.set(k, v);
    const s = q.toString();
    return s ? `/shop?${s}` : "/shop";
  };
  const filtered = Boolean(params.color || params.size || params.activity);
  const title = category?.title ?? activity?.title ?? "Каталог";

  return (
    <div className="container">
      <div className="page-hero">
        <nav aria-label="Хлібні крихти">
          <ol className="breadcrumbs">
            <li>
              <Link href="/">Головна</Link>
            </li>
            {category || activity ? (
              <>
                <li>
                  <Link href="/shop">Каталог</Link>
                </li>
                <li aria-current="page">{title}</li>
              </>
            ) : (
              <li aria-current="page">Каталог</li>
            )}
          </ol>
        </nav>
        <h1 className="page-title">
          {title}
          <sup>{products.length}</sup>
        </h1>
        {category && <p className="lead">{category.description}</p>}
      </div>

      <nav className="tabs" aria-label="Категорії">
        <Link href={href({ category: undefined })} className="chip" aria-current={!params.category}>
          Усі
        </Link>
        {categories.map((c) => (
          <Link key={c.slug} href={href({ category: c.slug })} className="chip" aria-current={params.category === c.slug}>
            {c.title} <small>{c.count}</small>
          </Link>
        ))}
      </nav>

      <div className="filters">
        <div className="filters__group" role="group" aria-label="Колір">
          <span className="filters__label">Колір</span>
          {colors.map((c) => (
            <Link
              key={c.family}
              href={href({ color: params.color === c.family ? undefined : c.family })}
              className="color-dot"
              style={{ background: c.hex }}
              aria-current={params.color === c.family}
              aria-label={c.label}
              title={c.label}
            />
          ))}
        </div>
        <div className="filters__group" role="group" aria-label="Розмір">
          <span className="filters__label">Розмір</span>
          {SIZES.map((s) => (
            <Link key={s} href={href({ size: params.size === s ? undefined : s })} className="size-link" aria-current={params.size === s}>
              {s}
            </Link>
          ))}
        </div>
        <div className="filters__group" role="group" aria-label="Активність">
          <span className="filters__label">Для</span>
          {activities.map((a) => (
            <Link
              key={a.slug}
              href={href({ activity: params.activity === a.slug ? undefined : a.slug })}
              className="chip"
              aria-current={params.activity === a.slug}
            >
              {a.title}
            </Link>
          ))}
        </div>
        <div className="filters__group">
          {filtered && (
            <Link href={href({ color: undefined, size: undefined, activity: undefined })} className="reset-link">
              Скинути фільтри{color ? ` (${color.label})` : ""}
            </Link>
          )}
          <Suspense>
            <SortSelect value={params.sort} />
          </Suspense>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="empty">
          <h2>Нічого не знайшли</h2>
          <p>Спробуй інший колір чи розмір — або напиши нам у Direct, підкажемо, що буде в наявності.</p>
          <Link href="/shop" className="btn">
            Весь каталог
          </Link>
        </div>
      ) : (
        <div className="grid" style={{ paddingBottom: 40 }}>
          {products.map((p, i) => (
            // One card per product; with a colour filter the card opens in the matching colour.
            <ProductCard key={p.id} product={p} initialColor={Math.max(0, p.colors.findIndex((c) => c.family === params.color))} priority={i < 4} />
          )).flatMap((card, i) =>
            // Editorial tile after the 6th product on the unfiltered catalog.
            i === 5 && !params.category && !filtered
              ? [
                  card,
                  <Link key="promo" href="/looks" className="grid-promo">
                    <Image src="/images/editorial/date-night.jpg" alt="" fill sizes="(max-width: 760px) 100vw, 50vw" style={{ objectFit: "cover", objectPosition: "center 25%" }} />
                    <div>
                      <span className="eyebrow" style={{ color: "#fff" }}>
                        Готові капсули
                      </span>
                      <span className="title">
                        Образ до <em>твоєї події</em>
                      </span>
                      <span className="btn btn--light btn--sm">Дивитися капсули</span>
                    </div>
                  </Link>,
                ]
              : [card],
          )}
        </div>
      )}
    </div>
  );
}
