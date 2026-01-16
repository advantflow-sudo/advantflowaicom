import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Check, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Starter",
    price: "£1,497",
    description: "Perfect for startups and small businesses looking to make an impact",
    features: [
      "5-page responsive website",
      "Custom UI/UX design",
      "Mobile optimization",
      "Basic SEO setup",
      "Contact form integration",
      "2 rounds of revisions",
      "7-day delivery",
    ],
    popular: false,
  },
  {
    name: "Growth",
    price: "£3,997",
    description: "For businesses ready to scale with a high-converting online presence",
    features: [
      "10-page responsive website",
      "Premium UI/UX design",
      "Conversion-focused copy",
      "Advanced SEO optimization",
      "CMS integration",
      "Analytics dashboard",
      "Unlimited revisions",
      "14-day delivery",
      "30-day support",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Full-scale digital transformation for established brands",
    features: [
      "Unlimited pages",
      "Complete brand identity",
      "Custom web application",
      "E-commerce integration",
      "API integrations",
      "Priority support",
      "Dedicated project manager",
      "Performance optimization",
      "12-month maintenance",
    ],
    popular: false,
  },
];

const PricingCard = ({ plan, index }: { plan: typeof plans[0]; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className={`relative rounded-3xl p-8 ${
        plan.popular
          ? "bg-gradient-to-br from-primary to-accent text-primary-foreground scale-105 shadow-2xl shadow-primary/30"
          : "bg-card border border-border"
      }`}
    >
      {/* Popular Badge */}
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 px-4 py-2 rounded-full bg-primary-foreground text-primary text-sm font-semibold">
          <Star className="w-4 h-4 fill-current" />
          Most Popular
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h3 className={`font-display text-xl font-semibold mb-2 ${
          plan.popular ? "text-primary-foreground" : "text-foreground"
        }`}>
          {plan.name}
        </h3>
        <div className="flex items-baseline gap-1 mb-3">
          <span className={`font-display text-4xl md:text-5xl font-bold ${
            plan.popular ? "text-primary-foreground" : "text-foreground"
          }`}>
            {plan.price}
          </span>
          {plan.price !== "Custom" && (
            <span className={plan.popular ? "text-primary-foreground/70" : "text-muted-foreground"}>
              /project
            </span>
          )}
        </div>
        <p className={plan.popular ? "text-primary-foreground/80" : "text-muted-foreground"}>
          {plan.description}
        </p>
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-8">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
              plan.popular ? "bg-primary-foreground/20" : "bg-primary/10"
            }`}>
              <Check className={`w-3 h-3 ${
                plan.popular ? "text-primary-foreground" : "text-primary"
              }`} />
            </div>
            <span className={`text-sm ${
              plan.popular ? "text-primary-foreground/90" : "text-muted-foreground"
            }`}>
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Button
        variant={plan.popular ? "secondary" : "hero"}
        size="lg"
        className={`w-full group ${
          plan.popular
            ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            : ""
        }`}
      >
        Get Started
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </Button>
    </motion.div>
  );
};

export const Pricing = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });

  return (
    <section id="pricing" className="section-padding relative overflow-hidden bg-secondary/30">
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
            Pricing
          </span>
          <h2 className="heading-lg mb-6">
            Investment in Your{" "}
            <span className="text-gradient">Future Success</span>
          </h2>
          <p className="body-lg max-w-2xl mx-auto">
            Transparent pricing with no hidden fees. Choose the plan that fits your ambitions.
          </p>
        </motion.div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 items-start">
          {plans.map((plan, index) => (
            <PricingCard key={plan.name} plan={plan} index={index} />
          ))}
        </div>

        {/* Money-back Guarantee */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-muted-foreground mt-12"
        >
          💯 100% satisfaction guaranteed. If you're not happy, we'll make it right or refund you.
        </motion.p>
      </div>
    </section>
  );
};
