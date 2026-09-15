import { supabase } from "@/integrations/supabase/client";

/**
 * Unified lead routing.
 *
 * Every lead source on the site (chat widget, contact form, booking calendar)
 * sends the same shape through here. The `lead-router` backend function
 * forwards it to your CRM / Zapier / Make / n8n webhook.
 *
 * >>> PLUG IN YOUR WEBHOOK: add a secret named LEAD_WEBHOOK_URL in your
 *     project settings. Until then the payload is just logged — nothing breaks.
 */
export interface LeadPayload {
  name: string;
  email: string;
  interest?: string;
  message?: string;
  source: "chat widget" | "contact form" | "booking";
}

export async function routeLead(payload: LeadPayload): Promise<void> {
  const body = {
    name: payload.name,
    email: payload.email,
    interest: payload.interest ?? "",
    message: payload.message ?? "",
    source: `advantflowai.com ${payload.source}`,
    timestamp: new Date().toISOString(),
  };

  try {
    const { error } = await supabase.functions.invoke("lead-router", { body });
    if (error) console.error("Lead routing failed (non-blocking):", error, body);
  } catch (err) {
    // Never let a failed automation break the visitor's experience.
    console.error("Lead routing failed (non-blocking):", err, body);
  }
}
