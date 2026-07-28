import { motion } from "framer-motion";
import { MessageCircle, Zap, ShieldCheck, Settings2, BarChart3, LifeBuoy } from "lucide-react";

const reasons = [
  {
    icon: MessageCircle,
    title: "No Jargon",
    description: "We explain everything in plain English. No confusing tech-speak, ever.",
  },
  {
    icon: Zap,
    title: "Fast & Reliable",
    description: "Quick communication, on time, every time. Most projects live in under 14 days.",
  },
  {
    icon: ShieldCheck,
    title: "Honest Advice",
    description: "We recommend what you actually need — not what pads our invoice.",
  },
  {
    icon: Settings2,
    title: "Tailored Solutions",
    description: "Everything we build is designed around the way your business works.",
  },
  {
    icon: BarChart3,
    title: "Results Focused",
    description: "We build solutions that deliver real, measurable business results.",
  },
  {
    icon: LifeBuoy,
    title: "Ongoing Support",
    description: "We're here when you need us — long after the project goes live.",
  },
];

export const WhyChoose = () => {
  return (
    <section id="about" className="section-padding relative overflow-hidden">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mb-14 md:mb-20"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-widest mb-4 block">
            Why choose Advant Flow
          </span>
          <h2 className="heading-lg mb-6">
            Serious craft.{" "}
            <span className="bg-gradient-to-r from-[#2563FF] via-[#00D4FF] to-[#7C3AED] bg-clip-text text-transparent">
              No nonsense.
            </span>
          </h2>
          <p className="body-lg">
            Six reasons UK businesses trust us to build the technology that runs their day.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reasons.map((r, i) => {
            const Icon = r.icon;
            return (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.06 }}
                className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-card p-8 hover:border-primary/30 hover:-translate-y-1 transition-all duration-500"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl font-bold mb-2">{r.title}</h3>
                <p className="text-white/60 leading-relaxed text-sm">{r.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
