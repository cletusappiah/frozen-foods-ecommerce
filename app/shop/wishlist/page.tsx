"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useWishlistStore } from "@/lib/wishlistStore";
import { createClient } from "@/lib/supabase/client";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types";

export default function WishlistPage() {
  const ids = useWishlistStore((s) => s.ids);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (ids.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }
      const supabase = createClient();
      const { data } = await supabase.from("products").select("*").in("id", ids);
      setProducts(data || []);
      setLoading(false);
    }
    load();
  }, [ids]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display mb-6 text-2xl font-semibold text-navy">My Wishlist</h1>
      {loading ? (
        <p className="text-sm text-navy/50">Loading...</p>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-navy/15 bg-white py-16 text-center">
          <p className="text-slate-body">Nothing saved yet.</p>
          <Link href="/shop" className="mt-2 inline-block text-sm text-frost underline">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
