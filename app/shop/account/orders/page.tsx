import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-frost/15 text-frost",
  out_for_delivery: "bg-frost/15 text-frost",
  delivered: "bg-teal/10 text-teal",
  cancelled: "bg-coral/10 text-coral",
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending payment",
  confirmed: "Confirmed",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default async function OrdersPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/shop/account/orders");

  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="font-display mb-6 text-2xl font-semibold text-navy">My Orders</h1>

      {orders?.length === 0 && (
        <div className="rounded-2xl border border-dashed border-navy/15 bg-white py-16 text-center">
          <p className="text-slate-body">No orders yet.</p>
          <Link
            href="/shop"
            className="mt-4 inline-block rounded-full bg-coral px-6 py-2.5 font-semibold text-white transition hover:brightness-105"
          >
            Start shopping
          </Link>
        </div>
      )}

      <div className="space-y-4">
        {orders?.map((order) => (
          <div key={order.id} className="rounded-2xl border border-navy/10 bg-white p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm text-slate-body">#{order.id.slice(0, 8)}</span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  STATUS_STYLE[order.status] || "bg-navy/5 text-navy"
                }`}
              >
                {STATUS_LABEL[order.status] || order.status}
              </span>
            </div>
            <ul className="mt-3 space-y-1 text-sm text-slate-body">
              {order.order_items.map((item: any) => (
                <li key={item.id}>
                  {item.qty} x {item.product_name} — GHS {(item.unit_price * item.qty).toFixed(2)}
                </li>
              ))}
            </ul>
            <div className="mt-3 flex justify-between border-t border-navy/10 pt-3">
              <span className="font-display font-semibold text-navy">Total</span>
              <span className="font-display font-semibold text-navy">
                GHS {order.total.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}