"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/lib/cartStore";

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="font-display text-lg text-navy">Your cart is empty.</p>
        <p className="mt-1 text-sm text-slate-body">Add something fresh to get started.</p>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-full bg-coral px-6 py-2.5 font-semibold text-white transition hover:brightness-105"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="font-display mb-6 text-2xl font-semibold text-navy">Your Cart</h1>
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.product_id}
            className="flex items-center gap-3 rounded-2xl border border-navy/10 bg-white p-3"
          >
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-ice">
              {item.image_url && (
                <Image src={item.image_url} alt={item.name} fill className="object-cover" sizes="64px" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-navy">{item.name}</p>
              <p className="text-xs text-slate-body">{item.unit}</p>
              <p className="font-display font-semibold text-navy">GHS {item.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center rounded-full border border-navy/15">
              <button
                className="px-2.5 py-1 text-navy transition hover:bg-ice"
                onClick={() => updateQty(item.product_id, Math.max(1, item.qty - 1))}
              >
                -
              </button>
              <span className="w-6 text-center text-sm font-medium text-navy">{item.qty}</span>
              <button
                className="px-2.5 py-1 text-navy transition hover:bg-ice"
                onClick={() => updateQty(item.product_id, item.qty + 1)}
              >
                +
              </button>
            </div>
            <button
              onClick={() => removeItem(item.product_id)}
              className="text-sm font-medium text-coral hover:brightness-110"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between rounded-2xl border border-navy/10 bg-white p-4">
        <span className="font-display text-lg font-semibold text-navy">Subtotal</span>
        <span className="font-display text-lg font-semibold text-navy">
          GHS {subtotal().toFixed(2)}
        </span>
      </div>

      <Link
        href="/shop/checkout"
        className="mt-6 block rounded-full bg-coral py-3 text-center font-semibold text-white transition hover:brightness-105"
      >
        Proceed to checkout
      </Link>
    </div>
  );
}