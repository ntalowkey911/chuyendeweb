import api from "./api";
import type { Order, OrderStatus, PaymentMethod } from "@/types/order";
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
  create: (data: { shippingAddress: string; phone: string; paymentMethod: PaymentMethod }) =>
    api.post<Order>("/orders", data),
  myOrders: () => api.get<Order[]>("/orders/my-orders"),
  getById: (id: string) => api.get<Order>(`/orders/${id}`),
  adminOrders: () => api.get<Order[]>("/admin/orders"),
  adminCustomers: () => api.get<CustomerStats[]>("/admin/customers"),
  updateStatus: (id: string, status: OrderStatus) =>
    api.put<Order>(`/admin/orders/${id}/status`, { status }),
  dashboard: () => api.get<DashboardStats>("/admin/dashboard"),
};
