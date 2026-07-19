'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { Cart, CartItem, ProductWithStock } from '@/types';

const CART_STORAGE_KEY = 'rpf_cart_v1';

interface CartContextValue {
  cart: Cart;
  totalItems: number;
  totalPrice: number;
  qtyFor: (cartKey: string) => number;
  aggQtyForProduct: (productId: string) => number;
  addToCart: (product: ProductWithStock, size?: string | null) => boolean;
  changeQty: (cartKey: string, delta: number, product: ProductWithStock) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>({});
  const [hydrated, setHydrated] = useState(false);

  // Load persisted cart once on mount (client-only, matches the original
  // localStorage-based behavior — cart is a guest/session concept, not
  // something that needs a database row).
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) setCart(JSON.parse(saved));
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // storage full or unavailable — cart just won't persist
    }
  }, [cart, hydrated]);

  const aggQtyForProduct = useCallback(
    (productId: string) =>
      Object.values(cart)
        .filter((item) => item.productId === productId)
        .reduce((sum, item) => sum + item.qty, 0),
    [cart]
  );

  const qtyFor = useCallback((cartKey: string) => cart[cartKey]?.qty ?? 0, [cart]);

  const addToCart = useCallback(
    (product: ProductWithStock, size?: string | null) => {
      const cartKey = size ? `${product.id}__${size}` : product.id;
      let added = false;
      setCart((prev) => {
        if (prev[cartKey]) return prev;
        if (aggQtyForProduct(product.id) >= product.currentStock) return prev;
        added = true;
        const item: CartItem = {
          cartKey,
          productId: product.id,
          title: product.title,
          category: product.category,
          subCategoryName: product.subCategoryName,
          price: product.price,
          size: size ?? null,
          qty: 1,
        };
        return { ...prev, [cartKey]: item };
      });
      return added;
    },
    [aggQtyForProduct]
  );

  const changeQty = useCallback(
    (cartKey: string, delta: number, product: ProductWithStock) => {
      setCart((prev) => {
        const existing = prev[cartKey];
        if (!existing) return prev;
        if (delta > 0 && aggQtyForProduct(product.id) >= product.currentStock) {
          return prev;
        }
        const nextQty = existing.qty + delta;
        const next = { ...prev };
        if (nextQty <= 0) {
          delete next[cartKey];
        } else {
          next[cartKey] = { ...existing, qty: nextQty };
        }
        return next;
      });
    },
    [aggQtyForProduct]
  );

  const clearCart = useCallback(() => setCart({}), []);

  const totalItems = useMemo(
    () => Object.values(cart).reduce((sum, item) => sum + item.qty, 0),
    [cart]
  );
  const totalPrice = useMemo(
    () => Object.values(cart).reduce((sum, item) => sum + item.price * item.qty, 0),
    [cart]
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        totalItems,
        totalPrice,
        qtyFor,
        aggQtyForProduct,
        addToCart,
        changeQty,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
