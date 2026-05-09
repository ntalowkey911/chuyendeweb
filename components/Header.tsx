"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Container } from "./Container";
import { Button } from "./ui/button";
import { SearchBar } from "./SearchBar";

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
            <Link href="/" className="text-primary border-b-2 border-primary py-2">
              Trang chủ
            </Link>
            <Link href="/menu" className="text-slate-600 hover:text-primary transition-colors">
              Thực đơn
            </Link>
            <Link href="/promotions" className="text-slate-600 hover:text-primary transition-colors">
              Khuyến mãi
            </Link>
            <Link href="/news" className="text-slate-600 hover:text-primary transition-colors">
              Tin tức
            </Link>
            <Link href="/contact" className="text-slate-600 hover:text-primary transition-colors">
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
            <Button variant="ghost" size="icon" className="relative text-primary hover:bg-red-50 hover:text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            </Button>
            <Button variant="ghost" size="icon" className="text-primary hover:bg-red-50 hover:text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </Button>
          </div>
        </Container>
      </header>

      <SearchBar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
