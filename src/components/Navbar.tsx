import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import logoIcon from "@/assets/logo-icon.png";

const navLinks = [
  { 
    name: "Services", 
    href: "#services",
    children: [
      { name: "Web Design", href: "#services" },
      { name: "AI Automation", href: "#pricing" },
      { name: "White-Label Dashboards", href: "#dashboards" },
      { name: "View All Pricing", href: "/pricing" },
    ],
  },
  { name: "Work", href: "#work" },
  { name: "Pricing", href: "#pricing" },
  { name: "About", href: "#about" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "#contact" },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/30 py-3"
          : "py-5"
      }`}
    >
      <div className="container-wide px-6 md:px-12 lg:px-20 flex items-center justify-between">
        {/* Logo */}
        <a href="/" aria-label="Advant Flow AI home" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg overflow-hidden">
            <img src={logoIcon} alt="Advant Flow AI" className="w-full h-full object-cover" />
          </div>
          <span className="font-display font-bold text-lg text-foreground tracking-tight">
            Advant <span className="text-primary">Flow AI</span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <div
              key={link.name}
              className="relative"
              onMouseEnter={() => link.children && setOpenDropdown(link.name)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <a
                href={link.href}
                className="flex items-center gap-1 px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-200 font-medium text-sm"
              >
                {link.name}
                {link.children && <ChevronDown className="w-3.5 h-3.5 opacity-50" />}
              </a>

              {/* Dropdown */}
              <AnimatePresence>
                {link.children && openDropdown === link.name && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-1 w-56 rounded-xl bg-card/95 backdrop-blur-xl border border-border/50 shadow-xl shadow-background/50 p-2"
                  >
                    {link.children.map((child) => (
                      <a
                        key={child.name}
                        href={child.href}
                        className="block px-4 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all duration-200"
                      >
                        {child.name}
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <a href="#contact">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Get a Quote
            </Button>
          </a>
          <a href={user ? "/portal" : "/auth"}>
            <Button variant="hero" size="default" className="rounded-lg">
              {user ? "Client Portal" : "Start a Project"}
            </Button>
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden text-foreground p-2 rounded-lg hover:bg-secondary/50 transition-colors"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden bg-background/95 backdrop-blur-xl border-t border-border/30 overflow-hidden"
          >
            <nav className="px-6 py-6 flex flex-col gap-1">
              {navLinks.map((link) => (
                <div key={link.name}>
                  <a
                    href={link.href}
                    onClick={() => !link.children && setIsMobileMenuOpen(false)}
                    className="block text-foreground hover:text-primary transition-colors font-medium py-3 px-4 rounded-lg hover:bg-secondary/40 text-base"
                  >
                    {link.name}
                  </a>
                  {link.children && (
                    <div className="pl-6 flex flex-col gap-0.5">
                      {link.children.map((child) => (
                        <a
                          key={child.name}
                          href={child.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block text-muted-foreground hover:text-primary transition-colors py-2 px-4 rounded-lg hover:bg-secondary/30 text-sm"
                        >
                          {child.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-4 flex flex-col gap-2">
                <a href="#contact">
                  <Button variant="outline" className="w-full">Get a Quote</Button>
                </a>
                <a href={user ? "/portal" : "/auth"}>
                  <Button variant="hero" className="w-full">
                    {user ? "Client Portal" : "Start a Project"}
                  </Button>
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
