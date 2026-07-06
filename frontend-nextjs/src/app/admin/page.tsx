"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import ProductForm from "@/components/ProductForm";
import ProtectedRoute from "@/components/ProtectedRoute";
import { adminService } from "@/services/adminService";
import { categoryService } from "@/services/categoryService";
import { productService } from "@/services/productService";
import type { AdminOverview } from "@/types/admin";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";
import { formatPrice } from "@/utils/format";

const fallbackImage =
  "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=320&q=70";

function AdminContent() {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [loading, setLoading] = useState(true);

  const [productPage, setProductPage] = useState(0);
  const [productTotalPages, setProductTotalPages] = useState(1);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [productSaving, setProductSaving] = useState(false);

  const loadOverview = async (force = false) => {
    const data = await adminService.getOverview(force);
    setOverview(data);
  };

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const loadProducts = async () => {
    // Fetch all products (up to 1000) for local filtering and pagination
    const res = await adminService.getProducts(0, 1000);
    setAllProducts(res.data.content);
  };

  const filteredProducts = useMemo(() => {
    let filtered = allProducts;
    if (selectedCategory !== "all") {
      filtered = filtered.filter(p => p.category === selectedCategory || p.categoryName === selectedCategory);
    }
    return filtered;
  }, [allProducts, selectedCategory]);

  const products = useMemo(() => {
    const startIndex = productPage * 10;
    return filteredProducts.slice(startIndex, startIndex + 10);
  }, [filteredProducts, productPage]);

  useEffect(() => {
    setProductTotalPages(Math.max(1, Math.ceil(filteredProducts.length / 10)));
    // Reset to page 0 if current page is out of bounds
    if (productPage >= Math.ceil(filteredProducts.length / 10)) {
      setProductPage(0);
    }
  }, [filteredProducts.length, productPage]);

  useEffect(() => {
    void (async () => {
      try {
        await Promise.all([
          loadOverview(false),
          loadProducts()
        ]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const customers = overview?.customers ?? [];
  const categories = overview?.categories ?? [];
  const stats = overview?.stats ?? null;

  const totalSold = useMemo(
    () => products.reduce((sum, product) => sum + (product.soldCount ?? 0), 0),
    [products]
  );

  const resetCategoryForm = () => {
    setEditingCategory(null);
    setCategoryName("");
    setCategoryDescription("");
  };

  const refreshAfterStorefrontChange = async (productId?: string) => {
    adminService.invalidateOverviewCache();
    await Promise.all([
      adminService.revalidateStorefront(productId),
      loadOverview(true),
      loadProducts(),
    ]);
  };

  const submitCategory = async (event: React.FormEvent) => {
    event.preventDefault();
    setCategoryLoading(true);

    try {
      const payload = {
        name: categoryName.trim(),
        description: categoryDescription.trim(),
      };

      if (editingCategory) {
        await categoryService.update(editingCategory.id, payload);
      } else {
        await categoryService.create(payload);
      }

      resetCategoryForm();
      await refreshAfterStorefrontChange();
    } finally {
      setCategoryLoading(false);
    }
  };

  if (loading && !overview) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1 py-8 md:py-10">
          <Container>
            <div className="rounded-[1.8rem] border border-slate-100 bg-white p-8 text-center text-slate-500 shadow-sm">
              Đang tải bảng quản trị...
            </div>
          </Container>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8 md:py-10">
        <Container>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900">Quản trị cửa hàng</h1>
              <p className="mt-2 text-slate-600">
                Gọn dữ liệu hơn, vào nhanh hơn, chỉnh xong là ngoài shop cập nhật sớm hơn.
              </p>
            </div>
              <Link
                href="/admin/statistics"
                className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-700"
              >
                Thống kê
              </Link>
              <Link
                href="/admin/promotions"
                className="rounded-full bg-orange-500 px-5 py-3 text-sm font-bold text-white hover:bg-orange-600"
              >
                Mã giảm giá
              </Link>
              <Link
                href="/admin/orders"
                className="rounded-full bg-primary px-5 py-3 text-sm font-bold text-white hover:bg-primary/90"
              >
                Xem đơn hàng
              </Link>
              <Link
                href="/admin/news"
                className="rounded-full bg-blue-500 px-5 py-3 text-sm font-bold text-white hover:bg-blue-600"
              >
                Tin tức
              </Link>
              <Link
                href="/admin/contacts"
                className="rounded-full bg-purple-500 px-5 py-3 text-sm font-bold text-white hover:bg-purple-600"
              >
                Liên hệ
              </Link>
          </div>

          {stats && (
            <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {[
                ["Người dùng", stats.totalUsers],
                ["Sản phẩm", stats.totalProducts],
                ["Danh mục", categories.length],
                ["Đã bán", totalSold],
                ["Doanh thu", formatPrice(stats.totalRevenue)],
              ].map(([label, value]) => (
                <div key={String(label)} className="rounded-[1.5rem] border border-slate-100 bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">{label}</p>
                  <p className="mt-2 text-2xl font-black text-slate-900">{value}</p>
                </div>
              ))}
            </div>
          )}

          <section className="mb-8 rounded-[1.8rem] border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-black text-slate-900">Danh mục</h2>
              <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-primary">
                {categories.length} danh mục
              </span>
            </div>

            <form
              onSubmit={submitCategory}
              className="mb-6 grid gap-3 rounded-[1.5rem] bg-slate-50 p-4 lg:grid-cols-[1fr_1.4fr_auto]"
            >
              <input
                className="h-12 rounded-2xl border border-slate-200 bg-white px-4 outline-none focus:border-primary"
                placeholder="Tên danh mục"
                value={categoryName}
                onChange={(event) => setCategoryName(event.target.value)}
                required
              />
              <input
                className="h-12 rounded-2xl border border-slate-200 bg-white px-4 outline-none focus:border-primary"
                placeholder="Mô tả ngắn"
                value={categoryDescription}
                onChange={(event) => setCategoryDescription(event.target.value)}
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={categoryLoading}
                  className="rounded-full bg-primary px-4 py-3 text-sm font-bold text-white disabled:opacity-60"
                >
                  {editingCategory ? "Lưu sửa" : "Thêm mới"}
                </button>
                {editingCategory && (
                  <button
                    type="button"
                    onClick={resetCategoryForm}
                    className="rounded-full border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700"
                  >
                    Hủy
                  </button>
                )}
              </div>
            </form>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {categories.map((category) => (
                <div key={category.id} className="rounded-[1.5rem] border border-slate-100 p-4">
                  <p className="text-lg font-black text-slate-900">{category.name}</p>
                  <p className="mt-2 text-sm text-slate-500">{category.description || "Chưa có mô tả."}</p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    {category.slug}
                  </p>
                  <div className="mt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCategory(category);
                        setCategoryName(category.name);
                        setCategoryDescription(category.description || "");
                      }}
                      className="text-sm font-bold text-primary"
                    >
                      Sửa
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        await categoryService.delete(category.id);
                        if (editingCategory?.id === category.id) {
                          resetCategoryForm();
                        }
                        await refreshAfterStorefrontChange();
                      }}
                      className="text-sm font-bold text-red-600"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-8 rounded-[1.8rem] border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-black text-slate-900">Sản phẩm</h2>
              <div className="flex flex-wrap items-center gap-3">
                <select
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-primary"
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setProductPage(0);
                  }}
                >
                  <option value="all">Tất cả danh mục</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <button
                  className="rounded-full bg-primary px-4 py-2 font-bold text-white"
                  onClick={() => {
                    setEditingProduct(null);
                    setShowProductForm(true);
                  }}
                >
                  Thêm sản phẩm
                </button>
              </div>
            </div>

            {showProductForm && (
              <div className="mb-6">
                <ProductForm
                  categories={categories}
                  initial={editingProduct || undefined}
                  onSubmit={async (data) => {
                    try {
                      setProductSaving(true);
                      let productId = editingProduct?.id;

                      if (editingProduct) {
                        const response = await productService.adminUpdate(editingProduct.id, data);
                        productId = response.data.id;
                      } else {
                        const response = await productService.adminCreate(data);
                        productId = response.data.id;
                      }

                      setShowProductForm(false);
                      setEditingProduct(null);
                      await refreshAfterStorefrontChange(productId);
                    } finally {
                      setProductSaving(false);
                    }
                  }}
                  onCancel={() => {
                    setShowProductForm(false);
                    setEditingProduct(null);
                  }}
                />
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-500">
                    <th className="py-3">Sản phẩm</th>
                    <th className="py-3">Danh mục</th>
                    <th className="py-3">Giá</th>
                    <th className="py-3">Tồn kho</th>
                    <th className="py-3">Đã bán</th>
                    <th className="py-3">Ảnh</th>
                    <th className="py-3">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    const images = product.imageUrls?.length
                      ? product.imageUrls
                      : product.imageUrl
                        ? [product.imageUrl]
                        : [fallbackImage];

                    return (
                      <tr key={product.id} className="border-b border-slate-50">
                        <td className="py-4 font-semibold text-slate-900">{product.name}</td>
                        <td className="py-4">{product.categoryName || product.category}</td>
                        <td className="py-4">{formatPrice(product.price)}</td>
                        <td className="py-4">{product.stock}</td>
                        <td className="py-4">{product.soldCount ?? 0}</td>
                        <td className="py-4">
                          <div className="flex -space-x-2">
                            {images.slice(0, 3).map((image, index) => (
                              <div
                                key={`${image}-${index}`}
                                className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-white"
                              >
                                <Image
                                  src={image}
                                  alt={product.name}
                                  fill
                                  sizes="36px"
                                  className="object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex gap-3">
                            <button
                              className="font-semibold text-primary"
                              onClick={() => {
                                setEditingProduct(product);
                                setShowProductForm(true);
                              }}
                            >
                              Sửa
                            </button>
                            <button
                              className="font-semibold text-red-600"
                              disabled={productSaving}
                              onClick={async () => {
                                await productService.adminDelete(product.id);
                                await refreshAfterStorefrontChange(product.id);
                              }}
                            >
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                onClick={() => setProductPage((p) => Math.max(0, p - 1))}
                disabled={productPage === 0}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 disabled:opacity-50 hover:bg-slate-50"
              >
                Trang trước
              </button>
              <span className="text-sm font-semibold text-slate-600">
                Trang {productPage + 1} / {productTotalPages}
              </span>
              <button
                onClick={() => setProductPage((p) => Math.min(productTotalPages - 1, p + 1))}
                disabled={productPage >= productTotalPages - 1}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 disabled:opacity-50 hover:bg-slate-50"
              >
                Trang sau
              </button>
            </div>
          </section>

          <section className="rounded-[1.8rem] border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-black text-slate-900">Khách hàng và doanh thu</h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[840px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-500">
                    <th className="py-3">Khách hàng</th>
                    <th className="py-3">Email</th>
                    <th className="py-3">SĐT</th>
                    <th className="py-3">Số đơn</th>
                    <th className="py-3">Hoàn tất</th>
                    <th className="py-3">Doanh thu</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id} className="border-b border-slate-50">
                      <td className="py-4 font-semibold text-slate-900">{customer.fullName}</td>
                      <td className="py-4">{customer.email}</td>
                      <td className="py-4">{customer.phone || "-"}</td>
                      <td className="py-4">{customer.totalOrders}</td>
                      <td className="py-4">{customer.completedOrders}</td>
                      <td className="py-4 font-bold text-primary">{formatPrice(customer.totalRevenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </Container>
      </main>
      <Footer />
    </div>
  );
}

export default function AdminPage() {
  return (
    <ProtectedRoute adminOnly>
      <AdminContent />
    </ProtectedRoute>
  );
}
