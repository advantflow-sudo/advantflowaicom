import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Search, Rocket, Gauge, Trophy } from "lucide-react";

const steps = [
  {
    letter: "F",
    icon: Search,
    title: "Find",
    description: "We learn about your business, your customers and what's slowing you down.",
    duration: "Days 1-2",
  },
  {
    letter: "L",
    icon: Rocket,
    title: "Launch",
    description: "We design and build the right solution — website, software, AI, or all three.",
    duration: "Days 3-10",
  },
  {
    letter: "O",
    icon: Gauge,
    title: "Optimise",
    description: "We improve performance and automate tasks so the system keeps getting sharper.",
    duration: "Ongoing",
  },
  {
    letter: "W",
    icon: Trophy,
    title: "Win",
    description: "You save time, get more customers and grow — without adding to your headcount.",
    duration: "Forever",
  },
];

export const Process = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });

  return (
    <section id="process" className="section-padding relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full bg-primary/5 blur-[140px]" />
      </div>

      <div className="container-wide relative">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mb-14 md:mb-20"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-widest mb-4 block">
            The Flow Method™
          </span>
          <h2 className="heading-lg mb-6">
            Our proven{" "}
            <span className="bg-gradient-to-r from-[#2563FF] via-[#00D4FF] to-[#7C3AED] bg-clip-text text-transparent">
              4-step process
            </span>
          </h2>
          <p className="body-lg">
            No jargon, no drawn-out meetings. A clear path from first call to live system in under 14 days.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.letter}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-card p-8 hover:border-primary/30 hover:-translate-y-1 transition-all duration-500"
              >
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2563FF] to-[#00D4FF] flex items-center justify-center font-display font-bold text-2xl text-white shadow-lg shadow-primary/30">
                      {step.letter}
                    </div>
                    <Icon className="w-5 h-5 text-white/40" />
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-display text-2xl font-bold">{step.title}</h3>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                      {step.duration}
                    </span>
                  </div>
                  <p className="text-white/60 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
