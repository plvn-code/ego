import "server-only";

/**
 * Payment provider abstraction.
 * Plug in LiqPay / WayForPay / Monobank Acquiring / Stripe by implementing
 * `PaymentProvider` and returning it from `getPaymentProvider()`.
 */

export interface CreatePaymentInput {
  orderId: string;
  amount: number; // UAH
  description: string;
  customerEmail: string;
  returnUrl: string;
}

export interface PaymentProvider {
  readonly id: string;
  readonly enabled: boolean;
  createPayment(input: CreatePaymentInput): Promise<{ paymentUrl: string }>;
  /** Verify the provider's webhook signature and return the order status update */
  handleWebhook(request: Request): Promise<{ orderId: string; status: "paid" | "failed" }>;
}

const disabledProvider: PaymentProvider = {
  id: "disabled",
  enabled: false,
  async createPayment() {
    throw new Error("Online payments are not connected yet");
  },
  async handleWebhook() {
    throw new Error("Online payments are not connected yet");
  },
};

export function getPaymentProvider(): PaymentProvider {
  // e.g. if (process.env.PAYMENT_PROVIDER === "liqpay") return liqpayProvider;
  return disabledProvider;
}
