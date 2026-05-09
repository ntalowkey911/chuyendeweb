import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { HomeBanner } from "@/components/HomeBanner";
import { ProductGrid } from "@/components/ProductGrid";
import Link from "next/link";

const categories = [
  { id: 1, name: "Pizza", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
  { id: 2, name: "Burger", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg> },
  { id: 3, name: "Gà rán", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
  { id: 4, name: "Đồ uống", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v2"/><path d="M21 15v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2"/><path d="M2 15h20"/><path d="M6 10v5"/><path d="M10 10v5"/><path d="M14 10v5"/><path d="M18 10v5"/></svg> }
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
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {categories.map(cat => (
                <Link key={cat.id} href={`/menu?category=${cat.name.toLowerCase()}`} className="group">
                  <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-slate-100 hover:shadow-md transition-all group-hover:-translate-y-1">
                    <div className="mx-auto w-16 h-16 rounded-full bg-red-50 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                      {cat.icon}
                    </div>
                    <h3 className="font-bold text-slate-800">{cat.name}</h3>
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
            
            <ProductGrid />
          </section>
          
        </Container>
      </main>
      
      <Footer />
    </div>
  );
}