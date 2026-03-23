import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star, Quote } from "lucide-react";
import testimonialsBg from "@/assets/testimonials-bg.png";

const testimonials = [
  {
    name: "D. Patel",
    role: "Owner, Patel & Co Accountants",
    image: "",
    content: "Advant Flow AI built us a professional website in under a week. We went from zero online presence to getting enquiries through our site within days. Brilliant service and very easy to work with.",
    rating: 5,
  },
  {
    name: "R. Hussain",
    role: "Director, Hussain Property Group",
    image: "",
    content: "The AI chatbot they set up handles most of our tenant enquiries automatically now. It's saved us hours every week and our response time has gone from days to seconds. Highly recommend.",
    rating: 5,
  },
  {
    name: "L. Morgan",
    role: "Founder, Morgan Fitness Studio",
    image: "",
    content: "They redesigned our website and set up automated booking confirmations. Class sign-ups increased noticeably and I spend far less time on admin. Great value for the price.",
    rating: 5,
  },
];

const TestimonialCard = ({ testimonial, index }: { testimonial: typeof testimonials[0]; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="relative p-8 rounded-3xl bg-card border border-border hover:border-primary/30 transition-all duration-500 group"
    >
      {/* Quote Icon */}
      <div className="absolute top-8 right-8 text-primary/10">
        <Quote className="w-16 h-16" />
      </div>

      {/* Stars */}
      <div className="flex gap-1 mb-6">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-primary text-primary" />
        ))}
      </div>

      {/* Content */}
      <p className="text-foreground text-lg leading-relaxed mb-8 relative z-10">
        "{testimonial.content}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/20">
          <span className="text-primary font-display font-bold text-lg">
            {testimonial.name.split(" ").map(n => n[0]).join("")}
          </span>
        </div>
        <div>
          <h4 className="font-display font-semibold text-foreground">
            {testimonial.name}
          </h4>
          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
        </div>
      </div>
    </motion.div>
  );
};

export const Testimonials = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });

  return (
    <section id="testimonials" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src={testimonialsBg} alt="" className="w-full h-full object-cover opacity-10" />
      </div>
      <div className="container-wide relative z-10">
        {/* Section Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-24"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-widest mb-4 block">
            Words of Trust
          </span>
          <h2 className="heading-lg mb-6">
            What Our Clients{" "}
            <span className="text-gradient">Say About Us</span>
          </h2>
          <p className="body-lg max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our partners have to say about working with Advant Flow AI.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} index={index} />
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mt-20 grid grid-cols-3 gap-8 p-8 rounded-3xl bg-gradient-to-r from-primary/10 to-accent/10 border border-border"
        >
          {[
            { value: "150+", label: "Projects Delivered" },
            { value: "98%", label: "Client Satisfaction" },
            { value: "24hrs", label: "Avg. Response Time" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-3xl md:text-4xl font-bold text-gradient mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
