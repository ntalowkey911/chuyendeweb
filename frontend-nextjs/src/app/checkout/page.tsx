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
import { addressApi, type Province, type District, type Ward } from "@/services/addressApi";
import api from "@/services/api";

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

  const [useSavedAddress, setUseSavedAddress] = useState(true);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedProvinceCode, setSelectedProvinceCode] = useState<number | "">("");
  const [selectedDistrictCode, setSelectedDistrictCode] = useState<number | "">("");
  const [selectedWardCode, setSelectedWardCode] = useState<number | "">("");
  const [street, setStreet] = useState("");

  const [promotionCode, setPromotionCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promotionMessage, setPromotionMessage] = useState("");
  const [validatingPromo, setValidatingPromo] = useState(false);

  useEffect(() => {
    void fetchCart();
    void fetchMe();
    addressApi.getProvinces().then(setProvinces);
  }, [fetchCart, fetchMe]);

  useEffect(() => {
    if (user) {
      setShippingAddress(user.address || "");
      setPhone(user.phone || "");
      if (!user.address) {
        setUseSavedAddress(false);
      }
    }
  }, [user]);

  useEffect(() => {
    if (selectedProvinceCode) {
      addressApi.getDistricts(Number(selectedProvinceCode)).then(setDistricts);
    } else {
      setDistricts([]);
    }
    setSelectedDistrictCode("");
    setSelectedWardCode("");
    setWards([]);
  }, [selectedProvinceCode]);

  useEffect(() => {
    if (selectedDistrictCode) {
      addressApi.getWards(Number(selectedDistrictCode)).then(setWards);
    } else {
      setWards([]);
    }
    setSelectedWardCode("");
  }, [selectedDistrictCode]);

  const handleApplyPromo = async () => {
    if (!promotionCode.trim()) {
      setDiscountAmount(0);
      setPromotionMessage("");
      return;
    }
    setValidatingPromo(true);
    setPromotionMessage("");
    try {
      const res = await orderService.validatePromotion(promotionCode);
      const isCodeValid = res.data.isValid ?? (res.data as any).valid;
      
      if (isCodeValid) {
        setDiscountAmount(res.data.discountAmount);
        setPromotionMessage(`Thành công: Đã giảm ${formatPrice(res.data.discountAmount)}`);
      } else {
        setDiscountAmount(0);
        setPromotionMessage(`Lỗi: ${res.data.message}`);
      }
    } catch (err: any) {
      setDiscountAmount(0);
      setPromotionMessage(err.response?.data?.message || "Không thể xác thực mã giảm giá");
    } finally {
      setValidatingPromo(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    let finalAddress = shippingAddress;
    if (!useSavedAddress) {
      const p = provinces.find((x) => x.code === Number(selectedProvinceCode))?.name;
      const d = districts.find((x) => x.code === Number(selectedDistrictCode))?.name;
      const w = wards.find((x) => x.code === Number(selectedWardCode))?.name;
      if (!p || !d || !w || !street.trim()) {
        setError("Vui lòng nhập đầy đủ địa chỉ giao hàng.");
        setLoading(false);
        return;
      }
      finalAddress = `${street.trim()}, ${w}, ${d}, ${p}`;
    } else if (!finalAddress.trim()) {
      setError("Vui lòng nhập địa chỉ giao hàng.");
      setLoading(false);
      return;
    }

    try {
      const orderRes = await orderService.create({
        shippingAddress: finalAddress,
        phone: phone.trim(),
        paymentMethod,
        promotionCode: discountAmount > 0 ? promotionCode.trim() : undefined,
      });

      if (paymentMethod === "VNPAY") {
        const payRes = await api.get(`/payment/create?orderId=${orderRes.data.id}`);
        if (payRes.data.url) {
          window.location.href = payRes.data.url;
          return;
        }
      }

      router.push("/orders");
    } catch (error: any) {
      console.error("Order creation failed:", error);
      const serverMessage = error.response?.data?.message || "Đặt hàng thất bại. Vui lòng kiểm tra lại thông tin giao hàng.";
      setError(serverMessage);
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
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                      Địa chỉ giao hàng
                    </p>
                    {user?.address && (
                      <button
                        type="button"
                        onClick={() => setUseSavedAddress(!useSavedAddress)}
                        className="text-sm font-bold text-primary hover:underline transition-all duration-200"
                      >
                        {useSavedAddress ? "Đổi địa chỉ" : "Dùng địa chỉ mặc định"}
                      </button>
                    )}
                  </div>

                  {useSavedAddress && user?.address ? (
                    <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                      <p className="font-medium text-slate-800">{user.address}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        (Địa chỉ mặc định của tài khoản)
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 rounded-[1.5rem] border border-slate-200 p-5">
                      <div className="grid gap-4 md:grid-cols-3">
                        <div>
                          <label className="mb-1 block text-sm font-semibold text-slate-700">Tỉnh/Thành</label>
                          <select
                            value={selectedProvinceCode}
                            onChange={(e) => setSelectedProvinceCode(e.target.value ? Number(e.target.value) : "")}
                            className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 outline-none focus:border-primary text-sm"
                            required={!useSavedAddress}
                          >
                            <option value="">Chọn Tỉnh/Thành</option>
                            {provinces.map((p) => (
                              <option key={p.code} value={p.code}>{p.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-semibold text-slate-700">Quận/Huyện</label>
                          <select
                            value={selectedDistrictCode}
                            onChange={(e) => setSelectedDistrictCode(e.target.value ? Number(e.target.value) : "")}
                            className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 outline-none focus:border-primary disabled:bg-slate-50 text-sm"
                            required={!useSavedAddress}
                            disabled={!selectedProvinceCode}
                          >
                            <option value="">Chọn Quận/Huyện</option>
                            {districts.map((d) => (
                              <option key={d.code} value={d.code}>{d.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-semibold text-slate-700">Phường/Xã</label>
                          <select
                            value={selectedWardCode}
                            onChange={(e) => setSelectedWardCode(e.target.value ? Number(e.target.value) : "")}
                            className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 outline-none focus:border-primary disabled:bg-slate-50 text-sm"
                            required={!useSavedAddress}
                            disabled={!selectedDistrictCode}
                          >
                            <option value="">Chọn Phường/Xã</option>
                            {wards.map((w) => (
                              <option key={w.code} value={w.code}>{w.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-semibold text-slate-700">Số nhà, Tên đường</label>
                        <input
                          className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 outline-none focus:border-primary text-sm"
                          placeholder="Ví dụ: 123 Đường ABC..."
                          value={street}
                          onChange={(e) => setStreet(e.target.value)}
                          required={!useSavedAddress}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="rounded-[1.5rem] border border-slate-200 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                    Phương thức thanh toán
                  </p>
                  <div className="mt-4 space-y-3">
                    {(["BANK_TRANSFER", "CASH_ON_DELIVERY", "VNPAY"] as PaymentMethod[]).map((method) => (
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
                          ) : method === "VNPAY" ? (
                            <p className="mt-1 text-sm text-slate-500">
                              Thanh toán trực tuyến qua cổng VNPay (Hỗ trợ ATM nội địa, QR Code, Thẻ quốc tế).
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

                <div className="mt-5 border-t border-white/70 pt-4">
                  <div className="flex justify-between gap-2">
                    <input
                      className="h-10 w-full rounded-xl border border-white/70 bg-white/50 px-3 outline-none text-sm placeholder:text-slate-500 focus:border-primary"
                      placeholder="Mã giảm giá"
                      value={promotionCode}
                      onChange={(e) => setPromotionCode(e.target.value.toUpperCase())}
                    />
                    <button
                      type="button"
                      disabled={validatingPromo || !promotionCode}
                      onClick={handleApplyPromo}
                      className="rounded-xl bg-slate-800 px-4 text-sm font-bold text-white hover:bg-slate-700 disabled:opacity-50"
                    >
                      Áp dụng
                    </button>
                  </div>
                  {promotionMessage && (
                    <p className={`mt-2 text-xs font-semibold ${discountAmount > 0 ? "text-emerald-600" : "text-red-600"}`}>
                      {promotionMessage}
                    </p>
                  )}
                </div>

                <div className="mt-4 border-t border-white/70 pt-4">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Số món</span>
                    <span>{cart?.items.length || 0}</span>
                  </div>
                  <div className="mt-3 flex justify-between text-sm text-slate-600">
                    <span>Thanh toán</span>
                    <span>{getPaymentMethodLabel(paymentMethod)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="mt-3 flex justify-between text-sm text-emerald-600 font-semibold">
                      <span>Giảm giá</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <div className="mt-3 flex justify-between text-sm text-slate-600">
                    <span>Tổng thanh toán</span>
                    <span className="font-black text-primary">{formatPrice(Math.max(0, (cart?.totalAmount || 0) - discountAmount))}</span>
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
