import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Play, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const DemoVideo = () => {
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
          <div className="relative aspect-video rounded-3xl overflow-hidden border border-border bg-card shadow-2xl shadow-primary/5">
            {/* Video placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 flex flex-col items-center justify-center gap-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center cursor-pointer hover:scale-110 hover:bg-primary/20 transition-all duration-300 group">
                <Play className="w-8 h-8 text-primary ml-1 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-center">
                <p className="font-display font-semibold text-foreground text-lg">
                  2-Minute Demo
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  See how businesses get 3x more bookings with AI
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
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
