import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { order_id, email, amount } = await req.json();

  if (!order_id || !email || !amount) {
    return NextResponse.json({ error: "Missing order_id, email or amount" }, { status: 400 });
  }

  const res = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount: Math.round(amount * 100), // Paystack expects kobo/pesewas
      currency: "GHS",
      metadata: { order_id },
      callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/shop/checkout/success`,
    }),
  });

  const data = await res.json();

  if (!data.status) {
    return NextResponse.json({ error: data.message || "Paystack init failed" }, { status: 500 });
  }

  return NextResponse.json({
    authorization_url: data.data.authorization_url,
    reference: data.data.reference,
  });
}
