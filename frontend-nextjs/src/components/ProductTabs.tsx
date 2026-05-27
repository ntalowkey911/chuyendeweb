"use client";

import { useState } from "react";

export function ProductTabs({ description }: { description: string }) {
  const [activeTab, setActiveTab] = useState("details");

  return (
    <div className="mb-16 max-w-4xl">
      <div className="mb-8 flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("details")}
          className={`px-8 py-4 text-lg font-bold transition-colors ${activeTab === "details" ? "border-b-2 border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-800"}`}
        >
          Chi tiết món ăn
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={`flex items-center gap-2 px-8 py-4 text-lg font-bold transition-colors ${activeTab === "reviews" ? "border-b-2 border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-800"}`}
        >
          Đánh giá <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">120</span>
        </button>
      </div>

      <div className="min-h-[200px] max-w-none rounded-2xl border border-slate-100 bg-white p-8 text-lg leading-loose text-slate-600 shadow-sm">
        {activeTab === "details" ? (
          <p>{description}</p>
        ) : (
          <div className="space-y-6">
            <div className="flex items-start gap-4 border-b border-slate-100 pb-6">
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-slate-200">
                <img src="https://i.pravatar.cc/150?img=32" alt="Avatar" className="h-full w-full object-cover" />
              </div>
              <div>
                <h4 className="mb-1 text-base font-bold text-slate-800">Minh Tuấn</h4>
                <div className="mb-2 flex text-primary">
                  {[...Array(5)].map((_, index) => (
                    <svg key={index} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  ))}
                </div>
                <p className="m-0 text-base text-slate-600">
                  Món ăn rất ngon, đóng gói siêu cẩn thận. Giao hàng đúng 20 phút là tới nơi rồi, đồ vẫn còn nóng hổi. Sẽ ủng hộ shop dài dài!
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 border-b border-slate-100 pb-6">
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-slate-200">
                <img src="https://i.pravatar.cc/150?img=47" alt="Avatar" className="h-full w-full object-cover" />
              </div>
              <div>
                <h4 className="mb-1 text-base font-bold text-slate-800">Lan Ngọc</h4>
                <div className="mb-2 flex text-primary">
                  {[...Array(4)].map((_, index) => (
                    <svg key={index} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  ))}
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                </div>
                <p className="m-0 text-base text-slate-600">
                  Chất lượng tuyệt vời. Khẩu phần ăn vừa đủ cho 1 người. Chỉ có điều là cuối tuần nên giao hơi chậm tí xíu, bù lại đồ ăn siêu ngon.
                </p>
              </div>
            </div>

            <button className="mt-4 w-full text-center text-base font-bold text-primary hover:underline">
              Xem thêm 118 đánh giá khác
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
