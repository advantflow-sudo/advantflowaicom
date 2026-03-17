import { SEOHead } from "@/components/SEOHead";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Trust } from "@/components/Trust";
import { Problem } from "@/components/Problem";
import { Solution } from "@/components/Solution";
import { Offer } from "@/components/Offer";
import { LiveDemo } from "@/components/LiveDemo";
import { Services } from "@/components/Services";
import { WhoItsFor } from "@/components/WhoItsFor";
import { Dashboards } from "@/components/Dashboards";
import { Projects } from "@/components/Projects";
import { About } from "@/components/About";
import { Process } from "@/components/Process";
import { Pricing } from "@/components/Pricing";
import { IndividualServices } from "@/components/IndividualServices";
import { FAQ } from "@/components/FAQ";
import { Testimonials } from "@/components/Testimonials";
import { FinalCTA } from "@/components/FinalCTA";
import { BookingCalendar } from "@/components/BookingCalendar";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <main className="relative">
      <SEOHead
        title="AdvantFlowAI | Get More Bookings Automatically With AI"
        description="AdvantFlowAI replies to customers instantly, captures leads, and books jobs for you 24/7. Built for service businesses. Start your free trial today."
        canonical="https://advantflowai.com/"
      />
      <Navbar />
      <Hero />
      <Marquee />
      <Trust />
      <Problem />
      <Solution />
      <Offer />
      <LiveDemo />
      <Services />
      <WhoItsFor />
      <Dashboards />
      <Projects />
      <About />
      <Process />
      <Pricing />
      <IndividualServices />
      <FAQ />
      <Testimonials />
      <FinalCTA />
      <BookingCalendar />
      <ContactForm />
      <Footer />
    </main>
  );
};

export default Index;
