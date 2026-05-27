import api from "./api";
import type { Cart } from "@/types/cart";

export const cartService = {
  get: () => api.get<Cart>("/cart"),
  add: (productId: string, quantity: number) =>
    api.post<Cart>("/cart/add", { productId, quantity }),
  update: (productId: string, quantity: number) =>
    api.put<Cart>("/cart/update", { productId, quantity }),
  remove: (productId: string) => api.delete<Cart>(`/cart/remove/${productId}`),
  clear: () => api.delete<Cart>("/cart/clear"),
};
