import { motion } from "framer-motion";

const FloatingShape = ({ 
  className, 
  delay = 0, 
  duration = 20,
  size = "w-32 h-32"
}: { 
  className: string; 
  delay?: number; 
  duration?: number;
  size?: string;
}) => (
  <motion.div
    className={`absolute ${size} ${className}`}
    animate={{
      y: [0, -30, 0],
      x: [0, 15, 0],
      rotate: [0, 180, 360],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "linear",
    }}
  />
);

export const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient Orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px]"
        style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.25), transparent 70%)" }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.4, 0.6, 0.4],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px]"
        style={{ background: "radial-gradient(circle, hsl(var(--accent) / 0.2), transparent 70%)" }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
          x: [0, -40, 0],
          y: [0, 40, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating Geometric Shapes */}
      <FloatingShape 
        className="top-20 right-[15%] border border-primary/20 rounded-xl rotate-12"
        size="w-24 h-24"
        delay={0}
        duration={25}
      />
      <FloatingShape 
        className="top-1/3 left-[10%] border border-accent/20 rounded-full"
        size="w-16 h-16"
        delay={2}
        duration={20}
      />
      <FloatingShape 
        className="bottom-1/3 right-[20%] border border-primary/15 rotate-45"
        size="w-20 h-20"
        delay={4}
        duration={22}
      />
      <FloatingShape 
        className="bottom-1/4 left-[25%] border border-accent/15 rounded-xl"
        size="w-12 h-12"
        delay={1}
        duration={18}
      />

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Animated Grid Lines */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(90deg, transparent 49.5%, hsl(var(--primary) / 0.05) 50%, transparent 50.5%)`,
          backgroundSize: '120px 100%',
        }}
        animate={{ x: [0, 120] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      {/* Floating Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/40"
          style={{
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 4 + i,
            delay: i * 0.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};
