import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get tomorrow's date in YYYY-MM-DD
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    console.log("Checking for bookings on:", tomorrowStr);

    const { data: bookings, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("booking_date", tomorrowStr)
      .eq("status", "confirmed");

    if (error) throw error;
    if (!bookings || bookings.length === 0) {
      console.log("No bookings tomorrow");
      return new Response(JSON.stringify({ sent: 0 }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log(`Found ${bookings.length} bookings for tomorrow`);
    let sent = 0;

    for (const booking of bookings) {
      const dateObj = new Date(booking.booking_date + "T00:00:00");
      const formattedDate = dateObj.toLocaleDateString("en-GB", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
      });

      // Google Calendar link
      const [hours, minutes] = booking.booking_time.split(":").map(Number);
      const startUtc = new Date(Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), hours, minutes));
      const endUtc = new Date(startUtc.getTime() + 30 * 60 * 1000);
      const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
      const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("Discovery Call with AdvantFlowAI")}&dates=${fmt(startUtc)}/${fmt(endUtc)}&details=${encodeURIComponent(`Free 30-minute discovery call with AdvantFlowAI.`)}&location=${encodeURIComponent("Video Call (link to follow)")}`;

      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
          body: JSON.stringify({
            from: "AdvantFlowAI <hello@advantflowai.com>",
            to: [booking.email],
            reply_to: "advantflow@gmail.com",
            subject: `Reminder: Your discovery call is tomorrow at ${booking.booking_time}`,
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
.card{background:#1e293b;border-radius:12px;padding:24px;margin:24px 0;border-left:3px solid #00d4ff}
.card p{margin:6px 0;color:#e2e8f0}
.card .label{color:#00d4ff;font-size:12px;text-transform:uppercase;letter-spacing:1px;font-weight:bold;margin-top:12px}
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
    <h2>Hey ${booking.name}, your call is tomorrow! ⏰</h2>
    <p>Just a friendly reminder that your free 30-minute discovery call is <strong style="color:#00d4ff">tomorrow</strong>.</p>
    <div class="card">
      <p class="label">Date</p>
      <p style="font-size:18px;font-weight:600">${formattedDate}</p>
      <p class="label">Time</p>
      <p style="font-size:18px;font-weight:600">${booking.booking_time} (London time)</p>
      ${booking.service_interest ? `<p class="label">Topic</p><p>${booking.service_interest}</p>` : ""}
    </div>
    <div style="background:#1e293b;border-radius:12px;padding:24px;margin:24px 0;border-left:3px solid #00d4ff">
      <p style="color:#00d4ff;font-weight:600;margin:0 0 12px">📋 Quick prep checklist:</p>
      <ul style="color:#94a3b8;margin:0;padding-left:20px">
        <li style="margin-bottom:8px">Have a rough idea of your budget and timeline</li>
        <li style="margin-bottom:8px">List your top 3 pain points or goals</li>
        <li style="margin-bottom:8px">Gather 2-3 examples of websites or tools you admire</li>
      </ul>
    </div>
    <p>We'll reach out with meeting details shortly. If you need to reschedule, just reply to this email.</p>
    <div style="text-align:center;margin:24px 0">
      <a href="${gcalUrl}" style="display:inline-block;background:linear-gradient(135deg,#00d4ff,#0ea5e9);color:#0a0e1a;font-weight:bold;padding:14px 32px;border-radius:8px;text-decoration:none;font-size:15px">📅 Add to Google Calendar</a>
    </div>
  </div>
  <div class="footer">
    <p>AdvantFlowAI Ltd · London, UK</p>
    <p><a href="https://advantflowai.com">advantflowai.com</a> · <a href="mailto:advantflow@gmail.com">advantflow@gmail.com</a></p>
    <p>© ${new Date().getFullYear()} AdvantFlowAI Ltd. All rights reserved.</p>
  </div>
</div>
</body>
</html>`,
          }),
        });

        if (!res.ok) {
          console.error(`Reminder email failed for ${booking.email}:`, await res.text());
        } else {
          console.log(`Reminder sent to ${booking.email}`);
          sent++;
        }
      } catch (e) {
        console.error(`Email error for ${booking.email}:`, e);
      }
    }

    return new Response(JSON.stringify({ sent, total: bookings.length }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-booking-reminder:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
