import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Services } from "@/components/Services";
import { Projects } from "@/components/Projects";
import { About } from "@/components/About";
import { Process } from "@/components/Process";
import { Pricing } from "@/components/Pricing";
import { Testimonials } from "@/components/Testimonials";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <Marquee />
      <Services />
      <Projects />
      <About />
      <Process />
      <Pricing />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
};

export default Index;
