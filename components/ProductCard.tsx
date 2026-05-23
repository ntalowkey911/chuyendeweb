"use client";

import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

export function ProductCard({ product }: { product: any }) {
  return (
    <Link href={`/product/${product.slug}`} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-slate-100 flex flex-col h-full group relative block">
      <div className="relative h-48 bg-slate-100 overflow-hidden">
        <img 
          src={product.images?.[0] || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800"} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        
        {/* Tag */}
        {product.discountPrice && (
          <div className="absolute top-3 left-3 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm bg-primary z-10">
            Giảm giá
          </div>
        )}
        
        {/* Favorite Button */}
        <button 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-slate-500 hover:text-primary hover:bg-white transition-colors shadow-sm z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        </button>
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        <span className="text-slate-400 text-[10px] font-bold tracking-wider mb-1 uppercase">
          {product.category?.name || "MÓN ĂN"}
        </span>
        <h3 className="font-bold text-slate-900 mb-2 line-clamp-2 min-h-[40px] leading-tight group-hover:text-primary transition-colors">{product.name}</h3>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex text-primary">
            {[...Array(5)].map((_, i) => (
              <svg key={i} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill={i < Math.floor(product.rating || 4) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            ))}
          </div>
          <span className="text-xs text-slate-500 font-medium">({product.rating || "4.5"})</span>
        </div>
        
        <div className="flex justify-between items-center mt-auto pt-3">
          <div>
            <div className="font-extrabold text-primary text-lg leading-none">
              {(product.discountPrice || product.price).toLocaleString('vi-VN')}đ
            </div>
            {product.discountPrice && (
              <div className="text-[10px] text-slate-400 line-through mt-1">
                {product.price.toLocaleString('vi-VN')}đ
              </div>
            )}
          </div>
          <Button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            size="sm" 
            className="h-9 rounded-full bg-primary hover:bg-primary/90 text-white shadow-md flex-shrink-0 px-3 flex items-center gap-1 relative z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            <span className="text-xs font-bold">Thêm</span>
          </Button>
        </div>
      </div>
    </Link>
  );
}
