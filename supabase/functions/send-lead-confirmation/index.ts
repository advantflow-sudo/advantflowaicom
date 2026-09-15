import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

// ---------------------------------------------------------------------------
// CONTACT FORM / CHAT WIDGET AUTOMATION
// a) confirmation email to the visitor
// b) notification email to info@advantflowai.com
//
// >>> PLUG IN YOUR EMAIL PROVIDER KEY HERE <<<
// Add a project secret named EMAIL_API_KEY (Resend API key).
// RESEND_API_KEY is kept as a fallback so nothing breaks today.
// ---------------------------------------------------------------------------
const EMAIL_API_KEY = Deno.env.get("EMAIL_API_KEY") ?? Deno.env.get("RESEND_API_KEY");

// >>> PLUG IN YOUR CALENDAR / BOOKING LINK HERE <<<
// (Calendly, SavvyCal, etc. Defaults to the on-site booking calendar.)
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

const esc = (v: unknown) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

async function sendEmail(payload: unknown) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${EMAIL_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`Email API error: ${await response.text()}`);
  return response.json();
}

const shell = (inner: string) => `
<!DOCTYPE html><html><body style="font-family:'Space Grotesk','Segoe UI',sans-serif;line-height:1.6;margin:0;padding:0;background:#0a0e1a;color:#e2e8f0;">
  <div style="max-width:600px;margin:0 auto;">
    <div style="background:linear-gradient(135deg,#1a1f4d,#0a0e2a);text-align:center;padding:40px 20px 30px;border-bottom:2px solid #00d4ff;">
      <div style="font-size:28px;font-weight:bold;"><span style="color:#fff;">Advant</span><span style="color:#00d4ff;">Flow</span>AI</div>
      <p style="color:#94a3b8;margin:8px 0 0;font-size:13px;">Technology Made Simple</p>
    </div>
    <div style="background:#111827;padding:40px 30px;">${inner}</div>
    <div style="background:#0a0e1a;text-align:center;padding:30px 20px;color:#475569;font-size:13px;border-top:1px solid #1e293b;">
      <p><a href="https://advantflowai.com" style="color:#00d4ff;text-decoration:none;">advantflowai.com</a> · <a href="mailto:info@advantflowai.com" style="color:#00d4ff;text-decoration:none;">info@advantflowai.com</a></p>
    </div>
  </div>
</body></html>`;

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

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );
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
      await sendEmail({
        from: "Advant Flow AI <hello@advantflowai.com>",
        to: [email],
        reply_to: "info@advantflowai.com",
        subject: "We've got your message — here's what happens next",
        html: shell(`
          <h2 style="color:#fff;margin-top:0;font-size:24px;">Hi ${esc(firstName)},</h2>
          <p style="color:#94a3b8;font-size:15px;">Thanks for reaching out to Advant Flow AI — we've received your message about <span style="color:#00d4ff;font-weight:600;">${esc(interest)}</span>.</p>
          <p style="color:#fff;font-weight:600;margin-bottom:4px;">Here's what happens next:</p>
          <p style="color:#94a3b8;font-size:15px;">We'll review what you've shared and get back to you within one business day with next steps (or to book a quick call if that's easier).</p>
          <p style="color:#94a3b8;font-size:15px;">In the meantime, if you'd like to skip ahead, you can grab a slot directly on our calendar:</p>
          <a href="${BOOKING_LINK}" style="display:inline-block;background:linear-gradient(135deg,#00d4ff,#0ea5e9);color:#0a0e1a;font-weight:bold;padding:14px 32px;border-radius:8px;text-decoration:none;margin:8px 0 24px;font-size:15px;">Book a call →</a>
          <p style="color:#94a3b8;font-size:15px;margin:0;">Talk soon,<br/>The Advant Flow AI Team<br/><a href="https://advantflowai.com" style="color:#00d4ff;text-decoration:none;">advantflowai.com</a></p>
        `),
      });
      console.log("Confirmation email sent");
    } catch (emailErr) {
      console.error("Email send failed (non-fatal):", emailErr);
    }

    // 2. Notification to the business
    try {
      const row = (label: string, value: string) => `
        <p style="color:#00d4ff;font-size:12px;text-transform:uppercase;letter-spacing:1px;font-weight:bold;margin:16px 0 2px;">${label}</p>
        <p style="color:#e2e8f0;margin:0;">${value}</p>`;

      await sendEmail({
        from: "Advant Flow AI Website <hello@advantflowai.com>",
        to: ["info@advantflowai.com"],
        reply_to: email,
        subject: `New lead: ${name} — ${service_interest || "General"}`,
        html: shell(`
          <h2 style="color:#fff;margin-top:0;font-size:22px;">New lead</h2>
          ${row("Name", esc(name))}
          ${row("Email", `<a href="mailto:${esc(email)}" style="color:#00d4ff;">${esc(email)}</a>`)}
          ${company ? row("Company", esc(company)) : ""}
          ${phone ? row("Phone", esc(phone)) : ""}
          ${row("Interest", esc(service_interest || "Not specified"))}
          ${row("Message", esc(message))}
          ${row("Source", esc(leadSource))}
          ${row("Timestamp", esc(timestamp))}
        `),
      });
      console.log("Admin notification sent");
    } catch (notifErr) {
      console.error("Admin notification failed (non-fatal):", notifErr);
    }

    // 3. AI lead scoring
    try {
      const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
      const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
      await fetch(`${supabaseUrl}/functions/v1/score-lead`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${serviceRoleKey}`,
          "x-internal-secret": serviceRoleKey,
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
