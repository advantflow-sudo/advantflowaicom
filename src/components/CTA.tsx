import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CTA = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="section-padding relative overflow-hidden">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 60 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="container-wide"
      >
        <motion.div 
          className="relative rounded-[2.5rem] overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          animate={{ 
            boxShadow: isHovered 
              ? '0 48px 100px -24px hsl(var(--primary) / 0.4)' 
              : '0 24px 60px -12px hsl(var(--primary) / 0.25)'
          }}
          transition={{ duration: 0.5 }}
        >
          {/* Background */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary"
            animate={{ 
              backgroundPosition: isHovered ? ['0% 50%', '100% 50%'] : '0% 50%'
            }}
            transition={{ duration: 3, ease: "easeInOut" }}
            style={{ backgroundSize: '200% 200%' }}
          />
          <div className="absolute inset-0 noise opacity-20" />
          
          {/* Animated Shapes */}
          <motion.div
            className="absolute top-0 right-0 w-[500px] h-[500px] bg-foreground/10 rounded-full blur-[100px]"
            animate={{ 
              rotate: 360,
              scale: isHovered ? 1.2 : 1,
            }}
            transition={{ 
              rotate: { duration: 30, repeat: Infinity, ease: "linear" },
              scale: { duration: 0.5 }
            }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-foreground/10 rounded-full blur-[80px]"
            animate={{ 
              rotate: -360,
              scale: isHovered ? 1.2 : 1,
            }}
            transition={{ 
              rotate: { duration: 25, repeat: Infinity, ease: "linear" },
              scale: { duration: 0.5 }
            }}
          />

          {/* Floating particles */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-foreground/20"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 40}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}

          {/* Content */}
          <div className="relative z-10 px-8 md:px-16 py-20 md:py-28 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-foreground/10 backdrop-blur-sm mb-10 border border-foreground/10"
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </motion.div>
              <span className="text-sm font-semibold text-primary-foreground">Limited Spots Available</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-8 leading-[0.95] tracking-[-0.02em]"
            >
              Ready to Transform
              <br />
              Your Digital Presence?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-12 leading-relaxed"
            >
              Book a free 30-minute strategy call and discover how we can help you 
              build a website that converts visitors into paying customers.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-5"
            >
              <Button
                size="xl"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/95 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 font-bold shadow-2xl shadow-background/30 group"
              >
                <span>Book Your Free Call</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
              <span className="text-primary-foreground/60 text-sm font-medium">
                No commitment required
              </span>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="mt-14 flex flex-wrap items-center justify-center gap-8 text-primary-foreground/70"
            >
              {["Free Strategy Call", "24-48hr Response", "Money-Back Guarantee"].map((badge, i) => (
                <motion.span 
                  key={badge}
                  className="flex items-center gap-2.5 text-sm font-medium"
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.8 + i * 0.1 }}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
                  {badge}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};
