import React from "react";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category"; // Ensure Category is registered for populate
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  limit?: number;
  categorySlug?: string;
  priceFilter?: string;
  sortBy?: string;
}

export async function ProductGrid({ limit, categorySlug, priceFilter, sortBy }: ProductGridProps) {
  await connectToDatabase();
  
  let query: any = { isAvailable: true };
  
  // 1. Lọc theo danh mục
  if (categorySlug) {
    const category = await Category.findOne({ slug: categorySlug });
    if (category) {
      query.category = category._id;
    }
  }

  // 2. Lọc theo giá
  if (priceFilter === 'under50') {
    query.$or = [{ price: { $lt: 50000 } }, { discountPrice: { $lt: 50000, $ne: null } }];
  } else if (priceFilter === '50to100') {
    query.$or = [
      { price: { $gte: 50000, $lte: 100000 }, discountPrice: null },
      { discountPrice: { $gte: 50000, $lte: 100000 } }
    ];
  } else if (priceFilter === 'above100') {
    query.$or = [{ price: { $gt: 100000 } }, { discountPrice: { $gt: 100000 } }];
  }
  
  // 3. Khởi tạo query database
  let dbQuery = Product.find(query).populate({ path: 'category', model: Category });

  // 4. Sắp xếp (Sort)
  if (sortBy === 'bestseller') {
    // Sắp xếp theo đánh giá cao nhất (giả lập bán chạy nhất)
    dbQuery = dbQuery.sort({ rating: -1, createdAt: -1 });
  } else {
    // Mặc định mới nhất
    dbQuery = dbQuery.sort({ createdAt: -1 });
  }
    
  if (limit) {
    dbQuery = dbQuery.limit(limit);
  }

  // Parse JSON objects to pass safely to Client Component
  const products = await dbQuery.lean();
  const serializedProducts = JSON.parse(JSON.stringify(products));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {serializedProducts.map((product: any) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
