"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import ProductForm from "@/components/ProductForm";
import ProtectedRoute from "@/components/ProtectedRoute";
import { productService } from "@/services/productService";
import {
  orderService,
  type CustomerStats,
  type DashboardStats,
} from "@/services/orderService";
import type { Order, OrderStatus } from "@/types/order";
import type { Product } from "@/types/product";
import { getCategoryLabel } from "@/utils/catalog";
import { formatPrice } from "@/utils/format";

function AdminContent() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<CustomerStats[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    const [dashboardResponse, productResponse, orderResponse, customerResponse] =
      await Promise.all([
        orderService.dashboard(),
        productService.getAll(),
        orderService.adminOrders(),
        orderService.adminCustomers(),
      ]);

    setStats(dashboardResponse.data);
    setProducts(productResponse.data);
    setOrders(orderResponse.data);
    setCustomers(customerResponse.data);
  };

  useEffect(() => {
    void load();
  }, []);

  const handleStatus = async (id: string, status: OrderStatus) => {
    await orderService.updateStatus(id, status);
    await load();
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-10">
        <Container>
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900">Quản trị cửa hàng</h1>
            <p className="mt-2 text-slate-600">Quản lý sản phẩm, đơn hàng, khách hàng và doanh thu.</p>
          </div>

          {stats && (
            <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                ["Người dùng", stats.totalUsers],
                ["Sản phẩm", stats.totalProducts],
                ["Đơn hàng", stats.totalOrders],
                ["Doanh thu", formatPrice(stats.totalRevenue)],
              ].map(([label, value]) => (
                <div key={String(label)} className="rounded-lg border border-slate-100 bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">{label}</p>
                  <p className="mt-2 text-2xl font-black text-slate-900">{value}</p>
                </div>
              ))}
            </div>
          )}

          <section className="mb-8 rounded-lg border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-black text-slate-900">Sản phẩm</h2>
              <button
                className="rounded-lg bg-primary px-4 py-2 font-bold text-white"
                onClick={() => {
                  setEditing(null);
                  setShowForm(true);
                }}
              >
                Thêm sản phẩm
              </button>
            </div>
            {showForm && (
              <div className="mb-6">
                <ProductForm
                  initial={editing || undefined}
                  onSubmit={async (data) => {
                    if (editing) {
                      await productService.adminUpdate(editing.id, data);
                    } else {
                      await productService.adminCreate(data);
                    }
                    setShowForm(false);
                    setEditing(null);
                    await load();
                  }}
                  onCancel={() => {
                    setShowForm(false);
                    setEditing(null);
                  }}
                />
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-500">
                    <th className="py-3">Sản phẩm</th>
                    <th className="py-3">Danh mục</th>
                    <th className="py-3">Giá</th>
                    <th className="py-3">Tồn kho</th>
                    <th className="py-3">Ảnh</th>
                    <th className="py-3">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-slate-50">
                      <td className="py-4 font-semibold text-slate-900">{product.name}</td>
                      <td className="py-4">{getCategoryLabel(product.category)}</td>
                      <td className="py-4">{formatPrice(product.price)}</td>
                      <td className="py-4">{product.stock}</td>
                      <td className="py-4">
                        <div className="flex -space-x-2">
                          {(product.imageUrls?.length ? product.imageUrls : product.imageUrl ? [product.imageUrl] : [])
                            .slice(0, 3)
                            .map((image) => (
                              <img key={image} src={image} alt={product.name} className="h-9 w-9 rounded-full border-2 border-white object-cover" />
                            ))}
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex gap-3">
                          <button
                            className="font-semibold text-primary"
                            onClick={() => {
                              setEditing(product);
                              setShowForm(true);
                            }}
                          >
                            Sửa
                          </button>
                          <button
                            className="font-semibold text-red-600"
                            onClick={async () => {
                              await productService.adminDelete(product.id);
                              await load();
                            }}
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-8 rounded-lg border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-black text-slate-900">Khách hàng và doanh thu</h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[840px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-500">
                    <th className="py-3">Khách hàng</th>
                    <th className="py-3">Email</th>
                    <th className="py-3">SĐT</th>
                    <th className="py-3">Số đơn</th>
                    <th className="py-3">Đã hoàn tất</th>
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

          <section className="rounded-lg border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-black text-slate-900">Đơn hàng</h2>
            <div className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3"
                >
                  <span className="font-mono text-sm text-slate-500">#{order.id.slice(-8)}</span>
                  <span className="font-semibold text-slate-700">{formatPrice(order.totalAmount)}</span>
                  <span className="text-sm text-slate-500">{order.shippingAddress}</span>
                  <select
                    className="ml-auto rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                    value={order.status}
                    onChange={(event) => handleStatus(order.id, event.target.value as OrderStatus)}
                  >
                    {["PENDING", "CONFIRMED", "SHIPPING", "COMPLETED", "CANCELLED"].map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
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
