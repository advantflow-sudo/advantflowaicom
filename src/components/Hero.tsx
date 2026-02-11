import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedBackground } from "./AnimatedBackground";
import heroImage from "@/assets/hero-image.png";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden noise">
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Radial Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-radial" />

      {/* Hero Image Overlay */}
      <div className="absolute inset-0 z-[1]">
        <img 
          src={heroImage} 
          alt="" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />
      </div>

      <div className="container-wide section-padding relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm mb-10"
          >
            <motion.span 
              className="flex items-center justify-center"
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles className="w-4 h-4 text-primary" />
            </motion.span>
            <span className="text-sm font-medium text-foreground/90">Now accepting new clients for 2026</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="heading-xl mb-8"
          >
            <span className="block">Automate Your Business.</span>
            <span className="text-gradient glow-text">Unlock Your</span>
            <span className="block mt-2">Advantage.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="body-lg max-w-2xl mx-auto mb-14"
          >
            We build high-converting websites and intelligent automation systems 
            that save you 10-100 hours per month. Your growth partner for the digital age.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5"
          >
            <Button variant="hero" size="xl" className="group relative overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">
                Book a Free Strategy Call
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
            </Button>
            <Button variant="glass" size="xl" className="group">
              <Play className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              <span>Watch Our Work</span>
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.9 }}
            className="mt-20 pt-16 border-t border-border/50"
          >
            <p className="text-sm text-muted-foreground mb-10 uppercase tracking-[0.2em] font-medium">
              Trusted by ambitious UK brands
            </p>
            <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
              {["Finsbury", "Thames Digital", "Camden Labs", "Mayfair Co", "Shoreditch Studio"].map((brand, i) => (
                <motion.span 
                  key={brand} 
                  className="font-display text-xl md:text-2xl font-bold text-muted-foreground/50 hover:text-muted-foreground transition-colors duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 + i * 0.1 }}
                >
                  {brand}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-7 h-12 rounded-full border-2 border-muted-foreground/25 flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5], height: ["8px", "16px", "8px"] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 rounded-full bg-primary"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};
