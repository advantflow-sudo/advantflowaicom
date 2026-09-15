import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

// ---------------------------------------------------------------------------
// 48-HOUR FOLLOW-UP
// Finds leads (chat widget or contact form) created more than 48 hours ago
// that have NOT booked a call, and sends exactly one gentle follow-up email.
// Scheduled daily via cron; can also be triggered manually with a POST.
//
// >>> EMAIL PROVIDER KEY: RESEND_API_KEY (already configured) <<<
// ---------------------------------------------------------------------------
// >>> PLUG IN YOUR EMAIL PROVIDER KEY HERE: secret EMAIL_API_KEY (Resend) <<<
const RESEND_API_KEY = Deno.env.get("EMAIL_API_KEY") ?? Deno.env.get("RESEND_API_KEY");
// >>> PLUG IN YOUR CALENDAR / BOOKING LINK HERE: secret BOOKING_LINK <<<
const BOOKING_LINK = Deno.env.get("BOOKING_LINK") ?? "https://advantflowai.com/#booking";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
    const floor = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const { data: leads, error } = await supabase
      .from("leads")
      .select("id, name, email, service_interest, created_at")
      .eq("follow_up_sent", false)
      .lt("created_at", cutoff)
      .gt("created_at", floor)
      .limit(100);

    if (error) throw error;
    if (!leads?.length) {
      return new Response(JSON.stringify({ sent: 0 }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Skip anyone who already booked a call.
    const { data: bookings } = await supabase.from("bookings").select("email");
    const booked = new Set((bookings ?? []).map((b) => String(b.email).toLowerCase()));

    let sent = 0;
    for (const lead of leads) {
      if (booked.has(String(lead.email).toLowerCase())) {
        await supabase.from("leads").update({ follow_up_sent: true }).eq("id", lead.id);
        continue;
      }

      const firstName = String(lead.name || "there").split(" ")[0];
      const interest = lead.service_interest || "what we do";

      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
          body: JSON.stringify({
            from: "Advant Flow AI <hello@advantflowai.com>",
            to: [lead.email],
            reply_to: "info@advantflowai.com",
            subject: `Still thinking about ${interest}?`,
            html: `
<!DOCTYPE html><html><body style="font-family:'Space Grotesk','Segoe UI',sans-serif;background:#0a0e1a;color:#e2e8f0;margin:0;padding:0;">
  <div style="max-width:600px;margin:0 auto;">
    <div style="background:linear-gradient(135deg,#1a1f4d,#0a0e2a);padding:36px 20px;text-align:center;border-bottom:2px solid #00d4ff;">
      <div style="font-size:26px;font-weight:bold;"><span style="color:#fff;">Advant</span><span style="color:#00d4ff;">Flow</span>AI</div>
    </div>
    <div style="background:#111827;padding:36px 30px;">
      <h2 style="color:#fff;margin-top:0;">Hi ${firstName},</h2>
      <p style="color:#94a3b8;">Just checking in — you got in touch about <span style="color:#00d4ff;font-weight:600;">${interest}</span> a couple of days ago, and we didn't want it to slip through the cracks.</p>
      <p style="color:#94a3b8;">No pressure at all, but if it's still on your mind, the fastest way forward is a quick 15-minute call:</p>
      <a href="${BOOKING_LINK}" style="display:inline-block;background:linear-gradient(135deg,#00d4ff,#0ea5e9);color:#0a0e1a;font-weight:bold;padding:14px 32px;border-radius:8px;text-decoration:none;margin:8px 0 16px;">Book a call →</a>
      <p style="color:#94a3b8;">Or just reply to this email — happy to answer questions first.</p>
      <p style="color:#94a3b8;">The Advant Flow AI Team<br/><a href="https://advantflowai.com" style="color:#00d4ff;text-decoration:none;">advantflowai.com</a></p>
    </div>
    <div style="background:#0a0e1a;text-align:center;padding:24px;color:#475569;font-size:13px;border-top:1px solid #1e293b;">
      <p>Advant Flow AI Ltd · <a href="mailto:info@advantflowai.com" style="color:#00d4ff;text-decoration:none;">info@advantflowai.com</a></p>
    </div>
  </div>
</body></html>`,
          }),
        });

        if (!res.ok) {
          console.error("[follow-up] Resend error:", await res.text());
          continue;
        }

        await supabase
          .from("leads")
          .update({ follow_up_sent: true, follow_up_sent_at: new Date().toISOString() })
          .eq("id", lead.id);
        sent++;
      } catch (err) {
        console.error("[follow-up] Send failed (non-fatal):", err);
      }
    }

    console.log(`[follow-up] ${sent} follow-ups sent`);
    return new Response(JSON.stringify({ sent }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[follow-up] Error:", error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
