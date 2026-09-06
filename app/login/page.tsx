"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AuthBrandPanel from "@/components/AuthBrandPanel";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setLoading(false);
      setError(error.message);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    setLoading(false);
    if (profile?.role === "admin") {
      router.push("/admin");
    } else {
      router.push(params.get("next") || "/shop");
    }
    router.refresh();
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-ice">
      <AuthBrandPanel
        heading={
          <>
            Fresh from the port,
            <br />
            straight to your door.
          </>
        }
        description="Log in to track your orders, manage your wishlist, and keep your delivery details up to date."
      />

      <div className="flex w-full items-center justify-center px-4 py-12 lg:w-1/2">
        <div className="w-full max-w-sm rounded-3xl border border-navy/10 bg-white/80 p-8 shadow-xl shadow-navy/5 backdrop-blur">
          <h1 className="font-display mb-1 text-2xl font-semibold text-navy">Welcome back</h1>
          <p className="mb-6 text-sm text-slate-body">Log in to continue to your account.</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              className="w-full rounded-2xl border border-navy/15 bg-white p-3.5 transition focus:border-frost focus:outline-none focus:ring-4 focus:ring-frost/15"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full rounded-2xl border border-navy/15 bg-white p-3.5 pr-11 transition focus:border-frost focus:outline-none focus:ring-4 focus:ring-frost/15"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-body transition hover:text-navy"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

            {error && <p className="text-sm text-coral">{error}</p>}

            <button
              disabled={loading}
              className="w-full rounded-full bg-coral py-3.5 font-semibold text-white shadow-lg shadow-coral/25 transition hover:brightness-105 hover:shadow-coral/35 disabled:cursor-not-allowed disabled:bg-slate-body/20 disabled:text-slate-body disabled:shadow-none"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-body">
            No account?{" "}
            <Link href="/signup" className="font-medium text-navy underline underline-offset-2">
              Sign up
            </Link>
          </p>
        </div>
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