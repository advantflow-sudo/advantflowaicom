import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
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

  // Internal-only: require shared secret matching the service role key.
  // This function is invoked server-to-server by send-lead-confirmation.
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const provided = req.headers.get("x-internal-secret") ?? "";
  if (!serviceRoleKey || provided !== serviceRoleKey) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    serviceRoleKey
  );

  try {
    const { lead_id, name, email, company, phone, service_interest, message } = await req.json();

    // Validate lead exists and email matches to prevent arbitrary lead corruption
    if (!lead_id || !email) {
      return new Response(JSON.stringify({ error: "Missing lead_id or email" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { data: leadRow } = await supabase
      .from("leads")
      .select("id, email")
      .eq("id", lead_id)
      .maybeSingle();
    if (!leadRow || leadRow.email !== email) {
      return new Response(JSON.stringify({ error: "Lead not found or mismatched" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    // Use AI to score the lead
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          {
            role: "system",
            content: `You are a lead scoring assistant for Advant Flow AI, a web design and AI automation agency based in London, UK.

Score leads from 1-100 based on:
- Service interest alignment (Web Design, AI Automation, Full Package = higher)
- Message quality and detail (specific project details = higher)
- Company provided (yes = +15 points)
- Phone provided (yes = +10 points)  
- Budget signals in message (mentions of budget, timeline, urgency = higher)
- Business size indicators (team size, revenue mentions = higher)

You MUST respond using the score_lead tool.`
          },
          {
            role: "user",
            content: `Score this lead:
Name: ${name}
Email: ${email}
Company: ${company || "Not provided"}
Phone: ${phone || "Not provided"}
Service Interest: ${service_interest || "Not specified"}
Message: ${message}`
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "score_lead",
              description: "Score a lead and provide reasoning",
              parameters: {
                type: "object",
                properties: {
                  score: { type: "number", description: "Lead score from 1-100" },
                  status: { 
                    type: "string", 
                    enum: ["hot", "warm", "cold"],
                    description: "hot = 70-100, warm = 40-69, cold = 1-39" 
                  },
                  reason: { type: "string", description: "Brief explanation of the score in 1-2 sentences" }
                },
                required: ["score", "status", "reason"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "score_lead" } }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI scoring error:", aiResponse.status, errorText);
      // Fallback: basic scoring
      const fallbackScore = calculateFallbackScore({ company, phone, service_interest, message });
      await updateLeadScore(supabase, lead_id, fallbackScore.score, fallbackScore.status, fallbackScore.reason);
      return new Response(JSON.stringify(fallbackScore), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    
    let scoreResult;
    if (toolCall?.function?.arguments) {
      scoreResult = JSON.parse(toolCall.function.arguments);
    } else {
      // Fallback
      scoreResult = calculateFallbackScore({ company, phone, service_interest, message });
    }

    // Update lead in database
    await updateLeadScore(supabase, lead_id, scoreResult.score, scoreResult.status, scoreResult.reason);

    console.log(`Lead ${lead_id} scored: ${scoreResult.score} (${scoreResult.status})`);

    return new Response(JSON.stringify(scoreResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Score lead error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function updateLeadScore(supabase: any, leadId: string, score: number, status: string, reason: string) {
  const { error } = await supabase
    .from("leads")
    .update({ lead_score: score, lead_status: status, score_reason: reason })
    .eq("id", leadId);
  
  if (error) console.error("Failed to update lead score:", error);
}

function calculateFallbackScore(lead: { company?: string; phone?: string; service_interest?: string; message: string }) {
  let score = 30; // base score
  if (lead.company) score += 15;
  if (lead.phone) score += 10;
  if (lead.service_interest?.includes("Full Package")) score += 20;
  else if (lead.service_interest?.includes("AI")) score += 15;
  else if (lead.service_interest?.includes("Web")) score += 10;
  if (lead.message.length > 100) score += 10;
  if (lead.message.length > 250) score += 5;
  
  score = Math.min(score, 100);
  const status = score >= 70 ? "hot" : score >= 40 ? "warm" : "cold";
  return { score, status, reason: "Scored using rule-based fallback" };
}
