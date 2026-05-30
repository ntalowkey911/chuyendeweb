import { create } from "zustand";
import type { Cart } from "@/types/cart";
import { cartService } from "@/services/cartService";

interface CartState {
  cart: Cart | null;
  loading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  loading: false,

  fetchCart: async () => {
    set({ loading: true });
    try {
      const res = await cartService.get();
      set({ cart: res.data });
    } catch {
      set({ cart: null });
    } finally {
      set({ loading: false });
    }
  },

  addToCart: async (productId, quantity = 1) => {
    try {
      const res = await cartService.add(productId, quantity);
      set({ cart: res.data });
    } catch (error: any) {
      alert(error.response?.data?.message || "Lỗi khi thêm vào giỏ hàng");
    }
  },

  updateQuantity: async (productId, quantity) => {
    try {
      const res = await cartService.update(productId, quantity);
      set({ cart: res.data });
    } catch (error: any) {
      alert(error.response?.data?.message || "Lỗi khi cập nhật giỏ hàng");
    }
  },

  removeItem: async (productId) => {
    try {
      const res = await cartService.remove(productId);
      set({ cart: res.data });
    } catch (error: any) {
      alert("Lỗi khi xóa sản phẩm khỏi giỏ hàng");
    }
  },

  clearCart: async () => {
    const res = await cartService.clear();
    set({ cart: res.data });
  },
}));
