"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/button";
import api from "@/services/api";

function VNPayReturnContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyPayment = async () => {
      const statusParam = searchParams.get("status");
      const messageParam = searchParams.get("message");

      if (statusParam === "success") {
        setStatus("success");
      } else if (statusParam === "error") {
        setStatus("error");
        setMessage(messageParam || "Thanh toán thất bại hoặc chữ ký xác thực không hợp lệ.");
      } else {
        setStatus("error");
        setMessage("Không tìm thấy thông tin kết quả giao dịch.");
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <div className="mx-auto max-w-lg overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-lg">
      {status === "loading" && (
        <div className="p-12 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <h2 className="mt-6 text-xl font-bold text-slate-900">Đang xác thực thanh toán VNPay...</h2>
          <p className="mt-2 text-sm text-slate-500">Vui lòng không đóng trình duyệt lúc này</p>
        </div>
      )}

      {status === "success" && (
        <div className="text-center">
          <img
            src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcnJrbjZmcmZvMWViaDZrNDFrYml1cTNvNDJsZHp1MDBxcnJ4ZGprZyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/a3IWyhkEC0p32/giphy.gif"
            alt="Success"
            className="h-48 w-full object-cover"
          />
          <div className="p-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-500">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-slate-900">Thanh toán thành công!</h2>
            <p className="mt-2 text-slate-500">
              Cảm ơn bạn đã mua sắm. Đơn hàng của bạn đã được xác nhận thanh toán qua VNPay và đang được xử lý.
            </p>
            <Button
              onClick={() => router.push("/orders")}
              className="mt-8 h-12 w-full rounded-2xl bg-primary px-6 font-bold text-white shadow-md hover:bg-primary/90"
            >
              Xem đơn hàng của tôi
            </Button>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="text-center">
          <img
            src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbHBrcGJjYzNtcWpjaXhxNXhpdDFqajRqdXR1cmU2cXp2NnRvcHlveSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/10QxUe6Vmsm1a0/giphy.gif"
            alt="Error"
            className="h-48 w-full object-cover"
          />
          <div className="p-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-500">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-slate-900">Thanh toán thất bại</h2>
            <p className="mt-2 text-slate-500">
              {message || "Rất tiếc, giao dịch của bạn không thể hoàn tất hoặc chữ ký xác thực không hợp lệ."}
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <Button
                onClick={() => router.push("/checkout")}
                className="h-12 w-full rounded-2xl bg-primary px-6 font-bold text-white shadow-md hover:bg-primary/90"
              >
                Thử lại thanh toán
              </Button>
              <Button
                onClick={() => router.push("/orders")}
                variant="outline"
                className="h-12 w-full rounded-2xl border-2 border-slate-200 px-6 font-bold text-slate-700 hover:bg-slate-50"
              >
                Quản lý đơn hàng
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VNPayReturnPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <Container>
          <Suspense fallback={<div className="p-12 text-center text-slate-500">Đang tải...</div>}>
            <VNPayReturnContent />
          </Suspense>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
