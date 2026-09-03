import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { sendNotification } from "@/lib/notifications";

// Uses the service role key (server-only, bypasses RLS) because this route
// is called by Paystack, not by a logged-in user.
const supabase = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  const expected = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
    .update(rawBody)
    .digest("hex");

  if (signature !== expected) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);

  if (event.event === "charge.success") {
    const orderId = event.data.metadata?.order_id;
    const email = event.data.customer?.email;

    if (orderId) {
      await supabase
        .from("orders")
        .update({
          payment_status: "paid",
          status: "confirmed",
          payment_reference: event.data.reference,
        })
        .eq("id", orderId);

      if (email) {
        await sendNotification("payment_received", {
          to: { email },
          subject: "Payment received — your order is confirmed!",
          message: `Thanks! We've received your payment and your frozen food order (#${orderId.slice(
            0,
            8
          )}) is now confirmed. We'll notify you when it's out for delivery.`,
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
