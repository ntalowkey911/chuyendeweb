"use client";

import React, { useState } from "react";

export function ProductTabs({ description }: { description: string }) {
  const [activeTab, setActiveTab] = useState("details");

  return (
    <div className="mb-16 max-w-4xl">
      <div className="flex border-b border-slate-200 mb-8">
        <button 
          onClick={() => setActiveTab("details")}
          className={`px-8 py-4 border-b-2 font-bold text-lg transition-colors ${activeTab === 'details' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Chi tiết món ăn
        </button>
        <button 
          onClick={() => setActiveTab("reviews")}
          className={`px-8 py-4 border-b-2 font-bold text-lg transition-colors flex items-center gap-2 ${activeTab === 'reviews' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Đánh giá <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full font-bold">120</span>
        </button>
      </div>
      
      <div className="prose prose-slate max-w-none text-slate-600 leading-loose text-lg bg-white p-8 rounded-2xl shadow-sm border border-slate-100 min-h-[200px]">
        {activeTab === 'details' ? (
          <p>
            {description}
          </p>
        ) : (
          <div className="space-y-6">
            <div className="flex items-start gap-4 pb-6 border-b border-slate-100">
              <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                <img src="https://i.pravatar.cc/150?img=32" alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 mb-1 text-base">Minh Tuấn</h4>
                <div className="flex text-primary mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                </div>
                <p className="text-slate-600 text-base m-0">Món ăn rất ngon, đóng gói siêu cẩn thận. Giao hàng đúng 20 phút là tới nơi rồi, đồ vẫn còn nóng hổi. Sẽ ủng hộ shop dài dài!</p>
              </div>
            </div>

            <div className="flex items-start gap-4 pb-6 border-b border-slate-100">
              <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                <img src="https://i.pravatar.cc/150?img=47" alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 mb-1 text-base">Lan Ngọc</h4>
                <div className="flex text-primary mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                </div>
                <p className="text-slate-600 text-base m-0">Chất lượng tuyệt vời. Khẩu phần ăn vừa đủ cho 1 người. Chỉ có điều là cuối tuần nên giao hơi chậm tí xíu, bù lại đồ ăn siêu ngon.</p>
              </div>
            </div>

            <button className="text-primary font-bold hover:underline text-base w-full text-center mt-4">
              Xem thêm 118 đánh giá khác
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
