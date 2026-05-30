"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OAuthStrategy } from "@clerk/types";

export default function RegisterPage() {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");

  const updateField = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSocialLogin = (strategy: OAuthStrategy) => {
    if (!isLoaded) return;
    signUp.authenticateWithRedirect({
      strategy,
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/",
    });
  };

  const handleSendOTP = async () => {
    if (!isLoaded || !form.email || !form.password || !form.fullName) {
      setError("Vui lòng điền Họ tên, Email và Mật khẩu trước khi lấy mã.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await signUp.create({
        emailAddress: form.email.trim(),
        password: form.password,
        firstName: form.fullName.trim(),
        unsafeMetadata: {
          phone: form.phone.trim(),
        }
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
      alert("Mã OTP đã được gửi đến email của bạn!");
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      setError(err.errors?.[0]?.message || "Lấy mã thất bại. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isLoaded) return;
    if (!pendingVerification) {
      setError("Vui lòng nhấn 'Lấy mã OTP' và kiểm tra email.");
      return;
    }
    if (!code) {
      setError("Vui lòng nhập mã OTP.");
      return;
    }
    
    setError("");
    setLoading(true);

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/");
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
        setError("Xác thực thất bại, vui lòng thử lại.");
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      setError(err.errors?.[0]?.message || "Mã xác thực không đúng.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#fffaf5]">
      <main className="flex flex-1 items-center justify-center p-4">
        <div className="grid w-full max-w-6xl overflow-hidden rounded-[2.5rem] border border-white/70 bg-white shadow-[0_30px_80px_rgba(120,56,24,0.12)] lg:grid-cols-[0.95fr_1.05fr]">
          <div className="hidden bg-[linear-gradient(160deg,#8f1d1d_0%,#c94f27_55%,#f3a54a_100%)] p-12 text-white lg:block">
            <p className="w-fit rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em]">
              Thành viên mới
            </p>
            <h1 className="mt-8 text-5xl font-black leading-tight">
              Tạo tài khoản để lưu địa chỉ, số điện thoại và theo dõi đơn hàng.
            </h1>
            <div className="mt-10 space-y-4 text-sm text-white/85">
              <p>Đăng nhập được bằng email hoặc số điện thoại.</p>
              <p>Thanh toán sẽ tự điền trước thông tin giao hàng của bạn.</p>
              <p>Trang quản trị sẽ tự mở đúng quyền nếu tài khoản là admin.</p>
            </div>
          </div>

          <div className="p-6 sm:p-10 lg:p-14">
            <Link href="/" className="text-2xl font-black tracking-tight text-primary">
              Nông Sản Sấy
            </Link>
            
            <h2 className="mt-8 text-3xl font-black text-slate-900">Đăng ký tài khoản</h2>
            
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <Input
                placeholder="Họ và tên"
                value={form.fullName}
                onChange={(event) => updateField("fullName", event.target.value)}
                className="h-12 rounded-2xl"
                disabled={pendingVerification}
                required
              />
              
              <Input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                className="h-12 rounded-2xl"
                disabled={pendingVerification}
                required
              />

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mật khẩu"
                  value={form.password}
                  onChange={(event) => updateField("password", event.target.value)}
                  className="h-12 rounded-2xl pr-16"
                  disabled={pendingVerification}
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

              <Input
                placeholder="Số điện thoại"
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                className="h-12 rounded-2xl"
                disabled={pendingVerification}
              />

              <div className="flex gap-3 pt-2">
                <Input
                  placeholder="Mã OTP 6 số"
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  className="h-12 flex-1 rounded-2xl text-center text-lg tracking-widest outline outline-2 outline-primary focus-visible:ring-0"
                  maxLength={6}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSendOTP}
                  disabled={loading || pendingVerification}
                  className="h-12 rounded-2xl border-primary text-primary font-bold hover:bg-red-50"
                >
                  {pendingVerification ? "Đã gửi OTP" : "Lấy mã OTP"}
                </Button>
              </div>
              
              {error && <p className="text-sm font-medium text-red-600">{error}</p>}
              
              <Button
                type="submit"
                disabled={loading || !isLoaded}
                className="h-12 w-full rounded-2xl bg-primary text-base font-bold text-white hover:bg-primary/90 mt-2"
              >
                {loading ? "Đang xử lý..." : "Hoàn tất Đăng ký"}
              </Button>

              {pendingVerification && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setPendingVerification(false)}
                  className="h-10 w-full rounded-2xl text-slate-500 text-sm"
                >
                  Sửa lại thông tin (Hủy OTP)
                </Button>
              )}
            </form>

            <div className="mt-6 flex items-center justify-between">
              <span className="w-1/5 border-b border-slate-200 lg:w-1/4"></span>
              <span className="text-xs text-center text-slate-500 uppercase">Hoặc đăng ký bằng</span>
              <span className="w-1/5 border-b border-slate-200 lg:w-1/4"></span>
            </div>
            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => handleSocialLogin("oauth_google")}
                className="flex h-12 w-full items-center justify-center rounded-2xl border border-slate-200 bg-white font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
                Đăng ký bằng Google
              </button>
            </div>

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
