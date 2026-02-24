import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { 
  LayoutDashboard, HeartPulse, GraduationCap, Building2, 
  ShoppingBag, Truck, Scale, Utensils, ArrowRight, CheckCircle2, Loader2,
  Dumbbell, Factory, Landmark, Plane, Leaf, Car, Palette, Wifi
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DashboardMockup } from "@/components/DashboardMockup";

const DASHBOARD_PRICE_ID = "price_1T4Fp8C1I7VBCNgysIV03mAB";

const industries = [
  { icon: HeartPulse, name: "Healthcare", desc: "Patient portals & analytics", features: ["Patient intake forms", "Appointment scheduling", "Lab results viewer", "HIPAA-compliant dashboards"] },
  { icon: GraduationCap, name: "Education", desc: "Student dashboards & LMS", features: ["Grade tracking", "Attendance monitoring", "Course management", "Parent portal access"] },
  { icon: Building2, name: "Real Estate", desc: "Property & tenant portals", features: ["Listing management", "Tenant payments", "Maintenance requests", "Occupancy analytics"] },
  { icon: ShoppingBag, name: "E-Commerce", desc: "Orders & inventory", features: ["Order management", "Stock alerts", "Sales analytics", "Customer segmentation"] },
  { icon: Truck, name: "Logistics", desc: "Fleet tracking & KPIs", features: ["Live GPS tracking", "Route optimization", "Delivery ETAs", "Driver performance"] },
  { icon: Scale, name: "Legal", desc: "Case & client management", features: ["Case tracking", "Time & billing", "Document vault", "Client portal"] },
  { icon: Utensils, name: "Hospitality", desc: "Bookings & revenue", features: ["Reservation system", "Table management", "Revenue forecasting", "Guest profiles"] },
  { icon: Dumbbell, name: "Fitness", desc: "Members & scheduling", features: ["Class bookings", "Member check-ins", "Trainer scheduling", "Revenue tracking"] },
  { icon: Factory, name: "Manufacturing", desc: "Production & quality", features: ["Production lines", "Quality control", "Equipment uptime", "Supply chain view"] },
  { icon: Landmark, name: "Finance", desc: "Portfolio & compliance", features: ["Portfolio overview", "Risk dashboards", "Regulatory reports", "Transaction audit"] },
  { icon: Plane, name: "Travel", desc: "Bookings & itineraries", features: ["Trip planner", "Booking management", "Commission tracking", "Customer CRM"] },
  { icon: Leaf, name: "Agriculture", desc: "Crop & yield tracking", features: ["Field mapping", "Weather alerts", "Yield forecasting", "Equipment logs"] },
  { icon: Car, name: "Automotive", desc: "Inventory & service", features: ["Vehicle inventory", "Service scheduling", "Parts ordering", "Customer history"] },
  { icon: Palette, name: "Creative", desc: "Projects & clients", features: ["Project timelines", "Asset management", "Client approvals", "Invoice tracking"] },
  { icon: Wifi, name: "SaaS / Tech", desc: "Metrics & user data", features: ["MRR & churn", "User analytics", "Feature usage", "Support tickets"] },
  { icon: LayoutDashboard, name: "Any Industry", desc: "Fully custom for you", features: ["Tailored KPIs", "Custom workflows", "Brand-matched UI", "Unlimited modules"] },
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

        {/* Industries Grid - 4 columns on desktop, 2 on mobile */}
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
                whileHover={{ scale: 1.05, y: -4 }}
                className="group relative p-5 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-[0_0_30px_-8px_hsl(var(--primary)/0.25)] transition-all duration-300 text-center cursor-default"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-3 group-hover:shadow-lg group-hover:shadow-primary/20 transition-shadow">
                  <Icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display font-semibold text-foreground text-sm mb-0.5 group-hover:text-primary transition-colors">
                  {industry.name}
                </h3>
                <p className="text-xs text-muted-foreground mb-0 group-hover:mb-2 transition-all">{industry.desc}</p>
                
                {/* Hover features tooltip */}
                <div className="grid grid-cols-1 gap-1 max-h-0 overflow-hidden opacity-0 group-hover:max-h-40 group-hover:opacity-100 group-hover:mt-3 transition-all duration-300 ease-in-out">
                  <div className="h-px bg-border mb-1" />
                  {industry.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
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
          <div className="text-center mb-8">
            <div className="flex items-baseline justify-center gap-2 mb-2">
              <span className="text-muted-foreground text-sm font-medium">From</span>
              <span className="font-display text-5xl md:text-6xl font-bold text-foreground">£997</span>
            </div>
            <p className="text-muted-foreground text-sm">One-time payment · Fully custom · No monthly fees</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {features.map((feature) => (
              <div key={feature} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

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
