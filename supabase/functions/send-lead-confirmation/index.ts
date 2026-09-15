import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

// ---------------------------------------------------------------------------
// CONTACT FORM / CHAT WIDGET AUTOMATION
// a) confirmation email to the visitor
// b) instant notification email to the owner inbox (info@advantflowai.com)
//
// Emails are sent through the project's own verified sending domain
// (notify.advantflowai.com) via the send-transactional-email function.
// Templates live in _shared/transactional-email-templates/.
//
// >>> PLUG IN YOUR CALENDAR / BOOKING LINK HERE <<<
// Add a project secret named BOOKING_LINK (Calendly, SavvyCal, etc.)
// ---------------------------------------------------------------------------
const BOOKING_LINK = Deno.env.get("BOOKING_LINK") ?? "https://advantflowai.com/#booking";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface LeadEmailRequest {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  service_interest?: string;
  message: string;
  lead_id?: string;
  source?: string;
}

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

async function sendTemplate(
  templateName: string,
  recipientEmail: string,
  templateData: Record<string, unknown>,
) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/send-transactional-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({ templateName, recipientEmail, templateData }),
  });
  if (!res.ok) throw new Error(`[${res.status}] ${await res.text()}`);
  return res.json();
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { name, email, company, phone, service_interest, message, lead_id, source }: LeadEmailRequest =
      await req.json();

    if (!lead_id || !email || !name) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
    const { data: leadRow } = await supabaseAdmin
      .from("leads")
      .select("id, email")
      .eq("id", lead_id)
      .maybeSingle();
    if (!leadRow || leadRow.email.toLowerCase() !== String(email).toLowerCase()) {
      return new Response(JSON.stringify({ error: "Lead not found or email mismatch" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const firstName = String(name).trim().split(" ")[0] || "there";
    const interest = service_interest || "our services";
    const timestamp = new Date().toISOString();
    const leadSource = source || "advantflowai.com contact form";

    // 1. Confirmation to the visitor (non-blocking)
    try {
      await sendTemplate("lead-confirmation", email, {
        firstName,
        interest,
        bookingLink: BOOKING_LINK,
      });
      console.log("Confirmation email queued");
    } catch (emailErr) {
      console.error("Visitor email failed (non-fatal):", emailErr);
    }

    // 2. Instant notification to the owner inbox (recipient fixed in the template)
    try {
      await sendTemplate("lead-notification", "info@advantflowai.com", {
        name,
        email,
        company,
        phone,
        interest: service_interest || "Not specified",
        message,
        source: leadSource,
        timestamp,
      });
      console.log("Owner notification queued");
    } catch (notifErr) {
      console.error("Owner notification failed (non-fatal):", notifErr);
    }

    // 3. AI lead scoring
    try {
      await fetch(`${SUPABASE_URL}/functions/v1/score-lead`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
          "x-internal-secret": SERVICE_ROLE_KEY,
        },
        body: JSON.stringify({ lead_id, name, email, company, phone, service_interest, message }),
      });
    } catch (err) {
      console.error("Lead scoring trigger failed:", err);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-lead-confirmation:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
