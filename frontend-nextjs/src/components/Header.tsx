"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Container } from "./Container";
import { SearchBar } from "./SearchBar";
import { Button } from "./ui/button";

const navItems = [
  { href: "/", label: "Trang chủ" },
  { href: "/menu", label: "Sản phẩm" },
];

export function Header() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user, hydrate, logout, isAdmin } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/60 bg-white/90 shadow-sm backdrop-blur">
        <Container className="flex h-20 items-center justify-between gap-4">
          <Link href="/" className="text-lg font-black tracking-tight text-primary md:text-2xl">
            FASTFOOD & DRINKS
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-600 lg:flex">
            {navItems.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    active
                      ? "border-b-2 border-primary py-2 text-primary"
                      : "py-2 transition-colors hover:text-primary"
                  }
                >
                  {item.label}
                </Link>
              );
            })}
            {user && (
              <Link
                href="/orders"
                className={pathname.startsWith("/orders") ? "text-primary" : "hover:text-primary"}
              >
                Đơn hàng
              </Link>
            )}
            {user && isAdmin() && (
              <Link
                href="/admin"
                className={pathname.startsWith("/admin") ? "text-primary" : "text-amber-700 hover:text-amber-800"}
              >
                Admin
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-primary hover:bg-red-50"
              onClick={() => setIsSearchOpen(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            </Button>
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="text-primary hover:bg-red-50">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>
              </Button>
            </Link>
            {user ? (
              <>
                <span className="hidden text-sm font-semibold text-slate-600 md:inline">
                  {user.fullName}
                </span>
                <Button
                  variant="outline"
                  className="rounded-full border-red-100 bg-white hover:bg-red-50"
                  onClick={logout}
                >
                  Đăng xuất
                </Button>
              </>
            ) : (
              <div className="hidden items-center gap-2 md:flex">
                <Link href="/login">
                  <Button variant="ghost" className="rounded-full text-primary hover:bg-red-50">
                    Đăng nhập
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="rounded-full bg-primary px-5 text-white hover:bg-primary/90">
                    Đăng ký
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </Container>
      </header>

      <SearchBar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
