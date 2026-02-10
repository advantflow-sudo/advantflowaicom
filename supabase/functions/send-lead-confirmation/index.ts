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
      from: "Advant Flow <hello@advantflow.co.uk>",
      to: [email],
      subject: "Thanks for reaching out to Advant Flow!",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .logo { font-size: 28px; font-weight: bold; color: #0ea5e9; }
              .content { background: #f8fafc; padding: 30px; border-radius: 12px; }
              .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">Advant Flow</div>
              </div>
              <div class="content">
                <h2>Hi ${name},</h2>
                <p>Thank you for getting in touch with us! We've received your message and one of our team members will get back to you within 24 hours.</p>
                <p>In the meantime, feel free to browse our portfolio and see the work we've done for other ambitious brands.</p>
                <p>Best regards,<br><strong>The Advant Flow Team</strong></p>
              </div>
              <div class="footer">
                <p>Web Design + AI Automation | London, UK</p>
                <p>© ${new Date().getFullYear()} Advant Flow Ltd. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Confirmation email sent successfully:", confirmationEmail);

    // Send notification email to the business
    const notificationEmail = await sendEmail({
      from: "Advant Flow Website <hello@advantflow.co.uk>",
      to: ["hello@advantflow.co.uk"],
      subject: `New Lead: ${name} - ${service_interest || "General Inquiry"}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .field { margin-bottom: 15px; }
              .label { font-weight: bold; color: #0ea5e9; }
              .value { margin-top: 5px; }
              .message-box { background: #f1f5f9; padding: 20px; border-radius: 8px; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>🎉 New Lead from Website!</h2>
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
