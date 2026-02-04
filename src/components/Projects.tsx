import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const projects = [
  {
    id: 1,
    title: "Finsbury Digital",
    category: "SaaS Website",
    description: "A modern SaaS platform redesign that increased conversions by 340%",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    stats: "+340% conversions",
    color: "from-primary to-blue-600",
  },
  {
    id: 2,
    title: "Mayfair Luxury",
    category: "E-commerce",
    description: "Premium e-commerce experience for a luxury fashion brand",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
    stats: "£1.8M revenue",
    color: "from-accent to-pink-500",
  },
  {
    id: 3,
    title: "Thames Fintech",
    category: "Web Application",
    description: "Complex fintech dashboard with real-time data visualization",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    stats: "50K+ users",
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: 4,
    title: "Shoreditch Creative",
    category: "Portfolio",
    description: "Award-winning portfolio site for a creative agency",
    image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=80",
    stats: "Awwwards Winner",
    color: "from-orange-500 to-red-500",
  },
];

const ProjectCard = ({ project, index }: { project: typeof projects[0]; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 80 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative group cursor-pointer ${
        index === 0 ? "md:col-span-2 md:row-span-2" : ""
      }`}
    >
      <motion.div 
        className="relative h-full min-h-[400px] md:min-h-[500px] rounded-3xl overflow-hidden"
        animate={{ 
          y: isHovered ? -8 : 0,
        }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          boxShadow: isHovered 
            ? '0 32px 64px -16px hsl(var(--background) / 0.95)' 
            : '0 8px 32px -8px hsl(var(--background) / 0.8)',
        }}
      >
        {/* Image */}
        <motion.div
          animate={{ scale: isHovered ? 1.08 : 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Overlay */}
        <motion.div 
          className={`absolute inset-0 bg-gradient-to-t ${project.color} mix-blend-multiply`}
          animate={{ opacity: isHovered ? 0.7 : 0.55 }}
          transition={{ duration: 0.4 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 p-8 flex flex-col justify-end">
          {/* Category Badge */}
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: index * 0.12 + 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex w-fit items-center px-4 py-1.5 rounded-full text-xs font-semibold bg-foreground/10 backdrop-blur-md text-foreground mb-4 border border-foreground/10"
          >
            {project.category}
          </motion.span>

          {/* Title */}
          <motion.h3 
            className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3"
            animate={{ color: isHovered ? 'hsl(var(--primary))' : 'hsl(var(--foreground))' }}
            transition={{ duration: 0.3 }}
          >
            {project.title}
          </motion.h3>

          {/* Description */}
          <p className="text-foreground/80 mb-5 max-w-md leading-relaxed">
            {project.description}
          </p>

          {/* Stats & Link */}
          <div className="flex items-center justify-between">
            <span className="text-primary font-bold text-lg">{project.stats}</span>
            <motion.div
              animate={{ 
                x: isHovered ? 0 : -16, 
                opacity: isHovered ? 1 : 0,
                scale: isHovered ? 1 : 0.8,
              }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                <ArrowUpRight className="w-5 h-5 text-primary-foreground" />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const Projects = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });

  return (
    <section id="work" className="section-padding relative overflow-hidden bg-secondary/30">
      <div className="container-wide">
        {/* Section Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 md:mb-24"
        >
          <div>
            <span className="text-primary font-medium text-sm uppercase tracking-widest mb-4 block">
              Our Work
            </span>
            <h2 className="heading-lg mb-4">
              Projects That{" "}
              <span className="text-gradient">Speak Results</span>
            </h2>
          </div>
          <Button variant="hero-outline" size="lg" className="mt-6 md:mt-0 group">
            View All Projects
            <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
