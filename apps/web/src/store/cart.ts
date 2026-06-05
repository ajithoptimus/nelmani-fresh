/**
 * Nelmani Fresh — Zustand Cart Store
 * Persisted to localStorage, syncs with backend when user is authenticated.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { cartApi } from "@/lib/api";

export interface CartItem {
  id: number;
  variant_id: number;
  product_name: string;
  product_slug: string;
  size_kg: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  primary_image?: string;
}

interface CartSummary {
  subtotal: number;
  shipping_fee: number;
  total: number;
  item_count: number;
}

interface CartState extends CartSummary {
  items: CartItem[];
  isLoading: boolean;
  isOpen: boolean;

  // Actions
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  fetchCart: () => Promise<void>;
  addItem: (variantId: number, quantity?: number) => Promise<void>;
  updateItem: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  reset: () => void;
}

const FREE_SHIPPING_THRESHOLD = 999;
const SHIPPING_FEE = 99;

function computeSummary(items: CartItem[]): CartSummary {
  const subtotal = items.reduce((sum, item) => sum + item.total_price, 0);
  const shipping_fee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const item_count = items.reduce((sum, item) => sum + item.quantity, 0);
  return {
    subtotal,
    shipping_fee,
    total: subtotal + shipping_fee,
    item_count,
  };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      subtotal: 0,
      shipping_fee: 0,
      total: 0,
      item_count: 0,
      isLoading: false,
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      fetchCart: async () => {
        set({ isLoading: true });
        try {
          const { data } = await cartApi.get();
          set({
            items: data.items,
            subtotal: data.subtotal,
            shipping_fee: data.shipping_fee,
            total: data.total,
            item_count: data.item_count,
          });
        } catch {
          // Not authenticated — cart remains local
        } finally {
          set({ isLoading: false });
        }
      },

      addItem: async (variantId: number, quantity = 1) => {
        set({ isLoading: true });
        try {
          await cartApi.addItem(variantId, quantity);
          await get().fetchCart();
          set({ isOpen: true }); // Auto-open cart drawer
        } finally {
          set({ isLoading: false });
        }
      },

      updateItem: async (itemId: number, quantity: number) => {
        if (quantity < 1) return get().removeItem(itemId);
        set({ isLoading: true });
        try {
          await cartApi.updateItem(itemId, quantity);
          await get().fetchCart();
        } finally {
          set({ isLoading: false });
        }
      },

      removeItem: async (itemId: number) => {
        set({ isLoading: true });
        try {
          await cartApi.removeItem(itemId);
          await get().fetchCart();
        } finally {
          set({ isLoading: false });
        }
      },

      clearCart: async () => {
        set({ isLoading: true });
        try {
          await cartApi.clear();
          set({ items: [], subtotal: 0, shipping_fee: 0, total: 0, item_count: 0 });
        } finally {
          set({ isLoading: false });
        }
      },

      reset: () =>
        set({ items: [], subtotal: 0, shipping_fee: 0, total: 0, item_count: 0, isOpen: false }),
    }),
    {
      name: "nelmani-cart",
      partialize: (state) => ({ items: state.items }), // Only persist items
    }
  )
);
