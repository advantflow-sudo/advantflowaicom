import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

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
}

async function sendEmail(payload: any) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Resend API error: ${error}`);
  }

  return response.json();
}

function getServiceSpecificContent(service: string | undefined): { tips: string; cta: string; subject_suffix: string } {
  switch (service) {
    case "Web Design":
    case "Web Development":
      return {
        tips: `
          <div style="background: #1e293b; border-radius: 12px; padding: 24px; margin: 24px 0; border-left: 3px solid #00d4ff;">
            <p style="color: #00d4ff; font-weight: 600; margin: 0 0 12px;">💡 While you wait, here's how to get the most from your new website:</p>
            <ul style="color: #94a3b8; margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 8px;">Gather 5-10 competitor websites you like — we'll analyse what works</li>
              <li style="margin-bottom: 8px;">List your top 3 business goals for the next 6 months</li>
              <li style="margin-bottom: 8px;">Prepare your brand assets (logo, colours, fonts) if you have them</li>
            </ul>
          </div>`,
        cta: "See Our Web Design Portfolio →",
        subject_suffix: "Let's build your dream website"
      };
    case "AI Automation":
    case "Custom AI Agents":
      return {
        tips: `
          <div style="background: #1e293b; border-radius: 12px; padding: 24px; margin: 24px 0; border-left: 3px solid #00d4ff;">
            <p style="color: #00d4ff; font-weight: 600; margin: 0 0 12px;">🤖 Quick wins while you wait:</p>
            <ul style="color: #94a3b8; margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 8px;">List 3 tasks you repeat daily that feel like a waste of time</li>
              <li style="margin-bottom: 8px;">Think about where leads fall through the cracks in your process</li>
              <li style="margin-bottom: 8px;">Note which tools you currently use (CRM, email, spreadsheets)</li>
            </ul>
          </div>`,
        cta: "Explore AI Automation Plans →",
        subject_suffix: "Let's automate your business"
      };
    case "Full Package (Web + AI)":
      return {
        tips: `
          <div style="background: #1e293b; border-radius: 12px; padding: 24px; margin: 24px 0; border-left: 3px solid #00d4ff;">
            <p style="color: #00d4ff; font-weight: 600; margin: 0 0 12px;">🚀 You're going all in — here's how to prepare:</p>
            <ul style="color: #94a3b8; margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 8px;">Map out your current customer journey from first contact to sale</li>
              <li style="margin-bottom: 8px;">Identify your biggest bottleneck — we'll tackle that first</li>
              <li style="margin-bottom: 8px;">Think about what "success" looks like in 90 days</li>
            </ul>
          </div>`,
        cta: "See What's Possible →",
        subject_suffix: "Your full business transformation starts here"
      };
    default:
      return {
        tips: `
          <div style="background: #1e293b; border-radius: 12px; padding: 24px; margin: 24px 0; border-left: 3px solid #00d4ff;">
            <p style="color: #00d4ff; font-weight: 600; margin: 0 0 12px;">📋 A quick heads-up on next steps:</p>
            <ul style="color: #94a3b8; margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 8px;">We'll review your message within the next few hours</li>
              <li style="margin-bottom: 8px;">You'll get a personalised response — not a generic template</li>
              <li style="margin-bottom: 8px;">We'll suggest a free 30-minute strategy call if it's a good fit</li>
            </ul>
          </div>`,
        cta: "Browse Our Services →",
        subject_suffix: "We've got your message"
      };
  }
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, company, phone, service_interest, message, lead_id }: LeadEmailRequest = await req.json();

    // Validate: must reference a real lead with matching email to prevent email-abuse spam
    if (!lead_id || !email || !name) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );
    const { data: leadRow } = await supabaseAdmin
      .from("leads").select("id, email").eq("id", lead_id).maybeSingle();
    if (!leadRow || leadRow.email.toLowerCase() !== String(email).toLowerCase()) {
      return new Response(JSON.stringify({ error: "Lead not found or email mismatch" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Processing lead:", { name, email, service_interest, lead_id });

    const serviceContent = getServiceSpecificContent(service_interest);

    // 1. Send personalised confirmation email to lead (non-blocking)
    let emailSuccess = false;
    try {
      await sendEmail({
        from: "Advant Flow AI <hello@advantflowai.com>",
        to: [email],
        reply_to: "advantflow@gmail.com",
        subject: `${name}, ${serviceContent.subject_suffix}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: 'Space Grotesk', 'Segoe UI', sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #0a0e1a; color: #e2e8f0; }
                .container { max-width: 600px; margin: 0 auto; }
                .header { background: linear-gradient(135deg, #1a1f4d 0%, #0a0e2a 100%); text-align: center; padding: 40px 20px 30px; border-bottom: 2px solid #00d4ff; }
                .logo { font-size: 28px; font-weight: bold; letter-spacing: -0.5px; }
                .logo-advant { color: #ffffff; }
                .logo-flow { color: #00d4ff; }
                .content { background: #111827; padding: 40px 30px; }
                .content h2 { color: #ffffff; margin-top: 0; font-size: 24px; }
                .content p { color: #94a3b8; font-size: 15px; }
                .highlight { color: #00d4ff; font-weight: 600; }
                .cta-button { display: inline-block; background: linear-gradient(135deg, #00d4ff, #0ea5e9); color: #0a0e1a; font-weight: bold; padding: 14px 32px; border-radius: 8px; text-decoration: none; margin-top: 20px; font-size: 15px; }
                .footer { background: #0a0e1a; text-align: center; padding: 30px 20px; color: #475569; font-size: 13px; border-top: 1px solid #1e293b; }
                .footer a { color: #00d4ff; text-decoration: none; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <div class="logo"><span class="logo-advant">Advant</span><span class="logo-flow">Flow</span>AI</div>
                  <p style="color: #94a3b8; margin: 8px 0 0; font-size: 13px;">AI Automation & Web Design Agency</p>
                </div>
                <div class="content">
                  <h2>Hey ${name} 👋</h2>
                  <p>Thanks for reaching out! We've received your message about <span class="highlight">${service_interest || "our services"}</span> and we're already excited about the possibilities.</p>
                  <p>A real human from our team will personally review your project and respond within <span class="highlight">24 hours</span> — usually much sooner.</p>
                  ${serviceContent.tips}
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0;">
                    <tr>
                      <td align="center" style="padding: 16px; background: #1e293b; border-radius: 8px;">
                        <span style="color: #00d4ff; font-size: 28px; font-weight: bold; display: block;">50+</span>
                        <span style="color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Happy Clients</span>
                      </td>
                      <td width="12"></td>
                      <td align="center" style="padding: 16px; background: #1e293b; border-radius: 8px;">
                        <span style="color: #00d4ff; font-size: 28px; font-weight: bold; display: block;">5 Days</span>
                        <span style="color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Avg. Delivery</span>
                      </td>
                      <td width="12"></td>
                      <td align="center" style="padding: 16px; background: #1e293b; border-radius: 8px;">
                        <span style="color: #00d4ff; font-size: 28px; font-weight: bold; display: block;">100%</span>
                        <span style="color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Satisfaction</span>
                      </td>
                    </tr>
                  </table>
                  <a href="https://advantflowai.com/#projects" class="cta-button">${serviceContent.cta}</a>
                  <p style="margin-top: 30px; color: #64748b; font-size: 13px;">
                    P.S. Want to fast-track things? Reply to this email with any extra details about your project and we'll get back to you even quicker.
                  </p>
                </div>
                <div class="footer">
                  <p>Advant Flow AI Ltd · London, UK</p>
                  <p><a href="https://advantflowai.com">advantflowai.com</a> · <a href="mailto:advantflow@gmail.com">advantflow@gmail.com</a></p>
                  <p>© ${new Date().getFullYear()} Advant Flow AI Ltd. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      });
      emailSuccess = true;
      console.log("Confirmation email sent successfully");
    } catch (emailErr) {
      console.error("Email send failed (non-fatal):", emailErr);
    }

    // 2. Send enriched notification to business
    try {
      await sendEmail({
        from: "Advant Flow AI Website <hello@advantflowai.com>",
        to: ["advantflow@gmail.com"],
        subject: `🔥 New Lead: ${name} — ${service_interest || "General"} ${company ? `(${company})` : ""}`,
        html: `
          <!DOCTYPE html>
          <html>
            <body style="font-family: 'Space Grotesk', sans-serif; background: #0a0e1a; color: #e2e8f0; margin: 0; padding: 0;">
              <div style="max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #1a1f4d, #0a0e2a); padding: 30px 20px; text-align: center; border-bottom: 2px solid #00d4ff;">
                  <h2 style="color: #fff; margin: 0;">🎯 New Lead Incoming</h2>
                </div>
                <div style="background: #111827; padding: 30px;">
                  <p style="color: #00d4ff; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Name</p>
                  <p style="color: #e2e8f0;">${name}</p>
                  <p style="color: #00d4ff; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Email</p>
                  <p><a href="mailto:${email}" style="color: #00d4ff;">${email}</a></p>
                  ${company ? `<p style="color: #00d4ff; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Company</p><p style="color: #e2e8f0;">${company}</p>` : ''}
                  ${phone ? `<p style="color: #00d4ff; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Phone</p><p><a href="tel:${phone}" style="color: #00d4ff;">${phone}</a></p>` : ''}
                  ${service_interest ? `<p style="color: #00d4ff; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Interested In</p><p style="color: #e2e8f0;">${service_interest}</p>` : ''}
                  <div style="background: #1e293b; padding: 20px; border-radius: 8px; margin-top: 20px; border-left: 3px solid #00d4ff;">
                    <p style="color: #00d4ff; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Their Message</p>
                    <p style="color: #e2e8f0;">${message}</p>
                  </div>
                  <div style="text-align: center; margin-top: 20px;">
                    <a href="mailto:${email}?subject=Re: Your enquiry to Advant Flow AI&body=Hi ${name}," style="display: inline-block; background: #00d4ff; color: #0a0e1a; font-weight: bold; padding: 10px 24px; border-radius: 6px; text-decoration: none;">Reply to ${name} →</a>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `,
      });
      console.log("Admin notification sent");
    } catch (notifErr) {
      console.error("Admin notification failed (non-fatal):", notifErr);
    }

    // 3. Trigger AI lead scoring (always runs regardless of email status)
    if (lead_id) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
      const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

      try {
        await fetch(`${supabaseUrl}/functions/v1/score-lead`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${serviceRoleKey}`,
            "x-internal-secret": serviceRoleKey,
          },
          body: JSON.stringify({ lead_id, name, email, company, phone, service_interest, message }),
        });
        console.log("Lead scoring triggered for:", lead_id);
      } catch (err) {
        console.error("Lead scoring trigger failed:", err);
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in send-lead-confirmation:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
