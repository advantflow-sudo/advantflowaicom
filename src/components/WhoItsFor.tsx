import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Scissors, Sparkles, Zap, Wrench, UtensilsCrossed, Home, Paintbrush } from "lucide-react";

const industries = [
  { icon: Scissors, name: "Barbers", description: "Fill every chair, every day" },
  { icon: Sparkles, name: "Salons", description: "Never miss a booking again" },
  { icon: Zap, name: "Electricians", description: "Capture jobs while on-site" },
  { icon: Wrench, name: "Plumbers", description: "Auto-reply to emergency calls" },
  { icon: Home, name: "Cleaning Companies", description: "Scale without extra staff" },
  { icon: UtensilsCrossed, name: "Restaurants", description: "Fill tables automatically" },
  { icon: Paintbrush, name: "Repair Services", description: "Quote faster, win more jobs" },
];

export const WhoItsFor = () => {
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
          <span className="text-primary font-medium text-sm uppercase tracking-widest mb-4 block">
            Who It's For
          </span>
          <h2 className="heading-lg mb-6">
            Built for <span className="text-gradient">Service Businesses</span>
          </h2>
          <p className="body-lg max-w-2xl mx-auto">
            If you run a local business and rely on bookings, AdvantFlowAI was built for you.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
          {industries.map((industry, index) => (
            <motion.div
              key={industry.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="card-enhanced rounded-2xl p-6 text-center group hover:border-primary/30 transition-all hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <industry.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-1 text-sm md:text-base">
                {industry.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                {industry.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
