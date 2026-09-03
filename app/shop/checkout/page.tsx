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

      // 1. Create the order in our DB (status: pending / unpaid)
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

      // 2. Kick off Paystack payment for the order
      const payRes = await fetch("/api/payments/paystack/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: order.id, email, amount: total }),
      });
      const payData = await payRes.json();
      if (!payRes.ok) throw new Error(payData.error || "Could not start payment");

      clear();
      window.location.href = payData.authorization_url; // redirect to Paystack
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Checkout</h1>
      <form onSubmit={handlePlaceOrder} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Delivery address</label>
          <textarea
            className="w-full rounded-lg border border-slate-300 p-3"
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="House number, street, area, landmark"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Phone number</label>
          <input
            className="w-full rounded-lg border border-slate-300 p-3"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 024 xxx xxxx"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input
            type="email"
            className="w-full rounded-lg border border-slate-300 p-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="rounded-lg bg-slate-100 p-4 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>GHS {subtotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery fee</span>
            <span>GHS {DELIVERY_FEE.toFixed(2)}</span>
          </div>
          <div className="mt-2 flex justify-between border-t border-slate-300 pt-2 font-bold">
            <span>Total</span>
            <span>GHS {total.toFixed(2)}</span>
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          disabled={loading || items.length === 0}
          className="w-full rounded-full bg-blue-600 py-3 font-semibold text-white disabled:bg-slate-300"
        >
          {loading ? "Placing order..." : "Pay & place order"}
        </button>
      </form>
    </div>
  );
}
