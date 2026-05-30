"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import api from "@/services/api";
import type { Product } from "@/types/product";
import { ProductCard } from "@/components/ProductCard";

export default function WishlistTab() {
  const { user, isLoaded } = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const wishlistIds = (user.unsafeMetadata?.wishlist as string[]) || [];

    if (wishlistIds.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    api
      .get<Product[]>("/products?activeOnly=true")
      .then((res) => {
        const allProducts = res.data;
        const wishlistProducts = allProducts.filter((p) => wishlistIds.includes(p.id));
        setProducts(wishlistProducts);
      })
      .catch((err) => console.error("Failed to load wishlist", err))
      .finally(() => setLoading(false));
  }, [user, isLoaded]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Danh sách yêu thích</h2>
        <p className="mt-1 text-sm text-slate-500">
          Những sản phẩm bạn đã lưu lại để mua sau.
        </p>
      </div>

      {loading && <p className="text-slate-500">Đang tải danh sách yêu thích...</p>}

      {!loading && products.length === 0 && (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center text-slate-500">
          Bạn chưa có sản phẩm nào trong danh sách yêu thích.
          <div className="mt-4">
            <Link href="/menu" className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-primary/90">
              Khám phá ngay
            </Link>
          </div>
        </div>
      )}

      {!loading && products.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
