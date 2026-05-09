import React from "react";
import { Button } from "./ui/button";

export function HomeBanner() {
  return (
    <section className="bg-[#fdf4f4] rounded-[2rem] p-8 md:p-12 mb-16 relative overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
        <div className="space-y-6">
          <div className="inline-block bg-white text-primary text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
            Khuyến mãi cực hot 🔥
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-[1.1]">
            Giảm giá đến <br/>
            <span className="text-primary text-5xl md:text-7xl">50%</span> cho các <br/>
            món yêu thích
          </h1>
          
          <p className="text-slate-600 text-lg max-w-md leading-relaxed">
            Thưởng thức hương vị tuyệt hảo ngay tại nhà với dịch vụ giao hàng siêu tốc của chúng tôi.
          </p>
          
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-lg px-8 py-6 font-bold text-base shadow-lg shadow-primary/30 mt-4">
            Đặt món ngay
          </Button>
        </div>
        
        <div className="relative flex justify-center">
          <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop" 
              alt="Premium Burger" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
