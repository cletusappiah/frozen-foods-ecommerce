import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = createClient();

  const { count: productCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });
  const { count: pendingOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");
  const { count: totalOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true });
  const { data: revenueRows } = await supabase
    .from("orders")
    .select("total")
    .eq("payment_status", "paid");
  const revenue = (revenueRows || []).reduce((sum, o) => sum + Number(o.total), 0);

  const { data: recentOrders } = await supabase
    .from("orders")
    .select("id, total, status, payment_status, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-display mb-6 text-2xl font-semibold text-navy">Dashboard</h1>

      <div className="mb-8 grid gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-navy/10 bg-white p-5 shadow-sm">
          <p className="text-sm text-navy/60">Revenue (paid)</p>
          <p className="font-display mt-1 text-2xl font-semibold text-navy">GHS {revenue.toFixed(2)}</p>
        </div>
        <div className="rounded-2xl border border-navy/10 bg-white p-5 shadow-sm">
          <p className="text-sm text-navy/60">Total orders</p>
          <p className="font-display mt-1 text-2xl font-semibold text-navy">{totalOrders ?? 0}</p>
        </div>
        <div className="rounded-2xl border border-navy/10 bg-white p-5 shadow-sm">
          <p className="text-sm text-navy/60">Pending orders</p>
          <p className="font-display mt-1 text-2xl font-semibold text-coral">{pendingOrders ?? 0}</p>
        </div>
        <div className="rounded-2xl border border-navy/10 bg-white p-5 shadow-sm">
          <p className="text-sm text-navy/60">Products</p>
          <p className="font-display mt-1 text-2xl font-semibold text-navy">{productCount ?? 0}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-navy/10 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-navy">Recent orders</h2>
          <Link href="/admin/orders" className="text-sm font-medium text-frost hover:underline">
            View all
          </Link>
        </div>
        {recentOrders && recentOrders.length > 0 ? (
          <table className="w-full text-sm">
            <thead className="text-left text-navy/50">
              <tr>
                <th className="pb-2">Order</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Payment</th>
                <th className="pb-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id} className="border-t border-navy/5">
                  <td className="py-2 font-mono text-navy/70">#{o.id.slice(0, 8)}</td>
                  <td className="py-2 capitalize text-navy">{o.status.replace(/_/g, " ")}</td>
                  <td className="py-2 capitalize text-navy">{o.payment_status}</td>
                  <td className="py-2 text-right font-medium text-navy">GHS {Number(o.total).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-sm text-navy/50">No orders yet.</p>
        )}
      </div>
    </div>
  );
}
