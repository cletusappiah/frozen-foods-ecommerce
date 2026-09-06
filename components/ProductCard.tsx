"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/lib/cartStore";
import { useToastStore } from "@/lib/toastStore";
import WishlistButton from "@/components/WishlistButton";
import type { Product } from "@/types";

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const showToast = useToastStore((s) => s.showToast);
  const image = product.image_urls?.[0] || "/placeholder-food.svg";
  const outOfStock = product.stock_qty <= 0;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-navy/5">
      <WishlistButton productId={product.id} />
      <Link
        href={`/shop/products/${product.id}`}
        className="relative aspect-square overflow-hidden bg-ice"
      >
        <Image
          src={image}
          alt={product.name}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="240px"
        />
        {outOfStock && (
          <span className="absolute left-2 top-2 rounded-full bg-navy/80 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
            Out of stock
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-3.5">
        <Link
          href={`/shop/products/${product.id}`}
          className="font-display font-semibold leading-tight text-navy line-clamp-1"
        >
          {product.name}
        </Link>
        <span className="text-xs text-slate-body">{product.unit}</span>
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="font-display text-lg font-semibold text-navy">
            GHS {product.price.toFixed(2)}
          </span>
          <button
            onClick={() => {
              addItem({
                product_id: product.id,
                name: product.name,
                price: product.price,
                qty: 1,
                image_url: image,
                unit: product.unit,
              });
              showToast(`${product.name} added to cart`);
            }}
            disabled={outOfStock}
            className="shrink-0 rounded-full bg-coral px-4 py-1.5 text-sm font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:bg-slate-body/20 disabled:text-slate-body"
          >
            {outOfStock ? "Sold out" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
