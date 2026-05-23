import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { HomeBanner } from "@/components/HomeBanner";
import { ProductGrid } from "@/components/ProductGrid";
import Link from "next/link";

const categories = [
  { id: 1, name: "Combo Siêu Tiết Kiệm", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/></svg> },
  { id: 2, name: "Món Chính", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
  { id: 3, name: "Món Ăn Kèm", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 11-1 9"/><path d="m19 11-4-7"/><path d="M2 11h20"/><path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4"/><path d="M4.5 15.5h15"/><path d="m5 11 4-7"/><path d="m9 11 1 9"/></svg> },
  { id: 4, name: "Đồ Uống", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v2"/><path d="M21 15v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2"/><path d="M2 15h20"/><path d="M6 10v5"/><path d="M10 10v5"/><path d="M14 10v5"/><path d="M18 10v5"/></svg> },
  { id: 5, name: "Tráng Miệng", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z"/><path d="M12 3a3 3 0 0 0-3 3v3a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Z"/></svg> }
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-10 md:py-16">
        <Container>
          {/* Hero Banner Section */}
          <HomeBanner />
          
          {/* Categories Section */}
          <section className="mb-20">
            <div className="flex justify-between items-end mb-8">
              <h2 className="text-3xl font-extrabold text-slate-900">Danh mục phổ biến</h2>
              <Link href="/menu" className="hidden md:flex text-primary font-semibold hover:underline items-center text-sm">
                Xem tất cả <span className="ml-1">→</span>
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
              {categories.map(cat => (
                <Link key={cat.id} href={`/menu?category=${cat.name.toLowerCase()}`} className="group">
                  <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-slate-100 hover:shadow-md transition-all group-hover:-translate-y-1 h-full flex flex-col justify-center items-center">
                    <div className="w-16 h-16 rounded-full bg-red-50 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                      {cat.icon}
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm">{cat.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
          
          {/* Hot Deals Section */}
          <section className="mb-20">
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold text-slate-900">Ưu đãi Hot trong tuần</h2>
            </div>
            
            <ProductGrid limit={8} />
          </section>
          
        </Container>
      </main>
      
      <Footer />
    </div>
  );
}