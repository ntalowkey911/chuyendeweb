"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "./Container";
import { Button } from "./ui/button";
import { SearchBar } from "./SearchBar";
import { UserButton, Show } from "@clerk/nextjs";

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <Container className="flex h-20 items-center justify-between">
          <div className="flex gap-2">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl md:text-2xl font-black tracking-tighter text-primary">
                FASTFOOD & DRINKS
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
            <Link 
              href="/" 
              className={`py-2 transition-colors ${pathname === "/" ? "text-primary border-b-2 border-primary" : "text-slate-600 hover:text-primary"}`}
            >
              Trang chủ
            </Link>
            <Link 
              href="/menu" 
              className={`py-2 transition-colors ${pathname.startsWith("/menu") ? "text-primary border-b-2 border-primary" : "text-slate-600 hover:text-primary"}`}
            >
              Thực đơn
            </Link>
            <Link 
              href="/promotions" 
              className={`py-2 transition-colors ${pathname.startsWith("/promotions") ? "text-primary border-b-2 border-primary" : "text-slate-600 hover:text-primary"}`}
            >
              Khuyến mãi
            </Link>
            <Link 
              href="/news" 
              className={`py-2 transition-colors ${pathname.startsWith("/news") ? "text-primary border-b-2 border-primary" : "text-slate-600 hover:text-primary"}`}
            >
              Tin tức
            </Link>
            <Link 
              href="/contact" 
              className={`py-2 transition-colors ${pathname.startsWith("/contact") ? "text-primary border-b-2 border-primary" : "text-slate-600 hover:text-primary"}`}
            >
              Liên hệ
            </Link>
          </nav>

          <div className="flex items-center gap-1 md:gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-primary hover:bg-red-50 hover:text-primary"
              onClick={() => setIsSearchOpen(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </Button>
            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="text-primary hover:bg-red-50 hover:text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
              </Button>
            </Link>
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative text-primary hover:bg-red-50 hover:text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
              </Button>
            </Link>
            
            <Show when="signed-in">
              <UserButton 
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-8 h-8",
                  }
                }}
              />
            </Show>
            <Show when="signed-out">
              <Link href="/signin">
                <Button variant="ghost" size="icon" className="text-primary hover:bg-red-50 hover:text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </Button>
              </Link>
            </Show>
          </div>
        </Container>
      </header>

      <SearchBar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
