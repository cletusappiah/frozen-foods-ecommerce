import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

type NotificationType =
  | "order_confirmation"
  | "payment_received"
  | "order_status_update";

interface NotificationPayload {
  to: { email?: string; phone?: string };
  subject?: string;
  message: string;
}

/**
 * Single entry point for all customer notifications.
 * Today this only sends email. When you're ready to add SMS or WhatsApp,
 * add a new branch here (e.g. call Arkesel/Twilio) — nothing calling this
 * function needs to change.
 */
export async function sendNotification(
  type: NotificationType,
  payload: NotificationPayload
) {
  const results: { channel: string; ok: boolean }[] = [];

  if (payload.to.email && resend) {
    try {
      await resend.emails.send({
        from: process.env.EMAIL_FROM || "orders@yourdomain.com",
        to: payload.to.email,
        subject: payload.subject || "Port-Fresh Frozen Foods",
        text: payload.message,
      });
      results.push({ channel: "email", ok: true });
    } catch (err) {
      console.error("Email notification failed:", err);
      results.push({ channel: "email", ok: false });
    }
  }

  // --- SMS placeholder ---
  // Once you have an SMS provider (Arkesel is a good Ghana-friendly option),
  // add it here:
  //
  // if (payload.to.phone && process.env.ARKESEL_API_KEY) {
  //   await fetch("https://sms.arkesel.com/api/v2/sms/send", { ... });
  //   results.push({ channel: "sms", ok: true });
  // }

  return results;
}
