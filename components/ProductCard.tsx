"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/lib/cartStore";
import type { Product } from "@/types";

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const image = product.image_urls?.[0] || "/placeholder-food.svg";

  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <Link href={`/shop/products/${product.id}`} className="relative mb-2 aspect-square overflow-hidden rounded-lg bg-slate-100">
        <Image src={image} alt={product.name} fill className="object-cover" sizes="200px" />
      </Link>
      <Link href={`/shop/products/${product.id}`} className="font-semibold leading-tight">
        {product.name}
      </Link>
      <span className="text-xs text-slate-500">{product.unit}</span>
      <div className="mt-2 flex items-center justify-between">
        <span className="font-bold text-blue-700">GHS {product.price.toFixed(2)}</span>
        <button
          onClick={() =>
            addItem({
              product_id: product.id,
              name: product.name,
              price: product.price,
              qty: 1,
              image_url: image,
              unit: product.unit,
            })
          }
          disabled={product.stock_qty <= 0}
          className="rounded-full bg-blue-600 px-3 py-1 text-sm font-medium text-white disabled:bg-slate-300"
        >
          {product.stock_qty > 0 ? "Add" : "Out of stock"}
        </button>
      </div>
    </div>
  );
}
