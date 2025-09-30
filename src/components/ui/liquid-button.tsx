import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface LiquidButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "accent" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const LiquidButton = forwardRef<HTMLButtonElement, LiquidButtonProps>(
  ({ children, className, variant = "primary", size = "md", disabled, onClick, type, ...rest }, ref) => {
    const variants = {
      primary: `
        bg-gradient-to-r from-blue-500/80 to-purple-500/80 backdrop-blur-xl
        border border-white/30 text-white shadow-lg shadow-blue-500/25
        hover:from-blue-400/90 hover:to-purple-400/90 hover:shadow-blue-500/40
        disabled:from-gray-500/50 disabled:to-gray-600/50 disabled:shadow-none
      `,
      secondary: `
        bg-white/10 backdrop-blur-xl border border-white/20 text-white
        hover:bg-white/20 hover:border-white/40 hover:shadow-lg hover:shadow-white/10
        disabled:bg-white/5 disabled:border-white/10 disabled:text-white/50
      `,
      accent: `
        bg-gradient-to-r from-pink-500/80 to-orange-500/80 backdrop-blur-xl
        border border-white/30 text-white shadow-lg shadow-pink-500/25
        hover:from-pink-400/90 hover:to-orange-400/90 hover:shadow-pink-500/40
        disabled:from-gray-500/50 disabled:to-gray-600/50 disabled:shadow-none
      `,
      ghost: `
        bg-transparent border border-white/10 text-white/80
        hover:bg-white/10 hover:border-white/20 hover:text-white
        disabled:border-white/5 disabled:text-white/30
      `
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg"
    };

    return (
      <motion.button
        ref={ref}
        type={type}
        onClick={onClick}
        className={cn(
          "relative overflow-hidden rounded-xl font-medium transition-all duration-300",
          "focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-0",
          "active:scale-95 disabled:cursor-not-allowed disabled:opacity-60",
          variants[variant],
          sizes[size],
          className
        )}
        whileHover={!disabled ? { scale: 1.02, y: -2 } : undefined}
        whileTap={!disabled ? { scale: 0.98 } : undefined}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        disabled={disabled}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
        
        {/* Liquid shimmer effect */}
        {!disabled && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6 }}
          />
        )}
        
        {/* Floating orb effect */}
        {!disabled && variant === "primary" && (
          <motion.div
            className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-blue-400/40 to-purple-400/40 rounded-full blur-sm"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </motion.button>
    );
  }
);

LiquidButton.displayName = "LiquidButton";