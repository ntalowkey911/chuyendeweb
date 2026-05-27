"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";

export default function RegisterPage() {
  const router = useRouter();
  const register = useAuthStore((state) => state.register);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register({
        ...form,
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        address: form.address.trim(),
      });
      router.push("/login");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message;
        setError(message || "Đăng ký thất bại. Vui lòng thử lại.");
      } else {
        setError("Đăng ký thất bại. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <main className="flex flex-1">
        <div className="hidden w-[55%] bg-[#b71026] p-12 text-white lg:flex lg:flex-col lg:justify-center">
          <h1 className="text-6xl font-black leading-tight">Chào mừng thành viên mới</h1>
          <p className="mt-6 max-w-lg text-lg text-red-100">
            Tạo tài khoản để đặt món, theo dõi đơn hàng và giữ lại trải nghiệm UI mới từ FE2.
          </p>
        </div>

        <div className="flex w-full items-center justify-center p-8 lg:w-[45%]">
          <div className="w-full max-w-xl">
            <Link href="/" className="text-2xl font-black tracking-tight text-primary">
              FASTFOOD & DRINKS
            </Link>
            <h2 className="mt-8 text-3xl font-black text-slate-900">Đăng ký tài khoản</h2>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <Input
                placeholder="Họ và tên"
                value={form.fullName}
                onChange={(event) => updateField("fullName", event.target.value)}
                className="h-12 rounded-xl"
              />
              <Input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                className="h-12 rounded-xl"
              />
              <Input
                type="password"
                placeholder="Mật khẩu"
                value={form.password}
                onChange={(event) => updateField("password", event.target.value)}
                className="h-12 rounded-xl"
              />
              <Input
                placeholder="Số điện thoại"
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                className="h-12 rounded-xl"
              />
              <Input
                placeholder="Địa chỉ"
                value={form.address}
                onChange={(event) => updateField("address", event.target.value)}
                className="h-12 rounded-xl"
              />
              {error && <p className="text-sm font-medium text-red-600">{error}</p>}
              <Button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-xl bg-primary text-base font-bold text-white hover:bg-primary/90"
              >
                {loading ? "Đang xử lý..." : "Đăng ký"}
              </Button>
            </form>

            <p className="mt-6 text-sm text-slate-600">
              Đã có tài khoản?{" "}
              <Link href="/login" className="font-bold text-primary hover:underline">
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
