"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push(params.get("next") || "/shop");
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm items-center px-4 py-12">
      <div className="w-full">
        <h1 className="font-display mb-1 text-2xl font-semibold text-navy">Welcome back</h1>
        <p className="mb-6 text-sm text-slate-body">Log in to continue shopping.</p>
        <form onSubmit={handleLogin} className="space-y-4">
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
          />
          {error && <p className="text-sm text-coral">{error}</p>}
          <button
            disabled={loading}
            className="w-full rounded-full bg-coral py-3 font-semibold text-white transition hover:brightness-105 disabled:bg-slate-body/20 disabled:text-slate-body"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
        <p className="mt-4 text-sm text-slate-body">
          No account?{" "}
          <Link href="/signup" className="font-medium text-frost hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}