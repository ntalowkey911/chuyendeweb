"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { HomeBanner } from "@/components/HomeBanner";
import { ProductGrid } from "@/components/ProductGrid";
import { PRODUCT_CATEGORIES } from "@/utils/catalog";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 py-10 md:py-16">
        <Container>
          <HomeBanner />

          <section className="mb-20">
            <div className="mb-8 flex items-end justify-between gap-4">
              <h2 className="text-3xl font-black text-slate-900">Danh mục nổi bật</h2>
              <Link href="/menu" className="text-sm font-bold text-primary hover:underline">
                Xem toàn bộ
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-4">
              {PRODUCT_CATEGORIES.map((category) => (
                <Link
                  key={category.value}
                  href={`/menu?category=${category.value}`}
                  className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{category.label}</h3>
                  <p className="mt-2 text-sm text-slate-500">Khám phá sản phẩm trong nhóm này.</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="mb-16">
            <div className="mb-8">
              <h2 className="text-3xl font-black text-slate-900">Sản phẩm mới cập nhật</h2>
              <p className="mt-2 text-slate-600">Trái cây sấy, hạt dinh dưỡng, tinh bột và nấm rong biển.</p>
            </div>
            <ProductGrid limit={8} />
          </section>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
