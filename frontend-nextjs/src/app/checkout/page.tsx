"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { orderService } from "@/services/orderService";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import type { PaymentMethod } from "@/types/order";
import { formatPrice } from "@/utils/format";
import { getPaymentMethodLabel } from "@/utils/catalog";

const checkoutGifs = [
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcnJrbjZmcmZvMWViaDZrNDFrYml1cTNvNDJsZHp1MDBxcnJ4ZGprZyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/a3IWyhkEC0p32/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3czN0bmI3bnJieWlpbXlkdWVjb3RwbjZuaWRuaHo3ZGgyZ2s3YmJmdiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/nmBKiNb7h3tIv3BO8D/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcnJrbjZmcmZvMWViaDZrNDFrYml1cTNvNDJsZHp1MDBxcnJ4ZGprZyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/hxERQNWQudqSF1iDnr/giphy.gif",
];

function CheckoutContent() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const fetchMe = useAuthStore((state) => state.fetchMe);
  const { cart, fetchCart } = useCartStore();
  const [shippingAddress, setShippingAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("BANK_TRANSFER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    void fetchCart();
    void fetchMe();
  }, [fetchCart, fetchMe]);

  useEffect(() => {
    setShippingAddress(user?.address || "");
    setPhone(user?.phone || "");
  }, [user]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await orderService.create({
        shippingAddress: shippingAddress.trim(),
        phone: phone.trim(),
        paymentMethod,
      });
      router.push("/orders");
    } catch {
      setError("Đặt hàng thất bại. Vui lòng kiểm tra lại thông tin giao hàng.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <Container>
          <div className="mx-auto max-w-5xl rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm md:p-8">
            <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h1 className="text-3xl font-black text-slate-900">Thanh toán</h1>
                  <p className="mt-2 text-slate-600">
                    Điền sẵn từ thông tin đăng ký, bạn vẫn có thể sửa trước khi xác nhận.
                  </p>
                </div>

                <div className="grid gap-4 rounded-[1.5rem] bg-[#fff7f2] p-4 md:grid-cols-2">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                      Người nhận
                    </p>
                    <p className="mt-2 font-bold text-slate-900">{user?.fullName || "-"}</p>
                    <p className="mt-1 text-sm text-slate-500">{user?.email || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                      Số điện thoại
                    </p>
                    <input
                      className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 outline-none focus:border-primary"
                      placeholder="Số điện thoại"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                    Địa chỉ giao hàng và ghi chú thêm (nếu có)
                  </p>
                  <textarea
                    className="min-h-32 w-full rounded-[1.5rem] border border-slate-200 px-4 py-3 outline-none focus:border-primary"
                    placeholder="Địa chỉ giao hàng"
                    value={shippingAddress}
                    onChange={(event) => setShippingAddress(event.target.value)}
                    required
                  />
                </div>

                <div className="rounded-[1.5rem] border border-slate-200 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                    Phương thức thanh toán
                  </p>
                  <div className="mt-4 space-y-3">
                    {(["BANK_TRANSFER", "CASH_ON_DELIVERY"] as PaymentMethod[]).map((method) => (
                      <label
                        key={method}
                        className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 p-4"
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === method}
                          onChange={() => setPaymentMethod(method)}
                          className="mt-1"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{getPaymentMethodLabel(method)}</p>
                          {method === "BANK_TRANSFER" ? (
                            <p className="mt-1 text-sm text-slate-500">
                              STK BIDV: <span className="font-bold text-slate-800">0832110810</span>
                            </p>
                          ) : (
                            <p className="mt-1 text-sm text-slate-500">Thanh toán tiền mặt khi nhận hàng.</p>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {error && <p className="text-sm font-medium text-red-600">{error}</p>}
                <Button
                  type="submit"
                  disabled={loading}
                  className="h-12 rounded-2xl bg-primary px-6 text-base font-bold text-white hover:bg-primary/90"
                >
                  {loading ? "Đang đặt hàng..." : "Xác nhận đặt hàng"}
                </Button>
              </form>

              <aside className="rounded-[1.8rem] bg-[#fdf1ef] p-6">
                <h2 className="text-xl font-black text-slate-900">Tóm tắt đơn</h2>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  {checkoutGifs.map((gif, index) => (
                    <div key={gif} className="overflow-hidden rounded-2xl border border-white/70 bg-white/70">
                      <img
                        src={gif}
                        alt={`Đơn hàng vui ${index + 1}`}
                        className="h-24 w-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-5 space-y-4">
                  {cart?.items.map((item) => (
                    <div key={item.productId} className="flex items-center justify-between gap-4 text-sm text-slate-700">
                      <span className="line-clamp-2">
                        {item.productName} x{item.quantity}
                      </span>
                      <span className="font-bold">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 border-t border-white/70 pt-4">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Số món</span>
                    <span>{cart?.items.length || 0}</span>
                  </div>
                  <div className="mt-3 flex justify-between text-sm text-slate-600">
                    <span>Thanh toán</span>
                    <span>{getPaymentMethodLabel(paymentMethod)}</span>
                  </div>
                  <div className="mt-3 flex justify-between text-sm text-slate-600">
                    <span>Tổng thanh toán</span>
                    <span className="font-black text-primary">{formatPrice(cart?.totalAmount || 0)}</span>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <CheckoutContent />
    </ProtectedRoute>
  );
}
