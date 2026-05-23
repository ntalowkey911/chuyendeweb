import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/button";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { notFound } from "next/navigation";
import { ProductTabs } from "@/components/ProductTabs";

export default async function ProductDetailPage({ params }: { params: any }) {
  const resolvedParams = await params;
  const slug = resolvedParams.id;

  await connectToDatabase();
  
  const product = await Product.findOne({ slug }).populate({ path: 'category', model: Category }).lean() as any;

  if (!product) {
    notFound();
  }

  const priceStr = product.price.toLocaleString('vi-VN') + 'đ';
  const discountPriceStr = product.discountPrice ? product.discountPrice.toLocaleString('vi-VN') + 'đ' : null;
  const mainImage = product.images?.[0] || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-10">
        <Container>
          <div className="bg-[#fcfaf9] rounded-3xl p-6 md:p-12 mb-12 shadow-sm border border-slate-100">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Product Images */}
              <div className="space-y-4">
                <div className="bg-[#f2efe9] rounded-2xl aspect-square flex items-center justify-center p-4 overflow-hidden relative shadow-inner">
                  <img 
                    src={mainImage} 
                    alt={product.name} 
                    className="w-[90%] h-[90%] object-cover rounded-full drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                  />
                  {product.discountPrice && (
                    <div className="absolute top-6 left-6 bg-primary text-white font-bold px-4 py-1.5 rounded-full shadow-lg transform -rotate-12">
                      Giảm giá
                    </div>
                  )}
                </div>
                
                {product.images && product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-4">
                    {product.images.map((img: string, idx: number) => (
                      <div key={idx} className={`bg-white rounded-xl p-1 border-2 aspect-square cursor-pointer flex items-center justify-center overflow-hidden ${idx === 0 ? 'border-primary' : 'border-slate-200 hover:border-slate-300'}`}>
                        <img src={img} className="w-full h-full object-cover rounded-lg" alt={`${product.name} - ${idx}`} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Product Info */}
              <div className="flex flex-col">
                <div className="mb-2">
                  <span className="text-primary font-bold text-sm tracking-widest uppercase bg-red-50 px-3 py-1 rounded-full border border-red-100">
                    {product.category?.name || "Thực đơn"}
                  </span>
                </div>
                
                <h1 className="text-4xl font-extrabold text-slate-900 mb-4">{product.name}</h1>
                <p className="text-slate-600 mb-6 leading-relaxed text-lg">
                  {product.description || "Món ăn ngon miệng, được chế biến từ những nguyên liệu tươi ngon nhất, mang đến cho bạn trải nghiệm ẩm thực tuyệt vời."}
                </p>
                
                <div className="flex items-center gap-2 mb-6 bg-white self-start px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
                  <div className="flex text-primary">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={i < Math.floor(product.rating || 4) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    ))}
                  </div>
                  <span className="text-sm font-bold text-slate-700 ml-1">({product.rating || "4.5"} / 5)</span>
                </div>
                
                <div className="flex items-baseline gap-4 mb-8">
                  <span className="text-5xl font-extrabold text-primary">
                    {discountPriceStr || priceStr}
                  </span>
                  {discountPriceStr && (
                    <span className="text-2xl text-slate-400 line-through font-medium">{priceStr}</span>
                  )}
                </div>
                
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex items-center bg-red-50 rounded-full p-1 border border-red-100 h-14">
                    <button className="w-12 h-12 flex items-center justify-center text-slate-600 hover:text-primary transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </button>
                    <span className="w-8 text-center font-bold text-slate-800 text-lg">1</span>
                    <button className="w-12 h-12 flex items-center justify-center text-slate-600 hover:text-primary transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </button>
                  </div>
                  
                  <Button className="flex-1 h-14 bg-primary hover:bg-primary/90 text-white rounded-full font-bold text-lg shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                    Thêm vào giỏ
                  </Button>
                  
                  <button className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center text-slate-500 hover:text-primary hover:bg-red-100 transition-colors shrink-0 border border-red-100">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                  </button>
                </div>
                
                <div className="bg-[#fff9f9] border border-[#ffebeb] rounded-2xl p-5 mt-auto">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm mb-1">Giao hàng miễn phí</h4>
                      <p className="text-sm text-slate-600">Áp dụng cho đơn hàng trên 200.000đ trong bán kính 5km.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm mb-1">Giao hỏa tốc 30 phút</h4>
                      <p className="text-sm text-slate-600">Cam kết thức ăn luôn nóng hổi khi đến tay bạn.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tabs Section */}
          <ProductTabs description={product.description || "Món ăn này được chế biến từ những nguyên liệu tuyển chọn kỹ lưỡng mỗi ngày để đảm bảo độ tươi ngon nhất khi đến tay khách hàng. Hãy thưởng thức ngay để cảm nhận sự khác biệt!"} />
        </Container>
      </main>
      
      <Footer />
    </div>
  );
}
