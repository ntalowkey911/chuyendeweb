"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import CartItem from "@/components/CartItem";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/utils/format";

function CartContent() {
  const { cart, loading, fetchCart, updateQuantity, removeItem, clearCart } =
    useCartStore();

  useEffect(() => {
    void fetchCart();
  }, [fetchCart]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 py-8 md:py-12">
        <Container>
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900">Giỏ hàng của bạn</h1>
            <p className="mt-2 text-slate-600">
              Cập nhật số lượng rồi chuyển sang bước thanh toán.
            </p>
          </div>

          {loading && <p className="py-10 text-slate-500">Đang tải giỏ hàng...</p>}

          {!loading && !cart?.items?.length && (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center">
              <p className="text-slate-600">Giỏ hàng đang trống.</p>
              <Link href="/menu" className="mt-4 inline-block font-bold text-primary hover:underline">
                Mua sắm ngay
              </Link>
            </div>
          )}

          {!!cart?.items?.length && (
            <div className="grid gap-8 lg:grid-cols-[1.8fr_1fr]">
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <CartItem
                    key={item.productId}
                    item={item}
                    onUpdate={(quantity) => updateQuantity(item.productId, quantity)}
                    onRemove={() => removeItem(item.productId)}
                  />
                ))}
              </div>

              <aside className="h-fit rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-black text-slate-900">Tóm tắt đơn hàng</h2>
                <div className="mt-6 space-y-3 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Tạm tính</span>
                    <span className="font-semibold text-slate-900">
                      {formatPrice(cart.totalAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Phí giao hàng</span>
                    <span className="font-semibold text-emerald-600">Miễn phí</span>
                  </div>
                </div>
                <div className="my-5 h-px bg-slate-100" />
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-slate-900">Tổng cộng</span>
                  <span className="text-2xl font-black text-primary">
                    {formatPrice(cart.totalAmount)}
                  </span>
                </div>
                <div className="mt-6 flex flex-col gap-3">
                  <Link
                    href="/checkout"
                    className="rounded-2xl bg-primary px-4 py-3 text-center font-bold text-white shadow-lg shadow-red-500/20 hover:bg-primary/90"
                  >
                    Tiến hành thanh toán
                  </Link>
                  <button
                    onClick={() => clearCart()}
                    className="rounded-2xl border border-slate-200 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Xóa tất cả
                  </button>
                </div>
              </aside>
            </div>
          )}
        </Container>
      </main>

      <Footer />
    </div>
  );
}

export default function CartPage() {
  return (
    <ProtectedRoute>
      <CartContent />
    </ProtectedRoute>
  );
}
