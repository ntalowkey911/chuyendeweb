import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NewsPage() {
  const articles = [
    {
      id: 1,
      title: "Bí Quyết Chọn Burger Hoàn Hảo Cho Bữa Trưa Năng Lượng",
      description: "Làm thế nào để chọn được chiếc burger ngon nhất? Khám phá những tiêu chí vàng từ các đầu bếp hàng đầu để có một bữa ăn trọn vẹn.",
      category: "Khám phá",
      date: "24 Tháng 10, 2024",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop",
      isLarge: true
    },
    {
      id: 2,
      title: "Bùng Nổ Tiệc Pizza Cuối Tuần Cùng Gia Đình Mua...",
      description: "Đừng bỏ lỡ cơ hội thưởng thức pizza ngon tuyệt hảo với chương trình ưu đãi đặc biệt...",
      category: "Khuyến mãi",
      date: "22 Tháng 10, 2024",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop",
      isLarge: false
    },
    {
      id: 3,
      title: "Top 5 Vị Trà Sữa Mới Nhất Mùa Thu Này Bạn Phải...",
      description: "Khám phá những hương vị ngọt ngào và mới lạ đang làm mưa làm gió trong cộng đồng...",
      category: "Đồ uống",
      date: "18 Tháng 10, 2024",
      image: "https://images.unsplash.com/photo-1558857563-b37102e99e00?q=80&w=800&auto=format&fit=crop",
      isLarge: false
    },
    {
      id: 4,
      title: "Cách Giữ Gà Rán Giòn Rụm Dù Gọi Mang Về",
      description: "Mẹo nhỏ từ chuyên gia giúp bạn luôn thưởng thức được miếng gà rán giòn ngon...",
      category: "Ẩm thực",
      date: "15 Tháng 10, 2024",
      image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=800&auto=format&fit=crop",
      isLarge: false
    }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#fffaf9]">
      <Header />
      
      <main className="flex-1 py-10 md:py-16">
        <Container>
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">Tin tức & Blog</h1>
            <p className="text-slate-600 max-w-2xl leading-relaxed">
              Cập nhật những thông tin ẩm thực mới nhất, mẹo hay nhà bếp và các chương trình ưu đãi hấp dẫn từ FASTFOOD & DRINKS.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            {/* Featured Article (Large) */}
            <div className="lg:col-span-7">
              <Link href="#" className="group block h-full">
                <div className="relative h-full min-h-[400px] rounded-2xl overflow-hidden shadow-md group-hover:shadow-xl transition-all">
                  <img src={articles[0].image} alt={articles[0].title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  
                  <div className="absolute bottom-0 left-0 p-8 w-full">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">{articles[0].category}</span>
                      <span className="text-white/80 text-sm flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        {articles[0].date}
                      </span>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-3 group-hover:text-red-200 transition-colors">{articles[0].title}</h2>
                    <p className="text-white/80 line-clamp-2">{articles[0].description}</p>
                  </div>
                </div>
              </Link>
            </div>
            
            {/* Right Stacked Articles */}
            <div className="lg:col-span-5 flex flex-col gap-8">
              <Link href="#" className="group block h-full">
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-100 flex flex-col h-full">
                  <div className="relative h-48 overflow-hidden">
                    <img src={articles[1].image} alt={articles[1].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">{articles[1].category}</span>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <span className="text-slate-500 text-xs flex items-center gap-1 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                      {articles[1].date}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">{articles[1].title}</h3>
                    <p className="text-slate-600 text-sm line-clamp-2">{articles[1].description}</p>
                  </div>
                </div>
              </Link>
              
              <Link href="#" className="group block h-full">
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-100 flex flex-col h-full">
                  <div className="relative h-48 overflow-hidden bg-slate-100 flex items-center justify-center">
                    <img src={articles[2].image} alt={articles[2].title} className="h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-4 left-4 bg-teal-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">{articles[2].category}</span>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <span className="text-slate-500 text-xs flex items-center gap-1 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                      {articles[2].date}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">{articles[2].title}</h3>
                    <p className="text-slate-600 text-sm line-clamp-2">{articles[2].description}</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
          
          {/* Bottom Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Link href="#" className="group block h-full">
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-100 flex flex-col h-full">
                <div className="relative h-48 overflow-hidden bg-yellow-100 flex items-center justify-center">
                  <img src={articles[3].image} alt={articles[3].title} className="h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">{articles[3].category}</span>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <span className="text-slate-500 text-xs flex items-center gap-1 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    {articles[3].date}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">{articles[3].title}</h3>
                  <p className="text-slate-600 text-sm line-clamp-2">{articles[3].description}</p>
                </div>
              </div>
            </Link>
          </div>
          
          <div className="flex justify-center">
            <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-6 font-bold shadow-md flex items-center gap-2">
              Xem Thêm Bài Viết 
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
            </Button>
          </div>
        </Container>
      </main>
      
      <Footer />
    </div>
  );
}
