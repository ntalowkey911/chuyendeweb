"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import ProtectedRoute from "@/components/ProtectedRoute";
import { orderService } from "@/services/orderService";
import type { Order, OrderStatus } from "@/types/order";
import { formatPrice } from "@/utils/format";
import { getPaymentMethodLabel } from "@/utils/catalog";

const statusLabels: Record<OrderStatus, string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  SHIPPING: "Đang giao",
  COMPLETED: "Hoàn tất",
  CANCELLED: "Đã hủy",
};

function AdminOrdersContent() {
  const [orders, setOrders] = useState<Order[]>([]);

  const load = async () => {
    const response = await orderService.adminOrders();
    setOrders(response.data);
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8 md:py-10">
        <Container>
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900">Đơn hàng admin</h1>
            <p className="mt-2 text-slate-600">
              Trang riêng để xem đơn hàng, SĐT khách, địa chỉ và phương thức thanh toán.
            </p>
          </div>

          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="rounded-[1.8rem] border border-slate-100 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="font-mono text-sm text-slate-500">#{order.id.slice(-8)}</span>
                    <p className="mt-2 text-lg font-black text-slate-900">{formatPrice(order.totalAmount)}</p>
                  </div>
                  <select
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold"
                    value={order.status}
                    onChange={async (event) => {
                      await orderService.updateStatus(order.id, event.target.value as OrderStatus);
                      await load();
                    }}
                  >
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-3">
                  <p><span className="font-bold text-slate-900">Địa chỉ:</span> {order.shippingAddress}</p>
                  <p><span className="font-bold text-slate-900">SĐT:</span> {order.phone}</p>
                  <p><span className="font-bold text-slate-900">Thanh toán:</span> {getPaymentMethodLabel(order.paymentMethod)}</p>
                </div>

                <div className="mt-4 space-y-2 rounded-[1.25rem] bg-slate-50 p-4">
                  {order.items.map((item) => (
                    <div key={`${order.id}-${item.productId}`} className="flex justify-between gap-4 text-sm text-slate-700">
                      <span>{item.productName} x{item.quantity}</span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <ProtectedRoute adminOnly>
      <AdminOrdersContent />
    </ProtectedRoute>
  );
}
