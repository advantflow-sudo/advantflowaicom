import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Globe, LayoutDashboard, Bot, Workflow, ArrowUpRight } from "lucide-react";

const services = [
  {
    icon: Globe,
    tag: "Websites",
    title: "Websites that build trust",
    description:
      "Fast, modern, conversion-focused websites tailored to your brand. Turn visitors into paying customers.",
    features: ["Custom design", "Mobile-first", "SEO-ready", "24-48hr turnaround"],
    accent: "from-[#2563FF] to-[#00D4FF]",
    span: "md:col-span-7 md:row-span-2",
    tone: "primary",
  },
  {
    icon: Bot,
    tag: "AI Assistants",
    title: "Your digital employee",
    description:
      "Answers questions, books appointments, and supports customers 24/7 across every channel.",
    features: ["Sales bots", "Support agents", "Lead capture", "Multi-channel"],
    accent: "from-[#7C3AED] to-[#2563FF]",
    span: "md:col-span-5 md:row-span-2",
    tone: "purple",
  },
  {
    icon: LayoutDashboard,
    tag: "Business Software",
    title: "Custom online software",
    description:
      "Dashboards, CRMs, and portals built around the way your business actually works.",
    features: ["Client portals", "White-label", "Real-time data"],
    accent: "from-[#00D4FF] to-[#2563FF]",
    span: "md:col-span-5 md:row-span-2",
    tone: "cyan",
  },
  {
    icon: Workflow,
    tag: "Automation",
    title: "Let the computer handle repetitive work",
    description:
      "Connect your tools and automate the tasks that eat your day — lead follow-up, invoicing, reporting.",
    features: ["Zapier & n8n", "CRM sync", "Smart triggers", "Zero code required"],
    accent: "from-[#2563FF] via-[#00D4FF] to-[#7C3AED]",
    span: "md:col-span-7 md:row-span-2",
    tone: "primary",
  },
];

const ServiceCard = ({ service, index }: { service: (typeof services)[0]; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const Icon = service.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className={`${service.span} group relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] border border-white/10 bg-card p-8 md:p-10 flex flex-col hover:border-primary/30 transition-all duration-500 hover:-translate-y-1`}
    >
      <div className={`absolute -top-24 -right-24 w-72 h-72 rounded-full blur-[100px] opacity-20 bg-gradient-to-br ${service.accent} pointer-events-none`} />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-start justify-between mb-8">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.accent} flex items-center justify-center shadow-lg shadow-primary/20`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
          <ArrowUpRight className="w-5 h-5 text-white/30 group-hover:text-primary group-hover:-translate-y-1 group-hover:translate-x-1 transition-all duration-300" />
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
          {service.tag}
        </span>
        <h3 className="font-display text-2xl md:text-3xl font-bold mb-3 text-foreground">
          {service.title}
        </h3>
        <p className="text-white/60 mb-6 leading-relaxed">{service.description}</p>

        <ul className="mt-auto space-y-2.5 pt-4 border-t border-white/5">
          {service.features.map((f) => (
            <li key={f} className="flex items-center gap-2.5 text-sm text-white/70">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              {f}
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
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mb-14 md:mb-20"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-widest mb-4 block">
            Our Services
          </span>
          <h2 className="heading-lg mb-6">
            Technology that{" "}
            <span className="bg-gradient-to-r from-[#2563FF] via-[#00D4FF] to-[#7C3AED] bg-clip-text text-transparent">
              works for you
            </span>
          </h2>
          <p className="body-lg">
            Websites, software, AI assistants and automation — designed for UK
            businesses that want to save time, win more customers and grow.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:auto-rows-fr">
          {services.map((s, i) => (
            <ServiceCard key={s.title} service={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};
