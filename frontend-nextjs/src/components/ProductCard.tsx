"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import type { Product } from "@/types/product";
import { getCategoryLabel } from "@/utils/catalog";
import { Button } from "./ui/button";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const user = useAuthStore((state) => state.user);
  const addToCart = useCartStore((state) => state.addToCart);
  const [adding, setAdding] = useState(false);
  const displayImage =
    product.imageUrls?.[0] ||
    product.imageUrl ||
    "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=640&q=70";

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
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative h-52 overflow-hidden bg-slate-100">
        <img
          src={displayImage}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.stock > 0 ? (
          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-emerald-600">
            Còn hàng
          </span>
        ) : (
          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-red-600">
            Hết hàng
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <span className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
          {getCategoryLabel(product.category)}
        </span>
        <h3 className="min-h-[3.5rem] text-lg font-bold leading-tight text-slate-900 transition-colors group-hover:text-primary">
          {product.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-slate-500">
          {product.description || "Sản phẩm được trình bày theo giao diện FE2 và kết nối đến backend Spring Boot."}
        </p>

        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-2xl font-black text-primary">
              {product.price.toLocaleString("vi-VN")}đ
            </p>
            <p className="text-xs text-slate-400">Còn {product.stock} sản phẩm</p>
          </div>
          <Button
            size="sm"
            className="rounded-full bg-primary px-4 text-white shadow-md hover:bg-primary/90"
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
