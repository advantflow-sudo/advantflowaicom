import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
    apiVersion: "2025-08-27.basil",
  });

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      console.error("No Stripe signature found");
      return new Response(JSON.stringify({ error: "No signature" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET not configured");
      return new Response(JSON.stringify({ error: "Webhook secret not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    let event: Stripe.Event;
    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log(`[STRIPE-WEBHOOK] Received event: ${event.type}`);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      // Only process payment mode sessions (not subscriptions)
      if (session.mode !== "payment") {
        console.log("[STRIPE-WEBHOOK] Skipping non-payment session");
        return new Response(JSON.stringify({ received: true }), {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      const projectId = session.metadata?.project_id;
      const amountPaid = (session.amount_total || 0) / 100; // Convert from pence to pounds

      if (!projectId) {
        console.error("[STRIPE-WEBHOOK] No project_id in session metadata");
        return new Response(JSON.stringify({ received: true }), {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      console.log(`[STRIPE-WEBHOOK] Updating project ${projectId} with payment of £${amountPaid}`);

      // Get current project to calculate new amount_paid
      const { data: project, error: fetchError } = await supabaseAdmin
        .from("client_projects")
        .select("amount_paid, total_cost")
        .eq("id", projectId)
        .single();

      if (fetchError || !project) {
        console.error("[STRIPE-WEBHOOK] Failed to fetch project:", fetchError);
        return new Response(JSON.stringify({ error: "Project not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      const currentPaid = Number(project.amount_paid || 0);
      const newAmountPaid = currentPaid + amountPaid;
      const totalCost = Number(project.total_cost || 0);

      // Update amount_paid and status if fully paid
      const updateData: Record<string, unknown> = {
        amount_paid: newAmountPaid,
      };

      if (newAmountPaid >= totalCost) {
        updateData.status = "completed";
      }

      const { error: updateError } = await supabaseAdmin
        .from("client_projects")
        .update(updateData)
        .eq("id", projectId);

      if (updateError) {
        console.error("[STRIPE-WEBHOOK] Failed to update project:", updateError);
        return new Response(JSON.stringify({ error: "Failed to update project" }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      console.log(`[STRIPE-WEBHOOK] Successfully updated project ${projectId}: £${currentPaid} → £${newAmountPaid}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("[STRIPE-WEBHOOK] Unexpected error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
