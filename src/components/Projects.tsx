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
      transition={{ duration: 0.8, delay: index * 0.15 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative group cursor-pointer ${
        index === 0 ? "md:col-span-2 md:row-span-2" : ""
      }`}
    >
      <div className="relative h-full min-h-[400px] md:min-h-[500px] rounded-3xl overflow-hidden">
        {/* Image */}
        <motion.div
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t ${project.color} opacity-60 mix-blend-multiply`} />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 p-8 flex flex-col justify-end">
          {/* Category Badge */}
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: index * 0.15 + 0.3 }}
            className="inline-flex w-fit items-center px-3 py-1 rounded-full text-xs font-medium bg-foreground/10 backdrop-blur-sm text-foreground mb-4"
          >
            {project.category}
          </motion.span>

          {/* Title */}
          <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-foreground/80 mb-4 max-w-md">
            {project.description}
          </p>

          {/* Stats & Link */}
          <div className="flex items-center justify-between">
            <span className="text-primary font-semibold">{project.stats}</span>
            <motion.div
              animate={{ x: isHovered ? 0 : -10, opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5 text-primary-foreground" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
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
