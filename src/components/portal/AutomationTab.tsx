import { useState } from "react";
import { Zap, MessageCircle, CalendarCheck, Clock, Mail, Bot, ToggleLeft, ToggleRight, CheckCircle2, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Workflow {
  id: string;
  title: string;
  description: string;
  icon: any;
  trigger: string;
  action: string;
  enabled: boolean;
  category: "communication" | "booking" | "follow-up";
}

const initialWorkflows: Workflow[] = [
  {
    id: "auto-reply",
    title: "Auto-Reply to New Leads",
    description: "Instantly send a confirmation email when someone submits the contact form, so they know you received their inquiry.",
    icon: MessageCircle,
    trigger: "New lead submitted",
    action: "Send confirmation email",
    enabled: true,
    category: "communication",
  },
  {
    id: "ai-chat-reply",
    title: "AI Chat Auto-Response",
    description: "The AI agent automatically responds to website visitors in real-time, answering questions and guiding them toward booking a call.",
    icon: Bot,
    trigger: "Visitor sends chat message",
    action: "AI generates reply",
    enabled: true,
    category: "communication",
  },
  {
    id: "booking-confirmation",
    title: "Booking Confirmation Email",
    description: "Automatically send a branded confirmation email with calendar link when a visitor books a discovery call.",
    icon: CalendarCheck,
    trigger: "New booking created",
    action: "Send confirmation + calendar invite",
    enabled: true,
    category: "booking",
  },
  {
    id: "booking-reminder",
    title: "24-Hour Booking Reminder",
    description: "Send a reminder email 24 hours before the scheduled call so clients don't forget their appointment.",
    icon: Clock,
    trigger: "24 hours before booking",
    action: "Send reminder email",
    enabled: true,
    category: "booking",
  },
  {
    id: "booking-update",
    title: "Booking Update Notification",
    description: "Notify the customer via email when you cancel or reschedule their booking, with updated details and rebooking links.",
    icon: Mail,
    trigger: "Booking cancelled or rescheduled",
    action: "Send update email to customer",
    enabled: true,
    category: "booking",
  },
  {
    id: "lead-scoring",
    title: "AI Lead Scoring",
    description: "Automatically score new leads based on their message content, company, and service interest using AI analysis.",
    icon: Zap,
    trigger: "New lead submitted",
    action: "AI scores and categorises lead",
    enabled: true,
    category: "follow-up",
  },
];

const categoryLabels: Record<string, { label: string; color: string }> = {
  communication: { label: "Communication", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  booking: { label: "Booking", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  "follow-up": { label: "Follow-up", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
};

export const AutomationTab = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>(initialWorkflows);

  const toggleWorkflow = (id: string) => {
    setWorkflows((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          const next = !w.enabled;
          toast.success(`${w.title} ${next ? "enabled" : "disabled"}`);
          return { ...w, enabled: next };
        }
        return w;
      })
    );
  };

  const enabledCount = workflows.filter((w) => w.enabled).length;

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="card-enhanced rounded-2xl p-4">
          <p className="text-xs text-muted-foreground mb-1">Total Workflows</p>
          <p className="text-2xl font-bold font-display">{workflows.length}</p>
        </div>
        <div className="card-enhanced rounded-2xl p-4">
          <p className="text-xs text-muted-foreground mb-1">Active</p>
          <p className="text-2xl font-bold font-display text-emerald-400">{enabledCount}</p>
        </div>
        <div className="card-enhanced rounded-2xl p-4 hidden md:block">
          <p className="text-xs text-muted-foreground mb-1">Paused</p>
          <p className="text-2xl font-bold font-display text-amber-400">{workflows.length - enabledCount}</p>
        </div>
      </div>

      {/* Workflow cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {workflows.map((w) => {
          const cat = categoryLabels[w.category];
          return (
            <div
              key={w.id}
              className={`card-enhanced rounded-2xl p-5 transition-all ${
                w.enabled ? "border-primary/20" : "opacity-60"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    w.enabled ? "bg-primary/10" : "bg-secondary"
                  }`}>
                    <w.icon className={`w-5 h-5 ${w.enabled ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{w.title}</h4>
                    <Badge variant="outline" className={`text-[10px] mt-1 ${cat.color}`}>
                      {cat.label}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2"
                  onClick={() => toggleWorkflow(w.id)}
                >
                  {w.enabled ? (
                    <ToggleRight className="w-6 h-6 text-primary" />
                  ) : (
                    <ToggleLeft className="w-6 h-6 text-muted-foreground" />
                  )}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                {w.description}
              </p>

              <div className="flex items-center gap-2 text-[11px] text-muted-foreground bg-secondary/50 rounded-lg p-2.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="truncate">{w.trigger}</span>
                <ArrowRight className="w-3 h-3 shrink-0" />
                <span className="truncate">{w.action}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
