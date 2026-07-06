"use client";

import { useEffect, useState } from "react";
import { orderService } from "@/services/orderService";
import type { Order } from "@/types/order";
import { formatPrice } from "@/utils/format";
import { getPaymentMethodLabel } from "@/utils/catalog";
import { OrderTrackingBar } from "./OrderTrackingBar";

const statusLabels: Record<string, string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  SHIPPING: "Đang giao",
  COMPLETED: "Hoàn tất",
  CANCELLED: "Đã hủy",
};

export default function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [completingOrderId, setCompletingOrderId] = useState<string | null>(null);

  const fetchMyOrders = () => {
    orderService
      .myOrders()
      .then((response) => setOrders(response.data))
      .catch(() => setError("Không tải được lịch sử mua hàng."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const handleCompleteOrder = async (id: string) => {
    if (!confirm("Bạn xác nhận đã nhận được hàng?")) return;
    setCompletingOrderId(id);
    try {
      await orderService.completeOrder(id);
      fetchMyOrders();
    } catch (err: any) {
      alert("Cập nhật thất bại, vui lòng thử lại.");
    } finally {
      setCompletingOrderId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Đơn hàng của tôi</h2>
        <p className="mt-1 text-sm text-slate-500">
          Xem lại lịch sử mua hàng và theo dõi trạng thái đơn hàng.
        </p>
      </div>

      {loading && <p className="text-slate-500">Đang tải lịch sử mua hàng...</p>}
      {error && <p className="text-red-600">{error}</p>}
      
      {!loading && !error && orders.length === 0 && (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center text-slate-500">
          Bạn chưa có đơn hàng nào.
        </div>
      )}

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="font-mono text-sm font-semibold text-slate-600">#{order.id.slice(-8)}</span>
                <p className="mt-1 text-sm text-slate-500">
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleString("vi-VN")
                    : "Đơn hàng mới"}
                </p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-primary">
                {statusLabels[order.status] || order.status}
              </span>
            </div>

            <div className="mt-6 mb-4">
              <OrderTrackingBar status={order.status} />
            </div>
            
            <div className="mt-4 border-t border-slate-100 pt-4">
              <p className="text-sm text-slate-600"><span className="font-medium text-slate-700">Giao đến:</span> {order.shippingAddress}</p>
              <p className="mt-1 text-sm text-slate-500"><span className="font-medium text-slate-700">SĐT:</span> {order.phone}</p>
              <p className="mt-1 text-sm text-slate-500">
                <span className="font-medium text-slate-700">Thanh toán:</span> {getPaymentMethodLabel(order.paymentMethod)}
              </p>
              {order.ghnOrderCode && (
                <p className="mt-1 text-sm text-slate-500">
                  <span className="font-medium text-slate-700">Mã VĐ GHN:</span> {order.ghnOrderCode}
                </p>
              )}
            </div>

            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              {order.items.map((item) => (
                <li key={item.productId} className="flex justify-between gap-4">
                  <span className="flex items-center gap-2">
                    <a href={`/product/${item.productId}`} className="hover:text-primary hover:underline">
                      {item.productName}
                    </a>
                    <span className="font-semibold text-slate-500"> x{item.quantity}</span>
                    {order.status === "COMPLETED" && (
                      <a href={`/product/${item.productId}#reviews`} className="text-xs font-semibold text-primary underline">
                        Đánh giá
                      </a>
                    )}
                  </span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4">
              <div className="flex justify-between text-sm text-slate-500">
                <span>Tạm tính</span>
                <span>{formatPrice(order.items.reduce((acc, item) => acc + item.price * item.quantity, 0))}</span>
              </div>
              
              {(order.shippingFee ?? 0) > 0 && (
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Phí vận chuyển</span>
                  <span>{formatPrice(order.shippingFee!)}</span>
                </div>
              )}

              {(order.discountAmount ?? 0) > 0 && (
                <div className="flex justify-between text-sm font-semibold text-emerald-600">
                  <span>Giảm giá ({order.promotionCode})</span>
                  <span>-{formatPrice(order.discountAmount!)}</span>
                </div>
              )}

              <div className="flex justify-between pt-2">
                <span className="font-semibold text-slate-600">Tổng thanh toán</span>
                <span className="text-lg font-black text-primary">
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
            </div>

            {order.status === "SHIPPING" && (
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => handleCompleteOrder(order.id)}
                  disabled={completingOrderId === order.id}
                  className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-primary/90 disabled:opacity-50"
                >
                  {completingOrderId === order.id ? "Đang xử lý..." : "Hoàn tất đơn hàng"}
                </button>
              </div>
            )}
            
            {order.status === "COMPLETED" && (
              <div className="mt-6 flex justify-end">
                <button
                  disabled
                  className="rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-bold text-slate-400"
                >
                  Đơn hàng đã hoàn tất
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
