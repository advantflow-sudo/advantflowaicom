import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Pricing } from "@/components/Pricing";
import { IndividualServices } from "@/components/IndividualServices";
import { PricingComparison } from "@/components/PricingComparison";

const PricingPage = () => {
  return (
    <main className="relative">
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
