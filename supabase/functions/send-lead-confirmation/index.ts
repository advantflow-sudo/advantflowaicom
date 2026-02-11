import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface LeadEmailRequest {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  service_interest?: string;
  message: string;
}

interface EmailPayload {
  from: string;
  to: string[];
  subject: string;
  html: string;
}

async function sendEmail(payload: EmailPayload) {
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

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, company, phone, service_interest, message }: LeadEmailRequest = await req.json();

    console.log("Sending confirmation email to:", email);
    console.log("Lead details:", { name, company, phone, service_interest });

    // Send confirmation email to the lead
    const confirmationEmail = await sendEmail({
      from: "AdvantFlowAI <hello@advantflowai.co.uk>",
      to: [email],
      subject: "Thanks for reaching out to AdvantFlowAI!",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: 'Space Grotesk', 'Segoe UI', sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #0a0e1a; color: #e2e8f0; }
              .container { max-width: 600px; margin: 0 auto; padding: 0; }
              .header { background: linear-gradient(135deg, #1a1f4d 0%, #0a0e2a 100%); text-align: center; padding: 40px 20px 30px; border-bottom: 2px solid #00d4ff; }
              .logo { font-size: 28px; font-weight: bold; letter-spacing: -0.5px; }
              .logo-advant { color: #ffffff; }
              .logo-flow { color: #00d4ff; }
              .logo-ai { color: #ffffff; }
              .content { background: #111827; padding: 40px 30px; }
              .content h2 { color: #ffffff; margin-top: 0; }
              .content p { color: #94a3b8; }
              .content strong { color: #00d4ff; }
              .cta-button { display: inline-block; background: linear-gradient(135deg, #00d4ff, #0ea5e9); color: #0a0e1a; font-weight: bold; padding: 12px 28px; border-radius: 8px; text-decoration: none; margin-top: 20px; }
              .footer { background: #0a0e1a; text-align: center; padding: 30px 20px; color: #475569; font-size: 13px; border-top: 1px solid #1e293b; }
              .footer a { color: #00d4ff; text-decoration: none; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo"><span class="logo-advant">Advant</span><span class="logo-flow">Flow</span><span class="logo-ai">AI</span></div>
              </div>
              <div class="content">
                <h2>Hi ${name},</h2>
                <p>Thank you for getting in touch! We've received your message and one of our team will get back to you within <strong>24 hours</strong>.</p>
                <p>In the meantime, feel free to browse our portfolio and see the work we've done for other ambitious brands.</p>
                <a href="https://advantflowai.co.uk" class="cta-button">Visit Our Website →</a>
                <p style="margin-top: 30px;">Best regards,<br><strong>The AdvantFlowAI Team</strong></p>
              </div>
              <div class="footer">
                <p>Web Design + AI Automation | London, UK</p>
                <p>© ${new Date().getFullYear()} AdvantFlowAI Ltd. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Confirmation email sent successfully:", confirmationEmail);

    // Send notification email to the business
    const notificationEmail = await sendEmail({
      from: "AdvantFlowAI Website <hello@advantflowai.co.uk>",
      to: ["hello@advantflowai.co.uk"],
      subject: `New Lead: ${name} - ${service_interest || "General Inquiry"}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: 'Space Grotesk', 'Segoe UI', sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #0a0e1a; color: #e2e8f0; }
              .container { max-width: 600px; margin: 0 auto; }
              .header { background: linear-gradient(135deg, #1a1f4d, #0a0e2a); padding: 30px 20px; text-align: center; border-bottom: 2px solid #00d4ff; }
              .header h2 { color: #ffffff; margin: 0; font-size: 22px; }
              .header h2 span { color: #00d4ff; }
              .body { background: #111827; padding: 30px; }
              .field { margin-bottom: 18px; }
              .label { font-weight: bold; color: #00d4ff; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
              .value { margin-top: 4px; color: #e2e8f0; font-size: 15px; }
              .message-box { background: #1e293b; padding: 20px; border-radius: 8px; margin-top: 20px; border-left: 3px solid #00d4ff; }
              .footer { background: #0a0e1a; text-align: center; padding: 20px; color: #475569; font-size: 12px; border-top: 1px solid #1e293b; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>🎉 New Lead from <span>AdvantFlowAI</span></h2>
              </div>
              <div class="body">
                <div class="field">
                  <div class="label">Name</div>
                  <div class="value">${name}</div>
                </div>
                <div class="field">
                  <div class="label">Email</div>
                  <div class="value">${email}</div>
                </div>
                ${company ? `<div class="field"><div class="label">Company</div><div class="value">${company}</div></div>` : ''}
                ${phone ? `<div class="field"><div class="label">Phone</div><div class="value">${phone}</div></div>` : ''}
                ${service_interest ? `<div class="field"><div class="label">Interested In</div><div class="value">${service_interest}</div></div>` : ''}
                <div class="message-box">
                  <div class="label">Message</div>
                  <div class="value">${message}</div>
                </div>
              </div>
              <div class="footer">
                <p>AdvantFlowAI Lead Notification</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Notification email sent successfully:", notificationEmail);

    return new Response(
      JSON.stringify({ success: true, confirmationEmail, notificationEmail }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-lead-confirmation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
