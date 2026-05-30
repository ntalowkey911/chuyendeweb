"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
}

const popularSearches = [
  "Mít sấy",
  "Combo mix",
  "Hạt điều",
  "Yến mạch",
  "Rong biển khô",
];

export function SearchBar({ isOpen, onClose }: SearchBarProps) {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");

  if (!isOpen) return null;

  const submitSearch = (value: string) => {
    const query = value.trim();
    router.push(query ? `/menu?keyword=${encodeURIComponent(query)}` : "/menu");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="max-h-[85vh] w-full max-w-3xl overflow-hidden rounded-[2rem] bg-[#fffbfb] shadow-2xl">
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-2xl font-bold text-slate-900">Tìm kiếm sản phẩm</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            ×
          </button>
        </div>

        <div className="border-b p-6">
          <form
            className="relative"
            onSubmit={(event) => {
              event.preventDefault();
              submitSearch(keyword);
            }}
          >
            <input
              type="text"
              placeholder="Nhập tên sản phẩm, ví dụ: mít sấy, hạt điều..."
              className="w-full rounded-2xl border-2 border-primary bg-white px-4 py-4 pr-14 text-lg text-slate-700 outline-none"
              autoFocus
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
            />
            <button
              type="submit"
              className="absolute right-2 top-2 rounded-xl bg-red-50 p-3 text-primary hover:bg-red-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            </button>
          </form>
        </div>

        <div className="space-y-2 overflow-y-auto p-6">
          <Link
            href="/menu"
            onClick={onClose}
            className="block rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-primary"
          >
            Mở toàn bộ sản phẩm
          </Link>
          {popularSearches.map((item) => (
            <button
              key={item}
              onClick={() => submitSearch(item)}
              className="flex w-full items-center gap-3 rounded-xl p-3 text-left text-slate-700 transition-colors hover:bg-slate-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
              <span>{item}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
