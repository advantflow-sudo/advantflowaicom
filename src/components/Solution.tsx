import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MessageSquare, Bot, CalendarCheck, ArrowRight } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: MessageSquare,
    title: "Customer sends a message",
    description: "Whether it's a DM, website chat, or enquiry form — we catch every single lead automatically.",
  },
  {
    step: "02",
    icon: Bot,
    title: "AI replies instantly",
    description: "Your AI assistant answers questions, qualifies the lead, and collects their details — in seconds, not hours.",
  },
  {
    step: "03",
    icon: CalendarCheck,
    title: "Customer is booked automatically",
    description: "The lead is converted into a confirmed booking on your calendar. No manual work required.",
  },
];

export const Solution = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-padding relative overflow-hidden bg-secondary/30">
      <div className="container-wide">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-widest mb-4 block">
            The Solution
          </span>
          <h2 className="heading-lg mb-6">
            AdvantFlowAI Fixes This <span className="text-gradient">Automatically</span>
          </h2>
          <p className="body-lg max-w-2xl mx-auto">
            A simple 3-step system that turns every enquiry into a booked customer — without you lifting a finger.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector lines (desktop only) */}
          <div className="hidden md:block absolute top-[5.5rem] left-[33%] right-[33%] h-[2px] bg-gradient-to-r from-primary/40 via-primary to-primary/40" />

          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative"
            >
              <div className="card-enhanced rounded-2xl p-8 text-center relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-6">
                  <step.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <div className="text-xs font-bold text-primary uppercase tracking-widest mb-2">
                  Step {step.step}
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className="flex justify-center my-4 md:hidden">
                  <ArrowRight className="w-6 h-6 text-primary rotate-90" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
