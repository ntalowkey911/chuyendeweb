import api from "./api";
import type { CreateOrderRequest, Order, OrderStatus } from "@/types/order";
import type { PageResponse } from "@/types/pagination";
import type { ValidatePromotionResponse } from "@/types/promotion";
import type { Role } from "@/types/user";

export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

export interface CustomerStats {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  role: Role;
  totalOrders: number;
  completedOrders: number;
  totalRevenue: number;
  createdAt?: string;
}

export const orderService = {
  create: (data: CreateOrderRequest) =>
    api.post<Order>("/orders", data),
  myOrders: () => api.get<Order[]>("/orders/my-orders"),
  getById: (id: string) => api.get<Order>(`/orders/${id}`),
  adminOrders: (page = 0, size = 10) => api.get<PageResponse<Order>>(`/admin/orders?page=${page}&size=${size}`),
  adminCustomers: () => api.get<CustomerStats[]>("/admin/customers"),
  updateOrderStatus: (id: string, status: OrderStatus) => api.put<Order>(`/admin/orders/${id}/status`, { status }),
  validatePromotion: (code: string) => api.get<ValidatePromotionResponse>(`/promotions/validate?code=${encodeURIComponent(code)}`),
  dashboard: () => api.get<DashboardStats>("/admin/dashboard"),
};
