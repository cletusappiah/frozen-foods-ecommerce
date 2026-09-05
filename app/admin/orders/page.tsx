import { createClient } from "@/lib/supabase/server";
import OrderStatusSelect from "@/components/OrderStatusSelect";

export default async function AdminOrdersPage() {
  const supabase = createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*), addresses(full_address, phone)")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display mb-6 text-2xl font-semibold text-navy">Orders</h1>
      <div className="space-y-4">
        {orders?.map((order: any) => (
          <div key={order.id} className="rounded-2xl border border-navy/10 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-sm text-navy/50">#{order.id.slice(0, 8)}</span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  order.payment_status === "paid" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                }`}
              >
                {order.payment_status}
              </span>
              <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
            </div>
            <p className="mt-2 text-sm text-navy/60">
              {order.addresses?.full_address} · {order.addresses?.phone}
            </p>
            <ul className="mt-2 space-y-1 text-sm text-navy">
              {order.order_items.map((item: any) => (
                <li key={item.id}>
                  {item.qty} x {item.product_name}
                </li>
              ))}
            </ul>
            <div className="mt-2 text-right font-display font-semibold text-navy">GHS {order.total.toFixed(2)}</div>
          </div>
        ))}
        {(!orders || orders.length === 0) && <p className="text-sm text-navy/50">No orders yet.</p>}
      </div>
    </div>
  );
}
