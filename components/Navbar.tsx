"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cartStore";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
  const items = useCartStore((s) => s.items);
  const count = items.reduce((n, i) => n + i.qty, 0);

  const [supabase] = useState(() => createClient());
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadUserAndRole() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);

      if (data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();
        setIsAdmin(profile?.role === "admin");
      } else {
        setIsAdmin(false);
      }

      setLoading(false);
    }

    loadUserAndRole();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single()
          .then(({ data: profile }) => {
            setIsAdmin(profile?.role === "admin");
          });
      } else {
        setIsAdmin(false);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold text-blue-700">
          Port-Fresh
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link href="/shop">Shop</Link>
          <Link href="/shop/account/orders">My Orders</Link>
          {isAdmin && (
            <Link href="/admin" className="text-amber-700">
              Admin
            </Link>
          )}
          <Link href="/shop/cart" className="relative">
            Cart
            {count > 0 && (
              <span className="absolute -right-3 -top-2 rounded-full bg-blue-600 px-1.5 text-xs text-white">
                {count}
              </span>
            )}
          </Link>

          {loading ? (
            <span className="w-16" />
          ) : user ? (
            <button
              onClick={handleLogout}
              className="rounded-full bg-slate-800 px-3 py-1.5 text-white"
            >
              Logout
            </button>
          ) : (
            <Link href="/login" className="rounded-full bg-blue-600 px-3 py-1.5 text-white">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}