import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface LiquidGlassProps {
  children: ReactNode;
  className?: string;
  intensity?: "light" | "medium" | "heavy" | "mobile-nav";
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
    heavy: "bg-slate-800/90 backdrop-blur-2xl border border-white/30",
    "mobile-nav": "bg-white/15 backdrop-blur-sm border border-white/20 shadow-lg shadow-black/20"
  };

  const variantClasses = {
    default: "bg-gradient-to-br from-slate-800/80 via-slate-900/70 to-slate-800/80",
    card: "bg-gradient-to-br from-slate-700/85 via-slate-800/80 to-slate-900/85",
    surface: "bg-gradient-to-br from-white/12 via-white/8 to-white/12",
    accent: "bg-gradient-to-br from-blue-900/80 via-purple-900/75 to-slate-900/80"
  };

  // Mobile navigation styling with reduced blur for better readability
  const isMobileNav = intensity === "mobile-nav";
  const mobileNavStyles = isMobileNav ? {
    background: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(8px) saturate(140%)",
    WebkitBackdropFilter: "blur(8px) saturate(140%)",
    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
    border: "1px solid rgba(255, 255, 255, 0.20)"
  } : {};

  const Component = animated ? motion.div : "div";
  
  return (
    <Component
      className={cn(
        "rounded-2xl relative overflow-hidden",
        "before:absolute before:inset-0 before:rounded-2xl",
        "before:bg-gradient-to-br before:from-white/8 before:via-transparent before:to-transparent",
        "before:opacity-40 before:pointer-events-none",
        intensityClasses[intensity],
        !isMobileNav && variantClasses[variant],
        !isMobileNav && "hover:bg-slate-700/90 hover:border-white/40 hover:shadow-2xl hover:shadow-black/40",
        "transition-all duration-300 ease-out",
        className
      )}
      style={mobileNavStyles}
      {...(animated && !isMobileNav && {
        whileHover: { scale: 1.01, y: -1 },
        whileTap: { scale: 0.99 },
        transition: { type: "spring", stiffness: 400, damping: 25 }
      })}
    >
      {/* Subtle background effects for mobile nav */}
      {isMobileNav ? (
        <div className="absolute inset-0 opacity-8 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-300/8 via-transparent to-purple-300/8" />
        </div>
      ) : (
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full animate-liquid-morph" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-400/15 to-transparent rounded-full animate-liquid-morph" style={{ animationDelay: '2s' }} />
        </div>
      )}
      
      {/* Content with minimal blur for better readability */}
      <div className={cn(
        "relative z-10"
      )}>
        {children}
      </div>
      
      {/* Minimal floating particles for mobile nav */}
      {animated && isMobileNav && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(1)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-0.5 bg-white/25 rounded-full"
              style={{
                left: `${50 + i * 15}%`,
                top: `${45 + i * 10}%`,
              }}
              animate={{
                y: [0, -6, 0],
                opacity: [0.25, 0.45, 0.25],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                delay: i * 1.2,
              }}
            />
          ))}
        </div>
      )}
      
      {/* Standard floating particles for other variants */}
      {animated && !isMobileNav && (
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