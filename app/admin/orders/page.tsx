import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import OrderStatusSelect from "@/components/OrderStatusSelect";

export default async function AdminOrdersPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin/orders");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/");

  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*), addresses(full_address, phone)")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Manage Orders</h1>
      <div className="space-y-4">
        {orders?.map((order: any) => (
          <div key={order.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-sm text-slate-500">#{order.id.slice(0, 8)}</span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  order.payment_status === "paid" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                }`}
              >
                {order.payment_status}
              </span>
              <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
            </div>
            <p className="mt-2 text-sm text-slate-600">
              {order.addresses?.full_address} · {order.addresses?.phone}
            </p>
            <ul className="mt-2 space-y-1 text-sm">
              {order.order_items.map((item: any) => (
                <li key={item.id}>
                  {item.qty} x {item.product_name}
                </li>
              ))}
            </ul>
            <div className="mt-2 text-right font-bold">GHS {order.total.toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
