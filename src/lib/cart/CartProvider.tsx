"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { CartLine } from "@/lib/orders/types";

/**
 * Client cart + wishlist kept in localStorage.
 * When accounts arrive, sync these with the server cart on login.
 */

const CART_KEY = "ego.cart.v1";
const WISH_KEY = "ego.wishlist.v1";

interface CartContextValue {
  /** true once the cart has been restored from storage */
  ready: boolean;
  lines: CartLine[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (line: Omit<CartLine, "key" | "quantity">, quantity?: number) => void;
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  wishlist: string[];
  toggleWish: (productId: string) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — cart lives in memory only */
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    setLines(read(CART_KEY, []));
    setWishlist(read(WISH_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) write(CART_KEY, lines);
  }, [lines, hydrated]);

  useEffect(() => {
    if (hydrated) write(WISH_KEY, wishlist);
  }, [wishlist, hydrated]);

  const add = useCallback<CartContextValue["add"]>((line, quantity = 1) => {
    const key = [line.productId, line.option, line.color ?? ""].join("|");
    setLines((prev) => {
      const existing = prev.find((l) => l.key === key);
      if (existing) return prev.map((l) => (l.key === key ? { ...l, quantity: Math.min(10, l.quantity + quantity) } : l));
      return [...prev, { ...line, key, quantity }];
    });
    setOpen(true);
  }, []);

  const setQuantity = useCallback((key: string, quantity: number) => {
    setLines((prev) =>
      quantity <= 0 ? prev.filter((l) => l.key !== key) : prev.map((l) => (l.key === key ? { ...l, quantity: Math.min(10, quantity) } : l)),
    );
  }, []);

  const remove = useCallback((key: string) => setLines((prev) => prev.filter((l) => l.key !== key)), []);
  const clear = useCallback(() => setLines([]), []);
  const toggleWish = useCallback(
    (id: string) => setWishlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])),
    [],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      ready: hydrated,
      lines,
      count: lines.reduce((s, l) => s + l.quantity, 0),
      subtotal: lines.reduce((s, l) => s + l.quantity * l.price, 0),
      isOpen,
      open: () => setOpen(true),
      close: () => setOpen(false),
      add,
      setQuantity,
      remove,
      clear,
      wishlist,
      toggleWish,
    }),
    [hydrated, lines, isOpen, add, setQuantity, remove, clear, wishlist, toggleWish],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
