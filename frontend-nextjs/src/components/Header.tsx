"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { Container } from "./Container";
import { SearchBar } from "./SearchBar";
import { Button } from "./ui/button";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const navItems = [
  { href: "/", label: "Trang chủ" },
  { href: "/menu", label: "Sản phẩm" },
];

export function Header() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAdmin } = useAuthStore();
  const { cart, fetchCart } = useCartStore();

  useEffect(() => {
    if (user) {
      void fetchCart();
    }
  }, [fetchCart, user]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const cartCount = useMemo(
    () => cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0,
    [cart]
  );

  const sharedLinks = (
    <>
      {navItems.map((item) => {
        const active = item.href === "/" ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={active ? "text-primary" : "text-slate-600 transition-colors hover:text-primary"}
          >
            {item.label}
          </Link>
        );
      })}
      {user && (
        <Link
          href="/orders"
          className={
            pathname.startsWith("/orders")
              ? "text-primary"
              : "text-slate-600 transition-colors hover:text-primary"
          }
        >
          Đơn hàng
        </Link>
      )}
      {user && isAdmin() && (
        <>
          <Link
            href="/admin"
            className={pathname === "/admin" ? "text-primary" : "text-emerald-700 transition-colors hover:text-emerald-800"}
          >
            Admin
          </Link>
          <Link
            href="/admin/orders"
            className={
              pathname.startsWith("/admin/orders")
                ? "text-primary"
                : "text-emerald-700 transition-colors hover:text-emerald-800"
            }
          >
            Đơn admin
          </Link>
        </>
      )}
    </>
  );

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/60 bg-white/90 shadow-sm backdrop-blur">
        <Container className="flex h-16 items-center justify-between gap-3 md:h-20">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 lg:hidden"
              onClick={() => setIsMenuOpen((value) => !value)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M3 12h18" /><path d="M3 18h18" /></svg>
            </button>
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50 shadow-sm">
                <Image src="/logo.png" alt="Logo Nông Sản Sấy" fill sizes="40px" className="object-cover" />
              </div>
              <div className="leading-tight">
                <p className="text-base font-black tracking-tight text-primary md:text-xl">Nông Sản Sấy</p>
                <p className="hidden text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700/60 sm:block">
                  Pantry xanh gọn
                </p>
              </div>
            </Link>
          </div>

          <nav className="hidden items-center gap-6 text-sm font-semibold lg:flex">{sharedLinks}</nav>

          <div className="flex items-center gap-1 md:gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-primary hover:bg-emerald-50"
              onClick={() => setIsSearchOpen(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            </Button>

            <Link href="/cart" className="relative">
              <Button variant="ghost" size="icon" className="text-primary hover:bg-emerald-50">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>
              </Button>
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-black text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            <SignedIn>
              <div className="hidden md:block">
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
            <SignedOut>
              <div className="hidden items-center gap-2 md:flex">
                <Link href="/login">
                  <Button variant="ghost" className="rounded-full text-primary hover:bg-emerald-50">
                    Đăng nhập
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="rounded-full bg-primary px-5 text-white hover:bg-primary/90">
                    Đăng ký
                  </Button>
                </Link>
              </div>
            </SignedOut>
          </div>
        </Container>

        {isMenuOpen && (
          <div className="border-t border-slate-100 bg-white lg:hidden">
            <Container className="flex flex-col gap-4 py-4 text-sm font-semibold">
              {sharedLinks}
              <SignedIn>
                <div className="flex items-center gap-4 rounded-2xl bg-slate-50 px-4 py-3 text-slate-700">
                  <UserButton afterSignOutUrl="/" />
                  <span className="font-bold text-slate-900">Tài khoản của bạn</span>
                </div>
              </SignedIn>
              <SignedOut>
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/login" className="rounded-2xl border border-slate-200 px-4 py-3 text-center text-slate-700">
                    Đăng nhập
                  </Link>
                  <Link href="/register" className="rounded-2xl bg-primary px-4 py-3 text-center text-white">
                    Đăng ký
                  </Link>
                </div>
              </SignedOut>
            </Container>
          </div>
        )}
      </header>

      <SearchBar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
