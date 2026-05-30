"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function AddressTab() {
  const { user, isLoaded } = useUser();
  const currentAddress = (user?.unsafeMetadata?.address as string) || "";
  const [address, setAddress] = useState(currentAddress);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setSuccess(false);
    try {
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          address: address.trim(),
        },
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to update address", error);
      alert("Cập nhật địa chỉ thất bại. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  if (!isLoaded) {
    return <p className="text-slate-500">Đang tải...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Địa chỉ giao hàng</h2>
        <p className="mt-1 text-sm text-slate-500">
          Cập nhật địa chỉ mặc định để thanh toán nhanh hơn.
        </p>
      </div>

      <form onSubmit={handleSave} className="max-w-xl space-y-4">
        <div>
          <label htmlFor="address" className="mb-2 block text-sm font-semibold text-slate-700">
            Địa chỉ chi tiết
          </label>
          <textarea
            id="address"
            rows={4}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 p-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Số nhà, đường, phường/xã, quận/huyện, thành phố..."
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white transition hover:bg-primary/90 disabled:opacity-50"
          >
            {saving ? "Đang lưu..." : "Lưu địa chỉ"}
          </button>
          
          {success && (
            <span className="text-sm font-semibold text-emerald-600">
              Đã lưu thành công!
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
