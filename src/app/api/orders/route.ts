import { randomInt } from "node:crypto";
import { NextResponse } from "next/server";
import { isNonEmptyString, readJsonBody } from "@/lib/api/guard";
import { getProductById } from "@/lib/catalog/repository";
import { priceFor } from "@/lib/catalog/price";
import { formatOrderMessage, isOrderChannelConfigured, sendOrderNotification, type ResolvedLine } from "@/lib/orders/notify";
import { messengerLabels, type CheckoutPayload, type CreateOrderResult, type MessengerKind } from "@/lib/orders/types";

const fail = (reason: "validation" | "payments_disabled" | "server", message: string, status: number) =>
  NextResponse.json<CreateOrderResult>({ ok: false, reason, message }, { status });

const optional = (v: unknown, max: number) => v === undefined || v === "" || (typeof v === "string" && v.length <= max);

/** ND-XXXXXX without look-alike characters (0/O, 1/I). */
function newOrderId() {
  const abc = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  return `ND-${Array.from({ length: 6 }, () => abc[randomInt(abc.length)]).join("")}`;
}

/**
 * POST /api/orders
 * Current flow: validate → recompute the order from the catalog → send it to the
 * manager's Telegram → the customer sees "thank you". The manager confirms the order
 * and sends prepayment details in the messenger / by phone.
 * Future flow: + persist order (DB) → create payment → return paymentUrl.
 *
 * SECURITY: the client sends only product ids, options and quantities. Prices and
 * totals must ALWAYS be recomputed here from the catalog/DB — never trust amounts
 * coming from the browser (the cart in localStorage can be edited by anyone).
 */
export async function POST(request: Request) {
  const payload = await readJsonBody<CheckoutPayload>(request);
  if (!payload) return fail("validation", "Некоректні дані замовлення", 400);

  const { customer, delivery, lines } = payload;
  const messenger = customer?.messenger;
  const validMessenger =
    messenger === undefined ||
    (typeof messenger === "object" &&
      messenger !== null &&
      Object.hasOwn(messengerLabels, messenger.kind) &&
      optional(messenger.contact, 80) &&
      // Instagram can't be reached by phone number — a nickname is required.
      (messenger.kind !== "instagram" || isNonEmptyString(messenger.contact, 80)));
  const validCustomer =
    customer &&
    isNonEmptyString(customer.firstName, 80) &&
    isNonEmptyString(customer.lastName, 80) &&
    isNonEmptyString(customer.phone, 30) &&
    customer.phone.replace(/\D/g, "").length >= 10 &&
    optional(customer.email, 120) &&
    (!customer.email || /^\S+@\S+\.\S+$/.test(customer.email)) &&
    validMessenger;
  const validDelivery =
    delivery &&
    isNonEmptyString(delivery.city, 120) &&
    isNonEmptyString(delivery.address, 200) &&
    optional(delivery.country, 80) &&
    ["np-branch", "np-locker", "np-courier", "international"].includes(delivery.method);
  const validLines =
    Array.isArray(lines) &&
    lines.length > 0 &&
    lines.length <= 30 &&
    lines.every(
      (l) =>
        isNonEmptyString(l?.productId, 20) &&
        isNonEmptyString(l.option, 20) &&
        optional(l.color, 40) &&
        Number.isInteger(l.quantity) &&
        l.quantity >= 1 &&
        l.quantity <= 10,
    );

  if (!validCustomer || !validDelivery || !validLines || payload.payment !== "manager" || !optional(payload.comment, 1000)) {
    return fail("validation", "Перевір контактні дані, адресу та кошик", 400);
  }

  // Honeypot filled → a bot. Pretend success so it doesn't retry, send nothing.
  if (payload.website) return NextResponse.json<CreateOrderResult>({ ok: true, orderId: newOrderId(), total: 0 });

  // Recompute the order from the catalog — unknown products or options are rejected.
  const resolved = await Promise.all(lines.map(async (l) => ({ line: l, product: await getProductById(l.productId) })));
  if (resolved.some(({ line, product }) => !product || !product.inStock || !product.options.includes(line.option) || (line.color !== undefined && !product.colors.some((c) => c.name === line.color && !c.soon)))) {
    return fail("validation", "Деякі товари в кошику більше недоступні. Онови кошик.", 400);
  }
  const items: ResolvedLine[] = resolved.map(({ line, product }) => {
    const color = product!.colors.find((c) => c.name === line.color)?.name;
    return { product: product!, option: line.option, color, price: priceFor(product!, color), quantity: line.quantity };
  });
  const total = items.reduce((sum, l) => sum + l.price * l.quantity, 0);

  const orderId = newOrderId();
  const order: CheckoutPayload = {
    ...payload,
    customer: {
      firstName: customer.firstName.trim(),
      lastName: customer.lastName.trim(),
      phone: customer.phone.trim(),
      email: customer.email?.trim() || undefined,
      messenger: messenger ? { kind: messenger.kind as MessengerKind, contact: messenger.contact?.trim() ?? "" } : undefined,
    },
    comment: payload.comment?.trim() || undefined,
  };
  const text = formatOrderMessage(orderId, order, items, total);

  if (!isOrderChannelConfigured()) {
    // Local development without a bot: show the order in the terminal so the flow can be tested.
    if (process.env.NODE_ENV !== "production") {
      console.info(`[orders] TELEGRAM_* not set — order not sent:\n${text}`);
      return NextResponse.json<CreateOrderResult>({ ok: true, orderId, total });
    }
    // Production must never say "thank you" for an order nobody receives.
    console.error("[orders] TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID are not set — order rejected");
    return fail("server", "Онлайн-замовлення тимчасово недоступні. Напиши нам у Direct — ми все оформимо.", 503);
  }

  if (!(await sendOrderNotification(text))) {
    return fail("server", "Не вдалося надіслати замовлення. Спробуй ще раз або напиши нам у Direct.", 502);
  }
  return NextResponse.json<CreateOrderResult>({ ok: true, orderId, total });
}
