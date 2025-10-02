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
    "mobile-nav": "bg-slate-900/95 backdrop-blur-3xl border border-white/40 shadow-2xl shadow-black/60"
  };

  const variantClasses = {
    default: "bg-gradient-to-br from-slate-800/80 via-slate-900/70 to-slate-800/80",
    card: "bg-gradient-to-br from-slate-700/85 via-slate-800/80 to-slate-900/85",
    surface: "bg-gradient-to-br from-slate-900/98 via-slate-800/95 to-slate-900/98",
    accent: "bg-gradient-to-br from-blue-900/80 via-purple-900/75 to-slate-900/80"
  };

  // Enhanced mobile navigation styling
  const isMobileNav = intensity === "mobile-nav";
  const mobileNavStyles = isMobileNav ? {
    background: "linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.96) 50%, rgba(15, 23, 42, 0.98) 100%)",
    backdropFilter: "blur(24px) saturate(180%)",
    WebkitBackdropFilter: "blur(24px) saturate(180%)",
    boxShadow: "0 -4px 32px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
    borderTop: "1px solid rgba(255, 255, 255, 0.4)"
  } : {};

  const Component = animated ? motion.div : "div";
  
  return (
    <Component
      className={cn(
        "rounded-2xl shadow-xl shadow-black/30 relative overflow-hidden",
        "before:absolute before:inset-0 before:rounded-2xl",
        "before:bg-gradient-to-br before:from-white/10 before:via-transparent before:to-transparent",
        "before:opacity-40 before:pointer-events-none",
        intensityClasses[intensity],
        !isMobileNav && variantClasses[variant],
        !isMobileNav && "hover:bg-slate-700/90 hover:border-white/40 hover:shadow-2xl hover:shadow-black/40",
        "transition-all duration-300 ease-out",
        isMobileNav && "border-t border-white/40",
        className
      )}
      style={mobileNavStyles}
      {...(animated && !isMobileNav && {
        whileHover: { scale: 1.01, y: -1 },
        whileTap: { scale: 0.99 },
        transition: { type: "spring", stiffness: 400, damping: 25 }
      })}
    >
      {/* Enhanced liquid morphing background for mobile nav */}
      {isMobileNav ? (
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-transparent to-purple-500/20 animate-pulse" />
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-purple-400/8 to-transparent rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
      ) : (
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full animate-liquid-morph" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-400/15 to-transparent rounded-full animate-liquid-morph" style={{ animationDelay: '2s' }} />
        </div>
      )}
      
      {/* Content with enhanced contrast for mobile nav */}
      <div className={cn(
        "relative z-10",
        isMobileNav && "backdrop-blur-sm bg-black/10 rounded-2xl"
      )}>
        {children}
      </div>
      
      {/* Enhanced floating particles for mobile nav */}
      {animated && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(isMobileNav ? 3 : 2)].map((_, i) => (
            <motion.div
              key={i}
              className={cn(
                "absolute rounded-full",
                isMobileNav ? "w-1 h-1 bg-white/60" : "w-0.5 h-0.5 bg-white/40"
              )}
              style={{
                left: `${25 + i * 25}%`,
                top: `${30 + i * 20}%`,
              }}
              animate={{
                y: [0, isMobileNav ? -12 : -8, 0],
                opacity: [isMobileNav ? 0.6 : 0.4, isMobileNav ? 0.9 : 0.7, isMobileNav ? 0.6 : 0.4],
                scale: [1, isMobileNav ? 1.2 : 1.1, 1],
              }}
              transition={{
                duration: isMobileNav ? 5 : 4 + i,
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