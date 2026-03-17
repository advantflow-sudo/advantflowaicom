import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { MessageCircle, Calendar, UserPlus, BarChart3, Bot, User, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const demoTabs = [
  { id: "chat", label: "AI Chat", icon: MessageCircle },
  { id: "booking", label: "Instant Booking", icon: Calendar },
  { id: "leads", label: "Lead Capture", icon: UserPlus },
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
] as const;

type DemoTab = typeof demoTabs[number]["id"];

const chatMessages = [
  { role: "customer" as const, text: "How much is a haircut?", delay: 0 },
  { role: "ai" as const, text: "Our haircuts start from £20. Would you like to book an appointment? We have slots available today at 2pm and 4pm.", delay: 1200 },
  { role: "customer" as const, text: "Yes, 2pm please!", delay: 2800 },
  { role: "ai" as const, text: "Great! I've booked you in for 2pm today. You'll receive a confirmation text shortly. See you then! ✂️", delay: 4200 },
];

const ChatDemo = () => {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (visibleCount >= chatMessages.length) return;
    const timer = setTimeout(() => setVisibleCount((c) => c + 1), chatMessages[visibleCount].delay || 800);
    return () => clearTimeout(timer);
  }, [visibleCount]);

  return (
    <div className="space-y-3 p-1">
      {chatMessages.slice(0, visibleCount).map((msg, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex ${msg.role === "customer" ? "justify-end" : "justify-start"} gap-2`}
        >
          {msg.role === "ai" && (
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
              <Bot className="w-4 h-4 text-primary" />
            </div>
          )}
          <div
            className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
              msg.role === "customer"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-foreground"
            }`}
          >
            {msg.text}
          </div>
          {msg.role === "customer" && (
            <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-1">
              <User className="w-4 h-4 text-accent" />
            </div>
          )}
        </motion.div>
      ))}
      {visibleCount < chatMessages.length && (
        <div className="flex items-center gap-2 text-muted-foreground text-xs">
          <span className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
          </span>
        </div>
      )}
    </div>
  );
};

const BookingDemo = () => {
  const [step, setStep] = useState(0);
  const times = ["10:00 AM", "11:30 AM", "2:00 PM", "3:30 PM"];

  return (
    <div className="space-y-4">
      {step === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          <p className="text-sm text-muted-foreground">Available times for today:</p>
          <div className="grid grid-cols-2 gap-2">
            {times.map((t) => (
              <button
                key={t}
                onClick={() => setStep(1)}
                className="px-4 py-3 rounded-xl bg-secondary border border-border text-sm font-medium text-foreground hover:border-primary hover:bg-primary/5 transition-all"
              >
                {t}
              </button>
            ))}
          </div>
        </motion.div>
      )}
      {step === 1 && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4 py-4">
          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
            <Check className="w-8 h-8 text-green-500" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Booking Confirmed!</p>
            <p className="text-sm text-muted-foreground mt-1">Today at 2:00 PM</p>
            <p className="text-xs text-muted-foreground mt-2">✅ Confirmation sent automatically</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setStep(0)}>Try Again</Button>
        </motion.div>
      )}
    </div>
  );
};

const LeadDemo = () => {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-4 py-4">
        <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
          <Check className="w-8 h-8 text-green-500" />
        </div>
        <p className="font-semibold text-foreground">Lead Captured!</p>
        <p className="text-xs text-muted-foreground">Saved to CRM • Follow-up email sent • Lead scored by AI</p>
        <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>Try Again</Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {[
          { label: "Name", value: "John Smith", type: "text" },
          { label: "Phone", value: "07700 900123", type: "tel" },
          { label: "Email", value: "john@example.com", type: "email" },
        ].map((f) => (
          <div key={f.label}>
            <label className="text-xs text-muted-foreground mb-1 block">{f.label}</label>
            <input
              readOnly
              value={f.value}
              className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground"
            />
          </div>
        ))}
      </div>
      <Button variant="hero" size="sm" className="w-full" onClick={() => setSubmitted(true)}>
        Capture Lead
      </Button>
    </div>
  );
};

const DashboardDemo = () => {
  const stats = [
    { label: "Leads Today", value: "12", change: "+3" },
    { label: "Bookings", value: "8", change: "+2" },
    { label: "Messages", value: "47", change: "+15" },
    { label: "Revenue", value: "£960", change: "+£240" },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {stats.map((s) => (
          <div key={s.label} className="p-3 rounded-xl bg-secondary border border-border">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-green-400">↑ {s.change}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const demoContent: Record<DemoTab, () => JSX.Element> = {
  chat: ChatDemo,
  booking: BookingDemo,
  leads: LeadDemo,
  dashboard: DashboardDemo,
};

export const LiveDemo = () => {
  const [activeTab, setActiveTab] = useState<DemoTab>("chat");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const ActiveDemo = demoContent[activeTab];

  return (
    <section id="demo" className="section-padding relative overflow-hidden bg-secondary/30">
      <div className="container-wide">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-widest mb-4 block">See It In Action</span>
          <h2 className="heading-lg mb-6">
            Watch AI <span className="text-gradient">Work For You</span>
          </h2>
          <p className="body-lg max-w-2xl mx-auto">
            See exactly how AdvantFlowAI handles customers, captures leads, and books appointments — automatically.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-lg mx-auto"
        >
          <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-2xl shadow-primary/5">
            {/* Tab bar */}
            <div className="flex border-b border-border overflow-x-auto">
              {demoTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 text-xs font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? "text-primary border-b-2 border-primary bg-primary/5"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Demo content */}
            <div className="p-6 min-h-[280px]">
              <ActiveDemo key={activeTab} />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
