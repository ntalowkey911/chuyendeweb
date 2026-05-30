import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

const API_BASE_URL =
  process.env.INTERNAL_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://127.0.0.1:8080/api";

type ProductQuery = {
  activeOnly?: boolean;
  category?: string;
  keyword?: string;
  price?: string;
  sort?: string;
  limit?: number;
};

async function fetchStorefront<T>(
  path: string,
  query?: Record<string, string | number | boolean | undefined>,
  revalidate = 60
): Promise<T> {
  const params = new URLSearchParams();

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== "") {
        params.set(key, String(value));
      }
    }
  }

  const endpoint = `${API_BASE_URL}${path}${params.toString() ? `?${params.toString()}` : ""}`;
  const response = await fetch(endpoint, {
    next: { revalidate },
  });

  if (!response.ok) {
    console.warn(`[Storefront] Request failed: ${response.status} for ${endpoint}`);
    // Prevent Vercel build from crashing if the backend is down or returns 401/500
    if (path.startsWith("/products") && !path.includes("/", 10)) {
      return [] as unknown as T;
    }
    if (path.startsWith("/categories")) {
      return [] as unknown as T;
    }
    return null as unknown as T;
  }

  return response.json() as Promise<T>;
}

export function getStorefrontProducts(query?: ProductQuery) {
  return fetchStorefront<Product[]>("/products", query, 45);
}

export function getStorefrontCategories() {
  return fetchStorefront<Category[]>("/categories", undefined, 300);
}

export function getStorefrontProduct(id: string) {
  return fetchStorefront<Product>(`/products/${id}`, undefined, 45);
}
