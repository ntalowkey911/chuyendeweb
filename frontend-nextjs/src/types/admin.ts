import type { Category } from "./category";
import type { Product } from "./product";
import type { CustomerStats, DashboardStats } from "@/services/orderService";

export interface AdminOverview {
  stats: DashboardStats;
  products: Product[];
  customers: CustomerStats[];
  categories: Category[];
}
