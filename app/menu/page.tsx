import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { ProductGrid } from "@/components/ProductGrid";
import { Button } from "@/components/ui/button";

export default function MenuPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-10">
        <Container>
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Sidebar */}
            <aside className="w-full lg:w-64 flex-shrink-0">
              <div className="bg-[#fdf4f4] rounded-2xl p-6 sticky top-28">
                <div className="mb-6">
                  <h2 className="text-2xl font-black text-primary leading-tight mb-2">Khám phá thực đơn</h2>
                  <p className="text-sm text-slate-600">Giao hàng nhanh 30 phút</p>
                </div>
                
                <div className="space-y-2 mb-8">
                  <button className="w-full flex items-center gap-4 bg-primary text-white rounded-xl p-4 font-bold text-sm shadow-md shadow-primary/20 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    Pizza
                  </button>
                  <button className="w-full flex items-center gap-4 text-slate-700 hover:bg-white rounded-xl p-4 font-bold text-sm transition-all border border-transparent hover:border-slate-200">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                    Burgers
                  </button>
                  <button className="w-full flex items-center gap-4 text-slate-700 hover:bg-white rounded-xl p-4 font-bold text-sm transition-all border border-transparent hover:border-slate-200">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    Combo
                  </button>
                  <button className="w-full flex items-center gap-4 text-slate-700 hover:bg-white rounded-xl p-4 font-bold text-sm transition-all border border-transparent hover:border-slate-200">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2v20"/><path d="M12 12 2 12"/><path d="M12 12 22 12"/></svg>
                    Tráng miệng
                  </button>
                  <button className="w-full flex items-center gap-4 text-slate-700 hover:bg-white rounded-xl p-4 font-bold text-sm transition-all border border-transparent hover:border-slate-200">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v2"/><path d="M21 15v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2"/><path d="M2 15h20"/><path d="M6 10v5"/><path d="M10 10v5"/><path d="M14 10v5"/><path d="M18 10v5"/></svg>
                    Đồ uống
                  </button>
                </div>
                
                <div className="mb-8">
                  <h3 className="font-bold text-sm text-slate-900 mb-4">Lọc theo giá</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary" />
                      <span className="text-sm text-slate-700 font-medium">Dưới 50.000đ</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary" />
                      <span className="text-sm text-slate-700 font-medium">50.000đ - 100.000đ</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary" />
                      <span className="text-sm text-slate-700 font-medium">Trên 100.000đ</span>
                    </label>
                  </div>
                </div>
                
                <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold rounded-xl py-6">
                  Đặt hàng ngay
                </Button>
              </div>
            </aside>
            
            {/* Main Content */}
            <div className="flex-1">
              <h1 className="text-3xl font-extrabold text-primary mb-8">Món ăn nổi bật</h1>
              
              <ProductGrid />
              
              {/* Pagination */}
              <div className="mt-12 flex items-center justify-center gap-2">
                <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                <button className="w-10 h-10 rounded-full bg-primary text-white font-bold shadow-md flex items-center justify-center">1</button>
                <button className="w-10 h-10 rounded-full border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 flex items-center justify-center transition-colors">2</button>
                <button className="w-10 h-10 rounded-full border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 flex items-center justify-center transition-colors">3</button>
                <span className="w-10 h-10 flex items-center justify-center text-slate-500">...</span>
                <button className="w-10 h-10 rounded-full border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 flex items-center justify-center transition-colors">8</button>
                <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
              </div>
            </div>
          </div>
        </Container>
      </main>
      
      <Footer />
    </div>
  );
}
