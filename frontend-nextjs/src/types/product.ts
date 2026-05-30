export type ProductStatus = "ACTIVE" | "INACTIVE";

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  imageUrls?: string[];
  category: string;
  categoryName?: string;
  brand?: string;
  stock: number;
  soldCount?: number;
  status: ProductStatus;
  createdAt?: string;
  updatedAt?: string;
}
