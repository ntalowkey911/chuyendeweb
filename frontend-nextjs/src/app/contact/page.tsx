"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import contactService from "@/services/contactService";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      await contactService.submitContact({
        name,
        email,
        subject,
        message,
      });
      setSuccess(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        "Đã xảy ra lỗi khi gửi tin nhắn. Vui lòng thử lại sau."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <Container>
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h1 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
                Liên hệ với chúng tôi
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
                Bạn có câu hỏi, góp ý hay yêu cầu hỗ trợ? Hãy điền vào form bên dưới, chúng tôi sẽ phản hồi sớm nhất có thể.
              </p>
            </div>

            <div className="grid gap-12 lg:grid-cols-5">
              <div className="lg:col-span-2">
                <div className="rounded-[2rem] bg-white p-8 shadow-sm">
                  <h3 className="mb-6 text-2xl font-black text-slate-900">Thông tin liên hệ</h3>
                  <div className="space-y-6 text-slate-600">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">Điện thoại</p>
                        <p>1900 6868</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8"/><path d="m22 7-8.9 7.1a1.9 1.9 0 0 1-2.2 0L2 7"/><path d="M19 16v6"/><path d="M16 19h6"/></svg>
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">Email</p>
                        <p>hotro@nongsansay.com</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">Địa chỉ</p>
                        <p>Khu phố 6, Linh Trung, Thủ Đức, TP. HCM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3">
                <div className="rounded-[2rem] bg-white p-8 shadow-sm">
                  {success ? (
                    <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                      <h3 className="mb-2 text-2xl font-black text-slate-900">Gửi thành công!</h3>
                      <p className="text-slate-600">Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi lại qua email của bạn sớm nhất.</p>
                      <button
                        onClick={() => setSuccess(false)}
                        className="mt-8 rounded-full bg-primary px-8 py-3 font-bold text-white transition-transform hover:scale-105"
                      >
                        Gửi tin nhắn khác
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <h3 className="text-2xl font-black text-slate-900">Gửi tin nhắn</h3>
                      
                      {error && (
                        <div className="rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-600">
                          {error}
                        </div>
                      )}

                      <div className="grid gap-6 md:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-sm font-bold text-slate-700">Họ và tên *</label>
                          <input
                            type="text"
                            required
                            placeholder="Nguyễn Văn A"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition-colors focus:border-primary focus:bg-white"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-bold text-slate-700">Email *</label>
                          <input
                            type="email"
                            required
                            placeholder="nguyenvana@example.com"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition-colors focus:border-primary focus:bg-white"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-bold text-slate-700">Chủ đề *</label>
                        <input
                          type="text"
                          required
                          placeholder="Vấn đề bạn cần hỗ trợ"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition-colors focus:border-primary focus:bg-white"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-bold text-slate-700">Nội dung *</label>
                        <textarea
                          required
                          placeholder="Nhập chi tiết nội dung tin nhắn của bạn..."
                          className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition-colors focus:border-primary focus:bg-white"
                          rows={5}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-full bg-primary py-4 font-bold text-white transition-transform hover:scale-[1.02] disabled:opacity-70"
                      >
                        {isSubmitting ? "Đang gửi..." : "Gửi tin nhắn"}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
