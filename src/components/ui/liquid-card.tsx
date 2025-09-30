import { motion } from "framer-motion";
import { LiquidGlass } from "./liquid-glass";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface LiquidCardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "gradient" | "accent" | "surface";
  animated?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

export function LiquidCard({ 
  children, 
  className, 
  variant = "default",
  animated = true,
  clickable = false,
  onClick
}: LiquidCardProps) {
  const variantStyles = {
    default: "bg-gradient-to-br from-white/10 via-white/5 to-transparent",
    gradient: "bg-gradient-to-br from-blue-500/20 via-purple-500/15 to-pink-500/10",
    accent: "bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-cyan-500/5",
    surface: "bg-gradient-to-br from-slate-800/80 via-slate-900/60 to-slate-800/80"
  };

  const Component = animated ? motion.div : "div";

  return (
    <Component
      className={cn(
        "relative overflow-hidden rounded-2xl p-6 cursor-default",
        "bg-white/10 backdrop-blur-xl border border-white/20",
        "shadow-lg shadow-black/10 transition-all duration-500",
        "hover:bg-white/15 hover:border-white/30 hover:shadow-xl hover:shadow-black/20",
        variantStyles[variant],
        clickable && "cursor-pointer hover:scale-[1.02] active:scale-[0.98]",
        className
      )}
      onClick={onClick}
      {...(animated && {
        initial: { opacity: 0, y: 20, scale: 0.95 },
        animate: { opacity: 1, y: 0, scale: 1 },
        whileHover: clickable ? { y: -4, scale: 1.02 } : { y: -2 },
        whileTap: clickable ? { scale: 0.98 } : undefined,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      })}
    >
      {/* Floating gradient orbs */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <motion.div
          className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-blue-400/30 to-purple-400/20 rounded-full blur-xl"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-2 -left-2 w-12 h-12 bg-gradient-to-tr from-pink-400/20 to-orange-400/15 rounded-full blur-lg"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>
      
      {/* Enhanced border glow effect */}
      <div className="absolute inset-0 rounded-2xl opacity-50 pointer-events-none">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer-flow" />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Floating micro-particles */}
      {animated && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-0.5 bg-white/40 rounded-full"
              style={{
                left: `${10 + i * 20}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              animate={{
                y: [0, -15, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                delay: i * 0.8,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      )}
      
      {/* Click ripple effect */}
      {clickable && (
        <motion.div
          className="absolute inset-0 bg-white/10 rounded-2xl opacity-0"
          whileTap={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 0.3 }}
        />
      )}
    </Component>
  );
}

// Specialized card variants
export function WorkoutLiquidCard({ children, ...props }: Omit<LiquidCardProps, 'variant'>) {
  return (
    <LiquidCard
      variant="gradient"
      clickable
      className="hover:shadow-blue-500/20 border-gradient-to-r from-blue-500/30 to-purple-500/30"
      {...props}
    >
      {children}
    </LiquidCard>
  );
}

export function StatsLiquidCard({ children, ...props }: Omit<LiquidCardProps, 'variant'>) {
  return (
    <LiquidCard
      variant="accent"
      className="hover:shadow-emerald-500/20 border-gradient-to-r from-emerald-500/30 to-teal-500/30"
      {...props}
    >
      {children}
    </LiquidCard>
  );
}