"use client";

import Image from "next/image";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import type { Product } from "@/types/product";
import { Button } from "./ui/button";

interface ProductDetailClientProps {
  product: Product;
}

const fallbackImage =
  "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=960&q=75";

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const user = useAuthStore((state) => state.user);
  const addToCart = useCartStore((state) => state.addToCart);
  const gallery =
    product.imageUrls?.length ? product.imageUrls : product.imageUrl ? [product.imageUrl] : [fallbackImage];

  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [activeImage, setActiveImage] = useState(gallery[0] || fallbackImage);

  const handleAddToCart = async () => {
    if (!user) {
      window.location.href = "/login";
      return;
    }

    try {
      setAdding(true);
      await addToCart(product.id, quantity);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="rounded-[2rem] border border-slate-100 bg-[#fcfaf9] p-5 shadow-sm md:p-10">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-[2rem] bg-[#f2efe9] p-3 shadow-inner md:p-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-[1.5rem]">
              <Image
                src={activeImage}
                alt={product.name}
                fill
                priority
                quality={75}
                sizes="(max-width: 1024px) 100vw, 48vw"
                className="object-cover"
              />
            </div>
          </div>

          {gallery.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {gallery.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  onClick={() => setActiveImage(image)}
                  className={`overflow-hidden rounded-2xl border-2 ${
                    activeImage === image ? "border-primary" : "border-slate-200"
                  }`}
                >
                  <div className="relative aspect-square w-full">
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      quality={60}
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <span className="mb-3 inline-block w-fit rounded-full bg-red-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            {product.categoryName || product.category}
          </span>
          <h1 className="text-3xl font-black text-slate-900 md:text-4xl">{product.name}</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            {product.description || "Sản phẩm khô tiện trữ, đóng gói gọn và dễ dùng hằng ngày."}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.5rem] bg-white p-4 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Giá</p>
              <p className="mt-2 text-2xl font-black text-primary">
                {product.price.toLocaleString("vi-VN")}đ
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-white p-4 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Tồn kho</p>
              <p className="mt-2 text-2xl font-black text-slate-900">{product.stock}</p>
            </div>
            <div className="rounded-[1.5rem] bg-white p-4 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Đã bán</p>
              <p className="mt-2 text-2xl font-black text-slate-900">{product.soldCount ?? 0}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-full border border-red-100 bg-red-50 p-1">
              <button
                className="h-11 w-11 rounded-full text-lg font-bold text-slate-700 hover:bg-white"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              >
                -
              </button>
              <span className="w-10 text-center font-bold text-slate-900">{quantity}</span>
              <button
                className="h-11 w-11 rounded-full text-lg font-bold text-slate-700 hover:bg-white"
                onClick={() => setQuantity((value) => value + 1)}
              >
                +
              </button>
            </div>

            <Button
              className="h-14 flex-1 rounded-full bg-primary text-base font-bold text-white shadow-lg shadow-red-500/20 hover:bg-primary/90"
              onClick={handleAddToCart}
              disabled={adding || product.stock === 0}
            >
              {adding ? "Đang thêm vào giỏ" : "Thêm vào giỏ hàng"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
