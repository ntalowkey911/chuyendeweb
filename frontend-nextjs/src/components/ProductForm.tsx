"use client";

import { useState } from "react";
import type { Product } from "@/types/product";
import { PRODUCT_CATEGORIES } from "@/utils/catalog";

interface Props {
  initial?: Partial<Product>;
  onSubmit: (data: Partial<Product>) => Promise<void>;
  onCancel?: () => void;
}

const MAX_IMAGE_SIZE = 640;

export default function ProductForm({ initial, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState({
    name: initial?.name || "",
    description: initial?.description || "",
    price: initial?.price?.toString() || "",
    imageUrl: initial?.imageUrl || "",
    imageUrls: initial?.imageUrls || [],
    category: initial?.category || PRODUCT_CATEGORIES[0].value,
    brand: initial?.brand || "",
    stock: initial?.stock?.toString() || "0",
    status: initial?.status || ("ACTIVE" as Product["status"]),
  });
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const imageUrls = form.imageUrls.length
        ? form.imageUrls
        : form.imageUrl
          ? [form.imageUrl]
          : [];

      await onSubmit({
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        imageUrl: imageUrls[0],
        imageUrls,
        category: form.category,
        brand: form.brand.trim(),
        stock: Number(form.stock),
        status: form.status as Product["status"],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setImageLoading(true);
    try {
      const images = await Promise.all(
        Array.from(files).map((file) => resizeImage(file))
      );
      setForm((current) => ({
        ...current,
        imageUrl: images[0] || current.imageUrl,
        imageUrls: [...current.imageUrls, ...images],
      }));
    } finally {
      setImageLoading(false);
    }
  };

  const removeImage = (image: string) => {
    setForm((current) => {
      const imageUrls = current.imageUrls.filter((item) => item !== image);
      return {
        ...current,
        imageUrls,
        imageUrl: imageUrls[0] || "",
      };
    });
  };

  const field = (label: string, key: keyof typeof form, type = "text") => (
    <label className="block text-sm">
      <span className="mb-1 block font-medium">{label}</span>
      <input
        type={type}
        className="w-full rounded border border-slate-300 px-3 py-2"
        value={String(form[key])}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        required={key === "name" || key === "price" || key === "category"}
      />
    </label>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded border bg-white p-4">
      {field("Tên", "name")}
      <label className="block text-sm">
        <span className="mb-1 block font-medium">Mô tả</span>
        <textarea
          className="min-h-24 w-full rounded border border-slate-300 px-3 py-2"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </label>
      <div className="grid gap-3 md:grid-cols-2">
        {field("Giá", "price", "number")}
        {field("Tồn kho", "stock", "number")}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Danh mục</span>
          <select
            className="w-full rounded border border-slate-300 px-3 py-2"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
          >
            {PRODUCT_CATEGORIES.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </label>
        {field("Thương hiệu", "brand")}
      </div>
      <label className="block text-sm">
        <span className="mb-1 block font-medium">Thêm ảnh từ máy</span>
        <input
          type="file"
          accept="image/*"
          multiple
          className="w-full rounded border border-dashed border-slate-300 px-3 py-3"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <span className="mt-1 block text-xs text-slate-500">
          Ảnh sẽ được tự nén về tối đa {MAX_IMAGE_SIZE}px để tải nhẹ hơn.
        </span>
      </label>
      {imageLoading && <p className="text-sm text-slate-500">Đang xử lý ảnh...</p>}
      {form.imageUrls.length > 0 && (
        <div className="grid grid-cols-3 gap-3 md:grid-cols-5">
          {form.imageUrls.map((image) => (
            <div key={image} className="relative overflow-hidden rounded border">
              <img src={image} alt="Ảnh sản phẩm" className="aspect-square w-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(image)}
                className="absolute right-1 top-1 rounded bg-white/90 px-2 py-0.5 text-xs font-bold text-red-600"
              >
                Xóa
              </button>
            </div>
          ))}
        </div>
      )}
      <label className="block text-sm">
        <span className="mb-1 block font-medium">Trạng thái</span>
        <select
          className="w-full rounded border px-3 py-2"
          value={form.status}
          onChange={(e) =>
            setForm({ ...form, status: e.target.value as Product["status"] })
          }
        >
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>
      </label>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading || imageLoading}
          className="rounded bg-primary px-4 py-2 font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Đang lưu..." : "Lưu"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="rounded border px-4 py-2">
            Hủy
          </button>
        )}
      </div>
    </form>
  );
}

function resizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const image = new Image();
      image.onerror = reject;
      image.onload = () => {
        const scale = Math.min(1, MAX_IMAGE_SIZE / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        const context = canvas.getContext("2d");
        if (!context) {
          reject(new Error("Không thể xử lý ảnh"));
          return;
        }
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.76));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}
