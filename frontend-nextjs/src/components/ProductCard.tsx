"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import type { Product } from "@/types/product";
import { Button } from "./ui/button";

interface ProductCardProps {
  product: Product;
}

const fallbackImage =
  "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=640&q=70";

export function ProductCard({ product }: ProductCardProps) {
  const user = useAuthStore((state) => state.user);
  const addToCart = useCartStore((state) => state.addToCart);
  const [adding, setAdding] = useState(false);
  const displayImage = product.imageUrls?.[0] || product.imageUrl || fallbackImage;

  const handleAdd = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!user) {
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
