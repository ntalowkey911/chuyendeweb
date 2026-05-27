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
import { formatPrice } from "@/utils/format";

function CheckoutContent() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { cart, fetchCart } = useCartStore();
  const [shippingAddress, setShippingAddress] = useState(user?.address || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    void fetchCart();
  }, [fetchCart]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await orderService.create({ shippingAddress, phone });
      router.push("/orders");
    } catch {
      setError("Đặt hàng thất bại. Vui lòng kiểm tra địa chỉ, tồn kho hoặc đăng nhập.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-12">
        <Container>
          <div className="mx-auto max-w-5xl rounded-[2rem] border border-slate-100 bg-white p-8 shadow-sm">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <h1 className="text-3xl font-black text-slate-900">Thanh toán</h1>
                  <p className="mt-2 text-slate-600">Xác nhận thông tin giao hàng cho đơn của bạn.</p>
                </div>
                <textarea
                  className="min-h-32 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary"
                  placeholder="Địa chỉ giao hàng"
                  value={shippingAddress}
                  onChange={(event) => setShippingAddress(event.target.value)}
                  required
                />
                <input
                  className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-primary"
                  placeholder="Số điện thoại"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  required
                />
                {error && <p className="text-sm font-medium text-red-600">{error}</p>}
                <Button
                  type="submit"
                  disabled={loading}
                  className="h-12 rounded-2xl bg-primary px-6 text-base font-bold text-white hover:bg-primary/90"
                >
                  {loading ? "Đang đặt hàng..." : "Xác nhận đặt hàng"}
                </Button>
              </form>

              <aside className="rounded-3xl bg-[#fdf1ef] p-6">
                <h2 className="text-xl font-black text-slate-900">Tổng kết</h2>
                <div className="mt-5 space-y-3 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Sản phẩm</span>
                    <span>{cart?.items.length || 0}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Tổng thanh toán</span>
                    <span className="font-bold text-primary">
                      {formatPrice(cart?.totalAmount || 0)}
                    </span>
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
