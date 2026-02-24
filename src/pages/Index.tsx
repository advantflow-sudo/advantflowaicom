import { SEOHead } from "@/components/SEOHead";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Services } from "@/components/Services";
import { Dashboards } from "@/components/Dashboards";
import { Projects } from "@/components/Projects";
import { About } from "@/components/About";
import { Process } from "@/components/Process";
import { Pricing } from "@/components/Pricing";
import { IndividualServices } from "@/components/IndividualServices";
import { FAQ } from "@/components/FAQ";
import { Testimonials } from "@/components/Testimonials";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <main className="relative">
      <SEOHead
        title="AdvantFlowAI | AI Automation & Web Design Agency | London, UK"
        description="We build high-converting websites, AI automation systems & custom dashboards. Websites from £497. AI from £97/mo. 50+ UK businesses trust us."
        canonical="https://advantflowai.co.uk/"
      />
      <Navbar />
      <Hero />
      <Marquee />
      <Services />
      <Dashboards />
      <Projects />
      <About />
      <Process />
      <Pricing />
      <IndividualServices />
      <FAQ />
      <Testimonials />
      <ContactForm />
      <Footer />
    </main>
  );
};

export default Index;
