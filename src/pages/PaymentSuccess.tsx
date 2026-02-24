import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-lg w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-8"
        >
          <CheckCircle className="w-14 h-14 text-green-500" />
        </motion.div>

        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
          Payment Successful!
        </h1>
        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
          Thank you for your purchase! We've received your payment and our team will be in touch within 24 hours to get started on your project.
        </p>

        <div className="card-enhanced rounded-2xl p-6 mb-8 text-left">
          <h3 className="font-display font-semibold text-foreground mb-3">What happens next?</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary font-bold text-xs">1</span>
              </span>
              You'll receive a confirmation email with your receipt
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary font-bold text-xs">2</span>
              </span>
              Our team will reach out within 24 hours to kick off your project
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary font-bold text-xs">3</span>
              </span>
              Track your project progress in your client portal
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="hero" size="lg" onClick={() => navigate("/portal")} className="group">
            Go to Portal
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button variant="outline" size="lg" onClick={() => navigate("/")}>
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
