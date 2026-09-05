"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cartStore";
import { createClient } from "@/lib/supabase/client";

const DELIVERY_FEE = 15;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clear } = useCartStore();
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const total = subtotal() + DELIVERY_FEE;

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!address || !phone || !email) {
      setError("Please fill in your delivery address, phone and email.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login?next=/shop/checkout");
        return;
      }

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          address,
          phone,
          email,
          subtotal: subtotal(),
          delivery_fee: DELIVERY_FEE,
          total,
        }),
      });

      const order = await res.json();
      if (!res.ok) throw new Error(order.error || "Could not create order");

      const payRes = await fetch("/api/payments/paystack/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: order.id, email, amount: total }),
      });
      const payData = await payRes.json();
      if (!payRes.ok) throw new Error(payData.error || "Could not start payment");

      clear();
      window.location.href = payData.authorization_url;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="font-display mb-6 text-2xl font-semibold text-navy">Checkout</h1>
      <form onSubmit={handlePlaceOrder} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-navy">Delivery address</label>
          <textarea
            className="w-full rounded-xl border border-navy/15 p-3 focus:border-frost focus:outline-none"
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="House number, street, area, landmark"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-navy">Phone number</label>
          <input
            className="w-full rounded-xl border border-navy/15 p-3 focus:border-frost focus:outline-none"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 024 xxx xxxx"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-navy">Email</label>
          <input
            type="email"
            className="w-full rounded-xl border border-navy/15 p-3 focus:border-frost focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="rounded-2xl border border-navy/10 bg-white p-4 text-sm">
          <div className="flex justify-between text-slate-body">
            <span>Subtotal</span>
            <span>GHS {subtotal().toFixed(2)}</span>
          </div>
          <div className="mt-1 flex justify-between text-slate-body">
            <span>Delivery fee</span>
            <span>GHS {DELIVERY_FEE.toFixed(2)}</span>
          </div>
          <div className="mt-3 flex justify-between border-t border-navy/10 pt-3">
            <span className="font-display font-semibold text-navy">Total</span>
            <span className="font-display font-semibold text-navy">GHS {total.toFixed(2)}</span>
          </div>
        </div>

        {error && <p className="text-sm text-coral">{error}</p>}

        <button
          disabled={loading || items.length === 0}
          className="w-full rounded-full bg-coral py-3 font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:bg-slate-body/20 disabled:text-slate-body"
        >
          {loading ? "Placing order..." : "Pay & place order"}
        </button>
      </form>
    </div>
  );
}