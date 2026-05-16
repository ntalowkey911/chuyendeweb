"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignUp, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Footer } from "@/components/Footer";

export default function SignUpPage() {
  const { signUp } = useSignUp();
  const { setActive } = useClerk();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  // OTP Verification state
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [code, setCode] = useState("");
  
  const router = useRouter();

  const handleSendOTP = async () => {

    if (!name || !email || !password || !confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      const { error: createError } = await signUp.create({
        emailAddress: email,
        password,
        firstName: name,
      });
      
      if (createError) {
        throw createError;
      }

      // Send the verification email
      const { error: prepareError } = await signUp.verifications.sendEmailCode();
      if (prepareError) {
        throw prepareError;
      }

      // Change UI to verify OTP
      setIsOtpSent(true);
      setError("");
      setSuccessMessage("Mã xác thực đã được gửi đến email của bạn!");
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Đã xảy ra lỗi khi đăng ký.");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOtpSent) {
      setError("Vui lòng gửi mã OTP trước khi đăng ký.");
      return;
    }
    if (!code) {
      setError("Vui lòng nhập mã OTP.");
      return;
    }

    try {
      const { error: verifyError } = await signUp.verifications.verifyEmailCode({
        code,
      });

      if (verifyError) {
        throw verifyError;
      }

      if (signUp.status === "complete") {
        await setActive({ session: signUp.createdSessionId });
        router.push("/");
      } else {
        console.log("Investigate further:", signUp);
        setError("Xác minh không thành công.");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Mã OTP không hợp lệ.");
    }
  };

  const handleOAuthLogin = async (strategy: "oauth_google" | "oauth_facebook") => {
    await signUp.sso({
      strategy,
      redirectUrl: "/",
      redirectCallbackUrl: "/sso-callback",
    });
  };

  return (
    <div className="min-h-screen flex flex-col w-full bg-white">
      <div className="flex-1 flex w-full">
        {/* Left Side - Red Banner */}
        <div className="hidden lg:flex w-[55%] relative bg-[#b71026] overflow-hidden flex-col items-center justify-center p-12">
          {/* Background Overlay Image */}
          <div 
            className="absolute inset-0 w-full h-full opacity-20 mix-blend-multiply bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000&auto=format&fit=crop')" }}
          ></div>
          
          {/* Content */}
          <div className="relative z-10 text-center max-w-lg mt-[-10%]">
            <h1 className="text-6xl font-black text-white mb-6 drop-shadow-lg leading-tight">
              Chào mừng<br/>gia đình mới!
            </h1>
            <p className="text-lg text-red-100 font-medium mb-12">
              Hãy đăng ký để nhận ưu đãi hấp dẫn và theo dõi đơn hàng của bạn mỗi ngày.
            </p>

            <div className="flex gap-4 justify-center">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 w-48 text-white text-center">
                <svg className="w-10 h-10 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
                </svg>
                <h3 className="font-bold text-sm">Món ngon nóng hổi</h3>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 w-48 text-white text-center">
                <svg className="w-10 h-10 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
                <h3 className="font-bold text-sm">Giao hàng siêu tốc</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-[45%] flex flex-col relative">
          <div className="p-8 md:p-12 lg:px-16 lg:py-12 flex-1 overflow-y-auto">
            {/* Logo Header */}
            <div className="mb-10 flex items-center">
              <div className="text-primary mr-2">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m18 2 4 4"/><path d="m17 7 3-3"/><path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5"/><path d="m9 11 4 4"/><path d="m5 15 4 4"/></svg>
              </div>
              <Link href="/" className="text-2xl font-black text-primary uppercase tracking-tighter">
                FASTFOOD & DRINKS
              </Link>
            </div>


                <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Tạo tài khoản</h2>
                <p className="text-slate-500 font-medium mb-8">Trở thành thành viên của gia đình sành ăn ngay hôm nay.</p>

                {error && (
                  <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 font-medium">
                    {error}
                  </div>
                )}
                {successMessage && (
                  <div className="mb-6 p-3 bg-green-50 text-green-600 text-sm rounded-xl border border-green-100 font-medium">
                    {successMessage}
                  </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2 relative">
                    <Label htmlFor="name" className="font-bold text-slate-700">Họ và tên</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      </div>
                      <Input 
                        id="name" 
                        type="text" 
                        placeholder="Nguyễn Văn A" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-11 h-12 rounded-xl border-slate-200 focus-visible:ring-primary/20 text-slate-800 font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 relative">
                      <Label htmlFor="email" className="font-bold text-slate-700">Email</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                        </div>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="vi-du@email.com" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-11 h-12 rounded-xl border-slate-200 focus-visible:ring-primary/20 text-slate-800 font-medium"
                        />
                      </div>
                    </div>
                    
                    {/* OTP field */}
                    <div className={`space-y-2 relative transition-opacity duration-300 ${!isOtpSent ? 'opacity-80' : 'opacity-100'}`}>
                      <Label className="font-bold text-slate-700">Mã OTP</Label>
                      <div className="flex space-x-2">
                        <div className="relative flex-1">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
                          </div>
                          <Input 
                            type="text" 
                            placeholder={isOtpSent ? "Nhập 6 số OTP" : "Nhấn gửi mã"} 
                            disabled={!isOtpSent}
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            maxLength={6}
                            className={`pl-11 h-12 rounded-xl border-slate-200 font-medium transition-all ${!isOtpSent ? 'bg-slate-50 text-slate-500' : 'text-slate-800 focus-visible:ring-primary/20 tracking-widest'}`}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleSendOTP}
                          disabled={isOtpSent}
                          className="h-12 px-4 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 font-bold whitespace-nowrap"
                        >
                          {isOtpSent ? "Đã gửi mã" : "Gửi mã"}
                        </Button>
                      </div>
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
                        className="pl-11 pr-11 h-12 rounded-xl border-slate-200 focus-visible:ring-primary/20 text-slate-800 font-bold tracking-widest placeholder:tracking-normal"
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

                  <div className="space-y-2 relative">
                    <Label htmlFor="confirmPassword" className="font-bold text-slate-700">Nhập lại mật khẩu</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
                      </div>
                      <Input 
                        id="confirmPassword" 
                        type={showConfirmPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-11 pr-11 h-12 rounded-xl border-slate-200 focus-visible:ring-primary/20 text-slate-800 font-bold tracking-widest placeholder:tracking-normal"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                      >
                        {showConfirmPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start pt-2 mb-2">
                    <Checkbox id="terms" className="border-slate-300 rounded mt-0.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                    <label htmlFor="terms" className="ml-2 text-sm text-slate-600 leading-tight">
                      Tôi đồng ý với <span className="font-bold text-primary cursor-pointer hover:underline">Điều khoản sử dụng</span> và <span className="font-bold text-primary cursor-pointer hover:underline">Chính sách bảo mật</span> của FASTFOOD & DRINKS.
                    </label>
                  </div>

                  <Button type="submit" className="w-full bg-[#bd0f25] hover:bg-[#a60d21] text-white font-bold py-3 rounded-xl h-auto text-base shadow-lg shadow-red-500/30 transition-all active:scale-[0.98] flex items-center justify-center">
                    Đăng ký ngay
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </Button>
                  <div id="clerk-captcha"></div>
                </form>

                <div className="mt-6 text-center text-sm font-medium text-slate-600">
                  Đã có tài khoản?{" "}
                  <Link href="/signin" className="text-primary font-bold hover:underline">
                    Đăng nhập ngay
                  </Link>
                </div>

                <div className="mt-8 mb-6 flex items-center justify-center space-x-4">
                  <div className="h-px bg-slate-200 flex-1"></div>
                  <span className="text-sm text-slate-400 font-bold tracking-widest px-2 uppercase">Hoặc</span>
                  <div className="h-px bg-slate-200 flex-1"></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    onClick={() => handleOAuthLogin('oauth_google')}
                    variant="outline" 
                    className="h-12 rounded-xl bg-slate-50 border-slate-200 hover:bg-slate-100 font-semibold text-slate-700"
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
                    className="h-12 rounded-xl bg-[#1877F2] hover:bg-[#0c63d4] font-semibold text-white"
                  >
                    <svg className="w-5 h-5 mr-2" fill="white" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </Button>
                </div>


            <div className="mt-12 text-center text-xs text-slate-400 font-medium pb-8">
              © 2024 FASTFOOD & DRINKS. GIAO HÀNG TẬN NƠI, NIỀM VUI TRỌN VẸN.
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
