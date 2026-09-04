import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") redirect("/");

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/orders"
          className="rounded-xl border border-slate-200 bg-white p-6 text-center font-semibold shadow-sm hover:bg-slate-50"
        >
          Manage Orders
        </Link>
        <Link
          href="/admin/products"
          className="rounded-xl border border-slate-200 bg-white p-6 text-center font-semibold shadow-sm hover:bg-slate-50"
        >
          Manage Products
        </Link>
      </div>
    </div>
  );
}