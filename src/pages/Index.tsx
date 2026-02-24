import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Services } from "@/components/Services";
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
      <Navbar />
      <Hero />
      <Marquee />
      <Services />
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
