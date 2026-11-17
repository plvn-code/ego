"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Product, SizeChart as Chart } from "@/lib/catalog/types";
import { useCart } from "@/lib/cart/CartProvider";
import { formatPrice } from "@/lib/format";
import { priceFor } from "@/lib/catalog/price";
import { site } from "@/lib/config/site";
import { CloseIcon, GlobeIcon, HeartIcon, ReturnIcon, RulerIcon, SendIcon, TruckIcon, ClockIcon } from "@/components/ui/Icons";
import { GALLERY_EVENT } from "./ProductGallery";
import { SizeChart } from "./SizeChart";

const tokens = (s: string) => s.split("-");

export function ProductPurchase({ product, chart, initialColor }: { product: Product; chart: Chart; initialColor: number }) {
  const router = useRouter();
  const { add, wishlist, toggleWish } = useCart();
  const single = product.options.length === 1;
  const [colorIdx, setColorIdx] = useState(initialColor);
  const [option, setOption] = useState<string | null>(single ? product.options[0] : null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState(false);
  const [chartOpen, setChartOpen] = useState(false);
  const wished = wishlist.includes(product.id);
  const color = product.colors[colorIdx];
  const price = priceFor(product, color?.name);
  const oneSize = product.options.includes("One size");
  const highlight = chart.rows
    .map((r) => r.size)
    .filter((row) => product.options.some((o) => tokens(o).some((t) => tokens(row).includes(t))));

  useEffect(() => {
    if (!chartOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setChartOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [chartOpen]);

  function pickColor(i: number) {
    setColorIdx(i);
    const img = product.colors[i].image;
    if (img !== undefined) window.dispatchEvent(new CustomEvent(GALLERY_EVENT, { detail: img }));
    const url = new URL(window.location.href);
    if (i === 0) url.searchParams.delete("color");
    else url.searchParams.set("color", product.colors[i].name);
    window.history.replaceState(null, "", url);
  }

  function addToCart(): boolean {
    if (color?.soon) return false;
    if (!option) {
      setError(true);
      return false;
    }
    add(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.images[color?.image ?? 0].src,
        price,
        color: color?.name,
        option,
      },
      qty,
    );
    return true;
  }

  function buyNow() {
    if (addToCart()) router.push("/checkout");
  }

  return (
    <>
      <div className="pdp__head">
        <span className="eyebrow">{product.collection ?? product.tagline ?? "EGO"}</span>
        <h1 className="pdp__title">{product.name}</h1>
        <p className="pdp__kind">{product.kind}</p>
      </div>
      <p className="pdp__price" aria-live="polite">
        {formatPrice(price)}
      </p>
      {product.madeToOrder && (
        <p className="pdp__order-note">
          <ClockIcon width={18} height={18} /> Під замовлення — відправка через {product.madeToOrder}
        </p>
      )}
      <p className="lead">{product.description}</p>

      {product.colors.length > 0 && (
        <div>
          <div className="field-label">
            Колір <span>{color?.soon ? `${color.name} · Очікується` : color?.name}</span>
          </div>
          <div className="color-opts" role="radiogroup" aria-label="Колір">
            {product.colors.map((c, i) => (
              <button
                key={c.name}
                className={`color-opt ${c.soon ? "color-opt--soon" : ""}`}
                role="radio"
                aria-checked={i === colorIdx}
                aria-label={c.soon ? `${c.name} — очікується` : c.name}
                title={c.soon ? `${c.name} — очікується` : c.name}
                onClick={() => pickColor(i)}
              >
                <i style={{ backgroundColor: c.hex }} />
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="field-label">
          Розмір
          {!oneSize && (
            <button type="button" onClick={() => setChartOpen(true)}>
              <RulerIcon width={15} height={15} /> Розмірна сітка
            </button>
          )}
        </div>
        <div className={`size-opts ${error ? "size-opts--error" : ""}`} role="radiogroup" aria-label="Розмір">
          {product.options.map((o) => (
            <button
              key={o}
              className="size-opt"
              role="radio"
              aria-checked={o === option}
              onClick={() => {
                setOption(o);
                setError(false);
              }}
            >
              {o}
            </button>
          ))}
        </div>
        {error && (
          <p className="field-error" role="alert">
            Обери розмір, будь ласка
          </p>
        )}
      </div>

      {color?.soon ? (
        <div className="pdp__soon">
          <button className="btn" disabled>
            Очікується
          </button>
          <p className="note">
            {color.name} зараз немає в наявності.{" "}
            <a href={site.directUrl} target="_blank" rel="noreferrer" className="text-link">
              Напиши нам у Direct
            </a>
            , щоб дізнатися, коли колір з&apos;явиться.
          </p>
        </div>
      ) : (
        <div className="pdp__actions">
          <div className="qty">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Зменшити кількість">
              −
            </button>
            <output aria-live="polite">{qty}</output>
            <button onClick={() => setQty((q) => Math.min(10, q + 1))} aria-label="Збільшити кількість">
              +
            </button>
          </div>
          <button className="btn" onClick={addToCart}>
            Додати в кошик
          </button>
          <button className="btn btn--outline" onClick={buyNow}>
            Купити зараз
          </button>
        </div>
      )}

      <button className="pdp__wish" onClick={() => toggleWish(product.id)} aria-pressed={wished}>
        <HeartIcon width={17} height={17} style={{ fill: wished ? "currentColor" : "none" }} />
        <span className="text-link">{wished ? "В обраному" : "Додати в обране"}</span>
      </button>

      <div className="pdp__help">
        <SendIcon width={18} height={18} />
        <span>
          Не впевнена в розмірі? Напиши свій зріст і параметри{" "}
          <a href={site.directUrl} target="_blank" rel="noreferrer">
            нам у Direct
          </a>{" "}
          — підберемо ідеальну посадку.
        </span>
      </div>

      <div className="accordion">
        <details open>
          <summary>Деталі</summary>
          <div className="accordion__body">
            <ul>
              {product.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
            {product.modelNote && <p className="note">{product.modelNote}</p>}
          </div>
        </details>
        {(product.fabric || product.care.length > 0) && (
          <details>
            <summary>Тканина та догляд</summary>
            <div className="accordion__body">
              <dl className="spec-list">
                {product.fabric && (
                  <div>
                    <dt>Тканина</dt>
                    <dd>{product.fabric}</dd>
                  </div>
                )}
                {product.composition && (
                  <div>
                    <dt>Склад</dt>
                    <dd>{product.composition}</dd>
                  </div>
                )}
              </dl>
              {product.care.length > 0 && (
                <ul>
                  {product.care.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              )}
            </div>
          </details>
        )}
        <details>
          <summary>Доставка та оплата</summary>
          <div className="accordion__body">
            {product.madeToOrder && (
              <p>
                Цю річ шиємо під замовлення: відправимо через {product.madeToOrder} після підтвердження замовлення.
              </p>
            )}
            <p>
              Швидка відправка Новою поштою — до відділення, поштомату або кур&apos;єром. Термін — {site.delivery.term}.
            </p>
            <p>
              Після оформлення менеджер зв&apos;яжеться з тобою, підтвердить замовлення та надішле реквізити для оплати.{" "}
              <Link href="/info/delivery" className="text-link">
                Детальніше
              </Link>
            </p>
          </div>
        </details>
        <details>
          <summary>Обмін і повернення</summary>
          <div className="accordion__body">
            <p>
              Якщо річ не підійшла — напиши нам, і ми оформимо обмін або повернення. Товар має бути новим, без слідів носіння,
              у повній комплектації.{" "}
              <Link href="/info/returns" className="text-link">
                Умови
              </Link>
            </p>
          </div>
        </details>
      </div>

      <ul className="mini-perks">
        <li>
          <ClockIcon width={18} height={18} />{" "}
          {product.madeToOrder ? `Відправка через ${product.madeToOrder}` : "Швидка відправка"}
        </li>
        <li>
          <TruckIcon width={18} height={18} /> Нова пошта {site.delivery.term}
        </li>
        <li>
          <GlobeIcon width={18} height={18} /> Готові капсули до твоєї події
        </li>
        <li>
          <ReturnIcon width={18} height={18} /> Обмін і повернення
        </li>
      </ul>

      {chartOpen && (
        <div className="modal" role="dialog" aria-modal="true" aria-label="Розмірна сітка" onClick={() => setChartOpen(false)}>
          <div className="modal__panel" onClick={(e) => e.stopPropagation()}>
            <button className="modal__close" onClick={() => setChartOpen(false)} aria-label="Закрити">
              <CloseIcon width={20} height={20} />
            </button>
            <span className="eyebrow">Size guide</span>
            <h2 className="title">Розмірна сітка</h2>
            <p className="note">
              Розміри {product.name}: <strong style={{ color: "var(--ink)" }}>{product.options.join(" · ")}</strong>. Підсвічені рядки
              відповідають цій моделі.
            </p>
            <SizeChart chart={chart} caption={`Розмірна сітка ${product.name}`} highlight={highlight} />
            <p className="note">
              {chart.note} Між двома розмірами? Напиши нам у{" "}
              <a href={site.directUrl} target="_blank" rel="noreferrer" className="text-link">
                Direct
              </a>{" "}
              — підкажемо. Як правильно зняти мірки — на сторінці{" "}
              <Link href="/size-guide" className="text-link" onClick={() => setChartOpen(false)}>
                «Розміри»
              </Link>
              .
            </p>
          </div>
        </div>
      )}
    </>
  );
}
