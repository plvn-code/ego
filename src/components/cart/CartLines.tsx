"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart/CartProvider";
import { formatPrice } from "@/lib/format";
import type { CartLine } from "@/lib/orders/types";

export function CartLines({
  editable = true,
  onNavigate,
  items,
}: {
  editable?: boolean;
  onNavigate?: () => void;
  /** Render these lines instead of the live cart (e.g. a placed order after the cart is cleared) */
  items?: CartLine[];
}) {
  const cart = useCart();
  const { setQuantity, remove } = cart;
  const lines = items ?? cart.lines;

  return (
    <ul>
      {lines.map((l) => (
        <li key={l.key} className="line">
          <Link href={`/product/${l.slug}`} className="line__img" onClick={onNavigate}>
            <Image src={l.image} alt={l.name} fill sizes="90px" style={{ objectFit: "cover" }} />
          </Link>
          <div className="line__body">
            <Link href={`/product/${l.slug}`} className="line__name" onClick={onNavigate}>
              {l.name}
            </Link>
            <span className="line__meta">
              {[l.color, l.option].filter(Boolean).join(" · ")}
              {!editable && ` · ${l.quantity} шт.`}
            </span>
            <span>{formatPrice(l.price * l.quantity)}</span>
            {editable && (
              <div className="line__bottom">
                <div className="qty qty--sm">
                  <button onClick={() => setQuantity(l.key, l.quantity - 1)} aria-label="Зменшити кількість">
                    −
                  </button>
                  <output aria-live="polite">{l.quantity}</output>
                  <button onClick={() => setQuantity(l.key, l.quantity + 1)} aria-label="Збільшити кількість">
                    +
                  </button>
                </div>
                <button className="line__remove" onClick={() => remove(l.key)}>
                  Видалити
                </button>
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
