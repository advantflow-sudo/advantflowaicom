import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { 
  LayoutDashboard, HeartPulse, GraduationCap, Building2, 
  ShoppingBag, Truck, Scale, Utensils, ArrowRight, CheckCircle2 
} from "lucide-react";
import { Button } from "@/components/ui/button";

const industries = [
  { icon: HeartPulse, name: "Healthcare", desc: "Patient portals, appointment tracking, analytics" },
  { icon: GraduationCap, name: "Education", desc: "Student dashboards, LMS integration, reporting" },
  { icon: Building2, name: "Real Estate", desc: "Property management, tenant portals, listings" },
  { icon: ShoppingBag, name: "E-Commerce", desc: "Order management, inventory, customer insights" },
  { icon: Truck, name: "Logistics", desc: "Fleet tracking, delivery management, KPIs" },
  { icon: Scale, name: "Legal", desc: "Case management, client portals, billing" },
  { icon: Utensils, name: "Hospitality", desc: "Booking systems, guest management, revenue" },
  { icon: LayoutDashboard, name: "Any Industry", desc: "Fully custom dashboards tailored to you" },
];

const features = [
  "Fully branded under your company",
  "Responsive on all devices",
  "Real-time data & analytics",
  "Role-based access control",
  "API integrations included",
  "Ongoing support & updates",
];

export const Dashboards = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });

  return (
    <section id="dashboards" className="section-padding relative overflow-hidden bg-muted/30">
      <div className="container-wide">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-24"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-widest mb-4 block">
            White-Label Dashboards
          </span>
          <h2 className="heading-lg mb-6">
            Custom Dashboards for{" "}
            <span className="text-gradient">Any Industry</span>
          </h2>
          <p className="body-lg max-w-2xl mx-auto">
            We design and build fully branded, white-label dashboards tailored to your business. 
            Your brand, your data, your clients — powered by us.
          </p>
        </motion.div>

        {/* Industries Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
          {industries.map((industry, index) => {
            const Icon = industry.icon;
            return (
              <motion.div
                key={industry.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
                className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all duration-500 text-center"
              >
                <motion.div
                  className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4"
                  whileHover={{ scale: 1.1, rotate: 3 }}
                  transition={{ duration: 0.3 }}
                >
                  <Icon className="w-7 h-7 text-primary-foreground" />
                </motion.div>
                <h3 className="font-display font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {industry.name}
                </h3>
                <p className="text-xs text-muted-foreground">{industry.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Features + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
            {features.map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <a href="#contact">
            <Button variant="hero" size="xl" className="group">
              <span className="flex items-center gap-2">
                Get a Custom Quote
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
};
