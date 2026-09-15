import { motion } from "framer-motion";
import { ArrowRight, Users, Clock, TrendingUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden pt-24 pb-16 md:pt-28">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/15 blur-[140px]" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[45%] h-[45%] rounded-full bg-[#7C3AED]/15 blur-[140px]" />
      </div>

      <div className="container-wide relative z-10 px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-3 gap-4 md:gap-5 md:auto-rows-fr">
          {/* Main Hero Tile */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="md:col-span-8 md:row-span-2 relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] border border-white/10 bg-card p-8 md:p-14 flex flex-col justify-center"
          >
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-32 -right-24 w-96 h-96 bg-[#7C3AED]/15 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-medium tracking-wider uppercase text-white/70">
                  Built for UK service businesses
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.05] mb-6 tracking-tight">
                Get More Bookings
                <br />
                <span className="bg-gradient-to-r from-[#2563FF] via-[#00D4FF] to-[#7C3AED] bg-clip-text text-transparent">
                  Automatically With AI
                </span>
              </h1>

              <p className="text-white/60 text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
                We install an AI system that replies to customers, captures leads,
                and books jobs for you — automatically, 24/7.
              </p>

              <div className="flex flex-wrap gap-4">
                <a href="#booking">
                  <Button variant="hero" size="xl" className="group">
                    Book a Free Call
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </a>
                <a href="#pricing">
                  <Button variant="glass" size="xl">
                    See Pricing
                  </Button>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Stat: 500+ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="md:col-span-4 relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] border border-white/10 bg-card p-8 flex flex-col justify-between group hover:border-primary/30 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-white/30 text-xs font-bold uppercase tracking-widest">01</span>
            </div>
            <div>
              <div className="text-5xl font-display font-bold text-foreground mb-1">500+</div>
              <div className="text-white/50 text-sm font-medium uppercase tracking-widest">
                Businesses automated
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-primary/5 blur-3xl rounded-full pointer-events-none" />
          </motion.div>

          {/* Stat: 24/7 - Purple accent tile */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="md:col-span-4 relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] p-8 flex flex-col justify-between text-white bg-gradient-to-br from-[#7C3AED] to-[#4C1D95]"
          >
            <div className="absolute top-0 right-0 p-6 opacity-25">
              <Clock className="w-14 h-14" />
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest opacity-80">Always on</span>
            </div>
            <div>
              <div className="text-5xl font-display font-bold">24/7</div>
              <div className="text-white/80 text-sm font-medium uppercase tracking-widest mt-1">
                AI replies active
              </div>
            </div>
          </motion.div>

          {/* Stat: 3x */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="md:col-span-4 relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] border border-white/10 bg-card p-8 flex flex-col justify-between"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-6 bg-primary rounded-full" />
              <span className="text-white/40 text-xs font-bold uppercase tracking-widest">
                Growth
              </span>
            </div>
            <div>
              <div className="text-6xl font-display font-bold bg-gradient-to-br from-white to-white/30 bg-clip-text text-transparent">
                3x
              </div>
              <div className="text-white/60 text-sm mt-2">More bookings for new partners</div>
            </div>
            <TrendingUp className="absolute top-6 right-6 w-6 h-6 text-primary/40" />
          </motion.div>

          {/* Feature strip */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="md:col-span-8 relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] border border-white/10 bg-card p-6 md:p-8 flex items-center gap-6 md:gap-8 group"
          >
            <div className="flex-1 min-w-0">
              <h3 className="text-lg md:text-2xl font-display font-bold mb-1">
                The Flow Method™
              </h3>
              <p className="text-white/50 text-sm md:text-base">
                Find → Launch → Optimise → Win. Live in under 14 days.
              </p>
            </div>
            <div className="hidden sm:flex flex-1 h-16 md:h-20 gap-2 items-end">
              <div className="flex-1 bg-primary/20 rounded-t-lg h-[40%] group-hover:h-[60%] transition-all duration-500" />
              <div className="flex-1 bg-primary/40 rounded-t-lg h-[60%] group-hover:h-[80%] transition-all duration-500 delay-75" />
              <div className="flex-1 bg-[#00D4FF] rounded-t-lg h-[90%] group-hover:h-[100%] transition-all duration-500 delay-150" />
              <div className="flex-1 bg-[#7C3AED] rounded-t-lg h-[70%] group-hover:h-[90%] transition-all duration-500 delay-200" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
