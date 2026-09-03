"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/cartStore";
import type { Product } from "@/types";

export default function AddToCartButton({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const image = product.image_urls?.[0] || "/placeholder-food.png";

  return (
    <div className="mt-6 flex items-center gap-3">
      <div className="flex items-center rounded-full border border-slate-300">
        <button className="px-3 py-1" onClick={() => setQty((q) => Math.max(1, q - 1))}>
          -
        </button>
        <span className="w-8 text-center">{qty}</span>
        <button className="px-3 py-1" onClick={() => setQty((q) => q + 1)}>
          +
        </button>
      </div>
      <button
        disabled={product.stock_qty <= 0}
        onClick={() =>
          addItem({
            product_id: product.id,
            name: product.name,
            price: product.price,
            qty,
            image_url: image,
            unit: product.unit,
          })
        }
        className="flex-1 rounded-full bg-blue-600 py-3 font-semibold text-white disabled:bg-slate-300"
      >
        Add to cart
      </button>
    </div>
  );
}
