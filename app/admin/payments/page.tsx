import { createClient } from "@/lib/supabase/server";

export default async function AdminPaymentsPage() {
  const supabase = createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("id, total, payment_status, payment_reference, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display mb-6 text-2xl font-semibold text-navy">Payments</h1>
      <div className="overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-navy/5 text-left text-navy/70">
            <tr>
              <th className="p-3">Order</th>
              <th className="p-3">Reference</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
              <th className="p-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((o) => (
              <tr key={o.id} className="border-t border-navy/5">
                <td className="p-3 font-mono text-navy/70">#{o.id.slice(0, 8)}</td>
                <td className="p-3 font-mono text-xs text-navy/60">{o.payment_reference || "-"}</td>
                <td className="p-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      o.payment_status === "paid" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {o.payment_status}
                  </span>
                </td>
                <td className="p-3 text-navy/60">{new Date(o.created_at).toLocaleDateString()}</td>
                <td className="p-3 text-right font-medium text-navy">GHS {Number(o.total).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!orders || orders.length === 0) && <p className="p-4 text-sm text-navy/50">No transactions yet.</p>}
      </div>
    </div>
  );
}
