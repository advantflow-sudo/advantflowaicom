import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are the AI sales assistant for AdvantFlowAI. Your job is to help visitors understand what we do and guide them to sign up.

## How you talk
- Short sentences. Easy words. No jargon.
- Friendly and helpful. Like texting a mate who knows business.
- Max 2-3 sentences per reply unless they ask for detail.
- Use 1 emoji max per message.

## What we do
AdvantFlowAI is a done-for-you AI system for service businesses.
We install AI that replies to customers, captures leads, and books jobs automatically.
The business owner doesn't need to do anything technical. We set it all up.

## Who it's for
Barbers, salons, electricians, plumbers, cleaners, restaurants, repair companies.
Any local service business that gets customer enquiries.

## How it works
1. Customer messages the business
2. Our AI replies instantly
3. Lead is captured and booking is made automatically
No missed calls. No lost customers. Works 24/7.

## Pricing
Setup fee (one-time): Starter £199 | Growth £299 | Premium £399
Then just £49/month for everything.
7-day free trial. Cancel anytime.

## What's included
- AI chatbot that replies to customers instantly
- Lead capture (name, phone, email)
- Online booking system
- Automated follow-ups and reminders
- CRM dashboard to see all leads and bookings
- We set everything up for you

## Contact
Phone/WhatsApp: +4407751523675
Email: advantflow@gmail.com
Location: London, UK (work with clients worldwide)
Website: advantflowai.co.uk

## Your sales approach
1. Find out what business they run
2. Ask what their biggest problem is (missed calls? slow replies? no bookings?)
3. Show how AdvantFlowAI fixes that specific problem
4. When they seem interested, suggest they sign up for the free trial
5. When suggesting signup, ALWAYS include this exact text on its own line: [SHOW_SIGNUP_BUTTON]

## Rules
- Keep it simple. These are busy business owners, not techies.
- If they ask something you don't know, say "Great question! Sign up for a free trial and we'll walk you through everything."
- Never make up client names or case studies.
- When someone says they want to try it, sign up, get started, or start a trial → include [SHOW_SIGNUP_BUTTON]
- After 3-4 messages, naturally suggest trying the free trial.`;

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
