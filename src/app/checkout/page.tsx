import type { Metadata } from "next";
import Link from "next/link";
import { CheckoutForm } from "./CheckoutForm";

export const metadata: Metadata = { title: "Оформлення замовлення", robots: { index: false } };

export default function CheckoutPage() {
  return (
    <div className="container">
      <div className="page-hero">
        <nav aria-label="Хлібні крихти">
          <ol className="breadcrumbs">
            <li>
              <Link href="/">Головна</Link>
            </li>
            <li>
              <Link href="/cart">Кошик</Link>
            </li>
            <li aria-current="page">Оформлення</li>
          </ol>
        </nav>
        <h1 className="page-title">Оформлення</h1>
      </div>
      <CheckoutForm />
    </div>
  );
}
