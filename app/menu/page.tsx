import React, { Suspense } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { ProductGrid } from "@/components/ProductGrid";
import Link from "next/link";

export default async function MenuPage({ searchParams }: { searchParams: any }) {
  const params = await searchParams;
  const currentCategory = params?.category || '';
  const currentPrice = params?.price || '';
  const currentSort = params?.sort || '';

  const categories = [
    { name: 'Tất cả', slug: '', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2v20"/><path d="M12 12 2 12"/><path d="M12 12 22 12"/></svg> },
    { name: 'Combo', slug: 'combo-sieu-tiet-kiem', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/></svg> },
    { name: 'Món Chính', slug: 'mon-chinh', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
    { name: 'Món Ăn Kèm', slug: 'mon-an-kem', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 11-1 9"/><path d="m19 11-4-7"/><path d="M2 11h20"/><path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4"/></svg> },
    { name: 'Đồ Uống', slug: 'do-uong', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v2"/><path d="M21 15v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2"/><path d="M2 15h20"/></svg> },
    { name: 'Tráng Miệng', slug: 'trang-mieng', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z"/><path d="M12 3a3 3 0 0 0-3 3v3a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Z"/></svg> },
  ];

  const currentCategoryName = categories.find(c => c.slug === currentCategory)?.name || "Thực đơn";

  const buildUrl = (newParams: Record<string, string | null>) => {
    const q = new URLSearchParams();
    if (currentCategory) q.set('category', currentCategory);
    if (currentPrice) q.set('price', currentPrice);
    if (currentSort) q.set('sort', currentSort);
    
    Object.entries(newParams).forEach(([k, v]) => {
      if (v === null || v === '') q.delete(k);
      else q.set(k, v);
    });
    
    return `/menu?${q.toString()}`;
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-10">
        <Container>
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Sidebar */}
            <aside className="w-full lg:w-64 flex-shrink-0">
              <div className="bg-[#fdf4f4] rounded-2xl p-6 sticky top-28">
                
                {/* Lọc danh mục */}
                <div className="mb-8">
                  <h3 className="font-bold text-sm text-slate-900 mb-4">Danh Mục</h3>
                  <div className="space-y-2">
                    {categories.map((cat) => {
                      const isActive = currentCategory === cat.slug;
                      return (
                        <Link 
                          key={cat.slug} 
                          href={buildUrl({ category: cat.slug || null })}
                          className={`w-full flex items-center gap-4 rounded-xl p-3 font-bold text-sm transition-all border ${
                            isActive 
                              ? 'bg-primary text-white shadow-md shadow-primary/20 border-transparent' 
                              : 'text-slate-700 hover:bg-white border-transparent hover:border-slate-200'
                          }`}
                        >
                          {cat.icon}
                          {cat.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Sắp xếp */}
                <div className="mb-8">
                  <h3 className="font-bold text-sm text-slate-900 mb-4">Sắp xếp</h3>
                  <div className="flex flex-col gap-2">
                    <Link 
                      href={buildUrl({ sort: null })}
                      className={`flex items-center gap-3 cursor-pointer p-2 rounded-lg transition-colors ${currentSort === '' ? 'bg-red-50 text-primary font-bold' : 'text-slate-600 hover:bg-white'}`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${currentSort === '' ? 'border-primary' : 'border-slate-300'}`}>
                        {currentSort === '' && <div className="w-2 h-2 bg-primary rounded-full" />}
                      </div>
                      Mới nhất
                    </Link>
                    <Link 
                      href={buildUrl({ sort: 'bestseller' })}
                      className={`flex items-center gap-3 cursor-pointer p-2 rounded-lg transition-colors ${currentSort === 'bestseller' ? 'bg-red-50 text-primary font-bold' : 'text-slate-600 hover:bg-white'}`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${currentSort === 'bestseller' ? 'border-primary' : 'border-slate-300'}`}>
                        {currentSort === 'bestseller' && <div className="w-2 h-2 bg-primary rounded-full" />}
                      </div>
                      🔥 Bán chạy nhất
                    </Link>
                  </div>
                </div>
                
                {/* Lọc theo giá */}
                <div className="mb-8">
                  <h3 className="font-bold text-sm text-slate-900 mb-4">Lọc theo giá</h3>
                  <div className="space-y-2">
                    <Link 
                      href={buildUrl({ price: null })}
                      className={`block text-sm p-2 rounded-lg transition-colors ${currentPrice === '' ? 'bg-red-50 text-primary font-bold' : 'text-slate-600 hover:bg-white'}`}
                    >
                      Mọi mức giá
                    </Link>
                    <Link 
                      href={buildUrl({ price: 'under50' })}
                      className={`block text-sm p-2 rounded-lg transition-colors ${currentPrice === 'under50' ? 'bg-red-50 text-primary font-bold' : 'text-slate-600 hover:bg-white'}`}
                    >
                      Dưới 50.000đ
                    </Link>
                    <Link 
                      href={buildUrl({ price: '50to100' })}
                      className={`block text-sm p-2 rounded-lg transition-colors ${currentPrice === '50to100' ? 'bg-red-50 text-primary font-bold' : 'text-slate-600 hover:bg-white'}`}
                    >
                      Từ 50.000đ - 100.000đ
                    </Link>
                    <Link 
                      href={buildUrl({ price: 'above100' })}
                      className={`block text-sm p-2 rounded-lg transition-colors ${currentPrice === 'above100' ? 'bg-red-50 text-primary font-bold' : 'text-slate-600 hover:bg-white'}`}
                    >
                      Trên 100.000đ
                    </Link>
                  </div>
                </div>
                
                {(currentCategory || currentPrice || currentSort) && (
                  <Link href="/menu" className="w-full block text-center bg-white border border-slate-200 hover:border-primary hover:text-primary text-slate-600 font-bold rounded-xl py-3 transition-colors">
                    Xóa tất cả bộ lọc
                  </Link>
                )}
              </div>
            </aside>
            
            {/* Main Content */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h1 className="text-3xl font-extrabold text-primary">{currentCategoryName}</h1>
                
                {/* Active filters badge */}
                <div className="flex gap-2 flex-wrap">
                  {currentSort === 'bestseller' && (
                    <span className="bg-red-50 text-primary text-xs font-bold px-3 py-1.5 rounded-full border border-red-100 flex items-center gap-1">
                      🔥 Bán chạy
                    </span>
                  )}
                  {currentPrice === 'under50' && <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-full border border-slate-200">&lt; 50k</span>}
                  {currentPrice === '50to100' && <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-full border border-slate-200">50k - 100k</span>}
                  {currentPrice === 'above100' && <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-full border border-slate-200">&gt; 100k</span>}
                </div>
              </div>
              
              <Suspense fallback={<div className="text-center py-20 text-slate-500">Đang tải món ăn...</div>}>
                <ProductGrid 
                  categorySlug={currentCategory} 
                  priceFilter={currentPrice} 
                  sortBy={currentSort} 
                />
              </Suspense>
              
            </div>
          </div>
        </Container>
      </main>
      
      <Footer />
    </div>
  );
}
