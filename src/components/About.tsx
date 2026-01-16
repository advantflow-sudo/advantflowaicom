import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Award, Users, TrendingUp, Clock } from "lucide-react";

const values = [
  {
    icon: TrendingUp,
    title: "Results-Driven",
    description: "Every pixel serves a purpose. We focus on conversions, not just aesthetics.",
  },
  {
    icon: Clock,
    title: "Lightning Fast",
    description: "24-48 hour turnarounds on designs. We move at the speed of your ambition.",
  },
  {
    icon: Users,
    title: "Partnership Mindset",
    description: "We're not vendors, we're partners invested in your long-term success.",
  },
  {
    icon: Award,
    title: "Excellence Standard",
    description: "Award-winning work that stands out in crowded markets.",
  },
];

export const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="section-padding relative overflow-hidden">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-16 md:gap-24 items-center">
          {/* Left: Image/Visual */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Background Elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl" />
              
              {/* Main Card */}
              <div className="relative h-full rounded-3xl bg-gradient-to-br from-card to-secondary border border-border p-8 md:p-12 flex flex-col justify-center">
                <div className="space-y-8">
                  <div>
                    <span className="text-7xl md:text-8xl font-display font-bold text-gradient">5+</span>
                    <p className="text-muted-foreground mt-2">Years of Excellence</p>
                  </div>
                  
                  <div className="h-px bg-border" />
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <span className="text-3xl md:text-4xl font-display font-bold text-foreground">150+</span>
                      <p className="text-sm text-muted-foreground mt-1">Projects Completed</p>
                    </div>
                    <div>
                      <span className="text-3xl md:text-4xl font-display font-bold text-foreground">50+</span>
                      <p className="text-sm text-muted-foreground mt-1">Happy Clients</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -right-6 px-6 py-4 rounded-2xl bg-primary text-primary-foreground shadow-xl shadow-primary/30"
              >
                <span className="font-display font-bold text-lg">Award Winning</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-primary font-medium text-sm uppercase tracking-widest mb-4 block">
              About AdvantFlow
            </span>
            <h2 className="heading-lg mb-6">
              We're Not Just Designers.{" "}
              <span className="text-gradient">We're Growth Partners.</span>
            </h2>
            <p className="body-lg mb-8">
              Founded on the belief that great design should drive real business results, 
              AdvantFlow combines stunning aesthetics with conversion-focused strategy. 
              We don't just make things look good — we make them work.
            </p>

            {/* Values */}
            <div className="grid sm:grid-cols-2 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-foreground mb-1">
                        {value.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {value.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
