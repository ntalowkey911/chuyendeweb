"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export default function Navbar() {
  const { user, hydrate, logout, isAdmin } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <header className="border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold text-indigo-600">
          CD Shop
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link href="/products">Sản phẩm</Link>
          {user ? (
            <>
              <span className="text-slate-600">Xin chào, {user.fullName}</span>
              <Link href="/cart">Giỏ hàng</Link>
              <Link href="/orders">Đơn hàng</Link>
              {isAdmin() && (
                <Link href="/admin" className="text-amber-600">
                  Admin
                </Link>
              )}
              <button
                onClick={logout}
                className="rounded bg-slate-800 px-3 py-1 text-white"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link href="/login">Đăng nhập</Link>
              <Link href="/register">Đăng ký</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
