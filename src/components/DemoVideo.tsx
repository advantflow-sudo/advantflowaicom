import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import {
  MessageCircle, Bot, User, CalendarCheck, CheckCircle2,
  Bell, ArrowRight, Sparkles, Clock, Mail, Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── Animation scene data ───
const scenes = [
  { id: "incoming", duration: 2800 },
  { id: "ai-reply", duration: 3200 },
  { id: "booking", duration: 3000 },
  { id: "confirmed", duration: 3500 },
  { id: "dashboard", duration: 3000 },
] as const;

type SceneId = typeof scenes[number]["id"];

// ─── Reusable phone frame ───
const PhoneFrame = ({ children, label }: { children: React.ReactNode; label: string }) => (
  <div className="relative mx-auto w-[280px] sm:w-[320px]">
    {/* Phone bezel */}
    <div className="rounded-[2rem] border-2 border-border/60 bg-card shadow-2xl shadow-primary/10 overflow-hidden">
      {/* Status bar */}
      <div className="flex items-center justify-between px-6 py-2 bg-secondary/80 border-b border-border/40">
        <span className="text-[10px] text-muted-foreground font-medium">9:41</span>
        <div className="w-16 h-4 rounded-full bg-card/80" />
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-primary/40" />
          <div className="w-3 h-3 rounded-sm bg-primary/30" />
        </div>
      </div>
      {/* App header */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-secondary/50 border-b border-border/30">
        <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
          <Bot className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="text-xs font-semibold text-foreground leading-tight">AdvantFlowAI</p>
          <p className="text-[10px] text-primary leading-tight flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Online
          </p>
        </div>
      </div>
      {/* Content area */}
      <div className="min-h-[320px] sm:min-h-[360px] p-4 flex flex-col justify-end gap-3 bg-gradient-to-b from-card to-card/95">
        {children}
      </div>
    </div>
    {/* Scene label */}
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mt-4"
    >
      <span className="text-xs font-medium text-primary uppercase tracking-widest">{label}</span>
    </motion.div>
  </div>
);

// ─── Chat bubble ───
const ChatBubble = ({
  role,
  text,
  delay = 0,
}: {
  role: "customer" | "ai";
  text: string;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 16, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay: delay / 1000, duration: 0.4, type: "spring", damping: 20 }}
    className={`flex ${role === "customer" ? "justify-end" : "justify-start"} gap-2`}
  >
    {role === "ai" && (
      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
        <Bot className="w-3 h-3 text-primary" />
      </div>
    )}
    <div
      className={`max-w-[85%] px-3.5 py-2 rounded-2xl text-[13px] leading-snug ${
        role === "customer"
          ? "bg-primary text-primary-foreground rounded-br-md"
          : "bg-secondary text-foreground rounded-bl-md"
      }`}
    >
      {text}
    </div>
    {role === "customer" && (
      <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
        <User className="w-3 h-3 text-accent" />
      </div>
    )}
  </motion.div>
);

// ─── Typing indicator ───
const TypingDots = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ delay: delay / 1000 }}
    className="flex items-center gap-2 pl-8"
  >
    <div className="flex gap-1 px-3 py-2 rounded-2xl bg-secondary">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  </motion.div>
);

// ─── Scene: Customer sends message ───
const SceneIncoming = () => (
  <PhoneFrame label="Step 1 — Customer Messages">
    <ChatBubble role="customer" text="Hi! How much for a haircut? Do you have any slots today?" delay={300} />
    <TypingDots delay={1200} />
  </PhoneFrame>
);

// ─── Scene: AI replies instantly ───
const SceneAIReply = () => (
  <PhoneFrame label="Step 2 — AI Replies in Seconds">
    <ChatBubble role="customer" text="Hi! How much for a haircut?" delay={0} />
    <ChatBubble
      role="ai"
      text="Hey! 👋 Haircuts start from £20. We've got slots today at 2pm and 4pm — want me to book you in?"
      delay={400}
    />
    <ChatBubble role="customer" text="Yes, 2pm please!" delay={1400} />
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2 }}
      className="flex items-center gap-1.5 pl-8 text-[10px] text-primary"
    >
      <Sparkles className="w-3 h-3" />
      <span>AI handled this in 3 seconds</span>
    </motion.div>
  </PhoneFrame>
);

// ─── Scene: Booking made ───
const SceneBooking = () => (
  <PhoneFrame label="Step 3 — Booking Created Automatically">
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, type: "spring", damping: 15 }}
      className="bg-secondary/80 rounded-xl p-4 border border-border/50"
    >
      <div className="flex items-center gap-2 mb-3">
        <CalendarCheck className="w-5 h-5 text-primary" />
        <span className="text-sm font-semibold text-foreground">New Booking</span>
      </div>
      <div className="space-y-2 text-xs">
        {[
          { icon: User, label: "John Smith" },
          { icon: Clock, label: "Today, 2:00 PM" },
          { icon: Phone, label: "07700 900123" },
          { icon: Mail, label: "john@example.com" },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + i * 0.15 }}
            className="flex items-center gap-2 text-muted-foreground"
          >
            <item.icon className="w-3.5 h-3.5 text-primary/70" />
            <span>{item.label}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.4 }}
      className="flex items-center gap-1.5 justify-center text-[10px] text-primary"
    >
      <Sparkles className="w-3 h-3" />
      <span>Zero manual work required</span>
    </motion.div>
  </PhoneFrame>
);

// ─── Scene: Confirmation sent ───
const SceneConfirmed = () => (
  <PhoneFrame label="Step 4 — Customer Confirmed Automatically">
    <ChatBubble
      role="ai"
      text="You're all booked! ✅ Haircut at 2:00 PM today. You'll get a reminder text 1 hour before. See you then! ✂️"
      delay={300}
    />
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.2, type: "spring", damping: 12 }}
      className="mx-auto"
    >
      <div className="bg-primary/10 border border-primary/30 rounded-xl px-4 py-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
          <CheckCircle2 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-xs font-semibold text-foreground">Confirmation Sent</p>
          <p className="text-[10px] text-muted-foreground">SMS + Email delivered</p>
        </div>
      </div>
    </motion.div>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2 }}
      className="flex flex-wrap justify-center gap-2"
    >
      {["SMS ✓", "Email ✓", "Calendar ✓", "Reminder Set ✓"].map((tag, i) => (
        <motion.span
          key={tag}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.2 + i * 0.12 }}
          className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20"
        >
          {tag}
        </motion.span>
      ))}
    </motion.div>
  </PhoneFrame>
);

// ─── Scene: Dashboard view ───
const SceneDashboard = () => {
  const stats = [
    { label: "Leads Today", value: "12", icon: MessageCircle },
    { label: "Bookings", value: "8", icon: CalendarCheck },
    { label: "Revenue", value: "£960", icon: Sparkles },
    { label: "Response Time", value: "3s", icon: Clock },
  ];

  return (
    <div className="relative mx-auto w-[280px] sm:w-[320px]">
      <div className="rounded-2xl border border-border/60 bg-card shadow-2xl shadow-primary/10 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-secondary/50 border-b border-border/30">
          <Bell className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-foreground">Your Dashboard</span>
          <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary">Live</span>
        </div>
        <div className="p-4 grid grid-cols-2 gap-2.5">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.15, type: "spring", damping: 18 }}
              className="bg-secondary/60 rounded-xl p-3 border border-border/30"
            >
              <s.icon className="w-3.5 h-3.5 text-primary mb-1.5" />
              <p className="text-lg font-bold text-foreground">{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="px-4 pb-4"
        >
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-center">
            <p className="text-[11px] text-primary font-medium">🎯 All automated — no manual work needed</p>
          </div>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-4"
      >
        <span className="text-xs font-medium text-primary uppercase tracking-widest">
          Step 5 — Everything in One Dashboard
        </span>
      </motion.div>
    </div>
  );
};

const sceneComponents: Record<SceneId, React.FC> = {
  incoming: SceneIncoming,
  "ai-reply": SceneAIReply,
  booking: SceneBooking,
  confirmed: SceneConfirmed,
  dashboard: SceneDashboard,
};

// ─── Progress dots ───
const ProgressDots = ({
  total,
  current,
  onSelect,
}: {
  total: number;
  current: number;
  onSelect: (i: number) => void;
}) => (
  <div className="flex items-center justify-center gap-2 mt-8">
    {Array.from({ length: total }).map((_, i) => (
      <button
        key={i}
        onClick={() => onSelect(i)}
        className={`rounded-full transition-all duration-300 ${
          i === current
            ? "w-8 h-2 bg-primary"
            : "w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
        }`}
      />
    ))}
  </div>
);

// ─── Main component ───
export const DemoVideo = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const advanceScene = useCallback(() => {
    setCurrentScene((prev) => {
      if (prev >= scenes.length - 1) {
        setIsPlaying(false);
        return 0;
      }
      return prev + 1;
    });
  }, []);

  // Auto-play when in view
  useEffect(() => {
    if (isInView && !isPlaying) {
      setIsPlaying(true);
      setCurrentScene(0);
    }
  }, [isInView]);

  // Timer for scene transitions
  useEffect(() => {
    if (!isPlaying) return;
    timerRef.current = setTimeout(advanceScene, scenes[currentScene].duration);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentScene, advanceScene]);

  const handleDotClick = (i: number) => {
    setCurrentScene(i);
    setIsPlaying(true);
  };

  const CurrentSceneComponent = sceneComponents[scenes[currentScene].id];

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="container-wide">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-widest mb-4 block">
            See It In 2 Minutes
          </span>
          <h2 className="heading-lg mb-6">
            Watch How <span className="text-gradient">AdvantFlowAI</span> Works
          </h2>
          <p className="body-lg max-w-2xl mx-auto">
            See the full system in action — from customer message to confirmed booking, all handled by AI.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          {/* Animated scene area */}
          <div className="relative min-h-[480px] sm:min-h-[520px] flex items-center justify-center">
            {/* Glowing background effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />

            <AnimatePresence mode="wait">
              <motion.div
                key={scenes[currentScene].id}
                initial={{ opacity: 0, x: 60, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -60, scale: 0.95 }}
                transition={{ duration: 0.45, type: "spring", damping: 25 }}
                className="relative z-10"
              >
                <CurrentSceneComponent />
              </motion.div>
            </AnimatePresence>
          </div>

          <ProgressDots total={scenes.length} current={currentScene} onSelect={handleDotClick} />

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <a href="#booking">
              <Button variant="hero" size="lg" className="group">
                Book Free Demo
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </a>
            <a href="#pricing">
              <Button variant="glass" size="lg">
                See Pricing
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
