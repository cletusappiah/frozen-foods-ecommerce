"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/cartStore";

export default function Navbar() {
  const items = useCartStore((s) => s.items);
  const count = items.reduce((n, i) => n + i.qty, 0);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold text-blue-700">
          Port-Fresh
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link href="/shop">Shop</Link>
          <Link href="/shop/account/orders">My Orders</Link>
          <Link href="/shop/cart" className="relative">
            Cart
            {count > 0 && (
              <span className="absolute -right-3 -top-2 rounded-full bg-blue-600 px-1.5 text-xs text-white">
                {count}
              </span>
            )}
          </Link>
          <Link href="/login" className="rounded-full bg-blue-600 px-3 py-1.5 text-white">
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
