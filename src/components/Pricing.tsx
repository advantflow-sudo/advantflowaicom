import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Check, ArrowRight, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { subscriptionTiers } from "@/lib/subscriptions";

const webPlans = [
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

const aiPlans = [
  {
    name: "Starter",
    price: subscriptionTiers.starter.price,
    period: "/mo",
    priceId: subscriptionTiers.starter.price_id,
    description: "Essential automation for growing businesses",
    features: [
      "1 automation workflow",
      "Basic AI chatbot",
      "Email integration",
      "Up to 1,000 tasks/month",
      "Email support",
      "48-hour setup",
    ],
    popular: false,
  },
  {
    name: "Growth",
    price: subscriptionTiers.growth.price,
    period: "/mo",
    priceId: subscriptionTiers.growth.price_id,
    description: "Advanced automation for scaling operations",
    features: [
      "5 automation workflows",
      "Custom AI agents",
      "CRM integration",
      "Up to 10,000 tasks/month",
      "Lead pipeline automation",
      "Priority support",
      "24-hour setup",
      "Monthly optimization",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: subscriptionTiers.enterprise.price,
    period: "/mo",
    priceId: subscriptionTiers.enterprise.price_id,
    description: "Full-scale AI transformation for your business",
    features: [
      "Unlimited workflows",
      "Custom AI development",
      "Full API integrations",
      "Unlimited tasks",
      "Dedicated account manager",
      "24/7 support",
      "Custom training",
      "White-label options",
    ],
    popular: false,
  },
];

interface PlanType {
  name: string;
  price: string;
  period?: string;
  priceId?: string;
  description: string;
  features: string[];
  popular: boolean;
}

const PricingCard = ({ plan, index, periodLabel, isAi }: { plan: PlanType; index: number; periodLabel: string; isAi: boolean }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!plan.priceId) return;
    if (!user) {
      window.location.href = "/auth";
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId: plan.priceId },
      });
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch (err: any) {
      toast.error(err.message || "Failed to start checkout");
    } finally {
      setLoading(false);
    }
  };

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
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 px-4 py-2 rounded-full bg-primary-foreground text-primary text-sm font-semibold">
          <Star className="w-4 h-4 fill-current" />
          Most Popular
        </div>
      )}

      <div className="mb-6">
        <h3 className={`font-display text-xl font-semibold mb-2 ${plan.popular ? "text-primary-foreground" : "text-foreground"}`}>
          {plan.name}
        </h3>
        <div className="flex items-baseline gap-1 mb-3">
          <span className={`font-display text-4xl md:text-5xl font-bold ${plan.popular ? "text-primary-foreground" : "text-foreground"}`}>
            {plan.price}
          </span>
          {plan.price !== "Custom" && (
            <span className={plan.popular ? "text-primary-foreground/70" : "text-muted-foreground"}>
              {plan.period || periodLabel}
            </span>
          )}
        </div>
        <p className={plan.popular ? "text-primary-foreground/80" : "text-muted-foreground"}>
          {plan.description}
        </p>
      </div>

      <ul className="space-y-3 mb-8">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${plan.popular ? "bg-primary-foreground/20" : "bg-primary/10"}`}>
              <Check className={`w-3 h-3 ${plan.popular ? "text-primary-foreground" : "text-primary"}`} />
            </div>
            <span className={`text-sm ${plan.popular ? "text-primary-foreground/90" : "text-muted-foreground"}`}>
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <Button
        variant={plan.popular ? "secondary" : "hero"}
        size="lg"
        className={`w-full group ${plan.popular ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90" : ""}`}
        onClick={isAi && plan.priceId ? handleSubscribe : () => { document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : null}
        {isAi && plan.priceId ? "Subscribe" : "Get Started"}
        {!loading && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
      </Button>
    </motion.div>
  );
};

export const Pricing = () => {
  const [activeTab, setActiveTab] = useState<"web" | "ai">("web");
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });

  const plans = activeTab === "web" ? webPlans : aiPlans;
  const periodLabel = activeTab === "web" ? "/project" : "/mo";

  return (
    <section id="pricing" className="section-padding relative overflow-hidden bg-secondary/30">
      <div className="container-wide">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-widest mb-4 block">Pricing</span>
          <h2 className="heading-lg mb-6">
            Investment in Your <span className="text-gradient">Future Success</span>
          </h2>
          <p className="body-lg max-w-2xl mx-auto">
            Transparent pricing with no hidden fees. Choose the plan that fits your ambitions.
          </p>
        </motion.div>

        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-2xl bg-secondary/50 p-1.5 border border-border">
            <button
              onClick={() => setActiveTab("web")}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === "web" ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Web Design
            </button>
            <button
              onClick={() => setActiveTab("ai")}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === "ai" ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              AI Automation
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8 items-start">
          {plans.map((plan, index) => (
            <PricingCard key={`${activeTab}-${plan.name}`} plan={plan} index={index} periodLabel={periodLabel} isAi={activeTab === "ai"} />
          ))}
        </div>

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
