import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Settings, Zap, HeadphonesIcon } from "lucide-react";

const steps = [
  {
    icon: Settings,
    title: "We Install Everything",
    description: "AI chatbot, lead capture, booking system — all configured for your business.",
  },
  {
    icon: Zap,
    title: "It Works Instantly",
    description: "Your AI starts replying to customers and booking jobs from day one.",
  },
  {
    icon: HeadphonesIcon,
    title: "We Handle Support",
    description: "Ongoing updates, tweaks, and support. You focus on your business.",
  },
];

export const Offer = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="container-wide">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-widest mb-4 block">Done For You</span>
          <h2 className="heading-lg mb-6">
            We Set <span className="text-gradient">Everything Up</span> For You
          </h2>
          <p className="body-lg max-w-2xl mx-auto">
            We don't just give you software. We install and configure your entire AI system so it's ready to make you money.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="card-enhanced rounded-2xl p-8 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <step.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
