import { createClient } from "@/lib/supabase/server";

export default async function AdminCustomersPage() {
  const supabase = createClient();
  const { data: customers } = await supabase
    .from("profiles")
    .select("id, full_name, phone, role, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display mb-6 text-2xl font-semibold text-navy">Customers</h1>
      <div className="overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-navy/5 text-left text-navy/70">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Role</th>
              <th className="p-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {customers?.map((c) => (
              <tr key={c.id} className="border-t border-navy/5">
                <td className="p-3 font-medium text-navy">{c.full_name || "-"}</td>
                <td className="p-3">{c.phone || "-"}</td>
                <td className="p-3 capitalize">{c.role}</td>
                <td className="p-3 text-navy/60">{new Date(c.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!customers || customers.length === 0) && (
          <p className="p-4 text-sm text-navy/50">No customers yet.</p>
        )}
      </div>
    </div>
  );
}
