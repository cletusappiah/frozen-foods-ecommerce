import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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
      <h1 className="mb-6 text-2xl font-bold">My Orders</h1>
      {orders?.length === 0 && <p className="text-slate-500">No orders yet.</p>}
      <div className="space-y-4">
        {orders?.map((order) => (
          <div key={order.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm text-slate-500">#{order.id.slice(0, 8)}</span>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                {STATUS_LABEL[order.status]}
              </span>
            </div>
            <ul className="mt-3 space-y-1 text-sm">
              {order.order_items.map((item: any) => (
                <li key={item.id}>
                  {item.qty} x {item.product_name} — GHS {(item.unit_price * item.qty).toFixed(2)}
                </li>
              ))}
            </ul>
            <div className="mt-3 flex justify-between border-t border-slate-100 pt-2 font-bold">
              <span>Total</span>
              <span>GHS {order.total.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
