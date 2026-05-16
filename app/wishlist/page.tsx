"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/button";

const initialFavorites = [
  {
    id: 1,
    name: "Burger Bò Phô Mai 2 Tầng",
    categories: ["Burger", "Thức ăn nhanh"],
    type: "Đồ ăn",
    status: "Còn hàng",
    price: 85000,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Gà Rán Xốt Cay Hàn Quốc",
    categories: ["Gà rán", "Combo"],
    type: "Đồ ăn",
    status: "Hết hàng",
    price: 120000,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=200&auto=format&fit=crop",
  }
];

export default function WishlistPage() {
  const [favorites, setFavorites] = useState(initialFavorites);

  const updateQuantity = (id: number, delta: number) => {
    setFavorites(favorites.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id: number) => {
    setFavorites(favorites.filter(item => item.id !== id));
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      
      <main className="flex-1 py-12">
        <Container>
          <div className="flex items-center gap-2 mb-10">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-800"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            <h1 className="text-3xl font-extrabold text-slate-900">Sản phẩm yêu thích</h1>
          </div>

          <div className="w-full overflow-x-auto pb-4">
            <table className="w-full min-w-[900px] border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-100 text-left">
                  <th className="py-4 px-4 font-bold text-slate-900 text-lg w-[40%]">Sản phẩm</th>
                  <th className="py-4 px-4 font-bold text-slate-900 text-lg">Danh mục</th>
                  <th className="py-4 px-4 font-bold text-slate-900 text-lg">Loại</th>
                  <th className="py-4 px-4 font-bold text-slate-900 text-lg">Trạng thái</th>
                  <th className="py-4 px-4 font-bold text-slate-900 text-lg">Giá</th>
                  <th className="py-4 px-4 font-bold text-slate-900 text-lg">Tác vụ</th>
                </tr>
              </thead>
              <tbody>
                {favorites.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="py-6 px-4">
                      <div className="flex items-center gap-4">
                        <button onClick={() => removeItem(item.id)} className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
                        </button>
                        <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-slate-100 bg-white">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <h3 className="font-semibold text-slate-800 text-base line-clamp-2 pr-4">{item.name}</h3>
                      </div>
                    </td>
                    
                    <td className="py-6 px-4">
                      <span className="text-slate-600 font-medium">{item.categories.join(", ")}</span>
                    </td>
                    
                    <td className="py-6 px-4">
                      <span className="text-slate-600 font-medium">{item.type}</span>
                    </td>
                    
                    <td className="py-6 px-4">
                      <span className={`font-semibold ${item.status === 'Còn hàng' ? 'text-emerald-600' : 'text-red-500'}`}>
                        {item.status}
                      </span>
                    </td>
                    
                    <td className="py-6 px-4">
                      <span className="font-bold text-slate-900 text-lg">{item.price.toLocaleString('vi-VN')} ₫</span>
                    </td>
                    
                    <td className="py-6 px-4">
                      {item.status === 'Còn hàng' ? (
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-500 font-medium w-16">Số lượng</span>
                            <div className="flex items-center gap-2 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
                              <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-white rounded hover:shadow-sm transition-all">-</button>
                              <span className="w-4 text-center font-bold text-slate-800 text-sm">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-white rounded hover:shadow-sm transition-all">+</button>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-slate-500 font-medium w-16">Tạm tính</span>
                            <span className="font-bold text-slate-900">{(item.price * item.quantity).toLocaleString('vi-VN')} ₫</span>
                          </div>
                        </div>
                      ) : (
                        <Button disabled variant="outline" className="opacity-50">Tạm hết món</Button>
                      )}
                    </td>
                  </tr>
                ))}

                {favorites.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      Chưa có sản phẩm nào trong danh sách yêu thích.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-8 border-t border-slate-100 pt-6">
            <Button 
              onClick={() => setFavorites([])} 
              variant="outline" 
              className="text-slate-700 border-slate-300 hover:bg-slate-50 font-bold px-6 rounded-xl"
              disabled={favorites.length === 0}
            >
              Làm mới danh sách
            </Button>
          </div>

        </Container>
      </main>

      <Footer />
    </div>
  );
}
