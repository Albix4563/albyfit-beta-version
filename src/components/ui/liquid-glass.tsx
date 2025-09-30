import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface LiquidGlassProps {
  children: ReactNode;
  className?: string;
  intensity?: "light" | "medium" | "heavy";
  animated?: boolean;
  variant?: "default" | "card" | "surface" | "accent";
}

export function LiquidGlass({ 
  children, 
  className, 
  intensity = "medium", 
  animated = true,
  variant = "default"
}: LiquidGlassProps) {
  const intensityClasses = {
    light: "bg-white/5 backdrop-blur-md border border-white/10",
    medium: "bg-white/10 backdrop-blur-xl border border-white/20",
    heavy: "bg-white/15 backdrop-blur-2xl border border-white/30"
  };

  const variantClasses = {
    default: "bg-gradient-to-br from-white/10 via-white/5 to-transparent",
    card: "bg-gradient-to-br from-white/15 via-white/8 to-white/5",
    surface: "bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95",
    accent: "bg-gradient-to-br from-blue-500/20 via-purple-500/15 to-pink-500/10"
  };

  const Component = animated ? motion.div : "div";
  
  return (
    <Component
      className={cn(
        "rounded-2xl shadow-lg shadow-black/10 relative overflow-hidden",
        "before:absolute before:inset-0 before:rounded-2xl",
        "before:bg-gradient-to-br before:from-white/20 before:via-transparent before:to-transparent",
        "before:opacity-50 before:pointer-events-none",
        intensityClasses[intensity],
        variantClasses[variant],
        "hover:bg-white/15 hover:border-white/30 hover:shadow-xl hover:shadow-black/20",
        "transition-all duration-500 ease-out",
        className
      )}
      {...(animated && {
        whileHover: { scale: 1.02, y: -2 },
        whileTap: { scale: 0.98 },
        transition: { type: "spring", stiffness: 300, damping: 20 }
      })}
    >
      {/* Liquid morphing background */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/30 to-transparent rounded-full animate-liquid-morph" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-400/20 to-transparent rounded-full animate-liquid-morph" style={{ animationDelay: '2s' }} />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Floating particles */}
      {animated && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
              style={{
                left: `${20 + i * 30}%`,
                top: `${30 + i * 20}%`,
              }}
              animate={{
                y: [0, -10, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          ))}
        </div>
      )}
    </Component>
  );
}