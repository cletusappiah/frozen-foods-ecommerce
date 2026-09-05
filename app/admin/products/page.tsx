import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminProductsPage() {
  const supabase = createClient();
  const { data: products } = await supabase.from("products").select("*").order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-navy">Products</h1>
        <Link href="/admin/products/new" className="rounded-full bg-coral px-4 py-2 text-sm font-semibold text-white transition hover:brightness-105">
          + New product
        </Link>
      </div>
      <div className="overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-navy/5 text-left text-navy/70">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Active</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {products?.map((p) => (
              <tr key={p.id} className="border-t border-navy/5">
                <td className="p-3 font-medium text-navy">{p.name}</td>
                <td className="p-3">GHS {p.price.toFixed(2)}</td>
                <td className="p-3">
                  <span className={p.stock_qty <= 5 ? "font-semibold text-coral" : ""}>{p.stock_qty}</span>
                  {p.stock_qty <= 5 && <span className="ml-1 text-xs text-coral">(low)</span>}
                </td>
                <td className="p-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${p.is_active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                    {p.is_active ? "Yes" : "No"}
                  </span>
                </td>
                <td className="p-3">
                  <Link href={`/admin/products/${p.id}`} className="font-medium text-frost hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
