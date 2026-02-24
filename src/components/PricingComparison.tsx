import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Check, Minus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const webFeatures = [
  { feature: "Pages", starter: "5", growth: "Up to 10", premium: "Unlimited", custom: "Unlimited" },
  { feature: "Custom Design", starter: true, growth: true, premium: true, custom: true },
  { feature: "Mobile-First", starter: true, growth: true, premium: true, custom: true },
  { feature: "SEO Setup", starter: "Basic", growth: "Advanced", premium: "Advanced", custom: "Advanced" },
  { feature: "CMS Integration", starter: false, growth: true, premium: true, custom: true },
  { feature: "Copywriting", starter: false, growth: true, premium: true, custom: true },
  { feature: "Analytics Setup", starter: false, growth: true, premium: true, custom: true },
  { feature: "E-Commerce Ready", starter: false, growth: false, premium: true, custom: true },
  { feature: "API Integrations", starter: false, growth: false, premium: true, custom: true },
  { feature: "Brand Identity", starter: false, growth: false, premium: true, custom: true },
  { feature: "Revisions", starter: "2 rounds", growth: "Unlimited", premium: "Unlimited", custom: "Unlimited" },
  { feature: "Delivery", starter: "5 days", growth: "10 days", premium: "Custom", custom: "Custom" },
  { feature: "Support", starter: false, growth: "30 days free", premium: "6 months", custom: "SLA" },
  { feature: "Priority 24/7", starter: false, growth: false, premium: true, custom: true },
  { feature: "Dedicated PM", starter: false, growth: false, premium: true, custom: true },
];

const aiFeatures = [
  { feature: "Automation Workflows", starter: "1", growth: "5", enterprise: "Unlimited", custom: "Unlimited" },
  { feature: "AI Chatbot", starter: true, growth: true, enterprise: true, custom: true },
  { feature: "Email & Form Automation", starter: true, growth: true, enterprise: true, custom: true },
  { feature: "Tasks/month", starter: "1,000", growth: "10,000", enterprise: "Unlimited", custom: "Unlimited" },
  { feature: "Custom AI Agents", starter: false, growth: true, enterprise: true, custom: true },
  { feature: "CRM & Pipeline", starter: false, growth: true, enterprise: true, custom: true },
  { feature: "Lead Scoring", starter: false, growth: true, enterprise: true, custom: true },
  { feature: "Custom AI Dev", starter: false, growth: false, enterprise: true, custom: true },
  { feature: "Full API Integrations", starter: false, growth: false, enterprise: true, custom: true },
  { feature: "Team Training", starter: false, growth: false, enterprise: true, custom: true },
  { feature: "White-Label Options", starter: false, growth: false, enterprise: true, custom: true },
  { feature: "Account Manager", starter: false, growth: false, enterprise: "Dedicated", custom: "Dedicated" },
  { feature: "Support", starter: "Email", growth: "Priority", enterprise: "24/7 Priority", custom: "SLA" },
  { feature: "Setup Time", starter: "48h", growth: "24h", enterprise: "Custom", custom: "Custom" },
  { feature: "Performance Reviews", starter: false, growth: "Monthly", enterprise: "Weekly", custom: "Custom" },
];

const renderCell = (value: boolean | string) => {
  if (value === true) return <Check className="w-4 h-4 text-primary mx-auto" />;
  if (value === false) return <Minus className="w-4 h-4 text-muted-foreground/40 mx-auto" />;
  return <span className="text-sm text-foreground">{value}</span>;
};

export const PricingComparison = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="container-wide">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-widest mb-4 block">Compare</span>
          <h2 className="heading-lg mb-6">
            Full Feature <span className="text-gradient">Comparison</span>
          </h2>
          <p className="body-lg max-w-2xl mx-auto">
            See exactly what's included in each plan at a glance.
          </p>
        </motion.div>

        {/* Web Design Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h3 className="font-display text-xl font-semibold text-foreground mb-6 text-center">
            Web Design Plans
          </h3>
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/50">
                  <TableHead className="font-display font-semibold text-foreground w-[200px]">Feature</TableHead>
                  <TableHead className="text-center font-display font-semibold text-foreground">Starter<br /><span className="text-primary text-xs font-normal">£497</span></TableHead>
                  <TableHead className="text-center font-display font-semibold text-primary">Growth<br /><span className="text-xs font-normal">£997</span></TableHead>
                  <TableHead className="text-center font-display font-semibold text-foreground">Premium<br /><span className="text-primary text-xs font-normal">£2,497</span></TableHead>
                  <TableHead className="text-center font-display font-semibold text-foreground">Custom<br /><span className="text-primary text-xs font-normal">Quote</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {webFeatures.map((row) => (
                  <TableRow key={row.feature}>
                    <TableCell className="font-medium text-foreground text-sm">{row.feature}</TableCell>
                    <TableCell className="text-center">{renderCell(row.starter)}</TableCell>
                    <TableCell className="text-center bg-primary/5">{renderCell(row.growth)}</TableCell>
                    <TableCell className="text-center">{renderCell(row.premium)}</TableCell>
                    <TableCell className="text-center">{renderCell(row.custom)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </motion.div>

        {/* AI Automation Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="font-display text-xl font-semibold text-foreground mb-6 text-center">
            AI Automation Plans
          </h3>
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/50">
                  <TableHead className="font-display font-semibold text-foreground w-[200px]">Feature</TableHead>
                  <TableHead className="text-center font-display font-semibold text-foreground">Starter<br /><span className="text-primary text-xs font-normal">£97/mo</span></TableHead>
                  <TableHead className="text-center font-display font-semibold text-primary">Growth<br /><span className="text-xs font-normal">£197/mo</span></TableHead>
                  <TableHead className="text-center font-display font-semibold text-foreground">Enterprise<br /><span className="text-primary text-xs font-normal">£497/mo</span></TableHead>
                  <TableHead className="text-center font-display font-semibold text-foreground">Custom<br /><span className="text-primary text-xs font-normal">Quote</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {aiFeatures.map((row) => (
                  <TableRow key={row.feature}>
                    <TableCell className="font-medium text-foreground text-sm">{row.feature}</TableCell>
                    <TableCell className="text-center">{renderCell(row.starter)}</TableCell>
                    <TableCell className="text-center bg-primary/5">{renderCell(row.growth)}</TableCell>
                    <TableCell className="text-center">{renderCell(row.enterprise)}</TableCell>
                    <TableCell className="text-center">{renderCell(row.custom)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
