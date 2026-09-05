import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/payments", label: "Payments" },
  { href: "/admin/content", label: "Content" },
  { href: "/admin/settings", label: "Settings" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin");

  const { data: profile } = await supabase.from("profiles").select("role, full_name").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/");

  return (
    <div className="flex min-h-screen bg-ice">
      <aside className="hidden w-56 flex-col border-r border-navy/10 bg-navy sm:flex">
        <div className="border-b border-white/10 px-5 py-5">
          <Link href="/" prefetch={false} className="font-display text-lg font-semibold text-white">
            Port-Fresh
          </Link>
          <p className="mt-0.5 text-xs text-white/50">Admin</p>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/10 px-5 py-4">
          <Link href="/shop" prefetch={false} className="text-xs font-medium text-white/60 hover:text-white">
            &larr; View store
          </Link>
        </div>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-navy/10 bg-white px-6 py-3 sm:hidden">
          <span className="font-display font-semibold text-navy">Port-Fresh Admin</span>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
