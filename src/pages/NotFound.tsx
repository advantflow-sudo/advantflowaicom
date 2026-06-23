import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

// FIX: replaced the bare unstyled 404 page with a fully branded one
// that includes Navbar, Footer, and a proper CTA so users don't feel lost

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <main className="relative min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-6 py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-lg"
        >
          {/* Branded logo mark */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-8">
            <span className="text-primary-foreground font-bold text-4xl font-display">A</span>
          </div>

          <p className="text-primary font-medium text-sm uppercase tracking-widest mb-4">404 — Page Not Found</p>
          <h1 className="heading-lg mb-4">
            This page doesn't exist
          </h1>
          <p className="text-muted-foreground body-md mb-10">
            The link you followed may be broken, or the page may have been moved. Head back home and we'll get you sorted.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="hero" size="lg" onClick={() => window.location.href = "/"}>
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <Button variant="outline" size="lg" onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </motion.div>
      </div>
      <Footer />
    </main>
  );
};

export default NotFound;
