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
        description="Transparent pricing for web design (from £797), AI automation (from £97/mo), and custom dashboards (from £997). No hidden fees. 100% money-back guarantee."
        canonical="https://advantflowai.com/pricing"
      />
      <Navbar />
      <header className="pt-36 md:pt-44 pb-4 text-center container-wide">
        <h1 className="heading-lg mb-4">
          Advant Flow AI <span className="text-gradient">Plans & Pricing</span>
        </h1>
        <p className="body-lg max-w-2xl mx-auto">
          Transparent pricing for websites, AI automation and custom dashboards — no hidden fees.
        </p>
      </header>
      <Pricing />
      <IndividualServices />
      <PricingComparison />
      <Footer />
    </main>
  );
};

export default PricingPage;
