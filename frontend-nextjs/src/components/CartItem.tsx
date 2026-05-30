"use client";

import Image from "next/image";
import type { CartItem as CartItemType } from "@/types/cart";
import { formatPrice } from "@/utils/format";

interface Props {
  item: CartItemType;
  onUpdate: (qty: number) => void;
  onRemove: () => void;
}

export default function CartItem({ item, onUpdate, onRemove }: Props) {
  return (
    <div className="flex gap-4 rounded-[1.5rem] border border-slate-100 bg-white p-4 shadow-sm">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
        <Image
          src={item.imageUrl || "https://placehold.co/160"}
          alt={item.productName}
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      <div className="flex flex-1 flex-col">
        <h3 className="font-bold text-slate-900">{item.productName}</h3>
        <p className="text-primary">{formatPrice(item.price)}</p>
        <div className="mt-3 flex items-center gap-2">
          <button className="rounded-full border px-3 py-1" onClick={() => onUpdate(Math.max(1, item.quantity - 1))}>
            -
          </button>
          <span className="min-w-8 text-center font-bold">{item.quantity}</span>
          <button className="rounded-full border px-3 py-1" onClick={() => onUpdate(item.quantity + 1)}>
            +
          </button>
          <button className="ml-auto text-sm font-semibold text-red-600" onClick={onRemove}>
            Xóa
          </button>
        </div>
      </div>
      <p className="text-right font-semibold text-slate-900">
        {formatPrice(item.price * item.quantity)}
      </p>
    </div>
  );
}
