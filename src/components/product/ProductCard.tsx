"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/catalog/types";
import { useCart } from "@/lib/cart/CartProvider";
import { formatPrice } from "@/lib/format";
import { priceFor } from "@/lib/catalog/price";
import { HeartIcon } from "@/components/ui/Icons";

const badgeLabels = { new: "New", bestseller: "Bestseller", limited: "Limited" } as const;

export function ProductCard({
  product,
  priority = false,
  sizes,
  initialColor = 0,
}: {
  product: Product;
  priority?: boolean;
  sizes?: string;
  /** Colour the card starts in (the /shop grid has one card per colour) */
  initialColor?: number;
}) {
  const { add, wishlist, toggleWish } = useCart();
  const [colorIdx, setColorIdx] = useState(initialColor);
  const [added, setAdded] = useState<string | null>(null);
  const wished = wishlist.includes(product.id);
  const color = product.colors[colorIdx];
  const price = priceFor(product, color?.name);
  const main = color?.image ?? 0;
  // Hover image: the next photo of the same colour, if there is one.
  const nextColorStart = product.colors.map((c) => c.image ?? 0).filter((i) => i > main).sort((a, b) => a - b)[0];
  const alt = main + 1 < product.images.length && main + 1 !== nextColorStart ? main + 1 : null;
  const href = `/product/${product.slug}${colorIdx ? `?color=${encodeURIComponent(color.name)}` : ""}`;
  const imgSizes = sizes ?? "(max-width: 760px) 50vw, (max-width: 1240px) 33vw, 25vw";

  function quickAdd(option: string) {
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[main].src,
      price,
      color: color?.name,
      option,
    });
    setAdded(option);
    window.setTimeout(() => setAdded(null), 1800);
  }

  return (
    <article className="card">
      <div className="card__frame">
        <Link href={href} className="card__media" aria-label={product.name}>
          <Image
            className="card__img"
            src={product.images[main].src}
            alt={product.images[main].alt}
            fill
            priority={priority}
            sizes={imgSizes}
            style={{ objectFit: "cover" }}
          />
          {alt !== null && (
            <Image
              className="card__img card__img--alt"
              src={product.images[alt].src}
              alt=""
              fill
              sizes={imgSizes}
              style={{ objectFit: "cover" }}
            />
          )}
        </Link>
        {product.madeToOrder ? (
          <div className="card__badges">
            <span className="tag">Під замовлення</span>
          </div>
        ) : product.badges && product.badges.length > 0 && (
          <div className="card__badges">
            {product.badges.slice(0, 1).map((b) => (
              <span key={b} className={`tag ${b === "limited" ? "tag--dark" : b === "new" ? "tag--cream" : ""}`}>
                {badgeLabels[b]}
              </span>
            ))}
          </div>
        )}
        <button
          className="card__wish"
          onClick={() => toggleWish(product.id)}
          aria-pressed={wished}
          aria-label={wished ? "Прибрати з обраного" : "Додати в обране"}
        >
          <HeartIcon width={19} height={19} />
        </button>
        <div className="card__quick">
          {added ? (
            <span className="card__added">Додано в кошик · {added}</span>
          ) : color?.soon ? (
            <span className="card__quick-label">{color.name} · Очікується</span>
          ) : (
            <>
              <span className="card__quick-label">Швидко додати{color ? ` · ${color.name}` : ""}</span>
              <div className="card__quick-sizes">
                {product.options.map((o) => (
                  <button key={o} onClick={() => quickAdd(o)} aria-label={`Додати ${product.name}, розмір ${o}`}>
                    {o}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="card__body">
        <div className="card__top">
          <Link href={href} className="card__name">
            {product.name}
          </Link>
          <span className="card__price">{formatPrice(price)}</span>
        </div>
        <span className="card__kind">{product.kind}</span>
        {product.colors.length > 1 && (
          <div className="swatches" role="group" aria-label="Кольори">
            {product.colors.map((c, i) => (
              <button
                key={c.name}
                className={`swatch ${c.soon ? "swatch--soon" : ""}`}
                style={{ backgroundColor: c.hex }}
                aria-pressed={i === colorIdx}
                aria-label={c.soon ? `${c.name} — очікується` : c.name}
                title={c.soon ? `${c.name} — очікується` : c.name}
                onClick={() => setColorIdx(i)}
                onMouseEnter={() => setColorIdx(i)}
              />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
