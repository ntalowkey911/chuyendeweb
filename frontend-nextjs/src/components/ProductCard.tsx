"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useUser } from "@clerk/nextjs";
import type { Product } from "@/types/product";
import { Button } from "./ui/button";

interface ProductCardProps {
  product: Product;
}

const fallbackImage =
  "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=640&q=70";

export function ProductCard({ product }: ProductCardProps) {
  const userStore = useAuthStore((state) => state.user);
  const { user, isLoaded } = useUser();
  const addToCart = useCartStore((state) => state.addToCart);
  const [adding, setAdding] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  
  const displayImage = product.imageUrls?.[0] || product.imageUrl || fallbackImage;

  const wishlistIds = (user?.unsafeMetadata?.wishlist as string[]) || [];
  const isWishlisted = wishlistIds.includes(product.id);

  const handleAdd = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!userStore) {
      window.location.href = "/login";
      return;
    }

    try {
      setAdding(true);
      await addToCart(product.id, 1);
    } finally {
      setAdding(false);
    }
  };

  const handleToggleWishlist = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (!user) {
      window.location.href = "/login";
      return;
    }
    
    setWishlistLoading(true);
    try {
      let newWishlist = [...wishlistIds];
      if (isWishlisted) {
        newWishlist = newWishlist.filter(id => id !== product.id);
      } else {
        newWishlist.push(product.id);
      }
      
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          wishlist: newWishlist
        }
      });
    } catch (e) {
      console.error("Failed to update wishlist", e);
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <Link
      href={`/product/${product.id}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-[1.6rem] border border-slate-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[0.95] overflow-hidden bg-slate-100">
        <Image
          src={displayImage}
          alt={product.name}
          fill
          quality={68}
          sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          disabled={wishlistLoading}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-slate-400 shadow-sm backdrop-blur transition-all hover:scale-110 hover:bg-white hover:text-rose-500 disabled:opacity-50"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill={isWishlisted ? "#f43f5e" : "none"} 
            stroke={isWishlisted ? "#f43f5e" : "currentColor"} 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
          </svg>
        </button>
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <h3 className="min-h-[2.8rem] text-sm font-black leading-tight text-slate-900 transition-colors group-hover:text-primary sm:text-base">
          {product.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-xs text-slate-500 sm:text-sm">
          {product.description || "Sản phẩm khô tiện trữ, gọn cho căn bếp hằng ngày."}
        </p>

        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 sm:text-xs">
          <span>Còn {product.stock}</span>
          <span>Đã bán {product.soldCount ?? 0}</span>
        </div>

        <div className="mt-4 flex items-end justify-between gap-2">
          <div>
            <p className="text-base font-black text-primary sm:text-xl">
              {product.price.toLocaleString("vi-VN")}đ
            </p>
          </div>
          <Button
            size="sm"
            className="rounded-full bg-primary px-3 text-xs font-bold text-white shadow-md hover:bg-primary/90 sm:px-4"
            disabled={adding || product.stock === 0}
            onClick={handleAdd}
          >
            {adding ? "Đang thêm" : "Thêm"}
          </Button>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
