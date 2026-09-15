import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

// ---------------------------------------------------------------------------
// UNIFIED LEAD ROUTING
// Every lead source (chat widget, contact form, booking) posts here with the
// same JSON shape, and this function forwards it to ONE outbound webhook.
//
// >>> PLUG IN YOUR CRM / ZAPIER / MAKE / n8n WEBHOOK HERE <<<
// Add a project secret named LEAD_WEBHOOK_URL with your webhook URL.
// If it is not set, the payload is simply logged so nothing ever breaks.
// ---------------------------------------------------------------------------
const LEAD_WEBHOOK_URL = Deno.env.get("LEAD_WEBHOOK_URL");

const allowedOrigins = [
  "https://advantflowai.com",
  "https://www.advantflowai.com",
  "https://advantflowaicom.lovable.app",
  "https://id-preview--3285e5ca-ad8d-49ce-ac1d-7df0ba939353.lovable.app",
  "http://localhost:8080",
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("origin") ?? "";
  const allowOrigin = allowedOrigins.includes(origin) ? origin : "https://advantflowai.com";
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  };
}

interface LeadPayload {
  event?: string;
  name?: string;
  email?: string;
  phone?: string;
  interest?: string;
  message?: string;
  source?: string;
  timestamp?: string;
}

const clamp = (value: unknown, max: number) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as LeadPayload;

    const payload = {
      event: clamp(body.event, 40) || "lead.captured",
      name: clamp(body.name, 100),
      email: clamp(body.email, 255),
      phone: clamp(body.phone, 30),
      interest: clamp(body.interest, 100),
      message: clamp(body.message, 2000),
      source: clamp(body.source, 100) || "advantflowai.com",
      timestamp: clamp(body.timestamp, 40) || new Date().toISOString(),
    };

    if (!payload.email) {
      return new Response(JSON.stringify({ error: "email is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!LEAD_WEBHOOK_URL) {
      // Fallback: no webhook wired up yet — log and succeed.
      console.log("[lead-router] LEAD_WEBHOOK_URL not set. Payload:", JSON.stringify(payload));
      return new Response(JSON.stringify({ success: true, forwarded: false }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const res = await fetch(LEAD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const details = await res.text();
      console.error(`[lead-router] Webhook failed [${res.status}]: ${details}`);
      // Never fail the visitor's journey because of a downstream webhook.
      return new Response(JSON.stringify({ success: true, forwarded: false, status: res.status }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, forwarded: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[lead-router] Error:", error);
    return new Response(JSON.stringify({ success: true, forwarded: false }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
