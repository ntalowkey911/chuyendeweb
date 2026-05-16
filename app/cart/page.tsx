"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/button";

const initialCart = [
  {
    id: 1,
    name: "Burger Bò Phô Mai 2 Tầng",
    variant: "Burger Cỡ Lớn",
    status: "Còn hàng",
    price: 85000,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Pizza Hải Sản Nhiệt Đới",
    variant: "Cỡ Vừa (Đế mỏng)",
    status: "Còn hàng",
    price: 159000,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=200&auto=format&fit=crop",
  }
];

const addresses = [
  { id: 1, type: "Nhà riêng", text: "123 Đường Nguyễn Văn Linh, Phường Tân Phú, Quận 7, TP. Hồ Chí Minh" },
  { id: 2, type: "Công ty", text: "Tòa nhà Landmark 81, 720A Điện Biên Phủ, Phường 22, Bình Thạnh, TP. Hồ Chí Minh" },
  { id: 3, type: "Nhà trọ", text: "Hẻm 456 Làng Đại Học, Khu phố 6, Linh Trung, Thủ Đức, TP. Hồ Chí Minh" }
];

export default function CartPage() {
  const [cart, setCart] = useState(initialCart);
  const [selectedAddress, setSelectedAddress] = useState(1);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = 15000;
  const total = subtotal - discount;

  const updateQuantity = (id: number, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#fdfafb]">
      <Header />
      
      <main className="flex-1 py-12">
        <Container>
          <div className="flex items-center gap-2 mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-800"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            <h1 className="text-3xl font-extrabold text-slate-900">Giỏ hàng của bạn</h1>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Left side: Cart Items */}
            <div className="w-full lg:w-2/3 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl p-6 border border-slate-100 flex flex-col sm:flex-row gap-6 items-start sm:items-center shadow-sm">
                  <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 text-lg mb-1">{item.name}</h3>
                    <div className="text-sm text-slate-500 mb-1">Loại: {item.variant}</div>
                    <div className="text-sm font-medium text-emerald-600 mb-3">Trạng thái: {item.status}</div>
                    
                    <div className="flex items-center gap-3">
                      <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                      </button>
                      <button onClick={() => removeItem(item.id)} className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-row sm:flex-col justify-between items-end sm:items-end w-full sm:w-auto h-full gap-4">
                    <div className="text-lg font-bold text-slate-900">
                      {item.price.toLocaleString('vi-VN')} ₫
                    </div>
                    <div className="flex items-center gap-3 bg-slate-50 p-1 rounded-xl border border-slate-200">
                      <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-white hover:shadow-sm rounded-lg font-medium transition-all">-</button>
                      <span className="w-6 text-center font-semibold text-slate-800">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-white hover:shadow-sm rounded-lg font-medium transition-all">+</button>
                    </div>
                  </div>
                </div>
              ))}

              {cart.length > 0 && (
                <div className="pt-4">
                  <Button onClick={() => setCart([])} variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 bg-white">
                    Xóa tất cả
                  </Button>
                </div>
              )}
            </div>

            {/* Right side: Sidebar */}
            <div className="w-full lg:w-1/3 flex flex-col gap-6">
              
              {/* Order Summary */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Tóm tắt đơn hàng</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span>Tạm tính</span>
                    <span className="text-slate-900">{subtotal.toLocaleString('vi-VN')} ₫</span>
                  </div>
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span>Giảm giá</span>
                    <span className="text-emerald-600">-{discount.toLocaleString('vi-VN')} ₫</span>
                  </div>
                  <div className="h-px bg-slate-100 my-2"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-slate-900">Tổng cộng</span>
                    <span className="text-2xl font-black text-primary">{total.toLocaleString('vi-VN')} ₫</span>
                  </div>
                </div>
                <Button className="w-full bg-[#346b5a] hover:bg-[#285749] text-white py-6 rounded-xl font-bold text-lg shadow-lg shadow-emerald-900/20">
                  Tiến hành thanh toán
                </Button>
              </div>

              {/* Delivery Address */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Địa chỉ nhận hàng</h2>
                <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                  {addresses.map((addr) => (
                    <label key={addr.id} className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${selectedAddress === addr.id ? 'border-primary bg-red-50/30' : 'border-slate-100 hover:border-slate-200'}`}>
                      <div className="mt-1 flex items-center justify-center shrink-0">
                        <input 
                          type="radio" 
                          name="address" 
                          checked={selectedAddress === addr.id}
                          onChange={() => setSelectedAddress(addr.id)}
                          className="w-5 h-5 accent-primary" 
                        />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 mb-1">{addr.type}</div>
                        <div className="text-sm text-slate-600 leading-relaxed">{addr.text}</div>
                      </div>
                    </label>
                  ))}
                </div>
                <Button variant="outline" className="w-full border-slate-200 border-dashed text-slate-700 hover:bg-slate-50 font-bold py-6 rounded-xl">
                  + Thêm địa chỉ mới
                </Button>
              </div>

            </div>

          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
