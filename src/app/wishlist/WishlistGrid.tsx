"use client";

import Link from "next/link";
import type { Product } from "@/lib/catalog/types";
import { useCart } from "@/lib/cart/CartProvider";
import { ProductCard } from "@/components/product/ProductCard";

export function WishlistGrid({ products }: { products: Product[] }) {
  const { ready, wishlist } = useCart();
  if (!ready) return <div style={{ minHeight: "50vh" }} />;

  const items = products.filter((p) => wishlist.includes(p.id));
  if (items.length === 0) {
    return (
      <div className="empty" style={{ paddingBottom: 120 }}>
        <h2>Тут поки порожньо</h2>
        <p>Натискай на сердечко на товарі — і він збережеться тут, щоб повернутися до нього пізніше.</p>
        <Link href="/shop" className="btn">
          До каталогу
        </Link>
      </div>
    );
  }
  return (
    <div className="grid" style={{ paddingTop: 0, paddingBottom: 60 }}>
      {items.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
