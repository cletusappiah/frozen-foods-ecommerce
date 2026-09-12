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

export async function sendNotification(
  type: NotificationType,
  payload: NotificationPayload
) {
  const results: { channel: string; ok: boolean; error?: string }[] = [];

  if (payload.to.email && resend) {
    try {
      const result = await resend.emails.send({
        from: process.env.EMAIL_FROM || "Port-Fresh <onboarding@resend.dev>",
        to: payload.to.email,
        subject: payload.subject || "Port-Fresh Frozen Foods",
        text: payload.message,
      });

      if (result.error) {
        console.error("Resend API returned an error:", result.error);
        results.push({ channel: "email", ok: false, error: result.error.message });
      } else {
        console.log("Resend send succeeded, id:", result.data?.id);
        results.push({ channel: "email", ok: true });
      }
    } catch (err) {
      console.error("Email notification threw an exception:", err);
      results.push({ channel: "email", ok: false });
    }
  }

  return results;
}
