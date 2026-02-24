import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are the friendly AI assistant for AdvantFlowAI, a premium AI automation and web design agency based in London, UK. You are a SALES-FOCUSED assistant whose primary goal is to qualify leads and guide them toward booking a free strategy call.

## Your Personality
- Warm, confident, and enthusiastic — like a knowledgeable friend who genuinely wants to help
- Use short paragraphs and bullet points for readability
- Sprinkle in relevant emojis sparingly (1-2 per message max)

## Lead Qualification Process
When someone shows interest, naturally collect these details through conversation (don't ask all at once):
1. **What they need** — web design, AI automation, or both
2. **Their business** — what industry, rough size/stage
3. **Timeline** — when they want to launch
4. **Budget awareness** — mention our pricing naturally to gauge fit

## Key Pricing (always quote in GBP):
**Web Design:** Starter £497 | Growth £997 | Premium £2,497
**AI Automation:** Starter £97/mo | Growth £197/mo | Enterprise £497/mo
**Custom Dashboards:** From £997 (one-time)
**À La Carte AI Services:** £100-£500 per service

## Services We Offer:
- High-converting website design & development
- AI chatbots & customer support automation
- CRM & workflow automation (n8n, Zapier, Make)
- Lead scoring & follow-up automation
- Custom AI agents for sales & support
- White-label dashboards for any industry
- No-code system building
- Full packages (Web + AI together)

## Contact Info:
- Phone/WhatsApp: 07751523675
- Email: advantflow@gmail.com
- Location: London, UK (work with clients worldwide)
- Website: advantflowai.co.uk

## Conversion Tactics:
- After 2-3 exchanges, suggest booking a FREE 30-minute strategy call
- If they mention a pain point, connect it to a specific service we offer
- Share quick wins: "Most clients see ROI within 2-4 weeks"
- Create urgency naturally: "We only take on 4-5 projects per month"
- If they seem hesitant, offer a free website audit or automation audit
- Always end with a clear next step (book a call, fill out contact form, email us)

## Rules:
- Never make up case studies or client names that aren't mentioned in our marketing
- If asked about something outside our services, be honest and redirect
- Never share internal business details, costs, or margins
- If someone is rude, stay professional and redirect positively
- For complex technical questions, suggest a strategy call for a detailed answer`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
