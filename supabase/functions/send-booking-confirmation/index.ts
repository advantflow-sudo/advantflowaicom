import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface BookingEmailRequest {
  name: string;
  email: string;
  booking_date: string;
  booking_time: string;
  service_interest?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, booking_date, booking_time, service_interest }: BookingEmailRequest = await req.json();

    // Validate: must reference a real booking to prevent email-abuse spam
    if (!email || !booking_date || !booking_time) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );
    const { data: bookingRow } = await supabaseAdmin
      .from("bookings").select("id, email")
      .eq("email", email).eq("booking_date", booking_date).eq("booking_time", booking_time)
      .maybeSingle();
    if (!bookingRow) {
      return new Response(JSON.stringify({ error: "Booking not found" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Sending booking confirmation:", { name, email, booking_date, booking_time });

    // Format date nicely
    const dateObj = new Date(booking_date + "T00:00:00");
    const formattedDate = dateObj.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

    // Build Google Calendar link
    const [hours, minutes] = booking_time.split(":").map(Number);
    const startUtc = new Date(Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), hours, minutes));
    const endUtc = new Date(startUtc.getTime() + 30 * 60 * 1000); // 30 min call
    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("Discovery Call with Advant Flow AI")}&dates=${fmt(startUtc)}/${fmt(endUtc)}&details=${encodeURIComponent(`Free 30-minute discovery call with Advant Flow AI.\n\nService interest: ${service_interest || "General"}\n\nWe'll reach out with meeting details shortly.`)}&location=${encodeURIComponent("Video Call (link to follow)")}`;

    // 1. Send confirmation to the booker
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
        body: JSON.stringify({
          from: "Advant Flow AI <hello@advantflowai.com>",
          to: [email],
          reply_to: "info@advantflowai.com",
          subject: `Your discovery call is confirmed — ${formattedDate} at ${booking_time}`,
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
.card{background:#1e293b;border-radius:12px;padding:24px;margin:24px 0;border-left:3px solid #00d4ff}
.card p{margin:6px 0;color:#e2e8f0}
.card .label{color:#00d4ff;font-size:12px;text-transform:uppercase;letter-spacing:1px;font-weight:bold;margin-top:12px}
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
    <h2>You're booked in, ${name}! 🎉</h2>
    <p>Your free 30-minute discovery call has been confirmed. Here are the details:</p>
    <div class="card">
      <p class="label">Date</p>
      <p style="font-size:18px;font-weight:600">${formattedDate}</p>
      <p class="label">Time</p>
      <p style="font-size:18px;font-weight:600">${booking_time} (London time)</p>
      ${service_interest ? `<p class="label">Topic</p><p>${service_interest}</p>` : ""}
    </div>
    <div style="background:#1e293b;border-radius:12px;padding:24px;margin:24px 0;border-left:3px solid #00d4ff">
      <p style="color:#00d4ff;font-weight:600;margin:0 0 12px">📋 How to prepare:</p>
      <ul style="color:#94a3b8;margin:0;padding-left:20px">
        <li style="margin-bottom:8px">Have a rough idea of your budget and timeline</li>
        <li style="margin-bottom:8px">List your top 3 pain points or goals</li>
        <li style="margin-bottom:8px">Gather 2-3 examples of websites or tools you admire</li>
      </ul>
    </div>
    <p>If you need to reschedule, just reply to this email.</p>
    <div style="text-align:center;margin:24px 0">
      <a href="${gcalUrl}" style="display:inline-block;background:linear-gradient(135deg,#00d4ff,#0ea5e9);color:#0a0e1a;font-weight:bold;padding:14px 32px;border-radius:8px;text-decoration:none;font-size:15px">📅 Add to Google Calendar</a>
    </div>
    <a href="https://advantflowai.com/#projects" class="cta">See Our Recent Work →</a>
  </div>
  <div class="footer">
    <p>Advant Flow AI Ltd · London, UK</p>
    <p><a href="https://advantflowai.com">advantflowai.com</a> · <a href="mailto:info@advantflowai.com">info@advantflowai.com</a></p>
    <p>© ${new Date().getFullYear()} Advant Flow AI Ltd. All rights reserved.</p>
  </div>
</div>
</body>
</html>`,
        }),
      });
      if (!res.ok) console.error("Booking email failed:", await res.text());
      else console.log("Booking confirmation email sent");
    } catch (e) {
      console.error("Email send error (non-fatal):", e);
    }

    // 2. Notify admin
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
        body: JSON.stringify({
          from: "Advant Flow AI Website <hello@advantflowai.com>",
          to: ["info@advantflowai.com"],
          subject: `📅 New Booking: ${name} — ${formattedDate} at ${booking_time}`,
          html: `
<body style="font-family:'Space Grotesk',sans-serif;background:#0a0e1a;color:#e2e8f0;margin:0;padding:0">
<div style="max-width:600px;margin:0 auto">
  <div style="background:linear-gradient(135deg,#1a1f4d,#0a0e2a);padding:30px 20px;text-align:center;border-bottom:2px solid #00d4ff">
    <h2 style="color:#fff;margin:0">📅 New Discovery Call Booked</h2>
  </div>
  <div style="background:#111827;padding:30px">
    <p style="color:#00d4ff;font-size:12px;text-transform:uppercase;letter-spacing:1px;font-weight:bold">Name</p>
    <p style="color:#e2e8f0">${name}</p>
    <p style="color:#00d4ff;font-size:12px;text-transform:uppercase;letter-spacing:1px;font-weight:bold">Email</p>
    <p><a href="mailto:${email}" style="color:#00d4ff">${email}</a></p>
    <p style="color:#00d4ff;font-size:12px;text-transform:uppercase;letter-spacing:1px;font-weight:bold">Date & Time</p>
    <p style="color:#e2e8f0;font-size:18px;font-weight:bold">${formattedDate} at ${booking_time}</p>
    ${service_interest ? `<p style="color:#00d4ff;font-size:12px;text-transform:uppercase;letter-spacing:1px;font-weight:bold">Interest</p><p style="color:#e2e8f0">${service_interest}</p>` : ""}
    <div style="text-align:center;margin-top:20px">
      <a href="mailto:${email}?subject=Your upcoming discovery call with Advant Flow AI&body=Hi ${name}," style="display:inline-block;background:#00d4ff;color:#0a0e1a;font-weight:bold;padding:10px 24px;border-radius:6px;text-decoration:none">Reply to ${name} →</a>
    </div>
  </div>
</div>
</body>`,
        }),
      });
      console.log("Admin booking notification sent");
    } catch (e) {
      console.error("Admin notification error (non-fatal):", e);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-booking-confirmation:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
