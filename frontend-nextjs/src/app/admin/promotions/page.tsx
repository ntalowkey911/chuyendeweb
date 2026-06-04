"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import ProtectedRoute from "@/components/ProtectedRoute";
import { adminService } from "@/services/adminService";
import { DiscountType, Promotion, PromotionRequest } from "@/types/promotion";
import { formatPrice } from "@/utils/format";

function AdminPromotionsContent() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form states
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState<DiscountType>(DiscountType.PERCENTAGE);
  const [discountValue, setDiscountValue] = useState(0);
  const [minOrderValue, setMinOrderValue] = useState("");
  const [maxDiscount, setMaxDiscount] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [isActive, setIsActive] = useState(true);

  const loadPromotions = async () => {
    try {
      const response = await adminService.getPromotions();
      setPromotions(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPromotions();
  }, []);

  const resetForm = () => {
    setEditingPromotion(null);
    setCode("");
    setDescription("");
    setDiscountType(DiscountType.PERCENTAGE);
    setDiscountValue(0);
    setMinOrderValue("");
    setMaxDiscount("");
    setUsageLimit("");
    setIsActive(true);
    setShowForm(false);
  };

  const handleEdit = (promo: Promotion) => {
    setEditingPromotion(promo);
    setCode(promo.code);
    setDescription(promo.description || "");
    setDiscountType(promo.discountType);
    setDiscountValue(promo.discountValue);
    setMinOrderValue(promo.minOrderValue?.toString() || "");
    setMaxDiscount(promo.maxDiscount?.toString() || "");
    setUsageLimit(promo.usageLimit?.toString() || "");
    setIsActive(promo.isActive);
    setShowForm(true);
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: PromotionRequest = {
        code,
        description,
        discountType,
        discountValue: Number(discountValue),
        minOrderValue: minOrderValue ? Number(minOrderValue) : undefined,
        maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
        usageLimit: usageLimit ? Number(usageLimit) : undefined,
        isActive,
      };

      if (editingPromotion) {
        await adminService.updatePromotion(editingPromotion.id, payload);
      } else {
        await adminService.createPromotion(payload);
      }
      resetForm();
      await loadPromotions();
    } catch (error: any) {
      alert(error.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa mã giảm giá này?")) {
      try {
        await adminService.deletePromotion(id);
        await loadPromotions();
      } catch (error) {
        console.error(error);
        alert("Xóa thất bại");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1 py-8 md:py-10">
          <Container>
            <div className="rounded-[1.8rem] border border-slate-100 bg-white p-8 text-center text-slate-500 shadow-sm">
              Đang tải mã giảm giá...
            </div>
          </Container>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8 md:py-10">
        <Container>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <Link href="/admin" className="mb-2 inline-flex items-center text-sm font-semibold text-primary">
                &larr; Về trang Quản trị
              </Link>
              <h1 className="text-3xl font-black text-slate-900">Mã giảm giá</h1>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="rounded-full bg-primary px-5 py-3 text-sm font-bold text-white hover:bg-primary/90"
            >
              Thêm mã mới
            </button>
          </div>

          {showForm && (
            <form onSubmit={submitForm} className="mb-8 rounded-[1.8rem] border border-slate-100 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-xl font-black text-slate-900">
                {editingPromotion ? "Cập nhật mã giảm giá" : "Thêm mã giảm giá"}
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">Mã Code *</label>
                  <input
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-primary"
                    placeholder="VD: SUMMER20"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">Mô tả</label>
                  <input
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-primary"
                    placeholder="Mô tả ngắn gọn"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">Loại giảm giá</label>
                  <select
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-primary"
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as DiscountType)}
                  >
                    <option value={DiscountType.PERCENTAGE}>Phần trăm (%)</option>
                    <option value={DiscountType.FIXED_AMOUNT}>Số tiền cố định (đ)</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">Mức giảm *</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-primary"
                    placeholder="VD: 10 (nếu là %) hoặc 50000 (nếu là tiền)"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">Đơn tối thiểu</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-primary"
                    placeholder="Bỏ trống nếu không yêu cầu"
                    value={minOrderValue}
                    onChange={(e) => setMinOrderValue(e.target.value)}
                  />
                </div>
                {discountType === DiscountType.PERCENTAGE && (
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">Giảm tối đa</label>
                    <input
                      type="number"
                      min="0"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-primary"
                      placeholder="Bỏ trống nếu không giới hạn"
                      value={maxDiscount}
                      onChange={(e) => setMaxDiscount(e.target.value)}
                    />
                  </div>
                )}
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">Giới hạn lượt dùng</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-primary"
                    placeholder="Bỏ trống nếu vô hạn"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-3 self-end py-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="h-5 w-5 rounded text-primary focus:ring-primary"
                  />
                  <label htmlFor="isActive" className="font-bold text-slate-700">Đang kích hoạt</label>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-full border border-slate-200 px-6 py-3 font-bold text-slate-600"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-full bg-primary px-8 py-3 font-bold text-white disabled:opacity-50"
                >
                  {saving ? "Đang lưu..." : "Lưu mã"}
                </button>
              </div>
            </form>
          )}

          <div className="rounded-[1.8rem] border border-slate-100 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto p-6">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-500">
                    <th className="py-3 font-semibold">Mã</th>
                    <th className="py-3 font-semibold">Mức giảm</th>
                    <th className="py-3 font-semibold">Điều kiện</th>
                    <th className="py-3 font-semibold">Đã dùng</th>
                    <th className="py-3 font-semibold">Trạng thái</th>
                    <th className="py-3 font-semibold">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {promotions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">Chưa có mã giảm giá nào</td>
                    </tr>
                  ) : (
                    promotions.map((promo) => (
                      <tr key={promo.id} className="border-b border-slate-50">
                        <td className="py-4">
                          <span className="font-black text-slate-900 bg-slate-100 px-2 py-1 rounded">{promo.code}</span>
                          <p className="text-xs text-slate-500 mt-1">{promo.description}</p>
                        </td>
                        <td className="py-4 font-semibold text-primary">
                          {promo.discountType === DiscountType.PERCENTAGE
                            ? `${promo.discountValue}%`
                            : formatPrice(promo.discountValue)}
                        </td>
                        <td className="py-4 text-xs text-slate-600">
                          {promo.minOrderValue ? `Đơn tối thiểu: ${formatPrice(promo.minOrderValue)}` : "Mọi đơn hàng"}
                          <br />
                          {promo.maxDiscount && `Giảm tối đa: ${formatPrice(promo.maxDiscount)}`}
                        </td>
                        <td className="py-4">
                          {promo.usedCount} {promo.usageLimit ? `/ ${promo.usageLimit}` : ""}
                        </td>
                        <td className="py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              promo.isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                            }`}
                          >
                            {promo.isActive ? "Kích hoạt" : "Vô hiệu"}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleEdit(promo)}
                              className="font-semibold text-primary hover:underline"
                            >
                              Sửa
                            </button>
                            <button
                              onClick={() => handleDelete(promo.id)}
                              className="font-semibold text-red-600 hover:underline"
                            >
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}

export default function AdminPromotionsPage() {
  return (
    <ProtectedRoute adminOnly>
      <AdminPromotionsContent />
    </ProtectedRoute>
  );
}
