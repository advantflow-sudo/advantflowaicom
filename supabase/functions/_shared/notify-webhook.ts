// ---------------------------------------------------------------------------
// OUTBOUND EVENT NOTIFIER (n8n / Zapier / Make / CRM)
//
// >>> PLUG IN YOUR WEBHOOK HERE <<<
// Add a project secret named LEAD_WEBHOOK_URL (your n8n *production* webhook).
// If it is not set, the payload is simply logged — nothing ever breaks.
//
// Every event uses the same JSON shape so a single n8n workflow can switch on
// the `event` field:
//   lead.captured | booking.created | booking.reminder | lead.followup
// ---------------------------------------------------------------------------

export type LeadEvent =
  | "lead.captured"
  | "booking.created"
  | "booking.reminder"
  | "lead.followup";

export interface EventPayload {
  event: LeadEvent;
  name?: string;
  email?: string;
  interest?: string;
  message?: string;
  source?: string;
  booking_date?: string;
  booking_time?: string;
  timezone?: string;
  timestamp?: string;
}

export async function notifyWebhook(payload: EventPayload): Promise<void> {
  const url = Deno.env.get("LEAD_WEBHOOK_URL");
  const body = { ...payload, timestamp: payload.timestamp ?? new Date().toISOString() };

  if (!url) {
    console.log("[notify-webhook] LEAD_WEBHOOK_URL not set. Payload:", JSON.stringify(body));
    return;
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      console.error(`[notify-webhook] ${payload.event} failed [${res.status}]:`, await res.text());
    }
  } catch (err) {
    // Non-blocking: a downstream automation must never break the app.
    console.error(`[notify-webhook] ${payload.event} error (non-fatal):`, err);
  }
}
