import { SEOHead } from "@/components/SEOHead";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Pricing } from "@/components/Pricing";
import { IndividualServices } from "@/components/IndividualServices";
import { PricingComparison } from "@/components/PricingComparison";

const PricingPage = () => {
  return (
    <main className="relative">
      <SEOHead
        title="Pricing | Advant Flow AI — Web Design & AI Automation Plans"
        description="Transparent pricing for web design (from £497), AI automation (from £97/mo), and custom dashboards (from £997). No hidden fees. 100% money-back guarantee."
        canonical="https://advantflowai.com/pricing"
      />
      <Navbar />
      <div className="pt-24" />
      <Pricing />
      <IndividualServices />
      <PricingComparison />
      <Footer />
    </main>
  );
};

export default PricingPage;
