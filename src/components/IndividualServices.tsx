import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowRight, Loader2, Workflow, Bot, Mail, Users, Target, Plug, Code2, GraduationCap, Tag, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { individualServices } from "@/lib/individual-services";

const iconMap: Record<string, any> = {
  Workflow, Bot, Mail, Users, Target, Plug, Code2, GraduationCap, Tag,
};

const ServiceItem = ({ service, index }: { service: typeof individualServices[number]; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const Icon = iconMap[service.icon] || Workflow;

  const handleBuy = async () => {
    if (!user) {
      window.location.href = "/auth";
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId: service.price_id, mode: "payment" },
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
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className="group relative flex items-center gap-4 p-5 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all duration-300"
    >
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
        <Icon className="w-6 h-6 text-primary-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-display font-semibold text-foreground text-sm md:text-base">{service.name}</h4>
        <p className="text-xs text-muted-foreground hidden sm:block">{service.description}</p>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className="font-display font-bold text-lg text-foreground">{service.price}</span>
        <Button
          variant="hero"
          size="sm"
          onClick={handleBuy}
          disabled={loading}
          className="group/btn"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
            <>
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">Buy</span>
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export const IndividualServices = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });

  return (
    <section id="individual-services" className="section-padding relative overflow-hidden">
      <div className="container-wide">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-widest mb-4 block">À La Carte</span>
          <h2 className="heading-lg mb-6">
            Buy Individual <span className="text-gradient">Services</span>
          </h2>
          <p className="body-lg max-w-2xl mx-auto">
            Don't need a full plan? Pick exactly what you need — one-time purchase, no subscriptions.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {individualServices.map((service, index) => (
            <ServiceItem key={service.name} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
