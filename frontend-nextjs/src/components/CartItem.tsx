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
    <div className="flex gap-4 rounded border bg-white p-4">
      <div className="relative h-20 w-20 shrink-0">
        <Image
          src={item.imageUrl || "https://placehold.co/80"}
          alt={item.productName}
          fill
          className="rounded object-cover"
          unoptimized
        />
      </div>
      <div className="flex flex-1 flex-col">
        <h3 className="font-medium">{item.productName}</h3>
        <p className="text-indigo-600">{formatPrice(item.price)}</p>
        <div className="mt-2 flex items-center gap-2">
          <button
            className="rounded border px-2"
            onClick={() => onUpdate(Math.max(1, item.quantity - 1))}
          >
            -
          </button>
          <span>{item.quantity}</span>
          <button
            className="rounded border px-2"
            onClick={() => onUpdate(item.quantity + 1)}
          >
            +
          </button>
          <button
            className="ml-auto text-sm text-red-600"
            onClick={onRemove}
          >
            Xóa
          </button>
        </div>
      </div>
      <p className="font-semibold">
        {formatPrice(item.price * item.quantity)}
      </p>
    </div>
  );
}
