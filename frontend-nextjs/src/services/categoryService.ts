import api from "./api";
import type { Category } from "@/types/category";

export const categoryService = {
  getAll: () => api.get<Category[]>("/categories"),
  adminGetAll: () => api.get<Category[]>("/admin/categories"),
  create: (data: { name: string; description?: string }) =>
    api.post<Category>("/admin/categories", data),
  update: (id: string, data: { name: string; description?: string }) =>
    api.put<Category>(`/admin/categories/${id}`, data),
  delete: (id: string) => api.delete(`/admin/categories/${id}`),
};
