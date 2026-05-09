"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchBar({ isOpen, onClose }: SearchBarProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) return null;

  const popularSearches = [
    "Pizza Hải Sản Phô Mai Kéo Sợi",
    "Burger Bò Phô Mai Khổng Lồ",
    "Trà Sữa Thái Xanh Trân Châu Đường Đen",
    "Gà Rán Giòn Cay Mức Độ 3",
    "Khoai Tây Chiên Lắc Phô Mai Trứng Muối",
    "Nước Ngọt Có Ga Vị Đào Bạc Hà",
    "Pizza Xúc Xích Pepperoni Cỡ Lớn",
    "Sandwich Kẹp Thịt Nướng Trứng Ốp La",
    "Sữa Chua Lắc Trái Cây Nhiệt Đới Tươi",
    "Salad Trộn Cá Hồi Sốt Chanh Dây Mật Ong"
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl bg-[#fffbfb] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header of Modal */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-slate-900">Tìm kiếm món ăn</h2>
          <button 
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 transition-colors p-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Input Area */}
        <div className="p-6 pb-2 border-b">
          <div className="relative flex items-center">
            <input 
              type="text" 
              placeholder="Nhập tên món ăn, đồ uống..." 
              className="w-full bg-white border-2 border-primary rounded-lg py-4 pl-4 pr-16 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-lg"
              autoFocus
            />
            <button className="absolute right-2 bg-red-50 text-primary p-3 rounded-md hover:bg-red-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </button>
          </div>
        </div>

        {/* Results / Suggestions */}
        <div className="p-6 pt-4 overflow-y-auto">
          <Link href="/menu" onClick={onClose}>
            <div className="flex items-center gap-3 p-4 mb-4 bg-red-50 text-primary rounded-lg hover:bg-red-100 transition-colors cursor-pointer border border-red-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <span className="font-medium text-sm">Tìm kiếm và khám phá thực đơn từ <strong>FASTFOOD & DRINKS</strong></span>
            </div>
          </Link>

          <ul className="space-y-1">
            {popularSearches.map((item, idx) => (
              <li key={idx}>
                <Link href="/menu" onClick={onClose} className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-100 transition-colors text-slate-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                  <span className="text-[15px]">{item}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
