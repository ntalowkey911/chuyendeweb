import React from "react";
import { Container } from "@/components/Container";

export default function PromotionsPage() {
  return (
    <Container className="py-12 min-h-[calc(100vh-80px)]">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Khuyến Mãi</h1>
        <p className="text-slate-500 mt-2 text-lg">Khám phá những ưu đãi hấp dẫn nhất hôm nay từ Foodie Express</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="aspect-[2/1] bg-slate-100 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/80 to-primary/40 flex flex-col items-center justify-center text-white p-6 text-center">
                <span className="text-sm font-bold tracking-wider uppercase mb-2">Deal Khủng</span>
                <h3 className="text-2xl font-black">Giảm 50% Combo Burger</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="text-sm text-slate-500 mb-2">Hết hạn: 31/12/2026</div>
              <p className="text-slate-700 font-medium mb-4">Áp dụng cho mọi đơn hàng có combo Burger 2 người. Không áp dụng cùng các ưu đãi khác.</p>
              <button className="w-full bg-slate-900 text-white font-semibold py-2 rounded-xl hover:bg-slate-800 transition-colors">
                Lưu mã
              </button>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
