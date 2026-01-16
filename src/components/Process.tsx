import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MessageSquare, Lightbulb, Palette, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: MessageSquare,
    title: "Discovery Call",
    description: "We dive deep into your business goals, target audience, and vision. This 30-minute call shapes everything we build.",
    duration: "Day 1",
  },
  {
    number: "02",
    icon: Lightbulb,
    title: "Strategy & Wireframing",
    description: "We map out the user journey, create wireframes, and develop a conversion-focused strategy tailored to your market.",
    duration: "Days 2-3",
  },
  {
    number: "03",
    icon: Palette,
    title: "Design & Development",
    description: "Our team brings your vision to life with stunning designs and clean, performant code. You'll see progress daily.",
    duration: "Days 4-10",
  },
  {
    number: "04",
    icon: Rocket,
    title: "Launch & Optimize",
    description: "We launch your site, monitor performance, and continuously optimize for maximum conversions and growth.",
    duration: "Day 11+",
  },
];

const ProcessStep = ({ step, index }: { step: typeof steps[0]; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const Icon = step.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="relative"
    >
      <div className="flex items-start gap-6 md:gap-8">
        {/* Number & Icon */}
        <div className="flex-shrink-0 relative">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
            <Icon className="w-8 h-8 md:w-10 md:h-10 text-primary-foreground" />
          </div>
          <span className="absolute -top-3 -left-3 text-5xl md:text-6xl font-display font-bold text-primary/10">
            {step.number}
          </span>
        </div>

        {/* Content */}
        <div className="pt-2">
          <div className="flex items-center gap-4 mb-2">
            <h3 className="font-display text-xl md:text-2xl font-bold text-foreground">
              {step.title}
            </h3>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
              {step.duration}
            </span>
          </div>
          <p className="text-muted-foreground leading-relaxed max-w-lg">
            {step.description}
          </p>
        </div>
      </div>

      {/* Connector Line */}
      {index < steps.length - 1 && (
        <div className="absolute left-8 md:left-10 top-20 md:top-24 w-0.5 h-16 md:h-20 bg-gradient-to-b from-primary/50 to-transparent" />
      )}
    </motion.div>
  );
};

export const Process = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });

  return (
    <section id="process" className="section-padding relative overflow-hidden bg-secondary/30">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-16 md:gap-24 items-center">
          {/* Left: Header */}
          <motion.div
            ref={headerRef}
            initial={{ opacity: 0, y: 30 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="text-primary font-medium text-sm uppercase tracking-widest mb-4 block">
              Our Process
            </span>
            <h2 className="heading-lg mb-6">
              From Idea to Launch in{" "}
              <span className="text-gradient">Under 2 Weeks</span>
            </h2>
            <p className="body-lg mb-8">
              We've perfected a streamlined process that delivers exceptional results 
              without the endless back-and-forth. Speed meets quality.
            </p>

            {/* Quick Stats */}
            <div className="flex gap-8">
              <div>
                <div className="font-display text-3xl font-bold text-primary mb-1">48hrs</div>
                <div className="text-sm text-muted-foreground">First Design</div>
              </div>
              <div>
                <div className="font-display text-3xl font-bold text-primary mb-1">10-14</div>
                <div className="text-sm text-muted-foreground">Days to Launch</div>
              </div>
              <div>
                <div className="font-display text-3xl font-bold text-primary mb-1">∞</div>
                <div className="text-sm text-muted-foreground">Revisions</div>
              </div>
            </div>
          </motion.div>

          {/* Right: Steps */}
          <div className="space-y-12 md:space-y-16">
            {steps.map((step, index) => (
              <ProcessStep key={step.number} step={step} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
