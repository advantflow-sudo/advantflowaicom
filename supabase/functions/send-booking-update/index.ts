import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface BookingUpdateRequest {
  type: "cancelled" | "rescheduled";
  name: string;
  email: string;
  original_date: string;
  original_time: string;
  new_date?: string;
  new_time?: string;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function buildGcalUrl(dateStr: string, timeStr: string): string {
  const [h, m] = timeStr.split(":").map(Number);
  const dateObj = new Date(dateStr + "T00:00:00");
  const startUtc = new Date(Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), h, m));
  const endUtc = new Date(startUtc.getTime() + 30 * 60 * 1000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  return "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" +
    encodeURIComponent("Discovery Call with Advant Flow AI") +
    "&dates=" + fmt(startUtc) + "/" + fmt(endUtc) +
    "&details=" + encodeURIComponent("Rescheduled discovery call with Advant Flow AI.") +
    "&location=" + encodeURIComponent("Video Call (link to follow)");
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, name, email, original_date, original_time, new_date, new_time }: BookingUpdateRequest = await req.json();
    console.log("Booking update notification:", { type, name, email });

    const isCancelled = type === "cancelled";
    const subject = isCancelled
      ? "Your discovery call has been cancelled"
      : "Your discovery call has been rescheduled — " + formatDate(new_date!) + " at " + new_time;

    const gcalLink = !isCancelled && new_date && new_time
      ? '<a href="' + buildGcalUrl(new_date, new_time) + '" class="cta">📅 Add to Google Calendar</a>'
      : "";

    const contentBlock = isCancelled
      ? '<h2>Your call has been cancelled</h2>' +
        '<p>We\'re sorry, but your discovery call originally scheduled for <span class="highlight">' + formatDate(original_date) + " at " + original_time + '</span> has been cancelled.</p>' +
        '<div style="background:#1e293b;border-radius:12px;padding:24px;margin:24px 0;border-left:3px solid #00d4ff">' +
        '<p style="color:#00d4ff;font-weight:600;margin:0 0 12px">What now?</p>' +
        '<p style="color:#94a3b8;margin:0">You can book a new time that works better for you — we\'d still love to chat!</p>' +
        '</div>' +
        '<a href="https://advantflowai.com/#booking" class="cta">Book a New Time →</a>'
      : '<h2>Your call has been rescheduled</h2>' +
        '<p>Your discovery call has been moved to a new time:</p>' +
        '<div style="background:#1e293b;border-radius:12px;padding:24px;margin:24px 0;border-left:3px solid #00d4ff">' +
        '<p style="color:#64748b;font-size:13px;margin:0 0 4px;text-decoration:line-through">' + formatDate(original_date) + " at " + original_time + '</p>' +
        '<p style="color:#00d4ff;font-size:20px;font-weight:bold;margin:8px 0 0">' + formatDate(new_date!) + " at " + new_time + '</p>' +
        '</div>' +
        '<p>If this new time doesn\'t work, just reply to this email and we\'ll find another slot.</p>' +
        gcalLink;

    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
        body: JSON.stringify({
          from: "Advant Flow AI <hello@advantflowai.com>",
          to: [email],
          reply_to: "advantflow@gmail.com",
          subject,
          html: `
<!DOCTYPE html>
<html>
<head><style>
body{font-family:'Space Grotesk','Segoe UI',sans-serif;margin:0;padding:0;background:#0a0e1a;color:#e2e8f0}
.container{max-width:600px;margin:0 auto}
.header{background:linear-gradient(135deg,#1a1f4d,#0a0e2a);text-align:center;padding:40px 20px 30px;border-bottom:2px solid #00d4ff}
.logo{font-size:28px;font-weight:bold}.logo-a{color:#fff}.logo-f{color:#00d4ff}
.content{background:#111827;padding:40px 30px}
.content h2{color:#fff;margin-top:0;font-size:24px}
.content p{color:#94a3b8;font-size:15px}
.highlight{color:#00d4ff;font-weight:600}
.cta{display:inline-block;background:linear-gradient(135deg,#00d4ff,#0ea5e9);color:#0a0e1a;font-weight:bold;padding:14px 32px;border-radius:8px;text-decoration:none;margin-top:20px;font-size:15px}
.footer{background:#0a0e1a;text-align:center;padding:30px 20px;color:#475569;font-size:13px;border-top:1px solid #1e293b}
.footer a{color:#00d4ff;text-decoration:none}
</style></head>
<body>
<div class="container">
  <div class="header">
    <div class="logo"><span class="logo-a">Advant</span><span class="logo-f">Flow</span>AI</div>
    <p style="color:#94a3b8;margin:8px 0 0;font-size:13px">AI Automation & Web Design Agency</p>
  </div>
  <div class="content">
    <p>Hey ${name} 👋</p>
    ${contentBlock}
  </div>
  <div class="footer">
    <p>Advant Flow AI Ltd · London, UK</p>
    <p><a href="https://advantflowai.com">advantflowai.com</a> · <a href="mailto:advantflow@gmail.com">advantflow@gmail.com</a></p>
    <p>© ${new Date().getFullYear()} Advant Flow AI Ltd. All rights reserved.</p>
  </div>
</div>
</body>
</html>`,
        }),
      });
      if (!res.ok) console.error("Update email failed:", await res.text());
      else console.log("Booking update email sent:", type);
    } catch (e) {
      console.error("Email error (non-fatal):", e);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
