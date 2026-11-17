/** Order domain — mirrors the future `Order` / `OrderItem` tables. */

export interface CartLine {
  /** productId + options, unique per cart line */
  key: string;
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  color?: string;
  option: string;
  quantity: number;
}

export type DeliveryMethod = "np-branch" | "np-locker" | "np-courier" | "international";
export type PaymentMethod = "manager" | "card-online";

export type MessengerKind = "telegram" | "viber" | "whatsapp" | "instagram";

export interface CheckoutCustomer {
  firstName: string;
  lastName: string;
  phone: string;
  /** Optional */
  email?: string;
  /** Optional: where the manager should write. Empty contact = same number as `phone` (not allowed for Instagram). */
  messenger?: { kind: MessengerKind; contact: string };
}

export interface CheckoutDelivery {
  method: DeliveryMethod;
  country: string;
  city: string;
  /** Nova Poshta branch/locker number or full address */
  address: string;
}

export interface CheckoutPayload {
  customer: CheckoutCustomer;
  delivery: CheckoutDelivery;
  payment: PaymentMethod;
  comment?: string;
  lines: Pick<CartLine, "productId" | "option" | "color" | "quantity">[];
  /** Honeypot — real users never fill it */
  website?: string;
}

export type OrderStatus = "pending_payment" | "paid" | "processing" | "shipped" | "delivered" | "cancelled";

export type CreateOrderResult =
  | { ok: true; orderId: string; total: number; paymentUrl?: string }
  | { ok: false; reason: "payments_disabled" | "validation" | "server"; message: string };

export const deliveryLabels: Record<DeliveryMethod, string> = {
  "np-branch": "Нова Пошта — відділення",
  "np-locker": "Нова Пошта — поштомат",
  "np-courier": "Нова Пошта — кур'єр",
  international: "Міжнародна доставка",
};

export const messengerLabels: Record<MessengerKind, string> = {
  telegram: "Telegram",
  viber: "Viber",
  whatsapp: "WhatsApp",
  instagram: "Instagram",
};

export const paymentLabels: Record<PaymentMethod, string> = {
  manager: "Оплата після підтвердження",
  "card-online": "Повна онлайн-оплата карткою",
};
