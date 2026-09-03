import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminProductsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin/products");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/");

  const { data: products } = await supabase.from("products").select("*").order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Products</h1>
        <Link href="/admin/products/new" className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
          + New product
        </Link>
      </div>
      <table className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white text-sm">
        <thead className="bg-slate-100 text-left">
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
            <tr key={p.id} className="border-t border-slate-100">
              <td className="p-3">{p.name}</td>
              <td className="p-3">GHS {p.price.toFixed(2)}</td>
              <td className="p-3">{p.stock_qty}</td>
              <td className="p-3">{p.is_active ? "Yes" : "No"}</td>
              <td className="p-3">
                <Link href={`/admin/products/${p.id}`} className="text-blue-700 underline">
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
