import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Palette, Code2, Rocket, LineChart, Zap, Headphones, Bot, Workflow, MessageSquare, Plug, Clock, Users } from "lucide-react";

const webServices = [
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

const aiServices = [
  {
    icon: Workflow,
    title: "AI Automation Systems",
    description: "End-to-end workflow automation that saves 10-100 hours per month. Lead capture to delivery pipelines.",
    features: ["Workflow Automation", "Lead Pipelines", "Multi-Platform Agents", "24/7 Systems"],
  },
  {
    icon: Bot,
    title: "Custom AI Agents",
    description: "Intelligent agents tailored to your business. Sales, support, and data-enhanced bots that work around the clock.",
    features: ["Sales Agents", "Support Agents", "Data-Enhanced Bots", "Custom Training"],
  },
  {
    icon: Plug,
    title: "No-Code Integrations",
    description: "Connect your tools seamlessly with n8n, Zapier, and Make. Build powerful systems without writing code.",
    features: ["n8n & Zapier", "Make Integrations", "Airtable/Notion", "CRM Pipelines"],
  },
  {
    icon: MessageSquare,
    title: "AI Customer Support",
    description: "24/7 intelligent support automation. Triage, respond, and escalate automatically.",
    features: ["AI Triage", "Auto-Reply", "Smart Escalation", "Reporting"],
  },
  {
    icon: Users,
    title: "Sales DM Agents",
    description: "Convert social messages into bookings. Intent detection and smart replies that close deals.",
    features: ["Intent Detection", "Smart Replies", "Auto-Booking", "CRM Updates"],
  },
  {
    icon: Clock,
    title: "API Integrations",
    description: "Connect to OpenAI, Claude, Gemini, Shopify, Stripe, Slack, and more. Unified automation ecosystem.",
    features: ["OpenAI & Claude", "Shopify & Stripe", "Slack Integration", "CRM Systems"],
  },
];

const ServiceCard = ({ service, index }: { service: typeof webServices[0]; index: number }) => {
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
  const aiHeaderRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });
  const isAiHeaderInView = useInView(aiHeaderRef, { once: true, margin: "-100px" });

  return (
    <>
      {/* Web Design Services */}
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
              Web Design & Development
            </span>
            <h2 className="heading-lg mb-6">
              Websites That{" "}
              <span className="text-gradient">Convert</span>
            </h2>
            <p className="body-lg max-w-2xl mx-auto">
              Premium web design and development that transforms visitors into customers.
            </p>
          </motion.div>

          {/* Web Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {webServices.map((service, index) => (
              <ServiceCard key={service.title} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* AI Automation Services */}
      <section id="ai-automation" className="section-padding relative overflow-hidden bg-muted/30">
        <div className="container-wide">
          {/* Section Header */}
          <motion.div
            ref={aiHeaderRef}
            initial={{ opacity: 0, y: 30 }}
            animate={isAiHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16 md:mb-24"
          >
            <span className="text-primary font-medium text-sm uppercase tracking-widest mb-4 block">
              AI Automation
            </span>
            <h2 className="heading-lg mb-6">
              Automate &{" "}
              <span className="text-gradient">Scale</span>
            </h2>
            <p className="body-lg max-w-2xl mx-auto">
              Save 10-100 hours per month with intelligent automation. 24/7 systems that work while you sleep.
            </p>
          </motion.div>

          {/* AI Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {aiServices.map((service, index) => (
              <ServiceCard key={service.title} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
