"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/cartStore";
import type { Product } from "@/types";

export default function AddToCartButton({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const image = product.image_urls?.[0] || "/placeholder-food.svg";
  const outOfStock = product.stock_qty <= 0;

  return (
    <div className="mt-6 flex items-center gap-3">
      <div className="flex items-center rounded-full border border-navy/15">
        <button
          className="px-3 py-2 text-navy transition hover:bg-ice"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
        >
          -
        </button>
        <span className="w-8 text-center font-medium text-navy">{qty}</span>
        <button
          className="px-3 py-2 text-navy transition hover:bg-ice"
          onClick={() => setQty((q) => Math.min(product.stock_qty, q + 1))}
        >
          +
        </button>
      </div>
      <button
        disabled={outOfStock}
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
        className="flex-1 rounded-full bg-coral py-3 font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:bg-slate-body/20 disabled:text-slate-body"
      >
        {outOfStock ? "Out of stock" : "Add to cart"}
      </button>
    </div>
  );
}