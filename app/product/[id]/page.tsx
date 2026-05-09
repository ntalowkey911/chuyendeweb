import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/button";

export default function ProductDetailPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-10">
        <Container>
          <div className="bg-[#fcfaf9] rounded-3xl p-6 md:p-12 mb-12 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Product Images */}
              <div className="space-y-4">
                <div className="bg-[#f2efe9] rounded-2xl aspect-square flex items-center justify-center p-8 overflow-hidden relative shadow-inner">
                  <img 
                    src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000&auto=format&fit=crop" 
                    alt="Pizza Hải Sản Nhiệt Đới" 
                    className="w-[90%] h-[90%] object-cover rounded-full drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                  />
                </div>
                
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-white rounded-xl p-2 border-2 border-primary aspect-square cursor-pointer flex items-center justify-center overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=300&auto=format&fit=crop" className="w-full h-full object-cover rounded-lg" alt="Thumbnail 1" />
                  </div>
                  <div className="bg-white rounded-xl p-2 border border-slate-200 aspect-square cursor-pointer flex items-center justify-center overflow-hidden hover:border-slate-300">
                    <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=300&auto=format&fit=crop" className="w-full h-full object-cover rounded-lg" alt="Thumbnail 2" />
                  </div>
                  <div className="bg-white rounded-xl p-2 border border-slate-200 aspect-square cursor-pointer flex items-center justify-center overflow-hidden hover:border-slate-300">
                    <img src="https://images.unsplash.com/photo-1604381536121-a83a123610ba?q=80&w=300&auto=format&fit=crop" className="w-full h-full object-cover rounded-lg" alt="Thumbnail 3" />
                  </div>
                  <div className="bg-white rounded-xl p-2 border border-slate-200 aspect-square cursor-pointer flex items-center justify-center overflow-hidden hover:border-slate-300">
                    <img src="https://images.unsplash.com/photo-1590947132387-155cc02f3212?q=80&w=300&auto=format&fit=crop" className="w-full h-full object-cover rounded-lg" alt="Thumbnail 4" />
                  </div>
                </div>
              </div>
              
              {/* Product Info */}
              <div className="flex flex-col">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Pizza Hải Sản Nhiệt Đới</h1>
                <p className="text-slate-600 mb-4 leading-relaxed">
                  Sự kết hợp hoàn hảo giữa hải sản tươi sống gồm tôm, mực, nghêu và phô mai Mozzarella béo ngậy trên nền sốt cà chua đặc biệt, điểm xuyết thêm dứa chua ngọt thanh mát. Một trải nghiệm bùng nổ hương vị biển cả ngay từ miếng cắn đầu tiên.
                </p>
                
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  </div>
                  <span className="text-sm font-bold text-slate-700 ml-2">(120 đánh giá)</span>
                </div>
                
                <div className="flex items-baseline gap-4 mb-8">
                  <span className="text-4xl font-extrabold text-primary">259.000đ</span>
                  <span className="text-xl text-slate-400 line-through font-medium">289.000đ</span>
                </div>
                
                <div className="mb-8">
                  <h4 className="font-bold text-slate-900 mb-3 text-sm">Thành phần chính:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center text-slate-700 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-2"></span> Tôm sú tươi
                    </li>
                    <li className="flex items-center text-slate-700 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-2"></span> Mực ống
                    </li>
                    <li className="flex items-center text-slate-700 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-2"></span> Phô mai Mozzarella
                    </li>
                    <li className="flex items-center text-slate-700 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-2"></span> Dứa tươi
                    </li>
                    <li className="flex items-center text-slate-700 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-2"></span> Sốt cà chua đặc biệt
                    </li>
                  </ul>
                </div>
                
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex items-center bg-red-50 rounded-full p-1 border border-red-100">
                    <button className="w-10 h-10 flex items-center justify-center text-slate-600 hover:text-primary transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </button>
                    <span className="w-8 text-center font-bold text-slate-800">1</span>
                    <button className="w-10 h-10 flex items-center justify-center text-slate-600 hover:text-primary transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </button>
                  </div>
                  
                  <Button className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-full py-6 font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                    Thêm vào giỏ hàng
                  </Button>
                  
                  <button className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-slate-500 hover:text-primary hover:bg-red-100 transition-colors shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                  </button>
                </div>
                
                <div className="bg-[#fff9f9] border border-[#ffebeb] rounded-xl p-4 mt-auto">
                  <div className="flex items-start gap-3 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mt-0.5 shrink-0"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                    <p className="text-sm text-slate-700 font-medium">Giao hàng tận nơi miễn phí cho đơn hàng trên 200k.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600 mt-0.5 shrink-0"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    <p className="text-sm text-slate-700 font-medium">Cam kết giao hàng nóng hổi trong vòng 30 phút.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tabs Section */}
          <div className="mb-16">
            <div className="flex border-b border-slate-200 mb-8">
              <button className="px-6 py-4 border-b-2 border-primary text-primary font-bold text-sm">
                Mô tả
              </button>
              <button className="px-6 py-4 border-b-2 border-transparent text-slate-500 font-bold text-sm hover:text-slate-800 transition-colors">
                Đánh giá (120)
              </button>
            </div>
            
            <div className="prose prose-slate max-w-none text-slate-600 leading-loose">
              <p className="mb-4">
                Pizza Hải Sản Nhiệt Đới là lựa chọn hoàn hảo cho những tín đồ yêu thích hương vị tươi mát của biển cả kết hợp với sự đậm đà của phô mai. Bánh được nướng trên lò đá nhiệt độ cao giúp đế bánh giòn rụm bên ngoài nhưng vẫn giữ độ mềm xốp bên trong.
              </p>
              <p>
                Mỗi chiếc bánh là một tác phẩm nghệ thuật ẩm thực, với nguyên liệu được tuyển chọn kỹ lưỡng mỗi ngày để đảm bảo độ tươi ngon nhất khi đến tay khách hàng. Hãy thưởng thức ngay để cảm nhận sự khác biệt!
              </p>
            </div>
          </div>
        </Container>
      </main>
      
      <Footer />
    </div>
  );
}
