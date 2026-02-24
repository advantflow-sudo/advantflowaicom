import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { 
  LayoutDashboard, HeartPulse, GraduationCap, Building2, 
  ShoppingBag, Truck, Scale, Utensils, ArrowRight, CheckCircle2, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DashboardMockup } from "@/components/DashboardMockup";

const DASHBOARD_PRICE_ID = "price_1T4Fp8C1I7VBCNgysIV03mAB";

const industries = [
  { icon: HeartPulse, name: "Healthcare", desc: "Patient portals & analytics" },
  { icon: GraduationCap, name: "Education", desc: "Student dashboards & LMS" },
  { icon: Building2, name: "Real Estate", desc: "Property & tenant portals" },
  { icon: ShoppingBag, name: "E-Commerce", desc: "Orders & inventory" },
  { icon: Truck, name: "Logistics", desc: "Fleet tracking & KPIs" },
  { icon: Scale, name: "Legal", desc: "Case & client management" },
  { icon: Utensils, name: "Hospitality", desc: "Bookings & revenue" },
  { icon: LayoutDashboard, name: "Any Industry", desc: "Fully custom for you" },
];

const features = [
  "Fully white-labelled under your brand",
  "Responsive on all devices",
  "Real-time data & analytics",
  "Role-based access control",
  "API integrations included",
  "Ongoing support & updates",
];

export const Dashboards = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      window.location.href = "/auth";
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId: DASHBOARD_PRICE_ID, mode: "payment" },
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
    <section id="dashboards" className="section-padding relative overflow-hidden">
      <div className="container-wide">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-widest mb-4 block">
            White-Label Dashboards
          </span>
          <h2 className="heading-lg mb-6">
            Custom Dashboards for{" "}
            <span className="text-gradient">Any Industry</span>
          </h2>
          <p className="body-lg max-w-2xl mx-auto">
            Fully branded dashboards, built to your spec. Your brand, your data, 
            your clients — powered by us.
          </p>
        </motion.div>

        {/* Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16 relative"
          style={{ perspective: "1200px" }}
        >
          {/* Glow effect */}
          <div className="absolute -inset-4 md:-inset-8 rounded-3xl bg-gradient-to-br from-primary/20 via-accent/15 to-primary/10 blur-2xl md:blur-3xl opacity-60 pointer-events-none" />
          <motion.div
            animate={{ 
              rotateX: [0, 1.5, 0, -1, 0],
              rotateY: [0, -2, 0, 1.5, 0],
              y: [0, -8, 0, -4, 0],
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            style={{ transformStyle: "preserve-3d" }}
            className="relative"
          >
            <div className="shadow-[0_0_60px_-10px_hsl(var(--primary)/0.3)] rounded-2xl">
              <DashboardMockup />
            </div>
          </motion.div>
        </motion.div>

        {/* Industries Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-16">
          {industries.map((industry, index) => {
            const Icon = industry.icon;
            return (
              <motion.div
                key={industry.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group p-5 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300 text-center"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display font-semibold text-foreground text-sm mb-0.5 group-hover:text-primary transition-colors">
                  {industry.name}
                </h3>
                <p className="text-xs text-muted-foreground">{industry.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Pricing + Features Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto rounded-2xl bg-card border border-border p-8 md:p-12"
        >
          {/* Price */}
          <div className="text-center mb-8">
            <div className="flex items-baseline justify-center gap-2 mb-2">
              <span className="text-muted-foreground text-sm font-medium">From</span>
              <span className="font-display text-5xl md:text-6xl font-bold text-foreground">£997</span>
            </div>
            <p className="text-muted-foreground text-sm">One-time payment · Fully custom · No monthly fees</p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {features.map((feature) => (
              <div key={feature} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="hero"
              size="xl"
              onClick={handleCheckout}
              disabled={loading}
              className="group w-full sm:w-auto"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Get Started — £997
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </Button>
            <a href="#contact" className="w-full sm:w-auto">
              <Button variant="glass" size="xl" className="w-full">
                Request Custom Quote
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
