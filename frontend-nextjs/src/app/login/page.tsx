"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OAuthStrategy } from "@clerk/types";

export default function LoginPage() {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSocialLogin = (strategy: OAuthStrategy) => {
    if (!isLoaded) return;
    signIn.authenticateWithRedirect({
      strategy,
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/",
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isLoaded) return;
    setError("");
    setLoading(true);

    try {
      const result = await signIn.create({
        identifier: email.trim(),
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/");
      } else {
        console.error(JSON.stringify(result, null, 2));
        setError("Cần thêm bước xác thực.");
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      setError(err.errors?.[0]?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#fcf7f2]">
      <main className="flex flex-1 items-center justify-center p-4">
        <div className="grid w-full max-w-6xl overflow-hidden rounded-[2.5rem] border border-white/60 bg-white shadow-[0_30px_80px_rgba(120,56,24,0.12)] lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative hidden min-h-[680px] overflow-hidden bg-slate-950 lg:block">
            <video
              className="absolute inset-0 h-full w-full object-cover opacity-70"
              autoPlay
              muted
              loop
              playsInline
              poster="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=70"
            >
              <source
                src="https://cdn.coverr.co/videos/coverr-woman-picking-out-fresh-produce-1565693401504?download=1080p"
                type="video/mp4"
              />
            </video>
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950/85 via-red-950/55 to-transparent" />
            <div className="relative flex h-full flex-col justify-end p-12 text-white">
              <p className="w-fit rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-white/75">
                Đăng nhập nhanh
              </p>
              <h1 className="mt-6 max-w-lg text-5xl font-black leading-tight">
                Mua sắm nông sản sấy gọn, đẹp và thực dụng hơn.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/75">
                Dùng email, số điện thoại hoặc Google để vào tài khoản. Đăng nhập Google sẽ tự tạo tài
                khoản nếu email đó chưa có trong shop.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-6 sm:p-10 lg:p-14">
            <div className="w-full max-w-[400px]">
              <Link href="/" className="mb-8 block text-2xl font-black tracking-tight text-primary">
                Nông Sản Sấy
              </Link>
              
              <h2 className="text-3xl font-black text-slate-900">Đăng nhập</h2>
              
              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-2xl bg-slate-50"
                  required
                />
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 rounded-2xl bg-slate-50 pr-16"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500"
                  >
                    {showPassword ? "Ẩn" : "Hiện"}
                  </button>
                </div>
                
                {error && <p className="text-sm font-medium text-red-600">{error}</p>}
                
                <Button
                  type="submit"
                  disabled={loading || !isLoaded}
                  className="h-12 w-full rounded-2xl bg-primary text-base font-bold text-white hover:bg-primary/90"
                >
                  {loading ? "Đang xử lý..." : "Đăng nhập"}
                </Button>
              </form>

              <div className="mt-6 flex items-center justify-between">
                <span className="w-1/5 border-b border-slate-200 lg:w-1/4"></span>
                <span className="text-xs text-center text-slate-500 uppercase">Hoặc đăng nhập bằng</span>
                <span className="w-1/5 border-b border-slate-200 lg:w-1/4"></span>
              </div>
              <div className="mt-6 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => handleSocialLogin("oauth_google")}
                  className="flex h-12 w-full items-center justify-center rounded-2xl border border-slate-200 bg-white font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
                  Đăng nhập bằng Google
                </button>
              </div>

              <p className="mt-6 text-center text-sm text-slate-600">
                Chưa có tài khoản?{" "}
                <Link href="/register" className="font-bold text-primary hover:underline">
                  Đăng ký
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
