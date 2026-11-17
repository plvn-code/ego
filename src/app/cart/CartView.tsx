"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart/CartProvider";
import { formatPrice, pluralItems } from "@/lib/format";
import { CartLines } from "@/components/cart/CartLines";

export function CartView() {
  const { ready, lines, count, subtotal } = useCart();

  if (!ready) return <div style={{ minHeight: "50vh" }} />;

  if (lines.length === 0) {
    return (
      <div className="empty" style={{ paddingBottom: 120 }}>
        <h2>Кошик порожній</h2>
        <p>Аутфіт твого комфортного дня вже чекає в каталозі.</p>
        <Link href="/shop" className="btn">
          До каталогу
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <CartLines />
      <aside className="summary" aria-label="Підсумок">
        <h2>Разом</h2>
        <div className="sum-row">
          <span>{pluralItems(count)}</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="sum-row">
          <span>Доставка</span>
          <span>за тарифами НП</span>
        </div>
        <div className="sum-row sum-row--total" style={{ borderTop: "1px solid var(--line-2)", paddingTop: 16 }}>
          <span>До сплати</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <Link href="/checkout" className="btn btn--block">
          Оформити замовлення
        </Link>
        <p className="note">Онлайн-оплата не потрібна: менеджер підтвердить замовлення та надішле реквізити.</p>
      </aside>
    </div>
  );
}
