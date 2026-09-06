"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AccountPage() {
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login?next=/shop/account");
        return;
      }

      setEmail(user.email ?? "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("name, phone, address")
        .eq("id", user.id)
        .single();

      if (profile) {
        setName(profile.name ?? "");
        setPhone(profile.phone ?? "");
        setAddress(profile.address ?? "");
      }

      setLoading(false);
    }
    loadProfile();
  }, [supabase, router]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login?next=/shop/account");
      return;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ name, phone, address })
      .eq("id", user.id);

    if (updateError) {
      setError(updateError.message);
    } else {
      setMessage("Your profile has been updated.");
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center text-slate-body">
        Loading your account...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="font-display mb-6 text-2xl font-semibold text-navy">My Account</h1>

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-navy">Email</label>
          <input
            type="email"
            value={email}
            disabled
            className="w-full rounded-xl border border-navy/10 bg-ice p-3 text-slate-body"
          />
          <p className="mt-1 text-xs text-slate-body">Email can&apos;t be changed here.</p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-navy">Full name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-navy/15 p-3 focus:border-frost focus:outline-none"
            placeholder="Your full name"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-navy">Phone number</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-xl border border-navy/15 p-3 focus:border-frost focus:outline-none"
            placeholder="e.g. 024 xxx xxxx"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-navy">Delivery address</label>
          <textarea
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full rounded-xl border border-navy/15 p-3 focus:border-frost focus:outline-none"
            placeholder="House number, street, area, landmark"
          />
        </div>

        {message && <p className="text-sm text-frost">{message}</p>}
        {error && <p className="text-sm text-coral">{error}</p>}

        <button
          disabled={saving}
          className="w-full rounded-full bg-coral py-3 font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:bg-slate-body/20 disabled:text-slate-body"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}