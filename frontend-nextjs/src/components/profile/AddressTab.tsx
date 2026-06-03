"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { addressApi, type Province, type District, type Ward } from "@/services/addressApi";

export default function AddressTab() {
  const { user, isLoaded } = useUser();
  const currentAddress = (user?.unsafeMetadata?.address as string) || "";
  const currentPhone = (user?.unsafeMetadata?.phone as string) || "";
  
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedProvinceCode, setSelectedProvinceCode] = useState<number | "">("");
  const [selectedDistrictCode, setSelectedDistrictCode] = useState<number | "">("");
  const [selectedWardCode, setSelectedWardCode] = useState<number | "">("");
  const [street, setStreet] = useState("");
  const [phoneInput, setPhoneInput] = useState("");

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setPhoneInput((user.unsafeMetadata?.phone as string) || "");
    }
  }, [user]);

  useEffect(() => {
    addressApi.getProvinces().then(setProvinces);
  }, []);

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    let finalAddress = currentAddress;
    const hasAddressInput = selectedProvinceCode || selectedDistrictCode || selectedWardCode || street.trim();

    if (hasAddressInput) {
      const p = provinces.find((x) => x.code === Number(selectedProvinceCode))?.name;
      const d = districts.find((x) => x.code === Number(selectedDistrictCode))?.name;
      const w = wards.find((x) => x.code === Number(selectedWardCode))?.name;

      if (!p || !d || !w || !street.trim()) {
        alert("Vui lòng nhập đầy đủ các trường địa chỉ (Tỉnh/Thành, Quận/Huyện, Phường/Xã và Số nhà).");
        return;
      }
      finalAddress = `${street.trim()}, ${w}, ${d}, ${p}`;
    } else if (!currentAddress && !phoneInput.trim()) {
      alert("Vui lòng nhập địa chỉ hoặc số điện thoại.");
      return;
    }

    setSaving(true);
    setSuccess(false);
    try {
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          address: finalAddress,
          phone: phoneInput.trim(),
        },
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
      setStreet("");
      setSelectedProvinceCode("");
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
        {(currentAddress || currentPhone) && (
          <div className="mb-6 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 space-y-3">
            {currentAddress && (
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-600">
                  Địa chỉ mặc định
                </p>
                <p className="mt-1 font-semibold text-slate-800">{currentAddress}</p>
              </div>
            )}
            {currentPhone && (
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-600">
                  Số điện thoại mặc định
                </p>
                <p className="mt-1 font-semibold text-slate-800">{currentPhone}</p>
              </div>
            )}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Số điện thoại mặc định</label>
          <input
            type="tel"
            className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-primary"
            placeholder="Nhập số điện thoại mặc định..."
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
          />
        </div>

        <div className="space-y-4 rounded-[1.5rem] border border-slate-200 p-5">
          <p className="text-sm font-bold text-slate-800 mb-2">Cập nhật địa chỉ mặc định</p>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Tỉnh/Thành</label>
              <select
                value={selectedProvinceCode}
                onChange={(e) => setSelectedProvinceCode(e.target.value ? Number(e.target.value) : "")}
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary"
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
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary disabled:bg-slate-50"
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
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary disabled:bg-slate-50"
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
              className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-primary"
              placeholder="Ví dụ: 123 Đường ABC..."
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white transition hover:bg-primary/90 disabled:opacity-50"
          >
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
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
