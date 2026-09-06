"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useCartStore } from "@/lib/cartStore";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

function ShopIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 2-1.58l1.65-7.42H5.12" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export default function Navbar() {
  const items = useCartStore((s) => s.items);
  const count = items.reduce((n, i) => n + i.qty, 0);
  const [supabase] = useState(() => createClient());
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

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

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  async function handleLogout() {
    setMenuOpen(false);
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    if (trimmed) {
      router.push(`/shop?q=${encodeURIComponent(trimmed)}`);
    }
  }

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-navy/10 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
        <Link href="/" className="font-display shrink-0 text-lg font-semibold text-navy">
          Port-Fresh
        </Link>

        <form
          onSubmit={handleSearch}
          className="order-3 flex w-full items-center gap-2 sm:order-none sm:w-auto sm:flex-1"
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for fish, chicken, seafood..."
            className="w-full rounded-full border border-navy/15 bg-ice px-4 py-2 text-sm text-navy placeholder:text-slate-body/70 focus:border-frost focus:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 rounded-full bg-navy px-4 py-2 text-sm font-medium text-white transition hover:brightness-110"
          >
            Search
          </button>
        </form>

        <nav className="flex items-center gap-4 text-sm font-medium text-navy">
          <Link href="/shop" className="flex items-center gap-1.5">
            <ShopIcon />
            Shop
          </Link>

          <Link href="/shop/cart" className="relative flex items-center gap-1.5">
            <CartIcon />
            Cart
            {count > 0 && (
              <span className="absolute -right-3 -top-2 rounded-full bg-coral px-1.5 text-xs text-white">
                {count}
              </span>
            )}
          </Link>

          {loading ? (
            <span className="w-16" />
          ) : user ? (
            <div ref={menuRef} className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-1.5 rounded-full border border-navy/15 px-3 py-1.5 transition hover:bg-ice"
              >
                <UserIcon />
                Account
                <ChevronIcon />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-navy/10 bg-white py-1.5 shadow-lg">
                  <Link
                    href="/shop/account"
                    className="block px-4 py-2 text-sm text-navy hover:bg-ice"
                  >
                    My Account
                  </Link>
                  <Link
                    href="/shop/account/orders"
                    className="block px-4 py-2 text-sm text-navy hover:bg-ice"
                  >
                    My Orders
                  </Link>
                  <Link
                    href="/shop/wishlist"
                    className="block px-4 py-2 text-sm text-navy hover:bg-ice"
                  >
                    Wishlist
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-sm text-navy hover:bg-ice"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-coral px-3 py-1.5 text-white transition hover:brightness-105"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}