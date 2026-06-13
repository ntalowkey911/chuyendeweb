"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import type { Product } from "@/types/product";
import { Button } from "./ui/button";

interface CustomComboBuilderProps {
  products: Product[];
}

const STEPS = [
  { id: "main", title: "1. Món chính", category: "mon-chinh", description: "Bắt đầu với một món chính thật ngon" },
  { id: "side", title: "2. Món ăn kèm", category: "mon-an-kem", description: "Thêm chút khoai tây hoặc gà rán" },
  { id: "drink", title: "3. Đồ uống", category: "do-uong", description: "Giải khát cực đã" },
];

export function CustomComboBuilder({ products }: CustomComboBuilderProps) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const addToCart = useCartStore((state) => state.addToCart);

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: Product | null }>({
    main: null,
    side: null,
    drink: null,
  });
  const [adding, setAdding] = useState(false);

  const handleSelect = (product: Product) => {
    const stepId = STEPS[currentStep].id;
    setSelectedItems((prev) => ({ ...prev, [stepId]: product }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    const itemsToAdd = Object.values(selectedItems).filter(Boolean) as Product[];
    if (itemsToAdd.length === 0) return;

    try {
      setAdding(true);
      // Add each item to the cart sequentially
      for (const item of itemsToAdd) {
        await addToCart(item.id, 1);
      }
      router.push("/cart");
    } catch (e) {
      console.error("Lỗi khi thêm combo", e);
      alert("Đã xảy ra lỗi khi thêm combo vào giỏ hàng");
      setAdding(false);
    }
  };

  const currentStepData = STEPS[currentStep];
  const stepProducts = products.filter(
    (p) => p.category?.toLowerCase() === currentStepData.category.toLowerCase() && p.stock > 0
  );

  const totalPrice = Object.values(selectedItems)
    .filter(Boolean)
    .reduce((sum, item) => sum + item!.price, 0);

  const totalItems = Object.values(selectedItems).filter(Boolean).length;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="flex flex-col gap-6">
        {/* Progress Bar */}
        <div className="flex items-center justify-between gap-2">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex-1">
              <div
                className={`h-2 w-full rounded-full ${
                  index <= currentStep ? "bg-primary" : "bg-slate-200"
                }`}
              />
              <p
                className={`mt-2 text-xs font-bold sm:text-sm ${
                  index <= currentStep ? "text-primary" : "text-slate-500"
                }`}
              >
                {step.title}
              </p>
            </div>
          ))}
        </div>

        {/* Product Selection */}
        <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-slate-900">{currentStepData.title}</h2>
            <p className="mt-1 text-sm text-slate-500">{currentStepData.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {stepProducts.map((product) => {
              const isSelected = selectedItems[currentStepData.id]?.id === product.id;
              const displayImage = product.imageUrls?.[0] || product.imageUrl || "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=640&q=70";

              return (
                <div
                  key={product.id}
                  onClick={() => handleSelect(product)}
                  className={`cursor-pointer overflow-hidden rounded-[1.5rem] border-2 transition-all ${
                    isSelected
                      ? "border-primary bg-emerald-50/50 shadow-md ring-4 ring-primary/10"
                      : "border-transparent bg-slate-50 hover:border-primary/30"
                  }`}
                >
                  <div className="aspect-square w-full overflow-hidden">
                    <img
                      src={displayImage}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-3 text-center">
                    <h3 className="line-clamp-2 text-sm font-bold text-slate-900">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-sm font-black text-primary">
                      {product.price.toLocaleString("vi-VN")}đ
                    </p>
                  </div>
                </div>
              );
            })}
            
            {stepProducts.length === 0 && (
              <div className="col-span-full py-10 text-center text-slate-500">
                Không tìm thấy sản phẩm nào trong danh mục này.
              </div>
            )}
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="rounded-full font-bold"
            >
              Quay lại
            </Button>
            
            {currentStep < STEPS.length - 1 ? (
              <Button
                onClick={handleNext}
                className="rounded-full bg-slate-900 px-8 font-bold text-white hover:bg-slate-800"
              >
                Tiếp tục
              </Button>
            ) : (
              <Button
                onClick={handleAddToCart}
                disabled={adding || totalItems === 0}
                className="rounded-full bg-primary px-8 font-bold text-white shadow-[0_8px_20px_rgba(47,125,50,0.25)] hover:bg-primary/90"
              >
                {adding ? "Đang thêm..." : "Thêm vào giỏ"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Summary Sidebar */}
      <div className="h-fit rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
        <h3 className="mb-5 text-lg font-black text-slate-900">Combo của bạn</h3>
        
        <div className="flex flex-col gap-4">
          {STEPS.map((step) => {
            const item = selectedItems[step.id];
            return (
              <div key={step.id} className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-50 overflow-hidden">
                  {item ? (
                    <img 
                      src={item.imageUrls?.[0] || item.imageUrl || ""} 
                      alt={item.name} 
                      className="h-full w-full object-cover" 
                    />
                  ) : (
                    <span className="text-xs font-bold text-slate-300">Trống</span>
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {step.title.replace(/^\d+\.\s*/, '')}
                  </p>
                  <p className="truncate text-sm font-bold text-slate-900">
                    {item ? item.name : "Chưa chọn"}
                  </p>
                </div>
                {item && (
                  <div className="text-right">
                    <p className="text-sm font-black text-primary">
                      {item.price.toLocaleString("vi-VN")}đ
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 border-t border-slate-100 pt-6">
          <div className="flex items-end justify-between">
            <span className="font-bold text-slate-600">Tổng cộng:</span>
            <span className="text-2xl font-black text-primary">
              {totalPrice.toLocaleString("vi-VN")}đ
            </span>
          </div>
          <p className="mt-2 text-right text-xs text-slate-500">
            {totalItems > 0 ? `Đã chọn ${totalItems} món` : "Hãy chọn ít nhất 1 món"}
          </p>
        </div>
      </div>
    </div>
  );
}
