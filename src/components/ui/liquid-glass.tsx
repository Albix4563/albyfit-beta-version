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
    light: "bg-slate-800/70 backdrop-blur-md border border-white/20",
    medium: "bg-slate-800/80 backdrop-blur-xl border border-white/25",
    heavy: "bg-slate-800/90 backdrop-blur-2xl border border-white/30"
  };

  const variantClasses = {
    default: "bg-gradient-to-br from-slate-800/80 via-slate-900/70 to-slate-800/80",
    card: "bg-gradient-to-br from-slate-700/85 via-slate-800/80 to-slate-900/85",
    surface: "bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95",
    accent: "bg-gradient-to-br from-blue-900/80 via-purple-900/75 to-slate-900/80"
  };

  const Component = animated ? motion.div : "div";
  
  return (
    <Component
      className={cn(
        "rounded-2xl shadow-xl shadow-black/30 relative overflow-hidden",
        "before:absolute before:inset-0 before:rounded-2xl",
        "before:bg-gradient-to-br before:from-white/10 before:via-transparent before:to-transparent",
        "before:opacity-40 before:pointer-events-none",
        intensityClasses[intensity],
        variantClasses[variant],
        "hover:bg-slate-700/90 hover:border-white/40 hover:shadow-2xl hover:shadow-black/40",
        "transition-all duration-300 ease-out",
        className
      )}
      {...(animated && {
        whileHover: { scale: 1.01, y: -1 },
        whileTap: { scale: 0.99 },
        transition: { type: "spring", stiffness: 400, damping: 25 }
      })}
    >
      {/* Reduced liquid morphing background opacity */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full animate-liquid-morph" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-400/15 to-transparent rounded-full animate-liquid-morph" style={{ animationDelay: '2s' }} />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Reduced floating particles */}
      {animated && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(2)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-0.5 bg-white/40 rounded-full"
              style={{
                left: `${30 + i * 40}%`,
                top: `${40 + i * 20}%`,
              }}
              animate={{
                y: [0, -8, 0],
                opacity: [0.4, 0.7, 0.4],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                delay: i * 0.8,
              }}
            />
          ))}
        </div>
      )}
    </Component>
  );
}