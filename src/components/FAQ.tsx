import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How quickly can you deliver my website?",
    answer:
      "Our Starter sites are delivered in 5 days, Growth sites in 10 days. We move fast without cutting corners — you'll have a live, polished site before most agencies even send a proposal.",
  },
  {
    question: "What if I'm not happy with the result?",
    answer:
      "We offer a 100% money-back guarantee. If you're not completely satisfied, we'll either make it right or give you a full refund — no questions asked.",
  },
  {
    question: "Do I need to provide the content and images?",
    answer:
      "Not necessarily. We can write conversion-focused copy and source professional imagery for your site. Just tell us about your business and we handle the rest.",
  },
  {
    question: "What's included in the AI automation plans?",
    answer:
      "Each plan includes custom-built workflows that automate repetitive tasks — lead follow-ups, email sequences, data entry, customer support chatbots, and more. We set everything up for you and provide ongoing support.",
  },
  {
    question: "Can I cancel my AI subscription anytime?",
    answer:
      "Yes, absolutely. There are no lock-in contracts. You can cancel or change your plan at any time through your account portal. We believe in earning your business every month.",
  },
  {
    question: "Do you work with businesses outside the UK?",
    answer:
      "Yes! While we're based in London, we work with clients worldwide. Our process is fully remote — we communicate via video calls, email, and our client portal.",
  },
  {
    question: "How is Advant Flow AI different from other agencies?",
    answer:
      "We combine web design with AI automation under one roof. Most agencies only do one or the other. With us, you get a beautiful site AND smart systems that save you hours every week — all at prices that won't break the bank.",
  },
  {
    question: "What happens after my website is delivered?",
    answer:
      "Growth and Premium plans include free support (30 days and 6 months respectively). After that, we offer affordable maintenance plans. Your site will always stay fast, secure, and up to date.",
  },
];

export const FAQ = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });

  return (
    <section id="faq" className="section-padding relative overflow-hidden">
      <div className="container-wide max-w-4xl">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-widest mb-4 block">
            FAQ
          </span>
          <h2 className="heading-lg mb-6">
            Got <span className="text-gradient">Questions?</span>
          </h2>
          <p className="body-lg max-w-2xl mx-auto">
            Everything you need to know before getting started. Still have questions? 
            <a href="#contact" className="text-primary hover:underline ml-1">Get in touch</a>.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border rounded-2xl px-6 data-[state=open]:border-primary/30 transition-colors duration-300"
              >
                <AccordionTrigger className="text-left font-display font-semibold text-foreground hover:text-primary py-5 text-base md:text-lg [&[data-state=open]>svg]:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};
