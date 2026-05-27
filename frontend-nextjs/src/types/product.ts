export type ProductStatus = "ACTIVE" | "INACTIVE";

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  imageUrls?: string[];
  category: string;
  brand?: string;
  stock: number;
  status: ProductStatus;
  createdAt?: string;
  updatedAt?: string;
}
