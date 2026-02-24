import { motion } from "framer-motion";

const brands = [
  "Web Design", "AI Automation", "White-Label Dashboards", "Custom Agents", 
  "No-Code Systems", "CRM Integration", "Conversion Design", "24/7 Bots", "Any Industry"
];

export const Marquee = () => {
  return (
    <section className="py-12 border-y border-border overflow-hidden bg-secondary/30">
      <div className="relative">
        <motion.div
          className="flex gap-16 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {/* Double the items for seamless loop */}
          {[...brands, ...brands].map((brand, index) => (
            <span
              key={`${brand}-${index}`}
              className="font-display text-2xl md:text-3xl font-bold text-muted-foreground/60 hover:text-primary transition-colors duration-300 cursor-default"
            >
              {brand}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
