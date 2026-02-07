import { motion } from "framer-motion";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";

const footerLinks = {
  services: [
    { name: "Web Design", href: "#" },
    { name: "Development", href: "#" },
    { name: "Branding", href: "#" },
    { name: "SEO", href: "#" },
  ],
  company: [
    { name: "About Us", href: "#about" },
    { name: "Our Work", href: "#work" },
    { name: "Process", href: "#process" },
    { name: "Careers", href: "#" },
  ],
  resources: [
    { name: "Blog", href: "/blog" },
    { name: "Case Studies", href: "#" },
    { name: "Free Tools", href: "#" },
    { name: "Newsletter", href: "#" },
  ],
};

const socialLinks = [
  { name: "Twitter", href: "#" },
  { name: "LinkedIn", href: "#" },
  { name: "Instagram", href: "#" },
  { name: "Dribbble", href: "#" },
];

export const Footer = () => {
  return (
    <footer className="section-padding pt-20 md:pt-28 border-t border-border/50 relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/3 to-transparent pointer-events-none" />
      
      <div className="container-wide relative">
        <div className="grid lg:grid-cols-2 gap-16 mb-16">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-8">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-primary-foreground font-bold text-xl">A</span>
              </div>
              <span className="font-display font-bold text-2xl text-foreground">
                Advant<span className="text-primary">Flow</span>
              </span>
            </div>

            <p className="text-muted-foreground max-w-md mb-10 leading-relaxed text-lg">
              We build high-converting websites that transform your digital presence 
              and drive real business growth. Let's create something amazing together.
            </p>

            {/* Contact Info */}
            <div className="space-y-5">
              <motion.a
                href="mailto:hello@advantflow.co.uk"
                className="flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors duration-300 group"
                whileHover={{ x: 4 }}
              >
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Mail className="w-5 h-5 group-hover:text-primary transition-colors" />
                </div>
                <span>hello@advantflow.co.uk</span>
              </motion.a>
              <motion.a
                href="tel:+442071234567"
                className="flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors duration-300 group"
                whileHover={{ x: 4 }}
              >
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Phone className="w-5 h-5 group-hover:text-primary transition-colors" />
                </div>
                <span>+44 20 7123 4567</span>
              </motion.a>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <span>London, United Kingdom</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
            {[
              { title: "Services", links: footerLinks.services },
              { title: "Company", links: footerLinks.company },
              { title: "Resources", links: footerLinks.resources },
            ].map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: sectionIndex * 0.1 }}
              >
                <h4 className="font-display font-semibold text-foreground mb-5 text-lg">{section.title}</h4>
                <ul className="space-y-4">
                  {section.links.map((link, i) => (
                    <motion.li 
                      key={link.name}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.05 }}
                    >
                      <a
                        href={link.href}
                        className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm inline-block relative group"
                      >
                        {link.name}
                        <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          className="flex flex-col md:flex-row items-center justify-between py-8 border-t border-border/50 gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <div className="text-sm text-muted-foreground text-center md:text-left">
            <p>© 2026 AdvantFlow Ltd. All rights reserved.</p>
            <p className="mt-1 opacity-70">Registered in England & Wales. Company No: 12345678 | VAT No: GB123456789</p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-8">
            {socialLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.href}
                className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm flex items-center gap-1.5 group"
                whileHover={{ y: -2 }}
              >
                {link.name}
                <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
