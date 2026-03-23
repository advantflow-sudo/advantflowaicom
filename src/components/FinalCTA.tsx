import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const FinalCTA = () => {
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
          className="relative rounded-3xl bg-gradient-to-br from-primary to-accent p-12 md:p-20 text-center overflow-hidden"
        >
          {/* Background glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.1)_0%,_transparent_70%)]" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm mb-8">
              <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
              <span className="text-xs font-medium text-primary-foreground/80 tracking-wide uppercase">
                7-Day Free Trial • Cancel Anytime
              </span>
            </div>

            <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-primary-foreground tracking-[-0.03em] leading-[1.1] mb-6">
              Start Automating Your<br />Business Today
            </h2>
            <p className="text-lg md:text-xl text-primary-foreground/70 max-w-xl mx-auto mb-10">
              Join hundreds of service businesses already using Advant Flow AI to get more bookings on autopilot.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#pricing">
                <Button
                  size="xl"
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 hover:scale-[1.02] active:scale-[0.98] font-bold group"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </a>
              <a href="#booking">
                <Button
                  variant="glass"
                  size="xl"
                  className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  Book Demo
                </Button>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
