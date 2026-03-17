import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Check, ArrowRight, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { setupProducts, monthlySubscription, webDesignProducts } from "@/lib/subscriptions";

const webPlans = [
  {
    name: "Starter",
    price: webDesignProducts.starter.price,
    priceId: webDesignProducts.starter.price_id,
    description: "Launch your online presence fast — perfect for new businesses & freelancers",
    features: [
      "5-page responsive website",
      "Custom modern design",
      "Mobile-first optimization",
      "Basic SEO setup",
      "Contact form integration",
      "2 rounds of revisions",
      "5-day delivery",
    ],
    popular: false,
  },
  {
    name: "Growth",
    price: webDesignProducts.growth.price,
    priceId: webDesignProducts.growth.price_id,
    description: "Our most popular — a high-converting site built to grow your revenue",
    features: [
      "Up to 10 pages",
      "Premium UI/UX design",
      "Conversion-focused copywriting",
      "Advanced SEO optimization",
      "CMS integration",
      "Analytics & tracking setup",
      "Unlimited revisions",
      "10-day delivery",
      "30-day free support",
    ],
    popular: true,
  },
  {
    name: "Premium",
    price: webDesignProducts.premium.price,
    priceId: webDesignProducts.premium.price_id,
    description: "Full-scale web solution for serious brands ready to dominate",
    features: [
      "Unlimited pages",
      "Complete brand identity",
      "Custom web application",
      "E-commerce ready",
      "API & tool integrations",
      "Priority 24/7 support",
      "Dedicated project manager",
      "Speed & performance tuning",
      "6-month maintenance included",
    ],
    popular: false,
  },
  {
    name: "Custom",
    price: "Quote",
    description: "Bespoke solution tailored to your exact requirements",
    features: [
      "Everything in Premium",
      "Fully custom scope & timeline",
      "Multi-site or enterprise builds",
      "Complex integrations & APIs",
      "Ongoing retainer options",
      "Dedicated team assigned",
      "SLA & priority guarantees",
    ],
    popular: false,
    isCustom: true,
  },
];

const aiPlans = [
  {
    name: "Starter Setup",
    price: "£199",
    period: " one-time",
    priceId: setupProducts.starter.price_id,
    description: "We install your AI system — chatbot, lead capture & booking page",
    features: [
      "AI chatbot installed on your site",
      "Lead capture form setup",
      "Online booking page",
      "Email notifications",
      "Setup in 48 hours",
      "Then just £49/mo",
    ],
    popular: false,
  },
  {
    name: "Growth Setup",
    price: "£299",
    period: " one-time",
    priceId: setupProducts.growth.price_id,
    description: "Full AI system with automations — the most popular choice",
    features: [
      "Everything in Starter",
      "Custom AI training for your business",
      "Automated follow-up sequences",
      "CRM dashboard access",
      "WhatsApp integration",
      "Priority support",
      "Then just £49/mo",
    ],
    popular: true,
  },
  {
    name: "Premium Setup",
    price: "£399",
    period: " one-time",
    priceId: setupProducts.premium.price_id,
    description: "Complete done-for-you AI transformation for your business",
    features: [
      "Everything in Growth",
      "Multi-location support",
      "Advanced analytics dashboard",
      "Dedicated account manager",
      "Custom integrations",
      "Staff training included",
      "Then just £49/mo",
    ],
    popular: false,
  },
  {
    name: "Custom",
    price: "Quote",
    period: "",
    description: "Tailored AI solutions built around your exact needs",
    features: [
      "Everything in Premium",
      "Bespoke AI model training",
      "Custom integrations & APIs",
      "Dedicated engineering team",
      "Flexible billing & retainer",
      "SLA & uptime guarantees",
    ],
    popular: false,
    isCustom: true,
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
  isCustom?: boolean;
}

const PricingCard = ({ plan, index, periodLabel, isAi }: { plan: PlanType; index: number; periodLabel: string; isAi: boolean }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (plan.isCustom) {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (!plan.priceId) return;
    if (!user) {
      window.location.href = "/auth";
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId: plan.priceId, mode: isAi ? "subscription" : "payment" },
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
          <span className={plan.popular ? "text-primary-foreground/70" : "text-muted-foreground"}>
            {plan.period || periodLabel}
          </span>
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
        onClick={handleCheckout}
        disabled={loading}
      >
        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {plan.isCustom ? "Get a Quote" : isAi ? "Subscribe" : "Buy Now"}
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
            Affordable Plans That <span className="text-gradient">Actually Deliver</span>
          </h2>
          <p className="body-lg max-w-2xl mx-auto">
            No hidden fees. No lock-in contracts. Just results-driven solutions at prices that make sense.
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-6 items-start">
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
          💯 100% money-back guarantee. Not happy? Full refund, no questions asked. ⭐ Rated 5/5 by 50+ businesses.
        </motion.p>
      </div>
    </section>
  );
};
