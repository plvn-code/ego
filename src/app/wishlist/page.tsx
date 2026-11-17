import type { Metadata } from "next";
import Link from "next/link";
import { listProducts } from "@/lib/catalog/repository";
import { WishlistGrid } from "./WishlistGrid";

export const metadata: Metadata = { title: "Обране", robots: { index: false } };

export default async function WishlistPage() {
  const products = await listProducts();
  return (
    <div className="container">
      <div className="page-hero">
        <nav aria-label="Хлібні крихти">
          <ol className="breadcrumbs">
            <li>
              <Link href="/">Головна</Link>
            </li>
            <li aria-current="page">Обране</li>
          </ol>
        </nav>
        <h1 className="page-title">Обране</h1>
      </div>
      <WishlistGrid products={products} />
    </div>
  );
}
