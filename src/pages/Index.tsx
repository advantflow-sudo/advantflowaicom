import { SEOHead } from "@/components/SEOHead";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Services } from "@/components/Services";
import { Process } from "@/components/Process";
import { WhyChoose } from "@/components/WhyChoose";
import { Dashboards } from "@/components/Dashboards";
import { Projects } from "@/components/Projects";
import { Pricing } from "@/components/Pricing";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { FinalCTA } from "@/components/FinalCTA";
import { BookingCalendar } from "@/components/BookingCalendar";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <main className="relative">
      <SEOHead
        title="Advant Flow AI | Technology Made Simple for UK Businesses"
        description="We build websites, business software, AI assistants and automation for UK service businesses. Save time, win more customers and grow — technology made simple."
        canonical="https://advantflowai.com/"
      />
      <Navbar />
      <Hero />
      <Marquee />
      <Services />
      <Process />
      <WhyChoose />
      <Dashboards />
      <Projects />
      <Pricing />
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <BookingCalendar />
      <ContactForm />
      <Footer />
    </main>
  );
};

export default Index;
