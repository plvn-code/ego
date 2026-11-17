"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/lib/cart/CartProvider";
import { formatPrice, pluralItems } from "@/lib/format";
import { CloseIcon } from "@/components/ui/Icons";
import { CartLines } from "./CartLines";

export function CartDrawer() {
  const { isOpen, close, lines, count, subtotal } = useCart();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  return (
    <>
      <div className={`drawer-backdrop ${isOpen ? "drawer-backdrop--open" : ""}`} onClick={close} />
      <aside className={`drawer ${isOpen ? "drawer--open" : ""}`} aria-label="Кошик" inert={!isOpen}>
        <div className="drawer__head">
          <h2>
            Кошик{" "}
            <small className="note">
              {pluralItems(count)}
            </small>
          </h2>
          <button className="icon-btn" onClick={close} aria-label="Закрити кошик">
            <CloseIcon />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="drawer__body empty">
            <h2>Кошик порожній</h2>
            <p>Аутфіт твого комфортного дня вже чекає.</p>
            <Link href="/shop" className="btn" onClick={close}>
              До каталогу
            </Link>
          </div>
        ) : (
          <>
            <div className="drawer__body">
              <CartLines onNavigate={close} />
            </div>
            <div className="drawer__foot">
              <div className="sum-row sum-row--total">
                <span>Разом</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <p className="note">Доставка — за тарифами Нової пошти. Оплата після підтвердження замовлення менеджером.</p>
              <Link href="/checkout" className="btn btn--block" onClick={close}>
                Оформити замовлення
              </Link>
              <Link href="/cart" className="btn btn--outline btn--block" onClick={close}>
                Переглянути кошик
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
