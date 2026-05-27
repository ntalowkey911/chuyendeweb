"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { ProductTabs } from "@/components/ProductTabs";
import { Button } from "@/components/ui/button";
import { productService } from "@/services/productService";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import type { Product } from "@/types/product";
import { getCategoryLabel } from "@/utils/catalog";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const user = useAuthStore((state) => state.user);
  const addToCart = useCartStore((state) => state.addToCart);
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    if (!id) return;

    const loadProduct = async () => {
      try {
        setLoading(true);
        const response = await productService.getById(id);
        setProduct(response.data);
        setActiveImage(
          response.data.imageUrls?.[0] ||
            response.data.imageUrl ||
            ""
        );
      } catch {
        setError("Không tìm thấy sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    void loadProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
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

  const gallery =
    product?.imageUrls?.length
      ? product.imageUrls
      : product?.imageUrl
        ? [product.imageUrl]
        : [];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 py-10">
        <Container>
          {loading && <div className="py-20 text-center text-slate-500">Đang tải chi tiết sản phẩm...</div>}
          {error && <div className="py-20 text-center text-red-600">{error}</div>}

          {product && (
            <>
              <div className="mb-12 rounded-[2rem] border border-slate-100 bg-[#fcfaf9] p-6 shadow-sm md:p-12">
                <div className="grid gap-12 lg:grid-cols-2">
                  <div className="space-y-4">
                    <div className="overflow-hidden rounded-[2rem] bg-[#f2efe9] p-4 shadow-inner">
                      <img
                        src={activeImage}
                        alt={product.name}
                        className="aspect-square w-full rounded-[1.5rem] object-cover"
                      />
                    </div>
                    {gallery.length > 1 && (
                      <div className="grid grid-cols-4 gap-3">
                        {gallery.map((image) => (
                          <button
                            key={image}
                            onClick={() => setActiveImage(image)}
                            className={`overflow-hidden rounded-2xl border-2 ${activeImage === image ? "border-primary" : "border-slate-200"}`}
                          >
                            <img src={image} alt={product.name} className="aspect-square w-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <span className="mb-3 inline-block w-fit rounded-full bg-red-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                      {getCategoryLabel(product.category)}
                    </span>
                    <h1 className="text-4xl font-black text-slate-900">{product.name}</h1>
                    <p className="mt-4 text-lg leading-relaxed text-slate-600">
                      {product.description || "Sản phẩm được hiển thị bằng giao diện FE2 và dữ liệu từ backend Spring Boot."}
                    </p>

                    <div className="mt-8">
                      <p className="text-5xl font-black text-primary">
                        {product.price.toLocaleString("vi-VN")}đ
                      </p>
                      <p className="mt-2 text-sm text-slate-500">Còn {product.stock} sản phẩm trong kho</p>
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
                        className="h-14 flex-1 rounded-full bg-primary text-lg font-bold text-white shadow-lg shadow-red-500/20 hover:bg-primary/90"
                        onClick={handleAddToCart}
                        disabled={adding || product.stock === 0}
                      >
                        {adding ? "Đang thêm vào giỏ" : "Thêm vào giỏ hàng"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <ProductTabs
                description={
                  product.description ||
                  "Chi tiết sản phẩm được bố trí theo phần tab của FE2, nhưng vẫn đọc dữ liệu thật từ backend."
                }
              />
            </>
          )}
        </Container>
      </main>

      <Footer />
    </div>
  );
}
