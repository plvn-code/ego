import type { Metadata } from "next";
import Link from "next/link";
import { CartView } from "./CartView";

export const metadata: Metadata = { title: "Кошик", robots: { index: false } };

export default function CartPage() {
  return (
    <div className="container">
      <div className="page-hero">
        <nav aria-label="Хлібні крихти">
          <ol className="breadcrumbs">
            <li>
              <Link href="/">Головна</Link>
            </li>
            <li aria-current="page">Кошик</li>
          </ol>
        </nav>
        <h1 className="page-title">Кошик</h1>
      </div>
      <CartView />
    </div>
  );
}
