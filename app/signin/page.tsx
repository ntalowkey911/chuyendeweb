"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignIn, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Footer } from "@/components/Footer";

export default function SignInPage() {
  const { signIn } = useSignIn();
  const { setActive } = useClerk();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }
    
    try {
      const { error: signInError } = await signIn.create({
        identifier: email,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      if (signIn.status === "complete") {
        await setActive({ session: signIn.createdSessionId });
        router.push("/");
      } else {
        console.log("Investigate further:", signIn);
        setError("Đăng nhập không thành công. Vui lòng kiểm tra lại.");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Đã xảy ra lỗi đăng nhập.");
    }
  };

  const handleOAuthLogin = async (strategy: "oauth_google" | "oauth_facebook") => {
    await signIn.sso({
      strategy,
      redirectUrl: "/",
      redirectCallbackUrl: "/sso-callback",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfafb]">
      {/* Header */}
      <header className="w-full bg-[#fdfafb] px-6 md:px-12 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl md:text-2xl font-black tracking-tighter text-primary uppercase">
          FASTFOOD & DRINKS
        </Link>
        <Link href="/support" className="text-primary font-bold text-sm hover:underline">
          Trợ giúp
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-5xl flex flex-col md:flex-row bg-white rounded-[2rem] shadow-2xl overflow-hidden min-h-[600px]">
          
          {/* Left Side - Image */}
          <div className="hidden md:flex md:w-1/2 relative bg-slate-900">
            <img 
              src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop" 
              alt="Delicious Burger" 
              className="absolute inset-0 w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="relative z-10 flex flex-col justify-end p-12 text-white h-full">
              <h2 className="text-4xl font-extrabold mb-3 leading-tight text-white drop-shadow-md">
                Niềm vui trọn vẹn<br/>trong từng bữa ăn
              </h2>
              <p className="text-lg text-slate-200 drop-shadow">
                Giao hàng nhanh chóng, nóng hổi đến tận tay bạn.
              </p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Chào mừng bạn quay lại!</h1>
            <p className="text-slate-500 mb-8 font-medium">Đăng nhập để tiếp tục khám phá thế giới ẩm thực.</p>

            {error && (
              <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2 relative">
                <Label htmlFor="email" className="font-bold text-slate-700">Email hoặc Số điện thoại</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  </div>
                  <Input 
                    id="email" 
                    type="text" 
                    placeholder="example@gmail.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-11 h-12 rounded-xl bg-red-50/50 border-red-100 focus-visible:ring-primary/20 text-slate-800 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2 relative">
                <Label htmlFor="password" className="font-bold text-slate-700">Mật khẩu</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </div>
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 pr-11 h-12 rounded-xl bg-red-50/50 border-red-100 focus-visible:ring-primary/20 text-slate-800 font-bold tracking-widest placeholder:tracking-normal"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" className="border-slate-300 rounded data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                  <label htmlFor="remember" className="text-sm font-medium leading-none text-slate-600 peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Ghi nhớ đăng nhập
                  </label>
                </div>
                <Link href="#" className="text-sm font-bold text-primary hover:underline">
                  Quên mật khẩu?
                </Link>
              </div>

              <Button type="submit" className="w-full bg-[#bd0f25] hover:bg-[#a60d21] text-white font-bold py-3 rounded-xl h-auto mt-4 text-base shadow-lg shadow-red-500/30 transition-all active:scale-[0.98]">
                Đăng nhập
              </Button>
              <div id="clerk-captcha"></div>
            </form>

            <div className="mt-8 mb-6 flex items-center justify-center space-x-4">
              <div className="h-px bg-slate-200 flex-1"></div>
              <span className="text-sm text-slate-500 font-medium px-2">Hoặc đăng nhập bằng</span>
              <div className="h-px bg-slate-200 flex-1"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={() => handleOAuthLogin('oauth_google')}
                variant="outline" 
                className="h-12 rounded-xl border-slate-200 hover:bg-slate-50 font-semibold text-slate-700"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>
              <Button 
                onClick={() => handleOAuthLogin('oauth_facebook')}
                variant="outline" 
                className="h-12 rounded-xl border-slate-200 hover:bg-slate-50 font-semibold text-slate-700"
              >
                <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </Button>
            </div>

            <div className="mt-8 text-center text-sm font-medium text-slate-600">
              Chưa có tài khoản?{" "}
              <Link href="/signup" className="text-primary font-bold hover:underline">
                Đăng ký ngay
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
