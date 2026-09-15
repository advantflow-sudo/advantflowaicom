import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";
import { notifyWebhook } from "../_shared/notify-webhook.ts";

// ---------------------------------------------------------------------------
// 1-HOUR-BEFORE CALL REMINDER
// Runs on an hourly schedule and emails anyone whose discovery call starts in
// the next 60-120 minutes (booking slots are on the hour / half hour).
//
// >>> EMAIL PROVIDER KEY: RESEND_API_KEY (already configured) <<<
// ---------------------------------------------------------------------------
// >>> PLUG IN YOUR EMAIL PROVIDER KEY HERE: secret EMAIL_API_KEY (Resend) <<<
const RESEND_API_KEY = Deno.env.get("EMAIL_API_KEY") ?? Deno.env.get("RESEND_API_KEY");
// >>> PLUG IN YOUR MEETING LINK HERE: secret CALL_LINK (Zoom / Meet / Teams room) <<<
const CALL_LINK = Deno.env.get("CALL_LINK") ?? "https://advantflowai.com/#booking";
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

    const now = new Date();
    const windowStart = new Date(now.getTime() + 60 * 60 * 1000);
    const windowEnd = new Date(now.getTime() + 120 * 60 * 1000);
    const dates = Array.from(
      new Set([windowStart.toISOString().split("T")[0], windowEnd.toISOString().split("T")[0]])
    );

    const { data: bookings, error } = await supabase
      .from("bookings")
      .select("*")
      .in("booking_date", dates)
      .eq("status", "confirmed");

    if (error) throw error;

    const due = (bookings ?? []).filter((b) => {
      const [h, m] = String(b.booking_time).split(":").map(Number);
      const start = new Date(`${b.booking_date}T00:00:00Z`);
      start.setUTCHours(h, m, 0, 0);
      return start >= windowStart && start < windowEnd;
    });

    let sent = 0;
    for (const booking of due) {
      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
          body: JSON.stringify({
            from: "Advant Flow AI <hello@advantflowai.com>",
            to: [booking.email],
            reply_to: "info@advantflowai.com",
            subject: `Reminder: your call with Advant Flow AI is in 1 hour`,
            html: `
<!DOCTYPE html><html><body style="font-family:'Space Grotesk','Segoe UI',sans-serif;background:#0a0e1a;color:#e2e8f0;margin:0;padding:0;">
  <div style="max-width:600px;margin:0 auto;">
    <div style="background:linear-gradient(135deg,#1a1f4d,#0a0e2a);padding:36px 20px;text-align:center;border-bottom:2px solid #00d4ff;">
      <div style="font-size:26px;font-weight:bold;"><span style="color:#fff;">Advant</span><span style="color:#00d4ff;">Flow</span>AI</div>
    </div>
    <div style="background:#111827;padding:36px 30px;">
      <h2 style="color:#fff;margin-top:0;">Hi ${String(booking.name || "there").split(" ")[0]},</h2>
      <p style="color:#94a3b8;">Quick reminder — we're speaking at <strong style="color:#00d4ff;">${booking.booking_time}</strong> today about ${booking.service_interest || "your project"}.</p>
      <p style="color:#94a3b8;">Join here: <a href="${CALL_LINK}" style="color:#00d4ff;">${CALL_LINK}</a></p>
      <p style="color:#94a3b8;">See you shortly,<br/>The Advant Flow AI Team</p>
    </div>
    <div style="background:#0a0e1a;text-align:center;padding:24px;color:#475569;font-size:13px;border-top:1px solid #1e293b;">
      <p>Advant Flow AI Ltd · <a href="mailto:info@advantflowai.com" style="color:#00d4ff;text-decoration:none;">info@advantflowai.com</a></p>
    </div>
  </div>
</body></html>`,
          }),
        });
        if (res.ok) {
          sent++;
          await notifyWebhook({
            event: "booking.reminder",
            name: booking.name,
            email: booking.email,
            interest: booking.service_interest || "",
            source: "advantflowai.com booking reminder",
            booking_date: booking.booking_date,
            booking_time: booking.booking_time,
            timezone: booking.timezone || "Europe/London",
          });
        }
        else console.error("[reminder-1h] Resend error:", await res.text());
      } catch (err) {
        console.error("[reminder-1h] Send failed (non-fatal):", err);
      }
    }

    console.log(`[reminder-1h] ${due.length} due, ${sent} sent`);
    return new Response(JSON.stringify({ due: due.length, sent }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[reminder-1h] Error:", error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
