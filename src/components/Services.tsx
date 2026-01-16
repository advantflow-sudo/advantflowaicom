import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Palette, Code2, Rocket, LineChart, Zap, Headphones } from "lucide-react";

const services = [
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "Stunning interfaces that captivate users and drive engagement. Custom designs tailored to your brand.",
    features: ["User Research", "Wireframing", "Prototyping", "Design Systems"],
  },
  {
    icon: Code2,
    title: "Web Development",
    description: "Lightning-fast, responsive websites built with cutting-edge technology for optimal performance.",
    features: ["React & Next.js", "Responsive Design", "SEO Optimization", "CMS Integration"],
  },
  {
    icon: Rocket,
    title: "Brand Strategy",
    description: "Define your market position and create a compelling brand story that resonates with your audience.",
    features: ["Brand Identity", "Logo Design", "Style Guides", "Messaging"],
  },
  {
    icon: LineChart,
    title: "Conversion Optimization",
    description: "Data-driven strategies to turn visitors into paying customers and maximize your ROI.",
    features: ["A/B Testing", "Analytics", "Funnel Optimization", "Landing Pages"],
  },
  {
    icon: Zap,
    title: "Rapid Delivery",
    description: "24-48 hour turnaround on most projects. We move fast without sacrificing quality.",
    features: ["Quick Iterations", "Agile Process", "Daily Updates", "Fast Launches"],
  },
  {
    icon: Headphones,
    title: "Ongoing Support",
    description: "We don't disappear after launch. Continuous support and maintenance to keep you growing.",
    features: ["24/7 Support", "Monthly Updates", "Performance Monitoring", "Content Updates"],
  },
];

const ServiceCard = ({ service, index }: { service: typeof services[0]; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const Icon = service.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5"
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        {/* Icon */}
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-7 h-7 text-primary-foreground" />
        </div>

        {/* Title */}
        <h3 className="font-display text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
          {service.title}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground mb-6 leading-relaxed">
          {service.description}
        </p>

        {/* Features */}
        <ul className="space-y-2">
          {service.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export const Services = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });

  return (
    <section id="services" className="section-padding relative overflow-hidden">
      <div className="container-wide">
        {/* Section Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-24"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-widest mb-4 block">
            What We Do
          </span>
          <h2 className="heading-lg mb-6">
            Services That{" "}
            <span className="text-gradient">Drive Results</span>
          </h2>
          <p className="body-lg max-w-2xl mx-auto">
            From concept to launch and beyond, we provide everything you need to dominate your market.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
