import api from "./api";
import type { Product } from "@/types/product";

export const productService = {
  getAll: () => api.get<Product[]>("/products"),
  getById: (id: string) => api.get<Product>(`/products/${id}`),
  search: (keyword: string) =>
    api.get<Product[]>("/products/search", { params: { keyword } }),
  getByCategory: (category: string) =>
    api.get<Product[]>(`/products/category/${category}`),
  create: (data: Partial<Product>) => api.post<Product>("/products", data),
  update: (id: string, data: Partial<Product>) =>
    api.put<Product>(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
  adminCreate: (data: Partial<Product>) =>
    api.post<Product>("/admin/products", data),
  adminUpdate: (id: string, data: Partial<Product>) =>
    api.put<Product>(`/admin/products/${id}`, data),
  adminDelete: (id: string) => api.delete(`/admin/products/${id}`),
};
