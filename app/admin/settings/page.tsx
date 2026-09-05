import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminSettingsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/admin/settings");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone, role")
    .eq("id", user.id)
    .single();

  async function handleLogout() {
    "use server";
    const supabase = createClient();
    await supabase.auth.signOut();
    redirect("/");
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display mb-6 text-2xl font-semibold text-navy">Settings</h1>

      <div className="mb-6 rounded-2xl border border-navy/10 bg-white p-5 shadow-sm">
        <h2 className="font-display mb-3 text-sm font-semibold text-navy/70">Your admin profile</h2>
        <p className="text-navy">{profile?.full_name || "No name set"}</p>
        <p className="text-sm text-navy/60">{profile?.phone || "No phone set"}</p>
        <p className="text-sm text-navy/60">{user.email}</p>
        <p className="mt-1 text-xs uppercase tracking-wide text-coral">{profile?.role}</p>
      </div>

      <div className="mb-6 rounded-2xl border border-navy/10 bg-white p-5 shadow-sm">
        <h2 className="font-display mb-2 text-sm font-semibold text-navy/70">Store settings</h2>
        <p className="text-sm text-navy/60">
          Delivery fee is currently a fixed GHS 15, set in{" "}
          <code className="rounded bg-navy/5 px-1">app/shop/checkout/page.tsx</code>. Making this
          editable here is a good next feature once you are ready.
        </p>
      </div>

      <form action={handleLogout}>
        <button className="rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110">
          Log out
        </button>
      </form>
    </div>
  );
}
