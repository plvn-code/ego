"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart/CartProvider";
import { formatPrice } from "@/lib/format";
import { site } from "@/lib/config/site";
import {
  deliveryLabels,
  messengerLabels,
  paymentLabels,
  type CartLine,
  type CheckoutPayload,
  type CreateOrderResult,
  type DeliveryMethod,
  type MessengerKind,
  type PaymentMethod,
} from "@/lib/orders/types";
import { CartLines } from "@/components/cart/CartLines";
import { CloseIcon, InstagramIcon, SendIcon } from "@/components/ui/Icons";

const deliveryHints: Record<DeliveryMethod, string> = {
  "np-branch": "Відправка в день замовлення · до 3 робочих днів",
  "np-locker": "Відправка в день замовлення · до 3 робочих днів",
  "np-courier": "Кур'єр прямо до дверей · до 3 робочих днів",
  international: "Вартість і терміни розрахує менеджер",
};

const paymentHints: Record<PaymentMethod, string> = {
  manager: "Менеджер зв'яжеться з тобою, підтвердить наявність і розмір та надішле реквізити",
  "card-online": "Visa, Mastercard, Apple Pay, Google Pay",
};

const messengerFields: Record<MessengerKind, { label: string; placeholder: string }> = {
  telegram: { label: "Нікнейм або номер у Telegram", placeholder: "@username — або порожньо, якщо номер той самий" },
  viber: { label: "Номер у Viber", placeholder: "Порожньо, якщо номер той самий" },
  whatsapp: { label: "Номер у WhatsApp", placeholder: "Порожньо, якщо номер той самий" },
  instagram: { label: "Нікнейм в Instagram", placeholder: "@username" },
};

type Errors = Partial<Record<"firstName" | "lastName" | "phone" | "email" | "messengerContact" | "city" | "address", string>>;

interface PlacedOrder {
  orderId: string;
  total: number;
  items: CartLine[];
  phone: string;
  messenger?: { kind: MessengerKind; contact: string };
  international: boolean;
}

export function CheckoutForm() {
  const { ready, lines, subtotal, count, clear } = useCart();
  const [delivery, setDelivery] = useState<DeliveryMethod>("np-branch");
  const [messenger, setMessenger] = useState<MessengerKind | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState<Extract<CreateOrderResult, { ok: false }> | null>(null);
  const [placed, setPlaced] = useState<PlacedOrder | null>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);
  const payment: PaymentMethod = "manager";

  useEffect(() => {
    if (!placed) return;
    window.scrollTo({ top: 0 });
    doneRef.current?.focus({ preventScroll: true });
  }, [placed]);

  if (!ready) return <div style={{ minHeight: "60vh" }} />;

  // Checked before the empty-cart state: the cart is cleared right after the order is placed.
  if (placed) return <OrderPlaced order={placed} headingRef={doneRef} />;

  if (lines.length === 0) {
    return (
      <div className="empty" style={{ paddingBottom: 120 }}>
        <h2>Кошик порожній</h2>
        <p>Додай речі до кошика, щоб оформити замовлення.</p>
        <Link href="/shop" className="btn">
          До каталогу
        </Link>
      </div>
    );
  }

  const international = delivery === "international";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const v = (k: string) => String(f.get(k) ?? "").trim();
    const next: Errors = {};
    if (!v("firstName")) next.firstName = "Вкажи ім'я";
    if (!v("lastName")) next.lastName = "Вкажи прізвище";
    if (v("phone").replace(/\D/g, "").length < 10) next.phone = "Вкажи номер телефону";
    if (v("email") && !/^\S+@\S+\.\S+$/.test(v("email"))) next.email = "Перевір e-mail або залиш поле порожнім";
    if (messenger === "instagram" && !v("messengerContact")) next.messengerContact = "Вкажи нікнейм в Instagram";
    if (!v("city")) next.city = "Вкажи місто";
    if (!v("address")) next.address = international ? "Вкажи адресу" : "Вкажи номер відділення";
    setErrors(next);
    if (Object.keys(next).length) {
      document.querySelector<HTMLInputElement>(`[name="${Object.keys(next)[0]}"]`)?.focus();
      return;
    }

    const contact = { kind: messenger, contact: v("messengerContact") };
    const payload: CheckoutPayload = {
      customer: {
        firstName: v("firstName"),
        lastName: v("lastName"),
        phone: v("phone"),
        email: v("email") || undefined,
        messenger: contact.kind ? { kind: contact.kind, contact: contact.contact } : undefined,
      },
      delivery: { method: delivery, country: international ? v("country") : "Україна", city: v("city"), address: v("address") },
      payment,
      comment: v("comment") || undefined,
      lines: lines.map(({ productId, option, color, quantity }) => ({ productId, option, color, quantity })),
      website: v("website") || undefined,
    };

    setBusy(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as CreateOrderResult;
      if (!data.ok) {
        setFailure(data);
      } else if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        setPlaced({
          orderId: data.orderId,
          total: data.total,
          items: lines,
          phone: payload.customer.phone,
          messenger: payload.customer.messenger,
          international,
        });
        clear();
      }
    } catch {
      setFailure({ ok: false, reason: "server", message: "Не вдалося з'єднатися з сервером. Спробуйте ще раз." });
    } finally {
      setBusy(false);
    }
  }

  const field = (name: keyof Errors, label: React.ReactNode, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div className={`input ${errors[name] ? "input--error" : ""}`}>
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} aria-invalid={!!errors[name]} {...props} />
      {errors[name] && <span className="field-error">{errors[name]}</span>}
    </div>
  );

  return (
    <div className="checkout">
      <form className="checkout__form" onSubmit={onSubmit} noValidate>
        <fieldset className="fieldset">
          <legend>
            <i>1</i> Контактні дані
          </legend>
          <div className="row-2">
            {field("firstName", "Ім'я", { autoComplete: "given-name" })}
            {field("lastName", "Прізвище", { autoComplete: "family-name" })}
          </div>
          <div className="row-2">
            {field("phone", "Телефон", { type: "tel", autoComplete: "tel", placeholder: "+380" })}
            {field(
              "email",
              <>
                E-mail <span className="input__opt">необов&apos;язково</span>
              </>,
              { type: "email", autoComplete: "email" },
            )}
          </div>

          <div className="messenger" role="group" aria-labelledby="messenger-title">
            <p className="messenger__title" id="messenger-title">
              Де тобі зручніше написати? <span className="input__opt">необов&apos;язково</span>
            </p>
            <div className="chips">
              {(Object.keys(messengerLabels) as MessengerKind[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  className="chip"
                  aria-pressed={messenger === m}
                  onClick={() => {
                    setMessenger(messenger === m ? null : m);
                    setErrors((er) => ({ ...er, messengerContact: undefined }));
                  }}
                >
                  {messengerLabels[m]}
                </button>
              ))}
            </div>
            {messenger ? (
              <div key={messenger}>
                {field("messengerContact", messengerFields[messenger].label, {
                  placeholder: messengerFields[messenger].placeholder,
                  autoComplete: "off",
                })}
              </div>
            ) : (
              <small className="messenger__hint">Не обрали — зателефонуємо на вказаний номер.</small>
            )}
          </div>
        </fieldset>

        <fieldset className="fieldset">
          <legend>
            <i>2</i> Доставка
          </legend>
          <div className="choice">
            {(Object.keys(deliveryLabels) as DeliveryMethod[]).map((m) => (
              <label key={m}>
                <input type="radio" name="delivery" value={m} checked={delivery === m} onChange={() => setDelivery(m)} />
                <span className="choice__text">
                  {deliveryLabels[m]}
                  <small>{deliveryHints[m]}</small>
                </span>
              </label>
            ))}
          </div>
          {international && (
            <div className="input">
              <label htmlFor="country">Країна</label>
              <input id="country" name="country" autoComplete="country-name" />
            </div>
          )}
          <div className="row-2">
            {field("city", "Місто", { autoComplete: "address-level2" })}
            {field(
              "address",
              international || delivery === "np-courier" ? "Адреса" : delivery === "np-locker" ? "Номер поштомату" : "Номер відділення",
              { autoComplete: international || delivery === "np-courier" ? "street-address" : "off" },
            )}
          </div>
        </fieldset>

        <fieldset className="fieldset">
          <legend>
            <i>3</i> Оплата
          </legend>
          <div className="choice">
            {(Object.keys(paymentLabels) as PaymentMethod[]).map((m) => (
              <label key={m}>
                <input type="radio" name="payment" value={m} checked={payment === m} disabled={m !== "manager"} readOnly />
                <span className="choice__text">
                  {paymentLabels[m]}
                  <small>{paymentHints[m]}</small>
                </span>
                {m === "card-online" && <span className="choice__tag">Скоро</span>}
              </label>
            ))}
          </div>
          <div className="input">
            <label htmlFor="comment">Коментар до замовлення</label>
            <textarea id="comment" name="comment" maxLength={1000} placeholder="Наприклад, зріст і параметри — допоможемо з розміром" />
          </div>
        </fieldset>

        {/* Honeypot for bots — hidden from people and screen readers */}
        <div className="hp" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input id="website" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          <button type="submit" className="btn btn--block" disabled={busy}>
            {busy ? "Надсилаємо…" : `Підтвердити замовлення · ${formatPrice(subtotal)}`}
          </button>
          <p className="note">
            Натискаючи кнопку, ти погоджуєшся з{" "}
            <Link href="/info/offer" style={{ textDecoration: "underline" }}>
              публічною офертою
            </Link>{" "}
            та{" "}
            <Link href="/info/privacy" style={{ textDecoration: "underline" }}>
              політикою конфіденційності
            </Link>
            .
          </p>
        </div>
      </form>

      <aside className="summary" aria-label="Твоє замовлення">
        <h2>Твоє замовлення</h2>
        <CartLines editable={false} />
        <div className="sum-row">
          <span>Товари ({count})</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="sum-row">
          <span>Доставка</span>
          <span>{international ? "розрахує менеджер" : "за тарифами НП"}</span>
        </div>
        <div className="sum-row sum-row--total" style={{ borderTop: "1px solid var(--line-strong)", paddingTop: 16 }}>
          <span>До сплати</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
      </aside>

      {failure && (
        <div className="modal" role="dialog" aria-modal="true" aria-label="Статус замовлення" onClick={() => setFailure(null)}>
          <div className="modal__panel" onClick={(e) => e.stopPropagation()} style={{ textAlign: "center", justifyItems: "center" }}>
            <button className="modal__close" onClick={() => setFailure(null)} aria-label="Закрити">
              <CloseIcon width={20} height={20} />
            </button>
            <span className="eyebrow">{failure.reason === "validation" ? "Перевір дані" : "Помилка"}</span>
            <h2 className="title">Замовлення не надіслано</h2>
            <p className="lead">{failure.message}</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
              <a href={site.directUrl} target="_blank" rel="noreferrer" className="btn">
                Написати в Direct
              </a>
              <button className="btn btn--outline" onClick={() => setFailure(null)}>
                Повернутися
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OrderPlaced({ order, headingRef }: { order: PlacedOrder; headingRef: React.Ref<HTMLHeadingElement> }) {
  const where = order.messenger
    ? `${messengerLabels[order.messenger.kind]}${order.messenger.contact ? ` (${order.messenger.contact})` : ""}`
    : null;

  return (
    <div className="checkout order-done">
      <section className="order-done__main" aria-labelledby="order-done-title">
        <span className="order-done__check" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </span>
        <span className="eyebrow">Замовлення {order.orderId}</span>
        <h2 className="display order-done__title" id="order-done-title" ref={headingRef} tabIndex={-1}>
          Дякуємо за замовлення!
        </h2>
        <p className="lead">
          Ми вже отримали його і скоро зв&apos;яжемося з тобою
          {where ? (
            <>
              {" "}
              у <strong>{where}</strong>
            </>
          ) : (
            <>
              {" "}
              за номером <strong>{order.phone}</strong>
            </>
          )}
          , щоб підтвердити розмір і доставку.
        </p>

        <ol className="order-done__steps">
          <li>
            <strong>Підтвердження.</strong> Менеджер звіряє наявність і розмір, за потреби допомагає з підбором.
          </li>
          <li>
            <strong>Оплата.</strong> Реквізити для оплати надішлемо одразу після підтвердження.
          </li>
          <li>
            <strong>Відправлення.</strong>{" "}
            {order.international
              ? "Вартість і терміни доставки за кордон менеджер розрахує окремо."
              : `Новою поштою, термін доставки — ${site.delivery.term}.`}
          </li>
        </ol>

        <div className="order-done__actions">
          <Link href="/shop" className="btn">
            Продовжити покупки
          </Link>
          <a href={site.directUrl} target="_blank" rel="noreferrer" className="btn btn--outline">
            <SendIcon width={18} height={18} /> Написати в Direct
          </a>
        </div>
        <p className="note">
          Є питання щодо замовлення? Напиши нам в{" "}
          <a href={site.socials.instagram.url} target="_blank" rel="noreferrer" style={{ textDecoration: "underline", whiteSpace: "nowrap" }}>
            <InstagramIcon width={13} height={13} style={{ verticalAlign: "-2px" }} /> {site.socials.instagram.handle}
          </a>{" "}
          і вкажи номер {order.orderId}.
        </p>
      </section>

      <aside className="summary" aria-label="Твоє замовлення">
        <h2>Твоє замовлення</h2>
        <CartLines editable={false} items={order.items} />
        <div className="sum-row sum-row--total" style={{ borderTop: "1px solid var(--line-strong)", paddingTop: 16 }}>
          <span>Разом</span>
          <span>{formatPrice(order.total)}</span>
        </div>
        <p className="note">Без вартості доставки.</p>
      </aside>
    </div>
  );
}
