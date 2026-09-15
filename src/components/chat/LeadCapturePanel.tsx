import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { routeLead } from "@/lib/lead-routing";

const INTERESTS = ["Website", "Web App", "AI Automation", "Social Media", "Not sure yet"];

/**
 * Lead-capture form shown inside the chat panel.
 * Saves the lead, triggers the confirmation + notification emails, and sends
 * the lead to the unified webhook (see src/lib/lead-routing.ts).
 */
export const LeadCapturePanel = ({ onDone }: { onDone?: () => void }) => {
  const [interest, setInterest] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setSending(true);
    const leadId = crypto.randomUUID();
    const details = message.trim() || `Chat widget enquiry about ${interest || "our services"}.`;

    try {
      await supabase.from("leads").insert({
        id: leadId,
        name: name.trim(),
        email: email.trim(),
        service_interest: interest || null,
        message: details,
      });

      // Confirmation email to the visitor + notification to info@advantflowai.com
      supabase.functions
        .invoke("send-lead-confirmation", {
          body: {
            lead_id: leadId,
            source: "advantflowai.com chat widget",
            name: name.trim(),
            email: email.trim(),
            service_interest: interest || undefined,
            message: details,
          },
        })
        .catch((err) => console.error("Confirmation email failed (non-blocking):", err));

      // Unified lead routing (CRM / Zapier / Make / n8n)
      routeLead({ name: name.trim(), email: email.trim(), interest, message: details, source: "chat widget" });
    } catch (err) {
      console.error("Lead capture failed (non-blocking):", err);
    } finally {
      setSending(false);
      setSent(true);
      onDone?.();
    }
  };

  if (sent) {
    return (
      <div className="p-6 text-center space-y-3">
        <CheckCircle2 className="w-10 h-10 mx-auto text-primary" />
        <p className="font-display font-semibold text-foreground">
          Thanks, {name.trim().split(" ")[0] || "there"}!
        </p>
        <p className="text-sm text-muted-foreground">
          We've got your message and will be in touch shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-3">
      <p className="text-sm text-muted-foreground">Hi 👋 What can we help you with?</p>

      <div className="flex flex-wrap gap-2">
        {INTERESTS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setInterest(item === interest ? "" : item)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              interest === item
                ? "bg-primary text-primary-foreground border-primary"
                : "border-primary/30 bg-primary/5 text-primary hover:bg-primary/10"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        required
        className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        required
        className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Tell us more (optional)"
        rows={3}
        className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
      />

      <Button type="submit" variant="hero" size="sm" className="w-full gap-2" disabled={sending}>
        {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        Send message
      </Button>
    </form>
  );
};
