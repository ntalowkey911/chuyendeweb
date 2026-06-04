"use client";

import Image from "next/image";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import type { Product } from "@/types/product";
import { Button } from "./ui/button";
import { ProductReviews } from "./ProductReviews";

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

  const { user: clerkUser } = useUser();
  const router = useRouter();

  const wishlist = (clerkUser?.unsafeMetadata?.wishlist as string[]) || [];
  const isWishlisted = wishlist.includes(product.id);
  const [updatingWishlist, setUpdatingWishlist] = useState(false);

  const toggleWishlist = async () => {
    if (!clerkUser) {
      window.location.href = "/login";
      return;
    }
    try {
      setUpdatingWishlist(true);
      const newWishlist = isWishlisted
        ? wishlist.filter((id) => id !== product.id)
        : [...wishlist, product.id];
      
      await clerkUser.update({
        unsafeMetadata: {
          ...clerkUser.unsafeMetadata,
          wishlist: newWishlist,
        },
      });
    } catch (err) {
      console.error("Failed to update wishlist", err);
    } finally {
      setUpdatingWishlist(false);
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    try {
      setAdding(true);
      await addToCart(product.id, quantity);
      router.push("/checkout");
    } finally {
      setAdding(false);
    }
  };

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
          <div className="flex items-center justify-between">
            <span className="mb-3 inline-block w-fit rounded-full bg-red-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              {product.categoryName || product.category}
            </span>
            <button
              onClick={toggleWishlist}
              disabled={updatingWishlist}
              className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                isWishlisted
                  ? "bg-red-50 text-red-500"
                  : "bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            </button>
          </div>
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

            <div className="flex flex-1 gap-2">
              <Button
                className="h-14 flex-1 rounded-full bg-slate-900 text-base font-bold text-white shadow-lg hover:bg-slate-800"
                onClick={handleAddToCart}
                disabled={adding || product.stock === 0}
              >
                {adding ? "Đang thêm..." : "Thêm vào giỏ"}
              </Button>
              <Button
                className="h-14 flex-1 rounded-full bg-primary text-base font-bold text-white shadow-lg shadow-red-500/20 hover:bg-primary/90"
                onClick={handleBuyNow}
                disabled={adding || product.stock === 0}
              >
                Mua ngay
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <ProductReviews productId={product.id} />
    </div>
  );
}
