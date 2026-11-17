import "server-only";

import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/catalog/types";
import { deliveryLabels, messengerLabels, paymentLabels, type CheckoutPayload } from "./types";

/**
 * Order notifications to the store's Telegram (bot → manager chat / group).
 * Env (Vercel → Settings → Environment Variables, or .env.local):
 *   TELEGRAM_BOT_TOKEN — token from @BotFather
 *   TELEGRAM_CHAT_ID   — chat id(s) that receive orders, comma-separated
 */
export function isOrderChannelConfigured() {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);
}

export interface ResolvedLine {
  product: Product;
  option: string;
  color?: string;
  /** Unit price for this colour, recomputed on the server */
  price: number;
  quantity: number;
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const digits = (s: string) => s.replace(/\D/g, "");

/** A clickable link so the manager opens the chat in one tap (Viber has no https deep link — number only). */
function messengerLink(kind: string, contact: string): string | null {
  const nick = contact.replace(/^@/, "").trim();
  const isNumber = /^\+?[\d\s()-]{10,}$/.test(contact);
  if (kind === "telegram") return isNumber ? `https://t.me/+${digits(contact)}` : `https://t.me/${nick}`;
  if (kind === "whatsapp") return `https://wa.me/${digits(contact)}`;
  if (kind === "instagram") return `https://instagram.com/${nick}`;
  return null;
}

export function formatOrderMessage(orderId: string, payload: CheckoutPayload, lines: ResolvedLine[], total: number) {
  const { customer: c, delivery: d } = payload;
  const out: string[] = [`🛒 <b>Нове замовлення ${esc(orderId)}</b>`, ""];

  out.push(`<b>${esc(`${c.firstName} ${c.lastName}`)}</b>`);
  out.push(`📞 ${esc(c.phone)}`);
  if (c.messenger) {
    const contact = c.messenger.contact || c.phone;
    const link = messengerLink(c.messenger.kind, contact);
    const label = `${messengerLabels[c.messenger.kind]}: ${contact}`;
    out.push(`💬 ${link ? `<a href="${esc(link)}">${esc(label)}</a>` : esc(label)}`);
  }
  if (c.email) out.push(`✉️ ${esc(c.email)}`);

  out.push("", `🚚 ${esc(deliveryLabels[d.method])}`);
  out.push(esc([d.method === "international" ? d.country : null, d.city, d.address].filter(Boolean).join(", ")));
  out.push(`💳 ${esc(paymentLabels[payload.payment])}`);

  out.push("", "<b>Товари:</b>");
  for (const l of lines) {
    const meta = [l.color, l.option].filter(Boolean).join(" · ");
    out.push(`• ${esc(l.product.name)} — ${esc(meta)} × ${l.quantity} = ${esc(formatPrice(l.price * l.quantity))}`);
    if (l.product.madeToOrder) out.push(`  ⏳ під замовлення, ${esc(l.product.madeToOrder)}`);
  }
  out.push("", `<b>Разом: ${esc(formatPrice(total))}</b> (без доставки)`);

  if (payload.comment) out.push("", `📝 ${esc(payload.comment)}`);
  return out.join("\n");
}

export async function sendOrderNotification(text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chats = (process.env.TELEGRAM_CHAT_ID ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (!token || chats.length === 0) return false;

  const results = await Promise.all(
    chats.map(async (chat_id) => {
      try {
        const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id, text, parse_mode: "HTML", disable_web_page_preview: true }),
          signal: AbortSignal.timeout(8000),
          cache: "no-store",
        });
        if (!res.ok) console.error("[orders] telegram", res.status, await res.text().catch(() => ""));
        return res.ok;
      } catch (e) {
        console.error("[orders] telegram", e);
        return false;
      }
    }),
  );
  // Delivered to at least one manager chat — the order is not lost.
  return results.some(Boolean);
}
