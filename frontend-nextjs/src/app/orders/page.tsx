"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import ProtectedRoute from "@/components/ProtectedRoute";
import { orderService } from "@/services/orderService";
import type { Order } from "@/types/order";
import { formatPrice } from "@/utils/format";
import { getPaymentMethodLabel } from "@/utils/catalog";

const statusLabels: Record<string, string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  SHIPPING: "Đang giao",
  COMPLETED: "Hoàn tất",
  CANCELLED: "Đã hủy",
};

function OrdersContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    orderService
      .myOrders()
      .then((response) => setOrders(response.data))
      .catch(() => setError("Không tải được lịch sử mua hàng."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <Container>
          <h1 className="mb-8 text-3xl font-black text-slate-900">Đơn hàng của tôi</h1>
          {loading && <p className="text-slate-500">Đang tải lịch sử mua hàng...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {!loading && !error && orders.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center text-slate-500">
              Bạn chưa có đơn hàng nào.
            </div>
          )}
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="rounded-[1.8rem] border border-slate-100 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="font-mono text-sm text-slate-500">#{order.id.slice(-8)}</span>
                    <p className="mt-2 text-sm text-slate-500">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleString("vi-VN")
                        : "Đơn hàng mới"}
                    </p>
                  </div>
                  <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-primary">
                    {statusLabels[order.status] || order.status}
                  </span>
                </div>
                <p className="mt-4 text-sm text-slate-600">{order.shippingAddress}</p>
                <p className="mt-1 text-sm text-slate-500">SĐT: {order.phone}</p>
                <p className="mt-1 text-sm text-slate-500">
                  Thanh toán: {getPaymentMethodLabel(order.paymentMethod)}
                </p>
                <ul className="mt-4 space-y-2 text-sm text-slate-700">
                  {order.items.map((item) => (
                    <li key={item.productId} className="flex justify-between gap-4">
                      <span>{item.productName} x{item.quantity}</span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex justify-between border-t border-slate-100 pt-4">
                  <span className="font-semibold text-slate-600">Tổng thanh toán</span>
                  <span className="text-lg font-black text-primary">{formatPrice(order.totalAmount)}</span>
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

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <OrdersContent />
    </ProtectedRoute>
  );
}
