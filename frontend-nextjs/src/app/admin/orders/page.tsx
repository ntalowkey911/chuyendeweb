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
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const size = 10;

  const load = async (pageIndex: number) => {
    const response = await orderService.adminOrders(pageIndex, size);
    setOrders(response.data.content);
    setTotalPages(response.data.totalPages || 1);
  };

  useEffect(() => {
    void load(page);
  }, [page]);

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
                    <div className="mt-2">
                      <p className="text-lg font-black text-slate-900">{formatPrice(Math.max(0, order.totalAmount - (order.discountAmount || 0)))}</p>
                      {order.discountAmount && order.discountAmount > 0 ? (
                        <p className="text-xs font-semibold text-emerald-600 mt-1">
                          Đã giảm {formatPrice(order.discountAmount)} (Mã: {order.promotionCode})
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <select
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold"
                    value={order.status}
                    onChange={async (event) => {
                      await orderService.updateOrderStatus(order.id, event.target.value as OrderStatus);
                      await load(page);
                    }}
                  >
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-2 lg:grid-cols-4">
                  <p><span className="font-bold text-slate-900">Địa chỉ:</span> {order.shippingAddress}</p>
                  <p><span className="font-bold text-slate-900">SĐT:</span> {order.phone}</p>
                  <p><span className="font-bold text-slate-900">Thanh toán:</span> {getPaymentMethodLabel(order.paymentMethod)}</p>
                  <p>
                    <span className="font-bold text-slate-900">GHN:</span>{" "}
                    {order.ghnOrderCode ? (
                      <span className="text-primary font-mono">{order.ghnOrderCode}</span>
                    ) : (
                      "Không có"
                    )}
                    {order.shippingFee && order.shippingFee > 0 && ` (${formatPrice(order.shippingFee)})`}
                  </p>
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

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 disabled:opacity-50 hover:bg-slate-50"
            >
              Trang trước
            </button>
            <span className="text-sm font-semibold text-slate-600">
              Trang {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 disabled:opacity-50 hover:bg-slate-50"
            >
              Trang sau
            </button>
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
