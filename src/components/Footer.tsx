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
    { name: "Blog", href: "#" },
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
    <footer id="contact" className="section-padding pt-16 md:pt-24 border-t border-border">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-16 mb-16">
          {/* Left Column */}
          <div>
            {/* Logo */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">A</span>
              </div>
              <span className="font-display font-bold text-xl text-foreground">
                Advant<span className="text-primary">Flow</span>
              </span>
            </div>

            <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
              We build high-converting websites that transform your digital presence 
              and drive real business growth. Let's create something amazing together.
            </p>

            {/* Contact Info */}
            <div className="space-y-4">
              <a
                href="mailto:hello@advantflow.com"
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-5 h-5" />
                hello@advantflow.com
              </a>
              <a
                href="tel:+1234567890"
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="w-5 h-5" />
                +1 (234) 567-890
              </a>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="w-5 h-5" />
                San Francisco, CA
              </div>
            </div>
          </div>

          {/* Right Column - Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-display font-semibold text-foreground mb-4">Services</h4>
              <ul className="space-y-3">
                {footerLinks.services.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-display font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-display font-semibold text-foreground mb-4">Resources</h4>
              <ul className="space-y-3">
                {footerLinks.resources.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between py-8 border-t border-border gap-6">
          <p className="text-sm text-muted-foreground">
            © 2026 AdvantFlow. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-1 group"
              >
                {link.name}
                <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
