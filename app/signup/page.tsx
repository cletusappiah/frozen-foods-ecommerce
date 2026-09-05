"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, phone } },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/shop");
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm items-center px-4 py-12">
      <div className="w-full">
        <h1 className="font-display mb-1 text-2xl font-semibold text-navy">Create an account</h1>
        <p className="mb-6 text-sm text-slate-body">Sign up to start shopping.</p>
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            className="w-full rounded-xl border border-navy/15 p-3 focus:border-frost focus:outline-none"
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <input
            className="w-full rounded-xl border border-navy/15 p-3 focus:border-frost focus:outline-none"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <input
            type="email"
            className="w-full rounded-xl border border-navy/15 p-3 focus:border-frost focus:outline-none"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="w-full rounded-xl border border-navy/15 p-3 focus:border-frost focus:outline-none"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          {error && <p className="text-sm text-coral">{error}</p>}
          <button
            disabled={loading}
            className="w-full rounded-full bg-coral py-3 font-semibold text-white transition hover:brightness-105 disabled:bg-slate-body/20 disabled:text-slate-body"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>
        <p className="mt-4 text-sm text-slate-body">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-frost hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}