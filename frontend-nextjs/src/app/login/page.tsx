"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      router.push("/");
    } catch {
      setError("Email hoặc mật khẩu không đúng.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#fdfafb]">
      <main className="flex flex-1 items-center justify-center p-4">
        <div className="flex w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-2xl">
          <div className="hidden w-1/2 bg-slate-900 md:block">
            <img
              src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1200&auto=format&fit=crop"
              alt="Burger"
              className="h-full w-full object-cover opacity-90"
            />
          </div>

          <div className="w-full p-8 md:w-1/2 md:p-14">
            <Link href="/" className="text-2xl font-black tracking-tight text-primary">
              FASTFOOD & DRINKS
            </Link>
            <h1 className="mt-8 text-3xl font-black text-slate-900">Đăng nhập</h1>
            <p className="mt-2 text-slate-500">Sử dụng tài khoản backend Spring Boot hiện có của bạn.</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-12 rounded-xl border-red-100 bg-red-50/40"
              />
              <Input
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-12 rounded-xl border-red-100 bg-red-50/40"
              />
              {error && <p className="text-sm font-medium text-red-600">{error}</p>}
              <Button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-xl bg-primary text-base font-bold text-white hover:bg-primary/90"
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </form>

            <p className="mt-6 text-sm text-slate-600">
              Chưa có tài khoản?{" "}
              <Link href="/register" className="font-bold text-primary hover:underline">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
