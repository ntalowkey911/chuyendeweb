"use client";

import { useEffect, useState } from "react";
import { productService } from "@/services/productService";
import type { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  limit?: number;
  category?: string;
  keyword?: string;
  priceFilter?: string;
}

export function ProductGrid({
  limit,
  category,
  keyword,
  priceFilter,
}: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await productService.getAll();
        let data = response.data;

        if (category) {
          data = data.filter((product) => product.category === category);
        }

        if (keyword?.trim()) {
          const query = keyword.trim().toLowerCase();
          data = data.filter((product) =>
            [product.name, product.description, product.brand, product.category]
              .filter(Boolean)
              .some((value) => value!.toLowerCase().includes(query))
          );
        }

        if (priceFilter === "under100") {
          data = data.filter((product) => product.price < 100000);
        } else if (priceFilter === "100to200") {
          data = data.filter(
            (product) => product.price >= 100000 && product.price <= 200000
          );
        } else if (priceFilter === "above200") {
          data = data.filter((product) => product.price > 200000);
        }

        setProducts(limit ? data.slice(0, limit) : data);
      } catch {
        setError("Không tải được danh sách sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    void loadProducts();
  }, [category, keyword, limit, priceFilter]);

  if (loading) {
    return <div className="py-12 text-center text-slate-500">Đang tải sản phẩm...</div>;
  }

  if (error) {
    return <div className="py-12 text-center text-red-600">{error}</div>;
  }

  if (products.length === 0) {
    return <div className="py-12 text-center text-slate-500">Không có sản phẩm phù hợp.</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
