"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/lib/cartStore";

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-slate-600">Your cart is empty.</p>
        <Link href="/shop" className="mt-4 inline-block text-blue-700 underline">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Your Cart</h1>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.product_id} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
            <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-slate-100">
              {item.image_url && (
                <Image src={item.image_url} alt={item.name} fill className="object-cover" sizes="64px" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-xs text-slate-500">{item.unit}</p>
              <p className="font-bold text-blue-700">GHS {item.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center rounded-full border border-slate-300">
              <button className="px-2" onClick={() => updateQty(item.product_id, Math.max(1, item.qty - 1))}>
                -
              </button>
              <span className="w-6 text-center">{item.qty}</span>
              <button className="px-2" onClick={() => updateQty(item.product_id, item.qty + 1)}>
                +
              </button>
            </div>
            <button onClick={() => removeItem(item.product_id)} className="text-sm text-red-500">
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4">
        <span className="text-lg font-semibold">Subtotal</span>
        <span className="text-lg font-bold text-blue-700">GHS {subtotal().toFixed(2)}</span>
      </div>

      <Link
        href="/shop/checkout"
        className="mt-6 block rounded-full bg-blue-600 py-3 text-center font-semibold text-white"
      >
        Proceed to checkout
      </Link>
    </div>
  );
}
