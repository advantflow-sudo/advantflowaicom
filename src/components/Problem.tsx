import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Clock, PhoneOff, Cog } from "lucide-react";

const painPoints = [
  {
    icon: Clock,
    title: "Slow replies lose leads",
    description: "If you don't reply within 5 minutes, 78% of customers go to your competitor. Can you reply that fast every time?",
  },
  {
    icon: PhoneOff,
    title: "Missed calls = lost money",
    description: "Every missed call is a paying customer gone. You can't answer the phone while you're on a job.",
  },
  {
    icon: Cog,
    title: "No automation = wasted time",
    description: "You're spending hours on admin, follow-ups, and scheduling instead of doing the work that makes you money.",
  },
];

export const Problem = () => {
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
          <span className="text-destructive font-medium text-sm uppercase tracking-widest mb-4 block">
            The Problem
          </span>
          <h2 className="heading-lg mb-6">
            You're Losing Customers <span className="text-gradient">Every Day</span>
          </h2>
          <p className="body-lg max-w-2xl mx-auto">
            While you're busy working, potential customers are messaging, calling, and moving on — to your competitors.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {painPoints.map((point, index) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="card-enhanced rounded-2xl p-8 text-center group hover:border-destructive/30 transition-colors"
            >
              <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-destructive/20 transition-colors">
                <point.icon className="w-7 h-7 text-destructive" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                {point.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {point.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
